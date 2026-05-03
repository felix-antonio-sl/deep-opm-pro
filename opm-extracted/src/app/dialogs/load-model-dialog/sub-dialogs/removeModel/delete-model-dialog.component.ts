// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/load-model-dialog/sub-dialogs/removeModel/delete-model-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let DeleteModelDialogComponent = /*#__PURE__*/(() => {
  class DeleteModelDialogComponent {
    constructor(dialogRef, storage, contextService, data) {
      this.dialogRef = dialogRef;
      this.storage = storage;
      this.contextService = contextService;
      this.data = data;
    }
    ngOnInit() {
      this.title = this.data.model.title;
    }
    removeModel() {
      if (this.contextService.getTabs().find(t => t.context.properties?.id === this.data.model.id)) {
        (0, validationAlert)("Cannot remove an open model.");
        this.cancel();
        return;
      }
      this.finish(this.storage.removeModel(this.data.model.id, !!this.data.sysExamples, !!this.data.globalTemplates));
    }
    finish(p) {
      p.then(res => {
        if (res && res.removed) {
          this.dialogRef.close({
            removed: true
          });
        } else {
          this.error = res.message;
        }
      }).catch(err => {
        if (err.error === "You do not have permission to delete Global Examples") {
          (0, validationAlert)("You do not have permission to delete Global Examples. ", 5000, "Error");
          this.error = "You do not have permission to delete Global Examples";
          this.dialogRef.close({
            removed: false
          });
        }
        this.error = "An error has occurred";
      });
    }
    cancel() {
      this.dialogRef.close({
        removed: false
      });
    }
    static #_ = (() => this.ɵfac = function DeleteModelDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DeleteModelDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: DeleteModelDialogComponent,
      selectors: [["rename-dialog"]],
      decls: 13,
      vars: 2,
      consts: [["id", "main"], [2, "font-weight", "bold"], ["mat-button", "", 3, "click"], [1, "error_text"]],
      template: function DeleteModelDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "p");
          core /* ɵɵtext */.EFF(2, "Pay attention, ");
          core /* ɵɵelementStart */.j41(3, "span", 1);
          core /* ɵɵtext */.EFF(4);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(5, " model will be removed permanently!");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "div")(7, "button", 2);
          core /* ɵɵlistener */.bIt("click", function DeleteModelDialogComponent_Template_button_click_7_listener() {
            return ctx.removeModel();
          });
          core /* ɵɵtext */.EFF(8, "Remove");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "button", 2);
          core /* ɵɵlistener */.bIt("click", function DeleteModelDialogComponent_Template_button_click_9_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(10, "Cancel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "span", 3);
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate */.JRh(ctx.title);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtextInterpolate */.JRh(ctx.error);
        }
      },
      dependencies: [MatButton],
      styles: [".input_holder[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:5px;padding:5px;margin:5px}.input_holder[_ngcontent-%COMP%]   .input_text[_ngcontent-%COMP%]{width:22em}.error_text[_ngcontent-%COMP%]{margin-left:2em;color:red}"]
    }))();
  }
  return DeleteModelDialogComponent;
})();