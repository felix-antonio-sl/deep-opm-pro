// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/firebaseAuthDriver.ts
// Extracted by opm-extracted/tools/extract.mjs

let FirebaseAuthDriver = /*#__PURE__*/(() => {
  class FirebaseAuthDriver {
    token() {
      return this.token$;
    }
    constructor(authentication) {
      var _this = this;
      this.authentication = authentication;
      this.token_ = new ReplaySubject(1);
      this.token$ = this.token_.asObservable();
      this.availableProviders = []; // environment.firebaseAuthProviders;
      this.init();
      this.authentication.onIdTokenChanged(/*#__PURE__*/function () {
        var _ref = (0, default)(function* (obs) {
          if (obs) {
            const token = yield obs.getIdToken();
            _this.token_.next(token);
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    init() {
      initializeApp(environment.firebaseCredentials);
    }
    refreshExpiredToken() {
      var _this2 = this;
      return (0, default)(function* () {
        console.log("refreshing token.");
        const user = yield _this2.authentication.currentUser;
        if (user) {
          user.getIdToken(true).then(token => _this2.token_.next(token));
        }
      })();
    }
    signInWith2FactorAuthentication(error, recaptchaVerifier) {
      return (0, default)(function* () {
        const resolver = error.resolver;
        const phoneInfoOptions = {
          multiFactorHint: resolver.hints[0],
          session: resolver.session
        };
        const auth = getAuth();
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = yield phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        const verificationCode = prompt("We sent a code to your phone. Please Enter the code here:");
        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        const ret = yield resolver.resolveSignIn(multiFactorAssertion);
        return ret;
      })();
    }
    add2FactorAuthenticationForUser(recaptchaVerifier, phoneNumber) {
      var _this3 = this;
      return (0, default)(function* () {
        const user = yield _this3.authentication.currentUser;
        const multiFactorSession = yield user.multiFactor.getSession();
        const auth = getAuth();
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const phoneInfoOptions = {
          phoneNumber: phoneNumber,
          session: multiFactorSession
        };
        const verificationId = yield phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        return verificationId;
      })();
    }
    finishAdd2FactorAuthForUser(verificationCode, verificationId) {
      var _this4 = this;
      return (0, default)(function* () {
        const user = yield _this4.authentication.currentUser;
        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        if (user.multiFactor?.enrolledFactors[0]) {
          yield user.multiFactor.unenroll(user.multiFactor?.enrolledFactors[0]);
        }
        return user.multiFactor.enroll(multiFactorAssertion, "My phone number").then(() => {
          return {
            success: true
          };
        }).catch(err => {
          let message = "Unknown error has occurred.";
          if (err.code === "auth/invalid-verification-code") {
            message = "Wrong verification code.";
          }
          return {
            success: false,
            message
          };
        });
      })();
    }
    removeSecondAuthFactorForUser() {
      var _this5 = this;
      return (0, default)(function* () {
        const user = yield _this5.authentication.currentUser;
        return user.multiFactor.unenroll(user.multiFactor?.enrolledFactors[0]);
      })();
    }
    signInWithCustomToken(token) {
      var _this6 = this;
      return (0, default)(function* () {
        return Promise.resolve(yield _this6.authentication.signInWithCustomToken(token));
      })();
    }
    signInAnonymously() {
      var _this7 = this;
      return (0, default)(function* () {
        return Promise.resolve(yield _this7.authentication.signInAnonymously());
      })();
    }
    signInWithEmailAndPassword(email, password) {
      var _this8 = this;
      return (0, default)(function* () {
        /*const promise = this.authentication.auth.signInWithEmailAndPassword(email, password);
        return new Promise<User>((resolve, reject) => {
          promise.then(user => {
            console.log(user);
            alert('Sign');
            this.database.findUser(user).then((userData) => {
              resolve({ ...user, userData });
            }).catch(err => reject(err));
          }).catch(err => reject(err));
        });*/
        return Promise.resolve(yield _this8.authentication.signInWithEmailAndPassword(email, password));
      })();
    }
    autoSignIn() {
      return new Promise((resolve, reject) => this.authentication.authState.subscribe(resolve, reject));
      /*return new Promise<User>((resolve, reject) => {
        this.authentication.authState.subscribe(user => {
          alert('Auto');
          if (!user)
            return reject('Bad Autosing');
          console.log(user)
          resolve({ ...<any>user });
          this.database.findUser(user).then((userData) => {
            resolve({ ...<any>user, userData });
          }).catch(err => reject(err));
        });
      });*/
    }
    signOut() {
      return new Promise((resolve, reject) => {
        this.authentication.signOut().then(res => resolve(true)).catch(err => reject());
      });
    }
    sendPasswordResetEmail(user_email) {
      return new Promise((resolve, reject) => {
        this.authentication.sendPasswordResetEmail(user_email).then(_ => resolve(true));
      });
    }
    signInWithPopup(provider) {
      const authProviders = {
        google: GoogleAuthProvider
      };
      if (!this.availableProviders.includes(provider)) {
        throw new Error(`Auth provider is not supported: ${provider}`);
      }
      return this.authentication.signInWithPopup(new authProviders[provider]());
    }
    getToken() {
      var _this9 = this;
      return (0, default)(function* () {
        const user = yield _this9.authentication.currentUser;
        return new Promise((resolve, reject) => user.getIdToken().then(resolve, reject));
      })();
    }
    static #_ = (() => this.ɵfac = function FirebaseAuthDriver_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FirebaseAuthDriver)(core /* ɵɵinject */.KVO(AngularFireAuth));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: FirebaseAuthDriver,
      factory: FirebaseAuthDriver.ɵfac
    }))();
  }
  return FirebaseAuthDriver;
})();