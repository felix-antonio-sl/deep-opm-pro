// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/About/about.ts
// Extracted by opm-extracted/tools/extract.mjs

let AboutDialogComponent = /*#__PURE__*/(() => {
  class AboutDialogComponent {
    constructor(dialogRef) {
      this.dialogRef = dialogRef;
    }
    ngOnInit() {}
    static #_ = (() => this.ɵfac = function AboutDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AboutDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: AboutDialogComponent,
      selectors: [["opcloud-about-dialog"]],
      decls: 15,
      vars: 0,
      consts: [[1, "aboutDiv"], [2, "align-items", "center"], ["mat-raised-button", "", 1, "aboutOKButton", 3, "click"]],
      template: function AboutDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "p");
          core /* ɵɵtext */.EFF(2, "OPCloud About");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "p");
          core /* ɵɵtext */.EFF(4, " OPCloud Version 9.2.0 ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "p");
          core /* ɵɵtext */.EFF(6, " Released April 2026 ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "p");
          core /* ɵɵelement */.nrm(8, "br");
          core /* ɵɵtext */.EFF(9, "For support, please contact: ");
          core /* ɵɵelement */.nrm(10, "br");
          core /* ɵɵtext */.EFF(11, "support@opcloud.tech ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "p", 1)(13, "button", 2);
          core /* ɵɵlistener */.bIt("click", function AboutDialogComponent_Template_button_click_13_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(14, "OK");
          core /* ɵɵelementEnd */.k0s()()();
        }
      },
      dependencies: [MatButton],
      styles: ["p[_ngcontent-%COMP%]{text-align:center}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.aboutDiv[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none;font-family:Roboto,Helvetica Neue,sans-serif;pointer-events:auto;box-shadow:0 11px 15px -7px #0003,0 24px 38px 3px #00000024,0 9px 46px 8px #0000001f;background:#fff;color:#1a3763;display:block;padding:24px!important;margin:0!important;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit;transform:none}.aboutOKButton[_ngcontent-%COMP%]{position:relative;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;font-weight:400}"]
    }))();
  }
  return AboutDialogComponent;
})();