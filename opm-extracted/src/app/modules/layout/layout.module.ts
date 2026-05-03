// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/layout.module.ts
// Extracted by opm-extracted/tools/extract.mjs

let LayoutModule = /*#__PURE__*/(() => {
  class LayoutModule {
    static #_ = (() => this.ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LayoutModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: LayoutModule
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      providers: [GraphService, ModelService, InitRappidService, NoteService, TreeViewService, OplService, DialogService],
      imports: [CommonModule, SharedModule, TreeModule, RouterModule, FormsModule, RappidModule, MatSidenavModule, OpcLayoutModule, DragDropModule, MatSliderModule, MatBadgeModule]
    }))();
  }
  return LayoutModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(LayoutModule, {
      declarations: [MainComponent, HeaderComponent, OPDHierarchyComponent, OplContainerComponent, LinksDialogComponent, ListLogicalComponent, ElementToolBarComponent, RemoveOperationComponent, RemoveLocator, RemoveLocatorLinks, NavigatorComponent, SearchItemsDialogComponent, ChatComponentFloat, ChatComponentPanel, ExistingNameDialogComponent],
      imports: [CommonModule, SharedModule, TreeModule, RouterModule, FormsModule, RappidModule, MatSidenavModule, OpcLayoutModule, DragDropModule, MatSliderModule, MatBadgeModule, TabTitlePipe, FontHighlightDirective]
    });
  }
})();
core /* ɵɵsetComponentScope */.wjB(MainComponent, [NgIf, NgStyle, MatDrawerContainer, MatSidenav, MatSidenavContainer, MatSidenavContent, MatTooltip, ResizeBarDirective, RappidPaperComponent, HeaderComponent, OPDHierarchyComponent, OplContainerComponent, ListLogicalComponent, ElementToolBarComponent, NavigatorComponent, ChatComponentFloat, ChatComponentPanel], []);
core /* ɵɵsetComponentScope */.wjB(RemoveOperationComponent, [NgIf, MatButton, RemoveLocator, RemoveLocatorLinks], []);