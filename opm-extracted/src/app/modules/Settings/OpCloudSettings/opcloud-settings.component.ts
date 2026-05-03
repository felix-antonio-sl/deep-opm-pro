// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/OpCloudSettings/opcloud-settings.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function OpcloudSettingsComponent_span_223_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 130);
    core /* ɵɵtext */.EFF(1, "(Locked by organization)");
    core /* ɵɵelementEnd */.k0s();
  }
}
function OpcloudSettingsComponent_tr_235_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr", 24)(1, "td", 27)(2, "label");
    core /* ɵɵtext */.EFF(3, "Email as Second Authentication Factor");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "td", 27)(5, "mat-slide-toggle", 57);
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_tr_235_Template_mat_slide_toggle_change_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.OnChangeEmail2FA($event));
    });
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("checked", ctx_r3._isEmailAsSecondAuthFactor);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r3._isEmailAsSecondAuthFactor ? "Enabled" : "Disabled", " ");
  }
}
function OpcloudSettingsComponent_table_358_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "table", 84)(1, "thead")(2, "th");
    core /* ɵɵtext */.EFF(3, "GraphDB Connection");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "tbody")(5, "tr", 60)(6, "td");
    core /* ɵɵtext */.EFF(7, "GraphDB API ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "td")(9, "mat-form-field", 61)(10, "input", 131);
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_table_358_Template_input_change_10_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.updateGraphDBAPI($event));
    });
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(11, "tr", 60)(12, "td");
    core /* ɵɵtext */.EFF(13, "GraphDB User ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "td")(15, "mat-form-field", 61)(16, "input", 132);
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_table_358_Template_input_change_16_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.updateGraphDBUsername($event));
    });
    core /* ɵɵelementEnd */.k0s()()()();
    core /* ɵɵelementStart */.j41(17, "tr", 60)(18, "td");
    core /* ɵɵtext */.EFF(19, "GraphDB Password ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(20, "td")(21, "mat-form-field", 61)(22, "input", 133);
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_table_358_Template_input_change_22_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.updateGraphDBPassword($event));
    });
    core /* ɵɵelementEnd */.k0s()()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r3.connection.graphdb.graphdb_api);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r3.connection.graphdb.username);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵpropertyInterpolate */.FS9("value", ctx_r3.connection.graphdb.password);
  }
}
function OpcloudSettingsComponent_div_370_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 134)(1, "span", 135)(2, "label", 136);
    core /* ɵɵtext */.EFF(3, "Transparent Things' Fill");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "mat-select", 137);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_div_370_Template_mat_select_ngModelChange_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r3.gridSettings.transparentThingsFill, $event)) {
        ctx_r3.gridSettings.transparentThingsFill = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_div_370_Template_mat_select_selectionChange_4_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.onChangeGridSettings());
    });
    core /* ɵɵelementStart */.j41(5, "mat-option", 138);
    core /* ɵɵtext */.EFF(6, "Not transparent fill");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "mat-option", 139);
    core /* ɵɵtext */.EFF(8, "All the things' fill");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "mat-option", 140);
    core /* ɵɵtext */.EFF(10, "Transparent Things' fill for in-zoomed OPD");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(11, "span", 141);
    core /* ɵɵtext */.EFF(12, "Grid Size ");
    core /* ɵɵelementStart */.j41(13, "mat-form-field", 142)(14, "input", 143);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_div_370_Template_input_ngModelChange_14_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r3.gridSettings.gridSize, $event)) {
        ctx_r3.gridSettings.gridSize = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_div_370_Template_input_change_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.onChangeGridSettings());
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(15, "span", 144);
    core /* ɵɵtext */.EFF(16, "Grid Color ");
    core /* ɵɵelementStart */.j41(17, "input", 145);
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_div_370_Template_input_change_17_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.onChangeGridColor($event));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(18, "span", 141);
    core /* ɵɵtext */.EFF(19, "Grid Thickness ");
    core /* ɵɵelementStart */.j41(20, "mat-form-field", 142)(21, "input", 143);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_div_370_Template_input_ngModelChange_21_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r3.gridSettings.thickness, $event)) {
        ctx_r3.gridSettings.thickness = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_div_370_Template_input_change_21_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.onChangeGridSettings());
    });
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(22, "span", 141);
    core /* ɵɵtext */.EFF(23, "Scale Factor ");
    core /* ɵɵelementStart */.j41(24, "mat-form-field", 142)(25, "input", 143);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_div_370_Template_input_ngModelChange_25_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r3.gridSettings.scaleFactor, $event)) {
        ctx_r3.gridSettings.scaleFactor = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_div_370_Template_input_change_25_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.onChangeGridSettings());
    });
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r3.gridSettings.transparentThingsFill);
    core /* ɵɵadvance */.R7$(10);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r3.gridSettings.gridSize);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("value", ctx_r3.gridSettings.color);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r3.gridSettings.thickness);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r3.gridSettings.scaleFactor);
  }
}
function OpcloudSettingsComponent_mat_option_389_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 29);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_size_r7 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", font_size_r7);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_size_r7);
  }
}
function OpcloudSettingsComponent_mat_option_392_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 29);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_size_r8 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", font_size_r8);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_size_r8);
  }
}
function OpcloudSettingsComponent_mat_option_395_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 29);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const font_size_r9 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", font_size_r9);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(font_size_r9);
  }
}
let OpcloudSettingsComponent = /*#__PURE__*/(() => {
  class OpcloudSettingsComponent {
    constructor(oplService, storage, userService, init) {
      this.oplService = oplService;
      this.storage = storage;
      this.userService = userService;
      this.init = init;
      this.defaultInterval = 5;
      this.defaultDigitsNum = 2;
      this.defaultCompDigitsNum = 3;
      this.newDisplayedRecentCount = 5;
      this.settingsForOrg = false;
      this.font_sizes_options = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32];
      this.userService.user$.subscribe(user => this.currentUser = user);
    }
    ngOnInit() {
      this.defaultInterval = this.storage.getAutosaveTime();
      this.defaultDigitsNum = this.oplService.settings.timeDurationUnitsDigits;
      this.defaultCompDigitsNum = this.oplService.settings.numericComputationalDigits;
      this.newDisplayedRecentCount = this.getDisplayedRecentModelsCount();
      this.logSharingPermission = this.init.logSharingPermission;
      this.notes = this.oplService.settings.Notes;
      this.sdNames = this.oplService.settings.SDNames;
      this.multiDeletion = this.oplService.settings.multiDeletion;
      this.dragSearchAuto = this.oplService.settings.dragSearchAuto;
      this.haloDefaultMode = this.oplService.settings.haloDefaultMode;
      const ts = this.oplService.settings.thingsSizing;
      this.thingsSizing = ts === "Manual" ? "Manual" : "Automatic";
      this.tutorialMode = this.oplService.settings.tutorialMode;
      this.style = this.oplService.userStylingSettings();
      this.connection = this.oplService.userConnectionSettings();
      this.navigatorEnabled = this.oplService.settings.navigatorEnabled;
      this.chatEnabled = this.oplService.settings.chatEnabled;
      this.pythonExecution = this.oplService.settings.pythonExecution;
      // Get sync mode (respects org lock)
      const orgLocked = this.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked;
      if (orgLocked) {
        this.modelReviewAutomaticSyncing = this.oplService.orgOplSettings.modelReviewAutomaticSyncing || "Manual";
      } else {
        this.modelReviewAutomaticSyncing = this.oplService.settings.modelReviewAutomaticSyncing || this.oplService.orgOplSettings.modelReviewAutomaticSyncing || "Manual";
      }
      this.gridSettings = this.oplService.settings.gridSettings;
      if (!this.gridSettings.transparentThingsFill) {
        this.gridSettings.transparentThingsFill = "inZoomedOpd";
      }
      if (this.connection.allow_users === false) {
        this.handleDisabledConnectionSettings();
      }
      this.setColorInputChangeHandlers();
      this._isSubscribedToEmails = this.isSubscribedToEmails();
      this._isEmailAsSecondAuthFactor = this.isEmailAsSecondAuthFactor();
      this._isEmailAsSecondAuthFactorSupported = this.checkIfEmailAsSecondAuthFactorSupported();
    }
    setUserDefinedInterval() {
      if (/^\d+$/.test(this.newInterval)) {
        this.storage.autoSaveInterval = Number(this.newInterval);
        this.defaultInterval = Number(this.newInterval);
        const settings = {
          autosave: this.newInterval
        };
        this.userService.updateUser(this.userService.user.uid, this.userService.user.userData.organization, settings).then(() => joint.ui.FlashMessage.open("Autosave Interval Value changed successfully and now its " + this.newInterval + " minutes", "", {
          type: "success",
          closeAnimation: {
            delay: 3000
          }
        }));
      } else {
        (0, validationAlert)("Please enter only numbers", 2500, "error");
        return;
      }
    }
    setUserDefinedDigitsNum() {
      if (/^\d+$/.test(this.newDigitsNum)) {
        this.defaultDigitsNum = Number(this.newDigitsNum);
        const settings = {
          timeDurationUnitsDigits: this.defaultDigitsNum
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => joint.ui.FlashMessage.open("Value changed successfully. From now OPCloud will show " + this.newDigitsNum + " decimal places for Time Precision values", "", {
          type: "success",
          closeAnimation: {
            delay: 3000
          }
        }));
      } else {
        (0, validationAlert)("Please enter only numbers", 2500, "error");
        return;
      }
    }
    setUserDefinedCompDigitsNum() {
      if (/^\d+$/.test(this.newCompDigitsNum)) {
        this.defaultCompDigitsNum = Number(this.newCompDigitsNum);
        const settings = {
          numericComputationalDigits: this.defaultCompDigitsNum
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => joint.ui.FlashMessage.open("Value changed successfully. From now OPCloud will show " + this.newCompDigitsNum + " decimal places for numeric computational values", "", {
          type: "success",
          closeAnimation: {
            delay: 3000
          }
        }));
      } else {
        (0, validationAlert)("Please enter only numbers", 2500, "error");
        return;
      }
    }
    getDisplayedRecentModelsCount() {
      const v = this.oplService.settings.displayedRecentModelsCount;
      const n = v === undefined || v === null ? 5 : Number(v);
      if (Number.isNaN(n)) {
        return 5;
      }
      return Math.min(10, Math.max(5, Math.round(n)));
    }
    adjustDisplayedRecentCount(delta) {
      this.newDisplayedRecentCount = Math.min(10, Math.max(5, this.newDisplayedRecentCount + delta));
    }
    setUserDisplayedRecentModelsCount() {
      const value = Math.min(10, Math.max(5, Math.round(this.newDisplayedRecentCount)));
      this.newDisplayedRecentCount = value;
      const settings = {
        displayedRecentModelsCount: value
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => joint.ui.FlashMessage.open("Displayed number of recent models saved.", "", {
        type: "success",
        closeAnimation: {
          delay: 3000
        }
      }));
    }
    updateLogSharingPermission() {
      const settings = {
        logSharingPermission: this.logSharingPermission
      };
      const message = this.logSharingPermission ? "Log sharing enabled!" : "Log sharing disabled!";
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)(message, null, "Success"));
    }
    updateNotes() {
      const settings = {
        Notes: this.notes
      };
      const message = this.notes ? "Notes are Online" : "Notes are Offline";
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)(message, null, "Success"));
    }
    updateOPDnames() {
      const settings = {
        SDNames: this.sdNames
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateUserMultiDeletion() {
      const settings = {
        multiDeletion: this.multiDeletion
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateObjectFont() {
      const settings = {
        object: {
          font: this.style.object.font
        }
      };
      this.oplService.settings.style.object.font = this.style.object.font;
      // this.userService.updateUserObjectStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
    }
    updateProcessFont() {
      const settings = {
        process: {
          font: this.style.process.font
        }
      };
      this.oplService.settings.style.process.font = this.style.process.font;
      // this.userService.updateUserProcessStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      //this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateStateFont() {
      const settings = {
        state: {
          font: this.style.state.font
        }
      };
      this.oplService.settings.style.state.font = this.style.state.font;
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateObjectFontSize() {
      const settings = {
        object: {
          font_size: this.style.object.font_size
        }
      };
      this.oplService.settings.style.object.font_size = this.style.object.font_size;
      // this.userService.updateUserObjectStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateProcessFontSize() {
      const settings = {
        process: {
          font_size: this.style.process.font_size
        }
      };
      this.oplService.settings.style.process.font_size = this.style.process.font_size;
      // this.userService.updateUserProcessStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      //this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateStateFontSize() {
      const settings = {
        state: {
          font_size: this.style.state.font_size
        }
      };
      this.oplService.settings.style.state.font_size = this.style.state.font_size;
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateObjectFillColor(value) {
      this.style.object.fill_color = value;
      const settings = {
        object: {
          fill_color: this.style.object.fill_color
        }
      };
      this.oplService.settings.style.object.fill_color = this.style.object.fill_color;
      // this.userService.updateUserObjectStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateProcessFillColor(value) {
      this.style.process.fill_color = value;
      const settings = {
        process: {
          fill_color: this.style.process.fill_color
        }
      };
      this.oplService.settings.style.process.fill_color = this.style.process.fill_color;
      // this.userService.updateUserProcessStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      this.userService.updateUserDetails(this.userService.user.uid, {
        style: settings
      }).then(() => (0, validationAlert)("Saved", null, "Success"));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateStateFillColor(value) {
      this.style.state.fill_color = value;
      const settings = {
        state: {
          fill_color: this.style.state.fill_color
        }
      };
      this.oplService.settings.style.state.fill_color = this.style.state.fill_color;
      this.userService.updateUserDetails(this.userService.user.uid, {
        style: settings
      }).then(() => (0, validationAlert)("Saved", null, "Success"));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateObjectTextColor(value) {
      this.style.object.text_color = value;
      const settings = {
        object: {
          text_color: this.style.object.text_color
        }
      };
      this.oplService.settings.style.object.text_color = this.style.object.text_color;
      // this.userService.updateUserObjectStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateProcessTextColor(value) {
      this.style.process.text_color = value;
      const settings = {
        process: {
          text_color: this.style.process.text_color
        }
      };
      this.oplService.settings.style.process.text_color = this.style.process.text_color;
      // this.userService.updateUserProcessStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateStateTextColor(value) {
      this.style.state.text_color = value;
      const settings = {
        state: {
          text_color: this.style.state.text_color
        }
      };
      this.oplService.settings.style.state.text_color = this.style.state.text_color;
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateObjectBorderColor(value) {
      this.style.object.border_color = value;
      const settings = {
        object: {
          border_color: this.style.object.border_color
        }
      };
      this.oplService.settings.style.object.border_color = this.style.object.border_color;
      // this.userService.updateUserObjectStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateProcessBorderColor(value) {
      this.style.process.border_color = value;
      const settings = {
        process: {
          border_color: this.style.process.border_color
        }
      };
      this.oplService.settings.style.process.border_color = this.style.process.border_color;
      // this.userService.updateUserProcessStyleSettings(this.userService.user.uid, this.userService.userOrg, settings)
      //   .then(() => validationAlert('saved', null, 'Success'));
      // this.userService.updateUserDetails(this.userService.user.uid, {style: settings}).then(() => validationAlert('Saved', null, 'Success'));
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    updateStateBorderColor(value) {
      this.style.state.border_color = value;
      const settings = {
        state: {
          border_color: this.style.state.border_color
        }
      };
      this.oplService.settings.style.state.border_color = this.style.state.border_color;
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    /**
     * updating handlers for input with type color
     */
    setColorInputChangeHandlers() {
      const thisProc = this;
      const object_fill_color = document.getElementById("object_fill_color_input");
      object_fill_color.addEventListener("change", function () {
        thisProc.updateObjectFillColor(this.value);
      });
      const process_fill_color = document.getElementById("process_fill_color_input");
      process_fill_color.addEventListener("change", function () {
        thisProc.updateProcessFillColor(this.value);
      });
      const state_fill_color = document.getElementById("state_fill_color_input");
      state_fill_color.addEventListener("change", function () {
        thisProc.updateStateFillColor(this.value);
      });
      const object_text_color = document.getElementById("object_text_color_input");
      object_text_color.addEventListener("change", function () {
        thisProc.updateObjectTextColor(this.value);
      });
      const process_text_color = document.getElementById("process_text_color_input");
      process_text_color.addEventListener("change", function () {
        thisProc.updateProcessTextColor(this.value);
      });
      const state_text_color = document.getElementById("state_text_color_input");
      state_text_color.addEventListener("change", function () {
        thisProc.updateStateTextColor(this.value);
      });
      const object_border_color = document.getElementById("object_border_color_input");
      object_border_color.addEventListener("change", function () {
        thisProc.updateObjectBorderColor(this.value);
      });
      const process_border_color = document.getElementById("process_border_color_input");
      process_border_color.addEventListener("change", function () {
        thisProc.updateProcessBorderColor(this.value);
      });
      const state_border_color = document.getElementById("state_border_color_input");
      state_border_color.addEventListener("change", function () {
        thisProc.updateStateBorderColor(this.value);
      });
    }
    ReturnToDefault() {
      this.logSharingPermission = defaultSettings.user.logSharingPermission;
      this.defaultDigitsNum = defaultSettings.user.timeDurationUnitsDigits;
      this.defaultCompDigitsNum = defaultSettings.user.numericComputationalDigits;
      this.newDisplayedRecentCount = defaultSettings.user.displayedRecentModelsCount;
      this.navigatorEnabled = defaultSettings.user.navigatorEnabled;
      this.init.showNavigator = this.navigatorEnabled;
      this.chatEnabled = defaultSettings.user.navigatorEnabled;
      this.init.showChatPanel = this.chatEnabled;
      this.notes = this.oplService.orgOplSettings.displayNotes ? this.oplService.orgOplSettings.displayNotes : defaultSettings.organization.displayNotes;
      this.sdNames = this.oplService.orgOplSettings.sdNames ? this.oplService.orgOplSettings.sdNames : defaultSettings.organization.SDNames;
      this.multiDeletion = defaultSettings.user.multiDeletion;
      this.tutorialMode = this.oplService.orgOplSettings.tutorialMode ? this.oplService.orgOplSettings.tutorialMode : defaultSettings.organization.tutorialMode;
      this.dragSearchAuto = this.oplService.orgOplSettings.dragSearchAuto ? this.oplService.orgOplSettings.dragSearchAuto : defaultSettings.organization.dragSearchAuto;
      this.haloDefaultMode = defaultSettings.user.haloDefaultMode;
      this.thingsSizing = "Automatic";
      this.init.automaticResizing = this.thingsSizing === "Automatic";
      this.style = this.cloneOrganizationStyleSettings();
      this.connection = this.cloneOrganizationConnectionSettings();
      this.init.oplService.settings.bringConnectedSettings.fundamentals = defaultSettings.user.bringConnectedSettings.fundamentals;
      this.init.oplService.settings.bringConnectedSettings.tagged = defaultSettings.user.bringConnectedSettings.tagged;
      this.init.oplService.settings.bringConnectedSettings.proceduralTransformers = defaultSettings.user.bringConnectedSettings.proceduralTransformers;
      this.init.oplService.settings.bringConnectedSettings.proceduralEnablers = defaultSettings.user.bringConnectedSettings.proceduralEnablers;
      this.init.oplService.settings.gridSettings.state = false;
      this.init.oplService.settings.gridSettings.color = "#8c8c8c";
      this.init.oplService.settings.gridSettings.thickness = 1;
      this.init.oplService.settings.gridSettings.scaleFactor = 35;
      this.init.oplService.settings.gridSettings.gridSize = 5;
      this.init.oplService.settings.gridSettings.transparentThingsFill = "inZoomedOpd";
      this.gridSettings = this.init.oplService.settings.gridSettings;
      this.init.showGrid = this.init.oplService.settings.gridSettings.state;
      this.init.toggleGrid(false);
      this.init.toggleGrid(false);
      const settings = {
        Notes: this.notes,
        SDNames: this.sdNames,
        tutorialMode: this.tutorialMode,
        dragSearchAuto: this.dragSearchAuto,
        haloDefaultMode: this.haloDefaultMode,
        thingsSizing: this.thingsSizing,
        style: this.oplService.getUndefinedStyleSettings(),
        connection: this.oplService.getUndefinedConnectionSettings(),
        numericComputationalDigits: this.defaultCompDigitsNum,
        timeDurationUnitsDigits: this.defaultDigitsNum,
        displayedRecentModelsCount: defaultSettings.user.displayedRecentModelsCount,
        navigatorEnabled: this.navigatorEnabled,
        chatEnabled: this.chatEnabled,
        multiDeletion: this.multiDeletion,
        bringConnectedSettings: this.init.oplService.settings.bringConnectedSettings,
        gridSettings: this.gridSettings
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Settings configuration restored to default", null, "Success"));
    }
    cloneOrganizationStyleSettings() {
      let objectStyleSettings = this.oplService.getObjectStyleDefaultSettings();
      let processStyleSettings = this.oplService.getProcessStyleDefaultSettings();
      let stateStyleSettings = this.oplService.getStateStyleDefaultSettings();
      this.updateUserStyleSettingsAccordingToOrganzation(objectStyleSettings, "object");
      this.updateUserStyleSettingsAccordingToOrganzation(processStyleSettings, "process");
      this.updateUserStyleSettingsAccordingToOrganzation(stateStyleSettings, "state");
      return {
        object: objectStyleSettings,
        process: processStyleSettings,
        state: stateStyleSettings
      };
    }
    /**
     * * updates styleSettings object/process(according to given type) by this order: default settings->organization
     * settings in order to return to default settings.
     * */
    updateUserStyleSettingsAccordingToOrganzation(styleSettings, type) {
      const thisProc = this;
      Object.keys(defaultObjectStyleSettings).forEach(function (key) {
        styleSettings[key] = thisProc.oplService.orgSettings.style[type] && thisProc.oplService.orgSettings.style[type][key] ? thisProc.oplService.orgSettings.style[type][key] : styleSettings[key];
      });
    }
    /**
     * when returning to default settings, the user's settings should be the organization settings.
     **/
    cloneOrganizationConnectionSettings() {
      const rosSettings = this.oplService.getRosConnectionDefaultSettings();
      const mqttSettings = this.oplService.getMqttConnectionDefaultSettings();
      const pythonSettings = this.oplService.getPythonConnectionDefaultSettings();
      const mysqlSettings = this.oplService.getMySQLConnectionDefaultSettings();
      const graphDBConnectionSettings = this.oplService.getGraphDBConnectionDefaultSettings();
      const calculationsServerSettings = this.oplService.getComputingServerConnectionDefaultSettings();
      const allow_usersSettings = this.oplService.allow_users;
      this.updateUserConnectionSettingsAccordingToOrganzation(rosSettings, "ros");
      this.updateUserConnectionSettingsAccordingToOrganzation(mqttSettings, "mqtt");
      this.updateUserConnectionSettingsAccordingToOrganzation(pythonSettings, "python");
      this.updateUserConnectionSettingsAccordingToOrganzation(mysqlSettings, "mysql");
      this.updateGraphDBConnectionSettingsAccordingToOrganzation(graphDBConnectionSettings, "graphdb");
      this.updateCalculationsServerConnectionSettingsAccordingToOrganzation(calculationsServerSettings, "calculationsServer");
      return {
        ros: rosSettings,
        mqtt: mqttSettings,
        python: pythonSettings,
        mysql: mysqlSettings,
        graphdb: graphDBConnectionSettings,
        allow_users: allow_usersSettings,
        calculationsServer: calculationsServerSettings
      };
    }
    /**
     * * updates Calculations Server Settings (according to given type) by this order: if defined - take the organization
     * settings otherwise stay with the default settings
     * */
    updateCalculationsServerConnectionSettingsAccordingToOrganzation(calculationsServerSettings, type) {
      const thisProc = this;
      Object.keys(defaultRosConnectionSettings).forEach(function (key) {
        calculationsServerSettings[key] = thisProc.oplService.orgSettings.connection[type] && thisProc.oplService.orgSettings.connection[type][key] !== undefined ? thisProc.oplService.orgSettings.connection[type][key] : calculationsServerSettings[key];
      });
    }
    /**
     * * updates Graph DB Settings (according to given type) by this order: if defined - take the organization
     * settings otherwise stay with the default settings
     * */
    updateGraphDBConnectionSettingsAccordingToOrganzation(graphDBConnectionSettings, type) {
      const thisProc = this;
      Object.keys(defaultRosConnectionSettings).forEach(function (key) {
        graphDBConnectionSettings[key] = thisProc.oplService.orgSettings.connection[type] && thisProc.oplService.orgSettings.connection[type][key] !== undefined ? thisProc.oplService.orgSettings.connection[type][key] : graphDBConnectionSettings[key];
      });
    }
    /**
     * * updates connectionSettings ros/mqtt(according to given type) by this order: if defined- take the organization
     * settings otherwise stay with the default settings
     * */
    updateUserConnectionSettingsAccordingToOrganzation(connectionSettings, type) {
      const thisProc = this;
      Object.keys(defaultRosConnectionSettings).forEach(function (key) {
        connectionSettings[key] = thisProc.oplService.orgSettings.connection[type] && thisProc.oplService.orgSettings.connection[type][key] !== undefined ? thisProc.oplService.orgSettings.connection[type][key] : connectionSettings[key];
      });
    }
    /**
     * updates the user ros server according to the choice
     **/
    updatePythonServer(event) {
      const new_server = event.target.value;
      const prev_server = this.connection.python.server;
      const check_server_validity = this.serverIsValid(new_server);
      if (check_server_validity.isValid) {
        this.connection.python.server = new_server;
        this.oplService.settings.connection.python.server = this.connection.python.server;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        const message = "Server can contain only numbers, dots and english letters, \n or to be in a format of an IP address." + (check_server_validity.illegal_char !== undefined ? "\n The character " + check_server_validity.illegal_char + " cannot be used." : "");
        (0, validationAlert)(message);
        document.getElementById("server-Python-input").value = prev_server;
      }
    }
    /**
     * updates the user ros port according to the choice
     **/
    updatePythonPort(event) {
      const prev_port = this.connection.python.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.python.port = new_port;
        this.oplService.settings.connection.python.port = this.connection.python.port;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-Python-input").value = prev_port;
      }
    }
    /**
     * updates the user Mysql port according to the choice
     **/
    updateMySQLPort(event) {
      const prev_port = this.connection.mysql.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.mysql.port = new_port;
        this.oplService.settings.connection.mysql.port = this.connection.mysql.port;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-MySQL-input").value = prev_port;
      }
    }
    /**
     * updates the user mysql hostname according to the choice.
     **/
    updateMySQLHostname(event) {
      const prev_hostname = this.connection.mysql.hostname;
      const new_hostname = event.target.value;
      if (this.hostnameIsValid(new_hostname)) {
        this.connection.mysql.hostname = new_hostname;
        this.oplService.settings.connection.mysql.hostname = this.connection.mysql.hostname;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Hostname should be a string!");
        document.getElementById("hostname-MySQL-input").value = prev_hostname;
      }
    }
    /**
     * updates the user mysql username according to the choice.
     **/
    updateMySQLUsername(event) {
      const prev_username = this.connection.mysql.username;
      const new_username = event.target.value;
      if (this.usernameIsValid(new_username)) {
        this.connection.mysql.username = new_username;
        this.oplService.settings.connection.mysql.username = this.connection.mysql.username;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Username should not be a null value ");
        document.getElementById("username-MySQL-input").value = prev_username;
      }
    }
    /**
     * updates the user mysql password according to the choice.
     **/
    updateMySQLPassword(event) {
      const prev_password = this.connection.mysql.password;
      const new_password = event.target.value;
      if (this.passwordIsValid(new_password)) {
        this.connection.mysql.password = new_password;
        this.oplService.settings.connection.mysql.password = this.connection.mysql.password;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Password should not be a null value");
        document.getElementById("password-MySQL-input").value = prev_password;
      }
    }
    /**
     * updates the mysql Schema according to the choice.
     **/
    updateMySQLSchema(event) {
      const prev_Schema = this.connection.mysql.schema;
      const new_Schema = event.target.value;
      if (this.hostnameIsValid(new_Schema)) {
        this.connection.mysql.schema = new_Schema;
        this.oplService.settings.connection.mysql.schema = this.connection.mysql.schema;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Schema should be a string!");
        document.getElementById("schema-input").value = prev_Schema;
      }
    }
    /**
     * updates the user mysql hostname according to the choice.
     **/
    updateWSHostname(event) {
      const prev_WS_hostname = this.connection.mysql.ws_hostname;
      const new_WS_hostname = event.target.value;
      if (this.hostnameIsValid(new_WS_hostname)) {
        this.connection.mysql.ws_hostname = new_WS_hostname;
        this.oplService.settings.connection.mysql.ws_hostname = this.connection.mysql.ws_hostname;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Hostname should be a string!");
        document.getElementById("hostname-WS-input").value = prev_WS_hostname;
      }
    }
    /**
     * updates the user ros port according to the choice
     **/
    updateWSPort(event) {
      const prev_WS_port = this.connection.mysql.ws_port;
      const new_WS_port = event.target.value;
      if (this.portIsValid(new_WS_port)) {
        this.connection.mysql.ws_port = new_WS_port;
        this.oplService.settings.connection.mysql.ws_port = this.connection.mysql.ws_port;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-WS-input").value = prev_WS_port;
      }
    }
    /**
     * validates the legality of the new_hostname: should be a string
     * */
    hostnameIsValid(new_hostname) {
      return typeof new_hostname === "string";
    }
    /**
     * validates the legality of the new_username: should not be a null value.
     * */
    usernameIsValid(new_username) {
      return true;
    }
    /**
     * validates the legality of the new_username: should not be a null value.
     * */
    passwordIsValid(new_password) {
      return true;
    }
    /**
     * updates the user ros server according to the choice
     **/
    updateRosServer(event) {
      const new_server = event.target.value;
      const prev_server = this.connection.ros.server;
      const check_server_validity = this.serverIsValid(new_server);
      if (check_server_validity.isValid) {
        this.connection.ros.server = new_server;
        this.oplService.settings.connection.ros.server = this.connection.ros.server;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        const message = "Server can contain only numbers, dots and english letters, \n or to be in a format of an IP address." + (check_server_validity.illegal_char !== undefined ? "\n The character " + check_server_validity.illegal_char + " cannot be used." : "");
        (0, validationAlert)(message);
        document.getElementById("server-Ros-input").value = prev_server;
      }
    }
    /**
     * updates the user ros port according to the choice
     **/
    updateRosPort(event) {
      const prev_port = this.connection.ros.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.ros.port = new_port;
        this.oplService.settings.connection.ros.port = this.connection.ros.port;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-Ros-input").value = prev_port;
      }
    }
    /**
     * updates the user mqtt server according to the choice
     **/
    updateMqttServer(event) {
      const new_server = event.target.value;
      const prev_server = this.connection.mqtt.server;
      const check_server_validity = this.serverIsValid(new_server);
      if (check_server_validity.isValid) {
        this.connection.mqtt.server = new_server;
        this.oplService.settings.connection.mqtt.server = this.connection.mqtt.server;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        const message = "Server can contain only numbers, dots and english letters, \n or to be in a format of an IP address." + (check_server_validity.illegal_char !== undefined ? "\n The character " + check_server_validity.illegal_char + " cannot be used." : "");
        (0, validationAlert)(message);
        document.getElementById("server-Mqtt-input").value = prev_server;
      }
    }
    /**
     * updates the user mqtt port according to the choice
     **/
    updateMqttPort(event) {
      const prev_port = this.connection.mqtt.port;
      const new_port = event.target.value;
      if (this.portIsValid(new_port)) {
        this.connection.mqtt.port = new_port;
        this.oplService.settings.connection.mqtt.port = this.connection.mqtt.port;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Port should be a number or empty");
        document.getElementById("port-Mqtt-input").value = prev_port;
      }
    }
    /**
     * validates the legality of the new_port: should be a number or an empty string
     * */
    portIsValid(new_port) {
      return !isNaN(new_port);
    }
    /**
     * validates the legality of the new_server: should not include certain characters
     * */
    serverIsValid(new_server) {
      // Illegal characters: Everything except a-z, A-Z, 0-9, dot (.), and hyphen (-)
      const illegal_chars_regex = new RegExp("[^a-zA-Z0-9.-]", "i");
      const is_illegal_chars = new_server.search(illegal_chars_regex);
      // Ensure it does not start or end with a hyphen (-) or dot (.)
      const starts_or_ends_invalid = /^[-.]|[-.]$/.test(new_server);
      // Ensure no consecutive dots (..)
      const consecutive_dots = new_server.includes("..");
      // Length validation
      const too_long = new_server.length > 253;
      const is_valid = is_illegal_chars === -1 && !starts_or_ends_invalid && !consecutive_dots && !too_long;
      return {
        isValid: is_valid,
        illegal_char: is_illegal_chars === -1 ? undefined : new_server[is_illegal_chars]
      };
    }
    /**
     * updates the user GraphDB API according to the choice.
     **/
    updateGraphDBAPI(event) {
      const prev_hostname = this.connection.graphdb.graphdb_api;
      const new_hostname = event.target.value;
      if (this.hostnameIsValid(new_hostname)) {
        this.connection.graphdb.graphdb_api = new_hostname;
        this.oplService.settings.connection.graphdb.graphdb_api = this.connection.graphdb.graphdb_api;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("GraphDB API should be a string!");
        document.getElementById("graphdb-api").value = prev_hostname;
      }
    }
    /**
     * updates the GraphDB username according to the choice.
     **/
    updateGraphDBUsername(event) {
      const prev_username = this.connection.graphdb.username;
      const new_username = event.target.value;
      if (this.usernameIsValid(new_username)) {
        this.connection.graphdb.username = new_username;
        this.oplService.settings.connection.graphdb.username = this.connection.graphdb.username;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Username should not be a null value ");
        document.getElementById("graphdb-user").value = prev_username;
      }
    }
    /**
     * updates the user GraphDB password according to the choice.
     **/
    updateGraphDBPassword(event) {
      const prev_password = this.connection.graphdb.password;
      const new_password = event.target.value;
      if (this.passwordIsValid(new_password)) {
        this.connection.graphdb.password = new_password;
        this.oplService.settings.connection.graphdb.password = this.connection.graphdb.password;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Password should not be a null value");
        document.getElementById("graphdb-password").value = prev_password;
      }
    }
    /**
     * when an organization had disabled users to edit their connection settings,
     * their connections settings should be the organization connection settings (also when the organization settings gets
     * changed, so they should be undefined in the user database (so they will not override the organization's settings)
     **/
    handleDisabledConnectionSettings() {
      const connection = this.oplService.getUndefinedConnectionSettings();
      connection.allow_users = false;
      this.userService.updateUserOplSetting({
        connection: connection
      });
    }
    updateDragSearchAutoMode() {
      this.init.draggableAutocomplete = this.dragSearchAuto;
      const settings = {
        dragSearchAuto: this.dragSearchAuto
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateHaloDefaultMode() {
      this.init.defaultHalo = this.haloDefaultMode;
      const settings = {
        haloDefaultMode: this.haloDefaultMode
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateThingsSizing() {
      this.init.automaticResizing = this.thingsSizing === "Automatic";
      const settings = {
        thingsSizing: this.thingsSizing
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateTutorialMode() {
      const settings = {
        tutorialMode: this.tutorialMode
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateUserNavigatorEnabled() {
      this.init.showNavigator = this.navigatorEnabled;
      const settings = {
        navigatorEnabled: this.navigatorEnabled
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateUserChatEnabled() {
      this.init.showChatPanel = this.chatEnabled;
      const settings = {
        chatEnabled: this.chatEnabled
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updatePythonExecution() {
      this.init.pythonExecution = this.pythonExecution;
      const settings = {
        pythonExecution: this.pythonExecution
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateModelReviewAutomaticSyncing() {
      // Don't update if locked by organization
      if (this.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked) {
        (0, validationAlert)("This setting is locked by your organization", 3000, "Error");
        // Reset to org value
        this.modelReviewAutomaticSyncing = this.oplService.orgOplSettings.modelReviewAutomaticSyncing || "Manual";
        return;
      }
      const settings = {
        modelReviewAutomaticSyncing: this.modelReviewAutomaticSyncing
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(_ => {
        (0, validationAlert)("Saved", null, "Success");
        // Restart sync check with new settings - access via getInitRappidShared
        const initRappid = (0, getInitRappidShared)();
        if (initRappid && initRappid.contextService && initRappid.contextService.startSyncCheck) {
          initRappid.contextService.startSyncCheck();
        }
      });
    }
    isSubscribedToEmails() {
      return !!this.userService.user?.userData.email_subscription;
    }
    isEmailAsSecondAuthFactor() {
      return !!this.userService.user?.userData.emailAsSecondAuthFactor;
    }
    OnChangeEmailSubscription($event) {
      this._isSubscribedToEmails = $event.checked;
      const details = {
        email_subscription: this._isSubscribedToEmails
      };
      this.userService.updateDB(details).then(res => {
        (0, validationAlert)("Preference saved.", null, "Success");
      }).catch(err => {
        (0, validationAlert)("ERROR:" + err, null, "Error");
      });
    }
    OnChangeEmail2FA($event) {
      this._isEmailAsSecondAuthFactor = $event.checked;
      const details = {
        emailAsSecondAuthFactor: this._isEmailAsSecondAuthFactor
      };
      this.userService.updateDB(details).then(res => {
        (0, validationAlert)("Preference saved.", null, "Success");
      }).catch(err => {
        (0, validationAlert)("ERROR:" + err, null, "Error");
      });
    }
    checkIfEmailAsSecondAuthFactorSupported() {
      return environment.serverSideAuth && this.oplService.orgOplSettings.auth2Factors === "optional";
    }
    onBringOptionChange() {
      const settings = {
        bringConnectedSettings: this.init.oplService.settings.bringConnectedSettings
      };
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    onBringSelection($event) {
      $event.stopPropagation();
    }
    toggleBringOption(val) {
      this.init.oplService.settings.bringConnectedSettings[val] = !this.init.oplService.settings.bringConnectedSettings[val];
      this.onBringOptionChange();
    }
    getBringSettingsTitle() {
      const settings = this.init.oplService.settings.bringConnectedSettings;
      let ret = [];
      if (settings.proceduralEnablers) {
        ret.push("Enablers");
      }
      if (settings.proceduralTransformers) {
        ret.push("Transformers");
      }
      if (settings.fundamentals) {
        ret.push("Fundamental");
      }
      if (settings.tagged) {
        ret.push("Tagged");
      }
      if (ret.length === 0) {
        return "Please Choose...";
      }
      return ret.join(", ");
    }
    onChangeGridMode($event) {
      this.gridSettings.state = $event.checked;
      this.init.showGrid = this.gridSettings.state;
      this.init.toggleGrid(false);
      this.init.toggleGrid(false);
      this.onChangeGridSettings();
    }
    onChangeGridColor($event) {
      this.gridSettings.color = $event.target.value;
      this.onChangeGridSettings();
    }
    onChangeGridSettings() {
      const settings = {
        gridSettings: this.gridSettings
      };
      this.init.toggleGrid(false);
      this.init.toggleGrid(false);
      this.userService.updateUserOplSetting(settings).then(_ => (0, validationAlert)("Saved", null, "Success"));
    }
    updateComputingServerURL($event) {
      const newValue = event.target.value;
      if (newValue.startsWith("http://") || newValue.startsWith("https://")) {
        this.connection.calculationsServer.computingServerURL = newValue;
        this.oplService.settings.connection.calculationsServer = this.oplService.settings.connection.calculationsServer || {};
        this.oplService.settings.connection.calculationsServer.computingServerURL = newValue;
        const settings = {
          connection: this.connection
        };
        this.oplService.updateUserSettings(settings);
        this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
      } else {
        (0, validationAlert)("Invalid URL");
      }
    }
    onChangeLocalServerCheckbox($event) {
      const newValue = $event.checked;
      this.connection.calculationsServer.computingServerCalculations = newValue;
      this.oplService.settings.connection.calculationsServer = this.oplService.settings.connection.calculationsServer || {};
      this.oplService.settings.connection.calculationsServer.computingServerCalculations = newValue;
      const settings = {
        connection: this.connection
      };
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)("Saved", null, "Success"));
    }
    static #_ = (() => this.ɵfac = function OpcloudSettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpcloudSettingsComponent)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OpcloudSettingsComponent,
      selectors: [["opcloud-opcloud-settings"]],
      decls: 545,
      vars: 104,
      consts: [["selector", ""], [1, "container"], [1, "opcloudSettingsH2"], ["id", "OpcloudSettingsContent", 1, "OpcloudSettingsContent"], ["id", "lbl1", 1, "Label"], ["id", "intervalValueId", 1, "intervalValue"], ["matInput", "", "ngModel", "uInterval", "name", "uInterval", 3, "ngModelChange", "placeholder", "ngModel"], ["id", "lbl2", 1, "Label"], ["mat-raised-button", "", "id", "saveBtn", 3, "click"], ["id", "lbl3", 1, "Label"], ["id", "UnitsDigitsId", 1, "unitDigitsValue"], ["matInput", "", "type", "number", "min", "0", "required", "", 3, "ngModelChange", "placeholder", "ngModel"], ["mat-raised-button", "", "id", "saveDigitsBtn", 3, "click"], ["id", "lbl4", 1, "Label"], ["id", "CompNumericVal", 1, "unitDigitsValue"], ["matInput", "", "type", "number", "min", "0", "required", "", 3, "ngModelChange", "placeholder", "value", "ngModel"], ["mat-raised-button", "", "id", "saveCompNumericValBtn", 3, "click"], ["id", "lblDisplayedRecentModels", 1, "Label"], [1, "displayed-recent-models-stepper"], ["mat-icon-button", "", "type", "button", "id", "displayedRecentMinus", "aria-label", "Decrease displayed recent models", 1, "displayed-recent-stepper-icon", 3, "click", "disabled"], [1, "displayed-recent-models-value"], ["mat-icon-button", "", "type", "button", "id", "displayedRecentPlus", "aria-label", "Increase displayed recent models", 1, "displayed-recent-stepper-icon", 3, "click", "disabled"], ["mat-raised-button", "", "id", "saveDisplayedRecentModelsBtn", 3, "click"], ["id", "containerTable", 1, "containerTable", 2, "width", "100%"], [1, "opcloudSettingsTR"], [1, "opcloudSettingsTD", 2, "width", "200px"], ["id", "NotesText"], [1, "opcloudSettingsTD"], ["id", "opc-selection-notes", 1, "opc-selection", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value"], ["id", "bringOptions"], [2, "width", "472px", "padding-left", "0"], [2, "display", "flex", "align-items", "center", "height", "60px", "top", "20px", "position", "relative", "margin-left", "10px", "color", "#586D8C"], ["id", "opc-selection-multi", 1, "opc-selection-multi"], [3, "click"], [3, "click", "change", "ngModelChange", "ngModel"], [1, "bringLinkText"], ["id", "OPDnames"], [1, "opc-selection", 3, "ngModelChange", "selectionChange", "ngModel"], ["id", "multiDeletion"], ["id", "dragSearchAuto"], ["id", "thingsSizing"], ["value", "Automatic"], ["value", "Manual"], ["id", "haloDefaultToggle"], ["id", "tutorialMode"], ["id", "navigatorSetting"], ["id", "chatSetting"], ["id", "toggleLogSharingPermission"], ["id", "pythonExecution"], ["value", "local"], ["value", "wsserver"], ["id", "modelReviewAutomaticSyncing"], [1, "opc-selection", 3, "ngModelChange", "selectionChange", "ngModel", "disabled"], ["value", "Disabled"], ["style", "margin-left: 10px; color: #666; font-size: 12px;", 4, "ngIf"], ["id", "emails"], ["hideIcon", "true", 2, "margin-left", "13px", 3, "change", "checked"], ["class", "opcloudSettingsTR", 4, "ngIf"], ["id", "ConnectionSettingsHeader"], [1, "connection-tr"], ["appearance", "outline", 1, "connection-settings"], ["matInput", "", "id", "server-Python-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "port-Python-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "hostname-MySQL-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "port-MySQL-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "username-MySQL-input", 3, "change", "value", "disabled"], ["type", "password", "matInput", "", "id", "password-MySQL-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "schema-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "hostname-WS-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "port-WS-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "server-Ros-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "port-Ros-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "server-Mqtt-input", 3, "change", "value", "disabled"], ["matInput", "", "id", "port-Mqtt-input", 3, "change", "value", "disabled"], [2, "margin-top", "20px"], [2, "padding-top", "15px"], [2, "margin-top", "15px", "color", "#1A3763"], ["hideIcon", "true", 3, "change", "checked"], ["matInput", "", 3, "change", "value"], ["style", "margin-top: 15px;", 4, "ngIf"], ["id", "StyleSettingsHeader"], [2, "display", "grid", "margin-bottom", "25px", "margin-top", "-20px"], [2, "font-weight", "bold"], [2, "margin-top", "15px"], ["style", "display: grid; padding-left: 20px;", 4, "ngIf"], [2, "width", "100px"], [2, "width", "200px"], ["id", "ObjectFontSize"], [1, "style-selection", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["id", "object_font"], ["value", "Arial", 1, "fonts", 2, "font-family", "Arial, Helvetica, sans-serif"], ["value", "Bookman", 1, "fonts", 2, "font-family", "'Bookman Old Style' ,Arial, Helvetica, sans-serif"], ["value", "Comic Sans MS", 1, "fonts", 2, "font-family", "'Comic Sans MS' ,Arial, Helvetica, sans-serif"], ["value", "Cambria", 1, "fonts", 2, "font-family", "Cambria ,Arial, Helvetica, sans-serif"], ["value", "Courier", 1, "fonts", 2, "font-family", "Courier ,Arial, Helvetica, sans-serif"], ["value", "Courier New", 1, "fonts", 2, "font-family", "'Courier New' ,Arial, Helvetica, sans-serif"], ["value", "Garamond", 1, "fonts", 2, "font-family", "Garamond ,Arial, Helvetica, sans-serif"], ["value", "Georgia", 1, "fonts", 2, "font-family", "Georgia ,Arial, Helvetica, sans-serif"], ["value", "Helvetica", 1, "fonts", 2, "font-family", "Helvetica, Arial, sans-serif"], ["value", "Palatino", 1, "fonts", 2, "font-family", "Palatino ,Arial, Helvetica, sans-serif"], ["value", "sans-serif", 1, "fonts", 2, "font-family", "sans-serif ,Arial, Helvetica, sans-serif"], ["value", "serif", 1, "fonts", 2, "font-family", "Serif ,Arial, Helvetica, sans-serif"], ["value", "Times", 1, "fonts", 2, "font-family", "Times ,Arial, Helvetica, sans-serif"], ["value", "Times New Roman", 1, "fonts", 2, "font-family", "'Times New Roman' ,Arial, Helvetica, sans-serif"], ["value", "Trebuchet MS", 1, "fonts", 2, "font-family", "'Trebuchet MS' ,Arial, Helvetica, sans-serif"], ["value", "Verdana", 1, "fonts", 2, "font-family", "Verdana ,Arial, Helvetica, sans-serif"], ["id", "object_text_color"], ["for", "object_text_color"], ["name", "object_text_color", "type", "color", "id", "object_text_color_input", 3, "value"], ["for", "process_text_color"], ["name", "process_text_color", "type", "color", "id", "process_text_color_input", 3, "value"], ["for", "state_text_color"], ["name", "state_text_color", "type", "color", "id", "state_text_color_input", 3, "value"], ["id", "object_fill_Color"], ["for", "object_fill_Color"], ["name", "object_fill_Color", "type", "color", "id", "object_fill_color_input", 3, "value"], ["for", "process_fill_Color"], ["name", "process_fill_Color", "type", "color", "id", "process_fill_color_input", 3, "value"], ["for", "state_fill_Color"], ["name", "state_fill_Color", "type", "color", "id", "state_fill_color_input", 3, "value"], ["id", "object_border_color"], ["for", "object_border_color"], ["name", "object_border_color", "type", "color", "id", "object_border_color_input", 3, "value"], ["for", "process_border_color"], ["name", "process_border_color", "type", "color", "id", "process_border_color_input", 3, "value"], ["for", "state_border_color"], ["name", "state_border_color", "type", "color", "id", "state_border_color_input", 3, "value"], ["mat-raised-button", "", "id", "rtnDfltBTN", 3, "click"], [2, "margin-left", "10px", "color", "#666", "font-size", "12px"], ["matInput", "", "id", "graphdb-api", 3, "change", "value"], ["matInput", "", "id", "graphdb-user", 3, "change", "value"], ["type", "password", "matInput", "", "id", "graphdb-password", 3, "change", "value"], [2, "display", "grid", "padding-left", "20px"], [1, "opcloudSettingsTR", 2, "display", "flex", "align-items", "center", "flex-wrap", "wrap", "gap", "12px", "min-height", "56px"], ["for", "transparentThingsFill"], ["id", "transparentThingsFill", 1, "opc-selection", 3, "ngModelChange", "selectionChange", "ngModel"], ["value", "none"], ["value", "all"], ["value", "inZoomedOpd"], [2, "height", "60px"], [1, "intervalValue"], ["matInput", "", 3, "ngModelChange", "change", "ngModel"], [2, "height", "60px", "display", "flex", "align-items", "center"], ["type", "color", 2, "margin-left", "5px", 3, "change", "value"]],
      template: function OpcloudSettingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "h2", 2);
          core /* ɵɵtext */.EFF(2, "OPCloud Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "label", 4);
          core /* ɵɵtext */.EFF(6, "Set Autosave Time Interval ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "mat-form-field", 5)(8, "mat-label");
          core /* ɵɵtext */.EFF(9);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "input", 6);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_input_ngModelChange_10_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.newInterval, $event)) {
              ctx.newInterval = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "label", 7);
          core /* ɵɵtext */.EFF(12, "Minutes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(13, "button", 8);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_13_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.setUserDefinedInterval());
          });
          core /* ɵɵtext */.EFF(14, "Save ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(15, "br");
          core /* ɵɵelementStart */.j41(16, "label", 9);
          core /* ɵɵtext */.EFF(17, "Time Precision - No. Of Decimal Places To Show: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "mat-form-field", 10)(19, "mat-label");
          core /* ɵɵtext */.EFF(20);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "input", 11);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_input_ngModelChange_21_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.newDigitsNum, $event)) {
              ctx.newDigitsNum = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(22, "button", 12);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_22_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.setUserDefinedDigitsNum());
          });
          core /* ɵɵtext */.EFF(23, "Save ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(24, "br");
          core /* ɵɵelementStart */.j41(25, "label", 13);
          core /* ɵɵtext */.EFF(26, "Numeric Computational Value - No. Of Decimal Places To Show: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(27, "mat-form-field", 14)(28, "mat-label");
          core /* ɵɵtext */.EFF(29);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(30, "input", 15);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_input_ngModelChange_30_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.newCompDigitsNum, $event)) {
              ctx.newCompDigitsNum = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(31, "button", 16);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_31_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.setUserDefinedCompDigitsNum());
          });
          core /* ɵɵtext */.EFF(32, "Save ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(33, "br");
          core /* ɵɵelementStart */.j41(34, "label", 17);
          core /* ɵɵtext */.EFF(35, "Displayed Number of Recent Models: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "span", 18)(37, "button", 19);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_37_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.adjustDisplayedRecentCount(-1));
          });
          core /* ɵɵelementStart */.j41(38, "mat-icon");
          core /* ɵɵtext */.EFF(39, "remove");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(40, "span", 20);
          core /* ɵɵtext */.EFF(41);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(42, "button", 21);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_42_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.adjustDisplayedRecentCount(1));
          });
          core /* ɵɵelementStart */.j41(43, "mat-icon");
          core /* ɵɵtext */.EFF(44, "add");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(45, "button", 22);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_45_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.setUserDisplayedRecentModelsCount());
          });
          core /* ɵɵtext */.EFF(46, "Save ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(47, "br");
          core /* ɵɵelementStart */.j41(48, "table", 23);
          core /* ɵɵelement */.nrm(49, "br")(50, "br");
          core /* ɵɵelementStart */.j41(51, "tr", 24)(52, "td", 25)(53, "label", 26);
          core /* ɵɵtext */.EFF(54, "Notes");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(55, "td", 27)(56, "mat-select", 28);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_56_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.notes, $event)) {
              ctx.notes = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_56_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateNotes());
          });
          core /* ɵɵelementStart */.j41(57, "mat-option", 29);
          core /* ɵɵtext */.EFF(58, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(59, "mat-option", 29);
          core /* ɵɵtext */.EFF(60, "Hide");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(61, "br")(62, "br");
          core /* ɵɵelementStart */.j41(63, "tr", 24)(64, "td", 25)(65, "label", 30);
          core /* ɵɵtext */.EFF(66, "Default For Bring Connected Things");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(67, "td", 27)(68, "mat-form-field", 31)(69, "mat-label", 32);
          core /* ɵɵtext */.EFF(70);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(71, "mat-select", 33, 0)(73, "mat-option", 34);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_option_click_73_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const selector_r2 = core /* ɵɵreference */.sdS(72);
            selector_r2.open();
            return core /* ɵɵresetView */.Njj(ctx.toggleBringOption("proceduralEnablers"));
          });
          core /* ɵɵelementStart */.j41(74, "mat-checkbox", 35);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_checkbox_click_74_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringSelection($event));
          })("change", function OpcloudSettingsComponent_Template_mat_checkbox_change_74_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringOptionChange());
          });
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_checkbox_ngModelChange_74_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.init.oplService.settings.bringConnectedSettings.proceduralEnablers, $event)) {
              ctx.init.oplService.settings.bringConnectedSettings.proceduralEnablers = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(75, "span", 36);
          core /* ɵɵtext */.EFF(76, "Procedural Enabling Links");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(77, "mat-option", 34);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_option_click_77_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const selector_r2 = core /* ɵɵreference */.sdS(72);
            selector_r2.open();
            return core /* ɵɵresetView */.Njj(ctx.toggleBringOption("proceduralTransformers"));
          });
          core /* ɵɵelementStart */.j41(78, "mat-checkbox", 35);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_checkbox_click_78_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringSelection($event));
          })("change", function OpcloudSettingsComponent_Template_mat_checkbox_change_78_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringOptionChange());
          });
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_checkbox_ngModelChange_78_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.init.oplService.settings.bringConnectedSettings.proceduralTransformers, $event)) {
              ctx.init.oplService.settings.bringConnectedSettings.proceduralTransformers = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(79, "span", 36);
          core /* ɵɵtext */.EFF(80, "Procedural Transforming Links");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(81, "mat-option", 34);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_option_click_81_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const selector_r2 = core /* ɵɵreference */.sdS(72);
            selector_r2.open();
            return core /* ɵɵresetView */.Njj(ctx.toggleBringOption("fundamentals"));
          });
          core /* ɵɵelementStart */.j41(82, "mat-checkbox", 35);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_checkbox_click_82_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringSelection($event));
          })("change", function OpcloudSettingsComponent_Template_mat_checkbox_change_82_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringOptionChange());
          });
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_checkbox_ngModelChange_82_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.init.oplService.settings.bringConnectedSettings.fundamentals, $event)) {
              ctx.init.oplService.settings.bringConnectedSettings.fundamentals = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(83, "span", 36);
          core /* ɵɵtext */.EFF(84, "Fundamental Structural Links");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(85, "mat-option", 34);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_option_click_85_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const selector_r2 = core /* ɵɵreference */.sdS(72);
            selector_r2.open();
            return core /* ɵɵresetView */.Njj(ctx.toggleBringOption("tagged"));
          });
          core /* ɵɵelementStart */.j41(86, "mat-checkbox", 35);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_mat_checkbox_click_86_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringSelection($event));
          })("change", function OpcloudSettingsComponent_Template_mat_checkbox_change_86_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onBringOptionChange());
          });
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_checkbox_ngModelChange_86_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.init.oplService.settings.bringConnectedSettings.tagged, $event)) {
              ctx.init.oplService.settings.bringConnectedSettings.tagged = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(87, "span", 36);
          core /* ɵɵtext */.EFF(88, "Tagged Structural Links");
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelement */.nrm(89, "br")(90, "br");
          core /* ɵɵelementStart */.j41(91, "tr", 24)(92, "td", 25)(93, "label", 37);
          core /* ɵɵtext */.EFF(94, "OPD names");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(95, "td", 27)(96, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_96_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.sdNames, $event)) {
              ctx.sdNames = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_96_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateOPDnames());
          });
          core /* ɵɵelementStart */.j41(97, "mat-option", 29);
          core /* ɵɵtext */.EFF(98, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(99, "mat-option", 29);
          core /* ɵɵtext */.EFF(100, "Hide");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(101, "br")(102, "br");
          core /* ɵɵelementStart */.j41(103, "tr", 24)(104, "td", 25)(105, "label", 39);
          core /* ɵɵtext */.EFF(106, "Multi Deletion");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(107, "td", 27)(108, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_108_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.multiDeletion, $event)) {
              ctx.multiDeletion = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_108_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateUserMultiDeletion());
          });
          core /* ɵɵelementStart */.j41(109, "mat-option", 29);
          core /* ɵɵtext */.EFF(110, "Enabled");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(111, "mat-option", 29);
          core /* ɵɵtext */.EFF(112, "Disabled");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(113, "br")(114, "br");
          core /* ɵɵelementStart */.j41(115, "tr", 24)(116, "td", 25)(117, "label", 40);
          core /* ɵɵtext */.EFF(118, "Draggable Things Search Autocomplete");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(119, "td", 27)(120, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_120_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.dragSearchAuto, $event)) {
              ctx.dragSearchAuto = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_120_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateDragSearchAutoMode());
          });
          core /* ɵɵelementStart */.j41(121, "mat-option", 29);
          core /* ɵɵtext */.EFF(122, "On");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(123, "mat-option", 29);
          core /* ɵɵtext */.EFF(124, "Off");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(125, "br")(126, "br");
          core /* ɵɵelementStart */.j41(127, "tr", 24)(128, "td", 25)(129, "label", 41);
          core /* ɵɵtext */.EFF(130, "Things Sizing");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(131, "td", 27)(132, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_132_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.thingsSizing, $event)) {
              ctx.thingsSizing = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_132_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateThingsSizing());
          });
          core /* ɵɵelementStart */.j41(133, "mat-option", 42);
          core /* ɵɵtext */.EFF(134, "Automatic");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(135, "mat-option", 43);
          core /* ɵɵtext */.EFF(136, "Manual");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(137, "br")(138, "br");
          core /* ɵɵelementStart */.j41(139, "tr", 24)(140, "td", 25)(141, "label", 44);
          core /* ɵɵtext */.EFF(142, "Halo Default Toggle Mode");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(143, "td", 27)(144, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_144_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.haloDefaultMode, $event)) {
              ctx.haloDefaultMode = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_144_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateHaloDefaultMode());
          });
          core /* ɵɵelementStart */.j41(145, "mat-option", 29);
          core /* ɵɵtext */.EFF(146, "Closed");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(147, "mat-option", 29);
          core /* ɵɵtext */.EFF(148, "Open");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(149, "br")(150, "br");
          core /* ɵɵelementStart */.j41(151, "tr", 24)(152, "td", 25)(153, "label", 45);
          core /* ɵɵtext */.EFF(154, "Tutorial Mode");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(155, "td", 27)(156, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_156_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.tutorialMode, $event)) {
              ctx.tutorialMode = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_156_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateTutorialMode());
          });
          core /* ɵɵelementStart */.j41(157, "mat-option", 29);
          core /* ɵɵtext */.EFF(158, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(159, "mat-option", 29);
          core /* ɵɵtext */.EFF(160, "Hide");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(161, "br")(162, "br");
          core /* ɵɵelementStart */.j41(163, "tr", 24)(164, "td", 25)(165, "label", 46);
          core /* ɵɵtext */.EFF(166, "Model Navigator");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(167, "td", 27)(168, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_168_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.navigatorEnabled, $event)) {
              ctx.navigatorEnabled = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_168_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateUserNavigatorEnabled());
          });
          core /* ɵɵelementStart */.j41(169, "mat-option", 29);
          core /* ɵɵtext */.EFF(170, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(171, "mat-option", 29);
          core /* ɵɵtext */.EFF(172, "Hide");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(173, "br")(174, "br");
          core /* ɵɵelementStart */.j41(175, "tr", 24)(176, "td", 25)(177, "label", 47);
          core /* ɵɵtext */.EFF(178, "Models Chat");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(179, "td", 27)(180, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_180_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.chatEnabled, $event)) {
              ctx.chatEnabled = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_180_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateUserChatEnabled());
          });
          core /* ɵɵelementStart */.j41(181, "mat-option", 29);
          core /* ɵɵtext */.EFF(182, "Show");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(183, "mat-option", 29);
          core /* ɵɵtext */.EFF(184, "Hide");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(185, "br")(186, "br");
          core /* ɵɵelementStart */.j41(187, "tr", 24)(188, "td", 27)(189, "label", 48);
          core /* ɵɵtext */.EFF(190, "Log Sharing");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(191, "td", 27)(192, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_192_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.logSharingPermission, $event)) {
              ctx.logSharingPermission = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_192_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateLogSharingPermission());
          });
          core /* ɵɵelementStart */.j41(193, "mat-option", 29);
          core /* ɵɵtext */.EFF(194, "Enabled");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(195, "mat-option", 29);
          core /* ɵɵtext */.EFF(196, "Disabled");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(197, "br")(198, "br");
          core /* ɵɵelementStart */.j41(199, "tr", 24)(200, "td", 25)(201, "label", 49);
          core /* ɵɵtext */.EFF(202, "Python Computational Processes Execution");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(203, "td", 27)(204, "mat-select", 38);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_204_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.pythonExecution, $event)) {
              ctx.pythonExecution = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_204_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updatePythonExecution());
          });
          core /* ɵɵelementStart */.j41(205, "mat-option", 50);
          core /* ɵɵtext */.EFF(206, "In Browser");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(207, "mat-option", 51);
          core /* ɵɵtext */.EFF(208, "WebSocket Server");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(209, "br")(210, "br");
          core /* ɵɵelementStart */.j41(211, "tr", 24)(212, "td", 25)(213, "label", 52);
          core /* ɵɵtext */.EFF(214, "Model Review Automatic Syncing");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(215, "td", 27)(216, "mat-select", 53);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_216_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.modelReviewAutomaticSyncing, $event)) {
              ctx.modelReviewAutomaticSyncing = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_216_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateModelReviewAutomaticSyncing());
          });
          core /* ɵɵelementStart */.j41(217, "mat-option", 42);
          core /* ɵɵtext */.EFF(218, "Automatic");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(219, "mat-option", 43);
          core /* ɵɵtext */.EFF(220, "Manual");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(221, "mat-option", 54);
          core /* ɵɵtext */.EFF(222, "Disabled");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(223, OpcloudSettingsComponent_span_223_Template, 2, 0, "span", 55);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(224, "br")(225, "br");
          core /* ɵɵelementStart */.j41(226, "tr", 24)(227, "td", 27)(228, "label", 56);
          core /* ɵɵtext */.EFF(229, "OPCloud Information Emails");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(230, "td", 27)(231, "mat-slide-toggle", 57);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_mat_slide_toggle_change_231_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.OnChangeEmailSubscription($event));
          });
          core /* ɵɵtext */.EFF(232);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(233, "br")(234, "br");
          core /* ɵɵtemplate */.DNE(235, OpcloudSettingsComponent_tr_235_Template, 7, 2, "tr", 58);
          core /* ɵɵelement */.nrm(236, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(237, "br")(238, "br");
          core /* ɵɵelementStart */.j41(239, "span")(240, "h2", 59);
          core /* ɵɵtext */.EFF(241, "External Connections Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(242, "table")(243, "thead")(244, "th");
          core /* ɵɵtext */.EFF(245, "Python");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(246, "tbody")(247, "tr", 60)(248, "td");
          core /* ɵɵtext */.EFF(249, "Server ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(250, "td")(251, "mat-form-field", 61)(252, "input", 62);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_252_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updatePythonServer($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(253, "tr", 60)(254, "td");
          core /* ɵɵtext */.EFF(255, "Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(256, "td")(257, "mat-form-field", 61)(258, "input", 63);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_258_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updatePythonPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(259, "table")(260, "thead")(261, "th");
          core /* ɵɵtext */.EFF(262, "MySQL Connection");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(263, "tbody")(264, "tr", 60)(265, "td");
          core /* ɵɵtext */.EFF(266, "MySQL Hostname ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(267, "td")(268, "mat-form-field", 61)(269, "input", 64);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_269_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLHostname($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(270, "tr", 60)(271, "td");
          core /* ɵɵtext */.EFF(272, "MySQL Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(273, "td")(274, "mat-form-field", 61)(275, "input", 65);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_275_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(276, "tr", 60)(277, "td");
          core /* ɵɵtext */.EFF(278, "MySQL Username ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(279, "td")(280, "mat-form-field", 61)(281, "input", 66);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_281_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLUsername($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(282, "tr", 60)(283, "td");
          core /* ɵɵtext */.EFF(284, "MySQL Password ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(285, "td")(286, "mat-form-field", 61)(287, "input", 67);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_287_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLPassword($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(288, "tr", 60)(289, "td");
          core /* ɵɵtext */.EFF(290, " Schema ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(291, "td")(292, "mat-form-field", 61)(293, "input", 68);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_293_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMySQLSchema($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(294, "tr", 60)(295, "td");
          core /* ɵɵtext */.EFF(296, "WS Hostname ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(297, "td")(298, "mat-form-field", 61)(299, "input", 69);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_299_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateWSHostname($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(300, "tr", 60)(301, "td");
          core /* ɵɵtext */.EFF(302, "WS Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(303, "td")(304, "mat-form-field", 61)(305, "input", 70);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_305_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateWSPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(306, "table")(307, "thead")(308, "th");
          core /* ɵɵtext */.EFF(309, "ROS");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(310, "tbody")(311, "tr", 60)(312, "td");
          core /* ɵɵtext */.EFF(313, "Server ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(314, "td")(315, "mat-form-field", 61)(316, "input", 71);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_316_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateRosServer($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(317, "tr", 60)(318, "td");
          core /* ɵɵtext */.EFF(319, "Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(320, "td")(321, "mat-form-field", 61)(322, "input", 72);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_322_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateRosPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(323, "table")(324, "thead")(325, "th");
          core /* ɵɵtext */.EFF(326, "MQTT");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(327, "tbody")(328, "tr", 60)(329, "td");
          core /* ɵɵtext */.EFF(330, "Server ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(331, "td")(332, "mat-form-field", 61)(333, "input", 73);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_333_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMqttServer($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(334, "tr", 60)(335, "td");
          core /* ɵɵtext */.EFF(336, "Port ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(337, "td")(338, "mat-form-field", 61)(339, "input", 74);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_339_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateMqttPort($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(340, "table", 75)(341, "thead")(342, "th");
          core /* ɵɵtext */.EFF(343, "Enhanced Computing Calculation Server");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(344, "tbody")(345, "tr", 60)(346, "td", 76);
          core /* ɵɵtext */.EFF(347, "Calculations Target ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(348, "td", 76)(349, "span", 77)(350, "mat-slide-toggle", 78);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_mat_slide_toggle_change_350_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onChangeLocalServerCheckbox($event));
          });
          core /* ɵɵtext */.EFF(351);
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(352, "tr", 60)(353, "td");
          core /* ɵɵtext */.EFF(354, "URL ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(355, "td")(356, "mat-form-field", 61)(357, "input", 79);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_input_change_357_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateComputingServerURL($event));
          });
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵtemplate */.DNE(358, OpcloudSettingsComponent_table_358_Template, 23, 3, "table", 80);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(359, "br")(360, "br");
          core /* ɵɵelementStart */.j41(361, "h2", 81);
          core /* ɵɵtext */.EFF(362, "Style Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(363, "div", 82)(364, "span", 83);
          core /* ɵɵtext */.EFF(365, "Grid Settings");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(366, "span", 84);
          core /* ɵɵtext */.EFF(367, " Mode: ");
          core /* ɵɵelementStart */.j41(368, "mat-slide-toggle", 78);
          core /* ɵɵlistener */.bIt("change", function OpcloudSettingsComponent_Template_mat_slide_toggle_change_368_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onChangeGridMode($event));
          });
          core /* ɵɵtext */.EFF(369);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(370, OpcloudSettingsComponent_div_370_Template, 26, 5, "div", 85);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(371, "table")(372, "thead")(373, "tr")(374, "th", 86);
          core /* ɵɵtext */.EFF(375, "Categories");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(376, "th", 87);
          core /* ɵɵtext */.EFF(377, " Object Style Settings ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(378, "th", 87);
          core /* ɵɵtext */.EFF(379, " Process Style Settings ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(380, "th", 87);
          core /* ɵɵtext */.EFF(381, " State Style Settings ");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(382, "tbody")(383, "tr")(384, "td", 87)(385, "label", 88);
          core /* ɵɵtext */.EFF(386, "Font size");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(387, "td")(388, "mat-select", 89);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_388_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.object.font_size, $event)) {
              ctx.style.object.font_size = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_388_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateObjectFontSize());
          });
          core /* ɵɵtemplate */.DNE(389, OpcloudSettingsComponent_mat_option_389_Template, 2, 2, "mat-option", 90);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(390, "td")(391, "mat-select", 89);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_391_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.process.font_size, $event)) {
              ctx.style.process.font_size = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_391_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateProcessFontSize());
          });
          core /* ɵɵtemplate */.DNE(392, OpcloudSettingsComponent_mat_option_392_Template, 2, 2, "mat-option", 90);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(393, "td")(394, "mat-select", 89);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_394_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.state.font_size, $event)) {
              ctx.style.state.font_size = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_394_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateStateFontSize());
          });
          core /* ɵɵtemplate */.DNE(395, OpcloudSettingsComponent_mat_option_395_Template, 2, 2, "mat-option", 90);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(396, "tr")(397, "td", 87)(398, "label", 91);
          core /* ɵɵtext */.EFF(399, "Font");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(400, "td")(401, "mat-select", 89);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_401_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.object.font, $event)) {
              ctx.style.object.font = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_401_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateObjectFont());
          });
          core /* ɵɵelementStart */.j41(402, "mat-option", 92);
          core /* ɵɵtext */.EFF(403, "Arial");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(404, "mat-option", 93);
          core /* ɵɵtext */.EFF(405, "Bookman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(406, "mat-option", 94);
          core /* ɵɵtext */.EFF(407, "Comic Sans MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(408, "mat-option", 95);
          core /* ɵɵtext */.EFF(409, "Cambria");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(410, "mat-option", 96);
          core /* ɵɵtext */.EFF(411, "Courier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(412, "mat-option", 97);
          core /* ɵɵtext */.EFF(413, "Courier New");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(414, "mat-option", 98);
          core /* ɵɵtext */.EFF(415, "Garamond");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(416, "mat-option", 99);
          core /* ɵɵtext */.EFF(417, "Georgia");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(418, "mat-option", 100);
          core /* ɵɵtext */.EFF(419, "Helvetica");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(420, "mat-option", 101);
          core /* ɵɵtext */.EFF(421, "Palatino");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(422, "mat-option", 102);
          core /* ɵɵtext */.EFF(423, "sans-serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(424, "mat-option", 103);
          core /* ɵɵtext */.EFF(425, "serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(426, "mat-option", 104);
          core /* ɵɵtext */.EFF(427, "Times");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(428, "mat-option", 105);
          core /* ɵɵtext */.EFF(429, "Times New Roman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(430, "mat-option", 106);
          core /* ɵɵtext */.EFF(431, "Trebuchet MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(432, "mat-option", 107);
          core /* ɵɵtext */.EFF(433, "Verdana");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(434, "td")(435, "mat-select", 89);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_435_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.process.font, $event)) {
              ctx.style.process.font = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_435_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateProcessFont());
          });
          core /* ɵɵelementStart */.j41(436, "mat-option", 92);
          core /* ɵɵtext */.EFF(437, "Arial");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(438, "mat-option", 93);
          core /* ɵɵtext */.EFF(439, "Bookman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(440, "mat-option", 94);
          core /* ɵɵtext */.EFF(441, "Comic Sans MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(442, "mat-option", 95);
          core /* ɵɵtext */.EFF(443, "Cambria");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(444, "mat-option", 96);
          core /* ɵɵtext */.EFF(445, "Courier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(446, "mat-option", 97);
          core /* ɵɵtext */.EFF(447, "Courier New");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(448, "mat-option", 98);
          core /* ɵɵtext */.EFF(449, "Garamond");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(450, "mat-option", 99);
          core /* ɵɵtext */.EFF(451, "Georgia");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(452, "mat-option", 100);
          core /* ɵɵtext */.EFF(453, "Helvetica");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(454, "mat-option", 101);
          core /* ɵɵtext */.EFF(455, "Palatino");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(456, "mat-option", 102);
          core /* ɵɵtext */.EFF(457, "sans-serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(458, "mat-option", 103);
          core /* ɵɵtext */.EFF(459, "serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(460, "mat-option", 104);
          core /* ɵɵtext */.EFF(461, "Times");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(462, "mat-option", 105);
          core /* ɵɵtext */.EFF(463, "Times New Roman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(464, "mat-option", 106);
          core /* ɵɵtext */.EFF(465, "Trebuchet MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(466, "mat-option", 107);
          core /* ɵɵtext */.EFF(467, "Verdana");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(468, "td")(469, "mat-select", 89);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OpcloudSettingsComponent_Template_mat_select_ngModelChange_469_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.style.state.font, $event)) {
              ctx.style.state.font = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("selectionChange", function OpcloudSettingsComponent_Template_mat_select_selectionChange_469_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.updateStateFont());
          });
          core /* ɵɵelementStart */.j41(470, "mat-option", 92);
          core /* ɵɵtext */.EFF(471, "Arial");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(472, "mat-option", 93);
          core /* ɵɵtext */.EFF(473, "Bookman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(474, "mat-option", 94);
          core /* ɵɵtext */.EFF(475, "Comic Sans MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(476, "mat-option", 95);
          core /* ɵɵtext */.EFF(477, "Cambria");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(478, "mat-option", 96);
          core /* ɵɵtext */.EFF(479, "Courier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(480, "mat-option", 97);
          core /* ɵɵtext */.EFF(481, "Courier New");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(482, "mat-option", 98);
          core /* ɵɵtext */.EFF(483, "Garamond");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(484, "mat-option", 99);
          core /* ɵɵtext */.EFF(485, "Georgia");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(486, "mat-option", 100);
          core /* ɵɵtext */.EFF(487, "Helvetica");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(488, "mat-option", 101);
          core /* ɵɵtext */.EFF(489, "Palatino");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(490, "mat-option", 102);
          core /* ɵɵtext */.EFF(491, "sans-serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(492, "mat-option", 103);
          core /* ɵɵtext */.EFF(493, "serif");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(494, "mat-option", 104);
          core /* ɵɵtext */.EFF(495, "Times");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(496, "mat-option", 105);
          core /* ɵɵtext */.EFF(497, "Times New Roman");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(498, "mat-option", 106);
          core /* ɵɵtext */.EFF(499, "Trebuchet MS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(500, "mat-option", 107);
          core /* ɵɵtext */.EFF(501, "Verdana");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(502, "tr")(503, "td", 87)(504, "label", 108);
          core /* ɵɵtext */.EFF(505, "Text Color");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(506, "td")(507, "label", 109);
          core /* ɵɵelement */.nrm(508, "input", 110);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(509, "td")(510, "label", 111);
          core /* ɵɵelement */.nrm(511, "input", 112);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(512, "td")(513, "label", 113);
          core /* ɵɵelement */.nrm(514, "input", 114);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(515, "tr")(516, "td", 87)(517, "label", 115);
          core /* ɵɵtext */.EFF(518, "Fill Color");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(519, "td")(520, "label", 116);
          core /* ɵɵelement */.nrm(521, "input", 117);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(522, "td")(523, "label", 118);
          core /* ɵɵelement */.nrm(524, "input", 119);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(525, "td")(526, "label", 120);
          core /* ɵɵelement */.nrm(527, "input", 121);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(528, "tr")(529, "td", 87)(530, "label", 122);
          core /* ɵɵtext */.EFF(531, "Border Color");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(532, "td")(533, "label", 123);
          core /* ɵɵelement */.nrm(534, "input", 124);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(535, "td")(536, "label", 125);
          core /* ɵɵelement */.nrm(537, "input", 126);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(538, "td")(539, "label", 127);
          core /* ɵɵelement */.nrm(540, "input", 128);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(541, "br")(542, "br");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(543, "button", 129);
          core /* ɵɵlistener */.bIt("click", function OpcloudSettingsComponent_Template_button_click_543_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.ReturnToDefault());
          });
          core /* ɵɵtext */.EFF(544, "Reset to default");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtextInterpolate */.JRh(ctx.defaultInterval.toString());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.defaultInterval.toString());
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.newInterval);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtextInterpolate */.JRh(ctx.defaultDigitsNum.toString());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.defaultDigitsNum.toString());
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.newDigitsNum);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtextInterpolate */.JRh(ctx.defaultCompDigitsNum.toString());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.defaultCompDigitsNum);
          core /* ɵɵproperty */.Y8G("placeholder", ctx.defaultCompDigitsNum.toString());
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.newCompDigitsNum);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("disabled", ctx.newDisplayedRecentCount <= 5);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate */.JRh(ctx.newDisplayedRecentCount);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("disabled", ctx.newDisplayedRecentCount >= 10);
          core /* ɵɵadvance */.R7$(14);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.notes);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵtextInterpolate */.JRh(ctx.getBringSettingsTitle());
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.init.oplService.settings.bringConnectedSettings.proceduralEnablers);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.init.oplService.settings.bringConnectedSettings.proceduralTransformers);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.init.oplService.settings.bringConnectedSettings.fundamentals);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.init.oplService.settings.bringConnectedSettings.tagged);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.sdNames);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.multiDeletion);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.dragSearchAuto);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.thingsSizing);
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.haloDefaultMode);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.tutorialMode);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.navigatorEnabled);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.chatEnabled);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.logSharingPermission);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", true);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("value", false);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.pythonExecution);
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.modelReviewAutomaticSyncing);
          core /* ɵɵproperty */.Y8G("disabled", ctx.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("checked", ctx._isSubscribedToEmails);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx._isSubscribedToEmails ? "Subscribed" : "Unsubscribed", " ");
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx._isEmailAsSecondAuthFactorSupported);
          core /* ɵɵadvance */.R7$(17);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.python.server);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.python.port);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.hostname);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.port);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.username);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.password);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.schema);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.ws_hostname);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mysql.ws_port);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.ros.server);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.ros.port);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mqtt.server);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.mqtt.port);
          core /* ɵɵpropertyInterpolate */.FS9("disabled", !ctx.connection.allow_users);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("checked", ctx.connection.calculationsServer.computingServerCalculations);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.connection.calculationsServer.computingServerCalculations ? "Server Calculations" : "Local Browser Calculations");
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.connection.calculationsServer.computingServerURL);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.userService.isInsightsUser(ctx.currentUser));
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("checked", ctx.gridSettings.state);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.gridSettings.state ? "On" : "Off");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.gridSettings.state);
          core /* ɵɵadvance */.R7$(18);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.object.font_size);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.font_sizes_options);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.process.font_size);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.font_sizes_options);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.state.font_size);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.font_sizes_options);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.object.font);
          core /* ɵɵadvance */.R7$(34);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.process.font);
          core /* ɵɵadvance */.R7$(34);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.style.state.font);
          core /* ɵɵadvance */.R7$(39);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.object.text_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.process.text_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.state.text_color);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.object.fill_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.process.fill_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.state.fill_color);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.object.border_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.process.border_color);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.style.state.border_color);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatIcon, MatSelect, MatOption, MatButton, MatIconButton, MatCheckbox, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, RequiredValidator, MinValidator, NgModel, MatSlideToggle],
      styles: [".container[_ngcontent-%COMP%]{position:relative;padding-left:50px;top:50px}.container[_ngcontent-%COMP%]   .mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.container[_ngcontent-%COMP%]   .opcloudSettingsH2[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;margin-bottom:46px;color:#1a3763}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]{color:#1a3763}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .Label[_ngcontent-%COMP%]{top:-6px;position:relative;left:3px;color:#1a3763}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #lbl1[_ngcontent-%COMP%]{margin-right:32px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #lbl2[_ngcontent-%COMP%]{margin-left:16px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(#lb13, #lb14)[_ngcontent-%COMP%]{margin-right:32px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .intervalValue[_ngcontent-%COMP%]{position:relative;height:46px;width:57px;margin-bottom:25px;border:1px solid rgba(73,114,132,.2);border-radius:6px;text-align:center}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #saveBtn[_ngcontent-%COMP%]{position:relative;left:210px;width:102px;height:53px;background:#1a3763;color:#fff;text-align:center;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;letter-spacing:normal}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #saveDisplayedRecentModelsBtn[_ngcontent-%COMP%]{position:relative;left:198px;width:102px;height:53px;background:#1a3763;color:#fff;text-align:center;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;letter-spacing:normal}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #saveDigitsBtn[_ngcontent-%COMP%]{position:relative;left:138px;width:102px;height:53px;background:#1a3763;color:#fff;text-align:center;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;letter-spacing:normal}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #saveCompNumericValBtn[_ngcontent-%COMP%]{position:relative;left:32px;width:102px;height:53px;background:#1a3763;color:#fff;text-align:center;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;letter-spacing:normal}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   #lblDisplayedRecentModels[_ngcontent-%COMP%]{display:inline-block;vertical-align:middle;margin-top:8px;margin-bottom:8px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .displayed-recent-models-stepper[_ngcontent-%COMP%]{display:inline-flex;align-items:center;vertical-align:middle;margin-left:8px;margin-bottom:8px;border:1px solid rgba(73,114,132,.2);border-radius:6px;padding:0 2px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .displayed-recent-models-value[_ngcontent-%COMP%]{min-width:28px;text-align:center;font-weight:500;color:#1a3763}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .displayed-recent-models-stepper[_ngcontent-%COMP%]   .displayed-recent-stepper-icon.mat-mdc-icon-button[_ngcontent-%COMP%]{--mdc-icon-button-state-layer-size: 32px;width:32px;height:32px;min-width:32px;padding:0;line-height:32px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(.displayed-recent-models-stepper   .displayed-recent-stepper-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], .displayed-recent-models-stepper[_ngcontent-%COMP%]   .displayed-recent-stepper-icon[_ngcontent-%COMP%]   mat-icon)[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;line-height:18px;color:#1a3763}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .unitDigitsValue[_ngcontent-%COMP%]{position:relative;height:46px;width:57px;margin-bottom:25px;border:1px solid rgba(73,114,132,.2);border-radius:6px;text-align:center;margin-left:16px}.container[_ngcontent-%COMP%]   .OpcloudSettingsContent[_ngcontent-%COMP%]   .containerTable[_ngcontent-%COMP%]{position:relative}[_nghost-%COMP%]     .displayed-recent-models-stepper .displayed-recent-stepper-icon.mat-mdc-icon-button{--mdc-icon-button-state-layer-size: 32px}[_nghost-%COMP%]     .displayed-recent-models-stepper .mat-mdc-button-touch-target{width:32px!important;height:32px!important}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.arrow[_ngcontent-%COMP%]{position:relative;left:445px;z-index:3}select[_ngcontent-%COMP%]::-ms-expand{display:none}#styleSettingsHeading[_ngcontent-%COMP%]{font-size:18px;color:#1a3763}ul[_ngcontent-%COMP%], li[_ngcontent-%COMP%]{list-style:none}.style-selection[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.2);padding-left:8px;width:190px;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:43px;font-size:16px;background-color:#fff;color:#586d8c!important;height:46px}.style-selection[_ngcontent-%COMP%]   .mat-mdc-select-arrow[_ngcontent-%COMP%]{color:transparent;width:24px;height:9px;content:url(/assets/SVG/arrow.svg)}.style-selection[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]{border-top:1em}.style-selection[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]   .mat-mdc-input-element[_ngcontent-%COMP%]{color:#586d8c!important}#rtnDfltBTN[_ngcontent-%COMP%]{position:relative;left:240px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal}.connection-settings[_ngcontent-%COMP%]{background-color:#fff;color:#586d8c!important;font-family:Roboto,Helvetica Neue,sans-serif;height:100%;--mdc-outlined-text-field-outline-color:rgba(0, 0, 0, .15) !important}.connection-settings[_ngcontent-%COMP%]   .mdc-text-field__input[_ngcontent-%COMP%]{color:#586d8c!important}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{padding-top:0;margin-top:0;padding-bottom:0;margin-bottom:0;border-radius:initial}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]{border-top:1em;padding-left:12px!important}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]   .mat-mdc-input-element[_ngcontent-%COMP%]{color:#586d8c!important}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}th[_ngcontent-%COMP%]{text-align:start}[_nghost-%COMP%]   .connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{padding-top:0;margin-top:0;padding-bottom:0;margin-bottom:0;border-radius:initial}[_nghost-%COMP%]   .connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%]{border-top:1em}.connection-settings[_ngcontent-%COMP%]   .mat-mdc-form-field-appearance-outline[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{margin:0}.mat-mdc-slide-toggle.mat-checked[_ngcontent-%COMP%]   .mat-mdc-slide-toggle-bar[_ngcontent-%COMP%]{background-color:#c1ddff!important}mat-mdc-slide-toggle.mat-checked[_ngcontent-%COMP%]   .mat-mdc-slide-toggle-thumb[_ngcontent-%COMP%]{background-color:#0075ff!important}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}.bringLinkText[_ngcontent-%COMP%]{margin-left:5px}"]
    }))();
  }
  return OpcloudSettingsComponent;
})();