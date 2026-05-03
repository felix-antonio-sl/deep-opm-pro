// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/group-mgmt/add-group/add-group.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function AddGroupComponent_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 19);
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
function AddGroupComponent_tr_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr", 20)(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "td")(8, "div")(9, "button", 21);
    core /* ɵɵlistener */.bIt("click", function AddGroupComponent_tr_37_Template_button_click_9_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.addMember(user_r3));
    });
    core /* ɵɵtext */.EFF(10, "Add to Group");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(11, "button", 22);
    core /* ɵɵlistener */.bIt("click", function AddGroupComponent_tr_37_Template_button_click_11_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.deleteMember(user_r3));
    });
    core /* ɵɵtext */.EFF(12, "Delete from Group");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(13, "button", 21);
    core /* ɵɵlistener */.bIt("click", function AddGroupComponent_tr_37_Template_button_click_13_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.addMemberToAdmin(user_r3));
    });
    core /* ɵɵtext */.EFF(14, "Add to Admins");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(15, "button", 22);
    core /* ɵɵlistener */.bIt("click", function AddGroupComponent_tr_37_Template_button_click_15_listener() {
      const user_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.deleteAdminUser(user_r3));
    });
    core /* ɵɵtext */.EFF(16, "Delete from Admin Group");
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const user_r3 = ctx.$implicit;
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(user_r3.Name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(user_r3.Email);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.selectedOrg);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵpropertyInterpolate1 */.Mz_("id", "Add", user_r3.uid, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate1 */.Mz_("id", "Del", user_r3.uid, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate1 */.Mz_("id", "AdminAdd", user_r3.uid, "");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate1 */.Mz_("id", "AdminDel", user_r3.uid, "");
  }
}
let AddGroupComponent = /*#__PURE__*/(() => {
  class AddGroupComponent {
    constructor(_dialog, orgService, groupService, userService) {
      this._dialog = _dialog;
      this.orgService = orgService;
      this.groupService = groupService;
      this.userService = userService;
      this.parentGroup = "";
      this.parentGroupName = "";
      this.group = {
        nameOfGroup: "",
        ID: "",
        descriptionOfGroup: "",
        parentID: ""
      };
      this.orgUsers = [];
      this.multipleusersToAdd = [];
      this.createAdminGroup = true;
    }
    ngOnInit() {
      let user;
      if (this.userService.user) {
        user = this.userService.user.userData;
      }
      if (user && user.SysAdmin) {
        this.organizations$ = this.orgService.getOrganizations();
      } else {
        this.organizations$ = (0, observable_of.of)([{
          id: user._organization,
          name: user.organization
        }]);
      }
      this.descriptionPlaceHolder = "Enter Description...";
      this.namePlaceHolder = "Enter Name...";
      this.parentPlaceHolder = "Parent Name";
      this.userService.user$.subscribe(user => this.currentUser = user);
      this.groupService.updateOrgUsers();
      this.selectedOrg = user.organization;
    }
    getOrgRef(event) {
      const btn = document.getElementById("orgButton");
      btn.disabled = false;
      this.selectedOrg = event.value;
      this.groupService.updateOrgGroups(this.selectedOrg);
      this.groupService.updateOrgUsers(this.selectedOrg);
    }
    collDialogOpen() {
      const dialogRef = this._dialog.open(CollaborationDialogComponent, {
        // height: '600px',
        width: "775px",
        data: {
          userToken: "",
          headLine: "Select group's parent in " + this.selectedOrg + " organization",
          userChkBoxFlag: false,
          groupChkBoxFlag: true,
          groupChkBoxOneAble: true,
          currentUser: this.currentUser,
          org: this.selectedOrg,
          checkedUsers: [],
          checkedGroups: [this.parentGroup],
          modelOwner: ""
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.group = {
            nameOfGroup: "",
            ID: "",
            descriptionOfGroup: "",
            parentID: ""
          };
          this.parentGroup = data.chosenGroup;
          if (this.parentGroup === "") {
            this.parentGroupName = "";
          } else {
            this.orgService.getGroupFromOrg(this.selectedOrg, this.parentGroup).then(group => {
              this.parentGroupName = group.Name;
            });
          }
          document.getElementById("userDisplayForm").hidden = true;
        }
      });
    }
    saveParams() {
      if (typeof this.selectedOrg === "undefined" || this.group.nameOfGroup === "") {
        const message = "Something is missing..., you must choose an organization and a name for the group";
        (0, validationAlert)(message, 4500, "Error");
        return;
      }
      this.addGroup();
      this.getOrgUsersForDisplay(this.selectedOrg, this.parentGroup);
      this.groupService.updateOrgGroups(this.selectedOrg);
      this.group = {
        nameOfGroup: this.group.nameOfGroup,
        descriptionOfGroup: this.group.descriptionOfGroup,
        parentID: this.parentGroup,
        ID: ""
      };
    }
    addGroup() {
      this.orgService.getGroups(this.selectedOrg).then(groups => {
        let groupExists = false;
        groups.forEach(group => {
          if (group.Name === this.group.nameOfGroup && group.Parent === this.group.parentID) {
            groupExists = true;
          }
        });
        if (groupExists) {
          const message = this.group.nameOfGroup + " already exists in organization " + this.selectedOrg + " please choose different name";
          (0, validationAlert)(message, 4500, "Error");
          document.getElementById("userDisplayForm").hidden = true;
          return false;
        } else {
          const groupIDPromise = this.groupService.addGroup(this.selectedOrg, this.group.nameOfGroup, this.group.descriptionOfGroup, this.parentGroup, this.parentGroupName);
          groupIDPromise.then(groupID => {
            this.group.ID = groupID;
            document.getElementById("userDisplayForm").hidden = false;
            this.groupService.updateOrgGroups(this.selectedOrg);
            const success_adding_group_message = "creating group succeeded";
            (0, validationAlert)(success_adding_group_message, null, "Success");
            return true;
          });
        }
      });
    }
    getOrgUsersForDisplay(org, parent) {
      this.orgUsers = [];
      return this.orgService.getOrganizationUsers(org).then(members => {
        if (parent === "") {
          // get parent members only
          return this.orgUsers = members;
        } else {
          this.orgService.getGroupFromOrg(org, parent).then(parentGroup => {
            const parentMembersIDs = Object.getOwnPropertyNames(parentGroup.Members);
            members.forEach(member => {
              if (parentMembersIDs.includes(member.uid)) {
                this.orgUsers.push(member);
              }
            });
            return this.orgUsers;
          });
        }
      });
    }
    addMember(user) {
      document.getElementById("Add" + user.uid).hidden = true;
      document.getElementById("Del" + user.uid).hidden = false;
      this.groupService.addMembers(user, this.group.ID, this.selectedOrg);
      (0, validationAlert)("Changes were saved", null, "Success");
    }
    addMultipleUsers(user) {
      document.getElementById("Add" + user.uid).hidden = true;
      if (this.multipleusersToAdd.find(u => u.uid === user.uid) === undefined) {
        this.multipleusersToAdd.push(user);
      }
    }
    deleteMember(user) {
      document.getElementById("Add" + user.uid).hidden = false;
      document.getElementById("Del" + user.uid).hidden = true;
      this.groupService.delUserFromGroup(this.selectedOrg, this.group.ID, user);
      (0, validationAlert)("Changes were saved", null, "Success");
    }
    deleteAdminUser(user) {
      document.getElementById("AdminAdd" + user.uid).hidden = false;
      document.getElementById("AdminDel" + user.uid).hidden = true;
      this.groupService.delAdminGroupUser(this.selectedOrg, this.group.ID, user);
      (0, validationAlert)("Changes were saved", null, "Success");
    }
    addAdminGroup() {
      if (this.createAdminGroup) {
        this.createAdminGroup = false;
      } else {
        this.createAdminGroup = true;
      }
    }
    addMemberToAdmin(user) {
      document.getElementById("AdminAdd" + user.uid).hidden = true;
      document.getElementById("AdminDel" + user.uid).hidden = false;
      this.groupService.addUserToAdminGroup(this.selectedOrg, this.group.ID, user);
      (0, validationAlert)("Changes were saved", null, "Success");
    }
    static #_ = (() => this.ɵfac = function AddGroupComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AddGroupComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: AddGroupComponent,
      selectors: [["opcloud-add-group"]],
      decls: 40,
      vars: 12,
      consts: [[1, "container"], ["ng-controller", "AppCtrl as ctrl"], [1, "mat-headline"], ["id", "organization", "ng-controller", "selectOrg"], ["placeholder", "Organization", "id", "organizationSelect", 1, "add-group-selection", 3, "selectionChange", "ngModelChange", "matTooltip", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["mat-raised-button", "", "id", "orgButton", 3, "click"], [1, "sign-in-input"], ["disabled", "", "matInput", "", "ngModel", "unameOfGroup", "name", "unameOfGroup", 3, "ngModelChange", "placeholder", "ngModel"], ["id", "groupName", 1, "sign-in-input"], ["matInput", "", "ngModel", "unameOfGroup", "name", "unameOfGroup", 3, "ngModelChange", "placeholder", "ngModel"], ["id", "groupDescription", 1, "sign-in-input"], ["matInput", "", "ngModel", "udescriptionOfGroup", "name", "udescriptionOfGroup", 1, "udescriptionOfGroup", 3, "ngModelChange", "placeholder", "ngModel"], ["mat-raised-button", "", "id", "creatGroupBTN", 3, "click"], [1, "userDisplay"], ["id", "userDisplayForm", "hidden", "", 1, "userDisplayForm"], [1, "table"], ["mat-body", ""], ["mat-row", "", "mat-select", "user", "mat-select-id", "email", "mat-auto-select", "", 4, "ngFor", "ngForOf"], [3, "value"], ["mat-row", "", "mat-select", "user", "mat-select-id", "email", "mat-auto-select", ""], ["mat-raised-button", "", "type", "button", 3, "click", "id"], ["mat-raised-button", "", "type", "button", "hidden", "", 3, "click", "id"]],
      template: function AddGroupComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "div", 2);
          core /* ɵɵtext */.EFF(3, "Create Group");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(4, "br");
          core /* ɵɵelementStart */.j41(5, "div", 3)(6, "span");
          core /* ɵɵtext */.EFF(7, "Organization: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "mat-select", 4);
          core /* ɵɵlistener */.bIt("selectionChange", function AddGroupComponent_Template_mat_select_selectionChange_8_listener($event) {
            return ctx.getOrgRef($event);
          });
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AddGroupComponent_Template_mat_select_ngModelChange_8_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.selectedOrg, $event)) {
              ctx.selectedOrg = $event;
            }
            return $event;
          });
          core /* ɵɵtemplate */.DNE(9, AddGroupComponent_mat_option_9_Template, 2, 2, "mat-option", 5);
          core /* ɵɵpipe */.nI1(10, "async");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "button", 6);
          core /* ɵɵlistener */.bIt("click", function AddGroupComponent_Template_button_click_11_listener() {
            return ctx.collDialogOpen();
          });
          core /* ɵɵelementStart */.j41(12, "div");
          core /* ɵɵtext */.EFF(13, "Select Parent Group");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(14, "br")(15, "br");
          core /* ɵɵelementStart */.j41(16, "div")(17, "span");
          core /* ɵɵtext */.EFF(18, "Group's Parent Name: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(19, "mat-form-field", 7)(20, "input", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AddGroupComponent_Template_input_ngModelChange_20_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.parentGroupName, $event)) {
              ctx.parentGroupName = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(21, "div")(22, "span");
          core /* ɵɵtext */.EFF(23, "Group's Name: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "mat-form-field", 9)(25, "input", 10);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AddGroupComponent_Template_input_ngModelChange_25_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.group.nameOfGroup, $event)) {
              ctx.group.nameOfGroup = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(26, "div")(27, "span");
          core /* ɵɵtext */.EFF(28, "Group's Description: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(29, "mat-form-field", 11)(30, "input", 12);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AddGroupComponent_Template_input_ngModelChange_30_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.group.descriptionOfGroup, $event)) {
              ctx.group.descriptionOfGroup = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(31, "button", 13);
          core /* ɵɵlistener */.bIt("click", function AddGroupComponent_Template_button_click_31_listener() {
            return ctx.saveParams();
          });
          core /* ɵɵtext */.EFF(32, "Create Group");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(33, "div", 14)(34, "form", 15)(35, "table", 16)(36, "tbody", 17);
          core /* ɵɵtemplate */.DNE(37, AddGroupComponent_tr_37_Template, 17, 11, "tr", 18);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(38, "br")(39, "br");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx.selectedOrg);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.selectedOrg);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(10, 10, ctx.organizations$));
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("placeholder", ctx.parentPlaceHolder);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.parentGroupName);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("placeholder", ctx.namePlaceHolder);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.group.nameOfGroup);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("placeholder", ctx.descriptionPlaceHolder);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.group.descriptionOfGroup);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.orgUsers);
        }
      },
      dependencies: [NgForOf, MatFormField, MatInput, MatTooltip, MatSelect, MatOption, MatButton, fesm2022_forms /* ɵNgNoValidate */.qT, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, MatRow, AsyncPipe],
      styles: [".container[_ngcontent-%COMP%]{position:relative;top:50px;padding-left:50px}.mat-headline[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;bottom:55.67px;color:#1a3763}.sign-in-input[_ngcontent-%COMP%]{position:relative;left:50px;margin-bottom:26px;width:570px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#udescriptionOfGroup[_ngcontent-%COMP%]{position:relative;left:1000px}#organizationSelect[_ngcontent-%COMP%]{position:relative;left:114px;width:570px;height:46px;border:1px solid rgba(73,114,132,.2);border-radius:6px}#organizationSelect[_ngcontent-%COMP%]   .mat-mdc-select-arrow[_ngcontent-%COMP%]{color:transparent;width:14px;height:9px;content:url(/assets/SVG/arrow.svg);position:relative;top:12px}#organization[_ngcontent-%COMP%]{padding-bottom:52px}#orgButton[_ngcontent-%COMP%]{position:relative;top:63px;left:-457px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff;text-align:center;align-content:center;letter-spacing:normal}#creatGroupBTN[_ngcontent-%COMP%]{position:relative;width:219px;height:53px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;left:356px;top:63px;color:#fff;text-align:center;align-content:center;letter-spacing:normal}#arrow[_ngcontent-%COMP%]{position:relative;left:663px;top:9px;z-index:3}[_nghost-%COMP%]   .add-group-selection[_ngcontent-%COMP%]   .mat-mdc-select-arrow[_ngcontent-%COMP%]{color:transparent;width:14px;height:9px;content:url(/assets/SVG/arrow.svg);position:relative;top:12px}[_nghost-%COMP%]     .mat-mdc-input-placeholder{position:relative;left:12px;font-weight:400;line-height:33px;font-size:16px;color:#586d8c}.mat-mdc-input-underline[_ngcontent-%COMP%]{display:none}#groupName[_ngcontent-%COMP%]{position:relative;left:101px}#groupDescription[_ngcontent-%COMP%]{position:relative;left:65px}button[_ngcontent-%COMP%]{background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff}.table[_ngcontent-%COMP%]{position:relative;margin-top:50px}.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding-right:30px}.mat-mdc-input-placeholder[_ngcontent-%COMP%]{position:relative;left:12px;top:-8px;font-weight:400;line-height:33px;font-size:16px;color:#586d8c}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return AddGroupComponent;
})();