// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/update-user-dialog/update-user-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const update_user_dialog_component_c0 = () => ({
  standalone: true
});
function UpdateUserDialogComponent_tr_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Multi-Factor Authentication:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-checkbox", 10);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_27_Template_mat_checkbox_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td", 11)(2, "mat-form-field", 12)(3, "input", 13);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UpdateUserDialogComponent_tr_28_Template_input_ngModelChange_3_listener($event) {
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
    core /* ɵɵproperty */.Y8G("ngModelOptions", core /* ɵɵpureFunction0 */.lJ4(2, update_user_dialog_component_c0));
  }
}
function UpdateUserDialogComponent_tr_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "System Admin:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_29_Template_mat_slide_toggle_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.OnChangeAdminStatus($event));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(6, "br");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.details.SysAdmin);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.details.SysAdmin, " ");
  }
}
function UpdateUserDialogComponent_tr_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Organization Admin:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_30_Template_mat_slide_toggle_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, " → Users Management:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_31_Template_mat_slide_toggle_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "OPM Insights User:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_32_Template_mat_slide_toggle_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "DSM Analysis User:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_33_Template_mat_slide_toggle_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Execution User:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_34_Template_mat_slide_toggle_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "GenerativeAI Account:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_35_Template_mat_slide_toggle_change_4_listener($event) {
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
function UpdateUserDialogComponent_tr_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2, "Viewer Account:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td")(4, "mat-slide-toggle", 14);
    core /* ɵɵlistener */.bIt("change", function UpdateUserDialogComponent_tr_36_Template_mat_slide_toggle_change_4_listener($event) {
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
let UpdateUserDialogComponent = /*#__PURE__*/(() => {
  class UpdateUserDialogComponent {
    constructor(service, data, dialog, orgService) {
      this.service = service;
      this.data = data;
      this.dialog = dialog;
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
    }
    ngOnInit() {
      this.isSysAdmin = this.service.user.userData.SysAdmin;
      this.isOrgAdmin = this.service.user.userData.OrgAdmin;
      this.usersManagement = this.service.user.userData.usersManagement;
      this.user = this.data.user;
      this.details.SysAdmin = this.user.SysAdmin;
      this.details.OrgAdmin = this.user.OrgAdmin;
      this.details.usersManagement = !!this.user.usersManagement;
      this.details.IsInsightsUser = this.user.IsInsightsUser;
      this.details.IsDSMUser = this.user.IsDSMUser;
      this.details.IsGenAIUser = this.user.IsGenAIUser;
      this.details.exp_date = this.user.exp_date !== "" ? this.user.exp_date : 1546347600000;
      this.isPermanent = this.user.exp_date === "";
      this.details.isActive = this.user.isActive;
      this.details.isExecutionUser = this.user.isExecutionUser;
      this.details.multiFactorAuth = this.user.multiFactorAuth;
      this.details.isViewerAccount = this.user.isViewerAccount;
      this.hasMultiFactorAuth = !!this.details.multiFactorAuth;
      this.serverAuth = environment.serverSideAuth;
      this.orgService.getOrganization(this.user.organization).then(settings => {
        this.isOrgSupportMFA = ["optional", "mandatory"].includes(settings.auth2Factors);
      });
    }
    updateUserDialog(user) {
      if (this.isPermanent) {
        this.details.exp_date = "";
      }
      if (this.details.IsInsightsUser === undefined) {
        this.details.IsInsightsUser = false;
      }
      if (this.details.IsDSMUser === undefined) {
        this.details.IsDSMUser = false;
      }
      if (this.details.IsGenAIUser === undefined) {
        this.details.IsGenAIUser = false;
      }
      if (!this.hasMultiFactorAuth) {
        this.details.multiFactorAuth = null;
      }
      const userActivatedAccordingToDate = this.isUserActivatedAccordingToDate(this.details.exp_date);
      this.details.isActive = userActivatedAccordingToDate;
      this.service.updateUser(this.user.uid, this.data.organization, this.details).then(res => {
        (0, validationAlert)("Successfully updated", null, "Success");
        Object.keys(this.details).forEach(key => {
          if (this.details[key] !== undefined) {
            this.user[key] = this.details[key];
          }
        });
        /* update this.user.isActive immediately according to the new date selected so it will be shown without the need
        to render the page again*/
        this.user.isActive = userActivatedAccordingToDate;
        this.dialog.closeAll();
      });
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
    /**
     * input: receives a user expiration date (timestamp)
     * output: true if the user has permanent access or if the expiration date is in the future (or today).
     * otherwise, returns false*/
    isUserActivatedAccordingToDate(user_exp_date) {
      if (user_exp_date) {
        const currDateTime = new Date().setHours(0, 0, 0, 0); // to compare just according to day, month and year
        return currDateTime <= user_exp_date;
      }
      return true; // the user has permanent access
    }
    OnChangeExecutionUser($event) {
      this.details.isExecutionUser = $event.checked ? true : false;
    }
    multiFactorChange($event) {
      this.hasMultiFactorAuth = $event.checked;
    }
    OnChangeViewerAccount($event) {
      if ($event.checked) {
        // Making sure that changing to viewer account will remove other roles
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
    static #_ = (() => this.ɵfac = function UpdateUserDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UpdateUserDialogComponent)(core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OrganizationService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: UpdateUserDialogComponent,
      selectors: [["opcloud-update-user-dialog"]],
      decls: 50,
      vars: 20,
      consts: [[2, "color", "#1A3763", "text-align", "center"], ["id", "userDetailsComponent"], [1, "userDetailsUserName"], ["matInput", "", "disabled", "true", "matTooltip", "The Email Address can't be edited", "ngModel", "uEmail", "name", "uEmail", 3, "ngModelChange", "placeholder", "ngModel"], ["matInput", "", "ngModel", "uName", "name", "uName", 3, "ngModelChange", "placeholder", "ngModel"], ["matInput", "", "ngModel", "uPhotoURL", "name", "uPhotoURL", 3, "ngModelChange", "placeholder", "ngModel"], [4, "ngIf"], [3, "dateChange", "date"], ["type", "checkbox", "name", "isPermanent", 3, "ngModelChange", "ngModel"], ["id", "saveChangesButton", "mat-button", "save", 3, "click"], [3, "change", "checked"], [2, "padding-left", "10px"], [2, "height", "50px"], ["matInput", "", "placeholder", "Phone Number", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["hideIcon", "true", 3, "change", "checked"]],
      template: function UpdateUserDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "h1", 0);
          core /* ɵɵtext */.EFF(1, "Profile Details");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "div", 1)(3, "form")(4, "table")(5, "tr")(6, "td");
          core /* ɵɵtext */.EFF(7, "Email:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "td")(9, "mat-form-field", 2)(10, "input", 3);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UpdateUserDialogComponent_Template_input_ngModelChange_10_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.details.Email, $event)) {
              ctx.details.Email = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(11, "tr")(12, "td");
          core /* ɵɵtext */.EFF(13, "Name:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "td")(15, "mat-form-field", 2)(16, "mat-label");
          core /* ɵɵtext */.EFF(17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "input", 4);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UpdateUserDialogComponent_Template_input_ngModelChange_18_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.details.Name, $event)) {
              ctx.details.Name = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(19, "tr")(20, "td");
          core /* ɵɵtext */.EFF(21, "PhotoURL:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(22, "td")(23, "mat-form-field", 2)(24, "mat-label");
          core /* ɵɵtext */.EFF(25);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "input", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UpdateUserDialogComponent_Template_input_ngModelChange_26_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.details.PhotoURL, $event)) {
              ctx.details.PhotoURL = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵtemplate */.DNE(27, UpdateUserDialogComponent_tr_27_Template, 5, 1, "tr", 6)(28, UpdateUserDialogComponent_tr_28_Template, 4, 3, "tr", 6)(29, UpdateUserDialogComponent_tr_29_Template, 7, 2, "tr", 6)(30, UpdateUserDialogComponent_tr_30_Template, 6, 2, "tr", 6)(31, UpdateUserDialogComponent_tr_31_Template, 6, 2, "tr", 6)(32, UpdateUserDialogComponent_tr_32_Template, 6, 2, "tr", 6)(33, UpdateUserDialogComponent_tr_33_Template, 6, 2, "tr", 6)(34, UpdateUserDialogComponent_tr_34_Template, 6, 2, "tr", 6)(35, UpdateUserDialogComponent_tr_35_Template, 6, 2, "tr", 6)(36, UpdateUserDialogComponent_tr_36_Template, 6, 2, "tr", 6);
          core /* ɵɵelementStart */.j41(37, "tr")(38, "td");
          core /* ɵɵtext */.EFF(39, "Expiration Date");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(40, "td")(41, "opcloud-calander", 7);
          core /* ɵɵtwoWayListener */.mxI("dateChange", function UpdateUserDialogComponent_Template_opcloud_calander_dateChange_41_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.details.exp_date, $event)) {
              ctx.details.exp_date = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(42, "tr");
          core /* ɵɵelement */.nrm(43, "td");
          core /* ɵɵelementStart */.j41(44, "td")(45, "input", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function UpdateUserDialogComponent_Template_input_ngModelChange_45_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.isPermanent, $event)) {
              ctx.isPermanent = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(46, " Permanent Access ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(47, "br");
          core /* ɵɵelementStart */.j41(48, "button", 9);
          core /* ɵɵlistener */.bIt("click", function UpdateUserDialogComponent_Template_button_click_48_listener() {
            return ctx.updateUserDialog(ctx.user);
          });
          core /* ɵɵtext */.EFF(49, "Save Changes");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("placeholder", ctx.user.Email);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.details.Email);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵtextInterpolate */.JRh(ctx.user.Name);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.user.Name);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.details.Name);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵtextInterpolate */.JRh((ctx.user == null ? null : ctx.user.PhotoURL) ? ctx.user == null ? null : ctx.user.PhotoURL : "Image URL");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.user.PhotoURL);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.details.PhotoURL);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.serverAuth && (ctx.isSysAdmin && !ctx.user.sso_user || ctx.isOrgAdmin && ctx.usersManagement && !ctx.user.sso_user && ctx.isOrgSupportMFA));
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
      dependencies: [NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatButton, MatCheckbox, CalanderComponent, fesm2022_forms /* ɵNgNoValidate */.qT, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, MatSlideToggle],
      styles: [".selected[_ngcontent-%COMP%]{background:#87cefa}#userDetailsComponent[_ngcontent-%COMP%]{overflow:hidden!important;color:#1a3763!important}.userDetailsUserName[_ngcontent-%COMP%]{position:relative;border:1px solid rgba(73,114,132,.2);border-radius:6px}#saveChangesButton[_ngcontent-%COMP%]{position:relative;left:145px;text-align:center;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal;font-weight:400}hr[_ngcontent-%COMP%]{color:#1a3763}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#0075ff!important}.mat-mdc-slide-toggle.mat-checked[_ngcontent-%COMP%]   .mat-mdc-slide-toggle-bar[_ngcontent-%COMP%]{background-color:#c1ddff!important}.mat-mdc-slide-toggle.mat-checked[_ngcontent-%COMP%]   .mat-mdc-slide-toggle-thumb[_ngcontent-%COMP%]{background-color:#0075ff!important}.mat-mdc-slide-toggle[_ngcontent-%COMP%]{--mat-switch-label-text-color: #1A3763 !important;--mat-app-on-surface: #1A3763 !important}mat-mdc-form-field.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#0075ff!important}"]
    }))();
    static #_3 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: UpdateUserDialogComponent,
      factory: UpdateUserDialogComponent.ɵfac
    }))();
  }
  return UpdateUserDialogComponent;
})();