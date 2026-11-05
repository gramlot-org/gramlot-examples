"""Live system dashboard. See system_analysis.md for the guided walkthrough."""
import asyncio
from threading import get_ident
from urllib.parse import quote
from collections import deque
from datetime import datetime, timezone
from time import monotonic, perf_counter

import psutil
from genro_bag import Bag
from gramlot import Page as BasePage, PageStore as BasePageStore

STORES = ('interfaces', 'cores', 'processes', 'cpu_history',
          'memory_history', 'disk_history', 'network_history', 'memory_usage',
          'swap_usage', 'disk_usage', 'process_memory')


ICONS = {
    name: 'data:image/svg+xml,' + quote(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
        f'<path fill="#7c899c" d="{path}"/></svg>', safe='')
    for name, path in [('Play', 'M7 4v16l14-8z'), ('Stop', 'M5 5h14v14H5z')]
}


class Page(BasePage):
    title = 'System monitor'
    panels = [('cores', 'CPU cores'), ('memory', 'Memory'), ('processes', 'Processes'),
              ('network', 'Network activity'), ('cpu', 'CPU history'), ('disk', 'Disk activity'),
              ('capacity', 'Disk capacity'), ('interfaces', 'Interfaces'),
              ('memory_history', 'Memory history'), ('process_memory', 'Process memory')]

    readings = {
        'cores': ('cpu_times',), 'cpu': ('cpu_times',),
        'memory': ('virtual_memory', 'swap_memory'),
        'memory_history': ('virtual_memory', 'swap_memory'),
        'processes': ('process_iter',), 'process_memory': ('process_iter',),
        'network': ('net_io_counters',), 'interfaces': ('net_io_counters',),
        'disk': ('disk_io_counters',), 'capacity': ('disk_partitions', 'disk_usage'),
    }

    def main(self, root):
        pane = root.main(datapath='monitor', padding='12px 20px')
        self.setup_data(pane)
        self.header(pane)
        frames = self.floating_panels(pane)
        self.cpu_panel(frames['cores'])
        self.memory_panel(frames['memory'])
        self.processes_panel(frames['processes'])
        self.process_memory_panel(frames['process_memory'])
        self.history_panels(frames)
        self.capacity_panel(frames['capacity'])
        self.network_table(frames['interfaces'])

    def setup_data(self, pane):
        pane.dataSetter('.metrics', Bag({name: Bag() for name in STORES}))
        for name in ('control', 'metrics', 'error'):
            pane.dataBinder('.' + name, name)

    def header(self, pane):
        pane.h2(self.title, margin='0 0 8px')
        bar = pane.menu(presentation='bar', label='Sampling controls', iconSize=20,
                        labelPosition='tooltip', padding='4px 8px', background='var(--gramlot-surface-subtle)')
        for caption, running in [('Play', True), ('Stop', False)]:
            bar.menuline(caption=caption, tooltip=f'{caption} sampling', iconSrc=ICONS[caption],
                         disabled='^.control.running' if running else '^.control.running:={} === false', action=f"this.SET('.control.running', {str(running).lower()})")
        controls = bar.menuline(group=True, gap='8px')
        controls.span('Tick every')
        selector = controls.select(value='^.control.interval', width='80px', label='Sampling interval')
        for value in ('0.1', '0.25', '0.5', '1'):
            selector.option(f'{value} s', value=value)
        controls.span('History')
        selector = controls.select(value='^.control.window', width='110px', label='History duration')
        for value, label in [('60', '1 minute'), ('300', '5 minutes'), ('900', '15 minutes')]:
            selector.option(label, value=value)
        menu = bar.menuline(caption='Add panel', labelPosition='after').menu()
        for index, (key, title) in enumerate(self.panels):
            menu.menuline(caption=title, checked=f'^.control.panels.{key}', action=f"this.SET('.control.panels.{key}', true)")
        bar.spacer(flex=1)
        status = bar.menuline(group=True, gap='8px')
        status.span('^.metrics.samples', mask='Readings: {}', id='monitor-samples')
        status.span('^.metrics.collection_ms', mask='Collection: {} ms')
        status.span('^.metrics.updated')
        pane.div('^.error', role='alert')
        pane.p('Move, resize or maximize panels. Reopen them from Add panel.', margin='8px 0')

    def floating_panels(self, pane):
        frames = {}
        for index, (key, title) in enumerate(self.panels):
            window = pane.floatingPane(
                id=f'monitor-window-{key}', title=title, open=f'^.control.panels.{key}',
                left='16px' if index % 2 == 0 else 'calc(50vw + 4px)',
                top='150px' if index % 4 < 2 else 'calc(50vh + 70px)',
                width='calc(50vw - 24px)', height='max(300px, calc(50vh - 90px))',
                movable=True, resizable=True, maximizable=True, collapsible=True)
            window.frame.center.set_attr(display='flex', flex_direction='column',
                                         min_height=0, min_width=0, overflow='hidden')
            frames[key] = window.frame
        return frames

    def cpu_panel(self, frame):
        self.chart(frame.center, 'cores', 'stackedBar', 'core',
                   [('active', 'Active', '#5470c6'), ('idle', 'Idle', '#dce3ed')])
        frame.bottom.div('^.metrics.cpu_text', padding='4px 8px',
                         mask='Total CPU: {} · logical cores · active + idle = 100%')

    def memory_panel(self, frame):
        frame.top.div('RAM / Swap', padding='4px 8px')
        row = frame.center.div(display='flex', flex=1, min_height=0)
        for store, color in [('memory_usage', '#3ba272'), ('swap_usage', '#ee6666')]:
            self.chart(row.div(flex=1, min_width=0), store, 'donut', 'kind', [('gib', 'GiB', color)])
        footer = frame.bottom.div(display='flex', gap='16px', padding='4px 8px')
        footer.span('^.metrics.ram_text', mask='RAM: {}')
        footer.span('^.metrics.swap_text', mask='Swap: {}')

    def processes_panel(self, frame):
        self.table(frame.center, 'processes', [
            ('pid', 'PID', '12%', 'L'), ('name', 'Process', '36%', 'T'), ('cpu', 'CPU %', '16%', 'N'),
            ('memory_mib', 'RAM MiB', '18%', 'N'), ('state', 'State', '18%', 'T')])
        frame.bottom.div('^.metrics.process_status', padding='4px 8px')

    def process_memory_panel(self, frame):
        toolbar = frame.top.menu(presentation='bar', label='Process memory controls', padding='4px 8px')
        controls = toolbar.menuline(group=True, gap='8px')
        controls.span('Largest processes')
        selector = controls.select(value='^.control.process_limit', width='100px', label='Process count')
        for value, label in [('10', '10'), ('20', '20'), ('50', '50'), ('0', 'All')]:
            selector.option(label, value=value)
        self.chart(frame.center, 'process_memory', 'horizontalBar', 'process',
                   [('memory_mib', 'Resident memory MiB', '#3ba272')])
        frame.bottom.div('RSS may count shared pages repeatedly. The process grid remains complete.', padding='4px 8px')

    def history_panels(self, frames):
        series = [('cpu', [('cpu', 'CPU %', '#5470c6')]),
                  ('memory', [('ram', 'RAM %', '#3ba272'), ('swap', 'Swap %', '#ee6666')]),
                  ('disk', [('read_mib', 'Read MiB/s', '#5470c6'), ('write_mib', 'Write MiB/s', '#ee6666')]),
                  ('network', [('download_kib', 'Received KiB/s', '#5470c6'), ('upload_kib', 'Sent KiB/s', '#ee6666')])]
        for key, fields in series:
            frame = frames['memory_history' if key == 'memory' else key]
            self.chart(frame.center, f'{key}_history', 'line', 'seconds', fields, engine='uplot')
        frames['network'].bottom.div('All interfaces, including loopback. Rates per second.', padding='4px 8px')
        frames['disk'].bottom.div('^.metrics.disk_status', padding='4px 8px')

    def capacity_panel(self, frame):
        self.chart(frame.center, 'disk_usage', 'stackedBar', 'mount',
                   [('used', 'Used GiB', '#5470c6'), ('free', 'Free GiB', '#dce3ed')])
        frame.bottom.div('Per mount point. Shared volumes are not summed.', padding='4px 8px')

    def network_table(self, frame):
        self.table(frame.center, 'interfaces', [
            ('interface', 'Interface', '20%', 'T'), ('download_kib', 'In KiB/s', '20%', 'N'),
            ('upload_kib', 'Out KiB/s', '20%', 'N'), ('packets_received', 'Packets in/s', '20%', 'N'),
            ('packets_sent', 'Packets out/s', '20%', 'N')])

    def chart(self, parent, key, chart_type, category, fields, engine='echarts'):
        # fields contains (code, caption, color); all numeric work belongs to the host.
        options = Bag()
        for field, caption, color in fields:
            options.set_item(field, Bag(dict(selected=True, caption=caption, color=color, axis='left')))
        parent.dataSetter(f'.options.{key}', options)
        parent.chartView(id=f'monitor-{key}', engine=engine, chartType=chart_type, captionField=category,
                         storepath=f'.metrics.{key}', rowMode='attributes', seriesOptions=f'^.options.{key}',
                         valueFields=','.join(field for field, _, _ in fields),
                         flex=1, min_height=0, min_width=0, height='100%')

    def table(self, parent, key, fields):
        frame = parent.frameGrid(storepath=f'.metrics.{key}', rowMode='attributes', searchOn=True,
                                 flex=1, min_height=0, min_width=0)
        frame.grid.set_attr(id=f'monitor-{key}-grid', columnFilters=True)
        columns = frame.grid.struct()
        for field, label, width, dtype in fields:
            columns.column(field, name=label, width=width, dtype=dtype,
                           **({'format': '0.00'} if dtype == 'N' else {}))


class PageStore(BasePageStore):
    """An example-owned interval pulses Data; the controller visits one handler."""

    def __init__(self):
        super().__init__()
        self.task = None

    def main(self, root):
        panels = Bag({name: index < 4 for index, (name, _) in enumerate(Page.panels)})
        self.data.set_item('control', Bag(dict(running=True, interval='0.1', window='300',
                                             process_limit='20', panels=panels)))
        self.data.set_item('metrics', Bag({name: Bag() for name in STORES}))
        self.data.set_item('metrics.samples', 0)
        self.data.set_item('clock', Bag(dict(tick=0, index=0)))
        self.data.set_item('error', '')
        self.handler = PsutilHandler()
        names = dict.fromkeys(name for names in Page.readings.values() for name in names)
        self.readings = [(name, getattr(self.handler, 'psutil_' + name),
                          [panel for panel, names in Page.readings.items() if name in names])
                         for name in names]
        root.dataController(func='sample', tick='^clock.tick')

    def start(self):
        self.loop = asyncio.get_running_loop()
        self.thread = get_ident()
        super().start()
        self.task = self.loop.create_task(self.interval())

    async def interval(self):
        while True:
            interval = self.data['control.interval']
            if interval not in ('0.1', '0.25', '0.5', '1'):
                self.data.set_item('error', 'Invalid tick interval')
                self.data.set_item('control.running', False)
                return
            await asyncio.sleep(float(interval))
            self.pulse()

    def pulse(self):
        if not self._closed:
            self.data.set_item('clock.tick', self.data['clock.tick'] + 1)

    def on_loop(self, method, *args, **kwargs):
        # Binder callbacks may arrive from a host worker. All page Data stays
        # on the same event loop as the interval, without concurrent Bag writes.
        if get_ident() == self.thread:
            return method(*args, **kwargs)
        async def invoke():
            return method(*args, **kwargs)
        return asyncio.run_coroutine_threadsafe(invoke(), self.loop).result()

    def change(self, *args, **kwargs):
        return self.on_loop(super().change, *args, **kwargs)

    def subscribe(self, *args, **kwargs):
        return self.on_loop(super().subscribe, *args, **kwargs)

    def unsubscribe(self, *args, **kwargs):
        return self.on_loop(super().unsubscribe, *args, **kwargs)

    def sample(self, node, tick):
        index = self.data['clock.index']
        name, read, panels = self.readings[index]
        self.data.set_item('clock.index', (index + 1) % len(self.readings))
        control = self.data['control']
        if not control['running'] or not any(control[f'panels.{panel}'] for panel in panels):
            self.handler.previous.pop(name, None)
            if name == 'process_iter':
                self.handler.process_baselines.clear()
            return
        try:
            window, limit = int(control['window']), int(control['process_limit'])
            if window not in (60, 300, 900) or limit not in (0, 10, 20, 50):
                raise ValueError('Invalid history window or process limit')
            self.handler.process_limit = limit
            started = perf_counter()
            result = read()
            metrics = self.data['metrics']
            for item in result.nodes:
                if item.label.endswith('_history'):
                    history = metrics[item.label]
                    history.set_item(f'r{tick}', None, **item.value.nodes[0].attr)
                    cutoff = monotonic() - self.handler.started - window
                    while history and (history.nodes[0].attr['seconds'] < cutoff or len(history) > 1801):
                        history.pop_node(history.nodes[0].label)
                elif item.label == 'disk_usage':
                    for mount in item.value.nodes:
                        metrics['disk_usage'].set_item(mount.label, None, **mount.attr)
                else:
                    metrics.set_item(item.label, item.value)
            if name == 'disk_partitions':
                for mount in list(metrics['disk_usage'].nodes):
                    if mount.attr['mount'] not in self.handler.mounts:
                        metrics['disk_usage'].pop_node(mount.label)
            metrics.set_item('samples', metrics['samples'] + 1)
            metrics.set_item('reading', name)
            metrics.set_item('updated', datetime.now(timezone.utc).strftime('%H:%M:%S UTC'))
            metrics.set_item('collection_ms', round((perf_counter() - started) * 1000, 1))
            self.data.set_item('error', '')
        except Exception as error:
            self.data.set_item('error', f'{type(error).__name__}: {error}')
            self.data.set_item('control.running', False)

    def close(self):
        def finish():
            if self.task is not None:
                self.task.cancel()
            super(PageStore, self).close()
        self.on_loop(finish)


class PsutilHandler:
    """Each measurement returns a Bag; only the controller writes page Data."""

    def __init__(self):
        self.started = monotonic()
        self.previous = {}
        self.process_baselines = {}
        self.mounts = deque()
        self.memory = {}
        self.process_limit = 20

    def baseline(self, name, value):
        now = monotonic()
        previous, when = self.previous.get(name, (None, now))
        self.previous[name] = (value, now)
        return previous, now - when

    def history(self, bag, name, **values):
        if all(value is not None for value in values.values()):
            point = dict(seconds=round(monotonic() - self.started, 3), **values)
            bag.set_item(name, rows_bag([point]))

    def psutil_cpu_times(self):
        bag = Bag()
        current = [item._asdict() for item in psutil.cpu_times(percpu=True)]
        previous, _ = self.baseline('cpu_times', current)
        values = self.cpu_activity(current, previous)
        total = self.average_cpu(values)
        bag.set_item('cores', rows_bag([dict(core=f'CPU {i+1}', active=value, idle=100-value)
                                       for i, value in enumerate(values) if value is not None]))
        bag.set_item('cpu_text', 'Warming up' if total is None else f'{total:.1f}%')
        self.history(bag, 'cpu_history', cpu=total)
        return bag

    def psutil_virtual_memory(self):
        bag = Bag()
        memory = psutil.virtual_memory()
        bag.set_item('memory_usage', rows_bag([dict(kind='In use', gib=(memory.total-memory.available)/1024**3),
                                             dict(kind='Available', gib=memory.available/1024**3)]))
        self.memory['ram'] = memory.percent
        bag.set_item('ram_text', f'{(memory.total-memory.available)/1024**3:.1f} / {memory.total/1024**3:.1f} GiB')
        self.history(bag, 'memory_history', ram=memory.percent, swap=self.memory.get('swap'))
        return bag

    def psutil_swap_memory(self):
        bag = Bag()
        swap = psutil.swap_memory()
        bag.set_item('swap_usage', rows_bag([dict(kind='Used', gib=swap.used/1024**3),
                                           dict(kind='Free', gib=(swap.total-swap.used)/1024**3)]))
        self.memory['swap'] = swap.percent
        bag.set_item('swap_text', f'{swap.used/1024**3:.1f} / {swap.total/1024**3:.1f} GiB')
        self.history(bag, 'memory_history', ram=self.memory.get('ram'), swap=swap.percent)
        return bag

    def psutil_net_io_counters(self):
        bag = Bag()
        current = psutil.net_io_counters(pernic=True)
        previous, elapsed = self.baseline('net_io_counters', current)
        rows = self.network_activity(current, previous, elapsed)
        bag.set_item('interfaces', rows_bag(rows))
        totals = {}
        for name in ('download_kib', 'upload_kib'):
            values = [row[name] for row in rows]
            totals[name] = sum(values) if values and all(v is not None for v in values) else None
        self.history(bag, 'network_history', **totals)
        return bag

    def psutil_disk_io_counters(self):
        bag = Bag()
        current = psutil.disk_io_counters()
        previous, elapsed = self.baseline('disk_io_counters', current)
        bag.set_item('disk_status', '' if current else 'Disk I/O counters unavailable on this OS')
        rates = {}
        for counter, name in [('read_bytes', 'read_mib'), ('write_bytes', 'write_mib')]:
            rate = counter_rate(getattr(current, counter), getattr(previous, counter) if previous else None, elapsed) if current else None
            rates[name] = None if rate is None else rate / 1024**2
        self.history(bag, 'disk_history', **rates)
        return bag

    def psutil_disk_partitions(self):
        bag = Bag()
        mounts = {part.mountpoint for part in psutil.disk_partitions(all=False)}
        retained = [mount for mount in self.mounts if mount in mounts]
        self.mounts = deque(retained + sorted(mounts - set(retained)))
        return bag

    def psutil_disk_usage(self):
        bag = Bag()
        if not self.mounts:
            return bag
        mount = self.mounts[0]
        self.mounts.rotate(-1)
        try:
            usage = psutil.disk_usage(mount)
            bag.set_item('disk_usage', Bag())
            bag['disk_usage'].set_item(mount.encode().hex(), None, mount=mount,
                                      used=usage.used/1024**3, free=usage.free/1024**3)
        except (PermissionError, FileNotFoundError) as error:
            bag.set_item('disk_status', f'{mount}: {type(error).__name__}')
        return bag

    def psutil_process_iter(self):
        bag = Bag()
        _, elapsed = self.baseline('process_iter', None)
        rows, skipped = self.read_processes(elapsed)
        bag.set_item('processes', rows_bag(rows))
        ranking = sorted(rows, key=lambda row: row['memory_mib'], reverse=True)
        if self.process_limit:
            ranking = ranking[:self.process_limit]
        bag.set_item('process_memory', rows_bag([dict(process=f"{row['name']} ({row['pid']})",
                                                     memory_mib=row['memory_mib']) for row in ranking]))
        bag.set_item('process_status', f'{len(rows)} processes · {skipped} inaccessible or exited · CPU 100% = one logical core')
        return bag

    @staticmethod
    def cpu_activity(cpu, previous):
        """First samples and invalid counter deltas remain unknown, never fake zeros."""
        values = []
        for index, times in enumerate(cpu):
            prior = previous[index] if previous is not None and len(previous) == len(cpu) else None
            percent = None
            if prior:
                total = sum(value for name, value in times.items() if name not in ('guest', 'guest_nice'))
                old_total = sum(value for name, value in prior.items() if name not in ('guest', 'guest_nice'))
                idle = times['idle'] + times.get('iowait', 0)
                old_idle = prior['idle'] + prior.get('iowait', 0)
                delta, idle_delta = total - old_total, idle - old_idle
                if delta > 0 and 0 <= idle_delta <= delta:
                    percent = 100 * (delta - idle_delta) / delta
            values.append(percent)
        return values

    @staticmethod
    def average_cpu(values):
        if not values or any(value is None for value in values):
            return None
        return sum(values) / len(values)

    @staticmethod
    def network_activity(network, previous_network, elapsed):
        interfaces = []
        for name, current in sorted(network.items()):
            previous = previous_network.get(name) if previous_network is not None else None
            row = dict(interface=name, sent_bytes=current.bytes_sent, received_bytes=current.bytes_recv,
                       errors_in=current.errin, errors_out=current.errout, drops_in=current.dropin)
            for counter, field, divisor in [('bytes_sent', 'upload_kib', 1024), ('bytes_recv', 'download_kib', 1024),
                                            ('packets_sent', 'packets_sent', 1), ('packets_recv', 'packets_received', 1)]:
                rate = counter_rate(getattr(current, counter), getattr(previous, counter) if previous else None, elapsed)
                row[field] = None if rate is None else rate / divisor
            interfaces.append(row)
        return interfaces

    def read_processes(self, elapsed):
        rows, baselines, skipped = [], {}, 0
        attrs = ['pid', 'create_time', 'cpu_times', 'name', 'status', 'memory_info']
        for process in psutil.process_iter(attrs, ad_value=None):
            info = process.info
            if any(info[name] is None for name in attrs):
                skipped += 1
                continue
            identity = (info['pid'], info['create_time'])
            seconds = info['cpu_times'].user + info['cpu_times'].system
            rate = counter_rate(seconds, self.process_baselines.get(identity), elapsed)
            baselines[identity] = seconds
            rows.append(dict(pid=info['pid'], name=info['name'], state=info['status'],
                             cpu=None if rate is None else rate * 100,
                             memory_mib=info['memory_info'].rss / 1024**2))
        self.process_baselines = baselines
        rows.sort(key=lambda row: row['cpu'] if row['cpu'] is not None else -1, reverse=True)
        return rows, skipped


def counter_rate(current, previous, seconds):
    if previous is None or seconds <= 0 or current < previous:
        return None
    return (current - previous) / seconds


def rows_bag(rows):
    result = Bag()
    for index, row in enumerate(rows):
        result.set_item(f'r{index}', None, **row)
    return result
