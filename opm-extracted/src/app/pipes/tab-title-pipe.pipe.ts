// Source: decompiled/deobfuscated.js
// Original path: ./src/app/pipes/tab-title-pipe.pipe.ts
// Extracted by opm-extracted/tools/extract.mjs

let TabTitlePipe = /*#__PURE__*/(() => {
  class TabTitlePipe {
    transform(value, ...args) {
      return value.getWholeTextName();
    }
    static #_ = (() => this.ɵfac = function TabTitlePipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || TabTitlePipe)();
    })();
    static #_2 = (() => this.ɵpipe = /*@__PURE__*/core /* ɵɵdefinePipe */.EJ8({
      name: "TabTitlePipe",
      type: TabTitlePipe,
      pure: true,
      standalone: true
    }))();
  }
  return TabTitlePipe;
})();