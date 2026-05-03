// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/change-password-dialog/change-password-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let ChangePasswordDialogComponent = /*#__PURE__*/(() => {
  class ChangePasswordDialogComponent {
    constructor(dialogRef, data, service) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.service = service;
      this.user = {
        password: "",
        repeatPassword: ""
      };
      this.error = "";
    }
    submit() {
      if (!this.isPasswordMatch()) {
        this.error = "Password doesn't match";
        return;
      }
      this.service.changePassword(this.data.user.uid, this.user.password).then(res => {
        (0, validationAlert)("Successfully updated", null, "Success");
        this.dialogRef.close();
      }, rej => this.error = "this.error");
    }
    isPasswordMatch() {
      return this.user.password === this.user.repeatPassword;
    }
    static #_ = (() => this.ɵfac = function ChangePasswordDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ChangePasswordDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ChangePasswordDialogComponent,
      selectors: [["change-password-dialog"]],
      decls: 15,
      vars: 3,
      consts: [[1, "sign-in-input"], ["matInput", "", "placeholder", "password", "type", "password", 3, "ngModelChange", "ngModel"], ["matInput", "", "placeholder", "repeat password", "type", "password", 3, "ngModelChange", "ngModel"], ["mat-raised-button", "", "color", "primary", 1, "new-user-btn", 3, "click"]],
      template: function ChangePasswordDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "span");
          core /* ɵɵtext */.EFF(1, "Enter New Password:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(2, "br");
          core /* ɵɵelementStart */.j41(3, "mat-form-field", 0)(4, "input", 1);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ChangePasswordDialogComponent_Template_input_ngModelChange_4_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.password, $event)) {
              ctx.user.password = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(5, "br");
          core /* ɵɵelementStart */.j41(6, "mat-form-field", 0)(7, "input", 2);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ChangePasswordDialogComponent_Template_input_ngModelChange_7_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.repeatPassword, $event)) {
              ctx.user.repeatPassword = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(8, "br");
          core /* ɵɵelementStart */.j41(9, "button", 3);
          core /* ɵɵlistener */.bIt("click", function ChangePasswordDialogComponent_Template_button_click_9_listener() {
            return ctx.submit();
          });
          core /* ɵɵtext */.EFF(10, " Change Password\n");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(11, "br")(12, "br");
          core /* ɵɵelementStart */.j41(13, "mat-error");
          core /* ɵɵtext */.EFF(14);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.password);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.repeatPassword);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵtextInterpolate */.JRh(ctx.error);
        }
      },
      dependencies: [MatFormField, MatError, MatInput, MatButton, DefaultValueAccessor, NgControlStatus, NgModel]
    }))();
  }
  return ChangePasswordDialogComponent;
})();