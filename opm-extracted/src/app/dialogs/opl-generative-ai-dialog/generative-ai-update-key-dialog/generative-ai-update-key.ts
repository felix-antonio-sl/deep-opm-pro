// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opl-generative-ai-dialog/generative-ai-update-key-dialog/generative-ai-update-key.ts
// Extracted by opm-extracted/tools/extract.mjs

let GenerativeAIUpdateKeyDialogComponent = /*#__PURE__*/(() => {
  class GenerativeAIUpdateKeyDialogComponent {
    constructor(dialogRef, userService, _dialog) {
      this.dialogRef = dialogRef;
      this.userService = userService;
      this._dialog = _dialog;
    }
    ngOnInit() {
      this.loggedUser = this.userService.user?.userData;
      this.tooltip = "This will reset your API Key of Gemini Generative AI";
    }
    updateUserAPIKey(apiKey) {
      var _this = this;
      return (0, default)(function* () {
        if (!apiKey) {
          (0, validationAlert)("The API KEY can not be empty", 3.5, "Error");
          return;
        }
        yield _this.userService.updateUserGenAIApiKey(_this.loggedUser.uid, apiKey);
        (0, validationAlert)("Successfully updated the API KEY", null, "Success");
        _this.dialogRef.close();
      })();
    }
    resetUserKey() {
      var _this2 = this;
      return (0, default)(function* () {
        const confirmDialog = _this2._dialog.open(ConfirmDialogDialogComponent, {
          height: "245px",
          width: "550px",
          data: {
            message: "Warning: This will reset your API Key of Gemini Generative AI.\n\n(OPCloud will attempt to use the organizational API key if no personal API key is available.)\n\nAre you sure?",
            closeFlag: false,
            okName: "Yes",
            closeName: "No"
          }
        });
        confirmDialog.afterClosed().subscribe(data => {
          if (data) {
            _this2.userService.resetUserGenAIApiKey().then(_ => (0, validationAlert)("Reset API Key finished Successfully", 4, "Success"));
          }
        });
        _this2.dialogRef.close();
      })();
    }
    closeAPIKeyDialog() {
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function GenerativeAIUpdateKeyDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GenerativeAIUpdateKeyDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: GenerativeAIUpdateKeyDialogComponent,
      selectors: [["generative-ai-update-key-dialog"]],
      decls: 13,
      vars: 1,
      consts: [["ApiKey", ""], [1, "exit-button", 3, "click"], ["width", "10", "height", "13", "viewBox", "0 0 10 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M9.54 1L1 12M1 1L9.54 12", "stroke", "#586D8C"], ["id", "ApiKeyWrapper", "autocomplete", "off"], ["id", "ApiKey", "autocomplete", "new-password", "matInput", "", "type", "password", "placeholder", "Your API Key", "value", ""], [1, "buttons"], ["mat-raised-button", "", "id", "ai-update-key", "color", "primary", 3, "click"], ["mat-raised-button", "", "id", "ai-button-red", 3, "click", "matTooltip"]],
      template: function GenerativeAIUpdateKeyDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1);
          core /* ɵɵlistener */.bIt("click", function GenerativeAIUpdateKeyDialogComponent_Template_div_click_0_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.closeAPIKeyDialog());
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(1, "svg", 2);
          core /* ɵɵelement */.nrm(2, "path", 3);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(3, "div");
          core /* ɵɵtext */.EFF(4, "Insert Your Generative AI API Key");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "mat-form-field", 4);
          core /* ɵɵelement */.nrm(6, "input", 5, 0);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "div", 6)(9, "button", 7);
          core /* ɵɵlistener */.bIt("click", function GenerativeAIUpdateKeyDialogComponent_Template_button_click_9_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const ApiKey_r2 = core /* ɵɵreference */.sdS(7);
            return core /* ɵɵresetView */.Njj(ctx.updateUserAPIKey(ApiKey_r2.value));
          });
          core /* ɵɵtext */.EFF(10, "Update Key");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "button", 8);
          core /* ɵɵlistener */.bIt("click", function GenerativeAIUpdateKeyDialogComponent_Template_button_click_11_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.resetUserKey());
          });
          core /* ɵɵtext */.EFF(12, "Reset Key");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("matTooltip", ctx.tooltip);
        }
      },
      dependencies: [MatFormField, MatInput, MatTooltip, MatButton],
      styles: [".exit-button[_ngcontent-%COMP%]{cursor:pointer;margin-left:260px;margin-top:-5px;font-size:10px}#ai-button-red[_ngcontent-%COMP%]:hover{background-color:#ff443d;color:#fff}#ai-update-key[_ngcontent-%COMP%], #ai-button-red[_ngcontent-%COMP%]{text-align:center;letter-spacing:normal;margin-right:10px}.example-form[_ngcontent-%COMP%]{min-width:150px;max-width:500px;width:100%}.example-full-width[_ngcontent-%COMP%]{width:100%}.buttons[_ngcontent-%COMP%]{text-align:center;letter-spacing:normal}.hideInput[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return GenerativeAIUpdateKeyDialogComponent;
})();