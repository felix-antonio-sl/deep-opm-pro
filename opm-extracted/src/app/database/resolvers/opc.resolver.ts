// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/resolvers/opc.resolver.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpcAppResolver = /*#__PURE__*/(() => {
  class OpcAppResolver {
    constructor(user, context, oplExporting) {
      this.user = user;
      this.context = context;
      this.oplExporting = oplExporting;
    }
    resolve(route, state) {
      var _this = this;
      const id = route.params.id;
      const opd_id = route.params.opd;
      const name = route.queryParams.name;
      const path = route.queryParams.path;
      const opd = route.queryParams.opd;
      const isOplExporting = route.queryParams["export-opl"] === "true";
      if (id || name) {
        return this.user.user$.pipe((0, take)(1),
        // Ensures only the first value is taken
        (0, map)(user => {
          if (name) {
            this.context.loadModelByPath(name, path, opd);
          } else if (id) {
            if (this.context.getTabs().find(t => t?.context?.properties?.id === id)) {
              return;
            }
            this.context.oplService.options.isLoadingModel = true;
            this.context.loadModel(id, undefined, "MAIN", opd_id).then(/*#__PURE__*/function () {
              var _ref = (0, default)(function* (res) {
                // If we loaded using a link, there shouldn't be an empty model.
                if (_this.context.getTabs().length > 1 && _this.context.getTabs()[0].context instanceof EmptyContext) {
                  _this.context.removeTab(0);
                }
                if (isOplExporting) {
                  _this.oplExporting.exportOPL(null);
                }
              });
              return function (_x) {
                return _ref.apply(this, arguments);
              };
            }());
          }
        }));
      }
      return (0, observable_of.of)({});
    }
    static #_ = (() => this.ɵfac = function OpcAppResolver_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpcAppResolver)(core /* ɵɵinject */.KVO(UserService), core /* ɵɵinject */.KVO(ContextService), core /* ɵɵinject */.KVO(ExportOPLAPIService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: OpcAppResolver,
      factory: OpcAppResolver.ɵfac
    }))();
  }
  return OpcAppResolver;
})();