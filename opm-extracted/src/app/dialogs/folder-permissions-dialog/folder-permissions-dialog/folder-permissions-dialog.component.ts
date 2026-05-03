// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/folder-permissions-dialog/folder-permissions-dialog/folder-permissions-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const folder_permissions_dialog_component_c0 = ["allTheseThings"];
function FolderPermissionsDialogComponent_span_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 22)(1, "input", 23);
    core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_span_13_Template_input_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.toggleModelsReadEnabled($event));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(2, " Automatic Model Read Permission ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("checked", ctx_r1.isModelsReadEnabled)("disabled", ctx_r1.isReadOnly);
  }
}
function FolderPermissionsDialogComponent_li_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li")(1, "input", 24);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_li_30_Template_input_click_1_listener($event) {
      const item_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.updateItem($event, item_r4, "owner"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(2, "input", 25);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_li_30_Template_input_click_2_listener($event) {
      const item_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.updateItem($event, item_r4, "write"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "input", 26);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_li_30_Template_input_click_3_listener($event) {
      const item_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.updateItem($event, item_r4, "read"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "span", 27);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_li_30_Template_span_click_4_listener() {
      const item_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.tickUserPermission(item_r4));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isReadOnly)("checked", item_r4.owner);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isReadOnly)("checked", item_r4.write);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isReadOnly)("checked", item_r4.read);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate2 */.Lme("", item_r4.userData.Name, " (", item_r4.userData.Email, ")");
  }
}
function FolderPermissionsDialogComponent_span_33_span_1_ul_8_li_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "li");
    core /* ɵɵelement */.nrm(1, "input", 36)(2, "input", 37)(3, "input", 38);
    core /* ɵɵelementStart */.j41(4, "span", 27);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_span_33_span_1_ul_8_li_3_Template_span_click_4_listener() {
      const member_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.tickUserPermission(member_r8));
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const member_r8 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", true)("checked", member_r8.owner);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", true)("checked", member_r8.write);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", true)("checked", member_r8.read);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate2 */.Lme("", member_r8.userData.Name, " (", member_r8.userData.Email, ")");
  }
}
function FolderPermissionsDialogComponent_span_33_span_1_ul_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "ul", 34)(1, "span", 35);
    core /* ɵɵtext */.EFF(2, "Users:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, FolderPermissionsDialogComponent_span_33_span_1_ul_8_li_3_Template, 6, 8, "li", 17);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const groupItem_r6 = core /* ɵɵnextContext */.XpG(2).$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleMap */.Aen("margin-left: " + (groupItem_r6.depth - 1) * 62 + "px;");
    core /* ɵɵproperty */.Y8G("@fadeInOut", undefined);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.getSubGroupsMembersWithData(groupItem_r6));
  }
}
function FolderPermissionsDialogComponent_span_33_span_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "li", 29)(2, "input", 30);
    core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_span_33_span_1_Template_input_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const groupItem_r6 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.selectGroupAndSubgroups($event, groupItem_r6, "owner"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "input", 31);
    core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_span_33_span_1_Template_input_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const groupItem_r6 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.selectGroupAndSubgroups($event, groupItem_r6, "write"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "input", 32);
    core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_span_33_span_1_Template_input_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const groupItem_r6 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.selectGroupAndSubgroups($event, groupItem_r6, "read"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "span", 14);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_span_33_span_1_Template_span_click_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const groupItem_r6 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.groupNameClick($event, groupItem_r6));
    });
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "i", 15);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_span_33_span_1_Template_i_click_7_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const groupItem_r6 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.groupNameClick($event, groupItem_r6));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(8, FolderPermissionsDialogComponent_span_33_span_1_ul_8_Template, 4, 4, "ul", 33);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const groupItem_r6 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleMap */.Aen("margin-left: " + (groupItem_r6.depth - 1) * 62 + "px;");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isReadOnly)("checked", groupItem_r6.owner);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isReadOnly)("checked", groupItem_r6.write);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("disabled", ctx_r1.isReadOnly)("checked", groupItem_r6.read);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(groupItem_r6.groupData.Name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerText", "arrow_downward");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", groupItem_r6.isOpen && ctx_r1.getSubGroupsMembersWithData(groupItem_r6).length > 0);
  }
}
function FolderPermissionsDialogComponent_span_33_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtemplate */.DNE(1, FolderPermissionsDialogComponent_span_33_span_1_Template, 9, 11, "span", 28);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const groupItem_r6 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.isParentOpen(groupItem_r6));
  }
}
function FolderPermissionsDialogComponent_button_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 21);
    core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_button_35_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.save());
    });
    core /* ɵɵtext */.EFF(1, "Save");
    core /* ɵɵelementEnd */.k0s();
  }
}
let FolderPermissionsDialogComponent = /*#__PURE__*/(() => {
  class FolderPermissionsDialogComponent {
    constructor(orgService, groupService, dialogRef, userService, permissions, storage, data) {
      this.orgService = orgService;
      this.groupService = groupService;
      this.dialogRef = dialogRef;
      this.userService = userService;
      this.permissions = permissions;
      this.storage = storage;
      this.data = data;
      this.users = [];
      this.groups = [];
      this.originalGroups = [];
      this.folderId = this.data.folderID;
      this.isReadOnly = true;
      this.allUsersPermission = {
        read: false,
        write: false,
        owner: false
      };
    }
    ngOnInit() {
      this.collapseUsersAndGroups();
      this.loadData();
    }
    ngAfterViewInit() {
      this.groupsLoading.changes.subscribe(t => this.collapseUsersAndGroups());
    }
    loadData() {
      var _this = this;
      return (0, default)(function* () {
        const userData = () => _this.userService.user.userData;
        const org = userData().organization;
        const permissions = yield _this.storage.getFolderPermissions(_this.folderId);
        const users = yield _this.orgService.getOrganizationUsers(org);
        _this.users = users.map(us => {
          return {
            read: permissions.readIds.includes(us.uid) || permissions.readIds.includes("all"),
            write: permissions.writeIds.includes(us.uid) || permissions.writeIds.includes("all"),
            owner: permissions.ownerIds.includes(us.uid) || permissions.ownerIds.includes("all"),
            userData: us
          };
        });
        _this.sortUsers();
        const groups = yield _this.orgService.getGroups(org);
        _this.groups = groups.map(gr => {
          return {
            read: permissions.groupsReadIds.includes(gr.key),
            write: permissions.groupsWriteIds.includes(gr.key),
            owner: permissions.groupsOwnersIds.includes(gr.key),
            isOpen: false,
            groupData: gr
          };
        }).filter(item => item.groupData.Name && !item.groupData.Name.includes(org + " All Users")).sort((a, b) => a.groupData.Name[0].toLowerCase() > b.groupData.Name[0].toLowerCase() ? 1 : -1);
        const userGroups = [];
        for (const gi of _this.groups) {
          if (gi.groupData.key && Object.keys(gi.groupData.Members || []).includes(userData().uid)) {
            userGroups.push(gi.groupData.key);
          }
        }
        _this.isReadOnly = !userData().SysAdmin && !userData().OrgAdmin && !permissions.ownerIds.includes(userData().uid) && !permissions.groupsOwnersIds.find(gid => userGroups.includes(gid));
        _this.isModelsReadEnabled = !!permissions.isModelsReadEnabled;
        _this.beautifyGroupsData();
        _this.getGroupsOrdered();
        _this.allUsersPermission.read = permissions.readIds.includes("all");
        _this.allUsersPermission.write = permissions.writeIds.includes("all");
        _this.allUsersPermission.owner = permissions.ownerIds.includes("all");
      })();
    }
    beautifyGroupsData() {
      this.groups = this.groups.sort((a, b) => this.getGroupDepth(a.groupData.key) > this.getGroupDepth(b.groupData.key) ? 1 : -1);
      for (const item of this.groups) {
        item.depth = this.getGroupDepth(item.groupData.key);
        item.children = item.children || [];
        item.children.push(...this.groups.filter(itm => itm.groupData.Parent === item.groupData.key));
      }
      this.originalGroups = [...this.groups];
      for (let i = this.groups.length - 1; i >= 0; i--) {
        if (this.groups[i].groupData?.Parent) {
          const parentEntry = this.groups.find(ent => ent.groupData?.key === this.groups[i].groupData?.Parent);
          if (parentEntry) {
            parentEntry.children = parentEntry.children || [];
            parentEntry.children.push(this.groups[i]);
            this.groups.splice(i, 1);
          }
        }
      }
    }
    selectAll($event, type) {
      this.allUsersPermission[type] = $event.target.checked;
      this.users.forEach(item => item[type] = $event.target.checked);
    }
    updateItem($event, item, type) {
      item[type] = $event.target.checked;
      if ($event.target.checked === false) {
        this.allUsersPermission[type] = false;
      } else if (this.users.length === this.users.filter(user => user[type]).length) {
        this.allUsersPermission[type] = true;
      }
    }
    toggleAllUsers($event) {
      $($event.target.parentElement).siblings("ul").slideToggle("slow");
    }
    collapseUsersAndGroups() {
      $(".collapse").slideUp(0);
    }
    sumUsersPermissions(type) {
      const hasPermission = this.users.filter(userItem => userItem[type] === true);
      if (this.allUsersPermission[type]) {
        return ["all"];
      } else {
        return hasPermission.map(item => item.userData.uid).filter(u => !!u);
      }
    }
    sumGroupsPermissions(type) {
      const hasPermission = this.originalGroups.filter(groupItem => groupItem[type] === true);
      return hasPermission.map(groupItem => groupItem.groupData.GroupID).filter(u => !!u);
    }
    save() {
      const ret = {
        readIds: this.sumUsersPermissions("read"),
        writeIds: this.sumUsersPermissions("write"),
        ownerIds: this.sumUsersPermissions("owner"),
        groupsReadIds: this.sumGroupsPermissions("read"),
        groupsWriteIds: this.sumGroupsPermissions("write"),
        groupsOwnersIds: this.sumGroupsPermissions("owner"),
        isModelsReadEnabled: this.isModelsReadEnabled
      };
      this.storage.updateFolderPermissions(this.folderId, ret).then(res => {
        if (res.success) {
          (0, validationAlert)("Updated Successfully.");
        } else {
          (0, validationAlert)(res.message, 5000, "error");
        }
        this.dialogRef.close(ret);
      }).catch(err => {});
    }
    close() {
      this.dialogRef.close();
    }
    getUserItemByUserId(memberId) {
      return this.users.find(userItem => userItem.userData.uid === memberId);
    }
    getGroupMembers(groupItem) {
      const keys = Object.keys(groupItem.groupData.Members || []);
      return keys.map(key => this.getUserItemByUserId(key)).filter(u => !!u);
    }
    changeArrow($event) {
      const arrow = $($event.target.parentElement).children("i")[0];
      if (arrow.innerText === "arrow_downward") {
        arrow.innerText = "arrow_upward";
      } else {
        arrow.innerText = "arrow_downward";
      }
    }
    getGroupDepth(groupKey) {
      let ret = 0;
      let currentItem = this.groups.find(gi => gi.groupData.key === groupKey);
      while (currentItem) {
        ret++;
        if (currentItem.groupData.Parent === "") {
          break;
        }
        currentItem = this.groups.find(gi => gi.groupData.key === currentItem.groupData.Parent);
      }
      return ret;
    }
    getGroupsOrdered() {
      const ret = [];
      for (const gi of this.groups) {
        ret.push(gi);
        for (const child of gi.children) {
          this.getSubGroups(gi, ret);
        }
      }
      return ret;
    }
    getSubGroups(groupItem, arr) {
      if (!arr.includes(groupItem)) {
        arr.push(groupItem);
      }
      for (const child of groupItem.children || []) {
        this.getSubGroups(child, arr);
      }
    }
    isParentOpen(groupItem) {
      if (!groupItem.groupData.Parent || groupItem.groupData.Parent.length === 0) {
        return true;
      }
      const parent = this.originalGroups.find(gr => gr.groupData.key === groupItem.groupData.Parent);
      return parent?.isOpen;
    }
    getSubGroupsMembers(groupItem, arr = []) {
      arr.push(...Object.keys(groupItem.groupData.Members || []));
      for (const child of groupItem.children) {
        this.getSubGroupsMembers(child, arr);
      }
      return arr;
    }
    getSubGroupsMembersWithData(groupItem) {
      let members = this.getSubGroupsMembers(groupItem).map(uid => this.users.find(u => u.userData.uid === uid)).filter(us => !!us);
      members = (0, removeDuplicationsInArray)(members);
      members = members.sort((a, b) => a.userData?.Name > b.userData.Name ? 1 : -1);
      return members;
    }
    closeGroupItem(groupItem) {
      groupItem.isOpen = !groupItem.isOpen;
      if (!groupItem.isOpen) {
        const subs = [];
        this.getSubGroups(groupItem, subs);
        subs.forEach(sub => sub.isOpen = false);
      }
    }
    selectGroupAndSubgroups($event, groupItem, permission) {
      const value = $event.target.checked;
      groupItem[permission] = value;
      const subGroups = [];
      this.getSubGroups(groupItem, subGroups);
      for (const sub of subGroups) {
        sub[permission] = value;
      }
      // const members = this.getSubGroupsMembersWithData(groupItem);
      // for (const member of members)
      //   member[permission] = value;
    }
    groupNameClick($event, groupItem) {
      this.closeGroupItem(groupItem);
      this.changeArrow($event);
    }
    tickUserPermission(user) {
      if (this.isReadOnly) {
        return;
      }
      let val;
      if (user.read && user.write && user.owner) {
        val = false;
      } else {
        val = true;
      }
      user.read = val;
      user.write = val;
      user.owner = val;
    }
    sortUsers() {
      this.users = this.users.sort((a, b) => a.userData?.Name > b.userData?.Name ? 1 : -1);
    }
    toggleModelsReadEnabled($event) {
      this.isModelsReadEnabled = $event.target.checked;
    }
    static #_ = (() => this.ɵfac = function FolderPermissionsDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FolderPermissionsDialogComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(PermissionsService), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: FolderPermissionsDialogComponent,
      selectors: [["opcloud-folder-permissions-dialog"]],
      viewQuery: function FolderPermissionsDialogComponent_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(folder_permissions_dialog_component_c0, 5);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.groupsLoading = _t;
          }
        }
      },
      decls: 38,
      vars: 14,
      consts: [[2, "display", "grid"], [1, "headerText"], [1, "headerText", 2, "font-size", "16px"], [2, "float", "left"], [2, "font-weight", "normal"], [2, "float", "right", "padding-right", "10px"], ["matTooltip", "When checked, all modelers with permissions to this folder will be able to view and open the models in it", 4, "ngIf"], ["id", "mainSection"], [1, "owr", "headerText", 2, "margin-left", "5px"], [1, "owr", "headerText", 2, "margin-left", "6px"], [1, "owr", "headerText", 2, "margin-left", "7px"], ["id", "ownerAll", "type", "checkbox", "matTooltip", "Owner", 3, "change", "disabled", "checked"], ["id", "writeAll", "type", "checkbox", "matTooltip", "Write", 3, "change", "disabled", "checked"], ["id", "readAll", "type", "checkbox", "matTooltip", "Read", 3, "change", "disabled", "checked"], [1, "headerText", 2, "margin-left", "7px", "font-size", "16px", "cursor", "pointer", 3, "click"], [1, "material-icons", 3, "click", "innerText"], ["id", "allUsersUL", 1, "usersUL", "collapse"], [4, "ngFor", "ngForOf"], ["id", "groupsTitle", 1, "headerText", 2, "font-size", "16px"], ["id", "actions"], ["mat-button", "", "class", "btn", 3, "click", 4, "ngIf"], ["mat-button", "", 1, "btn", 3, "click"], ["matTooltip", "When checked, all modelers with permissions to this folder will be able to view and open the models in it"], ["type", "checkbox", 3, "change", "checked", "disabled"], ["type", "checkbox", "matTooltip", "Owner", 3, "click", "disabled", "checked"], ["type", "checkbox", "matTooltip", "Write", 3, "click", "disabled", "checked"], ["type", "checkbox", "matTooltip", "Read", 3, "click", "disabled", "checked"], [1, "pointer", 3, "click"], [4, "ngIf"], [1, "pointer"], ["type", "checkbox", "matTooltip", "Owner", 1, "groupsOwnerAll", 3, "change", "disabled", "checked"], ["type", "checkbox", "matTooltip", "Write", 1, "groupsWriteAll", 3, "change", "disabled", "checked"], ["type", "checkbox", "matTooltip", "Read", 1, "groupsReadAll", 3, "change", "disabled", "checked"], ["class", "usersUL groupUsersUL", 3, "style", 4, "ngIf"], [1, "usersUL", "groupUsersUL"], [1, "groupUsers", "headerText", "pointer", 2, "font-size", "16px"], ["type", "checkbox", "matTooltip", "Owner", 3, "disabled", "checked"], ["type", "checkbox", "matTooltip", "Write", 3, "disabled", "checked"], ["type", "checkbox", "matTooltip", "Read", 3, "disabled", "checked"]],
      template: function FolderPermissionsDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div")(2, "h3", 1);
          core /* ɵɵtext */.EFF(3, "Folder Permissions");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 2)(5, "span", 3);
          core /* ɵɵtext */.EFF(6, "Folder: ");
          core /* ɵɵelementStart */.j41(7, "span", 4);
          core /* ɵɵtext */.EFF(8);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(9, "span", 5);
          core /* ɵɵtext */.EFF(10, "Organization: ");
          core /* ɵɵelementStart */.j41(11, "span", 4);
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(13, FolderPermissionsDialogComponent_span_13_Template, 3, 2, "span", 6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "div", 7)(15, "li")(16, "span", 8);
          core /* ɵɵtext */.EFF(17, "O");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "span", 9);
          core /* ɵɵtext */.EFF(19, "W");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "span", 10);
          core /* ɵɵtext */.EFF(21, "R");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(22, "li")(23, "input", 11);
          core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_Template_input_change_23_listener($event) {
            return ctx.selectAll($event, "owner");
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "input", 12);
          core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_Template_input_change_24_listener($event) {
            return ctx.selectAll($event, "write");
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(25, "input", 13);
          core /* ɵɵlistener */.bIt("change", function FolderPermissionsDialogComponent_Template_input_change_25_listener($event) {
            return ctx.selectAll($event, "read");
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "span", 14);
          core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_Template_span_click_26_listener($event) {
            ctx.toggleAllUsers($event);
            return ctx.changeArrow($event);
          });
          core /* ɵɵtext */.EFF(27);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "i", 15);
          core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_Template_i_click_28_listener($event) {
            ctx.changeArrow($event);
            return ctx.toggleAllUsers($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(29, "ul", 16);
          core /* ɵɵtemplate */.DNE(30, FolderPermissionsDialogComponent_li_30_Template, 6, 8, "li", 17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "span", 18);
          core /* ɵɵtext */.EFF(32, "Groups:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(33, FolderPermissionsDialogComponent_span_33_Template, 2, 1, "span", 17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "div", 19);
          core /* ɵɵtemplate */.DNE(35, FolderPermissionsDialogComponent_button_35_Template, 2, 0, "button", 20);
          core /* ɵɵelementStart */.j41(36, "button", 21);
          core /* ɵɵlistener */.bIt("click", function FolderPermissionsDialogComponent_Template_button_click_36_listener() {
            return ctx.close();
          });
          core /* ɵɵtext */.EFF(37, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtextInterpolate */.JRh(ctx.data.folderName);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate */.JRh(ctx.userService.user.userData.organization);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !(ctx.data == null ? null : ctx.data.templates) && !(ctx.data == null ? null : ctx.data.examples));
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("disabled", ctx.isReadOnly)("checked", ctx.allUsersPermission.owner);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("disabled", ctx.isReadOnly)("checked", ctx.allUsersPermission.write);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("disabled", ctx.isReadOnly)("checked", ctx.allUsersPermission.read);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate1 */.SpI("All ", ctx.userService.user.userData.organization, " Users");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("innerText", "arrow_downward");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.users);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.getGroupsOrdered());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isReadOnly);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatButton],
      styles: [".headerText[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;font-size:20px;line-height:23px;text-align:center;color:#1a3763}.headerTextSubGroup[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;font-size:20px;line-height:23px;text-align:center;color:#2a508a}.groupUsers[_ngcontent-%COMP%]{font-size:16px;margin-left:60px;color:#8b008b}.owr[_ngcontent-%COMP%]{font-weight:400;font-size:16px}ul[_ngcontent-%COMP%]{list-style:none}li[_ngcontent-%COMP%]{list-style:none;line-height:25px}.pointer[_ngcontent-%COMP%]{cursor:pointer}.usersUL[_ngcontent-%COMP%]{padding-left:62px;margin-top:4px;margin-bottom:0}#groupsTitle[_ngcontent-%COMP%]{font-size:16px;text-align:left;line-height:40px}.btn[_ngcontent-%COMP%]{position:relative;margin-left:40px;width:118px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:50px;margin-top:20px}#actions[_ngcontent-%COMP%]{text-align:center}#mainSection[_ngcontent-%COMP%]{height:490px;overflow:scroll}#mainSection[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}#mainSection[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:4px;border-left:2px solid white;border-right:2px solid white}#mainSection[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df00;border-radius:6px;border-left:4px solid white;border-right:4px solid white}i[_ngcontent-%COMP%]{color:#a9a9a9;position:relative;top:5px;display:inline}"],
      data: {
        animation: [(0, trigger)("fadeInOut", [(0, transition)(":enter", [(0, style)({
          opacity: 0,
          height: "0px"
        }), (0, animate)(200, (0, style)({
          opacity: 1,
          height: "*"
        }))]), (0, transition)(":leave", [(0, style)({
          opacity: 1,
          height: "*"
        }), (0, animate)(100, (0, style)({
          opacity: 0,
          height: "0px"
        }))])])]
      }
    }))();
  }
  return FolderPermissionsDialogComponent;
})();