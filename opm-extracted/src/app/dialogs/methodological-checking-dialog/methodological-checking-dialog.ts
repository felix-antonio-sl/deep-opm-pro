// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/methodological-checking-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function MethodologicalCheckingDialog_div_11__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 19);
    core /* ɵɵelement */.nrm(1, "circle", 20);
    core /* ɵɵelementEnd */.k0s();
  }
}
function MethodologicalCheckingDialog_div_11__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 21);
    core /* ɵɵelement */.nrm(1, "circle", 22);
    core /* ɵɵelementEnd */.k0s();
  }
}
function MethodologicalCheckingDialog_div_11__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 23);
    core /* ɵɵelement */.nrm(1, "circle", 24);
    core /* ɵɵelementEnd */.k0s();
  }
}
function MethodologicalCheckingDialog_div_11_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 25);
    core /* ɵɵlistener */.bIt("click", function MethodologicalCheckingDialog_div_11_button_7_Template_button_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.getCheckerDetails($event, item_r2));
    });
    core /* ɵɵtext */.EFF(1, "Details");
    core /* ɵɵelementEnd */.k0s();
  }
}
function MethodologicalCheckingDialog_div_11_hr_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "hr");
  }
}
function MethodologicalCheckingDialog_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 12);
    core /* ɵɵlistener */.bIt("click", function MethodologicalCheckingDialog_div_11_Template_div_click_1_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      return core /* ɵɵresetView */.Njj(item_r2.check());
    });
    core /* ɵɵtemplate */.DNE(2, MethodologicalCheckingDialog_div_11__svg_svg_2_Template, 2, 0, "svg", 13)(3, MethodologicalCheckingDialog_div_11__svg_svg_3_Template, 2, 0, "svg", 14)(4, MethodologicalCheckingDialog_div_11__svg_svg_4_Template, 2, 0, "svg", 15);
    core /* ɵɵelementStart */.j41(5, "span", 16);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(7, MethodologicalCheckingDialog_div_11_button_7_Template, 2, 0, "button", 17);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(8, MethodologicalCheckingDialog_div_11_hr_8_Template, 1, 0, "hr", 18);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const i_r5 = ctx.index;
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", item_r2.status === 1);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", item_r2.status === 2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", item_r2.status === 3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", item_r2.getDescriptionTooltip());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(item_r2.title);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", item_r2.status === 2);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", i_r5 !== ctx_r3.checkers.length - 1);
  }
}
let MethodologicalCheckingDialog = /*#__PURE__*/(() => {
  class MethodologicalCheckingDialog {
    constructor(init, dialogRef, data) {
      this.init = init;
      this.dialogRef = dialogRef;
      this.data = data;
      this.checkers = [new IngProcessesNamesChecker(this.init.opmModel), new ObjectNameAsSingularChecker(this.init.opmModel), new PartUnfoldContentChecker(this.init.opmModel), new InzoomedContentChecker(this.init.opmModel), new TransformingProcessChecker(this.init.opmModel), new SystemicProcessesMainFunctionChecker(this.init.opmModel)];
    }
    ngOnInit() {
      this.checkAll();
    }
    checkAll() {
      for (const item of this.checkers) {
        item.check();
      }
    }
    getCheckerDetails(event, item) {
      event.stopPropagation();
      const data = {
        allEntities: item.getInvalidThings(),
        allowMultipleDialogs: true,
        title: "Invalid Things",
        subtitle: item.getInvalidThingsDetailsSubtitle()
      };
      const that = this;
      this.init.dialogService.openDialog(SearchItemsDialogComponent, 580, 600, data).afterClosed().toPromise().then(val => {
        if (val === "goToOPD") {
          that.dialogRef.close();
        }
      });
    }
    onStartDrag(event) {
      event.preventDefault();
      const that = this;
      window.onmousemove = function (e) {
        that.moveDrag(e);
      };
      window.onmouseup = function (e) {
        that.endDrag(e);
      };
    }
    endDrag(event) {
      window.onmousemove = function (e) {};
      window.onmouseup = function (e) {};
    }
    moveDrag(event) {
      const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      const rect = $(".mat-mdc-dialog-container")[0].parentElement.getClientRects()[0];
      const moveBtnRects = $(".move-button")[0].getClientRects()[0];
      const dx = moveBtnRects.left - rect.left + moveBtnRects.width / 2;
      const dy = moveBtnRects.top - rect.top + moveBtnRects.height / 2;
      this.dialogRef.updatePosition({
        left: event.clientX - dx + "px",
        top: event.clientY - dy + scrollTop + "px"
      });
    }
    static #_ = (() => this.ɵfac = function MethodologicalCheckingDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MethodologicalCheckingDialog)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MethodologicalCheckingDialog,
      selectors: [["methodological-checking-dialog"]],
      decls: 15,
      vars: 1,
      consts: [[1, "methodologicalCheckingMain"], ["draggable", "true", 1, "move-button", 2, "margin-top", "-9px", "float", "right", "position", "relative", "z-index", "999", 3, "dragstart"], ["width", "18", "height", "20", "viewBox", "0 0 22 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.8936 10.3536C21.0888 10.1583 21.0888 9.84171 20.8936 9.64645L17.7116 6.46447C17.5163 6.2692 17.1997 6.2692 17.0045 6.46447C16.8092 6.65973 16.8092 6.97631 17.0045 7.17157L19.8329 10L17.0045 12.8284C16.8092 13.0237 16.8092 13.3403 17.0045 13.5355C17.1997 13.7308 17.5163 13.7308 17.7116 13.5355L20.8936 10.3536ZM12 10.5H20.54V9.5H12V10.5Z", "fill", "#586D8C"], ["d", "M1.09554 9.64645C0.900274 9.84171 0.900274 10.1583 1.09554 10.3536L4.27752 13.5355C4.47278 13.7308 4.78936 13.7308 4.98462 13.5355C5.17989 13.3403 5.17989 13.0237 4.98462 12.8284L2.1562 10L4.98462 7.17157C5.17989 6.97631 5.17989 6.65973 4.98462 6.46447C4.78936 6.2692 4.47278 6.2692 4.27752 6.46447L1.09554 9.64645ZM12 9.5L1.44909 9.5V10.5L12 10.5V9.5Z", "fill", "#586D8C"], ["d", "M11.3536 0.191901C11.1583 -0.00336151 10.8417 -0.00336151 10.6464 0.191901L7.46447 3.37388C7.2692 3.56914 7.2692 3.88573 7.46447 4.08099C7.65973 4.27625 7.97631 4.27625 8.17157 4.08099L11 1.25256L13.8284 4.08099C14.0237 4.27625 14.3403 4.27625 14.5355 4.08099C14.7308 3.88573 14.7308 3.56914 14.5355 3.37388L11.3536 0.191901ZM11.5 10V0.545454H10.5V10H11.5Z", "fill", "#586D8C"], ["d", "M10.6464 19.8081C10.8417 20.0034 11.1583 20.0034 11.3536 19.8081L14.5355 16.6261C14.7308 16.4309 14.7308 16.1143 14.5355 15.919C14.3403 15.7237 14.0237 15.7237 13.8284 15.919L11 18.7474L8.17157 15.919C7.97631 15.7237 7.65973 15.7237 7.46447 15.919C7.2692 16.1143 7.2692 16.4309 7.46447 16.6261L10.6464 19.8081ZM10.5 10V19.4545H11.5V10H10.5Z", "fill", "#586D8C"], [1, "methodologicalCheckingTitle"], [1, "methodologicalCheckingContent"], [4, "ngFor", "ngForOf"], [1, "buttons"], ["mat-button", "", "id", "closeButton", 1, "methodologicalCheckingButton", 3, "click"], [1, "methodologicalCheckingContentItem", 3, "click"], ["class", "statusIndicator", "matTooltip", "The validation wasn't performed", "width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["class", "statusIndicator", "matTooltip", "Invalid", "width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["class", "statusIndicator", "matTooltip", "Valid", "width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [2, "float", "left", 3, "matTooltip"], ["class", "methodologicalCheckingButton", "mat-button", "", 3, "click", 4, "ngIf"], [4, "ngIf"], ["matTooltip", "The validation wasn't performed", "width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "statusIndicator"], ["cx", "5", "cy", "5", "r", "5", "fill", "#969696"], ["matTooltip", "Invalid", "width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "statusIndicator"], ["cx", "5", "cy", "5", "r", "5", "fill", "#E40000"], ["matTooltip", "Valid", "width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "statusIndicator"], ["cx", "5", "cy", "5", "r", "5", "fill", "#30B82D"], ["mat-button", "", 1, "methodologicalCheckingButton", 3, "click"]],
      template: function MethodologicalCheckingDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
          core /* ɵɵlistener */.bIt("dragstart", function MethodologicalCheckingDialog_Template_div_dragstart_1_listener($event) {
            return ctx.onStartDrag($event);
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(2, "svg", 2);
          core /* ɵɵelement */.nrm(3, "path", 3)(4, "path", 4)(5, "path", 5)(6, "path", 6);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(7, "p", 7);
          core /* ɵɵtext */.EFF(8, "Methodological Checking");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(9, "br");
          core /* ɵɵelementStart */.j41(10, "div", 8);
          core /* ɵɵtemplate */.DNE(11, MethodologicalCheckingDialog_div_11_Template, 9, 7, "div", 9);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "div", 10)(13, "button", 11);
          core /* ɵɵlistener */.bIt("click", function MethodologicalCheckingDialog_Template_button_click_13_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(14, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.checkers);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatButton],
      styles: [".methodologicalCheckingMain[_ngcontent-%COMP%]   .move-button[_ngcontent-%COMP%]{cursor:move;margin-left:483px;margin-top:-22px;font-size:22px}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingTitle[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-top:3px}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingContent[_ngcontent-%COMP%]{text-align:center;height:340px;overflow:auto}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingContent[_ngcontent-%COMP%]   .methodologicalCheckingContentItem[_ngcontent-%COMP%]{display:inline-block;width:100%;height:30px}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingContent[_ngcontent-%COMP%]   .methodologicalCheckingContentItem[_ngcontent-%COMP%]   .statusIndicator[_ngcontent-%COMP%]{width:30px;float:left;margin-top:4px}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingContent[_ngcontent-%COMP%]   .methodologicalCheckingContentItem[_ngcontent-%COMP%]   .mat-tooltip[_ngcontent-%COMP%]{white-space:pre-line!important}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingContent[_ngcontent-%COMP%]   .methodologicalCheckingContentItem[_ngcontent-%COMP%]   .methodologicalCheckingButton[_ngcontent-%COMP%]{float:right;margin-top:-6px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;padding:5px}.methodologicalCheckingMain[_ngcontent-%COMP%]   .methodologicalCheckingContent[_ngcontent-%COMP%]   .methodologicalCheckingContentItem[_ngcontent-%COMP%]   .methodologicalCheckingButton[_ngcontent-%COMP%]   .mat-mdc-button[_ngcontent-%COMP%]:not(:disabled){color:#1a3763}.methodologicalCheckingMain[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]{padding-top:10px;text-align:center}.methodologicalCheckingMain[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .methodologicalCheckingButton[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;padding:5px;margin:5px}.methodologicalCheckingMain[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .methodologicalCheckingButton[_ngcontent-%COMP%]   .mat-mdc-button[_ngcontent-%COMP%]:not(:disabled){color:#1a3763}hr[_ngcontent-%COMP%]{margin-top:-2px}"]
    }))();
  }
  return MethodologicalCheckingDialog;
})();