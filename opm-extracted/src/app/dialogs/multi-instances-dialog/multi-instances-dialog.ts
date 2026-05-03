// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/multi-instances-dialog/multi-instances-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function h4_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "h4", 20);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Total Model combinations: ", ctx_r0.totalModelCombinations, "");
  }
}
function div_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "div", 21);
  }
}
function button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 22);
    core /* ɵɵlistener */.bIt("click", function button_7_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.generate());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 23);
    core /* ɵɵelement */.nrm(2, "path", 24);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3, " Filter");
    core /* ɵɵelementEnd */.k0s();
  }
}
function h4_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "h4", 25);
    core /* ɵɵtext */.EFF(1, "No Instances Available");
    core /* ɵɵelementEnd */.k0s();
  }
}
function div_15__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 31);
    core /* ɵɵelement */.nrm(1, "path", 32);
    core /* ɵɵelementEnd */.k0s();
  }
}
function div_15__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 31);
    core /* ɵɵelement */.nrm(1, "path", 33);
    core /* ɵɵelementEnd */.k0s();
  }
}
function div_15_span_19_span_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, " \xA0\xA0\xA0 ");
    core /* ɵɵelementStart */.j41(2, "input", 35);
    core /* ɵɵlistener */.bIt("change", function div_15_span_19_span_1_Template_input_change_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const inst_r6 = core /* ɵɵnextContext */.XpG().$implicit;
      const item_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.onInputChange($event, inst_r6, item_r4));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "select", 36);
    core /* ɵɵlistener */.bIt("change", function div_15_span_19_span_1_Template_select_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const idx_r7 = core /* ɵɵnextContext */.XpG().index;
      const item_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.changeConstrains($event, item_r4, idx_r7));
    });
    core /* ɵɵelementStart */.j41(4, "option", 37);
    core /* ɵɵtext */.EFF(5, " <= ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "option");
    core /* ɵɵtext */.EFF(7, " = ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(8, "span");
    core /* ɵɵtext */.EFF(9);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(10, "br");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r7 = core /* ɵɵnextContext */.XpG();
    const inst_r6 = ctx_r7.$implicit;
    const idx_r7 = ctx_r7.index;
    const item_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("value", item_r4.selectedValues[inst_r6.lid]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", item_r4.constrains[idx_r7]);
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(inst_r6.getBareName());
  }
}
function div_15_span_19_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtemplate */.DNE(1, div_15_span_19_span_1_Template, 11, 3, "span", 34);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", item_r4.visible);
  }
}
function div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 26);
    core /* ɵɵlistener */.bIt("click", function div_15_Template_div_click_0_listener($event) {
      const item_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.itemToggle($event, item_r4));
    });
    core /* ɵɵelementStart */.j41(1, "span", 27);
    core /* ɵɵtemplate */.DNE(2, div_15__svg_svg_2_Template, 2, 0, "svg", 28)(3, div_15__svg_svg_3_Template, 2, 0, "svg", 28);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "span", 29);
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "span");
    core /* ɵɵtext */.EFF(7, "\xA0\xA0\xA0\xA0\xA0Multiplicity: ");
    core /* ɵɵelementStart */.j41(8, "span", 29);
    core /* ɵɵtext */.EFF(9);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "span");
    core /* ɵɵtext */.EFF(11, "\xA0\xA0\xA0\xA0\xA0Combinations: ");
    core /* ɵɵelementStart */.j41(12, "span", 29);
    core /* ɵɵtext */.EFF(13);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(14, "span");
    core /* ɵɵtext */.EFF(15, "\xA0\xA0\xA0\xA0\xA0Left: ");
    core /* ɵɵelementStart */.j41(16, "span", 29);
    core /* ɵɵtext */.EFF(17);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(18, "br");
    core /* ɵɵtemplate */.DNE(19, div_15_span_19_Template, 2, 1, "span", 30);
    core /* ɵɵelement */.nrm(20, "br");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", !item_r4.visible);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", item_r4.visible);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r4.entity.getBareName());
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(item_r4.multiplicity);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.getCombinations(item_r4.instances.length, item_r4.multiplicity));
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.getHowMuchLeft(item_r4));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", item_r4.instances);
  }
}
function h4_17_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "h4", 38);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("Selected configurations: ", ctx_r0.filteredConfigurations.length > 0 ? ctx_r0.filteredConfigurations.length + " (out of " + ctx_r0.totalModelCombinations + ")" : "", "");
  }
}
function div_28_span_3_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, "\xA0\xA0\xA0");
    core /* ɵɵelementEnd */.k0s();
  }
}
function div_28_span_3_span_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span")(1, "b");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelement */.nrm(4, "wbr");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const lid_r11 = core /* ɵɵnextContext */.XpG().$implicit;
    const conf_r10 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(conf_r10[lid_r11].value);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("x ", ctx_r0.getNameByLid(lid_r11), "");
  }
}
function div_28_span_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtemplate */.DNE(1, div_28_span_3_span_1_Template, 2, 0, "span", 34)(2, div_28_span_3_span_2_Template, 5, 2, "span", 34);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const lid_r11 = ctx.$implicit;
    const conf_r10 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", conf_r10[lid_r11].value !== 0 || ctx_r0.showZeros);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", conf_r10[lid_r11].value !== 0 || ctx_r0.showZeros);
  }
}
function div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 39);
    core /* ɵɵlistener */.bIt("click", function div_28_Template_div_click_0_listener() {
      const conf_r10 = core /* ɵɵrestoreView */.eBV(_r9).$implicit;
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.setCurrentConfiguration(conf_r10));
    });
    core /* ɵɵelementStart */.j41(1, "span", 40);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, div_28_span_3_Template, 3, 2, "span", 30);
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const conf_r10 = ctx.$implicit;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate1 */.SpI("#Ref-", conf_r10.refId, ":");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getConfigurationKeys(conf_r10));
  }
}

let multiInstancesDialog = /*#__PURE__*/(() => {
  class multiInstancesDialog {
    constructor(init, dialogRef, sanitizer) {
      this.init = init;
      this.dialogRef = dialogRef;
      this.sanitizer = sanitizer;
      this.sliceStart = 0;
      this.spinnerFlag = false;
      this.showZeros = false;
      this.totalModelCombinations = 0;
      this.list = [];
      this.filteredConfigurations = [];
      this.createList();
      if (!this.init.generatedSelectedConfigurations) {
        this.generate();
      } else {
        this.filteredConfigurations = this.init.generatedSelectedConfigurations;
        this.totalModelCombinations = this.init.previousTotalConfigurations;
      }
    }
    createList() {
      const logicalEntities = this.init.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalEntity);
      for (let log of logicalEntities) {
        const instances = log.getLinks().outGoing.filter(link => link.linkType === linkType.Instantiation).map(lnk => lnk.targetLogicalElements[0]);
        if (instances.length === 0) {
          continue;
        }
        const multiAgg = log.getLinks().inGoing.find(l => l.linkType === linkType.Aggregation && l.visualElements.find(vis => vis.targetMultiplicity));
        const multiplicity = multiAgg ? multiAgg.visualElements.find(vis => vis.targetMultiplicity).targetMultiplicity : 1;
        const selectedValues = {};
        const constrains = [];
        for (const inst of instances) {
          selectedValues[inst.lid] = 0;
          constrains.push("<=");
        }
        this.list.push({
          entity: log,
          instances: instances,
          multiplicity: Number(multiplicity),
          selectedValues: selectedValues,
          visible: false,
          constrains: constrains
        });
      }
    }
    getCombinations(n, k) {
      const up = k + n - 1;
      return Math.round(this.factorial(up) / (this.factorial(k) * this.factorial(n - 1)));
    }
    factorial(num) {
      let rval = 1;
      for (let i = 2; i <= num; i++) {
        rval = rval * i;
      }
      return rval;
    }
    getTotalModelCombinations() {
      let ret = 1;
      for (const item of this.list) {
        ret = ret * this.getCombinations(item.instances.length, item.multiplicity);
      }
      return Math.round(ret);
    }
    onInputChange($event, inst, item) {
      let sum = 0;
      let val = Number($event.target.value);
      if ((0, isNumber)(val)) {
        item.selectedValues[inst.lid] = val;
      }
      for (const inp in item.selectedValues) {
        if ((0, isNumber)(Number(item.selectedValues[inp]))) {
          sum = sum + Number(item.selectedValues[inp]);
        }
      }
      if (sum > item.multiplicity) {
        val = Number($event.target.value - 1);
      }
      item.selectedValues[inst.lid] = val;
      $event.target.value = val;
    }
    itemToggle($event, item) {
      if ($event.target.className !== "inputNumber" && $event.target.className !== "constrainsSelect") {
        item.visible = !item.visible;
      }
    }
    close() {
      // this.generate();
      this.dialogRef.close();
      // this.importFiltersListFromJson(this.exportFiltersListToJson())
      // console.log('hi');
    }
    isValidSum(arr, sum) {
      let s = 0;
      for (const n of arr) {
        s += n;
      }
      if (s === sum) {
        return true;
      }
      return false;
    }
    generate() {
      var _this = this;
      return (0, default)(function* () {
        _this.sliceStart = 0;
        _this.spinnerFlag = true;
        yield new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 50);
        });
        const dict = {};
        // { entity: log, instances: instances, multiplicity: Number(multiplicity), selectedValues: selectedValues, visible: false}
        for (const item of _this.list) {
          const range = multi_instances_dialog_.range(0, item.multiplicity + 1, 1);
          const multicombinations = multi_instances_dialog_.multipermutations(range, item.instances.length).filter(m => _this.isValidSum(m, item.multiplicity)).map(t => {
            const ret = {};
            for (let i = 0; i < item.instances.length; i++) {
              const alias = _this.init.opmModel.getLogicalElementByLid(item.instances[i].lid)?.alias;
              ret[item.instances[i].lid] = {
                value: t[i],
                constrain: item.constrains[i],
                selectedValue: item.selectedValues[item.instances[i].lid],
                alias: alias
              };
            }
            return ret;
          });
          dict[item.entity.lid] = multicombinations;
        }
        _this.generateSelectedConfigurations(dict);
        _this.spinnerFlag = false;
        return dict;
      })();
    }
    generateSelectedConfigurations(dict) {
      let i = 0;
      this.configurations = multi_instances_dialog_.product(...Object.values(dict)).map(j => {
        i++;
        return Object.assign({
          refId: i
        }, ...j);
      });
      this.filterConfigurationsByLogicalPhysibility();
      this.totalModelCombinations = this.filteredConfigurations.length;
      this.updateNumbering();
      this.filterConfigurationsByConstrains();
      this.init.generatedSelectedConfigurations = this.filteredConfigurations;
      this.init.previousTotalConfigurations = this.totalModelCombinations;
    }
    filterConfigurationsByConstrains() {
      this.filteredConfigurations = this.filteredConfigurations.filter(conf => {
        for (const key of this.getConfigurationKeys(conf)) {
          if (conf[key].constrain === "<=") {
            if (conf[key].value < conf[key].selectedValue) {
              return false;
            }
          } else if (conf[key].value !== conf[key].selectedValue) {
            return false;
          }
        }
        return true;
      });
    }
    filterConfigurationsByLogicalPhysibility() {
      this.filteredConfigurations = this.configurations.filter(conf => {
        for (const key of this.getConfigurationKeys(conf)) {
          const logical = this.init.opmModel.getLogicalElementByLid(key);
          const links = logical.getLinks();
          const sources = links.inGoing.map(l => l.sourceLogicalElement);
          const targets = [];
          for (const outl of links.outGoing) {
            targets.push(...outl.targetLogicalElements);
          }
          for (const src of sources) {
            if (conf[key].value !== 0 && conf[src.lid] && conf[src.lid].value === 0) {
              return false;
            }
          }
          for (const trgt of targets) {
            if (conf[key].value !== 0 && conf[trgt.lid] && conf[trgt.lid].value === 0) {
              return false;
            }
          }
        }
        return true;
      });
    }
    updateNumbering() {
      for (let i = 0; i < this.filteredConfigurations.length; i++) {
        this.filteredConfigurations[i].refId = i + 1;
      }
    }
    getNameByLid(lid) {
      return this.init.opmModel.getLogicalElementByLid(lid).getBareName();
    }
    getConfigurationKeys(conf) {
      return Object.keys(conf).filter(k => k !== "refId");
    }
    getSubArray() {
      return this.filteredConfigurations.slice(this.sliceStart * 500, this.sliceStart * 500 + 500);
    }
    increaseSliceStart() {
      if (this.sliceStart * 500 + 501 < this.filteredConfigurations.length) {
        this.sliceStart++;
      }
    }
    decreaseSliceStart() {
      if (this.sliceStart !== 0) {
        this.sliceStart--;
      }
    }
    changeConstrains($event, item, idx) {
      item.constrains[idx] = $event.target.value;
    }
    toggleShowZeros($event) {
      this.showZeros = $event.target.checked;
    }
    getHowMuchLeft(item) {
      let sum = 0;
      for (const key of Object.keys(item.selectedValues)) {
        sum += Number(item.selectedValues[key]);
      }
      return item.multiplicity - sum;
    }
    setCurrentConfiguration(conf) {
      this.init.opmModel.setCurrentConfiguration(conf);
      this.init.graphService.renderGraph(this.init.opmModel.currentOpd);
      this.dialogRef.close();
    }
    exportFiltersListToJson() {
      const ret = [];
      for (const item of this.list) {
        const temp = {
          constrains: item.constrains,
          entity: item.entity.lid
        };
        temp.instances = item.instances.map(i => i.lid);
        temp.multiplicity = item.multiplicity;
        temp.selectedValues = item.selectedValues;
        temp.visible = item.visible;
        ret.push(temp);
      }
      const theJSON = JSON.stringify(ret);
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
      const modelName = this.init.modelService.modelObject && this.init.modelService.modelObject.name ? this.init.modelService.modelObject.name : "unsavedModel";
      element.setAttribute("download", modelName + "-selected-instances-filters.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    importFiltersListFromJson($event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const text = reader.result.toString().trim();
        const json = JSON.parse(text);
        for (const item of json) {
          const exist = this.list.find(itm => itm.entity.lid === item.entity);
          if (!exist) {
            continue;
          }
          for (const instId of item.instances) {
            const idx = item.instances.indexOf(instId);
            const inner = exist.instances.find(log => log.lid === instId);
            if (inner) {
              const filterIdx = exist.instances.indexOf(inner);
              exist.constrains[filterIdx] = item.constrains[idx];
              exist.selectedValues[instId] = item.selectedValues[instId];
            }
          }
        }
      };
      reader.readAsText(file);
    }
    exportSelectedToPdf() {
      const pdf = new jspdf_es_min({
        orientation: "p",
        unit: "pt",
        format: "a4",
        putOnlyUsedFonts: true
      });
      const pdfProps = createDocumentProperties(pdf, 40, 40);
      const modelName = this.init.opmModel.name ? this.init.opmModel.name : "Unsaved Model";
      pdf.setTextColor("#1A3763");
      insertText("Model Selected Instances: " + modelName, pdf, pdfProps, false, "center", "bold", 18);
      insertText("\n", pdf, pdfProps, false, "center", "bold", 8);
      pdf.setTextColor("#000");
      const innerText = $("#decided")[0].innerText.split("\n");
      for (const line of innerText) {
        insertText(line, pdf, pdfProps, true, "left", "normal", 11);
      }
      pdf.save(modelName + "-selected-instances.pdf");
    }
    inputFileClick() {
      document.getElementById("selectedFile").click();
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || multiInstancesDialog)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(DomSanitizer));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: multiInstancesDialog,
      selectors: [["multi-instances-dialog"]],
      decls: 35,
      vars: 11,
      consts: [["id", "content"], [1, "header"], ["style", "color: #1A3763", 4, "ngIf"], ["style", "height: 55px;", 4, "ngIf"], [2, "margin-top", "-50px", "margin-bottom", "15px", "margin-left", "calc(50% - 30px)"], ["style", "color: #1A3763", "mat-button", "", 3, "click", 4, "ngIf"], ["type", "file", "id", "selectedFile", "accept", "application/json", 2, "display", "none", 3, "change"], ["mat-button", "", 1, "multiInstButton", 2, "margin-left", "8px", "margin-right", "8px", 3, "click"], ["mat-button", "", 1, "multiInstButton", 3, "click"], ["style", "color: #1A3763;font-weight: normal", 4, "ngIf"], ["id", "allElements"], ["class", "instanceDiv", 3, "click", 4, "ngFor", "ngForOf"], ["style", "margin-block-end: 1em;color: #1A3763", 4, "ngIf"], [2, "margin-top", "-44px", "margin-left", "480px", "color", "#1A3763"], ["mat-button", "", 1, "incDecButton", 3, "click", "disabled"], ["type", "checkbox", "id", "showZeros", 3, "change", "checked"], ["id", "decided"], ["class", "decidedItem", 3, "click", 4, "ngFor", "ngForOf"], [2, "display", "inline-block", "margin-top", "25px", "margin-left", "calc(50% - 30px)"], [2, "position", "fixed", "left", "calc(50% - 58px)", "top", "calc(50% - 200px)", 3, "hidden"], [2, "color", "#1A3763"], [2, "height", "55px"], ["mat-button", "", 2, "color", "#1A3763", 3, "click"], ["version", "1.1", "id", "Capa_1", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink", "x", "0px", "y", "0px", "viewBox", "0 0 210.68 210.68", "width", "15", "height", "15", 0, "xml", "space", "preserve", 2, "margin-top", "-2px"], ["d", "M205.613,30.693c0-10.405-10.746-18.149-32.854-23.676C154.659,2.492,130.716,0,105.34,0\n          C79.965,0,56.021,2.492,37.921,7.017C15.813,12.544,5.066,20.288,5.066,30.693c0,3.85,1.476,7.335,4.45,10.479l68.245,82.777v79.23\n          c0,2.595,1.341,5.005,3.546,6.373c1.207,0.749,2.578,1.127,3.954,1.127c1.138,0,2.278-0.259,3.331-0.78l40.075-19.863\n          c2.55-1.264,4.165-3.863,4.169-6.71l0.077-59.372l68.254-82.787C204.139,38.024,205.613,34.542,205.613,30.693z M44.94,20.767\n          C61.467,17.048,82.917,15,105.34,15s43.874,2.048,60.399,5.767c18.25,4.107,23.38,8.521,24.607,9.926\n          c-1.228,1.405-6.357,5.819-24.607,9.926c-16.525,3.719-37.977,5.767-60.399,5.767S61.467,44.338,44.94,40.62\n          c-18.249-4.107-23.38-8.521-24.607-9.926C21.56,29.288,26.691,24.874,44.94,20.767z M119.631,116.486\n          c-1.105,1.341-1.711,3.023-1.713,4.761l-0.075,57.413l-25.081,12.432v-69.835c0-1.741-0.605-3.428-1.713-4.771L40.306,54.938\n          C58.1,59.1,81.058,61.387,105.34,61.387c24.283,0,47.24-2.287,65.034-6.449L119.631,116.486z"], [2, "color", "#1A3763", "font-weight", "normal"], [1, "instanceDiv", 3, "click"], [2, "padding-right", "5px"], ["width", "10", "height", "11", "viewBox", "0 0 8 11", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [2, "font-weight", "bold"], [4, "ngFor", "ngForOf"], ["width", "10", "height", "11", "viewBox", "0 0 8 11", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 0L3.5 10H4.5L4.5 0L3.5 0Z", "fill", "#5A6F8F"], ["d", "M4.35355 0.646447C4.15829 0.451184 3.84171 0.451184 3.64645 0.646447L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646447ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z", "fill", "#5A6F8F"], [4, "ngIf"], ["type", "number", "min", "0", 1, "inputNumber", 3, "change", "value"], [1, "constrainsSelect", 3, "change", "value"], ["selected", ""], [2, "margin-block-end", "1em", "color", "#1A3763"], [1, "decidedItem", 3, "click"], [1, "noWordBreak", 2, "font-weight", "bold", "margin-left", "5px", "margin-top", "3px", "color", "#1A3763"]],
      template: function Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "h2", 1);
          core /* ɵɵtext */.EFF(2, "Multi-Instances Model Selection");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "hr");
          core /* ɵɵtemplate */.DNE(4, h4_4_Template, 2, 1, "h4", 2)(5, div_5_Template, 1, 0, "div", 3);
          core /* ɵɵelementStart */.j41(6, "div", 4);
          core /* ɵɵtemplate */.DNE(7, button_7_Template, 4, 0, "button", 5);
          core /* ɵɵelementStart */.j41(8, "input", 6);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_8_listener($event) {
            return ctx.importFiltersListFromJson($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "button", 7);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_9_listener() {
            return ctx.inputFileClick();
          });
          core /* ɵɵtext */.EFF(10, "Import Filters");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "button", 8);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_11_listener() {
            return ctx.exportFiltersListToJson();
          });
          core /* ɵɵtext */.EFF(12, "Export Filters");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(13, h4_13_Template, 2, 0, "h4", 9);
          core /* ɵɵelementStart */.j41(14, "div", 10);
          core /* ɵɵtemplate */.DNE(15, div_15_Template, 21, 7, "div", 11);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(16, "hr");
          core /* ɵɵtemplate */.DNE(17, h4_17_Template, 2, 1, "h4", 12);
          core /* ɵɵelementStart */.j41(18, "div", 13)(19, "button", 14);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_19_listener() {
            return ctx.decreaseSliceStart();
          });
          core /* ɵɵtext */.EFF(20, "<<");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "button", 14);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_21_listener() {
            return ctx.increaseSliceStart();
          });
          core /* ɵɵtext */.EFF(22, ">>");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "input", 15);
          core /* ɵɵlistener */.bIt("change", function Template_input_change_23_listener($event) {
            return ctx.toggleShowZeros($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(24, " Show Zeros ");
          core /* ɵɵelementStart */.j41(25, "button", 8);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_25_listener() {
            return ctx.exportSelectedToPdf();
          });
          core /* ɵɵtext */.EFF(26, "Export to PDF");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(27, "div", 16);
          core /* ɵɵtemplate */.DNE(28, div_28_Template, 5, 2, "div", 17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(29, "div", 18)(30, "button", 8);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_30_listener() {
            return ctx.close();
          });
          core /* ɵɵtext */.EFF(31, "Apply");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(32, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(33, "div", 19);
          core /* ɵɵelement */.nrm(34, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length > 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length <= 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length > 0);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length === 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.list);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length !== 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("disabled", ctx.sliceStart === 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("disabled", ctx.sliceStart * 500 + 501 > ctx.filteredConfigurations.length);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("checked", ctx.showZeros);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.getSubArray());
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
        }
      },
      dependencies: [NgForOf, NgIf, MatButton, ProgressSpinner, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: [".header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:18px;font-weight:500}hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px}#allElements[_ngcontent-%COMP%]{height:370px;overflow-y:scroll}.multiInstButton[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763;letter-spacing:normal}.decidedItem[_ngcontent-%COMP%]{margin-bottom:4px;display:inline-grid;border-radius:5px;color:#1a3763}#decided[_ngcontent-%COMP%]{height:120px;overflow-y:scroll}.inputNumber[_ngcontent-%COMP%]{width:40px;margin-right:10px;background:#fff;border:1px solid #D9E7EE;box-sizing:border-box;border-radius:5px;text-align-last:center}input[type=number][_ngcontent-%COMP%]::-webkit-inner-spin-button, input[type=number][_ngcontent-%COMP%]::-webkit-outer-spin-button{opacity:1}.instanceDiv[_ngcontent-%COMP%]{border:1px solid rgba(0,0,0,.1);border-radius:4px;padding-top:4px;padding-left:4px;margin-top:4px;overflow-x:scroll;color:#1a3763}.incDecButton[_ngcontent-%COMP%]{color:#1a3763}.constrainsSelect[_ngcontent-%COMP%]{margin-right:5px;margin-left:-2px;border:1px solid #D9E7EE;box-sizing:border-box;border-radius:4px}.decidedItem[_ngcontent-%COMP%]:hover{background-color:#d4d4d496}"]
    }))();
  }
  return multiInstancesDialog;
})();