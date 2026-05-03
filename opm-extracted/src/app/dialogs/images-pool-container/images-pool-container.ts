// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/images-pool-container/images-pool-container.ts
// Extracted by opm-extracted/tools/extract.mjs

const images_pool_container_c0 = (a0, a1, a2, a3, a4) => ({
  mode: a0,
  searchTags: a1,
  searchTagsCtrl: a2,
  separatorKeysCodes: a3,
  tabChange: a4
});
let ImagesPoolContainer = /*#__PURE__*/(() => {
  class ImagesPoolContainer {
    constructor(dialogRef, data) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.title = "Images Pool Management";
      this.modes = ImagesPoolType;
      this.searchTagsCtrl = new UntypedFormControl("");
      this.separatorKeysCodes = [ENTER, COMMA];
      this.tabChange = new ReplaySubject(1);
      this.tabChange$ = this.tabChange.asObservable();
      this.searchTags = [];
    }
    ngOnInit() {}
    onTabChange($event) {
      this.tabChange.next($event.tab);
    }
    static #_ = (() => this.ɵfac = function ImagesPoolContainer_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ImagesPoolContainer)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ImagesPoolContainer,
      selectors: [["opcloud-pool-container"]],
      decls: 10,
      vars: 22,
      consts: [[2, "height", "calc(100% - 20px)"], ["animationDuration", "0ms", 2, "height", "calc(100% - 45px)", 3, "selectedTabChange"], ["label", "Private"], [3, "additionalData"], ["label", "Organizational"], ["label", "Global"]],
      template: function ImagesPoolContainer_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "p");
          core /* ɵɵtext */.EFF(2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "mat-tab-group", 1);
          core /* ɵɵlistener */.bIt("selectedTabChange", function ImagesPoolContainer_Template_mat_tab_group_selectedTabChange_3_listener($event) {
            return ctx.onTabChange($event);
          });
          core /* ɵɵelementStart */.j41(4, "mat-tab", 2);
          core /* ɵɵelement */.nrm(5, "opcloud-images-pool", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "mat-tab", 4);
          core /* ɵɵelement */.nrm(7, "opcloud-images-pool", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "mat-tab", 5);
          core /* ɵɵelement */.nrm(9, "opcloud-images-pool", 3);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.title);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("additionalData", core /* ɵɵpureFunction5 */.s1E(4, images_pool_container_c0, ctx.modes.PERSONAL, ctx.searchTags, ctx.searchTagsCtrl, ctx.separatorKeysCodes, ctx.tabChange$));
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("additionalData", core /* ɵɵpureFunction5 */.s1E(10, images_pool_container_c0, ctx.modes.ORG, ctx.searchTags, ctx.searchTagsCtrl, ctx.separatorKeysCodes, ctx.tabChange$));
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("additionalData", core /* ɵɵpureFunction5 */.s1E(16, images_pool_container_c0, ctx.modes.GLOBAL, ctx.searchTags, ctx.searchTagsCtrl, ctx.separatorKeysCodes, ctx.tabChange$));
        }
      },
      styles: ["[_nghost-%COMP%]   .mat-mdc-tab-body-wrapper[_ngcontent-%COMP%]{height:100%!important}[_nghost-%COMP%]   .mat-mdc-tab-body--active[_ngcontent-%COMP%]{height:100%!important}.mat-mdc-tab-label--active[_ngcontent-%COMP%]:not(.mat-mdc-tab-disabled), .mat-mdc-tab-label--active.cdk-keyboard-focused[_ngcontent-%COMP%]:not(.mat-mdc-tab-disabled){background-color:#fff}.mat-ink-bar[_ngcontent-%COMP%]{background-color:#1a3763!important}p[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}"]
    }))();
  }
  return ImagesPoolContainer;
})();