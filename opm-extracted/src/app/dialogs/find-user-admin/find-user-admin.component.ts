// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/find-user-admin/find-user-admin.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function FindUserAdminComponent_div_10_span_23_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 31);
    core /* ɵɵtext */.EFF(1, "SSO User");
    core /* ɵɵelementEnd */.k0s();
  }
}
function FindUserAdminComponent_div_10_button_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 32);
    core /* ɵɵlistener */.bIt("click", function FindUserAdminComponent_div_10_button_43_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const user_r3 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.deleteUser(user_r3));
    });
    core /* ɵɵelementStart */.j41(1, "span", 18);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 21);
    core /* ɵɵelement */.nrm(3, "path", 22);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(4, " Delete User");
    core /* ɵɵelementEnd */.k0s();
  }
}
function FindUserAdminComponent_div_10_span_44_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "\xA0 \xA0 \xA0 \xA0");
    core /* ɵɵelementEnd */.k0s();
  }
}
function FindUserAdminComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 7)(1, "form", 8)(2, "img", 9);
    core /* ɵɵlistener */.bIt("error", function FindUserAdminComponent_div_10_Template_img_error_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.updateToDefaultUrl($event, "assets/SVG/logoPic.svg"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span", 10)(4, "span")(5, "span", 11);
    core /* ɵɵtext */.EFF(6, " Full Name ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "span", 12);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(9, "\xA0 \xA0\xA0 ");
    core /* ɵɵelementStart */.j41(10, "span")(11, "span", 13);
    core /* ɵɵtext */.EFF(12, "E-mail Address ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "span", 12);
    core /* ɵɵtext */.EFF(14);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(15, "\xA0 \xA0\xA0 ");
    core /* ɵɵelementStart */.j41(16, "span")(17, "span", 14);
    core /* ɵɵtext */.EFF(18, "Organization ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(19, "span", 12);
    core /* ɵɵtext */.EFF(20);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(21, "\xA0 \xA0\xA0 ");
    core /* ɵɵelementStart */.j41(22, "span");
    core /* ɵɵtemplate */.DNE(23, FindUserAdminComponent_div_10_span_23_Template, 2, 0, "span", 15);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelement */.nrm(24, "br");
    core /* ɵɵelementStart */.j41(25, "span", 16)(26, "button", 17);
    core /* ɵɵlistener */.bIt("click", function FindUserAdminComponent_div_10_Template_button_click_26_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openDialogUpdateUser(user_r3));
    });
    core /* ɵɵelementStart */.j41(27, "span", 18);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(28, "svg", 19);
    core /* ɵɵelement */.nrm(29, "path", 20);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(30, " Update User ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(31, " \xA0 \xA0\xA0 ");
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(32, "button", 17);
    core /* ɵɵlistener */.bIt("click", function FindUserAdminComponent_div_10_Template_button_click_32_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openDialogDelUser(user_r3));
    });
    core /* ɵɵelementStart */.j41(33, "span", 18);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(34, "svg", 21);
    core /* ɵɵelement */.nrm(35, "path", 22);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(36);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(37, " \xA0 \xA0\xA0 ");
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(38, "button", 17);
    core /* ɵɵlistener */.bIt("click", function FindUserAdminComponent_div_10_Template_button_click_38_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.resetPassword(user_r3));
    });
    core /* ɵɵelementStart */.j41(39, "span", 18);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(40, "svg", 23);
    core /* ɵɵelement */.nrm(41, "path", 24);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(42, " Reset Password");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(43, FindUserAdminComponent_div_10_button_43_Template, 5, 0, "button", 25)(44, FindUserAdminComponent_div_10_span_44_Template, 2, 0, "span", 26);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(45, "button", 27)(46, "span", 18);
    core /* ɵɵtext */.EFF(47);
    core /* ɵɵpipe */.nI1(48, "date");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(49, "div", 28);
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(50, "svg", 29);
    core /* ɵɵelement */.nrm(51, "path", 30);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const user_r3 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("src", user_r3.PhotoURL || "assets/SVG/logoPic.svg", core /* ɵɵsanitizeUrl */.B4B);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(user_r3.Name);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate1 */.SpI(" ", user_r3.Email, "");
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate1 */.SpI(" ", user_r3.organization, "");
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", user_r3.sso_user);
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵtextInterpolate1 */.SpI(" ", user_r3.isActive === false ? "Activate User" : "Deactivate User", "");
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canDeleteUsers());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.canDeleteUsers());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", ctx_r1.isUserActivatedAccordingToDate(user_r3.exp_date) ? "activatedOrPermanent" : "deactivated");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI(" ", user_r3.exp_date !== "" ? user_r3.exp_date == "NaN" ? "Unknown" : core /* ɵɵpipeBind2 */.i5U(48, 10, user_r3.exp_date, "dd/MM/yyyy") : "Permanent Access", " ");
  }
}
let FindUserAdminComponent = /*#__PURE__*/(() => {
  class FindUserAdminComponent {
    constructor(orgService, userService, dialog) {
      this.orgService = orgService;
      this.userService = userService;
      this.dialog = dialog;
      this.listView = false;
      this.searchText = "";
      this.selected = "";
      this.isLoading = true;
    }
    ngOnInit() {
      this.loadAllOrganizationsUsers();
    }
    loadAllOrganizationsUsers() {
      var _this = this;
      return (0, default)(function* () {
        _this.allUsers = [];
        _this.filteredUsers = [];
        const orgs = yield _this.orgService.getAllOrgs();
        for (const org of orgs) {
          const orgUsers = yield _this.orgService.getOrganizationUsers(org.name);
          _this.allUsers.push(...orgUsers);
        }
        _this.loggedUser = _this.userService.user?.userData;
        _this.isLoading = false;
      })();
    }
    openDialogUpdateUser(user) {
      this.dialog.open(UpdateUserDialogComponent, {
        data: {
          user: user,
          organization: user.organization
        }
      });
    }
    openDialogDelUser(user) {
      var _this2 = this;
      return (0, default)(function* () {
        const currProc = _this2;
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
                organization: _this2.selected
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
    sortFilteredUsersArray() {
      this.filteredUsers = this.filteredUsers.sort((a, b) => {
        if (a.organization !== b.organization) {
          if (a.organization > b.organization) {
            return 1;
          } else {
            return -1;
          }
        }
        if (a.Name.charAt(0).toUpperCase() < b.Name.charAt(0).toUpperCase()) {
          return -1;
        } else if (a.Name.charAt(0).toUpperCase() > b.Name.charAt(0).toUpperCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    isUserActivatedAccordingToDate(user_exp_date) {
      if (user_exp_date === "") {
        // the user has permanent access
        return true;
      }
      if (user_exp_date) {
        const currDateTime = new Date().setHours(0, 0, 0, 0); // to compare just according to day,month and year
        return currDateTime <= user_exp_date;
      }
      return false;
    }
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
          if (res.removed) {
            const idx = this.allUsers.indexOf(user);
            if (idx > 0) {
              this.allUsers.splice(idx, 1);
              this.filterUsers();
            }
          }
        });
      }
    }
    canDeleteUsers() {
      return this.loggedUser.SysAdmin;
    }
    textChange($event) {
      this.searchText = $event.target.value;
      this.filterUsers();
      this.sortFilteredUsersArray();
    }
    filterUsers() {
      if (this.searchText.length < 2) {
        this.filteredUsers = [];
      } else {
        this.filteredUsers = this.allUsers.filter(user => {
          return user.Name.toLowerCase().trim().includes(this.searchText.toLowerCase().trim()) || user.Email.toLowerCase().trim().includes(this.searchText.toLowerCase().trim());
        });
      }
    }
    static #_ = (() => this.ɵfac = function FindUserAdminComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FindUserAdminComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: FindUserAdminComponent,
      selectors: [["opcloud-find-user-admin"]],
      decls: 13,
      vars: 5,
      consts: [[1, "headerContainer"], [1, "h2"], [1, "search_bar_wrapper"], ["matInput", "", "placeholder", "search by name or email", "type", "text", "id", "searchBarNameEmail", 3, "keyup"], [1, "container", 3, "hidden"], ["class", "listOfUsers", 4, "ngFor", "ngForOf"], [2, "position", "absolute", "z-index", "99999999", "left", "calc(50% - 58px)", "top", "33%", 3, "hidden"], [1, "listOfUsers"], ["action", "", 1, "userDetails"], [3, "error", "src"], [1, "nameANDemail"], [1, "name"], [1, "NandEValues"], [1, "email"], [1, "organization"], ["class", "ssoUser", 4, "ngIf"], [1, "tBTNS"], [1, "tableViewBTN", 3, "click"], [1, "Icon"], ["width", "17", "height", "17", "viewBox", "0 0 17 17", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M4.95809 5.84453L9.88426 1.13332C10.1671 0.863122 10.5836 0.787737 10.9434 0.942986L11.3927 1.13705C11.7428 1.28707 12.1481 1.2199 12.4309 0.965377C12.6825 0.739221 12.8646 0.580987 12.9594 0.51008C13.8595 -0.167642 14.9761 -0.109424 15.6755 0.589197C16.3741 1.28856 16.4323 2.40516 15.7546 3.30606C15.0776 4.2062 6.48147 13.1211 6.22695 13.3756C5.97169 13.6309 5.68806 13.548 5.5343 13.3935L2.87118 10.7304C2.71668 10.5766 2.63383 10.293 2.8891 10.0385C3.06002 9.86682 7.13381 5.93708 10.0656 3.16723C10.2224 3.01944 10.2231 2.76716 10.0753 2.61042C9.9268 2.45219 9.67751 2.44621 9.52077 2.59699L5.52684 6.43791C5.36711 6.59166 5.10811 6.58345 4.95137 6.42671C4.79015 6.26549 4.79239 6.00276 4.95809 5.84453ZM0.425092 14.96C0.49152 15.0361 0.471368 15.1615 0.399714 15.2324L0.175797 15.4571C0.0227875 15.6101 0.00188858 15.8661 0.169826 16.0341C0.337764 16.202 0.594522 16.1818 0.747532 16.0288L0.973688 15.8034C1.04683 15.7303 1.17372 15.7236 1.25433 15.7877C1.31852 15.8392 1.39614 15.8631 1.47452 15.8355C3.13673 15.2533 4.63697 14.5472 4.80192 14.4674C4.9721 14.3853 5.08853 14.0957 4.89 13.8964C4.69071 13.6979 3.59874 12.6059 3.59874 12.6059C3.59874 12.6059 2.50677 11.5139 2.30823 11.3146C2.10895 11.1161 1.81935 11.2325 1.73724 11.4027C1.65663 11.5677 0.943832 13.0604 0.360902 14.7219C0.332539 14.804 0.36762 14.8943 0.425092 14.96Z", "fill", "#5F7492"], ["width", "14", "height", "14", "viewBox", "0 0 14 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M9.30723 7.51188L12.9317 11.1355C13.5306 11.7344 13.4709 12.7432 12.7519 13.2608C12.1879 13.6667 11.3968 13.5474 10.9056 13.0562L7.33464 9.48448C7.10298 9.25359 6.72721 9.25359 6.49632 9.48448L2.87189 13.1089C2.27299 13.7078 1.26422 13.6482 0.746668 12.9292C0.340682 12.3659 0.459999 11.5741 0.951985 11.0828L4.52295 7.51188C4.75461 7.28022 4.75461 6.90445 4.52295 6.67357L0.8993 3.04914C0.299619 2.45023 0.359277 1.44147 1.07827 0.923914C1.64232 0.517929 2.43337 0.637245 2.92535 1.12923L6.49632 4.7002C6.72721 4.93186 7.10298 4.93186 7.33464 4.7002L10.9583 1.07655C11.5572 0.476865 12.566 0.536523 13.0835 1.25552C13.4895 1.81956 13.3702 2.61061 12.879 3.1026L9.30723 6.67357C9.07634 6.90445 9.07634 7.28022 9.30723 7.51188Z", "fill", "#5F7492"], ["width", "15", "height", "17", "viewBox", "0 0 15 17", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M7.65046 0.472869V1.61887C7.65046 1.93956 7.90536 2.19002 8.22699 2.21682C11.8187 2.51348 14.6411 5.51433 14.6411 9.17228C14.6411 13.4809 10.725 16.8782 6.24714 16.0178C3.87289 15.5606 2.13061 13.7136 1.06159 11.5865C0.801375 11.0688 1.03978 10.4525 1.55807 10.1934C2.14109 9.90187 2.85846 10.1674 3.19337 10.7267C4.03981 12.14 5.86027 14.3736 8.66171 13.7341C10.4228 13.3635 11.8447 11.9458 12.2164 10.1898C12.8031 7.42002 10.9243 4.95335 8.36046 4.55872C7.99063 4.50142 7.65046 4.7833 7.65046 5.1576V6.21395C7.65046 6.47919 7.34737 6.62983 7.13511 6.46995L3.61939 3.81567C3.30239 3.5763 3.30239 3.10035 3.62032 2.86098L7.13603 0.216867C7.34737 0.0579065 7.65046 0.20855 7.65046 0.472869Z", "fill", "#5F7492"], ["class", "tableViewBTN deleteUser", 3, "click", 4, "ngIf"], [4, "ngIf"], [1, "tableViewBTN", 3, "ngClass"], [1, "devideLine"], ["width", "805", "height", "2", "viewBox", "0 0 805 2", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M0 0.983398H805", "stroke", "black", "stroke-opacity", "0.1"], [1, "ssoUser"], [1, "tableViewBTN", "deleteUser", 3, "click"]],
      template: function FindUserAdminComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "div", 0)(2, "h2", 1);
          core /* ɵɵtext */.EFF(3, "Find User");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "mat-form-field", 2)(5, "mat-label");
          core /* ɵɵtext */.EFF(6, "search by name or email");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "input", 3);
          core /* ɵɵlistener */.bIt("keyup", function FindUserAdminComponent_Template_input_keyup_7_listener($event) {
            return ctx.textChange($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(8, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "div", 4);
          core /* ɵɵtemplate */.DNE(10, FindUserAdminComponent_div_10_Template, 52, 13, "div", 5);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "div", 6);
          core /* ɵɵelement */.nrm(12, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵstyleMap */.Aen(ctx.isLoading ? "filter: blur(3px);" : "");
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵproperty */.Y8G("hidden", ctx.listView);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.filteredUsers);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", !ctx.isLoading);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatFormField, MatLabel, MatInput, ProgressSpinner, fesm2022_forms /* ɵNgNoValidate */.qT, NgControlStatusGroup, NgForm, DatePipe],
      styles: [".headerContainer[_ngcontent-%COMP%]{position:relative;left:50px;top:50px}.h2[_ngcontent-%COMP%]{position:relative;left:21px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;color:#1a3763;margin-bottom:45px}.container[_ngcontent-%COMP%]{position:relative;left:50px;top:50px;margin-top:15px}img[_ngcontent-%COMP%]{position:relative;width:114px;height:112px}form[_ngcontent-%COMP%]{position:relative;display:inline}.nameANDemail[_ngcontent-%COMP%]{position:relative;top:-93px;left:7px}.NandEValues[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:33px;font-size:16px;color:#586d8c;-webkit-user-select:text;user-select:text;display:inline-block}.name[_ngcontent-%COMP%], .email[_ngcontent-%COMP%], .organization[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}.tBTNS[_ngcontent-%COMP%]{position:relative;top:-64px;left:123px}.tableViewBTN[_ngcontent-%COMP%]{position:relative;width:180px;height:53px;background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:18px;color:#1a3763;opacity:.7}.Icon[_ngcontent-%COMP%]{position:relative;top:3px}.devideLine[_ngcontent-%COMP%]{position:relative;top:-27px}.mat-mdc-select-underline[_ngcontent-%COMP%]{display:none}.mat-select-class-set-admin-user-list[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.2);border-radius:6px;position:relative;width:570px;height:46px;line-height:45px;padding-left:8px}[_nghost-%COMP%]   .mat-select-class-set-admin-user-list[_ngcontent-%COMP%]   .mat-mdc-select-arrow[_ngcontent-%COMP%]{color:transparent;width:14px;height:9px;content:url(/assets/SVG/arrow.svg)}.search_bar_wrapper[_ngcontent-%COMP%]{border:1px solid rgba(73,114,132,.2);border-radius:6px;top:7px;width:700px;height:46px;padding-left:8px;margin-left:10px;color:#586d8c}.deleteUser[_ngcontent-%COMP%]{margin-left:25px}[_nghost-%COMP%]   .search_bar_wrapper[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%]{position:relative;bottom:7px}.activatedOrPermanent[_ngcontent-%COMP%]{background-color:#acbdffe6}.deactivated[_ngcontent-%COMP%]{background-color:#ff8e0c66}.ssoUser[_ngcontent-%COMP%]{font-size:16px;color:#1a3763;font-weight:700}"]
    }))();
  }
  return FindUserAdminComponent;
})();