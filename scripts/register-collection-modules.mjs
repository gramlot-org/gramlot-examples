/** Register the prepared collection import map in the two supported test runtimes. */
export async function registerCollectionModules(modules) {
    if (process.versions.bun) {
        const {mock} = await import('bun:test');
        for (const [name, url] of Object.entries(modules)) mock.module(name, () => import(url));
    } else {
        const {register} = await import('node:module');
        register(new URL('./prepared-collection-loader.mjs', import.meta.url), {data:modules});
    }
}
