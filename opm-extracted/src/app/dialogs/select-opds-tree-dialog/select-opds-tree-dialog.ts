// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/select-opds-tree-dialog/select-opds-tree-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function SelectOpdsTreeDialog_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 14);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_9_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.selectAll());
    });
    core /* ɵɵtext */.EFF(1, "Select All Visible");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 14);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_10_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.unselectAll());
    });
    core /* ɵɵtext */.EFF(1, "Unselect All Visible");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 14);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_11_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleShowHideOpdsNames());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getShowHideButtonText());
  }
}
function SelectOpdsTreeDialog_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 14);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_12_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.closeAllNodes());
    });
    core /* ɵɵtext */.EFF(1, "Close All");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_div_14_span_1__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 28);
    core /* ɵɵelement */.nrm(1, "path", 29);
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_div_14_span_1__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 30);
    core /* ɵɵelement */.nrm(1, "path", 31);
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_div_14_span_1_mat_radio_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-radio-button", 32);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_div_14_span_1_mat_radio_button_4_Template_mat_radio_button_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r9);
      const item_r7 = core /* ɵɵnextContext */.XpG(2).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.onRadioChange($event, item_r7));
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r7 = core /* ɵɵnextContext */.XpG(2).$implicit;
    core /* ɵɵproperty */.Y8G("checked", item_r7.selected);
  }
}
function SelectOpdsTreeDialog_div_14_span_1_mat_checkbox_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-checkbox", 33);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SelectOpdsTreeDialog_div_14_span_1_mat_checkbox_5_Template_mat_checkbox_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const item_r7 = core /* ɵɵnextContext */.XpG(2).$implicit;
      if (!core /* ɵɵtwoWayBindingSet */.DH7(item_r7.checked, $event)) {
        item_r7.checked = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("change", function SelectOpdsTreeDialog_div_14_span_1_mat_checkbox_5_Template_mat_checkbox_change_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
      return core /* ɵɵresetView */.Njj(ctx_r1.filterResults());
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r7 = core /* ɵɵnextContext */.XpG(2).$implicit;
    core /* ɵɵtwoWayProperty */.R50("ngModel", item_r7.checked);
  }
}
function SelectOpdsTreeDialog_div_14_span_1__svg_svg_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 34);
    core /* ɵɵelement */.nrm(1, "circle", 35)(2, "path", 36)(3, "path", 37)(4, "path", 38)(5, "path", 39);
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_div_14_span_1__svg_svg_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 40);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_div_14_span_1__svg_svg_8_Template_svg_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r11);
      return core /* ɵɵresetView */.Njj($event.stopPropagation());
    });
    core /* ɵɵelement */.nrm(1, "circle", 41)(2, "path", 36)(3, "path", 37)(4, "path", 38)(5, "path", 39);
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_div_14_span_1__svg_svg_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 40);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_div_14_span_1__svg_svg_9_Template_svg_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r12);
      return core /* ɵɵresetView */.Njj($event.stopPropagation());
    });
    core /* ɵɵelement */.nrm(1, "circle", 42)(2, "path", 36)(3, "path", 37)(4, "path", 38)(5, "path", 39);
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_div_14_span_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 17)(1, "div", 18);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_div_14_span_1_Template_div_click_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const item_r7 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.arrowClick($event, item_r7));
    });
    core /* ɵɵtemplate */.DNE(2, SelectOpdsTreeDialog_div_14_span_1__svg_svg_2_Template, 2, 0, "svg", 19)(3, SelectOpdsTreeDialog_div_14_span_1__svg_svg_3_Template, 2, 0, "svg", 20);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(4, SelectOpdsTreeDialog_div_14_span_1_mat_radio_button_4_Template, 1, 1, "mat-radio-button", 21)(5, SelectOpdsTreeDialog_div_14_span_1_mat_checkbox_5_Template, 1, 1, "mat-checkbox", 22);
    core /* ɵɵelementStart */.j41(6, "span", 23);
    core /* ɵɵtemplate */.DNE(7, SelectOpdsTreeDialog_div_14_span_1__svg_svg_7_Template, 6, 0, "svg", 24)(8, SelectOpdsTreeDialog_div_14_span_1__svg_svg_8_Template, 6, 0, "svg", 25)(9, SelectOpdsTreeDialog_div_14_span_1__svg_svg_9_Template, 6, 0, "svg", 25);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "span", 26);
    core /* ɵɵlistener */.bIt("dragstart", function SelectOpdsTreeDialog_div_14_span_1_Template_span_dragstart_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const item_r7 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.dragStart($event, item_r7));
    })("dragover", function SelectOpdsTreeDialog_div_14_span_1_Template_span_dragover_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragover($event));
    })("dragenter", function SelectOpdsTreeDialog_div_14_span_1_Template_span_dragenter_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const item_r7 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.dragEnter($event, item_r7));
    })("dragleave", function SelectOpdsTreeDialog_div_14_span_1_Template_span_dragleave_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragLeave($event));
    })("dragend", function SelectOpdsTreeDialog_div_14_span_1_Template_span_dragend_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.onDrop());
    });
    core /* ɵɵtext */.EFF(11);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "div", 27);
    core /* ɵɵlistener */.bIt("dragenter", function SelectOpdsTreeDialog_div_14_span_1_Template_div_dragenter_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const item_r7 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.invisibleDragEnter($event, item_r7));
    })("dragover", function SelectOpdsTreeDialog_div_14_span_1_Template_div_dragover_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.dragover($event));
    })("dragleave", function SelectOpdsTreeDialog_div_14_span_1_Template_div_dragleave_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.invisibleDragLeave($event));
    })("mouseleave", function SelectOpdsTreeDialog_div_14_span_1_Template_div_mouseleave_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.invisibleDragLeave($event));
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r7 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("@inOutAnimation", undefined);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.mode === "tree-management" && !item_r7.isOpen && ctx_r1.searchString.length === 0 && (ctx_r1.nodeHasChildren(item_r7.node) || ctx_r1.nodeSharedWithSubModel(item_r7.node) && !item_r7.node.data.subModelAlreadyLoaded));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.mode === "tree-management" && item_r7.isOpen && ctx_r1.searchString.length === 0 && (ctx_r1.nodeHasChildren(item_r7.node) || ctx_r1.nodeSharedWithSubModel(item_r7.node)));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.mode === "tree-management");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.mode === "export");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.getSubModelSyncTooltip(item_r7.node));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowRedResync(item_r7.node));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowGreenSynced(item_r7.node));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowYellowSynced(item_r7.node));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleMap */.Aen(ctx_r1.getItemStyle(item_r7));
    core /* ɵɵproperty */.Y8G("draggable", ctx_r1.isDraggingActive(item_r7))("matTooltip", ctx_r1.getItemTooltip());
    core /* ɵɵattribute */.BMQ("opdId", item_r7.id);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getItemTitle(item_r7));
  }
}
function SelectOpdsTreeDialog_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 15);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_div_14_Template_div_click_0_listener($event) {
      const item_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clickItem($event, item_r7));
    })("dblclick", function SelectOpdsTreeDialog_div_14_Template_div_dblclick_0_listener() {
      const item_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.doubleClickItem(item_r7));
    })("mouseenter", function SelectOpdsTreeDialog_div_14_Template_div_mouseenter_0_listener() {
      const item_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.highlight(item_r7));
    })("mouseleave", function SelectOpdsTreeDialog_div_14_Template_div_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.unhighlight());
    });
    core /* ɵɵtemplate */.DNE(1, SelectOpdsTreeDialog_div_14_span_1_Template, 13, 15, "span", 16);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleMap */.Aen(ctx_r1.getMarginLeft(item_r7));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.shouldShowItem(item_r7));
  }
}
function SelectOpdsTreeDialog_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_16_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openOpd());
    });
    core /* ɵɵtext */.EFF(1, "Open");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_17_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.cut());
    });
    core /* ɵɵtext */.EFF(1, "Cut");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleMap */.Aen(ctx_r1.cutItem.length ? "opacity: 0.6;" : "");
  }
}
function SelectOpdsTreeDialog_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_18_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.paste());
    });
    core /* ɵɵtext */.EFF(1, "Paste");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_19_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r16);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.loadSubModel());
    });
    core /* ɵɵtext */.EFF(1, "Load Sub Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_20_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r17);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.renameSubModel());
    });
    core /* ɵɵtext */.EFF(1, "Rename Sub Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_21_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r18);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openSubModelInNewTab());
    });
    core /* ɵɵtext */.EFF(1, "Open Sub Model In New Tab");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_22_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r19);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.disconnectSubModel());
    });
    core /* ɵɵtext */.EFF(1, "Disconnect Sub Model");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_23_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r20);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.updateRequirementsView());
    });
    core /* ɵɵtext */.EFF(1, "Update");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_24_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r21);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeOpd());
    });
    core /* ɵɵtext */.EFF(1, "Remove");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_25_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r22);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.renameOpd());
    });
    core /* ɵɵtext */.EFF(1, "Rename");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SelectOpdsTreeDialog_button_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_button_26_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r23);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.apply());
    });
    core /* ɵɵtext */.EFF(1, "Apply");
    core /* ɵɵelementEnd */.k0s();
  }
}
let SelectOpdsTreeDialog = /*#__PURE__*/(() => {
  class SelectOpdsTreeDialog {
    constructor(data, dialogRef, treeViewService, context) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.treeViewService = treeViewService;
      this.context = context;
      this.arr = new Array();
      this.displayArr = new Array();
      this.checkedValues = {};
      this.searchString = "";
      if (!data) {
        data = {
          mode: "tree-management",
          title: ""
        };
        this.data = data;
      }
      this.mode = data.mode;
      this.searchTitle = this.mode === "export" ? "SDs to export" : "Search OPD";
      this.searchInnerText = this.mode === "export" ? "Search by name, number or 'Checked SDs'" : "Search by name or number";
      this.closeButtonText = this.mode === "export" ? "Cancel" : "Close";
      this.openNodes = {};
      this.visibleNodes = {};
      this.multiSelectedItems = [];
      this.itemsMap = new Map();
      this.cutItem = [];
    }
    ngOnInit() {
      this.itemsMap.clear();
      this.nodes = this.treeViewService.nodes;
      this.arr = new TreeParser(this.treeViewService).parse(true);
      for (const item of this.arr) {
        if (this.openNodes.hasOwnProperty(item.id)) {
          item.isOpen = this.openNodes[item.id];
          item.isVisible = this.visibleNodes[item.id];
        }
      }
      this.displayArr = this.arr;
      this.displayArr.forEach(item => this.itemsMap.set(item.id, item));
      const storageItem = localStorage.getItem((this.context.getCurrentContext()?.properties?.id || "") + "selectedPdfOPDs");
      if (storageItem) {
        const asJson = JSON.parse(storageItem);
        for (const item of this.arr) {
          const same = asJson.find(i => i.title === item.title && i.depth === item.depth);
          if (same) {
            item.checked = same.checked;
          }
        }
      }
      this.setLasso();
    }
    apply() {
      const ret = this.arr.filter(item => item.checked).map(item => this.treeViewService.initRappid.opmModel.getOpd(item.id));
      if (ret.length === 0) {
        return (0, validationAlert)("At least 1 OPD should be selected.", 5000);
      }
      const toSet = this.arr.map(item => {
        return {
          id: item.id,
          depth: item.depth,
          title: item.title,
          checked: item.checked
        };
      });
      localStorage.setItem((this.context.getCurrentContext().properties?.id || "") + "selectedPdfOPDs", JSON.stringify(toSet));
      this.dialogRef.close(ret);
    }
    cancel() {
      this.dialogRef.close(undefined);
    }
    selectSubTree(item) {
      if (item.title.includes("stereotype") || item.title.includes("View of Requirement")) {
        item.checked = !item.checked;
        return;
      }
      const itemsToChange = [];
      for (const other of this.arr) {
        if (other.depth.startsWith(item.depth) && !other.title.includes("stereotype") && !other.title.toLowerCase().includes("view of")) {
          itemsToChange.push(other);
        }
      }
      let valToSet;
      if (itemsToChange.find(i => !i.checked)) {
        valToSet = true;
      } else {
        valToSet = false;
      }
      itemsToChange.forEach(i => i.checked = valToSet);
      this.filterResults();
    }
    highlight(item) {
      if (item.title.includes("stereotype") || item.title.includes("View of Requirement") || this.mode === "tree-management") {
        return;
      }
      for (const i of this.arr) {
        if (i !== item && i.depth.startsWith(item.depth)) {
          i.highlighted = true;
        }
      }
    }
    unhighlight() {
      for (const i of this.arr) {
        i.highlighted = false;
      }
    }
    getMarginLeft(item) {
      if (this.searchString.trim().length > 0) {
        return "margin-left: 0px;";
      }
      if (item.title.includes("stereotype") || item.title.includes("View of Requirement")) {
        return "margin-left: 0px;";
      }
      return "margin-left: " + item.depthAsNumber * 40 + "px;";
    }
    onSearchStringChange($event) {
      this.searchString = $event.target.value;
      this.filterResults();
    }
    filterResults() {
      if (this.searchString.trim().length === 0) {
        this.displayArr = this.arr;
      } else if (this.searchString.trim().toLowerCase() === "checked sds") {
        this.displayArr = this.arr.filter(item => item.checked);
      } else {
        this.displayArr = this.arr.filter(item => item.title.toLowerCase().includes(this.searchString.toLowerCase()));
      }
    }
    selectAll() {
      this.displayArr.forEach(item => item.checked = true);
    }
    unselectAll() {
      this.displayArr.forEach(item => item.checked = false);
    }
    onRadioChange($event, item) {
      if ($event.ctrlKey || $event.metaKey) {
        if (this.mode !== "tree-management" || item.node.belongsToSubModel || item.node.sharedOpdWithSubModelId) {
          return;
        }
        if (!this.multiSelectedItems.includes(item)) {
          if (this.multiSelectedItems.length === 0 || this.multiSelectedItems[0].parent === item.parent) {
            this.multiSelectedItems.push(item);
            $("#tree").find("[opdId='" + item.id + "']")[0].classList.add("multiselected");
          }
        } else {
          const idx = this.multiSelectedItems.indexOf(item);
          if (idx >= 0) {
            this.multiSelectedItems.splice(idx, 1);
            $("#tree").find("[opdId='" + item.id + "']")[0].classList.remove("multiselected");
          }
        }
      } else {
        this.multiSelectedItems = [];
        $(".nodeName").removeClass("multiselected");
      }
      this.selectedItem = item;
      this.arr.forEach(other => other.selected = item === other);
      this.onSelection();
    }
    onSelection() {
      const init = this.treeViewService.initRappid;
      const opd = init.opmModel.getOpd(this.selectedItem.id);
      this._shouldShowRename = new RenameOpdTreeAction(init, opd).canBePerformed();
      this._shouldShowUpdateRequirementsView = new UpdateRequirementViewTreeAction(init, opd).canBePerformed();
      this._shouldShowDisconnectSubModel = new DisconnectSubModelTreeAction(init, this.context, opd).canBePerformed();
      this._shouldShowRenameSubModel = new RenameSubModelTreeAction(init, opd).canBePerformed();
      this._shouldShowOpenSubModelInNewTab = new OpenSubModelInNewTabTreeAction(init, this.context, opd).canBePerformed();
      this._shouldShowLoadSubModel = this._shouldShowRenameSubModel && this.shouldShowRedResync(this.selectedItem.node);
      this._shouldShowRemove = !this.selectedItem.node.belongsToSubModel && !this.selectedItem.node.sharedOpdWithSubModelId && this.selectedItem.node.parent?.id !== "Stereotypes";
      this._shouldShowCut = this.canBeCut(this.selectedItem);
      this._shouldShowPaste = this.cutItem.length > 0 && this.canBePasted(this.selectedItem);
    }
    getItemTooltip() {
      if (this.mode === "export") {
        return "Double-click to select / unselect all children";
      } else {
        return "Double-click to open";
      }
    }
    openOpd(item) {
      const init = this.treeViewService.initRappid;
      const id = item?.id || this.selectedItem.id;
      init.opdHierarchyRef.changeGraphModel(null, init.treeViewService.treeView.treeModel.getNodeById(id));
      this.dialogRef.close();
    }
    renameOpd() {
      const init = this.treeViewService.initRappid;
      const opd = init.opmModel.getOpd(this.selectedItem.id);
      new RenameOpdTreeAction(init, opd).act().then(newName => {
        this.selectedItem.title = newName;
      });
    }
    removeOpd() {
      var _this = this;
      return (0, default)(function* () {
        const init = _this.treeViewService.initRappid;
        const treeModel = _this.treeViewService.treeView.treeModel;
        const node = treeModel.getNodeById(_this.selectedItem.id);
        const ret = yield new RemoveOpdTreeAction(init, node, treeModel).act();
        if (ret.removed) {
          const idx = _this.arr.findIndex(item => item.id === _this.selectedItem.id);
          _this.arr.splice(idx, 1);
          _this.selectedItem = undefined;
        }
      })();
    }
    doubleClickItem(item) {
      if (this.mode === "export") {
        return this.selectSubTree(item);
      } else {
        return this.openOpd(item);
      }
    }
    toggleShowHideOpdsNames() {
      new ToggleOPDsNamesTreeAction(this.treeViewService.initRappid).act();
    }
    getShowHideButtonText() {
      if (!this.treeViewService.initRappid.oplService.settings.SDNames) {
        return "Show Names";
      } else {
        return "Hide Names";
      }
    }
    clickItem($event, item) {
      if (this.mode === "tree-management") {
        this.onRadioChange($event, item);
      }
    }
    getItemTitle(item) {
      const state = this.treeViewService.initRappid.oplService.settings.SDNames;
      if (state) {
        return item.title;
      }
      return item.title.split(":")[0];
    }
    onDrop() {
      var _this2 = this;
      return (0, default)(function* () {
        const init = _this2.treeViewService.initRappid;
        if (_this2.multiSelectedItems.length > 1) {
          const dragTargetId = _this2.dragTarget?.id;
          const invisibleId = _this2.invisibleItem?.id;
          init.opmModel.logForUndo("Multi tree movement");
          init.opmModel.setShouldLogForUndoRedo(false, "Multi tree movement");
          for (const item of _this2.multiSelectedItems) {
            _this2.invisibleItem = _this2.itemsMap.get(invisibleId);
            _this2.draggedItem = _this2.itemsMap.get(item.id);
            _this2.dragTarget = _this2.itemsMap.get(dragTargetId);
            yield _this2.onDropAction();
          }
          _this2.multiSelectedItems = [];
          $(".nodeName").removeClass("multiselected");
          init.opmModel.setShouldLogForUndoRedo(true, "Multi tree movement");
          return;
        }
        return _this2.onDropAction();
      })();
    }
    onDropAction() {
      var _this3 = this;
      return (0, default)(function* () {
        let idxInParent;
        if (_this3.invisibleItem && _this3.invisibleItem.parent) {
          const parentOpd = _this3.treeViewService.initRappid.opmModel.getOpd(_this3.invisibleItem.parent.id);
          idxInParent = parentOpd.children.findIndex(it => it.id === _this3.invisibleItem.id);
          _this3.dragTarget = _this3.invisibleItem.parent;
        }
        if (!_this3.canBeDropped()) {
          _this3.draggedItem = undefined;
          _this3.dragTarget = undefined;
          return;
        }
        _this3.isLoading = true;
        yield OPCloudUtils.waitXms(300);
        const init = _this3.treeViewService.initRappid;
        const effectedO = init.opmModel.getOpd(_this3.draggedItem.id);
        const realParentN = _this3.treeViewService.treeView.treeModel.getNodeById(_this3.dragTarget.id).parent;
        const realParentID = _this3.dragTarget.id;
        const realParentO = init.opmModel.getOpd(_this3.dragTarget.id);
        const prevParentO = init.opmModel.getOpd(effectedO.parendId);
        const ev = {
          node: {}
        };
        init.opdHierarchyRef.onMoveNode(ev, effectedO, realParentN, realParentID, prevParentO);
        if (effectedO.parendId === realParentID) {
          prevParentO.children = prevParentO.children.sort((a, b) => a.id === _this3.draggedItem.id ? -1 : 0);
        }
        if (idxInParent !== undefined) {
          (0, moveItemInArray)(realParentO.children, realParentO.children.findIndex(c => c.id === _this3.draggedItem.id), idxInParent + 1);
        }
        _this3.treeViewService.init(init.opmModel);
        if (!_this3.dragTarget.isOpen) {
          _this3.draggedItem.isVisible = false;
        }
        _this3.draggedItem = undefined;
        _this3.dragTarget = undefined;
        _this3.selectedItem = undefined;
        _this3.keepWhatNodesAreOpen();
        _this3.ngOnInit();
        _this3.isLoading = false;
      })();
    }
    dragStart($event, item) {
      this.draggedItem = item;
      $event.target.classList.add("dragged");
    }
    dragEnter($event, item) {
      this.dragTarget = item;
    }
    dragLeave($event) {
      this.dragTarget = undefined;
      $event.target.classList.remove("dragged");
    }
    dragover($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    getItemStyle(item) {
      let style = "";
      if (item.highlighted) {
        style += "opacity: 0.6;";
      } else if (item === this.draggedItem) {
        style += "opacity: 0.3;";
      } else if (this.cutItem.includes(item)) {
        style += "opacity: 0.3;";
      }
      if (this.dragTarget === item) {
        style += "font-weight: bold;";
      }
      return style;
    }
    isDraggingActive(item) {
      return this.mode === "tree-management" && item.title !== "SD" && !item.node.belongsToSubModel && !item.title.startsWith("View of Requirement") && !item.node.sharedOpdWithSubModelId && item.node.parent.id !== "Stereotypes";
    }
    updateRequirementsView() {
      const init = this.treeViewService.initRappid;
      const opd = init.opmModel.getOpd(this.selectedItem.id);
      new UpdateRequirementViewTreeAction(init, opd).act().then(() => this.dialogRef.close());
    }
    disconnectSubModel() {
      const that = this;
      const init = this.treeViewService.initRappid;
      const opd = init.opmModel.getOpd(this.selectedItem.id);
      new DisconnectSubModelTreeAction(init, this.context, opd).act().then(() => {
        that.dialogRef.close();
      });
    }
    renameSubModel() {
      const that = this;
      const init = this.treeViewService.initRappid;
      const opd = init.opmModel.getOpd(this.selectedItem.id);
      new RenameSubModelTreeAction(init, opd).act().then(newName => {
        if (newName) {
          that.selectedItem.title = that.selectedItem.title.split(":")[0] + ": " + newName + " Subsystem Model View";
        }
      });
    }
    openSubModelInNewTab() {
      const init = this.treeViewService.initRappid;
      const opd = init.opmModel.getOpd(this.selectedItem.id);
      new OpenSubModelInNewTabTreeAction(init, this.context, opd).act().then(() => this.dialogRef.close());
    }
    nodeHasChildren(node) {
      return node.children?.length > 0;
    }
    nodeSharedWithSubModel(node) {
      return this.treeViewService.initRappid.opdHierarchyRef.nodeSharedWithSubModel(node);
    }
    arrowClick($event, item) {
      $event?.stopPropagation();
      $event?.preventDefault();
      if (!this.nodeHasChildren(item.node)) {
        return;
      }
      item.isOpen = !item.isOpen;
      const beginning = item.title === "SD" ? "SD" : item.title.split(":")[0] + ".";
      if (item.isOpen) {
        for (const other of this.arr) {
          if (other !== item && other.title.startsWith(beginning) && other.parent.isOpen && other.parent.isVisible) {
            other.isVisible = true;
          }
        }
      } else if (!item.isOpen) {
        for (const other of this.arr) {
          if (other !== item && other.title.startsWith(beginning)) {
            other.isVisible = false;
          }
        }
      }
    }
    getSubModelSyncTooltip(node) {
      return this.treeViewService.initRappid.opdHierarchyRef.getSubModelSyncTooltip({
        data: node
      });
    }
    shouldShowRedResync(node) {
      return this.mode === "tree-management" && this.treeViewService.initRappid.opdHierarchyRef.shouldShowRedResync({
        data: node
      });
    }
    shouldShowGreenSynced(node) {
      return this.mode === "tree-management" && this.treeViewService.initRappid.opdHierarchyRef.shouldShowGreenSynced({
        data: node
      });
    }
    shouldShowYellowSynced(node) {
      return this.mode === "tree-management" && this.treeViewService.initRappid.opdHierarchyRef.shouldShowYellowSynced({
        data: node
      });
    }
    shouldShowItem(item) {
      return this.mode === "export" || !item.parent || item.isVisible;
    }
    loadSubModel() {
      const node = this.treeViewService.treeView.treeModel.getNodeById(this.selectedItem.id);
      this.selectedItem = undefined;
      this.isLoading = true;
      this.treeViewService.initRappid.opdHierarchyRef.toggleNode(node).then(() => {
        this.keepWhatNodesAreOpen();
        this.ngOnInit();
        this.isLoading = false;
      });
    }
    keepWhatNodesAreOpen() {
      this.openNodes = {};
      this.visibleNodes = {};
      for (const item of this.arr) {
        this.openNodes[item.id] = item.isOpen;
        this.visibleNodes[item.id] = item.isVisible;
      }
    }
    cut() {
      this.cutItem = this.multiSelectedItems.length > 0 ? [...this.multiSelectedItems] : [this.selectedItem];
    }
    paste() {
      var _this4 = this;
      return (0, default)(function* () {
        const init = _this4.treeViewService.initRappid;
        const dragTargetId = _this4.dragTarget?.id;
        if (_this4.cutItem.length === 1) {
          yield _this4.onDrop();
        } else {
          init.opmModel.logForUndo("Multi tree movement");
          init.opmModel.setShouldLogForUndoRedo(false, "Multi tree movement");
          for (const item of _this4.cutItem) {
            _this4.dragTarget = _this4.itemsMap.get(dragTargetId);
            _this4.draggedItem = _this4.itemsMap.get(item.id);
            yield _this4.onDrop();
          }
          init.opmModel.setShouldLogForUndoRedo(true, "Multi tree movement");
        }
        _this4.cutItem = [];
        _this4.selectedItem = undefined;
      })();
    }
    canBeCut(item) {
      if (this.multiSelectedItems.length === 0) {
        return this.isDraggingActive(item);
      }
      for (const it of this.multiSelectedItems) {
        if (!this.isDraggingActive(it)) {
          return false;
        }
      }
      return true;
    }
    canBePasted(target) {
      this.dragTarget = target;
      this.draggedItem = this.cutItem[0];
      if (this.multiSelectedItems.length === 0) {
        return this.canBeDropped();
      }
      for (const it of this.multiSelectedItems) {
        this.draggedItem = it;
        if (!this.canBeDropped()) {
          return false;
        }
      }
      return true;
    }
    canBeDropped() {
      if (!this.dragTarget || this.draggedItem === this.dragTarget || this.dragTarget.node.belongsToSubModel || this.dragTarget.node.sharedOpdWithSubModelId || this.dragTarget.title.startsWith("View of Requirement") || this.dragTarget.node.parent.id === "Stereotypes") {
        return false;
      }
      const draggedT = this.draggedItem.title.split(":")[0];
      const targetT = this.dragTarget.title.split(":")[0];
      if (targetT.startsWith(draggedT)) {
        return false;
      }
      return true;
    }
    invisibleDragEnter($event, item) {
      if (item.id === "SD") {
        return;
      }
      $event.target.style.background = "linear-gradient(180deg, transparent, #f4f5f9, #ffc000, #f4f5f9, transparent)";
      this.invisibleItem = item;
    }
    invisibleDragLeave($event) {
      $event.target.style.background = "transparent";
      this.invisibleItem = undefined;
    }
    setLasso() {
      if (this.mode !== "tree-management") {
        return;
      }
      const that = this;
      const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);
      const collides = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
      const checkElementsCollision = (x, y, width, height) => {
        that.multiSelectedItems = [];
        Array.from(document.getElementsByClassName("nodeName")).forEach(elBox => {
          const isColliding = collides({
            x,
            y,
            width,
            height
          }, elBox.getBoundingClientRect());
          if (isColliding) {
            const opdId = elBox.getAttribute("opdId");
            const item = that.itemsMap.get(opdId);
            const canBeDone = !item.node.belongsToSubModel && !item.node.sharedOpdWithSubModelId;
            if (item && canBeDone && that.multiSelectedItems.length === 0 || that.multiSelectedItems[0].parent === item.parent) {
              that.multiSelectedItems.push(item);
              elBox.classList.add("multiselected");
            } else {
              elBox.classList.remove("multiselected");
            }
          } else {
            elBox.classList.remove("multiselected");
          }
        });
      };
      const toolLasso = {
        onDown(event) {
          if (!event.shiftKey || that.mode !== "tree-management") {
            return;
          }
          that.multiSelectedItems = [];
          $(".nodeName").removeClass("multiselected");
          this.startX = event.clientX;
          this.startY = event.clientY;
          this.el = elNew("div", {
            className: "lasso"
          });
          this.onMove = this.onMove.bind(this);
          this.onUp = this.onUp.bind(this);
          addEventListener("pointermove", this.onMove);
          addEventListener("pointerup", this.onUp);
          Object.assign(this.el.style, {
            position: `fixed`,
            outline: `1px dashed black`,
            zIndex: `99999`,
            pointerEvents: `none`,
            userSelect: `none`
          });
          document.getElementById("tree").append(this.el);
        },
        onMove({
          clientX,
          clientY
        }) {
          this.currX = clientX;
          this.currY = clientY;
          const x = Math.min(this.startX, this.currX);
          const y = Math.min(this.startY, this.currY);
          const w = Math.abs(this.startX - this.currX);
          const h = Math.abs(this.startY - this.currY);
          Object.assign(this.el.style, {
            left: `${x}px`,
            top: `${y}px`,
            width: `${w}px`,
            height: `${h}px`
          });
          checkElementsCollision(x, y, w, h);
        },
        onUp() {
          removeEventListener("pointermove", this.onMove);
          removeEventListener("pointerup", this.onUp);
          this.el.remove();
        }
      };
      addEventListener("pointerdown", evt => toolLasso.onDown(evt));
    }
    closeAllNodes() {
      this.displayArr.forEach(item => {
        if (item.isOpen) {
          this.arrowClick(undefined, item);
        }
      });
    }
    static #_ = (() => this.ɵfac = function SelectOpdsTreeDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SelectOpdsTreeDialog)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA, 8), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(TreeViewService), core /* ɵɵdirectiveInject */.rXU(ContextService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SelectOpdsTreeDialog,
      selectors: [["select-opds-tree-dialog"]],
      decls: 31,
      vars: 30,
      consts: [["id", "content", 1, "opdsTreeManagementAll"], ["id", "header", 1, "opdsTreeManagementTitle"], [1, "opdsTreeManagementSearch"], ["appearance", "outline", 2, "width", "calc(100% - 85px)", "padding-left", "10px"], ["matInput", "", 3, "ngModelChange", "keyup", "placeholder", "ngModel"], [1, "opdsTreeManagementSearchButtons"], ["class", "opdsTreeManagementSearchButton", "mat-button", "", 3, "click", 4, "ngIf"], ["id", "tree", 1, "opdsTreeManagementSDaTree"], ["class", "opdsTreeManagementSDaTreeItemDiv", 3, "style", "click", "dblclick", "mouseenter", "mouseleave", 4, "ngFor", "ngForOf"], [1, "opdsTreeManagementFooterButtons"], ["mat-button", "", "class", "opdsTreeManagementFooterButton", 3, "click", 4, "ngIf"], ["mat-button", "", "class", "opdsTreeManagementFooterButton", 3, "style", "click", 4, "ngIf"], ["mat-button", "", 1, "opdsTreeManagementFooterButton", 3, "click"], [2, "position", "absolute", "left", "calc(50% - 65px)", "top", "calc(50% - 65px)", 3, "hidden"], ["mat-button", "", 1, "opdsTreeManagementSearchButton", 3, "click"], [1, "opdsTreeManagementSDaTreeItemDiv", 3, "click", "dblclick", "mouseenter", "mouseleave"], ["class", "opdsTreeManagementOpdItem", 4, "ngIf"], [1, "opdsTreeManagementOpdItem"], [1, "arrowSize", 3, "click"], ["width", "12", "height", "12", "viewBox", "0 0 9 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["width", "12", "height", "12", "viewBox", "0 0 10 9", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [3, "checked", "click", 4, "ngIf"], ["type", "checkbox", 3, "ngModel", "ngModelChange", "change", 4, "ngIf"], [1, "syncSpan", 3, "matTooltip"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click", 4, "ngIf"], ["matTooltipPosition", "right", 1, "nodeName", 3, "dragstart", "dragover", "dragenter", "dragleave", "dragend", "draggable", "matTooltip"], [1, "invisibleDropBar", 3, "dragenter", "dragover", "dragleave", "mouseleave"], ["width", "12", "height", "12", "viewBox", "0 0 9 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M8.6189 5.31216L0.618896 9.93096L0.618896 0.693359L8.6189 5.31216Z", "fill", "#B9D2DF"], ["width", "12", "height", "12", "viewBox", "0 0 10 9", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M4.69345 8.31226L0.0746517 0.312256L9.31226 0.312256L4.69345 8.31226Z", "fill", "#B9D2DF"], [3, "click", "checked"], ["type", "checkbox", 3, "ngModelChange", "change", "ngModel"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["cx", "12", "cy", "12", "r", "12", "fill", "#FF0000"], ["d", "M3.77473 11.0514C3.77739 10.8459 3.98138 10.7038 4.17512 10.7726L9.68884 12.7311C9.9189 12.8128 9.96021 13.1205 9.75986 13.26L4.17037 17.1522C3.97002 17.2918 3.6958 17.1463 3.69896 16.9022L3.77473 11.0514Z", "fill", "white"], ["d", "M16.3911 17.2885V17.2885C13.0515 19.4751 8.55553 18.3298 6.66908 14.8118L6.50482 14.5055", "stroke", "white", "stroke-width", "1.5"], ["d", "M20.083 14.3934C20.0385 14.5942 19.8099 14.6917 19.6342 14.5849L14.6347 11.5449C14.4261 11.418 14.4483 11.1084 14.6729 11.0126L20.9377 8.33987C21.1623 8.24407 21.4011 8.44232 21.3483 8.68069L20.083 14.3934Z", "fill", "white"], ["d", "M9.00061 5.71817V5.71817C12.7155 4.25727 16.8841 6.29396 18.0148 10.1223L18.1133 10.4557", "stroke", "white", "stroke-width", "1.5"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click"], ["cx", "12", "cy", "12", "r", "12", "fill", "#2DE729"], ["cx", "12", "cy", "12", "r", "12", "fill", "#E7DF29"]],
      template: function SelectOpdsTreeDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h3", 1);
          core /* ɵɵtext */.EFF(2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div", 2)(4, "mat-form-field", 3)(5, "mat-label");
          core /* ɵɵtext */.EFF(6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "input", 4);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SelectOpdsTreeDialog_Template_input_ngModelChange_7_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchString, $event)) {
              ctx.searchString = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("keyup", function SelectOpdsTreeDialog_Template_input_keyup_7_listener($event) {
            return ctx.onSearchStringChange($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(8, "div", 5);
          core /* ɵɵtemplate */.DNE(9, SelectOpdsTreeDialog_button_9_Template, 2, 0, "button", 6)(10, SelectOpdsTreeDialog_button_10_Template, 2, 0, "button", 6)(11, SelectOpdsTreeDialog_button_11_Template, 2, 1, "button", 6)(12, SelectOpdsTreeDialog_button_12_Template, 2, 0, "button", 6);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(13, "div", 7);
          core /* ɵɵtemplate */.DNE(14, SelectOpdsTreeDialog_div_14_Template, 2, 4, "div", 8);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(15, "div", 9);
          core /* ɵɵtemplate */.DNE(16, SelectOpdsTreeDialog_button_16_Template, 2, 0, "button", 10)(17, SelectOpdsTreeDialog_button_17_Template, 2, 2, "button", 11)(18, SelectOpdsTreeDialog_button_18_Template, 2, 0, "button", 10)(19, SelectOpdsTreeDialog_button_19_Template, 2, 0, "button", 10)(20, SelectOpdsTreeDialog_button_20_Template, 2, 0, "button", 10)(21, SelectOpdsTreeDialog_button_21_Template, 2, 0, "button", 10)(22, SelectOpdsTreeDialog_button_22_Template, 2, 0, "button", 10)(23, SelectOpdsTreeDialog_button_23_Template, 2, 0, "button", 10)(24, SelectOpdsTreeDialog_button_24_Template, 2, 0, "button", 10)(25, SelectOpdsTreeDialog_button_25_Template, 2, 0, "button", 10)(26, SelectOpdsTreeDialog_button_26_Template, 2, 0, "button", 10);
          core /* ɵɵelementStart */.j41(27, "button", 12);
          core /* ɵɵlistener */.bIt("click", function SelectOpdsTreeDialog_Template_button_click_27_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(28);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(29, "div", 13);
          core /* ɵɵelement */.nrm(30, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵstyleMap */.Aen(ctx.isLoading ? "filter: blur(3px);" : "");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.data.title);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.isLoading ? "filter: blur(3px);" : "");
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.searchTitle);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.searchInnerText);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchString);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "export");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "export");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.isLoading ? "filter: blur(3px);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.displayArr);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.isLoading ? "filter: blur(3px);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && !ctx._shouldShowLoadSubModel && ctx.multiSelectedItems.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowCut);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowPaste && ctx.cutItem.length);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowLoadSubModel);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowRenameSubModel);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowOpenSubModelInNewTab);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowDisconnectSubModel);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowUpdateRequirementsView);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowRemove && ctx.multiSelectedItems.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "tree-management" && ctx.selectedItem && ctx._shouldShowRename);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "export");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.closeButtonText);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", !ctx.isLoading);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatButton, MatCheckbox, MatRadioButton, DefaultValueAccessor, NgControlStatus, NgModel, ProgressSpinner],
      styles: [".opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementTitle[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:600;line-height:normal;font-size:20px;text-align:center;color:#1a3763}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSearch[_ngcontent-%COMP%]{height:65px;text-align:center;display:inline-flex;flex-direction:row;width:100%;align-items:center}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSearch[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%]{display:none}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSearch[_ngcontent-%COMP%]   .opdsTreeManagementSearchButtons[_ngcontent-%COMP%]{width:285px;display:inline-flex}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSearch[_ngcontent-%COMP%]   .opdsTreeManagementSearchButtons[_ngcontent-%COMP%]   .opdsTreeManagementSearchButton[_ngcontent-%COMP%]{min-width:40px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSDaTree[_ngcontent-%COMP%]{margin-left:50px;height:485px;overflow:auto}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSDaTree[_ngcontent-%COMP%]   .opdsTreeManagementSDaTreeItemDiv[_ngcontent-%COMP%]   .opdsTreeManagementOpdItem[_ngcontent-%COMP%]{align-items:center;margin-top:5px;display:flex;height:20px}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSDaTree[_ngcontent-%COMP%]   .opdsTreeManagementSDaTreeItemDiv[_ngcontent-%COMP%]   .opdsTreeManagementOpdItem[_ngcontent-%COMP%]   .arrowSize[_ngcontent-%COMP%]{width:15px}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSDaTree[_ngcontent-%COMP%]   .opdsTreeManagementSDaTreeItemDiv[_ngcontent-%COMP%]   .opdsTreeManagementOpdItem[_ngcontent-%COMP%]   .syncSpan[_ngcontent-%COMP%]{margin-left:-5px;margin-right:5px}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSDaTree[_ngcontent-%COMP%]   .opdsTreeManagementSDaTreeItemDiv[_ngcontent-%COMP%]   .opdsTreeManagementOpdItem[_ngcontent-%COMP%]   .nodeName[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;color:#000;text-align:left;border-bottom:1px #cccccc solid}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementSDaTree[_ngcontent-%COMP%]   .opdsTreeManagementSDaTreeItemDiv[_ngcontent-%COMP%]   .opdsTreeManagementOpdItem[_ngcontent-%COMP%]   .invisibleDropBar[_ngcontent-%COMP%]{height:8px;background:transparent;width:200px;position:fixed;margin-top:20px;margin-left:5px}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementFooterButtons[_ngcontent-%COMP%]{text-align:center}.opdsTreeManagementAll[_ngcontent-%COMP%]   .opdsTreeManagementFooterButtons[_ngcontent-%COMP%]   .opdsTreeManagementFooterButton[_ngcontent-%COMP%]{min-width:40px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763}.multiselected[_ngcontent-%COMP%]{color:#fff;background-color:#ffc400;border-radius:5px;padding-right:2px;padding-left:2px}#tree[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}#tree[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:4px;border-left:2px solid white;border-right:2px solid white}#tree[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:6px;border-left:4px solid white;border-right:4px solid white}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.mat-mdc-form-field-underline[_ngcontent-%COMP%], .mat-mdc-form-field-ripple[_ngcontent-%COMP%]{background-color:#1a3763!important}.mat-mdc-form-field-appearance-outline[_ngcontent-%COMP%]   .mat-mdc-form-field-outline[_ngcontent-%COMP%]{color:#1a3763!important}mat-mdc-checkbox[_ngcontent-%COMP%]{margin-right:5px}.mat-mdc-input-underline[_ngcontent-%COMP%]{display:block!important}[_nghost-%COMP%]   .mat-mdc-input-infix[_ngcontent-%COMP%]{display:block;position:relative}.mat-mdc-radio-button.mat-accent[_ngcontent-%COMP%]   .mat-mdc-radio-ripple[_ngcontent-%COMP%]   .mat-mdc-ripple-element[_ngcontent-%COMP%], .mat-mdc-radio-button.mat-accent[_ngcontent-%COMP%]   .mat-mdc-radio-inner-circle[_ngcontent-%COMP%]{background-color:#1a3763!important}.mat-mdc-radio-button.mat-accent.mat-mdc-radio-checked[_ngcontent-%COMP%]   .mat-mdc-radio-outer-circle[_ngcontent-%COMP%]{border-color:#1a3763!important}.dragged[_ngcontent-%COMP%]{color:#00000047;filter:drop-shadow(1px 1px 1px #00000047)}.mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{padding-bottom:0!important}"],
      data: {
        animation: [(0, trigger)("inOutAnimation", [(0, transition)(":enter", [(0, style)({
          height: 0,
          opacity: 0
        }), (0, animate)("0.3s ease-out", (0, style)({
          height: 20,
          opacity: 1
        }))]), (0, transition)(":leave", [(0, style)({
          height: 20,
          opacity: 1
        }), (0, animate)("0.3s ease-in", (0, style)({
          height: 0,
          opacity: 0
        }))])])]
      }
    }))();
  }
  return SelectOpdsTreeDialog;
})();