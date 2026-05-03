// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/enter-email-verification-code-dialog/enter-email-verification-code-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function EnterEmailVerificationCodeDialog_mat_error_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-error");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.error);
  }
}
function EnterEmailVerificationCodeDialog_mat_form_field_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field")(1, "input", 4);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function EnterEmailVerificationCodeDialog_mat_form_field_6_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.verificationCode, $event)) {
        ctx_r0.verificationCode = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.verificationCode);
  }
}
function EnterEmailVerificationCodeDialog_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 5);
    core /* ɵɵlistener */.bIt("click", function EnterEmailVerificationCodeDialog_button_8_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.verify());
    });
    core /* ɵɵtext */.EFF(1, "verify");
    core /* ɵɵelementEnd */.k0s();
  }
}
function EnterEmailVerificationCodeDialog_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 6);
    core /* ɵɵlistener */.bIt("click", function EnterEmailVerificationCodeDialog_button_9_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.resendCode());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r0.resendDisabled);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.getResendButtonText());
  }
}
let EnterEmailVerificationCodeDialog = /*#__PURE__*/(() => {
  class EnterEmailVerificationCodeDialog {
    constructor(dialogRef, userService, data) {
      this.dialogRef = dialogRef;
      this.userService = userService;
      this.data = data;
      this.resendDisabled = true;
      this.timeLeft = 0;
      this.hideResend = false;
    }
    ngOnInit() {
      const that = this;
      this.countDown();
      setTimeout(function () {
        that.resendDisabled = false;
      }, 61000);
    }
    countDown() {
      if (this.timeLeft > 0) {
        return;
      }
      this.timeLeft = 60;
      const interval = module_setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft = this.timeLeft - 1;
        } else {
          module_clearInterval(interval);
        }
      }, 1000);
    }
    resendCode() {
      this.resendDisabled = true;
      this.countDown();
      this.userService.resend2FAVerificationCode(this.data.user.Email);
    }
    getResendButtonText() {
      const text = "Resend";
      if (this.timeLeft > 0) {
        return text + " (" + this.timeLeft + "s)";
      }
      return text;
    }
    verify() {
      const that = this;
      const user = {
        ...this.data.user,
        verificationCode: this.verificationCode
      };
      this.userService.signInWithEmailAndPassword(user, undefined).then(ret => this.dialogRef.close(true)).catch(err => {
        that.error = err.message;
        if (that.error?.includes("account is locked")) {
          that.hideResend = true;
        }
      });
    }
    static #_ = (() => this.ɵfac = function EnterEmailVerificationCodeDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || EnterEmailVerificationCodeDialog)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: EnterEmailVerificationCodeDialog,
      selectors: [["enter-email-verification-code-dialog"]],
      decls: 10,
      vars: 4,
      consts: [["id", "main"], [4, "ngIf"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["matInput", "", "type", "number", 3, "ngModelChange", "ngModel"], ["mat-button", "", 3, "click"], ["mat-button", "", 3, "click", "disabled"]],
      template: function EnterEmailVerificationCodeDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h3");
          core /* ɵɵtext */.EFF(2, "Please Enter The verification code that was sent to your Email:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "div");
          core /* ɵɵtemplate */.DNE(5, EnterEmailVerificationCodeDialog_mat_error_5_Template, 2, 1, "mat-error", 1)(6, EnterEmailVerificationCodeDialog_mat_form_field_6_Template, 2, 1, "mat-form-field", 1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div");
          core /* ɵɵtemplate */.DNE(8, EnterEmailVerificationCodeDialog_button_8_Template, 2, 0, "button", 2)(9, EnterEmailVerificationCodeDialog_button_9_Template, 2, 2, "button", 3);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.error);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.hideResend);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.hideResend);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.hideResend);
        }
      },
      dependencies: [NgIf, MatFormField, MatError, MatInput, MatButton, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgModel],
      styles: ["h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-top:3px}#main[_ngcontent-%COMP%]{text-align:center}mat-mdc-form-field[_ngcontent-%COMP%]{width:75px;text-align:center}.mat-mdc-form-field.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.mat-mdc-form-field-underline[_ngcontent-%COMP%], .mat-mdc-form-field-ripple[_ngcontent-%COMP%]{background-color:#1a3763!important}button[_ngcontent-%COMP%]{color:#1a3763}input[_ngcontent-%COMP%]::-webkit-outer-spin-button, input[_ngcontent-%COMP%]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}"]
    }))();
  }
  return EnterEmailVerificationCodeDialog;
})();