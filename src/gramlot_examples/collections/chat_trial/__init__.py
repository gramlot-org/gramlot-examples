from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat-trial",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:901514fdf8b2da12eaafa89b58f92768bc44a845bb97a1caae9eb2f322299b4b",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)
