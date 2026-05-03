// EXPORTS

// EXTERNAL MODULE: ./src/app/models/DrawnPart/Links/OpmProceduralLink.ts
var OpmProceduralLink = require("./25416.js");
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/OpmEntityRappid.ts + 1 modules
var OpmEntityRappid = require("./91886.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/TextBlockClass.ts

class TextBlockClass extends shared /* joint */.FP.shapes.standard.TextBlock {
  changeSizeHandle(initRappid) {}
  changePositionHandle(initRappid) {}
  removeHandle(initRappid) {}
  addHandle(initRappid) {}
  changeAttributesHandle(initRappid) {}
  pointerUpHandle(initRappid) {}
  setHaloPosition(initRappid) {}
  pointerDownHandle(initRappid) {}
  doubleClickHandle(cellView, evt, initRappid) {}
  openMenu(initRappid) {}
  getParams() {}
  removeDuplicationMark() {}
}
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/TextBlock.ts

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
    initRappid.textEditor = new shared /* joint */.FP.ui.TextEditor({
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
    const view = (0, shared /* getInitRappidShared */.Km)().paper.findViewByModel(this);
    const textVel = evt.target;
    const bbox = textVel.getBoundingClientRect();
    if (bbox.width + 10 > this.get("size").width || bbox.height + 10 > this.get("size").height) {
      this.resize(bbox.width + 10, bbox.height + 10);
    }
  }
}
// EXTERNAL MODULE: ./src/app/models/DrawnPart/Links/OrXorArcs.ts
var OrXorArcs = require("./83898.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = require("./73308.js");
; // CONCATENATED MODULE: ./src/app/handwriting.js
// Establish the root object, `window` (`self`) in the browser,
// or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self === "object" && self.self === self && self || undefined;
// Create a safe reference to the handwriting object for use below.
function handwriting(obj) {
  if (obj instanceof handwriting) {
    return obj;
  }
  if (!(this instanceof handwriting)) {
    return new handwriting(obj);
  }
  this._wrapped = obj;
}
root.handwriting = handwriting;
handwriting.Canvas = function (cvs, lineWidth) {
  this.canvas = cvs;
  this.cxt = cvs.getContext("2d");
  this.cxt.lineCap = "round";
  this.cxt.lineJoin = "round";
  this.lineWidth = lineWidth || 3;
  this.width = cvs.width;
  this.height = cvs.height;
  this.drawing = false;
  this.handwritingX = [];
  this.handwritingY = [];
  this.trace = [];
  this.options = {};
  this.step = [];
  this.redo_step = [];
  this.redo_trace = [];
  this.allowUndo = false;
  this.allowRedo = false;
  cvs.addEventListener("mousedown", this.mouseDown.bind(this));
  cvs.addEventListener("mousemove", this.mouseMove.bind(this));
  cvs.addEventListener("mouseup", this.mouseUp.bind(this));
  cvs.addEventListener("touchstart", this.touchStart.bind(this));
  cvs.addEventListener("touchmove", this.touchMove.bind(this));
  cvs.addEventListener("touchend", this.touchEnd.bind(this));
  this.callback = undefined;
  this.recognize = handwriting.recognize;
};
/**
 * [toggle_Undo_Redo description]
 * @return {[type]} [description]
 */
handwriting.Canvas.prototype.set_Undo_Redo = function (undo, redo) {
  this.allowUndo = undo;
  this.allowRedo = undo ? redo : false;
  if (!this.allowUndo) {
    this.step = [];
    this.redo_step = [];
    this.redo_trace = [];
  }
};
handwriting.Canvas.prototype.setLineWidth = function (lineWidth) {
  this.lineWidth = lineWidth;
};
handwriting.Canvas.prototype.setCallBack = function (callback) {
  this.callback = callback;
};
handwriting.Canvas.prototype.setOptions = function (options) {
  this.options = options;
};
handwriting.Canvas.prototype.mouseDown = function (e) {
  // new stroke
  this.cxt.lineWidth = this.lineWidth;
  this.handwritingX = [];
  this.handwritingY = [];
  this.drawing = true;
  this.cxt.beginPath();
  var rect = this.canvas.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  this.cxt.moveTo(x, y);
  this.handwritingX.push(x);
  this.handwritingY.push(y);
};
handwriting.Canvas.prototype.mouseMove = function (e) {
  if (this.drawing) {
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    this.cxt.lineTo(x, y);
    this.cxt.stroke();
    this.handwritingX.push(x);
    this.handwritingY.push(y);
  }
};
handwriting.Canvas.prototype.mouseUp = function () {
  var w = [];
  w.push(this.handwritingX);
  w.push(this.handwritingY);
  w.push([]);
  this.trace.push(w);
  this.drawing = false;
  if (this.allowUndo) {
    this.step.push(this.canvas.toDataURL());
  }
};
handwriting.Canvas.prototype.touchStart = function (e) {
  e.preventDefault();
  this.cxt.lineWidth = this.lineWidth;
  this.handwritingX = [];
  this.handwritingY = [];
  var de = document.documentElement;
  var box = this.canvas.getBoundingClientRect();
  var top = box.top + window.pageYOffset - de.clientTop;
  var left = box.left + window.pageXOffset - de.clientLeft;
  var touch = e.changedTouches[0];
  var touchX = touch.pageX - left;
  var touchY = touch.pageY - top;
  this.handwritingX.push(touchX);
  this.handwritingY.push(touchY);
  this.cxt.beginPath();
  this.cxt.moveTo(touchX, touchY);
};
handwriting.Canvas.prototype.touchMove = function (e) {
  e.preventDefault();
  var touch = e.targetTouches[0];
  var de = document.documentElement;
  var box = this.canvas.getBoundingClientRect();
  var top = box.top + window.pageYOffset - de.clientTop;
  var left = box.left + window.pageXOffset - de.clientLeft;
  var x = touch.pageX - left;
  var y = touch.pageY - top;
  this.handwritingX.push(x);
  this.handwritingY.push(y);
  this.cxt.lineTo(x, y);
  this.cxt.stroke();
};
handwriting.Canvas.prototype.touchEnd = function (e) {
  var w = [];
  w.push(this.handwritingX);
  w.push(this.handwritingY);
  w.push([]);
  this.trace.push(w);
  if (this.allowUndo) {
    this.step.push(this.canvas.toDataURL());
  }
};
handwriting.Canvas.prototype.undo = function () {
  if (!this.allowUndo || this.step.length <= 0) {
    return;
  } else if (this.step.length === 1) {
    if (this.allowRedo) {
      this.redo_step.push(this.step.pop());
      this.redo_trace.push(this.trace.pop());
      this.cxt.clearRect(0, 0, this.width, this.height);
    }
  } else {
    if (this.allowRedo) {
      this.redo_step.push(this.step.pop());
      this.redo_trace.push(this.trace.pop());
    } else {
      this.step.pop();
      this.trace.pop();
    }
    loadFromUrl(this.step.slice(-1)[0], this);
  }
};
handwriting.Canvas.prototype.redo = function () {
  if (!this.allowRedo || this.redo_step.length <= 0) {
    return;
  }
  this.step.push(this.redo_step.pop());
  this.trace.push(this.redo_trace.pop());
  loadFromUrl(this.step.slice(-1)[0], this);
};
handwriting.Canvas.prototype.erase = function () {
  this.cxt.clearRect(0, 0, this.width, this.height);
  this.step = [];
  this.redo_step = [];
  this.redo_trace = [];
  this.trace = [];
};
function loadFromUrl(url, cvs) {
  var imageObj = new Image();
  imageObj.onload = function () {
    cvs.cxt.clearRect(0, 0, this.width, this.height);
    cvs.cxt.drawImage(imageObj, 0, 0);
  };
  imageObj.src = url;
}
handwriting.recognize = function (trace, options, callback) {
  if (handwriting.Canvas && this instanceof handwriting.Canvas) {
    trace = this.trace;
    options = this.options;
    callback = this.callback;
  } else if (!options) {
    options = {};
  }
  var data = JSON.stringify({
    options: "enable_pre_space",
    requests: [{
      writing_guide: {
        writing_area_width: options.width || this.width || undefined,
        writing_area_height: options.height || this.width || undefined
      },
      ink: trace,
      language: options.language || "zh_TW"
    }]
  });
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      switch (this.status) {
        case 200:
          var response = JSON.parse(this.responseText);
          var results;
          if (response.length === 1) {
            callback(undefined, new Error(response[0]));
          } else {
            results = response[1][0][1];
          }
          if (options.numOfWords) {
            results = results.filter(function (result) {
              return result.length == options.numOfWords;
            });
          }
          if (options.numOfReturn) {
            results = results.slice(0, options.numOfReturn);
          }
          callback(results, undefined);
          break;
        case 403:
          callback(undefined, new Error("access denied"));
          break;
        case 503:
          callback(undefined, new Error("can't connect to recognition server"));
          break;
      }
    }
  });
  xhr.open("POST", "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(data);
};
/* harmony default export */
const app_handwriting = handwriting;
// EXTERNAL MODULE: ./src/app/modules/Settings/OrgOntology/ontologyInterfaces.ts
var ontologyInterfaces = require("./89427.js");
// EXTERNAL MODULE: ./src/app/dialogs/ontologySugesstionDialog/ontology-suggestion-dialog.ts
var ontology_suggestion_dialog = require("./14905.js");
; // CONCATENATED MODULE: ./src/app/modules/Settings/OrgOntology/ontologyApplier.ts

class OntologyApplier {
  constructor(text, init, ontology, enforcementLevel) {
    this.text = text;
    this.init = init;
    this.ontology = ontology;
    this.enforcementLevel = enforcementLevel;
  }
  getAllSuggestions() {
    if (this.enforcementLevel === ontologyInterfaces /* OntologyEnforcementLevel */.u.NONE) {
      return [];
    }
    const toSuggest = [];
    for (const item of this.ontology) {
      const wordsToSave = item.synonyms.filter(word => shared /* OPCloudUtils */.e2.replaceWords(this.text + "", word, "%") !== this.text);
      wordsToSave.forEach(word => {
        let textToTest = "" + this.text;
        for (const phr of item.phrases) {
          while (textToTest.includes(phr)) {
            textToTest = textToTest.replace(phr, "");
          }
        }
        const condition1 = !toSuggest.find(it => it.wordToReplace.toLowerCase() === word.toLowerCase()); // not already suggested.
        const condition2 = !item.phrases.find(ph => textToTest.includes(ph)); // not already exists in the text as it should be.
        const condition3 = textToTest.toLowerCase().includes(word.toLowerCase()); // after cleaning still has the word that needs to be replaced.
        if (condition1 && condition2 && condition3) {
          toSuggest.push({
            wordToReplace: word,
            replacements: item.phrases
          });
        }
      });
    }
    return toSuggest;
  }
  openOntologySuggestionDialog(phraseToReplace, suggestedReplacements) {
    const that = this;
    // if there is only one option => don't even show popup - just replace.
    if (suggestedReplacements.length === 1 && that.enforcementLevel === ontologyInterfaces /* OntologyEnforcementLevel */.u.FORCE) {
      return new Promise((resolve, reject) => {
        resolve({
          shouldReplace: true,
          toReplace: phraseToReplace,
          replacement: suggestedReplacements[0]
        });
      });
    }
    return new Promise((resolve, reject) => {
      const dialog = that.init.dialogService.openDialog(ontology_suggestion_dialog /* OntologySuggestionDialog */.K, 320, 600, {
        allowMultipleDialogs: true,
        text: that.text,
        phraseToReplace: phraseToReplace,
        suggestedReplacements: suggestedReplacements,
        enforcementLevel: that.enforcementLevel
      });
      dialog.afterClosed().subscribe(val => {
        if (val) {
          resolve({
            shouldReplace: true,
            toReplace: phraseToReplace,
            replacement: val
          });
        } else {
          resolve({
            shouldReplace: false
          });
        }
      });
    });
  }
  updateText(value) {
    this.text = value;
  }
}
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/components/text/text.popup.ts

function TextPopup(init, target, visual, updateView) {
  // let content;
  // if (getInitRappidShared().penDrawingManager.isInPenMode)
  // content = '    <div class="text-popup"><input type="checkbox" id="formatting" name="formatting" ' + (name.isAutoFormat() ? 'checked="checked"' : '') + '><label class="popupHeader" for="formatting">Auto Format</label><br><textarea class="text" rows="3" cols="26" style="min-width: 225px;min-height: 40px">' + name.getText() + '</textarea><br><button class="btnUpdate Popup">Update</button><br><div>Handwriting:</div><canvas id="handwriting-canvas" width="240" height="100" style="border: 2px solid; cursor: crosshair;margin-top: 10px;"></canvas></div>';
  // else content =  '<div class="text-popup"><input type="checkbox" id="formatting" name="formatting" ' + (name.isAutoFormat() ? 'checked="checked"' : '') + '><label class="popupHeader" for="formatting">Auto Format</label><br><textarea class="text" rows="3" cols="26" style="min-width: 225px;min-height: 40px">' + name.getText() + '</textarea><br><button class="btnUpdate Popup">Update</button></div>';
  const logical = visual.logicalElement;
  const name = logical.getNameModule();
  const logicalForInfo = shared /* OPCloudUtils */.e2.isInstanceOfLogicalState(logical) ? logical.parent : logical;
  function dsFromString(dsVal) {
    return {
      showDescription: dsVal.indexOf("showDescription") >= 0,
      showAsTooltip: dsVal.indexOf("showAsTooltip") >= 0
    };
  }
  const descriptionStatus = dsFromString(visual.getDescriptionStatus());
  function dsToString(dsObj) {
    return (dsObj.showDescription ? "showDescription " : "") + (dsObj.showAsTooltip ? "showAsTooltip" : "");
  }
  // let lastNamePos = 0;
  // let lastDescriptionPos = 0;
  let nam; // #name
  let dsc; // #description
  let dck; // #descriptionCheck
  let dfs; // #descriptionDiv
  let hasd; // #hasDescription
  let fmt; // #formatting
  function toggleDescription() {
    if (!dck.is(":checked")) {
      dfs.hide(500);
      descriptionStatus.showDescription = false;
      nam[0].focus(); // .prop('focus', true);
    } else {
      dfs.show(500);
      dsc[0].focus(); // .prop('focus', true);
      descriptionStatus.showDescription = true;
    }
    visual.setDescriptionStatus(dsToString(descriptionStatus));
  }
  let textInFocus;
  function onLoad() {
    nam = popup.$("#name");
    dsc = popup.$("#description");
    dck = popup.$("#descriptionCheck");
    dfs = popup.$("#descriptionDiv");
    hasd = popup.$("#hasDescription");
    fmt = popup.$("#formatting");
    textInFocus = nam;
    nam.focus(() => textInFocus = nam);
    dsc.focus(() => textInFocus = dsc);
    const lastDescriptionPos = dsc.text().length;
    dsc.prop("selectionStart", lastDescriptionPos); // lastDescriptionPos);
    dsc.prop("selectionEnd", lastDescriptionPos);
  }
  const popup = new shared /* joint */.FP.ui.Popup({
    events: {
      keydown: function (event) {
        if (event.which === 27) {
          // on ESC - update and close.
          onUpdate();
          event.preventDefault();
          return;
        }
      },
      keypress: function (event) {
        if (event.which === 13) {
          if (!event.shiftKey) {
            onUpdate();
            event.preventDefault();
            return;
          }
          if (fmt.is(":checked")) {
            event.target.value += "\n\r";
            event.preventDefault();
          } else {
            return;
          }
        }
      },
      "input #name": function (event) {
        let startSelection = nam.prop("selectionStart");
        if (!name.isAutoFormat()) {
          return;
        }
        const before = nam.val();
        nam.val(name.formatText(nam.val()));
        if (before.toLowerCase().includes("and ") && !nam.val().toLowerCase().includes("and ") && !before.toLowerCase().endsWith("and ")) {
          startSelection = Math.max(0, startSelection - 2);
        }
        nam.prop("selectionStart", startSelection);
        nam.prop("selectionEnd", startSelection);
      },
      "input #description": function (event) {
        // Get and sanitize the input directly
        let text = dsc.val();
        // Replace problematic characters
        text = text.replace(/&/g, "&amp;") // Escape &
        .replace(/</g, "&lt;") // Escape <
        .replace(/>/g, "&gt;") // Escape >
        .replace(/'/g, "&apos;") // Escape '
        .replace(/"/g, "&quot;") // Escape "
        // Replace control characters with spaces
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, " ")
        // Replace line/paragraph separators with newlines
        .replace(/[\u2028\u2029]/g, "\n")
        // Replace BOM and directionality marks with empty strings
        .replace(/[\uFEFF\u200E\u200F]/g, "")
        // Replace non-breaking and zero-width spaces with regular spaces
        .replace(/[\u00A0\u200B]/g, " ")
        // Replace invalid XML characters with a placeholder
        .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, "�");
        // Check if the sanitized text has meaningful content
        if (text.trim()) {
          hasd.show();
        } else {
          hasd.hide();
        }
      },
      "click .btnUpdate": function () {
        onUpdate();
      },
      "click .infoSpan": function () {
        init.openSearchItemDialog(logicalForInfo);
        popup.remove();
      },
      "click #toolTipping": () => {
        descriptionStatus.showAsTooltip = popup.$("#toolTipping").is(":checked");
      },
      "click #descriptionCheck": toggleDescription,
      "change #formatting": function () {
        const new_val = fmt.is(":checked");
        name.shouldAutoFormat(new_val);
        if (new_val) {
          nam.val(name.formatText(nam.val()));
        }
      },
      "click .btnRecog": function () {
        can1.recognize();
      },
      "mousedown .move-button": function ($event) {
        onStartDrag($event);
      }
    },
    content: `
            <div class="text-popup">
            <span><input type="checkbox" id="formatting" name="formatting" ${name.isAutoFormat() ? "checked=\"checked\"" : ""}>
                <label class="popupHeader" for="formatting">Auto Format</label>
                <span title='show/hide description part'>
                   <input type="checkbox" id="descriptionCheck" name="descriptionCheck" ${descriptionStatus.showDescription ? "checked" : ""}>
                   <label class="popupHeader" id="descriptionCheckLabel" for="descriptionCheck">Description</label>
                   <span id='hasDescription' ${logical.getDescription() ? "" : "hidden"} style='overflow:hidden'>
                      <img style='position:relative;width:15px;height:15px;top:6px;' src='assets/icons/expand_more-24px.svg' alt='v'
                      title='This element has description text'>
                   </span>
                </span>
                <span class="infoSpan" style="margin-left: 11px; top: 12px; position: absolute;">
                    <svg width="17" height="17" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <circle cx="13" cy="13" r="12" stroke="#5A6F8F" stroke-width="2"/>
                     <path d="M15.3828 9.43359L13.5566 20H10.4219L12.2578 9.43359H15.3828ZM12.5801 6.75781C12.5801 6.26953 12.7461 5.8724 13.0781 5.56641C13.4102 5.26042 13.8105 5.10417 14.2793 5.09766C14.7415 5.09115 15.1354 5.23438 15.4609 5.52734C15.793 5.8138 15.959 6.19466 15.959 6.66992C15.959 7.15169 15.793 7.54557 15.4609 7.85156C15.1289 8.15755 14.7285 8.3138 14.2598 8.32031C13.7975 8.32682 13.4036 8.18685 13.0781 7.90039C12.7526 7.60742 12.5866 7.22656 12.5801 6.75781Z" fill="#5A6F8F"/>
                    </svg>
                </span>
                <div class="move-button" style="right: 5px; top: 10px; position: absolute;">
                  <svg width="18" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8936 10.3536C21.0888 10.1583 21.0888 9.84171 20.8936 9.64645L17.7116 6.46447C17.5163 6.2692 17.1997 6.2692 17.0045 6.46447C16.8092 6.65973 16.8092 6.97631 17.0045 7.17157L19.8329 10L17.0045 12.8284C16.8092 13.0237 16.8092 13.3403 17.0045 13.5355C17.1997 13.7308 17.5163 13.7308 17.7116 13.5355L20.8936 10.3536ZM12 10.5H20.54V9.5H12V10.5Z" fill="#586D8C"/>
                    <path d="M1.09554 9.64645C0.900274 9.84171 0.900274 10.1583 1.09554 10.3536L4.27752 13.5355C4.47278 13.7308 4.78936 13.7308 4.98462 13.5355C5.17989 13.3403 5.17989 13.0237 4.98462 12.8284L2.1562 10L4.98462 7.17157C5.17989 6.97631 5.17989 6.65973 4.98462 6.46447C4.78936 6.2692 4.47278 6.2692 4.27752 6.46447L1.09554 9.64645ZM12 9.5L1.44909 9.5V10.5L12 10.5V9.5Z" fill="#586D8C"/>
                    <path d="M11.3536 0.191901C11.1583 -0.00336151 10.8417 -0.00336151 10.6464 0.191901L7.46447 3.37388C7.2692 3.56914 7.2692 3.88573 7.46447 4.08099C7.65973 4.27625 7.97631 4.27625 8.17157 4.08099L11 1.25256L13.8284 4.08099C14.0237 4.27625 14.3403 4.27625 14.5355 4.08099C14.7308 3.88573 14.7308 3.56914 14.5355 3.37388L11.3536 0.191901ZM11.5 10V0.545454H10.5V10H11.5Z" fill="#586D8C"/>
                    <path d="M10.6464 19.8081C10.8417 20.0034 11.1583 20.0034 11.3536 19.8081L14.5355 16.6261C14.7308 16.4309 14.7308 16.1143 14.5355 15.919C14.3403 15.7237 14.0237 15.7237 13.8284 15.919L11 18.7474L8.17157 15.919C7.97631 15.7237 7.65973 15.7237 7.46447 15.919C7.2692 16.1143 7.2692 16.4309 7.46447 16.6261L10.6464 19.8081ZM10.5 10V19.4545H11.5V10H10.5Z" fill="#586D8C"/>
                  </svg>
                </div>
            </span><br>
            <textarea id='name' class="text" rows="2" cols="26" style="min-width: 264px;min-height: 40px">${name.getText()}</textarea>
            <br>
            <span hidden id="toolTippingPart">
                (<input type="checkbox" id="toolTipping" name="toolTipping" ${descriptionStatus.showAsTooltip ? "checked=\"checked\"" : ""}>
                    <label class="popupHeader" for="toolTipping">Make Tooltip</label>
                )
            </span>
            <div ${descriptionStatus.showDescription ? "" : "hidden"} id='descriptionDiv'>
                <span><label class="popupHeader" for="name">Description</label><br>
                <textarea id='description' class="description" rows="3" cols="26" style="min-width: 264px;min-height: 40px">${logical.getDescription()}</textarea>
                <br>
            </div>
            <button class="btnUpdate Popup">Update</button>
            </div>
            <br>
            <div ${(0, shared /* getInitRappidShared */.Km)().penDrawingManager.isInPenMode ? "" : "hidden"}>Handwriting:<br>
                <canvas id="handwriting-canvas" width="240" height="100" style="border: 2px solid; cursor: crosshair;margin-top: 10px;"></canvas>
            </div>
        `,
    target: target.tagName === "g" ? target.$("text")[0] : target
  });
  let can1;
  let lastPointerUpTime = Date.now();
  const onUpdate = /*#__PURE__*/function () {
    var _ref = (0, asyncToGenerator /* default */.A)(function* () {
      let value = popup.$(".text").val().trim();
      if (logical.opmModel.shouldAllowInvalidValueAtDesignTime() == false && logical.isValidName(value) == false) {
        (0, shared /* validationAlert */.iW)("Invalid value entered.");
        return;
      }
      if (shared /* OPCloudUtils */.e2.isInstanceOfLogicalState(logical) && logical.getFather().isSatisfiedRequirementObject()) {
        const owner = logical.opmModel.getOwnerOfRequirementByRequirementLID(logical.getFather().lid);
        const reqsValues = owner.getAllRequirements().map(req => logical.opmModel.getLogicalElementByLid(req.getRequirementObjectLID())?.value);
        if (reqsValues.find(val => val && val !== "Requirement name or ID" && val.trim() === value.trim())) {
          (0, shared /* validationAlert */.iW)("This exact name or id is already in use.", 3500, "Error");
          return;
        }
      }
      if (shared /* OPCloudUtils */.e2.isInstanceOfLogicalThing(logical)) {
        const exist = logical.opmModel.checkNameExistence(logical, value);
        if (exist.value) {
          $(".joint-popup").remove();
          const ret = yield init.openExistingNameDialog(exist.exist, visual.logicalElement);
          if (ret?.action === "useExisting") {
            init.opmModel.logForUndo("Rename thing to existing");
            init.opmModel.moveVisualsBetweenLogicals(visual.logicalElement, ret.existing);
            init.graphService.renderGraph(init.opmModel.currentOpd, init, null, false, true);
            init.criticalChanges_.next(true);
            return;
          } else if (ret?.action === "rename") {
            const cellView = init.paper.findViewByModel(visual.id);
            init.graph.getCell(visual.id)?.openTextEditor(cellView, init);
          }
          return;
        }
      }
      logical.opmModel.logForUndo(logical.text + " name change");
      logical.opmModel.setShouldLogForUndoRedo(false, "name change");
      const ontology = init.oplService.orgOplSettings.ontology;
      const ontologyEnforcementLevel = init.oplService.orgOplSettings.ontologyEnforcementLevel;
      const ontologyApplier = new OntologyApplier(value, init, ontology, ontologyEnforcementLevel);
      const suggestions = ontologyApplier.getAllSuggestions();
      $(".joint-popup").remove();
      for (const sug of suggestions) {
        const ret = yield ontologyApplier.openOntologySuggestionDialog(sug.wordToReplace, sug.replacements);
        if (ret.shouldReplace) {
          if (logical.isAutoFormat()) {
            logical.toggleAutoFormat();
          }
          value = shared /* OPCloudUtils */.e2.replaceWords(value, ret.toReplace, ret.replacement);
          ontologyApplier.updateText(value);
        }
      }
      const hadDescription = logical.getDescription()?.length;
      logical.setText(value);
      // Get and sanitize the value from the description input
      let descriptionText = popup.$(".description").val();
      // Apply sanitization to the description text
      descriptionText = descriptionText.replace(/&/g, "&amp;") // Escape &
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;") // Escape >
      .replace(/'/g, "&apos;") // Escape '
      .replace(/"/g, "&quot;") // Escape "
      // Replace control characters with spaces
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, " ")
      // Replace line/paragraph separators with newlines
      .replace(/[\u2028\u2029]/g, "\n")
      // Replace BOM and directionality marks with empty strings
      .replace(/[\uFEFF\u200E\u200F]/g, "")
      // Replace non-breaking and zero-width spaces with regular spaces
      .replace(/[\u00A0\u200B]/g, " ")
      // Replace invalid XML characters with a placeholder
      .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, "�");
      // Set the sanitized description
      logical.setDescription(descriptionText);
      visual.setDescriptionStatus(dsToString(descriptionStatus));
      if (!hadDescription) {
        logical.visualElements.forEach(v => v.setDescriptionStatus(dsToString(descriptionStatus)));
      }
      if (popup.$(".description").val().length === 0) {
        logical.visualElements.forEach(v => v.setDescriptionStatus(""));
      }
      updateView();
      init.elementTextChange.next([logical]);
      if (logical.name === "OpmLogicalProcess" && !value.trim().toLowerCase().endsWith("ing")) {
        (0, shared /* validationAlert */.iW)("The OPM process naming convention is to name a process by making its last word a gerund, i.e., the root of the verb followed by the “ing” suffix.", 5000, "warning");
      }
      logical.opmModel.setShouldLogForUndoRedo(true, "name change");
    });
    return function onUpdate() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    open: () => {
      popup.render();
      onLoad();
      const fieldInput = popup.$(".text");
      const fldLength = fieldInput.val().length;
      fieldInput[0].focus();
      fieldInput[0].setSelectionRange(0, fldLength);
      (0, shared /* stylePopup */.O0)();
      if ((0, shared /* getInitRappidShared */.Km)().penDrawingManager.isInPenMode) {
        can1 = new app_handwriting.Canvas(document.getElementById("handwriting-canvas"), 3);
        can1.setCallBack(function (data, err) {
          if (err) {
            throw err;
          } else {
            const textElement = textInFocus[0]; // popup.$('.text')[0];
            const split = textElement.value.split(" ");
            if (data[0] === "--") {
              textElement.value = split.splice(0, split.length - 1).join(" ");
            } else if (data[0] === "---") {
              textElement.value = "";
            } else if (textElement.selectionEnd - textElement.selectionStart > 0) {
              textElement.value = textElement.value.slice(0, textElement.selectionStart) + data[0] + textElement.value.slice(textElement.selectionEnd);
            } else if (textElement.selectionEnd - textElement.selectionStart === 0) {
              const space = textElement.value.length === textElement.selectionEnd ? " " : "";
              textElement.value = textElement.value.slice(0, textElement.selectionStart) + space + data[0] + textElement.value.slice(textElement.selectionStart);
            } else {
              popup.$(".text")[0].value = popup.$(".text")[0].value + " " + data[0];
            }
            can1.erase();
          }
        });
        can1.setLineWidth(1);
        can1.setOptions({
          language: "en",
          numOfReturn: 3
        });
        document.getElementById("handwriting-canvas").addEventListener("pointerup", function () {
          lastPointerUpTime = Date.now();
          setTimeout(function () {
            if (Date.now() - lastPointerUpTime >= 1300) {
              can1.recognize();
              can1.erase();
            }
          }, 1300);
        });
      }
    },
    close: () => popup.remove()
  };
}
function onStartDrag(event) {
  if (event.touches) {
    return;
  }
  event.preventDefault();
  window.onmousemove = function (e) {
    moveDrag(e);
  };
  window.onmouseup = function (e) {
    endDrag(e);
  };
}
function endDrag(event) {
  window.onmousemove = function (e) {};
  window.onmouseup = function (e) {};
}
function moveDrag(event) {
  const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
  const rect = $(".joint-popup")[0].getClientRects()[0];
  const moveBtnRects = $(".move-button")[0].getClientRects()[0];
  const dx = moveBtnRects.left - rect.left + moveBtnRects.width / 2;
  const dy = moveBtnRects.top - rect.top + moveBtnRects.height / 2;
  $(".joint-popup")[0].style.left = event.clientX - dx + "px";
  $(".joint-popup")[0].style.top = event.clientY - dy + scrollTop + "px";
}
// EXTERNAL MODULE: ./src/app/models/DrawnPart/OpmSemifoldedFundamental.ts
var OpmSemifoldedFundamental = require("./43622.js");
// EXTERNAL MODULE: ./node_modules/jointjs/src/util/util.mjs
var util = require("./28258.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/UrlsUtils.ts
class UrlsUtils {
  constructor(opmEntity) {
    this.opmEntity = opmEntity;
    this.lastOpenedUrlIndex = 0;
    this.lastOpenedUrlWindow = undefined;
  }
  openNextLink() {
    if (!this.opmEntity.hasURLs()) {
      return;
    }
    const urls = this.opmEntity.URLarray;
    this.lastOpenedUrlIndex = this.lastOpenedUrlIndex % urls.length; // round-robin
    if (this.lastOpenedUrlWindow) {
      this.lastOpenedUrlWindow.close();
    }
    const url = urls[this.lastOpenedUrlIndex].url;
    this.lastOpenedUrlWindow = window.open(url, "Opcloud Link", "width = 1000, height = 1000");
    this.lastOpenedUrlIndex += 1;
  }
  resetCounter() {
    this.lastOpenedUrlIndex = 0;
  }
}
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/Links/BiDirectionalTaggedLink.ts
var BiDirectionalTaggedLink = require("./56210.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/OpmEntity.ts

var uuid = util /* uuid */.uR;
export class Q extends OpmEntityRappid /* OpmEntityRappid */._ {
  constructor() {
    super();
    this.lastOpenedUrlIndex = 0;
    this.lastOpenedUrlWindow = undefined;
    this.set(this.entityAttributes());
    this.attr(this.enitiyAttrs());
    this.oplPopUp = null;
    this.urlsUtils = new UrlsUtils(this);
    this.oldPortsMap = new Map();
    this.defaultPortMarkup = [{
      tagName: "circle",
      attributes: {
        stroke: "transparent",
        fill: "transparent",
        r: 2,
        width: 2,
        height: 2,
        // x: 0, y: 0,
        magnet: "true"
      }
    }];
  }
  hasURLs() {
    return this.getVisual() && !!this.getVisual().logicalElement.URLarray.find(item => !item.url.endsWith("://"));
  }
  get URLarray() {
    return this.getVisual().logicalElement.URLarray;
  }
  hasDescription() {
    // Get the description value
    let desc = this.getVisual()?.logicalElement?.description || "";
    // Sanitize the description
    desc = desc.replace(/&/g, "&amp;") // Escape &
    .replace(/</g, "&lt;") // Escape <
    .replace(/>/g, "&gt;") // Escape >
    .replace(/'/g, "&apos;") // Escape '
    .replace(/"/g, "&quot;") // Escape "
    // Replace control characters with spaces
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, " ")
    // Replace line/paragraph separators with newlines
    .replace(/[\u2028\u2029]/g, "\n")
    // Replace BOM and directionality marks with empty strings
    .replace(/[\uFEFF\u200E\u200F]/g, "")
    // Replace non-breaking and zero-width spaces with regular spaces
    .replace(/[\u00A0\u200B]/g, " ")
    // Replace invalid XML characters with a placeholder
    .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, "�");
    // Check if description is non-empty and description status includes 'show'
    if (this.getVisual()?.descriptionStatus?.includes("show") && desc.trim().length > 0) {
      return {
        value: true,
        desc: desc
      };
    }
    return {
      value: false
    };
  }
  updateURLArray() {}
  getUrlSvgIcon(xPos, yPos) {
    return `<svg class="urlSign" x=${xPos} y=${yPos} width="15" height="15" viewBox="0 0 21 22" fill="transparent" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" d="M10 5.5L12.5058 2.73046C14.9717 0.00491284 19.5 1.74938 19.5 5.42493V5.42493C19.5 6.11548 19.2365 6.78001 18.7632 7.28287L13.9231 12.4254C12.5969 13.8345 10.3683 13.8683 9 12.5V12.5" stroke="#1A3763" stroke-width="2"/>
            <path opacity="0.7" d="M10.5 16.5L7.99422 19.2695C5.52825 21.9951 1 20.2506 1 16.5751V16.5751C1 15.8845 1.26354 15.22 1.73682 14.7171L6.57687 9.57458C7.90309 8.16547 10.1317 8.13171 11.5 9.5V9.5" stroke="#1A3763" stroke-width="2"/>
            <title>Left click to open the link, right click to edit</title>
            </svg>`;
  }
  getDescriptionSvgIcon(descXpos, descYpos, title) {
    // Use clearSvgTitle to decode and escape the title safely
    const safeTitle = this.clearSvgTitle(title);
    // Add line breaks after every 6 words for better readability
    const formattedTitle = safeTitle.replace(/((?:[^\s]*\s){6}[^\s]*)\s/g, "$1\n");
    return `<svg class="descSign" x=${descXpos} y=${descYpos} width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9904 4.03649C11.9923 4.00564 11.9923 3.97472 11.9904 3.94387C11.9904 3.94387 11.9904 3.9298 11.9904 3.92375C11.9836 3.88758 11.9727 3.85244 11.9578 3.81905C11.9578 3.809 11.9578 3.80295 11.9482 3.7949C11.9387 3.78685 11.9214 3.74257 11.9061 3.71841L11.885 3.69223C11.864 3.66175 11.8402 3.63344 11.814 3.6077L8.16037 0.143077C8.13548 0.121178 8.10919 0.101003 8.08178 0.0826837L8.05112 0.0685921C8.03082 0.0562368 8.00966 0.045471 7.98785 0.0363816L7.96869 0.024303L7.89776 0.0021585H7.87666C7.84478 -0.000719501 7.81273 -0.000719501 7.78084 0.0021585H0.575081C0.424857 0.00211554 0.28058 0.0638069 0.173109 0.174039C0.065638 0.284268 0.00350547 0.434287 0 0.592006V14.3961C0 14.5563 0.0605887 14.7099 0.168437 14.8231C0.276286 14.9364 0.422561 15 0.575081 15H11.4249C11.5774 15 11.7237 14.9364 11.8316 14.8231C11.9394 14.7099 12 14.5563 12 14.3961V4.05259C12 4.05259 11.9904 4.04251 11.9904 4.03649ZM8.34826 1.94081L9.9393 3.45267H8.34826V1.94081ZM1.15016 13.7962V1.19595H7.20575V4.05259C7.20575 4.21276 7.26634 4.36637 7.37418 4.47962C7.48205 4.59291 7.62832 4.65654 7.78084 4.65654H10.8479V13.7962H1.15016Z" fill="#5A6F8F"/>
            <line x1="3" y1="5.5" x2="9" y2="5.5" stroke="#5A6F8F"/>
            <line x1="3" y1="9.5" x2="9" y2="9.5" stroke="#5A6F8F"/>
            <line x1="3" y1="11.5" x2="7" y2="11.5" stroke="#5A6F8F"/>
            <line x1="3" y1="7.5" x2="7" y2="7.5" stroke="#5A6F8F"/>
            <path d="M0 0H8L10 2L12 4V15H0V0Z" fill="white" fill-opacity="0.01"/>
            <title>${formattedTitle}</title>
            </svg>
      `; // The title tooltip is broken into sections of 6 spaces between words so it would look ok. It replaced the 7th space with \n
  }
  decodeDoubleEncodedTitle(title) {
    // Iteratively decode all layers of encoding
    let decodedTitle = title;
    let previousTitle;
    do {
      previousTitle = decodedTitle;
      decodedTitle = decodedTitle.replace(/&amp;/g, "&") // Decode &
      .replace(/&lt;/g, "<") // Decode <
      .replace(/&gt;/g, ">") // Decode >
      .replace(/&apos;/g, "'") // Decode '
      .replace(/&quot;/g, "\""); // Decode "
    } while (decodedTitle !== previousTitle); // Continue until no more changes
    return decodedTitle;
  }
  clearSvgTitle(title) {
    // Decode the title
    let decodedTitle = this.decodeDoubleEncodedTitle(title);
    // Re-escape for HTML/XML safety
    return decodedTitle.replace(/&/g, "&amp;") // Escape &
    .replace(/</g, "&lt;") // Escape <
    .replace(/>/g, "&gt;") // Escape >
    .replace(/'/g, "&apos;") // Escape '
    .replace(/"/g, "&quot;"); // Escape "
  }
  toggleBackgroundPhoto() {}
  addSvgsClickEvents(init) {
    if (!init) {
      return;
    }
    const that = this;
    const cellView = init.paper ? init.paper.findViewByModel(this) : undefined;
    const urlSign = cellView ? cellView.el.getElementsByClassName("urlSign")[0] : undefined;
    if (this.hasURLs() && urlSign) {
      urlSign.style.cursor = "alias";
      urlSign.onclick = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        that.urlsUtils.openNextLink();
      };
      urlSign.oncontextmenu = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        init.setSelectedElement(that);
        init.elementToolbarReference.AddURL();
      };
    }
    const cameraSign = cellView ? cellView.el.getElementsByClassName("cameraSign")[0] : undefined;
    if (cameraSign) {
      cameraSign.onclick = undefined;
      cameraSign.onpointerdown = function ($event) {
        that.cameraClickLocation = {
          x: $event.clientX,
          y: $event.clientY
        };
        $(cameraSign).css("cursor", "grabbing");
      };
      cameraSign.onpointerup = function ($event) {
        if ($event.which !== 3 && that.cameraClickLocation?.x === $event.clientX && that.cameraClickLocation?.y === $event.clientY) {
          $event.preventDefault();
          $event.stopPropagation();
          that.toggleBackgroundPhoto();
        }
        that.cameraClickLocation = undefined;
        $(".cameraSign").css("cursor", "url(/assets/SVG/customCursor.svg) 13 12, auto");
      };
      cameraSign.oncontextmenu = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        init.setSelectedElement(that);
        $(".cameraSign").css("cursor", "url(/assets/SVG/customCursor.svg) 13 12, auto");
        init.elementToolbarReference.openThingBackgroundImageDialog();
      };
    }
    const descriptionSign = cellView ? cellView.el.getElementsByClassName("descSign")[0] : undefined;
    const hasDescSign = this.hasDescription().value && this.hasDescription().desc?.length > 0;
    if (hasDescSign && descriptionSign) {
      descriptionSign.style.cursor = "context-menu";
      descriptionSign.ondblclick = function ($event) {
        setTimeout(function () {
          $(".description").select();
        }, 200);
      };
    }
  }
  //TODO:Alon
  getEntityHaloAttributes(action) {
    return {
      ".slice": {
        "data-tooltip-class-name": "small",
        "data-tooltip": this.beautifytoolTip(action),
        "data-tooltip-position": "bottom",
        "data-tooltip-padding": 15
      }
    };
  }
  createPorts(visual) {
    if (visual && visual.ports) {
      this.addPorts(visual.ports);
    }
  }
  convertOldPortToRelativePosition(portId) {
    return undefined;
  }
  pasteStyle(copiedParams) {
    this.getVisual().pasteStyleParams(copiedParams);
  }
  updateOldPortsToNewPorts() {
    try {
      // TODO: allow numerical ports if has self Invocation!
      const portsInUse = this.getVisual().getPortsInUse();
      const oldPortsFormat = new Set(portsInUse.filter(p => p !== null && p !== undefined && (0, shared /* isNumber */.Et)(p)));
      for (const port of oldPortsFormat) {
        const portData = this.convertOldPortToRelativePosition(port);
        if (!portData) {
          continue;
        }
        const newId = uuid();
        const isProcess = this.constructor.name.includes("Process");
        const refX = isProcess ? portData.refX : portData.refX * 100 + "%";
        const refY = isProcess ? portData.refY : portData.refY * 100 + "%";
        this.addPort({
          id: newId,
          group: "aaa",
          args: {
            x: refX,
            y: refY
          },
          markup: this.defaultPortMarkup
        });
        this.oldPortsMap.set(Number(port), newId);
      }
      const links = this.getVisual().getLinks();
      for (const inl of links.inGoing.filter(l => l.targetVisualElementPort)) {
        const newPort = this.oldPortsMap.get(inl.targetVisualElementPort);
        if (newPort) {
          inl.targetVisualElementPort = newPort;
        }
      }
      for (const outl of links.outGoing.filter(l => l.sourceVisualElementPort)) {
        const newPort = this.oldPortsMap.get(outl.sourceVisualElementPort);
        if (newPort) {
          outl.sourceVisualElementPort = newPort;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  addCustomPort(point) {
    const portId = uuid();
    const size = this.get("size");
    const refX = Math.max(0, Math.min(point.x / size.width, 1)) * 100 + "%";
    const refY = Math.max(0, Math.min(point.y / size.height, 1)) * 100 + "%";
    this.addPort({
      id: portId,
      group: "aaa",
      args: {
        x: refX,
        y: refY
      },
      markup: this.defaultPortMarkup
    });
    return portId;
  }
  animatePort(portId, initRappid) {
    setTimeout(() => {
      const allPortsEls = initRappid.paper.findViewByModel(this).$(".joint-port-body");
      let correctPortEl;
      for (const p of allPortsEls) {
        if (p.getAttribute("port") === portId) {
          correctPortEl = p;
          break;
        }
      }
      if (correctPortEl) {
        correctPortEl.classList.add("glowingPort");
        setTimeout(() => {
          correctPortEl.classList.remove("glowingPort");
        }, 1500);
      }
    }, 200);
  }
  removeUnusedPorts() {
    if (!this.getVisual()) {
      return;
    }
    const portsInUse = this.getVisual().getPortsInUse();
    const existingPorts = this.getPorts();
    const inPorts = this.graph.getConnectedLinks(this, {
      inbound: true
    }).map(link => link?.target()?.port).filter(p => !!p);
    const outPorts = this.graph.getConnectedLinks(this, {
      outbound: true
    }).map(link => link?.source()?.port).filter(p => !!p);
    portsInUse.push(...inPorts, ...outPorts);
    // self Invocation support.
    if (this.graph.getConnectedLinks(this).find(l => l?.constructor.name.includes("PartDeletable"))) {
      portsInUse.push(this.graph.getConnectedLinks(this).find(l => l.constructor.name.includes("PartDeletable")).source().port);
    }
    if (this.graph.getConnectedLinks(this).find(l => l?.constructor.name === "SelfInvocationLinkPart")) {
      portsInUse.push(this.graph.getConnectedLinks(this).find(l => l.constructor.name === "SelfInvocationLinkPart").target().port);
    }
    // numerical ports are for the self invocation
    for (let i = existingPorts.length - 1; i >= 0; i--) {
      if (!portsInUse.includes(existingPorts[i].id)) {
        this.removePort(existingPorts[i].id);
      }
    }
  }
  // TODO:Alon
  beautifytoolTip(action) {
    switch (action) {
      case "remove":
        {
          return "Remove";
        }
      case "styling":
        {
          return "Style Element";
        }
      case "computation":
        {
          return "Computation";
        }
      case "inzoom":
        {
          return "In-Zoom";
        }
      case "ShowInZoom":
        {
          return "Show In-Zoomed View";
        }
      case "unfold":
        {
          return "Unfold";
        }
      case "ShowUnfold":
        {
          return "Show Unfolded View";
        }
      case "addConnected":
        {
          return "Add Connected Things From Other OPD's";
        }
      case "addState":
        {
          return "Add States";
        }
      case "suppress":
        {
          return "Suppress";
        }
      case "deleteFunction":
        {
          return "Remove Computational";
        }
      case "updateComputationalProcess":
        {
          return "Update Computational";
        }
      case "simulationElement":
        {
          return "simulationElement";
        }
      case "editUnits":
        {
          return "Edit Units";
        }
      case "editAlias":
        {
          return "Edit Alias";
        }
      case "timeDurationFunction":
        {
          return "Time Duration";
        }
      case "timeDurationDeleteFunction":
        {
          return "Delete Time Duration";
        }
      case "hideValueObject":
        {
          return "Hide";
        }
      case "suppressValueStates":
        {
          return "Suppress States";
        }
    }
  }
  greyOutEntity() {}
  removeFromModel(model) {}
  entityAttributes() {
    return {
      size: {
        width: 135,
        height: 60
      },
      ports: {
        groups: this.getPortGroups()
      }
    };
  }
  enitiyAttrs() {
    return {
      text: {
        fill: "#000000",
        "font-size": 14,
        "ref-x": 0.5,
        "ref-y": 0.5,
        "x-alignment": "middle",
        "y-alignment": "middle",
        "font-family": "Arial, helvetica, sans-serif",
        "text-anchor": "middle",
        textWrap: {
          text: "Object",
          width: "80%",
          // padding 5 on left and right
          height: "80%",
          // padding 5 on top and bottom
          ellipsis: true
        }
      }
    };
  }
  entityShape() {
    return {
      fill: "#ffffff",
      magnet: true,
      "stroke-width": 2
    };
  }
  getPortAttr(x, y, width, height) {
    return {
      rect: {
        stroke: "transparent",
        fill: "red",
        width: width,
        height: height,
        x: x,
        y: y,
        magnet: "true"
      }
    };
  }
  getPortGroups() {}
  getEntityParams() {
    return {
      xPos: this.get("position").x,
      yPos: this.get("position").y,
      width: this.get("size").width,
      height: this.get("size").height,
      textFontWeight: this.attr("text/font-weight"),
      textFontSize: this.attr("text/font-size"),
      textFontFamily: this.attr("text/font-family"),
      textColor: this.attr("text/fill"),
      refX: this.attr("text/ref-x"),
      refY: this.attr("text/ref-y"),
      xAlign: this.attr("text/x-alignment"),
      yAlign: this.attr("text/y-alignment"),
      textWidth: this.attr("text/textWrap/width"),
      textHeight: this.attr("text/textWrap/height"),
      text: this.attr("text/textWrap/text"),
      fill: this.getShapeAttr().fill,
      strokeColor: this.getShapeAttr().stroke,
      strokeWidth: this.attr("rect/stroke-width") || this.attr("ellipse/stroke-width"),
      id: this.get("id"),
      fatherObjectId: this.get("parent"),
      textAnchor: this.attr("text/text-anchor"),
      ports: this.getPorts()
    };
  }
  updateEntityFromOpmModel(visualElement) {
    const attributes = {
      position: {
        x: visualElement.xPos,
        y: visualElement.yPos
      },
      size: {
        width: visualElement.width,
        height: visualElement.height
      },
      id: visualElement.id
    };
    const attr = {
      text: {
        fill: visualElement.textColor || "#000002",
        "font-size": visualElement.textFontSize || 14,
        "font-family": visualElement.textFontFamily || "Arial",
        "font-weight": visualElement.textFontWeight || 600,
        "ref-x": visualElement.refX || 0.5,
        "ref-y": visualElement.refY || 0.5,
        "x-alignment": visualElement.xAlign || "middle",
        "y-alignment": visualElement.yAlign || "middle",
        "text-anchor": visualElement.textAnchor,
        textWrap: {
          text: visualElement?.getDisplayText(),
          width: visualElement.textWidth || "80%",
          height: visualElement.textHeight || "80%"
        }
      }
    };
    const fill = visualElement.fill;
    const stroke = visualElement.strokeColor;
    this.attr(attr);
    this.set(attributes);
    this.lastEnteredText = visualElement.logicalElement.text;
    if (visualElement.fatherObject) {
      this.set("parent", visualElement.fatherObject.id);
    }
    return {
      fill: fill || "#FFFFFF",
      stroke: stroke
    };
  }
  haloConfiguration(halo, init) {
    /*const handleAction = (this.getVisual() as OpmVisualEntity).generateHalo();
    const handleObjects = this.getHaloAttrs(handleAction);
    this.drawHalo(handleObjects, halo);
    const thisEntity = this;
    if (!(isState && fatherObject.isComputational())) {
      halo.addHandle({
        name: 'remove',
        icon: 'assets/SVG/delete.svg',
        events: { pointerdown: 'remove' },
        attrs: {
          '.slice': {
            'data-tooltip-class-name': 'small',
            'data-tooltip': 'Remove',
            'data-tooltip-position': 'bottom',
            'data-tooltip-padding': 15
          },
        }
      });
    }
    if (thisEntity.attributes.type === 'opm.Process' || thisEntity.attributes.type === 'opm.State') {
      halo.on('action:styling:pointerdown', function () {
        init.elementToolbarReference.openStylingDiv();
        this.remove();
      });
    }*/
  }
  // relative to the element's position
  getPortsAbsolutePositions() {
    return Object.keys(this.getPortsPositions("aaa")).map(id => this.getPortsPositions("aaa")[id]);
  }
  getStructuralLinkConnectionPointDelta() {
    const slots = [{
      number: "0%",
      hasValue: false
    }];
    for (let i = 1; i <= 9; i++) {
      slots.push({
        number: i * 10 + "%",
        hasValue: false
      }, {
        number: i * -10 + "%",
        hasValue: false
      });
    }
    this.graph.getConnectedLinks(this, {
      inbound: true
    }).forEach(link => {
      const dx = link.attributes.target?.anchor?.args?.dx;
      if (dx && slots.find(item => item.number === dx)) {
        slots.find(item => item.number === dx).hasValue = true;
      }
    });
    this.graph.getConnectedLinks(this, {
      outbound: true
    }).forEach(link => {
      const dx = link.attributes.source?.anchor?.args?.dx;
      if (dx && slots.find(item => item.number === dx)) {
        slots.find(item => item.number === dx).hasValue = true;
      }
    });
    return slots.find(slot => slot.hasValue === false)?.number || "0%";
  }
  sortStructuralLinks(init = (0, shared /* getInitRappidShared */.Km)()) {
    const inLinks = this.graph.getConnectedLinks(this, {
      inbound: true
    }).filter(l => l?.prop("target/anchor"));
    const outLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    }).filter(l => l?.prop("source/anchor"));
    const links = [...inLinks, ...outLinks];
    const arr = [];
    for (const link of links) {
      const side = inLinks.includes(link) ? "target" : "source";
      arr.push(link.prop(side + "/anchor"));
    }
    // checking if the current links positions are already OK.
    let alreadyGood = true;
    for (const link1 of links) {
      for (const link2 of links) {
        if (link1 === link2) {
          continue;
        }
        const view1Path = link1.findView(init.paper)?.path;
        const view2Path = link2.findView(init.paper)?.path;
        if (!view1Path || !view2Path) {
          continue;
        }
        const inters = (0, shared /* getIntersectionPointsOfPaths */.Uz)(view1Path, view2Path);
        if (inters.length > 0) {
          alreadyGood = false;
        }
      }
    }
    if (alreadyGood) {
      return;
    }
    let permutations = (0, shared /* permutationsOfArray */.Cp)(arr);
    let perm;
    while (perm = permutations.pop()) {
      let good = true;
      for (const l of links) {
        const side = inLinks.includes(l) ? "target" : "source";
        l.prop(side + "/anchor", perm[links.indexOf(l)]);
      }
      for (const link1 of links) {
        for (const link2 of links) {
          if (link1 !== link2) {
            const view1Path = link1.findView(init.paper)?.path;
            const view2Path = link2.findView(init.paper)?.path;
            if (!view1Path || !view2Path) {
              continue;
            }
            const inters = (0, shared /* getIntersectionPointsOfPaths */.Uz)(view1Path, view2Path);
            if (inters.length > 0) {
              good = false;
              permutations = permutations.filter(p => {
                if (p[links.indexOf(link1)] === perm[links.indexOf(link1)] && p[links.indexOf(link2)] === perm[links.indexOf(link2)]) {
                  return false;
                }
                return true;
              });
              break;
            }
          }
        }
        if (good === false) {
          break;
        }
      }
      if (good === true) {
        return;
      }
    }
    // return to the original if no good perm found.
    for (const link of links) {
      const side = inLinks.includes(link) ? "target" : "source";
      link.prop(side + "/anchor", arr[links.indexOf(link)]);
    }
  }
  // returns the port number that is the closest to point
  findClosestEmptyPort(point, allowSamePort = false) {
    const thisSize = this.get("size");
    const thisPos = this.get("position");
    const normalizedPoint = {
      x: point.x - thisPos.x,
      y: point.y - thisPos.y
    };
    let refX = normalizedPoint.x / thisSize.width;
    refX = Math.min(1, Math.max(0, refX));
    let refY = normalizedPoint.y / thisSize.height;
    refY = Math.min(1, Math.max(0, refY));
    // TODO: fix this code so ports won't be created near to other exsiting ports
    // let absolutePos = { x: thisSize.width * refX, y: thisSize.height * refY };
    // let existingPorts = this.getPortsAbsolutePositions();
    // const funct = distanceBetweenPoints;
    // let angle = 10;
    // while (existingPorts.find( item => funct(item, absolutePos) <= 20)) {
    //   const bbox = {x: 0, y: 0, width: thisSize.width, height: thisSize.height};
    //   let shape;
    //   if (this.constructor.name.includes('Process'))
    //     shape = new geometry.g.ellipse.fromRect(bbox);
    //   else shape = new geometry.g.rect(bbox);
    //   const center = {x: bbox.width / 2, y:bbox.height / 2};
    //   const line = new geometry.g.line(center, absolutePos);
    //   line.setLength(line.length() + 8000);
    //   line.rotate(center, angle*(bbox.height/bbox.width));
    //   absolutePos = (distanceBetweenPoints(center, line.pointAt(0)) < distanceBetweenPoints(center, line.pointAt(1))) ? line.pointAt(0) : line.pointAt(1);
    //   const nextPoint = shape.intersectionWithLineFromCenterToPoint(absolutePos);
    //   refX = nextPoint.x / thisSize.width;
    //   refX = Math.min(1, Math.max(0, refX));
    //   refY = nextPoint.y / thisSize.height;
    //   refY = Math.min(1, Math.max(0, refY));
    //   absolutePos = { x: thisSize.width * refX, y: thisSize.height * refY };
    //   angle += 5;
    // }
    const portId = uuid();
    const isRectShape = this.constructor.name.includes("Object") || this.constructor.name.includes("State");
    this.addPort({
      id: portId,
      group: "aaa",
      args: {
        x: isRectShape ? refX * 100 + "%" : refX,
        y: isRectShape ? refY * 100 + "%" : refY
      },
      markup: this.defaultPortMarkup
    });
    return portId;
  }
  pointerDownHandle(cellView, init) {
    init.graph.startBatch("pointerDown");
    this.lastPosition = Object.assign(this.get("position"));
    init.getOpmModel().logForUndo("pointerdown " + this.attributes?.attrs?.text?.textWrap?.text || 0);
    OrXorArcs /* Arc */.l.makeThingArcsTransparent(this, init, true);
    if (this.getParent()) {
      OrXorArcs /* Arc */.l.makeThingArcsTransparent(this.getParent(), init, true);
    }
  }
  getFont() {
    return this.prop("attrs/text/font-family");
  }
  pointerUpHandle(cellView, init) {
    this.sortStructuralLinks(init);
    super.pointerUpHandle(cellView, init);
    const this_ = this;
    // const visual = init.getOpmModel().getVisualElementById(this_.id);
    // const halo = new (joint.ui.Halo.extend({
    //
    //   PIE_INNER_RADIUS:
    //     30,
    //
    //   PIE_OUTER_RADIUS:
    //     70,
    //
    // }))({
    //   cellView: cellView,
    //   handles: haloConfig.handles,
    //   type: 'pie',
    //   boxContent: false,
    //   pieToggles: [{name: 'default', position: 'nw'}],
    //   pieIconSize: 36,
    //   pieSliceAngle: (360 / visual.generateHalo().length), // Alon: Calculates the angles of each slice of the pie according to the number of actions allowed
    // }).render();
    this.setOrderOfEmbedded(init);
    // when the "Entity" is in the new position redraw the arcs of it
    OrXorArcs /* Arc */.l.redrawAllArcs(this, init, true);
    if (this.getParent()) {
      OrXorArcs /* Arc */.l.redrawAllArcs(this.getParent(), init, true);
    }
    if (cellView.model.changed && cellView.model.changed.position && !init.currentlyPastingStyleParams) {
      init.getOpmModel().lastUndoOpReasonUpdate(cellView.model.attributes.attrs.text.textWrap.text + " movement");
      // init.getOpmModel().lastUndoOpReasonUpdate( cellView.model.attributes.attrs.text.textWrap.text + ' moved to (' + cellView.model.changed.position.x + ', ' +
      //   + cellView.model.changed.position.y + ')');
    } else {
      const op = init.getOpmModel().getLastUndoOpertaion();
      if (op !== undefined && op.reason !== undefined && op.reason.includes("pointerdown")) {
        init.getOpmModel().removeLastUndoOperation();
      }
    }
    this.removeUnusedPorts();
    if (init.selection.collection.length > 1) {
      shared /* joint */.FP.ui.Halo.clear(init.paper);
    }
    init.graph.stopBatch("pointerDown");
    for (const link of init.graph.getConnectedLinks(this)) {
      if (link instanceof BiDirectionalTaggedLink /* BiDirectionalTaggedLink */.Y) {
        link.fixArrowDirection();
      }
    }
    init.currentlyPastingStyleParams = false;
  }
  redrawDuplicationMark(options) {
    const duplicationMarkCell = options.graph.getCell(this.id);
    if (duplicationMarkCell.removeDuplicationMark()) {
      const visualElement = options.opmModel.getVisualElementById(this.id);
      this.addDuplicationMark(options, visualElement, null);
    }
  }
  updateTextView() {
    this.updateTextFromModel(this.getVisual().logicalElement);
  }
  updateTextFromModel(logical) {
    this.setText(logical.getDisplayText());
  }
  setText(text) {
    this.attr({
      text: {
        textWrap: {
          text: text
        }
      }
    });
  }
  // This method should also be private
  getText() {
    return this.attr("text/textWrap/text");
  }
  changeAttributesHandle(options) {
    if (options.getAutomaticResizingForCell(this)) {
      this.autosize(options);
    }
  }
  openTextEditor(cellView, initRappid, onFinish = () => {}) {
    const currentOpd = initRappid.opmModel.currentOpd;
    if (currentOpd.isStereotypeOpd() || currentOpd.requirementViewOf || initRappid.isDSMClusteredView?.value === true || currentOpd.sharedOpdWithSubModelId || currentOpd.belongsToSubModel) {
      return;
    }
    const visual = initRappid.opmModel.getVisualElementById(this.get("id"));
    const logical = visual.logicalElement;
    if (visual.canModifyText() === false) {
      return;
    }
    if (logical.protectedFromBeingRefinedBySubModel || logical.getFather()?.protectedFromBeingRefinedBySubModel) {
      const viewOpd = logical.visualElements.map(v => initRappid.opmModel.getOpdByThingId(v.id)).find(opd => opd && opd.sharedOpdWithSubModelId === logical.protectedFromBeingRefinedBySubModel);
      return (0, shared /* validationAlert */.iW)(`Changing the ${viewOpd?.name || "entity of"} Subsystem Model View can only be done when opening the sub model directly from the load menu or the OPD tree.`, 6000, "Error");
    }
    let popup;
    const this_ = this;
    const onUpdate = () => {
      this_.getVisual().xPos = this_.get("position").x;
      this_.getVisual().yPos = this_.get("position").y;
      this.updateSiblings(visual, initRappid);
      // TODO: This part should be pure logical and completly move to the model.
      // updateObjectValueType func should be inside OpmLogical
      const parent = this.getParent();
      if (parent && parent.updateObjectValueType && parent.isComputational()) {
        this.getParent().updateObjectValueType(initRappid, logical.parent.value);
      }
      if (!parent) {
        this.changeSizeHandle(initRappid);
      }
      popup.close();
      if (parent) {
        parent.shiftEmbeddedToEdge(initRappid);
      }
      onFinish();
    };
    if (!initRappid.isTesting) {
      this_.set("position", this_.get("position"));
      popup = TextPopup(initRappid, cellView, visual, onUpdate);
      popup.open();
    }
  }
  getEssence() {
    const essence = this.attr(this.getShape() + this.argsAtt);
    if (essence.dx === this.essenceValues[1].dx && essence.dy === this.essenceValues[1].dy) {
      return ConfigurationOptions /* Essence */.tg.Informatical;
    } else {
      return ConfigurationOptions /* Essence */.tg.Physical;
    }
  }
  autosize(initRappid) {
    initRappid.graph.startBatch("ignoreEvents");
    const parent = this.getParentCell();
    while (!this.graph.hasActiveBatch("rendering") && this.isNotCompliteText(initRappid)) {
      // the text is bigger then the shape
      this.resize(this.get("size").width * 1.03, Math.max(20, this.get("size").height * 1.01));
      this.manuallyResized = false;
      if (initRappid.paper) {
        this.findView(initRappid.paper)?.update();
      }
      // if the cell is embedded in another cell then need to check if the parent should be larger
      if (parent) {
        parent.updateSizePositionToFitEmbeded();
      }
    }
    this.shiftEmbeddedToEdge(initRappid);
    // try to make the entity smaller only if it doesn't have embedded cells
    // and wasn't resized manually
    // if (!this.getEmbeddedCells().length && this.manuallyResized !== undefined && !this.manuallyResized) {
    //   const textView = initRappid.paper.findViewByModel(this).$('text')[0];
    //   const bbox = vectorizer.V(textView).bbox();
    //   let newWidth = this.get('size').width, newHeight = this.get('size').height;
    //   if (bbox.width / this.get('size').width < 0.5) {
    //     newWidth = Math.max(bbox.width * 1.4, this.get('minSize').width);
    //   }
    //   if (bbox.height / this.get('size').height < 0.5) {
    //     newHeight = Math.max(bbox.height * 1.4, this.get('minSize').height);
    //   }
    //   this.resize(newWidth, newHeight);
    //   if (initRappid.paper)
    //     this.findView(initRappid.paper)?.update();
    // }
    initRappid.graph.stopBatch("ignoreEvents");
  }
  beautifyConnectedLinks(init) {
    init.getOpmModel().logForUndo("Arrange Connected Links");
    init.getOpmModel().setShouldLogForUndoRedo(false, "beautifyConnectedLinks");
    const visual = this.getVisual();
    const drawnInLinks = this.graph.getConnectedLinks(this, {
      inbound: true
    });
    const drawnOutLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    });
    for (const inL of drawnInLinks) {
      const visualLink = inL.getVisual ? inL.getVisual() : undefined;
      if (!visualLink) {
        continue;
      }
      // const visSourcePos = { x: visualLink.source.xPos + visualLink.source.width / 2, y: visualLink.source.yPos + visualLink.source.height / 2}
      const visSourcePos = inL.findView(init.paper).sourceAnchor;
      const port = this.findClosestEmptyPort(visSourcePos, true);
      if (inL.getTargetArcOnLink && inL.getTargetArcOnLink()) {
        for (const arcLink of inL.getTargetArcOnLink().getLinksArray()) {
          arcLink.set("target", {
            id: this.id,
            port: port
          });
          if (arcLink.getVisual && arcLink.getVisual()) {
            arcLink.getVisual().targetVisualElementPort = port;
          }
        }
      } else {
        inL.set("target", {
          id: this.id,
          port: port
        });
        if (inL.getVisual && inL.getVisual()) {
          inL.getVisual().targetVisualElementPort = port;
        }
      }
    }
    for (const outL of drawnOutLinks) {
      let visualLink = outL.getVisual ? outL.getVisual() : undefined;
      if (!visualLink && outL.getTargetElement()?.constructor.name.includes("Triangle")) {
        const bottomLinks = this.graph.getConnectedLinks(outL.getTargetElement(), {
          outbound: true
        });
        if (bottomLinks.length > 0 && bottomLinks[0].getVisual && bottomLinks[0].getVisual()) {
          visualLink = bottomLinks[0].getVisual();
        }
      }
      if (!visualLink) {
        continue;
      }
      // const visTargetPos = { x: visualLink.target.xPos + visualLink.target.width / 2, y: visualLink.target.yPos + visualLink.target.height / 2};
      const visTargetPos = outL.findView(init.paper).targetAnchor;
      const port = this.findClosestEmptyPort(visTargetPos, true);
      if (outL.getSourceArcOnLink && outL.getSourceArcOnLink()) {
        for (const arcLink of outL.getSourceArcOnLink().getLinksArray()) {
          arcLink.set("source", {
            id: this.id,
            port: port
          });
          if (arcLink.getVisual && arcLink.getVisual()) {
            arcLink.getVisual().sourceVisualElementPort = port;
          }
        }
      } else {
        outL.set("source", {
          id: this.id,
          port: port
        });
        if (outL.getVisual && outL.getVisual()) {
          outL.getVisual().sourceVisualElementPort = port;
        }
      }
    }
    // const portsWithLinks =  this.getPortsLinks();
    // for (const portData in portsWithLinks) {
    //   if (portsWithLinks[portData].length === 0)
    //     continue;
    //   const linksToMove = portsWithLinks[portData].filter(l => l.link.constructor.name !== portsWithLinks[portData][0].link.constructor.name ||
    //     l.link.getTargetElement() !== portsWithLinks[portData][0].link.getTargetElement());
    //   if (linksToMove.length === 0)
    //     continue;
    //   for (const item of linksToMove) {
    //     const ratio = item.side === 'source' ? 0.01 : 0.99;
    //     const point = init.paper.findViewByModel(linksToMove[0].link).getPointAtRatio(ratio);
    //     const bestPort = this.findClosestEmptyPort(point);
    //     if (item.side === 'source') {
    //       if (item.link.getSourceArcOnLink && item.link.getSourceArcOnLink()) {
    //         const arcLinksToMove = item.link.getSourceArcOnLink().getLinksArray();
    //         for (const arcLink of arcLinksToMove) {
    //           arcLink.set('source', {id: arcLink.source().id, port: bestPort});
    //           arcLink.getVisual().sourceVisualElementPort = bestPort;
    //         }
    //       }
    //       item.link.set('source', {id: item.link.source().id, port: bestPort});
    //       if (item.link.getVisual && item.link.getVisual())
    //         item.link.getVisual().sourceVisualElementPort = bestPort;
    //     } else {
    //       if (item.link.getTargetArcOnLink && item.link.getTargetArcOnLink()) {
    //         const arcLinksToMove = item.link.gettargetArcOnLink().getLinksArray();
    //         for (const arcLink of arcLinksToMove) {
    //           arcLink.set('target', {id: arcLink.target().id, port: bestPort});
    //           arcLink.getVisual().targetVisualElementPort = bestPort;
    //         }
    //       }
    //       item.link.set('target', {id: item.link.target().id, port: bestPort});
    //       if (item.link.getVisual && item.link.getVisual())
    //         item.link.getVisual().targetVisualElementPort = bestPort;
    //     }
    //   }
    // }
    OrXorArcs /* Arc */.l.redrawAllArcs(this, init, true);
    init.getOpmModel().setShouldLogForUndoRedo(true, "beautifyConnectedLinks");
  }
  getPortsLinks() {
    const drawnInLinks = this.graph.getConnectedLinks(this, {
      inbound: true
    });
    const drawnOutLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    });
    const ports = {};
    for (let i = 0; i <= 30; i++) {
      ports[String(i)] = [];
    }
    for (const inl of drawnInLinks) {
      ports[this.graph.getCell(inl.id).target().port].push({
        link: inl,
        side: "target"
      });
    }
    for (const outl of drawnOutLinks) {
      ports[this.graph.getCell(outl.id).source().port].push({
        link: outl,
        side: "source"
      });
    }
    return ports;
  }
  // gets the text attribute and capitalizes the first letter of each word and line.
  toggleCapitalize(text) {
    for (let i = 0; i < text.length; i++) {
      // capitalize the first letter of the first word and each word after a space or an enter
      if (i === 0) {
        text = this.toggleLetter(text.charAt(i)) + text.substr(i + 1, text.length);
      } else if (text.charAt(i - 1) === " " || text.charAt(i - 1) === "\n") {
        text = text.substr(0, i) + this.toggleLetter(text.charAt(i)) + text.substr(i + 1, text.length);
      }
    }
    return text;
  }
  insertSpace(initRappid) {
    const text = this.attr("text/textWrap/text");
    const lastChar = text.charAt(text.length - 1);
    if (lastChar === " ") {
      //      initRappid.paper.findViewByModel(this).$('text')[0].textContent = text;
      initRappid.paper.findViewByModel(this).$("text")[0].textContent = initRappid.paper.findViewByModel(this).$("text")[0].textContent + "\xA0";
      const editor = initRappid.textEditor;
      editor.textarea.value = initRappid.paper.findViewByModel(this).$("text")[0].textContent;
      editor.textarea.selectionStart = text.length;
      editor.textarea.selectionEnd = text.length;
      editor.setCaret(text.length);
      // textArea.selectionStart = text.length;
      // textArea.selectionEnd = text.length;
    }
  }
  // return true if the shape is to small to contain the entire text without breaking words
  isNotCompliteText(initRappid) {
    // checking if missing text
    if (!initRappid.paper) {
      return false;
    }
    initRappid.paper.findViewByModel(this)?.update();
    const textView = initRappid.paper.findViewByModel(this)?.$("text")[0];
    if (!textView) {
      return false;
    }
    const realText = String(this.attr("text/textWrap/text"));
    if ((0, shared /* textWithoutSpaces */.HR)(textView.textContent) !== (0, shared /* textWithoutSpaces */.HR)(realText)) {
      return true;
    }
    // checking if there are broken words during typing. If there are then there will
    // be capitalized letter at the middle of the word
    if (initRappid.textEditor && initRappid.textEditor.cellView.model === this) {
      const capital = this.toggleCapitalize(initRappid.textEditor.getTextContent());
      if ((0, shared /* textWithoutSpaces */.HR)(realText) !== (0, shared /* textWithoutSpaces */.HR)(capital)) {
        return true;
      }
    }
    const descSignRight = initRappid.paper?.findViewByModel(this)?.$(".descSign")[0]?.getClientRects()[0]?.right;
    const thisRight = initRappid.paper?.findViewByModel(this)?.el.getClientRects()[0]?.right;
    if (descSignRight && thisRight && thisRight - 3 < descSignRight) {
      return true;
    }
    return false;
  }
  shiftEmbeddedToEdge(initRappid) {}
  getParent() {
    if (!this.graph) {
      return;
    }
    // this doe'nt work anymore, and the opl relies on the fact that a state has to have a father
    let parentId = this.get("parent");
    if (parentId) {
      return this.graph.getCell(parentId);
    }
    // this addition is for getting a state's father
    parentId = this.attributes.father;
    if (parentId) {
      return this.graph.getCell(parentId);
    }
  }
  changeLinks(name = "invocation") {
    const outboundLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    });
    const inboundLinks = this.graph.getConnectedLinks(this, {
      inbound: true
    });
    outboundLinks.concat(inboundLinks).forEach(linkToUpdate => {
      if (linkToUpdate && linkToUpdate.get("name").toLowerCase().indexOf(name.toLocaleLowerCase()) >= 0) {
        // if (linkToUpdate.get('name') === 'selfInvocation') {
        //     if (outboundLinks.includes(linkToUpdate))
        //         linkToUpdate.UpdateVertices({ x: thisEntity.get('position').x, y: thisEntity.get('position').y });
        //     else
        //         linkToUpdate.UpdateVertices(null, { x: thisEntity.get('position').x + thisEntity.get('size').width, y: thisEntity.get('position').y });
        // }
        // else
        // if (linkToUpdate.UpdateVertices) {
        //   linkToUpdate.UpdateVertices();
        // } else {
        //   const x = 3;
        // }
        if (linkToUpdate.UpdateSpecialLinks) {
          linkToUpdate.UpdateSpecialLinks();
        }
      }
    });
  }
  removeDuplicationMark() {
    if (this.get("duplicationMark")) {
      this.get("duplicationMark").remove();
      this.set("duplicationMark", null);
      return true;
    }
    return false;
  }
  changeSizeHandle(initRappid, direction = null) {
    this.graph.startBatch("ignoreEvents");
    const visual = this.getVisual();
    let updatedWidth = this.get("size").width;
    let updatedHeight = this.get("size").height;
    if (this.get("size").width < this.get("minSize").width) {
      updatedWidth = this.get("minSize").width;
    }
    if (this.get("size").height < this.get("minSize").height) {
      updatedHeight = this.get("minSize").height;
    }
    if (visual && visual.calculateMinHeight) {
      updatedHeight = Math.max(updatedHeight, visual.calculateMinHeight());
      updatedWidth = Math.max(updatedWidth, visual.calculateMinWidth());
    }
    if (!this.graph.hasActiveBatch("minimalShrink") && initRappid.getAutomaticResizingForCell(this)) {
      this.set("size", {
        width: updatedWidth,
        height: updatedHeight
      });
    }
    this.graph.stopBatch("ignoreEvents");
    // In case entity is embedded, need to update the size the parent entity
    // so that the entity will not stay out of it's border
    if (this.getParentCell()) {
      this.getParentCell().updateSizePositionToFitEmbeded();
    }
    // In case entity has embeds, need to update it's size so that the embeds will not
    // stay out of it's border
    if (this.getEmbeddedCells() && this.getEmbeddedCells().length && (direction === "right" || direction === "bottom")) {
      this.updateSizePositionToFitEmbeded();
    }
    this.manuallyResized = true;
    if (initRappid.getAutomaticResizingForCell(this) || initRappid.graph.hasActiveBatch("minimalShrink")) {
      this.autosize(initRappid);
    }
    this.setHaloPosition(this);
    if (visual) {
      visual.width = this.get("size").width;
      visual.height = this.get("size").height;
    }
    this.changeLinks("selfinvocation");
    // Gal: redraw arc in new position because of size change
    // Arc.redrawAllArcs(this, initRappid, true);
  }
  // direction will be defined only if the position changed because of size changing from left or top
  changePositionHandle(initRappid, direction = null) {
    if (this.getParentCell()) {
      if (this.graph.hasActiveBatch("parentMovedByUser")) {
        this.graph.stopBatch("parentMovedByUser");
      } else {
        this.getParentCell().updateSizePositionToFitEmbeded(false, true);
        if (this.getParentCell().getParentCell()) {
          this.getParentCell().getParentCell().updateSizePositionToFitEmbeded();
        }
      }
    }
    if (this.getEmbeddedCells() && this.getEmbeddedCells().length) {
      if (direction && this.keepChildrenPositionByPosition) {
        this.keepChildrenPositionByPosition(initRappid);
      } else {
        // if the embedded element changed position because its parent changed position
        for (let i = 0; i < this.getEmbeddedCells().length; i++) {
          this.startBatch("parentMovedByUser");
        }
      }
    }
    this.setHaloPosition(this);
    // When an entity is moving, need to update the vertices on invocation link and the
    // C and E signs on condition end event links
    this.changeLinks();
    const outboundLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    });
    const inboundLinks = this.graph.getConnectedLinks(this, {
      inbound: true
    });
    const thisEntity = this;
    shared._.each(outboundLinks.concat(inboundLinks).filter(l => !!l), function (linkToUpdate) {
      if (linkToUpdate.getSourceElement()?.constructor.name.includes("Semi")) {
        const bestSourcePort = OpmSemifoldedFundamental /* OpmSemifoldedFundamental */.U.bestSemiFoldedPort(linkToUpdate.getSourceElement().getVisual().fatherObject, linkToUpdate.getTargetElement().getVisual());
        linkToUpdate.set("source", {
          id: linkToUpdate.getSourceElement().id,
          port: bestSourcePort
        });
        if (linkToUpdate.getVisual()) {
          linkToUpdate.getVisual().sourceVisualElementPort = bestSourcePort;
        }
      } else if (linkToUpdate.getTargetElement()?.constructor.name.includes("Semi")) {
        const bestTargetPort = OpmSemifoldedFundamental /* OpmSemifoldedFundamental */.U.bestSemiFoldedPort(linkToUpdate.getTargetElement().getVisual().fatherObject, linkToUpdate.getSourceElement().getVisual());
        linkToUpdate.set("target", {
          id: linkToUpdate.getTargetElement().id,
          port: bestTargetPort
        });
        if (linkToUpdate.getVisual()) {
          linkToUpdate.getVisual().targetVisualElementPort = bestTargetPort;
        }
      }
      if (linkToUpdate instanceof OpmProceduralLink /* OpmProceduralLink */.E) {
        linkToUpdate.UpdateVertices();
        // linkToUpdate.UpdateConditionEvent();
      }
    });
    try {
      //   this.setOrderOfAllEntities(null);
    } catch (e) {}
    // Arc.redrawAllArcs(this, initRappid, true);
  }
  updateTextSize(newParams) {
    // a block of code that shouldn't be followed by any event
    this.graph.startBatch("ignoreEvents");
    this.attr({
      text: {
        textWrap: {
          text: newParams.text
        }
      }
    });
    if (!(newParams.width <= this.get("size").width) || !(newParams.height <= this.get("size").height) || !this.manuallyResized) {
      this.set("size", {
        width: newParams.width,
        height: newParams.height
      });
      //      this.resize(newParams.width, newParams.height);
      this.manuallyResized = false;
    }
    this.graph.stopBatch("ignoreEvents");
  }
  removeHandle(options) {}
  hasLinkMovingOnThis(initRappid) {
    return initRappid.graph.getCells().find(c => c.isLink() && (!c.source().id || !c.target().id));
  }
  hightlightPortsForOrXor(enteredDrawnLink, cellView, init) {
    this.isHightlightingPortsForOrXor = true;
    const linkSide = enteredDrawnLink.source().id ? "target" : "source";
    if (!this.getVisual()) {
      return;
    }
    const links = this.getVisual().getLinks();
    let enteredLinkPort;
    if (enteredDrawnLink.getVisual && enteredDrawnLink.getVisual()) {
      if (linkSide === "source") {
        enteredLinkPort = enteredDrawnLink.getVisual().sourceVisualElementPort || "noPort";
      } else {
        enteredLinkPort = enteredDrawnLink.getVisual().targetVisualElementPort || "noPort";
      }
    }
    const portsToMark = [];
    if (linkSide === "source") {
      for (const link of links.outGoing) {
        if (link.sourceVisualElementPort && (enteredDrawnLink.constructor.name.includes("Blank") || link.type === enteredDrawnLink.getVisual().type)) {
          portsToMark.push(link.sourceVisualElementPort);
        }
      }
    } else {
      for (const link of links.inGoing) {
        if (link.targetVisualElementPort && (enteredDrawnLink.constructor.name.includes("Blank") || link.type === enteredDrawnLink.getVisual().type)) {
          portsToMark.push(link.targetVisualElementPort);
        }
      }
    }
    const elPorts = cellView.$(".joint-port-body");
    for (const elPort of elPorts) {
      const portToMarkId = elPort.getAttribute("port");
      if (portsToMark.includes(portToMarkId) && portToMarkId !== enteredLinkPort) {
        elPort.classList.add("orXorAvailablePort");
      }
    }
  }
  unHightlightPortsForOrXor(cellView) {
    this.isHightlightingPortsForOrXor = false;
    const elPorts = cellView.$(".joint-port-body");
    for (const elPort of elPorts) {
      elPort.classList.remove("orXorAvailablePort");
    }
  }
  fixTextOverflow() {
    const refX = this.attr("text/ref-x");
    const refY = this.attr("text/ref-y");
    if (refX > 0.5) {
      this.attr("text/x-alignment", "right");
    } else if (refX < 0.5) {
      this.attr("text/x-alignment", "left");
    } else {
      this.attr("text/x-alignment", "middle");
    }
    if (refY > 0.5) {
      this.attr("text/y-alignment", "bottom");
    } else if (refY < 0.5) {
      this.attr("text/y-alignment", "top");
    } else {
      this.attr("text/y-alignment", "middle");
    }
  }
  addHandle(options, greyEntity = true) {
    const cellView = this.findView(options.paper);
    const that = this;
    if (cellView) {
      cellView.el.addEventListener("mouseenter", function () {
        const linkAbove = that.hasLinkMovingOnThis(options);
        if (linkAbove && (linkAbove.isProceduralLink() || linkAbove.constructor.name.includes("Blank"))) {
          that.hightlightPortsForOrXor(linkAbove, cellView, options);
        }
      });
      cellView.el.addEventListener("mouseleave", function () {
        if (that.isHightlightingPortsForOrXor) {
          that.unHightlightPortsForOrXor(cellView);
        }
      });
    }
    this.updateURLArray();
    if (greyEntity === true) {
      this.greyOutEntity();
    }
    this.colorIfInCurrentConfiguration(options);
  }
  getShape() {
    return "rect";
  }
  colorIfInCurrentConfiguration(init) {
    if (!init.opmModel.getCurrentConfiguration() || !this.getVisual()?.logicalElement) {
      return;
    }
    const conf = init.opmModel.getCurrentConfiguration()[this.getVisual().logicalElement.lid];
    if (conf && conf.value !== 0) {
      init.graph.startBatch("ignoreChange");
      this.attr(this.getShape() + "/fill", "#4eff00");
      init.graph.stopBatch("ignoreChange");
    }
  }
  addTextBlock() {
    const textBlock = new TextBlock();
    //    textBlock.attr('root/title', 'title');
    //   textBlock.markup[0].tagName = 'ellipse';
    textBlock.attr("body/fill", "pink");
    //   textBlock.attr('body/refWidth', '50%');
    textBlock.attr("label/text", "te");
    // Styling of the label via `style` presentation attribute (i.e. CSS).
    textBlock.attr("label/style/color", "red");
    textBlock.resize(this.get("size").width - 20, this.get("size").height - 20);
    textBlock.position(this.get("position").x + 10, this.get("position").y + 10);
    //   textBlock.attr('foreignObject/refWidth', '50%');
    //  textBlock.attr('foreignObject/refHeight', '100%');
    textBlock.addTo(this.graph);
    this.embed(textBlock);
  }
  setOrderOfAllEntities(options) {
    /**
     * Alon: change the order of the array from smallest value to largest:
     * using the (x,y) values of an array
     * consts = current (x,y)
     * Sort the array
     * if there is a difference, re arrange the order
     **/
    const graph = this.graph;
    this.graph.attributes.cells.models.sort((a, b) => {
      if (a instanceof Q && b instanceof Q) {
        return graph.getCell(a).get("position").x - graph.getCell(b).get("position").x;
      } else {
        return 0;
      }
    });
    this.graph.attributes.cells.models.sort((a, b) => {
      if (a instanceof Q && b instanceof Q) {
        return graph.getCell(a).get("position").y - graph.getCell(b).get("position").y;
      } else {
        return 0;
      }
    });
    this.setOrderOfEmbeddedEntities(null);
  }
  setOrderOfEmbeddedEntities(options) {
    /**
     * Alon: change the order of the array from smallest value to largest:
     * using the (x,y) values of an array
     * consts = current (x,y)
     * Sort the array
     * if there is a difference, re arrange the order
     **/
    if (this.getAncestors().length !== 0) {
      const graph = this.graph;
      const ancestor = this.getAncestors()[0];
      ancestor.attributes.embeds.sort(function (a, b) {
        return graph.getCell(a).get("position").x - graph.getCell(b).get("position").x;
      });
      ancestor.attributes.embeds.sort(function (a, b) {
        return graph.getCell(a).get("position").y - graph.getCell(b).get("position").y;
      });
    }
  }
  setOrderOfEmbedded(options) {
    /**0
     * Alon: change the order of the array from smallest value to largest:
     * using the (x,y) values of an array
     * consts = current (x,y)
     * Sort the array
     * if there is a difference, re arrange the order
     **/
    if (this.getAncestors().length !== 0) {
      const graph = this.graph;
      const ancestor = this.getAncestors()[0];
      if (ancestor.attr("statesArrange") === "bottom" || ancestor.attr("statesArrange") === "top") {
        ancestor.attributes.embeds.sort(function (a, b) {
          return graph.getCell(a).get("position").x - graph.getCell(b).get("position").x;
        });
      } else {
        ancestor.attributes.embeds.sort(function (a, b) {
          return graph.getCell(a).get("position").y - graph.getCell(b).get("position").y;
        });
      }
    }
  }
  doubleClickHandle(cellView, evt, initRappid) {
    super.doubleClickHandle(cellView, evt, initRappid);
  }
  sizeChangeStartHandle() {
    const init = (0, shared /* getInitRappidShared */.Km)();
    if (init.graph.hasActiveBatch("undoredo")) {
      return;
    }
    if (init.graph && init.selection.collection.models[0] === this) {
      if (!init.graph.hasActiveBatch("statesSuppression") && !init.graph.hasActiveBatch("outzooming")) {
        init.getOpmModel().logForUndo(this.attributes.attrs.text.textWrap.text + " size changed");
      }
      OrXorArcs /* Arc */.l.makeThingArcsTransparent(this, (0, shared /* getInitRappidShared */.Km)(), true);
      if (this.getParent()) {
        OrXorArcs /* Arc */.l.makeThingArcsTransparent(this.getParent(), (0, shared /* getInitRappidShared */.Km)(), true);
      }
    }
  }
  sizeChangeStopHandle() {
    const init = (0, shared /* getInitRappidShared */.Km)();
    if (init.graph) {
      if (init.graph.hasActiveBatch("undoredo")) {
        return;
      }
      this.autosize(init);
      OrXorArcs /* Arc */.l.redrawAllArcs(this, (0, shared /* getInitRappidShared */.Km)(), true);
      if (this.getParent()) {
        this.getParent().sizeChangeStopHandle();
      }
    }
  }
  /**
   * Alon: Position for halo settings
   * @param cell
   */
  setHaloPosition(cell) {
    // console.log(init.opmModel.getVisualElementById(cell.id).refineable);
    // --------------------------------------------------
    // Handles element = where the buttons are
    // Original dimensions
    // bottom: 0;
    // left: -118px;
    // right: 0;
    // top: -105px;
    // Bottom right dimensions
    // bottom: 105px;
    // left: 55px;
    // right: 160px;
    // top: 14px;
    // --------------------------------------------------
    if (document.getElementsByClassName("handles")[0]) {
      const handles = document.getElementsByClassName("handles")[0];
      handles.setAttribute("id", "handles");
      const halo = document.getElementById("handles");
      if (cell.attributes.position.x < 155) {
        const x = cell.getBBox().width;
        const y = cell.getBBox().height;
        const toggleX = 10.5;
        const toggleY = 12.5;
        halo.style.left = x - 41 + "px";
        halo.style.top = y - 36 + "px";
        if (document.getElementsByClassName("pie-toggle nw")[0]) {
          const toggleC = document.getElementsByClassName("pie-toggle nw")[0];
          toggleC.setAttribute("id", "toggleClose");
          const toggleClose = document.getElementById("toggleClose");
          toggleClose.style.left = x + toggleX + "px";
          toggleClose.style.top = y + toggleY + "px";
        }
      }
      if (cell.attributes.position.x > 155) {
        halo.style.bottom = "0px";
        halo.style.left = "-118px";
        halo.style.right = "0px";
        halo.style.top = "-105px";
        if (document.getElementsByClassName("pie-toggle nw open")[0]) {
          const toggle = document.getElementsByClassName("pie-toggle nw open")[0];
          toggle.setAttribute("id", "toggleOpen");
          const toggleOpen = document.getElementById("toggleOpen");
          toggleOpen.style.left = "-66px";
          toggleOpen.style.bottom = "0px";
          toggleOpen.style.right = "0px";
          toggleOpen.style.top = "-55px";
        }
        if (document.getElementsByClassName("pie-toggle nw")[0]) {
          const toggleC = document.getElementsByClassName("pie-toggle nw")[0];
          toggleC.setAttribute("id", "toggleClose");
          const toggleClose = document.getElementById("toggleClose");
          toggleClose.style.left = "-66px";
          toggleClose.style.bottom = "0px";
          toggleClose.style.right = "0px";
          toggleClose.style.top = "-55px";
        }
      }
    }
  }
  //Alon: Checks and removes brackets, braces, and parentheses from the beginning of a text that's being evaluated
  checkForEnclosurGlyphs(wordArr) {
    for (let i = 0; i < wordArr.length; i++) {
      if (wordArr[i][0] === "[" || wordArr[i][0] === "{" || wordArr[i][0] === "(") {
        //  && (wordArr[i][wordArr.length-1] === ']' || wordArr[i][wordArr.length-1] === '}' || wordArr[i][wordArr.length-1] === ')') ){
        wordArr[i] = wordArr[i].substr(1).slice(0, wordArr[i].length - 1);
      }
    }
    return wordArr;
  }
  openMenu(cellView) {
    const menu = ["<div id=\"spellCheckMenu\" style=\"position: absolute; top: -19px;  background: grey;  width: 44px; height:23px;\"><button class=\"ignoreSpellcheck\" style=\"color:white; font-size: 12px; width: 44px; height:23px; \"><i>ignore<i></button></div>"];
    const menuEvents = {
      "click .ignoreSpellcheck": function () {
        cellView.el.style.textDecoration = "none";
        this.remove();
      }
    };
    (0, shared /* popupGenerator */.sk)(cellView.el, menu, menuEvents).render();
    const popup = document.getElementsByClassName("joint-popup ")[0];
    if (popup) {
      popup.setAttribute("id", "spellCheckPopUp");
      const popupElement = document.getElementById("spellCheckPopUp");
      popupElement.style.backgroundColor = "transparent";
      popupElement.style.border = "none";
    }
    (0, shared /* popupInputsEnterListener */.kw)();
  }
  setPorts(side) {
    let port;
    let outgoingFundamantalLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    }).filter(link => link.getTargetElement()?.constructor.name === "TriangleClass");
    if (outgoingFundamantalLinks.length === 1 && outgoingFundamantalLinks[0].get("source").port) {
      port = side === "right" ? 12 : 27;
    }
    if (outgoingFundamantalLinks.length > 1) {
      if (!outgoingFundamantalLinks[0].get("source").port) {
        const initRappid = (0, shared /* getInitRappidShared */.Km)();
        let linkView;
        if (initRappid.paper) {
          linkView = initRappid.paper.findViewByModel(outgoingFundamantalLinks[0]);
        }
        if (!linkView) {
          return;
        }
        const point = linkView.getPointAtLength(0.01);
        const src = linkView.model.getSourceElement();
        if (this.constructor.name.includes("State")) {
          outgoingFundamantalLinks[0].set({
            source: {
              id: this.id,
              port: side === "right" ? 12 : 27
            }
          });
        } else {
          outgoingFundamantalLinks[0].set({
            source: {
              id: this.id,
              port: src.findClosestEmptyPort(point)
            }
          });
        }
      }
      for (let i = 0; i < outgoingFundamantalLinks.length; i++) {
        if (outgoingFundamantalLinks.length > 1 && outgoingFundamantalLinks.length <= 4) {
          if (i === 1) {
            port = side === "right" ? 11 : 26;
          } else if (i === 2) {
            port = side === "right" ? 12 : 27;
          } else if (i === 3) {
            port = side === "right" ? 10 : 29;
          }
        }
      }
    }
    while (port && !this.isPortEmpty(port)) {
      port = this.getNextPort(port);
    }
    return port;
  }
  getNextPort(port) {
    if (port === 30) {
      return 1;
    }
    return port + 1;
  }
  toggleAutoFormat(init) {
    const ret = this.getVisual().logicalElement.toggleAutoFormat();
    if (ret.isAutoFormat == true) {
      this.updateSiblings(this.getVisual(), init);
    }
  }
  isPortEmpty(port) {
    const connectedLinks = this.graph.getConnectedLinks(this, {
      outbound: true
    });
    for (const link of connectedLinks) {
      const source = link.get("source");
      if (source.port && source.port === port) {
        return false;
      }
    }
    return true;
  }
  //TODO:Alon
  getIconsForHalo() {
    return {
      remove: "assets/SVG/delete.svg"
    };
  }
  //TODO:Alon
  getHaloAttrs(handles) {
    const handleArray = [];
    handles.forEach(action => {
      handleArray.push({
        attrs: this.getEntityHaloAttributes(action),
        icon: this.getIconsForHalo()[`${action}`],
        name: action
      });
    });
    return handleArray;
  }
  //TODO:Alon
  drawHalo(handleArray, halo) {
    handleArray.forEach(handleInArray => {
      halo.addHandle({
        name: handleInArray.name,
        icon: handleInArray.icon,
        attrs: handleInArray.attrs
      });
    });
  }
  removeAction(visual, init, removeOnlyLocaly = false) {
    if (!visual.canBeRemoved()) {
      (0, shared /* validationAlert */.iW)("The selected element cannot be removed to maintain model consistency.\nThe thing may be refined and this should be removed first.", 3500, undefined, true);
    } else {
      init.showRemoveOptions(this, removeOnlyLocaly);
    }
  }
  isComputational() {}
  updateSiblings(visual, init) {
    this.graph.startBatch("ignoreAddEvent");
    // this.graph.startBatch('ignoreEvents');
    this.graph.startBatch("ignoreChange");
    const logical = visual.logicalElement;
    for (const v of visual.logicalElement.opmModel.currentOpd.visualElements) {
      if (v.logicalElement === visual.logicalElement && this.graph.getCell(v.id)) {
        const cell = this.graph.getCell(v.id);
        cell.updateView(v);
        const cellView = cell.findView(init.paper);
        if (cellView) {
          cellView.resize();
        }
        if (init && cell.getParent()) {
          cell.getParent().shiftEmbeddedToEdge(init);
        }
        cell.setText(v.getDisplayText());
        if (init) {
          cell.autosize(init);
        }
      }
    }
    this.graph.stopBatch("ignoreAddEvent");
    // this.graph.stopBatch('ignoreEvents');
    this.graph.stopBatch("ignoreChange");
  }
  updateView(visual) {
    this.setText(visual.getDisplayText());
    this.greyOutEntity();
  }
  closeTextEditor(init) {
    super.closeTextEditor(init);
    if (init.textEditor) {
      const logical = init.getOpmModel().getLogicalElementByVisualId(this.id);
      if (logical) {
        logical.updateTextFromView(this.getText());
        this.updateTextFromModel(logical);
      }
      init.textEditor.remove();
      init.textEditor = null;
    }
  }
  /**
   * default style settings should be according to the organization (it will be overridden by the user's if exist)
   * */
  setRelevantStyleSettings(styleSettingsToUpdate, oplService) {
    Object.keys(styleSettingsToUpdate).forEach(function (key) {
      if (oplService.orgOplSettings.hasOwnProperty(key) && oplService.orgOplSettings[key] !== undefined && oplService.orgOplSettings[key] !== null) {
        styleSettingsToUpdate[key] = oplService.orgOplSettings[key];
      }
    });
    Object.keys(styleSettingsToUpdate).forEach(function (key) {
      if (oplService.settings.hasOwnProperty(key) && oplService.settings[key] !== undefined && oplService.settings[key] !== null) {
        styleSettingsToUpdate[key] = oplService.settings[key];
      }
    });
  }
  bringRangeTypeElementToOpd(initRappid, logicalRangeObject, visual, opd) {
    return initRappid.opmModel.bringRangeTypeElementToOpd(logicalRangeObject, visual, opd);
  }
  getToolbarHandles(initRappid) {
    return [];
  }
}
/***/