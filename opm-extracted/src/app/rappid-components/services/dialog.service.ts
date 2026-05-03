// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/dialog.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let DialogService = /*#__PURE__*/(() => {
  class DialogService {
    constructor(dialog) {
      this.dialog = dialog;
    }
    getDialog() {
      return this.dialog;
    }
    openDialog(dialog, height = 500, width = 600, data) {
      // Alon: open a dialog box
      let disableClose = false;
      if ("doNotClose" in data && data.doNotClose === "true") {
        disableClose = true;
      }
      if (this.dialog.openDialogs.length === 0 || data && data.allowMultipleDialogs === true) {
        return this.dialog.open(dialog, {
          height: height ? height + "px" : undefined,
          width: width ? width + "px" : undefined,
          data: data,
          disableClose: disableClose,
          autoFocus: false
        });
      }
    }
    static #_ = (() => this.ɵfac = function DialogService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DialogService)(core /* ɵɵinject */.KVO(MatDialog));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: DialogService,
      factory: DialogService.ɵfac
    }))();
  }
  return DialogService;
})();