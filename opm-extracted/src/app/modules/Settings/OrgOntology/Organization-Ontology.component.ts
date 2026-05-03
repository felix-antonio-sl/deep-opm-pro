// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/OrgOntology/Organization-Ontology.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 13)(2, "div", 14)(3, "input", 15);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function div_16_Template_input_ngModelChange_3_listener($event) {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      if (!core /* ɵɵtwoWayBindingSet */.DH7(item_r2.value.phrases, $event)) {
        item_r2.value.phrases = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "div", 14)(5, "input", 16);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function div_16_Template_input_ngModelChange_5_listener($event) {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      if (!core /* ɵɵtwoWayBindingSet */.DH7(item_r2.value.synonyms, $event)) {
        item_r2.value.synonyms = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "button", 9);
    core /* ɵɵlistener */.bIt("click", function div_16_Template_button_click_6_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.makeItemEditable(item_r2));
    });
    core /* ɵɵtext */.EFF(7, "Edit");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "button", 9);
    core /* ɵɵlistener */.bIt("click", function div_16_Template_button_click_8_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.removeItem(item_r2));
    });
    core /* ɵɵtext */.EFF(9, "Delete");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", item_r2.value.phrases);
    core /* ɵɵproperty */.Y8G("disabled", !item_r2.isEditable);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", item_r2.value.synonyms);
    core /* ɵɵproperty */.Y8G("disabled", !item_r2.isEditable);
  }
}
let OrganizationOntologyComponent = /*#__PURE__*/(() => {
  class OrganizationOntologyComponent {
    constructor(orgService, oplService) {
      this.orgService = orgService;
      this.oplService = oplService;
      this.filterText = "";
    }
    ngOnInit() {
      this.data = this.oplService.orgOplSettings.ontology;
      this.fullDisplayData = this.convertDataToDisplayData(this.data);
      if (this.fullDisplayData.length === 0) {
        this.addNewEntry();
      }
      this.resetFilterText();
    }
    resetFilterText() {
      this.filterText = "";
      this.dataToDisplay = this.fullDisplayData;
    }
    convertDataToDisplayData(data) {
      return data.map(item => {
        const value = {
          phrases: item.phrases.join("; "),
          synonyms: item.synonyms.join("; ")
        };
        return {
          value: value,
          isEditable: false
        };
      });
    }
    convertDisplayDataToData(displayData) {
      const ret = displayData.map(item => {
        return {
          phrases: item.value.phrases.split(";").map(ph => ph.trim()),
          synonyms: item.value.synonyms.split(";").map(sy => sy.trim())
        };
      });
      const errors = [];
      if (ret.find(item => item.phrases.includes("") || item.synonyms.includes(""))) {
        errors.push("Empty phrases are not allowed.");
      } else if (ret.find(item => item.phrases.find(ph => ph.length < 2) || item.synonyms.find(sy => sy.length < 2))) {
        errors.push("Phrase or a synonym must contain at least 2 characters.");
      }
      if (errors.length > 0) {
        return {
          success: false,
          errors: errors
        };
      }
      return {
        success: true,
        ontology: ret
      };
    }
    addNewEntry() {
      this.fullDisplayData.push({
        value: {
          phrases: "",
          synonyms: ""
        },
        isEditable: true
      });
      this.resetFilterText();
    }
    save() {
      const ret = this.convertDisplayDataToData(this.fullDisplayData);
      if (ret.success) {
        this.oplService.orgOplSettings.ontology = ret.ontology;
        this.orgService.updateOrganizationOntology(ret.ontology).then(() => (0, validationAlert)("Saved Successfully")).catch(err => (0, validationAlert)("An Error has occured.", 5000, "Error"));
      } else {
        (0, validationAlert)("Cannot update the ontology.\n" + ret.errors.join("\n"), 8000, "Error");
      }
    }
    removeItem(item) {
      this.fullDisplayData.splice(this.fullDisplayData.indexOf(item), 1);
    }
    makeItemEditable(item) {
      item.isEditable = true;
    }
    filterTextClick() {
      this.filterText = this.filterText.trim();
      this.dataToDisplay = this.fullDisplayData.filter(item => item.value.phrases.includes(this.filterText) || item.value.synonyms.includes(this.filterText));
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OrganizationOntologyComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(OplService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OrganizationOntologyComponent,
      selectors: [["Organization-Ontology"]],
      decls: 22,
      vars: 3,
      consts: [["id", "whole"], [1, "header"], [1, "h2"], ["id", "mainPart"], [1, "table"], [1, "filter"], ["id", "filterIcon", 3, "ngClass"], [1, "fontColor"], ["id", "filterInput", "matInput", "", 3, "ngModelChange", "ngModel"], ["mat-button", "", 1, "fontColor", 3, "click"], [4, "ngFor", "ngForOf"], ["id", "actions"], ["mat-button", "", 1, "saveBtn", 3, "click"], [1, "row"], [1, "cell"], ["matInput", "", "matTooltip", "Organizational Words (separated with ;)", 3, "ngModelChange", "ngModel", "disabled"], ["matInput", "", "matTooltip", "Synonyms (separated with ;)", 3, "ngModelChange", "ngModel", "disabled"]],
      template: function Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "Organization Ontology Administration");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "mat-icon", 6);
          core /* ɵɵtext */.EFF(8, "filter_list");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "span", 7);
          core /* ɵɵtext */.EFF(10, "Filter: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "input", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function Template_input_ngModelChange_11_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.filterText, $event)) {
              ctx.filterText = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "button", 9);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_12_listener() {
            return ctx.filterTextClick();
          });
          core /* ɵɵtext */.EFF(13, "Apply");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "button", 9);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_14_listener() {
            return ctx.resetFilterText();
          });
          core /* ɵɵtext */.EFF(15, "Reset");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(16, div_16_Template, 10, 4, "div", 10);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "div", 11)(18, "button", 12);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_18_listener() {
            return ctx.addNewEntry();
          });
          core /* ɵɵtext */.EFF(19, "Add New Entry");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "button", 12);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_20_listener() {
            return ctx.save();
          });
          core /* ɵɵtext */.EFF(21, "Save");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngClass", ctx.dataToDisplay.length !== ctx.fullDisplayData.length ? "iconVisible" : "iconHalfVisible");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.filterText);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.dataToDisplay);
        }
      },
      dependencies: [NgClass, NgForOf, MatInput, MatTooltip, MatIcon, MatButton, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".header[_ngcontent-%COMP%]{color:#1a3763;text-align:center}.row[_ngcontent-%COMP%]{display:inline-flex}#mainPart[_ngcontent-%COMP%]{display:grid;padding:10px;border:dashed 1px #1A3763}.subRow[_ngcontent-%COMP%]{margin-left:188px}.table[_ngcontent-%COMP%]{display:grid;justify-content:center}.cell[_ngcontent-%COMP%]{padding:7px}.cellWithBorder[_ngcontent-%COMP%]{border:solid 1px #1A3763}.cellWithRightBorder[_ngcontent-%COMP%]{border-right:solid 3px #1A3763}input[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;margin-inline:10px;margin-left:15px;width:300px;height:20px}select[_ngcontent-%COMP%]:disabled{background-color:#f8f8f8}#whole[_ngcontent-%COMP%]{display:grid;justify-content:center}.filter[_ngcontent-%COMP%]{display:inline-flex;height:65px;justify-content:center;flex-direction:row;align-items:center}#filterIcon[_ngcontent-%COMP%]{position:relative;color:#1a3763;left:82px;z-index:100}.iconVisible[_ngcontent-%COMP%]{opacity:1}.iconHalfVisible[_ngcontent-%COMP%]{opacity:.5}#filterInput[_ngcontent-%COMP%]{text-indent:30px}.fontColor[_ngcontent-%COMP%]{color:#1a3763!important;font-family:Roboto,Arial,Helvetica,sans-serif!important;font-weight:400!important;letter-spacing:normal!important}.saveBtn[_ngcontent-%COMP%]{width:150px;height:50px;margin:auto;color:#1a3763!important;font-family:Roboto,Arial,Helvetica,sans-serif!important;font-weight:400!important;letter-spacing:normal!important}#actions[_ngcontent-%COMP%]{margin:auto}"]
    }))();
  }
  return OrganizationOntologyComponent;
})();