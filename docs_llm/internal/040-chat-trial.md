# 040 · Conversation component trial

> Historical record: §§005–050 describe the original provider trial. The current AI chat uses the shared component and binder contract in §060.


Document ID: **GE-040**. Date: 2026-10-29.

<a id="ge-040-005"></a>
## 005 · Confirmed scope and implementation

Owner requests an updated-base chat PoC reusing existing PageStore/WebSockets,
then Anthropic with a 1Password key, model/effort/temperature controls, server
context and image generation. Owner supplied the separate OpenAI credential,
then a Codex screenshot requesting a similar appearance and distinct chat/image
model selection. These are example-owned changes; no core/adapter/dependency
runtime changes or public component promotion.

chat-trial's chatMessages projects a message Bag through existing bagStore.
Stable labels identify rows, string values carry text, role/author/model/effort
attributes describe messages; optional image holds provider PNG base64. DOM is
confined to the reusable component. Python chat_frame uses real framePanes,
menus, native controls, a drawer and resizable composer. Source/Data/controllers
own bindings and commands. Charcoal palette, plain assistant replies, right-hand
user bubbles, rounded composer and bottom Chat/Image/Effort selectors follow the
reference. Narrow layouts use normal menu overflow. Page-owned CSS loads styling.

PageStore owns conversation/messages/turns/error. dataBinder mirrors it; browser
Data owns draft/settings/pending/delivery/drawer. chat_send/chat_new publications
and chat_completed notifications use the existing channel and sender metadata.
Completion clears only the submitted draft, preserving newer edits and errors.

<a id="ge-040-010"></a>
## 010 · Run and extend

See expanded guide for commands: isolated Python environment with .[chat] and
current gramlot-py-server[uvicorn], current Node 22/24/26, npm packages and current
core tools/gramlot-builder. Build the prepared collection. No first-party pins.
Launcher scripts/serve_chat.py accepts --anthropic-secret-ref and
--openai-secret-ref (op:// references), or both API keys in its environment.
Keys stay in server memory, never Source/Data/logs/repository files. Local URL:
http://127.0.0.1:8772/; Uvicorn uses its existing websocket=True integration.

Anthropic's active model catalog supplies chat options and supported effort
levels. Model changes reset effort to default; server validates selections.
Every text call sends all completed user/assistant text and the new draft. No
silent truncation. Output cap 4096 tokens; individual draft cap 8000 characters.
Empty/incomplete/error responses preserve history and draft. Current Anthropic
API 2026-10-21 / SDK 2+ removes temperature: drawer reports it unavailable, with
no downgrade path. New conversation clears server history; Clear draft is local.

/image <description> uses the separate selected GPT Image 2.5 model, Sunburst or
Flare if present in the account catalog. The server validates model selection.
One low-quality 1024 × 1024 PNG is embedded in the assistant message. Claude
receives its text description, not pixels. Natural-language tool selection is added by §020 below. Image editing,
multimodal history and a separate asset server remain unimplemented.

<a id="ge-040-015"></a>
## 015 · Verification and limits

16 Python tests and 7 JS tests pass: full history, selected settings, invalid
configuration, failed/incomplete replies, isolated reset, image API parameters
and model validation, safe image projection, preserved draft and command payload.
Prepared collection check, compilation and whitespace pass. The real WebSocket
probe (--model MODEL_ID --effort low) makes two paid Anthropic calls and verifies
bootstrap/snapshot, binder deltas, context recall and completion metadata. Browser
confirms Haiku 5.5/low recalls a prior name, and a Sunburst PNG loads at 1024 square.
Both Sunburst and Flare are available in the account. Final visual checks cover 960 × 900 and native 354 × 877, independent model
selectors, overflow, drawer and disabled temperature. A real Flare request also
produces a loaded 1024-square PNG. The final extended WebSocket probe passes.

Recipe execution is synchronous: API calls block this local Uvicorn worker,
with 60-second text/120-second image timeouts and no automatic retries. Single-user
PoC; no streaming, cancellation, persistence, compaction, reconnect or archive.
Provider errors preserve context; timeouts may still have incurred provider cost.
Images/history disappear with page/store lifetime. No cross-browser/screen-reader,
owner visual acceptance, promotion, release or deployment claim.

Historical record: initial deterministic increment passed 8 Python/5 JS tests,
real socket probe and browser send/reset/drawer/composer resize checks at
1280×720 and 353×877. Its responder is superseded by the provider integration.


<a id="ge-040-020"></a>
## 020 · Shared prompt, per-chat settings and image tool

Owner, 2026-10-29: requests a common prompt describing the experimental chat,
its capabilities and limits, plus a gear to configure the individual chat prompt
and other information, following the proposed natural-language image integration.

The server-owned BASE_PROMPT identifies the app, Source/PageStore/WebSocket
structure, controls, tools and unavailable capabilities. The gear opens the
existing drawer with title (160 characters), instructions (12000) and background
notes (8000). These belong to configuration in this page's PageStore and are
bound through an ordinary dataBinder. Native change/blur commits edits; the next
message reads canonical server configuration. New conversation resets it. No
persistent storage is implied. The common prompt is visible read-only; editing
client Data cannot replace the server constant used in API calls.

System input is the shared prompt followed by chat title, instructions and notes.
The assistant is told that 'this component' means the Gramlot trial. generate_image
is an actual Anthropic client tool with one prompt argument. The PageStore-selected
OpenAI model remains authoritative. One validated call is permitted per turn;
its result is sent back as tool_result, with further tools disabled for the text
continuation. The PNG is embedded in the same message Bag. If text continuation
fails after successful generation, the image is retained with an explicit warning;
there is no repeat image request. Later turns receive text descriptions, not pixels
or a second persistent tool transcript. The /image shortcut remains available.

Verification: 21 Python and 7 JS focused tests pass, including prompt composition,
configuration limits/reset, natural image routing, tool-result ordering, invalid
tool arguments and preservation of an image after text-follow-up failure. Prepared
collection check and whitespace pass. Live UI/API verification completed on
2026-10-29 after the owner retried 1Password authorization: the server restarted,
the common prompt identified the experimental component, and native typing plus
field blur synchronized per-chat instructions and notes through the binder
(Claude recalled the test project name Ginepro). A natural request to draw a
watercolor stone fireplace invoked generate_image with Sunburst 2.5 and rendered
a complete 1024 × 1024 PNG in the conversation. Test configuration was cleared.
The first automation fill did not commit change-bound fields; native typing and
Tab verified their intended contract without application changes. Keys remained
in server memory, with no secret values written to files. Owner acceptance of
the resulting UI remains separate from this verification.


<a id="ge-040-025"></a>
## 025 · Reusable base chat: confirmed layout and server hook

Owner direction, 2026-10-29, in the conversation-poc task: “io farei un chat
base” with a customizable frame top, scrolling messages, and a bottom frame
whose center contains the input, send button and optional voice-input button;
“bottom-top” and “bottom bottom” are customizable. The owner also specified
“di default quello che invio e mandat al server che ha un hoock di elemborazioen
e rende una risposta . il default è un echo”. The preceding owner instruction
keeps provider logic separate in the server Page.

Confirmed contract direction:
- The outer frame owns a customizable top, scrolling message center, and a
  bottom composer frame.
- The composer exposes customizable top and bottom regions; its center owns
  the input and send button, with an optional voice-input button.
- Sending reaches server-side processing through the existing Gramlot channel.
  The processing hook defaults to echoing the submitted text. Applications
  replace its processing with their own logic, including provider calls.
- Provider credentials, LLM context construction and tool execution stay in
  the server Page/application. The reusable base works without an LLM key.

This records the owner's design, not a completed component port. Public names,
exact hook signature, request/response schema and instance routing remain to be
specified. The optional voice button does not establish a recording/transcription
implementation or provider. Earlier illustrative chatPane/sendTopic/composer
spellings remain proposals, not approved or available APIs. No runtime change
was made in this contract-recording step.


<a id="ge-040-030"></a>
## 030 · Confirmed processing hook

Owner confirmation, 2026-10-29: “ok” in direct reply to the proposed
`process_message(self, text)` server hook with default `return text` and access
to the chat's context through its PageStore. This confirms the hook name,
submitted-text argument, text echo default and server-owned context access.
It does not yet approve a structured response schema, image representation,
error/completion protocol, voice processing or public component authoring API.
The next contract decision is the response representation for text and images.
Implementation and reusable-component port acceptance remain pending.


<a id="ge-040-035"></a>
## 035 · Source content inside each message

Owner confirmation, 2026-10-29: “sì facciamo che ogni messaggio possa contenere
Source Gramlot, quindi anche immagini tabelle e bottoni. fammi un esempio di
come il server costruirebbe la risposta”. This confirms message content as
Gramlot Source, including interactive components, rather than arbitrary HTML.
The previous proposed plain Bag with text/image fields was not approved as the
public response contract. The processing hook name/signature and echo default
from §030 remain confirmed.

An illustrative server construction uses the existing GramlotBuilder root,
ordinary div/p/img/table/button authoring, named dataController methods and
builder.source (SourceBag). Source construction and typed serialization of this
example were checked. Returning that SourceBag from process_message is a proposed
hook result representation, not an implemented chat capability. Source mounting,
per-message Data scope, collection availability, action routing and cleanup must
be specified before the public component implementation; the current PoC still
renders text plus optional PNG. Named browser controllers in returned Source must
be supplied by the application; they do not implicitly invoke server methods.


<a id="ge-040-040"></a>
## 040 · Confirmed processing result types

Owner confirmation, 2026-10-29: “ok” in direct reply to “l'hook restituisce una
stringa oppure un SourceBag, al posto del precedente Bag con campi text e image”.
The confirmed process_message(self, text) hook returns either a string for plain
text or a SourceBag for composed Gramlot content. Its default remains return text.
The two result types are intentional public cases, not a permissive coercion or
compatibility fallback. The earlier plain Bag text/image proposal is superseded;
no additional result types are approved.

This confirms the result contract, not implementation or component acceptance.
Per-message Data scope, Source mounting/lifecycle, action routing and required
collection activation remain to be specified. The current PoC remains unchanged.


<a id="ge-040-045"></a>
## 045 · Confirmed per-message Data scope

Owner confirmation, 2026-10-29: “ok” in direct reply to the proposal that each
message has its own datapath, so relative fields such as .selected and local
button state do not interfere across messages. Controllers remain those supplied
by the Page; absolute paths may access shared Page Data.

This confirms per-message Data isolation using the existing datapath convention,
not a private state store or new binding syntax. Concrete path allocation, Source
mounting, release on removal, collection availability and transport routing still
require destination inspection and specification. No runtime change is claimed.

The confirmed functional design now comprises the nested frame layout (§025),
server processing hook with default echo (§030), arbitrary Gramlot Source message
content (§035), string/SourceBag result cases (§040), and per-message Data scope
(this block). Implementation must preserve the existing Source/Data/controller
and PageStore/WebSocket ownership boundaries.


<a id="ge-040-050"></a>
## 050 · Base echo component and interactive Source example

Owner 2026-10-29: “ok procedi con la chat base con echo e un esempio di risposta
con Source interattivo”. Implemented in the conversation-poc core worktree:
ChatPane (real outer/composer frames), ChatPageStore with process_message echo,
optional chatMessages viewport and shared browser projection/send/completion/reset
handlers. GC-390 documents the reusable implementation; PORT-0025-base-chat
records the bounded destination review. Prior chatPane/sendTopic pseudocode is
superseded by the actual Python ChatPane composition API.

The example here is trials/chat_base, served by scripts/serve_chat_base.py on
port 8773 with the normal adapter. Page-owned top and composer bars demonstrate
extension. The PageStore override returns an interactive Gramlot Source for
/source and inherits echo otherwise. Replies contain a static SVG image, table,
counter and editable note. The Page's browser Logic delegates reusable behavior
to core and supplies increment/sendExample. No provider credential is needed.

Live verification: echo passed through the real WebSocket; two Source replies
kept independent counters (2 and 1) and notes. Core tests cover Source lifecycle,
Data isolation, literal text, completion correlation, failure/draft preservation
and scroll behavior. The original provider-backed trial's 21 Python tests still
pass against the new core. The original /image PNG message contract remains a
separate PoC; it was not silently converted to the new Source result contract.
The implementation remains a development result awaiting owner acceptance.


<a id="ge-040-055"></a>
## 055 · Base chat binder feedback — 2026-10-29

The owner confirmed request/feedback/response through Data sync and authorized
implementation. The base example now uses the GC-390 binder contract. Its hook
calls feedback three times with brief sleeps (1.6 seconds total) solely to show
replacement while processing; the core echo adds no delay. Source replies still
contain an image, table, counter and note with per-message Data. Live verification
confirmed feedback before completion, empty status afterward, echo and interactive
Source. The separate provider trial above retains its earlier PoC protocol.


<a id="ge-040-060"></a>
## 060 · AI and images on the shared component — 2026-10-29

Owner: “fammi anche la chat di prima con il component per ai e immagini”, followed
by “ok procedi”. This authorizes migrating the existing provider trial to ChatPane
and ChatPageStore while keeping provider logic in the server Page application.
The page loads the core chat collection and delegates chatRender, chatSend,
chatCompleted and chatReset. Selectors and the settings drawer remain application
Source in the component's configurable regions; input/send/status and message
projection are supplied by core. No new core/provider API was added.

Settings and configuration have their own dataBinders. Request/response/feedback
use chats.main. The server-only providerContext Bag contains completed textual
turns, including generated image descriptions; it is provider context, not a
second client store or renderer. Generated images become ordinary Gramlot Source
img nodes in the response. Both /image and natural tool requests use the selected
image model. Paid images survive a failed text follow-up. Errors retain drafts
and context; feedback clears. Reset clears context/configuration and Source while
preserving selected models, and replayed resets do not clear later configuration.

Verification: 23 Python tests and 3 browser tests passed against the local core.
Real Anthropic requests returned OK and then recalled Ginepro from the first turn.
Credentials were read from the already-authorized 1Password entries only into the
server environment. Local port 8772 serves this application; port 8773 remains
the provider-free base demo. No release or deployment is claimed.


Final live image verification: “Disegna un piccolo caminetto in pietra con il
fuoco acceso, stile acquerello” triggered the image tool without /image. The reply
contained a loaded PNG (naturalWidth/naturalHeight 1024/1024) rendered by the core
Source message projection. The drawer exposed title/instructions/notes and the
read-only base prompt; chat/image/effort selectors remained separate. The browser recorded the expected channel disconnect during the intentional
server restart; no later runtime error or server traceback was observed.


<a id="ge-040-065"></a>
## 065 · Compact composer refinement — 2026-10-29

Owner requested visible working status and less space above/below a rounded input,
with icon send in a bottom toolbar. The example now fills ChatPane.toolbar with
model/effort selectors and Clear draft; core supplies the right-aligned Send icon.
The composer uses 190px, a 48px bottom toolbar and a notice top of zero when empty.
A blue status row and motion-aware spinner make processing visible; labels come
from existing Data sync. Live Anthropic feedback was visible before completion,
cleared afterward, and the accessible send control measured 36x36 pixels.
The base example also uses the shared toolbar and explicitly sizes its custom top.


Empty composer top — owner 2026-10-29 requested only a couple of pixels when
empty. The shared top and AI notice top now use 2px when empty; the derived
status row is display:none while empty, and editor center has no top padding.
While processing, the same bound status becomes visible. This supersedes the
previous permanently reserved status height; message viewport height is unchanged.
Six focused Python composition/server checks passed.


<a id="ge-040-070"></a>
## 070 · Growing input and attachments, including PDF — 2026-10-29

Owner requested auto-growing input, a normal-height toolbar and + for files/images;
confirmed “Anche PDF” to draft Bag attachments, preview/removal and server reading.
The shared component now supplies growing input (44–180px), a 44px toolbar and
2px empty top. The fixed 190px layout in §065 is superseded. Eight Page Logic
methods delegate to core, including sizing and attachment selection/projection.
The application adds no browser DOM or separate upload transport.

The PageStore reads self.request_attachments after core validation. Anthropic
receives images as image blocks, PDFs as document blocks and UTF-8 files as text
blocks, with the typed question. These blocks remain in server-only providerContext
and are sent on subsequent turns. Generated OpenAI image pixels still are not
included in that context; image editing remains unsupported. Explicit /image
with attachments is rejected without losing the draft. The common prompt now
explains the attachment capability and treats file contents as source material.

The + accepts up to five files: PNG/JPEG/WebP/PDF (2 MiB each) and supported UTF-8
text/code (1 MiB each), 4 MiB total. Image previews and removable filename cards
stay local until Send. PDFs are sent to Claude, not parsed or displayed by an app
PDF viewer. The provider rejects a request if encoded history exceeds 24 MiB and
asks for a new conversation; no automatic context compaction is added.

Verification: 24 Python / 3 JS example tests, 11 Python / 8 JS core tests and runtime
build passed. In the browser Claude correctly extracted PINE-482 from a synthetic
PDF, MAPLE-27 from TXT and red from a PNG, then recalled the PDF's “PDF marker”
label on a second request without reattachment. File removal, attachment-only
echo, live feedback, draft cleanup and input growth/cap/shrink were verified.
Keys stayed in the authorized server environment. Implemented and verified locally;
acceptance and release are separate.


<a id="ge-040-070"></a>
## 070 · Common gallery integration

Block ID: **GE-040-070**.


Local common-base integration — 2026-10-29. Owner: “Sì, verifica anche
conversation-poc e integra la chat nella base comune, preservando il lavoro
originale e controllando che funzioni nella gallery. Invoice resta fuori.”
The conversation-poc changes were reviewed and merged into the existing local
release base alongside Grid, forms, selectors and PageStore. The original core,
examples and adapter checkouts remain untouched; their imported files were
snapshotted and hash-checked. Invoice is excluded.

The opt-in chat catalogue opens /pages/92-chat/01-echo directly in the gallery
iframe. It uses the shared ChatPane/ChatPageStore and existing binder/WebSocket
channel, without AI credentials. The provider-backed trial remains separate;
this integration makes no paid provider calls and does not certify its historical
provider results anew. Remote Edit remains disabled. Runtime/prepared collection
and gallery browser builds pass. Full suites: 1,419 core JavaScript tests,
335 gallery JavaScript tests and 312 Python adapter tests. The focused core
Python chat/PageStore checks pass (20 tests).

Live Kajenn gallery checks: text echo; feedback before processing completes;
interactive Source replies with independent note/counter Data; appending replies
preserves earlier state; reset clears conversation while retaining the unsent
draft; no browser console errors. Current preview: http://127.0.0.1:61505/.
Verification receipts: /private/tmp/gramlot-chat-integration-20261029/.
Implemented and locally verified; publication and remaining public release gates
are separate. No deployment, package release or TestFlight upload was performed.

Final integration checks: the full core Python suite passes (348 tests and
397 subtests; one declared expected failure). Focused example checks pass
(28 chat/provider/collection tests, then 5 catalogue/base tests and 8 subtests).
Documentation identities/paired anchors and whitespace checks pass. The base
chat stylesheet now consumes the gallery theme tokens, fixing the low-contrast
prototype button without changing the original trial. Browser verification uses
Kajenn; both Kajenn and Uvicorn feedback/cleanup paths pass automated tests.
