// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/collaboration-dialog/collaboration-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function CollaborationDialogComponent_span_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("(", ctx_r0.connectedUsersNumber(), " Modelers connected)");
  }
}
let CollaborationDialogComponent = /*#__PURE__*/(() => {
  class CollaborationDialogComponent {
    constructor(graphService, orgService, dialogRef, groupService, data) {
      this.graphService = graphService;
      this.orgService = orgService;
      this.dialogRef = dialogRef;
      this.groupService = groupService;
      this.data = data;
      this.sysAdminFlag = false;
      this.orgAdminFlag = false;
      this.groupAdminFlag = false;
      this.adminsOfGroupsThisModelBelongsTo = [];
      this.groupMembersTokenCanBeMovedTo = []; // if the user is a group admin, to which users can the admin pass the token
      this.userList = [];
      this.groupList = [];
      this.chosenGroup = "";
      this.flag = false;
      this.showOnlyConnected = false;
      this.currentUser = data.currentUser;
      this.currentModel = {
        modelName: this.graphService.modelObject.name,
        path: this.graphService.modelObject.path
      };
      Object.assign(this.userList, data.checkedUsers);
      Object.assign(this.groupList, data.checkedGroups);
      this.connectedUsersIds = {};
      this.showPassPermissionMessage = data.showPassPermissionMessage;
    }
    connectedUsersNumber() {
      return Object.keys(this.connectedUsersIds).length;
    }
    ngOnInit() {
      var _this = this;
      return (0, default)(function* () {
        _this.connectedUsersIds = {};
        yield _this.orgService.getOrganizationAnalytics(_this.data.org).then(res => {
          res.connectedModelers.forEach(item => _this.connectedUsersIds[item.uid] = true);
          res.connectedViewers.forEach(item => _this.connectedUsersIds[item.uid] = true);
        }).catch(err => {});
        _this.groupService.updateOrgUsers(_this.data.org);
        _this.groupService.updateOrgGroups(_this.data.org);
        _this.orgService.getGroups(_this.data.org).then(list => {
          //this.groupService.groupList$.subscribe(list => {
          _this.groups = [];
          _this.groupsData = list;
          _this.tokenSelected = _this.data.userToken;
          _this.modelOwner = _this.data.modelOwner;
          if (_this.data.groupChkBoxOneAble) {
            _this.chosenGroup = _this.data.checkedGroups[0];
          }
          _this.groupsCurrentUserIsAdminWithModelOwner = _this.groupsData.filter(g => Object.keys(g.Administrators || {}).includes(_this.data.currentUser.uid)).filter(g => _this.data.modelOwner in (g.Members || {}));
          const moreGroupsToAdd = [];
          const getInnerGroups = group => {
            const subGroupsIds = group.subGroups;
            if (subGroupsIds?.length > 0) {
              for (const subId of subGroupsIds) {
                const sub = _this.groupsData.find(gr => gr.GroupID === subId);
                if (sub) {
                  moreGroupsToAdd.push(sub);
                  getInnerGroups(sub);
                }
              }
            }
          };
          for (const g of _this.groupsCurrentUserIsAdminWithModelOwner) {
            getInnerGroups(g);
          }
          _this.groupsCurrentUserIsAdminWithModelOwner.push(...moreGroupsToAdd);
          _this.groupAdminFlag = _this.groupsCurrentUserIsAdminWithModelOwner.length > 0;
          for (const g of _this.groupsCurrentUserIsAdminWithModelOwner) {
            _this.groupMembersTokenCanBeMovedTo.push(...Object.keys(g.Members || {}));
          }
          const groupsCurrentUserBelongsTo = [];
          for (const group of _this.groupsData) {
            if (_this.data.modelOwner in (group.Members || {}) || _this.data.modelOwner in (group.Administrators || {})) {
              if (!group.Name?.endsWith("All Users")) {
                groupsCurrentUserBelongsTo.push(group);
              }
            }
          }
          for (const gr of groupsCurrentUserBelongsTo) {
            if (gr.Parent && gr.Parent !== "") {
              const parentData = _this.groupsData.find(g => g.GroupID === gr.Parent);
              if (parentData && !parentData.Name?.endsWith("All Users") && !groupsCurrentUserBelongsTo.includes(parentData)) {
                groupsCurrentUserBelongsTo.push(parentData);
              }
            }
          }
          _this.adminsOfGroupsThisModelBelongsTo = [];
          for (const gr of groupsCurrentUserBelongsTo) {
            _this.adminsOfGroupsThisModelBelongsTo.push(...Object.keys(gr.Administrators || {}));
          }
          _this.updateAdminsFlag();
          const orgGroupName = _this.orgService.getOrgGroupName(_this.data.org);
          _this.groupsData.forEach(group => {
            if (group.Parent === "" && (!_this.data.groupChkBoxOneAble || group.Name !== orgGroupName)) {
              if (group.Name === orgGroupName) {
                _this.groups.unshift(group.GroupID);
              } else {
                _this.groups.push(group.GroupID);
              }
            }
          });
          try {
            _this.groupsAndUsersTree(document.querySelector("ul"), _this.groups);
          } catch (err) {
            // in case the user closes the dialog before it has time to be built. prevents the red error.
          }
          if (_this.orgAdminFlag || _this.sysAdminFlag || _this.currentUser.uid === _this.modelOwner || _this.currentUser.uid === _this.data.userToken) {
            if (_this.showPassPermissionMessage) {
              (0, validationAlert)("To pass the the writing permission - double click the name of the next model editor", 5000, "warning");
            }
          }
          for (const i of $("#data").find(".material-icons")) {
            i.style.display = "inline";
          }
          if (document.getElementById("showOnlyConnectedCheckbox")) {
            document.getElementById("showOnlyConnectedCheckbox").disabled = false;
          }
        });
      })();
    }
    getFormatData() {
      return this.data.headLine;
    }
    updateAdminsFlag() {
      if (this.data.userChkBoxFlag && "OrgAdmin" in this.currentUser.userData) {
        if (this.currentUser.userData.OrgAdmin) {
          this.orgAdminFlag = true;
        }
      }
      if (this.data.userChkBoxFlag && "SysAdmin" in this.currentUser.userData) {
        if (this.currentUser.userData.SysAdmin) {
          this.sysAdminFlag = true;
        }
      }
    }
    setToken(user) {
      this.tokenSelected = user;
    }
    checkUser(user) {
      if (!this.tokenSelected) {
        return false;
      }
      if (this.tokenSelected === user) {
        return true;
      }
      return false;
    }
    toggleToList(id, list) {
      const idx = list.indexOf(id);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(id);
      }
      // console.log('list ', list);
    }
    // recursive function creates groups, sub groups and users
    groupsAndUsersTree(parent, groups) {
      groups.forEach(group => {
        let test = document.createElement("i");
        this.styleDownArrow(test);
        test.addEventListener("click", function () {
          $("#" + group).click();
        });
        const groupMembers = this.groupService.getMembersByGroup(group);
        const groupAdmins = this.groupService.getAdminsByGroup(group);
        const groupUsersWithDuplicates = groupAdmins.concat(groupMembers);
        // Remove duplicates from the array
        let groupUsers = groupUsersWithDuplicates.filter((element, index, list) => index === list.indexOf(element)).filter(usid => this.groupService.getUserById(usid));
        if (this.showOnlyConnected) {
          groupUsers = groupUsers.filter(id => this.connectedUsersIds[id]);
        }
        groupUsers.sort((a, b) => this.groupService.getUserName(a) < this.groupService.getUserName(b) ? -1 : this.groupService.getUserName(a) > this.groupService.getUserName(b) ? 1 : 0);
        const subGroups = this.getSubGroup(group);
        const li = document.createElement("li");
        let ul;
        const groupCheckBox = this.createGroupChkBox(group);
        if (!this.data.groupChkBoxOneAble) {
          this.checkAllCode(this, group);
        }
        this.foldingGroupSiblings(group);
        const GroupSpanText = this.createGroupSpanText(group);
        const self = this;
        groupCheckBox.onchange = function () {
          self.groupChkBoxOnChange(self, group);
        };
        this.appandChildrenToParent(li, [groupCheckBox, GroupSpanText, test]);
        parent.appendChild(li);
        if (subGroups.length > 0) {
          // there are subgroups in the group
          const groupHeadline = this.createGroupHeadline();
          let test = document.createElement("i");
          this.styleDownArrow(test);
          ul = document.createElement("ul");
          this.appandChildrenToParent(li, [groupHeadline, ul]);
          this.groupsAndUsersTree(ul, subGroups);
        }
        if (groupUsers.length) {
          // group is not empty
          const usersHeadline = this.createUserHeadline();
          this.appandChildrenToParent(li, [usersHeadline]);
          for (let i = 0; i < groupUsers.length; i++) {
            const userSpanText = this.createUserSpanText(groupUsers[i]);
            const userCheckBox = this.createUserChkBox(groupUsers[i]);
            if (groupAdmins.includes(groupUsers[i])) {
              userSpanText.textContent = userSpanText.textContent + "_Group Admin_";
            }
            if (groupCheckBox.checked) {
              userCheckBox.checked = true;
              self.userChkBoxOnChange(self, groupUsers[i], true);
            }
            const ul = document.createElement("ul");
            this.appandChildrenToParent(li, [ul]);
            const li2 = document.createElement("li");
            this.appandChildrenToParent(ul, [li2]);
            userSpanText.ondblclick = function () {
              self.userOnDblClick(self, groupUsers[i]);
            };
            userSpanText.onclick = function () {
              self.userOnClick(self, groupUsers[i]);
            };
            userCheckBox.onchange = function () {
              const isChecked = $(this).is(":checked");
              self.userChkBoxOnChange(self, groupUsers[i], isChecked);
            };
            const key_icon = this.createKeyIcon(groupUsers[i]);
            const token_icon = this.createTokenIcon(groupUsers[i]);
            const connectedIndicator = this.createConnectedUserIndicator(groupUsers[i]);
            this.appandChildrenToParent(li2, [userCheckBox, connectedIndicator, userSpanText, key_icon, token_icon].filter(item => item));
            if (groupUsers[i] === this.modelOwner) {
              this.setAttributes(key_icon, "assets/icons/key-icon.png", "Model Owner");
            }
            if (this.checkUser(groupUsers[i])) {
              this.setAttributes(token_icon, "assets/icons/token-icon.png", "Token Owner");
            }
            $("span").css({
              cursor: "pointer"
            });
            $("ul").css({
              listStyle: "none"
            });
          }
        }
        // hide the tree at the start. start only with the main groups
        $("#" + group).siblings().slice(1).hide();
      });
    }
    userOnClick(self, user) {
      if (this.orgAdminFlag || this.sysAdminFlag || self.tokenSelected !== user && self.modelOwner !== user && self.currentUser.uid === self.modelOwner) {
        self.toggleToList(user, self.userList);
        if (this.data.disableUnsubscribedEmails && !this.groupService.getUserById(user)?.email_subscription) {
          return;
        }
        // checked/unchecked the same user in other groups
        if (self.userList.includes(user)) {
          $(":checkbox[value*=\"" + user + "\"]").prop("checked", true);
        } else {
          $(":checkbox[value*=\"" + user + "\"]").prop("checked", false);
        }
      }
    }
    userOnDblClick(self, user) {
      const newToken = user;
      const prevToken = self.tokenSelected;
      const userGroups = self.groupsData.filter(g => g.Members && g.Members[user]).map(g => g.GroupID);
      if (self.tokenSelected === "") {
        return;
      }
      // if current user can pass the token
      if (this.orgAdminFlag || this.sysAdminFlag || self.currentUser.uid === self.modelOwner || this.groupMembersTokenCanBeMovedTo.includes(newToken) || self.currentUser.uid === self.data.userToken && (self.userList.includes(user) || self.groupList.some(g => userGroups.includes(g)))) {
        if (prevToken !== newToken) {
          // if ((prevToken !== self.modelOwner) && (self.currentUser.uid === self.modelOwner || this.orgAdminFlag || this.sysAdminFlag)) {
          $(":checkbox[value*=\"" + prevToken + "\"]").prop("disabled", false);
          // }
          $(":checkbox[value*=\"" + newToken + "\"]").prop("checked", true);
          $(":checkbox[value*=\"" + newToken + "\"]").prop("disabled", true);
          $("img[id=\"token" + newToken + "\"]").attr("src", "assets/icons/token-icon.png");
          $("img[id=\"token" + newToken + "\"]").attr("title", "Token Owner");
          $("img[id=\"token" + prevToken + "\"]").removeAttr("src");
          $("img[id=\"token" + prevToken + "\"]").removeAttr("title");
          (0, validationAlert)(this.groupService.getUserName(user) + " Is now the current model editor");
          if (self.userList.includes(user) === false) {
            self.setToken(user);
            self.toggleToList(user, self.userList);
          } else {
            self.setToken(user);
          }
        }
      }
    }
    createGroupChkBox(group) {
      const groupCheckBox = document.createElement("input");
      groupCheckBox.type = "checkbox";
      groupCheckBox.id = "checkBOX" + group;
      groupCheckBox.checked = this.groupList.includes(group);
      groupCheckBox.disabled = this.currentUser.uid !== this.modelOwner && this.currentUser.uid !== this.tokenSelected && !this.orgAdminFlag && !this.sysAdminFlag && !this.groupAdminFlag;
      if (this.data.groupChkBoxOneAble && this.data.groupChkBoxFlag) {
        groupCheckBox.disabled = false;
      }
      $(groupCheckBox).css({
        width: "18px",
        height: "18px",
        marginBottom: "10px"
      });
      if (!this.data.groupChkBoxFlag) {
        groupCheckBox.hidden = true;
      }
      return groupCheckBox;
    }
    createGroupSpanText(group) {
      const groupSpanText = document.createElement("span");
      groupSpanText.textContent = this.groupService.getGroupNameByID(group);
      groupSpanText.id = group;
      $(groupSpanText).css({
        marginBottom: "10px"
      });
      return groupSpanText;
    }
    createUserChkBox(user) {
      const userCheckBox = document.createElement("input");
      userCheckBox.type = "checkbox";
      userCheckBox.value = user;
      userCheckBox.checked = this.userList.includes(user) || this.modelOwner === user || this.tokenSelected === user;
      this.groupList.forEach(group => {
        const usersGroups = this.groupService.getGroupsByUserID(user);
        if (usersGroups.includes(group)) {
          userCheckBox.checked = true;
        } // if user is in checked group so he is checked too
      });
      userCheckBox.disabled = user === this.tokenSelected || user === this.modelOwner || this.currentUser.uid !== this.modelOwner && this.currentUser.uid !== this.tokenSelected && !this.orgAdminFlag && !this.sysAdminFlag;
      if (this.data.disableUnsubscribedEmails && !this.groupService.getUserById(user)?.email_subscription) {
        userCheckBox.disabled = true;
      }
      if (this.groupMembersTokenCanBeMovedTo.includes(user) || this.groupAdminFlag) {
        userCheckBox.disabled = false;
      }
      if (this.groupAdminFlag && user === this.currentUser.uid) {
        userCheckBox.disabled = true;
        userCheckBox.checked = true;
      }
      if (this.adminsOfGroupsThisModelBelongsTo.includes(user)) {
        userCheckBox.disabled = true;
        userCheckBox.title = "An Admin of a group the model owner belongs to has always read permissions.";
      }
      $(userCheckBox).css({
        width: "18px",
        height: "18px",
        marginBottom: "10px"
      });
      if (!this.data.userChkBoxFlag) {
        userCheckBox.hidden = true;
      }
      return userCheckBox;
    }
    createUserSpanText(user) {
      const userSpanText = document.createElement("span");
      userSpanText.textContent = this.groupService.getUserName(user) + "  (" + this.groupService.getUserEmail(user) + ")";
      $(userSpanText).css({
        marginBottom: "10px"
      });
      return userSpanText;
    }
    compareNames(a, b) {
      // Use toUpperCase() to ignore character casing
      const bandA = this.groupService.getUserName(a);
      const bandB = this.groupService.getUserName(b);
      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    }
    userChkBoxOnChange(self, user, isChecked) {
      self.toggleToList(user, self.userList);
      self.flag = true;
      // checked/unchecked the same user in other groups
      if (isChecked) {
        $(":checkbox[value*=\"" + user + "\"]").prop("checked", true);
      } else {
        $(":checkbox[value*=\"" + user + "\"]").prop("checked", false);
        const groupList = this.groupService.getGroupsByUserID(user);
        for (let i = 0; i < groupList.length; i++) {
          if (this.flag) {
            this.unchekedGroupParent(groupList[i]);
          }
        }
      }
    }
    groupChkBoxOnChange(self, group) {
      if (this.data.groupChkBoxOneAble) {
        self.groupList = [];
        $("#" + group).siblings().slice(2).slideToggle("slow"); /* making all subgroups of this group appear (or disappear)*/
        $("#" + group).siblings()[1].style.display = "inline";
        this.unchackedAllOtherGroups(group);
        if (self.chosenGroup === group) {
          self.chosenGroup = "";
        } else {
          self.chosenGroup = group;
        }
      }
      self.toggleToList(group, self.groupList);
      self.flag = true;
    }
    createKeyIcon(user) {
      const key_icon = document.createElement("img");
      key_icon.id = "key" + user;
      key_icon.textContent = "";
      return key_icon;
    }
    createConnectedUserIndicator(uid) {
      if (this.connectedUsersIds[uid]) {
        const ind = document.createElement("img");
        ind.src = "assets/SVG/greenIndicator.svg";
        ind.textContent = "";
        ind.classList.add("userIndicator");
        return ind;
      }
      return null;
    }
    setAttributes(element, src, title) {
      element.title = title;
      element.src = src;
    }
    createTokenIcon(user) {
      const token_icon = document.createElement("img");
      token_icon.id = "token" + user;
      token_icon.textContent = "";
      return token_icon;
    }
    appandChildrenToParent(parent, children) {
      for (let i = 0; i < children.length; i++) {
        parent.appendChild(children[i]);
      }
    }
    createUserHeadline() {
      const usersHeadline = document.createElement("ul");
      usersHeadline.style.fontWeight = "bold";
      usersHeadline.style.color = "purple";
      usersHeadline.textContent = "Users";
      return usersHeadline;
    }
    createGroupHeadline() {
      const groupHeadline = document.createElement("ul");
      groupHeadline.style.fontWeight = "bold";
      groupHeadline.style.color = "blue";
      groupHeadline.textContent = "Groups";
      return groupHeadline;
    }
    checkAllCode(self, group) {
      $(document).on("change", "#checkBOX" + group, function () {
        const childrenCheckBoxes = $("#checkBOX" + group).siblings().slice(1).children().children("input");
        childrenCheckBoxes.each(function () {
          if (!$(this).prop("disabled")) {
            if ($("#checkBOX" + group).prop("checked")) {
              if (!$(this).prop("checked")) {
                $(this).prop("checked", true);
                $(this).trigger("change"); // important to do this!
              }
            } else if ($(this).prop("checked")) {
              $(this).prop("checked", false);
              $(this).trigger("change"); // important to do this!
            }
          }
          if ($("#checkBOX" + group).is(":checked") === false && self.flag) {
            self.unchekedGroupParent(group);
          }
          $(this).trigger("change");
        });
      });
    }
    unchekedGroupParent(id) {
      let parentID = this.groupService.getGroupParent(id);
      if ($("#checkBOX" + id).is(":checked") === true) {
        this.toggleToList(id, this.groupList);
        $("#checkBOX" + id).prop("checked", false);
      }
      while (parentID !== "") {
        if ($("#checkBOX" + parentID).is(":checked") === true) {
          this.toggleToList(parentID, this.groupList);
          $("#checkBOX" + parentID).prop("checked", false);
        }
        parentID = this.groupService.getGroupParent(parentID);
      }
    }
    unchackedAllOtherGroups(groupID) {
      this.groupsData.forEach(group => {
        if (group.GroupID !== groupID) {
          $("#checkBOX" + group.GroupID).prop("checked", false);
        }
      });
    }
    foldingGroupSiblings(group) {
      $(document).off("click", "#" + group); // prevent from double bind of 'on' event after open the dialog
      $(document).on("click", "#" + group, function () {
        $("#" + group).siblings().slice(2).slideToggle("slow");
        $("#" + group).siblings()[1].style.display = "inline";
        if ($("#" + group).siblings()[1].innerText === "arrow_downward") {
          $("#" + group).siblings()[1].innerText = "arrow_upward";
        } else {
          $("#" + group).siblings()[1].innerText = "arrow_downward";
        }
      });
    }
    getSubGroup(groupID) {
      let rightGroup;
      this.groupsData.forEach(group => {
        if (group.GroupID === groupID) {
          rightGroup = group;
        }
      });
      return rightGroup.subGroups;
    }
    /* receives an icon element of the groups and users tree and styles it*/
    styleDownArrow(iconElement) {
      iconElement.innerText = "arrow_downward";
      iconElement.classList.add("material-icons");
      iconElement.style.color = "DarkGray";
      iconElement.style.position = "relative";
      iconElement.style.top = "5px";
    }
    toggleShowOnlyConnected() {
      document.getElementById("showOnlyConnectedCheckbox").disabled = true;
      this.showOnlyConnected = !this.showOnlyConnected;
      Array.from($("#treelist")[0].children).map(ch => ch.remove());
      this.showPassPermissionMessage = false;
      this.ngOnInit();
    }
    static #_ = (() => this.ɵfac = function CollaborationDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CollaborationDialogComponent)(core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CollaborationDialogComponent,
      selectors: [["app-collaboration-model-dialog"]],
      decls: 27,
      vars: 5,
      consts: [[1, "wrapDialog"], ["id", "metaData"], ["id", "header"], ["id", "modelName"], [1, "ValuesStyle"], ["id", "orgName"], ["id", "showConnected"], ["type", "checkbox", "id", "showOnlyConnectedCheckbox", "disabled", "true", 2, "position", "relative", 3, "change", "checked"], [4, "ngIf"], ["id", "data"], [1, "dialogContent"], ["id", "treelist"], ["id", "buttons"], [1, "footerDialog"], [1, "btn", 3, "click"]],
      template: function CollaborationDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h1", 2);
          core /* ɵɵtext */.EFF(3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(4, "br");
          core /* ɵɵelementStart */.j41(5, "span", 3);
          core /* ɵɵtext */.EFF(6, "Model: ");
          core /* ɵɵelementStart */.j41(7, "span", 4);
          core /* ɵɵtext */.EFF(8);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(9, "span", 5);
          core /* ɵɵtext */.EFF(10, "Organization: ");
          core /* ɵɵelementStart */.j41(11, "span", 4);
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(13, "div", 6)(14, "input", 7);
          core /* ɵɵlistener */.bIt("change", function CollaborationDialogComponent_Template_input_change_14_listener() {
            return ctx.toggleShowOnlyConnected();
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(15, " Show Only Connected ");
          core /* ɵɵtemplate */.DNE(16, CollaborationDialogComponent_span_16_Template, 2, 1, "span", 8);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(17, "div", 9)(18, "mat-dialog-content", 10);
          core /* ɵɵelement */.nrm(19, "ul", 11);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(20, "br");
          core /* ɵɵelementStart */.j41(21, "div", 12)(22, "mat-dialog-actions", 13)(23, "button", 14);
          core /* ɵɵlistener */.bIt("click", function CollaborationDialogComponent_Template_button_click_23_listener() {
            return ctx.dialogRef.close({
              chosenGroup: ctx.chosenGroup,
              tokenUser: ctx.tokenSelected,
              checkedUserList: ctx.userList,
              checkedGroupList: ctx.groupList,
              currentModel: ctx.currentModel
            });
          });
          core /* ɵɵtext */.EFF(24, "SAVE");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(25, "button", 14);
          core /* ɵɵlistener */.bIt("click", function CollaborationDialogComponent_Template_button_click_25_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(26, "CLOSE");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.headLine, " ");
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.modelName, "");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.data.orgName, "");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("checked", false);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.connectedUsersNumber() > 0);
        }
      },
      dependencies: [MatDialogActions, MatDialogContent, NgIf],
      styles: ["hr.style5[_ngcontent-%COMP%]{background-color:#fff;border-top:1px dashed lightgray;margin-top:20px}li[_ngcontent-%COMP%]{position:relative}#header[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;font-size:20px;line-height:23px;text-align:center;color:#1a3763}#modelName[_ngcontent-%COMP%]{position:relative;left:35px;float:left;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;font-size:16px;line-height:19px;display:flex;align-items:center;color:#1a3763}#orgName[_ngcontent-%COMP%]{position:relative;left:-110px;float:right;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;font-size:16px;line-height:19px;display:flex;align-items:center;color:#1a3763}.ValuesStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;font-size:16px;line-height:33px;display:flex;align-items:center;color:#586d8c}#metaData[_ngcontent-%COMP%]{height:13%}#data[_ngcontent-%COMP%]{height:80%}#buttons[_ngcontent-%COMP%]{height:6%;padding-top:10px}input[_ngcontent-%COMP%]{position:absolute;left:0}ul[_ngcontent-%COMP%]{list-style-type:none}.wrapDialog[_ngcontent-%COMP%]{position:relative;height:100%}.footerDialog[_ngcontent-%COMP%]{justify-content:unset!important;position:relative;bottom:0}.dialogContent[_ngcontent-%COMP%]{max-height:65vh;overflow-y:visible;bottom:100px}button[_ngcontent-%COMP%]{position:relative;left:145px;margin-left:16px;width:166px;height:53px;background:#fff;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;font-size:18px;line-height:21px;text-align:center;color:#1a3763}.btn[_ngcontent-%COMP%]:hover{position:relative;width:166px;height:53px;background:#fff;box-shadow:0 2px 4px #78a8f1a3;border-radius:6px;color:#78a8f1}#showConnected[_ngcontent-%COMP%]{position:relative;top:8px;left:32px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;font-size:16px;color:#1a3763;width:100%;text-align:center;white-space:nowrap;display:inline-flex;justify-content:flex-start}"]
    }))();
  }
  return CollaborationDialogComponent;
})();