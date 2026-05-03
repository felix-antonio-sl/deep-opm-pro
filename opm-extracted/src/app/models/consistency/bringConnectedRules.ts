// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/bringConnectedRules.ts
// Extracted by opm-extracted/tools/extract.mjs

class BringProceduralEnablersRelations {
  constructor() {
    this.ruleType = [BringConnectedTypes.proceduralEnablers];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if (proceduralEnablers.contains(logicalConnection.linkType)) {
      relations.push(logicalConnection);
      entities.push(logicalConnection.sourceLogicalElement);
      entities = [...entities, ...logicalConnection.targetLogicalElements];
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
class BringProceduraTransformersRelations {
  constructor() {
    this.ruleType = [BringConnectedTypes.proceduralTransformers];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if (proceduralTransformers.contains(logicalConnection.linkType)) {
      relations.push(logicalConnection);
      entities.push(logicalConnection.sourceLogicalElement);
      entities = [...entities, ...logicalConnection.targetLogicalElements];
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
class BringUniBiDirectionalRelations {
  constructor() {
    this.ruleType = [BringConnectedTypes.tagged];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if ([linkType.Bidirectional, linkType.Unidirectional].includes(logicalConnection.linkType)) {
      relations.push(logicalConnection);
      entities.push(logicalConnection.sourceLogicalElement);
      entities = [...entities, ...logicalConnection.targetLogicalElements];
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
class BringFundamentalRelations {
  constructor() {
    this.ruleType = [BringConnectedTypes.fundamental];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if (fundamental.contains(logicalConnection.linkType)) {
      const logicalTarget = logicalConnection.targetLogicalElements[0];
      if (OPCloudUtils.isInstanceOfLogicalObject(logicalTarget)) {
        if (logicalTarget.isSatisfiedRequirementObject()) {
          return {
            relations,
            entities
          };
        }
      }
      if (logicalConnection.targetLogicalElements[0].isValueTyped && logicalConnection.targetLogicalElements[0].isValueTyped()) {
        return {
          relations: relations,
          entities: entities
        };
      }
      relations.push(logicalConnection);
      entities.push(logicalConnection.sourceLogicalElement);
      entities = [...entities, ...logicalConnection.targetLogicalElements];
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
class BringStructuralRelationsThatHasProceduralInParallel {
  constructor() {
    this.ruleType = [BringConnectedTypes.fundamental];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if (structural.contains(logicalConnection.linkType)) {
      let isExistParallel = false;
      const source = logicalConnection.sourceLogicalElement;
      const target = logicalConnection.targetLogicalElements[0];
      const model = logicalConnection.opmModel;
      const modelLinks = model.logicalElements.filter(link => link.constructor.name.includes("OpmProceduralRelation"));
      for (const l of modelLinks) {
        if (l.sourceLogicalElement === source && l.targetLogicalElements[0] === target) {
          isExistParallel = true;
        }
      }
      if (isExistParallel) {
        relations.push(logicalConnection);
        entities.push(logicalConnection.sourceLogicalElement);
        entities = [...entities, ...logicalConnection.targetLogicalElements];
      }
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
class BringExhibitingThing {
  constructor() {
    this.ruleType = [BringConnectedTypes.fundamental];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if (procedural.contains(logicalConnection.linkType) == false) {
      return {
        relations,
        entities
      };
    }
    const source = logicalConnection.sourceLogicalElement instanceof OpmLogicalState ? logicalConnection.sourceLogicalElement.parent : logicalConnection.sourceLogicalElement;
    const target = logicalConnection.targetLogicalElements[0];
    const model = logicalConnection.opmModel;
    const exhibitions = model.logicalElements.filter(link => link.constructor.name.includes("OpmFundamentalRelation") && link.linkType === linkType.Exhibition);
    for (const exh of exhibitions) {
      const current = exh;
      if (current.targetLogicalElements[0].isValueTyped && current.targetLogicalElements[0].isValueTyped()) {
        continue;
      }
      if (current.sourceLogicalElement === source || current.sourceLogicalElement === target || current.targetLogicalElements[0] === source || current.targetLogicalElements[0] === target) {
        relations.push(exh);
        entities.push(current.sourceLogicalElement);
        entities.push(current.targetLogicalElements[0]);
      }
    }
    if (exhibitions.length) {
      relations.push(logicalConnection);
      entities.push(logicalConnection.sourceLogicalElement);
      entities = [...entities, ...logicalConnection.targetLogicalElements];
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
class BringSelfInvocationAsInzoomedInvocation {
  constructor() {
    this.ruleType = [BringConnectedTypes.proceduralTransformers];
  }
  getNeededElements(logicalConnection) {
    const relations = [];
    let entities = [];
    if (logicalConnection.linkType === linkType.Invocation && logicalConnection.sourceLogicalElement === logicalConnection.targetLogicalElements[0]) {
      relations.push(logicalConnection);
      entities.push(logicalConnection.sourceLogicalElement);
      entities = [...entities, ...logicalConnection.targetLogicalElements];
    }
    return {
      relations: relations,
      entities: entities
    };
  }
}
const unfoldingRules = new Array(new BringProceduralEnablersRelations(), new BringProceduraTransformersRelations(), new BringStructuralRelationsThatHasProceduralInParallel(), new BringExhibitingThing());
const inzoomingRules = new Array(new BringFundamentalRelations(), new BringProceduralEnablersRelations(), new BringProceduraTransformersRelations(), new BringStructuralRelationsThatHasProceduralInParallel(), new BringExhibitingThing());
const bringConnectedRules = new Array(new BringFundamentalRelations(), new BringProceduralEnablersRelations(), new BringProceduraTransformersRelations(), new BringStructuralRelationsThatHasProceduralInParallel(), new BringExhibitingThing(), new BringUniBiDirectionalRelations(), new BringSelfInvocationAsInzoomedInvocation());
