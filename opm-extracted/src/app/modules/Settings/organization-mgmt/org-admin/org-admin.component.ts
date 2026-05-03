// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/organization-mgmt/org-admin/org-admin.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const org_admin_component_c0 = a0 => ["../set-admin", a0];
function OrgAdminComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 5)(1, "mat-checkbox", 6);
    core /* ɵɵlistener */.bIt("change", function OrgAdminComponent_div_4_Template_mat_checkbox_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.changedHighProfileSelection($event));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(2, "span", 7);
    core /* ɵɵtext */.EFF(3, " Show only high profile organizations ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "mat-form-field", 8)(5, "mat-label");
    core /* ɵɵtext */.EFF(6, "Search By Name");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "input", 9);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OrgAdminComponent_div_4_Template_input_ngModelChange_7_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.searchText, $event)) {
        ctx_r1.searchText = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵlistener */.bIt("input", function OrgAdminComponent_div_4_Template_input_input_7_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.onSearchInput($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.showOnlyHighProfileOrgs);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.searchText);
  }
}
function OrgAdminComponent_mat_grid_list_5_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 17);
    core /* ɵɵlistener */.bIt("click", function OrgAdminComponent_mat_grid_list_5_button_15_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const org_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openDialogDeleteOrg(org_r4));
    });
    core /* ɵɵtext */.EFF(1, " Delete ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function OrgAdminComponent_mat_grid_list_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-grid-list", 10);
    core /* ɵɵelement */.nrm(1, "mat-grid-tile", 11);
    core /* ɵɵelementStart */.j41(2, "mat-grid-tile", 12);
    core /* ɵɵlistener */.bIt("click", function OrgAdminComponent_mat_grid_list_5_Template_mat_grid_tile_click_2_listener() {
      const org_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleHighProfile(org_r4));
    });
    core /* ɵɵelementStart */.j41(3, "mat-icon");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "mat-grid-tile", 13)(6, "a", 14);
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(8, "mat-grid-tile", 11)(9, "button", 15);
    core /* ɵɵlistener */.bIt("click", function OrgAdminComponent_mat_grid_list_5_Template_button_click_9_listener() {
      const org_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.orgChangeName(org_r4));
    });
    core /* ɵɵtext */.EFF(10, " Change Name");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(11, "mat-grid-tile", 11)(12, "button", 15);
    core /* ɵɵlistener */.bIt("click", function OrgAdminComponent_mat_grid_list_5_Template_button_click_12_listener() {
      const org_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.orgActivation(org_r4));
    });
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "mat-grid-tile", 11);
    core /* ɵɵtemplate */.DNE(15, OrgAdminComponent_mat_grid_list_5_button_15_Template, 2, 0, "button", 16);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const org_r4 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("rowspan", 2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("rowspan", 2)("matTooltip", ctx_r1.getOrgProfileTooltip(org_r4));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleMap */.Aen(org_r4.highProfile ? "color: #ff9500;" : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r4.flag ? "work" : "work_off");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("rowspan", 2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("routerLink", core /* ɵɵpureFunction1 */.eq3(14, org_admin_component_c0, org_r4.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r4.name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("rowspan", 2);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("rowspan", 2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", org_r4.flag ? "Deactivate" : "Activate", "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("rowspan", 2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.userService.user.userData.SysAdmin);
  }
}
let OrgAdminComponent = /*#__PURE__*/(() => {
  class OrgAdminComponent {
    constructor(_dialog, orgService, userService, auth, dialog, dbService) {
      this._dialog = _dialog;
      this.orgService = orgService;
      this.userService = userService;
      this.auth = auth;
      this.dialog = dialog;
      this.dbService = dbService;
      this.selected = "";
      this.isSysAdmin = false;
      this.showOnlyHighProfileOrgs = false;
      this.isLoading = false;
      this.searchText = "";
      this._organizations = [];
    }
    ngOnInit() {
      const that = this;
      this.userService.user$.pipe((0, take)(1)).subscribe(user => {
        that.isSysAdmin = that.userService.user.userData.SysAdmin;
        this.updateOrgList(user.userData);
      });
      // Prevent Chrome autofill from filling the search field
      // Monitor for autofill events and clear if email-like content appears
      setTimeout(() => {
        const searchInput = document.getElementById("searchBarName");
        if (searchInput) {
          // Check if field was autofilled with email-like content
          const checkAutofill = () => {
            const value = searchInput.value;
            // If the value looks like an email and wasn't manually typed, clear it
            if (value && value.includes("@") && value !== this.searchText) {
              // Only clear if it's clearly an email (not a search term)
              if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+/)) {
                this.searchText = "";
                searchInput.value = "";
              }
            }
          };
          // Check on various events
          searchInput.addEventListener("input", checkAutofill);
          searchInput.addEventListener("change", checkAutofill);
          // Also check after a short delay to catch autofill that happens after focus
          searchInput.addEventListener("focus", () => {
            setTimeout(checkAutofill, 100);
          });
        }
      }, 500);
    }
    onSearchInput(event) {
      const value = event.target.value;
      // If Chrome autofills with an email, clear it immediately
      if (value && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        this.searchText = "";
        event.target.value = "";
      }
    }
    updateOrgList(user) {
      var _this = this;
      return (0, default)(function* () {
        if (user.SysAdmin) {
          let orgs = yield _this.dbService.driver.getOrganizations();
          // Use Promise.allSettled to handle failures gracefully without blocking
          // Suppress HTTP errors by catching them before they reach the console
          const highProfilePromises = orgs.map(o => _this.orgService.getOrganization(o.name).then(orgSettings => {
            o.highProfile = orgSettings?.highProfile || false;
            return o;
          }).catch(err => {
            // Silently handle errors - organization might not exist or have issues
            // Don't log to console to avoid cluttering with 500 errors
            o.highProfile = false;
            return o;
          }));
          yield Promise.allSettled(highProfilePromises);
          if (_this.showOnlyHighProfileOrgs) {
            orgs = orgs.filter(o => o.highProfile);
          }
          _this._organizations = orgs;
        } else {
          _this.orgService.isActiveOrg(user.organization).then(activeFlag => {
            _this._organizations = [{
              id: user._organization,
              name: user.organization,
              flag: activeFlag,
              highProfile: false
            }];
          });
        }
      })();
    }
    orgChangeName(org) {
      var _this2 = this;
      const dialogRef = this._dialog.open(InputNameDialogComponent, {
        height: "190px",
        width: "380px",
        data: {
          message: "Please enter new name for organization " + org.name,
          passwordFlag: false,
          inputName: "Organization Name"
        }
      });
      dialogRef.afterClosed().toPromise().then(/*#__PURE__*/function () {
        var _ref = (0, default)(function* (data) {
          if (data) {
            let orgExists = false;
            const newName = data.NameInput;
            if (newName === "") {
              (0, validationAlert)("The name is illegal  \n Please choose different name", 3500, "Error");
            } else {
              const allOrgs = yield _this2.dbService.driver.getOrganizations();
              allOrgs.forEach(organization => {
                if (organization.name === newName) {
                  (0, validationAlert)("The name " + newName + " already exists \n Please choose different name", 3500, "Error");
                  orgExists = true;
                }
              });
              if (!orgExists) {
                _this2.orgService.updateOrgName(org.name, newName).then(() => {
                  (0, validationAlert)("Name was successfully updated!", 2500, "Success");
                  _this2.updateOrgList(_this2.userService.user.userData);
                  return;
                });
              }
            }
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    orgActivation(org) {
      const that = this;
      this.orgService.activateOrDeactivateOrg(org.name, !org.flag).then(res => {
        if (org.flag || org.flag === undefined) {
          (0, validationAlert)("Organization: " + org.name + " is now deactivated");
        } else {
          (0, validationAlert)("Organization: " + org.name + " is now activated");
        }
      }).then(() => that.updateOrgList(that.userService.user.userData));
    }
    openDialogDeleteOrg(org) {
      // Clear search field to prevent autofill interference and ensure organizations are visible
      const previousSearchText = this.searchText;
      this.searchText = "";
      const dialogRef = this._dialog.open(InputNameDialogComponent, {
        height: "190px",
        width: "380px",
        data: {
          message: "Warning: All organization data will be deleted \n Please enter user's password",
          passwordFlag: true
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        // Restore search text if dialog is closed without deletion
        if (!data || !data.password) {
          this.searchText = previousSearchText;
          return;
        }
        // Process deletion if password was provided
        this.auth.signInWithEmailAndPassword(this.userService.user.userData.Email, data.password).then(result => {
          if (result) {
            this.orgService.deleteOrganization(org.name).then(() => {
              (0, validationAlert)("Organization Deleted Successfully!", 2500, "Success");
              // Refresh the organization list after successful deletion
              this.updateOrgList(this.userService.user.userData);
            }).catch(err => {
              console.log(err);
              (0, validationAlert)("ERROR! Organization could not be deleted: " + err, 4000, "Error");
            });
          }
        }).catch(err => {
          const dialogRef2 = this._dialog.open(ConfirmDialogDialogComponent, {
            height: "150px",
            width: "320px",
            data: {
              message: "Wrong password",
              closeFlag: true
            }
          });
        });
      });
    }
    toggleHighProfile(org) {
      const that = this;
      this.orgService.updateOrganization(org.name, {
        highProfile: !org.highProfile
      }).then(() => that.updateOrgList(that.userService.user.userData));
    }
    getOrgProfileTooltip(org) {
      if (!this.isSysAdmin) {
        return "";
      }
      if (org.highProfile) {
        return "Click to set as a regular profile";
      } else {
        return "Click to set as a high profile";
      }
    }
    changedHighProfileSelection($event) {
      this.showOnlyHighProfileOrgs = !this.showOnlyHighProfileOrgs;
    }
    getOrgs() {
      if (this.showOnlyHighProfileOrgs) {
        return this._organizations.filter(org => org.highProfile).filter(org => {
          return org.name.toLowerCase().includes(this.searchText.toLowerCase());
        });
      }
      return this._organizations.filter(org => {
        return org.name.toLowerCase().includes(this.searchText.toLowerCase());
      });
    }
    static #_ = (() => this.ɵfac = function OrgAdminComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OrgAdminComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(AuthenticationService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(DatabaseService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OrgAdminComponent,
      selectors: [["opcloud-org-admin"]],
      decls: 6,
      vars: 3,
      consts: [["id", "header"], [1, "h2"], ["type", "email", "autocomplete", "email", "aria-hidden", "true", 2, "position", "absolute", "left", "-9999px", "opacity", "0", "pointer-events", "none"], ["style", "text-align: center; margin-bottom: 15px;", 4, "ngIf"], ["rowHeight", "2rem", "cols", "7", 4, "ngFor", "ngForOf"], [2, "text-align", "center", "margin-bottom", "15px"], ["type", "checkbox", 3, "change", "checked"], [2, "color", "#1A3763"], [1, "search_bar_wrapper"], ["matInput", "", "placeholder", "Search By Name", "type", "text", "autocomplete", "off", "id", "searchBarName", "name", "org-search-field", "data-lpignore", "true", "data-form-type", "other", 3, "ngModelChange", "input", "ngModel"], ["rowHeight", "2rem", "cols", "7"], [3, "rowspan"], [3, "click", "rowspan", "matTooltip"], [1, "orgName", 3, "rowspan"], [2, "color", "rgba(26, 55, 99, 0.6)", "font-size", "large", "align-content", "left", "text-align", "left", 3, "routerLink"], [1, "tableViewBTN", 3, "click"], ["id", "deleteBTN", "class", "tableViewDLTBTN", 3, "click", 4, "ngIf"], ["id", "deleteBTN", 1, "tableViewDLTBTN", 3, "click"]],
      template: function OrgAdminComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h2", 1);
          core /* ɵɵtext */.EFF(2, "Organization Administration");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(3, "input", 2);
          core /* ɵɵtemplate */.DNE(4, OrgAdminComponent_div_4_Template, 8, 2, "div", 3)(5, OrgAdminComponent_mat_grid_list_5_Template, 16, 16, "mat-grid-list", 4);
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵattribute */.BMQ("tabindex", -1);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.getOrgs());
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatIcon, MatGridList, MatGridTile, MatCheckbox, DefaultValueAccessor, NgControlStatus, NgModel, RouterLink],
      styles: ["\n#header[_ngcontent-%COMP%]{position:relative;padding-left:50px;margin-top:50px}.h2[_ngcontent-%COMP%]{position:relative;left:21px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;color:#1a3763;margin-bottom:45px}.container[_ngcontent-%COMP%]{position:relative;left:50px;top:50px}.search_bar_wrapper[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.2);border-radius:6px;top:7px;width:300px;height:46px;padding-left:8px;margin-left:10px;color:#586d8c}img[_ngcontent-%COMP%]{position:relative;width:114px;height:112px}form[_ngcontent-%COMP%]{position:relative;display:inline}.nameANDemail[_ngcontent-%COMP%]{position:relative;top:-93px;left:7px}.NandEValues[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:33px;font-size:16px;color:#586d8c}#name[_ngcontent-%COMP%], #email[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.tBTNS[_ngcontent-%COMP%]{position:relative;top:-64px;left:123px}.tableViewBTN[_ngcontent-%COMP%]{position:relative;width:180px;height:53px;background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:18px;alignment:right;color:#1a3763;opacity:.7}.tableViewDLTBTN[_ngcontent-%COMP%]{position:relative;width:180px;height:53px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:18px;alignment:right;color:#fff;margin-left:10px;opacity:.7}.tableViewDLTBTN[_ngcontent-%COMP%]:hover{position:relative;width:180px;height:53px;background:red;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:18px;alignment:right;color:#fff;opacity:.7}.Icon[_ngcontent-%COMP%]{position:relative;top:3px;left:-13px}.devideLine[_ngcontent-%COMP%]{position:relative;top:-27px}#arrow[_ngcontent-%COMP%]{position:relative;left:543px;top:30px;z-index:3}.mat-mdc-grid-tile[_ngcontent-%COMP%]   .mat-figure[_ngcontent-%COMP%]{display:flex;position:absolute;align-items:center;justify-content:left;height:100%;inset:0;padding:0;margin:0}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}a[_ngcontent-%COMP%]{text-decoration:none}.orgName[_ngcontent-%COMP%]{-webkit-user-select:text;user-select:text}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}"]
    }))();
  }
  return OrgAdminComponent;
})();