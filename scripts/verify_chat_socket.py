"""Check a running chat trial through the actual HTTP bootstrap and WebSocket."""
import argparse
import asyncio
import json
import re
from urllib.request import urlopen
from urllib.parse import urlsplit
from websockets.asyncio.client import connect
from genro_bag import Bag
from genro_tytx import from_tytx, to_tytx


async def main(url, model, effort):
    with urlopen(url) as response:
        html = response.read().decode()
        cookie = response.headers['Set-Cookie'].split(';', 1)[0]
    config = json.loads(re.search(r'new PageBootstrap\((.+)\)\.run', html).group(1))['config']
    page_id = config['pageId']
    parsed = urlsplit(url)
    async with connect(f'ws://{parsed.netloc}/gramlot/store?pageId={page_id}',
                       origin=f'http://{parsed.netloc}', additional_headers={'Cookie': cookie}) as socket:
        async def send(**message):
            await socket.send(to_tytx(dict(pageId=page_id, **message)))
        async def receive():
            return from_tytx(await asyncio.wait_for(socket.recv(), 140))
        await send(op='subscribe', binderId='initial', path='chats.main')
        initial = await receive()
        assert initial['op'] == 'snapshot' and isinstance(initial['value'], Bag)
        assert len(initial['value'].get_item('messages')) == 0
        await send(op='subscribe', binderId='settings', path='settings')
        settings = (await receive())['value']
        settings.set_item('model', model); settings.set_item('effort', effort)
        await send(op='change', binderId='settings', path='', evt='upd_value', value=settings, attr={})
        for request, text in [('first', 'The project is called Juniper. Reply OK only.'), ('second', 'What is the project called? Reply with its name only.')]:
            await send(op='change', binderId='initial', path='request', evt='upd_value', attr={},
                       value=Bag(dict(id=request, action='send', text=text, attachments=Bag())))
            events = []
            while True:
                event = await receive(); events.append(event)
                if event.get('op') == 'change' and event.get('path') == 'response':
                    assert event['value'].get_item('id') == request
                    assert event['value'].get_item('accepted') is True
                    break
            assert any(event.get('path') == 'feedback' and event['value'] for event in events)
        await send(op='subscribe', binderId='verification', path='chats.main')
        conversation = (await receive())['value']
        assert 'Juniper' in conversation.get_item('messages').nodes[-1].value
        assert len(conversation.get_item('messages')) == 4
    print('WebSocket: bootstrap, snapshot, two Data requests, feedback, server context and correlated responses passed.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__ + ' Makes two paid Anthropic requests.')
    parser.add_argument('--url', default='http://127.0.0.1:8772/')
    parser.add_argument('--model', required=True)
    parser.add_argument('--effort', default='default')
    args = parser.parse_args()
    asyncio.run(main(args.url, args.model, args.effort))
