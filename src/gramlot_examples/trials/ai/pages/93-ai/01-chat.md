# AI chat with images

Write a message and press **Send**. The Python PageStore sends the conversation to
the Anthropic model chosen in **Chat** and writes the answer into the bound
conversation. Ask it to draw something: the model calls the image tool and the
server generates one PNG with the OpenAI model chosen in **Image**.
`/image <description>` asks for an image directly.

The gear opens the chat settings: title, instructions for this chat and background
notes. They change the next request. **New conversation** clears the history and
the settings; the selected models stay.

The **+** button attaches images, PDF and UTF-8 text/code files. They travel with
the message and stay in the server context for the following turns. Maximum: five
files, 2 MiB each (1 MiB for text), 4 MiB total.

`chat_frame` composes the core `ChatPane` with the model selectors and the settings
drawer. `PageStore.process_message` calls the providers and returns text, or Source
with an `img` for a generated image. The API keys are read from the server
environment by the provider SDKs; Source, Data and the page never contain them.

The server checks every choice again. A model that is not offered is rejected
before any provider call. When the server sets `GRAMLOT_AI_MODELS`, only those
models are offered. On the public gallery each page session can send a limited
number of messages and generate a limited number of images; the notice above the
input says when the limit is reached. Without API keys the lesson shows
“AI examples are not configured on this server.”

No streaming, cancellation or persistent archive is implemented. Closing the page
ends the conversation.
