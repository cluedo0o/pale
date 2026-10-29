const C = "scheda-v2";
const FILES = ["./", "index.html", "manifest.json", "icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
// Sempre la versione più recente dalla rete; la cache serve solo offline
self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
