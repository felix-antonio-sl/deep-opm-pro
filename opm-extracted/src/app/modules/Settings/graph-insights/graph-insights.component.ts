// Source: decompiled/37084.js
// Original path: ./src/app/modules/Settings/graph-insights/graph-insights.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const graph_insights_component_c0 = ["graphPreviewSvg"];
function GraphInsightsComponent_mat_option_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 35);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", p_r2.value);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(p_r2.label);
  }
}
function GraphInsightsComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 36)(1, "div", 37)(2, "span");
    core /* ɵɵtext */.EFF(3, "Total Nodes");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "strong");
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "div", 37)(7, "span");
    core /* ɵɵtext */.EFF(8, "Total Edges");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "strong");
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(11, "div", 37)(12, "span");
    core /* ɵɵtext */.EFF(13, "Objects");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "strong");
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(16, "div", 37)(17, "span");
    core /* ɵɵtext */.EFF(18, "Processes");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(19, "strong");
    core /* ɵɵtext */.EFF(20);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(21, "div", 37)(22, "span");
    core /* ɵɵtext */.EFF(23, "States");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(24, "strong");
    core /* ɵɵtext */.EFF(25);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(26, "div", 37)(27, "span");
    core /* ɵɵtext */.EFF(28, "Isolated Elements");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(29, "strong");
    core /* ɵɵtext */.EFF(30);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(31, "div", 37)(32, "span");
    core /* ɵɵtext */.EFF(33, "Connected Components");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(34, "strong");
    core /* ɵɵtext */.EFF(35);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(36, "div", 37)(37, "span");
    core /* ɵɵtext */.EFF(38, "High-Risk Hubs");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(39, "strong");
    core /* ɵɵtext */.EFF(40);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.totalNodes);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.totalEdges);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.objects);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.processes);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.states);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.isolatedElements);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.connectedComponents);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.summary.highRiskHubs);
  }
}
function GraphInsightsComponent_mat_option_30_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 35);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const node_r4 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", node_r4.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(node_r4.label);
  }
}
function GraphInsightsComponent_mat_option_44_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 35);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const node_r5 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", node_r5.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(node_r5.label);
  }
}
function GraphInsightsComponent_mat_option_49_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 35);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const node_r6 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", node_r6.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(node_r6.label);
  }
}
function GraphInsightsComponent_section_72_div_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate2 */.Lme(" ", item_r7.key, ": ", item_r7.value, " ");
  }
}
function GraphInsightsComponent_section_72_div_17_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate2 */.Lme(" ", item_r8.key, ": ", item_r8.value, " ");
  }
}
function GraphInsightsComponent_section_72_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "section", 30)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Neighborhood Insight");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 38);
    core /* ɵɵtext */.EFF(6, "Direct neighbors: ");
    core /* ɵɵelementStart */.j41(7, "strong");
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(9, "div", 39)(10, "div")(11, "h4");
    core /* ɵɵtext */.EFF(12, "By Relation Type");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(13, GraphInsightsComponent_section_72_div_13_Template, 2, 2, "div", 33);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "div")(15, "h4");
    core /* ɵɵtext */.EFF(16, "By Element Kind");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(17, GraphInsightsComponent_section_72_div_17_Template, 2, 2, "div", 33);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.neighborInsight.explanation);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.neighborInsight.totalNeighbors);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.asEntries(ctx_r2.neighborInsight.neighborsByRelation));
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.asEntries(ctx_r2.neighborInsight.relatedKinds));
  }
}
function GraphInsightsComponent_div_76_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const step_r9 = ctx.$implicit;
    const idx_r10 = ctx.index;
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate4 */.LHq(" ", idx_r10 + 1, ". ", ctx_r2.formatNode(step_r9.from), " --", step_r9.relationType, "--> ", ctx_r2.formatNode(step_r9.to), " ");
  }
}
function GraphInsightsComponent_div_76_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "p");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, GraphInsightsComponent_div_76_div_3_Template, 2, 4, "div", 33);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.shortestPath.explanation);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.shortestPath.steps);
  }
}
function GraphInsightsComponent_ng_template_77_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p");
    core /* ɵɵtext */.EFF(1, " No shortest path found for the selected pair with the current options. Try ");
    core /* ɵɵelementStart */.j41(2, "strong");
    core /* ɵɵtext */.EFF(3, "Treat relations as undirected");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, ", a different ");
    core /* ɵɵelementStart */.j41(5, "strong");
    core /* ɵɵtext */.EFF(6, "projection");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(7, ", or elements that share a connected component in the snapshot. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function GraphInsightsComponent_div_81_div_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const step_r11 = ctx.$implicit;
    const idx_r12 = ctx.index;
    const ctx_r2 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate4 */.LHq(" ", idx_r12 + 1, ". ", ctx_r2.formatNode(step_r11.from), " --", step_r11.relationType, "--> ", ctx_r2.formatNode(step_r11.to), " ");
  }
}
function GraphInsightsComponent_div_81_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 41)(1, "div");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, GraphInsightsComponent_div_81_div_1_div_3_Template, 2, 4, "div", 33);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const path_r13 = ctx.$implicit;
    const p_r14 = ctx.index;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate2 */.Lme("Path ", p_r14 + 1, ": ", path_r13.explanation, "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", path_r13.steps);
  }
}
function GraphInsightsComponent_div_81_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, GraphInsightsComponent_div_81_div_1_Template, 4, 3, "div", 40);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.simplePaths);
  }
}
function GraphInsightsComponent_ng_template_82_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p");
    core /* ɵɵtext */.EFF(1, "No simple paths found with the current depth and limit constraints.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function GraphInsightsComponent_tr_103_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "td");
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵpipe */.nI1(9, "number");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "td");
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r15 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r15.label);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r15.kind);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r15.degree);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(9, 5, item_r15.betweenness, "1.2-4"));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(item_r15.interpretation);
  }
}
function GraphInsightsComponent_section_104_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "section", 30)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Connectivity Analysis");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 39)(6, "div")(7, "div");
    core /* ɵɵtext */.EFF(8, "Connected Components: ");
    core /* ɵɵelementStart */.j41(9, "strong");
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(11, "div");
    core /* ɵɵtext */.EFF(12, "Strongly Connected Areas: ");
    core /* ɵɵelementStart */.j41(13, "strong");
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(15, "div")(16, "div");
    core /* ɵɵtext */.EFF(17, "Isolated Elements: ");
    core /* ɵɵelementStart */.j41(18, "strong");
    core /* ɵɵtext */.EFF(19);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(20, "div");
    core /* ɵɵtext */.EFF(21, "No Incoming: ");
    core /* ɵɵelementStart */.j41(22, "strong");
    core /* ɵɵtext */.EFF(23);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(24, "div");
    core /* ɵɵtext */.EFF(25, "No Outgoing: ");
    core /* ɵɵelementStart */.j41(26, "strong");
    core /* ɵɵtext */.EFF(27);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.connectivity.explanation);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.connectivity.connectedComponents.length);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh((ctx_r2.connectivity.stronglyConnectedComponents == null ? null : ctx_r2.connectivity.stronglyConnectedComponents.length) || 0);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.connectivity.isolatedNodes.length);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.connectivity.noIncoming.length);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.connectivity.noOutgoing.length);
  }
}
function GraphInsightsComponent_div_108_div_1_ul_5_li_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 52);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const it_r16 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("(", it_r16.kind, ") ");
  }
}
function GraphInsightsComponent_div_108_div_1_ul_5_li_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 53);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const it_r16 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" — ", it_r16.detail, "");
  }
}
function GraphInsightsComponent_div_108_div_1_ul_5_li_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li");
    core /* ɵɵtemplate */.DNE(1, GraphInsightsComponent_div_108_div_1_ul_5_li_1_span_1_Template, 2, 1, "span", 49);
    core /* ɵɵelementStart */.j41(2, "span", 50);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(4, GraphInsightsComponent_div_108_div_1_ul_5_li_1_span_4_Template, 2, 1, "span", 51);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const it_r16 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", it_r16.kind);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(it_r16.label);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", it_r16.detail);
  }
}
function GraphInsightsComponent_div_108_div_1_ul_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "ul", 48);
    core /* ɵɵtemplate */.DNE(1, GraphInsightsComponent_div_108_div_1_ul_5_li_1_Template, 5, 3, "li", 33);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const pattern_r17 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", pattern_r17.items);
  }
}
function GraphInsightsComponent_div_108_div_1_p_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p", 54);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const pattern_r17 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" … and ", pattern_r17.truncatedRemaining, " more not listed here. ");
  }
}
function GraphInsightsComponent_div_108_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 43)(1, "strong", 44);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p", 45);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(5, GraphInsightsComponent_div_108_div_1_ul_5_Template, 2, 1, "ul", 46)(6, GraphInsightsComponent_div_108_div_1_p_6_Template, 2, 1, "p", 47);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const pattern_r17 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(pattern_r17.title);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(pattern_r17.description);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", pattern_r17.items == null ? null : pattern_r17.items.length);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", pattern_r17.truncatedRemaining);
  }
}
function GraphInsightsComponent_div_108_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, GraphInsightsComponent_div_108_div_1_Template, 7, 4, "div", 42);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.suspiciousPatterns);
  }
}
function GraphInsightsComponent_ng_template_109_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p");
    core /* ɵɵtext */.EFF(1, "No suspicious patterns detected for the selected projection.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function GraphInsightsComponent_section_111_p_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p", 70);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r2.snapshot.metadata.graphBuildSummary, " ");
  }
}
function GraphInsightsComponent_section_111_p_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p", 71);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r2.snapshot.metadata.rdfRelationshipNote, " ");
  }
}
function GraphInsightsComponent_section_111__svg_line_40_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelement */.nrm(0, "line", 72);
  }
  if (rf & 2) {
    const e_r19 = ctx.$implicit;
    core /* ɵɵattribute */.BMQ("x1", e_r19.x1)("y1", e_r19.y1)("x2", e_r19.x2)("y2", e_r19.y2);
  }
}
function GraphInsightsComponent_section_111__svg_text_41_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "text", 73);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const e_r20 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵattribute */.BMQ("opacity", ctx_r2.showPreviewEdgeLabels ? 1 : 0)("transform", "translate(" + e_r20.labelX + "," + e_r20.labelY + ") rotate(" + e_r20.labelAngle + ")");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(e_r20.label);
  }
}
function GraphInsightsComponent_section_111__svg_g_42_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "g", 74);
    core /* ɵɵelement */.nrm(1, "circle", 75);
    core /* ɵɵelementStart */.j41(2, "text", 76);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const n_r21 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵattribute */.BMQ("cx", n_r21.x)("cy", n_r21.y)("r", ctx_r2.graphPreviewNodeRadius(n_r21.id))("fill", ctx_r2.nodeKindColor(n_r21.kind))("stroke", ctx_r2.isPreviewHighlighted(n_r21.id) ? "#1A3763" : "none");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵattribute */.BMQ("x", n_r21.x + ctx_r2.graphPreviewLabelDx(n_r21.id))("y", n_r21.y + 8);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(n_r21.label);
  }
}
function GraphInsightsComponent_section_111_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "section", 55)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Graph preview");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p", 56);
    core /* ɵɵtext */.EFF(4, " Layout runs on a ");
    core /* ɵɵelementStart */.j41(5, "strong");
    core /* ɵɵtext */.EFF(6, "large virtual sheet");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(7, " without pinning nodes to a rectangle border, then the SVG size follows the graph’s bounding box. The on-screen area is a ");
    core /* ɵɵelementStart */.j41(8, "strong");
    core /* ɵɵtext */.EFF(9, "navigator");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(10, ": wheel ");
    core /* ɵɵelementStart */.j41(11, "strong");
    core /* ɵɵtext */.EFF(12, "zoom");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(13, ", drag ");
    core /* ɵɵelementStart */.j41(14, "strong");
    core /* ɵɵtext */.EFF(15, "pan");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(16, ", ");
    core /* ɵɵelementStart */.j41(17, "strong");
    core /* ɵɵtext */.EFF(18, "Fit graph");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(19, " shows everything. Large graphs open on a centered window—pan out to explore. Edge labels appear when zoomed in. ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(20, GraphInsightsComponent_section_111_p_20_Template, 2, 1, "p", 57)(21, GraphInsightsComponent_section_111_p_21_Template, 2, 1, "p", 58);
    core /* ɵɵelementStart */.j41(22, "div", 59)(23, "button", 60);
    core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_section_111_Template_button_click_23_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.zoomPreview(1 / 1.18));
    });
    core /* ɵɵtext */.EFF(24, " Zoom in ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(25, "button", 60);
    core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_section_111_Template_button_click_25_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.zoomPreview(1.18));
    });
    core /* ɵɵtext */.EFF(26, " Zoom out ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(27, "button", 60);
    core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_section_111_Template_button_click_27_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.resetPreviewViewport());
    });
    core /* ɵɵtext */.EFF(28, " Fit graph ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(29, "button", 60);
    core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_section_111_Template_button_click_29_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.exportGraphPreviewPng());
    });
    core /* ɵɵtext */.EFF(30, " Export PNG ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(31, "span", 61);
    core /* ɵɵtext */.EFF(32, "Wheel · zoom · Drag · pan · PNG = full graph at 2× resolution");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(33, "div", 62);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(34, "svg", 63, 3);
    core /* ɵɵlistener */.bIt("wheel", function GraphInsightsComponent_section_111_Template_svg_wheel_34_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onGraphPreviewWheel($event));
    })("pointerdown", function GraphInsightsComponent_section_111_Template_svg_pointerdown_34_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onGraphPreviewPointerDown($event));
    });
    core /* ɵɵelementStart */.j41(36, "defs")(37, "marker", 64);
    core /* ɵɵelement */.nrm(38, "path", 65);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(39, "rect", 66);
    core /* ɵɵtemplate */.DNE(40, GraphInsightsComponent_section_111__svg_line_40_Template, 1, 4, "line", 67)(41, GraphInsightsComponent_section_111__svg_text_41_Template, 2, 3, "text", 68)(42, GraphInsightsComponent_section_111__svg_g_42_Template, 4, 8, "g", 69);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(20);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.snapshot == null ? null : ctx_r2.snapshot.metadata == null ? null : ctx_r2.snapshot.metadata.graphBuildSummary);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.snapshot == null ? null : ctx_r2.snapshot.metadata == null ? null : ctx_r2.snapshot.metadata.rdfRelationshipNote);
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵattribute */.BMQ("viewBox", ctx_r2.previewViewBoxString);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵattribute */.BMQ("width", ctx_r2.graphContentWidth)("height", ctx_r2.graphContentHeight);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.previewEdges);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.previewEdges);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.previewNodes);
  }
}
let GraphInsightsComponent = /*#__PURE__*/(() => {
  class GraphInsightsComponent {
    constructor(graphInsightsService, dialog) {
      this.graphInsightsService = graphInsightsService;
      this.dialog = dialog;
      this.projections = [{
        value: "semantic",
        label: "Semantic (default)"
      }, {
        value: "structural",
        label: "Structural"
      }, {
        value: "behavioral",
        label: "Behavioral / Procedural"
      }, {
        value: "full",
        label: "Full"
      }];
      this.projection = "semantic";
      this.snapshot = null;
      this.summary = null;
      this.nodeOptions = [];
      this.selectedNodeId = "";
      this.sourceNodeId = "";
      this.targetNodeId = "";
      this.maxPathDepth = 4;
      this.maxPathResults = 8;
      /** Default on: many OPM links are asymmetric (process↔object); undirected search matches “on-diagram” connectivity. */
      this.pathTreatUndirected = true;
      this.previewNodes = [];
      this.previewEdges = [];
      /**
       * SVG coordinate size after layout — tight bounding box around the graph (not a fixed “display frame”).
       * Simulation runs on a separate large sheet, then positions are normalized here.
       */
      this.graphContentWidth = 1760;
      this.graphContentHeight = 1100;
      /** Current SVG viewBox (navigator window over graphContent). */
      this.viewMinX = 0;
      this.viewMinY = 0;
      this.viewWidth = 1760;
      this.viewHeight = 1100;
      this.graphPreviewPanning = false;
      this.graphPreviewLastClient = {
        x: 0,
        y: 0
      };
      this.graphPreviewPointerId = null;
      this.neighborInsight = null;
      this.shortestPath = null;
      this.simplePaths = [];
      this.importantElements = [];
      this.connectivity = null;
      this.suspiciousPatterns = [];
    }
    ngOnInit() {
      this.buildSnapshot(false);
    }
    openInstructions() {
      this.dialog.open(GraphInsightsInstructionsDialogComponent, {
        width: "720px",
        maxWidth: "95vw",
        maxHeight: "90vh",
        autoFocus: false,
        disableClose: false,
        panelClass: "graph-insights-instructions-dialog"
      });
    }
    buildSnapshot(forceRefresh) {
      const state = this.graphInsightsService.buildSnapshot(this.projection, forceRefresh);
      this.snapshot = state.snapshot;
      this.summary = this.graphInsightsService.getSummary(state.graph, state.snapshot);
      this.nodeOptions = state.snapshot.nodes.map(node => ({
        id: node.id,
        label: `${node.label} (${node.kind})`
      })).sort((a, b) => a.label.localeCompare(b.label));
      if (!this.selectedNodeId && this.nodeOptions.length) {
        this.selectedNodeId = this.nodeOptions[0].id;
        this.sourceNodeId = this.nodeOptions[0].id;
        this.targetNodeId = this.nodeOptions[Math.min(1, this.nodeOptions.length - 1)].id;
      }
      this.refreshGraphPreview();
      this.runGlobalAnalyses();
    }
    onProjectionChange() {
      this.buildSnapshot(false);
    }
    runNeighborhood() {
      const state = this.graphInsightsService.buildSnapshot(this.projection, false);
      this.neighborInsight = this.graphInsightsService.analyzeNeighborhood(state.graph, this.selectedNodeId);
    }
    onPathSourceOrTargetChange() {
      this.runPathAnalysis();
      this.refreshGraphPreview();
    }
    runPathAnalysis() {
      const state = this.graphInsightsService.buildSnapshot(this.projection, false);
      this.shortestPath = this.graphInsightsService.findShortestPath(state.graph, this.sourceNodeId, this.targetNodeId, {
        treatAsUndirected: this.pathTreatUndirected
      });
      this.simplePaths = this.graphInsightsService.findSimplePaths(state.graph, this.sourceNodeId, this.targetNodeId, this.maxPathDepth, this.maxPathResults, this.pathTreatUndirected);
    }
    runGlobalAnalyses() {
      const state = this.graphInsightsService.buildSnapshot(this.projection, false);
      this.importantElements = this.graphInsightsService.computeImportantElements(state.graph, 12);
      this.connectivity = this.graphInsightsService.computeConnectivity(state.graph);
      this.suspiciousPatterns = this.graphInsightsService.detectSuspiciousPatterns(state.graph);
      this.runNeighborhood();
      this.runPathAnalysis();
    }
    formatNode(nodeId) {
      return this.nodeOptions.find(option => option.id === nodeId)?.label || nodeId;
    }
    asEntries(value) {
      return Object.keys(value || {}).map(key => ({
        key,
        value: value[key]
      })).sort((a, b) => b.value - a.value);
    }
    nodeKindColor(kind) {
      switch (kind) {
        case "object":
          return "#2E8B57";
        case "process":
          return "#1A5FCC";
        case "state":
          return "#8B5CF6";
        default:
          return "#586D8C";
      }
    }
    isPreviewHighlighted(nodeId) {
      return nodeId === this.sourceNodeId || nodeId === this.targetNodeId;
    }
    /** SVG circle radius for graph preview nodes (larger = easier to see at default zoom). */
    graphPreviewNodeRadius(nodeId) {
      if (this.isPreviewHighlighted(nodeId)) {
        return 30;
      } else {
        return 22;
      }
    }
    /** Horizontal offset from node center to label (depends on radius). */
    graphPreviewLabelDx(nodeId) {
      return this.graphPreviewNodeRadius(nodeId) + 8;
    }
    get previewViewBoxString() {
      return `${this.viewMinX} ${this.viewMinY} ${this.viewWidth} ${this.viewHeight}`;
    }
    /** Edge labels only when zoomed in enough; at “fit all” they overlap too much. */
    get showPreviewEdgeLabels() {
      return this.viewWidth <= this.graphContentWidth * 0.68;
    }
    resetPreviewViewport() {
      this.viewMinX = 0;
      this.viewMinY = 0;
      this.viewWidth = this.graphContentWidth;
      this.viewHeight = this.graphContentHeight;
    }
    /** After a large layout, start with a centered window so pan/zoom feels like a map navigator. */
    setInitialNavigatorView() {
      const cw = this.graphContentWidth;
      const ch = this.graphContentHeight;
      const n = this.previewNodes.length;
      const wideGraph = cw > 2100 || ch > 1350;
      if (n < 22 || !wideGraph) {
        this.resetPreviewViewport();
        return;
      }
      const frac = 0.5;
      this.viewWidth = cw * frac;
      this.viewHeight = ch * frac;
      this.viewMinX = (cw - this.viewWidth) / 2;
      this.viewMinY = (ch - this.viewHeight) / 2;
    }
    /** Zoom around the center of the current view (toolbar buttons). */
    zoomPreview(factor) {
      const mx = 0.5;
      const my = 0.5;
      const vbX = this.viewMinX + mx * this.viewWidth;
      const vbY = this.viewMinY + my * this.viewHeight;
      this.applyPreviewZoomAt(factor, mx, my, vbX, vbY);
    }
    onGraphPreviewWheel(event) {
      event.preventDefault();
      const svg = this.graphPreviewSvg?.nativeElement;
      if (!svg) {
        return;
      }
      const rect = svg.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }
      const mx = (event.clientX - rect.left) / rect.width;
      const my = (event.clientY - rect.top) / rect.height;
      const vbX = this.viewMinX + mx * this.viewWidth;
      const vbY = this.viewMinY + my * this.viewHeight;
      const factor = event.deltaY > 0 ? 1.14 : 1 / 1.14;
      this.applyPreviewZoomAt(factor, mx, my, vbX, vbY);
    }
    onGraphPreviewPointerDown(event) {
      if (event.button !== 0) {
        return;
      }
      const svg = this.graphPreviewSvg?.nativeElement;
      if (!svg || !svg.contains(event.target)) {
        return;
      }
      event.preventDefault();
      this.graphPreviewPanning = true;
      this.graphPreviewPointerId = event.pointerId;
      this.graphPreviewLastClient = {
        x: event.clientX,
        y: event.clientY
      };
      try {
        svg.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    }
    onGraphPreviewPointerMoveWindow(event) {
      if (!this.graphPreviewPanning || this.graphPreviewPointerId !== event.pointerId) {
        return;
      }
      const svg = this.graphPreviewSvg?.nativeElement;
      if (!svg) {
        return;
      }
      const dx = event.clientX - this.graphPreviewLastClient.x;
      const dy = event.clientY - this.graphPreviewLastClient.y;
      this.graphPreviewLastClient = {
        x: event.clientX,
        y: event.clientY
      };
      const w = svg.clientWidth;
      const h = svg.clientHeight;
      if (w <= 0 || h <= 0) {
        return;
      }
      this.viewMinX -= dx / w * this.viewWidth;
      this.viewMinY -= dy / h * this.viewHeight;
      this.clampPreviewViewBox();
    }
    onGraphPreviewPointerUpWindow(event) {
      if (this.graphPreviewPointerId !== event.pointerId) {
        return;
      }
      this.graphPreviewPanning = false;
      this.graphPreviewPointerId = null;
    }
    /**
     * Renders the full graph (not the current zoom) to PNG at 2× resolution for readable labels.
     */
    exportGraphPreviewPng() {
      const svg = this.graphPreviewSvg?.nativeElement;
      if (!svg) {
        return;
      }
      const clone = svg.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      clone.setAttribute("viewBox", `0 0 ${this.graphContentWidth} ${this.graphContentHeight}`);
      clone.removeAttribute("class");
      clone.querySelectorAll(".gi-edge-label").forEach(el => {
        el.setAttribute("opacity", "1");
      });
      const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
      styleEl.textContent = `
      .gi-svg-bg { fill: #fafcfe; }
      .gi-edge { stroke: #9eb0cc; stroke-width: 1.65; }
      .gi-arrow-head { fill: #9eb0cc; }
      .gi-edge-label { font-size: 16px; fill: #4a5f82; font-family: Roboto, "Helvetica Neue", sans-serif; text-anchor: middle; }
      .gi-node-label { font-size: 20px; fill: #1A3763; font-family: Roboto, "Helvetica Neue", sans-serif; }
    `;
      clone.insertBefore(styleEl, clone.firstChild);
      const xml = new XMLSerializer().serializeToString(clone);
      const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      const img = new Image();
      const scale = 2;
      const w = this.graphContentWidth * scale;
      const h = this.graphContentHeight * scale;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        ctx.fillStyle = "#fafcfe";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          if (!blob) {
            return;
          }
          const a = document.createElement("a");
          const safeName = (this.snapshot?.metadata?.modelName || "graph").replace(/[^\w\-]+/g, "-").slice(0, 48);
          a.download = `graph-insights-${safeName}-${Date.now()}.png`;
          a.href = URL.createObjectURL(blob);
          a.click();
          URL.revokeObjectURL(a.href);
        }, "image/png");
      };
      img.onerror = () => {
        /* SVG → image failed in this environment */
      };
      img.src = dataUrl;
    }
    applyPreviewZoomAt(factor, mx, my, vbX, vbY) {
      const aspect = this.graphContentHeight / this.graphContentWidth;
      let newW = this.viewWidth * factor;
      const minW = this.graphContentWidth / 42;
      const maxW = this.graphContentWidth;
      newW = Math.max(minW, Math.min(maxW, newW));
      const newH = newW * aspect;
      this.viewMinX = vbX - mx * newW;
      this.viewMinY = vbY - my * newH;
      this.viewWidth = newW;
      this.viewHeight = newH;
      this.clampPreviewViewBox();
    }
    clampPreviewViewBox() {
      const padX = this.viewWidth * 0.12;
      const padY = this.viewHeight * 0.12;
      this.viewMinX = Math.min(this.graphContentWidth - this.viewWidth + padX, Math.max(-padX, this.viewMinX));
      this.viewMinY = Math.min(this.graphContentHeight - this.viewHeight + padY, Math.max(-padY, this.viewMinY));
    }
    /** Pull positions toward the centroid to reduce empty space while keeping topology. */
    compactLayoutTowardCentroid(layoutNodes, scale) {
      if (!layoutNodes.length || scale >= 0.999) {
        return;
      }
      let sx = 0;
      let sy = 0;
      for (const ln of layoutNodes) {
        sx += ln.x;
        sy += ln.y;
      }
      const n = layoutNodes.length;
      sx /= n;
      sy /= n;
      for (const ln of layoutNodes) {
        ln.x = sx + (ln.x - sx) * scale;
        ln.y = sy + (ln.y - sy) * scale;
      }
    }
    /**
     * Shift simulation coordinates into [0..] and set graphContentWidth/Height to a tight bbox
     * (plus padding). Avoids a fixed “screen rectangle” that nodes were being pushed onto.
     */
    fitLayoutNodesToBoundingBox(layoutNodes) {
      if (!layoutNodes.length) {
        return;
      }
      const labelPadX = 165;
      const labelPadY = 56;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const ln of layoutNodes) {
        const r = this.graphPreviewNodeRadius(ln.id);
        minX = Math.min(minX, ln.x - r);
        maxX = Math.max(maxX, ln.x + r + labelPadX);
        minY = Math.min(minY, ln.y - r - labelPadY);
        maxY = Math.max(maxY, ln.y + r + labelPadY);
      }
      const pad = 56;
      const dx = pad - minX;
      const dy = pad - minY;
      for (const ln of layoutNodes) {
        ln.x += dx;
        ln.y += dy;
      }
      this.graphContentWidth = Math.max(360, Math.ceil(maxX - minX + pad * 2));
      this.graphContentHeight = Math.max(360, Math.ceil(maxY - minY + pad * 2));
    }
    refreshGraphPreview() {
      if (!this.snapshot?.nodes?.length) {
        this.previewNodes = [];
        this.previewEdges = [];
        this.graphContentWidth = 1760;
        this.graphContentHeight = 1100;
        this.resetPreviewViewport();
        return;
      }
      const maxNodes = 72;
      const maxEdges = 150;
      const nodes = this.snapshot.nodes.slice(0, maxNodes);
      const idSet = new Set(nodes.map(n => n.id));
      const labelById = new Map(nodes.map(n => [n.id, n.label]));
      const nCount = nodes.length;
      const simW = Math.max(2800, Math.round(Math.sqrt(nCount) * 300));
      const simH = Math.round(simW * (1100 / 1760));
      const layoutMargin = Math.min(simW, simH) * 0.032;
      const layoutNodes = nodes.map(n => ({
        id: n.id,
        x: simW / 2,
        y: simH / 2
      }));
      const edgesForLayout = [];
      const edgeMeta = [];
      let ec = 0;
      for (const e of this.snapshot.edges) {
        if (ec >= maxEdges) {
          break;
        }
        if (!idSet.has(e.source) || !idSet.has(e.target)) {
          continue;
        }
        edgesForLayout.push({
          source: e.source,
          target: e.target
        });
        const raw = e.opmRelationKind || e.label || e.relationType || "link";
        const short = raw.length > 22 ? `${raw.slice(0, 20)}…` : raw;
        edgeMeta.push({
          source: e.source,
          target: e.target,
          label: short
        });
        ec++;
      }
      seedMultiClusterLayout(layoutNodes, edgesForLayout, simW, simH);
      runForceDirectedLayout(layoutNodes, edgesForLayout, simW, simH, {
        iterations: nCount > 42 ? 210 : 165,
        margin: layoutMargin,
        repulsionMultiplier: 1.02,
        attractionMultiplier: 0.98,
        clampToBounds: false,
        recenterInterval: 12
      });
      runForceDirectedLayout(layoutNodes, edgesForLayout, simW, simH, {
        iterations: nCount > 42 ? 100 : 78,
        margin: layoutMargin,
        repulsionMultiplier: 0.78,
        attractionMultiplier: 1.28,
        clampToBounds: false,
        recenterInterval: 16
      });
      this.compactLayoutTowardCentroid(layoutNodes, 0.67);
      this.fitLayoutNodesToBoundingBox(layoutNodes);
      const pos = new Map(layoutNodes.map(n => [n.id, {
        x: n.x,
        y: n.y
      }]));
      const nodeR = id => this.graphPreviewNodeRadius(id);
      this.previewNodes = layoutNodes.map(ln => {
        const full = labelById.get(ln.id) || ln.id;
        const short = full.length > 22 ? `${full.slice(0, 20)}…` : full;
        const kind = nodes.find(n => n.id === ln.id)?.kind || "unknown";
        return {
          id: ln.id,
          x: ln.x,
          y: ln.y,
          label: short,
          kind
        };
      });
      this.previewEdges = [];
      for (let i = 0; i < edgeMeta.length; i++) {
        const e = edgeMeta[i];
        const pS = pos.get(e.source);
        const pT = pos.get(e.target);
        if (!pS || !pT) {
          continue;
        }
        let dx = pT.x - pS.x;
        let dy = pT.y - pS.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const ux = dx / len;
        const uy = dy / len;
        const rs = nodeR(e.source);
        const rt = nodeR(e.target);
        const x1 = pS.x + ux * rs;
        const y1 = pS.y + uy * rs;
        const x2 = pT.x - ux * rt;
        const y2 = pT.y - uy * rt;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const off = 26;
        const labelX = mx - uy * off;
        const labelY = my + ux * off;
        let labelAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (labelAngle > 90 || labelAngle < -90) {
          labelAngle += 180;
        }
        this.previewEdges.push({
          x1,
          y1,
          x2,
          y2,
          label: e.label,
          labelX,
          labelY,
          labelAngle
        });
      }
      this.setInitialNavigatorView();
    }
    static #_ = (() => this.ɵfac = function GraphInsightsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GraphInsightsComponent)(core /* ɵɵdirectiveInject */.rXU(GraphInsightsService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: GraphInsightsComponent,
      selectors: [["opcloud-graph-insights"]],
      viewQuery: function GraphInsightsComponent_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(graph_insights_component_c0, 5);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.graphPreviewSvg = _t.first;
          }
        }
      },
      hostBindings: function GraphInsightsComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵlistener */.bIt("pointermove", function GraphInsightsComponent_pointermove_HostBindingHandler($event) {
            return ctx.onGraphPreviewPointerMoveWindow($event);
          }, false, core /* ɵɵresolveWindow */.tSv)("pointerup", function GraphInsightsComponent_pointerup_HostBindingHandler($event) {
            return ctx.onGraphPreviewPointerUpWindow($event);
          }, false, core /* ɵɵresolveWindow */.tSv)("pointercancel", function GraphInsightsComponent_pointercancel_HostBindingHandler($event) {
            return ctx.onGraphPreviewPointerUpWindow($event);
          }, false, core /* ɵɵresolveWindow */.tSv);
        }
      },
      decls: 112,
      vars: 22,
      consts: [["noShortest", ""], ["noSimple", ""], ["noPatterns", ""], ["graphPreviewSvg", ""], ["id", "whole", 1, "graph-insights-page"], [1, "header"], [1, "h2"], [1, "header-subrow"], [1, "header-subtitle"], ["mat-stroked-button", "", "type", "button", "matTooltip", "Open a full guide to this page and all options", "matTooltipPosition", "below", 1, "gi-instructions-btn", 3, "click"], [1, "action-bar"], ["mat-button", "", 1, "action-btn", 3, "click"], ["appearance", "outline", 1, "projection"], [3, "ngModelChange", "selectionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "summary-grid", 4, "ngIf"], [1, "content-grid"], [1, "left-panel"], ["expanded", ""], [1, "gi-form-stack"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "full-width", "gi-field"], [3, "ngModelChange", "ngModel"], [1, "gi-path-toggle"], ["color", "primary", "matTooltip", "When on, paths follow relations in either direction (typical for “connected on the diagram”). Turn off to respect link direction only.", 3, "ngModelChange", "change", "ngModel"], [1, "gi-numeric-row"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "gi-field", "gi-numeric"], ["matInput", "", "type", "number", "min", "2", "max", "12", 3, "ngModelChange", "ngModel"], ["matInput", "", "type", "number", "min", "1", "max", "30", 3, "ngModelChange", "ngModel"], [1, "main-panel"], ["class", "result-card", 4, "ngIf"], [1, "result-card"], [4, "ngIf", "ngIfElse"], [1, "results-table"], [4, "ngFor", "ngForOf"], ["class", "result-card graph-preview-card graph-preview-bottom", 4, "ngIf"], [3, "value"], [1, "summary-grid"], [1, "summary-card"], [1, "row"], [1, "grid-2"], ["class", "path-box", 4, "ngFor", "ngForOf"], [1, "path-box"], ["class", "pattern-box", 4, "ngFor", "ngForOf"], [1, "pattern-box"], [1, "pattern-title"], [1, "pattern-desc"], ["class", "pattern-elements", 4, "ngIf"], ["class", "pattern-truncate", 4, "ngIf"], [1, "pattern-elements"], ["class", "gi-pat-kind", 4, "ngIf"], [1, "gi-pat-label"], ["class", "gi-pat-detail", 4, "ngIf"], [1, "gi-pat-kind"], [1, "gi-pat-detail"], [1, "pattern-truncate"], [1, "result-card", "graph-preview-card", "graph-preview-bottom"], [1, "preview-hint"], ["class", "preview-provenance", 4, "ngIf"], ["class", "preview-provenance secondary", 4, "ngIf"], [1, "graph-preview-toolbar"], ["mat-stroked-button", "", "type", "button", 1, "gi-preview-tool-btn", 3, "click"], [1, "preview-zoom-hint"], [1, "graph-preview-wrap"], ["preserveAspectRatio", "xMidYMid meet", 1, "gi-graph-svg", "gi-graph-svg-interactive", 3, "wheel", "pointerdown"], ["id", "gi-graph-arrow", "viewBox", "0 0 10 10", "refX", "9.2", "refY", "5", "markerWidth", "8.5", "markerHeight", "8.5", "orient", "auto"], ["d", "M0,0 L10,5 L0,10 z", 1, "gi-arrow-head"], ["rx", "8", 1, "gi-svg-bg"], ["class", "gi-edge", "marker-end", "url(#gi-graph-arrow)", 4, "ngFor", "ngForOf"], ["class", "gi-edge-label", 4, "ngFor", "ngForOf"], ["class", "gi-node-g", 4, "ngFor", "ngForOf"], [1, "preview-provenance"], [1, "preview-provenance", "secondary"], ["marker-end", "url(#gi-graph-arrow)", 1, "gi-edge"], [1, "gi-edge-label"], [1, "gi-node-g"], ["stroke-width", "3"], [1, "gi-node-label"]],
      template: function GraphInsightsComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 4)(1, "div", 5)(2, "h2", 6);
          core /* ɵɵtext */.EFF(3, "Graph Insights");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "div", 7)(5, "p", 8);
          core /* ɵɵtext */.EFF(6, " Analyze the current OPM model as an in-memory graph snapshot (browser-only, no persistent graph database). ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "button", 9);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_7_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.openInstructions());
          });
          core /* ɵɵtext */.EFF(8, " Instructions ");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(9, "div", 10)(10, "button", 11);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_10_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.buildSnapshot(false));
          });
          core /* ɵɵtext */.EFF(11, "Build Graph Snapshot");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "button", 11);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_12_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.buildSnapshot(true));
          });
          core /* ɵɵtext */.EFF(13, "Refresh from Current Model");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "mat-form-field", 12)(15, "mat-label");
          core /* ɵɵtext */.EFF(16, "Projection");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "mat-select", 13);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_mat_select_ngModelChange_17_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.projection, $event)) {
              ctx.projection = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function GraphInsightsComponent_Template_mat_select_selectionChange_17_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onProjectionChange());
          });
          core /* ɵɵtemplate */.DNE(18, GraphInsightsComponent_mat_option_18_Template, 2, 2, "mat-option", 14);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(19, GraphInsightsComponent_div_19_Template, 41, 8, "div", 15);
          core /* ɵɵelementStart */.j41(20, "div", 16)(21, "div", 17)(22, "mat-expansion-panel", 18)(23, "mat-expansion-panel-header");
          core /* ɵɵtext */.EFF(24, "Quick Queries");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(25, "div", 19)(26, "mat-form-field", 20)(27, "mat-label");
          core /* ɵɵtext */.EFF(28, "Element");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(29, "mat-select", 21);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_mat_select_ngModelChange_29_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.selectedNodeId, $event)) {
              ctx.selectedNodeId = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵtemplate */.DNE(30, GraphInsightsComponent_mat_option_30_Template, 2, 2, "mat-option", 14);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(31, "button", 11);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_31_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.runNeighborhood());
          });
          core /* ɵɵtext */.EFF(32, "Analyze Neighborhood");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(33, "mat-expansion-panel", 18)(34, "mat-expansion-panel-header");
          core /* ɵɵtext */.EFF(35, "Path Analysis");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "div", 22)(37, "mat-slide-toggle", 23);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_mat_slide_toggle_ngModelChange_37_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.pathTreatUndirected, $event)) {
              ctx.pathTreatUndirected = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("change", function GraphInsightsComponent_Template_mat_slide_toggle_change_37_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.runPathAnalysis());
          });
          core /* ɵɵtext */.EFF(38, " Treat relations as undirected ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(39, "div", 19)(40, "mat-form-field", 20)(41, "mat-label");
          core /* ɵɵtext */.EFF(42, "Source");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(43, "mat-select", 13);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_mat_select_ngModelChange_43_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.sourceNodeId, $event)) {
              ctx.sourceNodeId = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function GraphInsightsComponent_Template_mat_select_selectionChange_43_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onPathSourceOrTargetChange());
          });
          core /* ɵɵtemplate */.DNE(44, GraphInsightsComponent_mat_option_44_Template, 2, 2, "mat-option", 14);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(45, "mat-form-field", 20)(46, "mat-label");
          core /* ɵɵtext */.EFF(47, "Target");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(48, "mat-select", 13);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_mat_select_ngModelChange_48_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.targetNodeId, $event)) {
              ctx.targetNodeId = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function GraphInsightsComponent_Template_mat_select_selectionChange_48_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onPathSourceOrTargetChange());
          });
          core /* ɵɵtemplate */.DNE(49, GraphInsightsComponent_mat_option_49_Template, 2, 2, "mat-option", 14);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(50, "div", 24)(51, "mat-form-field", 25)(52, "mat-label");
          core /* ɵɵtext */.EFF(53, "Max Depth");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(54, "input", 26);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_input_ngModelChange_54_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.maxPathDepth, $event)) {
              ctx.maxPathDepth = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(55, "mat-form-field", 25)(56, "mat-label");
          core /* ɵɵtext */.EFF(57, "Path Limit");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(58, "input", 27);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GraphInsightsComponent_Template_input_ngModelChange_58_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.maxPathResults, $event)) {
              ctx.maxPathResults = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(59, "button", 11);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_59_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.runPathAnalysis());
          });
          core /* ɵɵtext */.EFF(60, "Run Path Queries");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(61, "mat-expansion-panel", 18)(62, "mat-expansion-panel-header");
          core /* ɵɵtext */.EFF(63, "Centrality & Importance");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(64, "button", 11);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_64_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.runGlobalAnalyses());
          });
          core /* ɵɵtext */.EFF(65, "Recompute Importance");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(66, "mat-expansion-panel", 18)(67, "mat-expansion-panel-header");
          core /* ɵɵtext */.EFF(68, "Connectivity & Structure");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(69, "button", 11);
          core /* ɵɵlistener */.bIt("click", function GraphInsightsComponent_Template_button_click_69_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.runGlobalAnalyses());
          });
          core /* ɵɵtext */.EFF(70, "Recompute Connectivity");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(71, "div", 28);
          core /* ɵɵtemplate */.DNE(72, GraphInsightsComponent_section_72_Template, 18, 4, "section", 29);
          core /* ɵɵelementStart */.j41(73, "section", 30)(74, "h3");
          core /* ɵɵtext */.EFF(75, "Path Finder");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(76, GraphInsightsComponent_div_76_Template, 4, 2, "div", 31)(77, GraphInsightsComponent_ng_template_77_Template, 8, 0, "ng-template", null, 0, core /* ɵɵtemplateRefExtractor */.C5r);
          core /* ɵɵelementStart */.j41(79, "h4");
          core /* ɵɵtext */.EFF(80, "Alternative Simple Paths (bounded)");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(81, GraphInsightsComponent_div_81_Template, 2, 1, "div", 31)(82, GraphInsightsComponent_ng_template_82_Template, 2, 0, "ng-template", null, 1, core /* ɵɵtemplateRefExtractor */.C5r);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(84, "section", 30)(85, "h3");
          core /* ɵɵtext */.EFF(86, "Important Elements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(87, "p");
          core /* ɵɵtext */.EFF(88, "Potential bridge elements, highly connected objects/processes, and possible architectural chokepoints.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(89, "table", 32)(90, "thead")(91, "tr")(92, "th");
          core /* ɵɵtext */.EFF(93, "Element");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(94, "th");
          core /* ɵɵtext */.EFF(95, "Kind");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(96, "th");
          core /* ɵɵtext */.EFF(97, "Degree");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(98, "th");
          core /* ɵɵtext */.EFF(99, "Betweenness");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(100, "th");
          core /* ɵɵtext */.EFF(101, "Interpretation");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(102, "tbody");
          core /* ɵɵtemplate */.DNE(103, GraphInsightsComponent_tr_103_Template, 12, 8, "tr", 33);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(104, GraphInsightsComponent_section_104_Template, 28, 6, "section", 29);
          core /* ɵɵelementStart */.j41(105, "section", 30)(106, "h3");
          core /* ɵɵtext */.EFF(107, "Suspicious Modeling Patterns");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(108, GraphInsightsComponent_div_108_Template, 2, 1, "div", 31)(109, GraphInsightsComponent_ng_template_109_Template, 2, 0, "ng-template", null, 2, core /* ɵɵtemplateRefExtractor */.C5r);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(111, GraphInsightsComponent_section_111_Template, 43, 8, "section", 34);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          const noShortest_r22 = core /* ɵɵreference */.sdS(78);
          const noSimple_r23 = core /* ɵɵreference */.sdS(83);
          const noPatterns_r24 = core /* ɵɵreference */.sdS(110);
          core /* ɵɵadvance */.R7$(17);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.projection);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.projections);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.summary);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.selectedNodeId);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.nodeOptions);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.pathTreatUndirected);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.sourceNodeId);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.nodeOptions);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.targetNodeId);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.nodeOptions);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.maxPathDepth);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.maxPathResults);
          core /* ɵɵadvance */.R7$(14);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.neighborInsight);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shortestPath)("ngIfElse", noShortest_r22);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.simplePaths.length)("ngIfElse", noSimple_r23);
          core /* ɵɵadvance */.R7$(22);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.importantElements);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.connectivity);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.suspiciousPatterns.length)("ngIfElse", noPatterns_r24);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.previewNodes.length);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatSelect, MatOption, MatButton, MatExpansionPanel, MatExpansionPanelHeader, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, MatSlideToggle, DecimalPipe],
      styles: [".graph-insights-page[_ngcontent-%COMP%]{padding:8px 14px 24px;color:#1a3763;font-family:Roboto,Helvetica Neue,sans-serif}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:left;padding-bottom:8px}.header[_ngcontent-%COMP%]   .h2[_ngcontent-%COMP%]{color:#1a3763;margin:0 0 4px;font-size:30px;font-weight:600;line-height:1.2}.header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;opacity:.92;font-size:14px;line-height:1.45}.header-subrow[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:flex-start;gap:10px 16px;justify-content:space-between}.header-subtitle[_ngcontent-%COMP%]{flex:1 1 260px;margin:0;opacity:.92;font-size:14px;line-height:1.45;color:#1a3763}.gi-instructions-btn[_ngcontent-%COMP%]{flex-shrink:0;margin-top:0;border-color:#586d8c73!important;color:#1a3763!important;font-weight:500}.action-bar[_ngcontent-%COMP%]{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0 16px}.action-btn[_ngcontent-%COMP%]{color:#1a3763!important;opacity:.9;font-weight:500;border:1px solid rgba(88,109,140,.35);border-radius:6px;height:36px;letter-spacing:normal}.action-btn[_ngcontent-%COMP%]:hover{background-color:#1a37630d;border-color:#1a3763;opacity:1}.projection[_ngcontent-%COMP%]{min-width:230px}.summary-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,minmax(140px,1fr));gap:12px;margin-bottom:16px}.summary-card[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.2);border-radius:6px;padding:10px 12px;display:flex;justify-content:space-between;background:#f8fbff;font-size:13px}.summary-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:20px;font-weight:600;color:#1a3763}.content-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:310px 1fr;gap:12px;align-items:start}.left-panel[_ngcontent-%COMP%], .main-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:10px}.result-card[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.22);border-radius:8px;padding:12px 14px;background:#fff}.result-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0 0 6px;color:#1a3763;font-size:23px;font-weight:600}.result-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:10px 0 6px;color:#1a3763;font-size:15px;font-weight:600}.result-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .result-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:14px;line-height:1.45}.full-width[_ngcontent-%COMP%]{width:100%}.half-width[_ngcontent-%COMP%]{width:100%;margin-right:0}.grid-2[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:10px}.results-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}.results-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .results-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border:1px solid #e1e7f0;padding:8px 10px;font-size:13px;color:#1a3763}.path-box[_ngcontent-%COMP%], .pattern-box[_ngcontent-%COMP%]{border:1px solid #ebeff5;border-radius:4px;padding:8px;margin-bottom:8px;background:#fcfdff}.pattern-title[_ngcontent-%COMP%]{display:block;color:#1a5fcc;font-size:15px;margin-bottom:6px}.pattern-desc[_ngcontent-%COMP%]{margin:0 0 8px;color:#314a73;font-size:14px;line-height:1.45}.pattern-elements[_ngcontent-%COMP%]{margin:0;padding-left:1.25rem;color:#1a3763;font-size:14px;line-height:1.5}.pattern-elements[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-bottom:4px}.gi-pat-kind[_ngcontent-%COMP%]{color:#5a6c85;font-size:13px}.gi-pat-label[_ngcontent-%COMP%]{font-weight:500}.gi-pat-detail[_ngcontent-%COMP%]{color:#5a6c85;font-size:13px}.pattern-truncate[_ngcontent-%COMP%]{margin:8px 0 0;font-size:13px;color:#5a6c85;font-style:italic}  .graph-insights-page .mat-mdc-form-field{width:100%}.gi-form-stack[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}.gi-field[_ngcontent-%COMP%]{margin-bottom:6px}  .gi-form-stack .mat-mdc-form-field .mat-mdc-text-field-wrapper{margin-bottom:0}.gi-path-toggle[_ngcontent-%COMP%]{margin:4px 0 14px;padding-bottom:4px;border-bottom:1px solid rgba(88,109,140,.15)}  .gi-path-toggle .mdc-label{color:#1a3763;font-size:14px}.gi-numeric-row[_ngcontent-%COMP%]{display:flex;gap:12px;align-items:flex-start}.gi-numeric[_ngcontent-%COMP%]{flex:1;min-width:0}.graph-preview-card[_ngcontent-%COMP%]{margin-bottom:12px}.graph-preview-bottom[_ngcontent-%COMP%]{margin-top:20px;max-width:100%}.preview-hint[_ngcontent-%COMP%]{margin:0 0 10px;font-size:13px;color:#314a73;line-height:1.45}.preview-provenance[_ngcontent-%COMP%]{margin:0 0 8px;font-size:12px;color:#314a73;line-height:1.45}.preview-provenance.secondary[_ngcontent-%COMP%]{margin-bottom:10px;color:#5a6c85;font-size:11.5px}.graph-preview-toolbar[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin-bottom:10px}.gi-preview-tool-btn[_ngcontent-%COMP%]{color:#1a3763!important;border-color:#586d8c66!important;font-weight:500;font-size:13px;line-height:32px;min-height:34px;padding:0 12px}.preview-zoom-hint[_ngcontent-%COMP%]{flex:1 1 200px;font-size:12px;color:#5a6c85;line-height:1.35}.graph-preview-wrap[_ngcontent-%COMP%]{width:100%;max-width:100%;border:1px solid rgba(88,109,140,.22);border-radius:8px;background:#f9fafc;overflow:hidden}.gi-graph-svg[_ngcontent-%COMP%]{display:block;width:100%;height:auto;min-height:360px}.gi-graph-svg-interactive[_ngcontent-%COMP%]{cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none}.gi-graph-svg-interactive[_ngcontent-%COMP%]:active{cursor:grabbing}.gi-svg-bg[_ngcontent-%COMP%]{fill:#fafcfe}.gi-edge[_ngcontent-%COMP%]{stroke:#9eb0cc;stroke-width:1.65}.gi-arrow-head[_ngcontent-%COMP%]{fill:#9eb0cc}.gi-edge-label[_ngcontent-%COMP%]{font-size:16px;fill:#4a5f82;pointer-events:none;text-anchor:middle;dominant-baseline:middle}.gi-node-label[_ngcontent-%COMP%]{font-size:20px;fill:#1a3763;pointer-events:none}  .graph-insights-page .mat-expansion-panel-header{min-height:48px;color:#1a3763;font-weight:500}  .graph-insights-page .mat-expansion-panel-body{padding:0 16px 12px}@media (max-width: 1200px){.content-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.summary-grid[_ngcontent-%COMP%]{grid-template-columns:repeat(2,minmax(140px,1fr))}}"]
    }))();
  }
  return GraphInsightsComponent;
})();