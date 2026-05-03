// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function ExistingNameDialogComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 11)(1, "div", 19);
    core /* ɵɵlistener */.bIt("click", function ExistingNameDialogComponent_div_17_Template_div_click_1_listener() {
      const location_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.goToOpdById(location_r2.opdId));
    });
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const location_r2 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(location_r2.name);
  }
}
function ExistingNameDialogComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 20);
    core /* ɵɵtext */.EFF(1, " *If you want to use the existing one, you can grab it from the draggable things. ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ExistingNameDialogComponent_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 18);
    core /* ɵɵlistener */.bIt("click", function ExistingNameDialogComponent_button_20_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.useExistingElement());
    });
    core /* ɵɵtext */.EFF(1, "Use Existing Thing");
    core /* ɵɵelementEnd */.k0s();
  }
}
let ExistingNameDialogComponent = /*#__PURE__*/(() => {
  class ExistingNameDialogComponent {
    constructor(data, dialogRef, treeViewService) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.treeViewService = treeViewService;
      this.logical = data.logical;
      this.logicalToRename = data.logicalToRename;
      this.graphService = treeViewService.initRappid.graphService;
      const type = this.logical.constructor.name.replace("OpmLogical", "");
      const anOrA = type.startsWith("O") ? "An" : "A";
      this.title = anOrA + " " + type.toLowerCase() + " by the name " + this.logical.getBareName() + " already exists";
      this.setLocations();
      this.setShouldShowUseExisting();
    }
    setShouldShowUseExisting() {
      this.shouldShowUseExisting = true;
      const vis = this.logicalToRename.visualElements[0];
      const links = this.logicalToRename.visualElements.map(v => v.getAllLinks());
      if (links.some(item => item.inGoing.length > 0 || item.outGoing.length > 0)) {
        this.shouldShowUseExisting = false;
      } else if (this.logicalToRename.visualElements.find(v => v.fatherObject)) {
        this.shouldShowUseExisting = false;
      } else if (vis.getRefineeInzoom() || vis.getRefineeUnfold()) {
        this.shouldShowUseExisting = false;
      } else if (OPCloudUtils.isInstanceOfLogicalObject(this.logicalToRename) && this.logicalToRename.states.length > 0) {
        this.shouldShowUseExisting = false;
      }
    }
    setLocations() {
      this.locations = [];
      for (const vis of this.logical.visualElements) {
        const opd = this.logical.opmModel.getOpdByThingId(vis.id);
        this.locations.push({
          opd: opd,
          opdId: opd.id,
          name: opd.getNumberedName() + (opd.getName() === "SD" ? "" : ": " + opd.getName()),
          visId: vis.id
        });
      }
      const model = this.logical.opmModel;
      this.locations.sort((a, b) => {
        if (model.opds.indexOf(a.opd) > model.opds.indexOf(b.opd)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    goToOpdById(opdId) {
      this.treeViewService.initRappid.opdHierarchyRef.previousOpdId = this.logical.opmModel.currentOpd.id;
      const opd = this.logical.opmModel.getOpd(opdId);
      if (opd) {
        this.graphService.renderGraph(opd, this.treeViewService.initRappid, this.logical);
      }
      this.dialogRef.close();
    }
    onStartDrag(event) {
      if (event.touches) {
        return;
      }
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
      this.dialogRef.updatePosition({
        left: event.clientX - 560 + "px",
        top: event.clientY - 35 + scrollTop + "px"
      });
    }
    renameCurrentElement() {
      this.dialogRef.close({
        action: "rename"
      });
    }
    useExistingElement() {
      this.dialogRef.close({
        action: "useExisting",
        existing: this.logical
      });
    }
    static #_ = (() => this.ɵfac = function ExistingNameDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ExistingNameDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(TreeViewService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ExistingNameDialogComponent,
      selectors: [["existing-name-dialog"]],
      decls: 25,
      vars: 4,
      consts: [["id", "content"], ["draggable", "true", 2, "text-align", "right", "top", "0px", "cursor", "move", 3, "dragstart"], ["width", "18", "height", "20", "viewBox", "0 0 22 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.8936 10.3536C21.0888 10.1583 21.0888 9.84171 20.8936 9.64645L17.7116 6.46447C17.5163 6.2692 17.1997 6.2692 17.0045 6.46447C16.8092 6.65973 16.8092 6.97631 17.0045 7.17157L19.8329 10L17.0045 12.8284C16.8092 13.0237 16.8092 13.3403 17.0045 13.5355C17.1997 13.7308 17.5163 13.7308 17.7116 13.5355L20.8936 10.3536ZM12 10.5H20.54V9.5H12V10.5Z", "fill", "#586D8C"], ["d", "M1.09554 9.64645C0.900274 9.84171 0.900274 10.1583 1.09554 10.3536L4.27752 13.5355C4.47278 13.7308 4.78936 13.7308 4.98462 13.5355C5.17989 13.3403 5.17989 13.0237 4.98462 12.8284L2.1562 10L4.98462 7.17157C5.17989 6.97631 5.17989 6.65973 4.98462 6.46447C4.78936 6.2692 4.47278 6.2692 4.27752 6.46447L1.09554 9.64645ZM12 9.5L1.44909 9.5V10.5L12 10.5V9.5Z", "fill", "#586D8C"], ["d", "M11.3536 0.191901C11.1583 -0.00336151 10.8417 -0.00336151 10.6464 0.191901L7.46447 3.37388C7.2692 3.56914 7.2692 3.88573 7.46447 4.08099C7.65973 4.27625 7.97631 4.27625 8.17157 4.08099L11 1.25256L13.8284 4.08099C14.0237 4.27625 14.3403 4.27625 14.5355 4.08099C14.7308 3.88573 14.7308 3.56914 14.5355 3.37388L11.3536 0.191901ZM11.5 10V0.545454H10.5V10H11.5Z", "fill", "#586D8C"], ["d", "M10.6464 19.8081C10.8417 20.0034 11.1583 20.0034 11.3536 19.8081L14.5355 16.6261C14.7308 16.4309 14.7308 16.1143 14.5355 15.919C14.3403 15.7237 14.0237 15.7237 13.8284 15.919L11 18.7474L8.17157 15.919C7.97631 15.7237 7.65973 15.7237 7.46447 15.919C7.2692 16.1143 7.2692 16.4309 7.46447 16.6261L10.6464 19.8081ZM10.5 10V19.4545H11.5V10H10.5Z", "fill", "#586D8C"], [1, "header"], ["id", "all_elements_holder"], [1, "divTable", "greyGridTable"], [1, "divTableHeading"], [1, "divTableRow"], [1, "divTableHead"], [1, "divTableBody"], ["class", "divTableRow", 4, "ngFor", "ngForOf"], ["style", "color: red; font-size: 15px;", 4, "ngIf"], [2, "width", "100%", "height", "100%", "margin-top", "10px", "display", "inline-flex", "justify-content", "center"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click"], [1, "divTableCell", 3, "click"], [2, "color", "red", "font-size", "15px"]],
      template: function ExistingNameDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
          core /* ɵɵlistener */.bIt("dragstart", function ExistingNameDialogComponent_Template_div_dragstart_1_listener($event) {
            return ctx.onStartDrag($event);
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(2, "svg", 2);
          core /* ɵɵelement */.nrm(3, "path", 3)(4, "path", 4)(5, "path", 5)(6, "path", 6);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(7, "h2", 7);
          core /* ɵɵtext */.EFF(8);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(9, "hr");
          core /* ɵɵelementStart */.j41(10, "div", 8)(11, "div", 9)(12, "div", 10)(13, "div", 11)(14, "div", 12);
          core /* ɵɵtext */.EFF(15, "Containing OPD");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(16, "div", 13);
          core /* ɵɵtemplate */.DNE(17, ExistingNameDialogComponent_div_17_Template, 3, 1, "div", 14);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(18, ExistingNameDialogComponent_div_18_Template, 2, 0, "div", 15);
          core /* ɵɵelementStart */.j41(19, "div", 16);
          core /* ɵɵtemplate */.DNE(20, ExistingNameDialogComponent_button_20_Template, 2, 0, "button", 17);
          core /* ɵɵelementStart */.j41(21, "button", 18);
          core /* ɵɵlistener */.bIt("click", function ExistingNameDialogComponent_Template_button_click_21_listener() {
            return ctx.renameCurrentElement();
          });
          core /* ɵɵtext */.EFF(22, "Rename Current Thing");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "button", 18);
          core /* ɵɵlistener */.bIt("click", function ExistingNameDialogComponent_Template_button_click_23_listener() {
            return ctx.dialogRef.close({
              action: "cancel"
            });
          });
          core /* ɵɵtext */.EFF(24, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtextInterpolate */.JRh(ctx.title);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.locations);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.shouldShowUseExisting);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowUseExisting);
        }
      },
      dependencies: [NgForOf, NgIf, MatButton],
      styles: ["div.greyGridTable[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:center;border-collapse:collapse}.header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:18px;font-weight:500;margin-bottom:40px}hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px;margin-top:-17px}#selectSearchDiv[_ngcontent-%COMP%]{position:relative;top:-21px}input[type=text][_ngcontent-%COMP%]{position:relative;left:135px;height:18px}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.35);border-radius:4px;width:129px;height:20px;display:inline-block}.searchDiv[_ngcontent-%COMP%]{display:inline-block;margin-left:-67px}.element_holder[_ngcontent-%COMP%]{width:100%}.inputText[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.inputText[_ngcontent-%COMP%]::placeholder{color:#1a3763;Opacity:70%}#all_elements_holder[_ngcontent-%COMP%]{height:300px;width:100%;overflow:overlay}.selectDiv[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;width:92%;outline:none;text-align-last:center;margin-left:0}#closeBtn[_ngcontent-%COMP%]{position:relative;left:223px;width:100px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%], .divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:1px solid #FFFFFF;padding:3px 4px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableBody[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:13px;line-height:26px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]:hover{background:#1a3763;color:#fff}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]{background:#fff;text-align:-webkit-left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:15px;font-weight:700;color:#1a3763;text-align:center}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]:first-child{border-left:none}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:700;color:#333;border-top:4px solid #333333}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.divTable[_ngcontent-%COMP%]{display:table}.divTableRow[_ngcontent-%COMP%]{display:table-row;border-bottom:4px solid #cccccc}.divTableCell[_ngcontent-%COMP%], .divTableHead[_ngcontent-%COMP%]{display:table-cell}.divTableHeading[_ngcontent-%COMP%]{display:table-header-group}.divTableFoot[_ngcontent-%COMP%]{display:table-footer-group}.divTableBody[_ngcontent-%COMP%]{display:table-row-group}"]
    }))();
  }
  return ExistingNameDialogComponent;
})();
