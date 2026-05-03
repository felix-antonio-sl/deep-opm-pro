// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/OpmOpd.ts
// Extracted by opm-extracted/tools/extract.mjs


class OpmOpd {
  constructor(name) {
    this.shape = null;
    this.stereotypeOpd = false;
    this.requirementsOpd = false;
    this.isHidden = false;
    this.isFlatteningOpd = false;
    this.isRangesOpd = false;
    this.isViewOpd = false;
    this.visualElements = new Array();
    this.children = new Array();
    this.notes = new Array();
    this.noteLinks = new Array();
    this.name = name;
    this.stencil = true;
    this.id = name === "SD" ? "SD" : uuid();
    if (this.id === "SD") {
      this.parendId = "SD";
    }
  }
  add(visualElement) {
    // TODO: Eliminate this if
    if (!this.visualElements.includes(visualElement)) {
      this.visualElements.push(visualElement);
    }
  }
  addElements(visualElements) {
    for (let i = 0; i < visualElements.length; i++) {
      this.add(visualElements[i]);
    }
  }
  SetParent(parentId) {
    this.parendId = parentId;
  }
  setHidden() {
    this.isHidden = true;
  }
  setVisible() {
    this.isHidden = false;
  }
  removeByIndex(opmVisualElementIndex) {
    this.visualElements.splice(opmVisualElementIndex, 1);
  }
  isStereotypeOpd() {
    return this.stereotypeOpd;
  }
  isRequirementsOpd() {
    return this.requirementsOpd;
  }
  setAsStereotypeOpd() {
    this.stereotypeOpd = true;
  }
  setAsRequirementsOpd() {
    this.requirementsOpd = true;
  }
  remove(opmVisualElementId) {
    for (let i = this.visualElements.length - 1; i >= 0; i--) {
      if (this.visualElements[i].id === opmVisualElementId) {
        this.visualElements.splice(i, 1);
        break;
      }
    }
  }
  removeVisual(visual) {
    for (let i = this.visualElements.length - 1; i >= 0; i--) {
      if (this.visualElements[i] === visual) {
        this.visualElements.splice(i, 1);
        break;
      }
    }
  }
  removeNote(noteId) {
    for (let i = this.notes.length - 1; i >= 0; i--) {
      if (this.notes[i].id === noteId) {
        this.notes.splice(i, 1);
        break;
      }
    }
  }
  // removing note link from the array
  removeNoteLink(linkId) {
    for (let i = this.noteLinks.length - 1; i >= 0; i--) {
      if (this.noteLinks[i].id === linkId) {
        this.noteLinks.splice(i, 1);
        break;
      }
    }
  }
  removeAll() {
    for (let i = 0; i < this.visualElements.length; i++) {
      this.remove(this.visualElements[i]);
    }
  }
  createOpdFromJson(jsonOpd, opmModel) {
    if (jsonOpd.notes) {
      for (let i = 0; i < jsonOpd.notes.length; i++) {
        this.addNote(jsonOpd.notes[i], i);
      }
    }
    if (jsonOpd.noteLinks) {
      for (let i = 0; i < jsonOpd.noteLinks.length; i++) {
        this.addNoteLink(jsonOpd.noteLinks[i]);
      }
    }
    if (jsonOpd.isHidden) {
      this.isHidden = jsonOpd.isHidden;
    }
    if (jsonOpd.isRangesOpd) {
      this.isRangesOpd = jsonOpd.isRangesOpd;
    }
    if (jsonOpd.isViewOpd) {
      this.isViewOpd = jsonOpd.isViewOpd;
    }
    if (jsonOpd.requirementsOpd) {
      this.requirementsOpd = jsonOpd.requirementsOpd;
    }
    if (jsonOpd.requirementViewOf) {
      this.requirementViewOf = jsonOpd.requirementViewOf;
    }
    if (jsonOpd.sharedOpdWithSubModelId) {
      this.sharedOpdWithSubModelId = jsonOpd.sharedOpdWithSubModelId;
    }
    if (jsonOpd.belongsToSubModel) {
      this.belongsToSubModel = jsonOpd.belongsToSubModel;
    }
    if (jsonOpd.subModelEditDate) {
      this.subModelEditDate = jsonOpd.subModelEditDate;
    }
  }
  getThingLinks(thingID) {
    const thingLinks = this.visualElements.filter(elm => elm instanceof OpmLink && elm.visible !== false && (elm.sourceVisualElement.id === thingID || elm.targetVisualElements[0].targetVisualElement.id === thingID));
    return thingLinks;
  }
  getThingProceduralLinks(thingID) {
    const thingLinks = this.visualElements.filter(elm => elm instanceof OpmProceduralLink && (elm.sourceVisualElement.id === thingID || elm.targetVisualElements[0].targetVisualElement.id === thingID));
    return thingLinks;
  }
  getThingStructuralLinks(thingID) {
    const thingLinks = this.visualElements.filter(elm => elm instanceof OpmStructuralLink && (elm.sourceVisualElement.id === thingID || elm.targetVisualElements[0].targetVisualElement.id === thingID));
    return thingLinks;
  }
  addNote(note, index) {
    // support for old notes without 2 text boxes.
    if (note.text) {
      note.title = "Note " + (index + 1) + " title";
      note.content = note.text;
      delete note.text;
      if (note.fill === "#FFFC7F") {
        note.fill = "#fff7d1";
      }
    }
    this.notes.push(note);
  }
  addNoteLink(linkParams) {
    this.noteLinks.push(linkParams);
  }
  updateNote(noteData, noteCell) {
    const noteUpdate = this.notes.filter(note => note.id === noteCell.cid)[0];
    const attributes = {
      size: noteCell.get("size"),
      position: noteCell.get("position"),
      id: noteCell.cid
    };
    if (noteUpdate && noteCell && noteData) {
      noteUpdate.size = noteCell.get("size");
      noteUpdate.position = noteCell.get("position");
      noteUpdate._content = noteData._content;
      noteUpdate._modifiedBy = noteData.modifiedBy;
      noteUpdate._modifiedDate = noteData.modifiedDate;
      noteUpdate._type = noteData.type;
    }
  }
  findRoot() {
    let j;
    for (let k = 0; k < this.visualElements.length; k++) {
      if (this.visualElements[k] instanceof OpmLink) {
        let link = this.visualElements[k];
        for (j = 0; j < this.visualElements.length; j++) {
          if (this.visualElements[j] instanceof OpmLink) {
            let linkk = this.visualElements[j];
            if (link.sourceVisualElement.id == linkk.targetVisualElements[0].targetVisualElement.id) {
              break;
            }
          }
        }
        if (j === this.visualElements.length) {
          return link.sourceVisualElement;
        }
      }
    }
    for (let k = 0; k < this.visualElements.length; k++) {
      if (this.visualElements[k] instanceof OpmVisualThing) {
        return this.visualElements[k];
      }
    }
  }
  getOutboundThings(thing) {
    let outboundThings = [];
    for (let k = 0; k < this.visualElements.length; k++) {
      if (this.visualElements[k] instanceof OpmLink) {
        let link = this.visualElements[k];
        if (link.sourceVisualElement.id === thing.id) {
          outboundThings.push(link.targetVisualElements[0].targetVisualElement);
        }
      }
    }
    return outboundThings;
  }
  layoutHierarchically() {
    const root = this.findRoot();
    root.xPos = 450;
    root.yPos = 100;
    root.width = 135;
    root.height = 60;
    let queue = [];
    const isOrdered = vis => vis.getRefineeInzoom() && vis.getRefineeUnfold();
    let nextLevelThings = this.getOutboundThings(root);
    nextLevelThings.forEach(child => queue.push({
      thing: child,
      level: 1
    }));
    let x = 450;
    let y = 10;
    let lastThing = root;
    let idx = 0;
    while (queue.length > 0) {
      let current = queue.shift();
      let nextLevelThings = this.getOutboundThings(current.thing);
      if (nextLevelThings.length != 0) {
        nextLevelThings.map(child => queue.push({
          thing: child,
          level: current.level + 1
        }));
      }
      if (lastThing.level !== current.level) {
        lastThing = current;
        if (current.level === 1 && isOrdered(root)) {
          x = root.xPos - 170;
          y = root.yPos + 200 + idx * 80;
          idx++;
        } else {
          x = 20;
          y = y + lastThing.thing.height + 200;
        }
      } else if (current.level === 1 && isOrdered(root)) {
        x = root.xPos - 170;
        y = root.yPos + 200 + idx * 80;
        idx++;
      } else {
        x += lastThing.thing.width + 20;
      }
      current.thing.setPos(x, y);
    }
    if (isOrdered(root)) {
      root.getLinks().outGoing.filter(l => l.type === linkType.Aggregation).forEach(link => link.setSymbolPos(link.source.xPos + 45, link.source.yPos + 170));
    }
  }
  isEmpty() {
    return this.visualElements.length === 0;
  }
  disconnectRefineables() {
    for (let k = 0; k < this.visualElements.length; k++) {
      if (this.visualElements[k].disconnectRefinable) {
        this.visualElements[k].disconnectRefinable();
      }
    }
  }
  getInzoomedThing() {
    for (let k = 0; k < this.visualElements.length; k++) {
      const refineable = this.visualElements[k].refineable;
      if (refineable && refineable.refineeInzooming === this.visualElements[k] && refineable !== refineable.refineeInzooming) {
        return this.visualElements[k];
      }
    }
    const possible = this.visualElements.filter(v => {
      const refineable = v.refineable;
      if (refineable && refineable.refineeInzooming === v) {
        return true;
      }
      return false;
    });
    if (possible.length === 1) {
      return possible[0];
    }
    return null;
  }
  getUnfoldedThing() {
    for (let k = 0; k < this.visualElements.length; k++) {
      const refineable = this.visualElements[k].refineable;
      if (refineable && refineable.refineeUnfolding === this.visualElements[k] && refineable !== refineable.refineeUnfolding) {
        return this.visualElements[k];
      }
    }
    const possible = this.visualElements.filter(v => {
      const refineable = v.refineable;
      if (refineable && refineable.refineeUnfolding === v) {
        return true;
      }
      return false;
    });
    if (possible.length === 1) {
      return possible[0];
    }
    return null;
  }
  getDisplayFullName() {
    return this.getNumberedName() + (this.getNumberedName() === "SD" ? "" : ": " + this.getName());
  }
  getName() {
    const readOnly = !!this.sharedOpdWithSubModelId || !!this.belongsToSubModel;
    if (this.name === "SD") {
      return this.name;
    }
    if (this.sharedOpdWithSubModelId) {
      return this.name + " Subsystem Model View";
    }
    let thing = this.getInzoomedThing();
    if (thing != null) {
      return thing.logicalElement.getBareName() + " in-zoomed" + (readOnly ? " (read only)" : "");
    }
    thing = this.getUnfoldedThing();
    if (thing != null) {
      let addition = "";
      const logical = thing.logicalElement;
      if (logical.isSatisfiedRequirementObject()) {
        const owner = logical.opmModel.getOwnerOfRequirementByRequirementLID(logical.lid);
        addition += " of " + owner.text;
      }
      return thing.logicalElement.getBareName() + addition + " unfolded" + (readOnly ? " (read only)" : "");
    }
    return this.name + (readOnly ? " (read only)" : "");
  }
  getDefaultName() {
    let firstProcessName = "opmModelOpl";
    for (let i = 0; i < this.visualElements.length; i++) {
      if (this.visualElements[i] instanceof OpmVisualProcess) {
        firstProcessName = this.visualElements[i].logicalElement.text;
        firstProcessName = firstProcessName + " System";
        return firstProcessName;
      }
    }
    return firstProcessName;
  }
  beautify(root, padding = 40) {
    const m_const = root.height / root.width;
    const between = function (a, b, c) {
      return a <= b && b <= c;
    };
    const intersect = function (aX, aY, bX, bY) {
      return (between(aX[0], bX[0], aX[1]) || between(aX[0], bX[1], aX[1])) && (between(aY[0], bY[0], aY[1]) || between(aY[0], bY[1], aY[1]));
    };
    const moveChildren = function (thing, xMove, yMove) {
      for (let i = 0; i < thing.children.length; i++) {
        thing.children[i].xPos += xMove;
        thing.children[i].yPos += yMove;
      }
    };
    let things = [];
    for (let i = 0; i < this.visualElements.length; i++) {
      if (this.visualElements[i].fatherObject) {
        things.push(this.visualElements[i].fatherObject);
      } else {
        things.push(this.visualElements[i]);
      }
    }
    const toMove = [root];
    while (toMove[0]) {
      const current = toMove[0];
      things = things.filter(t => t !== current);
      const currentX = [current.xPos, current.xPos + current.width];
      const currentY = [current.yPos, current.yPos + current.height];
      for (let i = 0; i < things.length; i++) {
        const thisThing = things[i];
        const thisX = [thisThing.xPos, thisThing.xPos + thisThing.width];
        const thisY = [thisThing.yPos, thisThing.yPos + thisThing.height];
        if (intersect(currentX, currentY, thisX, thisY) === false) {
          continue;
        }
        /*const diff = Math.abs(currentX[1] - thisX[0]) + padding;
        thisThing.xPos += diff;*/
        // move ThisThing
        let xOff = thisX[0] + thisThing.width / 2 - (root.xPos + root.width / 2);
        if (xOff === 0) {
          xOff = 1;
        }
        const yOff = thisY[0] + thisThing.height / 2 - (root.yPos + root.height / 2);
        const m = yOff / xOff;
        let diff;
        if (Math.abs(m) < m_const) {
          diff = Math.abs(currentX[1] - thisX[0]) + padding; // Move right
          if (xOff < 0) {
            // Move left
            diff = (Math.abs(currentX[0] - thisX[1]) + padding) * -1;
          }
          thisThing.xPos += diff;
          thisThing.yPos += m * diff;
          moveChildren(thisThing, diff, m * diff);
        } else {
          diff = Math.abs(currentY[1] - thisY[0]) + padding; // Move Down
          if (yOff < 0) {
            // Move Up
            diff = (Math.abs(currentY[0] - thisY[1]) + padding) * -1;
          }
          thisThing.xPos += diff / m;
          thisThing.yPos += diff;
          moveChildren(thisThing, diff / m, diff);
        }
        if (toMove.findIndex(t => t === thisThing) === -1) {
          toMove.push(thisThing);
        }
      }
      toMove.shift();
    }
  }
  getVisualElementByLogical(logicalElement) {
    // TODO: needs to be changed to filter - cuz we can have few visuals with same logical at the same opd.
    return this.visualElements.find(v => v.logicalElement === logicalElement);
  }
  getOpdDepth() {
    let counter = 0;
    let currentOpd = this;
    if (this.isHidden || this.isStereotypeOpd() || this.isRequirementsOpd()) {
      return 0;
    }
    const model = this.visualElements[0].logicalElement.opmModel;
    while (currentOpd.getName() !== "SD") {
      counter += 1;
      currentOpd = model.getOpd(currentOpd.parendId);
    }
    return counter;
  }
  getNumberedName() {
    const init = (0, getInitRappidShared)();
    if (init.getTreeView() && init.getTreeView().getNodeById(this.id)) {
      return init.getTreeView().getNodeById(this.id).name + init.getTreeView().getNodeById(this.id).subTitle;
    } else {
      return this.getName();
    }
  }
  setAsViewOpd() {
    this.isViewOpd = true;
  }
  hasVisual(visual) {
    return !!this.visualElements.find(v => v == visual);
  }
}
