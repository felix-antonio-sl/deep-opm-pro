const PACKAGE_CACHE = "opforja-portable-packages-v1";
const MAX_PACKAGE_BYTES = 40 * 1024 * 1024;

interface ReaderAssetManifest {
  version: 1;
  urls: string[];
}

export interface CacheReaderAssetsResult {
  cached: boolean;
  cachedCount: number;
  message: string;
}

/** Stores package bytes in a private origin cache; the service worker never intercepts this key. */
export async function storePortablePackage(bytes: Uint8Array): Promise<string> {
  if (bytes.byteLength > MAX_PACKAGE_BYTES) throw new Error("El paquete supera el límite de 40 MB.");
  if (!globalThis.crypto?.randomUUID || typeof caches === "undefined") throw new Error("Este navegador no permite guardar el paquete en este dispositivo.");
  const id = globalThis.crypto.randomUUID();
  const cache = await caches.open(PACKAGE_CACHE);
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  await cache.put(packageKey(id), new Response(copy, { headers: { "content-type": "application/json;charset=utf-8" } }));
  return id;
}

export async function readStoredPortablePackage(id: string): Promise<Uint8Array | null> {
  if (!isPackageId(id) || typeof caches === "undefined") return null;
  const response = await (await caches.open(PACKAGE_CACHE)).match(packageKey(id));
  if (!response) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_PACKAGE_BYTES) throw new Error("El paquete local supera el límite admitido.");
  return bytes;
}

export async function cachePortableReaderAssets(): Promise<CacheReaderAssetsResult> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator) || typeof caches === "undefined") {
    return { cached: false, cachedCount: 0, message: "Este navegador no admite instalar el lector para uso sin conexión." };
  }
  const manifestUrl = new URL("/portable-reader/asset-manifest.json", location.origin);
  const response = await fetch(manifestUrl, { credentials: "omit", cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo leer la lista de recursos públicos del lector.");
  const manifest = parseManifest(await response.json());
  const registration = await navigator.serviceWorker.register("/portable-reader/sw.js", { scope: "/portable-reader/" });
  const worker = await waitForActiveWorker(registration, 15_000);
  if (!worker) throw new Error("El lector aún no está listo para guardar sus recursos.");
  const result = await requestAssetCache(worker, manifest);
  return result;
}

function waitForActiveWorker(registration: ServiceWorkerRegistration, timeoutMs: number): Promise<ServiceWorker> {
  if (registration.active?.state === "activated") return Promise.resolve(registration.active);
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("El lector sin conexión no pudo activarse a tiempo."));
    }, timeoutMs);
    const inspect = () => {
      if (registration.active?.state === "activated") {
        cleanup();
        resolve(registration.active);
      } else if (registration.installing?.state === "redundant" || registration.waiting?.state === "redundant") {
        cleanup();
        reject(new Error("El navegador rechazó la instalación del lector sin conexión."));
      }
    };
    const watch = (worker: ServiceWorker | null) => worker?.addEventListener("statechange", inspect);
    const onUpdateFound = () => {
      watch(registration.installing);
      inspect();
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      registration.removeEventListener("updatefound", onUpdateFound);
      registration.installing?.removeEventListener("statechange", inspect);
      registration.waiting?.removeEventListener("statechange", inspect);
      registration.active?.removeEventListener("statechange", inspect);
    };
    registration.addEventListener("updatefound", onUpdateFound);
    watch(registration.installing);
    watch(registration.waiting);
    watch(registration.active);
    inspect();
  });
}

function parseManifest(value: unknown): ReaderAssetManifest {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("La lista de recursos del lector no tiene el formato esperado.");
  const manifest = value as { version?: unknown; urls?: unknown };
  if (manifest.version !== 1 || !Array.isArray(manifest.urls) || manifest.urls.length === 0 || manifest.urls.length > 200) {
    throw new Error("La lista de recursos del lector está incompleta.");
  }
  const urls = manifest.urls.map((value) => {
    if (typeof value !== "string" || value.length > 2_000) throw new Error("La lista contiene una ruta inválida.");
    const url = new URL(value, location.origin);
    if (url.origin !== location.origin || url.search || url.hash || !isPortablePublicPath(url.pathname)) {
      throw new Error("La lista contiene una ruta fuera del lector público.");
    }
    return url.href;
  });
  const uniqueUrls = [...new Set(urls)];
  if (!uniqueUrls.some((url) => new URL(url).pathname === "/portable-reader/index.html") ||
      !uniqueUrls.some((url) => new URL(url).pathname === "/portable-reader/sw.js")) {
    throw new Error("La versión de desarrollo de este lector no declara todos sus recursos; prepara la copia sin conexión desde el build publicado.");
  }
  return { version: 1, urls: uniqueUrls };
}

function isPortablePublicPath(pathname: string): boolean {
  if (["/portable-reader/", "/portable-reader/index.html", "/portable-reader/sw.js", "/portable-reader/asset-manifest.json"].includes(pathname)) return true;
  if (!pathname.startsWith("/assets/")) return false;
  return /\.(?:js|css|mjs|woff2?|ttf|otf|svg|png|webp|ico)$/i.test(pathname);
}

function requestAssetCache(worker: ServiceWorker, manifest: ReaderAssetManifest): Promise<CacheReaderAssetsResult> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => {
      channel.port1.close();
      reject(new Error("El almacenamiento sin conexión tardó demasiado."));
    }, 20_000);
    channel.port1.onmessage = (event: MessageEvent<unknown>) => {
      window.clearTimeout(timeout);
      channel.port1.close();
      const value = event.data as { ok?: unknown; cachedCount?: unknown; error?: unknown } | null;
      if (!value || value.ok !== true || typeof value.cachedCount !== "number") {
        reject(new Error(typeof value?.error === "string" ? value.error : "No se pudieron guardar los recursos del lector."));
        return;
      }
      resolve({ cached: true, cachedCount: value.cachedCount, message: "Recursos del lector guardados en este dispositivo." });
    };
    worker.postMessage({ type: "CACHE_READER_ASSETS", manifest }, [channel.port2]);
  });
}

function isPackageId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function packageKey(id: string): string {
  return new URL(`/portable-reader/__packages/${encodeURIComponent(id)}`, location.origin).href;
}
