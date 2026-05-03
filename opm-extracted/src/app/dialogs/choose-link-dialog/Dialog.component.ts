// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/choose-link-dialog/Dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function LinksDialogComponent_span_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 19)(1, "label");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const trg_r1 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleProp */.xc7("color", ctx_r1.get_style(trg_r1.attributes.type));
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", trg_r1.getVisual().logicalElement.getBareName());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate2 */.Lme("", ctx_r1.multiTargets.indexOf(trg_r1) !== 0 ? ", " : "", "", trg_r1.getVisual().logicalElement.getBareName(), "");
  }
}
function LinksDialogComponent_div_24_div_1_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_24_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 36);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_24_div_1_div_1_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const link_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(link_r4));
    });
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_24_div_1_div_1_div_1_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(2, "div", 38);
    core /* ɵɵelement */.nrm(3, "div");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 40);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 41);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const link_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign(link_r4.name));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMapInterpolate1 */.ZvI("Structrial ", link_r4.name, "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(link_r4.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", link_r4.opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(link_r4.opl);
  }
}
function LinksDialogComponent_div_24_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 34);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_24_div_1_div_1_Template, 9, 7, "div", 35);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const link_r4 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages(link_r4.name));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled(link_r4.name).success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.checkStructural(link_r4));
  }
}
function LinksDialogComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 32);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_24_div_1_Template, 2, 3, "div", 33);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.Structural_Links);
  }
}
function LinksDialogComponent_div_25_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_25_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 48);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_25_div_1_Template_div_click_0_listener() {
      const link_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(link_r6));
    });
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_25_div_1_div_1_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(2, "div", 38);
    core /* ɵɵelement */.nrm(3, "div");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 40);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 41);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const link_r6 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages(link_r6.name));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled(link_r6.name).success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign(link_r6.name));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMapInterpolate1 */.ZvI("Structrial ", link_r6.name, "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(link_r6.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", link_r6.opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(link_r6.opl);
  }
}
function LinksDialogComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 46);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_25_div_1_Template, 9, 9, "div", 47);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.Relation_Links);
  }
}
function LinksDialogComponent_div_26_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_26_div_1_br_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function LinksDialogComponent_div_26_div_1_div_8_option_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 61);
    core /* ɵɵtext */.EFF(1, "None");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    core /* ɵɵproperty */.Y8G("defaultSelected", true);
  }
}
function LinksDialogComponent_div_26_div_1_div_8_option_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 62);
    core /* ɵɵtext */.EFF(1, "XOR");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_26_div_1_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 57);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_26_div_1_div_8_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵtemplate */.DNE(3, LinksDialogComponent_div_26_div_1_div_8_option_3_Template, 2, 1, "option", 58);
    core /* ɵɵelementStart */.j41(4, "option", 59);
    core /* ɵɵtext */.EFF(5, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(6, LinksDialogComponent_div_26_div_1_div_8_option_6_Template, 2, 0, "option", 60);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isStateSelected());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isStateSelected());
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isStateSelected());
  }
}
function LinksDialogComponent_div_26_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 51);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_26_div_1_div_1_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(2, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_26_div_1_Template_div_click_2_listener() {
      const link_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(link_r8));
    });
    core /* ɵɵelement */.nrm(3, "div");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 40);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(7, LinksDialogComponent_div_26_div_1_br_7_Template, 1, 0, "br", 53)(8, LinksDialogComponent_div_26_div_1_div_8_Template, 7, 3, "div", 54);
    core /* ɵɵelementStart */.j41(9, "p", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_26_div_1_Template_p_click_9_listener() {
      const link_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(link_r8));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const link_r8 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages(link_r8.name));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled(link_r8.name).success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign(link_r8.name));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMapInterpolate1 */.ZvI("Result ", link_r8.name, "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(link_r8.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", link_r8.opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(link_r8.opl);
  }
}
function LinksDialogComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 49);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_26_div_1_Template, 11, 11, "div", 50);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.Result_Link);
  }
}
function LinksDialogComponent_div_27_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 64)(2, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_1_Template_div_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[0]));
    });
    core /* ɵɵelement */.nrm(3, "div", 65);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_1_Template_div_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[0]));
    });
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 67)(8, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_27_div_1_Template_select_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplaySplit($event));
    });
    core /* ɵɵelementStart */.j41(9, "option", 69);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "option", 70);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(17, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_1_Template_div_click_17_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[0]));
    });
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.replacename(ctx_r1.In_out_Link_Pair[0].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[2].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[3].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[3].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.In_out_Link_Pair[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.In_out_Link_Pair[0].opl);
  }
}
function LinksDialogComponent_div_27_div_2_option_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[2].name));
  }
}
function LinksDialogComponent_div_27_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 64)(2, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_2_Template_div_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[1]));
    });
    core /* ɵɵelement */.nrm(3, "div", 71);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_2_Template_div_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[1]));
    });
    core /* ɵɵtext */.EFF(6, "Split Input Link Pair");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 67)(8, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_27_div_2_Template_select_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplaySplit($event));
    });
    core /* ɵɵelementStart */.j41(9, "option", 70);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "option", 69);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(13, LinksDialogComponent_div_27_div_2_option_13_Template, 2, 2, "option", 72);
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(16, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_2_Template_div_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[1]));
    });
    core /* ɵɵtext */.EFF(17);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.asOnlyOneState);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[3].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[3].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.In_out_Link_Pair[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.In_out_Link_Pair[1].opl);
  }
}
function LinksDialogComponent_div_27_div_3_option_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[2].name));
  }
}
function LinksDialogComponent_div_27_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 64)(2, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_3_Template_div_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[1]));
    });
    core /* ɵɵelement */.nrm(3, "div", 73);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_3_Template_div_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[1]));
    });
    core /* ɵɵtext */.EFF(6, "Split Output Link Pair");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 67)(8, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_27_div_3_Template_select_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplaySplit($event));
    });
    core /* ɵɵelementStart */.j41(9, "option", 70);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "option", 69);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(13, LinksDialogComponent_div_27_div_3_option_13_Template, 2, 2, "option", 72);
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(16, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_3_Template_div_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[1]));
    });
    core /* ɵɵtext */.EFF(17);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.asOnlyOneState);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[3].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[3].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.In_out_Link_Pair[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.In_out_Link_Pair[1].opl);
  }
}
function LinksDialogComponent_div_27_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 64)(2, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_4_Template_div_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[2]));
    });
    core /* ɵɵelement */.nrm(3, "div", 74);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_4_Template_div_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[2]));
    });
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 67)(8, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_27_div_4_Template_select_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplaySplit($event));
    });
    core /* ɵɵelementStart */.j41(9, "option", 70);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "option", 70);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "option", 69);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(17, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_4_Template_div_click_17_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[2]));
    });
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.replacename(ctx_r1.In_out_Link_Pair[2].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[2].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[3].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[3].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.In_out_Link_Pair[2].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.In_out_Link_Pair[2].opl);
  }
}
function LinksDialogComponent_div_27_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 64)(2, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_5_Template_div_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[3]));
    });
    core /* ɵɵelement */.nrm(3, "div", 75);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_5_Template_div_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[3]));
    });
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 67)(8, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_27_div_5_Template_select_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplaySplit($event));
    });
    core /* ɵɵelementStart */.j41(9, "option", 70);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "option", 70);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 69);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(17, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_27_div_5_Template_div_click_17_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.In_out_Link_Pair[3]));
    });
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.replacename(ctx_r1.In_out_Link_Pair[3].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[2].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.In_out_Link_Pair[3].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.In_out_Link_Pair[3].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.In_out_Link_Pair[3].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.In_out_Link_Pair[3].opl);
  }
}
function LinksDialogComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 63);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_27_div_1_Template, 19, 11, "div", 53)(2, LinksDialogComponent_div_27_div_2_Template, 18, 9, "div", 53)(3, LinksDialogComponent_div_27_div_3_Template, 18, 9, "div", 53)(4, LinksDialogComponent_div_27_div_4_Template, 19, 11, "div", 53)(5, LinksDialogComponent_div_27_div_5_Template, 19, 11, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.splitSelection === "In-out_Link_Pair");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.splitSelection === "Split_input");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.splitSelection === "Split_output");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.splitSelection === "In-out_Link_Pair_Condition");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.splitSelection === "In-out_Link_Pair_Event");
  }
}
function LinksDialogComponent_div_28_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_28_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 48);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_28_div_1_Template_div_click_0_listener() {
      const link_r16 = core /* ɵɵrestoreView */.eBV(_r15).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(link_r16));
    });
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_28_div_1_div_1_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(2, "div", 38);
    core /* ɵɵelement */.nrm(3, "div");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 39)(5, "div", 40);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 41);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const link_r16 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages(link_r16.name));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled(link_r16.name).success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign(link_r16.name));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMapInterpolate1 */.ZvI("Invocation ", link_r16.name, "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(link_r16.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", link_r16.opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(link_r16.opl);
  }
}
function LinksDialogComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 76);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_28_div_1_Template, 9, 9, "div", 47);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.Invocation_links);
  }
}
function LinksDialogComponent_div_29_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_29_div_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_29_div_1_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_1_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 81);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_29_div_1_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_1_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 82);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_29_div_1_div_23_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_1_div_23_div_8_Template_select_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(2, "option", 85);
    core /* ɵɵtext */.EFF(3, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "option", 59);
    core /* ɵɵtext */.EFF(5, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 62);
    core /* ɵɵtext */.EFF(7, "XOR");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function LinksDialogComponent_div_29_div_1_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 83)(2, "select", 84);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_1_div_23_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵtemplate */.DNE(8, LinksDialogComponent_div_29_div_1_div_23_div_8_Template, 8, 0, "div", 54);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
  }
}
function LinksDialogComponent_div_29_div_1_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88)(1, "div")(2, "select", 84);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_1_div_24_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_29_div_1_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_29_div_1_ng_template_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_1_ng_template_26_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r23);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Agent_Links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Agent_Links[0].opl, "");
  }
}
function LinksDialogComponent_div_29_div_1_ng_template_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_1_ng_template_28_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r24);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Negation_Links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Agent_Negation_Links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Agent_Negation_Links[0].opl, "");
  }
}
function LinksDialogComponent_div_29_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_29_div_1_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_29_div_1_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_29_div_1_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_29_div_1_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_1_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r17);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[0]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 67)(12, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_1_Template_select_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r17);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayAgent($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(13, "option", 70)(14, "span", 79);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(16, "option", 70)(17, "span", 79);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(19, "option", 70)(20, "span", 79);
    core /* ɵɵtext */.EFF(21);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelement */.nrm(22, "br");
    core /* ɵɵtemplate */.DNE(23, LinksDialogComponent_div_29_div_1_div_23_Template, 9, 1, "div", 53)(24, LinksDialogComponent_div_29_div_1_div_24_Template, 7, 0, "div", 80)(25, LinksDialogComponent_div_29_div_1_div_25_Template, 1, 0, "div", 78)(26, LinksDialogComponent_div_29_div_1_ng_template_26_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(28, LinksDialogComponent_div_29_div_1_ng_template_28_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r25 = core /* ɵɵreference */.sdS(5);
    const negationCase_r26 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r27 = core /* ɵɵreference */.sdS(27);
    const negationOPLCase_r28 = core /* ɵɵreference */.sdS(29);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Agent"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Agent").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Agent"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentNotSelection == false)("ngIfThen", regularCase_r25)("ngIfElse", negationCase_r26);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Agent_Links[0].name), "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[0].name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[0].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[1].name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[2].name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length == 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentNotSelection == false)("ngIfThen", regularOPLCase_r27)("ngIfElse", negationOPLCase_r28);
  }
}
function LinksDialogComponent_div_29_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_29_div_2_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_29_div_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_2_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r30);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[1]));
    });
    core /* ɵɵelement */.nrm(1, "div", 89);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_29_div_2_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_2_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r31);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[1]));
    });
    core /* ɵɵelement */.nrm(1, "div", 90);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_29_div_2_div_20_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_2_div_20_div_8_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r33);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_29_div_2_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 83)(2, "select", 84);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_2_div_20_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r32);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵtemplate */.DNE(8, LinksDialogComponent_div_29_div_2_div_20_div_8_Template, 9, 0, "div", 54);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
  }
}
function LinksDialogComponent_div_29_div_2_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88)(1, "div")(2, "select", 84);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_2_div_21_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r34);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_29_div_2_div_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_29_div_2_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_2_ng_template_23_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r35);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Agent_Links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Agent_Links[1].opl, "");
  }
}
function LinksDialogComponent_div_29_div_2_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_2_ng_template_25_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r36);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Negation_Links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Agent_Negation_Links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Agent_Negation_Links[1].opl, "");
  }
}
function LinksDialogComponent_div_29_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_29_div_2_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_29_div_2_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_29_div_2_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_29_div_2_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_2_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[1]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 67)(12, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_2_Template_select_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayAgent($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "option", 70);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(19, "br");
    core /* ɵɵtemplate */.DNE(20, LinksDialogComponent_div_29_div_2_div_20_Template, 9, 1, "div", 53)(21, LinksDialogComponent_div_29_div_2_div_21_Template, 7, 0, "div", 80)(22, LinksDialogComponent_div_29_div_2_div_22_Template, 1, 0, "div", 78)(23, LinksDialogComponent_div_29_div_2_ng_template_23_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(25, LinksDialogComponent_div_29_div_2_ng_template_25_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r37 = core /* ɵɵreference */.sdS(5);
    const negationCase_r38 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r39 = core /* ɵɵreference */.sdS(24);
    const negationOPLCase_r40 = core /* ɵɵreference */.sdS(26);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Agent"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Agent").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Agent"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentNotSelection == false)("ngIfThen", regularCase_r37)("ngIfElse", negationCase_r38);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Agent_Links[1].name));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length == 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentNotSelection == false)("ngIfThen", regularOPLCase_r39)("ngIfElse", negationOPLCase_r40);
  }
}
function LinksDialogComponent_div_29_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_29_div_3_br_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function LinksDialogComponent_div_29_div_3_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_3_div_17_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r42);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_29_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_29_div_3_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_3_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r41);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[2]));
    });
    core /* ɵɵelement */.nrm(4, "div", 91);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_3_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r41);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[2]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 67)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_29_div_3_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r41);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayAgent($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.agentUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "option", 70);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(16, LinksDialogComponent_div_29_div_3_br_16_Template, 1, 0, "br", 53)(17, LinksDialogComponent_div_29_div_3_div_17_Template, 9, 0, "div", 54);
    core /* ɵɵelementStart */.j41(18, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_29_div_3_Template_div_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r41);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Agent_Links[2]));
    });
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Agent"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Agent").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Agent"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Agent_Links[2].name));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Agent_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Agent_Links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Agent_Links[2].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Agent_Links[2].opl, " ");
  }
}
function LinksDialogComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 77);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_29_div_1_Template, 30, 18, "div", 53)(2, LinksDialogComponent_div_29_div_2_Template, 27, 18, "div", 53)(3, LinksDialogComponent_div_29_div_3_Template, 20, 14, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentSelection == ctx_r1.Agent_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentSelection == ctx_r1.Agent_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.agentSelection == ctx_r1.Agent_Links[2].name);
  }
}
function LinksDialogComponent_div_30_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_30_div_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_30_div_1_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_1_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r44);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 93);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_30_div_1_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_1_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r45);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 94);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_30_div_1_div_20_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_1_div_20_div_8_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r47);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_30_div_1_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 83)(2, "select", 95);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_1_div_20_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵtemplate */.DNE(8, LinksDialogComponent_div_30_div_1_div_20_div_8_Template, 9, 0, "div", 54);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
  }
}
function LinksDialogComponent_div_30_div_1_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88)(1, "div")(2, "select", 95);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_1_div_21_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_30_div_1_div_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_30_div_1_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_1_ng_template_23_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r49);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Instrument_Links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Instrument_Links[0].opl, "");
  }
}
function LinksDialogComponent_div_30_div_1_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r50 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_1_ng_template_25_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r50);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Negation_Links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Instrument_Negation_Links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Instrument_Negation_Links[0].opl, "");
  }
}
function LinksDialogComponent_div_30_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_30_div_1_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_30_div_1_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_30_div_1_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_30_div_1_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_1_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r43);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[0]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 67)(12, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_1_Template_select_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r43);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayInsturment($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "option", 70);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(19, "br");
    core /* ɵɵtemplate */.DNE(20, LinksDialogComponent_div_30_div_1_div_20_Template, 9, 1, "div", 53)(21, LinksDialogComponent_div_30_div_1_div_21_Template, 7, 0, "div", 80)(22, LinksDialogComponent_div_30_div_1_div_22_Template, 1, 0, "div", 78)(23, LinksDialogComponent_div_30_div_1_ng_template_23_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(25, LinksDialogComponent_div_30_div_1_ng_template_25_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r51 = core /* ɵɵreference */.sdS(5);
    const negationCase_r52 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r53 = core /* ɵɵreference */.sdS(24);
    const negationOPLCase_r54 = core /* ɵɵreference */.sdS(26);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Instrument"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Instrument").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Instrument"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentNotSelection == false)("ngIfThen", regularCase_r51)("ngIfElse", negationCase_r52);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Instrument_Links[0].name));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length == 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentNotSelection == false)("ngIfThen", regularOPLCase_r53)("ngIfElse", negationOPLCase_r54);
  }
}
function LinksDialogComponent_div_30_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_30_div_2_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_30_div_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_2_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r56);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[1]));
    });
    core /* ɵɵelement */.nrm(1, "div", 96);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_30_div_2_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_2_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r57);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[1]));
    });
    core /* ɵɵelement */.nrm(1, "div", 97);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_30_div_2_div_20_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_2_div_20_div_8_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r59);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_30_div_2_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r58 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 83)(2, "select", 95);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_2_div_20_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r58);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵtemplate */.DNE(8, LinksDialogComponent_div_30_div_2_div_20_div_8_Template, 9, 0, "div", 54);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
  }
}
function LinksDialogComponent_div_30_div_2_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r60 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88)(1, "div")(2, "select", 95);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_2_div_21_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r60);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_30_div_2_div_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_30_div_2_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_2_ng_template_23_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r61);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Instrument_Links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Instrument_Links[1].opl, "");
  }
}
function LinksDialogComponent_div_30_div_2_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r62 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_2_ng_template_25_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r62);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Negation_Links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Instrument_Negation_Links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Instrument_Negation_Links[1].opl, "");
  }
}
function LinksDialogComponent_div_30_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r55 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_30_div_2_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_30_div_2_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_30_div_2_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_30_div_2_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_2_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r55);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[1]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 67)(12, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_2_Template_select_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r55);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayInsturment($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "option", 70);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(19, "br");
    core /* ɵɵtemplate */.DNE(20, LinksDialogComponent_div_30_div_2_div_20_Template, 9, 1, "div", 53)(21, LinksDialogComponent_div_30_div_2_div_21_Template, 7, 0, "div", 80)(22, LinksDialogComponent_div_30_div_2_div_22_Template, 1, 0, "div", 78)(23, LinksDialogComponent_div_30_div_2_ng_template_23_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(25, LinksDialogComponent_div_30_div_2_ng_template_25_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r63 = core /* ɵɵreference */.sdS(5);
    const negationCase_r64 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r65 = core /* ɵɵreference */.sdS(24);
    const negationOPLCase_r66 = core /* ɵɵreference */.sdS(26);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Instrument"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Instrument").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Instrument"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentNotSelection == false)("ngIfThen", regularCase_r63)("ngIfElse", negationCase_r64);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Instrument_Links[1].name));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length == 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentNotSelection == false)("ngIfThen", regularOPLCase_r65)("ngIfElse", negationOPLCase_r66);
  }
}
function LinksDialogComponent_div_30_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_30_div_3_br_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function LinksDialogComponent_div_30_div_3_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r68 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_3_div_17_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r68);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_30_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r67 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_30_div_3_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_3_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r67);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[2]));
    });
    core /* ɵɵelement */.nrm(4, "div", 98);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_3_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r67);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[2]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 67)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_30_div_3_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r67);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayInsturment($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.instrumentUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "option", 70);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(16, LinksDialogComponent_div_30_div_3_br_16_Template, 1, 0, "br", 53)(17, LinksDialogComponent_div_30_div_3_div_17_Template, 9, 0, "div", 54);
    core /* ɵɵelementStart */.j41(18, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_30_div_3_Template_div_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r67);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Instrument_Links[2]));
    });
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Instrument"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Instrument").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Instrument"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Instrument_Links[2].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Instrument_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Instrument_Links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Instrument_Links[2].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Instrument_Links[2].opl, "");
  }
}
function LinksDialogComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 92);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_30_div_1_Template, 27, 18, "div", 53)(2, LinksDialogComponent_div_30_div_2_Template, 27, 18, "div", 53)(3, LinksDialogComponent_div_30_div_3_Template, 20, 14, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentSelection == ctx_r1.Instrument_Links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentSelection == ctx_r1.Instrument_Links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.instrumentSelection == ctx_r1.Instrument_Links[2].name);
  }
}
function LinksDialogComponent_div_31_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_31_div_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_31_div_1_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r70 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_1_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r70);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 100);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_31_div_1_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r71 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_1_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r71);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 101);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_31_div_1_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r72 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88)(1, "div")(2, "select", 102);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_1_div_11_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r72);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_31_div_1_div_20_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r74 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_1_div_20_div_9_Template_select_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r74);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(2, "option", 85);
    core /* ɵɵtext */.EFF(3, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "option", 59);
    core /* ɵɵtext */.EFF(5, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 62);
    core /* ɵɵtext */.EFF(7, "XOR");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function LinksDialogComponent_div_31_div_1_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r73 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵelementStart */.j41(2, "div", 83)(3, "select", 102);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_1_div_20_Template_select_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r73);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionNotChange($event));
    });
    core /* ɵɵelementStart */.j41(4, "option", 85);
    core /* ɵɵtext */.EFF(5, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 86);
    core /* ɵɵtext */.EFF(7, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵtemplate */.DNE(9, LinksDialogComponent_div_31_div_1_div_20_div_9_Template, 8, 0, "div", 54);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
  }
}
function LinksDialogComponent_div_31_div_1_div_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_31_div_1_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r75 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_1_ng_template_22_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r75);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Consumption_links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Consumption_links[0].opl, "");
  }
}
function LinksDialogComponent_div_31_div_1_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r76 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_1_ng_template_24_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r76);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_Negation_links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Consumption_Negation_links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Consumption_Negation_links[0].opl, "");
  }
}
function LinksDialogComponent_div_31_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r69 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_31_div_1_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_31_div_1_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_31_div_1_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_31_div_1_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_1_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r69);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[0]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(11, LinksDialogComponent_div_31_div_1_div_11_Template, 8, 0, "div", 80);
    core /* ɵɵelementStart */.j41(12, "div", 67)(13, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_1_Template_select_change_13_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r69);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayConsumption($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "option", 70);
    core /* ɵɵtext */.EFF(17);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(18, "option", 70);
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(20, LinksDialogComponent_div_31_div_1_div_20_Template, 10, 1, "div", 53)(21, LinksDialogComponent_div_31_div_1_div_21_Template, 1, 0, "div", 78)(22, LinksDialogComponent_div_31_div_1_ng_template_22_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(24, LinksDialogComponent_div_31_div_1_ng_template_24_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r77 = core /* ɵɵreference */.sdS(5);
    const negationCase_r78 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r79 = core /* ɵɵreference */.sdS(23);
    const negationOPLCase_r80 = core /* ɵɵreference */.sdS(25);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Consumption"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Consumption").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Consumption"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionNotSelection == false)("ngIfThen", regularCase_r77)("ngIfElse", negationCase_r78);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Consumption_links[0].name), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length == 1 && ctx_r1.isStateSelected());
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionNotSelection == false)("ngIfThen", regularOPLCase_r79)("ngIfElse", negationOPLCase_r80);
  }
}
function LinksDialogComponent_div_31_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_31_div_2_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_31_div_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r82 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_2_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r82);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[1]));
    });
    core /* ɵɵelement */.nrm(1, "div", 103);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_31_div_2_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r83 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_2_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r83);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[1]));
    });
    core /* ɵɵelement */.nrm(1, "div", 104);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_31_div_2_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r84 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 88)(1, "div")(2, "select", 102);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_2_div_11_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r84);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionNotChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 86);
    core /* ɵɵtext */.EFF(6, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(7, "br");
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_31_div_2_div_20_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r86 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_2_div_20_div_9_Template_select_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r86);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(2, "option", 85);
    core /* ɵɵtext */.EFF(3, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "option", 59);
    core /* ɵɵtext */.EFF(5, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 62);
    core /* ɵɵtext */.EFF(7, "XOR");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function LinksDialogComponent_div_31_div_2_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r85 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵelementStart */.j41(2, "div", 83)(3, "select", 102);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_2_div_20_Template_select_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r85);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionNotChange($event));
    });
    core /* ɵɵelementStart */.j41(4, "option", 85);
    core /* ɵɵtext */.EFF(5, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 86);
    core /* ɵɵtext */.EFF(7, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵtemplate */.DNE(9, LinksDialogComponent_div_31_div_2_div_20_div_9_Template, 8, 0, "div", 54);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
  }
}
function LinksDialogComponent_div_31_div_2_div_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_31_div_2_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r87 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_2_ng_template_22_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r87);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Consumption_links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Consumption_links[1].opl, "");
  }
}
function LinksDialogComponent_div_31_div_2_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r88 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_2_ng_template_24_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r88);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_Negation_links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Consumption_Negation_links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Consumption_Negation_links[1].opl, "");
  }
}
function LinksDialogComponent_div_31_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r81 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_31_div_2_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_31_div_2_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_31_div_2_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_31_div_2_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_2_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r81);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[1]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(11, LinksDialogComponent_div_31_div_2_div_11_Template, 8, 0, "div", 80);
    core /* ɵɵelementStart */.j41(12, "div", 67)(13, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_2_Template_select_change_13_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r81);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayConsumption($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "option", 70);
    core /* ɵɵtext */.EFF(17);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(18, "option", 70);
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(20, LinksDialogComponent_div_31_div_2_div_20_Template, 10, 1, "div", 53)(21, LinksDialogComponent_div_31_div_2_div_21_Template, 1, 0, "div", 78)(22, LinksDialogComponent_div_31_div_2_ng_template_22_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(24, LinksDialogComponent_div_31_div_2_ng_template_24_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r89 = core /* ɵɵreference */.sdS(5);
    const negationCase_r90 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r91 = core /* ɵɵreference */.sdS(23);
    const negationOPLCase_r92 = core /* ɵɵreference */.sdS(25);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Consumption"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Consumption").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Consumption"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionNotSelection == false)("ngIfThen", regularCase_r89)("ngIfElse", negationCase_r90);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Consumption_links[1].name), " ");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length == 1 && ctx_r1.isStateSelected());
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionNotSelection == false)("ngIfThen", regularOPLCase_r91)("ngIfElse", negationOPLCase_r92);
  }
}
function LinksDialogComponent_div_31_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_31_div_3_br_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function LinksDialogComponent_div_31_div_3_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r94 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_3_div_17_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r94);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_31_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r93 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_31_div_3_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_3_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r93);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[2]));
    });
    core /* ɵɵelement */.nrm(4, "div", 105);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_3_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r93);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[2]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 67)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_31_div_3_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r93);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayConsumption($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.consumptionUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "option", 70);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(16, LinksDialogComponent_div_31_div_3_br_16_Template, 1, 0, "br", 53)(17, LinksDialogComponent_div_31_div_3_div_17_Template, 9, 0, "div", 54);
    core /* ɵɵelementStart */.j41(18, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_31_div_3_Template_div_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r93);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Consumption_links[2]));
    });
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Consumption"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Consumption").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Consumption"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Consumption_links[2].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Consumption_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Consumption_links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Consumption_links[2].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Consumption_links[2].opl, "");
  }
}
function LinksDialogComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 99);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_31_div_1_Template, 26, 18, "div", 53)(2, LinksDialogComponent_div_31_div_2_Template, 26, 18, "div", 53)(3, LinksDialogComponent_div_31_div_3_Template, 20, 14, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionSelection == ctx_r1.Consumption_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionSelection == ctx_r1.Consumption_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.consumptionSelection == ctx_r1.Consumption_links[2].name);
  }
}
function LinksDialogComponent_div_32_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_32_div_1_br_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function LinksDialogComponent_div_32_div_1_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r96 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 56)(1, "div")(2, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_1_div_17_Template_select_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r96);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(3, "option", 85);
    core /* ɵɵtext */.EFF(4, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "option", 59);
    core /* ɵɵtext */.EFF(6, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "option", 62);
    core /* ɵɵtext */.EFF(8, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_32_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r95 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_32_div_1_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_1_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[1]));
    });
    core /* ɵɵelement */.nrm(4, "div", 107);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_1_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[1]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 67)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_1_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayEffect($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.effectUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "option", 70);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(16, LinksDialogComponent_div_32_div_1_br_16_Template, 1, 0, "br", 53)(17, LinksDialogComponent_div_32_div_1_div_17_Template, 9, 0, "div", 54);
    core /* ɵɵelementStart */.j41(18, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_1_Template_div_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[1]));
    });
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Effect"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Effect").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Effect"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Effect_links[1].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Effect_links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Effect_links[1].opl, "");
  }
}
function LinksDialogComponent_div_32_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_32_div_2_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_32_div_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r98 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_2_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r98);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 108);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_32_div_2_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r99 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_2_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r99);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[0]));
    });
    core /* ɵɵelement */.nrm(1, "div", 109);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_32_div_2_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r100 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵelementStart */.j41(2, "div", 83)(3, "select", 110);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_2_div_19_Template_select_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r100);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.effectNotChange($event));
    });
    core /* ɵɵelementStart */.j41(4, "option", 85);
    core /* ɵɵtext */.EFF(5, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 86);
    core /* ɵɵtext */.EFF(7, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵelementStart */.j41(9, "div", 56)(10, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_2_div_19_Template_select_change_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r100);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(11, "option", 85);
    core /* ɵɵtext */.EFF(12, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "option", 59);
    core /* ɵɵtext */.EFF(14, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 62);
    core /* ɵɵtext */.EFF(16, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_32_div_2_div_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_32_div_2_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r101 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_2_ng_template_21_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r101);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Effect_links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Effect_links[0].opl, "");
  }
}
function LinksDialogComponent_div_32_div_2_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r102 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_2_ng_template_23_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r102);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_Negation_links[0]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Effect_Negation_links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Effect_Negation_links[0].opl, "");
  }
}
function LinksDialogComponent_div_32_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r97 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_32_div_2_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_32_div_2_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_32_div_2_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_32_div_2_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_2_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r97);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[0]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 67)(12, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_2_Template_select_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r97);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayEffect($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.effectUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "option", 70);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(19, LinksDialogComponent_div_32_div_2_div_19_Template, 17, 0, "div", 53)(20, LinksDialogComponent_div_32_div_2_div_20_Template, 1, 0, "div", 78)(21, LinksDialogComponent_div_32_div_2_ng_template_21_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(23, LinksDialogComponent_div_32_div_2_ng_template_23_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r103 = core /* ɵɵreference */.sdS(5);
    const negationCase_r104 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r105 = core /* ɵɵreference */.sdS(22);
    const negationOPLCase_r106 = core /* ɵɵreference */.sdS(24);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Effect"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Effect").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Effect"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectNotSelection == false)("ngIfThen", regularCase_r103)("ngIfElse", negationCase_r104);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Effect_links[0].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectNotSelection == false)("ngIfThen", regularOPLCase_r105)("ngIfElse", negationOPLCase_r106);
  }
}
function LinksDialogComponent_div_32_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_32_div_3_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_32_div_3_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r108 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_3_ng_template_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r108);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[2]));
    });
    core /* ɵɵelement */.nrm(1, "div", 111);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_32_div_3_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r109 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_3_ng_template_6_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[2]));
    });
    core /* ɵɵelement */.nrm(1, "div", 112);
    core /* ɵɵelementEnd */.k0s();
  }
}
function LinksDialogComponent_div_32_div_3_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r110 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵelementStart */.j41(2, "div", 83)(3, "select", 110);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_3_div_19_Template_select_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r110);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.effectNotChange($event));
    });
    core /* ɵɵelementStart */.j41(4, "option", 85);
    core /* ɵɵtext */.EFF(5, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 86);
    core /* ɵɵtext */.EFF(7, "NOT");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵelementStart */.j41(9, "div", 56)(10, "select", 87);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_3_div_19_Template_select_change_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r110);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.orXorChange($event));
    });
    core /* ɵɵelementStart */.j41(11, "option", 85);
    core /* ɵɵtext */.EFF(12, "None");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "option", 59);
    core /* ɵɵtext */.EFF(14, "OR");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 62);
    core /* ɵɵtext */.EFF(16, "XOR");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function LinksDialogComponent_div_32_div_3_div_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div");
  }
}
function LinksDialogComponent_div_32_div_3_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r111 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_3_ng_template_21_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r111);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[2]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Effect_links[2].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Effect_links[2].opl, "");
  }
}
function LinksDialogComponent_div_32_div_3_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r112 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_3_ng_template_23_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r112);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_Negation_links[1]));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Effect_Negation_links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Effect_Negation_links[1].opl, "");
  }
}
function LinksDialogComponent_div_32_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r107 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_32_div_3_div_2_Template, 4, 0, "div", 37)(3, LinksDialogComponent_div_32_div_3_div_3_Template, 1, 0, "div", 78)(4, LinksDialogComponent_div_32_div_3_ng_template_4_Template, 2, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r)(6, LinksDialogComponent_div_32_div_3_ng_template_6_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementStart */.j41(8, "div", 39)(9, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_32_div_3_Template_div_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r107);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Effect_links[2]));
    });
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 67)(12, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_32_div_3_Template_select_change_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r107);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.setLinkDisplayEffect($event);
      return core /* ɵɵresetView */.Njj(ctx_r1.effectUpdateNotIfNecessary($event));
    });
    core /* ɵɵelementStart */.j41(13, "option", 70);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "option", 70);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "option", 70);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(19, LinksDialogComponent_div_32_div_3_div_19_Template, 17, 0, "div", 53)(20, LinksDialogComponent_div_32_div_3_div_20_Template, 1, 0, "div", 78)(21, LinksDialogComponent_div_32_div_3_ng_template_21_Template, 2, 2, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r)(23, LinksDialogComponent_div_32_div_3_ng_template_23_Template, 2, 2, "ng-template", null, 3, core /* ɵɵtemplateRefExtractor */.C5r);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const regularCase_r113 = core /* ɵɵreference */.sdS(5);
    const negationCase_r114 = core /* ɵɵreference */.sdS(7);
    const regularOPLCase_r115 = core /* ɵɵreference */.sdS(22);
    const negationOPLCase_r116 = core /* ɵɵreference */.sdS(24);
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Effect"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Effect").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Effect"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectNotSelection == false)("ngIfThen", regularCase_r113)("ngIfElse", negationCase_r114);
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Effect_links[2].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[2].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Effect_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.Effect_links[1].name.replace("_", " "));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.multiTargets.length > 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectNotSelection == false)("ngIfThen", regularOPLCase_r115)("ngIfElse", negationOPLCase_r116);
  }
}
function LinksDialogComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 106);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_32_div_1_Template, 20, 14, "div", 53)(2, LinksDialogComponent_div_32_div_2_Template, 25, 17, "div", 53)(3, LinksDialogComponent_div_32_div_3_Template, 25, 17, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectSelection == ctx_r1.Effect_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectSelection == ctx_r1.Effect_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.effectSelection == ctx_r1.Effect_links[2].name);
  }
}
function LinksDialogComponent_div_33_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_33_div_1_option_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[1].name));
  }
}
function LinksDialogComponent_div_33_div_1_option_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[2].name));
  }
}
function LinksDialogComponent_div_33_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r117 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_33_div_1_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_1_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r117);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[0]));
    });
    core /* ɵɵelement */.nrm(4, "div", 114);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_1_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r117);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[0]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 67)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_33_div_1_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r117);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplayException($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(12, LinksDialogComponent_div_33_div_1_option_12_Template, 2, 2, "option", 72)(13, LinksDialogComponent_div_33_div_1_option_13_Template, 2, 2, "option", 72);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_1_Template_div_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r117);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[0]));
    });
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Overtime"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Overtime").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Overtime"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Exception_links[0].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowExceptionLinks("undertime"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowExceptionLinks("overtimeundertime"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Exception_links[0].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Exception_links[0].opl, "");
  }
}
function LinksDialogComponent_div_33_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_33_div_2_option_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[0].name));
  }
}
function LinksDialogComponent_div_33_div_2_option_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[2].name));
  }
}
function LinksDialogComponent_div_33_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r118 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_33_div_2_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_2_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r118);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[1]));
    });
    core /* ɵɵelement */.nrm(4, "div", 115);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_2_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r118);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[1]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 67)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_33_div_2_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r118);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplayException($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(12, LinksDialogComponent_div_33_div_2_option_12_Template, 2, 2, "option", 72)(13, LinksDialogComponent_div_33_div_2_option_13_Template, 2, 2, "option", 72);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_2_Template_div_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r118);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[1]));
    });
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("Undertime"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("Undertime").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("Undertime"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Exception_links[1].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowExceptionLinks("overtime"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowExceptionLinks("overtimeundertime"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Exception_links[1].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Exception_links[1].opl, "");
  }
}
function LinksDialogComponent_div_33_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 42);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 43);
    core /* ɵɵelement */.nrm(2, "path", 44)(3, "path", 45);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LinksDialogComponent_div_33_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r119 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 51);
    core /* ɵɵtemplate */.DNE(2, LinksDialogComponent_div_33_div_3_div_2_Template, 4, 0, "div", 37);
    core /* ɵɵelementStart */.j41(3, "div", 52);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_3_Template_div_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r119);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[2]));
    });
    core /* ɵɵelement */.nrm(4, "div", 116);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div", 66);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_3_Template_div_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r119);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[2]));
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 117)(9, "select", 68);
    core /* ɵɵlistener */.bIt("change", function LinksDialogComponent_div_33_div_3_Template_select_change_9_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r119);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setLinkDisplayException($event));
    });
    core /* ɵɵelementStart */.j41(10, "option", 70);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "option", 70);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "option", 70);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(16, "div", 55);
    core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_div_33_div_3_Template_div_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r119);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onClickedExit(ctx_r1.Exception_links[2]));
    });
    core /* ɵɵtext */.EFF(17);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.getToolTipMessages("UndertimeOvertimeException"));
    core /* ɵɵproperty */.Y8G("className", ctx_r1.shouldBeDisabled("UndertimeOvertimeException").success ? "" : "disabled");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWarningSign("UndertimeOvertimeException"));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.replacename(ctx_r1.Exception_links[2].name), " ");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[2].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[2].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[0].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[0].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r1.Exception_links[1].name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.replacename(ctx_r1.Exception_links[1].name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHtml", ctx_r1.Exception_links[2].opl, core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.Exception_links[2].opl, "");
  }
}
function LinksDialogComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 113);
    core /* ɵɵtemplate */.DNE(1, LinksDialogComponent_div_33_div_1_Template, 16, 10, "div", 53)(2, LinksDialogComponent_div_33_div_2_Template, 16, 10, "div", 53)(3, LinksDialogComponent_div_33_div_3_Template, 18, 12, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.Exception_links[0] && ctx_r1.exceptionSelection == ctx_r1.Exception_links[0].name && ctx_r1.shouldShowExceptionLinks("overtime"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.Exception_links[1] && ctx_r1.exceptionSelection == ctx_r1.Exception_links[1].name && ctx_r1.shouldShowExceptionLinks("undertime"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.Exception_links[2] && ctx_r1.exceptionSelection == ctx_r1.Exception_links[2].name && ctx_r1.shouldShowExceptionLinks("overtimeundertime"));
  }
}
let LinksDialogComponent = /*#__PURE__*/(() => {
  class LinksDialogComponent {
    ngOnInit() {
      // Checks if the state is source, target or neither
      const state = this.linkTarget instanceof OpmState ? this.linkTarget : this.linkSource instanceof OpmState ? this.linkSource : undefined;
      if (state) {
        // Checks if there sre more then 1 state in the object
        this.asOnlyOneState = state.getParent().getEmbeddedCells().filter(child => child instanceof OpmState).length <= 1;
      }
    }
    ngDoCheck() {
      if ($("select").length > 0 && $("select")[0].value === "Agent") {
        $("select")[0].selectedIndex = 0;
      }
    }
    constructor(data, dialogRef, graphService, initRappid) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.graphService = graphService;
      this.initRappid = initRappid;
      this.close = new EventEmitter();
      this.listExpanded = false;
      this.show = true;
      this.noshow = false;
      // links arrays
      this.Structural_Links = [];
      this.Agent_Links = [];
      this.Agent_Negation_Links = [];
      this.Instrument_Links = [];
      this.Instrument_Negation_Links = [];
      this.Effect_links = [];
      this.Effect_Negation_links = [];
      this.Consumption_links = [];
      this.Consumption_Negation_links = [];
      this.Result_Link = [];
      this.Exception_links = [];
      this.Invocation_links = [];
      this.Relation_Links = [];
      this.In_out_Link_Pair = [];
      this.Graph = null;
      this.graph = null;
      this._shouldBeDisabled = {};
      this.Graph = graphService.getGraph();
      this.graph = this.Graph;
      this.x = 400;
      this.y = 100;
      this.px = 0;
      this.py = 0;
      this.width = 600;
      this.height = 778;
      this.width_min = 455;
      this.height_min = 420;
      this.draggingCorner = false;
      this.draggingWindow = false;
      this.minArea = 150000;
      this.newLink = data.newLink;
      this.linkSource = data.linkSource;
      this.linkTarget = data.linkTarget;
      this.opmLinks = data.opmLinks;
      this.Structural_Links = data.Structural_Links;
      this.Agent_Links = data.Agent_Links;
      this.Agent_Negation_Links = data.Agent_Negation_Links;
      this.Instrument_Links = data.Instrument_Links;
      this.Instrument_Negation_Links = data.Instrument_Negation_Links;
      this.Effect_links = data.Effect_links;
      this.Effect_Negation_links = data.Effect_Negation_links;
      this.Consumption_links = data.Consumption_links;
      this.Consumption_Negation_links = data.Consumption_Negation_links;
      this.Result_Link = data.Result_Link;
      this.Exception_links = data.Exception_links;
      this.Invocation_links = data.Invocation_links;
      this.Relation_Links = data.Relation_Links;
      this.In_out_Link_Pair = data.In_out_Link_Pair;
      this.orxorSelection = "None";
      this.notSelection = "None";
      this.agentNotSelection = false;
      this.instrumentNotSelection = false;
      this.consumptionNotSelection = false;
      this.effectNotSelection = false;
      this.replaceTriangleLink = data.replaceTriangleLink;
      if (this.Agent_Links.length) {
        this.agentSelection = this.Agent_Links[0].name;
      }
      if (this.Instrument_Links.length) {
        this.instrumentSelection = this.Instrument_Links[0].name;
      }
      if (this.Consumption_links.length) {
        this.consumptionSelection = this.Consumption_links[0].name;
      }
      if (this.Effect_links.length) {
        this.effectSelection = this.Effect_links[0].name;
      }
      if (this.Exception_links.length) {
        if (this.shouldShowExceptionLinks("overtime")) {
          this.exceptionSelection = this.Exception_links[0].name;
        } else if (this.shouldShowExceptionLinks("undertime")) {
          this.exceptionSelection = this.Exception_links[1].name;
        } else if (this.shouldShowExceptionLinks("overtimeundertime")) {
          this.exceptionSelection = this.Exception_links[2].name;
        } else {
          this.exceptionSelection = this.Exception_links[0].name;
        }
      }
      if (this.In_out_Link_Pair.length) {
        this.splitSelection = this.In_out_Link_Pair[0].name;
      }
      if (this.initRappid.selection.collection.models.length > 1) {
        this.multiTargets = this.initRappid.selection.collection.models.filter(e => !e.get("type").includes("Triangle") && e.getVisual && e.getVisual()?.logicalElement);
        this.multiTargets = this.multiTargets.filter(e => {
          if (e.constructor.name.includes("State") && e.getParentCell() && this.multiTargets.includes(e.getParentCell())) {
            return false;
          }
          return true;
        });
      } else {
        this.multiTargets = [this.linkTarget];
      }
      if (this.multiTargets.indexOf(this.linkTarget) === -1) {
        this.multiTargets.push(this.linkTarget);
      }
      if (this.isProcessSelected() && this.isObjectSelected() && this.isStateSelected()) {
        (0, validationAlert)("No common link for all targets");
        this.DefaultExit(this.newLink);
        this.initRappid.selection.collection.reset([]);
        this.close.emit("event");
        this.dialogRef.close();
      }
    }
    getExtremeSubProcesses(subProcesses) {
      let highest = [subProcesses[0]];
      let lowest = [subProcesses[1]];
      for (const sub of subProcesses) {
        const subY = sub.get("position").y;
        const lowestY = lowest[0].get("position").y;
        const highestY = highest[0].get("position").y;
        if (Math.abs(subY - lowestY) <= 30) {
          lowest.push(sub);
        } else if (subY > lowestY) {
          lowest = [sub];
        }
        if (Math.abs(subY - highestY) <= 30) {
          highest.push(sub);
        } else if (subY < highestY) {
          highest = [sub];
        }
      }
      return {
        highest: highest,
        lowest: lowest
      };
    }
    isInvocationFromLastSubtoFirstSub() {
      const model = this.initRappid.getOpmModel();
      const source = this.linkSource;
      const target = this.linkTarget;
      const isInvocation = (0, getLinkType)(this.newLink.attributes.name) === linkType.Invocation;
      if (!isInvocation) {
        return false;
      }
      if (source.getParent() && target.getParent() && source.getParent() === target.getParent()) {
        const subProcesses = source.getParent().getEmbeddedCells().filter(cell => cell.get("type") === "opm.Process");
        if (subProcesses.length < 2) {
          return false;
        }
        const extreams = this.getExtremeSubProcesses(subProcesses);
        if (extreams.lowest.includes(source) && extreams.highest.includes(target)) {
          return true;
        }
      }
      return false;
    }
    tryToConnect() {
      var _this = this;
      return (0, default)(function* () {
        const model = _this.initRappid.getOpmModel();
        const source = _this.linkSource;
        let target = _this.linkTarget;
        const name = _this.newLink.attributes.name;
        const isCondition = _this.newLink.attributes.name.includes("Condition");
        const isEvent = _this.newLink.attributes.name.includes("Event");
        const isNegation = _this.notSelection === "NOT" || _this.orxorSelection === "NOT";
        const params = {
          type: (0, getLinkType)(name),
          connection: linkConnectionType.enviromental,
          isCondition,
          isEvent,
          isNegation
        };
        let targets; // used in case of multi targets
        if (params.type === linkType.Exhibition) {
          targets = _this.initRappid.selection.collection.models.filter(el => !el.get("type").includes("Triangle"));
        } else {
          targets = _this.initRappid.selection.collection.models.filter(e => target.get("type") === e.get("type"));
        }
        targets = targets.filter(e => {
          if (e.constructor.name.includes("State") && e.getParentCell() && targets.includes(e.getParentCell())) {
            return false;
          }
          return true;
        });
        if (targets.length !== 1 || targets[0] === target) {
          if (targets.indexOf(target) === -1) {
            targets.push(target);
          }
          targets = (0, removeDuplicationsInArray)(targets);
          targets = targets.filter(a => a !== source);
        }
        const isInvocationFromLastToFirst = _this.isInvocationFromLastSubtoFirstSub();
        if (isInvocationFromLastToFirst) {
          target = target.getParent();
          (0, validationAlert)("Invocation link from the last sub process to the first is redundant, connected to the in-zoomed process instead.", 6000);
          targets = [target];
        }
        const visualSource = model.getVisualElementById(source.id);
        if (targets.length >= 2) {
          // if multiple targets exists
          const visualTargets = targets.map(t => model.getVisualElementById(t.id));
          return Promise.resolve({
            result: model.connectMultiple(visualSource, visualTargets, params),
            affected: visualTargets.concat(visualSource)
          });
        }
        const visualTarget = model.getVisualElementById(target.id);
        if (params.type === linkType.Instrument && OPCloudUtils.isInstanceOfVisualState(visualSource)) {
          const currentStatesConnectedLinks = visualSource.fatherObject.getChildrenLinks().outGoing.filter(l => l.source.constructor.name.includes("State") && l.target === visualTarget && l.type === linkType.Instrument);
          const currentStatesConnectedLIDs = currentStatesConnectedLinks.map(l => l.source.logicalElement.lid);
          if (!currentStatesConnectedLIDs.includes(visualSource.logicalElement.lid)) {
            currentStatesConnectedLIDs.push(visualSource.logicalElement.lid);
          }
          const allStatesLIDs = visualSource.fatherObject.logicalElement.states.map(s => s.lid);
          if (allStatesLIDs.length === currentStatesConnectedLIDs.length) {
            model.logForUndo("Automatic link connection");
            model.setShouldLogForUndoRedo(false, "Automatic link connection");
            const ret = model.allStatesInstrumentConnection(visualSource, visualTarget, currentStatesConnectedLinks, params);
            if (ret.result.success) {
              source.getParentCell().updateView(source.getParentCell().getVisual());
              source.getParentCell().shiftEmbeddedToEdge(_this.initRappid);
            }
            model.setShouldLogForUndoRedo(true, "Automatic link connection");
            if (ret.result.success) {
              (0, validationAlert)("The link has moved because when an object is connected to a process both from all of its states, the correct connection is from the object itself to the process.");
            }
            return Promise.resolve(ret);
          }
        } else if (params.type === linkType.Instrument && OPCloudUtils.isInstanceOfVisualObject(visualSource)) {
          const currentStatesConnectedLinks = visualSource.getChildrenLinks().outGoing.filter(l => l.source.constructor.name.includes("State") && l.target === visualTarget && l.type === linkType.Instrument);
          if (currentStatesConnectedLinks.length > 0) {
            const ret = model.allStatesInstrumentConnectionFromFather(visualSource, visualTarget, currentStatesConnectedLinks, params);
            if (ret.result.success) {
              source.updateView(visualSource);
              source.shiftEmbeddedToEdge(_this.initRappid);
              (0, validationAlert)("When an object is connected to a process both from itself and its states, only the link originating from the object itself will persist.");
            }
            return Promise.resolve(ret);
          }
        }
        const result = model.connect(visualSource, visualTarget, params);
        if (!result.success && result.changeAction) {
          const retResult = yield result.changeAction(visualSource, visualTarget, _this.initRappid);
          if (retResult.changed) {
            return _this.tryToConnect();
          } else {
            result.message = undefined;
          }
        }
        return Promise.resolve({
          result: result,
          affected: [visualSource, visualTarget]
        });
      })();
    }
    replaceTriangle() {
      const model = this.initRappid.getOpmModel();
      const source = this.linkSource;
      const target = this.linkTarget;
      const name = this.newLink.attributes.name;
      const visualSource = model.getVisualElementById(source.id);
      const visualTarget = model.getVisualElementById(target.id);
      const type = (0, getLinkType)(name);
      if (structural.contains(type)) {
        return {
          result: model.replaceTriangle(visualSource, visualTarget, this.replaceTriangleLink, type),
          affected: [visualSource, visualTarget]
        };
      }
      return {
        result: {
          success: false,
          message: "Not a triangle"
        },
        affected: []
      };
    }
    createInOutPair() {
      const model = this.initRappid.getOpmModel();
      const source = this.linkSource;
      const target = this.linkTarget;
      const name = this.newLink.attributes.name;
      const visualSource = model.getVisualElementById(source.id);
      const visualTarget = model.getVisualElementById(target.id);
      let type;
      if (name.includes("Condition")) {
        type = InOutPairType.Condition;
      } else if (name.includes("Event")) {
        type = InOutPairType.Event;
      } else if (name.includes("Split")) {
        type = InOutPairType.Split;
      } else {
        type = InOutPairType.Standart;
      }
      const result = model.connectInOurPair(visualSource, visualTarget, type);
      return {
        result,
        affected: [visualSource, visualTarget]
      };
    }
    isSourceObject() {
      return this.linkSource.get("type").includes("Object");
    }
    isSourceProcess() {
      return this.linkSource.get("type").includes("Process");
    }
    isSourceState() {
      return this.linkSource.get("type").includes("State");
    }
    numberOfStatesSelected() {
      const numberOfSelectedStates = this.multiTargets.filter(mod => mod.get("type").includes("State"));
      return numberOfSelectedStates.length;
    }
    isSourceInTargets() {
      let selectedTargets = this.multiTargets;
      if (selectedTargets.length === 0) {
        selectedTargets = [this.linkTarget];
      }
      return selectedTargets.indexOf(this.linkSource) !== -1;
    }
    checkStructural(link) {
      if (link.name === "Exhibition-Characterization" || link.name === "Generalization-Specialization") {
        const condition1 = !this.isStateSelected() && this.isSourceState();
        const condition2 = this.isStateSelected() && this.isSourceObject();
        const condition6 = this.isSourceObject() && this.isProcessSelected();
        const condition7 = this.isSourceProcess() && this.isObjectSelected() && !this.isStateSelected();
        const condition8 = this.isSourceObject() && this.isObjectSelected() && !this.isProcessSelected() && !this.isStateSelected();
        const condition9 = this.isSourceProcess() && this.isProcessSelected() && !this.isObjectSelected() && !this.isStateSelected();
        const condition10 = this.isSourceProcess() && this.isStateSelected();
        const condition11 = this.isStateSelected() && this.isSourceState();
        return condition1 || condition2 || condition6 || condition7 || condition8 || condition9 || condition10 || condition11;
      } else {
        const condition3 = this.isSourceProcess() && !this.isObjectSelected();
        const condition4 = this.isSourceObject() && !this.isProcessSelected() && !this.isStateSelected();
        const condition5 = this.isSourceState() && this.isObjectSelected() && !this.isProcessSelected() && !this.isStateSelected();
        const condition9 = this.isSourceObject() && !this.isProcessSelected() && this.isStateSelected() && link.name === "Aggregation-Participation";
        return condition3 || condition4 || condition5 || condition9;
      }
    }
    checkRelationLinks() {
      const case1 = (this.isSourceObject() || this.isSourceState()) && (this.isObjectSelected() || this.isStateSelected()) && !this.isProcessSelected();
      const case2 = this.isSourceProcess() && this.isProcessSelected() && !this.isStateSelected() && !this.isObjectSelected();
      return case1 || case2;
    }
    isObjectSelected() {
      let selectedTargets = this.multiTargets;
      if (selectedTargets.length === 0) {
        selectedTargets = [this.linkTarget];
      }
      selectedTargets = selectedTargets.filter(sel => sel.get("type").includes("Object"));
      return selectedTargets.length > 0;
    }
    isProcessSelected() {
      let selectedTargets = this.multiTargets;
      if (selectedTargets.length === 0) {
        selectedTargets = [this.linkTarget];
      }
      selectedTargets = selectedTargets.filter(sel => sel.get("type").includes("Process"));
      return selectedTargets.length > 0;
    }
    isStateSelected() {
      let selectedTargets = this.multiTargets;
      if (selectedTargets.length === 0) {
        selectedTargets = [this.linkTarget];
      }
      selectedTargets = selectedTargets.filter(sel => sel.get("type").includes("State"));
      return selectedTargets.length > 0;
    }
    onClickedExit(link) {
      var _this2 = this;
      return (0, default)(function* () {
        _this2.selected = link;
        _this2.selected.graph = _this2.newLink.graph;
        _this2.newLink.attributes.name = _this2.selected.name;
        const name = _this2.selected.name;
        let ret;
        if (_this2.replaceTriangleLink) {
          ret = _this2.replaceTriangle();
        } else if (name.includes("In-out_Link_Pair") || name.includes("Split")) {
          ret = _this2.createInOutPair();
        } else {
          ret = yield _this2.tryToConnect();
        }
        if (_this2.newLink.getSourceElement()?.constructor.name.includes("Semi") && ret.result.success) {
          ret.result.created[0].sourceVisualElementPort = OpmSemifoldedFundamental.bestSemiFoldedPort(_this2.linkSource.getVisual().fatherObject, _this2.linkTarget.getVisual());
        }
        if (_this2.newLink.getTargetElement()?.constructor.name.includes("Semi") && ret.result.success) {
          ret.result.created[0].targetVisualElementPort = OpmSemifoldedFundamental.bestSemiFoldedPort(_this2.linkTarget.getVisual().fatherObject, _this2.linkSource.getVisual());
        }
        _this2.newLink.remove();
        if (ret.result?.success) {
          _this2.initRappid.opmModel.setShouldLogForUndoRedo(false, "DialogComponent-onClickedExit1");
          const graph = _this2.initRappid.getGraphService();
          const isNewCreated = ret.result.created.length > 0;
          const toDraw = _this2.initRappid.opmModel.currentOpd.visualElements.filter(vis => vis instanceof OpmLink && !_this2.initRappid.graph.getCell(vis.id) && vis.visible !== false);
          if (isNewCreated && ret.result.created[0].type === linkType.Invocation && ret.result.created[0].source === ret.result.created[0].target) {
            _this2.linkSource.addOldPortsForSelfInvocation();
          }
          graph.updateLinksView(toDraw);
          graph.viewRemove(ret.result.removed);
          graph.viewEntityUpadate(ret.affected);
          if (isNewCreated && ret.result.created[0].type === linkType.Invocation) {
            const drawnInvocation = _this2.initRappid.graph.getCell(ret.result.created[0]);
            const cellView = _this2.initRappid.paper.findViewByModel(drawnInvocation);
            _this2.initRappid.opmModel.setShouldLogForUndoRedo(false, "DialogComponent-onClickedExit2");
            drawnInvocation?.pointerUpHandle(cellView, _this2.initRappid);
            _this2.initRappid.opmModel.setShouldLogForUndoRedo(true, "DialogComponent-onClickedExit2");
          }
          if (isNewCreated && ret.result.created[0].type === linkType.Result) {
            const createdDrawn = _this2.initRappid.graph.getCell(ret.result.created[0].id);
            if (createdDrawn) {
              uniteResults([createdDrawn]);
            }
          } else if (isNewCreated) {
            const createdDrawn = _this2.initRappid.graph.getCell(ret.result.created[0].id);
            if (createdDrawn && ret.result.created[0].type === linkType.Consumption) {
              uniteConsumptions([createdDrawn]);
            } else if (createdDrawn && (ret.result.created[0].type === linkType.Agent || ret.result.created[0].type === linkType.Instrument)) {
              uniteAgentsAndInstruments([createdDrawn]);
            }
          }
          if (ret.result.warnings && ret.result.warnings.length > 0) {
            ret.result.warnings.forEach(w => (0, validationAlert)(w));
          }
          if (isNewCreated && ret.result.created[0].type === linkType.Invocation && ret.result.created[0].source === ret.result.created[0].target) {
            _this2.linkSource.removeUnusedPorts();
            _this2.graph.getCell(ret.result.created[0].id)?.addHandle();
          }
        } else {
          (0, validationAlert)(ret.result.message, null, "Error");
        }
        if (_this2.orxorSelection && _this2.orxorSelection !== "None" && ret.result.success && ret.result.created.length > 0) {
          const linksToConnect = [];
          const point = _this2.getTargetsMidPoint(ret.result.created);
          let side = "source";
          if (ret.result.created[0].type === linkType.Effect && _this2.linkSource instanceof OpmProcess) {
            side = "target";
          }
          let port = _this2.linkSource instanceof OpmState ? 10 : _this2.linkSource.findClosestEmptyPort(point);
          _this2.initRappid.selection.collection.reset([]);
          for (const created of ret.result.created) {
            const drawnLink = _this2.initRappid.graph.getCell(created.id);
            if (!drawnLink) {
              continue;
            }
            linksToConnect.push(drawnLink);
            drawnLink.set(side, {
              id: drawnLink.get(side).id,
              port: port
            });
            created.sourceVisualElementPort = port;
          }
          const linkDirection = side === "target" ? {
            inbound: true
          } : {
            outbound: true
          };
          if (linksToConnect[0] && !linksToConnect[0].triangle) {
            linksToConnect[0].repositionPort(side, _this2.linkSource, linkDirection, _this2.initRappid);
          }
          const arc = side === "target" ? linksToConnect[0].getTargetArcOnLink() : linksToConnect[0].getSourceArcOnLink();
          if (_this2.orxorSelection === "OR" && !linksToConnect[0].triangle && arc) {
            arc.toggleArcType();
          }
        }
        if (_this2.notSelection && _this2.notSelection.toUpperCase() !== "NONE" && ret.result.success && ret.result.created.length > 1) {
          const linksToConnect = [];
          const point = _this2.getTargetsMidPoint(ret.result.created);
          let side = "source";
          if (ret.result.created[0].type === linkType.Effect && _this2.linkSource instanceof OpmObject) {
            side = "target";
          }
          let port = _this2.linkSource instanceof OpmState ? 10 : _this2.linkSource.findClosestEmptyPort(point);
          _this2.initRappid.selection.collection.reset([]);
          for (const created of ret.result.created) {
            const drawnLink = _this2.initRappid.graph.getCell(created.id);
            if (!drawnLink) {
              continue;
            }
            linksToConnect.push(drawnLink);
            drawnLink.set(side, {
              id: drawnLink.get(side).id,
              port: port
            });
            created.sourceVisualElementPort = port;
          }
          const linkDirection = side === "target" ? {
            inbound: true
          } : {
            outbound: true
          };
          if (linksToConnect[0] && !linksToConnect[0].triangle) {
            linksToConnect[0].repositionPort(side, _this2.linkSource, linkDirection, _this2.initRappid);
          }
          const arc = side === "target" ? linksToConnect[0].getTargetArcOnLink() : linksToConnect[0].getSourceArcOnLink();
          if (_this2.orxorSelection === "None" && !linksToConnect[0].triangle && arc) {
            arc.toggleArcType(_this2.notSelection);
          }
        }
        _this2.initRappid.opmModel.setShouldLogForUndoRedo(true, "DialogComponent-onClickedExit1");
        _this2.close.emit(_this2.selected);
        _this2.dialogRef.close(_this2.selected);
      })();
    }
    getTargetsMidPoint(created) {
      const point = {
        x: 0,
        y: 0
      };
      for (const link of created) {
        const drawnLink = this.initRappid.graph.getCell(link.id);
        if (drawnLink) {
          const cellView = this.initRappid.paper.findViewByModel(drawnLink);
          const target = cellView.getPointAtLength(-1);
          point.x += target.x;
          point.y += target.y;
        }
      }
      point.x = point.x / created.length;
      point.y = point.y / created.length;
      return point;
    }
    filterArray(selection) {
      let filteredFinalArray = [];
      for (let i = 0; i < selection.length; i++) {
        if (selection[i] instanceof OpmObject || selection[i] instanceof OpmProcess) {
          filteredFinalArray.push(selection[i]);
        }
      }
      return filteredFinalArray;
    }
    legalLinks() {
      let link_attrs = LinkConstraints.isValidLink(this.newLink, this.selected.name, this.initRappid);
      if (!link_attrs.isValidLink) {
        (0, validationAlert)(link_attrs.errorMessage, null, "Error");
        this.DefaultExit(this.newLink);
        return false;
      }
      let prevTragetNewlinkid = this.newLink.get("target").id;
      let prevTragetNewlinkPort = this.newLink.get("target").port;
      if (this.newLink.selection && this.newLink.selection.collection.models) {
        this.selected.targetId = this.newLink.get("target").id;
        for (let i = 0; i < this.newLink.selection.collection.models.length; i++) {
          if (this.newLink.selection.collection.models[i].id !== this.selected.targetId) {
            this.newLink.set("target", {
              id: this.newLink.selection.collection.models[i].id
            });
            let link_attrs = LinkConstraints.isValidLink(this.newLink, this.selected.name, this.initRappid);
            if (!link_attrs.isValidLink) {
              (0, validationAlert)(link_attrs.errorMessage, null, "Error");
              this.DefaultExit(this.newLink);
              return false;
            }
          }
        }
      }
      const target = {
        id: prevTragetNewlinkid
      };
      if (prevTragetNewlinkPort) {
        target.port = prevTragetNewlinkPort;
      }
      // this.newLink.set('target', target);
      return true;
    }
    /**
     * Alon: creating links from state to object
     */
    stateToObject() {
      let partner;
      const source = this.linkSource;
      const target = this.linkTarget;
      const isCondition = null;
      const isEvent = null;
      const isNegation = null;
      partner = this.findPartner(source, target);
      if (partner === null || partner === undefined) {
        const consumptionLink = new ConsumptionLink_ConsumptionLink(source, target, isCondition, isEvent, isNegation);
        const resultLink = new ResultLink_ResultLink(target, source.getAncestors()[0], isCondition, isEvent);
        consumptionLink.set("previousTargetId", target.id);
        consumptionLink.set("previousSourceId", source.id);
        resultLink.set("previousTargetId", target.id);
        resultLink.set("previousSourceId", source.id);
        consumptionLink.partner = resultLink;
        resultLink.partner = consumptionLink;
        resultLink.set("fromState", "stateToObject");
        this.graph.addCell(consumptionLink);
        this.graph.addCell(resultLink);
        // this.graph.getConnectedLinks(this.linkSource)[0].remove();
        this.findDefault(source, target).remove();
      } else {
        this.findDefault(source, target).remove();
      }
      this.close.emit(this.selected);
      this.dialogRef.close(this.selected);
    }
    processToState() {
      let partner;
      const source = this.linkSource;
      const target = this.linkTarget;
      const isCondition = null;
      const isEvent = null;
      const isNegation = null;
      partner = this.findPartner(source, target);
      if (partner === null || partner === undefined) {
        const consumptionLink = new ConsumptionLink_ConsumptionLink(source, target, isCondition, isEvent, isNegation);
        const resultLink = new ResultLink_ResultLink(target.getAncestors()[0], source, isCondition, isEvent);
        consumptionLink.set("previousTargetId", source.id);
        consumptionLink.set("previousSourceId", target.id);
        resultLink.set("previousTargetId", source.id);
        resultLink.set("previousSourceId", target.id);
        consumptionLink.partner = resultLink;
        resultLink.partner = consumptionLink;
        resultLink.set("fromState", "ProcessToState");
        this.graph.addCell(consumptionLink);
        this.graph.addCell(resultLink);
        // this.graph.getConnectedLinks(this.linkSource)[0].remove();
        this.findDefault(source, target).remove();
      } else {
        this.findDefault(source, target).remove();
      }
      this.close.emit(this.selected);
      this.dialogRef.close(this.selected);
    }
    findPartner(source, target) {
      let partnerFound;
      let linkArr = this.graph.getConnectedLinks(source).length > 1 ? this.graph.getConnectedLinks(source) : this.graph.getConnectedLinks(target);
      for (let i = 0; i < linkArr.length; i++) {
        if (linkArr[i].partner) {
          partnerFound = linkArr[i].partner;
          break;
        }
      }
      return partnerFound;
    }
    findDefault(source, target) {
      let defaultLink;
      let linkArr = this.graph.getConnectedLinks(source).length > 1 ? this.graph.getConnectedLinks(source) : this.graph.getConnectedLinks(target);
      for (let i = 0; i < linkArr.length; i++) {
        if (linkArr[i].attr("line/strokeDasharray") === "8 5") {
          defaultLink = linkArr[i];
          break;
        }
      }
      return defaultLink;
    }
    // use for colors
    get_style(data) {
      switch (data) {
        case "opm.Object":
          return "#00b050";
        case "opm.Process":
          return "#0070c0";
        case "opm.State":
          return "#808000";
      }
    }
    // check link array size
    check_empty(links_set) {
      if (links_set.length === 0) {
        return this.noshow;
      } else {
        return this.show;
      }
    }
    // IsPhysicalObject(element) {
    //   if (element instanceof OpmObject) {
    //     return element.attributes.attrs.rect.filter.args.dx != 0;
    //   }
    //   if (element instanceof OpmState) {
    //     return this.graph.getCell(element.attributes.father).attributes.attrs.rect.filter.args.dx != 0;
    //   }
    // }
    // Kfir: not sure if this function is required
    IsPhysicalObject(element) {
      if (element instanceof OpmObject) {
        return element.getEssence() === Essence.Physical;
      }
      if (element instanceof OpmState) {
        return this.graph.getCell(element.attributes.father).getEssence() === Essence.Physical;
      }
    }
    replacename(linkname) {
      let serv = linkname;
      let ch;
      if (typeof linkname !== "undefined") {
        for (ch of serv) {
          // if (ch === '_' || ch === '-' || ch === ' '){
          //   serv.charAt(serv.indexOf(ch)+1).toUpperCase();
          // }
          if (serv.indexOf("_") >= 0) {
            serv = linkname.replace(/_/g, " ");
          }
          // else if (serv.indexOf('-') >= 0) {
          //   serv = linkname.replace(/-/g, ' ');
          // }
        }
        if (linkname === "In-out_Link_Pair") {
          serv = "In-Out Link Pair";
        } else if (linkname === "In-out_Link_Pair_Condition") {
          serv = "In-Out Condition Link Pair";
        } else if (linkname === "In-out_Link_Pair_Event") {
          serv = "In-Out Event Link Pair";
        } else if (linkname === "OvertimeUndertime-exception") {
          serv = "Overtime-Undertime Exception";
        } else if (linkname === "Split_input") {
          serv = "Split Input Link Pair";
        } else if (linkname === "Split_output") {
          serv = "Split Output Link Pair";
        }
      }
      let uppercaseChar;
      for (let character of serv) {
        if (character === " ") {
          //character === '_' || character === '-' ||
          uppercaseChar = serv.charAt(serv.indexOf(character) + 1).toUpperCase();
          break;
        }
      }
      let arr = Array.from(serv);
      if (arr.indexOf(" ") > 0) {
        arr.splice(arr.indexOf(" ") + 1, 1, uppercaseChar);
        serv = arr.join("");
      }
      return serv;
    }
    agentUpdateNotIfNecessary(event) {
      this.notSelection = event.target.value === "NOT" ? "NOT" : "NONE";
      this.agentNotSelection = event.target.value === "NOT";
    }
    instrumentUpdateNotIfNecessary(event) {
      this.notSelection = event.target.value === "NOT" ? "NOT" : "NONE";
      this.instrumentNotSelection = event.target.value === "NOT";
    }
    consumptionUpdateNotIfNecessary(event) {
      this.notSelection = event.target.value === "NOT" ? "NOT" : "NONE";
      this.consumptionNotSelection = event.target.value === "NOT";
    }
    effectUpdateNotIfNecessary(event) {
      this.notSelection = event.target.value === "NOT" ? "NOT" : "NONE";
      this.effectNotSelection = event.target.value === "NOT";
    }
    agentNotChange(event) {
      this.notSelection = event.target.value;
      this.agentNotSelection = event.target.value === "NOT";
      const allNOTSelections = document.getElementsByClassName("AgentNOTSelection");
      for (const sel of allNOTSelections) {
        sel.value = this.notSelection;
      }
    }
    instrumentNotChange(event) {
      this.notSelection = event.target.value;
      this.instrumentNotSelection = event.target.value === "NOT";
      const allNOTSelections = document.getElementsByClassName("InstrumentNOTSelection");
      for (const sel of allNOTSelections) {
        sel.value = this.notSelection;
      }
    }
    consumptionNotChange(event) {
      this.notSelection = event.target.value;
      this.consumptionNotSelection = event.target.value === "NOT";
      const allNOTSelections = document.getElementsByClassName("ConsumptionNOTSelection");
      for (const sel of allNOTSelections) {
        sel.value = this.notSelection;
      }
    }
    effectNotChange(event) {
      this.notSelection = event.target.value;
      this.effectNotSelection = event.target.value === "NOT";
      const allNOTSelections = document.getElementsByClassName("EffectNOTSelection");
      for (const sel of allNOTSelections) {
        sel.value = this.notSelection;
      }
    }
    orXorChange(event) {
      this.orxorSelection = event.target.value;
      const allOrXorSelections = document.getElementsByClassName("ORXORSelection");
      for (const sel of allOrXorSelections) {
        sel.value = this.orxorSelection;
      }
    }
    // Close Button
    DefaultExit(link) {
      this.close.emit("event");
      // if (link.getSourceElement().constructor.name.includes('Semi'))
      //   link.getSourceElement().set('type', 'opm.SemiFolded');
      link.remove();
      this.dialogRef.close();
    }
    area() {
      return this.width * this.height;
    }
    onWindowPress(event) {
      this.draggingWindow = true;
      this.px = event.clientX;
      this.py = event.clientY;
    }
    onWindowDrag(event) {
      if (!this.draggingWindow) {
        return;
      }
      const offsetX = event.clientX - this.px;
      const offsetY = event.clientY - this.py;
      this.x += offsetX;
      this.y += offsetY;
      this.px = event.clientX;
      this.py = event.clientY;
    }
    topLeftResize(offsetX, offsetY) {
      this.x += offsetX;
      this.y += offsetY;
      this.width -= offsetX;
      this.height -= offsetY;
    }
    topRightResize(offsetX, offsetY) {
      this.y += offsetY;
      this.width += offsetX;
      this.height -= offsetY;
    }
    bottomLeftResize(offsetX, offsetY) {
      this.x += offsetX;
      this.width -= offsetX;
      this.height += offsetY;
    }
    bottomRightResize(offsetX, offsetY) {
      this.width += offsetX;
      this.height += offsetY;
    }
    onCornerClick(event, resizer) {
      this.draggingCorner = true;
      this.px = event.clientX;
      this.py = event.clientY;
      this.resizer = resizer;
      event.preventDefault();
      event.stopPropagation();
    }
    onCornerMove(event) {
      if (!this.draggingCorner) {
        return;
      }
      const offsetX = event.clientX - this.px;
      const offsetY = event.clientY - this.py;
      const lastX = this.x;
      const lastY = this.y;
      const pWidth = this.width;
      const pHeight = this.height;
      this.resizer(offsetX, offsetY);
      if (this.width < this.width_min || this.height < this.height_min) {
        this.x = lastX;
        this.y = lastY;
        this.width = pWidth;
        this.height = pHeight;
      }
      this.px = event.clientX;
      this.py = event.clientY;
    }
    onCornerRelease(event) {
      this.draggingWindow = false;
      this.draggingCorner = false;
    }
    ShowAlret() {
      return this.noshow;
    }
    setLinkDisplayAgent(event) {
      this.agentSelection = event.target.value;
    }
    setLinkDisplayInsturment(event) {
      this.instrumentSelection = event.target.value;
    }
    setLinkDisplayConsumption(event) {
      this.consumptionSelection = event.target.value;
    }
    setLinkDisplayEffect(event) {
      this.effectSelection = event.target.value;
    }
    setLinkDisplayException(event) {
      this.exceptionSelection = event.target.value;
    }
    setLinkDisplaySplit(event) {
      this.splitSelection = event.target.value;
    }
    shouldBeDisabled(type) {
      if (this._shouldBeDisabled.hasOwnProperty(type)) {
        return this._shouldBeDisabled[type];
      }
      let lType;
      if (type.includes("Agent")) {
        lType = linkType.Agent;
      } else if (type.includes("Instrument")) {
        lType = linkType.Instrument;
      } else if (type.includes("Invocation")) {
        lType = linkType.Invocation;
      } else if (type.includes("Result")) {
        lType = linkType.Result;
      } else if (type.includes("Consumption")) {
        lType = linkType.Consumption;
      } else if (type.includes("UndertimeOvertimeException")) {
        lType = linkType.UndertimeOvertimeException;
      } else if (type.includes("Effect")) {
        lType = linkType.Effect;
      } else if (type.includes("Overtime")) {
        lType = linkType.OvertimeException;
      } else if (type.includes("Undertime")) {
        lType = linkType.UndertimeException;
      } else if (type.includes("Unidirectional")) {
        lType = linkType.Unidirectional;
      } else if (type.includes("Bidirectional")) {
        lType = linkType.Bidirectional;
      } else if (type.includes("Aggregation")) {
        lType = linkType.Aggregation;
      } else if (type.includes("Exhibition")) {
        lType = linkType.Exhibition;
      } else if (type.includes("Generalization")) {
        lType = linkType.Generalization;
      } else if (type.includes("Instantiation")) {
        lType = linkType.Instantiation;
      }
      const can = this.initRappid.opmModel.links.canConnect(this.linkSource.getVisual(), this.linkTarget.getVisual(), lType);
      this._shouldBeDisabled[type] = can;
      return can;
    }
    getToolTipMessages(name) {
      // if (this.shouldBeDisabled(name).success === true)
      return this.shouldBeDisabled(name).warnings.join("\n");
      // return '';
      // return this.shouldBeDisabled(link.name).message;
    }
    shouldShowWarningSign(name) {
      const ret = this.shouldBeDisabled(name);
      if (ret.success === true && ret.warnings && ret.warnings.length > 0) {
        return true;
      }
      if (ret.success === false && ret.warnings && ret.warnings.length > 0) {
        return true;
      }
      return false;
    }
    shouldShowExceptionLinks(type) {
      if (!this.isSourceProcess() && !this.isSourceState() && !this.isSourceInTargets() && this.isProcessSelected() && !this.isObjectSelected() && !this.isStateSelected()) {
        return false;
      }
      if (this.isSourceObject()) {
        return false;
      }
      if (this.isSourceProcess()) {
        return true;
      }
      const isDuration = this.linkSource.getVisual().logicalElement.isTimeDuration();
      const duration = this.linkSource.getVisual().logicalElement.getDurationManager().getTimeDuration();
      if (type === "all" && (!isDuration || !duration.max && !duration.min)) {
        return false;
      } else if (type === "overtime" && !duration.max) {
        return false;
      } else if (type === "undertime" && !duration.min) {
        return false;
      } else if (type === "overtimeundertime" && (!duration.max || !duration.min)) {
        return false;
      }
      return true;
    }
    static #_ = (() => this.ɵfac = function LinksDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LinksDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: LinksDialogComponent,
      selectors: [["opcloud-choose-link-dialog"]],
      hostBindings: function LinksDialogComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵlistener */.bIt("mousemove", function LinksDialogComponent_mousemove_HostBindingHandler($event) {
            return ctx.onCornerMove($event);
          }, false, core /* ɵɵresolveDocument */.EBC)("mouseup", function LinksDialogComponent_mouseup_HostBindingHandler($event) {
            return ctx.onCornerRelease($event);
          }, false, core /* ɵɵresolveDocument */.EBC);
        }
      },
      decls: 34,
      vars: 23,
      consts: [["regularCase", ""], ["negationCase", ""], ["regularOPLCase", ""], ["negationOPLCase", ""], ["id", "dialog", 3, "mousedown", "mousemove"], ["id", "dialog-top-left-resize", 1, "dialog-corner-resize", 3, "mousedown"], ["id", "dialog-top-right-resize", 1, "dialog-corner-resize", 3, "mousedown"], ["id", "dialog-bottom-left-resize", 1, "dialog-corner-resize", 3, "mousedown"], ["id", "dialog-bottom-right-resize", 1, "dialog-corner-resize", 3, "mousedown"], [1, "exit-button", 3, "click"], ["width", "10", "height", "13", "viewBox", "0 0 10 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M9.54 1L1 12M1 1L9.54 12", "stroke", "#586D8C"], [1, "move-button"], ["width", "18", "height", "20", "viewBox", "0 0 22 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.8936 10.3536C21.0888 10.1583 21.0888 9.84171 20.8936 9.64645L17.7116 6.46447C17.5163 6.2692 17.1997 6.2692 17.0045 6.46447C16.8092 6.65973 16.8092 6.97631 17.0045 7.17157L19.8329 10L17.0045 12.8284C16.8092 13.0237 16.8092 13.3403 17.0045 13.5355C17.1997 13.7308 17.5163 13.7308 17.7116 13.5355L20.8936 10.3536ZM12 10.5H20.54V9.5H12V10.5Z", "fill", "#586D8C"], ["d", "M1.09554 9.64645C0.900274 9.84171 0.900274 10.1583 1.09554 10.3536L4.27752 13.5355C4.47278 13.7308 4.78936 13.7308 4.98462 13.5355C5.17989 13.3403 5.17989 13.0237 4.98462 12.8284L2.1562 10L4.98462 7.17157C5.17989 6.97631 5.17989 6.65973 4.98462 6.46447C4.78936 6.2692 4.47278 6.2692 4.27752 6.46447L1.09554 9.64645ZM12 9.5L1.44909 9.5V10.5L12 10.5V9.5Z", "fill", "#586D8C"], ["d", "M11.3536 0.191901C11.1583 -0.00336151 10.8417 -0.00336151 10.6464 0.191901L7.46447 3.37388C7.2692 3.56914 7.2692 3.88573 7.46447 4.08099C7.65973 4.27625 7.97631 4.27625 8.17157 4.08099L11 1.25256L13.8284 4.08099C14.0237 4.27625 14.3403 4.27625 14.5355 4.08099C14.7308 3.88573 14.7308 3.56914 14.5355 3.37388L11.3536 0.191901ZM11.5 10V0.545454H10.5V10H11.5Z", "fill", "#586D8C"], ["d", "M10.6464 19.8081C10.8417 20.0034 11.1583 20.0034 11.3536 19.8081L14.5355 16.6261C14.7308 16.4309 14.7308 16.1143 14.5355 15.919C14.3403 15.7237 14.0237 15.7237 13.8284 15.919L11 18.7474L8.17157 15.919C7.97631 15.7237 7.65973 15.7237 7.46447 15.919C7.2692 16.1143 7.2692 16.4309 7.46447 16.6261L10.6464 19.8081ZM10.5 10V19.4545H11.5V10H10.5Z", "fill", "#586D8C"], [1, "aboveLinkstext"], ["data-tooltip-position", "above", 3, "matTooltip"], ["data-tooltip-position", "above", 3, "color", "matTooltip", 4, "ngFor", "ngForOf"], [1, "linkBoxes"], ["id", "Structrial", 4, "ngIf"], ["id", "Relation", 4, "ngIf"], ["id", "Result", 4, "ngIf"], ["id", "In_out_Link_Pair", 4, "ngIf"], ["id", "Invocation", 4, "ngIf"], ["id", "Agents", 4, "ngIf"], ["id", "Instruments", 4, "ngIf"], ["id", "Consumptions", 4, "ngIf"], ["id", "Effects", 4, "ngIf"], ["id", "Exceptions", 4, "ngIf"], ["id", "Structrial"], ["matTooltipPosition", "below", 3, "className", "matTooltip", 4, "ngFor", "ngForOf"], ["matTooltipPosition", "below", 3, "className", "matTooltip"], ["class", "grid-list", 3, "click", 4, "ngIf"], [1, "grid-list", 3, "click"], ["class", "warningSign", 4, "ngIf"], [1, "grid-tile"], [1, "item"], [1, "oplname"], [1, "opl", 3, "innerHtml"], [1, "warningSign"], ["width", "21", "height", "19", "viewBox", "0 0 21 19", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M11.6258 1.35L19.8531 15.6C20.3534 16.4667 19.728 17.55 18.7272 17.55H2.27276C1.27202 17.55 0.646555 16.4667 1.14693 15.6L9.37417 1.35C9.87454 0.483333 11.1255 0.483333 11.6258 1.35Z", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M11.1484 12.7891H9.84375L9.74219 4.625H11.2578L11.1484 12.7891ZM9.6875 15.2734C9.6875 15.0391 9.75781 14.8438 9.89844 14.6875C10.0443 14.526 10.2578 14.4453 10.5391 14.4453C10.8203 14.4453 11.0339 14.526 11.1797 14.6875C11.3255 14.8438 11.3984 15.0391 11.3984 15.2734C11.3984 15.5078 11.3255 15.7031 11.1797 15.8594C11.0339 16.0104 10.8203 16.0859 10.5391 16.0859C10.2578 16.0859 10.0443 16.0104 9.89844 15.8594C9.75781 15.7031 9.6875 15.5078 9.6875 15.2734Z", "fill", "#5A6F8F"], ["id", "Relation"], ["class", "grid-list", "matTooltipPosition", "below", 3, "className", "matTooltip", "click", 4, "ngFor", "ngForOf"], ["matTooltipPosition", "below", 1, "grid-list", 3, "click", "className", "matTooltip"], ["id", "Result"], ["class", "grid-list", "matTooltipPosition", "below", 3, "className", "matTooltip", 4, "ngFor", "ngForOf"], ["matTooltipPosition", "below", 1, "grid-list", 3, "className", "matTooltip"], [1, "grid-tile", 3, "click"], [4, "ngIf"], ["class", "selectORXOR", 4, "ngIf"], [1, "opl", 3, "click", "innerHtml"], [1, "selectORXOR"], [1, "ORXORSelection", 3, "change", "disabled"], ["value", "None", 3, "defaultSelected", 4, "ngIf"], ["value", "OR"], ["value", "XOR", 4, "ngIf"], ["value", "None", 3, "defaultSelected"], ["value", "XOR"], ["id", "In_out_Link_Pair"], [1, "grid-list"], [1, "In_out_Link_Pair"], [1, "oplname", 3, "click"], [1, "select"], [1, "minimal", "left", 3, "change"], ["selected", "", 3, "value"], [3, "value"], [1, "semi_In_out_Link_Pair"], [3, "value", 4, "ngIf"], [1, "semi_In_out_Link_Pair_to_object"], [1, "In-out_Link_Pair_Condition"], [1, "In-out_Link_Pair_Event"], ["id", "Invocation"], ["id", "Agents"], [4, "ngIf", "ngIfThen", "ngIfElse"], [1, "customColor"], ["class", "selectNOT", 4, "ngIf"], [1, "Agents", "Agent"], [1, "Agents", "Negation_Agent"], [1, "selectMultiNOT"], [1, "AgentNOTSelection", 3, "change"], ["value", "None"], ["value", "NOT"], [1, "ORXORSelection", 3, "change"], [1, "selectNOT"], [1, "Agents", "Condition_Agent"], [1, "Agents", "Negation_Condition_Agent"], [1, "Agents", "Event_Agent"], ["id", "Instruments"], [1, "Instruments", "Instrument"], [1, "Instruments", "Negation_Instrument"], [1, "InstrumentNOTSelection", 3, "change"], [1, "Instruments", "Condition_Instrument"], [1, "Instruments", "Negation_Condition_Instrument"], [1, "Instruments", "Event_Instrument"], ["id", "Consumptions"], [1, "Consumptions", "Consumption"], [1, "Consumptions", "Negation_Consumption"], [1, "ConsumptionNOTSelection", 3, "change"], [1, "Consumptions", "Condition_Consumption"], [1, "Consumptions", "Negation_Condition_Consumption"], [1, "Consumptions", "Event_Consumption"], ["id", "Effects"], [1, "Effects", "Event_Effect"], [1, "Effects", "Effect"], [1, "Effects", "Negation_Effect"], [1, "EffectNOTSelection", 3, "change"], [1, "Effects", "Condition_Effect"], [1, "Effects", "Negation_Condition_Effect"], ["id", "Exceptions"], [1, "Exceptions", "Overtime_exception"], [1, "Exceptions", "Undertime_exception"], [1, "Exceptions", "OvertimeUndertime-exception"], [1, "selectException"]],
      template: function LinksDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 4);
          core /* ɵɵlistener */.bIt("mousedown", function LinksDialogComponent_Template_div_mousedown_0_listener($event) {
            return ctx.onWindowPress($event);
          })("mousemove", function LinksDialogComponent_Template_div_mousemove_0_listener($event) {
            return ctx.onWindowDrag($event);
          });
          core /* ɵɵelementStart */.j41(1, "div", 5);
          core /* ɵɵlistener */.bIt("mousedown", function LinksDialogComponent_Template_div_mousedown_1_listener($event) {
            return ctx.onCornerClick($event, ctx.topLeftResize);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "div", 6);
          core /* ɵɵlistener */.bIt("mousedown", function LinksDialogComponent_Template_div_mousedown_2_listener($event) {
            return ctx.onCornerClick($event, ctx.topRightResize);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div", 7);
          core /* ɵɵlistener */.bIt("mousedown", function LinksDialogComponent_Template_div_mousedown_3_listener($event) {
            return ctx.onCornerClick($event, ctx.bottomLeftResize);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "div", 8);
          core /* ɵɵlistener */.bIt("mousedown", function LinksDialogComponent_Template_div_mousedown_4_listener($event) {
            return ctx.onCornerClick($event, ctx.bottomRightResize);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "div")(6, "div", 9);
          core /* ɵɵlistener */.bIt("click", function LinksDialogComponent_Template_div_click_6_listener() {
            return ctx.DefaultExit(ctx.newLink);
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(7, "svg", 10);
          core /* ɵɵelement */.nrm(8, "path", 11);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(9, "div", 12);
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(10, "svg", 13);
          core /* ɵɵelement */.nrm(11, "path", 14)(12, "path", 15)(13, "path", 16)(14, "path", 17);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(15, "header")(16, "div", 18);
          core /* ɵɵtext */.EFF(17, " Select the link kind from ");
          core /* ɵɵelementStart */.j41(18, "span", 19)(19, "label");
          core /* ɵɵtext */.EFF(20);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtext */.EFF(21, " to ");
          core /* ɵɵtemplate */.DNE(22, LinksDialogComponent_span_22_Template, 3, 5, "span", 20);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(23, "div", 21);
          core /* ɵɵtemplate */.DNE(24, LinksDialogComponent_div_24_Template, 2, 1, "div", 22)(25, LinksDialogComponent_div_25_Template, 2, 1, "div", 23)(26, LinksDialogComponent_div_26_Template, 2, 1, "div", 24)(27, LinksDialogComponent_div_27_Template, 6, 5, "div", 25)(28, LinksDialogComponent_div_28_Template, 2, 1, "div", 26)(29, LinksDialogComponent_div_29_Template, 4, 3, "div", 27)(30, LinksDialogComponent_div_30_Template, 4, 3, "div", 28)(31, LinksDialogComponent_div_31_Template, 4, 3, "div", 29)(32, LinksDialogComponent_div_32_Template, 4, 3, "div", 30)(33, LinksDialogComponent_div_33_Template, 4, 3, "div", 31);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵstyleProp */.xc7("top", ctx.y, "px")("left", ctx.x, "px")("height", ctx.height, "px")("width", ctx.width, "px");
          core /* ɵɵadvance */.R7$(18);
          core /* ɵɵstyleProp */.xc7("color", ctx.get_style(ctx.linkSource.attributes.type));
          core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx.linkSource.getVisual().logicalElement.getBareName());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.linkSource.getVisual().logicalElement.getBareName());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.multiTargets);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.check_empty(ctx.Structural_Links));
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.check_empty(ctx.Relation_Links) && ctx.checkRelationLinks());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSourceProcess() && !ctx.isProcessSelected());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.check_empty(ctx.In_out_Link_Pair) && !ctx.asOnlyOneState && !ctx.isObjectSelected() && ctx.numberOfStatesSelected() <= 1);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSourceProcess() && !ctx.isObjectSelected() && !ctx.isStateSelected());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", (ctx.isSourceObject() && ctx.isProcessSelected() && !ctx.isObjectSelected() && !ctx.isStateSelected() || ctx.isSourceState() && ctx.isProcessSelected() && !ctx.isObjectSelected() && !ctx.isStateSelected()) && ctx.IsPhysicalObject(ctx.linkSource));
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", (ctx.isSourceObject() || ctx.isSourceState()) && ctx.isProcessSelected() && !ctx.isObjectSelected() && !ctx.isStateSelected());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", (ctx.isSourceObject() || ctx.isSourceState()) && ctx.isProcessSelected() && !ctx.isObjectSelected() && !ctx.isStateSelected());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSourceObject() && !ctx.isStateSelected() && !ctx.isObjectSelected() && ctx.isProcessSelected() || ctx.isSourceProcess() && !ctx.isStateSelected() && ctx.isObjectSelected() && !ctx.isProcessSelected());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowExceptionLinks("all"));
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: [".Structrial[_ngcontent-%COMP%]{background:url(/assets/icons/OPM_Links/Structrial.png) no-repeat top left;width:80px;height:50px}.Structrial.Aggregation-Participation[_ngcontent-%COMP%]{background:url(/assets/SVG/links/structural/aggregation.svg);width:80px;height:50px}.Structrial.Exhibition-Characterization[_ngcontent-%COMP%]{background:url(/assets/SVG/links/structural/exhibition.svg);width:80px;height:50px}.Structrial.Generalization-Specialization[_ngcontent-%COMP%]{background:url(/assets/SVG/links/structural/generalization.svg);width:80px;height:50px}.Structrial.Classification-Instantiation[_ngcontent-%COMP%]{background:url(/assets/SVG/links/structural/classification.svg);width:80px;height:50px}.Structrial.Unidirectional_Tagged_Link[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/unidirectionalRelation.svg) no-repeat top left;width:80px;height:50px}.Structrial.Bidirectional_Tagged_Link[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/bidirectionalRelation.svg);width:80px;height:50px}.Agents[_ngcontent-%COMP%]{background:url(/assets/icons/OPM_Links/Agents.png) no-repeat top left;width:80px;height:50px}.Agents.Condition_Agent[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/agentCondition.svg);width:80px;height:50px}.Agents.Negation_Condition_Agent[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/agentConditionNegation.svg);width:80px;height:50px}.Agents.Event_Agent[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/agentEvent.svg);width:80px;height:50px}.Agents.Agent[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/agent.svg);width:80px;height:50px}.Agents.Negation_Agent[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/agentNegation.svg);width:80px;height:50px}.Instruments[_ngcontent-%COMP%]{background:url(/assets/icons/OPM_Links/Instruments.png) no-repeat top left;width:80px;height:50px}.Instruments.Condition_Instrument[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/instrumentCondition.svg) no-repeat top left;width:80px;height:50px}.Instruments.Negation_Condition_Instrument[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/instrumentConditionNegation.svg);width:80px;height:50px}.Instruments.Event_Instrument[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/instrumentEvent.svg) no-repeat top left;width:80px;height:50px}.Instruments.Instrument[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/instrument.svg) no-repeat top left;width:80px;height:50px}.Instruments.Negation_Instrument[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/instrumentNegation.svg);width:80px;height:50px}.Effects[_ngcontent-%COMP%]{background:url(/assets/icons/OPM_Links/Effects.png) no-repeat top left;width:80px;height:50px}.Effects.Negation_Condition_Effect[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/effectConditionNegation.svg);width:80px;height:50px}.Effects.Condition_Effect[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/effectCondition.svg);width:80px;height:50px}.Effects.Event_Effect[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/effectEvent.svg);width:80px;height:50px}.Effects.Effect[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/effect.svg) no-repeat top left;width:80px;height:50px}.Effects.Negation_Effect[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/effectNegation.svg) no-repeat top left;width:80px;height:50px}.Consumptions[_ngcontent-%COMP%]{background:url(/assets/icons/OPM_Links/Consumptions.png) no-repeat top left;width:80px;height:50px}.Consumptions.Event_Consumption[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/consumptionEvent.svg) no-repeat top left;width:80px;height:50px}.Consumptions.Negation_Condition_Consumption[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/consumptionConditionNegation.svg) no-repeat top left;width:80px;height:50px}.Consumptions.Condition_Consumption[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/consumptionCondition.svg) no-repeat top left;width:80px;height:50px}.Consumptions.Consumption[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/consumption.svg) no-repeat top left;width:80px;height:50px;rotation:0!important}.Consumptions.Negation_Consumption[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/consumptionNegation.svg) no-repeat top left;width:80px;height:50px;rotation:0!important}.Result[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/result.svg) no-repeat top left;width:80px;height:50px}.In_out_Link_Pair[_ngcontent-%COMP%]{background:url(/assets/SVG/In_Out_Link_Pair.svg) no-repeat top left;width:80px;height:50px}.In-out_Link_Pair_Condition[_ngcontent-%COMP%]{background:url(/assets/SVG/Condition_In_Out.svg) no-repeat top left;width:80px;height:50px}.In-out_Link_Pair_Event[_ngcontent-%COMP%]{background:url(/assets/SVG/Event_In_Out.svg) no-repeat top left;width:80px;height:50px}.semi_In_out_Link_Pair[_ngcontent-%COMP%]{background:url(/assets/SVG/Output_Link_pair.svg) no-repeat top left;width:80px;height:50px}.semi_In_out_Link_Pair_to_object[_ngcontent-%COMP%]{background:url(/assets/SVG/Input_Link_Pair.svg) no-repeat top left;width:80px;height:50px}.Invocation[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/invocation.svg) no-repeat top left;width:80px;height:50px}.Exceptions[_ngcontent-%COMP%]{width:80px;height:50px}.Exceptions.Overtime_exception[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/overtimeexception.svg);width:80px;height:50px}.Exceptions.Undertime_exception[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/underTime.svg);width:80px;height:50px}.Exceptions.OvertimeUndertime-exception[_ngcontent-%COMP%]{background:url(/assets/SVG/links/procedural/underOver.svg);width:80px;height:50px}#dialog[_ngcontent-%COMP%]{position:fixed;width:478px;overflow:auto;background:#fff;border:1px solid #B3B3B3;box-sizing:border-box;box-shadow:0 10px 20px #00000040,0 30px 50px #0000001a;border-radius:20px;padding:14px}.dialog-corner-resize[_ngcontent-%COMP%]{position:absolute;width:10px;height:10px}#dialog-top-left-resize[_ngcontent-%COMP%]{cursor:nwse-resize;top:0;left:0}#dialog-top-right-resize[_ngcontent-%COMP%]{top:0;right:0}#dialog-bottom-left-resize[_ngcontent-%COMP%]{cursor:nesw-resize;bottom:0;left:0}#dialog-bottom-right-resize[_ngcontent-%COMP%]{cursor:nwse-resize;bottom:0;right:0}#dialog[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]{padding:14px;text-align:center}.exit-button[_ngcontent-%COMP%]{cursor:pointer;margin-left:517px;margin-top:-9px;font-size:22px}.move-button[_ngcontent-%COMP%]{cursor:move;margin-left:483px;margin-top:-22px;font-size:22px}#dialog[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   .aboveLinkstext[_ngcontent-%COMP%]{font-family:Roboto,Arial,Helvetica,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:17px;text-align:center;margin-left:0;margin-top:-15px;color:#000}.select[_ngcontent-%COMP%]{width:150px;margin-left:230px;margin-top:-22px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.selectException[_ngcontent-%COMP%]{width:213px;margin-left:200px;margin-top:-22px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.select[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{display:block;width:150px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.selectException[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{display:block;width:210px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.selectORXOR[_ngcontent-%COMP%]{width:50px;margin-left:395px;margin-top:-42px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.selectORXOR[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{display:block;width:50px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.selectMultiNOT[_ngcontent-%COMP%]{width:50px;margin-left:165px;margin-top:-42px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.selectMultiNOT[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{display:block;width:50px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.selectNOT[_ngcontent-%COMP%]{width:50px;margin-left:165px;margin-top:-41px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.selectNOT[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{display:block;width:50px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.opl[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}.opl[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:4px;border-left:2px solid white;border-right:2px solid white}.opl[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:6px;border-left:4px solid white;border-right:4px solid white}.customColor[_ngcontent-%COMP%]{color:#497284;font-family:Roboto,Arial,Helvetica,sans-serif}#dialog[_ngcontent-c27][_ngcontent-%COMP%]   .grid-list[_ngcontent-c27][_ngcontent-%COMP%]{background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;display:flex;width:545px;height:70px;margin-bottom:6px;overflow:visible}.grid-tile[_ngcontent-%COMP%]{position:absolute;width:80px;height:50px;margin-left:3px;margin-top:8px;margin-bottom:auto;background:#49728417;border-radius:4px}#dialog[_ngcontent-%COMP%]   .grid-list[_ngcontent-%COMP%]:hover{background:#e3e3e33b}.item[_ngcontent-%COMP%]{text-align:-webkit-left;margin-left:96px}.opl[_ngcontent-%COMP%]{padding:1px;margin-top:auto;overflow-y:scroll;height:38px}.oplname[_ngcontent-%COMP%]{padding-bottom:1px;padding-top:6px;color:#586d8c;font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px}.grid-list[_ngcontent-%COMP%]{padding:5px}.grid-list[_ngcontent-%COMP%]::-webkit-scrollbar{width:8px;background-color:gray}.grid-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:4px}.grid-list[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:2px;background:#b9d2df54;border-radius:1px}.mat-mdc-form-field-appearance-legacy[_ngcontent-%COMP%], .mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.warningSign[_ngcontent-%COMP%]{margin-top:-25px;top:30px;left:-6px;position:relative}[_nghost-%COMP%] > .object[_ngcontent-%COMP%]{color:#00b050}[_nghost-%COMP%] > .process[_ngcontent-%COMP%]{color:#0070c0}[_nghost-%COMP%] > .state[_ngcontent-%COMP%]{color:olive}"]
    }))();
  }
  return LinksDialogComponent;
})();
function createCode(linkType, source, target) {
  if (linkType === "Aggregation-Participation") {
    // console.log('class ' + source + '{');
    // console.log('    ' + target + ': number;');
    // console.log('}');
  }
}
