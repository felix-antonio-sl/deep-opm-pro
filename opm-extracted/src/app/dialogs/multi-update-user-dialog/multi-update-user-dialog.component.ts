// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/multi-update-user-dialog/multi-update-user-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const multi_update_user_dialog_component_c0 = () => ({
  standalone: true
});
function MultiUpdateUserDialogComponent_tr_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Multi-Factor Authentication:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-checkbox", 9);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_7_Template_mat_checkbox_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.multiFactorChange($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.hasMultiFactorAuth);
  }
}
function MultiUpdateUserDialogComponent_tr_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td", 10)(2, "mat-form-field", 11)(3, "input", 12);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function MultiUpdateUserDialogComponent_tr_8_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.details.multiFactorAuth, $event)) {
        ctx_r1.details.multiFactorAuth = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.details.multiFactorAuth);
    core /* ɵɵproperty */.Y8G("ngModelOptions", core /* ɵɵpureFunction0 */.lJ4(2, multi_update_user_dialog_component_c0));
  }
}
function MultiUpdateUserDialogComponent_tr_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "System Admin:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_9_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeAdminStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.SysAdmin);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.SysAdmin, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Organization Admin:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_10_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeOrgStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.OrgAdmin);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.OrgAdmin, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, " → Users Management:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_11_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeUsersManagementStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.usersManagement);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", !!ctx_r1.details.usersManagement, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "OPM Insights User:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_12_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeIsInsightsUserStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.IsInsightsUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.IsInsightsUser, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "DSM Analysis User:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_13_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeIsDSMUserStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.IsDSMUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.IsDSMUser, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Execution User:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_14_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeExecutionUser($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.isExecutionUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.isExecutionUser, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "GenerativeAI Account:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_15_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeIsGenAIUserStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.IsGenAIUser);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.IsGenAIUser, " ");
  }
}
function MultiUpdateUserDialogComponent_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Viewer Account:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 13);
    core /* ɵɵlistener */.bIt("change", function MultiUpdateUserDialogComponent_tr_16_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r11);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeViewerAccount($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.isViewerAccount);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.isViewerAccount, " ");
  }
}
let MultiUpdateUserDialogComponent = /*#__PURE__*/(() => {
  class MultiUpdateUserDialogComponent {
    constructor(data, dialogRef, orgService) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.orgService = orgService;
      this.details = {
        Name: undefined,
        Email: undefined,
        PhotoURL: undefined,
        SysAdmin: undefined,
        OrgAdmin: undefined,
        IsInsightsUser: undefined,
        IsDSMUser: undefined,
        IsGenAIUser: undefined,
        exp_date: undefined,
        isActive: undefined,
        usersManagement: undefined,
        isExecutionUser: undefined,
        isViewerAccount: undefined,
        multiFactorAuth: undefined
      };
      this.isSysAdmin = data.isSysAdmin;
      this.isOrgAdmin = data.isOrgAdmin;
      this.usersManagement = data.usersManagement;
      this.userCount = data.userCount;
      this.organization = data.organization;
      this.serverAuth = environment.serverSideAuth;
    }
    ngOnInit() {
      // Get organization defaults
      this.orgService.getOrganization(this.organization).then(settings => {
        this.isOrgSupportMFA = ["optional", "mandatory"].includes(settings.auth2Factors);
        // Set default values from organization settings
        if (settings.defaultUserOptions) {
          this.details.IsInsightsUser = settings.defaultUserOptions.insightsUser;
          this.details.IsDSMUser = settings.defaultUserOptions.dsmUser;
          this.details.isExecutionUser = settings.defaultUserOptions.executionUser;
          this.details.isViewerAccount = settings.defaultUserOptions.viewer;
          this.details.IsGenAIUser = settings.defaultUserOptions.genAIUser || false;
        }
        // Default expiration date - use organization default if available
        // If not available, use 60 days from now (similar to new-user component)
        if (settings.defaultExpirationDate) {
          this.details.exp_date = settings.defaultExpirationDate;
          this.isPermanent = false;
        } else if (settings.defaultExpirationDays) {
          // If organization has default expiration days, calculate from today
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + settings.defaultExpirationDays);
          this.details.exp_date = defaultDate.getTime();
          this.isPermanent = false;
        } else {
          // Fallback: 60 days from now (same as new-user component)
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 60);
          this.details.exp_date = defaultDate.getTime();
          this.isPermanent = false;
        }
      }).catch(() => {
        // Fallback if organization fetch fails - 60 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 60);
        this.details.exp_date = defaultDate.getTime();
        this.isPermanent = false;
      });
    }
    saveChanges() {
      const updates = {};
      if (this.isPermanent) {
        updates.exp_date = "";
      } else if (this.details.exp_date !== undefined) {
        updates.exp_date = this.details.exp_date;
      }
      if (this.details.IsInsightsUser !== undefined) {
        updates.IsInsightsUser = this.details.IsInsightsUser;
      }
      if (this.details.IsDSMUser !== undefined) {
        updates.IsDSMUser = this.details.IsDSMUser;
      }
      if (this.details.IsGenAIUser !== undefined) {
        updates.IsGenAIUser = this.details.IsGenAIUser;
      }
      if (this.details.isExecutionUser !== undefined) {
        updates.isExecutionUser = this.details.isExecutionUser;
      }
      if (this.details.isViewerAccount !== undefined) {
        updates.isViewerAccount = this.details.isViewerAccount;
      }
      if (this.details.SysAdmin !== undefined) {
        updates.SysAdmin = this.details.SysAdmin;
      }
      if (this.details.OrgAdmin !== undefined) {
        updates.OrgAdmin = this.details.OrgAdmin;
      }
      if (this.details.usersManagement !== undefined) {
        updates.usersManagement = this.details.usersManagement;
      }
      if (this.hasMultiFactorAuth && this.details.multiFactorAuth !== undefined) {
        updates.multiFactorAuth = this.details.multiFactorAuth;
      } else if (!this.hasMultiFactorAuth) {
        updates.multiFactorAuth = null;
      }
      this.dialogRef.close({
        updates
      });
    }
    cancel() {
      this.dialogRef.close();
    }
    OnChangeAdminStatus(value) {
      this.details.SysAdmin = value.checked ? true : false;
    }
    OnChangeOrgStatus(value) {
      this.details.OrgAdmin = value.checked ? true : false;
      if (this.details.OrgAdmin === false) {
        this.details.usersManagement = false;
      }
    }
    OnChangeUsersManagementStatus(value) {
      this.details.usersManagement = value.checked ? true : false;
    }
    OnChangeIsInsightsUserStatus(value) {
      this.details.IsInsightsUser = value.checked ? true : false;
    }
    OnChangeIsDSMUserStatus(value) {
      this.details.IsDSMUser = value.checked ? true : false;
    }
    OnChangeIsGenAIUserStatus(value) {
      this.details.IsGenAIUser = value.checked ? true : false;
    }
    OnChangeExecutionUser($event) {
      this.details.isExecutionUser = $event.checked ? true : false;
    }
    multiFactorChange($event) {
      this.hasMultiFactorAuth = $event.checked;
    }
    OnChangeViewerAccount($event) {
      if ($event.checked) {
        this.details.isExecutionUser = false;
        this.details.IsDSMUser = false;
        this.details.IsGenAIUser = false;
        this.details.IsInsightsUser = false;
        this.details.OrgAdmin = false;
        this.details.usersManagement = false;
        this.details.SysAdmin = false;
      }
      this.details.isViewerAccount = $event.checked ? true : false;
    }
    static #_ = (() => this.ɵfac = function MultiUpdateUserDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MultiUpdateUserDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(OrganizationService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MultiUpdateUserDialogComponent,
      selectors: [["opcloud-multi-update-user-dialog"]],
      decls: 33,
      vars: 13,
      consts: [[2, "color", "#1A3763", "text-align", "center"], [2, "text-align", "center", "color", "#1A3763"], ["id", "userDetailsComponent"], [4, "ngIf"], [3, "dateChange", "date"], ["type", "checkbox", "name", "isPermanent", 3, "ngModelChange", "ngModel"], [1, "button-container"], ["id", "saveChangesButton", "mat-button", "save", 3, "click"], ["mat-button", "", 3, "click"], [3, "change", "checked"], [2, "padding-left", "10px"], [2, "height", "50px"], ["matInput", "", "placeholder", "Phone Number", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["hideIcon", "true", 3, "change", "checked"]],
      template: function MultiUpdateUserDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "h1", 0);
          core /* ɵɵtext */.EFF(1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "p", 1);
          core /* ɵɵtext */.EFF(3, "Changes will be applied to all selected users");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "div", 2)(5, "form")(6, "table");
          core /* ɵɵtemplate */.DNE(7, MultiUpdateUserDialogComponent_tr_7_Template, 5, 1, "tr", 3)(8, MultiUpdateUserDialogComponent_tr_8_Template, 4, 3, "tr", 3)(9, MultiUpdateUserDialogComponent_tr_9_Template, 6, 2, "tr", 3)(10, MultiUpdateUserDialogComponent_tr_10_Template, 6, 2, "tr", 3)(11, MultiUpdateUserDialogComponent_tr_11_Template, 6, 2, "tr", 3)(12, MultiUpdateUserDialogComponent_tr_12_Template, 6, 2, "tr", 3)(13, MultiUpdateUserDialogComponent_tr_13_Template, 6, 2, "tr", 3)(14, MultiUpdateUserDialogComponent_tr_14_Template, 6, 2, "tr", 3)(15, MultiUpdateUserDialogComponent_tr_15_Template, 6, 2, "tr", 3)(16, MultiUpdateUserDialogComponent_tr_16_Template, 6, 2, "tr", 3);
          core /* ɵɵelementStart */.j41(17, "tr")(18, "td");
          core /* ɵɵtext */.EFF(19, "Expiration Date");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "td")(21, "opcloud-calander", 4);
          core /* ɵɵtwoWayListener */.mxI("dateChange", function MultiUpdateUserDialogComponent_Template_opcloud_calander_dateChange_21_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.details.exp_date, $event)) {
              ctx.details.exp_date = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(22, "tr");
          core /* ɵɵelement */.nrm(23, "td");
          core /* ɵɵelementStart */.j41(24, "td")(25, "input", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function MultiUpdateUserDialogComponent_Template_input_ngModelChange_25_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.isPermanent, $event)) {
              ctx.isPermanent = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(26, " Permanent Access ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(27, "br");
          core /* ɵɵelementStart */.j41(28, "div", 6)(29, "button", 7);
          core /* ɵɵlistener */.bIt("click", function MultiUpdateUserDialogComponent_Template_button_click_29_listener() {
            return ctx.saveChanges();
          });
          core /* ɵɵtext */.EFF(30, "Save Changes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "button", 8);
          core /* ɵɵlistener */.bIt("click", function MultiUpdateUserDialogComponent_Template_button_click_31_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(32, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("Update ", ctx.userCount, " Users");
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.serverAuth && (ctx.isSysAdmin || ctx.isOrgAdmin && ctx.usersManagement && ctx.isOrgSupportMFA));
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.hasMultiFactorAuth);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin && ctx.details.OrgAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isOrgAdmin);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("date", ctx.details.exp_date);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.isPermanent);
        }
      },
      dependencies: [NgIf, MatFormField, MatInput, MatButton, MatCheckbox, CalanderComponent, fesm2022_forms /* ɵNgNoValidate */.qT, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, MatSlideToggle],
      styles: ["#userDetailsComponent[_ngcontent-%COMP%]{overflow:hidden!important;color:#1a3763!important;padding:20px}table[_ngcontent-%COMP%]{width:100%}td[_ngcontent-%COMP%]{padding:10px;color:#1a3763}h1[_ngcontent-%COMP%], p[_ngcontent-%COMP%]{color:#1a3763}.button-container[_ngcontent-%COMP%]{text-align:center;margin-top:20px}#saveChangesButton[_ngcontent-%COMP%]{position:relative;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;font-weight:400;margin-right:10px}.button-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{color:#1a3763}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#0075ff!important}.mat-mdc-slide-toggle.mat-checked[_ngcontent-%COMP%]   .mat-mdc-slide-toggle-bar[_ngcontent-%COMP%]{background-color:#c1ddff!important}.mat-mdc-slide-toggle.mat-checked[_ngcontent-%COMP%]   .mat-mdc-slide-toggle-thumb[_ngcontent-%COMP%]{background-color:#0075ff!important}.mat-mdc-slide-toggle[_ngcontent-%COMP%]{--mat-switch-label-text-color: #1A3763 !important;--mat-app-on-surface: #1A3763 !important}mat-mdc-form-field.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#0075ff!important}"]
    }))();
  }
  return MultiUpdateUserDialogComponent;
})();