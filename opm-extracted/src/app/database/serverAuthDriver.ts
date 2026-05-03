// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/serverAuthDriver.ts
// Extracted by opm-extracted/tools/extract.mjs

let ServerAuthDriver = /*#__PURE__*/(() => {
  class ServerAuthDriver {
    constructor(database) {
      this.database = database;
      this.token_ = new ReplaySubject(1);
      this.token$ = this.token_.asObservable();
    }
    token() {
      return this.token$;
    }
    signInWithEmailAndPassword(email, password, verificationCode) {
      return this.database.driver.signInWithEmailAndPassword(email, password, verificationCode).then(data => {
        this.token_.next(data.token);
        localStorage.setItem("auth_token", data.token);
        return data;
      });
    }
    autoSignIn() {
      var _this = this;
      return (0, default)(function* () {
        const token = localStorage.getItem("auth_token");
        if (token) {
          _this.token_.next(token);
          return fetch(environment.apiTarget + "/user", {
            method: "GET",
            headers: {
              auth: token
            }
          }).then(res => res.json());
        }
        return Promise.resolve(false);
      })();
    }
    sendPasswordResetEmail(user_email) {
      return Promise.resolve(false);
    }
    signInWithPopup(provider) {}
    signOut() {
      localStorage.removeItem("auth_token");
      return Promise.resolve(false);
    }
    signInWithCustomToken(token) {
      this.token_.next(token.token);
      return Promise.resolve(token.token);
    }
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
    static #_ = (() => this.ɵfac = function ServerAuthDriver_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ServerAuthDriver)(core /* ɵɵinject */.KVO(DatabaseService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ServerAuthDriver,
      factory: ServerAuthDriver.ɵfac
    }))();
  }
  return ServerAuthDriver;
})();