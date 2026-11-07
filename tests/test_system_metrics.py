"""Example-owned interval, circular readers and Bag results."""
import asyncio
from collections import namedtuple
from types import SimpleNamespace
from unittest.mock import patch
from importlib import import_module
import pytest
from genro_bag import Bag
module = import_module('gramlot_examples.base.pages.10-realtime.system_analysis')
PageStore, PsutilHandler, counter_rate = module.PageStore, module.PsutilHandler, module.counter_rate

CPU = namedtuple("CPU", "user system idle")
Net = namedtuple(
    "Net", "bytes_sent bytes_recv packets_sent packets_recv errin errout dropin"
)
Disk = namedtuple("Disk", "read_bytes write_bytes")


@pytest.fixture
def machine():

    values = dict(time=0, tick=0)
    with (
        patch.object(module, "monotonic", side_effect=lambda: values["time"]),
        patch.object(
            module.psutil,
            "cpu_times",
            side_effect=lambda **kw: [CPU(10 + values["tick"], 5, 85 + values["tick"])],
        ),
        patch.object(
            module.psutil,
            "net_io_counters",
            side_effect=lambda **kw: {
                "eth0": Net(
                    1024 * values["tick"],
                    2048 * values["tick"],
                    values["tick"],
                    2 * values["tick"],
                    0,
                    0,
                    0,
                )
            },
        ),
        patch.object(
            module.psutil,
            "disk_io_counters",
            side_effect=lambda: Disk(1048576 * values["tick"], 0),
        ),
        patch.object(
            module.psutil,
            "virtual_memory",
            return_value=SimpleNamespace(used=80, available=100, total=200, percent=50),
        ),
        patch.object(
            module.psutil,
            "swap_memory",
            return_value=SimpleNamespace(used=0, total=200, percent=0),
        ),
        patch.object(module.psutil, "disk_partitions", return_value=[]),
        patch.object(module.psutil, "process_iter", return_value=[]),
    ):
        yield values


def test_readers_return_bags_and_rates_use_their_own_baseline(machine):
    h = PsutilHandler()
    first = h.psutil_cpu_times()
    assert isinstance(first, Bag)
    assert first.get_node('cpu_history') is None
    machine.update(time=2, tick=2)
    second = h.psutil_cpu_times()
    assert second['cores'].nodes[0].attr['active'] == 50
    assert len(first['cores']) == 0
    assert h.psutil_net_io_counters().get_node('network_history') is None
    machine.update(time=4, tick=4)
    assert h.psutil_net_io_counters()['network_history'].nodes[0].attr['download_kib'] == 2
    assert counter_rate(3, 4, 1) is None
    assert counter_rate(4, 3, 0) is None


@pytest.mark.asyncio
async def test_fixed_ring_visits_one_position_even_if_disabled(machine):
    page = PageStore(); page.start(); page.task.cancel()
    try:
        names = [name for name, _, _ in page.readings]
        assert len(names) == len(set(names))
        for panel, _ in module.Page.panels:
            page.data.set_item('control.panels.' + panel, False)
        page.data.set_item('control.panels.memory', True)
        for index, name in enumerate(names):
            before = page.data['metrics.samples']
            page.pulse()
            assert page.data['clock.index'] == (index + 1) % len(names)
            assert page.data['metrics.samples'] == before + (name in ('virtual_memory', 'swap_memory'))
        module.psutil.cpu_times.assert_not_called()
        assert module.psutil.virtual_memory.call_count == 1
        assert module.psutil.swap_memory.call_count == 1
        page.data.set_item('control.running', False)
        for _ in names: page.pulse()
        assert page.data['metrics.samples'] == 2
        assert page.data['clock.index'] == 0
        page.data.set_item('control.running', True)
        for _ in names: page.pulse()
        assert page.data['metrics.samples'] == 4
    finally:
        page.close(); await asyncio.sleep(0)


@pytest.mark.asyncio
async def test_controller_updates_existing_data_and_history(machine):
    page = PageStore(); page.start(); page.task.cancel()
    try:
        metrics = page.data['metrics']; history = metrics['cpu_history']
        for i in range(3):
            machine.update(time=i, tick=i)
            for _ in page.readings: page.pulse()
        assert page.data['metrics'] is metrics
        assert metrics['cpu_history'] is history
        assert len(history) == 2
        machine.update(time=400, tick=400)
        page.pulse()
        assert len(history) == 1
        assert page.data['error'] == ''
    finally:
        page.close(); await asyncio.sleep(0)


@pytest.mark.asyncio
async def test_interval_runs_without_client_and_closes(machine):
    page = PageStore(); page.start()
    await asyncio.sleep(.23)
    assert page.data['clock.tick'] >= 2
    assert page.data['metrics.samples'] >= 2
    # The host calls binders from a worker: they must be serialized on this loop.
    await asyncio.to_thread(page.subscribe, 'controls', 'control', lambda message: None)
    await asyncio.to_thread(page.change, 'controls', dict(path='running', evt='upd_value', value=False, attr={}))
    count = page.data['metrics.samples']
    await asyncio.sleep(.15)
    assert page.data['metrics.samples'] == count
    await asyncio.to_thread(page.close)
    tick = page.data['clock.tick']
    await asyncio.sleep(.12)
    assert page.task.cancelled()
    assert page.data['clock.tick'] == tick


@pytest.mark.asyncio
async def test_store_started_in_a_worker_thread_runs_its_own_loop(machine):
    # Kajenn runs synchronous store code in a worker thread without an event loop.
    page = PageStore()
    await asyncio.to_thread(page.start)
    assert page.loop_thread.is_alive() and page.loop is not asyncio.get_running_loop()
    await asyncio.sleep(.23)
    assert page.data['clock.tick'] >= 2
    assert page.data['metrics.samples'] >= 2
    messages = []
    await asyncio.to_thread(page.subscribe, 'controls', 'control', messages.append)
    assert len(messages) == 1
    await asyncio.to_thread(page.change, 'controls', dict(path='running', evt='upd_value', value=False, attr={}))
    count = page.data['metrics.samples']
    await asyncio.sleep(.15)
    assert page.data['metrics.samples'] == count
    # The server loop may close the page: close() does not wait for the store loop.
    page.close()
    await asyncio.to_thread(page.loop_thread.join, 2)
    assert not page.loop_thread.is_alive()
    assert page.task.cancelled() and page.loop.is_closed()
    tick = page.data['clock.tick']
    await asyncio.sleep(.12)
    assert page.data['clock.tick'] == tick
    with pytest.raises(RuntimeError, match='closed'):
        await asyncio.to_thread(page.change, 'controls', dict(path='running', evt='upd_value', value=True, attr={}))
    assert await asyncio.to_thread(page.unsubscribe, 'controls') is None
    page.close()


def test_close_after_a_failed_start():
    page = PageStore()
    with patch.object(module, 'PsutilHandler', side_effect=RuntimeError('no psutil')):
        with pytest.raises(RuntimeError, match='no psutil'):
            page.start()
    assert page.loop is None and page._closed
    page.close()


@pytest.mark.asyncio
async def test_failure_stops_and_restart_reaches_next_handler(machine):
    page = PageStore(); page.start(); page.task.cancel()
    try:
        with patch.object(module.psutil, 'cpu_times', side_effect=RuntimeError('unavailable')):
            page.pulse()
        assert page.data['control.running'] is False
        assert 'unavailable' in page.data['error']
        page.data.set_item('control.running', True)
        page.pulse()
        assert page.data['metrics.reading'] == 'virtual_memory'
        assert page.data['error'] == ''
    finally:
        page.close(); await asyncio.sleep(0)


def test_process_pid_reuse_and_ranking(machine):
    def processes(*args, **kwargs):
        return [SimpleNamespace(info=dict(pid=i, create_time=machine.get('created', 1),
            cpu_times=SimpleNamespace(user=machine['tick'], system=0), name=f'worker{i}',
            status='running', memory_info=SimpleNamespace(rss=i*1048576))) for i in range(30)]
    with patch.object(module.psutil, 'process_iter', side_effect=processes):
        h = PsutilHandler(); h.process_limit = 10
        first = h.psutil_process_iter()
        assert len(first['processes']) == 30 and len(first['process_memory']) == 10
        machine.update(time=2, tick=3)
        assert h.psutil_process_iter()['processes'].nodes[0].attr['cpu'] == 150
        machine.update(time=3, tick=0, created=2)
        assert h.psutil_process_iter()['processes'].nodes[0].attr.get('cpu') is None


def test_mount_reads_return_separate_bags(machine):
    with patch.object(module.psutil, 'disk_partitions', return_value=[SimpleNamespace(mountpoint='/a.b'), SimpleNamespace(mountpoint='/c')]), patch.object(module.psutil, 'disk_usage', return_value=SimpleNamespace(used=1, free=2)) as usage:
        h = PsutilHandler()
        assert isinstance(h.psutil_disk_partitions(), Bag)
        usage.assert_not_called()
        first, second = h.psutil_disk_usage(), h.psutil_disk_usage()
        assert usage.call_count == 2
        assert first['disk_usage'].nodes[0].attr['mount'] != second['disk_usage'].nodes[0].attr['mount']


def test_page_contains_store_and_collector_and_gallery_shows_entire_module():
    from pathlib import Path
    from gramlot.server import GramlotFileServer
    from gramlot_examples.gallery.page import Page as GalleryPage

    source = Path(module.__file__)
    server = GramlotFileServer(source.parent)
    page_class = server.resolve_page(source.stem)
    assert server.resolve_page_store(page_class).__name__ == 'PageStore'
    gallery = GalleryPage()
    gallery.gallery_item = lambda key: {'path': source.parent, 'folder': source.stem}
    content = gallery.source_document('monitor')['content']
    assert content == source.read_text()
    assert 'class PageStore(BasePageStore):' in content
    assert 'class PsutilHandler:' in content
    assert 'gramlot_py_server' not in content
