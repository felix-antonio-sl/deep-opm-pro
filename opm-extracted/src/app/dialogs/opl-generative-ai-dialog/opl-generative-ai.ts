// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opl-generative-ai-dialog/opl-generative-ai.ts
// Extracted by opm-extracted/tools/extract.mjs

function OPLGenerativeAIDialogComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 10);
    core /* ɵɵelement */.nrm(1, "div", 11)(2, "div", 12)(3, "div", 13)(4, "div", 14)(5, "div", 15)(6, "div", 16)(7, "div", 17)(8, "div", 18)(9, "div", 19);
    core /* ɵɵelementEnd */.k0s();
  }
}
let OPLGenerativeAIDialogComponent = /*#__PURE__*/(() => {
  class OPLGenerativeAIDialogComponent {
    constructor(dialogRef, exportOPLService, userService, initRappidService, data) {
      this.dialogRef = dialogRef;
      this.exportOPLService = exportOPLService;
      this.userService = userService;
      this.initRappidService = initRappidService;
      this.type = data.type;
    }
    ngOnInit() {
      this.waiting = false;
      this.loggedUser = this.userService.user?.userData;
      if (this.type === "model") {
        this.title = "AI OPM Model Documentation and Summarization";
      } else {
        this.title = "Generating a summary of this diagram from the OPD's formal OPL";
      }
      this.response = "Generating a readable OPL from the formal OPL by Gemini AI";
      this.tooltip = "Note: This action may take time and incur computational costs.";
    }
    generativeOPLByAI() {
      var _this = this;
      return (0, default)(function* () {
        _this.waiting = true;
        try {
          let oplText;
          if (_this.type === "model") {
            const params = [_this.initRappidService.opmModel.name, false, null, false];
            oplText = yield _this.exportOPLService.exportOPL(params);
          } else {
            oplText = $(".opl-container")[0].innerText;
          }
          const AIopl = yield _this.userService.getOPLGenAI(_this.loggedUser.uid, oplText);
          _this.response = AIopl;
        } catch (e) {
          _this.response = "We encountered an error: " + (0, httpErrorToMessage)(e);
          console.error(e);
        } finally {
          _this.waiting = false;
        }
      })();
    }
    copyGenAIText() {
      navigator.clipboard.writeText(this.response).then().catch(e => console.error(e));
      (0, validationAlert)("Generative AI text copied to clipboard", 2000, "warning");
    }
    static #_ = (() => this.ɵfac = function OPLGenerativeAIDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OPLGenerativeAIDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(ExportOPLAPIService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OPLGenerativeAIDialogComponent,
      selectors: [["opl-generative-ai-dialog"]],
      decls: 21,
      vars: 5,
      consts: [["mat-raised-button", "", "color", "primary", 2, "width", "50px", 3, "click", "matTooltip"], ["mat-raised-button", "", 2, "width", "50px", "margin-left", "25px", 3, "click"], ["matInput", "", "draggable", "false", 1, "GenAIText", 3, "ngModelChange", "ngModel", "disabled"], ["matTooltip", "Copy Gen AI Text To Clipboard", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "20", "height", "20", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectGPath"], ["opacity", "0.7"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M7 9.22222C7 7.99492 7.98969 7 9.21053 7H19.856C21.0768 7 22.0665 7.99492 22.0665 9.22222V18.5033C22.0665 19.7306 21.0768 20.7255 19.856 20.7255H9.21053C7.98969 20.7255 7 19.7306 7 18.5033V9.22222ZM19.856 9.22222L9.21053 9.22222V18.5033H19.856V9.22222Z", "fill", "#1A3763"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.4335 13.2745H25.7895C27.0103 13.2745 28 14.2694 28 15.4967V24.7778C28 26.0051 27.0103 27 25.7895 27H15.144C13.9232 27 12.9335 26.0051 12.9335 24.7778V21.7059H15.144V24.7778H25.7895V15.4967H23.4335V13.2745Z", "fill", "#1A3763"], ["id", "cubesSpinner", "class", "sk-cube-grid", "style", "width: 100px; position: fixed; top: calc(50% - 200px); height: 100px; left: calc(50%); pointer-events: none;", 4, "ngIf"], ["id", "cubesSpinner", 1, "sk-cube-grid", 2, "width", "100px", "position", "fixed", "top", "calc(50% - 200px)", "height", "100px", "left", "calc(50%)", "pointer-events", "none"], [1, "sk-cube", "sk-cube1"], [1, "sk-cube", "sk-cube2"], [1, "sk-cube", "sk-cube3"], [1, "sk-cube", "sk-cube4"], [1, "sk-cube", "sk-cube5"], [1, "sk-cube", "sk-cube6"], [1, "sk-cube", "sk-cube7"], [1, "sk-cube", "sk-cube8"], [1, "sk-cube", "sk-cube9"]],
      template: function OPLGenerativeAIDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "p");
          core /* ɵɵtext */.EFF(2, "GenerativeAI");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "p");
          core /* ɵɵtext */.EFF(4);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "p");
          core /* ɵɵtext */.EFF(6, " by Gemini AI ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "p")(8, "button", 0);
          core /* ɵɵlistener */.bIt("click", function OPLGenerativeAIDialogComponent_Template_button_click_8_listener() {
            return ctx.generativeOPLByAI();
          });
          core /* ɵɵtext */.EFF(9, "GO!");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "button", 1);
          core /* ɵɵlistener */.bIt("click", function OPLGenerativeAIDialogComponent_Template_button_click_10_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(11, "Close");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(12, "div")(13, "textarea", 2);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function OPLGenerativeAIDialogComponent_Template_textarea_ngModelChange_13_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.response, $event)) {
              ctx.response = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(14, "a", 3);
          core /* ɵɵlistener */.bIt("click", function OPLGenerativeAIDialogComponent_Template_a_click_14_listener() {
            return ctx.copyGenAIText();
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(15, "svg", 4);
          core /* ɵɵelement */.nrm(16, "rect", 5);
          core /* ɵɵelementStart */.j41(17, "g", 6);
          core /* ɵɵelement */.nrm(18, "path", 7)(19, "path", 8);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(20, OPLGenerativeAIDialogComponent_div_20_Template, 10, 0, "div", 9);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtextInterpolate1 */.SpI(" ", ctx.title, " ");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("matTooltip", ctx.tooltip);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.response);
          core /* ɵɵproperty */.Y8G("disabled", true);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.waiting);
        }
      },
      dependencies: [NgIf, MatInput, MatTooltip, MatButton, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".divs[_ngcontent-%COMP%]{position:relative;width:650px;left:50px;top:50px}p[_ngcontent-%COMP%]{text-align:center}.sk-cube-grid[_ngcontent-%COMP%]   .sk-cube[_ngcontent-%COMP%]{background-color:#1a376399}.GenAIText[_ngcontent-%COMP%]{min-width:500px;min-height:250px;color:#1a3661;overflow:auto;font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}"]
    }))();
  }
  return OPLGenerativeAIDialogComponent;
})();