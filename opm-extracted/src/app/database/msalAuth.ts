// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/msalAuth.ts
// Extracted by opm-extracted/tools/extract.mjs

// ****SSO LOGIN HANDLING**** //
let MsalAuthDriver = /*#__PURE__*/(() => {
  class MsalAuthDriver {
    constructor(service) {
      this.service = service;
      this.token_ = new ReplaySubject(1);
      this.token$ = this.token_.asObservable();
      this.availableProviders = []; // environment.firebaseAuthProviders;
      this.service.handleRedirectObservable().subscribe(); // Subscribing to handleRedirectObservable before any other functions both initialize the application and ensures redirects are handled
    }
    token() {
      return this.token$;
    }
    // this is not being used in SSO authentication
    // since Msal package is handling the credentials hendling process.
    signInWithEmailAndPassword(email, password) {
      return (0, default)(function* () {
        return false;
      })();
    }
    // uses the stored access token to have a quick login
    autoSignIn() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("msal-token");
        if (token) {
          this.token_.next(token);
          resolve(true);
          return;
        }
        resolve(false);
      });
    }
    signOut() {
      return firstValueFrom(this.service.logout()).then(() => {
        localStorage.removeItem("msal-token");
        return true;
      });
    }
    sendPasswordResetEmail(user_email) {
      return Promise.reject();
    }
    // signin with Microsoft login popup
    signInWithPopup(provider) {
      return new Promise((resolve, reject) => {
        this.service.loginPopup().subscribe(value => {
          // this.token_.next(value.accessToken);
          localStorage.setItem("msal-token", value.accessToken); // stores the access token
          resolve(value);
        });
      });
    }
    getToken() {
      return firstValueFrom(this.token_);
    }
    signInWithCustomToken(token) {}
    refreshExpiredToken() {}
    signInWith2FactorAuthentication(error, recaptchaVerifier) {
      throw new Error("Method not implemented.");
    }
    add2FactorAuthenticationForUser(recaptchaVerifier, phoneNumber) {
      throw new Error("Method not implemented.");
    }
    finishAdd2FactorAuthForUser(verificationCode, verificationId) {
      throw new Error("Method not implemented.");
    }
    removeSecondAuthFactorForUser() {
      throw new Error("Method not implemented.");
    }
    static #_ = (() => this.ɵfac = function MsalAuthDriver_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MsalAuthDriver)(core /* ɵɵinject */.KVO(MsalService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: MsalAuthDriver,
      factory: MsalAuthDriver.ɵfac
    }))();
  }
  return MsalAuthDriver;
})();