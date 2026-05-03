// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/OplSettings/opl-settings.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function OplSettingsComponent_mat_option_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 6);
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
function OplSettingsComponent_mat_option_33_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 17);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const opt_r3 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", opt_r3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(opt_r3);
  }
}
function OplSettingsComponent_mat_option_42_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 17);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const opt_r4 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", opt_r4);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(opt_r4);
  }
}
function OplSettingsComponent_mat_option_51_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 17);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const opt_r5 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", opt_r5);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(opt_r5);
  }
}
let OplSettingsComponent = /*#__PURE__*/(() => {
  class OplSettingsComponent {
    constructor(oplService, user) {
      this.oplService = oplService;
      this.user = user;
      this.edit = {};
      this.displayOpts = DisplayOpt;
      this.unitsOpts = UnitsOpt;
      this.aliasOpts = AliasOpt;
      this.EssenceTypes = Essence;
      this.oplTable = oplDefaultSettings.oplTables[oplDefaultSettings.language];
    }
    ngOnInit() {
      this.availableLanguage = this.oplService.getAvailableLanguages();
      this.settings = {
        language: this.oplService.settings.language,
        displayOpt: this.oplService.settings.displayOpt,
        unitsOpt: this.oplService.settings.unitsOpt,
        aliasOpt: this.oplService.settings.aliasOpt,
        essence: this.oplService.settings.essence,
        oplNumbering: this.oplService.settings.oplNumbering,
        autoFormat: this.oplService.settings.autoFormat,
        highlightOpl: this.oplService.settings.highlightOpl,
        highlightOpd: this.oplService.settings.highlightOpd,
        syncOplcolorsFromOpd: this.oplService.settings.syncOplcolorsFromOpd,
        opdTreeProcessesAutoArrangement: this.oplService.settings.opdTreeProcessesAutoArrangement
      };
    }
    updateSettingsAndUserOplSettings(settings) {
      this.oplService.updateUserSettings(settings);
      this.user.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    ReturnToDefault() {
      this.settings.language = defaultSettings.user.language;
      this.settings.displayOpt = defaultSettings.user.displayOpt;
      // this.settings.unitsOpt = defaultSettings.user.unitsOpt;
      this.settings.unitsOpt = this.oplService.orgOplSettings.unitsOpt;
      this.settings.aliasOpt = this.oplService.orgOplSettings.aliasOpt;
      // this.settings.aliasOpt = defaultSettings.user.aliasOpt;
      this.settings.essence = defaultSettings.user.essence;
      this.settings.syncOplcolorsFromOpd = defaultSettings.user.syncOplcolorsFromOpd;
      this.oplTable = defaultSettings.organization.oplTables[this.settings.language];
      this.settings.opdTreeProcessesAutoArrangement = defaultSettings.organization.opdTreeProcessesAutoArrangement;
      this.updateSettingsAndUserOplSettings(this.settings);
    }
    updateLanguage() {
      const lan = this.settings.language;
      this.oplTable = this.oplService.getOplTable(lan);
      const settings_update = {
        language: lan,
        essence: this.oplService.settings.essence
      };
      this.updateSettingsAndUserOplSettings(settings_update);
    }
    updateDisplayOpt() {
      const settings = {
        displayOpt: this.settings.displayOpt
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateUnitsOpt() {
      const settings = {
        unitsOpt: this.settings.unitsOpt
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateAliasOpt() {
      const settings = {
        aliasOpt: this.settings.aliasOpt
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateEssence() {
      const settings = {
        essence: this.settings.essence
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateOPLNumbering() {
      const settings = {
        oplNumbering: this.settings.oplNumbering
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateAutoFormat() {
      const settings = {
        autoFormat: this.settings.autoFormat
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateHighLightOpl() {
      const settings = {
        highlightOpl: this.settings.highlightOpl
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateHighLightOpd() {
      const settings = {
        highlightOpd: this.settings.highlightOpd
      };
      this.updateSettingsAndUserOplSettings(settings);
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
    updateSyncOplcolorsFromOpd() {
      const settings = {
        syncOplcolorsFromOpd: this.settings.syncOplcolorsFromOpd
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    updateOpdTreeProcessesArrangment() {
      const settings = {
        opdTreeProcessesAutoArrangement: this.settings.opdTreeProcessesAutoArrangement
      };
      this.updateSettingsAndUserOplSettings(settings);
    }
    static #_ = (() => this.ɵfac = function OplSettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OplSettingsComponent)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OplSettingsComponent,
      selectors: [["opcloud-opl-settings"]],
      decls: 130,
      vars: 31,
      consts: [[1, "container"], [2, "width", "100%"], [2, "width", "305px"], ["name", "selectLan", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["class", "optionText", 3, "value", 4, "ngFor", "ngForOf"], ["name", "selectEssence", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], [1, "optionText", 3, "value"], ["name", "display", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["name", "displayU", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["name", "displayA", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["name", "selectOPLNumbering", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["name", "selectAutoFormat", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["name", "display1", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["name", "display2", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "toggleOpdTreeProcessesArrangment"], [1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value"], ["mat-raised-button", "", "id", "rtnDfltBTN", 3, "click"]],
      template: function OplSettingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h2");
          core /* ɵɵtext */.EFF(2, "Language & OPL Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "div")(5, "table", 1)(6, "tr")(7, "td", 2)(8, "label");
          core /* ɵɵtext */.EFF(9, "Language");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(10, "td")(11, "mat-select", 3);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_11_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.language, $event)) {
              ctx.settings.language = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_11_listener() {
            return ctx.updateLanguage();
          });
          core /* ɵɵtemplate */.DNE(12, OplSettingsComponent_mat_option_12_Template, 2, 2, "mat-option", 4);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(13, "br")(14, "br");
          core /* ɵɵelementStart */.j41(15, "tr")(16, "td", 2)(17, "label");
          core /* ɵɵtext */.EFF(18, "Things Default Essence");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(19, "td")(20, "mat-select", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_20_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.essence, $event)) {
              ctx.settings.essence = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_20_listener() {
            return ctx.updateEssence();
          });
          core /* ɵɵelementStart */.j41(21, "mat-option", 6);
          core /* ɵɵtext */.EFF(22);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "mat-option", 6);
          core /* ɵɵtext */.EFF(24);
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(25, "br")(26, "br");
          core /* ɵɵelementStart */.j41(27, "tr")(28, "td", 2)(29, "label");
          core /* ɵɵtext */.EFF(30, "OPL Essence Sentences");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(31, "td")(32, "mat-select", 7);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_32_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.displayOpt, $event)) {
              ctx.settings.displayOpt = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_32_listener() {
            return ctx.updateDisplayOpt();
          });
          core /* ɵɵtemplate */.DNE(33, OplSettingsComponent_mat_option_33_Template, 2, 2, "mat-option", 8);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(34, "br")(35, "br");
          core /* ɵɵelementStart */.j41(36, "tr")(37, "td", 2)(38, "label");
          core /* ɵɵtext */.EFF(39, "Units Display Options");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(40, "td")(41, "mat-select", 9);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_41_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.unitsOpt, $event)) {
              ctx.settings.unitsOpt = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_41_listener() {
            return ctx.updateUnitsOpt();
          });
          core /* ɵɵtemplate */.DNE(42, OplSettingsComponent_mat_option_42_Template, 2, 2, "mat-option", 8);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(43, "br")(44, "br");
          core /* ɵɵelementStart */.j41(45, "tr")(46, "td", 2)(47, "label");
          core /* ɵɵtext */.EFF(48, "Alias OPL Display Options");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(49, "td")(50, "mat-select", 10);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_50_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.aliasOpt, $event)) {
              ctx.settings.aliasOpt = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_50_listener() {
            return ctx.updateAliasOpt();
          });
          core /* ɵɵtemplate */.DNE(51, OplSettingsComponent_mat_option_51_Template, 2, 2, "mat-option", 8);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(52, "br")(53, "br");
          core /* ɵɵelementStart */.j41(54, "tr")(55, "td", 2)(56, "label");
          core /* ɵɵtext */.EFF(57, "OPL Numbering");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(58, "td")(59, "mat-select", 11);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_59_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.oplNumbering, $event)) {
              ctx.settings.oplNumbering = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_59_listener() {
            return ctx.updateOPLNumbering();
          });
          core /* ɵɵelementStart */.j41(60, "mat-option", 6);
          core /* ɵɵtext */.EFF(61, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(62, "mat-option", 6);
          core /* ɵɵtext */.EFF(63, "False");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(64, "br")(65, "br");
          core /* ɵɵelementStart */.j41(66, "tr")(67, "td", 2)(68, "label");
          core /* ɵɵtext */.EFF(69, "Auto Format");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(70, "td")(71, "mat-select", 12);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_71_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.autoFormat, $event)) {
              ctx.settings.autoFormat = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_71_listener() {
            return ctx.updateAutoFormat();
          });
          core /* ɵɵelementStart */.j41(72, "mat-option", 6);
          core /* ɵɵtext */.EFF(73, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(74, "mat-option", 6);
          core /* ɵɵtext */.EFF(75, "False");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(76, "br")(77, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(78, "br")(79, "br");
          core /* ɵɵelementStart */.j41(80, "tr")(81, "td", 2)(82, "label");
          core /* ɵɵtext */.EFF(83, "Highlight OPL when Hovering on OPD");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(84, "td")(85, "mat-select", 13);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_85_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.highlightOpl, $event)) {
              ctx.settings.highlightOpl = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_85_listener() {
            return ctx.updateHighLightOpl();
          });
          core /* ɵɵelementStart */.j41(86, "mat-option", 6);
          core /* ɵɵtext */.EFF(87, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(88, "mat-option", 6);
          core /* ɵɵtext */.EFF(89, "False");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(90, "br")(91, "br");
          core /* ɵɵelementStart */.j41(92, "tr")(93, "td", 2)(94, "label");
          core /* ɵɵtext */.EFF(95, "Highlight OPD when Hovering on OPL");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(96, "td")(97, "mat-select", 14);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_97_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.highlightOpd, $event)) {
              ctx.settings.highlightOpd = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_97_listener() {
            return ctx.updateHighLightOpd();
          });
          core /* ɵɵelementStart */.j41(98, "mat-option", 6);
          core /* ɵɵtext */.EFF(99, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(100, "mat-option", 6);
          core /* ɵɵtext */.EFF(101, "False");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(102, "br")(103, "br");
          core /* ɵɵelementStart */.j41(104, "tr")(105, "td", 2)(106, "label");
          core /* ɵɵtext */.EFF(107, "Sync Things Colors of OPL and OPD");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(108, "td")(109, "mat-select", 14);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_109_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.syncOplcolorsFromOpd, $event)) {
              ctx.settings.syncOplcolorsFromOpd = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_109_listener() {
            return ctx.updateSyncOplcolorsFromOpd();
          });
          core /* ɵɵelementStart */.j41(110, "mat-option", 6);
          core /* ɵɵtext */.EFF(111, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(112, "mat-option", 6);
          core /* ɵɵtext */.EFF(113, "False");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(114, "br");
          core /* ɵɵelementStart */.j41(115, "tr")(116, "td", 2)(117, "label", 15);
          core /* ɵɵtext */.EFF(118, "OPD Tree Processes Arrangement");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(119, "td")(120, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplSettingsComponent_Template_mat_select_ngModelChange_120_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.settings.opdTreeProcessesAutoArrangement, $event)) {
              ctx.settings.opdTreeProcessesAutoArrangement = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplSettingsComponent_Template_mat_select_selectionChange_120_listener() {
            return ctx.updateOpdTreeProcessesArrangment();
          });
          core /* ɵɵelementStart */.j41(121, "mat-option", 17);
          core /* ɵɵtext */.EFF(122, "Automatic");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(123, "mat-option", 17);
          core /* ɵɵtext */.EFF(124, "Manually");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(125, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(126, "br")(127, "br");
          core /* ɵɵelementStart */.j41(128, "button", 18);
          core /* ɵɵlistener */.bIt("click", function OplSettingsComponent_Template_button_click_128_listener() {
            return ctx.ReturnToDefault();
          });
          core /* ɵɵtext */.EFF(129, "Reset to Default");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.language);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.availableLanguage);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.essence);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", ctx.EssenceTypes.Physical);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.toDisplay(ctx.oplTable.essence.physical));
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", ctx.EssenceTypes.Informatical);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.toDisplay(ctx.oplTable.essence.informatical));
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.displayOpt);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.displayOpts);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.unitsOpt);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.unitsOpts);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.aliasOpt);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.aliasOpts);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.oplNumbering);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.autoFormat);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.highlightOpl);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.highlightOpd);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.syncOplcolorsFromOpd);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.settings.opdTreeProcessesAutoArrangement);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
        }
      },
      dependencies: [NgForOf, MatSelect, MatOption, MatButton, NgControlStatus, NgModel],
      styles: [".container[_ngcontent-%COMP%]{position:relative;padding-left:50px;top:50px}h2[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;margin-bottom:46px;color:#1a3763}.h2[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:16px;color:#1a3763}label[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#1a3763}.arrow[_ngcontent-%COMP%]{position:relative;left:445px;z-index:3}select[_ngcontent-%COMP%]::-ms-expand{display:none}#saveBTN[_ngcontent-%COMP%]{position:relative;left:341px;top:75px;width:118px;height:46px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff}#rtnDfltBTN[_ngcontent-%COMP%]{position:relative;left:240px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return OplSettingsComponent;
})();