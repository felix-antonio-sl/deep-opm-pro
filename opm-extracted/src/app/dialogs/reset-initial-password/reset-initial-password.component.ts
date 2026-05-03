// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/reset-initial-password/reset-initial-password.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let ResetInitialPasswordComponent = /*#__PURE__*/(() => {
  class ResetInitialPasswordComponent {
    constructor(dialogRef, userService) {
      this.dialogRef = dialogRef;
      this.userService = userService;
    }
    Accept() {
      const that = this;
      this.userService.changeUserInitialPassword().then(() => {
        if (environment.serverSideAuth) {
          return that.userService.resetPasswordForNotLoggedUser(that.userService.user.userData.Email);
        }
        return that.userService.resetPassword(that.userService.user.userData.Email);
      }).then(res => {
        that.userService.signOutWithFirebase({
          server: false
        });
        location.reload();
      });
    }
    Decline() {
      this.userService.signOutWithFirebase({
        server: false
      }).then(res => {
        this.dialogRef.close();
        location.reload();
      });
    }
    static #_ = (() => this.ɵfac = function ResetInitialPasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResetInitialPasswordComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ResetInitialPasswordComponent,
      selectors: [["reset-initial-password"]],
      decls: 21,
      vars: 0,
      consts: [["layout", "row"], ["mat-button", "", 3, "click"]],
      template: function ResetInitialPasswordComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "div")(2, "h2")(3, "strong");
          core /* ɵɵtext */.EFF(4, "Change Your Password");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(5, "span");
          core /* ɵɵtext */.EFF(6, "Changing the initial password is mandatory.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(7, "br");
          core /* ɵɵelementStart */.j41(8, "span");
          core /* ɵɵtext */.EFF(9, "An Email with a reset link will be sent to your Email address.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(10, "br");
          core /* ɵɵelementStart */.j41(11, "span");
          core /* ɵɵtext */.EFF(12, "Declining to reset your password will prevent you from logging into your account.");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(13, "mat-dialog-content")(14, "mat-dialog-actions", 0)(15, "button", 1);
          core /* ɵɵlistener */.bIt("click", function ResetInitialPasswordComponent_Template_button_click_15_listener() {
            return ctx.Accept();
          });
          core /* ɵɵelementStart */.j41(16, "strong");
          core /* ɵɵtext */.EFF(17, "Accept");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(18, "button", 1);
          core /* ɵɵlistener */.bIt("click", function ResetInitialPasswordComponent_Template_button_click_18_listener() {
            return ctx.Decline();
          });
          core /* ɵɵelementStart */.j41(19, "strong");
          core /* ɵɵtext */.EFF(20, "Decline");
          core /* ɵɵelementEnd */.k0s()()()()();
        }
      },
      dependencies: [MatDialogActions, MatDialogContent, MatButton],
      styles: [".mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.mat-mdc-dialog-content[_ngcontent-%COMP%]{overflow:hidden;height:75px}h2[_ngcontent-%COMP%]{text-align:center;color:#1a3763}"]
    }))();
  }
  return ResetInitialPasswordComponent;
})();