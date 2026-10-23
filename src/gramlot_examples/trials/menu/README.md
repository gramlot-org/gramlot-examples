# Menus, toolbars and framePane — Python gallery chapter

Build the project-local collection with Node 22/24/26 and @gramlot/builder:
`gramlot-builder build --config gramlot.build.json` from the examples root.
The generator input is collections/menu-trial.js; prepared output is the importable
gramlot_examples.collections.menu_trial package. Runtime users need no generator.

Add this directory's catalog.json and pages/ through the Python gallery's existing
extra-catalog mechanism. The catalogue key is menu-01; the staged page URL is /pages/menu/01_menu_trial. Use a development core containing
GC-335's menu/frame trial. This page does not require dialog/floating.


From this repository, the Python adapter's CLI can stage the trial alongside the
usual gallery (choose a free port):

```sh
gramlot uvicorn gallery --port 8093 --catalog src/gramlot_examples/trials/menu/catalog.json src/gramlot_examples/trials/menu/pages
```


## Learning path

The chapter contains six lessons: popup commands; toolbar composition; reactive
states; framePane regions and nested recipients; resolver Bags and nested lazy
menus; the complete document workspace. Each lesson includes Python source,
a named Logic companion and a Markdown explanation with concrete exercises.

The family is shown as **Menus, toolbars and framePane**. Its introduction is
/pages/menu/00-index; the frame lesson is /pages/menu/05_frame_pane. Existing
menu-01 identifiers and the original complete-example URL are retained.
All lessons target the provisional development API. They are Python examples in
an extra catalogue; they do not assert JS-host/serverless availability or release
acceptance. Save/Export only demonstrate command receipt and local Data updates.
