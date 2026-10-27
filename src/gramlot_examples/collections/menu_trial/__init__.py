from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="menu-trial",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:8b05766c10ea696d5c0210598a03fc508dafca5d7f4eeb939d52a485c2f9b7cb",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)
