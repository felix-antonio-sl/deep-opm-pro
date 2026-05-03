// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/groups.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let GroupsService = /*#__PURE__*/(() => {
  class GroupsService {
    constructor(orgService, userService, dbService) {
      this.orgService = orgService;
      this.userService = userService;
      this.dbService = dbService;
      this.userList = new BehaviorSubject([]);
      this.userList$ = this.userList.asObservable();
      this.groupList = new BehaviorSubject([]);
      this.groupList$ = this.groupList.asObservable();
      this.updateOrgGroups();
      this.updateOrgUsers();
    }
    updateOrgGroups(org = this.userService.userOrg) {
      this.userService.user$.subscribe(user => {
        if (!org) {
          org = user.userData.organization;
        }
        const groupsPromise = this.orgService.getOrganizationGroups(org);
        return groupsPromise.then(groups => {
          this.groupList = new BehaviorSubject([]);
          /*const groupsList = [];
          groups.forEach(group => {
            groupsList.push(group);
          });*/
          this.groupList.next(groups);
        }).catch(err => this.groupList.next([]));
      });
    }
    updateOrgUsers(org = "") {
      const userList = [];
      this.userService.user$.pipe((0, take)(1)).toPromise().then(user => {
        if (org === "") {
          org = user.userData.organization;
        }
        this.orgService.getOrganizationUsers(org).then(users => {
          this.userList = new BehaviorSubject([]);
          if (!users) {
            return;
          }
          users.forEach(user => {
            userList.push(user);
          });
          this.userList.next(userList);
        });
      });
    }
    getMembersByGroup(groupID) {
      const group = this.getGroupByID(groupID);
      // Very bad...
      // if (this.dbService.driver instanceof MongoDatabaseDriver)
      //     return group.Members;
      const membersList = [];
      if (group?.Members) {
        for (let user in group.Members) {
          membersList.push(user);
        }
      }
      return membersList;
    }
    getAdminsByGroup(groupID) {
      const group = this.getGroupByID(groupID);
      // Very bad...
      // if (this.dbService.driver instanceof MongoDatabaseDriver)
      //     return group.Administrators;
      const membersList = [];
      if (group?.Administrators) {
        for (let user in group.Administrators) {
          membersList.push(user);
        }
      }
      return membersList;
    }
    getAllUsersByGroup(groupID) {
      let allUsersList = this.getMembersByGroup(groupID);
      allUsersList = allUsersList.concat(this.getAdminsByGroup(groupID));
      return allUsersList.filter((element, index, list) => index === list.indexOf(element)); // Remove duplicates from the array
    }
    getGroupsByUserID(userID) {
      let groupList;
      const res = [];
      this.groupList$.subscribe(list => {
        groupList = list;
        groupList.forEach(group => {
          const members = this.getMembersByGroup(group.GroupID);
          const admins = this.getAdminsByGroup(group.GroupID);
          if (members.includes(userID) || admins.includes(userID)) {
            res.push(group.GroupID);
          }
        });
      });
      return res;
    }
    getGroupsByUserIDNew(userID) {
      let groupList;
      const res = [];
      return this.orgService.getOrganizationGroups(this.userService.userOrg).then(list => {
        groupList = list;
        groupList.forEach(group => {
          const members = this.getMembersByGroup(group.GroupID);
          const admins = this.getAdminsByGroup(group.GroupID);
          if (members.includes(userID) || admins.includes(userID)) {
            res.push(group.GroupID);
          }
        });
        return res;
      });
    }
    getSubGroupsByGroupID(groupID) {
      const group = this.getGroupByID(groupID);
      let res;
      if (typeof group !== "undefined") {
        return group.subGroups;
      } else {
        return res;
      }
    }
    getGroupParent(groupID) {
      const group = this.getGroupByID(groupID);
      let res;
      if (typeof group !== "undefined") {
        return group.Parent;
      } else {
        return res;
      }
    }
    getGroupNameByID(groupID) {
      const group = this.getGroupByID(groupID);
      return group?.Name;
    }
    getGroupByID(groupID) {
      // this.updateOrgGroups();
      for (let i = 0; i < this.groupList.getValue().length; i++) {
        if (this.groupList.getValue()[i].GroupID === groupID) {
          return this.groupList.value[i];
        }
      }
      return null;
    }
    getUserById(userID) {
      for (let i = 0; i < this.userList.getValue().length; i++) {
        if (this.userList.getValue()[i].uid === userID) {
          return this.userList.value[i];
        }
      }
      return null;
    }
    getUserEmail(userID) {
      const user = this.getUserById(userID);
      if (user) {
        return user.Email;
      } else {
        return "undefined";
      }
    }
    getUserName(userID) {
      const user = this.getUserById(userID);
      if (user) {
        return user.Name;
      } else {
        return "undefined";
      }
    }
    addGroup(org, nameOfGroup, descriptionOfGroup, parent, parentName) {
      this.org = org;
      this.updateOrgGroups(org);
      return this.orgService.addGroup(org, nameOfGroup, descriptionOfGroup, parent, parentName);
    }
    /**
     * Alon: Deleting a group
     * @param org
     * @param group
     */
    deleteGroupg(org, groupKey, groupParent, groupName) {
      return this.orgService.deleteGroups(org, groupKey, groupParent, groupName);
    }
    /*returnCurCounter() {
      return this.orgService.returnCurCounter(this.org);
    }*/
    addMembers(user, groupID, org) {
      this.orgService.addMembers(user, groupID, org);
      this.updateOrgGroups(org);
      return;
    }
    addMultipleMembers(usersAraay, group, org) {
      this.orgService.addMultipleMembers(usersAraay, group, org);
      this.updateOrgGroups(org);
    }
    addUserToAdminGroup(org, groupID, user) {
      this.orgService.addUserToAdminGroup(org, groupID, user);
      this.updateOrgGroups(org);
      return;
    }
    delUserFromGroup(org, groupID, user) {
      this.orgService.delUserFromGroup(org, groupID, user);
      this.updateOrgGroups(org);
    }
    delAdminGroupUser(org, groupID, user) {
      this.orgService.delAdminGroupUser(org, groupID, user);
      this.updateOrgGroups(org);
    }
    addAdminGroup(org, nameOfGroup, descriptionOfGroup, counter) {}
    deleteMultipleUsers(org, group, usersArray) {
      console.log(usersArray);
    }
    setGroupName() {} // not implemented
    setGroupPermissions() {} // group of admins, if you add a user he becomes an admin.. // not implemented
    // not implemented
    setGroupPrefrances(group) {} // modelperfrances, such as... if things are informatical or physical, enviromental or systemic ...
    addSubGroup(group) {} // not implemented
    static #_ = (() => this.ɵfac = function GroupsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GroupsService)(core /* ɵɵinject */.KVO(OrganizationService), core /* ɵɵinject */.KVO(UserService), core /* ɵɵinject */.KVO(DatabaseService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: GroupsService,
      factory: GroupsService.ɵfac
    }))();
  }
  return GroupsService;
})();
