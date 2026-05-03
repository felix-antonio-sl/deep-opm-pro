// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/user-mgmt/update-user-details/update-user-details.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function UserDetailsComponent_h2_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "h2", 23);
    core /* ɵɵtext */.EFF(1, "Viewer Account");
    core /* ɵɵelementEnd */.k0s();
  }
}
function UserDetailsComponent_button_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 24);
    core /* ɵɵlistener */.bIt("click", function UserDetailsComponent_button_52_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.resetPassword());
    });
    core /* ɵɵtext */.EFF(1, "Reset Password");
    core /* ɵɵelementEnd */.k0s();
  }
}
function UserDetailsComponent_button_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 25);
    core /* ɵɵlistener */.bIt("click", function UserDetailsComponent_button_55_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openSet2AuthenticationFactorsDialog());
    });
    core /* ɵɵtext */.EFF(1, "Set 2 Authentication Factors");
    core /* ɵɵelementEnd */.k0s();
  }
}
let UserDetailsComponent = /*#__PURE__*/(() => {
  class UserDetailsComponent {
    constructor(dialogRef, userService, init) {
      this.dialogRef = dialogRef;
      this.userService = userService;
      this.init = init;
      this.name = "";
      this.photoURL = "";
    }
    ngOnInit() {
      this.user$ = this.userService.user$;
      this.canResetPassword = !this.userService.shouldChangePassword();
      this.orgS = this.userService.userOrg;
      this.canSet2AuthFactors = !environment.serverSideAuth && this.init.oplService.orgOplSettings.auth2Factors && this.init.oplService.orgOplSettings.auth2Factors !== "disabled" && !this.userService.user?.userData?.sso_user;
      // this.isSysAdmin = this.user$.subscribe((val) => {
      //   return val.userData.SysAdmin;
      // });
      // this.isOrgAdmin = this.user$.subscribe((val) => {
      //   return val.userData.OrgAdmin;
      // });
    }
    updateUserDB() {
      const details = {
        Name: this.name,
        PhotoURL: this.photoURL
      };
      this.userService.updateDB(details).then(res => {
        (0, validationAlert)("contact details were saved", null, "Success");
        // this.name = '';
        // this.photoURL = '';
      }).catch(err => {
        (0, validationAlert)("ERROR:" + err, null, "Error");
      });
    }
    resetPassword() {
      const mail = this.userService.user.userData.Email;
      if (this.userService.user.userData.sso_user) {
        return;
      }
      const threeMinutes = 180000;
      const lastResetPasswordTime = localStorage.getItem("lastResetPasswordTime") ? Number(localStorage.getItem("lastResetPasswordTime")) : null;
      if (lastResetPasswordTime && new Date().getTime() - lastResetPasswordTime < threeMinutes) {
        (0, validationAlert)("Too many attempts. Please try again in few minutes.", 5000, "Error");
        return;
      }
      this.userService.resetPassword(mail).then(_ => {
        (0, validationAlert)("Mail with reset details sent to " + mail, null, "Success");
        localStorage.setItem("lastResetPasswordTime", String(new Date().getTime()));
      }).catch(err => (0, validationAlert)("Failed: " + err, null, "Error"));
    }
    shouldShowResetPassword() {
      return !this.userService.user?.userData?.sso_user;
    }
    openSet2AuthenticationFactorsDialog() {
      this.init.dialogService.openDialog(Set2AuthFactorsDialog, 445, 400, {});
    }
    static #_ = (() => this.ɵfac = function UserDetailsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UserDetailsComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: UserDetailsComponent,
      selectors: [["opcloud-udet-dialog"]],
      decls: 56,
      vars: 45,
      consts: [["id", "userDetailsComponent", 1, "userDetailsComponent"], [1, "userDetailsComponentForm"], [1, "header"], ["class", "header", "style", "font-weight: bold; text-decoration: underline; margin-bottom: 46px; margin-left: 295px;", 4, "ngIf"], [1, "fullNameSpan"], [1, "fullName"], ["matInput", "", "name", "uName", 3, "ngModelChange", "placeholder", "ngModel"], [1, "emailSpan"], [1, "email"], ["matInput", "", "disabled", "disabled", "matTooltip", "The Email Address can't be edited", "name", "uEmail", 3, "placeholder"], [1, "profilePicSpan"], [1, "profilePic"], ["alt", "User Profile Picture", 3, "src"], ["mat-raised-button", "", "disabledInteractive", "", "disabled", "", "matTooltip", "In development, please use URL link"], [1, "insertLink"], ["matInput", "", "name", "uPic", 3, "ngModelChange", "placeholder", "ngModel"], [1, "expirationSpan"], [1, "exp-d_header"], ["matInput", "", "disabled", "disabled", "matTooltip", "The Expiration can't be edited, and can be change only by an Admin", "name", "uExpiration", 3, "placeholder"], [1, "userProfileButtons"], ["mat-raised-button", "", "class", "saveChangesBtn", "style", "margin-right: 10px;", 3, "click", 4, "ngIf"], ["mat-raised-button", "", 1, "saveChangesBtn", 3, "click"], ["mat-raised-button", "", "id", "twoAuthButton", "class", "saveChangesBtn", 3, "click", 4, "ngIf"], [1, "header", 2, "font-weight", "bold", "text-decoration", "underline", "margin-bottom", "46px", "margin-left", "295px"], ["mat-raised-button", "", 1, "saveChangesBtn", 2, "margin-right", "10px", 3, "click"], ["mat-raised-button", "", "id", "twoAuthButton", 1, "saveChangesBtn", 3, "click"]],
      template: function UserDetailsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "form", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "User Profile");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(4, UserDetailsComponent_h2_4_Template, 2, 0, "h2", 3);
          core /* ɵɵelementStart */.j41(5, "span", 4)(6, "span", 5);
          core /* ɵɵtext */.EFF(7, "Full Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "mat-form-field")(9, "mat-label");
          core /* ɵɵtext */.EFF(10);
          core /* ɵɵpipe */.nI1(11, "async");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "input", 6);
          core /* ɵɵpipe */.nI1(13, "async");
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UserDetailsComponent_Template_input_ngModelChange_12_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.name, $event)) {
              ctx.name = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(14, "br");
          core /* ɵɵelementStart */.j41(15, "span", 7)(16, "span", 8);
          core /* ɵɵtext */.EFF(17, "Email Address");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "mat-form-field");
          core /* ɵɵelement */.nrm(19, "input", 9);
          core /* ɵɵpipe */.nI1(20, "async");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(21, "br");
          core /* ɵɵelementStart */.j41(22, "span", 10)(23, "span", 11);
          core /* ɵɵtext */.EFF(24, "Profile Picture");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(25, "img", 12);
          core /* ɵɵpipe */.nI1(26, "async");
          core /* ɵɵpipe */.nI1(27, "async");
          core /* ɵɵelementStart */.j41(28, "button", 13);
          core /* ɵɵtext */.EFF(29, "Upload Image");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(30, "br");
          core /* ɵɵelementStart */.j41(31, "span")(32, "span", 14);
          core /* ɵɵtext */.EFF(33, "Or paste URL");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "mat-form-field")(35, "mat-label");
          core /* ɵɵtext */.EFF(36);
          core /* ɵɵpipe */.nI1(37, "async");
          core /* ɵɵpipe */.nI1(38, "async");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(39, "input", 15);
          core /* ɵɵpipe */.nI1(40, "async");
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UserDetailsComponent_Template_input_ngModelChange_39_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.photoURL, $event)) {
              ctx.photoURL = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(41, "br");
          core /* ɵɵelementStart */.j41(42, "span", 16)(43, "span", 17);
          core /* ɵɵtext */.EFF(44, "Expiration Date");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(45, "mat-form-field");
          core /* ɵɵelement */.nrm(46, "input", 18);
          core /* ɵɵpipe */.nI1(47, "async");
          core /* ɵɵpipe */.nI1(48, "async");
          core /* ɵɵpipe */.nI1(49, "date");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(50, "br");
          core /* ɵɵelementStart */.j41(51, "div", 19);
          core /* ɵɵtemplate */.DNE(52, UserDetailsComponent_button_52_Template, 2, 0, "button", 20);
          core /* ɵɵelementStart */.j41(53, "button", 21);
          core /* ɵɵlistener */.bIt("click", function UserDetailsComponent_Template_button_click_53_listener() {
            return ctx.updateUserDB();
          });
          core /* ɵɵtext */.EFF(54, "Save Changes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(55, UserDetailsComponent_button_55_Template, 2, 0, "button", 22);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          let tmp_2_0;
          let tmp_3_0;
          let tmp_6_0;
          let tmp_7_0;
          let tmp_10_0;
          let tmp_11_0;
          let tmp_14_0;
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.userService.user == null ? null : ctx.userService.user.userData == null ? null : ctx.userService.user.userData.isViewerAccount);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵclassProp */.AVh("fullNameInput", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh((tmp_2_0 = core /* ɵɵpipeBind1 */.bMT(11, 22, ctx.user$)) == null ? null : tmp_2_0.userData.Name);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("placeholder", (tmp_3_0 = core /* ɵɵpipeBind1 */.bMT(13, 24, ctx.user$)) == null ? null : tmp_3_0.userData.Name);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.name);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵclassProp */.AVh("emailInput", true);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", (tmp_6_0 = core /* ɵɵpipeBind1 */.bMT(20, 26, ctx.user$)) == null ? null : tmp_6_0.userData.Email);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("src", ((tmp_7_0 = core /* ɵɵpipeBind1 */.bMT(26, 28, ctx.user$)) == null ? null : tmp_7_0.userData.PhotoURL) ? (tmp_7_0 = core /* ɵɵpipeBind1 */.bMT(27, 30, ctx.user$)) == null ? null : tmp_7_0.userData.PhotoURL : "assets/SVG/logoPic.svg", core /* ɵɵsanitizeUrl */.B4B);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵclassProp */.AVh("fileUploadBTN", true);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵclassProp */.AVh("imgUrl", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(((tmp_10_0 = core /* ɵɵpipeBind1 */.bMT(37, 32, ctx.user$)) == null ? null : tmp_10_0.userData.PhotoURL) ? (tmp_10_0 = core /* ɵɵpipeBind1 */.bMT(38, 34, ctx.user$)) == null ? null : tmp_10_0.userData.PhotoURL : "Image URL");
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("placeholder", (tmp_11_0 = core /* ɵɵpipeBind1 */.bMT(40, 36, ctx.user$)) == null ? null : tmp_11_0.userData.PhotoURL);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.photoURL);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵclassProp */.AVh("exp-d_value", true);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ((tmp_14_0 = core /* ɵɵpipeBind1 */.bMT(47, 38, ctx.user$)) == null ? null : tmp_14_0.userData.exp_date) ? core /* ɵɵpipeBind2 */.i5U(49, 42, (tmp_14_0 = core /* ɵɵpipeBind1 */.bMT(48, 40, ctx.user$)) == null ? null : tmp_14_0.userData.exp_date, "dd-MM-yyyy") : "Permanent Access");
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowResetPassword());
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.canSet2AuthFactors);
        }
      },
      dependencies: [NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatButton, fesm2022_forms /* ɵNgNoValidate */.qT, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, AsyncPipe, DatePipe],
      styles: [".userDetailsComponent[_ngcontent-%COMP%]{position:relative;top:50px;padding-left:50px;width:auto}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]{position:relative;margin-bottom:20px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;color:#1a3763}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .fullNameSpan[_ngcontent-%COMP%]{align-items:center}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .fullNameSpan[_ngcontent-%COMP%]   .fullName[_ngcontent-%COMP%]{position:relative;width:203px!important;height:22px;margin-right:32px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .fullNameSpan[_ngcontent-%COMP%]   .fullNameInput[_ngcontent-%COMP%]{position:relative;width:570px;height:46px;left:28px;margin-bottom:16px;border:1px solid rgba(73,114,132,.2);border-radius:6px;color:#1a3763}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .emailSpan[_ngcontent-%COMP%]{align-items:center}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .emailSpan[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%]{position:relative;width:203px;height:22px;margin-right:32px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .emailSpan[_ngcontent-%COMP%]   .emailInput[_ngcontent-%COMP%]{position:relative;width:570px;height:46px;margin-bottom:16px;border:1px solid rgba(73,114,132,.2);border-radius:6px;color:#1a3763}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .profilePicSpan[_ngcontent-%COMP%]{align-items:center}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .profilePicSpan[_ngcontent-%COMP%]   .profilePic[_ngcontent-%COMP%]{position:relative;width:203px;height:22px;margin-right:32px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .profilePicSpan[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;width:114px;height:112px;left:645px;box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .profilePicSpan[_ngcontent-%COMP%]   .fileUploadBTN[_ngcontent-%COMP%]{position:relative;width:450px;height:46px;left:1px;margin-bottom:16px;background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;text-align:center;cursor:pointer;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:16px;color:#1a3763;opacity:.7}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .profilePicSpan[_ngcontent-%COMP%]   .insertLink[_ngcontent-%COMP%]{position:relative;width:102px;height:22px;left:135px;top:-10px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .profilePicSpan[_ngcontent-%COMP%]   .imgUrl[_ngcontent-%COMP%]{position:relative;left:150px;width:333px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:33px;font-size:16px;color:#586d8c}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .expirationSpan[_ngcontent-%COMP%]{align-items:center}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .expirationSpan[_ngcontent-%COMP%]   .exp-d_header[_ngcontent-%COMP%]{top:30px;position:relative;width:203px;height:22px;margin-right:32px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .expirationSpan[_ngcontent-%COMP%]   .exp-d_value[_ngcontent-%COMP%]{position:relative;top:30px;left:-8px;width:570px;height:46px;margin-bottom:16px;border:1px solid rgba(73,114,132,.2);border-radius:6px;color:#1a3763}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .userProfileButtons[_ngcontent-%COMP%]{align-items:center}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .userProfileButtons[_ngcontent-%COMP%]   .saveChangesBtn[_ngcontent-%COMP%]{position:relative;min-width:215px;height:53px;top:65px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:18px;text-align:center;color:#fff;letter-spacing:normal}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .mat-input-placeholder-wrapper[_ngcontent-%COMP%]{position:absolute;left:0;box-sizing:content-box;width:100%;height:50px;overflow:hidden;pointer-events:none}.userDetailsComponent[_ngcontent-%COMP%]   .userDetailsComponentForm[_ngcontent-%COMP%]   .mat-input-wrapper[_ngcontent-%COMP%]{position:relative;left:10px}#twoAuthButton[_ngcontent-%COMP%]{margin-left:10px;width:270px}"]
    }))();
  }
  return UserDetailsComponent;
})();