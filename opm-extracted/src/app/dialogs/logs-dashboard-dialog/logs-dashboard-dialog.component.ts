// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/logs-dashboard-dialog/logs-dashboard-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let LogsDashboardDialogComponent = /*#__PURE__*/(() => {
  class LogsDashboardDialogComponent {
    constructor(data, dialogRef, init, router) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.init = init;
      this.router = router;
    }
    copyModelData(json) {
      navigator.clipboard.writeText(json).then().catch(e => console.error(e));
    }
    loadModelFromData(jsonStr) {
      const that = this;
      const json = JSON.parse(jsonStr);
      this.router.navigate([""]).then(val => {
        that.dialogRef.close();
        setTimeout(() => {
          that.init.opmModel.fromJson(json);
          that.init.treeViewService.init(that.init.opmModel);
          that.init.getGraphService().renderGraph(that.init.opmModel.opds[0]);
        }, 1000);
      });
    }
    remove() {
      this.dialogRef.close(this.data);
    }
    logError(errorMessage) {
      console.log(errorMessage.split("selected element:")[0]);
    }
    static #_ = (() => this.ɵfac = function LogsDashboardDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LogsDashboardDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(Router));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: LogsDashboardDialogComponent,
      selectors: [["opcloud-logs-dashboard-dialog"]],
      decls: 34,
      vars: 5,
      consts: [[2, "height", "100%", "width", "100%", "color", "#1A3763"], [2, "font-weight", "bold", "margin-left", "20px", "color", "#1A3763"], [2, "color", "#1A3763"], ["mat-button", "", 2, "color", "#1A3763", "letter-spacing", "normal", 3, "click"]],
      template: function LogsDashboardDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "mat-card", 0)(1, "mat-card-title", 1);
          core /* ɵɵtext */.EFF(2, " Error Log ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br")(4, "div");
          core /* ɵɵelementStart */.j41(5, "mat-card-content", 2)(6, "h3", 2);
          core /* ɵɵtext */.EFF(7, "Created at:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(8);
          core /* ɵɵelement */.nrm(9, "br");
          core /* ɵɵelementStart */.j41(10, "h3", 2);
          core /* ɵɵtext */.EFF(11, "Modeler:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelement */.nrm(13, "br");
          core /* ɵɵelementStart */.j41(14, "h3", 2);
          core /* ɵɵtext */.EFF(15, "Model Name:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(16);
          core /* ɵɵelement */.nrm(17, "br");
          core /* ɵɵelementStart */.j41(18, "h3", 2);
          core /* ɵɵtext */.EFF(19, "Steps:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(20);
          core /* ɵɵelement */.nrm(21, "br");
          core /* ɵɵelementStart */.j41(22, "h3", 2);
          core /* ɵɵtext */.EFF(23, "Error Message:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(24);
          core /* ɵɵelement */.nrm(25, "br");
          core /* ɵɵelementStart */.j41(26, "button", 3);
          core /* ɵɵlistener */.bIt("click", function LogsDashboardDialogComponent_Template_button_click_26_listener() {
            return ctx.remove();
          });
          core /* ɵɵtext */.EFF(27, "remove");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "button", 3);
          core /* ɵɵlistener */.bIt("click", function LogsDashboardDialogComponent_Template_button_click_28_listener() {
            return ctx.copyModelData(ctx.data.json);
          });
          core /* ɵɵtext */.EFF(29, "copy model data");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(30, "button", 3);
          core /* ɵɵlistener */.bIt("click", function LogsDashboardDialogComponent_Template_button_click_30_listener() {
            return ctx.loadModelFromData(ctx.data.json);
          });
          core /* ɵɵtext */.EFF(31, "load model");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(32, "button", 3);
          core /* ɵɵlistener */.bIt("click", function LogsDashboardDialogComponent_Template_button_click_32_listener() {
            return ctx.logError(ctx.data.errorMessage);
          });
          core /* ɵɵtext */.EFF(33, "Console log error");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.createdAt, "");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.userName, "");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.modelName, "");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.steps, "");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.errorMessage, "");
        }
      },
      dependencies: [MatButton, MatCard, MatCardContent, MatCardTitle],
      encapsulation: 2
    }))();
  }
  return LogsDashboardDialogComponent;
})();