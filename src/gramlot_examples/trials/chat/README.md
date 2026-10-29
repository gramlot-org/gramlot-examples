# AI chat on the shared base component

The application composes the core `ChatPane` and subclasses `ChatPageStore`.
The standard input, send/reset, scrolling Source messages and replacement feedback
come from core. The application adds model/effort selectors, a settings drawer,
Anthropic text generation and OpenAI image generation. No chat publication,
application DOM renderer or separate browser transport is used.

Request, feedback and response travel through the existing dataBinder. Settings
and chat-specific configuration are also bound Data. Provider code and credentials
remain on the server. `providerContext` is the server-only conversation context sent to
Anthropic; visible image replies are Gramlot Source. Generated image pixels are not sent back to Anthropic. User-attached images,
PDFs and text files are sent and retained in the server context. New conversation clears both message Source and provider
context, title, instructions and notes; model choices remain selected.

Open http://127.0.0.1:8772/. Ask naturally to draw an image, or use `/image`.
The selected image model produces one PNG embedded with an ordinary Source img.
The gear opens title, chat instructions, background notes and the read-only common
prompt. Effort choices follow the model catalogue. The existing temperature
control remains unavailable; this migration does not change provider API options.

This development trial needs the local core chat implementation with rebuilt
runtime/prepared collections and the Python adapter's immediate-feedback change.
See GE-040 for server-only 1Password launcher arguments. Never store keys in
Source, browser Data or repository files. The optional trial is outside the
standard gallery catalogue. No streaming, microphone, cancellation, persistence
or automatic context compaction is implemented.

Verification: Python tests exercise context, options, image tool calls, Source
replies, provider failures, reset and feedback. Browser tests use the core chat
collection and shared Logic delegates. The former example-owned chat collection
is historical PoC evidence and is no longer loaded by this page.

The input starts as one line, grows to 180px, then scrolls internally. The toolbar
stays 44px high. Use **+** for PNG/JPEG/WebP, PDF and UTF-8 text/code; images show
thumbnails and every selected file can be removed before Send. Limits: 5 files,
2 MiB per image/PDF, 1 MiB per text file, 4 MiB total. Files are sent only on Send;
failed requests keep them. The PDF is read by Claude; no PDF viewer is included.
The server hook reads `self.request_attachments` and translates validated Data
into provider content blocks. Those blocks remain available on later turns.
Encoded history is limited to 24 MiB; start a new conversation when reached.
