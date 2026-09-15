# Brain Garden standalone PWA

Brain Garden has a separate Netlify deployment at the domain recorded in `pwa/brain-garden.netlify.json`. It serves the app at `/`. The existing portfolio and its `/brain-garden/` deployment are independent.

## Build and publish

```sh
npm run build:brain-pwa
node --test tests/*.test.mjs
python3 scripts/deploy-brain-pwa.py
```

The deploy script uses `NETLIFY_AUTH_TOKEN`, or the existing macOS Netlify CLI login. It refuses the portfolio site ID and checks the stored site name and team before uploading. The public configuration contains the site identity, not credentials. The last deployment receipt is stored under ignored `outputs/`. This is a manual standalone deployment, not a second automatic build of the portfolio.

The builder copies the existing `public/brain-garden` application into ignored `brain-garden-dist/`, overlays `pwa/brain-garden`, and changes the base path only in the generated HTML. There is one copy of the lesson and visualization source. PWA controls are injected only into the standalone build. The original app's 211 concepts, bilingual content, Hindi video preferences and Three.js models stay shared.

## Install and use offline

The app has a manifest with root scope, standalone display, 192/512-pixel icons, a separate maskable icon, an Apple touch icon and lesson shortcuts. The diamond mark extends the existing Brain Garden identity. Install app opens a browser-provided install prompt when supported, or concise browser/iOS instructions. The native installation itself is left to the user.

On the first online visit, a service worker saves all 56 local content assets, about 8 MB including both GLBs. The footer reports readiness only after the complete cache has been checked. Once ready, the shell, every lesson, the models and icons can reopen without the origin server. YouTube videos, thumbnails and external sources remain network resources; they are not downloaded into the offline cache. Browser storage can be cleared or evicted, in which case an online visit is needed again.

Each build derives a release ID from the worker and asset contents. The worker verifies SHA-256 integrity for the pinned release, installs atomically, and serves the matching cached shell and assets together. The offline shell is transported as JSON and reconstructed as an HTML response, so optional hosting or browser HTML injections cannot invalidate its checksum; its HTML is tested against the normal entry page. A failed installation cannot replace a usable release. New versions wait behind an Update now / Later prompt. Applying an update reloads the requesting tab while retaining its lesson URL. Cache cleanup is restricted to this app's scope; unrelated app caches are preserved. The worker and manifest have revalidation headers. The optional Netlify badge is disabled through its project setting so injected markup cannot change the pinned HTML. `/brain-garden/*` on the new domain redirects to the root equivalent for compatibility.

## Validation

- All 30 permanent tests pass, including manifest/icon/shortcut checks, complete precache integrity, network-free navigation and assets, failed-update retention, scoped cache cleanup and partial-eviction detection.
- Browser QA confirms initial offline readiness, install guidance, update notification, postponement and explicit update/reload. With the localhost origin stopped and HTTP responses originally marked no-store, a fresh reload still runs, then switches to an unvisited hearing lesson and renders its 3D hair-cell view in Bengali.
- Installation guidance fits the 390-pixel phone viewport in Bengali with no page overflow; desktop controls were also inspected. The temporary viewport override was reset.
- Production verification checks the separate HTTPS site, manifest/service-worker response headers, deployed asset hashes, legacy-path redirect and offline-ready status. The original portfolio deployment ID is checked to confirm it was not replaced.
