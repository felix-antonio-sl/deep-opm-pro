// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/input-name-dialog/input-name-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

let InputNameDialogComponent = /*#__PURE__*/(() => {
  class InputNameDialogComponent {
    constructor(dialogRef, data) {
      this.dialogRef = dialogRef;
      this.data = data;
    }
    ngOnInit() {
      if (this.data.passwordFlag === true) {
        const nameInputWrapper = document.getElementById("NameInputWrapper");
        if (nameInputWrapper) {
          nameInputWrapper.classList.add("hideInput");
        }
      } else {
        const passwordWrapper = document.getElementById("passwordWrapper");
        if (passwordWrapper) {
          passwordWrapper.classList.add("hideInput");
        }
      }
      if (this.data.inputName) {
        this.inputName = this.data.inputName;
      }
    }
    static #_ = (() => this.ɵfac = function InputNameDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || InputNameDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: InputNameDialogComponent,
      selectors: [["opcloud-input-name-dialog"]],
      decls: 13,
      vars: 2,
      consts: [["password", ""], ["NameInput", ""], ["id", "passwordWrapper"], ["autocomplete", "new-password", "type", "password", "id", "password", "matInput", "", "placeholder", "Password", "value", "", "name", "delete-org-confirmation-password", "data-lpignore", "true"], ["id", "NameInputWrapper"], ["id", "NameInput", "matInput", "", "value", "", "autocomplete", "off", 3, "placeholder"], [1, "buttons"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["mat-raised-button", "", 3, "click"]],
      template: function InputNameDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div");
          core /* ɵɵtext */.EFF(1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "mat-form-field", 2);
          core /* ɵɵelement */.nrm(3, "input", 3, 0);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "mat-form-field", 4);
          core /* ɵɵelement */.nrm(6, "input", 5, 1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "div", 6)(9, "button", 7);
          core /* ɵɵlistener */.bIt("click", function InputNameDialogComponent_Template_button_click_9_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const password_r2 = core /* ɵɵreference */.sdS(4);
            const NameInput_r3 = core /* ɵɵreference */.sdS(7);
            return core /* ɵɵresetView */.Njj(ctx.dialogRef.close({
              password: password_r2.value,
              NameInput: NameInput_r3.value
            }));
          });
          core /* ɵɵtext */.EFF(10, "OK");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "button", 8);
          core /* ɵɵlistener */.bIt("click", function InputNameDialogComponent_Template_button_click_11_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.dialogRef.close());
          });
          core /* ɵɵtext */.EFF(12, "CLOSE");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.data.message);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵpropertyInterpolate */.FS9("placeholder", ctx.inputName);
        }
      },
      dependencies: [MatFormField, MatInput, MatButton],
      styles: ["p[_ngcontent-%COMP%]{text-align:center}.example-form[_ngcontent-%COMP%]{min-width:150px;max-width:500px;width:100%}.example-full-width[_ngcontent-%COMP%]{width:100%}.buttons[_ngcontent-%COMP%]{text-align:center}.hideInput[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return InputNameDialogComponent;
})();