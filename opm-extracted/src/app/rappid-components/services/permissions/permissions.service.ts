// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/permissions/permissions.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let PermissionsService = /*#__PURE__*/(() => {
  class PermissionsService {
    constructor(modelService, userService, database, orgService, storage, groupService, graphService, dialog, context) {
      this.modelService = modelService;
      this.userService = userService;
      this.database = database;
      this.orgService = orgService;
      this.storage = storage;
      this.groupService = groupService;
      this.graphService = graphService;
      this.dialog = dialog;
      this.context = context;
    }
    collDialogOpen() {
      let collData;
      if (typeof this.modelService.model.permissions === "undefined") {
        this.modelService.model.permissions = {
          ownerID: "",
          readGroupsIDs: [],
          readIDs: [],
          tokenID: "",
          writeGroupsIDs: [],
          writeIDs: []
        };
      }
      collData = {
        headLine: "Model Permissions Setting",
        modelName: this.graphService.modelObject.name,
        orgName: this.userService.userOrg,
        userChkBoxFlag: true,
        groupChkBoxFlag: true,
        groupChkBoxOneAble: false,
        userToken: this.modelService.model.permissions.tokenID,
        currentUser: this.userService.user,
        org: this.userService.userOrg,
        checkedUsers: this.modelService.model.permissions.readIDs,
        checkedGroups: this.modelService.model.permissions.readGroupsIDs,
        modelOwner: this.modelService.model.permissions.ownerID
      };
      const dialogRef = this.dialog.open(CollaborationDialogComponent, {
        // height: '873px',
        width: "775px",
        data: collData
      });
      // dialogRef.afterClosed().subscribe((data) => {
      //   if (data) {
      //     this.modelService.model.permissions.tokenID = data.tokenUser;
      //     this.modelService.model.permissions.writeIDs = [data.tokenUser];
      //     this.modelService.model.permissions.readIDs = data.checkedUserList;
      //     this.modelService.model.permissions.readGroupsIDs = data.checkedGroupList.length > 0 ? data.checkedGroupList : [];
      //     this.graphService.modelObject.modelData = this.modelService.model.toJson();
      //     this.updateModelPermissions(this.modelService.model, data);
      //   }
      // });
    }
    isModelOwner() {
      if (!this.modelService.model.name) {
        return false;
      }
      const currentUserID = this.userService.user ? this.userService.user.uid : null;
      const modelUserID = this.modelService.model.permissions.ownerID;
      if (currentUserID === modelUserID) {
        // current user is the model owner
        return true;
      }
      return false;
    }
    isModelToken() {
      if (this.modelService.model.name === "") {
        return false;
      }
      const model = this.modelService.model;
      const currentUserID = this.userService.user ? this.userService.user.uid : null;
      const modelUserID = model.permissions.tokenID;
      if (currentUserID === modelUserID) {
        // current user is the model owner
        return true;
      }
      return false;
    }
    updateModelPermissions(data) {
      this.context.updateLocalPermissionsAfterChange(data, this.userService.user?.uid === data.tokenID);
      this.storage.updatePermissions(this.modelService.modelObject.id, data).then(() => (0, validationAlert)("Permissions successfully changed.", 2500, "", false)).catch(() => (0, validationAlert)("Could not change permissions. If you are not the model creator than you can pass the token only to the creator or to a user with read permission. If you are a group admin - you can move the token only to your group members.", 10000, "Error"));
    }
    setDefaultPermissionsToModel() {
      const orgsList = this.orgService.getOrganizations();
      orgsList.forEach(orgs => {
        orgs.forEach(org => {
          this.orgService.getOrganizationUsersData(org.name).then(usersList => {
            const users = usersList;
            const orgUsers = [];
            let orgAdmin = "";
            users.forEach(user => {
              orgUsers.push(user.uid);
              if ("OrgAdmin" in user) {
                if (user.OrgAdmin) {
                  orgAdmin = user.uid;
                }
              }
            });
            const permissions = {
              ownerID: orgAdmin,
              readGroupsIDs: "",
              readIDs: orgUsers,
              tokenID: orgAdmin,
              writeGroupsIDs: "",
              writeIDs: ""
            };
            // this.updateModelsPermissionsInPath(org.name, '', permissions);
          });
        });
      });
    }
    hasPermission(modelPermission) {
      const currentUserID = this.userService.user.uid;
      if (this.userService.user.userData.OrgAdmin === true) {
        return true;
      }
      if (this.userService.user.userData.SysAdmin === true) {
        return true;
      }
      if (modelPermission.ownerID === currentUserID) {
        return true;
      }
      if (modelPermission.tokenID === currentUserID) {
        return true;
      }
      if (modelPermission.readIDs.includes(currentUserID)) {
        return true;
      }
      if (modelPermission.writeIDs.includes(currentUserID)) {
        return true;
      }
      const userGroups = this.groupService.getGroupsByUserID(currentUserID);
      for (let i = 0; i < userGroups.length; i++) {
        if ("readGroupsIDs" in modelPermission) {
          if (modelPermission.readGroupsIDs.includes(userGroups[i])) {
            return true;
          }
        }
        if ("writeGroupsIDs" in modelPermission) {
          if (modelPermission.writeGroupsIDs.includes(userGroups[i])) {
            return true;
          }
        }
      }
      return false;
    }
    canOverwrite(modelPermission) {
      const currentUserID = this.userService.user.uid;
      if (modelPermission.tokenID === currentUserID) {
        return true;
      }
      if (modelPermission.writeIDs.includes(currentUserID)) {
        return true;
      }
      const userGroups = this.groupService.getGroupsByUserID(currentUserID);
      if ("writeGroupsID" in modelPermission) {
        for (let i = 0; i < userGroups.length; i++) {
          if (modelPermission.writeGroupsID.includes(userGroups[i])) {
            return true;
          }
        }
      }
      return false;
    }
    canDelete(modelPermission) {
      const currentUserID = this.userService.user.uid;
      if (modelPermission.ownerID === currentUserID) {
        return true;
      }
      return false;
    }
    static #_ = (() => this.ɵfac = function PermissionsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PermissionsService)(core /* ɵɵinject */.KVO(ModelService), core /* ɵɵinject */.KVO(UserService), core /* ɵɵinject */.KVO(DatabaseService), core /* ɵɵinject */.KVO(OrganizationService), core /* ɵɵinject */.KVO(StorageService), core /* ɵɵinject */.KVO(GroupsService), core /* ɵɵinject */.KVO(GraphService), core /* ɵɵinject */.KVO(MatDialog), core /* ɵɵinject */.KVO(ContextService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: PermissionsService,
      factory: PermissionsService.ɵfac
    }))();
  }
  return PermissionsService;
})();