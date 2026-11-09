"""A terminal connected to @terminal sessions of the PageStore: echo, and a local shell in development."""
import asyncio
import fcntl
import os
import pty
import signal
import struct
import termios

from gramlot import Page as BasePage, PageStore as BasePageStore
from gramlot.page import terminal
from gramlot.server.assets import gramlot_dev


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
        pid, fd = pty.fork()
        if pid == 0:
            os.environ['TERM'] = 'xterm-256color'
            os.execvp(os.environ.get('SHELL', '/bin/sh'), [os.environ.get('SHELL', '/bin/sh')])
        loop = asyncio.get_running_loop()

        async def output():
            # The next read starts only after write returns: a slow screen stops reading the pty.
            while True:
                try:
                    data = await loop.run_in_executor(None, os.read, fd, 65536)
                except OSError:
                    return
                if not data:
                    return
                await session.write(data)

        async def input():
            while data := await session.read():
                os.write(fd, data)

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
            os.kill(pid, signal.SIGHUP)
            os.close(fd)
            await loop.run_in_executor(None, os.waitpid, pid, 0)
