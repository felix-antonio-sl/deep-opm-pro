// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/OpmStereotype.ts
// Extracted by opm-extracted/tools/extract.mjs


class OpmStereotype {
  constructor(stereotypeJson, jsonModel) {
    this.logicalElements = new Array();
    this.fromJson(stereotypeJson, jsonModel);
    this.opd.setAsStereotypeOpd();
  }
  getOpd() {
    return this.opd;
  }
  getMainThing() {
    const mainThing = this.logicalElements.find(log => log.isMainThing);
    if (mainThing) {
      return mainThing;
    }
    return this.logicalElements[0];
  }
  getName() {
    return this.name;
  }
  addLogicalElement(logical) {
    if (!this.logicalElements.includes(logical)) {
      this.logicalElements.push(logical);
    }
  }
  toJson() {
    const logicals = new Array();
    const elementIds = new Array();
    const elementsLabels = new Array();
    for (let i = 0; i < this.logicalElements.length; i++) {
      const logical = this.logicalElements[i];
      const jsonLogicalElement = logical.getParams();
      logicals.push(jsonLogicalElement);
    }
    for (let i = 0; i < this.opd.visualElements.length; i++) {
      elementIds.push(this.opd.visualElements[i].id);
      elementsLabels.push(this.opd.visualElements[i].labels);
    }
    const jsonOpd = {
      name: this.opd.name,
      id: this.opd.id,
      parendId: this.opd.parendId,
      visualElements: elementIds,
      notes: this.opd.notes,
      noteLinks: this.opd.noteLinks
    };
    const jsonStereotype = {
      id: this.id,
      name: this.name,
      opd: jsonOpd,
      logicalElements: logicals,
      description: this.description,
      creationDate: this.creationDate,
      lastEditDate: this.lastEditDate,
      currentOpd: {
        name: this.opd.name
      },
      belongsToSubModel: this.belongsToSubModel
    };
    const jsonOpmStereotype = JSON.stringify(jsonStereotype, function (key, value) {
      if (value === undefined) {
        return null;
      } else {
        return value;
      }
    });
    return JSON.parse(jsonOpmStereotype);
  }
  fromJson(jsonStereotype, json) {
    this.id = jsonStereotype.id ? jsonStereotype.id : uuid();
    this.name = jsonStereotype.name;
    this.opd = new OpmOpd(jsonStereotype.currentOpd.name);
    this.opd.id = uuid();
    this.opd.parendId = "Stereotypes";
    this.logicalElements = [];
    this.description = jsonStereotype.description ? jsonStereotype.description : this.description;
    this.creationDate = jsonStereotype.creationDate ? jsonStereotype.creationDate : new Date();
    this.lastEditDate = jsonStereotype.lastEditDate ? jsonStereotype.lastEditDate : new Date();
    this.belongsToSubModel = jsonStereotype.belongsToSubModel;
    const visuals = new Map();
    const logicals = new Map();
    const elements = new Array();
    for (const logicalJson of jsonStereotype.logicalElements) {
      const logicalElement = logicals.get(logicalJson?.lid) || json.createNewLogicalElement(logicalJson.name, logicalJson);
      if (logicalElement instanceof OpmLogicalObject && logicalJson.statesWithoutVisual) {
        for (let i = 0; i < logicalJson.statesWithoutVisual.length; i++) {
          const jsonstate = logicalJson.statesWithoutVisual[i];
          const state = logicalElement.createState();
          const badvisual = state.visualElements[0];
          state.remove(badvisual.id);
          state.text = jsonstate.text;
          state.stateType = jsonstate.stateType;
          state.parent = logicalElement;
          state.lid = jsonstate.lid;
          logicals.set(state.lid, state);
        }
      }
      if (!logicalJson.visualElementsParams) {
        logicalJson.visualElementsParams = [];
      }
      for (const visualJson of logicalJson.visualElementsParams) {
        const visual = json.createNewVisualElement(visualJson, logicalElement);
        visuals.set(visual.id, visual);
        logicalElement.add(visual, false);
      }
      elements.push(logicalElement);
      logicals.set(logicalElement.lid, logicalElement);
      if (logicalJson.isMainThing === true || logicalJson.isMainThing === "true") {
        logicalElement.isMainThing = true;
      }
    }
    const logicalsMap = new ElementsMap(logicals);
    const map = new ElementsMap(visuals);
    for (const logicalParam of jsonStereotype.logicalElements) {
      try {
        const logical = logicalsMap.get(logicalParam.lid);
        logical.setReferencesFromJson(logicalParam, logicalsMap);
      } catch (err) {
        console.log(err.message);
      }
      for (const visualParam of logicalParam.visualElementsParams) {
        const visual = map.get(visualParam.id);
        try {
          visual.setReferencesFromJson(visualParam, map);
          visual.setReferencesOnCreate();
        } catch (e) {
          console.log(e.message);
        }
      }
      for (const logical of elements) {
        for (const visual of logical.visualElements.filter(vis => vis instanceof OpmVisualThing)) {
          visual.afterCreatingReferencesFix(map);
        }
      }
    }
    this.logicalElements = elements;
    const opdItems = jsonStereotype.opd ? jsonStereotype.opd.visualElements : jsonStereotype.currentOpd.visualElements;
    opdItems.forEach(visId => this.opd.visualElements.push(map.get(visId)));
    // this.logicalElements.forEach(logical => this.opd.visualElements.push(...logical.visualElements));
  }
}
