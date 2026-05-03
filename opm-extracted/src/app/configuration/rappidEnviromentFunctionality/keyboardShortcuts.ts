// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/rappidEnviromentFunctionality/keyboardShortcuts.ts
// Extracted by opm-extracted/tools/extract.mjs


function copy(init) {
  const copied = [];
  init.selection.collection.forEach(element => copied.push(init.opmModel.currentOpd.visualElements.find(v => v.id === element.id) || init.opmModel.currentOpd.notes.find(n => n?.id === element.id)));
  init.clipboard.copied = copied;
}
function pasteOnlyFormatting(init) {
  if (init.clipboard.copied === undefined || init.clipboard.copied === null || init.clipboard.copied.length === 0 || !OPCloudUtils.isInstanceOfVisualThing(init.clipboard.copied[0])) {
    return;
  }
  const thing = init.clipboard.copied[0];
  if (thing.children.find(ch => !OPCloudUtils.isInstanceOfVisualState(ch)) || thing.semiFolded.length > 0) {
    return;
  }
  init.opmModel.logForUndo("Paste Only Formatting");
  init.opmModel.setShouldLogForUndoRedo(false, "Paste Only Formatting");
  const thingType = thing.type;
  const params = thing.logicalElement.getParams();
  const visIndex = thing.logicalElement.visualElements.indexOf(thing);
  const visParams = thing.getParams();
  visParams.id = uuid();
  params.lid = uuid();
  params.visualElementsParams = params.visualElementsParams.splice(visIndex, 1);
  params.visualElementsParams[0].id = visParams.id;
  params.visualElementsParams[0].children = [];
  delete params.text;
  const cloned = logicalFactory(thingType.toLowerCase().includes("process") ? EntityType.Process : EntityType.Object, init.opmModel, params);
  init.opmModel.add(cloned);
  cloned.visualElements[0].id = visParams.id;
  const center = init.paper.clientToLocalPoint(init.mouseLocation);
  visParams.xPos = center.x + visParams.width / 2;
  visParams.yPos = center.y + visParams.height / 2;
  cloned.visualElements[0].setParams(visParams);
  init.opmModel.currentOpd.add(cloned.visualElements[0]);
  if (thingType.toLowerCase().includes("object")) {
    const obj = cloned.visualElements[0];
    const numberOfStates = thing.states.length;
    if (numberOfStates === 1 && !obj.isComputational()) {
      obj.addState();
      obj.states[0].removeAction();
    } else {
      for (let i = 0; i < numberOfStates; i++) {
        if (obj.states.length < thing.states.length) {
          obj.addState();
        }
      }
    }
    for (let i = 0; i < obj.states.length; i++) {
      const stateParams = thing.states[obj.states.length - i - 1].getParams();
      stateParams.id = obj.states[i].id;
      const relativeX = stateParams.xPos - thing.xPos;
      const relativeY = stateParams.yPos - thing.yPos;
      stateParams.xPos = relativeX + obj.xPos;
      stateParams.yPos = relativeY + obj.yPos;
      obj.states[i].setParams(stateParams);
    }
    // if (!obj.isComputational()) {
    //   obj.rearrange(thing.statesArrangement);
    // }
  }
  init.graphService.renderGraph(init.opmModel.currentOpd, init, null, false, true);
  // if (cloned.visualElements[0].isComputational()) {
  //   init.graph.getCell(cloned.visualElements[0].id)?.shiftEmbeddedToEdge(init);
  // }
  init.graph.getCell(cloned.visualElements[0].id)?.set("size", {
    width: thing.width,
    height: thing.height
  });
  init.opmModel.setShouldLogForUndoRedo(true, "Paste Only Formatting");
  init.criticalChanges_.next();
}
function paste(options) {
  if (options.clipboard.copied === undefined || options.clipboard.copied === null) {
    return;
  }
  const center = options.paper.clientToLocalPoint(options.mouseLocation);
  const predicate = function (v, l) {
    if (v.logicalElement === l) {
      return true;
    }
    if (v instanceof OpmVisualThing && v.children.find(c => c.logicalElement === l) !== undefined) {
      return true;
    }
    return false;
  };
  const opd = options.opmModel.currentOpd;
  const visuals = options.clipboard.copied.filter(v => !!v && options.opmModel.getLogicalElementByLid(v.logicalElement?.lid));
  const notes = options.clipboard.copied.filter(n => n?.content);
  if (visuals.length > 0 || notes.length > 0) {
    options.opmModel.logForUndo("Paste");
    options.opmModel.setShouldLogForUndoRedo(false, "Paste");
  }
  const copiedThings = []; // All already copied visuals.
  let thingsCenter = {
    x: 0,
    y: 0
  };
  let counter = 0;
  for (let i = 0; i < visuals.length; i++) {
    const visual = visuals[i];
    if (!options.opmModel.logicalElements.find(log => visual.logicalElement === log)) {
      continue;
    }
    if (!options.opmModel.canBeDuplicated(visual.logicalElement)) {
      (0, validationAlert)("Can not duplicate inner process of another process at the same OPD");
      continue;
    }
    if (visual instanceof OpmVisualThing) {
      const copied = copiedThings.find(t => predicate(t, visual.logicalElement));
      if (copied === undefined) {
        const newCopy = visual.copyToOpd(opd);
        copiedThings.push(newCopy);
        thingsCenter.x += visual.xPos + visual.width / 2;
        thingsCenter.y = visual.yPos + visual.height / 2;
        counter++;
      }
    } else if (visual instanceof OpmLink) {
      const link = visual;
      const relation = link.logicalElement;
      let source = copiedThings.find(t => predicate(t, relation.sourceLogicalElement));
      if (source === undefined) {
        if (link.sourceVisualElement instanceof OpmVisualState && link.sourceVisualElement.fatherObject) {
          copiedThings.push(source = link.sourceVisualElement.fatherObject.copyToOpd(opd));
        } else {
          copiedThings.push(source = link.sourceVisualElement.copyToOpd(opd));
        }
      }
      if (link.sourceVisualElement instanceof OpmVisualState) {
        source = source.children.find(c => c.logicalElement === relation.sourceLogicalElement);
      }
      let target = copiedThings.find(t => predicate(t, relation.targetLogicalElements[0]));
      if (target === undefined) {
        if (link.targetVisualElements[0].targetVisualElement instanceof OpmVisualState && link.targetVisualElements[0].targetVisualElement.fatherObject) {
          copiedThings.push(target = link.targetVisualElements[0].targetVisualElement.fatherObject.copyToOpd(opd));
        } else {
          copiedThings.push(target = link.targetVisualElements[0].targetVisualElement.copyToOpd(opd));
        }
      }
      if (link.targetVisualElements[0].targetVisualElement instanceof OpmVisualState) {
        target = target.children.find(c => c.logicalElement === relation.targetLogicalElements[0]);
      }
      link.copyToOpd(opd, source, target);
    }
  }
  const diff = {
    x: center.x - thingsCenter.x / counter,
    y: center.y - thingsCenter.y / counter
  };
  for (const vis of copiedThings) {
    const drawnElement = createDrawnEntity(vis.logicalElement.name);
    vis.xPos += diff.x;
    vis.yPos += diff.y;
    drawnElement.updateParamsFromOpmModel(vis);
    vis.setParams(drawnElement.getParams());
    options.graph.addCell(drawnElement);
    if (vis.type.includes("Object") && vis.states) {
      drawnElement.expressAllAction(vis, options, true);
      drawnElement.syncStatesOrder(options, true, vis.logicalElement.visualElements[0].states.map(s => s.logicalElement.lid));
    }
    drawnElement.autosize(options);
    if (drawnElement instanceof OpmThing) {
      drawnElement.drawDuplicationMarkToAllDuplicatesInSameOPD(options);
    }
  }
  for (const note of notes) {
    const noteCopy = JSON.parse(JSON.stringify(note));
    noteCopy.xPos = noteCopy.xPos + 20;
    noteCopy.yPos = noteCopy.yPos + 20;
    const drawnElement = new Note();
    noteCopy.id = drawnElement.id; // assigning new id, so it won't be the same as the original one.
    drawnElement.updateParamsFromOpmModel(noteCopy);
    options.graph.addCell(drawnElement);
    drawnElement.pointerUpHandle(options.paper.findViewByModel(drawnElement), options);
    $(".joint-popup").remove();
  }
  options.opmModel.setShouldLogForUndoRedo(true, "Paste");
}
function moveDuplicationMark(initRappid, selected, direction) {
  if (selected && selected.attributes && selected.attributes.type === "opm.Process") {
    const dupMark = selected.get("duplicationMark");
    if (!dupMark) {
      return;
    }
    switch (direction) {
      case "left":
        {
          dupMark.translate(-1, 0);
          break;
        }
      case "right":
        {
          dupMark.translate(1, 0);
          break;
        }
      case "up":
        {
          dupMark.translate(0, -1);
          break;
        }
      case "down":
        {
          dupMark.translate(0, 1);
          break;
        }
    }
  }
}
/**
 * Alon: When moving an element with the arroow keys, move its embedded as well
 * @param {Array} children
 * @param {string} direction
 */
function updateEmbeddedPosition(children, direction) {
  for (let child of children) {
    switch (direction) {
      case "left":
        {
          child.set({
            position: {
              x: child.get("position").x - 1,
              y: child.get("position").y
            }
          });
          break;
        }
      case "right":
        {
          child.set({
            position: {
              x: child.get("position").x + 1,
              y: child.get("position").y
            }
          });
          break;
        }
      case "up":
        {
          child.set({
            position: {
              x: child.get("position").x,
              y: child.get("position").y - 1
            }
          });
          break;
        }
      case "down":
        {
          child.set({
            position: {
              x: child.get("position").x,
              y: child.get("position").y + 1
            }
          });
          break;
        }
    }
  }
}
function findThing(thingArr, init) {
  for (let thing of thingArr) {
    if (thing.id === init.selectedElement.id) {
      changeHaloTarget(thingArr, init, thingArr.indexOf(thing));
      break;
    }
  }
}
function changeHaloTarget(thingArr, init, counter) {
  let cellViewIndex = thingArr.length != counter + 1 ? counter + 1 : 0;
  let cellView = init.paper.findViewByModel(thingArr[cellViewIndex]);
  if (OPCloudUtils.isInstanceOfDrawnEntity(thingArr[cellViewIndex])) {
    init.setSelectedElement(thingArr[cellViewIndex]);
  }
  joint.ui.Halo.clear(init.paper);
  thingArr[cellViewIndex].pointerUpHandle(cellView, init);
}
//   const opd = options.opmModel.currentOpd;
//   const visuals = options.clipboard.copied;
//   const copiedThings: Array<OpmVisualEntity> = []; // All already copied visuals.
//   for (let i = 0; i < visuals.length; i++) {
//     const visual = visuals[i];
//     if (visual instanceof OpmVisualThing) {
//       const copied = copiedThings.find(t => predicate(t, visual.logicalElement));
//       if (copied === undefined) {
//         copiedThings.push(visual.copyToOpd(opd));
//       }
//     } else if (visual instanceof OpmLink) {
//       const link = <OpmLink>visual;
//       const relation = <OpmRelation<any>>link.logicalElement;
//       let source = copiedThings.find(t => predicate(t, relation.sourceLogicalElement));
//       if (source === undefined) {
//         if (link.sourceVisualElement instanceof OpmVisualState && (link.sourceVisualElement.fatherObject))
//           copiedThings.push(source = link.sourceVisualElement.fatherObject.copyToOpd(opd));
//         else
//           copiedThings.push(source = (<OpmVisualThing>link.sourceVisualElement).copyToOpd(opd));
//       }
//       if (link.sourceVisualElement instanceof OpmVisualState)
//         source = (<OpmVisualThing>source).children.find(c => c.logicalElement === relation.sourceLogicalElement);
//
//       let target = copiedThings.find(t => predicate(t, relation.targetLogicalElements[0]));
//       if (target === undefined) {
//         if (link.targetVisualElements[0].targetVisualElement instanceof OpmVisualState && (<OpmVisualState>link.targetVisualElements[0].targetVisualElement).fatherObject)
//           copiedThings.push(target = (<OpmVisualThing>(<OpmVisualState>link.targetVisualElements[0].targetVisualElement).fatherObject).copyToOpd(opd));
//         else
//           copiedThings.push(target = (<OpmVisualThing>link.targetVisualElements[0].targetVisualElement).copyToOpd(opd));
//       }
//       if (link.targetVisualElements[0].targetVisualElement instanceof OpmVisualState)
//         target = (<OpmVisualThing>target).children.find(c => c.logicalElement === relation.targetLogicalElements[0]);
//
//       link.copyToOpd(opd, source, target);
//     }
//   }
//   options.getGraphService().renderGraph(opd);
// }
//       link.copyToOpd(opd, source, target);
//     }
//   }
//   options.getGraphService().renderGraph(opd);
// }
function canOperationBeDone() {
  return !$("mat-mdc-dialog-container").length;
}
// Options - init-rappid service
function defineKeyboardShortcuts(options) {
  options.keyboard = new joint.ui.Keyboard();
  options.keyboard.on({
    "ctrl+c": function () {
      if (canOperationBeDone()) {
        copy(options);
      }
    },
    "command+c": function () {
      if (navigator?.platform?.includes("Mac") && canOperationBeDone()) {
        copy(options);
      }
    },
    "ctrl+v": function () {
      if (canOperationBeDone()) {
        paste(options);
      }
    },
    "command+v": function () {
      if (navigator?.platform?.includes("Mac") && canOperationBeDone()) {
        paste(options);
      }
    },
    /**
     * By clicking Ctrl+Shift+C, the dialog of class 'StyleCopyingDialogComponent' will pop up.
     * @param $event
     */
    "ctrl+shift+c": function ($event) {
      if (canOperationBeDone() && options.selectedElement) {
        $event.preventDefault();
        $event.stopPropagation();
        $event.stopImmediatePropagation();
        options.elementToolbarReference.openPasteOptionsDialog();
      }
    },
    "ctrl+shift+v": function ($event) {
      if (canOperationBeDone()) {
        $event.preventDefault();
        $event.stopPropagation();
        $event.stopImmediatePropagation();
        pasteOnlyFormatting(options);
      }
    },
    //  const elements = _.filter(pastedCells, function (cell) {
    //    return cell.isElement();
    //  });
    //   // Make sure pasted elements get selected immediately. options makes the UX better as
    //   // the user can immediately manipulate the pasted elements.
    //   options.selection.collection.reset(elements);
    // },
    // 'ctrl+x shift+delete': function () {
    //   options.clipboard.cutElements(options.selection.collection, options.graph);
    // },
    // 'delete backspace': function (evt) {
    //   evt.preventDefault();
    //   options.graph.removeCells(options.selection.collection.toArray());
    // },
    "ctrl+s": function (e) {
      e.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (options.modelService.modelObject?.modelData?.dirsPath?.find(d => d.id === "ORGEXAMPLES")) {
        (0, validationAlert)("To prevent overriding examples by mistake, this shortcut is disabled. Please use the menu saving option.", 3500, "Error");
      } else {
        options.save();
      }
    },
    "ctrl+z": function () {
      if (canOperationBeDone()) {
        (0, undoShared)();
      }
    },
    "ctrl+up": function () {
      if (canOperationBeDone()) {
        $("#opdsUpKey")[0]?.click();
      }
    },
    "ctrl+right": function () {
      if (canOperationBeDone()) {
        $("#opdsRightKey")[0]?.click();
      }
    },
    "ctrl+down": function () {
      if (canOperationBeDone()) {
        $("#opdsDownKey")[0]?.click();
      }
    },
    "ctrl+left": function () {
      if (canOperationBeDone()) {
        $("#opdsLeftKey")[0]?.click();
      }
    },
    "ctrl+backspace": function () {
      if (canOperationBeDone()) {
        $("#opdsBackKey")[0]?.click();
      }
    },
    "ctrl+y": function () {
      if (canOperationBeDone()) {
        (0, redoshared)();
      }
    },
    "ctrl+t": function () {
      options.opdHierarchyRef.openTreeManagementDialog();
    },
    // 'ctrl+a': function () {
    //   options.selection.collection.reset(options.graph.getElements());
    // },
    // 'ctrl+plus': function (evt) {
    //   evt.preventDefault();
    //   options.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
    // },
    // 'ctrl+minus': function (evt) {
    //   evt.preventDefault();
    //   options.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
    // },
    // 'keydown:shift': function (evt) {
    //   options.paperScroller.setCursor('crosshair');
    // },
    // 'keyup:shift': function () {
    //   options.paperScroller.setCursor('grab');
    // },
    "keydown:delete": function () {
      new DeleteAction(options).act();
    },
    "keydown:left": function (event) {
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selection.collection.models.length) {
        event.preventDefault();
        options.selection.collection.models.filter(m => !options.selection.collection.models.includes(m.getParentCell())).forEach(m => {
          m.translate(-2, 0);
          if (OPCloudUtils.isInstanceOfDrawnEntity(m)) {
            Arc.redrawAllArcs(m, options, true);
          }
        });
        return;
      }
      moveDuplicationMark(options, options.selectedElement, "left");
      if (options.selectedElement && options.selectedElement.attributes.type !== "opm.Link") {
        options.selectedElement.set({
          position: {
            x: options.selectedElement.get("position").x - 1,
            y: options.selectedElement.get("position").y
          }
        });
        if (options.selectedElement.getEmbeddedCells().length !== 0) {
          updateEmbeddedPosition(options.selectedElement.getEmbeddedCells(), "left");
        }
        options.paperScroller.lock();
        Arc.redrawAllArcs(options.selectedElement, options, true);
      }
    },
    "keyup:left": function () {
      if (canOperationBeDone()) {
        options.paperScroller.unlock();
      }
    },
    "keydown:right": function (event) {
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selection.collection.models.length) {
        event.preventDefault();
        options.selection.collection.models.filter(m => !options.selection.collection.models.includes(m.getParentCell())).forEach(m => {
          m.translate(2, 0);
          if (OPCloudUtils.isInstanceOfDrawnEntity(m)) {
            Arc.redrawAllArcs(m, options, true);
          }
        });
        return;
      }
      moveDuplicationMark(options, options.selectedElement, "right");
      if (options.selectedElement && options.selectedElement.attributes.type !== "opm.Link") {
        options.selectedElement.set({
          position: {
            x: options.selectedElement.get("position").x + 1,
            y: options.selectedElement.get("position").y
          }
        });
        if (options.selectedElement.getEmbeddedCells().length !== 0) {
          updateEmbeddedPosition(options.selectedElement.getEmbeddedCells(), "right");
        }
        options.paperScroller.lock();
        Arc.redrawAllArcs(options.selectedElement, options, true);
      }
    },
    "keyup:right": function () {
      if (canOperationBeDone()) {
        options.paperScroller.unlock();
      }
    },
    "keydown:up": function (event) {
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selection.collection.models.length) {
        event.preventDefault();
        options.selection.collection.models.filter(m => !options.selection.collection.models.includes(m.getParentCell())).forEach(m => {
          m.translate(0, -2);
          if (OPCloudUtils.isInstanceOfDrawnEntity(m)) {
            Arc.redrawAllArcs(m, options, true);
          }
        });
        return;
      }
      moveDuplicationMark(options, options.selectedElement, "up");
      if (options.selectedElement && options.selectedElement.attributes.type !== "opm.Link") {
        options.selectedElement.set({
          position: {
            x: options.selectedElement.get("position").x,
            y: options.selectedElement.get("position").y - 1
          }
        });
        if (options.selectedElement.getEmbeddedCells().length !== 0) {
          updateEmbeddedPosition(options.selectedElement.getEmbeddedCells(), "up");
        }
        options.paperScroller.lock();
        Arc.redrawAllArcs(options.selectedElement, options, true);
      }
    },
    "keyup:up": function () {
      if (!canOperationBeDone()) {
        return;
      }
      options.paperScroller.unlock();
    },
    "keydown:down": function (event) {
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selection.collection.models.length) {
        event.preventDefault();
        options.selection.collection.models.filter(m => !options.selection.collection.models.includes(m.getParentCell())).forEach(m => {
          m.translate(0, 2);
          if (OPCloudUtils.isInstanceOfDrawnEntity(m)) {
            Arc.redrawAllArcs(m, options, true);
          }
        });
        return;
      }
      moveDuplicationMark(options, options.selectedElement, "down");
      if (options.selectedElement && options.selectedElement.attributes.type !== "opm.Link") {
        options.selectedElement.set({
          position: {
            x: options.selectedElement.get("position").x,
            y: options.selectedElement.get("position").y + 1
          }
        });
        if (options.selectedElement.getEmbeddedCells().length !== 0) {
          updateEmbeddedPosition(options.selectedElement.getEmbeddedCells(), "down");
        }
        options.paperScroller.lock();
        Arc.redrawAllArcs(options.selectedElement, options, true);
      }
    },
    "keyup:down": function () {
      if (canOperationBeDone()) {
        options.paperScroller.unlock();
      }
    },
    // Shortcut used to search for elements in the model
    "ctrl+f": function (evt) {
      // prevent the default browser search window to open when using the shortcut.
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (document.getElementsByClassName("settings_menu_header").length !== 0) {
        return;
      }
      const data = {
        message: "Warning: Not a valid search!",
        closeFlag: true
      };
      options.dialogService.openDialog(SearchItemsDialogComponent, 500, 600, data);
    },
    // select all elements
    "keyup:ctrl+a": function () {
      if (!canOperationBeDone()) {
        return;
      }
      if (!options.getOpmModel().currentOpd.isStereotypeOpd()) {
        options.selection.collection.reset(options.graph.getCells());
      }
    },
    tab: function (evt) {
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      let thingArr = options.getGraphService().graph.attributes.cells.models;
      if (options.selectedElement) {
        findThing(thingArr, options);
      }
    },
    "shift+i": function (evt) {
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selectedElement instanceof OpmThing) {
        options.selectedElement.inzoomAction(options);
      }
    },
    "shift+u": function (evt) {
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selectedElement instanceof OpmThing) {
        options.selectedElement.unfoldAction(options);
      }
    },
    "ctrl+shift+i": function (evt) {
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selectedElement instanceof OpmThing) {
        options.selectedElement.inzoomAction(options, true);
      }
    },
    "ctrl+shift+u": function (evt) {
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selectedElement instanceof OpmThing) {
        options.selectedElement.unfoldAction(options, true);
      }
    },
    "shift+a": function (evt) {
      evt.preventDefault();
      if (!canOperationBeDone()) {
        return;
      }
      if (options.selectedElement instanceof OpmObject && options.selectedElement.attr("value/value") === "None") {
        // (<OpmObject> (options.selectedElement)).closeTextEditor(options);
        options.selectedElement.addStateAction(options.opmModel.getVisualElementById(options.selectedElement.id), options);
      }
    }
  }, options);
}