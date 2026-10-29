"""Prepared collections selected by the gallery application."""
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.tree import mygramlot as tree
from gramlot.collections.grid import mygramlot as grid
from gramlot.collections.editors import mygramlot as editors
from gramlot.collections.typst import mygramlot as typst

from gramlot_examples.collections.menu_trial import mygramlot as menu_commands

def collections():
    return [inputs, layout, tree, grid, editors, typst, menu_commands]
