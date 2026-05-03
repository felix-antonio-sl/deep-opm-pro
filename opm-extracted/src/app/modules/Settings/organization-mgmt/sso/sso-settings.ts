// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/organization-mgmt/sso/sso-settings.ts
// Extracted by opm-extracted/tools/extract.mjs

function SSOSettingsComponent_div_6_option_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 21);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵattribute */.BMQ("selected", ctx_r2.shouldShowOptionFromDb(item_r2) ? "selected" : undefined);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(item_r2.orgName);
  }
}
function SSOSettingsComponent_div_6_option_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 22);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r4 = ctx.$implicit;
    const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("value", org_r4.name);
    core /* ɵɵattribute */.BMQ("selected", item_r2.orgName === org_r4.name ? "selected" : undefined);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r4.name);
  }
}
function SSOSettingsComponent_div_6_div_20_option_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 21);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const sub_r6 = core /* ɵɵnextContext */.XpG().$implicit;
    const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵattribute */.BMQ("selected", ctx_r2.shouldShowOptionFromDb(item_r2) ? "selected" : undefined);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(sub_r6.orgName);
  }
}
function SSOSettingsComponent_div_6_div_20_option_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 22);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r7 = ctx.$implicit;
    const item_r2 = core /* ɵɵnextContext */.XpG(2).$implicit;
    core /* ɵɵproperty */.Y8G("value", org_r7.name);
    core /* ɵɵattribute */.BMQ("selected", item_r2.orgName === org_r7.name ? "selected" : undefined);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r7.name);
  }
}
function SSOSettingsComponent_div_6_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 23)(2, "div", 10)(3, "div", 11)(4, "select", 12);
    core /* ɵɵlistener */.bIt("change", function SSOSettingsComponent_div_6_div_20_Template_select_change_4_listener($event) {
      const sub_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.subDomainOrgSelect($event, sub_r6));
    });
    core /* ɵɵelementStart */.j41(5, "optgroup", 13);
    core /* ɵɵtemplate */.DNE(6, SSOSettingsComponent_div_6_div_20_option_6_Template, 2, 2, "option", 14)(7, SSOSettingsComponent_div_6_div_20_option_7_Template, 2, 3, "option", 15);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(8, "div", 10)(9, "input", 24);
    core /* ɵɵlistener */.bIt("change", function SSOSettingsComponent_div_6_div_20_Template_input_change_9_listener($event) {
      const sub_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.subSuffixChange($event, sub_r6));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "button", 19);
    core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_div_6_div_20_Template_button_click_10_listener() {
      const sub_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.removeSubDomain(item_r2, sub_r6));
    });
    core /* ɵɵtext */.EFF(11, "Delete");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const sub_r6 = ctx.$implicit;
    const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("disabled", !item_r2.editable);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.shouldShowOptionFromDb(item_r2));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.orgs);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", sub_r6.subSuffix)("disabled", !item_r2.editable);
  }
}
function SSOSettingsComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 9)(2, "div", 10)(3, "div", 11)(4, "select", 12);
    core /* ɵɵlistener */.bIt("change", function SSOSettingsComponent_div_6_Template_select_change_4_listener($event) {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.orgSelect($event, item_r2));
    });
    core /* ɵɵelementStart */.j41(5, "optgroup", 13);
    core /* ɵɵtemplate */.DNE(6, SSOSettingsComponent_div_6_option_6_Template, 2, 2, "option", 14)(7, SSOSettingsComponent_div_6_option_7_Template, 2, 3, "option", 15);
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(8, "div", 10)(9, "input", 16);
    core /* ɵɵlistener */.bIt("change", function SSOSettingsComponent_div_6_Template_input_change_9_listener($event) {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.orgIdChange($event, item_r2));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "span", 17)(11, "input", 18);
    core /* ɵɵlistener */.bIt("change", function SSOSettingsComponent_div_6_Template_input_change_11_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      return core /* ɵɵresetView */.Njj(item_r2.viewerAccounts = !item_r2.viewerAccounts);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(12, " View Accounts ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "button", 19);
    core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_div_6_Template_button_click_13_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.makeItemEditable(item_r2));
    });
    core /* ɵɵtext */.EFF(14, "Edit");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "button", 19);
    core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_div_6_Template_button_click_15_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.addSubDomain(item_r2));
    });
    core /* ɵɵtext */.EFF(16, "Add Sub-Domain");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(17, "button", 19);
    core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_div_6_Template_button_click_17_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.removeItem(item_r2));
    });
    core /* ɵɵtext */.EFF(18, "Delete");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(19, "div", 20);
    core /* ɵɵtemplate */.DNE(20, SSOSettingsComponent_div_6_div_20_Template, 12, 5, "div", 5);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("disabled", !item_r2.editable);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.shouldShowOptionFromDb(item_r2));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.orgs);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", item_r2.orgId)("disabled", !item_r2.editable);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("checked", !!item_r2.viewerAccounts)("disabled", !item_r2.editable);
    core /* ɵɵadvance */.R7$(9);
    core /* ɵɵproperty */.Y8G("ngForOf", item_r2.subDomains);
  }
}
function SSOSettingsComponent_div_12_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 26)(1, "div", 27);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 27);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "button", 28);
    core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_div_12_div_3_Template_button_click_5_listener() {
      const item_r9 = core /* ɵɵrestoreView */.eBV(_r8).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.addSupport(item_r9));
    });
    core /* ɵɵtext */.EFF(6, "Add Support");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "button", 19);
    core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_div_12_div_3_Template_button_click_7_listener() {
      const item_r9 = core /* ɵɵrestoreView */.eBV(_r8).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.removeSupportRequset(item_r9));
    });
    core /* ɵɵtext */.EFF(8, "Delete");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", item_r9.orgAddress, " ");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", item_r9.orgId, " ");
  }
}
function SSOSettingsComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 4)(1, "h2", 1);
    core /* ɵɵtext */.EFF(2, "SSO Colaboration Requests:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, SSOSettingsComponent_div_12_div_3_Template, 9, 2, "div", 25);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.requests);
  }
}
let SSOSettingsComponent = /*#__PURE__*/(() => {
  class SSOSettingsComponent {
    constructor(orgService, database) {
      this.orgService = orgService;
      this.database = database;
      this.data = [];
      this.requests = [];
      this.orgs = [];
      this.organizations$ = this.orgService.getAllOrganizations();
    }
    getData() {
      return Promise.all([this.database.driver.getOrganizationsSSOMap(), this.database.driver.getOrganizationsSSORequests()]);
    }
    updateLocalData() {
      this.getData().then(result => {
        this.data = result[0]?.data?.map(item => {
          return {
            ...item,
            editable: false,
            subDomains: item.subDomains || []
          };
        }) || [];
        this.requests = result[1]?.data || [];
      });
    }
    ngOnInit() {
      this.updateLocalData();
      this.organizations$.subscribe(res => this.orgs = res);
    }
    removeItem(item) {
      this.data.splice(this.data.indexOf(item), 1);
    }
    addNewEntry() {
      this.data.push({
        orgName: undefined,
        orgId: "",
        editable: true,
        subDomains: []
      });
    }
    save() {
      // const usedNames = this.data.map(item => item.orgName).filter(n => !!n);
      // const beforeLength = usedNames.length;
      // const afterLength = removeDuplicationsInArray(usedNames).length;
      //
      // if (beforeLength !== afterLength)
      //   return validationAlert('An Organization can be mapped only to one id.');
      const ids = this.data.map(org => org.orgId);
      const uniqueIds = (0, removeDuplicationsInArray)(ids);
      if (ids.length !== uniqueIds.length) {
        return (0, validationAlert)("An id can be mapped only to one Organization.");
      }
      if (this.data.find(item => !item.orgName || !item.orgId || item.orgName.trim() === "" || item.orgId.trim() === "" || item.subDomains.find(sub => !sub.orgName || sub.orgName.trim() === "" || !sub.subSuffix || sub.subSuffix.trim() === ""))) {
        return (0, validationAlert)("Empty fields are not allowed.");
      }
      this.data.forEach(item => delete item.editable);
      this.database.driver.updateOrganizationsSSOMap(this.data).then(res => {
        (0, validationAlert)("Updated Successfully.");
        this.updateLocalData();
      }).catch(err => (0, validationAlert)("Something, somewhere went wrong...."));
    }
    orgSelect($event, item) {
      item.orgName = $event.target.value;
    }
    orgIdChange($event, item) {
      item.orgId = String($event.target.value).trim();
    }
    getUnusedOrgs() {
      return this.orgs.filter(o => !this.data.find(org => org.orgName?.trim() === o.name.trim()));
    }
    shouldShowOptionFromDb(item) {
      return !this.getUnusedOrgs().find(o => o.name === item.orgName);
    }
    addSupport(item) {
      this.data.push({
        orgName: "",
        orgId: item.orgId,
        editable: true,
        subDomains: []
      });
    }
    makeItemEditable(item) {
      item.editable = true;
    }
    removeSupportRequset(item) {
      this.requests.splice(this.requests.indexOf(item), 1);
      this.database.driver.updateSSORequests(this.requests).then(res => {
        (0, validationAlert)("Removed Successfully.");
      }).catch(err => {});
    }
    subDomainOrgSelect($event, sub) {
      sub.orgName = $event.target.value;
    }
    subSuffixChange($event, sub) {
      sub.subSuffix = $event.target.value;
    }
    addSubDomain(item) {
      item.subDomains.push({
        orgName: "",
        subSuffix: ""
      });
      this.makeItemEditable(item);
    }
    removeSubDomain(item, sub) {
      item.subDomains.splice(item.subDomains.indexOf(sub), 1);
    }
    static #_ = (() => this.ɵfac = function SSOSettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SSOSettingsComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(DatabaseService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SSOSettingsComponent,
      selectors: [["sso-settings"]],
      decls: 13,
      vars: 2,
      consts: [["id", "whole"], [1, "header"], [1, "h2"], ["id", "addingDomainsPart"], [1, "table"], [4, "ngFor", "ngForOf"], ["id", "actions"], ["mat-button", "", 1, "saveBtn", 3, "click"], ["class", "table", 4, "ngIf"], [1, "row"], [1, "cell"], [1, "selectWrap"], ["mat-select", "", "matTooltip", "Organization", 3, "change", "disabled"], ["matOptGroup", "", "label", "Select Organization"], ["mat-option", "", 4, "ngIf"], ["mat-option", "", 3, "value", 4, "ngFor", "ngForOf"], ["matTooltip", "Organization Unique ID", 3, "change", "value", "disabled"], ["matTooltip", "Make line editable to check", 1, "viewerSpan", "deleteEntry"], ["type", "checkbox", 3, "change", "checked", "disabled"], ["mat-button", "", 1, "deleteEntry", 3, "click"], [1, "subDomain"], ["mat-option", ""], ["mat-option", "", 3, "value"], [1, "row", "subRow"], ["matTooltip", "The Suffix of the Email. For Example: campus.technion.ac.il", 3, "change", "value", "disabled"], ["class", "row cellWithBorder", 4, "ngFor", "ngForOf"], [1, "row", "cellWithBorder"], [1, "cell", "cellWithRightBorder", "collabRequest"], ["mat-button", "", 1, "deleteEntry", "cellWithRightBorder", 3, "click"]],
      template: function SSOSettingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "SSO Administration");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "div", 4);
          core /* ɵɵtemplate */.DNE(6, SSOSettingsComponent_div_6_Template, 21, 8, "div", 5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div", 6)(8, "button", 7);
          core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_Template_button_click_8_listener() {
            return ctx.addNewEntry();
          });
          core /* ɵɵtext */.EFF(9, "Add New Entry");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "button", 7);
          core /* ɵɵlistener */.bIt("click", function SSOSettingsComponent_Template_button_click_10_listener() {
            return ctx.save();
          });
          core /* ɵɵtext */.EFF(11, "Save");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(12, SSOSettingsComponent_div_12_Template, 4, 1, "div", 8);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.data);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.requests.length > 0);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: [".header[_ngcontent-%COMP%]{color:#1a3763;text-align:center}.row[_ngcontent-%COMP%]{display:inline-flex}#addingDomainsPart[_ngcontent-%COMP%]{display:grid;padding:10px;border:dashed 1px #1A3763}.subRow[_ngcontent-%COMP%]{margin-left:188px}.collabRequest[_ngcontent-%COMP%]{flex-grow:1;text-align:center}.table[_ngcontent-%COMP%]{display:grid;justify-content:center}.cell[_ngcontent-%COMP%]{padding:7px}.cellWithBorder[_ngcontent-%COMP%]{border:solid 1px #1A3763!important}.cellWithRightBorder[_ngcontent-%COMP%]{border-right:solid 3px #1A3763!important}input[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;margin-inline:10px;margin-left:15px;width:300px;height:20px}select[_ngcontent-%COMP%]:disabled{background-color:#f8f8f8}#whole[_ngcontent-%COMP%]{display:grid;justify-content:center}.deleteEntry[_ngcontent-%COMP%]{color:#1a3763!important;font-family:Roboto,Arial,Helvetica,sans-serif!important;font-weight:400!important;letter-spacing:normal!important}.viewerSpan[_ngcontent-%COMP%]{width:145px;white-space:nowrap;display:flex;align-items:center}.saveBtn[_ngcontent-%COMP%]{width:150px!important;height:50px!important;margin:auto!important;color:#1a3763!important;font-family:Roboto,Arial,Helvetica,sans-serif!important;font-weight:400!important;letter-spacing:normal!important}#actions[_ngcontent-%COMP%]{margin:auto}.selectWrap[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.3);border-radius:4px;padding:3px}select[_ngcontent-%COMP%]{display:block;width:150px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}"]
    }))();
  }
  return SSOSettingsComponent;
})();