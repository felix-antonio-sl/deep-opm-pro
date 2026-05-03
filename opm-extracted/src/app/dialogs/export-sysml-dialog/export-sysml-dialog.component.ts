// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/export-sysml-dialog/export-sysml-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function ExportSysMLDialogComponent_mat_option_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 24);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const tool_r2 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", tool_r2.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tool_r2.label, " ");
  }
}
function ExportSysMLDialogComponent_mat_checkbox_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-checkbox", 25);
    core /* ɵɵlistener */.bIt("change", function ExportSysMLDialogComponent_mat_checkbox_30_Template_mat_checkbox_change_0_listener() {
      const option_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r4 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r4.toggleDiagramSelection(option_r4.id));
    });
    core /* ɵɵelementStart */.j41(1, "span", 26);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    const ctx_r4 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("checked", ctx_r4.isDiagramSelected(option_r4.id))("disabled", !option_r4.enabled);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", option_r4.description);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", option_r4.name, " ");
  }
}
let ExportSysMLDialogComponent = /*#__PURE__*/(() => {
  class ExportSysMLDialogComponent {
    constructor(data, dialogRef, initRappidService, xmiGenerator) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.initRappidService = initRappidService;
      this.xmiGenerator = xmiGenerator;
      this.spinnerFlag = false;
      this.exportProgress = 0;
      this.selectedTool = "papyrus";
      // Available SysML diagram types based on thesis
      this.diagramOptions = [{
        id: "useCase",
        name: "Use Case Diagram",
        description: "Models system usage by actors and use cases",
        enabled: true,
        defaultSelected: false
      }, {
        id: "blockDefinition",
        name: "Block Definition Diagram",
        description: "Defines features of blocks and relationships between blocks",
        enabled: true,
        defaultSelected: true
      }, {
        id: "activity",
        name: "Activity Diagram",
        description: "Specifies flow of actions and routing elements",
        enabled: true,
        defaultSelected: false
      }, {
        id: "stateMachine",
        name: "State Machine Diagram",
        description: "Describes behavior in terms of states and transitions",
        enabled: false,
        defaultSelected: false
      }, {
        id: "sequence",
        name: "Sequence Diagram",
        description: "Describes flow of control between parts of a system",
        enabled: false,
        defaultSelected: false
      }, {
        id: "requirement",
        name: "Requirement Diagram",
        description: "Specifies requirements and relationships among them",
        enabled: false,
        defaultSelected: false
      }, {
        id: "internalBlock",
        name: "Internal Block Diagram",
        description: "Depicts internal structure of blocks and their parts",
        enabled: false,
        defaultSelected: false
      }];
      this.selectedDiagrams = new Set();
      this.toolOptions = [{
        id: "papyrus",
        label: "Papyrus",
        description: "Generates a Papyrus-compatible bundle with diagrams.",
        fileExtension: "zip"
      }, {
        id: "xmi",
        label: "XMI File",
        description: "Generates a plain XMI file according to the XMI definition.",
        fileExtension: "xmi"
      }];
      if (data && data.modelName) {
        this.modelName = data.modelName;
      } else {
        this.modelName = "Unsaved Model";
      }
      // Initialize selected diagrams based on defaults
      this.diagramOptions.forEach(option => {
        if (option.defaultSelected) {
          this.selectedDiagrams.add(option.id);
        }
      });
    }
    toggleDiagramSelection(diagramId) {
      if (this.selectedDiagrams.has(diagramId)) {
        this.selectedDiagrams.delete(diagramId);
      } else {
        this.selectedDiagrams.add(diagramId);
      }
    }
    selectAll() {
      this.diagramOptions.forEach(option => {
        if (option.enabled) {
          this.selectedDiagrams.add(option.id);
        }
      });
    }
    deselectAll() {
      this.selectedDiagrams.clear();
    }
    isDiagramSelected(diagramId) {
      return this.selectedDiagrams.has(diagramId);
    }
    canExport() {
      return this.selectedDiagrams.size > 0;
    }
    getSelectedToolConfig() {
      return this.toolOptions.find(tool => tool.id === this.selectedTool) ?? this.toolOptions[0];
    }
    exportToSysML() {
      var _this = this;
      return (0, default)(function* () {
        if (!_this.canExport()) {
          return;
        }
        _this.spinnerFlag = true;
        _this.exportProgress = 0;
        try {
          const model = _this.initRappidService.opmModel;
          const fileName = _this.modelName || "OPM_Model";
          // Update progress
          _this.exportProgress = 10;
          // Generate XMI file with selected diagrams
          const toolConfig = _this.getSelectedToolConfig();
          const exportResult = yield _this.xmiGenerator.generateXmi(model, Array.from(_this.selectedDiagrams), _this.selectedTool, fileName, progress => {
            _this.exportProgress = 10 + progress * 0.9; // 10-100%
          });
          _this.exportProgress = 100;
          const fullFileName = `${fileName}_SysML.${exportResult.extension || toolConfig.fileExtension}`;
          FileSaver_min.saveAs(exportResult.blob, fullFileName);
          // Close dialog after a short delay
          setTimeout(() => {
            _this.dialogRef.close();
          }, 500);
        } catch (error) {
          console.error("Error exporting to SysML:", error);
          alert("Error exporting to SysML. Please check the console for details.");
          _this.spinnerFlag = false;
        }
      })();
    }
    cancel() {
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function ExportSysMLDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ExportSysMLDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(SysMLXmiGeneratorService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ExportSysMLDialogComponent,
      selectors: [["opcloud-export-sysml-dialog"]],
      decls: 43,
      vars: 14,
      consts: [["filename", ""], [1, "exportHtmlDiv", 3, "hidden"], [1, "exportHtmlTitle"], [2, "font-size", "13px", "text-align", "center"], [2, "font-size", "13px", "text-align", "center", "color", "darkred"], [1, "htmlCheckboxDiv"], [2, "width", "95%", "text-align", "start"], ["matInput", "", "placeholder", "File Name:", "matTooltipPosition", "above", 3, "ngModelChange", "ngModel", "matTooltip"], [3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [1, "diagram-selection-toolbar"], [1, "diagram-selection-title"], [1, "select-all-buttons"], ["mat-button", "", 3, "click"], [1, "diagram-checkbox-list"], ["class", "diagram-option-checkbox", 3, "checked", "disabled", "change", 4, "ngFor", "ngForOf"], [1, "htmlExportButtonsP"], [1, "htmlExportButtonsP", "button-row"], ["mat-raised-button", "", 1, "htmlExportButton", 3, "click", "disabled"], ["mat-raised-button", "", 1, "htmlExportButton", 2, "margin-left", "15px", 3, "click"], [2, "margin-top", "-150px", 3, "hidden"], ["id", "spinnerWorking", "mode", "indeterminate", 2, "height", "135px", "margin-left", "calc(50% - 65px)"], [2, "position", "absolute", "width", "60px", "left", "calc(50% - 30px)", "top", "calc(50% - 115px)", 3, "hidden"], ["id", "spinnerValue", 2, "color", "#FFFF"], [3, "value"], [1, "diagram-option-checkbox", 3, "change", "checked", "disabled"], ["matTooltipPosition", "right", 1, "diagram-option-label", 3, "matTooltip"]],
      template: function ExportSysMLDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "div", 2)(2, "p", 2);
          core /* ɵɵtext */.EFF(3, "Export OPM Model to SysML");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "p", 3);
          core /* ɵɵtext */.EFF(5, "Note: Exporting might take a few minutes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "p", 4);
          core /* ɵɵtext */.EFF(7, "This Beta feature is subject to change and may become a premium option later");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(8, "div", 5)(9, "mat-form-field", 6)(10, "mat-label");
          core /* ɵɵtext */.EFF(11, "File Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "input", 7, 0);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportSysMLDialogComponent_Template_input_ngModelChange_12_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.modelName, $event)) {
              ctx.modelName = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(14, "mat-form-field", 6)(15, "mat-label");
          core /* ɵɵtext */.EFF(16, "Target Tool");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "mat-select", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportSysMLDialogComponent_Template_mat_select_ngModelChange_17_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.selectedTool, $event)) {
              ctx.selectedTool = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵtemplate */.DNE(18, ExportSysMLDialogComponent_mat_option_18_Template, 2, 2, "mat-option", 9);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(19, "mat-hint");
          core /* ɵɵtext */.EFF(20);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(21, "div", 10)(22, "span", 11);
          core /* ɵɵtext */.EFF(23, "Select SysML Diagrams");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "span", 12)(25, "button", 13);
          core /* ɵɵlistener */.bIt("click", function ExportSysMLDialogComponent_Template_button_click_25_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.selectAll());
          });
          core /* ɵɵtext */.EFF(26, "Select All");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(27, "button", 13);
          core /* ɵɵlistener */.bIt("click", function ExportSysMLDialogComponent_Template_button_click_27_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.deselectAll());
          });
          core /* ɵɵtext */.EFF(28, "Deselect All");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(29, "div", 14);
          core /* ɵɵtemplate */.DNE(30, ExportSysMLDialogComponent_mat_checkbox_30_Template, 3, 4, "mat-checkbox", 15);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(31, "div", 16)(32, "p", 17)(33, "button", 18);
          core /* ɵɵlistener */.bIt("click", function ExportSysMLDialogComponent_Template_button_click_33_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.exportToSysML());
          });
          core /* ɵɵtext */.EFF(34, " Export ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(35, "button", 19);
          core /* ɵɵlistener */.bIt("click", function ExportSysMLDialogComponent_Template_button_click_35_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.cancel());
          });
          core /* ɵɵtext */.EFF(36, " Cancel ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(37, "div", 20);
          core /* ɵɵelement */.nrm(38, "progress-spinner", 21);
          core /* ɵɵelementStart */.j41(39, "div", 22)(40, "h2", 23);
          core /* ɵɵtext */.EFF(41);
          core /* ɵɵpipe */.nI1(42, "number");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          let tmp_6_0;
          core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx.modelName);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.modelName);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.selectedTool);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.toolOptions);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh((tmp_6_0 = ctx.getSelectedToolConfig()) == null ? null : tmp_6_0.description);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.diagramOptions);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("disabled", !ctx.canExport());
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate1 */.SpI("", core /* ɵɵpipeBind2 */.i5U(42, 11, ctx.exportProgress, "1.0-0"), "%");
        }
      },
      dependencies: [NgForOf, MatFormField, MatLabel, MatHint, MatInput, MatTooltip, MatSelect, MatOption, MatButton, MatCheckbox, ProgressSpinner, DefaultValueAccessor, NgControlStatus, NgModel, DecimalPipe],
      styles: [".exportHtmlDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important;min-height:590px;padding-bottom:0}.exportHtmlTitle[_ngcontent-%COMP%]{text-align:center;color:#000000de!important}.htmlCheckboxDiv[_ngcontent-%COMP%]{display:block!important;padding-right:8px}.htmlCheckboxDiv[_ngcontent-%COMP%]   .mat-mdc-checkbox[_ngcontent-%COMP%]{height:24px!important;line-height:15px!important;padding-top:3px!important;padding-bottom:3px!important}.diagram-selection-toolbar[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin:10px 0 8px;font-size:14px;font-weight:500}.diagram-selection-title[_ngcontent-%COMP%]{color:#000000de}.select-all-buttons[_ngcontent-%COMP%]{display:flex;gap:6px}.diagram-checkbox-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:8px;padding-right:0}.diagram-option-checkbox[_ngcontent-%COMP%]{display:block!important;width:100%;line-height:20px}.diagram-option-label[_ngcontent-%COMP%]{display:inline-flex;align-items:center}.htmlExportButtonsP[_ngcontent-%COMP%]{display:block!important;justify-items:center!important;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;margin-top:10px}.htmlExportButtonsP.button-row[_ngcontent-%COMP%]{margin-top:0}.htmlExportButton[_ngcontent-%COMP%]{margin-top:24px!important;min-width:120px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}"]
    }))();
  }
  return ExportSysMLDialogComponent;
})();