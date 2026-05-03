// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/OPCloud-Organization-Settings/OPCloud-Organization-Settings.component_org.ts
// Extracted by opm-extracted/tools/extract.mjs

const OPCloud_Organization_Settings_component_org_c0 = a0 => [a0];
function div_0_mat_option_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r4 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", core /* ɵɵpureFunction1 */.eq3(2, OPCloud_Organization_Settings_component_org_c0, org_r4.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r4.name);
  }
}
function div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 96)(1, "h1", 97);
    core /* ɵɵtext */.EFF(2, "Choose Organization");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4, "Organization: ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "mat-select", 98);
    core /* ɵɵlistener */.bIt("selectionChange", function div_0_Template_mat_select_selectionChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.selectOrg($event));
    });
    core /* ɵɵelementStart */.j41(6, "mat-optgroup", 99);
    core /* ɵɵtemplate */.DNE(7, div_0_mat_option_7_Template, 2, 4, "mat-option", 56);
    core /* ɵɵpipe */.nI1(8, "async");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵpropertyInterpolate */.FS9("placeholder", ctx_r2.placeholder);
    core /* ɵɵproperty */.Y8G("value", ctx_r2.selectedOrg);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(8, 3, ctx_r2.organizations$));
  }
}
function span_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "mat-checkbox", 100);
    core /* ɵɵlistener */.bIt("change", function span_52_Template_mat_checkbox_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.updateOrganizationModelReviewAutomaticSyncingLocked($event));
    });
    core /* ɵɵtext */.EFF(2, " Lock organization selection ");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("checked", ctx_r2.modelReviewAutomaticSyncingLocked);
  }
}
function span_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "h1");
    core /* ɵɵtext */.EFF(2, "Ontology Enforcement Level");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4, "Enforcement Level");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(5, "\xA0\xA0 ");
    core /* ɵɵelementStart */.j41(6, "mat-select", 101);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function span_56_Template_mat_select_ngModelChange_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.ontologyEnforcementLevel, $event)) {
        ctx_r2.ontologyEnforcementLevel = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("selectionChange", function span_56_Template_mat_select_selectionChange_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.updateOntologyEnforcement());
    });
    core /* ɵɵelementStart */.j41(7, "mat-option", 5);
    core /* ɵɵtext */.EFF(8, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "mat-option", 5);
    core /* ɵɵtext */.EFF(10, "Suggest");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "mat-option", 5);
    core /* ɵɵtext */.EFF(12, "Enforce");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.ontologyEnforcementLevel);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", ctx_r2.OntologyTypes.NONE);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", ctx_r2.OntologyTypes.SUGGEST);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", ctx_r2.OntologyTypes.FORCE);
  }
}
function span_60_span_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 107);
    core /* ɵɵtext */.EFF(1, "Max edit users connected at a moment:");
    core /* ɵɵelementEnd */.k0s();
  }
}
function span_60_mat_form_field_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 108)(1, "input", 109);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function span_60_mat_form_field_13_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.maxUsersNumber, $event)) {
        ctx_r2.maxUsersNumber = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.maxUsersNumber);
  }
}
function span_60_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 23);
    core /* ɵɵlistener */.bIt("click", function span_60_button_14_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.updateMaxUsersNumber());
    });
    core /* ɵɵtext */.EFF(1, "Update");
    core /* ɵɵelementEnd */.k0s();
  }
}
function span_60_span_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 107);
    core /* ɵɵtext */.EFF(1, "Max view users connected at a moment:");
    core /* ɵɵelementEnd */.k0s();
  }
}
function span_60_mat_form_field_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 21)(1, "input", 110);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function span_60_mat_form_field_18_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.maxViewUsersNumber, $event)) {
        ctx_r2.maxViewUsersNumber = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.maxViewUsersNumber);
  }
}
function span_60_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 23);
    core /* ɵɵlistener */.bIt("click", function span_60_button_19_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.updateMaxViewUsersNumber());
    });
    core /* ɵɵtext */.EFF(1, "Update");
    core /* ɵɵelementEnd */.k0s();
  }
}
function span_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "h1");
    core /* ɵɵtext */.EFF(2, "Max Users Connected");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4, "Is Enabled?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "mat-select", 102);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function span_60_Template_mat_select_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.maxUsersEnabled, $event)) {
        ctx_r2.maxUsersEnabled = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("selectionChange", function span_60_Template_mat_select_selectionChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.updateMaxUsersEnabled($event));
    });
    core /* ɵɵelementStart */.j41(6, "mat-option", 5);
    core /* ɵɵtext */.EFF(7, "Enabled");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "mat-option", 5);
    core /* ɵɵtext */.EFF(9, "Disabled");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(10, "br");
    core /* ɵɵtemplate */.DNE(11, span_60_span_11_Template, 2, 0, "span", 103);
    core /* ɵɵtext */.EFF(12, "\xA0\xA0 ");
    core /* ɵɵtemplate */.DNE(13, span_60_mat_form_field_13_Template, 2, 1, "mat-form-field", 104)(14, span_60_button_14_Template, 2, 0, "button", 105);
    core /* ɵɵelement */.nrm(15, "br");
    core /* ɵɵtemplate */.DNE(16, span_60_span_16_Template, 2, 0, "span", 103);
    core /* ɵɵtext */.EFF(17, "\xA0\xA0 ");
    core /* ɵɵtemplate */.DNE(18, span_60_mat_form_field_18_Template, 2, 1, "mat-form-field", 106)(19, span_60_button_19_Template, 2, 0, "button", 105);
    core /* ɵɵelement */.nrm(20, "br")(21, "br");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.maxUsersEnabled);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", true);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", false);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.maxUsersEnabled);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.maxUsersEnabled);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.maxUsersEnabled);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.maxUsersEnabled);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.maxUsersEnabled);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.maxUsersEnabled);
  }
}
function h1_61_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "h1", 111);
    core /* ɵɵtext */.EFF(1, "Organization Accounts Enhanced Options");
    core /* ɵɵelementEnd */.k0s();
  }
}
function table_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "table", 112)(1, "tr", 113)(2, "td", 114)(3, "label", 115);
    core /* ɵɵtext */.EFF(4, "Accounts Options: ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "td", 116)(6, "mat-form-field", 117)(7, "mat-label", 118);
    core /* ɵɵtext */.EFF(8, "Please Select");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "mat-select", 119, 1)(11, "mat-option", 120);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_option_click_11_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const selector_r13 = core /* ɵɵreference */.sdS(10);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      selector_r13.open();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleDefaultUserOption("viewer"));
    });
    core /* ɵɵelementStart */.j41(12, "mat-checkbox", 121);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_checkbox_click_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOptionSelection($event));
    })("change", function table_62_Template_mat_checkbox_change_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOption());
    });
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function table_62_Template_mat_checkbox_ngModelChange_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.defaultUserOptions.viewer, $event)) {
        ctx_r2.defaultUserOptions.viewer = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "span", 122);
    core /* ɵɵtext */.EFF(14, "Viewer");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(15, "mat-option", 120);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_option_click_15_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const selector_r13 = core /* ɵɵreference */.sdS(10);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      selector_r13.open();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleDefaultUserOption("executionUser"));
    });
    core /* ɵɵelementStart */.j41(16, "mat-checkbox", 121);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_checkbox_click_16_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOptionSelection($event));
    })("change", function table_62_Template_mat_checkbox_change_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOption());
    });
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function table_62_Template_mat_checkbox_ngModelChange_16_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.defaultUserOptions.executionUser, $event)) {
        ctx_r2.defaultUserOptions.executionUser = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "span", 122);
    core /* ɵɵtext */.EFF(18, "Execution User");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(19, "mat-option", 120);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_option_click_19_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const selector_r13 = core /* ɵɵreference */.sdS(10);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      selector_r13.open();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleDefaultUserOption("insightsUser"));
    });
    core /* ɵɵelementStart */.j41(20, "mat-checkbox", 121);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_checkbox_click_20_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOptionSelection($event));
    })("change", function table_62_Template_mat_checkbox_change_20_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOption());
    });
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function table_62_Template_mat_checkbox_ngModelChange_20_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.defaultUserOptions.insightsUser, $event)) {
        ctx_r2.defaultUserOptions.insightsUser = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(21, "span", 122);
    core /* ɵɵtext */.EFF(22, "Insights User");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(23, "mat-option", 120);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_option_click_23_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const selector_r13 = core /* ɵɵreference */.sdS(10);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      selector_r13.open();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleDefaultUserOption("dsmUser"));
    });
    core /* ɵɵelementStart */.j41(24, "mat-checkbox", 121);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_checkbox_click_24_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOptionSelection($event));
    })("change", function table_62_Template_mat_checkbox_change_24_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOption());
    });
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function table_62_Template_mat_checkbox_ngModelChange_24_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.defaultUserOptions.dsmUser, $event)) {
        ctx_r2.defaultUserOptions.dsmUser = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(25, "span", 122);
    core /* ɵɵtext */.EFF(26, "DSM User");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(27, "mat-option", 120);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_option_click_27_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const selector_r13 = core /* ɵɵreference */.sdS(10);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      selector_r13.open();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleDefaultUserOption("genAIUser"));
    });
    core /* ɵɵelementStart */.j41(28, "mat-checkbox", 121);
    core /* ɵɵlistener */.bIt("click", function table_62_Template_mat_checkbox_click_28_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOptionSelection($event));
    })("change", function table_62_Template_mat_checkbox_change_28_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onDefaultUserOption());
    });
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function table_62_Template_mat_checkbox_ngModelChange_28_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.defaultUserOptions.genAIUser, $event)) {
        ctx_r2.defaultUserOptions.genAIUser = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(29, "span", 122);
    core /* ɵɵtext */.EFF(30, "GenerativeAI User");
    core /* ɵɵelementEnd */.k0s()()()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(12);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.defaultUserOptions.viewer);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.defaultUserOptions.executionUser);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.defaultUserOptions.insightsUser);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.defaultUserOptions.dsmUser);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.defaultUserOptions.genAIUser);
  }
}
function span_63_mat_option_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1, "Disabled");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    core /* ɵɵproperty */.Y8G("value", "disabled");
  }
}
function span_63_mat_option_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1, "Mandatory");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    core /* ɵɵproperty */.Y8G("value", "mandatory");
  }
}
function span_63_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1, "Optional");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    core /* ɵɵproperty */.Y8G("value", "optional");
  }
}
function span_63_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "h1");
    core /* ɵɵtext */.EFF(2, "Second Authentication Factor");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4, "Is Mandatory?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(5, "\xA0\xA0 ");
    core /* ɵɵelementStart */.j41(6, "mat-select", 123);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function span_63_Template_mat_select_ngModelChange_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r2.auth2Factors, $event)) {
        ctx_r2.auth2Factors = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("selectionChange", function span_63_Template_mat_select_selectionChange_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.updateOrgAuth2Factors($event));
    });
    core /* ɵɵtemplate */.DNE(7, span_63_mat_option_7_Template, 2, 1, "mat-option", 124)(8, span_63_mat_option_8_Template, 2, 1, "mat-option", 124)(9, span_63_mat_option_9_Template, 2, 1, "mat-option", 124);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(10, "br")(11, "br");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r2.auth2Factors);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.user == null ? null : ctx_r2.user.user == null ? null : ctx_r2.user.user.userData == null ? null : ctx_r2.user.user.userData.SysAdmin);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.auth2Factors !== "disabled" || (ctx_r2.user == null ? null : ctx_r2.user.user == null ? null : ctx_r2.user.user.userData == null ? null : ctx_r2.user.user.userData.SysAdmin));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.auth2Factors !== "disabled" || (ctx_r2.user == null ? null : ctx_r2.user.user == null ? null : ctx_r2.user.user.userData == null ? null : ctx_r2.user.user.userData.SysAdmin));
  }
}
function mat_option_288_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_size_r16 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", font_size_r16);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_size_r16);
  }
}
function mat_option_291_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_size_r17 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", font_size_r17);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_size_r17);
  }
}
function mat_option_294_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_size_r18 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", font_size_r18);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_size_r18);
  }
}
let OPCloudOrganizationSettingsComponent_org = /*#__PURE__*/(() => {
  class OPCloudOrganizationSettingsComponent_org {
    constructor(oplService, user, orgService, _dialog) {
      this.oplService = oplService;
      this.user = user;
      this.orgService = orgService;
      this._dialog = _dialog;
      this.settingsForOrg = true;
      this.selectedOrg = this.user.user.userData.organization;
      this.font_sizes_options = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32];
      this.tutorialMode = defaultTutorialMode;
      this.maxUsersEnabled = defaultMaxUsersEnabled;
      this.OntologyTypes = OntologyEnforcementLevel;
      this.isMongo = environment.serverSideAuth; // hide some part if it is mongo
      this.defaultUserOptions = {
        executionUser: false,
        dsmUser: false,
        viewer: false,
        insightsUser: false,
        genAIUser: false
      };
    }
    ngOnInit() {
      let user;
      if (this.user.user) {
        user = this.user.user.userData;
      }
      if (user.SysAdmin) {
        this.organizations$ = this.orgService.getOrganizations();
        this.orgService.getOrganizations().subscribe(data => {
          if (data.length > 0) {
            // Show current organization first, then others
            const currentOrgName = user.organization;
            const currentOrgIndex = data.findIndex(org => org.name === currentOrgName);
            if (currentOrgIndex > 0) {
              // Move current org to first position
              const currentOrg = data.splice(currentOrgIndex, 1)[0];
              data.unshift(currentOrg);
            }
            this.selectOrg({
              value: currentOrgName || data[0].name
            });
          }
        });
      } else {
        this.organizations$ = (0, observable_of.of)([{
          id: user._organization,
          name: user.organization
        }]);
        this.selectedOrg = user.organization;
      }
      this.checked = this.oplService.orgOplSettings.SDNames;
      this.logCollectingEnabled = this.oplService.orgOplSettings.logCollectingEnabled;
      this.ignoreUserLogSharingPermission = this.oplService.orgOplSettings.ignoreUserLogSharingPermission;
      this.tutorialMode = this.oplService.orgOplSettings.tutorialMode;
      this.maxUsersEnabled = !!this.oplService.orgOplSettings.maxUsersEnabled;
      this.maxUsersNumber = this.oplService.orgOplSettings.maxUsersNumber;
      this.maxViewUsersNumber = this.oplService.orgOplSettings.maxViewUsersNumber;
      this.auth2Factors = this.oplService.orgOplSettings.auth2Factors;
      this.ontologyEnforcementLevel = this.oplService.orgOplSettings.ontologyEnforcementLevel;
      this.modelReviewAutomaticSyncing = this.oplService.orgOplSettings.modelReviewAutomaticSyncing || "Manual";
      this.modelReviewAutomaticSyncingLocked = this.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked || false;
      this.placeholder = user.OrgAdmin ? user.organization : "Organization";
      document.getElementById("selectOPDName").addEventListener("selection", this.updateOrganizationOPDnames);
      this.style = this.oplService.orgStylingSettings();
      // this.style.object = this.oplService.orgStylingSettings()[0];
      // this.style.process = this.oplService.orgStylingSettings()[1];
      this.setColorInputChangeHandlers();
      this.connection = this.oplService.orgConnectionSettings();
      this.chatEnabled = this.oplService.orgOplSettings.chatEnabled;
      this.archive = this.oplService.orgArchiveSettings();
      this.apiKeyResetTooltip = "This will reset the Organization API Key of Gemini Generative AI";
    }
    selectOrg(event) {
      this.selectedOrg = event.value;
      const thisProcess = this;
      this.orgService.getOrgSDNames(this.selectedOrg).then(SDNamesFlag => {
        thisProcess.checked = SDNamesFlag === undefined || SDNamesFlag === null ? true : SDNamesFlag;
      });
      this.orgService.getOrganization(this.selectedOrg).then(res => {
        thisProcess.loadChosenOrgStyleSettings(res);
        thisProcess.loadChosenOrgConnectionSettings(res);
        thisProcess.updateLogSharingParams(res);
        thisProcess.updateTutorialModeParam(res);
        thisProcess.updateMaxUsersParams(res);
        thisProcess.updateChatEnabledParam(res);
        thisProcess.updateDefaultUserOptions(res);
        thisProcess.auth2Factors = res.auth2Factors || "disabled";
        thisProcess.modelReviewAutomaticSyncing = res.modelReviewAutomaticSyncing || "Manual";
        thisProcess.modelReviewAutomaticSyncingLocked = res.modelReviewAutomaticSyncingLocked || false;
      });
    }
    updateChatEnabledParam(res) {
      if (!res) {
        return;
      }
      this.chatEnabled = res.chatEnabled === undefined || res.chatEnabled === null ? true : res.chatEnabled;
      this.oplService.orgOplSettings.chatEnabled = this.chatEnabled;
    }
    updateDefaultUserOptions(res) {
      if (!res || !res.defaultUserOptions) {
        return;
      }
      this.defaultUserOptions = res.defaultUserOptions;
    }
    updateMaxUsersParams(res) {
      if (!res) {
        return;
      }
      const keys = Object.keys(res);
      this.maxUsersEnabled = !!res.maxUsersEnabled;
      this.oplService.orgOplSettings.maxUsersEnabled = this.maxUsersEnabled;
      if (keys.includes("maxUsersNumber")) {
        this.maxUsersNumber = res.maxUsersNumber;
        this.oplService.orgOplSettings.maxUsersNumber = this.maxUsersNumber;
      }
      if (keys.includes("maxViewUsersNumber")) {
        this.maxViewUsersNumber = res.maxViewUsersNumber;
        this.oplService.orgOplSettings.maxViewUsersNumber = this.maxViewUsersNumber;
      }
    }
    updateLogSharingParams(res) {
      if (!res) {
        return;
      }
      const keys = Object.keys(res);
      if (keys.includes("logCollectingEnabled")) {
        this.logCollectingEnabled = res.logCollectingEnabled;
        this.oplService.orgOplSettings.logCollectingEnabled = this.logCollectingEnabled;
      }
      if (keys.includes("ignoreUserLogSharingPermission")) {
        this.ignoreUserLogSharingPermission = res.ignoreUserLogSharingPermission;
        this.oplService.orgOplSettings.ignoreUserLogSharingPermission = this.ignoreUserLogSharingPermission;
      }
    }
    updateTutorialModeParam(res) {
      if (!res) {
        return;
      }
      const keys = Object.keys(res);
      if (keys.includes("tutorialMode")) {
        this.tutorialMode = res.tutorialMode;
        this.oplService.orgOplSettings.tutorialMode = this.tutorialMode;
      }
    }
    /**
     * receives: selected organization details
     * updates current process seen style according to the selected organization
     * */
    loadChosenOrgStyleSettings(res) {
      const thisProcess = this;
      let resAtKey;
      if (res) {
        // get object style settings
        Object.keys(thisProcess.style.object).forEach(function (key) {
          // if the organization data is undefined, update according to default settings
          resAtKey = !res.style || !res.style.object || res.style.object[key] === undefined ? defaultObjectStyleSettings[key] : res.style.object[key];
          thisProcess.style.object[key] = resAtKey;
        });
        // get process style settings
        Object.keys(thisProcess.style.process).forEach(function (key) {
          // if the organization data is undefined, update according to default settings
          resAtKey = !res.style || !res.style.process || res.style.process[key] === undefined ? defaultProcessStyleSettings[key] : res.style.process[key];
          thisProcess.style.process[key] = resAtKey;
        });
        // get state style settings
        Object.keys(thisProcess.style.state).forEach(function (key) {
          // if the organization data is undefined, update according to default settings
          resAtKey = !res.style || !res.style.state || res.style.state[key] === undefined ? defaultStateStyleSettings[key] : res.style.state[key];
          thisProcess.style.state[key] = resAtKey;
        });
      }
    }
    /**
     * receives: selected organization details
     * updates current process seen connection settings according to the selected organization
     * */
    loadChosenOrgConnectionSettings(res) {
      const thisProcess = this;
      if (res) {
        thisProcess.connection.allow_users = res.connection && res.connection.allow_users !== undefined ? res.connection.allow_users : defaultAllowUsersConnectionSettings;
        const options = ["ros", "mqtt", "mysql", "graphdb", "calculationsServer"];
        thisProcess.connection.ros = this.oplService.getRosConnectionDefaultSettings();
        thisProcess.connection.mqtt = this.oplService.getMqttConnectionDefaultSettings();
        thisProcess.connection.mysql = this.oplService.getMySQLConnectionDefaultSettings();
        thisProcess.connection.graphdb = this.oplService.getGraphDBConnectionDefaultSettings();
        thisProcess.connection.calculationsServer = this.oplService.getComputingServerConnectionDefaultSettings();
        for (const opt of options) {
          Object.keys(thisProcess.connection[opt]).forEach(function (key) {
            // if the organization data is undefined, keep default settings
            thisProcess.connection[opt][key] = !res.connection || !res.connection[opt] || res.connection[opt][key] === undefined ? thisProcess.connection[opt][key] : res.connection[opt][key];
          });
        }
      }
    }
    updateOrganizationOPDnames(event) {
      this.checked = event.value;
      this.orgService.SDNamesUpdateForOrg(this.selectedOrg, this.checked).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        // update the current organization style settings
        this.oplService.orgOplSettings.SDNames = this.checked;
        this.oplService.updateDefaultSettings();
      }
    }
    updateLogCollectionFlag(event) {
      this.orgService.updateLogCollectionFlagForOrg(this.selectedOrg, this.logCollectingEnabled).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        // update the current organization style settings
        this.oplService.orgOplSettings.logCollectingEnabled = this.logCollectingEnabled;
        this.oplService.updateDefaultSettings();
      }
    }
    updateIgnoreUserLogSharingPermissionFlag(event) {
      this.orgService.updateIgnoreUserLogSharingPermissionFlagForOrg(this.selectedOrg, this.ignoreUserLogSharingPermission).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        // update the current organization style settings
        this.oplService.orgOplSettings.ignoreUserLogSharingPermission = this.ignoreUserLogSharingPermission;
        this.oplService.updateDefaultSettings();
      }
    }
    /** Enable/disable chat throughout the org according to settings
     * params: selectChatEnabled toggle event
     */
    updateOrganizationChatEnabled(event) {
      this.chatEnabled = event.value;
      this.orgService.chatEnabledUpdateForOrg(this.selectedOrg, this.chatEnabled).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        // update the current organization chat settings
        this.oplService.orgOplSettings.chatEnabled = this.chatEnabled;
        this.oplService.updateDefaultSettings();
      }
    }
    updateOrganizationModelReviewAutomaticSyncing(event) {
      this.modelReviewAutomaticSyncing = event.value;
      this.orgService.modelReviewAutomaticSyncingUpdateForOrg(this.selectedOrg, this.modelReviewAutomaticSyncing).then(_ => {
        (0, validationAlert)("Saved", null, "Success");
        if (this.selectedOrg === this.user.user.userData.organization) {
          this.oplService.orgOplSettings.modelReviewAutomaticSyncing = this.modelReviewAutomaticSyncing;
          this.oplService.updateDefaultSettings();
          // Sync check will pick up new settings on next interval (30 seconds)
        }
      });
    }
    updateOrganizationModelReviewAutomaticSyncingLocked(event) {
      const newValue = event.checked;
      const oldValue = this.modelReviewAutomaticSyncingLocked;
      // Optimistically update UI
      this.modelReviewAutomaticSyncingLocked = newValue;
      this.orgService.modelReviewAutomaticSyncingLockedUpdateForOrg(this.selectedOrg, newValue).then(_ => {
        (0, validationAlert)("Saved", null, "Success");
        if (this.selectedOrg === this.user.user.userData.organization) {
          this.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked = newValue;
          this.oplService.updateDefaultSettings();
        }
        // Reload organization settings to ensure we have the latest value
        this.orgService.getOrganization(this.selectedOrg).then(res => {
          this.modelReviewAutomaticSyncingLocked = res.modelReviewAutomaticSyncingLocked || false;
        });
      }).catch(err => {
        // Revert on error
        this.modelReviewAutomaticSyncingLocked = oldValue;
        (0, validationAlert)("Failed to save", 3000, "Error");
      });
    }
    /** updates the organization object style settings according to the new chosen font.**/
    updateObjectFont() {
      const thisProcess = this;
      const settings = {
        object: {
          font: this.style.object.font
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update current organization style settings
          thisProcess.oplService.orgOplSettings.style.object.font = thisProcess.style.object.font;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization process style settings according to the new chosen font.**/
    updateProcessFont() {
      const thisProcess = this;
      const settings = {
        process: {
          font: this.style.process.font
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update current organization style settings
          thisProcess.oplService.orgOplSettings.style.process.font = thisProcess.style.process.font;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    updateStateFont() {
      const thisProcess = this;
      const settings = {
        state: {
          font: this.style.state.font
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update current organization style settings
          thisProcess.oplService.orgOplSettings.style.state.font = thisProcess.style.state.font;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization object style settings according to the new chosen font size.**/
    updateObjectFontSize() {
      const thisProcess = this;
      const settings = {
        object: {
          font_size: this.style.object.font_size
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update current organization style settings
          thisProcess.oplService.orgOplSettings.style.object.font_size = thisProcess.style.object.font_size;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization process style settings according to the new chosen font size.**/
    updateProcessFontSize() {
      const thisProcess = this;
      const settings = {
        process: {
          font_size: this.style.process.font_size
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.process.font_size = this.style.process.font_size;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    updateStateFontSize() {
      const thisProcess = this;
      const settings = {
        state: {
          font_size: this.style.state.font_size
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.state.font_size = this.style.state.font_size;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization object style settings according to the new chosen fill color.**/
    updateObjectFillColor(value) {
      this.style.object.fill_color = value;
      const thisProcess = this;
      const settings = {
        object: {
          fill_color: thisProcess.style.object.fill_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.object.fill_color = thisProcess.style.object.fill_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization process style settings according to the new chosen fill color.**/
    updateProcessFillColor(value) {
      this.style.process.fill_color = value;
      const thisProcess = this;
      const settings = {
        process: {
          fill_color: thisProcess.style.process.fill_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.process.fill_color = thisProcess.style.process.fill_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    updateStateFillColor(value) {
      this.style.state.fill_color = value;
      const thisProcess = this;
      const settings = {
        state: {
          fill_color: thisProcess.style.state.fill_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.state.fill_color = thisProcess.style.state.fill_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization object style settings according to the new chosen text color.**/
    updateObjectTextColor(value) {
      this.style.object.text_color = value;
      const thisProcess = this;
      const settings = {
        object: {
          text_color: thisProcess.style.object.text_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.object.text_color = thisProcess.style.object.text_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization process style settings according to the new chosen text color.**/
    updateProcessTextColor(value) {
      this.style.process.text_color = value;
      const thisProcess = this;
      const settings = {
        process: {
          text_color: thisProcess.style.process.text_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.process.text_color = thisProcess.style.process.text_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    updateStateTextColor(value) {
      this.style.state.text_color = value;
      const thisProcess = this;
      const settings = {
        state: {
          text_color: thisProcess.style.state.text_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.state.text_color = thisProcess.style.state.text_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization object style settings according to the new chosen border color.**/
    updateObjectBorderColor(value) {
      this.style.object.border_color = value;
      const thisProcess = this;
      const settings = {
        process: {
          border_color: thisProcess.style.object.border_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.object.border_color = thisProcess.style.object.border_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /** updates the organization process style settings according to the new chosen border color.**/
    updateProcessBorderColor(value) {
      this.style.process.border_color = value;
      const thisProcess = this;
      const settings = {
        process: {
          border_color: thisProcess.style.process.border_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.process.border_color = thisProcess.style.process.border_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    updateStateBorderColor(value) {
      this.style.state.border_color = value;
      const thisProcess = this;
      const settings = {
        state: {
          border_color: thisProcess.style.state.border_color
        }
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style settings
          thisProcess.oplService.orgOplSettings.style.state.border_color = thisProcess.style.state.border_color;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /**
     * updating handlers for input with type color
     */
    setColorInputChangeHandlers() {
      const thisProc = this;
      const object_fill_color = document.getElementById("object_fill_color_input");
      object_fill_color.addEventListener("change", function () {
        thisProc.updateObjectFillColor(this.value);
      });
      const process_fill_color = document.getElementById("process_fill_color_input");
      process_fill_color.addEventListener("change", function () {
        thisProc.updateProcessFillColor(this.value);
      });
      const state_fill_color = document.getElementById("state_fill_color_input");
      state_fill_color.addEventListener("change", function () {
        thisProc.updateStateFillColor(this.value);
      });
      const object_text_color = document.getElementById("object_text_color_input");
      object_text_color.addEventListener("change", function () {
        thisProc.updateObjectTextColor(this.value);
      });
      const process_text_color = document.getElementById("process_text_color_input");
      process_text_color.addEventListener("change", function () {
        thisProc.updateProcessTextColor(this.value);
      });
      const state_text_color = document.getElementById("state_text_color_input");
      state_text_color.addEventListener("change", function () {
        thisProc.updateStateTextColor(this.value);
      });
      const object_border_color = document.getElementById("object_border_color_input");
      object_border_color.addEventListener("change", function () {
        thisProc.updateObjectBorderColor(this.value);
      });
      const process_border_color = document.getElementById("process_border_color_input");
      process_border_color.addEventListener("change", function () {
        thisProc.updateProcessBorderColor(this.value);
      });
      const state_border_color = document.getElementById("state_border_color_input");
      state_border_color.addEventListener("change", function () {
        thisProc.updateStateBorderColor(this.value);
      });
    }
    ReturnToDefault() {
      const thisProcess = this;
      this.checked = true; // TODO: should be according to current default settings.
      this.chatEnabled = true; // Chat is enabled by default
      this.style.process = defaultProcessStyleSettings;
      this.style.object = defaultObjectStyleSettings;
      this.style.state = defaultStateStyleSettings;
      this.connection.ros = defaultRosConnectionSettings;
      this.connection.mqtt = defaultMqttConnectionSettings;
      this.connection.mysql = defaultMySQLConnectionSettings;
      this.connection.python = defaultPythonConnectionSettings;
      this.connection.graphdb = defaultGraphDBConnectionSettings;
      this.connection.calculationsServer = defaultCalculationsServerSettings;
      this.orgService.updateOrganization(this.selectedOrg, {
        style: this.style,
        SDNames: this.checked,
        chatEnabled: this.chatEnabled,
        connection: this.connection
      }).then(_ => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization style and connection settings
          thisProcess.oplService.orgOplSettings.style = thisProcess.style;
          thisProcess.oplService.orgOplSettings.connection = thisProcess.connection;
        }
        (0, validationAlert)("Returned to default settings", null, "Success");
      });
    }
    /**
     * updates the organization Computing Server URL according to the choice
     **/
    updateComputingServerURL(event) {
      const newValue = event.target.value;
      const prev_url = this.connection.calculationsServer.computingServerURL;
      if (this.isValidURL(newValue)) {
        this.connection.calculationsServer.computingServerURL = newValue;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.calculationsServer.computingServerURL = thisProcess.connection.calculationsServer.computingServerURL;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        const message = "The enhanced calculation server URL is not valid. Please check the protocol,\ndomain name, which can include letters, digits, dots, and hyphens \n domain extension that must be between 2 and 6 characters\nor optional path segments allowed characters.";
        (0, validationAlert)(message);
        document.getElementById("server-Python-input").value = prev_url;
      }
    }
    /**
     * validates the legality of the url
     * */
    isValidURL(url) {
      const regex = /^(https?:\/\/)?((([a-zA-Z\d-]+\.)*[a-zA-Z\d-]+|localhost)|((\d{1,3}\.){3}\d{1,3}))(:\d{1,5})?(\/[^\s]*)?$/;
      return regex.test(url);
    }
    /**
     * updates the organization if to use the Computing Server Target according to the choice
     **/
    onChangeLocalServerCheckbox($event) {
      const newValue = $event.checked;
      this.connection.calculationsServer.computingServerCalculations = newValue;
      const thisProcess = this;
      const settings = {
        connection: this.connection
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
          // update the current organization connection settings
          thisProcess.oplService.orgOplSettings.connection.calculationsServer.computingServerCalculations = thisProcess.connection.calculationsServer.computingServerCalculations;
        }
        (0, validationAlert)("saved", null, "Success");
      });
    }
    /**
     * updates the user GraphDB API according to the choice.
     **/
    updateGraphDBAPI(event) {
      const prev_hostname = this.connection.graphdb.graphdb_api;
      const new_hostname = event.target.value;
      if (this.hostnameIsValid(new_hostname)) {
        this.connection.graphdb.graphdb_api = new_hostname;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.graphdb.graphdb_api = thisProcess.connection.graphdb.graphdb_api;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("GraphDB API should be a string!");
        document.getElementById("graphdb-api").value = prev_hostname;
      }
    }
    /**
     * updates the GraphDB username according to the choice.
     **/
    updateGraphDBUsername(event) {
      const prev_username = this.connection.graphdb.username;
      const new_username = event.target.value;
      if (this.usernameIsValid(new_username)) {
        this.connection.graphdb.username = new_username;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.graphdb.username = thisProcess.connection.graphdb.username;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Username should not be a null value ");
        document.getElementById("graphdb-user").value = prev_username;
      }
    }
    /**
     * updates the user GraphDB password according to the choice.
     **/
    updateGraphDBPassword(event) {
      const prev_password = this.connection.graphdb.password;
      const new_password = event.target.value;
      if (this.passwordIsValid(new_password)) {
        this.connection.graphdb.password = new_password;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.graphdb.password = thisProcess.connection.graphdb.password;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Password should not be a null value");
        document.getElementById("graphdb-password").value = prev_password;
      }
    }
    /**
     * updates the organization ros server according to the choice
     **/
    updatePythonServer(event) {
      const new_server = event.target.value;
      const prev_server = this.connection.python.server;
      const check_server_validity = this.serverIsValid(new_server);
      if (check_server_validity.isValid) {
        this.connection.python.server = new_server;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.python.server = thisProcess.connection.python.server;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        const message = "Server can contain only numbers, dots and english letters, \n or to be in a format of an IP address." + (check_server_validity.illegal_char !== undefined ? "\n The character " + check_server_validity.illegal_char + " cannot be used." : "");
        (0, validationAlert)(message);
        document.getElementById("server-Python-input").value = prev_server;
      }
    }
    /**
     * updates the organization ros port according to the choice
     **/
    updatePythonPort(event) {
      const prev_port = this.connection.python.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.python.port = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.python.port = thisProcess.connection.python.port;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-Python-input").value = prev_port;
      }
    }
    /**
     * updates the user Mysql port according to the choice
     **/
    updateMySQLPort(event) {
      const prev_port = this.connection.mysql.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.mysql.port = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.port = thisProcess.connection.mysql.port;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-MySQL-input").value = prev_port;
      }
    }
    /**
     * updates the user mysql hostname according to the choice.
     **/
    updateMySQLHostname(event) {
      const prev_hostname = this.connection.mysql.hostname;
      const new_hostname = event.target.value;
      if (this.hostnameIsValid(new_hostname)) {
        this.connection.mysql.hostname = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.hostname = thisProcess.connection.mysql.hostname;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Hostname should be a string!");
        document.getElementById("hostname-MySQL-input").value = prev_hostname;
      }
    }
    /**
     * updates the user mysql username according to the choice.
     **/
    updateMySQLUsername(event) {
      const prev_username = this.connection.mysql.username;
      const new_username = event.target.value;
      if (this.usernameIsValid(new_username)) {
        this.connection.mysql.username = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.username = thisProcess.connection.mysql.username;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Username should not be a null value ");
        document.getElementById("username-MySQL-input").value = prev_username;
      }
    }
    /**
     * updates the user mysql password according to the choice.
     **/
    updateMySQLPassword(event) {
      const prev_password = this.connection.mysql.password;
      const new_password = event.target.value;
      if (this.passwordIsValid(new_password)) {
        this.connection.mysql.password = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.password = thisProcess.connection.mysql.password;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Password should not be a null value");
        document.getElementById("password-MySQL-input").value = prev_password;
      }
    }
    /**
     * updates the mysql Schema according to the choice.
     **/
    updateMySQLSchema(event) {
      const prev_Schema = this.connection.mysql.schema;
      const new_Schema = event.target.value;
      if (this.hostnameIsValid(new_Schema)) {
        this.connection.mysql.schema = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.schema = thisProcess.connection.mysql.schema;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Schema should be a string!");
        document.getElementById("schema-input").value = prev_Schema;
      }
    }
    /**
     * updates the user mysql hostname according to the choice.
     **/
    updateWSHostname(event) {
      const prev_WS_hostname = this.connection.mysql.ws_hostname;
      const new_WS_hostname = event.target.value;
      if (this.hostnameIsValid(new_WS_hostname)) {
        this.connection.mysql.ws_hostname = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.ws_hostname = thisProcess.connection.mysql.ws_hostname;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Hostname should be a string!");
        document.getElementById("hostname-WS-input").value = prev_WS_hostname;
      }
    }
    /**
     * updates the user ros port according to the choice
     **/
    updateWSPort(event) {
      const prev_WS_port = this.connection.mysql.ws_port;
      const new_WS_port = event.target.value;
      if (this.portIsValid(new_WS_port)) {
        this.connection.mysql.ws_port = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mysql.ws_port = thisProcess.connection.mysql.ws_port;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-WS-input").value = prev_WS_port;
      }
    }
    /**
     * validates the legality of the new_hostname: should be a string
     * */
    hostnameIsValid(new_hostname) {
      return typeof new_hostname === "string";
    }
    /**
     * validates the legality of the new_username: should not be a null value.
     * */
    usernameIsValid(new_username) {
      return true;
    }
    /**
     * validates the legality of the new_username: should not be a null value.
     * */
    passwordIsValid(new_password) {
      return true;
    }
    /**
     * updates the organization ros server according to the choice
     **/
    updateRosServer(event) {
      const new_server = event.target.value;
      const prev_server = this.connection.ros.server;
      const check_server_validity = this.serverIsValid(new_server);
      if (check_server_validity.isValid) {
        this.connection.ros.server = new_server;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.ros.server = thisProcess.connection.ros.server;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        const message = "Server can contain only numbers, dots and english letters, \n or to be in a format of an IP address." + (check_server_validity.illegal_char !== undefined ? "\n The character " + check_server_validity.illegal_char + " cannot be used." : "");
        (0, validationAlert)(message);
        document.getElementById("server-Ros-input").value = prev_server;
      }
    }
    /**
     * updates the organization ros port according to the choice
     **/
    updateRosPort(event) {
      const prev_port = this.connection.ros.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.ros.port = event.target.value;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.ros.port = thisProcess.connection.ros.port;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-Ros-input").value = prev_port;
      }
    }
    /**
     * updates the organization mqtt server according to the choice
     **/
    updateMqttServer(event) {
      const new_server = event.target.value;
      const prev_server = this.connection.mqtt.server;
      const check_server_validity = this.serverIsValid(new_server);
      if (check_server_validity.isValid) {
        this.connection.mqtt.server = new_server;
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mqtt.server = thisProcess.connection.mqtt.server;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        const message = "Server can contain only numbers, dots and english letters, \n or to be in a format of an IP address." + (check_server_validity.illegal_char !== undefined ? "\n The character " + check_server_validity.illegal_char + " cannot be used." : "");
        (0, validationAlert)(message);
        document.getElementById("server-Mqtt-input").value = prev_server;
      }
    }
    /**
     * updates the organization mqtt port according to the choice
     **/
    updateMqttPort(event) {
      const prev_port = this.connection.mqtt.port;
      const new_port = event.target.value;
      this.connection.mqtt.port = new_port;
      if (this.portIsValid(new_port)) {
        const thisProcess = this;
        const settings = {
          connection: this.connection
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            // update the current organization connection settings
            thisProcess.oplService.orgOplSettings.connection.mqtt.port = thisProcess.connection.mqtt.port;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-Mqtt-input").value = prev_port;
      }
    }
    /**
     * validates the legality of the new_port: should be a number or an empty string
     * */
    portIsValid(new_port) {
      return !isNaN(new_port);
    }
    /**
     * validates the legality of the new_server: should not include certain characters
     * */
    serverIsValid(new_server) {
      const legal_chars_regex = new RegExp("[^a-zA-Z0-9.]", "i");
      const is_legal_chars = new_server.search(legal_chars_regex);
      return {
        isValid: is_legal_chars === -1,
        illegal_char: is_legal_chars === -1 ? undefined : new_server[is_legal_chars]
      };
    }
    /**
     * updates the organization field for enabling/disabling users to edit their own connection settings
     **/
    updateAllowUsers(event) {
      this.connection.allow_users = !event.checked;
      const settings = {
        connection: this.connection
      };
      this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
        if (this.selectedOrg === this.user.user.userData.organization) {
          // update the current organization connection settings
          this.oplService.orgOplSettings.connection.allow_users = this.connection.allow_users;
        }
      });
    }
    /**
     * updates the organization field for automatic archive interval settings
     **/
    updateArchiveInterval(event) {
      const prev_archiev_interval = this.archive.days_interval;
      const new_archiev_interval = event.target.value;
      this.archive.days_interval = new_archiev_interval;
      if (/^\d+$/.test(new_archiev_interval)) {
        const thisProcess = this;
        const settings = {
          archive: {
            days_interval: this.archive.days_interval
          }
        };
        this.orgService.updateOrganization(this.selectedOrg, settings).then(() => {
          if (thisProcess.selectedOrg === thisProcess.user.user.userData.organization) {
            thisProcess.oplService.orgOplSettings.archive.days_interval = thisProcess.archive.days_interval;
          }
          (0, validationAlert)("saved", null, "Success");
        });
      } else {
        (0, validationAlert)("Archive interval should be a number or empty");
        document.getElementById("archive-timeinterval-input").value = String(prev_archiev_interval);
      }
    }
    updateOrganizationTutorialMode($event) {
      const value = $event.value;
      this.orgService.tutorialModeUpdateForOrg(this.selectedOrg, value).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        // update the current organization style settings
        this.oplService.orgOplSettings.tutorialMode = value;
        this.oplService.updateDefaultSettings();
      }
    }
    updateMaxUsersEnabled($event) {
      console.log(this.maxUsersEnabled);
      this.oplService.orgOplSettings.maxUsersEnabled = this.maxUsersEnabled;
      this.orgService.maxUsersEnabledUpdateForOrg(this.selectedOrg, this.maxUsersEnabled).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        this.oplService.orgOplSettings.maxUsersEnabled = this.maxUsersEnabled;
      }
      if (this.maxUsersEnabled && !this.maxUsersNumber) {
        this.maxUsersNumber = 10;
        this.updateMaxUsersNumber();
      }
      if (this.maxUsersEnabled && !this.maxViewUsersNumber) {
        this.maxViewUsersNumber = 1;
        this.updateMaxViewUsersNumber();
      }
    }
    updateMaxUsersNumber() {
      if (isNaN(Number(this.maxUsersNumber))) {
        return;
      }
      this.oplService.orgOplSettings.maxUsersNumber = this.maxUsersNumber;
      this.orgService.maxUsersNumberUpdateForOrg(this.selectedOrg, this.maxUsersNumber).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        this.oplService.orgOplSettings.maxUsersNumber = this.maxUsersNumber;
      }
    }
    updateOrgGenAIAPIKey(apiKey) {
      if (!apiKey) {
        (0, validationAlert)("API Key can not be empty", null, "Error");
        return;
      }
      this.orgService.updateOrgGenAIAPIKey(this.selectedOrg, apiKey).then(_ => (0, validationAlert)("API Key Update for " + this.selectedOrg + " Finished Successfully", 4, "Success"));
    }
    resetOrgAPIKey() {
      const confirmDialog = this._dialog.open(ConfirmDialogDialogComponent, {
        height: "210px",
        width: "400px",
        data: {
          message: "Warning: This will reset the Organization API Key of Gemini Generative AI.\n\nAre you sure?",
          closeFlag: false
        }
      });
      confirmDialog.afterClosed().subscribe(data => {
        if (data) {
          this.orgService.resetOrgGenAIAPIKey(this.selectedOrg).then(_ => (0, validationAlert)("Reset of the Organization API Key of " + this.selectedOrg + " Finished Successfully", 4, "Success"));
        }
      });
      return;
    }
    updateMaxViewUsersNumber() {
      if (isNaN(Number(this.maxViewUsersNumber))) {
        return;
      }
      this.oplService.orgOplSettings.maxEditUsersNumber = this.maxViewUsersNumber;
      this.orgService.maxViewUsersNumberUpdateForOrg(this.selectedOrg, this.maxViewUsersNumber).then(_ => (0, validationAlert)("Saved", null, "Success"));
      if (this.selectedOrg === this.user.user.userData.organization) {
        this.oplService.orgOplSettings.maxEditUsersNumber = this.maxViewUsersNumber;
      }
    }
    updateOntologyEnforcement() {
      if (this.selectedOrg === this.user.user.userData.organization) {
        this.oplService.orgOplSettings.ontologyEnforcementLevel = this.ontologyEnforcementLevel;
      }
      this.orgService.ontologyEnforcementLevelUpdateForOrg(this.selectedOrg, this.ontologyEnforcementLevel).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateOrgAuth2Factors($event) {
      if (this.selectedOrg === this.user.user.userData.organization) {
        this.oplService.orgOplSettings.auth2Factors = this.auth2Factors;
      }
      this.orgService.auth2FactorsUpdateForOrg(this.selectedOrg, this.auth2Factors).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    toggleDefaultUserOption(val) {
      this.defaultUserOptions[val] = !this.defaultUserOptions[val];
      this.onDefaultUserOption();
    }
    onDefaultUserOption() {
      this.orgService.updateDefaultUserOptions(this.selectedOrg, this.defaultUserOptions).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    onDefaultUserOptionSelection($event) {
      $event.stopPropagation();
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OPCloudOrganizationSettingsComponent_org)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OPCloudOrganizationSettingsComponent_org,
      selectors: [["OPCloud-Organization-Settings"]],
      decls: 444,
      vars: 65,
      consts: [["ApiKey", ""], ["selector", ""], ["class", "OPCloudOrganizationSettingsComponent", "id", "OPCloudOrganizationSettingsHeaderContainer", 4, "ngIf"], [1, "OPCloudOrganizationSettingsComponent_org"], [1, "opc-selection", 2, "left", "90px", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value"], [1, "opc-selection", 2, "left", "26px", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "selectOPDName", 1, "opc-selection", 2, "left", "105px", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "selectModelReviewAutomaticSyncing", 1, "opc-selection", 2, "left", "26px", 3, "ngModelChange", "selectionChange", "ngModel", "disabled"], ["value", "Automatic"], ["value", "Manual"], ["value", "Disabled"], [4, "ngIf"], ["style", "margin-bottom: 25px;width:500px", 4, "ngIf"], ["style", "width:100%", "id", "containerTable", "class", "containerTable", 4, "ngIf"], ["id", "selectTutorialMode", 1, "opc-selection", 2, "left", "95px", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "selectChatEnabled", 1, "opc-selection", 2, "left", "102px", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "connectionsContainer"], ["id", "ConnectionSettingsHeader"], [2, "margin-top", "20px"], [1, "connection-tr"], ["appearance", "outline", 1, "connection-settings"], ["matInput", "", "id", "ApiKey", "autocomplete", "new-password", "type", "password", "placeholder", "Your API Key", "value", ""], ["mat-button", "", 1, "updateButtonOrg", 3, "click"], ["mat-button", "", 1, "updateButtonOrg", 3, "click", "matTooltip"], ["matInput", "", "id", "server-Python-input", 3, "change", "value"], ["matInput", "", "id", "port-Python-input", 3, "change", "value"], ["matInput", "", "id", "hostname-MySQL-input", 3, "change", "value"], ["matInput", "", "id", "port-MySQL-input", 3, "change", "value"], ["matInput", "", "id", "username-MySQL-input", 3, "change", "value"], ["type", "password", "matInput", "", "id", "password-MySQL-input", 3, "change", "value"], ["matInput", "", "id", "schema-input", 3, "change", "value"], ["matInput", "", "id", "hostname-WS-input", 3, "change", "value"], ["matInput", "", "id", "port-WS-input", 3, "change", "value"], ["matInput", "", "id", "server-Ros-input", 3, "change", "value"], ["matInput", "", "id", "port-Ros-input", 3, "change", "value"], ["matInput", "", "id", "server-Mqtt-input", 3, "change", "value"], ["matInput", "", "id", "port-Mqtt-input", 3, "change", "value"], [2, "padding-top", "15px"], [2, "margin-top", "15px", "color", "#1A3763"], ["hideIcon", "true", 3, "change", "checked"], ["matInput", "", 3, "change", "value"], [2, "margin-top", "15px"], ["matInput", "", "id", "graphdb-api", 3, "change", "value"], ["matInput", "", "id", "graphdb-user", 3, "change", "value"], ["type", "password", "matInput", "", "id", "graphdb-password", 3, "change", "value"], ["id", "allow_users", 2, "color", "#1A3763 !important", 3, "change", "checked"], ["id", "ArchiveSettings"], [1, "archive-tr"], ["appearance", "outline", 1, "archive-settings"], ["matInput", "", "id", "archive-timeinterval-input", 3, "change", "value", "disabled"], ["id", "StyleSettingsHeader"], [2, "width", "100px"], [2, "width", "200px"], ["id", "ObjectFontSize"], [1, "style-selection", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["id", "object_font"], ["value", "Arial", 1, "fonts", 2, "font-family", "Arial, Helvetica, sans-serif"], ["value", "Bookman", 1, "fonts", 2, "font-family", "'Bookman Old Style' ,Arial, Helvetica, sans-serif"], ["value", "Comic Sans MS", 1, "fonts", 2, "font-family", "'Comic Sans MS' ,Arial, Helvetica, sans-serif"], ["value", "Cambria", 1, "fonts", 2, "font-family", "Cambria ,Arial, Helvetica, sans-serif"], ["value", "Courier", 1, "fonts", 2, "font-family", "Courier ,Arial, Helvetica, sans-serif"], ["value", "Courier New", 1, "fonts", 2, "font-family", "'Courier New' ,Arial, Helvetica, sans-serif"], ["value", "Garamond", 1, "fonts", 2, "font-family", "Garamond ,Arial, Helvetica, sans-serif"], ["value", "Georgia", 1, "fonts", 2, "font-family", "Georgia ,Arial, Helvetica, sans-serif"], ["value", "Helvetica", 1, "fonts", 2, "font-family", "Helvetica, Arial, sans-serif"], ["value", "Palatino", 1, "fonts", 2, "font-family", "Palatino ,Arial, Helvetica, sans-serif"], ["value", "sans-serif", 1, "fonts", 2, "font-family", "sans-serif ,Arial, Helvetica, sans-serif"], ["value", "serif", 1, "fonts", 2, "font-family", "Serif ,Arial, Helvetica, sans-serif"], ["value", "Times", 1, "fonts", 2, "font-family", "Times ,Arial, Helvetica, sans-serif"], ["value", "Times New Roman", 1, "fonts", 2, "font-family", "'Times New Roman' ,Arial, Helvetica, sans-serif"], ["value", "Trebuchet MS", 1, "fonts", 2, "font-family", "'Trebuchet MS' ,Arial, Helvetica, sans-serif"], ["value", "Verdana", 1, "fonts", 2, "font-family", "Verdana ,Arial, Helvetica, sans-serif"], ["id", "object_text_color"], ["for", "object_text_color"], ["name", "object_text_color", "type", "color", "id", "object_text_color_input", 3, "value"], ["for", "process_text_color"], ["name", "process_text_color", "type", "color", "id", "process_text_color_input", 3, "value"], ["for", "state_text_color"], ["name", "state_text_color", "type", "color", "id", "state_text_color_input", 3, "value"], ["id", "object_fill_Color"], ["for", "object_fill_Color"], ["name", "object_fill_Color", "type", "color", "id", "object_fill_color_input", 3, "value"], ["for", "process_fill_Color"], ["name", "process_fill_Color", "type", "color", "id", "process_fill_color_input", 3, "value"], ["for", "state_fill_Color"], ["name", "state_fill_Color", "type", "color", "id", "state_fill_color_input", 3, "value"], ["id", "object_border_color"], ["for", "object_border_color"], ["name", "object_border_color", "type", "color", "id", "object_border_color_input", 3, "value"], ["for", "process_border_color"], ["name", "process_border_color", "type", "color", "id", "process_border_color_input", 3, "value"], ["for", "state_border_color"], ["name", "state_border_color", "type", "color", "id", "state_border_color_input", 3, "value"], ["mat-raised-button", "", "id", "rtnDfltBTNorg", 3, "click"], ["id", "OPCloudOrganizationSettingsHeaderContainer", 1, "OPCloudOrganizationSettingsComponent"], ["id", "chooseOrganization"], ["id", "mat-select-class-OPCloud-organization-settings", 3, "selectionChange", "placeholder", "value"], ["label", "Select Organization"], ["id", "lockModelReviewAutomaticSyncing", 2, "color", "#1A3763 !important", 3, "change", "checked"], ["id", "ontology", 1, "opc-selection", 2, "left", "60px", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "selectMaxUsers", 1, "opc-selection", 2, "left", "122px", 3, "ngModelChange", "selectionChange", "ngModel"], ["style", "margin-left: 45px;", 4, "ngIf"], ["appearance", "outline", "class", "connection-settings", "style", "margin-left: 5px;", 4, "ngIf"], ["mat-button", "", "class", "updateButtonOrg", 3, "click", 4, "ngIf"], ["appearance", "outline", "class", "connection-settings", 4, "ngIf"], [2, "margin-left", "45px"], ["appearance", "outline", 1, "connection-settings", 2, "margin-left", "5px"], ["matInput", "", "id", "maxUsersNumber", "type", "number", 3, "ngModelChange", "ngModel"], ["matInput", "", "id", "maxViewUsersNumber", "type", "number", 3, "ngModelChange", "ngModel"], [2, "margin-bottom", "25px", "width", "500px"], ["id", "containerTable", 1, "containerTable", 2, "width", "100%"], [1, "opcloudSettingsTR"], [1, "opcloudSettingsTD", 2, "width", "200px"], ["id", "bringOptions"], [1, "opcloudSettingsTD"], [2, "width", "472px", "padding-left", "0"], [2, "display", "flex", "align-items", "center", "height", "60px", "top", "20px", "position", "relative", "margin-left", "10px", "color", "#586D8C"], ["id", "opc-selection-multi", 1, "opc-selection-multi"], [3, "click"], [3, "click", "change", "ngModelChange", "ngModel"], [1, "optionMargin"], ["id", "selectAuth2Factors", 1, "opc-selection", 2, "left", "90px", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value", 4, "ngIf"]],
      template: function Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵtemplate */.DNE(0, div_0_Template, 9, 5, "div", 2);
          core /* ɵɵelement */.nrm(1, "br")(2, "br");
          core /* ɵɵelementStart */.j41(3, "div", 3)(4, "h1");
          core /* ɵɵtext */.EFF(5, "Client Logs Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "span");
          core /* ɵɵtext */.EFF(7, "Log Collection");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(8, "\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(9, "mat-select", 4);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_9_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.logCollectingEnabled, $event)) {
              ctx.logCollectingEnabled = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_9_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateLogCollectionFlag($event));
          });
          core /* ɵɵelementStart */.j41(10, "mat-option", 5);
          core /* ɵɵtext */.EFF(11, "Enabled");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "mat-option", 5);
          core /* ɵɵtext */.EFF(13, "Disabled");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(14, "br");
          core /* ɵɵelementStart */.j41(15, "span");
          core /* ɵɵtext */.EFF(16, "Mandatory Log Sharing");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(17, "\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(18, "mat-select", 6);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_18_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.ignoreUserLogSharingPermission, $event)) {
              ctx.ignoreUserLogSharingPermission = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_18_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateIgnoreUserLogSharingPermissionFlag($event));
          });
          core /* ɵɵelementStart */.j41(19, "mat-option", 5);
          core /* ɵɵtext */.EFF(20, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "mat-option", 5);
          core /* ɵɵtext */.EFF(22, "False");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(23, "br")(24, "br")(25, "br");
          core /* ɵɵelementStart */.j41(26, "h1");
          core /* ɵɵtext */.EFF(27, "OPD Tree Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "span");
          core /* ɵɵtext */.EFF(29, "OPD names");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(30, "\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(31, "mat-select", 7);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_31_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.checked, $event)) {
              ctx.checked = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_31_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateOrganizationOPDnames($event));
          });
          core /* ɵɵelementStart */.j41(32, "mat-option", 5);
          core /* ɵɵtext */.EFF(33, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "mat-option", 5);
          core /* ɵɵtext */.EFF(35, "Hide");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(36, "br")(37, "br")(38, "br");
          core /* ɵɵelementStart */.j41(39, "h1");
          core /* ɵɵtext */.EFF(40, "Model Review Automatic Syncing");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(41, "span");
          core /* ɵɵtext */.EFF(42, "Model Review Automatic Syncing");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(43, "\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(44, "mat-select", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_44_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.modelReviewAutomaticSyncing, $event)) {
              ctx.modelReviewAutomaticSyncing = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_44_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateOrganizationModelReviewAutomaticSyncing($event));
          });
          core /* ɵɵelementStart */.j41(45, "mat-option", 9);
          core /* ɵɵtext */.EFF(46, "Automatic");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(47, "mat-option", 10);
          core /* ɵɵtext */.EFF(48, "Manual");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(49, "mat-option", 11);
          core /* ɵɵtext */.EFF(50, "Disabled");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(51, "br");
          core /* ɵɵtemplate */.DNE(52, span_52_Template, 3, 1, "span", 12);
          core /* ɵɵelement */.nrm(53, "br")(54, "br")(55, "br");
          core /* ɵɵtemplate */.DNE(56, span_56_Template, 13, 4, "span", 12);
          core /* ɵɵelement */.nrm(57, "br")(58, "br")(59, "br");
          core /* ɵɵtemplate */.DNE(60, span_60_Template, 22, 9, "span", 12)(61, h1_61_Template, 2, 0, "h1", 13)(62, table_62_Template, 31, 5, "table", 14)(63, span_63_Template, 12, 4, "span", 12);
          core /* ɵɵelementStart */.j41(64, "h1");
          core /* ɵɵtext */.EFF(65, "Tutorial Mode");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(66, "span");
          core /* ɵɵtext */.EFF(67, "Tutorial Mode");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(68, "\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(69, "mat-select", 15);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_69_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.tutorialMode, $event)) {
              ctx.tutorialMode = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_69_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateOrganizationTutorialMode($event));
          });
          core /* ɵɵelementStart */.j41(70, "mat-option", 5);
          core /* ɵɵtext */.EFF(71, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(72, "mat-option", 5);
          core /* ɵɵtext */.EFF(73, "Hide");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(74, "br")(75, "br")(76, "br");
          core /* ɵɵelementStart */.j41(77, "h1");
          core /* ɵɵtext */.EFF(78, "Org Chat Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(79, "span");
          core /* ɵɵtext */.EFF(80, "Models Chat");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(81, "\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(82, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_82_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.chatEnabled, $event)) {
              ctx.chatEnabled = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_82_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateOrganizationChatEnabled($event));
          });
          core /* ɵɵelementStart */.j41(83, "mat-option", 5);
          core /* ɵɵtext */.EFF(84, "Enabled");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(85, "mat-option", 5);
          core /* ɵɵtext */.EFF(86, "Disabled");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(87, "br")(88, "br")(89, "br");
          core /* ɵɵelementStart */.j41(90, "span", 17)(91, "h1", 18);
          core /* ɵɵtext */.EFF(92, "External Connections Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(93, "table", 19)(94, "thead")(95, "th");
          core /* ɵɵtext */.EFF(96, "Gemini Generative AI");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(97, "tbody")(98, "tr", 20)(99, "td");
          core /* ɵɵtext */.EFF(100, "API key ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(101, "td")(102, "mat-form-field", 21);
          core /* ɵɵelement */.nrm(103, "input", 22, 0);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(105, "td")(106, "button", 23);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_106_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const ApiKey_r15 = core /* ɵɵreference */.sdS(104);
            return core /* ɵɵresetView */.Njj(ctx.updateOrgGenAIAPIKey(ApiKey_r15.value));
          });
          core /* ɵɵtext */.EFF(107, "Update");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(108, "td")(109, "button", 24);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_109_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.resetOrgAPIKey());
          });
          core /* ɵɵtext */.EFF(110, "Reset Key");
          core /* ɵɵelementEnd */.k0s()()()()();
          core /* ɵɵelementStart */.j41(111, "table")(112, "thead")(113, "th");
          core /* ɵɵtext */.EFF(114, "Python");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(115, "tbody")(116, "tr", 20)(117, "td");
          core /* ɵɵtext */.EFF(118, "Server ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(119, "td")(120, "mat-form-field", 21)(121, "input", 25);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_121_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updatePythonServer($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(122, "tr", 20)(123, "td");
          core /* ɵɵtext */.EFF(124, "Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(125, "td")(126, "mat-form-field", 21)(127, "input", 26);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_127_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updatePythonPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(128, "table")(129, "thead")(130, "th");
          core /* ɵɵtext */.EFF(131, "MySQL Connection");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(132, "tbody")(133, "tr", 20)(134, "td");
          core /* ɵɵtext */.EFF(135, "MySQL Hostname ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(136, "td")(137, "mat-form-field", 21)(138, "input", 27);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_138_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLHostname($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(139, "tr", 20)(140, "td");
          core /* ɵɵtext */.EFF(141, "MySQL Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(142, "td")(143, "mat-form-field", 21)(144, "input", 28);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_144_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(145, "tr", 20)(146, "td");
          core /* ɵɵtext */.EFF(147, "MySQL Username ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(148, "td")(149, "mat-form-field", 21)(150, "input", 29);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_150_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLUsername($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(151, "tr", 20)(152, "td");
          core /* ɵɵtext */.EFF(153, "MySQL Password ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(154, "td")(155, "mat-form-field", 21)(156, "input", 30);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_156_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLPassword($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(157, "tr", 20)(158, "td");
          core /* ɵɵtext */.EFF(159, " Schema ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(160, "td")(161, "mat-form-field", 21)(162, "input", 31);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_162_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLSchema($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(163, "tr", 20)(164, "td");
          core /* ɵɵtext */.EFF(165, "WS Hostname ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(166, "td")(167, "mat-form-field", 21)(168, "input", 32);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_168_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateWSHostname($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(169, "tr", 20)(170, "td");
          core /* ɵɵtext */.EFF(171, "WS Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(172, "td")(173, "mat-form-field", 21)(174, "input", 33);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_174_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateWSPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(175, "table")(176, "thead")(177, "th");
          core /* ɵɵtext */.EFF(178, "ROS");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(179, "tbody")(180, "tr", 20)(181, "td");
          core /* ɵɵtext */.EFF(182, "Server ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(183, "td")(184, "mat-form-field", 21)(185, "input", 34);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_185_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateRosServer($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(186, "tr", 20)(187, "td");
          core /* ɵɵtext */.EFF(188, "Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(189, "td")(190, "mat-form-field", 21)(191, "input", 35);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_191_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateRosPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(192, "table")(193, "thead")(194, "th");
          core /* ɵɵtext */.EFF(195, "MQTT");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(196, "tbody")(197, "tr", 20)(198, "td");
          core /* ɵɵtext */.EFF(199, "Server ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(200, "td")(201, "mat-form-field", 21)(202, "input", 36);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_202_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMqttServer($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(203, "tr", 20)(204, "td");
          core /* ɵɵtext */.EFF(205, "Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(206, "td")(207, "mat-form-field", 21)(208, "input", 37);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_208_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMqttPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(209, "table", 19)(210, "thead")(211, "th");
          core /* ɵɵtext */.EFF(212, "Enhanced Computing Calculation Server");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(213, "tbody")(214, "tr", 20)(215, "td", 38);
          core /* ɵɵtext */.EFF(216, "Calculations Target ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(217, "td", 38)(218, "span", 39)(219, "mat-slide-toggle", 40);
          core /* ɵɵlistener */.bIt("change", function Template_mat_slide_toggle_change_219_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onChangeLocalServerCheckbox($event));
          });
          core /* ɵɵtext */.EFF(220);
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(221, "tr", 20)(222, "td");
          core /* ɵɵtext */.EFF(223, "URL ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(224, "td")(225, "mat-form-field", 21)(226, "input", 41);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_226_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateComputingServerURL($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(227, "table", 42)(228, "thead")(229, "th");
          core /* ɵɵtext */.EFF(230, "GraphDB Connection");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(231, "tbody")(232, "tr", 20)(233, "td");
          core /* ɵɵtext */.EFF(234, "GraphDB API ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(235, "td")(236, "mat-form-field", 21)(237, "input", 43);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_237_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateGraphDBAPI($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(238, "tr", 20)(239, "td");
          core /* ɵɵtext */.EFF(240, "GraphDB User ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(241, "td")(242, "mat-form-field", 21)(243, "input", 44);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_243_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateGraphDBUsername($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(244, "tr", 20)(245, "td");
          core /* ɵɵtext */.EFF(246, "GraphDB Password ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(247, "td")(248, "mat-form-field", 21)(249, "input", 45);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_249_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateGraphDBPassword($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(250, "mat-checkbox", 46);
          core /* ɵɵlistener */.bIt("change", function Template_mat_checkbox_change_250_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateAllowUsers($event));
          });
          core /* ɵɵtext */.EFF(251, " Disable users connection editing ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(252, "br")(253, "br");
          core /* ɵɵelementStart */.j41(254, "h1", 47);
          core /* ɵɵtext */.EFF(255, "Archive Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(256, "table")(257, "tbody")(258, "tr", 48)(259, "td");
          core /* ɵɵtext */.EFF(260, "Time interval from last edit date");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(261, "td")(262, "mat-form-field", 49)(263, "input", 50);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_263_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateArchiveInterval($event));
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(264, "td");
          core /* ɵɵtext */.EFF(265, "days");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(266, "br")(267, "br");
          core /* ɵɵelementStart */.j41(268, "h1", 51);
          core /* ɵɵtext */.EFF(269, "Style Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(270, "table")(271, "thead")(272, "tr")(273, "th", 52);
          core /* ɵɵtext */.EFF(274, "Categories");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(275, "th", 53);
          core /* ɵɵtext */.EFF(276, " Object Style Settings ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(277, "th", 53);
          core /* ɵɵtext */.EFF(278, " Process Style Settings ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(279, "th", 53);
          core /* ɵɵtext */.EFF(280, " State Style Settings ");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(281, "tbody")(282, "tr")(283, "td", 53)(284, "label", 54);
          core /* ɵɵtext */.EFF(285, "Font size");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(286, "td")(287, "mat-select", 55);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_287_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.object.font_size, $event)) {
              ctx.style.object.font_size = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_287_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateObjectFontSize());
          });
          core /* ɵɵtemplate */.DNE(288, mat_option_288_Template, 2, 2, "mat-option", 56);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(289, "td")(290, "mat-select", 55);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_290_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.process.font_size, $event)) {
              ctx.style.process.font_size = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_290_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateProcessFontSize());
          });
          core /* ɵɵtemplate */.DNE(291, mat_option_291_Template, 2, 2, "mat-option", 56);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(292, "td")(293, "mat-select", 55);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_293_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.state.font_size, $event)) {
              ctx.style.state.font_size = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_293_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateStateFontSize());
          });
          core /* ɵɵtemplate */.DNE(294, mat_option_294_Template, 2, 2, "mat-option", 56);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(295, "tr")(296, "td", 53)(297, "label", 57);
          core /* ɵɵtext */.EFF(298, "Font");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(299, "td")(300, "mat-select", 55);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_300_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.object.font, $event)) {
              ctx.style.object.font = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_300_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateObjectFont());
          });
          core /* ɵɵelementStart */.j41(301, "mat-option", 58);
          core /* ɵɵtext */.EFF(302, "Arial");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(303, "mat-option", 59);
          core /* ɵɵtext */.EFF(304, "Bookman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(305, "mat-option", 60);
          core /* ɵɵtext */.EFF(306, "Comic Sans MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(307, "mat-option", 61);
          core /* ɵɵtext */.EFF(308, "Cambria");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(309, "mat-option", 62);
          core /* ɵɵtext */.EFF(310, "Courier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(311, "mat-option", 63);
          core /* ɵɵtext */.EFF(312, "Courier New");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(313, "mat-option", 64);
          core /* ɵɵtext */.EFF(314, "Garamond");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(315, "mat-option", 65);
          core /* ɵɵtext */.EFF(316, "Georgia");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(317, "mat-option", 66);
          core /* ɵɵtext */.EFF(318, "Helvetica");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(319, "mat-option", 67);
          core /* ɵɵtext */.EFF(320, "Palatino");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(321, "mat-option", 68);
          core /* ɵɵtext */.EFF(322, "sans-serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(323, "mat-option", 69);
          core /* ɵɵtext */.EFF(324, "serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(325, "mat-option", 70);
          core /* ɵɵtext */.EFF(326, "Times");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(327, "mat-option", 71);
          core /* ɵɵtext */.EFF(328, "Times New Roman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(329, "mat-option", 72);
          core /* ɵɵtext */.EFF(330, "Trebuchet MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(331, "mat-option", 73);
          core /* ɵɵtext */.EFF(332, "Verdana");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(333, "td")(334, "mat-select", 55);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_334_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.process.font, $event)) {
              ctx.style.process.font = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_334_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateProcessFont());
          });
          core /* ɵɵelementStart */.j41(335, "mat-option", 58);
          core /* ɵɵtext */.EFF(336, "Arial");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(337, "mat-option", 59);
          core /* ɵɵtext */.EFF(338, "Bookman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(339, "mat-option", 60);
          core /* ɵɵtext */.EFF(340, "Comic Sans MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(341, "mat-option", 61);
          core /* ɵɵtext */.EFF(342, "Cambria");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(343, "mat-option", 62);
          core /* ɵɵtext */.EFF(344, "Courier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(345, "mat-option", 63);
          core /* ɵɵtext */.EFF(346, "Courier New");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(347, "mat-option", 64);
          core /* ɵɵtext */.EFF(348, "Garamond");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(349, "mat-option", 65);
          core /* ɵɵtext */.EFF(350, "Georgia");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(351, "mat-option", 66);
          core /* ɵɵtext */.EFF(352, "Helvetica");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(353, "mat-option", 67);
          core /* ɵɵtext */.EFF(354, "Palatino");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(355, "mat-option", 68);
          core /* ɵɵtext */.EFF(356, "sans-serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(357, "mat-option", 69);
          core /* ɵɵtext */.EFF(358, "serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(359, "mat-option", 70);
          core /* ɵɵtext */.EFF(360, "Times");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(361, "mat-option", 71);
          core /* ɵɵtext */.EFF(362, "Times New Roman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(363, "mat-option", 72);
          core /* ɵɵtext */.EFF(364, "Trebuchet MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(365, "mat-option", 73);
          core /* ɵɵtext */.EFF(366, "Verdana");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(367, "td")(368, "mat-select", 55);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_mat_select_ngModelChange_368_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.state.font, $event)) {
              ctx.style.state.font = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function Template_mat_select_selectionChange_368_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateStateFont());
          });
          core /* ɵɵelementStart */.j41(369, "mat-option", 58);
          core /* ɵɵtext */.EFF(370, "Arial");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(371, "mat-option", 59);
          core /* ɵɵtext */.EFF(372, "Bookman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(373, "mat-option", 60);
          core /* ɵɵtext */.EFF(374, "Comic Sans MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(375, "mat-option", 61);
          core /* ɵɵtext */.EFF(376, "Cambria");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(377, "mat-option", 62);
          core /* ɵɵtext */.EFF(378, "Courier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(379, "mat-option", 63);
          core /* ɵɵtext */.EFF(380, "Courier New");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(381, "mat-option", 64);
          core /* ɵɵtext */.EFF(382, "Garamond");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(383, "mat-option", 65);
          core /* ɵɵtext */.EFF(384, "Georgia");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(385, "mat-option", 66);
          core /* ɵɵtext */.EFF(386, "Helvetica");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(387, "mat-option", 67);
          core /* ɵɵtext */.EFF(388, "Palatino");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(389, "mat-option", 68);
          core /* ɵɵtext */.EFF(390, "sans-serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(391, "mat-option", 69);
          core /* ɵɵtext */.EFF(392, "serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(393, "mat-option", 70);
          core /* ɵɵtext */.EFF(394, "Times");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(395, "mat-option", 71);
          core /* ɵɵtext */.EFF(396, "Times New Roman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(397, "mat-option", 72);
          core /* ɵɵtext */.EFF(398, "Trebuchet MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(399, "mat-option", 73);
          core /* ɵɵtext */.EFF(400, "Verdana");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(401, "tr")(402, "td", 53)(403, "label", 74);
          core /* ɵɵtext */.EFF(404, "Text Color");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(405, "td")(406, "label", 75);
          core /* ɵɵelement */.nrm(407, "input", 76);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(408, "td")(409, "label", 77);
          core /* ɵɵelement */.nrm(410, "input", 78);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(411, "td")(412, "label", 79);
          core /* ɵɵelement */.nrm(413, "input", 80);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(414, "tr")(415, "td", 53)(416, "label", 81);
          core /* ɵɵtext */.EFF(417, "Fill Color");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(418, "td")(419, "label", 82);
          core /* ɵɵelement */.nrm(420, "input", 83);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(421, "td")(422, "label", 84);
          core /* ɵɵelement */.nrm(423, "input", 85);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(424, "td")(425, "label", 86);
          core /* ɵɵelement */.nrm(426, "input", 87);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(427, "tr")(428, "td", 53)(429, "label", 88);
          core /* ɵɵtext */.EFF(430, "Border Color");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(431, "td")(432, "label", 89);
          core /* ɵɵelement */.nrm(433, "input", 90);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(434, "td")(435, "label", 91);
          core /* ɵɵelement */.nrm(436, "input", 92);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(437, "td")(438, "label", 93);
          core /* ɵɵelement */.nrm(439, "input", 94);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(440, "br")(441, "br");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(442, "button", 95);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_442_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.ReturnToDefault());
          });
          core /* ɵɵtext */.EFF(443, "Reset to default");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngIf", ctx.settingsForOrg);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.logCollectingEnabled);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.ignoreUserLogSharingPermission);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.checked);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.modelReviewAutomaticSyncing);
          core /* ɵɵproperty */.Y8G("disabled", ctx.modelReviewAutomaticSyncingLocked);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("ngIf", (ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.SysAdmin) || (ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.OrgAdmin));
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", (ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.SysAdmin) || (ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.OrgAdmin));
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.SysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.SysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.SysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", (ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.SysAdmin) || (ctx.user == null ? null : ctx.user.user == null ? null : ctx.user.user.userData == null ? null : ctx.user.user.userData.OrgAdmin) && ctx.auth2Factors !== "disabled");
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.tutorialMode);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.chatEnabled);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(24);
          core /* ɵɵproperty */.Y8G("matTooltip", ctx.apiKeyResetTooltip);
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.python.server);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.python.port);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.hostname);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.port);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.username);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.password);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.schema);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.ws_hostname);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.ws_port);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.ros.server);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.ros.port);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mqtt.server);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mqtt.port);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("checked", ctx.connection.calculationsServer.computingServerCalculations);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.connection.calculationsServer.computingServerCalculations ? "Server Calculations" : "Local Browser Calculations");
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.calculationsServer.computingServerURL);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.graphdb.graphdb_api);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.graphdb.username);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.graphdb.password);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("checked", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(13);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.archive.days_interval);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(24);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.object.font_size);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.font_sizes_options);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.process.font_size);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.font_sizes_options);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.state.font_size);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.font_sizes_options);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.object.font);
          core /* ɵɵadvance */.R7$(34);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.process.font);
          core /* ɵɵadvance */.R7$(34);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.state.font);
          core /* ɵɵadvance */.R7$(39);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.object.text_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.process.text_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.state.text_color);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.object.fill_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.process.fill_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.state.fill_color);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.object.border_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.process.border_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.state.border_color);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatSelect, MatOption, MatOptgroup, MatButton, MatCheckbox, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgModel, MatSlideToggle, AsyncPipe],
      styles: ["#OPCloudOrganizationSettingsHeaderContainer[_ngcontent-%COMP%]{position:relative;top:50px;padding-left:50px;color:#1a3763}.updateButtonOrg[_ngcontent-%COMP%]{margin-left:5px!important;text-align:center!important;background:#1a3763!important;border:1px solid rgba(0,0,0,.1)!important;box-sizing:border-box!important;box-shadow:0 2px 4px #0000001f!important;border-radius:6px!important;color:#fff!important;letter-spacing:normal!important;font-weight:400!important}.OPCloudOrganizationSettingsComponent_org[_ngcontent-%COMP%]{position:relative;top:50px;padding-left:50px;font-weight:500;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;line-height:normal;font-size:16px;color:#1a3763}h1[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;margin-bottom:60px;color:#1a3763}.h2[_ngcontent-%COMP%]{position:relative;left:21px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;color:#1a3763;margin-bottom:45px}#OPCloudOrganizationSettingsComponent_org[_ngcontent-%COMP%]{margin-bottom:45px}span[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;margin-bottom:60px;color:#1a3763}.connection-settings[_ngcontent-%COMP%]{background-color:#fff;color:#586d8c!important;font-family:Roboto,Helvetica Neue,sans-serif;height:100%;--mdc-outlined-text-field-outline-color:rgba(0, 0, 0, .15) !important}.connection-settings[_ngcontent-%COMP%]   .mdc-text-field__input[_ngcontent-%COMP%]{color:#586d8c!important}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{padding-top:0;margin-top:0;padding-bottom:0;margin-bottom:0;border-radius:initial}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]{border-top:1em;padding-left:12px!important}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]   .mat-mdc-input-element[_ngcontent-%COMP%]{color:#586d8c!important}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-appearance-outline[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{margin:0}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.mat-mdc-select-value[_ngcontent-%COMP%]{color:#586d8c;padding-left:8px}.mat-mdc-option-text[_ngcontent-%COMP%]{color:#1a3763}.style-selection[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.2);padding-left:8px;width:190px;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:43px;font-size:16px;background-color:#fff;color:#586d8c!important;height:46px}.style-selection[_ngcontent-%COMP%]   .mat-mdc-select-arrow[_ngcontent-%COMP%]{color:transparent;width:24px;height:9px;content:url(/assets/SVG/arrow.svg)}.style-selection[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]{border-top:1em}.style-selection[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]   .mat-mdc-input-element[_ngcontent-%COMP%]{color:#586d8c!important}#rtnDfltBTNorg[_ngcontent-%COMP%]{position:relative;left:240px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal}[_nghost-%COMP%]   #connectionsContainer[_ngcontent-%COMP%]   .mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763}.archive-settings[_ngcontent-%COMP%]{background-color:#fff!important;color:#586d8c!important;height:100%!important}.archive-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{padding-top:0!important;margin-top:0!important;padding-bottom:0!important;margin-bottom:0!important;border-radius:initial!important}.archive-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]{border-top:1em!important}.archive-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-appearance-outline[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{margin:0!important}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.optionMargin[_ngcontent-%COMP%]{margin-left:5px}"]
    }))();
  }
  return OPCloudOrganizationSettingsComponent_org;
})();