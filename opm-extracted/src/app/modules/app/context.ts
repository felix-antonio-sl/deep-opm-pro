// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/context.ts
// Extracted by opm-extracted/tools/extract.mjs

let EmptyContext = /*#__PURE__*/(() => {
  class EmptyContext {
    static #_ = (() => this.default_name = "Model (Not Saved)")();
    getWholeTextName() {
      return EmptyContext.default_name;
    }
    isGlobalTemplate() {
      return false;
    }
    isAutoSave() {
      return false;
    }
    isExample() {
      return false;
    }
    isTemplate() {
      return false;
    }
    isStereotype() {
      return false;
    }
    autoSaveManually() {}
    isOrgExample() {
      return false;
    }
    isOrgTemplate() {
      return false;
    }
    isEmpty() {
      return true;
    }
    isDSMContext() {
      return false;
    }
    isDCMContext() {
      return false;
    }
    getPath() {
      return undefined;
    }
    isReadonly() {
      return false;
    }
    supportModelPermissions() {
      return false;
    }
    save(context, modelStorage, image) {
      modelStorage.openSaveModelDialog();
    }
    makeUrl() {
      return {
        allowed: false
      };
    }
    autosave(context) {}
    terminate() {}
    updateLocalPermissionsAfterChange(data, gotToken) {}
  }
  return EmptyContext;
})();
class DSMContext extends EmptyContext {
  constructor(modelName) {
    super();
    this.name = modelName;
  }
  getWholeTextName() {
    return this.name;
  }
  isDSMContext() {
    return true;
  }
  save(context, modelStorage, image) {
    (0, validationAlert)("This is only an analysis view of an existing model. Saving is not available.");
  }
}
class DCMContext extends EmptyContext {
  constructor(modelName) {
    super();
    this.name = modelName;
  }
  getWholeTextName() {
    return this.name;
  }
  isDSMContext() {
    return false; // DCM context is not a DSM context
  }
  isDCMContext() {
    return true;
  }
  save(context, modelStorage, image) {
    (0, validationAlert)("This is only an analysis view of an existing model. Saving is not available.");
  }
}
class ModelContext {
  constructor(properties, context) {
    this.properties = properties;
    this.context = context;
    this.startSubModelsCheck();
    if (this.isALlowedToSave()) {
      this.startInterval();
    }
  }
  getCurrentModelId() {
    return this.properties.id;
  }
  isExample() {
    return this.properties.isOrgExamples || this.properties.isSysExample;
  }
  isTemplate() {
    return this.properties.isOrgTemplate || this.properties.isGlobalTemplate;
  }
  isStereotype() {
    return false;
  }
  isSysExample() {
    return !!this.properties.isSysExample;
  }
  isAutoSave() {
    return this.properties.isAutosave;
  }
  isGlobalTemplate() {
    return !!this.properties.isGlobalTemplate;
  }
  isOrgExample() {
    return !!this.properties.isOrgExamples;
  }
  isOrgTemplate() {
    return !!this.properties.isOrgTemplate;
  }
  getWholeTextName() {
    let name = this.properties.name;
    if (this.isReadonly()) {
      name += " (read only)";
    } else if (this.properties.isAutosave) {
      name += " (Autosave)";
    } else if (this.properties.isVersion) {
      name += " (Version)";
    }
    if (this.isExample()) {
      name = "<<OPM Example Model>> " + name;
    } else if (this.isTemplate()) {
      name = "<<Template>> " + name;
    }
    return name;
  }
  getPath() {
    return this.properties.path;
  }
  autoSaveManually() {
    return this.context.saveModel({
      model_id: this.properties.id,
      path: this.properties.path,
      sysExample: this.isSysExample(),
      globalTemplate: this.isGlobalTemplate()
    }, "autosave");
  }
  startSubModelsCheck() {
    const check = () => {
      if (this.context.getCurrentContext() === this) {
        this.context.getSubModelsEditDates().then(ret => {
          this.subModelsEditDates = ret;
        });
      }
    };
    // Perform the first check after a 1-second delay
    OPCloudUtils.waitXms(1000).then(() => {
      check();
    });
    // Set up a recurring check every 20 seconds using RxJS's interval
    this.subModelsSubscription = (0, interval)(20000).subscribe(() => {
      check();
    });
  }
  startInterval() {
    // Prevent starting multiple intervals
    if (this.subscription && !this.subscription.closed) {
      return;
    }
    // Get the autosave interval in minutes
    const minutes = this.context.getAutosaveInterval();
    // Start the interval using RxJS's interval operator
    this.subscription = (0, interval)(minutes * 60000).subscribe(() => {
      this.context.saveModel({
        model_id: this.properties.id,
        path: this.properties.path,
        sysExample: this.isSysExample(),
        globalTemplate: this.isGlobalTemplate()
      }, "autosave").then(() => {
        // Show a success message if the model is not a template or example
        if (!this.context.isTemplate() && !this.context.isExample()) {
          (0, validationAlert)(`Successfully autosaved model [${this.properties.name}] as a version.`, 2500);
        }
      }).catch(err => {
        // Handle potential errors
        console.error("Autosave failed:", err);
      });
    });
  }
  stopInterval() {
    if (this.subscription && this.subscription.closed === false) {
      this.subscription.unsubscribe();
    }
  }
  terminate() {
    this.stopInterval();
    this.subModelsSubscription.unsubscribe();
  }
  isEmpty() {
    return false;
  }
  isDSMContext() {
    return false;
  }
  isReadonly() {
    return this.properties.permission === CurrentModelPermission.READ;
  }
  supportModelPermissions() {
    return true;
  }
  updateLocalPermissionsAfterChange(data, gotToken) {
    this.properties.permission = gotToken ? CurrentModelPermission.WRITE : CurrentModelPermission.READ;
  }
  isALlowedToSave() {
    return this.isReadonly() == false && this.properties.isAutosave == false && this.properties.isVersion == false || this.isGlobalTemplate() && this.context.isUserSysAdmin() || this.isSysExample() && this.context.isUserSysAdmin();
  }
  save(context, modelStorage, image) {
    if (this.isALlowedToSave()) {
      context.isCurrentlySavingModel = true;
      (0, validationAlert)(`Saving...`, 3000);
      context.saveModel({
        model_id: this.properties.id,
        path: this.properties.path,
        image: this.isTemplate() ? image : null,
        sysExample: this.isSysExample(),
        globalTemplate: this.isGlobalTemplate()
      }, "override").then(() => {
        context.isCurrentlySavingModel = false;
        (0, validationAlert)(`Successfully saved model [${this.properties.name}].`, 2500);
      }).catch(err => {
        context.isCurrentlySavingModel = false;
        if (err.status === 0) {
          (0, validationAlert)(`It seems you have an Internet connection problem. Could not save.`, 5000, "Error");
          return;
        }
        modelStorage.openSaveModelDialog();
        (0, validationAlert)(`It seems you no longer have write permission to the containing folder. Ask an owner to grant access or save at different location.`, 5000, "Error");
      });
    } else {
      modelStorage.openSaveModelDialog();
    }
  }
  makeUrl() {
    if (this.properties.id) {
      const url = window.location.origin + "/load/" + this.properties.id;
      return {
        allowed: true,
        url: url
      };
    }
    return {
      allowed: false
    };
  }
}
class StereotypeContext {
  constructor(properties) {
    this.properties = properties;
  }
  isExample() {
    return false;
  }
  isGlobalTemplate() {
    return false;
  }
  isOrgExample() {
    return false;
  }
  isAutoSave() {
    return false;
  }
  autoSaveManually() {}
  isTemplate() {
    return false;
  }
  isStereotype() {
    return true;
  }
  isOrgTemplate() {
    return false;
  }
  getWholeTextName() {
    return "<<Stereotype>> " + this.properties.name;
  }
  getPath() {
    return undefined;
  }
  isEmpty() {
    return false;
  }
  isDSMContext() {
    return false;
  }
  isReadonly() {
    return this.properties.permission == CurrentModelPermission.READ;
  }
  supportModelPermissions() {
    return false;
  }
  save(context, modelStorage, image) {
    if (!this.isValidStereotype(modelStorage)) {
      return;
    }
    if (this.isReadonly()) {
      modelStorage.openSaveStereotypeDialog();
    } else {
      context.saveStereotype({
        ...this.properties
      }, true).then(res => (0, validationAlert)(`Successfully saved stereotype [${this.properties.name}].`, 2500, "Success"));
    }
  }
  isValidStereotype(modelStorage) {
    if (modelStorage.getOpmModel().opds.filter(o => !o.isHidden).length > 1) {
      (0, validationAlert)("Currently, OPCloud supports only stereotypes with one level diagram.", 5000, "Error");
      return false;
    }
    return true;
  }
  makeUrl() {
    return {
      allowed: false
    };
  }
  autosave(context) {}
  terminate() {}
  updateLocalPermissionsAfterChange(data) {}
}
class EdxModelContext {
  constructor(properties) {
    this.properties = properties;
  }
  getTitle() {
    return this.properties.name;
  }
}
