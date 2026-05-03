// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/FileUploader/FileUploader.ts
// Extracted by opm-extracted/tools/extract.mjs

function UploadFile_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 8)(1, "label");
    core /* ɵɵtext */.EFF(2, "Attention: the input file must be .opx saved in OPCAT 4.2.");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(3, "br");
    core /* ɵɵelementStart */.j41(4, "label");
    core /* ɵɵtext */.EFF(5, " download OPCAT 4.2 from ");
    core /* ɵɵelementStart */.j41(6, "a", 9);
    core /* ɵɵtext */.EFF(7, "OPCAT Installation");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵelementStart */.j41(9, "button", 10);
    core /* ɵɵlistener */.bIt("click", function UploadFile_div_2_Template_button_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const fileInput_r2 = core /* ɵɵreference */.sdS(13);
      return core /* ɵɵresetView */.Njj(fileInput_r2.click());
    });
    core /* ɵɵelementStart */.j41(10, "mat-icon");
    core /* ɵɵtext */.EFF(11, "attach_file");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "input", 11, 0);
    core /* ɵɵlistener */.bIt("change", function UploadFile_div_2_Template_input_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.loadOPCATFile($event));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "label", 12);
    core /* ɵɵtext */.EFF(15, "Import OPX Model");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function UploadFile_ul_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "ul")(1, "li", 13)(2, "span", 13);
    core /* ɵɵtext */.EFF(3, "File Name : ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "li", 13)(6, "span", 13);
    core /* ɵɵtext */.EFF(7, "File Size : ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵpipe */.nI1(9, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.file.name);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate1 */.SpI("", core /* ɵɵpipeBind2 */.i5U(9, 2, ctx_r2.file.size / 1024, ".2"), " KB");
  }
}
function UploadFile_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 14);
    core /* ɵɵlistener */.bIt("click", function UploadFile_button_7_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.Import());
    });
    core /* ɵɵtext */.EFF(1, "IMPORT");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r2.imported);
  }
}
function UploadFile_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 15);
    core /* ɵɵlistener */.bIt("click", function UploadFile_button_8_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.logFile());
    });
    core /* ɵɵtext */.EFF(1, "DOWNLOAD LOG");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleMap */.Aen(ctx_r2.logcolor ? "background-color: " + ctx_r2.logcolor + ";color: white;margin-right: 15px;" : "margin-right: 15px;");
    core /* ɵɵproperty */.Y8G("color", ctx_r2.logcolor);
  }
}
function UploadFile_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 16);
    core /* ɵɵlistener */.bIt("click", function UploadFile_button_9_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.dialogRef.close());
    });
    core /* ɵɵtext */.EFF(1, "CANCEL");
    core /* ɵɵelementEnd */.k0s();
  }
}
function UploadFile_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 16);
    core /* ɵɵlistener */.bIt("click", function UploadFile_button_10_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.dialogRef.close());
    });
    core /* ɵɵtext */.EFF(1, "OK");
    core /* ɵɵelementEnd */.k0s();
  }
}
let UploadFile = /*#__PURE__*/(() => {
  class UploadFile {
    constructor(dialogRef, graphService, contextService, modelService, initRappidService) {
      this.dialogRef = dialogRef;
      this.graphService = graphService;
      this.contextService = contextService;
      this.modelService = modelService;
      this.initRappidService = initRappidService;
      this.file = null; // Variable to store file
      this.reader = new FileReader();
      this.onAdd = new EventEmitter();
      this.importOPX = true;
      this.imported = true;
      this.uploaded = false;
      this.logcolor = "primary";
      this.DoneImport = false;
      this.log = "";
      this.now = new Date();
    }
    ngOnInit() {}
    /**
     * Loading the OPCAT file content and reading it preparing for import.
     * @param event
     * @private
     */
    loadOPCATFile(event) {
      if (event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        const fileReader = new FileReader();
        const that = this;
        fileReader.readAsText(file);
        fileReader.onload = e => {
          this.XML = e.target.result;
          (0, xml2js.parseString)(this.XML, function (err, result) {
            that.OPX_JSON = result;
            that.uploaded = true;
            that.imported = false;
          });
        };
      }
    }
    Import() {
      var _this = this;
      return (0, default)(function* () {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 3000);
        });
        promise.then(() => {
          // reset the current graph in the back
          _this.contextService.newModel();
          _this.contextService.closeEmptyTabs();
          _this.graphService.renderGraph(_this.modelService.model.getOpd("SD"), _this.initRappidService);
          const ImportedModel = _this.graphService.importOpxGraph(_this.OPX_JSON, _this.initRappidService);
          _this.log = JSON.stringify(ImportedModel.Log, null, " ");
          _this.DoneImport = true;
          _this.imported = true;
          if (ImportedModel.CheckLog) {
            _this.logcolor = "warn";
          }
          const init = (0, getInitRappidShared)();
          init.getOpmModel().opds.forEach(opd => {
            init.graphService.renderGraph(opd, init);
            init.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnEntity(c)).forEach(th => {
              const vis = th.getVisual();
              th.set("position", {
                x: vis.xPos * 2,
                y: vis.yPos * 2
              });
              th.autosize(init);
              if (OPCloudUtils.isInstanceOfDrawnProcess(th)) {
                th.changeSizeHandle(init);
              }
            });
            init.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnTriangle(c)).forEach(tr => {
              tr.set("position", {
                x: tr.get("position").x * 2,
                y: tr.get("position").y * 2
              });
            });
            init.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnObject(c)).forEach(obj => {
              obj.attr("text/ref-y", obj.hasStates() ? 0.25 : 0.5);
              obj.shiftEmbeddedToEdge(init);
            });
            for (const vis of opd.visualElements) {
              if (vis instanceof OpmVisualThing) {
                opd.beautify(vis);
              }
            }
            init.graphService.updateOPDAfterImport(opd, init);
            init.graphService.renderGraph(opd, init);
          });
          // Going back to SD opd so it will be displayed and rendering all OPDs tree
          _this.graphService.renderGraph(_this.modelService.model.getOpd("SD"), _this.initRappidService);
          const tabsManager = new TabsManager(_this.initRappidService, _this.contextService);
          tabsManager.refreshTab();
        }).catch(error => (0, validationAlert)(`OPCloud uncounted an issue importing the OPCAT file:\n${error}`, 5000, "Error"));
      })();
    }
    logFile() {
      FileSaver_min.saveAs(new Blob([this.log], {
        type: "text/plain;charset=utf-8"
      }), "OPCloud_log" + this.now + ".txt");
      this.dialogRef.close();
    }
    onButtonClick() {
      this.onAdd.emit();
    }
    static #_ = (() => this.ɵfac = function UploadFile_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UploadFile)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(ModelService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: UploadFile,
      selectors: [["Upload_File"]],
      decls: 11,
      vars: 6,
      consts: [["fileInput", ""], ["style", "display: inline-block", 4, "ngIf"], [2, "padding", "0"], [4, "ngIf"], [2, "align-items", "center"], ["mat-raised-button", "", "id", "import", "style", "margin-right: 15px;letter-spacing: normal;color: #1A3763", 3, "disabled", "click", 4, "ngIf"], ["mat-raised-button", "", "id", "log", 3, "color", "style", "click", 4, "ngIf"], ["mat-raised-button", "", "class", "importButton", 3, "click", 4, "ngIf"], [2, "display", "inline-block"], ["href", "https://esml.technion.ac.il/opm/opcat-installation/", "target", "_blank"], ["mat-mini-fab", "", "color", "primary", "id", "load_file_button", 3, "click"], ["type", "file", "accept", ".opx", "name", "single", 1, "form-control", 2, "display", "none", 3, "change"], ["id", "file_import_label"], [1, "import_file_details"], ["mat-raised-button", "", "id", "import", 2, "margin-right", "15px", "letter-spacing", "normal", "color", "#1A3763", 3, "click", "disabled"], ["mat-raised-button", "", "id", "log", 3, "click", "color"], ["mat-raised-button", "", 1, "importButton", 3, "click"]],
      template: function UploadFile_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "p");
          core /* ɵɵtext */.EFF(1, "Import OPCAT Model ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(2, UploadFile_div_2_Template, 16, 0, "div", 1);
          core /* ɵɵelementStart */.j41(3, "mat-dialog-content", 2);
          core /* ɵɵtemplate */.DNE(4, UploadFile_ul_4_Template, 10, 5, "ul", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(5, "hr");
          core /* ɵɵelementStart */.j41(6, "p", 4);
          core /* ɵɵtemplate */.DNE(7, UploadFile_button_7_Template, 2, 1, "button", 5)(8, UploadFile_button_8_Template, 2, 3, "button", 6)(9, UploadFile_button_9_Template, 2, 0, "button", 7)(10, UploadFile_button_10_Template, 2, 0, "button", 7);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.importOPX);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.file);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.importOPX);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.DoneImport);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.DoneImport);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.DoneImport);
        }
      },
      dependencies: [NgIf, MatDialogContent, MatIcon, MatButton, MatMiniFabButton, DecimalPipe],
      styles: ["p[_ngcontent-%COMP%]{font-family:Roboto,Arial,Helvetica,sans-serif;text-align:center;align-items:center;font-size:medium;color:#1a3763}ul[_ngcontent-%COMP%]{list-style-type:none;float:left;padding:5px}#load_file_button[_ngcontent-%COMP%]{margin-top:5px;background-color:#1a3763}#file_import_label[_ngcontent-%COMP%]{margin-left:10px}.import_file_details[_ngcontent-%COMP%]{width:420px;color:#1a3763;font-weight:700;letter-spacing:normal!important;line-height:normal}div[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:left;border-collapse:collapse;color:#1a3763}.importButton[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;color:#1a3763;margin:15px;letter-spacing:normal!important}"]
    }))();
  }
  return UploadFile;
})();