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
15-minute wait budget. Real build/browser/promotion failures fail the CI job
without automatic retry. The remote process has a 40-minute limit and the CI job
45 minutes. These are bounded retries of a received event, not a periodic release
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
After `nginx -t` and reload, public HTTPS browser checks and both ZIP hashes must
pass. A failure restores and reloads the preceding configuration and removes the
candidate. The previous containers stop only after successful promotion. The last
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

Public verification must cover `/mobile-application/catalog.json`, all eligible
mobile pages/assets, normal gallery examples and
`/pages/01-inputs/04-colorpicker`. The module landing route is
`/mobile-application/index`. Remote Edit remains disabled. Production APNs is not
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

The existing private Docker network `gramlot-demo-db` supplies `invoice_demo`.
The non-superuser login `gramlot_gallery` has SELECT on only state, customer,
invoice, product and invoice_row in `invc`; it owns the isolated `_asql_` cache
schema. It cannot modify business records or read administrative tables. The
read-only selector connection additionally sets `default_transaction_read_only`.
No PostgreSQL port is exposed publicly. Credentials stay in a server-only file
`/opt/gramlot-galleries/secrets/postgres.pgpass`, mounted read-only for UID 10001;
they are absent from the build context, image, page assets and logs.

Prepare the native Asqueel cache catalogue once, using
`create_database(cached=True, catalog_only=True)`: inspect `migration_plan()`
before `migrate()`. The approved migration creates only
`_asql_._asql_cached_fetch` and its owner index. Startup never migrates.
Public data currently contains 3,200 customers and 806 invoice rows; the cache
threshold is 100 to demonstrate both resident and cached modes with these data.
The larger local XL copy is not transferred.

Every candidate verifies role restrictions, denied writes, cache paging, search,
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
