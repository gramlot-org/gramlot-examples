var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// collection-authoring:@gramlot/gramlot/components
var components_exports = {};
__export(components_exports, {
  defineCollection: () => defineCollection
});
__reExport(components_exports, components_star);
import * as components_star from "@gramlot/gramlot/components";
import { defineCollection as create } from "@gramlot/gramlot/components";
function defineCollection(options) {
  if (options.name !== "menu-trial") throw new Error("Unexpected bundled collection");
  const css = [], assets = {};
  options.css?.forEach((url, index) => {
    url.href = css[index].href;
  });
  for (const [key, url] of Object.entries(options.assets ?? {})) url.href = assets[key].href;
  return create({ ...options, css, assets });
}

// collections/menu-trial.js
var icon = (path) => "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7c899c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`
);
var menu_trial_default = defineCollection({ name: "menu-trial", components: [], registerCommands(gramlot) {
  const commands = gramlot.commands.registerGroup("documenti", { author: "Gramlot examples" });
  for (const [name, label, drawing] of [
    ["save", "Save", "M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8"],
    ["undo", "Undo", "M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6"],
    ["toggleDetails", "Details", "M3 4h18v16H3ZM9 4v16M13 9h4M13 15h4"],
    ["export", "Export", "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"]
  ]) commands.register(name, { label, iconSrc: icon(drawing), publish: name });
  const grid = gramlot.commands.registerGroup("gridExample", { author: "Gramlot examples" });
  grid.register("updateFirst", { label: "Update first price", iconSrc: icon("M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3a7 7 0 0 0 11.6-1"), publish: "updateFirst" });
  grid.register("removeLast", { label: "Remove last row", iconSrc: icon("M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"), publish: "removeLast" });
} });
export {
  menu_trial_default as default
};
