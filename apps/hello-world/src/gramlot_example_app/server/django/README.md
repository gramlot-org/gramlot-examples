# django

Run the native Django integration with the shared Python Hello World page:

```sh
python -m gramlot_example_app.server.django
```

The page is at `http://127.0.0.1:8000/hello/`. Django mounts the
`gramlot_django.NativeHtmlPages` URL patterns; the application does not implement
the Gramlot HTTP protocol itself.
