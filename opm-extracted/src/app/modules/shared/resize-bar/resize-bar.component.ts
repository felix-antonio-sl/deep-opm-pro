// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/shared/resize-bar/resize-bar.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let ResizeBarComponent = /*#__PURE__*/(() => {
  class ResizeBarComponent {
    ngOnInit() {}
    constructor(document, el) {
      this.document = document;
      this.el = el;
      this.setDragListener();
    }
    drag(event, element) {
      if (element.parentElement.id === "oplFullScreen") {
        const oplFullDiv = document.getElementById("oplFullScreen");
        const height = oplFullDiv.getBoundingClientRect().bottom - event.changedTouches[0].clientY + "px";
        oplFullDiv.style.height = height;
        const oplDiv = document.getElementById("opl-widget");
        const aiDiv = document.getElementById("opl-ai-text");
        oplDiv.style.height = height;
        aiDiv.style.height = height;
      } else if (element.parentElement.parentElement && element.parentElement.parentElement.id === "opcloud-containerf") {
        const sideNav = document.getElementsByClassName("mat-sidenav")[0];
        sideNav.style.width = event.changedTouches[0].clientX + "px";
      }
    }
    setDragListener() {
      const that = this;
      const nativeElement = this.el.nativeElement;
      // Handle touch events
      nativeElement.addEventListener("touchmove", function (event) {
        that.drag(event, nativeElement);
      });
      // Convert native events to observables
      const mousedown$ = (0, fromEvent)(nativeElement, "mousedown");
      const mousemove$ = (0, fromEvent)(this.document, "mousemove").pipe((0, map)(e => ({
        y: e.movementY,
        x: e.movementX
      })), (0, filter)(movement => movement.x !== 0 || movement.y !== 0));
      const mouseup$ = (0, fromEvent)(this.document, "mouseup");
      // Combine streams
      this.resize$ = mousedown$.pipe((0, mergeMap)(() => mousemove$.pipe((0, takeUntil)(mouseup$))));
    }
    static #_ = (() => this.ɵfac = function ResizeBarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResizeBarComponent)(core /* ɵɵdirectiveInject */.rXU(DOCUMENT), core /* ɵɵdirectiveInject */.rXU(ElementRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ResizeBarComponent,
      selectors: [["opcloud-resize-bar"]],
      inputs: {
        direction: "direction"
      },
      decls: 3,
      vars: 1,
      consts: [["resizeBar", ""], [1, "resize-bar", 3, "ngClass"], [1, "resize-bar-control"]],
      template: function ResizeBarComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 1, 0);
          core /* ɵɵelement */.nrm(2, "div", 2);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngClass", ctx.direction);
        }
      },
      dependencies: [NgClass],
      styles: [".resize-bar[_ngcontent-%COMP%]{position:absolute;background:transparent;z-index:1}.resize-bar[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%]{border:solid transparent 0;visibility:hidden}.resize-bar[_ngcontent-%COMP%]:hover   .resize-bar-control[_ngcontent-%COMP%]{visibility:visible;border-color:#1a3763}.resize-bar.top[_ngcontent-%COMP%], .resize-bar.bottom[_ngcontent-%COMP%]{cursor:row-resize;width:100%;left:0;height:8px}.resize-bar.top[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%], .resize-bar.bottom[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%]{height:1px;border-width:1px 0}.resize-bar.top[_ngcontent-%COMP%]{top:-5px;margin-top:5px}.resize-bar.bottom[_ngcontent-%COMP%]{bottom:0}.resize-bar.bottom[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%]{margin-top:5px}.resize-bar.left[_ngcontent-%COMP%], .resize-bar.right[_ngcontent-%COMP%]{cursor:col-resize;height:100%;top:0;position:absolute;width:8px}.resize-bar.left[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%], .resize-bar.right[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%]{height:100%;width:1px;border-width:0 1px}.resize-bar.left[_ngcontent-%COMP%]{left:0}.resize-bar.right[_ngcontent-%COMP%]{right:0}.resize-bar.right[_ngcontent-%COMP%]   .resize-bar-control[_ngcontent-%COMP%]{margin:0 5px}"]
    }))();
  }
  return ResizeBarComponent;
})();