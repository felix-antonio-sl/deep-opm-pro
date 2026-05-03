// Source: decompiled/deobfuscated.js
// Original path: ./src/app/error-handler/error-handler.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ErrorHandlerService = /*#__PURE__*/(() => {
  class ErrorHandlerService {
    constructor(orgService, userService, modelService, init, oplService) {
      this.orgService = orgService;
      this.userService = userService;
      this.modelService = modelService;
      this.init = init;
      this.oplService = oplService;
      this.sendErrors = false;
      this.user$ = this.userService.user$;
      this.orgS = this.userService.userOrg;
      this.last5Errors = [];
    }
    organizationWantsLogs() {
      return this.oplService.orgOplSettings.logCollectingEnabled;
    }
    organizationLogsMandatory() {
      return this.oplService.orgOplSettings.ignoreUserLogSharingPermission;
    }
    userSendsLogs() {
      console.log(`userSendsLogs: ${this.userService.user.userData.opl.logSharingPermission}`);
      return this.userService.user.userData.opl.logSharingPermission;
    }
    shouldSendLog() {
      const shouldSendLog = this.organizationWantsLogs() && (this.organizationLogsMandatory() || this.userSendsLogs());
      // console.log(`should send log: ${shouldSendLog}`);
      const dev = window.origin !== "http://localhost:4200";
      return shouldSendLog && dev;
    }
    getLastSteps() {
      const undoStack = this.init.getOpmModel().undoRedo.getUndoStack();
      const last5 = undoStack.slice(Math.max(undoStack.length - 5, 0)).map(op => op ? op.reason : "");
      return JSON.stringify(last5);
    }
    logError(error) {
      console.error(error);
      if (this.shouldIgnore(error)) {
        return;
      }
      let jsonModel;
      if (this.init.getOpmModel().undoRedo.getLastUndoOpertaion()?.json) {
        jsonModel = JSON.stringify(this.init.getOpmModel().undoRedo.getLastUndoOpertaion().json);
      } else {
        try {
          jsonModel = JSON.stringify(this.init.getOpmModel().toJson());
        } catch (err) {
          jsonModel = "";
        }
      }
      const selectedElementName = this.init.selectedElement?.attributes?.attrs?.text?.textWrap?.text;
      if (selectedElementName) {
        error += "\n selected element: " + selectedElementName;
      }
      const currentOpdName = this.init.opmModel.currentOpd?.getName();
      if (currentOpdName) {
        error += "\n Current OPD: " + currentOpdName;
      }
      let lastOperations = [...(this.init.opmModel.lastOperations || [])];
      // last 50 operations.
      if (lastOperations.length > 50) {
        lastOperations = lastOperations.slice(lastOperations.length - 50);
      }
      if (lastOperations.length > 0) {
        error += "\n\n" + lastOperations.filter(str => typeof str === "string").join(" -> ");
      }
      const logInfo = {
        userId: this.userService?.user?.uid,
        userName: this.userService?.user?.userData?.Name,
        userOrganization: this.userService?.user?.userData?.organization,
        modelName: this.modelService?.displayName,
        modelId: this.modelService?.modelObject?.id,
        modelPath: this.modelService?.modelObject?.path,
        errorMessage: error,
        steps: this.getLastSteps(),
        timestamp: new Date().toLocaleString(),
        json: jsonModel
      };
      this.addLastErrorToLast5(error);
      if (this.shouldSendLog()) {
        this.orgService.addLog(logInfo);
      }
    }
    shouldIgnore(error) {
      if (this.last5Errors.find(err => err.includes(error))) {
        return true;
      }
      for (const err of this.getErrorsToIgnore()) {
        if (error.includes(err)) {
          return true;
        }
      }
      return false;
    }
    getErrorsToIgnore() {
      return ["404", "Cannot POST", "Failed to load resource", "status of 500", "ERR_CONNECTION_REFUSED", "Http failure response", "user_cancelled", "BrowserAuthError", "interaction_in_progress", "There is no interval scheduled", "ExpressionChangedAfterItHasBeenCheckedError", "auth/multi-factor-auth-required", "auth/wrong-password", "auth/network-request-failed"];
    }
    addLastErrorToLast5(error) {
      this.last5Errors.push(error);
      if (this.last5Errors.length > 5) {
        this.last5Errors = this.last5Errors.slice(1);
      }
    }
    static #_ = (() => this.ɵfac = function ErrorHandlerService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ErrorHandlerService)(core /* ɵɵinject */.KVO(OrganizationService), core /* ɵɵinject */.KVO(UserService), core /* ɵɵinject */.KVO(ModelService), core /* ɵɵinject */.KVO(InitRappidService), core /* ɵɵinject */.KVO(OplService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ErrorHandlerService,
      factory: ErrorHandlerService.ɵfac,
      providedIn: "root"
    }))();
  }
  return ErrorHandlerService;
})();