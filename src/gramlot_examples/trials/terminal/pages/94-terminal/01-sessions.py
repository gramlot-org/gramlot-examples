"""A terminal connected to @terminal sessions of the PageStore: echo, and a local shell in development."""
import asyncio
import fcntl
import os
import pty
import signal
import struct
import termios
from urllib.parse import urlsplit

from gramlot import Page as BasePage, PageStore as BasePageStore
from gramlot.page import terminal
from gramlot.server.assets import gramlot_dev

LOCAL_HOSTS = {'localhost', '127.0.0.1', '::1'}


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
        # Origin == Host holds under DNS rebinding too: the shell answers only a page opened as localhost.
        if session.host is None or urlsplit('//' + session.host).hostname not in LOCAL_HOSTS:
            await session.write(b'The local shell answers only a page opened at localhost or 127.0.0.1.\r\n')
            return
        pid, fd = pty.fork()
        if pid == 0:
            try:
                os.environ['TERM'] = 'xterm-256color'
                shell = os.environ.get('SHELL', '/bin/sh')
                os.execvp(shell, [shell])
            finally:
                os._exit(127)
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
            try:
                os.kill(pid, signal.SIGHUP)
                for _ in range(20):
                    if os.waitpid(pid, os.WNOHANG)[0]:
                        break
                    await asyncio.sleep(0.1)
                else:
                    os.kill(pid, signal.SIGKILL)
                    os.waitpid(pid, 0)
            finally:
                os.close(fd)
