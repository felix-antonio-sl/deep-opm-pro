// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/shared/avatar/avatar.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = a0 => ({
  color: a0
});
function AvatarComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 2)(1, "img", 3);
    core /* ɵɵlistener */.bIt("error", function AvatarComponent_div_0_Template_img_error_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.error($event));
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("src", ctx_r1.photoUrl, core /* ɵɵsanitizeUrl */.B4B);
  }
}
function AvatarComponent_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-icon", 4);
    core /* ɵɵtext */.EFF(1, "face");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("ngStyle", core /* ɵɵpureFunction1 */.eq3(1, c0, ctx_r1.color));
  }
}
let AvatarComponent = /*#__PURE__*/(() => {
  class AvatarComponent {
    constructor() {}
    ngOnInit() {}
    getAvatarImage() {
      return `url(${this.photoUrl})`;
    }
    error($event) {
      this.photoUrl = undefined;
    }
    static #_ = (() => this.ɵfac = function AvatarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AvatarComponent)();
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: AvatarComponent,
      selectors: [["opc-avatar"]],
      inputs: {
        photoUrl: "photoUrl",
        color: "color"
      },
      decls: 2,
      vars: 2,
      consts: [["class", "avatar", 4, "ngIf"], ["class", "avatar", 3, "ngStyle", 4, "ngIf"], [1, "avatar"], [2, "width", "100%", "height", "100%", 3, "error", "src"], [1, "avatar", 3, "ngStyle"]],
      template: function AvatarComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵtemplate */.DNE(0, AvatarComponent_div_0_Template, 2, 1, "div", 0)(1, AvatarComponent_mat_icon_1_Template, 2, 3, "mat-icon", 1);
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngIf", ctx.photoUrl);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.photoUrl);
        }
      },
      dependencies: [NgIf, NgStyle, MatIcon],
      styles: [".avatar[_ngcontent-%COMP%]{height:32px;width:32px;font-size:32px;display:inline-block;background-size:32px 32px;border-radius:32px;border:1px white solid;margin-right:10px;background-color:#f5f5f5;overflow:hidden}"]
    }))();
  }
  return AvatarComponent;
})();