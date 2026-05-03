// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/list-things/list-things.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function ListThingsComponent_li_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "li");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelement */.nrm(2, "hr");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const element_r1 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", element_r1, "");
  }
}
let ListThingsComponent = /*#__PURE__*/(() => {
  class ListThingsComponent {
    constructor(graphService, initRappidService) {
      this.graphService = graphService;
      this.initRappidService = initRappidService;
    }
    ngOnInit() {
      this.graph = this.graphService.getGraph();
      this.list();
    }
    /**
     * Alon: button for mapping elements in the model
     */
    list() {
      const options = this.initRappidService;
      this.htmlList = this.graphService.displayElements(options);
    }
    static #_ = (() => this.ɵfac = function ListThingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ListThingsComponent)(core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ListThingsComponent,
      selectors: [["opcloud-list-things"]],
      decls: 6,
      vars: 1,
      consts: [["id", "ListThingsComponent"], [4, "ngFor", "ngForOf"]],
      template: function ListThingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "h1");
          core /* ɵɵtext */.EFF(1, "List of elements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "div", 0)(3, "div")(4, "ol");
          core /* ɵɵtemplate */.DNE(5, ListThingsComponent_li_5_Template, 3, 1, "li", 1);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.htmlList);
        }
      },
      dependencies: [NgForOf]
    }))();
  }
  return ListThingsComponent;
})();