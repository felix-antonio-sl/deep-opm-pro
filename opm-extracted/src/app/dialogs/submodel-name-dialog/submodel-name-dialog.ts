// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/submodel-name-dialog/submodel-name-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function SubModelNameComponent_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 6);
    core /* ɵɵlistener */.bIt("click", function SubModelNameComponent_button_12_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.apply());
    });
    core /* ɵɵtext */.EFF(1, "Rename");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SubModelNameComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 6);
    core /* ɵɵlistener */.bIt("click", function SubModelNameComponent_button_13_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.apply());
    });
    core /* ɵɵtext */.EFF(1, "Create Sub-Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
let SubModelNameComponent = /*#__PURE__*/(() => {
  class SubModelNameComponent {
    constructor(dialogRef, storage, data) {
      this.dialogRef = dialogRef;
      this.storage = storage;
      this.data = data;
      this.directory_id = data.dir_id;
      this.existingModelsNames = [];
      this.mode = data.mode;
      this.fatherModelName = data.fatherModelName;
    }
    ngOnInit() {
      if (this.mode === "create") {
        this.storage.getModels(this.directory_id, false).then(models => this.existingModelsNames = models.map(m => m.title));
      }
      this.modelName = this.data.name || "";
      this.setTitles();
    }
    setTitles() {
      if (this.mode === "create") {
        this.title = "Sub Model Creation";
        this.subTitle = "Please enter a name for the sub model. A new OPD with this name will be created as the sub model.";
      } else {
        this.title = "Rename Sub Model View Name";
        this.subTitle = "Please enter a name for the sub model view.";
      }
    }
    apply() {
      let nameToSet = this.modelName + " of " + this.fatherModelName;
      if (!nameToSet.endsWith("Subsystem model")) {
        nameToSet += " Subsystem model";
      }
      if (ModelTitleValidator.create().validateTitle(nameToSet) === false) {
        this.error = "The name includes illegal characters.";
        return;
      } else if (this.existingModelsNames.find(title => title === nameToSet)) {
        this.error = "The name already exists.";
        return;
      }
      this.dialogRef.close({
        nameForOpd: this.modelName,
        nameForModel: nameToSet
      });
    }
    cancel() {
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function SubModelNameComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SubModelNameComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SubModelNameComponent,
      selectors: [["submodel-name-dialog"]],
      decls: 16,
      vars: 6,
      consts: [["id", "main"], ["id", "header"], [1, "input_holder"], ["type", "text", "matInput", "", 1, "input_text", 3, "ngModelChange", "ngModel"], [1, "error_text"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click"]],
      template: function SubModelNameComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "span", 1);
          core /* ɵɵtext */.EFF(2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "span");
          core /* ɵɵtext */.EFF(5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "div", 2)(7, "input", 3);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SubModelNameComponent_Template_input_ngModelChange_7_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.modelName, $event)) {
              ctx.modelName = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(8, "span", 4);
          core /* ɵɵtext */.EFF(9);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(10, "br");
          core /* ɵɵelementStart */.j41(11, "div");
          core /* ɵɵtemplate */.DNE(12, SubModelNameComponent_button_12_Template, 2, 0, "button", 5)(13, SubModelNameComponent_button_13_Template, 2, 0, "button", 5);
          core /* ɵɵelementStart */.j41(14, "button", 6);
          core /* ɵɵlistener */.bIt("click", function SubModelNameComponent_Template_button_click_14_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(15, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.title);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.subTitle);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.modelName);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.error);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "rename");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "create");
        }
      },
      dependencies: [NgIf, MatInput, MatButton, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".input_holder[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:5px;padding:2px;margin:25px 5px 5px}#main[_ngcontent-%COMP%]{text-align:center;display:inline-grid}#header[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:16px;font-weight:700;color:#1a3763;padding:5px;border-radius:6px}.input_text[_ngcontent-%COMP%]{width:98%;border:none}.error_text[_ngcontent-%COMP%]{margin-left:2em;color:red}"]
    }))();
  }
  return SubModelNameComponent;
})();