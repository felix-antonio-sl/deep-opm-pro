// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/user.service.ts
// Extracted by opm-extracted/tools/extract.mjs

var AuthActionTypes = /*#__PURE__*/function (AuthActionTypes) {
  AuthActionTypes[AuthActionTypes.login = 0] = "login";
  AuthActionTypes[AuthActionTypes.logout = 1] = "logout";
  AuthActionTypes[AuthActionTypes.signup = 2] = "signup";
  return AuthActionTypes;
}(AuthActionTypes || {});
const MAX_SSO_SESSION_TIME = 96; // 96 hours = 4 days.
let UserService = /*#__PURE__*/(() => {
  class UserService {
    // @ts-ignore
    get user() {
      return this.user_;
    }
    constructor(database, authentication, router, opl, organization) {
      var _this = this;
      this.database = database;
      this.authentication = authentication;
      this.router = router;
      this.opl = opl;
      this.organization = organization;
      this.isUserLoggedIn$ = false;
      this.orgAdmin = "OrgAdmin";
      this.sysAdmin = "SysAdmin";
      this.IsInsightsUser = "IsInsightsUser";
      this.IsDSMUser = "IsDSMUser";
      this.IsGenAIUser = "IsGenAIUser";
      this.user_subject = new ReplaySubject(1);
      this.user$ = this.user_subject.asObservable();
      this.fetchUser = /*#__PURE__*/function () {
        var _ref = (0, default)(function* (user) {
          if (!user) {
            return;
          }
          return new Promise((res, rej) => {
            _this.database.driver.findUser(user).then(userData => {
              if (userData) {
                _this.user_subject.next(userData);
              }
              if (userData.userData.sso_user && userData.userData.lastAuthTime) {
                const lastAuth = Number(String(userData.userData.lastAuthTime) + "000");
                const now = new Date().getTime();
                const diffInHours = (now - lastAuth) / 3600000;
                if (diffInHours > MAX_SSO_SESSION_TIME) {
                  _this.authentication.signOut();
                }
              }
              res();
            }).catch(err => {
              rej(err);
            });
          });
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
      authentication.autoSignIn().then(this.fetchUser).catch(err => {});
      const that = this;
      this.authentication.authenticated$.subscribe(authenticated => {
        if (!authenticated) {
          if (this.activeUserPingSubscribe) {
            try {
              module_clearInterval(this.activeUserPingSubscribe);
            } catch (err) {}
          }
          this.router.navigate(["/login"]);
          if (that.user_) {
            location.reload();
          }
        }
      });
      this.user$.subscribe(/*#__PURE__*/function () {
        var _ref2 = (0, default)(function* (user) {
          _this.user_ = user;
          _this.userOrg = user.userData.organization;
          _this.isPublicOrganization = _this.isPublicOrg();
          const isOrgActive = (yield _this.organization.getAllOrgs()).find(item => item.name === user.userData.organization)?.flag;
          if (isOrgActive === false) {
            (0, validationAlert)("Your Organization is Deactivated. Please contact us at: contact@opcloud.tech", 5000);
            _this.router.navigate(["/login"]);
            setTimeout(() => {
              _this.signOutWithFirebase();
              location.reload();
            }, 5000);
            return;
          }
          _this.checkIfCanLoginDueToMaxUsersNumber().then(ans => organization.getOrganization(_this.userOrg)).catch(err => {
            if (err === "Organization not loaded yet") {
              (0, validationAlert)("Your Organization information is still loading. Please try to login again.", 4000);
              _this.router.navigate(["/login"]);
              setTimeout(() => {
                _this.signOutWithFirebase();
                location.reload();
              }, 5000);
            }
            // Otherwise, it's a "max users" or real server error
            const isViewAccountText = user.userData.isViewerAccount ? "view " : "";
            (0, validationAlert)("Your Organization maximal " + isViewAccountText + "users able to connect at the same time has reacehd. Please contact your organization administrator.", 5000);
            _this.router.navigate(["/login"]);
            setTimeout(() => {
              _this.signOutWithFirebase();
              location.reload();
            }, 5000);
          }).then(res => {
            opl.loadOrgSettings(res);
            return organization.getOrganizationOntology();
          }).then(ontology => {
            opl.loadOrgOntologyData(ontology);
            if (_this.autoload) {
              _this.router.navigate(["load"], {
                queryParams: _this.autoload
              });
              _this.autoload = undefined;
              return;
            }
          }).finally(() => {
            opl.loadUserSettings(user.userData.opl);
            const that = _this;
            _this.sendUserPing();
            _this.activeUserPingSubscribe = module_setInterval(function () {
              that.sendUserPing();
            }, 60000);
            _this.authentication.listenForInactivity();
            _this.showAllAdminsPopupMessages();
            _this.opl.areSettingsLoaded = true;
          });
        });
        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
    checkIfCanLoginDueToMaxUsersNumber() {
      if (!this.user?.userData?.organization) {
        // Option A: Reject immediately. The .catch(...) block in the chain can handle it.
        return Promise.reject("Organization not loaded yet");
      }
      // If the org is present, make the real backend call
      return this.database.driver.canLoginDueToMaxUsersNumber(this.user.userData.organization);
    }
    sendUserPing() {
      this.database.driver.sendUserPing(this.user?.uid).then(a => {}).catch(err => {});
    }
    getUserObservable() {
      return this.user$;
    }
    isPublicOrg() {
      return this.user.userData.organization === "Public" && !this.user.userData.orgAdmin && !this.user.userData.sysAdmin;
    }
    //   this.user$.subscribe(user => {
    //     this.user_ = user;
    //     console.log('this.user_ ', this.user_);
    //     if (user)
    //       this.userOrg = user.userData.organization;
    //   });
    // }
    showAllAdminsPopupMessages() {
      var _this2 = this;
      return (0, default)(function* () {
        const messages = yield Promise.all([_this2.database.driver.getAllPopupMessagesToShow("system"), _this2.database.driver.getAllPopupMessagesToShow("org")]);
        const sysMessages = messages[0];
        const orgMessages = messages[1];
        for (const msg of sysMessages) {
          const ret = yield _this2.openAdminPopupMessage(msg, "system");
          if (ret === "signout") {
            return _this2.authentication.signOut();
          }
        }
        for (const msg of orgMessages) {
          yield _this2.openAdminPopupMessage(msg, "org");
        }
      })();
    }
    openAdminPopupMessage(message, type) {
      const init = this.opl.options;
      const dialog = init.dialogService.openDialog(PopupMessageContentComponent, null, 700, {
        doNotClose: type === "system" ? "true" : "false",
        message: message,
        type
      });
      return dialog?.afterClosed().toPromise() || Promise.resolve();
    }
    authAction(type, payload) {
      return this.chooseAuthAction(type, payload);
    }
    updateUserValidationSettings(values) {
      return this.updateUserOplSetting(values);
    }
    chooseAuthAction(type, payload) {
      switch (type) {
        case AuthActionTypes.login:
          {
            if (payload.provider) {
              return this.signInWithProvider(payload.provider);
            } else {
              return this.signInWithMsal();
            }
          }
        /*case AuthActionTypes.signup: {
          return this.signUp(payload.user)
            .then((res) => { this.updateDB(payload.user); });
        }*/
        case AuthActionTypes.logout:
          {
            if (payload.provider) {
              return this.signOutWithFirebase();
            } else {
              return this.signOutWithMsal();
            }
          }
      }
    }
    signInWithProvider(provider) {
      return Promise.reject("Not Implemented");
      // this.signInWithProoviderInterface(provider);
      /*if (!availableProviders.includes(provider)) {
        throw (new Error(`Auth provider is not supported: ${provider}`));
      }
      return this.afAuth.auth.signInWithPopup(new authProviders[provider]());*/
      // return this.auth.signInWithPopup(provider);
    }
    // functions for both ways (Firebase = OPCloud account & msal = Microsoft account). sign in + sign out
    signInWithEmailAndPassword(user, recaptchaVerifier) {
      return this.authentication.signInWithEmailAndPassword(user.Email, user.password, recaptchaVerifier, user.verificationCode).then(res => this.fetchUser(res.user));
    }
    signInWithGoogle() {
      return this.authentication.signInGoogle().then(res => {
        return {
          homeAccountId: res.sub,
          tenantId: res.hd,
          name: res.name,
          username: res.email,
          PhotoURL: res.picture,
          idTokenClaims: {
            tid: res.hd
          }
        };
      }).then(account => this.fetchUserBySSOProvider(account));
    }
    signInWithMsal() {
      return this.authentication.signInMsal().then(res => {
        // cleaning invalid chars.
        if (res.account?.homeAccountId) {
          res.account.homeAccountId = res.account.homeAccountId.split(".").join("").split("-").join("");
        }
        return res.account;
      }).then(account => this.fetchUserBySSOProvider(account));
    }
    updateUserPhotoFromSSO(name, photo) {
      const details = {
        Name: name,
        PhotoURL: photo
      };
      this.updateDB(details).then(res => {}).catch(err => {});
    }
    fetchUserBySSOProvider(user, firstTime = true) {
      var _this3 = this;
      return (0, default)(function* () {
        if (!user) {
          return;
        }
        const that = _this3;
        return new Promise((res, rej) => {
          _this3.database.driver.findUser({
            uid: user.homeAccountId
          }).then(/*#__PURE__*/function () {
            var _ref3 = (0, default)(function* (userData) {
              if (userData && userData.userData?.Email) {
                _this3.user_subject.next(userData);
                if (user.PhotoURL && user.PhotoURL !== "") {
                  that.updateUserPhotoFromSSO(userData.userData.Name, user.PhotoURL);
                  userData.userData.PhotoURL = user.PhotoURL ? user.PhotoURL : userData.userData.PhotoURL;
                }
                res();
              } else if (userData && !userData.email && firstTime) {
                // if succeeded to authenticate using sso provider but still has no user at our system - register it.
                const reg = yield _this3.registerNewUserFromSSO(user);
                if (reg.success) {
                  _this3.fetchUserBySSOProvider(user, false);
                  res();
                } else if (reg.exist?.token?.token) {
                  yield _this3.authentication.signInWithFirebaseToken(reg.exist.token?.token);
                  yield _this3.fetchUser(reg.exist.user);
                  res();
                } else {
                  rej(reg.message);
                }
              }
            });
            return function (_x3) {
              return _ref3.apply(this, arguments);
            };
          }()).catch(/*#__PURE__*/function () {
            var _ref4 = (0, default)(function* (err) {
              res();
            });
            return function (_x4) {
              return _ref4.apply(this, arguments);
            };
          }());
        });
      })();
    }
    getOrganizationBySSOOrgId(org_id) {
      return "Technion";
    }
    registerNewUserFromSSO(userData) {
      const uuid = joint.util.uuid;
      const password = uuid();
      const user = {
        uid: userData.homeAccountId,
        name: userData.name,
        email: userData.username,
        password: password,
        repeatPassword: password,
        organization: userData.idTokenClaims.tid,
        exp_date: "",
        isPermanent: true,
        sso_user: true
      };
      return this.registerUser(user);
    }
    registerUser(user) {
      return this.database.driver.createUser(user);
    }
    signOutWithFirebase(opts) {
      return this.authentication.signOut(opts);
    }
    signOutWithMsal() {
      return this.authentication.signOutWithMsal();
    }
    updateDB(details) {
      return this.updateUser(this.user.uid, this.user.userData.organization, details);
    }
    updateUser(uid, organization, details) {
      const param = this.cleanUserDetails(details);
      if (param.Name === "") {
        param.Name = this.user.userData.Name;
      }
      const userData = this.user.userData;
      return this.database.driver.updateUser(uid, organization, param).then(result => {
        if (this.user.uid !== uid) {
          return;
        }
        Object.keys(param).forEach(function (key) {
          userData[key] = param[key];
        });
      });
    }
    cleanUserDetails(details) {
      const param = {};
      Object.keys(details).forEach(function (key) {
        // if (key === 'exp_date' || (details[key] === true || details[key] === false))
        if (key === "exp_date" || details[key] !== undefined) {
          param[key] = details[key];
        }
      });
      return param;
    }
    updateUserDetails(uid, user) {
      return this.updateUser(uid, this.user.userData.organization, user);
    }
    deleteUser(useruid, params) {
      return this.database.driver.deleteUser(useruid, params);
    }
    resetPassword(user_email) {
      return this.authentication.resetPassword(user_email);
    }
    resetPasswordForNotLoggedUser(email) {
      return this.authentication.resetPasswordForNotLoggedUser(email);
    }
    changePassword(userid, password) {
      return (0, default)(function* () {
        // if (this.database.driver instanceof FirebaseDatabaseDriver)
        //   return Promise.reject('not imp');
        // const driver = <MongoDatabaseDriver>this.database.driver;
        return false;
      })();
    }
    shouldChangePassword() {
      // if (this.database.driver instanceof FirebaseDatabaseDriver)
      //   return false;
      return true;
    }
    isOrgAdmin(user = this.user.userData) {
      if (this.orgAdmin in user) {
        if (user.OrgAdmin) {
          return true;
        }
      }
      return false;
    }
    isSysAdmin(user = this.user.userData) {
      if (this.sysAdmin in user) {
        if (user.SysAdmin) {
          return true;
        }
      }
      return false;
    }
    isInsightsUser(user) {
      if (this.IsInsightsUser in user.userData) {
        return user.userData.IsInsightsUser;
      }
      return false;
    }
    isGenAIUser(user) {
      if (this.IsGenAIUser in user.userData) {
        return user.userData.IsGenAIUser;
      }
      return false;
    }
    isDSMUser(user) {
      if (user && user.userData && this.IsDSMUser in user.userData) {
        return user.userData.IsDSMUser;
      }
      return false;
    }
    updateUserOplSetting(settings) {
      return this.database.driver.updateUserOplSettings(settings).then(result => {
        Object.keys(settings).forEach(key => {
          this.user.userData.opl[key] = settings[key];
        });
      });
    }
    changeUserInitialPassword() {
      return this.database.driver.changeUserInitialPassword(this.user.uid);
    }
    resend2FAVerificationCode(email) {
      return this.database.driver.resend2FAVerificationCode(email);
    }
    getOPLGenAI(user, opdText) {
      return this.database.driver.getOPLfromGenAI(user, opdText);
    }
    getSimpleOPLGenAI(user, opdText) {
      return this.database.driver.getSimpleOPLGenAI(user, opdText);
    }
    updateUserGenAIApiKey(user, apiKey) {
      return this.database.driver.updateUserGenAIApiKey(user, apiKey);
    }
    resetUserGenAIApiKey() {
      return this.database.driver.resetUserGenAIApiKey(this.user.uid);
    }
    getGenAIImpactAnalysis(uid, modelOpl, triplets) {
      var _this4 = this;
      return (0, default)(function* () {
        return _this4.database.driver.getGenAIImpactAnalysis(uid, modelOpl, triplets);
      })();
    }
    getGenAIRequirementsGeneration(uid, modelOpl, triplets) {
      var _this5 = this;
      return (0, default)(function* () {
        return _this5.database.driver.getGenAIRequirementsGeneration(uid, modelOpl, triplets);
      })();
    }
    getGenAIComputationalFunction(user, computationalFunction) {
      var _this6 = this;
      return (0, default)(function* () {
        return _this6.database.driver.getGenAIComputationalFunction(user, computationalFunction);
      })();
    }
    static #_ = (() => this.ɵfac = function UserService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UserService)(core /* ɵɵinject */.KVO(DatabaseService), core /* ɵɵinject */.KVO(AuthenticationService), core /* ɵɵinject */.KVO(Router), core /* ɵɵinject */.KVO(OplService), core /* ɵɵinject */.KVO(OrganizationService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: UserService,
      factory: UserService.ɵfac
    }))();
  }
  return UserService;
})();
