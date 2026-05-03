// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/organization-mgmt/send-email/send-email.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function SendEmailComponent_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 22);
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
let SendEmailComponent = /*#__PURE__*/(() => {
  class SendEmailComponent {
    constructor(_dialog, orgService, groupService, userService) {
      this._dialog = _dialog;
      this.orgService = orgService;
      this.groupService = groupService;
      this.userService = userService;
      this.ssoNoneActiveTime = 2; // in months
    }
    ngOnInit() {
      this.spinnerFlag = false;
      this.messagePlaceHolder = "Enter Message...";
      this.subjectPlaceHolder = "Enter Subject...";
      this.usersPlaceHolder = "Send To Emails...";
      // this.orgPlaceHolder = 'Organization';
      this.userService.user$.pipe((0, take)(1)).subscribe(data => {
        this.selectedOrg = data.userData.organization;
      });
      this.subject = "";
      this.message = "";
      this.selectedGroups = [];
      this.selectedUsers = [];
      this.emailsList = [];
      this.userService.user$.subscribe(user => {
        this.currentUser = user;
      });
      this.groupService.updateOrgUsers();
      this.updateOrgList();
    }
    updateOrgList() {
      if (this.currentUser && this.currentUser.userData.SysAdmin) {
        document.getElementById("allUsersButton").hidden = false;
        document.getElementById("allDeactiveUsersButton").hidden = false;
        this.organizations$ = this.orgService.getAllOrganizations();
      } else if (this.currentUser) {
        this.organizations$ = (0, observable_of.of)([{
          name: this.currentUser.userData.organization
        }]);
      }
    }
    getOrgRef(event) {
      // const btn = <HTMLInputElement>document.getElementById('orgButton');
      // btn.disabled = false;
      this.selectedOrg = event.value;
      this.groupService.updateOrgGroups(this.selectedOrg);
      this.groupService.updateOrgUsers(this.selectedOrg);
    }
    isSSOUserWasntActiveLately(user) {
      let lastAuth = user.lastAuthTime;
      if (String(lastAuth).length < 13) {
        lastAuth = Number(String(user.lastAuthTime) + "0".repeat(13 - String(user.lastAuthTime).length));
      }
      if (new Date(Number(new Date()) - Number(new Date(lastAuth))).getMonth() >= Number(this.ssoNoneActiveTime)) {
        return true;
      }
      return false;
    }
    selectAllUsers() {
      var _this = this;
      return (0, default)(function* () {
        const date = new Date();
        const currentDate = date.getTime() + 5184000000;
        _this.emailsList = [];
        _this.EmailsString = "";
        const organizations = yield _this.orgService.getAllOrgs();
        organizations.forEach(org => {
          _this.orgService.getOrganizationUsers(org.name).then(users => {
            if (users) {
              users.forEach(user => {
                if (user) {
                  if (!user.email_subscription || !user.isActive || user.exp_date !== "" && new Date() > new Date(Number(user.exp_date))) {
                    return;
                  }
                  if (user.sso_user && _this.isSSOUserWasntActiveLately(user)) {
                    return;
                  }
                  _this.EmailsString = _this.EmailsString + "<" + user.Email + "> ";
                  _this.emailsList.push(user.Email);
                }
              });
            }
          });
        });
      })();
    }
    selectAllInactiveUsers() {
      var _this2 = this;
      return (0, default)(function* () {
        const date = new Date();
        _this2.emailsList = [];
        _this2.EmailsString = "";
        const organizations = yield _this2.orgService.getAllOrgs();
        organizations.forEach(org => {
          _this2.orgService.getOrganizationUsers(org.name).then(users => {
            if (!users) {
              return;
            }
            users.forEach(user => {
              if (!user || !user.email_subscription) {
                return;
              }
              if (!user.isActive || user.exp_date !== "" && new Date() > new Date(Number(user.exp_date)) || user.sso_user && _this2.isSSOUserWasntActiveLately(user)) {
                _this2.EmailsString = _this2.EmailsString + "<" + user.Email + "> ";
                _this2.emailsList.push(user.Email);
              }
            });
          });
        });
      })();
    }
    sendEmail() {
      if (this.message === "" || this.subject === "" || this.emailsList.length === 0) {
        (0, validationAlert)("One or more of the fields is missing..", null, "Error");
        return;
      }
      this.spinnerFlag = true;
      let message;
      let subject;
      if (this.currentUser.userData.SysAdmin) {
        message = this.message + "\n\n\nDo not reply to this mail";
        subject = "A system Message From OPCloud: " + this.subject;
      } else if (this.currentUser.userData.OrgAdmin) {
        subject = "Admin Message From OPCloud: " + this.subject;
        message = this.currentUser.userData.Name + " From organization " + this.currentUser.userData.organization + " Send to you the following  message using OPCloud: \n\n\n" + this.message + "\n\n\nDo not reply to this mail";
      } else {
        subject = "A message From OPCloud: " + this.subject;
      }
      this.orgService.sendMail(this.emailsList, subject, message).then(res => {
        this.spinnerFlag = false;
        this.message = "";
        this.subject = "";
        this.selectedUsers = [];
        this.selectedGroups = [];
        this.EmailsString = "";
        this.updateOrgList();
        (0, validationAlert)("The Email was sent Successfully!", null, "Success");
      });
    }
    collDialogOpen() {
      const dialogRef = this._dialog.open(CollaborationDialogComponent, {
        // height: '600px',
        width: "775px",
        data: {
          userToken: "",
          headLine: "Select Users and Groups in " + this.selectedOrg + " organization",
          userChkBoxFlag: true,
          groupChkBoxFlag: true,
          groupChkBoxOneAble: false,
          currentUser: this.currentUser,
          org: this.selectedOrg,
          checkedUsers: this.selectedUsers,
          checkedGroups: this.selectedGroups,
          modelOwner: "",
          disableUnsubscribedEmails: true
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.selectedGroups = data.checkedGroupList;
          this.selectedUsers = data.checkedUserList;
          this.createUserEmailsList();
        }
      });
    }
    createUserEmailsList() {
      this.emailsList = [];
      this.EmailsString = "";
      this.selectedUsers.forEach(userID => {
        if (userID) {
          const user = this.groupService.getUserById(userID);
          if (user) {
            this.EmailsString = this.EmailsString + "<" + user.Email + "> ";
            this.emailsList.push(user.Email);
          }
        }
      });
    }
    ssoNoneActiveTimeChange($event) {
      this.ssoNoneActiveTime = Number($event.target.value);
    }
    static #_ = (() => this.ɵfac = function SendEmailComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SendEmailComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SendEmailComponent,
      selectors: [["opcloud-send-email"]],
      decls: 53,
      vars: 17,
      consts: [[1, "container"], [1, "mat-headline"], ["ng-controller", "AppCtrl as ctrl", 3, "hidden"], ["id", "organization", "ng-controller", "selectOrg"], ["id", "mat-select-id-send-email", 3, "selectionChange", "matTooltip", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["id", "btnDiv"], ["mat-raised-button", "", "id", "orgButton", 3, "click"], ["id", "allUsersButton", "hidden", "", 3, "click"], ["id", "allDeactiveUsersButton", "hidden", "", 3, "click"], [2, "height", "35px", "margin-left", "375px", "color", "#1a3763"], ["type", "number", "min", "1", 1, "nonActiveInput", 2, "width", "40px", 3, "change", "value"], ["id", "SendToEmails", 1, "to-users-input"], ["matInput", "", "disabled", "", "ngModel", "users", "matTooltip", "The Emails Address will be generated when selected", "name", "users", 3, "ngModelChange", "placeholder", "ngModel"], ["id", "subjectInput", 1, "sign-in-input"], ["matInput", "", "ngModel", "subject", "name", "subject", 3, "ngModelChange", "placeholder", "ngModel"], [2, "display", "flex"], [2, "margin-top", "5px"], [1, "text-area", 2, "position", "relative", "left", "135px"], ["rows", "10", "matInput", "", "ngModel", "message", "name", "message", 3, "ngModelChange", "placeholder", "ngModel"], ["mat-raised-button", "", "id", "sendMailBTN", 3, "click"], [2, "position", "absolute", "left", "45%", 3, "hidden"], [3, "value"]],
      template: function SendEmailComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "span", 1);
          core /* ɵɵtext */.EFF(2, "Send Email");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div", 2);
          core /* ɵɵelement */.nrm(4, "br");
          core /* ɵɵelementStart */.j41(5, "div", 3)(6, "span");
          core /* ɵɵtext */.EFF(7, "Organization: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "mat-select", 4);
          core /* ɵɵlistener */.bIt("selectionChange", function SendEmailComponent_Template_mat_select_selectionChange_8_listener($event) {
            return ctx.getOrgRef($event);
          });
          core /* ɵɵtemplate */.DNE(9, SendEmailComponent_mat_option_9_Template, 2, 2, "mat-option", 5);
          core /* ɵɵpipe */.nI1(10, "async");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "div", 6)(12, "button", 7);
          core /* ɵɵlistener */.bIt("click", function SendEmailComponent_Template_button_click_12_listener() {
            return ctx.collDialogOpen();
          });
          core /* ɵɵtext */.EFF(13, "Select Users");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "button", 8);
          core /* ɵɵlistener */.bIt("click", function SendEmailComponent_Template_button_click_14_listener() {
            return ctx.selectAllUsers();
          });
          core /* ɵɵtext */.EFF(15, "Select All System Users");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "button", 9);
          core /* ɵɵlistener */.bIt("click", function SendEmailComponent_Template_button_click_16_listener() {
            return ctx.selectAllInactiveUsers();
          });
          core /* ɵɵtext */.EFF(17, "Select All Inactive Users");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "div", 10)(19, "span");
          core /* ɵɵtext */.EFF(20, "SSO none active for:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "input", 11);
          core /* ɵɵlistener */.bIt("change", function SendEmailComponent_Template_input_change_21_listener($event) {
            return ctx.ssoNoneActiveTimeChange($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(22, "span");
          core /* ɵɵtext */.EFF(23, " months");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(24, "br")(25, "br");
          core /* ɵɵelementStart */.j41(26, "div")(27, "span");
          core /* ɵɵtext */.EFF(28, "To: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(29, "mat-form-field", 12)(30, "mat-label");
          core /* ɵɵtext */.EFF(31);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(32, "input", 13);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SendEmailComponent_Template_input_ngModelChange_32_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.EmailsString, $event)) {
              ctx.EmailsString = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(33, "div")(34, "span");
          core /* ɵɵtext */.EFF(35, "Subject: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "mat-form-field", 14)(37, "mat-label");
          core /* ɵɵtext */.EFF(38);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(39, "input", 15);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SendEmailComponent_Template_input_ngModelChange_39_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.subject, $event)) {
              ctx.subject = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(40, "div", 16)(41, "span", 17);
          core /* ɵɵtext */.EFF(42, "Message: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(43, "mat-form-field", 18)(44, "mat-label");
          core /* ɵɵtext */.EFF(45);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(46, "textarea", 19);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SendEmailComponent_Template_textarea_ngModelChange_46_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.message, $event)) {
              ctx.message = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(47, "button", 20);
          core /* ɵɵlistener */.bIt("click", function SendEmailComponent_Template_button_click_47_listener() {
            return ctx.sendEmail();
          });
          core /* ɵɵtext */.EFF(48, "Send Email");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(49, "div", 21);
          core /* ɵɵelement */.nrm(50, "progress-spinner");
          core /* ɵɵelementStart */.j41(51, "span", 1);
          core /* ɵɵtext */.EFF(52, "Sending.... Please wait");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx.selectedOrg);
          core /* ɵɵpropertyInterpolate */.FS9("value", ctx.selectedOrg);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(10, 15, ctx.organizations$));
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵproperty */.Y8G("value", ctx.ssoNoneActiveTime);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtextInterpolate */.JRh(ctx.usersPlaceHolder);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.usersPlaceHolder);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.EmailsString);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtextInterpolate */.JRh(ctx.subjectPlaceHolder);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.subjectPlaceHolder);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.subject);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtextInterpolate */.JRh(ctx.messagePlaceHolder);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("placeholder", ctx.messagePlaceHolder);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.message);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
        }
      },
      dependencies: [NgForOf, MatFormField, MatLabel, MatInput, MatTooltip, MatSelect, MatOption, MatButton, ProgressSpinner, DefaultValueAccessor, NgControlStatus, NgModel, AsyncPipe],
      styles: [".container[_ngcontent-%COMP%]{position:relative;top:50px;left:50px;color:#1a3763}.mat-headline[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;color:#1a3763}#btnDiv[_ngcontent-%COMP%]{position:relative}#orgButton[_ngcontent-%COMP%]{position:relative;left:205px;top:-18px;background:#1a3763;color:#fff;letter-spacing:normal}#allUsersButton[_ngcontent-%COMP%]{position:relative;left:234px;top:-18px;background:#1a3763;color:#fff;letter-spacing:normal;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px}#allDeactiveUsersButton[_ngcontent-%COMP%]{position:relative;left:250px;top:-18px;background:#1a3763;color:#fff;letter-spacing:normal;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px}.nonActiveInput[_ngcontent-%COMP%]{position:relative;height:46px;width:57px;margin-bottom:25px;border:1px solid rgba(73,114,132,.2);border-radius:6px;text-align:center}.to-users-input[_ngcontent-%COMP%]{position:relative;left:179px;margin-bottom:26px;width:570px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.sign-in-input[_ngcontent-%COMP%]{position:relative;left:148px;margin-bottom:26px;width:570px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.text-area[_ngcontent-%COMP%]{position:relative;left:138px;margin-bottom:26px;width:570px;height:220px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#sendMailBTN[_ngcontent-%COMP%]{background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;position:relative;left:205px}#organization[_ngcontent-%COMP%]{padding-bottom:40px}.mat-mdc-input-placeholder[_ngcontent-%COMP%]{position:relative;left:12px;font-weight:400;line-height:33px;font-size:16px;color:#586d8c}.mat-mdc-input-underline[_ngcontent-%COMP%]{display:none}.container[_ngcontent-%COMP%]::-webkit-scrollbar{width:6px}.container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{width:4px;background:#b9d2df;border-radius:1px}.container[_ngcontent-%COMP%]::-webkit-scrollbar-track{width:1px;background:#b9d2df54;border-radius:1px}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}#subjectInput[_ngcontent-%COMP%]{position:relative;left:140px}#SendToEmails[_ngcontent-%COMP%]{position:relative;left:175px}"]
    }))();
  }
  return SendEmailComponent;
})();
