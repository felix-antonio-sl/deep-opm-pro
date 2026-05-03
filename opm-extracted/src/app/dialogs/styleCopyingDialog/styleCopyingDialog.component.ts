// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/styleCopyingDialog/styleCopyingDialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * The 'StyleCopyingDialogComponent' class is the class of the dialog that the user opens when he clicks on Ctrl+Shift+C.
*/
let StyleCopyingDialogComponent = /*#__PURE__*/(() => {
  class StyleCopyingDialogComponent {
    constructor(dialogRef, initRappid, data) {
      this.dialogRef = dialogRef;
      this.initRappid = initRappid;
      this.data = data;
      this.selectedElement = initRappid.selectedElement;
      this.isRightClick = this.data.isRightClick;
    }
    /**
     * uncheckAll function enables the user to "clean" all elements that are chosen in the dialog.
     */
    uncheckAll() {
      $("input[type=\"checkbox\"]:checked").prop("checked", false);
    }
    checkAll() {
      $("input[type=\"checkbox\"]").prop("checked", true);
    }
    /**
     * 'apply()' function is called when the user clicks on the 'Submit' button.
     * In this function we keep the style of the selected element in a dictionary named 'copiedStyleParams'.
     * We keep only the style elements that were marked as "checked" in the dialog.
     */
    apply() {
      const dict = {};
      const borderColor = $("#border_color")[0].checked;
      const fontSize = $("#font_size")[0].checked;
      const fillColor = $("#fill_color")[0].checked;
      const font = $("#font")[0].checked;
      const textColor = $("#text_color")[0].checked;
      dict.isRightClick = this.isRightClick;
      if (borderColor) {
        dict.borderColor = this.selectedElement.getVisual().strokeColor;
      }
      if (fontSize) {
        dict.fontSize = this.selectedElement.getVisual().textFontSize;
      }
      if (fillColor) {
        dict.fillColor = this.selectedElement.getVisual().fill;
      }
      if (textColor) {
        dict.textColor = this.selectedElement.getVisual().textColor;
      }
      if (font) {
        dict.font = this.selectedElement.getVisual().textFontFamily;
      }
      this.initRappid.copiedStyleParams = dict;
    }
    toggleAll($event) {
      if ($event.target.checked === true) {
        return this.checkAll();
      }
      return this.uncheckAll();
    }
    static #_ = (() => this.ɵfac = function StyleCopyingDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || StyleCopyingDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: StyleCopyingDialogComponent,
      selectors: [["styleCopyingDialog"]],
      decls: 36,
      vars: 0,
      consts: [[2, "text-align", "center"], ["id", "toggleAllInput", "type", "checkbox", "checked", "", 3, "change"], [2, "margin-left", "10px", "margin-top", "20px"], ["type", "checkbox", "id", "font_size", "name", "font_size", "value", "font_size", "checked", ""], ["for", "font_size"], ["type", "checkbox", "id", "font", "name", "font", "value", "font", "checked", ""], ["for", "font"], ["type", "checkbox", "id", "text_color", "name", "text_color", "value", "text_color", "checked", ""], ["for", "text_color"], ["type", "checkbox", "id", "border_color", "name", "border_color", "value", "border_color", "checked", ""], ["type", "checkbox", "id", "fill_color", "name", "fill_color", "value", "fill_color", "checked", ""], ["for", "fill_color"], [2, "width", "300px", "margin-top", "30px"], ["mat-button", "", "id", "submitBtn", 3, "click"], ["mat-button", "", "id", "closeBtn", 3, "click"]],
      template: function StyleCopyingDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "h4", 0);
          core /* ɵɵtext */.EFF(2, "Choose Which Style Elements To Copy");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "input", 1);
          core /* ɵɵlistener */.bIt("change", function StyleCopyingDialogComponent_Template_input_change_3_listener($event) {
            return ctx.toggleAll($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(4, "Select / Unselect All ");
          core /* ɵɵelementStart */.j41(5, "form", 2);
          core /* ɵɵelement */.nrm(6, "input", 3);
          core /* ɵɵelementStart */.j41(7, "label", 4);
          core /* ɵɵtext */.EFF(8, " Font Size ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(9, "br")(10, "br")(11, "input", 5);
          core /* ɵɵelementStart */.j41(12, "label", 6);
          core /* ɵɵtext */.EFF(13, " Font ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(14, "br")(15, "br")(16, "input", 7);
          core /* ɵɵelementStart */.j41(17, "label", 8);
          core /* ɵɵtext */.EFF(18, " Text Color ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(19, "br")(20, "br")(21, "input", 9);
          core /* ɵɵelementStart */.j41(22, "label", 8);
          core /* ɵɵtext */.EFF(23, " Border Color ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(24, "br")(25, "br")(26, "input", 10);
          core /* ɵɵelementStart */.j41(27, "label", 11);
          core /* ɵɵtext */.EFF(28, " Fill Color ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(29, "br")(30, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "div", 12)(32, "button", 13);
          core /* ɵɵlistener */.bIt("click", function StyleCopyingDialogComponent_Template_button_click_32_listener() {
            ctx.dialogRef.close();
            return ctx.apply();
          });
          core /* ɵɵtext */.EFF(33, "Apply");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "button", 14);
          core /* ɵɵlistener */.bIt("click", function StyleCopyingDialogComponent_Template_button_click_34_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(35, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
      },
      dependencies: [MatButton, fesm2022_forms /* ɵNgNoValidate */.qT, NgControlStatusGroup, NgForm],
      styles: ["#closeBtn[_ngcontent-%COMP%]{position:relative;margin-left:25px;width:100px;color:#036;opacity:100%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;border-color:#036;background-color:#fbfbfb;height:36px}#submitBtn[_ngcontent-%COMP%]{position:relative;margin-left:40px;width:100px;color:#036;opacity:100%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;border-color:#036;background-color:#fbfbfb;height:36px}"]
    }))();
  }
  return StyleCopyingDialogComponent;
})();