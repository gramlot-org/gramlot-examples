import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createInterface} from 'node:readline';
import {fileURLToPath, pathToFileURL} from 'node:url';
import test from 'node:test';

const ROUTES = {
    index: new URL('../page.js', import.meta.url),
    e01: new URL('../../pages/html_svg/01_hello_world.js', import.meta.url),
};

/** Stage the JavaScript pages folder as `serve.py` does: one wrapper module per route. */
async function stage(directory) {
    await mkdir(join(directory, 'js'));
    await writeFile(join(directory, 'package.json'), '{"type":"module"}\n');
    for (const [route, page] of Object.entries(ROUTES)) {
        await writeFile(join(directory, 'js', `${route}.js`), `export {Page} from ${JSON.stringify(page.href)};\n`);
    }
}

test('the Node example host serves the runner and an example page under /js', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'gramlot-runner-test-'));
    await stage(directory);
    const server = spawn(process.execPath, [fileURLToPath(new URL('../server.mjs', import.meta.url))], {
        env: {...process.env, GRAMLOT_RUNNER_PAGES: pathToFileURL(directory).href},
        stdio: ['ignore', 'pipe', 'inherit'],
    });
    try {
        const [url] = await once(createInterface({input: server.stdout}), 'line');
        assert.match(url, /^http:\/\/127\.0\.0\.1:\d+$/);
        for (const [route, title] of [['index', 'Gramlot examples'], ['e01', 'Hello, Gramlot']]) {
            const response = await fetch(`${url}/js/${route}`);
            assert.equal(response.status, 200, route);
            assert.match(await response.text(), new RegExp(`<title>${title}</title>`), route);
        }
    } finally {
        server.kill('SIGTERM');
        await once(server, 'exit');
        await rm(directory, {recursive: true, force: true});
    }
});
