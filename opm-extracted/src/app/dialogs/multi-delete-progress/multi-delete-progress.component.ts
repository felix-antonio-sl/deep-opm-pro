// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/multi-delete-progress/multi-delete-progress.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function MultiDeleteProgressComponent_div_0_p_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Current: ", ctx_r0.currentUserName, "");
  }
}
function MultiDeleteProgressComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "h2");
    core /* ɵɵtext */.EFF(2, "Deleting Users...");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(5, "mat-progress-bar", 1);
    core /* ɵɵtemplate */.DNE(6, MultiDeleteProgressComponent_div_0_p_6_Template, 2, 1, "p", 0);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate2 */.Lme("Processing: ", ctx_r0.current, " / ", ctx_r0.total, "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", ctx_r0.current / ctx_r0.total * 100);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.currentUserName);
  }
}
function MultiDeleteProgressComponent_div_1_div_7_li_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const error_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate4 */.LHq(" ", error_r3.name || "N/A", " (", error_r3.email || "N/A", ") - ID: ", error_r3.uid, " - Error: ", error_r3.error, " ");
  }
}
function MultiDeleteProgressComponent_div_1_div_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "h3");
    core /* ɵɵtext */.EFF(2, "Errors:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "ul");
    core /* ɵɵtemplate */.DNE(4, MultiDeleteProgressComponent_div_1_div_7_li_4_Template, 2, 4, "li", 3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.results.errors);
  }
}
function MultiDeleteProgressComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "h2");
    core /* ɵɵtext */.EFF(2, "Delete Complete");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "p");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(7, MultiDeleteProgressComponent_div_1_div_7_Template, 5, 1, "div", 0);
    core /* ɵɵelementStart */.j41(8, "button", 2);
    core /* ɵɵlistener */.bIt("click", function MultiDeleteProgressComponent_div_1_Template_button_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.downloadReport());
    });
    core /* ɵɵtext */.EFF(9, "Download Report");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "button", 2);
    core /* ɵɵlistener */.bIt("click", function MultiDeleteProgressComponent_div_1_Template_button_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.close());
    });
    core /* ɵɵtext */.EFF(11, "Close");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate1 */.SpI("Successfully deleted: ", ctx_r0.results.success.length, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Errors: ", ctx_r0.results.errors.length, "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.results.errors.length > 0);
  }
}
let MultiDeleteProgressComponent = /*#__PURE__*/(() => {
  class MultiDeleteProgressComponent {
    constructor(dialogRef, data) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.current = 0;
      this.total = 0;
      this.currentUser = "";
      this.currentUserName = "";
      this.isComplete = false;
      this.results = {
        success: [],
        errors: []
      };
      this.total = data.total;
    }
    ngOnInit() {}
    updateProgress(current, total, userId, userName) {
      this.current = current;
      this.total = total;
      this.currentUser = userId;
      this.currentUserName = userName || userId;
    }
    setComplete(results) {
      this.isComplete = true;
      this.results = results;
    }
    close() {
      this.dialogRef.close();
    }
    downloadReport() {
      const report = ["Multi-Delete Report\n"];
      report.push(`Total: ${this.total}\n`);
      report.push(`Successful: ${this.results.success.length}\n`);
      report.push(`Errors: ${this.results.errors.length}\n\n`);
      if (this.results.success.length > 0) {
        report.push("Successfully Deleted:\n");
        this.results.success.forEach(r => {
          report.push(`- Name: ${r.name || "N/A"}, Email: ${r.email || "N/A"}, ID: ${r.uid}\n`);
        });
        report.push("\n");
      }
      if (this.results.errors.length > 0) {
        report.push("Errors:\n");
        this.results.errors.forEach(r => {
          report.push(`- Name: ${r.name || "N/A"}, Email: ${r.email || "N/A"}, ID: ${r.uid}, Error: ${r.error}\n`);
        });
      }
      const blob = new Blob(report, {
        type: "text/plain"
      });
      const fileName = `delete-report-${new Date().toISOString()}.txt`;
      FileSaver_min.saveAs(blob, fileName);
    }
    static #_ = (() => this.ɵfac = function MultiDeleteProgressComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MultiDeleteProgressComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MultiDeleteProgressComponent,
      selectors: [["opcloud-multi-delete-progress"]],
      decls: 2,
      vars: 2,
      consts: [[4, "ngIf"], ["mode", "determinate", 3, "value"], ["mat-button", "", 3, "click"], [4, "ngFor", "ngForOf"]],
      template: function MultiDeleteProgressComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵtemplate */.DNE(0, MultiDeleteProgressComponent_div_0_Template, 7, 4, "div", 0)(1, MultiDeleteProgressComponent_div_1_Template, 12, 3, "div", 0);
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isComplete);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isComplete);
        }
      },
      dependencies: [NgForOf, NgIf, MatButton, MatProgressBar],
      styles: ["h2[_ngcontent-%COMP%]{color:#1a3763;text-align:center}p[_ngcontent-%COMP%]{text-align:center;margin:10px 0}mat-progress-bar[_ngcontent-%COMP%]{margin:20px 0}button[_ngcontent-%COMP%]{margin:10px}"]
    }))();
  }
  return MultiDeleteProgressComponent;
})();