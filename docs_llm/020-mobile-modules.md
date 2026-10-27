# Native mobile modules

Document ID: **GE-020**. Updated: **2026-10-25**.

<a id="ge-020-005"></a>
## 005 · A separate catalogue, one gallery

The Mobile application module stays in `gramlot-capacitor/examples/mobile_application`.
Its `catalog.json` owns the fifteen example declarations. The host registers that
catalogue with a root-relative mount and integration resource; the gallery does
not keep a second example list. Python registration uses `Page.gallery_modules`;
the host's `stage(..., modules=[registration])` supplies it. This integration is deployed on the public Python gallery as `mobile-20261025`
(2026-10-25); physical-device acceptance is separate.

```python
from mobile_application import CATALOG
registration = dict(
    catalog=CATALOG,
    mount='/mobile-application',
    integration='/mobile-application/device-provider.js',
    prerequisites=[],
)
```

Only the native iOS/Android Capacitor application sees this branch. A normal
browser, including mobile Safari, neither imports the provider nor displays it.
Native detection is presentation, not authorization. HTTPS and the same origin
are required. Selecting a leaf opens its page directly in a Source-owned iframe;
there is no extra launch button. The server resolves the selection against its
registered catalogue instead of accepting a client-selected URL.

<a id="ge-020-010"></a>
## 010 · Broker and lifetime

The trusted integration resource installs one `DeviceFrameHost` before its
entries become visible. The broker checks exact origin, the actual Source-owned
iframe and the supported operation allowlist. The provider imports `MobileEnvironment` from the same core runtime as the page;
core retains its disposal. Child Logic attaches through
`FrameDeviceProvider`; commands, results and events use the existing
`gramlot.device` Data contract. No generic native-method dispatcher is added.

Hiding an existing gallery tab retains its page. Closing or reloading its iframe
releases the connection and native resources; disposing the gallery root also
releases the broker and appearance subscription. A late script load cannot
install a broker after the root has been disposed.

<a id="ge-020-015"></a>
## 015 · Appearance and mobile layout

Native gallery sessions default to Mela; an explicitly saved appearance wins.
The existing `index:theme-ready` / `index:theme-set` exchange propagates appearance,
palette and light/dark state to ordinary and mobile examples, including delayed
loads and reloads. Messages require both the owned frame and exact origin.
Changing presentation updates the Source stylesheet; it does not reload a lesson
or replace its Data. Mela's opaque content remains distinct from toolbar materials.

Rebuild core runtime, component artifacts and canonical theme copies first; then
rebuild the gallery so its embedded theme payload uses those same resources.
Mobile wrappers load Base plus the injected appearance payload, which already
includes Compact. They must not also load another Compact/Mela stylesheet.
Core MobileEnvironment owns outer viewport/safe-area handling; frames and the
gallery shell do not add another inset. Toolbar cells grow to the theme's field
and touch minimum while retaining compact desktop dimensions.

<a id="ge-020-020"></a>
## 020 · Public preparation and beta limits

The Python host serves `/mobile-application/catalog.json`, the eligible page
routes and public assets. Module contents are packaged separately; only the
catalogue, module Python, page companions/CSS, generated provider and two synthetic
scanner images are copied. Mac configuration, APNs material, user media and
`__pycache__` are excluded. `deploy/galleries/prepare-mobile.py` prepares this
artifact; `serve-mobile.py` stages and runs the gallery with Remote Edit disabled.
The optional `Dockerfile.python-mobile` is selected during host installation; the public host now uses this profile (see the deployment record below).
It requires public packages that actually contain this integration; it is not an
instruction to publish or deploy the unaccepted candidate.

With no configured prerequisites, thirteen mobile entries are offered.
**Server push is unavailable in this beta:** production APNs registration/delivery
is not configured. The local sandbox backend is not reused. Shortcut entry also
requires a top-level app integration and is omitted. The module index explains
unavailable prerequisites; unconfigured page routes are not staged.

The ordinary Universal Link target remains
`https://gallery-py.gramlot.dev/pages/01-inputs/04-colorpicker` (Choose and bind a color).
The server route and local page can be checked independently from Apple's link
association and native delivery.

Before deployment, use the checked runtime/collections/gallery and a rebuilt
public provider, scan generated bundles for developer LAN destinations and verify
TLS, catalog, assets and page bootstrap on the staging host. After separately
authorized deployment, acceptance requires a physical iPhone away from the Mac's
network: ordinary/mobile examples, iframe plugin isolation and cleanup, media
previews, rotation, keyboard, larger text, light/dark, one safe area and the
Universal Link. Browser viewport emulation is not that acceptance. No TestFlight
upload is authorized by this preparation.


<a id="ge-020-025"></a>
## 025 · Live deployment and demonstration IDE

The owner authorized the Python site deployment on 2026-10-25, explicitly keeping
Remote Edit off and excluding TestFlight uploads. The public service uses a
coherent image built from the qualified local wheels and public module artifact;
package metadata versions are unchanged, and no registry publication occurred.
The prior Python container remains available for rollback. The Node gallery and
existing downloadable archive are unchanged.

Open [the gallery](https://gallery-py.gramlot.dev/) or
[the sample IDE](https://gallery-py.gramlot.dev/pages/07-tools/index).
The IDE's configured directory is a disposable copy of synthetic documents,
not a Mac path or the server's application directory. Browser drafts can change;
save/create are denied by the server while Remote Edit is disabled.
Public checks pass catalogue/assets, all thirteen eligible main responses,
color-picker/IDE routes, unchanged Apple association and explicit write denials.
Refresh an existing app page to load the new runtime. Off-LAN native plugin,
media and Universal Link delivery testing remains a physical-device check.


Public deployment profile (2026-10-27): owner approved installing the prepared
configuration to retain the existing Mobile application module during automatic
release updates. The Python host selects the existing mobile Dockerfile/entry
point and public artifact, with backups and update.lock. CI remains responsible
for candidate verification and promotion. Remote Edit remains false; the
serverless download link is retained. The generic Dockerfile remains available
for deployments without the mobile module. See deploy/galleries/README.md.
