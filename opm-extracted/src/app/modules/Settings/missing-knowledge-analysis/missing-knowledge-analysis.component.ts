// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/missing-knowledge-analysis/missing-knowledge-analysis.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const missing_knowledge_analysis_component_c0 = a0 => ({
  dense: a0
});
function MissingKnowledgeAnalysisComponent_div_11_div_24_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 31);
    core /* ɵɵelement */.nrm(1, "span", 32);
    core /* ɵɵelementStart */.j41(2, "span");
    core /* ɵɵtext */.EFF(3, "Analyzing… Finding missing knowledge");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MissingKnowledgeAnalysisComponent_div_11_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 33)(1, "span")(2, "b");
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵpipe */.nI1(5, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.resultRows.length);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" suggestions (score ≥ ", core /* ɵɵpipeBind2 */.i5U(5, 2, ctx_r1.resultInfo.threshold, "1.2-2"), ")");
  }
}
function MissingKnowledgeAnalysisComponent_div_11_p_26_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p", 34);
    core /* ɵɵtext */.EFF(1, " No suggestions yet. Run reasoning to discover missing knowledge. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_div_11_div_27_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td", 43);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td", 44);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td", 43);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "td", 41);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵpipe */.nI1(9, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", row_r3.sourceClass)("title", row_r3.sourceLabel);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(row_r3.sourceLabel);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(row_r3.relation);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", row_r3.targetClass)("title", row_r3.targetLabel);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(row_r3.targetLabel);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(9, 8, row_r3.score, "1.3-3"));
  }
}
function MissingKnowledgeAnalysisComponent_div_11_div_27_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 35)(1, "table", 36)(2, "colgroup");
    core /* ɵɵelement */.nrm(3, "col", 37)(4, "col", 38)(5, "col", 39)(6, "col", 40);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "thead")(8, "tr")(9, "th");
    core /* ɵɵtext */.EFF(10, "Source");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "th");
    core /* ɵɵtext */.EFF(12, "Relation");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "th");
    core /* ɵɵtext */.EFF(14, "Target");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "th", 41);
    core /* ɵɵtext */.EFF(16, "Confidence");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(17, "tbody");
    core /* ɵɵtemplate */.DNE(18, MissingKnowledgeAnalysisComponent_div_11_div_27_tr_18_Template, 10, 11, "tr", 42);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(18);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.resultRows);
  }
}
function MissingKnowledgeAnalysisComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 1)(2, "h2", 2);
    core /* ɵɵtext */.EFF(3, "Identification of Missing Knowledge Using Machine Learning");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "p", 10);
    core /* ɵɵtext */.EFF(5, " Identification of Missing Knowledge in System Models Using Graph-Based Machine Learning.");
    core /* ɵɵelement */.nrm(6, "br");
    core /* ɵɵtext */.EFF(7, " This analysis method uses a methodology to automatically discover missing relationships (or “missing knowledge”) in system models.");
    core /* ɵɵelement */.nrm(8, "br");
    core /* ɵɵtext */.EFF(9, " Once the model is represented as a knowledge graph (KG), Graph Neural Networks (GNNs)—specifically DistMult as a baseline and R-GCN—predict missing links that might logically exist but are absent in the model. ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "div", 11)(11, "div", 12)(12, "button", 13);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_div_11_Template_button_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.DistMultReasoning());
    });
    core /* ɵɵtext */.EFF(13, " DistMult Reasoning ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "button", 14);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_div_11_Template_button_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.RGCNReasoning());
    });
    core /* ɵɵtext */.EFF(15, " R-GCN Reasoning ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "button", 15);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_div_11_Template_button_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadMissingKnowledgeExcel());
    });
    core /* ɵɵtext */.EFF(17, " Download Suggestions (Excel) ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(18, "div", 16)(19, "label", 17);
    core /* ɵɵtext */.EFF(20, "Confidence threshold");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(21, "input", 18);
    core /* ɵɵlistener */.bIt("input", function MissingKnowledgeAnalysisComponent_div_11_Template_input_input_21_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.onThresholdChange($event.target.value));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(22, "input", 19);
    core /* ɵɵlistener */.bIt("input", function MissingKnowledgeAnalysisComponent_div_11_Template_input_input_22_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.onThresholdChange($event.target.value));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(23, "div", 20);
    core /* ɵɵtemplate */.DNE(24, MissingKnowledgeAnalysisComponent_div_11_div_24_Template, 4, 0, "div", 21)(25, MissingKnowledgeAnalysisComponent_div_11_div_25_Template, 6, 5, "div", 22)(26, MissingKnowledgeAnalysisComponent_div_11_p_26_Template, 2, 0, "p", 23)(27, MissingKnowledgeAnalysisComponent_div_11_div_27_Template, 19, 1, "div", 24);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(28, "a", 25);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_div_11_Template_a_click_28_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.missingKnowledgeSuggestions());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(29, "svg", 26);
    core /* ɵɵelement */.nrm(30, "rect", 27);
    core /* ɵɵelementStart */.j41(31, "g", 28);
    core /* ɵɵelement */.nrm(32, "path", 29)(33, "path", 30);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(16);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.resultRows.length === 0);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("value", ctx_r1.minScore);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", ctx_r1.minScore);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isLoadingResults);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLoadingResults && ctx_r1.resultRows.length > 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLoadingResults && ctx_r1.resultRows.length === 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isLoadingResults && ctx_r1.resultRows.length > 0);
  }
}
function MissingKnowledgeAnalysisComponent_section_12_div_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 55);
    core /* ɵɵtext */.EFF(1, " Computing grading metrics… ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_12_div_14_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 56);
    core /* ɵɵtext */.EFF(1, " Click ");
    core /* ɵɵelementStart */.j41(2, "strong");
    core /* ɵɵtext */.EFF(3, "Run Model Grading");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, " to analyze the model’s OPL and see metrics here. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_12_ng_container_15_tr_43_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵpipe */.nI1(7, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r6.key);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r6.value == null ? null : item_r6.value.count);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(7, 3, item_r6.value == null ? null : item_r6.value.winf, "1.2-2"));
  }
}
function MissingKnowledgeAnalysisComponent_section_12_ng_container_15_option_54_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 75);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const f_r7 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", f_r7);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(f_r7);
  }
}
function MissingKnowledgeAnalysisComponent_section_12_ng_container_15_tr_76_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td", 76);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "td");
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵpipe */.nI1(9, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const s_r8 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(s_r8.number);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", s_r8.raw);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(s_r8.raw);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(s_r8.mfspName);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(9, 5, s_r8.twinf, "1.3-3"));
  }
}
function MissingKnowledgeAnalysisComponent_section_12_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementContainerStart */.qex(0);
    core /* ɵɵelementStart */.j41(1, "div", 57)(2, "div", 58)(3, "div", 59);
    core /* ɵɵtext */.EFF(4, "TWINF (Total)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 60);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵpipe */.nI1(7, "number");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(8, "div", 58)(9, "div", 59);
    core /* ɵɵtext */.EFF(10, "WINF (Overall)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "div", 60);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵpipe */.nI1(13, "number");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "div", 58)(15, "div", 59);
    core /* ɵɵtext */.EFF(16, "INF Avg");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "div", 60);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵpipe */.nI1(19, "number");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(20, "div", 58)(21, "div", 59);
    core /* ɵɵtext */.EFF(22, "OPL Sentences");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(23, "div", 60);
    core /* ɵɵtext */.EFF(24);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(25, "div", 61)(26, "h3", 62);
    core /* ɵɵtext */.EFF(27, "MFSP Distribution");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(28, "div", 35)(29, "table", 63)(30, "colgroup");
    core /* ɵɵelement */.nrm(31, "col", 64)(32, "col", 65)(33, "col", 65);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(34, "thead")(35, "tr")(36, "th");
    core /* ɵɵtext */.EFF(37, "MFSP");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(38, "th");
    core /* ɵɵtext */.EFF(39, "Count");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(40, "th");
    core /* ɵɵtext */.EFF(41, "WINF");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(42, "tbody");
    core /* ɵɵtemplate */.DNE(43, MissingKnowledgeAnalysisComponent_section_12_ng_container_15_tr_43_Template, 8, 6, "tr", 42);
    core /* ɵɵpipe */.nI1(44, "keyvalue");
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(45, "div", 61)(46, "h3", 62);
    core /* ɵɵtext */.EFF(47, "Sentence-Level Informativity");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(48, "div", 66)(49, "label");
    core /* ɵɵtext */.EFF(50, " MFSP: ");
    core /* ɵɵelementStart */.j41(51, "select", 67);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function MissingKnowledgeAnalysisComponent_section_12_ng_container_15_Template_select_ngModelChange_51_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.milFilter.mfsp, $event)) {
        ctx_r1.milFilter.mfsp = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(52, "option", 68);
    core /* ɵɵtext */.EFF(53, "All");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(54, MissingKnowledgeAnalysisComponent_section_12_ng_container_15_option_54_Template, 2, 2, "option", 69);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(55, "label");
    core /* ɵɵtext */.EFF(56, " Min INF: ");
    core /* ɵɵelementStart */.j41(57, "input", 70);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function MissingKnowledgeAnalysisComponent_section_12_ng_container_15_Template_input_ngModelChange_57_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.milFilter.minInf, $event)) {
        ctx_r1.milFilter.minInf = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(58, "div", 35)(59, "table", 71)(60, "colgroup");
    core /* ɵɵelement */.nrm(61, "col", 72)(62, "col", 73)(63, "col", 74)(64, "col", 74);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(65, "thead")(66, "tr")(67, "th");
    core /* ɵɵtext */.EFF(68, "#");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(69, "th");
    core /* ɵɵtext */.EFF(70, "OPL Sentence");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(71, "th");
    core /* ɵɵtext */.EFF(72, "MFSP");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(73, "th");
    core /* ɵɵtext */.EFF(74, "INF");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(75, "tbody");
    core /* ɵɵtemplate */.DNE(76, MissingKnowledgeAnalysisComponent_section_12_ng_container_15_tr_76_Template, 10, 8, "tr", 42);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementContainerEnd */.bVm();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(7, 9, ctx_r1.milSnapshot == null ? null : ctx_r1.milSnapshot.totals == null ? null : ctx_r1.milSnapshot.totals.twinf, "1.2-2"));
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(13, 12, ctx_r1.milSnapshot == null ? null : ctx_r1.milSnapshot.totals == null ? null : ctx_r1.milSnapshot.totals.winf, "1.2-2"));
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(19, 15, ctx_r1.milSnapshot == null ? null : ctx_r1.milSnapshot.totals == null ? null : ctx_r1.milSnapshot.totals.infAvg, "1.3-3"));
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.milSnapshot == null ? null : ctx_r1.milSnapshot.totals == null ? null : ctx_r1.milSnapshot.totals.count);
    core /* ɵɵadvance */.R7$(19);
    core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(44, 18, ctx_r1.milSnapshot == null ? null : ctx_r1.milSnapshot.byFamily));
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.milFilter.mfsp);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.milSnapshot == null ? null : ctx_r1.milSnapshot.families);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.milFilter.minInf);
    core /* ɵɵadvance */.R7$(19);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.filteredMilSentences);
  }
}
function MissingKnowledgeAnalysisComponent_section_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "section", 45)(1, "div", 46)(2, "div", 1)(3, "h2", 2);
    core /* ɵɵtext */.EFF(4, "Model Informativity Grading (MIL/MIA)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "p", 47);
    core /* ɵɵtext */.EFF(6, " This section evaluates how informative your OPM model is, based on its OPL (Object-Process Language). Each OPL sentence is classified into a Model Fundamental Specification Pattern (MFSP) category (Thing Definition, Structural, Procedural, Precedence, Meta), enriched with Informativity-Enhancing Factors (IEFs), and scored into per-sentence INF. Scores are aggregated into WINF and a model-level TWINF. Use this dashboard to identify underspecified areas (e.g., processes lacking inputs/outputs, missing precedence) alongside the suggestions above. ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(7, "div", 48)(8, "button", 49);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_12_Template_button_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.runModelGrading());
    });
    core /* ɵɵtext */.EFF(9, " Run Model Grading ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "button", 50);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_12_Template_button_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadMilExcel());
    });
    core /* ɵɵtext */.EFF(11, " Download Grades (Excel) ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(12, "div", 51);
    core /* ɵɵtemplate */.DNE(13, MissingKnowledgeAnalysisComponent_section_12_div_13_Template, 2, 0, "div", 52)(14, MissingKnowledgeAnalysisComponent_section_12_div_14_Template, 5, 0, "div", 53)(15, MissingKnowledgeAnalysisComponent_section_12_ng_container_15_Template, 77, 20, "ng-container", 7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "a", 54);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_12_Template_a_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.copyGradingToClipboard());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(17, "svg", 26);
    core /* ɵɵelement */.nrm(18, "rect", 27);
    core /* ɵɵelementStart */.j41(19, "g", 28);
    core /* ɵɵelement */.nrm(20, "path", 29)(21, "path", 30);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.milLoading);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.milLoading && !ctx_r1.milSnapshot);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.milLoading && ctx_r1.milSnapshot);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_19_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 84);
    core /* ɵɵtext */.EFF(1, " Click ");
    core /* ɵɵelementStart */.j41(2, "strong");
    core /* ɵɵtext */.EFF(3, "Run CSA");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, " to analyze the model’s conceptual state space. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "Basic");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "Controllable");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "Both");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "Ontological");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "Unknown");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td", 76);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtemplate */.DNE(4, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_4_Template, 2, 0, "span", 7)(5, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_5_Template, 2, 0, "span", 7)(6, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_6_Template, 2, 0, "span", 7)(7, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_7_Template, 2, 0, "span", 7)(8, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_span_8_Template, 2, 0, "span", 7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "td");
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "td", 44);
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const r_r11 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", r_r11.objectName);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(r_r11.objectName);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", r_r11.role === "basis");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", r_r11.role === "controllable");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", r_r11.role === "both");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", r_r11.role === "ontological");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", r_r11.role === "unknown");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(r_r11.valueCount);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", r_r11.values.join(" | "), " ");
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 35)(1, "table", 88)(2, "colgroup");
    core /* ɵɵelement */.nrm(3, "col", 89)(4, "col", 90)(5, "col", 72)(6, "col", 91);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "thead")(8, "tr")(9, "th");
    core /* ɵɵtext */.EFF(10, "State Attribute");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "th");
    core /* ɵɵtext */.EFF(12, "Role");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "th");
    core /* ɵɵtext */.EFF(14, "#Values");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "th");
    core /* ɵɵtext */.EFF(16, "Values");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(17, "tbody");
    core /* ɵɵtemplate */.DNE(18, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_tr_18_Template, 13, 9, "tr", 42);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(18);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.csaDisplayedRows);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_39_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 56);
    core /* ɵɵtext */.EFF(1, " No objects found to analyze. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_option_23_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 75);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const s_r13 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", s_r13);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(s_r13);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_label_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "label", 107)(1, "input", 108);
    core /* ɵɵlistener */.bIt("change", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_label_25_Template_input_change_1_listener($event) {
      const opt_r15 = core /* ɵɵrestoreView */.eBV(_r14).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleStAtt(opt_r15, $event.target.checked));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(2, "span", 109);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const opt_r15 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.selectedStAttsSet.has(opt_r15));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("title", opt_r15);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(opt_r15);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_26_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 110)(1, "h3", 111);
    core /* ɵɵtext */.EFF(2, "State-Vector Summary");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p", 112);
    core /* ɵɵtext */.EFF(4, " These metrics summarize the generated State-Vector table (StVect), including how many State-Attributes were combined and the total number of resulting state combinations. ");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_27_div_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 58)(1, "div", 59);
    core /* ɵɵtext */.EFF(2, "Estimated total");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 60);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵpipe */.nI1(5, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(5);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind1 */.bMT(5, 1, ctx_r1.stVectTotalEstimated));
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_27_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 57)(1, "div", 58)(2, "div", 59);
    core /* ɵɵtext */.EFF(3, "Selected StAtts");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 60);
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "div", 58)(7, "div", 59);
    core /* ɵɵtext */.EFF(8, "State-Vectors (rows)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "div", 60);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵpipe */.nI1(11, "number");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(12, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_27_div_12_Template, 6, 3, "div", 113);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh((ctx_r1.stVect == null ? null : ctx_r1.stVect.columns == null ? null : ctx_r1.stVect.columns.length) || 0);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind1 */.bMT(11, 3, (ctx_r1.stVect == null ? null : ctx_r1.stVect.rows == null ? null : ctx_r1.stVect.rows.length) || 0));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.stVectTotalEstimated);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 114)(1, "button", 115);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_28_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.goFirst());
    });
    core /* ɵɵtext */.EFF(2, "« First");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "button", 115);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_28_Template_button_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.goPrev());
    });
    core /* ɵɵtext */.EFF(4, "‹ Prev");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "span", 116);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "button", 115);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_28_Template_button_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.goNext());
    });
    core /* ɵɵtext */.EFF(8, "Next › ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "button", 115);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_28_Template_button_click_9_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.goLast());
    });
    core /* ɵɵtext */.EFF(10, "Last » ");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.stVectPage <= 1);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.stVectPage <= 1);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate2 */.Lme(" Page ", ctx_r1.stVectPage, " / ", ctx_r1.stVectPageCount, " ");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.stVectPage >= ctx_r1.stVectPageCount);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.stVectPage >= ctx_r1.stVectPageCount);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_th_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "th", 121);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const c_r17 = ctx.$implicit;
    const i_r18 = ctx.index;
    core /* ɵɵproperty */.Y8G("hidden", i_r18 === 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(c_r17);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_tr_8_td_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "td", 124);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const c_r19 = ctx.$implicit;
    const i_r20 = ctx.index;
    const row_r21 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("hidden", i_r20 === 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", row_r21[c_r19], " ");
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_tr_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td", 122);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_tr_8_td_3_Template, 2, 2, "td", 123);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const row_r21 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG(5);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(row_r21[ctx_r1.stVect.columns[0]]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.stVect.columns);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 117)(1, "table", 118)(2, "thead")(3, "tr")(4, "th", 119);
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(6, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_th_6_Template, 2, 2, "th", 120);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(7, "tbody");
    core /* ɵɵtemplate */.DNE(8, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_tr_8_Template, 4, 2, "tr", 42);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction1 */.eq3(4, missing_knowledge_analysis_component_c0, ctx_r1.stVectDense));
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.stVect.columns[0]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.stVect.columns);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.stVectPageRows);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_30_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 56);
    core /* ɵɵtext */.EFF(1, " Choose one or more State-Attributes above and click ");
    core /* ɵɵelementStart */.j41(2, "strong");
    core /* ɵɵtext */.EFF(3, "Generate State Vectors");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, ". ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 51)(1, "h3", 92);
    core /* ɵɵtext */.EFF(2, "State-Vector Generation (StVect)");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p", 47);
    core /* ɵɵtext */.EFF(4, " Select State-Attributes (objects) and generate the Cartesian product of their values. Ordering per attribute follows its value ");
    core /* ɵɵelementStart */.j41(5, "em");
    core /* ɵɵtext */.EFF(6, "Rank");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(7, " (explicit order for explicit states; {exists=0, not exists=1} for implicit). ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 93)(9, "div", 94)(10, "button", 95);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template_button_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.selectAllStAtts());
    });
    core /* ɵɵtext */.EFF(11, "Select All");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "button", 96);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template_button_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.clearAllStAtts());
    });
    core /* ɵɵtext */.EFF(13, "Clear ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "span", 97);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "span", 98)(17, "label", 99)(18, "input", 100);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template_input_ngModelChange_18_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.stVectDense, $event)) {
        ctx_r1.stVectDense = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(19, " Dense ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "label", 99);
    core /* ɵɵtext */.EFF(21, " Page size: ");
    core /* ɵɵelementStart */.j41(22, "select", 67);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template_select_ngModelChange_22_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.stVectPageSize, $event)) {
        ctx_r1.stVectPageSize = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("ngModelChange", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template_select_ngModelChange_22_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.onPageSizeChange());
    });
    core /* ɵɵtemplate */.DNE(23, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_option_23_Template, 2, 2, "option", 69);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(24, "div", 101);
    core /* ɵɵtemplate */.DNE(25, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_label_25_Template, 4, 3, "label", 102);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(26, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_26_Template, 5, 0, "div", 103)(27, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_27_Template, 13, 5, "div", 104)(28, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_28_Template, 11, 6, "div", 105)(29, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_29_Template, 9, 6, "div", 106)(30, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_div_30_Template, 5, 0, "div", 53);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(15);
    core /* ɵɵtextInterpolate2 */.Lme("", ctx_r1.stAttOptions.length, " StAtts • Selected: ", ctx_r1.selectedStAtts.length, "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.stVectDense);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.stVectPageSize);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.stVectPageSizes);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.stAttOptions);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r1.stVect == null ? null : ctx_r1.stVect.rows) || ctx_r1.stVectTotalEstimated);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.stVect == null ? null : ctx_r1.stVect.rows);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.stVect == null ? null : ctx_r1.stVect.rows == null ? null : ctx_r1.stVect.rows.length);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.stVect == null ? null : ctx_r1.stVect.rows == null ? null : ctx_r1.stVect.rows.length);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !(ctx_r1.stVect == null ? null : ctx_r1.stVect.rows == null ? null : ctx_r1.stVect.rows.length));
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_div_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 85)(1, "a", 125);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_div_48_Template_a_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.copyStVectToClipboard());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 26);
    core /* ɵɵelement */.nrm(3, "rect", 27);
    core /* ɵɵelementStart */.j41(4, "g", 28);
    core /* ɵɵelement */.nrm(5, "path", 29)(6, "path", 30);
    core /* ɵɵelementEnd */.k0s()()()();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 51)(1, "div", 57)(2, "div", 58)(3, "div", 59);
    core /* ɵɵtext */.EFF(4, "StAtts");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 60);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(7, "div", 58)(8, "div", 59);
    core /* ɵɵtext */.EFF(9, "Basic");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "div", 60);
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(12, "div", 58)(13, "div", 59);
    core /* ɵɵtext */.EFF(14, "Controllable");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "div", 60);
    core /* ɵɵtext */.EFF(16);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(17, "div", 58)(18, "div", 59);
    core /* ɵɵtext */.EFF(19, "Both");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "div", 60);
    core /* ɵɵtext */.EFF(21);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(22, "div", 58)(23, "div", 59);
    core /* ɵɵtext */.EFF(24, "Ontological");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(25, "div", 60);
    core /* ɵɵtext */.EFF(26);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(27, "div", 58)(28, "div", 59);
    core /* ɵɵtext */.EFF(29, "Unknown");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(30, "div", 60);
    core /* ɵɵtext */.EFF(31);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(32, "div", 58)(33, "div", 59);
    core /* ɵɵtext */.EFF(34, "Conceptual Space");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(35, "div", 60);
    core /* ɵɵtext */.EFF(36);
    core /* ɵɵpipe */.nI1(37, "number");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵtemplate */.DNE(38, MissingKnowledgeAnalysisComponent_section_13_div_20_div_38_Template, 19, 1, "div", 24)(39, MissingKnowledgeAnalysisComponent_section_13_div_20_div_39_Template, 2, 0, "div", 53);
    core /* ɵɵelementStart */.j41(40, "div", 85)(41, "a", 86);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_div_20_Template_a_click_41_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.copyCsaSummaryToClipboard());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(42, "svg", 26);
    core /* ɵɵelement */.nrm(43, "rect", 27);
    core /* ɵɵelementStart */.j41(44, "g", 28);
    core /* ɵɵelement */.nrm(45, "path", 29)(46, "path", 30);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵtemplate */.DNE(47, MissingKnowledgeAnalysisComponent_section_13_div_20_div_47_Template, 31, 11, "div", 83)(48, MissingKnowledgeAnalysisComponent_section_13_div_20_div_48_Template, 7, 0, "div", 87);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.attributes);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.basisCount);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.controllableCount);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.bothCount);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.ontologicalCount);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.unknownCount);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind1 */.bMT(37, 11, ctx_r1.csaResult == null ? null : ctx_r1.csaResult.summary == null ? null : ctx_r1.csaResult.summary.conceptualSpace));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.csaResult == null ? null : ctx_r1.csaResult.rows == null ? null : ctx_r1.csaResult.rows.length);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.csaResult && !(ctx_r1.csaResult.rows == null ? null : ctx_r1.csaResult.rows.length));
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.csaResult);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.stVect == null ? null : ctx_r1.stVect.rows == null ? null : ctx_r1.stVect.rows.length);
  }
}
function MissingKnowledgeAnalysisComponent_section_13_div_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 56);
    core /* ɵɵtext */.EFF(1, " Computing CSA… ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MissingKnowledgeAnalysisComponent_section_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "section", 77)(1, "div", 46)(2, "div", 1)(3, "h2", 2);
    core /* ɵɵtext */.EFF(4, "Conceptual State Analysis (CSA)");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "div", 48)(6, "button", 78);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_Template_button_click_6_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.runCSA());
    });
    core /* ɵɵtext */.EFF(7, " Run CSA ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "button", 79);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_Template_button_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadCsaExcel());
    });
    core /* ɵɵtext */.EFF(9, " Download CSA Excel ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "button", 80);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_Template_button_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.generateStVect());
    });
    core /* ɵɵtext */.EFF(11, " Generate State Vectors ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "button", 81);
    core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_section_13_Template_button_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.downloadStVectExcel());
    });
    core /* ɵɵtext */.EFF(13, " Download StVect Excel ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "p", 47);
    core /* ɵɵtext */.EFF(15, " CSA treats each object as a single state-attribute (StAtt). If an object has explicit states, those are used; otherwise the implicit pair ");
    core /* ɵɵelementStart */.j41(16, "em");
    core /* ɵɵtext */.EFF(17, "{exists, not exists}");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(18, " is assumed. The conceptual state-space is the product of all objects’ state counts. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(19, MissingKnowledgeAnalysisComponent_section_13_div_19_Template, 5, 0, "div", 82)(20, MissingKnowledgeAnalysisComponent_section_13_div_20_Template, 49, 13, "div", 83)(21, MissingKnowledgeAnalysisComponent_section_13_div_21_Template, 2, 0, "div", 53);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.csaLoading);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.csaResult || !(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.rows == null ? null : ctx_r1.csaResult.rows.length));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.csaResult || !(ctx_r1.csaResult == null ? null : ctx_r1.csaResult.rows == null ? null : ctx_r1.csaResult.rows.length));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("disabled", !(ctx_r1.stVect == null ? null : ctx_r1.stVect.rows == null ? null : ctx_r1.stVect.rows.length));
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.csaResult && !ctx_r1.csaLoading);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.csaResult);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.csaResult && ctx_r1.csaLoading);
  }
}
/**
 * The implementation of this code was done according to the article:
 * Identification of Missing Knowledge in MBSE System Models Using Graph-Based Machine Learning
 * Systems Engineering, 2025; 0:1–17
 * https://doi.org/10.1002/sys.70013
 */
let MissingKnowledgeAnalysisComponent = /*#__PURE__*/(() => {
  class MissingKnowledgeAnalysisComponent {
    constructor(initRappidService, exportOPLService, serverFlatteningService) {
      this.initRappidService = initRappidService;
      this.exportOPLService = exportOPLService;
      this.serverFlatteningService = serverFlatteningService;
      this.isLoadingResults = false;
      this.resultRows = [];
      this.resultInfo = {
        total: 0,
        threshold: 0
      };
      /** User-adjustable confidence threshold (default 0.50). */
      this.minScore = 0.5;
      /** Optional UI status line for copy feedback */
      this.copyStatus = "";
      /** Page toggle. Initialize the toggle to null so nothing shows on first load */
      /** Which section is shown: '', 'missing', 'grading', 'csa' */
      this.selectedSection = "";
      /** CSA state */
      // ===== CSA / StVect state =====
      this.csaLoading = false;
      this.csaResult = null;
      // View & selection for State-Vector generation
      this.stAttView = []; // built from csaResult
      this.stAttOptions = []; // unique StateAttribute names
      this.selectedStAtts = []; // selected attribute names
      this.selectedStAttsSet = new Set();
      this.stVect = null;
      /** Huge-table protection */
      this.MAX_TABLE_ROWS = 1500;
      this.capMissing = true;
      this.capGrading = true;
      this.capCSA = true;
      /** Hard caps to prevent UI lockups */
      this.MAX_STVECT_ROWS = 50000; // total rows cap
      this.MAX_STVECT_ATTRS = 20; // sanity cap on selected attributes
      /** For diagnostics / UI notes if you want to display later */
      this.stVectTotalEstimated = 0;
      /** -------- StVect UI controls (paging + density) -------- */
      this.stVectDense = false;
      this.stVectPage = 1;
      this.stVectPageSize = 100;
      this.stVectPageSizes = [50, 100, 200, 500];
      /** Cache of latest suggestions WITH labels (so we can re-filter without retraining). */
      this.latestPrettySuggestions = [];
      // ====== Grading (MIL/MIA) state ======
      /** True while grading computation is running. */
      this.milLoading = false;
      /** The latest computed grading snapshot for the dashboard; null before first run. */
      this.milSnapshot = null;
      /** UI filter state for the sentence-level table in the grading dashboard. */
      this.milFilter = {
        mfsp: "",
        minInf: 0
      };
      /** Cached path label → sentence indices mapping for Path IEF */
      this.pathLabelToSentences = new Map();
      this.initRappid = initRappidService;
      this.model = initRappidService.getOpmModel();
    }
    ngOnInit() {}
    selectSection(s) {
      this.selectedSection = s;
    }
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
     * The main method called from the HTML to export the model triplets data as a CSV file.
     */
    RGCNReasoning() {
      return (0, default)(function* () {
        (0, validationAlert)?.("R-GCN is still under development.", 2500, "warning");
        return;
      })();
    }
    /**
     * Downloads the currently displayed Missing Knowledge suggestions as an Excel file.
     * Sheet "Suggestions" columns: Source, Relation, Target, Confidence, SourceID, TargetID
     * Sheet "Stats" shows a small summary (threshold and count).
     */
    downloadMissingKnowledgeExcel() {
      try {
        // 1) Guard – need visible rows first
        if (!Array.isArray(this.resultRows) || this.resultRows.length === 0) {
          (0, validationAlert)?.("No suggestions to export.", 2500, "warning");
          return;
        }
        // 2) Shape rows for Excel (use the already-rendered labels and numeric score)
        const headers = ["Source", "Relation", "Target", "Confidence"];
        const rows = this.resultRows.map(r => {
          return {
            Source: r.sourceLabel ?? "",
            Relation: r.relation ?? "",
            Target: r.targetLabel ?? "",
            Confidence: typeof r.score === "number" ? r.score : ""
          };
        });
        // 3) Build workbook
        const wb = utils.book_new();
        // Suggestions sheet
        const suggestionsWs = utils.json_to_sheet(rows, {
          header: headers
        });
        // Auto-fit columns (cap width to avoid very wide cells)
        const colWidths = headers.map(h => {
          const max = Math.max(h.length, ...rows.map(r => String(r[h] ?? "").length));
          // add padding; clamp to 80 chars
          return {
            wch: Math.min(max + 2, 80)
          };
        });
        suggestionsWs["!cols"] = colWidths;
        utils.book_append_sheet(wb, suggestionsWs, "Suggestions");
        // Stats sheet (threshold + totals)
        const statsRows = [{
          Key: "Threshold (MIN_SCORE)",
          Value: this.minScore ?? 0.5
        }, {
          Key: "Suggestions Count",
          Value: this.resultRows.length
        }];
        const statsWs = utils.json_to_sheet(statsRows, {
          header: ["Key", "Value"]
        });
        statsWs["!cols"] = [{
          wch: 28
        }, {
          wch: 18
        }];
        utils.book_append_sheet(wb, statsWs, "Stats");
        // 4) Filename (use model name if available)
        const modelName = this.initRappidService?.opmModel?.name?.trim?.();
        const safeModel = (modelName ? modelName : "opm_model").replace(/[\\/:*?"<>|]+/g, "_");
        const thresholdTag = `minscore_${(this.minScore ?? 0.5).toFixed(2)}`;
        const fname = `${safeModel}_missing_knowledge_${thresholdTag}.xlsx`;
        // 5) Save
        writeFileSync(wb, fname);
      } catch (err) {
        console.error("Excel export failed:", err);
        (0, validationAlert)?.("Excel export failed. See console for details.", 2500, "warning");
      }
    }
    /**
     * Copies the currently displayed suggestions to the clipboard as CSV.
     * Columns: Source, Relation, Target, Confidence
     */
    missingKnowledgeSuggestions() {
      var _this2 = this;
      return (0, default)(function* () {
        try {
          _this2.copyStatus = "";
          if (!_this2.resultRows || _this2.resultRows.length === 0) {
            // Nothing to copy
            (0, validationAlert)("Nothing to copy to clipboard", 2000, "warning");
            _this2.copyStatus = "error";
            return;
          }
          const csv = _this2.buildCsvFromRows(_this2.resultRows);
          // Try modern clipboard API first
          if (navigator && "clipboard" in navigator && navigator.clipboard?.writeText) {
            yield navigator.clipboard.writeText(csv);
          } else {
            // Fallback: execCommand (works in older browsers)
            const ta = document.createElement("textarea");
            ta.value = csv;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(ta);
            if (!ok) {
              throw new Error("execCommand copy failed");
            }
          }
          _this2.copyStatus = "copied";
          (0, validationAlert)("Currently displayed suggestions copied to clipboard", 2000, "warning");
          // Auto-clear status after 2s
          window.setTimeout(() => {
            _this2.copyStatus = "";
          }, 2000);
        } catch {
          _this2.copyStatus = "error";
          (0, validationAlert)("Encountered an error while trying to copy", 2000, "warning");
          window.setTimeout(() => {
            _this2.copyStatus = "";
          }, 2500);
        }
      })();
    }
    /**
     * Builds CSV text from the currently displayed rows.
     * Ensures safe CSV by quoting fields and escaping double quotes.
     */
    buildCsvFromRows(rows) {
      const esc = s => {
        const str = String(s ?? "");
        // escape double quotes by doubling them
        const safe = str.replace(/"/g, "\"\"");
        return `"${safe}"`;
      };
      const header = ["Source", "Relation", "Target", "Confidence"];
      const lines = [header.map(esc).join(",")];
      for (const r of rows) {
        // Use the already-rendered labels and score
        lines.push([esc(r.sourceLabel), esc(r.relation), esc(r.targetLabel), esc(r.score.toFixed(3))].join(","));
      }
      return lines.join("\n");
    }
    buildCanonicalTriples(tripletsData) {
      return tripletsData.map(t => ({
        source_id: t.source.id,
        relation: t.link.opm_type,
        target_id: t.target.id,
        source_type: t.source.opm_type,
        target_type: t.target.opm_type,
        source_label: t.source.label,
        target_label: t.target.label,
        link_id: t.link.id
      }));
    }
    /**
     * The main method called from the HTML doing the DistMult Reasoning.
     * It prepares OPM triples, builds vocabularies, trains the DistMult model,
     * and produces top-K missing knowledge suggestions.
     */
    DistMultReasoning() {
      var _this3 = this;
      return (0, default)(function* () {
        try {
          _this3.isLoadingResults = true;
          _this3.clearResults();
          yield _this3.initTfBackend();
          // Step 1: Fetch raw OPM triples (always include exhibitors)
          const rawTriples = yield _this3.createTriplesFromOPM(true);
          // Step 2: Canonicalize
          const canonicalTriples = _this3.buildCanonicalTriples(rawTriples);
          // Step 3: Vocab + encode
          const vocab = _this3.buildVocab(canonicalTriples);
          const encodedAll = _this3.encodeTriples(canonicalTriples, vocab);
          const {
            train
          } = _this3.splitTriples(encodedAll);
          // Step 4: Train DistMult
          const model = yield _this3.trainDistMult(vocab.id2entity.length, vocab.id2relation.length, train, {
            dim: 64,
            lr: 0.01,
            epochs: 30,
            batchSize: 1024,
            negativesPerPos: 8,
            l2: 0.000001
          });
          // Step 5: Raw suggestions → attach labels (NO threshold here)
          const suggestions = _this3.suggestTopKPerHead(model, vocab, canonicalTriples, encodedAll, 5);
          const idToLabel = _this3.buildIdToLabelMap(canonicalTriples);
          const prettyAll = suggestions.filter(s => s.source_id !== s.target_id).map(s => {
            return {
              ...s,
              source_label: idToLabel.get(s.source_id) ?? s.source_id,
              target_label: idToLabel.get(s.target_id) ?? s.target_id
            };
          }).sort((a, b) => b.score - a.score);
          // Cache and display with the current threshold
          _this3.latestPrettySuggestions = prettyAll;
          _this3.presentResults(_this3.latestPrettySuggestions, _this3.minScore);
          _this3.isLoadingResults = false;
        } catch (err) {
          console.error("Error during DistMult reasoning:", err);
          _this3.isLoadingResults = false;
        }
      })();
    }
    /**
     * Handle threshold control changes (range or number input).
     * Re-renders the table using the new threshold without retraining.
     */
    onThresholdChange(value) {
      const v = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(v)) {
        return;
      }
      // clamp to [0,1]
      this.minScore = Math.min(1, Math.max(0, v));
      // Re-apply threshold if we already have suggestions
      if (this.latestPrettySuggestions && this.latestPrettySuggestions.length > 0) {
        this.presentResults(this.latestPrettySuggestions, this.minScore);
      }
    }
    /**
     * Clears the current result table and resets the info banner.
     */
    clearResults() {
      this.resultRows = [];
      this.resultInfo = {
        total: 0,
        threshold: 0
      };
    }
    /**
     * Returns a CSS class for an entity label.
     * Process detection rules:
     *  1) explicit trailing "()" → process
     *  2) last word ends with "-ing" (case-insensitive) → process
     * Otherwise: object.
     */
    classifyEntity(label) {
      if (!label) {
        return "entity-object";
      }
      // normalize and strip trailing "()"
      const trimmed = label.trim();
      const noParens = trimmed.replace(/\(\)\s*$/, ""); // "Ok Updating ()" -> "Ok Updating"
      // get last word
      const parts = noParens.split(/\s+/);
      const last = parts.length ? parts[parts.length - 1] : "";
      // rule 1: explicit "()"
      if (/\(\)\s*$/.test(trimmed)) {
        return "entity-process";
      }
      // rule 2: last word ends with "-ing" (ignore punctuation)
      const lastClean = last.replace(/[.,;:!?'"’”)\]]+$/, ""); // strip trailing punctuation
      if (/^[A-Za-z]+ing$/i.test(lastClean)) {
        return "entity-process";
      }
      // default: object
      return "entity-object";
    }
    /**
     * Converts the pretty suggestions into table rows and updates the UI state.
     * Shows only correct names and data.
     */
    presentResults(pretty, minScore) {
      const rows = [];
      for (const s of pretty) {
        if (s.score < minScore) {
          continue;
        }
        const sourceLabel = s.source_label ?? s.source_id;
        const targetLabel = s.target_label ?? s.target_id;
        if (!sourceLabel || !targetLabel || !s.relation) {
          continue;
        }
        rows.push({
          sourceLabel,
          relation: s.relation,
          targetLabel,
          score: s.score,
          sourceId: s.source_id,
          targetId: s.target_id,
          sourceClass: this.classifyEntity(sourceLabel),
          targetClass: this.classifyEntity(targetLabel)
        });
      }
      this.resultRows = rows;
      this.resultInfo = {
        total: rows.length,
        threshold: minScore
      };
    }
    /**
     * Builds a quick map from entity id → human label for readable output.
     * Falls back to the id itself if no label exists.
     */
    buildIdToLabelMap(canonical) {
      const m = new Map();
      for (const row of canonical) {
        if (row.source_id && row.source_label && !m.has(row.source_id)) {
          m.set(row.source_id, row.source_label);
        }
        if (row.target_id && row.target_label && !m.has(row.target_id)) {
          m.set(row.target_id, row.target_label);
        }
      }
      return m;
    }
    /**
     * Builds numeric vocabularies for entities and relations.
     * Each unique id/relation string maps to a unique integer index.
     */
    buildVocab(triples) {
      const entity2id = new Map();
      const relation2id = new Map();
      const id2entity = [];
      const id2relation = [];
      // The ID used at the DSM flattening - needs to be matched
      const addEntity = id => {
        if (!entity2id.has(id)) {
          entity2id.set(id, id2entity.length);
          id2entity.push(id);
        }
      };
      // Relation tokens must stay stable across runs
      const addRelation = rel => {
        if (!relation2id.has(rel)) {
          relation2id.set(rel, id2relation.length);
          id2relation.push(rel);
        }
      };
      // Populate vocabularies from canonical triples
      for (const t of triples) {
        addEntity(t.source_id);
        addEntity(t.target_id);
        addRelation(t.relation);
      }
      return {
        entity2id,
        id2entity,
        relation2id,
        id2relation
      };
    }
    /**
     * Encodes string-based triples into integer-based triples using vocabularies.
     * Example: "obj123 AggregationOf proc456" → {h: 10, r: 2, t: 35}
     */
    encodeTriples(triples, vocab) {
      const out = [];
      for (const t of triples) {
        const h = vocab.entity2id.get(t.source_id);
        const r = vocab.relation2id.get(t.relation);
        const tt = vocab.entity2id.get(t.target_id);
        // Skip self-loops unless intentionally allowed
        if (h !== undefined && r !== undefined && tt !== undefined && h !== tt) {
          out.push({
            h,
            r,
            t: tt
          });
        }
      }
      return out;
    }
    /**
     * Deterministically splits triples into 80/10/10 train/valid/test partitions.
     * Uses a lightweight hash so the same triple always maps to the same set.
     */
    splitTriples(encoded) {
      // Lightweight deterministic hash
      const djb2 = s => {
        let h = 5381;
        for (let i = 0; i < s.length; i++) {
          h = (h << 5) + h + s.charCodeAt(i);
        }
        return h >>> 0;
      };
      const keyOf = e => {
        return `${e.h}|${e.r}|${e.t}`;
      };
      const train = [];
      const valid = [];
      const test = [];
      for (const e of encoded) {
        const hash = djb2(keyOf(e)) % 100;
        if (hash < 80) {
          train.push(e);
        } else if (hash < 90) {
          valid.push(e);
        } else {
          test.push(e);
        }
      }
      return {
        train,
        valid,
        test
      };
    }
    /**
     * Generates negative samples by randomly corrupting either the head or the tail entity.
     * Used to teach the model to distinguish valid vs. invalid triples.
     */
    sampleNegatives(train, N, k) {
      const out = [];
      for (const e of train) {
        for (let i = 0; i < k; i++) {
          const corruptHead = i % 2 === 0;
          if (corruptHead) {
            out.push({
              h: Math.floor(Math.random() * N),
              r: e.r,
              t: e.t
            });
          } else {
            out.push({
              h: e.h,
              r: e.r,
              t: Math.floor(Math.random() * N)
            });
          }
        }
      }
      return out;
    }
    /**
     * Trains the DistMult model using TensorFlow.js (Node).
     * Learns entity/relation embeddings so valid triples score higher than random negatives.
     */
    trainDistMult(N, R, train, params = {}) {
      var _this4 = this;
      return (0, default)(function* () {
        const dim = params.dim ?? 64; // embedding dimension
        const lr = params.lr ?? 0.01; // learning rate
        const epochs = params.epochs ?? 30; // training epochs
        const batchSize = params.batchSize ?? 1024;
        const negK = params.negativesPerPos ?? 8;
        const l2 = params.l2 ?? 0.000001;
        // Initialize embeddings
        const E = variable(randomNormal([N, dim], 0, 0.1)); // Entity embeddings
        const Remb = variable(randomNormal([R, dim], 0, 0.1)); // Relation embeddings
        const optimizer = train_train.adam(lr);
        /**
         * Computes DistMult scores for a batch of triples.
         * score(h,r,t) = sum( E[h] * R[r] * E[t] )
         */
        const scoreBatch = (h, r, t) => {
          const Eh = gather(E, h);
          const Er = gather(Remb, r);
          const Et = gather(E, t);
          const prod = mul(mul(Eh, Er), Et); // elementwise multiply
          return sum_sum(prod, 1); // sum across embedding dim
        };
        // Training loop
        for (let epoch = 0; epoch < epochs; epoch++) {
          const negatives = _this4.sampleNegatives(train, N, negK);
          const all = train.concat(negatives);
          // 1 = positive, 0 = negative
          const labels = new Float32Array(all.length);
          for (let i = 0; i < train.length; i++) {
            labels[i] = 1;
          }
          for (let i = 0; i < all.length; i += batchSize) {
            const slice = all.slice(i, i + batchSize);
            const H = tensor1d(slice.map(e => e.h), "int32");
            const Rr = tensor1d(slice.map(e => e.r), "int32");
            const T = tensor1d(slice.map(e => e.t), "int32");
            const y = tensor1d(labels.slice(i, i + slice.length));
            yield optimizer.minimize(() => {
              const logits = scoreBatch(H, Rr, T);
              // NOTE: tf.losses.sigmoidCrossEntropy is the correct API in tfjs-node
              const loss = mean(ops_losses.sigmoidCrossEntropy(y, logits));
              const reg = add_add(sum_sum(square(E)), sum_sum(square(Remb))).mul(l2);
              return add_add(loss, reg);
            }, true);
            globals_dispose([H, Rr, T, y]);
          }
        }
        return {
          E,
          R: Remb,
          scoreBatch,
          scoreTriple: (h, r, t) => {
            const s = globals_tidy(() => {
              const H = tensor1d([h], "int32");
              const Rr = tensor1d([r], "int32");
              const T = tensor1d([t], "int32");
              const sc = scoreBatch(H, Rr, T);
              return sc.dataSync()[0];
            });
            return s;
          }
        };
      })();
    }
    /**
     * Produces top-K predicted missing links per head entity for relations observed with that head.
     * Filters out already-existing edges so we only suggest new candidates and avoids self-loops.
     */
    suggestTopKPerHead(model, vocab, triples, encodedAll, K = 5) {
      // Build a set of existing edges for O(1) checks
      const existing = new Set(encodedAll.map(e => `${e.h}|${e.r}|${e.t}`));
      // For each relation, pre-collect tails observed somewhere in the graph
      const relationToTargets = new Map();
      for (const e of encodedAll) {
        if (!relationToTargets.has(e.r)) {
          relationToTargets.set(e.r, new Set());
        }
        relationToTargets.get(e.r).add(e.t);
      }
      // Group canonical rows by head (source)
      const byHead = new Map();
      for (const tr of triples) {
        const h = vocab.entity2id.get(tr.source_id);
        if (!byHead.has(h)) {
          byHead.set(h, []);
        }
        byHead.get(h).push(tr);
      }
      const out = [];
      for (const [h, rows] of byHead.entries()) {
        // Collect relations used by this head
        const rels = new Set(rows.map(rw => vocab.relation2id.get(rw.relation)));
        for (const r of rels) {
          const candidateTails = relationToTargets.get(r) ?? new Set();
          const scored = [];
          for (const t of candidateTails) {
            // Skip if already in graph
            if (existing.has(`${h}|${r}|${t}`)) {
              continue;
            }
            // Skip self-loops (head == tail)
            if (h === t) {
              continue;
            }
            const s = model.scoreTriple(h, r, t); // raw DistMult score
            scored.push({
              t,
              s
            });
          }
          // Keep top-K
          scored.sort((a, b) => b.s - a.s);
          for (const {
            t,
            s
          } of scored.slice(0, K)) {
            out.push({
              source_id: vocab.id2entity[h],
              relation: vocab.id2relation[r],
              target_id: vocab.id2entity[t],
              score: 1 / (1 + Math.exp(-s)) // sigmoid normalization → [0,1]
            });
          }
        }
      }
      return out;
    }
    /**
     * Initialize TFJS backend once (webgl preferred in browsers).
     */
    initTfBackend() {
      return (0, default)(function* () {
        try {
          yield setBackend("webgl");
        } catch {
          yield setBackend("cpu");
        }
        yield ready();
      })();
    }
    /**
     * The main method called from the HTML to compute Model Informativity (MIL/MIA).
     * It parses the model's OPL, classifies MFSP per sentence, extracts IEFs,
     * computes INF per sentence, and aggregates WINF/TWINF for the dashboard.
     */
    runModelGrading() {
      var _this5 = this;
      return (0, default)(function* () {
        try {
          _this5.milLoading = true;
          _this5.milSnapshot = null;
          // --- Acquire OPL from service ---
          const params = [_this5.initRappidService.opmModel.name, false, null, false];
          const modelOplRaw = yield _this5.exportOPLService.exportOPL(params);
          // --- Clean OPL: remove "OPL Spec:" header + collapse duplicates/spaces ---
          const modelOpl = modelOplRaw.replace(/^\s*OPL\s+Spec\s*:?\s*/i, "") // drop leading header if present
          .replace(/,\s*,+/g, ", ") // collapse repeated commas
          // de-duplicate immediately repeated list items inside comma-separated lists
          .replace(/((?:^|\s)(?:[^,]+))(?:,\s*\1\b)+/gm, (_m, g1) => g1);
          // --- Parse OPL to hierarchical sentences ---
          const sentences = _this5.parseOplSentences(modelOpl);
          // Build path label index for Path IEF
          _this5.pathLabelToSentences.clear();
          for (let i = 0; i < sentences.length; i++) {
            const line = sentences[i].raw;
            const m = line.match(/^\s*Following path\s+([^,]+),/i);
            if (m && m[1]) {
              const label = m[1].trim();
              if (!_this5.pathLabelToSentences.has(label)) {
                _this5.pathLabelToSentences.set(label, []);
              }
              _this5.pathLabelToSentences.get(label).push(i);
            }
          }
          // --- Classify MFSP, extract IEFs, compute INF ---
          const scored = sentences.map((s, idx) => {
            const {
              name,
              family
            } = _this5.detectMfspNameAndFamily(s.raw);
            const iefs = _this5.extractIefs(s, family);
            const mfspInf = _this5.mfspBaseInf(name);
            const winfPatterns = _this5.computeWinfPatterns(s, name, iefs, idx);
            const twinf = winfPatterns * 0.6; // patterns category weight (uncertainty/meta not applied)
            return {
              ...s,
              mfspFamily: family,
              mfspName: name,
              iefs,
              mfspInf,
              winfPatterns,
              twinf
            };
          });
          // --- Aggregate to MIL snapshot ---
          _this5.milSnapshot = _this5.aggregateMil(scored);
        } catch (err) {
          console.error("Model grading failed:", err);
          _this5.milSnapshot = null;
        } finally {
          _this5.milLoading = false;
        }
      })();
    }
    /**
     * Split OPL to atomic sentences and derive hierarchical numbering via indentation.
     * Tabs define depth; otherwise groups of ≥2 spaces approximate depth.
     */
    parseOplSentences(opl) {
      const lines = (opl || "").split(/\r?\n/).map(l => l.trimEnd()).filter(l => !!l && !/^\s*#/.test(l)); // ignore blank & comment lines
      const items = [];
      const counters = []; // per depth
      for (const rawLine of lines) {
        // Derive depth
        const mTab = rawLine.match(/^(\t+)/);
        let depth = 0;
        if (mTab) {
          depth = mTab[1].length;
        } else {
          const mSp = rawLine.match(/^( {2,})/); // 2+ spaces as depth
          depth = mSp ? Math.floor(mSp[1].length / 2) : 0;
        }
        // Remove indentation, keep sentence
        const text = rawLine.replace(/^(\t+| {2,})/, "").trim();
        // Maintain hierarchical counters per depth
        if (counters.length <= depth) {
          while (counters.length <= depth) {
            counters.push(0);
          }
        } else {
          counters.splice(depth + 1); // drop deeper levels
        }
        counters[depth] += 1;
        for (let i = depth + 1; i < counters.length; i++) {
          counters[i] = 0;
        }
        // Build number like "1.2.3"
        const number = counters.slice(0, depth + 1).join(".");
        items.push({
          raw: text,
          number,
          depth,
          parentPath: []
        });
      }
      return items;
    }
    /**
     * Classify a sentence into an MFSP family using OPL phrase patterns
     * (ISO/Book aligned, domain-agnostic).
     */
    detectMfspNameAndFamily(s) {
      const t = s.toLowerCase();
      // ---- Thing definitions (ISO Annex A, Book) ----
      if (/\bcan be\b/.test(t)) {
        return {
          name: "State Set Definition",
          family: "ThingDef"
        };
      }
      if (/\bis\s*(initial|final)\b/.test(t) || /\bis\b[^.]*\bor\s+at\s+one\s+other\s+state\b/.test(t) || /\bis\b[^.]*\bstate\b/.test(t) // e.g., "X is staged.", "X is loaded state."
      ) {
        return {
          name: "State Description",
          family: "ThingDef"
        };
      }
      if (/\bis\b.*\b(informatical|physical)\b/.test(t) || /\bis\b.*\b(systemic|environmental)\b/.test(t) || /\bis stateful\b/.test(t) || /\bis value\b/.test(t)) {
        return {
          name: "Object Definition",
          family: "ThingDef"
        };
      }
      // ---- Structural (Aggregation/Exhibition/Generalization/Classification/Unfolding) ----
      if (/\bconsists of\b/.test(t) || /\blists?\s+.*\s+as parts\b/.test(t)) {
        return {
          name: "Aggregation-Participation",
          family: "Structural"
        };
      }
      if (/\bexhibits?\b/.test(t)) {
        return {
          name: "Exhibition-Characterization",
          family: "Structural"
        };
      }
      if (/\bis an?\s+instance of\b/.test(t) || /\bare instances of\b/.test(t)) {
        return {
          name: "Classification-Instantiation",
          family: "Structural"
        };
      }
      // Generic "X is a/an Y." → Classification–Instantiation (avoid clashes with other defs)
      if (/\bis an?\s+[a-z0-9][^.,;]*\b/.test(t) &&
      // "X is a Y"
      !/\bis an?\s+instance of\b/.test(t) &&
      // not the explicit instance form (already handled)
      !/\bis\s+(value|stateful)\b/.test(t) &&
      // not value/stateful (handled as Object Definition)
      !/\bis\b[^.]*\b(informatical|physical|systemic|environmental)\b/.test(t) // not essence/affiliation
      ) {
        return {
          name: "Classification-Instantiation",
          family: "Structural"
        };
      }
      // Generalization–Specialization (ISO/Book):
      //  - “X is a <type>” / “X is an <type>”
      //  - “X, Y, and Z are <Super>”  (no requirement for plural “s”)
      //  - “X and Y are <Super>”
      //  - Also keep explicit plural “types” form.
      if (/\bis an?\s+.*type\b/.test(t) ||
      // "X is a <type>"
      /\bare\s+.*types\b/.test(t) ||
      // "X and Y are <types>"
      /(?:[^,]+,\s+){1,}[^,]+\s+are\s+[^.]+/.test(t) ||
      // "A, B, C are D"
      /\b[^,]+?\s+and\s+[^,]+?\s+are\s+[^.]+/.test(t) // "A and B are D"
      ) {
        return {
          name: "Generalization-Specialization",
          family: "Structural"
        };
      }
      if (/\brelates to\b/.test(t)) {
        return {
          name: "Unidirectional Tagged Relation",
          family: "Structural"
        };
      }
      if (/\bare equivalent\b/.test(t)) {
        return {
          name: "Bidirectional Tagged Relation",
          family: "Structural"
        };
      }
      // unfolding forms (ISO/Book): part-unfolds / specialization-unfolds / states-unfolds (+ optional "feature-unfolds")
      if (/\b(?:part|specialization|states|feature)[- ]unfolds?\s+in\b/.test(t)) {
        return {
          name: "Generalization-Specialization",
          family: "Structural"
        };
      }
      // ---- Procedural (participation/transform/control) ----
      // Agent/Instrument/Consumption/Result/Effect/State Change/Event/Condition/In-zooming
      if (/\bhandles?\b/.test(t)) {
        return {
          name: "Agent Link",
          family: "Procedural"
        };
      }
      if (/\brequires\b/.test(t)) {
        return {
          name: "Instrument Link",
          family: "Procedural"
        };
      }
      if (/\bconsumes?\b/.test(t)) {
        return {
          name: "Consumption Link",
          family: "Procedural"
        };
      }
      if (/\byields?\b/.test(t)) {
        return {
          name: "Result Link",
          family: "Procedural"
        };
      }
      if (/\b(affects?|enhances|increases|decreases|reduces)\b/.test(t)) {
        return {
          name: "Effect Link",
          family: "Procedural"
        };
      }
      if (
      // Generic "changes ... from ... to ..." (no requirement to mention the word "state")
      /\bchanges?\b[^.]*\bfrom\b[^.]*\bto\b/i.test(t) ||
      // One-sided forms (keep support for explicit "state" wording as well)
      /\bchanges?\b[^.]*\bfrom(?:\s+state)?\b/i.test(t) || /\bchanges?\b[^.]*\bto(?:\s+state)?\b/i.test(t)) {
        return {
          name: "State Change",
          family: "Procedural"
        };
      }
      if (/\btriggers?\b/.test(t) && /\bwhen it lasts\b/.test(t)) {
        return {
          name: "Exception Link",
          family: "Precedence"
        };
      }
      if (/\btriggers?\b/.test(t)) {
        return {
          name: "Event",
          family: "Procedural"
        };
      }
      if (/\boccurs?\s+if\b/.test(t) || /\bdepends\s+on\b/.test(t)) {
        return {
          name: "Condition Link",
          family: "Procedural"
        };
      }
      if (/\binvokes?\b/.test(t)) {
        return {
          name: "Invocation Link",
          family: "Precedence"
        };
      }
      if (/\bzooms?\s+in(to)?\b/.test(t)) {
        return {
          name: "In-zooming",
          family: "Precedence"
        };
      }
      // ---- Meta ----
      if (/\bassumption\b|\bnote\b|\bconstraint\b|\bremark\b/.test(t) || /\bis a view opd\b/.test(t) || /\bderived from\b/.test(t) || /\b\bo?pd\b/.test(t)) {
        return {
          name: "Unknown",
          family: "Meta"
        };
      }
      return {
        name: "Unknown",
        family: "Unknown"
      };
    }
    /**
     * Extract Informativity-Enhancing Factors (IEFs) deterministically from OPL text.
     * No domain lexicons; purely OPL semantics so it remains model-agnostic.
     */
    extractIefs(s, _mfsp) {
      const t = s.raw;
      const hasRoles = /\bhandles?\b|\brequires\b|\bconsumes?\b|\byields?\b|\baffects?\b|\bpatient\b|\bcondition\b/i.test(t);
      const hasValuesOrUnits = /\bis value\b/i.test(t) || /\b(ms|cm|mm|kg|s|sec|msec|percent|%)\b/i.test(t) || /{[^}]+}/.test(t);
      const hasStates = /\bcan be\b/i.test(t) || /\bstateful\b/i.test(t) || /\bstate\b/i.test(t);
      const hasPrecedence = /\binvokes?\b/i.test(t) || /\b(over|under)[- ]time exception\b/i.test(t) || /\bwhich occur(s)? in that time sequence\b/i.test(t) || /\bwhich occur(s)? at time interval\b/i.test(t) || /\bwhich occur(s)? in parallel\b/i.test(t);
      const hasMeta = /\bassumption\b|\bnote\b|\bconstraint\b|\bremark\b/i.test(t);
      return {
        hasRoles,
        hasValuesOrUnits,
        hasStates,
        hasPrecedence,
        hasMeta
      };
    }
    /** MFSP base INF per thesis table */
    mfspBaseInf(name) {
      const map = {
        "Object Definition": 0,
        "Process Definition": 0,
        "State Set Definition": 0.25,
        "State Description": 0.5,
        "Aggregation-Participation": 0.5,
        "Exhibition-Characterization": 0.5,
        "Generalization-Specialization": 0.25,
        "Classification-Instantiation": 0.25,
        "Unidirectional Tagged Relation": 0.5,
        "Bidirectional Tagged Relation": 0.5,
        "Agent Link": 0.5,
        "Instrument Link": 0.75,
        "Result Link": 1,
        "Consumption Link": 0.75,
        "Effect Link": 0.5,
        "State Change": 1,
        Event: 0.75,
        "Condition Link": 1,
        "Invocation Link": 1,
        "Exception Link": 0.5,
        "In-zooming": 1,
        Unknown: 0
      };
      return map[name] ?? 0;
    }
    /** Patterns IEF weights per thesis */
    computeWinfPatterns(s, mfspName, iefs, sentenceIndex) {
      // Essence / Affiliation heuristics from OPL definitions; default 0 when unknown
      let essenceInf = 0;
      if (/\bis\b.*\b(informatical|physical)\b/i.test(s.raw)) {
        const isPhysical = /\bphysical\b/i.test(s.raw);
        essenceInf = isPhysical ? 1 : 0;
      }
      let affiliationInf = 0;
      if (/\bis\b.*\b(systemic|environmental)\b/i.test(s.raw)) {
        affiliationInf = /\benvironmental\b/i.test(s.raw) ? 1 : 0.5;
      }
      const stateInf = /\bfrom\b\s+.*\bto\b/.test(s.raw) || /\bcan be\b/.test(s.raw) || /\bstate\b/.test(s.raw) ? 1 : iefs.hasStates ? 1 : 0;
      let pathInf = 0;
      if (/^\s*Following path\s+([^,]+),/i.test(s.raw)) {
        const m = s.raw.match(/^\s*Following path\s+([^,]+),/i);
        const label = m && m[1] ? m[1].trim() : "";
        if (label) {
          const arr = this.pathLabelToSentences.get(label) || [];
          if (arr.length > 1) {
            pathInf = 1;
          }
        }
      }
      let logicInf = 0;
      const andCount = (s.raw.match(/\band\b/gi) || []).length;
      const orCount = (s.raw.match(/\bor\b/gi) || []).length;
      const eitherCount = (s.raw.match(/\beither\b/gi) || []).length;
      const numItems = s.raw.split(/,|\band\b|\bor\b|\beither\b/i).length;
      if (eitherCount > 0 || /\bxor\b/i.test(s.raw)) {
        logicInf = Math.min(1, Math.max(2, numItems - 1) * 0.2);
      } else if (orCount > 0) {
        logicInf = Math.min(1, Math.max(2, numItems - 1) * 0.3);
      } else if (andCount > 0) {
        logicInf = Math.min(1, Math.max(2, numItems - 1) * 0.1);
      }
      const mfspInf = this.mfspBaseInf(mfspName);
      const weighted = (mfspInf * 30 + essenceInf * 10 + affiliationInf * 10 + stateInf * 20 + pathInf * 20 + logicInf * 10) / 100;
      return Math.max(0, Math.min(1, weighted));
    }
    /**
     * Aggregate sentence scores to per-family WINF and overall totals (TWINF/WINF/INF avg).
     */
    aggregateMil(sentences) {
      const families = ["ThingDef", "Structural", "Procedural", "Precedence", "Meta", "Unknown"];
      const byFamily = {};
      for (const f of families) {
        byFamily[f] = {
          count: 0,
          winf: 0
        };
      }
      let sum = 0;
      for (const s of sentences) {
        byFamily[s.mfspFamily].count += 1;
        byFamily[s.mfspFamily].winf += s.twinf;
        sum += s.twinf;
      }
      const count = sentences.length || 1;
      const winf = sum;
      const twinf = sum;
      const infAvg = sum / count;
      return {
        sentences,
        families,
        byFamily,
        totals: {
          twinf,
          winf,
          infAvg,
          count
        }
      };
    }
    /**
     * Returns MIL sentences filtered by MFSP and minimum INF.
     * Replaces the milFilterPipe usage so no extra class is needed.
     */
    get filteredMilSentences() {
      const arr = this.milSnapshot?.sentences ?? [];
      const mf = (this.milFilter?.mfsp || "").trim();
      const min = typeof this.milFilter?.minInf === "number" ? this.milFilter.minInf : 0;
      const out = [];
      for (const s of arr) {
        if (mf && s?.mfspFamily !== mf) {
          continue;
        }
        if (typeof s?.twinf === "number" && s.twinf < min) {
          continue;
        }
        out.push(s);
      }
      return out;
    }
    /**
     * Export the current MIL snapshot (totals, MFSP distribution, sentence-level INF)
     * to an Excel workbook with three sheets: Totals, MFSP Distribution, Sentences.
     * If no results exist yet, warns the user to run grading first.
     */
    downloadMilExcel() {
      try {
        // Guard
        if (!this.milSnapshot) {
          if (typeof validationAlert === "function") {
            (0, validationAlert)("No grading results yet. Please run Model Grading first.", 2500, "warning");
          }
          return;
        }
        const snap = this.milSnapshot;
        // ---------- Sheet 1: Totals ----------
        const totalsRows = [{
          Metric: "TWINF (Total)",
          Value: snap.totals?.twinf ?? ""
        }, {
          Metric: "WINF (Overall)",
          Value: snap.totals?.winf ?? ""
        }, {
          Metric: "INF Avg",
          Value: snap.totals?.infAvg ?? ""
        }, {
          Metric: "OPL Sentences",
          Value: snap.totals?.count ?? ""
        }];
        const wsTotals = utils.json_to_sheet(totalsRows, {
          header: ["Metric", "Value"]
        });
        wsTotals["!cols"] = [{
          wch: 22
        }, {
          wch: 18
        }];
        // ---------- Sheet 2: MFSP Distribution ----------
        const distRows = [];
        for (const [k, v] of Object.entries(snap.byFamily)) {
          distRows.push({
            MFSP: k,
            Count: v.count,
            WINF: Number(v.winf || 0)
          });
        }
        // keep order similar to UI
        distRows.sort((a, b) => a.MFSP.localeCompare(b.MFSP));
        const wsDist = utils.json_to_sheet(distRows, {
          header: ["MFSP", "Count", "WINF"]
        });
        wsDist["!cols"] = [{
          wch: 18
        }, {
          wch: 10
        }, {
          wch: 12
        }];
        // ---------- Sheet 3: Sentences ----------
        const sentRows = (this.milSnapshot.sentences || []).map(s => ({
          Number: s.number,
          MFSP_Family: s.mfspFamily,
          MFSP_Name: s.mfspName,
          MFSP_INF: s.mfspInf,
          WINF_Patterns: s.winfPatterns,
          TWINF: s.twinf,
          OPL: s.raw
        }));
        const wsSent = utils.json_to_sheet(sentRows, {
          header: ["Number", "MFSP_Family", "MFSP_Name", "MFSP_INF", "WINF_Patterns", "TWINF", "OPL"]
        });
        // Auto-fit columns (cap long OPL width)
        wsSent["!cols"] = [{
          wch: 8
        },
        // Number
        {
          wch: 12
        },
        // MFSP_Family
        {
          wch: 20
        },
        // MFSP_Name
        {
          wch: 10
        },
        // MFSP_INF
        {
          wch: 14
        },
        // WINF_Patterns
        {
          wch: 12
        },
        // TWINF
        {
          wch: Math.min(120, Math.max(30, ...sentRows.map(r => r.OPL ? String(r.OPL).length : 0)))
        }];
        // ---------- Build workbook ----------
        const wb = utils.book_new();
        utils.book_append_sheet(wb, wsTotals, "Totals");
        utils.book_append_sheet(wb, wsDist, "MFSP Distribution");
        utils.book_append_sheet(wb, wsSent, "Sentences");
        // ---------- Filename ----------
        const modelName = (this.initRappidService?.opmModel?.name ?? "opm_model").toString().trim().replace(/[\\/:*?"<>|]+/g, "_");
        const fname = `${modelName}_grading.xlsx`;
        // ---------- Save ----------
        writeFileSync(wb, fname);
      } catch (err) {
        console.error("MIL Excel export failed:", err);
        if (typeof validationAlert === "function") {
          (0, validationAlert)("Excel export failed. See console for details.", 2500, "warning");
        }
      }
    }
    /** Try to read states of a logical object (supports private states_ or a getter). */
    getObjectStatesSafe(obj) {
      if (Array.isArray(obj?.states_)) {
        return obj.states_;
      }
      if (typeof obj?.getStates === "function") {
        const arr = obj.getStates();
        if (Array.isArray(arr)) {
          return arr;
        } else {
          return [];
        }
      }
      return [];
    }
    /**
     * Collect all incoming/outgoing links for an object INCLUDING links that
     * directly attach to its explicit state nodes (if any).
     * Returns flat arrays of link types for incoming/outgoing.
     */
    collectObjectAndStateLinks(obj) {
      const inTypes = [];
      const outTypes = [];
      try {
        // Object-level links
        if (typeof obj?.getLinks === "function") {
          const {
            inGoing,
            outGoing
          } = obj.getLinks() || {
            inGoing: [],
            outGoing: []
          };
          for (const l of inGoing || []) {
            const R = l?.linkType;
            if (typeof R === "number") {
              inTypes.push(R);
            }
          }
          for (const l of outGoing || []) {
            const R = l?.linkType;
            if (typeof R === "number") {
              outTypes.push(R);
            }
          }
        }
        // State-level links (many models connect Consumption/Result to states)
        const states = this.getObjectStatesSafe(obj) || [];
        for (const st of states) {
          if (typeof st?.getLinks === "function") {
            const {
              inGoing,
              outGoing
            } = st.getLinks() || {
              inGoing: [],
              outGoing: []
            };
            for (const l of inGoing || []) {
              const R = l?.linkType;
              if (typeof R === "number") {
                inTypes.push(R);
              }
            }
            for (const l of outGoing || []) {
              const R = l?.linkType;
              if (typeof R === "number") {
                outTypes.push(R);
              }
            }
          }
        }
      } catch (e) {
        // Best-effort: ignore link-collection failures
        console.warn("collectObjectAndStateLinks: failed for object", obj?.id || obj?.lid, e);
      }
      return {
        inTypes,
        outTypes
      };
    }
    /**
     * Derive the StAtt "role" using a pragmatic mapping to Table 1 roles.
     * - If there is any incoming Generalization → 'ontological' (Identifies StAtts ontologically)
     * - Else compute I/O participation:
     *    Inputs  (basis): Consumption / Instrument / Agent
     *    Outputs (controllable): Result / Effect
     *   If both input and output → 'both'; else one side → 'basis' or 'controllable'.
     * - If no signals → 'unknown'
     */
    deriveRoleFromLinks(inTypes, outTypes) {
      const hasIncomingGeneralization = inTypes.includes(linkType.Generalization);
      if (hasIncomingGeneralization) {
        return "ontological";
      }
      // Input (basis) signals (seen anywhere in in/out around the object/states)
      const hasInputSignal = inTypes.includes(linkType.Consumption) || inTypes.includes(linkType.Instrument) || inTypes.includes(linkType.Agent) || outTypes.includes(linkType.Consumption) || outTypes.includes(linkType.Instrument) || outTypes.includes(linkType.Agent);
      // Output (controllable) signals
      const hasOutputSignal = inTypes.includes(linkType.Result) || inTypes.includes(linkType.Effect) || outTypes.includes(linkType.Result) || outTypes.includes(linkType.Effect);
      if (hasInputSignal && hasOutputSignal) {
        return "both";
      } else if (hasInputSignal) {
        return "basis";
      } else if (hasOutputSignal) {
        return "controllable";
      } else {
        return "unknown";
      }
    }
    /**
     * Build CSA rows & summary from the model.
     * Fixes:
     *  - Uses real ID/name: id = obj.lid (fallback to obj.id); name = textForListLogical || text || name.
     *  - Reads explicit states from obj.states_ (fallback to getter).
     *  - Implicit objects use {exists, not exists}.
     * Return type unchanged to avoid breaking your UI.
     */
    /** CSA core: build conceptual state table & summary from the model (paper-aligned) */
    buildConceptualStateAnalysis() {
      // Collect logical objects
      const logicalObjects = (this.initRappidService?.opmModel?.logicalElements || []).filter(elm => elm?.constructor?.name === "OpmLogicalObject" || elm?._type === "OpmLogicalObject");
      const rows = [];
      let explicitObjects = 0;
      let basisCount = 0;
      let controllableCount = 0;
      let bothCount = 0;
      let ontologicalCount = 0; // <-- ADD
      let unknownCount = 0;
      for (const obj of logicalObjects) {
        // ---- id + name (unchanged) ----
        const objectId = obj?.lid && String(obj.lid) || obj?.id && String(obj.id) || "";
        let objectName = "";
        if (typeof obj?.textForListLogical === "string" && obj.textForListLogical.trim().length > 0) {
          objectName = obj.textForListLogical.trim();
        } else if (typeof obj?.text === "string" && obj.text.trim().length > 0) {
          objectName = obj.text.trim();
        } else if (typeof obj?.name === "string" && obj.name.trim().length > 0) {
          objectName = obj.name.trim();
        } else {
          objectName = objectId || "Unnamed Object";
        }
        // ---- states (unchanged) ----
        const explicitStatesArr = this.getObjectStatesSafe(obj);
        let values = [];
        let hasExplicitStates = false;
        let statelessPlaceholder = false;
        if (Array.isArray(explicitStatesArr) && explicitStatesArr.length > 0) {
          hasExplicitStates = true;
          explicitObjects += 1;
          values = explicitStatesArr.map((s, i) => {
            const n = typeof s?.text === "string" && s.text.trim().length > 0 ? s.text.trim() : typeof s?.name === "string" && s.name.trim().length > 0 ? s.name.trim() : String(s?.id ?? "");
            return n;
          }).filter(v => !!v && v.trim().length > 0);
          if (values.length === 0) {
            values = explicitStatesArr.map((_, i) => `state_${i + 1}`);
          }
        } else {
          values = ["exists", "not exists"];
          statelessPlaceholder = true;
        }
        const valueCount = Math.max(1, values.length);
        // ---- links on object + on its states ----
        const {
          inTypes,
          outTypes
        } = this.collectObjectAndStateLinks(obj);
        // Table-1 presence checks
        const hasIncomingGeneralization = inTypes.includes(linkType.Generalization);
        const hasInputSignal = inTypes.includes(linkType.Consumption) || inTypes.includes(linkType.Instrument) || inTypes.includes(linkType.Agent) || outTypes.includes(linkType.Consumption) || outTypes.includes(linkType.Instrument) || outTypes.includes(linkType.Agent);
        const hasOutputSignal = inTypes.includes(linkType.Result) || inTypes.includes(linkType.Effect) || outTypes.includes(linkType.Result) || outTypes.includes(linkType.Effect);
        // === NEW: skip objects that have NO Table-1 signals at all ===
        if (!hasIncomingGeneralization && !hasInputSignal && !hasOutputSignal) {
          // do not push a row; do not affect counts/space
          continue;
        }
        // Role (now that we know the object is relevant)
        const role = this.deriveRoleFromLinks(inTypes, outTypes);
        switch (role) {
          case "basis":
            {
              basisCount += 1;
              break;
            }
          case "controllable":
            {
              controllableCount += 1;
              break;
            }
          case "both":
            {
              bothCount += 1;
              break;
            }
          case "ontological":
            {
              ontologicalCount += 1;
              break;
            }
          // <-- COUNT IT
          default:
            {
              unknownCount += 1;
              break;
            }
        }
        rows.push({
          objectId,
          objectName,
          hasExplicitStates,
          values,
          valueCount,
          states: values,
          stateCount: valueCount,
          role,
          statelessPlaceholder
        });
      }
      const objects = rows.length;
      const implicitObjects = objects - explicitObjects;
      // Conceptual space over the **filtered** set
      let conceptualSpace = 1;
      for (const r of rows) {
        const factor = Math.max(1, r.valueCount);
        if (conceptualSpace > Math.floor(1000000000000 / factor)) {
          conceptualSpace = Math.round(1000000000000);
          break;
        }
        conceptualSpace *= factor;
      }
      const stateAttributes = objects;
      const summary = {
        objects,
        explicitObjects,
        implicitObjects,
        stateAttributes,
        attributes: stateAttributes,
        conceptualSpace,
        basisCount,
        controllableCount,
        bothCount,
        ontologicalCount,
        // <-- RETURN IT
        unknownCount
      };
      return {
        rows,
        summary
      };
    }
    /** Action: run CSA and store results for the UI */
    runCSA() {
      var _this6 = this;
      return (0, default)(function* () {
        try {
          _this6.csaLoading = true;
          _this6.csaResult = null;
          _this6.stVect = null; // reset
          _this6.stAttView = [];
          _this6.stAttOptions = [];
          _this6.selectedStAtts = [];
          _this6.selectedStAttsSet.clear();
          // ----- Build CSA from your model -----
          // Use your existing logic to enumerate all logical objects and their states.
          // Below is a skeleton that matches the expected CsaResult shape.
          _this6.csaResult = _this6.buildConceptualStateAnalysis();
          // Build the paper “View” after CSA
          _this6.stAttView = _this6.buildStateAttributeView();
          _this6.stAttOptions = Array.from(new Set(_this6.stAttView.map(v => v.StateAttribute))).sort();
        } catch (e) {
          console.error("CSA failed:", e);
          _this6.csaResult = null;
        } finally {
          _this6.csaLoading = false;
        }
      })();
    }
    /**
     * Export CSA (paper Table 2) to Excel.
     * Sheet 1: Totals (role counts + conceptual space)
     * Sheet 2: State Attributes (Attribute, Role, #Values, Values)
     */
    downloadCsaExcel() {
      try {
        if (!this.csaResult?.rows?.length) {
          (0, validationAlert)?.("No CSA results. Run CSA first.", 2200, "warning");
          return;
        }
        const wb = utils.book_new();
        // ----- Totals (role counts + conceptual space) -----
        const sum = this.csaResult.summary;
        const totals = [{
          Metric: "StAtts (Attributes)",
          Value: sum.attributes
        }, {
          Metric: "Basic",
          Value: sum.basisCount
        }, {
          Metric: "Controllable",
          Value: sum.controllableCount
        }, {
          Metric: "Both",
          Value: sum.bothCount
        }, {
          Metric: "Ontological",
          Value: sum.ontologicalCount
        }, {
          Metric: "Unknown",
          Value: sum.unknownCount
        }, {
          Metric: "Conceptual Space",
          Value: sum.conceptualSpace
        }];
        const wsTotals = utils.json_to_sheet(totals, {
          header: ["Metric", "Value"]
        });
        wsTotals["!cols"] = [{
          wch: 26
        }, {
          wch: 16
        }];
        utils.book_append_sheet(wb, wsTotals, "CSA Totals");
        // ----- Table 2 rows -----
        const rows = this.csaResult.rows.map(r => {
          const roleLabel = r.role === "basis" ? "Basic" : r.role === "controllable" ? "Controllable" : r.role === "both" ? "Both" : r.role === "ontological" ? "Ontological" : "Unknown";
          const note = r.statelessPlaceholder ? " (stateless: placeholder “existent”)" : "";
          return {
            "State Attribute": r.objectName,
            Role: roleLabel,
            "#Values": r.valueCount,
            Values: r.values.join(" | ") + note
          };
        });
        const wsRows = utils.json_to_sheet(rows, {
          header: ["State Attribute", "Role", "#Values", "Values"]
        });
        wsRows["!cols"] = [{
          wch: 28
        }, {
          wch: 14
        }, {
          wch: 10
        }, {
          wch: 80
        }];
        utils.book_append_sheet(wb, wsRows, "CSA Table 2");
        const modelName = (this.initRappidService?.opmModel?.name ?? "opm_model").toString().trim().replace(/[\\/:*?"<>|]+/g, "_");
        writeFileSync(wb, `${modelName}_CSA.xlsx`);
      } catch (e) {
        console.error("CSA Excel export failed:", e);
        (0, validationAlert)?.("Excel export failed.", 2200, "warning");
      }
    }
    /**
     * Paper “View” for StVect (Table 3 feed): list of (StateAttribute, StateValue, Rank).
     * Uses the `values` as already resolved by the CSA builder:
     *  - explicit states in order as seen
     *  - or the placeholder ['existent'] for stateless objects
     */
    buildStateAttributeView() {
      const out = [];
      if (!this.csaResult?.rows?.length) {
        return out;
      }
      for (const r of this.csaResult.rows) {
        const attr = r.objectName;
        if (r.values && r.values.length > 0) {
          r.values.forEach((val, idx) => {
            out.push({
              StateAttribute: attr,
              StateValue: val,
              Rank: idx
            });
          });
        } else {
          // Defensive: should not happen as we always set values
          out.push({
            StateAttribute: attr,
            StateValue: "exists",
            Rank: 0
          });
          out.push({
            StateAttribute: attr,
            StateValue: "not exists",
            Rank: 1
          });
        }
      }
      return out;
    }
    /** Toggle selection for an attribute (checkbox) */
    toggleStAtt(name, checked) {
      if (checked) {
        if (!this.selectedStAttsSet.has(name)) {
          this.selectedStAttsSet.add(name);
          this.selectedStAtts.push(name);
        }
      } else if (this.selectedStAttsSet.has(name)) {
        this.selectedStAttsSet.delete(name);
        this.selectedStAtts = this.selectedStAtts.filter(x => x !== name);
      }
      this.stVect = null; // reset table until regenerated
    }
    selectAllStAtts() {
      this.selectedStAtts = this.stAttOptions.slice();
      this.selectedStAttsSet = new Set(this.selectedStAtts);
      this.stVect = null;
    }
    clearAllStAtts() {
      this.selectedStAtts = [];
      this.selectedStAttsSet.clear();
      this.stVect = null;
    }
    /** Paper-aligned: Generate State-Vector table (Cartesian product) for selected StAtts. */
    generateStVect() {
      var _this7 = this;
      return (0, default)(function* () {
        try {
          if (!_this7.csaResult?.rows?.length) {
            (0, validationAlert)?.("Run CSA first.", 2200, "warning");
            return;
          }
          if (!_this7.selectedStAtts.length) {
            (0, validationAlert)?.("Select at least one State-Attribute.", 2200, "warning");
            return;
          }
          // Attribute count guard
          if (_this7.selectedStAtts.length > _this7.MAX_STVECT_ATTRS) {
            (0, validationAlert)?.(`Too many attributes selected (${_this7.selectedStAtts.length}). Please select ≤ ${_this7.MAX_STVECT_ATTRS}.`, 3000, "warning");
            return;
          }
          const req = _this7.selectedStAtts.slice();
          const view = _this7.stAttView;
          // Filter only requested attributes
          const reqSet = new Set(req);
          const filtered = view.filter(v => reqSet.has(v.StateAttribute));
          // Group values by attribute & sort by rank
          const byAttr = new Map();
          for (const a of req) {
            byAttr.set(a, []);
          }
          for (const row of filtered) {
            const arr = byAttr.get(row.StateAttribute);
            if (arr) {
              arr.push({
                val: row.StateValue,
                rank: row.Rank
              });
            }
          }
          for (const [a, arr] of byAttr.entries()) {
            if (arr.length === 0) {
              // If an attribute is missing values (shouldn’t happen), assume implicit {exists, not exists}
              byAttr.set(a, [{
                val: "exists",
                rank: 0
              }, {
                val: "not exists",
                rank: 1
              }]);
            } else {
              arr.sort((x, y) => x.rank - y.rank);
            }
          }
          // --- Estimate total rows before generating ---
          let estimate = 1;
          for (const a of req) {
            const len = byAttr.get(a)?.length ?? 0;
            const factor = Math.max(1, len);
            if (estimate > Math.floor(Number.MAX_SAFE_INTEGER / factor)) {
              estimate = Number.MAX_SAFE_INTEGER;
              break;
            }
            estimate *= factor;
          }
          _this7.stVectTotalEstimated = estimate;
          if (estimate === 0) {
            (0, validationAlert)?.("No combinations for the chosen State-Attributes.", 2200, "warning");
            _this7.stVect = {
              columns: req,
              rows: []
            };
            return;
          }
          if (estimate > _this7.MAX_STVECT_ROWS) {
            // Warn and hard-cap
            (0, validationAlert)?.(`The full State-Vector would create ${estimate.toLocaleString()} rows. For performance, showing only the first ${_this7.MAX_STVECT_ROWS.toLocaleString()} rows.`, 4000, "warning");
          }
          // --- Build (capped) Cartesian product deterministically (lexicographic) ---
          const MAX_ROWS = Math.min(estimate, _this7.MAX_STVECT_ROWS);
          const columns = req.slice();
          const rows = [];
          // Iterative index-based generator (no deep recursion)
          const indices = columns.map(() => 0);
          const lengths = columns.map(a => byAttr.get(a)?.length ?? 0);
          let produced = 0;
          // Yield a first row if possible
          const buildRow = () => {
            const obj = {};
            for (let i = 0; i < columns.length; i++) {
              const a = columns[i];
              const arr = byAttr.get(a);
              obj[a] = arr[indices[i]].val;
            }
            return obj;
          };
          if (columns.length > 0) {
            rows.push(buildRow());
            produced += 1;
          }
          // Produce the rest, carrying like an odometer; yield to browser intermittently
          let stepCounter = 0;
          while (produced < MAX_ROWS) {
            // advance last index
            let k = columns.length - 1;
            while (k >= 0) {
              indices[k] += 1;
              if (indices[k] < lengths[k]) {
                break;
              } else {
                indices[k] = 0;
                k -= 1;
              }
            }
            if (k < 0) {
              // wrapped past the first attribute → done
              break;
            }
            rows.push(buildRow());
            produced += 1;
            // Periodically yield to keep UI responsive on large caps
            stepCounter += 1;
            if (stepCounter % 5000 === 0) {
              yield _this7.yieldToBrowser();
            }
          }
          _this7.stVect = {
            columns,
            rows
          };
          _this7.stVectPage = 1;
          if (produced < estimate) {
            // Optional second notice if you want (kept silent because we already alerted)
            // validationAlert?.(`Generated ${produced.toLocaleString()} of ${estimate.toLocaleString()} rows.`, 2500, 'warning');
          }
        } catch (e) {
          console.error("GenerateStVect failed:", e);
          (0, validationAlert)?.("Failed generating State-Vectors.", 2200, "warning");
        }
      })();
    }
    /** Export StVect to Excel (paper Table 2). */
    downloadStVectExcel() {
      try {
        if (!this.stVect?.rows?.length) {
          (0, validationAlert)?.("No State-Vectors. Generate first.", 2200, "warning");
          return;
        }
        const wb = utils.book_new();
        const ws = utils.json_to_sheet(this.stVect.rows, {
          header: this.stVect.columns
        });
        ws["!cols"] = this.stVect.columns.map(() => ({
          wch: 22
        }));
        utils.book_append_sheet(wb, ws, "StVect");
        const modelName = (this.initRappidService?.opmModel?.name ?? "opm_model").toString().trim().replace(/[\\/:*?"<>|]+/g, "_");
        writeFileSync(wb, `${modelName}_StVect.xlsx`);
      } catch (e) {
        console.error("StVect Excel export failed:", e);
        (0, validationAlert)?.("Excel export failed.", 2200, "warning");
      }
    }
    /** DOM-capped suggestions (Missing Knowledge) */
    get displayedResultRows() {
      const arr = this.resultRows ?? [];
      if (this.capMissing && arr.length > this.MAX_TABLE_ROWS) {
        return arr.slice(0, this.MAX_TABLE_ROWS);
      } else {
        return arr;
      }
    }
    /** DOM-capped grading sentences */
    get filteredMilSentencesDisplayed() {
      const arr = this.filteredMilSentences ?? [];
      if (this.capGrading && arr.length > this.MAX_TABLE_ROWS) {
        return arr.slice(0, this.MAX_TABLE_ROWS);
      } else {
        return arr;
      }
    }
    /** DOM-capped CSA rows */
    get csaDisplayedRows() {
      const arr = this.csaResult?.rows ?? [];
      if (this.capCSA && arr.length > this.MAX_TABLE_ROWS) {
        return arr.slice(0, this.MAX_TABLE_ROWS);
      } else {
        return arr;
      }
    }
    showAll(section) {
      if (section === "missing") {
        this.capMissing = false;
      }
      if (section === "grading") {
        this.capGrading = false;
      }
      if (section === "csa") {
        this.capCSA = false;
      }
    }
    recap(section) {
      if (section === "missing") {
        this.capMissing = true;
      }
      if (section === "grading") {
        this.capGrading = true;
      }
      if (section === "csa") {
        this.capCSA = true;
      }
    }
    /** Tiny yield helper to keep UI responsive if we ever loop big */
    yieldToBrowser() {
      return (0, default)(function* () {
        yield new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 0);
        });
      })();
    }
    /** Page count for current StVect */
    get stVectPageCount() {
      const total = this.stVect?.rows?.length || 0;
      return Math.max(1, Math.ceil(total / this.stVectPageSize));
    }
    /** Rows to render for the current page */
    get stVectPageRows() {
      const all = this.stVect?.rows || [];
      const start = (this.stVectPage - 1) * this.stVectPageSize;
      const end = start + this.stVectPageSize;
      return all.slice(start, end);
    }
    /** Reset to page 1 when page size changes */
    onPageSizeChange() {
      this.stVectPage = 1;
    }
    /** Pager buttons */
    goFirst() {
      this.stVectPage = 1;
    }
    goPrev() {
      if (this.stVectPage > 1) {
        this.stVectPage -= 1;
      }
    }
    goNext() {
      if (this.stVectPage < this.stVectPageCount) {
        this.stVectPage += 1;
      }
    }
    goLast() {
      this.stVectPage = this.stVectPageCount;
    }
    /** Escape a value for CSV */
    csvEsc(v) {
      const s = String(v ?? "");
      return `"${s.replace(/"/g, "\"\"")}"`;
    }
    /** Small clipboard helper with your notifier */
    copyText(text, okMsg) {
      return (0, default)(function* () {
        try {
          if (navigator?.clipboard?.writeText) {
            yield navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
          }
          (0, validationAlert)?.(okMsg, 2000, "warning");
        } catch (e) {
          console.error("Clipboard copy failed", e);
          (0, validationAlert)?.("Copy to clipboard failed.", 2500, "warning");
        }
      })();
    }
    /** GRADING: copy KPIs + MFSP distribution + sentence table (filtered) */
    copyGradingToClipboard() {
      var _this8 = this;
      return (0, default)(function* () {
        if (!_this8.milSnapshot) {
          (0, validationAlert)?.("No grading data to copy. Run Model Grading first.", 2500, "warning");
          return;
        }
        const snap = _this8.milSnapshot;
        // --- Totals (KPI) ---
        const kpi = ["--- Model Informativity Grading (MIL/MIA) ---", "Totals", ["Metric", "Value"].join(","), ["TWINF (Total)", _this8.csvEsc(snap?.totals?.twinf ?? "")].join(","), ["WINF (Overall)", _this8.csvEsc(snap?.totals?.winf ?? "")].join(","), ["INF Avg", _this8.csvEsc(snap?.totals?.infAvg ?? "")].join(","), ["OPL Sentences", _this8.csvEsc(snap?.totals?.count ?? "")].join(","), ""];
        // --- MFSP Distribution ---
        const distHeader = ["MFSP Distribution", ["MFSP", "Count", "WINF"].join(",")];
        const distRows = [];
        for (const [k, v] of Object.entries(snap.byFamily)) {
          distRows.push([_this8.csvEsc(k), _this8.csvEsc(v.count), _this8.csvEsc(v.winf)].join(","));
        }
        // --- Sentence table (current filtered view) ---
        const rows = _this8.filteredMilSentences ?? [];
        const tblHeader = ["", "Sentence-Level Informativity", ["#", "OPL Sentence", "MFSP Name", "INF"].join(",")];
        const tblRows = rows.map(s => [_this8.csvEsc(s.number), _this8.csvEsc(s.raw), _this8.csvEsc(s.mfspName), _this8.csvEsc(typeof s.twinf === "number" ? s.twinf.toFixed(3) : "")].join(","));
        const csv = [...kpi, ...distHeader, ...distRows, ...tblHeader, ...tblRows].join("\n");
        yield _this8.copyText(csv, "Grading KPIs and table copied to clipboard.");
      })();
    }
    /**
     * Copy CSA KPIs (role counts + conceptual space) AND the full Table 2 rows
     * to clipboard as CSV, aligned with the paper.
     */
    copyCsaSummaryToClipboard() {
      var _this9 = this;
      return (0, default)(function* () {
        if (!_this9.csaResult?.rows?.length) {
          (0, validationAlert)?.("No CSA results to copy. Run CSA first.", 2500, "warning");
          return;
        }
        const sum = _this9.csaResult.summary;
        const kpi = ["--- Conceptual State Analysis (CSA) ---", "Totals", ["Metric", "Value"].join(","), ["StAtts (Attributes)", _this9.csvEsc(sum.attributes)].join(","), ["Basic", _this9.csvEsc(sum.basisCount)].join(","), ["Controllable", _this9.csvEsc(sum.controllableCount)].join(","), ["Both", _this9.csvEsc(sum.bothCount)].join(","), ["Ontological", _this9.csvEsc(sum.ontologicalCount)].join(","), ["Unknown", _this9.csvEsc(sum.unknownCount)].join(","), ["Conceptual Space", _this9.csvEsc(sum.conceptualSpace)].join(","), ""];
        const header = ["State Attribute", "Role", "#Values", "Values"].map(h => _this9.csvEsc(h)).join(",");
        const rows = _this9.csaResult.rows.map(r => {
          const roleLabel = r.role === "basis" ? "Basic" : r.role === "controllable" ? "Controllable" : r.role === "both" ? "Both" : "Unknown";
          const note = r.statelessPlaceholder ? " (stateless: placeholder “existent”)" : "";
          return [_this9.csvEsc(r.objectName), _this9.csvEsc(roleLabel), _this9.csvEsc(r.valueCount), _this9.csvEsc(r.values.join(" | ") + note)].join(",");
        });
        const csv = [...kpi, header, ...rows].join("\n");
        yield _this9.copyText(csv, "CSA KPIs and Table 2 copied to clipboard.");
      })();
    }
    /** STVECT: copy only the State-Vector table (+ small header) */
    copyStVectToClipboard() {
      var _this10 = this;
      return (0, default)(function* () {
        if (!_this10.stVect?.rows?.length) {
          (0, validationAlert)?.("No State-Vector table to copy. Generate first.", 2500, "warning");
          return;
        }
        const info = ["--- State-Vector Table (StVect) ---", ["Selected StAtts", _this10.csvEsc(_this10.stVect.columns?.length || 0)].join(","), ["Rows", _this10.csvEsc(_this10.stVect.rows?.length || 0)].join(","), _this10.stVectTotalEstimated ? ["Estimated total", _this10.csvEsc(_this10.stVectTotalEstimated)].join(",") : "", ""].filter(Boolean);
        const header = (_this10.stVect.columns || []).map(c => _this10.csvEsc(c)).join(",");
        const rows = _this10.stVect.rows.map(row => (_this10.stVect.columns || []).map(c => _this10.csvEsc(row[c])).join(","));
        const csv = [...info, header, ...rows].join("\n");
        yield _this10.copyText(csv, "State-Vector table copied to clipboard.");
      })();
    }
    static #_ = (() => this.ɵfac = function MissingKnowledgeAnalysisComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MissingKnowledgeAnalysisComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ExportOPLAPIService), core /* ɵɵdirectiveInject */.rXU(ServerFlatteningService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MissingKnowledgeAnalysisComponent,
      selectors: [["opcloud-model-analysis-tools"]],
      decls: 14,
      vars: 6,
      consts: [["id", "whole", 2, "left", "10px", "top", "-30px"], [1, "header"], [1, "h2"], [1, "section-switch", "section-switch--center"], ["mat-raised-button", "", "matTooltip", "Discover likely-but-absent relations by training a link predictor (DistMult / R-GCN) over the model’s knowledge graph.", "matTooltipPosition", "below", 3, "click", "color"], ["mat-raised-button", "", "matTooltip", "Score OPL sentences by MFSP categories and IEFs to get WINF/TWINF and reveal underspecified areas.", "matTooltipPosition", "below", 3, "click", "color"], ["mat-raised-button", "", "matTooltip", "Analyze the model’s conceptual state space using explicit states or the implicit pair {exists, not exists} for each object.", 3, "click", "color"], [4, "ngIf"], ["id", "gradingSection", 4, "ngIf"], ["id", "csaSection", 4, "ngIf"], ["id", "missingKnowledgeLabel"], ["id", "modelTriplets"], [1, "button-row"], ["mat-button", "", "matTooltip", "A very fast matrix-factorization model. Each entity and relation is represented by a learned vector. Great baseline for small or mostly complete OPM models. Can miss higher-order patterns.", 1, "MissingKnowledgeBtn", 3, "click"], ["mat-button", "", "matTooltip", "A graph neural network that extends GCNs to multi-relation graphs. Gives higher link-prediction accuracy. Heavier: seconds–minutes per run, depends on graph size.", 1, "MissingKnowledgeBtn", 3, "click"], ["mat-button", "", "matTooltip", "Download the current suggestions as an Excel file", "matTooltipPosition", "below", 1, "MissingKnowledgeBtn", 2, "margin-left", "10px", 3, "click", "disabled"], [1, "threshold-bar"], ["for", "minScoreInput"], ["id", "minScoreRange", "type", "range", "min", "0", "max", "1", "step", "0.01", 3, "input", "value"], ["id", "minScoreInput", "type", "number", "min", "0", "max", "1", "step", "0.01", 3, "input", "value"], ["id", "resultsArea"], ["class", "loading", 4, "ngIf"], ["class", "results-info", 4, "ngIf"], ["class", "placeholder", 4, "ngIf"], ["class", "table-wrap", 4, "ngIf"], ["matTooltip", "Copy the current suggestions table as CSV to clipboard", "matTooltipPosition", "left", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "20", "height", "20", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectGPath"], ["opacity", "0.7"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M7 9.22222C7 7.99492 7.98969 7 9.21053 7H19.856C21.0768 7 22.0665 7.99492 22.0665 9.22222V18.5033C22.0665 19.7306 21.0768 20.7255 19.856 20.7255H9.21053C7.98969 20.7255 7 19.7306 7 18.5033V9.22222ZM19.856 9.22222L9.21053 9.22222V18.5033H19.856V9.22222Z", "fill", "#1A3763"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.4335 13.2745H25.7895C27.0103 13.2745 28 14.2694 28 15.4967V24.7778C28 26.0051 27.0103 27 25.7895 27H15.144C13.9232 27 12.9335 26.0051 12.9335 24.7778V21.7059H15.144V24.7778H25.7895V15.4967H23.4335V13.2745Z", "fill", "#1A3763"], [1, "loading"], [1, "spinner"], [1, "results-info"], [1, "placeholder"], [1, "table-wrap"], ["aria-label", "Missing knowledge suggestions", 1, "mk-table"], [1, "col-source"], [1, "col-relation"], [1, "col-target"], [1, "col-score"], [1, "left"], [4, "ngFor", "ngForOf"], [1, "wrap", 3, "ngClass", "title"], [1, "wrap"], ["id", "gradingSection"], [1, "grading-wrap"], [1, "mk-subtext"], [1, "button-row", "center"], ["mat-button", "", "matTooltip", "Parse OPL, classify MFSP, compute INF/WINF/TWINF and build grading dashboard.", 1, "MissingKnowledgeBtn", 3, "click"], ["mat-button", "", "matTooltip", "Export the current grading snapshot (WINF/TWINF, MFSP distribution, sentence-level INF) to Excel.", 1, "MissingKnowledgeBtn", 2, "margin-left", "12px", 3, "click"], [1, "mk-card"], ["class", "mk-loading", 4, "ngIf"], ["class", "mk-empty", 4, "ngIf"], ["matTooltip", "Copy grading KPIs + MFSP distribution + sentence table to clipboard", "matTooltipPosition", "left", 2, "margin-left", "8px", 3, "click"], [1, "mk-loading"], [1, "mk-empty"], [1, "mk-kpi-row"], [1, "mk-kpi"], [1, "mk-kpi-label"], [1, "mk-kpi-value"], [1, "mk-block"], [1, "mk-block-title"], ["aria-label", "MFSP distribution", 1, "mk-table"], [2, "width", "50%"], [2, "width", "25%"], [1, "mk-filter-row"], [3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["type", "number", "step", "0.01", "min", "0", "max", "1", 3, "ngModelChange", "ngModel"], ["aria-label", "Sentence informativity", 1, "mk-table"], [2, "width", "10%"], [2, "width", "60%"], [2, "width", "15%"], [3, "value"], [1, "wrap", 3, "title"], ["id", "csaSection"], ["mat-button", "", "matTooltip", "Compute state-attribute counts for all objects (explicit states if defined, otherwise {exists, not exists}).", 1, "MissingKnowledgeBtn", 3, "click", "disabled"], ["mat-button", "", "matTooltip", "Export the current CSA results as Excel.", 1, "MissingKnowledgeBtn", 2, "margin-left", "12px", 3, "click", "disabled"], ["mat-button", "", "matTooltip", "Generate the Cartesian product of selected State-Attributes (StAtts) to produce the State-Vector table (StVect).", 1, "MissingKnowledgeBtn", 2, "margin-left", "24px", 3, "click", "disabled"], ["mat-button", "", "matTooltip", "Export the current State-Vector table (StVect) to Excel.", 1, "MissingKnowledgeBtn", 2, "margin-left", "12px", 3, "click", "disabled"], ["class", "mk-card mk-empty", 4, "ngIf"], ["class", "mk-card", 4, "ngIf"], [1, "mk-card", "mk-empty"], [1, "copy-actions"], ["matTooltip", "Copy CSA KPIs + CSA rows to clipboard", "matTooltipPosition", "left", 3, "click"], ["class", "copy-actions", 4, "ngIf"], ["aria-label", "Conceptual State Analysis", 1, "mk-table"], [2, "width", "28%"], [2, "width", "14%"], [2, "width", "48%"], [1, "h3"], [1, "stv-selector"], [1, "stv-toolbar"], [1, "MissingKnowledgeBtn", "small", 3, "click"], [1, "MissingKnowledgeBtn", "small", 2, "margin-left", "8px", 3, "click"], [1, "stv-count"], [2, "margin-left", "auto", "display", "flex", "align-items", "center", "gap", "10px"], [2, "display", "flex", "align-items", "center", "gap", "6px"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "stv-list"], ["class", "stv-item", 4, "ngFor", "ngForOf"], ["class", "stvect-summary-header", 4, "ngIf"], ["class", "mk-kpi-row", 4, "ngIf"], ["class", "mk-pager", 4, "ngIf"], ["class", "table-wrap table-scroller", 3, "ngClass", 4, "ngIf"], [1, "stv-item"], ["type", "checkbox", 3, "change", "checked"], [3, "title"], [1, "stvect-summary-header"], [1, "mk-block-title", 2, "margin-top", "12px"], [1, "stvect-subtext"], ["class", "mk-kpi", 4, "ngIf"], [1, "mk-pager"], [1, "MissingKnowledgeBtn", "small", 3, "click", "disabled"], [1, "mk-page-indicator"], [1, "table-wrap", "table-scroller", 3, "ngClass"], ["aria-label", "State-Vector Table", 1, "mk-table", "stv-table"], [1, "sticky-col", "stv-col"], ["class", "stv-col", 3, "hidden", 4, "ngFor", "ngForOf"], [1, "stv-col", 3, "hidden"], [1, "sticky-col", "stv-col", "wrap"], ["class", "stv-col wrap", 3, "hidden", 4, "ngFor", "ngForOf"], [1, "stv-col", "wrap", 3, "hidden"], ["matTooltip", "Copy State-Vector table to clipboard", "matTooltipPosition", "left", 3, "click"]],
      template: function MissingKnowledgeAnalysisComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "Model Knowledge");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "button", 4);
          core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_Template_button_click_5_listener() {
            return ctx.selectSection("missing");
          });
          core /* ɵɵtext */.EFF(6, " Identification of Missing Knowledge ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "button", 5);
          core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_Template_button_click_7_listener() {
            return ctx.selectSection("grading");
          });
          core /* ɵɵtext */.EFF(8, " Model Informativity Grading ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "button", 6);
          core /* ɵɵlistener */.bIt("click", function MissingKnowledgeAnalysisComponent_Template_button_click_9_listener() {
            return ctx.selectSection("csa");
          });
          core /* ɵɵtext */.EFF(10, " Conceptual State Analysis ");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(11, MissingKnowledgeAnalysisComponent_div_11_Template, 34, 7, "div", 7)(12, MissingKnowledgeAnalysisComponent_section_12_Template, 22, 3, "section", 8)(13, MissingKnowledgeAnalysisComponent_section_13_Template, 22, 7, "section", 9);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("color", ctx.selectedSection === "missing" ? "primary" : undefined);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("color", ctx.selectedSection === "grading" ? "primary" : undefined);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("color", ctx.selectedSection === "csa" ? "primary" : undefined);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectedSection === "missing");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectedSection === "grading");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectedSection === "csa");
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatTooltip, MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, DecimalPipe, KeyValuePipe],
      styles: [".div[_ngcontent-%COMP%]{position:relative;width:453px;left:50px;top:50px}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:center;padding-bottom:30px}#whole[_ngcontent-%COMP%]   #modelTriplets[_ngcontent-%COMP%]{display:grid;justify-content:center;width:100%;padding-bottom:40px}#missingKnowledgeLabel[_ngcontent-%COMP%]{color:#1a3763;text-align:justify;text-justify:inter-word;-webkit-hyphens:auto;hyphens:auto;word-break:keep-all;max-width:800px;margin:0 auto;line-height:1.6;font-size:16px;padding:20px 10px 40px}#modelTriplets[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;margin-top:20px;gap:10px}.button-row[_ngcontent-%COMP%]{display:flex;justify-content:center;gap:20px;margin-top:10px}.MissingKnowledgeBtn[_ngcontent-%COMP%]{color:#1a3763!important;opacity:.8;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:6px;height:38px;letter-spacing:normal;padding:0 20px;transition:all .2s ease}.MissingKnowledgeBtn[_ngcontent-%COMP%]:hover{opacity:1;background-color:#1a37630d;border-color:#1a3763}.threshold-bar[_ngcontent-%COMP%]{width:980px;margin:12px auto 0;display:flex;align-items:center;gap:12px;color:#1a3763;font-size:14px;justify-content:center}.threshold-bar[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-weight:600}#minScoreRange[_ngcontent-%COMP%]{width:280px}#minScoreInput[_ngcontent-%COMP%]{width:72px;padding:4px 6px;border:1px solid #cfe0ff;border-radius:6px;text-align:left}#resultsArea[_ngcontent-%COMP%]{box-sizing:border-box;width:980px;min-height:260px;max-height:520px;margin:30px auto 0;background-color:#f9fafc;border:1px solid #d9e1f0;border-radius:12px;padding:16px 20px;color:#1a3763;box-shadow:0 2px 6px #0000000d;display:flex;flex-direction:column;gap:10px}#resultsArea[_ngcontent-%COMP%]   .placeholder[_ngcontent-%COMP%]{color:#5a6b85;font-style:italic;margin:auto;text-align:center;width:100%}.results-info[_ngcontent-%COMP%]{margin:0 0 6px;color:#314a73;font-size:14px}.table-wrap[_ngcontent-%COMP%]{box-sizing:border-box;overflow-y:auto;overflow-x:hidden;width:100%;flex:1 1 auto;border-radius:8px;background:#fff;border:1px solid #dfe6f3}#gradingSection[_ngcontent-%COMP%]   .mk-block[_ngcontent-%COMP%]   .table-wrap[_ngcontent-%COMP%]{max-height:520px;overflow-y:auto;border:1px solid #ddd;border-radius:6px}.mk-table[_ngcontent-%COMP%]{box-sizing:border-box;width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed;max-height:520px}.col-source[_ngcontent-%COMP%]{width:40%}.col-relation[_ngcontent-%COMP%]{width:16%}.col-target[_ngcontent-%COMP%]{width:34%}.col-score[_ngcontent-%COMP%]{width:10%}.mk-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{text-align:left;font-weight:600;font-size:14px;padding:10px 12px;background:#eef3fb;border-bottom:1px solid #d9e1f0;white-space:nowrap}.mk-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:10px 12px;font-size:14px;border-bottom:1px solid #eef2f7;vertical-align:top}.mk-table[_ngcontent-%COMP%]   td.wrap[_ngcontent-%COMP%], .mk-table[_ngcontent-%COMP%]   th.wrap[_ngcontent-%COMP%]{white-space:normal;overflow-wrap:anywhere;word-break:break-word}.mk-table[_ngcontent-%COMP%]   th.left[_ngcontent-%COMP%], .mk-table[_ngcontent-%COMP%]   td.left[_ngcontent-%COMP%]{text-align:left}.mk-table[_ngcontent-%COMP%]   th.right[_ngcontent-%COMP%], .mk-table[_ngcontent-%COMP%]   td.right[_ngcontent-%COMP%]{text-align:right}.entity-object[_ngcontent-%COMP%]{color:#2e8b57;font-weight:600}.entity-process[_ngcontent-%COMP%]{color:#1a5fcc;font-weight:600}.loading[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;color:#314a73;font-size:14px;justify-content:center}.spinner[_ngcontent-%COMP%]{width:16px;height:16px;border:2px solid #c5d4ee;border-top-color:#1a3763;border-radius:50%;display:inline-block;animation:_ngcontent-%COMP%_spin .8s linear infinite}@keyframes _ngcontent-%COMP%_spin{to{transform:rotate(360deg)}}#gradingSection[_ngcontent-%COMP%]{margin-top:40px}.grading-wrap[_ngcontent-%COMP%]{max-width:1080px;margin:0 auto;padding:0 16px}.header[_ngcontent-%COMP%]   .h2[_ngcontent-%COMP%]{text-align:center;color:#1a3763}.mk-subtext[_ngcontent-%COMP%]{color:#1a3763;opacity:.9;text-align:center;margin:8px auto 16px;max-width:920px;line-height:1.5}.button-row.center[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-bottom:12px}.mk-card[_ngcontent-%COMP%]{background:#fff;border:1px solid rgba(88,109,140,.25);border-radius:8px;box-shadow:0 1px 2px #1a37630d;padding:16px}.mk-kpi-row[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,minmax(140px,1fr));gap:12px;margin-bottom:12px}.mk-kpi[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.2);border-radius:6px;padding:10px 12px;background:#f8fbff}.mk-kpi-label[_ngcontent-%COMP%]{font-size:12px;color:#5a6c85;margin-bottom:4px}.mk-kpi-value[_ngcontent-%COMP%]{font-size:20px;font-weight:600;color:#1a3763}.mk-block[_ngcontent-%COMP%]{margin-top:18px}.mk-block-title[_ngcontent-%COMP%]{margin:0 0 8px;color:#1a3763;font-size:16px;font-weight:600}.table-wrap[_ngcontent-%COMP%]{width:100%;overflow-x:auto}.mk-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}.mk-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background:#eef4ff;color:#1a3763;text-align:left;padding:10px;border-bottom:1px solid rgba(88,109,140,.35);font-weight:600}.mk-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:10px;border-bottom:1px solid rgba(88,109,140,.18);color:#1a3763;vertical-align:top}.mk-table[_ngcontent-%COMP%]   td.wrap[_ngcontent-%COMP%]{white-space:normal;word-break:break-word}.mk-loading[_ngcontent-%COMP%], .mk-empty[_ngcontent-%COMP%]{color:#5a6c85;text-align:center;padding:24px 8px}.section-switch--center[_ngcontent-%COMP%]{display:flex;justify-content:center;gap:12px;margin:8px 0 20px}.csaResultsArea[_ngcontent-%COMP%]{margin-top:10px;border:1px solid var(--mk-border, #d8d8d8);border-radius:6px;padding:8px;max-height:360px;overflow:auto;background:#fff}.summary-cards[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:12px;margin:10px 0 6px}.summary-cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{border:1px solid var(--mk-border, #d8d8d8);border-radius:6px;padding:8px 10px;min-width:140px;background:#fafafa}.summary-cards[_ngcontent-%COMP%]   .card-key[_ngcontent-%COMP%]{font-size:12px;color:#666}.summary-cards[_ngcontent-%COMP%]   .card-val[_ngcontent-%COMP%]{font-weight:600;margin-top:2px}.section-subtitle[_ngcontent-%COMP%]{margin:8px 0 0;color:#555}#csaSection[_ngcontent-%COMP%]   .mk-card[_ngcontent-%COMP%]   .table-wrap[_ngcontent-%COMP%]{max-height:520px;overflow-y:auto;border:1px solid #dfe6f3;border-radius:8px;background:#fff}.resultsArea[_ngcontent-%COMP%]   .emptyState[_ngcontent-%COMP%]{height:160px;max-height:520px;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:16px;text-align:center;white-space:normal;word-spacing:normal}.resultsArea[_ngcontent-%COMP%]{margin-top:12px}.stv-selector[_ngcontent-%COMP%]{margin-top:12px;border:1px solid #e1e5ef;border-radius:10px;padding:10px 12px;background:#fafbff}.stv-toolbar[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin-bottom:8px}.stv-toolbar[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{padding:6px 10px;font-size:12px}.stv-count[_ngcontent-%COMP%]{margin-left:auto;color:#5b6b8c;font-size:12px}.stv-list[_ngcontent-%COMP%]{max-height:220px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px 14px;padding-right:6px}.stv-item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;font-size:13px;color:#1e355b}#csaSection[_ngcontent-%COMP%]   .table-wrap[_ngcontent-%COMP%]{max-height:420px;overflow:auto}.cap-note[_ngcontent-%COMP%]{margin-top:8px;color:#5a6b85;font-size:13px;display:flex;align-items:center;gap:10px}.MissingKnowledgeBtn.small[_ngcontent-%COMP%]{padding:4px 10px;height:30px;font-size:12px}.table-scroller[_ngcontent-%COMP%]{max-height:420px;overflow:auto}.stv-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{position:sticky;top:0;z-index:3}.sticky-col[_ngcontent-%COMP%]{position:sticky;left:0;z-index:2;background:#fff;box-shadow:2px 0 #0000000d}.stv-col[_ngcontent-%COMP%]{min-width:140px;max-width:260px;white-space:normal;word-break:break-word;overflow-wrap:anywhere}.table-scroller.dense[_ngcontent-%COMP%]   .mk-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .table-scroller.dense[_ngcontent-%COMP%]   .mk-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:6px 8px;font-size:12px}.mk-pager[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin:6px 0 8px;justify-content:center}.mk-page-indicator[_ngcontent-%COMP%]{color:#1a3763;font-weight:500}.stv-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background:#eef4ff}.stv-toolbar[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], .stv-toolbar[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;color:#1a3763}.stv-toolbar[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%]{transform:scale(1.1);margin-right:6px}.stv-toolbar[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{border:1px solid #ccd3e0;border-radius:4px;background-color:#fff;padding:2px 6px;font-size:14px;color:#1a3763}.stv-toolbar[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;font-weight:400}.stv-toolbar[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}.stvect-summary-header[_ngcontent-%COMP%]{margin-top:20px;margin-bottom:8px;border-top:1px solid rgba(0,0,0,.08);padding-top:12px}.stvect-headline[_ngcontent-%COMP%]{font-size:15px;font-weight:600;color:#1a3763;margin:0 0 4px}.stvect-subtext[_ngcontent-%COMP%]{font-size:13px;color:#4a4a4a;margin:0;max-width:680px;line-height:1.4}"]
    }))();
  }
  return MissingKnowledgeAnalysisComponent;
})();