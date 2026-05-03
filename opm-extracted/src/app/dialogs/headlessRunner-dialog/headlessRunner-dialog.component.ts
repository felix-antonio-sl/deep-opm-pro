// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/headlessRunner-dialog/headlessRunner-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function HeadlessRunnerComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 7)(1, "mat-label", 8);
    core /* ɵɵtext */.EFF(2, "Running In Background");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(3, "div", 9);
    core /* ɵɵelementEnd */.k0s();
  }
}
function HeadlessRunnerComponent_div_3_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "mat-label", 12);
    core /* ɵɵtext */.EFF(2, "Running Stopped");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function HeadlessRunnerComponent_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "mat-label", 12);
    core /* ɵɵtext */.EFF(2, "Running Finished");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function HeadlessRunnerComponent_div_3_button_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "button", 13);
    core /* ɵɵtext */.EFF(1, " close ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    core /* ɵɵproperty */.Y8G("mat-dialog-close", true);
  }
}
function HeadlessRunnerComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, HeadlessRunnerComponent_div_3_div_1_Template, 3, 0, "div", 1)(2, HeadlessRunnerComponent_div_3_div_2_Template, 3, 0, "div", 1);
    core /* ɵɵelementStart */.j41(3, "span", 10);
    core /* ɵɵtemplate */.DNE(4, HeadlessRunnerComponent_div_3_button_4_Template, 2, 1, "button", 11);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.isStopped);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r0.isStopped);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r0.Executing && !ctx_r0.ExecutingPause);
  }
}
function HeadlessRunnerComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "mat-label", 14);
    core /* ɵɵtext */.EFF(2, "Running Paused");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function HeadlessRunnerComponent_a_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 15);
    core /* ɵɵlistener */.bIt("click", function HeadlessRunnerComponent_a_7_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.getSyncRunner());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 16);
    core /* ɵɵelement */.nrm(2, "path", 17)(3, "rect", 18);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function HeadlessRunnerComponent_a_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 19);
    core /* ɵɵlistener */.bIt("click", function HeadlessRunnerComponent_a_8_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.ExecutePause());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 20);
    core /* ɵɵelement */.nrm(2, "rect", 21)(3, "rect", 22)(4, "rect", 23);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function HeadlessRunnerComponent_a_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "a", 24);
    core /* ɵɵlistener */.bIt("click", function HeadlessRunnerComponent_a_9_Template_a_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.ExecuteStop());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 16);
    core /* ɵɵelement */.nrm(2, "rect", 25)(3, "rect", 18);
    core /* ɵɵelementEnd */.k0s()();
  }
}
let headlessRunner_dialog_component_valuesArray = new Array();
let HeadlessRunnerComponent = /*#__PURE__*/(() => {
  class HeadlessRunnerComponent {
    constructor(init, dialog) {
      this.init = init;
      this.dialog = dialog;
      this.elementDefault = {
        fontStyle: null,
        fontColor: null,
        fill: null,
        stroke: null,
        textSize: null
      };
    }
    get ExecuteMode() {
      return this.init.ExecuteMode;
    }
    set ExecutingPause(val) {
      this.init.ExecutingPause = val;
    }
    get ExecutingPause() {
      return this.init.ExecutingPause;
    }
    set Executing(val) {
      this.init.Executing = val;
    }
    get Executing() {
      return this.init.Executing;
    }
    ExecutePause() {
      this.init.elementToolbarReference.ExecutePause();
    }
    ExecuteStop() {
      this.isStopped = true;
      this.init.elementToolbarReference.ExecuteStop();
    }
    getSyncRunner() {
      this.init.elementToolbarReference.syncExecute(true);
    }
    static #_ = (() => this.ɵfac = function HeadlessRunnerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || HeadlessRunnerComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: HeadlessRunnerComponent,
      selectors: [["opcloud-headlessRunner-dialog"]],
      decls: 10,
      vars: 6,
      consts: [["class", "loading", 4, "ngIf"], [4, "ngIf"], ["id", "buttonsWrapper"], ["id", "stopAndPauseButtons"], ["class", "button", "id", "executionButton2", "matTooltip", "Execute", 3, "click", 4, "ngIf"], ["class", "button", "id", "pauseButton", "matTooltip", "Pause executing", 3, "click", 4, "ngIf"], ["class", "button", "id", "stopButton", "matTooltip", "Stop executing", 3, "click", 4, "ngIf"], [1, "loading"], ["id", "runningInBackground", 1, "runningStatusText"], [1, "dot-flashing"], ["id", "closeButton"], ["mat-button", "", "id", "closeButtonText", 3, "mat-dialog-close", 4, "ngIf"], [1, "runningStatusText"], ["mat-button", "", "id", "closeButtonText", 3, "mat-dialog-close"], ["id", "runningPaused", 1, "runningStatusText"], ["id", "executionButton2", "matTooltip", "Execute", 1, "button", 3, "click"], ["width", "36", "height", "35", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M26.3363 17.5538C27.2212 17.9935 27.2212 19.0766 26.3363 19.514L13.3014 25.9677C12.7256 26.2532 12 25.9009 12 25.3355V11.7335C12 11.1681 12.7256 10.8157 13.3014 11.1012L26.3363 17.5538Z", "fill", "rgb(90, 111, 143)"], ["width", "36", "height", "35", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09"], ["id", "pauseButton", "matTooltip", "Pause executing", 1, "button", 3, "click"], ["width", "35", "height", "35", "viewBox", "0 0 35 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "15", "height", "6", "rx", "1", "transform", "matrix(0 -1 -1 0 25 24)", "fill", "#5A6F8F"], ["width", "15", "height", "6", "rx", "1", "transform", "matrix(0 -1 -1 0 16 24)", "fill", "#5A6F8F"], ["width", "35", "height", "35", "rx", "6", "transform", "matrix(-1 0 0 1 35 0)", "fill", "#497284", "fill-opacity", "0.09"], ["id", "stopButton", "matTooltip", "Stop executing", 1, "button", 3, "click"], ["width", "15", "height", "15", "rx", "2", "transform", "matrix(-1 0 0 1 25 10)", "fill", "rgb(90, 111, 143)"]],
      template: function HeadlessRunnerComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div");
          core /* ɵɵtemplate */.DNE(1, HeadlessRunnerComponent_div_1_Template, 4, 0, "div", 0);
          core /* ɵɵelementStart */.j41(2, "div");
          core /* ɵɵtemplate */.DNE(3, HeadlessRunnerComponent_div_3_Template, 5, 3, "div", 1)(4, HeadlessRunnerComponent_div_4_Template, 3, 0, "div", 1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "div", 2)(6, "span", 3);
          core /* ɵɵtemplate */.DNE(7, HeadlessRunnerComponent_a_7_Template, 4, 0, "a", 4)(8, HeadlessRunnerComponent_a_8_Template, 5, 0, "a", 5)(9, HeadlessRunnerComponent_a_9_Template, 4, 0, "a", 6);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.Executing && !ctx.ExecutingPause);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.Executing && !ctx.ExecutingPause);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.Executing && ctx.ExecutingPause);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.ExecutingPause);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.Executing && !ctx.ExecutingPause);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.Executing || ctx.ExecutingPause);
        }
      },
      dependencies: [NgIf, MatDialogClose, MatLabel, MatTooltip, MatButton],
      styles: [".button[_ngcontent-%COMP%]{width:35px;height:35px;background:transparent;border:none;border-radius:4px;padding-right:2px;text-align:center;outline:none;margin-left:5px}.dialogButtons[_ngcontent-%COMP%]{position:relative}#closeButton[_ngcontent-%COMP%]{margin:auto;display:table;position:relative;top:15px}#closeButtonText[_ngcontent-%COMP%]{position:relative;margin-top:25px;color:#1a3763;font-weight:700}#buttonsWrapper[_ngcontent-%COMP%]{padding-top:7px;padding-left:2px;position:relative;top:38px}#stopAndPauseButtons[_ngcontent-%COMP%]{bottom:-29px;position:absolute;left:0;right:0;margin-left:auto;margin-right:auto;width:100px}.dot-flashing[_ngcontent-%COMP%]{left:72px;top:13px;position:relative;width:10px;height:10px;border-radius:5px;background-color:#1a3763;color:#1a3763;animation:_ngcontent-%COMP%_dotFlashing 1s infinite linear alternate;animation-delay:.5s}.dot-flashing[_ngcontent-%COMP%]:before, .dot-flashing[_ngcontent-%COMP%]:after{content:\"\";display:inline-block;position:absolute;top:0}.dot-flashing[_ngcontent-%COMP%]:before{left:-15px;width:10px;height:10px;border-radius:5px;background-color:#1a3763;color:#1a3763;animation:_ngcontent-%COMP%_dotFlashing 1s infinite alternate;animation-delay:0s}.dot-flashing[_ngcontent-%COMP%]:after{left:15px;width:10px;height:10px;border-radius:5px;background-color:#1a3763;color:#1a3763;animation:_ngcontent-%COMP%_dotFlashing 1s infinite alternate;animation-delay:1s}@keyframes _ngcontent-%COMP%_dotFlashing{0%{background-color:#1a3763}50%,to{background-color:#fff;stroke:#1a3763}}#RunningText[_ngcontent-%COMP%]{white-space:nowrap}.loading[_ngcontent-%COMP%]{margin:0 auto;display:table}.runningStatusText[_ngcontent-%COMP%]{display:table;margin:0 auto;position:relative;font-weight:600;color:#1a3763}#runningPaused[_ngcontent-%COMP%]{padding-bottom:9px}#runningInBackground[_ngcontent-%COMP%]{margin:0}#placeHolder[_ngcontent-%COMP%]{height:35px}"]
    }))();
  }
  return HeadlessRunnerComponent;
})();