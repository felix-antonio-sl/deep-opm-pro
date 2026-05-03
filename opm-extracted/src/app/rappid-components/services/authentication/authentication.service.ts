// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/authentication/authentication.service.ts
// Extracted by opm-extracted/tools/extract.mjs

var AuthActionTypes = /*#__PURE__*/function (AuthActionTypes) {
  AuthActionTypes[AuthActionTypes.login = 0] = "login";
  AuthActionTypes[AuthActionTypes.logout = 1] = "logout";
  AuthActionTypes[AuthActionTypes.signup = 2] = "signup";
  return AuthActionTypes;
}(AuthActionTypes || {});
const MAX_TIME_WITHOUT_USE = 7200000; // 2 hours
let AuthenticationService = /*#__PURE__*/(() => {
  class AuthenticationService {
    constructor(cookie, authDriver, msal, database) {
      var _this = this;
      this.cookie = cookie;
      this.authDriver = authDriver;
      this.msal = msal;
      this.database = database;
      this.authenticated = new ReplaySubject(1);
      this.authenticated$ = this.authenticated.asObservable();
      this.authenticator = /*#__PURE__*/function () {
        var _ref = (0, default)(function* (value) {
          const authenticated = !!value;
          _this.authenticated.next(authenticated);
          const almostHour = 3300000;
          if (authenticated) {
            module_setInterval(() => _this.authDriver.refreshExpiredToken(), almostHour); // refresh the token every 55 minutes. (it expires after 1 hour)...
          }
          _this.current.token().subscribe(token => _this.updateToken(token));
          return value;
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
    }
    listenForInactivity() {
      if (typeof window !== "undefined") {
        this.lastMouseMoveTime = new Date().getTime();
        window.addEventListener("mousemove", () => {
          this.lastMouseMoveTime = new Date().getTime();
        });
        const interval = module_setInterval(() => {
          if ((0, getInitRappidShared)().currentlyExportingPdf || (0, getInitRappidShared)().currentlyCreatingSystemMap) {
            return;
          }
          if (new Date().getTime() - this.lastMouseMoveTime > MAX_TIME_WITHOUT_USE) {
            this.signOut();
            module_clearInterval(interval);
          }
        }, 60000); // checking once in a minute that the max time without use has not reached. if so - logout.
      }
    }
    signInWithEmailAndPassword(email, password, recaptchaVerifier = undefined, verificationCode = undefined) {
      if (environment.serverSideAuth) {
        return this.authDriver.signInWithEmailAndPassword(email, password, verificationCode).then(res => {
          // implement the relevant code in the future when we will use this for purpose like mongo or AWS and etc...
          this.current = this.authDriver;
          return this.authenticator(res.token).then(() => res);
        }).catch(err => {
          throw new Error(err.error);
        });
      } else {
        return this.authDriver.signInWithEmailAndPassword(email, password).then(value => {
          this.current = this.authDriver;
          return value;
        }).catch(err => {
          this.current = this.authDriver;
          if (err.code === "auth/multi-factor-auth-required") {
            // the user has 2 factor authentication, need to verify the second factor.
            return this.authDriver.signInWith2FactorAuthentication(err, recaptchaVerifier);
          } else if (err.code === "auth/wrong-password") {
            throw new Error("Wrong Password.");
          } else if (err.code === "auth/user-not-found") {
            throw new Error("User does not exist");
          }
        }).then(this.authenticator);
      }
    }
    clearMsalUid(uid) {
      return uid.split(".").join("").split("-").join("");
    }
    initGoogleAuth() {
      var _this2 = this;
      return (0, default)(function* () {
        // Load the auth2 library
        yield new Promise(resolve => {
          gapi.load("auth2", () => resolve());
        });
        // Initialize and cast to GoogleAuth to satisfy TS
        const authInstance = yield gapi.auth2.init({
          client_id: "926349859368-17n61o55faetig1ho793bi6p849p85hg"
        });
        // @ts-ignore
        _this2.googleAuthInstance = authInstance;
      })();
    }
    signInGoogle() {
      var _this3 = this;
      return (0, default)(function* () {
        if (!_this3.googleAuthInstance) {
          yield _this3.initGoogleAuth();
        }
        let data;
        let googleData;
        return _this3.googleAuthInstance.signIn().then(user => {
          googleData = user.getAuthResponse();
          return _this3.database.driver.validateGoogleToken(googleData.id_token);
        }).then(/*#__PURE__*/function () {
          var _ref2 = (0, default)(function* (userData) {
            data = userData;
            _this3.current = _this3.authDriver;
            const newToken = yield _this3.database.driver.getTokenForSSO(googleData.id_token, "google");
            return newToken.token;
          });
          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }()).then(ret => _this3.finishSignInByCustomToken(ret, data));
      })();
    }
    finishSignInByCustomToken(ret, data) {
      var _this4 = this;
      return (0, default)(function* () {
        return _this4.authDriver.signInWithCustomToken(ret.token).then(_this4.authenticator).then(r => data);
      })();
    }
    signInMsal() {
      var _this5 = this;
      let data;
      return this.msal.signInWithPopup(this.msal.availableProviders).then(/*#__PURE__*/function () {
        var _ref3 = (0, default)(function* (userData) {
          data = userData;
          _this5.current = _this5.authDriver;
          data.account.homeAccountId = _this5.clearMsalUid(data.account.homeAccountId);
          const newToken = yield _this5.database.driver.getTokenForSSO(data.idToken, "microsoft");
          return newToken.token;
        });
        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }()).then(ret => this.finishSignInByCustomToken(ret, data));
    }
    updateToken(token) {
      this.token = token;
      if (window.location.host.includes("localhost")) {
        // for local oslc debugging support
        this.cookie.set("auth", token);
      } else {
        // for production oslc support
        this.cookie.set("auth", token, undefined, undefined, "." + window.location.host);
      }
    }
    signInWithFirebaseToken(token) {
      var _this6 = this;
      return (0, default)(function* () {
        try {
          yield _this6.authDriver.signInWithCustomToken(token);
          yield _this6.authenticator(true);
          return {
            success: true
          };
        } catch (err) {
          console.error("Firebase Token Sign-In Failed:", err);
          return {
            success: false,
            message: "Failed to sign in with Firebase token."
          };
        }
      })();
    }
    autoSignIn() {
      // TODO: Add catch
      return Promise.all([this.authDriver.autoSignIn()]).then(res => {
        if (res[0]) {
          this.current = this.authDriver;
        }
        return res[0];
      }).then(this.authenticator);
    }
    removeCookies() {
      if (window.location.host.includes("localhost")) {
        this.cookie.delete("auth");
      } else {
        this.cookie.delete("auth", undefined, "." + window.location.host);
      }
    }
    // Backward-compatible: if called with no args, behavior is unchanged.
    // Use signOut({ server: false, reason: 'KICK' }) to avoid calling the BE on "session replaced".
    signOut(opts) {
      // Defaults: keep original behavior unless explicitly told otherwise
      const server = opts?.server ?? true;
      const reason = opts?.reason ?? "USER";
      const isKick = reason === "KICK";
      // Local cleanup runner (shared)
      const runLocalCleanup = res => {
        try {
          if (res) {
            this.authenticated.next(false);
          } else {
            // Even if authDriver returns false, we still want to mark unauthenticated
            this.authenticated.next(false);
          }
          this.removeCookies();
          // Clear tokens or any stored authentication data
          localStorage.removeItem("auth_token");
          localStorage.removeItem("authToken"); // in case different key is used elsewhere
          sessionStorage.clear();
          // Preserve your current behavior:
          // For minimal change, keep reload (you can later switch to Router navigate if you prefer).
          // If you want to avoid reload on KICK, guard it: if (!isKick) location.reload();
          location.reload();
        } catch (e) {
          console.error("Local cleanup failed:", e);
        }
        return res;
      };
      // ---- LOCAL-ONLY PATH (used for KICK or when caller passes server:false) ----
      if (!server || isKick) {
        // IMPORTANT: no call to this.database.driver.logSignOutUser() here
        return this.authDriver.signOut().then(runLocalCleanup).catch(err => {
          console.error("Local-only sign out failed:", err);
          // Still ensure local state is cleared
          runLocalCleanup(false);
          return false;
        });
      }
      // ---- ORIGINAL BEHAVIOR (default) ----
      return this.database.driver.logSignOutUser().then(() => this.authDriver.signOut()).then(runLocalCleanup).catch(err => {
        console.error("Sign out failed:", err);
        // Prevent loop by handling error gracefully (keep your original fallback)
        this.authenticated.next(false);
        this.removeCookies();
        localStorage.removeItem("auth_token");
        localStorage.removeItem("authToken"); // in case different key is used elsewhere
        sessionStorage.clear();
        // NOTE: you originally didn't reload here on catch; keeping that.
        // If you want to be consistent, you could also call location.reload() here.
        return false;
      });
    }
    signOutWithMsal() {
      return this.database.driver.logSignOutUser() // Log the signout first
      .then(() => this.msal.signOut()) // Perform the actual signout
      .then(res => {
        if (res) {
          this.authenticated.next(false);
        }
        this.removeCookies(); // Remove cookies only after the logout is logged
        return res;
      }).catch(err => {
        console.error("Sign out with MSAL failed:", err);
        return false;
      });
    }
    resetPassword(user_email) {
      return new Promise((resolve, reject) => {
        if (environment.serverSideAuth) {
          return this.resetPasswordForNotLoggedUser(user_email).then(_ => resolve(true));
        }
        return this.authDriver.sendPasswordResetEmail(user_email).then(_ => resolve(true));
      });
    }
    resetPasswordForNotLoggedUser(email) {
      return this.database.driver.resetPasswordForNotLoggedUser(email);
    }
    getToken() {
      return this.token || "";
    }
    refreshExpiredToken() {
      // TODO: we can add here condition for maximal session time and if it reaches that time we can force the user to logout.
      this.authDriver.refreshExpiredToken();
    }
    add2FactorAuthenticationForUser(recaptchaVerifier, phoneNumber) {
      return this.authDriver.add2FactorAuthenticationForUser(recaptchaVerifier, phoneNumber);
    }
    finishAdd2FactorAuthForUser(verificationCode, verificationId) {
      return this.authDriver.finishAdd2FactorAuthForUser(verificationCode, verificationId);
    }
    removeSecondAuthFactorForUser() {
      return this.authDriver.removeSecondAuthFactorForUser();
    }
    static #_ = (() => this.ɵfac = function AuthenticationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthenticationService)(core /* ɵɵinject */.KVO(CookieService), core /* ɵɵinject */.KVO("AuthenticationDriver"), core /* ɵɵinject */.KVO(MsalAuthDriver), core /* ɵɵinject */.KVO(DatabaseService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: AuthenticationService,
      factory: AuthenticationService.ɵfac
    }))();
  }
  return AuthenticationService;
})();