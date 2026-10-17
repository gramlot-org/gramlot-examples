# Automatic hosted galleries

Owner authorization, 2026-10-17: “si confermo, dopo ogni release dei quattro repo.
procedi anche a includere il link di download nei pacchetti ufficiali”.
This supersedes the initial deployment's manual-update policy.

The existing host runs `gramlot-galleries-update.timer` every ten minutes after
completion of the preceding check. No GitHub SSH secret, webhook listener or
personal access token is needed. The public GitHub API is read for stable releases
of gramlot, gramlot-examples, gramlot-js-server and gramlot-py-server. A change is
eligible only after each matching Publish release workflow succeeds and npm/PyPI
report the corresponding versions. A tag or an early GitHub release alone is not
sufficient. Failed/incomplete publication is retried at the next check. Concurrent
updates are excluded by a file lock. Multiple releases completed between checks
are combined into one update of the newest eligible set; prereleases are excluded.

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
successful generation is retained for rollback. No unrelated images or services
are pruned. Existing clients can need a reload after deployment: in-memory page
sessions are not transferred between containers.

## Installation and operations

Install this directory as `/opt/gramlot-galleries/automation`, retaining the
existing TLS certificate and nginx site symlink. Build the verifier once:

```sh
docker build -f automation/Dockerfile.check -t gramlot-gallery-check:current automation
python3 automation/test_update.py
python3 automation/update.py --check
```

`current.json` must describe the current deployment before the first run, with
`slot`, `compose`, `generation`, and `releases` (the latter may be empty to request
an initial registry-only rebuild). For the original manual deployment, slot is 0
and compose is `/opt/gramlot-galleries/compose.yaml`. Never initialize this state
over an existing automatic deployment.

Install the supplied service/timer into `/etc/systemd/system`, then:

```sh
systemctl daemon-reload
systemctl enable --now gramlot-galleries-update.timer
systemctl start --no-block gramlot-galleries-update.service
journalctl -u gramlot-galleries-update.service -n 100
systemctl list-timers gramlot-galleries-update.timer
```

The service logs build, checks and errors to journald; it does not send messages.
To pause future automatic deployments, stop and disable the timer. To roll back,
stop the timer, read `current.json` and the preceding generation's `receipt.json`,
start that receipt's Compose project with `up -d --wait`, and regenerate nginx
using `nginx_text(template, slot, archive)` from update.py with its slot and ZIP.
Validate/reload nginx and verify both public URLs before replacing current.json
with that receipt. Keep the failed generation for diagnosis. For the original
manual deployment, the prior Compose file, nginx file and ZIP remain in the root.

Changes to these scripts are deployed explicitly from the reviewed repository;
the timer only updates released product packages, never its own control code.
Run `python3 deploy/galleries/test_update.py` in the examples repository to test
publication gates, version races, archive contents and successful/failed promotion.
