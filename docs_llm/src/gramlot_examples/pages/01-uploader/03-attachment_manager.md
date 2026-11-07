# Attachments

Choose one or more small files before saving the record. They remain in the browser queue. Click **Save record**: the queued files upload automatically. Select an uploaded attachment in the list to see a text or supported raster image preview, or remove it with **Remove attachment**. More files selected after saving upload automatically.

This is an application-owned in-memory demonstration, not permanent storage: the record and files are accessible only in the current page session; reloading loses access, and the data remain in memory until the process or Worker ends. Each file is limited to 1 MiB. The application binds the record to its Page session, uses the reusable attachment manager and provides its own upload, list, preview and removal operations. It is public and has no login; real applications must provide their own authenticated identity, record permissions and persistent storage.

The uploader reads the saved record identifier from the application’s shared context Bag when each upload starts. File-specific metadata remains separate.

Uploads need a server that accepts them. The Python Uvicorn server (`gramlot uvicorn gallery`) and the serverless export accept uploads. The hosted public galleries, the Kajenn server and the Node.js/Bun server do not: there **Upload** marks each file "Upload is unavailable in this environment". The line at the top of the page says which case applies; choosing files and editing the queue work in both.
