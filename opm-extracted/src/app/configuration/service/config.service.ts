// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/service/config.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ConfigService = /*#__PURE__*/(() => {
  class ConfigService {
    constructor(http) {
      this.http = http;
    }
    get() {
      return this.config_;
    }
    build() {
      return new Promise((resolve, reject) => {
        firstValueFrom(this.http.get("assets/config/edx.config.json")).then(data => {
          this.config_ = {
            target: data.TARGET,
            semester: data.SEMESTER,
            version: data.VERSION,
            endpoint: data.ENDPOINT
          };
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    }
    static #_ = (() => this.ɵfac = function ConfigService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ConfigService)(core /* ɵɵinject */.KVO(HttpClient));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ConfigService,
      factory: ConfigService.ɵfac
    }))();
  }
  return ConfigService;
})();
function ConfigFactory(config) {
  return () => config.build();
}
function init() {
  return {
    provide: APP_INITIALIZER,
    useFactory: ConfigFactory,
    deps: [ConfigService],
    multi: true
  };
}
const ConfigModule = {
  init: init
};