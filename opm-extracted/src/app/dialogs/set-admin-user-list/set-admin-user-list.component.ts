// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/set-admin-user-list/set-admin-user-list.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const set_admin_user_list_component_c0 = (a0, a1) => [a0, a1];
function SetAdminUserListComponent_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 30);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r1 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", core /* ɵɵpureFunction2 */.l_i(2, set_admin_user_list_component_c0, org_r1.id, org_r1.name));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r1.name);
  }
}
function SetAdminUserListComponent_div_55_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 33);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_55_button_5_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.openMultiDeleteDialog());
    });
    core /* ɵɵtext */.EFF(1, "Delete Selected Users");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SetAdminUserListComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 31)(1, "span", 32);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "button", 33);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_55_Template_button_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.openMultiUpdateDialog());
    });
    core /* ɵɵtext */.EFF(4, "Update Selected Users");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(5, SetAdminUserListComponent_div_55_button_5_Template, 2, 0, "button", 34);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("Selected: ", ctx_r2.getSelectedUsersCount(), "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.canDeleteUsers());
  }
}
function SetAdminUserListComponent_div_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 35)(1, "span", 36);
    core /* ɵɵtext */.EFF(2, "Select All");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "label", 37)(4, "mat-checkbox", 38);
    core /* ɵɵlistener */.bIt("change", function SetAdminUserListComponent_div_57_Template_mat_checkbox_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleSelectAll($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("checked", ctx_r2.selectAll);
  }
}
function SetAdminUserListComponent_div_58_span_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 63);
    core /* ɵɵtext */.EFF(1, "SSO User");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SetAdminUserListComponent_div_58_button_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 33);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_58_button_36_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const user_r7 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.deleteUser(user_r7));
    });
    core /* ɵɵelementStart */.j41(1, "span", 51);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 64);
    core /* ɵɵelement */.nrm(3, "path", 55);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(4, " Delete User ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SetAdminUserListComponent_div_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 39)(1, "div", 40)(2, "div", 41)(3, "img", 42);
    core /* ɵɵlistener */.bIt("error", function SetAdminUserListComponent_div_58_Template_img_error_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.updateToDefaultUrl($event, "assets/SVG/logoPic.svg"));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "div", 43)(5, "div", 44)(6, "span", 45);
    core /* ɵɵtext */.EFF(7, "Full Name ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "span", 11);
    core /* ɵɵtext */.EFF(9);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "span", 46);
    core /* ɵɵtext */.EFF(11, "\xA0 \xA0\xA0");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "span", 47);
    core /* ɵɵtext */.EFF(13, "Email Address ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "span", 11);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "span", 46);
    core /* ɵɵtext */.EFF(17, "\xA0 \xA0\xA0");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(18, SetAdminUserListComponent_div_58_span_18_Template, 2, 0, "span", 48);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(19, "div", 49);
    core /* ɵɵelementStart */.j41(20, "div", 50)(21, "button", 33);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_58_Template_button_click_21_listener() {
      const user_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.openDialogUpdateUser(user_r7));
    });
    core /* ɵɵelementStart */.j41(22, "span", 51);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(23, "svg", 52);
    core /* ɵɵelement */.nrm(24, "path", 53);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(25, " Update User ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(26, "button", 33);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_58_Template_button_click_26_listener() {
      const user_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.openDialogDelUser(user_r7));
    });
    core /* ɵɵelementStart */.j41(27, "span", 51);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(28, "svg", 54);
    core /* ɵɵelement */.nrm(29, "path", 55);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(30);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(31, "button", 33);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_58_Template_button_click_31_listener() {
      const user_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.resetPassword(user_r7));
    });
    core /* ɵɵelementStart */.j41(32, "span", 51);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(33, "svg", 56);
    core /* ɵɵelement */.nrm(34, "path", 57);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(35, " Reset Password ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(36, SetAdminUserListComponent_div_58_button_36_Template, 5, 0, "button", 34);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(37, "button", 58)(38, "span", 51);
    core /* ɵɵtext */.EFF(39);
    core /* ɵɵpipe */.nI1(40, "date");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(41, "mat-checkbox", 59);
    core /* ɵɵlistener */.bIt("change", function SetAdminUserListComponent_div_58_Template_mat_checkbox_change_41_listener() {
      const user_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggleUserSelection(user_r7));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(42, "div", 49);
    core /* ɵɵelementStart */.j41(43, "div", 60);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(44, "svg", 61);
    core /* ɵɵelement */.nrm(45, "path", 62);
    core /* ɵɵelementEnd */.k0s()()()()();
  }
  if (rf & 2) {
    const user_r7 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate */.FS9("src", user_r7.PhotoURL ? user_r7.PhotoURL : "assets/SVG/logoPic.svg", core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(user_r7.Name);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(user_r7.Email);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", user_r7.sso_user);
    core /* ɵɵadvance */.R7$(12);
    core /* ɵɵtextInterpolate1 */.SpI(" ", user_r7.isActive === false ? "Activate User" : "Deactivate User", " ");
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.canDeleteUsers());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", ctx_r2.isUserActivatedAccordingToDate(user_r7.exp_date) ? "activatedOrPermanent" : "deactivated");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", user_r7.exp_date !== "" ? user_r7.exp_date == "NaN" ? "Unknown" : core /* ɵɵpipeBind2 */.i5U(40, 9, user_r7.exp_date, "dd/MM/yyyy") : "Permanent Access", " ");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("checked", ctx_r2.isUserSelected(user_r7));
  }
}
function SetAdminUserListComponent_div_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 65)(1, "button", 66);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_60_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onPageChange(ctx_r2.currentPage - 1));
    });
    core /* ɵɵtext */.EFF(2, "Previous");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "button", 66);
    core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_div_60_Template_button_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onPageChange(ctx_r2.currentPage + 1));
    });
    core /* ɵɵtext */.EFF(6, "Next");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r2.currentPage === 1);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate2 */.Lme("Page ", ctx_r2.currentPage, " of ", ctx_r2.getTotalPages(), "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r2.currentPage >= ctx_r2.getTotalPages());
  }
}
let SetAdminUserListComponent = /*#__PURE__*/(() => {
  class SetAdminUserListComponent {
    constructor(orgService, userService,
    // public deletevarification: AdminDeleteVarificationComponent,
    dialog, route) {
      this.orgService = orgService;
      this.userService = userService;
      this.dialog = dialog;
      this.route = route;
      this.OrgAdminOrganization = [];
      this.displayedColumns = ["Email", "Name"];
      this.userWithdetails = [];
      this.users = new BehaviorSubject([]);
      this.users$ = this.users.asObservable();
      this.listView = false;
      this.searchText = "";
      this.totalUsers = 0;
      this.currentPage = 1;
      this.pageSize = 50;
      this.sortBy = "name";
      this.sortOrder = "asc";
      this.expirationFilter = "all";
      this.includeSSO = true;
      this.adminsOnly = false;
      this.selectedUsers = new Set();
      this.selectAll = false;
      this.selected = "";
      // this.organizations.push('Select Organization');
      route.params.subscribe(params => {
        this.chosenOrganizationName = params.chosenOrganization;
      });
    }
    ngOnInit() {
      const came_from_org_admin = this.chosenOrganizationName !== null && this.chosenOrganizationName !== undefined;
      this.userService.user$.pipe((0, take)(1)).subscribe(data => {
        const user = data.userData;
        this.loggedUser = user;
        const organization_name = came_from_org_admin === true ? this.chosenOrganizationName : user.organization;
        if (user.SysAdmin) {
          this.organizations$ = this.orgService.getOrganizations();
        } else {
          this.organizations$ = (0, observable_of.of)([{
            id: user._organization,
            name: organization_name
          }]);
        }
        // this.placeholder = (user.OrgAdmin) ? user.organization : 'Organization';
        this.placeholder = organization_name;
        this.OrgAdmin = user.OrgAdmin;
        this.selected = organization_name;
        this.getUsersDeatailsById(this.selected);
      });
    }
    getOrgUsersId(event) {
      const selectedOrg = event.value.split(",")[1];
      this.selected = selectedOrg;
      this.getUsersDeatailsById(selectedOrg);
      const that = this;
    }
    getUsersDeatailsById(org, page = 1) {
      const currProc = this;
      currProc.currentOrg = org;
      currProc.currentPage = page;
      currProc.users.next([]);
      currProc.selectedUsers.clear();
      currProc.selectAll = false;
      // When filtering by admins only, we need to get all users first, then filter and paginate on frontend
      // So we request a large limit to get all users
      const requestLimit = currProc.adminsOnly ? 10000 : currProc.pageSize;
      const requestPage = currProc.adminsOnly ? 1 : currProc.currentPage;
      const params = {
        page: requestPage,
        limit: requestLimit,
        sortBy: currProc.sortBy,
        sortOrder: currProc.sortOrder,
        expirationFilter: currProc.expirationFilter,
        includeSSO: currProc.includeSSO
      };
      if (currProc.searchText) {
        params.search = currProc.searchText;
      }
      currProc.orgService.getOrganizationUsers(org, params).then(result => {
        let allUsers = result.users || [];
        // Filter by admins only if checkbox is checked
        if (currProc.adminsOnly) {
          allUsers = allUsers.filter(u => u.OrgAdmin === true || u.SysAdmin === true);
        }
        // Apply frontend pagination if we filtered
        const totalFiltered = allUsers.length;
        let paginatedUsers = allUsers;
        if (currProc.adminsOnly) {
          const startIndex = (currProc.currentPage - 1) * currProc.pageSize;
          const endIndex = startIndex + currProc.pageSize;
          paginatedUsers = allUsers.slice(startIndex, endIndex);
        }
        currProc.usersList = paginatedUsers;
        currProc.totalUsers = totalFiltered;
        currProc.users.next(currProc.usersList);
        currProc.updateSelectAllState();
      }).catch(err => {
        currProc.users.next([]);
        currProc.totalUsers = 0;
        currProc.selectAll = false;
      });
    }
    openDialogUpdateUser(user) {
      this.dialog.open(UpdateUserDialogComponent, {
        data: {
          user: user,
          organization: this.selected
        }
      });
    }
    /**
     * input: a user
     * output: activating or deactivating the given user
     * */
    openDialogDelUser(user) {
      var _this = this;
      return (0, default)(function* () {
        const currProc = _this;
        currProc.currentUser = user;
        let wantToDeactivate = false;
        if (currProc.currentUser.isActive || currProc.currentUser.isActive === undefined) {
          wantToDeactivate = window.confirm("Are sure you want to deactivate the user: " + user.Email + "?");
          if (!wantToDeactivate) {
            return;
          } // the user clicked 'cancel' so nothing should happen
        }
        const action = wantToDeactivate ? "Deactivated" : "Activated";
        const errorMsg = "ERROR! User wasn't " + action + "!";
        const successMsg = "User " + action + " Successfully!";
        if (!wantToDeactivate) {
          // if user should be activated
          if (!currProc.isUserActivatedAccordingToDate(user.exp_date)) {
            const dialogRef = currProc.dialog.open(ActivateUserDialogComponent, {
              data: {
                user: user,
                organization: _this.selected
              }
            });
            yield dialogRef.afterClosed().toPromise() // should wait until the user updated expiration date or decided to do nothing
            .then(res => {
              if (currProc.isUserActivatedAccordingToDate(currProc.currentUser.exp_date)) {
                // expiration date is in the future
                currProc.changeActivationStatusWrapper(successMsg, errorMsg, user, wantToDeactivate);
              }
            });
          } else {
            // original expiration date is in the future
            currProc.changeActivationStatusWrapper(successMsg, errorMsg, user, wantToDeactivate);
          }
        } else {
          // user should be deactivated
          currProc.changeActivationStatusWrapper(successMsg, errorMsg, user, wantToDeactivate);
        }
      })();
    }
    /***
     * input: a string to be displayed in case of success (successMsg) or failure (errorMsg),
     * the user that should be activated/deactivated and a boolean value (wantToDeactivate) that indicates if the user
     * should be deactivated or deactivated(if true- should be deactivated)
     * output: this function changes the user activation status.
     * **/
    changeActivationStatusWrapper(successMsg, errorMsg, user, wantToDeactivate) {
      this.orgService.changeActivationStatus(user.uid, !wantToDeactivate).then(res => {
        (0, validationAlert)(successMsg, null, "Success");
        user.isActive = !wantToDeactivate;
      }).catch(err => {
        (0, validationAlert)(errorMsg + err, null, "Error");
      });
    }
    resetPassword(user) {
      this.currentUser = user;
      if (this.userService.shouldChangePassword()) {
        this.dialog.open(ChangePasswordDialogComponent, {
          data: {
            user: user
          }
        });
      } else {
        this.userService.resetPassword(this.currentUser.Email).then(res => {
          (0, validationAlert)("Mail with reset details sent to " + this.currentUser.Email, null, "Success");
        }).catch(err => {
          (0, validationAlert)("Failed: " + err, null, "Error");
        });
      }
    }
    toggleListView() {
      this.listView = !this.listView;
    }
    /**
     * input: a list of observables, retrieves them to a list of users
     * output: count of users in the organization
     * */
    countUsers(usersList) {
      // This method is kept for backward compatibility but now uses totalUsers
      return this.totalUsers;
    }
    onSearchChange() {
      this.currentPage = 1;
      this.getUsersDeatailsById(this.selected);
    }
    onSortChange() {
      this.currentPage = 1;
      this.getUsersDeatailsById(this.selected);
    }
    onFilterChange() {
      this.currentPage = 1;
      this.getUsersDeatailsById(this.selected);
    }
    onPageChange(page) {
      this.getUsersDeatailsById(this.selected, page);
    }
    getTotalPages() {
      return Math.ceil(this.totalUsers / this.pageSize);
    }
    /**
     * input: receives a user expiration date (timestamp)
     * output: true if the user has permanent access or if the expiration date is in the future (or today).
     * otherwise, returns false*/
    isUserActivatedAccordingToDate(user_exp_date) {
      if (user_exp_date === "") {
        // the user has permanent access
        return true;
      }
      if (user_exp_date) {
        const currDateTime = new Date().getTime();
        return currDateTime <= user_exp_date;
      }
      return false;
    }
    /**
     * an error event handler, called when there an error on loading the picture
     * input: receives the event and the default picture url
     * output: updates the img src to be the default url
     * */
    updateToDefaultUrl(event, defaultPictureUrl) {
      event.target.src = defaultPictureUrl;
    }
    deleteUser(user) {
      if (user.uid === this.loggedUser.uid) {
        (0, validationAlert)("You cannot delete yourself. ", 5000, "Error");
      } else {
        const dialog_ref = this.dialog.open(RemoveUserComponent, {
          width: "600",
          data: {
            user: {
              user
            }
          }
        });
        dialog_ref.afterClosed().toPromise().then(res => {
          if (res && res.removed) {
            this.getUsersDeatailsById(this.selected);
          }
        });
      }
    }
    /*returns true if the delete button should be seen*/
    canDeleteUsers() {
      return this.loggedUser.SysAdmin;
    }
    // Multi-select methods
    toggleUserSelection(user) {
      if (this.selectedUsers.has(user.uid)) {
        this.selectedUsers.delete(user.uid);
      } else {
        this.selectedUsers.add(user.uid);
      }
      this.updateSelectAllState();
    }
    isUserSelected(user) {
      return this.selectedUsers.has(user.uid);
    }
    toggleSelectAll(event) {
      const checked = event.checked;
      if (checked) {
        // Select all users from current page
        this.usersList.forEach(user => this.selectedUsers.add(user.uid));
      } else {
        // Deselect all users from current page
        this.usersList.forEach(user => this.selectedUsers.delete(user.uid));
      }
      // Update state after a brief delay to ensure UI updates
      setTimeout(() => {
        this.selectAll = checked;
        this.updateSelectAllState();
      }, 0);
    }
    updateSelectAllState() {
      this.selectAll = this.usersList.length > 0 && this.usersList.every(user => this.selectedUsers.has(user.uid));
    }
    getSelectedUsersCount() {
      return this.selectedUsers.size;
    }
    // Multi-delete
    openMultiDeleteDialog() {
      var _this2 = this;
      return (0, default)(function* () {
        if (_this2.selectedUsers.size === 0) {
          (0, validationAlert)("Please select at least one user to delete", null, "Warning");
          return;
        }
        const selectedUserIds = Array.from(_this2.selectedUsers);
        const dialog_ref = _this2.dialog.open(RemoveUserComponent, {
          width: "600",
          data: {
            user: {
              user: null
            },
            isMultiDelete: true,
            userCount: selectedUserIds.length,
            organization: _this2.selected,
            userIds: selectedUserIds // Pass user IDs to exclude them from transfer list
          }
        });
        dialog_ref.afterClosed().toPromise().then(/*#__PURE__*/function () {
          var _ref = (0, default)(function* (res) {
            if (res && res.removed) {
              // Show confirmation dialog before proceeding
              const actionText = res.action === "auto" ? "automatically transferred" : res.action === "transfer" ? `transferred to selected user` : "removed";
              const confirmDialog = _this2.dialog.open(ConfirmDialogDialogComponent, {
                width: "500",
                data: {
                  title: "Confirm Deletion",
                  message: `You are about to delete ${selectedUserIds.length} user(s).<br><br>Models owned by these users will be ${actionText}.<br><br><strong>This action cannot be undone.</strong><br><br>Are you sure you want to proceed?`,
                  okName: "DELETE",
                  closeName: "Cancel",
                  okColor: "#d32f2f",
                  centerText: true
                }
              });
              confirmDialog.afterClosed().toPromise().then(/*#__PURE__*/function () {
                var _ref2 = (0, default)(function* (confirmed) {
                  if (confirmed) {
                    yield _this2.performMultiDelete(selectedUserIds, res.action, res.transfer_to);
                  }
                });
                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }
          });
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      })();
    }
    performMultiDelete(userIds, action, transfer_to) {
      var _this3 = this;
      return (0, default)(function* () {
        // Get user details for names and emails
        const userDetailsMap = {};
        _this3.usersList.forEach(user => {
          if (userIds.includes(user.uid)) {
            userDetailsMap[user.uid] = {
              name: user.Name,
              email: user.Email
            };
          }
        });
        const progressDialog = _this3.dialog.open(MultiDeleteProgressComponent, {
          width: "600",
          disableClose: true,
          data: {
            total: userIds.length,
            userDetailsMap: userDetailsMap
          }
        });
        const results = {
          success: [],
          errors: []
        };
        for (let i = 0; i < userIds.length; i++) {
          const uid = userIds[i];
          const userInfo = userDetailsMap[uid] || {
            name: uid,
            email: ""
          };
          progressDialog.componentInstance.updateProgress(i + 1, userIds.length, uid, userInfo.name);
          try {
            const result = yield _this3.orgService.bulkDeleteUsers(_this3.selected, [uid], {
              action,
              transfer_to
            });
            if (result.success && result.success.length > 0) {
              results.success.push({
                uid,
                name: userInfo.name,
                email: userInfo.email,
                success: true
              });
            } else if (result.errors && result.errors.length > 0) {
              results.errors.push({
                uid,
                name: userInfo.name,
                email: userInfo.email,
                error: result.errors[0].error || "Unknown error"
              });
            } else {
              results.success.push({
                uid,
                name: userInfo.name,
                email: userInfo.email,
                success: true
              });
            }
          } catch (err) {
            results.errors.push({
              uid,
              name: userInfo.name,
              email: userInfo.email,
              error: err.message || "Unknown error"
            });
          }
        }
        progressDialog.componentInstance.setComplete(results);
        progressDialog.afterClosed().toPromise().then(() => {
          _this3.selectedUsers.clear();
          _this3.getUsersDeatailsById(_this3.selected);
        });
      })();
    }
    // Multi-update
    openMultiUpdateDialog() {
      var _this4 = this;
      if (this.selectedUsers.size === 0) {
        (0, validationAlert)("Please select at least one user to update", null, "Warning");
        return;
      }
      const selectedUserIds = Array.from(this.selectedUsers);
      this.dialog.open(MultiUpdateUserDialogComponent, {
        width: "600",
        data: {
          organization: this.selected,
          userCount: selectedUserIds.length,
          isSysAdmin: this.loggedUser.SysAdmin,
          isOrgAdmin: this.loggedUser.OrgAdmin,
          usersManagement: this.loggedUser.usersManagement
        }
      }).afterClosed().toPromise().then(/*#__PURE__*/function () {
        var _ref3 = (0, default)(function* (res) {
          if (res && res.updates) {
            yield _this4.performMultiUpdate(selectedUserIds, res.updates);
          }
        });
        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
    performMultiUpdate(userIds, updates) {
      var _this5 = this;
      return (0, default)(function* () {
        try {
          const result = yield _this5.orgService.bulkUpdateUsers(_this5.selected, userIds, updates);
          const successCount = result.success.length;
          const errorCount = result.errors.length;
          if (errorCount === 0) {
            (0, validationAlert)(`Successfully updated ${successCount} user(s)`, null, "Success");
          } else {
            (0, validationAlert)(`Updated ${successCount} user(s), ${errorCount} error(s) occurred`, null, "Warning");
          }
          _this5.selectedUsers.clear();
          _this5.getUsersDeatailsById(_this5.selected);
        } catch (err) {
          (0, validationAlert)("Failed to update users: " + err, null, "Error");
        }
      })();
    }
    /**
     * Helper method to the export CSV file to prepare the CSV array from the triplets data
     */
    createModelersArray(modelersList) {
      const modelersArray = ["Full Name,", "Email,", "Accesses Date,", "Type\n"];
      const modelersData = [];
      modelersList.subscribe(value => {
        for (let i = 0; i < Object.keys(value).length; i++) {
          modelersData.push(value[i]);
        }
      }).unsubscribe();
      for (const modeler of modelersData) {
        modelersArray.push(modeler.Name + ",");
        modelersArray.push(modeler.Email + ",");
        const accessesDate = modeler.exp_date !== "" ? modeler.exp_date === "NaN" ? "Unknown" : new Date(modeler.exp_date * 1).toDateString() : "Permanent Access";
        modelersArray.push(accessesDate + ",");
        const type = modeler.sso_user ? "SSO User" : "Regular";
        modelersArray.push(type + "\n");
      }
      return modelersArray;
    }
    /**
     * A function for creating a CSV file with the organization modelers list
     * input: the users (modelers) list
     * output: a CSV file
     * */
    downloadUsersList(usersList) {
      const currDateTime = new Date().toDateString();
      const fileName = this.currentOrg + " accounts " + currDateTime;
      // Convert usersList observable to array for CSV export
      const usersArray = [];
      usersList.subscribe(value => {
        if (Array.isArray(value)) {
          usersArray.push(...value);
        }
      }).unsubscribe();
      const exportTriplesDataArray = this.createModelersArray((0, observable_of.of)(usersArray));
      const exportValuesFile = new Blob(exportTriplesDataArray, {
        type: "text/csv"
      });
      FileSaver_min.saveAs(exportValuesFile, fileName + ".csv"); // Save the exported file.
    }
    static #_ = (() => this.ɵfac = function SetAdminUserListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SetAdminUserListComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(ActivatedRoute));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SetAdminUserListComponent,
      selectors: [["opcloud-set-admin-user-list"]],
      decls: 61,
      vars: 18,
      consts: [[1, "headerContainer"], [1, "page-title"], [1, "org-label-row"], [1, "h2"], [1, "org-select-row"], [1, "mat-select-class-set-admin-user-list", 3, "selectionChange", "placeholder"], ["label", "Select Organization"], [3, "value", 4, "ngFor", "ngForOf"], [1, "search_bar_wrapper"], ["matInput", "", "placeholder", "search by name or email", "type", "text", "id", "searchBarNameEmail", 3, "ngModelChange", "ngModel"], [1, "summary-row"], [1, "NandEValues"], ["id", "NumOfModelers"], ["matTooltip", "The organization modelers list in a CSV file", 1, "modelersCSV", 3, "click"], [1, "filters-row"], [1, "filter-field"], [3, "ngModelChange", "selectionChange", "ngModel"], ["value", "all"], ["value", "expired"], ["value", "not_expired"], ["value", "name"], ["value", "exp_date"], ["value", "asc"], ["value", "desc"], [1, "sso-checkbox", 3, "ngModelChange", "change", "ngModel"], ["class", "bulk-actions", 4, "ngIf"], [1, "container", 3, "hidden"], ["class", "select-all-container", 4, "ngIf"], ["class", "listOfUsers", 4, "ngFor", "ngForOf"], ["class", "pagination-container", 4, "ngIf"], [3, "value"], [1, "bulk-actions"], [1, "selected-count"], [1, "tableViewBTN", 3, "click"], ["class", "tableViewBTN", 3, "click", 4, "ngIf"], [1, "select-all-container"], [1, "select-all-text"], [1, "select-all-label"], [3, "change", "checked"], [1, "listOfUsers"], [1, "user-item-wrapper"], [1, "user-profile-pic"], [3, "error", "src"], [1, "user-content"], [1, "user-name-email-row"], ["id", "name"], [1, "spacer"], ["id", "email"], ["class", "ssoUser", 4, "ngIf"], [1, "small-gap"], [1, "user-buttons-row"], [1, "Icon"], ["width", "15", "height", "15", "viewBox", "0 0 17 17", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M4.95809 5.84453L9.88426 1.13332C10.1671 0.863122 10.5836 0.787737 10.9434 0.942986L11.3927 1.13705C11.7428 1.28707 12.1481 1.2199 12.4309 0.965377C12.6825 0.739221 12.8646 0.580987 12.9594 0.51008C13.8595 -0.167642 14.9761 -0.109424 15.6755 0.589197C16.3741 1.28856 16.4323 2.40516 15.7546 3.30606C15.0776 4.2062 6.48147 13.1211 6.22695 13.3756C5.97169 13.6309 5.68806 13.548 5.5343 13.3935L2.87118 10.7304C2.71668 10.5766 2.63383 10.293 2.8891 10.0385C3.06002 9.86682 7.13381 5.93708 10.0656 3.16723C10.2224 3.01944 10.2231 2.76716 10.0753 2.61042C9.9268 2.45219 9.67751 2.44621 9.52077 2.59699L5.52684 6.43791C5.36711 6.59166 5.10811 6.58345 4.95137 6.42671C4.79015 6.26549 4.79239 6.00276 4.95809 5.84453ZM0.425092 14.96C0.49152 15.0361 0.471368 15.1615 0.399714 15.2324L0.175797 15.4571C0.0227875 15.6101 0.00188858 15.8661 0.169826 16.0341C0.337764 16.202 0.594522 16.1818 0.747532 16.0288L0.973688 15.8034C1.04683 15.7303 1.17372 15.7236 1.25433 15.7877C1.31852 15.8392 1.39614 15.8631 1.47452 15.8355C3.13673 15.2533 4.63697 14.5472 4.80192 14.4674C4.9721 14.3853 5.08853 14.0957 4.89 13.8964C4.69071 13.6979 3.59874 12.6059 3.59874 12.6059C3.59874 12.6059 2.50677 11.5139 2.30823 11.3146C2.10895 11.1161 1.81935 11.2325 1.73724 11.4027C1.65663 11.5677 0.943832 13.0604 0.360902 14.7219C0.332539 14.804 0.36762 14.8943 0.425092 14.96Z", "fill", "#5F7492"], ["width", "12", "height", "12", "viewBox", "0 0 14 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M9.30723 7.51188L12.9317 11.1355C13.5306 11.7344 13.4709 12.7432 12.7519 13.2608C12.1879 13.6667 11.3968 13.5474 10.9056 13.0562L7.33464 9.48448C7.10298 9.25359 6.72721 9.25359 6.49632 9.48448L2.87189 13.1089C2.27299 13.7078 1.26422 13.6482 0.746668 12.9292C0.340682 12.3659 0.459999 11.5741 0.951985 11.0828L4.52295 7.51188C4.75461 7.28022 4.75461 6.90445 4.52295 6.67357L0.8993 3.04914C0.299619 2.45023 0.359277 1.44147 1.07827 0.923914C1.64232 0.517929 2.43337 0.637245 2.92535 1.12923L6.49632 4.7002C6.72721 4.93186 7.10298 4.93186 7.33464 4.7002L10.9583 1.07655C11.5572 0.476865 12.566 0.536523 13.0835 1.25552C13.4895 1.81956 13.3702 2.61061 12.879 3.1026L9.30723 6.67357C9.07634 6.90445 9.07634 7.28022 9.30723 7.51188Z", "fill", "#5F7492"], ["width", "13", "height", "15", "viewBox", "0 0 15 17", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M7.65046 0.472869V1.61887C7.65046 1.93956 7.90536 2.19002 8.22699 2.21682C11.8187 2.51348 14.6411 5.51433 14.6411 9.17228C14.6411 13.4809 10.725 16.8782 6.24714 16.0178C3.87289 15.5606 2.13061 13.7136 1.06159 11.5865C0.801375 11.0688 1.03978 10.4525 1.55807 10.1934C2.14109 9.90187 2.85846 10.1674 3.19337 10.7267C4.03981 12.14 5.86027 14.3736 8.66171 13.7341C10.4228 13.3635 11.8447 11.9458 12.2164 10.1898C12.8031 7.42002 10.9243 4.95335 8.36046 4.55872C7.99063 4.50142 7.65046 4.7833 7.65046 5.1576V6.21395C7.65046 6.47919 7.34737 6.62983 7.13511 6.46995L3.61939 3.81567C3.30239 3.5763 3.30239 3.10035 3.62032 2.86098L7.13603 0.216867C7.34737 0.0579065 7.65046 0.20855 7.65046 0.472869Z", "fill", "#5F7492"], [1, "tableViewBTN", "expiration-date-btn", 3, "ngClass"], [1, "user-checkbox", 3, "change", "checked"], [1, "devideLine"], ["width", "805", "height", "2", "viewBox", "0 0 805 2", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M0 0.983398H805", "stroke", "black", "stroke-opacity", "0.1"], [1, "ssoUser"], ["width", "14", "height", "14", "viewBox", "0 0 14 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], [1, "pagination-container"], ["mat-button", "", 3, "click", "disabled"]],
      template: function SetAdminUserListComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h2", 1);
          core /* ɵɵtext */.EFF(2, "Edit Accounts");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div", 2)(4, "h2", 3);
          core /* ɵɵtext */.EFF(5, "Choose Organization");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(6, "div", 4)(7, "mat-select", 5);
          core /* ɵɵlistener */.bIt("selectionChange", function SetAdminUserListComponent_Template_mat_select_selectionChange_7_listener($event) {
            return ctx.getOrgUsersId($event);
          });
          core /* ɵɵelementStart */.j41(8, "mat-optgroup", 6);
          core /* ɵɵtemplate */.DNE(9, SetAdminUserListComponent_mat_option_9_Template, 2, 5, "mat-option", 7);
          core /* ɵɵpipe */.nI1(10, "async");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "mat-form-field", 8)(12, "mat-label");
          core /* ɵɵtext */.EFF(13, "search by name or email");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "input", 9);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SetAdminUserListComponent_Template_input_ngModelChange_14_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchText, $event)) {
              ctx.searchText = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("ngModelChange", function SetAdminUserListComponent_Template_input_ngModelChange_14_listener() {
            return ctx.onSearchChange();
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(15, "div", 10)(16, "span", 11)(17, "span");
          core /* ɵɵtext */.EFF(18, " Total Number of Modelers in Organization: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(19, "span", 12);
          core /* ɵɵtext */.EFF(20);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(21, " \xA0 \xA0\xA0 ");
          core /* ɵɵelementStart */.j41(22, "span", 13);
          core /* ɵɵlistener */.bIt("click", function SetAdminUserListComponent_Template_span_click_22_listener() {
            return ctx.downloadUsersList(ctx.users$);
          });
          core /* ɵɵtext */.EFF(23, " Download Modelers List ");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(24, "div", 14)(25, "mat-form-field", 15)(26, "mat-label");
          core /* ɵɵtext */.EFF(27, "Expiration Filter");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SetAdminUserListComponent_Template_mat_select_ngModelChange_28_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.expirationFilter, $event)) {
              ctx.expirationFilter = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function SetAdminUserListComponent_Template_mat_select_selectionChange_28_listener() {
            return ctx.onFilterChange();
          });
          core /* ɵɵelementStart */.j41(29, "mat-option", 17);
          core /* ɵɵtext */.EFF(30, "All");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "mat-option", 18);
          core /* ɵɵtext */.EFF(32, "Expired");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(33, "mat-option", 19);
          core /* ɵɵtext */.EFF(34, "Not Expired");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(35, "mat-form-field", 15)(36, "mat-label");
          core /* ɵɵtext */.EFF(37, "Sort By");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(38, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SetAdminUserListComponent_Template_mat_select_ngModelChange_38_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.sortBy, $event)) {
              ctx.sortBy = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function SetAdminUserListComponent_Template_mat_select_selectionChange_38_listener() {
            return ctx.onSortChange();
          });
          core /* ɵɵelementStart */.j41(39, "mat-option", 20);
          core /* ɵɵtext */.EFF(40, "Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(41, "mat-option", 21);
          core /* ɵɵtext */.EFF(42, "Expiration Date");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(43, "mat-form-field", 15)(44, "mat-label");
          core /* ɵɵtext */.EFF(45, "Sort Order");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(46, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SetAdminUserListComponent_Template_mat_select_ngModelChange_46_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.sortOrder, $event)) {
              ctx.sortOrder = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function SetAdminUserListComponent_Template_mat_select_selectionChange_46_listener() {
            return ctx.onSortChange();
          });
          core /* ɵɵelementStart */.j41(47, "mat-option", 22);
          core /* ɵɵtext */.EFF(48, "Ascending");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(49, "mat-option", 23);
          core /* ɵɵtext */.EFF(50, "Descending");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(51, "mat-checkbox", 24);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SetAdminUserListComponent_Template_mat_checkbox_ngModelChange_51_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.includeSSO, $event)) {
              ctx.includeSSO = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("change", function SetAdminUserListComponent_Template_mat_checkbox_change_51_listener() {
            return ctx.onFilterChange();
          });
          core /* ɵɵtext */.EFF(52, "Include SSO Users");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(53, "mat-checkbox", 24);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SetAdminUserListComponent_Template_mat_checkbox_ngModelChange_53_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.adminsOnly, $event)) {
              ctx.adminsOnly = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("change", function SetAdminUserListComponent_Template_mat_checkbox_change_53_listener() {
            return ctx.onFilterChange();
          });
          core /* ɵɵtext */.EFF(54, "Admins Only");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(55, SetAdminUserListComponent_div_55_Template, 6, 2, "div", 25);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(56, "div", 26);
          core /* ɵɵtemplate */.DNE(57, SetAdminUserListComponent_div_57_Template, 5, 1, "div", 27)(58, SetAdminUserListComponent_div_58_Template, 46, 12, "div", 28);
          core /* ɵɵpipe */.nI1(59, "async");
          core /* ɵɵtemplate */.DNE(60, SetAdminUserListComponent_div_60_Template, 7, 4, "div", 29);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵpropertyInterpolate */.FS9("placeholder", ctx.placeholder);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(10, 14, ctx.organizations$));
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchText);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtextInterpolate */.JRh(ctx.totalUsers);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.expirationFilter);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.sortBy);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.sortOrder);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.includeSSO);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.adminsOnly);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.getSelectedUsersCount() > 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", ctx.listView);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.usersList && ctx.usersList.length > 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(59, 16, ctx.users$));
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.getTotalPages() > 1);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatSelect, MatOption, MatOptgroup, MatButton, MatCheckbox, DefaultValueAccessor, NgControlStatus, NgModel, AsyncPipe, DatePipe],
      styles: [".headerContainer[_ngcontent-%COMP%]{position:relative;left:50px;top:50px;margin-bottom:30px}.page-title[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:24px;color:#1a3763;margin:0 0 30px;padding:0}.org-label-row[_ngcontent-%COMP%]{margin-bottom:10px}.h2[_ngcontent-%COMP%]{position:relative;left:0;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;color:#1a3763;margin:0 20px 0 0}.org-select-row[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:15px;margin-bottom:20px;flex-wrap:wrap}.summary-row[_ngcontent-%COMP%]{margin-bottom:20px}.filters-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px;margin-bottom:20px;flex-wrap:wrap;position:relative;left:0;margin-left:0;padding-left:0}.bulk-actions[_ngcontent-%COMP%]{position:relative;left:0;margin:20px 0;display:flex;align-items:center;gap:15px}.bulk-actions[_ngcontent-%COMP%]   .tableViewBTN[_ngcontent-%COMP%]{margin:0}.selected-count[_ngcontent-%COMP%]{font-weight:700;color:#1a3763;font-size:16px;margin-right:10px}.container[_ngcontent-%COMP%]{position:relative;left:50px;top:50px}.select-all-container[_ngcontent-%COMP%]{position:relative;left:0;margin-bottom:10px;display:flex;align-items:center;padding-left:60px}.select-all-label[_ngcontent-%COMP%]{cursor:pointer;display:flex;align-items:center;pointer-events:auto}.select-all-container[_ngcontent-%COMP%]   mat-checkbox[_ngcontent-%COMP%]{pointer-events:auto;cursor:pointer;color:#1a3763}.select-all-container[_ngcontent-%COMP%]     .mat-mdc-checkbox{pointer-events:auto!important;cursor:pointer!important}.select-all-container[_ngcontent-%COMP%]     .mat-mdc-checkbox .mdc-checkbox{pointer-events:auto!important;cursor:pointer!important}.select-all-container[_ngcontent-%COMP%]     .mat-mdc-checkbox .mdc-checkbox__native-control{pointer-events:auto!important;cursor:pointer!important}.select-all-container[_ngcontent-%COMP%]     .mat-mdc-checkbox .mdc-checkbox__background{pointer-events:auto!important;cursor:pointer!important}.select-all-container[_ngcontent-%COMP%]     .mat-mdc-checkbox .mdc-checkbox__ripple{pointer-events:auto!important;cursor:pointer!important}.select-all-container[_ngcontent-%COMP%]     .mat-mdc-checkbox-label{pointer-events:auto!important;cursor:pointer!important;-webkit-user-select:none;user-select:none}.listOfUsers[_ngcontent-%COMP%]{margin-bottom:0;position:relative;clear:both}.user-item-wrapper[_ngcontent-%COMP%]{display:flex;align-items:flex-start;margin-bottom:0}.user-profile-pic[_ngcontent-%COMP%]{flex-shrink:0;width:60px;height:100%;display:flex;align-items:flex-start;justify-content:center}.user-profile-pic[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:60px;height:100%;object-fit:contain;display:block;max-width:60px;max-height:100%}.user-content[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;min-height:100px}.user-name-email-row[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;line-height:1.4;min-height:20px}.user-name-email-row[_ngcontent-%COMP%]   #name[_ngcontent-%COMP%], .user-name-email-row[_ngcontent-%COMP%]   #email[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;color:#3b3b3b}.NandEValues[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;color:#586d8c;-webkit-user-select:text;user-select:text;display:inline-block}.spacer[_ngcontent-%COMP%]{margin:0 8px}.ssoUser[_ngcontent-%COMP%]{font-size:14px;color:#1a3763;font-weight:700}.small-gap[_ngcontent-%COMP%]{height:4px;flex-shrink:0}.user-buttons-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:51px}.user-buttons-row[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]{margin:0}.tableViewBTN[_ngcontent-%COMP%]{position:relative;width:176px;height:51px;background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:16px;color:#1a3763;opacity:.7;white-space:nowrap;flex-shrink:0}.expiration-date-btn[_ngcontent-%COMP%]{margin-left:0;margin-right:5px;flex-shrink:0}.expiration-date-btn[_ngcontent-%COMP%]   .Icon[_ngcontent-%COMP%]{font-size:14px;left:0;top:0}.Icon[_ngcontent-%COMP%]{position:relative;top:2px;left:-11px;font-size:14px}.user-checkbox[_ngcontent-%COMP%]{position:relative;display:inline-block;margin-left:0;margin-right:0;vertical-align:middle;flex-shrink:0}.activatedOrPermanent[_ngcontent-%COMP%]{background-color:#acbdffe6}.deactivated[_ngcontent-%COMP%]{background-color:#ff8e0c66}.devideLine[_ngcontent-%COMP%]{position:relative;padding:0;height:2px;flex-shrink:0;margin:0 0 8px;width:calc(100% + -0px)}.devideLine[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;width:100%;height:2px;max-width:100%}.user-item-wrapper[_ngcontent-%COMP%]{min-height:81px}.user-profile-pic[_ngcontent-%COMP%], .user-profile-pic[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:81px}.user-content[_ngcontent-%COMP%]{min-height:81px}.filter-field[_ngcontent-%COMP%]{position:relative;width:200px}.filter-field[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-select-value[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-select-arrow[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-input-element[_ngcontent-%COMP%], .filter-field[_ngcontent-%COMP%]   .mat-mdc-form-field-input-control[_ngcontent-%COMP%]{color:#1a3763!important}.sso-checkbox[_ngcontent-%COMP%]{color:#1a3763;margin-left:10px}.sso-checkbox[_ngcontent-%COMP%]   .mdc-checkbox__label[_ngcontent-%COMP%], .sso-checkbox[_ngcontent-%COMP%]   .mat-mdc-checkbox-label[_ngcontent-%COMP%]{color:#1a3763!important}.sso-checkbox[_ngcontent-%COMP%]   .mat-mdc-checkbox-frame[_ngcontent-%COMP%]{border-color:#1a3763!important}.search_bar_wrapper[_ngcontent-%COMP%]{position:relative;border:1px solid rgba(73,114,132,.2);border-radius:6px;top:0;width:300px;height:46px;padding-left:8px;margin-left:0;color:#586d8c}[_nghost-%COMP%]   .search_bar_wrapper[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{position:relative;bottom:7px}.mat-mdc-select-underline[_ngcontent-%COMP%]{display:none}.modelersCSV[_ngcontent-%COMP%]{font-size:12px}.pagination-container[_ngcontent-%COMP%]{position:relative;left:50px;top:50px;text-align:center;margin:20px 0}.pagination-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin:0 10px}.pagination-container[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin:0 20px;color:#586d8c}.select-all-text[_ngcontent-%COMP%]{position:absolute;left:920px;color:#1a3763;font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;margin-right:8px;pointer-events:none}.select-all-label[_ngcontent-%COMP%]{margin-left:920px;box-sizing:border-box;position:relative}"]
    }))();
  }
  return SetAdminUserListComponent;
})();