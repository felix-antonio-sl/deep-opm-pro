// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/genAI-computational-editor-dialog/genAI-computational-editor-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function GenAIComputationalEditorDialog_option_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const name_r1 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(name_r1);
  }
}
let GenAIComputationalEditorDialog = /*#__PURE__*/(() => {
  class GenAIComputationalEditorDialog {
    constructor(dialogRef, userSer, _dialog, data) {
      this.dialogRef = dialogRef;
      this.userSer = userSer;
      this._dialog = _dialog;
      this.data = data;
      this.spinnerFlag = true;
      this.userService = userSer;
      this.userService.user$.subscribe(user => this.currentUser = user);
      if (!this.userService.isGenAIUser(this.currentUser)) {
        _dialog.open(ConfirmDialogDialogComponent, {
          height: "300px",
          width: "430px",
          data: {
            message: "Unlock Advanced Generative AI Features!\n\nTake your work to the next level with OPL summary generation, impact analysis, modeling insights, enhanced coding, and even natural language-based calculations.\n\nInterested in upgrading?\nContact us at <a href=\"mailto:contact@opcloud.tech\">contact@opcloud.tech</a> for more details.",
            okName: "Got it!",
            okColor: "#1a3763",
            centerText: true,
            closeFlag: true
          }
        });
        this.dialogRef.close();
        return;
      }
      this.init = data.initRappid;
      this.theme = "vs";
      this.codeModel = {
        language: "plaintext",
        uri: "main.json",
        value: this.data.code,
        dependencies: []
      };
      this.runLocally = data.executionLocation === "local";
      this.options = {
        contextmenu: true,
        colorDecorators: true,
        minimap: {
          enabled: true
        }
      };
      this.monaco = window.monaco;
      this.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        diagnosticCodesToIgnore: [1108, 2304, 7027]
      });
      this.getExtraData();
    }
    changeTheme($event) {
      const value = $event.target.value;
      if (value === "VS Dark") {
        return this.defaultTheme();
      } else {
        this.monaco.editor.setTheme(value);
      }
      this.init.updateDB({
        codeEditorTheme: value
      });
    }
    loadThemes() {
      var _this = this;
      return (0, default)(function* () {
        $("#codeEditor").css({
          opacity: "0"
        });
        _this.themes = ["Active4D", "Merbivore", "Solarized-light", "Tomorrow", "krTheme", "Clouds", "GitHub", "SpaceCadet", "Twilight", "monoindustrial", "Amy", "Cobalt", "IDLE", "Monokai", "Sunburst", "Dawn", "Katzenmilch", "Blackboard", "Tomorrow-Night-Blue", "Dracula", "LAZY", "Tomorrow-Night-Bright", "Zenburnesque", "Dreamweaver", "Tomorrow-Night-Eighties", "iPlastic", "Eiffel", "Solarized-dark", "Tomorrow-Night", "idleFingers"];
        for (const name of _this.themes) {
          const data = yield fetch("./assets/codeEditorThemes/" + name + ".json");
          const jsn = yield data.json();
          _this.monaco.editor.defineTheme(name, jsn);
        }
        _this.themes.push("VS Dark");
        const userChoice = _this.init.oplService.settings.codeEditorTheme;
        if (userChoice && _this.themes.includes(userChoice)) {
          _this.monaco.editor.setTheme(userChoice);
          $("#themeSelect")[0].selectedIndex = _this.themes.indexOf(userChoice);
        } else {
          _this.monaco.editor.setTheme("Active4D");
        }
        $("#codeEditor").css({
          opacity: "1"
        });
        _this.spinnerFlag = false;
      })();
    }
    ngAfterViewInit() {
      if (!this.userService.isGenAIUser(this.currentUser)) {
        this.dialogRef.close();
        return;
      }
      $(".mat-mdc-dialog-container").css({
        "background-color": "rgba(255,255,255,0)",
        padding: "0px",
        "box-shadow": "none"
      });
      this.loadThemes();
    }
    defaultTheme() {
      this.monaco.editor.setTheme("vs-dark");
    }
    onCodeChanged() {}
    update() {
      const val = this.codeModel.value;
      return this.dialogRef.close({
        code: val.split("-----#\n\n")[1]
      });
    }
    cancel() {
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
      const rect = $(".mat-mdc-dialog-container")[0].getClientRects()[0];
      if (rect && (rect.x - 20 > window.innerWidth || rect.y - 20 > window.innerHeight)) {
        this.dialogRef.updatePosition({
          left: "100px",
          top: "100px"
        });
      }
    }
    moveDrag(event) {
      const rect = $(".mat-mdc-dialog-container")[0].getClientRects()[0];
      const left = Math.max(0, rect.left + event.movementX) + "px";
      const top = Math.max(0, rect.top + event.movementY) + "px";
      this.dialogRef.updatePosition({
        left: left,
        top: top
      });
    }
    getExtraData() {
      const globalRunTimeEnvironment = {
        objects: new Map(),
        alreadyRanLinks: [],
        processesToIgnore: []
      };
      const visual = this.data.visual;
      const model = visual.logicalElement.opmModel;
      const opd = model.getOpdByThingId(visual.id);
      const valuesArray = [];
      const pathsCalculator = new PathsFromObjectsToProcessCalculator(opd, visual, model, code.GenAI, globalRunTimeEnvironment);
      const all_paths = pathsCalculator.calculate(opd, valuesArray);
      const all_variables_str = [];
      const non_legal_variables_str = [];
      const alias = [];
      const vc = new VariablesCalculator(all_paths, valuesArray);
      const executor = new GenAIFunctionExecutor(model, visual);
      const function_variables = vc.calc_variables_str(all_variables_str, code.GenAI, non_legal_variables_str, alias);
      const functionContent = executor.replaceVariables("", all_variables_str, non_legal_variables_str);
      let functionInput = function_variables + "\n" + functionContent;
      let aliasArr = "";
      for (const item of alias) {
        delete item.lid;
      }
      if (alias.length > 0) {
        aliasArr = "aliasArr = " + JSON.stringify(alias, null, 2);
        let count = 0;
        aliasArr = aliasArr.replace(/{/g, function () {
          count++;
          return count + ":{";
        });
        aliasArr = aliasArr.replace("[", "{");
        aliasArr = aliasArr.replace("]", "}");
      }
      functionInput = aliasArr + "\n" + functionInput;
      const warning = "\n\n#--------Don't edit or change the lines above here. These are runtime variables that will be updated with real values on execution-------#\n\n";
      this.codeModel.value = functionInput.replaceAll(";", "\n") + warning + this.codeModel.value;
    }
    static #_ = (() => this.ɵfac = function GenAIComputationalEditorDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GenAIComputationalEditorDialog)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: GenAIComputationalEditorDialog,
      selectors: [["genAI-computational-editor-dialog"]],
      decls: 16,
      vars: 5,
      consts: [["id", "codeEditor", 1, "codeEditor", 2, "height", "100%", "overflow", "hidden"], ["draggable", "true", 2, "height", "32px", "width", "100%", "background-color", "#4a4f55", 3, "dragstart"], ["mat-button", "", 1, "codeEditorBtn", 3, "click"], [2, "color", "white", "font-weight", "300", "margin-left", "80px"], [2, "float", "right", "margin-top", "6px", "margin-right", "10px"], [2, "color", "white", "font-weight", "300", "margin-right", "4px"], ["id", "themeSelect", 3, "change"], [4, "ngFor", "ngForOf"], [2, "width", "100%", "height", "100%", 3, "valueChanged", "theme", "codeModel", "options"], [2, "position", "absolute", "left", "calc(50% - 58px)", "top", "calc(50% - 58px)", 3, "hidden"]],
      template: function GenAIComputationalEditorDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
          core /* ɵɵlistener */.bIt("dragstart", function GenAIComputationalEditorDialog_Template_div_dragstart_1_listener($event) {
            return ctx.onStartDrag($event);
          });
          core /* ɵɵelementStart */.j41(2, "button", 2);
          core /* ɵɵlistener */.bIt("click", function GenAIComputationalEditorDialog_Template_button_click_2_listener() {
            return ctx.update();
          });
          core /* ɵɵtext */.EFF(3, "Update");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "button", 2);
          core /* ɵɵlistener */.bIt("click", function GenAIComputationalEditorDialog_Template_button_click_4_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(5, "Cancel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "span", 3);
          core /* ɵɵtext */.EFF(7, "Gen AI Computational");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "div", 4)(9, "span", 5);
          core /* ɵɵtext */.EFF(10, "Theme:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "select", 6);
          core /* ɵɵlistener */.bIt("change", function GenAIComputationalEditorDialog_Template_select_change_11_listener($event) {
            return ctx.changeTheme($event);
          });
          core /* ɵɵtemplate */.DNE(12, GenAIComputationalEditorDialog_option_12_Template, 2, 1, "option", 7);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(13, "ngs-code-editor", 8);
          core /* ɵɵlistener */.bIt("valueChanged", function GenAIComputationalEditorDialog_Template_ngs_code_editor_valueChanged_13_listener() {
            return ctx.onCodeChanged();
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(14, "div", 9);
          core /* ɵɵelement */.nrm(15, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.themes);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("theme", ctx.theme)("codeModel", ctx.codeModel)("options", ctx.options);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
        }
      },
      dependencies: [NgForOf, MatButton, ProgressSpinner, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, CodeEditorComponent],
      styles: ["mat-mdc-dialog-container[_ngcontent-%COMP%]{background-color:#3e434b!important}.codeEditorBtn[_ngcontent-%COMP%]{color:#fff;font-weight:300!important;letter-spacing:normal}"]
    }))();
  }
  return GenAIComputationalEditorDialog;
})();