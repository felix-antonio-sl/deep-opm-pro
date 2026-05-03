// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/new-model-dialog/new-model-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

let NewModelComponent = /*#__PURE__*/(() => {
  class NewModelComponent {
    constructor(dialogRef) {
      this.dialogRef = dialogRef;
    }
    ngOnInit() {}
    static #_ = (() => this.ɵfac = function NewModelComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NewModelComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: NewModelComponent,
      selectors: [["opcloud-new-model-dialog"]],
      decls: 11,
      vars: 0,
      consts: [[1, "alertBTN", 3, "click"]],
      template: function NewModelComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "p");
          core /* ɵɵtext */.EFF(1, "Openning a new model");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "p");
          core /* ɵɵtext */.EFF(3, " Creating a new model will remove the current model. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "p");
          core /* ɵɵtext */.EFF(5, " All unsaved work will be lost! ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "p")(7, "button", 0);
          core /* ɵɵlistener */.bIt("click", function NewModelComponent_Template_button_click_7_listener() {
            return ctx.dialogRef.close("delete");
          });
          core /* ɵɵtext */.EFF(8, "OK");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "button", 0);
          core /* ɵɵlistener */.bIt("click", function NewModelComponent_Template_button_click_9_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(10, "CANCEL");
          core /* ɵɵelementEnd */.k0s()();
        }
      },
      styles: ["[_nghost-%COMP%]     .mat-mdc-dialog-container .ng-tns-c28-3 .ng-trigger .ng-trigger-slideDialog{width:467px;height:238px;background:#fff;border:1px solid #B3B3B3;box-shadow:0 10px 20px #00000040,0 30px 50px #0000001a;border-radius:10px}p[_ngcontent-%COMP%]{text-align:center}.alertBTN[_ngcontent-%COMP%]{position:relative;width:166px;height:53px;background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px}.alertBTN[_ngcontent-%COMP%]:hover{position:relative;width:166px;height:53px;background:#fff;box-shadow:0 2px 4px #78a8f1a3;border-radius:6px;color:#78a8f1}"]
    }))();
  }
  return NewModelComponent;
})();