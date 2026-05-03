// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/code-editor-dialog/code-editor-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function CodeEditorDialog_option_10_Template(rf, ctx) {
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
let CodeEditorDialog = /*#__PURE__*/(() => {
  class CodeEditorDialog {
    constructor(dialogRef, data) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.spinnerFlag = true;
      this.init = data.initRappid;
      this.theme = "vs";
      this.codeModel = {
        language: "javascript",
        uri: "main.json",
        value: this.data.code,
        dependencies: []
      };
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
      return this.dialogRef.close(val.split("\n\n/*-")[0]);
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
      // const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      // const top = Math.max(10, (event.clientY - 0 + scrollTop)) + 'px';
      // const left = (event.clientX - 0 - window.innerWidth / 2) + 'px';
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
      const pathsCalculator = new PathsFromObjectsToProcessCalculator(opd, visual, model, code.UserDefined, globalRunTimeEnvironment);
      const all_paths = pathsCalculator.calculate(opd, valuesArray);
      let all_variables_str = [];
      let non_legal_variables_str = [];
      let alias = [];
      const vc = new VariablesCalculator(all_paths, valuesArray);
      const userInputVar = "let userInput = undefined;";
      const executor = new UserDefinedFunctionExecutor(model, visual);
      const function_variables = vc.calc_variables_str(all_variables_str, code.UserDefined, non_legal_variables_str, alias);
      const functionContent = executor.replaceVariables("", all_variables_str, non_legal_variables_str);
      let functionInput = userInputVar + "\n" + function_variables + "\n" + functionContent;
      let aliasArr = "";
      for (const item of alias) {
        delete item.lid;
      }
      if (alias.length > 0) {
        aliasArr = "let aliasArr = " + JSON.stringify(alias, null, 2) + ";";
      }
      functionInput = aliasArr + functionInput;
      let updateValue = "/**\n* @param {string} alias\n* @param {string | number} value\n*/";
      updateValue += "\nfunction updateValue(alias, value) {}\n";
      let sqlQuerying = "/**\n* @param {string} query\n*/";
      sqlQuerying += "\nfunction sqlQuerying(query) {}\n";
      const warning = "\n\n/*--------Don't edit or change the lines below here. These are runtime variables that will be updated with real values on execution--------*/\n\n";
      this.codeModel.value = this.codeModel.value + warning + functionInput.replaceAll(";", ";\n") + updateValue + sqlQuerying;
    }
    static #_ = (() => this.ɵfac = function CodeEditorDialog_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CodeEditorDialog)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CodeEditorDialog,
      selectors: [["code-editor-dialog"]],
      decls: 14,
      vars: 5,
      consts: [["id", "codeEditor", 1, "codeEditor", 2, "height", "100%", "overflow", "hidden"], ["draggable", "true", 2, "height", "32px", "width", "100%", "background-color", "#4a4f55", 3, "dragstart"], ["mat-button", "", 1, "codeEditorBtn", 3, "click"], [2, "float", "right", "margin-top", "6px", "margin-right", "10px"], [2, "color", "white", "font-weight", "300", "margin-right", "4px"], ["id", "themeSelect", 3, "change"], [4, "ngFor", "ngForOf"], [2, "width", "100%", "height", "100%", 3, "valueChanged", "theme", "codeModel", "options"], [2, "position", "absolute", "left", "calc(50% - 58px)", "top", "calc(50% - 58px)", 3, "hidden"]],
      template: function CodeEditorDialog_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
          core /* ɵɵlistener */.bIt("dragstart", function CodeEditorDialog_Template_div_dragstart_1_listener($event) {
            return ctx.onStartDrag($event);
          });
          core /* ɵɵelementStart */.j41(2, "button", 2);
          core /* ɵɵlistener */.bIt("click", function CodeEditorDialog_Template_button_click_2_listener() {
            return ctx.update();
          });
          core /* ɵɵtext */.EFF(3, "Update");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "button", 2);
          core /* ɵɵlistener */.bIt("click", function CodeEditorDialog_Template_button_click_4_listener() {
            return ctx.cancel();
          });
          core /* ɵɵtext */.EFF(5, "Cancel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "div", 3)(7, "span", 4);
          core /* ɵɵtext */.EFF(8, "Theme:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "select", 5);
          core /* ɵɵlistener */.bIt("change", function CodeEditorDialog_Template_select_change_9_listener($event) {
            return ctx.changeTheme($event);
          });
          core /* ɵɵtemplate */.DNE(10, CodeEditorDialog_option_10_Template, 2, 1, "option", 6);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(11, "ngs-code-editor", 7);
          core /* ɵɵlistener */.bIt("valueChanged", function CodeEditorDialog_Template_ngs_code_editor_valueChanged_11_listener() {
            return ctx.onCodeChanged();
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(12, "div", 8);
          core /* ɵɵelement */.nrm(13, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(10);
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
  return CodeEditorDialog;
})();
