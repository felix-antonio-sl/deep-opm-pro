// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/header/menu/menu.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function MenuComponent_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 4);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_button_1_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleMenu());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 6)(3, "rect", 7)(4, "path", 8)(5, "path", 9)(6, "path", 10);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 11);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_ng_template_2_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleMenu());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 6)(3, "rect", 12);
    core /* ɵɵelementStart */.j41(4, "g", 13);
    core /* ɵɵelement */.nrm(5, "rect", 14)(6, "path", 15)(7, "path", 16);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function MenuComponent_div_4_li_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_11_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.loadModelFromFile());
    });
    core /* ɵɵtext */.EFF(2, "Load Model From File ");
    core /* ɵɵelementStart */.j41(3, "input", 26);
    core /* ɵɵlistener */.bIt("change", function MenuComponent_div_4_li_11_Template_input_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.readSingleFile($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function MenuComponent_div_4_li_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_20_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadModel());
    });
    core /* ɵɵtext */.EFF(2, "Download Model");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_35_li_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_35_li_6_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.clickSaveExample("system"));
    });
    core /* ɵɵtext */.EFF(2, "Global Examples");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_35_li_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_35_li_7_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.clickSaveExample("org"));
    });
    core /* ɵɵtext */.EFF(2, "Organizational Examples");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_35_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li")(1, "a");
    core /* ɵɵtext */.EFF(2, "Save Example");
    core /* ɵɵelementStart */.j41(3, "mat-icon", 22);
    core /* ɵɵtext */.EFF(4, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "ul", 23);
    core /* ɵɵtemplate */.DNE(6, MenuComponent_div_4_li_35_li_6_Template, 3, 0, "li", 19)(7, MenuComponent_div_4_li_35_li_7_Template, 3, 0, "li", 19);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && ctx_r1.userService.isSysAdmin() == true);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && (ctx_r1.userService.isOrgAdmin() == true || ctx_r1.userService.isSysAdmin() == true));
  }
}
function MenuComponent_div_4__svg_svg_50_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 20);
    core /* ɵɵelement */.nrm(1, "rect", 21);
    core /* ɵɵelementEnd */.k0s();
  }
}
function MenuComponent_div_4_li_51_li_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_51_li_6_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.clickSaveStereotype());
    });
    core /* ɵɵtext */.EFF(2, "Save Stereotypes");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_51_li_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_51_li_7_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.clickLoadStereotype());
    });
    core /* ɵɵtext */.EFF(2, "Load Stereotypes");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_51_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li")(1, "a");
    core /* ɵɵtext */.EFF(2, "OPM Stereotypes");
    core /* ɵɵelementStart */.j41(3, "mat-icon", 22);
    core /* ɵɵtext */.EFF(4, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "ul", 23);
    core /* ɵɵtemplate */.DNE(6, MenuComponent_div_4_li_51_li_6_Template, 3, 0, "li", 19)(7, MenuComponent_div_4_li_51_li_7_Template, 3, 0, "li", 19);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && (ctx_r1.userService.isOrgAdmin() == true || ctx_r1.userService.isSysAdmin() == true));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && (ctx_r1.userService.isOrgAdmin() == true || ctx_r1.userService.isSysAdmin() == true));
  }
}
function MenuComponent_div_4_li_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a");
    core /* ɵɵtext */.EFF(2, "OPM Insights");
    core /* ɵɵelementStart */.j41(3, "mat-icon", 22);
    core /* ɵɵtext */.EFF(4, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "ul", 23)(6, "li")(7, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_52_Template_a_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openOpmQuery("Path Finding"));
    });
    core /* ɵɵtext */.EFF(8, "Path Finding Queries");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(9, "li")(10, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_52_Template_a_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openOpmQuery("Neighborhood"));
    });
    core /* ɵɵtext */.EFF(11, "Neighborhood Queries");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(12, "li")(13, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_52_Template_a_click_13_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openOpmQuery("Centrality"));
    });
    core /* ɵɵtext */.EFF(14, "Centrality Queries");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(15, "li")(16, "a", 27);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_52_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.flatOPM());
    });
    core /* ɵɵtext */.EFF(17, "Ultimate OPD");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function MenuComponent_div_4_li_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a");
    core /* ɵɵtext */.EFF(2, "OPM to DCM");
    core /* ɵɵelementStart */.j41(3, "mat-icon", 22);
    core /* ɵɵtext */.EFF(4, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "ul", 23)(6, "li")(7, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_53_Template_a_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openDCMExportWizard());
    });
    core /* ɵɵtext */.EFF(8, "Export DCM");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(9, "li")(10, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_53_Template_a_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openDCMViewer());
    });
    core /* ɵɵtext */.EFF(11, "View DCM Diagram");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(12, "li")(13, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_53_Template_a_click_13_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showDCMOnModel());
    });
    core /* ɵɵtext */.EFF(14, "Show DCM on Model");
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function MenuComponent_div_4__svg_svg_54_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 20);
    core /* ɵɵelement */.nrm(1, "rect", 21);
    core /* ɵɵelementEnd */.k0s();
  }
}
function MenuComponent_div_4_li_79_li_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_79_li_6_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.AIOplSummary("opd"));
    });
    core /* ɵɵtext */.EFF(2, "AI OPD Summary");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_79_li_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_79_li_7_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.AIOplSummary("model"));
    });
    core /* ɵɵtext */.EFF(2, "AI Model Summary");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_79_li_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_79_li_8_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.AIImpactAnalysis());
    });
    core /* ɵɵtext */.EFF(2, "AI Impact Analysis");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_79_li_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_79_li_9_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.AIRequirementsExport());
    });
    core /* ɵɵtext */.EFF(2, "AI Reqs Generation");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_79_li_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_li_79_li_10_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r17);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.updateGenerativeAIApiKey());
    });
    core /* ɵɵtext */.EFF(2, "Update API Key");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MenuComponent_div_4_li_79_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li")(1, "a");
    core /* ɵɵtext */.EFF(2, "GenerativeAI");
    core /* ɵɵelementStart */.j41(3, "mat-icon", 22);
    core /* ɵɵtext */.EFF(4, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "ul", 23);
    core /* ɵɵtemplate */.DNE(6, MenuComponent_div_4_li_79_li_6_Template, 3, 0, "li", 19)(7, MenuComponent_div_4_li_79_li_7_Template, 3, 0, "li", 19)(8, MenuComponent_div_4_li_79_li_8_Template, 3, 0, "li", 19)(9, MenuComponent_div_4_li_79_li_9_Template, 3, 0, "li", 19)(10, MenuComponent_div_4_li_79_li_10_Template, 3, 0, "li", 19);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && ctx_r1.userService.isGenAIUser(ctx_r1.currentUser) == true);
  }
}
function MenuComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 17)(1, "ul")(2, "li")(3, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickNewModel());
    });
    core /* ɵɵtext */.EFF(4, "New Model");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "li")(6, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.newModelByWizard());
    });
    core /* ɵɵtext */.EFF(7, "New Model By Wizard");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(8, "li")(9, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickLoadModel());
    });
    core /* ɵɵtext */.EFF(10, "Load Model");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(11, MenuComponent_div_4_li_11_Template, 4, 0, "li", 19);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(12, "svg", 20);
    core /* ɵɵelement */.nrm(13, "rect", 21);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(14, "li")(15, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_15_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickSave());
    });
    core /* ɵɵtext */.EFF(16, "Save");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(17, "li")(18, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickSaveModelAs());
    });
    core /* ɵɵtext */.EFF(19, "Save as");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(20, MenuComponent_div_4_li_20_Template, 3, 0, "li", 19);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(21, "svg", 20);
    core /* ɵɵelement */.nrm(22, "rect", 21);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(23, "li")(24, "a");
    core /* ɵɵtext */.EFF(25, "Load Example");
    core /* ɵɵelementStart */.j41(26, "mat-icon", 22);
    core /* ɵɵtext */.EFF(27, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(28, "ul", 23)(29, "li")(30, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_30_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickLoadExample("system"));
    });
    core /* ɵɵtext */.EFF(31, "Global Examples");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(32, "li")(33, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_33_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickLoadExample("org"));
    });
    core /* ɵɵtext */.EFF(34, "Organizational Examples");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵtemplate */.DNE(35, MenuComponent_div_4_li_35_Template, 8, 2, "li", 19);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(36, "svg", 20);
    core /* ɵɵelement */.nrm(37, "rect", 21);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(38, "li")(39, "a");
    core /* ɵɵtext */.EFF(40, "Templates");
    core /* ɵɵelementStart */.j41(41, "mat-icon", 22);
    core /* ɵɵtext */.EFF(42, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(43, "ul", 23)(44, "li")(45, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_45_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickTemplate("edit"));
    });
    core /* ɵɵtext */.EFF(46, "Edit Template");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(47, "li")(48, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_48_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickTemplate("save"));
    });
    core /* ɵɵtext */.EFF(49, "Save Template");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵtemplate */.DNE(50, MenuComponent_div_4__svg_svg_50_Template, 2, 0, "svg", 24)(51, MenuComponent_div_4_li_51_Template, 8, 2, "li", 19)(52, MenuComponent_div_4_li_52_Template, 18, 0, "li", 19)(53, MenuComponent_div_4_li_53_Template, 15, 0, "li", 19)(54, MenuComponent_div_4__svg_svg_54_Template, 2, 0, "svg", 24);
    core /* ɵɵelementStart */.j41(55, "li")(56, "a");
    core /* ɵɵtext */.EFF(57, "Model Options");
    core /* ɵɵelementStart */.j41(58, "mat-icon", 22);
    core /* ɵɵtext */.EFF(59, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(60, "ul", 23)(61, "li")(62, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_62_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showSystemMap());
    });
    core /* ɵɵtext */.EFF(63, "System Map");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(64, "li")(65, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_65_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.copyLink());
    });
    core /* ɵɵtext */.EFF(66, "Copy Link");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(67, "li")(68, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_68_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.modelValidationOptions());
    });
    core /* ɵɵtext */.EFF(69, "Model Validation Options");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(70, "li")(71, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_71_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.compareModel());
    });
    core /* ɵɵtext */.EFF(72, "Compare Model");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(73, "li")(74, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_74_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.markThings());
    });
    core /* ɵɵtext */.EFF(75, "Mark Things");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(76, "li")(77, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_77_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.opdTreeArrangementOptions());
    });
    core /* ɵɵtext */.EFF(78, "OPD Tree Arranging");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵtemplate */.DNE(79, MenuComponent_div_4_li_79_Template, 11, 5, "li", 19);
    core /* ɵɵelementStart */.j41(80, "li")(81, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_81_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.importModel());
    });
    core /* ɵɵtext */.EFF(82, "Import Model");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(83, "li")(84, "a");
    core /* ɵɵtext */.EFF(85, "Exports");
    core /* ɵɵelementStart */.j41(86, "mat-icon", 22);
    core /* ɵɵtext */.EFF(87, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(88, "ul", 23)(89, "li")(90, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_90_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.exportOPL());
    });
    core /* ɵɵtext */.EFF(91, "Export OPL");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(92, "li")(93, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_93_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.saveScreenshot());
    });
    core /* ɵɵtext */.EFF(94, "Export Model Diagrams");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(95, "li")(96, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_96_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.savePdf());
    });
    core /* ɵɵtext */.EFF(97, "Export Model to PDF");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(98, "li")(99, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_99_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.exportHTML());
    });
    core /* ɵɵtext */.EFF(100, "Export Model as HTML");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(101, "li")(102, "a", 25);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_102_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.exportLegend());
    });
    core /* ɵɵtext */.EFF(103, "Export OPM Legend");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(104, "li")(105, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_105_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.exportSysML());
    });
    core /* ɵɵtext */.EFF(106, "Export to SysML");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(107, "svg", 20);
    core /* ɵɵelement */.nrm(108, "rect", 21);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(109, "li")(110, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_110_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openSettings());
    });
    core /* ɵɵtext */.EFF(111, "OPCloud Settings");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(112, "li")(113, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_113_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.about());
    });
    core /* ɵɵtext */.EFF(114, "About");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(115, "li")(116, "a", 18);
    core /* ɵɵlistener */.bIt("click", function MenuComponent_div_4_Template_a_click_116_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openOPCloudManual());
    });
    core /* ɵɵtext */.EFF(117, "Help");
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(11);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && ctx_r1.userService.isSysAdmin() == true);
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && ctx_r1.userService.isSysAdmin() == true);
    core /* ɵɵadvance */.R7$(15);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && (ctx_r1.userService.isOrgAdmin() == true || ctx_r1.userService.isSysAdmin() == true));
    core /* ɵɵadvance */.R7$(15);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && (ctx_r1.userService.isInsightsUser(ctx_r1.currentUser) == true || ctx_r1.userService.isOrgAdmin() == true || ctx_r1.userService.isSysAdmin() == true));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && (ctx_r1.userService.isOrgAdmin() == true || ctx_r1.userService.isSysAdmin() == true));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && ctx_r1.userService.isInsightsUser(ctx_r1.currentUser) == true);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser && ctx_r1.context.isLoaded() && ctx_r1.userService.isDSMUser(ctx_r1.currentUser));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser);
    core /* ɵɵadvance */.R7$(25);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.currentUser);
  }
}
let MenuComponent = /*#__PURE__*/(() => {
  class MenuComponent {
    // private flatOPD:OpmOpd;
    constructor(graphService, initRappidService, model, _dialog, oplService, userService, _treeViewService, router, context, serverFlatteningService, exportOPLService, dcmExportService) {
      this.graphService = graphService;
      this.initRappidService = initRappidService;
      this.model = model;
      this._dialog = _dialog;
      this.oplService = oplService;
      this.userService = userService;
      this._treeViewService = _treeViewService;
      this.router = router;
      this.context = context;
      this.serverFlatteningService = serverFlatteningService;
      this.exportOPLService = exportOPLService;
      this.dcmExportService = dcmExportService;
      this.isActive = true;
      this.menuOpen = false;
      initRappidService.paper.on("blank:pointerdown", () => {
        if (this.menuOpen) {
          this.toggleMenu();
        }
      });
      this.userService.user$.subscribe(user => this.currentUser = user);
    }
    toggleMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
        this.isActive = true;
      } else if (!this.menuOpen) {
        this.menuOpen = true;
        this.isActive = false;
      }
    }
    importModel() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(UploadFile);
      dialogRef.afterClosed().subscribe(result => {});
    }
    notGenAIUserMessage() {
      this._dialog.open(ConfirmDialogDialogComponent, {
        height: "300px",
        width: "430px",
        data: {
          message: "Unlock Advanced Generative AI Features!\n\nTake your work to the next level with OPL summary generation, impact analysis, modeling insights, enhanced coding, and even natural language-based calculations.\n\nInterested in upgrading?\nContact us at <a href=\"mailto:contact@opcloud.tech\">contact@opcloud.tech</a> for more details.",
          okName: "Got it!",
          okColor: "#1a3763",
          centerText: true,
          closeFlag: true
        }
      });
      return;
    }
    AIOplSummary(summaryType) {
      if (!this.userService.isGenAIUser(this.currentUser)) {
        this.notGenAIUserMessage();
        return;
      }
      this.toggleMenu();
      const dialogRef = this._dialog.open(OPLGenerativeAIDialogComponent, {
        data: {
          type: summaryType
        }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    AIImpactAnalysis() {
      if (!this.userService.isGenAIUser(this.currentUser)) {
        this.notGenAIUserMessage();
        return;
      }
      this.toggleMenu();
      const dialogRef = this._dialog.open(GenerativeAIImpactAnalysisDialogComponent);
      dialogRef.afterClosed().subscribe(result => {});
    }
    AIRequirementsExport() {
      if (!this.userService.isGenAIUser(this.currentUser)) {
        this.notGenAIUserMessage();
        return;
      }
      this.toggleMenu();
      const dialogRef = this._dialog.open(GenerativeAIRequirementsExportDialogComponent, {
        width: "720px",
        maxWidth: "720px",
        // prevent horizontal growth
        height: "660px",
        maxHeight: "660px",
        // prevent vertical growth
        autoFocus: false,
        panelClass: "fixed-size-dialog" // optional: gives us a CSS handle if needed
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    updateGenerativeAIApiKey() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(GenerativeAIUpdateKeyDialogComponent);
      dialogRef.afterClosed().subscribe(result => {});
    }
    saveScreenshot() {
      this.toggleMenu();
      this._dialog.open(SaveScreenshotComponent);
    }
    savePdf() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(SavePdfComponent, {
        height: "545px",
        width: "480px",
        data: {
          modelName: this.initRappidService.modelService.displayName
        }
      });
    }
    exportHTML() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(ExportModelAsHtmlComponent, {
        height: "545px",
        width: "480px",
        data: {
          modelName: this.initRappidService.modelService.displayName
        }
      });
    }
    exportSysML() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(ExportSysMLDialogComponent, {
        height: "655px",
        width: "530px",
        data: {
          modelName: this.initRappidService.modelService.displayName
        }
      });
    }
    exportLegend() {
      this.toggleMenu();
      this._dialog.open(ExportLegendDialogComponent, {
        height: "350px",
        width: "400px",
        data: {
          modelName: this.initRappidService.modelService.displayName
        }
      });
    }
    openSettings() {
      this.initRappidService.saveWhichTreeNodesAreOpen();
      this.router.navigate(["/settings", {
        outlets: {
          settings_main: ["home"]
        }
      }], {
        skipLocationChange: true
      });
    }
    about() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(AboutDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {}
      });
    }
    openOPCloudManual() {
      this.router.navigate(["/settings", {
        outlets: {
          settings_main: ["opcloud-quick-manual"]
        }
      }], {
        skipLocationChange: true
      });
    }
    copyLink() {
      this.model.openUrlDialog();
    }
    exportOPL() {
      var _this = this;
      this.toggleMenu();
      // Open a dialog box that will allow the user to choose the file name
      const dialogRef = this._dialog.open(ChooseExportedFileNameComponent, {
        height: "380px",
        width: "400px"
      });
      // This function invokes the exporting OPL process
      dialogRef.afterClosed().subscribe(/*#__PURE__*/function () {
        var _ref = (0, default)(function* (fileName) {
          if (!fileName || !fileName[0] || fileName[0] === "CLOSED") {
            // If the user pressed CANCEL.
            return;
          } else {
            if (fileName[2]) {
              yield _this.initRappidService.opdHierarchyRef.loadAllSubModels();
            }
            _this.exportOPLService.exportOPL(fileName);
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    getSavingIsNotAvailableForViewerAccountMessage() {
      return "This operation is not available for viewer accounts. Please contact your organization's admin to make changes. Thank you!";
    }
    clickSave() {
      var _this2 = this;
      return (0, default)(function* () {
        _this2.toggleMenu();
        if (_this2.currentUser.userData.isViewerAccount) {
          (0, validationAlert)(_this2.getSavingIsNotAvailableForViewerAccountMessage(), 5000, "ERROR");
          return;
        }
        const image = yield _this2.initRappidService.getModelImage();
        _this2.model.save(image);
      })();
    }
    clickSaveModelAs() {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      if (this.currentUser.userData.isViewerAccount) {
        (0, validationAlert)(this.getSavingIsNotAvailableForViewerAccountMessage(), 5000, "ERROR");
        return;
      }
      if (this.initRappidService.isDSMClusteredView.value) {
        (0, validationAlert)("This is only an analysis view of an existing model. Saving is not available.");
        return;
      }
      this.model.openSaveModelDialog();
    }
    downloadModel() {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      this.model.downloadModel();
    }
    loadModelFromFile() {
      if (this.currentUser && !this.userService.isSysAdmin()) {
        return;
      }
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      $("#loadModelFromFile").click();
    }
    readSingleFile($event) {
      const file = $event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      const that = this;
      reader.onload = function (e) {
        const json = JSON.parse(e.target.result);
        that.model.loadModelFromFile(json);
        that.toggleMenu();
      };
      reader.readAsText(file);
    }
    clickNewModel() {
      this.toggleMenu();
      OpmProcess.resetCounter();
      OpmObject.resetCounter();
      this.initRappidService.setSelectedElementToNull();
      this.model.newModel();
    }
    clickSaveStereotype() {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      if (this.currentUser.userData.isViewerAccount) {
        (0, validationAlert)(this.getSavingIsNotAvailableForViewerAccountMessage(), 5000, "ERROR");
        return;
      }
      this.model.openSaveStereotypeDialog();
    }
    executeIfLogged(func) {
      this.toggleMenu();
      return this[func]();
    }
    clickLoadModel() {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      this.model.openLoadModelDialog();
    }
    clickLoadExample(type) {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      const exType = type === "org" ? ExamplesType.ORG : ExamplesType.SYS;
      this.model.openModelDialog(StorageMode.LOAD, ScreenType.EXAMPALES, exType);
    }
    clickSaveExample(type) {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      if (this.currentUser.userData.isViewerAccount) {
        (0, validationAlert)(this.getSavingIsNotAvailableForViewerAccountMessage(), 5000, "ERROR");
        return;
      }
      const exType = type === "org" ? ExamplesType.ORG : ExamplesType.SYS;
      if (this.initRappidService.isDSMClusteredView.value) {
        (0, validationAlert)("This is only an analysis view of an existing model. Saving is not available.");
        return;
      }
      this.model.openModelDialog(StorageMode.SAVE, ScreenType.EXAMPALES, exType);
    }
    clickSaveTemplate(type) {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      let templateType;
      if (type === "org") {
        templateType = TemplateType.ORG;
      } else if (type === "system") {
        templateType = TemplateType.SYS;
      } else {
        templateType = TemplateType.PERSONAL;
        (0, validationAlert)("Pay attention, personal templates are visible only for you. To share a template with other modelers use the model permissions screen.", 8500, "warning");
      }
      this.model.openModelDialog(StorageMode.SAVE, ScreenType.TEMPLATES, undefined, templateType);
    }
    clickTemplate(mode) {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      if (this.currentUser.userData.isViewerAccount) {
        (0, validationAlert)(this.getSavingIsNotAvailableForViewerAccountMessage(), 5000, "ERROR");
        return;
      }
      if (this.initRappidService.isDSMClusteredView.value && mode === "save") {
        (0, validationAlert)("This is only an analysis view of an existing model. Saving is not available.");
        return;
      }
      this._dialog.open(TemplatesComponent, {
        width: Math.round(window.innerWidth * 0.75) + "px",
        data: {
          mode: mode
        }
      });
    }
    compareModel(path, name, data) {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      this.model.openLoadModelComparisonDialog();
    }
    OPMQueryPreCheck() {
      //Check if already in the OPM Query Results view
      const currentOpd = this.initRappidService.opmModel.currentOpd;
      if (currentOpd.id === this.initRappidService.opmModel.getOPMQueryID()) {
        (0, validationAlert)("Can't run query while on OPM Insights result view", null, "Error");
        return false;
      }
      //Check minimum number of elements to execute a query
      if (this.initRappidService.opmModel.logicalElements.length < 2) {
        (0, validationAlert)("There is not enough elements to execute analysis", null, "Error");
        return false;
      }
      return true;
    }
    flatOPM() {
      var _this3 = this;
      return (0, default)(function* () {
        _this3.toggleMenu();
        if (_this3.OPMQueryPreCheck()) {
          let serverFlattening;
          if (_this3.initRappidService.oplService.settings.connection.calculationsServer.computingServerCalculations) {
            serverFlattening = yield _this3.serverFlatteningService.getFlattenedModelFromServer(false);
            if (!serverFlattening.success) {
              (0, validationAlert)("Unable to run Flattening algorithm on the BE server. Running it locally.");
            }
          }
          let flatOPD;
          let copyModel; // Generate Flat OPD
          if (serverFlattening?.success) {
            flatOPD = serverFlattening.serverModel.getOpd("OPMqUeRy");
          } else {
            copyModel = new OpmModel().fromJson(_this3.initRappidService.opmModel.toJson());
            flatOPD = copyModel.flattening(false);
          }
          _this3.initRappidService.isDSMClusteredView = {
            value: true,
            type: "flattening"
          };
          const that = _this3;
          _this3.initRappidService.isLoadingModel = true;
          setTimeout(function () {
            const modelToShow = serverFlattening?.serverModel || copyModel;
            modelToShow.name = "[Flattened] " + modelToShow.name;
            that.context.loadDSMFlatteningModel(modelToShow);
            that.router.navigate([""]);
            that.initRappidService.isLoadingModel = false;
          }, 800);
        }
      })();
    }
    openOpmQuery(type) {
      this.toggleMenu();
      if (type === "Centrality") {
        (0, validationAlert)("Centrality Queries are not enabled yet", null, "Error");
      } else if (this.OPMQueryPreCheck()) {
        const config = new MatDialogConfig();
        config.disableClose = true;
        const dialogRef = this._dialog.open(opmQueryDialogComponent, config);
        dialogRef.componentInstance.type = type;
      }
    }
    DestatingAll() {
      for (let i = 0; i < this.initRappidService.opmModel.logicalElements.length; i++) {
        if (this.initRappidService.opmModel.logicalElements[i] instanceof OpmLogicalObject) {
          if (this.initRappidService.opmModel.logicalElements[i].states.length > 0 && this.initRappidService.opmModel.logicalElements[i].value === "None") {
            const newVisuals = this.initRappidService.opmModel.logicalElements[i].deStating();
            const onlyOneIterationPerFather = [];
            for (let k = 0; k < newVisuals.length; k++) {
              if (onlyOneIterationPerFather.includes(newVisuals[k][0].logicalElement) === false) {
                onlyOneIterationPerFather.push(newVisuals[k][0].logicalElement);
                this.initRappidService.graph.getCell(newVisuals[k][0].id).updateDeStating(newVisuals, this.initRappidService);
              }
            }
          }
        }
      }
    }
    showSystemMap() {
      ListLogicalComponent.instances[0].showMap();
      this.toggleMenu();
    }
    clickLoadStereotype() {
      this.initRappidService.setSelectedElementToNull();
      this.toggleMenu();
      this.model.openLoadStereotypeDialog();
    }
    markThings() {
      const config = new MatDialogConfig();
      config.height = "700px";
      config.width = "800px";
      this._dialog.open(GreyItemsDialogComponent, config);
      this.toggleMenu();
    }
    opdTreeArrangementOptions() {
      const config = new MatDialogConfig();
      config.height = "170px";
      config.width = "760px";
      this._dialog.open(OpdtreeModelSettingsComponent, config);
      this.toggleMenu();
    }
    modelValidationOptions() {
      const config = new MatDialogConfig();
      config.height = "250px";
      config.width = "550px";
      this._dialog.open(ValidationSettingsComponent, config);
      this.toggleMenu();
    }
    newModelByWizard() {
      this.initRappidService.dialogService.openDialog(NewModelByWizardComponentComponent, 720, 1100, {
        doNotClose: "true"
      });
      this.toggleMenu();
    }
    openDCMExportWizard() {
      this.toggleMenu();
      if (this.DCMPreCheck()) {
        const config = new MatDialogConfig();
        config.width = "800px";
        config.height = "600px";
        config.disableClose = false;
        config.maxWidth = "90vw";
        config.maxHeight = "90vh";
        const dialogRef = this._dialog.open(DCMExportWizardComponent, config);
      }
    }
    openDCMViewer() {
      this.toggleMenu();
      if (!this.context.isLoaded()) {
        (0, validationAlert)("Please load a model first", null, "Error");
        return;
      }
      const config = new MatDialogConfig();
      config.width = "90vw";
      config.height = "90vh";
      config.maxWidth = "1400px";
      config.maxHeight = "900px";
      config.disableClose = false;
      const dialogRef = this._dialog.open(DCMViewerComponent, config);
    }
    openDCMValidateExport() {
      this.toggleMenu();
      // Upload ZIP → validate schema, coverage
      const config = new MatDialogConfig();
      config.width = "800px";
      config.height = "600px";
      // TODO: Implement DCMValidateExportComponent
      (0, validationAlert)("DCM Validate Export feature coming soon", null, "Info");
    }
    DCMPreCheck() {
      if (!this.context.isLoaded()) {
        (0, validationAlert)("Please load a model first", null, "Error");
        return false;
      }
      // Check for operational processes
      const hasOperationalProcesses = this.initRappidService.opmModel.logicalElements.some(e => e instanceof OpmLogicalProcess);
      if (!hasOperationalProcesses) {
        (0, validationAlert)("Model must contain operational processes for DCM conversion", null, "Warning");
        return false;
      }
      return true;
    }
    /**
     * Show DCM on Model - Color the OPM model by CMMN stages
     * Similar to DSM "Show on Model" feature
     */
    showDCMOnModel() {
      var _this4 = this;
      return (0, default)(function* () {
        _this4.toggleMenu();
        if (!_this4.DCMPreCheck()) {
          return;
        }
        try {
          // Build DCM-IR using default settings (same as viewer)
          const opmModel = _this4.initRappidService.opmModel;
          const dcmIR = yield _this4.dcmExportService.buildDCMIRForViewer(opmModel);
          if (!dcmIR || !dcmIR.plan || !dcmIR.plan.stages || dcmIR.plan.stages.length === 0) {
            (0, validationAlert)("No stages found in DCM conversion. Please check your model structure.", null, "Warning");
            return;
          }
          // Create a copy of the model for coloring (similar to DSM)
          // Use toJson/fromJson to create a deep copy
          const modelJson = opmModel.toJson();
          const coloredModel = new OpmModel();
          coloredModel.fromJson(modelJson);
          coloredModel.name = "[DCM View] " + opmModel.name;
          // Color processes by stage
          _this4.colorModelByStages(coloredModel, dcmIR);
          // Set DCM view flag BEFORE loading (similar to DSM pattern)
          _this4.initRappidService.isDCMView = true;
          // Create new tab with colored model (similar to DSM)
          // Use setTimeout like DSM to ensure proper rendering
          const that = _this4;
          setTimeout(function () {
            that.context.loadDCMColoredModel(coloredModel);
            that.router.navigate([""]);
          }, 800);
        } catch (error) {
          console.error("Error showing DCM on model:", error);
          (0, validationAlert)(`Failed to show DCM on model: ${error.message || "Unknown error"}`, null, "Error");
        }
      })();
    }
    /**
     * Color model processes by DCM stages
     * Each stage gets a unique color, and all processes in that stage are colored
     */
    colorModelByStages(model, dcmIR) {
      const stages = dcmIR.plan.stages;
      const colorPair = []; // Store original colors: [elementId, originalFill]
      // Get canonical OPM to map stage sourceProcessId to actual processes
      const canonicalOPM = this.dcmExportService.canonicalOPMExport.exportCanonicalOPM(model);
      // Color each stage with a unique color
      for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
        const stage = stages[stageIndex];
        const color = this.getRandomColor(stageIndex, stages.length);
        // Find the process by sourceProcessId
        const stageProcess = canonicalOPM.processes.find(p => p.id === stage.sourceProcessId);
        if (!stageProcess) {
          continue; // Skip if process not found
        }
        // Find all processes that belong to this stage (including children)
        const processesInStage = this.getProcessesInStage(stage, canonicalOPM);
        // Color all processes in this stage
        processesInStage.forEach(processId => {
          // Find logical process by stable ID
          const logicalProcess = model.logicalElements.find(el => {
            if (!(el instanceof OpmLogicalProcess)) {
              return false;
            }
            // Generate expected stable ID
            const expectedStableId = this.generateStableId("process", el.lid);
            return expectedStableId === processId;
          });
          if (logicalProcess) {
            // Color all visual elements of this process
            logicalProcess.visualElements.forEach(visual => {
              if (visual.fill !== undefined) {
                // Store original color
                colorPair.push([visual.id, visual.fill]);
                // Set new color
                visual.fill = color;
              }
            });
          }
        });
      }
      // Store color pairs in model for restoration (similar to DSM)
      model.dcmColorPairs = colorPair;
    }
    /**
     * Get all process IDs that belong to a stage (including the stage's process and its children)
     */
    getProcessesInStage(stage, canonicalOPM) {
      const processIds = [stage.sourceProcessId];
      // Find all child processes of the stage's process
      const stageProcess = canonicalOPM.processes.find(p => p.id === stage.sourceProcessId);
      if (stageProcess && stageProcess.childrenProcessIds) {
        processIds.push(...stageProcess.childrenProcessIds);
      }
      return processIds;
    }
    /**
     * Generate random color for stage (same algorithm as DSM)
     */
    getRandomColor(colorNum, colors) {
      if (colors < 1) {
        colors = 1;
      } // Avoid divide by zero
      return "hsl(" + colorNum * (360 / colors) % 360 + ",100%,50%)";
    }
    /**
     * Generate stable ID for process (same as DCM export)
     * Uses the canonical export service's method
     */
    generateStableId(type, lid) {
      // Use the same algorithm as canonical export service
      const seed = `${type}_${lid}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      // Format as UUID-like string (8-4-4-4-12) - same as canonical export
      const hex = Math.abs(hash).toString(16).padStart(8, "0");
      return `${type}_${hex}-${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(0, 4)}-${hex.substring(0, 12)}`;
    }
    static #_ = (() => this.ɵfac = function MenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MenuComponent)(core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ModelStorageService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(TreeViewService), core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(ServerFlatteningService), core /* ɵɵdirectiveInject */.rXU(ExportOPLAPIService), core /* ɵɵdirectiveInject */.rXU(DCMExportWizardService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MenuComponent,
      selectors: [["opc-menu"]],
      decls: 5,
      vars: 3,
      consts: [["xButton", ""], [1, "menuButtons"], ["class", "group", 3, "click", 4, "ngIf", "ngIfElse"], ["class", "menu", 4, "ngIf"], [1, "group", 3, "click"], ["width", "68", "height", "64", "viewBox", "0 0 68 64", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "68", "height", "64", "fill", "black", "fill-opacity", "0"], ["width", "20", "height", "14", "fill", "black", "fill-opacity", "0", "transform", "translate(24 25)"], ["d", "M44 25H24", "stroke", "white", "stroke-width", "3", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M44 32H24", "stroke", "white", "stroke-width", "3", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M44 39H24", "stroke", "white", "stroke-width", "3", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "xButton", 3, "click"], ["width", "68", "height", "64", "fill", "black", "fill-opacity", "0.15"], ["filter", "url(#filter0_d)"], ["width", "14.1421", "height", "14.2843", "fill", "black", "fill-opacity", "0", "transform", "translate(27 24.8579)"], ["d", "M41.1421 39.1421L27 25", "stroke", "white", "stroke-width", "3", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M41.1421 24.8579L27 39", "stroke", "white", "stroke-width", "3", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "menu"], [3, "click"], [4, "ngIf"], ["width", "290", "height", "7", "viewBox", "0 0 280 7", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "280", "height", "7", "fill", "black", "fill-opacity", "0.31"], [2, "float", "right"], [1, "sub-menu"], ["width", "290", "height", "7", "viewBox", "0 0 280 7", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "newFeature", 3, "click"], ["type", "file", "id", "loadModelFromFile", 2, "display", "none", 3, "change"], ["matTooltip", "The ultimate OPD is single flat representation of the OPM system model", 3, "click"]],
      template: function MenuComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 1);
          core /* ɵɵtemplate */.DNE(1, MenuComponent_button_1_Template, 7, 0, "button", 2)(2, MenuComponent_ng_template_2_Template, 8, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(4, MenuComponent_div_4_Template, 118, 9, "div", 3);
        }
        if (rf & 2) {
          const xButton_r18 = core /* ɵɵreference */.sdS(3);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isActive)("ngIfElse", xButton_r18);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.menuOpen);
        }
      },
      dependencies: [MatTooltip, MatIcon, NgIf],
      styles: [".app-toolbar[_ngcontent-%COMP%]{position:absolute;height:65px;left:0;top:0;background:#1a3763}.app-toolbar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]{box-shadow:none;-webkit-user-select:none;user-select:none;background:none;border:none;cursor:pointer;filter:none;font-weight:400;height:auto;line-height:inherit;margin:0;min-width:0;padding:0;text-align:right;text-decoration:none;outline:none}.app-toolbar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .menu-icon[_ngcontent-%COMP%]{padding:0 14px;color:#ffffff8a;transition:.2s all linear}.app-toolbar[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .menu-icon[_ngcontent-%COMP%]:hover{color:#fff}.app-toolbar[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-family:Product Sans,sans-serif;color:#fff}.app-toolbar[_ngcontent-%COMP%]   .filler[_ngcontent-%COMP%]{flex:1 1 auto}.model-name[_ngcontent-%COMP%]{width:260px;text-align:center;margin:10px;text-overflow:ellipsis;overflow:hidden}.menuButtons[_ngcontent-%COMP%]{margin-top:auto}.group[_ngcontent-%COMP%], .xButton[_ngcontent-%COMP%]{margin-top:auto;border:0px;background:transparent;width:75px;margin-left:-25px;height:65px}.group[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{background-color:#000;box-shadow:#0f1110;z-index:1;margin-top:fill;visibility:hidden}div[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{border:none;background-color:transparent;color:#fff;display:block}div[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]   a[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]:hover{background:#78a8f1;text-align:inherit}.menu[_ngcontent-%COMP%]{position:absolute;width:290px;overflow:auto;max-height:calc(100vh - 70px);left:0;top:65px;padding-top:11px;background:#586d8ca1;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border-radius:0 0 7px}.menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{float:left;width:93%;padding:6px 0 6px 4%;font-family:Roboto,Arial,Helvetica,sans-serif;font-style:normal;font-weight:400;background-color:transparent;color:#fff;display:block;font-size:18px}.menu[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{padding-left:-3px;float:left;display:block}.menu[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{position:relative;margin:0;padding:0;list-style:none;z-index:3}.menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background:#8aa6d1;cursor:pointer;display:block}div[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]   a[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]{padding-top:5px;border:none;font-family:Roboto,Arial,Helvetica,sans-serif;font-style:normal;font-weight:400;background-color:transparent;color:#fff;display:block;font-size:18px;padding-left:18px}div[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]   a[_ngcontent-c2][_ngcontent-%COMP%]   .deividerLine[_ngcontent-%COMP%]{width:100%}.menu[_ngcontent-%COMP%]   ul.sub-menu[_ngcontent-%COMP%]{display:none;opacity:0;transform:translateY(-2px)}.menu[_ngcontent-%COMP%]   ul.sub-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:220px;margin-left:50px;padding-top:5px;border:1px;font-family:Roboto,Arial,Helvetica,sans-serif;font-style:normal;font-weight:400;background-color:transparent;color:#fff;display:block;font-size:18px;padding-left:18px}.menu[_ngcontent-%COMP%]   ul.sub-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{width:210px}.menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover   ul.sub-menu[_ngcontent-%COMP%], .menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:focus-within   ul.sub-menu[_ngcontent-%COMP%]{display:block;animation:_ngcontent-%COMP%_submenu-fade-in 90ms ease .2s both;z-index:4}@keyframes _ngcontent-%COMP%_submenu-fade-in{0%{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:translateY(0)}}.buttonsProcessandObject[_ngcontent-%COMP%]{display:-webkit-box;margin-left:-227px}"]
    }))();
  }
  return MenuComponent;
})();