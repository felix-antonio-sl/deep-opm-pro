// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/context.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ContextService = /*#__PURE__*/(() => {
  class ContextService {
    getAutosaveInterval() {
      return this.storage.getAutosaveTime();
    }
    constructor(model, storage, oplService, compressionService) {
      this.model = model;
      this.storage = storage;
      this.oplService = oplService;
      this.compressionService = compressionService;
      this.contextTabs = [];
      this.context = new EmptyContext();
      this.userModelsAlreadyLoaded = false;
      this.addContextForTabs(this.context, this.model.model.toJson(), [], [], null);
      this.storage.getUserObservable().subscribe(user => {
        if (user) {
          this.restoreLastTabs();
          this.startSyncCheck();
        }
      });
    }
    getCurrentModelId() {
      return this.context.properties.id;
    }
    getModelService() {
      return this.model;
    }
    renameModel(id, name, sysExamples = false, globalTemplates = false) {
      return this.storage.renameModel(id, name, sysExamples, globalTemplates).then(() => {});
    }
    isExample() {
      return this.context.isExample();
    }
    isTemplate() {
      return this.context.isTemplate();
    }
    isStereotype() {
      return this.context.isStereotype();
    }
    isModelOrgExample() {
      return this.context.isOrgExample();
    }
    isOrgTemplate() {
      return this.context.isOrgTemplate();
    }
    isGlobalTemplate() {
      return this.context.isGlobalTemplate();
    }
    isUserSysAdmin() {
      return this.storage.isSysAdmin();
    }
    isUserOrgAdmin() {
      return this.storage.isOrgAdmin();
    }
    getPath() {
      return this.context.getPath();
    }
    replaceContext(new_context) {
      this.context.terminate();
      this.context = new_context;
      if (new_context instanceof ModelContext) {
        new_context.startSubModelsCheck();
        if (new_context.isALlowedToSave()) {
          new_context.startInterval();
        }
      }
    }
    getSubModelsEditDates() {
      const subModelsOpdsIds = this.model.model.opds.filter(opd => opd.sharedOpdWithSubModelId).map(opd => opd.sharedOpdWithSubModelId);
      const ret = {};
      return Promise.all(subModelsOpdsIds.map(id => this.storage.getModelLastEditDate(id).then(date => ret[id] = date).catch(err => null))).then(() => ret);
    }
    replaceContextByTab(item) {
      this.replaceContext(item.context);
      this.oplService.options.showDraggableThings = item.modelData.logicalElements.length < 8000;
      const opdId = item.modelData?.currentOpd?.id || "SD";
      this.model.set(item.modelData, item.context.getWholeTextName(), item.modelData.id || item.context?.properties?.id, {
        path: item.modelData.path,
        opd_id: opdId
      });
    }
    empty() {
      this.context = new EmptyContext();
      this.model.setName(this.context.getWholeTextName());
    }
    save(modelService, image) {
      if (this.isCurrentlySavingModel) {
        (0, validationAlert)("Cannot save while there is already a saving process running.", 5000, "REDWARNING");
        return;
      }
      this.context.save(this, modelService, image);
      modelService.getOpmModel().hasUnsavedWork = false;
    }
    updateLocalPermissionsAfterChange(data, gotToken) {
      const wasReadOnly = this.context.isReadonly();
      this.context.updateLocalPermissionsAfterChange(data, gotToken);
      const isNowReadOnly = this.context.isReadonly();
      // If permission changed from read-only to write, update sync status
      if (wasReadOnly && !isNowReadOnly) {
        const currentTab = this.getCurrentTabItem();
        if (currentTab) {
          currentTab.syncStatus = undefined;
          currentTab.lastEditDate = undefined;
        }
      }
      // If permission changed from write to read-only, initialize sync status
      if (!wasReadOnly && isNowReadOnly) {
        const currentTab = this.getCurrentTabItem();
        if (currentTab && currentTab.context instanceof ModelContext) {
          const modelId = currentTab.context.properties.id;
          this.storage.getModelLastEditDate(modelId).then(date => {
            if (currentTab) {
              currentTab.lastEditDate = date || null;
              const syncMode = this.getSyncMode();
              currentTab.syncStatus = syncMode === "Automatic" ? "automatic" : date ? "up-to-date" : "no-date";
            }
          }).catch(() => {
            if (currentTab) {
              currentTab.syncStatus = "no-date";
            }
          });
        }
      }
    }
    makeUrl() {
      const arg = this.context.makeUrl();
      if (arg.allowed) {
        arg.url += "|||" + this.model.model.currentOpd.id;
      }
      return arg;
    }
    isLoaded() {
      return !this.context.isEmpty();
    }
    getCurrentOpdName() {
      return this.model.getCurrentOpdName();
    }
    doesSupportModelPermissions() {
      return this.context.supportModelPermissions();
    }
    getDisplayName() {
      return this.context.getWholeTextName();
    }
    isReadonly() {
      return this.context.isReadonly();
    }
    loadModelByPath(title, path, opd) {
      var _this = this;
      return (0, default)(function* () {
        return _this.storage.getModelByPath(title, path).then(model => {
          const c = new ModelContext({
            id: model.id,
            name: model.name,
            path: [],
            description: model.description,
            archiveMode: model.archiveMode.archiveMode,
            permission: model.permission,
            isVersion: model.isVersion,
            isAutosave: model.isAutosave
          }, _this);
          const lastEditDate = model.editBy?.date || model.archiveMode?.date || null;
          _this.addContextForTabs(c, model, [], [], lastEditDate ? String(lastEditDate) : null);
          _this.replaceContext(c);
          _this.removeTab(0);
          _this.model.set(model, c.getWholeTextName(), model.id, {
            path: model.path,
            opd: opd
          });
        });
      })();
    }
    loadDSMFlatteningModel(alternateModel) {
      const dsmItem = {
        context: new DSMContext(alternateModel.name),
        modelData: alternateModel.toJson()
      };
      this.addContextForTabs(dsmItem.context, dsmItem.modelData, [], [], null);
      const currentTab = this.getCurrentTabItem();
      this.updateTabData(currentTab);
      this.replaceContext(dsmItem.context);
      this.model.set(dsmItem.modelData, dsmItem.context.getWholeTextName(), "noId", {
        alternativeOpmModel: alternateModel,
        opd_id: alternateModel.currentOpd.id
      });
    }
    loadDCMColoredModel(alternateModel) {
      const dcmItem = {
        context: new DCMContext(alternateModel.name),
        modelData: alternateModel.toJson()
      };
      this.addContextForTabs(dcmItem.context, dcmItem.modelData, [], [], null);
      const currentTab = this.getCurrentTabItem();
      this.updateTabData(currentTab);
      this.replaceContext(dcmItem.context);
      // Set DCM view flag (similar to DSM)
      const initRappidService = (0, getInitRappidShared)();
      if (initRappidService) {
        initRappidService.isDCMView = true;
      }
      this.model.set(dcmItem.modelData, dcmItem.context.getWholeTextName(), "noId", {
        alternativeOpmModel: alternateModel,
        opd_id: alternateModel.currentOpd.id
      });
    }
    getTemplateForImport(model_id, isGlobalTemplates) {
      var _this2 = this;
      return (0, default)(function* () {
        if (isGlobalTemplates) {
          return yield _this2.storage.getModel(model_id, "MAIN", false, true);
        }
        return _this2.storage.getModel(model_id, "MAIN", false, false);
      })();
    }
    loadModel(model_id, path, mode, opd_id, isSysExamples, isOrgExamples, isGlobalTemplates, isOrgTemplates) {
      var _this3 = this;
      return (0, default)(function* () {
        const tryToLoad = (model, sysEx = false, globTemp = false) => {
          // Decompress model if needed (handles both old and new formats)
          const decompressedModel = _this3.compressionService.decompressModelIfNeeded(model);
          const c = new ModelContext({
            id: decompressedModel.id,
            name: decompressedModel.name,
            path: path || decompressedModel.dirsPath,
            description: decompressedModel.description,
            archiveMode: decompressedModel.archiveMode.archiveMode,
            permission: decompressedModel.permission,
            isVersion: decompressedModel.isVersion,
            isAutosave: decompressedModel.isAutosave,
            isSysExample: sysEx,
            isOrgExamples: isOrgExamples || !!decompressedModel.dirsPath?.find(d => d.id === "ORGEXAMPLES"),
            isGlobalTemplate: globTemp,
            isOrgTemplate: isOrgTemplates || !!decompressedModel.dirsPath?.find(d => d.id === "ORGTEMPLATES" || d.id === "PRIVATETEMPLATES")
          }, _this3);
          const lastEditDate = decompressedModel.editBy?.date || decompressedModel.archiveMode?.date || null;
          _this3.addContextForTabs(c, decompressedModel, [], [], lastEditDate ? String(lastEditDate) : null);
          const currentTab = _this3.getCurrentTabItem();
          _this3.updateTabData(currentTab);
          _this3.replaceContext(c);
          if (decompressedModel.dirsPath && !c.isExample() && !c.isTemplate()) {
            localStorage.setItem("dirsPath", JSON.stringify(decompressedModel.dirsPath));
          }
          _this3.oplService.options.showDraggableThings = decompressedModel.logicalElements.length < 8000;
          _this3.model.set(decompressedModel, c.getWholeTextName(), decompressedModel.id, {
            path: decompressedModel.path,
            opd_id: opd_id
          });
          _this3.closeEmptyTabs();
        };
        let regularModel = {};
        let sysExampleModel = {};
        let globalTemplateModel = {};
        if (isSysExamples) {
          sysExampleModel = yield _this3.storage.getModel(model_id, mode, true, false).catch(err => err);
        } else if (isGlobalTemplates) {
          globalTemplateModel = yield _this3.storage.getModel(model_id, mode, false, true).catch(err => err);
        } else {
          regularModel = yield _this3.storage.getModel(model_id, mode, false, false).catch(/*#__PURE__*/function () {
            var _ref = (0, default)(function* (err) {
              // support for model url links. by the link we can't know if it is regular or example or template. we should try them all.
              sysExampleModel = yield _this3.storage.getModel(model_id, mode, true, false).catch(err => err);
              globalTemplateModel = yield _this3.storage.getModel(model_id, mode, false, true).catch(err => err);
              console.clear();
              return err;
            });
            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
        }
        const modelsArr = [regularModel, sysExampleModel, globalTemplateModel];
        const model = modelsArr.find(m => m.id);
        if (model) {
          yield _this3.oplService.areSettingsAlreadyLoaded();
          return tryToLoad(model, sysExampleModel.hasOwnProperty("id"), globalTemplateModel.hasOwnProperty("id"));
        } else {
          _this3.oplService.options.isLoadingModel = false;
          const msg = modelsArr.find(err => err.status === 404) ? "Unable to load the model. It seems you do not have permission to view it." : "Unable to load the model. It seems the model does not exist.";
          (0, validationAlert)(msg, 6000, "Error");
          throw Error(modelsArr[0].message);
        }
        // return this.storage.getModel(model_id, mode, isSysExamples, isGlobalTemplates).then(model => tryToLoad(model, isSysExamples, isGlobalTemplates)).catch(err => {
        //   // if cant load - maybe it is a system example -> try as system example.
        //   console.clear();
        //   // TODO: check here
        //   return this.storage.getModel(model_id, mode, true).then(model => tryToLoad(model, true))
        //     .catch(err => this.storage.getModel(model_id, mode, false, true).then(model => tryToLoad(model, false, true)));
        // });
      })();
    }
    loadVersion(model_id, ver_index, path) {
      var _this4 = this;
      return (0, default)(function* () {
        return _this4.storage.getVersionModel(model_id, ver_index).then(model => {
          // Decompress model if needed (handles both old and new formats)
          const decompressedModel = _this4.compressionService.decompressModelIfNeeded(model);
          const c = new ModelContext({
            id: decompressedModel.id,
            name: decompressedModel.name,
            path: path,
            description: decompressedModel.description,
            archiveMode: decompressedModel.archiveMode.archiveMode,
            permission: decompressedModel.permission,
            isVersion: decompressedModel.isVersion,
            isAutosave: decompressedModel.isAutosave
          }, _this4);
          const lastEditDate = decompressedModel.editBy?.date || decompressedModel.archiveMode?.date || null;
          _this4.addContextForTabs(c, decompressedModel, [], [], lastEditDate ? String(lastEditDate) : null);
          const currentTab = _this4.getCurrentTabItem();
          _this4.updateTabData(currentTab);
          _this4.replaceContext(c);
          _this4.closeEmptyTabs();
          _this4.model.set(decompressedModel, c.getWholeTextName(), decompressedModel.id, {
            path: decompressedModel.path
          });
        });
      })();
    }
    saveModelAsSystemExample(prop, mode) {
      var _this5 = this;
      return (0, default)(function* () {
        if (mode == "create") {
          const model = {
            ..._this5.model.model.toJson(),
            title: prop.title,
            description: prop.description,
            archiveMode: {
              archiveMode: prop.archiveMode,
              date: "",
              name: ""
            }
          };
          // Compress model and remove metadata before saving as example
          const compressedModel = _this5.compressionService.prepareModelForSave(model);
          return _this5.storage.saveModelAsSystemExample(undefined, compressedModel).then(model => {}).catch(err => console.log(err));
        }
      })();
    }
    saveModel(prop, mode) {
      var _this6 = this;
      return (0, default)(function* () {
        const that = _this6;
        if (mode == "create") {
          const model = {
            ..._this6.model.model.toJson(false, true),
            title: prop.title,
            description: prop.description,
            sysExample: prop.sysExample,
            image: prop.image ? prop.image : null,
            globalTemplate: prop.globalTemplate,
            archiveMode: {
              archiveMode: prop.archiveMode,
              date: "",
              name: ""
            }
          };
          // Compress model and remove metadata before saving
          const compressedModel = _this6.compressionService.prepareModelForSave(model);
          return _this6.storage.createModel({
            at_directory: prop.directory_id
          }, compressedModel).then(model => {
            const orgExample = !prop.sysExample && !!prop.path?.find(d => d.id === "ORGEXAMPLES");
            const orgTemplate = !prop.globalTemplate && !!prop.path?.find(d => d.id === "ORGTEMPLATES" || d.id === "PRIVATETEMPLATES");
            const c = new ModelContext({
              id: model.created_id,
              name: prop.title,
              path: prop.path,
              description: prop.description,
              archiveMode: prop.archiveMode,
              permission: CurrentModelPermission.WRITE,
              isVersion: false,
              isAutosave: false,
              isGlobalTemplate: prop.globalTemplate,
              isOrgTemplate: orgTemplate,
              isOrgExamples: orgExample,
              isSysExample: prop.sysExample
            }, _this6);
            const currentTab = _this6.getCurrentTabItem();
            _this6.replaceContext(c);
            _this6.updateTabData(currentTab);
            // Update last edit date for new model
            const newTab = _this6.getTabs().find(t => t.context === c);
            if (newTab) {
              newTab.lastEditDate = new Date().toISOString();
            }
            _this6.model.setName(prop.title);
            _this6.model.setId(model.created_id);
            _this6.replaceContextByTab(_this6.getCurrentTabItem());
          });
        }
        if (mode == "override") {
          const model = {
            ..._this6.model.model.toJson(false, true),
            archiveMode: {
              archiveMode: prop.archiveMode,
              date: "",
              name: ""
            },
            description: prop.description || "",
            image: prop.image,
            sysExample: prop.sysExample,
            globalTemplate: prop.globalTemplate
          };
          // Compress model and remove metadata before saving
          const compressedModel = _this6.compressionService.prepareModelForSave(model);
          return _this6.storage.overrideModel({
            model_id: prop.model_id
          }, compressedModel).then(model => {
            const orgExample = !prop.sysExample && !!prop.path?.find(d => d.id === "ORGEXAMPLES");
            const orgTemplate = that.isOrgTemplate();
            const c = new ModelContext({
              id: prop.model_id,
              name: model.title,
              path: prop.path,
              description: model.description,
              archiveMode: prop.archiveMode,
              permission: CurrentModelPermission.WRITE,
              isGlobalTemplate: prop.globalTemplate,
              isOrgTemplate: orgTemplate,
              isVersion: false,
              isAutosave: false,
              isOrgExamples: orgExample,
              isSysExample: prop.sysExample
            }, _this6);
            const currentTab = _this6.getCurrentTabItem();
            _this6.replaceContext(c);
            _this6.updateTabData(currentTab);
            _this6.model.setName(model.title);
          });
        }
        if (mode == "autosave") {
          const model = {
            ..._this6.model.model.toJson(false, true),
            archiveMode: {
              archiveMode: prop.archiveMode,
              date: "",
              name: ""
            },
            sysExample: prop.sysExample,
            globalTemplate: prop.globalTemplate
          };
          // Compress model and remove metadata before autosaving
          const compressedModel = _this6.compressionService.prepareModelForSave(model);
          return _this6.storage.autosaveModel({
            model_id: prop.model_id
          }, compressedModel);
        }
      })();
    }
    // Change the archiveMode flag of the model (model_id) to the input value archiveMode
    archiveModel(model_id, archiveMode) {
      var _this7 = this;
      return (0, default)(function* () {
        return _this7.storage.archiveModel({
          model_id: model_id,
          archiveMode: archiveMode
        });
      })();
    }
    newModel() {
      const currentTab = this.getCurrentTabItem();
      this.updateTabData(currentTab);
      this.context.terminate();
      this.empty();
      this.model.newModel();
      this.addContextForTabs(this.context, this.model.model.toJson(), [], [], null);
      this.replaceContext(this.context);
      this.oplService.options.showDraggableThings = true;
    }
    loadStereotype(stereotype) {
      var _this8 = this;
      return (0, default)(function* () {
        return _this8.storage.getStereotype(stereotype.id).then(s => {
          const c = new StereotypeContext({
            id: s.id,
            name: s.name,
            description: s.description,
            type: s.type,
            permission: s.permission
          });
          _this8.addContextForTabs(c, s, [], [], null);
          _this8.replaceContext(c);
          _this8.model.set(s, c.getWholeTextName(), s.id);
        });
      })();
    }
    saveStereotype(stereotype, existingStereotype) {
      var _this9 = this;
      return (0, default)(function* () {
        const json = _this9.model.model.toJson(!existingStereotype);
        delete json.permissions;
        delete json.name;
        delete json.description;
        const write_stereotype = {
          ...json,
          name: stereotype.name,
          type: stereotype.type,
          id: stereotype.id
        };
        _this9.storage.saveStereotype(write_stereotype).then(s => {
          const currentTab = _this9.getCurrentTabItem();
          _this9.replaceContext(new StereotypeContext({
            id: stereotype.id,
            name: stereotype.name,
            description: stereotype.description,
            type: stereotype.type,
            permission: CurrentModelPermission.WRITE
          }));
          _this9.updateTabData(currentTab);
        });
      })();
    }
    addContextForTabs(c, modelData, undo, redo, lastEditDate) {
      if (!this.contextTabs.find(item => item.context === c)) {
        // If lastEditDate not provided, try to get it from modelData
        if (!lastEditDate && modelData) {
          const editDate = modelData.editBy?.date || modelData.archiveMode?.date || null;
          lastEditDate = editDate ? String(editDate) : null;
        } else if (lastEditDate) {
          // Normalize to string
          lastEditDate = String(lastEditDate);
        }
        const syncMode = this.getSyncMode();
        const syncStatus = c instanceof ModelContext && c.isReadonly() && !c.isExample() && !c.isTemplate() && syncMode !== "Disabled" ? syncMode === "Automatic" ? "automatic" : lastEditDate ? "up-to-date" : "no-date" : undefined;
        this.contextTabs.push({
          context: c,
          modelData: modelData,
          undo: undo,
          redo: redo,
          lastEditDate: lastEditDate,
          syncStatus: syncStatus
        });
        if (this.getTabs().filter(t => t?.context?.properties?.id).length > 0) {
          this.updateUserLastTabsToDB();
        }
      }
    }
    getTabs() {
      return this.contextTabs;
    }
    getCurrentContext() {
      return this.context;
    }
    closeTab(item) {
      const currentTab = this.getTabs().find(t => t.context === this.getCurrentContext());
      const tabContext = this.getTabs().find(it => it.context === item.context);
      if (tabContext) {
        const index = this.getTabs().indexOf(tabContext);
        let nextItem;
        if (index > 0) {
          nextItem = this.getTabs()[index - 1];
        }
        if (index === 0 && this.getTabs().length > 1) {
          nextItem = this.getTabs()[1];
        } else if (index === 0 && this.getTabs().length === 1) {
          nextItem = {
            context: new EmptyContext(),
            modelData: new OpmModel().toJson()
          };
          this.addContextForTabs(nextItem.context, nextItem.modelData, [], [], null);
        }
        this.removeTab(index);
        if (nextItem !== currentTab) {
          this.replaceContextByTab(nextItem);
        }
        this.updateUserLastTabsToDB();
      }
    }
    removeTab(index) {
      this.contextTabs.splice(index, 1);
    }
    moveTab(previousIndex, currentIndex) {
      (0, moveItemInArray)(this.contextTabs, previousIndex, currentIndex);
    }
    isModelAlreadyOpenOnTab(id) {
      return !!this.contextTabs.find(tab => tab.context.properties?.id === id);
    }
    getCurrentTabItem() {
      return this.getTabs().find(it => it.context === this.getCurrentContext());
    }
    updateTabData(tabItem, keepSubModels = true) {
      tabItem.context = this.getCurrentContext();
      tabItem.modelData = this.getModelService().model.toJson(false, !keepSubModels);
      tabItem.undo = this.getModelService().model.getUndoStack();
      tabItem.redo = this.getModelService().model.getRedoStack();
      tabItem.lastOperations = this.getModelService().model.lastOperations;
      // Update last edit date if it's a ModelContext
      if (tabItem.context instanceof ModelContext && !tabItem.context.isExample() && !tabItem.context.isTemplate()) {
        const modelId = tabItem.context.properties?.id;
        if (modelId && tabItem.modelData) {
          const editDate = tabItem.modelData.editBy?.date || tabItem.modelData.archiveMode?.date;
          tabItem.lastEditDate = editDate ? String(editDate) : tabItem.lastEditDate;
        }
      }
      if (!tabItem.context.isAutoSave() && !tabItem.context.isReadonly() && tabItem.undo?.length > 3) {
        tabItem.context.autoSaveManually();
      }
    }
    closeEmptyTabs() {
      const tabs = this.getTabs();
      if (tabs.length > 1 && tabs[0].modelData.logicalElements.length === 0) {
        this.closeTab(tabs[0]);
      }
    }
    updateUserLastTabsToDB() {
      if (this.isLoadingTabs) {
        return;
      }
      const relevantTabs = this.getTabs().filter(t => !(t.context instanceof EmptyContext) && t?.context?.properties?.id).map(tab => tab?.context?.properties?.id);
      this.storage.updateUserLastTabsToDB(relevantTabs).then(() => {});
    }
    isModelAlreadyOpen(modelId) {
      return !!this.getTabs().find(t => t.modelData?.id === modelId);
    }
    restoreLastTabs() {
      var _this10 = this;
      return (0, default)(function* () {
        if (window.location.href.includes("/load/")) {
          return;
        }
        if (_this10.getTabs().length === 1 && _this10.getTabs()[0].context instanceof EmptyContext) {
          _this10.storage.getUserLastTabsFromDB().then(/*#__PURE__*/function () {
            var _ref2 = (0, default)(function* (lastTabsIds) {
              if (_this10.userModelsAlreadyLoaded) {
                return;
              }
              if (lastTabsIds.length > 0 && (0, getInitRappidShared)()) {
                (0, getInitRappidShared)().isLoadingModel = true;
              }
              _this10.userModelsAlreadyLoaded = true;
              _this10.isLoadingTabs = true;
              for (const modelId of lastTabsIds) {
                if (_this10.isModelAlreadyOpen(modelId)) {
                  continue;
                }
                yield _this10.loadModel(modelId, undefined, "MAIN");
                (0, getInitRappidShared)().isLoadingModel = true;
                (0, getInitRappidShared)()?.elementToolbarReference.setIsExample(_this10.isExample());
                (0, getInitRappidShared)()?.elementToolbarReference.setIsTemplate(_this10.isTemplate());
                (0, getInitRappidShared)()?.elementToolbarReference.setIsStereotype(_this10.isStereotype());
              }
              if ((0, getInitRappidShared)()) {
                (0, getInitRappidShared)().isLoadingModel = false;
              }
              _this10.isLoadingTabs = false;
            });
            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }()).catch(err => {
            _this10.isLoadingTabs = false;
            if ((0, getInitRappidShared)()) {
              (0, getInitRappidShared)().isLoadingModel = false;
            }
          });
        }
      })();
    }
    downloadModel() {
      const that = this;
      this.storage.downloadModel(this.getCurrentModelId(), this.isExample() && !this.isModelOrgExample(), this.isTemplate() && !this.isOrgTemplate()).then(res => {
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(res)));
        element.setAttribute("download", that.getCurrentContext().properties.name + ".opcl");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }).catch(err => {
        (0, validationAlert)("You are not allowed to download models.", 3500, "error");
      });
    }
    loadSubModelFromDB(modelId) {
      return this.storage.getModel(modelId, "MAIN").then(model => {
        // Decompress model if needed
        return this.compressionService.decompressModelIfNeeded(model);
      });
    }
    loadModelFromFile(json) {
      // Decompress model if needed (file may be old format or new format)
      const decompressedModel = this.compressionService.decompressModelIfNeeded(json);
      const c = new ModelContext({
        id: undefined,
        name: decompressedModel.name || "Unsaved Model",
        path: [],
        description: decompressedModel.description || "",
        archiveMode: undefined,
        permission: undefined,
        isVersion: undefined,
        isAutosave: undefined
      }, this);
      const lastEditDate = decompressedModel.editBy?.date || decompressedModel.archiveMode?.date || null;
      this.addContextForTabs(c, decompressedModel, [], [], lastEditDate ? String(lastEditDate) : null);
      this.replaceContext(c);
      this.removeTab(0);
      this.model.set(decompressedModel, c.getWholeTextName(), undefined);
    }
    saveSubModel(jsonSubModel, title, fatherModelId) {
      var _this11 = this;
      return (0, default)(function* () {
        let path = _this11.context.getPath();
        if (path[0].id === "root") {
          path = path.reverse();
        }
        const dir_id = path[0].id;
        const params = {
          at_directory: dir_id
        };
        const toWrite = {
          ...jsonSubModel,
          title: title,
          description: "",
          sysExample: false,
          image: null,
          globalTemplate: false,
          fatherModelId: fatherModelId,
          archiveMode: {
            archiveMode: false,
            date: "",
            name: ""
          }
        };
        // Compress model and remove metadata before saving submodel
        const compressedModel = _this11.compressionService.prepareModelForSave(toWrite);
        return _this11.storage.createModel(params, compressedModel).then(ret => ret.created_id);
      })();
    }
    createNewModelFromWizard(params) {
      this.newModel();
      this.model.model.createModelFromWizardParams(params);
    }
    hasUnsavedModels() {
      return this.getTabs().some(t => t.modelData.hasUnsavedWork);
    }
    startSyncCheck() {
      // Stop existing subscription if any
      this.stopSyncCheck();
      const syncMode = this.getSyncMode();
      if (syncMode === "Disabled") {
        // Clear sync status from all tabs when disabled
        this.getTabs().forEach(tab => {
          if (tab.syncStatus) {
            tab.syncStatus = undefined;
          }
        });
        return;
      }
      // Check every 30 seconds
      this.syncCheckSubscription = (0, interval)(30000).subscribe(() => {
        this.checkModelsSyncStatus();
      });
    }
    stopSyncCheck() {
      if (this.syncCheckSubscription && !this.syncCheckSubscription.closed) {
        this.syncCheckSubscription.unsubscribe();
      }
    }
    checkModelsSyncStatus() {
      var _this12 = this;
      return (0, default)(function* () {
        const syncMode = _this12.getSyncMode();
        if (syncMode === "Disabled") {
          return;
        }
        const readOnlyTabs = _this12.getTabs().filter(tab => {
          const context = tab.context;
          if (!(context instanceof ModelContext)) {
            return false;
          }
          if (context.isReadonly() && !context.isExample() && !context.isTemplate()) {
            const modelId = context.properties?.id;
            // Skip if already marked as out-of-sync (for manual mode) or deleted or no-date
            if (syncMode === "Manual" && tab.syncStatus === "out-of-sync") {
              return false;
            }
            return modelId && tab.syncStatus !== "deleted" && tab.syncStatus !== "no-date";
          }
          return false;
        });
        if (readOnlyTabs.length === 0) {
          return;
        }
        const modelIds = readOnlyTabs.map(tab => tab.context.properties.id);
        try {
          const editDates = yield _this12.storage.getModelsLastEditDates(modelIds);
          readOnlyTabs.forEach(tab => {
            const modelId = tab.context.properties.id;
            const serverEditDate = editDates[modelId];
            if (!serverEditDate) {
              // Model might be deleted or no date available
              if (tab.lastEditDate) {
                tab.syncStatus = "deleted";
              } else {
                tab.syncStatus = "no-date";
              }
              return;
            }
            if (!tab.lastEditDate) {
              // First time checking - store the date as string
              tab.lastEditDate = serverEditDate ? String(serverEditDate) : null;
              tab.syncStatus = "up-to-date";
              return;
            }
            // Normalize dates to strings for comparison (like sub-model sync does)
            const serverDateStr = serverEditDate ? String(serverEditDate) : "";
            const storedDateStr = tab.lastEditDate ? String(tab.lastEditDate) : "";
            // Only mark as out-of-sync if the date actually changed (and both are non-empty)
            if (serverDateStr && storedDateStr && serverDateStr !== storedDateStr) {
              // Model has been updated
              tab.syncStatus = "out-of-sync";
              // Get sync mode
              const syncMode = _this12.getSyncMode();
              if (syncMode === "Automatic") {
                // Preserve the tab's current OPD if known
                const tabOpdId = tab.modelData?.currentOpd?.id || _this12.model.model.currentOpd?.id;
                // Auto-reload the model (does not switch tabs if not current)
                _this12.reloadModelFromServer(tab, tabOpdId);
              }
            } else {
              // Update stored date if it changed (e.g., was empty before)
              if (serverDateStr && serverDateStr !== storedDateStr) {
                tab.lastEditDate = serverDateStr;
              }
              tab.syncStatus = "up-to-date";
            }
          });
        } catch (err) {
          console.error("Error checking model sync status:", err);
        }
      })();
    }
    getSyncMode() {
      // Check if organization has locked the setting
      const orgLocked = this.oplService.orgOplSettings.modelReviewAutomaticSyncingLocked;
      if (orgLocked) {
        // Organization locked - use org setting
        const orgSetting = this.oplService.orgOplSettings.modelReviewAutomaticSyncing;
        return orgSetting || "Manual";
      }
      // Organization not locked - user can override
      const userSetting = this.oplService.settings.modelReviewAutomaticSyncing;
      if (userSetting) {
        return userSetting;
      }
      const orgSetting = this.oplService.orgOplSettings.modelReviewAutomaticSyncing;
      if (orgSetting) {
        return orgSetting;
      }
      return "Manual"; // Default
    }
    reloadModelFromServer(tab, preserveOpdId) {
      var _this13 = this;
      return (0, default)(function* () {
        if (_this13.getSyncMode() === "Disabled") {
          return;
        }
        const context = tab.context;
        if (!(context instanceof ModelContext)) {
          return;
        }
        const modelId = context.properties.id;
        const path = context.getPath();
        const isSysExample = context.isSysExample();
        const isGlobalTemplate = context.isGlobalTemplate();
        const isOrgExample = context.isOrgExample();
        const isOrgTemplate = context.isOrgTemplate();
        const isCurrentTab = _this13.getCurrentContext() === context;
        // Store current OPD ID if not provided
        if (!preserveOpdId) {
          preserveOpdId = _this13.model.model.currentOpd?.id;
        }
        try {
          if (isCurrentTab) {
            (0, validationAlert)("Model has been updated. Reloading...", 2000);
          }
          const initRappid = (0, getInitRappidShared)();
          if (initRappid) {
            initRappid.isLoadingModel = true;
          }
          // Load the updated model
          const updatedModel = yield _this13.storage.getModel(modelId, "MAIN", isSysExample, isGlobalTemplate);
          const decompressedModel = _this13.compressionService.decompressModelIfNeeded(updatedModel);
          // Get the new edit date from the server
          const newEditDate = decompressedModel.editBy?.date || decompressedModel.archiveMode?.date || null;
          const newEditDateStr = newEditDate ? String(newEditDate) : "";
          const currentEditDateStr = tab.lastEditDate ? String(tab.lastEditDate) : "";
          // Only reload if the date actually changed
          if (newEditDateStr && newEditDateStr !== currentEditDateStr) {
            // Update the existing tab instead of creating a new one
            tab.modelData = decompressedModel;
            tab.undo = [];
            tab.redo = [];
            tab.lastOperations = [];
            tab.lastEditDate = newEditDateStr;
            const syncMode = _this13.getSyncMode();
            tab.syncStatus = syncMode === "Automatic" ? "automatic" : tab.lastEditDate ? "up-to-date" : "no-date";
            // Update the context if it's the current one
            if (isCurrentTab) {
              _this13.oplService.options.showDraggableThings = decompressedModel.logicalElements.length < 8000;
              _this13.model.set(decompressedModel, context.getWholeTextName(), decompressedModel.id, {
                path: decompressedModel.path,
                opd_id: preserveOpdId || decompressedModel.currentOpd?.id || "SD"
              });
            }
          } else {
            // Date didn't actually change, just update the stored date
            tab.lastEditDate = newEditDateStr || null;
            tab.syncStatus = "up-to-date";
          }
          if (initRappid) {
            initRappid.isLoadingModel = false;
          }
          // Don't show success message for automatic sync
        } catch (err) {
          if (err.status === 404) {
            // Model deleted or no permission
            tab.syncStatus = "deleted";
            if (isCurrentTab) {
              (0, validationAlert)("Model is no longer available. Tab will be closed.", 5000, "Error");
            }
            setTimeout(() => {
              _this13.closeTab({
                context,
                modelData: tab.modelData
              });
            }, 5000);
          } else {
            console.error("Error reloading model:", err);
            if (isCurrentTab) {
              (0, validationAlert)("Failed to reload model", 3000, "Error");
            }
          }
          const initRappid = (0, getInitRappidShared)();
          if (initRappid) {
            initRappid.isLoadingModel = false;
          }
        }
      })();
    }
    manualSyncModel(tab) {
      var _this14 = this;
      return (0, default)(function* () {
        if (_this14.getSyncMode() === "Disabled") {
          return;
        }
        if (tab.syncStatus === "out-of-sync" || tab.syncStatus === "deleted") {
          const context = tab.context;
          const currentOpdId = _this14.model.model.currentOpd?.id;
          const isCurrentTab = _this14.getCurrentContext() === context;
          try {
            if (isCurrentTab) {
              (0, validationAlert)("Syncing model...", 2000);
            }
            const initRappid = (0, getInitRappidShared)();
            if (initRappid) {
              initRappid.isLoadingModel = true;
            }
            const modelId = context.properties.id;
            const isSysExample = context.isSysExample();
            const isGlobalTemplate = context.isGlobalTemplate();
            // Load the updated model
            const updatedModel = yield _this14.storage.getModel(modelId, "MAIN", isSysExample, isGlobalTemplate);
            const decompressedModel = _this14.compressionService.decompressModelIfNeeded(updatedModel);
            // Update the existing tab
            tab.modelData = decompressedModel;
            tab.undo = [];
            tab.redo = [];
            tab.lastOperations = [];
            const newEditDate = decompressedModel.editBy?.date || decompressedModel.archiveMode?.date || null;
            tab.lastEditDate = newEditDate ? String(newEditDate) : null;
            const syncMode = _this14.getSyncMode();
            tab.syncStatus = syncMode === "Automatic" ? "automatic" : tab.lastEditDate ? "up-to-date" : "no-date";
            // Update the context if it's the current one
            if (isCurrentTab) {
              _this14.oplService.options.showDraggableThings = decompressedModel.logicalElements.length < 8000;
              _this14.model.set(decompressedModel, context.getWholeTextName(), decompressedModel.id, {
                path: decompressedModel.path,
                opd_id: currentOpdId || decompressedModel.currentOpd?.id || "SD"
              });
            }
            if (initRappid) {
              initRappid.isLoadingModel = false;
            }
          } catch (err) {
            if (err.status === 404) {
              tab.syncStatus = "deleted";
              if (isCurrentTab) {
                (0, validationAlert)("Model is no longer available", 3000, "Error");
              }
            } else {
              console.error("Error syncing model:", err);
              if (isCurrentTab) {
                (0, validationAlert)("Failed to sync model", 3000, "Error");
              }
            }
            const initRappid = (0, getInitRappidShared)();
            if (initRappid) {
              initRappid.isLoadingModel = false;
            }
          }
        }
      })();
    }
    getModelSyncStatus(tab) {
      const context = tab.context;
      if (!(context instanceof ModelContext)) {
        return null;
      }
      if (!context.isReadonly() || context.isExample() || context.isTemplate()) {
        return null;
      }
      const syncMode = this.getSyncMode();
      if (syncMode === "Disabled") {
        return null;
      }
      if (syncMode === "Automatic") {
        return "automatic";
      }
      // For manual mode, return the current sync status or default to up-to-date
      // If syncStatus is undefined, initialize it based on lastEditDate
      if (!tab.syncStatus) {
        tab.syncStatus = tab.lastEditDate ? "up-to-date" : "no-date";
      }
      return tab.syncStatus;
    }
    static #_ = (() => this.ɵfac = function ContextService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ContextService)(core /* ɵɵinject */.KVO(ModelService), core /* ɵɵinject */.KVO(StorageService), core /* ɵɵinject */.KVO(OplService), core /* ɵɵinject */.KVO(ModelCompressionService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ContextService,
      factory: ContextService.ɵfac
    }))();
  }
  return ContextService;
})();