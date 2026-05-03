// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function StereotypesDialogComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 20)(1, "h3");
    core /* ɵɵtext */.EFF(2, "Delete Stereotype");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3, " Are you sure you want to delete this Stereotype? ");
    core /* ɵɵelementStart */.j41(4, "div", 21)(5, "button", 22);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_div_3_Template_button_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.verifiedDelete());
    });
    core /* ɵɵtext */.EFF(6, "Yes");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "button", 22);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_div_3_Template_button_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.shouldShowAreYouSureDiv = false);
    });
    core /* ɵɵtext */.EFF(8, "No");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function StereotypesDialogComponent_div_4_option_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 32);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const logical_r4 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("className", logical_r4.constructor.name.includes("Object") ? "object" : "process");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(logical_r4.getBareName());
  }
}
function StereotypesDialogComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 23)(1, "span", 24);
    core /* ɵɵtext */.EFF(2, "Stereotype Name ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span", 25)(4, "mat-form-field")(5, "input", 26);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function StereotypesDialogComponent_div_4_Template_input_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.name, $event)) {
        ctx_r1.name = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("keyup", function StereotypesDialogComponent_div_4_Template_input_keyup_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.clearSelected());
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(6, "div")(7, "label", 27);
    core /* ɵɵtext */.EFF(8, "Anchor ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "div", 28)(10, "select", 29);
    core /* ɵɵtemplate */.DNE(11, StereotypesDialogComponent_div_4_option_11_Template, 2, 2, "option", 30);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(12, "label", 31);
    core /* ɵɵtext */.EFF(13, "*required");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.name);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.logicalElements);
  }
}
function StereotypesDialogComponent_mat_list_item_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-list-item", 33);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_mat_list_item_17_Template_mat_list_item_click_0_listener() {
      const favorite_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.select(favorite_r6));
    })("dblclick", function StereotypesDialogComponent_mat_list_item_17_Template_mat_list_item_dblclick_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.doubleClickAction());
    });
    core /* ɵɵelementStart */.j41(1, "div", 34)(2, "span", 35);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_mat_list_item_17_Template_span_click_2_listener() {
      const favorite_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.select(favorite_r6));
    })("dblclick", function StereotypesDialogComponent_mat_list_item_17_Template_span_dblclick_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.doubleClickAction());
    });
    core /* ɵɵelementStart */.j41(3, "span", 36);
    core /* ɵɵelement */.nrm(4, "img", 37);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "span", 38);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const favorite_r6 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("title", ctx_r1.getModelTooltip(favorite_r6));
    core /* ɵɵproperty */.Y8G("ngClass", favorite_r6.name === ctx_r1.selected ? "selected" : "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("src", favorite_r6.type === ctx_r1.StereotypeType.System ? "assets/SVG/regFileStereotypeG.svg" : "assets/SVG/regFileStereotypeNonG.svg", core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.prepareString(favorite_r6.name), " ");
  }
}
function StereotypesDialogComponent_mat_dialog_content_23__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 43);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_mat_dialog_content_23__svg_svg_2_Template_svg_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r9);
      const stereotype_r8 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.addToFavorites(stereotype_r8, $event));
    });
    core /* ɵɵelement */.nrm(1, "path", 44);
    core /* ɵɵelementEnd */.k0s();
  }
}
function StereotypesDialogComponent_mat_dialog_content_23__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 43);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_mat_dialog_content_23__svg_svg_3_Template_svg_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const stereotype_r8 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeFromFavorites(stereotype_r8, $event));
    });
    core /* ɵɵelement */.nrm(1, "path", 45);
    core /* ɵɵelementEnd */.k0s();
  }
}
function StereotypesDialogComponent_mat_dialog_content_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-dialog-content", 39);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_mat_dialog_content_23_Template_mat_dialog_content_click_0_listener() {
      const stereotype_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.select(stereotype_r8));
    });
    core /* ɵɵelementStart */.j41(1, "div", 40);
    core /* ɵɵtemplate */.DNE(2, StereotypesDialogComponent_mat_dialog_content_23__svg_svg_2_Template, 2, 0, "svg", 41)(3, StereotypesDialogComponent_mat_dialog_content_23__svg_svg_3_Template, 2, 0, "svg", 41);
    core /* ɵɵelementStart */.j41(4, "span", 35);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_mat_dialog_content_23_Template_span_click_4_listener() {
      const stereotype_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.select(stereotype_r8));
    })("dblclick", function StereotypesDialogComponent_mat_dialog_content_23_Template_span_dblclick_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.doubleClickAction());
    });
    core /* ɵɵelementStart */.j41(5, "span", 36);
    core /* ɵɵelement */.nrm(6, "img", 37);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "span", 42);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const stereotype_r8 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵpropertyInterpolate */.FS9("title", ctx_r1.getModelTooltip(stereotype_r8));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", stereotype_r8 === ctx_r1.selected ? "selected" : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isFavorited(stereotype_r8));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isFavorited(stereotype_r8));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("src", stereotype_r8.type === ctx_r1.StereotypeType.System ? "assets/SVG/regFileStereotypeG.svg" : "assets/SVG/regFileStereotypeNonG.svg", core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.prepareString(stereotype_r8.name), " ");
  }
}
function StereotypesDialogComponent_button_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 46);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_button_26_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.saveAction());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.isAllowedToSave());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getSaveText());
  }
}
function StereotypesDialogComponent_button_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 46);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_button_27_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r12);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.saveAsGenericAction());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.isAllowedToSaveAsGeneric());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getSaveAsGenericText());
  }
}
function StereotypesDialogComponent_button_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 46);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_button_28_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.loadAction());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.selected);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.geLoadText());
  }
}
function StereotypesDialogComponent_button_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 46);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_button_29_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r14);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.setAction());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r1.selected);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.geSetText());
  }
}
function StereotypesDialogComponent_button_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 46);
    core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_button_30_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r15);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.deleteAction());
    });
    core /* ɵɵtext */.EFF(1, "Delete");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isAllowedToDelete() === false || !ctx_r1.selected);
  }
}
let StereotypesDialogComponent = /*#__PURE__*/(() => {
  class StereotypesDialogComponent {
    constructor(dialogRef, storage, context, userService, initRappid, data) {
      this.dialogRef = dialogRef;
      this.storage = storage;
      this.context = context;
      this.userService = userService;
      this.initRappid = initRappid;
      this.Mode = StereotypeStorageMode;
      this.StereotypeType = StereotypeType;
      this.mode = StereotypeStorageMode.SAVE;
      this.name = "";
      this.archiveMode = "false";
      this.searchInput = "";
      this.spinnerFlag = true;
      this.shouldShowAreYouSureDiv = false;
      this.favorites = [];
      this.mode = data.mode;
    }
    ngOnInit() {
      this.spinnerFlag = true;
      const this_ = this;
      this.storage.getAllStereotypes().then(allStereotypes => this.stereotypesToShow = this.allStereotypes = allStereotypes).then(() => this.storage.getFavoriteStereotypes()).then(favorites => favorites.forEach(f => {
        if (this_.allStereotypes.find(s => s.id === f)) {
          this.favorites.push(this.allStereotypes.find(s => s.id == f));
        }
      })).then(() => {
        this.spinnerFlag = false;
        this.selectMainThingIfAlreadySet();
      });
      this.logicalElements = this.initRappid.getOpmModel().logicalElements.filter(log => (log.constructor.name.includes("Object") || log.constructor.name.includes("Process")) && !log.isComputational() && !log.getBelongsToStereotyped() && !this.initRappid.getOpmModel().getStereotypeByLogicalElement(log)).sort((a, b) => {
        if (a.getBareName() > b.getBareName()) {
          return 1;
        } else {
          return -1;
        }
      });
      $(".wrapDialog")[0].onclick = $event => {
        if ($event.target === $(".wrapDialog")[0]) {
          this.selected = undefined;
        }
      };
    }
    selectMainThingIfAlreadySet() {
      const mainThing = this.initRappid.opmModel.logicalElements.find(log => log.isMainThing);
      if (mainThing) {
        const idx = this.logicalElements.indexOf(mainThing);
        if (idx !== -1 && $("#mainThingSelect")[0]) {
          $("#mainThingSelect")[0].selectedIndex = idx;
          return mainThing.getBareName();
        }
        return null;
      }
      return null;
    }
    isValidateStereotypeName() {
      const name = this.name;
      if (name === "") {
        return false;
      }
      return RegExp("^[a-zA-Z0-9_() ]+$").test(name);
    }
    clearSelected() {
      this.selected = undefined;
    }
    search() {
      this.stereotypesToShow = this.allStereotypes.filter(s => s.name.includes(this.searchInput));
      this.clearSelected();
    }
    select(stereotype) {
      this.selected = stereotype;
      this.name = stereotype.name;
    }
    prepareString(name) {
      if (name.length > 9) {
        return name.slice(0, 9) + "...";
      } else {
        return name;
      }
    }
    doubleClickAction() {
      if (this.isAllowedToSet()) {
        return this.setAction();
      } else if (this.isAllowedToLoad()) {
        return this.loadAction();
      }
    }
    getSaveText() {
      return "Save As Organization Stereotype";
    }
    shouldDisplaySave() {
      return this.mode === StereotypeStorageMode.SAVE && (this.userService.isOrgAdmin() || this.userService.isSysAdmin());
    }
    isAllowedToSave() {
      return this.isValidateStereotypeName();
    }
    isFavorited(item) {
      return this.favorites.includes(item);
    }
    saveAction() {
      if ($("#mainThingSelect")[0].selectedIndex === -1) {
        $("#requiredField")[0].style.color = "red";
        return;
      }
      if (!this.isValidStereotype()) {
        return;
      }
      const type = StereotypeType.Organization;
      const existing = this.allStereotypes.find(s => s.name == this.name && s.type == type);
      this.logicalElements[$("#mainThingSelect")[0].selectedIndex].isMainThing = true; // TODO: Make part of the model
      this.context.saveStereotype(existing ? existing : {
        name: this.name,
        type: type,
        id: undefined,
        description: ""
      }, !!existing).then(res => {
        this.initRappid.modelService.setName(this.name);
        (0, validationAlert)(`Successfully saved stereotype [${this.name}].`, 2500, "Success");
        this.dialogRef.close();
      }).catch(res => {
        (0, validationAlert)(`Failed to save stereotype [${this.name}].`, 2500, "error");
      });
    }
    getSaveAsGenericText() {
      return "Save As Global Stereotype";
    }
    shouldDisplayGenericSave() {
      return this.mode === StereotypeStorageMode.SAVE && this.userService.isSysAdmin();
    }
    isAllowedToSaveAsGeneric() {
      return this.isValidateStereotypeName();
    }
    saveAsGenericAction() {
      if ($("#mainThingSelect")[0].selectedIndex === -1) {
        $("#requiredField")[0].style.color = "red";
        return;
      }
      if (!this.isValidStereotype()) {
        return;
      }
      const type = StereotypeType.System;
      this.logicalElements[$("#mainThingSelect")[0].selectedIndex].isMainThing = true; // TODO: Make part of the model
      const existing = this.allStereotypes.find(s => s.name == this.name && s.type == type);
      this.context.saveStereotype(existing ? existing : {
        name: this.name,
        type: type,
        id: undefined,
        description: ""
      }, !!existing).then(res => {
        this.initRappid.modelService.setName(this.name);
        this.dialogRef.close();
        (0, validationAlert)(`Successfully saved stereotype [${this.name}].`, 2500, "Success");
      }).catch(err => (0, validationAlert)(`Failed to save stereotype [${this.name}].`, 2500, "Error"));
    }
    geLoadText() {
      return "Load Stereotype";
    }
    isAllowedToLoad() {
      return this.mode === StereotypeStorageMode.LOAD;
    }
    loadAction() {
      this.dialogRef.close();
      this.context.loadStereotype(this.selected).then(() => (0, validationAlert)(`Successfully loaded stereotype [${this.selected.name}].`, 2500, "Success")).catch(err => (0, validationAlert)(`Failed to load stereotype [${this.selected.name}].`, 2500, "Error"));

    }
    geSetText() {
      return "Set Stereotype";
    }
    isAllowedToSet() {
      return this.mode === StereotypeStorageMode.SET;
    }
    isValidStereotype() {
      if (this.initRappid.getOpmModel().opds.filter(o => !o.isHidden).length > 1) {
        (0, validationAlert)("Currently, OPCloud supports only stereotypes with one level diagram.", 5000, "Error");
        return false;
      }
      return true;
    }
    setAction() {
      this.spinnerFlag = true;
      this.storage.setStereotype(this.selected).then(stereotype => {
        this.dialogRef.close(stereotype);
      });
    }
    getModelTooltip(model) {
      return "Stereotype: " + model.name + "\nDescription: " + model.description;
    }
    isAllowedToDelete() {
      return (this.mode === this.Mode.SAVE || this.mode === this.Mode.LOAD) && this.userService.user.userData.SysAdmin || this.userService.user.userData.OrgAdmin && this.selected && this.selected.type === StereotypeType.Organization;
    }
    shouldDisplayDelete() {
      return this.mode === this.Mode.SAVE || this.mode === this.Mode.LOAD;
    }
    deleteAction() {
      // TODO: check again if allowed to delete this stereotype
      this.showAreYouSureToDeleteDiv();
    }
    showAreYouSureToDeleteDiv() {
      this.shouldShowAreYouSureDiv = true;
    }
    verifiedDelete() {
      this.storage.deleteStereotype(this.selected.id).then(() => {
        this.allStereotypes = this.allStereotypes.filter(s => s.id != this.selected.id);
        this.shouldShowAreYouSureDiv = false;
        this.name = "";
        this.search();
      });
    }
    addToFavorites(stereotype, $event) {
      this.storage.setFavoriteStereotype(stereotype.id).then(() => {
        if (!this.favorites.includes(stereotype)) {
          this.favorites.push(stereotype);
        }
        this.clearSelected();
      });
      $event.stopPropagation();
    }
    removeFromFavorites(stereotype, $event) {
      this.storage.unsetFavoriteStereotype(stereotype.id).then(() => {
        if (this.favorites.includes(stereotype)) {
          this.favorites.splice(this.favorites.indexOf(stereotype), 1);
        }
        this.clearSelected();
      });
      $event.stopPropagation();
    }
    static #_ = (() => this.ɵfac = function StereotypesDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || StereotypesDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: StereotypesDialogComponent,
      selectors: [["stereotypes-dialog"]],
      decls: 33,
      vars: 14,
      consts: [[1, "stereotypesFullDiv"], ["id", "header", 3, "className"], ["id", "areYouSureDiv", 4, "ngIf"], ["style", "position: relative;", 4, "ngIf"], ["id", "searchAndVersionsDiv"], ["id", "searchText"], ["id", "searchField"], ["type", "text", "id", "searchInput", "matInput", "", 3, "ngModelChange", "keyup", "ngModel"], [1, "path"], ["id", "lastmodel", 2, "overflow-x", "scroll"], ["id", "fortitle", 2, "margin-left", "20px"], ["rows", "1", "rowHeight", "70px", 2, "margin-left", "70px", "display", "inline-flex", "overflow-x", "scroll"], ["class", "tileFavorite", 3, "click", "dblclick", 4, "ngFor", "ngForOf"], [2, "position", "absolute", "left", "calc(50% - 57px)", "top", "300px", 3, "hidden"], [3, "hidden"], [1, "wrapDialog"], ["class", "dialogContent", 3, "title", "click", 4, "ngFor", "ngForOf"], [1, "footerDialog"], ["class", "footerBtn", "mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", 1, "footerBtn", 3, "click"], ["id", "areYouSureDiv"], [2, "margin-top", "30px", "margin-left", "25px"], ["mat-button", "", 2, "height", "35px", 3, "click"], [2, "position", "relative"], ["id", "newStereotypeText"], ["id", "newStereotypeInput"], ["type", "text", "matInput", "", 3, "ngModelChange", "keyup", "ngModel"], ["id", "mainThingLabel", "tooltip", "The thing the stereotype is anchored when linked in a model"], ["id", "mainThingSelectDiv"], ["id", "mainThingSelect"], [3, "className", 4, "ngFor", "ngForOf"], ["id", "requiredField", 2, "color", "transparent", "display", "block", "font-size", "11px", "margin-left", "7px"], [3, "className"], [1, "tileFavorite", 3, "click", "dblclick"], ["id", "singleFileDivRecent", 3, "ngClass", "title"], [3, "click", "dblclick"], [1, "svgForSingleFile"], ["width", "24px", "height", "30px", 3, "src"], [1, "textForSingleFavoriteFile"], [1, "dialogContent", 3, "click", "title"], [1, "singleFileDivRecent", 3, "ngClass"], ["class", "favoriteStar", "width", "15", "height", "14", "viewBox", "0 0 15 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 3, "click", 4, "ngIf"], [1, "textForSingleFile"], ["width", "15", "height", "14", "viewBox", "0 0 15 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "favoriteStar", 3, "click"], ["d", "M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z", "fill", "#C4C4C4"], ["d", "M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z", "fill", "#4E607F"], ["mat-button", "", 1, "footerBtn", 3, "click", "disabled"]],
      template: function StereotypesDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "p", 1);
          core /* ɵɵtext */.EFF(2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(3, StereotypesDialogComponent_div_3_Template, 9, 0, "div", 2)(4, StereotypesDialogComponent_div_4_Template, 14, 2, "div", 3);
          core /* ɵɵelementStart */.j41(5, "div", 4)(6, "span", 5);
          core /* ɵɵtext */.EFF(7, "Search");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "span", 6)(9, "mat-form-field")(10, "input", 7);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function StereotypesDialogComponent_Template_input_ngModelChange_10_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchInput, $event)) {
              ctx.searchInput = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("keyup", function StereotypesDialogComponent_Template_input_keyup_10_listener() {
            return ctx.search();
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(11, "div", 8)(12, "div", 9)(13, "span", 10)(14, "span");
          core /* ɵɵtext */.EFF(15, "Favorites:");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(16, "mat-list", 11);
          core /* ɵɵtemplate */.DNE(17, StereotypesDialogComponent_mat_list_item_17_Template, 7, 4, "mat-list-item", 12);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(18, "br");
          core /* ɵɵelementStart */.j41(19, "div", 13);
          core /* ɵɵelement */.nrm(20, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "div", 14)(22, "div", 15);
          core /* ɵɵtemplate */.DNE(23, StereotypesDialogComponent_mat_dialog_content_23_Template, 9, 6, "mat-dialog-content", 16);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(24, "hr");
          core /* ɵɵelementStart */.j41(25, "mat-dialog-actions", 17);
          core /* ɵɵtemplate */.DNE(26, StereotypesDialogComponent_button_26_Template, 2, 2, "button", 18)(27, StereotypesDialogComponent_button_27_Template, 2, 2, "button", 18)(28, StereotypesDialogComponent_button_28_Template, 2, 2, "button", 18)(29, StereotypesDialogComponent_button_29_Template, 2, 2, "button", 18)(30, StereotypesDialogComponent_button_30_Template, 2, 1, "button", 18);
          core /* ɵɵelementStart */.j41(31, "button", 19);
          core /* ɵɵlistener */.bIt("click", function StereotypesDialogComponent_Template_button_click_31_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(32, "Cancel");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("className", ctx.mode === ctx.Mode.SAVE ? "save" : "loadset");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.mode === ctx.Mode.SAVE ? "Save" : ctx.mode === ctx.Mode.LOAD ? "Load" : "Set", " Stereotype");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowAreYouSureDiv);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === ctx.Mode.SAVE);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchInput);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.favorites);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.stereotypesToShow);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldDisplaySave());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldDisplayGenericSave());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isAllowedToLoad());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isAllowedToSet());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldDisplayDelete());
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatDialogActions, MatDialogContent, MatFormField, MatInput, MatList, MatListItem, MatButton, ProgressSpinner, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: ["#header[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}.wrapDialog[_ngcontent-%COMP%]{height:300px}.dialogContent[_ngcontent-%COMP%]{display:inline-block;margin:0;max-height:65vh;overflow:auto;padding:0 10px}#fortitle[_ngcontent-%COMP%]{color:#1a3763;font-size:13px}.mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-mdc-grid-tile-footer[_ngcontent-%COMP%] > *[_ngcontent-%COMP%], .mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-mdc-grid-tile-header[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{margin:2px}#singleFileContainer[_ngcontent-%COMP%]{position:relative;width:67px;height:59px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.svgForSingleFile[_ngcontent-%COMP%]{position:relative;top:8%;left:28.39%}.textForSingleFile[_ngcontent-%COMP%]{display:block;white-space:nowrap;position:relative;width:100%;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}.textForSingleFavoriteFile[_ngcontent-%COMP%]{display:block;white-space:nowrap;position:relative;left:8%;width:50px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}.textForSingleFile[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover{color:#fff}.path[_ngcontent-%COMP%]{position:relative;left:-24px;background-color:transparent;width:calc(100% + 40px);height:70px;border:1px solid rgba(0,0,0,.1);font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:24px;color:#1a3763}button[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;color:#1a3763}#backInPathBTN[_ngcontent-%COMP%]{position:absolute;left:0;width:35px;height:72px;background:none}#pathDisplay[_ngcontent-%COMP%]{position:relative;top:25%;left:5%}.switch[_ngcontent-%COMP%]{position:relative;top:-10px;display:inline-block;width:97px;height:35px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{opacity:0;width:0;height:0}.slider[_ngcontent-%COMP%]{position:absolute;cursor:pointer;inset:0;background-color:#ccc;transition:.4s}.slider[_ngcontent-%COMP%]:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:5px;background-color:#fff;transition:.4s}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#78a8f1}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #2196f3}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translate(53px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}.mat-mdc-input-underline[_ngcontent-%COMP%]{display:none}#searchAndVersionsDiv[_ngcontent-%COMP%]{height:56px;margin-top:-54px;margin-left:287px}#searchText[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}.loadset[_ngcontent-%COMP%]{padding-bottom:20px}#searchField[_ngcontent-%COMP%]{position:relative;left:10px;width:368px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#showVersionsSwitch[_ngcontent-%COMP%]{position:relative;top:19px;float:right;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:14px;color:#1a3763}#folderDiv[_ngcontent-%COMP%]{height:246px;overflow:auto}#singleFileDiv[_ngcontent-%COMP%]{height:164px;overflow:auto}#folderDiv[_ngcontent-%COMP%]::-webkit-scrollbar{width:6px}#folderDiv[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:1px}#folderDiv[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:1px;background:#b9d2df54;border-radius:1px}#singleFileDiv[_ngcontent-%COMP%]::-webkit-scrollbar{width:6px}#singleFileDiv[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:1px}#singleFileDiv[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:1px;background:#b9d2df54;border-radius:1px}#textForFile[_ngcontent-%COMP%]{position:relative;overflow:hidden;width:60px;min-width:60px;height:12px;min-height:12px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}#newStereotypeText[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;text-align:center;color:#1a3763}#newStereotypeInput[_ngcontent-%COMP%]{width:268px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#newStereotypeDescriptionText[_ngcontent-%COMP%]{position:relative;left:20px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:12px;text-align:center;color:#1a3763}#newStereotypeDescriptionInput[_ngcontent-%COMP%]{position:relative;left:20px;margin-right:30px;width:368px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.mat-grid-list-tile[_ngcontent-%COMP%]   .mat-grid-list-tile-footer[_ngcontent-%COMP%], .mat-grid-list-tile[_ngcontent-%COMP%]   .mat-grid--list-tile-header[_ngcontent-%COMP%]{display:flex;align-items:center;width:142px;height:48px;color:#000;border:1px solid rgba(73,114,132,.2);border-radius:6px;background:none;overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.footerDialog[_ngcontent-%COMP%]{position:absolute;justify-content:center!important;align-content:center!important;display:flex;flex-wrap:wrap;align-items:center;bottom:10px;left:0;height:40px;width:100%;background-image:linear-gradient(transparent,#fff,#fff,#fff)}.footerBtn[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763;padding:5px;margin:5px;letter-spacing:normal}#singleFileContainer[_ngcontent-%COMP%]:hover{background:#1a3763;color:#fff;cursor:pointer}span.textForSingleFile[_ngcontent-%COMP%]:hover{color:#fff}#singleFileContainer[_ngcontent-%COMP%]:hover   #textForFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}#singleFileContainer.selected[_ngcontent-%COMP%]{background:#1a3763;color:#fff;cursor:pointer}.singleFileDivRecent[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%], .singleFileDivRecent[_ngcontent-%COMP%]:hover{background:#1a3763;cursor:pointer;color:#fff}.singleFileDivRecent.selected[_ngcontent-%COMP%], .singleFileDivRecent.selected[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{background:#1a3763;color:#fff;cursor:pointer}#singleFileContainer.selected[_ngcontent-%COMP%]   #textForFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}.hover-container[_ngcontent-%COMP%]{position:relative}.hover-content[_ngcontent-%COMP%]{position:absolute;bottom:-10px;right:10px;display:none}.hover-container[_ngcontent-%COMP%]:hover   .hover-content[_ngcontent-%COMP%]{display:block}#fortitle[_ngcontent-%COMP%]{color:#1a3763;font-size:13px;position:absolute;top:25%}#textForoneFileFile[_ngcontent-%COMP%]{position:relative;overflow:hidden;width:60px;min-width:60px;height:12px;min-height:12px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;text-align:center;color:#1a3763}.singleFileDivRecent.selected[_ngcontent-%COMP%]   #textForoneFileFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}.singleFileDivRecent[_ngcontent-%COMP%]{position:relative;width:67px;height:59px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.favoriteStar[_ngcontent-%COMP%]{position:absolute;left:2px;top:3px}.tileFavorite[_ngcontent-%COMP%]{left:5px;width:75px;height:59px;top:-12px;flex-direction:column;margin-top:13px}.singleFileDivRecent[_ngcontent-%COMP%]:hover   #textForoneFileFile[_ngcontent-%COMP%]{color:#fff;cursor:pointer}#mainThingSelectDiv[_ngcontent-%COMP%]{width:155px;border:1px solid rgba(88,109,140,.25);border-radius:4px;padding:3px;display:inline-block}#mainThingSelectDiv[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{display:block;width:150px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}#mainThingLabel[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;text-align:center;color:#1a3763}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}#areYouSureDiv[_ngcontent-%COMP%]{width:350px;height:140px;position:absolute;padding:20px;z-index:9999999;left:calc(50% - 175px);top:calc(50% - 90px);background-color:#fff;box-shadow:0 2px 20px #00000040;border-radius:6px}#areYouSureDiv[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:18px;text-align:center;color:#1a3763}"]
    }))();
  }
  return StereotypesDialogComponent;
})();