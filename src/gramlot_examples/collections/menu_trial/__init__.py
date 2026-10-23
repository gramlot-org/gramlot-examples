from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="menu-trial",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:2cdb4bcbabee5a6691e57eaf97b23bc72d46cace24910e5eb144431a209d5c5e",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)
