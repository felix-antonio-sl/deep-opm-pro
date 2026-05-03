// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/storage.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let StorageService = /*#__PURE__*/(() => {
  class StorageService {
    constructor(database, userService) {
      this.database = database;
      this.userService = userService;
      this.autoSaveInterval = 5;
      this.db = database.driver;
      userService.user$.subscribe(user => {
        this.user = user;
        if (this.user.userData.autosave) {
          this.autoSaveInterval = this.user.userData.autosave;
        }
      });
    }
    getModelByPath(title, path) {
      var _this = this;
      return (0, default)(function* () {
        return _this.db.getModelByPath(title, path).then(model => {
          // TODO: These flags should be generated in a better way - taken from the server.
          return {
            id: model.meta.id,
            name: model.meta.title,
            description: model.meta.description,
            archiveMode: model.meta.archiveMode,
            isAutosave: false,
            isVersion: false,
            path: "",
            permission: model.meta.permissions == "write" ? CurrentModelPermission.WRITE : CurrentModelPermission.READ,
            editBy: {
              date: model.meta.editBy.date,
              name: model.meta.editBy.name
            },
            logicalElements: model.data.logicalElements,
            currentOpd: model.data.currentOpd,
            opds: model.data.opds,
            stereotypes: model.data.stereotypes,
            compressionMetadata: model.data.compressionMetadata // Preserve compression metadata
          };
        });
      })();
    }
    getVersions(model_id) {
      var _this2 = this;
      return (0, default)(function* () {
        return _this2.db.getVersions(model_id);
        // return {
        //   id: 'id1',
        //   title: 'Good Model',
        //   description: 'Some very good model',
        //   editBy: 'daniel',
        //   versions: [
        //     { date: '25.04.23', ver_index: '0' },
        //     { date: '25.04.23', ver_index: '1' },
        //     { date: '25.04.23', ver_index: '2' }
        //   ]
        // }
      })();
    }
    getUserObservable() {
      return this.userService.getUserObservable();
    }
    getVersionModel(model_id, ver_index) {
      var _this3 = this;
      return (0, default)(function* () {
        return _this3.generateModelSchema(_this3.db.getVersionModel(model_id, ver_index), {
          isAutosave: false,
          isVersion: true
        });
      })();
    }
    generateModelSchema(p, params) {
      return (0, default)(function* () {
        return p.then(model => {
          // TODO: These flags should be generated in a better way - taken from the server.
          return {
            id: model.meta.id,
            name: model.meta.title,
            dirsPath: model.meta.dirsPath,
            description: model.meta.description,
            archiveMode: model.meta.archiveMode,
            isAutosave: params.isAutosave,
            isVersion: params.isVersion,
            path: "",
            permission: model.meta.permissions == "write" ? CurrentModelPermission.WRITE : CurrentModelPermission.READ,
            editBy: {
              date: model.meta.editBy.date,
              name: model.meta.editBy.name
            },
            autoOpdTreeSort: model.data.autoOpdTreeSort,
            importedTemplates: model.data.importedTemplates,
            relatedRelations: model.data.relatedRelations,
            fatherModelName: model.data.fatherModelName,
            compressionMetadata: model.data.compressionMetadata,
            // Preserve compression metadata
            logicalElements: model.data.logicalElements,
            currentOpd: model.data.currentOpd,
            opds: model.data.opds,
            stereotypes: model.data.stereotypes
          };
        }).then(result => {
          // compressionMetadata is preserved from backend if present
          return result;
        });
        //   .catch(err => {
        //   let msg;
        //   if (err.status === 404)
        //     msg = 'Unable to load the model. It seems you do not have permission to view it.';
        //   else
        //     msg = 'Unable to load the model. It seems the model does not exist.';
        //
        //   if (!err.message.includes('sysExamples=false'))
        //     validationAlert(msg, 6000, 'Error');
        //
        //   throw Error(err.message);
        // });
      })();
    }
    getModel(id, ver, isSysExamples, isGlobalTemplates) {
      var _this4 = this;
      return (0, default)(function* () {
        // TODO: Split into two functions
        let p;
        let isAutosave;
        if (ver == "MAIN") {
          p = _this4.db.getMainModel(id, isSysExamples, isGlobalTemplates);
          isAutosave = false;
        } else {
          p = _this4.db.getAutosaveModel(id);
          isAutosave = true;
        }
        return _this4.generateModelSchema(p, {
          isAutosave,
          isVersion: false
        });
      })();
    }
    createModel(params, model) {
      var _this5 = this;
      return (0, default)(function* () {
        return _this5.db.createModel(params.at_directory, model);
      })();
    }
    getImagesPool(type) {
      var _this6 = this;
      return (0, default)(function* () {
        return _this6.db.getImagesPool(type);
      })();
    }
    overrideModel(params, model) {
      var _this7 = this;
      return (0, default)(function* () {
        return _this7.db.overrideModel(params.model_id, model);
      })();
    }
    archiveModel(params) {
      var _this8 = this;
      return (0, default)(function* () {
        return _this8.db.archiveModel(params.model_id, params.archiveMode);
      })();
    }
    autosaveModel(params, modelData) {
      var _this9 = this;
      return (0, default)(function* () {
        return _this9.db.autosaveModel(params.model_id, modelData);
      })();
    }
    // get the chat messages from the database
    getChatMessages(model_id, action) {
      var _this10 = this;
      return (0, default)(function* () {
        return _this10.db.getChatMessages(model_id, action);
      })();
    }
    // push the chat messages to the database
    pushChatMessage(message) {
      var _this11 = this;
      return (0, default)(function* () {
        return _this11.db.pushChatMessage(message);
      })();
    }
    removeChatMessage(msg_id, model_id) {
      var _this12 = this;
      return (0, default)(function* () {
        return _this12.db.removeChatMessage(msg_id, model_id);
      })();
    }
    getFolders(id, sysExamples = false, globalTemplates = false) {
      return this.db.getFolders(id, sysExamples, globalTemplates);
    }
    getAllFolders(globalTemplates = false) {
      var _this13 = this;
      return (0, default)(function* () {
        return _this13.db.getAllFolders(globalTemplates);
      })();
    }
    getAllModelsUserCanLoad(globalTemplates = false) {
      var _this14 = this;
      return (0, default)(function* () {
        return _this14.db.getAllModelsUserCanLoad(globalTemplates);
      })();
    }
    getModels(id, archiveMode, sysExamples = false, globalTemplates = false) {
      return this.db.getModels(id, archiveMode, sysExamples, globalTemplates);
    }
    getLastModels() {
      return this.db.getLastModels().then(models => models.reverse());
    }
    removeFromLastModels(modelId) {
      return this.db.removeFromLastModels(modelId);
    }
    isSysAdmin() {
      return this.user?.userData?.SysAdmin;
    }
    isOrgAdmin() {
      return this.user?.userData?.OrgAdmin;
    }
    deleteModel(name, path, fileType) {
      return (0, default)(function* () {})();
    } // let promise;
    // if (fileType === 'folder')
    //   promise = this.db.deleteFolder(this.user.userData.organization, path, name);
    // else if (fileType === 'model')
    //   promise = this.db.deleteModel(this.user.userData.organization, path, name);
    // return promise;
    createFolder(father_id, name, sysExample, orgExample, globalTemplate, orgTemplate) {
      var _this15 = this;
      return (0, default)(function* () {
        return _this15.db.createFolder(father_id, name, sysExample, orgExample, globalTemplate, orgTemplate);
      })();
    }
    removeModel(model_id, sysExamples, globalTemplates) {
      var _this16 = this;
      return (0, default)(function* () {
        return _this16.db.removeModel(model_id, sysExamples, globalTemplates);
      })();
    }
    removeFolder(fid, sysExamples, globalTemplates) {
      var _this17 = this;
      return (0, default)(function* () {
        return _this17.db.removeFolder(fid, sysExamples, globalTemplates);
      })();
    }
    renameModel(id, title, sysExamples, globalTemplates) {
      var _this18 = this;
      return (0, default)(function* () {
        return _this18.db.renameModel(id, title, sysExamples, globalTemplates);
      })();
    }
    renameFolder(id, title, sysExample, globalTemplates) {
      var _this19 = this;
      return (0, default)(function* () {
        return _this19.db.renameFolder(id, title, sysExample, globalTemplates);
      })();
    }
    getAutosaveTime() {
      return this.autoSaveInterval; // time in minutes
    }
    updatePermissions(model_id, permissions) {
      var _this20 = this;
      return (0, default)(function* () {
        return _this20.db.updatePermissions(model_id, permissions);
      })();
    }
    getFolderPermissions(folderId) {
      var _this21 = this;
      return (0, default)(function* () {
        return _this21.db.getFolderPermissions(folderId);
      })();
    }
    updateFolderPermissions(folderId, permissions) {
      var _this22 = this;
      return (0, default)(function* () {
        return _this22.db.updateFolderPermissions(folderId, permissions);
      })();
    }
    getPermissions(model_id) {
      var _this23 = this;
      return (0, default)(function* () {
        return _this23.db.getPermissions(model_id);
      })();
    }
    getAllStereotypes() {
      return this.db.getAllStereotypes();
    }
    getFavoriteStereotypes() {
      return this.db.getFavoriteStereotypes();
    }
    getFavoriteExamples() {
      return this.db.getFavoriteExamples();
    }
    getFavoriteTemplates() {
      return this.db.getFavoriteTemplates();
    }
    setFavoriteExample(modelData, exampleType) {
      return this.db.setFavoriteExample(modelData, exampleType);
    }
    setFavoriteTemplate(modelData, type) {
      return this.db.setFavoriteTemplate(modelData, type);
    }
    unsetFavoriteExample(modelData) {
      return this.db.unsetFavoriteExample(modelData);
    }
    unsetFavoriteTemplate(modelData) {
      return this.db.unsetFavoriteTemplate(modelData);
    }
    saveModelAsSystemExample(model_id, model) {
      return this.db.saveModelAsSystemExample(model_id, model);
    }
    setFavoriteStereotype(id) {
      return this.db.setFavoriteStereotype(id);
    }
    unsetFavoriteStereotype(id) {
      return this.db.unsetFavoriteStereotype(id);
    }
    saveImageToPool(poolType, url, imageTags) {
      return this.db.saveImageToPool(poolType, url, imageTags);
    }
    updatePoolImageTags(id, imageTags, poolType) {
      return this.db.updatePoolImageTags(id, imageTags, poolType);
    }
    deletePoolImage(id, poolType) {
      return this.db.deletePoolImage(id, poolType);
    }
    getStereotype(stereotype_id) {
      var _this24 = this;
      return (0, default)(function* () {
        return _this24.db.getStereotype(stereotype_id).then(s => {
          s.id = stereotype_id;
          s.permission = CurrentModelPermission.READ;
          if (s.type == StereotypeType.System && _this24.userService.isSysAdmin()) {
            s.permission = CurrentModelPermission.WRITE;
          } else if (s.type == StereotypeType.Organization && (_this24.userService.isSysAdmin() || _this24.userService.isOrgAdmin())) {
            s.permission = CurrentModelPermission.WRITE;
          }
          return s;
          // const context = new StereotypeContext({ id: s.id, name: s.name, description: s.description, type: s.type, hasWritePermissions });
          // this.modelService.set(s, context);
          // }).then(res => validationAlert(`Successfully loaded stereotype [${stereotype.name}].`, 2500, 'Success'))
          // .catch(err => validationAlert(`Failed to load stereotype [${stereotype.name}].`, 2500, 'Error'));
        });
      })();
    }
    saveStereotype(stereotype) {
      var _this25 = this;
      return (0, default)(function* () {
        return _this25.db.saveStereotype(stereotype);
      })();
    }
    deleteStereotype(stereotype_id) {
      var _this26 = this;
      return (0, default)(function* () {
        return _this26.db.deleteStereotype(stereotype_id);
      })();
    }
    setStereotype(stereotype) {
      var _this27 = this;
      return (0, default)(function* () {
        return _this27.db.getStereotype(stereotype.id).then(s => {
          s.id = stereotype.id;
          return s;
        });
      })();
    }
    updateUserLastTabsToDB(relevantTabs) {
      return this.db.updateUserLastTabsToDB(relevantTabs).then(() => {}).catch(err => {});
    }
    getUserLastTabsFromDB() {
      return this.db.getUserLastTabsFromDB();
    }
    downloadModel(modelId, isSysExample = false, isGlobalTemplate = false) {
      var _this28 = this;
      return (0, default)(function* () {
        return _this28.db.downloadModel(modelId, isSysExample, isGlobalTemplate);
      })();
    }
    moveFolder(sourceId, targetId, sysExamples, isGlobalTemplate) {
      return this.db.moveFolder(sourceId, targetId, sysExamples, isGlobalTemplate);
    }
    getModelLastEditDate(modelId) {
      return this.db.getModelLastEditDate(modelId);
    }
    getModelsLastEditDates(modelIds) {
      return this.db.getModelsLastEditDates(modelIds);
    }
    moveModel(modelId, dir_id, sysExamples, isGlobalTemplate) {
      return this.db.moveModel(modelId, dir_id, sysExamples, isGlobalTemplate);
    }
    getOrganizationAnalytics(org) {
      return this.db.getOrganizationAnalytics(org);
    }
    getModelingAnalyticsRawData(org) {
      return this.db.getModelingAnalyticsRawData(org);
    }
    static #_ = (() => this.ɵfac = function StorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || StorageService)(core /* ɵɵinject */.KVO(DatabaseService), core /* ɵɵinject */.KVO(UserService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: StorageService,
      factory: StorageService.ɵfac
    }))();
  }
  return StorageService;
})();