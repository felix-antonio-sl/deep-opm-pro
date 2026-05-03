// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/create-view-dialog/create-view-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function CreateViewDialog_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 8);
    core /* ɵɵlistener */.bIt("click", function CreateViewDialog_button_14_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.createView());
    });
    core /* ɵɵtext */.EFF(1, "Create");
    core /* ɵɵelementEnd */.k0s();
  }
}
function CreateViewDialog_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 8);
    core /* ɵɵlistener */.bIt("click", function CreateViewDialog_button_15_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.rename());
    });
    core /* ɵɵtext */.EFF(1, "Rename");
    core /* ɵɵelementEnd */.k0s();
  }
}
let CreateViewDialog = /*#__PURE__*/(() => {
  class CreateViewDialog {
    constructor(model, init, tree, graph, dialogRef, data) {
      this.model = model;
      this.init = init;
      this.tree = tree;
      this.graph = graph;
      this.dialogRef = dialogRef;
      this.data = data;
      this.mode = "new";
      this.title = "";
      this.error = "";
    }
    ngOnInit() {
      if (this.data.renameOpdId) {
        this.opdView = this.model.model.getOpd(this.data.renameOpdId);
        this.mode = "rename";
        this.title = this.opdView.name.slice(8);
      }
    }
    createView() {
      const selected = this.init.selection.collection.models.filter(cell => OPCloudUtils.isInstanceOfDrawnThing(cell)).map(m => m.getVisual());
      const names = selected.map(vis => vis.logicalElement.getBareName()).join(", ");
      this.init.opmModel.logForUndo("Create View of " + names);
      this.init.opmModel.setShouldLogForUndoRedo(false, "createView");
      const ret = this.model.model.createViewOpd(selected, this.title.trim());
      if (ret.created == false) {
        this.error = ret.errors[0];
        this.init.opmModel.setShouldLogForUndoRedo(true, "createView");
        return;
      }
      // update view
      this.tree.init(this.model.model);
      this.model.model.currentOpd = ret.viewOpd;
      this.graph.renderGraph(ret.viewOpd, this.init);
      for (const obj of this.graph.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnObject(c))) {
        obj.syncStatesOrder(this.init, false);
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "createView");
      this.dialogRef.close();
    }
    rename() {
      const ret = this.model.model.renameViewOpd(this.opdView, this.title.trim());
      if (ret.renamed == false) {
        this.error = ret.error;
        return;
      }
      // update view
      this.tree.init(this.model.model);
      this.dialogRef.close(this.opdView.getNumberedName() + ": " + this.opdView.getName());
    }
    static #_ = (() => this.ɵfac = function CreateViewDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CreateViewDialog)(core /* ɵɵdirectiveInject */.rXU(ModelService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(TreeViewService), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CreateViewDialog,
      selectors: [["create-view-dialog"]],
      decls: 18,
      vars: 4,
      consts: [[1, "main"], [2, "text-align", "center"], ["id", "name", 3, "ngModelChange", "ngModel"], [2, "margin-top", "8px", "text-align", "center"], [2, "color", "red"], [1, "buttons"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", "id", "closeButton", 3, "click"], ["mat-button", "", 3, "click"]],
      template: function CreateViewDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h3");
          core /* ɵɵtext */.EFF(2, "Create View");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div");
          core /* ɵɵtext */.EFF(4, "Please insert an explanatory name for this view:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(5, "br");
          core /* ɵɵelementStart */.j41(6, "div", 1)(7, "span");
          core /* ɵɵtext */.EFF(8, "View of: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "input", 2);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function CreateViewDialog_Template_input_ngModelChange_9_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.title, $event)) {
              ctx.title = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(10, "div", 3)(11, "span", 4);
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(13, "div", 5);
          core /* ɵɵtemplate */.DNE(14, CreateViewDialog_button_14_Template, 2, 0, "button", 6)(15, CreateViewDialog_button_15_Template, 2, 0, "button", 6);
          core /* ɵɵelementStart */.j41(16, "button", 7);
          core /* ɵɵlistener */.bIt("click", function CreateViewDialog_Template_button_click_16_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(17, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.title);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.error);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode == "new");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode == "rename");
        }
      },
      dependencies: [NgIf, MatButton, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".buttons[_ngcontent-%COMP%]{padding-top:10px;text-align:center}h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-top:3px}"]
    }))();
  }
  return CreateViewDialog;
})();