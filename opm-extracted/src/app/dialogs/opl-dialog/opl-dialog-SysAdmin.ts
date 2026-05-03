// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts
// Extracted by opm-extracted/tools/extract.mjs

function OplDialogComponentSysAdmin_mat_option_10_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 13);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const lan_r1 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("value", lan_r1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r1.displayLanguages(lan_r1), " ");
  }
}
function OplDialogComponentSysAdmin_table_26_tr_6_span_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 24);
    core /* ɵɵlistener */.bIt("click", function OplDialogComponentSysAdmin_table_26_tr_6_span_4_Template_span_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const link_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const relation_r5 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.edit[relation_r5.key][link_r4.key] = true);
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const link_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", link_r4.value, " ");
  }
}
function OplDialogComponentSysAdmin_table_26_tr_6_input_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 25);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponentSysAdmin_table_26_tr_6_input_5_Template_input_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const link_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const relation_r5 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.oplTable[relation_r5.key][link_r4.key], $event)) {
        ctx_r1.oplTable[relation_r5.key][link_r4.key] = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const link_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    const relation_r5 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("value", ctx_r1.oplTable[relation_r5.key][link_r4.key]);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.oplTable[relation_r5.key][link_r4.key]);
  }
}
function OplDialogComponentSysAdmin_table_26_tr_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr", 16)(1, "td", 20);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td", 21);
    core /* ɵɵtemplate */.DNE(4, OplDialogComponentSysAdmin_table_26_tr_6_span_4_Template, 2, 1, "span", 22)(5, OplDialogComponentSysAdmin_table_26_tr_6_input_5_Template, 1, 2, "input", 23);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const link_r4 = ctx.$implicit;
    const relation_r5 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(link_r4.key);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.edit[relation_r5.key][link_r4.key]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.edit[relation_r5.key][link_r4.key]);
  }
}
function OplDialogComponentSysAdmin_table_26_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "table", 14)(1, "thead", 15)(2, "tr", 16)(3, "th", 17);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(5, "tbody", 18);
    core /* ɵɵtemplate */.DNE(6, OplDialogComponentSysAdmin_table_26_tr_6_Template, 6, 3, "tr", 19);
    core /* ɵɵpipe */.nI1(7, "keys");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const relation_r5 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(relation_r5.key);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(7, 2, relation_r5.value));
  }
}
let OplDialogComponentSysAdmin = /*#__PURE__*/(() => {
  class OplDialogComponentSysAdmin {
    constructor(oplService, user, orgS) {
      this.oplService = oplService;
      this.user = user;
      this.orgS = orgS;
      this.edit = {};
      this.language = oplService.orgOplSettings.language;
      this.oplTable = oplService.orgOplSettings.oplTables[this.language];
      this.availableLanguage = oplService.getAvailableLanguages();
    }
    ngOnInit() {
      this.updateTable(this.language);
      this.initiateEdit();
    }
    toDisplay(str) {
      return str[0].toUpperCase() + str.slice(1);
    }
    displayLanguages(str) {
      switch (str) {
        case "en":
          return "English";
        case "cn":
          return "Chinese";
        case "fr":
          return "French";
        case "gr":
          return "German";
        case "ko":
          return "Korean";
        case "jp":
          return "Japanese";
        case "es":
          return "Spanish";
        case "ml":
          return "Malayalam";
        case "ru":
          return "Russian";
        case "pt":
          return "Portuguese";
        default:
          return this.toDisplay(str);
        // should not get here unless new languages were added
      }
    }
    updateTable(lan) {
      this.oplTable = this.oplService.getOplTable(lan);
    }
    cancelTableChange() {
      this.oplTable = OplTables[this.language];
    }
    ReturnToDefault() {
      this.oplTable = this.oplService.getOplTable(this.language);
    }
    initiateEdit() {
      for (const relation of Object.keys(this.oplTable)) {
        this.edit[relation] = {};
        for (const link of Object.keys(this.oplTable[relation])) {
          this.edit[relation][link] = false;
        }
      }
    }
    addLanguage(lan) {
      if (lan === undefined) {
        (0, validationAlert)("Language most have name.", 2500, "error");
        return;
      }
      if (this.availableLanguage.indexOf(lan) === -1) {
        this.oplService.orgOplSettings.oplTables[lan] = this.oplTable;
        const settings = this.oplService.orgOplSettings;
        const details = {};
        Object.keys(settings).forEach(key => {
          if (settings[key] === undefined) {
            return;
          }
          if (key === "oplTables") {
            details[key] = {};
            for (let lan of Object.keys(settings[key])) {
              if (Languages.indexOf(lan) > -1) {
                continue;
              }
              details[key][lan] = settings[key][lan];
            }
          }
          if (key === "essence") {
            details[key] = String(settings[key]);
            return;
          }
          details[key] = settings[key];
        });
        this.oplService.updateDefaultSettings();
        this.orgS.updateOrganization(this.user.user.userData.organization, details);
        (0, validationAlert)(`New language ${lan} is added!`);
      } else {
        (0, validationAlert)("The language already exists!");
      }
      this.availableLanguage = this.oplService.getAvailableLanguages();
      this.newLanguage = "";
    }
    exportTable() {
      const table = JSON.stringify(this.oplTable, null, " ");
      FileSaver_min.saveAs(new Blob([table], {
        type: "text/plain;charset=utf-8"
      }), "OPL_table_" + this.language + ".txt");
    }
    static #_ = (() => this.ɵfac = function OplDialogComponentSysAdmin_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OplDialogComponentSysAdmin)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(OrganizationService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OplDialogComponentSysAdmin,
      selectors: [["opcloud-opl-dialog"]],
      decls: 28,
      vars: 6,
      consts: [["id", "mainContainer"], [1, "container"], ["id", "OPLTableHeader"], ["id", "mainContent"], [2, "margin-right", "20px"], ["name", "selectLan", 1, "mat-select-class-opl", 3, "ngModelChange", "click", "ngModel"], ["class", "optionText", 3, "value", 4, "ngFor", "ngForOf"], ["type", "text", "name", "newLanguage", "matTooltip", "Insert Language Name", "value", "new language code", 1, "addNewLangInput", 3, "ngModelChange", "ngModel"], ["id", "rtnDfltBTNlang1", 3, "click"], ["id", "rtnDfltBTNlang2", 3, "click"], ["id", "rtnDfltBTNlang3", 3, "click"], [1, "tableContainer"], ["class", "addOPLtbl", 4, "ngFor", "ngForOf"], [1, "optionText", 3, "value"], [1, "addOPLtbl"], [1, "addOPLtblhead"], [1, "addOPLtbltr"], ["colspan", "2", 1, "addOPLtblth"], [1, "addOPLtbltb"], ["class", "addOPLtbltr", 4, "ngFor", "ngForOf"], [1, "tdKey"], [1, "addOPLtbltd"], ["class", "tdValue", 3, "click", 4, "ngIf"], [3, "value", "ngModel", "ngModelChange", 4, "ngIf"], [1, "tdValue", 3, "click"], [3, "ngModelChange", "value", "ngModel"]],
      template: function OplDialogComponentSysAdmin_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "div", 2);
          core /* ɵɵtext */.EFF(3, "OPL Table");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(4, "br")(5, "br");
          core /* ɵɵelementStart */.j41(6, "div", 3)(7, "label", 4);
          core /* ɵɵtext */.EFF(8, "Language");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "mat-select", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponentSysAdmin_Template_mat_select_ngModelChange_9_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.language, $event)) {
              ctx.language = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("click", function OplDialogComponentSysAdmin_Template_mat_select_click_9_listener() {
            return ctx.updateTable(ctx.language);
          });
          core /* ɵɵtemplate */.DNE(10, OplDialogComponentSysAdmin_mat_option_10_Template, 2, 2, "mat-option", 6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(11, "br")(12, "br");
          core /* ɵɵelementStart */.j41(13, "label");
          core /* ɵɵtext */.EFF(14, "Add new language");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(15, "input", 7);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponentSysAdmin_Template_input_ngModelChange_15_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.newLanguage, $event)) {
              ctx.newLanguage = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "button", 8);
          core /* ɵɵlistener */.bIt("click", function OplDialogComponentSysAdmin_Template_button_click_16_listener() {
            return ctx.addLanguage(ctx.newLanguage);
          });
          core /* ɵɵtext */.EFF(17, "Add Language");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(18, "br");
          core /* ɵɵelementStart */.j41(19, "button", 9);
          core /* ɵɵlistener */.bIt("click", function OplDialogComponentSysAdmin_Template_button_click_19_listener() {
            return ctx.ReturnToDefault();
          });
          core /* ɵɵtext */.EFF(20, "Reset to Default");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "button", 10);
          core /* ɵɵlistener */.bIt("click", function OplDialogComponentSysAdmin_Template_button_click_21_listener() {
            return ctx.exportTable();
          });
          core /* ɵɵtext */.EFF(22, "Export Table");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(23, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "div", 11)(25, "mat-dialog-content");
          core /* ɵɵtemplate */.DNE(26, OplDialogComponentSysAdmin_table_26_Template, 8, 4, "table", 12);
          core /* ɵɵpipe */.nI1(27, "keys");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.language);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.availableLanguage);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.newLanguage);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(27, 4, ctx.oplTable));
        }
      },
      dependencies: [NgForOf, NgIf, MatDialogContent, MatTooltip, MatSelect, MatOption, DefaultValueAccessor, NgControlStatus, NgModel, KeysPipe],
      styles: [".h2[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:16px;color:#1a3763;margin:25px}#OPLTableHeader[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif!important;font-style:normal!important;font-weight:500!important;line-height:normal!important;font-size:20px!important;color:#1a3763!important}label[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#1a3763}.orgOPLButtons[_ngcontent-%COMP%]{align-items:center}.orgOPLButtons[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(#saveBTN, #rtnDfltBTN)[_ngcontent-%COMP%]{position:relative;left:240px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;margin-right:20px}#displayOptionsLabel[_ngcontent-%COMP%], #displayOptionsLabelUnits[_ngcontent-%COMP%], #displayOptionsLabelAlias[_ngcontent-%COMP%]{position:relative;top:36px}.optionText[_ngcontent-%COMP%]{position:relative!important;left:20px!important}.addNewLangInput[_ngcontent-%COMP%]{position:relative;margin-left:20px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#rtnDfltBTNlang1[_ngcontent-%COMP%]{text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;margin-left:20px}#rtnDfltBTNlang2[_ngcontent-%COMP%], #rtnDfltBTNlang3[_ngcontent-%COMP%]{position:relative;left:140px;top:20px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;margin-right:20px}.addOPLtbl[_ngcontent-%COMP%]{border-collapse:collapse}.addOPLtbl[_ngcontent-%COMP%], .addOPLtblth[_ngcontent-%COMP%], .addOPLtbltb[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.77);border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;color:#3b3b3b}.addOPLtblth[_ngcontent-%COMP%]{font-size:16px;color:#3b3b3b;opacity:.77}.addOPLtbltb[_ngcontent-%COMP%]{font-size:14px;color:#3b3b3b}.container[_ngcontent-%COMP%]{position:relative;left:50px;top:50px}.tableContainer[_ngcontent-%COMP%]{position:relative;left:30px;top:40px;width:806px;height:444px}.addOPLtbl[_ngcontent-%COMP%]{width:806px;height:344px}.addOPLtbltd[_ngcontent-%COMP%]{line-height:30px;width:403px}.addOPLtbltr[_ngcontent-%COMP%]:nth-child(2n){background:#fff}.addOPLtbltr[_ngcontent-%COMP%]:nth-child(odd){background:#e4e8ec6e}#btns[_ngcontent-%COMP%]{position:relative;left:125px}"]
    }))();
  }
  return OplDialogComponentSysAdmin;
})();
let opl_dialog_SysAdmin_KeysPipe = /*#__PURE__*/ /* unused pure expression or super */null && (() => {
  class KeysPipe {
    transform(value, args) {
      const keys = [];
      let key;
      for (key in value) {
        keys.push({
          key: key,
          value: value[key]
        });
      }
      return keys;
    }
    static #_ = (() => this.ɵfac = function KeysPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || KeysPipe)();
    })();
    static #_2 = (() => this.ɵpipe = /*@__PURE__*/i0.ɵɵdefinePipe({
      name: "keys",
      type: KeysPipe,
      pure: true
    }))();
  }
  return KeysPipe;
})();