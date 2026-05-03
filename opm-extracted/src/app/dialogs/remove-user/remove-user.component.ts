// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/remove-user/remove-user.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const remove_user_component_c0 = a0 => ({
  "gray-out": a0
});
function RemoveUserComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "progress-spinner", 1);
    core /* ɵɵelementEnd */.k0s();
  }
}
function RemoveUserComponent_div_1_p_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p", 6);
    core /* ɵɵtext */.EFF(1, "Are you sure you want to delete ");
    core /* ɵɵelementStart */.j41(2, "a", 7);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, "?");
    core /* ɵɵelement */.nrm(5, "br");
    core /* ɵɵtext */.EFF(6, "This action is not reversible.");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.name);
  }
}
function RemoveUserComponent_div_1_p_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p", 6);
    core /* ɵɵtext */.EFF(1, "Are you sure you want to delete ");
    core /* ɵɵelementStart */.j41(2, "a", 7);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, "?");
    core /* ɵɵelement */.nrm(5, "br");
    core /* ɵɵtext */.EFF(6, "This action is not reversible.");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.userCount, " user(s)");
  }
}
function RemoveUserComponent_div_1_p_3_mat_option_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 16);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const user_r4 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", user_r4.uid);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate2 */.Lme(" ", user_r4.Name, " (", user_r4.Email, ") ");
  }
}
function RemoveUserComponent_div_1_p_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "p")(1, "span", 8);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "mat-radio-group", 9);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function RemoveUserComponent_div_1_p_3_Template_mat_radio_group_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.action, $event)) {
        ctx_r1.action = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(4, "span", 10)(5, "mat-radio-button", 11);
    core /* ɵɵtext */.EFF(6, "Remove them");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(7, "span", 10)(8, "mat-radio-button", 12);
    core /* ɵɵtext */.EFF(9, "Transfer ownership to:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "mat-form-field", 13)(11, "mat-select", 14);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function RemoveUserComponent_div_1_p_3_Template_mat_select_ngModelChange_11_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.transfer_to, $event)) {
        ctx_r1.transfer_to = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵtemplate */.DNE(12, RemoveUserComponent_div_1_p_3_mat_option_12_Template, 2, 3, "mat-option", 15);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Select action to perform on all models owned by ", ctx_r1.isMultiDelete ? "these users" : "this user", ":");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.action);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction1 */.eq3(7, remove_user_component_c0, ctx_r1.action != "remove"));
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction1 */.eq3(9, remove_user_component_c0, ctx_r1.action != "transfer"));
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.transfer_to);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.action != "transfer");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.organization_users);
  }
}
function RemoveUserComponent_div_1_p_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "p");
    core /* ɵɵtext */.EFF(1, " All models' permissions will be transfered to another user. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function RemoveUserComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, RemoveUserComponent_div_1_p_1_Template, 7, 1, "p", 2)(2, RemoveUserComponent_div_1_p_2_Template, 7, 1, "p", 2)(3, RemoveUserComponent_div_1_p_3_Template, 13, 11, "p", 0)(4, RemoveUserComponent_div_1_p_4_Template, 2, 0, "p", 0);
    core /* ɵɵelementStart */.j41(5, "div", 3)(6, "span", 4);
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "button", 5);
    core /* ɵɵlistener */.bIt("click", function RemoveUserComponent_div_1_Template_button_click_8_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.deleteUser());
    });
    core /* ɵɵtext */.EFF(9, "DELETE");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "button", 5);
    core /* ɵɵlistener */.bIt("click", function RemoveUserComponent_div_1_Template_button_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.doNotDeleteUser());
    });
    core /* ɵɵtext */.EFF(11, "Cancel");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.isMultiDelete);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isMultiDelete);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.can_be_auto_transfered == false);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.can_be_auto_transfered == true);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.error);
  }
}
let RemoveUserComponent = /*#__PURE__*/(() => {
  class RemoveUserComponent {
    constructor(dialogRef, data, organizationService) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.organizationService = organizationService;
      this.pendding = true;
      this.isMultiDelete = false;
      this.userCount = 1;
      this.can_be_auto_transfered = undefined;
      this.error = "";
      this.action = "remove";
    }
    ngOnInit() {
      this.isMultiDelete = this.data.isMultiDelete || false;
      this.userCount = this.data.userCount || 1;
      if (this.isMultiDelete) {
        // For multi-delete, we need to check if any user can be auto-transferred
        // For simplicity, we'll assume manual handling is needed
        const org = this.data.organization || this.data.user?.user?.organization;
        if (!org) {
          this.pendding = false;
          this.can_be_auto_transfered = false;
          this.error = "Organization not specified";
          return;
        }
        this.organizationService.getOrganizationUsers(org, {
          page: 1,
          limit: 1000,
          expirationFilter: "not_expired",
          includeSSO: true
        }).then(result => {
          const users = Array.isArray(result) ? result : result.users || [];
          // Additional filter to only non-expired users (those with empty exp_date or exp_date in the future)
          const currentTime = new Date().getTime();
          this.organization_users = users.filter(u => {
            // Exclude the users being deleted
            if (this.data.userIds && this.data.userIds.includes(u.uid)) {
              return false;
            }
            // Include only non-expired users
            if (!u.exp_date || u.exp_date === "") {
              return true;
            } // Permanent access
            const expDate = typeof u.exp_date === "string" ? parseInt(u.exp_date) : u.exp_date;
            if (isNaN(expDate)) {
              return true;
            } // Invalid date, treat as permanent
            return expDate >= currentTime;
          });
          this.pendding = false;
          this.can_be_auto_transfered = false;
        }).catch(err => {
          this.pendding = false;
          this.can_be_auto_transfered = false;
          this.error = "Failed to load organization users";
        });
      } else {
        this.name = this.data.user.user.Name;
        this.user_id = this.data.user.user.uid;
        this.organizationService.deleteUserCanBeAutoTrasfered(this.user_id).then(res => {
          if (res == false) {
            this.organizationService.getOrganizationUsers(this.data.user.user.organization, {
              page: 1,
              limit: 1000,
              expirationFilter: "not_expired",
              includeSSO: true
            }).then(result => {
              const users = Array.isArray(result) ? result : result.users || [];
              // Filter to only non-expired users
              const currentTime = new Date().getTime();
              this.organization_users = users.filter(u => {
                // Exclude the user being deleted
                if (u.uid === this.user_id) {
                  return false;
                }
                // Include only non-expired users
                if (!u.exp_date || u.exp_date === "") {
                  return true;
                } // Permanent access
                const expDate = typeof u.exp_date === "string" ? parseInt(u.exp_date) : u.exp_date;
                if (isNaN(expDate)) {
                  return true;
                } // Invalid date, treat as permanent
                return expDate >= currentTime;
              });
              this.pendding = false;
              this.can_be_auto_transfered = false;
            });
          } else {
            this.pendding = false;
            this.can_be_auto_transfered = true;
          }
        });
      }
    }
    deleteUser() {
      if (this.isMultiDelete) {
        // For multi-delete, just return the action and transfer_to
        if (this.action == "transfer" && (!this.transfer_to || this.transfer_to === "")) {
          this.error = "Please select a user";
          return;
        }
        this.dialogRef.close({
          removed: true,
          action: this.can_be_auto_transfered ? "auto" : this.action,
          transfer_to: this.transfer_to
        });
        return;
      }
      let promise;
      if (this.can_be_auto_transfered) {
        promise = this.organizationService.deleteUser(this.user_id, {
          action: "auto"
        });
      } else if (this.action == "remove") {
        promise = this.organizationService.deleteUser(this.user_id, {
          action: "remove"
        });
      } else if (this.action == "transfer") {
        if (this.transfer_to && this.transfer_to != this.user_id) {
          promise = this.organizationService.deleteUser(this.user_id, {
            action: "transfer",
            transfer_to: this.transfer_to
          });
        } else {
          this.error = "Please select a user";
          return;
        }
      }
      this.pendding = true;
      promise.then(() => this.dialogRef.close({
        removed: true
      }));
    }
    doNotDeleteUser() {
      this.dialogRef.close({
        removed: false
      });
    }
    static #_ = (() => this.ɵfac = function RemoveUserComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RemoveUserComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(OrganizationService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RemoveUserComponent,
      selectors: [["remove-user"]],
      features: [core /* ɵɵProvidersFeature */.Jv_([{
        provide: MAT_RADIO_DEFAULT_OPTIONS,
        useValue: {
          color: "primary"
        }
      }])],
      decls: 2,
      vars: 2,
      consts: [[4, "ngIf"], [2, "height", "60px"], ["class", "title", 4, "ngIf"], [1, "buttonContainer"], [2, "color", "red", "display", "block", "margin-bottom", "10px"], ["mat-flat-button", "", 1, "btn", 3, "click"], [1, "title"], [2, "font-weight", "bold"], [2, "display", "block", "margin-bottom", "4px", "color", "#1A3763"], [3, "ngModelChange", "ngModel"], [2, "display", "block", "margin", "3px", 3, "ngClass"], ["value", "remove", 1, "example-margin"], ["value", "transfer", 1, "example-margin"], [2, "margin-left", "30px", "width", "300px"], ["id", "select-user", "placeholder", "Select a user", 3, "ngModelChange", "ngModel", "disabled"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"]],
      template: function RemoveUserComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵtemplate */.DNE(0, RemoveUserComponent_div_0_Template, 2, 0, "div", 0)(1, RemoveUserComponent_div_1_Template, 12, 5, "div", 0);
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngIf", ctx.pendding);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.pendding == false);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatFormField, MatSelect, MatOption, MatButton, MatRadioGroup, MatRadioButton, ProgressSpinner, NgControlStatus, NgModel],
      styles: [".title[_ngcontent-%COMP%]{font-size:large}p[_ngcontent-%COMP%]{text-align:left;font-size:medium}.buttonContainer[_ngcontent-%COMP%]{text-align:center;margin-top:20px;display:flex;justify-content:center;gap:10px}button.btn[_ngcontent-%COMP%]{background:#1a3763!important;color:#fff!important;border:1px solid rgba(0,0,0,.1)!important;box-sizing:border-box!important;box-shadow:0 2px 4px #0000001f!important;border-radius:6px!important;padding:10px 20px!important;cursor:pointer!important;font-size:14px!important;font-weight:500!important;letter-spacing:normal!important;min-width:120px!important}button.btn[_ngcontent-%COMP%]:hover{opacity:.9}button.btn[_ngcontent-%COMP%]:first-child{background:#d32f2f!important;color:#fff!important}#select-user[_ngcontent-%COMP%]{margin-left:6px;width:170px!important}.gray-out[_ngcontent-%COMP%]{color:gray!important}"]
    }))();
  }
  return RemoveUserComponent;
})();