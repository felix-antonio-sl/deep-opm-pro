// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/structural.rules.ts
// Extracted by opm-extracted/tools/extract.mjs

class StructuralRule {
  type() {
    return RuleType.STRUCTURAL;
  }
  typeLink() {
    return all;
  }
  shouldBeApplied(source, target, link) {
    return this.typeSource().contains(source) && this.typeTarget().contains(target);
  }
}
class StateCannotConnectToFather extends StructuralRule {
  constructor() {
    super(...arguments);
    this.source = createSet(EntityType.State);
    this.target = createSet(EntityType.Object);
  }
  typeSource() {
    return this.source;
  }
  typeTarget() {
    return this.target;
  }
  canConnect(source, target) {
    return source.fatherObject !== target;
  }
  message() {
    return "The state is linked to its owning object by definition.";
  }
  description() {
    return "The state is linked to its owning object by definition.";
  }
}
class ObjectAndStateCannotConnectToThemeselfs extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Object, EntityType.State);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    return source.logicalElement !== target.logicalElement;
  }
  message() {
    return "Entity cannot connect to itself.";
  }
  description() {
    return "Entity cannot connect to itself.";
  }
}
class StateCannotConnectToFatherStates extends StructuralRule {
  constructor() {
    super(...arguments);
    this.source = createSet(EntityType.State);
    this.target = createSet(EntityType.State);
  }
  typeSource() {
    return this.source;
  }
  typeTarget() {
    return this.target;
  }
  canConnect(source, target) {
    return source.fatherObject !== target.fatherObject;
  }
  message() {
    return "State cannot connect to it's father's other states";
  }
  description() {
    return "State cannot connect to it's father's other states";
  }
}
class ObjectCannotBeConnectedToItsStates extends StructuralRule {
  constructor() {
    super(...arguments);
    this.source = createSet(EntityType.Object);
    this.target = createSet(EntityType.State);
  }
  typeSource() {
    return this.source;
  }
  typeTarget() {
    return this.target;
  }
  canConnect(source, target) {
    return source !== target.fatherObject;
  }
  message() {
    return "Object Cannot Be Connected to Its's States";
  }
  description() {
    return "Object Cannot Be Connected to Its's States";
  }
}
class ThingCannotConnectToFather extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Object);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    return source !== target.fatherObject && target !== source.fatherObject;
  }
  message() {
    return "Cannot be connected to holder.";
  }
  description() {
    return "A Thing Cannot be connected to it's father";
  }
}
class InzoomedProcessCannotConnectToIsSubProcess extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    if (source.isInzoomed() && target.fatherObject === source && !target.logicalElement.getIsWaitingProcess()) {
      return false;
    }
    return true;
  }
  message() {
    return "Inzoomed process cannot be connected to its sub processes by links.";
  }
  description() {
    return "Inzoomed process cannot be connected to its sub processes by links.";
  }
}
class Semifoldinglinks extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process, EntityType.Object);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    if (source.isFoldedUnderThing().isFolded && target.isFoldedUnderThing().isFolded) {
      return false;
    }
    return true;
  }
  message() {
    return "Semi-folded thing cannot connect<br>to another semi-folded thing.";
  }
  description() {
    return "Semi-folded thing cannot connect to another semi-folded thing.";
  }
}
class CannotLinkToValueTypeObjec extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    if (source instanceof OpmVisualObject && source.isValueTyped()) {
      return false;
    }
    if (target instanceof OpmVisualObject && target.isValueTyped()) {
      return false;
    }
    if (source instanceof OpmVisualState && source.isValueTyped()) {
      return false;
    }
    if (target instanceof OpmVisualState && target.isValueTyped()) {
      return false;
    }
    return true;
  }
  message() {
    return "A value-type object cannot be connected with any link.";
  }
  description() {
    return "A value-type object cannot be connected with any link.";
  }
}
class CannotLinkToRequirementObject extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    const model = source.logicalElement.opmModel;
    if (model.getOpdByThingId(source.id)?.requirementsOpd) {
      return true;
    }
    if (OPCloudUtils.isInstanceOfVisualThing(source)) {
      const condition = source.logicalElement.isSatisfiedRequirementObject();
      const stereotype = source.logicalElement.getStereotype();
      const stereotypeTargetBelongsTo = target.logicalElement.getBelongsToStereotyped()?.getStereotype();
      if (condition && stereotype && stereotype === stereotypeTargetBelongsTo) {
        return true;
      }
      if (source.logicalElement.isSatisfiedRequirementSetObject()) {
        if (OPCloudUtils.isInstanceOfVisualObject(target) && target.logicalElement.isSatisfiedRequirementObject()) {
          return true;
        }
        return false;
      }
      if (source.logicalElement.hasRequirements() && OPCloudUtils.isInstanceOfVisualObject(target) && target.logicalElement.isSatisfiedRequirementSetObject()) {
        return true;
      }
      if (source.logicalElement.isSatisfiedRequirementObject() && source.getAllLinksWith(target).outGoing.length === 0) {
        return false;
      }
    }
    if (OPCloudUtils.isInstanceOfVisualThing(target)) {
      if (target.logicalElement.isSatisfiedRequirementSetObject()) {
        return false;
      }
      if (target.logicalElement.isSatisfiedRequirementObject()) {
        return false;
      }
    }
    if (OPCloudUtils.isInstanceOfVisualState(source)) {
      const logicalFather = source.fatherObject.logicalElement;
      if (logicalFather.isSatisfiedRequirementSetObject()) {
        return false;
      }
      if (logicalFather.isSatisfiedRequirementObject()) {
        return false;
      }
    }
    if (OPCloudUtils.isInstanceOfVisualState(target)) {
      const logicalFather = target.fatherObject.logicalElement;
      if (logicalFather.isSatisfiedRequirementSetObject()) {
        return false;
      }
      if (logicalFather.isSatisfiedRequirementObject()) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "A requirement object or requirement set object cannot be connected with any link.";
  }
  description() {
    return "A requirement object or requirement set object cannot be connected with any link.";
  }
}
class SourceAndTargetOnSameOPD extends StructuralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    const model = source.logicalElement.opmModel;
    return model.getOpdByThingId(source.id) === model.getOpdByThingId(target.id);
  }
  message() {
    return "Source and Target must be on the same OPD";
  }
  description() {
    return "Source and Target must be on the same OPD";
  }
}
const rules = new Array(new StateCannotConnectToFather(), new ObjectAndStateCannotConnectToThemeselfs(), new StateCannotConnectToFatherStates(), new ObjectCannotBeConnectedToItsStates(), new ThingCannotConnectToFather(), new InzoomedProcessCannotConnectToIsSubProcess(), new Semifoldinglinks(), new CannotLinkToValueTypeObjec(), new SourceAndTargetOnSameOPD(), new CannotLinkToRequirementObject());
