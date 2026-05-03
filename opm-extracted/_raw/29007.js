// EXPORTS

// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmLogicalEntity.ts + 1 modules
var OpmLogicalEntity = require("./43894.js");
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/components/StereotypeModule.ts
class StereotypeModule {
  constructor(thing) {
    this.thing = thing;
  }
  getText() {
    return "«" + this.thing.getStereotype().getName() + "» ";
  }
  isTextActive() {
    if (this.thing.getStereotype()) {
      return true;
    }
    return false;
  }
  isActive() {
    if (this.thing.getStereotype()) {
      return true;
    }
    return false;
  }
  getPriority() {
    return -1;
  }
}
class BelongsToStereotypTextModule {
  constructor(thing) {
    this.thing = thing;
  }
  getText() {
    return "of " + this.thing.getBelongsToStereotyped().getBareName();
  }
  isTextActive() {
    if (this.thing.getBelongsToStereotyped()) {
      return true;
    }
    return false;
  }
  isActive() {
    if (this.thing.getBelongsToStereotyped()) {
      return true;
    }
    return false;
  }
  getPriority() {
    return 1;
  }
}
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/components/SimulationModule.ts

class SimulationModule {
  constructor(thing, params = undefined) {
    this.params = params || this.getDefaultParams();
    this.thing = thing;
  }
  get simulationParams() {
    return this.params;
  }
  set simulationParams(params) {
    this.params = params;
  }
  getDefaultParams() {
    return new simulatedElementParams();
  }
  resetParams() {
    this.params = this.getDefaultParams();
  }
  getRandomValues(numberOfValues) {
    const random = require("./67227.js");
    const MAX_TRIES = 100000;
    const ret = [];
    for (let i = 0; i < numberOfValues; i++) {
      const values = new Array();
      let tries = 0;
      // simulate textual value
      if (this.params.textual) {
        const val = this.randWeightedValues(this.params.textualArray);
        ret.push(val);
      } else if (this.params.numerical) {
        this.params.min_range = (this.params.min_range === undefined || this.params.min_range === null) === false ? this.params.min_range : -Infinity;
        this.params.max_range = (this.params.max_range === undefined || this.params.max_range === null) === false ? this.params.max_range : Infinity;
        const min = Number(this.params.min_range);
        const max = Number(this.params.max_range);
        this.params.selectedValue = this.params.selectedValue ? this.params.selectedValue : "uniform";
        switch (this.params.selectedValue) {
          case "uniform":
            {
              const minUniform = (this.params.min_uniform === undefined || this.params.min_uniform === null) === false ? Number(this.params.min_uniform) : -1000000000;
              const maxUniform = (this.params.max_uniform === undefined || this.params.max_uniform === null) === false ? Number(this.params.max_uniform) : 1000000000;
              const uniform = random.default.uniform(minUniform, maxUniform);
              let uniformValue = this.params.integer ? Math.round(uniform()) : uniform();
              if (this.params.integer) {
                uniformValue = this.params.integer ? Math.round(uniform()) : uniform();
              }
              ret.push(uniformValue);
              break;
            }
          case "normal":
            {
              const mu = Number(this.params.normal_mu);
              const sigma = Number(this.params.normal_sigma);
              const normal = random.default.normal(mu, sigma);
              let normalValue = this.params.integer ? Math.round(normal()) : normal();
              while (tries < MAX_TRIES && (normalValue > max || normalValue < min)) {
                tries++;
                normalValue = this.params.integer ? Math.round(normal()) : normal();
              }
              ret.push(tries >= MAX_TRIES ? undefined : normalValue);
              break;
            }
          case "bernoulli":
            {
              const p = this.params.Bernoulli_p;
              const bernoulli = random.default.bernoulli(Number(p));
              let berValue = this.params.integer ? Math.round(bernoulli()) : bernoulli();
              while (tries < MAX_TRIES && (berValue > max || berValue < min)) {
                tries++;
                berValue = this.params.integer ? Math.round(bernoulli()) : bernoulli();
              }
              ret.push(tries >= MAX_TRIES ? undefined : berValue);
              break;
            }
          case "geometric":
            {
              const p = this.params.Geometric;
              const geometric = random.default.geometric(Number(p));
              let geoValue = this.params.integer ? Math.round(geometric()) : geometric();
              while (tries < MAX_TRIES && (geoValue > max || geoValue < min)) {
                tries++;
                geoValue = this.params.integer ? Math.round(geometric()) : geometric();
              }
              ret.push(tries >= MAX_TRIES ? undefined : geoValue);
              break;
            }
          case "binomial":
            {
              const n = this.params.binomial_n;
              const p = this.params.binomial_p;
              const binomial = random.default.binomial(Number(n), Number(p));
              let binValue = this.params.integer ? Math.round(binomial()) : binomial();
              while (tries < MAX_TRIES && (binValue > max || binValue < min)) {
                tries++;
                binValue = this.params.integer ? Math.round(binomial()) : binomial();
              }
              ret.push(tries >= MAX_TRIES ? undefined : binValue);
              break;
            }
          case "exponential":
            {
              const lambda = this.params.exponential_Lambda;
              const exponential = random.default.exponential(Number(lambda));
              let expValue = this.params.integer ? Math.round(exponential()) : exponential();
              while (tries < MAX_TRIES && (expValue > max || expValue < min)) {
                tries++;
                expValue = this.params.integer ? Math.round(exponential()) : exponential();
              }
              ret.push(tries >= MAX_TRIES ? undefined : expValue);
              break;
            }
          case "poisson":
            {
              const lambda = this.params.poisson_Lambda;
              const poisson = random.default.poisson(Number(lambda));
              let piossValue = this.params.integer ? Math.round(poisson()) : poisson();
              while (tries < MAX_TRIES && (piossValue > max || piossValue < min)) {
                tries++;
                piossValue = this.params.integer ? Math.round(poisson()) : poisson();
              }
              ret.push(tries >= MAX_TRIES ? undefined : piossValue);
              break;
            }
        }
        if (tries >= MAX_TRIES) {
          (0, shared /* validationAlert */.iW)("Cannot randomize a valid value for " + this.thing.getBareName() + ", please check its parameters.");
        }
      }
    }
    return ret;
  }
  randWeightedValues(arr) {
    if (!arr || arr.length === 0 || arr.find(item => !(0, shared /* isNumber */.Et)(item.percent))) {
      return undefined;
    }
    let allItemsSum = 0;
    arr.forEach(item => allItemsSum += Number(item.percent));
    if (allItemsSum !== 100) {
      return undefined;
    }
    const rand = Math.random() * 100;
    let sum = 0;
    for (const item of arr) {
      sum += Number(item.percent);
      if (rand <= sum) {
        return item.text;
      }
    }
    return arr[0].text;
  }
}
class simulatedElementParams {
  constructor() {
    this.simulated = false;
    this.numerical = false;
    this.textualArray = [{
      text: "",
      percent: ""
    }];
    this.distribution = "uniform";
    this.uniform = true;
    this.normal = false;
    this.binomial = false;
    this.geometric = false;
    this.bernoulli = false;
    this.exponential = false;
    this.poisson = false;
    this.range1 = -Infinity;
    this.range2 = Infinity;
  }
}
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/components/configurationsTextModule.ts
class ConfigurationsTextModule {
  constructor(thing) {
    this.thing = thing;
  }
  getText() {
    const cc = this.thing.opmModel.getCurrentConfiguration();
    return "{Instances: " + cc[this.thing.lid].value + "}";
  }
  isTextActive() {
    const cc = this.thing.opmModel.getCurrentConfiguration();
    if (cc && cc[this.thing.lid] && cc[this.thing.lid].value !== 0) {
      return true;
    }
    return false;
  }
  getPriority() {
    return 4;
  }
}
// EXTERNAL MODULE: ./src/app/models/hiddenAttributes/satisfied-requirement-set.ts
var satisfied_requirement_set = require("./83136.js");
; // CONCATENATED MODULE: ./src/app/models/hiddenAttributes/hidden-attributes-module.ts

class HiddenAttributesModule {
  constructor(params, model) {
    this.satisfiedRequirementSetModule = new satisfied_requirement_set /* SatisfiedRequirementSetModule */.Oj(params, model);
  }
  createSatisfiedRequirementSet(owner) {
    return this.satisfiedRequirementSetModule.createSatisfiedRequirementSet(owner);
  }
}
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/OpmLogicalThing.ts
export class _ extends OpmLogicalEntity /* OpmLogicalEntity */.r {
  getName() {
    return this.textModule.getName();
  }
  constructor(params, model) {
    super(params, model);
    this.refineable_ = false;
    this.refineeInzooming_ = false;
    this.refineeUnfolding_ = false;
    this.backgroundImageUrl = "";
    this.shouldBeGreyed = false;
    this.isMainThing = false;
    if (params && params.shouldBeGreyed) {
      this.shouldBeGreyed = params.shouldBeGreyed;
    }
    this.text = this.getNumberedName();
    this.stereotypeTextModule = new StereotypeModule(this);
    this.configurationsModule = new ConfigurationsTextModule(this);
    this.belongsToStereotypeTxtModule = new BelongsToStereotypTextModule(this);
    this.textModule.addTextualModules(this.stereotypeTextModule);
    this.textModule.addTextualModules(this.belongsToStereotypeTxtModule);
    this.textModule.addTextualModules(this.configurationsModule);
    if (params && params.sterotypeId) {
      this.stereotype = this.opmModel.stereotypes.getStereotypeById(params.sterotypeId);
    }
    if (params?.equivalentFromStereotypeLID) {
      this.equivalentFromStereotypeLID = params.equivalentFromStereotypeLID;
    }
    this.simulationModule = new SimulationModule(this, params ? params.simulationParams : undefined);
    this.hiddenAttributesModule = new HiddenAttributesModule(params?.satisfiedRequirementsSetParams, this.opmModel);
    this.backgroundImageUrl = params?.backgroundImageUrl || "";
  }
  getSimulationParams() {
    return this.simulationModule.simulationParams;
  }
  isSimulated() {
    return this.simulationModule.simulationParams.simulated;
  }
  resetSimulationParams() {
    this.simulationModule.resetParams();
  }
  getRandomValues(numberOfValues) {
    return this.simulationModule.getRandomValues(numberOfValues);
  }
  setBelongsToStereotyped(element) {
    this.belongsToStereotyped = element;
  }
  getBelongsToStereotyped() {
    return this.belongsToStereotyped;
  }
  setShouldBeGreyed(value) {
    this.shouldBeGreyed = value;
  }
  get essence() {
    return this._essence;
  }
  set essence(essence) {
    this._essence = essence;
  }
  get affiliation() {
    return this._affiliation;
  }
  set affiliation(affiliation) {
    this._affiliation = affiliation;
  }
  get refineable() {
    return this.refineable_;
  }
  get refineeInzooming() {
    return this.refineeInzooming_;
  }
  get refineeUnfolding() {
    return this.refineeUnfolding_;
  }
  cancelRefineable() {
    this.refineable_ = false;
  }
  setRefineable() {
    this.refineable_ = !this.refineable_;
  }
  setRefineeInzooming() {
    this.refineeInzooming_ = !this.refineeInzooming_;
  }
  setRefineeUnfolding() {
    this.refineeUnfolding_ = !this.refineeUnfolding_;
  }
  setStereotype(st) {
    this.stereotype = st;
  }
  getStereotype() {
    return this.stereotype;
  }
  updateParams(params) {
    super.updateParams(params);
    this.essence = params.essence;
    this.affiliation = params.affiliation;
    if (params && params.shouldBeGreyed) {
      this.shouldBeGreyed = params.shouldBeGreyed;
    }
    if (params && params.isMainThing) {
      this.isMainThing = params.isMainThing;
    }
    if (params && params.simulationParams) {
      this.simulationModule.simulationParams = params.simulationParams;
    }
    if (params?.equivalentFromStereotypeLID) {
      this.equivalentFromStereotypeLID = params.equivalentFromStereotypeLID;
    }
  }
  setParams(params) {
    super.setParams(params);
    if (params.sterotypeId) {
      this.stereotype = this.opmModel.stereotypes.getStereotypeById(params.sterotypeId);
    }
    if (params && params.simulationParams) {
      this.simulationModule.simulationParams = params.simulationParams;
    }
    if (params?.equivalentFromStereotypeLID) {
      this.equivalentFromStereotypeLID = params.equivalentFromStereotypeLID;
    }
  }
  getThingParams() {
    const sterotypeId = this.stereotype && this.stereotype.id ? this.stereotype.id : undefined;
    const params = {
      essence: this.essence,
      affiliation: this.affiliation,
      shouldBeGreyed: this.shouldBeGreyed,
      isMainThing: this.isMainThing,
      simulationParams: this.getSimulationParams(),
      equivalentFromStereotypeLID: this.equivalentFromStereotypeLID,
      satisfiedRequirementsSetParams: this.hiddenAttributesModule.satisfiedRequirementSetModule.toJson(),
      backgroundImageUrl: this.backgroundImageUrl
    };
    if (sterotypeId) {
      params.sterotypeId = sterotypeId;
    }
    if (this.getBelongsToStereotyped() && this.getBelongsToStereotyped().visualElements.length > 0) {
      params.belongsToStereotyped = this.getBelongsToStereotyped().visualElements[0].id;
    }
    return {
      ...super.getEntityParams(),
      ...params
    };
  }
  getThingParamsFromJsonElement(jsonElement) {
    const params = {
      essence: jsonElement.essence === 0 ? ConfigurationOptions /* Essence */.tg.Physical : ConfigurationOptions /* Essence */.tg.Informatical,
      affiliation: jsonElement.affiliation === 0 ? ConfigurationOptions /* Affiliation */.n9.Systemic : ConfigurationOptions /* Affiliation */.n9.Environmental,
      shouldBeGreyed: jsonElement.shouldBeGreyed
    };
    return {
      ...super.getEntityParamsFromJsonElement(jsonElement),
      ...params
    };
  }
  getDisplayText() {
    return this.textModule.getDisplayText();
  }
  removeVisual(visual) {
    const visAtHiddenOpd = this.visualElements.find(vis => this.opmModel.getOpdByThingId(vis.id) && this.opmModel.getOpdByThingId(vis.id).isHidden === true);
    super.removeVisual(visual);
    if (this.visualElements.length === 1 && this.getStereotype() && visAtHiddenOpd) {
      const ret = this.opmModel.removeClonedStereotypeAndItsParts(this);
      return {
        removed: ret.removed
      };
    }
  }
  resetVisualsStrokeWidth() {
    for (const vis of this.visualElements) {
      vis.strokeWidth = 2;
    }
  }
  getBackgroundImageUrl() {
    return this.backgroundImageUrl;
  }
  setBackgroundImage(url) {
    this.backgroundImageUrl = url;
  }
  getSatisfiedRequirementSetModule() {
    return this.hiddenAttributesModule.satisfiedRequirementSetModule;
  }
  createSatisfiedRequirementSet(visual) {
    return this.hiddenAttributesModule.createSatisfiedRequirementSet(visual);
  }
  hasRequirements() {
    return !!this.hiddenAttributesModule.satisfiedRequirementSetModule.getRequirementsSet();
  }
  getAllRequirements() {
    return this.hiddenAttributesModule.satisfiedRequirementSetModule.getRequirementsSet()?.getAllRequirements() || [];
  }
  removeSingleRequirement(lidToRemove) {
    const logicalReqObject = this.opmModel.getLogicalElementByLid(lidToRemove);
    const firstVis = logicalReqObject?.visualElements[0];
    if (firstVis.getRefineeUnfold() || firstVis.getRefineeInzoom() || logicalReqObject.getBelongsToStereotyped()) {
      return [];
    }
    const ret = this.hiddenAttributesModule.satisfiedRequirementSetModule.removeSingleRequirement(lidToRemove);
    if (!this.hasRequirements() && this.visualElements.find(v => this.opmModel.getOpdByThingId(v.id)?.requirementsOpd)) {
      this.visualElements.find(v => this.opmModel.getOpdByThingId(v.id)?.requirementsOpd).remove();
    } // removing the visual from the requirements hidden opd because there is no need for it anymore.
    return ret;
  }
}
/***/