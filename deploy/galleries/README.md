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
output. The ZIP contains all generated lessons, a README and a version receipt.

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
