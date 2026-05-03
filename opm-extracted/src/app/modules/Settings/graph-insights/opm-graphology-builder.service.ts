// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/graph-insights/opm-graphology-builder.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpmGraphologyBuilderService = /*#__PURE__*/(() => {
  class OpmGraphologyBuilderService {
    buildDirected(snapshot) {
      const graph = new MultiDirectedGraph();
      snapshot.nodes.forEach(node => {
        graph.addNode(node.id, node);
      });
      snapshot.edges.forEach(edge => {
        if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) {
          return;
        }
        graph.addDirectedEdgeWithKey(edge.id, edge.source, edge.target, edge);
      });
      return graph;
    }
    toUndirected(directed) {
      // Use a multi undirected graph so opposite/sibling directed links
      // between the same pair do not fail during conversion.
      const graph = new MultiUndirectedGraph();
      directed.forEachNode((node, attributes) => {
        graph.addNode(node, attributes);
      });
      directed.forEachEdge((edge, attributes, source, target) => {
        if (!graph.hasNode(source) || !graph.hasNode(target)) {
          return;
        }
        const safeKey = graph.hasEdge(edge) ? `${edge}_u_${source}_${target}` : edge;
        graph.addUndirectedEdgeWithKey(safeKey, source, target, attributes);
      });
      return graph;
    }
    static #_ = (() => this.ɵfac = function OpmGraphologyBuilderService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpmGraphologyBuilderService)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: OpmGraphologyBuilderService,
      factory: OpmGraphologyBuilderService.ɵfac,
      providedIn: "root"
    }))();
  }
  return OpmGraphologyBuilderService;
})();