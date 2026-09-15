import {cp, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const output = path.join(repo, 'brain-garden-dist');
export async function buildBrainPWA(destination = output) {
 await rm(destination, {recursive: true, force: true});
 await mkdir(destination, {recursive: true});
 await cp(path.join(repo, 'public/brain-garden'), destination, {recursive: true});
 const extra = path.join(repo, 'pwa/brain-garden');
 await cp(extra, destination, {recursive: true});
 await rm(path.join(destination, 'shell.html'));
 let html = await readFile(path.join(destination, 'index.html'), 'utf8');
 html = html.replace('<base href="/brain-garden/">', '<base href="./">').replace('width=device-width,initial-scale=1', 'width=device-width,initial-scale=1,viewport-fit=cover');
 const head = '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/svg+xml" href="icons/mark.svg"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Brain Garden"><meta name="apple-mobile-web-app-status-bar-style" content="default"><link rel="stylesheet" href="pwa.css">';
 html = html.replace('</head>', head + '</head>');
 const install = '<button type="button" class="pwa-install" aria-label="Install app" aria-haspopup="dialog" aria-controls="pwa-dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m-4-4 4 4 4-4M5 15v5h14v-5"/></svg><span data-pwa-text="install">Install app</span></button>';
 html = html.replace('</nav></header>', '</nav>' + install + '</header>');
 html = html.replace('</body>', (await readFile(path.join(extra, 'shell.html'), 'utf8')) + '</body>');
 await writeFile(path.join(destination, 'index.html'), html);
 // Keep the offline shell as data so hosting/browser HTML injections cannot
 // invalidate its pinned bytes. Navigation reconstructs the same HTML document.
 await writeFile(path.join(destination, 'app-shell.json'), JSON.stringify({html}));
 await writeFile(path.join(destination, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Cache-Control: public, max-age=0, must-revalidate\n/sw.js\n  Cache-Control: no-cache, no-store, must-revalidate\n/manifest.webmanifest\n  Content-Type: application/manifest+json\n');
 await writeFile(path.join(destination, '_redirects'), '/brain-garden/* /:splat 301\n');
 const files = [];
 async function walk(dir) {for (const entry of await readdir(dir, {withFileTypes: true})) {const full = path.join(dir, entry.name); if(entry.isDirectory()) await walk(full); else files.push(path.relative(destination, full).split(path.sep).join('/'))}}
 await walk(destination); files.sort();
 const precache = [];
 const worker = await readFile(path.join(extra, 'sw.js'), 'utf8');
 const hash = createHash('sha256').update(worker);
 for (const name of files.filter(name => !['index.html', 'sw.js', '_headers', '_redirects'].includes(name))) {
  const blob = await readFile(path.join(destination, name));
  const integrity = 'sha256-' + createHash('sha256').update(blob).digest('base64');
  hash.update(name + integrity); precache.push({url: './' + name, integrity});
 }
 const version = hash.digest('hex').slice(0, 16);
 await writeFile(path.join(destination, 'sw.js'), worker.replace('__BUILD_ID__', version).replace('/*__PRECACHE__*/ []', JSON.stringify(precache)));
 return {destination, version, assets: precache.length};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildBrainPWA()));
