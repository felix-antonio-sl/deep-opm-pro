// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts
// Extracted by opm-extracted/tools/extract.mjs

const selectionConfiguration = {
  blankPointerdown(options, evt, x, y) {
    // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // Otherwise, initiate paper pan.
    if (options.keyboard.isActive("shift", evt)) {
      options.selection.startSelecting(evt);
    } else {
      options.selection.cancelSelection();
      options.paperScroller.startPanning(evt, x, y);
    }
    const elementsOnGraph = options.graph.getElements();
    for (let i = 0; i < elementsOnGraph.length; i++) {
      if (elementsOnGraph[i].attr("text/textWrap/text") === "") {
        elementsOnGraph[i].attr({
          text: {
            textWrap: {
              text: elementsOnGraph[i].attributes.textOnCreation
            }
          }
        });
      } else {
        elementsOnGraph[i].attr({
          text: {
            textWrap: {
              text: elementsOnGraph[i].attr("text/textWrap/text")
            }
          }
        });
      }
    }
  },
  cellPointerdown(options, cellView, evt) {
    // Select an element if CTRL/Meta key is pressed while the element is clicked.
    if (options.keyboard.isActive("ctrl meta", evt)) {
      options.selection.collection.add(cellView.model);
    }
  },
  selectionBoxPointerdown(options, cellView, evt) {
    // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
    if (options.keyboard.isActive("ctrl meta", evt)) {
      options.selection.collection.remove(cellView.model);
    }
    options.getOpmModel().logForUndo("selection movement");
    options.getOpmModel().setShouldLogForUndoRedo(false, "selection movement");
    const selected = options.selection.collection.models;
    selected.forEach(item => {
      const cellV = options.paper.findViewByModel(item.id);
      item.pointerDownHandle(cellV, options);
    });
    options.getOpmModel().setShouldLogForUndoRedo(true, "selection movement");
  },
  selectionBoxPointerup(options, cellView, evt) {
    const selected = options.selection.collection.models;
    selected.forEach(item => {
      const cellV = options.paper.findViewByModel(item.id);
      if (cellV) {
        item.pointerUpHandle(cellV, options);
      }
    });
  }
};