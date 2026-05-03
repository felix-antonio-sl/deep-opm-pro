// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/opcloud-navigator/navigator.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = (a0, a1) => ({
  width: a0,
  height: a1,
  top: "10px",
  left: "10px"
});

/*
* This is the component for the opcloud navigator:
* a small dialog/box in which the user can see all the (current open) model together, but in a smaller version.
* inputs: paper scroller of open OPM model in the web
* output: 2 navigators, one floating and the other is on the side bar. Only one will be seen.
*/
let NavigatorComponent = /*#__PURE__*/(() => {
  class NavigatorComponent {
    constructor(initRappid, main) {
      this.initRappid = initRappid;
      this.main = main;
      // floatingNavigatorBoxSize holds the floating box size, in order to be able to resize it.
      // this is not the navigator size itself, but the box in which it is.
      // the style in the html is attached to it and changes according to it's value. initial value is set to 250.
      this.floatingNavigatorBoxSize = 250;
      this.paperScroller = initRappid.paperScroller;
      this.initRappid.navigatorComponentRef = this;
    }
    /* ngOnInit creates both navigators. */
    // comment: Gal: there should be only one navigator at a time due to performance issues.
    ngOnInit() {
      // this.createNavigator('floatingNavigator'); // assuming that this id exists in navigator.component.html
      this.existingNavigator = this.createNavigator("sideBarNavigator"); // assuming that this id exists in main.component.html
    }
    switchNavigator(switchTo) {
      if (this.existingNavigator) {
        this.existingNavigator.remove();
      }
      const navigatorToCreate = switchTo === "floating" ? "floatingNavigator" : "sideBarNavigator";
      this.existingNavigator = this.createNavigator(navigatorToCreate);
      this.initRappid.navigator = this.existingNavigator;
    }
    /* ngAfterViewInit changes some elements after their creation
    * mainly adds svg-paths (the visual part) to the buttons on the navigators.
    * it affects both navigator.component.html and main.component.html*/
    ngAfterViewInit() {
      // set the floating navigator box to it's initial position.
      this.initializeFloatingNavigatorPosition("floatingNavigatorBox");
      $("#minusButton").html(minusButton); // adding svg to the minusButton
      $("#plusButton").html(plusButton); // adding svg to the plusButton
      $("#dragHandleButton").html(dragHandleButton); // adding svg to the dragHandleButton
      $(".leftArrowButton").html(leftArrowButton); // adding svg to all which are in leftArrowButton class
      $(".downArrowButton").html(downArrowButton); // adding svg to all which are in downArrowButton class
      $(".rightArrowButton").html(rightArrowButton); // adding svg to all which are in rightArrowButton class
    }
    /*createNavigator creates the navigator and renders it inside the html element which id is given
    * input:  @htmlElementId (in this html or in main.component.html) to which the navigator should be attached.
    *         @size of the navigator itself. initially set to 200 but can change in order to resize*/
    createNavigator(htmlElementId, size = 200) {
      // assuming only the id name itself is given and thus we need to add '#' in front.
      htmlElementId = "#" + htmlElementId;
      const navigator = new joint.ui.Navigator({
        paperScroller: this.paperScroller,
        height: size,
        width: size / 2 * 3,
        padding: 15,
        zoomOptions: {
          max: 2,
          min: 0.2
        },
        paperOptions: {
          async: {
            batchSize: 1
          },
          sorting: joint.dia.Paper.sorting.APPROX
        }
      });
      navigator.$el.appendTo(htmlElementId); // append the navigator element to the given html element.
      navigator.render(); // render the navigator.
      return navigator;
    }
    /*initializeFloatingNavigatorPosition is transforming the position of the floating navigator from the top left corner,
     to the right bottom corner. The floating navigator is set initially to the top left corner because in this way
     when increasing it's size, it grows toward the bottom and the right and doesn't go out of it's borders.
     But visually it suits more to be in the bottom right and thus we need to make the transformation just after the init.
     input: @floatingNavigatorId: the floating box element id in which the navigator is.
            @boundaryClass: the html class name which serves as the boundary, and from which the box should not exit.*/
    initializeFloatingNavigatorPosition(floatingNavigatorId, boundaryClass = ".sd-content") {
      // assuming only the id name itself is given and thus we need to add '#' in front.
      floatingNavigatorId = "#" + floatingNavigatorId;
      if ($(boundaryClass).length < 0) {
        return;
      } // checking that an element of this class exists.
      const sdContentBoundaries = $(boundaryClass)[0].getBoundingClientRect(); // get the size parameters of this class.
      // get the initial position of the floating box from the left and top.
      const floatingBoxInitialLeft = parseInt($(floatingNavigatorId)[0].style.left.slice(0, -2), 10);
      const floatingBoxInitialTop = parseInt($(floatingNavigatorId)[0].style.top.slice(0, -2), 10);
      // how much need to change the initial position considering also the size of the floating box itself.
      const transformX = sdContentBoundaries.width - floatingBoxInitialLeft - this.floatingNavigatorBoxSize;
      const transformY = sdContentBoundaries.height - floatingBoxInitialTop - this.floatingNavigatorBoxSize;
      // transform the position
      $(floatingNavigatorId)[0].style.transform = "translate3d(" + transformX.toString() + "px, " + transformY.toString() + "px, 0px)";
    }
    /*resetDraggableBoundary resets these fields (below) of the draggable box so that it will understand the size
    of it's boundary after being resized. Otherwise it it thinks the boundary is smaller than it really is and
    the floating box gets stuck in the middle of the window.*/
    resetDraggableBoundary() {
      this.draggableBox._dragRef._previewRect = undefined;
      this.draggableBox._dragRef._boundaryRect = undefined;
    }
    /*resizeFloatingNavigator enables to make the floating navigator bigger or smaller by clicking on the minus or plus
    * buttons.
    * input:  @floatingNavigatorId: the floating box element id in which the navigator is.
    *         @increase: true if the size should be increased and false if it should be decreased*/
    resizeFloatingNavigator(floatingNavigatorId, increase) {
      if (increase) {
        if (this.floatingNavigatorBoxSize >= 430) {
          return;
        } // check that the size of the box is not already too big.
        this.floatingNavigatorBoxSize += 30; // increase the size of the box.
      } else {
        if (this.floatingNavigatorBoxSize <= 130) {
          return;
        } // check that the size of the box is not already too small.
        this.floatingNavigatorBoxSize -= 30; // decrease the size of the box.
      }
      // get the element of the current floating navigator
      const floatingNavigator = document.getElementById(floatingNavigatorId).firstChild;
      if (floatingNavigator) {
        // check that the navigator really exists.
        document.getElementById(floatingNavigatorId).removeChild(floatingNavigator); // remove the current navigator
      }
      // create a new navigator with the updated size.
      this.createNavigator(floatingNavigatorId, this.floatingNavigatorBoxSize - 50);
      // reset the boundaries so that the floating box will stay in it it's boundaries
      // although the size has been changed.
      this.resetDraggableBoundary();
    }
    static #_ = (() => this.ɵfac = function NavigatorComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NavigatorComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MainComponent));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: NavigatorComponent,
      selectors: [["opcloud-navigator-component"]],
      viewQuery: function NavigatorComponent_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(CdkDrag, 5);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.draggableBox = _t.first;
          }
        }
      },
      decls: 9,
      vars: 9,
      consts: [["id", "floatingNavigatorBox", "cdkDrag", "", "cdkDragRootElement", ".cdk-overlay-pane", 3, "cdkDragBoundary", "ngStyle"], ["id", "dragHandleButton", "cdkDragHandle", ""], ["id", "floatingNavigatorButtons", 1, "navigatorButtons"], [1, "leftArrowButton", 3, "click"], [1, "downArrowButton", 3, "click"], [1, "sizeButtons"], ["id", "minusButton", 3, "click"], ["id", "plusButton", 3, "click"], ["id", "floatingNavigator"]],
      template: function NavigatorComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0);
          core /* ɵɵelement */.nrm(1, "div", 1);
          core /* ɵɵelementStart */.j41(2, "div", 2)(3, "a", 3);
          core /* ɵɵlistener */.bIt("click", function NavigatorComponent_Template_a_click_3_listener() {
            return ctx.main.toggleNavigatorPosition();
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "a", 4);
          core /* ɵɵlistener */.bIt("click", function NavigatorComponent_Template_a_click_4_listener() {
            return ctx.initRappid.toggleNavigator();
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(5, "div", 5)(6, "a", 6);
          core /* ɵɵlistener */.bIt("click", function NavigatorComponent_Template_a_click_6_listener() {
            return ctx.resizeFloatingNavigator("floatingNavigator", false);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "a", 7);
          core /* ɵɵlistener */.bIt("click", function NavigatorComponent_Template_a_click_7_listener() {
            return ctx.resizeFloatingNavigator("floatingNavigator", true);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(8, "div", 8);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵstyleProp */.xc7("visibility", ctx.main.navigatorIsFloating && ctx.initRappid.showNavigator ? "visible" : "hidden");
          core /* ɵɵproperty */.Y8G("cdkDragBoundary", ".sd-content")("ngStyle", core /* ɵɵpureFunction2 */.l_i(6, c0, ctx.floatingNavigatorBoxSize + "px", ctx.floatingNavigatorBoxSize + "px"));
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵstyleProp */.xc7("visibility", ctx.initRappid.showNavigator && ctx.main.navigatorIsFloating ? "visible" : "hidden");
        }
      },
      dependencies: [NgStyle, CdkDrag, CdkDragHandle],
      styles: ["#floatingNavigatorBox[_ngcontent-%COMP%]{padding-top:30px;box-sizing:border-box;border:solid 1px #ccc;color:#000000de;background:#fff;border-radius:4px;position:absolute;z-index:200;transition:box-shadow .2s cubic-bezier(0,0,.2,1);box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}#floatingNavigatorBox[_ngcontent-%COMP%]:active{box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f}#dragHandleButton[_ngcontent-%COMP%]{opacity:.4;fill:#1a3763;position:absolute;top:4px;left:5px;cursor:move;width:24px;height:24px}#floatingNavigatorButtons[_ngcontent-%COMP%]{position:absolute;top:8px;right:5px}.sizeButtons[_ngcontent-%COMP%]{position:absolute;top:6px;right:38px;z-index:201}"]
    }))();
  }
  return NavigatorComponent;
})();