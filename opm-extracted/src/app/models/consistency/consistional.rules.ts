// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/consistional.rules.ts
// Extracted by opm-extracted/tools/extract.mjs

const AllEntites = createSet(EntityType.Object, EntityType.Process, EntityType.State);
class ConsistionalRule {
  type() {
    return RuleType.CONSISTIONAL;
  }
  typeLink() {
    return all;
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
    this.set = (0, createSet)(linkType.Result, linkType.Effect, linkType.Consumption, linkType.Agent, linkType.Instrument);
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
    this.set = (0, createSet)(linkType.Agent, linkType.Instrument);
    this.source = createSet(EntityType.Object, EntityType.State);
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
      const illegalType = link === linkType.Agent ? linkType.Instrument : linkType.Agent;
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
    this.set = fundamental;
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
    this.set = procedural;
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
const rules = new Array(new AgentConsistency(), new FundamentalConsistency(), new ProceduralConsistency(), new BaseConsistency());