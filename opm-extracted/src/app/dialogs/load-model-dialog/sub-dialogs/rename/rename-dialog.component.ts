// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/load-model-dialog/sub-dialogs/rename/rename-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let RenameDialogComponent = /*#__PURE__*/(() => {
  class RenameDialogComponent {
    constructor(dialogRef, storage, data) {
      this.dialogRef = dialogRef;
      this.storage = storage;
      this.data = data;
    }
    ngOnInit() {
      this.title = this.data.model ? this.data.model.title : this.data.folder.name;
      this.sysExamples = !!this.data.sysExamples;
      this.globalTemplates = !!this.data.globalTemplates;
    }
    rename() {
      if (ModelTitleValidator.create().validateTitle(this.title) == false) {
        this.error = "Wrong title name";
        return;
      }
      if (this.data.folder) {
        this.renameFolder();
      } else if (this.data.model) {
        this.renameModel();
      }
    }
    renameFolder() {
      if (this.data.usedNames?.find(f => f.trim().toLowerCase() === this.title.toLowerCase())) {
        (0, validationAlert)("This name is already been used. Choose a different name.", 5000, "Error");
        return;
      }
      this.finish(this.storage.renameFolder(this.data.folder.id, this.title, this.sysExamples, this.globalTemplates));
    }
    renameModel() {
      this.finish(this.storage.renameModel(this.data.model.id, this.title, this.sysExamples, this.globalTemplates));
    }
    finish(p) {
      p.then(res => {
        if (res && res.renamed) {
          this.dialogRef.close({
            renamed: true
          });
        } else {
          this.error = res.message;
        }
      }).catch(err => this.error = "some error occurred");
    }
    cancel() {
      this.dialogRef.close({
        renamed: false
      });
    }
    static #_ = (() => this.ɵfac = function RenameDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RenameDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RenameDialogComponent,
      selectors: [["rename-dialog"]],
      decls: 9,
      vars: 2,
      consts: [["id", "main"], [1, "input_holder"], ["type", "text", "matInput", "", 1, "input_text", 3, "ngModelChange", "ngModel"], ["mat-button", "", 3, "click"], [1, "error_text"]],
      template: function RenameDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "input", 2);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function RenameDialogComponent_Template_input_ngModelChange_2_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.title, $event)) {
              ctx.title = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(3, "button", 3);
          core /* ɵɵlistener */.bIt("click", function RenameDialogComponent_Template_button_click_3_listener() {
            return ctx.rename();
          });
          core /* ɵɵtext */.EFF(4, "Rename");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "button", 3);
          core /* ɵɵlistener */.bIt("click", function RenameDialogComponent_Template_button_click_5_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(6, "Cancel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "span", 4);
          core /* ɵɵtext */.EFF(8);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.title);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtextInterpolate */.JRh(ctx.error);
        }
      },
      dependencies: [MatInput, MatButton, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".input_holder[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:5px;padding:5px;margin:5px}.input_holder[_ngcontent-%COMP%]   .input_text[_ngcontent-%COMP%]{width:22em}.error_text[_ngcontent-%COMP%]{margin-left:2em;color:red}"]
    }))();
  }
  return RenameDialogComponent;
})();