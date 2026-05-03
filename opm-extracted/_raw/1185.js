// EXPORTS

// UNUSED EXPORTS: MsgType, checkForSpecialCharOrDigit, createColorsObject, createGroup, createRangeObject, createSelection, createTextContentObject, dialogFunctionality, edxSubmitText, getRandomArbitrary, getSelect, jquery, removeTagsFromString, select_, showMapButton, warningMsgStyle, xorDistance

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = require("./73308.js");
; // CONCATENATED MODULE: ./src/app/configuration/rappidEnviromentFunctionality/inspector/opmStyle.ts
const opmStyle_opmStyle = {
  inspectorFont: {
    colorPalette: [{
      content: "#feb663"
    }, {
      content: "#fe854f"
    }, {
      content: "#b75d32"
    }, {
      content: "#31d0c6"
    }, {
      content: "#7c68fc"
    }, {
      content: "#61549C"
    }, {
      content: "#6a6c8a"
    }, {
      content: "#4b4a67"
    }, {
      content: "#3c4260"
    }, {
      content: "#33334e"
    }, {
      content: "#222138"
    }, {
      content: "#DCDCDC"
    }, {
      content: "#006400"
    }, {
      content: "#00008B"
    }, {
      content: "black"
    }, {
      content: "grey"
    }, {
      content: "#f2f2f2"
    }],
    fontWeight: [{
      value: "300",
      content: "<span style=\"font-weight: 300\">Light</span>"
    }, {
      value: "Normal",
      content: "<span style=\"font-weight: Normal\">Normal</span>"
    }, {
      value: "Bold",
      content: "<span style=\"font-weight: Bolder\">Bold</span>"
    }],
    fontFamily: [{
      value: "Alegreya Sans",
      content: "<span style=\"font-family: Alegreya Sans\">Alegreya Sans</span>"
    }, {
      value: "Averia Libre",
      content: "<span style=\"font-family: Averia Libre\">Averia Libre</span>"
    }, {
      value: "Roboto Condensed",
      content: "<span style=\"font-family: Roboto Condensed\">Roboto Condensed</span>"
    }],
    strokeWidth: [{
      value: 1,
      content: "<div style=\"background:#fff;width:2px;height:30px;margin:0 14px;border-radius: 2px;\"/>"
    }, {
      value: 2,
      content: "<div style=\"background:#fff;width:4px;height:30px;margin:0 13px;border-radius: 2px;\"/>"
    }, {
      value: 4,
      content: "<div style=\"background:#fff;width:8px;height:30px;margin:0 11px;border-radius: 2px;\"/>"
    }, {
      value: 8,
      content: "<div style=\"background:#fff;width:16px;height:30px;margin:0 8px;border-radius: 2px;\"/>"
    }]
  }
};
// EXTERNAL MODULE: ./node_modules/rxjs/dist/esm/internal/observable/interval.js
var observable_interval = require("./32928.js");
; // CONCATENATED MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts

const jquery = require("./83152.js");
export const _ = require("./36651.js");
export const RE = 10;
export const FP = require("./56910.js");
export const hN = require("./56910.js");
export const lC = require("./56910.js");
export let i1;
let select_;
let showMapButton = false;
export const C6 = require("./3534.js");
const xorDistance = 10;
export function LU(select) {
  select_ = select;
}
function getSelect() {
  return select_;
}
export function QX() {
  return showMapButton;
}
export function eu(button) {
  showMapButton = button;
}
/**
 * an enum representing possible message types
 * */
var MsgType = /*#__PURE__*/function (MsgType) {
  MsgType.ERROR = "ERROR";
  MsgType.SUCCESS = "SUCCESS";
  MsgType.WARNING = "WARNING";
  MsgType.URL = "URL";
  MsgType.ALERT = "ALERT";
  MsgType.SHARE = "SHARE";
  MsgType.REDWARNING = "REDWARNING";
  return MsgType;
}(MsgType || {});
/**
 * Yael:
 * @param type- the string that represents the type of the message
 * */
function stringToMassage(type) {
  if (!type) {
    return MsgType.WARNING;
  }
  const msgType = MsgType[type.toUpperCase()];
  if (msgType) {
    return msgType;
  } else {
    return MsgType.WARNING;
  }
}
/**
 * Launches flash alert of joint.
 * @param errorMessage - may also be a success message. dependingon how it starts.
 * @param {number} closeDelay. Optional, default to 2.5 seconds. If <=0, then it is modal and requires explicit close.
 * @param {string} type. Optional, default to 'alert'. If positive - set it to 'success'.
 * @param {boolean} force
 */
export function iW(errorMessage, closeDelay = 4000, type, force) {
  const modal = closeDelay <= 0;
  if (errorMessage) {
    const wordsNumber = errorMessage.split(" ").length;
    closeDelay = Math.max(closeDelay, wordsNumber / 4 * 1000);
    closeDelay = Math.round(closeDelay / 1000) * 1000;
    closeDelay = Math.max(closeDelay, 4000);
    const msgType = stringToMassage(type);
    if (msgType === MsgType.SUCCESS || msgType === MsgType.ERROR) {
      setMsgStyle(errorMessage, msgType, closeDelay);
      return;
    } else if (msgType === MsgType.URL) {
      setStyleForCopyUrl(errorMessage);
      return;
    }
    const errorBox = new FP.ui.FlashMessage({
      title: "",
      type: type,
      closeAnimation: modal ? undefined : {
        delay: closeDelay
      },
      model: modal,
      content: errorMessage,
      height: "400px"
    });
    errorBox.open();
    errorBox.onRemove = function () {
      for (const msg of $(".fg")) {
        msg.style.top = Number(msg.style.top.substring(0, msg.style.top.length - 2)) + 5 + "px";
      }
    };
    setStyleforFlashMsg(type, errorBox.el);
    let i = 0;
    const padding = 10;
    for (const msg of $(".fg")) {
      msg.style.top = 120 + (83 + padding) * i + "px";
      i++;
    }
  }
}
/******
 *Yael: this function closes ShareModel window and makes sure that the interval subscriber is unsubscribe
 * @param subscribe a subscriber to an interval observable
 */
function closeShareModelDiv(subscribe) {
  document.getElementById("shareModelDiv").remove();
  if (subscribe != null) {
    subscribe.unsubscribe();
  }
}
function setStyleForCopyUrl(msg) {
  const div = document.createElement("div");
  const source = (0, observable_interval /* interval */.Y)(1000);
  let subscribe = null;
  div.setAttribute("id", "shareModelDiv");
  div.style.zIndex = "1";
  div.insertAdjacentHTML("afterbegin", `
      <span id='flashMsgtext' xmlns="http://www.w3.org/1999/html">
        <h2 id='alertHeader'>Share Model </h2>
        <div id='alertTextArea'><input type='text' autofocus id='alertInput'></div>
        <br><br>
        <button id='shareModelBTN'>Copy</button>
        <span>
            <button id="modelPermissions">Edit Model Permissions</button>
            <input type='checkbox' id='sharedModelSwitch' value='withOPD'>
            <label for='sharedModelSwitch'>Include OPD in URL</label><br>
        </span>
        <span id='shareModelText'> Anyone with this link may view the model</span>
      </span>
      <div id="url-opd-option-check-box">
      </div>
      <div id='exit-button-shared'>
        <svg id='exitButtonClick' width='10' height='13' viewBox='0 0 10 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
           <path d='M9.54 1L1 12M1 1L9.54 12' stroke='#586D8C'/>
        </svg>
      </div>`);
  const node = document.createTextNode("");
  div.appendChild(node);
  const body = document.getElementById("body");
  body.appendChild(div);
  const textToCopy = msg;
  const urlToCopy = document.getElementById("alertInput");
  const opdSwitch = document.getElementById("sharedModelSwitch");
  opdSwitch.checked = false;
  const message = msg.split("|||");
  const withOPD = message[0] + "/" + message[1];
  const withoutOPD = message[0];
  urlToCopy.value = withoutOPD;
  $("#exitButtonClick").click(() => {
    closeShareModelDiv(subscribe);
  });
  $("#sharedModelSwitch").click(() => {
    urlToCopy.value = opdSwitch.checked ? withOPD : withoutOPD;
  });
  $("#modelPermissions").click(() => {
    $("#settingBtn").click();
  });
  $("#shareModelBTN").click(() => {
    $(".enterHandle").remove();
    // urlToCopy.value = textToCopy;
    urlToCopy.select();
    document.execCommand("copy");
    document.getElementById("alertInput").remove();
    document.getElementById("alertTextArea").remove();
    document.getElementById("shareModelBTN").remove();
    document.getElementById("shareModelText").remove();
    document.getElementById("sharedModelSwitch").remove();
    document.getElementById("flashMsgtext").remove();
    document.getElementById("exit-button-shared").remove();
    div.insertAdjacentHTML("afterbegin", "<span id='flashMsgtext'><h2 id='alertHeader'>Share Model </h2> \n<div  id=\"afterCopytext\"> Model link copied to clipboard </div>\n<button id=\"aftercopyBTN\"> <span id=\"CloseBTNText\"> Close <a id=\"CounterNumberShare\">3</a></span></p></button></span>");
    div.setAttribute("class", "enterHandle");
    subscribe = source.subscribe(val => countdown("shareModelDiv", 3 - val - 1, subscribe, "CounterNumberShare"));
    $("#aftercopyBTN").click(function () {
      closeShareModelDiv(subscribe);
    });
  });
}
/**
 * Yael:
 * this function adds a seconds counter to a pop-up window that is going to get closed
 * @param idToDelete- the id of the element to be deleted
 * @param val- the value to be inserted- num seconds left
 * @param subscribed- keeps a subscribed object return value, so at the end of the time we could unsubscribe it.
 * @param counterNumberId- the counter tag id according to the message
 * */
function countdown(idToDelete, val, subscribed, counterNumberId) {
  const count = document.getElementById(counterNumberId);
  if (count) {
    count.innerHTML = val.toString();
    if (parseInt(count.innerHTML) <= 0) {
      if (document.getElementById(idToDelete.toString())) {
        document.getElementById(idToDelete.toString()).remove();
        if (subscribed != null) {
          subscribed.unsubscribe();
        }
      }
    }
  }
}
/**
 * Yael: displays the popup message
 * @param msg= the message to be read
 * @param msgType (enum)
 * @timeLimit= the time that the message window should be seen (default is 5 seconds)
 */
function setMsgStyle(msg, msgType, timeLimit = 5000) {
  if (!document.getElementById("alertDiv")) {
    const source = (0, observable_interval /* interval */.Y)(1000);
    const subscribe = source.subscribe(val => countdown("alertDiv", timeLimit / 1000 - val - 1, subscribe, "CounterNumber"));
    const div = document.createElement("div");
    div.setAttribute("id", "alertDiv");
    div.setAttribute("class", "enterHandle");
    let idHeader = "alertHeader";
    idHeader = msgType === MsgType.ERROR ? idHeader + "Error" : idHeader;
    div.insertAdjacentHTML("afterbegin", "<div id='flashMsgtext'><h2 id=" + idHeader + ">" + msgType + "!! </h2> \n<p id=\"alertParagraph\"> </p>\n<br><br><button id=\"alertBTN\"><div id=\"continueTxt\">Continue <a id=\"CounterNumber\">" + (timeLimit / 1000).toString() + " </a></div></button></span>");
    const node = document.createTextNode("");
    div.appendChild(node);
    const body = document.getElementById("body");
    body.appendChild(div);
    document.getElementById("alertParagraph").innerHTML = msg;
    const h = $("#alertBTN")[0].getClientRects()[0].top - $("#alertDiv")[0].getClientRects()[0].top + 70 + "px";
    $("#alertDiv")[0].style.height = h;
    $("#alertDiv")[0].style.zIndex = "999999999999";
    $("#alertBTN").click(function () {
      $("#alertDiv").remove();
      if (subscribe != null) {
        subscribe.unsubscribe();
      }
    });
  }
}
/**
 * Alon: shows a msg to the user when an operation was successful
 * @param msg
 * @param timeLimit - the time the window should be seen(Yael)
 */
function warningMsgStyle(msg, force = true) {
  if (!document.getElementById("alertDiv")) {
    const div = document.createElement("div");
    div.setAttribute("id", "alertDiv");
    div.setAttribute("class", "enterHandle");
    div.insertAdjacentHTML("afterbegin", "<span id='flashMsgtext'><h2 id='alertHeaderError'>Error!! </h2> \n<p id=\"alertParagraph\"> </p>\n<br><br><button id=\"cancelBTN\">Cancel</button><button id=\"okBTN\">Ok</button></span>");
    const node = document.createTextNode("");
    div.appendChild(node);
    const body = document.getElementById("body");
    body.appendChild(div);
    document.getElementById("alertParagraph").innerHTML = msg;
    const source = interval(1000);
    const subscribe = source.subscribe(val => countdown("alertDiv", 5 - val - 1, subscribe, "CounterNumberWarning"));
    $("#okBTN").click(function () {
      $("#alertDiv").remove();
      if (subscribe != null) {
        subscribe.unsubscribe();
        return true;
      }
    });
    $("#cancelBTN").click(function () {
      $("#alertDiv").remove();
      if (subscribe != null) {
        subscribe.unsubscribe();
        return true;
      }
      return false;
    });
  }
  if (force) {
    return;
  }
}
/**
 * Alon: sets the layout for error messages concerning links
 * @param msg
 */
function setStyleforFlashMsg(type, el) {
  const flashMsg = $(el).find(".body")[0];
  flashMsg.setAttribute("id", "flashMsg");
  const text = flashMsg.innerHTML;
  if (type === "REDWARNING") {
    flashMsg.style.background = "#CC0A0E";
  }
  flashMsg.innerHTML = "";
  flashMsg.insertAdjacentHTML("afterbegin", "<div id='flashMsgtext' style='top: 0px; width: calc(100% - 35px);'>" + text + "</div>");
  const closeBTN = document.getElementsByClassName("btn-close")[0];
  closeBTN.setAttribute("id", "btn-close");
  const clsBtnHtmlEl = document.getElementById("btn-close");
  $(function () {
    $("#flashMsg").hover(function () {
      setHoverAttrs(type);
    }, function () {
      resetAttrs(type);
    });
  });
  $(function () {
    $("#btn-close").hover(function () {
      setHoverAttrs(type);
    }, function () {
      resetAttrs(type);
    });
  });
}
// check char code 45, which represents '-'. In some case rappid text editor put '-' instead of \n
export function HR(text) {
  let newText = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) !== 160 && text.charCodeAt(i) !== 32 && text.charCodeAt(i) !== 10 && text.charCodeAt(i) !== 45) {
      newText = newText + text.charAt(i);
    }
  }
  return newText;
}
/**
 * Alon: duplicates the edx dialog which is modal and creates a more flexible html element, one that
 * is not modal and is at our control.
 * @param title
 * @param message
 * @param remarksTitle
 * @param remarks
 */
function edxSubmitText(title, message, message_1, remarksTitle, remarks) {
  if (!document.getElementById("edxDiv")) {
    const div = document.createElement("div");
    let notEpanded = true;
    //opcloudResizeBar="top"
    div.setAttribute("id", "edxDiv");
    div.classList.add("minimized");
    // inserts the inner html of the div
    div.insertAdjacentHTML("afterbegin", "<span id='messageID'><div><button id='BtnExpand'>+</button><button id='alertBTN1'>x</button></div><h2 id='alertHeader1'></h2> \n<p id=\"alertParagraph1\"> </p><p id=\"alertParagraph2\" style=\"white-space: pre-line\"> </p>\n<h2 id=\"head2\"></h2><p id=\"p2\" style=\"white-space: pre-line\"></p><br></span>");
    // makes the div appear on screen
    const node = document.createTextNode("");
    div.appendChild(node);
    const body = document.getElementById("body");
    body.appendChild(div);
    // sets the title/ text of the div
    document.getElementById("alertHeader1").innerHTML = title;
    document.getElementById("alertParagraph1").innerHTML = message;
    document.getElementById("alertParagraph2").innerHTML = message_1 + "\n";
    document.getElementById("head2").innerHTML = remarksTitle;
    document.getElementById("p2").innerHTML = remarks + "\n";
    // closes(remove the message div
    $("#alertBTN1").click(function () {
      $("#edxDiv").remove();
    });
    //toggle minimize/expand
    $("#BtnExpand").click(function () {
      $("#edxDiv").removeAttr("style");
      if ($("#edxDiv").hasClass("minimized")) {
        div.classList.remove("minimized");
      }
      if (notEpanded) {
        div.classList.remove("minimized");
        div.classList.toggle("expanded");
        document.getElementById("BtnExpand").innerHTML = "-";
      } else if (!notEpanded) {
        div.classList.remove("expanded");
        div.classList.toggle("minimized");
        document.getElementById("BtnExpand").innerHTML = "+";
      }
      notEpanded = !notEpanded;
    });
  }
}
/**
 * Alon - sets hover over links error messages effects
 */
function setHoverAttrs(type) {
  $("#flashMsgtext").css("color", "#78A8F1");
  $("#btn-close").css("color", "#78A8F1");
  $("#flashMsg").css("background", type === "REDWARNING" ? "#CC0A0E" : "rgba(9, 21, 39, 0.88)");
}
/**
 * Alon - Resets the hover over links error messages effects
 */
function resetAttrs(type) {
  $("#flashMsgtext").css("color", "#ffffff");
  $("#btn-close").css("color", "rgba(255, 255, 255, 0.49)");
  $("#flashMsg").css("background", type === "REDWARNING" ? "#CC0A0E" : "rgba(26, 55, 99, 0.88)");
}
// Function CreateSelection. Gets selection type (select or select-box), selection label,
// in which inspector group it should be and the index.
// The function defines options object for selection according to the label.
// The function return selection object.
function createSelection(selectionType, selectionOptions, selectionLabel, selectionGroup, selectionIndex, selectionDefault = "") {
  return {
    type: selectionType,
    label: selectionLabel,
    defaultValue: selectionDefault,
    options: selectionOptions,
    group: selectionGroup,
    index: selectionIndex
  };
}
// Function CreateColorsObject. Gets label and index and generate a color-plate object in Styling group
function createColorsObject(colorsLabel, colorsIndex) {
  return {
    type: "color-palette",
    options: opmStyle.inspectorFont.colorPalette,
    label: colorsLabel,
    group: "styling",
    index: colorsIndex
  };
}
// Function CreateRangeObject gets minimum and maximum values (default 10 and 40), label and index and generates a range object.
function createRangeObject(minValue = 10, maxValue = 40, rangeLabel, rangeIndex) {
  return {
    type: "range",
    min: minValue,
    max: maxValue,
    step: 1,
    unit: "px",
    label: rangeLabel,
    group: "styling",
    index: rangeIndex
  };
}
// Function CreateTextContentObject gets text label, text group and index and generates a text box object.
function createTextContentObject(textLabel, textGroup, textIndex) {
  return {
    type: "content-editable",
    label: textLabel,
    group: textGroup,
    index: textIndex
  };
}
// Function createGroup. Get the name of the group, its index and if it should be collapsed and generates a group object
function createGroup(labelName, indexNumber, isClosed = false) {
  return {
    label: labelName,
    index: indexNumber,
    closed: isClosed
  };
}
export function sk(target, content, events) {
  return new FP.ui.Popup({
    events: events,
    content: content,
    target: target
  });
} // adds listener to inputs in popup - if the user's keyup is Enter -> update the lables.
export function kw() {
  for (const inputField of $(".PopupInput")) {
    inputField.addEventListener("keyup", function ($event) {
      if ($event.key === "Enter" && $(".btnUpdate")[0]) {
        $(".btnUpdate")[0].click();
      }
    });
  }
} // returns true if value is a number, otherwise false
export function Et(value) {
  return !isNaN(Number(value.toString()));
}
/**
 * Alon - need refactor
 * @param thingType
 * @returns {{fill: string; stroke: string; textfill: string; textSise: string; fontfamily: string}}
 */
export function $f(thingType) {
  let thingStyles;
  return thingStyles = {
    fill: thingType === "opm.Note" ? "#fff7d1" : "white",
    // in case of a note, make default fill color #FFFC7F
    stroke: thingType === "opm.Process" ? "#3BC3FF" : thingType === "opm.Object" ? "#70E483" : thingType === "opm.Note" ? "1C00ff00" : "#808000",
    textfill: "black",
    textSise: "14",
    fontfamily: "Roboto, \"Helvetica Neue\", sans-serif"
  };
}
function dialogFunctionality() {}
export function it(sd, init, target) {
  const node = init.treeViewService.treeView.treeModel.getNodeById(sd);
  if (node) {
    for (const p of node.path) {
      init.treeViewService.treeView.treeModel.getNodeById(p).expand();
    }
  }
  if (node && !node.isActive) {
    init.treeViewService.treeView.treeModel.getNodeById(sd).toggleActivated();
    init.treeViewService.treeView.treeModel.getNodeById(sd).parent.expand();
    init.setSelectedElementToNull();
    try {
      const htmlTree = $(".opcloud-opd-tree")[0];
      const selectedNode = $(".seletcedOpdNode")[0];
      if (target || selectedNode) {
        htmlTree.scrollTo(0, (target || selectedNode).offsetTop - 20);
      }
    } catch (err) {}
  }
}
function getRandomArbitrary(min, max) {
  return Math.trunc(Math.random() * (max - min) + min);
}
function checkForSpecialCharOrDigit(wordArr) {
  const regExpression = new RegExp("/\\s|[0-9_]|\\W|[#$%^&*()]/g, \"\"");
  for (let word of wordArr) {
    let arr = Array.from(word);
    if (regExpression.test(arr[arr.length - 1])) {
      return true;
    }
  }
  return false;
}
export function We(init) {
  i1 = init;
}
export function Km() {
  return i1;
}
export function Sp() {
  const tb = $(".elemToolBar")[0];
  const newWidth = window.innerWidth - $(".sd-tree-menu")[0].getClientRects()[0].width + "px";
  tb.style.width = newWidth;
  const isOplAtBottom = !!$("#oplFullScreen")[0] && $("#oplFullScreen")[0].getClientRects()[0].left !== 0;
  if (isOplAtBottom && $("#oplContainerBottom")[0]) {
    $("#oplContainerBottom")[0].style.width = newWidth;
    $(".sd-content")[0].style.marginLeft = $(".sd-tree-menu")[0].getClientRects()[0].width - 260 + "px";
  }
}
export function D$(cell, initRappidService, params) {
  const graph = initRappidService.graph;
  graph.startBatch("removeCellOperation");
  cell.remove();
  graph.stopBatch("removeCellOperation");
}
export function vN(arr) {
  return Array.from(new Set(arr));
}
export function Lt(point1, point2) {
  if (!point1.x || !point1.y || !point2.x || !point2.y) {
    return 9999999999999;
  }
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}
export function O0(movePopupDown = false, hideTriangle = true, transparency = true) {
  const ppup = document.getElementsByClassName("joint-popup joint-theme-modern")[0];
  if (!ppup) {
    return;
  }
  ppup.style.borderColor = "#d6d6d6";
  if (movePopupDown) {
    ppup.style.top = String(Number(ppup.style.top.substr(0, ppup.style.top.length - 2)) + 20) + "px";
  }
  if (transparency) {
    ppup.style.background = "rgba(251, 251, 251, 0.91)";
  } else {
    ppup.style.background = "rgba(251, 251, 251, 1)";
  }
  ppup.style.boxShadow = "0px 2px 4px rgba(198, 198, 198, 0.64)";
  ppup.style.fontFamily = "Roboto, \"Helvetica Neue\", sans-serif";
  ppup.style.fontWeight = "300";
  ppup.style.fontSize = "16px";
  ppup.style.color = "#1a3763";
  // this line hides the ugly triangle at the top of the popup
  if (hideTriangle) {
    $(".joint-popup").addClass("noBefore");
  }
}
export function Uv() {
  const tb = document.getElementsByClassName("joint-context-toolbar")[0];
  tb.style.borderColor = "#d6d6d6";
  tb.style.background = "rgba(251, 251, 251, 0.91)";
  tb.style.boxShadow = "0px 2px 4px rgba(198, 198, 198, 0.64)";
  tb.style.fontFamily = "Roboto, \"Helvetica Neue\", sans-serif";
  tb.style.fontWeight = "300";
  tb.style.fontSize = "16px";
  tb.style.color = "#1a3763";
  tb.style.maxWidth = "360px"; // For 6 computational functions, 3 in each row
  tb.style.left = parseFloat(tb.style.left) + 240 + "px"; // Half the distance of a row to align it to center
}
export function EQ() {
  const tb = document.getElementsByClassName("tools")[0];
  tb.style.borderColor = "#d6d6d6";
  tb.style.borderRadius = "3px";
  tb.style.background = "rgba(251, 251, 251, 0.91)";
  tb.style.boxShadow = "0px 2px 4px rgba(198, 198, 198, 0.64)";
  tb.style.fontFamily = "Roboto, \"Helvetica Neue\", sans-serif";
  tb.style.fontWeight = "300";
  tb.style.fontSize = "16px";
  tb.style.color = "#1a3763";
  tb.firstElementChild.style.borderRadius = "3px";
  tb.lastElementChild.style.borderRadius = "3px";
}
export const Cn = 400; // export function setLongTouchListener(htmlElement, actionFunction, args = {} , duration = 400) {
//   let firstTime, secondTime;
//   htmlElement.on({
//     touchstart : function() {
//       firstTime = new Date().getTime();
//     },
//     touchend: function() {
//       secondTime = new Date().getTime();
//       if (secondTime - firstTime > duration) {
//         console.log('it worked!');
//         actionFunction(args);
//       }
//     }
//   });​
//
// }
function fixCopiedElementsAfterUndoRedo(init) {
  init.clipboard.copied = init.clipboard.copied?.map(vis => init.opmModel.getVisualElementById(vis?.id)).filter(v => !!v) || [];
}
export function ad() {
  if (!i1 || i1.isDSMClusteredView.value === true) {
    return;
  }
  FP.ui.Halo.clear(i1.paper);
  i1.setSelectedElementToNull();
  FP.ui.FreeTransform.clear(i1.paper);
  const opdId = i1.getOpmModel().currentOpd.id;
  const ret = i1.getOpmModel().undo();
  if (ret) {
    i1.getGraphService().loadLogOfUndoRedo(ret, opdId);
    fixCopiedElementsAfterUndoRedo(i1);
    if (i1.elementToolbarReference) {
      i1.setSelectedElementToNull();
      i1.elementToolbarReference.selected = undefined;
      i1.elementToolbarReference.onSelection();
      i1.graph.getCells().forEach(c => {
        if (e2.isInstanceOfDrawnThing(c)) {
          c.removeDuplicationMarkWhenNoDuplicats(i1);
        }
      });
    }
    i1.criticalChanges_.next(true);
  }
}
export function Up() {
  if (!i1) {
    return;
  }
  FP.ui.Halo.clear(i1.paper);
  i1.setSelectedElementToNull();
  FP.ui.FreeTransform.clear(i1.paper);
  const opdId = i1.getOpmModel().currentOpd.id;
  const ret = i1.getOpmModel().redo();
  if (ret) {
    i1.getGraphService().loadLogOfUndoRedo(ret, opdId);
    fixCopiedElementsAfterUndoRedo(i1);
    if (i1.elementToolbarReference) {
      i1.setSelectedElementToNull();
      i1.elementToolbarReference.selected = undefined;
      i1.elementToolbarReference.onSelection();
      i1.graph.getCells().forEach(c => {
        if (e2.isInstanceOfDrawnThing(c)) {
          c.removeDuplicationMarkWhenNoDuplicats(i1);
        }
      });
    }
    i1.criticalChanges_.next(true);
  }
}
export function Zc(_x) {
  return _checkImageURL.apply(this, arguments);
}
function _checkImageURL() {
  _checkImageURL = (0, asyncToGenerator /* default */.A)(function* (url) {
    const image = new Image();
    return new Promise((res, rej) => {
      image.onload = function () {
        if (image.width * image.height) {
          res();
        } else {
          rej();
        }
      };
      image.onerror = () => rej();
      image.src = url;
    });
  });
  return _checkImageURL.apply(this, arguments);
}
export function vG(ent) {
  if (ent.constructor.name.includes("Object")) {
    return "#00b050";
  } else if (ent.constructor.name.includes("Process")) {
    return "#0070c0";
  } else if (ent.constructor.name.includes("State")) {
    return "#808000";
  }
}
export function Cp(arr) {
  if (arr.length <= 2) {
    if (arr.length === 2) {
      return [arr, [arr[1], arr[0]]];
    } else {
      return arr;
    }
  }
  return arr.reduce((acc, item, i) => acc.concat(Cp([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])), []);
}
export function Uz(path1, path2) {
  const Intersect = (p1, p2) => {
    return p1.z !== p2.z && p1.x === p2.x && p1.y === p2.y;
  };
  const paths = [path1, path2];
  const pathLength = [path1.length(), path2.length()];
  const pathPoints = [];
  const inters = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < pathLength[i]; j++) {
      const p = paths[i].pointAtLength(j);
      p.z = i;
      p.x = Math.round(p.x);
      p.y = Math.round(p.y);
      pathPoints.push(p);
    }
  }
  pathPoints.sort((a, b) => a.x != b.x ? a.x - b.x : a.y != b.y ? a.y - b.y : 0).forEach((a, i, m) => i && Intersect(m[i - 1], a) ? inters.push([a.x, a.y]) : 0);
  return inters;
}
export function ID(arg) {
  const params = {
    title: "",
    type: "Url",
    closeAnimation: false
  };
  if (arg.allowed) {
    params.content = arg.url;
  } else {
    params.content = `No saved project for this model.<br>
        Save this model or load an existing one first.`;
    params.type = "Error";
  }
  iW(params.content, null, params.type);
}
export const e2 = {
  isInstanceOfVisualProcess(item) {
    return item && item.constructor.name.includes("VisualProcess");
  },
  isInstanceOfVisualObject(item) {
    return item && item.constructor.name.includes("VisualObject");
  },
  isInstanceOfVisualState(item) {
    return item && item.constructor.name.includes("VisualState");
  },
  isInstanceOfVisualThing(item) {
    return item && (item.constructor.name.includes("VisualObject") || item.constructor.name.includes("VisualProcess"));
  },
  isInstanceOfVisualEntity(item) {
    return item && (item.constructor.name.includes("VisualObject") || item.constructor.name.includes("VisualProcess") || item.constructor.name.includes("VisualState"));
  },
  isInstanceOfLogicalThing(item) {
    return item && (item.constructor.name.includes("LogicalObject") || item.constructor.name.includes("LogicalProcess"));
  },
  isInstanceOfLogicalEntity(item) {
    return item && this.isInstanceOfLogicalState(item) || this.isInstanceOfLogicalThing(item);
  },
  isInstanceOfLogicalProcess(item) {
    return item && item.constructor.name.includes("LogicalProcess");
  },
  isInstanceOfDrawnProcess(item) {
    return item && item.constructor.name.includes("OpmProcess");
  },
  isInstanceOfDrawnObject(item) {
    return item && item.constructor.name.includes("OpmObject");
  },
  isInstanceOfDrawnState(item) {
    return item && item.constructor.name.includes("OpmState");
  },
  isInstanceOfDrawnThing(item) {
    return item && (item.constructor.name.includes("OpmObject") || item.constructor.name.includes("OpmProcess"));
  },
  isInstanceOfDrawnEntity(item) {
    return item && (item.constructor.name.includes("OpmObject") || item.constructor.name.includes("OpmProcess") || item.constructor.name.includes("OpmState"));
  },
  isInstanceOfDrawnTriangle(item) {
    return item && item.constructor.name.includes("Triangle");
  },
  isInstanceOfLogicalState(item) {
    return item && item.constructor.name.includes("LogicalState");
  },
  isInstanceOfLogicalObject(item) {
    return item && item.constructor.name.includes("LogicalObject");
  },
  isInstanceOfDrawnSemiFoldedFundamental(item) {
    return item && item.constructor.name.includes("OpmSemifoldedFundamental");
  },
  isInstanceOfDrawnNote(item) {
    return item && item.constructor.name === "Note";
  },
  waitXms(x) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, x);
    });
  },
  showGIF($event, handlerGif = "", isOnHalo = false, force = false, showAfterXms = 3000) {
    setTimeout(() => {
      if (handlerGif === "" || !Object.values(document.querySelectorAll(":hover")).includes($event.target)) {
        return;
      }
      if (!force && !Km().oplService.settings.tutorialMode) {
        return;
      }
      const explanationDiv = document.createElement("div");
      explanationDiv.className = "explanationDiv";
      explanationDiv.style.width = "300px";
      explanationDiv.style.backgroundColor = "#ffffff00";
      explanationDiv.style.position = isOnHalo ? "absolute" : "fixed";
      explanationDiv.style.display = "inline-block";
      let topFix = 0;
      let leftFix = 0;
      if (window.innerWidth - $event.x - 350 < 0) {
        leftFix = 350;
        explanationDiv.style.display = "flex";
      }
      if (window.innerHeight - $event.y - 350 < 0) {
        topFix = 350;
      }
      explanationDiv.style.marginTop = 20 - topFix + "px";
      explanationDiv.style.marginLeft = 15 - leftFix + (isOnHalo ? 100 : 0) + "px";
      explanationDiv.style.padding = "3px 3px 0px 3px";
      explanationDiv.style.zIndex = "999999999999999";
      explanationDiv.style.borderRadius = "10px";
      explanationDiv.style.filter = "drop-shadow(2px 1px 4px black)";
      if (handlerGif.startsWith("<svg")) {
        explanationDiv.innerHTML = `<div style="max-width: 300px; background: white; border-radius: 10px; padding: 10px;">${handlerGif}</div>`;
      } else {
        explanationDiv.innerHTML = `<img src='${handlerGif}' style='width: 100%; height: 100%; border-radius: 10px;' draggable='false'/>`;
      }
      $event.target.appendChild(explanationDiv);
      explanationDiv.onmouseleave = function () {
        explanationDiv.remove();
      };
    }, showAfterXms);
  },
  removeAllExplainationsDivs() {
    $(".explanationDiv").remove();
  },
  isAlphaBetic(char) {
    return !!char && char.length === 1 && /^[A-Za-z]+$/.test(char);
  },
  replaceWords(originalText, toReplace, replacement) {
    let re = new RegExp(`\\b${toReplace}\\b`, "gi");
    return originalText.replace(re, replacement);
  },
  filterArrayByType(arr, processes, objects, states) {
    const ret = [];
    for (const entity of arr) {
      if (processes && this.isInstanceOfVisualProcess(entity)) {
        ret.push(entity);
      } else if (objects && this.isInstanceOfVisualObject(entity)) {
        ret.push(entity);
      } else if (states && this.isInstanceOfVisualState(entity)) {
        ret.push(entity);
      }
    }
    return ret;
  }
};
function removeTagsFromString(string) {
  const div = document.createElement("div");
  div.innerHTML = string;
  const text = div.textContent || div.innerText || "";
  return text;
}

/***/