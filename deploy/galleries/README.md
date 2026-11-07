# Automatic hosted galleries

Owner authorization, 2026-10-17: “si confermo, dopo ogni release dei quattro repo.
procedi anche a includere il link di download nei pacchetti ufficiali”.
This supersedes the initial deployment's manual-update policy.

Owner follow-up, 2026-10-17: start the update directly from CI when publication
finishes, without the ten-minute check. This supersedes the timer-based trigger.

Each of the four repositories has `Update hosted galleries`, triggered by a
successful completed `Publish release` workflow. The separate `workflow_run`
workflow starts only after all registry jobs complete; appending a deploy job
inside publication would deadlock the updater's completed-publication check.
`workflow_dispatch` on main also allows a retry without publishing a new package.
No timer polls for releases.

CI connects with a dedicated per-repository SSH key. It cannot run a shell,
forward ports, upload files or choose a command. The forced command can only run
the root-owned gallery updater. The server host key is pinned; no root SSH key
or personal access token is stored in GitHub. The job executes no checked-out
code or downloaded release scripts. The updater itself still requires successful
publication workflows and matching public npm/PyPI versions for all four repos.

Owner decision, 2026-10-20: “consideriamo jsr opzionale. e ci basiamo su npm”.
A completed publication run whose only unsuccessful job is `jsr` counts as
published; npm and PyPI versions still gate the deployment. A run still in
progress is never ready: cancel a JSR job that does not finish.

Owner authorization, 2026-10-18: “Sì, usa l’autenticazione temporanea della CI”.
Each workflow sends its short-lived, read-only `github.token` over SSH standard
input. The updater holds it only in memory, uses it only for HTTPS requests to
`api.github.com`, and refuses authenticated redirects. It is never written to a
file, logged, passed in process arguments or inherited by build subprocesses.
Registry requests remain anonymous. The CI wrapper requires this input; all four
workflows must be updated together. Direct administrative and timer invocations
without `--github-token-stdin` retain their explicit anonymous mode.

Concurrent events wait on the updater lock instead of being discarded. Each
rechecks the newest release set after acquiring the lock; duplicate events are
no-ops. Readiness and installed-version races retry every 30 seconds, within a
15-minute wait budget. Build, version, Compose start and nginx failures fail the
CI job without automatic retry. Browser checks, proxy/database verifications and
ZIP hash comparisons never block: each runs with a 150-second limit, a failure or
timeout becomes a `::warning` annotation and an entry in the receipt's
`check_failures`, and the deploy continues. The remote process has a 40-minute
limit and the CI job 25 minutes. These are bounded retries of a received event, not a periodic release
poll. Incomplete/failed publications are never promoted; rerun the failed job
once publication or infrastructure is repaired.

## Build and promotion

The Dockerfiles install current official packages without first-party dependency
pins. Actual installed versions must match the release set before deployment; a
registry change during a build causes a retry, never a mixed promotion. Version
receipts and image identities describe a tested deployment, not dependency pins.
The Node image includes the serverless exporter and builds the offline archive
using precisely its installed JavaScript packages.

Each candidate has a unique directory in `/opt/gramlot-galleries/generations`.
The updater alternates two Compose projects with private host ports 19182/19183
and 19184/19185. Containers are non-root with read-only roots and bounded resources.
The preceding generation stays live while images and ZIP are built. Candidate
health checks and Chromium checks cover the gallery download, all 25 component
pages starting, shared textbox binding, invalid drafts preserving accepted Data,
and asynchronous validation; these run on both servers and file-based offline
output. Each independent example opens in a fresh page, closed before the next
visit, as in the serverless browser suite. This releases embedded offline bundles
instead of retaining a long file-navigation history in a single renderer. Binding
and validation assertions still run in the same page they exercise; no page or
assertion is skipped. The ZIP contains all generated lessons, a README and a
version receipt.

One nginx configuration selects both upstreams and the immutable shared ZIP.
After `nginx -t` and reload, public HTTPS browser checks and both ZIP hashes run
and report their failures without blocking. An nginx failure restores and reloads
the preceding configuration and removes the candidate. The previous containers stop only after successful promotion. The last
successful generation is retained for rollback. Builds use a dedicated `gramlot-galleries` BuildKit builder; its cache is pruned
to at most 1 GB after each attempt. No unrelated images, caches or services
are pruned. Existing clients can need a reload after deployment: in-memory page
sessions are not transferred between containers.

## Installation and operations

Install this directory as `/opt/gramlot-galleries/automation`, retaining the
existing TLS certificate and nginx site symlink. Build the verifier once:

```sh
docker buildx create --name gramlot-galleries --driver docker-container
docker build -f automation/Dockerfile.check -t gramlot-gallery-check:current automation
python3 automation/test_update.py
python3 automation/update.py --check
```

`current.json` must describe the current deployment before the first run, with
`slot`, `compose`, `generation`, and `releases` (the latter may be empty to request
an initial registry-only rebuild). For the original manual deployment, slot is 0
and compose is `/opt/gramlot-galleries/compose.yaml`. Never initialize this state
over an existing automatic deployment.

The existing service remains available for an explicit operator invocation.
Disable and remove the previous `gramlot-galleries-update.timer`; do not leave
it running alongside CI.

Install `ci-update` as root-owned executable
`/usr/local/sbin/gramlot-galleries-ci-update`, and `ci-ssh-entry` as root-owned
executable `/usr/local/sbin/gramlot-galleries-ci-ssh`. Create a dedicated
`gramlot-gallery-ci` system account with a locked password. Its root-owned
`.ssh/authorized_keys` entries must use:

```text
restrict,command="/usr/local/sbin/gramlot-galleries-ci-ssh" ssh-ed25519 PUBLIC_KEY repository-name
```

The only sudo permission is the updater wrapper with **no arguments**:

```text
gramlot-gallery-ci ALL=(root) NOPASSWD: /usr/local/sbin/gramlot-galleries-ci-update ""
```

In each repository configure the `gallery-deploy` environment, restricted to
main, with secret `GALLERY_DEPLOY_KEY` and variables `GALLERY_DEPLOY_HOST` and
`GALLERY_DEPLOY_KNOWN_HOSTS`. Generate a different key per repository, install
only its public half on the host, upload the private half through standard input
to `gh secret set`, then remove the local private file. Obtain the host public
key through an already authenticated connection; never trust an unchecked scan.
Credentials belong neither in the repository nor in workflow logs.

After installing and testing the SSH restrictions, publish the workflow on main
in all four repositories and run it manually once from each. Confirm success in
GitHub Actions, `current.json`, the public galleries and both ZIP downloads.
Workflow logs contain the updater's build and verification output. The manual
systemd service continues to log to journald.

To pause future CI deployments, disable `update-galleries.yml` in all four
repositories. To roll back, pause those workflows, read `current.json` and the
preceding generation's `receipt.json`, start that receipt's Compose project with
`up -d --wait`, and regenerate nginx using `nginx_text(template, slot, archive)`
from update.py with its slot and ZIP. Validate/reload nginx and verify both public
URLs before replacing current.json with that receipt. Keep the failed generation
for diagnosis. For the original manual deployment, the prior Compose file, nginx
file and ZIP remain in the root.

Changes to these scripts are deployed explicitly from the reviewed repository;
CI only updates released product packages, never its own control code. Run
`python3 deploy/galleries/test_update.py` to check publication gates, bounded
retries, concurrent/duplicate events, version races, archive contents and rollback.


## Tabs created on click — 2026-10-18

The initial index authors Introduction and navigation only. First selection adds
the selected pane/iframe and code to Source through the existing remoteSource
contract; reopening retains the same iframe and Data. This applies to Python,
JavaScript and the serverless export.

Controlled before/after measurements, methodology and limitations are retained in
[the measurement report](reports/2026-10-18-lazy-tabs.json). The first click does
more work on demand. Controlled candidate comparisons improved index startup and
combined time to the first usable example; subsequent public samples show a
smaller index gain and mixed combined-time results. The release was explicitly authorized by the owner.

After deployment, verify both public hosts and the extracted archive with:

```sh
node scripts/verify_gallery_lazy_tabs.mjs https://gallery-py.gramlot.dev/ https://gallery-js.gramlot.dev/ file:///path/to/gramlot-gallery-serverless/index.html
```

Install Playwright Chromium/WebKit before this check. It covers empty initial
Source, first-click creation, identity and edited Data retention, no repeated
lesson request, code/explanations, inspector and mobile views. Guided playback
is checked online; offline playback retains its pre-existing file-origin limit.

Public verification is complete. Generation `20261018T172328Z` runs core 0.3.3
and examples 0.3.5. Chromium/WebKit pass both hosts and the regenerated official
ZIP; gzip and old/new generation validators pass on both hosts. Public medians
(three pairs per host): Python index 2.149→1.461 s cold, 1.763→0.819 s repeat;
JavaScript 1.944→1.465 s cold, 1.076→0.882 s repeat. First selection costs about
1.3 s versus 0.6–0.7 s before; retained tabs reopen in about 50–60 ms. Combined
index plus first selection is nearly unchanged for Python cold, improves for
Python repeat and is slower for JavaScript in this public sample. Raw results,
limitations, version receipt, archive hash and successful CI links are in the report.


Visibility-on-demand checks (examples 0.3.6) are available with:

```sh
node scripts/verify_gallery_visible_content.mjs https://gallery-py.gramlot.dev/ https://gallery-js.gramlot.dev/ file:///path/to/gramlot-gallery-serverless/index.html
```

This verifies that hidden Code/Explanation panels make no Source request, first visibility requests content once, and switching pages preserves iframe identity and edited Data. Controlled first-click measurements are in `reports/2026-10-18-visible-content.json`.

## Mobile beta deployment (2026-10-25)

The separate mobile module is staged by `serve-mobile.py`; it is not selected by
`update.py`. Current receiver contract: [GE-020](../../docs/020-mobile-modules.md).
From this repository, after building the matching core and gallery resources and
running `npm run device:build` in the owning Capacitor repository:

```sh
python deploy/galleries/prepare-mobile.py \
  ../gramlot-capacitor/examples/mobile_application \
  /tmp/gramlot-public-modules/mobile_application
python deploy/galleries/serve-mobile.py --modules /tmp/gramlot-public-modules
```

Use a fresh output directory. The script copies a public allowlist only. The
provider imports the same core runtime as its page; use the qualified matching
runtime, not the older public package. This preview is HTTP on loopback; native
catalogue/broker activation requires the eventual same-origin HTTPS deployment.
The optional `Dockerfile.python-mobile` expects this artifact under `public-module/`
and `serve-mobile.py` in its build context. It intentionally fails when installed
packages lack the integration; do not bypass that prerequisite. The image itself
and public deployment remain unqualified until explicitly authorized.

Public verification must cover `/gallery/mobile-application/catalog.json`, all eligible
mobile pages/assets, normal gallery examples and
`/gallery/pages/01-inputs/04-colorpicker`. The module landing route is
`/gallery/mobile-application/index`. Since 2026-11-07 the module is staged in the gallery
mounted at `/gallery/` (see “Two galleries and the tab page”); nginx redirects the earlier
`/mobile-application/` and `/pages/` URLs. Remote Edit remains disabled. Production APNs is not
configured; push and top-level shortcut entry are omitted. No Mac LAN origin,
local push service, APNs credentials or signing material belongs in this build.
Physical iPhone acceptance away from the Mac network and TestFlight upload are
separate steps, not consequences of preparing this recipe.


The explicitly authorized deployment is live as `mobile-20261025`. Its coherent
local wheels/public artifact are installed in image
`gramlot-gallery-python:mobile-20261025`; this is not a registry release. Python
uses loopback 19186; the preceding 19182 container remains running for rollback.
Only the Python nginx block changed. The release baseline in `current.json` is
retained, with `python_override` pointing at the new receipt. Before the next
normal automatic package promotion, integrate the mobile startup/resources into
that generation; the current updater otherwise regenerates the baseline recipe.

The host directory `/opt/gramlot-galleries/trials/mobile-20261025` contains the
verified context manifest, build log, `nginx.before.conf`, `nginx.after.conf`,
`current.before.json` and `receipt.json`. For an authorized rollback, take the
existing update lock, ensure the preceding Python container is healthy, restore
`nginx.before.conf`, run `nginx -t`, reload nginx and verify the prior endpoints
before restoring `current.before.json`. Do not stop either container until the
selected configuration passes public checks. Preserve the Apple association.
The ordinary JS gallery and its archive do not belong to this bounded update.


## Public mobile profile selected for 0.3.17

Owner approval, 2026-10-27: “Sì, installa la configurazione”, referring to the
prepared deployment plan for preserving Mobile application during automatic
updates. The public Python host uses the existing mobile-aware entry point and
public module artifact, while installing official released packages. On that
host, install the mobile Dockerfile as `automation/Dockerfile.python`, copy only
the existing public module into `automation/public-module`, and install
`serve-mobile.py`. Hold `update.lock` and back up the previous profile before
changing these files. Do not replace this selected profile with the generic
Python Dockerfile during a later automation update.

The CI updater still builds, verifies and atomically promotes candidates. Remote
Edit stays disabled, the serverless ZIP link remains available, and no private
APNs configuration or TestFlight upload is involved. The verifier image must
exist before promotion; rebuild it from `Dockerfile.check` if it was removed.

## Public Asqueel module

Owner authorization, 2026-10-30: “si”, answering the explicit request to create a
separate public cache schema and dedicated role without business-table writes.
This extends the former local-only cache preparation to the public demo database.
Invoice application and TestFlight remain excluded; Remote Edit stays disabled.

The Python deployment uses `Dockerfile.python-mobile`, installed as
`Dockerfile.python` in the updater context, with `public_database.py` and the
mobile entry point. It mounts the packaged Base, Asqueel, database-grid, JSONL
and cached-selection catalogues alongside the ordinary and native-only mobile
catalogues. JavaScript and offline galleries retain their own supported catalogues.

The existing private Docker network `gramlot-demo-db` supplies `test_invoice_pg_xl`.
The non-superuser login `gramlot_gallery` has SELECT on only state, customer,
invoice, product and invoice_row in `invc`; it owns the isolated `_asql_` cache
schema. The 2026-11-02 owner grant permits only customer name/email updates
(see Public PageStore below); other business writes and administrative reads
remain denied. The
read-only selector connection additionally sets `default_transaction_read_only`.
No PostgreSQL port is exposed publicly. Credentials stay in a server-only file
`/opt/gramlot-galleries/secrets/postgres.pgpass`, mounted read-only for UID 10001;
they are absent from the build context, image, page assets and logs.

Prepare the native Asqueel cache catalogue once, using
`create_database(cached=True, catalog_only=True)`: inspect `migration_plan()`
before `migrate()`. The approved migration creates only
`_asql_._asql_cached_fetch` and its owner index. Startup never migrates.
Public data contains 3,200 customers, 60,179 invoices and 410,429 invoice rows.
The cache threshold remains 100. The owner authorized the local XL dump transfer
and then connecting the gallery ("collega", 2026-10-30). The former `invoice_demo`
database is retained; existing credentials for that database support rollback.
The same restricted reader accesses only the five demonstration tables in the XL
copy, with its own `_asql_` cache schema. The browser qualification also selects
500,000 rows and verifies the actual total of 410,429 with only 200 resident rows.

Every candidate verifies role restrictions, denied writes outside the two allowed
customer columns, rollback, cache paging, search,
sorting, independent owners and cleanup before startup. Browser checks verify
the navigation entry, selectors, resident rows, typed JSONL and cache transitions
before promotion and again over public HTTPS. `/gramlot/store` has an explicit
HTTPS WebSocket proxy route; plain HTTP continues to redirect to HTTPS.

TLS terminates at nginx. The Linux-container entry point gives Uvicorn the exact
default gateway plus loopback as trusted proxy addresses (`FORWARDED_ALLOW_IPS`),
never `*`. This preserves `wss` in the ASGI scope so the existing same-origin
WebSocket check remains strict. A missing/ambiguous default gateway stops startup.
`verify-public-proxy.py` verifies HTTPS forwarding from the gateway and rejection
of spoofed forwarding from another container address.


## Public PageStore, database and Chat lessons (2026-11-02)

The Python host also stages the packaged `page_store`, `kajenn_db` and `chat_base`
catalogues. Kajenn's Asqueel handler maps `app.customer` onto the existing
`test_invoice_pg_xl.invc.invc_customer`; no schema creation is performed.
The owner authorized `gramlot_gallery` to UPDATE only `account_name` and `email`.
Other business writes remain denied; performance connections remain read-only.
The database and browser gates verify the restriction and restore test values.
Rollback of this feature removes the three added catalogues and handler mapping;
revoke its column grant separately if write access is no longer desired.
Keep the public mobile module and existing Remote Edit policy unchanged.

## Original chart reports

The Python public deployment includes the packaged chart-reports catalogue and uses
the existing read-only demonstration connection for SalesCharts and SalesGeography.
The deployment context must contain chart-data/states.geojson (Natural Earth) and
chart-data/sal/<STATE>.geojson (ABS SAL 2021). These are public geography resources,
not customer data, and are copied into the Python image. The same data and providers
are used by the local qualified reports. No additional database grants or public
process-monitor endpoints are enabled. Remote Edit remains disabled.

## AI lessons (2026-11-06)

Owner decisions, 2026-11-06: “per ora mettiamoli e usiamo le mie chiavi. tanto tra
oggi e domani la provano solo quelli di softwell. poi faremo la registrazione e
keycloak” and “mettiamo solo sonnet 5.5 e haiku per anthropic”.

The Python host stages the packaged `ai` catalogue (GE-010 section 955): the AI
chat with images and the visual editor with assistant, under the filter
**AI (LLM)**. The JavaScript gallery and the offline ZIP do not contain them.
The image installs `gramlot-examples[chat]` (Anthropic and OpenAI SDKs) and the
core `docs_llm` manuals of the installed core release, taken from its public
GitHub tag by `fetch-gramlot-docs.py` (`GRAMLOT_DOCS_ROOT=/app/gramlot-docs`).
The image contains no key.

`update.py` gives the Python service only:

```json
"env_file": [{"path": "/etc/gramlot-galleries/llm.env", "required": false}]
```

Compose reads the file as root when it creates the container. Without the file the
gallery still deploys and the AI lessons show “AI examples are not configured on
this server.” The Node service receives nothing. The `required` key needs Docker
Compose 2.24.0 or later.

| Variable | Hosted value | Effect |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | the owner's key | chat text and editor assistant |
| `OPENAI_API_KEY` | the owner's key | chat images |
| `GRAMLOT_AI_MODELS` | `claude-sonnet-5-5,claude-haiku-5-5` | only these Anthropic models are offered and accepted |
| `GRAMLOT_AI_MAX_MESSAGES` | `20` | requests per page session (default 20 when `GRAMLOT_AI_MODELS` is set) |
| `GRAMLOT_AI_MAX_IMAGES` | `5` | generated images per page session (default 5 when `GRAMLOT_AI_MODELS` is set) |

A page session is one opened lesson page; a reload starts a new one. The limits
bound one session, not the total spend: the console caps below bound the total.

### Operator steps (by hand, on the server)

1. Check Compose: `docker compose version` must report 2.24.0 or later.
2. Create the env file without writing the keys in the shell history:

   ```sh
   sudo install -d -m 700 -o root -g root /etc/gramlot-galleries
   sudo install -m 600 -o root -g root /dev/null /etc/gramlot-galleries/llm.env
   sudoedit /etc/gramlot-galleries/llm.env
   ```

   Content, one `NAME=value` per line, without quotes:

   ```text
   ANTHROPIC_API_KEY=<Anthropic key>
   OPENAI_API_KEY=<OpenAI key>
   GRAMLOT_AI_MODELS=claude-sonnet-5-5,claude-haiku-5-5
   GRAMLOT_AI_MAX_MESSAGES=20
   GRAMLOT_AI_MAX_IMAGES=5
   ```

   Then `sudo stat -c '%U %a' /etc/gramlot-galleries/llm.env` must print `root 600`.
3. Set spend limits before the keys go live: a monthly spend limit in the Anthropic
   Console and a project budget in the OpenAI platform. Use keys dedicated to the
   gallery, so they can be revoked without touching other work.
4. Install the changed automation files from the reviewed repository, holding the
   updater lock. From a checkout of gramlot-examples on the server (`$REPO`):

   ```sh
   cd /opt/gramlot-galleries
   sudo flock update.lock sh -c '
     install -m 644 "$0/deploy/galleries/update.py" automation/update.py &&
     install -m 644 "$0/deploy/galleries/test_update.py" automation/test_update.py &&
     install -m 644 "$0/deploy/galleries/serve-mobile.py" automation/serve-mobile.py &&
     install -m 644 "$0/deploy/galleries/fetch-gramlot-docs.py" automation/fetch-gramlot-docs.py &&
     install -m 644 "$0/deploy/galleries/Dockerfile.python-mobile" automation/Dockerfile.python' "$REPO"
   sudo python3 automation/test_update.py
   ```

   `Dockerfile.python-mobile` is installed as `automation/Dockerfile.python`, as in
   “Public mobile profile selected for 0.3.17”. The root-owned wrappers
   `/usr/local/sbin/gramlot-galleries-ci-update` and `gramlot-galleries-ci-ssh` and the
   systemd unit are unchanged: they run `automation/update.py`, so no reinstall is needed.
5. The staged `serve-mobile.py` needs a gramlot-examples release that contains
   `trials/ai`. The updater deploys when a new release set is published: the
   gramlot-examples release with the `ai` catalogue triggers it through CI. Until then
   a deployment of an older examples release reports failed candidate checks.
6. Verify on https://gallery-py.gramlot.dev/: the filter menu lists **AI (LLM)**; the
   two lessons open; the chat model selector lists only Sonnet 5.5 and Haiku 5.5.
   `docker compose -f <compose of current.json> exec python env | grep -c API_KEY`
   prints `2`; never print the values.

After a change of the env file, recreate only the Python container of the current
generation (in-memory page sessions are lost):

```sh
sudo docker compose -f "$(python3 -c 'import json;print(json.load(open("/opt/gramlot-galleries/current.json"))["compose"])')" up -d --wait --force-recreate python
```

To switch the AI lessons off, empty or delete the env file and recreate the Python
container; the lessons then show the not-configured message. Revoke the keys in the
two consoles when they are no longer used.


## Two galleries and the tab page (2026-11-07)

Owner decisions, 2026-11-07: `/gallery` is the main gallery and `/chart_gallery` a dedicated
chart gallery, on both hosts; `/` answers with a Gramlot page with two tabs, **Gallery** and
**Chart gallery**, each an iframe on `/gallery/` and `/chart_gallery/`; the direct URLs stay
valid. The Charts folder page of the main gallery links `/chart_gallery/`; the chart gallery
links back to `/gallery/`. Catalogue and pages: GE-010 section 017.

| URL | Python host (`serve-mobile.py`, Kajenn) | Node host (`serve-node.mjs`) |
| --- | --- | --- |
| `/gallery/` | application `gallery`, mount `gallery`: public catalogues, trials, mobile module, PageStore WebSocket | `startGallery` with `mountPath: '/gallery'` |
| `/chart_gallery/` | application `chart_gallery`, mount `chart_gallery`: chart gallery catalogue and the chart types | `startGallery` with `mountPath: '/chart_gallery'` and the chart gallery catalogue |
| `/` | application `tab_page`, empty mount: `tab_page/index.py` | `startServer` on `tab_page/` (`index.js`) |

- Python: `galleries.py` stages the chart gallery and declares the three applications of one
  Kajenn site. Kajenn gives a request to the application whose mount is its first path segment,
  and every other request to the application at the site root. `gramlot_py_server.gallery.stage`
  adds the Python tools catalogue to every gallery; `galleries.py` removes it from the catalogues
  listed by the chart gallery index.
- Node: `serve-node.mjs` starts the two galleries and the tab page on loopback ports and forwards
  each request from port 8080 by its first path segment. It imports `startGallery` from the
  `gallery.mjs` module beside the exported `@gramlot/gramlot-js-server/node`.
- The chart types family (`base/pages/86-chart-types`) has Python pages only: the Node chart
  gallery lists Simple charts, 3D charts and Maps.
- Each gallery serves its assets under its mount (`/gallery/assets/gramlot.js`,
  `/gallery/gallery/dist/frame.js`, `/chart_gallery/...`). The nginx asset rule matches
  `/gallery/` and `/chart_gallery/` followed by `assets`, `gallery` or `themes`, and the
  `assets` and `themes` of the tab page at the root. The WebSocket rule is
  `location = /gallery/gramlot/store` (Python only). `location /pages/` redirects to
  `/gallery/pages/` on both hosts and `location /mobile-application/` to
  `/gallery/mobile-application/` on the Python host.
- Health checks: `/gallery/mobile-application/catalog.json` (Python),
  `/gallery/assets/gramlot.js` (Node).
- `smoke.mjs` and `asqueel-smoke.mjs` still take the site origins: they open the gallery under
  `/gallery`. `smoke.mjs` also checks that the tab page lists both iframes and that each iframe
  starts, that `/chart_gallery/` starts and lists its families, and that its introduction links
  `/gallery/`. The offline argument is the gallery folder, as before.
- `Dockerfile.python` (the generic `gramlot uvicorn gallery` image) still serves one gallery at
  `/`; it does not match this nginx configuration. The selected Python profile is
  `Dockerfile.python-mobile`.

The main gallery inside the tab page needs gramlot 0.3.33 or later on the Python host: the
gallery has the PageStore WebSocket and the tab page has none, and since 0.3.33 a PageStore page
inside such a container opens its own socket.

### Operator steps (by hand, on the server)

Holding the updater lock, from a checkout of gramlot-examples on the server (`$REPO`):

```sh
cd /opt/gramlot-galleries
sudo flock update.lock sh -c '
  for name in test_update.py serve-mobile.py galleries.py serve-node.mjs nginx.conf \
              smoke.mjs asqueel-smoke.mjs Dockerfile.node; do
    install -m 644 "$0/deploy/galleries/$name" "automation/$name" || exit 1
  done &&
  install -m 644 "$0/deploy/galleries/Dockerfile.python-mobile" automation/Dockerfile.python &&
  install -d -m 755 automation/tab_page &&
  install -m 644 "$0/deploy/galleries/tab_page/index.py" "$0/deploy/galleries/tab_page/index.js" automation/tab_page/' "$REPO"
sudo python3 automation/test_update.py
sudo docker build -f automation/Dockerfile.check -t gramlot-gallery-check:current automation
```

The changed smoke scripts are part of the verifier image: rebuild it as above. The next
deployment needs a gramlot-examples release that contains `chart_gallery/`. Then verify
`https://gallery-py.gramlot.dev/`, `/gallery/`, `/chart_gallery/` and the same paths on
`gallery-js.gramlot.dev`.
