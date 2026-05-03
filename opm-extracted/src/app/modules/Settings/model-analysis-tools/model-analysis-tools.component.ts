// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/model-analysis-tools/model-analysis-tools.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function ModelAnalysisToolsComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 9)(1, "button", 10);
    core /* ɵɵlistener */.bIt("click", function ModelAnalysisToolsComponent_div_6_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.exportModelRdf());
    });
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r2.isExportingRdf || !ctx_r2.canDownloadRdf);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r2.isExportingRdf ? "Preparing RDF..." : "Download Model RDF", " ");
  }
}
let ModelAnalysisToolsComponent = /*#__PURE__*/(() => {
  class ModelAnalysisToolsComponent {
    constructor(initRappidService, serverFlatteningService, opmRdfService, contextService) {
      this.initRappidService = initRappidService;
      this.serverFlatteningService = serverFlatteningService;
      this.opmRdfService = opmRdfService;
      this.contextService = contextService;
      this.isExportingRdf = false;
      this.initRappid = initRappidService;
      this.model = initRappidService.getOpmModel();
      this.canDownloadRdf = !!this.opmRdfService && !!this.contextService;
    }
    ngOnInit() {}
    /**
     * This function is marking the current OPD, calls the DSM flattening algorithm and prepare from the data
     * triplets of [Source, Link, Target] with the needed values. Restoring the graph to current OPD once finished.
     * It uses the flattening OPD id for creating the temporary flatten OPD.
     * @private
     */
    createTriplesFromOPM(includeExhibit) {
      var _this = this;
      return (0, default)(function* () {
        const TRIPLEs = [];
        const currOpd = _this.model.currentOpd;
        let serverFlattening;
        if (_this.initRappidService.oplService.settings.connection.calculationsServer.computingServerCalculations) {
          serverFlattening = yield _this.serverFlatteningService.getFlattenedModelFromServer(false);
          if (!serverFlattening?.success) {
            (0, validationAlert)("Unable to run Flattening algorithm on the BE server. Running it locally.");
          }
        }
        let flatOPD;
        if (serverFlattening?.success) {
          flatOPD = serverFlattening.serverModel.getOpd("OPMqUeRy");
        } else {
          flatOPD = _this.initRappid.opmModel.flattening(false);
        }
        const allLinks = flatOPD.visualElements.filter(element => element instanceof OpmLink);
        for (let link = 0; link < allLinks.length; link++) {
          // Source
          const sourceVisual = allLinks[link].sourceVisualElement;
          // This check if at one point a thing was connected to an in-zoomed thing so during flatting it now have multiple sources
          // but none of them are its real source. This needs to be updated in the flattening algorithm.
          if (!(sourceVisual instanceof OpmVisualEntity)) {
            continue;
          }
          const src_tripleComp = {
            type: "Source",
            id: sourceVisual.id,
            opm_type: sourceVisual.type.replace("OpmLogical", "").toLowerCase(),
            label: sourceVisual.logicalElement.text.replace(/'/, "")
          };
          // Link
          const linkVisual = allLinks[link];
          const link_tripleComp = {
            type: "link",
            id: linkVisual.id,
            opm_type: linkType[linkVisual.type],
            label: linkVisual.logicalElement.name
          };
          // Target
          const targetVisual = allLinks[link].targetVisualElements[0].targetVisualElement;
          // This check if at one point a thing was connected to an in-zoomed thing so during flatting it now have multiple targets
          // but none of them are its real target. This needs to be updated in the flattening algorithm.
          if (!(targetVisual instanceof OpmVisualEntity)) {
            continue;
          }
          let targetName = targetVisual.logicalElement.text.replace(/'/, "");
          if (includeExhibit) {
            const exhibitions = targetVisual.logicalElement.getLinks().inGoing.filter(l => l.linkType === linkType.Exhibition);
            if (exhibitions.length > 0) {
              const names = exhibitions.map(l => l.sourceLogicalElement.getBareName());
              if (names.length === 1) {
                targetName += " of " + names[0];
              } else if (names.length === 2) {
                targetName += " of " + names[0] + " and " + names[1];
              } else if (names.length > 2) {
                targetName += " of " + names.slice(0, names.length - 1).join(", ") + " and " + names[names.length - 1];
              }
            }
          }
          const trg_tripleComp = {
            type: "Target",
            id: targetVisual.id,
            opm_type: targetVisual.type.replace("OpmLogical", "").toLowerCase(),
            label: targetName
          };
          // Merge All
          const curr_triple = {
            source: src_tripleComp,
            link: link_tripleComp,
            target: trg_tripleComp
          };
          TRIPLEs.push(curr_triple);
        }
        if (!serverFlattening?.success) {
          _this.removeOPMQueryOPD();
        }
        _this.model.currentOpd = currOpd;
        return TRIPLEs;
      })();
    }
    /**
     * Helper method for deleting the temporary flatten OPD
     */
    removeOPMQueryOPD() {
      this.model.setShouldLogForUndoRedo(false, "query");
      const opm_q_id = "OPMqUeRy"; // The ID used at the DSM flattening - needs to be matched
      if (this.model.getOpd(opm_q_id) !== null) {
        this.model.removeOpd(opm_q_id);
      }
      this.model.setShouldLogForUndoRedo(true, "query");
    }
    /**
     * Helper method to the export CSV file to prepare the CSV array from the triplets data
     */
    createTripletsArray(includeExhibit) {
      var _this2 = this;
      return (0, default)(function* () {
        const tripletsArray = ["Source,", "Relation,", "Target\n"];
        const tripletsData = yield _this2.createTriplesFromOPM(includeExhibit);
        for (const triplet of tripletsData) {
          tripletsArray.push(triplet.source.label += ",");
          tripletsArray.push(triplet.link.opm_type += ",");
          tripletsArray.push(triplet.target.label += "\n");
        }
        return tripletsArray;
      })();
    }
    /**
     * The main method called from the HTML to export the model triplets data as a CSV file.
     */
    exportTripletsCSVFile(includeExhibit) {
      var _this3 = this;
      return (0, default)(function* () {
        const fileName = "Triplets_" + _this3.initRappid.opmModel.name;
        const exportTriplesDataArray = yield _this3.createTripletsArray(includeExhibit);
        const exportValuesFile = new Blob(exportTriplesDataArray, {
          type: "text/csv"
        });
        FileSaver_min.saveAs(exportValuesFile, fileName + ".csv"); // Save the exported file.
      })();
    }
    exportModelRdf() {
      var _this4 = this;
      return (0, default)(function* () {
        if (!_this4.canDownloadRdf || _this4.isExportingRdf) {
          return;
        }
        _this4.isExportingRdf = true;
        try {
          const modelName = _this4.initRappid.opmModel?.name || "OPM_Model";
          const modelId = _this4.contextService?.getCurrentModelId?.() || _this4.slugify(modelName);
          const blob = _this4.opmRdfService?.createRdfBlob({
            model: _this4.model,
            modelId,
            modelName,
            description: _this4.initRappid.opmModel?.description
          });
          if (blob) {
            const fileName = _this4.buildFileName(`${modelName}_RDF`, "ttl");
            FileSaver_min.saveAs(blob, fileName);
          } else {
            throw new Error("RDF service unavailable");
          }
        } catch (error) {
          console.error("Failed to export RDF model", error);
          (0, validationAlert)("Unable to export the RDF file. Please try again later.", 4000, "Error");
        } finally {
          _this4.isExportingRdf = false;
        }
      })();
    }
    buildFileName(base, extension) {
      const sanitized = this.slugify(base) || "opm_model";
      return `${sanitized}.${extension}`;
    }
    slugify(value) {
      return (value || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    }
    static #_ = (() => this.ɵfac = function ModelAnalysisToolsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ModelAnalysisToolsComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ServerFlatteningService), core /* ɵɵdirectiveInject */.rXU(OpmRdfService), core /* ɵɵdirectiveInject */.rXU(ContextService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ModelAnalysisToolsComponent,
      selectors: [["opcloud-model-analysis-tools"]],
      decls: 18,
      vars: 2,
      consts: [["includeExhibit", ""], ["id", "whole", 2, "left", "10px", "top", "-30px"], [1, "header"], [1, "h2"], [1, "download-text"], ["id", "modelRdf", 4, "ngIf"], ["id", "modelTriplets"], ["matTooltip", "Enable this checkbox to include the exhibitor name for exhibition links", "matTooltipPosition", "right", 2, "color", "#1A3763", "float", "left", 3, "checked"], ["mat-button", "", "id", "TripletsBtn", "matTooltip", "The OPM model triplets: [Source, Target, Relation] in a CSV file", 3, "click"], ["id", "modelRdf"], ["mat-button", "", "id", "RdfBtn", "matTooltip", "Download the RDF/Turtle serialization of the current model", 3, "click", "disabled"]],
      template: function ModelAnalysisToolsComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "div", 2)(2, "h2", 3);
          core /* ɵɵtext */.EFF(3, "Model Analysis Tools");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "label", 4);
          core /* ɵɵtext */.EFF(5, " RDF (Turtle) export describing the current OPM model with the OPCloud ontology for seamless ingestion into semantic tools. ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(6, ModelAnalysisToolsComponent_div_6_Template, 3, 2, "div", 5);
          core /* ɵɵelementStart */.j41(7, "div", 2)(8, "label", 4);
          core /* ɵɵtext */.EFF(9, " CSV file containing the current loaded model (in current tab) triplets of ");
          core /* ɵɵelement */.nrm(10, "br");
          core /* ɵɵtext */.EFF(11, "[Source, Link, Target] after we flatten the OPM model using our DSM flatting algorithm ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(12, "div", 6)(13, "mat-checkbox", 7, 0);
          core /* ɵɵtext */.EFF(15, "Include Exhibitors Names");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "button", 8);
          core /* ɵɵlistener */.bIt("click", function ModelAnalysisToolsComponent_Template_button_click_16_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const includeExhibit_r4 = core /* ɵɵreference */.sdS(14);
            return core /* ɵɵresetView */.Njj(ctx.exportTripletsCSVFile(includeExhibit_r4.checked));
          });
          core /* ɵɵtext */.EFF(17, "Download Model Triplets");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.canDownloadRdf);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("checked", true);
        }
      },
      dependencies: [NgIf, MatTooltip, MatButton, MatCheckbox],
      styles: [".div[_ngcontent-%COMP%]{position:relative;width:453px;left:50px;top:50px}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:center;padding-bottom:30px}.download-text[_ngcontent-%COMP%]{color:#1a3763;width:450px;margin:0 auto 12px;display:block}#modelRdf[_ngcontent-%COMP%], #modelTriplets[_ngcontent-%COMP%]{display:grid;justify-content:center;width:100%;padding-bottom:40px}#TripletsBtn[_ngcontent-%COMP%], #RdfBtn[_ngcontent-%COMP%]{color:#1a3763!important;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;letter-spacing:normal;top:10px}"]
    }))();
  }
  return ModelAnalysisToolsComponent;
})();