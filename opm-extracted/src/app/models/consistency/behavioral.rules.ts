// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/behavioral.rules.ts
// Extracted by opm-extracted/tools/extract.mjs

class BehaviouralRule {
  type() {
    return RuleType.BEHAVIOURAL;
  }
  shouldBeApplied(source, target, link) {
    return this.typeSource().contains(source) && this.typeTarget().contains(target) && this.typeLink().contains(link);
  }
}
class ProcessCannotBeConnectedToitselfWithProceduralLinks extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.source = createSet(EntityType.Process);
    this.target = createSet(EntityType.Process);
  }
  typeLink() {
    return procedural;
  }
  typeSource() {
    return this.source;
  }
  typeTarget() {
    return this.target;
  }
  canConnect(source, target) {
    return source.logicalElement !== target.logicalElement;
  }
  message() {
    return "Process Cannot Be Connected To itself With Procedural Links";
  }
  description() {
    return "Process Cannot Be Connected To itself With Procedural Links";
  }
  warning(source, target) {
    return undefined;
  }
}
class AlreadyConnectedWithStructural extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.all = createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return structural;
  }
  perdicate(link, source, target) {
    return this.typeLink().contains(link.logicalElement.linkType) && link.sourceVisualElement === source && link.targetVisualElements[0].targetVisualElement === target;
  }
  canConnect(source, target) {
    const links = source.getAllLinksWith(target).outGoing;
    for (let i = 0; i < links.length; i++) {
      if (this.perdicate(links[i], source, target)) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "Two entites cannot be connected with more than one link.";
  }
  description() {
    return "Two entites cannot be connected with more than one link.";
  }
  warning(source, target) {
    return undefined;
  }
}
class AlreadyConnectedWithProcedural extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.all = createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return procedural;
  }
  perdicate(link, source, target) {
    const condition_1 = link.sourceVisualElement === source && link.targetVisualElements[0].targetVisualElement === target;
    const condition_2 = link.sourceVisualElement === target && link.targetVisualElements[0].targetVisualElement === source;
    return this.typeLink().contains(link.logicalElement.linkType) && (condition_1 || condition_2);

  }
  canConnect(source, target) {
    const links = [...source.getAllLinksWith(target).outGoing, ...source.getAllLinksWith(target).inGoing];
    for (let i = 0; i < links.length; i++) {
      if (this.perdicate(links[i], source, target)) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "Two entites cannot be connected with more than one link.";
  }
  description() {
    return "Two entites cannot be connected with more than one link.";
  }
  warning(source, target) {
    return undefined;
  }
}
class AlreadyConnectedWithStructuralOnTheOtherWay extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.all = createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return structural;
  }
  perdicate(link, source, target) {
    return this.typeLink().contains(link.logicalElement.linkType) && link.sourceVisualElement === source && link.targetVisualElements[0].targetVisualElement === target;
  }
  canConnect(source, target) {
    const links = target.getAllLinksWith(source).outGoing;
    for (let i = 0; i < links.length; i++) {
      if (this.perdicate(links[i], target, source)) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "These Two entites are already connected with this link on the other way.";
  }
  description() {
    return "These Two entites are already connected with this link on the other way.";
  }
  warning(source, target) {
    return undefined;
  }
}
class CantConnectConsumed extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.things = createSet(EntityType.Object, EntityType.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return instruments;
  }
  canConnect(source, target) {
    if (target.fatherObject) {
      let highestConsumption = -1;
      let highestResult = -1;
      const children = target.fatherObject.getThingChildrenOrder();
      const indexOfTargetNewLink = children.indexOf(target);
      for (let i = 0; i <= indexOfTargetNewLink; i++) {
        const cnsmp = source.getAllLinksWith(children[i]).outGoing.find(l => l.type === linkType.Consumption);
        highestConsumption = cnsmp ? i : highestConsumption;
        const rslt = source.getAllLinksWith(children[i]).inGoing.find(l => l.type === linkType.Result);
        highestResult = rslt ? i : highestResult;
      }
      if (highestResult < highestConsumption && indexOfTargetNewLink > highestConsumption) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "An object cannot be connected with a link after it was consumed by a previous process.";
  }
  description() {
    return "An object cannot be connected with a link after it was consumed by a previous process.";
  }
  warning() {
    return undefined;
  }
}
class CantConnectConsumed2 extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.things = createSet(EntityType.Object, EntityType.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return consumptions;
  }
  canConnect(source, target) {
    if (target.fatherObject) {
      let highestConsumption = -1;
      let highestResult = -1;
      let closestAgentOrInstrument = -1;
      const children = target.fatherObject.getThingChildrenOrder();
      const indexOfTargetNewLink = children.indexOf(target);
      if (indexOfTargetNewLink == -1) {
        return true;
      }
      for (let i = indexOfTargetNewLink; i < children.length; i++) {
        const instrmngagnt = source.getAllLinksWith(children[i]).outGoing.find(l => [linkType.Agent, linkType.Instrument].includes(l.type));
        closestAgentOrInstrument = instrmngagnt ? i : closestAgentOrInstrument;
        if (closestAgentOrInstrument >= 0) {
          break;
        }
        const cnsmp = source.getAllLinksWith(children[i]).outGoing.find(l => l.type === linkType.Consumption);
        highestConsumption = cnsmp ? i : highestConsumption;
        const rslt = source.getAllLinksWith(children[i]).inGoing.find(l => l.type === linkType.Result);
        highestResult = rslt ? i : highestResult;
      }
      if (closestAgentOrInstrument > indexOfTargetNewLink && highestResult < indexOfTargetNewLink) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "An object cannot be connected with a link after it was consumed by a previous process.";
  }
  description() {
    return "An object cannot be connected with a link after it was consumed by a previous process.";
  }
  warning(source, target) {
    return undefined;
  }
}
class CantConnectBeforeCreated extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.all = createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return instruments;
  }
  canConnect(source, target) {
    if (target.fatherObject) {
      let links = new Array();
      target.fatherObject.children.forEach(child => links = links.concat(child.getAllLinks().outGoing));
      const results = links.filter(l => l.constructor.name.includes("Procedural") && l.logicalElement.linkType === linkType.Result);
      const childrenOrder = target.fatherObject.getThingChildrenOrder();
      const indicesOfConnectedChildren = new Array();
      results.forEach(c => {
        indicesOfConnectedChildren.push(childrenOrder.indexOf(c.sourceVisualElement));
      });
      const min = Math.min.apply(null, indicesOfConnectedChildren);
      if (results.length === 0 || childrenOrder.indexOf(target) > min) {
        return true;
      }
      return false;
    }
    return true;
  }
  message() {
    return "An object cannot be an instrument before it was created.";
  }
  description() {
    return "An object cannot be an instrument before it was created.";
  }
  warning(source, target) {
    return undefined;
  }
}
class CantConnectBeforeCreated2 extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.all = createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return results;
  }
  canConnect(source, target) {
    if (source.fatherObject) {
      let links = new Array();
      source.fatherObject.children.forEach(child => links = links.concat(child.getAllLinks().inGoing));
      const enablers = links.filter(l => l.constructor.name.includes("Procedural") && (l.logicalElement.linkType === linkType.Instrument || l.logicalElement.linkType === linkType.Agent));
      const childrenOrder = source.fatherObject.getThingChildrenOrder();
      const indicesOfConnectedChildren = new Array();
      enablers.forEach(c => {
        indicesOfConnectedChildren.push(childrenOrder.indexOf(c.targetVisualElements[0].targetVisualElement));
      });
      const max = Math.min.apply(null, indicesOfConnectedChildren);
      if (enablers.length === 0 || childrenOrder.indexOf(target) > max) {
        return true;
      }
      return false;
    }
    return true;
  }
  message() {
    return "An object cannot be an instrument before it was created.";
  }
  description() {
    return "An object cannot be an instrument before it was created.";
  }
  warning(source, target) {
    return undefined;
  }
}
class CantConnectSelfInvocationForInzoomedProcess extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.processes = createSet(EntityType.Process);
  }
  typeSource() {
    return this.processes;
  }
  typeTarget() {
    return this.processes;
  }
  typeLink() {
    return invoactions;
  }
  canConnect(source, target) {
    if (source === target && source.children.length > 0) {
      return false;
    }
    return true;
  }
  message() {
    return "An inzoomed process cannot be connected to iteslf by self-Invocation Link.";
  }
  description() {
    return "An inzoomed process cannot be connected to iteslf by self-Invocation Link.";
  }
  warning(source, target) {
    return undefined;
  }
}
class CantConnectInzoomedProcessToItsChildrenWithInvocation extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.processes = createSet(EntityType.Process);
  }
  typeSource() {
    return this.processes;
  }
  typeTarget() {
    return this.processes;
  }
  typeLink() {
    return invoactions;
  }
  canConnect(source, target) {
    if (source.isInzoomed() && source.children.includes(target)) {
      return false;
    }
    return true;
  }
  message() {
    return "An inzoomed process cannot be connected to its children by Invocation Link.";
  }
  description() {
    return "An inzoomed process cannot be connected to its children by Invocation Link.";
  }
  warning(source, target) {
    return undefined;
  }
}
class ObjectCantConnectToObjectWithProceduralLinks extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.objects = createSet(EntityType.Object);
  }
  typeSource() {
    return this.objects;
  }
  typeTarget() {
    return this.objects;
  }
  typeLink() {
    return procedural;
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "Object cannot connect another object with procedural link.";
  }
  description() {
    return "Object cannot connect another object with procedural link.";
  }
  warning(source, target) {
    return undefined;
  }
}
class PreventAggregationBetweenInformaticalToPhysical extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.things = createSet(EntityType.Object, EntityType.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return (0, createSet)(linkType.Aggregation);
  }
  canConnect(source, target) {
    if (source.type === target.type && source.getEssence() === Essence.Informatical && target.getEssence() === Essence.Physical) {
      return false;
    }
    return true;
  }
  message() {
    return "A physical thing cannot be part of an informatical one.\nPlease change part to be informatical first.";
  }
  description() {
    return "A physical thing cannot be part of an informatical one.\nPlease change part to be informatical first.";
  }
  warning(source, target) {
    return undefined;
  }
  changeAction(source, target, init) {
    return new CannotBePhysicalChangeAction(source, target, init).act();
  }
}
class AggregationBetweenPhysicaltoInformatical extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.things = createSet(EntityType.Object, EntityType.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return (0, createSet)(linkType.Aggregation);
  }
  canConnect(source, target) {
    return true;
  }
  message() {
    return "";
  }
  description() {
    return "";
  }
  warning(source, target) {
    if (source.type === target.type && target.getEssence() === Essence.Informatical && source.getEssence() === Essence.Physical) {
      return "Consider using an Exhibition-Characterization link or a Tagged Structural link instead.";
    }
  }
}
class ExhibitionToPhysical extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.entities = createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeSource() {
    return this.entities;
  }
  typeTarget() {
    return this.entities;
  }
  typeLink() {
    return (0, createSet)(linkType.Exhibition);
  }
  canConnect(source, target) {
    if (this.condition(source, target)) {
      return false;
    }
    return true;
  }
  message() {
    return "Physical Object with agent link cannot be changed to Informatical.";
  }
  description() {
    return "";
  }
  warning(source, target) {
    if (this.condition(source, target)) {
      return "Physical Object with agent link cannot be changed to Informatical.";
    }
  }
  condition(source, target) {
    if (OPCloudUtils.isInstanceOfVisualThing(target) && target.getEssence() === Essence.Physical && target.getLinks().outGoing.find(l => l.type === linkType.Agent)) {
      return true;
    }
    if (OPCloudUtils.isInstanceOfVisualObject(target) && target.getEssence() === Essence.Physical && target.states.find(st => st.getLinks().outGoing.find(l => l.type === linkType.Agent))) {
      return true;
    }
    if (OPCloudUtils.isInstanceOfVisualState(target) && target.fatherObject.getEssence() === Essence.Physical && target.fatherObject.states.find(st => st.getLinks().outGoing.find(l => l.type === linkType.Agent))) {
      return true;
    }
    if (OPCloudUtils.isInstanceOfVisualState(target) && target.fatherObject.getEssence() === Essence.Physical && target.fatherObject.getLinks().outGoing.find(l => l.type === linkType.Agent)) {
      return true;
    }
    return false;
  }
}
class LegalConsumptionWarning extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.things = createSet(EntityType.Object, EntityType.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return (0, createSet)(linkType.Consumption);
  }
  canConnect(source, target) {
    return true;
  }
  message() {
    return "";
  }
  description() {
    return "";
  }
  warning(source, target) {
    const father = target.fatherObject;
    if (father && target instanceof OpmVisualThing) {
      const links = source.getLinksWithOtherAndItsChildren(father).outGoing.filter(l => l.type === linkType.Consumption);
      if (links.length > 0) {
        return "An object cannot be consumed more than once. You may want to (1) remove the other consumption link or (2) use the XOR logical relation between the two consumption links.";
      }
    }
  }
}
class ProcessToProcess extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.Consumption, linkType.Effect, linkType.Result, linkType.Agent, linkType.Instrument);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "process cannot be connected to process with this link.";
  }
  description() {
    return "process cannot be connected to process with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class ObjectToProcess extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Object);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Aggregation, linkType.Bidirectional, linkType.Bidirectional, linkType.OvertimeException, linkType.UndertimeOvertimeException, linkType.UndertimeException, linkType.Invocation);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "Object cannot be connected to process with this link.";
  }
  description() {
    return "Object cannot be connected to process with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class ProcessToObject extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Object);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Aggregation, linkType.Bidirectional, linkType.Bidirectional, linkType.OvertimeException, linkType.UndertimeOvertimeException, linkType.UndertimeException, linkType.Invocation, linkType.Consumption, linkType.Agent, linkType.Instrument);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "Process cannot be connected to object with this link.";
  }
  description() {
    return "Process cannot be connected to object with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class ObjectToObject extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Object);
  }
  typeTarget() {
    return createSet(EntityType.Object);
  }
  typeLink() {
    return (0, createSet)(linkType.Consumption, linkType.Effect, linkType.Result, linkType.Agent, linkType.Instrument, linkType.OvertimeException, linkType.UndertimeOvertimeException, linkType.UndertimeException, linkType.Invocation);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "process cannot be connected to process with this link.";
  }
  description() {
    return "process cannot be connected to process with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class StateToObject extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Object);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Invocation, linkType.Result);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "State cannot be connected to object with this link.";
  }
  description() {
    return "State cannot be connected to object with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class ObjectToState extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Object);
  }
  typeTarget() {
    return createSet(EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Invocation, linkType.Result, linkType.Instrument, linkType.Agent, linkType.Consumption, linkType.UndertimeException, linkType.OvertimeException, linkType.UndertimeOvertimeException, linkType.Effect);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "Object cannot be connected to state with this link.";
  }
  description() {
    return "Object cannot be connected to state with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class StateToProcess extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Aggregation, linkType.Invocation, linkType.Result, linkType.Effect);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "State cannot be connected to process with this link.";
  }
  description() {
    return "State cannot be connected to process with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class ProcessToState extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Aggregation, linkType.Effect, linkType.Agent, linkType.UndertimeOvertimeException, linkType.OvertimeException, linkType.Unidirectional, linkType.Bidirectional, linkType.Instrument, linkType.Consumption, linkType.Invocation, linkType.Instantiation, linkType.Generalization, linkType.UndertimeException);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "Process cannot be connected to state with this link.";
  }
  description() {
    return "Process cannot be connected to state with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class StateToState extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Aggregation, linkType.Effect, linkType.Agent, linkType.UndertimeOvertimeException, linkType.OvertimeException, linkType.Result, linkType.Instrument, linkType.Consumption, linkType.Invocation, linkType.Instantiation, linkType.Generalization, linkType.UndertimeException);
  }
  canConnect(source, target) {
    return false;
  }
  message() {
    return "State cannot be connected to state with this link.";
  }
  description() {
    return "State cannot be connected to state with this link.";
  }
  warning(source, target) {
    return "";
  }
}
class CannotConnectThingToItsInzoomedFather extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Object, EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Object, EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Exhibition);
  }
  canConnect(source, target) {
    if (source.getRefineeInzoom() && source.getRefineeInzoom().children.find(child => child.logicalElement === target.logicalElement)) {
      return false;
    }
    return true;
  }
  message() {
    return "Inzoomed thing cannot connect explicitly to its children with structural link rather then aggregation link.";
  }
  description() {
    return "Inzoomed thing cannot connect explicitly to its children with structural link rather then aggregation link.";
  }
  warning(source, target) {
    return undefined;
  }
}
class ProcessToProcessExceptionsUndertimeOvertime extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.UndertimeOvertimeException);
  }
  canConnect(source, target) {
    return true;
  }
  message() {
    return "";
  }
  description() {
    return "";
  }
  warning(source, target) {
    const dur = source.logicalElement.getDurationManager().getTimeDuration();
    if (source.logicalElement.isTimeDuration() === false || !dur.min || !dur.max) {
      return "Source process should have duration parameters.";
    }
    return undefined;
  }
}
class ProcessToProcessExceptionsOvertime extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.OvertimeException);
  }
  canConnect(source, target) {
    return true;
  }
  message() {
    return "";
  }
  description() {
    return "";
  }
  warning(source, target) {
    const dur = source.logicalElement.getDurationManager().getTimeDuration();
    if (source.logicalElement.isTimeDuration() === false || !dur.max) {
      return "Source process should have maximal duration parameter.";
    }
    return undefined;
  }
}
class ProcessToProcessExceptionsUndertime extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  typeLink() {
    return (0, createSet)(linkType.UndertimeException);
  }
  canConnect(source, target) {
    return true;
  }
  message() {
    return "";
  }
  description() {
    return "";
  }
  warning(source, target) {
    const dur = source.logicalElement.getDurationManager().getTimeDuration();
    if (source.logicalElement.isTimeDuration() === false || !dur.min) {
      return "Source process should have minimal duration parameter.";
    }
    return undefined;
  }
}
class OnlyOneLevelOfInstantiation extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization);
  }
  canConnect(source, target) {
    if (source.getAllLinks().inGoing.find(l => l.type === linkType.Instantiation)) {
      return false;
    }
    return true;
  }
  message() {
    return "An instance cannot have further specializations.";
  }
  description() {
    return "An instance cannot have further specializations.";
  }
  warning(source, target) {
    if (this.canConnect(source, target) === false) {
      return "An instance cannot have further specializations.";
    }
    return undefined;
  }
}
class OnlyOneLevelOfInstantiation2 extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation);
  }
  canConnect(source, target) {
    if (target.getAllLinks().outGoing.find(l => l.type === linkType.Instantiation || l.type === linkType.Generalization)) {
      return false;
    }
    return true;
  }
  message() {
    return "An instance cannot have further specializations.";
  }
  description() {
    return "An instance cannot have further specializations.";
  }
  warning(source, target) {
    if (this.canConnect(source, target) === false) {
      return "An instance cannot have further specializations.";
    }
    return undefined;
  }
}
class GeneralizationPhysicalToPhysical extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Generalization);
  }
  canConnect(source, target) {
    if (source.logicalElement.essence === Essence.Physical && target.logicalElement.essence === Essence.Informatical) {
      return false;
    }
    return true;
  }
  message() {
    return "Specialization of a physical thing should be physical too.";
  }
  description() {
    return "Specialization of a physical thing should be physical too.";
  }
  warning(source, target) {
    if (source.logicalElement.essence === Essence.Physical && target.logicalElement.essence === Essence.Informatical) {
      return "Specialization of a physical thing should be physical too.";
    }
    return undefined;
  }
}
class CannotConnectFundamentalFromSharedSubModelSource extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.Object, EntityType.Process);
  }
  typeTarget() {
    return createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Exhibition, linkType.Aggregation);
  }
  canConnect(source, target) {
    if (source.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel)) {
      return false;
    }
    return true;
  }
  message() {
    return "An entity that is shared with sub-model cannot add new part in the father model.";
  }
  description() {
    return "An entity that is shared with sub-model cannot add new part in the father model.";
  }
  warning(source, target) {
    if (source.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel)) {
      return "An entity that is shared with sub-model cannot add new part in the father model.";
    }
    return undefined;
  }
}
class CannotConnectFundamentalFromSharedSubModelSource2 extends BehaviouralRule {
  typeSource() {
    return createSet(EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Object, EntityType.Process, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Instantiation, linkType.Generalization, linkType.Exhibition, linkType.Aggregation);
  }
  canConnect(source, target) {
    if (source.fatherObject.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel)) {
      return false;
    }
    return true;
  }
  message() {
    return "An entity that is shared with sub-model cannot add new part in the father model.";
  }
  description() {
    return "An entity that is shared with sub-model cannot add new part in the father model.";
  }
  warning(source, target) {
    if (source.fatherObject.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel)) {
      return "An entity that is shared with sub-model cannot add new part in the father model.";
    }
    return undefined;
  }
}
class exhibitionAncestor extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Exhibition);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    const logicalSource = source.logicalElement;
    const logicalTarget = target.logicalElement;
    if (logicalSource.getAncestorExhibitions().some(log => log.lid === logicalTarget.lid)) {
      return false;
    }
    return true;
  }
  message() {
    return "A recursive exhibition links is forbidden";
  }
  description() {
    return "A recursive exhibition links is forbidden";
  }
  warning(source, target) {
    if (!this.canConnect(source, target)) {
      return this.message();
    }
    return undefined;
  }
}
class OneUnidirectional extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.set = createSet(EntityType.Process, EntityType.Object, EntityType.State);
  }
  typeLink() {
    return (0, createSet)(linkType.Unidirectional);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    if (source.getLinksWith(target).outGoing.find(l => l.target === target)) {
      return false;
    }
    return true;
  }
  message() {
    return "Only one unidirectional link can be used between 2 entities.";
  }
  description() {
    return "Only one unidirectional link can be used between 2 entities.";
  }
  warning(source, target) {
    if (!this.canConnect(source, target)) {
      return this.message();
    }
    return undefined;
  }
}
class SingleInstrumentFromStates extends BehaviouralRule {
  typeLink() {
    return (0, createSet)(linkType.Instrument);
  }
  typeSource() {
    return createSet(EntityType.State);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  canConnect(source, target) {
    if (source.fatherObject.getLinksWith(target).outGoing.find(l => l.type === linkType.Instrument)) {
      return false;
    }
    return true;
  }
  message() {
    return "When an object is connected to a process both from itself and its states, only the link originating from the object itself will persist.";
  }
  description() {
    return "When an object is connected to a process both from itself and its states, only the link originating from the object itself will persist.";
  }
  warning(source, target) {
    if (!this.canConnect(source, target)) {
      return this.message();
    }
    return undefined;
  }
}
class SingleInstrumentFromStates2 extends BehaviouralRule {
  typeLink() {
    return (0, createSet)(linkType.Instrument);
  }
  typeSource() {
    return createSet(EntityType.Object);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  canConnect(source, target) {
    return true;
  }
  message() {
    return "When an object is connected to a process both from itself and its states, only the link originating from the object itself will persist.";
  }
  description() {
    return "When an object is connected to a process both from itself and its states, only the link originating from the object itself will persist.";
  }
  warning(source, target) {
    if (source.getChildrenLinks().outGoing.find(l => l.type === linkType.Instrument && l.target === target && OPCloudUtils.isInstanceOfVisualState(l.source))) {
      return this.message();
    }
    return undefined;
  }
}
class InstrumentWithAgentConsistency1 extends BehaviouralRule {
  typeLink() {
    return (0, createSet)(linkType.Instrument);
  }
  typeSource() {
    return createSet(EntityType.Object);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  canConnect(source, target) {
    return this.checkForAgent(source, target);
  }
  message() {
    return "This Object already has an Agent link so it can't also have an Instrument link.";
  }
  description() {
    return "This Object already has an Agent link so it can't also have an Instrument link.";
  }
  warning(source, target) {
    if (!this.checkForAgent(source, target)) {
      return this.message();
    }
    return undefined;
  }
  checkForAgent(source, target) {
    const links = source.getAllLinks();
    for (let i = 0; i < links.outGoing.length; i++) {
      const type = links.outGoing[i].logicalElement.linkType;
      if (type === linkType.Agent) {
        return false;
      }
    }
    if (source.fatherObject && source.fatherObject.states) {
      const illegalType = linkType.Agent;
      for (const state of source.fatherObject.states) {
        if (source !== state && state.getLinks().outGoing.find(item => item.type === illegalType)) {
          return false;
        }
      }
    }
    return true;
  }
}
class InstrumentWithAgentConsistency2 extends BehaviouralRule {
  typeLink() {
    return (0, createSet)(linkType.Agent);
  }
  typeSource() {
    return createSet(EntityType.Object);
  }
  typeTarget() {
    return createSet(EntityType.Process);
  }
  canConnect(source, target) {
    return this.checkForAgent(source, target);
  }
  message() {
    return "This Object already has an Instrument link so it can't also have an Agent link.";
  }
  description() {
    return "This Object already has an Instrument link so it can't also have an Agent link.";
  }
  warning(source, target) {
    if (!this.checkForAgent(source, target)) {
      return this.message();
    }
    return undefined;
  }
  checkForAgent(source, target) {
    const links = source.getAllLinks();
    for (let i = 0; i < links.outGoing.length; i++) {
      const type = links.outGoing[i].logicalElement.linkType;
      if (type === linkType.Instrument) {
        return false;
      }
    }
    if (source.fatherObject && source.fatherObject.states) {
      const illegalType = linkType.Instrument;
      for (const state of source.fatherObject.states) {
        if (source !== state && state.getLinks().outGoing.find(item => item.type === illegalType)) {
          return false;
        }
      }
    }
    return true;
  }
}
const rules = new Array(new ProcessCannotBeConnectedToitselfWithProceduralLinks(), new AlreadyConnectedWithProcedural(), new AlreadyConnectedWithStructural(), new AlreadyConnectedWithStructuralOnTheOtherWay(), new CantConnectSelfInvocationForInzoomedProcess(), new CantConnectInzoomedProcessToItsChildrenWithInvocation(), new CantConnectConsumed(), new CantConnectConsumed2(),
// new CantConnectBeforeCreated(),
// new CantConnectBeforeCreated2(),
new ObjectCantConnectToObjectWithProceduralLinks(), new PreventAggregationBetweenInformaticalToPhysical(), new AggregationBetweenPhysicaltoInformatical(), new ExhibitionToPhysical(), new LegalConsumptionWarning(), new ProcessToProcess(), new ObjectToProcess(), new ProcessToObject(), new ObjectToObject(), new StateToObject(), new ObjectToState(), new StateToProcess(), new ProcessToState(), new StateToState(), new CannotConnectThingToItsInzoomedFather(), new ProcessToProcessExceptionsUndertimeOvertime(), new ProcessToProcessExceptionsOvertime(), new ProcessToProcessExceptionsUndertime(), new OnlyOneLevelOfInstantiation(), new OnlyOneLevelOfInstantiation2(), new GeneralizationPhysicalToPhysical(), new CannotConnectFundamentalFromSharedSubModelSource(), new CannotConnectFundamentalFromSharedSubModelSource2(), new exhibitionAncestor(), new OneUnidirectional(), new SingleInstrumentFromStates(), new SingleInstrumentFromStates2(), new InstrumentWithAgentConsistency1(), new InstrumentWithAgentConsistency2());
// TODO: Fix CantConnectConsumed & CantConnectBeforeCreated rules set