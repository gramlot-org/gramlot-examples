# AI lessons

The optional gallery catalogue `ai` (GE-010 section 955). Two lessons call large
language models from the Python server:

- `ai-01` AI chat with images: Anthropic text and OpenAI images
  (`pages/93-ai/01-chat.py`; provider code in `../chat/`).
- `ai-02` Visual editor with assistant: natural-language Source editing
  (`pages/93-ai/02-visual_editor.py`; assistant in `../visual_editor_chat/`).

Both require `endpoint`, `python` and `llm`. `filters.json` adds the gallery filter
**AI (LLM)**. The JavaScript galleries and the serverless export do not load this
catalogue. Install the provider SDKs with `gramlot-examples[chat]`.

`environment.py` reads the server environment: `ANTHROPIC_API_KEY`,
`OPENAI_API_KEY`, `GRAMLOT_DOCS_ROOT`, `GRAMLOT_AI_MODELS`,
`GRAMLOT_AI_MAX_MESSAGES` and `GRAMLOT_AI_MAX_IMAGES`. A lesson without its keys
shows “AI examples are not configured on this server.”

```sh
export ANTHROPIC_API_KEY=… OPENAI_API_KEY=… GRAMLOT_DOCS_ROOT=/path/to/gramlot/docs_llm
gramlot uvicorn gallery --websocket \
  --catalog "$PWD/src/gramlot_examples/trials/ai/catalog.json" "$PWD/src/gramlot_examples/trials/ai/pages"
```

The public Python gallery reads the variables from a root-owned env file; see
`deploy/galleries/README.md`, section “AI lessons”.
