// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/node.model.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Created by sameh14 on 5/26/2017.
 */
class Node {
  constructor(node) {
    this.id = "";
    this.name = "";
    this.className = "root-class";
    this.expanded = true;
    this.isHidden = false;
    this.hasChildren = false;
    this.hasParent = false;
    this.children = [];
    this.type = "";
    this.subTitle = "";
    this.id = node.id;
    this.name = node.name || "";
    this.className = node.className || "";
    this.expanded = node.expanded || false;
    this.isHidden = node.isHidden || false;
    this.hasParent = node.hasParent || false;
    this.parent = node.parent || "SD";
    this.hasChildren = node.hasChildren || false;
    this.children = node.children || [];
    this.graph = node.graph || "";
    this.type = node.type || "";
    this.subTitle = node.subTitle || "";
    this.initRappid = node.initRappid;
    this.sharedOpdWithSubModelId = node.sharedOpdWithSubModelId;
    this.belongsToSubModel = node.belongsToSubModel;
    this.subModelAlreadyLoaded = node.subModelAlreadyLoaded;
    this.subModelEditDate = node.subModelEditDate;
  }
  addChildren(children) {
    this.children.push(children);
  }
}
