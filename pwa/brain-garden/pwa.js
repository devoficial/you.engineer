const strings = {
 en: {
  install: 'Install app', title: 'Brain Garden, on your device', intro: 'Keep the 3D journeys and lessons a tap away.', close: 'Close',
  save: 'Preparing lessons for offline use…', ready: 'Lessons & 3D models are ready offline', offline: 'Offline · lessons & 3D models are ready',
  unavailable: 'Offline setup is unavailable. Reopen the app online to try again.', unsupported: 'This browser does not support offline access.',
  needsConnection: 'Connect once to prepare the offline lessons.', videos: 'YouTube videos and external sources need internet.',
  native: 'Install Brain Garden', ios: 'In Safari, open Share, choose Add to Home Screen, then Add. Turn on Open as Web App if shown.',
  manual: 'Open this site in Chrome, Edge or Safari. In the browser menu, choose Install app, Add to Home Screen, or Add to Dock.',
  installed: 'Brain Garden is installed.', cancelled: 'You can install the app whenever you’re ready.',
  update: 'An update is ready', updateNow: 'Update now', later: 'Later', details: 'App & offline access', connectVideo: 'Connect to watch this video', updating: 'Opening the update…'
 },
 bn: {
  install: 'অ্যাপ ইনস্টল', title: 'তোমার ডিভাইসে মস্তিষ্কের বাগান', intro: 'এক ট্যাপে ত্রিমাত্রিক যাত্রা ও পাঠ খোলো।', close: 'বন্ধ করো',
  save: 'অফলাইনে পড়ার জন্য পাঠ প্রস্তুত হচ্ছে…', ready: 'পাঠ ও ত্রিমাত্রিক মডেল অফলাইনে প্রস্তুত', offline: 'অফলাইন · পাঠ ও ত্রিমাত্রিক মডেল প্রস্তুত',
  unavailable: 'অফলাইনের প্রস্তুতি হয়নি। ইন্টারনেটে যুক্ত হয়ে আবার খোলো।', unsupported: 'এই ব্রাউজারে অফলাইনে পড়া যায় না।',
  needsConnection: 'অফলাইনের পাঠ প্রস্তুত করতে একবার ইন্টারনেটে যুক্ত হও।', videos: 'ইউটিউব ভিডিও ও বাইরের তথ্যসূত্রের জন্য ইন্টারনেট লাগে।',
  native: 'মস্তিষ্কের বাগান ইনস্টল করো', ios: 'Safari-তে Share খুলে Add to Home Screen, তারপর Add বেছে নাও। Open as Web App দেখালে চালু করো।',
  manual: 'Chrome, Edge বা Safari-তে সাইট খোলো। ব্রাউজারের মেনুতে Install app, Add to Home Screen বা Add to Dock বেছে নাও।',
  installed: 'মস্তিষ্কের বাগান ইনস্টল হয়েছে।', cancelled: 'যখন ইচ্ছা অ্যাপটি ইনস্টল করতে পারো।',
  update: 'নতুন সংস্করণ প্রস্তুত', updateNow: 'এখন আপডেট করো', later: 'পরে', details: 'অ্যাপ ও অফলাইনে পড়া', connectVideo: 'ভিডিও দেখতে ইন্টারনেটে যুক্ত হও', updating: 'নতুন সংস্করণ খুলছে…'
 }
};
export function initPWA() {
 const $ = selector => document.querySelector(selector);
 const dialog = $('#pwa-dialog');
 const launch = $('.pwa-install');
 let promptEvent = null, registration = null, ready = false, failed = false, unsupported = false, installed = false, updating = false;
 let installMessage = '', checking = false;
 const standalone = matchMedia('(display-mode: standalone)');
 const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 const copy = () => strings[document.documentElement.lang === 'bn' ? 'bn' : 'en'];
 const isInstalled = () => installed || standalone.matches || navigator.standalone === true;
 const status = () => unsupported ? 'unsupported' : ready ? (navigator.onLine ? 'ready' : 'offline') : !navigator.onLine ? 'needsConnection' : failed ? 'unavailable' : 'save';
 function render() {
  const t = copy();
  document.querySelectorAll('[data-pwa-text]').forEach(el => {el.textContent = t[el.dataset.pwaText]});
  launch.hidden = isInstalled(); launch.setAttribute('aria-label', t.install); launch.title = t.install;
  $('.pwa-close').setAttribute('aria-label', t.close);
  document.querySelectorAll('.pwa-status').forEach(el => {el.textContent = t[status()]; el.dataset.offlineReady = String(ready)});
  $('.pwa-install-native').hidden = !promptEvent || isInstalled();
  $('.pwa-install-help').textContent = t[isInstalled() ? 'installed' : installMessage || (ios ? 'ios' : 'manual')];
  $('.pwa-install-help').hidden = Boolean(promptEvent) && !installMessage;
  if (!registration?.waiting) $('.pwa-notice').hidden = true;
  document.querySelectorAll('.pwa-update').forEach(el => {el.hidden = !registration?.waiting; el.disabled = updating; if (updating) el.textContent = t.updating});
 }
 function showInstall() {render(); if (!dialog.open) dialog.showModal()}
 launch.onclick = showInstall;
 $('.pwa-details').onclick = showInstall;
 $('.pwa-close').onclick = () => dialog.close();
 dialog.addEventListener('click', e => {if (e.target === dialog) {const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close()}});
 window.addEventListener('beforeinstallprompt', event => {event.preventDefault(); promptEvent = event; installMessage = ''; render()});
 window.addEventListener('appinstalled', () => {installed = true; promptEvent = null; render()});
 standalone.addEventListener?.('change', render);
 $('.pwa-install-native').onclick = async () => {
  if (!promptEvent) return;
  const saved = promptEvent; promptEvent = null; render();
  try {await saved.prompt(); const result = await saved.userChoice; installed = result.outcome === 'accepted'; installMessage = installed ? 'installed' : 'cancelled'}
  catch {installMessage = ios ? 'ios' : 'manual'}
  render();
 };
 document.querySelectorAll('.pwa-update').forEach(button => {button.onclick = () => {
  if (!registration?.waiting || updating) return;
  updating = true; render(); registration.waiting.postMessage({type: 'SKIP_WAITING'});
 }});
 $('.pwa-later').onclick = () => {$('.pwa-notice').hidden = true};
 function offerUpdate() {if (registration?.waiting && navigator.serviceWorker.controller) {$('.pwa-notice').hidden = false; render()}}
 async function checkReady() {
  const worker = navigator.serviceWorker?.controller || registration?.active;
  if (!worker || checking) return;
  checking = true;
  const channel = new MessageChannel();
  const timer = setTimeout(() => {checking = false; channel.port1.close()}, 5000);
  channel.port1.onmessage = event => {
   clearTimeout(timer); channel.port1.close(); checking = false;
   if (event.data?.type === 'CACHE_STATUS') {ready = event.data.ready; failed = !ready; render()}
  };
  worker.postMessage({type: 'GET_STATUS'}, [channel.port2]);
 }
 window.addEventListener('offline', () => {render(); checkReady()});
 window.addEventListener('online', () => {render(); checkReady(); registration?.update().catch(() => {})});
 // Keep external video playback from replacing a usable poster with an offline iframe.
 document.addEventListener('click', event => {
  const poster = event.target.closest?.('.video-poster');
  if (poster && !navigator.onLine) {event.preventDefault(); event.stopImmediatePropagation(); const label = poster.querySelector('.video-poster-label'); if(label) label.textContent = copy().connectVideo}
 }, true);
 new MutationObserver(render).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
 render();
 if (!('serviceWorker' in navigator) || !window.isSecureContext) {unsupported = true; render(); return}
 navigator.serviceWorker.addEventListener('controllerchange', () => {if (updating) location.reload(); else checkReady()});
 navigator.serviceWorker.addEventListener('message', event => {
  if (event.data?.type === 'OFFLINE_READY') checkReady();
  if (event.data?.type === 'OFFLINE_ERROR') {if (!ready) failed = true; render(); console.warn('Brain Garden offline setup:', event.data.detail)}
 });
 const register = async () => {
  try {
   registration = await navigator.serviceWorker.register(new URL('sw.js', document.baseURI), {scope: new URL('./', document.baseURI).pathname, updateViaCache: 'none'});
   const watch = worker => worker?.addEventListener('statechange', () => {
    if (worker.state === 'installed') {offerUpdate(); if (!registration.waiting) checkReady()}
    if (worker.state === 'activated') checkReady();
    if (worker.state === 'redundant' && !ready) {failed = true; render()}
   });
   watch(registration.installing);
   registration.addEventListener('updatefound', () => watch(registration.installing));
   offerUpdate(); checkReady();
   navigator.serviceWorker.ready.then(() => checkReady());
  } catch (error) {failed = true; render(); console.warn('Brain Garden offline registration:', error.message)}
 };
 if (document.readyState === 'complete') register(); else window.addEventListener('load', register, {once: true});
}
initPWA();
