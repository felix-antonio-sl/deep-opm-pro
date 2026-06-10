// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

/**
 * Auth v1 (spec §4, docs/specs/auth-identidad-v1.md): login obligatorio.
 * Bloquea el workbench completo cuando el backend responde 401. Registro
 * cerrado: sin signup ni recuperación self-service (las cuentas las
 * administra el operador por CLI `auth:cuenta`).
 */
export function PantallaLogin() {
  const iniciarSesion = useOpmStore((s) => s.iniciarSesion);
  const mensaje = useOpmStore((s) => s.mensaje);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (event: Event) => {
    event.preventDefault();
    if (!email.trim() || !password || enviando) return;
    setEnviando(true);
    try {
      await iniciarSesion(email, password);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={loginStyles.fondo} data-testid="pantalla-login">
      <form style={loginStyles.tarjeta} onSubmit={(event) => { void enviar(event); }}>
        <span class="opm-label-uppercase" style={loginStyles.kicker}>opforja</span>
        <h1 style={loginStyles.titulo}>Iniciar sesión</h1>
        <label style={loginStyles.label}>
          Email
          <input
            type="email"
            autocomplete="username"
            data-testid="login-email"
            style={loginStyles.input}
            value={email}
            onInput={(event) => setEmail(event.currentTarget.value)}
          />
        </label>
        <label style={loginStyles.label}>
          Contraseña
          <input
            type="password"
            autocomplete="current-password"
            data-testid="login-password"
            style={loginStyles.input}
            value={password}
            onInput={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        {mensaje ? <p style={loginStyles.error} data-testid="login-error" role="alert">{mensaje}</p> : null}
        <button
          type="submit"
          style={loginStyles.boton}
          data-testid="login-submit"
          disabled={!email.trim() || !password || enviando}
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
        <p style={loginStyles.nota}>Acceso por invitación. Las cuentas las administra el operador.</p>
      </form>
    </div>
  );
}

const loginStyles = {
  fondo: {
    position: "fixed" as const,
    inset: 0,
    display: "grid",
    placeItems: "center",
    background: tokens.colors.paper,
    zIndex: 1000,
  },
  tarjeta: {
    display: "grid",
    gap: `${tokens.spacing.md}px`,
    width: "min(360px, 90vw)",
    padding: `${tokens.spacing.xl}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    boxSizing: "border-box" as const,
  },
  kicker: { color: tokens.colors.ink50 },
  titulo: {
    margin: 0,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.xl}px`,
    fontWeight: 400,
    color: tokens.colors.ink,
  },
  label: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  input: {
    padding: "8px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  error: {
    margin: 0,
    color: tokens.colors.accent,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  boton: {
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    padding: `${tokens.spacing.sm}px`,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  nota: {
    margin: 0,
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.xxs}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
