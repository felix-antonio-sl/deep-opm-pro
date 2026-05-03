// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/organization.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let OrganizationService = /*#__PURE__*/(() => {
  class OrganizationService {
    constructor(dbService) {
      this.dbService = dbService;
      // orgToDelete = '';
      this.orgGroups = [];
      this.orgAdminList = [];
      //organizations: Array<string>; // This element should contain all information.
      this.orgGroupName = " All Users";
      this.organizations = new ReplaySubject(1);
      this.organizations$ = this.organizations.asObservable();
      this.allOrganizations = new ReplaySubject(1);
      this.allOrganizations$ = this.allOrganizations.asObservable();
    }
    fetch() {
      this.dbService.driver.getOrganizations().then(result => {
        this.organizations.next(result);
      });
    }
    getOrganizationAnalytics(orgName) {
      return this.dbService.driver.getOrganizationAnalytics(orgName);
    }
    getModelingAnalyticsRawData(orgName) {
      return this.dbService.driver.getModelingAnalyticsRawData(orgName);
    }
    createOrganization(organization) {
      return this.dbService.driver.createOrganization(organization).then(() => this.addGroup(organization.Name, this.getOrgGroupName(organization.Name), "", "", ""));
    }
    getOrganizations() {
      this.fetch();
      return this.organizations$;
    }
    getAllOrgs() {
      return this.dbService.driver.getAllOrganizations();
    }
    getAllOrganizations() {
      this.dbService.driver.getAllOrganizations().then(orgs => {
        this.allOrganizations.next(orgs);
      });
      return this.allOrganizations$;
    }
    getOrganizationUsers(organization, params) {
      return this.dbService.driver.getOrganizationUsers(organization, params);
    }
    bulkDeleteUsers(organization, user_ids, params) {
      return this.dbService.driver.bulkDeleteUsers(organization, user_ids, params);
    }
    bulkUpdateUsers(organization, user_ids, updates) {
      return this.dbService.driver.bulkUpdateUsers(organization, user_ids, updates);
    }
    getOrganizationUsersData(organization) {
      return this.dbService.driver.getOrganizationUsersData(organization);
    }
    getOrganizationGroups(organization) {
      return this.dbService.driver.getOrganizationGroups(organization);
    }
    setOrgAdmins(org) {
      this.orgAdminList = [];
      this.getOrganizationUsersData(org).then(usersList => {
        const users = usersList;
        users.forEach(user => {
          if (user.val.OrgAdmin) {
            this.orgAdminList.push(user.key);
          }
        });
      });
    }
    getOrgGroupName(org) {
      return org + this.orgGroupName;
    }
    deleteOrganization(org) {
      return this.dbService.driver.deleteOrganization(org);
    }
    /**
     * Alon: gets ref object and passes it to be itterated and stored in a class member array
     * @param org
     * @returns {firebase.Promise<any>}
     */
    getGroups(org) {
      return this.dbService.driver.getOrganizationGroups(org);
    }
    deleteGroups(org, groupKey, groupParent, groupName) {
      return this.dbService.driver.deleteGroupg(org, groupKey, groupParent, groupName);
    }
    deleteSubgroup(org, groupKey, groupParent, groupName) {
      return this.dbService.driver.deleteSubgroup(org, groupKey, groupParent, groupName);
    }
    /*returnCurCounter(org) {
      return this.dbService.driver.returnCurCounter(org);
    }*/
    addUserToAdminGroup(org, groupID, user) {
      return this.dbService.driver.addUserToAdminGroup(org, groupID, user);
    }
    delUserFromGroup(org, groupID, user) {
      return this.dbService.driver.delUserFromGroup(org, groupID, user);
    }
    delAdminGroupUser(org, groupID, user) {
      return this.dbService.driver.delAdminGroupUser(org, groupID, user);
    }
    addMultipleMembers(usersAraay, group, org) {
      return this.dbService.driver.addMultipleMembers(usersAraay, group, org);
    }
    addMembers(user, groupID, org) {
      return this.dbService.driver.addMember(user, groupID, org);
    }
    addGroup(org, nameOfGroup, descriptionOfGroup, parent, parentName) {
      return this.dbService.driver.addGroup(org, nameOfGroup, descriptionOfGroup, parent, parentName);
    }
    getGroupFromOrg(organization, groupID) {
      return this.dbService.driver.getGroupFromOrg(organization, groupID);
    }
    deleteUserCanBeAutoTrasfered(user_id) {
      return this.dbService.driver.deleteUserCanBeAutoTrasfered(user_id).then(ret => ret.auto);
    }
    deleteUser(user_id, params) {
      return this.dbService.driver.deleteUser(user_id, params);
    }
    getOrganization(orgName) {
      return this.dbService.driver.getOrganization(orgName);
    }
    updateOrganization(orgName, settings) {
      return this.dbService.driver.updateOrganization(orgName, settings);
    }
    updateGroupName(org, groupID, newName) {
      return this.dbService.driver.updateGroupName(org, groupID, newName);
    }
    updateGroupDescription(org, groupID, NewDescription) {
      return this.dbService.driver.updateGroupDescription(org, groupID, NewDescription);
    }
    activateOrDeactivateOrg(org, activeFlag) {
      return this.dbService.driver.activateOrDeactivateOrg(org, activeFlag);
    }
    updateOrgName(oldName, newName) {
      return this.dbService.driver.updateOrgName(oldName, newName);
    }
    isActiveOrg(org) {
      return this.dbService.driver.isActiveOrg(org);
    }
    updateIgnoreUserLogSharingPermissionFlagForOrg(org, flag) {
      return this.dbService.driver.updateIgnoreUserLogSharingPermissionFlagForOrg(org, flag);
    }
    updateLogCollectionFlagForOrg(org, flag) {
      return this.dbService.driver.updateLogCollectionFlagForOrg(org, flag);
    }
    SDNamesUpdateForOrg(org, SDNames) {
      return this.dbService.driver.SDNamesUpdateForOrg(org, SDNames);
    }
    tutorialModeUpdateForOrg(org, value) {
      return this.dbService.driver.tutorialModeUpdateForOrg(org, value);
    }
    maxUsersNumberUpdateForOrg(org, value) {
      return this.dbService.driver.maxUsersNumberUpdateForOrg(org, value);
    }
    maxViewUsersNumberUpdateForOrg(org, value) {
      return this.dbService.driver.maxViewUsersNumberUpdateForOrg(org, value);
    }
    maxUsersEnabledUpdateForOrg(org, value) {
      return this.dbService.driver.maxUsersEnabledUpdateForOrg(org, value);
    }
    getOrgSDNames(org) {
      return this.dbService.driver.getOrgSDNames(org);
    }
    // Enables/disable chat in a specific organization
    chatEnabledUpdateForOrg(org, chatEnabled) {
      return this.dbService.driver.chatEnabledUpdateForOrg(org, chatEnabled);
    }
    modelReviewAutomaticSyncingUpdateForOrg(org, value) {
      return this.dbService.driver.modelReviewAutomaticSyncingUpdateForOrg(org, value);
    }
    modelReviewAutomaticSyncingLockedUpdateForOrg(org, value) {
      return this.dbService.driver.modelReviewAutomaticSyncingLockedUpdateForOrg(org, value);
    }
    sendMail(emails, subject, message) {
      return this.dbService.driver.sendMail(emails, subject, message);
    }
    addLog(errorLog) {
      return this.dbService.driver.addLog(errorLog);
    }
    getLogs(limit, offset, user) {
      return this.dbService.driver.getLogs(limit, offset, user);
    }
    removeLog(logId) {
      return this.dbService.driver.removeLogById(logId);
    }
    validateUsers(users) {
      return this.dbService.driver.validateUsers(users);
    }
    addUsers(users) {
      return this.dbService.driver.addUsers(users);
    }
    /**
     * input: an id of a user and a boolean value representing the waned action. if true- this user should be deactivated, otherwise activated
     * outout: the user activatuon status will be updated according**/
    changeActivationStatus(useruid, activationStatus) {
      return this.dbService.driver.updateUser(useruid, undefined, {
        isActive: activationStatus
      });
    }
    getOrganizationOntology() {
      var _this = this;
      return (0, default)(function* () {
        // return [{
        //   phrases: ['pointer','pointing device'],
        //   synonyms: ['keyboard','mouse','pen']
        // }];
        return _this.dbService.driver.getOrgOntology();
      })();
    }
    updateOrganizationOntology(ontology) {
      return this.dbService.driver.updateOrgOntology(ontology);
    }
    ontologyEnforcementLevelUpdateForOrg(selectedOrg, ontologyEnforcementLevel) {
      return this.dbService.driver.updateOrgOntologyEnforcementLevel(selectedOrg, ontologyEnforcementLevel);
    }
    auth2FactorsUpdateForOrg(selectedOrg, auth2Factors) {
      return this.dbService.driver.updateOrgAuth2Factors(selectedOrg, auth2Factors);
    }
    updateDefaultUserOptions(organization, defaultUserOptions) {
      return this.dbService.driver.updateDefaultUserOptions(organization, defaultUserOptions);
    }
    updateOrgGenAIAPIKey(organization, apiKey) {
      return this.dbService.driver.updateOrgGenAIAPIKey(organization, apiKey);
    }
    resetOrgGenAIAPIKey(organization) {
      return this.dbService.driver.resetOrgGenAIAPIKey(organization);
    }
    static #_ = (() => this.ɵfac = function OrganizationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OrganizationService)(core /* ɵɵinject */.KVO(DatabaseService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: OrganizationService,
      factory: OrganizationService.ɵfac
    }))();
  }
  return OrganizationService;
})();