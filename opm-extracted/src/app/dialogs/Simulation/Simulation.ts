// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/Simulation/Simulation.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = (a0, a1) => ({
  object: a0,
  process: a1
});
function SimulationComponent_div_21_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 18)(1, "input", 19);
    core /* ɵɵlistener */.bIt("change", function SimulationComponent_div_21_div_1_Template_input_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.changedSelection($event, element_r2));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(2, "div", 20);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "button", 21);
    core /* ɵɵlistener */.bIt("click", function SimulationComponent_div_21_div_1_Template_button_click_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.simulationAction(ctx_r2.InitRappidService, element_r2));
    });
    core /* ɵɵtext */.EFF(5, "Set Simulation Parameters");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction2 */.l_i(3, c0, element_r2.name === "OpmLogicalObject", element_r2.name === "OpmLogicalProcess"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("checked", element_r2.getSimulationParams().simulated);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(element_r2.text);
  }
}
function SimulationComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 16);
    core /* ɵɵtemplate */.DNE(1, SimulationComponent_div_21_div_1_Template, 6, 6, "div", 17);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const element_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.isComputational(element_r2) && element_r2.constructor.name !== "OpmLogicalState");
  }
}
function SimulationComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 22)(1, "div");
    core /* ɵɵtext */.EFF(2, "No elements to show");
    core /* ɵɵelementEnd */.k0s()();
  }
}
let SimulationComponent = /*#__PURE__*/(() => {
  class SimulationComponent {
    constructor(modelService, differs, dialogRef) {
      this.modelService = modelService;
      this.dialogRef = dialogRef;
      this.resultedValues = {};
      this.showTypeIndex = 0;
      this.showType = [OpmLogicalThing, OpmLogicalProcess, OpmLogicalObject];
      this.searchString = "";
      this.searchSD = "";
      this.dictionary = {};
      this.isActive = true;
      this.menuOpen = false;
      this.constList = this.modelService.model.logicalElements;
      this.list = this.constList;
      this.differ = differs.find([]).create(null);
      for (const element of this.list) {
        this.dictionary[element.id] = {};
        this.dictionary[element.id].text = element.text;
        this.dictionary[element.id].name = element.name;
      }
    }
    onchange(event) {
      this.showTypeIndex = event.target.value;
      this.updateList();
    }
    updateList() {
      this.list = this.modelService.model.logicalElements;
      this.filter();
    }
    filter() {
      this.list = this.list.filter(e => e instanceof this.showType[this.showTypeIndex]).sort((e1, e2) => this.sortFunc(e1, e2));
      if (this.searchString.length > 0) {
        this.list = this.list.filter(a => a._text.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
      }
    }
    sortFunc(e1, e2) {
      if (e1.name === e2.name) {
        if (e1.text < e2.text) {
          return -1;
        } else {
          return 1;
        }
      }
      if (e1.name === "OpmLogicalObject") {
        return -1;
      } else {
        return 1;
      }
    }
    simulationAction(init, element) {
      const sim = element.getSimulationParams();
      (0, getInitRappidShared)().dialogService.openDialog(SimulationElementComponent, 700, 600, {
        sim: sim,
        logical: element,
        allowMultipleDialogs: true
      });
      this.toggleMenu();
    }
    ngDoCheck() {
      if ($(".thingDiv").length > 0 && $(".cdk-overlay-pane").length === 1) {
        let maximalDivWidth = $(".thingDiv")[0].getClientRects()[0].width;
        for (const div of $(".thingDiv")) {
          if (div.getClientRects()[0].width > maximalDivWidth) {
            maximalDivWidth = div.getClientRects()[0].width;
          }
        }
        const newWidth = Math.max(Math.min(maximalDivWidth + 340, window.innerWidth * 0.99), 600);
        $(".cdk-overlay-pane")[0].style.width = newWidth + "px";
      }
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
    search() {
      this.updateList();
    }
    isComputational(element) {
      if (element.constructor.name === "OpmLogicalObject") {
        return element.valueType !== valueType.None && element.valueType !== undefined;
      }
      if (element.constructor.name === "OpmLogicalProcess") {
        return element.code !== code.Unspecified && element.code !== undefined;
      }
    }
    close() {
      const nonParametricThings = this.list.filter(l => OPCloudUtils.isInstanceOfLogicalThing(l) && l.getSimulationParams().simulated && l.getRandomValues(1).length === 0);
      if (nonParametricThings.length > 0) {
        let msg = "The following things have no simulation params set:";
        for (const log of nonParametricThings) {
          msg += "<br>  -" + log.getBareName();
        }
        (0, validationAlert)(msg, 5000, "error");
      }
      this.dialogRef.close();
    }
    changedSelection($event, element) {
      element.getSimulationParams().simulated = $event.target.checked;
    }
    reset() {
      this.modelService.model.logicalElements.forEach(log => {
        if (log instanceof OpmLogicalThing) {
          log.getSimulationParams().simulated = false;
        }
      });
    }
    checkOrUncheckAll($event) {
      for (const logical of this.list.filter(item => this.isComputational(item) && item.constructor.name !== "OpmLogicalState")) {
        logical.getSimulationParams().simulated = $event.target.checked;
      }
    }
    static #_ = (() => this.ɵfac = function SimulationComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SimulationComponent)(core /* ɵɵdirectiveInject */.rXU(ModelService), core /* ɵɵdirectiveInject */.rXU(IterableDiffers), core /* ɵɵdirectiveInject */.rXU(MatDialogRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SimulationComponent,
      selectors: [["Simulate"]],
      decls: 27,
      vars: 3,
      consts: [["id", "content"], [1, "header"], [2, "display", "inline-block", "padding-bottom", "11px", "padding-top", "11px"], [1, "selectDiv"], [3, "change"], ["value", "0"], ["value", "1"], ["value", "2"], [1, "searchDiv"], ["type", "text", "placeholder", "Search by name", 1, "inputText", 3, "ngModelChange", "keyup", "ngModel"], ["type", "checkbox", "name", "checkAll", "value", "range", 1, "radioBtn", 3, "change"], [2, "display", "inline-block", "margin-left", "9px", "font-family", "Roboto, Helvetica Neue, sans-serif !important", "letter-spacing", "normal", "font-size", "14px", "color", "#1A3763", "align-items", "center"], ["id", "all_elements_holder"], ["class", "element_holder", 4, "ngFor", "ngForOf"], ["class", "element_holder", "style", "text-align: center; color: #1A3763;", 4, "ngIf"], ["mat-button", "", 1, "submitBtn", 2, "margin-left", "calc(50% - 50px)", 3, "click"], [1, "element_holder"], ["style", "height: 45px;", 3, "ngClass", 4, "ngIf"], [2, "height", "45px", 3, "ngClass"], ["type", "checkbox", "name", "valueSelection", "value", "range", 1, "radioBtn", 3, "change", "checked"], [1, "thingDiv", 2, "display", "inline-block", "margin-left", "9px"], ["mat-button", "", 1, "simulateElementBtn", 3, "click"], [1, "element_holder", 2, "text-align", "center", "color", "#1A3763"]],
      template: function SimulationComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h2", 1);
          core /* ɵɵtext */.EFF(2, "Simulated Elements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "hr");
          core /* ɵɵelementStart */.j41(4, "div", 2)(5, "div", 3)(6, "select", 4);
          core /* ɵɵlistener */.bIt("change", function SimulationComponent_Template_select_change_6_listener($event) {
            return ctx.onchange($event);
          });
          core /* ɵɵelementStart */.j41(7, "option", 5);
          core /* ɵɵtext */.EFF(8, "All Elements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "option", 6);
          core /* ɵɵtext */.EFF(10, "Processes Only");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "option", 7);
          core /* ɵɵtext */.EFF(12, "Objects Only");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(13, "div", 8)(14, "input", 9);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationComponent_Template_input_ngModelChange_14_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchString, $event)) {
              ctx.searchString = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("keyup", function SimulationComponent_Template_input_keyup_14_listener() {
            return ctx.search();
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(15, "br");
          core /* ɵɵelementStart */.j41(16, "input", 10);
          core /* ɵɵlistener */.bIt("change", function SimulationComponent_Template_input_change_16_listener($event) {
            return ctx.checkOrUncheckAll($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "div", 11);
          core /* ɵɵtext */.EFF(18, "Select All");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(19, "hr");
          core /* ɵɵelementStart */.j41(20, "div", 12);
          core /* ɵɵtemplate */.DNE(21, SimulationComponent_div_21_Template, 2, 1, "div", 13)(22, SimulationComponent_div_22_Template, 3, 0, "div", 14);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(23, "br");
          core /* ɵɵelementStart */.j41(24, "div")(25, "button", 15);
          core /* ɵɵlistener */.bIt("click", function SimulationComponent_Template_button_click_25_listener() {
            return ctx.close();
          });
          core /* ɵɵtext */.EFF(26, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(14);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchString);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.list);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length === 0);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:18px;font-weight:500}hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.35);border-radius:4px;width:120px;height:20px;display:inline-block}.searchDiv[_ngcontent-%COMP%]{display:inline-block;margin-left:84px}select[_ngcontent-%COMP%]{background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;margin-left:5px;width:92%;outline:none}.radioBtn[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;Opacity:70%}.simulateElementBtn[_ngcontent-%COMP%]{color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;margin-right:15px;float:right;margin-top:-11px;letter-spacing:normal}.inputText[_ngcontent-%COMP%]{height:19px;border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.inputText[_ngcontent-%COMP%]::placeholder{color:#1a3763;Opacity:70%}.option[_ngcontent-%COMP%]{outline:none}.submitBtn[_ngcontent-%COMP%]{position:relative;width:100px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;letter-spacing:normal}.element_holder[_ngcontent-%COMP%]   .list-item[_ngcontent-%COMP%]{min-height:27px;padding-left:4px;display:inline-block;font-weight:400;background:#eff2f499;border-radius:6px;margin-top:3px}.element_holder[_ngcontent-%COMP%]{width:100%}#all_elements_holder[_ngcontent-%COMP%]{height:440px;width:100%;overflow:overlay;padding-top:11px}.element_holder[_ngcontent-%COMP%]   .object[_ngcontent-%COMP%]{color:#00b050}.element_holder[_ngcontent-%COMP%]   .process[_ngcontent-%COMP%]{color:#0070c0}[class=\"btn simulate\"][_ngcontent-%COMP%]{position:sticky;left:226px;margin-top:5px;width:100px;height:42px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff}"]
    }))();
  }
  return SimulationComponent;
})();
