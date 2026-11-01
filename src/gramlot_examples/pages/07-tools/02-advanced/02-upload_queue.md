# Upload queue and metadata

Choose two files and select each filename in the queue. Enter a title and a description for each, then select the first file again to see its own values. **Upload** sends each file with the fields that belong to its row. The form becomes read-only after a transfer starts.

The example uses the shared uploader, a `selectedPath` binding and ordinary Gramlot controls with a reactive datapath. The application declares the fields and validates them in its upload operation. It counts bytes and returns the fields but does **not** persist file contents. Each file is limited to 1 MiB. The page works with the ASGI host and with the browser Worker.
