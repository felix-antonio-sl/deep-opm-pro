// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/CanActivateViaAuthGuard.ts
// Extracted by opm-extracted/tools/extract.mjs

let CanActivateViaAuthGuard = /*#__PURE__*/(() => {
  class CanActivateViaAuthGuard {
    constructor(auth, route, router, user, dialog, orgService) {
      this.auth = auth;
      this.route = route;
      this.router = router;
      this.user = user;
      this.orgService = orgService;
      const that = this;
      user.user$.subscribe(/*#__PURE__*/function () {
        var _ref = (0, default)(function* (user) {
          if (!user.userData.AcceptedEula) {
            dialog.open(UserAgreementComponent, {
              disableClose: true
            }).afterClosed().toPromise().then(closed => {
              if (user.userData.forceToChangeInitialPassword) {
                dialog.open(ResetInitialPasswordComponent, {
                  disableClose: true
                });
              } else {
                location.reload();
              }
            });
          }
          if (user.userData.AcceptedEula && user.userData.forceToChangeInitialPassword) {
            dialog.open(ResetInitialPasswordComponent, {
              disableClose: true
            });
          } else if (!user.userData.multiFactorAuth && user.userData.AcceptedEula && !user.userData.sso_user) {
            const orgSettings = yield that.orgService.getOrganization(user.userData.organization);
            if (orgSettings.auth2Factors === "mandatory" && !environment.serverSideAuth) {
              const config = new MatDialogConfig();
              config.height = "545px";
              config.width = "400px";
              config.backdropClass = "bluredBackground";
              config.disableClose = true;
              config.data = {
                mandatory: true
              };
              dialog.open(Set2AuthFactorsDialog, config);
            }
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    canActivate(route, state) {
      if (route.queryParams.path && route.queryParams.name) {
        this.user.autoload = {
          path: route.queryParams.path,
          name: route.queryParams.name
        };
      }
      return this.auth.authenticated$.pipe((0, map)(bool => {
        if (!bool) {
          this.router.navigate(["/login"]);
        }
        return bool;
      }));
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CanActivateViaAuthGuard)(core /* ɵɵinject */.KVO(AuthenticationService), core /* ɵɵinject */.KVO(ActivatedRoute), core /* ɵɵinject */.KVO(Router), core /* ɵɵinject */.KVO(UserService), core /* ɵɵinject */.KVO(MatDialog), core /* ɵɵinject */.KVO(OrganizationService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: CanActivateViaAuthGuard,
      factory: CanActivateViaAuthGuard.ɵfac
    }))();
  }
  return CanActivateViaAuthGuard;
})();