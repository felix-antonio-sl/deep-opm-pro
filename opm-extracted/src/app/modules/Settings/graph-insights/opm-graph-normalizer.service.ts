// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/graph-insights/opm-graph-normalizer.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpmGraphNormalizerService = /*#__PURE__*/(() => {
  class OpmGraphNormalizerService {
    constructor(initRappidService, contextService) {
      this.initRappidService = initRappidService;
      this.contextService = contextService;
      this.flatteningOpdId = "OPMqUeRy";
    }
    buildSnapshot(projection) {
      const model = this.initRappidService.getOpmModel();
      const currentOpd = model.currentOpd;
      const flattenedOpd = model.flattening(false);
      const nodeMap = new Map();
      const edges = [];
      flattenedOpd.visualElements.filter(visual => visual instanceof OpmLink).forEach(visualLink => {
        const relation = visualLink.logicalElement;
        if (!relation) {
          return;
        }
        const relationName = this.toRelationTypeName(relation.linkType);
        if (!this.isRelationIncluded(projection, relationName)) {
          return;
        }
        const source = visualLink.sourceVisualElement;
        const targetWrapper = visualLink.targetVisualElements?.[0];
        const target = targetWrapper?.targetVisualElement;
        if (!(source instanceof OpmVisualEntity) || !(target instanceof OpmVisualEntity)) {
          return;
        }
        const sourceNode = this.toNode(source);
        const targetNode = this.toNode(target);
        nodeMap.set(sourceNode.id, sourceNode);
        nodeMap.set(targetNode.id, targetNode);
        const edgeId = `edge:${visualLink.id}`;
        edges.push({
          id: edgeId,
          source: sourceNode.id,
          target: targetNode.id,
          relationType: this.toCanonicalRelationType(relationName),
          opmRelationKind: relationName,
          directed: true,
          weight: 1,
          label: relationName,
          opdId: flattenedOpd.id,
          attributes: {
            sourceCardinality: relation.sourceCardinality || "",
            targetCardinality: relation.targetCardinality || ""
          }
        });
      });
      this.cleanupFlattenedOpd(model);
      model.currentOpd = currentOpd;
      return {
        nodes: Array.from(nodeMap.values()),
        edges,
        metadata: {
          modelId: this.contextService?.getCurrentModelId?.(),
          modelName: model.name,
          createdAt: new Date().toISOString(),
          nodeCount: nodeMap.size,
          edgeCount: edges.length,
          sourceOpdIds: [flattenedOpd.id],
          graphBuildSummary: `Edges and nodes are taken from the temporary flattened OPD produced by opmModel.flattening(false) (DSM flattening, OPD id ${this.flatteningOpdId}), using the same approach as “Download Model Triplets” in Model Analysis Tools.`,
          rdfRelationshipNote: "RDF/Turtle export (OpmRdfService) describes the logical model with opm: link individuals and opm:source / opm:destination. Graph Insights does not parse Turtle; it reads flattened visual links. Relation names use the same linkType vocabulary as RDF export."
        }
      };
    }
    toNode(visualEntity) {
      const logical = visualEntity.logicalElement;
      const lid = logical?.lid || visualEntity.id;
      let kind = "unknown";
      if (logical instanceof OpmLogicalObject) {
        kind = "object";
      } else if (logical instanceof OpmLogicalProcess) {
        kind = "process";
      } else if (logical instanceof OpmLogicalState) {
        kind = "state";
      }
      const displayLabel = logical?.getBareName?.() || logical?.textForListLogical || logical?.text || lid;
      const parentId = logical instanceof OpmLogicalState && logical.parent?.lid ? `node:${logical.parent.lid}` : undefined;
      return {
        id: `node:${lid}`,
        opmId: lid,
        label: displayLabel,
        kind,
        subKind: visualEntity.type?.replace("OpmLogical", "").toLowerCase(),
        parentId,
        isExternal: logical?.essence === Essence.Informatical,
        isEnvironmental: logical?.affiliation === Affiliation.Environmental,
        isLeaf: !logical?.inZoomedOpd?.id,
        attributes: {},
        rawRef: undefined
      };
    }
    toRelationTypeName(typeValue) {
      return linkType[typeValue] || "Unknown";
    }
    toCanonicalRelationType(relation) {
      return relation.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    }
    isRelationIncluded(projection, relationTypeName) {
      const structural = new Set(["Aggregation", "Exhibition", "Generalization", "Instantiation"]);
      const behavioral = new Set(["Agent", "Instrument", "Consumption", "Result", "Effect", "Invocation", "UndertimeException", "OvertimeException", "UndertimeOvertimeException", "Unidirectional", "Bidirectional"]);
      if (projection === "full") {
        return structural.has(relationTypeName) || behavioral.has(relationTypeName);
      }
      if (projection === "structural") {
        return structural.has(relationTypeName);
      }
      if (projection === "behavioral") {
        return behavioral.has(relationTypeName);
      }
      return structural.has(relationTypeName) || behavioral.has(relationTypeName);
    }
    cleanupFlattenedOpd(model) {
      model.setShouldLogForUndoRedo(false, "graph-insights");
      if (model.getOpd(this.flatteningOpdId) !== null) {
        model.removeOpd(this.flatteningOpdId);
      }
      model.setShouldLogForUndoRedo(true, "graph-insights");
    }
    static #_ = (() => this.ɵfac = function OpmGraphNormalizerService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpmGraphNormalizerService)(core /* ɵɵinject */.KVO(InitRappidService), core /* ɵɵinject */.KVO(ContextService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: OpmGraphNormalizerService,
      factory: OpmGraphNormalizerService.ɵfac,
      providedIn: "root"
    }))();
  }
  return OpmGraphNormalizerService;
})();