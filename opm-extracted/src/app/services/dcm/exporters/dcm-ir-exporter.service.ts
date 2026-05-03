// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/exporters/dcm-ir-exporter.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let DCMIRExporterService = /*#__PURE__*/(() => {
  class DCMIRExporterService {
    /**
     * Export DCM-IR to JSON
     */
    exportDCMIR(dcmIR) {
      return JSON.stringify(dcmIR, null, 2);
    }
    static #_ = (() => this.ɵfac = function DCMIRExporterService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DCMIRExporterService)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: DCMIRExporterService,
      factory: DCMIRExporterService.ɵfac,
      providedIn: "root"
    }))();
  }
  return DCMIRExporterService;
})();