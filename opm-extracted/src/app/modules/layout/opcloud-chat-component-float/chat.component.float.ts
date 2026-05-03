// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/opcloud-chat-component-float/chat.component.float.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = (a0, a1) => ({
  width: a0,
  height: a1,
  top: "10px",
  left: "10px"
});
/*
* This is the component for the opcloud chat:
* a small dialog/box in which the user can see all the (current open) model together, but in a smaller version.
* inputs: paper scroller of open OPM model in the web
* output: 2 navigators, one floating and the other is on the side bar. Only one will be seen.
*/
let ChatComponentFloat = /*#__PURE__*/(() => {
  class ChatComponentFloat {
    constructor(initRappid, main) {
      this.initRappid = initRappid;
      this.main = main;
      // floatingChatBoxSize holds the floating box size, in order to be able to resize it.
      // this is not the chat size itself, but the box in which it is.
      // the style in the html is attached to it and changes according to it's value. initial value is set to 250.
      this.floatingChatBoxSize = 400;
      this.paperScroller = initRappid.paperScroller;
      this.initRappid.ChatComponentRef = this;
    }
    /* ngOnInit creates both chats. */
    ngOnInit() {
      this.initRappid.ChatIsFloating = false;
    }
    switchChat(switchTo) {
      const chatToCreate = switchTo === "floating" ? "floatingChat" : "sideBarChat";
      this.initRappid.Chat = this.existingChat;
    }
    /* ngAfterViewInit changes some elements after their creation
    * mainly adds svg-paths (the visual part) to the buttons on the chats.
    * it affects both chat.component.float.html and main.component.html*/
    ngAfterViewInit() {
      // set the floating chat box to it's initial position.
      this.initializeFloatingChatPosition("floatingChatBox");
      $("#minusButton").html(minusButton); // adding svg to the minusButton
      $("#plusButton").html(plusButton); // adding svg to the plusButton
      $("#dragHandleButton").html(dragHandleButton); // adding svg to the dragHandleButton
      $(".leftArrowButton").html(leftArrowButton); // adding svg to all which are in leftArrowButton class
      $(".downArrowButton").html(downArrowButton); // adding svg to all which are in downArrowButton class
      $(".rightArrowButton").html(rightArrowButton); // adding svg to all which are in rightArrowButton class
    }
    initializeFloatingChatPosition(floatingChatId, boundaryClass = ".sd-content") {
      // assuming only the id name itself is given and thus we need to add '#' in front.
      floatingChatId = "#" + floatingChatId;
      if ($(boundaryClass).length < 0) {
        return;
      } // checking that an element of this class exists.
      const sdContentBoundaries = $(boundaryClass)[0].getBoundingClientRect(); // get the size parameters of this class.
      // get the initial position of the floating box from the left and top.
      const floatingBoxInitialLeft = parseInt($(floatingChatId)[0].style.left.slice(0, -2), 10);
      const floatingBoxInitialTop = parseInt($(floatingChatId)[0].style.top.slice(0, -2), 10);
      // how much need to change the initial position considering also the size of the floating box itself.
      const transformX = sdContentBoundaries.width - floatingBoxInitialLeft - this.floatingChatBoxSize;
      const transformY = sdContentBoundaries.height - floatingBoxInitialTop - this.floatingChatBoxSize;
      // transform the position
      $(floatingChatId)[0].style.transform = "translate(" + transformX.toString() + "px, " + transformY.toString() + "px)";
    }
    /*resetDraggableBoundary resets these fields (below) of the draggable box so that it will understand the size
    of it's boundary after being resized. Otherwise it it thinks the boundary is smaller than it really is and
    the floating box gets stuck in the middle of the window.*/
    resetDraggableBoundary() {
      this.draggableBox._dragRef._previewRect = undefined;
      this.draggableBox._dragRef._boundaryRect = undefined;
    }
    /*resizeFloatingChat enables to make the floating navigator bigger or smaller by clicking on the minus or plus
    * buttons.
    * input:  @floatingChatId: the floating box element id in which the chat is.
    *         @increase: true if the size should be increased and false if it should be decreased*/
    resizeFloatingChat(floatingChatId, increase) {
      if (increase) {
        if (this.floatingChatBoxSize >= 700) {
          return;
        } // check that the size of the box is not already too big.
        this.floatingChatBoxSize += 30; // increase the size of the box.
      } else {
        if (this.floatingChatBoxSize <= 400) {
          return;
        } // check that the size of the box is not already too small.
        this.floatingChatBoxSize -= 30; // decrease the size of the box.
      }
      const historyDiv = $("#historyContainer")[0];
      // set height and padding according to floatingChatBoxSize
      const newHistoryHeight = this.floatingChatBoxSize - 90 - 25 + "px";
      historyDiv.style.height = newHistoryHeight;
      historyDiv.style.paddingBottom = "0.3em";
      // get the element of the current floating chat
      const floatingChat = document.getElementById(floatingChatId);
      if (floatingChat && floatingChat.firstChild) {
        document.getElementById(floatingChatId).removeChild(floatingChat); // remove the current chat
      }
      // reset the boundaries so that the floating box will stay in it it's boundaries
      // although the size has been changed.
      this.resetDraggableBoundary();
    }
    static #_ = (() => this.ɵfac = function ChatComponentFloat_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ChatComponentFloat)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MainComponent));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ChatComponentFloat,
      selectors: [["opcloud-chat-component-float"]],
      viewQuery: function ChatComponentFloat_Query(rf, ctx) {
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
      decls: 18,
      vars: 7,
      consts: [["id", "floatingChatBox", "cdkDrag", "", "cdkDragRootElement", ".cdk-overlay-pane", 3, "cdkDragBoundary", "ngStyle"], ["id", "dragHandleButton", "cdkDragHandle", ""], [2, "height", "40px"], ["d", "M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"], ["d", "M0 0h24v24H0z", "fill", "none"], ["id", "floatingChatButtons", 1, "ChatButtons"], [1, "leftArrowButton", 3, "click"], [1, "downArrowButton", 3, "click"], [1, "sizeButtons"], ["id", "minusButton", 3, "click"], ["width", "22", "height", "22", "viewBox", "0 0 50 50", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M 38.999, 7 H 11 c -2.25, 0, -4, 1.75, -4, 4 v 27.999 C 7, 41.249, 8.75, 43, 11, 43 h 27.999 C 41.249, 43, 43, 41.249, 43, 38.999 V 11 C 43, 8.75,   41.249, 7,   38.999, 7 z", 2, "fill", "white", "stroke", "#1A3763", "stroke-width", "5", "opacity", "0.5"], ["opacity", "0.5", "fill", "#1A3763", "d", "M 14.999,26.999 V 23 h 20.002 v 3.999 H 14.999 z"], ["id", "plusButton", 3, "click"], ["opacity", "0.5", "fill", "#1A3763", "d", "M 35.001, 26.999 H 27 V 35 h -3.999 v -8.001  h -8.002 V 23 h 8.002 v -8 H 27 v 8 h 8.001 V 26.999 z"], ["id", "floatingChatBoxPanel"]],
      template: function ChatComponentFloat_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(2, "svg", 2);
          core /* ɵɵelement */.nrm(3, "path", 3)(4, "path", 4);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(5, "div", 5)(6, "a", 6);
          core /* ɵɵlistener */.bIt("click", function ChatComponentFloat_Template_a_click_6_listener() {
            return ctx.main.toggleChatPosition();
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "a", 7);
          core /* ɵɵlistener */.bIt("click", function ChatComponentFloat_Template_a_click_7_listener() {
            return (ctx.initRappid.showChatPanel = false) && (ctx.initRappid.ChatIsFloating = false);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(8, "div", 8)(9, "a", 9);
          core /* ɵɵlistener */.bIt("click", function ChatComponentFloat_Template_a_click_9_listener() {
            return ctx.resizeFloatingChat("floatingChat", false);
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(10, "svg", 10);
          core /* ɵɵelement */.nrm(11, "path", 11)(12, "path", 12);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(13, "a", 13);
          core /* ɵɵlistener */.bIt("click", function ChatComponentFloat_Template_a_click_13_listener() {
            return ctx.resizeFloatingChat("floatingChat", true);
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(14, "svg", 10);
          core /* ɵɵelement */.nrm(15, "path", 11)(16, "path", 14);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelement */.nrm(17, "div", 15);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵstyleProp */.xc7("visibility", ctx.initRappid.ChatIsFloating && ctx.initRappid.showChatPanel ? "visible" : "hidden");
          core /* ɵɵproperty */.Y8G("cdkDragBoundary", ".sd-content")("ngStyle", core /* ɵɵpureFunction2 */.l_i(4, c0, ctx.floatingChatBoxSize + "px", ctx.floatingChatBoxSize + "px"));
        }
      },
      dependencies: [NgStyle, CdkDrag, CdkDragHandle],
      styles: ["#floatingChatBox[_ngcontent-%COMP%]{padding-top:30px;box-sizing:border-box;border:solid 1px #ccc;color:#000000de;background:#fff;border-radius:4px;position:absolute;z-index:200;transition:box-shadow .2s cubic-bezier(0,0,.2,1);box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}#floatingChatBox[_ngcontent-%COMP%]:active{box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f}#dragHandleButton[_ngcontent-%COMP%]{opacity:.4;fill:#1a3763;position:absolute;top:4px;left:5px;cursor:move;width:24px;height:24px}#floatingChatButtons[_ngcontent-%COMP%]{position:absolute;top:8px;right:5px}.sizeButtons[_ngcontent-%COMP%]{position:absolute;top:6px;right:38px;z-index:201}"]
    }))();
  }
  return ChatComponentFloat;
})();