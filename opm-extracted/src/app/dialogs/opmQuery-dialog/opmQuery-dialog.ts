// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opmQuery-dialog/opmQuery-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function opmQueryDialogComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 18)(1, "span");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.myConf[ctx_r0.inputs.Query].info);
  }
}
function opmQueryDialogComponent_mat_option_21_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 19);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const query_r2 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", query_r2.key);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(query_r2.key);
  }
}
function opmQueryDialogComponent_div_23_div_7_mat_option_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 19);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const v_r5 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", v_r5);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(v_r5._text ? v_r5._text : v_r5);
  }
}
function opmQueryDialogComponent_div_23_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 22)(1, "span", 11);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "mat-select", 23);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function opmQueryDialogComponent_div_23_div_7_Template_mat_select_ngModelChange_3_listener($event) {
      const options_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r0.inputs[options_r4.key], $event)) {
        ctx_r0.inputs[options_r4.key] = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementStart */.j41(4, "mat-optgroup", 24);
    core /* ɵɵtemplate */.DNE(5, opmQueryDialogComponent_div_23_div_7_mat_option_5_Template, 2, 2, "mat-option", 14);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const options_r4 = ctx.$implicit;
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(options_r4.key);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("placeholder", options_r4.key);
    core /* ɵɵpropertyInterpolate1 */.Mz_("id", "Select_", options_r4.key, "");
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r0.inputs[options_r4.key]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate1 */.Mz_("label", "Select ", options_r4.key, "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", options_r4.value);
  }
}
function opmQueryDialogComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 20);
    core /* ɵɵelement */.nrm(1, "br")(2, "br");
    core /* ɵɵelementStart */.j41(3, "span", 8);
    core /* ɵɵtext */.EFF(4, "Query Properties");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(5, "svg", 9);
    core /* ɵɵelement */.nrm(6, "line", 10);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(7, opmQueryDialogComponent_div_23_div_7_Template, 6, 8, "div", 21);
    core /* ɵɵpipe */.nI1(8, "keyvalue");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(7);
    core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(8, 1, ctx_r0.myConf[ctx_r0.inputs.Query].options));
  }
}
function opmQueryDialogComponent_div_24_div_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "span")(2, "i")(3, "font", 26);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate1 */.SpI(" Progress Status:", ctx_r0.graphDBmsg, " ");
  }
}
function opmQueryDialogComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 4);
    core /* ɵɵelement */.nrm(1, "br")(2, "br");
    core /* ɵɵelementStart */.j41(3, "button", 25);
    core /* ɵɵlistener */.bIt("click", function opmQueryDialogComponent_div_24_Template_button_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.RunQuery());
    });
    core /* ɵɵelementStart */.j41(4, "span");
    core /* ɵɵtext */.EFF(5, "Run Query");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(6, opmQueryDialogComponent_div_24_div_6_Template, 5, 1, "div", 17);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.graphDBmsg && !ctx_r0.errorMessage);
  }
}
function opmQueryDialogComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "span")(2, "i")(3, "font", 27);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r0.errorMessage, " ");
  }
}
let opmQueryDialogComponent = /*#__PURE__*/(() => {
  class opmQueryDialogComponent {
    constructor(dialogRef, graphDBService, _dialog, _dialogRef, initRappidService) {
      this.dialogRef = dialogRef;
      this.graphDBService = graphDBService;
      this._dialog = _dialog;
      this._dialogRef = _dialogRef;
      this.initRappidService = initRappidService;
      // results_only = true;
      // selectedSource: any;
      // selectedTarget: any;
      // selectedQuery: any;
      this.cypherQuery = null;
      this.copyMessage = null;
      this.errorMessage = null;
      this.inputs = {}; // A dictionary with string keys and any values
      this.myConf = {};
      this.DEBUG = false;
      /* todo search pattern */
      // tslint:disable-next-line: max-line-length
      this.thingList = this.initRappidService.opmModel.logicalElements.filter(thing => thing.name === "OpmLogicalObject" || thing.name === "OpmLogicalProcess" || thing.name === "OpmLogicalState").sort((e1, e2) => this.sortFunc(e1, e2));
      this.inputs = [];
    }
    test() {
      console.log("inputs:", this.inputs);
      console.log("source2:", this.myConf["Shortest Path"].Source2);
    }
    ngOnInit() {
      this.graphDBService.streamingGraphDBmsg.subscribe(msg => {
        this.graphDBmsg = msg;
      });
      this.myConf = this.getConf(this.type);
    }
    getConf(type) {
      const conf = {
        "Path Finding": {
          "Shortest Path": {
            info: "The query will identify the shortest path between two OPM things",
            options: {
              Source: this.thingList,
              Target: this.thingList,
              "Flat Model Visibility": ["Hide", "Show"]
            }
          },
          "Longest Path": {
            info: "The query will identify the longest path between two OPM things",
            options: {
              Source: this.thingList,
              Target: this.thingList,
              "Flat Model Visibility": ["Hide", "Show"]
            }
          }
        },
        Neighborhood: {
          Unidirectional: {
            info: "The Query will idetify all the elements with max depth from and to root node",
            options: {
              Root: this.thingList,
              "Max Depth": this.getRangeArray(1, 5),
              "Flat Model Visibility": ["Hide"],
              "Only Procedural": [true, false]
            }
          },
          Directional: {
            info: "The Query will idetify all the elements with max depth from or to root node",
            options: {
              Root: this.thingList,
              "Max Depth": this.getRangeArray(1, 5),
              Direction: ["INCOMING", "OUTGOING"],
              "Flat Model Visibility": ["Hide"],
              "Only Procedural": [true, false]
            }
          }
        },
        Centrality: {
          PageRank: {
            info: "The query measures the influence of nodes",
            options: {
              "Flat Model Visibility": ["Hide", "Show"],
              "Link Type": ["Any", "Procedural", "Fundamental"],
              "Thing Type": ["Any", "Process", "Object"],
              "Number of Items": this.getRangeArray(1, 5)
            }
          }
        }
      };
      return conf[type];
    }
    // private getDisplayOptions(): any{
    //   return ['Results Only', 'Results with grayed out elements'];
    // }
    getRangeArray(min, max) {
      const arr = [];
      for (let i = min ? min : 0; i < max + 1; i++) {
        arr.push(i);
      }
      return arr;
    }
    sortFunc(e1, e2) {
      if (e1.name === e2.name) {
        if (e1.text < e2.text) {
          return -1;
        } else {
          return 1;
        }
      }
      if (e1.name === "OpmLogicalObject") {
        return -1;
      } else {
        return 1;
      }
    }
    closeDialog() {
      this._dialog.closeAll();
    }
    RunQuery() {
      this.errorMessage = "";
      // this.cypherQuery = '';
      if (this.isInputOK()) {
        let q_input = this.parseInput();
        this.graphDBService.runQuery(q_input).then(res => {
          this.closeDialog();
        }).catch(err => {
          this.errorMessage = "Error! " + err;
        });
      }
    }
    parseInput() {
      const parsed = {};
      for (const key of Object.keys(this.inputs)) {
        const kArr = key.toLowerCase().split(/\s+/);
        for (let j = 1; j < kArr.length; j++) {
          kArr[j] = kArr[j].charAt(0).toUpperCase() + kArr[j].slice(1);
        }
        const k = kArr.join("");
        parsed[k] = this.inputs[key];
      }
      parsed.type = this.type;
      if (parsed.root) {
        parsed.source = parsed.root;
        delete parsed.root;
      }
      // Setup Source/Traget type
      if (parsed.source) {
        parsed.source.type = parsed.source.name.replace(/OpmLogical/g, "").toLowerCase();
      }
      if (parsed.target) {
        parsed.target.type = parsed.target.name.replace(/OpmLogical/g, "").toLowerCase();
      }
      // if (parsed['root']) {
      //   parsed['root'].type = parsed['root'].name.replace(/OpmLogical/g, '').toLowerCase();
      // }
      // setup bollean for display results
      if (parsed.flatModelVisibility) {
        if (parsed.flatModelVisibility === "Hide") {
          parsed.resultOnly = true;
        } else {
          parsed.resultOnly = false;
        }
        delete parsed.flatModelVisibility;
      }
      this.debug(["parsed:", parsed, "inputs:", this.inputs]);
      return parsed;
    }
    debug(arr) {
      if (this.DEBUG) {
        console.log(arr);
      }
    }
    isInputOK() {
      //Check if all parameters has input
      for (const key of Object.keys(this.myConf[this.inputs.Query].options)) {
        // console.log('key',key);
        if (typeof this.inputs[key] === "undefined" || this.inputs[key] === null) {
          this.errorMessage = `${key} should be specified`;
          return false;
        }
      }
      switch (this.type) {
        case "Path Finding":
          {
            if (this.inputs.Source._text === this.inputs.Target._text) {
              this.errorMessage = "Source and Target can't be the same element";
              return false;
            }
            return true;
          }
        default:
          {
            return true;
          }
      }
    }
    copyToClipboard(item) {
      document.addEventListener("copy", e => {
        e.clipboardData.setData("text/plain", item);
        e.preventDefault();
        document.removeEventListener("copy", null);
      });
      document.execCommand("copy");
      this.copyMessage = "Query Copied to clipboard...";
    }
    static #_ = (() => this.ɵfac = function opmQueryDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || opmQueryDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(GraphDBService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: opmQueryDialogComponent,
      selectors: [["opmQuery-dialog"]],
      decls: 26,
      vars: 9,
      consts: [[1, "Query"], [1, "queryButton"], ["mat-raised-button", "", 1, "queryCloseButton", 3, "click"], [2, "margin", "0"], [1, "QueryInput"], [1, "DialogTitle"], ["class", "QueryInfo", 4, "ngIf"], [1, "QuerySelection"], [1, "QueryTitle"], ["height", "1", "width", "500"], ["x1", "0", "y1", "0", "x2", "500", "y2", "0", 2, "stroke", "grey", "stroke-width", "2"], [1, "OptionTitle"], ["placeholder", "Query", "id", "Select", 3, "ngModelChange", "ngModel"], ["label", "Select Query"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "QueryProperties", 4, "ngIf"], ["class", "QueryInput", 4, "ngIf"], [4, "ngIf"], [1, "QueryInfo"], [3, "value"], [1, "QueryProperties"], ["class", "option", 4, "ngFor", "ngForOf"], [1, "option"], [3, "ngModelChange", "placeholder", "ngModel", "id"], [3, "label"], ["mat-raised-button", "", 1, "runButton", 3, "click"], ["color", "gray"], ["color", "red"]],
      template: function opmQueryDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "button", 2);
          core /* ɵɵlistener */.bIt("click", function opmQueryDialogComponent_Template_button_click_2_listener() {
            return ctx.closeDialog();
          });
          core /* ɵɵelementStart */.j41(3, "mat-icon", 3);
          core /* ɵɵtext */.EFF(4, "highlight_off");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(5, "div", 4)(6, "div", 5)(7, "span");
          core /* ɵɵtext */.EFF(8);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(9, opmQueryDialogComponent_div_9_Template, 3, 1, "div", 6);
          core /* ɵɵelement */.nrm(10, "br");
          core /* ɵɵelementStart */.j41(11, "div", 7)(12, "span", 8);
          core /* ɵɵtext */.EFF(13, "Query Selection");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(14, "svg", 9);
          core /* ɵɵelement */.nrm(15, "line", 10);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelement */.nrm(16, "br");
          core /* ɵɵelementStart */.j41(17, "span", 11);
          core /* ɵɵtext */.EFF(18, "Query Type:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(19, "mat-select", 12);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function opmQueryDialogComponent_Template_mat_select_ngModelChange_19_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.inputs.Query, $event)) {
              ctx.inputs.Query = $event;
            }
            return $event;
          });
          core /* ɵɵelementStart */.j41(20, "mat-optgroup", 13);
          core /* ɵɵtemplate */.DNE(21, opmQueryDialogComponent_mat_option_21_Template, 2, 2, "mat-option", 14);
          core /* ɵɵpipe */.nI1(22, "keyvalue");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(23, opmQueryDialogComponent_div_23_Template, 9, 3, "div", 15);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(24, opmQueryDialogComponent_div_24_Template, 7, 1, "div", 16)(25, opmQueryDialogComponent_div_25_Template, 5, 1, "div", 17);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtextInterpolate */.JRh(ctx.inputs.Query ? ctx.inputs.Query + " Query" : ctx.type + " Queries");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.inputs.Query);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.inputs.Query);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(22, 7, ctx.myConf));
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.inputs.Query);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.inputs.Query);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.errorMessage);
        }
      },
      dependencies: [NgForOf, NgIf, NgControlStatus, NgModel, MatIcon, MatSelect, MatOption, MatOptgroup, MatButton, KeyValuePipe],
      styles: [".Query{width:600px}.Query .queryButton{left:570px}.Query .queryButton .queryCloseButton{background-color:#1a3763;color:#fff;left:550px;align-items:center;margin:0}.Query .QueryInput .DialogTitle{font-size:x-large;font-weight:700;font-style:oblique;width:60%;color:#fff;background-color:#1a3763;padding-left:10px;border-radius:4px}.Query .QueryInput .QueryInfo{font-size:small;font-weight:400;font-style:italic;color:gray}.Query .QueryInput .QuerySelection .QueryTitle{font-size:large;font-weight:700;font-style:normal;color:#1a3763}.Query .QueryInput .QuerySelection .OptionTitle{font-size:16px;font-weight:400;font-style:italic;color:gray}.Query .QueryInput .QueryProperties .QueryTitle{font-size:large;font-weight:700;font-style:normal;color:#1a3763}.Query .QueryInput .QueryProperties .option{display:flex;align-items:center;gap:10px;height:35px}.Query .QueryInput .QueryProperties .option .OptionTitle{font-size:16px;font-weight:400;font-style:italic;color:gray;min-width:180px;white-space:nowrap}.Query .QueryInput .QueryProperties .option mat-select{flex-grow:1;min-width:150px;max-width:250px}.Query .QueryInput .runButton{background-color:#1a3763;color:#fff}.Query .QueryInput .DialogTitle{font-size:x-large;font-weight:700;font-style:oblique;width:60%;color:#fff;background-color:#1a3763}.Query .QueryInput .toggle{font-weight:400;font-style:italic;color:gray;margin-left:55%}.Query .Results .ResultTitle{font-size:xx-large;font-weight:700;font-style:oblique;width:60%;color:#fff;background-color:#1a3763}.Query .Results .ResultInfo{font-size:small;font-style:italic;color:gray}.Query .Results .ResultData .object{color:#70e483}.Query .Results .ResultData .process{color:#3bc3ff}.Query .Results .ResultData .state{color:olive}#Select{position:relative;width:200px;height:20px;float:right;margin-right:35%;text-transform:capitalize}\n"],
      encapsulation: 2
    }))();
  }
  return opmQueryDialogComponent;
})();