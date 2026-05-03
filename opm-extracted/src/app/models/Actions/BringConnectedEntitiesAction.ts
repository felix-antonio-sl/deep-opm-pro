// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/Actions/BringConnectedEntitiesAction.ts
// Extracted by opm-extracted/tools/extract.mjs


class BringConnectedEntitiesAction {
  constructor(model, visual, opd) {
    this.model = model;
    this.visual = visual;
    this.opd = opd;
    this.broughtEntities = [];
  }
  act(opt, styleParams) {
    this.filterRelevantRules(opt);
    this.neededRelations = new Array();
    this.neededEntities = new Array();
    this.collectEntitiesAndLinks();
    this.filterEntitiesAndRelations();
    this.createNeededThings();
    const created = this.createNeededRelations();
    this.setPartnersForConsumptionAndResultLinks(created);
    this.handleRequirements();
    this.bringLinksBetweenBroughtEntities(); // TODO
    this.setStyleParamsForBroughtThings(styleParams);
    this.opd.beautify(this.visual);
  }
  filterRelevantRules(opt) {
    if (!opt || opt.length === 0) {
      this.expandingRules = bringConnectedRules;
    } else {
      this.expandingRules = bringConnectedRules.filter(rule => rule.ruleType.some(r => opt.includes(r)));
    }
  }
  collectEntitiesAndLinks() {
    const links = this.visual.getAllLinks();
    for (const child of this.visual.children.filter(c => OPCloudUtils.isInstanceOfVisualState(c))) {
      const temp = child.getAllLinks();
      links.inGoing = [...links.inGoing, ...temp.inGoing];
      links.outGoing = [...links.outGoing, ...temp.outGoing];
    }
    const allLinks = [...links.inGoing, ...links.outGoing].filter(l => !l.belongsToSubModel);
    for (const link of allLinks) {
      for (const rule of this.expandingRules) {
        const toFetch = rule.getNeededElements(link.logicalElement);
        this.neededRelations.push(...toFetch.relations);
        this.neededEntities.push(...toFetch.entities);
      }
    }
  }
  filterEntitiesAndRelations() {
    const statesObjects = this.neededEntities.filter(en => OPCloudUtils.isInstanceOfLogicalState(en)).map(st => st.parent); // bringing states parent objects
    this.neededEntities.unshift(...statesObjects);
    this.neededEntities.unshift(...this.neededEntities.filter(en => en.visualElements.some(v => v.belongsToSubModel)));
    this.neededEntities = this.neededEntities.filter(en => en && !en.hasFather());
    this.neededRelations = this.neededRelations.filter(rel => this.isNotRelationOfEntityInsideInzoomed(rel));
    this.neededRelations = (0, removeDuplicationsInArray)(this.neededRelations);
    this.neededEntities = (0, removeDuplicationsInArray)(this.neededEntities);
    this.neededRelations = this.neededRelations.filter(r => r !== null && r.isAtOPD(this.opd) === false);
    this.neededEntities = this.neededEntities.filter(en => en !== null && en.isAtOPD(this.opd) === false);
    this.neededEntities = this.neededEntities.filter(en => !en.constructor.name.includes("State"));
  }
  // if the relation doesn't connect an entity which sits inside a father inzoomed thing
  isNotRelationOfEntityInsideInzoomed(rel) {
    if (!rel.sourceLogicalElement || !rel.targetLogicalElements[0]) {
      return false;
    }
    const sourceHasFather = rel.sourceLogicalElement.hasFather();
    const targetHasFather = rel.targetLogicalElements[0].hasFather();
    const isSourceState = rel.sourceLogicalElement.constructor.name.includes("State");
    const isTargetState = rel.targetLogicalElements[0].constructor.name.includes("State");
    if (sourceHasFather && isSourceState && targetHasFather && isTargetState) {
      return true;
    }
    if (!sourceHasFather && !targetHasFather) {
      return true;
    }
    // if (sourceHasFather && isSourceState && !targetHasFather)
    //   return true;
    // if (targetHasFather && isTargetState && !sourceHasFather)
    //   return true;
    if (targetHasFather && !sourceHasFather) {
      return true;
    }
    if (sourceHasFather && !targetHasFather) {
      return true;
    }
    if (OPCloudUtils.isInstanceOfVisualThing(rel.visualElements[0].target) && rel.visualElements[0].target.getRefineeInzoom()) {
      return true;
    }
    return false;
  }
  createNeededThings() {
    for (const ent of this.neededEntities) {
      const thing = ent;
      const params = {
        id: uuid(),
        xPos: thing.visualElements[0].xPos,
        yPos: thing.visualElements[0].yPos,
        width: thing.visualElements[0].width,
        height: thing.visualElements[0].height
      };
      const vis = thing.createVisual(params);
      vis.showBackgroundImage = thing.visualElements[0].showBackgroundImage;
      this.opd.add(vis);
      this.broughtEntities.push(vis);
      if (OPCloudUtils.isInstanceOfVisualObject(vis)) {
        vis.expressAll();
        this.broughtEntities.push(...(vis.states || []));
      }
    }
  }
  createNeededRelations() {
    const created = [];
    for (const curr of this.neededRelations) {
      const linkParams = {
        type: curr.linkType,
        connection: linkConnectionType.enviromental,
        isEvent: curr.event,
        isCondition: curr.condition
      };
      let source = this.model.getVisualElementOfLogicalAtOpd(curr.sourceLogicalElement, this.opd);
      let target = this.model.getVisualElementOfLogicalAtOpd(curr.targetLogicalElements[0], this.opd);
      if (!target && OPCloudUtils.isInstanceOfLogicalState(curr.targetLogicalElements[0])) {
        const visObjectFather = this.model.getVisualElementOfLogicalAtOpd(curr.targetLogicalElements[0].parent, this.opd);
        if (visObjectFather) {
          visObjectFather.expressAll();
          target = this.model.getVisualElementOfLogicalAtOpd(curr.targetLogicalElements[0], this.opd);
        }
      }
      if (curr.linkType === linkType.Consumption && OPCloudUtils.isInstanceOfVisualThing(target) && target.getRefineeInzoom() === target && target.getFirstChild()) {
        target = target.getFirstChild();
      }
      if (source && [linkType.Result, linkType.Invocation].includes(curr.linkType) && source.getRefineeInzoom() === source && source.getLastChild()) {
        source = source.getLastChild();
      }
      let canConnect = !!source && !!target;
      if (canConnect) {
        canConnect = this.model.links.canConnect(source, target, curr.linkType).success === true;
      }
      canConnect = canConnect && !source.getLinksWith(target).outGoing.find(l => l.type === curr.linkType);
      if (canConnect) {
        const res = this.model.links.connect(source, target, linkParams);
        created.push({
          original: curr.visualElements[0],
          newRelation: res
        });
        // keeping the or/xor relation in the new OPD
        res.sourceVisualElementPort = curr.visualElements.filter(v => v !== res)[0].sourceVisualElementPort;
        if (res.sourceVisualElementPort) {
          this.visual.inheritPort(curr.visualElements.filter(v => v !== res)[0].source, res.source, res.sourceVisualElementPort);
        }
        res.targetVisualElementPort = curr.visualElements.filter(v => v !== res)[0].targetVisualElementPort;
        if (res.targetVisualElementPort) {
          this.visual.inheritPort(curr.visualElements.filter(v => v !== res)[0].target, res.target, res.targetVisualElementPort);
        }
      }
    }
    return created;
  }
  // partner property for In/Out link pair.
  setPartnersForConsumptionAndResultLinks(created) {
    const types = [linkType.Result, linkType.Consumption];
    for (const relation of created.filter(item => types.includes(item.original.type))) {
      const partnerAtOpdCameFrom = relation.original.getPartner();
      if (!partnerAtOpdCameFrom) {
        continue;
      }
      const partnerAtNewOpd = created.find(itm => itm.original.logicalElement === partnerAtOpdCameFrom.logicalElement);
      if (partnerAtNewOpd && partnerAtNewOpd.newRelation) {
        partnerAtNewOpd.newRelation.setAsPartner(relation.newRelation);
      }
    }
  }
  handleRequirements() {
    const logical = this.visual.logicalElement;
    if (logical.hasRequirements()) {
      logical.getSatisfiedRequirementSetModule().toggleAttribute();
      if (logical.getAllRequirements().find(req => !req.getRequirementObject())) {
        logical.getSatisfiedRequirementSetModule().toggleAttribute();
      }
    }
    if (OPCloudUtils.isInstanceOfLogicalObject(logical) && logical.isSatisfiedRequirementObject()) {
      this.model.setRequirementsBroughtEntitiesPositions(this.visual, this.opd);
    }
  }
  bringLinksBetweenBroughtEntities() {
    const linksToBring = [];
    for (const entity1 of this.broughtEntities) {
      for (const entity2 of this.broughtEntities) {
        if (entity1.logicalElement.lid === entity2.logicalElement.lid) {
          continue;
        }
        const links = entity1.getAllLinksWith(entity2);
        linksToBring.push(...links.inGoing.filter(l => !this.opd.getVisualElementByLogical(l.logicalElement)));
        linksToBring.push(...links.outGoing.filter(l => !this.opd.getVisualElementByLogical(l.logicalElement)));
      }
    }
    this.neededRelations = (0, removeDuplicationsInArray)(linksToBring.map(l => l.logicalElement));
    this.createNeededRelations();
  }
  setStyleParamsForBroughtThings(styleParams) {
    if (!styleParams) {
      return;
    }
    for (const thing of this.broughtEntities.filter(en => OPCloudUtils.isInstanceOfVisualThing(en))) {
      thing.applyDefaultStyleParams(styleParams);
    }
  }
}