/**
 * Gallery state lives in Data at one path. The helper holds only the root Data, its router and
 * that path; every read, write and registration resolves `<path>.<name>` at the time of use, so it
 * keeps following the state when a Bag above it is replaced.
 */
export class GalleryState {
    #data;
    #router;
    #path;

    /** `builder` is the page builder: its `data` is the root Data, its `binding.router` the Data router. */
    constructor(builder, path = 'galleryIndex') {
        if (typeof path !== 'string' || !path) throw new TypeError('Gallery state must be a Data path');
        this.#data = builder.data;
        this.#router = builder.binding.router;
        this.#path = path;
    }

    get data() { return this.#data; }
    get router() { return this.#router; }
    get path() { return this.#path; }

    /** The absolute Data path of `name` below the state. */
    address(name) { return `${this.path}.${name}`; }
    /** The node at `<path>.<name>`, for a synchronous use that does not keep it. */
    getNode(name) { return this.data.getNode(this.address(name)); }
    getItem(name) { return this.data.getItem(this.address(name)); }
    setItem(name, value) { this.data.setItem(this.address(name), value); }

    /** Deliver every Data change reaching `<path>.<name>` to `receive`; `close()` the result to stop. */
    watch(name, receive) {
        return this.router.register({path: this.address(name), recipient: {receive}});
    }
}
