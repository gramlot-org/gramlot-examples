// Prepared metadata shared by the gallery registry; no widget implementations.
import inputs from './dist/inputs/descriptor.js';
import layout from './dist/layout/descriptor.js';
import tree from './dist/tree/descriptor.js';
import chat from './dist/chat/descriptor.js';
import grid from './dist/grid/descriptor.js';
import editors from './dist/editors/descriptor.js';
import typst from './dist/typst/descriptor.js';
import grouplets from './dist/grouplets/descriptor.js';

import menuCommands from './dist/menu-trial/descriptor.js';

export const collections = [inputs, layout, tree, grid, chat, editors, typst, grouplets, menuCommands];
