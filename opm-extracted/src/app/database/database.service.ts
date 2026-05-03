// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/database.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let DatabaseService = /*#__PURE__*/(() => {
  class DatabaseService {
    constructor(database_) {
      this.database_ = database_;
      this.databaseDriver = database_;
    }
    get driver() {
      return this.databaseDriver;
    }
    static #_ = (() => this.ɵfac = function DatabaseService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DatabaseService)(core /* ɵɵinject */.KVO("DatabaseDriver"));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: DatabaseService,
      factory: DatabaseService.ɵfac
    }))();
  }
  return DatabaseService;
})();