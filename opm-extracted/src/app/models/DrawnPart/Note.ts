// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Note.ts
// Extracted by opm-extracted/tools/extract.mjs

    class Note extends OpmEntityRappid {
      constructor() {
        super();
        this.set(this.noteAttributes());
        this.attr(this.noteAttrs());
        // for (let i = 0; i < 10; i++) {
        //   this.addPort({ group: 'top', id: i });
        // }
        // for (let i = 10; i < 15; i++) {
        //   this.addPort({ group: 'right', id: i });
        // }
        // for (let i = 15; i < 25; i++) {
        //   this.addPort({ group: 'bottom', id: i });
        // }
        // for (let i = 25; i < 30; i++) {
        //   this.addPort({ group: 'left', id: i });
        // }
      }
      getVisual() {
        return undefined;
      }
      getPortGroups() {
        return {
          // 'top': this.createPortGroup('top', null, 0, -5, 10, 10),
          // 'bottom': this.createPortGroup('bottom', null, 0, -5, 10, 10),
          // 'left': this.createPortGroup('left', null, -5, 0, 10, 10),
          // 'right': this.createPortGroup('right', null, -5, 0, 10, 10)
        };
      }
      getFont() {
        return this.prop("attrs/.noteContentText/font-family").split(",")[0];
      }
      noteAttributes() {
        return {
          size: {
            width: 230,
            height: 200
          },
          markup: `<rect class="notes" cursor="crosshair" rx="0" ry="0"/><rect height="30" width="230" class="stickyPart" rx="0" ry="0"/>
<text class="noteContentText"/><text class="noteTitleText"/><g >
          <svg id='pin' width="100" height="100" viewBox="0 0 125 125">
              <defs>
                <pattern id="image" patternUnits="userSpaceOnUse" height="100" width="100">
                  <image x="0" y="0" height="35" width="35" xlink:href="assets/icons/pin.png"></image>
                </pattern>
              </defs>
              <circle class="notePin" cx="30" cy="15" r="30" fill="url(#image)" data-tooltip="Double click to edit text" data-tooltip-class-name="gal"/>
          </svg>
</g>`,
          type: "opm.Note",
          ports: {
            groups: this.getPortGroups()
          },
          date: new Date()
        };
      }
      noteAttrs() {
        const noteNumber = (0, getInitRappidShared)().getOpmModel().getAllNotesInModel().length + 1;
        return {
          ".stickyPart": {
            fill: "#fff2ab",
            "stroke-width": 0.2,
            stroke: "#ffcf61",
            refWidth: "100%",
            height: 30
          },
          ".notes": {
            fill: "#fff7d1",
            magnet: false,
            "stroke-width": 0.2,
            stroke: "#ffcf61",
            refWidth: "100%",
            refHeight: "100%"
            // filter: {name: 'dropShadow', args: {dy: -25, blur: 0, color: '#fff2ab'}},
          },
          ".noteContentText": {
            fill: "#000000",
            "font-size": 14,
            "font-weight": "600",
            "ref-x": 0.5,
            "ref-y": 0.5,
            refY2: 15,
            "x-alignment": "middle",
            "y-alignment": "middle",
            "text-anchor": "left",
            "font-family": "Arial, helvetica, sans-serif",
            textWrap: {
              text: "Type your comment here...",
              width: "90%",
              // padding 10 on left and right
              height: "80%" // padding 10 on top and bottom
            }
          },
          ".noteTitleText": {
            fill: "#000000",
            "font-size": 16,
            "font-weight": "600",
            "ref-x": 0.5,
            "ref-y": "15px",
            "x-alignment": "middle",
            "y-alignment": "middle",
            "font-family": "Arial, helvetica, sans-serif",
            textWrap: {
              text: "Note " + noteNumber + " title",
              width: "80%",
              // padding 10 on left and right
              height: "30px"
            }
          }
        };
      }
      getParams() {
        return {
          xPos: this.get("position").x,
          yPos: this.get("position").y,
          width: this.get("size").width,
          height: this.get("size").height,
          textFontWeight: this.attr(".noteContentText/font-weight"),
          textFontSize: this.attr("text/font-size") || this.attr(".noteContentText/font-size"),
          textFontFamily: this.attr("text/font-family") || this.attr(".noteContentText/font-family"),
          textColor: this.attr("text/fill") || this.attr(".noteContentText/fill"),
          refX: this.attr(".noteContentText/ref-x"),
          refY: this.attr(".noteContentText/ref-y"),
          xAlign: this.attr(".noteContentText/x-alignment"),
          yAlign: this.attr(".noteContentText/y-alignment"),
          textWidth: this.attr(".noteContentText/textWrap/width"),
          textHeight: this.attr(".noteContentText/textWrap/height"),
          textAnchor: this.attr(".noteContentText/text-anchor"),
          content: this.attr(".noteContentText/textWrap/text"),
          title: this.attr(".noteTitleText/textWrap/text"),
          fill: this.attr("rect/fill") || this.attr(".notes/fill"),
          strokeColor: this.attr("rect/stroke") || this.attr(".notes/stroke"),
          strokeWidth: this.attr(".notes/stroke-width") || this.attr("ellipse/stroke-width"),
          id: this.get("id"),
          date: this.get("date")
          // user: this.get('user'),
        };
      }
      updateParamsFromOpmModel(visualElement) {
        const attributes = {
          position: {
            x: visualElement.xPos,
            y: visualElement.yPos
          },
          size: {
            width: visualElement.width,
            height: visualElement.height
          },
          id: visualElement.id,
          date: visualElement.date
          //user: visualElement.user
        };
        const attr = {
          ".notes": {
            fill: visualElement.fill,
            stroke: visualElement.strokeColor
          },
          ".stickyPart": {
            fill: visualElement.fill === "#fff7d1" ? "#fff2ab" : visualElement.fill,
            stroke: visualElement.strokeColor
          },
          ".noteContentText": {
            fill: visualElement.textColor,
            "font-size": visualElement.textFontSize,
            "font-family": visualElement.textFontFamily,
            "font-weight": visualElement.textFontWeight,
            "ref-x": visualElement.refX,
            "ref-y": visualElement.refY,
            "x-alignment": visualElement.xAlign,
            "y-alignment": visualElement.yAlign,
            "text-anchor": visualElement.textAnchor,
            textWrap: {
              text: visualElement.content,
              width: visualElement.textWidth,
              height: visualElement.textHeight
            }
          },
          ".noteTitleText": {
            fill: visualElement.textColor,
            "font-size": visualElement.textFontSize,
            "font-family": visualElement.textFontFamily,
            "font-weight": "600",
            "ref-x": 0.5,
            "ref-y": "15px",
            "x-alignment": visualElement.xAlign,
            "y-alignment": visualElement.yAlign,
            textWrap: {
              text: visualElement.title,
              width: visualElement.textWidth,
              height: "30px"
            }
          }
        };
        this.attr(attr);
        this.set(attributes);
      }
      getShapeAttr() {
        return this.attr(".notes");
      }
      doubleClickHandle(cellView, evt, initRappid) {
        // super.doubleClickHandle(cellView, evt, initRappid);
        let textToOpen = evt.target.parentElement.className.baseVal;
        if (evt.target.textContent === "") {
          textToOpen = "noteContentText";
        }
        this.openTextEditor(cellView, initRappid, "." + textToOpen);
      }
      removeAction(visual, init, removeOnlyLocaly) {
        init.getOpmModel().logForUndo("remove note");
        (0, removeCell)(this, init);
      }
      haloConfiguration(halo, init) {
        this.drawHaloOnote(halo);
        halo.addHandle({
          name: "remove",
          icon: "assets/SVG/delete.svg",
          events: {
            pointerdown: "remove"
          },
          attrs: {
            ".slice": {
              "data-tooltip-class-name": "small",
              "data-tooltip": "Remove",
              "data-tooltip-position": "bottom",
              "data-tooltip-padding": 15
            }
          }
        });
      }
      getIconsForHalo() {
        return "assets/SVG/delete.svg";
      }
      getHaloHandles(init) {
        return [new RemoveCommand(init).createHaloHandle()];
      }
      getToolbarHandles(init) {
        return [new RemoveCommand(init).createToolbarHandle()];
      }
      /**
       * pasteStyle function can be used for notes in the future.
       * @param copiedParams
       */
      // pasteStyle(copiedParams) {
      //   if (copiedParams['fillColor']) {
      //       this.attr('rect/fill', copiedParams['fillColor']);
      //       // this.fill = copiedParams['fillColor'];
      //     }
      //     if (copiedParams['textColor']) {
      //       this.attr('rect/textColor', copiedParams['textColor']);
      //     }
      //     if (copiedParams['fontSize']) {
      //       this.attr('text/font-size', copiedParams['fontSize']);
      //       // this.textFontSize = copiedParams['fontSize'];
      //     }
      //     if (copiedParams['font']) {
      //       this.attr('text/font-family', copiedParams['font']);
      //     }
      //     if (copiedParams['borderColor']) {
      //       this.attr('rect/stroke',  copiedParams['borderColor']);
      //     }
      //     if (copiedParams['textAlign']) {
      //       this.attr('.noteContentText/text-anchor', copiedParams['textAlign']);
      //     }
      //     if (copiedParams['xPosition'] && copiedParams['yPosition']) {
      //       this.attr('.noteContentText/x-alignment', copiedParams['xPosition']);
      //       this.attr('.noteContentText/y-alignment', copiedParams['yPosition']);
      //     }
      //   }
      getEntityHaloAttributes(action) {
        return {
          ".slice": {
            "data-tooltip-class-name": "small",
            "data-tooltip": "Remove",
            "data-tooltip-position": "bottom",
            "data-tooltip-padding": 15
          }
        };
      }
      setTitle(value) {
        this.attr(".noteTitleText/textWrap/text", value);
      }
      setText(value) {
        this.attr(".noteContentText/textWrap/text", value);
      }
      drawHaloOnote(halo) {}
      openTextEditor(cellView, init, textElement) {
        const module = textElement === ".noteTitleText" ? new TitleModule(this) : new TextModule(this);
        const popup = NotePopup(cellView.$(textElement)[0], module);
        popup.open();
      }
      changeAttributesHandle(options) {}
      changeSizeHandle(initRappid) {}
      changePositionHandle(initRappid) {}
      removeHandle(initRappid) {}
      addHandle(options) {
        this.openTextEditor(options.paper.findViewByModel(this), options, ".noteContentText");
        // setTimeout(() => { if (options.textEditor) options.textEditor.selectAll(); }, 10);
      }
      pointerDownHandle(options) {}
      sizeChangeStartHandle() {}
      sizeChangeStopHandle() {}
      updateDuplicationMarkFillColor(fillColor) {}
      updateDuplicationMarkBorderColor(borderColor) {}
    }
    class TitleModule {
      constructor(note) {
        this.note = note;
      }
      getNoteSize() {
        return this.note.get("size");
      }
      getText() {
        return this.note.attr(".noteTitleText/textWrap/text");
      }
      setText(value) {
        this.note.attr(".noteTitleText/textWrap/text", value);
      }
      isTitleModule() {
        return true;
      }
    }
    class TextModule {
      constructor(note) {
        this.note = note;
      }
      getText() {
        return this.note.attr(".noteContentText/textWrap/text");
      }
      setText(value) {
        this.note.attr(".noteContentText/textWrap/text", value);
      }
      getNoteSize() {
        return this.note.get("size");
      }
      isTitleModule() {
        return false;
      }
    }
    function NotePopup(target, module) {
      const noteSize = module.getNoteSize();
      let textareaSize = "style=\"width: calc(100% - 8px);\"";
      if (!module.isTitleModule()) {
        textareaSize = "style=\"width: " + noteSize.width + "px;height: " + (noteSize.height - 30) + "px;\"";
      }
      const popup = new joint.ui.Popup({
        events: {
          keypress: function (event) {
            if (event.which == 13) {
              if (event.shiftKey) {
                event.target.value += "\n\r";
              } else {
                onUpdate();
              }
              event.preventDefault();
            }
          },
          "click .btnUpdate": function () {
            onUpdate();
          }
        },
        content: "<div class=\"text-popup\"><textarea class=\"text\" " + textareaSize + ">" + module.getText() + "</textarea><br><button class=\"btnUpdate Popup\">Update</button></div>",
        target: target
      });
      const onUpdate = () => {
        module.setText(popup.$(".text").val());
        popup.remove();
      };
      return {
        open: () => {
          popup.render();
          (0, stylePopup)();
          popup.$(".text").select();
        },
        close: () => popup.remove()
      };
    }