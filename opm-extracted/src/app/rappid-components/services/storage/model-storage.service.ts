// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/storage/model-storage.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ModelStorageService = /*#__PURE__*/(() => {
  class ModelStorageService {
    constructor(context, modelService, dialog) {
      this.context = context;
      this.modelService = modelService;
      this.dialog = dialog;
    }
    openLoadModelDialog() {
      this.openModelDialog(StorageMode.LOAD);
    }
    openUrlDialog() {
      (0, createUrlPopup)(this.context.makeUrl());
    }
    save(image) {
      this.context.save(this, image);
    }
    getOpmModel() {
      return this.modelService.model;
    }
    openSaveModelDialog() {
      this.openModelDialog(StorageMode.SAVE);
    }
    getCurrentDir(path) {
      if (path[path.length - 1] === "/") {
        path = path.substring(0, path.length - 1);
      }
      const lastdir = path.split("/").pop();
      return lastdir;
    }
    newModel() {
      this.context.newModel();
    }
    openLoadModelComparisonDialog() {
      this.dialog.open(LoadModelDialogComponent, {
        height: "855px",
        width: "873px",
        data: {
          path: "",
          mode: StorageMode.LOAD,
          comparison: true
        }
      });
    }
    openLoadStereotypeDialog() {
      this.openStereotypeDialog(StereotypeStorageMode.LOAD);
    }
    openSaveStereotypeDialog() {
      this.openStereotypeDialog(StereotypeStorageMode.SAVE);
    }
    openSetStereotypeDialog() {
      this.openStereotypeDialog(StereotypeStorageMode.SET);
    }
    openStereotypeDialog(mode) {
      this.dialog.open(StereotypesDialogComponent, {
        height: "680px",
        width: "860px",
        data: {
          mode: mode
        }
      });
    }
    openModelDialog(mode, type, exampleType, templateType) {
      this.dialog.open(LoadModelDialogComponent, {
        // minHeight: '680px',
        // minWidth: '860px',
        height: Math.round(window.innerHeight * 0.9) + "px",
        width: Math.round(window.innerWidth * 0.75) + "px",
        data: {
          path: this.modelService.modelObject.path || "",
          showVersions: false,
          mode: mode,
          name: this.modelService.modelObject.name || "",
          description: "",
          showArchivedModels: false,
          archiveMode: this.modelService.modelObject.archiveMode || false,
          screenType: type,
          exampleType: exampleType,
          templateType: templateType
        }
      });
    }
    downloadModel() {
      this.context.downloadModel();
    }
    loadModelFromFile(json) {
      this.context.loadModelFromFile(json);
    }
    renameModel(id, name, sysExamples, globalTemplates) {
      return this.context.renameModel(id, name, sysExamples, globalTemplates);
    }
    static #_ = (() => this.ɵfac = function ModelStorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ModelStorageService)(core /* ɵɵinject */.KVO(ContextService), core /* ɵɵinject */.KVO(ModelService), core /* ɵɵinject */.KVO(MatDialog));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ModelStorageService,
      factory: ModelStorageService.ɵfac
    }))();
  }
  return ModelStorageService;
})();
