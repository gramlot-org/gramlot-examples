/** Resolve prepared collection dependencies during gallery build and Node qualification. */
let modules;
export function initialize(data) { modules = data; }
export function resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith('@gramlot/collections/')) return nextResolve(specifier, context);
    if (!Object.hasOwn(modules,specifier)) throw new Error(`Undeclared gallery collection: ${specifier}`);
    return {url:modules[specifier],shortCircuit:true};
}
