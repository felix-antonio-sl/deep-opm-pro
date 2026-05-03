// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/remove-operation-selection/remove-operation.ts
// Extracted by opm-extracted/tools/extract.mjs

function RemoveOperationComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 10);
    core /* ɵɵtext */.EFF(1, "This Element Appears in:");
    core /* ɵɵelementEnd */.k0s();
  }
}
function RemoveOperationComponent_remove_locator_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "remove-locator");
  }
}
function RemoveOperationComponent_remove_locator_links_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "remove-locator-links");
  }
}
function RemoveOperationComponent_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 9);
    core /* ɵɵlistener */.bIt("click", function RemoveOperationComponent_button_9_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeLocally());
    });
    core /* ɵɵtext */.EFF(1, "Remove this appearance only");
    core /* ɵɵelementEnd */.k0s();
  }
}
function RemoveOperationComponent_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 11);
    core /* ɵɵlistener */.bIt("click", function RemoveOperationComponent_button_10_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeLocally());
    });
    core /* ɵɵtext */.EFF(1, "Remove this appearance only");
    core /* ɵɵelementEnd */.k0s();
  }
}
function RemoveOperationComponent_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 12);
    core /* ɵɵlistener */.bIt("click", function RemoveOperationComponent_button_11_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeInOPD());
    });
    core /* ɵɵtext */.EFF(1, "Remove all appearance from this OPD");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isInzoomed() && ctx_r1.instancesInOpd().length > 1);
  }
}
function RemoveOperationComponent_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 13);
    core /* ɵɵlistener */.bIt("click", function RemoveOperationComponent_button_12_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeInOPD());
    });
    core /* ɵɵtext */.EFF(1, "Remove all appearance from this OPD");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isInzoomed() && ctx_r1.instancesInOpd().length > 1);
  }
}
function RemoveOperationComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 11);
    core /* ɵɵlistener */.bIt("click", function RemoveOperationComponent_button_13_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.removeInModel());
    });
    core /* ɵɵtext */.EFF(1, "Remove from the entire model ");
    core /* ɵɵelementEnd */.k0s();
  }
}
let RemoveOperationComponent = /*#__PURE__*/(() => {
  class RemoveOperationComponent {
    constructor(dialogRef) {
      this.dialogRef = dialogRef;
      this.initRappid = (0, getInitRappidShared)();
    }
    ngOnInit() {}
    // getOccurrences() {
    //   const drawn = this.initRappid.getElementToRemove();
    //   if (!drawn)
    //     return [];
    //   const oc = this.initRappid.getOpmModel().getLogicalElementByVisualId(drawn.id).visualElements;
    //   const data = new Array();
    //   for (const vis of oc) {
    //     if (vis.id) {
    //       const opd = this.initRappid.getOpmModel().getOpdByThingId(vis.id);
    //       data.push({name: opd.getName(), visualId: vis.id});
    //     }
    //   }
    //   return data;
    // }
    shouldBeRedColored() {
      return this.numberOfOPDsAppearsAt() <= 1;
    }
    instancesInOpd() {
      const drawn = this.initRappid.getElementToRemove();
      if (!drawn) {
        return [];
      }
      const visual = this.initRappid.opmModel.getVisualElementById(drawn.id);
      if (!visual) {
        return [];
      }
      const opd = this.initRappid.opmModel.getOpdByThingId(drawn.id);
      return opd.visualElements.filter(th => th.logicalElement === visual.logicalElement);
    }
    isInzoomed() {
      const drawn = this.initRappid.getElementToRemove();
      if (!drawn) {
        return true;
      }
      const visual = this.initRappid.opmModel.getVisualElementById(drawn.id);
      if (!visual) {
        return true;
      }
      return !!visual.getRefineable();
    }
    isLastOccourence() {
      const drawn = this.initRappid.getElementToRemove();
      if (!drawn) {
        return true;
      }
      const logical = this.initRappid.opmModel.getLogicalElementByVisualId(drawn.id);
      if (!logical) {
        return true;
      }
      return logical.visualElements.length === 1;
    }
    numberOfOPDsAppearsAt() {
      const drawn = this.initRappid.getElementToRemove();
      if (!drawn) {
        return 1;
      }
      const logical = this.initRappid.opmModel.getLogicalElementByVisualId(drawn.id);
      if (!logical) {
        return 1;
      }
      const visuals = logical.visualElements;
      const opds = [];
      visuals.forEach(vis => {
        const opd = this.initRappid.opmModel.getOpdByThingId(vis.id);
        if (opd && !opds.includes(opd.id)) {
          opds.push(opd.id);
        }
      });
      return opds.length;
    }
    removeLocally() {
      const drawn = this.initRappid.getElementToRemove();
      this.initRappid.onRemoveOptionChosen(drawn, RemoveType.Localy);
      this.initRappid.setElementToRemoveToNull();
      this.dialogRef.close();
    }
    removeInOPD() {
      const drawn = this.initRappid.getElementToRemove();
      this.initRappid.onRemoveOptionChosen(drawn, RemoveType.InThisOPDOnly);
      this.initRappid.setElementToRemoveToNull();
      this.dialogRef.close();
    }
    removeInModel() {
      const model = this.initRappid.getOpmModel();
      const drawn = this.initRappid.getElementToRemove();
      if (!drawn) {
        this.dialogRef.close();
        return;
      }
      const logical = model.getLogicalElementByVisualId(drawn.id);
      if (drawn.constructor.name.includes("Default")) {
        const triangle = drawn.getTargetElement();
        const linksToRemove = this.initRappid.getGraphService().getGraph().getConnectedLinks(triangle, {
          outbound: true
        });
        for (const lnk of linksToRemove) {
          const lgc = this.initRappid.opmModel.getLogicalElementByVisualId(lnk.id);
          const rr = model.getRelatedRelationsByLogicalLink(lgc);
          if (rr) {
            for (let i = rr.length - 1; i >= 0; i--) {
              if (rr[i] && rr[i].visualElements[0]) {
                this.initRappid.onRemoveOptionChosen(drawn, RemoveType.AllOPDs, rr[i].visualElements[0]);
              }
            }
          }
          this.initRappid.onRemoveOptionChosen(lnk, RemoveType.AllOPDs);
        }
      } else if (logical && model.getRelatedRelationsByLogicalLink(logical)) {
        const related = model.getRelatedRelationsByLogicalLink(logical);
        for (let i = related.length - 1; i >= 0; i--) {
          if (related[i] && related[i].visualElements[0]) {
            this.initRappid.onRemoveOptionChosen(drawn, RemoveType.AllOPDs, related[i].visualElements[0]);
          }
        }
      } else {
        this.initRappid.onRemoveOptionChosen(drawn, RemoveType.AllOPDs);
      }
      this.initRappid.setElementToRemoveToNull();
      this.dialogRef.close();
    }
    checkIfLink() {
      const toRemove = this.initRappid.getElementToRemove();
      if (toRemove) {
        return toRemove.constructor.name.includes("link") || toRemove.constructor.name.includes("Link");
      }
      return false;
    }
    isStereotyped() {
      const toRemove = this.initRappid.getElementToRemove();
      if (toRemove) {
        if (toRemove instanceof OpmDefaultLink) {
          return false;
        }
        return !!toRemove.getVisual().logicalElement.visualElements.find(vis => {
          const visOpd = this.initRappid.getOpmModel().getOpdByThingId(vis.id);
          return visOpd?.isHidden && visOpd?.requirementsOpd !== true;
        });
      }
      return false;
    }
    isRequirementsSetObject() {
      const toRemove = this.initRappid.getElementToRemove();
      if (toRemove && OPCloudUtils.isInstanceOfLogicalThing(toRemove.getVisual()?.logicalElement)) {
        const logical = toRemove.getVisual()?.logicalElement;
        if (logical.isSatisfiedRequirementSetObject()) {
          return true;
        }
      }
      return false;
    }
    isRequirementsOwnerWithStereotype() {
      const toRemove = this.initRappid.getElementToRemove();
      if (toRemove && OPCloudUtils.isInstanceOfLogicalThing(toRemove.getVisual()?.logicalElement)) {
        const logical = toRemove.getVisual()?.logicalElement;
        if (logical.getAllRequirements()?.length > 0) {
          return !!logical.getStereotype();
        }
      }
      return false;
    }
    static #_ = (() => this.ɵfac = function RemoveOperationComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RemoveOperationComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RemoveOperationComponent,
      selectors: [["opcloud-remove-opertaion-dialog"]],
      decls: 16,
      vars: 8,
      consts: [[1, "removeOperationMain"], [1, "removeOperationMainTitle"], ["class", "removeOperationContentTitle", 4, "ngIf"], [4, "ngIf"], [1, "removeOperationButtons"], ["class", "removeOperationButton", "mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", "class", "removeOperationButtonRed", 3, "click", 4, "ngIf"], ["class", "removeOperationButton", "mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", "class", "removeOperationButtonRed", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", 1, "removeOperationButton", 3, "click"], [1, "removeOperationContentTitle"], ["mat-button", "", 1, "removeOperationButtonRed", 3, "click"], ["mat-button", "", 1, "removeOperationButton", 3, "click", "disabled"], ["mat-button", "", 1, "removeOperationButtonRed", 3, "click", "disabled"]],
      template: function RemoveOperationComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "p", 1);
          core /* ɵɵtext */.EFF(2, "Choose Remove Operation:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(3, RemoveOperationComponent_span_3_Template, 2, 0, "span", 2);
          core /* ɵɵelementStart */.j41(4, "div");
          core /* ɵɵtemplate */.DNE(5, RemoveOperationComponent_remove_locator_5_Template, 1, 0, "remove-locator", 3)(6, RemoveOperationComponent_remove_locator_links_6_Template, 1, 0, "remove-locator-links", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(7, "br");
          core /* ɵɵelementStart */.j41(8, "p", 4);
          core /* ɵɵtemplate */.DNE(9, RemoveOperationComponent_button_9_Template, 2, 0, "button", 5)(10, RemoveOperationComponent_button_10_Template, 2, 0, "button", 6)(11, RemoveOperationComponent_button_11_Template, 2, 1, "button", 7)(12, RemoveOperationComponent_button_12_Template, 2, 1, "button", 8)(13, RemoveOperationComponent_button_13_Template, 2, 0, "button", 6);
          core /* ɵɵelementStart */.j41(14, "button", 9);
          core /* ɵɵlistener */.bIt("click", function RemoveOperationComponent_Template_button_click_14_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(15, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.checkIfLink());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.checkIfLink());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.checkIfLink());
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isLastOccourence());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isLastOccourence());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.checkIfLink() && !ctx.shouldBeRedColored());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.checkIfLink() && ctx.shouldBeRedColored());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isStereotyped() === false && ctx.isRequirementsSetObject() === false && ctx.isRequirementsOwnerWithStereotype() === false);
        }
      },
      styles: [".removeOperationMain[_ngcontent-%COMP%]   .removeOperationMainTitle[_ngcontent-%COMP%]{color:#1a3763;text-align:center;font-size:large;font-weight:700}.removeOperationMain[_ngcontent-%COMP%]   .removeOperationContentTitle[_ngcontent-%COMP%]{text-align:left;font-size:medium;font-weight:700;color:#1a3763}.removeOperationMain[_ngcontent-%COMP%]   .removeOperationButtons[_ngcontent-%COMP%]{text-align:center}.removeOperationMain[_ngcontent-%COMP%]   .removeOperationButtons[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(.removeOperationButton, .removeOperationButtonRed)[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;letter-spacing:normal!important;line-height:normal;font-size:14px;color:#000000de!important;padding:5px;margin:5px}.removeOperationMain[_ngcontent-%COMP%]   .removeOperationButtons[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(.removeOperationButton, .removeOperationButtonRed)[_ngcontent-%COMP%]   .mat-mdc-button[_ngcontent-%COMP%]:not(:disabled){color:#1a3763}.removeOperationMain[_ngcontent-%COMP%]   .removeOperationButtons[_ngcontent-%COMP%]   .removeOperationButtonRed[_ngcontent-%COMP%]:hover{background-color:#ff443d;color:#fff!important}ul[_ngcontent-%COMP%]{list-style-type:none;float:left;padding:5px}li[_ngcontent-%COMP%]{padding-left:1em}"]
    }))();
  }
  return RemoveOperationComponent;
})();
