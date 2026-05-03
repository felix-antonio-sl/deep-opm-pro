// Source: decompiled/37084.js
// Original path: ./src/app/dialogs/load-model-dialog/load-model-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function LoadModelDialogComponent_div_3_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 31);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_3_button_12_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.save());
    });
    core /* ɵɵtext */.EFF(1, "Save");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isSaveDisabled());
  }
}
function LoadModelDialogComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 22)(1, "span", 23);
    core /* ɵɵtext */.EFF(2, "Model Name ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span", 24)(4, "mat-form-field")(5, "input", 25);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_div_3_Template_input_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.name, $event)) {
        ctx_r1.name = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("keyup", function LoadModelDialogComponent_div_3_Template_input_keyup_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clearSelected());
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(6, "span", 26);
    core /* ɵɵtext */.EFF(7, "Description ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "span", 27)(9, "mat-form-field")(10, "input", 28);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_div_3_Template_input_ngModelChange_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.description, $event)) {
        ctx_r1.description = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(11, "span", 29);
    core /* ɵɵtemplate */.DNE(12, LoadModelDialogComponent_div_3_button_12_Template, 2, 1, "button", 30);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.name ? ctx_r1.name : "");
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.name);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.description);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowActionButton());
  }
}
function LoadModelDialogComponent_mat_form_field_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field")(1, "input", 32);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_mat_form_field_8_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.searchInput, $event)) {
        ctx_r1.searchInput = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("keyup", function LoadModelDialogComponent_mat_form_field_8_Template_input_keyup_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.search());
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.searchInput);
  }
}
function LoadModelDialogComponent_mat_form_field_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field")(1, "input", 33);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_mat_form_field_9_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.searchInput, $event)) {
        ctx_r1.searchInput = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("keyup", function LoadModelDialogComponent_mat_form_field_9_Template_input_keyup_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.deepSearch());
    })("focusin", function LoadModelDialogComponent_mat_form_field_9_Template_input_focusin_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.deepSearch());
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.searchInput);
  }
}
function LoadModelDialogComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 34)(1, "span", 35);
    core /* ɵɵtext */.EFF(2, "Include All Subfolders");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "label", 36);
    core /* ɵɵlistener */.bIt("change", function LoadModelDialogComponent_div_10_Template_label_change_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.prepareDeepSearchData());
    });
    core /* ɵɵelementStart */.j41(4, "input", 37);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_div_10_Template_input_ngModelChange_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.deepSearchMode, $event)) {
        ctx_r1.deepSearchMode = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.deepSearchMode);
  }
}
function LoadModelDialogComponent_div_11_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 40);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_11_div_1_Template_div_click_0_listener() {
      const model_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openDeepSearchModel(model_r8));
    });
    core /* ɵɵelement */.nrm(1, "img", 41);
    core /* ɵɵelementStart */.j41(2, "div", 42);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const model_r8 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI(" ", model_r8.pathAndDir.path, " ");
  }
}
function LoadModelDialogComponent_div_11_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 40);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_11_div_2_Template_div_click_0_listener() {
      const folder_r10 = core /* ɵɵrestoreView */.eBV(_r9).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openDeepSearchFolder(folder_r10));
    });
    core /* ɵɵelement */.nrm(1, "img", 43);
    core /* ɵɵelementStart */.j41(2, "div", 42);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const folder_r10 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI(" ", folder_r10.pathAndDir.path, " ");
  }
}
function LoadModelDialogComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 38);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_11_div_1_Template, 4, 1, "div", 39)(2, LoadModelDialogComponent_div_11_div_2_Template, 4, 1, "div", 39);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.modelsPathsAndDirsRepresentation);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.foldPathsAndDirsRepresentation);
  }
}
function LoadModelDialogComponent_span_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 44)(1, "label", 45);
    core /* ɵɵlistener */.bIt("change", function LoadModelDialogComponent_span_12_Template_label_change_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showVersionsFolders());
    });
    core /* ɵɵelementStart */.j41(2, "input", 37);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_span_12_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.showVersions, $event)) {
        ctx_r1.showVersions = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(3, "span", 46);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, " Show Versions ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.showVersions);
  }
}
function LoadModelDialogComponent_span_13_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 50);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_span_13_a_1_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeViewMode(true));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 51);
    core /* ɵɵelement */.nrm(2, "path", 52)(3, "line", 53)(4, "line", 54)(5, "line", 55)(6, "line", 56);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_span_13_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 57);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_span_13_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeViewMode(false));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 51);
    core /* ɵɵelement */.nrm(2, "path", 52)(3, "path", 58)(4, "path", 59)(5, "path", 60)(6, "path", 61)(7, "path", 62)(8, "path", 63);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_span_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 47);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_span_13_a_1_Template, 7, 0, "a", 48)(2, LoadModelDialogComponent_span_13_a_2_Template, 9, 0, "a", 49);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.loadType && !ctx_r1.isExamplesView() && !ctx_r1.isTemplatesView());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.loadType && !ctx_r1.isExamplesView() && !ctx_r1.isTemplatesView());
  }
}
function LoadModelDialogComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 64)(1, "span", 65)(2, "label", 66);
    core /* ɵɵlistener */.bIt("change", function LoadModelDialogComponent_div_15_Template_label_change_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showArchiveModels());
    });
    core /* ɵɵelementStart */.j41(3, "input", 37);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LoadModelDialogComponent_div_15_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.showArchivedModels, $event)) {
        ctx_r1.showArchivedModels = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "span", 46);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(5, " Show Archived ");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.showArchivedModels);
  }
}
function LoadModelDialogComponent_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 67);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_button_17_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.goBack());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 68);
    core /* ɵɵelement */.nrm(2, "path", 69);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_22_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 79);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_22_div_9_Template_div_click_0_listener() {
      const model_r17 = core /* ɵɵrestoreView */.eBV(_r16).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectModel(model_r17, true));
    })("dblclick", function LoadModelDialogComponent_div_22_div_9_Template_div_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    });
    core /* ɵɵelementStart */.j41(1, "div", 80)(2, "span", 81);
    core /* ɵɵelement */.nrm(3, "img", 82);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 83)(5, "div", 84);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const model_r17 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("title", ctx_r1.getModelTooltip(model_r17));
    core /* ɵɵproperty */.Y8G("ngClass", model_r17 === ctx_r1.selectedModel ? "selected" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getModelIcon(model_r17), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.displayModelName(model_r17), " ");
  }
}
function LoadModelDialogComponent_div_22_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 85);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_22_button_11_Template_button_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      $event.stopPropagation();
      return core /* ɵɵresetView */.Njj(ctx_r1.changeRecentDisplayCount(1));
    });
    core /* ɵɵelementStart */.j41(1, "mat-icon");
    core /* ɵɵtext */.EFF(2, "add");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_22_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 86);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_22_button_14_Template_button_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      $event.stopPropagation();
      return core /* ɵɵresetView */.Njj(ctx_r1.changeRecentDisplayCount(-1));
    });
    core /* ɵɵelementStart */.j41(1, "mat-icon");
    core /* ɵɵtext */.EFF(2, "remove");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 70)(1, "span", 71)(2, "span");
    core /* ɵɵtext */.EFF(3, "Recent");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵelementStart */.j41(5, "span");
    core /* ɵɵtext */.EFF(6, "Models");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(7, "div", 72)(8, "div", 73);
    core /* ɵɵtemplate */.DNE(9, LoadModelDialogComponent_div_22_div_9_Template, 7, 4, "div", 74);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "div", 75);
    core /* ɵɵtemplate */.DNE(11, LoadModelDialogComponent_div_22_button_11_Template, 3, 0, "button", 76);
    core /* ɵɵelementStart */.j41(12, "span", 77);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(14, LoadModelDialogComponent_div_22_button_14_Template, 3, 0, "button", 78);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.ShownLastModels);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.getEffectiveDisplayedRecentCount() < 10);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getEffectiveDisplayedRecentCount());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.getEffectiveDisplayedRecentCount() > 5);
  }
}
function LoadModelDialogComponent_div_23_mat_grid_tile_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-grid-tile", 91);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_23_mat_grid_tile_8_Template_mat_grid_tile_click_0_listener() {
      const favorite_r21 = core /* ɵɵrestoreView */.eBV(_r20).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectModel(favorite_r21, true));
    })("dblclick", function LoadModelDialogComponent_div_23_mat_grid_tile_8_Template_mat_grid_tile_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.action(true));
    })("mouseenter", function LoadModelDialogComponent_div_23_mat_grid_tile_8_Template_mat_grid_tile_mouseenter_0_listener($event) {
      const favorite_r21 = core /* ɵɵrestoreView */.eBV(_r20).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, favorite_r21.image));
    })("mouseleave", function LoadModelDialogComponent_div_23_mat_grid_tile_8_Template_mat_grid_tile_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵelementStart */.j41(1, "div", 80)(2, "span", 81);
    core /* ɵɵelement */.nrm(3, "img", 82);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 83)(5, "div", 84);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const favorite_r21 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("title", ctx_r1.getModelTooltip(favorite_r21));
    core /* ɵɵproperty */.Y8G("ngClass", favorite_r21 === ctx_r1.selectedModel ? "selected" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getModelIcon(favorite_r21), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.displayModelName(favorite_r21), " ");
  }
}
function LoadModelDialogComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 87)(1, "span", 88)(2, "span");
    core /* ɵɵtext */.EFF(3, "Favorite");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵelementStart */.j41(5, "span");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(7, "mat-grid-list", 89);
    core /* ɵɵtemplate */.DNE(8, LoadModelDialogComponent_div_23_mat_grid_tile_8_Template, 7, 4, "mat-grid-tile", 90);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleMap */.Aen(ctx_r1.isExamplesView() || ctx_r1.isTemplatesView() ? "display: flex;" : "");
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.isExamplesView() ? "Examples" : "Templates");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleMap */.Aen(ctx_r1.isExamplesView() || ctx_r1.isTemplatesView() ? "height: calc(70px); width: calc(100% - 48px); margin-left: 5px;" : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.favorites);
  }
}
function LoadModelDialogComponent_div_24_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr", 99);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_24_tr_14_Template_tr_click_0_listener() {
      const model_r24 = core /* ɵɵrestoreView */.eBV(_r23).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectModel(model_r24));
    })("dblclick", function LoadModelDialogComponent_div_24_tr_14_Template_tr_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r23);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    });
    core /* ɵɵelementStart */.j41(1, "td");
    core /* ɵɵelement */.nrm(2, "img", 100);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td", 96)(4, "span", 101);
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "td", 96)(7, "span", 101);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(9, "td", 96);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "td", 96);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "td");
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const model_r24 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("ngClass", model_r24 === ctx_r1.selectedModel ? "selected" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getModelIcon(model_r24), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵpropertyInterpolate */.FS9("alt", model_r24.type);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngClass", model_r24 === ctx_r1.selectedModel ? "selected" : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getModelPath(model_r24.path));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngClass", model_r24 === ctx_r1.selectedModel ? "selected" : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(model_r24.title);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(model_r24.description);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(model_r24.editBy.date);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(model_r24.editBy.name);
  }
}
function LoadModelDialogComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 92)(1, "table", 93)(2, "tr", 94);
    core /* ɵɵelement */.nrm(3, "th");
    core /* ɵɵelementStart */.j41(4, "th", 95);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_24_Template_th_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("recent", "path"));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "th", 95);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_24_Template_th_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("recent", "model"));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "th", 96);
    core /* ɵɵtext */.EFF(9, "Description");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "th", 95);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_24_Template_th_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("recent", "date"));
    });
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "th", 97);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_24_Template_th_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("recent", "author"));
    });
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(14, LoadModelDialogComponent_div_24_tr_14_Template, 15, 10, "tr", 98);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("recent", "path"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Path ", ctx_r1.nextSortMark("recent", "path"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("recent", "model"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Model ", ctx_r1.nextSortMark("recent", "model"), "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("recent", "date"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Date ", ctx_r1.nextSortMark("recent", "date"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("recent", "author"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Author ", ctx_r1.nextSortMark("recent", "author"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.ShownLastModels);
  }
}
function LoadModelDialogComponent_div_25_div_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "No Folders");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-grid-tile", 108);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_click_0_listener() {
      const folder_r26 = core /* ɵɵrestoreView */.eBV(_r25).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectFolder(folder_r26));
    })("dblclick", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r25);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openFolder());
    });
    core /* ɵɵelementStart */.j41(1, "mat-grid-tile-footer", 109);
    core /* ɵɵlistener */.bIt("dragstart", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_footer_dragstart_1_listener($event) {
      const folder_r26 = core /* ɵɵrestoreView */.eBV(_r25).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragStart($event, folder_r26));
    })("dragover", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_footer_dragover_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r25);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.allowDrop($event));
    })("drop", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_footer_drop_1_listener($event) {
      const folder_r26 = core /* ɵɵrestoreView */.eBV(_r25).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onDropFolder($event, folder_r26));
    })("dragenter", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_footer_dragenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r25);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragEnter($event));
    })("dragleave", function LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template_mat_grid_tile_footer_dragleave_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r25);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragLeave($event));
    });
    core /* ɵɵelement */.nrm(2, "img", 110);
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵpipe */.nI1(5, "slice");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const folder_r26 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.getFolderTooltip(folder_r26))("matTooltipShowDelay", 1000)("ngClass", ctx_r1.getRegularViewFolderCssClass(folder_r26))("draggable", folder_r26.permissions == null ? null : folder_r26.permissions.owner);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getFolderIcon(folder_r26), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", folder_r26.name.length > 9 ? core /* ɵɵpipeBind3 */.brH(5, 6, folder_r26.name, 0, 9) + "..." : folder_r26.name, "");
  }
}
function LoadModelDialogComponent_div_25_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 105);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_25_div_1_span_1_Template, 2, 0, "span", 5);
    core /* ɵɵelementStart */.j41(2, "mat-grid-list", 106);
    core /* ɵɵtemplate */.DNE(3, LoadModelDialogComponent_div_25_div_1_mat_grid_tile_3_Template, 6, 10, "mat-grid-tile", 107);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownFolders.length === 0 && !ctx_r1.spinnerFlag);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("cols", ctx_r1.getFoldersNumberInRow());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.shownFolders);
  }
}
function LoadModelDialogComponent_div_25_div_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 114);
    core /* ɵɵtext */.EFF(1, "No Models");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_25_div_2_mat_grid_tile_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-grid-tile", 108);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_25_div_2_mat_grid_tile_3_Template_mat_grid_tile_click_0_listener() {
      const model_r28 = core /* ɵɵrestoreView */.eBV(_r27).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectModel(model_r28));
    })("dblclick", function LoadModelDialogComponent_div_25_div_2_mat_grid_tile_3_Template_mat_grid_tile_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r27);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    });
    core /* ɵɵelementStart */.j41(1, "div", 80)(2, "span", 81);
    core /* ɵɵelement */.nrm(3, "img", 82);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 83)(5, "div", 84);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const model_r28 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("title", ctx_r1.getModelTooltip(model_r28));
    core /* ɵɵproperty */.Y8G("ngClass", model_r28 === ctx_r1.selectedModel ? "selected" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getModelIcon(model_r28), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.displayModelName(model_r28), " ");
  }
}
function LoadModelDialogComponent_div_25_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 111);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_25_div_2_span_1_Template, 2, 0, "span", 112);
    core /* ɵɵelementStart */.j41(2, "mat-grid-list", 113);
    core /* ɵɵtemplate */.DNE(3, LoadModelDialogComponent_div_25_div_2_mat_grid_tile_3_Template, 7, 4, "mat-grid-tile", 107);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownModels.length === 0 && !ctx_r1.spinnerFlag);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.shownModels);
  }
}
function LoadModelDialogComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 102);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_25_div_1_Template, 4, 3, "div", 103)(2, LoadModelDialogComponent_div_25_div_2_Template, 4, 2, "div", 104);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.loadType);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.loadType);
  }
}
function LoadModelDialogComponent_div_26_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 125);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_1_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r30);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openFolderPermissions());
    });
    core /* ɵɵtext */.EFF(1, "Folder Permissions");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_26_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 126);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_2_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r31);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isSaveDisabled());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getActionName());
  }
}
function LoadModelDialogComponent_div_26_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 127);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_3_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r32);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.archive());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getArchiveActionName());
  }
}
function LoadModelDialogComponent_div_26_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_8_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r33);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.cutSelectedModel());
    });
    core /* ɵɵtext */.EFF(1, "Cut Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_26_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_9_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r34);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.pasteModel());
    });
    core /* ɵɵtext */.EFF(1, "Paste Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_26_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 123);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_10_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r35);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setFolderToCut(ctx_r1.selectedFolder));
    });
    core /* ɵɵtext */.EFF(1, "Cut Folder");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.selectedFolder);
  }
}
function LoadModelDialogComponent_div_26_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_button_11_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r36);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.pasteFolderFromCut());
    });
    core /* ɵɵtext */.EFF(1, "Paste Folder Here");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 115);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clearSelected());
    });
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_26_button_1_Template, 2, 0, "button", 116)(2, LoadModelDialogComponent_div_26_button_2_Template, 2, 2, "button", 117)(3, LoadModelDialogComponent_div_26_button_3_Template, 2, 1, "button", 118);
    core /* ɵɵelementStart */.j41(4, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_Template_button_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.newFolder());
    });
    core /* ɵɵtext */.EFF(5, "New Folder");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "button", 120);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_Template_button_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.rename());
    });
    core /* ɵɵtext */.EFF(7, "Rename");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(8, LoadModelDialogComponent_div_26_button_8_Template, 2, 0, "button", 121)(9, LoadModelDialogComponent_div_26_button_9_Template, 2, 0, "button", 121)(10, LoadModelDialogComponent_div_26_button_10_Template, 2, 1, "button", 122)(11, LoadModelDialogComponent_div_26_button_11_Template, 2, 0, "button", 121);
    core /* ɵɵelementStart */.j41(12, "button", 123);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_Template_button_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.goBack());
    });
    core /* ɵɵtext */.EFF(13, "Back");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "button", 124);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_26_Template_button_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.dialogRef.close());
    });
    core /* ɵɵtext */.EFF(15, "Cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowFolderPermission());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !!ctx_r1.getActionName());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !!ctx_r1.getArchiveActionName());
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isRenameDisabled());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canModelBeCut());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canPasteModel());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canCutFolder());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !!ctx_r1.cutFolder);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("disabled", ctx_r1.currentDialogPath.length === 0);
  }
}
function LoadModelDialogComponent_div_27_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 137);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_1_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r37);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.goHome());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 138);
    core /* ɵɵelement */.nrm(2, "path", 139)(3, "path", 140)(4, "path", 141)(5, "rect", 142)(6, "rect", 143)(7, "rect", 144)(8, "rect", 145);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 146);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r38);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.goBack());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 147);
    core /* ɵɵelement */.nrm(2, "rect", 148)(3, "path", 149)(4, "rect", 150)(5, "rect", 151)(6, "rect", 152);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 153);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r39);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.newFolder());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 154);
    core /* ɵɵelement */.nrm(2, "path", 139)(3, "path", 155);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 156);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_4_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r40);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.rename());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 157);
    core /* ɵɵelement */.nrm(2, "path", 158)(3, "path", 159)(4, "line", 160)(5, "line", 161)(6, "line", 162);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 163);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_5_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r41);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openFolderPermissions());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 138);
    core /* ɵɵelement */.nrm(2, "path", 139)(3, "path", 164);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 165);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_6_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r42);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.cutSelectedModel());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 166);
    core /* ɵɵelement */.nrm(2, "path", 167)(3, "path", 168)(4, "path", 169)(5, "path", 170)(6, "path", 171)(7, "path", 172);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 173);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_7_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r43);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.pasteModel());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 174);
    core /* ɵɵelement */.nrm(2, "path", 175)(3, "path", 176);
    core /* ɵɵelementStart */.j41(4, "mask", 177);
    core /* ɵɵelement */.nrm(5, "rect", 178);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(6, "rect", 179)(7, "rect", 180);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LoadModelDialogComponent_div_27_a_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 181);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_27_a_8_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r44);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeModel());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 182)(2, "g", 183);
    core /* ɵɵelement */.nrm(3, "path", 184)(4, "path", 185)(5, "path", 186)(6, "path", 187);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function LoadModelDialogComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 128);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_27_a_1_Template, 9, 0, "a", 129)(2, LoadModelDialogComponent_div_27_a_2_Template, 7, 0, "a", 130)(3, LoadModelDialogComponent_div_27_a_3_Template, 4, 0, "a", 131)(4, LoadModelDialogComponent_div_27_a_4_Template, 7, 0, "a", 132)(5, LoadModelDialogComponent_div_27_a_5_Template, 4, 0, "a", 133)(6, LoadModelDialogComponent_div_27_a_6_Template, 8, 0, "a", 134)(7, LoadModelDialogComponent_div_27_a_7_Template, 8, 0, "a", 135)(8, LoadModelDialogComponent_div_27_a_8_Template, 7, 0, "a", 136);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentDialogPath.length > 0 && !ctx_r1.isExamplesView() && !ctx_r1.isTemplatesView());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentDialogPath.length > 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCreateNewFolder());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRename());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowFolderPermission());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canModelBeCut());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canPasteModel());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canModelBeRemoved());
  }
}
function LoadModelDialogComponent_div_28_span_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 114);
    core /* ɵɵelement */.nrm(1, "br")(2, "br");
    core /* ɵɵtext */.EFF(3, "No Folders");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_28_span_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 194);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_span_4_Template_span_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r45);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("folders", "folder"));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("folders", "folder"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" Folders ", ctx_r1.nextSortMark("folders", "folder"), " ");
  }
}
function LoadModelDialogComponent_div_28_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 195);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_5_Template_div_click_0_listener() {
      const folder_r47 = core /* ɵɵrestoreView */.eBV(_r46).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectFolder(folder_r47));
    })("dblclick", function LoadModelDialogComponent_div_28_div_5_Template_div_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openFolder());
    })("dragstart", function LoadModelDialogComponent_div_28_div_5_Template_div_dragstart_0_listener($event) {
      const folder_r47 = core /* ɵɵrestoreView */.eBV(_r46).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragStart($event, folder_r47));
    })("dragover", function LoadModelDialogComponent_div_28_div_5_Template_div_dragover_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.allowDrop($event));
    })("drop", function LoadModelDialogComponent_div_28_div_5_Template_div_drop_0_listener($event) {
      const folder_r47 = core /* ɵɵrestoreView */.eBV(_r46).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onDropFolder($event, folder_r47));
    })("dragenter", function LoadModelDialogComponent_div_28_div_5_Template_div_dragenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragEnter($event));
    })("dragleave", function LoadModelDialogComponent_div_28_div_5_Template_div_dragleave_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragLeave($event));
    });
    core /* ɵɵelementStart */.j41(1, "div", 196);
    core /* ɵɵelement */.nrm(2, "img", 100);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span", 197);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const folder_r47 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("ngClass", ctx_r1.getFolderCssClass(folder_r47))("draggable", folder_r47.permissions == null ? null : folder_r47.permissions.owner);
    core /* ɵɵattribute */.BMQ("folderId", folder_r47.id);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getFolderIcon(folder_r47), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵpropertyInterpolate */.FS9("alt", folder_r47.type);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.getFolderTooltip(folder_r47))("matTooltipShowDelay", 1000);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(folder_r47.name);
  }
}
function LoadModelDialogComponent_div_28_div_6_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 114);
    core /* ɵɵelement */.nrm(1, "br")(2, "br");
    core /* ɵɵtext */.EFF(3, "No Models");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_28_div_6_div_2_div_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 209);
    core /* ɵɵtext */.EFF(1, "Archived?");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_28_div_6_div_2_div_12_div_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 218);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const model_r50 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("title", model_r50.archiveMode ? model_r50.archiveMode : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(model_r50.archiveMode && model_r50.archiveMode.archiveMode === true ? "Yes" : "No");
  }
}
function LoadModelDialogComponent_div_28_div_6_div_2_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 210);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_6_div_2_div_12_Template_div_click_0_listener() {
      const model_r50 = core /* ɵɵrestoreView */.eBV(_r49).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectModel(model_r50));
    })("dblclick", function LoadModelDialogComponent_div_28_div_6_div_2_div_12_Template_div_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r49);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    });
    core /* ɵɵelementStart */.j41(1, "div", 211);
    core /* ɵɵelement */.nrm(2, "img", 212);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 213)(4, "span");
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "div", 214);
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 215);
    core /* ɵɵtext */.EFF(9);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "div", 216);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(12, LoadModelDialogComponent_div_28_div_6_div_2_div_12_div_12_Template, 2, 2, "div", 217);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const model_r50 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵproperty */.Y8G("ngClass", model_r50 === ctx_r1.selectedModel ? "selectedLine line" : "line");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getModelIcon(model_r50), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵpropertyInterpolate */.FS9("alt", model_r50.type);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", model_r50.title);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(model_r50.title);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", model_r50.description);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(model_r50.description);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", model_r50.editBy.date + "\r*Times are shown in local time");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", model_r50.editBy.date, "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", model_r50.editBy.name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(model_r50.editBy.name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showArchivedModels);
  }
}
function LoadModelDialogComponent_div_28_div_6_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 200)(1, "div", 201);
    core /* ɵɵelement */.nrm(2, "div", 202);
    core /* ɵɵelementStart */.j41(3, "div", 203);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_6_div_2_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("models", "model"));
    })("resize", function LoadModelDialogComponent_div_28_div_6_div_2_Template_div_resize_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.resize("modelNameCol"));
    }, false, core /* ɵɵresolveWindow */.tSv);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 204);
    core /* ɵɵtext */.EFF(6, "Description");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 205);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_6_div_2_Template_div_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("models", "date"));
    });
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "div", 206);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_6_div_2_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("models", "author"));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(11, LoadModelDialogComponent_div_28_div_6_div_2_div_11_Template, 2, 0, "div", 207);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(12, LoadModelDialogComponent_div_28_div_6_div_2_div_12_Template, 13, 12, "div", 208);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("models", "model"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Model ", ctx_r1.nextSortMark("models", "model"), "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("models", "date"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Date ", ctx_r1.nextSortMark("models", "date"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("models", "author"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Author ", ctx_r1.nextSortMark("models", "author"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showArchivedModels);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.shownModels);
  }
}
function LoadModelDialogComponent_div_28_div_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 198);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_28_div_6_span_1_Template, 4, 0, "span", 112)(2, LoadModelDialogComponent_div_28_div_6_div_2_Template, 13, 11, "div", 199);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownModels.length === 0 && !ctx_r1.spinnerFlag);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownModels.length > 0);
  }
}
function LoadModelDialogComponent_div_28_div_7_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 114);
    core /* ɵɵelement */.nrm(1, "br")(2, "br");
    core /* ɵɵtext */.EFF(3, "No Models");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_28_div_7_div_2_div_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 209);
    core /* ɵɵtext */.EFF(1, "Archived?");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r52 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 222);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template_div_click_0_listener() {
      const model_r53 = core /* ɵɵrestoreView */.eBV(_r52).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectModel(model_r53));
    })("dblclick", function LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template_div_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r52);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    })("mouseenter", function LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template_div_mouseenter_0_listener($event) {
      const model_r53 = core /* ɵɵrestoreView */.eBV(_r52).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, model_r53.image));
    })("mouseleave", function LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template_div_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r52);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 223);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template_svg_click_1_listener($event) {
      const model_r53 = core /* ɵɵrestoreView */.eBV(_r52).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleFavorite($event, model_r53));
    });
    core /* ɵɵelement */.nrm(2, "path", 224);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(3, "div", 211);
    core /* ɵɵelement */.nrm(4, "img", 212);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 225)(6, "span");
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(8, "div", 226);
    core /* ɵɵtext */.EFF(9);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const model_r53 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵproperty */.Y8G("ngClass", model_r53 === ctx_r1.selectedModel ? "selectedLine line" : "line");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleMap */.Aen(ctx_r1.isFavorite(model_r53) ? "opacity: 1;" : "opacity: 0.3;");
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.getFavoriteStarTooltip(model_r53));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("src", ctx_r1.getModelIcon(model_r53), core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵpropertyInterpolate */.FS9("alt", model_r53.type);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", model_r53.title);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(model_r53.title);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", model_r53.description);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(model_r53.description);
  }
}
function LoadModelDialogComponent_div_28_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 200)(1, "div", 201);
    core /* ɵɵelement */.nrm(2, "div", 202);
    core /* ɵɵelementStart */.j41(3, "div", 219);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_28_div_7_div_2_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r51);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.sortByColumn("models", "model"));
    });
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 220);
    core /* ɵɵtext */.EFF(6, "Description");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(7, LoadModelDialogComponent_div_28_div_7_div_2_div_7_Template, 2, 0, "div", 207);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(8, LoadModelDialogComponent_div_28_div_7_div_2_div_8_Template, 10, 10, "div", 221);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate1 */.Mz_("title", "Click to sort ", ctx_r1.nextSortType("models", "model"), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Model ", ctx_r1.nextSortMark("models", "model"), "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showArchivedModels);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.shownModels);
  }
}
function LoadModelDialogComponent_div_28_div_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 198);
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_28_div_7_span_1_Template, 4, 0, "span", 112)(2, LoadModelDialogComponent_div_28_div_7_div_2_Template, 9, 5, "div", 199);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownModels.length === 0 && !ctx_r1.spinnerFlag);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownModels.length > 0);
  }
}
function LoadModelDialogComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 188)(1, "div", 189)(2, "div", 190);
    core /* ɵɵtemplate */.DNE(3, LoadModelDialogComponent_div_28_span_3_Template, 4, 0, "span", 112)(4, LoadModelDialogComponent_div_28_span_4_Template, 2, 3, "span", 191);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(5, LoadModelDialogComponent_div_28_div_5_Template, 5, 8, "div", 192);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(6, LoadModelDialogComponent_div_28_div_6_Template, 3, 2, "div", 193)(7, LoadModelDialogComponent_div_28_div_7_Template, 3, 2, "div", 193);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownFolders.length === 0 && !ctx_r1.spinnerFlag);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shownFolders.length !== 0 && !ctx_r1.spinnerFlag);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.shownFolders);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isExamplesView() && !ctx_r1.isTemplatesView());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isExamplesView() || ctx_r1.isTemplatesView());
  }
}
function LoadModelDialogComponent_div_29_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r55 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_1_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r55);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.saveModelAsSystemExample());
    });
    core /* ɵɵtext */.EFF(1, "Save as System Example");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_2_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r56);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.saveModelAsGlobalTemplate());
    });
    core /* ɵɵtext */.EFF(1, "Save as Global Template");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_3_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r57);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeSelectedFromRecentModels());
    });
    core /* ɵɵtext */.EFF(1, "Remove from Recent");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r58 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_4_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r58);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openCurrentFolderPermissions());
    });
    core /* ɵɵtext */.EFF(1, "Current Folder Permissions");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 230);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_5_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r59);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.action());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isSaveDisabled());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getActionName());
  }
}
function LoadModelDialogComponent_div_29_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r60 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 231);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_6_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r60);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.rename());
    });
    core /* ɵɵtext */.EFF(1, "Rename");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isRenameDisabled());
  }
}
function LoadModelDialogComponent_div_29_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_7_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r61);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.cutSelectedModel());
    });
    core /* ɵɵtext */.EFF(1, "Cut Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r62 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_8_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r62);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.pasteModel());
    });
    core /* ɵɵtext */.EFF(1, "Paste Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r63 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_9_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r63);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeFolder());
    });
    core /* ɵɵtext */.EFF(1, "Remove Folder");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r64 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 123);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_10_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r64);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setFolderToCut(ctx_r1.selectedFolder));
    });
    core /* ɵɵtext */.EFF(1, "Cut Folder");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.selectedFolder);
  }
}
function LoadModelDialogComponent_div_29_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r65 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_11_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r65);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.pasteFolderFromCut());
    });
    core /* ɵɵtext */.EFF(1, "Paste Folder Here");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LoadModelDialogComponent_div_29_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r66 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 232);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_button_14_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r66);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.archive());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getArchiveActionName());
  }
}
function LoadModelDialogComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r54 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 115);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r54);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clearSelected());
    });
    core /* ɵɵtemplate */.DNE(1, LoadModelDialogComponent_div_29_button_1_Template, 2, 0, "button", 121)(2, LoadModelDialogComponent_div_29_button_2_Template, 2, 0, "button", 121)(3, LoadModelDialogComponent_div_29_button_3_Template, 2, 0, "button", 121)(4, LoadModelDialogComponent_div_29_button_4_Template, 2, 0, "button", 121)(5, LoadModelDialogComponent_div_29_button_5_Template, 2, 2, "button", 227)(6, LoadModelDialogComponent_div_29_button_6_Template, 2, 1, "button", 228)(7, LoadModelDialogComponent_div_29_button_7_Template, 2, 0, "button", 121)(8, LoadModelDialogComponent_div_29_button_8_Template, 2, 0, "button", 121)(9, LoadModelDialogComponent_div_29_button_9_Template, 2, 0, "button", 121)(10, LoadModelDialogComponent_div_29_button_10_Template, 2, 1, "button", 122)(11, LoadModelDialogComponent_div_29_button_11_Template, 2, 0, "button", 121);
    core /* ɵɵelementStart */.j41(12, "button", 119);
    core /* ɵɵlistener */.bIt("click", function LoadModelDialogComponent_div_29_Template_button_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r54);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.dialogRef.close());
    });
    core /* ɵɵtext */.EFF(13, "Cancel");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(14, LoadModelDialogComponent_div_29_button_14_Template, 2, 1, "button", 229);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowSaveAsSystemExample());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowSaveAsGlobalTemplate());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldOfferRemoveFromRecent());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCurrentFolderPermissionsButton() && !ctx_r1.shouldOfferRemoveFromRecent());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowActionButton());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRename());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canModelBeCut());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canPasteModel());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canRemoveFolder());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canCutFolder());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !!ctx_r1.cutFolder);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", !!ctx_r1.getArchiveActionName() && !ctx_r1.isExamplesView() && !ctx_r1.isTemplatesView());
  }
}
var StorageMode = /*#__PURE__*/function (StorageMode) {
  StorageMode[StorageMode.LOAD = 0] = "LOAD";
  StorageMode[StorageMode.SAVE = 1] = "SAVE";
  return StorageMode;
}(StorageMode || {});
var ScreenType = /*#__PURE__*/function (ScreenType) {
  ScreenType[ScreenType.REGULAR = 1] = "REGULAR";
  ScreenType[ScreenType.EXAMPALES = 2] = "EXAMPALES";
  ScreenType[ScreenType.TEMPLATES = 3] = "TEMPLATES";
  return ScreenType;
}(ScreenType || {});
var ExamplesType = /*#__PURE__*/function (ExamplesType) {
  ExamplesType[ExamplesType.SYS = 1] = "SYS";
  ExamplesType[ExamplesType.ORG = 2] = "ORG";
  return ExamplesType;
}(ExamplesType || {});
var TemplateType = /*#__PURE__*/function (TemplateType) {
  TemplateType[TemplateType.SYS = 1] = "SYS";
  TemplateType[TemplateType.ORG = 2] = "ORG";
  TemplateType[TemplateType.PERSONAL = 3] = "PERSONAL";
  return TemplateType;
}(TemplateType || {});
let LoadModelDialogComponent = /*#__PURE__*/(() => {
  class LoadModelDialogComponent {
    constructor(dialogRef, init, storage, context, groupService, _dialog, comparisonService, userService, data) {
      this.dialogRef = dialogRef;
      this.init = init;
      this.storage = storage;
      this.context = context;
      this.groupService = groupService;
      this._dialog = _dialog;
      this.comparisonService = comparisonService;
      this.userService = userService;
      this.data = data;
      this.Mode = StorageMode;
      this.mode = StorageMode.SAVE;
      this.deepSearchMode = false;
      this.searchInput = "";
      this.favorites = [];
      this.spinnerFlag = true;
      this.shouldShowDeepSearchResults = false;
      this.models = [];
      this.folders = [];
      this.modelsForDeepSearch = [];
      this.foldersForDeepSearch = [];
      this.ShownLastModels = [];
      /** Newest first; up to 15 from server; {@link ShownLastModels} is the first N for display. */
      this.allRecentModels = [];
      this.shownModels = [];
      this.shownFolders = [];
      this.shownDeepModels = [];
      this.shownDeepFolders = [];
      this.loadType = false;
      this.defSortType = {
        recent: {
          path: "Up",
          model: "Up",
          date: "Down",
          author: "Up"
        },
        folders: {
          folder: "Up"
        },
        models: {
          folder: "Up",
          date: "Down",
          author: "Up"
        }
      };
      this.sortStatuses = {
        recent: {
          ...this.defSortType.recent
        },
        folders: {
          ...this.defSortType.folders
        },
        models: {
          ...this.defSortType.models
        }
      };
      this.name = "";
    }
    ngOnInit() {
      if (this.alternativeData) {
        this.data = this.alternativeData.data;
      }
      this.mode = this.data.mode;
      this.comparison = this.data.comparison ? this.data.comparison : false;
      this.screenTypeVal = this.data.screenType ? this.data.screenType : ScreenType.REGULAR;
      this.exampleType = this.data.exampleType;
      this.templateType = this.data.templateType;
      this.isImportMode = !!this.data.isImportMode;
      this.description = this.init.opmModel.description || this.data.description || "";
      this.name = this.init.modelService.displayName && this.init.modelService.displayName !== "Model (Not Saved)" ? this.init.modelService.displayName : "";
      this.name = this.clearName(this.name);
      this.archiveMode = this.data.archiveMode ? this.data.archiveMode : "false";
      this.showVersions = this.data.showVersions;
      this.showArchivedModels = this.data.showArchivedModels;
      this.currentDialogPath = [].concat(this.context.getPath() || [{
        id: "root",
        title: "Home"
      }]);
      this.init.setSelectedElementToNull();
      this.groupService.getGroupsByUserIDNew(this.userService.user.uid).then(res => this.currentUserGroups = res);
      if (localStorage.getItem("dirsPath")) {
        const dirsPath = JSON.parse(localStorage.getItem("dirsPath"));
        this.currentDialogPath = dirsPath.reverse().map(item => {
          return {
            id: item.id,
            title: item.title ? item.title : "Home"
          };
        });
        if ([ScreenType.EXAMPALES, ScreenType.TEMPLATES].includes(this.screenTypeVal)) {
          this.loadType = true;
        }
      }
      if (this.currentDialogPath?.find(d => d.id === "ORGEXAMPLES")) {
        this.currentDialogPath = [{
          id: "root",
          title: "Home"
        }];
      }
      if (this.init.oplService.settings.loadScreenSortDirections) {
        this.sortStatuses.models = this.init.oplService.settings.loadScreenSortDirections;
      }
      if (this.isExamplesView()) {
        this.changeViewMode(true, false);
        const exampleType = this.isSysExamples() ? "SYS" : "ORG";
        this.storage.getFavoriteExamples().then(models => {
          this.favorites = models.filter(m => m.exampleType === exampleType);
        }).catch(err => this.favorites = []);
        this.currentDialogPath = [].concat([{
          id: "root",
          title: "Home"
        }, {
          id: "ORGEXAMPLES",
          title: "Examples"
        }]);
        this.initAttributes();
      } else if (this.isTemplatesView()) {
        this.changeViewMode(true, false);
        const templateType = TemplateType[this.templateType];
        this.storage.getFavoriteTemplates().then(models => {
          this.favorites = models.filter(m => m.templateType === templateType);
        }).catch(err => this.favorites = []);
        if ([TemplateType.ORG, TemplateType.SYS].includes(this.templateType)) {
          this.currentDialogPath = [].concat([{
            id: "root",
            title: "Home"
          }, {
            id: "ORGTEMPLATES",
            title: "Templates"
          }]);
        } else {
          this.currentDialogPath = [].concat([{
            id: "root",
            title: "Home"
          }, {
            id: "PRIVATETEMPLATES",
            title: "Templates"
          }]);
        }
        this.initAttributes();
      } else {
        const viewType = this.init.oplService.settings.loadScreenViewType;
        if (viewType !== undefined) {
          this.loadType = viewType;
        }
        this.storage.getLastModels().then(models => {
          this.createLastModelList(models);
        }).catch(err => {});
      }
      this.recoverLastOpenedFolder();
      this.initAttributes();
      $("mat-mdc-dialog-container").on("click", event => {
        if (event.target.tagName !== "INPUT") {
          this.changeFocusFromDeepSearch(event);
        }
      });
      this.getModelBasicNameOnSave();
      const elStyle = $(".mat-mdc-dialog-container")[0].style;
      elStyle.overflow = "hidden";
      elStyle.position = "relative";
      elStyle.resize = "auto";
    }
    ngDoCheck() {
      if ($(".footerActions").length) {
        const listView = $("#combinedFolderModelDiv")[0];
        const regularView = $("#regularViewFoldersAndModels")[0];
        const footerTop = $(".footerActions")[0].getClientRects()[0].top;
        if (listView) {
          listView.style.height = footerTop - listView.getClientRects()[0].top + 7 + "px";
        } else if (regularView) {
          regularView.style.height = footerTop - regularView.getClientRects()[0].top + 7 + "px";
        }
      }
      this.checkSizeChanges();
    }
    keyEvent(event) {
      if (event.key === "x" && event.ctrlKey && this.selectedModel && !this.modelWasSelectedFromRecents && this.canModelBeCut()) {
        this.cutSelectedModel();
      } else if (this.cutModel && event.key === "v" && event.ctrlKey && this.canPasteModel()) {
        this.pasteModel();
      }
    }
    getCurrentDirectoryId() {
      return this.currentDialogPath[this.currentDialogPath.length - 1]?.id || "root";
    }
    initAttributes() {
      this.spinnerFlag = true;
      this.searchInput = "";
      const id = this.getCurrentDirectoryId();
      this.storage.getFolderPermissions(id).then(per => this.currentFolderPermissions = per);
      if (id.endsWith("_ver")) {
        this.storage.getVersions(id.replace("_ver", "")).then(models => {
          this.createModelVersionList(models);
          this.folders = [];
          this.search();
          this.spinnerFlag = false;
        });
      } else {
        Promise.all([this.storage.getModels(id, this.showArchivedModels, this.isSysExamples(), this.isGlobalTemplates()).catch(err => []), this.storage.getFolders(id, this.isSysExamples(), this.isGlobalTemplates()).catch(err => undefined)]).then(res => {
          // if lost permissions to the last folder => open the root folder
          if (!res[1]) {
            this.currentDialogPath = [{
              id: "root",
              title: "Home"
            }];
            return this.initAttributes();
          }
          this.createModelList(res[0]);
          this.createDirectoriesList(res[0], res[1]);
          this.search();
          this.spinnerFlag = false;
          if (this.init.oplService.settings.loadScreenSortBy) {
            this.sortByColumn("models", this.init.oplService.settings.loadScreenSortBy, false);
          }
        });
      }
    }
    isSysExamples() {
      return this.exampleType === ExamplesType.SYS;
    }
    isOrgExample() {
      return this.exampleType === ExamplesType.ORG;
    }
    isGlobalTemplates() {
      return this.templateType === TemplateType.SYS;
    }
    isOrgTemplate() {
      return this.templateType === TemplateType.ORG;
    }
    isPersonalTemplate() {
      return this.templateType === TemplateType.PERSONAL;
    }
    createModelVersionList(models) {
      const versions = new Array();
      for (const model of models.versions) {
        if (typeof model.date === "number") {
          model.date = formatDate(new Date(model.date));
        }
        versions.push({
          id: models.id,
          title: model.date,
          description: models.description,
          archiveMode: {
            archiveMode: false,
            date: model.date,
            name: ""
          },
          type: DisplayModelType.VERSION,
          permissions: DisplayModelPermissionType.READ,
          editBy: {
            date: model.date,
            name: ""
          },
          path: model.ver_index
        });
      }
      this.models = versions;
    }
    convertMonthToNumber(str) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(str) + 1;
    }
    createDirectoriesList(models, directories) {
      const versions = new Array();
      for (const model of models) {
        if (model.editBy?.date?.toString().includes("Coordinated Universal Time")) {
          const str = model.editBy.date;
          const day = str.substr(8, 2);
          const month = this.convertMonthToNumber(str.substr(4, 3));
          const year = str.substr(11, 4);
          const hour = str.substr(16, 8);
          model.editBy.date = day + "-" + month + "-" + year + " " + hour;
        }
        versions.push({
          id: model.id + "_ver",
          name: model.title + " Versions",
          type: DisplayFolderType.VERSION
        });
      }
      this.folders = directories.filter(dir => dir.id !== "ORGEXAMPLES").concat(versions);
      this.folders = this.folders.sort((a, b) => {
        if (a.id === "shared") {
          return -1;
        }
        if (b.id === "shared") {
          return 1;
        }
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    isAdmin() {
      return this.userService.isSysAdmin() || this.userService.isOrgAdmin();
    }
    createModelList(received) {
      const models = new Array();
      for (const model of received) {
        if (typeof model.editBy.date === "number") {
          model.editBy.date = formatDate(new Date(model.editBy.date));
        }
        if (model.lastAutosaveData?.date && typeof model.lastAutosaveData.date === "number") {
          model.lastAutosaveData.date = formatDate(new Date(model.lastAutosaveData.date));
        }
        model.type = DisplayModelType.MAIN;
        models.push(model);
        const copy = Object.assign({}, model);
        copy.type = DisplayModelType.AUTOSAVE;
        if (copy.lastAutosaveData) {
          copy.editBy = copy.lastAutosaveData;
        }
        models.push(copy);
      }
      this.models = models;
    }
    createLastModelList(received) {
      const models = new Array();
      for (const model of received) {
        model.type = DisplayModelType.MAIN;
        if (typeof model.editBy?.date === "number") {
          model.editBy.date = new Date(model.editBy.date).toLocaleString().replace(".", "-").replace(".", "-");
        }
        models.push(model);
      }
      this.allRecentModels = models;
      this.refreshRecentModelsView();
    }
    refreshRecentModelsView() {
      const n = this.getEffectiveDisplayedRecentCount();
      const take = Math.min(n, this.allRecentModels.length);
      this.ShownLastModels = this.allRecentModels.slice(0, take);
    }
    getEffectiveDisplayedRecentCount() {
      const v = this.init.oplService.settings.displayedRecentModelsCount;
      const raw = v === undefined || v === null ? 5 : Number(v);
      if (Number.isNaN(raw)) {
        return 5;
      }
      return Math.min(10, Math.max(5, Math.round(raw)));
    }
    changeRecentDisplayCount(delta) {
      const cur = this.getEffectiveDisplayedRecentCount();
      const next = Math.min(10, Math.max(5, cur + delta));
      if (next === cur) {
        return;
      }
      const settings = {
        displayedRecentModelsCount: next
      };
      this.init.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => this.refreshRecentModelsView());
    }
    shouldOfferRemoveFromRecent() {
      return this.loadType && !this.isExamplesView() && !this.isTemplatesView() && this.modelWasSelectedFromRecents && !!this.selectedModel;
    }
    removeSelectedFromRecentModels() {
      const model = this.selectedModel;
      if (!model?.id || !this.modelWasSelectedFromRecents) {
        return;
      }
      const msg = "Are you sure you want to remove the model from the recent models panel? Removing the model will remove it from the list, but do not delete it. To add it back to the recent models, open the model again.";
      const confirmDialog = this._dialog.open(ConfirmDialogDialogComponent, {
        height: "280px",
        width: "440px",
        data: {
          message: msg,
          closeFlag: false,
          centerText: true
        }
      });
      confirmDialog.afterClosed().subscribe(confirmed => {
        if (!confirmed) {
          return;
        }
        this.storage.removeFromLastModels(model.id).then(() => {
          return this.storage.getLastModels();
        }).then(models => {
          this.createLastModelList(models);
          if (this.selectedModel && this.selectedModel.id === model.id) {
            this.clearSelected();
          }
        }).catch(() => {
          (0, validationAlert)("Could not update recent models.", 3000, "Error");
        });
      });
    }
    getDate(dateString) {
      const month_names_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let day;
      let month;
      let year;
      if (dateString.length === 8) {
        day = dateString.substr(0, 1);
        month = String(month_names_short.indexOf(dateString.substr(1, 3)) + 1);
        if (month.length === 1) {
          month = "0" + month;
        }
        year = dateString.substr(4, 4);
      } else {
        day = dateString.substr(0, 2);
        month = String(month_names_short.indexOf(dateString.substr(2, 3)) + 1);
        if (month.length === 1) {
          month = "0" + month;
        }
        year = dateString.substr(5, 4);
      }
      const date = new Date(year + "-" + month + "-" + day);
      return date.getTime();
    }
    isSooner(String1, String2) {
      const dateString1 = String1.split("_", 2)[0];
      const timeString1 = String1.split("_", 2)[1];
      const dateString2 = String2.split("_", 2)[0];
      const timeString2 = String2.split("_", 2)[1];
      const date1 = this.getDate(dateString1);
      const date2 = this.getDate(dateString2);
      if (date1 === date2) {
        return timeString1 < timeString2;
      }
      return date1 < date2;
    }
    clearSelected() {
      this.selectedModel = undefined;
      this.selectedFolder = undefined;
    }
    getModelTooltip(model) {
      const archiveMode = model.archiveMode && model.archiveMode.archiveMode === true ? "Yes" : model.archiveMode && model.archiveMode.archiveMode === false ? "No" : "Unknown";
      return `Model: ${model.title}
     Description: ${model.description || "No description"}
     Model archived: ${archiveMode}
     Date: ${model.editBy.date || "No date"}
     Author: ${model.editBy.name || "Unknown"}
     *Times are shown in local time`;
    }
    showVersionsFolders() {
      this.search();
    }
    // Load archived models from the server
    showArchiveModels() {
      this.initAttributes();
    }
    // setLoadType() {
    //   this.loadType = this.loadType === 'TILES' ? 'LIST' : 'TILES';
    // }
    search() {
      const term = this.searchInput.toLowerCase();
      this.shownModels = this.models.filter(model => model.title.toLowerCase().includes(term));
      this.shownFolders = this.folders.filter(folder => folder.name.toLowerCase().includes(term));
      if (this.showVersions === false) {
        this.shownModels = this.shownModels.filter(model => model.type !== DisplayModelType.AUTOSAVE);
        this.shownFolders = this.shownFolders.filter(folder => folder.type !== DisplayFolderType.VERSION);
      }
      this.clearSelected();
    }
    getModelIcon(model) {
      if (this.isExamplesView()) {
        return "assets/SVG/example.svg";
      }
      if (this.isTemplatesView()) {
        return "assets/SVG/template.svg";
      }
      if (model.type === DisplayModelType.AUTOSAVE) {
        return "assets/SVG/autosave.svg";
      }
      if (model.permissions === DisplayModelPermissionType.WRITE) {
        return "assets/SVG/regFile.svg";
      }
      return "assets/SVG/lock.svg";
    }
    getModelPath(path) {
      if (path.startsWith("/")) {
        path = path.substr(1);
      }
      return "HOME/" + path;
    }
    // displayModelDate(model: DisplayModel): string {
    //   return model.editBy.user;
    //   if (model.type === DisplayModelType.AUTOSAVE) {
    //     return    'assets/SVG/autosave.svg';
    //   }
    //
    //   if (model.permissions === DisplayModelPermissionType.WRITE) {
    //     return 'assets/SVG/regFile.svg';
    //   }
    //   return 'assets/SVG/lock.svg';
    // }
    getFolderIcon(folder) {
      if (folder.id === "shared") {
        return "assets/SVG/sharedFolder.svg";
      }
      if (folder.type === DisplayFolderType.VERSION) {
        return "assets/SVG/verFile.svg";
      }
      return "assets/SVG/folder.svg";
    }
    showVersionsChange() {
      this.search();
    }
    openDeepSearchModel(model) {
      this.clearSelected();
      this.selectedModel = model.model;
      this.name = model.model.title;
      this.action();
    }
    openDeepSearchFolder(folder) {
      this.clearSelected();
      this.selectedFolder = folder.folder;
      this.currentDialogPath = folder.pathAndDir.currentDialogPath;
      this.setCurrentFolderToStorage();
      this.initAttributes();
    }
    selectModel(model, modelWasSelectedFromRecents = false) {
      this.clearSelected();
      this.selectedModel = model;
      this.storage.getPermissions(model.id).then(per => this.selectedModelPermissions = per).catch(err => {});
      this.modelWasSelectedFromRecents = modelWasSelectedFromRecents;
      this.name = model.title;
      this.description = model.description || this.description;
      this.archiveMode = model.archiveMode.archiveMode;
    }
    selectFolder(folder) {
      this.clearSelected();
      this.selectedFolder = folder;
    }
    openFolder() {
      const folder = this.selectedFolder;
      if (!folder) {
        return;
      }
      this.currentDialogPath.push({
        id: folder.id,
        title: folder.name
      });
      this.setCurrentFolderToStorage();
      this.initAttributes();
    }
    goBack() {
      if (this.currentDialogPath.length == 1) {
        return;
      }
      if (this.currentDialogPath.length == 2 && (this.isExamplesView() || this.isTemplatesView())) {
        return;
      }
      this.currentDialogPath.pop();
      this.setCurrentFolderToStorage();
      this.initAttributes();
    }
    goRoutingPath() {
      return this.currentDialogPath.map(a => a.title).join("/").replace("Home/Examples", "Examples").replace("Home/Templates", "Templates");
    }
    load(asFavorite = false) {
      this.dialogRef.close();
      const that = this;
      if (this.comparison) {
        this.loadForComparison();
      } else {
        if (this.context.isModelAlreadyOpenOnTab(this.selectedModel.id)) {
          (0, validationAlert)(`The model is already open in other tab.`, 2500, "Error");
          return;
        }
        this.init.isLoadingModel = true;
        /**
         * Here we make sure that when new model is loaded, we clean the copy dictionaries.
         */
        this.init.linkCopiedStyleParams = null;
        this.init.copiedStyleParams = null;
        if (this.selectedModel.type === DisplayModelType.VERSION) {
          // In this case path is the ver index
          this.context.loadVersion(this.selectedModel.id, this.selectedModel.path, this.currentDialogPath);
        } else {
          const mode = this.selectedModel.type === DisplayModelType.MAIN ? "MAIN" : "AUTO";
          localStorage.removeItem("lastPathEntered");
          this.context.loadModel(this.selectedModel.id, this.currentDialogPath, mode, undefined, this.isSysExamples(), this.isOrgExample(), this.isGlobalTemplates(), this.isOrgTemplate()).then(res => {
            this.init.isLoadingModel = false;
            that.init.elementToolbarReference.setIsExample(that.context.isExample());
            that.init.elementToolbarReference.setIsTemplate(that.context.isTemplate());
            that.init.elementToolbarReference.setIsStereotype(that.context.isStereotype());
            (0, validationAlert)(`Successfully loaded model [${this.name}].`, 2500, "warning");
          }).catch(err => {
            this.init.isLoadingModel = false;
            if (asFavorite && err.status === 500) {
              // if model doesn't exist anymore remove from user's favorites.
              this.storage.unsetFavoriteExample(this.selectedModel);
              (0, validationAlert)(`Model doesn't exist anymore.`, 2500, "Error");
            } else {
              (0, validationAlert)(`Failed to load model [${this.name}].`, 2500, "Error");
            }
          });
        }
      }
    }
    importTemplate() {
      if (!this.selectedModel) {
        return;
      }
      this.spinnerFlag = true;
      const selectedId = this.selectedModel.id;
      this.context.getTemplateForImport(this.selectedModel.id, this.isGlobalTemplates()).then(res => {
        this.dialogRef.close({
          importedTemplate: res
        });
      }).catch(err => {
        const favorite = this.favorites.find(f => f.id === selectedId);
        if (err.status === 500 && favorite) {
          const idx = this.favorites.indexOf(favorite);
          this.favorites.splice(idx, 1);
          this.storage.unsetFavoriteTemplate(favorite);
        }
        this.dialogRef.close();
      });
    }
    isSaveDisabled() {
      return this.mode === StorageMode.SAVE && this.name.length === 0 || this.shouldShowSaveAsSystemExample() || this.mode === StorageMode.SAVE && this.isCurrentlySaving;
    }
    save(asSystemExample = false, asGlobalTemplate = false) {
      const name = this.name.trim();
      const that = this;
      if (ModelTitleValidator.create().validateTitle(name) === false) {
        this.openBadlyFormatDialog();
        return;
      }
      const desc = this.description.trim();
      if (desc.length === 0 && this.isExamplesView()) {
        (0, validationAlert)("Description field is required.", 3500, "Warning");
        return;
      }
      const model = this.models.find(m => m.title === name);
      if (model && this.context.isUserSysAdmin() && (this.context.isExample() || this.context.isTemplate())) {
        model.permissions = DisplayModelPermissionType.WRITE;
      }
      if (model && model.permissions === DisplayModelPermissionType.READ) {
        this._dialog.open(ConfirmDialogDialogComponent, {
          height: "225px",
          width: "320px",
          data: {
            message: "Warning: You do not have permission to overwrite existing model. \n\n To save it as a copy, you can change the file name.",
            closeFlag: true
          }
        });
        return;
      }
      if (model && model.permissions === DisplayModelPermissionType.WRITE) {
        const selected = this.selectedModel || model;
        if (selected.fatherModelId && selected.id !== this.context.getCurrentModelId()) {
          (0, validationAlert)("Overriding a sub model is possible only by its versions.", 5000, "Error");
          return;
        }
        const confirmDialog = this._dialog.open(ConfirmDialogDialogComponent, {
          height: "200px",
          width: "320px",
          data: {
            message: "Warning: This model will be overwritten.\nAre you sure?",
            closeFlag: false,
            centerText: true
          }
        });
        confirmDialog.afterClosed().subscribe(data => {
          if (data) {
            const temp = selected.description || "";
            if (that.description && that.description !== selected.description) {
              selected.description = that.description;
            }
            (0, validationAlert)("Saving...", 2000, "warning");
            this.isCurrentlySaving = true;
            this.doOverrideModel(selected, asSystemExample, asGlobalTemplate);
            selected.description = temp;
          }
        });
        return;
      }
      (0, validationAlert)("Saving...", 2000, "warning");
      this.isCurrentlySaving = true;
      this.doCreateModel(asSystemExample, asGlobalTemplate);
    }
    saveModelAsSystemExample() {
      this.save(true, false);
    }
    saveModelAsGlobalTemplate() {
      this.save(false, true);
    }
    setWithOrgExamplePermission(modelId) {
      var _this = this;
      return (0, default)(function* () {
        if (_this.isExamplesView() && _this.exampleType === ExamplesType.ORG) {
          const per = yield _this.storage.getPermissions(modelId);
          per.readIDs = ["ORGEXAMPLE"];
          _this.storage.updatePermissions(modelId, per);
        }
      })();
    }
    setWithOrgTemplatePermission(modelId) {
      var _this2 = this;
      return (0, default)(function* () {
        if (_this2.isTemplatesView() && _this2.templateType === TemplateType.ORG) {
          const per = yield _this2.storage.getPermissions(modelId);
          per.readIDs = ["ORGTEMPLATES"];
          _this2.storage.updatePermissions(modelId, per);
        }
      })();
    }
    doOverrideModel(model, asSystemExample = false, asGlobalTemplate = false) {
      var _this3 = this;
      return (0, default)(function* () {
        const image = yield _this3.getModelImage();
        _this3.context.saveModel({
          model_id: model.id,
          title: _this3.name,
          path: _this3.currentDialogPath,
          description: _this3.description,
          image: image,
          archiveMode: _this3.archiveMode,
          sysExample: asSystemExample,
          globalTemplate: asGlobalTemplate
        }, "override").then(() => {
          _this3.setWithOrgExamplePermission(model.id);
          _this3.isCurrentlySaving = false;
          _this3.dialogRef.close();
          (0, validationAlert)(`Successfully saved model [${_this3.name}].`, 2500, "Success");
        }).catch(err => {
          _this3.isCurrentlySaving = false;
          (0, validationAlert)(`Cannot save model to this folder. It seems you do not have a permissions.`, 5000, "Error");
        });
      })();
    }
    getModelImage() {
      var _this4 = this;
      return (0, default)(function* () {
        if (!_this4.isTemplatesView()) {
          return undefined;
        }
        return _this4.init.getModelImage();
      })();
    }
    doCreateModel(asSystemExample = false, asGlobalTemplate = false) {
      var _this5 = this;
      return (0, default)(function* () {
        const this_ = _this5;
        const image = yield _this5.getModelImage();
        _this5.context.saveModel({
          directory_id: _this5.currentDialogPath[_this5.currentDialogPath.length - 1].id,
          title: _this5.name,
          description: _this5.description,
          image: image,
          archiveMode: _this5.archiveMode,
          path: _this5.currentDialogPath,
          sysExample: asSystemExample,
          globalTemplate: asGlobalTemplate
        }, "create").then(() => {
          _this5.setWithOrgExamplePermission(this_.context.getCurrentModelId());
          _this5.setWithOrgTemplatePermission(this_.context.getCurrentModelId());
          // this.context.updateTabData(this.context.getCurrentTabItem());
          this_.context.updateUserLastTabsToDB();
          _this5.isCurrentlySaving = false;
          _this5.dialogRef.close();
          (0, validationAlert)(`Successfully saved model [${_this5.name}].`, 2500, "Success");
        }).catch(err => {
          _this5.isCurrentlySaving = false;
          console.error("[LoadModelDialog] Save error:", err);
          console.error("[LoadModelDialog] Error details:", {
            message: err?.message,
            status: err?.status,
            error: err?.error,
            fullError: err
          });
          (0, validationAlert)(`Cannot save model to this folder. It seems you do not have a permissions.`, 5000, "Error");
        });
      })();
    }
    nextSortType(group = "recent", column = "path") {
      const status = this.sortStatuses[group][column];
      if (status === "Up") {
        return "Down";
      } else if (status === "Down") {
        return "Up";
      } else {
        return this.defSortType[group][column];
      }
    }
    nextSortMark(group = "recent", column = "path") {
      if (this.pickList(group).length > 1) {
        if (this.nextSortType(group, column) === "Down") {
          return "↓";
        } else {
          return "↑";
        }
      } else {
        return "";
      }
    }
    setSortType(group = "recent", column = "path", sort = "Down") {
      this.sortStatuses[group] = {
        ...this.defSortType[group]
      };
      this.sortStatuses[group][column] = sort;
    }
    pickList(group = "recent") {
      return {
        recent: this.allRecentModels,
        folders: this.shownFolders,
        models: this.shownModels
      }[group];
    }
    convertDate(dateStr) {
      if (dateStr.length > 0) {
        const year = dateStr.substr(6, 4);
        const month = dateStr.substr(3, 2) - 1;
        const date = dateStr.substr(0, 2);
        const hours = dateStr.substr(10).split(":").map(i => Number(i));
        return new Date(Number(year), Number(month), Number(date), hours[0], hours[1], hours[2]);
      }
      return new Date(1990, 2, 1, 0, 0, 0);
    }
    // convertDate(dateStr) {
    //   if (dateStr && !!dateStr.match("[a-zA-Z]")) {
    //     const monthConvert = {
    //       'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    //       'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    //     };
    //     let day = dateStr.substr(0, dateStr.match("[a-zA-Z]").index);
    //     day = day.length === 1 ? '0' + day : day;
    //     const month = dateStr.substr(dateStr.match("[a-zA-Z]").index, 3);
    //     const monthAsNumber = monthConvert[month];
    //     const year = dateStr.substr(dateStr.match("[a-zA-Z]").index + 3, 4);
    //     const hours = dateStr.substr(dateStr.match("[a-zA-Z]").index + 8);
    //     return year + '-' + monthAsNumber + '-' + day + ' ' + hours;
    //   }
    //
    //   if (dateStr)
    //     return dateStr;
    //   return 'NO DATE';
    //
    // }
    pickComparator(group, column) {
      const byDate = a => this.convertDate(a.editBy.date);
      const byAuthor = a => a.editBy.name ? a.editBy.name.toLowerCase() : "";
      const byModel = a => a.title ? a.title.toLowerCase() : "";
      const byPath = a => this.getModelPath(a.path).toLowerCase();
      const byFolder = a => a.name ? a.name.toLowerCase() : "";
      return {
        recent: {
          path: byPath,
          model: byModel,
          date: byDate,
          author: byAuthor
        },
        folders: {
          folder: byFolder
        },
        models: {
          model: byModel,
          date: byDate,
          author: byAuthor
        }
      }[group][column];
    }
    sortByColumn(group = "recent", column = "path", updateDB = true) {
      this.sortByColumn_(this.pickList(group), group, column, this.pickComparator(group, column), updateDB ? undefined : this.sortStatuses[group][column]);
      if (group === "recent") {
        this.refreshRecentModelsView();
      }
      if (group === "models") {
        const loadScreenData = {
          loadScreenSortBy: column,
          loadScreenSortDirections: this.sortStatuses.models
        };
        if (updateDB) {
          this.init.updateDB(loadScreenData);
          this.init.oplService.updateUserSettings(loadScreenData);
        }
      }
    }
    sortByColumn_(list, group = "recent", column = "path", f, sortCategoryDirection = undefined) {
      const sortCategory = sortCategoryDirection || this.nextSortType(group, column);
      let l = 1;
      let u = -1;
      if (sortCategory === "Up") {
        l = -1;
        u = 1;
      }
      list.sort((a, b) => f(a) < f(b) ? l : u);
      this.setSortType(group, column, sortCategory);
    }
    isActionButtonDisabled() {
      if (this.selectedModel === undefined && this.selectedFolder === undefined) {
        return true;
      }
      if (this.selectedFolder) {
        return false;
      }
      if (this.mode === StorageMode.SAVE) {
        if (this.selectedModel && this.selectedModel.permissions == DisplayModelPermissionType.WRITE) {
          return true;
        }
        if (this.name.length == 0) {
          return true;
        }
      }
      return false;
    }
    getActionName() {
      if (this.selectedFolder) {
        return "Open";
      }
      if (this.mode === this.Mode.SAVE) {
        return "Save";
      }
      if (this.selectedModel && this.mode === this.Mode.LOAD) {
        return "Load";
      }
    }
    action(asFavorite = false) {
      if (this.selectedFolder) {
        this.openFolder();
      } else if (this.mode === this.Mode.LOAD) {
        if (this.isImportMode) {
          this.importTemplate();
        } else {
          this.load(asFavorite);
        }
      } else if (this.mode === this.Mode.SAVE) {
        this.save(this.isSysExamples(), this.isGlobalTemplates());
      }
    }
    // Change the label of the action button based on the archive mode of the selected model
    getArchiveActionName() {
      if (this.selectedModel) {
        if (this.archiveMode === false) {
          return "Archive";
        } else {
          return "Restore";
        }
      }
    }
    // Archive the selected model
    archive() {
      // Precondition: Check user permission - The user need to be the owner and have write permissions
      // After the request was performed by the server a refresh need to be done - using the existing method - initAttributes()
      const model = this.selectedModel;
      if (model && model.permissions === DisplayModelPermissionType.READ) {
        this._dialog.open(ConfirmDialogDialogComponent, {
          height: "150px",
          width: "320px",
          data: {
            message: "Warning: You do not have permission to archive the selected model",
            closeFlag: true
          }
        });
        return;
      }
      if (model && model.permissions === DisplayModelPermissionType.WRITE) {
        // Checking only write permission
        // TODO: need to add a validation that the user archiving is the owner of the selected model
        // Archive/unArchive selected model based on the value of the model ArchiveMode property
        if (model.archiveMode.archiveMode === false) {
          // archive model
          this.context.archiveModel(this.selectedModel.id, true).then(res => this.initAttributes());
        } else if (model.archiveMode.archiveMode === true) {
          // unarchive model
          this.context.archiveModel(this.selectedModel.id, false).then(res => this.initAttributes());
        }
      }
    }
    nameStyle(name) {
      let firstSpace = name.indexOf(" ");
      if (firstSpace === -1) {
        firstSpace = name.length;
      }
      if (name.substring(0, firstSpace) > 12) {
        return name.slice(0, 12) + "...";
      } else {
        return name.substring(0, 12) + name.slice(firstSpace, firstSpace + 6) + "...";
      }
    }
    newFolder() {
      var _this6 = this;
      const dialogRef = this._dialog.open(InputNameDialogComponent, {
        height: "200px",
        width: "280px",
        data: {
          message: "",
          inputName: "Folder Name"
        }
      });
      const sub = dialogRef.afterClosed().subscribe(/*#__PURE__*/function () {
        var _ref = (0, default)(function* (data) {
          if (data) {
            const name = data.NameInput.trim();
            if (ModelTitleValidator.create().validateTitle(name) == false) {
              _this6.openBadlyFormatDialog();
            } else if (_this6.shownFolders.find(f => f.name.trim().toLowerCase() === name.toLowerCase())) {
              (0, validationAlert)("This name is already been used. Please choose a different name.", 5000, "Error");
            } else {
              const current = _this6.getCurrentDirectoryId();
              const res = yield _this6.storage.createFolder(current, name, _this6.isSysExamples(), _this6.isOrgExample(), _this6.isGlobalTemplates(), _this6.isOrgTemplate());
              if (res.ret.success) {
                _this6.storage.getFolders(current, _this6.isSysExamples(), _this6.isGlobalTemplates()).then(folders => {
                  _this6.folders = folders;
                  _this6.shownFolders = folders;
                });
              } else {
                (0, validationAlert)(res.ret.message, 5000, "error");
              }
            }
            sub.unsubscribe();
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    displayModelName(model) {
      if (model.title.length > 9) {
        return model.title.slice(0, 9) + "...";
      } else {
        return model.title;
      }
    }
    loadForComparison() {
      this.comparisonService.start(this.selectedModel.id).then(() => (0, validationAlert)(`Successfully loaded model [${this.selectedModel?.title || ""}] at [${this.selectedModel.path}] for comparison.`, 2500, "Success"));
    }
    getFoldersNumberInRow() {
      if ($(".mat-mdc-dialog-container").length > 0 && $(".mat-mdc-dialog-container")[0].getClientRects().length > 0) {
        return Math.round(($(".mat-mdc-dialog-container")[0].getClientRects()[0].width - 100) / 200);
      } else {
        return 4;
      }
    }
    changeViewMode(value, changedByUser = true) {
      this.loadType = value;
      if (changedByUser) {
        this.init.updateDB({
          loadScreenViewType: this.loadType
        });
        this.init.oplService.updateUserSettings({
          loadScreenViewType: this.loadType
        });
      }
    }
    rename() {
      if (!this.selectedModel && !this.selectedFolder) {
        return;
      }
      const ref = this._dialog.open(RenameDialogComponent, {
        data: {
          model: this.selectedModel,
          folder: this.selectedFolder,
          sysExamples: this.isSysExamples(),
          globalTemplates: this.isGlobalTemplates(),
          usedNames: this.shownFolders.map(f => f.name)
        }
      });
      const sub = ref.afterClosed().subscribe(data => {
        if (data && data.renamed) {
          this.initAttributes();
        }
        sub.unsubscribe();
      });
    }
    isRenameDisabled() {
      if (this.selectedFolder?.name?.endsWith("Versions")) {
        return true;
      }
      if (this.selectedModel && this.selectedModel?.permissions !== DisplayModelPermissionType.WRITE) {
        return true;
      }
      if (this.selectedFolder && !this.selectedFolder?.permissions?.owner) {
        return true;
      }
      if (this.selectedModel && this.selectedModel.fatherModelId) {
        return true;
      }
      return false;
    }
    openBadlyFormatDialog() {
      this._dialog.open(ConfirmDialogDialogComponent, {
        data: {
          message: "Filename is badly formatted. Cannot contain the following characters: ^  / : * ? \" < > | . $ [ ] #",
          closeFlag: true
        }
      });
    }
    removeModel() {
      const ref = this._dialog.open(DeleteModelDialogComponent, {
        data: {
          model: this.selectedModel,
          folder: this.selectedFolder,
          sysExamples: this.isSysExamples(),
          globalTemplates: this.isGlobalTemplates()
        }
      });
      const sub = ref.afterClosed().subscribe(data => {
        if (data && data.removed) {
          this.initAttributes();
        }
        sub.unsubscribe();
      });
    }
    canModelBeRemoved() {
      if (this.mode === this.Mode.LOAD && this.isTemplatesView()) {
        return false;
      }
      if (!this.userService.isSysAdmin() && !this.userService.isOrgAdmin()) {
        return false;
      }
      if (this.selectedModel?.type === "version" || this.selectedModel?.type === "autosave") {
        return false;
      }
      return this.selectedModel != undefined && this.hasPermissionToDeleteSelectedModel();
    }
    canModelBeCut() {
      if (this.getCurrentDirectoryId().endsWith("_ver")) {
        return false;
      }
      if (!this.selectedModel) {
        return false;
      } else if (this.selectedModel && this.modelWasSelectedFromRecents) {
        return false;
      } else if (this.mode === this.Mode.LOAD && (this.isExamplesView() || this.isTemplatesView())) {
        return false;
      } else if (this.selectedModel.type !== DisplayModelType.MAIN) {
        return false;
      }
      return this.selectedModel.permissions === "write" || this.selectedModelPermissions?.ownerID === this.userService.user.uid || this.context.isUserSysAdmin() || this.context.isUserOrgAdmin();
    }
    cutSelectedModel() {
      this.cutModel = this.selectedModel;
    }
    canPasteModel() {
      const currentFolderId = this.getCurrentDirectoryId();
      if (currentFolderId.endsWith("_ver")) {
        return false;
      }
      const isAdmin = this.context.isUserSysAdmin() || this.context.isUserOrgAdmin();
      let isOwnerOfTargetFolder = false;
      let hasWritePermissionToTargetFolder = false;
      const uid = this.userService.user.uid;
      if (this.currentFolderPermissions) {
        isOwnerOfTargetFolder = this.currentFolderPermissions.ownerIds.includes(uid) || this.currentFolderPermissions.ownerIds.includes("all") || this.currentFolderPermissions.groupsOwnersIds?.some(g => this.currentUserGroups?.includes(g));
        hasWritePermissionToTargetFolder = this.currentFolderPermissions.writeIds.includes(uid) || this.currentFolderPermissions.writeIds.includes("all") || this.currentFolderPermissions.groupsWriteIds?.some(g => this.currentUserGroups?.includes(g));
      }
      const isModelOwner = this.selectedModelPermissions?.ownerID === this.userService.user.uid;
      return !!this.cutModel && (isAdmin || isOwnerOfTargetFolder || hasWritePermissionToTargetFolder || isModelOwner);
    }
    pasteModel() {
      const confirmDialog = this.init.dialogService.openDialog(ConfirmDialogDialogComponent, 200, 350, {
        allowMultipleDialogs: true,
        message: "Warning:\n Are you sure you want to move this model?",
        closeFlag: false
      });
      confirmDialog.afterClosed().toPromise().then(data => {
        if (!data) {
          return;
        }
        this.spinnerFlag = true;
        this.storage.moveModel(this.cutModel.id, this.getCurrentDirectoryId(), this.isSysExamples(), this.isGlobalTemplates()).then(res => {
          if (res.success) {
            this.initAttributes();
            (0, validationAlert)("The model was pasted successfully.", 5000, "Success");
          } else {
            (0, validationAlert)(res.message, 5000, "Error");
            this.spinnerFlag = false;
          }
          this.cutModel = undefined;
        }).catch(err => {
          this.spinnerFlag = false;
        });
      });
    }
    hasPermissionToDeleteSelectedModel() {
      return true;
    }
    clearName(name) {
      if (name) {
        return name.replace(" (read only)", "").replace("<<OPM Example Model>> ", "").replace("<<Template>> ", "");
      }
      return "";
    }
    setCurrentFolderToStorage() {
      if (this.currentDialogPath && !this.isExamplesView() && !this.isTemplatesView()) {
        localStorage.setItem("lastPathEntered", JSON.stringify(this.currentDialogPath));
      }
    }
    recoverLastOpenedFolder() {
      const path = localStorage.getItem("lastPathEntered");
      if (path && !this.isExamplesView() && !this.isTemplatesView()) {
        const pathAsArray = JSON.parse(path);
        if (pathAsArray?.length > 1) {
          this.currentDialogPath = pathAsArray;
        }
      }
    }
    prepareDeepSearchData() {
      var _this7 = this;
      return (0, default)(function* () {
        if (!_this7.deepSearchMode) {
          _this7.foldPathsAndDirsRepresentation = [];
          _this7.modelsPathsAndDirsRepresentation = [];
          _this7.search();
        } else if (_this7.deepSearchMode && !_this7.foldersMap) {
          yield _this7.getFoldersAndModelsArrays();
          yield _this7.createFoldersMap(_this7.foldersForDeepSearch);
          _this7.deepSearch();
        } else {
          _this7.deepSearch();
        }
      })();
    }
    getFoldersAndModelsArrays() {
      var _this8 = this;
      return (0, default)(function* () {
        const that = _this8;
        _this8.spinnerFlag = true;
        yield Promise.all([_this8.storage.getAllFolders(_this8.isGlobalTemplates()), _this8.storage.getAllModelsUserCanLoad(_this8.isGlobalTemplates())]).then(res => {
          that.foldersForDeepSearch = res[0].map(item => new DeepSearchFolder(item.father, item.id, item.title));
          that.modelsForDeepSearch = res[1].map(item => new DeepSearchModel(item.archiveMode, item.description, item.directory_id, item.editBy, item.id, item.permissions, item.title));
          _this8.spinnerFlag = false;
        }).catch(err => {});
      })();
    }
    createFoldersMap(folders) {
      const foldersMap = new Map();
      folders.forEach(elm => {
        foldersMap.set(elm.id, {
          title: elm.title,
          father: elm.father
        });
      });
      this.foldersMap = foldersMap;
    }
    getLeafFather(leaf) {
      return leaf.directory_id || leaf.father;
    }
    findPath(leaf) {
      let path = "";
      let pathArr = [];
      const arr = [];
      let dupIdInPath;
      if (leaf.id === "root") {
        arr.push({
          id: leaf.id,
          title: "Home"
        });
        path = "Home";
        return {
          path: path,
          currentDialogPath: arr
        };
      }
      arr.push({
        id: leaf.id,
        title: leaf.title
      });
      let fatherId = this.getLeafFather(leaf);
      while (fatherId && fatherId !== "root") {
        const titleAndFather = this.foldersMap.get(fatherId);
        if (!titleAndFather) {
          return null;
        }
        let title = titleAndFather.title;
        const father = titleAndFather.father;
        dupIdInPath = arr.find(elm => elm.id === fatherId);
        if (dupIdInPath) {
          return null;
        }
        if (fatherId === "ORGTEMPLATES" || fatherId === "PRIVATETEMPLATES") {
          title = "Templates";
        }
        arr.push({
          id: fatherId,
          title: title
        });
        fatherId = father;
      }
      arr.push({
        id: fatherId,
        title: "Home"
      });
      arr.reverse();
      pathArr = arr.map(obj => obj.title);
      path = pathArr.join("/");
      path = path.replace("Home/Templates", "Templates");
      return {
        path: path,
        currentDialogPath: arr
      };
    }
    deepSearch() {
      const that = this;
      if (this.searchInput.length < 3) {
        this.shouldShowDeepSearchResults = false;
        return;
      }
      this.shouldShowDeepSearchResults = true;
      const term = this.searchInput.toLowerCase();
      this.shownDeepFolders = this.foldersForDeepSearch.filter(folder => folder.title?.toLowerCase().includes(term));
      this.shownDeepModels = this.modelsForDeepSearch.filter(model => model.title?.toLowerCase().includes(term));
      this.modelsPathsAndDirsRepresentation = this.shownDeepModels.map(model => {
        return {
          model: model,
          pathAndDir: that.findPath(model)
        };
      }).filter(mod => !!mod.pathAndDir);
      this.foldPathsAndDirsRepresentation = this.shownDeepFolders.map(folder => {
        return {
          folder: folder,
          pathAndDir: that.findPath(folder)
        };
      }).filter(fold => !!fold.pathAndDir);
    }
    changeFocusFromDeepSearch($event) {
      const that = this;
      setTimeout(function () {
        that.shouldShowDeepSearchResults = false;
      }, 200);
    }
    isExamplesView() {
      return this.screenTypeVal === ScreenType.EXAMPALES;
    }
    isTemplatesView() {
      return this.screenTypeVal === ScreenType.TEMPLATES;
    }
    getHeaderTitle() {
      const mode = this.mode === StorageMode.SAVE ? "Save" : "Load";
      if (this.screenTypeVal === ScreenType.TEMPLATES) {
        return " ";
      }
      let type = " Model";
      if (this.screenTypeVal === ScreenType.EXAMPALES) {
        type = " Example";
      }
      return mode + type;
    }
    prepareString(name) {
      if (name.length > 9) {
        return name.slice(0, 9) + "...";
      } else {
        return name;
      }
    }
    toggleFavorite($event, model) {
      $event.stopPropagation();
      const favorite = this.favorites.find(f => f.id === model.id);
      if (favorite) {
        const idx = this.favorites.indexOf(favorite);
        this.favorites.splice(idx, 1);
        if (this.isExamplesView()) {
          this.storage.unsetFavoriteExample(model);
        } else {
          this.storage.unsetFavoriteTemplate(model);
        }
      } else {
        this.favorites.push(model);
        if (this.isExamplesView()) {
          const exType = this.isSysExamples() ? "SYS" : "ORG";
          this.storage.setFavoriteExample(model, exType);
        } else if (this.isTemplatesView()) {
          const tType = TemplateType[this.templateType];
          this.storage.setFavoriteTemplate(model, tType);
        }
      }
    }
    isFavorite(model) {
      return !!this.favorites.find(f => f.id === model.id);
    }
    shouldShowCreateNewFolder() {
      if (this.mode === this.Mode.LOAD && (this.isExamplesView() || this.isTemplatesView())) {
        return false;
      }
      if (this.currentDialogPath[this.currentDialogPath.length - 1]?.id?.endsWith("_ver")) {
        return false;
      }
      if ((this.isExamplesView() || this.isTemplatesView()) && (this.userService.isSysAdmin() || this.userService.isOrgAdmin())) {
        return true;
      }
      if (!this.isExamplesView() && !this.isTemplatesView()) {
        return true;
      }
      if (this.mode === this.Mode.SAVE && this.isTemplatesView() && this.templateType === TemplateType.PERSONAL) {
        return true;
      }
      return false;
    }
    shouldShowSaveAsSystemExample() {
      if (this.mode === this.Mode.SAVE && this.screenTypeVal === ScreenType.EXAMPALES && this.isSysExamples() && this.userService.isSysAdmin()) {
        return true;
      }
      return false;
    }
    shouldShowSaveAsGlobalTemplate() {
      if (this.mode === this.Mode.SAVE && this.screenTypeVal === ScreenType.TEMPLATES && this.isGlobalTemplates() && this.userService.isSysAdmin()) {
        return true;
      }
      return false;
    }
    shouldShowActionButton() {
      return this.mode !== this.Mode.SAVE || this.exampleType !== ExamplesType.SYS && this.templateType !== TemplateType.SYS;
    }
    shouldShowRename() {
      if (this.selectedModel && this.selectedModel.fatherModelId) {
        return false;
      }
      return (this.selectedModel || this.selectedFolder) && (this.mode !== this.Mode.LOAD || !this.isExamplesView() && !this.isTemplatesView()) && !this.isRenameDisabled();
    }
    getFavoriteStarTooltip(model) {
      if (this.favorites.find(f => f.id === model.id)) {
        return "Remove from Favorites";
      }
      return "Add to Favorites";
    }
    removeFolder() {
      if (!this.selectedFolder || !this.canRemoveFolder()) {
        return;
      }
      const that = this;
      const ref = this._dialog.open(ConfirmDialogDialogComponent, {
        height: "180px",
        width: "320px",
        data: {
          message: "Are you sure you want to delete the folder " + this.selectedFolder.name + "?"
        }
      });
      const fid = this.selectedFolder.id;
      const sub = ref.afterClosed().subscribe(data => {
        if (data === "OK") {
          this.storage.removeFolder(fid, that.isExamplesView() && that.exampleType === ExamplesType.SYS, that.isTemplatesView() && that.templateType === TemplateType.SYS).then(res => {
            if (res.removed) {
              that.initAttributes();
              that.selectedFolder = undefined;
            } else {
              if (res.message.includes("models in it")) {
                res.message += " Also, check for possible archived models.";
              }
              (0, validationAlert)(res.message, 3500);
            }
          });
        }
        sub.unsubscribe();
      });
    }
    getModelBasicNameOnSave() {
      const this_ = this;
      let visualElements = this.init.getOpmModel().getOpd("SD").visualElements;
      visualElements = visualElements.filter(elm => OPCloudUtils.isInstanceOfVisualProcess(elm));
      if (visualElements.length === 1) {
        if (this.init.opmModel.name.indexOf("Not Saved") !== -1) {
          this.name = visualElements[0].logicalElement.text;
          return;
        }
      }
      const isThereSystematicProcess = visualElements.find(elm => {
        return elm.logicalElement.affiliation === 0;
      });
      if (isThereSystematicProcess) {
        visualElements = visualElements.filter(proc => this_.isSystematic(proc));
        if (visualElements.length === 1) {
          if (this.init.opmModel.name.indexOf("Not Saved") !== -1) {
            this.name = visualElements[0].logicalElement.text;
            return;
          }
        }
      }
      const isThereRefinable = visualElements.find(elm => elm.isInzoomed() || elm.isUnfolded());
      if (isThereRefinable) {
        visualElements = visualElements.filter(elm => elm.isInzoomed() || elm.isUnfolded());
        if (visualElements.length === 1) {
          if (this.init.opmModel.name.indexOf("Not Saved") !== -1) {
            this.name = visualElements[0].logicalElement.text;
            return;
          }
        }
      }
      if (visualElements.length > 0) {
        const visualsWithLinksNumber = visualElements.map(elm => this_.getProceduralLinksNumber(elm));
        visualsWithLinksNumber.sort((a, b) => a.length - b.length);
        visualsWithLinksNumber.reverse();
        if (this.init.opmModel.name.indexOf("Not Saved") !== -1) {
          this.name = visualsWithLinksNumber[0].process.logicalElement.text;
          return;
        }
      }
      return;
    }
    isSystematic(elem) {
      return !elem.getAffiliation();
    }
    getProceduralLinksNumber(process) {
      const links = process.getLinks();
      const inGoing = links.inGoing.filter(link => link instanceof OpmProceduralLink);
      const outGoing = links.outGoing.filter(link => link instanceof OpmProceduralLink);
      const length = inGoing.concat(outGoing).length;
      return {
        process,
        length
      };
    }
    canRemoveFolder() {
      return (this.mode === this.Mode.LOAD && (this.isExamplesView() || this.isTemplatesView())) === false && this.selectedFolder;
    }
    shouldShowFolderPermission() {
      if (!this.selectedFolder || this.isImportMode) {
        return false;
      }
      if (this.selectedFolder && this.selectedFolder.id.endsWith("_ver")) {
        return false;
      }
      if (this.isTemplatesView() && this.isGlobalTemplates()) {
        return false;
      }
      if (this.isTemplatesView() && (this.isPersonalTemplate() || this.isOrgTemplate())) {
        return true;
      }
      return this.isExamplesView() === false;
    }
    openFolderPermissions(folder) {
      const folderPermissionDialog = this.init.dialogService.openDialog(FolderPermissionsDialogComponent, 700, 900, {
        folderID: folder?.id || this.selectedFolder.id,
        folderName: folder?.title || this.selectedFolder.name,
        allowMultipleDialogs: true,
        templates: this.isTemplatesView(),
        examples: this.isExamplesView()
      });
    }
    getFolderTooltip(folder) {
      const name = folder.name;
      const arr = [];
      if (folder.permissions?.read) {
        arr.push("R");
      }
      if (folder.permissions?.write) {
        arr.push("W");
      }
      if (folder.permissions?.owner) {
        arr.push("O");
      }
      if (arr.length > 0) {
        return name + " [" + arr.join("/") + "]";
      }
      return name;
    }
    goHome() {
      this.currentDialogPath = [{
        id: "root",
        title: "Home"
      }];
      this.initAttributes();
    }
    resize(col) {
      for (const item of $("." + col)) {
        item.style.width = $(".modelsTableHeaderTitles." + col)[0].style.width;
      }
    }
    checkSizeChanges() {
      if ($(".modelNameCol")[0]?.style?.width?.includes("px")) {
        this.resize("modelNameCol");
      }
      if ($(".modelDescCol")[0]?.style?.width?.includes("px")) {
        this.resize("modelDescCol");
      }
      if ($(".modelDateCol")[0]?.style?.width?.includes("px")) {
        this.resize("modelDateCol");
      }
      if ($(".modelDateCol")[0]?.style?.width?.includes("px")) {
        this.resize("modelDateCol");
      }
      if ($(".modelAuthorCol")[0]?.style?.width?.includes("px")) {
        this.resize("modelAuthorCol");
      }
      if ($("#foldersHeader")[0]?.style?.width?.includes("px") && $("#leftSideFolders")[0]) {
        $("#leftSideFolders")[0].style.width = $("#foldersHeader")[0]?.style?.width;
      }
    }
    onDropFolder($event, targetFolder) {
      const sourceFolder = JSON.parse($event.dataTransfer.getData("sourceFolder"));
      const targetElement = $($event.target).parents("#foldersRow")[0] || $event.target;
      $(targetElement).removeClass("folderHover");
      this.pasteFolder(sourceFolder, targetFolder);
    }
    allowDrop(event) {
      event.preventDefault();
    }
    dragStart(event, folder) {
      event.dataTransfer.setData("sourceFolder", JSON.stringify(folder));
    }
    dragEnter($event) {
      $event.preventDefault();
      const target = $($event.target).parents("#foldersRow")[0] || $event.target;
      $(target).addClass("folderHover");
    }
    dragLeave($event) {
      $event.preventDefault();
      const target = $($event.target).parents("#foldersRow")[0] || $event.target;
      $(target).removeClass("folderHover");
    }
    setFolderToCut(folder) {
      this.cutFolder = folder;
    }
    canCutFolder() {
      return !this.selectedFolder || this.selectedFolder?.permissions?.owner;
    }
    pasteFolderFromCut() {
      if (this.folders.find(f => f.id === this.cutFolder.id)) {
        (0, validationAlert)("Cannot paste at the same folder.", 5000, "Error");
        this.cutFolder = undefined;
        return;
      }
      const dummyTarget = {
        id: this.getCurrentDirectoryId(),
        permissions: {
          read: true,
          write: true,
          owner: true
        },
        // if illegal the server will block it
        name: "",
        type: DisplayFolderType.ORDINARY
      };
      this.pasteFolder(this.cutFolder, dummyTarget);
    }
    pasteFolder(sourceFolder, targetFolder) {
      if (sourceFolder.id === targetFolder.id) {
        (0, validationAlert)("Folder cannot be moved into its inner folders.", 5000, "Error");
        return;
      }
      if (sourceFolder.id === "shared") {
        (0, validationAlert)("Shared Folder Cannot be moved.", 5000, "Error");
        return;
      }
      if (!targetFolder.permissions.write) {
        (0, validationAlert)("It seems you don't have a write permission to the destination folder.", 5000, "Error");
        return;
      }
      const confirmDialog = this.init.dialogService.openDialog(ConfirmDialogDialogComponent, 200, 350, {
        allowMultipleDialogs: true,
        message: "Warning:\n Moving a folder includes all the models, sub folders, archived and versions.\n Are you sure?",
        closeFlag: false
      });
      confirmDialog.afterClosed().subscribe(data => {
        if (!data) {
          return;
        }
        this.spinnerFlag = true;
        this.storage.moveFolder(sourceFolder.id, targetFolder.id, this.isSysExamples(), this.isGlobalTemplates()).then(res => {
          if (res.success) {
            this.initAttributes();
          } else {
            (0, validationAlert)(res.message, 5000, "Error");
            this.spinnerFlag = false;
          }
          this.setFolderToCut(undefined);
        }).catch(err => {
          this.spinnerFlag = false;
        });
      });
    }
    getFolderCssClass(folder) {
      let ret = "";
      if (folder === this.selectedFolder) {
        ret = "selected selectedFolder";
      }
      if (folder.id === this.cutFolder?.id) {
        ret += " cutFolder";
      }
      return ret.trim();
    }
    getRegularViewFolderCssClass(folder) {
      let ret = "";
      if (folder === this.selectedFolder) {
        ret = "selected";
      }
      if (folder.id === this.cutFolder?.id) {
        ret += " cutFolder";
      }
      return ret.trim();
    }
    showGIF($event, handlerGif = "") {
      if (!handlerGif) {
        return;
      }
      return OPCloudUtils.showGIF($event, handlerGif, false, true, 1000);
    }
    mouseLeave() {
      OPCloudUtils.removeAllExplainationsDivs();
    }
    shouldShowCurrentFolderPermissionsButton() {
      if (!this.currentDialogPath) {
        return false;
      }
      const current = this.currentDialogPath[this.currentDialogPath.length - 1];
      if (this.currentDialogPath.find(p => p && ["Templates", "Examples"].includes(p.title))) {
        return false;
      }
      if (!current || ["Home", "Shared"].includes(current.title)) {
        return false;
      }
      return true;
    }
    openCurrentFolderPermissions() {
      const current = this.currentDialogPath[this.currentDialogPath.length - 1];
      this.openFolderPermissions(current);
    }
    static #_ = (() => this.ɵfac = function LoadModelDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LoadModelDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OpmModelComparisonService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: LoadModelDialogComponent,
      selectors: [["app-load-model-dialog"]],
      hostBindings: function LoadModelDialogComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵlistener */.bIt("keyup", function LoadModelDialogComponent_keyup_HostBindingHandler($event) {
            return ctx.keyEvent($event);
          }, false, core /* ɵɵresolveWindow */.tSv);
        }
      },
      inputs: {
        alternativeData: "alternativeData"
      },
      decls: 30,
      vars: 20,
      consts: [["id", "header", "xmlns", "http://www.w3.org/1999/html"], ["style", "position: relative; ", 4, "ngIf"], ["id", "searchAndVersionsDiv"], [1, "searchText"], [1, "searchField"], [4, "ngIf"], ["id", "deepSearchSwitch", 4, "ngIf"], ["id", "modelsAndFoldersPaths", 4, "ngIf"], ["id", "showVersionsSwitch", 4, "ngIf"], ["id", "loadTypeSwitch", 4, "ngIf"], ["id", "archiveDiv", 4, "ngIf"], [1, "path"], ["id", "backInPathBTN", 3, "click", 4, "ngIf"], ["id", "pathDisplay"], [2, "position", "fixed", "left", "calc(50% - 58px)", 3, "hidden"], ["class", "lastModelDiv", 4, "ngIf"], ["id", "lastModelDiv", 3, "style", 4, "ngIf"], ["class", "lastModelDivL", 4, "ngIf"], ["id", "regularViewFoldersAndModels", 4, "ngIf"], ["class", "footerActions", 3, "click", 4, "ngIf"], ["class", "controllingIcons", 4, "ngIf"], ["id", "combinedFolderModelDiv", 4, "ngIf"], [2, "position", "relative"], ["id", "newModelText"], ["id", "newModelInput"], ["type", "text", "id", "Model", "matInput", "", 3, "ngModelChange", "keyup", "ngModel", "value"], ["id", "newModelDescriptionText"], ["id", "newModelDescriptionInput"], ["type", "text", "id", "Description", "matInput", "", 3, "ngModelChange", "ngModel"], ["id", "newModelSaveButton"], ["id", "newModelSaveButtonStyle", "mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["id", "newModelSaveButtonStyle", "mat-button", "", 3, "click", "disabled"], ["type", "text", "id", "searchInput", "matInput", "", 3, "ngModelChange", "keyup", "ngModel"], ["type", "text", "matInput", "", 3, "ngModelChange", "keyup", "focusin", "ngModel"], ["id", "deepSearchSwitch"], ["id", "DeepText"], [3, "change"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], ["id", "modelsAndFoldersPaths"], ["class", "pathAndIconDeepSearch", 3, "click", 4, "ngFor", "ngForOf"], [1, "pathAndIconDeepSearch", 3, "click"], ["src", "assets/SVG/regFile.svg", 1, "deepSearchResultIcon"], [1, "deepSearchPathText"], ["src", "assets/SVG/folder.svg", 1, "deepSearchResultIcon"], ["id", "showVersionsSwitch"], ["matTooltip", "Show Version Folders", 1, "switch", 3, "change"], [1, "slider", "round"], ["id", "loadTypeSwitch"], ["title", "List mode", 3, "click", 4, "ngIf"], ["title", "Icons mode", 3, "click", 4, "ngIf"], ["title", "List mode", 3, "click"], ["width", "27", "height", "34", "viewBox", "0 0 27 34", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M26.5583 9.60407C26.5625 9.53879 26.5625 9.47337 26.5583 9.40809C26.5583 9.40809 26.5583 9.37831 26.5583 9.3655C26.5434 9.28898 26.5192 9.21461 26.4865 9.14396C26.4865 9.1227 26.4865 9.10989 26.4653 9.09285C26.4442 9.07582 26.4061 8.98212 26.3723 8.93101L26.3257 8.87561C26.2794 8.81112 26.227 8.75121 26.1693 8.69674L18.1097 1.3655C18.0548 1.31916 17.9968 1.27647 17.9363 1.23771L17.8687 1.20789C17.8239 1.18174 17.7772 1.15896 17.7291 1.13973L17.6869 1.11417L17.5304 1.06731H17.4839C17.4135 1.06122 17.3428 1.06122 17.2725 1.06731H1.37745C1.04607 1.06722 0.727812 1.19776 0.490744 1.43102C0.253676 1.66426 0.116619 1.98171 0.108887 2.31545V31.5253C0.108887 31.8642 0.242538 32.1892 0.480439 32.4289C0.718341 32.6685 1.041 32.8032 1.37745 32.8032H25.3109C25.6473 32.8032 25.97 32.6685 26.2079 32.4289C26.4458 32.1892 26.5795 31.8642 26.5795 31.5253V9.63814C26.5795 9.63814 26.5583 9.61681 26.5583 9.60407ZM18.5242 5.16955L22.0338 8.36869H18.5242V5.16955ZM2.64601 30.2558V3.5934H16.0039V9.63814C16.0039 9.97707 16.1376 10.3021 16.3754 10.5418C16.6134 10.7815 16.9361 10.9161 17.2725 10.9161H24.0381V30.2558H2.64601Z", "fill", "#5A6F8F"], ["x1", "7", "y1", "13.5", "x2", "20", "y2", "13.5", "stroke", "#5A6F8F"], ["x1", "7", "y1", "21.5", "x2", "20", "y2", "21.5", "stroke", "#5A6F8F"], ["x1", "7", "y1", "25.5", "x2", "15", "y2", "25.5", "stroke", "#5A6F8F"], ["x1", "7", "y1", "17.5", "x2", "15", "y2", "17.5", "stroke", "#5A6F8F"], ["title", "Icons mode", 3, "click"], ["d", "M5 15C5 14.4477 5.44772 14 6 14H11C11.5523 14 12 14.4477 12 15V16C12 16.5523 11.5523 17 11 17H6C5.44772 17 5 16.5523 5 16V15Z", "fill", "#5A6F8F"], ["d", "M14 15C14 14.4477 14.4477 14 15 14H20C20.5523 14 21 14.4477 21 15V16C21 16.5523 20.5523 17 20 17H15C14.4477 17 14 16.5523 14 16V15Z", "fill", "#5A6F8F"], ["d", "M5 20C5 19.4477 5.44772 19 6 19H11C11.5523 19 12 19.4477 12 20V21C12 21.5523 11.5523 22 11 22H6C5.44772 22 5 21.5523 5 21V20Z", "fill", "#5A6F8F"], ["d", "M14 20C14 19.4477 14.4477 19 15 19H20C20.5523 19 21 19.4477 21 20V21C21 21.5523 20.5523 22 20 22H15C14.4477 22 14 21.5523 14 21V20Z", "fill", "#5A6F8F"], ["d", "M5 25C5 24.4477 5.44772 24 6 24H11C11.5523 24 12 24.4477 12 25V26C12 26.5523 11.5523 27 11 27H6C5.44772 27 5 26.5523 5 26V25Z", "fill", "#5A6F8F"], ["d", "M14 25C14 24.4477 14.4477 24 15 24H20C20.5523 24 21 24.4477 21 25V26C21 26.5523 20.5523 27 20 27H15C14.4477 27 14 26.5523 14 26V25Z", "fill", "#5A6F8F"], ["id", "archiveDiv"], ["id", "showArchiveSwitch", 1, "text-right"], ["matTooltip", "Show Archive Folders", 1, "switch", 3, "change"], ["id", "backInPathBTN", 3, "click"], ["width", "13", "height", "21", "viewBox", "0 0 13 21", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M11.606 19.9462L2.26066 10.6009L11.606 1.25562", "stroke", "#9BAAC0", "stroke-width", "2"], [1, "lastModelDiv"], [1, "forTitle", "recent-models-forTitle"], [1, "recent-models-bar-row"], [1, "recent-models-tiles"], ["class", "recent-model-tile", 3, "click", "dblclick", 4, "ngFor", "ngForOf"], ["matTooltip", "Number of recent models shown (5–10)", 1, "recent-display-count-control"], ["type", "button", "mat-icon-button", "", "class", "recent-count-step-btn", "aria-label", "Show more recent models", 3, "click", 4, "ngIf"], [1, "recent-count-number"], ["type", "button", "mat-icon-button", "", "class", "recent-count-step-btn", "aria-label", "Show fewer recent models", 3, "click", 4, "ngIf"], [1, "recent-model-tile", 3, "click", "dblclick"], [1, "singleFileContainer", 3, "ngClass", "title"], [1, "svgForSingleFile"], ["alt", "Model Icon", "width", "24px", "height", "30px", "draggable", "false", 3, "src"], [1, "textForSingleFile"], [1, "textForoneFileFile"], ["type", "button", "mat-icon-button", "", "aria-label", "Show more recent models", 1, "recent-count-step-btn", 3, "click"], ["type", "button", "mat-icon-button", "", "aria-label", "Show fewer recent models", 1, "recent-count-step-btn", 3, "click"], ["id", "lastModelDiv"], [1, "forTitle", 2, "margin-top", "20px", "position", "relative"], ["cols", "5", "rowHeight", "70px"], [3, "click", "dblclick", "mouseenter", "mouseleave", 4, "ngFor", "ngForOf"], [3, "click", "dblclick", "mouseenter", "mouseleave"], [1, "lastModelDivL"], ["id", "recentTable"], [1, "underline"], [1, "borderRight", 3, "click", "title"], [1, "borderRight"], [3, "click", "title"], ["class", "row", 3, "ngClass", "click", "dblclick", 4, "ngFor", "ngForOf"], [1, "row", 3, "click", "dblclick", "ngClass"], ["width", "15px", "height", "25px", 3, "src", "alt"], [3, "ngClass"], ["id", "regularViewFoldersAndModels"], ["id", "folderDiv", 4, "ngIf"], ["id", "singleFileDiv", 4, "ngIf"], ["id", "folderDiv"], ["rowHeight", "55px", 3, "cols"], [3, "click", "dblclick", 4, "ngFor", "ngForOf"], [3, "click", "dblclick"], ["id", "folders", 3, "dragstart", "dragover", "drop", "dragenter", "dragleave", "matTooltip", "matTooltipShowDelay", "ngClass", "draggable"], ["alt", "Folder Icon", 3, "src"], ["id", "singleFileDiv"], ["class", "center", 4, "ngIf"], ["id", "filesList", "cols", "7", "rowHeight", "82px"], [1, "center"], [1, "footerActions", 3, "click"], ["mat-button", "", "id", "permissions-button", 3, "click", 4, "ngIf"], ["mat-button", "", "id", "action-button", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", "id", "archive-action-button", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click"], ["mat-button", "", "id", "rename-button", 3, "click", "disabled"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", 3, "click", "disabled"], ["mat-button", "", 2, "margin-left", "40px", 3, "click"], ["mat-button", "", "id", "permissions-button", 3, "click"], ["mat-button", "", "id", "action-button", 3, "click", "disabled"], ["mat-button", "", "id", "archive-action-button", 3, "click"], [1, "controllingIcons"], ["style", "margin-top: 5px; margin-right: 10px", "matTooltip", "Navigate Home", 3, "click", 4, "ngIf"], ["matTooltip", "Back", 3, "click", 4, "ngIf"], ["matTooltip", "New Folder", 3, "click", 4, "ngIf"], ["style", "padding-left: 10px;", "matTooltip", "Rename", 3, "click", 4, "ngIf"], ["style", "padding-left: 10px;", "matTooltip", "Change Folder Permissions", 3, "click", 4, "ngIf"], ["style", "padding-left: 10px;", "matTooltip", "Cut Model", 3, "click", 4, "ngIf"], ["style", "padding-left: 10px;", "matTooltip", "Paste Model", 3, "click", 4, "ngIf"], ["style", "padding-left: 10px;", "matTooltip", "Remove Model", 3, "click", 4, "ngIf"], ["matTooltip", "Navigate Home", 2, "margin-top", "5px", "margin-right", "10px", 3, "click"], ["width", "28", "height", "23", "viewBox", "0 0 28 23", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M27.2002 5.61987V21.3401C27.2002 21.7301 27.0998 22.1099 26.7998 22.3899C26.4998 22.6699 26.1002 22.8301 25.7002 22.8301H1.5C1.1 22.8301 0.7 22.6699 0.5 22.3899C0.2 22.1099 0 21.7301 0 21.3401V4.45996C0 4.06996 0.2 3.68991 0.5 3.40991C0.7 3.12991 1.1 2.96997 1.5 2.96997H13.5C13.9 2.96997 14.2 2.82004 14.5 2.54004C14.8 2.26004 15 1.87999 15 1.48999C15 1.28999 14.9996 1.09992 15.0996 0.919922C15.0996 0.729922 15.2994 0.569932 15.3994 0.429932C15.4994 0.289932 15.6994 0.179863 15.8994 0.109863C16.0994 0.0298633 16.1994 0 16.3994 0H25.7002C25.9002 0 26.0998 0.0298633 26.2998 0.109863C26.4998 0.179863 26.6998 0.289932 26.7998 0.429932C26.8998 0.569932 26.9996 0.729922 27.0996 0.919922C27.1996 1.09992 27.2002 1.28999 27.2002 1.48999V5.61987Z", "fill", "#9BAAC0"], ["d", "M13.8324 6.11289C13.9337 6.04465 14.0663 6.04465 14.1676 6.11289L20.9794 10.7012C21.225 10.8666 21.1079 11.25 20.8118 11.25H7.18815C6.89207 11.25 6.77499 10.8666 7.02056 10.7012L13.8324 6.11289Z", "fill", "#5A6F8F"], ["d", "M13.8324 8.11289C13.9337 8.04465 14.0663 8.04465 14.1676 8.11289L20.9794 12.7012C21.225 12.8666 21.1079 13.25 20.8118 13.25H7.18815C6.89207 13.25 6.77499 12.8666 7.02056 12.7012L13.8324 8.11289Z", "fill", "#9BAAC0"], ["x", "11", "y", "11", "width", "5", "height", "5", "fill", "#5A6F8F"], ["x", "17", "y", "6", "width", "2", "height", "4", "fill", "#5A6F8F"], ["x", "15", "y", "11", "width", "5", "height", "9", "fill", "#5A6F8F"], ["x", "8", "y", "11", "width", "4", "height", "9", "fill", "#5A6F8F"], ["matTooltip", "Back", 3, "click"], ["width", "27", "height", "23", "viewBox", "0 0 27 23", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 2, "margin-top", "5px", "margin-right", "10px"], ["width", "27", "height", "23", "rx", "2", "fill", "#9BAAC0"], ["d", "M14 3L20.0622 10.5H7.93782L14 3Z", "fill", "#5A6F8F"], ["x", "13", "y", "8", "width", "2", "height", "8", "fill", "#5A6F8F"], ["width", "2", "height", "2", "transform", "matrix(1 0 0 -1 13 19)", "fill", "#5A6F8F"], ["width", "2", "height", "1", "transform", "matrix(1 0 0 -1 13 21)", "fill", "#5A6F8F"], ["matTooltip", "New Folder", 3, "click"], ["width", "28", "height", "23", "viewBox", "0 0 28 23", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 2, "margin-top", "5px"], ["d", "M21.082 11.4492H25.3125V14.5078H21.082V19.2891H17.8594V14.5078H13.6172V11.4492H17.8594V6.86719H21.082V11.4492Z", "fill", "#5A6F8F"], ["matTooltip", "Rename", 2, "padding-left", "10px", 3, "click"], ["width", "27", "height", "23", "viewBox", "0 0 27 23", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M3 0H24C25.6569 0 27 1.17685 27 2.62857V20.3714C27 21.8231 25.6569 23 24 23H3C1.34315 23 0 21.8231 0 20.3714V2.62857C0 1.17685 1.34315 0 3 0Z", "fill", "#9BAAC0"], ["d", "M13.5469 8.70801H10.498V17H8.44727V8.70801H5.43945V7.04688H13.5469V8.70801Z", "fill", "#5A6F8F"], ["x1", "18", "y1", "5", "x2", "18", "y2", "19", "stroke", "#5A6F8F", "stroke-width", "2"], ["x1", "21", "y1", "18", "x2", "15", "y2", "18", "stroke", "#5A6F8F", "stroke-width", "2"], ["x1", "21", "y1", "6", "x2", "15", "y2", "6", "stroke", "#5A6F8F", "stroke-width", "2"], ["matTooltip", "Change Folder Permissions", 2, "padding-left", "10px", 3, "click"], ["d", "M23.7587 11.2474C23.7852 11.2974 23.832 11.3896 23.8639 11.4504C23.968 11.6505 24.0395 11.8313 24.0394 11.8985C24.0398 11.9429 24.0186 12.0055 23.9668 12.1178C23.9263 12.2044 23.8689 12.3287 23.8388 12.3963C23.7928 12.4987 23.7726 12.5276 23.7132 12.5828C23.6361 12.654 23.6082 12.6584 23.4599 12.6239C23.4226 12.6155 23.2772 12.6107 23.1361 12.6156C22.7457 12.6251 22.6408 12.6334 22.6175 12.6575C22.6019 12.6735 22.6037 12.9709 22.6203 13.6662C22.6535 14.951 22.6629 15.5723 22.6501 15.6486C22.6408 15.705 22.6341 15.716 22.5735 15.7662L22.506 15.8215L21.6076 15.8273C21.1139 15.8312 20.5741 15.8359 20.4089 15.8392C19.7261 15.8528 19.1469 15.8451 19.1232 15.8227C19.085 15.7867 19.047 15.2498 19.0354 14.588C19.0204 13.7099 18.9873 12.6612 18.9749 12.6495C18.9677 12.6427 18.9074 12.6356 18.8422 12.6336C18.775 12.6316 18.6647 12.6272 18.5955 12.6232C18.453 12.6153 18.4154 12.6317 18.3896 12.7071C18.3657 12.7806 18.2698 12.857 18.2026 12.855C18.1756 12.8544 18.1504 12.8498 18.1463 12.8459C18.1411 12.841 18.1037 12.8307 18.0635 12.8234C18.0231 12.8141 17.9412 12.7866 17.8823 12.7597C17.731 12.6917 17.724 12.6928 17.6346 12.7849C17.5451 12.8771 17.3986 12.9691 17.2992 12.9962C17.1403 13.0399 16.9349 13.0052 16.7546 12.906C16.5896 12.8135 16.51 12.7978 16.2046 12.8031C15.8792 12.8087 15.1056 12.7978 14.2835 12.7778C14.1933 12.7751 13.9077 12.7722 13.6482 12.7709C13.3887 12.7696 13.055 12.7654 12.9057 12.7626C12.7573 12.7588 12.4978 12.7555 12.3295 12.7559C12.1612 12.7543 11.7964 12.7516 11.5178 12.7476C11.2392 12.7436 10.8605 12.741 10.6752 12.7407C10.4909 12.7413 10.1541 12.7342 9.92748 12.7275C9.28872 12.7059 9.06885 12.7228 8.86904 12.8086C8.78204 12.8473 8.76145 12.8625 8.66036 12.9666C8.53497 13.0958 8.55674 13.0531 8.34338 13.5599C8.07673 14.195 7.96626 14.3882 7.73492 14.6266C7.57071 14.7978 7.48058 14.8663 7.22184 15.0251C7.05946 15.1232 6.99523 15.1527 6.80582 15.2176C6.43198 15.3464 6.15072 15.3879 5.7836 15.3713C5.35924 15.3506 5.02856 15.2456 4.62059 15.0004C4.47061 14.9087 4.45521 14.8961 4.17081 14.6294C3.85029 14.3266 3.89077 14.3745 3.68037 14.0356C3.65723 13.9984 3.61695 13.9238 3.59237 13.8718C3.56675 13.8188 3.52945 13.7433 3.51019 13.7021C3.35995 13.3989 3.19552 12.8539 3.15139 12.5146C3.14104 12.4358 3.12471 12.3243 3.11603 12.2682C3.10735 12.212 3.10139 12.1123 3.10151 12.049C3.10261 11.9848 3.10319 11.8356 3.10271 11.718C3.10238 11.5718 3.11509 11.4264 3.14433 11.264C3.16644 11.1313 3.18822 11.0213 3.19211 11.0173C3.19502 11.0143 3.20484 10.9737 3.21447 10.9271C3.27645 10.619 3.45566 10.2104 3.67497 9.8704C3.87513 9.56033 3.99478 9.40649 4.19502 9.20015C4.36421 9.02784 4.39251 9.00274 4.51548 8.92692C5.14805 8.53764 5.74795 8.3978 6.33715 8.50509C6.60102 8.55275 6.73036 8.59045 6.89189 8.66622C7.12657 8.77653 7.24786 8.84695 7.38824 8.95266C7.78778 9.25133 7.99637 9.52897 8.22059 10.0633C8.4264 10.5514 8.53302 10.7346 8.70719 10.8991C8.8236 11.0072 8.88382 11.0449 9.01934 11.0884C9.21656 11.1518 9.66712 11.1781 10.058 11.1498C10.4558 11.1205 10.93 11.1 11.6737 11.0807C12.1382 11.0682 12.3702 11.055 12.4268 11.0375C12.4972 11.0157 12.5243 11.0163 12.6062 11.0418C12.6911 11.0683 12.8515 11.072 13.736 11.0704C15.1454 11.0673 16.487 11.0445 16.5475 11.0229C16.5752 11.0126 16.6459 10.9642 16.7036 10.915C16.8404 10.8004 16.9286 10.7686 17.1028 10.7661C17.2681 10.7648 17.4147 10.8091 17.6346 10.9286C17.7313 10.9815 17.8165 11.0179 17.8396 11.0185C17.8636 11.0182 17.9213 11.0036 17.9708 10.9851C18.154 10.9124 18.2524 10.9208 18.3505 11.0193C18.4228 11.0933 18.449 11.0989 18.7143 11.0922C18.8154 11.0898 19.0679 11.0902 19.2763 11.0932C19.4848 11.0962 20.1138 11.0932 20.6736 11.0883C22.8457 11.0646 23.5329 11.0648 23.5997 11.0876C23.6836 11.1151 23.7012 11.1336 23.7587 11.2474ZM6.2545 9.83803C6.11638 9.77477 6.03472 9.75715 5.86438 9.7556C5.6399 9.75283 5.42705 9.83783 5.3198 9.97074C5.199 10.1196 5.15717 10.4314 5.22036 10.7042C5.2366 10.7791 5.25394 10.8569 5.25556 10.8776C5.26223 10.9338 5.19551 11.0148 5.09696 11.0695C4.84364 11.2084 4.67236 11.3442 4.59675 11.4629C4.52113 11.5815 4.48017 11.754 4.48721 11.9238C4.49672 12.1766 4.55966 12.3397 4.7144 12.5243C4.84004 12.6736 4.93003 12.7356 5.14604 12.8244C5.23424 12.8598 5.31242 12.8952 5.31964 12.902C5.34025 12.9215 5.33553 12.965 5.29375 13.1099C5.22663 13.3459 5.22593 13.4912 5.29216 13.6977C5.34739 13.8708 5.4561 14.0234 5.59933 14.1242C5.89507 14.3344 6.34517 14.2777 6.57334 13.9998C6.63908 13.9198 6.70843 13.7588 6.73066 13.63C6.75032 13.5162 6.72984 13.3663 6.6755 13.2228C6.6266 13.0941 6.63618 13.0455 6.73046 12.9484C6.7849 12.8923 6.81149 12.8771 6.94724 12.8267C7.18698 12.7364 7.29431 12.6401 7.3988 12.4143C7.45628 12.292 7.4775 12.1969 7.48232 12.0555C7.48916 11.7798 7.37373 11.5018 7.16955 11.3051C7.06024 11.2 6.95217 11.1363 6.8076 11.0919C6.74997 11.0739 6.69216 11.05 6.67979 11.0383C6.64681 11.0072 6.64987 10.8738 6.68649 10.7241C6.73848 10.5179 6.70914 10.3059 6.60368 10.1275C6.55092 10.0374 6.37738 9.89459 6.2545 9.83803Z", "fill", "#5A6F8F"], ["matTooltip", "Cut Model", 2, "padding-left", "10px", 3, "click"], ["width", "20", "height", "24", "viewBox", "0 0 20 25", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M18.7057 7.06188C18.7085 7.01388 18.7085 6.96578 18.7057 6.91778C18.7057 6.91778 18.7057 6.89588 18.7057 6.88646C18.6957 6.8302 18.6796 6.77551 18.6578 6.72357C18.6578 6.70793 18.6578 6.69851 18.6437 6.68599C18.6296 6.67346 18.6042 6.60457 18.5817 6.56699L18.5506 6.52625C18.5198 6.47883 18.4848 6.43478 18.4463 6.39472L13.0733 1.00411C13.0367 0.970035 12.998 0.938645 12.9577 0.910142L12.9126 0.888217C12.8828 0.868993 12.8517 0.852243 12.8196 0.8381L12.7914 0.819307L12.6871 0.784853H12.6561C12.6092 0.780375 12.562 0.780375 12.5152 0.784853H1.91846C1.69754 0.784786 1.48537 0.880771 1.32733 1.05228C1.16928 1.22379 1.07791 1.4572 1.07275 1.7026V23.1804C1.07275 23.4296 1.16185 23.6686 1.32046 23.8448C1.47906 24.021 1.69417 24.12 1.91846 24.12H17.8741C18.0984 24.12 18.3135 24.021 18.4721 23.8448C18.6307 23.6686 18.7198 23.4296 18.7198 23.1804V7.08693C18.7198 7.08693 18.7057 7.07125 18.7057 7.06188ZM13.3496 3.8012L15.6894 6.15351H13.3496V3.8012ZM2.76417 22.247V2.64227H11.6694V7.08693C11.6694 7.33614 11.7585 7.57514 11.9171 7.75136C12.0758 7.92762 12.2909 8.02662 12.5152 8.02662H17.0256V22.247H2.76417Z", "fill", "#9BAAC0"], ["d", "M2 2H12L15 4.5L18 7.5V23H2V2Z", "fill", "#9BAAC0"], ["d", "M9.53638 4.89968V4.89968C9.7382 4.41331 10.073 4.00495 10.497 3.72793L10.5958 3.66334L11.7506 16.2964L9.97184 17.7946L10.058 17.2836C10.1909 16.4948 10.2639 15.695 10.2761 14.8922V14.8922L9.93606 12.8454L9.53638 4.89968Z", "fill", "#5A6F8F"], ["d", "M16.9095 8.73259V8.73259C17.1172 8.24923 17.1851 7.7041 17.1045 7.16836L17.0857 7.04294L7.57405 14.2009L7.67917 16.666L7.97845 16.2644C8.44033 15.6444 8.94845 15.0681 9.49781 14.541V14.541L11.1373 13.5103L16.9095 8.73259Z", "fill", "#5A6F8F"], ["d", "M6.32873 17.5332C5.70259 17.9819 5.0276 18.173 4.45612 18.1418C3.8834 18.1105 3.45696 17.8636 3.22551 17.4862C2.99405 17.1088 2.94978 16.588 3.14617 16.0056C3.34213 15.4245 3.76791 14.8269 4.39405 14.3782C5.02019 13.9296 5.69517 13.7384 6.26666 13.7696C6.83938 13.8009 7.26582 14.0478 7.49727 14.4252C7.72872 14.8027 7.77299 15.3234 7.57661 15.9058C7.38065 16.4869 6.95487 17.0845 6.32873 17.5332Z", "stroke", "#5A6F8F"], ["d", "M12.5835 20.1079C12.0724 20.7074 11.4582 21.0671 10.897 21.1828C10.334 21.2988 9.87043 21.1655 9.5686 20.8601C9.26677 20.5546 9.11071 20.0608 9.17551 19.4406C9.24011 18.8223 9.52428 18.1286 10.0354 17.5292C10.5466 16.9298 11.1607 16.57 11.722 16.4544C12.285 16.3383 12.7485 16.4716 13.0504 16.777C13.3522 17.0825 13.5082 17.5763 13.4434 18.1965C13.3789 18.8148 13.0947 19.5085 12.5835 20.1079Z", "stroke", "#5A6F8F"], ["matTooltip", "Paste Model", 2, "padding-left", "10px", 3, "click"], ["width", "18", "height", "24", "viewBox", "0 0 18 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M17.6329 6.28039C17.6357 6.23239 17.6357 6.18428 17.6329 6.13628C17.6329 6.13628 17.6329 6.11439 17.6329 6.10497C17.623 6.0487 17.6069 5.99402 17.585 5.94207C17.585 5.92644 17.585 5.91702 17.5709 5.90449C17.5569 5.89197 17.5315 5.82307 17.5089 5.78549L17.4779 5.74476C17.447 5.69733 17.4121 5.65328 17.3736 5.61323L12.0005 0.222614C11.9639 0.188541 11.9253 0.157151 11.885 0.128648L11.8399 0.106723C11.81 0.0874989 11.7789 0.0707484 11.7468 0.0566063L11.7187 0.0378131L11.6143 0.00335842H11.5833C11.5364 -0.00111947 11.4893 -0.00111947 11.4424 0.00335842H0.845706C0.624789 0.00329158 0.412617 0.0992773 0.254572 0.270788C0.0965264 0.442293 0.0051551 0.675709 0 0.921104V22.3989C0 22.6481 0.0891009 22.8871 0.247701 23.0633C0.406303 23.2395 0.621412 23.3385 0.845706 23.3385H16.8013C17.0256 23.3385 17.2408 23.2395 17.3994 23.0633C17.5579 22.8871 17.647 22.6481 17.647 22.3989V6.30544C17.647 6.30544 17.6329 6.28976 17.6329 6.28039ZM12.2768 3.01971L14.6166 5.37202H12.2768V3.01971ZM1.69141 21.4655V1.86078H10.5967V6.30544C10.5967 6.55465 10.6858 6.79365 10.8444 6.96986C11.003 7.14612 11.2181 7.24512 11.4424 7.24512H15.9528V21.4655H1.69141Z", "fill", "#9BAAC0"], ["d", "M0.927246 1.21851H10.9272L13.9272 3.71851L16.9272 6.71851V22.2185H0.927246V1.21851Z", "fill", "#9BAAC0"], ["id", "path-3-inside-1_0_1", "fill", "white"], ["x", "2.80005", "y", "5", "width", "12", "height", "16", "rx", "1"], ["x", "2.80005", "y", "5", "width", "12", "height", "16", "rx", "1", "stroke", "#5A6F8F", "stroke-width", "3", "mask", "url(#path-3-inside-1_0_1)"], ["x", "6.5", "y", "5", "width", "5", "height", "3", "rx", "1", "fill", "#5A6F8F"], ["matTooltip", "Remove Model", 2, "padding-left", "10px", 3, "click"], ["width", "17", "height", "23", "viewBox", "0 0 17 23", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["opacity", "0.7"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.9815 7.7474H2.01227C1.40508 7.7474 0.931351 8.26784 0.979926 8.87311L2.0852 22.1042C2.12163 22.6126 2.54643 23 3.05647 23H13.9373C14.4352 23 14.86 22.6126 14.9085 22.1042L16.002 8.87311C16.0505 8.26784 15.5765 7.7474 14.9815 7.7474ZM0.967474 5.94373C0.311708 5.94373 -0.149472 5.32631 0.0448286 4.68473L0.506151 2.94164C0.603302 2.59059 0.882443 2.36054 1.24676 2.28791C1.62322 2.20318 4.47699 1.94889 5.16919 1.91258C5.47278 1.88837 5.66732 1.63418 5.7159 1.47681C5.77661 1.31944 6.09233 0.60531 6.29877 0.3511C6.39593 0.230047 6.79674 0 8.49688 0C10.1849 0 10.5978 0.230047 10.695 0.3511C10.9014 0.60531 11.2171 1.31944 11.2779 1.47681C11.3264 1.63418 11.521 1.88837 11.8246 1.91258C12.5168 1.94889 15.3705 2.20318 15.747 2.28791C16.1235 2.36054 16.3902 2.59059 16.4995 2.94164L16.9489 4.68473C17.1432 5.32631 16.682 5.94373 16.0263 5.94373H0.967474Z", "fill", "#1A3763"], ["opacity", "0.7", "d", "M12.7473 10.8948L12.1401 19.9737", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "d", "M4.24683 10.8948L4.85402 19.9737", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "d", "M8.49707 10.8948V19.9737", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["id", "combinedFolderModelDiv"], ["id", "leftSideFolders"], ["id", "foldersHeader", 2, "resize", "horizontal", "overflow", "auto", "width", "100%"], ["id", "leftFoldersHeader", 3, "title", "click", 4, "ngIf"], ["id", "foldersRow", 3, "ngClass", "draggable", "click", "dblclick", "dragstart", "dragover", "drop", "dragenter", "dragleave", 4, "ngFor", "ngForOf"], ["class", "rightSideModelsData", 4, "ngIf"], ["id", "leftFoldersHeader", 3, "click", "title"], ["id", "foldersRow", 3, "click", "dblclick", "dragstart", "dragover", "drop", "dragenter", "dragleave", "ngClass", "draggable"], [2, "margin-left", "4px"], [1, "folderName", 3, "matTooltip", "matTooltipShowDelay"], [1, "rightSideModelsData"], ["class", "modelsColumn", 4, "ngIf"], [1, "modelsColumn"], [1, "modelHeader"], [1, "headerIconPlaceholder"], [1, "borderRight", "modelsTableHeaderTitles", "modelNameCol", 3, "click", "resize", "title"], [1, "borderRight", "modelsTableHeaderTitles", "modelDescCol"], [1, "borderRight", "modelsTableHeaderTitles", "modelDateCol", 3, "click", "title"], [1, "modelsTableHeaderTitles", "modelAuthorCol", 3, "click", "title"], ["class", "borderRight modelsTableHeaderTitles modelArchiveCol", 4, "ngIf"], [3, "ngClass", "click", "dblclick", 4, "ngFor", "ngForOf"], [1, "borderRight", "modelsTableHeaderTitles", "modelArchiveCol"], [3, "click", "dblclick", "ngClass"], [1, "modelRowIcon"], ["width", "15px", "height", "25px", "draggable", "false", 3, "src", "alt"], [1, "modelNameCol", "tableCellData", "modelNameData", 3, "title"], [1, "modelDescCol", "tableCellData", 3, "title"], [1, "modelDateCol", "tableCellData", 3, "title"], [1, "modelAuthorCol", "tableCellData", 3, "title"], ["class", "modelArchiveCol tableCellData", 3, "title", 4, "ngIf"], [1, "modelArchiveCol", "tableCellData", 3, "title"], [1, "borderRight", "modelsTableHeaderTitles", "modelNameColExamples", 3, "click", "title"], [1, "borderRight", "modelsTableHeaderTitles", "modelDescColExamples"], [3, "ngClass", "click", "dblclick", "mouseenter", "mouseleave", 4, "ngFor", "ngForOf"], [3, "click", "dblclick", "mouseenter", "mouseleave", "ngClass"], ["width", "20", "height", "19", "viewBox", "0 0 15 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "favoriteStar", 3, "click", "matTooltip"], ["d", "M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z", "fill", "#4E607F"], [1, "modelNameColExamples", "tableCellData", "modelNameData", 3, "title"], [1, "modelDescColExamples", "tableCellData", 3, "title"], ["mat-button", "", "id", "action-buttonL", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", "id", "rename-button1", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", "id", "archive-action-buttonL", 3, "click", 4, "ngIf"], ["mat-button", "", "id", "action-buttonL", 3, "click", "disabled"], ["mat-button", "", "id", "rename-button1", 3, "click", "disabled"], ["mat-button", "", "id", "archive-action-buttonL", 3, "click"]],
      template: function LoadModelDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "p", 0);
          core /* ɵɵtext */.EFF(2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(3, LoadModelDialogComponent_div_3_Template, 13, 4, "div", 1);
          core /* ɵɵelementStart */.j41(4, "div", 2)(5, "span", 3);
          core /* ɵɵtext */.EFF(6, "Search");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "span", 4);
          core /* ɵɵtemplate */.DNE(8, LoadModelDialogComponent_mat_form_field_8_Template, 2, 1, "mat-form-field", 5)(9, LoadModelDialogComponent_mat_form_field_9_Template, 2, 1, "mat-form-field", 5)(10, LoadModelDialogComponent_div_10_Template, 5, 1, "div", 6)(11, LoadModelDialogComponent_div_11_Template, 3, 2, "div", 7);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(12, LoadModelDialogComponent_span_12_Template, 5, 1, "span", 8)(13, LoadModelDialogComponent_span_13_Template, 3, 2, "span", 9);
          core /* ɵɵelement */.nrm(14, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(15, LoadModelDialogComponent_div_15_Template, 6, 1, "div", 10);
          core /* ɵɵelementStart */.j41(16, "div", 11);
          core /* ɵɵtemplate */.DNE(17, LoadModelDialogComponent_button_17_Template, 3, 0, "button", 12);
          core /* ɵɵelementStart */.j41(18, "span", 13);
          core /* ɵɵtext */.EFF(19);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(20, "div", 14);
          core /* ɵɵelement */.nrm(21, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(22, LoadModelDialogComponent_div_22_Template, 15, 4, "div", 15)(23, LoadModelDialogComponent_div_23_Template, 9, 6, "div", 16)(24, LoadModelDialogComponent_div_24_Template, 15, 13, "div", 17)(25, LoadModelDialogComponent_div_25_Template, 3, 2, "div", 18)(26, LoadModelDialogComponent_div_26_Template, 16, 9, "div", 19)(27, LoadModelDialogComponent_div_27_Template, 9, 8, "div", 20)(28, LoadModelDialogComponent_div_28_Template, 8, 5, "div", 21)(29, LoadModelDialogComponent_div_29_Template, 15, 12, "div", 19);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.getHeaderTitle());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === ctx.Mode.SAVE);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.deepSearchMode);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.deepSearchMode && ctx.mode === ctx.Mode.LOAD && ctx.comparison == false && !ctx.isExamplesView());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === ctx.Mode.LOAD && ctx.comparison == false && !ctx.isExamplesView());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowDeepSearchResults);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isExamplesView() && !ctx.isTemplatesView());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isExamplesView() && !ctx.isTemplatesView());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isExamplesView() && !ctx.isTemplatesView());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.currentDialogPath.length > 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.goRoutingPath(), " ");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isExamplesView() && !ctx.isTemplatesView());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isExamplesView() || ctx.isTemplatesView());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", false);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.loadType);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.loadType);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.loadType && !ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.loadType);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.loadType);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatFormField, MatInput, MatTooltip, MatIcon, MatGridList, MatGridTile, MatGridTileText, MatGridTileFooterCssMatStyler, MatButton, MatIconButton, ProgressSpinner, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, SlicePipe],
      styles: ["#header[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}.mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-mdc-grid-tile-footer[_ngcontent-%COMP%] > *[_ngcontent-%COMP%], .mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-mdc-grid-tile-header[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{margin:2px}.smallSvgForSingleFile[_ngcontent-%COMP%]{position:relative;top:2%;left:10%}.textForSingleFile[_ngcontent-%COMP%]{position:relative;left:8%;width:50px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}.path[_ngcontent-%COMP%]{position:relative;left:-24px;background-color:transparent;width:calc(100% + 40px);height:70px;border:1px solid rgba(0,0,0,.1);font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:24px;color:#1a3763}#backInPathBTN[_ngcontent-%COMP%]{position:absolute;left:16px;width:35px;height:72px;background:none;top:-6px;border:none}#pathDisplay[_ngcontent-%COMP%]{position:relative;top:25%;left:5%}#deepSearchSwitch[_ngcontent-%COMP%]{position:relative;top:2px;left:24px;display:inline-block;width:20px;height:20px}.switch[_ngcontent-%COMP%]{position:relative;top:-10px;display:inline-block;width:97px;height:35px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{opacity:0;width:0;height:0}.slider[_ngcontent-%COMP%]{position:absolute;cursor:pointer;inset:0;background-color:#ccc;transition:.4s}.slider[_ngcontent-%COMP%]:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:5px;background-color:#fff;transition:.4s}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#78a8f1}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #2196f3}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translate(53px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}.mat-mdc-input-underline[_ngcontent-%COMP%]{display:none}#searchAndVersionsDiv[_ngcontent-%COMP%], #archiveDiv[_ngcontent-%COMP%]{height:56px}.searchText[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}.searchField[_ngcontent-%COMP%]{position:relative;left:10px;width:368px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.mdc-text-field--filled[_ngcontent-%COMP%]:not(.mdc-text-field--disabled){background-color:transparent!important}.mat-mdc-form-field-focus-overlay[_ngcontent-%COMP%]{background-color:transparent!important}.mat-mdc-form-field-flex[_ngcontent-%COMP%]{padding:0!important}.mdc-text-field[_ngcontent-%COMP%]{--mdc-theme-primary: #6200ee;border:none;background-color:transparent}.mdc-line-ripple[_ngcontent-%COMP%]{background-color:#6200ee!important}.mdc-text-field--filled[_ngcontent-%COMP%]{padding:0;background-color:transparent!important}.mat-mdc-form-field[_ngcontent-%COMP%]{margin-bottom:0}.mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%]{margin-top:4px}#showVersionsSwitch[_ngcontent-%COMP%]{position:relative;top:19px;float:right;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}#deepSearchText[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}#deepSearchField[_ngcontent-%COMP%]{position:relative;left:10px;width:368px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#showArchiveSwitch[_ngcontent-%COMP%]{position:relative;top:19px;float:right;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}#loadTypeSwitch[_ngcontent-%COMP%]{right:10px;position:relative;top:10px;float:right;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}.lastModelDiv[_ngcontent-%COMP%]{height:70px;min-height:70px;overflow:hidden;position:relative;display:flex;flex-direction:row;align-items:center}.recent-models-forTitle[_ngcontent-%COMP%]{flex:0 0 auto;position:relative;top:0;left:0;margin-left:8px;margin-right:8px}.recent-models-bar-row[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:row;align-items:center;min-width:0;height:70px}.recent-models-tiles[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;min-width:0;height:70px;overflow:hidden}.recent-model-tile[_ngcontent-%COMP%]{flex:1 1 0;min-width:0;display:flex;justify-content:center;align-items:center}.recent-model-tile[_ngcontent-%COMP%]   .singleFileContainer[_ngcontent-%COMP%]{max-width:67px}.recent-display-count-control[_ngcontent-%COMP%]{flex:0 0 36px;width:36px;height:59px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(73,114,132,.2);border-radius:6px;box-sizing:border-box;margin-right:6px;background:#fff;padding:2px 0}[_nghost-%COMP%]     .recent-count-step-btn.mat-mdc-icon-button{--mdc-icon-button-state-layer-size: 22px;width:22px;height:22px;min-width:22px;padding:0;line-height:22px}[_nghost-%COMP%]     .recent-count-step-btn .mat-mdc-button-touch-target{width:22px;height:22px}[_nghost-%COMP%]     .recent-count-step-btn mat-icon, [_nghost-%COMP%]     .recent-count-step-btn .mat-icon{font-size:14px;width:14px;height:14px;line-height:14px;color:#1a3763}.recent-count-number[_ngcontent-%COMP%]{font-size:13px;font-weight:500;color:#1a3763;line-height:1.2;-webkit-user-select:none;user-select:none}#folderDiv[_ngcontent-%COMP%]{height:35%;border-top:1px solid #e8e8e887;border-bottom:1px solid #e8e8e887;overflow:auto}hr[_ngcontent-%COMP%]{border:1px solid #e8e8e887}#singleFileDiv[_ngcontent-%COMP%]{height:65%;margin-top:5px;overflow:auto}#combinedFolderModelDiv[_ngcontent-%COMP%]{height:55%;min-height:350px;overflow:auto;margin-top:5px}#combinedFolderModelTable[_ngcontent-%COMP%]{height:100%;min-width:100%}div.center[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:center;align-content:center;vertical-align:top;width:100%;height:100%}div.wrapDialog[_ngcontent-%COMP%]{height:100%;overflow:auto}#folderDiv[_ngcontent-%COMP%]::-webkit-scrollbar, #folderDivL[_ngcontent-%COMP%]::-webkit-scrollbar, .lastModelDivL[_ngcontent-%COMP%]::-webkit-scrollbar, #singleFileDiv[_ngcontent-%COMP%]::-webkit-scrollbar, #combinedFolderModelDiv[_ngcontent-%COMP%]::-webkit-scrollbar{width:6px}#folderDiv[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, #folderDivL[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, .lastModelDivL[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, #singleFileDiv[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, #combinedFolderModelDiv[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:1px}#folderDiv[_ngcontent-%COMP%]::-webkit-scrollbar-track, #folderDivL[_ngcontent-%COMP%]::-webkit-scrollbar-track, .lastModelDivL[_ngcontent-%COMP%]::-webkit-scrollbar-track, #singleFileDiv[_ngcontent-%COMP%]::-webkit-scrollbar-track, #combinedFolderModelDiv[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:1px;background:#b9d2df54;border-radius:1px}span.textForFile[_ngcontent-%COMP%]{position:relative;overflow:hidden;width:60px;min-width:60px;height:12px;min-height:12px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763;bottom:-16px}#newModelText[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}#newModelInput[_ngcontent-%COMP%]{width:268px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#newModelDescriptionText[_ngcontent-%COMP%]{position:relative;left:20px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}#newModelDescriptionInput[_ngcontent-%COMP%]{position:relative;left:20px;margin-right:30px;width:368px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-mdc-grid-tile-footer[_ngcontent-%COMP%], .mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-mdc-grid-tile-header[_ngcontent-%COMP%]{display:flex;align-items:center;width:142px;height:48px;color:#000;border:1px solid rgba(73,114,132,.2);border-radius:6px;background:none;overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}#filesList[_ngcontent-%COMP%]{margin-bottom:10%}#textForFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}div.singleFileContainer[_ngcontent-%COMP%]:hover, tr.row[_ngcontent-%COMP%]:hover, #folders[_ngcontent-%COMP%]:hover{background:#1a3661a6;color:#fff;cursor:pointer}div.singleFileContainer.selected[_ngcontent-%COMP%], tr.row.selected[_ngcontent-%COMP%], #folders.selected[_ngcontent-%COMP%]{background:#1a3661;color:#fff;cursor:pointer}th[_ngcontent-%COMP%]{position:sticky;top:0;background-color:#fff;text-align:left;height:20px}#newModelSaveButtonStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763;padding:5px;margin:5px;letter-spacing:normal}.footerActions[_ngcontent-%COMP%]{position:absolute;justify-content:center;display:flex;flex-wrap:wrap;align-items:center;bottom:0;left:0;height:60px;width:100%;background-image:linear-gradient(transparent,#fff,#fff,#fff)}.footerActions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763;padding:5px;margin:5px;letter-spacing:normal}.footerActions[_ngcontent-%COMP%]   button.big[_ngcontent-%COMP%]{font-size:20px;color:#1a3763!important}.cutFolder[_ngcontent-%COMP%]{opacity:.5}.folderHover[_ngcontent-%COMP%]{border:#9baac0 1px dashed}.hover-container[_ngcontent-%COMP%]{position:relative}.hover-content[_ngcontent-%COMP%]{position:absolute;bottom:-10px;right:10px;display:none}.hover-container[_ngcontent-%COMP%]:hover   .hover-content[_ngcontent-%COMP%]{display:block}.favoriteStar[_ngcontent-%COMP%]{margin-top:1px;margin-left:-1px}.forTitle[_ngcontent-%COMP%]{color:#1a3763;font-size:13px;position:absolute;top:25%}.controllingIcons[_ngcontent-%COMP%]{height:34px;width:100%;border-bottom:1px solid rgba(0,0,0,.1);border-top:1px solid rgba(0,0,0,.1);vertical-align:center;margin:auto}table[_ngcontent-%COMP%]{border-collapse:collapse}tr[_ngcontent-%COMP%]{border:none}tr.underline[_ngcontent-%COMP%]{border-bottom:1px solid rgba(0,0,0,.1);line-height:9px}td.borderRight[_ngcontent-%COMP%], th.borderRight[_ngcontent-%COMP%]{border-right:1px solid rgba(0,0,0,.1)}td.foldersColumn[_ngcontent-%COMP%]{vertical-align:top;min-width:220px;width:25%}table.foldersColumn[_ngcontent-%COMP%]{width:100%}td.modelsColumn[_ngcontent-%COMP%]{vertical-align:top;width:75%}table.modelsColumn[_ngcontent-%COMP%]{min-width:100%}td[_ngcontent-%COMP%], th[_ngcontent-%COMP%]{padding-left:5px;padding-right:5px}div.singleFileContainer[_ngcontent-%COMP%]:hover{background:#1a3661a6;color:#fff;cursor:pointer}div.singleFileContainer.selected[_ngcontent-%COMP%]{background:#1a3661;color:#fff;cursor:pointer}div.singleFileContainer[_ngcontent-%COMP%]{position:relative;width:67px;height:59px;border:1px solid rgba(73,114,132,.2);border-radius:6px}div.textForoneFileFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}.svgForSingleFile[_ngcontent-%COMP%]{position:relative;top:8%;left:28.39%}div.textForSingleFile[_ngcontent-%COMP%]{position:relative;left:8%;width:50px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}div.textForoneFileFile[_ngcontent-%COMP%]{position:relative;overflow:hidden;width:60px;min-width:60px;height:15px;min-height:12px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}.rightSideModelsData[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}.rightSideModelsData[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:2px;border-left:2px solid white;border-right:2px solid white}.rightSideModelsData[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:4px;border-left:4px solid white;border-right:4px solid white}#leftSideFolders[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}#leftSideFolders[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:2px;border-left:2px solid white;border-right:2px solid white}#leftSideFolders[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:4px;border-left:4px solid white;border-right:4px solid white}.selectedLine[_ngcontent-%COMP%]{background-color:#1a3661;color:#fff}.selectedFolder[_ngcontent-%COMP%]{background-color:#1a36611f;border-radius:3px}.line[_ngcontent-%COMP%]:hover{background-color:#424f60b0;color:#fff}div.singleFileContainer.selected[_ngcontent-%COMP%]   div.textForoneFileFile[_ngcontent-%COMP%], div.singleFileContainer[_ngcontent-%COMP%]:hover   div.textForoneFileFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}.modelNameCol[_ngcontent-%COMP%], .modelDescCol[_ngcontent-%COMP%]{width:30%}.modelNameColExamples[_ngcontent-%COMP%], .modelDescColExamples[_ngcontent-%COMP%]{width:50%}.modelArchiveCol[_ngcontent-%COMP%]{width:10%}.modelDateCol[_ngcontent-%COMP%]{width:20%}.modelAuthorCol[_ngcontent-%COMP%]{width:10%}.modelsTableHeaderTitles[_ngcontent-%COMP%]{font-weight:700;margin-left:5px;resize:horizontal;overflow:auto}.borderRight[_ngcontent-%COMP%]{border-right:1px solid rgba(0,0,0,.1)}.tableCellData[_ngcontent-%COMP%]{overflow:hidden;margin-top:3px;white-space:nowrap;margin-right:5px;margin-left:2px}.line[_ngcontent-%COMP%]{display:flex;height:25px}.modelNameData[_ngcontent-%COMP%]{margin-left:10px}.modelRowIcon[_ngcontent-%COMP%]{padding-left:4px}.rightSideModelsData[_ngcontent-%COMP%]{display:inline-block;width:75%;overflow:auto;margin-left:5px}#leftSideFolders[_ngcontent-%COMP%]{display:inline-block;width:25%;overflow:auto}#foldersRow[_ngcontent-%COMP%]{display:flex;width:calc(100% - 5px)}#combinedFolderModelDiv[_ngcontent-%COMP%]{display:flex}.modelHeader[_ngcontent-%COMP%]{line-height:30px;display:flex}.headerIconPlaceholder[_ngcontent-%COMP%]{line-height:17px;width:25px}.folderName[_ngcontent-%COMP%]{margin-left:5px;margin-top:3px}#leftFoldersHeader[_ngcontent-%COMP%]{white-space:pre;margin-left:15px;font-weight:700}.deepSearchPathText[_ngcontent-%COMP%]{margin-left:7px;display:inline-flex}.deepSearchResultIcon[_ngcontent-%COMP%]{width:15px;height:15px;margin-left:5px}#modelsAndFoldersPaths[_ngcontent-%COMP%]{width:50%;max-height:320px;overflow:auto;display:grid;position:fixed;margin-left:46px;margin-top:-24px;z-index:9999;box-shadow:-10px 16px 34px -23px;font-size:16px;color:#1a3763;background-color:#fff;opacity:.9}.pathAndIconDeepSearch[_ngcontent-%COMP%]{display:inline-flex;padding:3px}.pathAndIconDeepSearch[_ngcontent-%COMP%]:hover{background-color:#1a9af3}#modelsAndFoldersPaths[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}#modelsAndFoldersPaths[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:2px;border-left:2px solid white;border-right:2px solid white}#modelsAndFoldersPaths[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:4px;border-left:4px solid white;border-right:4px solid white}#DeepText[_ngcontent-%COMP%]{position:relative;top:19px;left:23px;font-size:14px;color:#1a3763;white-space:nowrap}"]
    }))();
  }
  return LoadModelDialogComponent;
})();