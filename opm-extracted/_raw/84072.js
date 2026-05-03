// EXPORTS

; // CONCATENATED MODULE: ./src/app/models/consistency/rules.ts
var RuleType = /*#__PURE__*/function (RuleType) {
  RuleType[RuleType.STRUCTURAL = 0] = "STRUCTURAL";
  RuleType[RuleType.BEHAVIOURAL = 1] = "BEHAVIOURAL";
  RuleType[RuleType.CONSISTIONAL = 2] = "CONSISTIONAL";
  return RuleType;
}(RuleType || {});
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualObject.ts + 8 modules
var OpmVisualObject = require("./86922.js");
// EXTERNAL MODULE: ./src/app/models/model/entities.enum.ts
var entities_enum = require("./63877.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualState.ts + 3 modules
var OpmVisualState = require("./14898.js");
; // CONCATENATED MODULE: ./src/app/models/consistency/entities.set.ts
class Set {
  constructor(set) {
    this.set = set;
  }
  contains(type) {
    return this.set.includes(type);
  }
}
function createSet(...set) {
  return new Set(set);
}
// EXTERNAL MODULE: ./src/app/models/consistency/links.set.ts
var links_set = require("./94441.js");
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
; // CONCATENATED MODULE: ./src/app/models/consistency/structural.rules.ts

class StructuralRule {
  type() {
    return RuleType.STRUCTURAL;
  }
  typeLink() {
    return links_set /* all */.Q7;
  }
  shouldBeApplied(source, target, link) {
    return this.typeSource().contains(source) && this.typeTarget().contains(target);
  }
}
class StateCannotConnectToFather extends StructuralRule {
  constructor() {
    super(...arguments);
    this.source = createSet(entities_enum /* EntityType */.c.State);
    this.target = createSet(entities_enum /* EntityType */.c.Object);
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
    this.set = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
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
    this.source = createSet(entities_enum /* EntityType */.c.State);
    this.target = createSet(entities_enum /* EntityType */.c.State);
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
    this.source = createSet(entities_enum /* EntityType */.c.Object);
    this.target = createSet(entities_enum /* EntityType */.c.State);
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
    this.set = createSet(entities_enum /* EntityType */.c.Object);
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
    this.set = createSet(entities_enum /* EntityType */.c.Process);
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
    this.set = createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object);
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
    this.set = createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.set;
  }
  typeTarget() {
    return this.set;
  }
  canConnect(source, target) {
    if (source instanceof OpmVisualObject /* OpmVisualObject */.I && source.isValueTyped()) {
      return false;
    }
    if (target instanceof OpmVisualObject /* OpmVisualObject */.I && target.isValueTyped()) {
      return false;
    }
    if (source instanceof OpmVisualState /* OpmVisualState */.y && source.isValueTyped()) {
      return false;
    }
    if (target instanceof OpmVisualState /* OpmVisualState */.y && target.isValueTyped()) {
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
    this.set = createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
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
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualThing(source)) {
      const condition = source.logicalElement.isSatisfiedRequirementObject();
      const stereotype = source.logicalElement.getStereotype();
      const stereotypeTargetBelongsTo = target.logicalElement.getBelongsToStereotyped()?.getStereotype();
      if (condition && stereotype && stereotype === stereotypeTargetBelongsTo) {
        return true;
      }
      if (source.logicalElement.isSatisfiedRequirementSetObject()) {
        if (shared /* OPCloudUtils */.e2.isInstanceOfVisualObject(target) && target.logicalElement.isSatisfiedRequirementObject()) {
          return true;
        }
        return false;
      }
      if (source.logicalElement.hasRequirements() && shared /* OPCloudUtils */.e2.isInstanceOfVisualObject(target) && target.logicalElement.isSatisfiedRequirementSetObject()) {
        return true;
      }
      if (source.logicalElement.isSatisfiedRequirementObject() && source.getAllLinksWith(target).outGoing.length === 0) {
        return false;
      }
    }
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualThing(target)) {
      if (target.logicalElement.isSatisfiedRequirementSetObject()) {
        return false;
      }
      if (target.logicalElement.isSatisfiedRequirementObject()) {
        return false;
      }
    }
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualState(source)) {
      const logicalFather = source.fatherObject.logicalElement;
      if (logicalFather.isSatisfiedRequirementSetObject()) {
        return false;
      }
      if (logicalFather.isSatisfiedRequirementObject()) {
        return false;
      }
    }
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualState(target)) {
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
    this.set = createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
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
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualThing.ts + 2 modules
var OpmVisualThing = require("./54695.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = require("./73308.js");
; // CONCATENATED MODULE: ./src/app/models/consistency/changeActions/changeAction.interface.ts
class ChangeAction {
  constructor(source, target, init) {
    this.source = source;
    this.target = target;
    this.init = init;
  }
}
// EXTERNAL MODULE: ./src/app/dialogs/confirm-dialog/confirm-dialog.ts
var confirm_dialog = require("./86847.js");
; // CONCATENATED MODULE: ./src/app/models/consistency/changeActions/CannotBePhysicalChangeAction.ts

class CannotBePhysicalChangeAction extends ChangeAction {
  act() {
    var _this = this;
    return (0, asyncToGenerator /* default */.A)(function* () {
      const check = _this.target.isLegalEssence(ConfigurationOptions /* Essence */.tg.Informatical);
      // if it is possible to change the target essence
      if (check.isLegal) {
        let message = "A physical object cannot be part of an informatical one.\n The Object can be changed to informatical.\n\n";
        message += `<span class="redText">This will effect all ${_this.target.logicalElement.getBareName()} instances at:</span><br>`;
        for (const vis of _this.target.logicalElement.visualElements) {
          const opd = _this.init.opmModel.getOpdByThingId(vis.id);
          if (opd && !opd.isHidden) {
            message += "<span class=\"redText\">" + opd.getDisplayFullName() + "</span><br>";
          }
        }
        const ret = yield _this.init.dialogService.openDialog(confirm_dialog /* ConfirmDialogDialogComponent */.s, null, 350, {
          title: "ERROR!!",
          message: message,
          titleColor: "#ff0000",
          closeName: "Close",
          okName: "Change part to informatical",
          centerText: true,
          allowMultipleDialogs: true
        }).afterClosed().toPromise();
        if (ret) {
          _this.target.toggleEssence();
          return Promise.resolve({
            changed: true
          });
        }
      }
      return Promise.resolve({
        changed: false
      });
    })();
  }
}
; // CONCATENATED MODULE: ./src/app/models/consistency/behavioral.rules.ts

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
    this.source = createSet(entities_enum /* EntityType */.c.Process);
    this.target = createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return links_set /* procedural */.qj;
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
    this.all = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return links_set /* structural */.ex;
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
    this.all = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return links_set /* procedural */.qj;
  }
  perdicate(link, source, target) {
    const condition_1 = link.sourceVisualElement === source && link.targetVisualElements[0].targetVisualElement === target;
    const condition_2 = link.sourceVisualElement === target && link.targetVisualElements[0].targetVisualElement === source;
    return this.typeLink().contains(link.logicalElement.linkType) && (condition_1 || condition_2);
    ;
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
    this.all = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return links_set /* structural */.ex;
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
    this.things = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return links_set /* instruments */.n9;
  }
  canConnect(source, target) {
    if (target.fatherObject) {
      let highestConsumption = -1;
      let highestResult = -1;
      const children = target.fatherObject.getThingChildrenOrder();
      const indexOfTargetNewLink = children.indexOf(target);
      for (let i = 0; i <= indexOfTargetNewLink; i++) {
        const cnsmp = source.getAllLinksWith(children[i]).outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Consumption);
        highestConsumption = cnsmp ? i : highestConsumption;
        const rslt = source.getAllLinksWith(children[i]).inGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Result);
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
    this.things = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return links_set /* consumptions */.V;
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
        const instrmngagnt = source.getAllLinksWith(children[i]).outGoing.find(l => [ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Instrument].includes(l.type));
        closestAgentOrInstrument = instrmngagnt ? i : closestAgentOrInstrument;
        if (closestAgentOrInstrument >= 0) {
          break;
        }
        const cnsmp = source.getAllLinksWith(children[i]).outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Consumption);
        highestConsumption = cnsmp ? i : highestConsumption;
        const rslt = source.getAllLinksWith(children[i]).inGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Result);
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
    this.all = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return links_set /* instruments */.n9;
  }
  canConnect(source, target) {
    if (target.fatherObject) {
      let links = new Array();
      target.fatherObject.children.forEach(child => links = links.concat(child.getAllLinks().outGoing));
      const results = links.filter(l => l.constructor.name.includes("Procedural") && l.logicalElement.linkType === ConfigurationOptions /* linkType */.h6.Result);
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
    this.all = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.all;
  }
  typeTarget() {
    return this.all;
  }
  typeLink() {
    return links_set /* results */.Xv;
  }
  canConnect(source, target) {
    if (source.fatherObject) {
      let links = new Array();
      source.fatherObject.children.forEach(child => links = links.concat(child.getAllLinks().inGoing));
      const enablers = links.filter(l => l.constructor.name.includes("Procedural") && (l.logicalElement.linkType === ConfigurationOptions /* linkType */.h6.Instrument || l.logicalElement.linkType === ConfigurationOptions /* linkType */.h6.Agent));
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
    this.processes = createSet(entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.processes;
  }
  typeTarget() {
    return this.processes;
  }
  typeLink() {
    return links_set /* invoactions */.kZ;
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
    this.processes = createSet(entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.processes;
  }
  typeTarget() {
    return this.processes;
  }
  typeLink() {
    return links_set /* invoactions */.kZ;
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
    this.objects = createSet(entities_enum /* EntityType */.c.Object);
  }
  typeSource() {
    return this.objects;
  }
  typeTarget() {
    return this.objects;
  }
  typeLink() {
    return links_set /* procedural */.qj;
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
    this.things = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Aggregation);
  }
  canConnect(source, target) {
    if (source.type === target.type && source.getEssence() === ConfigurationOptions /* Essence */.tg.Informatical && target.getEssence() === ConfigurationOptions /* Essence */.tg.Physical) {
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
    this.things = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Aggregation);
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
    if (source.type === target.type && target.getEssence() === ConfigurationOptions /* Essence */.tg.Informatical && source.getEssence() === ConfigurationOptions /* Essence */.tg.Physical) {
      return "Consider using an Exhibition-Characterization link or a Tagged Structural link instead.";
    }
  }
}
class ExhibitionToPhysical extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.entities = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.entities;
  }
  typeTarget() {
    return this.entities;
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Exhibition);
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
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualThing(target) && target.getEssence() === ConfigurationOptions /* Essence */.tg.Physical && target.getLinks().outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Agent)) {
      return true;
    }
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualObject(target) && target.getEssence() === ConfigurationOptions /* Essence */.tg.Physical && target.states.find(st => st.getLinks().outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Agent))) {
      return true;
    }
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualState(target) && target.fatherObject.getEssence() === ConfigurationOptions /* Essence */.tg.Physical && target.fatherObject.states.find(st => st.getLinks().outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Agent))) {
      return true;
    }
    if (shared /* OPCloudUtils */.e2.isInstanceOfVisualState(target) && target.fatherObject.getEssence() === ConfigurationOptions /* Essence */.tg.Physical && target.fatherObject.getLinks().outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Agent)) {
      return true;
    }
    return false;
  }
}
class LegalConsumptionWarning extends BehaviouralRule {
  constructor() {
    super(...arguments);
    this.things = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeSource() {
    return this.things;
  }
  typeTarget() {
    return this.things;
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Consumption);
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
    if (father && target instanceof OpmVisualThing /* OpmVisualThing */.J) {
      const links = source.getLinksWithOtherAndItsChildren(father).outGoing.filter(l => l.type === ConfigurationOptions /* linkType */.h6.Consumption);
      if (links.length > 0) {
        return "An object cannot be consumed more than once. You may want to (1) remove the other consumption link or (2) use the XOR logical relation between the two consumption links.";
      }
    }
  }
}
class ProcessToProcess extends BehaviouralRule {
  typeSource() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.Effect, ConfigurationOptions /* linkType */.h6.Result, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Instrument);
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
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Aggregation, ConfigurationOptions /* linkType */.h6.Bidirectional, ConfigurationOptions /* linkType */.h6.Bidirectional, ConfigurationOptions /* linkType */.h6.OvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeException, ConfigurationOptions /* linkType */.h6.Invocation);
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
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Aggregation, ConfigurationOptions /* linkType */.h6.Bidirectional, ConfigurationOptions /* linkType */.h6.Bidirectional, ConfigurationOptions /* linkType */.h6.OvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeException, ConfigurationOptions /* linkType */.h6.Invocation, ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Instrument);
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
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.Effect, ConfigurationOptions /* linkType */.h6.Result, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Instrument, ConfigurationOptions /* linkType */.h6.OvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeException, ConfigurationOptions /* linkType */.h6.Invocation);
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
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Invocation, ConfigurationOptions /* linkType */.h6.Result);
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
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Invocation, ConfigurationOptions /* linkType */.h6.Result, ConfigurationOptions /* linkType */.h6.Instrument, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.UndertimeException, ConfigurationOptions /* linkType */.h6.OvertimeException, ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* linkType */.h6.Effect);
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
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Aggregation, ConfigurationOptions /* linkType */.h6.Invocation, ConfigurationOptions /* linkType */.h6.Result, ConfigurationOptions /* linkType */.h6.Effect);
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
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Aggregation, ConfigurationOptions /* linkType */.h6.Effect, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* linkType */.h6.OvertimeException, ConfigurationOptions /* linkType */.h6.Unidirectional, ConfigurationOptions /* linkType */.h6.Bidirectional, ConfigurationOptions /* linkType */.h6.Instrument, ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.Invocation, ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.UndertimeException);
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
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Aggregation, ConfigurationOptions /* linkType */.h6.Effect, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException, ConfigurationOptions /* linkType */.h6.OvertimeException, ConfigurationOptions /* linkType */.h6.Result, ConfigurationOptions /* linkType */.h6.Instrument, ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.Invocation, ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.UndertimeException);
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
    return createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Exhibition);
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
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException);
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
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.OvertimeException);
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
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.UndertimeException);
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
    return createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization);
  }
  canConnect(source, target) {
    if (source.getAllLinks().inGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Instantiation)) {
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
    return createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation);
  }
  canConnect(source, target) {
    if (target.getAllLinks().outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Instantiation || l.type === ConfigurationOptions /* linkType */.h6.Generalization)) {
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
    return createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Generalization);
  }
  canConnect(source, target) {
    if (source.logicalElement.essence === ConfigurationOptions /* Essence */.tg.Physical && target.logicalElement.essence === ConfigurationOptions /* Essence */.tg.Informatical) {
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
    if (source.logicalElement.essence === ConfigurationOptions /* Essence */.tg.Physical && target.logicalElement.essence === ConfigurationOptions /* Essence */.tg.Informatical) {
      return "Specialization of a physical thing should be physical too.";
    }
    return undefined;
  }
}
class CannotConnectFundamentalFromSharedSubModelSource extends BehaviouralRule {
  typeSource() {
    return createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Exhibition, ConfigurationOptions /* linkType */.h6.Aggregation);
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
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instantiation, ConfigurationOptions /* linkType */.h6.Generalization, ConfigurationOptions /* linkType */.h6.Exhibition, ConfigurationOptions /* linkType */.h6.Aggregation);
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
    this.set = createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Exhibition);
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
    this.set = createSet(entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Unidirectional);
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
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instrument);
  }
  typeSource() {
    return createSet(entities_enum /* EntityType */.c.State);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
  }
  canConnect(source, target) {
    if (source.fatherObject.getLinksWith(target).outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Instrument)) {
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
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instrument);
  }
  typeSource() {
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
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
    if (source.getChildrenLinks().outGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Instrument && l.target === target && shared /* OPCloudUtils */.e2.isInstanceOfVisualState(l.source))) {
      return this.message();
    }
    return undefined;
  }
}
class InstrumentWithAgentConsistency1 extends BehaviouralRule {
  typeLink() {
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Instrument);
  }
  typeSource() {
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
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
      if (type === ConfigurationOptions /* linkType */.h6.Agent) {
        return false;
      }
    }
    if (source.fatherObject && source.fatherObject.states) {
      const illegalType = ConfigurationOptions /* linkType */.h6.Agent;
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
    return (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Agent);
  }
  typeSource() {
    return createSet(entities_enum /* EntityType */.c.Object);
  }
  typeTarget() {
    return createSet(entities_enum /* EntityType */.c.Process);
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
      if (type === ConfigurationOptions /* linkType */.h6.Instrument) {
        return false;
      }
    }
    if (source.fatherObject && source.fatherObject.states) {
      const illegalType = ConfigurationOptions /* linkType */.h6.Instrument;
      for (const state of source.fatherObject.states) {
        if (source !== state && state.getLinks().outGoing.find(item => item.type === illegalType)) {
          return false;
        }
      }
    }
    return true;
  }
}
const behavioral_rules_rules = new Array(new ProcessCannotBeConnectedToitselfWithProceduralLinks(), new AlreadyConnectedWithProcedural(), new AlreadyConnectedWithStructural(), new AlreadyConnectedWithStructuralOnTheOtherWay(), new CantConnectSelfInvocationForInzoomedProcess(), new CantConnectInzoomedProcessToItsChildrenWithInvocation(), new CantConnectConsumed(), new CantConnectConsumed2(),
// new CantConnectBeforeCreated(),
// new CantConnectBeforeCreated2(),
new ObjectCantConnectToObjectWithProceduralLinks(), new PreventAggregationBetweenInformaticalToPhysical(), new AggregationBetweenPhysicaltoInformatical(), new ExhibitionToPhysical(), new LegalConsumptionWarning(), new ProcessToProcess(), new ObjectToProcess(), new ProcessToObject(), new ObjectToObject(), new StateToObject(), new ObjectToState(), new StateToProcess(), new ProcessToState(), new StateToState(), new CannotConnectThingToItsInzoomedFather(), new ProcessToProcessExceptionsUndertimeOvertime(), new ProcessToProcessExceptionsOvertime(), new ProcessToProcessExceptionsUndertime(), new OnlyOneLevelOfInstantiation(), new OnlyOneLevelOfInstantiation2(), new GeneralizationPhysicalToPhysical(), new CannotConnectFundamentalFromSharedSubModelSource(), new CannotConnectFundamentalFromSharedSubModelSource2(), new exhibitionAncestor(), new OneUnidirectional(), new SingleInstrumentFromStates(), new SingleInstrumentFromStates2(), new InstrumentWithAgentConsistency1(), new InstrumentWithAgentConsistency2());
// TODO: Fix CantConnectConsumed & CantConnectBeforeCreated rules set
; // CONCATENATED MODULE: ./src/app/models/consistency/consistional.rules.ts

const AllEntites = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.Process, entities_enum /* EntityType */.c.State);
class ConsistionalRule {
  type() {
    return RuleType.CONSISTIONAL;
  }
  typeLink() {
    return links_set /* all */.Q7;
  }
  typeSource() {
    return AllEntites;
  }
  typeTarget() {
    return AllEntites;
  }
  shouldBeApplied(source, target, link) {
    return this.typeSource().contains(source) && this.typeTarget().contains(target) && this.typeLink().contains(link);
  }
}
class BaseConsistency extends ConsistionalRule {
  constructor() {
    super(...arguments);
    this.set = (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Result, ConfigurationOptions /* linkType */.h6.Effect, ConfigurationOptions /* linkType */.h6.Consumption, ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Instrument);
  }
  typeLink() {
    return this.set;
  }
  canConnect(source, target, link) {
    const links = source.getAllLinksWith(target);
    for (let i = 0; i < links.inGoing.length; i++) {
      const type = links.inGoing[i].logicalElement.linkType;
      if (this.set.contains(type) && type !== link) {
        return false;
      }
    }
    for (let i = 0; i < links.outGoing.length; i++) {
      const type = links.outGoing[i].logicalElement.linkType;
      if (this.set.contains(type) && type !== link) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "A link between object to process should be same type in all opds";
  }
  description() {
    return "Entity ";
  }
}
class AgentConsistency extends ConsistionalRule {
  constructor() {
    super(...arguments);
    this.set = (0, links_set /* createSet */.ju)(ConfigurationOptions /* linkType */.h6.Agent, ConfigurationOptions /* linkType */.h6.Instrument);
    this.source = createSet(entities_enum /* EntityType */.c.Object, entities_enum /* EntityType */.c.State);
  }
  typeSource() {
    return this.source;
  }
  typeLink() {
    return this.set;
  }
  canConnect(source, target, link) {
    const links = source.getAllLinks();
    for (let i = 0; i < links.outGoing.length; i++) {
      const type = links.outGoing[i].logicalElement.linkType;
      if (this.set.contains(type) && type !== link) {
        return false;
      }
    }
    if (source.fatherObject && source.fatherObject.states) {
      const illegalType = link === ConfigurationOptions /* linkType */.h6.Agent ? ConfigurationOptions /* linkType */.h6.Instrument : ConfigurationOptions /* linkType */.h6.Agent;
      for (const state of source.fatherObject.states) {
        if (source !== state && state.getLinks().outGoing.find(item => item.type === illegalType)) {
          return false;
        }
      }
    }
    return true;
  }
  message() {
    return "An object can either have instrument links or Agent link.";
  }
  description() {
    return "An object can either have instrument links or Agent link.";
  }
}
class FundamentalConsistency extends ConsistionalRule {
  constructor() {
    super(...arguments);
    this.set = links_set /* fundamental */.gF;
  }
  typeLink() {
    return this.set;
  }
  canConnect(source, target, link) {
    if (!this.set.contains(link)) {
      return true;
    }
    const links = source.getAllLinksWith(target);
    for (const l of [...links.inGoing, ...links.outGoing]) {
      if (this.set.contains(l.type) && l.type !== link) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "Entities must be connected by a single fundamental link.";
  }
  description() {
    return "Entities must be connected by a single fundamental link.";
  }
}
class ProceduralConsistency extends ConsistionalRule {
  constructor() {
    super(...arguments);
    this.set = links_set /* procedural */.qj;
  }
  typeLink() {
    return this.set;
  }
  canConnect(source, target, link) {
    if (!this.set.contains(link)) {
      return true;
    }
    const links = source.getAllLinksWith(target);
    for (const l of [...links.inGoing, ...links.outGoing]) {
      if (this.set.contains(l.type) && l.type !== link) {
        return false;
      }
    }
    return true;
  }
  message() {
    return "Entities must be connected by a single procedural link.";
  }
  description() {
    return "Entities must be connected by a single procedural link.";
  }
}
const consistional_rules_rules = new Array(new AgentConsistency(), new FundamentalConsistency(), new ProceduralConsistency(), new BaseConsistency());
; // CONCATENATED MODULE: ./src/app/models/consistency/consistancy.model.ts

// TODO: We should work with these methods
function getEntityType(logical_name) {
  switch (logical_name) {
    case "OpmLogicalObject":
      return entities_enum /* EntityType */.c.Object;
    case "OpmLogicalProcess":
      return entities_enum /* EntityType */.c.Process;
    case "OpmLogicalState":
      return entities_enum /* EntityType */.c.State;
  }
}
export function f(name) {
  if (name.includes("Agent")) {
    return ConfigurationOptions /* linkType */.h6.Agent;
  } else if (name.includes("Instrument")) {
    return ConfigurationOptions /* linkType */.h6.Instrument;
  } else if (name.includes("OvertimeUndertime-exception")) {
    return ConfigurationOptions /* linkType */.h6.UndertimeOvertimeException;
  } else if (name.includes("Invocation")) {
    return ConfigurationOptions /* linkType */.h6.Invocation;
  } else if (name.includes("Result")) {
    return ConfigurationOptions /* linkType */.h6.Result;
  } else if (name.includes("Consumption")) {
    return ConfigurationOptions /* linkType */.h6.Consumption;
  } else if (name.includes("Effect")) {
    return ConfigurationOptions /* linkType */.h6.Effect;
  } else if (name.includes("Overtime")) {
    return ConfigurationOptions /* linkType */.h6.OvertimeException;
  } else if (name.includes("Undertime")) {
    return ConfigurationOptions /* linkType */.h6.UndertimeException;
  } else if (name.includes("Unidirectional")) {
    return ConfigurationOptions /* linkType */.h6.Unidirectional;
  } else if (name.includes("Bidirectional")) {
    return ConfigurationOptions /* linkType */.h6.Bidirectional;
  } else if (name.includes("Aggregation")) {
    return ConfigurationOptions /* linkType */.h6.Aggregation;
  } else if (name.includes("Exhibition")) {
    return ConfigurationOptions /* linkType */.h6.Exhibition;
  } else if (name.includes("Generalization")) {
    return ConfigurationOptions /* linkType */.h6.Generalization;
  } else if (name.includes("Instantiation")) {
    return ConfigurationOptions /* linkType */.h6.Instantiation;
  }
}
export class j {
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