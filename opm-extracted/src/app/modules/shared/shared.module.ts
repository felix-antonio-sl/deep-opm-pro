// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/shared/shared.module.ts
// Extracted by opm-extracted/tools/extract.mjs

let SharedModule = /*#__PURE__*/(() => {
  class SharedModule {
    static #_ = (() => this.ɵfac = function SharedModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SharedModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: SharedModule
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      providers: [DatePipe],
      imports: [CommonModule, MaterialModule, FormsModule, MatChipsModule, ReactiveFormsModule, MatProgressBarModule, DragDropModule, MaterialModule, MatChipsModule, ReactiveFormsModule, DragDropModule]
    }))();
  }
  return SharedModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(SharedModule, {
      declarations: [AvatarComponent, ResizeBarDirective, ResizeBarComponent, CalanderComponent, ProgressSpinner, BackgroundPhotoDialogComponent, NewModelByWizardComponentComponent, ConfirmDialogDialogComponent, SelectOpdsTreeDialog, MethodologicalCheckingDialog],
      imports: [CommonModule, MaterialModule, FormsModule, MatChipsModule, ReactiveFormsModule, MatProgressBarModule, DragDropModule, NgOptimizedImage],
      exports: [MaterialModule, AvatarComponent, ResizeBarDirective, CalanderComponent, ProgressSpinner, MatChipsModule, ReactiveFormsModule, NewModelByWizardComponentComponent, DragDropModule, SelectOpdsTreeDialog]
    });
  }
})();
