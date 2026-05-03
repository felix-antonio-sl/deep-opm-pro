// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app.module.ts
// Extracted by opm-extracted/tools/extract.mjs

let AppModule = /*#__PURE__*/(() => {
  class AppModule {
    static #_ = (() => this.ɵfac = function AppModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: AppModule,
      bootstrap: [AppComponent]
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      providers: [{
        provide: "DEFAULT_VIEW_ENCAPSULATION",
        useValue: ViewEncapsulation.Emulated // Default for all components
      }, provideHttpClient(withInterceptorsFromDi()),
      // Functional API for HttpClient
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true // Ensures this interceptor is added to the chain
      }, provideCodeEditor({
        // editorVersion: '0.52.2',
        // use local Monaco installation
        baseUrl: "assets/monaco",
        // use local Typings Worker
        typingsWorkerUrl: "assets/workers/typings-worker.js"
      }), ChatStorageService, ConfigService, ConfigModule.init(), OpmModelComparisonService, GraphDBService, ExportOPLAPIService],
      imports: [platform_browser_BrowserModule, BrowserAnimationsModule, FormsModule, SharedModule, RouterModule, ReactiveFormsModule, LayoutModule, MatDialogModule, MatPaginatorModule, MatProgressSpinnerModule, MatTabsModule]
    }))();
  }
  return AppModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(AppModule, {
      declarations: [AppComponent, opmQueryDialogComponent],
      imports: [platform_browser_BrowserModule, BrowserAnimationsModule, FormsModule, SharedModule, RouterModule, ReactiveFormsModule, LayoutModule, MatDialogModule, MatPaginatorModule, MatProgressSpinnerModule, MatTabsModule]
    });
  }
})();