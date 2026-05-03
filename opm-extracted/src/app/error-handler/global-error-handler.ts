// Source: decompiled/deobfuscated.js
// Original path: ./src/app/error-handler/global-error-handler.ts
// Extracted by opm-extracted/tools/extract.mjs

let GlobalErrorHandler = /*#__PURE__*/(() => {
  class GlobalErrorHandler {
    constructor(zone, errorService) {
      this.zone = zone;
      this.errorService = errorService;
    }
    handleError(error) {
      this.zone.run(() => {
        this.errorService.logError(error.stack || error.code || error.message);
      });
    }
    static #_ = (() => this.ɵfac = function GlobalErrorHandler_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GlobalErrorHandler)(core /* ɵɵinject */.KVO(NgZone), core /* ɵɵinject */.KVO(ErrorHandlerService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: GlobalErrorHandler,
      factory: GlobalErrorHandler.ɵfac
    }))();
  }
  return GlobalErrorHandler;
})();