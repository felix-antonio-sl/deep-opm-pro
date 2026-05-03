// Source: decompiled/37084.js
// Original path: ./src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function ElementToolBarComponent_div_0_span_29__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 84)(3, "path", 85);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_29__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 87)(3, "path", 88);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 82)(1, "a", 83);
    core /* ɵɵlistener */.bIt("contextmenu", function ElementToolBarComponent_div_0_span_29_Template_a_contextmenu_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.regularCopyStyle($event, true));
    })("click", function ElementToolBarComponent_div_0_span_29_Template_a_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.regularCopyStyle($event, false));
    });
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_span_29__svg_svg_2_Template, 4, 0, "svg", 34)(3, ElementToolBarComponent_div_0_span_29__svg_svg_3_Template, 4, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.selected.get("type") === "opm.Note" ? "Not Supported for Notes" : "Copy Style \rClick Ctrl+Shift+C for advanced options");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.copiedStyleParams);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.copiedStyleParams);
  }
}
function ElementToolBarComponent_div_0_span_30__svg_path_10_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelement */.nrm(0, "path", 100);
  }
}
function ElementToolBarComponent_div_0_span_30__svg_path_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelement */.nrm(0, "path", 101);
  }
}
function ElementToolBarComponent_div_0_span_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 89)(1, "a", 90);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_30_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleStylingDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 91)(3, "defs")(4, "linearGradient", 92);
    core /* ɵɵelement */.nrm(5, "stop", 93)(6, "stop", 94)(7, "stop", 95)(8, "stop", 96);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(9, "rect", 97);
    core /* ɵɵtemplate */.DNE(10, ElementToolBarComponent_div_0_span_30__svg_path_10_Template, 1, 0, "path", 98)(11, ElementToolBarComponent_div_0_span_30__svg_path_11_Template, 1, 0, "path", 99);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.showStylingDiv ? "Hide Styling Tools" : "Show Styling Tools");
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showStylingDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showStylingDiv);
  }
}
function ElementToolBarComponent_div_0_div_31_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 110)(1, "a", 111);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_2_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.returnToDefaultAttributes());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 112);
    core /* ɵɵelement */.nrm(3, "rect", 113);
    core /* ɵɵelementStart */.j41(4, "g", 114);
    core /* ɵɵelement */.nrm(5, "path", 115);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "defs")(7, "filter", 116);
    core /* ɵɵelement */.nrm(8, "feFlood", 117)(9, "feColorMatrix", 118)(10, "feOffset", 119)(11, "feColorMatrix", 120)(12, "feBlend", 121)(13, "feBlend", 122);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
}
function ElementToolBarComponent_div_0_div_31_span_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 123);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_3_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleTextSizeMenu());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 124);
    core /* ɵɵelement */.nrm(3, "rect", 125)(4, "path", 126)(5, "line", 127)(6, "line", 128)(7, "path", 129)(8, "path", 130);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_31_span_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 131)(1, "span", 132)(2, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(8));
    });
    core /* ɵɵtext */.EFF(3, "8");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(10));
    });
    core /* ɵɵtext */.EFF(5, "10");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(12));
    });
    core /* ɵɵtext */.EFF(7, "12");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(14));
    });
    core /* ɵɵtext */.EFF(9, "14");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(16));
    });
    core /* ɵɵtext */.EFF(11, "16");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(18));
    });
    core /* ɵɵtext */.EFF(13, "18");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(20));
    });
    core /* ɵɵtext */.EFF(15, "20");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(22));
    });
    core /* ɵɵtext */.EFF(17, "22");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(18, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(24));
    });
    core /* ɵɵtext */.EFF(19, "24");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_20_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(28));
    });
    core /* ɵɵtext */.EFF(21, "28");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(22, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_22_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(32));
    });
    core /* ɵɵtext */.EFF(23, "32");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(24, "a", 133);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_4_Template_a_click_24_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextSize(48));
    });
    core /* ɵɵtext */.EFF(25, "48");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 8 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 8 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 10 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 10 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 12 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 12 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 14 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 14 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 16 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 16 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 18 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 18 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 20 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 20 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 22 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 22 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 24 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 24 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 28 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 28 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 32 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 32 ? "Current Font Size" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵclassMap */.HbH(ctx_r1.currentFontSize === 48 ? "currentSize" : "");
    core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx_r1.currentFontSize === 48 ? "Current Font Size" : "");
  }
}
function ElementToolBarComponent_div_0_div_31_span_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 134);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_5_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleFontMnue());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 135);
    core /* ɵɵelement */.nrm(3, "rect", 136)(4, "rect", 137)(5, "path", 138)(6, "path", 139);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_31_span_6_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 143);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_6_a_2_Template_a_click_0_listener() {
      const font_r10 = core /* ɵɵrestoreView */.eBV(_r9).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeFont(font_r10.name));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_r10 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵstyleMap */.Aen(font_r10.style + ctx_r1.getFontListItemStyle(font_r10));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_r10.name);
  }
}
function ElementToolBarComponent_div_0_div_31_span_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 140)(1, "span", 141);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_31_span_6_a_2_Template, 2, 3, "a", 142);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.supportedFonts);
  }
}
function ElementToolBarComponent_div_0_div_31_span_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 144);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_7_Template_a_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openColorPopup($event, 1));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 145);
    core /* ɵɵelement */.nrm(3, "path", 146);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_31_span_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 147);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_8_Template_a_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openColorPopup($event, 3));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 148);
    core /* ɵɵelement */.nrm(3, "rect", 149)(4, "rect", 150);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵattribute */.BMQ("stroke", ctx_r1.getSelectedElementStroke());
  }
}
function ElementToolBarComponent_div_0_div_31_span_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 151);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_9_Template_a_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openColorPopup($event, 2));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 148)(3, "g", 152);
    core /* ɵɵelement */.nrm(4, "rect", 153);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(5, "rect", 154);
    core /* ɵɵelementStart */.j41(6, "defs")(7, "filter", 155);
    core /* ɵɵelement */.nrm(8, "feFlood", 117)(9, "feGaussianBlur", 156)(10, "feComposite", 157)(11, "feBlend", 158);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵattribute */.BMQ("fill", ctx_r1.getSelectedElementFill());
  }
}
function ElementToolBarComponent_div_0_div_31_span_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 159)(1, "a", 160);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_10_Template_a_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openPatternPopup($event));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 148)(3, "g", 161);
    core /* ɵɵelement */.nrm(4, "rect", 153);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(5, "rect", 162);
    core /* ɵɵelementStart */.j41(6, "defs")(7, "filter", 163);
    core /* ɵɵelement */.nrm(8, "feFlood", 117)(9, "feGaussianBlur", 156)(10, "feComposite", 157)(11, "feBlend", 158);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵattribute */.BMQ("fill", ctx_r1.getSelectedElementPatternPreview());
  }
}
function ElementToolBarComponent_div_0_div_31_span_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 164)(1, "a", 165);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_11_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.alignText("start"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 112);
    core /* ɵɵelement */.nrm(3, "path", 7)(4, "line", 166)(5, "line", 167)(6, "line", 168)(7, "line", 169);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(8, "a", 170);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_11_Template_a_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.alignText("middle"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(9, "svg", 112);
    core /* ɵɵelement */.nrm(10, "path", 7)(11, "line", 166)(12, "line", 167)(13, "line", 171)(14, "line", 172);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(15, "a", 173);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_11_Template_a_click_15_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.alignText("end"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(16, "svg", 112);
    core /* ɵɵelement */.nrm(17, "path", 7)(18, "line", 166)(19, "line", 167)(20, "line", 174)(21, "line", 175);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_31_span_12__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 181);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12__svg_svg_2_Template_svg_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleTextPos());
    });
    core /* ɵɵelement */.nrm(1, "path", 182)(2, "path", 183)(3, "path", 184)(4, "line", 185)(5, "path", 186)(6, "line", 187)(7, "path", 188)(8, "line", 189)(9, "path", 190)(10, "line", 191);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_div_31_span_12__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 181);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12__svg_svg_3_Template_svg_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r17);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleTextPos());
    });
    core /* ɵɵelement */.nrm(1, "path", 192)(2, "path", 193)(3, "path", 194)(4, "line", 195)(5, "path", 196)(6, "line", 197)(7, "path", 198)(8, "line", 199)(9, "path", 200)(10, "line", 201);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_div_31_span_12_span_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 202)(1, "label", 203);
    core /* ɵɵtext */.EFF(2, "X");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "mat-slider", 204)(4, "input", 205);
    core /* ɵɵlistener */.bIt("change", function ElementToolBarComponent_div_0_div_31_span_12_span_4_Template_input_change_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextRef("X"));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "label", 206);
    core /* ɵɵtext */.EFF(6, "Y");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "mat-slider", 204)(8, "input", 207);
    core /* ɵɵlistener */.bIt("change", function ElementToolBarComponent_div_0_div_31_span_12_span_4_Template_input_change_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.changeTextRef("Y"));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("value", ctx_r1.refX);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("value", ctx_r1.refY);
  }
}
function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 208);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5)(2, "path", 209);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_path_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("center"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "path", 210);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_path_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("center"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "rect", 211);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("top-middle"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "rect", 212);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("middle-right"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "rect", 213);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("top-right"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "rect", 214);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("bottom-right"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "rect", 215);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("bottom-left"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "rect", 216);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("middle-left"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "rect", 217);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("top-left"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "rect", 218);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_31_span_12_a_5_Template_rect_click_11_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.predefinedTextPos("bottom-middle"));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_31_span_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 176)(1, "a", 177);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_31_span_12__svg_svg_2_Template, 11, 0, "svg", 178)(3, ElementToolBarComponent_div_0_div_31_span_12__svg_svg_3_Template, 11, 0, "svg", 178);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(4, ElementToolBarComponent_div_0_div_31_span_12_span_4_Template, 9, 2, "span", 179)(5, ElementToolBarComponent_div_0_div_31_span_12_a_5_Template, 12, 0, "a", 180);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleProp */.xc7("top", !ctx_r1.isManualTextPos ? "0" : "8px");
    core /* ɵɵproperty */.Y8G("matTooltip", !ctx_r1.isManualTextPos ? "Manual Text Positioning" : "Automatic Text Positioning");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isManualTextPos);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isManualTextPos);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isManualTextPos);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowManualTextDiv() && ctx_r1.isManualTextPos);
  }
}
function ElementToolBarComponent_div_0_div_31_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 102)(1, "span", 103);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_31_span_2_Template, 14, 0, "span", 104)(3, ElementToolBarComponent_div_0_div_31_span_3_Template, 9, 0, "span", 73)(4, ElementToolBarComponent_div_0_div_31_span_4_Template, 26, 36, "span", 105)(5, ElementToolBarComponent_div_0_div_31_span_5_Template, 7, 0, "span", 73)(6, ElementToolBarComponent_div_0_div_31_span_6_Template, 3, 1, "span", 106)(7, ElementToolBarComponent_div_0_div_31_span_7_Template, 4, 0, "span", 73)(8, ElementToolBarComponent_div_0_div_31_span_8_Template, 5, 1, "span", 73)(9, ElementToolBarComponent_div_0_div_31_span_9_Template, 12, 1, "span", 73)(10, ElementToolBarComponent_div_0_div_31_span_10_Template, 12, 1, "span", 107);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(11, ElementToolBarComponent_div_0_div_31_span_11_Template, 22, 0, "span", 108)(12, ElementToolBarComponent_div_0_div_31_span_12_Template, 6, 7, "span", 109);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.textChangeMenu);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.textFont && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowTextAnchoring());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowManualTextDiv());
  }
}
function ElementToolBarComponent_div_0_span_32__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "circle", 221)(3, "path", 222)(4, "rect", 223);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_32__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "circle", 224)(3, "path", 225)(4, "rect", 226);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 219)(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_32_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.markedThingsAction());
    })("mouseenter", function ElementToolBarComponent_div_0_span_32_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_mark_things.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_span_32_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_span_32__svg_svg_2_Template, 5, 0, "svg", 34)(3, ElementToolBarComponent_div_0_span_32__svg_svg_3_Template, 5, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", !ctx_r1.init.shouldGreyOut ? "Show Marked Things" : "Show Original Style of Marked Things");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.shouldGreyOut);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.shouldGreyOut);
  }
}
function ElementToolBarComponent_div_0__svg_svg_35_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "rect", 97)(2, "path", 227);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0__svg_svg_36_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 228)(2, "path", 229);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 230)(1, "span", 231)(2, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("10"));
    });
    core /* ɵɵtext */.EFF(3, "10%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("20"));
    });
    core /* ɵɵtext */.EFF(5, "20%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("30"));
    });
    core /* ɵɵtext */.EFF(7, "30%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("40"));
    });
    core /* ɵɵtext */.EFF(9, "40%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("50"));
    });
    core /* ɵɵtext */.EFF(11, "50%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("60"));
    });
    core /* ɵɵtext */.EFF(13, "60%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("70"));
    });
    core /* ɵɵtext */.EFF(15, "70%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("80"));
    });
    core /* ɵɵtext */.EFF(17, "80%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(18, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("90"));
    });
    core /* ɵɵtext */.EFF(19, "90%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_20_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("100"));
    });
    core /* ɵɵtext */.EFF(21, "100%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(22, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_22_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("110"));
    });
    core /* ɵɵtext */.EFF(23, "110%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(24, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_24_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("120"));
    });
    core /* ɵɵtext */.EFF(25, "120%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(26, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_26_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("130"));
    });
    core /* ɵɵtext */.EFF(27, "130%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(28, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_28_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("140"));
    });
    core /* ɵɵtext */.EFF(29, "140%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(30, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_30_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("150"));
    });
    core /* ɵɵtext */.EFF(31, "150%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(32, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_32_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("160"));
    });
    core /* ɵɵtext */.EFF(33, "160%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(34, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_34_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("170"));
    });
    core /* ɵɵtext */.EFF(35, "170%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(36, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_36_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("180"));
    });
    core /* ɵɵtext */.EFF(37, "180%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(38, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_38_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("190"));
    });
    core /* ɵɵtext */.EFF(39, "190%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(40, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_54_Template_a_click_40_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("200"));
    });
    core /* ɵɵtext */.EFF(41, "200%");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "10" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "20" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "30" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "40" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "50" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "60" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "70" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "80" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "90" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "100" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "110" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "120" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "130" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "140" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "150" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "160" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "170" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "180" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "190" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "200" ? "font-weight:bold;" : "");
  }
}
function ElementToolBarComponent_div_0_a_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 90);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_64_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeHandle.action.act());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 233);
    core /* ɵɵelementStart */.j41(3, "g", 39);
    core /* ɵɵelement */.nrm(4, "path", 234)(5, "path", 235)(6, "path", 236)(7, "path", 237);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.removeHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_66_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 238);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_66_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r23);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.copy());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 233);
    core /* ɵɵelementStart */.j41(3, "g", 39);
    core /* ɵɵelement */.nrm(4, "path", 239)(5, "path", 240);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_a_67_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 241);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_67_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r24);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.paste());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 242)(3, "path", 243);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_span_69_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 248);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_69_a_1_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r25);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.outFoldNewDiagram());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 249)(4, "path", 250)(5, "path", 251)(6, "rect", 252)(7, "path", 253)(8, "path", 254);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_span_69_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 255);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_69_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r26);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.outZoomNewDiagram("Object"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 256)(4, "path", 257)(5, "rect", 258)(6, "path", 259)(7, "path", 260)(8, "path", 261)(9, "path", 262);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_span_69_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 263);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_69_a_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r27);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.outZoomNewDiagram("Process"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 256)(4, "path", 257)(5, "rect", 258)(6, "path", 259)(7, "path", 260)(8, "path", 261)(9, "path", 264);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_span_69_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 244);
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_div_0_span_69_a_1_Template, 9, 0, "a", 245)(2, ElementToolBarComponent_div_0_span_69_a_2_Template, 10, 0, "a", 246)(3, ElementToolBarComponent_div_0_span_69_a_3_Template, 10, 0, "a", 247);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowOutzoom());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowOutzoom());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowOutzoom());
  }
}
function ElementToolBarComponent_div_0_a_70_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 265);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_70_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r28);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.createSubModel());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 266)(4, "path", 267)(5, "path", 268)(6, "rect", 269)(7, "rect", 270)(8, "rect", 271)(9, "rect", 272)(10, "rect", 273)(11, "path", 274);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_71__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 276)(3, "path", 277)(4, "circle", 278)(5, "circle", 279)(6, "path", 280);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_a_71__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 276)(3, "path", 277)(4, "circle", 278)(5, "circle", 279)(6, "path", 281);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_a_71_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 275);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_71_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r29);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleViewsDiv());
    });
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_div_0_a_71__svg_svg_1_Template, 7, 0, "svg", 34)(2, ElementToolBarComponent_div_0_a_71__svg_svg_2_Template, 7, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isViewsDivOpen);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isViewsDivOpen);
  }
}
function ElementToolBarComponent_div_0_div_72_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 286);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_72_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r30);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openCreateViewDialog());
    })("mouseenter", function ElementToolBarComponent_div_0_div_72_a_2_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r30);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/create_view.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_72_a_2_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r30);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 287)(3, "path", 7)(4, "path", 276)(5, "path", 277)(6, "circle", 278)(7, "circle", 279);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_72_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 288);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_72_a_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r31);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.createUnfoldedTreeView());
    })("mouseenter", function ElementToolBarComponent_div_0_div_72_a_3_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r31);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/thing_tree_view.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_72_a_3_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r31);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "line", 289)(3, "line", 290)(4, "path", 7)(5, "path", 291)(6, "path", 292)(7, "circle", 293)(8, "circle", 294)(9, "rect", 295)(10, "rect", 296)(11, "rect", 297)(12, "line", 298)(13, "line", 299)(14, "line", 300)(15, "line", 301)(16, "line", 302)(17, "rect", 303)(18, "rect", 304)(19, "line", 305);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_72_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 282)(1, "span", 283);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_72_a_2_Template, 8, 0, "a", 284)(3, ElementToolBarComponent_div_0_div_72_a_3_Template, 20, 0, "a", 285);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCreateViewIcon());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCreateViewIcon());
  }
}
function ElementToolBarComponent_div_0_a_73_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 306);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_73_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r32);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleOpmRequirementsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 280)(4, "path", 307)(5, "path", 308)(6, "path", 309)(7, "path", 310)(8, "path", 311)(9, "path", 312)(10, "path", 313)(11, "path", 314)(12, "path", 315)(13, "rect", 316);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_74_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 306);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_74_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r33);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleOpmRequirementsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 281)(4, "path", 307)(5, "path", 308)(6, "path", 309)(7, "path", 310)(8, "path", 311)(9, "path", 317)(10, "path", 313)(11, "path", 318)(12, "path", 315)(13, "rect", 316);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_75_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 336);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_75_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r35);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.addRequirement());
    })("mouseenter", function ElementToolBarComponent_div_0_div_75_a_2_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r35);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/add_requirement.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_75_a_2_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r35);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 337)(4, "path", 338)(5, "path", 339)(6, "path", 340)(7, "rect", 341)(8, "rect", 342)(9, "rect", 343)(10, "rect", 344);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_75_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 90);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_75_a_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r36);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeRequirement());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 345)(3, "path", 7)(4, "path", 346)(5, "path", 347)(6, "path", 348)(7, "path", 349)(8, "path", 350)(9, "path", 351)(10, "path", 352)(11, "path", 353);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.getRemoveRequirementsTooltip());
  }
}
function ElementToolBarComponent_div_0_div_75_a_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_75_a_4_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r37);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleRequirementsSet());
    })("mouseenter", function ElementToolBarComponent_div_0_div_75_a_4_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r37);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_single_requirement.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_75_a_4_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r37);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "rect", 354)(4, "circle", 355)(5, "path", 356)(6, "path", 357)(7, "path", 358)(8, "path", 359)(9, "path", 360)(10, "path", 361)(11, "path", 362);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.getToggleRequirementTooltip());
  }
}
function ElementToolBarComponent_div_0_div_75_a_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 363);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_75_a_20_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r38);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.connectRequirementsStereotype());
    })("mouseenter", function ElementToolBarComponent_div_0_div_75_a_20_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r38);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/attach_requirement_stereotype.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_75_a_20_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r38);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 364)(4, "path", 365)(5, "path", 366)(6, "path", 367)(7, "path", 368)(8, "path", 369)(9, "path", 370)(10, "path", 371)(11, "path", 372)(12, "path", 373)(13, "path", 374);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_75_a_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 375);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_75_a_21_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r39);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeRequirementsStereotype());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "rect", 376)(4, "path", 364)(5, "path", 365)(6, "path", 366)(7, "path", 367)(8, "path", 377)(9, "path", 368)(10, "path", 369)(11, "path", 370)(12, "path", 371)(13, "path", 372)(14, "path", 373)(15, "path", 374);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 319)(1, "span", 283);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_75_a_2_Template, 11, 0, "a", 320)(3, ElementToolBarComponent_div_0_div_75_a_3_Template, 12, 1, "a", 51)(4, ElementToolBarComponent_div_0_div_75_a_4_Template, 12, 1, "a", 64);
    core /* ɵɵelementStart */.j41(5, "a", 321);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_75_Template_a_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r34);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openCreateReqruiementsViewDialog());
    })("mouseenter", function ElementToolBarComponent_div_0_div_75_Template_a_mouseenter_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r34);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/create_requirement_view.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_75_Template_a_mouseleave_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r34);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(6, "svg", 5);
    core /* ɵɵelement */.nrm(7, "path", 7)(8, "path", 322)(9, "path", 323)(10, "path", 324)(11, "path", 325)(12, "path", 326)(13, "path", 327)(14, "path", 328)(15, "path", 329)(16, "path", 330)(17, "path", 331)(18, "circle", 332)(19, "circle", 333);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(20, ElementToolBarComponent_div_0_div_75_a_20_Template, 14, 0, "a", 334)(21, ElementToolBarComponent_div_0_div_75_a_21_Template, 16, 0, "a", 335);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowAddRequirement());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRemoveRequirement());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowToggleRequirements());
    core /* ɵɵadvance */.R7$(16);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowConnectRequirementsStereotype());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRemoveRequirementsStereotype());
  }
}
function ElementToolBarComponent_div_0_a_76_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 378);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_76_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r40);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleThingBackgroundDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 280)(4, "rect", 379)(5, "path", 380)(6, "circle", 381);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_77_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 378);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_77_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r41);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleThingBackgroundDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 281)(4, "rect", 379)(5, "path", 380)(6, "circle", 381);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_78_a_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 403);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_78_a_10_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r43);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openImagePoolManagingDialog());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "rect", 404)(4, "path", 405)(5, "path", 406)(6, "rect", 407)(7, "path", 408)(8, "path", 409)(9, "rect", 410)(10, "path", 411)(11, "circle", 412);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_78_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 413)(1, "select", 414);
    core /* ɵɵlistener */.bIt("change", function ElementToolBarComponent_div_0_div_78_div_23_Template_select_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r44);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showImagesChange($event));
    });
    core /* ɵɵelementStart */.j41(2, "option", 415);
    core /* ɵɵtext */.EFF(3, "Select an Option...");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "option", 416);
    core /* ɵɵtext */.EFF(5, "Show Text Only");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 417);
    core /* ɵɵtext */.EFF(7, "Show Images Only");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "option", 418);
    core /* ɵɵtext */.EFF(9, "Show Semi-Transparent Images & Text");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "option", 419);
    core /* ɵɵtext */.EFF(11, "Show Images & Text");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_78_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 382)(1, "span", 383)(2, "a", 384);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_78_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r42);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openThingBackgroundImageDialog());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(3, "svg", 385);
    core /* ɵɵelement */.nrm(4, "path", 7)(5, "rect", 386)(6, "path", 387)(7, "circle", 388)(8, "path", 389)(9, "path", 390);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(10, ElementToolBarComponent_div_0_div_78_a_10_Template, 12, 0, "a", 391);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(11, "a", 392);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_78_Template_a_click_11_listener() {
      core /* ɵɵrestoreView */.eBV(_r42);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showImagesIsThingsSelection = !ctx_r1.showImagesIsThingsSelection);
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(12, "svg", 5);
    core /* ɵɵelement */.nrm(13, "path", 7)(14, "path", 393)(15, "path", 394)(16, "path", 395)(17, "path", 396)(18, "path", 397)(19, "circle", 398)(20, "circle", 399)(21, "path", 400)(22, "path", 401);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(23, ElementToolBarComponent_div_0_div_78_div_23_Template, 12, 0, "div", 402);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.service.isBackendSupported());
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showImagesIsThingsSelection);
  }
}
function ElementToolBarComponent_div_0_a_79_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_79_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r45);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.unfoldHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_79_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r45);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.unfoldHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_79_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r45);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 420)(3, "path", 421);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.unfoldHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_80_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_80_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.inzoomHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_80_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.inzoomHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_80_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r46);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 420)(3, "path", 422);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.inzoomHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_81_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 423);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_81_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r47);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.inZoomElementInDiagram());
    })("mouseenter", function ElementToolBarComponent_div_0_a_81_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r47);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/in_diagram_inzoom.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_a_81_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r47);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "line", 424)(4, "rect", 425)(5, "rect", 426)(6, "rect", 427);
    core /* ɵɵelementStart */.j41(7, "mask", 428);
    core /* ɵɵelement */.nrm(8, "rect", 429);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(9, "rect", 430);
    core /* ɵɵelementStart */.j41(10, "mask", 431);
    core /* ɵɵelement */.nrm(11, "rect", 432);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(12, "rect", 433)(13, "rect", 434)(14, "rect", 435);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_82_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 436);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_82_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.AddURL());
    })("mouseenter", function ElementToolBarComponent_div_0_a_82_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/hyperlink_url.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_a_82_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r48);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 437)(4, "path", 438)(5, "circle", 439)(6, "circle", 440);
    core /* ɵɵelementStart */.j41(7, "mask", 441);
    core /* ɵɵelement */.nrm(8, "path", 442);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(9, "path", 443)(10, "rect", 444);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_83_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 445);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_83_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r49);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleExtensionsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 446)(4, "line", 447)(5, "rect", 448)(6, "path", 449)(7, "path", 450)(8, "path", 451);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_84_Template(rf, ctx) {
  if (rf & 1) {
    const _r50 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 445);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_84_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r50);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleExtensionsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 446)(3, "line", 447)(4, "rect", 448)(5, "path", 449)(6, "path", 450)(7, "path", 182)(8, "path", 452);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_span_2_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r51);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      ctx_r1.textAutoFormatHandle.action.act();
      return core /* ɵɵresetView */.Njj(ctx_r1.onSelection());
    })("mouseenter", function ElementToolBarComponent_div_0_div_85_span_2_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r51);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.textAutoFormatHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_div_85_span_2_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r51);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵelement */.nrm(2, "img", 467);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.textAutoFormatHandle.displayTitle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("src", "./assets/SVG/toolbar/", ctx_r1.textAutoFormatHandle.svg, ".svg", core /* ɵɵsanitizeUrl */.B4B);
  }
}
function ElementToolBarComponent_div_0_div_85_span_3__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 468)(3, "path", 469)(4, "rect", 470)(5, "path", 471)(6, "rect", 472)(7, "rect", 473);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_div_85_span_3__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 474)(3, "path", 475)(4, "rect", 476)(5, "path", 477)(6, "rect", 478)(7, "rect", 479);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_div_85_span_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r52 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_span_3_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r52);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleAutoResizing());
    })("mouseenter", function ElementToolBarComponent_div_0_div_85_span_3_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r52);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/thing_autoresize.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_85_span_3_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r52);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_85_span_3__svg_svg_2_Template, 8, 0, "svg", 34)(3, ElementToolBarComponent_div_0_div_85_span_3__svg_svg_3_Template, 8, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.init.automaticResizingForSelectedThing() ? "Toggle Manual Resizing" : "Toggle Auto Resizing");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.automaticResizingForSelectedThing());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.automaticResizingForSelectedThing());
  }
}
function ElementToolBarComponent_div_0_div_85_a_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r53 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 480);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_4_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r53);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.shrinkToTextSize());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 481)(4, "path", 482)(5, "rect", 483)(6, "rect", 484)(7, "rect", 485);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r54 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 486);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_5_Template_a_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r54);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.beautifyConnectedLinks($event));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 487)(3, "path", 488)(4, "path", 7)(5, "rect", 489)(6, "rect", 490)(7, "rect", 491)(8, "line", 492)(9, "line", 493)(10, "line", 494)(11, "line", 495)(12, "rect", 496)(13, "rect", 497)(14, "rect", 498)(15, "line", 499)(16, "line", 500)(17, "line", 501)(18, "line", 502)(19, "line", 503)(20, "line", 504);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r55 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 505);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_6_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r55);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectConnectedThings());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "rect", 479);
    core /* ɵɵelementStart */.j41(4, "mask", 506);
    core /* ɵɵelement */.nrm(5, "path", 507);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(6, "path", 508);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 509);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_7_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r56);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.setRange());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "circle", 510)(3, "path", 511)(4, "path", 512)(5, "path", 513)(6, "path", 514)(7, "path", 515)(8, "path", 516)(9, "path", 7)(10, "path", 517)(11, "path", 518)(12, "path", 519);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 520);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_8_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r57);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeRange());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "circle", 510)(3, "path", 511)(4, "path", 512)(5, "path", 513)(6, "path", 514)(7, "path", 515)(8, "path", 516)(9, "path", 7)(10, "path", 517)(11, "path", 518)(12, "path", 519)(13, "rect", 521);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r58 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 522);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_9_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r58);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleValueTypeObject());
    })("mouseenter", function ElementToolBarComponent_div_0_div_85_a_9_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r58);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_range_type.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_85_a_9_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r58);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 523)(4, "rect", 524)(5, "circle", 525);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 526);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_10_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r59);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.resetValueToDefaultByRange());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 527)(4, "path", 528)(5, "path", 529)(6, "path", 530)(7, "path", 531);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r60 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 532);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_11_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r60);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.waitingProcessAction());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 533)(3, "circle", 534)(4, "rect", 535)(5, "path", 536)(6, "rect", 537)(7, "rect", 538)(8, "circle", 539)(9, "path", 182)(10, "path", 540)(11, "line", 541)(12, "path", 542)(13, "line", 543)(14, "path", 544)(15, "path", 545)(16, "path", 546)(17, "path", 547);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 548);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_12_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r61);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeWaitingProcessAction());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 549)(3, "path", 550)(4, "circle", 551)(5, "rect", 552)(6, "path", 553)(7, "rect", 554)(8, "rect", 555)(9, "circle", 556)(10, "path", 557)(11, "line", 558)(12, "path", 559)(13, "line", 560)(14, "path", 561)(15, "path", 562)(16, "path", 563)(17, "path", 564);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r62 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 565);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_13_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r62);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.generatedigitalTwin());
    })("mouseenter", function ElementToolBarComponent_div_0_div_85_a_13_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r62);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/digital_twin.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_div_85_a_13_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r62);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 113)(3, "path", 566);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r63 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 567);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_14_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r63);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.attributesAndInstancesAction());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 568)(4, "rect", 569)(5, "rect", 570)(6, "path", 571)(7, "path", 572);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r64 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 573);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_15_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r64);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.unLinkStereotypeAction());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 574)(3, "path", 7)(4, "path", 575)(5, "path", 576)(6, "path", 577)(7, "path", 578)(8, "path", 579);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r65 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 580);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_16_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r65);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeStereotypeAction());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5)(2, "g", 39);
    core /* ɵɵelement */.nrm(3, "path", 581)(4, "path", 582)(5, "path", 583)(6, "path", 584);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "g", 39);
    core /* ɵɵelement */.nrm(8, "path", 585);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(9, "path", 7)(10, "path", 586)(11, "path", 365)(12, "path", 366)(13, "path", 367)(14, "path", 377);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_85_a_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r66 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 90);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_85_a_17_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r66);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.stereotypeAction());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 575)(4, "path", 587)(5, "path", 576)(6, "path", 577)(7, "path", 578)(8, "path", 579);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.stereotypeTooltipMsg());
  }
}
function ElementToolBarComponent_div_0_div_85_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 453)(1, "span", 283);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_div_85_span_2_Template, 3, 3, "span", 73)(3, ElementToolBarComponent_div_0_div_85_span_3_Template, 4, 3, "span", 73)(4, ElementToolBarComponent_div_0_div_85_a_4_Template, 8, 0, "a", 454)(5, ElementToolBarComponent_div_0_div_85_a_5_Template, 21, 0, "a", 455)(6, ElementToolBarComponent_div_0_div_85_a_6_Template, 7, 0, "a", 456)(7, ElementToolBarComponent_div_0_div_85_a_7_Template, 13, 0, "a", 457)(8, ElementToolBarComponent_div_0_div_85_a_8_Template, 14, 0, "a", 458)(9, ElementToolBarComponent_div_0_div_85_a_9_Template, 6, 0, "a", 459)(10, ElementToolBarComponent_div_0_div_85_a_10_Template, 8, 0, "a", 460)(11, ElementToolBarComponent_div_0_div_85_a_11_Template, 18, 0, "a", 461)(12, ElementToolBarComponent_div_0_div_85_a_12_Template, 18, 0, "a", 462)(13, ElementToolBarComponent_div_0_div_85_a_13_Template, 4, 0, "a", 463)(14, ElementToolBarComponent_div_0_div_85_a_14_Template, 8, 0, "a", 464)(15, ElementToolBarComponent_div_0_div_85_a_15_Template, 9, 0, "a", 465)(16, ElementToolBarComponent_div_0_div_85_a_16_Template, 15, 0, "a", 466)(17, ElementToolBarComponent_div_0_div_85_a_17_Template, 9, 1, "a", 51);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.textAutoFormatHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isProcess || ctx_r1.isObject);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowShrinkToTextSize());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isProcess || ctx_r1.isObject || ctx_r1.isState && ctx_r1.init.selectedElement.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isProcess || ctx_r1.isObject || ctx_r1.isState && ctx_r1.init.selectedElement.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowSetRange());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRemoveRange());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowToggleValueObject());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowResetValueByRange());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowWaitingProcessIcon());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCancelWaitingProcessIcon());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowDigitalTwin());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowAttributesAndInstancesActionButton());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowUnlinkStereotypeButton());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowUnlinkStereotypeButton());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowSetStereotypeButton());
  }
}
function ElementToolBarComponent_div_0_a_86_Template(rf, ctx) {
  if (rf & 1) {
    const _r67 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 588);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_86_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r67);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.simulateElement());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 589)(4, "path", 590)(5, "path", 591)(6, "path", 592)(7, "path", 593)(8, "path", 594)(9, "path", 595)(10, "path", 596)(11, "path", 597)(12, "path", 598)(13, "path", 599);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_87_Template(rf, ctx) {
  if (rf & 1) {
    const _r68 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 600);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_87_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r68);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.bringLinksBetweenSelected());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 601)(4, "path", 602)(5, "rect", 603)(6, "path", 604)(7, "path", 605);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_89__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r70 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 608);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_89__svg_svg_1_Template_svg_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r70);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleBringDiv());
    });
    core /* ɵɵelement */.nrm(1, "path", 182)(2, "path", 609)(3, "path", 610);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_a_89__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r71 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 608);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_89__svg_svg_2_Template_svg_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r71);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleBringDiv());
    });
    core /* ɵɵelement */.nrm(1, "path", 182)(2, "path", 609)(3, "path", 611);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_a_89_Template(rf, ctx) {
  if (rf & 1) {
    const _r69 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 606);
    core /* ɵɵlistener */.bIt("mouseenter", function ElementToolBarComponent_div_0_a_89_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r69);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.bringConnectedHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_89_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r69);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_div_0_a_89__svg_svg_1_Template, 4, 0, "svg", 607)(2, ElementToolBarComponent_div_0_a_89__svg_svg_2_Template, 4, 0, "svg", 607);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.bringConnectedHandle.displayTitle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showBringConnectedDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showBringConnectedDiv);
  }
}
function ElementToolBarComponent_div_0_div_90_Template(rf, ctx) {
  if (rf & 1) {
    const _r72 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 612)(1, "span", 383)(2, "div", 613)(3, "div", 614)(4, "span")(5, "mat-checkbox", 615);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_div_0_div_90_Template_mat_checkbox_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r72);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.init.currentBringConnectedSettings.proceduralEnablers, $event)) {
        ctx_r1.init.currentBringConnectedSettings.proceduralEnablers = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(6, "Procedural Enabling Links");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "span")(8, "mat-checkbox", 615);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_div_0_div_90_Template_mat_checkbox_ngModelChange_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r72);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.init.currentBringConnectedSettings.proceduralTransformers, $event)) {
        ctx_r1.init.currentBringConnectedSettings.proceduralTransformers = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(9, "Procedural Transforming Links");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "span")(11, "mat-checkbox", 615);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_div_0_div_90_Template_mat_checkbox_ngModelChange_11_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r72);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.init.currentBringConnectedSettings.fundamentals, $event)) {
        ctx_r1.init.currentBringConnectedSettings.fundamentals = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(12, "Fundamental Structural Links");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "span")(14, "mat-checkbox", 615);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_div_0_div_90_Template_mat_checkbox_ngModelChange_14_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r72);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.init.currentBringConnectedSettings.tagged, $event)) {
        ctx_r1.init.currentBringConnectedSettings.tagged = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(15, "Tagged Structural Links");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(16, "button", 616);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_90_Template_button_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r72);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.bringConnectedHandle.action.act());
    });
    core /* ɵɵtext */.EFF(17, "Bring");
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.init.currentBringConnectedSettings.proceduralEnablers);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.init.currentBringConnectedSettings.proceduralTransformers);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.init.currentBringConnectedSettings.fundamentals);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.init.currentBringConnectedSettings.tagged);
  }
}
function ElementToolBarComponent_div_0_span_91_Template(rf, ctx) {
  if (rf & 1) {
    const _r73 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_91_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r73);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setComputationHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_span_91_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r73);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.setComputationHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_span_91_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r73);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "rect", 420)(4, "path", 617);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.setComputationHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_92_Template(rf, ctx) {
  if (rf & 1) {
    const _r74 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 90);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_92_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r74);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeComputationHandle.action.act());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "path", 182)(4, "path", 618)(5, "rect", 619);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.removeComputationHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_93_Template(rf, ctx) {
  if (rf & 1) {
    const _r75 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_93_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r75);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.updateComputationalHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_span_93_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r75);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.updateComputationalHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_span_93_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r75);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 620);
    core /* ɵɵelement */.nrm(3, "path", 621)(4, "path", 622)(5, "path", 623)(6, "path", 624)(7, "path", 625)(8, "path", 626);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.updateComputationalHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_94_Template(rf, ctx) {
  if (rf & 1) {
    const _r76 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_94_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r76);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.editUnitsHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_span_94_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r76);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.editUnitsHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_span_94_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r76);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "circle", 627)(4, "rect", 628)(5, "path", 629)(6, "rect", 630)(7, "rect", 631)(8, "circle", 632)(9, "path", 182)(10, "line", 633)(11, "line", 634)(12, "circle", 635)(13, "path", 636)(14, "path", 637)(15, "path", 638)(16, "rect", 639)(17, "line", 640)(18, "line", 641)(19, "line", 642)(20, "line", 643);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.editUnitsHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_95_Template(rf, ctx) {
  if (rf & 1) {
    const _r77 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_95_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r77);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.editAliasHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_span_95_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r77);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.editAliasHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_span_95_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r77);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "path", 644)(4, "path", 182)(5, "path", 645);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.editAliasHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_96_Template(rf, ctx) {
  if (rf & 1) {
    const _r78 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_96_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r78);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setTimeDurationHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_span_96_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r78);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.setTimeDurationHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_span_96_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r78);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "rect", 646)(4, "rect", 647)(5, "path", 182)(6, "circle", 648)(7, "rect", 649)(8, "rect", 650)(9, "rect", 651)(10, "rect", 652)(11, "rect", 653)(12, "rect", 654)(13, "rect", 655)(14, "rect", 656)(15, "rect", 657)(16, "rect", 658)(17, "rect", 659)(18, "rect", 660)(19, "circle", 661);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.setTimeDurationHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_97_Template(rf, ctx) {
  if (rf & 1) {
    const _r79 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_97_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r79);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.suppressSingleStateHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_span_97_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r79);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.suppressSingleStateHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_span_97_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r79);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "path", 662)(4, "path", 663)(5, "path", 7);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.suppressSingleStateHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_98_Template(rf, ctx) {
  if (rf & 1) {
    const _r80 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 664);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_98_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r80);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.timeDurationRemoveButtonAction());
    })("mouseenter", function ElementToolBarComponent_div_0_span_98_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r80);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/remove_time_duration.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_span_98_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r80);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "rect", 646)(4, "rect", 647)(5, "path", 182)(6, "circle", 648)(7, "rect", 649)(8, "rect", 650)(9, "rect", 651)(10, "rect", 652)(11, "rect", 653)(12, "rect", 654)(13, "rect", 655)(14, "rect", 656)(15, "rect", 657)(16, "rect", 658)(17, "rect", 659)(18, "rect", 660)(19, "circle", 661)(20, "rect", 665);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_a_99_Template(rf, ctx) {
  if (rf & 1) {
    const _r81 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_99_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r81);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toogleEssenceHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_99_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r81);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.toogleEssenceHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_99_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r81);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 420)(3, "path", 666);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.toogleEssenceHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_101_Template(rf, ctx) {
  if (rf & 1) {
    const _r82 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_101_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r82);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toogleAffiliationHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_101_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r82);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.toogleAffiliationHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_101_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r82);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 667);
    core /* ɵɵelement */.nrm(2, "rect", 668)(3, "path", 669);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.toogleAffiliationHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_span_102_Template(rf, ctx) {
  if (rf & 1) {
    const _r83 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "a", 90);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_102_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r83);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      ctx_r1.userInputHandle.action.act();
      return core /* ɵɵresetView */.Njj(ctx_r1.onSelection());
    });
    core /* ɵɵelement */.nrm(2, "img", 467);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.userInputHandle.displayTitle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("src", "./assets/SVG/toolbar/", ctx_r1.userInputHandle.svg, ".svg", core /* ɵɵsanitizeUrl */.B4B);
  }
}
function ElementToolBarComponent_div_0_a_104_Template(rf, ctx) {
  if (rf & 1) {
    const _r84 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_104_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r84);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.suppressHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_104_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r84);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.suppressHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_104_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r84);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 662)(3, "path", 663)(4, "path", 7);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.suppressHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_105_Template(rf, ctx) {
  if (rf & 1) {
    const _r85 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_105_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r85);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.destateHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_105_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r85);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.destateHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_105_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r85);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 113)(3, "path", 670);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.destateHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_106_Template(rf, ctx) {
  if (rf & 1) {
    const _r86 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_106_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r86);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.addStateHandle.action.act());
    })("mouseenter", function ElementToolBarComponent_div_0_a_106_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r86);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, ctx_r1.addStateHandle.gif));
    })("mouseleave", function ElementToolBarComponent_div_0_a_106_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r86);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 420)(3, "path", 671);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.addStateHandle.displayTitle);
  }
}
function ElementToolBarComponent_div_0_a_107_Template(rf, ctx) {
  if (rf & 1) {
    const _r87 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 672);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_107_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r87);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.selected.addSemifolded ? ctx_r1.selected.addSemifolded() : null);
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 673);
    core /* ɵɵelementStart */.j41(4, "mask", 674);
    core /* ɵɵelement */.nrm(5, "path", 675);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(6, "path", 676)(7, "path", 677)(8, "path", 678)(9, "path", 679)(10, "path", 680);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_108_Template(rf, ctx) {
  if (rf & 1) {
    const _r88 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 681);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_108_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r88);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.removeSemifolding());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 673);
    core /* ɵɵelementStart */.j41(4, "mask", 506);
    core /* ɵɵelement */.nrm(5, "path", 675);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(6, "path", 682)(7, "path", 677)(8, "path", 678)(9, "path", 679)(10, "path", 680)(11, "rect", 683);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_a_110__svg_path_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelement */.nrm(0, "path", 688);
  }
}
function ElementToolBarComponent_div_0_a_110__svg_path_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelement */.nrm(0, "path", 689);
  }
}
function ElementToolBarComponent_div_0_a_110_Template(rf, ctx) {
  if (rf & 1) {
    const _r89 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 684);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_a_110_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r89);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleStatesArrangementDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 91);
    core /* ɵɵelement */.nrm(2, "rect", 97)(3, "path", 685);
    core /* ɵɵtemplate */.DNE(4, ElementToolBarComponent_div_0_a_110__svg_path_4_Template, 1, 0, "path", 686)(5, ElementToolBarComponent_div_0_a_110__svg_path_5_Template, 1, 0, "path", 687);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showStatesArrangementDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showStatesArrangementDiv);
  }
}
function ElementToolBarComponent_div_0_div_111_span_1_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r90 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 697);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_111_span_1_a_1_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r90);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeSatesLeft());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 420)(3, "path", 698);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_111_span_1_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r91 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 699);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_111_span_1_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r91);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeSatesTop());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 700);
    core /* ɵɵelement */.nrm(2, "rect", 701)(3, "path", 702);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_111_span_1_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r92 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 703);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_111_span_1_a_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r92);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeSatesRight());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 704);
    core /* ɵɵelementStart */.j41(3, "svg", 705);
    core /* ɵɵelement */.nrm(4, "path", 706);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_div_0_div_111_span_1_a_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r93 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 707);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_div_111_span_1_a_4_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r93);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeSatesBottom());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 700);
    core /* ɵɵelement */.nrm(2, "rect", 708)(3, "path", 685);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_div_0_div_111_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 692);
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_div_0_div_111_span_1_a_1_Template, 4, 0, "a", 693)(2, ElementToolBarComponent_div_0_div_111_span_1_a_2_Template, 4, 0, "a", 694)(3, ElementToolBarComponent_div_0_div_111_span_1_a_3_Template, 5, 0, "a", 695)(4, ElementToolBarComponent_div_0_div_111_span_1_a_4_Template, 4, 0, "a", 696);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isObject && ctx_r1.selected.hasStates() && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isObject && ctx_r1.selected.hasStates() && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isObject && ctx_r1.selected.hasStates() && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isObject && ctx_r1.selected.hasStates() && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
  }
}
function ElementToolBarComponent_div_0_div_111_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 690);
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_div_0_div_111_span_1_Template, 5, 4, "span", 691);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showStatesArrangementDiv);
  }
}
function ElementToolBarComponent_div_0_span_112__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 718);
    core /* ɵɵelement */.nrm(1, "path", 719)(2, "path", 720);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_112__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 718);
    core /* ɵɵelement */.nrm(1, "path", 721)(2, "path", 722);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_112__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 718);
    core /* ɵɵelement */.nrm(1, "path", 719)(2, "path", 723);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_112__svg_svg_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 718);
    core /* ɵɵelement */.nrm(1, "path", 721)(2, "path", 724);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_112__svg_svg_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 718);
    core /* ɵɵelement */.nrm(1, "path", 719)(2, "path", 725);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_112__svg_svg_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 718);
    core /* ɵɵelement */.nrm(1, "path", 721)(2, "path", 726);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_div_0_span_112_Template(rf, ctx) {
  if (rf & 1) {
    const _r94 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 709)(1, "a", 710);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_112_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r94);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setInitialState());
    });
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_div_0_span_112__svg_svg_2_Template, 3, 0, "svg", 711)(3, ElementToolBarComponent_div_0_span_112__svg_svg_3_Template, 3, 0, "svg", 711);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "a", 712);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_112_Template_a_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r94);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setFinalState());
    });
    core /* ɵɵtemplate */.DNE(5, ElementToolBarComponent_div_0_span_112__svg_svg_5_Template, 3, 0, "svg", 711)(6, ElementToolBarComponent_div_0_span_112__svg_svg_6_Template, 3, 0, "svg", 711);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "a", 713);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_112_Template_a_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r94);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setCurrentState());
    });
    core /* ɵɵtemplate */.DNE(8, ElementToolBarComponent_div_0_span_112__svg_svg_8_Template, 3, 0, "svg", 711)(9, ElementToolBarComponent_div_0_span_112__svg_svg_9_Template, 3, 0, "svg", 711);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "a", 714);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_span_112_Template_a_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r94);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.setDefaultState());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(11, "svg", 715);
    core /* ɵɵelement */.nrm(12, "rect", 716)(13, "path", 717);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selected.attr(".outer/stroke-width") === 2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selected.attr(".outer/stroke-width") !== 2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selected.attr(".inner/stroke-width") === 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selected.attr(".inner/stroke-width") !== 0);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldCurrentBeColored());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.shouldCurrentBeColored());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleProp */.xc7("fill", ctx_r1.selected.attr("image/display") === "none" ? "#E6E9EB" : "#1A3763");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleProp */.xc7("fill", ctx_r1.selected.attr("image/display") === "none" ? "#1A3763" : "#E6E9EB");
  }
}
function ElementToolBarComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 2);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_Template_div_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.visibleNavBarClick($event));
    });
    core /* ɵɵelementStart */.j41(2, "span", 3)(3, "a", 4);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_Template_a_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.findAction());
    })("mouseenter", function ElementToolBarComponent_div_0_Template_a_mouseenter_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/find_things.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_Template_a_mouseleave_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(4, "svg", 5);
    core /* ɵɵelement */.nrm(5, "path", 6)(6, "path", 7)(7, "path", 8)(8, "path", 9)(9, "path", 10)(10, "line", 11)(11, "line", 12)(12, "line", 13)(13, "line", 14)(14, "path", 15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(15, "span", 16)(16, "a", 17);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.methodologicalChecking());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(17, "svg", 5);
    core /* ɵɵelement */.nrm(18, "circle", 18)(19, "path", 7)(20, "rect", 19)(21, "rect", 20)(22, "rect", 21)(23, "line", 22)(24, "line", 23)(25, "line", 24)(26, "line", 25)(27, "path", 26)(28, "path", 27);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(29, ElementToolBarComponent_div_0_span_29_Template, 4, 3, "span", 28)(30, ElementToolBarComponent_div_0_span_30_Template, 12, 3, "span", 29)(31, ElementToolBarComponent_div_0_div_31_Template, 13, 11, "div", 30)(32, ElementToolBarComponent_div_0_span_32_Template, 4, 3, "span", 31);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(33, "span", 32)(34, "a", 33);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_Template_a_click_34_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggelfullScreen());
    });
    core /* ɵɵtemplate */.DNE(35, ElementToolBarComponent_div_0__svg_svg_35_Template, 3, 0, "svg", 34)(36, ElementToolBarComponent_div_0__svg_svg_36_Template, 3, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(37, "span", 35);
    core /* ɵɵlistener */.bIt("mouseenter", function ElementToolBarComponent_div_0_Template_span_mouseenter_37_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/de_magnifying.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_Template_span_mouseleave_37_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵelementStart */.j41(38, "a", 36);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(39, "svg", 5);
    core /* ɵɵelement */.nrm(40, "rect", 37);
    core /* ɵɵelementStart */.j41(41, "svg", 38)(42, "g", 39);
    core /* ɵɵelement */.nrm(43, "path", 40)(44, "path", 41);
    core /* ɵɵelementEnd */.k0s()()()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(45, "span", 32)(46, "a", 42);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_Template_a_click_46_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomActive());
    })("mouseenter", function ElementToolBarComponent_div_0_Template_a_mouseenter_46_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/magnify.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_Template_a_mouseleave_46_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵelementStart */.j41(47, "label", 43);
    core /* ɵɵtext */.EFF(48);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(49, "svg", 44);
    core /* ɵɵelement */.nrm(50, "rect", 45)(51, "path", 46)(52, "path", 47);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(53, "span", 32);
    core /* ɵɵtemplate */.DNE(54, ElementToolBarComponent_div_0_span_54_Template, 42, 40, "span", 48);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(55, "span", 32)(56, "a", 49);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_div_0_Template_a_click_56_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomInSBar());
    })("mouseenter", function ElementToolBarComponent_div_0_Template_a_mouseenter_56_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/magnify.gif"));
    })("mouseleave", function ElementToolBarComponent_div_0_Template_a_mouseleave_56_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(57, "svg", 5);
    core /* ɵɵelement */.nrm(58, "rect", 37);
    core /* ɵɵelementStart */.j41(59, "svg", 38)(60, "g", 39);
    core /* ɵɵelement */.nrm(61, "path", 40)(62, "path", 50);
    core /* ɵɵelementEnd */.k0s()()()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(63, "span", 32);
    core /* ɵɵtemplate */.DNE(64, ElementToolBarComponent_div_0_a_64_Template, 8, 1, "a", 51);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(65, "span", 52);
    core /* ɵɵtemplate */.DNE(66, ElementToolBarComponent_div_0_a_66_Template, 6, 0, "a", 53)(67, ElementToolBarComponent_div_0_a_67_Template, 4, 0, "a", 54);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(68, "span", 55);
    core /* ɵɵtemplate */.DNE(69, ElementToolBarComponent_div_0_span_69_Template, 4, 3, "span", 56)(70, ElementToolBarComponent_div_0_a_70_Template, 12, 0, "a", 57)(71, ElementToolBarComponent_div_0_a_71_Template, 3, 2, "a", 58)(72, ElementToolBarComponent_div_0_div_72_Template, 4, 2, "div", 59)(73, ElementToolBarComponent_div_0_a_73_Template, 14, 0, "a", 60)(74, ElementToolBarComponent_div_0_a_74_Template, 14, 0, "a", 60)(75, ElementToolBarComponent_div_0_div_75_Template, 22, 5, "div", 61)(76, ElementToolBarComponent_div_0_a_76_Template, 7, 0, "a", 62)(77, ElementToolBarComponent_div_0_a_77_Template, 7, 0, "a", 62)(78, ElementToolBarComponent_div_0_div_78_Template, 24, 2, "div", 63)(79, ElementToolBarComponent_div_0_a_79_Template, 4, 1, "a", 64)(80, ElementToolBarComponent_div_0_a_80_Template, 4, 1, "a", 64)(81, ElementToolBarComponent_div_0_a_81_Template, 15, 0, "a", 65)(82, ElementToolBarComponent_div_0_a_82_Template, 11, 0, "a", 66)(83, ElementToolBarComponent_div_0_a_83_Template, 9, 0, "a", 67)(84, ElementToolBarComponent_div_0_a_84_Template, 9, 0, "a", 67)(85, ElementToolBarComponent_div_0_div_85_Template, 18, 16, "div", 68)(86, ElementToolBarComponent_div_0_a_86_Template, 14, 0, "a", 69)(87, ElementToolBarComponent_div_0_a_87_Template, 8, 0, "a", 70);
    core /* ɵɵelementStart */.j41(88, "span");
    core /* ɵɵtemplate */.DNE(89, ElementToolBarComponent_div_0_a_89_Template, 3, 3, "a", 71)(90, ElementToolBarComponent_div_0_div_90_Template, 18, 4, "div", 72);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(91, ElementToolBarComponent_div_0_span_91_Template, 5, 1, "span", 73)(92, ElementToolBarComponent_div_0_span_92_Template, 6, 1, "span", 73)(93, ElementToolBarComponent_div_0_span_93_Template, 9, 1, "span", 73)(94, ElementToolBarComponent_div_0_span_94_Template, 21, 1, "span", 73)(95, ElementToolBarComponent_div_0_span_95_Template, 6, 1, "span", 73)(96, ElementToolBarComponent_div_0_span_96_Template, 20, 1, "span", 73)(97, ElementToolBarComponent_div_0_span_97_Template, 6, 1, "span", 73)(98, ElementToolBarComponent_div_0_span_98_Template, 21, 0, "span", 73)(99, ElementToolBarComponent_div_0_a_99_Template, 4, 1, "a", 64);
    core /* ɵɵelementStart */.j41(100, "span", 74);
    core /* ɵɵtemplate */.DNE(101, ElementToolBarComponent_div_0_a_101_Template, 4, 1, "a", 64);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(102, ElementToolBarComponent_div_0_span_102_Template, 3, 3, "span", 73);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(103, "span", 75);
    core /* ɵɵtemplate */.DNE(104, ElementToolBarComponent_div_0_a_104_Template, 5, 1, "a", 64)(105, ElementToolBarComponent_div_0_a_105_Template, 4, 1, "a", 64)(106, ElementToolBarComponent_div_0_a_106_Template, 4, 1, "a", 64)(107, ElementToolBarComponent_div_0_a_107_Template, 11, 0, "a", 76)(108, ElementToolBarComponent_div_0_a_108_Template, 12, 0, "a", 77);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(109, "span", 78);
    core /* ɵɵtemplate */.DNE(110, ElementToolBarComponent_div_0_a_110_Template, 6, 2, "a", 79)(111, ElementToolBarComponent_div_0_div_111_Template, 2, 1, "div", 80);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(112, ElementToolBarComponent_div_0_span_112_Template, 14, 10, "span", 81);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(29);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowStyling());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowStyling());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowStyling() && ctx_r1.showStylingDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.selected);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isAtFullScreen() === false);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isAtFullScreen() === true);
    core /* ɵɵadvance */.R7$(12);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.zoomStatus + "%", " ");
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.zoomActiveStatus);
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.removeHandle);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLink && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowOutzoom());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1._shouldShowConnectSubModel);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r1.isProcess || ctx_r1.isObject || ctx_r1.isState) && ctx_r1.shouldShowCreateViewIcon() && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isViewsDivOpen);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r1.isProcess || ctx_r1.isObject) && !ctx_r1.showOpmRequirementsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r1.isProcess || ctx_r1.isObject) && ctx_r1.showOpmRequirementsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showOpmRequirementsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showThingBackgroundDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showThingBackgroundDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showThingBackgroundDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.unfoldHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.inzoomHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowInDiagramInzoom());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowAddURL());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r1.isProcess || ctx_r1.isObject || ctx_r1.isState) && !ctx_r1.showExtensionsDiv && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r1.isProcess || ctx_r1.isObject || ctx_r1.isState) && ctx_r1.showExtensionsDiv && ctx_r1.selected.attributes.type !== "opm.Ellipsis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showExtensionsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowSimulateElement());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowBringLinkBetweenSelected());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.bringConnectedHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.bringConnectedHandle && ctx_r1.showBringConnectedDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.setComputationHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.removeComputationHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.updateComputationalHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.editUnitsHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.editAliasHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.setTimeDurationHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.suppressSingleStateHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isTimeDurational());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.toogleEssenceHandle);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.toogleAffiliationHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.userInputHandle);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.suppressHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.destateHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.addStateHandle);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1._shouldShowSemifolding);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRemoveSemifolding());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowStateArrangementGroupIcon());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showStatesArrangementDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldChangeStateCondition());
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r97 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 785);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_a_1_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r97);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.asyncExecute());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 786)(3, "rect", 113);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r98 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 787);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r98);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.ExecutePause());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 788);
    core /* ɵɵelement */.nrm(2, "rect", 789)(3, "rect", 790)(4, "rect", 791);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r99 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 792);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_a_21_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r99);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleCSVDownload());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 86)(3, "path", 793)(4, "rect", 794)(5, "path", 795);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r100 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 796);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_a_22_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r100);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleCSVDownload());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 797)(4, "rect", 798)(5, "rect", 799)(6, "path", 800);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_input_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r101 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 801);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_input_23_Template_input_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r101);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.numberOfRunsChange());
    })("keyup", function ElementToolBarComponent_ng_template_1_span_29_input_23_Template_input_keyup_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r101);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.numberOfRunsChange());
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵproperty */.Y8G("value", ctx_r1.numberOfRuns);
  }
}
function ElementToolBarComponent_ng_template_1_span_29_input_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r102 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 802);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_input_24_Template_input_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r102);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadFileEvery());
    })("keyup", function ElementToolBarComponent_ng_template_1_span_29_input_24_Template_input_keyup_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r102);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadFileEvery());
    });
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r103 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 803);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_a_25_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r103);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.syncExecute());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 804)(4, "path", 805)(5, "path", 806)(6, "path", 807)(7, "path", 808);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_26__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 810)(3, "circle", 811)(4, "path", 812);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_26__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 813)(3, "circle", 814)(4, "path", 815);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r104 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 809);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_a_26_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r104);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleRunByConfigurations());
    });
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_ng_template_1_span_29_a_26__svg_svg_1_Template, 5, 0, "svg", 34)(2, ElementToolBarComponent_ng_template_1_span_29_a_26__svg_svg_2_Template, 5, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.runByConfigurations);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.runByConfigurations);
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_27__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 820);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "rect", 821)(3, "line", 822)(4, "line", 823)(5, "line", 824)(6, "line", 825)(7, "line", 826);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_27__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 820);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "rect", 827)(3, "line", 828)(4, "line", 829)(5, "line", 830)(6, "line", 831)(7, "line", 832);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_a_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r105 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 816)(1, "label", 817);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_ng_template_1_span_29_a_27__svg_svg_2_Template, 8, 0, "svg", 818)(3, ElementToolBarComponent_ng_template_1_span_29_a_27__svg_svg_3_Template, 8, 0, "svg", 818);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "input", 819);
    core /* ɵɵlistener */.bIt("change", function ElementToolBarComponent_ng_template_1_span_29_a_27_Template_input_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r105);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.incomingfile($event));
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.uploaded);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.uploaded);
  }
}
function ElementToolBarComponent_ng_template_1_span_29__svg_svg_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r106 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 608);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29__svg_svg_30_Template_svg_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r106);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleExecutionSettingsDiv());
    });
    core /* ɵɵelement */.nrm(1, "path", 833)(2, "path", 834)(3, "path", 835)(4, "path", 836)(5, "path", 837)(6, "path", 838);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29__svg_svg_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r107 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 608);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29__svg_svg_31_Template_svg_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r107);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleExecutionSettingsDiv());
    });
    core /* ɵɵelement */.nrm(1, "path", 833)(2, "path", 834)(3, "path", 835)(4, "path", 836)(5, "path", 837)(6, "path", 452);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_29_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r108 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 839)(1, "span", 383)(2, "div", 840)(3, "div", 841)(4, "span", 842)(5, "mat-checkbox", 843);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_ng_template_1_span_29_div_32_Template_mat_checkbox_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r108);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.isHeadlessRunner, $event)) {
        ctx_r1.isHeadlessRunner = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(6, " Headless Runner ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "span", 842)(8, "mat-checkbox", 843);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_ng_template_1_span_29_div_32_Template_mat_checkbox_ngModelChange_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r108);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.init.includeSubModelsInExecution, $event)) {
        ctx_r1.init.includeSubModelsInExecution = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(9, " Include Sub Models ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "span", 844)(11, "mat-checkbox", 845);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ElementToolBarComponent_ng_template_1_span_29_div_32_Template_mat_checkbox_ngModelChange_11_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r108);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.isExecutionResetValue, $event)) {
        ctx_r1.isExecutionResetValue = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(12, " Reset Values Each Run ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "span", 846)(14, "label", 847);
    core /* ɵɵtext */.EFF(15, "Animation Speed:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "mat-slider", 848)(17, "input", 849);
    core /* ɵɵlistener */.bIt("change", function ElementToolBarComponent_ng_template_1_span_29_div_32_Template_input_change_17_listener() {
      core /* ɵɵrestoreView */.eBV(_r108);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.tokenRatioChange());
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(18, "label", 850);
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.isHeadlessRunner);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.init.includeSubModelsInExecution);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.isExecutionResetValue);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("value", ctx_r1.simulationSliderValue);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.getRatio(), "%");
  }
}
function ElementToolBarComponent_ng_template_1_span_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r96 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 770);
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_ng_template_1_span_29_a_1_Template, 4, 0, "a", 771)(2, ElementToolBarComponent_ng_template_1_span_29_a_2_Template, 5, 0, "a", 772);
    core /* ɵɵelementStart */.j41(3, "a", 773);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_Template_a_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r96);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.ExecuteStop());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(4, "svg", 5);
    core /* ɵɵelement */.nrm(5, "rect", 774)(6, "rect", 113);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(7, "a", 775);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_29_Template_a_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r96);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.simulation());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(8, "svg", 5);
    core /* ɵɵelement */.nrm(9, "path", 182)(10, "path", 589)(11, "path", 590)(12, "path", 591)(13, "path", 592)(14, "path", 593)(15, "path", 594)(16, "path", 595)(17, "path", 596)(18, "path", 597)(19, "path", 598)(20, "path", 599);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(21, ElementToolBarComponent_ng_template_1_span_29_a_21_Template, 6, 0, "a", 776)(22, ElementToolBarComponent_ng_template_1_span_29_a_22_Template, 7, 0, "a", 777)(23, ElementToolBarComponent_ng_template_1_span_29_input_23_Template, 1, 1, "input", 778)(24, ElementToolBarComponent_ng_template_1_span_29_input_24_Template, 1, 0, "input", 779)(25, ElementToolBarComponent_ng_template_1_span_29_a_25_Template, 8, 0, "a", 780)(26, ElementToolBarComponent_ng_template_1_span_29_a_26_Template, 3, 2, "a", 781)(27, ElementToolBarComponent_ng_template_1_span_29_a_27_Template, 5, 2, "a", 782);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(28, "span")(29, "a", 783);
    core /* ɵɵtemplate */.DNE(30, ElementToolBarComponent_ng_template_1_span_29__svg_svg_30_Template, 7, 0, "svg", 607)(31, ElementToolBarComponent_ng_template_1_span_29__svg_svg_31_Template, 7, 0, "svg", 607);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(32, ElementToolBarComponent_ng_template_1_span_29_div_32_Template, 20, 5, "div", 784);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.Executing || ctx_r1.ExecutingPause);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.Executing && !ctx_r1.ExecutingPause);
    core /* ɵɵadvance */.R7$(19);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.downloadCSV && (!ctx_r1.Executing || ctx_r1.ExecutingPause));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.downloadCSV && (!ctx_r1.Executing || ctx_r1.ExecutingPause));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.Executing || ctx_r1.ExecutingPause);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.downloadCSV);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.Executing || ctx_r1.ExecutingPause);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.Executing || ctx_r1.ExecutingPause);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.Executing || ctx_r1.ExecutingPause);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showExecutionSettingsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showExecutionSettingsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showExecutionSettingsDiv);
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_35_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7);
    core /* ɵɵelementStart */.j41(2, "mask", 851);
    core /* ɵɵelement */.nrm(3, "path", 852);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "path", 853);
    core /* ɵɵelementStart */.j41(5, "mask", 854);
    core /* ɵɵelement */.nrm(6, "path", 855);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(7, "path", 856);
    core /* ɵɵelementStart */.j41(8, "mask", 857);
    core /* ɵɵelement */.nrm(9, "path", 858);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(10, "path", 859);
    core /* ɵɵelementStart */.j41(11, "mask", 860);
    core /* ɵɵelement */.nrm(12, "path", 861);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(13, "path", 862);
    core /* ɵɵelementStart */.j41(14, "mask", 863);
    core /* ɵɵelement */.nrm(15, "path", 864);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(16, "path", 865);
    core /* ɵɵelementStart */.j41(17, "mask", 866);
    core /* ɵɵelement */.nrm(18, "path", 867);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(19, "path", 868);
    core /* ɵɵelementStart */.j41(20, "mask", 869);
    core /* ɵɵelement */.nrm(21, "path", 870);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(22, "path", 871);
    core /* ɵɵelementStart */.j41(23, "mask", 872);
    core /* ɵɵelement */.nrm(24, "path", 873);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(25, "path", 874);
    core /* ɵɵelementStart */.j41(26, "mask", 875);
    core /* ɵɵelement */.nrm(27, "path", 876);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(28, "path", 877);
    core /* ɵɵelementStart */.j41(29, "mask", 878);
    core /* ɵɵelement */.nrm(30, "path", 879);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(31, "path", 880)(32, "rect", 881)(33, "rect", 882);
    core /* ɵɵelementStart */.j41(34, "mask", 883);
    core /* ɵɵelement */.nrm(35, "path", 884);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(36, "path", 885);
    core /* ɵɵelementStart */.j41(37, "mask", 886);
    core /* ɵɵelement */.nrm(38, "path", 887);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(39, "path", 888)(40, "rect", 889)(41, "rect", 890);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_36_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86);
    core /* ɵɵelementStart */.j41(2, "mask", 851);
    core /* ɵɵelement */.nrm(3, "path", 852);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(4, "path", 891);
    core /* ɵɵelementStart */.j41(5, "mask", 854);
    core /* ɵɵelement */.nrm(6, "path", 855);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(7, "path", 892);
    core /* ɵɵelementStart */.j41(8, "mask", 857);
    core /* ɵɵelement */.nrm(9, "path", 858);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(10, "path", 893);
    core /* ɵɵelementStart */.j41(11, "mask", 860);
    core /* ɵɵelement */.nrm(12, "path", 861);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(13, "path", 894);
    core /* ɵɵelementStart */.j41(14, "mask", 863);
    core /* ɵɵelement */.nrm(15, "path", 864);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(16, "path", 895);
    core /* ɵɵelementStart */.j41(17, "mask", 866);
    core /* ɵɵelement */.nrm(18, "path", 867);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(19, "path", 896);
    core /* ɵɵelementStart */.j41(20, "mask", 869);
    core /* ɵɵelement */.nrm(21, "path", 870);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(22, "path", 897);
    core /* ɵɵelementStart */.j41(23, "mask", 872);
    core /* ɵɵelement */.nrm(24, "path", 873);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(25, "path", 898);
    core /* ɵɵelementStart */.j41(26, "mask", 875);
    core /* ɵɵelement */.nrm(27, "path", 876);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(28, "path", 899);
    core /* ɵɵelementStart */.j41(29, "mask", 878);
    core /* ɵɵelement */.nrm(30, "path", 879);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(31, "path", 900)(32, "rect", 901)(33, "rect", 902);
    core /* ɵɵelementStart */.j41(34, "mask", 883);
    core /* ɵɵelement */.nrm(35, "path", 884);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(36, "path", 903);
    core /* ɵɵelementStart */.j41(37, "mask", 886);
    core /* ɵɵelement */.nrm(38, "path", 887);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(39, "path", 904)(40, "rect", 905)(41, "rect", 906);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_39_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "circle", 221)(3, "path", 222)(4, "rect", 223);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_40_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "circle", 224)(3, "path", 225)(4, "rect", 226);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_43_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "rect", 97)(2, "path", 227);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_44_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 228)(2, "path", 229);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r109 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 907)(1, "span", 231)(2, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("10"));
    });
    core /* ɵɵtext */.EFF(3, "10%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("20"));
    });
    core /* ɵɵtext */.EFF(5, "20%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("30"));
    });
    core /* ɵɵtext */.EFF(7, "30%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("40"));
    });
    core /* ɵɵtext */.EFF(9, "40%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("50"));
    });
    core /* ɵɵtext */.EFF(11, "50%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("60"));
    });
    core /* ɵɵtext */.EFF(13, "60%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("70"));
    });
    core /* ɵɵtext */.EFF(15, "70%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("80"));
    });
    core /* ɵɵtext */.EFF(17, "80%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(18, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_18_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("90"));
    });
    core /* ɵɵtext */.EFF(19, "90%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_20_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("100"));
    });
    core /* ɵɵtext */.EFF(21, "100%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(22, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_22_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("110"));
    });
    core /* ɵɵtext */.EFF(23, "110%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(24, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_24_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("120"));
    });
    core /* ɵɵtext */.EFF(25, "120%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(26, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_26_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("130"));
    });
    core /* ɵɵtext */.EFF(27, "130%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(28, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_28_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("140"));
    });
    core /* ɵɵtext */.EFF(29, "140%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(30, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_30_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("150"));
    });
    core /* ɵɵtext */.EFF(31, "150%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(32, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_32_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("160"));
    });
    core /* ɵɵtext */.EFF(33, "160%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(34, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_34_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("170"));
    });
    core /* ɵɵtext */.EFF(35, "170%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(36, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_36_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("180"));
    });
    core /* ɵɵtext */.EFF(37, "180%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(38, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_38_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("190"));
    });
    core /* ɵɵtext */.EFF(39, "190%");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(40, "a", 232);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_62_Template_a_click_40_listener() {
      core /* ɵɵrestoreView */.eBV(_r109);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomSelect("200"));
    });
    core /* ɵɵtext */.EFF(41, "200%");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "10" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "20" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "30" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "40" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "50" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "60" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "70" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "80" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "90" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "100" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "110" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "120" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "130" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "140" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "150" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "160" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "170" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "180" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "190" ? "font-weight:bold;" : "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleMap */.Aen(ctx_r1.zoomStatus === "200" ? "font-weight:bold;" : "");
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_73_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "circle", 908)(3, "line", 909)(4, "line", 910)(5, "line", 911)(6, "line", 912);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_74_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "circle", 913)(3, "line", 914)(4, "line", 915)(5, "line", 916)(6, "line", 917);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_75__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 919)(3, "line", 920)(4, "line", 921)(5, "line", 922);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_75__svg_svg_3__svg_text_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "text", 925);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.init.chatUnreadCount);
  }
}
function ElementToolBarComponent_ng_template_1_span_75__svg_svg_3__svg_text_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "text", 926);
    core /* ɵɵtext */.EFF(1, "9+");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_75__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 919)(3, "line", 920)(4, "line", 921)(5, "line", 922);
    core /* ɵɵtemplate */.DNE(6, ElementToolBarComponent_ng_template_1_span_75__svg_svg_3__svg_text_6_Template, 2, 1, "text", 923)(7, ElementToolBarComponent_ng_template_1_span_75__svg_svg_3__svg_text_7_Template, 2, 0, "text", 924);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.chatUnreadCount < 10);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.chatUnreadCount >= 10);
  }
}
function ElementToolBarComponent_ng_template_1_span_75__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 927)(3, "line", 928)(4, "line", 929)(5, "line", 930);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_span_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r110 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 732)(1, "a", 918);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_75_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r110);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleChat());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_span_75_Template_a_mouseenter_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r110);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/model_chat_button.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_span_75_Template_a_mouseleave_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r110);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_ng_template_1_span_75__svg_svg_2_Template, 6, 0, "svg", 34)(3, ElementToolBarComponent_ng_template_1_span_75__svg_svg_3_Template, 8, 2, "svg", 34)(4, ElementToolBarComponent_ng_template_1_span_75__svg_svg_4_Template, 6, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("matTooltip", "Total Unread Messages: ", ctx_r1.init.chatUnreadCount, "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.showChatPanel && ctx_r1.init.chatUnreadCount <= 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.showChatPanel && ctx_r1.init.chatUnreadCount > 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.showChatPanel);
  }
}
function ElementToolBarComponent_ng_template_1_a_77_Template(rf, ctx) {
  if (rf & 1) {
    const _r111 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 931);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_77_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r111);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleConnectionsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 932)(4, "path", 933);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_78_Template(rf, ctx) {
  if (rf & 1) {
    const _r112 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 931);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_78_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r112);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleConnectionsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 932)(4, "path", 934);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 940)(3, "path", 941)(4, "path", 942);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 943)(3, "path", 944)(4, "path", 945);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 946)(3, "path", 947);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 948)(3, "path", 949);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "circle", 950)(3, "circle", 951)(4, "circle", 952)(5, "circle", 953)(6, "ellipse", 954)(7, "ellipse", 955)(8, "ellipse", 956)(9, "ellipse", 957)(10, "rect", 958)(11, "line", 959)(12, "line", 960)(13, "line", 961)(14, "line", 962)(15, "path", 963);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_10_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "circle", 964)(3, "circle", 965)(4, "circle", 966)(5, "circle", 967)(6, "ellipse", 968)(7, "ellipse", 969)(8, "ellipse", 970)(9, "ellipse", 971)(10, "rect", 972)(11, "line", 973)(12, "line", 974)(13, "line", 975)(14, "line", 976)(15, "path", 977);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 978)(3, "circle", 979)(4, "circle", 980)(5, "circle", 981)(6, "circle", 982)(7, "circle", 983)(8, "circle", 984)(9, "circle", 985)(10, "circle", 986)(11, "circle", 987);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79__svg_svg_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 988)(3, "circle", 989)(4, "circle", 990)(5, "circle", 991)(6, "circle", 992)(7, "circle", 993)(8, "circle", 994)(9, "circle", 995)(10, "circle", 996)(11, "circle", 997);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_div_79_Template(rf, ctx) {
  if (rf & 1) {
    const _r113 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 282)(1, "span", 935)(2, "a", 936);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_79_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r113);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.Pythonactivate());
    });
    core /* ɵɵtemplate */.DNE(3, ElementToolBarComponent_ng_template_1_div_79__svg_svg_3_Template, 5, 0, "svg", 34)(4, ElementToolBarComponent_ng_template_1_div_79__svg_svg_4_Template, 5, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "a", 937);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_79_Template_a_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r113);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.MySQLactivate());
    });
    core /* ɵɵtemplate */.DNE(6, ElementToolBarComponent_ng_template_1_div_79__svg_svg_6_Template, 4, 0, "svg", 34)(7, ElementToolBarComponent_ng_template_1_div_79__svg_svg_7_Template, 4, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "a", 938);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_79_Template_a_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r113);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.MQTTactivate());
    });
    core /* ɵɵtemplate */.DNE(9, ElementToolBarComponent_ng_template_1_div_79__svg_svg_9_Template, 16, 0, "svg", 34)(10, ElementToolBarComponent_ng_template_1_div_79__svg_svg_10_Template, 16, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "a", 939);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_79_Template_a_click_11_listener() {
      core /* ɵɵrestoreView */.eBV(_r113);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.ROSactivate());
    });
    core /* ɵɵtemplate */.DNE(12, ElementToolBarComponent_ng_template_1_div_79__svg_svg_12_Template, 12, 0, "svg", 34)(13, ElementToolBarComponent_ng_template_1_div_79__svg_svg_13_Template, 12, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate2 */.FCK("matTooltip", "Python Connection\rServer: ", ctx_r1.calcServer("python"), "\rPort: ", ctx_r1.calcPort("python"), "");
    core /* ɵɵproperty */.Y8G("matTooltipClass", "ros-mqtt-tooltip");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.activatePython);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.activatePython);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate2 */.FCK("matTooltip", "MySQL Connection\rHostname: ", ctx_r1.calcServer("mysql"), "\rPort: ", ctx_r1.calcPort("mysql"), "");
    core /* ɵɵproperty */.Y8G("matTooltipClass", "ros-mqtt-tooltip");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.activateMySQL);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.activateMySQL);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate2 */.FCK("matTooltip", "MQTT Connection\rServer: ", ctx_r1.calcServer("mqtt"), "\rPort: ", ctx_r1.calcPort("mqtt"), "");
    core /* ɵɵproperty */.Y8G("matTooltipClass", "ros-mqtt-tooltip");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.activateMQTT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.activateMQTT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate2 */.FCK("matTooltip", "ROS Connection\rServer: ", ctx_r1.calcServer("ros"), "\rPort: ", ctx_r1.calcPort("ros"), "");
    core /* ɵɵproperty */.Y8G("matTooltipClass", "ros-mqtt-tooltip");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.activateROS);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.activateROS);
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_82_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 86)(2, "path", 998)(3, "path", 999)(4, "path", 1000)(5, "path", 1001)(6, "line", 1002)(7, "line", 1003);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1__svg_svg_83_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 1004)(3, "path", 1005)(4, "path", 1006)(5, "path", 1007)(6, "line", 1008)(7, "line", 1009);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_a_85_Template(rf, ctx) {
  if (rf & 1) {
    const _r114 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 306);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_85_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r114);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleOpmRequirementsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 280)(4, "path", 307)(5, "path", 308)(6, "path", 309)(7, "path", 310)(8, "path", 311)(9, "path", 312)(10, "path", 313)(11, "path", 314)(12, "path", 315)(13, "rect", 316);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_86_Template(rf, ctx) {
  if (rf & 1) {
    const _r115 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 306);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_86_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r115);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleOpmRequirementsDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 281)(4, "path", 307)(5, "path", 308)(6, "path", 309)(7, "path", 310)(8, "path", 311)(9, "path", 317)(10, "path", 313)(11, "path", 318)(12, "path", 315)(13, "rect", 316);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_87_Template(rf, ctx) {
  if (rf & 1) {
    const _r116 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 282)(1, "span", 283)(2, "a", 1010);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_87_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r116);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleAllOpdRequirements());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_div_87_Template_a_mouseenter_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r116);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_requirement.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_div_87_Template_a_mouseleave_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r116);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(3, "svg", 5);
    core /* ɵɵelement */.nrm(4, "path", 7)(5, "rect", 354)(6, "circle", 355)(7, "path", 356)(8, "path", 357)(9, "path", 358)(10, "path", 359)(11, "path", 360)(12, "path", 361)(13, "path", 362);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(14, "a", 321);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_87_Template_a_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r116);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openCreateReqruiementsViewDialog());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_div_87_Template_a_mouseenter_14_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r116);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/create_requirement_view.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_div_87_Template_a_mouseleave_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r116);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(15, "svg", 5);
    core /* ɵɵelement */.nrm(16, "path", 7)(17, "path", 322)(18, "path", 323)(19, "path", 324)(20, "path", 325)(21, "path", 326)(22, "path", 327)(23, "path", 328)(24, "path", 329)(25, "path", 330)(26, "path", 331)(27, "circle", 332)(28, "circle", 333);
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function ElementToolBarComponent_ng_template_1_a_88_Template(rf, ctx) {
  if (rf & 1) {
    const _r117 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 378);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_88_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r117);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleThingBackgroundDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 280)(4, "rect", 379)(5, "path", 380)(6, "circle", 381);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_89_Template(rf, ctx) {
  if (rf & 1) {
    const _r118 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 378);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_89_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r118);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleThingBackgroundDiv());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 281)(4, "rect", 379)(5, "path", 380)(6, "circle", 381);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_90_a_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r120 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 403);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_90_a_10_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r120);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openImagePoolManagingDialog());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "rect", 404)(4, "path", 405)(5, "path", 406)(6, "rect", 407)(7, "path", 408)(8, "path", 409)(9, "rect", 410)(10, "path", 411)(11, "circle", 412);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_90_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r121 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 413)(1, "select", 414);
    core /* ɵɵlistener */.bIt("change", function ElementToolBarComponent_ng_template_1_div_90_div_23_Template_select_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r121);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showImagesChange($event));
    });
    core /* ɵɵelementStart */.j41(2, "option", 415);
    core /* ɵɵtext */.EFF(3, "Select an Option...");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "option", 416);
    core /* ɵɵtext */.EFF(5, "Show Text Only");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option", 417);
    core /* ɵɵtext */.EFF(7, "Show Images Only");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "option", 418);
    core /* ɵɵtext */.EFF(9, "Show Semi-Transparent Images & Text");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "option", 419);
    core /* ɵɵtext */.EFF(11, "Show Images & Text");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_ng_template_1_div_90_Template(rf, ctx) {
  if (rf & 1) {
    const _r119 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 1011)(1, "span", 383)(2, "a", 384);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_90_Template_a_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r119);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openThingBackgroundImageDialog());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(3, "svg", 385);
    core /* ɵɵelement */.nrm(4, "path", 7)(5, "rect", 386)(6, "path", 387)(7, "circle", 388)(8, "path", 389)(9, "path", 390);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(10, ElementToolBarComponent_ng_template_1_div_90_a_10_Template, 12, 0, "a", 391);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(11, "a", 392);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_90_Template_a_click_11_listener() {
      core /* ɵɵrestoreView */.eBV(_r119);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.showImagesIsThingsSelection = !ctx_r1.showImagesIsThingsSelection);
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(12, "svg", 5);
    core /* ɵɵelement */.nrm(13, "path", 7)(14, "path", 393)(15, "path", 394)(16, "path", 395)(17, "path", 396)(18, "path", 397)(19, "circle", 398)(20, "circle", 399)(21, "path", 400)(22, "path", 401);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(23, ElementToolBarComponent_ng_template_1_div_90_div_23_Template, 12, 0, "div", 402);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.service.isBackendSupported());
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showImagesIsThingsSelection);
  }
}
function ElementToolBarComponent_ng_template_1_a_91_Template(rf, ctx) {
  if (rf & 1) {
    const _r122 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1012);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_91_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r122);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.openImportTemplates());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 182)(3, "path", 1013)(4, "path", 1014)(5, "path", 1015);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_92_Template(rf, ctx) {
  if (rf & 1) {
    const _r123 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1016);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_92_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r123);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.quitConfigurationView());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 1017);
    core /* ɵɵelement */.nrm(2, "rect", 1018)(3, "path", 1019);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_93_Template(rf, ctx) {
  if (rf & 1) {
    const _r124 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1020);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_93_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r124);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.quitDsmView());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 1021);
    core /* ɵɵelement */.nrm(2, "rect", 1022);
    core /* ɵɵelementStart */.j41(3, "g");
    core /* ɵɵelement */.nrm(4, "path", 1023);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "text", 1024);
    core /* ɵɵtext */.EFF(6, "Quit Show Circuits View");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.init.isDSMClusteredView.type === "circuits" ? "Quit Show Circuits View" : "Quit Show Clustered View");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵstyleProp */.xc7("display", ctx_r1.init.isDSMClusteredView.type === "circuits" ? "none" : "block");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵstyleProp */.xc7("display", ctx_r1.init.isDSMClusteredView.type === "circuits" ? "block" : "none");
  }
}
function ElementToolBarComponent_ng_template_1_a_94_Template(rf, ctx) {
  if (rf & 1) {
    const _r125 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1025);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_94_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r125);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.quitDcmView());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 1021);
    core /* ɵɵelement */.nrm(2, "rect", 1022);
    core /* ɵɵelementStart */.j41(3, "text", 1024);
    core /* ɵɵtext */.EFF(4, "Quit DCM View");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_ng_template_1_a_110_Template(rf, ctx) {
  if (rf & 1) {
    const _r126 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1026);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_110_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r126);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.disconnectSubModelFromFatherModel());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 266)(4, "path", 267)(5, "path", 268)(6, "rect", 269)(7, "rect", 270)(8, "rect", 271)(9, "rect", 272)(10, "rect", 273)(11, "path", 274)(12, "rect", 1027);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_112_Template(rf, ctx) {
  if (rf & 1) {
    const _r127 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1028);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_112_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r127);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.bringLinksBetweenSelected());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 601)(4, "path", 602)(5, "rect", 603)(6, "path", 604)(7, "path", 605);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_a_114_Template(rf, ctx) {
  if (rf & 1) {
    const _r128 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 1029);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_114_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r128);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.deleteElementsMultiselection());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "rect", 233);
    core /* ɵɵelementStart */.j41(3, "g", 39);
    core /* ɵɵelement */.nrm(4, "path", 234)(5, "path", 235)(6, "path", 236)(7, "path", 237);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_ng_template_1_a_115__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 276)(3, "path", 277)(4, "circle", 278)(5, "circle", 279)(6, "path", 280);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_a_115__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 5);
    core /* ɵɵelement */.nrm(1, "path", 7)(2, "path", 276)(3, "path", 277)(4, "circle", 278)(5, "circle", 279)(6, "path", 281);
    core /* ɵɵelementEnd */.k0s();
  }
}
function ElementToolBarComponent_ng_template_1_a_115_Template(rf, ctx) {
  if (rf & 1) {
    const _r129 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 275);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_115_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r129);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleViewsDiv());
    });
    core /* ɵɵtemplate */.DNE(1, ElementToolBarComponent_ng_template_1_a_115__svg_svg_1_Template, 7, 0, "svg", 34)(2, ElementToolBarComponent_ng_template_1_a_115__svg_svg_2_Template, 7, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isViewsDivOpen);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isViewsDivOpen);
  }
}
function ElementToolBarComponent_ng_template_1_a_116_Template(rf, ctx) {
  if (rf & 1) {
    const _r130 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 265);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_a_116_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r130);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.createSubModel());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 7)(3, "path", 266)(4, "path", 267)(5, "path", 268)(6, "rect", 269)(7, "rect", 270)(8, "rect", 271)(9, "rect", 272)(10, "rect", 273)(11, "path", 274);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_117_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r131 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 286);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_117_a_2_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r131);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.openCreateViewDialog());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_div_117_a_2_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r131);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/create_view.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_div_117_a_2_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r131);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "path", 287)(3, "path", 7)(4, "path", 276)(5, "path", 277)(6, "circle", 278)(7, "circle", 279);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_117_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r132 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 288);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_div_117_a_3_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r132);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.createUnfoldedTreeView());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_div_117_a_3_Template_a_mouseenter_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r132);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/thing_tree_view.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_div_117_a_3_Template_a_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r132);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 5);
    core /* ɵɵelement */.nrm(2, "line", 289)(3, "line", 290)(4, "path", 7)(5, "path", 291)(6, "path", 292)(7, "circle", 293)(8, "circle", 294)(9, "rect", 295)(10, "rect", 296)(11, "rect", 297)(12, "line", 298)(13, "line", 299)(14, "line", 300)(15, "line", 301)(16, "line", 302)(17, "rect", 303)(18, "rect", 304)(19, "line", 305);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ElementToolBarComponent_ng_template_1_div_117_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 282)(1, "span", 283);
    core /* ɵɵtemplate */.DNE(2, ElementToolBarComponent_ng_template_1_div_117_a_2_Template, 8, 0, "a", 284)(3, ElementToolBarComponent_ng_template_1_div_117_a_3_Template, 20, 0, "a", 285);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCreateViewIcon());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCreateViewIcon());
  }
}
function ElementToolBarComponent_ng_template_1_span_118_Template(rf, ctx) {
  if (rf & 1) {
    const _r133 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 1030)(1, "a", 697);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_118_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r133);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeObjects("left"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 5);
    core /* ɵɵelement */.nrm(3, "rect", 420)(4, "path", 698);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(5, "a", 699);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_118_Template_a_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r133);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeObjects("top"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(6, "svg", 1031);
    core /* ɵɵelement */.nrm(7, "rect", 701)(8, "path", 702);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(9, "a", 703);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_118_Template_a_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r133);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeObjects("right"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(10, "svg", 5);
    core /* ɵɵelement */.nrm(11, "rect", 704);
    core /* ɵɵelementStart */.j41(12, "svg", 705);
    core /* ɵɵelement */.nrm(13, "path", 706);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(14, "a", 707);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_span_118_Template_a_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r133);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.arrangeObjects("bottom"));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(15, "svg", 1031);
    core /* ɵɵelement */.nrm(16, "rect", 708)(17, "path", 685);
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function ElementToolBarComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r95 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 727)(2, "span", 728)(3, "a", 4);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.findAction());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_Template_a_mouseenter_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/find_things.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_a_mouseleave_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(4, "svg", 5);
    core /* ɵɵelement */.nrm(5, "path", 6)(6, "path", 7)(7, "path", 8)(8, "path", 9)(9, "path", 10)(10, "line", 11)(11, "line", 12)(12, "line", 13)(13, "line", 14)(14, "path", 15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(15, "span", 729)(16, "a", 17);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.methodologicalChecking());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(17, "svg", 5);
    core /* ɵɵelement */.nrm(18, "circle", 18)(19, "path", 7)(20, "rect", 19)(21, "rect", 20)(22, "rect", 21)(23, "line", 22)(24, "line", 23)(25, "line", 24)(26, "line", 25)(27, "path", 26)(28, "path", 27);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(29, ElementToolBarComponent_ng_template_1_span_29_Template, 33, 12, "span", 730);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(30, "div", 731)(31, "span", 732)(32, "a", 733);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_32_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggelNotes());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_Template_a_mouseenter_32_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_notes.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_a_mouseleave_32_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(33, "span", 732)(34, "a", 734);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_34_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleGrid());
    });
    core /* ɵɵtemplate */.DNE(35, ElementToolBarComponent_ng_template_1__svg_svg_35_Template, 42, 0, "svg", 34)(36, ElementToolBarComponent_ng_template_1__svg_svg_36_Template, 42, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(37, "span", 732)(38, "a", 220);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_38_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.markedThingsAction());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_Template_a_mouseenter_38_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_mark_things.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_a_mouseleave_38_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵtemplate */.DNE(39, ElementToolBarComponent_ng_template_1__svg_svg_39_Template, 5, 0, "svg", 34)(40, ElementToolBarComponent_ng_template_1__svg_svg_40_Template, 5, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(41, "span", 732)(42, "a", 735);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_42_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggelfullScreen());
    });
    core /* ɵɵtemplate */.DNE(43, ElementToolBarComponent_ng_template_1__svg_svg_43_Template, 3, 0, "svg", 34)(44, ElementToolBarComponent_ng_template_1__svg_svg_44_Template, 3, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(45, "span", 736);
    core /* ɵɵlistener */.bIt("mouseenter", function ElementToolBarComponent_ng_template_1_Template_span_mouseenter_45_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/de_magnifying.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_span_mouseleave_45_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(46, "svg", 5)(47, "a", 737);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_47_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomOutSBar());
    });
    core /* ɵɵelement */.nrm(48, "rect", 37);
    core /* ɵɵelementStart */.j41(49, "svg", 38)(50, "g", 39);
    core /* ɵɵelement */.nrm(51, "path", 40)(52, "path", 41);
    core /* ɵɵelementEnd */.k0s()()()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(53, "span", 732)(54, "a", 738);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_54_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomActive());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_Template_a_mouseenter_54_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/magnify.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_a_mouseleave_54_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵelementStart */.j41(55, "label", 739);
    core /* ɵɵtext */.EFF(56);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(57, "svg", 44);
    core /* ɵɵelement */.nrm(58, "rect", 740)(59, "path", 46)(60, "path", 47);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(61, "span", 732);
    core /* ɵɵtemplate */.DNE(62, ElementToolBarComponent_ng_template_1_span_62_Template, 42, 40, "span", 741);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(63, "span", 732)(64, "a", 49);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_64_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.zoomInSBar());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_Template_a_mouseenter_64_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/magnify.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_a_mouseleave_64_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(65, "svg", 5);
    core /* ɵɵelement */.nrm(66, "rect", 37);
    core /* ɵɵelementStart */.j41(67, "svg", 38)(68, "g", 39);
    core /* ɵɵelement */.nrm(69, "path", 40)(70, "path", 50);
    core /* ɵɵelementEnd */.k0s()()()()();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(71, "span", 732)(72, "a", 742);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_72_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleNavigator());
    })("mouseenter", function ElementToolBarComponent_ng_template_1_Template_a_mouseenter_72_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.showGIF($event, "assets/gifs/toggle_navigator.gif"));
    })("mouseleave", function ElementToolBarComponent_ng_template_1_Template_a_mouseleave_72_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.mouseLeave());
    });
    core /* ɵɵtemplate */.DNE(73, ElementToolBarComponent_ng_template_1__svg_svg_73_Template, 7, 0, "svg", 34)(74, ElementToolBarComponent_ng_template_1__svg_svg_74_Template, 7, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(75, ElementToolBarComponent_ng_template_1_span_75_Template, 5, 5, "span", 743);
    core /* ɵɵelementStart */.j41(76, "span", 744);
    core /* ɵɵtemplate */.DNE(77, ElementToolBarComponent_ng_template_1_a_77_Template, 5, 0, "a", 745)(78, ElementToolBarComponent_ng_template_1_a_78_Template, 5, 0, "a", 745)(79, ElementToolBarComponent_ng_template_1_div_79_Template, 14, 24, "div", 59);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(80, "span", 732)(81, "a", 746);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_81_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.init.penDrawingManager.togglePenMode());
    });
    core /* ɵɵtemplate */.DNE(82, ElementToolBarComponent_ng_template_1__svg_svg_82_Template, 8, 0, "svg", 34)(83, ElementToolBarComponent_ng_template_1__svg_svg_83_Template, 8, 0, "svg", 34);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(84, "span", 732);
    core /* ɵɵtemplate */.DNE(85, ElementToolBarComponent_ng_template_1_a_85_Template, 14, 0, "a", 60)(86, ElementToolBarComponent_ng_template_1_a_86_Template, 14, 0, "a", 60)(87, ElementToolBarComponent_ng_template_1_div_87_Template, 29, 0, "div", 59)(88, ElementToolBarComponent_ng_template_1_a_88_Template, 7, 0, "a", 62)(89, ElementToolBarComponent_ng_template_1_a_89_Template, 7, 0, "a", 62)(90, ElementToolBarComponent_ng_template_1_div_90_Template, 24, 2, "div", 747)(91, ElementToolBarComponent_ng_template_1_a_91_Template, 6, 0, "a", 748)(92, ElementToolBarComponent_ng_template_1_a_92_Template, 4, 0, "a", 749)(93, ElementToolBarComponent_ng_template_1_a_93_Template, 7, 5, "a", 750)(94, ElementToolBarComponent_ng_template_1_a_94_Template, 5, 0, "a", 751);
    core /* ɵɵelementStart */.j41(95, "a", 752);
    core /* ɵɵlistener */.bIt("click", function ElementToolBarComponent_ng_template_1_Template_a_click_95_listener() {
      core /* ɵɵrestoreView */.eBV(_r95);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openInstancesDialog());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(96, "svg", 5);
    core /* ɵɵelement */.nrm(97, "path", 7)(98, "path", 753)(99, "line", 754)(100, "line", 755)(101, "line", 756)(102, "line", 757)(103, "circle", 758)(104, "path", 759)(105, "line", 760)(106, "line", 761)(107, "circle", 762)(108, "path", 763)(109, "circle", 764);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(110, ElementToolBarComponent_ng_template_1_a_110_Template, 13, 0, "a", 765);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(111, "span", 766);
    core /* ɵɵtemplate */.DNE(112, ElementToolBarComponent_ng_template_1_a_112_Template, 8, 0, "a", 767);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(113, "span", 732);
    core /* ɵɵtemplate */.DNE(114, ElementToolBarComponent_ng_template_1_a_114_Template, 8, 0, "a", 768);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(115, ElementToolBarComponent_ng_template_1_a_115_Template, 3, 2, "a", 58)(116, ElementToolBarComponent_ng_template_1_a_116_Template, 12, 0, "a", 57)(117, ElementToolBarComponent_ng_template_1_div_117_Template, 4, 2, "div", 59)(118, ElementToolBarComponent_ng_template_1_span_118_Template, 18, 0, "span", 769);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(29);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.ExecuteMode && !ctx_r1.selected);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("className", ctx_r1.init.notes ? "notesActive  button" : "notesDeactive button");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.showGrid);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.showGrid);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("matTooltip", !ctx_r1.init.shouldGreyOut ? "Show Marked Things" : "Show Original Style of Marked Things");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.shouldGreyOut);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.shouldGreyOut);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isAtFullScreen() === false);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isAtFullScreen() === true);
    core /* ɵɵadvance */.R7$(12);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.zoomStatus + "%", " ");
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.zoomActiveStatus);
    core /* ɵɵadvance */.R7$(11);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.Navigator);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.Navigator);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.oplService.orgSettings.chatEnabled && ctx_r1.init.showChatIcon && !ctx_r1.isExample() && !ctx_r1.isTemplate());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showConnectionsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showConnectionsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showConnectionsDiv);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.penDrawingManager.isPenMode);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.init.penDrawingManager.isPenMode);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showOpmRequirementsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showOpmRequirementsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showOpmRequirementsDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.showThingBackgroundDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showThingBackgroundDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showThingBackgroundDiv);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowImportTemplate());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.opmModel.getCurrentConfiguration());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.isDSMClusteredView.value);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.init.isDCMView);
    core /* ɵɵadvance */.R7$(16);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowDisconnectFromFatherModel());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowBringLinkBetweenSelected());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isDeletableMultiselection());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowCreateViewIcon());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1._shouldShowConnectSubModel);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isViewsDivOpen);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selectionArray.length > 1);
  }
}
let element_tool_bar_component_valuesArray = new Array(); // stores values of computational objects after each execution. used for recovering
let firstValuesArray = new Array(); // stores values of computational objects for reset after every run
let ElementToolBarComponent = /*#__PURE__*/(() => {
  class ElementToolBarComponent {
    constructor(init, _dialog, dialog) {
      this.init = init;
      this._dialog = _dialog;
      this.dialog = dialog;
      this.visible = false;
      this.zoomStatus = "100";
      this.zoomActiveStatus = false;
      this.runByConfigurations = false;
      this.downloadCSV = false;
      this.numberOfRuns = 1;
      this.simulationSliderValue = 1;
      this.downloadCSVEvery = 1;
      this.uploaded = false;
      this.simulate = false;
      this.log = "";
      this.now = new Date();
      this.isActive = true;
      this.menuOpen = false;
      this._isExample = false;
      this._isStereotype = false;
      this._isTemplate = false;
      this.templatesSupported = false;
      this._shouldShowSemifolding = false;
      this._shouldShowConnectSubModel = false;
      this.selectionBox = {
        selectBoxWidth: "",
        selectBoxHeight: "",
        selectBoxRight: "",
        selectionBottom: "",
        selectBoxLeft: "",
        selectBoxTop: ""
      };
      this.showStylingDiv = false;
      this.showStatesArrangementDiv = false;
      this.showExtensionsDiv = false;
      this.showTemplatesDiv = false;
      this.isViewsDivOpen = false;
      this.showOpmRequirementsDiv = false;
      this.showConnectionsDiv = false;
      this.showThingBackgroundDiv = false;
      this.showImagesIsThingsSelection = false;
      this.elementDefault = {
        fontStyle: null,
        fontColor: null,
        fill: null,
        stroke: null,
        textSize: null
      };
      const that = this;
      this.supportedFonts = getSupportedFonts();
      this.init.elementToolbarReference = this;
      this.isHeadlessRunner = false;
      this.isExecutionResetValue = false;
      this.init.includeSubModelsInExecution = true;
      this.templatesSupported = this.init.service?.areTemplatesSupported();
      this.areSubModelsSupported = this.init.service?.areSubModelsSupported();
      this.init.getSelectedElement$().subscribe(selected => {
        if (!that.init.isReadOnlyOpd()) {
          if (selected instanceof TriangleClass) {
            selected = undefined;
          }
          if (this.selected && this.selected !== selected) {
            this.closeStylingDiv();
          }
          this.selected = selected;
          if (that.init.copiedStyleParams && that.init.copiedStyleParams.isRightClick && this.selected !== undefined && !this.init.selectedElement.constructor.name.includes("Note") && !this.init.selectedElement.constructor.name.includes("BlankLink")) {
            that.pasteStyleParams();
          } else if (that.init.copiedStyleParams && this.selected !== undefined && !this.init.selectedElement.constructor.name.includes("Note") && !this.init.selectedElement.constructor.name.includes("BlankLink")) {
            that.pasteStyleParams();
            that.init.copiedStyleParams = null;
          }
        } else {
          that.init.selection.collection.reset([]);
          that.init.selection.cancelSelection();
          this.selected = undefined;
        }
        this.onSelection();
      });
      this.init.paper.on("blank:pointerdown", () => {
        if (this.textChangeMenu) {
          this.toggleTextSizeMenu();
        }
        if (this.fillColor) {
          this.toggleFillMenu();
        }
        if (this.textFont) {
          this.toggleFontMnue();
        }
        if (this.strokeColor) {
          this.toggleStrokeMenu();
        }
        if (this.textColor) {
          this.toggleTextColorMenu();
        }
        if (this.zoomActiveStatus) {
          this.zoomActiveStatus = false;
        }
      });
      this.init.paper.on("blank:pointerup", () => {
        this._shouldShowConnectSubModel = this.areSubModelsSupported && this.shouldShowConnectSubModel();
      });
      this.init.paper.on("element:pointerdown", () => {
        if (this.zoomActiveStatus) {
          this.zoomActiveStatus = false;
        }
      });
      this.init.paper.on("blank:pointerup", () => {
        if (this.init.selection.collection.models.length > 1) {
          this.pointerUpHandle();
        }
      });
      this.initialZoomStatus = this.init.paperScroller.zoom();
    }
    get ExecuteMode() {
      return this.init.ExecuteMode;
    }
    get isManualTextPos() {
      const visual = this.selected.getVisual();
      return visual.isManualTextPos;
    }
    get refX() {
      const visual = this.selected.getVisual(); // Explicitly cast here
      return visual?.refX || 0; // Provide a default value
    }
    get refY() {
      const visual = this.selected.getVisual(); // Explicitly cast here
      return visual?.refY || 0; // Provide a default value
    }
    set ExecutingPause(val) {
      this.init.ExecutingPause = val;
      this.init.getGraphService().setPaperInteractivity(this.init, this.init.opmModel.currentOpd);
    }
    get ExecutingPause() {
      return this.init.ExecutingPause;
    }
    set Executing(val) {
      this.init.Executing = val;
      this.init.getGraphService().setPaperInteractivity(this.init, this.init.opmModel.currentOpd);
    }
    get Executing() {
      return this.init.Executing;
    }
    get selectionArray() {
      return this.init.selection.collection.models;
    }
    get stateMenu() {
      if (document.getElementById("svgRectFinal")) {
        return true;
      }
      return false;
    }
    isTimeDurational() {
      if (!this.init.selectedElement || !this.init.selectedElement.getVisual) {
        return false;
      }
      const visual = this.init.selectedElement.getVisual();
      if (OPCloudUtils.isInstanceOfVisualProcess(visual) && visual.logicalElement.getIsWaitingProcess()) {
        return false;
      }
      return (this.isProcess || this.isState) && this.init.selectedElement.getVisual() && this.init.selectedElement.getVisual().isTimeDuration();
    }
    openStylingDiv() {
      this.closeAllSubToolBars();
      this.showStylingDiv = true;
    }
    closeStylingDiv() {
      this.closeAllSubToolBars();
      this.showStylingDiv = false;
    }
    onSelection() {
      if (this.selected) {
        if (this.selected.getToolbarHandles) {
          const handles = this.selected.getToolbarHandles(this.init);
          this.removeHandle = handles.find(h => h.name == "remove");
          if (this.init.Executing && !this.init.ExecutingPause) {
            this.removeHandle = undefined;
          }
          this.unfoldHandle = handles.find(h => h.name == "unfold");
          this.inzoomHandle = handles.find(h => h.name == "inzoom");
          this.setComputationHandle = handles.find(h => h.name == "set-computation");
          this.removeComputationHandle = handles.find(h => h.name === "remove-computation");
          this.addStateHandle = handles.find(h => h.name == "add-state");
          this.destateHandle = handles.find(h => h.name == "destate");
          this.suppressHandle = handles.find(h => h.name == "Suppress All");
          this.suppressSingleStateHandle = handles.find(h => h.name == "suppress");
          this.toogleEssenceHandle = handles.find(h => h.name == "toggle-essence");
          this.toogleAffiliationHandle = handles.find(h => h.name == "toggle-affiliation");
          this.editAliasHandle = handles.find(h => h.name == "edit-alias");
          this.editUnitsHandle = handles.find(h => h.name == "edit-units");
          this.bringConnectedHandle = handles.find(h => h.name == "bring-connected");
          this.setTimeDurationHandle = handles.find(h => h.name == "set-time-duration");
          this.textAutoFormatHandle = handles.find(h => h.name == "toggle-text-format");
          this.updateComputationalHandle = handles.find(h => h.name === "update-computation");
          this.userInputHandle = handles.find(h => h.name === "user-input");
        }
        const logical = this.init.opmModel.getLogicalElementByVisualId(this.selected.id);
        this.defaultfontStyle = this.selected.attr("text/textWrap/text");
        this.visible = false;
        this.isObject = false;
        this.isProcess = false;
        this.isState = false;
        this.isLink = false;
        this.isComputational = this.selected.isComputational && this.selected.isComputational();
        const type = this.selected.attributes.type;
        this.isAutoFormat = type === "opm.Process" || type === "opm.Object" || type === "opm.State" ? logical?.getNameModule().isAutoFormat() : false;
        if (this.selected.attributes.type === "opm.Object") {
          this.isObject = true;
          // Alon - hides temporal state buttons
          // this.hideTemporalStateBTN();
        } else if (this.selected.attributes.type === "opm.Process") {
          this.isProcess = true;
          // Alon - hides temporal state buttons
          // this.hideTemporalStateBTN();
        } else if (this.selected.attributes.type === "opm.State") {
          this.isState = true;
        } else if (this.selected.attributes.type === "opm.Link") {
          this.isLink = true;
          // this.hideTemporalStateBTN();
        }
        // Hide tool bar when it's OPMQuery OPD
        if (this.init.opmModel.currentOpd.id === this.init.opmModel.getOPMQueryID()) {
          this.visible = false;
        } else {
          this.visible = true;
        }
      } else {
        this.visible = false;
        this.isObject = false;
        this.isProcess = false;
        this.isState = false;
        this.isLink = false;
      }
      this._shouldShowSemifolding = this.shouldShowSemifolding();
      this._shouldShowConnectSubModel = this.areSubModelsSupported && this.shouldShowConnectSubModel();
    }
    returnVisible() {
      return this.visible;
    }
    timeDurationButtonAction() {
      const element = this.init.selectedElement;
      if (!element) {
        return;
      }
      const visual = this.init.getOpmModel().getVisualElementById(element.id);
      const cellView = this.init.paper.findViewByModel(this.init.selectedElement);
      element.openTimeDuration(cellView.el, visual.logicalElement.getDurationManager(), {
        digits: this.init.oplService.settings.timeDurationUnitsDigits
      });
    }
    timeDurationRemoveButtonAction() {
      const element = this.init.selectedElement;
      if (!element) {
        return;
      }
      const visual = this.init.getOpmModel().getVisualElementById(element.id);
      if (OPCloudUtils.isInstanceOfVisualProcess(visual) && visual.logicalElement.getIsWaitingProcess()) {
        return;
      }
      const ret = visual.logicalElement.getDurationManager().removeTimeDuration();
      if (ret.success && (visual.constructor.name.includes("State") || !visual.getRefineeInzoom() || visual.getRefineeInzoom() !== visual)) {
        visual.width = element.get("minSize").width;
        visual.height = element.get("minSize").height;
      }
      this.init.selectedElement.updateEntityFromOpmModel(visual);
      if (this.init.selectedElement.constructor.name.includes("State")) {
        this.init.selectedElement.getParent().shiftEmbeddedToEdge(this.init);
      }
    }
    arrangeSatesRight() {
      this.init.opmModel.logForUndo("Arrange States");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Arrange States");
      if (this.selectionArray.length > 1) {
        this.arrangeObjects("right");
      }
      if (this.selected.getStatesOnly().length > 0) {
        this.selected.arrangeEmbedded(this.init, "right");
        this.selected.shiftEmbeddedToEdge(this.init);
      }
      this.selected.updateSizePositionToFitEmbeded();
      this.selected.shiftEmbeddedToEdge(this.init);
      this.init.opmModel.setShouldLogForUndoRedo(true, "Arrange States");
    }
    arrangeSatesLeft() {
      this.init.opmModel.logForUndo("Arrange States");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Arrange States");
      if (this.selectionArray.length > 1) {
        this.arrangeObjects("left");
      }
      if (this.selected.getStatesOnly().length > 0) {
        this.selected.arrangeEmbedded(this.init, "left");
        this.selected.shiftEmbeddedToEdge(this.init);
      }
      this.selected.updateSizePositionToFitEmbeded();
      this.selected.shiftEmbeddedToEdge(this.init);
      this.init.opmModel.setShouldLogForUndoRedo(true, "Arrange States");
    }
    arrangeSatesBottom() {
      this.init.opmModel.logForUndo("Arrange States");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Arrange States");
      if (this.selectionArray.length > 1) {
        this.arrangeObjects("bottom");
      }
      if (this.selected.getStatesOnly().length > 0) {
        this.selected.arrangeEmbedded(this.init, "bottom");
        this.selected.shiftEmbeddedToEdge(this.init);
      }
      this.selected.updateSizePositionToFitEmbeded();
      this.selected.shiftEmbeddedToEdge(this.init);
      this.init.opmModel.setShouldLogForUndoRedo(true, "Arrange States");
    }
    arrangeSatesTop() {
      this.init.opmModel.logForUndo("Arrange States");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Arrange States");
      if (this.selectionArray.length > 1) {
        this.arrangeObjects("top");
      }
      if (this.selected.getStatesOnly().length > 0) {
        this.selected.arrangeEmbedded(this.init, "top");
        this.selected.shiftEmbeddedToEdge(this.init);
      }
      this.selected.updateSizePositionToFitEmbeded();
      this.selected.shiftEmbeddedToEdge(this.init);
      this.init.opmModel.setShouldLogForUndoRedo(true, "Arrange States");
    }
    isDeletableMultiselection() {
      const case1 = this.selected && this.selected.attributes.type === "opm.Ellipsis";
      const deleteableElements = this.init.selection.collection.models.filter(m => OPCloudUtils.isInstanceOfDrawnEntity(m) || OPCloudUtils.isInstanceOfDrawnNote(m));
      const case3 = deleteableElements.length >= 1;
      return case1 || case3;
    }
    CreateNewDigitaltwin(originalObj) {
      const digitalTwin = new OpmObject();
      this.setDigitalTwinText(digitalTwin, originalObj);
      this.setDigitalTwinPosition(digitalTwin, originalObj);
      this.setDigitalTwinEssence(digitalTwin);
      return digitalTwin;
    }
    setDigitalTwinText(digitalTwin, originalObj) {
      digitalTwin.attr({
        text: {
          textWrap: {
            text: originalObj.attr("text/textWrap/text") + "_DigitalTwin"
          }
        }
      });
    }
    setDigitalTwinPosition(digitalTwin, originalObj) {
      // TODO if need => overlapping check
      digitalTwin.set({
        position: {
          x: originalObj.get("position").x,
          y: originalObj.get("position").y + 250
        }
      });
    }
    setDigitalTwinEssence(digitalTwin) {
      digitalTwin.setEssence(Essence.Informatical);
    }
    connectOriginalObjectToDigitalTwin(originalObj, digitalTwin) {
      const exhibitionLink = new ExhibitionLink(originalObj, digitalTwin, this.init.getGraphService().graph);
      return exhibitionLink;
    }
    generatedigitalTwin() {
      const originalObj = this.selected; // digitalTwin
      const model = this.init.getOpmModel();
      model.logForUndo("Digital twin creation");
      const graph = originalObj.graph;
      // ------------ New Code ----------------------------------------
      // ----------- New Drawn ---------------------------------------
      let digitalTwin;
      let exhibitionLink;
      if (originalObj.checkIfDigitalTwinExists(model)) {
        digitalTwin = this.init.getGraphService().graph.getCell(originalObj.attributes.attrs.digitalTwin);
        if (digitalTwin === undefined) {
          digitalTwin = graph.getCell(originalObj.findDigitalTwin(model, originalObj));
        }
        if (originalObj.checkIfDigitaltwinIsConnected(graph)) {
          if (originalObj.checkIfCHangesExist(originalObj, digitalTwin, model)) {
            return;
          } else {
            originalObj.updateCHanges(originalObj, digitalTwin, this.init);
            return;
          }
        } else {
          exhibitionLink = this.connectOriginalObjectToDigitalTwin(originalObj, digitalTwin);
          originalObj.attributes.attrs.digitalTwinConnected = true;
          this.init.getOpmModel().getVisualElementById(originalObj.id).digitalTwinConnected = true;
          this.init.getOpmModel().getVisualElementById(originalObj.id).updateParams(this.init.getOpmModel().getVisualElementById(originalObj.id).getParams());
          this.init.getGraphService().graph.addCell(exhibitionLink);
          return;
        }
      }
      digitalTwin = this.CreateNewDigitaltwin(originalObj);
      exhibitionLink = this.connectOriginalObjectToDigitalTwin(originalObj, digitalTwin);
      this.init.getGraphService().graph.addCell(digitalTwin);
      this.init.getGraphService().graph.addCell(exhibitionLink);
      originalObj.attributes.attrs.digitalTwin = digitalTwin.id;
      originalObj.attributes.attrs.preoriginalObj = digitalTwin.id;
      digitalTwin.attributes.attrs.originalObj = originalObj.id;
      digitalTwin.attributes.attrs.predigitalTwin = digitalTwin.id;
      originalObj.attributes.attrs.digitalTwinConnected = true;
      // ----------- New Drawn ---------------------------------------
      // ----------  New Visual --------------------------------------
      const originalObjVisual = this.init.getOpmModel().getVisualElementById(originalObj.id);
      const digitalTwinVisual = this.init.getOpmModel().getVisualElementById(digitalTwin.id);
      originalObjVisual.digitalTwin = digitalTwin.id;
      originalObjVisual.preoriginalObj = originalObj.id;
      digitalTwinVisual.originalObj = originalObj.id;
      digitalTwinVisual.predigitalTwin = digitalTwin.id;
      originalObjVisual.digitalTwinConnected = true;
      originalObjVisual.updateParams(originalObjVisual.getParams());
      digitalTwinVisual.updateParams(digitalTwinVisual.getParams());
      // ----------  New Visual --------------------------------------
      // ------------ New Code ----------------------------------------
      this.init.oplService.oplSwitch.next("render");
    }
    simulateElement() {
      const sim = this.selected.getVisual().logicalElement.getSimulationParams();
      this.init.dialogService.openDialog(SimulationElementComponent, 700, 600, {
        sim: sim,
        logical: this.selected.getVisual().logicalElement
      });
    }
    inZoomElementInDiagram() {
      this.selected.inzoomInDiagramAction(this.init);
    }
    unfoldelement() {
      this.selected.unfoldAction(this.init);
    }
    outZoomNewDiagram(type) {
      const visuals = this.init.selection.collection.models.map(dr => this.init.opmModel.getVisualElementById(dr.id));
      const hasInzoomedSelected = visuals.filter(vis => vis.children.length === 0 || vis.children.length > 0 && !vis.children.find(child => !(child instanceof OpmVisualState)));
      if (hasInzoomedSelected.length < visuals.length) {
        (0, validationAlert)("Cannot outzoom a refineable thing");
        return;
      }
      const fathers = visuals.map(v => v.logicalElement.getFather());
      const uniqueFathers = (0, removeDuplicationsInArray)(visuals.filter(v => !OPCloudUtils.isInstanceOfVisualState(v)).map(v => v.logicalElement.getFather()).filter(f => !!f));
      if (uniqueFathers.length > 1 || fathers.includes(undefined) && visuals.find(v => !OPCloudUtils.isInstanceOfVisualState(v) && v.logicalElement.getFather())) {
        (0, validationAlert)("All of the selected entities shall be inner entities from the same parent.", 5000, "Error");
        return;
      }
      if (type === "Process") {
        const sources = [];
        for (const vis of visuals) {
          const links = vis.getAllLinks().inGoing.filter(l => fundamental.contains(l.type));
          if (links.length === 0) {
            sources.push([undefined]);
          } else {
            sources.push((0, removeDuplicationsInArray)(links.map(l => l.source.logicalElement)));
          }
        }
        for (let i = 0; i < sources.length; i++) {
          for (let j = 0; j < sources.length; j++) {
            if (i !== j && sources[i].some(src => !sources[j].includes(src))) {
              (0, validationAlert)("For “Out zoom new diagram as a process” all the chosen things should not be connected to “outside” entities by structural links.", 5000, "Error");
              return;
            }
          }
        }
      }
      visuals.sort((a, b) => {
        if (Math.abs(a.yPos - b.yPos) <= 15) {
          return a.xPos - b.xPos;
        }
        return a.yPos - b.yPos;
      });
      const styleParams = this.init.selection.collection.models.find(m => OPCloudUtils.isInstanceOfDrawnThing(m)).getDefaultStyleParams(this.init);
      const enType = type === "Object" ? EntityType.Object : EntityType.Process;
      const ret = this.init.opmModel.outzoomNewDiagram(enType, visuals, undefined, styleParams);
      if (ret.success && ret.uiToUpdate) {
        this.updateGraphAfterOuting(ret.uiToUpdate);
      }
      this.init.selection.collection.reset([]);
      if (ret.success === false) {
        (0, validationAlert)(ret.message);
      }
      this.init.opdHierarchyRef.sortOpdsToFixNewOrderLoading(this.init);
      if (visuals[0].fatherObject && this.init.graph.getCell(visuals[0].fatherObject) && this.init.graph.getCell(ret.newThing.id)) {
        this.init.graph.getCell(visuals[0].fatherObject).embed(this.init.graph.getCell(ret.newThing.id));
      }
    }
    outFoldNewDiagram() {
      const visuals = this.init.selection.collection.models.map(dr => this.init.opmModel.getVisualElementById(dr.id));
      const hasInzoomedSelected = visuals.filter(vis => vis.children.length === 0 || vis.children.length > 0 && !vis.children.find(child => !(child instanceof OpmVisualState)));
      if (hasInzoomedSelected.length < visuals.length || visuals.find(vis => vis.constructor.name !== visuals[0].constructor.name)) {
        (0, validationAlert)("Cannot out-fold. Make sure refineable things are not selected and that all things are from the same type.");
        return;
      }
      const styleParams = this.init.selection.collection.models.find(m => OPCloudUtils.isInstanceOfDrawnThing(m)).getDefaultStyleParams(this.init);
      const ret = this.init.opmModel.outfoldNewDiagram(visuals, undefined, styleParams);
      if (ret.success && ret.uiToUpdate) {
        this.updateGraphAfterOuting(ret.uiToUpdate);
      }
      this.init.opdHierarchyRef.sortOpdsToFixNewOrderLoading(this.init);
      this.init.selection.collection.reset([]);
      if (ret.success === false) {
        (0, validationAlert)(ret.message);
      }
      if (visuals[0].fatherObject && this.init.graph.getCell(visuals[0].fatherObject) && this.init.graph.getCell(ret.newThing.id)) {
        this.init.graph.getCell(visuals[0].fatherObject).embed(this.init.graph.getCell(ret.newThing.id));
      }
    }
    updateGraphAfterOuting(uiToUpdate) {
      const init = this.init;
      if (init && init.graphService) {
        init.graph.startBatch("outing");
        for (const rem of uiToUpdate.removed) {
          init.graph.startBatch("ignoreChange");
          if (init.graph.getCell(rem.id)) {
            init.graph.getCell(rem.id).remove();
          } else {
            null;
          }
          init.graph.stopBatch("ignoreChange");
        }
        const drawnElement = createDrawnEntity(uiToUpdate.newThingLogical.name);
        drawnElement.updateParamsFromOpmModel(uiToUpdate.visual);
        init.graph.addCell(drawnElement);
        uiToUpdate.newlinks = (0, removeDuplicationsInArray)(uiToUpdate.newlinks);
        init.graphService.updateLinksView(uiToUpdate.newlinks.filter(l => init.opmModel.getVisualElementById(l.id)));
        init.selection.collection.reset([]);
        init.selection.collection.add(drawnElement);
        init.getTreeView().init(init.opmModel);
        init.graph.stopBatch("outing");
      }
    }
    changeEssence() {
      const visualElement = this.init.opmModel.getVisualElementById(this.selected.id);
      const connectedLinks = visualElement.getLinks().outGoing;
      if (connectedLinks.find(link => link.type === linkType.Agent)) {
        (0, validationAlert)("The object is an agent and its essence cannot be changed to informatical.", 5000);
        return;
      }
      this.selected.toggleEssence(visualElement);
    }
    changeAffiliation() {
      const visualElement = this.init.opmModel.getVisualElementById(this.selected.id);
      this.selected.toggleAffiliation(visualElement);
    }
    zoomInSBar() {
      if (this.zoomActiveStatus) {
        this.zoomActive();
      }
      const jumpVal = 10;
      if (parseInt(this.zoomStatus) <= 340) {
        this.zoomStatus = (parseInt(this.zoomStatus) + jumpVal).toString();
        this.init.paperScroller.zoom(0.1, {
          max: 4
        });
      }
    }
    zoomOutSBar() {
      if (this.zoomActiveStatus) {
        this.zoomActive();
      }
      const jumpVal = 10;
      this.zoomStatus = (parseInt(this.zoomStatus) - jumpVal).toString();
      this.init.paperScroller.zoom(-0.1, {
        min: 0.1
      });
    }
    zoomActive() {
      this.zoomActiveStatus = !this.zoomActiveStatus;
    }
    zoomSelect(str) {
      const val = str;
      let val1;
      let val2;
      let val3;
      let val3Decimal;
      let sign;
      if (val && this.zoomStatus) {
        val1 = val.toString().slice(0, val.toString().length - 1);
        val2 = this.zoomStatus.toString().slice(0, this.zoomStatus.toString().length - 1);
        if (parseInt(val1) >= parseInt(val2)) {
          sign = true;
        } else {
          sign = false;
        }
        val3 = sign ? parseInt(val1) - parseInt(val2) : parseInt(val2) - parseInt(val1);
        val3Decimal = val3 / 10;
      }
      switch (val) {
        case "10":
          this.zoomStatus = "10";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "20":
          this.zoomStatus = "20";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "30":
          this.zoomStatus = "30";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "40":
          this.zoomStatus = "40";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "50":
          this.zoomStatus = "50";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "60":
          this.zoomStatus = "60";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "70":
          this.zoomStatus = "70";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "80":
          this.zoomStatus = "80";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "90":
          this.zoomStatus = "90";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "100":
          this.zoomStatus = "100";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "110":
          this.zoomStatus = "110";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "120":
          this.zoomStatus = "120";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "130":
          this.zoomStatus = "130";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "140":
          this.zoomStatus = "140";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "150":
          this.zoomStatus = "150";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "160":
          this.zoomStatus = "160";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "170":
          this.zoomStatus = "170";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "180":
          this.zoomStatus = "180";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "190":
          this.zoomStatus = "190";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
        case "200":
          this.zoomStatus = "200";
          this.init.paperScroller.zoom(sign ? val3Decimal : -Math.abs(val3Decimal), {
            min: 0.1
          });
          break;
      }
    }
    deleteElementsMultiselection() {
      new DeleteAction(this.init).act();
    }
    toggelfullScreen() {
      const element = document.documentElement;
      if (document.fullscreen === false) {
        element.webkitRequestFullScreen();
      } else {
        document.exitFullscreen();
      }
    }
    isAtFullScreen() {
      return document.fullscreen;
    }
    ROSactivate() {
      this.init.activateROS = !this.init.activateROS;
      if (this.init.activateROS) {
        const ros_port = this.calcPort("ros");
        const ros_server = this.calcServer("ros");
        this.init.wshandlerROS = new WebSocket("wss://" + ros_server + (ros_port !== "" ? ":" : "") + ros_port + "/");
        // console.log('Websocket activated');
        this.init.wshandlerROS.onerror = function () {
          const errMsg = "Cannot connect to Websocket";
          (0, validationAlert)(errMsg, 5000);
          this.init.activateROS = false;
        }.bind(this, this.init);
        this.init.wshandlerROS.onopen = function (e) {
          // console.log("[open] Websocket connection established");
          // console.log(this.readyState);
          (0, validationAlert)("Websocket connection established", 5000, undefined, true);
        };
        this.init.wshandlerROS.onclose = function (e) {
          const errMsg = "Websocket disconnected";
          (0, validationAlert)(errMsg, 5000);
          this.init.activateROS = false;
        }.bind(this, this.init);
      } else {
        this.init.wshandlerROS.close();
        this.init.wshandlerROS = null;
      }
    }
    Pythonactivate() {
      this.init.activatePython = !this.init.activatePython;
      if (this.init.activatePython) {
        const python_port = this.calcPort("python");
        const python_server = this.calcServer("python");
        this.init.handlerPython = new WebSocket("wss://" + python_server + (python_port !== "" ? ":" : "") + python_port + "/");
        this.init.handlerPython.onerror = function () {
          const errMsg = "Cannot connect to Python Websocket";
          (0, validationAlert)(errMsg, 5000);
          this.init.activatePython = false;
        }.bind(this, this.init);
        this.init.handlerPython.onopen = function (e) {
          (0, validationAlert)("Python Websocket connection established", 5000, undefined, true);
        };
        this.init.handlerPython.onclose = function (e) {
          const errMsg = "Python Websocket disconnected";
          (0, validationAlert)(errMsg, 5000);
          this.init.activatePython = false;
        }.bind(this, this.init);
      } else {
        this.init.handlerPython.close(1000);
        this.init.handlerPython = null;
      }
    }
    MySQLactivate() {
      // all the parameters:
      const mysql_port = this.calcMySQLPort("mysql");
      const mysql_hostname = this.calcMySQLHostname("mysql");
      const mysql_password = this.calcMySQLPassword("mysql");
      const mysql_username = this.calcMySQLUsername("mysql");
      const schema = this.calcSchema("mysql");
      const ws_port = this.calcWSPort("mysql");
      const ws_server = this.calcWSHostname("mysql");
      // ______________________________________________________________________________
      const config = {
        schema: schema,
        password: mysql_password,
        user: mysql_username,
        host: mysql_hostname,
        port: mysql_port
      };
      // ______________________________________________________________________________
      this.init.activateMySQL = !this.init.activateMySQL;
      if (this.init.activateMySQL) {
        this.init.handlerMYSQL = new WebSocket("wss://" + ws_server + ":" + ws_port);
        this.init.handlerMYSQL.onerror = function () {
          const errMsg = "Cannot connect to MYSQL Websocket";
          (0, validationAlert)(errMsg, 5000);
          this.init.activateMQTT = false;
        }.bind(this, this.init);
        // ______________________________________________________________________________
        this.init.handlerMYSQL.onopen = function (e) {
          (0, validationAlert)("MYSQL Websocket connection established", 5000, undefined, true);
        };
        this.init.handlerMYSQL.addEventListener("open", () => {
          this.init.handlerMYSQL.send(JSON.stringify(config));
        });
        // This line gets from the server the command result. Like "Table 'guests' already exists" etc.
        // this.init.handlerMYSQL.addEventListener('message', event => {  console.log('activiate_Received:', event.data); });
        this.init.handlerMYSQL.onclose = function (e) {
          const errMsg = "MYSQL Websocket disconnected";
          (0, validationAlert)(errMsg, 5000);
          this.init.activateMYSQL = false;
        }.bind(this, this.init);
      } else {
        this.init.handlerMYSQL.close(1000);
        this.init.handlerMYSQL = null;
      }
    }
    MQTTactivate() {
      this.init.activateMQTT = !this.init.activateMQTT;
      if (this.init.activateMQTT) {
        const mqtt_port = this.calcPort("mqtt");
        const mqtt_server = this.calcServer("mqtt");
        this.init.handlerMQTT = new WebSocket("wss://" + mqtt_server + (mqtt_port !== "" ? ":" : "") + mqtt_port + "/");
        this.init.handlerMQTT.onerror = function () {
          const errMsg = "Cannot connect to MQTT Websocket";
          (0, validationAlert)(errMsg, 5000);
          this.init.activateMQTT = false;
        }.bind(this, this.init);
        this.init.handlerMQTT.onopen = function (e) {
          // console.log("[open] Websocket connection established");
          // console.log(this.readyState);
          (0, validationAlert)("MQTT Websocket connection established", 5000, undefined, true);
        };
        this.init.handlerMQTT.onclose = function (e) {
          const errMsg = "MQTT Websocket disconnected";
          (0, validationAlert)(errMsg, 5000);
          this.init.activateMQTT = false;
        }.bind(this, this.init);
      } else {
        this.init.handlerMQTT.close();
        this.init.handlerMQTT = null;
      }
    }
    toggelNotes() {
      const notes_flag = !this.init.notes;
      this.init.oplService.updateUserSettings({
        Notes: notes_flag
      });
      this.init.updateDB({
        Notes: notes_flag
      });
      const notes = this.init.getOpmModel().currentOpd.notes;
      if (notes.length) {
        this.init.getGraphService().renderGraph(this.init.getOpmModel().currentOpd, this.init);
      }
    }
    toggleNavigator() {
      this.init.toggleNavigator();
      this.init.setLeftBarWindowsSizes({});
    }
    copy() {
      copy(this.init);
    }
    paste() {
      paste(this.init);
    }
    adConnected() {
      this.selected.bringAction(this.init);
    }
    /*
      excuteBtn() {
      // array that contains all the link ids needed to be visualized by a token
      const linksArray = [];
      execute(linksArray, this.init, 'SD'); // start execute from SD graph
      showExecution(linksArray, 0, this.init);
    }
    */
    // Alon - Changes initial temporal state
    setInitialState() {
      this.init.opmModel.logForUndo(this.getcurrentStateElement().logicalState.text + " changed initial");
      const state = this.getcurrentStateElement().drawnState;
      // state.attr('image/xlink:href', 'assets/SVG/defaultState.svg');
      const IcheckedInput = this.getcurrentStateElement().drawnState.attr(".outer/stroke-width") === 2 ? 3 : 2;
      const object = state.getParent();
      const allStates = object.getStatesOnly();
      // If there is no other initial state.
      if (IcheckedInput === 3 && !allStates.find(s => s !== state && s.getVisual().logicalElement.stateType.includes("initial"))) {
        this.getcurrentStateElement().drawnState.attr(".outer/stroke-width", 3);
      } else if (IcheckedInput === 2) {
        this.getcurrentStateElement().drawnState.attr(".outer/stroke-width", 2);
      } else {
        (0, validationAlert)("Only one state can be the initial state.", 3000, "error");
        return;
      }
      this.getcurrentStateElement().logicalState.stateType = this.getcurrentStateElement().drawnState.checkType();
    }
    // Alon - Changes default temporal state
    setDefaultState() {
      this.init.opmModel.logForUndo(this.getcurrentStateElement().logicalState.text + " changed default");
      const state = this.getcurrentStateElement().drawnState;
      const object = state.getParent();
      const allStates = object.getStatesOnly();
      // If there is no other default state.
      if (!state.getVisual().logicalElement.stateType.includes("default") && !allStates.find(s => s !== state && s.getVisual().logicalElement.stateType.includes("default"))) {
        // state.attr('image/xlink:href', 'assets/SVG/defaultState.svg');
        this.getcurrentStateElement().drawnState.attr("image/display", "flex");
      } else if (state.getVisual().logicalElement.stateType.includes("default")) {
        this.getcurrentStateElement().drawnState.attr("image/display", "none");
      } else {
        (0, validationAlert)("Only one state can be the default state.", 3000, "error");
        return;
      }
      this.getcurrentStateElement().logicalState.stateType = this.selected.checkType();
    }
    // Alon - Changes final temporal state
    setFinalState() {
      this.init.opmModel.logForUndo(this.getcurrentStateElement().logicalState.text + " changed final");
      const state = this.getcurrentStateElement().drawnState;
      // state.attr('image/xlink:href', 'assets/SVG/defaultState.svg');
      const FcheckedInput = this.getcurrentStateElement().drawnState.attr(".inner/stroke-width") === 0 ? 2 : 0;
      const object = state.getParent();
      const allStates = object.getStatesOnly();
      // If there is no other initial state.
      if (FcheckedInput === 2 && !allStates.find(s => s !== state && s.getVisual().logicalElement.stateType.includes("final"))) {
        this.getcurrentStateElement().drawnState.attr(".inner/stroke-width", 2);
      } else if (FcheckedInput === 0) {
        this.getcurrentStateElement().drawnState.attr(".inner/stroke-width", 0);
      } else {
        (0, validationAlert)("Only one state can be the final state.", 3000, "error");
        return;
      }
      this.getcurrentStateElement().logicalState.stateType = this.selected.checkType();
      if (this.getcurrentStateElement().drawnState.attr(".inner/stroke-width") === 2) {
        this.setStatesButtonsActiveStyle("svgRectFinal", "svgRectTextFinal");
      } else {
        this.setStatesButtonDeActiveStyle("svgRectFinal", "svgRectTextFinal");
      }
    }
    getStateType(state) {
      return this.getcurrentStateElement().logicalState.stateType;
    }
    setCurrentState() {
      this.init.opmModel.logForUndo(this.getcurrentStateElement().logicalState.text + " changed to current");
      const state = this.getcurrentStateElement().drawnState;
      if (!this.getcurrentStateElement().logicalState.stateType.includes("Current")) {
        const object = state.getParent();
        const allStates = object.getStatesOnly();
        if (allStates.find(s => s !== state && s.getVisual().logicalElement.stateType.includes("Current"))) {
          (0, validationAlert)("Only one state can be the current state at a time.", 3000, "error");
          return;
        }
        // state.attr('image/xlink:href', 'assets/SVG/currentState.svg');
        // (<OpmLogicalState>(this.getcurrentStateElement().logicalState)).stateType = this.getcurrentStateElement().drawnState.checkType();
        this.getcurrentStateElement().logicalState.stateType = "Current";
        state.attr(".currentImg/display", "flex");
      } else {
        state.attr(".currentImg/display", "none");
        this.getcurrentStateElement().logicalState.stateType = "none";
        // state.attr('image/xlink:href', 'assets/SVG/defaultState.svg');
      }
    }
    // Alon - retrurns the logical state and drawn state
    getcurrentStateElement() {
      let logicalState;
      const visualState = this.init.opmModel.getVisualElementById(this.selected.id);
      if (visualState) {
        logicalState = this.init.opmModel.getLogicalElementByVisualId(visualState.id);
      }
      const drawnState = this.selected;
      return {
        logicalState,
        drawnState
      };
    }
    // Alon - sets the active button styling
    setStatesButtonsActiveStyle(idRect, idText) {
      // (document.getElementById(idRect)) ? document.getElementById(idRect).style.fill = '#1A3763' : document.getElementById(idRect);
      // (document.getElementById(idRect)) ? document.getElementById(idRect).style.fillOpacity = '1' : document.getElementById(idRect);
      // (document.getElementById(idText)) ? document.getElementById(idText).style.fill = '#FFF' : document.getElementById(idText);
    }
    // Alon- return to normal styling
    setStatesButtonDeActiveStyle(idRect, idText) {
      // (document.getElementById(idRect)) ? document.getElementById(idRect).style.fill = 'rgba(73, 114, 132, 0.09)' : document.getElementById(idRect);
      // (document.getElementById(idRect)) ? document.getElementById(idRect).style.fillOpacity = '0.9' : document.getElementById(idRect);
      // (document.getElementById(idText)) ? document.getElementById(idText).style.fill = '#1A3763' : document.getElementById(idText);
    }
    autoFormatName() {
      this.selected.toggleAutoFormat(this.init);
      this.isAutoFormat = !this.isAutoFormat;
    }
    editUnits() {
      this.selected.editUnitsPopup(this.init);
    }
    editAlias() {
      const visual = this.selected.getVisual();
      if (!visual.logicalElement.getBelongsToStereotyped()) {
        // prevent edit/add an alias for an object that belongs to a stereotype (except the main thing of the stereotype)
        this.selected.editAliasPopup(this.init);
      }
    }
    toggleTextSizeMenu() {
      if (!this.textChangeMenu) {
        this.textChangeMenu = true;
        this.currentFontSize = this.selected.attr(this.selected.get("type") === "opm.Note" ? ".noteContentText/font-size" : "text/font-size");
        return;
      }
      if (this.textChangeMenu) {
        this.textChangeMenu = false;
        this.currentFontSize = "";
        return;
      }
    }
    incomingfile(event) {
      if (event.target.files.length === 0) {
        this.file = null;
        this.uploaded = false;
        return;
      }
      this.file = event.target.files[0];
      this.uploaded = true;
      this.excelFileReader();
    }
    excelFileReader() {
      const fileReader = new FileReader();
      fileReader.onload = e => {
        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();
        for (let i = 0; i !== data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join("");
        const workbook = readSync(bstr, {
          type: "binary"
        });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        this.thing = utils.sheet_to_json(worksheet, {
          raw: true
        });
        this.uploaded = true;
      };
      fileReader.readAsArrayBuffer(this.file);
    }
    numberOfRunsChange() {
      const value = document.getElementById("numberOfRuns").value;
      if (value === "") {
        document.getElementById("numberOfRuns").value = "1";
      }
      this.numberOfRuns = Number(value);
      if (this.numberOfRuns > 9) {
        this.downloadCSV = true;
      }
    }
    downloadFileEvery() {
      const value = document.getElementById("downloadEvery").value;
      if (value === "") {
        document.getElementById("downloadEvery").value = "1";
      }
      this.downloadCSVEvery = Number(value);
    }
    toggleCSVDownload() {
      if (this.downloadCSV) {
        this.downloadCSV = false;
        return;
      }
      this.downloadCSV = true;
      (0, getInitRappidShared)().dialogService.openDialog(DownloadCSVComponent, 600, 900, {
        test: "test",
        doNotClose: "true"
      });
      this.toggleMenu();
    }
    toggleMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
        this.isActive = true;
        return;
      } else if (!this.menuOpen) {
        this.menuOpen = true;
        this.isActive = false;
      }
    }
    // getNumberOfSimulation() {
    //   return this.numberOfRuns;
    // }
    simulation() {
      (0, getInitRappidShared)().dialogService.openDialog(SimulationComponent, 700, 600, {
        test: "test"
      });
      this.toggleMenu();
    }
    changeTextSize(val) {
      const init = (0, getInitRappidShared)();
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      this.init.getOpmModel().logForUndo("Font size change");
      for (const element of elements) {
        const cellView = init.paper.findViewByModel(element);
        if (val && cellView && cellView.el) {
          this.init.graph.startBatch("ignoreEvents");
          const isNote = element.get("type") === "opm.Note";
          const prevSize = element.attr(isNote ? ".noteContentText/font-size" : "text/font-size");
          const propertyName = isNote ? ".noteContentText" : "text";
          element.attr({
            [propertyName]: {
              "font-size": val
            }
          });
          if (isNote) {
            element.attr({
              ".noteTitleText": {
                "font-size": val
              }
            });
          } else if (prevSize < val) {
            element.autosize(this.init);
            this.fixTextOverFlow(element);
          }
          // if the text shown on screen is nothing
          if (cellView.el.textContent === "-") {
            element.attr({
              [propertyName]: {
                "font-size": prevSize
              }
            });
            (0, validationAlert)("Font size is too big. Enlarge the element size or choose smaller font size.");
          }
          this.init.graph.stopBatch("ignoreEvents");
        }
      }
      this.toggleTextSizeMenu();
    }
    toggleTextColorMenu() {
      if (!this.textColor) {
        this.textColor = true;
        return;
      }
      if (this.textColor) {
        this.textColor = false;
        return;
      }
    }
    changeTextColor(color) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      this.init.opmModel.logForUndo("Text Color Change");
      this.init.opmModel.setShouldLogForUndoRedo(false, "changeTextColor");
      for (const element of elements) {
        element.attr({
          text: {
            fill: color
          }
        });
        if (OPCloudUtils.isInstanceOfDrawnNote(element)) {
          element.attr(".noteTitleText/fill", color);
          element.attr(".noteContentText/fill", color);
        }
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "changeTextColor");
    }
    toggleStrokeMenu() {
      if (!this.strokeColor) {
        this.strokeColor = true;
        return;
      }
      if (this.strokeColor) {
        this.strokeColor = false;
        return;
      }
    }
    changeStrokeColor(color) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      this.init.opmModel.logForUndo("Border Color Change");
      this.init.opmModel.setShouldLogForUndoRedo(false, "changeStrokeColor");
      for (const element of elements) {
        if (element instanceof OpmObject) {
          element.attr({
            rect: {
              stroke: color
            }
          });
          element.updateDuplicationMarkBorderColor(color);
        } else if (element instanceof OpmState) {
          element.attr({
            rect: {
              stroke: color
            }
          });
          element.attr("rect/stroke", color);
          element.attr(".inner/stroke", color);
          element.attr(".outer/stroke", color);
          element.updateDuplicationMarkBorderColor(color);
        } else if (element instanceof OpmProcess) {
          element.attr({
            ellipse: {
              stroke: color
            }
          });
          element.updateDuplicationMarkBorderColor(color);
        } else if (element instanceof Note) {
          element.attr({
            ".notes": {
              stroke: color
            }
          });
          element.attr({
            ".stickyPart": {
              stroke: color
            }
          });
        }
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "changeStrokeColor");
    }
    toggleFontMnue() {
      if (!this.textFont) {
        this.textFont = true;
        return;
      }
      if (this.textFont) {
        this.textFont = false;
        return;
      }
    }
    changeFont(fontStyle) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      this.init.getOpmModel().logForUndo("Font change");
      for (const element of elements) {
        const isNote = element.get("type") === "opm.Note";
        const propertyName = isNote ? ".noteContentText" : "text";
        element.attr({
          [propertyName]: {
            "font-family": fontStyle
          }
        });
        if (isNote) {
          this.selected.attr({
            ".noteTitleText": {
              "font-family": fontStyle
            }
          });
        }
      }
      this.toggleFontMnue();
    }
    toggleFillMenu() {
      if (!this.fillColor) {
        this.fillColor = true;
        return;
      }
      if (this.fillColor) {
        this.fillColor = false;
        return;
      }
    }
    changeFillColor(color) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      this.init.opmModel.logForUndo("Fill Color Change");
      this.init.opmModel.setShouldLogForUndoRedo(false, "changeFillColor");
      for (const element of elements) {
        // Get current fill to check if there's a pattern
        let currentFill;
        if (element instanceof OpmObject) {
          currentFill = element.attr("rect/fill");
        } else if (element instanceof OpmProcess) {
          currentFill = element.attr("ellipse/fill");
        } else {
          currentFill = element.attr("rect/fill");
        }
        const hasPattern = currentFill && currentFill.startsWith("url(#");
        if (hasPattern) {
          // Element has a pattern - recreate it with the new background color
          const visual = element.getVisual();
          const predefinedPatternId = visual && visual.predefinedPatternId;
          const patternConfig = visual && visual.patternConfig;
          if (predefinedPatternId) {
            // Predefined pattern - recreate instance with new background
            const newPatternUrl = this.createPatternInstance(predefinedPatternId, color);
            if (visual) {
              visual.baseFillColor = color;
            }
            if (element instanceof OpmObject) {
              element.attr({
                rect: {
                  fill: newPatternUrl
                }
              });
              element.updateDuplicationMarkFillColor(color);
            } else if (element instanceof OpmState) {
              element.setOriginalColor(color);
              element.attr({
                rect: {
                  fill: newPatternUrl
                }
              });
              element.attr("rect/fill", newPatternUrl);
              element.attr(".inner/fill", newPatternUrl);
              element.attr(".outer/fill", newPatternUrl);
              element.setOriginalColor(color);
              element.updateDuplicationMarkFillColor(color);
            } else if (element instanceof OpmProcess) {
              element.attr({
                ellipse: {
                  fill: newPatternUrl
                }
              });
              element.updateDuplicationMarkFillColor(color);
              element.updateView(element.getVisual());
            } else if (element instanceof Note) {
              element.attr({
                ".notes": {
                  fill: newPatternUrl
                }
              });
              element.attr({
                ".stickyPart": {
                  fill: newPatternUrl
                }
              });
            }
          } else if (patternConfig) {
            // Custom pattern - recreate with new background
            const elementId = element.id || `elem-${Date.now()}-${Math.random()}`;
            const newPatternUrl = this.createPatternInstance(patternConfig, color, elementId);
            if (visual) {
              visual.baseFillColor = color;
            }
            if (element instanceof OpmObject) {
              element.attr({
                rect: {
                  fill: newPatternUrl
                }
              });
              element.updateDuplicationMarkFillColor(color);
            } else if (element instanceof OpmState) {
              element.setOriginalColor(color);
              element.attr({
                rect: {
                  fill: newPatternUrl
                }
              });
              element.attr("rect/fill", newPatternUrl);
              element.attr(".inner/fill", newPatternUrl);
              element.attr(".outer/fill", newPatternUrl);
              element.setOriginalColor(color);
              element.updateDuplicationMarkFillColor(color);
            } else if (element instanceof OpmProcess) {
              element.attr({
                ellipse: {
                  fill: newPatternUrl
                }
              });
              element.updateDuplicationMarkFillColor(color);
              element.updateView(element.getVisual());
            } else if (element instanceof Note) {
              element.attr({
                ".notes": {
                  fill: newPatternUrl
                }
              });
              element.attr({
                ".stickyPart": {
                  fill: newPatternUrl
                }
              });
            }
          } else
            // Can't extract config - just update the color (pattern will use default)
            if (element instanceof OpmObject) {
              element.attr({
                rect: {
                  fill: currentFill
                }
              });
              element.updateDuplicationMarkFillColor(color);
            } else if (element instanceof OpmState) {
              element.setOriginalColor(color);
              element.attr({
                rect: {
                  fill: currentFill
                }
              });
              element.attr("rect/fill", currentFill);
              element.attr(".inner/fill", currentFill);
              element.attr(".outer/fill", currentFill);
              element.setOriginalColor(color);
              element.updateDuplicationMarkFillColor(color);
            } else if (element instanceof OpmProcess) {
              element.attr({
                ellipse: {
                  fill: currentFill
                }
              });
              element.updateDuplicationMarkFillColor(color);
              element.updateView(element.getVisual());
            } else if (element instanceof Note) {
              element.attr({
                ".notes": {
                  fill: currentFill
                }
              });
              element.attr({
                ".stickyPart": {
                  fill: currentFill
                }
              });
            }
        } else {
          // No pattern - just set the fill color
          const visual = element.getVisual();
          if (visual) {
            visual.baseFillColor = color;
          }
          if (element instanceof OpmObject) {
            element.attr({
              rect: {
                fill: color
              }
            });
            element.updateDuplicationMarkFillColor(color);
          } else if (element instanceof OpmState) {
            element.setOriginalColor(color);
            element.attr({
              rect: {
                fill: color
              }
            });
            element.attr("rect/fill", color);
            element.attr(".inner/fill", color);
            element.attr(".outer/fill", color);
            element.setOriginalColor(color);
            element.updateDuplicationMarkFillColor(color);
          } else if (element instanceof OpmProcess) {
            element.attr({
              ellipse: {
                fill: color
              }
            });
            element.updateDuplicationMarkFillColor(color);
            element.updateView(element.getVisual());
          } else if (element instanceof Note) {
            element.attr({
              ".notes": {
                fill: color
              }
            });
            element.attr({
              ".stickyPart": {
                fill: color
              }
            });
          }
        }
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "changeFillColor");
    }
    returnToDefaultAttributes() {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      for (const element of elements) {
        const thing = element.attributes.type === "opm.Process" ? "ellipse" : "rect";
        const thingTYpe = element.attributes.type;
        const entType = element.attributes.type.split(".")[1].toLowerCase();
        if (OPCloudUtils.isInstanceOfDrawnState(element)) {
          element.attr("rect/fill", "#FFFFFF");
          element.attr(".inner/fill", "#FFFFFF");
          element.attr(".outer/fill", "#FFFFFF");
          element.attr(".inner/stroke", "#808000");
          element.attr(".outer/stroke", "#808000");
          element.attr("rect/stroke", "#808000");
          element.setOriginalColor("#FFFFFF");
          element.getVisual().strokeColor = "#808000";
          element.getVisual().fill = "#ffffff";
          element.attr("text/fill", "black");
          element.attr("text/font-family", "Arial, helvetica, sans-serif");
          this.changeTextSize(14);
        } else {
          const userStyles = element.getDefaultStyleParams(this.init);
          element.attr("text/fill", userStyles ? userStyles[entType].text_color : "black");
          element.attr(`${thing}`, {
            fill: userStyles ? userStyles[entType].fill : (0, getStyles)(thingTYpe).fill
          });
          element.attr(`${thing}`, {
            stroke: userStyles ? userStyles[entType].border_color : (0, getStyles)(thingTYpe).stroke
          });
          element.attr("text/font-family", userStyles ? userStyles[entType].font : "Arial, helvetica, sans-serif");
          this.changeTextSize(userStyles ? userStyles[entType].font_size : 14);
        }
        element.attr("text/text-anchor", "middle");
        this.textChangeMenu = false;
        if (element.attributes.type === "opm.Note") {
          element.removeAttr("rect");
          element.removeAttr("text");
          element.attr(".stickyPart/fill", "#fff2ab");
          element.attr(".notes/fill", "#fff7d1");
          //this.selected.attr('.noteContentText/font-size', 14);
          element.attr(".noteTitleText/font-size", 16);
        }
        if (element instanceof OpmEntity) {
          this.resetElementTextPosition(element);
        }
      }
    }
    updateValues(iterationNum, initRappid) {
      const valueArray = this.thing[iterationNum];
      const names = Object.keys(valueArray);
      const values = Object.values(valueArray);
      const currentOpmModelElements = initRappid.opmModel.logicalElements;
      for (let i = 0; i < currentOpmModelElements.length; i++) {
        if (currentOpmModelElements[i] instanceof OpmLogicalObject && currentOpmModelElements[i].valueType !== valueType.None) {
          // computational
          const logOb = currentOpmModelElements[i]; // logical object for updating value
          if (logOb.getSimulationParams().simulated) {
            logOb.value = logOb.getRandomValues(1)[0];
          }
          let logObName = (0, textToName)(logOb.text);
          const logObAlias = logOb.alias;
          for (let j = 0; j < names.length; ++j) {
            logObName = logObName.replace(/\s/g, "");
            names[j] = names[j].replace(/\s/g, "");
            if (names[j] === logObName || names[j] === logObAlias) {
              initRappid.opmModel.logicalElements[i].value = values[j];
              this.updateDrawnValues(logOb, values[j]);
            }
          }
        }
      }
    }
    updateDrawnValues(logical, value) {
      for (const vis of logical.visualElements) {
        const visState = vis.states[0];
        const drawnState = this.init.graph.getCell(visState?.id);
        if (drawnState) {
          this.init.graph.startBatch("ignoreEvents");
          drawnState.attr("text/textWrap/text", String(value));
          this.init.graph.stopBatch("ignoreEvents");
        }
      }
    }
    syncExecute(fromDialog) {
      firstValuesArray = (0, copyAllObjectValues)(element_tool_bar_component_valuesArray, this.init);
      if (this.isHeadlessRunner) {
        if (!fromDialog) {
          const dialogRef = this.dialog.open(HeadlessRunnerComponent, {
            disableClose: true,
            height: "150px",
            width: "350px",
            backdropClass: "backdropBackground",
            panelClass: "trend-dialog",
            autoFocus: false
          });
          this.Execute(headlessRunner);
        }
        this.Execute(headlessRunner);
      } else {
        this.Execute(syncRunner);
      }
    }
    asyncExecute() {
      firstValuesArray = (0, copyAllObjectValues)(element_tool_bar_component_valuesArray, this.init);
      this.Execute(asyncRunner);
    }
    Execute(runner) {
      var _this = this;
      return (0, default)(function* () {
        _this.simulate = !!_this.init.getOpmModel().logicalElements.find(log => log.simulationModule && log.getSimulationParams().simulated === true);
        if (_this.init.Executing === false) {
          element_tool_bar_component_valuesArray = (0, copyAllObjectValues)(element_tool_bar_component_valuesArray, _this.init);
          _this.init.Executing = true;
          _this.Executing = true;
          // array that contains all the link ids needed to be visualized by a token
          const allValuesArray = []; // saves values for exporting
          const exportArray = [];
          let linksArray = [];
          // TODO: fileName need to be taken from element-toolbar
          // If the user didn't give a name to the exported file - get default file name
          const fileName = _this.init.opmModel.createDefaultModelName().trim();
          const interimSavePoints = _this.downloadCSVEvery;
          // execution run loop
          if (_this.simulate && !_this.uploaded) {
            _this.thing = _this.getSimulationData(_this.numberOfRuns);
          }
          if (_this.uploaded === true) {
            _this.numberOfRuns = _this.thing.length;
          }
          const runParams = {
            runNumber: 0,
            numberOfRuns: _this.numberOfRuns,
            downloadCSVEvery: interimSavePoints,
            downloadCSV: _this.downloadCSV,
            runner: runner,
            allValuesArray: allValuesArray,
            exportArray: [],
            exportExcelData: [],
            refsIds: [],
            linksArray: linksArray
          };
          const sc = _this.init.generatedSelectedConfigurations;
          for (let i = 0; i < _this.numberOfRuns; i++) {
            if (_this.isExecutionResetValue) {
              (0, updateAllObjectValues)(firstValuesArray, _this.init);
            }
            linksArray = [];
            if (_this.uploaded || _this.simulate) {
              _this.updateValues(i, _this.init);
            }
            if (_this.runByConfigurations && sc?.length > 0) {
              _this.init.opmModel.setCurrentConfiguration(sc[i] ? sc[i] : sc[i % sc.length]);
            }
            const allProcesses = getAllComputationalProcesses();
            runParams.runNumber = i;
            runParams.linksArray = [];
            runParams.exportArray = runParams.exportArray.length > 0 ? runParams.exportArray : [];
            if (_this.init.includeSubModelsInExecution) {
              yield _this.init.opdHierarchyRef.loadAllSubModels();
            }
            if (_this.runByConfigurations) {
              _this.init.graphService.renderGraph(_this.init.opmModel.currentOpd);
            }
            let error;
            yield validateUnits(allProcesses, 0, runParams).then(res => {
              if (_this.runByConfigurations && i === _this.numberOfRuns - 1) {
                _this.init.opmModel.setCurrentConfiguration(undefined);
                _this.init.graphService.renderGraph(_this.init.opmModel.currentOpd);
              }
            }).catch(err => {
              error = err?.message;
            });
            if (error) {
              if (String(error).includes("Unsupported unit")) {
                (0, validationAlert)(error, 5000, "Error");
                $("#alertDiv").css({
                  position: "absolute",
                  top: "120px"
                });
              }
              _this.init.Executing = false;
              _this.init.getGraphService().refreshGraph(_this.init);
              return;
            }

          }
        }
        if (_this.init.ExecutingPause === true) {
          _this.init.ExecutingPause = false;
          _this.ExecutingPause = false;
        }
      })();
    }
    getSimulationData(numberOfSimulations) {
      return this.init.getOpmModel().getSimulatedData(numberOfSimulations);
    }
    Simulate() {
      (0, getInitRappidShared)().dialogService.openDialog(SimulationComponent, 700, 600, {
        test: "test"
      });
      this.toggleMenu();
    }
    ExecuteStop() {
      if (this.init.Executing === true) {
        (0, updateAllObjectValues)(element_tool_bar_component_valuesArray, this.init);
      }
      this.init.Executing = false;
      this.Executing = false;
      if (this.init.ExecutingPause === true) {
        $("#executionButton1").off("click");
        this.init.ExecutingPause = false;
        this.ExecutingPause = false;
      }
    }
    ExecutePause() {
      if (this.init.Executing === true) {
        this.init.ExecutingPause = true;
        this.ExecutingPause = true;
      }
    }
    arrangeObjects(direction) {
      if (this.selectionArray.length > 1) {
        this.init.opmModel.logForUndo("Arrange Things");
        this.init.opmModel.setShouldLogForUndoRedo(false, "Arrange Things");
        this.init.getGraphService().arrangeObjects(direction, this.init, this.selectionArray);
        this.init.opmModel.setShouldLogForUndoRedo(true, "Arrange Things");
      }
    }
    pointerUpHandle() {
      this.selectionBox.selectBoxWidth = this.init.selection.el.firstChild.style.width;
      this.selectionBox.selectBoxHeight = this.init.selection.el.firstChild.style.height;
      this.selectionBox.selectBoxLeft = this.init.selection.el.firstChild.style.left;
      this.selectionBox.selectBoxTop = this.init.selection.el.firstChild.style.top;
      (0, setSelect)(this.selectionBox);
    }
    AddURL() {
      const dialogRef = this._dialog.open(SaveURLComponent, {
        height: "600px",
        width: "560px",
        data: {
          Element: this.init.selectedElement.id
        }
      });
    }
    beautifyConnectedLinks($event) {
      if ($event.altKey) {
        for (const ent of this.init.graph.getCells().filter(c => c.constructor.name.includes("Object") || c.constructor.name.includes("Process") || c.constructor.name.includes("State"))) {
          ent.beautifyConnectedLinks(this.init);
        }
        return;
      }
      this.init.selectedElement.beautifyConnectedLinks(this.init);
    }
    toggleStylingDiv() {
      const newVal = !this.showStylingDiv;
      this.closeAllSubToolBars();
      this.showStylingDiv = newVal;
    }
    toggleStatesArrangementDiv() {
      const newVal = !this.showStatesArrangementDiv;
      this.closeAllSubToolBars();
      this.showStatesArrangementDiv = newVal;
    }
    closeAllSubToolBars() {
      this.showStylingDiv = false;
      this.showStatesArrangementDiv = false;
      this.showExtensionsDiv = false;
      this.showTemplatesDiv = false;
      this.isViewsDivOpen = false;
      this.showOpmRequirementsDiv = false;
      this.showThingBackgroundDiv = false;
      this.showConnectionsDiv = false;
      this.textChangeMenu = false;
      this.currentFontSize = "";
      this.closeBringConnectedSubDiv();
    }
    closeBringConnectedSubDiv() {
      this.showBringConnectedDiv = false;
      this.init.currentBringConnectedSettings = {
        ...this.init.oplService.settings.bringConnectedSettings
      };
    }
    visibleNavBarClick($event) {
      if ($event.target.id === "visibleNav") {
        this.closeAllSubToolBars();
      }
    }
    shouldShowOutzoom() {
      const visuals = this.init.selection.collection.models.map(dr => this.init.opmModel.getVisualElementById(dr.id));
      if (visuals.length <= 1) {
        return false;
      }
      const things = visuals.filter(en => en instanceof OpmVisualThing);
      const condition1 = things.length === visuals.length;
      return condition1 && (this.isProcess || this.isObject && this.selected.attributes.type !== "opm.Ellipsis" && !this.isComputational);
    }
    shouldShowBringLinkBetweenSelected() {
      const visuals = this.init.selection.collection.models.map(dr => this.init.opmModel.getVisualElementById(dr.id)).filter(c => !!c);
      if (visuals.length <= 1) {
        return false;
      }
      const things = visuals.filter(en => en instanceof OpmVisualEntity);
      return things.length > 1;
    }
    getSelectedElementFill() {
      if (this.init.selectedElement) {
        let fill;
        if (this.init.selectedElement instanceof OpmObject) {
          fill = this.init.selectedElement.attr("rect/fill");
        } else if (this.init.selectedElement instanceof OpmProcess) {
          fill = this.init.selectedElement.attr("ellipse/fill");
        } else if (this.init.selectedElement instanceof Note) {
          fill = this.init.selectedElement.attr("rect/fill") || this.init.selectedElement.attr(".notes/fill");
        } else {
          fill = this.init.selectedElement.attr("rect/fill") ? this.init.selectedElement.attr("rect/fill") : this.init.selectedElement.attr(".outer/fill");
        }
        // If fill is a pattern, return the stored base color instead (for fill color button)
        if (fill && fill.startsWith("url(#")) {
          const visual = this.init.selectedElement.getVisual();
          const baseColor = visual && visual.baseFillColor;
          return baseColor || "#FFFFFF";
        }
        return fill || "#FFFFFF";
      } else {
        return "#FFFFFF";
      }
    }
    getSelectedElementStroke() {
      if (this.init.selectedElement) {
        if (this.init.selectedElement instanceof OpmObject) {
          return this.init.selectedElement.attr("rect/stroke");
        } else if (this.init.selectedElement instanceof OpmProcess) {
          return this.init.selectedElement.attr("ellipse/stroke");
        } else if (this.init.selectedElement instanceof Note) {
          return this.init.selectedElement.attr("rect/stroke") || this.init.selectedElement.attr(".notes/stroke");
        } else if (this.init.selectedElement instanceof OpmState) {
          if (this.init.selectedElement.attr("rect/stroke")) {
            return this.init.selectedElement.attr("rect/stroke");
          } else {
            return this.init.selectedElement.attr(".outer/stroke");
          }
        }
      } else {
        return "#FFFFFF";
      }
    }
    shouldShowStyling() {
      return !this.isLink && this.selected.attributes.type !== "opm.Ellipsis" && !this.selected.get("type").includes("Triangle");
    }
    shouldShowSemifolding() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const thing = this.selected.getVisual();
      if (!thing || thing.getRefineeInzoom() === thing) {
        return false;
      }
      if (!thing || !thing.logicalElement) {
        return false;
      }
      const links = thing.getAllLinks().outGoing.filter(rel => !rel.logicalElement.isAtOPD(this.init.opmModel.currentOpd) && !thing.semiFolded.find(r => r.logicalElement === rel.target.logicalElement));
      const toAdd = links.map(link => {
        return {
          type: link.type,
          target: link.target.logicalElement,
          link: link
        };
      }).filter(rel => [linkType.Exhibition, linkType.Generalization, linkType.Instantiation, linkType.Aggregation].includes(rel.type) && (!rel.link.target.fatherObject || !thing.semiFolded.find(visual => visual.logicalElement === rel.link.target.fatherObject?.logicalElement)));
      if (thing.getRefineeInzoom()) {
        const innerThings = thing.getRefineeInzoom().children.filter(chld => chld.constructor.name === thing.constructor.name);
        for (const child of innerThings) {
          if (!toAdd.find(item => item.type === linkType.Aggregation && item.target.logicalElement === child.logicalElement) && !thing.semiFolded.find(foldedVis => foldedVis.logicalElement === child.logicalElement) && !thing.getLinks().outGoing.find(lnk => lnk.target.logicalElement === child.logicalElement)) {
            return true;
          }
        }
      }
      if (toAdd.length === 0) {
        return false;
      }
      return true;
    }
    shouldShowRemoveSemifolding() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const thing = this.selected?.getVisual();
      if (thing?.isSemiFolded()) {
        return true;
      }
      return false;
    }
    shouldShowAttributesAndInstancesActionButton() {
      if (this.isProcess) {
        // Not for Processes
        return false;
      }
      const visuals = this.init.selection.collection.models.map(dr => this.init.opmModel.getVisualElementById(dr.id)).filter(c => !!c);
      if (visuals.length > 1) {
        // Not for multi-selection
        return false;
      }
      if (this.selected && this.selected.getVisual && !!this.selected.getVisual()) {
        const links = this.selected.getVisual().getAllLinks();
        if (links.inGoing.length === 0) {
          return true;
        }
      }
      return false;
    }
    attributesAndInstancesAction() {
      const dialogRef = this.dialog.open(AttributesAndInstancesComponent, {
        height: "575px",
        width: "550px",
        data: {
          showVersions: false,
          name: "",
          description: "",
          selected: this.selected
        }
      });
    }
    showExistingStereotypeOpd(existingSterotype) {
      this.init.opmModel.currentOpd = existingSterotype.getOpd();
      this.init.getGraphService().renderGraph(existingSterotype.getOpd(), this.init);
      (0, highlighSD)(existingSterotype.getOpd().id, this.init);
    }
    stereotypeAction() {
      const this_ = this;
      const logical = this.selected.getVisual().logicalElement;
      const existingSterotype = logical.getStereotype();
      if (existingSterotype) {
        return this.showExistingStereotypeOpd(existingSterotype);
      }
      if (logical.protectedFromBeingRefinedBySubModel) {
        (0, validationAlert)("Cannot set a stereotype to a a thing that is shared with a sub model.", 5000, "error");
        return;
      }
      if (this.selected.constructor.name.includes("Object") && this.selected.getVisual().states.length > 0) {
        (0, validationAlert)("Cannot set stereotype to an object with states.", 5000, "error");
        return;
      }
      if (this.selected.getVisual().getRefineeInzoom()) {
        (0, validationAlert)("Cannot set stereotype to a refined thing.", 5000, "error");
        return;
      }
      if (this.selected.getVisual().logicalElement.isSatisfiedRequirementSetObject()) {
        (0, validationAlert)("Cannot set stereotype to a requirement set object.", 5000, "error");
        return;
      }
      if (this.selected.getVisual().logicalElement.hasRequirements()) {
        (0, validationAlert)("Cannot set stereotype for a thing with requirements.", 5000, "error");
        return;
      }
      const dialogRef = this.dialog.open(StereotypesDialogComponent, {
        height: "610px",
        width: "873px",
        data: {
          showVersions: false,
          mode: StereotypeStorageMode.SET,
          name: "",
          description: ""
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let ret;
          if (result.opds?.filter(o => !o.isHidden).length > 1) {
            ret = {
              success: false,
              reason: "Currently, OPCloud supports only stereotypes with one level diagram."
            };
          } else {
            ret = this_.init.getOpmModel().addStereotypeToThing(result, this.selected.getVisual().logicalElement);
          }
          if (ret.success) {
            this.init.treeViewService.init(this.init.opmModel);
            this.selected.updateView(this.selected.getVisual());
            this.init.criticalChanges_.next(true);
          } else {
            (0, validationAlert)(ret.reason, 5000, "error");
          }
        }
      });
      // this.createDummyStereotype(this.init.opmModel);
      // this.init.getOpmModel().addStereotypeToThing(modelAsJson, this.selected.getVisual().logicalElement);
      // this.init.treeViewService.init(this.init.opmModel);
      // this.selected.updateView(<any>this.selected.getVisual());
    }
    createDummyStereotype(model) {
      model.addStereotypeToThing(exampleStereotype, this.selected.getVisual().logicalElement);
    }
    shouldShowSetStereotypeButton() {
      const condition0 = this.selected && this.selected.getVisual && !!this.selected.getVisual();
      if (condition0 === false) {
        return false;
      }
      const condition1 = !!this.isProcess || !!this.isObject;
      if (condition1 === false) {
        return false;
      }
      const condition2 = this.selected.attributes.type !== "opm.Ellipsis";
      if (condition2 === false) {
        return false;
      }
      const condition3 = !this.selected.getVisual().logicalElement.getBelongsToStereotyped();
      const condition4 = this.selected.getVisual().logicalElement.getStereotype();
      return condition0 && condition1 && condition2 && (condition3 || condition4);
    }
    shouldShowConnectSubModel() {
      if (this.isExample() || this.isTemplate() || this.isStereotype()) {
        return false;
      }
      const selected = this.init.selection.collection.models;
      const objects = selected.filter(en => OPCloudUtils.isInstanceOfDrawnObject(en));
      const processes = selected.filter(en => OPCloudUtils.isInstanceOfDrawnProcess(en) && !en.getParentCell());
      if (objects.length === 0 || processes.length === 0) {
        return false;
      }
      for (const obj of objects) {
        const visObj = obj.getVisual();
        for (const proc of processes) {
          const visProc = proc.getVisual();
          if (!visProc) {
            continue;
          }
          const links = visProc.getLinksWith(visObj).inGoing;
          const exh = links.find(l => l.type === linkType.Exhibition);
          const instrument = links.find(l => l.type === linkType.Instrument);
          if (exh && instrument) {
            return true;
          }
        }
      }
      return false;
    }
    stereotypeTooltipMsg() {
      if (this.selected.getVisual().logicalElement.getStereotype()) {
        return "Show Stereotype";
      }
      return "Set Stereotype";
    }
    markedThingsAction() {
      const new_val = !this.init.shouldGreyOut;
      this.init.oplService.updateUserSettings({
        markThings: new_val
      });
      this.init.updateDB({
        markThings: new_val
      });
      for (const cell of this.init.graph.getCells().filter(c => c instanceof OpmEntity)) {
        cell.greyOutEntity();
      }
    }
    findAction() {
      const data = {
        message: "Warning: Not a valid search!",
        closeFlag: true
      };
      this.init.dialogService.openDialog(SearchItemsDialogComponent, 530, 600, data);
    }
    openInstancesDialog() {
      this.dialog.open(multiInstancesDialog, {
        width: Math.round(window.innerWidth * 0.6) + "px",
        data: {
          closeFlag: true
        }
      });
    }
    /**
     * This function is called when the user clicks on the brush icon.
     * In this function we keep the style of the selected element in a dictionary named 'copiedStyleParams'.
     * @param $event
     * @param isRightClick
     */
    regularCopyStyle($event, isRightClick) {
      if (this.init.copiedStyleParams) {
        this.init.copiedStyleParams = null;
        return;
      }
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
      if (this.init.selectedElement.constructor.name.includes("Note")) {
        return;
      }
      const dict = {
        isRightClick: isRightClick
      };
      dict.borderColor = this.init.selectedElement.getVisual().strokeColor;
      dict.fontSize = this.init.selectedElement.getVisual().textFontSize;
      dict.fillColor = this.getSelectedElementFill();
      dict.textColor = this.init.selectedElement.getVisual().textColor;
      dict.font = this.init.selectedElement.getVisual().textFontFamily;
      this.init.copiedStyleParams = dict;
    }
    /**
     * group 04:
     * this function is called when the user clicks 'Ctrl+Shift+C'.
     * The dialog that we created (in class StyleCopyingDialogComponent) will pop up.
     * @param $event
     * @param isRightClick
     */
    openPasteOptionsDialog($event, isRightClick) {
      if (this.init.copiedStyleParams) {
        this.init.copiedStyleParams = null;
        return;
      }
      this.init.dialogService.openDialog(StyleCopyingDialogComponent, 425, 350, {
        isRightClick: isRightClick
      });
    }
    /**
     * group 04:
     * This function calls the pasteStyle function that is implemented in the Drawn Part, with the 'copiedStyleParams' dictionary.
     */
    pasteStyleParams() {
      this.onSelection();
      this.init.opmModel.logForUndo(this.init.selectedElement.attr("text/textWrap/text") + " Paste Style");
      this.init.opmModel.setShouldLogForUndoRedo(false, "pasteStyle");
      this.init.graph.startBatch("ignoreChange");
      if (this.init.selectedElement?.pasteStyle) {
        this.init.selectedElement.pasteStyle(this.init.copiedStyleParams);
      }
      if (OPCloudUtils.isInstanceOfDrawnEntity(this.init.selectedElement)) {
        this.init.getGraphService().updateEntity(this.init.selectedElement.getVisual());
      }
      this.init.graph.stopBatch("ignoreChange");
      this.init.opmModel.setShouldLogForUndoRedo(true, "pasteStyle");
      this.init.currentlyPastingStyleParams = true;
    }
    shouldShowUnlinkStereotypeButton() {
      if (this.selected && this.selected.getVisual && !!this.selected.getVisual() && (!!this.isProcess || !!this.isObject) && this.selected.getVisual().logicalElement.getStereotype()) {
        return true;
      }
      return false;
    }
    unLinkStereotypeAction() {
      const vis = this.selected.getVisual();
      const currentOpd = this.init.getOpmModel().currentOpd;
      const ret = this.init.getOpmModel().unLinkStereotype(vis);
      if (ret.success) {
        this.init.treeViewService.init(this.init.getOpmModel());
        this.init.getOpmModel().currentOpd = currentOpd;
        this.init.graphService.renderGraph(currentOpd);
        this.init.criticalChanges_.next(true);
      } else if (ret.reason) {
        (0, validationAlert)(ret.reason, 7000, "Error");
      }
    }
    removeStereotypeAction() {
      this.init.getOpmModel().logForUndo("remove stereotype");
      const id = this.selected.getVisual().logicalElement.lid;
      this.init.getOpmModel().setShouldLogForUndoRedo(false, "remove stereotype" + id);
      const vis = this.selected.getVisual();
      const ret = this.init.getOpmModel().removeStereotype(vis);
      if (ret.success) {
        this.init.treeViewService.init(this.init.getOpmModel());
        this.init.graphService.renderGraph(this.init.getOpmModel().currentOpd);
        this.init.criticalChanges_.next(true);
      } else if (ret.reason) {
        (0, validationAlert)(ret.reason, 7000, "Error");
      }
      this.init.getOpmModel().setShouldLogForUndoRedo(true, "remove stereotype" + id);
    }
    quitDsmView() {
      $(".selectedTab .closeTab").click();
    }
    quitDcmView() {
      $(".selectedTab .closeTab").click();
    }
    toggleTextPos() {
      this.selected.getVisual().toggleManualTextPos();
      if (!this.selected.getVisual().isManualTextPos) {
        this.resetElementTextPosition(this.selected);
      }
    }
    resetElementTextPosition(element) {
      this.init.getGraphService().resetElementTextPosition(element);
    }
    shouldShowManualTextDiv() {
      return this.selected && this.selected instanceof OpmEntity;
    }
    alignText(side) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      for (const element of elements) {
        if (element.constructor.name.includes("Note")) {
          element.attr(".noteContentText/text-anchor", side);
        } else {
          element.attr("text/text-anchor", side);
        }
      }
    }
    changeTextRef(axis) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      for (const element of elements) {
        if (axis === "X") {
          const val = document.getElementById("elementXvalue").value;
          element.attr("text/ref-x", Number(val));
        } else {
          const val = document.getElementById("elementYvalue").value;
          element.attr("text/ref-y", Number(val));
        }
        this.fixTextOverFlow(element);
      }
    }
    predefinedTextPos(pos) {
      let refX = 0.5;
      let refY = 0.5;
      if (pos.startsWith("top")) {
        refY = 0.1;
      } else if (pos.startsWith("middle")) {
        refY = 0.5;
      } else if (pos.startsWith("bottom")) {
        refY = 0.9;
      }
      if (pos.endsWith("left")) {
        refX = 0.1;
      } else if (pos.endsWith("right")) {
        refX = 0.9;
      }
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      for (const element of elements) {
        element.attr("text/ref-x", refX);
        element.attr("text/ref-y", refY);
        this.fixTextOverFlow(element);
      }
    }
    fixTextOverFlow(element) {
      if (OPCloudUtils.isInstanceOfDrawnEntity(element)) {
        element.fixTextOverflow();
      }
      //    const refX = this.selected.attr('text/ref-x');
      //    const refY = this.selected.attr('text/ref-y');
      //    if (refX > 0.5) {
      //      this.selected.attr('text/x-alignment', 'right');
      //    } else if (refX < 0.5) {
      //      this.selected.attr('text/x-alignment', 'left');
      // } else {
      //      this.selected.attr('text/x-alignment', 'middle');
      // }
      //
      //    if (refY > 0.5) {
      //      this.selected.attr('text/y-alignment', 'bottom');
      //    } else if (refY < 0.5) {
      //      this.selected.attr('text/y-alignment', 'top');
      // } else {
      //      this.selected.attr('text/y-alignment', 'middle');
      // }
      // const isState = this.selected.constructor.name.includes('State');
      // const isProcess = this.selected.constructor.name.includes('Process');
      // const paper = this.init.paper;
      // const vis = (<any>this.selected).getVisual();
      // if (!paper) return;
      // const cellView = paper.findViewByModel(this.selected);
      // const type = this.selected.constructor.name.includes('Process') ? 'ellipse' : 'rect';
      // if (!cellView) return;
      // let textBBox = cellView.el.getElementsByTagName('text')[0].getClientRects()[0];
      // if (textBBox) {
      //   let bbox = cellView.el.getClientRects()[0];
      //   while (textBBox.left < (bbox.left + (isProcess ? 30 : 15)) && vis.refX < 1 && ['both', 'X'].includes(axis)) {
      //     const newRefX = Math.min(vis.refX + 0.05, 1);
      //     this.selected.attr('text/ref-x', newRefX);
      //     vis.refX = newRefX;
      //     textBBox = cellView.el.getElementsByTagName('text')[0].getClientRects()[0];
      //   }
      //   while (textBBox.top < (bbox.top + (isState ? 5 : 10)) && vis.refY < 1 && ['both', 'Y'].includes(axis)) {
      //     const newRefY = Math.min(vis.refY + 0.05, 1);
      //     this.selected.attr('text/ref-y', newRefY);
      //     vis.refY = newRefY;
      //     textBBox = cellView.el.getElementsByTagName('text')[0].getClientRects()[0];
      //   }
      //   while (textBBox.right > (bbox.right - (isState ? 12 : (isProcess ? 30 : 15))) && vis.refX > 0 && ['both', 'X'].includes(axis)) {
      //     const newRefX = Math.max(vis.refX - 0.05, 0);
      //     this.selected.attr('text/ref-x', newRefX);
      //     vis.refX = newRefX;
      //     textBBox = cellView.el.getElementsByTagName('text')[0].getClientRects()[0];
      //   }
      //   while (textBBox.bottom > (bbox.bottom - (isState ? 5 : 10)) && vis.refY > 0 && ['both', 'Y'].includes(axis)) {
      //     const newRefY = Math.max(vis.refY - 0.05, 0);
      //     this.selected.attr('text/ref-y', newRefY);
      //     vis.refY = newRefY;
      //     textBBox = cellView.el.getElementsByTagName('text')[0].getClientRects()[0];
      //   }
      // }
    }
    getColorPalette() {
      const colorPalette = [{
        content: "#ffe800",
        tooltip: "Yellow"
      }, {
        content: "#F2802E",
        tooltip: "Orange"
      }, {
        content: "#2EF265",
        tooltip: "Green"
      }, {
        content: "#2EC3F2",
        tooltip: "Teal"
      }, {
        content: "#3e2ef2",
        tooltip: "Blue"
      }, {
        content: "#9C2EF2",
        tooltip: "Purple"
      }, {
        content: "#f22e80",
        tooltip: "Pink"
      }, {
        content: "#ff0000",
        tooltip: "Red"
      }, {
        content: "transparent",
        tooltip: "Transparent"
      },
      // Canvas Color
      {
        content: "#838383",
        tooltip: "Gray"
      }, {
        content: "#FFF",
        tooltip: "White"
      }];
      return colorPalette;
    }
    openColorPopup($event, type) {
      if ($(".joint-popup").length > 0) {
        return $(".joint-popup").remove();
      }
      const current_color = type === ColorTarget.STROKE ? this.getSelectedElementStroke() : type === ColorTarget.FILL ? this.getSelectedElementFill() : this.init.selectedElement.getVisual()?.textColor || this.init.selectedElement.attr("text/fill");
      let content = "<div id=\"colorsDiv\" style=\"width:160px; user-select: none;\">";
      const colors = [{
        content: current_color,
        tooltip: "Current Color"
      }].concat(this.getColorPalette());
      for (const item of colors) {
        const field = type === ColorTarget.STROKE ? `stroke="${item.content}"` : `fill="${item.content}"`;
        content += `
          <a class='colorBtn' title="${item.tooltip}" value="${item.content}"><svg width="36" height="35" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b)">
              <rect width="38" height="34" rx="4" transform="matrix(-1 0 0 1 38 0)" fill="#eee" fill-opacity="0.7" />
            </g>
            <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)"
              ${field} />
            <defs>
              <filter id="filter0_b" x="-4" y="-4" width="46" height="42" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              </filter>
            </defs>
          </svg></a>`;
      }
      content += "<br>Custom color: <input type=\"color\" id=\"colorChooser\" style=\"width: 25px; height: 22px; border-color: transparent; margin-bottom: 5px;\" value=\"#FFFFFF\">";
      content += `
      <a class='moreBtn' style="margin-left: 3px;">
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.2168 6.32227H13.7676V8.71484H8.2168V15.0039H5.67383V8.71484H0.123047V6.32227H5.67383V0.511719H8.2168V6.32227Z" fill="#5A6F8F"/>
      </svg></a>`;
      for (const item of this.init.customColors) {
        content += this.addColor(item.content, type);
      }
      content += "</div>";
      const that = this;
      const popupEvents = {
        "click .colorBtn": function ($event) {
          if (type === ColorTarget.FILL) {
            that.changeFillColor($event.currentTarget.getAttribute("value"));
          } else if (type === ColorTarget.STROKE) {
            that.changeStrokeColor($event.currentTarget.getAttribute("value"));
          } else if (type === ColorTarget.TEXT) {
            that.changeTextColor($event.currentTarget.getAttribute("value"));
          }
        },
        "click .moreBtn": function ($event) {
          const color = $("#colorChooser")[0].value;
          that.init.customColors.push({
            content: color
          });
          const htmlToAdd = that.addColor(color, type);
          $("#colorsDiv")[0].innerHTML += htmlToAdd;
        }
      };
      (0, popupGenerator)($event.target, content, popupEvents).render();
      (0, stylePopup)(false, false, false);
      const ppup = $(".joint-popup")[0];
      $(".joint-popup").addClass("fillStrokePopup");
      ppup.style.lineHeight = "1.6";
    }
    addColor(color, type) {
      const field = type === ColorTarget.STROKE ? `stroke="${color}"` : `fill="${color}"`;
      const content = `
          <a class='colorBtn' value="${color}"><svg width="36" height="35" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b)">
              <rect width="38" height="34" rx="4" transform="matrix(-1 0 0 1 38 0)" fill="#eee" fill-opacity="0.7" />
            </g>
            <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)"
              ${field} />
            <defs>
              <filter id="filter0_b" x="-4" y="-4" width="46" height="42" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              </filter>
            </defs>
          </svg></a>`;
      return content;
    }
    getSelectedElementPatternPreview() {
      if (this.init.selectedElement) {
        let fill;
        if (this.init.selectedElement instanceof OpmObject) {
          fill = this.init.selectedElement.attr("rect/fill");
        } else if (this.init.selectedElement instanceof OpmProcess) {
          fill = this.init.selectedElement.attr("ellipse/fill");
        } else if (this.init.selectedElement instanceof Note) {
          fill = this.init.selectedElement.attr("rect/fill") || this.init.selectedElement.attr(".notes/fill");
        } else {
          fill = this.init.selectedElement.attr("rect/fill") ? this.init.selectedElement.attr("rect/fill") : this.init.selectedElement.attr(".outer/fill");
        }
        // If there's a pattern, create a preview with white background (independent of actual fill color)
        if (fill && fill.startsWith("url(#")) {
          const visual = this.init.selectedElement.getVisual();
          const patternConfig = visual && visual.patternConfig;
          const predefinedPatternId = visual && visual.predefinedPatternId;
          if (predefinedPatternId) {
            // Predefined pattern - use static template for preview
            return this.createPatternInstance(predefinedPatternId, "#FFFFFF");
          } else if (patternConfig) {
            // Custom pattern - create preview
            const elementId = this.init.selectedElement.id || "preview";
            return this.createPatternInstance(patternConfig, "#FFFFFF", elementId);
          }
          // Fallback: return white if we can't create preview
          return "#FFFFFF";
        }
        // Return white background for pattern preview when no pattern is applied
        return "#FFFFFF";
      }
      return "#FFFFFF";
    }
    getPredefinedPatterns() {
      return [{
        id: "stripes-vertical",
        name: "Vertical Stripes",
        config: {
          angleDeg: 0,
          gap: 10,
          stripeWidth: 3,
          stripeColor: "#5A6F8F",
          useUserSpace: true
        }
      }, {
        id: "stripes-horizontal",
        name: "Horizontal Stripes",
        config: {
          angleDeg: 90,
          gap: 10,
          stripeWidth: 3,
          stripeColor: "#5A6F8F",
          useUserSpace: true
        }
      }, {
        id: "stripes-diagonal-right",
        name: "Diagonal Right",
        config: {
          angleDeg: 45,
          gap: 10,
          stripeWidth: 3,
          stripeColor: "#5A6F8F",
          useUserSpace: true
        }
      }, {
        id: "stripes-diagonal-left",
        name: "Diagonal Left",
        config: {
          angleDeg: -45,
          gap: 10,
          stripeWidth: 3,
          stripeColor: "#5A6F8F",
          useUserSpace: true
        }
      }, {
        id: "stripes-thick-vertical",
        name: "Thick Vertical",
        config: {
          angleDeg: 0,
          gap: 15,
          stripeWidth: 5,
          stripeColor: "#5A6F8F",
          useUserSpace: true
        }
      }, {
        id: "stripes-thin-vertical",
        name: "Thin Vertical",
        config: {
          angleDeg: 0,
          gap: 8,
          stripeWidth: 1,
          stripeColor: "#5A6F8F",
          useUserSpace: true
        }
      }];
    }
    // Ensure static predefined pattern templates exist in SVG
    ensurePredefinedPatterns() {
      const paper = this.init?.paper;
      if (!paper || !paper.svg) {
        return;
      }
      const svg = paper.svg;
      const ns = "http://www.w3.org/2000/svg";
      // Ensure a <defs> exists
      let defs = svg.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS(ns, "defs");
        svg.insertBefore(defs, svg.firstChild);
      }
      const predefinedPatterns = this.getPredefinedPatterns();
      for (const patternDef of predefinedPatterns) {
        const staticPatternId = `pat-${patternDef.id}`;
        // Check if static pattern already exists
        if (svg.querySelector(`#${staticPatternId}`)) {
          continue; // Already exists, skip
        }
        // Create static pattern template (without background - background will be set per element)
        const {
          angleDeg,
          gap,
          stripeWidth,
          stripeColor,
          useUserSpace
        } = patternDef.config;
        const pattern = document.createElementNS(ns, "pattern");
        pattern.setAttribute("id", staticPatternId);
        if (useUserSpace) {
          pattern.setAttribute("patternUnits", "userSpaceOnUse");
          pattern.setAttribute("width", String(gap));
          pattern.setAttribute("height", String(gap));
        } else {
          pattern.setAttribute("patternUnits", "objectBoundingBox");
          pattern.setAttribute("width", "1");
          pattern.setAttribute("height", "1");
        }
        // Set patternTransform for diagonal patterns
        if (angleDeg !== undefined && angleDeg !== null && angleDeg !== 0 && angleDeg !== 90) {
          if (useUserSpace) {
            pattern.setAttribute("patternTransform", `rotate(${angleDeg} ${gap / 2} ${gap / 2})`);
          } else {
            pattern.setAttribute("patternTransform", `rotate(${angleDeg} 0.5 0.5)`);
          }
        }
        // Draw stripes based on angle
        if (angleDeg === 0 || angleDeg === undefined || angleDeg === null) {
          // Vertical stripes
          const stripe = document.createElementNS(ns, "rect");
          if (useUserSpace) {
            stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(stripeWidth));
            stripe.setAttribute("height", String(gap));
          } else {
            const fracW = stripeWidth / gap;
            stripe.setAttribute("x", String(0.5 - fracW / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(fracW));
            stripe.setAttribute("height", "1");
          }
          stripe.setAttribute("fill", stripeColor);
          pattern.appendChild(stripe);
        } else if (angleDeg === 90) {
          // Horizontal stripes
          const stripe = document.createElementNS(ns, "rect");
          if (useUserSpace) {
            stripe.setAttribute("x", "0");
            stripe.setAttribute("y", String(gap / 2 - stripeWidth / 2));
            stripe.setAttribute("width", String(gap));
            stripe.setAttribute("height", String(stripeWidth));
          } else {
            const fracH = stripeWidth / gap;
            stripe.setAttribute("x", "0");
            stripe.setAttribute("y", String(0.5 - fracH / 2));
            stripe.setAttribute("width", "1");
            stripe.setAttribute("height", String(fracH));
          }
          stripe.setAttribute("fill", stripeColor);
          pattern.appendChild(stripe);
        } else {
          // Diagonal patterns - draw vertical stripe, rotation handles orientation
          const stripe = document.createElementNS(ns, "rect");
          if (useUserSpace) {
            stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(stripeWidth));
            stripe.setAttribute("height", String(gap));
          } else {
            const fracW = stripeWidth / gap;
            stripe.setAttribute("x", String(0.5 - fracW / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(fracW));
            stripe.setAttribute("height", "1");
          }
          stripe.setAttribute("fill", stripeColor);
          pattern.appendChild(stripe);
        }
        defs.appendChild(pattern);
      }
    }
    // Create a pattern instance with a specific background color (for applying to elements)
    // For predefined patterns: uses static template and adds background
    // For custom patterns: creates element-specific pattern
    createPatternInstance(patternIdOrConfig, backgroundColor, elementId) {
      const paper = this.init?.paper;
      if (!paper || !paper.svg) {
        console.warn("createPatternInstance(): missing paper");
        return null;
      }
      // Ensure predefined patterns exist
      this.ensurePredefinedPatterns();
      const svg = paper.svg;
      const ns = "http://www.w3.org/2000/svg";
      let defs = svg.querySelector("defs");
      // If patternIdOrConfig is a string, it's a predefined pattern ID
      if (typeof patternIdOrConfig === "string") {
        const predefinedPatterns = this.getPredefinedPatterns();
        const patternDef = predefinedPatterns.find(p => p.id === patternIdOrConfig);
        if (!patternDef) {
          console.warn(`Predefined pattern not found: ${patternIdOrConfig}`);
          return null;
        }
        // Create instance pattern ID: pat-{patternId}-bg-{backgroundColor}
        const bgColorStr = backgroundColor.replace("#", "");
        const instancePatternId = `pat-${patternIdOrConfig}-bg-${bgColorStr}`;
        // Check if instance already exists
        let instancePattern = svg.querySelector(`#${instancePatternId}`);
        if (!instancePattern) {
          // Clone the static template and add background
          const staticPattern = svg.querySelector(`#pat-${patternIdOrConfig}`);
          if (!staticPattern) {
            console.warn(`Static pattern template not found: pat-${patternIdOrConfig}`);
            return null;
          }
          instancePattern = staticPattern.cloneNode(true);
          instancePattern.setAttribute("id", instancePatternId);
          // Add background rect as first child
          const {
            gap,
            useUserSpace
          } = patternDef.config;
          const bg = document.createElementNS(ns, "rect");
          bg.setAttribute("x", "0");
          bg.setAttribute("y", "0");
          bg.setAttribute("width", useUserSpace ? String(gap) : "1");
          bg.setAttribute("height", useUserSpace ? String(gap) : "1");
          bg.setAttribute("fill", backgroundColor);
          instancePattern.insertBefore(bg, instancePattern.firstChild);
          defs.appendChild(instancePattern);
        }
        return `url(#${instancePatternId})`;
      } else {
        // Custom pattern - create element-specific pattern
        const patternConfig = patternIdOrConfig;
        const {
          angleDeg,
          gap,
          stripeWidth,
          stripeColor,
          useUserSpace
        } = patternConfig;
        // Build pattern ID for custom pattern
        const angleStr = angleDeg < 0 ? `n${Math.abs(angleDeg)}` : String(angleDeg);
        const keyParts = [angleStr, gap, stripeWidth, stripeColor.replace("#", ""), backgroundColor.replace("#", ""), useUserSpace ? "us" : "bb"];
        const customPatternId = `pat-stripes-custom-${elementId}-${keyParts.join("-")}`;
        // Check if custom pattern already exists
        let pattern = svg.querySelector(`#${customPatternId}`);
        if (pattern) {
          // Clear and rebuild
          while (pattern.firstChild) {
            pattern.removeChild(pattern.firstChild);
          }
          const id = pattern.getAttribute("id");
          while (pattern.attributes.length > 0) {
            pattern.removeAttribute(pattern.attributes[0].name);
          }
          if (id) {
            pattern.setAttribute("id", id);
          }
        } else {
          pattern = document.createElementNS(ns, "pattern");
          pattern.setAttribute("id", customPatternId);
          defs.appendChild(pattern);
        }
        // Set pattern attributes
        if (useUserSpace) {
          pattern.setAttribute("patternUnits", "userSpaceOnUse");
          pattern.setAttribute("width", String(gap));
          pattern.setAttribute("height", String(gap));
        } else {
          pattern.setAttribute("patternUnits", "objectBoundingBox");
          pattern.setAttribute("width", "1");
          pattern.setAttribute("height", "1");
        }
        if (angleDeg !== undefined && angleDeg !== null && angleDeg !== 0 && angleDeg !== 90) {
          if (useUserSpace) {
            pattern.setAttribute("patternTransform", `rotate(${angleDeg} ${gap / 2} ${gap / 2})`);
          } else {
            pattern.setAttribute("patternTransform", `rotate(${angleDeg} 0.5 0.5)`);
          }
        }
        // Add background
        const bg = document.createElementNS(ns, "rect");
        bg.setAttribute("x", "0");
        bg.setAttribute("y", "0");
        bg.setAttribute("width", useUserSpace ? String(gap) : "1");
        bg.setAttribute("height", useUserSpace ? String(gap) : "1");
        bg.setAttribute("fill", backgroundColor);
        pattern.appendChild(bg);
        // Draw stripe (same logic as static patterns)
        if (angleDeg === 0 || angleDeg === undefined || angleDeg === null) {
          const stripe = document.createElementNS(ns, "rect");
          if (useUserSpace) {
            stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(stripeWidth));
            stripe.setAttribute("height", String(gap));
          } else {
            const fracW = stripeWidth / gap;
            stripe.setAttribute("x", String(0.5 - fracW / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(fracW));
            stripe.setAttribute("height", "1");
          }
          stripe.setAttribute("fill", stripeColor);
          pattern.appendChild(stripe);
        } else if (angleDeg === 90) {
          const stripe = document.createElementNS(ns, "rect");
          if (useUserSpace) {
            stripe.setAttribute("x", "0");
            stripe.setAttribute("y", String(gap / 2 - stripeWidth / 2));
            stripe.setAttribute("width", String(gap));
            stripe.setAttribute("height", String(stripeWidth));
          } else {
            const fracH = stripeWidth / gap;
            stripe.setAttribute("x", "0");
            stripe.setAttribute("y", String(0.5 - fracH / 2));
            stripe.setAttribute("width", "1");
            stripe.setAttribute("height", String(fracH));
          }
          stripe.setAttribute("fill", stripeColor);
          pattern.appendChild(stripe);
        } else {
          const stripe = document.createElementNS(ns, "rect");
          if (useUserSpace) {
            stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(stripeWidth));
            stripe.setAttribute("height", String(gap));
          } else {
            const fracW = stripeWidth / gap;
            stripe.setAttribute("x", String(0.5 - fracW / 2));
            stripe.setAttribute("y", "0");
            stripe.setAttribute("width", String(fracW));
            stripe.setAttribute("height", "1");
          }
          stripe.setAttribute("fill", stripeColor);
          pattern.appendChild(stripe);
        }
        return `url(#${customPatternId})`;
      }
    }
    createPattern(patternConfig, isCustom = false, elementId) {
      const paper = this.init?.paper;
      if (!paper || !paper.svg) {
        console.warn("createPattern(): missing paper");
        return null;
      }
      const {
        angleDeg,
        gap,
        stripeWidth,
        stripeColor,
        background,
        useUserSpace
      } = patternConfig;
      const svg = paper.svg;
      const ns = "http://www.w3.org/2000/svg";
      // Ensure a <defs> exists
      let defs = svg.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS(ns, "defs");
        svg.insertBefore(defs, svg.firstChild);
      }
      // Build pattern ID
      // Normalize angle to avoid issues with negative numbers (use 'n' prefix for negative)
      const angleStr = angleDeg < 0 ? `n${Math.abs(angleDeg)}` : String(angleDeg);
      const keyParts = [angleStr, gap, stripeWidth, stripeColor.replace("#", ""), (background || "none").replace("#", ""), useUserSpace ? "us" : "bb"];
      // For predefined patterns: use standard ID (shared template)
      // For custom patterns: include element ID to make it unique per element
      const patternId = isCustom && elementId ? `pat-stripes-custom-${elementId}-${keyParts.join("-")}` : `pat-stripes-${keyParts.join("-")}`;
      // Check if pattern already exists - reuse it instead of removing to avoid breaking references
      let pattern = svg.querySelector(`#${patternId}`);
      if (pattern) {
        // Pattern exists - clear its children and rebuild (don't remove to preserve references)
        while (pattern.firstChild) {
          pattern.removeChild(pattern.firstChild);
        }
        // Remove all attributes except id
        const id = pattern.getAttribute("id");
        while (pattern.attributes.length > 0) {
          pattern.removeAttribute(pattern.attributes[0].name);
        }
        if (id) {
          pattern.setAttribute("id", id);
        }
      } else {
        // Create new pattern element
        pattern = document.createElementNS(ns, "pattern");
        pattern.setAttribute("id", patternId);
        defs.appendChild(pattern);
      }
      // Pattern tile size - same for all patterns
      if (useUserSpace) {
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("width", String(gap));
        pattern.setAttribute("height", String(gap));
      } else {
        pattern.setAttribute("patternUnits", "objectBoundingBox");
        pattern.setAttribute("width", "1");
        pattern.setAttribute("height", "1");
      }
      // Set patternTransform for diagonal patterns (same approach as OpmObject/OpmState/OpmProcess)
      // Always explicitly remove it first to ensure clean state
      pattern.removeAttribute("patternTransform");
      if (angleDeg !== undefined && angleDeg !== null && angleDeg !== 0 && angleDeg !== 90) {
        // Use explicit rotation with center point for better compatibility
        if (useUserSpace) {
          pattern.setAttribute("patternTransform", `rotate(${angleDeg} ${gap / 2} ${gap / 2})`);
        } else {
          pattern.setAttribute("patternTransform", `rotate(${angleDeg} 0.5 0.5)`);
        }
      }
      // Always add background rect - use provided background or default to white
      const bgColor = background || "#FFFFFF";
      const bg = document.createElementNS(ns, "rect");
      bg.setAttribute("x", "0");
      bg.setAttribute("y", "0");
      bg.setAttribute("width", useUserSpace ? String(gap) : "1");
      bg.setAttribute("height", useUserSpace ? String(gap) : "1");
      bg.setAttribute("fill", bgColor);
      pattern.appendChild(bg);
      // Draw stripes based on angle
      if (angleDeg === 0 || angleDeg === undefined || angleDeg === null) {
        // Vertical stripes - draw as rectangle
        const stripe = document.createElementNS(ns, "rect");
        if (useUserSpace) {
          stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
          stripe.setAttribute("y", "0");
          stripe.setAttribute("width", String(stripeWidth));
          stripe.setAttribute("height", String(gap));
        } else {
          const fracW = stripeWidth / gap;
          stripe.setAttribute("x", String(0.5 - fracW / 2));
          stripe.setAttribute("y", "0");
          stripe.setAttribute("width", String(fracW));
          stripe.setAttribute("height", "1");
        }
        stripe.setAttribute("fill", stripeColor);
        pattern.appendChild(stripe);
      } else if (angleDeg === 90) {
        // Horizontal stripes - draw as rectangle
        const stripe = document.createElementNS(ns, "rect");
        if (useUserSpace) {
          stripe.setAttribute("x", "0");
          stripe.setAttribute("y", String(gap / 2 - stripeWidth / 2));
          stripe.setAttribute("width", String(gap));
          stripe.setAttribute("height", String(stripeWidth));
        } else {
          const fracH = stripeWidth / gap;
          stripe.setAttribute("x", "0");
          stripe.setAttribute("y", String(0.5 - fracH / 2));
          stripe.setAttribute("width", "1");
          stripe.setAttribute("height", String(fracH));
        }
        stripe.setAttribute("fill", stripeColor);
        pattern.appendChild(stripe);
      } else {
        // For diagonal patterns (45, -45, etc.) - draw vertical stripe, patternTransform handles rotation
        // This is the same approach used in OpmObject/OpmState/OpmProcess
        const stripe = document.createElementNS(ns, "rect");
        if (useUserSpace) {
          stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
          stripe.setAttribute("y", "0");
          stripe.setAttribute("width", String(stripeWidth));
          stripe.setAttribute("height", String(gap));
        } else {
          const fracW = stripeWidth / gap;
          stripe.setAttribute("x", String(0.5 - fracW / 2));
          stripe.setAttribute("y", "0");
          stripe.setAttribute("width", String(fracW));
          stripe.setAttribute("height", "1");
        }
        stripe.setAttribute("fill", stripeColor);
        pattern.appendChild(stripe);
      }
      // Pattern is already appended to defs if it was new
      // If we reused an existing pattern, it's already in defs
      // Verify pattern was created and appended correctly
      const verifyPattern = svg.querySelector(`#${patternId}`);
      if (!verifyPattern) {
        console.warn(`Pattern ${patternId} was not created correctly`);
        return null;
      }
      // Verify pattern has both background and stripe
      const bgRect = verifyPattern.querySelector("rect[fill=\"" + bgColor + "\"]");
      // For diagonal patterns, stripe is inside a <g>, so querySelector will find it recursively
      const stripeRect = verifyPattern.querySelector("rect[fill=\"" + stripeColor + "\"]");
      if (!bgRect || !stripeRect) {
        console.warn(`Pattern ${patternId} is missing required elements`);
        return null;
      }
      return `url(#${patternId})`;
    }
    openPatternPopup($event) {
      if ($(".joint-popup").length > 0) {
        return $(".joint-popup").remove();
      }
      // Get current pattern to detect which one is selected
      let currentPatternFill;
      if (this.init.selectedElement) {
        if (this.init.selectedElement instanceof OpmObject) {
          currentPatternFill = this.init.selectedElement.attr("rect/fill");
        } else if (this.init.selectedElement instanceof OpmProcess) {
          currentPatternFill = this.init.selectedElement.attr("ellipse/fill");
        } else if (this.init.selectedElement instanceof OpmState) {
          currentPatternFill = this.init.selectedElement.attr("rect/fill");
        } else {
          currentPatternFill = this.init.selectedElement.attr("rect/fill");
        }
      }
      const isPattern = currentPatternFill && currentPatternFill.startsWith("url(#");
      // Extract current pattern information from visual element
      let currentPredefinedPatternId = null;
      let currentPatternConfig = null;
      if (this.init.selectedElement) {
        const visual = this.init.selectedElement.getVisual();
        if (visual) {
          currentPredefinedPatternId = visual.predefinedPatternId || null;
          currentPatternConfig = visual.patternConfig || null;
        }
      }
      // Extract pattern config from current fill to match against predefined patterns (fallback for old format)
      // Format: pat-stripes-{elementId}-{angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace}
      // Or old format: pat-stripes-{angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace}
      // Or predefined pattern instance: pat-{patternId}-bg-{backgroundColor}
      if (isPattern && !currentPatternConfig && !currentPredefinedPatternId) {
        const match = currentPatternFill.match(/url\(#([^)]+)\)/);
        if (match) {
          const patternId = match[1];
          // Check if it's a predefined pattern instance (format: pat-{patternId}-bg-{color})
          if (patternId.includes("-bg-")) {
            const predefinedId = patternId.split("-bg-")[0].replace("pat-", "");
            const predefinedPatterns = this.getPredefinedPatterns();
            const foundPattern = predefinedPatterns.find(p => p.id === predefinedId);
            if (foundPattern) {
              currentPredefinedPatternId = predefinedId;
              currentPatternConfig = foundPattern.config;
            }
          } else {
            // Try to parse as old format custom pattern
            const parts = patternId.replace("pat-stripes-", "").split("-");
            // Check if first part is element ID or if it's old format
            let configStartIndex = 0;
            // If we have 6+ parts, likely new format with element ID
            // If first part looks like element ID (contains letters/underscores), skip it
            if (parts.length >= 6 && !parts[0].match(/^[n-]?\d+$/)) {
              configStartIndex = 1;
            }
            if (parts.length >= 5 + configStartIndex) {
              // Handle normalized angle format (n45 for -45, or regular number)
              let angleDeg = 0;
              const angleStr = parts[configStartIndex];
              if (angleStr.startsWith("n")) {
                angleDeg = -parseInt(angleStr.substring(1)) || 0;
              } else {
                angleDeg = parseInt(angleStr) || 0;
              }
              currentPatternConfig = {
                angleDeg: angleDeg,
                gap: parseInt(parts[configStartIndex + 1]) || 10,
                stripeWidth: parseInt(parts[configStartIndex + 2]) || 3,
                stripeColor: "#" + parts[configStartIndex + 3],
                useUserSpace: parts[parts.length - 1] === "us"
              };
            }
          }
        }
      }
      let content = "<div id=\"patternsDiv\" style=\"width:200px; user-select: none;\">";
      // Add "No Pattern" option (solid color)
      const noPatternSelected = !isPattern ? "border: 2px solid #5A6F8F;" : "";
      content += `
      <a class='patternBtn' value="none" style="display: inline-block; margin: 2px; ${noPatternSelected}">
        <svg width="36" height="35" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_pattern)">
            <rect width="38" height="34" rx="4" transform="matrix(-1 0 0 1 38 0)" fill="#eee" fill-opacity="0.7" />
          </g>
          <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)" fill="#FFFFFF" />
          <defs>
            <filter id="filter0_b_pattern" x="-4" y="-4" width="46" height="42" filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
            </filter>
          </defs>
        </svg>
        <div style="font-size: 10px; text-align: center; margin-top: 2px;">No Pattern</div>
      </a>`;
      // Add predefined patterns
      const predefinedPatterns = this.getPredefinedPatterns();
      for (const patternDef of predefinedPatterns) {
        // Create preview pattern with white background for display
        // IMPORTANT: Use the exact same angle and config (only background differs)
        // This ensures preview matches the actual pattern direction
        const previewConfig = {
          angleDeg: patternDef.config.angleDeg,
          // Explicitly use same angle
          gap: patternDef.config.gap,
          stripeWidth: patternDef.config.stripeWidth,
          stripeColor: patternDef.config.stripeColor,
          background: "#FFFFFF",
          // Only background differs for preview
          useUserSpace: patternDef.config.useUserSpace
        };
        // Create preview using static template with white background
        this.ensurePredefinedPatterns(); // Ensure static templates exist
        const previewPatternUrl = this.createPatternInstance(patternDef.id, "#FFFFFF");
        // Store config as data attribute for retrieval
        const configJson = JSON.stringify(patternDef.config);
        // Check if this pattern matches the current pattern
        let isSelected = false;
        if (currentPredefinedPatternId === patternDef.id) {
          isSelected = true;
        } else if (currentPatternConfig) {
          // Fallback: compare configs for backward compatibility
          isSelected = currentPatternConfig.angleDeg === patternDef.config.angleDeg && currentPatternConfig.gap === patternDef.config.gap && currentPatternConfig.stripeWidth === patternDef.config.stripeWidth && currentPatternConfig.stripeColor === patternDef.config.stripeColor && currentPatternConfig.useUserSpace === patternDef.config.useUserSpace;
        }
        const selectedStyle = isSelected ? "border: 2px solid #5A6F8F;" : "";
        content += `
        <a class='patternBtn' data-config='${configJson.replace(/'/g, "&apos;")}' style="display: inline-block; margin: 2px; ${selectedStyle}">
          <svg width="36" height="35" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_pattern)">
              <rect width="38" height="34" rx="4" transform="matrix(-1 0 0 1 38 0)" fill="#eee" fill-opacity="0.7" />
            </g>
            <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)" fill="#FFFFFF" />
            <rect width="24" height="21" rx="2" x="7" y="6" fill="${previewPatternUrl}" />
            <defs>
              <filter id="filter0_b_pattern" x="-4" y="-4" width="46" height="42" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              </filter>
            </defs>
          </svg>
          <div style="font-size: 10px; text-align: center; margin-top: 2px;">${patternDef.name}</div>
        </a>`;
      }
      // Add custom pattern section
      content += "<br><div style=\"margin-top: 10px;\"><strong>Custom Pattern:</strong></div>";
      content += "<div style=\"margin: 5px 0;\">Angle: <input type=\"number\" id=\"patternAngle\" value=\"45\" min=\"-180\" max=\"180\" style=\"width: 60px;\"></div>";
      content += "<div style=\"margin: 5px 0;\">Gap: <input type=\"number\" id=\"patternGap\" value=\"10\" min=\"1\" max=\"50\" style=\"width: 60px;\"></div>";
      content += "<div style=\"margin: 5px 0;\">Stripe Width: <input type=\"number\" id=\"patternStripeWidth\" value=\"3\" min=\"1\" max=\"20\" style=\"width: 60px;\"></div>";
      content += "<div style=\"margin: 5px 0;\">Stripe Color: <input type=\"color\" id=\"patternStripeColor\" value=\"#5A6F8F\" style=\"width: 60px; height: 25px;\"></div>";
      content += `
      <a class='morePatternBtn' style="margin-left: 3px; display: inline-block; margin-top: 5px;">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.2168 6.32227H13.7676V8.71484H8.2168V15.0039H5.67383V8.71484H0.123047V6.32227H5.67383V0.511719H8.2168V6.32227Z" fill="#5A6F8F"/>
        </svg>
        <span style="margin-left: 5px;">Add Custom Pattern</span>
      </a>`;
      // Add saved custom patterns
      if (!this.init.customPatterns) {
        this.init.customPatterns = [];
      }
      for (const customPattern of this.init.customPatterns) {
        if (customPattern.config) {
          const previewConfig = {
            ...customPattern.config,
            background: "#FFFFFF"
          };
          const previewUrl = this.createPatternInstance(previewConfig, "#FFFFFF", "preview");
          const configJson = JSON.stringify(customPattern.config);
          content += `
          <a class='patternBtn' data-config='${configJson.replace(/'/g, "&apos;")}' style="display: inline-block; margin: 2px;">
            <svg width="36" height="35" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_b_pattern)">
                <rect width="38" height="34" rx="4" transform="matrix(-1 0 0 1 38 0)" fill="#eee" fill-opacity="0.7" />
              </g>
              <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)" fill="#FFFFFF" />
              <rect width="24" height="21" rx="2" x="7" y="6" fill="${previewUrl}" />
              <defs>
                <filter id="filter0_b_pattern" x="-4" y="-4" width="46" height="42" filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
                </filter>
              </defs>
            </svg>
            <div style="font-size: 10px; text-align: center; margin-top: 2px;">${customPattern.name}</div>
          </a>`;
        }
      }
      content += "</div>";
      const that = this;
      const popupEvents = {
        "click .patternBtn": function ($event) {
          const patternValue = $event.currentTarget.getAttribute("value");
          if (patternValue === "none") {
            // Remove pattern, restore to solid color
            that.changeFillPattern(null);
          } else {
            // Get pattern config from data attribute
            const configJson = $event.currentTarget.getAttribute("data-config");
            if (configJson) {
              try {
                const patternConfig = JSON.parse(configJson);
                that.changeFillPattern({
                  config: patternConfig
                });
              } catch (e) {
                console.warn("Failed to parse pattern config", e);
                // Fallback to URL-based approach
                that.changeFillPattern(patternValue);
              }
            } else {
              // Fallback to URL-based approach for custom patterns
              that.changeFillPattern(patternValue);
            }
          }
          // Close popup and reopen to update selected indicator
          const originalTarget = $event.currentTarget;
          setTimeout(() => {
            $(".joint-popup").remove();
            // Reopen popup with updated selection - use the pattern button element
            const button = document.querySelector(".elementShapePattern");
            if (button) {
              that.openPatternPopup({
                target: button
              });
            }
          }, 150);
        },
        "click .morePatternBtn": function ($event) {
          const angleDeg = parseInt($("#patternAngle")[0].value) || 45;
          const gap = parseInt($("#patternGap")[0].value) || 10;
          const stripeWidth = parseInt($("#patternStripeWidth")[0].value) || 3;
          const stripeColor = $("#patternStripeColor")[0].value || "#5A6F8F";
          const patternConfig = {
            angleDeg,
            gap,
            stripeWidth,
            stripeColor,
            background: null,
            useUserSpace: true
          };
          // Store config and apply pattern (will use current fill color as background)
          if (!that.init.customPatterns) {
            that.init.customPatterns = [];
          }
          const patternName = `Custom ${angleDeg}°`;
          that.init.customPatterns.push({
            patternUrl: null,
            name: patternName,
            config: patternConfig
          });
          that.changeFillPattern({
            config: patternConfig
          });
        }
      };
      (0, popupGenerator)($event.target, content, popupEvents).render();
      (0, stylePopup)(false, false, false);
      const ppup = $(".joint-popup")[0];
      $(".joint-popup").addClass("fillStrokePopup");
      ppup.style.lineHeight = "1.6";
    }
    addPattern(patternUrl, name) {
      const content = `
      <a class='patternBtn' value="${patternUrl}" style="display: inline-block; margin: 2px;">
        <svg width="36" height="35" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_pattern)">
            <rect width="38" height="34" rx="4" transform="matrix(-1 0 0 1 38 0)" fill="#eee" fill-opacity="0.7" />
          </g>
          <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)" fill="#FFFFFF" />
          <rect width="24" height="21" rx="2" transform="matrix(-1 0 0 1 31 6)" fill="${patternUrl}" />
          <defs>
            <filter id="filter0_b_pattern" x="-4" y="-4" width="46" height="42" filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
            </filter>
          </defs>
        </svg>
        <div style="font-size: 10px; text-align: center; margin-top: 2px;">${name}</div>
      </a>`;
      return content;
    }
    changeFillPattern(patternConfigOrUrl) {
      const elements = this.init.selection.collection.models.filter(en => OPCloudUtils.isInstanceOfDrawnEntity(en) || OPCloudUtils.isInstanceOfDrawnNote(en));
      if (elements.length === 0) {
        elements.push(this.selected);
      }
      this.init.opmModel.logForUndo("Fill Pattern Change");
      this.init.opmModel.setShouldLogForUndoRedo(false, "changeFillPattern");
      const paper = this.init?.paper;
      const svg = paper && paper.svg ? paper.svg : null;
      for (const element of elements) {
        const visual = element.getVisual();
        // ALWAYS remove ALL old patterns first - reset before applying new one
        let currentFill;
        if (element instanceof OpmObject) {
          currentFill = element.attr("rect/fill");
        } else if (element instanceof OpmProcess) {
          currentFill = element.attr("ellipse/fill");
        } else {
          currentFill = element.attr("rect/fill");
        }
        // Get current fill color (extract from pattern if needed, or use solid color)
        let currentFillColor;
        if (currentFill && currentFill.startsWith("url(#")) {
          // Current fill was a pattern - get background color from stored baseFillColor or extract from pattern
          const visual = element.getVisual();
          if (visual && visual.baseFillColor) {
            currentFillColor = visual.baseFillColor;
          } else {
            // Try to extract from pattern instance ID (format: pat-{patternId}-bg-{color} or pat-stripes-custom-...)
            const match = currentFill.match(/url\(#([^)]+)\)/);
            if (match) {
              const patternId = match[1];
              // Check if it's a predefined pattern instance (pat-{patternId}-bg-{color})
              if (patternId.includes("-bg-")) {
                const bgPart = patternId.split("-bg-")[1];
                currentFillColor = bgPart ? "#" + bgPart : "#FFFFFF";
              } else if (patternId.startsWith("pat-stripes-custom-")) {
                // Custom pattern - extract background from ID
                const parts = patternId.replace("pat-stripes-custom-", "").split("-");
                if (parts.length >= 6) {
                  const bgPart = parts[5]; // background is at index 5 (after elementId and config)
                  currentFillColor = bgPart ? "#" + bgPart : "#FFFFFF";
                } else {
                  currentFillColor = "#FFFFFF";
                }
              } else {
                currentFillColor = "#FFFFFF";
              }
            } else {
              currentFillColor = "#FFFFFF";
            }
          }
        } else {
          // Current fill is a solid color
          currentFillColor = currentFill || "#FFFFFF";
        }
        if (patternConfigOrUrl === null) {
          // Removing pattern - restore to solid color
          if (visual) {
            visual.patternConfig = null;
            visual.predefinedPatternId = null;
            visual.isCustomPattern = false;
          }
          if (element instanceof OpmObject) {
            element.attr({
              rect: {
                fill: currentFillColor
              }
            });
            element.updateDuplicationMarkFillColor(currentFillColor);
          } else if (element instanceof OpmState) {
            element.setOriginalColor(currentFillColor);
            element.attr({
              rect: {
                fill: currentFillColor
              }
            });
            element.attr("rect/fill", currentFillColor);
            element.attr(".inner/fill", currentFillColor);
            element.attr(".outer/fill", currentFillColor);
            element.setOriginalColor(currentFillColor);
            element.updateDuplicationMarkFillColor(currentFillColor);
          } else if (element instanceof OpmProcess) {
            element.attr({
              ellipse: {
                fill: currentFillColor
              }
            });
            element.updateDuplicationMarkFillColor(currentFillColor);
            element.updateView(element.getVisual());
          } else if (element instanceof Note) {
            element.attr({
              ".notes": {
                fill: currentFillColor
              }
            });
            element.attr({
              ".stickyPart": {
                fill: currentFillColor
              }
            });
          }
        } else {
          // Applying a pattern - ALWAYS create fresh pattern
          let patternConfig;
          // If patternConfigOrUrl is a config object, use it directly
          if (typeof patternConfigOrUrl === "object" && patternConfigOrUrl.config) {
            patternConfig = patternConfigOrUrl.config; // Don't include background - it comes from fill color
          } else {
            // Should not happen with new system, but handle for backward compatibility
            console.warn("changeFillPattern: unexpected patternConfigOrUrl type", patternConfigOrUrl);
            return;
          }
          if (patternConfig) {
            // Check if this is a predefined pattern
            const predefinedPatterns = this.getPredefinedPatterns();
            const predefinedPattern = predefinedPatterns.find(p => p.config.angleDeg === patternConfig.angleDeg && p.config.gap === patternConfig.gap && p.config.stripeWidth === patternConfig.stripeWidth && p.config.stripeColor === patternConfig.stripeColor && p.config.useUserSpace === patternConfig.useUserSpace);
            if (visual) {
              if (predefinedPattern) {
                // Store only the predefined pattern ID (not full config)
                visual.predefinedPatternId = predefinedPattern.id;
                visual.patternConfig = null; // Clear custom config
                visual.isCustomPattern = false;
              } else {
                // Store full config for custom pattern (without background)
                const configWithoutBg = {
                  ...patternConfig
                };
                delete configWithoutBg.background;
                visual.patternConfig = configWithoutBg;
                visual.predefinedPatternId = null; // Clear predefined ID
                visual.isCustomPattern = true;
              }
              // Store the background color separately
              visual.baseFillColor = currentFillColor;
            }
            // Create pattern instance with current fill color as background
            const elementId = element.id || `elem-${Date.now()}-${Math.random()}`;
            let newPatternUrl;
            if (predefinedPattern) {
              // Use predefined pattern template
              newPatternUrl = this.createPatternInstance(predefinedPattern.id, currentFillColor);
            } else {
              // Create custom pattern
              newPatternUrl = this.createPatternInstance(patternConfig, currentFillColor, elementId);
            }
            // Only apply pattern if it was created successfully
            if (!newPatternUrl) {
              console.warn("Failed to create pattern, skipping application");
              return;
            }
            // Apply the new pattern (fill becomes the pattern URL, but background color is preserved)
            if (element instanceof OpmObject) {
              element.attr({
                rect: {
                  fill: newPatternUrl
                }
              });
              element.updateDuplicationMarkFillColor(currentFillColor);
              // Update visual element fill so it's saved
              if (visual) {
                visual.fill = newPatternUrl;
              }
            } else if (element instanceof OpmState) {
              element.setOriginalColor(currentFillColor);
              element.attr({
                rect: {
                  fill: newPatternUrl
                }
              });
              element.attr("rect/fill", newPatternUrl);
              element.attr(".inner/fill", newPatternUrl);
              element.attr(".outer/fill", newPatternUrl);
              // Update visual element fill so it's saved
              if (visual) {
                visual.fill = newPatternUrl;
              }
              element.setOriginalColor(currentFillColor);
              element.updateDuplicationMarkFillColor(currentFillColor);
            } else if (element instanceof OpmProcess) {
              element.attr({
                ellipse: {
                  fill: newPatternUrl
                }
              });
              element.updateDuplicationMarkFillColor(currentFillColor);
              // Update visual element fill so it's saved
              if (visual) {
                visual.fill = newPatternUrl;
              }
              element.updateView(element.getVisual());
            } else if (element instanceof Note) {
              element.attr({
                ".notes": {
                  fill: newPatternUrl
                }
              });
              element.attr({
                ".stickyPart": {
                  fill: newPatternUrl
                }
              });
            }
          }
        }
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "changeFillPattern");
    }
    ensurePatternExists(patternUrl) {
      // Extract pattern ID from URL like "url(#pat-stripes-45-10-3-5A6F8F-FFFFFF-us)"
      const match = patternUrl.match(/url\(#([^)]+)\)/);
      if (!match) {
        return;
      }
      const patternId = match[1];
      const paper = this.init?.paper;
      if (!paper || !paper.svg) {
        return;
      }
      const svg = paper.svg;
      const existingPattern = svg.querySelector(`#${patternId}`);
      if (existingPattern) {
        return; // Pattern already exists
      }
      // Try to parse pattern config from ID (format: pat-stripes-{angleDeg}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace})
      const parts = patternId.replace("pat-stripes-", "").split("-");
      if (parts.length >= 6) {
        const angleDeg = parseInt(parts[0]) || 45;
        const gap = parseInt(parts[1]) || 10;
        const stripeWidth = parseInt(parts[2]) || 3;
        const stripeColor = "#" + parts[3];
        const background = parts[4] === "none" ? null : "#" + parts[4];
        const useUserSpace = parts[5] === "us";
        const patternConfig = {
          angleDeg,
          gap,
          stripeWidth,
          stripeColor,
          background,
          useUserSpace
        };
        // This is a legacy method - patterns should be created via createPatternInstance
        // For now, just ensure the pattern exists (it should be created elsewhere)
        this.ensurePredefinedPatterns();
      } else {
        // If we can't parse, ensure predefined patterns exist (legacy fallback)
        this.ensurePredefinedPatterns();
        // If the created pattern has a different ID, we need to rename it
        // For now, we'll just create it and let the element use whatever pattern was created
      }
    }
    toggleExtensionsDiv() {
      const value = !this.showExtensionsDiv;
      if (value) {
        this.closeAllSubToolBars();
      }
      this.showExtensionsDiv = value;
    }
    toggleTemplatesDiv() {
      this.showTemplatesDiv = !this.showTemplatesDiv;
    }
    shouldShowTextAnchoring() {
      return this.selected && (this.selected.constructor.name.includes("Note") || this.selected instanceof OpmEntity);
    }
    // returns the current port. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcPort(type) {
      const user_port = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? type === "mysql" ? this.init.oplService.settings.connection[type].ws_port : this.init.oplService.settings.connection[type].port : undefined;
      const organization_port = this.init.oplService.orgSettings.connection && this.init.oplService.orgSettings.connection[type] !== undefined ? type === "mysql" ? this.init.oplService.orgSettings.connection[type].ws_port : this.init.oplService.orgSettings.connection[type].port : undefined;
      const default_port = type === "ros" ? defaultRosConnectionSettings.port : type === "mqtt" ? defaultMqttConnectionSettings.port : type === "mysql" ? defaultMySQLConnectionSettings.ws_port : defaultPythonConnectionSettings.port;
      if (user_port !== undefined) {
        return user_port;
      } else if (organization_port !== undefined) {
        return organization_port;
      } else {
        return default_port;
      }
    }
    // returns the current server. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcServer(type) {
      const user_server = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? type === "mysql" ? this.init.oplService.settings.connection[type].ws_hostname : this.init.oplService.settings.connection[type].server : undefined;
      const organization_server = this.init.oplService.orgSettings.connection && this.init.oplService.orgSettings.connection[type] !== undefined ? type === "mysql" ? this.init.oplService.orgSettings.connection[type].ws_hostname : this.init.oplService.orgSettings.connection[type].server : undefined;
      const default_server = type === "ros" ? defaultRosConnectionSettings.server : type === "mqtt" ? defaultMqttConnectionSettings.server : type === "mysql" ? defaultMySQLConnectionSettings.ws_hostname : defaultPythonConnectionSettings.server;
      if (user_server !== undefined) {
        return user_server;
      } else if (organization_server !== undefined) {
        return organization_server;
      } else {
        return default_server;
      }
    }
    // returns the current mysql hostname. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcMySQLPort(type) {
      const user_port = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].port : undefined;
      const default_port = defaultMySQLConnectionSettings.port;
      if (user_port !== undefined) {
        return user_port;
      } else {
        return default_port;
      }
    }
    // returns the current mysql port. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcMySQLHostname(type) {
      const user_hostname = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].hostname : undefined;
      const default_hostname = defaultMySQLConnectionSettings.hostname;
      if (user_hostname !== undefined) {
        return user_hostname;
      } else {
        return default_hostname;
      }
    }
    // returns the current mysql username. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcMySQLUsername(type) {
      const user_username = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].username : undefined;
      const default_username = defaultMySQLConnectionSettings.username;
      if (user_username !== undefined) {
        return user_username;
      } else {
        return default_username;
      }
    }
    // returns the current mysql password. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcMySQLPassword(type) {
      const user_password = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].password : undefined;
      const default_password = defaultMySQLConnectionSettings.password;
      if (user_password !== undefined) {
        return user_password;
      } else {
        return default_password;
      }
    }
    // returns the current mysql hostname. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcSchema(type) {
      const user_schema = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].schema : undefined;
      const default_schema = defaultMySQLConnectionSettings.schema;
      if (user_schema !== undefined) {
        return user_schema;
      } else {
        return default_schema;
      }
    }
    // returns the current mysql hostname. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcWSPort(type) {
      const user_WS_port = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].ws_port : undefined;
      const default_WS_port = defaultMySQLConnectionSettings.ws_port;
      if (user_WS_port !== undefined) {
        return user_WS_port;
      } else {
        return default_WS_port;
      }
    }
    // returns the current mysql port. if the user defined its own, return it. otherwise return the organization (or default if it does not exist)
    calcWSHostname(type) {
      const user_WS_hostname = this.init.oplService.settings.connection && this.init.oplService.allow_users && this.init.oplService.settings.connection[type] !== undefined ? this.init.oplService.settings.connection[type].ws_hostname : undefined;
      const default_WS_hostname = defaultMySQLConnectionSettings.ws_hostname;
      if (user_WS_hostname !== undefined) {
        return user_WS_hostname;
      } else {
        return default_WS_hostname;
      }
    }
    shouldShowWaitingProcessIcon() {
      if (!this.isProcess) {
        return false;
      }
      // if is not the waiting process itself
      const condition1 = !this.selected.getVisual().logicalElement.getIsWaitingProcess();
      // if has no direct waiting process
      // const condition2 = !(<any>this.selected.getVisual().logicalElement).getWaitingProcess();
      const condition2 = !this.selected.getVisual().getLinks().inGoing.find(l => l.type === linkType.Invocation && l.source.logicalElement.text.includes("Waiting"));
      // if has self-Invocation
      const condition3 = this.selected.getVisual().getAllLinks().inGoing.find(l => l.source === l.target && l.type === linkType.Invocation);
      // has waiting process but not in this opd.
      const hasWaitingProcess = this.selected.getVisual().logicalElement.getWaitingProcess();
      const condition4 = hasWaitingProcess && !this.init.opmModel.currentOpd.visualElements.find(v => v.logicalElement.lid === hasWaitingProcess);
      const condition5 = !this.selected.getVisual().children.find(ch => OPCloudUtils.isInstanceOfVisualProcess(ch) && ch.logicalElement.getIsWaitingProcess());
      const condition6 = !this.selected.getVisual().fatherObject;
      if (condition5 && condition1 && condition2 && condition3 && condition6) {
        return true;
      }
      if (condition5 && condition6 && condition1 && (condition3 && condition2 || condition4)) {
        return true;
      }
      return false;
    }
    waitingProcessAction() {
      const drawnProcess = this.selected;
      let visualProcess = drawnProcess.getVisual();
      if (visualProcess.fatherObject) {
        visualProcess = visualProcess.fatherObject;
      }
      this.init.opmModel.logForUndo("Added Waiting Process");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Adding Waiting Process");
      const ret = this.init.opmModel.addWaitingProcess(visualProcess);
      if (ret.isNewlyCreated) {
        this.init.graphService.updateEntity(ret.waitingProcess);
        const isInzoomed = visualProcess === visualProcess.getRefineeInzoom();
        if (!isInzoomed) {
          const sourcePortId = drawnProcess.addCustomPort({
            x: visualProcess.width * 0.2,
            y: visualProcess.height
          });
          const targetPortId = drawnProcess.addCustomPort({
            x: visualProcess.width * 0.8,
            y: visualProcess.height
          });
          ret.links[0].sourceVisualElementPort = sourcePortId;
          ret.links[1].targetVisualElementPort = targetPortId;
        } else {
          const targetPortId = drawnProcess.addCustomPort({
            x: visualProcess.width * 0.8,
            y: visualProcess.height * 0.7
          });
          ret.links[1].targetVisualElementPort = targetPortId;
        }
        if (ret.waitingProcess.fatherObject && this.init.graphService.graph.getCell(ret.waitingProcess.fatherObject.id)) {
          this.init.graphService.graph.getCell(ret.waitingProcess.fatherObject.id).embed(this.init.graphService.graph.getCell(ret.waitingProcess.id));
        }
        this.init.graphService.updateLinksView(ret.links);
        if (ret.removed) {
          this.init.graphService.graph.getCell(ret.removed.id).remove();
        }
        drawnProcess.updateSizePositionToFitEmbeded();
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "Added Waiting Process");
    }
    shouldShowCancelWaitingProcessIcon() {
      if (!this.isProcess) {
        return false;
      }
      // if is not the waiting process itself
      const condition1 = !this.selected.getVisual().logicalElement.getIsWaitingProcess();
      // if has direct waiting process in this opd
      const hasWaitingProcess = this.selected.getVisual().logicalElement.getWaitingProcess();
      const condition2 = hasWaitingProcess && this.init.opmModel.currentOpd.visualElements.find(v => v.logicalElement.lid === hasWaitingProcess);
      // if has no self-Invocation
      const condition3 = !this.selected.getVisual().getAllLinks().inGoing.find(l => l.source === l.target && l.type === linkType.Invocation);
      if (condition1 && condition2 && condition3) {
        return true;
      }
      if (this.selected.getVisual().children.find(ch => OPCloudUtils.isInstanceOfVisualProcess(ch) && ch.logicalElement.getIsWaitingProcess())) {
        return true;
      }
      return false;
    }
    removeWaitingProcessAction() {
      this.init.opmModel.logForUndo("Removed Waiting Process");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Removed Waiting Process");
      const drawnProcess = this.selected;
      let visualProcess = drawnProcess.getVisual();
      if (visualProcess.fatherObject) {
        visualProcess = visualProcess.fatherObject;
      }
      const ret = this.init.opmModel.removeWaitingProcess(visualProcess);
      if (this.init.graph.getCell(ret.removed.id)) {
        this.init.graph.getCell(ret.removed.id).remove();
      }
      if (visualProcess.getRefineeInzoom() === visualProcess) {
        const port = this.init.graph.getCell(visualProcess.id).addCustomPort({
          x: visualProcess.width * 0.9,
          y: visualProcess.height * 0.8
        });
        ret.link.created[0].targetVisualElementPort = port;
      }
      this.init.graphService.updateLinksView(ret.link.created);
      this.init.opmModel.setShouldLogForUndoRedo(true, "Removed Waiting Process");
    }
    quitConfigurationView() {
      this.init.opmModel.setCurrentConfiguration(undefined);
      this.init.graphService.renderGraph(this.init.opmModel.currentOpd);
    }
    shouldCurrentBeColored() {
      return !this.getStateType(this.selected).includes("Current");
    }
    shouldShowSetRangeIcon() {
      return this.isObject || this.isState;
    }
    toggleValueTypeObject() {
      this.selected.toggleValueTypeObject(this.init);
    }
    setRange() {
      this.selected.setRangePopup(this.init);
    }
    removeRange() {
      this.selected.removeRange(this.init);
    }
    shouldShowInDiagramInzoom() {
      return this.isObject && this.selected.getVisual() && this.selected.attributes.type !== "opm.Ellipsis" && !this.isComputational && !this.selected.getVisual().getRefineeInzoom();
    }
    shouldShowSetRange() {
      if (this.selected instanceof OpmObject) {
        const visual = this.selected.getVisual();
        // const belongsToStereotype = (<OpmLogicalObject>visual.logicalElement).getBelongsToStereotyped();
        return visual.isComputational();
      }
      return false;
    }
    shouldShowRemoveRange() {
      if (this.selected instanceof OpmObject) {
        const visual = this.selected.getVisual();
        const belongsToStereotype = visual.logicalElement.getBelongsToStereotyped();
        return visual.hasRange() && !belongsToStereotype;
      }
      return false;
    }
    shouldShowResetValueByRange() {
      if (this.selected instanceof OpmObject) {
        const visual = this.selected.getVisual();
        return visual.hasRange();
      }
      return false;
    }
    shouldShowToggleValueObject() {
      if (this.selected instanceof OpmObject) {
        const visual = this.selected.getVisual();
        return visual.hasRange();
      }
      return false;
    }
    shouldChangeStateCondition() {
      if (this.selected instanceof OpmState) {
        const visual = this.selected.getVisual();
        return visual.shouldChangeCondition();
      }
      return false;
    }
    shouldShowStatesStates() {
      return this.selected && this.selected.attributes.type === "opm.State";
    }
    shouldShowAddURL() {
      return (this.isProcess || this.isObject || this.isState) && this.selected.attributes.type !== "opm.Ellipsis";
    }
    shouldShowDigitalTwin() {
      return this.isObject && this.selected.attributes.type !== "opm.Ellipsis" && this.selected.attr("value/value") === "None";
    }
    openCreateViewDialog() {
      this.init.dialogService.openDialog(CreateViewDialog, 230, 426, {});
    }
    shouldShowCreateViewIcon() {
      return this.init.selection.collection.models.filter(cell => OPCloudUtils.isInstanceOfDrawnThing(cell)).length > 0;
    }
    shouldShowSimulateElement() {
      return (this.isObject || this.isProcess) && this.selected.attributes.type !== "opm.Ellipsis" && this.isComputational;
    }
    shouldShowDestating() {
      return this.isObject && this.selected.attributes.type !== "opm.Ellipsis" && this.selected.hasStates() && this.selected.attr("value/value") === "None";
    }
    shouldShowStateArrangementGroupIcon() {
      return this.isObject && this.selected.hasStates() && this.selected.attributes.type !== "opm.Ellipsis";
    }
    shouldShowAlias() {
      return this.isObject;
    }
    shouldShowEditUnits() {
      return this.editUnitsHandle != undefined;
    }
    shouldShowAutoFormatting() {
      return this.isProcess || this.isObject || this.isState;
    }
    shouldShowAutoFormatOff() {
      return !this.isAutoFormat;
    }
    shouldShowAutoFormatOn() {
      return this.isAutoFormat;
    }
    toggleRunByConfigurations() {
      this.runByConfigurations = !this.runByConfigurations;
    }
    resetValueToDefaultByRange() {
      this.selected.setValueAsDefault();
    }
    tokenRatioChange() {
      const val = document.getElementById("simulationSlider").value;
      this.simulationSliderValue = Number(val);
      this.init.opmModel.setTokenRuntimeRatio(Number(val));
    }
    getRatio() {
      return Math.round(this.init.opmModel.getTokenRuntimeRatio() * 100);
    }
    showGIF($event, handlerGif = "") {
      return OPCloudUtils.showGIF($event, handlerGif);
    }
    mouseLeave() {
      OPCloudUtils.removeAllExplainationsDivs();
    }
    isExample() {
      return this._isExample;
    }
    isTemplate() {
      return this._isTemplate;
    }
    isStereotype() {
      return this._isStereotype;
    }
    setIsExample(val) {
      this._isExample = val;
    }
    setIsStereotype(val) {
      this._isStereotype = val;
    }
    setIsTemplate(val) {
      this._isTemplate = val;
    }
    toggleChat() {
      this.init.toggleChat();
      this.updateUserShouldShowChatPanel();
    }
    updateUserShouldShowChatPanel() {
      const settings = {
        chatEnabled: this.init.showChatPanel
      };
      this.init.oplService.updateUserSettings(settings);
      this.init.updateDB(settings);
    }
    openImportTemplates() {
      this.init.setSelectedElementToNull();
      this.showTemplatesDiv = false;
      // let templateType;
      // if (type === 'org')
      //   templateType = TemplateType.ORG;
      // else if (type === 'system')
      //   templateType = TemplateType.SYS;
      // else
      //   templateType = TemplateType.PERSONAL;
      // const dialog = this.dialog.open(LoadModelDialogComponent, {
      //   height: Math.round(window.innerHeight * 0.9) + 'px',
      //   width: Math.round(window.innerWidth * 0.75) + 'px',
      //   data: {
      //     path: '', showVersions: false, mode: StorageMode.LOAD,
      //     name: '', description: '', showArchivedModels: false,
      //     archiveMode: false,
      //     screenType: ScreenType.TEMPLATES,
      //     templateType: templateType,
      //     isImportMode: true
      //   },
      // });
      const dialog = this.dialog.open(TemplatesComponent, {
        width: Math.round(window.innerWidth * 0.75) + "px",
        data: {
          mode: "import"
        }
      });
      dialog.afterClosed().subscribe(res => {
        if (res?.importedTemplate) {
          this.loadTemplateToScreen(res.importedTemplate);
          this.init.criticalChanges_.next(true);
        }
      });
    }
    loadTemplateToScreen(template) {
      const model = this.init.opmModel;
      const currentIds = this.init.graph.getCells().map(v => v.id);
      const bbox = this.init.graph.getCellsBBox(this.init.graph.getCells());
      let currentLinks = this.init.graph.getCells().filter(c => c.isLink());
      model.logForUndo("Template Import");
      model.setShouldLogForUndoRedo(false, "templateImport");
      const ret = model.mergeOneOpdModel(template);
      if (ret.success === false) {
        (0, validationAlert)(ret.message, 5000, "Error");
        return;
      }
      this.init.treeViewService.init(model);
      this.init.graphService.renderGraph(model.currentOpd, this.init);
      const newCells = this.init.graph.getCells().filter(cell => !currentIds.includes(cell.id));
      const newEntitiesCells = newCells.filter(cell => OPCloudUtils.isInstanceOfDrawnEntity(cell) || OPCloudUtils.isInstanceOfDrawnTriangle(cell));
      currentLinks = currentLinks.map(l => this.init.graph.getCell(l.id));
      for (let i = newEntitiesCells.length - 1; i >= 0; i--) {
        // splice out the old triangles (a solution to the problem that triangles changes their ids every render).
        if (OPCloudUtils.isInstanceOfDrawnTriangle(newEntitiesCells[i]) && currentLinks.find(l => l?.source().id === newEntitiesCells[i].id)) {
          newEntitiesCells.splice(i, 1);
        }
      }
      const newCellsBBox = this.init.graph.getCellsBBox(newEntitiesCells);
      let delta = 0;
      if (bbox) {
        delta = bbox.x + bbox.width - newCellsBBox.x;
      }
      this.init.treeViewService.init(model);
      this.init.selection.collection.reset(newEntitiesCells);
      this.init.selection.translateSelectedElements(delta > 0 ? delta + 100 : delta * 2 + 100, 0);
      this.init.selection.collection.reset(newEntitiesCells);
      const newItemsCenter = this.init.graph.getCellsBBox(newEntitiesCells).center();
      this.init.selection.$el.show();
      $(".box").hide();
      model.setShouldLogForUndoRedo(true, "templateImport");
      this.init.paperScroller.transitionToPoint(newItemsCenter);
    }
    shouldShowImportTemplate() {
      return this.templatesSupported && !this.init.opmModel.currentOpd.isStereotypeOpd();
    }
    shrinkToTextSize() {
      if (!this.selected || this.selected.getEmbeddedCells().length > 0) {
        return;
      }
      this.init.opmModel.logForUndo(this.selected.attr("text/textWrap/text") + " Shrink To Text Size");
      this.init.opmModel.setShouldLogForUndoRedo(false, "shrinkToTextSize");
      this.init.graph.startBatch("minimalShrink");
      const bbox = this.selected.findView(this.init.paper)?.$el?.find("text")[0]?.getBBox();
      if (bbox) {
        this.selected.set("size", {
          width: bbox.width + 15,
          height: bbox.height + 15
        });
      }
      this.init.graph.stopBatch("minimalShrink");
      Arc.redrawAllArcs(this.selected, this.init, true);
      this.init.opmModel.setShouldLogForUndoRedo(true, "shrinkToTextSize");
    }
    selectConnectedThings() {
      if (!this.selected?.getVisual()) {
        return;
      }
      const ins = this.init.graph.getConnectedLinks(this.selected, {
        inbound: true
      });
      const outs = this.init.graph.getConnectedLinks(this.selected, {
        outbound: true
      });
      let toSelect = [];
      const visLinks = this.selected.getVisual().getLinks();
      // visLinks.inGoing.forEach(link => toSelect.push(this.init.graph.getCell(link.source?.id)));
      visLinks.outGoing.forEach(link => toSelect.push(this.init.graph.getCell(link.target?.id)));
      // for (const inL of ins)
      //   if (OPCloudUtils.isInstanceOfDrawnTriangle(inL.getSourceElement()))
      //     toSelect.push(inL.getSourceElement());
      for (const outL of outs) {
        if (OPCloudUtils.isInstanceOfDrawnTriangle(outL.getTargetElement())) {
          toSelect.push(outL.getTargetElement());
        }
      }
      for (const cell of toSelect) {
        if (OPCloudUtils.isInstanceOfDrawnState(cell)) {
          toSelect.push(cell.getParentCell());
        }
      }
      toSelect = toSelect.filter(cell => !!cell && !OPCloudUtils.isInstanceOfDrawnSemiFoldedFundamental(cell));
      this.init.selection.collection.reset(toSelect);
    }
    shouldShowShrinkToTextSize() {
      return (this.isProcess || this.isObject || this.isState && this.init.selectedElement.attributes.type !== "opm.Ellipsis") && this.selected.getEmbeddedCells().length === 0;
    }
    toggleViewsDiv() {
      this.isViewsDivOpen = !this.isViewsDivOpen;
      if (this.isViewsDivOpen) {
        this.closeAllSubToolBars();
        this.isViewsDivOpen = true;
      }
    }
    createUnfoldedTreeView() {
      let selected = this.selected;
      if (this.init.selection.collection.length > 1) {
        (0, validationAlert)("Creating a full thing tree view can be done only for one selected thing at a time.", 5000, "error");
        return;
      }
      if (!selected && this.init.selection.collection.models.find(m => OPCloudUtils.isInstanceOfDrawnThing(m))) {
        selected = this.init.selection.collection.models[0];
      }
      if (!selected) {
        return;
      }
      this.init.opmModel.logForUndo("Create Unfolded Tree View");
      this.init.opmModel.setShouldLogForUndoRedo(false, "createUnfoldedTreeView");
      const ret = this.init.opmModel.createStructuralViewOpd(selected.getVisual().logicalElement, "horizontal");
      if (!ret) {
        (0, validationAlert)("There is an infinite structural loop. Please fix the structure and try again.", 5000, "error");
        this.init.opmModel.setShouldLogForUndoRedo(true, "createUnfoldedTreeView");
        return;
      }
      this.init.treeViewService.init(this.init.opmModel);
      this.init.getGraphService().renderGraph(ret, this.init);
      this.init.getGraphService().updateGraphAfterUnfoldedTreeViewCreation(this.init);
      this.init.opmModel.setShouldLogForUndoRedo(true, "createUnfoldedTreeView");
    }
    removeSemifolding() {
      const visual = this.selected?.getVisual();
      if (!visual) {
        return;
      }
      this.init.opmModel.logForUndo("Remove semi-folding");
      this.init.opmModel.setShouldLogForUndoRedo(false, "removeSemifolding");
      this.init.opmModel.removeSemifolding(visual);
      this.init.getGraphService().updateGraphAfterRemoveSemifolding(this.init, visual);
      this.selected = this.init.graph.getCell(visual.id);
      this.resetElementTextPosition(this.selected);
      this.init.opmModel.setShouldLogForUndoRedo(true, "removeSemifolding");
    }
    toggleAutoResizing() {
      const cell = this.init.selection?.collection?.models?.[0];
      if (!cell || !OPCloudUtils.isInstanceOfDrawnEntity(cell)) {
        return;
      }
      if (this.init.isAutomaticResizingForcedForCell(cell)) {
        return;
      }
      const globalAuto = this.init.defaultThingsAutomaticResize;
      const effective = this.init.getAutomaticResizingForCell(cell);
      const newEffective = !effective;
      const attr = InitRappidService.thingAutoResizeOverrideAttr;
      if (newEffective === globalAuto) {
        cell.unset(attr);
      } else {
        cell.set(attr, newEffective);
      }
      if (typeof cell.changeSizeHandle === "function") {
        cell.changeSizeHandle(this.init);
      }
      this.onSelection();
    }
    toggleOpmRequirementsDiv() {
      this.showOpmRequirementsDiv = !this.showOpmRequirementsDiv;
      if (this.showOpmRequirementsDiv) {
        this.closeAllSubToolBars();
        this.showOpmRequirementsDiv = true;
      }
    }
    toggleConnectionsDiv() {
      this.showConnectionsDiv = !this.showConnectionsDiv;
      if (this.showConnectionsDiv) {
        this.closeAllSubToolBars();
        this.showConnectionsDiv = true;
      }
    }
    addRequirement() {
      this.selected.addRequirement(this.init);
    }
    toggleRequirementsSet() {
      const visual = this.selected.getVisual();
      const logical = visual.logicalElement;
      if (logical.hasRequirements()) {
        this.selected.toggleAttributesSet(this.init, true);
        const reqs = logical.getAllRequirements();
        this.fixViewOfRequirementObjects(reqs.map(r => r.getRequirementObject()).filter(r => !!r));
      } else if (logical.isSatisfiedRequirementSetObject()) {
        const exhLink = visual.getLinks().inGoing.find(l => l.type === linkType.Exhibition && l.source.logicalElement.hasRequirements());
        if (exhLink) {
          this.init.graph.getCell(exhLink.source.id)?.toggleAttributesSet(this.init, false);
          this.fixViewOfRequirementObjects(visual.getLinks().outGoing.map(l => l.target));
        }
      } else {
        this.selected.hideSingleRequirement(this.init);
      }
    }
    connectRequirementsStereotype() {
      const logical = this.selected.getVisual().logicalElement;
      const ret = this.init.opmModel.addRequirementStereotypeToRequirement(logical);
      if (ret.success) {
        this.init.treeViewService.init(this.init.opmModel);
        this.selected.updateView(this.selected.getVisual());
      }
      this.showOpmRequirementsDiv = false;
      this.init.setSelectedElementToNull();
      this.init.selection.collection.reset([]);
    }
    removeRequirementsStereotype() {
      this.removeStereotypeAction();
      this.showOpmRequirementsDiv = false;
    }
    shouldShowConnectRequirementsStereotype() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const logical = this.selected.getVisual().logicalElement;
      if (logical.getStereotype()) {
        return false;
      }
      if (logical.isSatisfiedRequirementObject()) {
        return true;
      }
      return false;
    }
    shouldShowRemoveRequirementsStereotype() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const logical = this.selected.getVisual().logicalElement;
      if (logical.getStereotype() && logical.isSatisfiedRequirementObject()) {
        return true;
      }
      return false;
    }
    shouldShowToggleRequirements() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const logical = this.selected.getVisual().logicalElement;
      return logical.hasRequirements() || logical.isSatisfiedRequirementObject() || logical.isSatisfiedRequirementSetObject();
    }
    shouldShowAddRequirement() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const logical = this.selected.getVisual().logicalElement;
      return !logical.isSatisfiedRequirementObject();
    }
    getToggleRequirementTooltip() {
      const logical = this.selected.getVisual().logicalElement;
      if (logical.hasRequirements() || logical.isSatisfiedRequirementSetObject()) {
        return "Toggle Satisfied Requirement Set";
      } else {
        return "Toggle Requirement";
      }
    }
    shouldShowRemoveRequirement() {
      if (!this.isProcess && !this.isObject) {
        return false;
      }
      const logical = this.selected.getVisual().logicalElement;
      return !!logical.isSatisfiedRequirementObject() || !!logical.isSatisfiedRequirementSetObject();
    }
    getRemoveRequirementsTooltip() {
      const logical = this.selected.getVisual().logicalElement;
      if (logical.isSatisfiedRequirementObject()) {
        return "Remove Requirement";
      }
      return "Remove All Requirements";
    }
    removeRequirement() {
      const logical = this.selected.getVisual().logicalElement;
      this.dialog.open(ConfirmDialogDialogComponent, {
        data: {
          message: "Are you sure you want to remove this requirement/s from all the model?",
          closeName: "Cancel"
        }
      }).afterClosed().toPromise().then(res => {
        if (res !== "OK") {
          return;
        }
        logical.opmModel.logForUndo("Remove requirement/s from the model");
        logical.opmModel.setShouldLogForUndoRedo(false, "removeRequirement");
        if (logical.isSatisfiedRequirementSetObject() && !logical.getBelongsToStereotyped()) {
          this.init.opmModel.removeAllRequirements(logical);
        } else {
          const vis = this.init.opmModel.getVisualElementById(this.selected?.id);
          if (vis.getRefineeUnfold()) {
            (0, validationAlert)("Cannot Remove Unfolded Requirement. First you should remove the unfolded OPD.");
            logical.opmModel.setShouldLogForUndoRedo(true, "removeRequirement");
            return;
          } else if (logical.getBelongsToStereotyped()) {
            (0, validationAlert)("Cannot Remove Requirement That Came From A Stereotype.");
            logical.opmModel.setShouldLogForUndoRedo(true, "removeRequirement");
            return;
          }
          const owner = this.init.opmModel.getOwnerOfRequirementByRequirementLID(vis.logicalElement.lid);
          if (owner) {
            owner.removeSingleRequirement(vis.logicalElement.lid);
          }
        }
        logical.opmModel.setShouldLogForUndoRedo(true, "removeRequirement");
        this.init.setSelectedElementToNull();
        this.init.getGraphService().renderGraph(this.init.opmModel.currentOpd, this.init);
        this.init.treeViewService.init(this.init.opmModel);
      });
    }
    openCreateReqruiementsViewDialog() {
      this.init.dialogService.openDialog(CreateRequirementViewDialog, 700, 500, {});
    }
    toggleAllOpdRequirements() {
      this.init.opmModel.toggleAllOpdRequirements(this.init.opmModel.currentOpd);
      this.init.getGraphService().renderGraph(this.init.opmModel.currentOpd, this.init);
      this.fixViewOfRequirementObjects(this.init.opmModel.currentOpd.visualElements);
    }
    fixViewOfRequirementObjects(visuals) {
      this.init.getGraphService().fixViewOfRequirementObjects(this.init, visuals);
    }
    openThingBackgroundImageDialog() {
      this.init.dialogService.openDialog(BackgroundPhotoDialogComponent, 550, 550, {
        entity: this.selected
      });
    }
    toggleThingBackgroundDiv() {
      this.showThingBackgroundDiv = !this.showThingBackgroundDiv;
      if (this.showThingBackgroundDiv) {
        this.closeAllSubToolBars();
        this.showThingBackgroundDiv = true;
      }
    }
    openImagePoolManagingDialog() {
      this.init.dialogService.openDialog(ImagesPoolContainer, 675, 900, {});
    }
    showImagesChange($event) {
      this.showImagesIsThingsSelection = false;
      const value = $event.target.value;
      let targetValue;
      if (value === "none") {
        return;
      } else if (value === "Show Text Only") {
        targetValue = BackgroundImageState.TEXTONLY;
      } else if (value === "Show Images Only") {
        targetValue = BackgroundImageState.IMAGEONLY;
      } else if (value === "Show Semi-Transparent Images & Text") {
        targetValue = BackgroundImageState.TEXTANDIMAGE;
      } else if (value === "Show Images & Text") {
        targetValue = BackgroundImageState.TEXTANDIMAGEFULL;
        (0, validationAlert)("Pay attention, you can control the text location using the styling section on the left side of the toolbar.", 5000);
      }
      this.init.opmModel.changeImagesBackgroundStateInCurrentOpd(targetValue);
      this.init.getGraphService().renderGraph(this.init.opmModel.currentOpd, this.init);
    }
    shouldShowDisconnectFromFatherModel() {
      return !!this.init.opmModel.fatherModelName;
    }
    createSubModel() {
      var _this2 = this;
      return (0, default)(function* () {
        const contextService = _this2.init.service.model.context;
        if (contextService.context.isEmpty()) {
          (0, validationAlert)("Creating Sub Model is possible only for saved models.", 5000, "error");
          return;
        } else if (contextService.context.isReadonly()) {
          (0, validationAlert)("Creating Sub Model is possible only for models you own.", 5000, "error");
          return;
        }
        const selectedEntities = _this2.init.selection.collection.models.filter(m => OPCloudUtils.isInstanceOfDrawnEntity(m));
        const visualEntities = selectedEntities.map(ent => ent.getVisual());
        if (visualEntities.find(v => v.logicalElement.protectedFromBeingRefinedBySubModel)) {
          (0, validationAlert)("Cannot create sub model from entities that already belong to a sub model.");
          return;
        }
        if (visualEntities.find(v => OPCloudUtils.isInstanceOfVisualThing(v) && (v.getRefineeInzoom() || v.getRefineeUnfold()))) {
          (0, validationAlert)("Cannot create sub model from things that were refined.", 5000, "Error");
          return;
        }
        if (visualEntities.filter(v => OPCloudUtils.isInstanceOfVisualProcess(v)).length > 1) {
          (0, validationAlert)("Only One Process can be used for a sub model.", 5000, "Error");
          return;
        }
        const path = contextService.getCurrentContext().getPath();
        const dir_id = path[0].id === "root" ? path[path.length - 1].id : path[0].id;
        const ret = yield _this2.init.dialogService.openDialog(SubModelNameComponent, 280, 400, {
          dir_id: dir_id,
          mode: "create",
          fatherModelName: _this2.init.service.model.context.context.properties.name
        }).afterClosed().toPromise();
        if (!ret) {
          return;
        }
        _this2.init.modelService.createSubModel(_this2.init.getOpmModel(), visualEntities, contextService, ret).then(success => {
          if (success) {
            _this2.init.treeViewService.init(_this2.init.opmModel);
            _this2.init.save();
          }
        });
      })();
    }
    disconnectSubModelFromFatherModel() {
      var _this3 = this;
      return (0, default)(function* () {
        const confirmDialog = _this3._dialog.open(ConfirmDialogDialogComponent, {
          height: "250px",
          width: "360px",
          data: {
            message: "Warning: This model will be disconnected from its father model and its father model will no longer be able to import it. Undo will not be possible after this action and the model will be automatically saved.\nAre you sure?",
            closeFlag: false,
            centerText: true
          }
        });
        const confirmed = yield confirmDialog.afterClosed().toPromise();
        if (confirmed === "OK") {
          _this3.init.opmModel.disconnectSubModelFromFatherModel();
          _this3.init.modelService.modelObject.modelData.fatherModelName = undefined;
          _this3.init.getGraphService().renderGraph(_this3.init.opmModel.currentOpd, _this3.init);
          _this3.init.save();
        }
      })();
    }
    toggleBringDiv() {
      this.showBringConnectedDiv = !this.showBringConnectedDiv;
      if (this.showBringConnectedDiv) {
        this.init.currentBringConnectedSettings = {
          ...this.init.oplService.settings.bringConnectedSettings
        };
      }
    }
    toggleExecutionSettingsDiv() {
      const value = !this.showExecutionSettingsDiv;
      if (value) {
        this.closeAllSubToolBars();
      }
      this.showExecutionSettingsDiv = value;
    }
    toggleGrid() {
      this.init.toggleGrid();
    }
    bringLinksBetweenSelected() {
      const visuals = this.init.selection.collection.models.map(dr => this.init.opmModel.getVisualElementById(dr.id)).filter(v => !!v && OPCloudUtils.isInstanceOfVisualEntity(v));
      if (visuals.length < 2) {
        return;
      }
      this.init.opmModel.bringLinksBetweenSelected(visuals);
      this.init.getGraphService().renderGraph(this.init.opmModel.currentOpd, this.init, null, false, true);
    }
    methodologicalChecking() {
      this.init.dialogService.openDialog(MethodologicalCheckingDialog, 520, 400, {});
    }
    getFontListItemStyle(font) {
      const currentFont = this.selected.getFont();
      if (font.name.toLowerCase() === currentFont.toLowerCase()) {
        return "border: 3px solid white;";
      } else {
        return "";
      }
    }
    static #_ = (() => this.ɵfac = function ElementToolBarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ElementToolBarComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ElementToolBarComponent,
      selectors: [["opcloud-element-tool-bar"]],
      decls: 3,
      vars: 2,
      consts: [["hidenav", ""], [4, "ngIf", "ngIfElse"], ["id", "visibleNav", 1, "navbar", 3, "click"], [1, "findElements", 2, "position", "relative", "top", "2px"], ["matTooltip", "Things and Notes Searching", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12.1131 21.9204C12.0975 22.1252 12.0277 22.3498 11.8314 22.5237L11.8054 22.5467L11.7764 22.5659L7.11195 25.661C6.41684 26.2967 6.30001 27.3303 6.83668 27.9943L6.83705 27.9948C7.4954 28.8113 8.75379 28.8643 9.45421 28.1507L12.5911 23.6957L12.6118 23.6663L12.6364 23.6403C12.8655 23.3976 13.1613 23.2799 13.4534 23.232L12.1131 21.9204Z", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["d", "M0 4C0 1.791 1.79 0 4 0H32C34.21 0 36 1.791 36 4V31C36 33.209 34.21 35 32 35H4C1.79 35 0 33.209 0 31V4Z", "fill", "#497284", "fill-opacity", "0.09"], ["d", "M17.5 11.5C17.5 10.9477 17.9477 10.5 18.5 10.5H20.5C21.0523 10.5 21.5 10.9477 21.5 11.5C21.5 12.0523 21.0523 12.5 20.5 12.5H18.5C17.9477 12.5 17.5 12.0523 17.5 11.5Z", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["d", "M20.5 19.5C20.5 18.9477 20.9477 18.5 21.5 18.5H23.5C24.0523 18.5 24.5 18.9477 24.5 19.5C24.5 20.0523 24.0523 20.5 23.5 20.5H21.5C20.9477 20.5 20.5 20.0523 20.5 19.5Z", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["d", "M14.5 19.5C14.5 18.9477 14.9477 18.5 15.5 18.5H17.5C18.0523 18.5 18.5 18.9477 18.5 19.5C18.5 20.0523 18.0523 20.5 17.5 20.5H15.5C14.9477 20.5 14.5 20.0523 14.5 19.5Z", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["x1", "16.5", "y1", "15", "x2", "16.5", "y2", "21", "stroke", "#5A6F8F"], ["x1", "16", "y1", "15.5", "x2", "23", "y2", "15.5", "stroke", "#5A6F8F"], ["x1", "22.5", "y1", "15", "x2", "22.5", "y2", "21", "stroke", "#5A6F8F"], ["x1", "19.5", "y1", "13", "x2", "19.5", "y2", "16", "stroke", "#5A6F8F"], ["d", "M28.5 16C28.5 20.6693 24.4964 24.5 19.5 24.5C14.5036 24.5 10.5 20.6693 10.5 16C10.5 11.3307 14.5036 7.5 19.5 7.5C24.4964 7.5 28.5 11.3307 28.5 16Z", "stroke", "#5A6F8F"], [2, "top", "2px", "position", "relative"], ["matTooltip", "Methodological Checking", 1, "button", 3, "click"], ["cx", "18", "cy", "18", "r", "12.25", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["x", "10", "y", "19.5", "width", "5", "height", "3", "rx", "0.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["x", "21", "y", "19.5", "width", "5", "height", "3", "rx", "0.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["x", "15.5", "y", "12.5", "width", "5", "height", "3", "rx", "0.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["x1", "18", "y1", "14", "x2", "18", "y2", "18", "stroke", "#5A6F8F"], ["x1", "23", "y1", "17.5", "x2", "12", "y2", "17.5", "stroke", "#5A6F8F"], ["x1", "12.5", "y1", "17", "x2", "12.5", "y2", "20", "stroke", "#5A6F8F"], ["x1", "23.5", "y1", "17", "x2", "23.5", "y2", "20", "stroke", "#5A6F8F"], ["d", "M27 9L30 14", "stroke", "#E9ECEE", "stroke-width", "4"], ["d", "M24 10L25.7043 13.8347C25.8468 14.1554 26.2667 14.2333 26.5148 13.9852L34.5 6", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["style", "position: relative; top: 2px;", 4, "ngIf"], ["class", "stylingSpan", 4, "ngIf"], ["id", "stylingTools", 4, "ngIf"], ["class", "rightSideHide", "style", "padding-top: 8px;", 4, "ngIf"], [1, "rightSideShow"], ["id", "fullScreenBtn", "matTooltip", "Toggle Full Screen", 1, "button", 3, "click"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "rightSideShow", 3, "mouseenter", "mouseleave"], ["matTooltip", "De-Magnify", 1, "button"], ["width", "36", "height", "35", "rx", "4", "fill", "#497284", "fill-opacity", "0.09", 1, "zoomOutRect"], ["x", "10", "y", "10", "width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["opacity", "0.7"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M19.3049 16.6223L16.0275 13.4709C15.6198 13.1075 15.5159 12.5219 15.7722 12.044C16.542 10.6085 16.8925 8.92115 16.6614 7.14035C16.2032 3.60354 13.3636 0.691492 9.78232 0.114424C4.06039 -0.807931 -0.8179 3.98126 0.115043 9.60314C0.698497 13.1171 3.65266 15.907 7.24658 16.3668C9.05616 16.5976 10.7696 16.259 12.2307 15.5083C12.7122 15.2613 13.3005 15.3614 13.6704 15.7534L16.6614 19.4094C17.4526 20.2479 18.8652 20.1868 19.6088 19.2692C20.2515 18.4766 20.069 17.3034 19.3049 16.6223ZM2.15374 8.21911C2.15374 4.84827 4.9351 2.1165 8.36592 2.1165C11.7967 2.1165 14.5771 4.84827 14.5771 8.21911C14.5771 11.59 11.7967 14.3217 8.36592 14.3217C4.9351 14.3217 2.15374 11.59 2.15374 8.21911Z", "fill", "#1A3763"], ["d", "M5.00598 7.92823C5.00598 7.66497 5.22344 7.45131 5.49139 7.45131H11.2395C11.5075 7.45131 11.7249 7.66497 11.7249 7.92823V8.4805C11.7249 8.74376 11.5075 8.95646 11.2395 8.95646H5.49139C5.22344 8.95646 5.00598 8.74376 5.00598 8.4805V7.92823Z", "fill", "#1A3763"], ["id", "zoomShow", "matTooltip", "Magnify To...", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["id", "labelToShow", "for", "zoomShow", 1, "rightSideShow", "zoomValueDisplay"], ["transform", "translate(1,-2), scale(1,1.1)", "width", "55", "height", "40", "viewBox", "0 0 68 40 ", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "68", "height", "39", "rx", "4", "fill", "#497284", "fill-opacity", "0.09", 1, "zoomSelect"], ["transform", "scale(1, 1.1)", "d", "M50 0H68C70.2091 0 72 1.79086 72 4V31C72 33.2091 70.2091 35 68 35H50V0Z", "fill", "#497284", "fill-opacity", "0.09"], ["transform", "translate(-1,1)", "d", "M64 16L61 19L58 16", "stroke", "#5A6F8F", "stroke-width", "1.5", "stroke-linecap", "round", "stroke-linejoin", "round"], ["id", "zoomSelectOptionMenuShow", "class", "zoomSelectContainerShow", 4, "ngIf"], ["matTooltip", "Magnify", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M11.2395 7.45131H9.47169C9.28432 7.45131 9.1319 7.30251 9.1319 7.11747V5.38054C9.1319 5.11728 8.91444 4.90362 8.6465 4.90362H8.08538C7.81743 4.90362 7.59997 5.11728 7.59997 5.38054V7.11747C7.59997 7.30251 7.44756 7.45131 7.26019 7.45131H5.49139C5.22344 7.45131 5.00598 7.66497 5.00598 7.92822V8.48049C5.00598 8.74375 5.22344 8.95645 5.49139 8.95645H7.26019C7.44756 8.95645 7.59997 9.1062 7.59997 9.29029V11.0282C7.59997 11.2914 7.81743 11.5051 8.08538 11.5051H8.6465C8.91444 11.5051 9.1319 11.2914 9.1319 11.0282V9.29029C9.1319 9.1062 9.28432 8.95645 9.47169 8.95645H11.2395C11.5075 8.95645 11.7249 8.74375 11.7249 8.48049V7.92822C11.7249 7.66497 11.5075 7.45131 11.2395 7.45131Z", "fill", "#1A3763"], ["class", "button", 3, "matTooltip", "click", 4, "ngIf"], [1, "copyPasteIcons"], ["class", "button", "matTooltip", "Copy", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Paste", 3, "click", 4, "ngIf"], [1, "commanActions"], ["class", "outings", 4, "ngIf"], ["class", "button", "matTooltip", "Connect Sub-Model", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Views", 3, "click", 4, "ngIf"], ["class", "extensionsDiv", 4, "ngIf"], ["class", "button", "matTooltip", "OPM Requirements", 3, "click", 4, "ngIf"], ["class", "extensionsDiv", "style", "margin-left: 47px;", 4, "ngIf"], ["class", "button", "matTooltip", "Manage Image in Things", 3, "click", 4, "ngIf"], ["class", "extensionsDiv", "style", "margin-left: 86px;", 4, "ngIf"], ["class", "button", 3, "matTooltip", "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "Object In-Diagram In-Zooming", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "URL Links Management", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "Entities Extensions", 3, "click", 4, "ngIf"], ["class", "extensionsDiv", "style", "margin-left: 300px;", 4, "ngIf"], ["class", "button", "matTooltip", "Simulate Element", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Bring Links Between Selected Entities", 3, "click", 4, "ngIf"], ["class", "button", 3, "matTooltip", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "extensionsDiv", "style", "position: absolute; right: 0px;", 4, "ngIf"], [4, "ngIf"], [1, "affiliationIcon"], [1, "stateArrangeIcons"], ["class", "button", "matTooltip", "Semi-fold", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Remove Semi-Fold View", 3, "click", 4, "ngIf"], [1, "stateArrangementOptions"], ["class", "button", "matTooltip", "State Arrangement Options", 3, "click", 4, "ngIf"], ["id", "stateArrangementTools", 4, "ngIf"], ["class", "temporalStateIcons", "id", "temporalStateContainer", 4, "ngIf"], [2, "position", "relative", "top", "2px"], ["matTooltipClass", "multiline-tooltip tooltipStyle", 1, "button", 3, "contextmenu", "click", "matTooltip"], ["d", "M15.2028 9.79444C16.8832 8.20401 19.4378 7.9757 21.3811 9.24225L23.2835 10.4821L26.6926 7.08136L27.6653 7.40389C28.7703 7.77025 29.5655 8.74203 29.7055 9.89719V9.89719L25.8381 13.5388L27.2698 15.1615C28.6204 16.6924 28.5548 19.0054 27.1197 20.4497V20.4497L15.2028 9.79444V9.79444Z", "fill", "#5A6F8F"], ["d", "M14.9525 10.2147L26.6927 20.8804L22.3578 26.1557C20.3524 28.5961 17.2513 28.8209 14.8847 26.6976L14.3033 26.1759V26.1759C15.4082 25.8233 16.3665 24.9752 17.0147 23.7764L17.1296 23.5637L15.9927 24.6145C14.7144 25.796 13.0035 25.92 11.5538 24.9364L10.0311 23.9031L13.6575 21.3019L12.1311 22.0053C10.144 22.921 7.8686 21.9228 6.61348 19.5848V19.5848V19.5848C7.58359 19.2029 8.47584 18.5677 9.2376 17.7165L10.474 16.3349L14.9525 10.2147Z", "fill", "#5A6F8F"], ["d", "M0 4C0 1.791 1.79 0 4 0H32C34.21 0 36 1.791 36 4V31C36 33.209 34.21 35 32 35H4C1.79 35 0 33.209 0 31V4Z", "fill", "#1A3763"], ["d", "M15.2028 9.79444C16.8832 8.20401 19.4378 7.9757 21.3811 9.24225L23.2835 10.4821L26.6926 7.08136L27.6653 7.40389C28.7703 7.77025 29.5655 8.74203 29.7055 9.89719V9.89719L25.8381 13.5388L27.2698 15.1615C28.6204 16.6924 28.5548 19.0054 27.1197 20.4497V20.4497L15.2028 9.79444V9.79444Z", "fill", "white"], ["d", "M14.9525 10.2147L26.6927 20.8804L22.3578 26.1557C20.3524 28.5961 17.2513 28.8209 14.8847 26.6976L14.3033 26.1759V26.1759C15.4082 25.8233 16.3665 24.9752 17.0147 23.7764L17.1296 23.5637L15.9927 24.6145C14.7144 25.796 13.0035 25.92 11.5538 24.9364L10.0311 23.9031L13.6575 21.3019L12.1311 22.0053C10.144 22.921 7.8686 21.9228 6.61348 19.5848V19.5848V19.5848C7.58359 19.2029 8.47584 18.5677 9.2376 17.7165L10.474 16.3349L14.9525 10.2147Z", "fill", "white"], [1, "stylingSpan"], [1, "button", 3, "click", "matTooltip"], ["width", "36", "height", "40", "viewBox", "0 0 36 41", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["id", "paint0_linear_1423_1696", "x1", "47", "y1", "-7.27876e-06", "x2", "-11", "y2", "35", "gradientUnits", "userSpaceOnUse"], ["stop-color", "#00D1FF"], ["offset", "0.458805", "stop-color", "#6F76F4"], ["offset", "0.9999", "stop-color", "#FF00E5"], ["offset", "1", "stop-color", "#001AFF"], ["width", "36", "height", "35", "rx", "4", "fill", "#497284", "fill-opacity", "0.09"], ["opacity", "0.8", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.1952 17.819C24.1577 18.746 24.2537 20.5144 22.5248 21.8514C20.7966 23.1891 17.7506 23.4932 17.0344 22.0372C16.9471 21.8602 17.0431 21.7771 17.131 21.7167C17.2195 21.6568 18.6326 20.9849 19.0715 19.396C19.5104 17.8064 21.7059 16.385 23.1952 17.819ZM30.6199 10.3771C30.1025 9.85062 29.2569 9.87833 28.7784 10.442C27.9886 11.3715 26.6757 12.8401 24.9085 14.5487C24.4827 14.9675 23.9027 14.7937 23.2162 15.4921C23.2162 15.4921 22.7186 15.9997 22.596 16.1237C22.4734 16.2484 22.5069 16.5041 22.7198 16.5967C22.9321 16.6899 23.4081 16.911 23.8129 17.3228C24.2177 17.7347 24.435 18.219 24.5266 18.435C24.6176 18.6516 24.8689 18.6863 24.9915 18.5616C25.114 18.4369 25.6123 17.9299 25.6123 17.9299C26.2988 17.2315 26.1279 16.6414 26.5396 16.2081C28.2189 14.4101 29.6624 13.0744 30.576 12.2708C31.13 11.784 31.1374 10.9036 30.6199 10.3771ZM13 14H21V12H13C10.2386 12 8 14.2386 8 17V24C8 26.7614 10.2386 29 13 29H25C27.7614 29 30 26.7614 30 24V21H28V24C28 25.6569 26.6569 27 25 27H13C11.3431 27 10 25.6569 10 24V17C10 15.3431 11.3431 14 13 14Z M 15 30 h 8 L 19 34 Z ", "fill", "url(#paint0_linear_1423_1696)", "style", "transform: translateY(-3px);", 4, "ngIf"], ["opacity", "0.8", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.1952 17.819C24.1577 18.746 24.2537 20.5144 22.5248 21.8514C20.7966 23.1891 17.7506 23.4932 17.0344 22.0372C16.9471 21.8602 17.0431 21.7771 17.131 21.7167C17.2195 21.6568 18.6326 20.9849 19.0715 19.396C19.5104 17.8064 21.7059 16.385 23.1952 17.819ZM30.6199 10.3771C30.1025 9.85062 29.2569 9.87833 28.7784 10.442C27.9886 11.3715 26.6757 12.8401 24.9085 14.5487C24.4827 14.9675 23.9027 14.7937 23.2162 15.4921C23.2162 15.4921 22.7186 15.9997 22.596 16.1237C22.4734 16.2484 22.5069 16.5041 22.7198 16.5967C22.9321 16.6899 23.4081 16.911 23.8129 17.3228C24.2177 17.7347 24.435 18.219 24.5266 18.435C24.6176 18.6516 24.8689 18.6863 24.9915 18.5616C25.114 18.4369 25.6123 17.9299 25.6123 17.9299C26.2988 17.2315 26.1279 16.6414 26.5396 16.2081C28.2189 14.4101 29.6624 13.0744 30.576 12.2708C31.13 11.784 31.1374 10.9036 30.6199 10.3771ZM13 14H21V12H13C10.2386 12 8 14.2386 8 17V24C8 26.7614 10.2386 29 13 29H25C27.7614 29 30 26.7614 30 24V21H28V24C28 25.6569 26.6569 27 25 27H13C11.3431 27 10 25.6569 10 24V17C10 15.3431 11.3431 14 13 14Z M 15 34 h 8 L 19 30 Z ", "fill", "url(#paint0_linear_1423_1696)", "style", "transform: translateY(-3px);", 4, "ngIf"], ["opacity", "0.8", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.1952 17.819C24.1577 18.746 24.2537 20.5144 22.5248 21.8514C20.7966 23.1891 17.7506 23.4932 17.0344 22.0372C16.9471 21.8602 17.0431 21.7771 17.131 21.7167C17.2195 21.6568 18.6326 20.9849 19.0715 19.396C19.5104 17.8064 21.7059 16.385 23.1952 17.819ZM30.6199 10.3771C30.1025 9.85062 29.2569 9.87833 28.7784 10.442C27.9886 11.3715 26.6757 12.8401 24.9085 14.5487C24.4827 14.9675 23.9027 14.7937 23.2162 15.4921C23.2162 15.4921 22.7186 15.9997 22.596 16.1237C22.4734 16.2484 22.5069 16.5041 22.7198 16.5967C22.9321 16.6899 23.4081 16.911 23.8129 17.3228C24.2177 17.7347 24.435 18.219 24.5266 18.435C24.6176 18.6516 24.8689 18.6863 24.9915 18.5616C25.114 18.4369 25.6123 17.9299 25.6123 17.9299C26.2988 17.2315 26.1279 16.6414 26.5396 16.2081C28.2189 14.4101 29.6624 13.0744 30.576 12.2708C31.13 11.784 31.1374 10.9036 30.6199 10.3771ZM13 14H21V12H13C10.2386 12 8 14.2386 8 17V24C8 26.7614 10.2386 29 13 29H25C27.7614 29 30 26.7614 30 24V21H28V24C28 25.6569 26.6569 27 25 27H13C11.3431 27 10 25.6569 10 24V17C10 15.3431 11.3431 14 13 14Z M 15 30 h 8 L 19 34 Z ", "fill", "url(#paint0_linear_1423_1696)", 2, "transform", "translateY(-3px)"], ["opacity", "0.8", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.1952 17.819C24.1577 18.746 24.2537 20.5144 22.5248 21.8514C20.7966 23.1891 17.7506 23.4932 17.0344 22.0372C16.9471 21.8602 17.0431 21.7771 17.131 21.7167C17.2195 21.6568 18.6326 20.9849 19.0715 19.396C19.5104 17.8064 21.7059 16.385 23.1952 17.819ZM30.6199 10.3771C30.1025 9.85062 29.2569 9.87833 28.7784 10.442C27.9886 11.3715 26.6757 12.8401 24.9085 14.5487C24.4827 14.9675 23.9027 14.7937 23.2162 15.4921C23.2162 15.4921 22.7186 15.9997 22.596 16.1237C22.4734 16.2484 22.5069 16.5041 22.7198 16.5967C22.9321 16.6899 23.4081 16.911 23.8129 17.3228C24.2177 17.7347 24.435 18.219 24.5266 18.435C24.6176 18.6516 24.8689 18.6863 24.9915 18.5616C25.114 18.4369 25.6123 17.9299 25.6123 17.9299C26.2988 17.2315 26.1279 16.6414 26.5396 16.2081C28.2189 14.4101 29.6624 13.0744 30.576 12.2708C31.13 11.784 31.1374 10.9036 30.6199 10.3771ZM13 14H21V12H13C10.2386 12 8 14.2386 8 17V24C8 26.7614 10.2386 29 13 29H25C27.7614 29 30 26.7614 30 24V21H28V24C28 25.6569 26.6569 27 25 27H13C11.3431 27 10 25.6569 10 24V17C10 15.3431 11.3431 14 13 14Z M 15 34 h 8 L 19 30 Z ", "fill", "url(#paint0_linear_1423_1696)", 2, "transform", "translateY(-3px)"], ["id", "stylingTools"], [1, "leftSide"], ["id", "returnDefault", 4, "ngIf"], ["class", "textsizeContainer", "id", "textsizeContainer", 4, "ngIf"], ["class", "textFontContainer", 4, "ngIf"], ["style", "display: inline-block; vertical-align: top;", 4, "ngIf"], ["id", "textAnchor", 4, "ngIf"], ["id", "manualTextPosContainer", 4, "ngIf"], ["id", "returnDefault"], ["id", "returnDefaultbtn", "matTooltip", "Reset Style", 1, "button", 2, "top", "0", 3, "click"], ["width", "36", "height", "33", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "36", "height", "35", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09"], ["filter", "url(#filter0_d)"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M16.148 11.5128V9.6131C16.148 9.08357 15.5018 8.80428 15.0961 9.15761L8.43325 14.9665C7.86143 15.4641 7.85467 16.3311 8.41876 16.8381L15.0884 22.8354C15.4921 23.199 16.148 22.9206 16.148 22.3874V19.9759C16.148 19.2496 16.7613 18.6582 17.5109 18.6554C22.8553 18.6357 25.5086 20.0781 27.0251 21.4239C27.4762 21.8241 28.1852 21.3639 27.9553 20.8147C25.8351 15.7397 21.4769 13.257 17.4703 12.8924C16.743 12.8268 16.148 12.2204 16.148 11.5128", "fill", "rgb(90, 111, 143)"], ["id", "filter0_d", "x", "8", "y", "9", "width", "20", "height", "15", "filterUnits", "userSpaceOnUse", "color-interpolation-filters", "sRGB"], ["flood-opacity", "0", "result", "BackgroundImageFix"], ["in", "SourceAlpha", "type", "matrix", "values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"], ["dy", "1"], ["type", "matrix", "values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"], ["mode", "normal", "in2", "BackgroundImageFix", "result", "effect1_dropShadow"], ["mode", "normal", "in", "SourceGraphic", "in2", "effect1_dropShadow", "result", "shape"], ["id", "textMenu", "matTooltip", "Font Size", 1, "button", 3, "click"], ["width", "26", "height", "25", "viewBox", "0 0 26 25", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "26", "height", "25", "fill", "#D9D9D9", "fill-opacity", "0.01"], ["d", "M12.6387 0.671875V22H8.25879V0.671875H12.6387ZM19.2012 0.671875V4.11426H1.79883V0.671875H19.2012Z", "fill", "#5A6F8F"], ["x1", "22.4889", "y1", "14", "x2", "22.5013", "y2", "18.9999", "stroke", "#5A6F8F", "stroke-width", "3"], ["x1", "22.5", "y1", "12", "x2", "22.5", "y2", "7", "stroke", "#5A6F8F", "stroke-width", "3"], ["d", "M22.5 3L25.5311 7.5H19.4689L22.5 3Z", "fill", "#5A6F8F"], ["d", "M22.5111 22.9999L19.4689 18.5074L25.5311 18.4924L22.5111 22.9999Z", "fill", "#5A6F8F"], ["id", "textsizeContainer", 1, "textsizeContainer"], [1, "textSize"], [3, "click", "matTooltip"], ["matTooltip", "Font", 1, "button", 3, "click"], ["width", "39", "height", "28", "viewBox", "0 0 39 28", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "39", "height", "25", "fill", "#D9D9D9", "fill-opacity", "0.01"], ["x", "1", "y", "3", "width", "26", "height", "25", "fill", "#D9D9D9", "fill-opacity", "0.01"], ["d", "M10.998 6.31934L5.19727 24H0.524414L8.44922 2.67188H11.4229L10.998 6.31934ZM15.8174 24L10.002 6.31934L9.5332 2.67188H12.5361L20.5049 24H15.8174ZM15.5537 16.0605V19.5029H4.28906V16.0605H15.5537Z", "fill", "#5A6F8F"], ["d", "M38.4973 23.08V24H28.9753V23.08H31.4363L29.5043 17.1H23.1333L21.1783 23.08H23.5243V24H18.5103V23.08H20.0743L25.7553 5.6H31.2523L36.9333 23.08H38.4973ZM29.2053 16.18L26.3073 7.302L23.4323 16.18H29.2053Z", "fill", "#5A6F8F"], [1, "textFontContainer"], [1, "textFont"], ["fontHighlight", "", 3, "style", "click", 4, "ngFor", "ngForOf"], ["fontHighlight", "", 3, "click"], ["matTooltip", "Text Color", 1, "button", 3, "click"], ["width", "26", "height", "25", "viewBox", "0 -1 21 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M8.4082 7.71429H12.5918L10.5 2.29018L8.4082 7.71429ZM9.63867 0H11.3613L16.1602 12.0134H14.1914L13.248 9.44196H7.75195L6.76758 12.0134H4.79883L9.63867 0ZM0 14.5848H21V18H0V14.5848Z", "fill", "rgb(90, 111, 143)"], ["matTooltip", "Border Color", 1, "firstColorPicker", "button", 3, "click"], ["width", "36", "height", "35", "viewBox", "0 0 38 34", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "38", "height", "34", "rx", "4", "transform", "matrix(-1 0 0 1 38 0)", "fill", "rgb(238, 238, 238)", "fill-opacity", "0.7"], ["width", "22", "height", "19", "rx", "2", "transform", "matrix(-1 0 0 1 30 7)", "stroke-width", "2"], ["matTooltip", "Fill Color", 1, "elementShapeColor", "button", 3, "click"], ["filter", "url(#filter0_b)"], ["width", "38", "height", "34", "rx", "4", "transform", "matrix(-1 0 0 1 38 0)", "fill", "#eee", "fill-opacity", "0.7"], ["width", "24", "height", "21", "rx", "2", "transform", "matrix(-1 0 0 1 31 6)"], ["id", "filter0_b", "x", "-4", "y", "-4", "width", "46", "height", "42", "filterUnits", "userSpaceOnUse", "color-interpolation-filters", "sRGB"], ["in", "BackgroundImage", "stdDeviation", "2"], ["in2", "SourceAlpha", "operator", "in", "result", "effect1_backgroundBlur"], ["mode", "normal", "in", "SourceGraphic", "in2", "effect1_backgroundBlur", "result", "shape"], [2, "display", "inline-block", "vertical-align", "top"], ["matTooltip", "Fill Pattern", 1, "elementShapePattern", "button", 3, "click"], ["filter", "url(#filter0_b_pattern)"], ["width", "24", "height", "21", "rx", "2", "x", "7", "y", "6"], ["id", "filter0_b_pattern", "x", "-4", "y", "-4", "width", "46", "height", "42", "filterUnits", "userSpaceOnUse", "color-interpolation-filters", "sRGB"], ["id", "textAnchor"], ["matTooltip", "Align Text to Left", 1, "button", 3, "click"], ["x1", "8", "y1", "10.5", "x2", "28", "y2", "10.5", "stroke", "#5A6F8F"], ["x1", "8", "y1", "18.5", "x2", "28", "y2", "18.5", "stroke", "#5A6F8F"], ["x1", "8", "y1", "22.5", "x2", "20", "y2", "22.5", "stroke", "#5A6F8F"], ["x1", "8", "y1", "14.5", "x2", "20", "y2", "14.5", "stroke", "#5A6F8F"], ["matTooltip", "Align Text to Middle", 1, "button", 3, "click"], ["x1", "12", "y1", "22.5", "x2", "24", "y2", "22.5", "stroke", "#5A6F8F"], ["x1", "12", "y1", "14.5", "x2", "24", "y2", "14.5", "stroke", "#5A6F8F"], ["matTooltip", "Align Text to Right", 1, "button", 3, "click"], ["x1", "16", "y1", "22.5", "x2", "28", "y2", "22.5", "stroke", "#5A6F8F"], ["x1", "16", "y1", "14.5", "x2", "28", "y2", "14.5", "stroke", "#5A6F8F"], ["id", "manualTextPosContainer"], ["id", "textPos", 1, "button", 3, "matTooltip"], ["width", "36", "height", "35", "viewBox", "0 0 38 34", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click", 4, "ngIf"], ["id", "textPosSliders", 4, "ngIf"], ["id", "boxTextPos", "style", "padding-left: 5px;", 4, "ngIf"], ["width", "36", "height", "35", "viewBox", "0 0 38 34", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click"], ["d", "M4 0H32C34.2091 0 36 1.79086 36 4V31C36 33.2091 34.2091 35 32 35H4C1.79086 35 0 33.2091 0 31V4C0 1.79086 1.79086 0 4 0Z", "fill", "#497284", "fill-opacity", "0.09"], ["d", "M24.4375 12.7852H19.2109V27H15.6953V12.7852H10.5391V9.9375H24.4375V12.7852Z", "fill", "#5A6F8F"], ["d", "M27.5 17L29.6651 20.75H25.3349L27.5 17Z", "fill", "#5A6F8F"], ["x1", "27.5", "y1", "19", "x2", "27.5", "y2", "24", "stroke", "#5A6F8F"], ["d", "M27.4442 29.9995L25.3392 26.2154L29.6687 26.2844L27.4442 29.9995Z", "fill", "#5A6F8F"], ["x1", "27.4761", "y1", "27.9998", "x2", "27.5558", "y2", "23.0005", "stroke", "#5A6F8F"], ["d", "M21.0089 23.5178L24.7512 21.3394L24.7666 25.6695L21.0089 23.5178Z", "fill", "#5A6F8F"], ["x1", "23.0087", "y1", "23.5107", "x2", "28.0087", "y2", "23.4929", "stroke", "#5A6F8F"], ["d", "M33.9968 23.5322L30.2329 25.6729L30.2609 21.3429L33.9968 23.5322Z", "fill", "#5A6F8F"], ["x1", "31.9968", "y1", "23.5193", "x2", "26.9969", "y2", "23.4869", "stroke", "#5A6F8F"], ["d", "M4 0H32C34.2091 0 36 1.79086 36 4V31C36 33.2091 34.2091 35 32 35H4C1.79086 35 0 33.2091 0 31V4C0 1.79086 1.79086 0 4 0Z", "fill", "#5A6F8F"], ["d", "M24.4375 12.7852H19.2109V27H15.6953V12.7852H10.5391V9.9375H24.4375V12.7852Z", "fill", "white"], ["d", "M27.5 17L29.6651 20.75H25.3349L27.5 17Z", "fill", "white"], ["x1", "27.5", "y1", "19", "x2", "27.5", "y2", "24", "stroke", "white"], ["d", "M27.4442 29.9995L25.3392 26.2154L29.6687 26.2844L27.4442 29.9995Z", "fill", "white"], ["x1", "27.4761", "y1", "27.9998", "x2", "27.5558", "y2", "23.0005", "stroke", "white"], ["d", "M21.0089 23.5178L24.7512 21.3394L24.7666 25.6695L21.0089 23.5178Z", "fill", "white"], ["x1", "23.0087", "y1", "23.5107", "x2", "28.0087", "y2", "23.4929", "stroke", "white"], ["d", "M33.9968 23.5322L30.2329 25.6729L30.2609 21.3429L33.9968 23.5322Z", "fill", "white"], ["x1", "31.9968", "y1", "23.5193", "x2", "26.9969", "y2", "23.4869", "stroke", "white"], ["id", "textPosSliders"], ["id", "textPosLabelX"], ["min", "0.1", "max", "0.9", "step", "0.05"], ["id", "elementXvalue", "matSliderThumb", "", 3, "change", "value"], ["id", "textPosLabelY"], ["id", "elementYvalue", "matSliderThumb", "", 3, "change", "value"], ["id", "boxTextPos", 2, "padding-left", "5px"], ["d", "M0 4C0 1.791 1.79 0 4 0H32C34.21 0 36 1.791 36 4V31C36 33.209 34.21 35 32 35H4C1.79 35 0 33.209 0 31V4Z", "fill", "#497284", "fill-opacity", "0.09", 3, "click"], ["d", "M23.2031 13.3389H19.2832V24H16.6465V13.3389H12.7793V11.2031H23.2031V13.3389Z", "fill", "#5A6F8F", 3, "click"], ["x", "14", "y", "2", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "26", "y", "14", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "26", "y", "2", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "26", "y", "26", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "2", "y", "26", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "2", "y", "14", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "2", "y", "2", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], ["x", "14", "y", "26", "width", "8", "height", "7", "fill", "#5A6F8F", 3, "click"], [1, "rightSideHide", 2, "padding-top", "8px"], [1, "button", 3, "click", "mouseenter", "mouseleave", "matTooltip"], ["cx", "18", "cy", "17", "r", "12", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M24.1221 10.8943L26.2721 12.9865L16.5703 22.9567C16.1851 23.3525 15.552 23.3611 15.1562 22.9759L13.7228 21.5812L24.1221 10.8943Z", "fill", "#5A6F8F"], ["x", "17.3096", "y", "20.8694", "width", "3", "height", "7.17819", "transform", "rotate(132.715 17.3096 20.8694)", "fill", "#5A6F8F"], ["cx", "18", "cy", "17", "r", "12", "stroke", "white", "stroke-width", "2"], ["d", "M24.1221 10.8943L26.2721 12.9865L16.5703 22.9567C16.1851 23.3525 15.552 23.3611 15.1562 22.9759L13.7228 21.5812L24.1221 10.8943Z", "fill", "white"], ["x", "17.3096", "y", "20.8694", "width", "3", "height", "7.17819", "transform", "rotate(132.715 17.3096 20.8694)", "fill", "white"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.3718 9.75356C14.3718 9.33739 14.0355 9 13.6197 9H11.8133C10.2655 9 9.0104 10.2589 9.0104 11.8113V13.624C9.0104 14.041 9.34678 14.3784 9.76249 14.3784C10.1774 14.3784 10.5289 14.041 10.5289 13.624V11.7811C10.5289 11.0944 11.0842 10.5382 11.7689 10.5382H13.6197C14.0355 10.5382 14.3718 10.1705 14.3718 9.75356ZM20.7707 21.5686H14.2349C13.8156 21.5686 13.4753 21.2273 13.4753 20.8067V14.2513C13.4753 13.8301 13.8156 13.4888 14.2349 13.4888H20.7707C21.1906 13.4888 21.5309 13.8301 21.5309 14.2513V20.8067C21.5309 21.2273 21.1906 21.5686 20.7707 21.5686ZM9 21.4239C9 21.0069 9.33717 20.6695 9.75209 20.6695C10.167 20.6695 10.5335 21.0069 10.5335 21.4239V23.2803C10.5335 23.967 11.0889 24.524 11.7735 24.524H13.6109C14.0259 24.524 14.3622 24.8766 14.3622 25.2927C14.3622 25.7097 14.0259 26.0471 13.6109 26.0471H11.8029C10.2551 26.0471 9 24.7882 9 23.2357V21.4239ZM20.6353 25.3031C20.6353 25.7192 20.9716 26.0574 21.3866 26.0574H23.1938C24.7416 26.0574 25.9959 24.7986 25.9959 23.2461V21.4326C25.9959 21.0164 25.6595 20.679 25.2446 20.679C24.8297 20.679 24.4774 21.0164 24.4774 21.4326V23.2763C24.4774 23.9622 23.9229 24.5193 23.2382 24.5193H21.3866C20.9716 24.5193 20.6353 24.8869 20.6353 25.3031ZM26.0062 13.6336C26.0062 14.0498 25.6698 14.388 25.2549 14.388C24.8392 14.388 24.4726 14.0498 24.4726 13.6336V11.7763C24.4726 11.0896 23.9181 10.5334 23.2334 10.5334H21.396C20.9803 10.5334 20.6439 10.1801 20.6439 9.76392C20.6439 9.34775 20.9803 9.01036 21.396 9.01036H23.2033C24.7511 9.01036 26.0062 10.2684 26.0062 11.8217V13.6336Z", "fill", "#1A3763"], ["d", "M32 0H4C1.79086 0 0 1.79086 0 4V31C0 33.2091 1.79086 35 4 35H32C34.2091 35 36 33.2091 36 31V4C36 1.79086 34.2091 0 32 0Z", "fill", "#1A3763"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.3203 7.884C14.3203 7.396 13.9197 7 13.4297 7H11.3096C9.48957 7 8.00977 8.47599 8.00977 10.296V12.422C8.00977 12.911 8.41039 13.306 8.90039 13.306C9.38039 13.306 9.7998 12.911 9.7998 12.422V10.261C9.7998 9.45599 10.4498 8.80399 11.2598 8.80399H13.4297C13.9197 8.80399 14.3203 8.372 14.3203 7.884ZM21.8398 21.737H14.1602C13.6602 21.737 13.2598 21.337 13.2598 20.843V13.157C13.2598 12.663 13.6602 12.263 14.1602 12.263H21.8398C22.3398 12.263 22.7402 12.663 22.7402 13.157V20.843C22.7402 21.337 22.3398 21.737 21.8398 21.737ZM8 21.567C8 21.078 8.39988 20.682 8.87988 20.682C9.36988 20.682 9.7998 21.078 9.7998 21.567V23.744C9.7998 24.549 10.4598 25.202 11.2598 25.202H13.4199C13.9099 25.202 14.3096 25.615 14.3096 26.103C14.3096 26.592 13.9099 26.988 13.4199 26.988H11.2998C9.4798 26.988 8 25.512 8 23.691V21.567ZM21.6797 26.115C21.6797 26.603 22.0803 27 22.5703 27H24.6904C26.5104 27 27.9902 25.524 27.9902 23.704V21.577C27.9902 21.089 27.5896 20.694 27.0996 20.694C26.6196 20.694 26.2002 21.089 26.2002 21.577V23.739C26.2002 24.543 25.5502 25.196 24.7402 25.196H22.5703C22.0803 25.196 21.6797 25.627 21.6797 26.115ZM28 12.433C28 12.921 27.6001 13.317 27.1201 13.317C26.6301 13.317 26.2002 12.921 26.2002 12.433V10.255C26.2002 9.45 25.5402 8.798 24.7402 8.798H22.5801C22.0901 8.798 21.6904 8.384 21.6904 7.896C21.6904 7.408 22.0901 7.01199 22.5801 7.01199H24.7002C26.5202 7.01199 28 8.48701 28 10.308V12.433Z", "fill", "white"], ["id", "zoomSelectOptionMenuShow", 1, "zoomSelectContainerShow"], [1, "zoomSelectStyle"], [3, "click"], ["width", "36", "height", "35", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectGPath"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.985 13.7414H12.7449C12.2213 13.7414 11.8102 14.1911 11.8543 14.7155L12.8087 26.2216C12.8453 26.6618 13.2104 27.0001 13.6487 27.0001H23.0803C23.5186 27.0001 23.8846 26.6618 23.9212 26.2216L24.8756 14.7155C24.9188 14.1911 24.5077 13.7414 23.985 13.7414ZM11.846 12.171C11.2689 12.171 10.8738 11.6353 11.0371 11.0769L11.4369 9.55763C11.5288 9.24962 11.7635 9.04838 12.0844 8.98507C12.4054 8.92082 14.8792 8.69785 15.4798 8.661C15.752 8.64683 15.92 8.41912 15.9622 8.28496C16.0054 8.15079 16.2869 7.5291 16.4624 7.30423C16.5431 7.20219 16.8988 7 18.3647 7C19.8315 7 20.1947 7.20219 20.2745 7.30423C20.45 7.5291 20.7315 8.15079 20.7747 8.28496C20.8169 8.41912 20.9858 8.64683 21.257 8.661C21.8577 8.69785 24.3315 8.92082 24.6524 8.98507C24.9743 9.04838 25.2089 9.24962 25.3009 9.55763L25.6998 11.0769C25.8631 11.6353 25.468 12.171 24.8908 12.171H11.846Z", "fill", "#1A3763"], ["d", "M22.0527 16.4736L21.5264 24.3684", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M14.6841 16.4736L15.2104 24.3684", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M18.3684 16.4736V24.3684", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["matTooltip", "Copy", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M7 9.22222C7 7.99492 7.98969 7 9.21053 7H19.856C21.0768 7 22.0665 7.99492 22.0665 9.22222V18.5033C22.0665 19.7306 21.0768 20.7255 19.856 20.7255H9.21053C7.98969 20.7255 7 19.7306 7 18.5033V9.22222ZM19.856 9.22222L9.21053 9.22222V18.5033H19.856V9.22222Z", "fill", "#1A3763"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.4335 13.2745H25.7895C27.0103 13.2745 28 14.2694 28 15.4967V24.7778C28 26.0051 27.0103 27 25.7895 27H15.144C13.9232 27 12.9335 26.0051 12.9335 24.7778V21.7059H15.144V24.7778H25.7895V15.4967H23.4335V13.2745Z", "fill", "#1A3763"], ["matTooltip", "Paste", 1, "button", 3, "click"], ["width", "36", "height", "35", "rx", "4", "fill", "#497284", "fill-opacity", "0.09", 1, "rectPath"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M21.562 11.4842C20.8267 11.298 20.3152 10.6948 20.3152 9.94391V9.3175C20.3152 8.03729 19.2666 7 17.9727 7H17.9258C16.6328 7 15.5845 8.03729 15.5845 9.3175V9.95001C15.5845 10.6959 15.0771 11.298 14.3467 11.4872C13.3965 11.7311 12.6958 12.6379 12.6958 13.655V13.6833C12.6958 14.0618 13.0056 14.3684 13.3894 14.3684H22.5295C22.9121 14.3684 23.2222 14.0618 23.2222 13.6833V13.655C23.2222 12.6348 22.5164 11.7261 21.562 11.4842ZM22.2937 8.05261V9.13354C22.2937 9.65564 22.739 10.079 23.2881 10.079H25.1978C25.5645 10.079 25.8618 10.3616 25.8618 10.7114V24.3433C25.8618 24.6931 25.5645 24.9757 25.1978 24.9757H10.8035C10.4365 24.9757 10.1382 24.6931 10.1382 24.3433V10.7114C10.1382 10.3616 10.4365 10.079 10.8035 10.079H12.7119C13.2622 10.079 13.7063 9.65564 13.7063 9.13354V8.05261H9.5271C8.68408 8.05261 8 8.70288 8 9.50543V25.5471C8 26.3497 8.68408 27 9.5271 27H26.4717C27.3149 27 28 26.3497 28 25.5471V9.50543C28 8.70288 27.3149 8.05261 26.4717 8.05261H22.2937ZM16.9473 10.1587C16.9473 10.74 17.4189 11.2106 18 11.2106C18.5808 11.2106 19.0525 10.74 19.0525 10.1587C19.0525 9.57581 18.5808 9.10529 18 9.10529C17.4189 9.10529 16.9473 9.57581 16.9473 10.1587Z", "fill", "#1A3763", 1, "pathRect"], [1, "outings"], ["class", "button", "matTooltip", "Out-Fold New Diagram", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Out-Zoom New Diagram as Object", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Out-Zoom New Diagram as Process", 3, "click", 4, "ngIf"], ["matTooltip", "Out-Fold New Diagram", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M13.1429 22.25H20.8571V17.25H13.1429V22.25ZM20.8571 23.5C21.5643 23.5 22.1429 22.9406 22.1429 22.25V17.25C22.1429 16.5594 21.5643 16 20.8571 16H13.1429C12.4357 16 11.8571 16.5594 11.8571 17.25V22.25C11.8571 22.9406 12.4357 23.5 13.1429 23.5H16.3571V25.0625H11.2143C10.1471 25.0625 9.28571 25.9019 9.28571 26.9375V28.5H8.64286C8.28929 28.5 8 28.7237 8 29V30.5C8 30.7763 8.28929 31 8.64286 31H11.2143C11.5679 31 11.8571 30.7763 11.8571 30.5V29C11.8571 28.7237 11.5679 28.5 11.2143 28.5H10.5714V26.9375C10.5714 26.5925 10.8607 26.3125 11.2143 26.3125H16.3571V28.5H15.7143C15.3607 28.5 15.0714 28.7237 15.0714 29V30.5C15.0714 30.7763 15.3607 31 15.7143 31H18.2857C18.6393 31 18.9286 30.7763 18.9286 30.5V29C18.9286 28.7237 18.6393 28.5 18.2857 28.5H17.6429V26.3125H22.7857C23.1393 26.3125 23.4286 26.5925 23.4286 26.9375V28.5H22.7857C22.4321 28.5 22.1429 28.7237 22.1429 29V30.5C22.1429 30.7763 22.4321 31 22.7857 31H25.3571C25.7107 31 26 30.7763 26 30.5V29C26 28.7237 25.7107 28.5 25.3571 28.5H24.7143V26.9375C24.7143 25.9019 23.8529 25.0625 22.7857 25.0625H17.6429V23.5H20.8571Z", "fill", "#5A6F8F"], ["opacity", "0.7", "d", "M7 10C7 9.44772 7.44772 9 8 9H11C11.5523 9 12 9.44772 12 10V11C12 11.5523 11.5523 12 11 12H8C7.44772 12 7 11.5523 7 11V10Z", "fill", "#1A3763"], ["opacity", "0.7", "d", "M14 7C14 6.44772 14.4477 6 15 6H18C18.5523 6 19 6.44772 19 7V8C19 8.55228 18.5523 9 18 9H15C14.4477 9 14 8.55228 14 8V7Z", "fill", "#1A3763"], ["opacity", "0.7", "x", "21", "y", "4", "width", "5", "height", "3", "rx", "1", "fill", "#1A3763"], ["d", "M26.8328 22.8451C26.6851 22.9881 26.4406 22.9435 26.3528 22.7576L23.8554 17.4661C23.7512 17.2453 23.9403 16.9992 24.1805 17.0429L30.8813 18.264C31.1215 18.3077 31.2116 18.6048 31.0362 18.7746L26.8328 22.8451Z", "fill", "#5A6F8F"], ["d", "M22.6099 10.2671V10.2671C26.515 11.0946 28.8718 15.0909 27.7062 18.9088L27.6048 19.2412", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["matTooltip", "Out-Zoom New Diagram as Object", 1, "button", 3, "click"], ["opacity", "0.7", "d", "M32.3 26C32.3 29.3945 29.1224 32.3 25 32.3C20.8776 32.3 17.7 29.3945 17.7 26C17.7 22.6055 20.8776 19.7 25 19.7C29.1224 19.7 32.3 22.6055 32.3 26Z", "stroke", "#1A3763", "stroke-width", "1.4"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M22.4286 11.5C22.4286 15.6523 18.445 19.4167 13 19.4167C7.555 19.4167 3.57143 15.6523 3.57143 11.5C3.57143 7.34771 7.555 3.58333 13 3.58333C18.445 3.58333 22.4286 7.34771 22.4286 11.5ZM24 11.5C24 16.7464 19.0736 21 13 21C6.92643 21 2 16.7464 2 11.5C2 6.25363 6.92643 2 13 2C19.0736 2 24 6.25363 24 11.5ZM10.6429 5.87916V7.77916C10.6429 8.12907 10.9964 8.4125 11.4286 8.4125H14.5714C15.0036 8.4125 15.3571 8.12907 15.3571 7.77916V5.87916C15.3571 5.52925 15.0036 5.24584 14.5714 5.24584H11.4286C10.9964 5.24584 10.6429 5.52925 10.6429 5.87916ZM10.6429 10.55V12.45C10.6429 12.7999 10.9964 13.0833 11.4286 13.0833H14.5714C15.0036 13.0833 15.3571 12.7999 15.3571 12.45V10.55C15.3571 10.2001 15.0036 9.91667 14.5714 9.91667H11.4286C10.9964 9.91667 10.6429 10.2001 10.6429 10.55ZM10.6429 17.2V15.3C10.6429 14.9501 10.9964 14.6667 11.4286 14.6667H14.5714C15.0036 14.6667 15.3571 14.9501 15.3571 15.3V17.2C15.3571 17.5499 15.0036 17.8333 14.5714 17.8333H11.4286C10.9964 17.8333 10.6429 17.5499 10.6429 17.2Z", "fill", "#5A6F8F"], ["opacity", "0.7", "x", "22.7", "y", "22", "width", "4.5", "height", "3", "rx", "1", "fill", "#1A3763"], ["opacity", "0.7", "d", "M22.1001 27.3C22.1001 26.7478 22.5478 26.3 23.1001 26.3H27.1001C27.6524 26.3 28.1001 26.7478 28.1001 27.3V29.3C28.1001 29.8523 27.6524 30.3 27.1001 30.3H23.1001C22.5478 30.3 22.1001 29.8523 22.1001 29.3V27.3Z", "fill", "#1A3763"], ["d", "M28.9693 18.8451C28.8216 18.9881 28.5771 18.9435 28.4893 18.7576L25.9919 13.4661C25.8876 13.2453 26.0767 12.9992 26.3169 13.0429L33.0178 14.264C33.2579 14.3077 33.3481 14.6048 33.1727 14.7746L28.9693 18.8451Z", "fill", "#5A6F8F"], ["d", "M24.5 5.5V5.5C28.4051 6.32749 30.7619 10.3238 29.5964 14.1417L29.4949 14.4742", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M11.127 27.9277C11.127 28.7676 10.9785 29.5039 10.6816 30.1367C10.3848 30.7695 9.95898 31.2578 9.4043 31.6016C8.85352 31.9453 8.2207 32.1172 7.50586 32.1172C6.79883 32.1172 6.16797 31.9473 5.61328 31.6074C5.05859 31.2676 4.62891 30.7832 4.32422 30.1543C4.01953 29.5215 3.86523 28.7949 3.86133 27.9746V27.5527C3.86133 26.7129 4.01172 25.9746 4.3125 25.3379C4.61719 24.6973 5.04492 24.207 5.5957 23.8672C6.15039 23.5234 6.7832 23.3516 7.49414 23.3516C8.20508 23.3516 8.83594 23.5234 9.38672 23.8672C9.94141 24.207 10.3691 24.6973 10.6699 25.3379C10.9746 25.9746 11.127 26.7109 11.127 27.5469V27.9277ZM9.3457 27.541C9.3457 26.6465 9.18555 25.9668 8.86523 25.502C8.54492 25.0371 8.08789 24.8047 7.49414 24.8047C6.9043 24.8047 6.44922 25.0352 6.12891 25.4961C5.80859 25.9531 5.64648 26.625 5.64258 27.5117V27.9277C5.64258 28.7988 5.80273 29.4746 6.12305 29.9551C6.44336 30.4355 6.9043 30.6758 7.50586 30.6758C8.0957 30.6758 8.54883 30.4453 8.86523 29.9844C9.18164 29.5195 9.3418 28.8438 9.3457 27.957V27.541Z", "fill", "#5A6F8F"], ["matTooltip", "Out-Zoom New Diagram as Process", 1, "button", 3, "click"], ["d", "M7.14648 28.9941V32H5.38867V23.4688H8.7168C9.35742 23.4688 9.91992 23.5859 10.4043 23.8203C10.8926 24.0547 11.2676 24.3887 11.5293 24.8223C11.791 25.252 11.9219 25.7422 11.9219 26.293C11.9219 27.1289 11.6348 27.7891 11.0605 28.2734C10.4902 28.7539 9.69922 28.9941 8.6875 28.9941H7.14648ZM7.14648 27.5703H8.7168C9.18164 27.5703 9.53516 27.4609 9.77734 27.2422C10.0234 27.0234 10.1465 26.7109 10.1465 26.3047C10.1465 25.8867 10.0234 25.5488 9.77734 25.291C9.53125 25.0332 9.19141 24.9004 8.75781 24.8926H7.14648V27.5703Z", "fill", "#5A6F8F"], ["matTooltip", "Connect Sub-Model", 1, "button", 3, "click"], ["d", "M21 9.38358C21 9.34299 21 9.29788 21 9.25729C21 9.25729 21 9.23933 21 9.23031C21 9.18521 20.9594 9.13558 20.9594 9.09048C20.9594 9.08146 20.9594 9.07241 20.9594 9.05888C20.9191 9.04986 20.9194 8.99125 20.8791 8.95968V8.92357C20.8388 8.88298 20.7982 8.8469 20.7578 8.81082L16.2015 4.19276C16.1612 4.16119 16.1208 4.13416 16.1208 4.11161L16.0806 4.09356C16.0403 4.07552 15.9999 4.06205 15.9999 4.04852L15.9597 4.03498L15.879 4.00338H15.8388C15.7985 3.99887 15.7579 3.99887 15.7175 4.00338H6.72572C6.52411 4.00338 6.32258 4.08456 6.20161 4.23339C6.08064 4.38221 6 4.58064 6 4.78809V23.1927C6 23.4092 6.08064 23.6121 6.20161 23.7655C6.32258 23.9143 6.52411 24 6.72572 24H20.2743C20.4759 24 20.6774 23.9143 20.7984 23.7655C20.9194 23.6121 21 23.4092 21 23.1927V9.40615C21 9.40615 21 9.3926 21 9.38358ZM16.4437 6.58751L18.4192 8.60338H16.4437V6.58751ZM7.41128 22.3945V5.59536H14.9918V9.40615C14.9918 9.61811 15.0727 9.82106 15.234 9.97439C15.3549 10.1232 15.5159 10.2089 15.7175 10.2089H19.5482V22.3945H7.41128Z", "fill", "#5A6F8F"], ["d", "M31.3791 16.2032V16.1389L26.8694 11.5681C26.8683 11.5672 26.867 11.5663 26.8657 11.5652C26.8545 11.5566 26.8347 11.5411 26.8139 11.5225C26.8118 11.5216 26.8097 11.5206 26.8077 11.5196C26.8009 11.5163 26.7878 11.51 26.771 11.5005L26.7454 11.5034H26.7175H17.7257C17.6447 11.5034 17.5982 11.5382 17.5896 11.5488C17.5332 11.6182 17.5 11.7075 17.5 11.7881V30.1927C17.5 30.2847 17.5348 30.3787 17.591 30.4517C17.6059 30.4684 17.6552 30.5 17.7257 30.5H31.2743C31.3448 30.5 31.3941 30.4684 31.409 30.4517C31.4652 30.3787 31.5 30.2847 31.5 30.1927L31.3791 16.2032ZM31.3791 16.2032L31.4952 16.2941M31.3791 16.2032L31.4952 16.2941M31.4952 16.2941C31.4968 16.2987 31.4984 16.3032 31.5 16.3075V16.3076V16.3079V16.3081V16.3084V16.3086V16.3089V16.3091V16.3094V16.3096V16.3099V16.3101V16.3104V16.3106V16.3109V16.3111V16.3114V16.3116V16.3119V16.3121V16.3124V16.3127V16.3129V16.3132V16.3134V16.3137V16.3139V16.3142V16.3144V16.3147V16.3149V16.3152V16.3154V16.3157V16.3159V16.3162V16.3164V16.3167V16.3169V16.3172V16.3174V16.3177V16.3179V16.3182V16.3184V16.3187V16.3189V16.3192V16.3194V16.3197V16.3199V16.3202V16.3204V16.3207V16.3209V16.3212V16.3214V16.3217V16.3219V16.3222V16.3224V16.3227V16.3229V16.3232V16.3234V16.3237V16.3239V16.3242V16.3244V16.3247V16.325V16.3252V16.3255V16.3257V16.326V16.3262V16.3265V16.3267V16.327V16.3272V16.3275V16.3277V16.328V16.3282V16.3285V16.3287V16.329V16.3292V16.3295V16.3297V16.33V16.3302V16.3305V16.3307V16.331V16.3312V16.3315V16.3317V16.332V16.3322V16.3325V16.3327V16.333V16.3332V16.3335V16.3337V16.334V16.3342V16.3345V16.3347V16.335V16.3352V16.3355V16.3357V16.336V16.3362V16.3365V16.3367V16.337V16.3372V16.3375V16.3377V16.338V16.3382V16.3385V16.3387V16.339V16.3392V16.3395V16.3397V16.34V16.3402V16.3405V16.3407V16.341V16.3412V16.3415V16.3417V16.342V16.3422V16.3425V16.3427V16.343V16.3432V16.3435V16.3437V16.344V16.3442V16.3445V16.3447V16.345V16.3452V16.3455V16.3457V16.346V16.3462V16.3465V16.3467V16.347V16.3472V16.3475V16.3477V16.348V16.3482V16.3485V16.3487V16.349V16.3492V16.3495V16.3497V16.3499V16.3502V16.3504V16.3507V16.3509V16.3512V16.3514V16.3517V16.3519V16.3522V16.3524V16.3527V16.3529V16.3532V16.3534V16.3537V16.3539V16.3542V16.3544V16.3547V16.3549V16.3552V16.3554V16.3556V16.3559V16.3561V16.3564V16.3566V16.3569V16.3571V16.3574V16.3576V16.3579V16.3581V16.3584V16.3586V16.3589V16.3591V16.3593V16.3596V16.3598V16.3601V16.3603V16.3606V16.3608V16.3611V16.3613V16.3616V16.3618V16.362V16.3623V16.3625V16.3628V16.363V16.3633V16.3635V16.3638V16.364V16.3643V16.3645V16.3647V16.365V16.3652V16.3655V16.3657V16.366V16.3662V16.3665V16.3667V16.3669V16.3672V16.3674V16.3677V16.3679V16.3682V16.3684V16.3686V16.3689V16.3691V16.3694V16.3696V16.3699V16.3701V16.3704V16.3706V16.3708V16.3711V16.3713V16.3716V16.3718V16.372V16.3723V16.3725V16.3728V16.373V16.3733V16.3735V16.3737V16.374V16.3742V16.3745V16.3747V16.375V16.3752V16.3754V16.3757V16.3759V16.3762V16.3764V16.3766V16.3769V16.3771V16.3774V16.3776V16.3778V16.3781V16.3783V16.3786V16.3788V16.379V16.3793V16.3795V16.3798V16.38V16.3802V16.3805V16.3807V16.381V16.3812V16.3814V16.3817V16.3819V16.3821V16.3824V16.3826V16.3829V16.3831V16.3833V16.3836V16.3836V16.3837V16.3837V16.3838V16.3838V16.3839V16.3839V16.384V16.3841V16.3841V16.3842V16.3842V16.3843V16.3843V16.3844V16.3844V16.3845V16.3845V16.3846V16.3847V16.3847V16.3848V16.3848V16.3849V16.3849V16.385V16.385V16.3851V16.3851V16.3852V16.3853V16.3853V16.3854V16.3854V16.3855V16.3855V16.3856V16.3857V16.3857V16.3858V16.3858V16.3859V16.3859V16.386V16.386V16.3861V16.3862V16.3862V16.3863V16.3863V16.3864V16.3864V16.3865V16.3866V16.3866V16.3867V16.3867V16.3868V16.3868V16.3869V16.387V16.387V16.3871V16.3871V16.3872V16.3873V16.3873V16.3874V16.3874V16.3875V16.3875V16.3876V16.3877V16.3877V16.3878V16.3878V16.3879V16.388V16.388V16.3881V16.3881V16.3882V16.3882V16.3883V16.3884V16.3884V16.3885V16.3885V16.3886V16.3887V16.3887V16.3888V16.3888V16.3889V16.3889V16.389V16.3891V16.3891V16.3892V16.3892V16.3893V16.3894V16.3894V16.3895V16.3895V16.3896V16.3897V16.3897V16.3898V16.3898V16.3899V16.39V16.39V16.3901V16.3901V16.3902V16.3903V16.3903V16.3904V16.3904V16.3905V16.3906V16.3906V16.3907V16.3907V16.3908V16.3908V16.3909V16.391V16.391V16.3911V16.3911V16.3912V16.3913V16.3913V16.3914V16.3914V16.3915V16.3916V16.3916V16.3917V16.3917V16.3918V16.3919V16.3919V16.392V16.392V16.3921V16.3922V16.3922V16.3923V16.3923V16.3924V16.3925V16.3925V16.3926V16.3926V16.3927V16.3927V16.3928V16.3929V16.3929V16.393V16.393V16.3931V16.3932V16.3932V16.3933V16.3933V16.3934V16.3935V16.3935V16.3936V16.3936V16.3937V16.3937V16.3938V16.3939V16.3939V16.394V16.394V16.3941V16.3942V16.3942V16.3943V16.3943V16.3944V16.3944V16.3945V16.3946V16.3946V16.3947V16.3947V16.3948V16.3949V16.3949V16.395V16.395V16.3951V16.3951V16.3952V16.3953V16.3953V16.3954V16.3954V16.3955V16.3955V16.3956V16.3957V16.3957V16.3958V16.3958V16.3959V16.3959V16.396V16.3961V16.3961V16.3962V16.3962V16.3963V16.3963V16.3964V16.3964V16.3965V16.3966V16.3966V16.3967V16.3967V16.3968V16.3968V16.3969V16.3969V16.397V16.3971V16.3971V16.3972V16.3972V16.3973V16.3973V16.3974V16.3974V16.3975V16.3975V16.3976V16.3977V16.3977V16.3978V16.3978V16.3979V16.3979V16.398V16.398V16.3981V16.3981V16.3982V16.3982V16.3983V16.3983V16.3984V16.3985V16.3985V16.3986V16.3986V16.3987V16.3987V16.3988V16.3988V16.3989V16.3989V16.399V16.399V16.3991V16.3991V16.3992V16.3992V16.3993V16.3993V16.3994V16.3994V16.3995V16.3995V16.3996V16.3996V16.3997V16.3997V16.3998V16.3998V16.3999V16.3999V16.4V16.4V16.4001V16.4001V16.4002V16.4002V16.4003V16.4003V16.4004V16.4004V16.4005V16.4005V16.4006V16.4006V16.4007V16.4007V16.4007V16.4008V16.4008V16.4009V16.4009V16.401V16.401V16.4011V16.4011V16.4012V16.4012V16.4012V16.4013V16.4013V16.4014L31.4952 16.2941ZM27.4437 13.5875L27.8008 13.2375L26.9437 12.3629V13.5875H27.4437ZM27.4437 13.5875L29.4192 15.6034M27.4437 13.5875V15.6034M29.4192 15.6034H27.4437M29.4192 15.6034L29.7763 15.2534L30.6093 16.1034H29.4192V15.6034ZM27.4437 15.6034H26.9437V16.1034H27.4437V15.6034ZM18.4113 29.3945H17.9113V29.8945H18.4113V29.3945ZM18.4113 29.3945H30.5482H18.4113ZM26.4918 12.5954V12.0954H25.9918V12.5954H26.4918Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M17.5153 14.9089H14.9179L13.8096 13.2794C14.0174 13.1083 14.1558 12.9029 14.2597 12.6735C14.3636 12.4476 14.4329 12.1977 14.4329 11.9478C14.4329 10.8729 13.4288 10 12.2166 10C11.0045 10 10 10.8729 10 11.9478C10 13.0226 11.0045 13.8922 12.2166 13.8922C12.3898 13.8922 12.5627 13.8716 12.7013 13.8339L13.8441 15.4839V17.5001C13.8441 17.6336 13.8789 17.7603 13.9828 17.8527C14.0866 17.9486 14.2252 18 14.3291 18H17.4805C17.619 18 17.7578 17.9486 17.8617 17.8527C17.9656 17.7603 18 17.6336 18 17.5001V15.4086C18 15.2786 17.9656 15.1485 17.8617 15.056C17.7578 14.9636 17.6192 14.9089 17.5153 14.9089ZM14.8486 17.0004V15.9118H16.9959V17.0004H14.8486ZM12.2166 11.092C12.84 11.092 13.3246 11.4788 13.3246 11.9512C13.3246 12.4236 12.8054 12.807 12.2166 12.807C11.5932 12.807 11.1083 12.4202 11.1083 11.9512C11.1083 11.4788 11.5932 11.0851 12.2166 11.0851V11.092Z", "fill", "#5A6F8F"], ["x", "18", "y", "17", "width", "12", "height", "12", "fill", "#E9ECEE"], ["width", "8", "height", "5", "transform", "matrix(1 0 0 -1 18 17)", "fill", "#E9ECEE"], ["x", "0.682547", "y", "-0.0667085", "width", "3.69237", "height", "5.95642", "rx", "1.5", "transform", "matrix(0.611753 -0.791048 0.75334 0.657631 6.31525 23.8425)", "stroke", "#5A6F8F"], ["x", "0.682547", "y", "-0.0667085", "width", "3.69237", "height", "5.95642", "rx", "1.5", "transform", "matrix(0.611753 -0.791048 0.75334 0.657631 13.3026 29.9421)", "stroke", "#5A6F8F"], ["width", "1.17309", "height", "7.45674", "transform", "matrix(0.611753 -0.791048 0.75334 0.657631 10.4189 24.8516)", "fill", "#5A6F8F"], ["d", "M27.5153 21.9089H24.9179L23.8096 20.2794C24.0174 20.1083 24.1558 19.9029 24.2597 19.6735C24.3636 19.4476 24.4329 19.1977 24.4329 18.9478C24.4329 17.8729 23.4288 17 22.2166 17C21.0045 17 20 17.8729 20 18.9478C20 20.0226 21.0045 20.8922 22.2166 20.8922C22.3898 20.8922 22.5627 20.8716 22.7013 20.8339L23.8441 22.4839V24.5001C23.8441 24.6336 23.8789 24.7603 23.9828 24.8527C24.0866 24.9486 24.2252 25 24.3291 25H27.4805C27.619 25 27.7578 24.9486 27.8617 24.8527C27.9656 24.7603 28 24.6336 28 24.5001V22.4086C28 22.2786 27.9656 22.1485 27.8617 22.056C27.7578 21.9636 27.6192 21.9089 27.5153 21.9089ZM24.8486 24.0004V22.9118H26.9959V24.0004H24.8486ZM22.2166 18.092C22.84 18.092 23.3246 18.4788 23.3246 18.9512C23.3246 19.4236 22.8054 19.807 22.2166 19.807C21.5932 19.807 21.1083 19.4202 21.1083 18.9512C21.1083 18.4788 21.5932 18.0851 22.2166 18.0851V18.092Z", "fill", "#5A6F8F"], ["matTooltip", "Views", 1, "button", 3, "click"], ["d", "M8 17L8.41079 16.4797C13.7296 9.74252 24.0283 10.0028 29 17V17", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M29 18L28.5892 18.5203C23.2704 25.2575 12.9717 24.9972 8 18V18", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["cx", "18", "cy", "18", "r", "4.5", "stroke", "#5A6F8F"], ["cx", "18", "cy", "18", "r", "2.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["d", "M18.5 32L14.6029 29H22.3971L18.5 32Z", "fill", "#5A6F8F"], ["d", "M18.5 29L22.3971 32H14.6029L18.5 29Z", "fill", "#5A6F8F"], [1, "extensionsDiv"], [2, "position", "relative", "top", "4px"], ["class", "button", "matTooltip", "Create View", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "Create Unfolded Tree View", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["matTooltip", "Create View", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["d", "M31.4062 6.24805V7.71875H25.5586V6.24805H31.4062ZM29.2852 3.93359V10.1445H27.6855V3.93359H29.2852Z", "fill", "#5A6F8F"], ["matTooltip", "Create Unfolded Tree View", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["x1", "24", "y1", "29.5", "x2", "19", "y2", "29.5", "stroke", "#5A6F8F"], ["x1", "24", "y1", "23.5", "x2", "19", "y2", "23.5", "stroke", "#5A6F8F"], ["d", "M19 10L19.3332 9.62018C23.2667 5.13593 30.3038 5.31817 34 10V10", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M34 10L33.6668 10.3798C29.7333 14.8641 22.6962 14.6818 19 10V10", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["cx", "25.5", "cy", "10.5", "r", "3", "stroke", "#5A6F8F"], ["cx", "25.5", "cy", "10.5", "r", "1.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["x", "3", "y", "3", "width", "7", "height", "5", "rx", "2.5", "fill", "#5A6F8F"], ["x", "10.5", "y", "16.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x", "0.5", "y", "-0.5", "width", "6", "height", "4", "rx", "2", "transform", "matrix(1 0 0 -1 10 14)", "stroke", "#5A6F8F"], ["x1", "6.5", "y1", "7", "x2", "6.5", "y2", "11", "stroke", "#5A6F8F"], ["x1", "6.5", "y1", "10", "x2", "6.5", "y2", "19", "stroke", "#5A6F8F"], ["x1", "19", "y1", "18.5", "x2", "16", "y2", "18.5", "stroke", "#5A6F8F"], ["x1", "11", "y1", "18.5", "x2", "6", "y2", "18.5", "stroke", "#5A6F8F"], ["x1", "10", "y1", "12.5", "x2", "6", "y2", "12.5", "stroke", "#5A6F8F"], ["x", "23.5", "y", "27.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x", "23.5", "y", "21.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x1", "18.5", "y1", "18", "x2", "18.5", "y2", "30", "stroke", "#5A6F8F"], ["matTooltip", "OPM Requirements", 1, "button", 3, "click"], ["d", "M9 5H20.1198L22.0856 6.74741L24 8.44907V26H9V5Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M11 10.5L12 12.5L14.5 9", "stroke", "#5A6F8F"], ["d", "M11 20.5L12 22.5L14.5 19", "stroke", "#5A6F8F"], ["d", "M11 15.5L12 17.5L14.5 14", "stroke", "#5A6F8F"], ["d", "M17 11H22", "stroke", "#5A6F8F"], ["d", "M17 22H22", "stroke", "#5A6F8F"], ["d", "M17 16H22", "stroke", "#5A6F8F"], ["d", "M27 25L30 24.9999L28.6342 27.7317C28.5789 27.8422 28.4211 27.8422 28.3658 27.7317L27 25Z", "fill", "#5A6F8F"], ["d", "M27 4.45015V4.45015C27.6861 3.32953 29.3139 3.32953 30 4.45015V4.45015V6H28.5H27V4.45015Z", "fill", "#5A6F8F"], ["x", "27", "y", "7", "width", "3", "height", "17", "fill", "#5A6F8F"], ["d", "M17 21H22", "stroke", "#5A6F8F"], ["d", "M27 24L30 23.9999L28.6342 26.7317C28.5789 26.8422 28.4211 26.8422 28.3658 26.7317L27 24Z", "fill", "#5A6F8F"], [1, "extensionsDiv", 2, "margin-left", "47px"], ["matTooltip", "Add Requirement", "class", "button", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["matTooltip", "Create a Requirements View", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["d", "M5 6H16.1198L18.0856 7.74741L20 9.44907V27H5V6Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M7 11.5L8 13.5L10.5 10", "stroke", "#5A6F8F"], ["d", "M7 21.5L8 23.5L10.5 20", "stroke", "#5A6F8F"], ["d", "M7 16.5L8 18.5L10.5 15", "stroke", "#5A6F8F"], ["d", "M13 12H18", "stroke", "#5A6F8F"], ["d", "M13 23H18", "stroke", "#5A6F8F"], ["d", "M13 17H18", "stroke", "#5A6F8F"], ["d", "M14 17C14 14.7909 15.7909 13 18 13H28C30.2091 13 32 14.7909 32 17V17C32 19.2091 30.2091 21 28 21H18C15.7909 21 14 19.2091 14 17V17Z", "fill", "#E9ECEE"], ["d", "M13 17L13.4442 16.4936C18.689 10.5146 28.0718 10.7576 33 17V17", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M33 17L32.5558 17.5064C27.311 23.4854 17.9282 23.2424 13 17V17", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["cx", "22.5", "cy", "17.5", "r", "4", "stroke", "#5A6F8F"], ["cx", "22.5", "cy", "17.5", "r", "2", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["class", "button", "matTooltip", "Connect Requirements Stereotype", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "Remove Requirements Stereotype", 3, "click", 4, "ngIf"], ["matTooltip", "Add Requirement", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["d", "M8 5H21.3263L23.6894 7.09595L26 9.14537V30H8V5Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M12 9.5L13 11.5L16.5 7", "stroke", "#5A6F8F"], ["d", "M21.0469 18.3975L19.7744 20.2649L18.7714 18.2104C18.7158 18.0963 18.8046 17.966 18.9225 17.9887L21.0469 18.3975Z", "fill", "#5A6F8F"], ["d", "M32.6095 27.5051V27.5051C32.9814 28.4544 32.291 29.4675 31.337 29.3725V29.3725L30.4204 28.6505L31.0566 27.7168L31.6928 26.7831L32.6095 27.5051Z", "fill", "#5A6F8F"], ["width", "2.25976", "height", "12.7988", "transform", "matrix(-0.563107 0.826384 -0.785578 -0.618763 31.1013 26.3171)", "fill", "#5A6F8F"], ["x", "10.5", "y", "8.5", "width", "5", "height", "5", "stroke", "#5A6F8F"], ["x", "10.5", "y", "22.5", "width", "5", "height", "5", "stroke", "#5A6F8F"], ["x", "10.5", "y", "15.5", "width", "5", "height", "5", "stroke", "#5A6F8F"], ["d", "M10.6906 11.5366L16.3098 7.94591L17.851 8.16038L19.3467 8.3685L24.7359 16.8023L17.1521 21.6484L10.6906 11.5366Z", "stroke", "#5A6F8F"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M17.5504 4.73918C17.1744 4.45339 17.1769 3.91229 17.5595 3.6377L18.5604 2.8595C18.7691 2.70604 19.0166 2.68946 19.2548 2.80667C19.5 2.92818 21.2105 4.00224 21.6176 4.27412C21.7995 4.39817 22.0207 4.33526 22.112 4.26891C22.2098 4.20749 22.6949 3.946 22.915 3.88527C23.0166 3.85918 23.3489 3.90704 24.2955 4.62644C25.2486 5.35076 25.3829 5.65746 25.385 5.76239C25.3919 5.99557 25.2698 6.533 25.2304 6.63877C25.1974 6.74946 25.1965 6.97977 25.3647 7.1218C25.7357 7.4412 27.2287 8.80177 27.4049 9.00055C27.5817 9.19868 27.6383 9.44639 27.5463 9.68854L27.0646 10.8613C26.896 11.2985 26.3812 11.4503 26.0051 11.1645L17.5504 4.73918Z", "fill", "#1A3763"], ["d", "M14.6816 13.1396L18.0522 10.9858", "stroke", "#5A6F8F"], ["d", "M17.9124 18.1956L21.283 16.0417", "stroke", "#5A6F8F"], ["d", "M16.2971 15.6677L19.6677 13.5139", "stroke", "#5A6F8F"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.1559 19.0669H12.8781C12.4027 19.0669 12.0272 19.4719 12.0638 19.9444L12.9415 30.2998C12.9781 30.6958 13.308 31 13.7104 31H22.3326C22.7349 31 23.064 30.6958 23.1005 30.2998L23.9783 19.9444C24.0149 19.4719 23.6405 19.0669 23.1559 19.0669Z", "fill", "#1A3763"], ["opacity", "0.7", "d", "M21.3913 20.1523L20.9163 27.257", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "d", "M14.6523 20.1523L15.1372 27.257", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "d", "M18.0266 20.1523V27.257", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x", "10.5", "y", "27.5", "width", "14", "height", "5", "rx", "2.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["cx", "21", "cy", "30", "r", "2", "fill", "#E9ECEE"], ["d", "M10 4H21.1198L23.0856 5.74741L25 7.44907V25H10V4Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M12 9.5L13 11.5L15.5 8", "stroke", "#5A6F8F"], ["d", "M12 19.5L13 21.5L15.5 18", "stroke", "#5A6F8F"], ["d", "M12 14.5L13 16.5L15.5 13", "stroke", "#5A6F8F"], ["d", "M18 10H23", "stroke", "#5A6F8F"], ["d", "M18 21H23", "stroke", "#5A6F8F"], ["d", "M18 15H23", "stroke", "#5A6F8F"], ["matTooltip", "Connect Requirements Stereotype", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["d", "M19.6313 10.5815C19.6313 10.4165 19.606 10.2684 19.5552 10.1372C19.5086 10.0018 19.4198 9.87907 19.2886 9.76904C19.1574 9.65479 18.9733 9.54264 18.7363 9.43262C18.4993 9.32259 18.1925 9.20833 17.8159 9.08984C17.397 8.95443 16.9992 8.80208 16.6226 8.63281C16.2502 8.46354 15.9201 8.26676 15.6323 8.04248C15.3488 7.81396 15.1245 7.54948 14.9595 7.24902C14.7987 6.94857 14.7183 6.59945 14.7183 6.20166C14.7183 5.81657 14.8029 5.46745 14.9722 5.1543C15.1414 4.83691 15.3784 4.56608 15.6831 4.3418C15.9878 4.11328 16.3475 3.93766 16.7622 3.81494C17.1812 3.69222 17.6403 3.63086 18.1396 3.63086C18.821 3.63086 19.4155 3.75358 19.9233 3.99902C20.4312 4.24447 20.8247 4.58089 21.104 5.0083C21.3875 5.43571 21.5293 5.92448 21.5293 6.47461H19.6377C19.6377 6.20378 19.5806 5.9668 19.4663 5.76367C19.3563 5.55632 19.187 5.39339 18.9585 5.2749C18.7342 5.15641 18.4507 5.09717 18.1079 5.09717C17.7778 5.09717 17.5028 5.14795 17.2827 5.24951C17.0627 5.34684 16.8976 5.48014 16.7876 5.64941C16.6776 5.81445 16.6226 6.00065 16.6226 6.20801C16.6226 6.36458 16.6606 6.50635 16.7368 6.6333C16.8172 6.76025 16.9357 6.87874 17.0923 6.98877C17.2489 7.0988 17.4414 7.20247 17.6699 7.2998C17.8984 7.39714 18.1629 7.49235 18.4634 7.58545C18.967 7.73779 19.4092 7.90918 19.79 8.09961C20.1751 8.29004 20.4967 8.50374 20.7549 8.74072C21.013 8.9777 21.2077 9.24642 21.3389 9.54688C21.4701 9.84733 21.5356 10.188 21.5356 10.5688C21.5356 10.9709 21.4574 11.3306 21.3008 11.6479C21.1442 11.9653 20.9178 12.234 20.6216 12.4541C20.3254 12.6742 19.972 12.8413 19.5615 12.9556C19.151 13.0698 18.6919 13.127 18.1841 13.127C17.7271 13.127 17.2764 13.0677 16.832 12.9492C16.3877 12.8265 15.9836 12.6424 15.6196 12.397C15.2599 12.1515 14.9722 11.8384 14.7563 11.4575C14.5405 11.0767 14.4326 10.626 14.4326 10.1055H16.3433C16.3433 10.3932 16.3877 10.6366 16.4766 10.8354C16.5654 11.0343 16.6903 11.1951 16.8511 11.3179C17.0161 11.4406 17.2108 11.5295 17.4351 11.5845C17.6636 11.6395 17.9132 11.667 18.1841 11.667C18.5142 11.667 18.785 11.6204 18.9966 11.5273C19.2124 11.4342 19.3711 11.3052 19.4727 11.1401C19.5785 10.9751 19.6313 10.7889 19.6313 10.5815Z", "fill", "#5A6F8F"], ["d", "M9 3L5 8.5L9 14", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M14 3L9 8.5L14 14", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M22.5 14L27.5 8.5L22.5 3", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M11.75 15.75H21.0316L22.6793 17.0645L24.25 18.3176V31.25H11.75V15.75Z", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M13 19.2857L14.1429 21L17 18", "stroke", "#5A6F8F"], ["d", "M13 23.2857L14.1429 25L17 22", "stroke", "#5A6F8F"], ["d", "M13 27.2857L14.1429 29L17 26", "stroke", "#5A6F8F"], ["d", "M18 20H23", "stroke", "#5A6F8F"], ["d", "M18 28H23", "stroke", "#5A6F8F"], ["d", "M18 24H23", "stroke", "#5A6F8F"], ["matTooltip", "Remove Requirements Stereotype", 1, "button", 3, "click"], ["x", "30.595", "y", "2.65918", "width", "2.4792", "height", "39.8954", "transform", "rotate(44.6511 30.595 2.65918)", "fill", "#5A6F8F"], ["d", "M27.5 14L31.5 8.5L27.5 3", "stroke", "#5A6F8F", "stroke-width", "2"], ["matTooltip", "Manage Image in Things", 1, "button", 3, "click"], ["x", "6", "y", "8", "width", "24", "height", "16", "rx", "1", "fill", "#5A6F8F"], ["d", "M8 22V19.5161L12.3564 15.2581L14.7327 17.3871L21.8614 11L28 15.9677V22H8Z", "fill", "#E9ECEE"], ["cx", "10.5", "cy", "12", "r", "2.5", "fill", "#E9ECEE"], [1, "extensionsDiv", 2, "margin-left", "86px"], [2, "position", "relative", "top", "4px", "display", "-webkit-box"], ["matTooltip", "Image by URL", 1, "button", 3, "click"], ["width", "36", "height", "36", "viewBox", "0 0 36 36", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["x", "6.5", "y", "6.5", "width", "18", "height", "13", "rx", "0.5", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M8 18V15.9677L11.2673 12.4839L13.0495 14.2258L18.396 9L23 13.0645V18H8Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["cx", "10", "cy", "10", "r", "1.5", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["opacity", "0.7", "d", "M26.719 21.3526L28.6679 19.3813C30.2701 17.7608 33.0319 18.8821 33.0509 21.1608V21.1608C33.0549 21.6328 32.8657 22.0859 32.5273 22.4149L29.3741 25.4809C28.4674 26.3625 27.0344 26.3962 26.0874 25.558V25.558", "stroke", "#1A3763", "stroke-width", "1.5"], ["opacity", "0.7", "d", "M26.4429 28.2301L24.7184 30.1199C23.0944 31.8995 20.1305 30.7646 20.1104 28.3555V28.3555C20.1065 27.892 20.2827 27.445 20.6019 27.1089L23.7888 23.7518C24.6726 22.8208 26.145 22.7862 27.0716 23.6747V23.6747", "stroke", "#1A3763", "stroke-width", "1.5"], ["class", "button", "matTooltip", "Add From Pool and Manage", 3, "click", 4, "ngIf"], ["matTooltip", "OPD Show Options", 1, "button", 3, "click"], ["d", "M6.35226 18.2101C6.45806 18.0338 6.70582 18.0137 6.83857 18.1707L10.6165 22.6388C10.7742 22.8253 10.655 23.1119 10.4116 23.1316L3.62263 23.6805C3.37927 23.7002 3.21558 23.4364 3.34122 23.2271L6.35226 18.2101Z", "fill", "#5A6F8F"], ["d", "M14.1131 29.9508V29.9508C10.1267 30.1587 6.81869 26.9057 6.95989 22.9163L6.97219 22.5689", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M29.2877 16.3081C29.1768 16.4812 28.9285 16.4939 28.8005 16.3331L25.1561 11.7553C25.0041 11.5643 25.1317 11.2814 25.3755 11.2689L32.1778 10.9207C32.4216 10.9083 32.5774 11.1767 32.4457 11.3823L29.2877 16.3081Z", "fill", "#5A6F8F"], ["d", "M21.8773 4.3431V4.3431C25.8681 4.25301 29.0785 7.60238 28.8196 11.5858L28.797 11.9327", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M27.4667 18.8667H30C31.1046 18.8667 32 19.7621 32 20.8667V26C32 27.6569 30.6569 29 29 29H19C17.3431 29 16 27.6569 16 26V21.8667C16 20.2098 17.3431 18.8667 19 18.8667H20.2667C20.2667 17.8357 21.1024 17 22.1333 17H25.6C26.6309 17 27.4667 17.8357 27.4667 18.8667Z", "fill", "#5A6F8F"], ["cx", "24", "cy", "24", "r", "4", "fill", "#F8F8F8"], ["cx", "24", "cy", "24", "r", "2", "fill", "#5A6F8F"], ["d", "M28 21V20H29.5H31V21H28Z", "fill", "#F8F8F8"], ["d", "M12.1406 5.625V17H9.80469V5.625H12.1406ZM15.6406 5.625V7.46094H6.35938V5.625H15.6406Z", "fill", "#5A6F8F"], ["style", "margin-left: 4px; margin-right: 4px;", 4, "ngIf"], ["matTooltip", "Add From Pool and Manage", 1, "button", 3, "click"], ["x", "9.5", "y", "8.5", "width", "21", "height", "15", "rx", "0.5", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M11 22V19.5161L14.9208 15.2581L17.0594 17.3871L23.4752 11L29 15.9677V22H11Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M14.5 12.5C14.5 13.7145 13.7301 14.5 13 14.5C12.2699 14.5 11.5 13.7145 11.5 12.5C11.5 11.2855 12.2699 10.5 13 10.5C13.7301 10.5 14.5 11.2855 14.5 12.5Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["x", "7.5", "y", "10.5", "width", "21", "height", "15", "rx", "0.5", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M9 24V21.5161L12.9208 17.2581L15.0594 19.3871L21.4752 13L27 17.9677V24H9Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M12.5 14.5C12.5 15.7145 11.7301 16.5 11 16.5C10.2699 16.5 9.5 15.7145 9.5 14.5C9.5 13.2855 10.2699 12.5 11 12.5C11.7301 12.5 12.5 13.2855 12.5 14.5Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["x", "5.5", "y", "12.5", "width", "21", "height", "15", "rx", "0.5", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["d", "M7 26V23.5161L10.9208 19.2581L13.0594 21.3871L19.4752 15L25 19.9677V26H7Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["cx", "9.5", "cy", "16.5", "r", "2", "fill", "#E9ECEE", "stroke", "#5A6F8F"], [2, "margin-left", "4px", "margin-right", "4px"], [2, "height", "35px", "width", "150px", "border-radius", "5px", "text-align", "center", "border", "1px solid #bbc4d0", 3, "change"], ["value", "none"], ["value", "Show Text Only"], ["value", "Show Images Only"], ["value", "Show Semi-Transparent Images & Text"], ["value", "Show Images & Text"], ["width", "36", "height", "35", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectPath"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M12 16H24L24 8L12 8L12 16ZM24 18C25.1046 18 26 17.1046 26 16L26 8C26 6.89545 25.1046 6 24 6L12 6C10.8954 6 10 6.89545 10 8L10 16C10 17.1046 10.8954 18 12 18H17V20.5L9 20.5C7.34314 20.5 6 21.8431 6 23.5V26H5C4.44775 26 4 26.3582 4 26.8V29.2C4 29.6418 4.44775 30 5 30H9C9.55225 30 10 29.6418 10 29.2V26.8C10 26.3582 9.55225 26 9 26H8V23.5C8 22.9478 8.44775 22.5 9 22.5L17 22.5V26H16C15.4478 26 15 26.3582 15 26.8V29.2C15 29.6418 15.4478 30 16 30L20 30C20.5522 30 21 29.6418 21 29.2V26.8C21 26.3582 20.5522 26 20 26H19V22.5H27C27.5522 22.5 28 22.9478 28 23.5V26H27C26.4478 26 26 26.3582 26 26.8V29.2C26 29.6418 26.4478 30 27 30H31C31.5522 30 32 29.6418 32 29.2V26.8C32 26.3582 31.5522 26 31 26H30V23.5C30 21.8431 28.6569 20.5 27 20.5H19V18H24Z", "fill", "#5A6F8F", 1, "pathRect"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M30 17C30 22.2448 24.9277 27 18 27C11.0723 27 6 22.2448 6 17C6 11.7553 11.0723 7 18 7C24.9277 7 30 11.7553 30 17ZM32 17C32 23.6274 25.7319 29 18 29C10.2681 29 4 23.6274 4 17C4 10.3726 10.2681 5 18 5C25.7319 5 32 10.3726 32 17ZM15 9.90002V12.3C15 12.7419 15.4478 13.1 16 13.1H20C20.5522 13.1 21 12.7419 21 12.3V9.90002C21 9.45819 20.5522 9.10004 20 9.10004H16C15.4478 9.10004 15 9.45819 15 9.90002ZM16 15C15.4478 15 15 15.3582 15 15.8V18.2C15 18.6418 15.4478 19 16 19H20C20.5522 19 21 18.6418 21 18.2V15.8C21 15.3582 20.5522 15 20 15H16ZM15 24.2V21.8C15 21.3582 15.4478 21 16 21H20C20.5522 21 21 21.3582 21 21.8V24.2C21 24.6418 20.5522 25 20 25H16C15.4478 25 15 24.6418 15 24.2Z", "fill", "#5A6F8F", 1, "pathRect"], ["matTooltip", "Object In-Diagram In-Zooming", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["x1", "25", "y1", "21", "x2", "8", "y2", "21", "stroke", "#5A6F8F"], ["x", "8", "y", "12", "width", "3", "height", "2", "fill", "#5A6F8F"], ["x", "8", "y", "20", "width", "3", "height", "2", "fill", "#5A6F8F"], ["x", "8", "y", "16", "width", "3", "height", "2", "fill", "#5A6F8F"], ["id", "path-6-inside-1", "fill", "white"], ["x", "20", "y", "9", "width", "13", "height", "17", "rx", "1"], ["x", "20", "y", "9", "width", "13", "height", "17", "rx", "1", "stroke", "#5A6F8F", "stroke-width", "3", "mask", "url(#path-6-inside-1)"], ["id", "path-7-inside-2", "fill", "white"], ["x", "3", "y", "9", "width", "13", "height", "17", "rx", "1"], ["x", "3", "y", "9", "width", "13", "height", "17", "rx", "1", "stroke", "#5A6F8F", "stroke-width", "3", "mask", "url(#path-7-inside-2)"], ["x", "25", "y", "14", "width", "3", "height", "2", "fill", "#5A6F8F"], ["x", "25", "y", "20", "width", "3", "height", "2", "fill", "#5A6F8F"], ["matTooltip", "URL Links Management", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["opacity", "0.7", "d", "M15 9.5L17.5058 6.73046C19.9717 4.00491 24.5 5.74938 24.5 9.42493V9.42493C24.5 10.1155 24.2365 10.78 23.7632 11.2829L18.9231 16.4254C17.5969 17.8345 15.3683 17.8683 14 16.5V16.5", "stroke", "#1A3763", "stroke-width", "2"], ["opacity", "0.7", "d", "M14.5 20.5L11.9942 23.2695C9.52825 25.9951 5 24.2506 5 20.5751V20.5751C5 19.8845 5.26354 19.22 5.73682 18.7171L10.5769 13.5746C11.9031 12.1655 14.1317 12.1317 15.5 13.5V13.5", "stroke", "#1A3763", "stroke-width", "2"], ["cx", "20.5", "cy", "17.5", "r", "4", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["cx", "20.5", "cy", "17.5", "r", "2", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["id", "path-6-inside-1_0_1", "fill", "white"], ["d", "M20.003 17.1436C19.8311 17.3047 19.7448 17.4492 19.6767 17.6915C19.6027 17.9403 19.607 18.1896 19.685 18.4418C19.7207 18.5612 20.2655 19.6525 21.4352 21.9554L23.1315 25.2952L22.1244 25.2735C21.5709 25.2629 21.0481 25.2636 20.9611 25.2777C20.7407 25.3124 20.4336 25.4416 20.2957 25.5587C19.8262 25.9482 19.7445 26.6938 20.1181 27.2014C20.3633 27.5363 20.2556 27.4904 23.4755 28.6613C26.6186 29.8043 26.6928 29.8271 27.3536 29.8636C28.2693 29.9148 29.252 29.6537 29.9563 29.172C31.2103 28.3103 31.8259 26.7838 31.5558 25.1975C31.4428 24.5374 31.492 24.6465 30.0267 21.7427C29.1988 20.0944 28.6688 19.0693 28.5997 18.9703C28.2757 18.5112 27.7373 18.3086 27.2243 18.4518C26.981 18.5218 26.8256 18.6476 26.5743 18.973C26.5609 18.9898 26.4992 18.9609 26.4355 18.9094C26.282 18.7861 25.9919 18.6653 25.8116 18.6495C25.3773 18.6086 24.982 18.7926 24.7393 19.1472L24.674 19.2408L24.5312 19.1322C24.334 18.9842 23.9603 18.8656 23.7381 18.8845C23.4628 18.9037 23.1663 19.0477 22.9803 19.2427L22.831 19.3989L22.3558 18.4633C22.0701 17.9008 21.8381 17.4689 21.772 17.3818C21.3269 16.7831 20.5092 16.672 20.003 17.1436ZM20.8333 17.4831C20.9081 17.4887 21.0284 17.5281 21.1018 17.5679L21.236 17.6472L22.6917 20.4821C23.8403 22.7187 24.1629 23.3294 24.2108 23.3619C24.2834 23.4123 24.4345 23.4261 24.5117 23.3869C24.5416 23.3717 24.5893 23.324 24.617 23.2798C24.7234 23.1252 24.7179 23.1145 23.9598 21.6219C23.3059 20.3345 23.2678 20.2533 23.2651 20.1373C23.2525 19.6006 23.7904 19.3274 24.2164 19.6541C24.3086 19.7246 24.3517 19.8033 25.0056 21.0907C25.7637 22.5833 25.7691 22.5939 25.9566 22.5994C26.0784 22.6046 26.1431 22.5718 26.2107 22.4704C26.3133 22.321 26.298 22.2785 25.7023 21.1057C25.2433 20.2021 25.1576 20.021 25.1467 19.9193C25.1002 19.4333 25.5936 19.1156 26.022 19.3607L26.1562 19.44L26.7453 20.5691C27.3805 21.7888 27.3792 21.7861 27.5541 21.7912C27.6719 21.7951 27.7367 21.7622 27.8042 21.6608C27.9032 21.5166 27.8807 21.4475 27.434 20.568C27.036 19.7843 27.0279 19.7684 27.0269 19.6246C27.0244 19.3979 27.1189 19.2325 27.3178 19.1182C27.519 19.0025 27.6899 18.9996 27.8988 19.1149L28.0341 19.1903L29.3967 21.8545C30.5456 24.1042 30.7708 24.5599 30.8383 24.767C31.2225 25.9734 30.9617 27.2795 30.1564 28.1612C29.8839 28.4572 29.6368 28.643 29.252 28.8351C28.3915 29.2688 27.4613 29.3556 26.4827 29.0881C26.3231 29.0452 24.9691 28.5626 23.4748 28.014C20.5246 26.9345 20.6518 26.9939 20.5294 26.6974C20.4593 26.5284 20.4758 26.3389 20.5742 26.175C20.6402 26.0643 20.8926 25.926 21.0715 25.9022C21.1371 25.8957 21.7589 25.8985 22.4593 25.9083C23.1585 25.9219 23.7546 25.9176 23.7845 25.9024C23.8766 25.8557 23.9457 25.7201 23.9356 25.6078C23.9263 25.5153 23.6429 24.9451 22.0819 21.8718C20.4506 18.66 20.2389 18.231 20.2266 18.1266C20.1916 17.7554 20.4705 17.4595 20.8333 17.4831Z"], ["d", "M20.003 17.1436L15.9013 12.7645L15.907 12.7592L15.9127 12.7539L20.003 17.1436ZM19.6767 17.6915L25.4531 19.3141L25.4406 19.3587L25.4274 19.403L19.6767 17.6915ZM19.685 18.4418L25.417 16.6686L25.4261 16.6977L25.4348 16.727L19.685 18.4418ZM23.1315 25.2952L28.481 22.5781L33.0172 31.5091L23.0025 31.2938L23.1315 25.2952ZM22.1244 25.2735L22.2396 19.2746L22.2534 19.2749L22.1244 25.2735ZM20.9611 25.2777L21.9177 31.2009L21.9063 31.2028L21.8949 31.2046L20.9611 25.2777ZM20.2957 25.5587L24.1808 30.1311L24.1537 30.1541L24.1263 30.1768L20.2957 25.5587ZM20.1181 27.2014L24.9501 23.6444L24.9546 23.6506L24.9592 23.6567L20.1181 27.2014ZM23.4755 28.6613L25.526 23.0226L25.5261 23.0226L23.4755 28.6613ZM27.3536 29.8636L27.6848 23.8727L27.6887 23.873L27.3536 29.8636ZM29.9563 29.172L33.3542 34.1171L33.3436 34.1244L29.9563 29.172ZM31.5558 25.1975L37.4698 24.1858L37.4706 24.1904L31.5558 25.1975ZM30.0267 21.7427L24.6701 24.4459L24.665 24.4357L30.0267 21.7427ZM28.5997 18.9703L33.5018 15.5107L33.5109 15.5235L33.5199 15.5364L28.5997 18.9703ZM27.2243 18.4518L25.5658 12.6856L25.5883 12.6791L25.6108 12.6728L27.2243 18.4518ZM26.5743 18.973L31.3228 22.6407L31.2936 22.6785L31.2638 22.7158L26.5743 18.973ZM26.4355 18.9094L30.1938 14.2323L30.2042 14.2407L26.4355 18.9094ZM25.8116 18.6495L25.2886 24.6267L25.2687 24.6249L25.2488 24.6231L25.8116 18.6495ZM24.7393 19.1472L29.6908 22.5358L29.676 22.5573L29.6611 22.5787L24.7393 19.1472ZM24.674 19.2408L29.5959 22.6723L26.0208 27.8001L21.0438 24.0179L24.674 19.2408ZM24.5312 19.1322L28.1322 14.333L28.1469 14.344L28.1615 14.355L24.5312 19.1322ZM23.7381 18.8845L24.2491 24.8628L24.2019 24.8668L24.1547 24.8701L23.7381 18.8845ZM22.9803 19.2427L27.322 23.3839L27.3182 23.3878L22.9803 19.2427ZM22.831 19.3989L27.169 23.544L21.3173 29.6679L17.4815 22.116L22.831 19.3989ZM21.772 17.3818L16.9944 21.0115L16.9756 20.9867L16.9571 20.9618L21.772 17.3818ZM20.8333 17.4831L21.2229 11.4957L21.2519 11.4976L21.2808 11.4998L20.8333 17.4831ZM21.1018 17.5679L23.9615 12.2932L24.0589 12.346L24.1543 12.4023L21.1018 17.5679ZM21.236 17.6472L24.2885 12.4816L25.7815 13.3639L26.5736 14.9066L21.236 17.6472ZM22.6917 20.4821L17.3544 23.2231L17.3542 23.2227L22.6917 20.4821ZM24.2108 23.3619L27.5813 18.3981L27.6072 18.4157L27.6329 18.4335L24.2108 23.3619ZM24.617 23.2798L19.531 20.0967L19.6004 19.9857L19.6746 19.8779L24.617 23.2798ZM23.2651 20.1373L29.2635 19.9965L29.2636 20.0011L23.2651 20.1373ZM24.2164 19.6541L20.5736 24.4218L20.5646 24.4148L24.2164 19.6541ZM25.9566 22.5994L26.1314 16.6019L26.1727 16.6031L26.2139 16.6049L25.9566 22.5994ZM26.2107 22.4704L21.2183 19.1422L21.242 19.1067L21.2662 19.0715L26.2107 22.4704ZM25.1467 19.9193L19.1808 20.5584L19.1771 20.5242L19.1739 20.4899L25.1467 19.9193ZM26.022 19.3607L29.0021 14.1532L29.0384 14.1739L29.0744 14.1952L26.022 19.3607ZM26.1562 19.44L29.2086 14.2745L30.6831 15.1459L31.4755 16.6643L26.1562 19.44ZM26.7453 20.5691L32.0646 17.7933L32.0669 17.7976L26.7453 20.5691ZM27.5541 21.7912L27.7275 15.7937L27.7401 15.794L27.7527 15.7945L27.5541 21.7912ZM27.8042 21.6608L22.8098 18.3356L22.8341 18.2992L22.8588 18.2632L27.8042 21.6608ZM27.0269 19.6246L33.0265 19.5599L33.0266 19.5706L33.0267 19.5814L27.0269 19.6246ZM27.3178 19.1182L30.3083 24.3198L30.3081 24.3199L27.3178 19.1182ZM27.8988 19.1149L30.7972 13.8614L30.8082 13.8674L30.8192 13.8735L27.8988 19.1149ZM28.0341 19.1903L30.9545 13.9489L32.5463 14.8359L33.3761 16.4583L28.0341 19.1903ZM29.3967 21.8545L34.7386 19.1225L34.7402 19.1256L29.3967 21.8545ZM30.8383 24.767L36.5426 22.9066L36.5491 22.9265L36.5555 22.9465L30.8383 24.767ZM30.1564 28.1612L34.5868 32.2074L34.5789 32.216L34.571 32.2246L30.1564 28.1612ZM29.252 28.8351L26.5514 23.4772L26.5616 23.4721L26.5718 23.467L29.252 28.8351ZM26.4827 29.0881L28.0418 23.2942L28.0532 23.2973L28.0647 23.3005L26.4827 29.0881ZM23.4748 28.014L25.5365 22.3793L25.5428 22.3816L23.4748 28.014ZM20.5294 26.6974L26.0713 24.3978L26.0762 24.4096L20.5294 26.6974ZM20.5742 26.175L25.7256 29.2511L25.7196 29.2612L20.5742 26.175ZM21.0715 25.9022L20.2809 19.9545L20.3796 19.9414L20.4786 19.9316L21.0715 25.9022ZM22.4593 25.9083L22.543 19.9088L22.5598 19.9091L22.5766 19.9094L22.4593 25.9083ZM23.9356 25.6078L29.9053 25.0055L29.9087 25.0392L29.9117 25.0729L23.9356 25.6078ZM20.2266 18.1266L14.2678 18.8285L14.2597 18.7596L14.2532 18.6906L20.2266 18.1266ZM24.1048 21.5226C24.3216 21.3195 24.6521 20.9671 24.9552 20.4585C25.2505 19.9628 25.3916 19.5332 25.4531 19.3141L13.9003 16.0689C14.245 14.8418 14.8788 13.7223 15.9013 12.7645L24.1048 21.5226ZM25.4274 19.403C25.7093 18.4559 25.6715 17.4912 25.417 16.6686L13.953 20.215C13.5425 18.888 13.496 17.4248 13.926 15.9799L25.4274 19.403ZM25.4348 16.727C25.3455 16.4275 25.2516 16.2051 25.2447 16.1885C25.2177 16.1231 25.1979 16.0791 25.1942 16.0709C25.1858 16.0521 25.1907 16.0636 25.2193 16.1232C25.2736 16.2365 25.3654 16.4237 25.5049 16.7036C25.7808 17.2572 26.2006 18.0883 26.7847 19.2383L16.0856 24.6725C15.5 23.5196 15.0626 22.6536 14.7647 22.056C14.6173 21.7602 14.4932 21.5083 14.3988 21.3114C14.353 21.2159 14.3004 21.1046 14.2507 20.9943C14.2265 20.9403 14.1902 20.8584 14.1507 20.7628C14.1314 20.7159 14.0291 20.471 13.9353 20.1566L25.4348 16.727ZM26.7847 19.2383L28.481 22.5781L17.782 28.0123L16.0856 24.6725L26.7847 19.2383ZM23.0025 31.2938L21.9955 31.2722L22.2534 19.2749L23.2604 19.2966L23.0025 31.2938ZM22.0093 31.2724C21.8899 31.2701 21.7729 31.2685 21.6648 31.2675C21.556 31.2664 21.4612 31.2661 21.385 31.2663C21.3472 31.2664 21.317 31.2667 21.2942 31.2669C21.2703 31.2672 21.2607 31.2675 21.2627 31.2674C21.2641 31.2674 21.2718 31.2672 21.2847 31.2667C21.2968 31.2662 21.3205 31.2652 21.3528 31.2634C21.3693 31.2625 21.3906 31.2612 21.4158 31.2594C21.4406 31.2577 21.4732 31.2552 21.5117 31.2518C21.5493 31.2485 21.6009 31.2435 21.6624 31.2364C21.6938 31.2327 21.7306 31.2282 21.7718 31.2226C21.8128 31.217 21.862 31.2099 21.9177 31.2009L20.0046 19.3544C20.3477 19.299 20.6348 19.2849 20.674 19.2826C20.7796 19.2766 20.8741 19.2736 20.9408 19.2718C21.078 19.2681 21.2217 19.2667 21.3506 19.2664C21.615 19.2656 21.9294 19.2687 22.2396 19.2746L22.0093 31.2724ZM21.8949 31.2046C22.3933 31.126 22.7406 30.9953 22.9295 30.9156C23.0487 30.8653 23.2 30.7948 23.3752 30.6959C23.5268 30.6104 23.8299 30.4292 24.1808 30.1311L16.4106 20.9864C17.1512 20.3572 17.8994 20.0134 18.2654 19.859C18.6975 19.6768 19.3086 19.464 20.0274 19.3508L21.8949 31.2046ZM24.1263 30.1768C26.2188 28.4411 26.3708 25.5744 24.9501 23.6444L15.2862 30.7584C13.1181 27.8132 13.4336 23.4552 16.4651 20.9407L24.1263 30.1768ZM24.9592 23.6567C24.9763 23.6802 24.9917 23.7015 24.9974 23.7092C25.0059 23.721 25.0028 23.7167 24.9977 23.7097C24.9879 23.6963 24.9364 23.6261 24.8622 23.5346C24.7831 23.4369 24.6746 23.3103 24.5375 23.1699C24.3988 23.0277 24.25 22.891 24.092 22.7617C23.7775 22.5045 23.5003 22.3378 23.331 22.2446C23.2468 22.1983 23.1808 22.1656 23.1412 22.1466C23.1014 22.1275 23.0774 22.117 23.0754 22.1162C23.073 22.1151 23.0841 22.12 23.1131 22.1318C23.1417 22.1434 23.1823 22.1596 23.2379 22.1812C23.3513 22.2254 23.504 22.2831 23.7132 22.3607C24.1369 22.5178 24.7092 22.7256 25.526 23.0226L21.425 34.3001C19.9564 33.766 18.9149 33.3926 18.2872 33.1195C17.967 32.9802 17.232 32.6535 16.4948 32.0506C15.6912 31.3933 15.1562 30.5808 15.2771 30.746L24.9592 23.6567ZM25.5261 23.0226C26.3178 23.3105 26.8904 23.5185 27.3261 23.6735C27.7738 23.8328 28.0003 23.9087 28.1217 23.9464C28.2287 23.9795 28.1198 23.9402 27.9087 23.9046C27.6952 23.8686 27.5273 23.864 27.6848 23.8728L27.0223 35.8544C25.2448 35.7562 24.1236 35.2814 21.4249 34.3L25.5261 23.0226ZM27.6887 23.873C27.4781 23.8612 27.3197 23.8853 27.1933 23.9189C27.073 23.9509 26.8522 24.0259 26.5691 24.2195L33.3436 34.1244C31.4628 35.4107 29.1501 35.9735 27.0184 35.8542L27.6887 23.873ZM26.5585 24.2268C25.752 24.7809 25.5464 25.6497 25.6409 26.2047L37.4706 24.1904C38.1053 27.9178 36.6687 31.8397 33.3542 34.1171L26.5585 24.2268ZM25.6417 26.2093C25.5901 25.9078 25.6235 26.1299 25.6783 26.3351C25.7526 26.6134 25.8314 26.7842 25.8112 26.7386C25.7786 26.6649 25.6974 26.492 25.4961 26.0876C25.3026 25.6986 25.0414 25.1817 24.6701 24.4459L35.3832 19.0396C36.0627 20.386 36.5202 21.2845 36.7855 21.8843C36.9504 22.257 37.1296 22.7058 37.2723 23.24C37.3954 23.7011 37.465 24.1572 37.4698 24.1858L25.6417 26.2093ZM24.665 24.4357C24.2563 23.622 23.9269 22.9737 23.6952 22.524C23.5781 22.2969 23.4937 22.1355 23.44 22.0347C23.412 21.9821 23.4029 21.9659 23.4073 21.9737C23.409 21.9767 23.4251 22.0058 23.451 22.0496C23.4572 22.0601 23.5465 22.2137 23.6794 22.4041L33.5199 15.5364C33.6614 15.7392 33.763 15.9125 33.785 15.9496C33.8266 16.0202 33.8621 16.083 33.8865 16.1268C33.9363 16.2161 33.9864 16.309 34.0307 16.3923C34.1217 16.563 34.2345 16.7795 34.3621 17.0271C34.6196 17.5268 34.9692 18.2152 35.3884 19.0498L24.665 24.4357ZM23.6975 22.4299C24.7315 23.895 26.7361 24.8175 28.8377 24.2308L25.6108 12.6728C28.7385 11.7996 31.8198 13.1273 33.5018 15.5107L23.6975 22.4299ZM28.8828 24.218C29.1247 24.1484 29.4313 24.0395 29.7688 23.8684C30.1102 23.6953 30.4079 23.4967 30.6604 23.2939C30.9019 23.0998 31.073 22.9251 31.1726 22.8163C31.2231 22.7611 31.2607 22.717 31.2839 22.6889C31.3072 22.6609 31.3207 22.6434 31.3228 22.6407L21.8258 15.3053C22.3945 14.5691 23.5263 13.2722 25.5658 12.6856L28.8828 24.218ZM31.2638 22.7158C29.1825 25.3236 26.2585 24.9909 25.7621 24.9247C24.9003 24.8096 24.2658 24.5329 24.0088 24.4143C23.407 24.1364 22.9546 23.8104 22.6667 23.5781L30.2042 14.2407C29.9801 14.0598 29.5905 13.774 29.0388 13.5193C28.8068 13.4122 28.1942 13.1428 27.3497 13.0301C26.8706 12.9662 23.9594 12.6308 21.8848 15.2302L31.2638 22.7158ZM22.6771 23.5864C22.9636 23.8166 23.2112 23.9667 23.3656 24.0532C23.5323 24.1466 23.6867 24.2196 23.8267 24.2779C23.9657 24.3358 24.1356 24.398 24.3377 24.4549C24.519 24.506 24.8509 24.5884 25.2886 24.6267L26.3345 12.6723C27.2789 12.755 28.0345 13.0312 28.4404 13.2003C28.8736 13.3807 29.5325 13.701 30.1938 14.2323L22.6771 23.5864ZM25.2488 24.6231C26.9531 24.7836 28.6833 24.0079 29.6908 22.5358L19.7878 15.7586C21.2806 13.5772 23.8015 12.4336 26.3743 12.6759L25.2488 24.6231ZM29.6611 22.5787L29.5959 22.6723L19.7522 15.8093L19.8174 15.7157L29.6611 22.5787ZM21.0438 24.0179L20.901 23.9094L28.1615 14.355L28.3043 14.4636L21.0438 24.0179ZM20.9302 23.9314C21.5447 24.3926 22.0808 24.5867 22.3467 24.6702C22.5229 24.7256 22.7434 24.7824 23.0078 24.8234C23.2446 24.8602 23.6839 24.9111 24.2491 24.8628L23.2272 12.9063C24.4376 12.8029 25.4351 13.0623 25.9414 13.2213C26.4989 13.3964 27.3204 13.7239 28.1322 14.333L20.9302 23.9314ZM24.1547 24.8701C24.8721 24.8201 25.4599 24.6269 25.9053 24.4148C26.3507 24.2027 26.8505 23.8782 27.322 23.3839L18.6386 15.1014C19.8265 13.856 21.5098 13.0251 23.3215 12.899L24.1547 24.8701ZM27.3182 23.3878L27.169 23.544L18.4931 15.2537L18.6423 15.0975L27.3182 23.3878ZM17.4815 22.116L17.0063 21.1804L27.7053 15.7462L28.1805 16.6818L17.4815 22.116ZM17.0063 21.1804C16.9427 21.0552 16.8838 20.9406 16.8312 20.8395C16.7781 20.7375 16.7341 20.6545 16.7 20.5913C16.6832 20.56 16.6704 20.5367 16.6615 20.5206C16.6522 20.5037 16.6502 20.5005 16.6545 20.5079C16.6569 20.5121 16.6625 20.5218 16.671 20.536C16.6792 20.5497 16.693 20.5727 16.7116 20.6026C16.7293 20.6309 16.7588 20.6776 16.7978 20.736C16.8178 20.766 16.8435 20.8038 16.8742 20.8474C16.9044 20.8902 16.9449 20.9463 16.9944 21.0115L26.5496 13.7521C26.9327 14.2564 27.2561 14.8842 27.2631 14.8972C27.396 15.1439 27.5493 15.4389 27.7053 15.7462L17.0063 21.1804ZM16.9571 20.9618C18.3278 22.8054 21.6081 23.8491 24.0934 21.5332L15.9127 12.7539C19.4103 9.4948 24.3259 10.7608 26.5869 13.8018L16.9571 20.9618ZM21.2808 11.4998C22.3816 11.5821 23.321 11.9459 23.9615 12.2932L18.2422 22.8426C18.6169 23.0457 18.9338 23.1615 19.1425 23.2282C19.2659 23.2676 19.4171 23.3107 19.594 23.35C19.7551 23.3858 20.032 23.4399 20.3858 23.4664L21.2808 11.4998ZM24.1543 12.4023L24.2885 12.4816L18.1836 22.8127L18.0494 22.7334L24.1543 12.4023ZM26.5736 14.9066L28.0292 17.7416L17.3542 23.2227L15.8985 20.3878L26.5736 14.9066ZM28.029 17.7412C28.6056 18.8638 28.9584 19.5464 29.1706 19.9485C29.2222 20.0464 29.2615 20.1199 29.2907 20.174C29.3213 20.2306 29.3335 20.2522 29.3327 20.2508C29.3318 20.2493 29.3227 20.2333 29.3071 20.2071C29.2932 20.1837 29.2613 20.1306 29.2157 20.0601C29.1794 20.004 29.0822 19.8556 28.9403 19.6726C28.8685 19.58 28.7437 19.4244 28.5733 19.2435C28.4857 19.1504 28.3661 19.0294 28.2168 18.8954C28.0721 18.7655 27.8585 18.5863 27.5813 18.3981L20.8403 28.3258C19.9835 27.744 19.4847 27.0613 19.4566 27.025C19.3042 26.8284 19.1941 26.6614 19.1421 26.5811C19.0315 26.4102 18.9431 26.2563 18.8968 26.1747C18.7936 25.9928 18.6769 25.775 18.5574 25.5486C18.3092 25.0781 17.9264 24.337 17.3544 23.2231L28.029 17.7412ZM27.6329 18.4335C26.4911 17.6407 25.3942 17.4747 24.8719 17.4299C24.5241 17.4001 24.1155 17.3981 23.6618 17.4576C23.2416 17.5127 22.5582 17.6495 21.7946 18.0374L27.2288 28.7364C25.785 29.4697 24.4505 29.4378 23.8471 29.3861C23.2118 29.3316 22.0031 29.1336 20.7888 28.2904L27.6329 18.4335ZM21.7946 18.0374C21.3043 18.2864 20.9578 18.5493 20.7861 18.6868C20.5859 18.8472 20.4239 18.9989 20.2987 19.1256C20.0694 19.3574 19.794 19.6764 19.531 20.0967L29.703 26.463C29.4123 26.9274 29.0992 27.2923 28.8317 27.5629C28.6505 27.7461 28.0963 28.2958 27.2288 28.7364L21.7946 18.0374ZM19.6746 19.8779C19.6745 19.8781 19.6737 19.8793 19.6724 19.8811C19.6712 19.8829 19.6692 19.8858 19.6668 19.8893C19.662 19.8963 19.6543 19.9076 19.6447 19.9219C19.6262 19.9495 19.5947 19.997 19.5567 20.0575C19.4818 20.1765 19.3588 20.3816 19.231 20.6506C18.941 21.2608 18.7223 21.9975 18.6754 22.8266C18.6329 23.5772 18.7454 24.1721 18.8288 24.5117C18.9107 24.8453 19.0032 25.084 19.0362 25.1671C19.0942 25.3132 19.1247 25.3625 19.0187 25.148C18.9311 24.9708 18.8062 24.7248 18.6103 24.339L29.3093 18.9048C29.5955 19.4683 29.9741 20.197 30.189 20.7382C30.2668 20.9341 30.7384 22.0518 30.6562 23.5043C30.5491 25.3989 29.5653 26.6731 29.5593 26.6818L19.6746 19.8779ZM18.6103 24.339C18.3089 23.7457 18.0777 23.2907 17.9339 22.9835C17.8231 22.7468 17.299 21.6978 17.2667 20.2734L29.2636 20.0011C29.26 19.8424 29.2471 19.5631 29.1914 19.2199C29.1372 18.8864 29.0617 18.6085 28.9948 18.4004C28.9324 18.2065 28.8742 18.0635 28.8471 17.9987C28.8186 17.9307 28.7998 17.8911 28.8026 17.8971C28.8111 17.9153 28.8457 17.9873 28.9385 18.1722C29.0264 18.3474 29.1448 18.5808 29.3093 18.9048L18.6103 24.339ZM17.2668 20.2781C17.2099 17.8529 18.4812 15.4302 20.8592 14.2224C23.2371 13.0146 25.9435 13.417 27.8682 14.8934L20.5646 24.4148C22.0633 25.5645 24.2877 25.9401 26.2934 24.9214C28.2991 23.9027 29.3078 21.8849 29.2635 19.9965L17.2668 20.2781ZM27.8591 14.8865C28.994 15.7536 29.5332 16.798 29.6593 17.0275C29.8227 17.325 30.0539 17.7805 30.3551 18.3736L19.6561 23.8078C19.4915 23.4839 19.3729 23.2506 19.2833 23.0764C19.239 22.9902 19.2057 22.9261 19.1805 22.878C19.1681 22.8544 19.1587 22.8367 19.1519 22.8239C19.1485 22.8176 19.1459 22.8129 19.1442 22.8096C19.1433 22.808 19.1426 22.8067 19.1422 22.8059C19.1417 22.8051 19.1415 22.8047 19.1415 22.8047C19.1415 22.8047 19.1417 22.8051 19.1422 22.806C19.1427 22.8069 19.1435 22.8083 19.1445 22.8101C19.1465 22.8137 19.1497 22.8194 19.1541 22.827C19.1624 22.8415 19.1772 22.8672 19.1977 22.9011C19.2341 22.9615 19.3156 23.0933 19.4358 23.2585C19.5649 23.4358 19.7454 23.6612 19.9836 23.902C20.2286 24.1498 20.4472 24.3252 20.5736 24.4218L27.8591 14.8865ZM30.3551 18.3736C30.5511 18.7594 30.6761 19.0053 30.7675 19.1806C30.8782 19.3927 30.8564 19.3392 30.7728 19.2063C30.7252 19.1307 30.5871 18.9154 30.3664 18.6528C30.1415 18.3853 29.728 17.9439 29.0977 17.5356C28.4014 17.0845 27.6785 16.8264 27.0155 16.7001C26.7233 16.6445 26.4854 16.6227 26.3454 16.6128C26.2742 16.6078 26.2174 16.6052 26.1843 16.6038C26.1671 16.6031 26.1535 16.6026 26.1451 16.6024C26.1408 16.6022 26.1374 16.6021 26.1352 16.602C26.133 16.602 26.1316 16.6019 26.1314 16.6019L25.7819 28.5968C25.7721 28.5966 24.1643 28.6376 22.5733 27.6069C21.3535 26.8167 20.7298 25.7776 20.6174 25.5992C20.3074 25.1067 19.9424 24.3715 19.6561 23.8078L30.3551 18.3736ZM26.2139 16.6049C25.7253 16.5839 24.6171 16.6005 23.3869 17.2254C22.1566 17.8502 21.4896 18.7354 21.2183 19.1422L31.203 25.7985C30.8642 26.3068 30.131 27.2591 28.8211 27.9244C27.5112 28.5897 26.3097 28.6201 25.6994 28.5939L26.2139 16.6049ZM21.2662 19.0715C21.2032 19.1631 20.4176 20.235 20.28 21.8497C20.1671 23.1745 20.5521 24.1488 20.5952 24.2648C20.6737 24.4756 20.7335 24.5844 20.6557 24.4251C20.5969 24.3045 20.507 24.1264 20.3528 23.8228L31.0518 18.3886C31.25 18.7788 31.6234 19.493 31.8415 20.0789C31.9501 20.3707 32.3569 21.457 32.2367 22.8685C32.0917 24.5697 31.2694 25.7029 31.1551 25.8693L21.2662 19.0715ZM20.3528 23.8228C20.1369 23.3979 19.953 23.034 19.8243 22.7596C19.8064 22.7216 19.31 21.7642 19.1808 20.5584L31.1125 19.2803C31.0435 18.6358 30.881 18.156 30.8028 17.9441C30.7621 17.8339 30.7281 17.7535 30.712 17.7166C30.6952 17.6777 30.6855 17.6574 30.6886 17.664C30.697 17.6818 30.7249 17.74 30.7909 17.8721C30.8543 17.9989 30.9381 18.1648 31.0518 18.3886L20.3528 23.8228ZM19.1739 20.4899C18.6586 15.0968 24.4056 11.5228 29.0021 14.1532L23.0418 24.5683C26.7815 26.7084 31.5418 23.7697 31.1195 19.3487L19.1739 20.4899ZM29.0744 14.1952L29.2086 14.2745L23.1037 24.6056L22.9695 24.5263L29.0744 14.1952ZM31.4755 16.6643L32.0646 17.7933L21.426 23.3449L20.8369 22.2158L31.4755 16.6643ZM32.0669 17.7976C32.2332 18.1169 32.3319 18.3063 32.4022 18.4372C32.4949 18.61 32.4442 18.503 32.3252 18.3233C32.2816 18.2575 31.6701 17.2697 30.4051 16.5516C28.9437 15.7221 27.4612 15.786 27.7275 15.7937L27.3807 27.7887C27.3801 27.7887 27.3725 27.7884 27.3651 27.7882C27.3568 27.788 27.3436 27.7876 27.3278 27.787C27.2973 27.7859 27.2453 27.7839 27.1815 27.7803C27.0577 27.7732 26.8397 27.7575 26.5719 27.7158C25.9722 27.6224 25.2385 27.4173 24.4815 26.9876C23.1476 26.2305 22.464 25.1662 22.3195 24.948C21.9936 24.4557 21.6333 23.7428 21.4238 23.3405L32.0669 17.7976ZM27.7527 15.7945C27.2411 15.7775 26.1447 15.8123 24.9362 16.4389C23.7378 17.0602 23.0831 17.9252 22.8098 18.3356L32.7985 24.986C32.4577 25.4978 31.7369 26.4299 30.4598 27.0921C29.1726 27.7594 27.9849 27.8087 27.3555 27.7879L27.7527 15.7945ZM22.8588 18.2632C22.7065 18.485 22.0624 19.4267 21.8933 20.8408C21.7427 22.101 22.051 23.0489 22.1395 23.3111C22.2376 23.6011 22.3292 23.7781 22.2823 23.68C22.2537 23.6204 22.1993 23.5112 22.0845 23.2851L32.7835 17.8509C32.9021 18.0843 33.2839 18.8063 33.5079 19.4692C33.6456 19.8767 33.9688 20.9238 33.8085 22.265C33.6298 23.7601 32.9514 24.7646 32.7495 25.0584L22.8588 18.2632ZM22.0845 23.2851C21.9434 23.0073 21.7216 22.5779 21.5753 22.2398C21.4809 22.0218 21.2896 21.5592 21.1627 20.9541C21.0235 20.2904 21.0276 19.7473 21.027 19.6679L33.0267 19.5814C33.0266 19.5739 33.0321 19.0867 32.9072 18.4909C32.7945 17.9537 32.6303 17.571 32.5878 17.4729C32.5449 17.3736 32.5208 17.3297 32.5734 17.4353C32.6171 17.523 32.6794 17.646 32.7835 17.8509L22.0845 23.2851ZM21.0272 19.6894C21.0166 18.7046 21.2214 17.5131 21.8926 16.3433C22.5626 15.1756 23.4837 14.4015 24.3275 13.9164L30.3081 24.3199C30.953 23.9492 31.7275 23.3149 32.3011 22.3152C32.8759 21.3133 33.0347 20.3179 33.0265 19.5599L21.0272 19.6894ZM24.3272 13.9166C25.0524 13.4997 26.1563 13.0417 27.556 13.0301C28.9528 13.0186 30.0636 13.4566 30.7972 13.8614L25.0004 24.3684C25.5251 24.6578 26.446 25.0397 27.6549 25.0297C28.8665 25.0197 29.7845 24.621 30.3083 24.3198L24.3272 13.9166ZM30.8192 13.8735L30.9545 13.9489L25.1138 24.4316L24.9784 24.3562L30.8192 13.8735ZM33.3761 16.4583L34.7386 19.1225L24.0547 24.5865L22.6922 21.9222L33.3761 16.4583ZM34.7402 19.1256C35.3101 20.2416 35.6721 20.9539 35.9005 21.4154C36.0625 21.7427 36.3489 22.3126 36.5426 22.9066L25.134 26.6274C25.1778 26.7616 25.218 26.8656 25.2436 26.9288C25.2565 26.9604 25.2666 26.9843 25.2729 26.9988C25.2761 27.0062 25.2786 27.0118 25.2802 27.0154C25.2818 27.0189 25.2826 27.0208 25.2826 27.0209C25.2826 27.0209 25.2819 27.0193 25.2804 27.0161C25.2789 27.0128 25.2767 27.008 25.2737 27.0017C25.2677 26.9888 25.2591 26.9706 25.2474 26.9463C25.2236 26.8968 25.1907 26.8294 25.1455 26.738C24.9572 26.3576 24.6321 25.7171 24.0531 24.5833L34.7402 19.1256ZM36.5555 22.9465C37.5396 26.0371 36.9496 29.6202 34.5868 32.2074L25.726 24.115C24.9737 24.9387 24.9053 25.9096 25.1212 26.5875L36.5555 22.9465ZM34.571 32.2246C33.7846 33.0789 32.9428 33.6986 31.9321 34.2032L26.5718 23.467C26.5253 23.4902 26.3627 23.5756 26.1569 23.7291C25.9465 23.8862 25.8039 24.0303 25.7418 24.0978L34.571 32.2246ZM31.9526 34.193C29.7031 35.3268 27.2405 35.5154 24.9008 34.8758L28.0647 23.3005C27.9197 23.2608 27.6746 23.2211 27.3628 23.2497C27.0469 23.2787 26.7671 23.3685 26.5514 23.4772L31.9526 34.193ZM24.9237 34.8821C24.4272 34.7485 22.6961 34.1197 21.4068 33.6464L25.5428 22.3816C26.2756 22.6507 26.9704 22.9022 27.496 23.0898C27.7602 23.1841 27.9718 23.2587 28.12 23.31C28.1954 23.3362 28.2414 23.3518 28.2636 23.3592C28.344 23.3859 28.2184 23.3418 28.0418 23.2942L24.9237 34.8821ZM21.4131 33.6487C20.1115 33.1724 19.0974 32.8093 18.4972 32.5416C18.2736 32.4418 17.2393 32.0028 16.3181 31.0523C15.2543 29.9549 14.7677 28.4637 14.9827 28.9852L26.0762 24.4096C26.0878 24.4378 26.1515 24.5959 26.1139 24.5029C26.1056 24.4824 26.052 24.3484 25.9694 24.178C25.7654 23.7572 25.4405 23.2223 24.9347 22.7005C24.4795 22.2308 24.0459 21.9466 23.8052 21.8034C23.573 21.6652 23.4035 21.5904 23.3861 21.5826C23.3667 21.574 23.4642 21.6165 23.8822 21.7722C24.2651 21.9149 24.783 22.1037 25.5365 22.3793L21.4131 33.6487ZM14.9876 28.9969C14.1467 26.9704 14.4098 24.7877 15.4288 23.0888L25.7196 29.2612C26.5419 27.8902 26.772 26.0864 26.0713 24.3978L14.9876 28.9969ZM15.4228 23.0988C16.3141 21.6061 17.6 20.9072 17.8958 20.745C18.4044 20.4661 19.2316 20.094 20.2809 19.9545L21.8621 31.8499C22.7326 31.7342 23.3441 31.4431 23.6653 31.267C23.8677 31.156 24.1337 30.9919 24.4266 30.7551C24.6547 30.5707 25.2296 30.0817 25.7256 29.2511L15.4228 23.0988ZM20.4786 19.9316C20.9143 19.8883 21.5527 19.8992 21.5537 19.8992C21.8282 19.9004 22.1783 19.9038 22.543 19.9088L22.3755 31.9077C22.0398 31.903 21.7289 31.9001 21.5009 31.8991C21.385 31.8986 21.3034 31.8986 21.2559 31.8989C21.2302 31.8991 21.2315 31.8992 21.2498 31.8988C21.2582 31.8986 21.2885 31.898 21.3314 31.8962C21.3533 31.8954 21.3896 31.8938 21.4351 31.8911C21.4742 31.8887 21.5578 31.8834 21.6645 31.8728L20.4786 19.9316ZM22.5766 19.9094C22.8862 19.9155 23.1595 19.9172 23.3413 19.9163C23.4383 19.9158 23.4752 19.9146 23.4667 19.9149C23.4616 19.9151 23.4462 19.9156 23.4229 19.9167C23.4022 19.9177 23.3574 19.92 23.2973 19.9245C23.2534 19.9278 23.1184 19.9383 22.9426 19.9628C22.8579 19.9746 22.6857 20.0004 22.4701 20.0486C22.3601 20.0732 22.1926 20.1139 21.9919 20.1766C21.8128 20.2326 21.4711 20.3479 21.0674 20.5529L26.5016 31.252C25.8035 31.6065 25.1954 31.7355 25.09 31.7591C24.8704 31.8082 24.6931 31.8348 24.6021 31.8475C24.414 31.8738 24.2624 31.8858 24.198 31.8907C24.0524 31.9016 23.926 31.9063 23.8596 31.9085C23.7091 31.9134 23.5477 31.9153 23.4045 31.9161C23.1059 31.9177 22.7316 31.9147 22.3419 31.9071L22.5766 19.9094ZM21.0674 20.5529C19.667 21.2642 18.9196 22.338 18.5571 23.0463C18.1761 23.7909 17.8445 24.858 17.9595 26.1428L29.9117 25.0729C30.0368 26.4698 29.6757 27.6609 29.2396 28.513C28.8221 29.3289 27.9941 30.4939 26.5016 31.252L21.0674 20.5529ZM17.9659 26.2101C18.0192 26.7385 18.1326 27.1372 18.1784 27.2914C18.2349 27.482 18.2888 27.6266 18.3161 27.6978C18.3465 27.7767 18.371 27.8346 18.3827 27.8619C18.3954 27.8913 18.4033 27.9086 18.4036 27.9093C18.4043 27.9109 18.401 27.9037 18.3925 27.8856C18.384 27.8678 18.3721 27.8428 18.3558 27.8092C18.3229 27.7411 18.2776 27.6489 18.2161 27.5249C17.9641 27.0171 17.5173 26.1342 16.7324 24.5889L27.4314 19.1547C28.2075 20.6827 28.6829 21.6216 28.9651 22.1903C29.101 22.464 29.2236 22.7151 29.3195 22.9251C29.3646 23.0238 29.4415 23.1952 29.5185 23.3958C29.53 23.4258 29.8153 24.1135 29.9053 25.0055L17.9659 26.2101ZM16.7324 24.5889C15.9223 22.994 15.4453 22.052 15.1702 21.4964C15.0396 21.2326 14.9153 20.9775 14.8164 20.7566C14.7685 20.6497 14.6851 20.4594 14.6023 20.2309C14.537 20.0509 14.3498 19.5243 14.2678 18.8285L26.1854 17.4247C26.1065 16.755 25.9286 16.2647 25.8836 16.1406C25.8211 15.9681 25.769 15.8536 25.7682 15.8518C25.7634 15.8411 25.7963 15.9135 25.924 16.1714C26.1657 16.6594 26.6102 17.5378 27.4314 19.1547L16.7324 24.5889ZM14.2532 18.6906C13.8885 14.8277 16.9919 11.2204 21.2229 11.4957L20.4436 23.4704C23.949 23.6985 26.4947 20.6831 26.2 17.5626L14.2532 18.6906Z", "fill", "#5A6F8F", "mask", "url(#path-6-inside-1_0_1)"], ["x", "20.541", "y", "18.7961", "width", "1.17902", "height", "5.68277", "transform", "rotate(-26.9 20.541 18.7961)", "fill", "#E9ECEE"], ["matTooltip", "Entities Extensions", 1, "button", 3, "click"], ["d", "M29.582 9.44922H33.8125V12.5078H29.582V17.2891H26.3594V12.5078H22.1172V9.44922H26.3594V4.86719H29.582V9.44922Z", "fill", "#5A6F8F"], ["x1", "12.6261", "y1", "12.687", "x2", "16.6261", "y2", "20.687", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["x", "4.7", "y", "5.7", "width", "11.6", "height", "6.6", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M23.3 24.5C23.3 25.1442 22.8884 25.8274 22.0133 26.3843C21.1465 26.9359 19.9062 27.3 18.5 27.3C17.0938 27.3 15.8535 26.9359 14.9867 26.3843C14.1116 25.8274 13.7 25.1442 13.7 24.5C13.7 23.8558 14.1116 23.1726 14.9867 22.6157C15.8535 22.0641 17.0938 21.7 18.5 21.7C19.9062 21.7 21.1465 22.0641 22.0133 22.6157C22.8884 23.1726 23.3 23.8558 23.3 24.5Z", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M17.1168 21.2693L13.8438 20.5255L18.1882 18.0885L17.1168 21.2693Z", "fill", "#5A6F8F"], ["d", "M18.5 33L14.6029 30H22.3971L18.5 33Z", "fill", "#5A6F8F"], ["d", "M18.5 30L22.3971 33H14.6029L18.5 30Z", "fill", "#5A6F8F"], [1, "extensionsDiv", 2, "margin-left", "300px"], ["class", "button", "matTooltip", "Shrink To Text Size", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Arrange Connected links", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Select Connected Things", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Set Range", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Remove Range", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Toggle Value Object", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "Reset Value", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Add Waiting Process", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Remove Waiting Process", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Create Digital Twin", 3, "click", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "button", "matTooltip", "Add attributes/instances/values from CSV", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Unlink Stereotype", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Remove Stereotype", 3, "click", 4, "ngIf"], [3, "src"], ["d", "M28.1992 22.9277L25.8789 30H24.0098L27.1797 21.4688H28.3691L28.1992 22.9277ZM30.127 30L27.8008 22.9277L27.6133 21.4688H28.8145L32.002 30H30.127ZM30.0215 26.8242V28.2012H25.5156V26.8242H30.0215Z", "fill", "white"], ["d", "M25.746 23.5811C25.8104 23.9437 25.4738 24.2491 25.1191 24.1499L17.6707 22.0675C17.2919 21.9616 17.178 21.48 17.4693 21.2157L23.5667 15.683C23.858 15.4187 24.3263 15.5786 24.395 15.9659L25.746 23.5811Z", "fill", "white"], ["x", "23.4065", "y", "20.8538", "width", "1.69278", "height", "8.51919", "rx", "0.5", "transform", "rotate(137.78 23.4065 20.8538)", "fill", "white"], ["d", "M9.42853 7.67455C9.36419 7.31189 9.70075 7.0065 10.0555 7.10567L17.5039 9.18813C17.8827 9.29403 17.9965 9.77564 17.7053 10.0399L11.6078 15.5726C11.3165 15.837 10.8482 15.677 10.7795 15.2897L9.42853 7.67455Z", "fill", "white"], ["x", "11.6978", "y", "10.4719", "width", "1.7173", "height", "8.51919", "rx", "0.5", "transform", "rotate(-42.22 11.6978 10.4719)", "fill", "white"], ["x", "4.5", "y", "3.5", "width", "14", "height", "13", "stroke", "white", "stroke-dasharray", "2 2"], ["d", "M28.1992 22.9277L25.8789 30H24.0098L27.1797 21.4688H28.3691L28.1992 22.9277ZM30.127 30L27.8008 22.9277L27.6133 21.4688H28.8145L32.002 30H30.127ZM30.0215 26.8242V28.2012H25.5156V26.8242H30.0215Z", "fill", "#5A6F8F"], ["d", "M25.746 23.5811C25.8104 23.9437 25.4738 24.2491 25.1191 24.1499L17.6707 22.0675C17.2919 21.9616 17.178 21.48 17.4693 21.2157L23.5667 15.683C23.858 15.4187 24.3263 15.5786 24.395 15.9659L25.746 23.5811Z", "fill", "#5A6F8F"], ["x", "23.4065", "y", "20.8538", "width", "1.69278", "height", "8.51919", "rx", "0.5", "transform", "rotate(137.78 23.4065 20.8538)", "fill", "#5A6F8F"], ["d", "M9.42853 7.67455C9.36419 7.31189 9.70075 7.0065 10.0555 7.10567L17.5039 9.18813C17.8827 9.29403 17.9965 9.77564 17.7053 10.0399L11.6078 15.5726C11.3165 15.837 10.8482 15.677 10.7795 15.2897L9.42853 7.67455Z", "fill", "#5A6F8F"], ["x", "11.6978", "y", "10.4719", "width", "1.7173", "height", "8.51919", "rx", "0.5", "transform", "rotate(-42.22 11.6978 10.4719)", "fill", "#5A6F8F"], ["x", "4.5", "y", "3.5", "width", "14", "height", "13", "stroke", "#5A6F8F", "stroke-dasharray", "2 2"], ["matTooltip", "Shrink To Text Size", 1, "button", 3, "click"], ["d", "M7.94531 19.8906V27H7.01758V19.8906H7.94531ZM10.2305 19.8906V20.6621H4.7373V19.8906H10.2305ZM12.8525 27.0977C12.4847 27.0977 12.151 27.0358 11.8516 26.9121C11.5553 26.7852 11.2998 26.6077 11.085 26.3799C10.8734 26.152 10.7106 25.8818 10.5967 25.5693C10.4827 25.2568 10.4258 24.915 10.4258 24.5439V24.3389C10.4258 23.9092 10.4893 23.5267 10.6162 23.1914C10.7432 22.8529 10.9157 22.5664 11.1338 22.332C11.3519 22.0977 11.5993 21.9202 11.876 21.7998C12.1527 21.6794 12.4391 21.6191 12.7354 21.6191C13.113 21.6191 13.4385 21.6842 13.7119 21.8145C13.9886 21.9447 14.2148 22.127 14.3906 22.3613C14.5664 22.5924 14.6966 22.8659 14.7812 23.1816C14.8659 23.4941 14.9082 23.8359 14.9082 24.207V24.6123H10.9629V23.875H14.0049V23.8066C13.9919 23.5723 13.943 23.3444 13.8584 23.123C13.777 22.9017 13.6468 22.7194 13.4678 22.5762C13.2887 22.4329 13.0446 22.3613 12.7354 22.3613C12.5303 22.3613 12.3415 22.4053 12.1689 22.4932C11.9964 22.5778 11.8483 22.7048 11.7246 22.874C11.6009 23.0433 11.5049 23.25 11.4365 23.4941C11.3682 23.7383 11.334 24.0199 11.334 24.3389V24.5439C11.334 24.7946 11.3682 25.0306 11.4365 25.252C11.5081 25.4701 11.6107 25.6621 11.7441 25.8281C11.8809 25.9941 12.0452 26.1243 12.2373 26.2188C12.4326 26.3132 12.654 26.3604 12.9014 26.3604C13.2204 26.3604 13.4906 26.2952 13.7119 26.165C13.9333 26.0348 14.127 25.8607 14.293 25.6426L14.8398 26.0771C14.7259 26.2497 14.5811 26.4141 14.4053 26.5703C14.2295 26.7266 14.013 26.8535 13.7559 26.9512C13.502 27.0488 13.2008 27.0977 12.8525 27.0977ZM16.5732 21.7168L17.7305 23.6406L18.9023 21.7168H19.9619L18.2334 24.3242L20.0156 27H18.9707L17.75 25.0176L16.5293 27H15.4795L17.2568 24.3242L15.5332 21.7168H16.5732ZM23.1357 21.7168V22.4102H20.2793V21.7168H23.1357ZM21.2461 20.4326H22.1494V25.6914C22.1494 25.8704 22.1771 26.0055 22.2324 26.0967C22.2878 26.1878 22.3594 26.248 22.4473 26.2773C22.5352 26.3066 22.6296 26.3213 22.7305 26.3213C22.8053 26.3213 22.8835 26.3148 22.9648 26.3018C23.0495 26.2855 23.113 26.2725 23.1553 26.2627L23.1602 27C23.0885 27.0228 22.9941 27.0439 22.877 27.0635C22.763 27.0863 22.6247 27.0977 22.4619 27.0977C22.2406 27.0977 22.0371 27.0537 21.8516 26.9658C21.666 26.8779 21.5179 26.7314 21.4072 26.5264C21.2998 26.318 21.2461 26.0381 21.2461 25.6865V20.4326Z", "fill", "#5A6F8F"], ["d", "M26.1845 16.5922C25.8516 16.7634 25.4555 16.5214 25.4559 16.147L25.4617 11.1205C25.4621 10.7303 25.8894 10.491 26.2224 10.6944L30.6871 13.4229C31.02 13.6264 31.002 14.1158 30.6549 14.2942L26.1845 16.5922Z", "fill", "#5A6F8F"], ["x", "27.9299", "y", "14.8811", "width", "2.20854", "height", "6.13612", "rx", "0.5", "transform", "rotate(-148.57 27.9299 14.8811)", "fill", "#5A6F8F"], ["x", "3.5", "y", "6.5", "width", "29", "height", "22", "stroke", "#5A6F8F", "stroke-dasharray", "2 2"], ["x", "3.5", "y", "18.5", "width", "21", "height", "10", "stroke", "#5A6F8F"], ["matTooltip", "Arrange Connected links", 1, "button", 3, "click"], ["d", "M29.0804 18.6121C28.9327 18.7552 28.6881 18.7106 28.6004 18.5247L26.1029 13.2332C25.9987 13.0124 26.1878 12.7663 26.428 12.81L33.1288 14.0311C33.369 14.0748 33.4591 14.3719 33.2838 14.5417L29.0804 18.6121Z", "fill", "#5A6F8F"], ["d", "M24.6104 5.26697V5.26697C28.5155 6.09446 30.8723 10.0908 29.7067 13.9087L29.6052 14.2411", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["x", "8", "y", "2", "width", "9", "height", "6", "rx", "3", "fill", "#5A6F8F"], ["x", "3.5", "y", "11.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x", "15.5", "y", "11.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x1", "12.5", "y1", "6", "x2", "12.5", "y2", "10", "stroke", "#5A6F8F"], ["x1", "19", "y1", "9.5", "x2", "6", "y2", "9.5", "stroke", "#5A6F8F"], ["x1", "6.5", "y1", "9", "x2", "6.5", "y2", "12", "stroke", "#5A6F8F"], ["x1", "18.5", "y1", "9", "x2", "18.5", "y2", "12", "stroke", "#5A6F8F"], ["x", "18", "y", "18", "width", "9", "height", "6", "rx", "3", "fill", "#5A6F8F"], ["x", "13.5", "y", "27.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x", "25.5", "y", "27.5", "width", "6", "height", "4", "rx", "2", "stroke", "#5A6F8F"], ["x1", "20.5", "y1", "22", "x2", "20.5", "y2", "26", "stroke", "#5A6F8F"], ["x1", "21", "y1", "25.5", "x2", "16", "y2", "25.5", "stroke", "#5A6F8F"], ["x1", "24.5", "y1", "22", "x2", "24.5", "y2", "26", "stroke", "#5A6F8F"], ["x1", "29", "y1", "25.5", "x2", "24", "y2", "25.5", "stroke", "#5A6F8F"], ["x1", "16.5", "y1", "25", "x2", "16.5", "y2", "28", "stroke", "#5A6F8F"], ["x1", "28.5", "y1", "25", "x2", "28.5", "y2", "28", "stroke", "#5A6F8F"], ["matTooltip", "Select Connected Things", 1, "button", 3, "click"], ["id", "path-3-inside-1_0_1", "fill", "white"], ["d", "M18.8871 15.8377C18.6768 16.0337 18.571 16.2093 18.487 16.5033C18.3957 16.8053 18.3999 17.1075 18.4939 17.4129C18.5368 17.5575 19.196 18.8782 20.6114 21.665L22.6642 25.7065L21.437 25.6847C20.7624 25.6742 20.1253 25.6773 20.0193 25.6947C19.7504 25.7378 19.3756 25.8958 19.2071 26.0384C18.6332 26.5126 18.5303 27.4168 18.9835 28.0306C19.2808 28.4355 19.1498 28.3804 23.0688 29.7859C26.8942 31.1579 26.9846 31.1851 27.7898 31.2265C28.9055 31.2847 30.1043 30.9638 30.9648 30.3767C32.4968 29.3266 33.2536 27.4732 32.9314 25.5514C32.7966 24.7515 32.8561 24.8836 31.0829 21.3697C30.0812 19.375 29.4397 18.1345 29.3559 18.0147C28.963 17.4595 28.3079 17.2163 27.682 17.3922C27.3852 17.4781 27.1953 17.6313 26.8876 18.0269C26.8712 18.0473 26.7961 18.0125 26.7186 17.9503C26.5322 17.8015 26.1791 17.6563 25.9594 17.638C25.4304 17.5903 24.9478 17.8151 24.6504 18.2461L24.5705 18.3598L24.3969 18.2288C24.1572 18.0502 23.7024 17.908 23.4315 17.932C23.0959 17.9564 22.7338 18.1323 22.5063 18.3695L22.3237 18.5595L21.7487 17.4273C21.403 16.7467 21.1221 16.224 21.0419 16.1187C20.502 15.3949 19.506 15.2637 18.8871 15.8377ZM19.8974 16.2456C19.9886 16.2521 20.1351 16.2993 20.2243 16.3472L20.3876 16.4428L22.1492 19.8734C23.5392 22.5799 23.9297 23.3188 23.988 23.358C24.0762 23.4188 24.2604 23.4348 24.3546 23.387C24.3911 23.3685 24.4495 23.3104 24.4834 23.2567C24.6137 23.0689 24.6071 23.0559 23.6897 21.2496C22.8984 19.6917 22.8523 19.5934 22.8496 19.4528C22.8366 18.8022 23.4933 18.4686 24.011 18.8629C24.1231 18.948 24.1752 19.0431 24.9665 20.6011C25.884 22.4074 25.8905 22.4202 26.119 22.426C26.2674 22.4318 26.3463 22.3917 26.4291 22.2684C26.5549 22.0869 26.5364 22.0355 25.8155 20.6162C25.2601 19.5228 25.1564 19.3036 25.1436 19.1804C25.0891 18.5913 25.6917 18.204 26.2127 18.4993L26.3759 18.5949L27.089 19.9611C27.8579 21.437 27.8562 21.4338 28.0693 21.4392C28.2129 21.4434 28.292 21.4032 28.3747 21.2801C28.496 21.1048 28.4689 21.0211 27.9283 19.9568C27.4466 19.0084 27.4369 18.9892 27.4363 18.8149C27.4343 18.54 27.5502 18.3391 27.793 18.1996C28.0388 18.0585 28.247 18.0543 28.5011 18.1931L28.6657 18.2839L30.3146 21.5079C31.705 24.2303 31.9775 24.7818 32.0589 25.0325C32.5218 26.4934 32.1982 28.078 31.213 29.1504C30.8797 29.5105 30.5777 29.7368 30.1078 29.9714C29.0573 30.501 27.9233 30.6102 26.7318 30.2902C26.5375 30.2389 24.8895 29.6597 23.0707 29.0011C19.48 27.7053 19.6347 27.7768 19.4869 27.4178C19.4022 27.2132 19.4232 26.9835 19.5438 26.7842C19.6247 26.6499 19.9329 26.481 20.1511 26.4514C20.231 26.4432 20.9887 26.4439 21.8423 26.4527C22.6944 26.4662 23.4209 26.4584 23.4574 26.4399C23.5698 26.3827 23.6546 26.218 23.6428 26.082C23.6319 25.9699 23.2889 25.2798 21.4 21.5608C19.4259 17.6741 19.1698 17.155 19.1553 17.0284C19.1142 16.5786 19.4554 16.2186 19.8974 16.2456Z"], ["d", "M18.8871 15.8377L14.7958 11.4489L14.8014 11.4437L14.8071 11.4384L18.8871 15.8377ZM18.487 16.5033L24.2562 18.1516L24.2435 18.1961L24.23 18.2404L18.487 16.5033ZM18.4939 17.4129L24.2285 15.6482L24.2376 15.6777L24.2463 15.7072L18.4939 17.4129ZM22.6642 25.7065L28.0137 22.9894L32.531 31.8832L22.5574 31.7056L22.6642 25.7065ZM21.437 25.6847L21.5301 19.6854L21.5438 19.6856L21.437 25.6847ZM20.0193 25.6947L20.991 31.6155L20.9797 31.6174L20.9684 31.6192L20.0193 25.6947ZM19.2071 26.0384L23.083 30.6185L23.0561 30.6413L23.0289 30.6637L19.2071 26.0384ZM18.9835 28.0306L23.8103 24.4666L23.8149 24.4729L23.8195 24.4791L18.9835 28.0306ZM23.0688 29.7859L25.0942 24.1381L25.0943 24.1381L23.0688 29.7859ZM27.7898 31.2265L28.098 25.2345L28.1018 25.2347L27.7898 31.2265ZM30.9648 30.3767L34.357 35.3258L34.3464 35.3329L30.9648 30.3767ZM32.9314 25.5514L38.848 24.5545L38.8488 24.5592L32.9314 25.5514ZM31.0829 21.3697L25.7263 24.0727L25.7211 24.0624L31.0829 21.3697ZM29.3559 18.0147L34.2537 14.5489L34.2628 14.5619L34.2719 14.5749L29.3559 18.0147ZM27.682 17.3922L26.014 11.6287L26.0363 11.6222L26.0587 11.6159L27.682 17.3922ZM26.8876 18.0269L31.6234 21.7109L31.5943 21.7483L31.5646 21.7853L26.8876 18.0269ZM26.7186 17.9503L30.4613 13.2607L30.4718 13.2691L26.7186 17.9503ZM25.9594 17.638L25.4603 23.6172L25.4405 23.6156L25.4206 23.6138L25.9594 17.638ZM24.6504 18.2461L29.5892 21.6532L29.5745 21.6745L29.5596 21.6957L24.6504 18.2461ZM24.5705 18.3598L29.4797 21.8094L25.9115 26.8873L20.957 23.1496L24.5705 18.3598ZM24.3969 18.2288L27.981 13.4169L27.9958 13.4279L28.0105 13.439L24.3969 18.2288ZM23.4315 17.932L23.9608 23.9086L23.914 23.9128L23.8671 23.9162L23.4315 17.932ZM22.5063 18.3695L26.8365 22.5228L26.8328 22.5266L22.5063 18.3695ZM22.3237 18.5595L26.6502 22.7166L20.7987 28.8064L16.9742 21.2766L22.3237 18.5595ZM21.0419 16.1187L16.27 19.7559L16.251 19.731L16.2323 19.7059L21.0419 16.1187ZM19.8974 16.2456L20.2638 10.2568L20.2926 10.2586L20.3214 10.2606L19.8974 16.2456ZM20.2243 16.3472L23.062 11.0607L23.16 11.1133L23.2559 11.1694L20.2243 16.3472ZM20.3876 16.4428L23.4191 11.265L24.9269 12.1478L25.725 13.702L20.3876 16.4428ZM22.1492 19.8734L16.812 22.6146L16.8118 22.6142L22.1492 19.8734ZM23.988 23.358L27.3398 18.3815L27.3658 18.3991L27.3917 18.4169L23.988 23.358ZM24.4834 23.2567L19.4099 20.0537L19.4794 19.9435L19.5537 19.8364L24.4834 23.2567ZM22.8496 19.4528L28.8484 19.3329L28.8485 19.3375L22.8496 19.4528ZM24.011 18.8629L20.3849 23.6432L20.3757 23.6363L24.011 18.8629ZM26.119 22.426L26.2714 16.4279L26.3125 16.4289L26.3535 16.4306L26.119 22.426ZM26.4291 22.2684L21.4494 18.9214L21.4732 18.8861L21.4974 18.8511L26.4291 22.2684ZM25.1436 19.1804L19.1758 19.8017L19.1722 19.7673L19.1691 19.7328L25.1436 19.1804ZM26.2127 18.4993L29.1715 13.2796L29.2081 13.3003L29.2443 13.3216L26.2127 18.4993ZM26.3759 18.5949L29.4075 13.4171L30.8966 14.2889L31.695 15.8186L26.3759 18.5949ZM27.089 19.9611L32.4081 17.1848L32.4104 17.1892L27.089 19.9611ZM28.0693 21.4392L28.2204 15.4411L28.2329 15.4414L28.2454 15.4418L28.0693 21.4392ZM28.3747 21.2801L23.393 17.9359L23.4173 17.8998L23.4421 17.864L28.3747 21.2801ZM27.4363 18.8149L33.4361 18.7714L33.4362 18.7822L33.4362 18.793L27.4363 18.8149ZM27.793 18.1996L30.7812 23.4026L30.7809 23.4028L27.793 18.1996ZM28.5011 18.1931L31.3778 12.9276L31.3888 12.9337L31.3998 12.9398L28.5011 18.1931ZM28.6657 18.2839L31.5644 13.0306L33.1717 13.9174L34.0076 15.5518L28.6657 18.2839ZM30.3146 21.5079L35.6565 18.7758L35.6581 18.7789L30.3146 21.5079ZM32.0589 25.0325L37.7657 23.1798L37.7722 23.2L37.7786 23.2201L32.0589 25.0325ZM31.213 29.1504L35.6315 33.2096L35.6237 33.2181L35.6158 33.2266L31.213 29.1504ZM30.1078 29.9714L27.4071 24.6136L27.4172 24.6085L27.4274 24.6034L30.1078 29.9714ZM26.7318 30.2902L28.2653 24.4895L28.2767 24.4925L28.2882 24.4956L26.7318 30.2902ZM23.0707 29.0011L25.1074 23.3574L25.1137 23.3596L23.0707 29.0011ZM19.4869 27.4178L25.0304 25.122L25.0352 25.1339L19.4869 27.4178ZM19.5438 26.7842L24.6828 29.881L24.6768 29.891L19.5438 26.7842ZM20.1511 26.4514L19.344 20.5059L19.4419 20.4926L19.5402 20.4826L20.1511 26.4514ZM21.8423 26.4527L21.9041 20.453L21.9208 20.4532L21.9375 20.4534L21.8423 26.4527ZM23.6428 26.082L29.6143 25.4976L29.6176 25.5315L29.6206 25.5654L23.6428 26.082ZM19.1553 17.0284L13.1945 17.7131L13.1865 17.6438L13.1801 17.5742L19.1553 17.0284ZM22.9784 20.2264C23.1741 20.044 23.4895 19.7116 23.7816 19.2258C24.0665 18.7519 24.2009 18.3451 24.2562 18.1516L12.7178 14.8551C13.0831 13.5766 13.7397 12.4334 14.7958 11.4489L22.9784 20.2264ZM24.23 18.2404C24.5004 17.3466 24.4686 16.4285 24.2285 15.6482L12.7592 19.1776C12.3312 17.7865 12.2909 16.264 12.744 14.7663L24.23 18.2404ZM24.2463 15.7072C24.1571 15.4065 24.0634 15.1844 24.0577 15.1706C24.0318 15.1077 24.0136 15.0671 24.0119 15.0634C24.0075 15.0537 24.0183 15.0777 24.0546 15.1534C24.1243 15.299 24.2386 15.532 24.4082 15.8723C24.7442 16.5467 25.254 17.556 25.961 18.9479L15.2619 24.3821C14.5534 22.9872 14.0258 21.9428 13.6677 21.224C13.4901 20.8677 13.3432 20.5692 13.233 20.3394C13.1794 20.2274 13.1205 20.1027 13.0663 19.9822C13.0398 19.9231 13.0016 19.8367 12.9606 19.7371C12.9398 19.6867 12.836 19.4374 12.7414 19.1186L24.2463 15.7072ZM25.961 18.9479L28.0137 22.9894L17.3147 28.4236L15.2619 24.3821L25.961 18.9479ZM22.5574 31.7056L21.3302 31.6837L21.5438 19.6856L22.771 19.7075L22.5574 31.7056ZM21.3439 31.6839C21.0399 31.6792 20.757 31.6778 20.5535 31.6791C20.4485 31.6798 20.3905 31.681 20.3722 31.6816C20.3612 31.6819 20.3894 31.6813 20.4418 31.6781C20.4684 31.6765 20.522 31.6731 20.5927 31.6666C20.6292 31.6633 20.6794 31.6583 20.7398 31.6511C20.7976 31.6442 20.8848 31.633 20.991 31.6155L19.0475 19.7739C19.3905 19.7176 19.6796 19.7023 19.7241 19.6996C19.8343 19.693 19.935 19.6893 20.0091 19.6871C20.1612 19.6825 20.3244 19.6803 20.4763 19.6794C20.7865 19.6774 21.1595 19.6796 21.5301 19.6854L21.3439 31.6839ZM20.9684 31.6192C21.4377 31.544 21.7519 31.4233 21.911 31.356C22.0152 31.312 22.1517 31.2486 22.3136 31.1573C22.4519 31.0794 22.7423 30.9068 23.083 30.6185L15.3311 21.4583C16.0824 20.8225 16.8496 20.4674 17.2401 20.3024C17.696 20.1098 18.332 19.8885 19.0701 19.7703L20.9684 31.6192ZM23.0289 30.6637C24.995 29.0392 25.185 26.3284 23.8103 24.4666L14.1567 31.5946C11.8756 28.5052 12.2714 23.9859 15.3853 21.413L23.0289 30.6637ZM23.8195 24.4791C23.8383 24.5048 23.8554 24.5283 23.8625 24.538C23.8726 24.5519 23.8708 24.5494 23.867 24.5443C23.8598 24.5345 23.8104 24.4672 23.7382 24.3785C23.5644 24.1648 23.3132 23.8923 22.9794 23.6211C22.6701 23.3698 22.4004 23.2098 22.2435 23.1243C22.0974 23.0447 22.0093 23.0086 22.0381 23.021C22.1149 23.054 22.3327 23.1405 22.8802 23.3408C23.4007 23.5312 24.1027 23.7825 25.0942 24.1381L21.0433 35.4337C19.2256 34.7818 18.0144 34.3531 17.298 34.0451C16.9344 33.8888 16.1711 33.5509 15.4129 32.935C14.5859 32.2631 14.0382 31.4333 14.1475 31.5821L23.8195 24.4791ZM25.0943 24.1381C27.0921 24.8546 27.8883 25.1368 28.3127 25.2663C28.4731 25.3153 28.4013 25.2855 28.2231 25.2563C28.043 25.2267 27.9041 25.2245 28.098 25.2345L27.4816 37.2186C25.562 37.1199 24.4258 36.6468 21.0432 35.4336L25.0943 24.1381ZM28.1018 25.2347C27.9944 25.2291 27.9443 25.2415 27.9216 25.2476C27.9035 25.2525 27.8703 25.2626 27.8211 25.2846C27.7729 25.306 27.6905 25.3472 27.5832 25.4204L34.3464 35.3329C32.3202 36.7155 29.8034 37.3395 27.4777 37.2184L28.1018 25.2347ZM27.5727 25.4276C27.3467 25.5825 27.1794 25.8004 27.0876 26.0254C26.9972 26.247 26.9955 26.4331 27.014 26.5436L38.8488 24.5592C39.5338 28.6448 37.929 32.8774 34.357 35.3258L27.5727 25.4276ZM27.0148 26.5482C26.9579 26.2106 26.9873 26.4108 27.0353 26.5917C27.1028 26.8466 27.1721 26.9908 27.1332 26.9028C27.0818 26.7863 26.9727 26.5557 26.7289 26.0655C26.4928 25.5909 26.1746 24.9611 25.7263 24.0727L36.4395 18.6666C37.2724 20.3172 37.8053 21.3643 38.1099 22.0538C38.2946 22.472 38.4851 22.9528 38.6348 23.5176C38.7649 24.0086 38.8375 24.4922 38.848 24.5545L27.0148 26.5482ZM25.7211 24.0624C25.2255 23.0756 24.8249 22.287 24.5419 21.7379C24.3992 21.461 24.2942 21.2601 24.2254 21.1311C24.2089 21.1001 24.1961 21.0764 24.1867 21.059C24.1769 21.041 24.1732 21.0344 24.1745 21.0367C24.1753 21.0382 24.1787 21.0442 24.1843 21.054C24.1896 21.0632 24.1994 21.0803 24.2129 21.1031C24.2175 21.111 24.3065 21.264 24.4399 21.4546L34.2719 14.5749C34.4158 14.7805 34.5196 14.9572 34.5434 14.9973C34.587 15.0712 34.6247 15.1379 34.6517 15.1862C34.7065 15.2844 34.7631 15.3892 34.8151 15.4868C34.9215 15.6864 35.0552 15.9428 35.2085 16.2404C35.5176 16.84 35.9386 17.669 36.4447 18.6769L25.7211 24.0624ZM24.4581 21.4806C25.4433 22.8727 27.3439 23.7196 29.3053 23.1684L26.0587 11.6159C29.2719 10.7129 32.4828 12.0464 34.2537 14.5489L24.4581 21.4806ZM29.3499 23.1557C29.5758 23.0903 29.8669 22.9868 30.1893 22.8233C30.5155 22.6579 30.7994 22.4688 31.0386 22.2773C31.4654 21.9357 31.6815 21.6362 31.6234 21.7109L22.1517 14.3429C22.7774 13.5386 23.9384 12.2294 26.014 11.6287L29.3499 23.1557ZM31.5646 21.7853C29.4933 24.3628 26.5995 24.0478 26.096 23.9828C25.2335 23.8713 24.5964 23.5974 24.3346 23.4779C23.7246 23.1994 23.2627 22.8699 22.9655 22.6315L30.4718 13.2691C30.252 13.0929 29.8664 12.8119 29.3174 12.5613C29.0861 12.4557 28.4757 12.1905 27.6343 12.0818C27.1519 12.0194 24.2736 11.7012 22.2106 14.2685L31.5646 21.7853ZM22.9759 22.6399C23.2568 22.8641 23.4965 23.0076 23.6408 23.0876C23.7976 23.1746 23.9407 23.2414 24.069 23.2941C24.1962 23.3465 24.3539 23.4036 24.5443 23.4563C24.714 23.5033 25.0339 23.5816 25.4603 23.6172L26.4586 11.6588C27.4205 11.7391 28.2013 12.0184 28.634 12.1964C29.0924 12.3849 29.779 12.7162 30.4613 13.2607L22.9759 22.6399ZM25.4206 23.6138C27.016 23.7576 28.64 23.0291 29.5892 21.6532L19.7116 14.839C21.2555 12.601 23.8447 11.423 26.4982 11.6622L25.4206 23.6138ZM29.5596 21.6957L29.4797 21.8094L19.6614 14.9101L19.7413 14.7964L29.5596 21.6957ZM20.957 23.1496L20.7834 23.0186L28.0105 13.439L28.1841 13.5699L20.957 23.1496ZM20.8129 23.0407C21.1506 23.2923 21.4416 23.4445 21.6202 23.5288C21.8131 23.6199 21.9912 23.6865 22.154 23.7368C22.3147 23.7865 22.519 23.8385 22.7676 23.876C22.989 23.9094 23.4117 23.9573 23.9608 23.9086L22.9021 11.9554C24.1308 11.8466 25.1578 12.1051 25.6978 12.272C26.2866 12.454 27.1428 12.7926 27.981 13.4169L20.8129 23.0407ZM23.8671 23.9162C24.5483 23.8666 25.0984 23.6832 25.5092 23.4875C25.92 23.2918 26.3884 22.99 26.8365 22.5228L18.1762 14.2162C19.3998 12.9404 21.1363 12.0832 22.9958 11.9478L23.8671 23.9162ZM26.8328 22.5266L26.6502 22.7166L17.9973 14.4024L18.1799 14.2123L26.8328 22.5266ZM16.9742 21.2766L16.3992 20.1444L27.0982 14.7102L27.6732 15.8424L16.9742 21.2766ZM16.3992 20.1444C16.2396 19.8303 16.107 19.5764 16.0148 19.4054C15.9927 19.3643 15.975 19.3321 15.9616 19.3079C15.9478 19.283 15.9418 19.2726 15.9425 19.2739C15.9432 19.275 15.9472 19.2819 15.9542 19.2936C15.9609 19.3048 15.9734 19.3256 15.9908 19.3536C16.0073 19.38 16.0359 19.4252 16.0743 19.4825C16.1087 19.5338 16.1764 19.6332 16.27 19.7559L25.8137 12.4815C26.2077 12.9984 26.549 13.6578 26.5766 13.7091C26.7313 13.9959 26.912 14.3437 27.0982 14.7102L16.3992 20.1444ZM16.2323 19.7059C17.5411 21.4607 20.6343 22.4005 22.9671 20.2369L14.8071 11.4384C18.3777 8.1269 23.4629 9.32906 25.8515 12.5316L16.2323 19.7059ZM20.3214 10.2606C21.4354 10.3395 22.4016 10.7062 23.062 11.0607L17.3867 21.6338C17.7554 21.8317 18.0631 21.9421 18.2614 22.0044C18.3797 22.0417 18.5257 22.0826 18.6975 22.12C18.8536 22.154 19.125 22.2059 19.4735 22.2306L20.3214 10.2606ZM23.2559 11.1694L23.4191 11.265L17.356 21.6206L17.1928 21.5251L23.2559 11.1694ZM25.725 13.702L27.4866 17.1326L16.8118 22.6142L15.0501 19.1836L25.725 13.702ZM27.4864 17.1322C28.1837 18.4899 28.6137 19.3217 28.8742 19.8152C29.0092 20.0708 29.0705 20.1822 29.0883 20.2135C29.1025 20.2386 29.06 20.1615 28.9831 20.0429C28.9479 19.9887 28.8511 19.8411 28.7088 19.6581C28.6368 19.5655 28.5111 19.4095 28.3394 19.2281C28.2511 19.1347 28.1305 19.0134 27.9801 18.8791C27.8341 18.7489 27.6189 18.5695 27.3398 18.3815L20.6363 28.3346C19.7713 27.752 19.2674 27.065 19.2373 27.0262C19.0821 26.8268 18.9696 26.6566 18.9155 26.5732C18.8007 26.3961 18.7072 26.2337 18.6549 26.1417C18.5396 25.9388 18.4055 25.689 18.2618 25.4167C17.965 24.8543 17.5047 23.9634 16.812 22.6146L27.4864 17.1322ZM27.3917 18.4169C26.7544 17.9779 26.1637 17.7586 25.7862 17.6458C25.3803 17.5246 24.9995 17.4611 24.6577 17.4332C24.3173 17.4054 23.9174 17.4048 23.4729 17.4644C23.0614 17.5195 22.3898 17.6553 21.6374 18.0375L27.0717 28.7365C25.6318 29.4678 24.2961 29.4436 23.6804 29.3933C23.0379 29.3408 21.8132 29.1457 20.5843 28.2992L27.3917 18.4169ZM21.6374 18.0375C21.1533 18.2834 20.8114 18.5421 20.6429 18.6766C20.446 18.8337 20.2872 18.9818 20.1647 19.1051C19.941 19.3301 19.6702 19.6413 19.4099 20.0537L29.5569 26.4598C29.2627 26.9258 28.9458 27.2928 28.6753 27.565C28.4901 27.7512 27.935 28.298 27.0717 28.7365L21.6374 18.0375ZM19.5537 19.8364C19.6106 19.7545 18.6627 20.9616 18.5543 22.7559C18.509 23.5055 18.6199 24.0986 18.7017 24.4347C18.7819 24.7642 18.8722 24.9966 18.9012 25.0699C18.9513 25.1964 18.9684 25.2167 18.8402 24.9574C18.7306 24.7357 18.576 24.4311 18.3402 23.9667L29.0392 18.5325C29.4042 19.2512 29.8246 20.062 30.0577 20.6502C30.145 20.8706 30.6213 22.0088 30.5324 23.4799C30.4172 25.3859 29.4213 26.6651 29.413 26.677L19.5537 19.8364ZM18.3402 23.9667C17.9704 23.2386 17.7022 22.7107 17.5388 22.3614C17.4082 22.082 16.8785 21.015 16.8507 19.5681L28.8485 19.3375C28.8455 19.181 28.8336 18.9026 28.7789 18.5601C28.7257 18.2272 28.651 17.9506 28.5852 17.7451C28.524 17.5538 28.4674 17.4149 28.4428 17.3561C28.4169 17.2941 28.4016 17.2622 28.409 17.278C28.4268 17.3161 28.475 17.4158 28.5879 17.6408C28.6957 17.8558 28.8403 18.1409 29.0392 18.5325L18.3402 23.9667ZM16.8508 19.5728C16.8008 17.0754 18.121 14.632 20.5141 13.4165C22.9073 12.201 25.6591 12.5762 27.6462 14.0896L20.3757 23.6363C21.8452 24.7554 24.0098 25.1002 25.9484 24.1155C27.8869 23.1309 28.8853 21.1796 28.8484 19.3329L16.8508 19.5728ZM27.6371 14.0826C28.7928 14.9593 29.3433 16.0188 29.4921 16.2896C29.678 16.6278 29.9463 17.156 30.3161 17.884L19.617 23.3182C19.4181 22.9266 19.2732 22.6417 19.1632 22.4278C19.0481 22.204 18.9961 22.1064 18.976 22.0698C18.9676 22.0546 18.9845 22.086 19.0194 22.1438C19.0525 22.1985 19.1317 22.3266 19.2504 22.4893C19.3781 22.6642 19.558 22.8882 19.7963 23.1279C20.0414 23.3745 20.2599 23.5484 20.3849 23.6432L27.6371 14.0826ZM30.3161 17.884C30.5519 18.3483 30.7067 18.6529 30.8211 18.8721C30.9549 19.1286 30.9486 19.103 30.8762 18.9881C30.8341 18.9214 30.6998 18.7117 30.4814 18.4528C30.2585 18.1886 29.8454 17.7496 29.2142 17.3441C27.7034 16.3737 26.1711 16.4254 26.2714 16.4279L25.9666 28.424C25.9527 28.4237 24.3338 28.4716 22.7288 27.4407C21.49 26.6449 20.8525 25.5898 20.7261 25.3893C20.3888 24.8545 19.9821 24.037 19.617 23.3182L30.3161 17.884ZM26.3535 16.4306C25.8793 16.412 24.7917 16.4314 23.5815 17.0461C22.3714 17.6607 21.7142 18.5275 21.4494 18.9214L31.4089 25.6155C31.0613 26.1326 30.3232 27.0811 29.0158 27.7451C27.7083 28.4092 26.507 28.4457 25.8845 28.4214L26.3535 16.4306ZM21.4974 18.8511C21.4429 18.9298 20.6548 19.9934 20.5114 21.6C20.3934 22.9234 20.7771 23.8928 20.8146 23.9938C20.887 24.1888 20.9364 24.2744 20.8411 24.0792C20.7649 23.9231 20.6516 23.6987 20.466 23.3333L31.165 17.8991C31.4249 18.4108 31.8325 19.1924 32.0651 19.8192C32.1816 20.1332 32.5914 21.2381 32.464 22.6665C32.3112 24.3782 31.4783 25.5163 31.3609 25.6857L21.4974 18.8511ZM20.466 23.3333C20.2021 22.8137 19.9891 22.392 19.8432 22.0808C19.8088 22.0073 19.3035 21.028 19.1758 19.8017L31.1113 18.559C31.0442 17.9148 30.8826 17.4373 30.8073 17.2323C30.768 17.1257 30.7359 17.0499 30.7225 17.019C30.7082 16.9861 30.7018 16.9729 30.709 16.9881C30.7255 17.0233 30.7645 17.1043 30.8457 17.2669C30.9243 17.4241 31.0273 17.6279 31.165 17.8991L20.466 23.3333ZM19.1691 19.7328C18.6603 14.2311 24.5104 10.6375 29.1715 13.2796L23.2539 23.7191C26.873 25.7706 31.5179 22.9514 31.1181 18.6279L19.1691 19.7328ZM29.2443 13.3216L29.4075 13.4171L23.3444 23.7727L23.1811 23.6771L29.2443 13.3216ZM31.695 15.8186L32.4081 17.1848L21.77 22.7374L21.0569 21.3712L31.695 15.8186ZM32.4104 17.1892C32.6101 17.5726 32.7337 17.8096 32.8231 17.9763C32.9352 18.185 32.8971 18.1 32.787 17.9342C32.752 17.8813 32.143 16.8964 30.8748 16.1834C29.4171 15.3639 27.94 15.434 28.2204 15.4411L27.9183 27.4373C27.9182 27.4373 27.8909 27.4366 27.8621 27.4357C27.8306 27.4347 27.7777 27.4329 27.7131 27.4294C27.5877 27.4228 27.3684 27.4078 27.0993 27.367C26.4975 27.2759 25.7585 27.0734 24.994 26.6436C23.6421 25.8836 22.9455 24.8063 22.7881 24.569C22.4384 24.0421 22.0431 23.2616 21.7677 22.7331L32.4104 17.1892ZM28.2454 15.4418C27.7482 15.4272 26.6721 15.4644 25.4835 16.0806C24.3047 16.6917 23.6598 17.5386 23.393 17.9359L33.3563 24.6242C33.0069 25.1447 32.2811 26.0733 31.0062 26.7342C29.7215 27.4002 28.5341 27.4554 27.8932 27.4366L28.2454 15.4418ZM23.4421 17.864C23.2972 18.0732 22.6515 19.0062 22.4775 20.4124C22.3219 21.6703 22.6284 22.6139 22.7131 22.8655C22.8067 23.1435 22.8907 23.3028 22.8307 23.1773C22.7892 23.0904 22.7171 22.9462 22.5788 22.6739L33.2779 17.2397C33.4424 17.5637 33.8514 18.3398 34.0864 19.0381C34.2302 19.4656 34.5545 20.5295 34.3868 21.8856C34.2007 23.3901 33.5129 24.3993 33.3073 24.6961L23.4421 17.864ZM22.5788 22.6739C22.3964 22.3148 22.1522 21.8414 21.9943 21.476C21.894 21.2438 21.6987 20.7692 21.5707 20.1519C21.4306 19.4763 21.4366 18.9235 21.4363 18.8368L33.4362 18.793C33.4362 18.7923 33.4362 18.7836 33.4361 18.7708C33.4359 18.7578 33.4357 18.737 33.4351 18.711C33.4339 18.6593 33.4313 18.5777 33.4246 18.4767C33.41 18.2571 33.3795 17.9989 33.3207 17.7151C33.2097 17.1801 33.0471 16.8022 33.0095 16.7152C32.9714 16.627 32.9548 16.5988 33.0193 16.7283C33.0748 16.8397 33.1528 16.9935 33.2779 17.2397L22.5788 22.6739ZM21.4364 18.8584C21.429 17.8432 21.6459 16.6318 22.3308 15.4494C23.013 14.2715 23.9469 13.4894 24.8051 12.9965L30.7809 23.4028C31.3963 23.0494 32.1509 22.4374 32.7149 21.4636C33.2815 20.4852 33.4415 19.5117 33.4361 18.7714L21.4364 18.8584ZM24.8049 12.9967C25.5459 12.5711 26.662 12.1084 28.0733 12.0918C29.4851 12.0752 30.6163 12.5116 31.3778 12.9276L25.6245 23.4585C26.1319 23.7357 27.0319 24.1049 28.2146 24.091C29.3968 24.077 30.2859 23.6871 30.7812 23.4026L24.8049 12.9967ZM31.3998 12.9398L31.5644 13.0306L25.767 23.5372L25.6024 23.4464L31.3998 12.9398ZM34.0076 15.5518L35.6565 18.7758L24.9728 24.24L23.3238 21.016L34.0076 15.5518ZM35.6581 18.7789C36.3487 20.1312 36.783 20.9859 37.0554 21.5363C37.2607 21.9513 37.5643 22.5595 37.7657 23.1798L26.3521 26.8852C26.4322 27.1319 26.5039 27.2827 26.4831 27.2367C26.4666 27.2005 26.4171 27.0947 26.2999 26.8579C26.068 26.3893 25.6709 25.607 24.9711 24.2368L35.6581 18.7789ZM37.7786 23.2201C38.846 26.5886 38.1684 30.448 35.6315 33.2096L26.7945 25.0913C26.228 25.7079 26.1976 26.3981 26.3392 26.8449L37.7786 23.2201ZM35.6158 33.2266C34.7706 34.1395 33.8782 34.7951 32.7883 35.3393L27.4274 24.6034C27.4302 24.602 27.3976 24.6181 27.3419 24.6516C27.2839 24.6864 27.2107 24.7341 27.1294 24.7946C26.9535 24.9256 26.8412 25.0407 26.8102 25.0742L35.6158 33.2266ZM32.8086 35.3292C30.3833 36.5517 27.7278 36.7704 25.1755 36.0849L28.2882 24.4956C28.2493 24.4851 28.111 24.4568 27.9056 24.4762C27.6967 24.4961 27.5217 24.5558 27.4071 24.6136L32.8086 35.3292ZM25.1984 36.091C24.6669 35.9505 22.6413 35.2269 21.0278 34.6426L25.1137 23.3596C26.0087 23.6838 26.8581 23.987 27.5021 24.2136C27.8254 24.3274 28.0872 24.4184 28.2728 24.4818C28.3669 24.5139 28.4285 24.5345 28.4627 24.5457C28.5551 24.576 28.4377 24.5351 28.2653 24.4895L25.1984 36.091ZM21.0341 34.6449C19.4127 34.0598 18.2444 33.6468 17.5671 33.3482C17.3076 33.2338 16.2461 32.7857 15.3065 31.8212C14.2204 30.7062 13.7283 29.1906 13.9386 29.7017L25.0352 25.1339C25.0485 25.1661 25.114 25.329 25.0775 25.2385C25.0704 25.221 25.0177 25.0888 24.9358 24.9198C24.847 24.7364 24.7163 24.4926 24.5325 24.2213C24.3459 23.9459 24.1348 23.6866 23.9021 23.4477C23.4478 22.9813 23.0175 22.7026 22.7862 22.5662C22.6661 22.4954 22.5703 22.446 22.5131 22.4176C22.4551 22.3888 22.4171 22.372 22.4083 22.3681C22.3971 22.3631 22.4365 22.3807 22.5646 22.4303C22.6873 22.4778 22.8545 22.5406 23.0868 22.626C23.5575 22.799 24.1938 23.0277 25.1074 23.3574L21.0341 34.6449ZM13.9435 29.7135C13.0811 27.631 13.3677 25.4009 14.4107 23.6775L24.6768 29.891C25.4787 28.566 25.7234 26.7954 25.0304 25.122L13.9435 29.7135ZM14.4047 23.6875C15.3038 22.1955 16.5999 21.4881 16.9127 21.3167C17.438 21.0288 18.2829 20.65 19.344 20.5059L20.9581 32.3969C21.8011 32.2825 22.3828 32.0028 22.6793 31.8403C22.8691 31.7363 23.123 31.5803 23.4057 31.3525C23.6233 31.1773 24.1898 30.6991 24.6828 29.881L14.4047 23.6875ZM19.5402 20.4826C19.9806 20.4375 20.6539 20.4456 20.7114 20.4457C21.0406 20.4459 21.4629 20.4485 21.9041 20.453L21.7804 32.4524C21.3681 32.4481 20.9848 32.4459 20.7018 32.4457C20.5583 32.4456 20.4535 32.446 20.3886 32.4466C20.3543 32.447 20.3483 32.4472 20.361 32.4469C20.3666 32.4468 20.3943 32.4461 20.4351 32.4443C20.456 32.4434 20.4912 32.4417 20.5358 32.4389C20.5739 32.4365 20.6564 32.431 20.7619 32.4202L19.5402 20.4826ZM21.9375 20.4534C22.3238 20.4596 22.6682 20.4606 22.9028 20.4585C22.9599 20.458 23.006 20.4574 23.0411 20.4567C23.0781 20.456 23.0938 20.4555 23.0926 20.4555C23.0915 20.4555 23.0798 20.456 23.0599 20.457C23.0425 20.4579 23.0007 20.4602 22.9433 20.4647C22.902 20.4679 22.7698 20.4785 22.5967 20.5031C22.5132 20.515 22.343 20.5409 22.1296 20.5891C22.0207 20.6137 21.8549 20.6543 21.656 20.7168C21.4787 20.7725 21.1403 20.8871 20.7403 21.0903L26.1745 31.7894C25.4823 32.1409 24.8796 32.2702 24.7743 32.294C24.556 32.3433 24.3795 32.3703 24.2885 32.3833C24.1004 32.4101 23.948 32.4227 23.8817 32.4279C23.7323 32.4396 23.6003 32.445 23.5263 32.4477C23.3607 32.4537 23.178 32.4566 23.0086 32.4581C22.6578 32.4612 22.2129 32.4593 21.747 32.4519L21.9375 20.4534ZM20.7403 21.0903C19.3634 21.7897 18.6261 22.8403 18.267 23.5347C17.8908 24.2622 17.5544 25.3176 17.6651 26.5986L29.6206 25.5654C29.743 26.9824 29.3701 28.1882 28.9263 29.0464C28.4997 29.8714 27.6639 31.0329 26.1745 31.7894L20.7403 21.0903ZM17.6714 26.6664C17.7233 27.1975 17.8365 27.5977 17.8818 27.7515C17.938 27.9418 17.9913 28.0852 18.0177 28.154C18.0693 28.2888 18.107 28.3688 18.0945 28.3413C18.0753 28.2992 18.0102 28.1619 17.8509 27.8409C17.5429 27.2202 16.9994 26.1461 16.0505 24.2779L26.7495 18.8437C27.6896 20.6945 28.2619 21.825 28.6004 22.5071C28.7643 22.8375 28.9051 23.1263 29.0123 23.3612C29.063 23.4723 29.1441 23.6537 29.2239 23.8622C29.2381 23.8992 29.5261 24.5962 29.6143 25.4976L17.6714 26.6664ZM16.0505 24.2779C15.069 22.3456 14.4951 21.2121 14.1657 20.5466C14.0078 20.2278 13.8667 19.9375 13.7575 19.6934C13.7046 19.575 13.6174 19.3754 13.532 19.1392C13.4642 18.9515 13.2753 18.417 13.1945 17.7131L25.1161 16.3437C25.0389 15.6715 24.8611 15.1809 24.8178 15.0611C24.7841 14.9676 24.7557 14.8977 24.7404 14.8608C24.7243 14.8221 24.7135 14.798 24.7115 14.7935C24.7089 14.7875 24.721 14.8147 24.7594 14.8946C24.7961 14.971 24.8478 15.0768 24.9199 15.2226C25.2157 15.8199 25.7568 16.8893 26.7495 18.8437L16.0505 24.2779ZM13.1801 17.5742C12.8178 13.6076 16.0093 9.99655 20.2638 10.2568L19.5311 22.2344C22.9014 22.4406 25.4105 19.5496 25.1304 16.4826L13.1801 17.5742Z", "fill", "#5A6F8F", "mask", "url(#path-3-inside-1_0_1)"], ["matTooltip", "Set Range", 1, "button", 3, "click"], ["cx", "9", "cy", "28", "r", "4", "fill", "#5A6F8F", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M11 10C11 9.44772 11.4477 9 12 9H16C16.5523 9 17 9.44772 17 10V11C17 11.5523 16.5523 12 16 12H12C11.4477 12 11 11.5523 11 11V10Z", "fill", "#5A6F8F"], ["d", "M19 10C19 9.44772 19.4477 9 20 9H24C24.5523 9 25 9.44772 25 10V11C25 11.5523 24.5523 12 24 12H20C19.4477 12 19 11.5523 19 11V10Z", "fill", "#5A6F8F"], ["d", "M11 15C11 14.4477 11.4477 14 12 14H16C16.5523 14 17 14.4477 17 15V16C17 16.5523 16.5523 17 16 17H12C11.4477 17 11 16.5523 11 16V15Z", "fill", "#5A6F8F"], ["d", "M19 15C19 14.4477 19.4477 14 20 14H24C24.5523 14 25 14.4477 25 15V16C25 16.5523 24.5523 17 24 17H20C19.4477 17 19 16.5523 19 16V15Z", "fill", "#5A6F8F"], ["d", "M11 20C11 19.4477 11.4477 19 12 19H16C16.5523 19 17 19.4477 17 20V21C17 21.5523 16.5523 22 16 22H12C11.4477 22 11 21.5523 11 21V20Z", "fill", "#5A6F8F"], ["d", "M19 20C19 19.4477 19.4477 19 20 19H24C24.5523 19 25 19.4477 25 20V21C25 21.5523 24.5523 22 24 22H20C19.4477 22 19 21.5523 19 21V20Z", "fill", "#5A6F8F"], ["d", "M13 4.7H24C26.9271 4.7 29.3 7.07289 29.3 10V26C29.3 28.9271 26.9271 31.3 24 31.3H13C10.0729 31.3 7.7 28.9271 7.7 26V10C7.7 7.07289 10.0729 4.7 13 4.7Z", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M20.5018 30.8577L23.4991 23.1722L28.9011 25.3166C29.0444 25.3735 29.1212 25.5297 29.0789 25.6779L28.4281 27.955C27.8746 29.8913 26.0515 31.1842 24.0411 31.0659L20.5018 30.8577Z", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["d", "M9.79102 27.2246H11.9062V28.7539H9.79102V31.1445H8.17969V28.7539H6.05859V27.2246H8.17969V24.9336H9.79102V27.2246Z", "fill", "#E9ECEE"], ["matTooltip", "Remove Range", 1, "button", 3, "click"], ["x", "30.4248", "y", "3.96606", "width", "2", "height", "39.4162", "transform", "rotate(44.6511 30.4248 3.96606)", "fill", "#5A6F8F"], ["matTooltip", "Toggle Value Object", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["d", "M13.5703 9.89258H10.957V17H9.19922V9.89258H6.62109V8.46875H13.5703V9.89258ZM16.3535 14.6035L17.5254 10.6602H19.3418L16.793 17.9844L16.6523 18.3184C16.2734 19.1465 15.6484 19.5605 14.7773 19.5605C14.5312 19.5605 14.2812 19.5234 14.0273 19.4492V18.166L14.2852 18.1719C14.6055 18.1719 14.8438 18.123 15 18.0254C15.1602 17.9277 15.2852 17.7656 15.375 17.5391L15.5742 17.0176L13.3535 10.6602H15.1758L16.3535 14.6035ZM25.7168 13.8887C25.7168 14.8652 25.4941 15.6484 25.0488 16.2383C24.6074 16.8242 24.0098 17.1172 23.2559 17.1172C22.6152 17.1172 22.0977 16.8945 21.7031 16.4492V19.4375H20.0098V10.6602H21.5801L21.6387 11.2812C22.0488 10.7891 22.584 10.543 23.2441 10.543C24.0254 10.543 24.6328 10.832 25.0664 11.4102C25.5 11.9883 25.7168 12.7852 25.7168 13.8008V13.8887ZM24.0234 13.7656C24.0234 13.1758 23.918 12.7207 23.707 12.4004C23.5 12.0801 23.1973 11.9199 22.7988 11.9199C22.2676 11.9199 21.9023 12.123 21.7031 12.5293V15.125C21.9102 15.543 22.2793 15.752 22.8105 15.752C23.6191 15.752 24.0234 15.0898 24.0234 13.7656ZM29.6895 17.1172C28.7598 17.1172 28.002 16.832 27.416 16.2617C26.834 15.6914 26.543 14.9316 26.543 13.9824V13.8184C26.543 13.1816 26.666 12.6133 26.9121 12.1133C27.1582 11.6094 27.5059 11.2227 27.9551 10.9531C28.4082 10.6797 28.9238 10.543 29.502 10.543C30.3691 10.543 31.0508 10.8164 31.5469 11.3633C32.0469 11.9102 32.2969 12.6855 32.2969 13.6895V14.3809H28.2598C28.3145 14.7949 28.4785 15.127 28.752 15.377C29.0293 15.627 29.3789 15.752 29.8008 15.752C30.4531 15.752 30.9629 15.5156 31.3301 15.043L32.1621 15.9746C31.9082 16.334 31.5645 16.6152 31.1309 16.8184C30.6973 17.0176 30.2168 17.1172 29.6895 17.1172ZM29.4961 11.9141C29.1602 11.9141 28.8867 12.0273 28.6758 12.2539C28.4688 12.4805 28.3359 12.8047 28.2773 13.2266H30.6328V13.0918C30.625 12.7168 30.5234 12.4277 30.3281 12.2246C30.1328 12.0176 29.8555 11.9141 29.4961 11.9141Z", "fill", "#5A6F8F"], ["x", "7.5", "y", "21.5", "width", "22", "height", "9", "rx", "4.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["cx", "25", "cy", "26", "r", "3", "fill", "#E9ECEE"], ["matTooltip", "Reset Value", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M26 18.1488V16.8512C26 16.4299 25.6599 16.0881 25.2349 16.0881H25.0274C24.5363 16.0881 24.1112 15.7717 23.9506 15.3089C23.8562 15.0293 23.743 14.7583 23.6108 14.4967C23.3935 14.0556 23.4688 13.5277 23.8183 13.1792L23.9695 13.0281C24.2623 12.7296 24.2623 12.247 23.9695 11.9486L23.0532 11.0315C22.751 10.7331 22.2694 10.7331 21.9672 11.0315L21.8067 11.1921C21.4667 11.5396 20.9377 11.6161 20.4938 11.4008C20.2388 11.2742 19.9743 11.1628 19.6909 11.0693C19.2282 10.9116 18.9167 10.4837 18.9167 9.99356V9.76405C18.9167 9.34188 18.5672 9 18.1516 9H16.8484C16.4328 9 16.0833 9.34188 16.0833 9.76405V10.0162C16.0833 10.5035 15.7718 10.9295 15.3091 11.0901C15.0446 11.1826 14.7801 11.2922 14.5251 11.4178C14.0906 11.6369 13.5616 11.5604 13.2122 11.2119L13.0328 11.0315C12.7306 10.7331 12.249 10.7331 11.9468 11.0315L11.0305 11.9486C10.7377 12.247 10.7377 12.7296 11.0305 13.0281L11.2195 13.2207C11.569 13.5673 11.6443 14.0943 11.4271 14.5344C11.3137 14.7847 11.2005 15.0425 11.1061 15.3079C10.955 15.7707 10.5301 16.0881 10.039 16.0881H9.76506C9.34006 16.0881 9 16.4299 9 16.8512V18.1488C9 18.5701 9.34006 18.9119 9.76506 18.9119H10.039C10.5301 18.9119 10.955 19.2293 11.1061 19.6921C11.2005 19.9575 11.3137 20.2153 11.4271 20.4656C11.6443 20.9057 11.569 21.4327 11.2195 21.7793L11.0305 21.9719C10.7377 22.2704 10.7377 22.753 11.0305 23.0514L11.9468 23.9694C12.249 24.2669 12.7306 24.2669 13.0328 23.9694L13.2122 23.7881C13.5616 23.4396 14.0906 23.3631 14.5251 23.5822C14.7801 23.7078 15.0446 23.8174 15.3091 23.9099C15.7718 24.0705 16.0833 24.4965 16.0833 24.9838V25.236C16.0833 25.6581 16.4328 26 16.8484 26H18.1516C18.5672 26 18.9167 25.6581 18.9167 25.236V25.0064C18.9167 24.5163 19.2282 24.0884 19.6909 23.9307C19.9743 23.8372 20.2388 23.7258 20.4938 23.5992C20.9377 23.3839 21.4667 23.4604 21.8067 23.8079L21.9672 23.9694C22.2694 24.2669 22.751 24.2669 23.0532 23.9694L23.9695 23.0514C24.2623 22.753 24.2623 22.2704 23.9695 21.9719L23.8183 21.8208C23.4688 21.4723 23.3935 20.9444 23.6108 20.5033C23.743 20.2417 23.8562 19.9707 23.9506 19.6911C24.1112 19.2283 24.5363 18.9119 25.0274 18.9119H25.2349C25.6599 18.9119 26 18.5701 26 18.1488ZM18.539 21.7793C15.3279 22.4886 12.5417 19.6987 13.25 16.4951C13.6089 14.8811 14.9124 13.5787 16.5274 13.2207C19.7291 12.5114 22.5245 15.3013 21.8067 18.5049C21.4478 20.118 20.154 21.4213 18.539 21.7793Z", "fill", "#5A6F8F"], ["d", "M3.77473 24.0514C3.77739 23.8459 3.98138 23.7038 4.17512 23.7726L9.68884 25.7311C9.9189 25.8128 9.96021 26.1205 9.75986 26.26L4.17037 30.1522C3.97002 30.2918 3.6958 30.1463 3.69896 29.9022L3.77473 24.0514Z", "fill", "#5A6F8F"], ["d", "M16.3911 30.2885V30.2885C13.0515 32.4751 8.55553 31.3298 6.66908 27.8118L6.50482 27.5055", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M31.083 13.3934C31.0385 13.5942 30.8099 13.6917 30.6342 13.5849L25.6347 10.5449C25.4261 10.418 25.4483 10.1084 25.6729 10.0126L31.9377 7.33987C32.1623 7.24407 32.4011 7.44232 32.3483 7.68069L31.083 13.3934Z", "fill", "#5A6F8F"], ["d", "M20.0006 4.71817V4.71817C23.7155 3.25727 27.8841 5.29396 29.0148 9.12232L29.1133 9.45568", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["matTooltip", "Add Waiting Process", 1, "button", 3, "click"], ["d", "M28 8.5C28 9.99976 26.6837 11.3713 24.5133 12.3736C22.3428 13.3757 19.3347 14 16 14C12.6653 14 9.65716 13.3757 7.48673 12.3736C5.31629 11.3713 4 9.99976 4 8.5C4 7.00024 5.31629 5.62871 7.48673 4.62636C9.65716 3.6243 12.6653 3 16 3C19.3347 3 22.3428 3.6243 24.5133 4.62636C26.6837 5.62871 28 7.00024 28 8.5Z", "fill", "white", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["cx", "28", "cy", "27", "r", "4.5", "stroke", "#5A6F8F"], ["x", "27", "y", "22", "width", "2", "height", "1", "fill", "#5A6F8F"], ["d", "M26 21C26 20.4477 26.4477 20 27 20H29C29.5523 20 30 20.4477 30 21V22H26V21Z", "fill", "#5A6F8F"], ["width", "2.52587", "height", "1.68265", "rx", "0.3", "transform", "matrix(0.678067 -0.735 0.727684 0.685913 23 23.5488)", "fill", "#5A6F8F"], ["width", "2.52587", "height", "1.68265", "rx", "0.3", "transform", "matrix(0.678067 0.735 -0.727684 0.685913 31.2874 21.6924)", "fill", "#5A6F8F"], ["cx", "28", "cy", "27", "r", "1", "fill", "#5A6F8F"], ["d", "M8.39634 13.1687L12 17.5", "stroke", "#5A6F8F"], ["x1", "12", "y1", "17.5", "x2", "8", "y2", "17.5", "stroke", "#5A6F8F"], ["d", "M8 17.5L13.1734 23.0088", "stroke", "#5A6F8F"], ["y1", "-0.5", "x2", "6.45967", "y2", "-0.5", "transform", "matrix(0.489933 -0.87176 0.860945 0.508698 15.2367 24.6038)", "stroke", "#5A6F8F"], ["d", "M18 19L18.5 22.5001", "stroke", "#5A6F8F"], ["d", "M18.2521 22.7488L23.7045 14.1052", "stroke", "#5A6F8F"], ["d", "M13.6646 19.571L14.6045 23.8051L10.4955 22.7535L13.6646 19.571Z", "fill", "white", "stroke", "#5A6F8F"], ["d", "M20.2611 15.6925L23.9732 13.4492L24.2893 17.6789L20.2611 15.6925Z", "fill", "white", "stroke", "#5A6F8F"], ["matTooltip", "Remove Waiting Process", 1, "button", 3, "click"], ["d", "M4 0H32C34.2091 0 36 1.79086 36 4V31C36 33.2091 34.2091 35 32 35H4C1.79086 35 0 33.2091 0 31V4C0 1.79086 1.79086 0 4 0Z", "fill", "#1A3763"], ["d", "M28 8.5C28 9.99976 26.6837 11.3713 24.5133 12.3736C22.3428 13.3757 19.3347 14 16 14C12.6653 14 9.65716 13.3757 7.48673 12.3736C5.31629 11.3713 4 9.99976 4 8.5C4 7.00024 5.31629 5.62871 7.48673 4.62636C9.65716 3.6243 12.6653 3 16 3C19.3347 3 22.3428 3.6243 24.5133 4.62636C26.6837 5.62871 28 7.00024 28 8.5Z", "stroke", "white", "stroke-width", "1.5"], ["cx", "28", "cy", "27", "r", "4.5", "stroke", "white"], ["x", "27", "y", "22", "width", "2", "height", "1", "fill", "white"], ["d", "M26 21C26 20.4477 26.4477 20 27 20H29C29.5523 20 30 20.4477 30 21V22H26V21Z", "fill", "white"], ["width", "2.52587", "height", "1.68265", "rx", "0.3", "transform", "matrix(0.678067 -0.735 0.727684 0.685913 23 23.5488)", "fill", "white"], ["width", "2.52587", "height", "1.68265", "rx", "0.3", "transform", "matrix(0.678067 0.735 -0.727684 0.685913 31.2874 21.6924)", "fill", "white"], ["cx", "28", "cy", "27", "r", "1", "fill", "white"], ["d", "M8.39634 13.1687L12 17.5", "stroke", "white"], ["x1", "12", "y1", "17.5", "x2", "8", "y2", "17.5", "stroke", "white"], ["d", "M8 17.5L13.1734 23.0088", "stroke", "white"], ["y1", "-0.5", "x2", "6.45967", "y2", "-0.5", "transform", "matrix(0.489933 -0.87176 0.860945 0.508698 15.2367 24.6038)", "stroke", "white"], ["d", "M18 19L18.5 22.5001", "stroke", "white"], ["d", "M18.2521 22.7488L23.7045 14.1052", "stroke", "white"], ["d", "M13.6646 19.571L14.6045 23.8051L10.4955 22.7535L13.6646 19.571Z", "fill", "#1A3763", "stroke", "white"], ["d", "M20.2611 15.6925L23.9732 13.4492L24.2893 17.6789L20.2611 15.6925Z", "fill", "#1A3763", "stroke", "white"], ["matTooltip", "Create Digital Twin", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["d", "M10.3223 6.47266C10.3223 7.65234 10.0781 8.55469 9.58984 9.17969C9.10156 9.80469 8.38672 10.1172 7.44531 10.1172C6.51562 10.1172 5.80469 9.81055 5.3125 9.19727C4.82031 8.58398 4.56836 7.70508 4.55664 6.56055V4.99023C4.55664 3.79883 4.80273 2.89453 5.29492 2.27734C5.79102 1.66016 6.50391 1.35156 7.43359 1.35156C8.36328 1.35156 9.07422 1.6582 9.56641 2.27148C10.0586 2.88086 10.3105 3.75781 10.3223 4.90234V6.47266ZM8.62891 4.75C8.62891 4.04297 8.53125 3.5293 8.33594 3.20898C8.14453 2.88477 7.84375 2.72266 7.43359 2.72266C7.03516 2.72266 6.74023 2.87695 6.54883 3.18555C6.36133 3.49023 6.26172 3.96875 6.25 4.62109V6.69531C6.25 7.39062 6.34375 7.9082 6.53125 8.24805C6.72266 8.58398 7.02734 8.75195 7.44531 8.75195C7.85938 8.75195 8.1582 8.58984 8.3418 8.26562C8.52539 7.94141 8.62109 7.44531 8.62891 6.77734V4.75ZM18.5723 10H16.8789V3.47266L14.8574 4.09961V2.72266L18.3906 1.45703H18.5723V10ZM28.4512 10H26.7578V3.47266L24.7363 4.09961V2.72266L28.2695 1.45703H28.4512V10ZM10.3223 17.4727C10.3223 18.6523 10.0781 19.5547 9.58984 20.1797C9.10156 20.8047 8.38672 21.1172 7.44531 21.1172C6.51562 21.1172 5.80469 20.8105 5.3125 20.1973C4.82031 19.584 4.56836 18.7051 4.55664 17.5605V15.9902C4.55664 14.7988 4.80273 13.8945 5.29492 13.2773C5.79102 12.6602 6.50391 12.3516 7.43359 12.3516C8.36328 12.3516 9.07422 12.6582 9.56641 13.2715C10.0586 13.8809 10.3105 14.7578 10.3223 15.9023V17.4727ZM8.62891 15.75C8.62891 15.043 8.53125 14.5293 8.33594 14.209C8.14453 13.8848 7.84375 13.7227 7.43359 13.7227C7.03516 13.7227 6.74023 13.877 6.54883 14.1855C6.36133 14.4902 6.26172 14.9688 6.25 15.6211V17.6953C6.25 18.3906 6.34375 18.9082 6.53125 19.248C6.72266 19.584 7.02734 19.752 7.44531 19.752C7.85938 19.752 8.1582 19.5898 8.3418 19.2656C8.52539 18.9414 8.62109 18.4453 8.62891 17.7773V15.75ZM20.2012 17.4727C20.2012 18.6523 19.957 19.5547 19.4688 20.1797C18.9805 20.8047 18.2656 21.1172 17.3242 21.1172C16.3945 21.1172 15.6836 20.8105 15.1914 20.1973C14.6992 19.584 14.4473 18.7051 14.4355 17.5605V15.9902C14.4355 14.7988 14.6816 13.8945 15.1738 13.2773C15.6699 12.6602 16.3828 12.3516 17.3125 12.3516C18.2422 12.3516 18.9531 12.6582 19.4453 13.2715C19.9375 13.8809 20.1895 14.7578 20.2012 15.9023V17.4727ZM18.5078 15.75C18.5078 15.043 18.4102 14.5293 18.2148 14.209C18.0234 13.8848 17.7227 13.7227 17.3125 13.7227C16.9141 13.7227 16.6191 13.877 16.4277 14.1855C16.2402 14.4902 16.1406 14.9688 16.1289 15.6211V17.6953C16.1289 18.3906 16.2227 18.9082 16.4102 19.248C16.6016 19.584 16.9062 19.752 17.3242 19.752C17.7383 19.752 18.0371 19.5898 18.2207 19.2656C18.4043 18.9414 18.5 18.4453 18.5078 17.7773V15.75ZM28.4512 21H26.7578V14.4727L24.7363 15.0996V13.7227L28.2695 12.457H28.4512V21ZM8.69336 32H7V25.4727L4.97852 26.0996V24.7227L8.51172 23.457H8.69336V32ZM18.5723 32H16.8789V25.4727L14.8574 26.0996V24.7227L18.3906 23.457H18.5723V32ZM30.0801 28.4727C30.0801 29.6523 29.8359 30.5547 29.3477 31.1797C28.8594 31.8047 28.1445 32.1172 27.2031 32.1172C26.2734 32.1172 25.5625 31.8105 25.0703 31.1973C24.5781 30.584 24.3262 29.7051 24.3145 28.5605V26.9902C24.3145 25.7988 24.5605 24.8945 25.0527 24.2773C25.5488 23.6602 26.2617 23.3516 27.1914 23.3516C28.1211 23.3516 28.832 23.6582 29.3242 24.2715C29.8164 24.8809 30.0684 25.7578 30.0801 26.9023V28.4727ZM28.3867 26.75C28.3867 26.043 28.2891 25.5293 28.0938 25.209C27.9023 24.8848 27.6016 24.7227 27.1914 24.7227C26.793 24.7227 26.498 24.877 26.3066 25.1855C26.1191 25.4902 26.0195 25.9688 26.0078 26.6211V28.6953C26.0078 29.3906 26.1016 29.9082 26.2891 30.248C26.4805 30.584 26.7852 30.752 27.2031 30.752C27.6172 30.752 27.916 30.5898 28.0996 30.2656C28.2832 29.9414 28.3789 29.4453 28.3867 28.7773V26.75Z", "fill", "#5A6F8F"], ["matTooltip", "Add attributes/instances/values from CSV", 1, "button", 3, "click"], ["d", "M17.6221 9.70041C17.8169 9.38073 18.2811 9.38073 18.4759 9.70041L21.0921 13.9924C21.2952 14.3256 21.0554 14.7526 20.6652 14.7526L15.4328 14.7526C15.0426 14.7526 14.8028 14.3256 15.0059 13.9924L17.6221 9.70041Z", "fill", "#9BAAC0"], ["x", "17", "y", "12", "width", "2.2", "height", "10", "rx", "0.5", "fill", "#9BAAC0"], ["x", "11", "y", "23", "width", "14", "height", "6", "rx", "0.5", "fill", "#9BAAC0"], ["d", "M29 10.8062C29 10.7473 29 10.6819 29 10.6231C29 10.6231 29 10.597 29 10.584C29 10.5186 28.9405 10.4466 28.9405 10.3812C28.9405 10.3681 28.9405 10.355 28.9405 10.3354C28.8814 10.3223 28.8818 10.2373 28.8227 10.1915V10.1392C28.7636 10.0803 28.704 10.028 28.6448 9.97569L21.9622 3.2795C21.903 3.23373 21.8438 3.19454 21.8438 3.16184L21.7849 3.13566C21.7257 3.1095 21.6665 3.08998 21.6665 3.07036L21.6076 3.05072L21.4892 3.0049H21.4303C21.3711 2.99837 21.3115 2.99837 21.2524 3.0049H8.06439C7.7687 3.0049 7.47312 3.12262 7.2957 3.33841C7.11828 3.55421 7 3.84192 7 4.14273V30.8294C7 31.1433 7.11828 31.4376 7.2957 31.6599C7.47312 31.8757 7.7687 32 8.06439 32H27.9356C28.2313 32 28.5269 31.8757 28.7043 31.6599C28.8817 31.4376 29 31.1433 29 30.8294V10.8389C29 10.8389 29 10.8193 29 10.8062ZM22.3174 6.75188L25.2148 9.67491H22.3174V6.75188ZM9.06988 29.672V5.31328H20.188V10.8389C20.188 11.1463 20.3066 11.4405 20.5432 11.6629C20.7206 11.8787 20.9567 12.0029 21.2524 12.0029H26.8706V29.672H9.06988Z", "fill", "#9BAAC0"], ["d", "M14.0156 27.1992C14.1536 27.1992 14.276 27.1732 14.3828 27.1211C14.4896 27.0664 14.5729 26.9909 14.6328 26.8945C14.6953 26.7956 14.7279 26.6797 14.7305 26.5469H15.7891C15.7865 26.8438 15.707 27.1081 15.5508 27.3398C15.3945 27.569 15.1849 27.75 14.9219 27.8828C14.6589 28.013 14.3646 28.0781 14.0391 28.0781C13.7109 28.0781 13.4245 28.0234 13.1797 27.9141C12.9375 27.8047 12.7357 27.6536 12.5742 27.4609C12.4128 27.2656 12.2917 27.0391 12.2109 26.7812C12.1302 26.5208 12.0898 26.2422 12.0898 25.9453V25.832C12.0898 25.5326 12.1302 25.2539 12.2109 24.9961C12.2917 24.7357 12.4128 24.5091 12.5742 24.3164C12.7357 24.1211 12.9375 23.9688 13.1797 23.8594C13.4219 23.75 13.7057 23.6953 14.0312 23.6953C14.3776 23.6953 14.681 23.7617 14.9414 23.8945C15.2044 24.0273 15.4102 24.2174 15.5586 24.4648C15.7096 24.7096 15.7865 25 15.7891 25.3359H14.7305C14.7279 25.1953 14.6979 25.0677 14.6406 24.9531C14.5859 24.8385 14.5052 24.7474 14.3984 24.6797C14.2943 24.6094 14.1654 24.5742 14.0117 24.5742C13.8477 24.5742 13.7135 24.6094 13.6094 24.6797C13.5052 24.7474 13.4245 24.8411 13.3672 24.9609C13.3099 25.0781 13.2695 25.2122 13.2461 25.3633C13.2253 25.5117 13.2148 25.668 13.2148 25.832V25.9453C13.2148 26.1094 13.2253 26.2669 13.2461 26.418C13.2669 26.569 13.306 26.7031 13.3633 26.8203C13.4232 26.9375 13.5052 27.0299 13.6094 27.0977C13.7135 27.1654 13.849 27.1992 14.0156 27.1992ZM18.7266 26.832C18.7266 26.7513 18.7031 26.6784 18.6562 26.6133C18.6094 26.5482 18.5221 26.4883 18.3945 26.4336C18.2695 26.3763 18.0885 26.3242 17.8516 26.2773C17.638 26.2305 17.4388 26.1719 17.2539 26.1016C17.0716 26.0286 16.9128 25.9414 16.7773 25.8398C16.6445 25.7383 16.5404 25.6185 16.4648 25.4805C16.3893 25.3398 16.3516 25.1797 16.3516 25C16.3516 24.8229 16.3893 24.6562 16.4648 24.5C16.543 24.3438 16.6536 24.2057 16.7969 24.0859C16.9427 23.9635 17.1198 23.8685 17.3281 23.8008C17.5391 23.7305 17.776 23.6953 18.0391 23.6953C18.4062 23.6953 18.7214 23.7539 18.9844 23.8711C19.25 23.9883 19.4531 24.1497 19.5938 24.3555C19.737 24.5586 19.8086 24.7904 19.8086 25.0508H18.6836C18.6836 24.9414 18.6602 24.8438 18.6133 24.7578C18.569 24.6693 18.4987 24.6003 18.4023 24.5508C18.3086 24.4987 18.1862 24.4727 18.0352 24.4727C17.9102 24.4727 17.8021 24.4948 17.7109 24.5391C17.6198 24.5807 17.5495 24.638 17.5 24.7109C17.4531 24.7812 17.4297 24.8594 17.4297 24.9453C17.4297 25.0104 17.4427 25.069 17.4688 25.1211C17.4974 25.1706 17.543 25.2161 17.6055 25.2578C17.668 25.2995 17.7487 25.3385 17.8477 25.375C17.9492 25.4089 18.0742 25.4401 18.2227 25.4688C18.5273 25.5312 18.7995 25.6133 19.0391 25.7148C19.2786 25.8138 19.4688 25.9492 19.6094 26.1211C19.75 26.2904 19.8203 26.513 19.8203 26.7891C19.8203 26.9766 19.7786 27.1484 19.6953 27.3047C19.612 27.4609 19.4922 27.5977 19.3359 27.7148C19.1797 27.8294 18.9922 27.9193 18.7734 27.9844C18.5573 28.0469 18.3138 28.0781 18.043 28.0781C17.6497 28.0781 17.3164 28.0078 17.043 27.8672C16.7721 27.7266 16.5664 27.5482 16.4258 27.332C16.2878 27.1133 16.2188 26.8893 16.2188 26.6602H17.2852C17.2904 26.8138 17.3294 26.9375 17.4023 27.0312C17.4779 27.125 17.5729 27.1927 17.6875 27.2344C17.8047 27.276 17.931 27.2969 18.0664 27.2969C18.2122 27.2969 18.3333 27.2773 18.4297 27.2383C18.526 27.1966 18.599 27.1419 18.6484 27.0742C18.7005 27.0039 18.7266 26.9232 18.7266 26.832ZM21.9883 27.1797L22.9258 23.7734H24.1016L22.6758 28H21.9648L21.9883 27.1797ZM21.3438 23.7734L22.2852 27.1836L22.3047 28H21.5898L20.1641 23.7734H21.3438Z", "fill", "#E9ECEE"], ["matTooltip", "Unlink Stereotype", 1, "button", 3, "click"], ["x", "29.4761", "y", "3.13159", "width", "2.5", "height", "37.6732", "transform", "rotate(44.6511 29.4761 3.13159)", "fill", "#5A6F8F"], ["d", "M19.6187 19.5752C19.6187 19.2155 19.4917 18.9404 19.2378 18.75C18.9839 18.5553 18.5269 18.3522 17.8667 18.1406C17.2065 17.9248 16.6839 17.7132 16.2988 17.5059C15.2493 16.9388 14.7246 16.175 14.7246 15.2144C14.7246 14.715 14.8643 14.2707 15.1436 13.8813C15.4271 13.4878 15.8312 13.181 16.356 12.9609C16.8849 12.7409 17.4774 12.6309 18.1333 12.6309C18.7935 12.6309 19.3817 12.7515 19.8979 12.9927C20.4142 13.2297 20.8141 13.5661 21.0977 14.002C21.3854 14.4378 21.5293 14.9329 21.5293 15.4873H19.625C19.625 15.0641 19.4917 14.7362 19.2251 14.5034C18.9585 14.2664 18.584 14.1479 18.1016 14.1479C17.6361 14.1479 17.2743 14.2474 17.0161 14.4463C16.758 14.641 16.6289 14.8991 16.6289 15.2207C16.6289 15.5212 16.7791 15.7729 17.0796 15.9761C17.3843 16.1792 17.8307 16.3696 18.4189 16.5474C19.5023 16.8732 20.2915 17.2773 20.7866 17.7598C21.2817 18.2422 21.5293 18.8431 21.5293 19.5625C21.5293 20.3623 21.2267 20.9907 20.6216 21.4478C20.0164 21.9006 19.2018 22.127 18.1777 22.127C17.4668 22.127 16.8193 21.9979 16.2354 21.7397C15.6514 21.4774 15.2049 21.1198 14.896 20.667C14.5913 20.2142 14.439 19.6895 14.439 19.0928H16.3496C16.3496 20.1126 16.959 20.6226 18.1777 20.6226C18.6305 20.6226 18.9839 20.5316 19.2378 20.3496C19.4917 20.1634 19.6187 19.9053 19.6187 19.5752Z", "fill", "#5A6F8F"], ["d", "M8 10L2 17.5L8 25", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M13 10L7 17.5L13 25", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M23 25L29 17.5L23 10", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M28 25L34 17.5L28 10", "stroke", "#5A6F8F", "stroke-width", "2"], ["matTooltip", "Remove Stereotype", 1, "button", 3, "click"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.1559 21.0669H12.8781C12.4027 21.0669 12.0272 21.4719 12.0638 21.9444L12.9415 32.2998C12.9781 32.6958 13.308 33 13.7104 33H22.3326C22.7349 33 23.064 32.6958 23.1005 32.2998L23.9783 21.9444C24.0149 21.4719 23.6405 21.0669 23.1559 21.0669Z", "fill", "#1A3763"], ["opacity", "0.7", "d", "M21.3913 22.1523L20.9163 29.257", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "d", "M14.6523 22.1523L15.1372 29.257", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "d", "M18.0266 22.1523V29.257", "stroke", "#1A3763", "stroke-linecap", "round", "stroke-linejoin", "round"], ["opacity", "0.7", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M12.6914 20.171C12.2191 20.171 11.8937 19.7386 12.0321 19.2886L12.3582 18.0633C12.4315 17.8149 12.6185 17.6519 12.8791 17.6011C13.1478 17.5495 15.1596 17.3696 15.6482 17.3398C15.8681 17.3285 16.0061 17.1446 16.0387 17.0365C16.0794 16.9284 16.3074 16.4267 16.4458 16.2452C16.511 16.1629 16.8045 16 17.9934 16C19.1905 16 19.483 16.1629 19.5482 16.2452C19.6948 16.4267 19.9228 16.9284 19.9553 17.0365C19.9961 17.1446 20.1347 17.3285 20.3546 17.3398C20.8432 17.3696 22.8551 17.5495 23.1157 17.6011C23.3763 17.6519 23.5713 17.8149 23.6446 18.0633L23.9706 19.2886C24.1009 19.7386 23.7829 20.171 23.3106 20.171H12.6914Z", "fill", "#1A3763"], ["d", "M19.6187 10.5752C19.6187 10.2155 19.4917 9.94043 19.2378 9.75C18.9839 9.55534 18.5269 9.35221 17.8667 9.14062C17.2065 8.9248 16.6839 8.71322 16.2988 8.50586C15.2493 7.9388 14.7246 7.17497 14.7246 6.21436C14.7246 5.71501 14.8643 5.27067 15.1436 4.88135C15.4271 4.48779 15.8312 4.18099 16.356 3.96094C16.8849 3.74089 17.4774 3.63086 18.1333 3.63086C18.7935 3.63086 19.3817 3.75146 19.8979 3.99268C20.4142 4.22965 20.8141 4.56608 21.0977 5.00195C21.3854 5.43783 21.5293 5.93294 21.5293 6.4873H19.625C19.625 6.06413 19.4917 5.73617 19.2251 5.50342C18.9585 5.26644 18.584 5.14795 18.1016 5.14795C17.6361 5.14795 17.2743 5.2474 17.0161 5.44629C16.758 5.64095 16.6289 5.89909 16.6289 6.2207C16.6289 6.52116 16.7791 6.77295 17.0796 6.97607C17.3843 7.1792 17.8307 7.36963 18.4189 7.54736C19.5023 7.87321 20.2915 8.27734 20.7866 8.75977C21.2817 9.24219 21.5293 9.8431 21.5293 10.5625C21.5293 11.3623 21.2267 11.9907 20.6216 12.4478C20.0164 12.9006 19.2018 13.127 18.1777 13.127C17.4668 13.127 16.8193 12.9979 16.2354 12.7397C15.6514 12.4774 15.2049 12.1198 14.896 11.667C14.5913 11.2142 14.439 10.6895 14.439 10.0928H16.3496C16.3496 11.1126 16.959 11.6226 18.1777 11.6226C18.6305 11.6226 18.9839 11.5316 19.2378 11.3496C19.4917 11.1634 19.6187 10.9053 19.6187 10.5752Z", "fill", "#5A6F8F"], ["d", "M27.291 5.22461H29.4062V6.75391H27.291V9.14453H25.6797V6.75391H23.5586V5.22461H25.6797V2.93359H27.291V5.22461Z", "fill", "#5A6F8F"], ["matTooltip", "Simulate Element", 1, "button", 3, "click"], ["d", "M23.2276 28.6816L20.8323 21.6366L18.7023 14.9861L28.3892 7.10062C28.3882 7.10138 28.3898 7.10037 28.3939 7.09767C28.4125 7.08568 28.4825 7.04033 28.6123 6.97L31.4596 19.3592L23.2276 28.6816Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M6.04337 14.5967L16.2562 15.9124L20.9859 29.6716L11.1348 27.6679L6.04337 14.5967Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M16.7944 5.5245L25.5861 6.23826L16.2477 13.4655L6.36594 12.3241L16.7944 5.5245Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["d", "M16.7003 9.65199C15.9826 9.88627 15.3006 9.76925 15.2004 9.4623C15.0897 9.12325 15.5818 8.65848 16.2996 8.4242C17.0173 8.18992 17.6888 8.27485 17.7995 8.6139C17.9102 8.95294 17.4181 9.41771 16.7003 9.65199Z", "fill", "#5A6F8F"], ["d", "M16.2266 21.5C16.2266 22.0523 15.7788 22.5 15.2266 22.5C14.6743 22.5 14.2266 22.0523 14.2266 21.5C14.2266 20.9477 14.6743 20.5 15.2266 20.5C15.7788 20.5 16.2266 20.9477 16.2266 21.5Z", "fill", "#5A6F8F"], ["d", "M14.2266 24.4999C14.2266 25.0522 13.7788 25.4999 13.2266 25.4999C12.6743 25.4999 12.2266 25.0522 12.2266 24.4999C12.2266 23.9476 12.6743 23.4999 13.2266 23.4999C13.7788 23.4999 14.2266 23.9476 14.2266 24.4999Z", "fill", "#5A6F8F"], ["d", "M26 21C26 21.5523 25.5523 22 25 22C24.4477 22 24 21.5523 24 21C24 20.4477 24.4477 20 25 20C25.5523 20 26 20.4477 26 21Z", "fill", "#5A6F8F"], ["d", "M27.1338 13.5C27.1338 14.0523 26.6861 14.5 26.1338 14.5C25.5815 14.5 25.1338 14.0523 25.1338 13.5C25.1338 12.9477 25.5815 12.5 26.1338 12.5C26.6861 12.5 27.1338 12.9477 27.1338 13.5Z", "fill", "#5A6F8F"], ["d", "M29 18C29 18.5523 28.5523 19 28 19C27.4477 19 27 18.5523 27 18C27 17.4477 27.4477 17 28 17C28.5523 17 29 17.4477 29 18Z", "fill", "#5A6F8F"], ["d", "M24 16C24 16.5523 23.5523 17 23 17C22.4477 17 22 16.5523 22 16C22 15.4477 22.4477 15 23 15C23.5523 15 24 15.4477 24 16Z", "fill", "#5A6F8F"], ["d", "M12 21C12 21.5523 11.5523 22 11 22C10.4477 22 10 21.5523 10 21C10 20.4477 10.4477 20 11 20C11.5523 20 12 20.4477 12 21Z", "fill", "#5A6F8F"], ["matTooltip", "Bring Links Between Selected Entities", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M10.7273 21.75C10.7273 20.5073 11.8872 19.5 13.3182 19.5H14.1818V18H13.3182C10.9333 18 9 19.679 9 21.75V26.25C9 28.3211 10.9333 30 13.3182 30H23.6818C26.0668 30 28 28.3211 28 26.25V21.75C28 19.679 26.0668 18 23.6818 18H22.8182V19.5H23.6818C25.1128 19.5 26.2727 20.5073 26.2727 21.75V26.25C26.2727 27.4927 25.1128 28.5 23.6818 28.5H13.3182C11.8872 28.5 10.7273 27.4927 10.7273 26.25V21.75Z", "fill", "#5A6F8F"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M26.2727 13.25C26.2727 14.4927 25.1128 15.5 23.6818 15.5H22.8182V17H23.6818C26.0667 17 28 15.321 28 13.25V8.75C28 6.67888 26.0667 5 23.6818 5L13.3182 5C10.9332 5 9 6.67888 9 8.75V13.25C9 15.321 10.9332 17 13.3182 17H14.1818V15.5H13.3182C11.8872 15.5 10.7273 14.4927 10.7273 13.25V8.75C10.7273 7.50732 11.8872 6.5 13.3182 6.5L23.6818 6.5C25.1128 6.5 26.2727 7.50732 26.2727 8.75V13.25Z", "fill", "#5A6F8F"], ["x", "18", "y", "11", "width", "1", "height", "10", "fill", "#5A6F8F"], ["d", "M18.5 10L21.0981 13.75H15.9019L18.5 10Z", "fill", "#5A6F8F"], ["d", "M18.5 24L15.9019 20.25H21.0981L18.5 24Z", "fill", "#5A6F8F"], [1, "button", 3, "mouseenter", "mouseleave", "matTooltip"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click", 4, "ngIf"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.2548 8H8V10H14.2548C14.9006 10 15.5259 10.2277 16.0205 10.6432C16.6415 11.1648 17 11.9343 17 12.7452V19.0858L14.7072 16.7928L13.2928 18.2072L17 21.9143V22H17.0857L17.2928 22.2072L18 22.9142L18.7072 22.2072L18.9143 22H19V21.9143L22.7072 18.2072L21.2928 16.7928L19 19.0858V12.7452C19 11.9343 19.3585 11.1648 19.9795 10.6432C20.4741 10.2277 21.0994 10 21.7452 10H28V8H21.7452C20.6288 8 19.548 8.39368 18.6931 9.11176C18.4351 9.32855 18.2032 9.57001 18 9.8313C17.7968 9.57001 17.5649 9.32855 17.3069 9.11176C16.452 8.39368 15.3712 8 14.2548 8ZM12 14C10.3431 14 9 15.3431 9 17V23C9 24.6569 10.3431 26 12 26H24C25.6569 26 27 24.6569 27 23V17C27 15.3431 25.6569 14 24 14H23V12H24C26.7615 12 29 14.2386 29 17V23C29 25.7615 26.7615 28 24 28H12C9.23853 28 7 25.7615 7 23V17C7 14.2386 9.23853 12 12 12H13V14H12Z", "fill", "#5A6F8F"], ["d", "M17.5 33L13.6029 30H21.3971L17.5 33Z", "fill", "#5A6F8F"], ["d", "M18 30L21.8971 33H14.1029L18 30Z", "fill", "#5A6F8F"], [1, "extensionsDiv", 2, "position", "absolute", "right", "0px"], [2, "margin-left", "4px", "margin-right", "4px", "display", "flex", "flex-direction", "column", "align-items", "center"], [2, "border-radius", "5px", "display", "flex", "border", "1px solid #bbc4d0", "flex-direction", "column", "align-items", "flex-start", "padding", "5px"], [1, "bringCheckbox", 3, "ngModelChange", "ngModel"], ["id", "bringButton", 2, "width", "70px", "height", "35px", "margin", "5px", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M18.5 7C17.3954 7 16.5 7.89545 16.5 9V18.5858L15.5 17.5858C15.1249 17.2107 14.6162 17 14.0858 17H12.5V19H14.0858L16.7928 21.7072L18.5 23.4142V21V9H25V7H18.5ZM9 16C9 14.3431 10.3431 13 12 13H13V11H12C9.23853 11 7 13.2386 7 16V22C7 24.7615 9.23853 27 12 27H24C26.7615 27 29 24.7615 29 22V16C29 13.2386 26.7615 11 24 11H23V13H24C25.6569 13 27 14.3431 27 16V22C27 23.6569 25.6569 25 24 25H12C10.3431 25 9 23.6569 9 22V16Z", "fill", "#5A6F8F", 1, "pathRect"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M18.5 7C17.3954 7 16.5 7.89545 16.5 9V18.5858L15.5 17.5858C15.1249 17.2107 14.6162 17 14.0858 17H12.5V19H14.0858L16.7928 21.7072L18.5 23.4142V21V9H25V7H18.5ZM9 16C9 14.3431 10.3431 13 12 13H13V11H12C9.23853 11 7 13.2386 7 16V22C7 24.7615 9.23853 27 12 27H24C26.7615 27 29 24.7615 29 22V16C29 13.2386 26.7615 11 24 11H23V13H24C25.6569 13 27 14.3431 27 16V22C27 23.6569 25.6569 25 24 25H12C10.3431 25 9 23.6569 9 22V16Z", "fill", "#5A6F8F"], ["x", "31.4763", "y", "3", "width", "2.5", "height", "37.6732", "transform", "rotate(44.6511 31.4763 3)", "fill", "#5A6F8F"], ["width", "37", "height", "35", "viewBox", "0 0 37 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M5 0H33C35.2091 0 37 1.79086 37 4V31C37 33.2091 35.2091 35 33 35H5C2.79086 35 1 33.2091 1 31V4C1 1.79086 2.79086 0 5 0Z", "fill", "#497284", "fill-opacity", "0.09"], ["d", "M33.2436 15.2335C33.1992 15.4343 32.9705 15.5318 32.7949 15.425L27.7954 12.3849C27.5868 12.2581 27.6089 11.9485 27.8335 11.8527L34.0984 9.17996C34.3229 9.08416 34.5618 9.28241 34.509 9.52077L33.2436 15.2335Z", "fill", "#475E81"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M19.8864 10C19.0364 10 18.3409 10.716 18.3409 11.6V19.2688L17.5682 18.4688C17.2745 18.1688 16.8881 18 16.4785 18H15.25V19.6H16.4785L18.565 21.7656L19.8864 23.1312V21.2V11.6H24.9091V10H19.8864ZM12.5455 17.2C12.5455 15.8744 13.5809 14.8 14.8636 14.8H15.6364V13.2H14.8636C12.7309 13.2 11 14.9912 11 17.2V22C11 24.2088 12.7309 26 14.8636 26H24.1364C26.2691 26 28 24.2088 28 22V17.2C28 14.9912 26.2691 13.2 24.1364 13.2H23.3636V14.8H24.1364C25.4191 14.8 26.4545 15.8744 26.4545 17.2V22C26.4545 23.3256 25.4191 24.4 24.1364 24.4H14.8636C13.5809 24.4 12.5455 23.3256 12.5455 22V17.2Z", "fill", "#475E81"], ["d", "M3.77473 22.0514C3.77739 21.8459 3.98138 21.7038 4.17512 21.7726L9.68884 23.7311C9.9189 23.8128 9.96021 24.1205 9.75986 24.26L4.17037 28.1522C3.97002 28.2918 3.6958 28.1463 3.69896 27.9022L3.77473 22.0514Z", "fill", "#475E81"], ["d", "M19.5 30L17.7149 30.451C13.2857 31.57 8.6634 29.5303 6.50451 25.5043V25.5043", "stroke", "#475E81", "stroke-width", "1.5"], ["d", "M19 4.00274L21.1379 4.00274C25.7476 4.00274 29.8075 7.03692 31.1133 11.4579V11.4579", "stroke", "#475E81", "stroke-width", "1.5"], ["cx", "25", "cy", "25", "r", "4.5", "stroke", "#5A6F8F"], ["x", "24", "y", "20", "width", "2", "height", "1", "fill", "#5A6F8F"], ["d", "M23 19C23 18.4477 23.4477 18 24 18H26C26.5523 18 27 18.4477 27 19V20H23V19Z", "fill", "#5A6F8F"], ["width", "2.52587", "height", "1.68265", "rx", "0.3", "transform", "matrix(0.678067 -0.735 0.727684 0.685913 20 21.5488)", "fill", "#5A6F8F"], ["width", "2.52587", "height", "1.68265", "rx", "0.3", "transform", "matrix(0.678067 0.735 -0.727684 0.685913 28.2874 19.6924)", "fill", "#5A6F8F"], ["cx", "25", "cy", "25", "r", "1", "fill", "#5A6F8F"], ["x1", "5.5", "y1", "17", "x2", "30.5", "y2", "17", "stroke", "#5A6F8F"], ["x1", "17.5", "y1", "30", "x2", "17.5", "y2", "5", "stroke", "#5A6F8F"], ["cx", "10.5", "cy", "9.5", "r", "5.5", "fill", "#5A6F8F"], ["d", "M7 12H14V14C14 14.5523 13.5523 15 13 15H8C7.44772 15 7 14.5523 7 14V12Z", "fill", "#5A6F8F"], ["d", "M8.67871 9.57422L8.29785 9.98438V11H7.56543V7.44531H8.29785V9.05664L8.62012 8.61475L9.52588 7.44531H10.4268L9.16455 9.0249L10.4634 11H9.5918L8.67871 9.57422ZM13.4736 10.5508C13.3418 10.7087 13.1554 10.8315 12.9146 10.9194C12.6737 11.0057 12.4067 11.0488 12.1138 11.0488C11.8062 11.0488 11.536 10.9821 11.3032 10.8486C11.0721 10.7135 10.8931 10.5182 10.7661 10.2627C10.6408 10.0072 10.5765 9.70687 10.5732 9.36182V9.12012C10.5732 8.7653 10.6326 8.4585 10.7515 8.19971C10.8719 7.93929 11.0444 7.74072 11.269 7.604C11.4953 7.46566 11.7598 7.39648 12.0625 7.39648C12.484 7.39648 12.8136 7.4974 13.0513 7.69922C13.2889 7.89941 13.4297 8.19157 13.4736 8.57568H12.7607C12.7282 8.37223 12.6558 8.22331 12.5435 8.12891C12.4328 8.03451 12.2798 7.9873 12.0845 7.9873C11.8354 7.9873 11.6458 8.08089 11.5156 8.26807C11.3854 8.45524 11.3195 8.73356 11.3179 9.10303V9.33008C11.3179 9.7028 11.3887 9.98438 11.5303 10.1748C11.6719 10.3652 11.8794 10.4604 12.1528 10.4604C12.4279 10.4604 12.624 10.4019 12.7412 10.2847V9.67188H12.0747V9.13232H13.4736V10.5508Z", "fill", "white"], ["d", "M26.085 11.9429C26.085 11.6493 26.0026 11.4165 25.8379 11.2446C25.6768 11.0692 25.401 10.908 25.0107 10.7612C24.6204 10.6144 24.2839 10.4694 24.001 10.3262C23.7181 10.1794 23.4746 10.0129 23.2705 9.82666C23.07 9.63688 22.9124 9.41488 22.7979 9.16064C22.6868 8.90641 22.6313 8.60384 22.6313 8.25293C22.6313 7.64779 22.8247 7.15186 23.2114 6.76514C23.5981 6.37842 24.112 6.15283 24.7529 6.08838V4.93896H25.6123V6.10449C26.2461 6.19401 26.742 6.45898 27.1001 6.89941C27.4582 7.33626 27.6372 7.90381 27.6372 8.60205H26.085C26.085 8.17236 25.9954 7.85189 25.8164 7.64062C25.641 7.42578 25.4046 7.31836 25.1074 7.31836C24.8138 7.31836 24.5864 7.40251 24.4253 7.5708C24.2642 7.73551 24.1836 7.96468 24.1836 8.2583C24.1836 8.53044 24.2624 8.74886 24.4199 8.91357C24.5775 9.07829 24.8693 9.24658 25.2954 9.41846C25.7251 9.59033 26.0778 9.75326 26.3535 9.90723C26.6292 10.0576 26.862 10.2295 27.0518 10.4229C27.2415 10.6126 27.3866 10.8311 27.4868 11.0781C27.5871 11.3216 27.6372 11.6063 27.6372 11.9321C27.6372 12.5409 27.4474 13.035 27.0679 13.4146C26.6883 13.7941 26.1655 14.0179 25.4995 14.0859V15.1548H24.6455V14.0913C23.9115 14.0125 23.3421 13.7529 22.9375 13.3125C22.5365 12.8685 22.3359 12.2795 22.3359 11.5454H23.8882C23.8882 11.9715 23.9884 12.2992 24.189 12.5283C24.3931 12.7539 24.6849 12.8667 25.0645 12.8667C25.3796 12.8667 25.6284 12.7843 25.811 12.6196C25.9937 12.4513 26.085 12.2257 26.085 11.9429Z", "fill", "#5A6F8F"], ["x", "8.5", "y", "19.5", "width", "4", "height", "10", "stroke", "#5A6F8F"], ["x1", "8", "y1", "27.5", "x2", "10.2361", "y2", "27.5", "stroke", "#5A6F8F"], ["x1", "8", "y1", "23.5", "x2", "10.2361", "y2", "23.5", "stroke", "#5A6F8F"], ["x1", "8", "y1", "21.5", "x2", "10.2361", "y2", "21.5", "stroke", "#5A6F8F"], ["x1", "8", "y1", "25.5", "x2", "10.2361", "y2", "25.5", "stroke", "#5A6F8F"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M3.61294 14.0073L2.81855 13.8283C2.59738 13.7785 2.56607 13.3714 2.7668 13.1707L6.07417 9.81491C6.3575 9.52829 6.72128 9.60422 6.85814 9.98548L8.48646 14.4529C8.58593 14.7213 8.38264 15.0816 8.15937 15.0313L7.15133 14.8042C6.84779 14.7359 6.51997 15.0367 6.41987 15.4752C5.70684 18.6038 5.96043 20.2905 6.32287 21.3066C6.43081 21.6076 6.14495 21.9795 5.94573 21.7933C4.10326 20.0749 3.63975 17.2898 4.01563 14.9091C4.08466 14.4758 3.90854 14.0738 3.61294 14.0073Z", "fill", "#5A6F8F"], ["d", "M13.7114 19.3887H10.8862L10.3491 21H8.63574L11.5469 13.1797H13.04L15.9673 21H14.2539L13.7114 19.3887ZM11.3213 18.0835H13.2764L12.2935 15.1562L11.3213 18.0835ZM18.2339 21H16.6763V12.75H18.2339V21ZM21.1558 21H19.5981V15.1885H21.1558V21ZM19.5068 13.6846C19.5068 13.4518 19.5838 13.2603 19.7378 13.1099C19.8953 12.9595 20.1084 12.8843 20.377 12.8843C20.6419 12.8843 20.8532 12.9595 21.0107 13.1099C21.1683 13.2603 21.2471 13.4518 21.2471 13.6846C21.2471 13.9209 21.1665 14.1143 21.0054 14.2646C20.8478 14.415 20.6383 14.4902 20.377 14.4902C20.1156 14.4902 19.9043 14.415 19.7432 14.2646C19.5856 14.1143 19.5068 13.9209 19.5068 13.6846ZM25.8071 21C25.7355 20.8604 25.6836 20.6867 25.6514 20.479C25.2754 20.8979 24.7866 21.1074 24.1851 21.1074C23.6157 21.1074 23.1431 20.9427 22.7671 20.6133C22.3947 20.2839 22.2085 19.8685 22.2085 19.3672C22.2085 18.7513 22.4359 18.2786 22.8906 17.9492C23.349 17.6198 24.0096 17.4533 24.8726 17.4497H25.5869V17.1167C25.5869 16.8481 25.5171 16.6333 25.3774 16.4722C25.2414 16.311 25.0247 16.2305 24.7275 16.2305C24.4661 16.2305 24.2603 16.2931 24.1099 16.4185C23.9631 16.5438 23.8896 16.7157 23.8896 16.9341H22.3374C22.3374 16.5975 22.4412 16.286 22.6489 15.9995C22.8566 15.7131 23.1502 15.4893 23.5298 15.3281C23.9093 15.1634 24.3354 15.0811 24.8081 15.0811C25.5243 15.0811 26.0918 15.2619 26.5107 15.6235C26.9333 15.9816 27.1445 16.4865 27.1445 17.1382V19.6572C27.1481 20.2087 27.2251 20.6258 27.3755 20.9087V21H25.8071ZM24.5234 19.9204C24.7526 19.9204 24.9639 19.8703 25.1572 19.77C25.3506 19.6662 25.4938 19.5283 25.5869 19.3564V18.3574H25.0068C24.2298 18.3574 23.8162 18.626 23.7661 19.1631L23.7607 19.2544C23.7607 19.4478 23.8288 19.6071 23.9648 19.7324C24.1009 19.8577 24.2871 19.9204 24.5234 19.9204ZM31.4844 19.394C31.4844 19.2043 31.3895 19.0557 31.1997 18.9482C31.0135 18.8372 30.7127 18.7388 30.2974 18.6528C28.9152 18.3628 28.2241 17.7756 28.2241 16.8911C28.2241 16.3755 28.4372 15.9458 28.8633 15.6021C29.293 15.2547 29.8534 15.0811 30.5444 15.0811C31.2821 15.0811 31.8711 15.2547 32.3115 15.6021C32.7555 15.9494 32.9775 16.4006 32.9775 16.9556H31.4253C31.4253 16.7336 31.3537 16.5509 31.2104 16.4077C31.0672 16.2609 30.8434 16.1875 30.5391 16.1875C30.2777 16.1875 30.0754 16.2466 29.9321 16.3647C29.7889 16.4829 29.7173 16.6333 29.7173 16.8159C29.7173 16.9878 29.7979 17.1274 29.959 17.2349C30.1237 17.3387 30.3994 17.43 30.7861 17.5088C31.1729 17.584 31.4987 17.6699 31.7637 17.7666C32.5837 18.0674 32.9937 18.5884 32.9937 19.3296C32.9937 19.8595 32.7663 20.2892 32.3115 20.6187C31.8568 20.9445 31.2695 21.1074 30.5498 21.1074C30.0628 21.1074 29.6296 21.0215 29.25 20.8496C28.874 20.6742 28.5786 20.436 28.3638 20.1353C28.1489 19.8309 28.0415 19.5033 28.0415 19.1523H29.5132C29.5275 19.4281 29.6296 19.6393 29.8193 19.7861C30.0091 19.9329 30.2633 20.0063 30.582 20.0063C30.8792 20.0063 31.103 19.9508 31.2534 19.8398C31.4074 19.7253 31.4844 19.5767 31.4844 19.394Z", "fill", "#5A6F8F"], ["x", "12.5654", "y", "24.687", "width", "0.8", "height", "3", "rx", "0.4", "transform", "rotate(-135 12.5654 24.687)", "fill", "#5A6F8F"], ["x", "22.7998", "y", "15", "width", "0.8", "height", "2.5", "rx", "0.4", "transform", "rotate(-135 22.7998 15)", "fill", "#5A6F8F"], ["cx", "18.5", "cy", "18.5", "r", "8.5", "stroke", "#5A6F8F", "stroke-width", "2"], ["x", "17", "y", "7", "width", "3", "height", "3", "fill", "#5A6F8F"], ["x", "16", "y", "5", "width", "5", "height", "3", "rx", "1", "fill", "#5A6F8F"], ["x", "9.19043", "y", "11.9395", "width", "1.7", "height", "2", "transform", "rotate(-47 9.19043 11.9395)", "fill", "#5A6F8F"], ["x", "8", "y", "11.7", "width", "3", "height", "2", "rx", "0.3", "transform", "rotate(-47 8 11.7)", "fill", "#5A6F8F"], ["x", "26.4629", "y", "12", "width", "1.7", "height", "2", "transform", "rotate(47 26.4629 12)", "fill", "#5A6F8F"], ["x", "27.4629", "y", "10.2", "width", "3", "height", "2", "rx", "0.3", "transform", "rotate(47 27.4629 10.2)", "fill", "#5A6F8F"], ["x", "18", "y", "24", "width", "0.8", "height", "3", "rx", "0.4", "fill", "#5A6F8F"], ["x", "18", "y", "10", "width", "0.8", "height", "3", "rx", "0.4", "fill", "#5A6F8F"], ["x", "10", "y", "18.8", "width", "0.8", "height", "3", "rx", "0.4", "transform", "rotate(-90 10 18.8)", "fill", "#5A6F8F"], ["x", "24", "y", "18.8", "width", "0.8", "height", "3", "rx", "0.4", "transform", "rotate(-90 24 18.8)", "fill", "#5A6F8F"], ["x", "22", "y", "22.5657", "width", "0.8", "height", "3", "rx", "0.4", "transform", "rotate(-45 22 22.5657)", "fill", "#5A6F8F"], ["x", "12", "y", "12.5657", "width", "0.8", "height", "3", "rx", "0.4", "transform", "rotate(-45 12 12.5657)", "fill", "#5A6F8F"], ["cx", "18.35", "cy", "18.35", "r", "1.35", "fill", "#5A6F8F"], ["d", "M25.54 6.44897L23.0303 5L10.5303 26.6506L13.04 28.0996L25.54 6.44897Z", "fill", "#5A6F8F"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M21.8901 10.023C20.7501 9.70901 19.4898 9.52197 18.1098 9.52197C11.6998 9.52197 7.86005 13.61 6.37005 15.616C5.88005 16.262 5.88003 17.148 6.35003 17.8C7.48003 19.37 10.0199 22.192 14.1899 23.355L15.5903 20.942C14.1403 20.082 13.1699 18.505 13.1699 16.701C13.1699 13.978 15.38 11.771 18.1 11.771C18.98 11.771 19.8 12 20.52 12.403L21.8901 10.023ZM19.3202 21.479C21.4502 20.937 23.0302 19.003 23.0302 16.701C23.0302 16.238 22.97 15.79 22.85 15.366L25.1401 11.387C27.4701 12.728 29.0103 14.49 29.8403 15.609C30.3203 16.257 30.3203 17.146 29.8403 17.796C28.3703 19.806 24.5798 23.879 18.1098 23.879C18.0498 23.879 17.9901 23.879 17.9301 23.878L19.3202 21.479ZM19.62 13.959C19.17 13.71 18.65 13.568 18.1 13.568C16.37 13.568 14.9701 14.97 14.9701 16.701C14.9701 17.839 15.5802 18.837 16.4902 19.385L19.62 13.959Z", "fill", "#5A6F8F"], ["matTooltip", "Remove Time Duration", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["x", "26.6914", "y", "7", "width", "2.5", "height", "28.0185", "transform", "rotate(44.6511 26.6914 7)", "fill", "#5A6F8F"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M11.7059 9.35297H22.2941C23.5936 9.35297 24.6471 10.4064 24.6471 11.7059V19.9412C24.6471 21.2407 23.5936 22.2941 22.2941 22.2941H11.7059C10.4064 22.2941 9.35291 21.2407 9.35291 19.9412V11.7059C9.35291 10.4064 10.4064 9.35297 11.7059 9.35297ZM7 11.7059C7 9.10687 9.10693 7 11.7059 7H22.2941C24.0551 7 25.5901 7.96722 26.397 9.39935C28.0735 9.67316 29.353 11.1284 29.353 12.8824V21.1177C29.353 24.3665 26.7195 27.0001 23.4707 27.0001H13.4707C11.6283 27.0001 10.0686 25.7902 9.54272 24.1216C8.0321 23.3383 7 21.7603 7 19.9412V11.7059Z", "fill", "#5A6F8F", 1, "pathRect"], ["width", "37", "height", "34", "viewBox", "0 0 37 34", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "37", "height", "34", "rx", "4", "transform", "matrix(-1 0 0 1 37 0)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectPath"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M9.57036 26.2684L10.8213 24.117C11.2255 24.3605 11.6942 24.5 12.2012 24.5H14.1705V27H12.2012C11.2413 27 10.3422 26.7334 9.57036 26.2684ZM21.9348 27V24.5H23.904C24.411 24.5 24.8797 24.3605 25.2839 24.117L26.5349 26.2684C25.7631 26.7334 24.8639 27 23.904 27H21.9348ZM29.1053 15.4744H26.6491V12.3333C26.6491 11.8059 26.5118 11.32 26.2746 10.9029L28.4002 9.65041C28.8485 10.4385 29.1053 11.3552 29.1053 12.3333V15.4744ZM14.1705 7H12.2012C11.2413 7 10.3422 7.26663 9.57036 7.7316L10.8213 9.88302C11.2255 9.63954 11.6942 9.5 12.2012 9.5H14.1705V7ZM7 18.5256H9.45614V21.6667C9.45614 22.1941 9.59351 22.68 9.83069 23.0971L7.70504 24.3496C7.2568 23.5615 7 22.6448 7 21.6667V18.5256ZM7 15.4744H9.45614V12.3333C9.45614 11.8059 9.59351 11.32 9.83069 10.9029L7.70504 9.65041C7.2568 10.4385 7 11.3552 7 12.3333V15.4744ZM16.0834 7V9.5H20.0219V7H16.0834ZM21.9348 7V9.5H23.904C24.411 9.5 24.8797 9.63954 25.2839 9.88302L26.5349 7.7316C25.7631 7.26663 24.8639 7 23.904 7H21.9348ZM29.1053 18.5256H26.6491V21.6667C26.6491 22.1941 26.5118 22.68 26.2746 23.0971L28.4002 24.3496C28.8485 23.5615 29.1053 22.6448 29.1053 21.6667V18.5256ZM20.0219 27V24.5H16.0834V27H20.0219Z", "fill", "#5A6F8F", 1, "pathRect"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14 12H24C25.6569 12 27 13.3431 27 15V22C27 23.6569 25.6569 25 24 25H12C10.3431 25 9 23.6569 9 22V17H7V22C7 24.7614 9.23858 27 12 27H24C26.7614 27 29 24.7614 29 22V15C29 12.2386 26.7614 10 24 10H14V12ZM4 12H7H9H12V14H9H7H4V12Z", "fill", "#5A6F8F"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M7 10V7H9V10H12V12H9V15H7V12H4V10H7ZM24 12H14V10H24C26.7615 10 29 12.2386 29 15V22C29 24.7615 26.7615 27 24 27H12C9.23853 27 7 24.7615 7 22V17H9V22C9 23.6569 10.3431 25 12 25H24C25.6569 25 27 23.6569 27 22V15C27 13.3431 25.6569 12 24 12ZM12 19C11.4478 19 11 19.4478 11 20V22C11 22.5522 11.4478 23 12 23H16C16.5522 23 17 22.5522 17 22V20C17 19.4478 16.5522 19 16 19H12ZM20 19C19.4478 19 19 19.4478 19 20V22C19 22.5522 19.4478 23 20 23H24C24.5522 23 25 22.5522 25 22V20C25 19.4478 24.5522 19 24 19H20Z", "fill", "#5A6F8F", 1, "pathRect"], ["matTooltip", "Semi-fold", 1, "button", 3, "click"], ["d", "M13 5H24C26.7614 5 29 7.23858 29 10V26C29 28.7614 26.7614 31 24 31H13C10.2386 31 8 28.7614 8 26V10C8 7.23858 10.2386 5 13 5Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["id", "path-3-inside-1", "fill", "white"], ["d", "M22 23L28.0231 23.5959C28.5727 23.6503 28.9742 24.1399 28.9198 24.6895L28.759 26.3147C28.4871 29.0627 26.0391 31.07 23.291 30.7982L21.2485 30.5961L22 23Z"], ["d", "M22 23L28.0231 23.5959C28.5727 23.6503 28.9742 24.1399 28.9198 24.6895L28.759 26.3147C28.4871 29.0627 26.0391 31.07 23.291 30.7982L21.2485 30.5961L22 23Z", "stroke", "#5A6F8F", "stroke-width", "1.5", "mask", "url(#path-3-inside-1)"], ["d", "M14.75 6.5L18.8636 13.625H10.6364L14.75 6.5Z", "fill", "#5A6F8F"], ["d", "M14.7998 24.8L16.0988 27.05H13.5008L14.7998 24.8Z", "fill", "#5A6F8F"], ["d", "M11.5024 20.625L14.75 15L17.9976 20.625H11.5024Z", "stroke", "#5A6F8F"], ["d", "M11.5024 28.125L14.75 22.5L17.9976 28.125H11.5024Z", "stroke", "#5A6F8F"], ["matTooltip", "Remove Semi-Fold View", 1, "button", 3, "click"], ["d", "M22 23L28.0231 23.5959C28.5727 23.6503 28.9742 24.1399 28.9198 24.6895L28.759 26.3147C28.4871 29.0627 26.0391 31.07 23.291 30.7982L21.2485 30.5961L22 23Z", "stroke", "#5A6F8F", "stroke-width", "3", "mask", "url(#path-3-inside-1_0_1)"], ["x", "30.4766", "y", "4", "width", "2.5", "height", "37.6732", "transform", "rotate(44.6511 30.4766 4)", "fill", "#5A6F8F"], ["matTooltip", "State Arrangement Options", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M28.5 23H8.5V25H28.5V23ZM23.5 20.5C24.0522 20.5 24.5 20.0522 24.5 19.5V9.5C24.5 8.94775 24.0522 8.5 23.5 8.5H20.5C19.9478 8.5 19.5 8.94775 19.5 9.5V19.5C19.5 20.0522 19.9478 20.5 20.5 20.5H23.5ZM17.5 19.5C17.5 20.0522 17.0522 20.5 16.5 20.5H13.5C12.9478 20.5 12.5 20.0522 12.5 19.5V13.5C12.5 12.9478 12.9478 12.5 13.5 12.5L16.5 12.5C17.0522 12.5 17.5 12.9478 17.5 13.5V19.5Z", "fill", "#5A6F8F", 1, "pathRect"], ["class", "pathRect", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M 15 30 h 8 L 19 34 Z ", "fill", "#5A6F8F", 4, "ngIf"], ["class", "pathRect", "fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M 15 34 h 8 L 19 30 Z ", "fill", "#5A6F8F", 4, "ngIf"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M 15 30 h 8 L 19 34 Z ", "fill", "#5A6F8F", 1, "pathRect"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M 15 34 h 8 L 19 30 Z ", "fill", "#5A6F8F", 1, "pathRect"], ["id", "stateArrangementTools"], ["class", "statesArrangementSpan", 4, "ngIf"], [1, "statesArrangementSpan"], ["class", "button", "matTooltip", "Arrange Left", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Arrange Top", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Arrange Right", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Arrange Bottom", 3, "click", 4, "ngIf"], ["matTooltip", "Arrange Left", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M13.5 7V27H11.5V7H13.5ZM16 12C16 11.4477 16.4478 11 17 11H27C27.5522 11 28 11.4477 28 12V15C28 15.5522 27.5522 16 27 16H17C16.4478 16 16 15.5522 16 15V12ZM17 18C16.4478 18 16 18.4478 16 19V22C16 22.5522 16.4478 23 17 23H23C23.5522 23 24 22.5522 24 22V19C24 18.4478 23.5522 18 23 18H17Z", "fill", "#5A6F8F", 1, "pathRect"], ["matTooltip", "Arrange Top", 1, "button", 3, "click"], ["width", "36", "height", "35", "viewBox", "0 0 36 37", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "36", "height", "35", "rx", "4", "transform", "matrix(0 -1 -1 0 35.5 36.5)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectPath"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M28.5 14L8.5 14V12L28.5 12V14ZM23.5 16.5C24.0523 16.5 24.5 16.9478 24.5 17.5V27.5C24.5 28.0522 24.0523 28.5 23.5 28.5H20.5C19.9478 28.5 19.5 28.0522 19.5 27.5V17.5C19.5 16.9478 19.9478 16.5 20.5 16.5H23.5ZM17.5 17.5C17.5 16.9478 17.0522 16.5 16.5 16.5H13.5C12.9478 16.5 12.5 16.9478 12.5 17.5V23.5C12.5 24.0522 12.9478 24.5 13.5 24.5H16.5C17.0522 24.5 17.5 24.0522 17.5 23.5V17.5Z", "fill", "#5A6F8F", 1, "pathRect"], ["matTooltip", "Arrange Right", 1, "button", 3, "click"], ["id", "aRight", "width", "36", "height", "35", "rx", "4", "fill", "#497284", "fill-opacity", "0.09"], ["x", "10", "y", "10", "width", "17", "height", "20", "viewBox", "0 0 17 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.5 0V20H16.5V0H14.5ZM12 5C12 4.44769 11.5522 4 11 4H1C0.447754 4 0 4.44769 0 5V8C0 8.55225 0.447754 9 1 9H11C11.5522 9 12 8.55225 12 8V5ZM11 11C11.5522 11 12 11.4478 12 12V15C12 15.5522 11.5522 16 11 16H5C4.44775 16 4 15.5522 4 15V12C4 11.4478 4.44775 11 5 11H11Z", "fill", "#5A6F8F"], ["matTooltip", "Arrange Bottom", 1, "button", 3, "click"], ["x", "35.5", "y", "0.5", "width", "36", "height", "35", "rx", "4", "transform", "rotate(90 35.5 0.5)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectPath"], ["id", "temporalStateContainer", 1, "temporalStateIcons"], ["id", "aTagInitial", "matTooltip", "Set As Initial", 1, "state", 3, "click"], ["width", "60", "height", "35", "viewBox", "0 0 60 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["id", "aTagFinal", "matTooltip", "Set As Final", 1, "state", 3, "click"], ["id", "aTagCurrent", "matTooltip", "Set As Current", 1, "state", 3, "click"], ["id", "aTagDefault", "matTooltip", "Set As Default", 1, "state", 3, "click"], ["id", "default", "width", "60", "height", "35", "viewBox", "0 0 60 35", "xmlns", "http://www.w3.org/2000/svg", 1, "temporalStateSvg"], ["id", "svgRectDefault", "width", "60", "height", "35", "rx", "4", "transform", "matrix(-1 0 0 1 60 0)", 1, "rectPath"], ["id", "svgRectTextDefault", "opacity", "0.7", "d", "M8.35254 22V12.0469H11.1621C12.028 12.0469 12.7936 12.2383 13.459 12.6211C14.1243 13.0039 14.637 13.5485 14.9971 14.2549C15.3617 14.9613 15.5462 15.7725 15.5508 16.6885V17.3242C15.5508 18.263 15.3685 19.0856 15.0039 19.792C14.6439 20.4984 14.1266 21.0407 13.4521 21.4189C12.7822 21.7972 12.0007 21.9909 11.1074 22H8.35254ZM9.66504 13.127V20.9268H11.0459C12.0576 20.9268 12.8438 20.6123 13.4043 19.9834C13.9694 19.3545 14.252 18.459 14.252 17.2969V16.7158C14.252 15.5856 13.9854 14.7083 13.4521 14.084C12.9235 13.4551 12.1715 13.1361 11.1963 13.127H9.66504ZM20.4111 22.1367C19.4085 22.1367 18.5928 21.8086 17.9639 21.1523C17.335 20.4915 17.0205 19.6097 17.0205 18.5068V18.2744C17.0205 17.5407 17.1595 16.8867 17.4375 16.3125C17.7201 15.7337 18.112 15.2826 18.6133 14.959C19.1191 14.6309 19.666 14.4668 20.2539 14.4668C21.2155 14.4668 21.9629 14.7835 22.4961 15.417C23.0293 16.0505 23.2959 16.9574 23.2959 18.1377V18.6641H18.2852C18.3034 19.3932 18.5153 19.9834 18.9209 20.4346C19.3311 20.8812 19.8506 21.1045 20.4795 21.1045C20.9261 21.1045 21.3044 21.0133 21.6143 20.8311C21.9242 20.6488 22.1953 20.4072 22.4277 20.1064L23.2002 20.708C22.5804 21.6605 21.6507 22.1367 20.4111 22.1367ZM20.2539 15.5059C19.7435 15.5059 19.3151 15.6927 18.9688 16.0664C18.6224 16.4355 18.4082 16.9551 18.3262 17.625H22.0312V17.5293C21.9948 16.8867 21.8216 16.39 21.5117 16.0391C21.2018 15.6836 20.7826 15.5059 20.2539 15.5059ZM25.3877 22V15.5811H24.2188V14.6035H25.3877V13.8447C25.3877 13.0518 25.5996 12.4388 26.0234 12.0059C26.4473 11.5729 27.0465 11.3564 27.8213 11.3564C28.113 11.3564 28.4023 11.3952 28.6895 11.4727L28.6211 12.498C28.4069 12.457 28.179 12.4365 27.9375 12.4365C27.5273 12.4365 27.2106 12.5573 26.9873 12.7988C26.764 13.0358 26.6523 13.3776 26.6523 13.8242V14.6035H28.2314V15.5811H26.6523V22H25.3877ZM34.1992 22C34.1263 21.8542 34.0671 21.5944 34.0215 21.2207C33.4336 21.8314 32.7318 22.1367 31.916 22.1367C31.1868 22.1367 30.5876 21.9316 30.1182 21.5215C29.6533 21.1068 29.4209 20.5827 29.4209 19.9492C29.4209 19.179 29.7126 18.582 30.2959 18.1582C30.8838 17.7298 31.7087 17.5156 32.7705 17.5156H34.001V16.9346C34.001 16.4925 33.8688 16.1416 33.6045 15.8818C33.3402 15.6175 32.9505 15.4854 32.4355 15.4854C31.9844 15.4854 31.6061 15.5993 31.3008 15.8271C30.9954 16.055 30.8428 16.3307 30.8428 16.6543H29.5713C29.5713 16.2852 29.7012 15.9297 29.9609 15.5879C30.2253 15.2415 30.5807 14.9681 31.0273 14.7676C31.4785 14.5671 31.973 14.4668 32.5107 14.4668C33.363 14.4668 34.0306 14.681 34.5137 15.1094C34.9967 15.5332 35.2474 16.1188 35.2656 16.8662V20.2705C35.2656 20.9495 35.3522 21.4896 35.5254 21.8906V22H34.1992ZM32.1006 21.0361C32.4971 21.0361 32.873 20.9336 33.2285 20.7285C33.584 20.5234 33.8415 20.2568 34.001 19.9287V18.4111H33.0098C31.4603 18.4111 30.6855 18.8646 30.6855 19.7715C30.6855 20.168 30.8177 20.4779 31.082 20.7012C31.3464 20.9245 31.6859 21.0361 32.1006 21.0361ZM41.8145 21.2686C41.3223 21.8473 40.5999 22.1367 39.6475 22.1367C38.859 22.1367 38.2575 21.9089 37.8428 21.4531C37.4326 20.9928 37.2253 20.3138 37.2207 19.416V14.6035H38.4854V19.3818C38.4854 20.5029 38.9411 21.0635 39.8525 21.0635C40.8187 21.0635 41.4613 20.7035 41.7803 19.9834V14.6035H43.0449V22H41.8418L41.8145 21.2686ZM46.3467 22H45.082V11.5H46.3467V22ZM50.0928 12.8125V14.6035H51.4736V15.5811H50.0928V20.168C50.0928 20.4642 50.1543 20.6875 50.2773 20.8379C50.4004 20.9837 50.61 21.0566 50.9062 21.0566C51.0521 21.0566 51.2526 21.0293 51.5078 20.9746V22C51.1751 22.0911 50.8516 22.1367 50.5371 22.1367C49.972 22.1367 49.5459 21.9658 49.2588 21.624C48.9717 21.2822 48.8281 20.7969 48.8281 20.168V15.5811H47.4814V14.6035H48.8281V12.8125H50.0928Z", "fill", "#1A3763", 1, "pathRect"], ["width", "60", "height", "35", "viewBox", "0 0 60 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M4 0H56C58.2091 0 60 1.79086 60 4V31C60 33.2091 58.2091 35 56 35H4C1.79086 35 0 33.2091 0 31V4C0 1.79086 1.79086 0 4 0Z", "fill", "#E6E9EB"], ["d", "M15.0898 22H13.7773V12.0469H15.0898V22ZM18.4941 14.6035L18.5352 15.5332C19.1003 14.8223 19.8385 14.4668 20.75 14.4668C22.3132 14.4668 23.1016 15.3486 23.1152 17.1123V22H21.8506V17.1055C21.846 16.5723 21.723 16.1781 21.4814 15.9229C21.2445 15.6676 20.873 15.54 20.3672 15.54C19.957 15.54 19.597 15.6494 19.2871 15.8682C18.9772 16.0869 18.7357 16.374 18.5625 16.7295V22H17.2979V14.6035H18.4941ZM26.3965 22H25.1318V14.6035H26.3965V22ZM25.0293 12.6416C25.0293 12.4365 25.0908 12.2633 25.2139 12.1221C25.3415 11.9808 25.5283 11.9102 25.7744 11.9102C26.0205 11.9102 26.2074 11.9808 26.335 12.1221C26.4626 12.2633 26.5264 12.4365 26.5264 12.6416C26.5264 12.8467 26.4626 13.0176 26.335 13.1543C26.2074 13.291 26.0205 13.3594 25.7744 13.3594C25.5283 13.3594 25.3415 13.291 25.2139 13.1543C25.0908 13.0176 25.0293 12.8467 25.0293 12.6416ZM30.1426 12.8125V14.6035H31.5234V15.5811H30.1426V20.168C30.1426 20.4642 30.2041 20.6875 30.3271 20.8379C30.4502 20.9837 30.6598 21.0566 30.9561 21.0566C31.1019 21.0566 31.3024 21.0293 31.5576 20.9746V22C31.2249 22.0911 30.9014 22.1367 30.5869 22.1367C30.0218 22.1367 29.5957 21.9658 29.3086 21.624C29.0215 21.2822 28.8779 20.7969 28.8779 20.168V15.5811H27.5312V14.6035H28.8779V12.8125H30.1426ZM34.3809 22H33.1162V14.6035H34.3809V22ZM33.0137 12.6416C33.0137 12.4365 33.0752 12.2633 33.1982 12.1221C33.3258 11.9808 33.5127 11.9102 33.7588 11.9102C34.0049 11.9102 34.1917 11.9808 34.3193 12.1221C34.4469 12.2633 34.5107 12.4365 34.5107 12.6416C34.5107 12.8467 34.4469 13.0176 34.3193 13.1543C34.1917 13.291 34.0049 13.3594 33.7588 13.3594C33.5127 13.3594 33.3258 13.291 33.1982 13.1543C33.0752 13.0176 33.0137 12.8467 33.0137 12.6416ZM40.9775 22C40.9046 21.8542 40.8454 21.5944 40.7998 21.2207C40.2119 21.8314 39.5101 22.1367 38.6943 22.1367C37.9652 22.1367 37.3659 21.9316 36.8965 21.5215C36.4316 21.1068 36.1992 20.5827 36.1992 19.9492C36.1992 19.179 36.4909 18.582 37.0742 18.1582C37.6621 17.7298 38.487 17.5156 39.5488 17.5156H40.7793V16.9346C40.7793 16.4925 40.6471 16.1416 40.3828 15.8818C40.1185 15.6175 39.7288 15.4854 39.2139 15.4854C38.7627 15.4854 38.3844 15.5993 38.0791 15.8271C37.7738 16.055 37.6211 16.3307 37.6211 16.6543H36.3496C36.3496 16.2852 36.4795 15.9297 36.7393 15.5879C37.0036 15.2415 37.359 14.9681 37.8057 14.7676C38.2568 14.5671 38.7513 14.4668 39.2891 14.4668C40.1413 14.4668 40.8089 14.681 41.292 15.1094C41.7751 15.5332 42.0257 16.1188 42.0439 16.8662V20.2705C42.0439 20.9495 42.1305 21.4896 42.3037 21.8906V22H40.9775ZM38.8789 21.0361C39.2754 21.0361 39.6514 20.9336 40.0068 20.7285C40.3623 20.5234 40.6198 20.2568 40.7793 19.9287V18.4111H39.7881C38.2386 18.4111 37.4639 18.8646 37.4639 19.7715C37.4639 20.168 37.596 20.4779 37.8604 20.7012C38.1247 20.9245 38.4642 21.0361 38.8789 21.0361ZM45.4004 22H44.1357V11.5H45.4004V22Z", "fill", "#1A3763", "fill-opacity", "0.7"], ["d", "M4 0H56C58.2091 0 60 1.79086 60 4V31C60 33.2091 58.2091 35 56 35H4C1.79086 35 0 33.2091 0 31V4C0 1.79086 1.79086 0 4 0Z", "fill", "#1A3763"], ["d", "M15.0898 22H13.7773V12.0469H15.0898V22ZM18.4941 14.6035L18.5352 15.5332C19.1003 14.8223 19.8385 14.4668 20.75 14.4668C22.3132 14.4668 23.1016 15.3486 23.1152 17.1123V22H21.8506V17.1055C21.846 16.5723 21.723 16.1781 21.4814 15.9229C21.2445 15.6676 20.873 15.54 20.3672 15.54C19.957 15.54 19.597 15.6494 19.2871 15.8682C18.9772 16.0869 18.7357 16.374 18.5625 16.7295V22H17.2979V14.6035H18.4941ZM26.3965 22H25.1318V14.6035H26.3965V22ZM25.0293 12.6416C25.0293 12.4365 25.0908 12.2633 25.2139 12.1221C25.3415 11.9808 25.5283 11.9102 25.7744 11.9102C26.0205 11.9102 26.2074 11.9808 26.335 12.1221C26.4626 12.2633 26.5264 12.4365 26.5264 12.6416C26.5264 12.8467 26.4626 13.0176 26.335 13.1543C26.2074 13.291 26.0205 13.3594 25.7744 13.3594C25.5283 13.3594 25.3415 13.291 25.2139 13.1543C25.0908 13.0176 25.0293 12.8467 25.0293 12.6416ZM30.1426 12.8125V14.6035H31.5234V15.5811H30.1426V20.168C30.1426 20.4642 30.2041 20.6875 30.3271 20.8379C30.4502 20.9837 30.6598 21.0566 30.9561 21.0566C31.1019 21.0566 31.3024 21.0293 31.5576 20.9746V22C31.2249 22.0911 30.9014 22.1367 30.5869 22.1367C30.0218 22.1367 29.5957 21.9658 29.3086 21.624C29.0215 21.2822 28.8779 20.7969 28.8779 20.168V15.5811H27.5312V14.6035H28.8779V12.8125H30.1426ZM34.3809 22H33.1162V14.6035H34.3809V22ZM33.0137 12.6416C33.0137 12.4365 33.0752 12.2633 33.1982 12.1221C33.3258 11.9808 33.5127 11.9102 33.7588 11.9102C34.0049 11.9102 34.1917 11.9808 34.3193 12.1221C34.4469 12.2633 34.5107 12.4365 34.5107 12.6416C34.5107 12.8467 34.4469 13.0176 34.3193 13.1543C34.1917 13.291 34.0049 13.3594 33.7588 13.3594C33.5127 13.3594 33.3258 13.291 33.1982 13.1543C33.0752 13.0176 33.0137 12.8467 33.0137 12.6416ZM40.9775 22C40.9046 21.8542 40.8454 21.5944 40.7998 21.2207C40.2119 21.8314 39.5101 22.1367 38.6943 22.1367C37.9652 22.1367 37.3659 21.9316 36.8965 21.5215C36.4316 21.1068 36.1992 20.5827 36.1992 19.9492C36.1992 19.179 36.4909 18.582 37.0742 18.1582C37.6621 17.7298 38.487 17.5156 39.5488 17.5156H40.7793V16.9346C40.7793 16.4925 40.6471 16.1416 40.3828 15.8818C40.1185 15.6175 39.7288 15.4854 39.2139 15.4854C38.7627 15.4854 38.3844 15.5993 38.0791 15.8271C37.7738 16.055 37.6211 16.3307 37.6211 16.6543H36.3496C36.3496 16.2852 36.4795 15.9297 36.7393 15.5879C37.0036 15.2415 37.359 14.9681 37.8057 14.7676C38.2568 14.5671 38.7513 14.4668 39.2891 14.4668C40.1413 14.4668 40.8089 14.681 41.292 15.1094C41.7751 15.5332 42.0257 16.1188 42.0439 16.8662V20.2705C42.0439 20.9495 42.1305 21.4896 42.3037 21.8906V22H40.9775ZM38.8789 21.0361C39.2754 21.0361 39.6514 20.9336 40.0068 20.7285C40.3623 20.5234 40.6198 20.2568 40.7793 19.9287V18.4111H39.7881C38.2386 18.4111 37.4639 18.8646 37.4639 19.7715C37.4639 20.168 37.596 20.4779 37.8604 20.7012C38.1247 20.9245 38.4642 21.0361 38.8789 21.0361ZM45.4004 22H44.1357V11.5H45.4004V22Z", "fill", "white", "fill-opacity", "0.7"], ["d", "M21.2012 17.6045H17.0244V22H15.7119V12.0469H21.8779V13.127H17.0244V16.5312H21.2012V17.6045ZM24.626 22H23.3613V14.6035H24.626V22ZM23.2588 12.6416C23.2588 12.4365 23.3203 12.2633 23.4434 12.1221C23.571 11.9808 23.7578 11.9102 24.0039 11.9102C24.25 11.9102 24.4368 11.9808 24.5645 12.1221C24.6921 12.2633 24.7559 12.4365 24.7559 12.6416C24.7559 12.8467 24.6921 13.0176 24.5645 13.1543C24.4368 13.291 24.25 13.3594 24.0039 13.3594C23.7578 13.3594 23.571 13.291 23.4434 13.1543C23.3203 13.0176 23.2588 12.8467 23.2588 12.6416ZM27.8525 14.6035L27.8936 15.5332C28.4587 14.8223 29.1969 14.4668 30.1084 14.4668C31.6715 14.4668 32.46 15.3486 32.4736 17.1123V22H31.209V17.1055C31.2044 16.5723 31.0814 16.1781 30.8398 15.9229C30.6029 15.6676 30.2314 15.54 29.7256 15.54C29.3154 15.54 28.9554 15.6494 28.6455 15.8682C28.3356 16.0869 28.0941 16.374 27.9209 16.7295V22H26.6562V14.6035H27.8525ZM38.9473 22C38.8743 21.8542 38.8151 21.5944 38.7695 21.2207C38.1816 21.8314 37.4798 22.1367 36.6641 22.1367C35.9349 22.1367 35.3356 21.9316 34.8662 21.5215C34.4014 21.1068 34.1689 20.5827 34.1689 19.9492C34.1689 19.179 34.4606 18.582 35.0439 18.1582C35.6318 17.7298 36.4567 17.5156 37.5186 17.5156H38.749V16.9346C38.749 16.4925 38.6169 16.1416 38.3525 15.8818C38.0882 15.6175 37.6986 15.4854 37.1836 15.4854C36.7324 15.4854 36.3542 15.5993 36.0488 15.8271C35.7435 16.055 35.5908 16.3307 35.5908 16.6543H34.3193C34.3193 16.2852 34.4492 15.9297 34.709 15.5879C34.9733 15.2415 35.3288 14.9681 35.7754 14.7676C36.2266 14.5671 36.721 14.4668 37.2588 14.4668C38.111 14.4668 38.7786 14.681 39.2617 15.1094C39.7448 15.5332 39.9954 16.1188 40.0137 16.8662V20.2705C40.0137 20.9495 40.1003 21.4896 40.2734 21.8906V22H38.9473ZM36.8486 21.0361C37.2451 21.0361 37.6211 20.9336 37.9766 20.7285C38.332 20.5234 38.5895 20.2568 38.749 19.9287V18.4111H37.7578C36.2083 18.4111 35.4336 18.8646 35.4336 19.7715C35.4336 20.168 35.5658 20.4779 35.8301 20.7012C36.0944 20.9245 36.4339 21.0361 36.8486 21.0361ZM43.3701 22H42.1055V11.5H43.3701V22Z", "fill", "#1A3763", "fill-opacity", "0.7"], ["d", "M21.2012 17.6045H17.0244V22H15.7119V12.0469H21.8779V13.127H17.0244V16.5312H21.2012V17.6045ZM24.626 22H23.3613V14.6035H24.626V22ZM23.2588 12.6416C23.2588 12.4365 23.3203 12.2633 23.4434 12.1221C23.571 11.9808 23.7578 11.9102 24.0039 11.9102C24.25 11.9102 24.4368 11.9808 24.5645 12.1221C24.6921 12.2633 24.7559 12.4365 24.7559 12.6416C24.7559 12.8467 24.6921 13.0176 24.5645 13.1543C24.4368 13.291 24.25 13.3594 24.0039 13.3594C23.7578 13.3594 23.571 13.291 23.4434 13.1543C23.3203 13.0176 23.2588 12.8467 23.2588 12.6416ZM27.8525 14.6035L27.8936 15.5332C28.4587 14.8223 29.1969 14.4668 30.1084 14.4668C31.6715 14.4668 32.46 15.3486 32.4736 17.1123V22H31.209V17.1055C31.2044 16.5723 31.0814 16.1781 30.8398 15.9229C30.6029 15.6676 30.2314 15.54 29.7256 15.54C29.3154 15.54 28.9554 15.6494 28.6455 15.8682C28.3356 16.0869 28.0941 16.374 27.9209 16.7295V22H26.6562V14.6035H27.8525ZM38.9473 22C38.8743 21.8542 38.8151 21.5944 38.7695 21.2207C38.1816 21.8314 37.4798 22.1367 36.6641 22.1367C35.9349 22.1367 35.3356 21.9316 34.8662 21.5215C34.4014 21.1068 34.1689 20.5827 34.1689 19.9492C34.1689 19.179 34.4606 18.582 35.0439 18.1582C35.6318 17.7298 36.4567 17.5156 37.5186 17.5156H38.749V16.9346C38.749 16.4925 38.6169 16.1416 38.3525 15.8818C38.0882 15.6175 37.6986 15.4854 37.1836 15.4854C36.7324 15.4854 36.3542 15.5993 36.0488 15.8271C35.7435 16.055 35.5908 16.3307 35.5908 16.6543H34.3193C34.3193 16.2852 34.4492 15.9297 34.709 15.5879C34.9733 15.2415 35.3288 14.9681 35.7754 14.7676C36.2266 14.5671 36.721 14.4668 37.2588 14.4668C38.111 14.4668 38.7786 14.681 39.2617 15.1094C39.7448 15.5332 39.9954 16.1188 40.0137 16.8662V20.2705C40.0137 20.9495 40.1003 21.4896 40.2734 21.8906V22H38.9473ZM36.8486 21.0361C37.2451 21.0361 37.6211 20.9336 37.9766 20.7285C38.332 20.5234 38.5895 20.2568 38.749 19.9287V18.4111H37.7578C36.2083 18.4111 35.4336 18.8646 35.4336 19.7715C35.4336 20.168 35.5658 20.4779 35.8301 20.7012C36.0944 20.9245 36.4339 21.0361 36.8486 21.0361ZM43.3701 22H42.1055V11.5H43.3701V22Z", "fill", "white", "fill-opacity", "0.7"], ["d", "M15.0146 18.8418C14.8916 19.8945 14.502 20.708 13.8457 21.2822C13.194 21.8519 12.3258 22.1367 11.2412 22.1367C10.0654 22.1367 9.12207 21.7152 8.41113 20.8721C7.70475 20.029 7.35156 18.901 7.35156 17.4883V16.5312C7.35156 15.6061 7.51562 14.7926 7.84375 14.0908C8.17643 13.389 8.64583 12.8512 9.25195 12.4775C9.85807 12.0993 10.5599 11.9102 11.3574 11.9102C12.4147 11.9102 13.2624 12.2064 13.9004 12.7988C14.5384 13.3867 14.9098 14.2025 15.0146 15.2461H13.6953C13.5814 14.4531 13.333 13.8789 12.9502 13.5234C12.5719 13.168 12.041 12.9902 11.3574 12.9902C10.5189 12.9902 9.86035 13.3001 9.38184 13.9199C8.90788 14.5397 8.6709 15.4215 8.6709 16.5654V17.5293C8.6709 18.6094 8.89648 19.4684 9.34766 20.1064C9.79883 20.7445 10.43 21.0635 11.2412 21.0635C11.9704 21.0635 12.5286 20.8994 12.916 20.5713C13.3079 20.2386 13.5677 19.6621 13.6953 18.8418H15.0146ZM21.1807 21.2686C20.6885 21.8473 19.9661 22.1367 19.0137 22.1367C18.2253 22.1367 17.6237 21.9089 17.209 21.4531C16.7988 20.9928 16.5915 20.3138 16.5869 19.416V14.6035H17.8516V19.3818C17.8516 20.5029 18.3073 21.0635 19.2188 21.0635C20.1849 21.0635 20.8275 20.7035 21.1465 19.9834V14.6035H22.4111V22H21.208L21.1807 21.2686ZM27.9141 15.7383C27.7227 15.7064 27.5153 15.6904 27.292 15.6904C26.4626 15.6904 25.8997 16.0436 25.6035 16.75V22H24.3389V14.6035H25.5693L25.5898 15.458C26.0046 14.7972 26.5924 14.4668 27.3535 14.4668C27.5996 14.4668 27.7865 14.4987 27.9141 14.5625V15.7383ZM32.6582 15.7383C32.4668 15.7064 32.2594 15.6904 32.0361 15.6904C31.2067 15.6904 30.6439 16.0436 30.3477 16.75V22H29.083V14.6035H30.3135L30.334 15.458C30.7487 14.7972 31.3366 14.4668 32.0977 14.4668C32.3438 14.4668 32.5306 14.4987 32.6582 14.5625V15.7383ZM36.7598 22.1367C35.7572 22.1367 34.9414 21.8086 34.3125 21.1523C33.6836 20.4915 33.3691 19.6097 33.3691 18.5068V18.2744C33.3691 17.5407 33.5081 16.8867 33.7861 16.3125C34.0687 15.7337 34.4606 15.2826 34.9619 14.959C35.4678 14.6309 36.0146 14.4668 36.6025 14.4668C37.5641 14.4668 38.3115 14.7835 38.8447 15.417C39.3779 16.0505 39.6445 16.9574 39.6445 18.1377V18.6641H34.6338C34.652 19.3932 34.8639 19.9834 35.2695 20.4346C35.6797 20.8812 36.1992 21.1045 36.8281 21.1045C37.2747 21.1045 37.653 21.0133 37.9629 20.8311C38.2728 20.6488 38.5439 20.4072 38.7764 20.1064L39.5488 20.708C38.929 21.6605 37.9993 22.1367 36.7598 22.1367ZM36.6025 15.5059C36.0921 15.5059 35.6637 15.6927 35.3174 16.0664C34.971 16.4355 34.7568 16.9551 34.6748 17.625H38.3799V17.5293C38.3434 16.8867 38.1702 16.39 37.8604 16.0391C37.5505 15.6836 37.1312 15.5059 36.6025 15.5059ZM42.3105 14.6035L42.3516 15.5332C42.9167 14.8223 43.6549 14.4668 44.5664 14.4668C46.1296 14.4668 46.918 15.3486 46.9316 17.1123V22H45.667V17.1055C45.6624 16.5723 45.5394 16.1781 45.2979 15.9229C45.0609 15.6676 44.6895 15.54 44.1836 15.54C43.7734 15.54 43.4134 15.6494 43.1035 15.8682C42.7936 16.0869 42.5521 16.374 42.3789 16.7295V22H41.1143V14.6035H42.3105ZM50.5547 12.8125V14.6035H51.9355V15.5811H50.5547V20.168C50.5547 20.4642 50.6162 20.6875 50.7393 20.8379C50.8623 20.9837 51.0719 21.0566 51.3682 21.0566C51.514 21.0566 51.7145 21.0293 51.9697 20.9746V22C51.637 22.0911 51.3135 22.1367 50.999 22.1367C50.4339 22.1367 50.0078 21.9658 49.7207 21.624C49.4336 21.2822 49.29 20.7969 49.29 20.168V15.5811H47.9434V14.6035H49.29V12.8125H50.5547Z", "fill", "#1A3763", "fill-opacity", "0.7"], ["d", "M15.0146 18.8418C14.8916 19.8945 14.502 20.708 13.8457 21.2822C13.194 21.8519 12.3258 22.1367 11.2412 22.1367C10.0654 22.1367 9.12207 21.7152 8.41113 20.8721C7.70475 20.029 7.35156 18.901 7.35156 17.4883V16.5312C7.35156 15.6061 7.51562 14.7926 7.84375 14.0908C8.17643 13.389 8.64583 12.8512 9.25195 12.4775C9.85807 12.0993 10.5599 11.9102 11.3574 11.9102C12.4147 11.9102 13.2624 12.2064 13.9004 12.7988C14.5384 13.3867 14.9098 14.2025 15.0146 15.2461H13.6953C13.5814 14.4531 13.333 13.8789 12.9502 13.5234C12.5719 13.168 12.041 12.9902 11.3574 12.9902C10.5189 12.9902 9.86035 13.3001 9.38184 13.9199C8.90788 14.5397 8.6709 15.4215 8.6709 16.5654V17.5293C8.6709 18.6094 8.89648 19.4684 9.34766 20.1064C9.79883 20.7445 10.43 21.0635 11.2412 21.0635C11.9704 21.0635 12.5286 20.8994 12.916 20.5713C13.3079 20.2386 13.5677 19.6621 13.6953 18.8418H15.0146ZM21.1807 21.2686C20.6885 21.8473 19.9661 22.1367 19.0137 22.1367C18.2253 22.1367 17.6237 21.9089 17.209 21.4531C16.7988 20.9928 16.5915 20.3138 16.5869 19.416V14.6035H17.8516V19.3818C17.8516 20.5029 18.3073 21.0635 19.2188 21.0635C20.1849 21.0635 20.8275 20.7035 21.1465 19.9834V14.6035H22.4111V22H21.208L21.1807 21.2686ZM27.9141 15.7383C27.7227 15.7064 27.5153 15.6904 27.292 15.6904C26.4626 15.6904 25.8997 16.0436 25.6035 16.75V22H24.3389V14.6035H25.5693L25.5898 15.458C26.0046 14.7972 26.5924 14.4668 27.3535 14.4668C27.5996 14.4668 27.7865 14.4987 27.9141 14.5625V15.7383ZM32.6582 15.7383C32.4668 15.7064 32.2594 15.6904 32.0361 15.6904C31.2067 15.6904 30.6439 16.0436 30.3477 16.75V22H29.083V14.6035H30.3135L30.334 15.458C30.7487 14.7972 31.3366 14.4668 32.0977 14.4668C32.3438 14.4668 32.5306 14.4987 32.6582 14.5625V15.7383ZM36.7598 22.1367C35.7572 22.1367 34.9414 21.8086 34.3125 21.1523C33.6836 20.4915 33.3691 19.6097 33.3691 18.5068V18.2744C33.3691 17.5407 33.5081 16.8867 33.7861 16.3125C34.0687 15.7337 34.4606 15.2826 34.9619 14.959C35.4678 14.6309 36.0146 14.4668 36.6025 14.4668C37.5641 14.4668 38.3115 14.7835 38.8447 15.417C39.3779 16.0505 39.6445 16.9574 39.6445 18.1377V18.6641H34.6338C34.652 19.3932 34.8639 19.9834 35.2695 20.4346C35.6797 20.8812 36.1992 21.1045 36.8281 21.1045C37.2747 21.1045 37.653 21.0133 37.9629 20.8311C38.2728 20.6488 38.5439 20.4072 38.7764 20.1064L39.5488 20.708C38.929 21.6605 37.9993 22.1367 36.7598 22.1367ZM36.6025 15.5059C36.0921 15.5059 35.6637 15.6927 35.3174 16.0664C34.971 16.4355 34.7568 16.9551 34.6748 17.625H38.3799V17.5293C38.3434 16.8867 38.1702 16.39 37.8604 16.0391C37.5505 15.6836 37.1312 15.5059 36.6025 15.5059ZM42.3105 14.6035L42.3516 15.5332C42.9167 14.8223 43.6549 14.4668 44.5664 14.4668C46.1296 14.4668 46.918 15.3486 46.9316 17.1123V22H45.667V17.1055C45.6624 16.5723 45.5394 16.1781 45.2979 15.9229C45.0609 15.6676 44.6895 15.54 44.1836 15.54C43.7734 15.54 43.4134 15.6494 43.1035 15.8682C42.7936 16.0869 42.5521 16.374 42.3789 16.7295V22H41.1143V14.6035H42.3105ZM50.5547 12.8125V14.6035H51.9355V15.5811H50.5547V20.168C50.5547 20.4642 50.6162 20.6875 50.7393 20.8379C50.8623 20.9837 51.0719 21.0566 51.3682 21.0566C51.514 21.0566 51.7145 21.0293 51.9697 20.9746V22C51.637 22.0911 51.3135 22.1367 50.999 22.1367C50.4339 22.1367 50.0078 21.9658 49.7207 21.624C49.4336 21.2822 49.29 20.7969 49.29 20.168V15.5811H47.9434V14.6035H49.29V12.8125H50.5547Z", "fill", "#E6E9EB", "fill-opacity", "0.7"], ["id", "hiddenNav", 1, "navbar"], [1, "findElementsHide", 2, "float", "left", "margin-top", "8px"], [2, "top", "8px", "position", "relative", "float", "left"], ["class", "leftSide", "style", "padding-top: 7px; padding-left: 2px;", 4, "ngIf"], [1, "buttonGroupHIde"], [1, "rightSideHide"], ["matTooltip", "Toggle Notes", 3, "click", "mouseenter", "mouseleave", "className"], ["matTooltip", "Toggle Grid", 3, "click"], ["matTooltip", "Toggle Full Screen", 1, "button", 3, "click"], [1, "rightSideHide", 3, "mouseenter", "mouseleave"], ["matTooltip", "De-Magnify", 1, "button", 2, "z-index", "10000", 3, "click"], ["id", "zoomHide", "matTooltip", "Magnify To...", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["id", "labelToHIde", "for", "zoomHide", 1, "rightSideShow", "zoomValueDisplay"], ["width", "68", "height", "39", "rx", "4", "fill", "#497284", "fill-opacity", "0.09"], ["id", "zoomSelectOptionMenu", "class", "zoomSelectContainerHide ", 4, "ngIf"], ["id", "navigatorButton", "matTooltip", "Navigator", 3, "click", "mouseenter", "mouseleave"], ["class", "rightSideHide", 4, "ngIf"], [1, "rightSideHide", 2, "margin-right", "5px"], ["class", "button", "matTooltip", "WebSocket Servers Connections", 3, "click", 4, "ngIf"], ["matTooltip", "Pen Drawing (pen is required)", 1, "button", 3, "click"], ["class", "extensionsDiv", "style", "margin-left: 44px;", 4, "ngIf"], ["class", "button", "matTooltip", "Insert Template", "style", "margin-right: 5px;", 3, "click", 4, "ngIf"], ["class", "button", "style", "right: 95px; position: absolute; top: 50px;", 3, "click", 4, "ngIf"], ["class", "button", "style", "margin-right: 100px", 3, "matTooltip", "click", 4, "ngIf"], ["class", "button", "style", "margin-right: 100px", "matTooltip", "Quit DCM View", 3, "click", 4, "ngIf"], ["matTooltip", "Multi-Instances Model Selection", 2, "margin-right", "5px", 3, "click"], ["d", "M21.6029 24.75L25.5 18L29.3971 24.75H21.6029Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["x1", "25.5", "y1", "31", "x2", "25.5", "y2", "25", "stroke", "#5A6F8F"], ["x1", "14.5", "y1", "10", "x2", "14.5", "y2", "5", "stroke", "#5A6F8F"], ["x1", "25.5", "y1", "19", "x2", "25.5", "y2", "14", "stroke", "#5A6F8F"], ["x1", "14.5", "y1", "25", "x2", "14.5", "y2", "20", "stroke", "#5A6F8F"], ["cx", "25.5", "cy", "22.5", "r", "0.5", "fill", "#5A6F8F"], ["d", "M17.6029 22.75L21.5 16L25.3971 22.75H17.6029Z", "fill", "#E9ECEE", "stroke", "#5A6F8F"], ["x1", "21.5", "y1", "29", "x2", "21.5", "y2", "23", "stroke", "#5A6F8F"], ["x1", "21.5", "y1", "16", "x2", "21.5", "y2", "11", "stroke", "#5A6F8F"], ["cx", "21.5", "cy", "20.5", "r", "0.5", "fill", "#5A6F8F"], ["d", "M7.5191 20.8L14.5 9.34511L21.4809 20.8H7.5191Z", "fill", "#E9ECEE", "stroke", "#5A6F8F", "stroke-width", "1.4"], ["cx", "14.5", "cy", "16.5", "r", "1.5", "fill", "#5A6F8F"], ["style", "margin-right: 5px;", "matTooltip", "Disconnect Sub Model From Father Model", 3, "click", 4, "ngIf"], [1, "rightSideHide", 2, "margin-left", "3px"], ["matTooltip", "Bring Links Between Selected Entities", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Delete", 3, "click", 4, "ngIf"], ["class", "thingArrangeIcons", 4, "ngIf"], [1, "leftSide", 2, "padding-top", "7px", "padding-left", "2px"], ["class", "button", "id", "executionButton1", "matTooltip", "Async Execute", 3, "click", 4, "ngIf"], ["class", "button", "id", "pauseButton", "matTooltip", "Pause executing", 3, "click", 4, "ngIf"], ["id", "stopButton", "matTooltip", "Stop executing", 1, "button", 3, "click"], ["width", "15", "height", "15", "rx", "2", "transform", "matrix(-1 0 0 1 25 10)", "fill", "rgb(90, 111, 143)"], ["id", "simulation", "matTooltip", "Simulation", 1, "button", 3, "click"], ["class", "button", "matTooltip", "Download Excel file", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Don't Download Excel file", 3, "click", 4, "ngIf"], ["class", "numberOfRuns", "type", "number", "id", "numberOfRuns", "min", "1", "matTooltip", "Number Of Simulation Runs", 3, "value", "click", "keyup", 4, "ngIf"], ["class", "downloadEvery", "type", "number", "id", "downloadEvery", "value", "1", "min", "1", "matTooltip", "Download CSV File After This Number Of Runs", 3, "click", "keyup", 4, "ngIf"], ["class", "button", "id", "executionButton2", "matTooltip", "Sync Execute", 3, "click", 4, "ngIf"], ["class", "button", "matTooltip", "Execute according to the selected model instances", 3, "click", 4, "ngIf"], ["class", "xlxs-upload", "matTooltip", "Import Values From Excel File", 4, "ngIf"], ["matTooltip", "Execution Run Settings", 1, "button"], ["class", "executionDiv", "style", "position: absolute; right: -250px;", 4, "ngIf"], ["id", "executionButton1", "matTooltip", "Async Execute", 1, "button", 3, "click"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M26.3363 17.5538C27.2212 17.9935 27.2212 19.0766 26.3363 19.514L13.3014 25.9677C12.7256 26.2532 12 25.9009 12 25.3355V11.7335C12 11.1681 12.7256 10.8157 13.3014 11.1012L26.3363 17.5538Z", "fill", "rgb(90, 111, 143)"], ["id", "pauseButton", "matTooltip", "Pause executing", 1, "button", 3, "click"], ["width", "35", "height", "35", "viewBox", "0 0 35 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "15", "height", "6", "rx", "1", "transform", "matrix(0 -1 -1 0 25 24)", "fill", "#5A6F8F"], ["width", "15", "height", "6", "rx", "1", "transform", "matrix(0 -1 -1 0 16 24)", "fill", "#5A6F8F"], ["width", "35", "height", "35", "rx", "6", "transform", "matrix(-1 0 0 1 35 0)", "fill", "#497284", "fill-opacity", "0.09"], ["matTooltip", "Download Excel file", 1, "button", 3, "click"], ["d", "M18.9221 28.3354C18.7257 28.6447 18.2743 28.6447 18.0779 28.3354L14.2246 22.2681C14.0132 21.9352 14.2524 21.5 14.6467 21.5L22.3533 21.5C22.7476 21.5 22.9868 21.9352 22.7754 22.2681L18.9221 28.3354Z", "fill", "white"], ["x", "19.8909", "y", "24.9968", "width", "3", "height", "8", "rx", "0.5", "transform", "rotate(180 19.8909 24.9968)", "fill", "white"], ["d", "M7.03461 9.00977L8.99652 6.03613H10.5004L7.80023 9.9873L10.5961 14H9.09223L7.04828 10.9717L5.02484 14H3.52094L6.29633 9.9873L3.58246 6.03613H5.07953L7.03461 9.00977ZM13.2534 12.9678H17.2456V14H11.9888V6.03613H13.2534V12.9678ZM23.2251 11.9629C23.2251 11.5983 23.0861 11.3158 22.8081 11.1152C22.5347 10.9147 22.063 10.7301 21.3931 10.5615C20.7232 10.3929 20.1922 10.2106 19.8003 10.0146C18.9116 9.56803 18.4673 8.93685 18.4673 8.12109C18.4673 7.4694 18.743 6.94076 19.2945 6.53516C19.8504 6.12956 20.5637 5.92676 21.4341 5.92676C22.3273 5.92676 23.0565 6.15462 23.6216 6.61035C24.1913 7.06608 24.4761 7.64941 24.4761 8.36035H23.2114C23.2114 7.91374 23.0497 7.56966 22.7261 7.32812C22.4071 7.08203 21.9719 6.95898 21.4204 6.95898C20.9055 6.95898 20.4953 7.06152 20.19 7.2666C19.8846 7.46712 19.732 7.74967 19.732 8.11426C19.732 8.41048 19.871 8.65885 20.1489 8.85938C20.4315 9.0599 20.9282 9.2513 21.6392 9.43359C22.3501 9.61589 22.9061 9.82324 23.3071 10.0557C23.7082 10.2835 24.0067 10.5524 24.2027 10.8623C24.3986 11.1722 24.4966 11.5345 24.4966 11.9492C24.4966 12.6191 24.2186 13.1478 23.6626 13.5352C23.1112 13.918 22.382 14.1094 21.4751 14.1094C20.5318 14.1094 19.7479 13.8792 19.1236 13.4189C18.5038 12.9541 18.1939 12.3525 18.1939 11.6143H19.4654C19.4654 12.0791 19.6408 12.4414 19.9917 12.7012C20.3426 12.9609 20.8371 13.0908 21.4751 13.0908C22.0493 13.0908 22.4846 12.9883 22.7808 12.7832C23.077 12.5736 23.2251 12.3001 23.2251 11.9629ZM28.938 9.00977L30.9 6.03613H32.4039L29.7037 9.9873L32.4996 14H30.9957L28.9517 10.9717L26.9283 14H25.4244L28.1998 9.9873L25.4859 6.03613H26.983L28.938 9.00977Z", "fill", "white"], ["matTooltip", "Don't Download Excel file", 1, "button", 3, "click"], ["d", "M18.9221 28.3354C18.7257 28.6447 18.2743 28.6447 18.0779 28.3354L14.2246 22.2681C14.0132 21.9352 14.2524 21.5 14.6467 21.5L22.3533 21.5C22.7476 21.5 22.9868 21.9352 22.7754 22.2681L18.9221 28.3354Z", "fill", "#5A6F8F"], ["x", "19.8909", "y", "24.9968", "width", "3", "height", "8", "rx", "0.5", "transform", "rotate(180 19.8909 24.9968)", "fill", "#5A6F8F"], ["x", "14", "y", "32", "width", "2", "height", "9", "rx", "0.5", "transform", "rotate(-90 14 32)", "fill", "#5A6F8F"], ["d", "M7.03461 9.00977L8.99652 6.03613H10.5004L7.80023 9.9873L10.5961 14H9.09223L7.04828 10.9717L5.02484 14H3.52094L6.29633 9.9873L3.58246 6.03613H5.07953L7.03461 9.00977ZM13.2534 12.9678H17.2456V14H11.9888V6.03613H13.2534V12.9678ZM23.2251 11.9629C23.2251 11.5983 23.0861 11.3158 22.8081 11.1152C22.5347 10.9147 22.063 10.7301 21.3931 10.5615C20.7232 10.3929 20.1922 10.2106 19.8003 10.0146C18.9116 9.56803 18.4673 8.93685 18.4673 8.12109C18.4673 7.4694 18.743 6.94076 19.2945 6.53516C19.8504 6.12956 20.5637 5.92676 21.4341 5.92676C22.3273 5.92676 23.0565 6.15462 23.6216 6.61035C24.1913 7.06608 24.4761 7.64941 24.4761 8.36035H23.2114C23.2114 7.91374 23.0497 7.56966 22.7261 7.32812C22.4071 7.08203 21.9719 6.95898 21.4204 6.95898C20.9055 6.95898 20.4953 7.06152 20.19 7.2666C19.8846 7.46712 19.732 7.74967 19.732 8.11426C19.732 8.41048 19.871 8.65885 20.1489 8.85938C20.4315 9.0599 20.9282 9.2513 21.6392 9.43359C22.3501 9.61589 22.9061 9.82324 23.3071 10.0557C23.7082 10.2835 24.0067 10.5524 24.2027 10.8623C24.3986 11.1722 24.4966 11.5345 24.4966 11.9492C24.4966 12.6191 24.2186 13.1478 23.6626 13.5352C23.1112 13.918 22.382 14.1094 21.4751 14.1094C20.5318 14.1094 19.7479 13.8792 19.1236 13.4189C18.5038 12.9541 18.1939 12.3525 18.1939 11.6143H19.4654C19.4654 12.0791 19.6408 12.4414 19.9917 12.7012C20.3426 12.9609 20.8371 13.0908 21.4751 13.0908C22.0493 13.0908 22.4846 12.9883 22.7808 12.7832C23.077 12.5736 23.2251 12.3001 23.2251 11.9629ZM28.938 9.00977L30.9 6.03613H32.4039L29.7037 9.9873L32.4996 14H30.9957L28.9517 10.9717L26.9283 14H25.4244L28.1998 9.9873L25.4859 6.03613H26.983L28.938 9.00977Z", "fill", "#5A6F8F"], ["type", "number", "id", "numberOfRuns", "min", "1", "matTooltip", "Number Of Simulation Runs", 1, "numberOfRuns", 3, "click", "keyup", "value"], ["type", "number", "id", "downloadEvery", "value", "1", "min", "1", "matTooltip", "Download CSV File After This Number Of Runs", 1, "downloadEvery", 3, "click", "keyup"], ["id", "executionButton2", "matTooltip", "Sync Execute", 1, "button", 3, "click"], ["d", "M14.8599 14.2752C14.7337 14.4376 14.4854 14.4278 14.3723 14.2561L11.156 9.36817C11.0218 9.16422 11.1744 8.89392 11.4183 8.9035L18.2243 9.1706C18.4682 9.18017 18.5992 9.4616 18.4494 9.65441L14.8599 14.2752Z", "fill", "#5A6F8F"], ["d", "M5.47742 5.05897C5.62512 4.91595 5.86967 4.96052 5.95741 5.14646L8.45459 10.438C8.55879 10.6588 8.36968 10.905 8.12949 10.8612L1.42873 9.63986C1.18855 9.59608 1.09845 9.29903 1.27384 9.1292L5.47742 5.05897Z", "fill", "#5A6F8F"], ["d", "M11.4502 14.1602V14.1602C7.46602 16.597 2.75174 12.3606 4.75042 8.1396L5.3224 6.93166", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M7.46415 4.90862V4.90862C11.4483 2.47183 16.1626 6.7082 14.1639 10.9292L13.5919 12.1371", "stroke", "#5A6F8F", "stroke-width", "1.5"], ["d", "M31 23L16.75 31.6603V14.3397L31 23Z", "fill", "#5A6F8F"], ["matTooltip", "Execute according to the selected model instances", 1, "button", 3, "click"], ["d", "M18.0718 24L25 12L31.9282 24H18.0718Z", "stroke", "white", "stroke-width", "2"], ["cx", "25", "cy", "20", "r", "1.5", "fill", "white", "stroke", "white"], ["d", "M18 18.5L5.25 25.8612L5.25 11.1388L18 18.5Z", "fill", "white"], ["d", "M18.0718 24L25 12L31.9282 24H18.0718Z", "stroke", "#5A6F8F", "stroke-width", "2"], ["cx", "25", "cy", "20", "r", "1.5", "fill", "#5A6F8F", "stroke", "#5A6F8F"], ["d", "M18 18.5L5.25 25.8612L5.25 11.1388L18 18.5Z", "fill", "#5A6F8F"], ["matTooltip", "Import Values From Excel File", 1, "xlxs-upload"], ["for", "file-input"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink", 4, "ngIf"], ["id", "file-input", "type", "file", "accept", ".xlsx", 3, "change"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink"], ["x", "5.5", "y", "10.5", "width", "25", "height", "14", "stroke", "#5A6F8F"], ["x1", "11.5", "y1", "10", "x2", "11.5", "y2", "25", "stroke", "#5A6F8F"], ["x1", "30", "y1", "14.5", "x2", "5", "y2", "14.5", "stroke", "#5A6F8F"], ["x1", "30", "y1", "18.5", "x2", "5", "y2", "18.5", "stroke", "#5A6F8F"], ["x1", "23.5", "y1", "10", "x2", "23.5", "y2", "25", "stroke", "#5A6F8F"], ["x1", "17.5", "y1", "10", "x2", "17.5", "y2", "25", "stroke", "#5A6F8F"], ["x", "5.5", "y", "10.5", "width", "25", "height", "14", "stroke", "white"], ["x1", "11.5", "y1", "10", "x2", "11.5", "y2", "25", "stroke", "white"], ["x1", "30", "y1", "14.5", "x2", "5", "y2", "14.5", "stroke", "white"], ["x1", "30", "y1", "18.5", "x2", "5", "y2", "18.5", "stroke", "white"], ["x1", "23.5", "y1", "10", "x2", "23.5", "y2", "25", "stroke", "white"], ["x1", "17.5", "y1", "10", "x2", "17.5", "y2", "25", "stroke", "white"], ["fill-opacity", "0.09", "fill", "#497284", "d", "m0,4c0,-2.209 1.79,-4 4,-4l28,0c2.21,0 4,1.791 4,4l0,27c0,2.209 -1.79,4 -4,4l-28,0c-2.21,0 -4,-1.791 -4,-4l0,-27z"], ["fill", "#5A6F8F", "d", "m10.95184,14.33239c0.46701,-0.19986 0.99919,-0.17882 1.42276,0.10519l0.31496,0.21038c0.18463,0.10519 0.43443,0.07363 0.57562,-0.08415l0.79283,-0.85203c0.16291,-0.17882 0.19549,-0.42076 0.08689,-0.62061l-0.18463,-0.35764c-0.26066,-0.44179 -0.29324,-1.00981 -0.09775,-1.52524c0,0 0,0 0,-0.03156c0.18463,-0.51542 0.57562,-0.87307 1.07521,-0.98877l0.38013,-0.07363c0.19549,-0.07363 0.36926,-0.26297 0.36926,-0.51542l0,-1.22019c0,-0.23142 -0.16291,-0.46283 -0.36926,-0.51542l-0.38013,-0.08415c-0.47787,-0.13675 -0.89058,-0.51542 -1.07521,-0.98877c0,0 0,0 0,-0.02104c-0.19549,-0.51542 -0.16291,-1.08344 0.09775,-1.54627l0.18463,-0.3366c0.11947,-0.19986 0.08689,-0.46283 -0.08689,-0.62061l-0.79283,-0.85203c-0.15205,-0.17882 -0.40185,-0.19986 -0.57562,-0.08415l-0.31496,0.19986c-0.43443,0.28401 -0.96661,0.31557 -1.42276,0.12623c0,0 0,0 -0.03258,0c-0.44529,-0.23142 -0.79283,-0.65217 -0.92316,-1.20967l-0.08689,-0.3892c-0.0543,-0.23142 -0.22808,-0.3892 -0.47787,-0.3892l-1.14038,0c-0.19549,0 -0.41271,0.15778 -0.46701,0.3892l-0.08689,0.3892c-0.13033,0.51542 -0.47787,0.97826 -0.92316,1.1676c0,0 0,0 -0.03258,0c-0.47787,0.19986 -1.01005,0.17882 -1.42276,-0.10519l-0.31496,-0.21038c-0.19549,-0.10519 -0.43443,-0.07363 -0.59734,0.08415l-0.79283,0.85203c-0.18463,0.17882 -0.19549,0.46283 -0.09775,0.65217l0.21721,0.3366c0.26066,0.46283 0.28238,1.03085 0.09775,1.54627c0,0 0,0 0,0.02104c-0.18463,0.51542 -0.57562,0.88359 -1.07521,0.98877l-0.38013,0.08415c-0.21721,0.05259 -0.36926,0.26297 -0.36926,0.51542l0,1.22019c0,0.21038 0.15205,0.44179 0.36926,0.51542l0.38013,0.07363c0.46701,0.13675 0.89058,0.51542 1.07521,0.98877c0,0 0,0 0,0.03156c0.18463,0.51542 0.16291,1.08344 -0.09775,1.52524l-0.18463,0.35764c-0.11947,0.19986 -0.08689,0.44179 0.06516,0.62061l0.79283,0.85203c0.16291,0.15778 0.40185,0.19986 0.59734,0.08415l0.31496,-0.21038c0.41271,-0.28401 0.94488,-0.30505 1.42276,-0.10519c0,0 0,0 0.03258,0c0.47787,0.19986 0.81455,0.62061 0.92316,1.1676l0.06516,0.3892c0.06516,0.23142 0.2498,0.3892 0.47787,0.3892l1.14038,0c0.21721,0 0.43443,-0.15778 0.47787,-0.3892l0.08689,-0.3892c0.13033,-0.51542 0.47787,-0.93618 0.94488,-1.1676c0,0 0,0 0,0l0.02172,0zm-2.0744,-1.8934c-1.7703,0 -3.21478,-1.54627 -3.21478,-3.43967s1.44448,-3.46071 3.21478,-3.46071c1.7703,0 3.20392,1.54627 3.20392,3.43967s-1.45534,3.46071 -3.20392,3.46071z"], ["fill", "#5A6F8F", "d", "m16.47225,20.67892l-0.31,-0.08c-0.38,-0.1 -0.7,-0.4 -0.85,-0.81c0,0 0,0 0,0c-0.14,-0.4 -0.12,-0.86 0.08,-1.23l0.15,-0.27c0.09,-0.17 0.06,-0.39 -0.05,-0.52l-0.64,-0.69c-0.12,-0.13 -0.32,-0.17 -0.47,-0.05l-0.24,0.15c-0.34,0.22 -0.75,0.27 -1.11,0.08c0,0 0,0 0,0c-0.37,-0.17 -0.64,-0.51 -0.73,-0.94l-0.08,-0.32c-0.05,-0.19 -0.2,-0.32 -0.37,-0.32l-0.9,0c-0.17,0 -0.32,0.13 -0.37,0.32l-0.08,0.32c-0.09,0.44 -0.37,0.78 -0.73,0.94c0,0 0,0 0,0c-0.37,0.17 -0.78,0.13 -1.11,-0.08l-0.24,-0.15c-0.15,-0.12 -0.35,-0.08 -0.47,0.05l-0.63,0.69c-0.12,0.13 -0.15,0.35 -0.06,0.52l0.15,0.27c0.2,0.37 0.24,0.83 0.08,1.23c0,0 0,0 0,0c-0.15,0.4 -0.47,0.71 -0.85,0.81l-0.29,0.08c-0.18,0.05 -0.31,0.22 -0.31,0.4l0,0.99c0,0.2 0.12,0.35 0.31,0.4l0.29,0.08c0.38,0.12 0.7,0.4 0.85,0.81c0,0 0,0 0,0c0.14,0.4 0.12,0.86 -0.08,1.25l-0.15,0.27c-0.09,0.15 -0.06,0.37 0.06,0.51l0.63,0.71c0.12,0.13 0.32,0.15 0.47,0.05l0.24,-0.17c0.34,-0.2 0.75,-0.27 1.11,-0.07c0,0 0,0 0,0c0.37,0.15 0.64,0.51 0.73,0.94l0.08,0.32c0.05,0.19 0.2,0.32 0.37,0.32l0.85,0c0.17,0 0.32,-0.13 0.37,-0.32l0.08,-0.32c0.09,-0.44 0.37,-0.79 0.73,-0.94c0,0 0,0 0,0c0.37,-0.17 0.78,-0.13 1.11,0.07l0.24,0.17c0.15,0.1 0.35,0.08 0.47,-0.05l0.63,-0.71c0.12,-0.13 0.15,-0.35 0.06,-0.51l-0.15,-0.27c-0.2,-0.39 -0.24,-0.84 -0.08,-1.25c0,0 0,0 0,0c0.15,-0.4 0.47,-0.69 0.85,-0.81l0.29,-0.08c0.18,-0.05 0.31,-0.2 0.31,-0.4l0,-0.99c0.05,-0.19 -0.08,-0.37 -0.24,-0.4zm-5.11,3.69c-1.39,0 -2.53,-1.26 -2.53,-2.8s1.14,-2.8 2.53,-2.8c1.39,0 2.55,1.26 2.55,2.8c0,1.57 -1.16,2.8 -2.55,2.8z"], ["fill", "#5A6F8F", "d", "m25.15206,10.4371l-0.26416,-0.05273c-0.35221,-0.08436 -0.63838,-0.36909 -0.77046,-0.70655c0,0 0,0 0,0c-0.13208,-0.36909 -0.12107,-0.75927 0.06604,-1.08618l0.13208,-0.25309c0.08805,-0.13709 0.05503,-0.33745 -0.05503,-0.464l-0.58335,-0.62218c-0.12107,-0.10545 -0.29718,-0.13709 -0.44026,-0.05273l-0.23114,0.13709c-0.31919,0.20036 -0.70442,0.232 -1.02361,0.08436c0,0 0,0 0,0c-0.35221,-0.13709 -0.58335,-0.464 -0.6714,-0.83309l-0.05503,-0.28473c-0.03302,-0.17927 -0.18711,-0.28473 -0.35221,-0.28473l-0.82549,0c-0.1651,0 -0.29718,0.10545 -0.35221,0.28473l-0.06604,0.28473c-0.06604,0.36909 -0.3412,0.696 -0.6714,0.83309c0,0 0,0 0,0c-0.3412,0.13709 -0.72644,0.10545 -1.01261,-0.08436l-0.25315,-0.13709c-0.13208,-0.08436 -0.31919,-0.05273 -0.41825,0.05273l-0.60536,0.62218c-0.09906,0.12655 -0.13208,0.31636 -0.05503,0.464l0.13208,0.25309c0.18711,0.33745 0.22013,0.74873 0.08805,1.08618c0,0 0,0 0,0c-0.13208,0.36909 -0.44026,0.62218 -0.77046,0.70655l-0.26416,0.05273c-0.1651,0.03164 -0.26416,0.20036 -0.26416,0.36909l0,0.88582c0,0.15818 0.09906,0.30582 0.26416,0.35855l0.26416,0.05273c0.3412,0.08436 0.63838,0.36909 0.77046,0.70655c0,0 0,0 0,0c0.13208,0.36909 0.09906,0.78036 -0.08805,1.08618l-0.13208,0.26364c-0.06604,0.13709 -0.05503,0.33745 0.05503,0.44291l0.60536,0.62218c0.09906,0.12655 0.28617,0.13709 0.41825,0.07382l0.25315,-0.13709c0.31919,-0.21091 0.69342,-0.232 1.01261,-0.08436c0,0 0,0 0,0c0.35221,0.13709 0.60536,0.44291 0.6714,0.82255l0.06604,0.28473c0.02201,0.17927 0.18711,0.28473 0.35221,0.28473l0.82549,0c0.1651,0 0.29718,-0.10545 0.35221,-0.28473l0.05503,-0.28473c0.08805,-0.35855 0.35221,-0.67491 0.6714,-0.82255c0,0 0,0 0,0c0.35221,-0.13709 0.72644,-0.12655 1.02361,0.08436l0.23114,0.13709c0.13208,0.07382 0.3412,0.05273 0.44026,-0.07382l0.58335,-0.62218c0.12107,-0.10545 0.13208,-0.30582 0.05503,-0.44291l-0.13208,-0.232c-0.18711,-0.33745 -0.19812,-0.74873 -0.06604,-1.08618c0,0 0,0 0,0c0.13208,-0.36909 0.41825,-0.62218 0.77046,-0.70655l0.26416,-0.05273c0.1651,-0.03164 0.26416,-0.20036 0.26416,-0.36909l0,-0.90691c0,-0.17927 -0.09906,-0.31636 -0.26416,-0.36909zm-4.65579,3.26909c-1.29878,0 -2.30038,-1.09673 -2.30038,-2.436s1.04563,-2.45709 2.30038,-2.45709s2.32239,1.09673 2.32239,2.45709s-1.04563,2.436 -2.32239,2.436z"], ["fill", "#5A6F8F", "d", "m33.63915,19.17316l-5.35835,-3.32656c-0.98166,-0.60944 -2.13666,0.27689 -2.13666,1.63963l0,6.28888c0,1.36275 1.155,2.24899 2.13666,1.63956l5.35835,-3.32658c0.96729,-0.60046 0.96729,-2.31437 0,-2.91493z"], ["fill", "#5A6F8F", "d", "m18.5,33l-3.8971,-3l7.7942,0l-3.8971,3z"], [1, "executionDiv", 2, "position", "absolute", "right", "-250px"], [2, "margin-left", "4px", "margin-right", "4px", "display", "flex", "flex-direction", "column", "align-items", "stretch"], [2, "border-radius", "5px", "display", "flex", "border", "1px solid #bbc4d0", "flex-direction", "column", "align-items", "flex-start", "padding", "5px", "width", "100%"], [2, "margin-bottom", "4px"], [1, "headLessCheckbox", 3, "ngModelChange", "ngModel"], [2, "margin-bottom", "8px"], ["matTooltip", "This option will reset each run to the current values when selected", 1, "headLessCheckbox", 3, "ngModelChange", "ngModel"], [2, "display", "flex", "align-items", "center", "justify-content", "space-between", "width", "100%", "margin-top", "2px", "color", "#1A3763"], [1, "textSimulationSettingsLabel", 2, "margin-right", "8px", "white-space", "nowrap"], ["min", "0.1", "max", "2", "step", "0.1", 2, "top", "-10px", "min-width", "120px", "width", "120px", "max-width", "120px", "margin-right", "8px"], ["id", "simulationSlider", "matSliderThumb", "", 3, "change", "value"], [1, "textSimulationSettingsLabel", 2, "white-space", "nowrap"], ["id", "path-2-inside-1_0_1", "fill", "white"], ["d", "M5 4H12V11H5V4Z"], ["d", "M12 11V12H13V11H12ZM11 4V11H13V4H11ZM12 10H5V12H12V10Z", "fill", "#5A6F8F", "mask", "url(#path-2-inside-1_0_1)"], ["id", "path-4-inside-2_0_1", "fill", "white"], ["d", "M25 4H32V11H25V4Z"], ["d", "M25 11H24V12H25V11ZM32 10H25V12H32V10ZM26 11V4H24V11H26Z", "fill", "#5A6F8F", "mask", "url(#path-4-inside-2_0_1)"], ["id", "path-6-inside-3_0_1", "fill", "white"], ["d", "M18 4H26V11H18V4Z"], ["d", "M26 11V12H27V11H26ZM18 11H17V12H18V11ZM25 4V11H27V4H25ZM26 10H18V12H26V10ZM19 11V4H17V11H19Z", "fill", "#5A6F8F", "mask", "url(#path-6-inside-3_0_1)"], ["id", "path-8-inside-4_0_1", "fill", "white"], ["d", "M11 4H19V11H11V4Z"], ["d", "M19 11V12H20V11H19ZM11 11H10V12H11V11ZM18 4V11H20V4H18ZM19 10H11V12H19V10ZM12 11V4H10V11H12Z", "fill", "#5A6F8F", "mask", "url(#path-8-inside-4_0_1)"], ["id", "path-10-inside-5_0_1", "fill", "white"], ["d", "M5 24H12V31H5V24Z"], ["d", "M12 24H13V23H12V24ZM5 25H12V23H5V25ZM11 24V31H13V24H11Z", "fill", "#5A6F8F", "mask", "url(#path-10-inside-5_0_1)"], ["id", "path-12-inside-6_0_1", "fill", "white"], ["d", "M25 24H32V31H25V24Z"], ["d", "M25 24V23H24V24H25ZM25 25H32V23H25V25ZM26 31V24H24V31H26Z", "fill", "#5A6F8F", "mask", "url(#path-12-inside-6_0_1)"], ["id", "path-14-inside-7_0_1", "fill", "white"], ["d", "M18 24H26V31H18V24Z"], ["d", "M18 24V23H17V24H18ZM26 24H27V23H26V24ZM18 25H26V23H18V25ZM25 24V31H27V24H25ZM19 31V24H17V31H19Z", "fill", "#5A6F8F", "mask", "url(#path-14-inside-7_0_1)"], ["id", "path-16-inside-8_0_1", "fill", "white"], ["d", "M11 24H19V31H11V24Z"], ["d", "M11 24V23H10V24H11ZM19 24H20V23H19V24ZM11 25H19V23H11V25ZM18 24V31H20V24H18ZM12 31V24H10V31H12Z", "fill", "#5A6F8F", "mask", "url(#path-16-inside-8_0_1)"], ["id", "path-18-inside-9_0_1", "fill", "white"], ["d", "M5 17H12V25H5V17Z"], ["d", "M12 17H13V16H12V17ZM12 25V26H13V25H12ZM5 18H12V16H5V18ZM11 17V25H13V17H11ZM12 24H5V26H12V24Z", "fill", "#5A6F8F", "mask", "url(#path-18-inside-9_0_1)"], ["id", "path-20-inside-10_0_1", "fill", "white"], ["d", "M25 17H32V25H25V17Z"], ["d", "M25 17V16H24V17H25ZM25 25H24V26H25V25ZM25 18H32V16H25V18ZM32 24H25V26H32V24ZM26 25V17H24V25H26Z", "fill", "#5A6F8F", "mask", "url(#path-20-inside-10_0_1)"], ["x", "18.5", "y", "17.5", "width", "7", "height", "7", "stroke", "#5A6F8F"], ["x", "11.5", "y", "17.5", "width", "7", "height", "7", "stroke", "#5A6F8F"], ["id", "path-24-inside-11_0_1", "fill", "white"], ["d", "M5 10H12V18H5V10Z"], ["d", "M12 10H13V9H12V10ZM12 18V19H13V18H12ZM5 11H12V9H5V11ZM11 10V18H13V10H11ZM12 17H5V19H12V17Z", "fill", "#5A6F8F", "mask", "url(#path-24-inside-11_0_1)"], ["id", "path-26-inside-12_0_1", "fill", "white"], ["d", "M25 10H32V18H25V10Z"], ["d", "M25 10V9H24V10H25ZM25 18H24V19H25V18ZM25 11H32V9H25V11ZM32 17H25V19H32V17ZM26 18V10H24V18H26Z", "fill", "#5A6F8F", "mask", "url(#path-26-inside-12_0_1)"], ["x", "18.5", "y", "10.5", "width", "7", "height", "7", "stroke", "#5A6F8F"], ["x", "11.5", "y", "10.5", "width", "7", "height", "7", "stroke", "#5A6F8F"], ["d", "M12 11V12H13V11H12ZM11 4V11H13V4H11ZM12 10H5V12H12V10Z", "fill", "white", "mask", "url(#path-2-inside-1_0_1)"], ["d", "M25 11H24V12H25V11ZM32 10H25V12H32V10ZM26 11V4H24V11H26Z", "fill", "white", "mask", "url(#path-4-inside-2_0_1)"], ["d", "M26 11V12H27V11H26ZM18 11H17V12H18V11ZM25 4V11H27V4H25ZM26 10H18V12H26V10ZM19 11V4H17V11H19Z", "fill", "white", "mask", "url(#path-6-inside-3_0_1)"], ["d", "M19 11V12H20V11H19ZM11 11H10V12H11V11ZM18 4V11H20V4H18ZM19 10H11V12H19V10ZM12 11V4H10V11H12Z", "fill", "white", "mask", "url(#path-8-inside-4_0_1)"], ["d", "M12 24H13V23H12V24ZM5 25H12V23H5V25ZM11 24V31H13V24H11Z", "fill", "white", "mask", "url(#path-10-inside-5_0_1)"], ["d", "M25 24V23H24V24H25ZM25 25H32V23H25V25ZM26 31V24H24V31H26Z", "fill", "white", "mask", "url(#path-12-inside-6_0_1)"], ["d", "M18 24V23H17V24H18ZM26 24H27V23H26V24ZM18 25H26V23H18V25ZM25 24V31H27V24H25ZM19 31V24H17V31H19Z", "fill", "white", "mask", "url(#path-14-inside-7_0_1)"], ["d", "M11 24V23H10V24H11ZM19 24H20V23H19V24ZM11 25H19V23H11V25ZM18 24V31H20V24H18ZM12 31V24H10V31H12Z", "fill", "white", "mask", "url(#path-16-inside-8_0_1)"], ["d", "M12 17H13V16H12V17ZM12 25V26H13V25H12ZM5 18H12V16H5V18ZM11 17V25H13V17H11ZM12 24H5V26H12V24Z", "fill", "white", "mask", "url(#path-18-inside-9_0_1)"], ["d", "M25 17V16H24V17H25ZM25 25H24V26H25V25ZM25 18H32V16H25V18ZM32 24H25V26H32V24ZM26 25V17H24V25H26Z", "fill", "white", "mask", "url(#path-20-inside-10_0_1)"], ["x", "18.5", "y", "17.5", "width", "7", "height", "7", "stroke", "white"], ["x", "11.5", "y", "17.5", "width", "7", "height", "7", "stroke", "white"], ["d", "M12 10H13V9H12V10ZM12 18V19H13V18H12ZM5 11H12V9H5V11ZM11 10V18H13V10H11ZM12 17H5V19H12V17Z", "fill", "white", "mask", "url(#path-24-inside-11_0_1)"], ["d", "M25 10V9H24V10H25ZM25 18H24V19H25V18ZM25 11H32V9H25V11ZM32 17H25V19H32V17ZM26 18V10H24V18H26Z", "fill", "white", "mask", "url(#path-26-inside-12_0_1)"], ["x", "18.5", "y", "10.5", "width", "7", "height", "7", "stroke", "white"], ["x", "11.5", "y", "10.5", "width", "7", "height", "7", "stroke", "white"], ["id", "zoomSelectOptionMenu", 1, "zoomSelectContainerHide"], ["cx", "18.1001", "cy", "17.5", "r", "12", "stroke", "white"], ["x1", "18.1001", "y1", "2", "x2", "18.1001", "y2", "8", "stroke", "white"], ["x1", "18.1001", "y1", "26", "x2", "18.1001", "y2", "32", "stroke", "white"], ["x1", "3", "y1", "17.5", "x2", "9", "y2", "17.5", "stroke", "white"], ["x1", "27", "y1", "17.5", "x2", "33", "y2", "17.5", "stroke", "white"], ["cx", "18.1001", "cy", "17.5", "r", "12", "stroke", "#5A6F8F"], ["x1", "18.1001", "y1", "2", "x2", "18.1001", "y2", "8", "stroke", "#5A6F8F"], ["x1", "18.1001", "y1", "26", "x2", "18.1001", "y2", "32", "stroke", "#5A6F8F"], ["x1", "3", "y1", "17.5", "x2", "9", "y2", "17.5", "stroke", "#5A6F8F"], ["x1", "27", "y1", "17.5", "x2", "33", "y2", "17.5", "stroke", "#5A6F8F"], ["id", "chatButton", 2, "margin-right", "5px", 3, "click", "mouseenter", "mouseleave", "matTooltip"], ["d", "M10 8.5H26C26.8284 8.5 27.5 9.17157 27.5 10V22.2162C27.5 23.0446 26.8284 23.7162 26 23.7162H12.7961C12.1571 23.7162 11.5423 23.9609 11.0781 24.4L8.5 26.8388V24.2162V10C8.5 9.17157 9.17157 8.5 10 8.5Z", "stroke", "#5A6F8F"], ["x1", "12", "y1", "12.5", "x2", "23", "y2", "12.5", "stroke", "#5A6F8F"], ["x1", "12", "y1", "20.5", "x2", "18", "y2", "20.5", "stroke", "#5A6F8F"], ["x1", "12", "y1", "16.5", "x2", "23", "y2", "16.5", "stroke", "#5A6F8F"], ["x", "16", "y", "33", "font-size", "10px", "font-weight", "bold", "fill", "#1A3763", 4, "ngIf"], ["x", "14", "y", "33", "font-size", "10px", "font-weight", "bold", "fill", "#1A3763", 4, "ngIf"], ["x", "16", "y", "33", "font-size", "10px", "font-weight", "bold", "fill", "#1A3763"], ["x", "14", "y", "33", "font-size", "10px", "font-weight", "bold", "fill", "#1A3763"], ["d", "M10 8.5H26C26.8284 8.5 27.5 9.17157 27.5 10V22.2162C27.5 23.0446 26.8284 23.7162 26 23.7162H12.7961C12.1571 23.7162 11.5423 23.9609 11.0781 24.4L8.5 26.8388V24.2162V10C8.5 9.17157 9.17157 8.5 10 8.5Z", "stroke", "white"], ["x1", "12", "y1", "12.5", "x2", "23", "y2", "12.5", "stroke", "white"], ["x1", "12", "y1", "20.5", "x2", "18", "y2", "20.5", "stroke", "white"], ["x1", "12", "y1", "16.5", "x2", "23", "y2", "16.5", "stroke", "white"], ["matTooltip", "WebSocket Servers Connections", 1, "button", 3, "click"], ["d", "M24.0413 21.9891H27.0206V14.0818L23.6639 10.3715L21.5572 12.7002L24.0413 15.446V21.9891ZM27.0285 23.64H22.6892H16.6361L14.152 20.8942L15.2054 19.7299L17.2571 21.9978H21.4785L17.32 17.3924L18.3813 16.2194L22.5398 20.816V16.1499L20.4959 13.8906L21.5414 12.735L16.3767 7H11.2827H6L8.9715 10.2846V10.2933H8.98723H15.1346L17.3122 12.7002L14.1284 16.2194L11.9509 13.8124V11.9442H8.9715V15.1767L14.1284 20.8768L12.0295 23.1969L15.3862 26.9072H20.4802H30L27.0285 23.64Z", "fill", "#5A6F8F"], ["d", "M17.5 32L13.6029 29H21.3971L17.5 32Z", "fill", "#5A6F8F"], ["d", "M17.5 29L21.3971 32H13.6029L17.5 29Z", "fill", "#5A6F8F"], [2, "position", "relative", "top", "4px", "left", "4px"], ["id", "pythonConnectionButton", 2, "margin-right", "5px", 3, "click", "matTooltip", "matTooltipClass"], ["id", "mysqlConnectionButton", 2, "margin-right", "5px", 3, "click", "matTooltip", "matTooltipClass"], ["id", "mqttConnectionButton", 2, "margin-right", "5px", 3, "click", "matTooltip", "matTooltipClass"], ["id", "rosConnectionButton", 2, "margin-right", "5px", 3, "click", "matTooltip", "matTooltipClass"], ["d", "M4.74609 7.97266H3.29688V7.05859H4.74609C4.97005 7.05859 5.15234 7.02214 5.29297 6.94922C5.43359 6.8737 5.53646 6.76953 5.60156 6.63672C5.66667 6.50391 5.69922 6.35417 5.69922 6.1875C5.69922 6.01823 5.66667 5.86068 5.60156 5.71484C5.53646 5.56901 5.43359 5.45182 5.29297 5.36328C5.15234 5.27474 4.97005 5.23047 4.74609 5.23047H3.70312V10H2.53125V4.3125H4.74609C5.19141 4.3125 5.57292 4.39323 5.89062 4.55469C6.21094 4.71354 6.45573 4.93359 6.625 5.21484C6.79427 5.49609 6.87891 5.81771 6.87891 6.17969C6.87891 6.54688 6.79427 6.86458 6.625 7.13281C6.45573 7.40104 6.21094 7.60807 5.89062 7.75391C5.57292 7.89974 5.19141 7.97266 4.74609 7.97266ZM8.46875 4.3125L9.65625 6.90625L10.8438 4.3125H12.1211L10.25 7.92969V10H9.0625V7.92969L7.1875 4.3125H8.46875ZM15.2539 4.3125V10H14.0859V4.3125H15.2539ZM17.0039 4.3125V5.23047H12.3633V4.3125H17.0039ZM21.4648 6.62891V7.54297H18.4961V6.62891H21.4648ZM18.8438 4.3125V10H17.6719V4.3125H18.8438ZM22.3008 4.3125V10H21.1328V4.3125H22.3008ZM27.9922 7.02344V7.29297C27.9922 7.72526 27.9336 8.11328 27.8164 8.45703C27.6992 8.80078 27.5339 9.09375 27.3203 9.33594C27.1068 9.57552 26.8516 9.75911 26.5547 9.88672C26.2604 10.0143 25.9336 10.0781 25.5742 10.0781C25.2174 10.0781 24.8906 10.0143 24.5938 9.88672C24.2995 9.75911 24.0443 9.57552 23.8281 9.33594C23.612 9.09375 23.444 8.80078 23.3242 8.45703C23.207 8.11328 23.1484 7.72526 23.1484 7.29297V7.02344C23.1484 6.58854 23.207 6.20052 23.3242 5.85938C23.4414 5.51562 23.6068 5.22266 23.8203 4.98047C24.0365 4.73828 24.2917 4.55339 24.5859 4.42578C24.8828 4.29818 25.2096 4.23438 25.5664 4.23438C25.9258 4.23438 26.2526 4.29818 26.5469 4.42578C26.8438 4.55339 27.099 4.73828 27.3125 4.98047C27.5286 5.22266 27.6953 5.51562 27.8125 5.85938C27.9323 6.20052 27.9922 6.58854 27.9922 7.02344ZM26.8086 7.29297V7.01562C26.8086 6.71354 26.7812 6.44792 26.7266 6.21875C26.6719 5.98958 26.5911 5.79688 26.4844 5.64062C26.3776 5.48438 26.2474 5.36719 26.0938 5.28906C25.9401 5.20833 25.7643 5.16797 25.5664 5.16797C25.3685 5.16797 25.1927 5.20833 25.0391 5.28906C24.888 5.36719 24.7591 5.48438 24.6523 5.64062C24.5482 5.79688 24.4688 5.98958 24.4141 6.21875C24.3594 6.44792 24.332 6.71354 24.332 7.01562V7.29297C24.332 7.59245 24.3594 7.85807 24.4141 8.08984C24.4688 8.31901 24.5495 8.51302 24.6562 8.67188C24.763 8.82812 24.8932 8.94661 25.0469 9.02734C25.2005 9.10807 25.3763 9.14844 25.5742 9.14844C25.7721 9.14844 25.9479 9.10807 26.1016 9.02734C26.2552 8.94661 26.3841 8.82812 26.4883 8.67188C26.5924 8.51302 26.6719 8.31901 26.7266 8.08984C26.7812 7.85807 26.8086 7.59245 26.8086 7.29297ZM33.4648 4.3125V10H32.293L30.0078 6.1875V10H28.8359V4.3125H30.0078L32.2969 8.12891V4.3125H33.4648Z", "fill", "white"], ["d", "M17.6755 12.0002C16.9514 12.0041 16.2599 12.0746 15.6514 12.1976C13.8591 12.5595 13.5337 13.3168 13.5337 14.7136V16.5582H17.7694V17.1731H13.5337H11.9441C10.7132 17.1731 9.63527 18.0185 9.29824 19.627C8.90931 21.4705 8.89196 22.6212 9.29824 24.5461C9.59935 25.979 10.3182 27 11.5493 27H13.0056V24.7885C13.0056 23.1911 14.2151 21.7817 15.6515 21.7817H19.8822C21.0599 21.7817 22 20.6737 22 19.3222V14.7136C22 13.4021 21.0316 12.4165 19.8822 12.1976C19.1546 12.0592 18.3995 11.9963 17.6755 12.0002ZM15.3849 13.4837C15.8225 13.4837 16.1797 13.8987 16.1797 14.4088C16.1797 14.9172 15.8223 15.3284 15.3849 15.3284C14.9458 15.3284 14.5901 14.9172 14.5901 14.4088C14.5901 13.8987 14.9458 13.4837 15.3849 13.4837Z", "fill", "white"], ["d", "M22.9761 17V19.275C22.9761 21.039 21.7425 22.5234 20.3356 22.5234H16.1135C14.957 22.5234 14 23.7233 14 25.1271V30.0059C14 31.3941 14.9961 32.2112 16.1135 32.6093C17.4516 33.0862 18.7345 33.1725 20.3356 32.6093C21.3997 32.2359 22.4491 31.4842 22.4491 30.0059V28.053H18.227V27.4024H22.449H24.5624C25.791 27.4024 26.2489 26.3638 26.676 24.8048C27.1173 23.1997 27.0986 21.6561 26.676 19.5976C26.3724 18.1153 25.7926 17 24.5624 17H22.9761ZM20.6016 29.3549C21.0398 29.3549 21.3948 29.7898 21.3948 30.328C21.3948 30.8682 21.0398 31.3076 20.6016 31.3076C20.165 31.3076 19.8085 30.8682 19.8085 30.328C19.8085 29.7898 20.1651 29.3549 20.6016 29.3549Z", "fill", "white"], ["d", "M4.74609 7.97266H3.29688V7.05859H4.74609C4.97005 7.05859 5.15234 7.02214 5.29297 6.94922C5.43359 6.8737 5.53646 6.76953 5.60156 6.63672C5.66667 6.50391 5.69922 6.35417 5.69922 6.1875C5.69922 6.01823 5.66667 5.86068 5.60156 5.71484C5.53646 5.56901 5.43359 5.45182 5.29297 5.36328C5.15234 5.27474 4.97005 5.23047 4.74609 5.23047H3.70312V10H2.53125V4.3125H4.74609C5.19141 4.3125 5.57292 4.39323 5.89062 4.55469C6.21094 4.71354 6.45573 4.93359 6.625 5.21484C6.79427 5.49609 6.87891 5.81771 6.87891 6.17969C6.87891 6.54688 6.79427 6.86458 6.625 7.13281C6.45573 7.40104 6.21094 7.60807 5.89062 7.75391C5.57292 7.89974 5.19141 7.97266 4.74609 7.97266ZM8.46875 4.3125L9.65625 6.90625L10.8438 4.3125H12.1211L10.25 7.92969V10H9.0625V7.92969L7.1875 4.3125H8.46875ZM15.2539 4.3125V10H14.0859V4.3125H15.2539ZM17.0039 4.3125V5.23047H12.3633V4.3125H17.0039ZM21.4648 6.62891V7.54297H18.4961V6.62891H21.4648ZM18.8438 4.3125V10H17.6719V4.3125H18.8438ZM22.3008 4.3125V10H21.1328V4.3125H22.3008ZM27.9922 7.02344V7.29297C27.9922 7.72526 27.9336 8.11328 27.8164 8.45703C27.6992 8.80078 27.5339 9.09375 27.3203 9.33594C27.1068 9.57552 26.8516 9.75911 26.5547 9.88672C26.2604 10.0143 25.9336 10.0781 25.5742 10.0781C25.2174 10.0781 24.8906 10.0143 24.5938 9.88672C24.2995 9.75911 24.0443 9.57552 23.8281 9.33594C23.612 9.09375 23.444 8.80078 23.3242 8.45703C23.207 8.11328 23.1484 7.72526 23.1484 7.29297V7.02344C23.1484 6.58854 23.207 6.20052 23.3242 5.85938C23.4414 5.51562 23.6068 5.22266 23.8203 4.98047C24.0365 4.73828 24.2917 4.55339 24.5859 4.42578C24.8828 4.29818 25.2096 4.23438 25.5664 4.23438C25.9258 4.23438 26.2526 4.29818 26.5469 4.42578C26.8438 4.55339 27.099 4.73828 27.3125 4.98047C27.5286 5.22266 27.6953 5.51562 27.8125 5.85938C27.9323 6.20052 27.9922 6.58854 27.9922 7.02344ZM26.8086 7.29297V7.01562C26.8086 6.71354 26.7812 6.44792 26.7266 6.21875C26.6719 5.98958 26.5911 5.79688 26.4844 5.64062C26.3776 5.48438 26.2474 5.36719 26.0938 5.28906C25.9401 5.20833 25.7643 5.16797 25.5664 5.16797C25.3685 5.16797 25.1927 5.20833 25.0391 5.28906C24.888 5.36719 24.7591 5.48438 24.6523 5.64062C24.5482 5.79688 24.4688 5.98958 24.4141 6.21875C24.3594 6.44792 24.332 6.71354 24.332 7.01562V7.29297C24.332 7.59245 24.3594 7.85807 24.4141 8.08984C24.4688 8.31901 24.5495 8.51302 24.6562 8.67188C24.763 8.82812 24.8932 8.94661 25.0469 9.02734C25.2005 9.10807 25.3763 9.14844 25.5742 9.14844C25.7721 9.14844 25.9479 9.10807 26.1016 9.02734C26.2552 8.94661 26.3841 8.82812 26.4883 8.67188C26.5924 8.51302 26.6719 8.31901 26.7266 8.08984C26.7812 7.85807 26.8086 7.59245 26.8086 7.29297ZM33.4648 4.3125V10H32.293L30.0078 6.1875V10H28.8359V4.3125H30.0078L32.2969 8.12891V4.3125H33.4648Z", "fill", "#5A6F8F"], ["d", "M17.6755 12.0002C16.9514 12.0041 16.2599 12.0746 15.6514 12.1976C13.8591 12.5595 13.5337 13.3168 13.5337 14.7136V16.5582H17.7694V17.1731H13.5337H11.9441C10.7132 17.1731 9.63527 18.0185 9.29824 19.627C8.90931 21.4705 8.89196 22.6212 9.29824 24.5461C9.59935 25.979 10.3182 27 11.5493 27H13.0056V24.7885C13.0056 23.1911 14.2151 21.7817 15.6515 21.7817H19.8822C21.0599 21.7817 22 20.6737 22 19.3222V14.7136C22 13.4021 21.0316 12.4165 19.8822 12.1976C19.1546 12.0592 18.3995 11.9963 17.6755 12.0002ZM15.3849 13.4837C15.8225 13.4837 16.1797 13.8987 16.1797 14.4088C16.1797 14.9172 15.8223 15.3284 15.3849 15.3284C14.9458 15.3284 14.5901 14.9172 14.5901 14.4088C14.5901 13.8987 14.9458 13.4837 15.3849 13.4837Z", "fill", "#5A6F8F"], ["d", "M22.9761 17V19.275C22.9761 21.039 21.7425 22.5234 20.3356 22.5234H16.1135C14.957 22.5234 14 23.7233 14 25.1271V30.0059C14 31.3941 14.9961 32.2112 16.1135 32.6093C17.4516 33.0862 18.7345 33.1725 20.3356 32.6093C21.3997 32.2359 22.4491 31.4842 22.4491 30.0059V28.053H18.227V27.4024H22.449H24.5624C25.791 27.4024 26.2489 26.3638 26.676 24.8048C27.1173 23.1997 27.0986 21.6561 26.676 19.5976C26.3724 18.1153 25.7926 17 24.5624 17H22.9761ZM20.6016 29.3549C21.0398 29.3549 21.3948 29.7898 21.3948 30.328C21.3948 30.8682 21.0398 31.3076 20.6016 31.3076C20.165 31.3076 19.8085 30.8682 19.8085 30.328C19.8085 29.7898 20.1651 29.3549 20.6016 29.3549Z", "fill", "#5A6F8F"], ["d", "M17.623 19.7676C17.623 19.6152 17.5996 19.4785 17.5527 19.3574C17.5098 19.2324 17.4277 19.1191 17.3066 19.0176C17.1855 18.9121 17.0156 18.8086 16.7969 18.707C16.5781 18.6055 16.2949 18.5 15.9473 18.3906C15.5605 18.2656 15.1934 18.125 14.8457 17.9688C14.502 17.8125 14.1973 17.6309 13.9316 17.4238C13.6699 17.2129 13.4629 16.9688 13.3105 16.6914C13.1621 16.4141 13.0879 16.0918 13.0879 15.7246C13.0879 15.3691 13.166 15.0469 13.3223 14.7578C13.4785 14.4648 13.6973 14.2148 13.9785 14.0078C14.2598 13.7969 14.5918 13.6348 14.9746 13.5215C15.3613 13.4082 15.7852 13.3516 16.2461 13.3516C16.875 13.3516 17.4238 13.4648 17.8926 13.6914C18.3613 13.918 18.7246 14.2285 18.9824 14.623C19.2441 15.0176 19.375 15.4688 19.375 15.9766H17.6289C17.6289 15.7266 17.5762 15.5078 17.4707 15.3203C17.3691 15.1289 17.2129 14.9785 17.002 14.8691C16.7949 14.7598 16.5332 14.7051 16.2168 14.7051C15.9121 14.7051 15.6582 14.752 15.4551 14.8457C15.252 14.9355 15.0996 15.0586 14.998 15.2148C14.8965 15.3672 14.8457 15.5391 14.8457 15.7305C14.8457 15.875 14.8809 16.0059 14.9512 16.123C15.0254 16.2402 15.1348 16.3496 15.2793 16.4512C15.4238 16.5527 15.6016 16.6484 15.8125 16.7383C16.0234 16.8281 16.2676 16.916 16.5449 17.002C17.0098 17.1426 17.418 17.3008 17.7695 17.4766C18.125 17.6523 18.4219 17.8496 18.6602 18.0684C18.8984 18.2871 19.0781 18.5352 19.1992 18.8125C19.3203 19.0898 19.3809 19.4043 19.3809 19.7559C19.3809 20.127 19.3086 20.459 19.1641 20.752C19.0195 21.0449 18.8105 21.293 18.5371 21.4961C18.2637 21.6992 17.9375 21.8535 17.5586 21.959C17.1797 22.0645 16.7559 22.1172 16.2871 22.1172C15.8652 22.1172 15.4492 22.0625 15.0391 21.9531C14.6289 21.8398 14.2559 21.6699 13.9199 21.4434C13.5879 21.2168 13.3223 20.9277 13.123 20.5762C12.9238 20.2246 12.8242 19.8086 12.8242 19.3281H14.5879C14.5879 19.5938 14.6289 19.8184 14.7109 20.002C14.793 20.1855 14.9082 20.334 15.0566 20.4473C15.209 20.5605 15.3887 20.6426 15.5957 20.6934C15.8066 20.7441 16.0371 20.7695 16.2871 20.7695C16.5918 20.7695 16.8418 20.7266 17.0371 20.6406C17.2363 20.5547 17.3828 20.4355 17.4766 20.2832C17.5742 20.1309 17.623 19.959 17.623 19.7676ZM25.2109 20.7344L27.5195 22.5625L26.4121 23.5234L24.1387 21.6953L25.2109 20.7344ZM27.5781 17.5352V17.9395C27.5781 18.5879 27.4902 19.1699 27.3145 19.6855C27.1426 20.2012 26.8945 20.6406 26.5703 21.0039C26.2461 21.3633 25.8633 21.6387 25.4219 21.8301C24.9805 22.0215 24.4902 22.1172 23.9512 22.1172C23.416 22.1172 22.9258 22.0215 22.4805 21.8301C22.0352 21.6387 21.6504 21.3633 21.3262 21.0039C21.002 20.6406 20.75 20.2012 20.5703 19.6855C20.3945 19.1699 20.3066 18.5879 20.3066 17.9395V17.5352C20.3066 16.8828 20.3945 16.3008 20.5703 15.7891C20.75 15.2734 21 14.834 21.3203 14.4707C21.6406 14.1074 22.0234 13.8301 22.4688 13.6387C22.9141 13.4473 23.4043 13.3516 23.9395 13.3516C24.4785 13.3516 24.9688 13.4473 25.4102 13.6387C25.8555 13.8301 26.2402 14.1074 26.5645 14.4707C26.8887 14.834 27.1387 15.2734 27.3145 15.7891C27.4902 16.3008 27.5781 16.8828 27.5781 17.5352ZM25.8027 17.9395V17.5234C25.8027 17.0703 25.7598 16.6719 25.6738 16.3281C25.5918 15.9844 25.4707 15.6953 25.3105 15.4609C25.1543 15.2266 24.9609 15.0508 24.7305 14.9336C24.5 14.8125 24.2363 14.752 23.9395 14.752C23.6426 14.752 23.3789 14.8125 23.1484 14.9336C22.918 15.0508 22.7246 15.2266 22.5684 15.4609C22.4121 15.6953 22.293 15.9844 22.2109 16.3281C22.1289 16.6719 22.0879 17.0703 22.0879 17.5234V17.9395C22.0879 18.3887 22.1289 18.7871 22.2109 19.1348C22.293 19.4785 22.4121 19.7695 22.5684 20.0078C22.7285 20.2422 22.9238 20.4199 23.1543 20.541C23.3887 20.6621 23.6543 20.7227 23.9512 20.7227C24.248 20.7227 24.5098 20.6621 24.7363 20.541C24.9668 20.4199 25.1602 20.2422 25.3164 20.0078C25.4766 19.7695 25.5977 19.4785 25.6797 19.1348C25.7617 18.7871 25.8027 18.3887 25.8027 17.9395ZM34.334 20.6289V22H30.0391V20.6289H34.334ZM30.6074 13.4688V22H28.8496V13.4688H30.6074Z", "fill", "white"], ["d", "M7.5 12C5.31815 12 3 12.8408 3 14.4V21.6C3 23.176 5.26351 24 7.5 24C9.73649 24 12 23.176 12 21.6V14.4C12 12.8408 9.68188 12 7.5 12ZM11.3572 21.6C11.3572 22.3568 9.77316 23.2 7.5 23.2C5.22684 23.2 3.64285 22.3568 3.64285 21.6V20.4784C4.48307 21.2128 6.02142 21.6 7.5 21.6C8.97859 21.6 10.5169 21.2128 11.3572 20.4784V21.6ZM11.3572 19.2C11.3572 19.868 9.88951 20.8 7.5 20.8C5.11049 20.8 3.64285 19.868 3.64285 19.2V18.0784C4.48307 18.8128 6.02142 19.2 7.5 19.2C8.97859 19.2 10.5169 18.8128 11.3572 18.0784V19.2ZM11.3572 16.8C11.3572 17.468 9.88951 18.4 7.5 18.4C5.11049 18.4 3.64285 17.468 3.64285 16.8V15.6784C4.48307 16.4128 6.02142 16.8 7.5 16.8C8.97859 16.8 10.5169 16.4128 11.3572 15.6784V16.8ZM7.5 16C5.11049 16 3.64285 15.068 3.64285 14.4C3.64285 13.732 5.11049 12.8 7.5 12.8C9.88951 12.8 11.3572 13.732 11.3572 14.4C11.3572 15.068 9.88951 16 7.5 16Z", "fill", "white"], ["d", "M17.623 19.7676C17.623 19.6152 17.5996 19.4785 17.5527 19.3574C17.5098 19.2324 17.4277 19.1191 17.3066 19.0176C17.1855 18.9121 17.0156 18.8086 16.7969 18.707C16.5781 18.6055 16.2949 18.5 15.9473 18.3906C15.5605 18.2656 15.1934 18.125 14.8457 17.9688C14.502 17.8125 14.1973 17.6309 13.9316 17.4238C13.6699 17.2129 13.4629 16.9688 13.3105 16.6914C13.1621 16.4141 13.0879 16.0918 13.0879 15.7246C13.0879 15.3691 13.166 15.0469 13.3223 14.7578C13.4785 14.4648 13.6973 14.2148 13.9785 14.0078C14.2598 13.7969 14.5918 13.6348 14.9746 13.5215C15.3613 13.4082 15.7852 13.3516 16.2461 13.3516C16.875 13.3516 17.4238 13.4648 17.8926 13.6914C18.3613 13.918 18.7246 14.2285 18.9824 14.623C19.2441 15.0176 19.375 15.4688 19.375 15.9766H17.6289C17.6289 15.7266 17.5762 15.5078 17.4707 15.3203C17.3691 15.1289 17.2129 14.9785 17.002 14.8691C16.7949 14.7598 16.5332 14.7051 16.2168 14.7051C15.9121 14.7051 15.6582 14.752 15.4551 14.8457C15.252 14.9355 15.0996 15.0586 14.998 15.2148C14.8965 15.3672 14.8457 15.5391 14.8457 15.7305C14.8457 15.875 14.8809 16.0059 14.9512 16.123C15.0254 16.2402 15.1348 16.3496 15.2793 16.4512C15.4238 16.5527 15.6016 16.6484 15.8125 16.7383C16.0234 16.8281 16.2676 16.916 16.5449 17.002C17.0098 17.1426 17.418 17.3008 17.7695 17.4766C18.125 17.6523 18.4219 17.8496 18.6602 18.0684C18.8984 18.2871 19.0781 18.5352 19.1992 18.8125C19.3203 19.0898 19.3809 19.4043 19.3809 19.7559C19.3809 20.127 19.3086 20.459 19.1641 20.752C19.0195 21.0449 18.8105 21.293 18.5371 21.4961C18.2637 21.6992 17.9375 21.8535 17.5586 21.959C17.1797 22.0645 16.7559 22.1172 16.2871 22.1172C15.8652 22.1172 15.4492 22.0625 15.0391 21.9531C14.6289 21.8398 14.2559 21.6699 13.9199 21.4434C13.5879 21.2168 13.3223 20.9277 13.123 20.5762C12.9238 20.2246 12.8242 19.8086 12.8242 19.3281H14.5879C14.5879 19.5938 14.6289 19.8184 14.7109 20.002C14.793 20.1855 14.9082 20.334 15.0566 20.4473C15.209 20.5605 15.3887 20.6426 15.5957 20.6934C15.8066 20.7441 16.0371 20.7695 16.2871 20.7695C16.5918 20.7695 16.8418 20.7266 17.0371 20.6406C17.2363 20.5547 17.3828 20.4355 17.4766 20.2832C17.5742 20.1309 17.623 19.959 17.623 19.7676ZM25.2109 20.7344L27.5195 22.5625L26.4121 23.5234L24.1387 21.6953L25.2109 20.7344ZM27.5781 17.5352V17.9395C27.5781 18.5879 27.4902 19.1699 27.3145 19.6855C27.1426 20.2012 26.8945 20.6406 26.5703 21.0039C26.2461 21.3633 25.8633 21.6387 25.4219 21.8301C24.9805 22.0215 24.4902 22.1172 23.9512 22.1172C23.416 22.1172 22.9258 22.0215 22.4805 21.8301C22.0352 21.6387 21.6504 21.3633 21.3262 21.0039C21.002 20.6406 20.75 20.2012 20.5703 19.6855C20.3945 19.1699 20.3066 18.5879 20.3066 17.9395V17.5352C20.3066 16.8828 20.3945 16.3008 20.5703 15.7891C20.75 15.2734 21 14.834 21.3203 14.4707C21.6406 14.1074 22.0234 13.8301 22.4688 13.6387C22.9141 13.4473 23.4043 13.3516 23.9395 13.3516C24.4785 13.3516 24.9688 13.4473 25.4102 13.6387C25.8555 13.8301 26.2402 14.1074 26.5645 14.4707C26.8887 14.834 27.1387 15.2734 27.3145 15.7891C27.4902 16.3008 27.5781 16.8828 27.5781 17.5352ZM25.8027 17.9395V17.5234C25.8027 17.0703 25.7598 16.6719 25.6738 16.3281C25.5918 15.9844 25.4707 15.6953 25.3105 15.4609C25.1543 15.2266 24.9609 15.0508 24.7305 14.9336C24.5 14.8125 24.2363 14.752 23.9395 14.752C23.6426 14.752 23.3789 14.8125 23.1484 14.9336C22.918 15.0508 22.7246 15.2266 22.5684 15.4609C22.4121 15.6953 22.293 15.9844 22.2109 16.3281C22.1289 16.6719 22.0879 17.0703 22.0879 17.5234V17.9395C22.0879 18.3887 22.1289 18.7871 22.2109 19.1348C22.293 19.4785 22.4121 19.7695 22.5684 20.0078C22.7285 20.2422 22.9238 20.4199 23.1543 20.541C23.3887 20.6621 23.6543 20.7227 23.9512 20.7227C24.248 20.7227 24.5098 20.6621 24.7363 20.541C24.9668 20.4199 25.1602 20.2422 25.3164 20.0078C25.4766 19.7695 25.5977 19.4785 25.6797 19.1348C25.7617 18.7871 25.8027 18.3887 25.8027 17.9395ZM34.334 20.6289V22H30.0391V20.6289H34.334ZM30.6074 13.4688V22H28.8496V13.4688H30.6074Z", "fill", "#5A6F8F"], ["d", "M7.5 12C5.31815 12 3 12.8408 3 14.4V21.6C3 23.176 5.26351 24 7.5 24C9.73649 24 12 23.176 12 21.6V14.4C12 12.8408 9.68188 12 7.5 12ZM11.3572 21.6C11.3572 22.3568 9.77316 23.2 7.5 23.2C5.22684 23.2 3.64285 22.3568 3.64285 21.6V20.4784C4.48307 21.2128 6.02142 21.6 7.5 21.6C8.97859 21.6 10.5169 21.2128 11.3572 20.4784V21.6ZM11.3572 19.2C11.3572 19.868 9.88951 20.8 7.5 20.8C5.11049 20.8 3.64285 19.868 3.64285 19.2V18.0784C4.48307 18.8128 6.02142 19.2 7.5 19.2C8.97859 19.2 10.5169 18.8128 11.3572 18.0784V19.2ZM11.3572 16.8C11.3572 17.468 9.88951 18.4 7.5 18.4C5.11049 18.4 3.64285 17.468 3.64285 16.8V15.6784C4.48307 16.4128 6.02142 16.8 7.5 16.8C8.97859 16.8 10.5169 16.4128 11.3572 15.6784V16.8ZM7.5 16C5.11049 16 3.64285 15.068 3.64285 14.4C3.64285 13.732 5.11049 12.8 7.5 12.8C9.88951 12.8 11.3572 13.732 11.3572 14.4C11.3572 15.068 9.88951 16 7.5 16Z", "fill", "#5A6F8F"], ["cx", "7", "cy", "24", "r", "2", "fill", "white"], ["cx", "22", "cy", "31", "r", "2", "fill", "white"], ["cx", "30", "cy", "26", "r", "2", "fill", "white"], ["cx", "16", "cy", "29", "r", "2", "fill", "white"], ["cx", "14.5", "cy", "10", "rx", "6.5", "ry", "7", "fill", "white"], ["cx", "10", "cy", "13.5", "rx", "4", "ry", "3.5", "fill", "white"], ["cx", "26", "cy", "13.5", "rx", "4", "ry", "3.5", "fill", "white"], ["cx", "22", "cy", "9.5", "rx", "4", "ry", "3.5", "fill", "white"], ["x", "10", "y", "11", "width", "16", "height", "6", "fill", "white"], ["x1", "16.5", "y1", "17", "x2", "16.5", "y2", "28", "stroke", "white"], ["x1", "8", "y1", "23.5", "x2", "16", "y2", "23.5", "stroke", "white"], ["x1", "16", "y1", "25.5", "x2", "30", "y2", "25.5", "stroke", "white"], ["x1", "21.5", "y1", "30", "x2", "21.5", "y2", "26", "stroke", "white"], ["d", "M11.0701 11.3789L12.2571 14.7305L13.4377 11.3789H14.6882V16H13.7329V14.7368L13.8281 12.5564L12.5808 16H11.927L10.6829 12.5596L10.7781 14.7368V16H9.82593V11.3789H11.0701ZM19.3093 13.7942C19.3093 14.2258 19.2395 14.6014 19.0999 14.9209C18.9602 15.2383 18.7666 15.4932 18.519 15.6858L19.2871 16.2888L18.6809 16.8252L17.697 16.0349C17.5849 16.054 17.4685 16.0635 17.3479 16.0635C16.9649 16.0635 16.6232 15.9714 16.3228 15.7874C16.0223 15.6033 15.7896 15.3409 15.6245 15.0002C15.4595 14.6575 15.3759 14.2639 15.3738 13.8196V13.5911C15.3738 13.1361 15.4552 12.7362 15.6182 12.3914C15.7832 12.0444 16.0149 11.7788 16.3132 11.5947C16.6137 11.4085 16.9565 11.3154 17.3416 11.3154C17.7266 11.3154 18.0684 11.4085 18.3667 11.5947C18.6672 11.7788 18.8988 12.0444 19.0618 12.3914C19.2268 12.7362 19.3093 13.1351 19.3093 13.5879V13.7942ZM18.3445 13.5847C18.3445 13.1002 18.2577 12.732 18.0842 12.4802C17.9107 12.2284 17.6632 12.1025 17.3416 12.1025C17.0221 12.1025 16.7756 12.2274 16.6021 12.4771C16.4285 12.7246 16.3407 13.0885 16.3386 13.5688V13.7942C16.3386 14.266 16.4254 14.6321 16.5989 14.8923C16.7724 15.1526 17.0221 15.2827 17.3479 15.2827C17.6674 15.2827 17.9128 15.1579 18.0842 14.9082C18.2556 14.6564 18.3424 14.2904 18.3445 13.8101V13.5847ZM23.3782 12.1501H21.9626V16H21.0105V12.1501H19.614V11.3789H23.3782V12.1501ZM27.4534 12.1501H26.0378V16H25.0857V12.1501H23.6892V11.3789H27.4534V12.1501Z", "fill", "#1A3763"], ["cx", "7", "cy", "24", "r", "2", "fill", "#5A6F8F"], ["cx", "22", "cy", "31", "r", "2", "fill", "#5A6F8F"], ["cx", "30", "cy", "26", "r", "2", "fill", "#5A6F8F"], ["cx", "16", "cy", "29", "r", "2", "fill", "#5A6F8F"], ["cx", "14.5", "cy", "10", "rx", "6.5", "ry", "7", "fill", "#5A6F8F"], ["cx", "10", "cy", "13.5", "rx", "4", "ry", "3.5", "fill", "#5A6F8F"], ["cx", "26", "cy", "13.5", "rx", "4", "ry", "3.5", "fill", "#5A6F8F"], ["cx", "22", "cy", "9.5", "rx", "4", "ry", "3.5", "fill", "#5A6F8F"], ["x", "10", "y", "11", "width", "16", "height", "6", "fill", "#5A6F8F"], ["x1", "16.5", "y1", "17", "x2", "16.5", "y2", "28", "stroke", "#5A6F8F"], ["x1", "8", "y1", "23.5", "x2", "16", "y2", "23.5", "stroke", "#5A6F8F"], ["x1", "16", "y1", "25.5", "x2", "30", "y2", "25.5", "stroke", "#5A6F8F"], ["x1", "21.5", "y1", "30", "x2", "21.5", "y2", "26", "stroke", "#5A6F8F"], ["d", "M11.0701 11.3789L12.2571 14.7305L13.4377 11.3789H14.6882V16H13.7329V14.7368L13.8281 12.5564L12.5808 16H11.927L10.6829 12.5596L10.7781 14.7368V16H9.82593V11.3789H11.0701ZM19.3093 13.7942C19.3093 14.2258 19.2395 14.6014 19.0999 14.9209C18.9602 15.2383 18.7666 15.4932 18.519 15.6858L19.2871 16.2888L18.6809 16.8252L17.697 16.0349C17.5849 16.054 17.4685 16.0635 17.3479 16.0635C16.9649 16.0635 16.6232 15.9714 16.3228 15.7874C16.0223 15.6033 15.7896 15.3409 15.6245 15.0002C15.4595 14.6575 15.3759 14.2639 15.3738 13.8196V13.5911C15.3738 13.1361 15.4552 12.7362 15.6182 12.3914C15.7832 12.0444 16.0149 11.7788 16.3132 11.5947C16.6137 11.4085 16.9565 11.3154 17.3416 11.3154C17.7266 11.3154 18.0684 11.4085 18.3667 11.5947C18.6672 11.7788 18.8988 12.0444 19.0618 12.3914C19.2268 12.7362 19.3093 13.1351 19.3093 13.5879V13.7942ZM18.3445 13.5847C18.3445 13.1002 18.2577 12.732 18.0842 12.4802C17.9107 12.2284 17.6632 12.1025 17.3416 12.1025C17.0221 12.1025 16.7756 12.2274 16.6021 12.4771C16.4285 12.7246 16.3407 13.0885 16.3386 13.5688V13.7942C16.3386 14.266 16.4254 14.6321 16.5989 14.8923C16.7724 15.1526 17.0221 15.2827 17.3479 15.2827C17.6674 15.2827 17.9128 15.1579 18.0842 14.9082C18.2556 14.6564 18.3424 14.2904 18.3445 13.8101V13.5847ZM23.3782 12.1501H21.9626V16H21.0105V12.1501H19.614V11.3789H23.3782V12.1501ZM27.4534 12.1501H26.0378V16H25.0857V12.1501H23.6892V11.3789H27.4534V12.1501Z", "fill", "#E9ECEE"], ["d", "M14.7539 18.877H13.3535V22H11.5957V13.4688H14.7656C15.7734 13.4688 16.5508 13.6934 17.0977 14.1426C17.6445 14.5918 17.918 15.2266 17.918 16.0469C17.918 16.6289 17.791 17.1152 17.5371 17.5059C17.2871 17.8926 16.9062 18.2012 16.3945 18.4316L18.2402 21.918V22H16.3535L14.7539 18.877ZM13.3535 17.4531H14.7715C15.2129 17.4531 15.5547 17.3418 15.7969 17.1191C16.0391 16.8926 16.1602 16.582 16.1602 16.1875C16.1602 15.7852 16.0449 15.4688 15.8145 15.2383C15.5879 15.0078 15.2383 14.8926 14.7656 14.8926H13.3535V17.4531ZM26.2676 17.9277C26.2676 18.7676 26.1191 19.5039 25.8223 20.1367C25.5254 20.7695 25.0996 21.2578 24.5449 21.6016C23.9941 21.9453 23.3613 22.1172 22.6465 22.1172C21.9395 22.1172 21.3086 21.9473 20.7539 21.6074C20.1992 21.2676 19.7695 20.7832 19.4648 20.1543C19.1602 19.5215 19.0059 18.7949 19.002 17.9746V17.5527C19.002 16.7129 19.1523 15.9746 19.4531 15.3379C19.7578 14.6973 20.1855 14.207 20.7363 13.8672C21.291 13.5234 21.9238 13.3516 22.6348 13.3516C23.3457 13.3516 23.9766 13.5234 24.5273 13.8672C25.082 14.207 25.5098 14.6973 25.8105 15.3379C26.1152 15.9746 26.2676 16.7109 26.2676 17.5469V17.9277ZM24.4863 17.541C24.4863 16.6465 24.3262 15.9668 24.0059 15.502C23.6855 15.0371 23.2285 14.8047 22.6348 14.8047C22.0449 14.8047 21.5898 15.0352 21.2695 15.4961C20.9492 15.9531 20.7871 16.625 20.7832 17.5117V17.9277C20.7832 18.7988 20.9434 19.4746 21.2637 19.9551C21.584 20.4355 22.0449 20.6758 22.6465 20.6758C23.2363 20.6758 23.6895 20.4453 24.0059 19.9844C24.3223 19.5195 24.4824 18.8438 24.4863 17.957V17.541ZM31.9688 19.7617C31.9688 19.4297 31.8516 19.1758 31.6172 19C31.3828 18.8203 30.9609 18.6328 30.3516 18.4375C29.7422 18.2383 29.2598 18.043 28.9043 17.8516C27.9355 17.3281 27.4512 16.623 27.4512 15.7363C27.4512 15.2754 27.5801 14.8652 27.8379 14.5059C28.0996 14.1426 28.4727 13.8594 28.957 13.6562C29.4453 13.4531 29.9922 13.3516 30.5977 13.3516C31.207 13.3516 31.75 13.4629 32.2266 13.6855C32.7031 13.9043 33.0723 14.2148 33.334 14.6172C33.5996 15.0195 33.7324 15.4766 33.7324 15.9883H31.9746C31.9746 15.5977 31.8516 15.2949 31.6055 15.0801C31.3594 14.8613 31.0137 14.752 30.5684 14.752C30.1387 14.752 29.8047 14.8438 29.5664 15.0273C29.3281 15.207 29.209 15.4453 29.209 15.7422C29.209 16.0195 29.3477 16.252 29.625 16.4395C29.9062 16.627 30.3184 16.8027 30.8613 16.9668C31.8613 17.2676 32.5898 17.6406 33.0469 18.0859C33.5039 18.5312 33.7324 19.0859 33.7324 19.75C33.7324 20.4883 33.4531 21.0684 32.8945 21.4902C32.3359 21.9082 31.584 22.1172 30.6387 22.1172C29.9824 22.1172 29.3848 21.998 28.8457 21.7598C28.3066 21.5176 27.8945 21.1875 27.6094 20.7695C27.3281 20.3516 27.1875 19.8672 27.1875 19.3164H28.9512C28.9512 20.2578 29.5137 20.7285 30.6387 20.7285C31.0566 20.7285 31.3828 20.6445 31.6172 20.4766C31.8516 20.3047 31.9688 20.0664 31.9688 19.7617Z", "fill", "#BBC3D0"], ["cx", "3", "cy", "14.3999", "r", "1", "fill", "#BBC3D0"], ["cx", "6", "cy", "14.3999", "r", "1", "fill", "#BBC3D0"], ["cx", "9", "cy", "14.3999", "r", "1", "fill", "#BBC3D0"], ["cx", "3", "cy", "17.7", "r", "1", "fill", "#BBC3D0"], ["cx", "6", "cy", "17.7", "r", "1", "fill", "#BBC3D0"], ["cx", "9", "cy", "17.7", "r", "1", "fill", "#BBC3D0"], ["cx", "3", "cy", "21", "r", "1", "fill", "#BBC3D0"], ["cx", "6", "cy", "21", "r", "1", "fill", "#BBC3D0"], ["cx", "9", "cy", "21", "r", "1", "fill", "#BBC3D0"], ["d", "M14.7539 18.877H13.3535V22H11.5957V13.4688H14.7656C15.7734 13.4688 16.5508 13.6934 17.0977 14.1426C17.6445 14.5918 17.918 15.2266 17.918 16.0469C17.918 16.6289 17.791 17.1152 17.5371 17.5059C17.2871 17.8926 16.9062 18.2012 16.3945 18.4316L18.2402 21.918V22H16.3535L14.7539 18.877ZM13.3535 17.4531H14.7715C15.2129 17.4531 15.5547 17.3418 15.7969 17.1191C16.0391 16.8926 16.1602 16.582 16.1602 16.1875C16.1602 15.7852 16.0449 15.4688 15.8145 15.2383C15.5879 15.0078 15.2383 14.8926 14.7656 14.8926H13.3535V17.4531ZM26.2676 17.9277C26.2676 18.7676 26.1191 19.5039 25.8223 20.1367C25.5254 20.7695 25.0996 21.2578 24.5449 21.6016C23.9941 21.9453 23.3613 22.1172 22.6465 22.1172C21.9395 22.1172 21.3086 21.9473 20.7539 21.6074C20.1992 21.2676 19.7695 20.7832 19.4648 20.1543C19.1602 19.5215 19.0059 18.7949 19.002 17.9746V17.5527C19.002 16.7129 19.1523 15.9746 19.4531 15.3379C19.7578 14.6973 20.1855 14.207 20.7363 13.8672C21.291 13.5234 21.9238 13.3516 22.6348 13.3516C23.3457 13.3516 23.9766 13.5234 24.5273 13.8672C25.082 14.207 25.5098 14.6973 25.8105 15.3379C26.1152 15.9746 26.2676 16.7109 26.2676 17.5469V17.9277ZM24.4863 17.541C24.4863 16.6465 24.3262 15.9668 24.0059 15.502C23.6855 15.0371 23.2285 14.8047 22.6348 14.8047C22.0449 14.8047 21.5898 15.0352 21.2695 15.4961C20.9492 15.9531 20.7871 16.625 20.7832 17.5117V17.9277C20.7832 18.7988 20.9434 19.4746 21.2637 19.9551C21.584 20.4355 22.0449 20.6758 22.6465 20.6758C23.2363 20.6758 23.6895 20.4453 24.0059 19.9844C24.3223 19.5195 24.4824 18.8438 24.4863 17.957V17.541ZM31.9688 19.7617C31.9688 19.4297 31.8516 19.1758 31.6172 19C31.3828 18.8203 30.9609 18.6328 30.3516 18.4375C29.7422 18.2383 29.2598 18.043 28.9043 17.8516C27.9355 17.3281 27.4512 16.623 27.4512 15.7363C27.4512 15.2754 27.5801 14.8652 27.8379 14.5059C28.0996 14.1426 28.4727 13.8594 28.957 13.6562C29.4453 13.4531 29.9922 13.3516 30.5977 13.3516C31.207 13.3516 31.75 13.4629 32.2266 13.6855C32.7031 13.9043 33.0723 14.2148 33.334 14.6172C33.5996 15.0195 33.7324 15.4766 33.7324 15.9883H31.9746C31.9746 15.5977 31.8516 15.2949 31.6055 15.0801C31.3594 14.8613 31.0137 14.752 30.5684 14.752C30.1387 14.752 29.8047 14.8438 29.5664 15.0273C29.3281 15.207 29.209 15.4453 29.209 15.7422C29.209 16.0195 29.3477 16.252 29.625 16.4395C29.9062 16.627 30.3184 16.8027 30.8613 16.9668C31.8613 17.2676 32.5898 17.6406 33.0469 18.0859C33.5039 18.5312 33.7324 19.0859 33.7324 19.75C33.7324 20.4883 33.4531 21.0684 32.8945 21.4902C32.3359 21.9082 31.584 22.1172 30.6387 22.1172C29.9824 22.1172 29.3848 21.998 28.8457 21.7598C28.3066 21.5176 27.8945 21.1875 27.6094 20.7695C27.3281 20.3516 27.1875 19.8672 27.1875 19.3164H28.9512C28.9512 20.2578 29.5137 20.7285 30.6387 20.7285C31.0566 20.7285 31.3828 20.6445 31.6172 20.4766C31.8516 20.3047 31.9688 20.0664 31.9688 19.7617Z", "fill", "#5A6F8F"], ["cx", "3", "cy", "14.3999", "r", "1", "fill", "#5A6F8F"], ["cx", "6", "cy", "14.3999", "r", "1", "fill", "#5A6F8F"], ["cx", "9", "cy", "14.3999", "r", "1", "fill", "#5A6F8F"], ["cx", "3", "cy", "17.7", "r", "1", "fill", "#5A6F8F"], ["cx", "6", "cy", "17.7", "r", "1", "fill", "#5A6F8F"], ["cx", "9", "cy", "17.7", "r", "1", "fill", "#5A6F8F"], ["cx", "3", "cy", "21", "r", "1", "fill", "#5A6F8F"], ["cx", "6", "cy", "21", "r", "1", "fill", "#5A6F8F"], ["cx", "9", "cy", "21", "r", "1", "fill", "#5A6F8F"], ["d", "M25.3058 7.51636C26.6242 7.2862 26.7599 7.77586 26.7331 8.91744L20.2346 15.5372C19.9701 14.8311 19.7138 14.4938 18.8074 14.1361L25.3058 7.51636Z", "fill", "white"], ["d", "M17.8025 15.1597C18.8161 15.24 19.0231 15.6571 19.2298 16.5608L15.3307 20.5326C14.6171 19.8321 14.6171 19.8321 13.9035 19.1315L17.8025 15.1597Z", "fill", "white"], ["d", "M13.2031 19.845L14.6304 21.246L11.8282 24.1005L9.7135 24.8272L10.401 22.6994L13.2031 19.845Z", "fill", "white"], ["d", "M9.11987 25.4112C9.36872 25.8329 9.8866 26.153 10.2991 26.3777C10.8243 26.6639 11.3445 26.8319 11.8892 27.039C12.3282 27.206 12.797 27.3114 13.2525 27.2425C13.6463 27.1829 14.0839 27.1819 14.453 27.0108C15.0241 26.7461 15.4432 26.3943 15.8804 25.9312C16.8162 24.9399 17.9895 24.0892 19.3487 24.2949C19.7705 24.3587 20.2931 24.5561 20.672 24.7499C20.9819 24.9084 21.3185 25.0019 21.6271 25.1681C22.006 25.3722 22.3567 25.6115 22.761 25.7644C23.5421 26.06 24.2262 26.5723 25.0073 26.8553C25.3639 26.9846 25.7922 27.0181 26.1199 27.1916", "stroke", "white", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x1", "22.3536", "y1", "8.35355", "x2", "18.3536", "y2", "12.3536", "stroke", "white"], ["x1", "22", "y1", "8.5", "x2", "25", "y2", "8.5", "stroke", "white"], ["d", "M25.3058 6.51636C26.6242 6.2862 26.7599 6.77586 26.7331 7.91744L20.2346 14.5372C19.9701 13.8311 19.7138 13.4938 18.8074 13.1361L25.3058 6.51636Z", "fill", "#5A6F8F"], ["d", "M17.8025 14.1597C18.8161 14.24 19.0231 14.6571 19.2298 15.5608L15.3307 19.5326C14.6171 18.8321 14.6171 18.8321 13.9035 18.1315L17.8025 14.1597Z", "fill", "#5A6F8F"], ["d", "M13.2031 18.845L14.6304 20.246L11.8282 23.1005L9.7135 23.8272L10.401 21.6994L13.2031 18.845Z", "fill", "#5A6F8F"], ["d", "M9.11987 24.4112C9.36872 24.8329 9.8866 25.153 10.2991 25.3777C10.8243 25.6639 11.3445 25.8319 11.8892 26.039C12.3282 26.206 12.797 26.3114 13.2525 26.2425C13.6463 26.1829 14.0839 26.1819 14.453 26.0108C15.0241 25.7461 15.4432 25.3943 15.8804 24.9312C16.8162 23.9399 17.9895 23.0892 19.3487 23.2949C19.7705 23.3587 20.2931 23.5561 20.672 23.7499C20.9819 23.9084 21.3185 24.0019 21.6271 24.1681C22.006 24.3722 22.3567 24.6115 22.761 24.7644C23.5421 25.06 24.2262 25.5723 25.0073 25.8553C25.3639 25.9846 25.7922 26.0181 26.1199 26.1916", "stroke", "#5A6F8F", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x1", "22.3536", "y1", "7.35355", "x2", "18.3536", "y2", "11.3536", "stroke", "#5A6F8F"], ["x1", "22", "y1", "7.5", "x2", "25", "y2", "7.5", "stroke", "#5A6F8F"], ["matTooltip", "Toggle All Model Requirements", 1, "button", 3, "click", "mouseenter", "mouseleave"], [1, "extensionsDiv", 2, "margin-left", "44px"], ["matTooltip", "Insert Template", 1, "button", 2, "margin-right", "5px", 3, "click"], ["d", "M19.273 25.5905H15.3768L13.7144 22.739C14.0261 22.4395 14.2338 22.08 14.3896 21.6787C14.5455 21.2833 14.6494 20.8459 14.6494 20.4086C14.6494 18.5276 13.1431 17 11.3249 17C9.50672 17 8 18.5276 8 20.4086C8 22.2896 9.50672 23.8113 11.3249 23.8113C11.5847 23.8113 11.8441 23.7753 12.0519 23.7094L13.7661 26.5969V30.1253C13.7661 30.3589 13.8183 30.5806 13.9741 30.7423C14.13 30.91 14.3378 31 14.4936 31H19.2208C19.4286 31 19.6367 30.91 19.7925 30.7423C19.9484 30.5806 20 30.3589 20 30.1253V26.4651C20 26.2375 19.9484 26.0098 19.7925 25.8481C19.6367 25.6863 19.4289 25.5905 19.273 25.5905ZM15.2729 29.2507V27.3457H18.4938V29.2507H15.2729ZM11.3249 18.911C12.26 18.911 12.9869 19.5879 12.9869 20.4146C12.9869 21.2413 12.2081 21.9122 11.3249 21.9122C10.3899 21.9122 9.66247 21.2353 9.66247 20.4146C9.66247 19.5879 10.3899 18.899 11.3249 18.899V18.911Z", "fill", "#5A6F8F"], ["d", "M26.273 12.5905H22.3768L20.7144 9.739C21.0261 9.43947 21.2338 9.08003 21.3896 8.67866C21.5455 8.28328 21.6494 7.8459 21.6494 7.40859C21.6494 5.52756 20.1431 4 18.3249 4C16.5067 4 15 5.52756 15 7.40859C15 9.28963 16.5067 10.8113 18.3249 10.8113C18.5847 10.8113 18.8441 10.7753 19.0519 10.7094L20.7661 13.5969V17.1253C20.7661 17.3589 20.8183 17.5806 20.9741 17.7423C21.13 17.91 21.3378 18 21.4936 18H26.2208C26.4286 18 26.6367 17.91 26.7925 17.7423C26.9484 17.5806 27 17.3589 27 17.1253V13.4651C27 13.2375 26.9484 13.0098 26.7925 12.8481C26.6367 12.6863 26.4289 12.5905 26.273 12.5905ZM22.2729 16.2507V14.3457H25.4938V16.2507H22.2729ZM18.3249 5.91095C19.26 5.91095 19.9869 6.58789 19.9869 7.41459C19.9869 8.24128 19.2081 8.91223 18.3249 8.91223C17.3899 8.91223 16.6625 8.23529 16.6625 7.41459C16.6625 6.58789 17.3899 5.89896 18.3249 5.89896V5.91095Z", "fill", "#5A6F8F"], ["d", "M22.273 18.5905H18.3768L16.7144 15.739C17.0261 15.4395 17.2338 15.08 17.3896 14.6787C17.5455 14.2833 17.6494 13.8459 17.6494 13.4086C17.6494 11.5276 16.1431 10 14.3249 10C12.5067 10 11 11.5276 11 13.4086C11 15.2896 12.5067 16.8113 14.3249 16.8113C14.5847 16.8113 14.8441 16.7753 15.0519 16.7094L16.7661 19.5969V23.1253C16.7661 23.3589 16.8183 23.5806 16.9741 23.7423C17.13 23.91 17.3378 24 17.4936 24H22.2208C22.4286 24 22.6367 23.91 22.7925 23.7423C22.9484 23.5806 23 23.3589 23 23.1253V19.4651C23 19.2375 22.9484 19.0098 22.7925 18.8481C22.6367 18.6863 22.4289 18.5905 22.273 18.5905ZM18.2729 22.2507V20.3457H21.4938V22.2507H18.2729ZM14.3249 11.911C15.26 11.911 15.9869 12.5879 15.9869 13.4146C15.9869 14.2413 15.2081 14.9122 14.3249 14.9122C13.3899 14.9122 12.6625 14.2353 12.6625 13.4146C12.6625 12.5879 13.3899 11.899 14.3249 11.899V11.911Z", "fill", "#5A6F8F"], [1, "button", 2, "right", "95px", "position", "absolute", "top", "50px", 3, "click"], ["width", "142", "height", "36", "viewBox", "0 0 142 36", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["x", "0.5", "y", "0.5", "width", "141", "height", "35", "rx", "4.5", "fill", "#497284", "fill-opacity", "0.09", "stroke", "#5A6F8F"], ["d", "M14.6562 18.9277C14.6562 19.7246 14.5273 20.418 14.2695 21.0078C14.0117 21.5938 13.6543 22.0645 13.1973 22.4199L14.6152 23.5332L13.4961 24.5234L11.6797 23.0645C11.4727 23.0996 11.2578 23.1172 11.0352 23.1172C10.3281 23.1172 9.69727 22.9473 9.14258 22.6074C8.58789 22.2676 8.1582 21.7832 7.85352 21.1543C7.54883 20.5215 7.39453 19.7949 7.39062 18.9746V18.5527C7.39062 17.7129 7.54102 16.9746 7.8418 16.3379C8.14648 15.6973 8.57422 15.207 9.125 14.8672C9.67969 14.5234 10.3125 14.3516 11.0234 14.3516C11.7344 14.3516 12.3652 14.5234 12.916 14.8672C13.4707 15.207 13.8984 15.6973 14.1992 16.3379C14.5039 16.9746 14.6562 17.7109 14.6562 18.5469V18.9277ZM12.875 18.541C12.875 17.6465 12.7148 16.9668 12.3945 16.502C12.0742 16.0371 11.6172 15.8047 11.0234 15.8047C10.4336 15.8047 9.97852 16.0352 9.6582 16.4961C9.33789 16.9531 9.17578 17.625 9.17188 18.5117V18.9277C9.17188 19.7988 9.33203 20.4746 9.65234 20.9551C9.97266 21.4355 10.4336 21.6758 11.0352 21.6758C11.625 21.6758 12.0781 21.4453 12.3945 20.9844C12.7109 20.5195 12.8711 19.8438 12.875 18.957V18.541ZM19.6309 22.3555C19.2129 22.8633 18.6348 23.1172 17.8965 23.1172C17.2168 23.1172 16.6973 22.9219 16.3379 22.5312C15.9824 22.1406 15.8008 21.5684 15.793 20.8145V16.6602H17.4863V20.7559C17.4863 21.416 17.7871 21.7461 18.3887 21.7461C18.9629 21.7461 19.3574 21.5469 19.5723 21.1484V16.6602H21.2715V23H19.6777L19.6309 22.3555ZM24.3359 23H22.6367V16.6602H24.3359V23ZM22.5371 15.0195C22.5371 14.7656 22.6211 14.5566 22.7891 14.3926C22.9609 14.2285 23.1934 14.1465 23.4863 14.1465C23.7754 14.1465 24.0059 14.2285 24.1777 14.3926C24.3496 14.5566 24.4355 14.7656 24.4355 15.0195C24.4355 15.2773 24.3477 15.4883 24.1719 15.6523C24 15.8164 23.7715 15.8984 23.4863 15.8984C23.2012 15.8984 22.9707 15.8164 22.7949 15.6523C22.623 15.4883 22.5371 15.2773 22.5371 15.0195ZM27.7637 15.1016V16.6602H28.8477V17.9023H27.7637V21.0664C27.7637 21.3008 27.8086 21.4688 27.8984 21.5703C27.9883 21.6719 28.1602 21.7227 28.4141 21.7227C28.6016 21.7227 28.7676 21.709 28.9121 21.6816V22.9648C28.5801 23.0664 28.2383 23.1172 27.8867 23.1172C26.6992 23.1172 26.0938 22.5176 26.0703 21.3184V17.9023H25.1445V16.6602H26.0703V15.1016H27.7637ZM39.5879 20.1582C39.5215 21.0762 39.1816 21.7988 38.5684 22.3262C37.959 22.8535 37.1543 23.1172 36.1543 23.1172C35.0605 23.1172 34.1992 22.75 33.5703 22.0156C32.9453 21.2773 32.6328 20.2656 32.6328 18.9805V18.459C32.6328 17.6387 32.7773 16.916 33.0664 16.291C33.3555 15.666 33.7676 15.1875 34.3027 14.8555C34.8418 14.5195 35.4668 14.3516 36.1777 14.3516C37.1621 14.3516 37.9551 14.6152 38.5566 15.1426C39.1582 15.6699 39.5059 16.4102 39.5996 17.3633H37.8418C37.7988 16.8125 37.6445 16.4141 37.3789 16.168C37.1172 15.918 36.7168 15.793 36.1777 15.793C35.5918 15.793 35.1523 16.0039 34.8594 16.4258C34.5703 16.8438 34.4219 17.4941 34.4141 18.377V19.0215C34.4141 19.9434 34.5527 20.6172 34.8301 21.043C35.1113 21.4688 35.5527 21.6816 36.1543 21.6816C36.6973 21.6816 37.1016 21.5586 37.3672 21.3125C37.6367 21.0625 37.791 20.6777 37.8301 20.1582H39.5879ZM40.3672 19.7715C40.3672 19.1426 40.4883 18.582 40.7305 18.0898C40.9727 17.5977 41.3203 17.2168 41.7734 16.9473C42.2305 16.6777 42.7598 16.543 43.3613 16.543C44.2168 16.543 44.9141 16.8047 45.4531 17.3281C45.9961 17.8516 46.2988 18.5625 46.3613 19.4609L46.373 19.8945C46.373 20.8672 46.1016 21.6484 45.5586 22.2383C45.0156 22.8242 44.2871 23.1172 43.373 23.1172C42.459 23.1172 41.7285 22.8242 41.1816 22.2383C40.6387 21.6523 40.3672 20.8555 40.3672 19.8477V19.7715ZM42.0605 19.8945C42.0605 20.4961 42.1738 20.957 42.4004 21.2773C42.627 21.5938 42.9512 21.752 43.373 21.752C43.7832 21.752 44.1035 21.5957 44.334 21.2832C44.5645 20.9668 44.6797 20.4629 44.6797 19.7715C44.6797 19.1816 44.5645 18.7246 44.334 18.4004C44.1035 18.0762 43.7793 17.9141 43.3613 17.9141C42.9473 17.9141 42.627 18.0762 42.4004 18.4004C42.1738 18.7207 42.0605 19.2188 42.0605 19.8945ZM48.9746 16.6602L49.0273 17.3926C49.4805 16.8262 50.0879 16.543 50.8496 16.543C51.5215 16.543 52.0215 16.7402 52.3496 17.1348C52.6777 17.5293 52.8457 18.1191 52.8535 18.9043V23H51.1602V18.9453C51.1602 18.5859 51.082 18.3262 50.9258 18.166C50.7695 18.002 50.5098 17.9199 50.1465 17.9199C49.6699 17.9199 49.3125 18.123 49.0742 18.5293V23H47.3809V16.6602H48.9746ZM54.5527 23V17.9023H53.6094V16.6602H54.5527V16.3672C54.5605 15.5703 54.8047 14.957 55.2852 14.5273C55.7695 14.0938 56.4512 13.877 57.3301 13.877C57.8574 13.877 58.498 13.9922 59.252 14.2227L59.0059 15.623C58.623 15.5098 58.3262 15.4375 58.1152 15.4062C57.9043 15.3711 57.6777 15.3535 57.4355 15.3535C56.6465 15.3535 56.252 15.7031 56.252 16.4023V16.6602H57.5V17.9023H56.252V23H54.5527ZM60.043 23H58.3438V16.6602H60.043V23ZM61.1973 19.7832C61.1973 18.8105 61.4277 18.0273 61.8887 17.4336C62.3535 16.8398 62.9785 16.543 63.7637 16.543C64.459 16.543 65 16.7812 65.3867 17.2578L65.457 16.6602H66.9922V22.7891C66.9922 23.3438 66.8652 23.8262 66.6113 24.2363C66.3613 24.6465 66.0078 24.959 65.5508 25.1738C65.0938 25.3887 64.5586 25.4961 63.9453 25.4961C63.4805 25.4961 63.0273 25.4023 62.5859 25.2148C62.1445 25.0312 61.8105 24.793 61.584 24.5L62.334 23.4688C62.7559 23.9414 63.2676 24.1777 63.8691 24.1777C64.3184 24.1777 64.668 24.0566 64.918 23.8145C65.168 23.5762 65.293 23.2363 65.293 22.7949V22.4551C64.9023 22.8965 64.3887 23.1172 63.752 23.1172C62.9902 23.1172 62.373 22.8203 61.9004 22.2266C61.4316 21.6289 61.1973 20.8379 61.1973 19.8535V19.7832ZM62.8906 19.9062C62.8906 20.4805 63.0059 20.9316 63.2363 21.2598C63.4668 21.584 63.7832 21.7461 64.1855 21.7461C64.7012 21.7461 65.0703 21.5527 65.293 21.166V18.5C65.0664 18.1133 64.7012 17.9199 64.1973 17.9199C63.791 17.9199 63.4707 18.0859 63.2363 18.418C63.0059 18.75 62.8906 19.2461 62.8906 19.9062ZM72.0957 22.3555C71.6777 22.8633 71.0996 23.1172 70.3613 23.1172C69.6816 23.1172 69.1621 22.9219 68.8027 22.5312C68.4473 22.1406 68.2656 21.5684 68.2578 20.8145V16.6602H69.9512V20.7559C69.9512 21.416 70.252 21.7461 70.8535 21.7461C71.4277 21.7461 71.8223 21.5469 72.0371 21.1484V16.6602H73.7363V23H72.1426L72.0957 22.3555ZM78.5762 18.248C78.3457 18.2168 78.1426 18.2012 77.9668 18.2012C77.3262 18.2012 76.9062 18.418 76.707 18.8516V23H75.0137V16.6602H76.6133L76.6602 17.416C77 16.834 77.4707 16.543 78.0723 16.543C78.2598 16.543 78.4355 16.5684 78.5996 16.6191L78.5762 18.248ZM82.8945 23C82.8164 22.8477 82.7598 22.6582 82.7246 22.4316C82.3145 22.8887 81.7812 23.1172 81.125 23.1172C80.5039 23.1172 79.9883 22.9375 79.5781 22.5781C79.1719 22.2188 78.9688 21.7656 78.9688 21.2188C78.9688 20.5469 79.2168 20.0312 79.7129 19.6719C80.2129 19.3125 80.9336 19.1309 81.875 19.127H82.6543V18.7637C82.6543 18.4707 82.5781 18.2363 82.4258 18.0605C82.2773 17.8848 82.041 17.7969 81.7168 17.7969C81.4316 17.7969 81.207 17.8652 81.043 18.002C80.8828 18.1387 80.8027 18.3262 80.8027 18.5645H79.1094C79.1094 18.1973 79.2227 17.8574 79.4492 17.5449C79.6758 17.2324 79.9961 16.9883 80.4102 16.8125C80.8242 16.6328 81.2891 16.543 81.8047 16.543C82.5859 16.543 83.2051 16.7402 83.6621 17.1348C84.123 17.5254 84.3535 18.0762 84.3535 18.7871V21.5352C84.3574 22.1367 84.4414 22.5918 84.6055 22.9004V23H82.8945ZM81.4941 21.8223C81.7441 21.8223 81.9746 21.7676 82.1855 21.6582C82.3965 21.5449 82.5527 21.3945 82.6543 21.207V20.1172H82.0215C81.1738 20.1172 80.7227 20.4102 80.668 20.9961L80.6621 21.0957C80.6621 21.3066 80.7363 21.4805 80.8848 21.6172C81.0332 21.7539 81.2363 21.8223 81.4941 21.8223ZM87.6816 15.1016V16.6602H88.7656V17.9023H87.6816V21.0664C87.6816 21.3008 87.7266 21.4688 87.8164 21.5703C87.9062 21.6719 88.0781 21.7227 88.332 21.7227C88.5195 21.7227 88.6855 21.709 88.8301 21.6816V22.9648C88.498 23.0664 88.1562 23.1172 87.8047 23.1172C86.6172 23.1172 86.0117 22.5176 85.9883 21.3184V17.9023H85.0625V16.6602H85.9883V15.1016H87.6816ZM91.4961 23H89.7969V16.6602H91.4961V23ZM89.6973 15.0195C89.6973 14.7656 89.7812 14.5566 89.9492 14.3926C90.1211 14.2285 90.3535 14.1465 90.6465 14.1465C90.9355 14.1465 91.166 14.2285 91.3379 14.3926C91.5098 14.5566 91.5957 14.7656 91.5957 15.0195C91.5957 15.2773 91.5078 15.4883 91.332 15.6523C91.1602 15.8164 90.9316 15.8984 90.6465 15.8984C90.3613 15.8984 90.1309 15.8164 89.9551 15.6523C89.7832 15.4883 89.6973 15.2773 89.6973 15.0195ZM92.6328 19.7715C92.6328 19.1426 92.7539 18.582 92.9961 18.0898C93.2383 17.5977 93.5859 17.2168 94.0391 16.9473C94.4961 16.6777 95.0254 16.543 95.627 16.543C96.4824 16.543 97.1797 16.8047 97.7188 17.3281C98.2617 17.8516 98.5645 18.5625 98.627 19.4609L98.6387 19.8945C98.6387 20.8672 98.3672 21.6484 97.8242 22.2383C97.2812 22.8242 96.5527 23.1172 95.6387 23.1172C94.7246 23.1172 93.9941 22.8242 93.4473 22.2383C92.9043 21.6523 92.6328 20.8555 92.6328 19.8477V19.7715ZM94.3262 19.8945C94.3262 20.4961 94.4395 20.957 94.666 21.2773C94.8926 21.5938 95.2168 21.752 95.6387 21.752C96.0488 21.752 96.3691 21.5957 96.5996 21.2832C96.8301 20.9668 96.9453 20.4629 96.9453 19.7715C96.9453 19.1816 96.8301 18.7246 96.5996 18.4004C96.3691 18.0762 96.0449 17.9141 95.627 17.9141C95.2129 17.9141 94.8926 18.0762 94.666 18.4004C94.4395 18.7207 94.3262 19.2188 94.3262 19.8945ZM101.24 16.6602L101.293 17.3926C101.746 16.8262 102.354 16.543 103.115 16.543C103.787 16.543 104.287 16.7402 104.615 17.1348C104.943 17.5293 105.111 18.1191 105.119 18.9043V23H103.426V18.9453C103.426 18.5859 103.348 18.3262 103.191 18.166C103.035 18.002 102.775 17.9199 102.412 17.9199C101.936 17.9199 101.578 18.123 101.34 18.5293V23H99.6465V16.6602H101.24ZM112.66 20.8848L114.594 14.4688H116.551L113.58 23H111.746L108.787 14.4688H110.738L112.66 20.8848ZM119.035 23H117.336V16.6602H119.035V23ZM117.236 15.0195C117.236 14.7656 117.32 14.5566 117.488 14.3926C117.66 14.2285 117.893 14.1465 118.186 14.1465C118.475 14.1465 118.705 14.2285 118.877 14.3926C119.049 14.5566 119.135 14.7656 119.135 15.0195C119.135 15.2773 119.047 15.4883 118.871 15.6523C118.699 15.8164 118.471 15.8984 118.186 15.8984C117.9 15.8984 117.67 15.8164 117.494 15.6523C117.322 15.4883 117.236 15.2773 117.236 15.0195ZM123.354 23.1172C122.424 23.1172 121.666 22.832 121.08 22.2617C120.498 21.6914 120.207 20.9316 120.207 19.9824V19.8184C120.207 19.1816 120.33 18.6133 120.576 18.1133C120.822 17.6094 121.17 17.2227 121.619 16.9531C122.072 16.6797 122.588 16.543 123.166 16.543C124.033 16.543 124.715 16.8164 125.211 17.3633C125.711 17.9102 125.961 18.6855 125.961 19.6895V20.3809H121.924C121.979 20.7949 122.143 21.127 122.416 21.377C122.693 21.627 123.043 21.752 123.465 21.752C124.117 21.752 124.627 21.5156 124.994 21.043L125.826 21.9746C125.572 22.334 125.229 22.6152 124.795 22.8184C124.361 23.0176 123.881 23.1172 123.354 23.1172ZM123.16 17.9141C122.824 17.9141 122.551 18.0273 122.34 18.2539C122.133 18.4805 122 18.8047 121.941 19.2266H124.297V19.0918C124.289 18.7168 124.188 18.4277 123.992 18.2246C123.797 18.0176 123.52 17.9141 123.16 17.9141ZM132.441 20.6973L133.273 16.6602H134.908L133.291 23H131.873L130.672 19.0098L129.471 23H128.059L126.441 16.6602H128.076L128.902 20.6914L130.062 16.6602H131.287L132.441 20.6973Z", "fill", "#5A6F8F"], [1, "button", 2, "margin-right", "100px", 3, "click", "matTooltip"], ["width", "122", "height", "36", "viewBox", "0 0 122 36", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["x", "0.5", "y", "0.5", "width", "121", "height", "35", "rx", "4.5", "fill", "#497284", "fill-opacity", "0.09", "stroke", "#5A6F8F"], ["d", "M15.4727 18.9277C15.4727 19.7246 15.3438 20.418 15.0859 21.0078C14.8281 21.5938 14.4707 22.0645 14.0137 22.4199L15.4316 23.5332L14.3125 24.5234L12.4961 23.0645C12.2891 23.0996 12.0742 23.1172 11.8516 23.1172C11.1445 23.1172 10.5137 22.9473 9.95898 22.6074C9.4043 22.2676 8.97461 21.7832 8.66992 21.1543C8.36523 20.5215 8.21094 19.7949 8.20703 18.9746V18.5527C8.20703 17.7129 8.35742 16.9746 8.6582 16.3379C8.96289 15.6973 9.39062 15.207 9.94141 14.8672C10.4961 14.5234 11.1289 14.3516 11.8398 14.3516C12.5508 14.3516 13.1816 14.5234 13.7324 14.8672C14.2871 15.207 14.7148 15.6973 15.0156 16.3379C15.3203 16.9746 15.4727 17.7109 15.4727 18.5469V18.9277ZM13.6914 18.541C13.6914 17.6465 13.5312 16.9668 13.2109 16.502C12.8906 16.0371 12.4336 15.8047 11.8398 15.8047C11.25 15.8047 10.7949 16.0352 10.4746 16.4961C10.1543 16.9531 9.99219 17.625 9.98828 18.5117V18.9277C9.98828 19.7988 10.1484 20.4746 10.4688 20.9551C10.7891 21.4355 11.25 21.6758 11.8516 21.6758C12.4414 21.6758 12.8945 21.4453 13.2109 20.9844C13.5273 20.5195 13.6875 19.8438 13.6914 18.957V18.541ZM20.4473 22.3555C20.0293 22.8633 19.4512 23.1172 18.7129 23.1172C18.0332 23.1172 17.5137 22.9219 17.1543 22.5312C16.7988 22.1406 16.6172 21.5684 16.6094 20.8145V16.6602H18.3027V20.7559C18.3027 21.416 18.6035 21.7461 19.2051 21.7461C19.7793 21.7461 20.1738 21.5469 20.3887 21.1484V16.6602H22.0879V23H20.4941L20.4473 22.3555ZM25.1523 23H23.4531V16.6602H25.1523V23ZM23.3535 15.0195C23.3535 14.7656 23.4375 14.5566 23.6055 14.3926C23.7773 14.2285 24.0098 14.1465 24.3027 14.1465C24.5918 14.1465 24.8223 14.2285 24.9941 14.3926C25.166 14.5566 25.252 14.7656 25.252 15.0195C25.252 15.2773 25.1641 15.4883 24.9883 15.6523C24.8164 15.8164 24.5879 15.8984 24.3027 15.8984C24.0176 15.8984 23.7871 15.8164 23.6113 15.6523C23.4395 15.4883 23.3535 15.2773 23.3535 15.0195ZM28.5801 15.1016V16.6602H29.6641V17.9023H28.5801V21.0664C28.5801 21.3008 28.625 21.4688 28.7148 21.5703C28.8047 21.6719 28.9766 21.7227 29.2305 21.7227C29.418 21.7227 29.584 21.709 29.7285 21.6816V22.9648C29.3965 23.0664 29.0547 23.1172 28.7031 23.1172C27.5156 23.1172 26.9102 22.5176 26.8867 21.3184V17.9023H25.9609V16.6602H26.8867V15.1016H28.5801ZM40.4043 20.1582C40.3379 21.0762 39.998 21.7988 39.3848 22.3262C38.7754 22.8535 37.9707 23.1172 36.9707 23.1172C35.877 23.1172 35.0156 22.75 34.3867 22.0156C33.7617 21.2773 33.4492 20.2656 33.4492 18.9805V18.459C33.4492 17.6387 33.5938 16.916 33.8828 16.291C34.1719 15.666 34.584 15.1875 35.1191 14.8555C35.6582 14.5195 36.2832 14.3516 36.9941 14.3516C37.9785 14.3516 38.7715 14.6152 39.373 15.1426C39.9746 15.6699 40.3223 16.4102 40.416 17.3633H38.6582C38.6152 16.8125 38.4609 16.4141 38.1953 16.168C37.9336 15.918 37.5332 15.793 36.9941 15.793C36.4082 15.793 35.9688 16.0039 35.6758 16.4258C35.3867 16.8438 35.2383 17.4941 35.2305 18.377V19.0215C35.2305 19.9434 35.3691 20.6172 35.6465 21.043C35.9277 21.4688 36.3691 21.6816 36.9707 21.6816C37.5137 21.6816 37.918 21.5586 38.1836 21.3125C38.4531 21.0625 38.6074 20.6777 38.6465 20.1582H40.4043ZM43.2344 23H41.5352V14H43.2344V23ZM48.4316 22.3555C48.0137 22.8633 47.4355 23.1172 46.6973 23.1172C46.0176 23.1172 45.498 22.9219 45.1387 22.5312C44.7832 22.1406 44.6016 21.5684 44.5938 20.8145V16.6602H46.2871V20.7559C46.2871 21.416 46.5879 21.7461 47.1895 21.7461C47.7637 21.7461 48.1582 21.5469 48.373 21.1484V16.6602H50.0723V23H48.4785L48.4316 22.3555ZM54.7832 21.248C54.7832 21.041 54.6797 20.8789 54.4727 20.7617C54.2695 20.6406 53.9414 20.5332 53.4883 20.4395C51.9805 20.123 51.2266 19.4824 51.2266 18.5176C51.2266 17.9551 51.459 17.4863 51.9238 17.1113C52.3926 16.7324 53.0039 16.543 53.7578 16.543C54.5625 16.543 55.2051 16.7324 55.6855 17.1113C56.1699 17.4902 56.4121 17.9824 56.4121 18.5879H54.7188C54.7188 18.3457 54.6406 18.1465 54.4844 17.9902C54.3281 17.8301 54.084 17.75 53.752 17.75C53.4668 17.75 53.2461 17.8145 53.0898 17.9434C52.9336 18.0723 52.8555 18.2363 52.8555 18.4355C52.8555 18.623 52.9434 18.7754 53.1191 18.8926C53.2988 19.0059 53.5996 19.1055 54.0215 19.1914C54.4434 19.2734 54.7988 19.3672 55.0879 19.4727C55.9824 19.8008 56.4297 20.3691 56.4297 21.1777C56.4297 21.7559 56.1816 22.2246 55.6855 22.584C55.1895 22.9395 54.5488 23.1172 53.7637 23.1172C53.2324 23.1172 52.7598 23.0234 52.3457 22.8359C51.9355 22.6445 51.6133 22.3848 51.3789 22.0566C51.1445 21.7246 51.0273 21.3672 51.0273 20.9844H52.6328C52.6484 21.2852 52.7598 21.5156 52.9668 21.6758C53.1738 21.8359 53.4512 21.916 53.7988 21.916C54.123 21.916 54.3672 21.8555 54.5312 21.7344C54.6992 21.6094 54.7832 21.4473 54.7832 21.248ZM59.5527 15.1016V16.6602H60.6367V17.9023H59.5527V21.0664C59.5527 21.3008 59.5977 21.4688 59.6875 21.5703C59.7773 21.6719 59.9492 21.7227 60.2031 21.7227C60.3906 21.7227 60.5566 21.709 60.7012 21.6816V22.9648C60.3691 23.0664 60.0273 23.1172 59.6758 23.1172C58.4883 23.1172 57.8828 22.5176 57.8594 21.3184V17.9023H56.9336V16.6602H57.8594V15.1016H59.5527ZM64.498 23.1172C63.5684 23.1172 62.8105 22.832 62.2246 22.2617C61.6426 21.6914 61.3516 20.9316 61.3516 19.9824V19.8184C61.3516 19.1816 61.4746 18.6133 61.7207 18.1133C61.9668 17.6094 62.3145 17.2227 62.7637 16.9531C63.2168 16.6797 63.7324 16.543 64.3105 16.543C65.1777 16.543 65.8594 16.8164 66.3555 17.3633C66.8555 17.9102 67.1055 18.6855 67.1055 19.6895V20.3809H63.0684C63.123 20.7949 63.2871 21.127 63.5605 21.377C63.8379 21.627 64.1875 21.752 64.6094 21.752C65.2617 21.752 65.7715 21.5156 66.1387 21.043L66.9707 21.9746C66.7168 22.334 66.373 22.6152 65.9395 22.8184C65.5059 23.0176 65.0254 23.1172 64.498 23.1172ZM64.3047 17.9141C63.9688 17.9141 63.6953 18.0273 63.4844 18.2539C63.2773 18.4805 63.1445 18.8047 63.0859 19.2266H65.4414V19.0918C65.4336 18.7168 65.332 18.4277 65.1367 18.2246C64.9414 18.0176 64.6641 17.9141 64.3047 17.9141ZM71.6348 18.248C71.4043 18.2168 71.2012 18.2012 71.0254 18.2012C70.3848 18.2012 69.9648 18.418 69.7656 18.8516V23H68.0723V16.6602H69.6719L69.7188 17.416C70.0586 16.834 70.5293 16.543 71.1309 16.543C71.3184 16.543 71.4941 16.5684 71.6582 16.6191L71.6348 18.248ZM75.2559 23.1172C74.3262 23.1172 73.5684 22.832 72.9824 22.2617C72.4004 21.6914 72.1094 20.9316 72.1094 19.9824V19.8184C72.1094 19.1816 72.2324 18.6133 72.4785 18.1133C72.7246 17.6094 73.0723 17.2227 73.5215 16.9531C73.9746 16.6797 74.4902 16.543 75.0684 16.543C75.9355 16.543 76.6172 16.8164 77.1133 17.3633C77.6133 17.9102 77.8633 18.6855 77.8633 19.6895V20.3809H73.8262C73.8809 20.7949 74.0449 21.127 74.3184 21.377C74.5957 21.627 74.9453 21.752 75.3672 21.752C76.0195 21.752 76.5293 21.5156 76.8965 21.043L77.7285 21.9746C77.4746 22.334 77.1309 22.6152 76.6973 22.8184C76.2637 23.0176 75.7832 23.1172 75.2559 23.1172ZM75.0625 17.9141C74.7266 17.9141 74.4531 18.0273 74.2422 18.2539C74.0352 18.4805 73.9023 18.8047 73.8438 19.2266H76.1992V19.0918C76.1914 18.7168 76.0898 18.4277 75.8945 18.2246C75.6992 18.0176 75.4219 17.9141 75.0625 17.9141ZM78.5664 19.7832C78.5664 18.7949 78.7871 18.0078 79.2285 17.4219C79.6738 16.8359 80.2812 16.543 81.0508 16.543C81.668 16.543 82.1777 16.7734 82.5801 17.2344V14H84.2793V23H82.75L82.668 22.3262C82.2461 22.8535 81.7031 23.1172 81.0391 23.1172C80.293 23.1172 79.6934 22.8242 79.2402 22.2383C78.791 21.6484 78.5664 20.8301 78.5664 19.7832ZM80.2598 19.9062C80.2598 20.5 80.3633 20.9551 80.5703 21.2715C80.7773 21.5879 81.0781 21.7461 81.4727 21.7461C81.9961 21.7461 82.3652 21.5254 82.5801 21.084V18.582C82.3691 18.1406 82.0039 17.9199 81.4844 17.9199C80.668 17.9199 80.2598 18.582 80.2598 19.9062ZM91.8438 20.8848L93.7773 14.4688H95.7344L92.7637 23H90.9297L87.9707 14.4688H89.9219L91.8438 20.8848ZM98.2188 23H96.5195V16.6602H98.2188V23ZM96.4199 15.0195C96.4199 14.7656 96.5039 14.5566 96.6719 14.3926C96.8438 14.2285 97.0762 14.1465 97.3691 14.1465C97.6582 14.1465 97.8887 14.2285 98.0605 14.3926C98.2324 14.5566 98.3184 14.7656 98.3184 15.0195C98.3184 15.2773 98.2305 15.4883 98.0547 15.6523C97.8828 15.8164 97.6543 15.8984 97.3691 15.8984C97.084 15.8984 96.8535 15.8164 96.6777 15.6523C96.5059 15.4883 96.4199 15.2773 96.4199 15.0195ZM102.537 23.1172C101.607 23.1172 100.85 22.832 100.264 22.2617C99.6816 21.6914 99.3906 20.9316 99.3906 19.9824V19.8184C99.3906 19.1816 99.5137 18.6133 99.7598 18.1133C100.006 17.6094 100.354 17.2227 100.803 16.9531C101.256 16.6797 101.771 16.543 102.35 16.543C103.217 16.543 103.898 16.8164 104.395 17.3633C104.895 17.9102 105.145 18.6855 105.145 19.6895V20.3809H101.107C101.162 20.7949 101.326 21.127 101.6 21.377C101.877 21.627 102.227 21.752 102.648 21.752C103.301 21.752 103.811 21.5156 104.178 21.043L105.01 21.9746C104.756 22.334 104.412 22.6152 103.979 22.8184C103.545 23.0176 103.064 23.1172 102.537 23.1172ZM102.344 17.9141C102.008 17.9141 101.734 18.0273 101.523 18.2539C101.316 18.4805 101.184 18.8047 101.125 19.2266H103.48V19.0918C103.473 18.7168 103.371 18.4277 103.176 18.2246C102.98 18.0176 102.703 17.9141 102.344 17.9141ZM111.625 20.6973L112.457 16.6602H114.092L112.475 23H111.057L109.855 19.0098L108.654 23H107.242L105.625 16.6602H107.26L108.086 20.6914L109.246 16.6602H110.471L111.625 20.6973Z", "fill", "#5A6F8F"], ["x", "61", "y", "20", "text-anchor", "middle", "fill", "#5A6F8F", "font-family", "Arial, sans-serif", "font-size", "10", "font-weight", "normal"], ["matTooltip", "Quit DCM View", 1, "button", 2, "margin-right", "100px", 3, "click"], ["matTooltip", "Disconnect Sub Model From Father Model", 2, "margin-right", "5px", 3, "click"], ["x", "30.4763", "y", "4", "width", "2.5", "height", "37.6732", "transform", "rotate(44.6511 30.4763 4)", "fill", "#5A6F8F"], ["matTooltip", "Bring Links Between Selected Entities", 3, "click"], ["matTooltip", "Delete", 1, "button", 3, "click"], [1, "thingArrangeIcons"], ["width", "36", "height", "37", "viewBox", "0 0 36 37", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"]],
      template: function ElementToolBarComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵtemplate */.DNE(0, ElementToolBarComponent_div_0_Template, 113, 51, "div", 1)(1, ElementToolBarComponent_ng_template_1_Template, 119, 36, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r);
        }
        if (rf & 2) {
          const hidenav_r134 = core /* ɵɵreference */.sdS(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.visible)("ngIfElse", hidenav_r134);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatCheckbox, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, NgControlStatus, NgModel, MatSlider, MatSliderThumb, FontHighlightDirective],
      styles: ["div[_ngcontent-%COMP%]{font-family:Roboto,Arial,Helvetica,sans-serif;color:#1a3763}.mat-mdc-slider-thumb[_ngcontent-%COMP%]{background-color:#5a6f8f!important}.mat-mdc-slider-thumb[_ngcontent-%COMP%]:not(.mat-disabled){background-color:#5a6f8f!important}.mat-mdc-slider-track-fill[_ngcontent-%COMP%]{background-color:#5a6f8f!important}.textSimulationSettingsLabel[_ngcontent-%COMP%]{top:-10px;position:relative;color:#1a3763}.margin5[_ngcontent-%COMP%]{margin-left:5px}#visibleNav[_ngcontent-%COMP%], #hiddenNav[_ngcontent-%COMP%]{position:relative;width:100%;height:48px;left:0;z-index:1;top:8px;background:#fff;box-shadow:0 0 3px #1a3c5c4d}.button[_ngcontent-%COMP%]{width:55px;height:55px;background:transparent;border:none;border-radius:4px;padding-right:2px;text-align:center;outline:none;margin-left:5px}.button[_ngcontent-%COMP%]:hover{cursor:pointer}.navbar[_ngcontent-%COMP%]   .temporalStateIcons[_ngcontent-%COMP%]   .state[_ngcontent-%COMP%]{margin-left:3px}.buttonGroupHIde[_ngcontent-%COMP%]{position:relative;float:right;padding-right:8px;margin-top:8px}.rightSide[_ngcontent-%COMP%]{position:relative;float:right;padding-right:8px;margin-top:6px}.rightSideHide[_ngcontent-%COMP%]{float:right}.rightSideShow[_ngcontent-%COMP%]{float:right;margin-top:8px;margin-right:2px}.leftSide[_ngcontent-%COMP%]{position:relative;float:left;padding-left:21px;padding-top:3px}.stateArrangeIcons[_ngcontent-%COMP%]{position:relative;float:right;padding-right:8px;margin-top:8px}.outings[_ngcontent-%COMP%]{position:relative;padding-right:8px;margin-top:8px}.stateArrangementOptions[_ngcontent-%COMP%]{position:relative;float:right;margin-top:8px}.thingArrangeIcons[_ngcontent-%COMP%]{position:relative;float:right;padding-right:8px}.copyPasteIcons[_ngcontent-%COMP%], .commanActions[_ngcontent-%COMP%], .temporalStateIcons[_ngcontent-%COMP%]{position:relative;float:right;padding-right:8px;margin-top:8px}.affiliationIcon[_ngcontent-%COMP%]{top:-8px}.elementTextColor[_ngcontent-%COMP%]{width:26px;height:25px;padding-right:2px}.elementShapeColor[_ngcontent-%COMP%], .elementShapePattern[_ngcontent-%COMP%]{position:relative;top:3px;border:none;background:transparent;padding-right:2px}.textFontContainer[_ngcontent-%COMP%]{width:210px;height:201px;z-index:4;background:#586d8c;border-radius:4px;margin-top:inherit}.textFont[_ngcontent-%COMP%]{position:absolute;width:210px;height:201px;z-index:3;display:inline-grid;background:#586d8c;border-radius:4px;overflow:auto}.textFont[_ngcontent-%COMP%]::-webkit-scrollbar{width:4px}.textFont[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:4px}.textFont[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:2px;background:#b9d2df54;border-radius:1px}.textFont[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;background:none;border:none;text-align:center}#returnDefault[_ngcontent-%COMP%]{position:relative}#returnDefaultbtn[_ngcontent-%COMP%]{color:#000;background:none;border:none;text-align:center}.textsizeContainer[_ngcontent-%COMP%]{position:absolute;width:80px;height:210px;z-index:4;display:inline-block;background:#586d8c;border-radius:4px;margin-top:inherit}.textSize[_ngcontent-%COMP%]{position:absolute;width:80px;height:201px;z-index:3;display:grid;background:#586d8c;border-radius:4px;overflow:auto}.textSize[_ngcontent-%COMP%]::-webkit-scrollbar{width:4px}.textSize[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:4px}.textSize[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:2px;background:#b9d2df54;border-radius:1px}.textSize[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;background:none;border:none;text-align:center}.textSize[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background:#78a8f1}.textSize[_ngcontent-%COMP%]   a.currentSize[_ngcontent-%COMP%]{background:#1a3763}#manualTextPosContainer[_ngcontent-%COMP%]{position:relative;top:3px;border:none;background:transparent;padding-right:2px;align-content:center;align-items:center}#textAnchor[_ngcontent-%COMP%]{position:relative;top:4px;border:none;background:transparent;padding-right:2px}#textPos[_ngcontent-%COMP%]{position:relative;top:8px}#textPosSliders[_ngcontent-%COMP%]{position:relative;top:-4px;border:none;background:transparent;padding-right:2px;align-content:center;align-items:center}#textPosSliders[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(#textPosLabelX, #textPosLabelY)[_ngcontent-%COMP%]{top:0;position:relative;color:#5a6f8f}#boxTextPos[_ngcontent-%COMP%]{position:relative;top:8px}.mat-slider-horizontal[_ngcontent-%COMP%]{height:10px;min-width:128px;margin-top:-55px}.colorPickerContainer[_ngcontent-%COMP%]{position:relative;top:-4px;z-index:3;width:287px;height:34px;background:#000000b3;border-radius:4px;padding-top:10px}.range1[_ngcontent-c8][_ngcontent-%COMP%]   input[_ngcontent-c8][_ngcontent-%COMP%]{width:232px;height:4px}.range1[_ngcontent-%COMP%]{position:relative;top:-5px;z-index:3;width:232px;height:16px;background:linear-gradient(90deg,#000,#f2802e 10%,#f2ea2e 17.13%,#2ef265 28.81%,#2ec3f2 40.14%,#3e2ef2 55.61%,#9c2ef2 75.08%,#f22e80 95%,#fff);margin:0 auto}input[type=range][_ngcontent-%COMP%]{-webkit-appearance:none;width:100%;background:transparent}input[type=range][_ngcontent-%COMP%]::-webkit-slider-thumb{-webkit-appearance:none}input[type=range][_ngcontent-%COMP%]:focus{outline:none}.range1[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:232px}input[type=range][_ngcontent-%COMP%]::-webkit-slider-thumb{-webkit-appearance:none;border:1px solid #fff;height:21px;width:10px;border-radius:3px;background:transparent;cursor:pointer;margin-top:-14px;box-shadow:1px 1px 1px #000,0 0 1px #0d0d0d}input[type=range][_ngcontent-%COMP%]::-webkit-slider-runnable-track{width:100%;height:.1px;cursor:pointer;background:transparent;border-radius:1.3px}.firstColorPicker[_ngcontent-%COMP%]{position:relative;top:3px;background:transparent;border:none}#zoomSelectOptionMenuShow[_ngcontent-%COMP%]::-webkit-scrollbar{width:4px}#zoomSelectOptionMenuShow[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:4px}#zoomSelectOptionMenuShow[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:2px;background:#b9d2df54;border-radius:1px}#zoomSelectOptionMenu[_ngcontent-%COMP%]::-webkit-scrollbar{width:4px}#zoomSelectOptionMenu[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:4px}#zoomSelectOptionMenu[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:2px;background:#b9d2df54;border-radius:1px}.zoomSelect[_ngcontent-%COMP%]{position:absolute;width:72px;left:-79px;background:#49728417;border-radius:4px}.zoomSelectContainerShow[_ngcontent-%COMP%]{position:absolute;right:102px;top:44px;width:37px;height:201px;z-index:3;display:-ms-inline-grid;background:#49728417;border-radius:4px;overflow:auto;padding:4px;text-align:right;font-size:12px}.zoomSelectContainerHide[_ngcontent-%COMP%]{position:absolute;right:217px;top:36px;width:37px;height:201px;z-index:3;display:-ms-inline-grid;background:#49728417;border-radius:4px;overflow:auto;padding:4px;text-align:right;font-size:12px}.zoomSelectStyle[_ngcontent-%COMP%]{width:50px;height:210px;z-index:4;border-radius:4px;margin-top:inherit;display:inline-grid;padding-right:4px}.zoomSelectStyle[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#1a3763;opacity:.7;background:none;border:none;text-align:left}.zoomValueDisplay[_ngcontent-%COMP%]{position:absolute}#labelToHIde[_ngcontent-%COMP%]{position:absolute;font-size:14px;right:221px;top:2px}#labelToShow[_ngcontent-%COMP%]{position:absolute;font-size:14px;right:108px;top:9px}.notesActive[_ngcontent-%COMP%]{display:block;text-indent:-9999px;width:33px;height:36px;background:url(/assets/SVG/notesActive.svg);background-size:35px 36px}.notesDeactive[_ngcontent-%COMP%]{display:block;text-indent:-9999px;width:33px;height:36px;background:url(/assets/SVG/notesDeactive.svg);background-size:35px 36px}.downloadCSVActive[_ngcontent-%COMP%]{display:block;text-indent:-9999px;width:36px;height:35px;background:url(/assets/SVG/CSVon.svg);background-size:35px 36px}.downloadCSVDeactive[_ngcontent-%COMP%]{display:block;text-indent:-9999px;width:36px;height:35px;background:url(/assets/SVG/CSVoff.svg);background-size:35px 36px}.numberOfRuns[_ngcontent-%COMP%], .downloadEvery[_ngcontent-%COMP%]{font-family:Roboto;font-style:normal;font-weight:400;font-size:16px;line-height:32px;border-radius:6px;border:1px solid rgba(73,114,132,.2);width:55px;height:32px;text-align:center;display:inline-block;margin-left:5px;color:#1a3763;opacity:.7;position:relative;top:-12px}.headLessCheckbox[_ngcontent-%COMP%]{margin-right:2px;margin-top:-3px}.headlessText[_ngcontent-%COMP%]{top:19px;left:23px;font-size:14px;color:#1a3763;white-space:nowrap}.headLess[_ngcontent-%COMP%]{position:relative;height:32px;width:120px;top:-10px;left:4px}.xlxs-upload[_ngcontent-%COMP%] > input[_ngcontent-%COMP%]{visibility:hidden;width:0;height:0}.xlxs-upload[_ngcontent-%COMP%]{display:inline-block;margin-left:5px}#navigatorButton[_ngcontent-%COMP%]{display:block;width:36px;height:35px;background-size:35px 36px}#rosConnectionButton[_ngcontent-%COMP%]{width:36px;height:35px;background-size:35px 36px;margin-right:5px}#stylingTools[_ngcontent-%COMP%]{background-color:#f7f7f7;position:absolute;padding:3px;display:flex;align-items:center;align-content:center;margin-top:5px;margin-left:-24px;box-shadow:1px 1px 1px #1a3c5c33,-1px 0 #1a3c5c33;border-radius:0 0 6px;transition:all .5s ease-in-out}#bringButton[_ngcontent-%COMP%]{position:relative;background:#50639a0d;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;display:inline-block;height:35px;font-weight:600;font-size:15px;color:#1a3763;font-family:Roboto,Helvetica Neue,sans-serif}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}.bringCheckbox[_ngcontent-%COMP%]{margin-right:5px;margin-top:-3px}.stylingSpan[_ngcontent-%COMP%]{position:relative;top:8px}#stateArrangementTools[_ngcontent-%COMP%]{background-color:#f7f7f7;position:fixed;padding-right:2px;padding-bottom:5px;display:flex;align-items:center;margin-top:-1px;box-shadow:1px 1px 1px #1a3c5c33,-1px 0 #1a3c5c33;border-radius:0 0 6px 6px}.extensionsDiv[_ngcontent-%COMP%]{background-color:#f7f7f7;position:fixed;padding-right:2px;padding-bottom:5px;display:flex;align-items:center;margin-top:2px;box-shadow:1px 1px 1px #1a3c5c33,-1px 0 #1a3c5c33;border-radius:0 0 6px 6px}.executionDiv[_ngcontent-%COMP%]{background-color:#f7f7f7;position:fixed;padding:5px 2px;display:flex;align-items:center;margin-top:2px;width:335px!important}.statesArrangementSpan[_ngcontent-%COMP%]{position:relative;top:4px}.fileInput[_ngcontent-%COMP%]{position:absolute;left:301px}.ros-mqtt-tooltip[_ngcontent-%COMP%]{white-space:pre-line}"]
    }))();
  }
  return ElementToolBarComponent;
})();
var ColorTarget = /*#__PURE__*/function (ColorTarget) {
  ColorTarget[ColorTarget.TEXT = 1] = "TEXT";
  ColorTarget[ColorTarget.FILL = 2] = "FILL";
  ColorTarget[ColorTarget.STROKE = 3] = "STROKE";
  return ColorTarget;
}(ColorTarget || {});