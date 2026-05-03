// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/consistancy.model.ts
// Extracted by opm-extracted/tools/extract.mjs

  // TODO: We should work with these methods
  function getEntityType(logical_name) {
    switch (logical_name) {
      case "OpmLogicalObject":
        return EntityType.Object;
      case "OpmLogicalProcess":
        return EntityType.Process;
      case "OpmLogicalState":
        return EntityType.State;
    }
  }
  function getLinkType(name) {
    if (name.includes("Agent")) {
      return linkType.Agent;
    } else if (name.includes("Instrument")) {
      return linkType.Instrument;
    } else if (name.includes("OvertimeUndertime-exception")) {
      return linkType.UndertimeOvertimeException;
    } else if (name.includes("Invocation")) {
      return linkType.Invocation;
    } else if (name.includes("Result")) {
      return linkType.Result;
    } else if (name.includes("Consumption")) {
      return linkType.Consumption;
    } else if (name.includes("Effect")) {
      return linkType.Effect;
    } else if (name.includes("Overtime")) {
      return linkType.OvertimeException;
    } else if (name.includes("Undertime")) {
      return linkType.UndertimeException;
    } else if (name.includes("Unidirectional")) {
      return linkType.Unidirectional;
    } else if (name.includes("Bidirectional")) {
      return linkType.Bidirectional;
    } else if (name.includes("Aggregation")) {
      return linkType.Aggregation;
    } else if (name.includes("Exhibition")) {
      return linkType.Exhibition;
    } else if (name.includes("Generalization")) {
      return linkType.Generalization;
    } else if (name.includes("Instantiation")) {
      return linkType.Instantiation;
    }
  }
  class Consistency {
    constructor() {
      this.structural = rules;
      this.behavioral = behavioral_rules_rules;
      this.consistent = consistional_rules_rules;
    }
    getStructuralRules(source, target) {
      return this.structural.filter(r => r.shouldBeApplied(source, target, undefined));
    }
    getBehavioralRules(source, target, link) {
      return this.behavioral.filter(r => r.shouldBeApplied(source, target, link));
    }
    getConsistentRules(source, target, link) {
      return this.consistent.filter(r => r.shouldBeApplied(source, target, link));
    }
    getAllRules(source, target, link) {
      // Return an empty array if source or target is null
      if (!source || !target) {
        return [];
      }
      // Safely extract the logicalElement names
      const sourceType = source.logicalElement?.name ? getEntityType(source.logicalElement.name) : null;
      const targetType = target.logicalElement?.name ? getEntityType(target.logicalElement.name) : null;
      // If either type could not be determined, return an empty array
      if (!sourceType || !targetType) {
        return [];
      }
      // Collect and return rules
      return [...this.getStructuralRules(sourceType, targetType), ...this.getBehavioralRules(sourceType, targetType, link), ...this.getConsistentRules(sourceType, targetType, link)];
    }
    check(rules, source, target, link) {
      const warnings = [];
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].canConnect(source, target, link) === false) {
          return {
            success: false,
            message: rules[i].message(),
            type: rules[i].type(),
            changeAction: rules[i].changeAction,
            warnings: rules[i].warning && rules[i].warning(source, target) ? [rules[i].warning(source, target)] : []
          };
        } else if (rules[i].warning && rules[i].warning(source, target, link) !== undefined) {
          warnings.push(rules[i].warning(source, target, link));
        }
      }
      return {
        success: true,
        warnings
      };
    }
    isLegal(source, target) {
      const sourceType = getEntityType(source.logicalElement.name);
      const targetType = getEntityType(target.logicalElement.name);
      const rules = this.getStructuralRules(sourceType, targetType);
      return this.check(rules, source, target, undefined);
    }
    canConnect(source, target, link) {
      /*
      const relevantLinks = oplFunctions.generateLinksWithOplByElements(source, target);
      const legal = relevantLinks.filter((l) => (l.name === name)).length > 0;
      if (legal === false) {
          this.setPrevious();
          validationAlert('Not allowed according to OPM standart', 5000);
      */
      const rules = this.getAllRules(source, target, link);
      return this.check(rules, source, target, link);
    }
  }

  /***/
}),
/***/35100: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    JL: () => (/* binding */LinksModel),
    kY: () => (/* binding */InOutPairType)

  });

  var InOutPairType = /*#__PURE__*/function (InOutPairType) {
    InOutPairType[InOutPairType.Standart = 0] = "Standart";
    InOutPairType[InOutPairType.Split = 1] = "Split";
    InOutPairType[InOutPairType.Condition = 2] = "Condition";
    InOutPairType[InOutPairType.Event = 3] = "Event";
    InOutPairType[InOutPairType.Negation = 4] = "Negation";
    return InOutPairType;
  }(InOutPairType || {});
  class LinksModel {
    constructor(model) {
      this.model = model;
      this.consistency = new consistancy_model /* .Consistency */.j();
    }
    canConnect(source, target, link) {
      return this.consistency.canConnect(source, target, link);
    }
    isLegal(source, target) {
      return this.consistency.isLegal(source, target);
    }
    move(source, target, link) {
      const type = link.logicalElement.linkType;
      if (type === ConfigurationOptions /* .linkType */.h6.Effect) {
        const hiddenLinks = this.isHavingHiddenInOuts(link.sourceVisualElement, link.targetVisualElements[0].targetVisualElement);
        const links = [...hiddenLinks.ins, ...hiddenLinks.outs];
        links.forEach(l => l.visible = true);
        if (configuration_rappidEnviromentFunctionality_shared /* .initRappidShared */.i1 && configuration_rappidEnviromentFunctionality_shared /* .initRappidShared */.i1.getGraphService() && links.length > 0) {
          configuration_rappidEnviromentFunctionality_shared /* .initRappidShared */.i1.getGraphService().updateLinksView(links);
        }
      }
      let relation = this.getExistingRelation(source, target, type);
      if (relation == undefined) {
        const opd = this.model.getOpdByElement(source);
        const params = {
          type: link.type,
          connection: ConfigurationOptions /* .linkConnectionType */.zv.enviromental
        };
        if (link instanceof VisualPart_OpmProceduralLink /* .OpmProceduralLink */.E) {
          params.isCondition = link.logicalElement.condition;
          params.isEvent = link.logicalElement.event;
          params.isNegation = link.logicalElement.negation;
        }
        relation = createLogicalLink(params, this.model, opd, source.logicalElement, target.logicalElement);
        // Remove these after we change logical to not create a visual by default
        const badVisual = relation.visualElements[0];
        relation.removeVisual(badVisual);
        opd.removeVisual(badVisual);
      }
      if (relation !== link.logicalElement) {
        for (let i = link.logicalElement.visualElements.length - 1; i >= 0; i--) {
          if (link.logicalElement.visualElements[i] === link) {
            link.logicalElement.visualElements.splice(i, 1);
          }
        }
        if (link.logicalElement.visualElements.length === 0) {
          this.model.removeLogicalElement(link.logicalElement);
        }
        relation.visualElements.push(link);
        link.logicalElement = relation;
      }
      // TODO: Update Ports and Params
      // Update Needed Params Visual - Temporary
      link.sourceVisualElement = source;
      link.targetVisualElements = [new VisualPart_OpmLink /* .TargetElementData */.g(target, undefined)];
      return link;
    }
    connect(source, target, link) {
      const relation = this.getExistingRelation(source, target, link.type);
      const opd = this.model.getOpdByElement(source);
      if (link.type === ConfigurationOptions /* .linkType */.h6.Effect && source.type === model_entities_enum /* .EntityType */.c.Process) {
        const temp = source;
        source = target;
        target = temp;
      }
      let created;
      if (relation) {
        created = factoryOpmLink(link.type, relation);
        created.setNewUUID();
        if (links_set /* .tagged */.VK.contains(link.type)) {
          this.copyTags(created);
        }
        opd.add(created);
      } else {
        const logical = createLogicalLink(link, this.model, opd, source.logicalElement, target.logicalElement);
        created = logical.visualElements[0];
      }
      // TODO: Update Ports and Params
      // Update Needed Params Visual - Temporary
      created.sourceVisualElement = source;
      created.targetVisualElements = [new VisualPart_OpmLink /* .TargetElementData */.g(target, undefined)];
      if (link.type === ConfigurationOptions /* .linkType */.h6.Exhibition && (target.type === model_entities_enum /* .EntityType */.c.Object || target.type === model_entities_enum /* .EntityType */.c.Process) && !target.isComputational()) {
        this.setEssences(source, target);
      }
      // target.setEssence(Essence.Informatical);
      if (link.path) {
        created.path = link.path;
      }
      if (link.linkRequirements) {
        created.logicalElement.linkRequirements = link.linkRequirements;
      }
      this.checkForRelatedRelations(source, target, created);
      if (relation) {
        this.inheritSourceMultiplicity(created, relation);
        this.inheritTargetMultiplicity(created, relation);
      }
      return created;
    }
    copyTags(taggedVisual) {
      const tagged = taggedVisual.logicalElement.visualElements.find(v => v.tag);
      const backwardTagged = taggedVisual.logicalElement.visualElements.find(v => v.tag);
      if (tagged) {
        taggedVisual.tag = tagged.tag;
      }
      if (backwardTagged) {
        taggedVisual.backwardTag = backwardTagged.backwardTag;
      }
    }
    inheritSourceMultiplicity(newVis, logical) {
      if (!links_set /* .tagged */.VK.contains(logical.linkType)) {
        return;
      }
      const visWithSrcM = logical.visualElements.find(vis => vis.sourceMultiplicity);
      if (visWithSrcM) {
        newVis.sourceMultiplicity = visWithSrcM.sourceMultiplicity;
        const label = visWithSrcM.labels ? visWithSrcM.labels.find(lb => lb.attrs.label.text === visWithSrcM.sourceMultiplicity) : undefined;
        if (label && newVis.labels) {
          newVis.labels.push(label);
        } else if (label && !newVis.labels) {
          newVis.labels = [label];
        }
      }
    }
    inheritTargetMultiplicity(newVis, logical) {
      if (!links_set /* .fundamental */.gF.contains(logical.linkType) && !links_set /* .tagged */.VK.contains(logical.linkType)) {
        return;
      }
      const visWithTrgtM = logical.visualElements.find(vis => vis.targetMultiplicity);
      if (visWithTrgtM) {
        newVis.targetMultiplicity = visWithTrgtM.targetMultiplicity;
        const label = visWithTrgtM.labels ? visWithTrgtM.labels.find(lb => lb.attrs.label.text === visWithTrgtM.targetMultiplicity) : undefined;
        if (label && newVis.labels) {
          newVis.labels.push(label);
        } else if (label && !newVis.labels) {
          newVis.labels = [label];
        }
      }
    }
    setEssences(source, target) {
      if (this.model.isCurrentlyOnStereotypeCreation > 0 || target.logicalElement.getBelongsToStereotyped()) {
        return;
      }
      const realSource = source.type === model_entities_enum /* .EntityType */.c.State ? source.fatherObject : source;
      if (realSource.type === model_entities_enum /* .EntityType */.c.Object) {
        if (target.type === model_entities_enum /* .EntityType */.c.Object) {
          target.changeEssence(ConfigurationOptions /* .Essence */.tg.Informatical);
        }
        if (target.type === model_entities_enum /* .EntityType */.c.Process) {
          target.changeEssence(realSource.getEssence());
        }
      } else if (realSource.type === model_entities_enum /* .EntityType */.c.Process) {
        if (target.type === model_entities_enum /* .EntityType */.c.Object) {
          target.changeEssence(ConfigurationOptions /* .Essence */.tg.Informatical);
        }
        if (target.type === model_entities_enum /* .EntityType */.c.Process) {
          target.changeEssence(realSource.getEssence());
        }
      }
    }
    checkForRelatedRelations(source, target, created, mergeAndClear = true) {
      if (!source || !target || !created) {
        return;
      }
      if (source.fatherObject && target.fatherObject && source instanceof VisualPart_OpmVisualThing /* .OpmVisualThing */.J && target instanceof VisualPart_OpmVisualThing /* .OpmVisualThing */.J) {
        return;
      }
      this.farRelatedRelation(source, target, created);
      if (mergeAndClear) {
        created.logicalElement.opmModel.mergeIntersactingRelatedRelations();
        created.logicalElement.opmModel.filterEmptyRelatedRelations();
      }
    }
    farRelatedRelation(source, target, created) {
      if (!source || !target || !created) {
        return;
      }
      const that = this;
      let sourceHeritage = [source.logicalElement];
      let targetHeritage = [target.logicalElement];
      if (source instanceof VisualPart_OpmVisualThing /* .OpmVisualThing */.J) {
        sourceHeritage = source.getThingHeritage();
      }
      if (target instanceof VisualPart_OpmVisualThing /* .OpmVisualThing */.J) {
        targetHeritage = target.getThingHeritage();
      }
      for (const srcLog of sourceHeritage) {
        for (const trgLog of targetHeritage) {
          const links = this.getLogicalLinksBetween(srcLog, trgLog).filter(l => l.linkType === created.type);
          links.forEach(l => {
            if (l !== created.logicalElement) {
              let rr = that.model.getRelatedRelationsByLogicalLink(l);
              if (!rr) {
                rr = that.model.getRelatedRelationsByLogicalLink(created.logicalElement);
              }
              if (!rr) {
                that.model.addNewRelatedRelation([l, created.logicalElement]);
              } else if (rr.includes(created.logicalElement)) {
                that.model.addLinkToExistingRelatedRelation(l, rr);
              } else {
                that.model.addLinkToExistingRelatedRelation(created.logicalElement, rr);
              }
            }
          });
        }
      }
    }
    getLogicalLinksBetween(source, target) {
      const links = this.model.logicalElements.filter(el => el instanceof LogicalPart_OpmRelation /* .OpmRelation */.v);
      const ret = [];
      for (const link of links) {
        const l = link;
        if (l.sourceLogicalElement === source && l.targetLogicalElements.includes(target)) {
          ret.push(l);
        }
      }
      return ret;
    }
    getExistingRelation(source, target, type) {
      const links = source.getAllLinksWith(target);
      const existing = links.outGoing.filter(l => l.logicalElement.linkType === type);
      if (existing.length == 0) {
        return undefined;
      } else if (existing.length == 1) {
        return existing[0].logicalElement;
      }
      const relation = existing[0].logicalElement;
      // else existing.length > 1, therefore, all logicals must be the same
      // extra safety
      // for (let i = 1; i < existing.length; i++)
      //     if (relation !== existing[i].logicalElement)
      //         throw new Error('Some problem in the model');
      return relation;
    }
    getCommutativeSet(type) {
      if (links_set /* .commutativeDirect */.q0.contains(type)) {
        return links_set /* .commutativeDirect */.q0;
      } else if (links_set /* .structural */.ex.contains(type)) {
        return links_set /* .structural */.ex;
      }
      return undefined;
    }
    getCommutativeConnection(source, target, type) {
      const links = source.getLinksWith(target);
      const set = this.getCommutativeSet(type);
      for (const lnk of [...links.inGoing, ...links.outGoing]) {
        if (lnk.source === source && lnk.target === target && lnk.type === type) {
          return lnk;
        }
      }
      if (set === undefined) {
        return undefined;
      }
      for (const link of [...links.inGoing, ...links.outGoing]) {
        if (set.contains(link.type)) {
          return link;
        }
      }
    }
    replace(source, target, toReplace, link) {
      const removed = [].concat(toReplace.logicalElement.visualElements);
      const created = new Array();
      const actually_removed = this.model.removeElements(removed);
      for (const replace of removed) {
        let result;
        if (source.logicalElement === replace.source.logicalElement) {
          result = this.canConnect(replace.source, replace.target, link.type);
        } else {
          result = this.canConnect(replace.target, replace.source, link.type);
        }
        if (result.success == false) {
          // Restore
          const connection = {
            type: replace.type,
            connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
          };
          for (const replace of removed) {
            let created;
            if (source.logicalElement === replace.source.logicalElement) {
              created = this.connect(replace.source, replace.target, connection);
            } else {
              created = this.connect(replace.target, replace.source, connection);
            }
            created.id = replace.id;
          }
          return result;
        }
      }
      for (const replace of removed) {
        let create;
        if (source.logicalElement === replace.source.logicalElement) {
          create = this.connect(replace.source, replace.target, link);
        } else {
          create = this.connect(replace.target, replace.source, link);
        }
        created.push(create);
      }
      return {
        success: true,
        created: created,
        removed: [].concat(actually_removed.elements)
      };
    }
    replaceTriangle(source, target, link, type) {
      const opd = this.model.getOpdByElement(source);
      const links = opd.visualElements.filter(v => v instanceof VisualPart_OpmLink /* .OpmLink */.t && v.type === link.type && v.sourceVisualElement === source);
      const linkParams = {
        type: type,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.enviromental
      };
      const result = {
        success: true,
        created: new Array(),
        removed: new Array(),
        warnings: []
      };
      for (const link of links) {
        const trgt = target.constructor.name.includes("State") ? target.fatherObject : target;
        const foldedVisual = trgt.logicalElement.visualElements.find(vis => vis.isFoldedUnderThing().isFolded && vis.isFoldedUnderThing().triangleType === link.type);
        let foldedType;
        if (foldedVisual) {
          foldedType = foldedVisual.foldedUnderThing.triangleType;
          foldedVisual.foldedUnderThing.triangleType = linkParams.type;
        }
        const replace = this.replace(source, target, link, linkParams);
        if (replace.success) {
          result.created.push(...replace.created);
          result.removed.push(...replace.removed);
          if (foldedVisual) {
            foldedVisual.foldedUnderThing.triangleType = linkParams.type;
          }
        } else if (foldedVisual) {
          foldedVisual.foldedUnderThing.triangleType = foldedType;
        }
        if (replace.success === false) {
          result.warnings = [replace.message];
        }
      }
      return result;
    }
    isCommutativeConnection(source, target, params) {
      const link = this.getCommutativeConnection(source, target, params.type);
      return {
        connected: link !== undefined,
        link
      };
    }
    getDestinationInOutState(sourceState, type) {
      if (type === InOutPairType.Split) {
        return sourceState.fatherObject;
      }
      let i = 0;
      for (const sibling of sourceState.fatherObject.states) {
        if (sourceState === sibling) {
          const next = sourceState.fatherObject.states[i + 1];
          if (next === undefined) {
            return sourceState.fatherObject.states[i - 1];
          }
          return next;
        }
        i++;
      }
    }
    connectInOutPair(source, target, type) {
      if (this.isHavingHiddenInOuts(source, target).isHaving === true) {
        return {
          success: false,
          message: "Cannot connect In/Out if there are Hidden links. Reveal those links first."
        };
      }
      const getState = () => {
        if (target.type === model_entities_enum /* .EntityType */.c.State) {
          return target;
        } else if (source.type === model_entities_enum /* .EntityType */.c.State) {
          return source;
        }
        throw new Error("Should not been called");
      };
      const getProcess = () => {
        if (target.type === model_entities_enum /* .EntityType */.c.Process) {
          return target;
        } else if (source.type === model_entities_enum /* .EntityType */.c.Process) {
          return source;
        }
        throw new Error("Should not been called");
      };
      const state = getState();
      const process = getProcess();
      const dest = this.getDestinationInOutState(state, type);
      if (dest === undefined) {
        return {
          success: false,
          message: "Could not create"
        };
      }
      const entity1 = target.type === model_entities_enum /* .EntityType */.c.State ? state : dest;
      const entity2 = target.type === model_entities_enum /* .EntityType */.c.State ? dest : state;
      // const first = this.canConnect(process, entity1, link1type);
      // const second = this.canConnect(entity2, process, link2type);
      // if (first.success && second.success) {
      const condition = type === InOutPairType.Condition;
      const event = type === InOutPairType.Event;
      const link1ResultParams = {
        type: ConfigurationOptions /* .linkType */.h6.Result,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.enviromental
      };
      const link2ConsumptionParams = {
        type: ConfigurationOptions /* .linkType */.h6.Consumption,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.enviromental,
        isCondition: condition,
        isEvent: event
      };
      let link1;
      let link2;
      let ret1;
      let ret2;
      const isAlreadyConnected1 = this.isCommutativeConnection(process, entity1, link1ResultParams);
      const isAlreadyConnected2 = this.isCommutativeConnection(entity2, process, link1ResultParams);
      if (isAlreadyConnected1.connected && isAlreadyConnected1.link.path) {
        isAlreadyConnected1.connected = false;
      }
      if (isAlreadyConnected2.connected && isAlreadyConnected2.link.path) {
        isAlreadyConnected2.connected = false;
      }
      if (isAlreadyConnected1.connected) {
        ret1 = this.replace(process, entity1, isAlreadyConnected1.link, link1ResultParams);
        link1 = ret1.created[0];
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Please note this action replaced the previous In/Out link. For creating a flipflop link please add link path first.");
      } else {
        link1 = this.connect(process, entity1, link1ResultParams);
      }
      if (isAlreadyConnected2.connected) {
        const dummyLinks = [];
        if (ret1 && ret1.removed.includes(isAlreadyConnected2.link)) {
          const toReconnectTemporarily = ret1.removed.filter(l => l.type === isAlreadyConnected2.link.type);
          for (const l of toReconnectTemporarily) {
            const dummyParams = {
              type: l.type,
              connection: ConfigurationOptions /* .linkConnectionType */.zv.enviromental
            };
            const dummyLink = this.connect(l.source, l.target, dummyParams);
            isAlreadyConnected2.link = dummyLink;
            dummyLinks.push(dummyLink);
          }
        }
        ret2 = this.replace(entity2, process, isAlreadyConnected2.link, link2ConsumptionParams);
        if (ret2.success === false) {
          const moreToRemove = entity2.getLinksWith(process).outGoing.filter(ltr => [ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Result].includes(ltr.type)).map(rl => rl.remove());
          const removedToFix = [];
          for (const lr of moreToRemove) {
            removedToFix.push(...lr);
          }
          ret2.created = [this.connect(entity2, process, link2ConsumptionParams)];
          ret2.removed = removedToFix;
        }
        dummyLinks.forEach(lnk => lnk.remove());
        link2 = ret2.created[0];
      } else {
        link2 = this.connect(entity2, process, link2ConsumptionParams);
      }
      link1.setAsPartner(link2);
      // those values should be only true or false. not null or undefined.
      link1.condition = link1.condition ? true : false;
      link2.condition = link2.condition ? true : false;
      link1.event = link1.event ? true : false;
      link2.event = link2.event ? true : false;
      // taking care of related relations
      const rr1 = this.model.getRelatedRelationsByLogicalLink(link1.logicalElement);
      const rr2 = this.model.getRelatedRelationsByLogicalLink(link2.logicalElement);
      if (rr1) {
        rr1.push(link1.logicalElement);
      } else if (rr2) {
        rr2.push(link2.logicalElement);
      } else if (!rr1 && !rr2) {
        this.model.addNewRelatedRelation([link1.logicalElement, link2.logicalElement]);
      }
      return {
        success: true,
        created: [link1, link2],
        removed: [...(ret1 ? ret1.removed : []), ...(ret2 ? ret2.removed : [])]
      };
      // }
      // return { success: false, message: 'Could not create' };
    }
    fixLinksWithNonExistingState(visualProcess) {
      const ins = visualProcess.getLinks().inGoing;
      const outs = visualProcess.getLinks().outGoing;
      const model = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel();
      for (const link of ins) {
        const visSource = link.sourceVisualElement;
        if (!visSource.logicalElement.visualElements.includes(visSource)) {
          const newSource = visSource.logicalElement.visualElements.find(vis => model.getOpdByThingId(vis.id) === model.getOpdByThingId(link.id));
          this.move(newSource, link.targetVisualElements[0].targetVisualElement, link);
        }
      }
      for (const link of outs) {
        const visTarget = link.targetVisualElements[0].targetVisualElement;
        if (!visTarget.logicalElement.visualElements.includes(visTarget)) {
          const newTarget = visTarget.logicalElement.visualElements.find(vis => model.getOpdByThingId(vis.id) === model.getOpdByThingId(link.id));
          this.move(link.sourceVisualElement, newTarget, link);
        }
      }
    }
    switchEffectToInOuts(linkEffct) {
      // linkEffct.visible = false;
      const visualProcess = linkEffct.sourceVisualElement instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? linkEffct.sourceVisualElement : linkEffct.targetVisualElements[0].targetVisualElement;
      const visualObject = linkEffct.sourceVisualElement instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? linkEffct.targetVisualElements[0].targetVisualElement : linkEffct.sourceVisualElement;
      const hide = [];
      // this.fixLinksWithNonExistingState(<any>visualProcess);
      const ins = visualProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l !== linkEffct);
      const outs = visualProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l !== linkEffct);
      let links = [...ins, ...outs];
      links = links.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Result || l.type === ConfigurationOptions /* .linkType */.h6.Consumption);
      // if there is no links at the moment - create them
      if (ins.length < 1 || outs.length < 1) {
        const ret = this.connectInOutPair(visualObject.children[0], visualProcess, InOutPairType.Standart);
        links.push(...ret.created);
      } else {
        links.forEach(l => {
          l.visible = true;
          if (ins.includes(l) && l.sourceVisualElement instanceof VisualPart_OpmVisualState /* .OpmVisualState */.y) {
            const shouldReplaceState = !l.sourceVisualElement.logicalElement.visualElements.includes(l.sourceVisualElement);
            if (!shouldReplaceState) {
              return;
            }
            const newState = visualObject.children.find(ch => ch.logicalElement.text === l.sourceVisualElement.logicalElement.text);
            const sp = l.sourceVisualElementPort;
            const tp = l.targetVisualElementPort;
            // if the states was supressed - express will create new states with other ids...
            const ret = this.move(newState, visualProcess, l);
            ret.BreakPoints = l.BreakPoints;
            ret.sourceVisualElementPort = sp;
            ret.targetVisualElementPort = tp;
          } else if (outs.includes(l) && l.targetVisualElements[0].targetVisualElement instanceof VisualPart_OpmVisualState /* .OpmVisualState */.y) {
            const shouldReplaceState = !l.targetVisualElements[0].targetVisualElement.logicalElement.visualElements.includes(l.targetVisualElements[0].targetVisualElement);
            if (!shouldReplaceState) {
              return;
            }
            const newState = visualObject.children.find(ch => ch.logicalElement.text === l.targetVisualElements[0].targetVisualElement.logicalElement.text);
            const sp = l.sourceVisualElementPort;
            const tp = l.targetVisualElementPort;
            // if the states was supressed - express will create new states with other ids...
            const ret = this.move(visualProcess, newState, l);
            ret.BreakPoints = l.BreakPoints;
            ret.sourceVisualElementPort = sp;
            ret.targetVisualElementPort = tp;
          }
        });
      }
      linkEffct.remove();
      return {
        success: true,
        show: links,
        hide: hide
      };
    }
    switchInOutsToEffect(link) {
      const visualProcess = link.sourceVisualElement instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? link.sourceVisualElement : link.targetVisualElements[0].targetVisualElement;
      let visualObject = link.sourceVisualElement instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? link.targetVisualElements[0].targetVisualElement : link.sourceVisualElement;
      if (visualObject instanceof VisualPart_OpmVisualState /* .OpmVisualState */.y) {
        visualObject = visualObject.fatherObject;
      }
      let existingEffectVisual;
      let links = [...visualProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing, ...visualProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing];
      existingEffectVisual = links.find(l => l.type === ConfigurationOptions /* .linkType */.h6.Effect);
      if (!existingEffectVisual) {
        const params = {
          type: ConfigurationOptions /* .linkType */.h6.Effect,
          connection: ConfigurationOptions /* .linkConnectionType */.zv.enviromental
        };
        const ret = this.connect(visualProcess, visualObject, params);
        existingEffectVisual = ret;
      }
      existingEffectVisual.visible = true;
      const hide = [];
      const show = [existingEffectVisual];
      links = links.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Result || l.type === ConfigurationOptions /* .linkType */.h6.Consumption);
      links.forEach(l => {
        l.visible = false;
        hide.push(l);
      });
      let rr = this.model.getRelatedRelationsByLogicalLink(existingEffectVisual.logicalElement);
      if (!rr && links.length > 0) {
        rr = this.model.getRelatedRelationsByLogicalLink(links[0].logicalElement);
      }
      const logicalEffect = this.model.getLogicalElementByVisualId(existingEffectVisual.id);
      if (rr && !rr.includes(logicalEffect)) {
        this.model.addLinkToExistingRelatedRelation(logicalEffect, rr);
      }
      if (!rr && links.length > 0) {
        this.model.addNewRelatedRelation([logicalEffect, links[0].logicalElement]);
      }
      return {
        success: true,
        show: show,
        hide: hide
      };
    }
    isHavingInouts(source, target) {
      for (const visSrc of source.logicalElement.visualElements) {
        for (const visTrgt of target.logicalElement.visualElements) {
          if (this.isHavingVisibleInOuts(visSrc, visTrgt).isHaving === true || this.isHavingHiddenInOuts(visSrc, visTrgt).isHaving === true) {
            return true;
          }
        }
      }
      return false;
    }
    isNeededInOutsChange(source, target, link) {
      for (const visSrc of source.logicalElement.visualElements) {
        for (const visTrgt of target.logicalElement.visualElements) {
          if (this.isVisibleInOutsNeedsChange(visSrc, visTrgt, link) === true || this.isHavingHiddenInOuts(visSrc, visTrgt).isHaving === true) {
            return true;
          }
        }
      }
      return false;
    }
    isHavingHiddenInOuts(source, target) {
      const visualProcess = source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? source : target;
      let visualObject = source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? target : source;
      if (visualObject instanceof VisualPart_OpmVisualState /* .OpmVisualState */.y) {
        visualObject = visualObject.fatherObject;
      }
      const ins = visualProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l.type !== ConfigurationOptions /* .linkType */.h6.Effect && l.visible === false);
      const outs = visualProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l.type !== ConfigurationOptions /* .linkType */.h6.Effect && l.visible === false);
      if (ins.length < 1 || outs.length < 1) {
        return {
          isHaving: false,
          ins: ins,
          outs: outs
        };
      }
      return {
        isHaving: true,
        ins: ins,
        outs: outs
      };
    }
    isHavingVisibleInOuts(source, target) {
      if (!source || !target) {
        return {
          isHaving: false,
          ins: [],
          outs: []
        };
      }
      let link;
      if (source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o && target instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I) {
        link = "result"; // It's a result link
      } else if (source instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I && target instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o) {
        link = "consumption"; // It's a consumption link
      }
      const visualProcess = source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? source : target;
      let visualObject = source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? target : source;
      // If the visualObject is a state, use its parent (father) object
      if (visualObject instanceof VisualPart_OpmVisualState /* .OpmVisualState */.y) {
        visualObject = visualObject.fatherObject;
      }
      let ins = visualProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l.type !== ConfigurationOptions /* .linkType */.h6.Effect && l.type !== ConfigurationOptions /* .linkType */.h6.Instrument);
      let outs = visualProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l.type !== ConfigurationOptions /* .linkType */.h6.Effect);
      // This loop is for checking that In/Out links from object states to inzoomed Processes are also checked.
      if (visualObject instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I) {
        const children = visualProcess.getChildren().filter(element => element instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o);
        if (children.length > 0) {
          // Sort subprocesses by hierarchy and position
          let currentOrderedSubProcesses = children.sort((p1, p2) => {
            const p1HasChildren = p1.children.length > 0;
            const p2HasChildren = p2.children.length > 0;
            if (p1HasChildren && !p2HasChildren) {
              return 1;
            }
            if (!p1HasChildren && p2HasChildren) {
              return -1;
            }
            return p1.getPosition().y - p2.getPosition().y;
          });
          // Iterate over all subprocesses to enforce the rules
          for (let i = 0; i < currentOrderedSubProcesses.length; i++) {
            const visualChildProcess = currentOrderedSubProcesses[i];
            // Get incoming (consumption), outgoing (result), and other links for the current subprocess
            const childIns = visualChildProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Consumption);
            const childOuts = visualChildProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Result);
            if (childOuts.length === 0 && childIns.length === 0) {
              // There are no links in this sub-process to check
              continue;
            }
            if (link === "result") {
              // Rule 1: Validate "in" links (consumption) against "out" links (result) in lower subprocesses
              for (let j = i + 1; j < currentOrderedSubProcesses.length; j++) {
                const lowerProcess = currentOrderedSubProcesses[j];
                const lowerOuts = lowerProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Result);
                // Mark childIns as "change" if a valid result exists in a lower subprocess
                if (lowerOuts.length > 0) {
                  return {
                    isHaving: true,
                    ins: [...ins, ...childIns],
                    outs: [...outs, ...lowerOuts]
                  };
                }
              }
            }
            if (link === "consumption") {
              // Rule 2: Validate "out" links (result) against "in" links (consumption) in higher subprocesses
              for (let j = i - 1; j >= 0; j--) {
                const higherProcess = currentOrderedSubProcesses[j];
                const higherIns = higherProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Consumption);
                // Mark childOuts as "change" if a valid consumption exists in a higher subprocess
                if (higherIns.length > 0) {
                  return {
                    isHaving: true,
                    ins: [...ins, ...higherIns],
                    outs: [...outs, ...childOuts]
                  };
                }
              }
            }
          }
        }
      }
      // Return false if no valid ins or outs exist
      if (ins.length < 1 || outs.length < 1 || ins.length !== outs.length) {
        return {
          isHaving: false,
          ins: ins,
          outs: outs
        };
      }
      // Return true if valid ins and outs exist
      return {
        isHaving: true,
        ins: ins,
        outs: outs
      };
    }
    isVisibleInOutsNeedsChange(source, target, link) {
      if (!source || !target) {
        return false;
      }
      let linkChecked;
      if (source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o && target instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I) {
        linkChecked = "result"; // It's a result linkChecked
      } else if (source instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I && target instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o) {
        linkChecked = "consumption"; // It's a consumption linkChecked
      }
      const visualProcess = source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? source : target;
      let visualObject = source instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o ? target : source;
      const children = visualProcess.getChildren().filter(element => element instanceof VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o);
      if (children.length === 0) {
        return false;
      }
      let ins = visualProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Consumption);
      let outs = visualProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Result);
      // This loop is for checking that In/Out links from object states to inzoomed Processes are also checked.
      if (visualObject instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I) {
        // Sort subprocesses by hierarchy and position
        let currentOrderedSubProcesses = children.sort((p1, p2) => {
          const p1HasChildren = p1.children.length > 0;
          const p2HasChildren = p2.children.length > 0;
          if (p1HasChildren && !p2HasChildren) {
            return 1;
          }
          if (!p1HasChildren && p2HasChildren) {
            return -1;
          }
          return p1.getPosition().y - p2.getPosition().y;
        });
        // Extract the source and target from the link
        const linkSource = link.sourceVisualElement.id;
        const linkTarget = link.targetVisualElements[0].targetVisualElement.id;
        // Get the index of the subprocess in the current ordered list
        const processIndex = currentOrderedSubProcesses.findIndex(subProcess => subProcess.id === linkSource || subProcess.id === linkTarget);
        // If the link doesn't involve a recognized subprocess, return false
        if (processIndex === -1) {
          return false;
        }
        if (linkChecked === "consumption") {
          // Rule 1: Validate "in" links (consumption) against "out" links (result) in lower subprocesses
          for (let i = processIndex + 1; i < currentOrderedSubProcesses.length; i++) {
            const lowerProcess = currentOrderedSubProcesses[i];
            // Check if the link is outgoing from the object or its states
            const lowerOuts = lowerProcess.getLinksWithOtherAndItsChildren(visualObject).outGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Result);
            if (lowerOuts.length > 0) {
              return true; // Rule 1 satisfied
            }
          }
        } else if (linkChecked === "result") {
          // Rule 2: Validate "out" links (result) against "in" links (consumption) in higher subprocesses
          for (let i = processIndex - 1; i >= 0; i--) {
            const higherProcess = currentOrderedSubProcesses[i];
            // Check if the link is incoming to the object or its states
            const higherIns = higherProcess.getLinksWithOtherAndItsChildren(visualObject).inGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Consumption);
            if (higherIns.length > 0) {
              return true; // Rule 2 satisfied
            }
          }
        }
      }
      // Return false if no valid ins or outs exist
      if (ins.length < 1 || outs.length < 1 || ins.length !== outs.length) {
        return false;
      }
      // Return true if valid ins and outs exist
      return true;
    }
    canChangeArcType(newArcType, visualLinks, side) {
      if (side === "target" && newArcType === ConfigurationOptions /* .LinkLogicalConnection */.qK.Or) {
        const statesFromSameObject = visualLinks.filter(l => l.source.constructor.name.includes("State")).map(l => l.source.fatherObject);
        // if there are 2 or more states from the same object in the relation it must be XOR
        if (statesFromSameObject.length !== new Set(statesFromSameObject).size) {
          return false;
        }
      }
      if (newArcType === ConfigurationOptions /* .LinkLogicalConnection */.qK.Xor || side === "target") {
        return true;
      }
      const condition = !visualLinks.find(l => l.type !== ConfigurationOptions /* .linkType */.h6.Result) && this.isHavingVisibleInOuts(visualLinks[0].source, visualLinks[0].target).isHaving;
      if (condition) {
        return false;
      }
      return true;
    }
  }
  // Slayer: Temporary.
  function createLogicalLink(link, model, opd, source, target) {
    const logical = factoryLogicalLink(link.type, model);
    logical.sourceLogicalElement = source;
    logical.targetLogicalElements = new Array();
    logical.targetLogicalElements.push(target);
    logical.linkConnectionType = ConfigurationOptions /* .linkConnectionType */.zv.systemic; // TODO: Is needed?
    logical.linkType = link.type;
    // This will be removed
    const visual = logical.visualElements[0];
    model.currentOpd.removeVisual(visual);
    if (opd) {
      opd.add(visual);
    }
    if (logical instanceof LogicalPart_OpmProceduralRelation /* .OpmProceduralRelation */.W) {
      logical.condition = link.isCondition;
      logical.event = link.isEvent;
      logical.negation = link.isNegation;
    }
    return logical;
  }
  function factoryOpmLink(link, logical) {
    switch (link) {
      case ConfigurationOptions /* .linkType */.h6.Agent:
      case ConfigurationOptions /* .linkType */.h6.Result:
      case ConfigurationOptions /* .linkType */.h6.Consumption:
      case ConfigurationOptions /* .linkType */.h6.Effect:
      case ConfigurationOptions /* .linkType */.h6.Instrument:
      case ConfigurationOptions /* .linkType */.h6.Invocation:
      case ConfigurationOptions /* .linkType */.h6.OvertimeException:
      case ConfigurationOptions /* .linkType */.h6.UndertimeException:
      case ConfigurationOptions /* .linkType */.h6.UndertimeOvertimeException:
        return new VisualPart_OpmProceduralLink /* .OpmProceduralLink */.E(undefined, logical);
      case ConfigurationOptions /* .linkType */.h6.Aggregation:
      case ConfigurationOptions /* .linkType */.h6.Exhibition:
      case ConfigurationOptions /* .linkType */.h6.Generalization:
      case ConfigurationOptions /* .linkType */.h6.Instantiation:
        return new VisualPart_OpmFundamentalLink /* .OpmFundamentalLink */.s(undefined, logical);
      case ConfigurationOptions /* .linkType */.h6.Unidirectional:
      case ConfigurationOptions /* .linkType */.h6.Bidirectional:
        return new VisualPart_OpmTaggedLink /* .OpmTaggedLink */.Z(undefined, logical);
    }
    throw new Error("bad link type");
  }
  function factoryLogicalLink(link, model) {
    switch (link) {
      case ConfigurationOptions /* .linkType */.h6.Agent:
      case ConfigurationOptions /* .linkType */.h6.Result:
      case ConfigurationOptions /* .linkType */.h6.Consumption:
      case ConfigurationOptions /* .linkType */.h6.Effect:
      case ConfigurationOptions /* .linkType */.h6.Instrument:
      case ConfigurationOptions /* .linkType */.h6.Invocation:
      case ConfigurationOptions /* .linkType */.h6.OvertimeException:
      case ConfigurationOptions /* .linkType */.h6.UndertimeException:
      case ConfigurationOptions /* .linkType */.h6.UndertimeOvertimeException:
        return model.logicalFactory(model_entities_enum /* .RelationType */.z.Procedural, undefined);
      case ConfigurationOptions /* .linkType */.h6.Aggregation:
      case ConfigurationOptions /* .linkType */.h6.Exhibition:
      case ConfigurationOptions /* .linkType */.h6.Generalization:
      case ConfigurationOptions /* .linkType */.h6.Instantiation:
        return model.logicalFactory(model_entities_enum /* .RelationType */.z.Fundamental, undefined);
      case ConfigurationOptions /* .linkType */.h6.Unidirectional:
      case ConfigurationOptions /* .linkType */.h6.Bidirectional:
        return model.logicalFactory(model_entities_enum /* .RelationType */.z.Tagged, undefined);
    }
    throw new Error("bad link type");
  }

  /***/
}),
/***/94441: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Q7: () => (/* binding */all),
    V: () => (/* binding */consumptions),
    VK: () => (/* binding */tagged),
    W3: () => (/* binding */proceduralEnablers),
    Xv: () => (/* binding */results),
    ex: () => (/* binding */structural),
    gF: () => (/* binding */fundamental),
    ij: () => (/* binding */proceduralTransformers),
    ju: () => (/* binding */createSet),
    kZ: () => (/* binding */invoactions),
    n9: () => (/* binding */instruments),
    q0: () => (/* binding */commutativeDirect),
    qj: () => (/* binding */procedural)

  });

  class Set {
    constructor(set) {
      this.set = set;
      this.set = set;
    }
    contains(type) {
      return this.set.includes(type);
    }
  }
  function createSet(...set) {
    return new Set(set);
  }
  const all = createSet(ConfigurationOptions /* .linkType */.h6.Result, ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Aggregation, ConfigurationOptions /* .linkType */.h6.Bidirectional, ConfigurationOptions /* .linkType */.h6.Unidirectional, ConfigurationOptions /* .linkType */.h6.Exhibition, ConfigurationOptions /* .linkType */.h6.Generalization, ConfigurationOptions /* .linkType */.h6.Instantiation, ConfigurationOptions /* .linkType */.h6.Agent, ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Effect, ConfigurationOptions /* .linkType */.h6.Instrument);
  const fundamental = createSet(ConfigurationOptions /* .linkType */.h6.Aggregation, ConfigurationOptions /* .linkType */.h6.Exhibition, ConfigurationOptions /* .linkType */.h6.Generalization, ConfigurationOptions /* .linkType */.h6.Instantiation);
  const structural = createSet(ConfigurationOptions /* .linkType */.h6.Aggregation, ConfigurationOptions /* .linkType */.h6.Exhibition, ConfigurationOptions /* .linkType */.h6.Generalization, ConfigurationOptions /* .linkType */.h6.Instantiation);
  const procedural = createSet(ConfigurationOptions /* .linkType */.h6.Result, ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Effect, ConfigurationOptions /* .linkType */.h6.Instrument, ConfigurationOptions /* .linkType */.h6.Agent);
  const proceduralEnablers = createSet(ConfigurationOptions /* .linkType */.h6.Instrument, ConfigurationOptions /* .linkType */.h6.Agent);
  const proceduralTransformers = createSet(ConfigurationOptions /* .linkType */.h6.Result, ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Effect);
  const instruments = createSet(ConfigurationOptions /* .linkType */.h6.Instrument, ConfigurationOptions /* .linkType */.h6.Agent);
  const consumptions = createSet(ConfigurationOptions /* .linkType */.h6.Consumption);
  const results = createSet(ConfigurationOptions /* .linkType */.h6.Result);
  const invoactions = createSet(ConfigurationOptions /* .linkType */.h6.Invocation);
  const consumers = createSet(ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Result);
  const tagged = createSet(ConfigurationOptions /* .linkType */.h6.Unidirectional, ConfigurationOptions /* .linkType */.h6.Bidirectional);
  const proceduralWithInvocation = createSet(ConfigurationOptions /* .linkType */.h6.Result, ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Effect, ConfigurationOptions /* .linkType */.h6.Instrument, ConfigurationOptions /* .linkType */.h6.Agent, ConfigurationOptions /* .linkType */.h6.Invocation);
  const commutativeDirect = createSet(ConfigurationOptions /* .linkType */.h6.Agent, ConfigurationOptions /* .linkType */.h6.Instrument, ConfigurationOptions /* .linkType */.h6.Consumption, ConfigurationOptions /* .linkType */.h6.Result, ConfigurationOptions /* .linkType */.h6.Effect, ConfigurationOptions /* .linkType */.h6.UndertimeException, ConfigurationOptions /* .linkType */.h6.OvertimeException, ConfigurationOptions /* .linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* .linkType */.h6.Unidirectional, ConfigurationOptions /* .linkType */.h6.Bidirectional);

  /***/
}),
/***/83136: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Oj: () => (/* binding */SatisfiedRequirementSetModule)

  });

  // the manager of the whole requirements data (if active, and using the structural classes).
  class SatisfiedRequirementSetModule {
    constructor(params, model) {
      this._isRequirementObject = false;
      this._isRequirementSetObject = false;
      if (params) {
        this.fromJson(params, model);
      }
    }
    set isRequirementObject(value) {
      this._isRequirementObject = value;
    }
    set isRequirementSetObject(value) {
      this._isRequirementSetObject = value;
    }
    get isRequirementObject() {
      return this._isRequirementObject;
    }
    get isRequirementSetObject() {
      return !!this._isRequirementSetObject;
    }
    removeSingleRequirement(lid) {
      const removedVisuals = [];
      if (this.getRequirementsSet()) {
        const set = this.getRequirementsSet();
        const removedElements = set.removeSingleRequirement(lid);
        removedVisuals.push(...removedElements);
        if (this.getRequirementsSet().getAllRequirements().length === 0) {
          if (this.getRequirementsSet().getRequirementSetObject()) {
            const setObject = this.getRequirementsSet().getRequirementSetObject();
            for (let i = setObject.logicalElement.visualElements.length - 1; i >= 0; i--) {
              const removed = setObject.logicalElement.visualElements[i].remove();
              removedVisuals.push(...removed);
            }
          }
          this._requirementSet = undefined;
        }
      }
      return removedVisuals;
    }
    getRequirementsSet() {
      return this._requirementSet;
    }
    toggleAttribute(shouldHideSetObject = false) {
      return this._requirementSet.toggleAttribute(shouldHideSetObject);
    }
    get requirementSet() {
      return this._requirementSet;
    }
    toJson() {
      const hasRequirementsSet = !!this.getRequirementsSet();
      return {
        isRequirementObject: this.isRequirementObject,
        isRequirementSetObject: this.isRequirementSetObject,
        logicalRequirementSetObjectLID: hasRequirementsSet ? this.getRequirementsSet().getSetObjectLID() : null,
        ownerLID: hasRequirementsSet ? this.getRequirementsSet().getOwnerLID() : null,
        setObjectPos: this.getRequirementsSet()?.lastPosition,
        requirements: hasRequirementsSet ? this.getRequirementsSet().getAllRequirements().map(req => {
          return {
            reqId: req.getRequirementObjectLID(),
            lastPosition: req.lastPosition
          };
        }) : null
      };
    }
    fromJson(json, model) {
      this.isRequirementObject = json.isRequirementObject;
      this.isRequirementSetObject = json.isRequirementSetObject;
      if (json.requirements) {
        this._requirementSet = new SatisfiedRequirementSet(model);
        this._requirementSet.fromJson(json);
      }
    }
    createSatisfiedRequirementSet(owner) {
      this._requirementSet = new SatisfiedRequirementSet(owner.logicalElement.opmModel);
      this._requirementSet.create(owner);
    }
    addRequirement(owner) {
      owner.logicalElement.hiddenAttributesModule.satisfiedRequirementSetModule.getRequirementsSet().addRequirement();
    }
    hideSingleRequirement(visual) {
      const requirement = this._requirementSet.getAllRequirements().find(req => req.getRequirementObjectLID() === visual.logicalElement.lid);
      if (requirement) {
        requirement.backupLastPosition();
      }
      visual.remove();
    }
  }
  // represents each requirements *SET* object (the one which all the requirements connected to).
  class SatisfiedRequirementSet {
    constructor(model) {
      this.requirements = [];
      this.lastPosition = {};
      this.updateModel(model);
    }
    updateModel(updated) {
      this.model = updated;
    }
    create(owner) {
      this.ownerLID = owner.logicalElement.lid;
      const ret = owner.logicalElement.opmModel.createToScreen(model_entities_enum /* .EntityType */.c.Object);
      const requirementsSetObject = ret.visual;
      requirementsSetObject.setDefaultStyleFields();
      this.logicalRequirementSetObjectLID = requirementsSetObject.logicalElement.lid;
      ret.logical.setText("Satisfied Requirement Set");
      ret.logical.hiddenAttributesModule.satisfiedRequirementSetModule.isRequirementSetObject = true;
      this.connectOwnerToRequirementSetObject();
      this.setInitialPositionAndSize(owner, requirementsSetObject);
      this.copyRequirementsSetObjectToRequirementsOpd(owner, requirementsSetObject);
      if (owner.fatherObject && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(owner)) {
        requirementsSetObject.fatherObject = owner.fatherObject;
      }
      this.addRequirement();
    }
    getSetObjectLID() {
      return this.logicalRequirementSetObjectLID;
    }
    updateSetObjectLID(lid) {
      this.logicalRequirementSetObjectLID = lid;
    }
    getOwnerLID() {
      return this.ownerLID;
    }
    getAllRequirements() {
      return this.requirements;
    }
    getOwnerAtCurrentOpd() {
      const logical = this.model.getLogicalElementByLid(this.ownerLID);
      return this.model.currentOpd.getVisualElementByLogical(logical);
    }
    updateOwnerLID(lid) {
      this.ownerLID = lid;
    }
    copyRequirementsSetObjectToRequirementsOpd(owner, requirementsSetObject) {
      const model = owner.logicalElement.opmModel;
      const currentOpd = model.currentOpd;
      const opd = model.getOrCreateRequirementsOpd();
      model.currentOpd = opd;
      const ownerCopy = owner.copyToOpd(opd);
      const setObjectCopy = requirementsSetObject.copyToOpd(opd);
      model.links.connect(ownerCopy, setObjectCopy, {
        type: ConfigurationOptions /* .linkType */.h6.Exhibition,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
      model.currentOpd = currentOpd;
    }
    setInitialPositionAndSize(owner, requirementsSetObject) {
      requirementsSetObject.xPos = owner.xPos;
      requirementsSetObject.yPos = owner.yPos + 150;
      requirementsSetObject.width = 130;
      requirementsSetObject.height = 65;
    }
    toggleAttribute(shouldHideSetObject = false) {
      const removed = [];
      const missingRequirements = this.requirements.filter(req => !req.getRequirementObject());
      if (missingRequirements.length === 0) {
        for (const req of this.requirements) {
          removed.push(...req.removeRequirementObject());
        }
        if (shouldHideSetObject) {
          this.backupLastPosition();
          const removedSetObject = this.getRequirementSetObject()?.remove();
          if (removedSetObject) {
            removed.push(removedSetObject);
          }
        }
      } else {
        this.restoreAttribute();
      }
      return removed;
    }
    restoreAttribute() {
      let requirementsSetObject = this.getRequirementSetObject();
      const lastPos = this.lastPosition[this.model.currentOpd.id];
      if (!requirementsSetObject) {
        const logical = this.model.getLogicalElementByLid(this.logicalRequirementSetObjectLID);
        requirementsSetObject = logical.visualElements[0].copyToOpd(this.model.currentOpd);
        if (this.getOwnerAtCurrentOpd().fatherObject) {
          requirementsSetObject.fatherObject = this.getOwnerAtCurrentOpd().fatherObject;
        }
        if (lastPos) {
          requirementsSetObject.xPos = lastPos.xPos;
          requirementsSetObject.yPos = lastPos.yPos;
        }
      }
      if (!this.getOwnerAtCurrentOpd().getLinksWith(requirementsSetObject).outGoing.find(l => l.type === ConfigurationOptions /* .linkType */.h6.Exhibition)) {
        const link = this.model.links.connect(this.getOwnerAtCurrentOpd(), requirementsSetObject, {
          type: ConfigurationOptions /* .linkType */.h6.Exhibition,
          connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
        });
        if (link && lastPos?.trianglePos) {
          link.setSymbolPos(lastPos.trianglePos[0], lastPos.trianglePos[1]);
        }
      }
      for (const req of this.requirements) {
        req.restoreRequirement(this.model, requirementsSetObject);
      }
    }
    addRequirement() {
      let requirementsSetObject = this.getRequirementSetObject();
      if (!requirementsSetObject) {
        this.toggleAttribute(); // closes all requirements
        this.toggleAttribute(); // opens all requirements and created the requirements set object.
        requirementsSetObject = this.getRequirementSetObject();
      }
      const requirement = new SatisfiedRequirement(this.model);
      requirement.create(requirementsSetObject, this.requirements.length + 1);
      this.requirements.push(requirement);
      this.copyRequirementsObjectToRequirementsOpd(requirement);
      const logicalOwner = this.model.getOwnerOfRequirementSetObjectByLID(this.getRequirementSetObject().logicalElement.lid);
      const owner = this.model.currentOpd.visualElements.find(v => v.logicalElement.lid === logicalOwner?.lid);
      if (owner?.fatherObject && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(owner)) {
        requirement.getRequirementObject().fatherObject = owner.fatherObject;
      }
      return requirement;
    }
    copyRequirementsObjectToRequirementsOpd(requirement) {
      const model = requirement.getRequirementObject().logicalElement.opmModel;
      const requirementObject = requirement.getRequirementObject();
      const owner = requirementObject.getLinks().inGoing[0].source;
      const currentOpd = model.currentOpd;
      const opd = model.getOrCreateRequirementsOpd();
      model.currentOpd = opd;
      const source = opd.getVisualElementByLogical(owner.logicalElement);
      const targetCopy = requirementObject.copyToOpd(opd);
      model.links.connect(source, targetCopy, {
        type: ConfigurationOptions /* .linkType */.h6.Aggregation,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
      model.currentOpd = currentOpd;
    }
    connectOwnerToRequirementSetObject() {
      const requirementsSetObject = this.getRequirementSetObject();
      return this.model.links.connect(this.getOwnerAtCurrentOpd(), requirementsSetObject, {
        type: ConfigurationOptions /* .linkType */.h6.Exhibition,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
    }
    getRequirementSetObject() {
      const logical = this.model.getLogicalElementByLid(this.logicalRequirementSetObjectLID);
      return this.model.currentOpd.getVisualElementByLogical(logical);
    }
    removeRequirementsSetObject() {
      this.getRequirementSetObject()?.remove();
    }
    fromJson(json) {
      this.ownerLID = json.ownerLID;
      this.logicalRequirementSetObjectLID = json.logicalRequirementSetObjectLID;
      for (const reqObjectData of json.requirements) {
        const req = new SatisfiedRequirement(this.model);
        req.setLogicalRequirementObjectLID(reqObjectData.reqId);
        req.lastPosition = reqObjectData.lastPosition || {};
        this.requirements.push(req);
      }
      if (json.setObjectPos) {
        this.lastPosition = json.setObjectPos;
      }
    }
    removeSingleRequirement(lid) {
      const reqToRemove = this.requirements.find(req => req.getRequirementObjectLID() === lid);
      if (reqToRemove) {
        this.requirements.splice(this.requirements.indexOf(reqToRemove), 1);
      }
      const removed = [];
      const logical = this.model.getLogicalElementByLid(lid);
      if (logical?.getStereotype()) {
        this.model.removeStereotype(logical.visualElements[0]);
      }
      const visuals = logical?.visualElements || [];
      for (let i = visuals.length - 1; i >= 0; i--) {
        if (visuals[i]) {
          removed.push(...visuals[i].remove());
        }
      }
      this.updateRequirementsNumberingAfterRemoval();
      return removed;
    }
    updateRequirementsNumberingAfterRemoval() {
      for (let i = 0; i < this.requirements.length; i++) {
        const logical = this.model.getLogicalElementByLid(this.requirements[i].getRequirementObjectLID());
        logical.setText("Satisfied Requirement #" + (i + 1));
      }
    }
    backupLastPosition() {
      if (this.getRequirementSetObject()) {
        this.lastPosition[this.model.currentOpd.id] = {
          xPos: this.getRequirementSetObject().xPos,
          yPos: this.getRequirementSetObject().yPos,
          trianglePos: this.getRequirementSetObject()?.getLinks().inGoing[0]?.getSymbolPos()
        };
      }
    }
  }
  // represents each requirement object
  class SatisfiedRequirement {
    constructor(model) {
      this.updateModel(model);
      this.lastPosition = {};
    }
    updateModel(updated) {
      this.model = updated;
    }
    create(requirementSetObject, index) {
      const requirementObject = this.model.createToScreen(model_entities_enum /* .EntityType */.c.Object).visual;
      this.logicalRequirementObjectLID = requirementObject.logicalElement.lid;
      const logical = requirementObject.logicalElement;
      logical.hiddenAttributesModule.satisfiedRequirementSetModule.isRequirementObject = true;
      this.setInitialPositionAndSize(requirementSetObject, requirementObject, index);
      this.model.setAsComputational(requirementObject);
      logical.setText("Satisfied Requirement #" + index);
      const value = "Requirement name or ID";
      logical.value = value;
      logical.valueType = ConfigurationOptions /* .valueType */._x.String;
      const state = requirementObject.states[0];
      const logicalState = state.logicalElement;
      if (logicalState.isAutoFormat()) {
        logicalState.toggleAutoFormat();
      }
      logicalState.setText(value);
      state.width = 120;
      state.height = 45;
      state.xPos = requirementObject.xPos + (requirementObject.width - state.width) / 2;
      state.yPos = requirementObject.yPos + requirementObject.height - 5;
      this.connectRequirementSetObjectToRequirementObject(requirementSetObject, requirementObject);
    }
    setLogicalRequirementObjectLID(value) {
      this.logicalRequirementObjectLID = value;
    }
    getRequirementObjectLID() {
      return this.logicalRequirementObjectLID;
    }
    setInitialPositionAndSize(requirementSetObject, requirementObject, index) {
      requirementObject.xPos = requirementSetObject.xPos;
      requirementObject.yPos = requirementSetObject.yPos + 100 + (index - 1) * 150;
      requirementObject.width = 215;
      requirementObject.height = 100;
      requirementObject.refX = 0.5;
      requirementObject.refY = 0.2;
    }
    connectRequirementSetObjectToRequirementObject(requirementSetObject, requirementObject) {
      const model = requirementSetObject.logicalElement.opmModel;
      const link = model.links.connect(requirementSetObject, requirementObject, {
        type: ConfigurationOptions /* .linkType */.h6.Aggregation,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
      link.setSymbolPos(requirementSetObject.xPos - 45, requirementSetObject.yPos + 60);
      return link;
    }
    getRequirementObject() {
      const logical = this.model.getLogicalElementByLid(this.logicalRequirementObjectLID);
      return this.model.currentOpd.getVisualElementByLogical(logical);
    }
    removeRequirementObject() {
      this.backupLastPosition();
      const removed = this.getRequirementObject()?.remove() || [];
      return [...removed];
    }
    restoreRequirement(model, requirementsSetObject) {
      let requirementObject = this.getRequirementObject();
      const lastPos = this.lastPosition[model.currentOpd.id];
      if (!requirementObject) {
        const logical = this.model.getLogicalElementByLid(this.logicalRequirementObjectLID);
        requirementObject = logical.visualElements[0].copyToOpd(model.currentOpd);
        requirementObject.resetColors();
        const logicalOwner = this.model.getOwnerOfRequirementSetObjectByLID(requirementsSetObject.logicalElement.lid);
        const owner = this.model.currentOpd.visualElements.find(v => v.logicalElement.lid === logicalOwner?.lid);
        if (owner?.fatherObject && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(owner)) {
          requirementObject.fatherObject = owner.fatherObject;
        }
        if (lastPos) {
          requirementObject.xPos = lastPos.xPos;
          requirementObject.yPos = lastPos.yPos;
        }
      }
      const link = model.links.connect(requirementsSetObject, requirementObject, {
        type: ConfigurationOptions /* .linkType */.h6.Aggregation,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
      if (link && lastPos?.trianglePos) {
        link.setSymbolPos(lastPos.trianglePos[0], lastPos.trianglePos[1]);
      }
    }
    backupLastPosition() {
      if (this.getRequirementObject()) {
        this.lastPosition[this.model.currentOpd.id] = {
          xPos: this.getRequirementObject().xPos,
          yPos: this.getRequirementObject().yPos,
          trianglePos: this.getRequirementObject()?.getLinks().inGoing[0]?.getSymbolPos()
        };
      }
    }
  }

  /***/
}),
/***/63877: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    c: () => (/* binding */EntityType),
    z: () => (/* binding */RelationType)

  });
  var EntityType = /*#__PURE__*/function (EntityType) {
    EntityType.Object = "OpmLogicalObject";
    EntityType.Process = "OpmLogicalProcess";
    EntityType.State = "OpmLogicalState";
    return EntityType;
  }(EntityType || {});
  var RelationType = /*#__PURE__*/function (RelationType) {
    RelationType[RelationType.Procedural = 0] = "Procedural";
    RelationType[RelationType.Tagged = 1] = "Tagged";
    RelationType[RelationType.Fundamental = 2] = "Fundamental";
    return RelationType;
  }(RelationType || {});

  /***/
}),
/***/86132: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    y: () => (/* binding */ValueAttributeType)

  });
  var ValueAttributeType = /*#__PURE__*/function (ValueAttributeType) {
    ValueAttributeType[ValueAttributeType.STRING = 0] = "STRING";
    ValueAttributeType[ValueAttributeType.CHAR = 1] = "CHAR";
    ValueAttributeType[ValueAttributeType.INTEGER = 2] = "INTEGER";
    ValueAttributeType[ValueAttributeType.FLOAT = 3] = "FLOAT";
    ValueAttributeType[ValueAttributeType.BOOLEAN = 4] = "BOOLEAN";
    return ValueAttributeType;
  }(ValueAttributeType || {});

  /***/
}),
/***/26692: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    i: () => (/* binding */ValidationModule),
    b: () => (/* binding */getValidationColor)
  });
