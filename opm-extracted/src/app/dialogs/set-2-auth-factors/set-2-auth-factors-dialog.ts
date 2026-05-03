// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/set-2-auth-factors/set-2-auth-factors-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function Set2AuthFactorsDialog_h4_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "h4");
    core /* ɵɵtext */.EFF(1, "Your Organization require you to set a second authentication factor");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_span_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "→ ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_span_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "→ ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_span_14_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "→ ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_16_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 1");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_16_span_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 4");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_16_span_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "Please Enter Your Account Password:");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_16_span_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 15);
    core /* ɵɵtext */.EFF(1, "Enter The Phone Number You Would Like To Set:");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_16_br_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function Set2AuthFactorsDialog_div_16_input_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 16);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Set2AuthFactorsDialog_div_16_input_6_Template_input_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.userPassword, $event)) {
        ctx_r1.userPassword = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.userPassword);
  }
}
function Set2AuthFactorsDialog_div_16_input_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 17);
    core /* ɵɵlistener */.bIt("keyup", function Set2AuthFactorsDialog_div_16_input_7_Template_input_keyup_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.phoneNumberKeyUp());
    });
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Set2AuthFactorsDialog_div_16_input_7_Template_input_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.phoneNumber, $event)) {
        ctx_r1.phoneNumber = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.phoneNumber);
  }
}
function Set2AuthFactorsDialog_div_16_br_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function Set2AuthFactorsDialog_div_16_span_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 18);
    core /* ɵɵtext */.EFF(1, "*Use the format: +[Country code][Area Code][Phone Number]");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 5);
    core /* ɵɵtemplate */.DNE(1, Set2AuthFactorsDialog_div_16_span_1_Template, 2, 0, "span", 6)(2, Set2AuthFactorsDialog_div_16_span_2_Template, 2, 0, "span", 6)(3, Set2AuthFactorsDialog_div_16_span_3_Template, 2, 0, "span", 1)(4, Set2AuthFactorsDialog_div_16_span_4_Template, 2, 0, "span", 10)(5, Set2AuthFactorsDialog_div_16_br_5_Template, 1, 0, "br", 1)(6, Set2AuthFactorsDialog_div_16_input_6_Template, 1, 1, "input", 11)(7, Set2AuthFactorsDialog_div_16_input_7_Template, 1, 1, "input", 12)(8, Set2AuthFactorsDialog_div_16_br_8_Template, 1, 0, "br", 1)(9, Set2AuthFactorsDialog_div_16_span_9_Template, 2, 0, "span", 13);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.thirdStep && ctx_r1.firstStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.thirdStep && ctx_r1.secondStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.firstStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep && !ctx_r1.thirdStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep && !ctx_r1.thirdStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.firstStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep && !ctx_r1.thirdStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep && !ctx_r1.thirdStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep && !ctx_r1.thirdStep);
  }
}
function Set2AuthFactorsDialog_div_17_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 7");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 5);
    core /* ɵɵtemplate */.DNE(1, Set2AuthFactorsDialog_div_17_span_1_Template, 2, 0, "span", 6);
    core /* ɵɵelementStart */.j41(2, "input", 19);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Set2AuthFactorsDialog_div_17_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.verificationCode, $event)) {
        ctx_r1.verificationCode = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "button", 20);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_17_Template_button_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.resendCode());
    });
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.verificationCode);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.resendDisabled);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getResendButtonText());
  }
}
function Set2AuthFactorsDialog_span_19_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 2");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_span_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 5");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_span_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 8");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_23_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 3");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_23_span_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 14);
    core /* ɵɵtext */.EFF(1, "Step 6");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_23_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 23);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_23_button_3_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.verifyPassword());
    });
    core /* ɵɵtext */.EFF(1, "Verify Password");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_23_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 24);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_23_button_4_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.sendVerificationCode());
    });
    core /* ɵɵtext */.EFF(1, "Send Me Code");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_23_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 5);
    core /* ɵɵtemplate */.DNE(1, Set2AuthFactorsDialog_div_23_span_1_Template, 2, 0, "span", 6)(2, Set2AuthFactorsDialog_div_23_span_2_Template, 2, 0, "span", 6)(3, Set2AuthFactorsDialog_div_23_button_3_Template, 2, 0, "button", 21)(4, Set2AuthFactorsDialog_div_23_button_4_Template, 2, 0, "button", 22);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.firstStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.firstStep);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showSendCode && ctx_r1.secondStep);
  }
}
function Set2AuthFactorsDialog_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 5)(1, "span", 14);
    core /* ɵɵtext */.EFF(2, "Last Step");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "button", 25);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_24_Template_button_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.applyNewNumber());
    });
    core /* ɵɵtext */.EFF(4, "Set This Phone Number");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function Set2AuthFactorsDialog_div_25_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 30);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_25_button_3_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeSecondAuthFactor());
    });
    core /* ɵɵtext */.EFF(1, "Delete Second Auth Factor If Exists");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_25_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 31);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_25_button_4_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.logout());
    });
    core /* ɵɵtext */.EFF(1, "Log Out");
    core /* ɵɵelementEnd */.k0s();
  }
}
function Set2AuthFactorsDialog_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 26)(1, "span", 27);
    core /* ɵɵtext */.EFF(2, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, Set2AuthFactorsDialog_div_25_button_3_Template, 2, 0, "button", 28)(4, Set2AuthFactorsDialog_div_25_button_4_Template, 2, 0, "button", 29);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.secondStep && !ctx_r1.data.mandatory);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.data.mandatory);
  }
}
function Set2AuthFactorsDialog_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 32)(1, "button", 24);
    core /* ɵɵlistener */.bIt("click", function Set2AuthFactorsDialog_div_26_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.stepBack());
    });
    core /* ɵɵtext */.EFF(2, "< Back");
    core /* ɵɵelementEnd */.k0s()();
  }
}
let Set2AuthFactorsDialog = /*#__PURE__*/(() => {
  class Set2AuthFactorsDialog {
    constructor(dialogRef, authService, userService, data) {
      this.dialogRef = dialogRef;
      this.authService = authService;
      this.userService = userService;
      this.data = data;
      this.resendDisabled = false;
      this.isRecaptchaSolved = false;
      this.timeLeft = 0;
      this.phoneNumber = "";
      this.showSendCode = false;
      this.userPassword = "";
      this.firstStep = true;
      this.secondStep = false;
      this.secondStep = false;
      this.verificationCode = "";
    }
    ngOnInit() {}
    ngAfterViewInit() {
      const that = this;
      const auth = getAuth();
      this.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        callback: function (response) {}
      });
      this.recaptchaVerifier.render().then(widgetId => this.recaptchaWidgetId = widgetId);
    }
    sendVerificationCode() {
      var _this = this;
      return (0, default)(function* () {
        if (!_this.phoneNumber.startsWith("+")) {
          (0, validationAlert)("Your phone number is invalid. It must start with \"+\"", 5000, "error");
          return;
        } else if (_this.phoneNumber.length < 11) {
          (0, validationAlert)("Your phone number is invalid. It is too short.", 5000, "error");
          return;
        }
        try {
          const that = _this;
          setTimeout(function () {
            that.resendDisabled = false;
          }, 60000);
          _this.verificationId = yield _this.authService.add2FactorAuthenticationForUser(_this.recaptchaVerifier, _this.phoneNumber);
          _this.thirdStep = true;
          _this.dialogRef.updateSize(undefined, _this.data.mandatory ? "495px" : "470px");
          that.resendDisabled = true;
          _this.countDown();
        } catch (e) {
          (0, validationAlert)("Invalid phone format or this number is already in use.", 5000, "error");
        }
      })();
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
    verifyPassword() {
      const that = this;
      const nextOperation = () => {
        that.firstStep = false;
        that.secondStep = true;
        that.showSendCode = true;
        that.dialogRef.updateSize(undefined, this.data.mandatory ? "550px" : "520px");
      };
      this.authService.signInWithEmailAndPassword(this.userService.user.userData.Email, this.userPassword, this.recaptchaVerifier).then(() => {
        nextOperation();
      }).catch(err => {
        if (err.code === "auth/multi-factor-auth-required") {
          nextOperation();
        } else if (err.message === "Wrong Password.") {
          (0, validationAlert)(err.message, 3500, "error");
        }
      });
    }
    stepBack() {
      this.showSendCode = true;
      this.thirdStep = false;
      this.timeLeft = 0;
      this.dialogRef.updateSize(undefined, this.data.mandatory ? "550px" : "520px");
    }
    applyNewNumber() {
      this.authService.finishAdd2FactorAuthForUser(this.verificationCode, this.verificationId).then(res => {
        if (res.success) {
          (0, validationAlert)("Success", 3500, "Success");
          this.dialogRef.close();
        } else {
          (0, validationAlert)(res.message, 3500, "error");
        }
      });
    }
    removeSecondAuthFactor() {
      this.authService.removeSecondAuthFactorForUser().then(() => {
        (0, validationAlert)("Success", 3500, "Success");
        this.dialogRef.close();
      });
    }
    logout() {
      this.authService.signOut();
    }
    phoneNumberKeyUp() {
      const allowedChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+"];
      const splitted = this.phoneNumber.split("");
      for (let i = splitted.length - 1; i >= 0; i--) {
        if (!allowedChars.includes(splitted[i])) {
          splitted.splice(i, 1);
        }
      }
      this.phoneNumber = splitted.join("");
    }
    resendCode() {
      if (this.isRecaptchaSolved) {
        this.sendVerificationCode();
        this.resendDisabled = true;
        this.isRecaptchaSolved = false;
        this.countDown();
      } else {
        (0, validationAlert)("First verify that you are not a robot.", 5000, "Error");
        this.recaptchaVerifier.verify().then(() => {
          this.isRecaptchaSolved = true;
        }).catch(err => {});
      }
    }
    getResendButtonText() {
      const text = "Resend";
      if (this.timeLeft > 0) {
        return text + " (" + this.timeLeft + "s)";
      }
      return text;
    }
    static #_ = (() => this.ɵfac = function Set2AuthFactorsDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || Set2AuthFactorsDialog)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(AuthenticationService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: Set2AuthFactorsDialog,
      selectors: [["opcloud-set-2-auth-factors-dialog"]],
      decls: 28,
      vars: 16,
      consts: [[1, "main"], [4, "ngIf"], ["id", "sideSteps"], [3, "className"], ["class", "step", 4, "ngIf"], [1, "step"], ["class", "hintStep", 4, "ngIf"], ["id", "recaptcha-container"], ["class", "step", "style", "margin-bottom: 0px;", 4, "ngIf"], ["style", "margin-bottom: -50px;", 4, "ngIf"], ["style", "font-size: 14px;", 4, "ngIf"], ["matInput", "", "class", "phoneInputAndPassword", "placeholder", "Password", "type", "password", 3, "ngModel", "ngModelChange", 4, "ngIf"], ["placeholder", "Phone Number", "matInput", "", "class", "phoneInputAndPassword", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["style", "font-size: 11px; color: red", 4, "ngIf"], [1, "hintStep"], [2, "font-size", "14px"], ["matInput", "", "placeholder", "Password", "type", "password", 1, "phoneInputAndPassword", 3, "ngModelChange", "ngModel"], ["placeholder", "Phone Number", "matInput", "", 1, "phoneInputAndPassword", 3, "keyup", "ngModelChange", "ngModel"], [2, "font-size", "11px", "color", "red"], ["placeholder", "Enter The Verification Code", "matInput", "", 1, "phoneInputAndPassword", 2, "margin-top", "0px", "width", "300px", 3, "ngModelChange", "ngModel"], ["mat-button", "", 3, "click", "disabled"], ["mat-button", "", "style", "width: 100%; height: 100%;", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 2, "width", "100%", "height", "100%", 3, "click"], ["mat-button", "", 3, "click"], ["mat-button", "", 2, "color", "#007cff", 3, "click"], [1, "step", 2, "margin-bottom", "0px"], [1, "hintStep", 2, "color", "#f44336"], ["mat-button", "", "color", "warn", 3, "click", 4, "ngIf"], ["mat-button", "", "color", "warn", "id", "logoutButton", 3, "click", 4, "ngIf"], ["mat-button", "", "color", "warn", 3, "click"], ["mat-button", "", "color", "warn", "id", "logoutButton", 3, "click"], [2, "margin-bottom", "-50px"]],
      template: function Set2AuthFactorsDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h3");
          core /* ɵɵtext */.EFF(2, "Second Authentication Factor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(3, Set2AuthFactorsDialog_h4_3_Template, 2, 0, "h4", 1);
          core /* ɵɵelementStart */.j41(4, "div")(5, "div")(6, "div", 2)(7, "div", 3);
          core /* ɵɵtemplate */.DNE(8, Set2AuthFactorsDialog_span_8_Template, 2, 0, "span", 1);
          core /* ɵɵtext */.EFF(9, "Stage 1");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "div", 3);
          core /* ɵɵtemplate */.DNE(11, Set2AuthFactorsDialog_span_11_Template, 2, 0, "span", 1);
          core /* ɵɵtext */.EFF(12, "Stage 2");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(13, "div", 3);
          core /* ɵɵtemplate */.DNE(14, Set2AuthFactorsDialog_span_14_Template, 2, 0, "span", 1);
          core /* ɵɵtext */.EFF(15, "Stage 3");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(16, Set2AuthFactorsDialog_div_16_Template, 10, 9, "div", 4)(17, Set2AuthFactorsDialog_div_17_Template, 5, 4, "div", 4);
          core /* ɵɵelementStart */.j41(18, "div", 5);
          core /* ɵɵtemplate */.DNE(19, Set2AuthFactorsDialog_span_19_Template, 2, 0, "span", 6)(20, Set2AuthFactorsDialog_span_20_Template, 2, 0, "span", 6)(21, Set2AuthFactorsDialog_span_21_Template, 2, 0, "span", 6);
          core /* ɵɵelement */.nrm(22, "div", 7);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(23, Set2AuthFactorsDialog_div_23_Template, 5, 4, "div", 4)(24, Set2AuthFactorsDialog_div_24_Template, 5, 0, "div", 4)(25, Set2AuthFactorsDialog_div_25_Template, 5, 2, "div", 8)(26, Set2AuthFactorsDialog_div_26_Template, 3, 0, "div", 9);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(27, "br");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.data.mandatory);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("className", ctx.firstStep ? "currentStage" : "notCurrentStage");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.firstStep);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("className", ctx.secondStep && !ctx.thirdStep ? "currentStage" : "notCurrentStage");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.secondStep && !ctx.thirdStep);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("className", ctx.thirdStep ? "currentStage" : "notCurrentStage");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.thirdStep);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.thirdStep);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.thirdStep);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.firstStep);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.secondStep && !ctx.thirdStep);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.thirdStep);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.thirdStep);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.thirdStep);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.secondStep || ctx.thirdStep || ctx.data.mandatory);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.thirdStep);
        }
      },
      dependencies: [NgIf, MatInput, MatButton, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".buttons[_ngcontent-%COMP%], .main[_ngcontent-%COMP%]{text-align:center}h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-top:3px}h4[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-weight:700;line-height:normal;font-size:12px;text-align:center;color:red;margin-top:-10px}#logoutButton[_ngcontent-%COMP%]{font-weight:700;width:100%;height:100%}#recaptcha-container[_ngcontent-%COMP%]{display:flex;justify-content:center}.phoneInputAndPassword[_ngcontent-%COMP%]{height:40px;width:240px;background:#f6f6f6;margin-top:15px;border-radius:5px;text-align:center}#sideSteps[_ngcontent-%COMP%]{height:38px;display:flex;align-items:center;justify-content:space-around;background-color:#f7f7f7;border-radius:50px;margin-bottom:12px}.currentStage[_ngcontent-%COMP%]{font-weight:700;color:#ffab47}.notCurrentStage[_ngcontent-%COMP%]{color:#d3d3d3}.step[_ngcontent-%COMP%]{border:1px solid #dedede;border-radius:10px;padding:12px;margin-bottom:10px}.hintStep[_ngcontent-%COMP%]{color:#1a9af3;position:static;display:block;font-size:12px;font-weight:700;margin-top:-20px;margin-left:0;z-index:999999999999}"]
    }))();
  }
  return Set2AuthFactorsDialog;
})();