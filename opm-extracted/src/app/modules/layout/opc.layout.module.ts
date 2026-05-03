// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/opc.layout.module.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpcLayoutModule = /*#__PURE__*/(() => {
  class OpcLayoutModule {
    static #_ = (() => this.ɵfac = function OpcLayoutModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpcLayoutModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: OpcLayoutModule
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      providers: [{
        provide: OplConfig,
        useClass: OplDefaultConfig
      }, {
        provide: AbstractVersionService,
        useClass: OpcVersionService
      }],
      imports: [SharedModule, CommonModule, OpcModule, MatProgressSpinnerModule]
    }))();
  }
  return OpcLayoutModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(OpcLayoutModule, {
      declarations: [CollaborationMenuComponent, MenuComponent, UserStatusComponent, RappidToolbarComponent, CollaborationDialogComponent],
      imports: [SharedModule, CommonModule, OpcModule, MatProgressSpinnerModule],
      exports: [CollaborationMenuComponent, MenuComponent, UserStatusComponent, RappidToolbarComponent]
    });
  }
})();