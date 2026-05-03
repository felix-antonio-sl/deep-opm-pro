// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/graph-insights/graph-insights.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let GraphInsightsService = /*#__PURE__*/(() => {
  class GraphInsightsService {
    constructor(normalizer, builder) {
      this.normalizer = normalizer;
      this.builder = builder;
      this.cache = new Map();
    }
    buildSnapshot(projection, forceRefresh = false) {
      if (!forceRefresh && this.cache.has(projection)) {
        return this.cache.get(projection);
      }
      const snapshot = this.normalizer.buildSnapshot(projection);
      const graph = this.builder.buildDirected(snapshot);
      const state = {
        snapshot,
        graph
      };
      this.cache.set(projection, state);
      return state;
    }
    getSummary(graph, snapshot) {
      const components = (0, connectedComponents)(this.builder.toUndirected(graph));
      const isolated = snapshot.nodes.filter(node => graph.degree(node.id) === 0).length;
      const highRiskHubs = snapshot.nodes.filter(node => graph.degree(node.id) >= 8).length;
      return {
        totalNodes: snapshot.nodes.length,
        totalEdges: snapshot.edges.length,
        objects: snapshot.nodes.filter(node => node.kind === "object").length,
        processes: snapshot.nodes.filter(node => node.kind === "process").length,
        states: snapshot.nodes.filter(node => node.kind === "state").length,
        isolatedElements: isolated,
        connectedComponents: components.length,
        highRiskHubs
      };
    }
    analyzeNeighborhood(graph, nodeId) {
      if (!graph.hasNode(nodeId)) {
        return null;
      }
      const neighbors = new Set();
      const relationGroups = {};
      const kindGroups = {};
      graph.forEachOutboundEdge(nodeId, (_edge, attrs, _s, target) => {
        neighbors.add(target);
        relationGroups[attrs.relationType] = (relationGroups[attrs.relationType] || 0) + 1;
        const kind = graph.getNodeAttribute(target, "kind") || "unknown";
        kindGroups[kind] = (kindGroups[kind] || 0) + 1;
      });
      graph.forEachInboundEdge(nodeId, (_edge, attrs, source) => {
        neighbors.add(source);
        relationGroups[attrs.relationType] = (relationGroups[attrs.relationType] || 0) + 1;
        const kind = graph.getNodeAttribute(source, "kind") || "unknown";
        kindGroups[kind] = (kindGroups[kind] || 0) + 1;
      });
      const label = graph.getNodeAttribute(nodeId, "label") || nodeId;
      const processCount = kindGroups.process || 0;
      const objectCount = kindGroups.object || 0;
      const stateCount = kindGroups.state || 0;
      const explanation = `${label} is directly connected to ${objectCount} objects, ${processCount} processes, and ${stateCount} states in the selected projection.`;
      return {
        nodeId,
        nodeLabel: label,
        totalNeighbors: neighbors.size,
        neighborsByRelation: relationGroups,
        relatedKinds: kindGroups,
        explanation
      };
    }
    /**
     * Shortest path: BFS avoids MultiDirected graph quirks with graphology-shortest-path.
     * `treatAsUndirected`: use symmetric adjacency (good when the projection is mostly “connected” visually).
     */
    findShortestPath(graph, sourceId, targetId, options) {
      if (!graph.hasNode(sourceId) || !graph.hasNode(targetId)) {
        return null;
      }
      const treatAsUndirected = !!options?.treatAsUndirected;
      let path;
      if (treatAsUndirected) {
        path = this.bfsShortestUndirected(this.builder.toUndirected(graph), sourceId, targetId);
      } else {
        path = this.bfsShortestDirected(graph, sourceId, targetId);
      }
      if (!path || path.length < 2) {
        return null;
      }
      const steps = this.toPathSteps(graph, path);
      const modeNote = treatAsUndirected ? " (relations treated as undirected for this query)" : "";
      return {
        kind: "shortest",
        nodePath: path,
        steps,
        explanation: `The shortest chain between the selected elements has ${steps.length} relation step(s)${modeNote}.`
      };
    }
    findSimplePaths(graph, sourceId, targetId, maxDepth, maxResults, treatAsUndirected = false) {
      if (!graph.hasNode(sourceId) || !graph.hasNode(targetId)) {
        return [];
      }
      const results = [];
      const visited = new Set([sourceId]);
      const path = [sourceId];
      const undirected = treatAsUndirected ? this.builder.toUndirected(graph) : null;
      const visitNeighbors = (node, cb) => {
        if (undirected) {
          undirected.forEachNeighbor(node, neighbor => cb(neighbor));
        } else {
          graph.forEachOutboundNeighbor(node, neighbor => cb(neighbor));
        }
      };
      const dfs = (node, depth) => {
        if (results.length >= maxResults || depth > maxDepth) {
          return;
        }
        if (node === targetId && path.length > 1) {
          results.push([...path]);
          return;
        }
        visitNeighbors(node, neighbor => {
          if (visited.has(neighbor) || results.length >= maxResults) {
            return;
          }
          visited.add(neighbor);
          path.push(neighbor);
          dfs(neighbor, depth + 1);
          path.pop();
          visited.delete(neighbor);
        });
      };
      dfs(sourceId, 0);
      return results.map(nodePath => ({
        kind: "simple",
        nodePath,
        steps: this.toPathSteps(graph, nodePath),
        explanation: `Alternative path with ${Math.max(0, nodePath.length - 1)} steps between the selected elements.`
      }));
    }
    computeImportantElements(graph, limit = 10) {
      if (graph.order === 0) {
        return [];
      }
      const betweenByNode = betweenness_default()(graph);
      const pagerankByNode = pagerank_default()(graph);
      const rows = graph.nodes().map(nodeId => {
        const label = graph.getNodeAttribute(nodeId, "label") || nodeId;
        const kind = graph.getNodeAttribute(nodeId, "kind") || "unknown";
        const degree = graph.degree(nodeId);
        const between = betweenByNode[nodeId] || 0;
        const rank = pagerankByNode[nodeId] || 0;
        let interpretation = "Highly connected model element.";
        if (between > 0.15) {
          interpretation = "Potential bridge element that may connect separate model areas.";
        } else if (degree >= 8) {
          interpretation = "Potentially overloaded core element with many interactions.";
        } else if (rank > 0.02) {
          interpretation = "Influential element in relation propagation flow.";
        }
        return {
          nodeId,
          label,
          kind,
          degree,
          betweenness: between,
          interpretation
        };
      });
      return rows.sort((a, b) => (b.betweenness || 0) - (a.betweenness || 0) || b.degree - a.degree).slice(0, limit);
    }
    computeConnectivity(graph) {
      const undirected = this.builder.toUndirected(graph);
      const cc = (0, connectedComponents)(undirected);
      const scc = (0, stronglyConnectedComponents)(graph);
      const isolatedNodes = graph.nodes().filter(node => graph.degree(node) === 0);
      const noIncoming = graph.nodes().filter(node => graph.inDegree(node) === 0);
      const noOutgoing = graph.nodes().filter(node => graph.outDegree(node) === 0);
      return {
        connectedComponents: cc,
        stronglyConnectedComponents: scc,
        isolatedNodes,
        noIncoming,
        noOutgoing,
        explanation: `The model appears split into ${cc.length} connected areas in this projection.`
      };
    }
    detectSuspiciousPatterns(graph) {
      const listCap = 40;
      const isolatedNodes = graph.nodes().filter(node => graph.degree(node) === 0);
      const hubs = graph.nodes().filter(node => graph.degree(node) >= 10);
      const processGaps = graph.nodes().filter(node => {
        const kind = graph.getNodeAttribute(node, "kind");
        return kind === "process" && (graph.inDegree(node) === 0 || graph.outDegree(node) === 0);
      });
      const bottleneckRows = this.computeImportantElements(graph, 50).filter(item => (item.betweenness || 0) > 0.2);
      const bottlenecks = bottleneckRows.map(item => item.nodeId);
      const insights = [];
      if (isolatedNodes.length) {
        const shown = isolatedNodes.slice(0, listCap);
        insights.push({
          category: "isolated",
          nodeIds: isolatedNodes,
          items: this.patternItemsFromIds(graph, shown),
          title: "Isolated model knowledge",
          description: `${isolatedNodes.length} element(s) have no relations in this projection and may be unused or incomplete fragments. Elements:`,
          truncatedRemaining: isolatedNodes.length > listCap ? isolatedNodes.length - listCap : undefined
        });
      }
      if (hubs.length) {
        const shown = hubs.slice(0, listCap);
        insights.push({
          category: "hub",
          nodeIds: hubs,
          items: this.patternItemsFromIds(graph, shown, id => `degree ${graph.degree(id)}`),
          title: "Potentially overloaded core elements",
          description: `${hubs.length} element(s) have very high connectivity (degree ≥ 10) and may act as architectural chokepoints. Elements:`,
          truncatedRemaining: hubs.length > listCap ? hubs.length - listCap : undefined
        });
      }
      if (processGaps.length) {
        const shown = processGaps.slice(0, listCap);
        insights.push({
          category: "process-gap",
          nodeIds: processGaps,
          items: this.patternItemsFromIds(graph, shown, id => this.processGapDetail(graph, id)),
          title: "Processes missing expected flows",
          description: `${processGaps.length} process(es) have no incoming and/or no outgoing links in this projection (expected inputs/outputs may be missing). Processes:`,
          truncatedRemaining: processGaps.length > listCap ? processGaps.length - listCap : undefined
        });
      }
      if (bottlenecks.length) {
        const shown = bottleneckRows.slice(0, listCap);
        insights.push({
          category: "bottleneck",
          nodeIds: bottlenecks,
          items: shown.map(row => ({
            nodeId: row.nodeId,
            label: row.label,
            kind: row.kind,
            detail: row.betweenness !== undefined ? `betweenness ${row.betweenness.toFixed(3)}` : undefined
          })),
          title: "Bridge bottlenecks",
          description: `${bottlenecks.length} element(s) score high on betweenness and may bridge separate parts of the model. Elements:`,
          truncatedRemaining: bottleneckRows.length > listCap ? bottleneckRows.length - listCap : undefined
        });
      }
      return insights;
    }
    patternItemsFromIds(graph, nodeIds, detailFor) {
      return nodeIds.map(id => ({
        nodeId: id,
        label: graph.getNodeAttribute(id, "label") || id,
        kind: graph.getNodeAttribute(id, "kind"),
        detail: detailFor?.(id)
      }));
    }
    processGapDetail(graph, processId) {
      const noIn = graph.inDegree(processId) === 0;
      const noOut = graph.outDegree(processId) === 0;
      if (noIn && noOut) {
        return "no incoming and no outgoing relations";
      }
      if (noIn) {
        return "no incoming relations";
      }
      return "no outgoing relations";
    }
    toPathSteps(graph, nodePath) {
      const steps = [];
      for (let i = 0; i < nodePath.length - 1; i++) {
        const from = nodePath[i];
        const to = nodePath[i + 1];
        steps.push({
          from,
          to,
          relationType: this.relationLabelBetween(graph, from, to)
        });
      }
      return steps;
    }
    /**
     * Never call `graph.edge(u,v)` on a MultiDirectedGraph — multiple parallel edges throw UsageGraphError.
     */
    relationLabelBetween(graph, from, to) {
      let relation = "";
      graph.forEachOutboundEdge(from, (_e, attrs, _s, tgt) => {
        if (tgt === to && !relation) {
          relation = attrs?.relationType || attrs?.opmRelationKind || "";
        }
      });
      if (relation) {
        return relation;
      }
      graph.forEachOutboundEdge(to, (_e, attrs, _s, tgt) => {
        if (tgt === from && !relation) {
          relation = attrs?.relationType || attrs?.opmRelationKind || "";
        }
      });
      return relation || "related_to";
    }
    bfsShortestDirected(graph, source, target) {
      if (source === target) {
        return [source];
      }
      const queue = [source];
      const prev = new Map();
      prev.set(source, null);
      while (queue.length) {
        const u = queue.shift();
        if (u === target) {
          break;
        }
        graph.forEachOutboundNeighbor(u, v => {
          if (!prev.has(v)) {
            prev.set(v, u);
            queue.push(v);
          }
        });
      }
      if (!prev.has(target)) {
        return null;
      }
      return this.reconstructPath(prev, target);
    }
    bfsShortestUndirected(undirected, source, target) {
      if (source === target) {
        return [source];
      }
      const queue = [source];
      const prev = new Map();
      prev.set(source, null);
      while (queue.length) {
        const u = queue.shift();
        if (u === target) {
          break;
        }
        undirected.forEachNeighbor(u, v => {
          if (!prev.has(v)) {
            prev.set(v, u);
            queue.push(v);
          }
        });
      }
      if (!prev.has(target)) {
        return null;
      }
      return this.reconstructPath(prev, target);
    }
    reconstructPath(prev, target) {
      const path = [];
      let cur = target;
      while (cur !== null) {
        path.push(cur);
        cur = prev.get(cur) ?? null;
      }
      path.reverse();
      return path;
    }
    static #_ = (() => this.ɵfac = function GraphInsightsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GraphInsightsService)(core /* ɵɵinject */.KVO(OpmGraphNormalizerService), core /* ɵɵinject */.KVO(OpmGraphologyBuilderService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: GraphInsightsService,
      factory: GraphInsightsService.ɵfac,
      providedIn: "root"
    }))();
  }
  return GraphInsightsService;
})();