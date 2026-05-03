// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/user-mgmt/new-user/new-user.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function SettingsNewUser_mat_option_41_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 35);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r1 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", org_r1.name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r1.name);
  }
}
function SettingsNewUser_mat_error_106_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-error");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.authError);
  }
}
let SettingsNewUser = /*#__PURE__*/(() => {
  class SettingsNewUser {
    constructor(userService, orgService, groupService, _dialog) {
      this.userService = userService;
      this.orgService = orgService;
      this.groupService = groupService;
      this._dialog = _dialog;
      this.defaultData = new Date();
      this.isActive = true;
      this.menuOpen = false;
      this.user = {
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        organization: "",
        exp_date: this.defaultData.getTime() + 5184000000,
        isPermanent: false,
        forceToChangeInitialPassword: true,
        viewer: false,
        executionUser: false,
        dsmUser: false,
        insightsUser: false,
        genAIUser: false
      };
      this.authError = null;
    }
    ngOnInit() {
      const that = this;
      this.userService.user$.pipe((0, take)(1)).subscribe(data => {
        const user = data.userData;
        if (user.SysAdmin) {
          this.organizations$ = this.orgService.getOrganizations();
        } else {
          this.organizations$ = (0, observable_of.of)([{
            id: user._organization,
            name: user.organization
          }]);
        }
        this.user.organization = this.userService.userOrg;
        that.orgService.getOrganization(this.user.organization).then(res => {
          that.orgSettings = res;
          that.user.dsmUser = res.defaultUserOptions.dsmUser;
          that.user.insightsUser = res.defaultUserOptions.insightsUser;
          that.user.viewer = res.defaultUserOptions.viewer;
          that.user.executionUser = res.defaultUserOptions.executionUser;
          that.user.genAIUser = res.defaultUserOptions.genAIUser || false;
        });
      });
    }
    compareOrgs(o1, o2) {
      return o1 === o2;
    }
    addUser() {
      if (!this.validateInput()) {
        //needs to add Org validation
        return;
      }
      // Map frontend properties to backend properties
      const userToRegister = {
        ...this.user,
        IsDSMUser: this.user.dsmUser,
        IsInsightsUser: this.user.insightsUser,
        isExecutionUser: this.user.executionUser,
        isViewerAccount: this.user.viewer
      };
      // Remove frontend property names
      delete userToRegister.dsmUser;
      delete userToRegister.insightsUser;
      delete userToRegister.executionUser;
      delete userToRegister.viewer;
      this.userService.registerUser(userToRegister).then(res => {
        if (res.success) {
          (0, validationAlert)("New user created", null, "Success");
          this.user = {
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            organization: this.userService.userOrg,
            exp_date: this.defaultData.getTime() + 5184000000,
            isPermanent: false,
            forceToChangeInitialPassword: true,
            dsmUser: this.orgSettings.defaultUserOptions.dsmUser,
            insightsUser: this.orgSettings.defaultUserOptions.insightsUser,
            viewer: this.orgSettings.defaultUserOptions.viewer,
            executionUser: this.orgSettings.defaultUserOptions.executionUser,
            genAIUser: this.orgSettings.defaultUserOptions.genAIUser
          };
          return;
        }
        this.authError = res.message;
      }).catch(err => {
        this.authError = err.message;
      });
    }
    toggleMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
        this.isActive = true;
        return;
      } else if (!this.menuOpen) {
        this.menuOpen = true;
        this.isActive = false;
      }
    }
    addingExcelFile() {
      this.toggleMenu();
      this._dialog.open(AddUserComponent, {
        width: "600"
      });
    }
    validateInput() {
      this.authError = null;
      //Verify mandatory fields
      let mandatoryFields = ["Name", "Email", "password", "Organization"];
      for (let field of mandatoryFields) {
        if (this.user[field] === "") {
          const msg = "The field " + field + " is empty";
          (0, validationAlert)(msg, 3500, "Error");
          this.authError = "'" + field + "' field can't be empty";
          return false;
        }
      }
      //Password Check
      if (!this.isPasswordMatch()) {
        const msg = " The passwords do not match!";
        (0, validationAlert)(msg, 3500, "Error");
        this.authError = "Password and Repeat-Password doesn't Match";
        return false;
      }
      return true;
    }
    isPasswordMatch() {
      return this.user.password === this.user.repeatPassword;
    }
    static #_ = (() => this.ɵfac = function SettingsNewUser_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SettingsNewUser)(core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SettingsNewUser,
      selectors: [["new-user"]],
      decls: 107,
      vars: 24,
      consts: [[1, "new-user-wrapper"], ["id", "h1"], [1, "new-user"], ["id", "name"], [1, "fieldNames"], ["id", "nameInput"], ["matInput", "", "placeholder", "Name", "autocomplete", "off", 3, "ngModelChange", "ngModel"], ["id", "email"], ["id", "emailInput"], ["matInput", "", "placeholder", "Email", "autocomplete", "off", "type", "email", 3, "ngModelChange", "ngModel"], ["id", "password"], ["id", "passwordInput"], ["matInput", "", "placeholder", "Password", "autocomplete", "off", "type", "password", 3, "ngModelChange", "ngModel"], ["id", "rptPassword"], ["id", "rptPasswordsInput"], ["matInput", "", "placeholder", "Repeat Password", "autocomplete", "off", "type", "password", 3, "ngModelChange", "ngModel"], ["id", "organization"], ["id", "organizationField", 1, "fieldNames"], ["placeholder", "Organization", "id", "organizationSelect", 3, "ngModelChange", "compareWith", "ngModel"], ["label", "Select Organization"], [3, "value", 4, "ngFor", "ngForOf"], [1, "userSpecs"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], ["type", "checkbox", 2, "margin-left", "213px", 3, "ngModelChange", "ngModel"], ["type", "checkbox", 2, "margin-left", "215px", 3, "ngModelChange", "ngModel"], ["type", "checkbox", 2, "margin-left", "230px", 3, "ngModelChange", "ngModel"], ["type", "checkbox", 2, "margin-left", "250px", 3, "ngModelChange", "ngModel"], ["type", "checkbox", 2, "margin-left", "192px", 3, "ngModelChange", "ngModel"], ["id", "exp_date_container"], [2, "margin-right", "10px"], [3, "dateChange", "date"], ["type", "checkbox", "name", "isPermanent", 2, "margin-left", "97px", 3, "ngModelChange", "ngModel"], ["mat-raised-button", "", "id", "createuserBTN", 3, "click"], ["mat-raised-button", "", "id", "createUserFromExcelBtn", 3, "click"], [4, "ngIf"], [3, "value"]],
      template: function SettingsNewUser_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "span", 1);
          core /* ɵɵtext */.EFF(2, " Adding New User");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div", 2)(4, "div", 3)(5, "span", 4);
          core /* ɵɵtext */.EFF(6, " Full Name ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "mat-form-field", 5)(8, "mat-label");
          core /* ɵɵtext */.EFF(9, "Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "input", 6);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_10_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.name, $event)) {
              ctx.user.name = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(11, "br");
          core /* ɵɵelementStart */.j41(12, "div", 7)(13, "span", 4);
          core /* ɵɵtext */.EFF(14, " Email Address ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(15, "mat-form-field", 8)(16, "mat-label");
          core /* ɵɵtext */.EFF(17, "Email");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "input", 9);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_18_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.email, $event)) {
              ctx.user.email = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(19, "br");
          core /* ɵɵelementStart */.j41(20, "div", 10)(21, "span", 4);
          core /* ɵɵtext */.EFF(22, " Password ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "mat-form-field", 11)(24, "mat-label");
          core /* ɵɵtext */.EFF(25, "Password");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "input", 12);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_26_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.password, $event)) {
              ctx.user.password = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(27, "br");
          core /* ɵɵelementStart */.j41(28, "div", 13)(29, "span", 4);
          core /* ɵɵtext */.EFF(30, " Repeat Password ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "mat-form-field", 14)(32, "mat-label");
          core /* ɵɵtext */.EFF(33, "Repeat Password");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "input", 15);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_34_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.repeatPassword, $event)) {
              ctx.user.repeatPassword = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(35, "br");
          core /* ɵɵelementStart */.j41(36, "div", 16)(37, "span", 17);
          core /* ɵɵtext */.EFF(38, " Organization ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(39, "mat-select", 18);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_mat_select_ngModelChange_39_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.organization, $event)) {
              ctx.user.organization = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(40, "mat-optgroup", 19);
          core /* ɵɵtemplate */.DNE(41, SettingsNewUser_mat_option_41_Template, 2, 2, "mat-option", 20);
          core /* ɵɵpipe */.nI1(42, "async");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(43, "br")(44, "br");
          core /* ɵɵelementStart */.j41(45, "div", 21)(46, "span");
          core /* ɵɵtext */.EFF(47, " Force Initial Password Change ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(48, "span")(49, "input", 22);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_49_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.forceToChangeInitialPassword, $event)) {
              ctx.user.forceToChangeInitialPassword = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(50, "span");
          core /* ɵɵtext */.EFF(51);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(52, "br");
          core /* ɵɵelementStart */.j41(53, "div", 21)(54, "span");
          core /* ɵɵtext */.EFF(55, " Viewer Account ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(56, "span")(57, "input", 23);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_57_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.viewer, $event)) {
              ctx.user.viewer = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(58, "span");
          core /* ɵɵtext */.EFF(59);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(60, "br");
          core /* ɵɵelementStart */.j41(61, "div", 21)(62, "span");
          core /* ɵɵtext */.EFF(63, " Execution User ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(64, "span")(65, "input", 24);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_65_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.executionUser, $event)) {
              ctx.user.executionUser = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(66, "span");
          core /* ɵɵtext */.EFF(67);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(68, "br");
          core /* ɵɵelementStart */.j41(69, "div", 21)(70, "span");
          core /* ɵɵtext */.EFF(71, " Insights User ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(72, "span")(73, "input", 25);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_73_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.insightsUser, $event)) {
              ctx.user.insightsUser = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(74, "span");
          core /* ɵɵtext */.EFF(75);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(76, "br");
          core /* ɵɵelementStart */.j41(77, "div", 21)(78, "span");
          core /* ɵɵtext */.EFF(79, " DSM User ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(80, "span")(81, "input", 26);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_81_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.dsmUser, $event)) {
              ctx.user.dsmUser = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(82, "span");
          core /* ɵɵtext */.EFF(83);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(84, "br");
          core /* ɵɵelementStart */.j41(85, "div", 21)(86, "span");
          core /* ɵɵtext */.EFF(87, " GenerativeAI User ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(88, "span")(89, "input", 27);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_89_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.genAIUser, $event)) {
              ctx.user.genAIUser = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(90, "span");
          core /* ɵɵtext */.EFF(91);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(92, "div", 28)(93, "span", 29);
          core /* ɵɵtext */.EFF(94, "Expiration date");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(95, "span")(96, "opcloud-calander", 30);
          core /* ɵɵtwoWayListener */.mxI("dateChange", function SettingsNewUser_Template_opcloud_calander_dateChange_96_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.exp_date, $event)) {
              ctx.user.exp_date = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(97, "span")(98, "input", 31);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewUser_Template_input_ngModelChange_98_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user.isPermanent, $event)) {
              ctx.user.isPermanent = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(99, " No Expiration ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(100, "div")(101, "button", 32);
          core /* ɵɵlistener */.bIt("click", function SettingsNewUser_Template_button_click_101_listener() {
            return ctx.addUser();
          });
          core /* ɵɵtext */.EFF(102, "Save Changes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(103, " \xA0 ");
          core /* ɵɵelementStart */.j41(104, "button", 33);
          core /* ɵɵlistener */.bIt("click", function SettingsNewUser_Template_button_click_104_listener() {
            return ctx.addingExcelFile();
          });
          core /* ɵɵtext */.EFF(105, "Add Excel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(106, SettingsNewUser_mat_error_106_Template, 2, 1, "mat-error", 34);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.name);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.email);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.password);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.repeatPassword);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("compareWith", ctx.compareOrgs);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.organization);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(42, 22, ctx.organizations$));
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.forceToChangeInitialPassword);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(" " + ctx.user.forceToChangeInitialPassword);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.viewer);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(" " + ctx.user.viewer);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.executionUser);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(" " + ctx.user.executionUser);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.insightsUser);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(" " + ctx.user.insightsUser);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.dsmUser);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(" " + ctx.user.dsmUser);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.genAIUser);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(" " + ctx.user.genAIUser);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("date", ctx.user.exp_date);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user.isPermanent);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.authError);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatError, MatInput, MatSelect, MatOption, MatOptgroup, MatButton, CalanderComponent, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, AsyncPipe],
      styles: [".new-user-wrapper[_ngcontent-%COMP%], .new-user[_ngcontent-%COMP%]{position:relative;left:50px;top:50px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;color:#586d8c!important}#h1[_ngcontent-%COMP%]{font-weight:500;line-height:normal;font-size:20px;color:#1a3763;margin-bottom:20px}.fieldNames[_ngcontent-%COMP%], .userSpecs[_ngcontent-%COMP%]{position:relative;top:-15px;font-weight:400;line-height:normal;font-size:16px;color:#1a3763}#name[_ngcontent-%COMP%]{position:relative}#nameInput[_ngcontent-%COMP%]{position:relative;border:1px solid rgba(73,114,132,.2);border-radius:6px;top:13px;width:570px;height:46px;padding-left:8px;margin-left:10px;color:#586d8c;left:103px}#email[_ngcontent-%COMP%]{position:relative}#emailInput[_ngcontent-%COMP%]{position:relative;border:1px solid rgba(73,114,132,.2);border-radius:6px;top:13px;width:570px;height:46px;padding-left:8px;margin-left:10px;color:#586d8c;left:74px}#password[_ngcontent-%COMP%]{position:relative}#passwordInput[_ngcontent-%COMP%]{position:relative;border:1px solid rgba(73,114,132,.2);border-radius:6px;top:13px;width:570px;height:46px;padding-left:8px;margin-left:10px;color:#586d8c;left:106px}#rptPasswords[_ngcontent-%COMP%]{position:relative}#rptPasswordsInput[_ngcontent-%COMP%]{position:relative;border:1px solid rgba(73,114,132,.2);border-radius:6px;top:13px;width:570px;height:46px;padding-left:8px;margin-left:10px;color:#586d8c;left:49px}#organization[_ngcontent-%COMP%]{position:relative;top:13px}#organizationField[_ngcontent-%COMP%]{position:relative;top:2px}#createuserBTN[_ngcontent-%COMP%], #createUserFromExcelBtn[_ngcontent-%COMP%]{position:relative;top:40px;width:219px;height:53px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;letter-spacing:normal}.mat-mdc-input-underline[_ngcontent-%COMP%]{display:none}#exp_date_container[_ngcontent-%COMP%]{position:relative;top:15px;color:#1a3763}#exp_date_selector[_ngcontent-%COMP%]{position:relative;left:85px}input[type=checkbox][_ngcontent-%COMP%]{position:relative;top:4px;width:17px;height:17px;border:none;margin-left:105px}.mat-mdc-form-field-infix[_ngcontent-%COMP%]{top:-.25em}.mat-mdc-form-field-prefix[_ngcontent-%COMP%], .mat-mdc-form-field-appearance-outline[_ngcontent-%COMP%]   .mat-mdc-form-field-suffix[_ngcontent-%COMP%]{top:-.25em!important}.mat-mdc-form-field-label[_ngcontent-%COMP%]{margin-top:0}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.mat-error[_ngcontent-%COMP%]{position:relative;top:-70px;left:30px}"]
    }))();
  }
  return SettingsNewUser;
})();