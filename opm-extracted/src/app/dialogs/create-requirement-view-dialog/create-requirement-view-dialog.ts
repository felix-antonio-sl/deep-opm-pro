// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/create-requirement-view-dialog/create-requirement-view-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function CreateRequirementViewDialog_div_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 4);
    core /* ɵɵtext */.EFF(1, "Currently there are no requirements in this model.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function CreateRequirementViewDialog_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 6)(1, "div", 7);
    core /* ɵɵtext */.EFF(2, "Requirement: ");
    core /* ɵɵelementStart */.j41(3, "span", 8);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "div", 9)(6, "button", 10);
    core /* ɵɵlistener */.bIt("click", function CreateRequirementViewDialog_div_6_Template_button_click_6_listener() {
      const req_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onRequirementClick(req_r2));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const req_r2 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(req_r2.name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(req_r2.opd ? "buttonUpdate buttonCreateOrUpdate" : "buttonCreateOrUpdate");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(req_r2.opd ? "↻ Update Requirement View" : "Create Requirement View");
  }
}
let CreateRequirementViewDialog = /*#__PURE__*/(() => {
  class CreateRequirementViewDialog {
    constructor(init, dialogRef, data) {
      this.init = init;
      this.dialogRef = dialogRef;
      this.data = data;
      const reqNames = this.init.opmModel.getAllModelRequirementsNumbers();
      this.requirements = reqNames.map(req => {
        return {
          name: req,
          opd: this.init.opmModel.opds.find(opd => opd.requirementViewOf === req)
        };
      });
    }
    ngOnInit() {}
    onRequirementClick(req) {
      if (!req.opd) {
        this.createRequirementViewOf(req.name);
      } else {
        this.updateRequirementViewOf(req.opd);
      }
    }
    createRequirementViewOf(requirementName) {
      const ret = this.init.opmModel.createRequirementViewOf(requirementName);
      if (ret.success) {
        this.init.treeViewService.init(this.init.opmModel);
        this.init.getGraphService().renderGraph(ret.opd, this.init);
        this.dialogRef.close();
      }
    }
    updateRequirementViewOf(opd) {
      const ret = this.init.opmModel.updateRequirementViewOf(opd);
      if (ret.updated && !ret.removed) {
        this.init.getGraphService().renderGraph(opd, this.init);
      } else if (ret.removed) {
        this.init.treeViewService.init(this.init.opmModel);
      }
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function CreateRequirementViewDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CreateRequirementViewDialog)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CreateRequirementViewDialog,
      selectors: [["create-view-dialog"]],
      decls: 10,
      vars: 2,
      consts: [[1, "main"], [2, "height", "540px"], ["style", "text-align: center;", 4, "ngIf"], ["class", "reqLine", 4, "ngFor", "ngForOf"], [2, "text-align", "center"], ["mat-button", "", "id", "closeButton", 3, "click"], [1, "reqLine"], [1, "reqName"], [2, "font-weight", "bold"], [1, "reqButtonPart"], ["mat-button", "", 3, "click"]],
      template: function CreateRequirementViewDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h3");
          core /* ɵɵtext */.EFF(2, "Create Or Update Requirement View");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "div", 1);
          core /* ɵɵtemplate */.DNE(5, CreateRequirementViewDialog_div_5_Template, 2, 0, "div", 2)(6, CreateRequirementViewDialog_div_6_Template, 8, 5, "div", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div", 4)(8, "button", 5);
          core /* ɵɵlistener */.bIt("click", function CreateRequirementViewDialog_Template_button_click_8_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(9, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.requirements.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.requirements);
        }
      },
      dependencies: [NgForOf, NgIf, MatButton],
      styles: ["h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-top:3px}.reqLine[_ngcontent-%COMP%]{height:50px;width:100%;display:inline-flex}.reqName[_ngcontent-%COMP%]{width:230px;margin-top:10px;margin-left:20px;color:#1a3763;opacity:80%}.reqButtonPart[_ngcontent-%COMP%]{text-align:center}.buttonCreateOrUpdate[_ngcontent-%COMP%]{width:210px}.mat-mdc-button[_ngcontent-%COMP%]{color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px}.buttonUpdate[_ngcontent-%COMP%]{color:#fff;background-color:#1a3763;opacity:60%}"]
    }))();
  }
  return CreateRequirementViewDialog;
})();