"""Prepared collections selected by the gallery application."""
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.tree import mygramlot as tree
from gramlot.collections.editors import mygramlot as editors
from gramlot.collections.typst import mygramlot as typst


def collections():
    return [inputs, layout, tree, editors, typst]
