# Attachments

Choose one or more small files before saving the record. They remain in the browser queue. Click **Save record**: the queued files upload automatically. Select an uploaded attachment in the list to see a text or supported raster image preview, or remove it with **Remove attachment**. More files selected after saving upload automatically.

This is an application-owned in-memory demonstration, not permanent storage: the record and files are accessible only in the current page session; reloading loses access, and the data remain in memory until the process or Worker ends. Each file is limited to 1 MiB. The application binds the record to its Page session, uses the shared uploader and provides its own list, preview and removal endpoints. It is public and has no login; real applications must provide their own authenticated identity, record permissions and persistent storage.
