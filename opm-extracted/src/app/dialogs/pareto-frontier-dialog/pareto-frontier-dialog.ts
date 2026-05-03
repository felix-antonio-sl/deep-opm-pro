// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/pareto-frontier-dialog/pareto-frontier-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function div_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 22);
    core /* ɵɵtext */.EFF(1, " yMin:");
    core /* ɵɵelementStart */.j41(2, "input", 23);
    core /* ɵɵlistener */.bIt("change", function div_36_Template_input_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.changeAxis($event, "y-axis", "min"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3, " yMax:");
    core /* ɵɵelementStart */.j41(4, "input", 23);
    core /* ɵɵlistener */.bIt("change", function div_36_Template_input_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.changeAxis($event, "y-axis", "max"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(5, " xMin:");
    core /* ɵɵelementStart */.j41(6, "input", 23);
    core /* ɵɵlistener */.bIt("change", function div_36_Template_input_change_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.changeAxis($event, "x-axis", "min"));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(7, " xMax:");
    core /* ɵɵelementStart */.j41(8, "input", 23);
    core /* ɵɵlistener */.bIt("change", function div_36_Template_input_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.changeAxis($event, "x-axis", "max"));
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", ctx_r3.getAxis("y-axis", "min"));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", ctx_r3.getAxis("y-axis", "max"));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", ctx_r3.getAxis("x-axis", "min"));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", ctx_r3.getAxis("x-axis", "max"));
  }
}

let paretoFrontierDialog = /*#__PURE__*/(() => {
  class paretoFrontierDialog {
    constructor(init) {
      this.init = init;
      this.lineType = "bezier";
    }
    ngOnInit() {
      this.graph = new joint.dia.Graph();
      // this.paper = new joint.dia.Paper({el: $('#paretoPaper'), width: 500, height: 500, model: this.graph, elementView: joint.shapes.chart.PlotView});
      this.paper = new joint.dia.Paper({
        el: $("#paretoPaper"),
        width: 500,
        height: 500,
        model: this.graph,
        cellViewNamespace: joint.shapes
      });
    }
    showData() {
      this.graph.getCells().forEach(c => c.remove());
      const graph = this.dataToShow.map(it => [it[1], it[2], it[0]]);
      let opt = pf.getParetoFrontier(graph, {
        optimize: this.optimizationType
      });
      opt = opt.sort(function (a, b) {
        if (a[0] > b[0]) {
          return 1;
        } else {
          return -1;
        }
      });
      const series = graph.map(item => {
        return {
          x: item[0],
          y: item[1],
          label: item[2]
        };
      });
      const optimal = opt.map(item => {
        return {
          x: item[0],
          y: item[1],
          label: item[2]
        };
      });
      if (optimal.length === 1) {
        optimal.push(optimal[0]);
      }
      let minX = Math.min(...series.map(item => item.x));
      let minY = Math.min(...series.map(item => item.y));
      let maxX = Math.max(...series.map(item => item.x));
      let maxY = Math.max(...series.map(item => item.y));
      const xGap = maxX - minX;
      const yGap = maxY - minY;
      minX = minX - xGap / 4;
      maxX = maxX + xGap / 4;
      minY = minY - yGap / 4;
      maxY = maxY + yGap / 4;
      this.chart = new joint.shapes.chart.Plot({
        position: {
          x: 35,
          y: 20
        },
        size: {
          width: 450,
          height: 450
        },
        series: [{
          name: "non-optimal",
          data: series,
          hideFillBoundaries: true
        }, {
          name: "optimal",
          data: optimal,
          interpolate: this.lineType,
          hideFillBoundaries: true
        }],
        axis: {
          "y-axis": {
            min: minY,
            max: maxY
          },
          "x-axis": {
            min: minX,
            max: maxX
          }
        },
        attrs: {
          // '.tick': {
          //   display: 'none',
          // },
          ".non-optimal path": {
            stroke: "transparent"
          },
          ".optimal path": {
            stroke: "rgb(0,84,255)",
            opacity: 0.5,
            "stroke-width": 4
          },
          ".non-optimal circle": {
            fill: "rgb(255,255,255)",
            stroke: "#5A6F8F",
            "stroke-width": 2,
            opacity: 0.6,
            r: 5
          },
          ".optimal circle": {
            fill: "white",
            stroke: "#0b3f8d",
            opacity: 1,
            "stroke-width": 2,
            r: 5
          }
        }
      });
      this.graph.addCell(this.chart);
      this.chart.findView(this.paper).setInteractivity(false);
      const chartView = this.chart.findView(this.paper);
      const that = this;
      const points = chartView.el.querySelectorAll(".point");
      for (const point of points) {
        point.addEventListener("mouseenter", function (event) {
          if (event.target.tagName === "g" && !!event.target.getAttribute("data-serie")) {
            const target = event.target;
            const xData = Number(target.getAttribute("data-x"));
            const yData = Number(target.getAttribute("data-y"));
            const serie = target.getAttribute("data-serie");
            const point = that.chart.get("series").find(s => s.name === serie).data.find(d => d.x === xData && d.y === yData);
            const text = that.dataTitles[1] + ": " + point.x + "<br>" + that.dataTitles[2] + ": " + point.y + "<br> Instance Ref: #" + point.label;
            new joint.ui.Tooltip({
              target: event.target,
              rootTarget: event.target,
              direction: "auto",
              padding: 10,
              content: text
            });
          }
        });
      }
      this.removeVerticalLines();
    }
    incomingfile(event) {
      if (event.target.files.length === 0) {
        this.file = null;
        return;
      }
      this.file = event.target.files[0];
      let arrayBuffer;
      const fileReader = new FileReader();
      const that = this;
      fileReader.onload = e => {
        arrayBuffer = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i !== data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join("");
        const workbook = readSync(bstr, {
          type: "binary"
        });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const temp = utils.sheet_to_json(worksheet, {
          raw: true
        });
        const dataFromExcel = temp.map(item => {
          const arr = [];
          const keys = Object.keys(temp[0]);
          for (const key of keys) {
            arr.push(item[key]);
          }
          return arr;
        });
        that.dataToShow = dataFromExcel;
        that.dataTitles = Object.keys(temp[0]);
        that.showData();
      };
      fileReader.readAsArrayBuffer(this.file);
    }
    close() {}
    download() {
      this.paper.toJPEG(img => {
        const byteCharacters = atob(img.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""));
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "image/jpeg"
        });
        FileSaver_min.saveAs(blob, "data".replace(/\./g, "_"));
      }, {
        padding: 40,
        size: "3x",
        quality: 1
      });
    }
    selectChange() {
      this.optimizationType = $("#selectOptimization")[0].value;
      if (this.dataToShow) {
        this.showData();
      }
    }
    selectLineTypeChange($event) {
      this.lineType = $event.target.value;
      if (this.chart) {
        this.chart.remove();
        this.showData();
      }
    }
    getAxis(ax, opt) {
      if (this.chart) {
        return this.chart.attributes.axis[ax][opt];
      } else {
        return 0;
      }
    }
    changeAxis($event, ax, opt) {
      if (this.chart) {
        const temp = {
          ...this.chart.attributes.axis
        };
        temp[ax][opt] = Number($event.target.value);
        try {
          this.chart.set("axis", temp);
        } catch (e) {}
        this.chart.findView(this.paper).update();
        this.removeVerticalLines();
      }
    }
    removeVerticalLines() {
      if (this.lineType === "bezier") {
        for (const path of $("path")) {
          if (path.parentElement.className.baseVal === "optimal") {
            const pathLength = path.pathSegList?.numberOfItems;
            if (!pathLength) {
              continue;
            }
            for (let i = pathLength - 1; i >= 0; i--) {
              if (path.pathSegList.getItem(i).pathSegTypeAsLetter === "V") {
                path.pathSegList.removeItem(i);
              }
            }
          }
        }
      }
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || paretoFrontierDialog)(core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: paretoFrontierDialog,
      selectors: [["multi-instances-dialog"]],
      decls: 41,
      vars: 1,
      consts: [["fileInput", ""], ["id", "content"], [1, "header"], ["id", "uploadParetoFileDiv"], ["mat-mini-fab", "", "color", "primary", 2, "background-color", "#1A3763", "transform", "scale(0.75)", 3, "click", "disabled"], [2, "transform", "scale(0.75)"], ["type", "file", "accept", ".xlsx", 2, "margin", "auto", "margin-left", "calc(50% - 60px)", "display", "none", 3, "change"], [2, "margin-left", "13px", "font-size", "16px", "color", "#1A3763"], ["id", "paretoPaper", 2, "width", "100%", "height", "500px"], [2, "margin-left", "calc(50% - 75px)", "color", "#1A3763"], ["id", "selectOptimization", 1, "selectDiv", 3, "change"], ["value", "topRight", "selected", ""], ["value", "topLeft"], ["value", "bottomRight"], ["value", "bottomLeft"], ["id", "selectLineType", 1, "selectDiv", 2, "margin-top", "5px", 3, "change"], ["value", "bezier", "selected", ""], ["value", "linear"], ["value", "step"], ["style", "margin-left: calc(50% - 165px); margin-top: 5px;color: #1A3763;", 4, "ngIf"], [2, "margin-left", "calc(50% - 60px)", "display", "flex", "margin-top", "15px"], ["mat-button", "", 1, "Btn", 3, "click"], [2, "margin-left", "calc(50% - 165px)", "margin-top", "5px", "color", "#1A3763"], ["type", "number", 1, "paretoMinMax", 3, "change", "value"]],
      template: function Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "h2", 2);
          core /* ɵɵtext */.EFF(2, "Pareto Frontier Analysis");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "hr");
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "button", 4);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_5_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const fileInput_r2 = core /* ɵɵreference */.sdS(9);
            return core /* ɵɵresetView */.Njj(fileInput_r2.click());
          });
          core /* ɵɵelementStart */.j41(6, "mat-icon", 5);
          core /* ɵɵtext */.EFF(7, "attach_file");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "input", 6, 0);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_8_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.incomingfile($event));
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(10, "label", 7);
          core /* ɵɵtext */.EFF(11, "Upload The Results File (.xlsx type only)");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(12, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(13, "div", 8);
          core /* ɵɵelementStart */.j41(14, "div")(15, "span", 9);
          core /* ɵɵtext */.EFF(16, "Optimize: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "select", 10);
          core /* ɵɵlistener */.bIt("change", function Template_select_change_17_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.selectChange());
          });
          core /* ɵɵelementStart */.j41(18, "option", 11);
          core /* ɵɵtext */.EFF(19, "Top Right");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "option", 12);
          core /* ɵɵtext */.EFF(21, "Top Left");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(22, "option", 13);
          core /* ɵɵtext */.EFF(23, "Bottom Right");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "option", 14);
          core /* ɵɵtext */.EFF(25, "Bottom Left");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(26, "br");
          core /* ɵɵelementStart */.j41(27, "span", 9);
          core /* ɵɵtext */.EFF(28, "Line Type: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(29, "select", 15);
          core /* ɵɵlistener */.bIt("change", function Template_select_change_29_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.selectLineTypeChange($event));
          });
          core /* ɵɵelementStart */.j41(30, "option", 16);
          core /* ɵɵtext */.EFF(31, "Bezier");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(32, "option", 17);
          core /* ɵɵtext */.EFF(33, "Linear");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "option", 18);
          core /* ɵɵtext */.EFF(35, "Step");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(36, div_36_Template, 9, 4, "div", 19);
          core /* ɵɵelementStart */.j41(37, "div", 20)(38, "button", 21);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_38_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.download());
          });
          core /* ɵɵtext */.EFF(39, "Download");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(40, "br");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(36);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.chart);
        }
      },
      dependencies: [NgIf, MatIcon, MatButton, MatMiniFabButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: [".header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:18px;font-weight:500}hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px}button[_ngcontent-%COMP%]{margin:auto}#uploadParetoFileDiv[_ngcontent-%COMP%]{overflow:auto;margin-top:20px;width:465px;margin-left:calc(50% - 160px)}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.35);border-radius:4px;display:inline-block;margin-left:10px;width:125px;color:#1a3763}.Btn[_ngcontent-%COMP%]{color:#1a3763!important;opacity:60%!important;font-weight:400!important;border:1px solid rgba(88,109,140,.5)!important;border-radius:4px!important;height:36px!important;margin-left:10px!important;letter-spacing:normal!important}.paretoMinMax[_ngcontent-%COMP%]{width:50px;color:#1a3763;border:1px solid rgba(88,109,140,.5)!important;border-radius:4px!important}#paretoPaper[_ngcontent-%COMP%]{margin-left:calc(50% - 250px)}"]
    }))();
  }
  return paretoFrontierDialog;
})();