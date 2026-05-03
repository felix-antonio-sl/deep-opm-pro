// Source: decompiled/37084.js
// Original path: ./src/app/modules/shared/resize-bar/resize-bar.directive.ts
// Extracted by opm-extracted/tools/extract.mjs

const resize_bar_directive_c0 = ["resizeBar"];
const DIRECTIONS = ["top", "right", "bottom", "left"];
/***
 * Adds a resize bar to an element in the specified direction(s).
 * Usage: pass a string / array / object of the wanted resize directions.
 * Available directions: top, right, bottom, left
 * Examples:
 * <div opcloudResizableNew="top right">...</div>
 * <div [opcloudResizableNew]="['top', 'right']">...</div>
 * <div [opcloudResizableNew]="{top: true, right: true}">...</div>
 */
let ResizeBarDirective = /*#__PURE__*/(() => {
  class ResizeBarDirective {
    // get the desired resize direction as an input, transform it into the _directions object
    set opcloudResizeBar(directions) {
      if (!(directions instanceof Object) && typeof directions !== "string") {
        throw new Error(`Use of opcloudResizableNew directive is wrong.
      Please pass either an array of strings or a string of directions separated by space.`);
      }
      this._directions = DIRECTIONS.reduce((acc, val) => {
        return {
          ...acc,
          [val]: directions instanceof Object ? directions.val : directions.indexOf(val) > -1
        };
      }, {});
    }
    setDimension(name, val) {
      this.dimensions[name] += val;
      this[name + "Px"] = this.dimensions[name] + "px";
    }
    constructor(el, componentFactoryResolver, viewContainerRef) {
      this.el = el;
      this.componentFactoryResolver = componentFactoryResolver;
      this.viewContainerRef = viewContainerRef;
      this.resizeBarComponentRefs = {};
      this.dimensions = {
        height: null,
        width: null,
        top: null,
        left: null
      };
      this.subscriptions = [];
    }
    ngAfterContentInit() {
      this.dimensions.height = this.el.nativeElement.clientHeight;
      this.dimensions.width = this.el.nativeElement.clientWidth;
      this.dimensions.top = this.el.nativeElement.offsetTop;
      this.dimensions.left = this.el.nativeElement.offsetLeft;
    }
    ngOnInit() {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ResizeBarComponent);
      DIRECTIONS.forEach(direction => {
        if (this._directions[direction]) {
          const resizeBarComponent = this.viewContainerRef.createComponent(componentFactory);
          resizeBarComponent.instance.direction = direction;
          this.el.nativeElement.appendChild(resizeBarComponent.location.nativeElement);
          // append the created component as the host's child
          this.resizeBarComponentRefs[direction] = resizeBarComponent;
          this.subscriptions.push(resizeBarComponent.instance.resize$.subscribe(this.getNewSize(direction).bind(this)));
        }
      });
    }
    getNewSize(direction) {
      switch (direction) {
        case "top":
          return movement => {
            this.setDimension("top", movement.y);
            this.setDimension("height", -movement.y);
          };
        case "right":
          return movement => {
            this.setDimension("width", movement.x);
            (0, adjustToolbarSizeAndOpl)();
          };
        case "bottom":
          return movement => {
            this.setDimension("height", movement.y);
          };
        case "left":
          return movement => {
            this.setDimension("width", -movement.x);
            this.setDimension("left", movement.x);
            (0, adjustToolbarSizeAndOpl)();
          };
        default:
          return movement => {
            console.error("Resizable directive: unknown direction:", direction, movement);
          };
      }
    }
    ngOnDestroy() {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    static #_ = (() => this.ɵfac = function ResizeBarDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResizeBarDirective)(core /* ɵɵdirectiveInject */.rXU(ElementRef), core /* ɵɵdirectiveInject */.rXU(ComponentFactoryResolver), core /* ɵɵdirectiveInject */.rXU(ViewContainerRef));
    })();
    static #_2 = (() => this.ɵdir = /*@__PURE__*/core /* ɵɵdefineDirective */.FsC({
      type: ResizeBarDirective,
      selectors: [["", "opcloudResizeBar", ""]],
      viewQuery: function ResizeBarDirective_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(resize_bar_directive_c0, 5);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.resizeBar = _t.first;
          }
        }
      },
      hostVars: 8,
      hostBindings: function ResizeBarDirective_HostBindings(rf, ctx) {
        if (rf & 2) {
          core /* ɵɵstyleProp */.xc7("height", ctx.heightPx)("width", ctx.widthPx)("top", ctx.topPx)("left", ctx.leftPx);
        }
      },
      inputs: {
        opcloudResizeBar: "opcloudResizeBar"
      }
    }))();
  }
  return ResizeBarDirective;
})();