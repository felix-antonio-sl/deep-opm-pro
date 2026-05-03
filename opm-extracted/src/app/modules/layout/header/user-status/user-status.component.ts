// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/header/user-status/user-status.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function UserStatusComponent_div_0_mat_spinner_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "mat-spinner", 7);
  }
}
function UserStatusComponent_div_0_ng_template_3_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 10)(1, "button", 11);
    core /* ɵɵelement */.nrm(2, "opc-avatar", 12);
    core /* ɵɵelementStart */.j41(3, "div", 13)(4, "strong");
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵpipe */.nI1(6, "async");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵelementStart */.j41(8, "small")(9, "p", 14);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵpipe */.nI1(11, "async");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(12, "button", 15);
    core /* ɵɵlistener */.bIt("click", function UserStatusComponent_div_0_ng_template_3_div_1_Template_button_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openSettings());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(13, "svg", 16)(14, "g", 17);
    core /* ɵɵelement */.nrm(15, "rect", 18)(16, "rect", 19);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "svg", 20);
    core /* ɵɵelement */.nrm(18, "path", 21);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(19, "mat-menu", 22, 2)(21, "button", 23);
    core /* ɵɵlistener */.bIt("click", function UserStatusComponent_div_0_ng_template_3_div_1_Template_button_click_21_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.signOut());
    });
    core /* ɵɵelementStart */.j41(22, "mat-icon", 24);
    core /* ɵɵtext */.EFF(23, "exit_to_app");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(24, "span", 24);
    core /* ɵɵtext */.EFF(25, "Sign Out");
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_10_0;
    const menuPerson_r3 = core /* ɵɵreference */.sdS(20);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matMenuTriggerFor", menuPerson_r3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("photoUrl", ctx_r1.userService.user == null ? null : ctx_r1.userService.user.userData.PhotoURL);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI(" ", (tmp_9_0 = core /* ɵɵpipeBind1 */.bMT(6, 4, ctx_r1.user$)) == null ? null : tmp_9_0.userData.Name, " ");
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh((tmp_10_0 = core /* ɵɵpipeBind1 */.bMT(11, 6, ctx_r1.user$)) == null ? null : tmp_10_0.userData.organization);
  }
}
function UserStatusComponent_div_0_ng_template_3_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 25);
    core /* ɵɵlistener */.bIt("click", function UserStatusComponent_div_0_ng_template_3_ng_template_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.signIn());
    });
    core /* ɵɵelementStart */.j41(1, "mat-icon");
    core /* ɵɵtext */.EFF(2, "account_circle");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4, "Sign in");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function UserStatusComponent_div_0_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 8);
    core /* ɵɵtemplate */.DNE(1, UserStatusComponent_div_0_ng_template_3_div_1_Template, 26, 8, "div", 9);
    core /* ɵɵpipe */.nI1(2, "async");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, UserStatusComponent_div_0_ng_template_3_ng_template_3_Template, 5, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
  }
  if (rf & 2) {
    const signInButton_r5 = core /* ɵɵreference */.sdS(4);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", core /* ɵɵpipeBind1 */.bMT(2, 2, ctx_r1.user$))("ngIfElse", signInButton_r5);
  }
}
function UserStatusComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 5);
    core /* ɵɵtemplate */.DNE(1, UserStatusComponent_div_0_mat_spinner_1_Template, 1, 0, "mat-spinner", 6);
    core /* ɵɵpipe */.nI1(2, "async");
    core /* ɵɵtemplate */.DNE(3, UserStatusComponent_div_0_ng_template_3_Template, 5, 4, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const notPending_r6 = core /* ɵɵreference */.sdS(4);
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !core /* ɵɵpipeBind1 */.bMT(2, 2, ctx_r1.user$))("ngIfElse", notPending_r6);
  }
}
function UserStatusComponent_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 15);
    core /* ɵɵlistener */.bIt("click", function UserStatusComponent_button_1_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openSettings());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 16)(2, "g", 17);
    core /* ɵɵelement */.nrm(3, "rect", 18)(4, "rect", 19);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "svg", 20);
    core /* ɵɵelement */.nrm(6, "path", 21);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
let UserStatusComponent = /*#__PURE__*/(() => {
  class UserStatusComponent {
    constructor(oplService, userService, context, dialog, router, viewContainer) {
      this.oplService = oplService;
      this.userService = userService;
      this.context = context;
      this.dialog = dialog;
      this.router = router;
      this.viewContainer = viewContainer;
    }
    ngOnDestroy() {
      this._destroyUserSubscription();
    }
    _destroyUserSubscription() {
      if (this.userSubscription) {
        try {
          this.userSubscription.unsubscribe();
        } catch (e) {}
      }
    }
    _resetUserSubscription() {
      this._destroyUserSubscription();
      this.userSubscription = this.user$.subscribe(result => {
        if (!result) {
          return;
        }
        if (result && result.userData && result.userData.opl && result.userData.opl.logSharingPermission === undefined && this.oplService.orgOplSettings.logCollectingEnabled && !this.oplService.orgOplSettings.ignoreUserLogSharingPermission) {
          const dialogRef = this.dialog.open(LogSharingDialogComponent, {
            disableClose: true,
            data: {
              user: result.userData
            }
          });
        }
      });
    }
    ngOnInit() {
      this.user$ = this.userService.user$;
      this._resetUserSubscription();
      // this.anon = environment.Anonymous.Enabled? environment.Anonymous.Enabled : false;
    }
    signOut() {
      this.userService.signOutWithFirebase().then(() => {
        this.context.newModel();
        location.reload();
        localStorage.clear();
      });
    }
    signIn() {
      this.dialog.open(SignInComponent, {
        viewContainerRef: this.viewContainer
      });
      this.user$ = this.userService.user$;
      this._resetUserSubscription();
    }
    openSettings() {
      (0, getInitRappidShared)().saveWhichTreeNodesAreOpen();
      this.router.navigate(["/settings", {
        outlets: {
          settings_main: ["home"]
        }
      }], {
        skipLocationChange: true
      });
    }
    static #_ = (() => this.ɵfac = function UserStatusComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UserStatusComponent)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(ViewContainerRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: UserStatusComponent,
      selectors: [["opc-user-status"]],
      decls: 2,
      vars: 2,
      consts: [["notPending", ""], ["signInButton", ""], ["menuPerson", "matMenu"], ["class", "user-info", 4, "ngIf"], ["class", "settings_button", "mdtooltip", "settings", 3, "click", 4, "ngIf"], [1, "user-info"], ["color", "accent", "class", "header-spinner", 4, "ngIf", "ngIfElse"], ["color", "accent", 1, "header-spinner"], [1, "button-row"], ["class", "signed-in-user-container", 4, "ngIf", "ngIfElse"], [1, "signed-in-user-container"], ["mat-button", "", 1, "usernamelink", 3, "matMenuTriggerFor"], [3, "photoUrl"], [1, "username"], [1, "orgnmae"], ["mdtooltip", "settings", 1, "settings_button", 3, "click"], ["width", "22", "height", "51", "viewBox", "0 0 22 51", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["opacity", "0.5", "filter", "url(#filter0_d)"], ["width", "22", "height", "50", "rx", "7", "fill", "white", "fill-opacity", "0.07"], ["x", "0.5", "y", "0.5", "width", "21", "height", "49", "rx", "6.5", "stroke", "white"], ["x", "2", "y", "17", "width", "18", "height", "18", "viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "arrow"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M18 9.68697V8.31303C18 7.86676 17.638 7.50475 17.1909 7.50475H16.9686C16.4505 7.50475 15.9988 7.17004 15.831 6.68007C15.7304 6.38438 15.6102 6.09726 15.4729 5.82029C15.2412 5.35295 15.3216 4.79355 15.6906 4.42452L15.8498 4.26535C16.165 3.94937 16.165 3.43756 15.8498 3.12158L14.8784 2.15101C14.5624 1.83503 14.0506 1.83503 13.7346 2.15101L13.5638 2.3211C13.1971 2.68857 12.64 2.77049 12.1735 2.54189C11.8996 2.4077 11.6164 2.28989 11.3246 2.1908C10.8323 2.02384 10.4953 1.57132 10.4953 1.05171V0.809068C10.4953 0.362013 10.1332 0 9.68697 0H8.31303C7.86676 0 7.50475 0.362013 7.50475 0.809068V1.0759C7.50475 1.59239 7.1716 2.04334 6.6832 2.21265C6.39842 2.31095 6.12145 2.4272 5.85384 2.55984C5.38572 2.79156 4.82632 2.7112 4.45728 2.34216L4.26535 2.15101C3.94937 1.83503 3.43756 1.83503 3.12158 2.15101L2.15101 3.12158C1.83503 3.43756 1.83503 3.94937 2.15101 4.26535L2.35386 4.46899C2.72134 4.83646 2.80248 5.39352 2.57388 5.86008C2.44515 6.12457 2.33124 6.39764 2.23449 6.67851C2.06675 7.16926 1.61501 7.50475 1.09618 7.50475H0.809068C0.362793 7.50475 0 7.86676 0 8.31303V9.68697C0 10.1332 0.362793 10.4953 0.809068 10.4953H1.09618C1.61501 10.4953 2.06675 10.8307 2.23449 11.3215C2.33124 11.6024 2.44515 11.8754 2.57388 12.1399C2.80248 12.6065 2.72134 13.1635 2.35386 13.531L2.15101 13.7346C1.83503 14.0506 1.83503 14.5624 2.15101 14.8784L3.12158 15.8498C3.43756 16.165 3.94937 16.165 4.26535 15.8498L4.45728 15.6578C4.82632 15.2888 5.38572 15.2084 5.85384 15.4402C6.12145 15.5728 6.39842 15.689 6.6832 15.7874C7.1716 15.9567 7.50475 16.4076 7.50475 16.9241V17.1909C7.50475 17.638 7.86676 18 8.31303 18H9.68697C10.1332 18 10.4953 17.638 10.4953 17.1909V16.9483C10.4953 16.4287 10.8323 15.9762 11.3246 15.8092C11.6164 15.7101 11.8996 15.5923 12.1735 15.4581C12.64 15.2295 13.1971 15.3114 13.5638 15.6789L13.7346 15.8498C14.0506 16.165 14.5624 16.165 14.8784 15.8498L15.8498 14.8784C16.165 14.5624 16.165 14.0506 15.8498 13.7346L15.6906 13.5755C15.3216 13.2064 15.2412 12.647 15.4729 12.1797C15.6102 11.9027 15.7304 11.6156 15.831 11.3199C15.9988 10.83 16.4505 10.4953 16.9686 10.4953H17.1909C17.638 10.4953 18 10.1332 18 9.68697V9.68697ZM10.0966 13.531C6.70503 14.2824 3.74963 11.3277 4.50175 7.93621C4.88092 6.22679 6.26032 4.84818 7.96896 4.469C11.3605 3.71767 14.3151 6.67228 13.5638 10.0638C13.1846 11.7725 11.806 13.1518 10.0966 13.531V13.531Z", "fill", "white", "fill-opacity", "0.4"], ["xPosition", "before", 2, "color", "#1A3763 !important"], ["mat-menu-item", "", 2, "color", "#1A3763 !important", 3, "click"], [2, "color", "#1A3763 !important"], ["mat-button", "", 3, "click"]],
      template: function UserStatusComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵtemplate */.DNE(0, UserStatusComponent_div_0_Template, 5, 4, "div", 3)(1, UserStatusComponent_button_1_Template, 7, 0, "button", 4);
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.anon);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.anon);
        }
      },
      dependencies: [MatMenu, MatMenuItem, MatMenuTrigger, MatIcon, MatAnchor, MatButton, MatProgressSpinner, AvatarComponent, NgIf, AsyncPipe],
      styles: [".header-spinner[_ngcontent-%COMP%]{height:50px}.settings_button[_ngcontent-%COMP%]{position:relative;top:6px;border:none;background:transparent;margin-top:25px}.user-info[_ngcontent-%COMP%]{position:relative;top:-15px;height:66px}.user-info[_ngcontent-%COMP%]   .signed-in-user-container[_ngcontent-%COMP%]{position:relative;top:-7px;height:66px;margin-left:2px;padding-top:0}.user-info[_ngcontent-%COMP%]   .signed-in-user-container[_ngcontent-%COMP%]   .usernamelink[_ngcontent-%COMP%]{padding:0 10px 0 0;text-transform:none;white-space:nowrap;top:-4px;background-color:none;color:#fff;box-shadow:none;position:relative}.user-info[_ngcontent-%COMP%]   .signed-in-user-container[_ngcontent-%COMP%]   .usernamelink[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%]{display:inline-block;line-height:30px;vertical-align:top;width:calc(100% - 40px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;margin-top:-6px;letter-spacing:normal;font-family:Roboto,Helvetica Neue,sans-serif}.user-info[_ngcontent-%COMP%]   .orgnmae[_ngcontent-%COMP%]{margin-top:-10px}"]
    }))();
  }
  return UserStatusComponent;
})();