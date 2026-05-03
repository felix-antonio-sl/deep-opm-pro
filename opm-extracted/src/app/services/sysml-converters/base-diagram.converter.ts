// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-converters/base-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

class BaseDiagramConverter {
  generateId(prefix = "elem") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  escapeXml(text) {
    if (!text) {
      return "";
    }
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  getAllOpds(model) {
    return model.opds.filter(opd => !opd.isHidden);
  }
  getSystemDiagram(model) {
    return model.opds.find(opd => opd.id === "SD" && !opd.isHidden) || model.opds[0];
  }
  // Get all logical objects from the model
  getAllLogicalObjects(model) {
    return model.logicalElements.filter(el => el instanceof OpmLogicalObject);
  }
  // Get all logical processes from the model
  getAllLogicalProcesses(model) {
    return model.logicalElements.filter(el => el instanceof OpmLogicalProcess);
  }
  // Get all logical states from the model
  getAllLogicalStates(model) {
    const states = [];
    const objects = this.getAllLogicalObjects(model);
    objects.forEach(obj => {
      states.push(...obj.states);
    });
    return states;
  }
  // Get all logical relations (links) from the model
  getAllLogicalRelations(model) {
    return model.logicalElements.filter(el => el.isLink && el.isLink());
  }
  // Check if a logical object is environmental
  isEnvironmentalLogicalObject(logical) {
    return logical.affiliation === Affiliation.Environmental;
  }
  // Check if a logical object is physical
  isPhysicalLogicalObject(logical) {
    return logical.essence === Essence.Physical;
  }
  // Get visual element ID for a logical element (for diagram layout)
  getVisualIdForLogical(logical) {
    if (logical.visualElements && logical.visualElements.length > 0) {
      return logical.visualElements[0].id;
    }
    return null;
  }
  getOpdLevel(opd, model) {
    if (opd.id === "SD") {
      return 0;
    }
    let level = 1;
    let currentOpd = opd;
    while (currentOpd) {
      const parent = this.findParentOpd(currentOpd, model);
      if (!parent || parent.id === "SD") {
        break;
      }
      level++;
      currentOpd = parent;
    }
    return level;
  }
  findParentOpd(opd, model) {
    if (opd.parendId && opd.parendId !== "SD") {
      const parent = model.opds.find(p => p.id === opd.parendId);
      if (parent) {
        return parent;
      }
    }
    for (const parentOpd of model.opds) {
      if (parentOpd === opd || parentOpd.isHidden) {
        continue;
      }
      for (const element of parentOpd.visualElements) {
        if (OPCloudUtils.isInstanceOfVisualThing(element)) {
          const thing = element;
          if (thing.refineeInzooming || thing.refineeUnfolding) {
            const refinedOpd = model.getOpdByThingId(thing.id);
            if (refinedOpd === opd) {
              return parentOpd;
            }
          }
        }
      }
    }
    return null;
  }
  getDirectSubProcesses(process) {
    if (!process || typeof process.getChildren !== "function") {
      return [];
    }
    const children = process.getChildren() || [];
    return children.filter(child => child instanceof OpmLogicalProcess);
  }
  getPrimaryVisualY(thing) {
    const visual = thing?.visualElements?.[0];
    if (typeof visual?.yPos === "number") {
      return visual.yPos;
    } else {
      return 0;
    }
  }
  getOwningObjectFromElement(element) {
    if (element instanceof OpmLogicalObject) {
      return element;
    }
    if (element?.parent && element.parent instanceof OpmLogicalObject) {
      return element.parent;
    }
    return null;
  }
  hasConditionFlag(relation) {
    return !!relation?.condition;
  }
  hasEventFlag(relation) {
    return !!relation?.event;
  }
}