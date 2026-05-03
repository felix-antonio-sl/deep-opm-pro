// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function NewModelByWizardComponentComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "span", 17)(2, "p", 18);
    core /* ɵɵtext */.EFF(3, "Hello and welcome to the new model wizard!");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵtext */.EFF(5, " If you are new to OPM, this wizard will help you to start modeling a new system.");
    core /* ɵɵelement */.nrm(6, "br");
    core /* ɵɵtext */.EFF(7, " Just follow the steps as we proceed. ");
    core /* ɵɵelementStart */.j41(8, "p", 19);
    core /* ɵɵtext */.EFF(9, "Let's get started!");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function NewModelByWizardComponentComponent_div_8_div_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 25);
    core /* ɵɵtext */.EFF(1, " During the wizard-assisted modeling, ");
    core /* ɵɵelement */.nrm(2, "br");
    core /* ɵɵtext */.EFF(3, " hovering over a bold term provides more information. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 20)(1, "div", 21);
    core /* ɵɵtext */.EFF(2, " The first diagram provides a bird’s eye view of the system’s function and expected value to the beneficiary.");
    core /* ɵɵelement */.nrm(3, "br");
    core /* ɵɵtext */.EFF(4, " The green squares represent objects, the blue ellipses represent processes and there are links\xA0that connect them. ");
    core /* ɵɵelementStart */.j41(5, "div")(6, "p", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_8_Template_p_mouseenter_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showHoverDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_8_Template_p_mouseleave_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showHoverDiv = false);
    });
    core /* ɵɵtext */.EFF(7, "Hover Here");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(8, NewModelByWizardComponentComponent_div_8_div_8_Template, 4, 0, "div", 23);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(9, "img", 24);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showHoverDiv);
  }
}
function NewModelByWizardComponentComponent_div_9_div_15_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 32);
    core /* ɵɵtext */.EFF(1, " In OPM all the processes shall end with ");
    core /* ɵɵelementStart */.j41(2, "span", 18);
    core /* ɵɵtext */.EFF(3, "\"ing\"");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, " suffix");
    core /* ɵɵelement */.nrm(5, "br");
    core /* ɵɵtext */.EFF(6, " because they are representing series of actions ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 26)(1, "div")(2, "div", 27);
    core /* ɵɵtext */.EFF(3, " The first thing we want to do is to determine the benefit expected to be gained from the system.");
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵtext */.EFF(5, " Please write the name of the main process which provides the benefit. ");
    core /* ɵɵelement */.nrm(6, "br");
    core /* ɵɵtext */.EFF(7, " It should end with a verb in the gerund form, i.e., end with ");
    core /* ɵɵelementStart */.j41(8, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_9_Template_span_mouseenter_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showIngDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_9_Template_span_mouseleave_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showIngDiv = false);
    });
    core /* ɵɵtext */.EFF(9, "“ing”");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(10, ". ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "mat-form-field", 28)(12, "mat-label");
    core /* ɵɵtext */.EFF(13, "What is the main process of the system?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_9_Template_input_ngModelChange_14_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.mainFunctionality, $event)) {
        ctx_r1.formParams.mainFunctionality = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(15, NewModelByWizardComponentComponent_div_9_div_15_Template, 7, 0, "div", 30);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(16, "img", 31);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(14);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.mainFunctionality);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showIngDiv);
  }
}
function NewModelByWizardComponentComponent_div_10_div_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 39);
    core /* ɵɵtext */.EFF(1, "A stakeholder\xA0is an individual, a group of people, or an organization,");
    core /* ɵɵelement */.nrm(2, "br");
    core /* ɵɵtext */.EFF(3, " that has an interest in, or might be affected by, a system");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 33)(1, "div")(2, "div", 34);
    core /* ɵɵtext */.EFF(3, " A beneficiary\xA0is a ");
    core /* ɵɵelementStart */.j41(4, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_10_Template_span_mouseenter_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showStakeholderDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_10_Template_span_mouseleave_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showStakeholderDiv = false);
    });
    core /* ɵɵtext */.EFF(5, "stakeholder");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(6, " who extracts value and benefits from the system.");
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(8, NewModelByWizardComponentComponent_div_10_div_8_Template, 4, 0, "div", 35);
    core /* ɵɵelementStart */.j41(9, "mat-form-field", 36)(10, "mat-label");
    core /* ɵɵtext */.EFF(11, "Who is the beneficiary of the system?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_10_Template_input_ngModelChange_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.beneficiaryGroup, $event)) {
        ctx_r1.formParams.beneficiaryGroup = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(13, "div", 37);
    core /* ɵɵtext */.EFF(14, " *Note: An OPM object must be singular. To express plural, for inanimate objects use the suffix Set, and for humans use Group.");
    core /* ɵɵelement */.nrm(15, "br")(16, "br");
    core /* ɵɵtext */.EFF(17, " The beneficiary group has an attribute that will be defined in the next stage... ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(18, "img", 38);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showStakeholderDiv);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.beneficiaryGroup);
  }
}
function NewModelByWizardComponentComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 33)(1, "div")(2, "div", 40);
    core /* ɵɵtext */.EFF(3, " The beneficiary attribute is an attribute that describes how the beneficiary group benefits from the system. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "mat-form-field", 36)(5, "mat-label");
    core /* ɵɵtext */.EFF(6, "What is the beneficiary attribute of the system?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_11_Template_input_ngModelChange_7_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.beneficiary, $event)) {
        ctx_r1.formParams.beneficiary = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(8, "div", 37);
    core /* ɵɵtext */.EFF(9, " The Main Process changes the Beneficiary Attribute from its input (current) state (short-term) to its output (desired) state (long-term).");
    core /* ɵɵelement */.nrm(10, "br");
    core /* ɵɵtext */.EFF(11, " What is the input state? ");
    core /* ɵɵelementStart */.j41(12, "mat-form-field", 41)(13, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_11_Template_input_ngModelChange_13_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.beneficiaryState1, $event)) {
        ctx_r1.formParams.beneficiaryState1 = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(14, "br");
    core /* ɵɵtext */.EFF(15, " And the output state? ");
    core /* ɵɵelementStart */.j41(16, "mat-form-field", 41)(17, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_11_Template_input_ngModelChange_17_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.beneficiaryState2, $event)) {
        ctx_r1.formParams.beneficiaryState2 = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(18, ". ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(19, "img", 38);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.beneficiary);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.beneficiaryState1);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.beneficiaryState2);
  }
}
function NewModelByWizardComponentComponent_div_12_mat_chip_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-chip", 52);
    core /* ɵɵlistener */.bIt("removed", function NewModelByWizardComponentComponent_div_12_mat_chip_21_Template_mat_chip_removed_0_listener() {
      const tag_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeSystemEnablerTag(tag_r8));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementStart */.j41(2, "mat-icon", 53);
    core /* ɵɵtext */.EFF(3, "cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const tag_r8 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tag_r8, " ");
  }
}
function NewModelByWizardComponentComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 42)(1, "div")(2, "div", 43);
    core /* ɵɵtext */.EFF(3, " The agent, is a human or a group of humans who enable the transforming process.");
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵtext */.EFF(5, " The agent may or may not be the same person or group as the Beneficiary. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "div");
    core /* ɵɵtext */.EFF(7, " Is the beneficiary of the system also the system agent? ");
    core /* ɵɵelementStart */.j41(8, "mat-form-field", 44)(9, "mat-label");
    core /* ɵɵtext */.EFF(10, "Select");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "mat-select", 45);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_12_Template_mat_select_ngModelChange_11_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.isMainBeneficiaryAlsoHandler, $event)) {
        ctx_r1.formParams.isMainBeneficiaryAlsoHandler = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(12, "mat-option", 46);
    core /* ɵɵtext */.EFF(13, "Yes");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "mat-option", 46);
    core /* ɵɵtext */.EFF(15, "No");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(16, "mat-form-field", 47)(17, "mat-label");
    core /* ɵɵtext */.EFF(18, "If there are more enablers write them here");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(19, "mat-chip-grid", 48, 0);
    core /* ɵɵtemplate */.DNE(21, NewModelByWizardComponentComponent_div_12_mat_chip_21_Template, 4, 1, "mat-chip", 49);
    core /* ɵɵelementStart */.j41(22, "input", 50);
    core /* ɵɵlistener */.bIt("matChipInputTokenEnd", function NewModelByWizardComponentComponent_div_12_Template_input_matChipInputTokenEnd_22_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.addSystemEnablerTag($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(23, "div", 51);
    core /* ɵɵtext */.EFF(24, " *The wizard is limited to only 3 handlers, separated by \"Enter\". ");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const chipList_r9 = core /* ɵɵreference */.sdS(20);
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(11);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.isMainBeneficiaryAlsoHandler);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", true);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", false);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.formParams.systemHandlers);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("formControl", ctx_r1.tagsCtrl)("matChipInputFor", chipList_r9)("matChipInputSeparatorKeyCodes", ctx_r1.separatorKeysCodes);
  }
}
function NewModelByWizardComponentComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "div")(2, "div", 54);
    core /* ɵɵtext */.EFF(3, " The system is the instrument that enables the transforming process to occur.");
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵtext */.EFF(5, " The default system name is the name of the main process (transforming) followed by the word system. Alternatively, you can write your own name. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "mat-form-field", 55)(7, "mat-label");
    core /* ɵɵtext */.EFF(8, "Please write the name of the system");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_13_Template_input_ngModelChange_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.systemName, $event)) {
        ctx_r1.formParams.systemName = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "div", 56);
    core /* ɵɵtext */.EFF(11, " The main process (transforming) is an operation (feature) of the system. ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(12, "img", 57);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.systemName);
  }
}
function NewModelByWizardComponentComponent_div_14_div_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 67);
    core /* ɵɵtext */.EFF(1, " An enabler E of a process P is an object that must exist and be available for P to start,");
    core /* ɵɵelement */.nrm(2, "br");
    core /* ɵɵtext */.EFF(3, " and must remain present throughout the occurrence of P in order for P to terminate normally.");
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵtext */.EFF(5, " E should ultimately remain unaffected by the occurrence of P. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_14_mat_chip_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-chip", 52);
    core /* ɵɵlistener */.bIt("removed", function NewModelByWizardComponentComponent_div_14_mat_chip_15_Template_mat_chip_removed_0_listener() {
      const tag_r13 = core /* ɵɵrestoreView */.eBV(_r12).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeSystemToolTag(tag_r13));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementStart */.j41(2, "mat-icon", 53);
    core /* ɵɵtext */.EFF(3, "cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const tag_r13 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tag_r13, " ");
  }
}
function NewModelByWizardComponentComponent_div_14_mat_option_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-option")(1, "mat-checkbox", 68);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_14_mat_option_30_Template_mat_checkbox_ngModelChange_1_listener($event) {
      const t_r15 = core /* ɵɵrestoreView */.eBV(_r14).$implicit;
      if (!core /* ɵɵtwoWayBindingSet */.DH7(t_r15.isPhysical, $event)) {
        t_r15.isPhysical = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("click", function NewModelByWizardComponentComponent_div_14_mat_option_30_Template_mat_checkbox_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r14);
      return core /* ɵɵresetView */.Njj($event.stopPropagation());
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const t_r15 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", t_r15.isPhysical);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", t_r15.name, " ");
  }
}
function NewModelByWizardComponentComponent_div_14_div_31_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 69);
    core /* ɵɵtext */.EFF(1, " A physical object consists of matter and/or energy. It is tangible in the broad sense. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "div")(2, "div", 58);
    core /* ɵɵtext */.EFF(3, " An instrument is an ");
    core /* ɵɵelementStart */.j41(4, "span", 59);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_14_Template_span_mouseenter_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showToolsHelpDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_14_Template_span_mouseleave_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showToolsHelpDiv = false);
    });
    core /* ɵɵtext */.EFF(5, "enabler");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(6, " of the transforming process.");
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵtext */.EFF(8, " Instruments are needed throughout the duration of the process, but when the process is over, they exist in the same state as they were when the process started. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(9, NewModelByWizardComponentComponent_div_14_div_9_Template, 6, 0, "div", 60);
    core /* ɵɵelementStart */.j41(10, "mat-form-field", 61)(11, "mat-label");
    core /* ɵɵtext */.EFF(12, "What instruments are required for the transforming process?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "mat-chip-grid", 48, 1);
    core /* ɵɵtemplate */.DNE(15, NewModelByWizardComponentComponent_div_14_mat_chip_15_Template, 4, 1, "mat-chip", 49);
    core /* ɵɵelementStart */.j41(16, "input", 62);
    core /* ɵɵlistener */.bIt("matChipInputTokenEnd", function NewModelByWizardComponentComponent_div_14_Template_input_matChipInputTokenEnd_16_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.addSystemToolTag($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(17, "div", 63);
    core /* ɵɵtext */.EFF(18, " *OPM things must be singular. Use “Set” for inanimate things or “Group” for humans.");
    core /* ɵɵelement */.nrm(19, "br");
    core /* ɵɵtext */.EFF(20, " *The wizard is limited to only 3 tools separated by \"Enter\". ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(21, "div");
    core /* ɵɵtext */.EFF(22, " Some of the tools are ");
    core /* ɵɵelementStart */.j41(23, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_14_Template_span_mouseenter_23_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showPhysicalDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_14_Template_span_mouseleave_23_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showPhysicalDiv = false);
    });
    core /* ɵɵtext */.EFF(24, "physical");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(25, ", you can choose them here: ");
    core /* ɵɵelementStart */.j41(26, "mat-form-field", 64)(27, "mat-label");
    core /* ɵɵtext */.EFF(28);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(29, "mat-select");
    core /* ɵɵtemplate */.DNE(30, NewModelByWizardComponentComponent_div_14_mat_option_30_Template, 3, 2, "mat-option", 65);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(31, NewModelByWizardComponentComponent_div_14_div_31_Template, 2, 0, "div", 66);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const chipList2_r16 = core /* ɵɵreference */.sdS(14);
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showToolsHelpDiv);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.formParams.tools);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("formControl", ctx_r1.tagsCtrl2)("matChipInputFor", chipList2_r16)("matChipInputSeparatorKeyCodes", ctx_r1.separatorKeysCodes);
    core /* ɵɵadvance */.R7$(12);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getToolsSelectionLabel());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.formParams.toolsData);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showPhysicalDiv);
  }
}
function NewModelByWizardComponentComponent_div_15_mat_chip_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-chip", 52);
    core /* ɵɵlistener */.bIt("removed", function NewModelByWizardComponentComponent_div_15_mat_chip_9_Template_mat_chip_removed_0_listener() {
      const tag_r19 = core /* ɵɵrestoreView */.eBV(_r18).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeSystemInputTag(tag_r19));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementStart */.j41(2, "mat-icon", 53);
    core /* ɵɵtext */.EFF(3, "cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const tag_r19 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tag_r19, " ");
  }
}
function NewModelByWizardComponentComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "div")(2, "div", 70);
    core /* ɵɵtext */.EFF(3, " Inputs are the objects that the process consumes. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "mat-form-field", 71)(5, "mat-label");
    core /* ɵɵtext */.EFF(6, "What are the inputs of the process?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "mat-chip-grid", 48, 2);
    core /* ɵɵtemplate */.DNE(9, NewModelByWizardComponentComponent_div_15_mat_chip_9_Template, 4, 1, "mat-chip", 49);
    core /* ɵɵelementStart */.j41(10, "input", 72);
    core /* ɵɵlistener */.bIt("matChipInputTokenEnd", function NewModelByWizardComponentComponent_div_15_Template_input_matChipInputTokenEnd_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r17);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.addSystemInputTag($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(11, "div", 73);
    core /* ɵɵtext */.EFF(12, " *The wizard is limited to only 3 inputs separate by \"Enter“.");
    core /* ɵɵelement */.nrm(13, "br");
    core /* ɵɵtext */.EFF(14, " *If there is one input that is affected by the main process, it should be defined later as an output. ");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const chipList3_r20 = core /* ɵɵreference */.sdS(8);
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.formParams.mainInputs);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("formControl", ctx_r1.tagsCtrl3)("matChipInputFor", chipList3_r20)("matChipInputSeparatorKeyCodes", ctx_r1.separatorKeysCodes);
  }
}
function NewModelByWizardComponentComponent_div_16_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 83);
    core /* ɵɵelement */.nrm(1, "img", 84);
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_16_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 83);
    core /* ɵɵelement */.nrm(1, "img", 85);
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_16_div_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 83);
    core /* ɵɵelement */.nrm(1, "img", 86);
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_16_mat_label_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-label");
    core /* ɵɵtext */.EFF(1, "What is the output of the system?");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_16_mat_label_26_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-label");
    core /* ɵɵtext */.EFF(1, "Select the input that is also the main output:");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_16_input_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_16_input_27_Template_input_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.mainOutput, $event)) {
        ctx_r1.formParams.mainOutput = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.mainOutput);
  }
}
function NewModelByWizardComponentComponent_div_16_mat_select_28_mat_option_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 46);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const input_r24 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", input_r24);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(input_r24);
  }
}
function NewModelByWizardComponentComponent_div_16_mat_select_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-select", 77);
    core /* ɵɵlistener */.bIt("selectionChange", function NewModelByWizardComponentComponent_div_16_mat_select_28_Template_mat_select_selectionChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r23);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onInputAsMainOutputSelection($event));
    });
    core /* ɵɵtemplate */.DNE(1, NewModelByWizardComponentComponent_div_16_mat_select_28_mat_option_1_Template, 2, 2, "mat-option", 87);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.formParams.mainInputs);
  }
}
function NewModelByWizardComponentComponent_div_16_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88);
    core /* ɵɵtext */.EFF(1, " The system ");
    core /* ɵɵelementStart */.j41(2, "mat-form-field", 89)(3, "mat-label");
    core /* ɵɵtext */.EFF(4, "Select");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "mat-select", 90);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_16_div_29_Template_mat_select_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r25);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.mainOutputLinkType, $event)) {
        ctx_r1.formParams.mainOutputLinkType = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(6, "mat-option", 91);
    core /* ɵɵtext */.EFF(7, "creates");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "mat-option", 92);
    core /* ɵɵtext */.EFF(9, "affects");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "mat-option", 93);
    core /* ɵɵtext */.EFF(11, "changes");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtext */.EFF(12, " the output. ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.formParams.mainOutputIsInput);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.mainOutputLinkType);
  }
}
function NewModelByWizardComponentComponent_div_16_div_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1, " The original state of the output is ");
    core /* ɵɵelementStart */.j41(2, "mat-form-field", 41)(3, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_16_div_30_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r26);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.mainOutputLinkChangesState1, $event)) {
        ctx_r1.formParams.mainOutputLinkChangesState1 = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵtext */.EFF(5, " and the process changes it to ");
    core /* ɵɵelementStart */.j41(6, "mat-form-field", 41)(7, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_16_div_30_Template_input_ngModelChange_7_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r26);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.formParams.mainOutputLinkChangesState2, $event)) {
        ctx_r1.formParams.mainOutputLinkChangesState2 = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(8, ". ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.mainOutputLinkChangesState1);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.formParams.mainOutputLinkChangesState2);
  }
}
function NewModelByWizardComponentComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "div");
    core /* ɵɵtemplate */.DNE(2, NewModelByWizardComponentComponent_div_16_div_2_Template, 2, 0, "div", 74)(3, NewModelByWizardComponentComponent_div_16_div_3_Template, 2, 0, "div", 74)(4, NewModelByWizardComponentComponent_div_16_div_4_Template, 2, 0, "div", 74);
    core /* ɵɵelementStart */.j41(5, "div", 75);
    core /* ɵɵtext */.EFF(6, " The transforming process ");
    core /* ɵɵelementStart */.j41(7, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_16_Template_span_mouseenter_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showCreatesDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_16_Template_span_mouseleave_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showCreatesDiv = false);
    });
    core /* ɵɵtext */.EFF(8, "creates,");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_16_Template_span_mouseenter_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showAffectsDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_16_Template_span_mouseleave_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showAffectsDiv = false);
    });
    core /* ɵɵtext */.EFF(10, " affects");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(11, " or ");
    core /* ɵɵelementStart */.j41(12, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_16_Template_span_mouseenter_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showChangesDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_16_Template_span_mouseleave_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showChangesDiv = false);
    });
    core /* ɵɵtext */.EFF(13, " changes");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(14, " the output of the system. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "mat-form-field", 76)(16, "mat-label");
    core /* ɵɵtext */.EFF(17, "Is the output also an input?");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(18, "mat-select", 77);
    core /* ɵɵlistener */.bIt("selectionChange", function NewModelByWizardComponentComponent_div_16_Template_mat_select_selectionChange_18_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.isMainOutputAlsoInputChange($event));
    });
    core /* ɵɵelementStart */.j41(19, "mat-option", 46);
    core /* ɵɵtext */.EFF(20, "Yes");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(21, "mat-option", 46);
    core /* ɵɵtext */.EFF(22, "No");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(23, "br");
    core /* ɵɵelementStart */.j41(24, "mat-form-field", 78);
    core /* ɵɵtemplate */.DNE(25, NewModelByWizardComponentComponent_div_16_mat_label_25_Template, 2, 0, "mat-label", 79)(26, NewModelByWizardComponentComponent_div_16_mat_label_26_Template, 2, 0, "mat-label", 79)(27, NewModelByWizardComponentComponent_div_16_input_27_Template, 1, 1, "input", 80)(28, NewModelByWizardComponentComponent_div_16_mat_select_28_Template, 2, 1, "mat-select", 81);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(29, NewModelByWizardComponentComponent_div_16_div_29_Template, 13, 2, "div", 82)(30, NewModelByWizardComponentComponent_div_16_div_30_Template, 9, 2, "div", 79);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showCreatesDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showAffectsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showChangesDiv);
    core /* ɵɵadvance */.R7$(15);
    core /* ɵɵproperty */.Y8G("value", true);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", false);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.formParams.mainOutputIsInput);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.formParams.mainOutputIsInput);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.formParams.mainOutputIsInput);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.formParams.mainOutputIsInput);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.formParams.mainOutputIsInput);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.formParams.mainOutputLinkType === "changes");
  }
}
function NewModelByWizardComponentComponent_div_17_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 99);
    core /* ɵɵtext */.EFF(1, " Things that are not part of the system, but interact with it, are referred to as environmental. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_div_17_mat_option_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-option")(1, "mat-checkbox", 68);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function NewModelByWizardComponentComponent_div_17_mat_option_20_Template_mat_checkbox_ngModelChange_1_listener($event) {
      const item_r29 = core /* ɵɵrestoreView */.eBV(_r28).$implicit;
      if (!core /* ɵɵtwoWayBindingSet */.DH7(item_r29.isEnvironmental, $event)) {
        item_r29.isEnvironmental = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("click", function NewModelByWizardComponentComponent_div_17_mat_option_20_Template_mat_checkbox_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r28);
      return core /* ɵɵresetView */.Njj($event.stopPropagation());
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r29 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", item_r29.isEnvironmental);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", item_r29.name, " ");
  }
}
function NewModelByWizardComponentComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "div");
    core /* ɵɵtemplate */.DNE(2, NewModelByWizardComponentComponent_div_17_div_2_Template, 2, 0, "div", 94);
    core /* ɵɵelementStart */.j41(3, "div", 95);
    core /* ɵɵtext */.EFF(4, " Some of the objects may be ");
    core /* ɵɵelementStart */.j41(5, "span", 22);
    core /* ɵɵlistener */.bIt("mouseenter", function NewModelByWizardComponentComponent_div_17_Template_span_mouseenter_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r27);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showEnvironmentalDiv = true);
    })("mouseleave", function NewModelByWizardComponentComponent_div_17_Template_span_mouseleave_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r27);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showEnvironmentalDiv = false);
    });
    core /* ɵɵtext */.EFF(6, "\"environmental\"");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(7, ":");
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵtext */.EFF(9, " They are external to the system. ");
    core /* ɵɵelement */.nrm(10, "br");
    core /* ɵɵtext */.EFF(11, " Electric energy is an example of an environmental object in a “Pizza Making” process. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(12, "br");
    core /* ɵɵelementStart */.j41(13, "div", 96);
    core /* ɵɵtext */.EFF(14, " You can choose the environmental objects from the objects that you created: ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "div")(16, "mat-form-field", 97)(17, "mat-label");
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(19, "mat-select");
    core /* ɵɵtemplate */.DNE(20, NewModelByWizardComponentComponent_div_17_mat_option_20_Template, 3, 2, "mat-option", 65);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelement */.nrm(21, "img", 98);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showEnvironmentalDiv);
    core /* ɵɵadvance */.R7$(16);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getEnvironmentalObjectsSelectionLabel());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.formParams.environmentalObjects);
  }
}
function NewModelByWizardComponentComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 16)(1, "div", 100)(2, "span", 18);
    core /* ɵɵtext */.EFF(3, "You finished all the stages and the model is ready for creation!");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "br")(5, "br");
    core /* ɵɵtext */.EFF(6, " Clicking on \"Take me to the model\" button will close this wizard and generate your model.");
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵtext */.EFF(8, " If you'd like to make any last-minute changes, you can easily navigate back to the relevant page.");
    core /* ɵɵelement */.nrm(9, "br");
    core /* ɵɵtext */.EFF(10, " Be sure to save the new model once you're finished! ");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function NewModelByWizardComponentComponent_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 15);
    core /* ɵɵlistener */.bIt("click", function NewModelByWizardComponentComponent_button_20_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r30);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.previousStage());
    });
    core /* ɵɵtext */.EFF(1, "Previous");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_button_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 15);
    core /* ɵɵlistener */.bIt("click", function NewModelByWizardComponentComponent_button_21_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r31);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.nextStage());
    });
    core /* ɵɵtext */.EFF(1, "Next");
    core /* ɵɵelementEnd */.k0s();
  }
}
function NewModelByWizardComponentComponent_button_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 101);
    core /* ɵɵlistener */.bIt("click", function NewModelByWizardComponentComponent_button_22_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r32);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.finish());
    });
    core /* ɵɵtext */.EFF(1, "Take Me To The Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
let NewModelByWizardComponentComponent = /*#__PURE__*/(() => {
  class NewModelByWizardComponentComponent {
    constructor(dialogRef, contextService, init, data) {
      this.dialogRef = dialogRef;
      this.contextService = contextService;
      this.init = init;
      this.data = data;
      this.separatorKeysCodes = [ENTER, COMMA];
      this.tagsCtrl = new UntypedFormControl("");
      this.tagsCtrl2 = new UntypedFormControl("");
      this.tagsCtrl3 = new UntypedFormControl("");
      this.setStagesData();
      this.stageIndex = 0;
      this.totalStagesNumber = 12;
      this.title = this.stagesData[0].title;
      this.showStakeholderDiv = false;
      this.showIngDiv = false;
      this.showPhysicalDiv = false;
      this.showCreatesDiv = false;
      this.showAffectsDiv = false;
      this.showChangesDiv = false;
      this.showHoverDiv = false;
      this.showToolsHelpDiv = false;
      this.showEnvironmentalDiv = false;
      this.formParams = {
        mainFunctionality: "",
        beneficiaryGroup: "",
        beneficiary: "",
        beneficiaryState1: "",
        beneficiaryState2: "",
        isMainBeneficiaryAlsoHandler: undefined,
        systemHandlers: [],
        systemName: "",
        tools: [],
        toolsData: [],
        mainInputs: [],
        mainOutput: "",
        mainOutputIsInput: undefined,
        mainOutputLinkType: undefined,
        mainOutputLinkChangesState1: "",
        mainOutputLinkChangesState2: "",
        environmentalObjects: []
      };
      // this.dummyParams();
    }
    ngOnInit() {}
    nextStage() {
      const canProceed = this.canProceed();
      if (this.canProceed().can) {
        this.stageIndex++;
      } else {
        (0, validationAlert)(canProceed.message);
      }
    }
    canProceed() {
      if (this.stageIndex === 2 && this.formParams.mainFunctionality.trim().length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting the main functionality of the system."
        };
      } else if (this.stageIndex === 3 && this.formParams.beneficiaryGroup.trim().length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting the beneficiary group of the system."
        };
      } else if (this.stageIndex === 4 && this.formParams.beneficiary.trim().length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting the beneficiary of the system."
        };
      } else if (this.stageIndex === 4 && (this.formParams.beneficiaryState1.trim().length === 0 || this.formParams.beneficiaryState2.trim().length === 0)) {
        return {
          can: false,
          message: "Cannot proceed without setting the beneficiary states of the system."
        };
      } else if (this.stageIndex === 5 && this.formParams.isMainBeneficiaryAlsoHandler === undefined) {
        return {
          can: false,
          message: "Cannot proceed without setting if the beneficiary of the system is also an handler."
        };
      } else if (this.stageIndex === 5 && this.formParams.isMainBeneficiaryAlsoHandler === false && this.formParams.systemHandlers.length === 0) {
        return {
          can: false,
          message: "If the main beneficiary is not the system's handler you should set at least one handler."
        };
      } else if (this.stageIndex === 6 && this.formParams.systemName.trim().length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting if the system's name."
        };
      } else if (this.stageIndex === 7 && this.formParams.tools.length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting at least one system's tool."
        };
      } else if (this.stageIndex === 8 && this.formParams.mainInputs.length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting at least one system's input."
        };
      } else if (this.stageIndex === 9 && this.formParams.mainOutputIsInput === undefined) {
        return {
          can: false,
          message: "Cannot proceed without setting if the system's main output is also an input."
        };
      } else if (this.stageIndex === 9 && this.formParams.mainOutput.trim().length === 0) {
        return {
          can: false,
          message: "Cannot proceed without setting the system's main output."
        };
      } else if (this.stageIndex === 9 && this.formParams.mainOutputLinkType === undefined) {
        return {
          can: false,
          message: "Cannot proceed without setting the system's main output connection type."
        };
      } else if (this.stageIndex === 9 && this.formParams.mainOutputLinkType === "changes" && (this.formParams.mainOutputLinkChangesState1.trim().length === 0 || this.formParams.mainOutputLinkChangesState2.trim().length === 0)) {
        return {
          can: false,
          message: "Cannot proceed without setting the system's main output states."
        };
      }
      return {
        can: true
      };
    }
    previousStage() {
      this.stageIndex--;
    }
    setStagesData() {
      this.stagesData = [{
        title: "Welcome!"
      }, {
        title: "Motivation"
      }, {
        title: "System’s Main Functionality"
      }, {
        title: "Beneficiary Group"
      }, {
        title: "Beneficiary Attribute"
      }, {
        title: "Agent"
      }, {
        title: "System Name"
      }, {
        title: "Instrument"
      }, {
        title: "Input"
      }, {
        title: "Output"
      }, {
        title: "Environmental Objects"
      }, {
        title: "The Model Is Completed"
      }];
    }
    finish() {
      if (this.data.sandbox) {
        return this.finishForSandbox();
      }
      this.contextService.createNewModelFromWizard(this.formParams);
      this.init.graphService.renderGraph(this.init.opmModel.currentOpd, this.init);
      this.init.graph.getCells().forEach(c => c.autosize ? c.autosize(this.init) : undefined);
      this.init.criticalChanges_.next(true);
      this.dialogRef.close();
    }
    finishForSandbox() {
      this.init.modelService.reset();
      this.init.getOpmModel().createModelFromWizardParams(this.formParams);
      this.init.graphService.renderGraph(this.init.opmModel.currentOpd, this.init);
      this.init.graph.getCells().forEach(c => c.autosize ? c.autosize(this.init) : undefined);
      this.init.criticalChanges_.next(true);
      this.dialogRef.close();
    }
    cancel() {
      var _this = this;
      return (0, default)(function* () {
        const confirmDialog = _this.init.dialogService.openDialog(ConfirmDialogDialogComponent, 220, 350, {
          allowMultipleDialogs: true,
          message: "Warning \n\n Are you sure you want to close the wizard?",
          closeFlag: false,
          okName: "Yes",
          closeName: "No",
          centerText: true
        });
        const leave = yield confirmDialog.afterClosed().toPromise();
        if (leave === "OK") {
          _this.dialogRef.close();
        }
      })();
    }
    removeSystemEnablerTag(tag) {
      const index = this.formParams.systemHandlers.indexOf(tag);
      if (index >= 0) {
        this.formParams.systemHandlers.splice(index, 1);
      }
    }
    addSystemEnablerTag(event) {
      if (this.formParams.systemHandlers.length === 3) {
        (0, validationAlert)("The wizard is limited for only 3 inputs.", 3500);
        this.tagsCtrl.setValue(null);
        return;
      }
      const value = (event.value || "").trim();
      if (this.formParams.systemHandlers.some(it => it.toLowerCase().trim() === value.toLowerCase().trim())) {
        (0, validationAlert)("A value can be used only once.", 3500);
        event.input.value = "";
        this.tagsCtrl.setValue(null);
        return;
      }
      if (value) {
        this.formParams.systemHandlers.push(value);
      }
      event.input.value = "";
      this.tagsCtrl.setValue(null);
    }
    removeSystemToolTag(tag) {
      const index = this.formParams.tools.indexOf(tag);
      if (index >= 0) {
        this.formParams.tools.splice(index, 1);
        this.formParams.toolsData.splice(index, 1);
        const idx = this.formParams.environmentalObjects.findIndex(obj => obj.name === tag);
        if (idx) {
          this.formParams.environmentalObjects.splice(idx, 1);
        }
      }
    }
    addSystemToolTag(event) {
      if (this.formParams.tools.length === 3) {
        (0, validationAlert)("The wizard is limited for only 3 tools.", 3500);
        this.tagsCtrl.setValue(null);
        return;
      }
      const value = (event.value || "").trim();
      if (this.formParams.tools.some(it => it.toLowerCase().trim() === value.toLowerCase().trim())) {
        (0, validationAlert)("A value can be used only once.", 3500);
        event.input.value = "";
        this.tagsCtrl2.setValue(null);
        return;
      }
      if (value) {
        this.formParams.tools.push(value);
        this.formParams.toolsData.push({
          name: value,
          isPhysical: false
        });
        this.formParams.environmentalObjects.push({
          name: value,
          isEnvironmental: false
        });
      }
      event.input.value = "";
      this.tagsCtrl2.setValue(null);
    }
    removeSystemInputTag(tag) {
      const index = this.formParams.mainInputs.indexOf(tag);
      if (index >= 0) {
        this.formParams.mainInputs.splice(index, 1);
        const idx = this.formParams.environmentalObjects.findIndex(obj => obj.name === tag);
        if (idx) {
          this.formParams.environmentalObjects.splice(idx, 1);
        }
      }
    }
    addSystemInputTag(event) {
      if (this.formParams.mainInputs.length === 3) {
        (0, validationAlert)("The wizard is limited for only 3 inputs.", 3500);
        this.tagsCtrl3.setValue(null);
        return;
      }
      const value = (event.value || "").trim();
      if (this.formParams.mainInputs.some(it => it.toLowerCase().trim() === value.toLowerCase().trim())) {
        (0, validationAlert)("A value can be used only once.", 3500);
        event.input.value = "";
        this.tagsCtrl3.setValue(null);
        return;
      }
      if (value) {
        this.formParams.mainInputs.push(value);
        this.formParams.environmentalObjects.push({
          name: value,
          isEnvironmental: false
        });
      }
      event.input.value = "";
      this.tagsCtrl3.setValue(null);
    }
    dummyParams() {
      this.formParams = {
        mainFunctionality: "Main System Doing",
        beneficiaryGroup: "Beneficiary Group updated",
        beneficiary: "Beneficiary relevant attribute",
        beneficiaryState1: "problematic",
        beneficiaryState2: "satisfactory",
        isMainBeneficiaryAlsoHandler: true,
        systemHandlers: ["handler1", "handler2", "handler3"],
        systemName: "System name",
        tools: ["tool1", "tool2", "tool3"],
        toolsData: [{
          name: "tool1",
          isPhysical: true
        }, {
          name: "tool2",
          isPhysical: true
        }, {
          name: "tool3",
          isPhysical: false
        }],
        mainInputs: ["input1", "input2", "input3"],
        mainOutput: "Output",
        mainOutputIsInput: undefined,
        mainOutputLinkType: "affects",
        mainOutputLinkChangesState1: "state change 1",
        mainOutputLinkChangesState2: "state change 2",
        environmentalObjects: [{
          name: "tool1",
          isEnvironmental: true
        }]
      };
    }
    isMainOutputAlsoInputChange($event) {
      this.formParams.mainOutputIsInput = $event.value;
      if (this.formParams.mainOutputIsInput) {
        this.previousMainOutputLinkType = this.formParams.mainOutputLinkType;
        this.formParams.mainOutputLinkType = "changes";
      } else {
        this.formParams.mainOutputLinkType = this.previousMainOutputLinkType;
      }
    }
    onInputAsMainOutputSelection($event) {
      this.formParams.mainOutput = $event.value;
    }
    getToolsSelectionLabel() {
      if (this.formParams.toolsData.filter(t => t.isPhysical).length === 0) {
        return "Select";
      } else {
        return this.formParams.toolsData.filter(t => t.isPhysical).map(it => it.name).join(", ");
      }
    }
    getEnvironmentalObjectsSelectionLabel() {
      if (this.formParams.environmentalObjects.filter(t => t.isEnvironmental).length === 0) {
        return "Select";
      } else {
        return this.formParams.environmentalObjects.filter(t => t.isEnvironmental).map(it => it.name).join(", ");
      }
    }
    static #_ = (() => this.ɵfac = function NewModelByWizardComponentComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NewModelByWizardComponentComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: NewModelByWizardComponentComponent,
      selectors: [["opcloud-new-model-by-wizard-component"]],
      decls: 25,
      vars: 19,
      consts: [["chipList", ""], ["chipList2", ""], ["chipList3", ""], ["id", "whole"], ["id", "title"], ["mode", "determinate", 2, "width", "300px", "right", "90px", "position", "absolute", 3, "value"], ["id", "progressStageNumber"], ["class", "stageDiv", 4, "ngIf"], ["id", "stage1Div", "class", "stageDiv", 4, "ngIf"], ["id", "stage2Div", "class", "stageDiv", 4, "ngIf"], ["class", "stageDiv stage34Div", 4, "ngIf"], ["id", "stage5Div", "class", "stageDiv", 4, "ngIf"], ["id", "buttons"], ["mat-button", "", 3, "click", 4, "ngIf"], ["id", "finishBtn", "mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click"], [1, "stageDiv"], [2, "margin-left", "70px", "color", "rgba(0, 0, 0, 0.87)"], [1, "bold"], [1, "bold", 2, "margin-top", "80px", "color", "rgba(0, 0, 0, 0.87)"], ["id", "stage1Div", 1, "stageDiv"], ["id", "stage1TextDiv"], [1, "boldHelp", 3, "mouseenter", "mouseleave"], ["id", "stage1TextDiv2", 4, "ngIf"], ["id", "stage1Image", "src", "assets/modelWizard/page2.png"], ["id", "stage1TextDiv2"], ["id", "stage2Div", 1, "stageDiv"], ["id", "stage2TextDiv1"], ["id", "stage2FormFieldInput"], ["matInput", "", 3, "ngModelChange", "ngModel"], ["id", "stage2TextDiv3", 4, "ngIf"], ["id", "stage2Image", "src", "assets/modelWizard/page3.png"], ["id", "stage2TextDiv3"], [1, "stageDiv", "stage34Div"], [1, "stage34TextDiv"], ["id", "stakeholderDiv", 4, "ngIf"], [1, "stage34FormFieldInput"], [1, "stage34TextDiv2"], ["src", "assets/modelWizard/page5.png", 1, "stage34Image"], ["id", "stakeholderDiv"], [1, "stage34TextDiv1"], ["appearance", "outline", 1, "stage4FormFieldInputs"], ["id", "stage5Div", 1, "stageDiv"], ["id", "stage5TextDiv1"], ["id", "stage5FormFieldSelection"], [3, "ngModelChange", "ngModel"], [3, "value"], ["id", "stage5FormFieldChip", "appearance", "fill", 2, "width", "500px"], ["aria-label", "Tags"], [3, "removed", 4, "ngFor", "ngForOf"], ["placeholder", "Add Enablers...", 3, "matChipInputTokenEnd", "formControl", "matChipInputFor", "matChipInputSeparatorKeyCodes"], ["id", "stage5TextDiv3"], [3, "removed"], ["matChipRemove", ""], ["id", "stage6TextDiv1"], ["id", "stage6FormFieldInput"], ["id", "stage6TextDiv2"], ["id", "stage6Image", "src", "assets/modelWizard/page7.png"], ["id", "stage7TextDiv1"], [1, "bold", 3, "mouseenter", "mouseleave"], ["id", "stage1TextDiv5", 4, "ngIf"], ["id", "stage7FormFieldChip", "appearance", "fill", 2, "width", "600px", "margin-top", "10px"], ["placeholder", "Add Tools...", 3, "matChipInputTokenEnd", "formControl", "matChipInputFor", "matChipInputSeparatorKeyCodes"], ["id", "stage7TextDiv3"], ["id", "stage7FormFieldSelection"], [4, "ngFor", "ngForOf"], ["id", "stage7TextDiv4", 4, "ngIf"], ["id", "stage1TextDiv5"], [3, "ngModelChange", "click", "ngModel"], ["id", "stage7TextDiv4"], ["id", "stage8TextDiv1"], ["id", "stage8FormFieldChip", "appearance", "fill", 2, "width", "500px", "margin-top", "10px"], ["placeholder", "Add Inputs...", 3, "matChipInputTokenEnd", "formControl", "matChipInputFor", "matChipInputSeparatorKeyCodes"], ["id", "stage8TextDiv3"], ["class", "createsAffectsChanges", 4, "ngIf"], ["id", "stage9TextDiv1"], ["id", "stage9FormFieldSelection1"], [3, "selectionChange"], ["id", "stage9FormFieldInput"], [4, "ngIf"], ["matInput", "", 3, "ngModel", "ngModelChange", 4, "ngIf"], [3, "selectionChange", 4, "ngIf"], ["id", "stage9TextDiv2", 4, "ngIf"], [1, "createsAffectsChanges"], ["src", "assets/modelWizard/page10.1.png"], ["src", "assets/modelWizard/page10.2.png"], ["src", "assets/modelWizard/page10.3.png"], [3, "value", 4, "ngFor", "ngForOf"], ["id", "stage9TextDiv2"], ["id", "stage9FormFieldSelection2"], [3, "ngModelChange", "disabled", "ngModel"], ["value", "creates"], ["value", "affects"], ["value", "changes"], ["id", "stage10TextDivFloat", 4, "ngIf"], ["id", "stage10TextDiv"], ["id", "stage10TextDiv2"], ["id", "stage11FormFieldSelection"], ["id", "stage10Image", "src", "assets/modelWizard/page11.png"], ["id", "stage10TextDivFloat"], ["id", "stage11TextDiv", 2, "color", "rgba(0, 0, 0, 0.87)"], ["id", "finishBtn", "mat-button", "", 3, "click"]],
      template: function NewModelByWizardComponentComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 3)(1, "div", 4)(2, "span");
          core /* ɵɵtext */.EFF(3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(4, "mat-progress-bar", 5);
          core /* ɵɵelementStart */.j41(5, "span", 6);
          core /* ɵɵtext */.EFF(6);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(7, NewModelByWizardComponentComponent_div_7_Template, 10, 0, "div", 7)(8, NewModelByWizardComponentComponent_div_8_Template, 10, 1, "div", 8)(9, NewModelByWizardComponentComponent_div_9_Template, 17, 2, "div", 9)(10, NewModelByWizardComponentComponent_div_10_Template, 19, 2, "div", 10)(11, NewModelByWizardComponentComponent_div_11_Template, 20, 3, "div", 10)(12, NewModelByWizardComponentComponent_div_12_Template, 25, 7, "div", 11)(13, NewModelByWizardComponentComponent_div_13_Template, 13, 1, "div", 7)(14, NewModelByWizardComponentComponent_div_14_Template, 32, 8, "div", 7)(15, NewModelByWizardComponentComponent_div_15_Template, 15, 4, "div", 7)(16, NewModelByWizardComponentComponent_div_16_Template, 31, 11, "div", 7)(17, NewModelByWizardComponentComponent_div_17_Template, 22, 3, "div", 7)(18, NewModelByWizardComponentComponent_div_18_Template, 11, 0, "div", 7);
          core /* ɵɵelementStart */.j41(19, "div", 12);
          core /* ɵɵtemplate */.DNE(20, NewModelByWizardComponentComponent_button_20_Template, 2, 0, "button", 13)(21, NewModelByWizardComponentComponent_button_21_Template, 2, 0, "button", 13)(22, NewModelByWizardComponentComponent_button_22_Template, 2, 0, "button", 14);
          core /* ɵɵelementStart */.j41(23, "button", 15);
          core /* ɵɵlistener */.bIt("click", function NewModelByWizardComponentComponent_Template_button_click_23_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(24, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.stagesData[ctx.stageIndex].title);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", (ctx.stageIndex + 1) / ctx.totalStagesNumber * 100);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate2 */.Lme("Stage ", ctx.stageIndex + 1, " of ", ctx.totalStagesNumber, "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 1);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 2);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 3);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 4);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 5);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 6);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 7);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 8);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 9);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 10);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === 11);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex > 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex < ctx.totalStagesNumber - 1);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.stageIndex === ctx.totalStagesNumber - 1);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatIcon, MatSelect, MatOption, MatButton, MatCheckbox, DefaultValueAccessor, NgControlStatus, NgModel, MatChip, MatChipGrid, MatChipInput, MatChipRemove, FormControlDirective, MatProgressBar],
      styles: ["#title[_ngcontent-%COMP%]{height:100px;display:flex;width:100%;position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;line-height:normal;font-size:36px;text-align:center;color:#1a3763;left:40px;align-items:center}#progressStageNumber[_ngcontent-%COMP%]{right:90px;top:53px;font-weight:500;font-size:14px;position:absolute}mat-mdc-progress-bar[_ngcontent-%COMP%]{width:300px;right:90px;position:absolute}.mat-mdc-progress-bar-fill[_ngcontent-%COMP%]:after{background-color:#1a3763}.mat-mdc-progress-bar-buffer[_ngcontent-%COMP%]{background:#b1bac9}.mat-mdc-progress-bar[_ngcontent-%COMP%]{border-radius:2px}.stageDiv[_ngcontent-%COMP%]{width:calc(100% - 60px);margin-left:30px;height:505px;line-height:40px;font-size:21px;display:flex;align-items:center}#buttons[_ngcontent-%COMP%]{width:calc(100% - 100px);height:65px;text-align:center;margin-left:50px;color:#1a3763!important}button[_ngcontent-%COMP%]{padding:0 36px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;letter-spacing:normal!important;line-height:normal;font-size:14px;color:#1a3763!important}#finishBtn[_ngcontent-%COMP%]{font-weight:bolder!important;font-size:18px}#stage1TextDiv[_ngcontent-%COMP%]{display:flex;align-items:center;flex-direction:column;color:#000000de!important}#stage1Image[_ngcontent-%COMP%]{width:470px;height:300px}#stage1TextDiv2[_ngcontent-%COMP%]{position:fixed;background:#fff;margin-top:300px;border:2px solid #1A3763;border-radius:18px;padding:10px;color:#000000de!important}#stage2Image[_ngcontent-%COMP%]{width:300px;height:150px}#stage2TextDiv3[_ngcontent-%COMP%]{position:fixed;background:#fff;margin-top:10px;border:2px solid #1A3763;border-radius:18px;padding:10px;color:#000000de!important}#stage2FormFieldInput[_ngcontent-%COMP%]{width:500px;margin-top:20px;color:#000000de;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}.stage34Image[_ngcontent-%COMP%]{width:320px;height:185px}.stage34FormFieldInput[_ngcontent-%COMP%]{width:500px;margin-top:20px;color:#000000de;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}.stage4FormFieldInputs[_ngcontent-%COMP%]{width:300px;margin-top:-10px;margin-bottom:20px;color:#000000de;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage5FormFieldSelection[_ngcontent-%COMP%]{margin-left:10px;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage5FormFieldChip[_ngcontent-%COMP%]{--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage6Image[_ngcontent-%COMP%]{width:320px;padding-left:30px;height:185px}#stage6FormFieldInput[_ngcontent-%COMP%]{width:350px;margin-top:20px;color:#000000de;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage7TextDiv4[_ngcontent-%COMP%]{position:fixed;background:#fff;margin-top:-20px;border:2px solid #1A3763;border-radius:18px;padding:10px;width:760px;color:#000000de!important}#stage7FormFieldChip[_ngcontent-%COMP%]{--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage1TextDiv5[_ngcontent-%COMP%]{position:fixed;background:#fff;margin-top:-270px;border:2px solid #1A3763;border-radius:18px;padding:10px;color:#000000de!important}#stage7FormFieldSelection[_ngcontent-%COMP%]{width:260px;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage8FormFieldChip[_ngcontent-%COMP%]{--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}.createsAffectsChanges[_ngcontent-%COMP%]{position:absolute;background:#fff;margin-top:100px;margin-left:653px;border:2px solid #1A3763;border-radius:18px;padding:10px;z-index:999999999999}.createsAffectsChanges[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:280px}#stage9FormFieldInput[_ngcontent-%COMP%]{width:500px;margin-top:20px;color:#000000de;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage9FormFieldSelection2[_ngcontent-%COMP%]{width:107px;margin-left:10px;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage9FormFieldSelection1[_ngcontent-%COMP%]{width:400px;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stage10Image[_ngcontent-%COMP%]{height:110px;width:229px;padding:30px}#stage11FormFieldSelection[_ngcontent-%COMP%]{width:400px;--mdc-filled-text-field-focus-active-indicator-color: #1A3763;--mdc-filled-text-field-hover-active-indicator-color: #1A3763;--mdc-filled-text-field-active-indicator-color: #1A3763;--mdc-filled-text-field-disabled-active-indicator-color: #1A3763;--mdc-circular-progress-active-indicator-color: #1A3763}#stakeholderDiv[_ngcontent-%COMP%]{position:fixed;background:#fff;margin-top:-230px;border:2px solid #1A3763;border-radius:18px;padding:10px}#stage10TextDivFloat[_ngcontent-%COMP%]{position:fixed;background:#fff;margin-top:-75px;border:2px solid #1A3763;border-radius:18px;padding:10px;color:#000000de!important}.boldHelp[_ngcontent-%COMP%]{font-weight:700;cursor:help}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.mat-mdc-form-field-underline[_ngcontent-%COMP%], .mat-mdc-form-field-ripple[_ngcontent-%COMP%]{background-color:#1a3763!important}.mat-mdc-form-field-appearance-outline[_ngcontent-%COMP%]   .mat-mdc-form-field-outline[_ngcontent-%COMP%]{color:#1a3763!important}.bold[_ngcontent-%COMP%]{font-weight:700}"]
    }))();
  }
  return NewModelByWizardComponentComponent;
})();