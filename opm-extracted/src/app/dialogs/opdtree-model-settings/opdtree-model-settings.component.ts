// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opdtree-model-settings/opdtree-model-settings.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpdtreeModelSettingsComponent = /*#__PURE__*/(() => {
  class OpdtreeModelSettingsComponent {
    constructor(dialogRef, init) {
      this.dialogRef = dialogRef;
      this.init = init;
      this.shouldArrangeOpdTreeInModel = this.init.getOpmModel().autoOpdTreeSort;
    }
    cancel() {
      this.dialogRef.close();
    }
    changeValue($event) {
      if ($event.target.value === "undefined") {
        this.shouldArrangeOpdTreeInModel = undefined;
      } else {
        this.shouldArrangeOpdTreeInModel = $event.target.value === "true" ? true : false;
      }
    }
    apply() {
      this.init.getOpmModel().autoOpdTreeSort = this.shouldArrangeOpdTreeInModel;
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function OpdtreeModelSettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpdtreeModelSettingsComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OpdtreeModelSettingsComponent,
      selectors: [["app-opdtree-model-settings"]],
      decls: 19,
      vars: 1,
      consts: [[1, "opdTreeArrangementAll"], [1, "opdTreeArrangementContent"], [1, "header-text"], [1, "dropdown-container"], [1, "flexInline"], [1, "selectDiv"], ["id", "shouldOpdTreeArrangementBeInModelLevel", 1, "shouldOpdTreeArrangementBeInModelLevel", 3, "change", "value"], ["value", "undefined"], ["value", "true"], ["value", "false"], ["id", "opd-dialog-buttons", 1, "opd-dialog-buttons"], ["mat-button", "", 1, "opd-dialog-button", 3, "click"]],
      template: function OpdtreeModelSettingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h3", 2);
          core /* ɵɵtext */.EFF(3, "Model Specific OPD Tree Arrangement according to In-zoomed Processes:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "select", 6);
          core /* ɵɵlistener */.bIt("change", function OpdtreeModelSettingsComponent_Template_select_change_7_listener($event) {
            return ctx.changeValue($event);
          });
          core /* ɵɵelementStart */.j41(8, "option", 7);
          core /* ɵɵtext */.EFF(9, "Inherited From Modeler General Preferences");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "option", 8);
          core /* ɵɵtext */.EFF(11, "Automatic");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "option", 9);
          core /* ɵɵtext */.EFF(13, "Manually");
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(14, "div", 10)(15, "button", 11);
          core /* ɵɵlistener */.bIt("click", function OpdtreeModelSettingsComponent_Template_button_click_15_listener() {
            return ctx.apply();
          });
          core /* ɵɵtext */.EFF(16, "Apply");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "button", 11);
          core /* ɵɵlistener */.bIt("click", function OpdtreeModelSettingsComponent_Template_button_click_17_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(18, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("value", ctx.shouldArrangeOpdTreeInModel);
        }
      },
      dependencies: [MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: [".opdTreeArrangementAll[_ngcontent-%COMP%]   .opdTreeArrangementContent[_ngcontent-%COMP%]   .header-text[_ngcontent-%COMP%]{color:#122543;width:100%;text-align:center;position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;margin-top:3px}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opdTreeArrangementContent[_ngcontent-%COMP%]   .dropdown-container[_ngcontent-%COMP%]{width:100%;text-align:center}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opdTreeArrangementContent[_ngcontent-%COMP%]   .dropdown-container[_ngcontent-%COMP%]   .flexInline[_ngcontent-%COMP%]{display:inline-flex;margin-top:8px}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opdTreeArrangementContent[_ngcontent-%COMP%]   .dropdown-container[_ngcontent-%COMP%]   .flexInline[_ngcontent-%COMP%]   .selectDiv[_ngcontent-%COMP%]{width:450px;margin-left:20px;margin-top:-2px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opdTreeArrangementContent[_ngcontent-%COMP%]   .dropdown-container[_ngcontent-%COMP%]   .flexInline[_ngcontent-%COMP%]   .selectDiv[_ngcontent-%COMP%]   .shouldOpdTreeArrangementBeInModelLevel[_ngcontent-%COMP%]{border:transparent}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opdTreeArrangementContent[_ngcontent-%COMP%]   .dropdown-container[_ngcontent-%COMP%]   .flexInline[_ngcontent-%COMP%]   .selectDiv[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:450px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;font-size:medium;Opacity:70%;text-align-last:center;outline-color:#ffd67000}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opd-dialog-buttons[_ngcontent-%COMP%]{margin-left:5px;margin-top:13px;width:100%;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal}.opdTreeArrangementAll[_ngcontent-%COMP%]   .opd-dialog-buttons[_ngcontent-%COMP%]   .opd-dialog-button[_ngcontent-%COMP%]{margin-left:5px;margin-top:13px;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;font-weight:400!important;color:#1a3763!important}"]
    }))();
  }
  return OpdtreeModelSettingsComponent;
})();