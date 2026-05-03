// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/init/opc.init.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpcVersionService = /*#__PURE__*/(() => {
  class OpcVersionService extends AbstractVersionService {
    constructor(model, userService) {
      super();
      this.model = model;
      this.userService = userService;
    }
    save(image) {
      if (this.userService.user.userData.isViewerAccount) {
        (0, validationAlert)("This operation is not available for viewer accounts. Please contact your organization's admin to make changes. Thank you!", 5000, "ERROR");
        return;
      }
      this.model.save(image);
    }
    areTemplatesSupported() {
      return true;
    }
    areSubModelsSupported() {
      return true;
    }
    isBackendSupported() {
      return true;
    }
    renameModel(id, name, sysExamples = false, globalTemplates = false) {
      return this.model.renameModel(id, name, sysExamples, globalTemplates);
    }
    updateDB(details) {
      this.userService.updateUserOplSetting(details);
    }
    static #_ = (() => this.ɵfac = function OpcVersionService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpcVersionService)(core /* ɵɵinject */.KVO(ModelStorageService), core /* ɵɵinject */.KVO(UserService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: OpcVersionService,
      factory: OpcVersionService.ɵfac
    }))();
  }
  return OpcVersionService;
})();