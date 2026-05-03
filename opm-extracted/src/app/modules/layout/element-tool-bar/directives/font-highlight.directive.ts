// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/element-tool-bar/directives/font-highlight.directive.ts
// Extracted by opm-extracted/tools/extract.mjs

let FontHighlightDirective = /*#__PURE__*/(() => {
  class FontHighlightDirective {
    constructor(el) {
      this.el = el;
      this.highlightColor = "#78A8F1";
    }
    onMouseEnter() {
      this.highlight();
    }
    onMouseLeave() {
      this.unhighlight();
    }
    highlight() {
      this.el.nativeElement.style.background = this.highlightColor;
    }
    unhighlight() {
      this.el.nativeElement.style.background = null;
    }
    static #_ = (() => this.ɵfac = function FontHighlightDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FontHighlightDirective)(core /* ɵɵdirectiveInject */.rXU(ElementRef));
    })();
    static #_2 = (() => this.ɵdir = /*@__PURE__*/core /* ɵɵdefineDirective */.FsC({
      type: FontHighlightDirective,
      selectors: [["", "fontHighlight", ""]],
      hostBindings: function FontHighlightDirective_HostBindings(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵlistener */.bIt("mouseenter", function FontHighlightDirective_mouseenter_HostBindingHandler() {
            return ctx.onMouseEnter();
          })("mouseleave", function FontHighlightDirective_mouseleave_HostBindingHandler() {
            return ctx.onMouseLeave();
          });
        }
      },
      standalone: true
    }))();
  }
  return FontHighlightDirective;
})();