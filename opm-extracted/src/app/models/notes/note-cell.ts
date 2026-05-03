// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/notes/note-cell.ts
// Extracted by opm-extracted/tools/extract.mjs


function createNoteView() {
  joint.shapes.notes.NoteView = joint.dia.ElementView.extend({
    template: `<div class="html-element"></div>`,
    initialize: function (node) {
      shared._.bindAll(this, "updateBox");
      joint.dia.ElementView.prototype.initialize.apply(this, arguments);
      this.$box = note_cell_$(shared._.template(this.template)());
      this.$box[0].id = `note_${node.model.cid}`;
      // Prevent paper from handling pointerdown.
      this.$box.find("input,select").on("mousedown click", function (evt) {
        evt.stopPropagation();
      });
      // Update the box position whenever the underlying model changes.
      this.model.on("change", this.updateBox, this);
      // Remove the box when the model gets removed from the graph.
      this.model.on("remove", this.removeBox, this);
      this.updateBox();
    },
    render: function () {
      joint.dia.ElementView.prototype.render.apply(this, arguments);
      this.paper.$el.prepend(this.$box);
      this.updateBox();
      return this;
    },
    updateBox: function () {
      // Set the position and dimension of the box so that it covers the JointJS element.
      const bbox = this.model.getBBox();
      this.$box.css({
        width: bbox.width,
        height: bbox.height,
        left: bbox.x,
        top: bbox.y,
        transform: "rotate(" + (this.model.get("angle") || 0) + "deg)"
      });
    },
    removeBox: function (evt) {
      this.$box.remove();
    }
  });
}
class NoteCell extends OpmEntityRappid {
  constructor(attributes) {
    super();
    this.hidden = false;
    this.set(this.noteAttributes());
    this.attr(this.noteAttrs());
    Object.assign(this.attributes, attributes);
    if (!joint.shapes.notes) {
      joint.shapes.notes = {};
      joint.shapes.notes.Note = this;
      createNoteView();
    }
  }
  noteAttributes() {
    return {
      markup: `<g class='rotatable'><g class='scalable'><rect/></g><text/></g>`,
      size: {
        width: 170,
        height: 150
      },
      type: "notes.Note"
    };
  }
  noteAttrs() {
    return {
      rect: {
        stroke: "none",
        "fill-opacity": 0,
        // magnet: true,
        width: 170,
        height: 150
      }
    };
  }
  getParams() {}
  addHandle(options) {}
  /** Tanya and Dorin: Connecting a cell and a note by dropping the latter over the cell
   * @param cellView - element of link view (in Rappid)
   * @param options - an array of items
   */
  pointerUpHandle(cellView, options) {
    super.pointerUpHandle(cellView, options);
    // Checking if there's an object/ process below the note to connect to.
    const elementsBelow = this.graph.findModelsUnderElement(this);
    // need to translate note position only if a link was drawn
    let needTranslate = false;
    for (let i = 0; i < elementsBelow.length; i++) {
      const intersection = elementsBelow[i].getBBox().intersect(this.getBBox());
      // 20% intersection between the note and the element
      const intersectionFactor = 0.2;
      if (intersection.width >= intersectionFactor * elementsBelow[i].get("size").width && intersection.height >= intersectionFactor * elementsBelow[i].get("size").height) {
        // Creation of a link connecting a note to a cell
        const noteLink = new OpmDefaultLink();
        // Updating the source-note and target-cell of the default link
        noteLink.set({
          target: {
            id: elementsBelow[i].get("id")
          }
        });
        noteLink.set({
          source: {
            id: this.get("id")
          }
        });
        // Add the new noteLink to the graph
        this.graph.addCell(noteLink);
        linkDrawing.deletePredefinedLinks(new Array(noteLink), options.graph, false, false);
        needTranslate = true;
      }
    }
    // Move the element a bit to the right side, for aesthetic reasons
    if (needTranslate) {
      cellView.model.translate(500, 0);
    }
  }
}