const CACHE_NAME = "opforja-portable-reader-shell-v1";
const READER_SHELL_PATH = "/portable-reader/index.html";
const CACHEABLE_PATH = (pathname) => {
  if (["/portable-reader/", "/portable-reader/index.html", "/portable-reader/sw.js", "/portable-reader/asset-manifest.json"].includes(pathname)) return true;
  return pathname.startsWith("/assets/") && /\.(?:js|css|mjs|woff2?|ttf|otf|svg|png|webp|ico)$/i.test(pathname);
};

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_READER_ASSETS") return;
  const reply = event.ports?.[0];
  event.waitUntil((async () => {
    try {
      const urls = validateAssetUrls(event.data.manifest?.urls);
      const cache = await caches.open(CACHE_NAME);
      let cachedCount = 0;
      const shellUrls = urls.filter((url) => new URL(url).pathname === READER_SHELL_PATH);
      const resourceUrls = urls.filter((url) => new URL(url).pathname !== READER_SHELL_PATH);
      for (const url of resourceUrls) {
        const response = await fetch(new Request(url, { credentials: "omit", cache: "no-store" }));
        if (!response.ok || response.type === "opaque") throw new Error(`No se pudo guardar un recurso público del lector (${new URL(url).pathname}).`);
        await cache.put(url, response);
        cachedCount += 1;
      }
      // The document shell is replaced last. If any chunk, style, or font failed,
      // an older working shell remains available for offline reading.
      for (const url of shellUrls) {
        const response = await fetch(new Request(url, { credentials: "omit", cache: "no-store" }));
        if (!response.ok || response.type === "opaque") throw new Error("No se pudo guardar la página del lector.");
        await cache.put(url, response);
        cachedCount += 1;
      }
      reply?.postMessage({ ok: true, cachedCount });
    } catch (error) {
      reply?.postMessage({ ok: false, error: error instanceof Error ? error.message : "Falló la preparación sin conexión." });
    }
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !CACHEABLE_PATH(url.pathname)) return;

  if (request.mode === "navigate" && (url.pathname === "/portable-reader/" || url.pathname === "/portable-reader/index.html")) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedShell = await cache.match(new URL(READER_SHELL_PATH, self.location.origin).href);
      return cachedShell ?? fetch(request);
    })());
    return;
  }

  if (url.search || url.hash) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(url.href)) ?? fetch(request);
  })());
});

function validateAssetUrls(values) {
  if (!Array.isArray(values) || values.length < 1 || values.length > 200) throw new Error("La lista de recursos del lector no es válida.");
  const origin = self.location.origin;
  const urls = [...new Set(values.map((value) => {
    if (typeof value !== "string" || value.length > 2_000) throw new Error("La lista contiene una ruta inválida.");
    const url = new URL(value, origin);
    if (url.origin !== origin || url.search || url.hash || !CACHEABLE_PATH(url.pathname)) {
      throw new Error("La lista intenta guardar un recurso fuera del lector público.");
    }
    return url.href;
  }))];
  const paths = new Set(urls.map((url) => new URL(url).pathname));
  if (!paths.has(READER_SHELL_PATH) || !paths.has("/portable-reader/sw.js")) {
    throw new Error("La lista no declara la página y el controlador del lector.");
  }
  return urls;
}
