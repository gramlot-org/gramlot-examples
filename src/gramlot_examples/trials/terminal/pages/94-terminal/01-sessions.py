"""A terminal connected to @terminal sessions of the PageStore: echo, and a local shell in development."""
import asyncio
import fcntl
import ipaddress
import os
import signal
import struct
import subprocess
import sys
import termios
from urllib.parse import urlsplit

from gramlot import Page as BasePage, PageStore as BasePageStore
from gramlot.page import terminal
from gramlot.server.assets import gramlot_dev

LOCAL_HOSTS = {'localhost', '127.0.0.1', '::1'}
# Run by a fresh Python in the shell's new session: the pty becomes its controlling terminal (Ctrl-C,
# job control), then the shell replaces it. The server forks no Python code of its own.
TAKE_TERMINAL = ('import fcntl, os, sys, termios; fcntl.ioctl(0, termios.TIOCSCTTY, 0); '
                 'os.execvp(sys.argv[1], sys.argv[1:])')


def loopback(address):
    """True for a loopback IP address; ``None`` or a non-IP peer (a Unix socket) is not one."""
    try:
        return ipaddress.ip_address(address).is_loopback
    except ValueError:
        return False


def stop(process, fd):
    """End the shell's session: SIGHUP, SIGKILL after 2 s, then close the pty. Runs in a thread, so a
    cancellation of the session cannot interrupt it."""
    try:
        os.killpg(process.pid, signal.SIGHUP)
        try:
            process.wait(2)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()
    except ProcessLookupError:
        process.wait()
    finally:
        os.close(fd)


class Page(BasePage):

    def main(self, root):
        pane = root.div(datapath='terminal', display='flex', flex_direction='column', gap='8px',
                        padding='12px', height='100dvh', box_sizing='border-box')
        bar = pane.div(display='flex', gap='16px', align_items='center')
        bar.strong('Echo session')
        bar.span('^.echo.connected', mask='Connected: {}')
        bar.span('^.echo.columns', mask='{} columns')
        bar.span('^.echo.rows', mask='{} rows')
        pane.terminal(session='echo', connected='^.echo.connected', rows='^.echo.rows',
                      columns='^.echo.columns', height='180px')
        if gramlot_dev():
            pane.strong('Local shell (development only)')
            pane.terminal(session='shell', connected='^.shell.connected', flex='1', min_height='240px')
        else:
            pane.p('The local shell is available only on a development server (GRAMLOT_DEV set).')


class PageStore(BasePageStore):

    @terminal
    async def echo(self, session):
        await session.write(b'Echo session. Type and press Enter.\r\n')
        while data := await session.read():
            await session.write(data.replace(b'\r', b'\r\n'))

    @terminal
    async def shell(self, session):
        if not gramlot_dev():
            await session.write(b'The local shell is available only on a development server.\r\n')
            return
        # The peer must be this machine: the Host header alone is the client's word.
        if not loopback(session.client):
            await session.write(b'The local shell answers only a connection from this machine.\r\n')
            return
        # Origin == Host holds under DNS rebinding too: the shell answers only a page opened as localhost.
        if session.host is None or urlsplit('//' + session.host).hostname not in LOCAL_HOSTS:
            await session.write(b'The local shell answers only a page opened at localhost or 127.0.0.1.\r\n')
            return
        fd, child = os.openpty()
        shell = os.environ.get('SHELL', '/bin/sh')
        try:
            process = subprocess.Popen([sys.executable, '-I', '-c', TAKE_TERMINAL, shell],
                                       stdin=child, stdout=child, stderr=child, start_new_session=True,
                                       env={**os.environ, 'TERM': 'xterm-256color'})
        except BaseException:
            os.close(fd)
            raise
        finally:
            os.close(child)
        os.set_blocking(fd, False)
        loop = asyncio.get_running_loop()

        async def ready(add, remove):
            event = asyncio.Event()
            add(fd, event.set)
            try:
                await event.wait()
            finally:
                remove(fd)

        async def output():
            # The pty is not watched while write waits: a slow screen stops reading the shell.
            while True:
                await ready(loop.add_reader, loop.remove_reader)
                try:
                    data = os.read(fd, 65536)
                except BlockingIOError:
                    continue
                except OSError:
                    return
                if not data:
                    return
                await session.write(data)

        async def input():
            while data := await session.read():
                view = memoryview(data)
                while view:
                    try:
                        view = view[os.write(fd, view):]
                    except BlockingIOError:
                        await ready(loop.add_writer, loop.remove_writer)

        async def resize():
            while (size := await session.resized()) is not None:
                fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', size[0], size[1], 0, 0))

        tasks = [asyncio.ensure_future(task()) for task in (output, input, resize)]
        try:
            await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        finally:
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)
            await asyncio.shield(asyncio.to_thread(stop, process, fd))
