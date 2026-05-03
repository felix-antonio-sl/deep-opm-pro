// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/treeParser.ts
// Extracted by opm-extracted/tools/extract.mjs

class TreeParser {
  constructor(treeViewService) {
    this.treeViewService = treeViewService;
  }
  parse(enterSubModelNodes = false) {
    const head = this.treeViewService.nodes[0];
    let ret = [];
    const sdItem = {
      id: head.id,
      title: this.getNodeTitle(head, ""),
      depth: "",
      checked: true,
      depthAsNumber: 0,
      highlighted: false,
      selected: false,
      node: head,
      isOpen: true,
      isVisible: true
    };
    ret.push(sdItem);
    const enter = (node, depth, index, parent) => {
      depth = (depth == "" ? "" : depth + ".") + index;
      const item = {
        id: node.id,
        title: this.getNodeTitle(node, depth),
        depth: depth,
        checked: true,
        depthAsNumber: depth.split(".").length,
        highlighted: false,
        selected: false,
        node: node,
        isOpen: true,
        isVisible: true,
        parent: parent
      };
      ret.push(item);
      for (let i = 0; i < node.children.length; i++) {
        enter(node.children[i], depth, (i + 1).toString(), item);
      }
    };
    for (let i = 0; i < head.children.length; i++) {
      if (head.children[i].sharedOpdWithSubModelId && !head.children[i].subModelAlreadyLoaded && enterSubModelNodes === false) {
        continue;
      }
      enter(head.children[i], "", (i + 1).toString(), sdItem);
    }
    const requirementsViewNodes = this.treeViewService.getNodeById("Requirements");
    if (requirementsViewNodes) {
      for (let i = 0; i < requirementsViewNodes.children.length; i++) {
        enter(requirementsViewNodes.children[i], "", (i + 1).toString(), null);
      }
    }
    const stereotypesNode = this.treeViewService.getNodeById("Stereotypes");
    if (stereotypesNode) {
      for (let i = 0; i < stereotypesNode.children.length; i++) {
        enter(stereotypesNode.children[i], "", (i + 1).toString(), null);
      }
    }
    ret = ret.filter(item => item.title);
    return ret;
  }
  getNodeTitle(node, depth) {
    if (node.id === "SD") {
      return "SD";
    }
    const opd = this.treeViewService.initRappid.opmModel.getOpd(node.id);
    if (opd && opd.stereotypeOpd) {
      return node.name + " stereotype";
    } else if (opd && opd.stereotypeOpd || opd.requirementViewOf) {
      return node.name;
    }
    if (opd) {
      return "SD" + depth + ": " + opd.getName();
    }
    return undefined;
  }
}