// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/simulationElement/SimulationElement.ts
// Extracted by opm-extracted/tools/extract.mjs

function SimulationElementComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 25)(1, "input", 26);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_12_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.range, $event)) {
        ctx_r1.range = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(2, " Range \xA0 ");
    core /* ɵɵelementStart */.j41(3, "input", 27);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_12_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.range1, $event)) {
        ctx_r1.range1 = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, " to ");
    core /* ɵɵelementStart */.j41(5, "input", 28);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_12_Template_input_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.range2, $event)) {
        ctx_r1.range2 = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(6, "br");
    core /* ɵɵtext */.EFF(7, "\xA0\xA0\xA0\xA0 ");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.range);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.range1);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.range2);
  }
}
function SimulationElementComponent_input_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 29);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_input_13_Template_input_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.integer, $event)) {
        ctx_r1.integer = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.integer);
  }
}
function SimulationElementComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵtext */.EFF(2, " Min = ");
    core /* ɵɵelementStart */.j41(3, "input", 30);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_40_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.UniMin, $event)) {
        ctx_r1.UniMin = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, "\xA0\xA0 Max = ");
    core /* ɵɵelementStart */.j41(5, "input", 31);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_40_Template_input_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.UniMax, $event)) {
        ctx_r1.UniMax = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.UniMin);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.UniMax);
  }
}
function SimulationElementComponent_div_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵtext */.EFF(2, " Mu = ");
    core /* ɵɵelementStart */.j41(3, "input", 30);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_41_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.NormalMu, $event)) {
        ctx_r1.NormalMu = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, "\xA0\xA0 Sigma = ");
    core /* ɵɵelementStart */.j41(5, "input", 31);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_41_Template_input_ngModelChange_5_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.NormalSigma, $event)) {
        ctx_r1.NormalSigma = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.NormalMu);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.NormalSigma);
  }
}
function SimulationElementComponent_div_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵtext */.EFF(2, " P = ");
    core /* ɵɵelementStart */.j41(3, "input", 32);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_42_Template_input_ngModelChange_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.Bernoulli_p, $event)) {
        ctx_r1.Bernoulli_p = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.Bernoulli_p);
  }
}
function SimulationElementComponent_div_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1, " P = ");
    core /* ɵɵelementStart */.j41(2, "input", 33);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_44_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.Geometric, $event)) {
        ctx_r1.Geometric = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.Geometric);
  }
}
function SimulationElementComponent_div_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1, " n = ");
    core /* ɵɵelementStart */.j41(2, "input", 34);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_46_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.binomial_n, $event)) {
        ctx_r1.binomial_n = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3, "\xA0\xA0 P = ");
    core /* ɵɵelementStart */.j41(4, "input", 35);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_46_Template_input_ngModelChange_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.binomial_p, $event)) {
        ctx_r1.binomial_p = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.binomial_n);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.binomial_p);
  }
}
function SimulationElementComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1, " Lambda = ");
    core /* ɵɵelementStart */.j41(2, "input", 36);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_48_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.exponentialLambda, $event)) {
        ctx_r1.exponentialLambda = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.exponentialLambda);
  }
}
function SimulationElementComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1, " Lambda = ");
    core /* ɵɵelementStart */.j41(2, "input", 36);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SimulationElementComponent_div_50_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.poissonLambda, $event)) {
        ctx_r1.poissonLambda = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.poissonLambda);
  }
}
function SimulationElementComponent_div_58_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 41);
    core /* ɵɵlistener */.bIt("click", function SimulationElementComponent_div_58_button_5_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r13);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r1.addTextField());
    });
    core /* ɵɵtext */.EFF(1, " + ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SimulationElementComponent_div_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 37)(1, "input", 38);
    core /* ɵɵlistener */.bIt("keyup", function SimulationElementComponent_div_58_Template_input_keyup_1_listener($event) {
      const item_r12 = core /* ɵɵrestoreView */.eBV(_r11).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.textChange("text", item_r12, $event));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(2, " : ");
    core /* ɵɵelementStart */.j41(3, "input", 39);
    core /* ɵɵlistener */.bIt("keyup", function SimulationElementComponent_div_58_Template_input_keyup_3_listener($event) {
      const item_r12 = core /* ɵɵrestoreView */.eBV(_r11).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.textChange("percent", item_r12, $event));
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4, "\xA0%\xA0\xA0\xA0 ");
    core /* ɵɵtemplate */.DNE(5, SimulationElementComponent_div_58_button_5_Template, 2, 0, "button", 40);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r12 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵpropertyInterpolate */.FS9("placeholder", item_r12.text);
    core /* ɵɵproperty */.Y8G("value", item_r12.text);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵpropertyInterpolate */.FS9("placeholder", item_r12.percent);
    core /* ɵɵproperty */.Y8G("value", item_r12.percent);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.textualArray.indexOf(item_r12) === ctx_r1.textualArray.length - 1);
  }
}
let SimulationElementComponent = /*#__PURE__*/(() => {
  class SimulationElementComponent {
    constructor(dialogRef, data) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.numerical = false;
      this.textual = false;
      this.distribution = "uniform";
      this.uniform = true;
      this.normal = false;
      this.binomial = false;
      this.geometric = false;
      this.bernoulli = false;
      this.exponential = false;
      this.poisson = false;
      this.integer = false;
      this.range = false;
      this.probability = true;
      this.range1 = null;
      this.range2 = null;
      this.selectedValue = "uniform";
      this.UniMin = null;
      this.UniMax = null;
      this.NormalMu = null;
      this.NormalSigma = null;
      this.binomial_n = null;
      this.binomial_p = null;
      this.Geometric = null;
      this.Bernoulli_p = null;
      this.exponentialLambda = null;
      this.poissonLambda = null;
      this.updateFields(data);
      this.element = data.logical;
    }
    updateFields(data) {
      this.sim = data.sim;
      this.distribution = this.sim.selectedValue ? this.sim.selectedValue : "uniform";
      this.range1 = this.sim.min_range;
      this.range2 = this.sim.max_range;
      this.selectedValue = this.sim.selectedValue || "uniform";
      this.UniMin = this.sim.min_uniform;
      this.UniMax = this.sim.max_uniform;
      this.NormalMu = this.sim.normal_mu;
      this.NormalSigma = this.sim.normal_sigma;
      this.binomial_n = this.sim.binomial_n;
      this.binomial_p = this.sim.binomial_p;
      this.Geometric = this.sim.Geometric;
      this.Bernoulli_p = this.sim.Bernoulli_p;
      this.exponentialLambda = this.sim.exponential_Lambda;
      this.poissonLambda = this.sim.poisson_Lambda;
      this.numerical = this.sim.numerical;
      this.textual = this.sim.textual;
      this.integer = this.sim.integer;
      this.range = this.sim.range;
      this.probability = true;
      this.textualArray = this.sim.textualArray ? this.sim.textualArray : [{
        text: "",
        percent: ""
      }];
    }
    addTextField() {
      let sum = 0;
      for (const item of this.textualArray) {
        if (item.percent && (0, isNumber)(Number(item.percent))) {
          sum += Number(item.percent);
        }
      }
      const perc = 100 - sum > 0 ? 100 - sum : "";
      this.textualArray.push({
        text: "",
        percent: String(perc)
      });
    }
    showRelevantFields(e) {
      this.uniform = false;
      this.normal = false;
      this.binomial = false;
      this.exponential = false;
      this.poisson = false;
      this.bernoulli = false;
      this.geometric = false;
      this.distribution = e.target.value;
      this.selectedValue = e.target.value;
    }
    changeNumerical() {
      this.numerical = true;
      this.textual = false;
    }
    changeTextual() {
      this.textual = true;
      this.numerical = false;
    }
    checkPercentage() {
      if (this.textual) {
        let percentageSum = 0;
        let empty = false;
        let numberOfEmptyFields = 0;
        for (let i = 0; i < this.textualArray.length; i++) {
          if (this.textualArray[i].percent !== "" && this.textualArray[i].percent !== "percent") {
            percentageSum += Number(this.textualArray[i].percent);
          } else {
            empty = true;
            numberOfEmptyFields += 1;
            percentageSum += 0;
          }
        }
        if (!empty && percentageSum !== 100) {
          (0, validationAlert)("Error: The percentage sum is not equal to 100", 2500, "error");
        }
        if (empty) {
          for (let i = 0; i < this.textualArray.length; i++) {
            if (this.textualArray[i].percent === "" || this.textualArray[i].percent === "percent") {
              this.textualArray[i].percent = String((100 - percentageSum) / numberOfEmptyFields);
            }
          }
        }
      }
    }
    submit(e) {
      this.textualArray = this.textualArray.filter(item => item.percent && item.percent.trim() !== "" && item.text && item.text.trim() !== "");
      if (this.textualArray.length === 0) {
        this.textualArray.push({
          text: "",
          percent: ""
        });
      }
      this.sim.simulated = !!this.numerical || !!this.textual;
      this.sim.min_range = this.range1 ? this.range1 : -Infinity;
      this.sim.max_range = this.range2 ? this.range2 : Infinity;
      this.sim.selectedValue = this.selectedValue;
      this.sim.min_uniform = this.UniMin;
      this.sim.max_uniform = this.UniMax;
      this.sim.normal_mu = this.NormalMu;
      this.sim.normal_sigma = this.NormalSigma;
      this.sim.binomial_n = this.binomial_n;
      this.sim.binomial_p = this.binomial_p;
      this.sim.Geometric = this.Geometric;
      this.sim.Bernoulli_p = this.Bernoulli_p;
      this.sim.exponential_Lambda = this.exponentialLambda;
      this.sim.poisson_Lambda = this.poissonLambda;
      this.sim.numerical = this.numerical;
      this.sim.textual = this.textual;
      this.sim.integer = this.integer;
      this.sim.range = this.range;
      this.sim.probability = true;
      this.sim.textualArray = this.textualArray;
      this.checkPercentage();
      this.dialogRef.close();
    }
    textChange(textField, item, $event) {
      if (textField === "text") {
        item.text = $event.target.value;
      } else if (textField === "percent") {
        item.percent = $event.target.value;
      }
    }
    resetValues() {
      this.element.resetSimulationParams();
      const data = {
        sim: this.element.getSimulationParams()
      };
      this.updateFields(data);
    }
    static #_ = (() => this.ɵfac = function SimulationElementComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SimulationElementComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SimulationElementComponent,
      selectors: [["Simulate-Elements"]],
      decls: 66,
      vars: 22,
      consts: [[1, "header"], ["name", "quiz", "ng-submit", "quiz.answer(selected)"], ["id", "upper"], ["type", "radio", "id", "numerical", "name", "numerical", "value", "numerical", 1, "inputText", 3, "click", "checked", "value"], ["style", "height: 30px; margin-top: -35px;", 4, "ngIf"], ["type", "checkbox", "class", "inputText", "name", "integer", "value", "integer", 3, "ngModel", "ngModelChange", 4, "ngIf"], ["src", " assets/SVG/questionmark.svg", "matTooltip", "Random Integer"], ["src", " assets/SVG/questionmark.svg", "matTooltip", "Probability Type"], [1, "selectDiv"], ["id", "Probability", "name", "ProbabilityType", 3, "change", "value"], ["value", "uniform", 3, "selected"], ["value", "normal", 3, "selected"], ["value", "bernoulli", 3, "selected"], ["value", "geometric", 3, "selected"], ["value", "poisson", 3, "selected"], ["value", "exponential", 3, "selected"], ["value", "binomial", 3, "selected"], ["id", "distribution"], [4, "ngIf"], ["id", "textualValue"], ["type", "radio", "id", "textualRadio", "name", "textual", "value", "text", 3, "click", "checked", "value"], ["style", "color: #1A3763; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: normal; Opacity: 70%;", 4, "ngFor", "ngForOf"], ["mat-button", "", "id", "submitBtn", 3, "click"], ["mat-button", "", "id", "resetBtn", 3, "click"], ["mat-button", "", "id", "closeBtn", 3, "click"], [2, "height", "30px", "margin-top", "-35px"], ["type", "checkbox", "name", "range", "value", "range", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "min_range", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "max_range", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "integer", "value", "integer", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "max", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "min", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "pBer", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "pGeo", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "n", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "p", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "lambda ", "size", "7", 1, "inputText", 3, "ngModelChange", "ngModel"], [2, "color", "#1A3763", "font-family", "Roboto, Arial, Helvetica, sans-serif", "font-weight", "normal", "opacity", "70%"], ["type", "text", "matTooltip", "textual Value", 1, "inputText", "textualVal", "textualValRight", 3, "keyup", "placeholder", "value"], ["type", "number", "min", "0", "max", "100", "matTooltip", "percent", 1, "inputText", "textualVal", "percentVal", 3, "keyup", "placeholder", "value"], ["id", "addTextValueBtn", 3, "click", 4, "ngIf"], ["id", "addTextValueBtn", 3, "click"]],
      template: function SimulationElementComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "h2", 0);
          core /* ɵɵtext */.EFF(2, "Please select one of the following values");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "form", 1)(4, "div")(5, "div", 2)(6, "input", 3);
          core /* ɵɵlistener */.bIt("click", function SimulationElementComponent_Template_input_click_6_listener() {
            return ctx.changeNumerical();
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "span");
          core /* ɵɵtext */.EFF(8, " Numerical Value");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(9, "br")(10, "br");
          core /* ɵɵtext */.EFF(11, "\xA0\xA0\xA0\xA0 ");
          core /* ɵɵtemplate */.DNE(12, SimulationElementComponent_div_12_Template, 8, 3, "div", 4)(13, SimulationElementComponent_input_13_Template, 1, 1, "input", 5);
          core /* ɵɵtext */.EFF(14, " Integer value ");
          core /* ɵɵelement */.nrm(15, "img", 6)(16, "br");
          core /* ɵɵtext */.EFF(17, "\xA0\xA0\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(18, "span");
          core /* ɵɵtext */.EFF(19, "Probability \xA0\xA0");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(20, "img", 7);
          core /* ɵɵtext */.EFF(21, "\xA0\xA0\xA0 ");
          core /* ɵɵelementStart */.j41(22, "div", 8)(23, "select", 9);
          core /* ɵɵlistener */.bIt("change", function SimulationElementComponent_Template_select_change_23_listener($event) {
            return ctx.showRelevantFields($event);
          });
          core /* ɵɵelementStart */.j41(24, "option", 10);
          core /* ɵɵtext */.EFF(25, "Uniform");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "option", 11);
          core /* ɵɵtext */.EFF(27, "Normal");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "option", 12);
          core /* ɵɵtext */.EFF(29, "Bernoulli");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(30, "option", 13);
          core /* ɵɵtext */.EFF(31, "Geometric");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(32, "option", 14);
          core /* ɵɵtext */.EFF(33, "Poisson");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "option", 15);
          core /* ɵɵtext */.EFF(35, "Exponential");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "option", 16);
          core /* ɵɵtext */.EFF(37, "Binomial");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtext */.EFF(38, "\xA0 ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(39, "div", 17);
          core /* ɵɵtemplate */.DNE(40, SimulationElementComponent_div_40_Template, 6, 2, "div", 18)(41, SimulationElementComponent_div_41_Template, 6, 2, "div", 18)(42, SimulationElementComponent_div_42_Template, 4, 1, "div", 18);
          core /* ɵɵtext */.EFF(43, "\xA0 ");
          core /* ɵɵtemplate */.DNE(44, SimulationElementComponent_div_44_Template, 3, 1, "div", 18);
          core /* ɵɵtext */.EFF(45, "\xA0 ");
          core /* ɵɵtemplate */.DNE(46, SimulationElementComponent_div_46_Template, 5, 2, "div", 18);
          core /* ɵɵtext */.EFF(47, "\xA0 ");
          core /* ɵɵtemplate */.DNE(48, SimulationElementComponent_div_48_Template, 3, 1, "div", 18);
          core /* ɵɵtext */.EFF(49, "\xA0 ");
          core /* ɵɵtemplate */.DNE(50, SimulationElementComponent_div_50_Template, 3, 1, "div", 18);
          core /* ɵɵtext */.EFF(51, "\xA0 ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(52, "\xA0\xA0 ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(53, "div", 19)(54, "input", 20);
          core /* ɵɵlistener */.bIt("click", function SimulationElementComponent_Template_input_click_54_listener() {
            return ctx.changeTextual();
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(55, "span");
          core /* ɵɵtext */.EFF(56, " Textual Value");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(57, "\xA0\xA0\xA0\xA0 ");
          core /* ɵɵtemplate */.DNE(58, SimulationElementComponent_div_58_Template, 6, 5, "div", 21);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(59, " \xA0\xA0\xA0\xA0 ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(60, "button", 22);
          core /* ɵɵlistener */.bIt("click", function SimulationElementComponent_Template_button_click_60_listener($event) {
            return ctx.submit($event);
          });
          core /* ɵɵtext */.EFF(61, "Save Values");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(62, "button", 23);
          core /* ɵɵlistener */.bIt("click", function SimulationElementComponent_Template_button_click_62_listener() {
            return ctx.resetValues();
          });
          core /* ɵɵtext */.EFF(63, "Reset Values");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(64, "button", 24);
          core /* ɵɵlistener */.bIt("click", function SimulationElementComponent_Template_button_click_64_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(65, "Close");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("checked", ctx.numerical)("value", ctx.numerical);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.numerical && ctx.selectedValue !== "uniform");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.numerical);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("value", ctx.selectedValue);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "uniform");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "normal");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "bernoulli");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "geometric");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "poisson");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "exponential");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("selected", ctx.distribution === "binomial");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "uniform");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "normal");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "bernoulli");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "geometric");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "binomial");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "exponential");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.distribution === "poisson");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("checked", ctx.textual)("value", ctx.textual);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.textualArray);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatButton, fesm2022_forms /* ɵNgNoValidate */.qT, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm],
      styles: [".header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:20px;font-weight:500}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;width:100px;display:inline-block}select[_ngcontent-%COMP%]{background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;margin-left:3px;width:90%}#textualValue[_ngcontent-%COMP%]{overflow:overlay;overflow-y:auto;max-height:300px;height:300px;border-radius:10px;background-color:#e6e6e629;margin-top:13px}#textualRadio[_ngcontent-%COMP%]{margin-top:13px;margin-bottom:20px}.inputText[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.textualVal[_ngcontent-%COMP%]{margin-bottom:7px}.percentVal[_ngcontent-%COMP%]{text-align:center;width:42px}.textualValRight[_ngcontent-%COMP%]{margin-left:138px}#addTextValueBtn[_ngcontent-%COMP%]{color:#1a3763;opacity:60%;border:1px solid rgba(88,109,140,.5);border-radius:4px;margin-left:-10px}#submitBtn[_ngcontent-%COMP%]{position:relative;left:95px;width:113px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;top:20px}#resetBtn[_ngcontent-%COMP%]{position:relative;left:113px;width:118px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;top:20px}#closeBtn[_ngcontent-%COMP%]{position:relative;left:130px;width:100px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;top:20px}#upper[_ngcontent-%COMP%]{margin-top:8px;border-radius:10px;background-color:#e6e6e629;line-height:23px}#numerical[_ngcontent-%COMP%]{margin-top:13px}[type=submit][_ngcontent-%COMP%]{position:sticky;left:226px;margin-top:5px;width:100px;height:42px;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px;color:#fff}#distribution[_ngcontent-%COMP%]{height:40px;margin-left:30px}div[_ngcontent-%COMP%]{height:auto}.tooltip[_ngcontent-%COMP%]{position:relative;display:inline-block;border-bottom:1px dotted black}img[_ngcontent-%COMP%]{width:15px}"]
    }))();
  }
  return SimulationElementComponent;
})();