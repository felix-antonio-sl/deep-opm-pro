// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/tree-view.service.ts
// Extracted by opm-extracted/tools/extract.mjs

const {
  find
} = lodash;
const tree_view_service_rootId = "SD";
let TreeViewService = /*#__PURE__*/(() => {
  class TreeViewService {
    constructor() {
      this.nodes = [];
      this.nodesSubject = new BehaviorSubject(this.nodes);
      this.nodesMap = new Map();
      this.initNodes();
    }
    initNodes() {
      this.nodesMap.clear();
      this.nodes.length = 0;
      this.parentNode = new node_model_Node({
        className: "root-class",
        expanded: true,
        children: [],
        id: tree_view_service_rootId,
        name: tree_view_service_rootId,
        parent: tree_view_service_rootId,
        initRappid: this.initRappid
      });
      this.nodesMap.set(tree_view_service_rootId, this.parentNode);
      this.nodes.push(this.parentNode);
    }
    getNodes() {
      return this.nodesSubject.asObservable();
    }
    init(model) {
      this.initNodes();
      const opds = model.opds.filter(opd => opd.isHidden === false);
      const requirementsViews = opds.filter(o => o.requirementViewOf);
      const sd = model.opds.find(opd => opd.id === "SD") || model.opds[0];
      const createNodesRecursively = (opd, ignore = false) => {
        if (!ignore) {
          this.createNewNode(opd.id, opd.parendId, undefined, false, opd.sharedOpdWithSubModelId, opd.belongsToSubModel, !!opd.sharedOpdWithSubModelId && !!opd.visualElements.length, opd.subModelEditDate);
        }
        for (const child of opd.children || []) {
          const childOpd = model.getOpd(child.id); // for making sure the real updated opd from the opmModel and not old version stored in the children array. Important!!
          if (!childOpd.requirementViewOf && childOpd.isHidden !== true) {
            createNodesRecursively(childOpd);
          }
        }
      };
      createNodesRecursively(sd, true);
      if (requirementsViews.length > 0) {
        this.addRequirementsNode();
        for (const rv of requirementsViews) {
          this.createNewNode(rv.id, rv.parendId, rv.name);
        }
      }
      if (model.stereotypes.getStereoTypes().length > 0) {
        this.addStereotypesNode();
      }
      for (const stereo of model.stereotypes.getStereoTypes()) {
        stereo.opd.belongsToSubModel = stereo.belongsToSubModel;
        this.createNewNode(stereo.opd.id, "Stereotypes", undefined, undefined, undefined, stereo.belongsToSubModel);
      }
      this.nodesSubject.next(this.nodes);
      if (!this.treeView?.treeModel) {
        return;
      }
      const treeNodesMap = new Map();
      model.opds.forEach(opd => treeNodesMap.set(opd.id, this.treeView.treeModel.getNodeById(opd.id)));
      for (const opd of model.opds) {
        const node = treeNodesMap.get(opd.id);
        if (!node) {
          continue;
        }
        this.setNodePath(node, treeNodesMap);
      }
      for (const stereo of model.stereotypes.getStereoTypes()) {
        const nd = this.treeView.treeModel.getNodeById(stereo.opd.id);
        nd.data.name = stereo.getName();
      }
    }
    setNodePath(node, treeNodesMap = null) {
      if (!node) {
        return;
      }
      let path = node.path;
      if (path.length == 1) {
        return;
      }
      let result = "";
      for (let k = 1; k < path.length; k++) {
        let next = treeNodesMap ? treeNodesMap.get(path[k]) : this.treeView.treeModel.getNodeById(path[k]);
        if (next) {
          if (result == "") {
            result = next.index + 1;
          } else {
            result = result + "." + (next.index + 1);
          }
        }
      }
      node.data.subTitle = result;
    }
    createNewNode(nodeId, parentNodeId, name, treeRefresh = false, sharedOpdWithSubModelId = null, belongsToSubModel = null, subModelAlreadyLoaded = null, subModelEditDate = null) {
      const parentNode = this.getNodeById(parentNodeId) || this.getNodeById("SD");
      const newNode = new node_model_Node({
        className: "root-class",
        expanded: true,
        children: [],
        id: nodeId,
        name: name ? name : "SD",
        parent: parentNode,
        graph: null,
        type: "",
        subTitle: "",
        initRappid: this.initRappid,
        sharedOpdWithSubModelId: sharedOpdWithSubModelId,
        belongsToSubModel: belongsToSubModel,
        subModelAlreadyLoaded: subModelAlreadyLoaded,
        subModelEditDate: subModelEditDate
      });
      parentNode.addChildren(newNode);
      this.nodesMap.set(nodeId, newNode);
      if (treeRefresh) {
        this.nodesSubject.next(this.nodes);
        const node = this.treeView.treeModel.getNodeById(nodeId);
        this.setNodePath(node);
      }
    }
    addStereotypesNode() {
      return this.createDummyNode("Stereotypes", "Stereotypes");
    }
    addRequirementsNode() {
      return this.createDummyNode("Requirements", "Requirement Views");
    }
    createDummyNode(nodeId, name, refreshTree = false) {
      const newNode = new node_model_Node({
        className: "root-class",
        expanded: true,
        children: [],
        id: nodeId,
        name: name,
        parent: nodeId,
        graph: null,
        type: "",
        subTitle: nodeId,
        initRappid: this.initRappid
      });
      this.nodes.push(newNode);
      this.nodesMap.set(nodeId, newNode);
      if (refreshTree) {
        this.nodesSubject.next(this.nodes);
      }
      return newNode;
    }
    removeNode(nodeId) {
      const node = this.getNodeById(nodeId);
      const idStr = nodeId.toString();
      this.removeNodeBy(node => node.id.toString() === idStr, this.nodes[0], nodeId);
      this.nodesMap.delete(nodeId);
      // this.nodesSubject.next(this.nodes);
    }
    getNodeById(id) {
      if (id == tree_view_service_rootId) {
        return this.nodes[0];
      }
      if (id === "Stereotypes") {
        return this.nodes.find(node => node.id === "Stereotypes");
      }
      if (id === "Requirements") {
        return this.nodes.find(node => node.id === "Requirements");
      }
      const idStr = id.toString();
      const fromMap = this.nodesMap.get(id);
      if (fromMap) {
        return fromMap;
      }
      return this.getNodeBy(node => node.id?.toString() === idStr);
    }
    getNodeByIdType(id, type) {
      if (id == tree_view_service_rootId) {
        return this.nodes[0];
      }
      const idStr = id.toString();
      return this.getNodeBy(node => node.id.toString() === idStr && node.type === type);
    }
    getNodeBy(predicate, startNode = this.nodes[0]) {
      startNode = startNode;
      if (!startNode.children) {
        return null;
      }
      const found = find(startNode.children, predicate);
      if (found) {
        // found in children
        return found;
      } else {
        // look in children's children
        for (let child of startNode.children) {
          const foundInChildren = this.getNodeBy(predicate, child);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
      }
    }
    removeNodeBy(predicate, startNode = this.nodes[0], childNameToRemove) {
      startNode = startNode;
      if (!startNode.children) {
        return null;
      }
      const found = find(startNode.children, predicate);
      if (found) {
        // found in children
        startNode.children = startNode.children.filter(function (child) {
          return child.id !== childNameToRemove;
        });
        return found;
      } else {
        // look in children's children
        for (let child of startNode.children) {
          const foundInChildren = this.removeNodeBy(predicate, child, childNameToRemove);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
      }
    }
    removeAll() {
      function remove(node) {
        for (let i = 0; i < node.children.length; i++) {
          remove(node.children[i]);
        }
      }
    }
    getNodeDepth(node) {
      let counter = 0;
      let temp = node;
      while (temp?.parent) {
        counter++;
        temp = temp.parent;
      }
      return counter;
    }
    expandAllNodes() {
      for (const opd of this.initRappid.opmModel.opds.filter(o => !o.isHidden)) {
        const nd = this.treeView.treeModel.getNodeById(opd.id);
        if (nd && !nd.data.belongsToSubModel && !nd.data.sharedOpdWithSubModelId) {
          this.treeView.treeModel.setExpandedNode(nd, true);
        } else if (nd && (nd.data.belongsToSubModel || nd.data.sharedOpdWithSubModelId)) {
          this.treeView.treeModel.setExpandedNode(nd, false);
        }
      }
      if (this.treeView.treeModel.getNodeById("Stereotypes")) {
        this.treeView.treeModel.getNodeById("Stereotypes").expandAll();
      }
      for (const stereotype of this.initRappid.opmModel.stereotypes.getStereoTypes()) {
        if (this.treeView.treeModel.getNodeById(stereotype.opd.id)) {
          this.treeView.treeModel.getNodeById(stereotype.opd.id).expandAll();
        }
      }
    }
    static #_ = (() => this.ɵfac = function TreeViewService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || TreeViewService)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: TreeViewService,
      factory: TreeViewService.ɵfac
    }))();
  }
  return TreeViewService;
})();