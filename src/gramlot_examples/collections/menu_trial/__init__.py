from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="menu-trial",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:925dfd8a444eb3943577713d1b5a60aaa74c36b4d115283dd9bede2ccba864e9",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)
