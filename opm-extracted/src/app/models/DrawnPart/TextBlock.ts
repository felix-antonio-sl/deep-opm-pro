// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/TextBlock.ts
// Extracted by opm-extracted/tools/extract.mjs

class TextBlock extends TextBlockClass {
  constructor() {
    super();
    this.lastEnteredText = "";
  }
  doubleClickHandle(cellView, evt, initRappid) {
    this.lastEnteredText = this.attr("label/text");
    this.openTextEditor(cellView, evt, initRappid);
  }
  openTextEditor(cellView, evt, initRappid) {
    const text = evt.target;
    if (initRappid.textEditor) {
      initRappid.textEditor.remove();
    } // Remove old editor if there was one.
    initRappid.textEditor = new joint.ui.TextEditor({
      text: text
    });
    initRappid.textEditor.cellView = cellView;
    initRappid.textEditor.render(initRappid.paper.el);
    initRappid.textEditor.on("text:change", function (newText) {
      // Set the new text to the property that you use to change text in your views.
      cellView.model.attr("label/text", newText);
      //    cellView.model.autoSize(evt);
    });
  }
  closeTextEditor(initRappid) {
    const currentText = this.attr("label/text");
    if (currentText.trim() === "") {
      // the current text is just whitespace
      this.attr("lable/text", this.lastEnteredText); // we'll save the previous one
    }
    if (initRappid.textEditor) {
      this.lastEnteredText = this.attr("lable/text");
      initRappid.textEditor.remove();
      initRappid.textEditor = null;
    }
  }
  autoSize(evt) {
    const view = (0, getInitRappidShared)().paper.findViewByModel(this);
    const textVel = evt.target;
    const bbox = textVel.getBoundingClientRect();
    if (bbox.width + 10 > this.get("size").width || bbox.height + 10 > this.get("size").height) {
      this.resize(bbox.width + 10, bbox.height + 10);
    }
  }
}
