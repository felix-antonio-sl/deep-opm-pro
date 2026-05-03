// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opl-dialog/opl-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const opl_dialog_component_c0 = a0 => [a0];
function OplDialogComponent_mat_option_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 21);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r1 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", core /* ɵɵpureFunction1 */.eq3(2, opl_dialog_component_c0, org_r1.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r1.name);
  }
}
function OplDialogComponent_mat_option_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 13);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const lan_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("value", lan_r2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r2.displayLanguages(lan_r2), " ");
  }
}
function OplDialogComponent_mat_option_41_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 21);
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
function OplDialogComponent_mat_option_50_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 21);
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
function OplDialogComponent_mat_option_59_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 21);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const opt_r6 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", opt_r6);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(opt_r6);
  }
}
let OplDialogComponent = /*#__PURE__*/(() => {
  class OplDialogComponent {
    constructor(oplService, user, orgS) {
      this.oplService = oplService;
      this.user = user;
      this.orgS = orgS;
      this.selectedOrg = this.user.user.userData.organization;
      this.edit = {};
      this.EssenceTypes = Essence;
      this.language = oplService.orgOplSettings.language;
      this.oplTable = oplService.orgOplSettings.oplTables[this.language];
      this.availableLanguage = oplService.getAvailableLanguages();
      this.essenceNum = Number(oplService.orgOplSettings.essence);
      this.essence = this.essenceName(oplService.orgOplSettings.essence);
      this.oplNumbering = oplService.orgOplSettings.oplNumbering;
      this.autoFormat = oplService.orgOplSettings.autoFormat;
      this.notes = oplService.orgOplSettings.displayNotes;
      this.affiliationNum = Number(oplService.orgOplSettings.affiliation);
      this.affiliation = this.affiliationName(oplService.orgOplSettings.affiliation);
      this.essenceTypes = [this.oplTable.essence.physical, this.oplTable.essence.informatical];
      this.affiliationTypes = [this.oplTable.affiliation.systemic, this.oplTable.affiliation.environmental];
      this.displayOpts = DisplayOpt;
      this.disPlayOpt = this.getEssenceSentence(oplService.orgOplSettings.displayOpt);
      this.unitsOpts = UnitsOpt;
      this.aliasOpts = AliasOpt;
      this.unitsDOpt = oplService.orgOplSettings.unitsOpt;
      this.aliasDOpt = oplService.orgOplSettings.aliasOpt;
      this.opdTreeProcessesAutoArrangement = oplService.orgOplSettings.opdTreeProcessesAutoArrangement;
    }
    getEssenceSentence(sentence) {
      return this.oplService.convertDisplayOptForBackwardCompatibility(sentence);
    }
    ngOnInit() {
      const user = this.user.user.userData;
      if (user.SysAdmin) {
        this.organizations$ = this.orgS.getOrganizations();
      } else {
        this.organizations$ = (0, observable_of.of)([{
          id: user._organization,
          name: user.organization
        }]);
      }
      this.placeholder = user.OrgAdmin ? user.organization : "Organization";
      this.updateTable(this.language);
      this.initiateEdit();
      // console.log(this.edit);
    }
    selectOrg(event) {
      const that = this;
      this.selectedOrg = event.value;
      this.orgS.getOrganization(event.value).then(org => {
        if (org && "essence" in org) {
          that.essence = that.essenceTypes[Number(org.essence)];
          that.essenceNum = Number(org.essence);
        } else {
          // else cases are for organization that has default settings
          that.essenceNum = Number(defaultSettings.organization.essence);
          that.essence = that.essenceTypes[Number(that.essenceNum)];
        }
        if (org && "language" in org) {
          that.language = org.language;
          that.updateTable(that.language);
        } else {
          that.language = defaultSettings.organization.language;
          that.updateTable(that.language);
        }
        if (org && "displayOpt" in org) {
          that.disPlayOpt = that.getEssenceSentence(org.displayOpt);
        } else {
          that.disPlayOpt = defaultSettings.organization.displayOpt;
        }
        if (org && "unitsOpt" in org) {
          that.unitsDOpt = org.unitsOpt;
        } else {
          that.unitsDOpt = defaultSettings.organization.unitsOpt;
        }
        if (org && "aliasOpt" in org) {
          that.aliasDOpt = org.aliasOpt;
        } else {
          that.aliasDOpt = defaultSettings.organization.aliasOpt;
        }
        if (org && "oplNumbering" in org) {
          that.oplNumbering = org.oplNumbering;
        } else {
          that.oplNumbering = defaultSettings.organization.oplNumbering;
        }
        if (org && "autoFormat" in org) {
          that.autoFormat = org.autoFormat;
        } else {
          that.autoFormat = defaultSettings.organization.autoFormat;
        }
        if (org && "notes" in org) {
          that.notes = org.displayNotes;
        } else {
          that.notes = defaultSettings.organization.displayNotes;
        }
      });
    }
    updateTable(lan) {
      this.oplTable = this.oplService.getOplTable(lan);
      this.essenceTypes = [this.oplTable.essence.physical, this.oplTable.essence.informatical];
      this.affiliationTypes = [this.oplTable.affiliation.systemic, this.oplTable.affiliation.environmental];
      // update essence and affiliation according to the current essence and affiliation and in the right language
      this.essence = this.essenceTypes[Number(this.essenceNum)];
      this.affiliation = this.affiliationTypes[Number(this.affiliationNum)];
      //oplDefaultSettings.language = lan;
    }
    saveTable() {
      const currProc = this;
      const prevData = [currProc.oplService.orgOplSettings.essence, currProc.oplService.orgOplSettings.language, currProc.oplService.orgOplSettings.displayOpt, currProc.oplService.orgOplSettings.oplNumbering, currProc.oplService.orgOplSettings.autoFormat, currProc.oplService.orgOplSettings.displayNotes];
      currProc.oplService.orgOplSettings.essence = currProc.essenceToEnum(currProc.essence);
      currProc.oplService.orgOplSettings.language = currProc.language;
      currProc.oplService.orgOplSettings.oplNumbering = currProc.oplNumbering;
      currProc.oplService.orgOplSettings.autoFormat = currProc.autoFormat;
      currProc.oplService.orgOplSettings.displayNotes = currProc.notes;
      currProc.oplService.orgOplSettings.displayOpt = currProc.disPlayOpt;
      currProc.oplService.orgOplSettings.unitsOpt = currProc.unitsDOpt;
      currProc.oplService.orgOplSettings.aliasOpt = currProc.aliasDOpt;
      currProc.oplService.orgOplSettings.opdTreeProcessesAutoArrangement = currProc.opdTreeProcessesAutoArrangement;
      const settings = currProc.oplService.orgOplSettings;
      const details = {};
      currProc.essenceNum = Number(currProc.essenceToEnum(currProc.essence));
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
          return;
        }
        if (key === "essence") {
          details[key] = String(settings[key]);
          return;
        }
        details[key] = settings[key];
      });
      currProc.orgS.updateOrganization(currProc.selectedOrg, details).then(result => {
        (0, validationAlert)("Settings Saved", null, "Success");
      }).catch(err => {
        (0, validationAlert)("Error! could not update organization details " + err, null, "Error");
      });
    }
    cancelTableChange() {
      this.oplTable = OplTables[this.language];
    }
    ReturnToDefault() {
      this.language = defaultSettings.organization.language;
      this.oplTable = this.oplService.getOplTable(this.language);
      this.essence = this.essenceName(defaultSettings.organization.essence);
      this.essenceNum = Number(defaultSettings.organization.essence);
      this.disPlayOpt = defaultSettings.organization.displayOpt;
      this.unitsDOpt = defaultSettings.organization.unitsOpt;
      this.aliasDOpt = defaultSettings.organization.aliasOpt;
      this.oplNumbering = defaultSettings.organization.oplNumbering;
      this.autoFormat = defaultSettings.organization.autoFormat;
      this.notes = defaultSettings.organization.displayNotes;
      this.essenceTypes = [this.oplTable.essence.physical, this.oplTable.essence.informatical];
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
        oplDefaultSettings.language = lan;
        OplTables[lan] = this.oplTable;
        this.oplService.orgOplSettings.oplTables[lan] = this.oplTable;
        // console.log(OplTables);
        // console.log(this.oplService.orgOplSettings.oplTables);
        this.oplService.updateOrgSettings();
        (0, validationAlert)(`New language ${lan} is added!`, null, "Success");
      } else {
        (0, validationAlert)("The language already exists!", null, "Error");
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
    essenceName(essence) {
      if (essence === Essence.Physical) {
        return this.oplTable.essence.physical;
      }
      if (essence === Essence.Informatical) {
        return this.oplTable.essence.informatical;
      }
      console.log("ERROR: ", essence);
    }
    affiliationName(affiliation) {
      if (affiliation === Affiliation.Systemic) {
        return this.oplTable.affiliation.systemic;
      }
      if (affiliation === Affiliation.Environmental) {
        return this.oplTable.affiliation.environmental;
      }
      console.log("ERROR: ", affiliation);
    }
    essenceToEnum(essence) {
      if (essence === this.oplTable.essence.physical) {
        return Essence.Physical;
      }
      return Essence.Informatical;
    }
    affiliationToEnum(a) {
      if (a === this.oplTable.affiliation.systemic) {
        return Affiliation.Systemic;
      }
      return Affiliation.Environmental;
    }
    static #_ = (() => this.ɵfac = function OplDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OplDialogComponent)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(OrganizationService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OplDialogComponent,
      selectors: [["opcloud-opl-dialog"]],
      decls: 118,
      vars: 29,
      consts: [[1, "container"], [1, "headerContainer"], [1, "h2"], [2, "color", "#1A3763"], ["id", "mat-select-opl-dialog-select-organization", 3, "selectionChange", "placeholder"], ["label", "Select Organization"], [3, "value", 4, "ngFor", "ngForOf"], ["id", "componentBody"], [2, "width", "100%"], [2, "width", "305px"], ["name", "selectLan", 1, "mat-select-class-opl", 3, "ngModelChange", "selectionChange", "ngModel"], ["class", "optionText", 3, "value", 4, "ngFor", "ngForOf"], ["name", "selectEssence", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], [1, "optionText", 3, "value"], ["name", "display", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], ["name", "displayUnits", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], ["name", "displayAlias", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], ["id", "showOPLNumbering", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], ["id", "autoFormat", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], ["id", "notes", 1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], [1, "mat-select-class-opl", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "orgOPLButtons"], ["mat-raised-button", "", "id", "saveBTN", 3, "click"], ["mat-raised-button", "", "id", "rtnDfltBTN", 3, "click"]],
      template: function OplDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "Choose Organization");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "span", 3);
          core /* ɵɵtext */.EFF(5, "Organization: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "mat-select", 4);
          core /* ɵɵlistener */.bIt("selectionChange", function OplDialogComponent_Template_mat_select_selectionChange_6_listener($event) {
            return ctx.selectOrg($event);
          });
          core /* ɵɵelementStart */.j41(7, "mat-optgroup", 5);
          core /* ɵɵtemplate */.DNE(8, OplDialogComponent_mat_option_8_Template, 2, 4, "mat-option", 6);
          core /* ɵɵpipe */.nI1(9, "async");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(10, "div", 7)(11, "div", 2);
          core /* ɵɵtext */.EFF(12, "Organization Language & OPL Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(13, "table", 8)(14, "tr")(15, "td", 9)(16, "label");
          core /* ɵɵtext */.EFF(17, "Language");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(18, "td")(19, "mat-select", 10);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_19_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.language, $event)) {
              ctx.language = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OplDialogComponent_Template_mat_select_selectionChange_19_listener() {
            return ctx.updateTable(ctx.language);
          });
          core /* ɵɵtemplate */.DNE(20, OplDialogComponent_mat_option_20_Template, 2, 2, "mat-option", 11);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(21, "br")(22, "br");
          core /* ɵɵelementStart */.j41(23, "tr")(24, "td", 9)(25, "label");
          core /* ɵɵtext */.EFF(26, "Things Default Essence");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(27, "td")(28, "mat-select", 12);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_28_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.essence, $event)) {
              ctx.essence = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(29, "mat-option", 13);
          core /* ɵɵtext */.EFF(30);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "mat-option", 13);
          core /* ɵɵtext */.EFF(32);
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(33, "br")(34, "br");
          core /* ɵɵelementStart */.j41(35, "tr")(36, "td", 9)(37, "label");
          core /* ɵɵtext */.EFF(38, "OPL Essence Sentences");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(39, "td")(40, "mat-select", 14);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_40_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.disPlayOpt, $event)) {
              ctx.disPlayOpt = $event;
            }
            return $event;
          });
          core /* ɵɵtemplate */.DNE(41, OplDialogComponent_mat_option_41_Template, 2, 2, "mat-option", 6);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(42, "br")(43, "br");
          core /* ɵɵelementStart */.j41(44, "tr")(45, "td", 9)(46, "label");
          core /* ɵɵtext */.EFF(47, "Units Display Options");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(48, "td")(49, "mat-select", 15);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_49_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.unitsDOpt, $event)) {
              ctx.unitsDOpt = $event;
            }
            return $event;
          });
          core /* ɵɵtemplate */.DNE(50, OplDialogComponent_mat_option_50_Template, 2, 2, "mat-option", 6);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(51, "br")(52, "br");
          core /* ɵɵelementStart */.j41(53, "tr")(54, "td", 9)(55, "label");
          core /* ɵɵtext */.EFF(56, "Alias OPL Display Options");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(57, "td")(58, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_58_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.aliasDOpt, $event)) {
              ctx.aliasDOpt = $event;
            }
            return $event;
          });
          core /* ɵɵtemplate */.DNE(59, OplDialogComponent_mat_option_59_Template, 2, 2, "mat-option", 6);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(60, "br")(61, "br");
          core /* ɵɵelementStart */.j41(62, "tr")(63, "td", 9)(64, "label");
          core /* ɵɵtext */.EFF(65, "Show OPL Numbering");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(66, "td")(67, "mat-select", 17);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_67_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.oplNumbering, $event)) {
              ctx.oplNumbering = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(68, "mat-option", 13);
          core /* ɵɵtext */.EFF(69, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(70, "mat-option", 13);
          core /* ɵɵtext */.EFF(71, "False");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(72, "br")(73, "br");
          core /* ɵɵelementStart */.j41(74, "tr")(75, "td", 9)(76, "label");
          core /* ɵɵtext */.EFF(77, "Auto Format");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(78, "td")(79, "mat-select", 18);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_79_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.autoFormat, $event)) {
              ctx.autoFormat = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(80, "mat-option", 13);
          core /* ɵɵtext */.EFF(81, "True");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(82, "mat-option", 13);
          core /* ɵɵtext */.EFF(83, "False");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(84, "br")(85, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(86, "br")(87, "br");
          core /* ɵɵelementStart */.j41(88, "tr")(89, "td", 9)(90, "label");
          core /* ɵɵtext */.EFF(91, "Notes");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(92, "td")(93, "mat-select", 19);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_93_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.notes, $event)) {
              ctx.notes = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(94, "mat-option", 13);
          core /* ɵɵtext */.EFF(95, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(96, "mat-option", 13);
          core /* ɵɵtext */.EFF(97, "Hide");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(98, "br")(99, "br");
          core /* ɵɵelementStart */.j41(100, "tr")(101, "td", 9)(102, "label");
          core /* ɵɵtext */.EFF(103, "OPD Tree Processes Arrangement");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(104, "td")(105, "mat-select", 20);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OplDialogComponent_Template_mat_select_ngModelChange_105_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.opdTreeProcessesAutoArrangement, $event)) {
              ctx.opdTreeProcessesAutoArrangement = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(106, "mat-option", 21);
          core /* ɵɵtext */.EFF(107, "Automatic");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(108, "mat-option", 21);
          core /* ɵɵtext */.EFF(109, "Manually");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(110, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(111, "br")(112, "br");
          core /* ɵɵelementStart */.j41(113, "div", 22)(114, "button", 23);
          core /* ɵɵlistener */.bIt("click", function OplDialogComponent_Template_button_click_114_listener() {
            return ctx.saveTable();
          });
          core /* ɵɵtext */.EFF(115, "Save");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(116, "button", 24);
          core /* ɵɵlistener */.bIt("click", function OplDialogComponent_Template_button_click_116_listener() {
            return ctx.ReturnToDefault();
          });
          core /* ɵɵtext */.EFF(117, "Reset to default");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("placeholder", ctx.placeholder);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(9, 27, ctx.organizations$));
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.language);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.availableLanguage);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.essence);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.oplTable.essence.physical);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.toDisplay(ctx.oplTable.essence.physical));
          core /* ɵɵadvance */.R7$();
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.oplTable.essence.informatical);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.toDisplay(ctx.oplTable.essence.informatical));
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.disPlayOpt);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.displayOpts);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.unitsDOpt);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.unitsOpts);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.aliasDOpt);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.aliasOpts);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.oplNumbering);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.autoFormat);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.notes);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.opdTreeProcessesAutoArrangement);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
        }
      },
      dependencies: [NgForOf, MatSelect, MatOption, MatOptgroup, MatButton, NgControlStatus, NgModel, AsyncPipe],
      styles: [".h2[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:16px;color:#1a3763;margin:25px}#OPLTableHeader[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif!important;font-style:normal!important;font-weight:500!important;line-height:normal!important;font-size:20px!important;color:#1a3763!important}label[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#1a3763}.orgOPLButtons[_ngcontent-%COMP%]{align-items:center}.orgOPLButtons[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(#saveBTN, #rtnDfltBTN)[_ngcontent-%COMP%]{position:relative;left:240px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;margin-right:20px}#displayOptionsLabel[_ngcontent-%COMP%], #displayOptionsLabelUnits[_ngcontent-%COMP%], #displayOptionsLabelAlias[_ngcontent-%COMP%]{position:relative;top:36px}.optionText[_ngcontent-%COMP%]{position:relative!important;left:20px!important}.addNewLangInput[_ngcontent-%COMP%]{position:relative;margin-left:20px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#rtnDfltBTNlang1[_ngcontent-%COMP%]{text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;margin-left:20px}#rtnDfltBTNlang2[_ngcontent-%COMP%], #rtnDfltBTNlang3[_ngcontent-%COMP%]{position:relative;left:140px;top:20px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;margin-right:20px}.addOPLtbl[_ngcontent-%COMP%]{border-collapse:collapse}.addOPLtbl[_ngcontent-%COMP%], .addOPLtblth[_ngcontent-%COMP%], .addOPLtbltb[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.77);border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;color:#3b3b3b}.addOPLtblth[_ngcontent-%COMP%]{font-size:16px;color:#3b3b3b;opacity:.77}.addOPLtbltb[_ngcontent-%COMP%]{font-size:14px;color:#3b3b3b}.container[_ngcontent-%COMP%]{position:relative;left:50px;top:50px}.tableContainer[_ngcontent-%COMP%]{position:relative;left:30px;top:40px;width:806px;height:444px}.addOPLtbl[_ngcontent-%COMP%]{width:806px;height:344px}.addOPLtbltd[_ngcontent-%COMP%]{line-height:30px;width:403px}.addOPLtbltr[_ngcontent-%COMP%]:nth-child(2n){background:#fff}.addOPLtbltr[_ngcontent-%COMP%]:nth-child(odd){background:#e4e8ec6e}#btns[_ngcontent-%COMP%]{position:relative;left:125px}"]
    }))();
  }
  return OplDialogComponent;
})();
let KeysPipe = /*#__PURE__*/(() => {
  class KeysPipe {
    transform(value) {
      if (!value) {
        return [];
      }
      const keys = [];
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          keys.push({
            key: key,
            value: value[key]
          });
        }
      }
      return keys;
    }
    static #_ = (() => this.ɵfac = function KeysPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || KeysPipe)();
    })();
    static #_2 = (() => this.ɵpipe = /*@__PURE__*/core /* ɵɵdefinePipe */.EJ8({
      name: "keys",
      type: KeysPipe,
      pure: true
    }))();
  }
  return KeysPipe;
})();