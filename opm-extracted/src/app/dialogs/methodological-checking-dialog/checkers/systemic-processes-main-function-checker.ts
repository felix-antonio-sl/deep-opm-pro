// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Validates that every systemic process is structurally connected to the main systemic
 * process on SD (fundamental structural links and/or in-zoom / unfold aggregation chain).
 */
class SystemicProcessesMainFunctionChecker extends MethodologicalChecker {
  static #_ = (() => this.transformingLinkTypes = (0, createSet)(linkType.Result, linkType.Consumption, linkType.Effect))();
  constructor(model) {
    super(model);
    this.title = "All Systemic Processes are connected";
  }
  check() {
    this.invalidThings = [];
    const main = this.resolveMainSystemicProcessOnSd();
    if (!main) {
      this.status = MethodologicalCheckingStatus.VALID;
      return;
    }
    const inMainHierarchy = this.collectSystemicProcessesStructurallyConnectedToMain(main);
    for (const log of this.model.logicalElements) {
      if (!OPCloudUtils.isInstanceOfLogicalProcess(log)) {
        continue;
      }
      const proc = log;
      if (proc.affiliation !== Affiliation.Systemic) {
        continue;
      }
      if (this.isExcludedFromModelCheck(proc)) {
        continue;
      }
      if (!inMainHierarchy.has(proc)) {
        this.addToInvalidThings(proc);
      }
    }
    this.status = this.invalidThings.length === 0 ? MethodologicalCheckingStatus.VALID : MethodologicalCheckingStatus.INVALID;
  }
  getDescriptionTooltip() {
    return "Each systemic process should be connected to the main systemic process on the System Diagram (SD) through structural links (aggregation, exhibition, generalization, or classification-instantiation), or via subprocesses and aggregation from unfold.";
  }
  getInvalidThingsDetailsSubtitle() {
    return "ISO/IEC 19450 (OPM): every systemic process should be tied to the main systemic process on the System diagram (SD). Valid connections are paths of fundamental structural relations—aggregation–partonomy, characterization–exhibition, generalization–specialization, or classification–instantiation—or subprocesses created by in-zoom together with partonomic aggregation along an unfold chain (as in a full unfolded structural view).";
  }
  isExcludedFromModelCheck(thing) {
    return !!thing.getBelongsToStereotyped() || !!thing.getStereotype();
  }
  /**
   * Closure of systemic processes reachable from the main process: BFS over fundamental
   * structural links (aggregation, exhibition, generalization, instantiation), traversing
   * objects and states as needed, seeded with the in-zoom / aggregation process subtree.
   */
  collectSystemicProcessesStructurallyConnectedToMain(main) {
    const connected = new Set();
    const visited = new Set();
    const queue = [];
    const tryEnqueue = e => {
      if (e?.lid != null && !visited.has(e.lid)) {
        queue.push(e);
      }
    };
    tryEnqueue(main);
    for (const ent of main.getChildrenDeepIncludingAggregation("process")) {
      if (OPCloudUtils.isInstanceOfLogicalProcess(ent)) {
        tryEnqueue(ent);
      }
    }
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node?.lid || visited.has(node.lid)) {
        continue;
      }
      visited.add(node.lid);
      if (OPCloudUtils.isInstanceOfLogicalProcess(node)) {
        const proc = node;
        if (proc.affiliation === Affiliation.Systemic && !this.isExcludedFromModelCheck(proc)) {
          connected.add(proc);
        }
      }
      for (const rel of [...node.getLinks().inGoing, ...node.getLinks().outGoing]) {
        if (!rel.isLink()) {
          continue;
        }
        const relation = rel;
        if (!structural.contains(relation.linkType)) {
          continue;
        }
        for (const nb of this.structuralLinkNeighborLogicalEntities(node, relation)) {
          tryEnqueue(nb);
        }
      }
    }
    return connected;
  }
  structuralLinkNeighborLogicalEntities(from, rel) {
    const src = rel.sourceLogicalElement;
    const tgts = rel.targetLogicalElements || [];
    const ends = [];
    if (src) {
      ends.push(src);
    }
    ends.push(...tgts);
    const out = [];
    for (const e of ends) {
      if (e && e !== from && !out.includes(e)) {
        out.push(e);
      }
    }
    return out;
  }
  /**
   * Main function: systemic, on SD as a root process, and (when there are several roots)
   * the one that transforms objects — matching the idea that the main function is tied to the system object.
   */
  resolveMainSystemicProcessOnSd() {
    const sd = this.model.opds.find(o => o.id === "SD" && !o.isHidden);
    if (!sd) {
      return undefined;
    }
    const onSd = this.collectSystemicProcessesShownOnOpd(sd);
    if (onSd.length === 0) {
      return undefined;
    }
    if (onSd.length === 1) {
      return onSd[0];
    }
    const roots = this.collectRootSystemicProcessesOnOpd(sd);
    if (roots.length === 0) {
      return undefined;
    }
    if (roots.length === 1) {
      return roots[0];
    }
    const transformingRoots = roots.filter(p => this.processTransformsObjects(p));
    let candidates;
    if (transformingRoots.length === 1) {
      return transformingRoots[0];
    }
    if (transformingRoots.length > 1) {
      candidates = transformingRoots;
    } else {
      const mainObj = this.getMainSystemObject();
      if (mainObj) {
        const linkedRoots = roots.filter(p => this.hasAnyRelationWith(p, mainObj));
        if (linkedRoots.length === 1) {
          return linkedRoots[0];
        }
        candidates = linkedRoots.length ? linkedRoots : roots;
      } else {
        candidates = roots;
      }
    }
    const mainObj = this.getMainSystemObject();
    if (mainObj) {
      const linked = candidates.filter(p => this.hasAnyRelationWith(p, mainObj));
      if (linked.length === 1) {
        return linked[0];
      }
      if (linked.length > 1) {
        candidates = linked;
      }
    }
    const systemHintLinked = candidates.filter(p => this.hasLinkToSystemNamedObject(p));
    if (systemHintLinked.length === 1) {
      return systemHintLinked[0];
    }
    if (systemHintLinked.length > 1) {
      candidates = systemHintLinked;
    }
    return candidates.slice().sort((a, b) => a.lid.localeCompare(b.lid))[0];
  }
  getMainSystemObject() {
    return this.model.logicalElements.find(l => OPCloudUtils.isInstanceOfLogicalObject(l) && l.isMainThing);
  }
  /** True if the process has Result / Consumption / Effect with an object (or its state) on any diagram. */
  processTransformsObjects(proc) {
    const needed = SystemicProcessesMainFunctionChecker.transformingLinkTypes;
    for (const vis of proc.visualElements) {
      if (!OPCloudUtils.isInstanceOfVisualProcess(vis)) {
        continue;
      }
      const links = vis.getAllLinks();
      for (const l of [...links.inGoing, ...links.outGoing]) {
        if (!needed.contains(l.type)) {
          continue;
        }
        const other = l.source === vis ? l.target : l.source;
        if (other && OPCloudUtils.isInstanceOfVisualObject(other)) {
          return true;
        }
        if (other && OPCloudUtils.isInstanceOfVisualState(other)) {
          const father = other.fatherObject;
          if (father && OPCloudUtils.isInstanceOfVisualObject(father)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  hasLinkToSystemNamedObject(proc) {
    for (const log of this.model.logicalElements) {
      if (!OPCloudUtils.isInstanceOfLogicalObject(log)) {
        continue;
      }
      const obj = log;
      if (!obj.getBareName().toLowerCase().includes("system")) {
        continue;
      }
      if (this.hasAnyRelationWith(proc, obj)) {
        return true;
      }
    }
    return false;
  }
  collectSystemicProcessesShownOnOpd(opd) {
    const out = [];
    for (const vis of opd.visualElements) {
      if (!OPCloudUtils.isInstanceOfVisualProcess(vis)) {
        continue;
      }
      const logical = vis.logicalElement;
      if (logical.affiliation !== Affiliation.Systemic || this.isExcludedFromModelCheck(logical)) {
        continue;
      }
      if (!out.find(p => p.lid === logical.lid)) {
        out.push(logical);
      }
    }
    return out;
  }
  collectRootSystemicProcessesOnOpd(opd) {
    const out = [];
    for (const vis of opd.visualElements) {
      if (!OPCloudUtils.isInstanceOfVisualProcess(vis)) {
        continue;
      }
      const procVis = vis;
      if (procVis.fatherObject) {
        continue;
      }
      const logical = vis.logicalElement;
      if (logical.affiliation !== Affiliation.Systemic || this.isExcludedFromModelCheck(logical)) {
        continue;
      }
      if (!out.find(p => p.lid === logical.lid)) {
        out.push(logical);
      }
    }
    return out;
  }
  hasAnyRelationWith(a, b) {
    const {
      inGoing,
      outGoing
    } = a.getLinksWith(b);
    return inGoing.length + outGoing.length > 0;
  }
}