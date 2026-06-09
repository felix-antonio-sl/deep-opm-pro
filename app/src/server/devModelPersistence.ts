import type { IncomingMessage, ServerResponse } from "node:http";
import { Buffer } from "node:buffer";
import { crearCookieSessionResolver, crearModelPersistenceFetchHandler } from "./modelPersistence";
import { crearRepoMemoria } from "./repoMemoria";

/**
 * Secreto de sesión SOLO para dev/preview. Nunca llega a producción: estos
 * hooks no corren en `bun run build`, y el contenedor usa `model-api` con su
 * propio MODEL_SESSION_SECRET. Sirve para que cada contexto de navegador
 * (cada test de Playwright = contexto nuevo sin cookie) obtenga un tenant
 * aleatorio aislado, evitando contaminación cruzada de workspace/recientes
 * entre tests sobre el repo en memoria compartido.
 */
const SECRETO_SESION_DEV = "deep-opm-dev-preview-session-secret-no-produccion";

/**
 * Middleware dev/preview de persistencia de modelos.
 *
 * En producción nginx proxya `/__deep-opm/{session,workspace,modelos}` al
 * servicio `model-api` (Postgres). En `bun run dev` / `bun run preview` no hay
 * model-api ni Postgres, y desde el corte C5 la persistencia es backend-only
 * (sin storage de navegador). Sin un backend, todos los flujos de
 * guardar/cargar/workspace fallan en dev y en el smoke. Este middleware monta
 * el MISMO handler que producción (`crearModelPersistenceFetchHandler`) sobre
 * un repositorio en memoria (`crearRepoMemoria`), dándole al modelador un
 * backend efímero equivalente sin levantar Postgres.
 *
 * Solo afecta a los servidores dev/preview de vite: los hooks
 * `configureServer`/`configurePreviewServer` no corren durante `bun run build`,
 * así que el artefacto de producción no incluye nada de esto.
 */

type ConnectMiddlewares = {
  use(path: string, handler: (req: IncomingMessage, res: ServerResponse) => void): void;
};

const RUTAS_PERSISTENCIA = [
  "/__deep-opm/session",
  "/__deep-opm/workspace",
  "/__deep-opm/modelos",
];

export function instalarModelPersistenceDevMiddleware(middlewares: ConnectMiddlewares): void {
  // Un único repo en memoria compartido por las tres rutas (mismo proceso dev):
  // la sesión anónima por defecto del handler mantiene un tenant estable, así
  // que los modelos persisten entre requests mientras viva el servidor.
  const handler = crearModelPersistenceFetchHandler({
    repo: crearRepoMemoria(),
    sessionResolver: crearCookieSessionResolver(SECRETO_SESION_DEV),
  });

  const nodeHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      const request = await nodeRequestAFetch(req);
      const response = await handler(request);
      res.statusCode = response.status;
      // set-cookie no debe colapsarse: lo extraemos como lista y copiamos el
      // resto de headers tal cual.
      const setCookies = typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];
      response.headers.forEach((valor, clave) => {
        if (clave.toLowerCase() === "set-cookie") return;
        res.setHeader(clave, valor);
      });
      if (setCookies.length > 0) res.setHeader("set-cookie", setCookies);
      const cuerpo = Buffer.from(await response.arrayBuffer());
      res.end(cuerpo);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : "dev model persistence error" }));
    }
  };

  for (const ruta of RUTAS_PERSISTENCIA) {
    middlewares.use(ruta, (req, res) => {
      void nodeHandler(req, res);
    });
  }
}

async function nodeRequestAFetch(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? "localhost";
  // connect recorta el prefijo de montaje en `req.url`; `originalUrl` conserva
  // la ruta completa que el handler necesita para enrutar por pathname.
  const ruta = (req as IncomingMessage & { originalUrl?: string }).originalUrl ?? req.url ?? "/";
  const url = `http://${host}${ruta}`;
  const method = (req.method ?? "GET").toUpperCase();

  const headers = new Headers();
  for (const [clave, valor] of Object.entries(req.headers)) {
    if (Array.isArray(valor)) {
      for (const item of valor) headers.append(clave, item);
    } else if (typeof valor === "string") {
      headers.set(clave, valor);
    }
  }

  const init: RequestInit = { method, headers };
  if (method !== "GET" && method !== "HEAD") {
    // Los payloads de persistencia son JSON UTF-8; el handler los lee con
    // request.text(). Pasar string evita el desajuste de tipos Buffer↔BodyInit.
    init.body = (await leerCuerpo(req)).toString("utf8");
  }
  return new Request(url, init);
}

function leerCuerpo(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
