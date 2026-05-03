// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/dcm-export-wizard/dcm-export-wizard.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function DCMExportWizardComponent_mat_progress_bar_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "mat-progress-bar", 10);
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("value", ctx_r0.exportProgress);
  }
}
function DCMExportWizardComponent_div_8_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 16);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const process_r3 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", process_r3.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", process_r3.name, " ");
  }
}
function DCMExportWizardComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 11)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Select Root Process");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4, "Choose the root operational process for DCM conversion.");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "mat-form-field", 12)(6, "mat-label");
    core /* ɵɵtext */.EFF(7, "Root Process");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "mat-select", 13);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_8_Template_mat_select_ngModelChange_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.selectedRootProcessId, $event)) {
        ctx_r0.selectedRootProcessId = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtemplate */.DNE(9, DCMExportWizardComponent_div_8_mat_option_9_Template, 2, 2, "mat-option", 14);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "div", 15)(11, "mat-icon");
    core /* ɵɵtext */.EFF(12, "info");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "span");
    core /* ɵɵtext */.EFF(14, "The selected process and all its refined sub-processes will be included in the DCM export.");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.selectedRootProcessId);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.availableProcesses);
  }
}
function DCMExportWizardComponent_div_9_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 16);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const obj_r5 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", obj_r5.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", obj_r5.name, " ");
  }
}
function DCMExportWizardComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 11)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Select Case Entity");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4, "Choose the primary case entity (object) for the case management model.");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "mat-form-field", 12)(6, "mat-label");
    core /* ɵɵtext */.EFF(7, "Case Entity");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "mat-select", 17);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_9_Template_mat_select_ngModelChange_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.selectedCaseEntityIds, $event)) {
        ctx_r0.selectedCaseEntityIds = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtemplate */.DNE(9, DCMExportWizardComponent_div_9_mat_option_9_Template, 2, 2, "mat-option", 14);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "div", 15)(11, "mat-icon");
    core /* ɵɵtext */.EFF(12, "info");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "span");
    core /* ɵɵtext */.EFF(14, "The case entity represents the primary object being managed in the case.");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.selectedCaseEntityIds);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.candidateObjects);
  }
}
function DCMExportWizardComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 11)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Export Formats");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4, "Select which formats to include in the export.");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 18)(6, "mat-checkbox", 19);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_10_Template_mat_checkbox_ngModelChange_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.exportFormats.cmmn, $event)) {
        ctx_r0.exportFormats.cmmn = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtext */.EFF(7, " CMMN 1.1 XML (Required) ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "mat-checkbox", 13);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_10_Template_mat_checkbox_ngModelChange_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.exportFormats.cmmndi, $event)) {
        ctx_r0.exportFormats.cmmndi = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtext */.EFF(9, " CMMNDI (Diagram Layout) ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "mat-checkbox", 20);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_10_Template_mat_checkbox_ngModelChange_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.exportFormats.dmn, $event)) {
        ctx_r0.exportFormats.dmn = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("change", function DCMExportWizardComponent_div_10_Template_mat_checkbox_change_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.onDMNExportChange($event.checked));
    });
    core /* ɵɵtext */.EFF(11, " DMN 1.4 XML (Decision Tables) ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "mat-checkbox", 19);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_10_Template_mat_checkbox_ngModelChange_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.exportFormats.dcmIR, $event)) {
        ctx_r0.exportFormats.dcmIR = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtext */.EFF(13, " DCM-IR JSON (Required) ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "mat-checkbox", 19);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_10_Template_mat_checkbox_ngModelChange_14_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.exportFormats.trace, $event)) {
        ctx_r0.exportFormats.trace = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtext */.EFF(15, " Trace JSON (Required) ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "mat-checkbox", 19);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_10_Template_mat_checkbox_ngModelChange_16_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.exportFormats.validation, $event)) {
        ctx_r0.exportFormats.validation = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtext */.EFF(17, " Validation Report (Required) ");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.exportFormats.cmmn);
    core /* ɵɵproperty */.Y8G("disabled", true);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.exportFormats.cmmndi);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.exportFormats.dmn);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.exportFormats.dcmIR);
    core /* ɵɵproperty */.Y8G("disabled", true);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.exportFormats.trace);
    core /* ɵɵproperty */.Y8G("disabled", true);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.exportFormats.validation);
    core /* ɵɵproperty */.Y8G("disabled", true);
  }
}
function DCMExportWizardComponent_div_11_mat_form_field_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 12)(1, "mat-label");
    core /* ɵɵtext */.EFF(2, "Level N");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "input", 31);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_11_mat_form_field_16_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.mappingOptions.stageLevelN, $event)) {
        ctx_r0.mappingOptions.stageLevelN = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.mappingOptions.stageLevelN);
  }
}
function DCMExportWizardComponent_div_11_mat_hint_35_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-hint");
    core /* ɵɵtext */.EFF(1, "Enable DMN export in Step 3 to use this option");
    core /* ɵɵelementEnd */.k0s();
  }
}
function DCMExportWizardComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 11)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Mapping Options");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4, "Configure how OPM elements are mapped to DCM elements.");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 21)(6, "mat-form-field", 12)(7, "mat-label");
    core /* ɵɵtext */.EFF(8, "Stage Policy");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "mat-select", 13);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_11_Template_mat_select_ngModelChange_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.mappingOptions.stagePolicy, $event)) {
        ctx_r0.mappingOptions.stagePolicy = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(10, "mat-option", 22);
    core /* ɵɵtext */.EFF(11, "Refined Process (default)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "mat-option", 23);
    core /* ɵɵtext */.EFF(13, "Flat Tasks");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "mat-option", 24);
    core /* ɵɵtext */.EFF(15, "Level N");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(16, DCMExportWizardComponent_div_11_mat_form_field_16_Template, 4, 1, "mat-form-field", 25);
    core /* ɵɵelementStart */.j41(17, "mat-form-field", 12)(18, "mat-label");
    core /* ɵɵtext */.EFF(19, "Milestone Policy");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "mat-select", 13);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_11_Template_mat_select_ngModelChange_20_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.mappingOptions.milestonePolicy, $event)) {
        ctx_r0.mappingOptions.milestonePolicy = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(21, "mat-option", 26);
    core /* ɵɵtext */.EFF(22, "Goal States (default)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(23, "mat-option", 27);
    core /* ɵɵtext */.EFF(24, "All States");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(25, "mat-option", 28);
    core /* ɵɵtext */.EFF(26, "None");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(27, "mat-form-field", 12)(28, "mat-label");
    core /* ɵɵtext */.EFF(29, "Decision Extraction");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(30, "mat-select", 19);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DCMExportWizardComponent_div_11_Template_mat_select_ngModelChange_30_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.mappingOptions.decisionExtraction, $event)) {
        ctx_r0.mappingOptions.decisionExtraction = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(31, "mat-option", 28);
    core /* ɵɵtext */.EFF(32, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(33, "mat-option", 29);
    core /* ɵɵtext */.EFF(34, "Guards to DMN");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(35, DCMExportWizardComponent_div_11_mat_hint_35_Template, 2, 0, "mat-hint", 30);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.mappingOptions.stagePolicy);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.mappingOptions.stagePolicy === "level-n");
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.mappingOptions.milestonePolicy);
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.mappingOptions.decisionExtraction);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r0.isDecisionExtractionDisabled);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.isDecisionExtractionDisabled);
  }
}
function DCMExportWizardComponent_div_12_li_31_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li");
    core /* ɵɵtext */.EFF(1, "case.cmmndi");
    core /* ɵɵelementEnd */.k0s();
  }
}
function DCMExportWizardComponent_div_12_li_32_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li");
    core /* ɵɵtext */.EFF(1, "dmn/*.dmn");
    core /* ɵɵelementEnd */.k0s();
  }
}
function DCMExportWizardComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 11)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Summary & Export");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4, "Review the export configuration and export.");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 32)(6, "h4");
    core /* ɵɵtext */.EFF(7, "Export Summary");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "ul")(9, "li");
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "li");
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "li");
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "li");
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "li");
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(19, "div", 33)(20, "h4");
    core /* ɵɵtext */.EFF(21, "Expected Files");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(22, "ul")(23, "li");
    core /* ɵɵtext */.EFF(24, "case.cmmn ");
    core /* ɵɵelementStart */.j41(25, "span", 34);
    core /* ɵɵtext */.EFF(26, "(FLOWABLE mode, Flowable 6.7.2 compatible)");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(27, "li");
    core /* ɵɵtext */.EFF(28, "case_standard.cmmn ");
    core /* ɵɵelementStart */.j41(29, "span", 34);
    core /* ɵɵtext */.EFF(30, "(STANDARD mode, CMMN 1.1 XSD-compliant)");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(31, DCMExportWizardComponent_div_12_li_31_Template, 2, 0, "li", 30)(32, DCMExportWizardComponent_div_12_li_32_Template, 2, 0, "li", 30);
    core /* ɵɵelementStart */.j41(33, "li");
    core /* ɵɵtext */.EFF(34, "case.dcm_ir.json");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(35, "li");
    core /* ɵɵtext */.EFF(36, "trace.json");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(37, "li");
    core /* ɵɵtext */.EFF(38, "validation_report.json");
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵtextInterpolate1 */.SpI("Root Process: ", ctx_r0.selectedRootProcessName, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Case Entities: ", ctx_r0.selectedCaseEntityNames.join(", "), "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Stage Policy: ", ctx_r0.mappingOptions.stagePolicy, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Milestone Policy: ", ctx_r0.mappingOptions.milestonePolicy, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Decision Extraction: ", ctx_r0.mappingOptions.decisionExtraction, "");
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.exportFormats.cmmndi);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.exportFormats.dmn);
  }
}
function DCMExportWizardComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 35);
    core /* ɵɵelement */.nrm(1, "mat-spinner", 36);
    core /* ɵɵelementStart */.j41(2, "p");
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI("Exporting... ", ctx_r0.exportProgress, "%");
  }
}
function DCMExportWizardComponent_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 37);
    core /* ɵɵlistener */.bIt("click", function DCMExportWizardComponent_button_19_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.nextStep());
    });
    core /* ɵɵtext */.EFF(1, " Next ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r0.canProceed() || ctx_r0.exporting);
  }
}
function DCMExportWizardComponent_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 37);
    core /* ɵɵlistener */.bIt("click", function DCMExportWizardComponent_button_20_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.export());
    });
    core /* ɵɵtext */.EFF(1, " Export ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r0.exporting);
  }
}
let DCMExportWizardComponent = /*#__PURE__*/(() => {
  class DCMExportWizardComponent {
    // Computed property to check if Decision Extraction dropdown should be disabled
    get isDecisionExtractionDisabled() {
      return !this.exportFormats.dmn;
    }
    /**
     * Handle DMN export checkbox change
     * Automatically sets decisionExtraction based on DMN checkbox state
     */
    onDMNExportChange(checked) {
      this.exportFormats.dmn = checked;
      // Auto-set decisionExtraction: guards-to-dmn when DMN is enabled, none when disabled
      if (checked) {
        this.mappingOptions.decisionExtraction = "guards-to-dmn";
      } else {
        this.mappingOptions.decisionExtraction = "none";
      }
    }
    constructor(dialogRef, initRappidService, dcmExportService, data) {
      this.dialogRef = dialogRef;
      this.initRappidService = initRappidService;
      this.dcmExportService = dcmExportService;
      this.data = data;
      this.currentStep = 0;
      this.totalSteps = 5;
      // Step A: Root Process Selection
      this.availableProcesses = [];
      this.selectedRootProcessId = "";
      // Step B: Case Entity Selection
      this.candidateObjects = [];
      this.selectedCaseEntityIds = [];
      // Step C: Export Formats
      this.exportFormats = {
        cmmn: true,
        // always true
        cmmndi: true,
        // checked by default for Flowable compatibility
        dmn: true,
        // checked by default
        dcmIR: true,
        // always true
        trace: true,
        // always true
        validation: true // always true
      };
      // Step D: Mapping Options
      this.mappingOptions = {
        stagePolicy: "refined-process",
        stageLevelN: 2,
        milestonePolicy: "goal-states",
        decisionExtraction: "guards-to-dmn",
        // Default to guards-to-dmn when DMN is enabled
        layoutStrategy: "auto-layout"
      };
      // Step E: Summary
      this.summary = null;
      this.exporting = false;
      this.exportProgress = 0;
      // For summary display
      this.selectedRootProcessName = "";
      this.selectedCaseEntityNames = [];
      this.opmModel = this.initRappidService.opmModel;
      this.initializeWizardState();
    }
    ngOnInit() {
      this.loadStepAData();
    }
    /**
     * Initialize wizard state
     */
    initializeWizardState() {
      this.wizardState = {
        stepA: {
          rootProcessId: "",
          scopingMode: "reachable-procedural-subgraph"
        },
        stepB: {
          caseEntityIds: []
        },
        stepC: {
          exportCMMN: true,
          exportCMMNDI: true,
          // checked by default for Flowable compatibility
          exportDMN: true,
          // checked by default
          exportDCMIR: true,
          exportTrace: true,
          exportValidation: true
        },
        stepD: {
          stagePolicy: "refined-process",
          milestonePolicy: "goal-states",
          decisionExtraction: "guards-to-dmn",
          // Default to guards-to-dmn when DMN is enabled
          layoutStrategy: "auto-layout"
        },
        stepE: {
          summary: {
            stageCount: 0,
            taskCount: 0,
            milestoneCount: 0,
            unhandledProcesses: [],
            guardWarnings: []
          }
        }
      };
    }
    /**
     * Load data for Step A
     */
    loadStepAData() {
      // Get all operational processes
      this.availableProcesses = this.opmModel.logicalElements.filter(el => el instanceof OpmLogicalProcess).map(proc => ({
        id: proc.lid,
        name: proc.getName() || proc.text || "Unnamed Process",
        lid: proc.lid
      }));
      if (this.availableProcesses.length > 0) {
        this.selectedRootProcessId = this.availableProcesses[0].id;
      }
    }
    /**
     * Load data for Step B
     */
    loadStepBData() {
      // Get candidate objects (simplified - in production would use case entity selection algorithm)
      this.candidateObjects = this.opmModel.logicalElements.filter(el => el instanceof OpmLogicalObject).map(obj => ({
        id: obj.lid,
        name: obj.getName() || obj.text || "Unnamed Object",
        lid: obj.lid
      }));
      if (this.candidateObjects.length > 0 && this.selectedCaseEntityIds.length === 0) {
        // Auto-select first object
        this.selectedCaseEntityIds = [this.candidateObjects[0].id];
      }
    }
    /**
     * Next step
     */
    nextStep() {
      if (this.canProceed()) {
        if (this.currentStep === 0) {
          // Moving to Step B - load candidate objects
          this.loadStepBData();
          this.wizardState.stepA.rootProcessId = this.selectedRootProcessId;
          // Store name for summary
          const selectedProcess = this.availableProcesses.find(p => p.id === this.selectedRootProcessId);
          this.selectedRootProcessName = selectedProcess ? selectedProcess.name : this.selectedRootProcessId;
        } else if (this.currentStep === 1) {
          // Moving to Step C - update wizard state
          this.wizardState.stepB.caseEntityIds = this.selectedCaseEntityIds;
          // Store names for summary
          this.selectedCaseEntityNames = this.selectedCaseEntityIds.map(id => {
            const obj = this.candidateObjects.find(o => o.id === id);
            if (obj) {
              return obj.name;
            } else {
              return id;
            }
          });
        } else if (this.currentStep === 2) {
          // Moving to Step D - update wizard state
          this.wizardState.stepC = {
            exportCMMN: this.exportFormats.cmmn,
            exportCMMNDI: this.exportFormats.cmmndi,
            exportDMN: this.exportFormats.dmn,
            exportDCMIR: this.exportFormats.dcmIR,
            exportTrace: this.exportFormats.trace,
            exportValidation: this.exportFormats.validation
          };
        } else if (this.currentStep === 3) {
          // Moving to Step E - update wizard state and generate summary
          this.wizardState.stepD = {
            stagePolicy: this.mappingOptions.stagePolicy,
            stageLevelN: this.mappingOptions.stageLevelN,
            milestonePolicy: this.mappingOptions.milestonePolicy,
            decisionExtraction: this.mappingOptions.decisionExtraction,
            layoutStrategy: this.mappingOptions.layoutStrategy
          };
          this.generateSummary();
        }
        if (this.currentStep < this.totalSteps - 1) {
          this.currentStep++;
        }
      }
    }
    /**
     * Previous step
     */
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    }
    /**
     * Check if can proceed to next step
     */
    canProceed() {
      if (this.currentStep === 0) {
        return this.selectedRootProcessId !== "";
      } else if (this.currentStep === 1) {
        return this.selectedCaseEntityIds.length > 0;
      }
      return true;
    }
    /**
     * Generate summary for Step E
     */
    generateSummary() {
      // Simplified summary - in production would run preview conversion
      this.summary = {
        stageCount: 0,
        taskCount: 0,
        milestoneCount: 0,
        unhandledProcesses: [],
        guardWarnings: []
      };
    }
    /**
     * Export
     */
    export() {
      var _this = this;
      return (0, default)(function* () {
        if (!_this.canProceed()) {
          (0, validationAlert)("Please complete all required steps", null, "Error");
          return;
        }
        _this.exporting = true;
        _this.exportProgress = 0;
        try {
          // Update final wizard state
          _this.wizardState.stepA.rootProcessId = _this.selectedRootProcessId;
          _this.wizardState.stepB.caseEntityIds = _this.selectedCaseEntityIds;
          _this.wizardState.stepC = {
            exportCMMN: _this.exportFormats.cmmn,
            exportCMMNDI: _this.exportFormats.cmmndi,
            exportDMN: _this.exportFormats.dmn,
            exportDCMIR: _this.exportFormats.dcmIR,
            exportTrace: _this.exportFormats.trace,
            exportValidation: _this.exportFormats.validation
          };
          // Set decisionExtraction based on DMN checkbox
          // If DMN is checked, use guards-to-dmn; otherwise none
          const decisionExtraction = _this.exportFormats.dmn ? "guards-to-dmn" : "none";
          _this.wizardState.stepD = {
            stagePolicy: _this.mappingOptions.stagePolicy,
            stageLevelN: _this.mappingOptions.stageLevelN,
            milestonePolicy: _this.mappingOptions.milestonePolicy,
            decisionExtraction: decisionExtraction,
            layoutStrategy: _this.mappingOptions.layoutStrategy
          };
          _this.exportProgress = 25;
          // Execute export
          const zipBlob = yield _this.dcmExportService.executeExport(_this.wizardState, _this.opmModel);
          _this.exportProgress = 100;
          // Download ZIP
          const fileName = `${_this.opmModel.name || "OPM_Model"}_dcm_export_${Date.now()}.zip`;
          FileSaver_min.saveAs(zipBlob, fileName);
          (0, validationAlert)("DCM export completed successfully", null, "Success");
          _this.dialogRef.close();
        } catch (error) {
          console.error("Export error:", error);
          (0, validationAlert)(`Export failed: ${error.message || "Unknown error"}`, null, "Error");
          _this.exporting = false;
        }
      })();
    }
    /**
     * Cancel
     */
    cancel() {
      this.dialogRef.close();
    }
    /**
     * Get step title
     */
    getStepTitle() {
      const titles = ["Root Process Selection", "Case Entity Selection", "Export Formats", "Mapping Options", "Summary & Export"];
      return titles[this.currentStep] || "";
    }
    static #_ = (() => this.ɵfac = function DCMExportWizardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DCMExportWizardComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(DCMExportWizardService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: DCMExportWizardComponent,
      selectors: [["opcloud-dcm-export-wizard"]],
      decls: 21,
      vars: 15,
      consts: [[1, "dcm-wizard-container"], [1, "dcm-wizard-header"], [1, "step-indicator"], ["mode", "determinate", 3, "value", 4, "ngIf"], [1, "dcm-wizard-content", 3, "hidden"], ["class", "wizard-step", 4, "ngIf"], ["class", "export-progress", 4, "ngIf"], [1, "dcm-wizard-actions"], ["mat-button", "", 3, "click", "disabled"], ["mat-raised-button", "", "color", "primary", 3, "disabled", "click", 4, "ngIf"], ["mode", "determinate", 3, "value"], [1, "wizard-step"], ["appearance", "outline", 2, "width", "100%"], [3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [1, "info-box"], [3, "value"], ["multiple", "", 3, "ngModelChange", "ngModel"], [1, "checkbox-list"], [3, "ngModelChange", "ngModel", "disabled"], [3, "ngModelChange", "change", "ngModel"], [1, "mapping-options-fields"], ["value", "refined-process"], ["value", "flat-tasks"], ["value", "level-n"], ["appearance", "outline", "style", "width: 100%;", 4, "ngIf"], ["value", "goal-states"], ["value", "all-states"], ["value", "none"], ["value", "guards-to-dmn"], [4, "ngIf"], ["matInput", "", "type", "number", "min", "1", "max", "10", 3, "ngModelChange", "ngModel"], [1, "summary-section"], [1, "expected-files"], [1, "file-description"], [1, "export-progress"], ["diameter", "50"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"]],
      template: function DCMExportWizardComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2");
          core /* ɵɵtext */.EFF(3, "OPM to DCM Export Wizard");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "p", 2);
          core /* ɵɵtext */.EFF(5);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(6, DCMExportWizardComponent_mat_progress_bar_6_Template, 1, 1, "mat-progress-bar", 3);
          core /* ɵɵelementStart */.j41(7, "div", 4);
          core /* ɵɵtemplate */.DNE(8, DCMExportWizardComponent_div_8_Template, 15, 2, "div", 5)(9, DCMExportWizardComponent_div_9_Template, 15, 2, "div", 5)(10, DCMExportWizardComponent_div_10_Template, 18, 10, "div", 5)(11, DCMExportWizardComponent_div_11_Template, 36, 6, "div", 5)(12, DCMExportWizardComponent_div_12_Template, 39, 7, "div", 5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(13, DCMExportWizardComponent_div_13_Template, 4, 1, "div", 6);
          core /* ɵɵelementStart */.j41(14, "div", 7)(15, "button", 8);
          core /* ɵɵlistener */.bIt("click", function DCMExportWizardComponent_Template_button_click_15_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(16, "Cancel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "button", 8);
          core /* ɵɵlistener */.bIt("click", function DCMExportWizardComponent_Template_button_click_17_listener() {
            return ctx.previousStep();
          });
          core /* ɵɵtext */.EFF(18, " Previous ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(19, DCMExportWizardComponent_button_19_Template, 2, 1, "button", 9)(20, DCMExportWizardComponent_button_20_Template, 2, 1, "button", 9);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtextInterpolate3 */.E5c("Step ", ctx.currentStep + 1, " of ", ctx.totalSteps, ": ", ctx.getStepTitle(), "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.exporting);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", ctx.exporting);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep === 1);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep === 2);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep === 3);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep === 4);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.exporting);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("disabled", ctx.exporting);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("disabled", ctx.currentStep === 0 || ctx.exporting);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep < ctx.totalSteps - 1);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentStep === ctx.totalSteps - 1);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatHint, MatInput, MatIcon, MatSelect, MatOption, MatButton, MatCheckbox, MatProgressSpinner, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, MatProgressBar],
      styles: [".dcm-wizard-container[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden}.dcm-wizard-header[_ngcontent-%COMP%]{padding:15px 20px;border-bottom:1px solid #e0e0e0;flex-shrink:0}.dcm-wizard-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0 0 5px;font-size:20px;color:#1a3763;text-align:center}.dcm-wizard-header[_ngcontent-%COMP%]   .step-indicator[_ngcontent-%COMP%]{margin:0;color:#666;font-size:12px;text-align:center}.dcm-wizard-content[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:20px;min-height:0}.wizard-step[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-top:0;margin-bottom:10px;font-size:18px;color:#1a3763;font-weight:500}.wizard-step[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#666;margin-bottom:20px;font-size:14px}.info-box[_ngcontent-%COMP%]{display:flex;align-items:flex-start;margin-top:15px;padding:12px;background-color:#e3f2fd;border-radius:4px;border-left:3px solid #1976d2}.info-box[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{margin-right:10px;margin-top:2px;color:#1976d2;font-size:20px;width:20px;height:20px}.info-box[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{flex:1;font-size:13px;color:#555;line-height:1.4}.checkbox-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px;margin-top:10px}.checkbox-list[_ngcontent-%COMP%]   mat-checkbox[_ngcontent-%COMP%]{font-size:14px}.mapping-options-fields[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:20px;margin-top:10px}.mapping-options-fields[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{margin-bottom:0}.summary-section[_ngcontent-%COMP%], .expected-files[_ngcontent-%COMP%]{margin:20px 0}.summary-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .expected-files[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin-bottom:10px;font-size:16px;color:#1a3763;font-weight:500}.summary-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .expected-files[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style-type:none;padding-left:0;margin:0}.summary-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], .expected-files[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding:8px 0;border-bottom:1px solid #e0e0e0;font-size:14px}.summary-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child, .expected-files[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child{border-bottom:none}.summary-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .file-description[_ngcontent-%COMP%], .expected-files[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .file-description[_ngcontent-%COMP%]{font-size:12px;color:#666;font-style:italic;margin-left:8px}.export-progress[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px}.export-progress[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:20px;font-size:16px}.dcm-wizard-actions[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:10px;padding:15px 20px;border-top:1px solid #e0e0e0;flex-shrink:0}.dcm-wizard-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-weight:400!important}"]
    }))();
  }
  return DCMExportWizardComponent;
})();