// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/header/sign-in/sign-in.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function SignInComponent_mat_form_field_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 5)(1, "input", 14);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SignInComponent_mat_form_field_6_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.user.Name, $event)) {
        ctx_r1.user.Name = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.user.Name);
  }
}
function SignInComponent_mat_form_field_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 5)(1, "input", 15);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SignInComponent_mat_form_field_15_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.user.repeatPassword, $event)) {
        ctx_r1.user.repeatPassword = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.user.repeatPassword);
  }
}
function SignInComponent_mat_form_field_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 5)(1, "input", 16);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SignInComponent_mat_form_field_16_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.user.PhotoURL, $event)) {
        ctx_r1.user.PhotoURL = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.user.PhotoURL);
  }
}
function SignInComponent_div_17_mat_option_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r5 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r5);
  }
}
function SignInComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 17)(1, "mat-select", 18)(2, "mat-optgroup", 19);
    core /* ɵɵtemplate */.DNE(3, SignInComponent_div_17_mat_option_3_Template, 2, 1, "mat-option", 20);
    core /* ɵɵpipe */.nI1(4, "async");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(5, "br")(6, "br")(7, "br");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(4, 1, ctx_r1.orgS));
  }
}
function SignInComponent_mat_error_24_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-error");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.authError);
  }
}
let SignInComponent = /*#__PURE__*/(() => {
  class SignInComponent {
    constructor(dialogRef, router, userService, auth, dialogService) {
      this.dialogRef = dialogRef;
      this.router = router;
      this.userService = userService;
      this.auth = auth;
      this.dialogService = dialogService;
      this.user = {
        Name: "",
        Email: "",
        password: "",
        repeatPassword: "",
        Organization: "",
        PhotoURL: ""
      };
      this.signUp = false;
      this.authError = null;
      this.defaultOrg = null;
    }
    signInWithGoogle() {
      this.authError = null;
    }
    ngAfterViewInit() {
      if (!environment.serverSideAuth) {
        const auth = getAuth();
        this.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container",
        // Optional reCAPTCHA parameters.
        {
          size: "normal",
          callback: function (response) {},
          "expired-callback": function () {
            // Response expired. Ask user to solve reCAPTCHA again.
          }
        });
      }
    }
    signInWithPassword() {
      this.authError = null;
      if (!this.isPasswordMatch() && this.signUp) {
        this.authError = "Password and Repeat-Password doesn't Match";
        return;
      }
      this.userService.signInWithEmailAndPassword(this.user, this.recaptchaVerifier).then(res => {
        this.dialogRef.close();
        this.router.navigate([""]);
      }).catch(err => {
        if (err.code === "auth/argument-error") {
          this.authError = "Invalid verification code.";
        } else if (err.message.includes("verification code was sent")) {
          (0, validationAlert)("A verification code was sent to your Email.");
          const dialog = this.dialogService.openDialog(EnterEmailVerificationCodeDialog, 285, 415, {
            user: this.user,
            allowMultipleDialogs: true
          });
          dialog.afterClosed().toPromise().then(success => {
            if (success) {
              this.dialogRef.close();
              this.router.navigate([""]);
            }
          });
        } else {
          this.authError = err.error?.reason || err.message;
        }
      });
    }
    forgotPassword() {
      const email = this.user.Email;
      if (email === "" || !this.validateEmail(String(email))) {
        const msg = "The Email is not valid";
        (0, validationAlert)(msg, 3500, "Error");
        this.authError = "The Email is not valid";
        return;
      }
      this.userService.resetPasswordForNotLoggedUser(email).then(msg => (0, validationAlert)(msg, 5000, "Warning")).catch(err => (0, validationAlert)("Failed: " + err.error, 5000, "Warning"));
      this.authError = null;
    }
    validateEmail(email) {
      const re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      return re.test(email.toLowerCase());
    }
    isPasswordMatch() {
      return this.user.password === this.user.repeatPassword;
    }
    static #_ = (() => this.ɵfac = function SignInComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SignInComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(AuthenticationService), core /* ɵɵdirectiveInject */.rXU(DialogService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SignInComponent,
      selectors: [["opc-sign-in"]],
      decls: 25,
      vars: 9,
      consts: [[1, "sign-in-wrapper"], [1, "sign-in"], ["fxLayout", "column", "fxLayoutAlign", "center center"], [2, "padding", "16px", "text-align", "center"], ["class", "sign-in-input", 4, "ngIf"], [1, "sign-in-input"], ["matInput", "", "id", "email", "placeholder", "Email", "type", "email", 3, "ngModelChange", "ngModel"], ["matInput", "", "id", "password", "placeholder", "Password", "type", "password", 3, "ngModelChange", "ngModel"], ["class", "sign-in-input", "flex", "", 4, "ngIf"], ["mat-raised-button", "", "id", "submit-button", 1, "sign-in-btn", 3, "click"], ["id", "recaptcha-container", 2, "display", "flex", "justify-content", "center"], ["id", "forgotPassword", "align", "center", 1, "sign-in-input", 3, "click"], ["id", "forgotText"], [4, "ngIf"], ["matInput", "", "placeholder", "Name", 3, "ngModelChange", "ngModel"], ["matInput", "", "placeholder", "Repeat password", "type", "password", 3, "ngModelChange", "ngModel"], ["matInput", "", "placeholder", "Photo URL", "type", "url", 3, "ngModelChange", "ngModel"], ["flex", "", 1, "sign-in-input"], ["placeholder", "Oraganization", "ng-model", "user.Organization"], ["label", "Select Organization"], [4, "ngFor", "ngForOf"]],
      template: function SignInComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
          core /* ɵɵtext */.EFF(4);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "mat-card", 3);
          core /* ɵɵtemplate */.DNE(6, SignInComponent_mat_form_field_6_Template, 2, 1, "mat-form-field", 4);
          core /* ɵɵelementStart */.j41(7, "mat-form-field", 5)(8, "mat-label");
          core /* ɵɵtext */.EFF(9, "Email");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "input", 6);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SignInComponent_Template_input_ngModelChange_10_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.Email, $event)) {
              ctx.user.Email = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "mat-form-field", 5)(12, "mat-label");
          core /* ɵɵtext */.EFF(13, "Password");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "input", 7);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SignInComponent_Template_input_ngModelChange_14_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.password, $event)) {
              ctx.user.password = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(15, SignInComponent_mat_form_field_15_Template, 2, 1, "mat-form-field", 4)(16, SignInComponent_mat_form_field_16_Template, 2, 1, "mat-form-field", 4)(17, SignInComponent_div_17_Template, 8, 3, "div", 8);
          core /* ɵɵelementStart */.j41(18, "button", 9);
          core /* ɵɵlistener */.bIt("click", function SignInComponent_Template_button_click_18_listener() {
            return ctx.signInWithPassword();
          });
          core /* ɵɵtext */.EFF(19);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(20, "div", 10);
          core /* ɵɵelementStart */.j41(21, "a", 11);
          core /* ɵɵlistener */.bIt("click", function SignInComponent_Template_a_click_21_listener() {
            return ctx.forgotPassword();
          });
          core /* ɵɵelementStart */.j41(22, "span", 12);
          core /* ɵɵtext */.EFF(23, "Forgot Your Password?");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(24, SignInComponent_mat_error_24_Template, 2, 1, "mat-error", 13);
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI("Sign ", ctx.signUp ? "Up" : "In", "");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.signUp);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.Email);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.password);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.signUp);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.signUp);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.signUp);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate1 */.SpI(" Sign ", ctx.signUp ? "Up" : "In", " ");
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.authError);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatError, MatInput, MatSelect, MatOption, MatOptgroup, MatButton, MatCard, DefaultValueAccessor, NgControlStatus, NgModel, AsyncPipe],
      styles: [".sign-in-wrapper[_ngcontent-%COMP%]{height:100%;box-sizing:border-box;font-family:Roboto,sans-serif}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]{margin:0 auto;width:320px}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .mat-mdc-form-field[_ngcontent-%COMP%]{width:100%}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0;font-weight:300;text-align:center;color:#0000008a}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{padding-top:50px;padding-bottom:36px;font-size:24px}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{padding-top:8px;padding-bottom:10px;font-size:18px}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn[_ngcontent-%COMP%]{margin-bottom:10px;padding:6px 24px;width:100%;text-align:left;font-weight:600;height:48px}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   button.auth-google[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn.auth-google[_ngcontent-%COMP%]{background-color:#fff;color:#727272}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   button.auth-facebook[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn.auth-facebook[_ngcontent-%COMP%]{background-color:#3b5998;color:#fff}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   button.auth-twitter[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn.auth-twitter[_ngcontent-%COMP%]{background-color:#55acee;color:#fff}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   button.auth-github[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn.auth-github[_ngcontent-%COMP%]{background-color:#333;color:#fff}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{margin-right:12px}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-or-up[_ngcontent-%COMP%]{line-height:14px;color:gray;padding-bottom:10px}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-or-up[_ngcontent-%COMP%]   .sign-in-input[_ngcontent-%COMP%]{width:100%}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   .sign-in-btn[_ngcontent-%COMP%]{text-align:center;background:#1a3763;color:#d3d3d3}.sign-in-wrapper[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]   #forgotText[_ngcontent-%COMP%]{font-weight:300;color:gray}"]
    }))();
  }
  return SignInComponent;
})();