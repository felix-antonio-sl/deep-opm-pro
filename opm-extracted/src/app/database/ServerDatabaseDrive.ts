// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/ServerDatabaseDrive.ts
// Extracted by opm-extracted/tools/extract.mjs


let ServerDatabaseDrive = /*#__PURE__*/(() => {
  class ServerDatabaseDrive {
    constructor(http) {
      this.http = http;
      this.target = environment.apiTarget;
    }
    // private target = "http://localhost:3000";
    /////// STORAGE ///////
    updateOrganizationsSSOMap(data) {
      return this.http.post(this.target + "/ssoMap", {
        data: data
      }).toPromise();
    }
    getOrganizationsSSOMap() {
      return this.http.get(this.target + "/ssoMap").toPromise();
    }
    getOrganizationsSSORequests() {
      return this.http.get(this.target + "/ssoRequests").toPromise();
    }
    updateSSORequests(requests) {
      return this.http.put(this.target + "/ssoRequests", {
        requests
      }).toPromise();
    }
    getStereotype(id) {
      const params = new HttpParams().set("id", id);
      return this.http.get(this.target + "/storage/stereotype", {
        params: params
      }).toPromise();
      // return Promise.resolve({...exampleStereotype, id: id, type: StereotypeType.Organization });
    }
    getAllStereotypes() {
      return this.http.get(this.target + "/storage/stereotypes").toPromise();
    }
    getFavoriteTemplates() {
      return this.http.get(this.target + "/storage/templates/favorite").toPromise();
    }
    getFavoriteExamples() {
      return this.http.get(this.target + "/storage/examples/favorite").toPromise();
    }
    getFavoriteStereotypes() {
      return this.http.get(this.target + "/storage/stereotype/favorites").toPromise();
    }
    getTokenForSSO(idToken, type) {
      const params = new HttpParams().set("idToken", idToken).set("sso", "sso").set("type", type);
      return this.http.get(this.target + "/sso/" + idToken, {
        params: params
      }).toPromise();
    }
    saveStereotype(stereotype) {
      var _this = this;
      return (0, default)(function* () {
        return _this.http.post(_this.target + "/storage/stereotype", {
          stereotype: stereotype
        }).toPromise();
      })();
    }
    deleteStereotype(stereotype_id) {
      const params = new HttpParams().set("id", stereotype_id);
      return this.http.delete(this.target + "/storage/stereotype", {
        params: params
      }).toPromise();
    }
    setFavoriteStereotype(id) {
      return this.http.post(this.target + "/storage/stereotype/favorite/" + id, {}).toPromise();
    }
    unsetFavoriteStereotype(id) {
      return this.http.delete(this.target + "/storage/stereotype/favorite/" + id).toPromise();
    }
    setFavoriteExample(modelData, exampleType) {
      return this.http.put(this.target + "/storage/examples/favorite/", {
        model: modelData,
        exampleType
      }).toPromise();
    }
    setFavoriteTemplate(modelData, templateType) {
      return this.http.put(this.target + "/storage/templates/favorite/", {
        model: modelData,
        templateType
      }).toPromise();
    }
    unsetFavoriteExample(modelData) {
      return this.http.delete(this.target + "/storage/examples/favorite/" + modelData.id).toPromise();
    }
    unsetFavoriteTemplate(modelData) {
      return this.http.delete(this.target + "/storage/templates/favorite/" + modelData.id).toPromise();
    }
    saveImageToPool(poolType, url, imageTags) {
      return this.http.put(this.target + "/storage/imagesPool/add", {
        poolType: poolType,
        url: url,
        imageTags: imageTags
      }).toPromise();
    }
    getImagesPool(type) {
      const params = new HttpParams().set("type", type);
      return this.http.get(this.target + "/storage/imagesPool", {
        params: params
      }).toPromise();
    }
    updatePoolImageTags(id, imageTags, poolType) {
      return this.http.post(this.target + "/storage/imagesPool/updateTags", {
        id,
        imageTags,
        poolType
      }).toPromise();
    }
    deletePoolImage(id, poolType) {
      const params = new HttpParams().set("id", id).set("poolType", poolType);
      return this.http.delete(this.target + "/storage/imagesPool", {
        params
      }).toPromise();
    }
    saveModelAsSystemExample(model_id, model) {
      return this.http.put(this.target + "/storage/examples", {
        model_id: model_id,
        model: model
      }).toPromise();
    }
    getMainModel(model_id, isSysExamples, isGlobalTemplates) {
      var _this2 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id).set("sysExamples", String(!!isSysExamples)).set("globalTemplate", String(!!isGlobalTemplates));
        return _this2.http.get(_this2.target + "/storage/model", {
          params: params
        }).toPromise();
      })();
    }
    getAutosaveModel(model_id) {
      var _this3 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id);
        return _this3.http.get(_this3.target + "/storage/automodel", {
          params: params
        }).toPromise();
      })();
    }
    getModelByPath(title, path) {
      var _this4 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("title", title).set("path", path);
        return _this4.http.get(_this4.target + "/storage/modelByPath", {
          params: params
        }).toPromise();
      })();
    }
    getModels(directory_id, archiveMode, sysExamples, globalTemplates) {
      var _this5 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("directory_id", directory_id).set("archive", String(archiveMode)).set("sysExamples", String(sysExamples)).set("globalTemplate", String(globalTemplates));
        return _this5.http.get(_this5.target + "/storage/models", {
          params: params
        }).toPromise();
      })();
    }
    getModelImage(model_id, isSysExample, isGlobalTemplates) {
      var _this6 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id).set("sysExamples", String(!!isSysExample)).set("globalTemplate", String(!!isGlobalTemplates));
        return _this6.http.get(_this6.target + "/storage/modelImage", {
          params: params
        }).toPromise();
      })();
    }
    getAllModelsUserCanLoad(isGlobalTemplates = false) {
      const params = new HttpParams().set("globalTemplate", String(!!isGlobalTemplates));
      return this.http.get(this.target + "/storage/allModels", {
        params: params
      }).toPromise();
    }
    getLastModels() {
      var _this7 = this;
      return (0, default)(function* () {
        return _this7.http.get(_this7.target + "/storage/lastModels").toPromise();
      })();
    }
    removeFromLastModels(modelId) {
      var _this8 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", modelId);
        return _this8.http.delete(_this8.target + "/storage/lastModels", {
          params
        }).toPromise();
      })();
    }
    autosaveModel(model_id, model) {
      var _this9 = this;
      return (0, default)(function* () {
        const compressed = pako.gzip(JSON.stringify(model)).toString();
        return _this9.http.put(_this9.target + "/storage/autosave", {
          model_id: model_id,
          model: compressed
        }).toPromise().catch(/*#__PURE__*/function () {
          var _ref = (0, default)(function* (err) {
            yield OPCloudUtils.waitXms(5000); // in case of expired token, try again after the token has refreshed.
            return _this9.http.put(_this9.target + "/storage/autosave", {
              model_id: model_id,
              model: compressed
            }).toPromise();
          });
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      })();
    }
    /**
     * API Request to the server to get chat messages
     *
     * @param {string} model_id The id of the context model.
     * @param {getChatAction} action which messages to get (all, unread).
     * @return {Promise<getChatResponse>} promise with the response.
     */
    getChatMessages(model_id, action) {
      var _this10 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id).set("action", action);
        return _this10.http.get(_this10.target + "/storage/chatMessage", {
          params: params
        }).toPromise();
      })();
    }
    /**
     * API Request to the server to send chat message
     *
     * @param {DisplayChat} message The message to send.
     * @return {Promise<getChatResponse>} promise with the response.
     */
    pushChatMessage(message) {
      var _this11 = this;
      return (0, default)(function* () {
        return _this11.http.post(_this11.target + "/storage/chatMessage", {
          message: message
        }).toPromise();
      })();
    }
    removeChatMessage(msg_id, model_id) {
      var _this12 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("msg_id", msg_id).set("model_id", model_id);
        return _this12.http.delete(_this12.target + "/storage/chatMessage", {
          params
        }).toPromise();
      })();
    }
    createModel(directory_id, model) {
      var _this13 = this;
      return (0, default)(function* () {
        const compressed = pako.gzip(JSON.stringify(model)).toString();
        return _this13.http.post(_this13.target + "/storage/model", {
          directory_id: directory_id,
          model: compressed
        }).toPromise();
      })();
    }
    overrideModel(model_id, model) {
      var _this14 = this;
      return (0, default)(function* () {
        const compressed = pako.gzip(JSON.stringify(model)).toString();
        return _this14.http.put(_this14.target + "/storage/model", {
          model_id: model_id,
          model: compressed
        }).toPromise();
      })();
    }
    archiveModel(model_id, archiveMode) {
      var _this15 = this;
      return (0, default)(function* () {
        return _this15.http.put(_this15.target + "/storage/archive", {
          model_id: model_id,
          archiveMode: archiveMode
        }).toPromise();
      })();
    }
    getPermissions(model_id) {
      var _this16 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id);
        return _this16.http.get(_this16.target + "/storage/permissions", {
          params: params
        }).toPromise();
      })();
    }
    updatePermissions(model_id, permissions) {
      var _this17 = this;
      return (0, default)(function* () {
        return _this17.http.put(_this17.target + "/storage/permissions", {
          model_id: model_id,
          permissions: permissions
        }).toPromise();
      })();
    }
    updateFolderPermissions(folderId, permissions) {
      var _this18 = this;
      return (0, default)(function* () {
        return _this18.http.put(_this18.target + "/storage/folders/permissions", {
          folderId: folderId,
          permissions: permissions
        }).toPromise();
      })();
    }
    getFolderPermissions(folderId) {
      var _this19 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("folderId", folderId);
        return _this19.http.get(_this19.target + "/storage/folders/permissions", {
          params: params
        }).toPromise();
      })();
    }
    moveFolder(sourceId, targetId, sysExamples, globalTemplate) {
      var _this20 = this;
      return (0, default)(function* () {
        return _this20.http.put(_this20.target + "/storage/directory/move", {
          sourceId,
          targetId,
          sysExamples,
          globalTemplate
        }).toPromise();
      })();
    }
    moveModel(modelId, dir_id, sysExamples, globalTemplate) {
      var _this21 = this;
      return (0, default)(function* () {
        return _this21.http.put(_this21.target + "/storage/model/move", {
          modelId,
          dir_id,
          sysExamples,
          globalTemplate
        }).toPromise();
      })();
    }
    getVersions(model_id) {
      var _this22 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id);
        return _this22.http.get(_this22.target + "/storage/versions", {
          params
        }).toPromise();
      })();
    }
    getVersionModel(model_id, ver_index) {
      var _this23 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id).set("ver_index", ver_index);
        return _this23.http.get(_this23.target + "/storage/version", {
          params
        }).toPromise();
      })();
    }
    renameModel(id, title, sysExamples, globalTemplates) {
      var _this24 = this;
      return (0, default)(function* () {
        return _this24.http.put(_this24.target + "/storage/model/title", {
          model_id: id,
          title: title,
          sysExamples: sysExamples,
          globalTemplate: globalTemplates
        }).toPromise();
      })();
    }
    renameFolder(id, title, sysExamples, globalTemplates) {
      var _this25 = this;
      return (0, default)(function* () {
        return _this25.http.put(_this25.target + "/storage/directory/title", {
          directory_id: id,
          title: title,
          sysExamples: sysExamples,
          globalTemplate: globalTemplates
        }).toPromise();
      })();
    }
    getFolders(directory_id, sysExamples, globalTemplates) {
      var _this26 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("directory_id", directory_id).set("sysExamples", String(sysExamples)).set("globalTemplate", String(globalTemplates));
        return _this26.http.get(_this26.target + "/storage/directory", {
          params: params
        }).toPromise();
      })();
    }
    getAllFolders(globalTemplates = false) {
      var _this27 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("globalTemplate", String(globalTemplates));
        return _this27.http.get(_this27.target + "/storage/directories", {
          params: params
        }).toPromise();
      })();
    }
    createFolder(father_id, title, sysExamples, orgExample, globalTemplates, orgTemplate) {
      var _this28 = this;
      return (0, default)(function* () {
        return _this28.http.post(_this28.target + "/storage/directory", {
          father_id: father_id,
          title: title,
          sysExamples: sysExamples,
          orgExample: orgExample,
          globalTemplate: globalTemplates,
          orgTemplate: orgTemplate
        }).toPromise();
      })();
    }
    removeModel(model_id, sysExamples, globalTemplates) {
      var _this29 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("model_id", model_id).set("sysExamples", String(!!sysExamples)).set("globalTemplate", String(!!globalTemplates));
        return _this29.http.delete(_this29.target + "/storage/model", {
          params
        }).toPromise();
      })();
    }
    removeFolder(fid, sysExamples, globalTemplates) {
      var _this30 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("dir_id", fid).set("sysExamples", String(!!sysExamples)).set("globalTemplate", String(!!globalTemplates));
        return _this30.http.delete(_this30.target + "/storage/directories", {
          params
        }).toPromise();
      })();
    }
    /* public async deleteFolder(organization: string, path: string, name: string): Promise<void> {
      const params = new HttpParams().set('path', path).set('name', name);
      return this.http.delete<void>(this.target + '/storage/folder', {params: params}).toPromise();
    } */
    /////////////////////// USER ///////////////////////////
    findUser(userDetails) {
      var _this31 = this;
      return (0, default)(function* () {
        const uid = userDetails.uid;
        return _this31.http.get(_this31.target + "/user/getUser/" + uid).toPromise();
      })();
    }
    updateUser(useruid, organization, user) {
      var _this32 = this;
      return (0, default)(function* () {
        return _this32.http.post(_this32.target + "/user/details/" + useruid, {
          user: user
        }).toPromise();
      })();
    }
    updateOrgName(oldName, newName) {
      var _this33 = this;
      return (0, default)(function* () {
        return _this33.http.post(_this33.target + "/organization/name", {
          oldName,
          newName
        }).toPromise();
      })();
    }
    deleteOrganization(orgName) {
      var _this34 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("orgName", orgName);
        return _this34.http.delete(_this34.target + "/organization/delete", {
          params
        }).toPromise();
      })();
    }
    createUser(user) {
      var _this35 = this;
      return (0, default)(function* () {
        if (user.hasOwnProperty("viewer")) {
          user.isViewerAccount = user.viewer;
        }
        return _this35.http.put(_this35.target + "/createUser", {
          user: user
        }).toPromise();
      })();
    }
    deleteUserCanBeAutoTrasfered(uid) {
      const http_params = new HttpParams().set("remove_id", uid);
      return this.http.get(this.target + "/organization/user/delete/transfred", {
        params: http_params
      }).toPromise();
    }
    deleteUser(uid, params) {
      var _this36 = this;
      return (0, default)(function* () {
        return _this36.http.post(_this36.target + "/organization/user/delete", {
          remove_id: uid,
          ...params
        }).toPromise();
      })();
    }
    resetPasswordForNotLoggedUser(email) {
      const http_params = new HttpParams().set("email", email);
      return this.http.get(this.target + "/resetUserPassword", {
        params: http_params
      }).toPromise();
    }
    // deleteUser(useruid: string, org: string): Promise<void> {
    // }
    /////////////////Organization///////////
    createOrganization(orgniazation) {
      var _this37 = this;
      return (0, default)(function* () {
        return _this37.http.post(_this37.target + "/organization/create", {
          data: orgniazation
        }).toPromise();
      })();
    }
    getOrganizations() {
      var _this38 = this;
      return (0, default)(function* () {
        try {
          const response = yield firstValueFrom(_this38.http.get(_this38.target + "/organization/all"));
          return response || [];
        } catch (error) {
          console.error("Error in getOrganizations:", error);
          throw error;
        }
      })();
    }
    getAllOrganizations() {
      var _this39 = this;
      return (0, default)(function* () {
        try {
          return yield _this39.getOrganizations();
        } catch (error) {
          console.error("Error in getAllOrganizations:", error);
          throw error;
        }
      })();
    }
    activateOrDeactivateOrg(org, activeFlag) {
      var _this40 = this;
      return (0, default)(function* () {
        return _this40.http.post(_this40.target + "/organization/activateOrDeactivate", {
          activeFlag: activeFlag,
          org: org
        }).toPromise();
      })();
    }
    SDNamesUpdateForOrg(org, SDNames) {
      var _this41 = this;
      return (0, default)(function* () {
        return _this41.http.post(_this41.target + "/organization/settings/" + org, {
          settings: {
            SDNames: SDNames
          }
        }).toPromise();
      })();
    }
    getOrgSDNames(org) {
      var _this42 = this;
      return (0, default)(function* () {
        return _this42.getOrganization(org).then(orgData => {
          return orgData.SDNames;
        });
      })();
    }
    getOrganizationGroups(organization) {
      var _this43 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("organization", organization);
        return _this43.http.get(_this43.target + "/organization/groups", {
          params
        }).toPromise();
      })();
    }
    deleteGroupg(org, group, parent, parentName) {
      var _this44 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("organization", org).set("group", group);
        return _this44.http.delete(_this44.target + "/organization/group", {
          params
        }).toPromise();
      })();
    }
    updateGroupName(org, groupID, newName) {
      var _this45 = this;
      return (0, default)(function* () {
        return _this45.http.post(_this45.target + "/organization/group/updateName", {
          org,
          groupID,
          newName
        }).toPromise();
      })();
    }
    updateGroupDescription(org, groupID, NewDescription) {
      var _this46 = this;
      return (0, default)(function* () {
        return _this46.http.post(_this46.target + "/organization/group/updateDescription", {
          org,
          groupID,
          description: NewDescription
        }).toPromise();
      })();
    }
    addUserToAdminGroup(org, groupID, user) {
      var _this47 = this;
      return (0, default)(function* () {
        return _this47.http.post(_this47.target + "/organization/group/addAdmin", {
          org,
          groupID,
          userId: user.uid
        }).toPromise();
      })();
    }
    delUserFromGroup(org, groupID, user) {
      var _this48 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("organization", org).set("groupId", groupID).set("userId", user.uid);
        return _this48.http.delete(_this48.target + "/organization/group/user", {
          params
        }).toPromise();
      })();
    }
    delAdminGroupUser(org, groupID, user) {
      var _this49 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("organization", org).set("groupId", groupID).set("userId", user.uid);
        return _this49.http.delete(_this49.target + "/organization/group/admin", {
          params
        }).toPromise();
      })();
    }
    deleteSubgroup(org, subgroup, parentID, parentName) {
      var _this50 = this;
      return (0, default)(function* () {
        const params = new HttpParams().set("organization", org).set("subgroupId", subgroup).set("parentId", parentID).set("parentName", parentName);
        return _this50.http.delete(_this50.target + "/organization/group/subgroup", {
          params
        }).toPromise();
      })();
    }
    addSubgroup(org, parentID, subgroup, parentName) {
      var _this51 = this;
      return (0, default)(function* () {
        return _this51.http.post(_this51.target + "/organization/group/subgroup", {
          org,
          parentID,
          subgroup,
          parentName
        }).toPromise();
      })();
    }
    addGroup(org, nameOfGroup, descriptionOfGroup, parent, parentName) {
      var _this52 = this;
      return (0, default)(function* () {
        return _this52.http.post(_this52.target + "/organization/group/add", {
          org,
          nameOfGroup,
          description: descriptionOfGroup,
          parent,
          parentName
        }).toPromise();
      })();
    }
    addMember(user, groupID, org) {
      var _this53 = this;
      return (0, default)(function* () {
        return _this53.http.post(_this53.target + "/organization/group/addMembers", {
          org,
          groupId: groupID,
          usersArray: [user.uid]
        }).toPromise();
      })();
    }
    addMultipleMembers(usersArray, groupId, org) {
      var _this54 = this;
      return (0, default)(function* () {
        return _this54.http.post(_this54.target + "/organization/group/addMembers", {
          org,
          groupId,
          usersArray
        }).toPromise();
      })();
    }
    /**
    * API Request to the server to update chatEnabled state
    *
    * @param {string} org The org to update.
    * @param {boolean} chatEnabled The new state of chatEnabled.
    * @return {Promise<void>}
    */
    chatEnabledUpdateForOrg(org, chatEnabled) {
      var _this55 = this;
      return (0, default)(function* () {
        return _this55.http.post(_this55.target + "/organization/settings/" + org, {
          settings: {
            chatEnabled: chatEnabled
          }
        }).toPromise();
      })();
    }
    modelReviewAutomaticSyncingUpdateForOrg(org, value) {
      var _this56 = this;
      return (0, default)(function* () {
        return _this56.http.post(_this56.target + "/organization/settings/" + org, {
          settings: {
            modelReviewAutomaticSyncing: value
          }
        }).toPromise();
      })();
    }
    modelReviewAutomaticSyncingLockedUpdateForOrg(org, value) {
      var _this57 = this;
      return (0, default)(function* () {
        return _this57.http.post(_this57.target + "/organization/settings/" + org, {
          settings: {
            modelReviewAutomaticSyncingLocked: value
          }
        }).toPromise();
      })();
    }
    /**
     * API Request to the server to get chatEnabled state
     *
     * @param {string} org The org to retrieve.
     * @param {boolean} chatEnabled The new state of chatEnabled.
     * @return {Promise<boolean>} boolean value for is chatEnabled on this org.
     */
    getOrganizationUsers(organization, params) {
      var _this58 = this;
      return (0, default)(function* () {
        let url = _this58.target + "/organization/users/" + organization;
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.page) {
            queryParams.append("page", params.page.toString());
          }
          if (params.limit) {
            queryParams.append("limit", params.limit.toString());
          }
          if (params.sortBy) {
            queryParams.append("sortBy", params.sortBy);
          }
          if (params.sortOrder) {
            queryParams.append("sortOrder", params.sortOrder);
          }
          if (params.expirationFilter) {
            queryParams.append("expirationFilter", params.expirationFilter);
          }
          if (params.includeSSO !== undefined) {
            queryParams.append("includeSSO", params.includeSSO.toString());
          }
          if (params.search) {
            queryParams.append("search", params.search);
          }
          const queryString = queryParams.toString();
          if (queryString) {
            url += "?" + queryString;
          }
        }
        // Backend returns new format when params are provided, old format (array) when not
        return _this58.http.get(url).toPromise();
      })();
    }
    bulkDeleteUsers(organization, user_ids, params) {
      var _this59 = this;
      return (0, default)(function* () {
        return _this59.http.post(_this59.target + "/organization/users/bulk-delete", {
          organization,
          user_ids,
          action: params.action,
          transfer_to: params.transfer_to
        }).toPromise();
      })();
    }
    bulkUpdateUsers(organization, user_ids, updates) {
      var _this60 = this;
      return (0, default)(function* () {
        return _this60.http.post(_this60.target + "/organization/users/bulk-update", {
          organization,
          user_ids,
          updates
        }).toPromise();
      })();
    }
    getOrganization(organizationName) {
      var _this61 = this;
      return (0, default)(function* () {
        return _this61.http.get(_this61.target + "/organization/settings/" + organizationName).toPromise();
      })();
    }
    getOrganizationUsersData(organization) {
      var _this62 = this;
      return (0, default)(function* () {
        const result = yield _this62.getOrganizationUsers(organization);
        // Backward compatibility: result is an array when called without params
        if (Array.isArray(result)) {
          return result;
        } else {
          return result.users || [];
        }
      })();
    }
    getGroupFromOrg(organization, groupID) {
      return new Promise(resolve => {
        this.getOrganizationGroups(organization).then(groups => {
          groups.forEach(group => {
            if (group.GroupID === groupID) {
              resolve(group);
            }
          });
        });
      });
    }
    updateOrganization(organizationName, organization) {
      var _this63 = this;
      return (0, default)(function* () {
        return _this63.http.post(_this63.target + "/organization/settings/" + organizationName, {
          settings: organization
        }).toPromise();
      })();
    }
    isActiveOrg(org) {
      var _this64 = this;
      return (0, default)(function* () {
        return _this64.getAllOrganizations().then(allOrgs => allOrgs.find(item => item.name === org)?.flag);
      })();
    }
    sendMail(emails, subject, message) {
      var _this65 = this;
      return (0, default)(function* () {
        return _this65.http.post(_this65.target + "/mail/send", {
          to: emails,
          subject: subject,
          message: message
        }).toPromise();
      })();
    }
    addLog(log) {
      var _this66 = this;
      return (0, default)(function* () {
        return _this66.http.post(_this66.target + "/logs", log).toPromise();
      })();
    }
    getLogs(limit, offset, user) {
      var _this67 = this;
      return (0, default)(function* () {
        // console.log("getting logs")
        const optionalUserFilter = user ? `&userId=${user}` : "";
        return _this67.http.get(`${_this67.target + "/logs"}?limit=${limit}&offset=${offset}${optionalUserFilter}`).toPromise();
      })();
    }
    removeLogById(logId) {
      var _this68 = this;
      return (0, default)(function* () {
        return _this68.http.delete(`${_this68.target + "/logs"}?logId=${logId}`).toPromise();
      })();
    }
    updateLogCollectionFlagForOrg(org, flag) {
      var _this69 = this;
      return (0, default)(function* () {
        return _this69.http.post(_this69.target + "/organization/settings/" + org, {
          settings: {
            logCollectingEnabled: flag
          }
        }).toPromise();
      })();
    }
    tutorialModeUpdateForOrg(org, value) {
      var _this70 = this;
      return (0, default)(function* () {
        return _this70.http.post(_this70.target + "/organization/settings/" + org, {
          settings: {
            tutorialMode: value
          }
        }).toPromise();
      })();
    }
    maxUsersNumberUpdateForOrg(org, value) {
      var _this71 = this;
      return (0, default)(function* () {
        return _this71.http.post(_this71.target + "/organization/settings/" + org, {
          settings: {
            maxUsersNumber: value
          }
        }).toPromise();
      })();
    }
    maxViewUsersNumberUpdateForOrg(org, value) {
      var _this72 = this;
      return (0, default)(function* () {
        return _this72.http.post(_this72.target + "/organization/settings/" + org, {
          settings: {
            maxViewUsersNumber: value
          }
        }).toPromise();
      })();
    }
    updateOrgOntology(ontology) {
      var _this73 = this;
      return (0, default)(function* () {
        return _this73.http.put(_this73.target + "/organization/ontology", {
          ontology: ontology
        }).toPromise();
      })();
    }
    getOrgOntology() {
      var _this74 = this;
      return (0, default)(function* () {
        return _this74.http.get(_this74.target + "/organization/ontology", {}).toPromise();
      })();
    }
    updateOrgOntologyEnforcementLevel(org, ontologyEnforcementLevel) {
      var _this75 = this;
      return (0, default)(function* () {
        return _this75.http.post(_this75.target + "/organization/settings/" + org, {
          settings: {
            ontologyEnforcementLevel: ontologyEnforcementLevel
          }
        }).toPromise();
      })();
    }
    changeUserInitialPassword(uid) {
      var _this76 = this;
      return (0, default)(function* () {
        return _this76.http.post(_this76.target + "/user/changeInitialPassword", {
          user_id: uid
        }).toPromise();
      })();
    }
    signInWithEmailAndPassword(email, password, verificationCode = null) {
      var _this77 = this;
      return (0, default)(function* () {
        return _this77.http.post(_this77.target + "/guest/login", {
          user: {
            email,
            password,
            verificationCode
          }
        }).toPromise();
      })();
    }
    resend2FAVerificationCode(email) {
      var _this78 = this;
      return (0, default)(function* () {
        return _this78.http.post(_this78.target + "/guest/resend2FAVerificationCode", {
          email
        }).toPromise();
      })();
    }
    getOrganizationAnalytics(org) {
      const params = new HttpParams().set("organization", org);
      return this.http.get(this.target + "/organization/analytics", {
        params
      }).toPromise();
    }
    getActivityMetrics(org, timeRange) {
      const params = new HttpParams().set("organization", org).set("range", timeRange);
      return this.http.get(this.target + "/organization/analytics/activityMetrics", {
        params
      }).toPromise();
    }
    getModelingAnalyticsRawData(org, timeRange) {
      var _this79 = this;
      return (0, default)(function* () {
        let params = new HttpParams().set("organization", org);
        if (timeRange) {
          params = params.set("range", timeRange);
        }
        return firstValueFrom(_this79.http.get(_this79.target + "/organization/rawDataAnalytics", {
          params
        }));
      })();
    }
    maxUsersEnabledUpdateForOrg(org, value) {
      var _this80 = this;
      return (0, default)(function* () {
        return _this80.http.post(_this80.target + "/organization/settings/" + org, {
          settings: {
            maxUsersEnabled: value
          }
        }).toPromise();
      })();
    }
    updateIgnoreUserLogSharingPermissionFlagForOrg(org, flag) {
      var _this81 = this;
      return (0, default)(function* () {
        return _this81.http.post(_this81.target + "/organization/settings/" + org, {
          settings: {
            ignoreUserLogSharingPermission: flag
          }
        }).toPromise();
      })();
    }
    /*
    public async getIgnoreUserLogSharingPermissionFlagForOrg(org: string) {
      return new Promise<boolean>(true);
      // return this.http.get<any>(this.target + '/organization/settings/' + org).pipe(res => res["ignoreUserLogSharingPermission"] == 'true').toPromise();
       }
    */
    logSignOutUser() {
      return this.http.post(this.target + "/organization/logSignOut", {}).toPromise();
    }
    updateUserOplSettings(settings) {
      return this.http.post(this.target + "/user/settings", {
        settings: settings
      }).toPromise();
    }
    addUsers(users) {
      return this.http.put(this.target + "/organization/addUsers", {
        users
      }).toPromise();
    }
    validateUsers(users) {
      return this.http.post(this.target + "/organization/validateUsers", {
        users
      }).toPromise();
    }
    updateUserLastTabsToDB(relevantTabs) {
      return this.http.post(this.target + "/user/lastTabs", {
        tabs: relevantTabs
      }).toPromise();
    }
    getUserLastTabsFromDB() {
      return this.http.get(this.target + "/user/lastTabs").toPromise();
    }
    downloadModel(modelId, isSysExample, globalTemplates) {
      const http_params = new HttpParams().set("modelId", modelId).set("sysExamples", String(isSysExample)).set("globalTemplates", String(globalTemplates));
      return this.http.get(this.target + "/storage/downloadModel", {
        params: http_params
      }).toPromise();
    }
    sendUserPing(uid) {
      const http_params = new HttpParams().set("uid", uid);
      return this.http.post(this.target + "/organization/userPing", {
        params: http_params
      }).toPromise();
    }
    canLoginDueToMaxUsersNumber(organization) {
      const http_params = new HttpParams().set("organization", organization);
      return this.http.get(this.target + "/organization/checkIfMaxUsersReached", {
        params: http_params
      }).toPromise();
    }
    validateGoogleToken(user) {
      const http_params = new HttpParams().set("tokenUser", user);
      return this.http.get(this.target + "/checkGoogleToken", {
        params: http_params
      }).toPromise();
    }
    createPopupMessage(type, message) {
      const route = type === "org" ? "/organization" : "";
      return this.http.post(this.target + route + "/popupMessage", {
        message
      }).toPromise();
    }
    updatePopupMessage(type, message) {
      const route = type === "org" ? "/organization" : "";
      return this.http.put(this.target + route + "/popupMessage", {
        message
      }).toPromise();
    }
    removePopupMessage(type, id) {
      const params = new HttpParams().set("id", id);
      const route = type === "org" ? "/organization" : "";
      return this.http.delete(this.target + route + "/popupMessage", {
        params
      }).toPromise();
    }
    getAllPopupMessages(type) {
      const route = type === "org" ? "/organization" : "";
      return this.http.get(this.target + route + "/popupMessages").toPromise();
    }
    markPopupMessageAsSeen(type, id) {
      const route = type === "org" ? "/organization" : "";
      return this.http.post(this.target + route + "/popupMessages/seen", {
        messageId: id
      }).toPromise();
    }
    markMessageAsConfirmed(type, id, remindMeLater) {
      const route = type === "org" ? "/organization" : "";
      return this.http.post(this.target + route + "/popupMessages/confirmed", {
        messageId: id,
        remindMeLater
      }).toPromise();
    }
    getAllPopupMessagesToShow(type) {
      const route = type === "org" ? "/organization" : "";
      return this.http.get(this.target + route + "/popupMessages/user").toPromise();
    }
    updateOrgAuth2Factors(selectedOrg, auth2Factors) {
      return this.http.post(this.target + "/organization/auth2Factors", {
        organization: selectedOrg,
        auth2Factors: auth2Factors
      }).toPromise();
    }
    updateDefaultUserOptions(organization, defaultUserOptions) {
      return this.http.post(this.target + "/organization/defaultUserOptions", {
        defaultUserOptions,
        organization
      }).toPromise();
    }
    getModelLastEditDate(modelId) {
      const params = new HttpParams().set("id", modelId);
      return this.http.get(this.target + "/storage/modelLastEditDate", {
        params: params
      }).toPromise();
    }
    getModelsLastEditDates(modelIds) {
      return this.http.post(this.target + "/storage/modelsLastEditDates", {
        modelIds: modelIds
      }).toPromise();
    }
    getOPLfromGenAI(uid, opdText) {
      const compressed = pako.gzip(JSON.stringify(opdText)).toString();
      return this.http.post(this.target + "/user/genOPLai", {
        uid: uid,
        oplText: compressed
      }).toPromise();
    }
    getSimpleOPLGenAI(uid, opdText) {
      const compressed = pako.gzip(JSON.stringify(opdText)).toString();
      return this.http.post(this.target + "/user/getSimpleOPLGenAI", {
        uid: uid,
        oplText: compressed
      }).toPromise();
    }
    updateUserGenAIApiKey(uid, apiKey) {
      return this.http.post(this.target + "/user/updateGenAIApiKey", {
        uid: uid,
        apiKey: apiKey
      }).toPromise();
    }
    updateOrgGenAIAPIKey(organization, apiKey) {
      return this.http.post(this.target + "/organization/updateOrgGenAIApiKey/", {
        organization: organization,
        orgGenAIAPIKey: apiKey
      }).toPromise();
    }
    resetUserGenAIApiKey(uid) {
      return this.http.post(this.target + "/user/resetGenAIApiKey", {
        uid: uid
      }).toPromise();
    }
    resetOrgGenAIAPIKey(organization) {
      return this.http.post(this.target + "/organization/resetOrgGenAIApiKey/", {
        organization: organization
      }).toPromise();
    }
    getGenAIImpactAnalysis(uid, modelOpl, triplets) {
      const compressedModel = pako.gzip(JSON.stringify(modelOpl)).toString();
      const compressedTriplets = pako.gzip(JSON.stringify(triplets)).toString();
      return this.http.post(this.target + "/user/getGenAIImpactAnalysis", {
        uid: uid,
        modelOpl: compressedModel,
        triplets: compressedTriplets
      }).toPromise();
    }
    getGenAIRequirementsGeneration(uid, modelOpl, triplets) {
      const gzipToBase64 = input => {
        const gz = pako.gzip(input); // Uint8Array
        let bin = "";
        for (let i = 0; i < gz.length; i++) {
          bin += String.fromCharCode(gz[i]);
        }
        return btoa(bin); // base64
      };
      const payload = {
        uid,
        // NO modelName here
        oplB64: gzipToBase64(modelOpl),
        triplesB64: gzipToBase64(JSON.stringify(triplets)),
        options: {
          enforceOPM: true,
          iso29148: true,
          jsonMode: true,
          addAcceptanceCriteria: true,
          splitAtomic: true,
          language: "en",
          provider: "gemini"
        }
      };
      return this.http.post(this.target + "/user/getGenAIRequirementsGeneration", payload, {
        responseType: "json"
      } // component receives an object
      ).toPromise();
    }
    getGenAIComputationalFunction(uid, computationalFunction) {
      const compressedFunc = pako.gzip(JSON.stringify(computationalFunction)).toString();
      return this.http.post(this.target + "/user/getGenAIComputationalFunction", {
        uid: uid,
        computationalFunction: compressedFunc
      }).toPromise();
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ServerDatabaseDrive)(core /* ɵɵinject */.KVO(HttpClient));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ServerDatabaseDrive,
      factory: ServerDatabaseDrive.ɵfac
    }))();
  }
  return ServerDatabaseDrive;
})();
