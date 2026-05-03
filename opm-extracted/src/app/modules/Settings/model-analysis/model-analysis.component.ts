// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/model-analysis/model-analysis.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function ModelAnalysisComponent_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const entry_r1 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("\xA0\xA0", entry_r1.split(":")[0], "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(entry_r1.split(":")[1]);
  }
}
let ModelAnalysisComponent = /*#__PURE__*/(() => {
  class ModelAnalysisComponent {
    constructor(initRappidService) {
      this.initRappidService = initRappidService;
      this.content = initRappidService.opmModel.modelMetaData.getString().split("\n");
    }
    ngOnInit() {}
    /**
     * The main method called from the HTML to export the model metrics data as a CSV file.
     */
    exportModelMetricsCSVFile() {
      const fileName = "ModelMetrics_" + this.initRappidService.opmModel.name;
      const metricsArray = ["Metric's Name,", "Value\n"];
      for (const metric of this.content) {
        metricsArray.push(metric.split(":")[0] += ",");
        metricsArray.push(metric.split(":")[1] += "\n");
      }
      const exportValuesFile = new Blob(metricsArray, {
        type: "text/csv"
      });
      FileSaver_min.saveAs(exportValuesFile, fileName + ".csv"); // Save the exported file.
    }
    static #_ = (() => this.ɵfac = function ModelAnalysisComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ModelAnalysisComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ModelAnalysisComponent,
      selectors: [["opcloud-model-analysis"]],
      decls: 15,
      vars: 1,
      consts: [["id", "whole", 2, "left", "10px", "top", "-30px"], [1, "header"], [1, "h2"], [2, "margin-left", "calc(50% - 236px)"], [4, "ngFor", "ngForOf"], ["id", "modelMetricExcel"], ["mat-button", "", "id", "MetricsBtn", "matTooltip", "Click to download the OPM model Metrics as a CSV file", 3, "click"]],
      template: function ModelAnalysisComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "Model Metrics Calculation Analysis");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "table")(6, "tr")(7, "th");
          core /* ɵɵtext */.EFF(8, "Metric's Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "th");
          core /* ɵɵtext */.EFF(10, "Value");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(11, ModelAnalysisComponent_tr_11_Template, 5, 2, "tr", 4);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "div", 5)(13, "button", 6);
          core /* ɵɵlistener */.bIt("click", function ModelAnalysisComponent_Template_button_click_13_listener() {
            return ctx.exportModelMetricsCSVFile();
          });
          core /* ɵɵtext */.EFF(14, "Download Model Metrics");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.content);
        }
      },
      dependencies: [NgForOf, MatTooltip, MatButton],
      styles: [".divs[_ngcontent-%COMP%]{position:relative;width:453px;left:50px;top:50px}table[_ngcontent-%COMP%]{width:453px;border:1px solid rgba(73,114,132,.77);line-height:30px;border-radius:6px}th[_ngcontent-%COMP%]{text-align:left;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}tr[_ngcontent-%COMP%]:nth-child(2n){background:#fff}tr[_ngcontent-%COMP%]:nth-child(odd){background:#e4e8ec6e}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:center}#whole[_ngcontent-%COMP%]{display:grid;justify-content:center;width:100%;padding-bottom:40px}#MetricsBtn[_ngcontent-%COMP%]{color:#1a3763!important;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;margin-left:133px;letter-spacing:normal;top:10px}"]
    }))();
  }
  return ModelAnalysisComponent;
})();