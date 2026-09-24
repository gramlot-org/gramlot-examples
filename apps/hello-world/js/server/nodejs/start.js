#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import {startNativeServer} from 'gramlot-nodejs/native';

const app = await startNativeServer({
    pages: fileURLToPath(new URL('../../pages/', import.meta.url)),
    hostname: process.env.HOST ?? '127.0.0.1', port: Number(process.env.PORT ?? 8080),
});
console.log(app.url);
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await app.close(); process.exit(0); });
