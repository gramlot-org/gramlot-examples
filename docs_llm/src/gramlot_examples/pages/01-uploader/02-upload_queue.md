# Upload queue and metadata

Choose two files and select each filename in the queue. Enter a title and a description for each, then select the first file again to see its own values. **Upload** sends each file with the fields that belong to its row. The form becomes read-only after a transfer starts.

The example uses the shared uploader, a `selectedPath` binding and ordinary Gramlot controls with a reactive datapath. The application declares the fields and validates them in its upload operation. It counts bytes and returns the fields but does **not** persist file contents. Each file is limited to 1 MiB.

Uploads need a server that accepts them. The Python Uvicorn server (`gramlot uvicorn gallery`) and the serverless export accept uploads. The hosted public galleries, the Kajenn server and the Node.js/Bun server do not: there **Upload** marks each file "Upload is unavailable in this environment". The line at the top of the page says which case applies; choosing files and editing the queue work in both.
