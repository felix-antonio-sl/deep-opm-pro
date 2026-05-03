// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/authInterceptor.ts
// Extracted by opm-extracted/tools/extract.mjs

let AuthInterceptor = /*#__PURE__*/(() => {
  class AuthInterceptor {
    constructor(auth) {
      this.auth = auth;
      this.AUTH_HEADER = "auth";
      // Endpoints that may return "status: 0 / Unknown Error" for non-auth reasons.
      // Add more paths here as needed.
      this.NO_LOGOUT_ON_NETWORK_ENDPOINTS = [/\/flattening\b/i, /\/clustering\b/i, /\/partitioning\b/i];
    }
    handleError(err) {
      // ---- Robust extraction of code/reason/message across FB/Mongo payloads ----
      const body = err?.error;
      // Some backends return a string body, others return an object
      const bodyIsString = typeof body === "string";
      // Try to get a stable 'code' first (Mongo/Firebase structured errors)
      const code = !bodyIsString && (body?.code || body?.reason || body?.error?.code) || ""; // fall back to empty if none
      // Try to get a stable human message (covers string body and nested shapes)
      const message = (bodyIsString ? body : body?.message || body?.error || body?.error_description || "") || "";
      // Normalize casing/whitespace for text detection
      const msgLower = (message || "").toLowerCase();
      const reasonLower = (!bodyIsString && (body?.reason || "") || "").toLowerCase();
      // --------------------------------------------------------------------------
      // 1) Single-active-session: detect "kicked" (last-login-wins) and stop loops
      //    Works for both Mongo and Firebase:
      //      - Structured: { code: 'SESSION_REPLACED' }
      //      - Legacy/plain text: "Another Device Is Logged"
      // --------------------------------------------------------------------------
      const isKicked = err.status === 401 && (code === "SESSION_REPLACED" || message.includes("Another Device Is Logged") || reasonLower.includes("another device is logged"));
      if (isKicked) {
        // IMPORTANT: Do NOT auto-retry/refresh here. Just sign out locally.
        // Ensure your signOut() clears tokens and stops heartbeat/idle timers.
        this.auth.signOut({
          server: false,
          reason: "KICK"
        });
        return throwError_throwError(() => err);
      }
      // ---- 2) No/invalid token special case: DO NOT call server logout ----
      // Covers common texts from BE (Mongo/Express/jwt):
      // "jwt must be provided" / "jwt malformed" / "invalid signature" / "unauthorized"
      const isMissingOrInvalidJwt = err.status === 401 && (msgLower.includes("jwt must be provided") || msgLower.includes("jwt malformed") || msgLower.includes("invalid signature") || code === "UNAUTHORIZED");
      if (isMissingOrInvalidJwt) {
        // If there is no token locally, nothing to do—just bubble up
        const localToken = this.auth.getToken && this.auth.getToken() || localStorage.getItem("auth_token");
        if (localToken) {
          // Clear local session ONLY; DO NOT hit server here
          this.auth.signOut({
            server: false
          });
        }
        return throwError_throwError(() => err);
      }
      // --------------------------------------------------------------------------
      // 2) Keep your existing exceptions where you DO NOT want to sign out
      //    (leave user in place even though it's a 403 with a known reason)
      // --------------------------------------------------------------------------
      const isActionNotAllowed = err.status === 403 && reasonLower.includes("action is not allowed");
      const isOrgNotExist = err.status === 403 && reasonLower.includes("this account is for an organization that does not exist");
      const isDomainBlacklisted = reasonLower.includes("domain is in the blacklist");
      const isSubscriptionExpired = reasonLower.includes("subscription has expired");
      if (isActionNotAllowed || isOrgNotExist || isDomainBlacklisted || isSubscriptionExpired) {
        // Don’t sign out; just surface the error to the caller/UI
        return throwError_throwError(() => err);
      }
      // --------------------------------------------------------------------------
      // 3) Default behavior (unchanged): sign out on other auth-ish failures
      //    - 401/403 we don’t explicitly exempt → sign out
      //    - Network errors (status 0) → do NOT force logout; just bubble the error
      //    - status 0 and Unknown Error → local sign out
      // --------------------------------------------------------------------------
      if (err.status === 0) {
        const url = (err.url || "").toLowerCase();
        // match whitelist
        const isWhitelisted = this.NO_LOGOUT_ON_NETWORK_ENDPOINTS.some(pat => typeof pat === "string" ? url.includes(pat.toLowerCase()) : pat.test(url));
        // If not whitelisted and looks like a transport error, keep your old behavior (local sign-out).
        // If whitelisted, DO NOT sign out — just bubble the error to the caller.
        if (!isWhitelisted && err?.message?.includes("Unknown Error")) {
          this.auth.signOut({
            server: false
          });
        }
        return throwError_throwError(() => err);
      }
      if (err.status === 401 || err.status === 403) {
        // We are already unauthorized → local-only signout to prevent /organization/logSignOut 401 loop
        this.auth.signOut({
          server: false,
          reason: "EXPIRED"
        });
        return throwError_throwError(() => err);
      }
      // Non-auth errors: leave as-is
      return throwError_throwError(() => err);
    }
    intercept(req, next) {
      req = req.clone({
        headers: req.headers.set(this.AUTH_HEADER, this.auth.getToken())
      });
      return next.handle(req).pipe(catchError_catchError(err => this.handleError(err)));
    }
    static #_ = (() => this.ɵfac = function AuthInterceptor_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthInterceptor)(core /* ɵɵinject */.KVO(AuthenticationService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: AuthInterceptor,
      factory: AuthInterceptor.ɵfac
    }))();
  }
  return AuthInterceptor;
})();
