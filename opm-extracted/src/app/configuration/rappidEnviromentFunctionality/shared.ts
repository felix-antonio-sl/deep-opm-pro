// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts
// Extracted by opm-extracted/tools/extract.mjs


  const paddingObject = 10;

  let initRappidShared;
  let select_;
  let showMapButton = false;

  const xorDistance = 10;
  function setSelect(select) {
    select_ = select;
  }
  function getSelect() {
    return select_;
  }
  function getShowMapButton() {
    return showMapButton;
  }
  function setShowMapButton(button) {
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
  function validationAlert(errorMessage, closeDelay = 4000, type, force) {
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
      const errorBox = new joint.ui.FlashMessage({
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
    const source = (0, interval)(1000);
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
      const source = (0, interval)(1000);
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
  function textWithoutSpaces(text) {
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
  function popupGenerator(target, content, events) {
    return new joint.ui.Popup({
      events: events,
      content: content,
      target: target
    });
  }
  // adds listener to inputs in popup - if the user's keyup is Enter -> update the lables.
  function popupInputsEnterListener() {
    for (const inputField of $(".PopupInput")) {
      inputField.addEventListener("keyup", function ($event) {
        if ($event.key === "Enter" && $(".btnUpdate")[0]) {
          $(".btnUpdate")[0].click();
        }
      });
    }
  }
  // returns true if value is a number, otherwise false
  function isNumber(value) {
    return !isNaN(Number(value.toString()));
  }
  /**
   * Alon - need refactor
   * @param thingType
   * @returns {{fill: string; stroke: string; textfill: string; textSise: string; fontfamily: string}}
   */
  function getStyles(thingType) {
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
  function highlighSD(sd, init, target) {
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
  function setInitRappidShared(init) {
    initRappidShared = init;
  }
  function getInitRappidShared() {
    return initRappidShared;
  }
  function adjustToolbarSizeAndOpl() {
    const tb = $(".elemToolBar")[0];
    const newWidth = window.innerWidth - $(".sd-tree-menu")[0].getClientRects()[0].width + "px";
    tb.style.width = newWidth;
    const isOplAtBottom = !!$("#oplFullScreen")[0] && $("#oplFullScreen")[0].getClientRects()[0].left !== 0;
    if (isOplAtBottom && $("#oplContainerBottom")[0]) {
      $("#oplContainerBottom")[0].style.width = newWidth;
      $(".sd-content")[0].style.marginLeft = $(".sd-tree-menu")[0].getClientRects()[0].width - 260 + "px";
    }
  }
  function removeCell(cell, initRappidService, params) {
    const graph = initRappidService.graph;
    graph.startBatch("removeCellOperation");
    cell.remove();
    graph.stopBatch("removeCellOperation");
  }
  function removeDuplicationsInArray(arr) {
    return Array.from(new Set(arr));
  }
  function distanceBetweenPoints(point1, point2) {
    if (!point1.x || !point1.y || !point2.x || !point2.y) {
      return 9999999999999;
    }
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  }
  function stylePopup(movePopupDown = false, hideTriangle = true, transparency = true) {
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
  function styleComputationToolBar() {
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
  function styleOpdTreeRightClickMenu() {
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
  const defaultLongPressTime = 400;
  // export function setLongTouchListener(htmlElement, actionFunction, args = {} , duration = 400) {
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
  function undoShared() {
    if (!initRappidShared || initRappidShared.isDSMClusteredView.value === true) {
      return;
    }
    joint.ui.Halo.clear(initRappidShared.paper);
    initRappidShared.setSelectedElementToNull();
    joint.ui.FreeTransform.clear(initRappidShared.paper);
    const opdId = initRappidShared.getOpmModel().currentOpd.id;
    const ret = initRappidShared.getOpmModel().undo();
    if (ret) {
      initRappidShared.getGraphService().loadLogOfUndoRedo(ret, opdId);
      fixCopiedElementsAfterUndoRedo(initRappidShared);
      if (initRappidShared.elementToolbarReference) {
        initRappidShared.setSelectedElementToNull();
        initRappidShared.elementToolbarReference.selected = undefined;
        initRappidShared.elementToolbarReference.onSelection();
        initRappidShared.graph.getCells().forEach(c => {
          if (OPCloudUtils.isInstanceOfDrawnThing(c)) {
            c.removeDuplicationMarkWhenNoDuplicats(initRappidShared);
          }
        });
      }
      initRappidShared.criticalChanges_.next(true);
    }
  }
  function redoshared() {
    if (!initRappidShared) {
      return;
    }
    joint.ui.Halo.clear(initRappidShared.paper);
    initRappidShared.setSelectedElementToNull();
    joint.ui.FreeTransform.clear(initRappidShared.paper);
    const opdId = initRappidShared.getOpmModel().currentOpd.id;
    const ret = initRappidShared.getOpmModel().redo();
    if (ret) {
      initRappidShared.getGraphService().loadLogOfUndoRedo(ret, opdId);
      fixCopiedElementsAfterUndoRedo(initRappidShared);
      if (initRappidShared.elementToolbarReference) {
        initRappidShared.setSelectedElementToNull();
        initRappidShared.elementToolbarReference.selected = undefined;
        initRappidShared.elementToolbarReference.onSelection();
        initRappidShared.graph.getCells().forEach(c => {
          if (OPCloudUtils.isInstanceOfDrawnThing(c)) {
            c.removeDuplicationMarkWhenNoDuplicats(initRappidShared);
          }
        });
      }
      initRappidShared.criticalChanges_.next(true);
    }
  }
  function checkImageURL(_x) {
    return _checkImageURL.apply(this, arguments);
  }
  function _checkImageURL() {
    _checkImageURL = (0, default)(function* (url) {
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
  function getTextColor(ent) {
    if (ent.constructor.name.includes("Object")) {
      return "#00b050";
    } else if (ent.constructor.name.includes("Process")) {
      return "#0070c0";
    } else if (ent.constructor.name.includes("State")) {
      return "#808000";
    }
  }
  function permutationsOfArray(arr) {
    if (arr.length <= 2) {
      if (arr.length === 2) {
        return [arr, [arr[1], arr[0]]];
      } else {
        return arr;
      }
    }
    return arr.reduce((acc, item, i) => acc.concat(permutationsOfArray([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])), []);
  }
  function getIntersectionPointsOfPaths(path1, path2) {
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
  function createUrlPopup(arg) {
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
    validationAlert(params.content, null, params.type);
  }
  const OPCloudUtils = {
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
        if (!force && !getInitRappidShared().oplService.settings.tutorialMode) {
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
}),
/***/86847: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    s: () => (/* binding */ConfirmDialogDialogComponent)

  });

  function ConfirmDialogDialogComponent_span_1_Template(rf, ctx) {
    if (rf & 1) {
      angular_core /* ["ɵɵelementStart"] */.j41(0, "span", 6)(1, "h2");
      angular_core /* ["ɵɵtext"] */.EFF(2);
      angular_core /* ["ɵɵelementEnd"] */.k0s()();
    }
    if (rf & 2) {
      const ctx_r0 = angular_core /* ["ɵɵnextContext"] */.XpG();
      angular_core /* ["ɵɵadvance"] */.R7$();
      angular_core /* ["ɵɵstyleProp"] */.xc7("color", ctx_r0.data.titleColor || "black");
      angular_core /* ["ɵɵadvance"] */.R7$();
      angular_core /* ["ɵɵtextInterpolate"] */.JRh(ctx_r0.data.title);
    }
  }
  let ConfirmDialogDialogComponent = /*#__PURE__*/(() => {
    class ConfirmDialogDialogComponent {
      constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
      }
      ngOnInit() {
        if (!this.data.closeName) {
          this.data.closeName = "CLOSE";
        }
        if (!this.data.okName) {
          this.data.okName = "OK";
        }
        if (this.data.closeFlag === true) {
          const closeButt = document.getElementById("closeButton");
          closeButt.style.display = "none";
        }
      }
      static #_ = (() => this.ɵfac = function ConfirmDialogDialogComponent_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || ConfirmDialogDialogComponent)(angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MatDialogRef */.CP, 8), angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MAT_DIALOG_DATA */.Vh));
      })();
      static #_2 = (() => this.ɵcmp = /*@__PURE__*/angular_core /* ["ɵɵdefineComponent"] */.VBU({
        type: ConfirmDialogDialogComponent,
        selectors: [["opcloud-confirm-dialog"]],
        decls: 9,
        vars: 9,
        consts: [[1, "main"], ["style", "text-align: center;", 4, "ngIf"], [3, "innerHTML"], [1, "buttons"], ["id", "okButton", "mat-button", "", 3, "click", "color"], ["id", "closeButton", "mat-button", "", 3, "click"], [2, "text-align", "center"]],
        template: function ConfirmDialogDialogComponent_Template(rf, ctx) {
          if (rf & 1) {
            angular_core /* ["ɵɵelementStart"] */.j41(0, "div", 0);
            angular_core /* ["ɵɵtemplate"] */.DNE(1, ConfirmDialogDialogComponent_span_1_Template, 3, 3, "span", 1);
            angular_core /* ["ɵɵelement"] */.nrm(2, "div", 2)(3, "br");
            angular_core /* ["ɵɵelementStart"] */.j41(4, "div", 3)(5, "button", 4);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function ConfirmDialogDialogComponent_Template_button_click_5_listener() {
              return ctx.dialogRef.close("OK");
            });
            angular_core /* ["ɵɵtext"] */.EFF(6);
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(7, "button", 5);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function ConfirmDialogDialogComponent_Template_button_click_7_listener() {
              return ctx.dialogRef.close();
            });
            angular_core /* ["ɵɵtext"] */.EFF(8);
            angular_core /* ["ɵɵelementEnd"] */.k0s()()();
          }
          if (rf & 2) {
            angular_core /* ["ɵɵadvance"] */.R7$();
            angular_core /* ["ɵɵproperty"] */.Y8G("ngIf", ctx.data.title);
            angular_core /* ["ɵɵadvance"] */.R7$();
            angular_core /* ["ɵɵstyleMap"] */.Aen(ctx.data.centerText ? "white-space:pre-wrap; text-align: center;" : "white-space:pre-wrap;");
            angular_core /* ["ɵɵproperty"] */.Y8G("innerHTML", ctx.data.message, angular_core /* ["ɵɵsanitizeHtml"] */.npT);
            angular_core /* ["ɵɵadvance"] */.R7$(3);
            angular_core /* ["ɵɵstyleMap"] */.Aen(ctx.data.okColor ? "background-color: " + ctx.data.okColor + ";color: white;" : "");
            angular_core /* ["ɵɵpropertyInterpolate"] */.FS9("color", ctx.data.okColor || "warn");
            angular_core /* ["ɵɵadvance"] */.R7$();
            angular_core /* ["ɵɵtextInterpolate"] */.JRh(ctx.data.okName);
            angular_core /* ["ɵɵadvance"] */.R7$(2);
            angular_core /* ["ɵɵtextInterpolate"] */.JRh(ctx.data.closeName);
          }
        },
        dependencies: [angular_common /* .NgIf */.bT, angular_material_button /* .MatButton */.$z],
        styles: [".buttons[_ngcontent-%COMP%]{padding-top:30px;text-align:center}#okButton[_ngcontent-%COMP%], #closeButton[_ngcontent-%COMP%]{font-weight:400!important;letter-spacing:normal!important;margin-left:10px}#okButton[style*=red][_ngcontent-%COMP%], #okButton[style*=\"#d32f2f\"][_ngcontent-%COMP%]{background-color:#d32f2f!important;color:#fff!important}"]
      }))();
    }
    return ConfirmDialogDialogComponent;
  })();

  /***/
}),
/***/63644: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    F: () => (/* binding */EnterValueDialogComponent)

  });

  let EnterValueDialogComponent = /*#__PURE__*/(() => {
    class EnterValueDialogComponent {
      constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.promptLabel = models_utils_user_input_prompt_utils /* .DEFAULT_USER_INPUT_PROMPT */.kI;
        this.value = "value";
      }
      ngOnInit() {
        if (!this.data.closeName) {
          this.data.closeName = "CLOSE";
        }
        if (!this.data.okName) {
          this.data.okName = "OK";
        }
        if (this.data?.promptMessage) {
          this.promptLabel = this.data.promptMessage;
        }
        if (this.data.closeFlag === true) {
          const closeButt = document.getElementById("closeButton");
          closeButt.style.display = "none";
        }
        setTimeout(function () {
          $("#valueInput").select();
        }, 200);
      }
      close() {
        this.dialogRef.close((0, models_utils_user_input_prompt_utils /* .sanitizeSimulationUserEnteredValue */.Eq)(this.value));
      }
      static #_ = (() => this.ɵfac = function EnterValueDialogComponent_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || EnterValueDialogComponent)(angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MatDialogRef */.CP, 8), angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MAT_DIALOG_DATA */.Vh));
      })();
      static #_2 = (() => this.ɵcmp = /*@__PURE__*/angular_core /* ["ɵɵdefineComponent"] */.VBU({
        type: EnterValueDialogComponent,
        selectors: [["opcloud-enter-value"]],
        decls: 7,
        vars: 2,
        consts: [[1, "main"], [1, "prompt-label"], ["id", "valueInput", "matInput", "", 1, "value-input-full", 3, "ngModelChange", "ngModel"], [1, "buttons"], ["mat-raised-button", "", "color", "warn", 3, "click"]],
        template: function EnterValueDialogComponent_Template(rf, ctx) {
          if (rf & 1) {
            angular_core /* ["ɵɵelementStart"] */.j41(0, "div", 0)(1, "div", 1);
            angular_core /* ["ɵɵtext"] */.EFF(2);
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(3, "input", 2);
            angular_core /* ["ɵɵtwoWayListener"] */.mxI("ngModelChange", function EnterValueDialogComponent_Template_input_ngModelChange_3_listener($event) {
              if (!angular_core /* ["ɵɵtwoWayBindingSet"] */.DH7(ctx.value, $event)) {
                ctx.value = $event;
              }
              return $event;
            });
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(4, "div", 3)(5, "button", 4);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function EnterValueDialogComponent_Template_button_click_5_listener() {
              return ctx.close();
            });
            angular_core /* ["ɵɵtext"] */.EFF(6, "Apply");
            angular_core /* ["ɵɵelementEnd"] */.k0s()()();
          }
          if (rf & 2) {
            angular_core /* ["ɵɵadvance"] */.R7$(2);
            angular_core /* ["ɵɵtextInterpolate"] */.JRh(ctx.promptLabel);
            angular_core /* ["ɵɵadvance"] */.R7$();
            angular_core /* ["ɵɵtwoWayProperty"] */.R50("ngModel", ctx.value);
          }
        },
        dependencies: [angular_material_input /* .MatInput */.fg, angular_material_button /* .MatButton */.$z, angular_forms /* .DefaultValueAccessor */.me, angular_forms /* .NgControlStatus */.BC, angular_forms /* .NgModel */.vS],
        styles: [".main[_ngcontent-%COMP%]{box-sizing:border-box;width:100%;padding:0 4px}.prompt-label[_ngcontent-%COMP%]{word-wrap:break-word;overflow-wrap:break-word;margin-bottom:10px;line-height:1.35}.value-input-full[_ngcontent-%COMP%]{box-sizing:border-box;width:100%;max-width:100%}.buttons[_ngcontent-%COMP%]{padding-top:20px;text-align:center}"]
      }))();
    }
    return EnterValueDialogComponent;
  })();

  /***/
}),
/***/14905: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    K: () => (/* binding */OntologySuggestionDialog)

  });

  function OntologySuggestionDialog_button_19_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = angular_core /* ["ɵɵgetCurrentView"] */.RV6();
      angular_core /* ["ɵɵelementStart"] */.j41(0, "button", 6);
      angular_core /* ["ɵɵlistener"] */.bIt("click", function OntologySuggestionDialog_button_19_Template_button_click_0_listener() {
        const option_r2 = angular_core /* ["ɵɵrestoreView"] */.eBV(_r1).$implicit;
        const ctx_r2 = angular_core /* ["ɵɵnextContext"] */.XpG();
        return angular_core /* ["ɵɵresetView"] */.Njj(ctx_r2.replaceWithSuggestion(option_r2));
      });
      angular_core /* ["ɵɵtext"] */.EFF(1);
      angular_core /* ["ɵɵelementEnd"] */.k0s();
    }
    if (rf & 2) {
      const option_r2 = ctx.$implicit;
      angular_core /* ["ɵɵadvance"] */.R7$();
      angular_core /* ["ɵɵtextInterpolate"] */.JRh(option_r2);
    }
  }
  function OntologySuggestionDialog_div_21_Template(rf, ctx) {
    if (rf & 1) {
      const _r4 = angular_core /* ["ɵɵgetCurrentView"] */.RV6();
      angular_core /* ["ɵɵelementStart"] */.j41(0, "div", 7)(1, "button", 6);
      angular_core /* ["ɵɵlistener"] */.bIt("click", function OntologySuggestionDialog_div_21_Template_button_click_1_listener() {
        angular_core /* ["ɵɵrestoreView"] */.eBV(_r4);
        const ctx_r2 = angular_core /* ["ɵɵnextContext"] */.XpG();
        return angular_core /* ["ɵɵresetView"] */.Njj(ctx_r2.dialogRef.close());
      });
      angular_core /* ["ɵɵtext"] */.EFF(2, "Close Without Changing");
      angular_core /* ["ɵɵelementEnd"] */.k0s()();
    }
  }
  let OntologySuggestionDialog = /*#__PURE__*/(() => {
    class OntologySuggestionDialog {
      constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.dialogRef.disableClose = this.shouldEnforce();
      }
      shouldEnforce() {
        return this.data.enforcementLevel === modules_Settings_OrgOntology_ontologyInterfaces /* .OntologyEnforcementLevel */.u.FORCE;
      }
      ngOnInit() {}
      replaceWithSuggestion(option) {
        this.dialogRef.close(option);
      }
      static #_ = (() => this.ɵfac = function OntologySuggestionDialog_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || OntologySuggestionDialog)(angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MatDialogRef */.CP, 8), angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MAT_DIALOG_DATA */.Vh));
      })();
      static #_2 = (() => this.ɵcmp = /*@__PURE__*/angular_core /* ["ɵɵdefineComponent"] */.VBU({
        type: OntologySuggestionDialog,
        selectors: [["ontology-suggestion-dialog"]],
        decls: 22,
        vars: 4,
        consts: [[1, "main"], ["id", "sentence", 1, "bold"], [1, "bold", 2, "color", "red"], ["id", "options"], ["mat-button", "", 3, "click", 4, "ngFor", "ngForOf"], ["class", "buttons", 4, "ngIf"], ["mat-button", "", 3, "click"], [1, "buttons"]],
        template: function OntologySuggestionDialog_Template(rf, ctx) {
          if (rf & 1) {
            angular_core /* ["ɵɵelementStart"] */.j41(0, "div", 0)(1, "h3");
            angular_core /* ["ɵɵtext"] */.EFF(2, "Organizational Ontology suggestsion");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(3, "div")(4, "span");
            angular_core /* ["ɵɵtext"] */.EFF(5, "Your text is:");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelement"] */.nrm(6, "br");
            angular_core /* ["ɵɵelementStart"] */.j41(7, "span", 1);
            angular_core /* ["ɵɵtext"] */.EFF(8);
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelement"] */.nrm(9, "br");
            angular_core /* ["ɵɵelementStart"] */.j41(10, "span");
            angular_core /* ["ɵɵtext"] */.EFF(11, "The phrase ");
            angular_core /* ["ɵɵelementStart"] */.j41(12, "span", 2);
            angular_core /* ["ɵɵtext"] */.EFF(13);
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵtext"] */.EFF(14, " can match your organization ontology.");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelement"] */.nrm(15, "br");
            angular_core /* ["ɵɵelementStart"] */.j41(16, "span");
            angular_core /* ["ɵɵtext"] */.EFF(17, "Choose from the following phrases to match the organization onlology:");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(18, "div", 3);
            angular_core /* ["ɵɵtemplate"] */.DNE(19, OntologySuggestionDialog_button_19_Template, 2, 1, "button", 4);
            angular_core /* ["ɵɵelementEnd"] */.k0s()();
            angular_core /* ["ɵɵelement"] */.nrm(20, "br");
            angular_core /* ["ɵɵtemplate"] */.DNE(21, OntologySuggestionDialog_div_21_Template, 3, 0, "div", 5);
            angular_core /* ["ɵɵelementEnd"] */.k0s();
          }
          if (rf & 2) {
            angular_core /* ["ɵɵadvance"] */.R7$(8);
            angular_core /* ["ɵɵtextInterpolate"] */.JRh(ctx.data.text);
            angular_core /* ["ɵɵadvance"] */.R7$(5);
            angular_core /* ["ɵɵtextInterpolate"] */.JRh(ctx.data.phraseToReplace);
            angular_core /* ["ɵɵadvance"] */.R7$(6);
            angular_core /* ["ɵɵproperty"] */.Y8G("ngForOf", ctx.data.suggestedReplacements);
            angular_core /* ["ɵɵadvance"] */.R7$(2);
            angular_core /* ["ɵɵproperty"] */.Y8G("ngIf", !ctx.shouldEnforce());
          }
        },
        dependencies: [angular_common /* .NgForOf */.Sq, angular_common /* .NgIf */.bT, angular_material_button /* .MatButton */.$z],
        styles: [".buttons[_ngcontent-%COMP%]{padding-top:10px;text-align:center}h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}#sentence[_ngcontent-%COMP%]{line-height:30px}.bold[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;color:#1a3763}#options[_ngcontent-%COMP%]{text-align:center;margin-top:20px}"]
      }))();
    }
    return OntologySuggestionDialog;
  })();

  /***/
}),
/***/91262: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    u: () => (/* binding */SaveURLComponent)

  });

  function SaveURLComponent_div_14_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = angular_core /* ["ɵɵgetCurrentView"] */.RV6();
      angular_core /* ["ɵɵelementStart"] */.j41(0, "div", 15)(1, "div", 16)(2, "select", 17)(3, "option", 18);
      angular_core /* ["ɵɵtext"] */.EFF(4, "Hyperlink");
      angular_core /* ["ɵɵelementEnd"] */.k0s()()();
      angular_core /* ["ɵɵelementStart"] */.j41(5, "input", 19);
      angular_core /* ["ɵɵlistener"] */.bIt("keyup", function SaveURLComponent_div_14_Template_input_keyup_5_listener($event) {
        const item_r2 = angular_core /* ["ɵɵrestoreView"] */.eBV(_r1).$implicit;
        const ctx_r2 = angular_core /* ["ɵɵnextContext"] */.XpG();
        return angular_core /* ["ɵɵresetView"] */.Njj(ctx_r2.inputChange(item_r2, $event));
      });
      angular_core /* ["ɵɵelementEnd"] */.k0s();
      angular_core /* ["ɵɵelementStart"] */.j41(6, "mat-label", 20);
      angular_core /* ["ɵɵlistener"] */.bIt("click", function SaveURLComponent_div_14_Template_mat_label_click_6_listener() {
        const item_r2 = angular_core /* ["ɵɵrestoreView"] */.eBV(_r1).$implicit;
        const ctx_r2 = angular_core /* ["ɵɵnextContext"] */.XpG();
        return angular_core /* ["ɵɵresetView"] */.Njj(ctx_r2.showPreview(item_r2.url));
      });
      angular_core /* ["ɵɵtext"] */.EFF(7, "Open");
      angular_core /* ["ɵɵelementEnd"] */.k0s();
      angular_core /* ["ɵɵelementStart"] */.j41(8, "mat-label", 21);
      angular_core /* ["ɵɵlistener"] */.bIt("click", function SaveURLComponent_div_14_Template_mat_label_click_8_listener() {
        const item_r2 = angular_core /* ["ɵɵrestoreView"] */.eBV(_r1).$implicit;
        const ctx_r2 = angular_core /* ["ɵɵnextContext"] */.XpG();
        return angular_core /* ["ɵɵresetView"] */.Njj(ctx_r2.delete(item_r2));
      });
      angular_core /* ["ɵɵtext"] */.EFF(9, "Delete");
      angular_core /* ["ɵɵelementEnd"] */.k0s();
      angular_core /* ["ɵɵnamespaceSVG"] */.qSk();
      angular_core /* ["ɵɵelementStart"] */.j41(10, "svg", 22);
      angular_core /* ["ɵɵelement"] */.nrm(11, "path", 3)(12, "path", 4)(13, "path", 5)(14, "path", 6);
      angular_core /* ["ɵɵelementEnd"] */.k0s();
      angular_core /* ["ɵɵnamespaceHTML"] */.joV();
      angular_core /* ["ɵɵelement"] */.nrm(15, "br")(16, "br");
      angular_core /* ["ɵɵelementStart"] */.j41(17, "div", 23);
      angular_core /* ["ɵɵelement"] */.nrm(18, "textarea", 24);
      angular_core /* ["ɵɵelementEnd"] */.k0s()();
    }
    if (rf & 2) {
      const item_r2 = ctx.$implicit;
      angular_core /* ["ɵɵadvance"] */.R7$(2);
      angular_core /* ["ɵɵproperty"] */.Y8G("value", item_r2.iconType);
      angular_core /* ["ɵɵadvance"] */.R7$();
      angular_core /* ["ɵɵproperty"] */.Y8G("selected", true);
      angular_core /* ["ɵɵadvance"] */.R7$(2);
      angular_core /* ["ɵɵproperty"] */.Y8G("value", item_r2.url);
      angular_core /* ["ɵɵadvance"] */.R7$(13);
      angular_core /* ["ɵɵproperty"] */.Y8G("value", item_r2.description)("draggable", false);
    }
  }
  let SaveURLComponent = /*#__PURE__*/(() => {
    class SaveURLComponent {
      constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        // getting the element from the path
        this.element = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().opmModel.getLogicalElementByVisualId(data.Element || (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().selectedElement.id);
        if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnEntity((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().selectedElement)) {
          (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().selectedElement.closeTextEditor((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)());
        } // closing text editor in order to enable writing immediately on the floating window
        this.urlArray = this.element.URLarray.map(item => JSON.parse(JSON.stringify(item)));
        if (this.urlArray.length === 0) {
          this.plusButtonFunc();
        }
      }
      saveURL() {
        if (this.urlArray.find(item => item.url.trim() === "")) {
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Empty URL links are not allowed.");
          return;
        }
        // function that saves the URL sets that were filled
        // the rest of the function is about final saving- the URL's can be changed by the user after first adding.
        const form = document.getElementsByName("URLSet"); // form is getting the set of URL's from HTML file
        if (!form) {
          // checking it exsists
          return;
        } // if not exists - return
        // const myform = form[0] as HTMLFormElement;//
        let urlData = []; // temp will save the icon, link, and description of each URL in the set
        const icons = document.getElementsByName("TypeOfURL"); // getting the type of the URL from HTML
        const links = document.getElementsByName("link"); // getting the URL link from HTML
        const descriptions = document.getElementsByName("description"); // getting the description from HTML
        // for each URL set(icon, URL and description) that appear in the window, save all the fields into temp
        for (let i = 0; i < icons.length; i++) {
          urlData.push({
            icon: icons[i].value,
            desc: descriptions[i].value,
            link: links[i].value
          });
        }
        urlData = urlData.filter(r => r.link !== "" && r.link !== "http://"); // filtering unvalid inputs
        while (this.urlArray.length > 0) {
          // deleting old values of URLset
          this.urlArray.pop();
        }
        for (const item of urlData) {
          // updating new values of URLset
          this.urlArray.push({
            iconType: item.icon,
            url: item.link,
            description: item.desc
          });
        }
        this.element.URLarray = this.urlArray;
        this.element.visualElements.forEach(vis => {
          if ((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.getCell(vis.id)) {
            (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.getCell(vis.id).updateURLArray();
          }
        });
        // updates the URLarray
        // validationAlert(' The URL was saved'); // shows this massage on the screen
        for (const vis of this.element.visualElements) {
          const cell = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.getCell(vis.id);
          if (cell) {
            cell.urlsUtils.resetCounter();
          }
        }
        this.close();
      }
      // adding another index to the array while user press plus
      plusButtonFunc() {
        this.urlArray.push({
          iconType: "picture",
          url: "http://",
          description: ""
        });
      }
      delete(item) {
        const index = this.urlArray.indexOf(item); // get the specific index to delete
        if (index === 0 && this.urlArray.length === 1) {
          item.url = "http://";
          item.description = "";
        } else if (index > -1) {
          this.urlArray.splice(index, 1);
        } // delete the index from the array
      }
      inputChange(item, $event) {
        item.url = $event.target.value;
      }
      showPreview(url) {
        if (url.trim() !== "") {
          try {
            window.open(url, "", "height=200, width=400, scrollbars=no");
          } catch (e) {
            (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Invalid URL.");
          }
        }
      }
      close() {
        // this.element.URLarray = this.element.URLarray.filter(item => item.url !== '' && item.url !== 'http://');
        // if (this.element.URLarray.length === 0)
        //   this.element.URLarray.push({ iconType: 'picture', url: 'http://', description: ' ' });
        this.dialogRef.close();
      }
      onStartDrag(event) {
        if (event.touches) {
          return;
        }
        event.preventDefault();
        const that = this;
        window.onmousemove = function (e) {
          that.moveDrag(e);
        };
        window.onmouseup = function (e) {
          that.endDrag(e);
        };
      }
      endDrag(event) {
        window.onmousemove = function (e) {};
        window.onmouseup = function (e) {};
      }
      moveDrag(event) {
        const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        // clone.cloned.style.top = (event.clientY - 30 + scrollTop) + "px";
        // clone.cloned.style.left = (event.clientX - 67) + "px";
        this.dialogRef.updatePosition({
          left: event.clientX - 440 + "px",
          top: event.clientY - 30 + scrollTop + "px"
        });
      }
      dropItem($event) {
        const prevIndex = $event.previousIndex;
        const newIndex = $event.currentIndex;
        if (prevIndex === newIndex) {
          return;
        }
        (0, angular_cdk_drag_drop /* .moveItemInArray */.HD)(this.urlArray, prevIndex, newIndex);
      }
      static #_ = (() => this.ɵfac = function SaveURLComponent_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || SaveURLComponent)(angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MatDialogRef */.CP, 8), angular_core /* ["ɵɵdirectiveInject"] */.rXU(angular_material_dialog /* .MAT_DIALOG_DATA */.Vh));
      })();
      static #_2 = (() => this.ɵcmp = /*@__PURE__*/angular_core /* ["ɵɵdefineComponent"] */.VBU({
        type: SaveURLComponent,
        selectors: [["opcloud-save-url-dialog"]],
        decls: 25,
        vars: 1,
        consts: [["id", "exit-button"], ["draggable", "true", 2, "margin-left", "410px", "top", "0px", "cursor", "move", 3, "dragstart"], ["width", "18", "height", "20", "viewBox", "0 0 22 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.8936 10.3536C21.0888 10.1583 21.0888 9.84171 20.8936 9.64645L17.7116 6.46447C17.5163 6.2692 17.1997 6.2692 17.0045 6.46447C16.8092 6.65973 16.8092 6.97631 17.0045 7.17157L19.8329 10L17.0045 12.8284C16.8092 13.0237 16.8092 13.3403 17.0045 13.5355C17.1997 13.7308 17.5163 13.7308 17.7116 13.5355L20.8936 10.3536ZM12 10.5H20.54V9.5H12V10.5Z", "fill", "#586D8C"], ["d", "M1.09554 9.64645C0.900274 9.84171 0.900274 10.1583 1.09554 10.3536L4.27752 13.5355C4.47278 13.7308 4.78936 13.7308 4.98462 13.5355C5.17989 13.3403 5.17989 13.0237 4.98462 12.8284L2.1562 10L4.98462 7.17157C5.17989 6.97631 5.17989 6.65973 4.98462 6.46447C4.78936 6.2692 4.47278 6.2692 4.27752 6.46447L1.09554 9.64645ZM12 9.5L1.44909 9.5V10.5L12 10.5V9.5Z", "fill", "#586D8C"], ["d", "M11.3536 0.191901C11.1583 -0.00336151 10.8417 -0.00336151 10.6464 0.191901L7.46447 3.37388C7.2692 3.56914 7.2692 3.88573 7.46447 4.08099C7.65973 4.27625 7.97631 4.27625 8.17157 4.08099L11 1.25256L13.8284 4.08099C14.0237 4.27625 14.3403 4.27625 14.5355 4.08099C14.7308 3.88573 14.7308 3.56914 14.5355 3.37388L11.3536 0.191901ZM11.5 10V0.545454H10.5V10H11.5Z", "fill", "#586D8C"], ["d", "M10.6464 19.8081C10.8417 20.0034 11.1583 20.0034 11.3536 19.8081L14.5355 16.6261C14.7308 16.4309 14.7308 16.1143 14.5355 15.919C14.3403 15.7237 14.0237 15.7237 13.8284 15.919L11 18.7474L8.17157 15.919C7.97631 15.7237 7.65973 15.7237 7.46447 15.919C7.2692 16.1143 7.2692 16.4309 7.46447 16.6261L10.6464 19.8081ZM10.5 10V19.4545H11.5V10H10.5Z", "fill", "#586D8C"], ["id", "exitButtonClick", "width", "10", "height", "13", "viewBox", "0 0 10 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 2, "margin-left", "16px", "margin-top", "3px", "margin-bottom", "3px", 3, "click"], ["d", "M9.54 1L1 12M1 1L9.54 12", "stroke", "#586D8C"], ["id", "allLinks", "cdkDropList", "", 1, "example-list", 2, "height", "400px", "overflow-y", "auto", "padding-right", "5px", 3, "cdkDropListDropped"], ["class", "example-box", "cdkDrag", "", "style", "margin-top: 8px; border-radius: 7px; background-color: #f9f9f9; padding: 12px; border: 1px dashed gray;", 4, "ngFor", "ngForOf"], ["id", "footer"], ["mat-button", "", "id", "save", 1, "button5", 3, "click"], ["mat-button", "", "id", "addMore", 1, "button3", 3, "click"], ["mat-button", "", "id", "close", 1, "button5", 3, "click"], ["cdkDrag", "", 1, "example-box", 2, "margin-top", "8px", "border-radius", "7px", "background-color", "#f9f9f9", "padding", "12px", "border", "1px dashed gray"], [1, "select"], ["name", "TypeOfURL", 1, "typeselect", 3, "value"], ["value", "Hyperlink", 3, "selected"], ["name", "link", "type", "url", "size", "30px", 3, "keyup", "value"], [1, "button0", "preview", 3, "click"], [1, "delete", "center", 3, "click"], ["width", "18", "height", "20", "viewBox", "0 0 22 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", "cdkDragHandle", "", 1, "grabLink"], [1, "delBtnDiv"], ["name", "description", "rows", "4", "cols", "50", 3, "value", "draggable"]],
        template: function SaveURLComponent_Template(rf, ctx) {
          if (rf & 1) {
            angular_core /* ["ɵɵelementStart"] */.j41(0, "div")(1, "div", 0)(2, "div", 1);
            angular_core /* ["ɵɵlistener"] */.bIt("dragstart", function SaveURLComponent_Template_div_dragstart_2_listener($event) {
              return ctx.onStartDrag($event);
            });
            angular_core /* ["ɵɵnamespaceSVG"] */.qSk();
            angular_core /* ["ɵɵelementStart"] */.j41(3, "svg", 2);
            angular_core /* ["ɵɵelement"] */.nrm(4, "path", 3)(5, "path", 4)(6, "path", 5)(7, "path", 6);
            angular_core /* ["ɵɵelementEnd"] */.k0s()();
            angular_core /* ["ɵɵelementStart"] */.j41(8, "svg", 7);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function SaveURLComponent_Template_svg_click_8_listener() {
              return ctx.close();
            });
            angular_core /* ["ɵɵelement"] */.nrm(9, "path", 8);
            angular_core /* ["ɵɵelementEnd"] */.k0s()();
            angular_core /* ["ɵɵnamespaceHTML"] */.joV();
            angular_core /* ["ɵɵelementStart"] */.j41(10, "h1");
            angular_core /* ["ɵɵtext"] */.EFF(11, "URL Links Management");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelement"] */.nrm(12, "p");
            angular_core /* ["ɵɵelementStart"] */.j41(13, "div", 9);
            angular_core /* ["ɵɵlistener"] */.bIt("cdkDropListDropped", function SaveURLComponent_Template_div_cdkDropListDropped_13_listener($event) {
              return ctx.dropItem($event);
            });
            angular_core /* ["ɵɵtemplate"] */.DNE(14, SaveURLComponent_div_14_Template, 19, 5, "div", 10);
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelement"] */.nrm(15, "br")(16, "br");
            angular_core /* ["ɵɵelementStart"] */.j41(17, "div")(18, "div", 11)(19, "button", 12);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function SaveURLComponent_Template_button_click_19_listener() {
              return ctx.saveURL();
            });
            angular_core /* ["ɵɵtext"] */.EFF(20, "Save");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(21, "button", 13);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function SaveURLComponent_Template_button_click_21_listener() {
              return ctx.plusButtonFunc();
            });
            angular_core /* ["ɵɵtext"] */.EFF(22, "Add New Link");
            angular_core /* ["ɵɵelementEnd"] */.k0s();
            angular_core /* ["ɵɵelementStart"] */.j41(23, "button", 14);
            angular_core /* ["ɵɵlistener"] */.bIt("click", function SaveURLComponent_Template_button_click_23_listener() {
              return ctx.close();
            });
            angular_core /* ["ɵɵtext"] */.EFF(24, "Close");
            angular_core /* ["ɵɵelementEnd"] */.k0s()()()();
          }
          if (rf & 2) {
            angular_core /* ["ɵɵadvance"] */.R7$(14);
            angular_core /* ["ɵɵproperty"] */.Y8G("ngForOf", ctx.urlArray);
          }
        },
        dependencies: [angular_common /* .NgForOf */.Sq, angular_material_form_field /* .MatLabel */.nJ, angular_material_button /* .MatButton */.$z, angular_forms /* .NgSelectOption */.xH, angular_forms /* ["ɵNgSelectMultipleOption"] */.y7, angular_cdk_drag_drop /* .CdkDropList */.O7, angular_cdk_drag_drop /* .CdkDrag */.T1, angular_cdk_drag_drop /* .CdkDragHandle */.Fb],
        styles: ["h1[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}.move-button[_ngcontent-%COMP%]{cursor:move;margin-left:45px;margin-top:22px;font-size:22px}p[_ngcontent-%COMP%]{color:#1a3763;text-align:center}.button[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:14px;color:#1a3763}.button0[_ngcontent-%COMP%]{height:21px;width:60px;color:#1a3763}.botton1[_ngcontent-%COMP%]{height:30px;width:30px;color:#1a3763}.button3[_ngcontent-%COMP%]{height:40px;width:130px;color:#1a3763}.button4[_ngcontent-%COMP%]{height:40px;width:80px;color:#1a3763}.button5[_ngcontent-%COMP%]{margin:5px;height:40px;width:80px;color:#1a3763}.box[_ngcontent-%COMP%]{margin:20%;position:absolute;left:50%;top:50%}a[_ngcontent-%COMP%]:hover + .box[_ngcontent-%COMP%], .box[_ngcontent-%COMP%]:hover{display:block;position:sticky;z-index:100}.select[_ngcontent-%COMP%]{display:inline-block;width:100px;border:1px solid rgba(88,109,140,.5);border-radius:4px}.typeselect[_ngcontent-%COMP%]{display:block;width:95px;text-align:center;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#78a8f1}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #2196f3}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translate(53px)}label[_ngcontent-%COMP%], #link[_ngcontent-%COMP%]{padding:5px}input[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;margin-inline:10px;margin-left:15px}textarea[_ngcontent-%COMP%]{height:50px;width:455px;max-width:407px;min-width:465px;border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.delete[_ngcontent-%COMP%]:hover{color:red}.delete[_ngcontent-%COMP%]{height:21px;color:#1a3763;background-color:transparent;position:relative;left:9px;top:2px}.preview[_ngcontent-%COMP%]{position:relative;top:2px;color:#1a3763;height:40px;width:60px}hr[_ngcontent-%COMP%]{border-color:#eee5e8}#footer[_ngcontent-%COMP%]{position:relative;margin-top:0;background-color:#fff;text-align:center}#exit-button[_ngcontent-%COMP%]{display:flex;height:10px}.cdk-drag-preview[_ngcontent-%COMP%]{box-sizing:border-box;border-radius:4px;box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f}.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .25s cubic-bezier(0,0,.2,1)}.example-box[_ngcontent-%COMP%]:last-child{border:none}.example-list.cdk-drop-list-dragging[_ngcontent-%COMP%]   .example-box[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.grabLink[_ngcontent-%COMP%]{position:relative;margin-left:20px;top:6px;cursor:move}#allLinks[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}#allLinks[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:4px;border-left:2px solid white;border-right:2px solid white}#allLinks[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df00;border-radius:6px;border-left:4px solid white;border-right:4px solid white}", ".style[_ngcontent-%COMP%] {\n    width: 220px;\n    height: 120px;\n    text-align: center;\n  }"]
      }))();
    }
    return SaveURLComponent;
  })();

  /***/
}),
/***/31831: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    J: () => (/* binding */BringConnectedTypes)

  });
  var BringConnectedTypes = /*#__PURE__*/function (BringConnectedTypes) {
    BringConnectedTypes[BringConnectedTypes.proceduralEnablers = 1] = "proceduralEnablers";
    BringConnectedTypes[BringConnectedTypes.proceduralTransformers = 2] = "proceduralTransformers";
    BringConnectedTypes[BringConnectedTypes.fundamental = 3] = "fundamental";
    BringConnectedTypes[BringConnectedTypes.tagged = 4] = "tagged";
    return BringConnectedTypes;
  }(BringConnectedTypes || {});

  /***/
}),
/***/59992: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    S: () => (/* binding */DeleteAction)

  });

  class DeleteAction {
    constructor(init) {
      this.init = init;
    }
    act() {
      const elements = this.init.selection.collection.models.filter(m => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnEntity(m) || configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnNote(m));
      if (elements.length === 0) {
        return;
      }
      let ret;
      const generallyPossible = this.canOperationBeDoneGenerally();
      if (!generallyPossible.success) {
        ret = [{
          success: false,
          message: generallyPossible.message
        }];
      } else if (elements.length === 1) {
        ret = [this.deleteSingleElement(elements[0])];
      } else {
        ret = this.multiDeleteElements(elements);
      }
      for (const result of ret) {
        if (result.message && (!result.relevantCell || result.relevantCell && this.init.graph.getCell(result.relevantCell?.id))) {
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(result.message, 3500, "Error"); // handles the case that a cell that can't be removed on its own is deleted by other cell deletion (so we should not alert its failure message)
        }
      }
    }
    deleteSingleElement(element) {
      const father = element.getParentCell();
      const fatherHadStates = father && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnObject(father) && father.getStatesOnly().length > 0;
      const ret = this.canElementBeRemoved(element);
      if (ret.success) {
        element.removeAction(element.getVisual(), this.init);
        if (fatherHadStates) {
          father.fixTextOverflow();
        }
        return {
          success: true
        };
      }
      this.resetSelected();
      return {
        success: true,
        message: ret.message,
        relevantCell: element
      };
    }
    multiDeleteElements(elements) {
      if (!this.init.oplService.settings.multiDeletion) {
        return [{
          success: false,
          message: "Can remove only one element at a time.\nIn order to delete multiple selected things, change the setting under the User Management."
        }];
      }
      this.init.opmModel.logForUndo("Multi Deletion");
      this.init.opmModel.setShouldLogForUndoRedo(false, "Multi Deletion");
      const sorted = elements.sort((a, b) => a.getParentCell() ? -1 : 1);
      this.init.selection.collection.reset([]);
      const results = [];
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (!this.init.graph.getCell(sorted[i]?.id)) {
          continue;
        }
        const ret = this.canElementBeRemoved(sorted[i]);
        if (ret.success) {
          sorted[i].removeAction(sorted[i].getVisual(), this.init, true);
        } else {
          results.push({
            success: false,
            message: ret.message,
            relevantCell: sorted[i]
          });
        }
      }
      this.init.opmModel.setShouldLogForUndoRedo(true, "Multi Deletion");
      this.resetSelected();
      return results;
    }
    canElementBeRemoved(element) {
      if (!this.init.graph.getCell(element)) {
        return {
          success: false
        }; // was already deleted by previous element deletion.
      }
      if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnObject(element)) {
        const logical = element.getVisual().logicalElement;
        if (logical.isSatisfiedRequirementSetObject() || logical.isSatisfiedRequirementObject()) {
          return {
            success: false,
            message: "Cannot remove requirements this way. Use the dedicated toolbar requirements actions.",
            relevantCell: element
          };
        }
      }
      if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnState(element)) {
        const logicalFather = element.getVisual().fatherObject?.logicalElement;
        if (logicalFather.isSatisfiedRequirementSetObject() || logicalFather.isSatisfiedRequirementObject()) {
          return {
            success: false,
            message: "Cannot remove requirements this way. Use the dedicated toolbar requirements actions.",
            relevantCell: element
          };
        }
      }
      if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnState(element) && element.getParent().isComputational()) {
        return {
          success: false,
          message: "Cannot remove computational state",
          relevantCell: element
        };
      }
      return {
        success: true
      };
    }
    canOperationBeDoneGenerally() {
      if (this.init.Executing && !this.init.ExecutingPause) {
        return {
          success: false,
          message: "Cannot remove while execution."
        };
      } else if ($("mat-mdc-dialog-container").length) {
        return {
          success: false,
          message: "Cannot remove while a dialog is open."
        };
      } else if (this.init.opmModel.currentOpd.isStereotypeOpd()) {
        return {
          success: false,
          message: "Cannot remove on stereotype opd."
        };
      }
      return {
        success: true
      };
    }
    resetSelected() {
      this.init.setSelectedElementToNull();
      this.init.setElementToRemoveToNull();
    }
  }

  /***/
}),
/***/13641: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    $f: () => (/* binding */plusButton),
    Cq: () => (/* binding */TimeDurationType),
    VC: () => (/* binding */leftArrowButton),
    _x: () => (/* binding */valueType),
    aB: () => (/* binding */downArrowButton),
    aY: () => (/* binding */code),
    h6: () => (/* binding */linkType),
    hH: () => (/* binding */minusButton),
    ix: () => (/* binding */rightArrowButton),
    n9: () => (/* binding */Affiliation),
    qK: () => (/* binding */LinkLogicalConnection),
    tg: () => (/* binding */Essence),
    vF: () => (/* binding */statesArrangement),
    vn: () => (/* binding */dragHandleButton),
    zv: () => (/* binding */linkConnectionType)

  });

  var Affiliation = /*#__PURE__*/function (Affiliation) {
    Affiliation[Affiliation.Systemic = 0] = "Systemic";
    Affiliation[Affiliation.Environmental = 1] = "Environmental";
    return Affiliation;
  }(Affiliation || {});
  var Essence = /*#__PURE__*/function (Essence) {
    Essence[Essence.Physical = 0] = "Physical";
    Essence[Essence.Informatical = 1] = "Informatical";
    return Essence;
  }(Essence || {});
  var statesArrangement = /*#__PURE__*/function (statesArrangement) {
    statesArrangement[statesArrangement.Top = 0] = "Top";
    statesArrangement[statesArrangement.Bottom = 1] = "Bottom";
    statesArrangement[statesArrangement.Left = 2] = "Left";
    statesArrangement[statesArrangement.Right = 3] = "Right";
    return statesArrangement;
  }(statesArrangement || {});
  var code = /*#__PURE__*/function (code) {
    code[code.Unspecified = 0] = "Unspecified";
    code[code.PreDefined = 1] = "PreDefined";
    code[code.UserDefined = 2] = "UserDefined";
    code[code.External = 3] = "External";
    code[code.ROS = 4] = "ROS";
    code[code.MQTT = 5] = "MQTT";
    code[code.Python = 6] = "Python";
    code[code.SQL = 7] = "SQL";
    code[code.GenAI = 8] = "GenAI";
    return code;
  }(code || {});
  var TimeDurationType = /*#__PURE__*/function (TimeDurationType) {
    TimeDurationType[TimeDurationType.Unspecified = 1] = "Unspecified";
    TimeDurationType[TimeDurationType.Specified = 2] = "Specified";
    return TimeDurationType;
  }(TimeDurationType || {});
  var valueType = /*#__PURE__*/function (valueType) {
    valueType[valueType.None = 0] = "None";
    valueType[valueType.String = 1] = "String";
    valueType[valueType.Number = 2] = "Number";
    valueType[valueType.Array = 3] = "Array";
    return valueType;
  }(valueType || {});
  var stateType = /*#__PURE__*/function (stateType) {
    stateType[stateType.regular = 0] = "regular";
    stateType[stateType.value = 1] = "value";
    return stateType;
  }(stateType || {});
  var LinkLogicalConnection = /*#__PURE__*/function (LinkLogicalConnection) {
    LinkLogicalConnection[LinkLogicalConnection.Or = 0] = "Or";
    LinkLogicalConnection[LinkLogicalConnection.Xor = 1] = "Xor";
    LinkLogicalConnection[LinkLogicalConnection.Not = 2] = "Not";
    return LinkLogicalConnection;
  }(LinkLogicalConnection || {});
  var linkConnectionType = /*#__PURE__*/function (linkConnectionType) {
    linkConnectionType[linkConnectionType.enviromental = 0] = "enviromental";
    linkConnectionType[linkConnectionType.systemic = 1] = "systemic";
    return linkConnectionType;
  }(linkConnectionType || {});
  var linkType = /*#__PURE__*/function (linkType) {
    linkType[linkType.Agent = 0] = "Agent";
    linkType[linkType.Instrument = 1] = "Instrument";
    linkType[linkType.Consumption = 2] = "Consumption";
    linkType[linkType.Result = 3] = "Result";
    linkType[linkType.Effect = 4] = "Effect";
    linkType[linkType.Invocation = 5] = "Invocation";
    linkType[linkType.UndertimeException = 6] = "UndertimeException";
    linkType[linkType.OvertimeException = 7] = "OvertimeException";
    linkType[linkType.UndertimeOvertimeException = 8] = "UndertimeOvertimeException";
    linkType[linkType.Unidirectional = 9] = "Unidirectional";
    linkType[linkType.Bidirectional = 10] = "Bidirectional";
    linkType[linkType.Aggregation = 11] = "Aggregation";
    linkType[linkType.Exhibition = 12] = "Exhibition";
    linkType[linkType.Generalization = 13] = "Generalization";
    linkType[linkType.Instantiation = 14] = "Instantiation";
    // SelfInvocation,
    // SelfInvocationInZoom,
    return linkType;
  }(linkType || {});
  const AggregationSVG = ["<svg xmlns=\"http://www.w3.org/2000/svg\"\n     xmlns:se=\"http://svg-edit.googlecode.com\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n  xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   width=\"30\" height=\"30\" style=\"\">\n  <g class=\"currentLayer\" style=\"\">\n<title>Layer 1</title>\n<path fill=\"#000000\" fill-opacity=\"1\" stroke=\"#586D8C\" stroke-opacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/>\n<path fill=\"#586D8C\" stroke=\"#586D8C\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/>\n  </g>\n</svg>"].join("");
  const AggSVGWithLine = ["<svg xmlns=\"http://www.w3.org/2000/svg\"\n xmlns:se=\"http://svg-edit.googlecode.com\"\n xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n xmlns:cc=\"http://creativecommons.org/ns#\"\n xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n width=\"30\" height=\"40\" style=\"\">\n <g class=\"currentLayer\" style=\"\">\n<title>Layer 1</title>\n<path fill=\"#000000\" fill-opacity=\"1\" stroke=\"#586D8C\" strokeopacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" strokelinejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fillrule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/>\n<path fill=\"#586D8C\" stroke=\"#586D8C\" stroke-width=\"2\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/>\n<path fill=\"#586D8C\" stroke=\"#586D8C\" stroke-width=\"2\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,30 L28.162149898128664,30 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/>\n </g>\n</svg>"].join("");
  const ExhibitionSVG = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:se=\"http://svg-edit.googlecode.com\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"30\" height=\"30\" style=\"\"><g class=\"currentLayer\" style=\"\"><title>Layer 1</title><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#000000\" stroke-opacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/><path fill=\"#586D8C\" stroke=\"#586D8C\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_7\" d=\"M10.262040632199465,19.732118465227213 L14.94954026218473,11.528994112752926 L19.637039892170023,19.732118465227213 L10.262040632199465,19.732118465227213 z\" style=\"color: rgb(0, 0, 0);\" class=\"\" fill-opacity=\"1\"/></g></svg>"].join("");
  const ExhSVGWithLine = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:se=\"http://svg-edit.googlecode.com\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"30\" height=\"50\" style=\"\"><g class=\"currentLayer\" style=\"\"><title>Layer 1</title><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#000000\" strokeopacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" strokelinejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fillrule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/><path fill=\"#586D8C\" stroke=\"#586D8C\" stroke-width=\"2\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_7\" d=\"M10.262040632199465,19.732118465227213 L14.94954026218473,11.528994112752926 L19.637039892170023,19.732118465227213 L10.262040632199465,19.732118465227213 z\" style=\"color: rgb(0, 0, 0);\" class=\"\" fill-opacity=\"1\"/><path fill=\"#586D8C\" stroke=\"#586D8C\" stroke-width=\"2\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_7\" d=\"M2.492512550697853,30 L28.162149898128664,30 z\" style=\"color: rgb(0, 0, 0);\" class=\"\" fillopacity=\"1\"/></g></svg>"].join("");
  const GeneralizationSVG = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:se=\"http://svg-edit.googlecode.com\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"30\" height=\"30\" style=\"\">  <g class=\"currentLayer\" style=\"\"><title>Layer 1</title><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#000000\" stroke-opacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/></g></svg>"].join("");
  const GenSVGWithLine = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:se=\"http://svg-edit.googlecode.com\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"30\" height=\"30\" style=\"\">  <g class=\"currentLayer\" style=\"\"><title>Layer 1</title><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#000000\" strokeopacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" strokelinejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fillrule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\"     id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,30 L28.162149898128664,30 \" style=\"color: rgb(0, 0, 0);\" class=\"\"/></g></svg>"].join("");
  const InstantiationSVG = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:se=\"http://svg-edit.googlecode.com\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"30\" height=\"30\" style=\"\"> <g class=\"currentLayer\" style=\"\"><title>Layer 1</title><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#000000\" stroke-opacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355878 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#586D8C\" stroke-opacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" d=\"M11.000000238418579,17.390625 C11.000000238418579,14.964865331491712 12.964865422411137,13 15.3906249088217,13 C17.816384395232266,13 19.78124957922482,14.964865331491712 19.78124957922482,17.390625 C19.78124957922482,19.816384668508288 17.816384395232266,21.78125 15.3906249088217,21.78125 C12.964865422411137,21.78125 11.000000238418579,19.816384668508288 11.000000238418579,17.390625 z\" id=\"svg_11\" class=\"\"/></g></svg>"].join("");
  const InsSVGWithLine = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:se=\"http://svg-edit.googlecode.com\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"30\" height=\"30\" style=\"\"> <g class=\"currentLayer\" style=\"\"><title>Layer 1</title><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#000000\" strokeopacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" strokelinejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fillrule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_1\" d=\"M2.5000095926228028,2.500009592622746 \" style=\"color: rgb(0, 0, 0);\"/><path fill=\"white\" stroke=\"#586D8C\" stroke-width=\"3\" strokelinejoin=\"round\" stroke-dashoffset=\"\" fill-rule=\"nonzero\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" id=\"svg_3\" d=\"M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355878 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z\" style=\"color: rgb(0, 0, 0);\" class=\"\"/><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#586D8C\" strokeopacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" strokelinejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fillrule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" d=\"M11.000000238418579,17.390625 C11.000000238418579,14.964865331491712 12.964865422411137,13 15.3906249088217,13 C17.816384395232266,13 19.78124957922482,14.964865331491712 19.78124957922482,17.390625 C19.78124957922482,19.816384668508288 17.816384395232266,21.78125 15.3906249088217,21.78125 C12.964865422411137,21.78125 11.000000238418579,19.816384668508288 11.000000238418579,17.390625 z\"id=\"svg_11\" class=\"\"/><path fill=\"#586D8C\" fill-opacity=\"1\" stroke=\"#586D8C\" strokeopacity=\"1\" stroke-width=\"2\" stroke-dasharray=\"none\" strokelinejoin=\"round\" stroke-linecap=\"butt\" stroke-dashoffset=\"\" fillrule=\"nonzero\" opacity=\"1\" marker-start=\"\" marker-mid=\"\" marker-end=\"\" d=\"M2.492512550697853,30 L28.162149898128664,30 z\" id=\"svg_11\" class=\"\"/></g></svg>"].join("");
  const multiplicitySpecialNotations = {
    "0..1": {
      symbol: "?",
      opl: "an optional"
    },
    "0..*": {
      symbol: "*",
      opl: "optional (+ plural)"
    },
    "1..1": {
      symbol: "",
      opl: ""
    },
    "1..*": {
      symbol: "+",
      opl: "at least one"
    }
  };
  // these next parameters are constant button svg-s in order to use them in several html files.
  // the button svg as seen on the navigator, opl sentences box etc. pointing to the left.
  const leftArrowButton = ["<svg width=\"16\" height=\"18\" fill=\"none\" ><g opacity=\"0.4\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.1579 0C13.8146 0 15.1579 1.34314 15.1579 3V15C15.1579 16.6569 13.8146 18 12.1579 18H2.99994C1.3432 18 -6.10352e-05 16.6569 -6.10352e-05 15V3C-6.10352e-05 1.34314 1.3432 0 2.99994 0H12.1579ZM12.2631 1.89478C12.8154 1.89478 13.2631 2.34247 13.2631 2.89478V15.1053C13.2631 15.6576 12.8154 16.1053 12.2631 16.1053H6.68427C6.13177 16.1053 5.68427 15.6576 5.68427 15.1053V2.89478C5.68427 2.34247 6.13177 1.89478 6.68427 1.89478H12.2631Z\" fill=\"#1A3763\" /><path d=\"M10.8421 6L8 8.84211L10.8421 11.6842\" stroke=\"#1A3763\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /></g></svg>"].join("");
  // the button svg as seen on the navigator, opl sentences box etc. pointing to the right.
  const rightArrowButton = ["<svg width=\"16\" height=\"18\" fill=\"none\"><g opacity=\"0.4\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.158 0C13.8148 0 15.158 1.34315 15.158 3V15C15.158 16.6569 13.8148 18 12.158 18H3.00006C1.34321 18 6.38962e-05 16.6569 6.38962e-05 15V3C6.38962e-05 1.34315 1.34321 0 3.00006 0H12.158ZM12.0001 2C12.5524 2 13.0001 2.44772 13.0001 3V10C13.0001 10.5523 12.5524 11 12.0001 11H3.00012C2.44784 11 2.00012 10.5523 2.00012 10V3C2.00012 2.44772 2.44784 2 3.00012 2H12.0001Z\" fill=\"#1A3763\"/><path d=\"M5.95747 4.02604L8.99989 6.47424L6.04319 9.02531\" stroke=\"#1A3763\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></svg>"].join("");
  // the button svg as seen on the navigator, opl sentences box etc. pointing down.
  const downArrowButton = ["<svg width=\"16\" height=\"18\" fill=\"none\" ><g opacity=\"0.4\"><path fill=\"#1A3763\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.158 0C13.8147 0 15.158 1.34314 15.158 3V15C15.158 16.6569 13.8147 18 12.158 18H3C1.34326 18 0 16.6569 0 15V3C0 1.34314 1.34326 0 3 0H12.158ZM12 2C12.5522 2 13 2.44775 13 3V10C13 10.5522 12.5522 11 12 11H3C2.44775 11 2 10.5522 2 10V3C2 2.44775 2.44775 2 3 2H12Z\" /><path d=\"M4.63135 5.10528L7.47345 7.94739L10.3156 5.10528\" stroke=\"#1A3763\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></svg>"].join("");
  // the button svg as seen on the floating navigator with "plus" sign in it.
  const plusButton = ["<svg  width=\"22\" height=\"22\" viewBox=\"0 0 50 50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path style=\"fill:white;stroke:#1A3763;stroke-width:5;opacity:0.5\"d=\"M 38.999, 7 H 11 c -2.25, 0, -4, 1.75, -4, 4 v 27.999 C 7, 41.249, 8.75, 43, 11, 43 h 27.999 C 41.249, 43, 43, 41.249, 43, 38.999 V 11 C 43, 8.75,   41.249, 7,   38.999, 7 z\"/><path opacity=\"0.5\" fill=\"#1A3763\" d=\"M 35.001, 26.999 H 27 V 35 h -3.999 v -8.001  h -8.002 V 23 h 8.002 v -8 H 27 v 8 h 8.001 V 26.999 z\"/></svg>"].join("");
  // the button svg as seen on the floating navigator with "minus" sign in it.
  const minusButton = ["<svg  width=\"22\" height=\"22\" viewBox=\"0 0 50 50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path style=\"fill:white;stroke:#1A3763;stroke-width:5;opacity:0.5\" d=\"M 38.999, 7 H 11 c -2.25, 0, -4, 1.75, -4, 4 v 27.999 C 7, 41.249, 8.75, 43, 11, 43 h 27.999 C 41.249, 43, 43, 41.249, 43, 38.999 V 11 C 43, 8.75,   41.249, 7,   38.999, 7 z\"/><path opacity=\"0.5\" fill=\"#1A3763\" d=\"M 14.999,26.999 V 23 h 20.002 v 3.999 H 14.999 z\"/></svg>"].join("");
  // the handle svg as seen on the floating navigator. Combined of 4 arrows pointing outward.
  const dragHandleButton = ["<svg><path d=\"M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>"].join("");
  // ---------------------------------- end of constant button paths

  /***/
}),
/***/25629: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    B: () => (/* binding */defaultStateStyleSettings)

  });
  const defaultStateStyleSettings = {
    font_size: 14,
    font: "Arial",
    text_color: "#000002",
    border_color: "#808000",
    fill_color: "#fdffff"
  };

  /***/
}),
/***/81499: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    U: () => (/* binding */OpmEllipsis)

  });

  class OpmEllipsis extends OpmEntity /* .OpmEntity */.Q {
    constructor() {
      super();
      this.set(this.stateAttributes());
      this.attr(this.stateAttrs());
    }
    stateAttributes() {
      return {
        markup: "<image/><g class=\"rotatable\"><g class=\"scalable\"><rect class=\"outer\"/><rect class=\"inner\"/></g><text/></g>",
        type: "opm.Ellipsis",
        size: {
          width: 30,
          height: 15
        },
        minSize: {
          width: 30,
          height: 15
        },
        padding: 5
      };
    }
    getPortGroups() {}
    removeUnusedPorts() {}
    innerOuter() {
      const param = {
        stroke: "#808000",
        rx: 5,
        ry: 5
      };
      return {
        ...this.entityShape(),
        ...param
      };
    }
    createInner() {
      return {
        "stroke-width": 0,
        width: 30,
        height: 15,
        "ref-x": 0.5,
        "ref-y": 0.5,
        "x-alignment": "middle",
        "y-alignment": "middle"
      };
    }
    createOuter() {
      return {
        width: 40,
        height: 20
      };
    }
    stateAttrs() {
      return {
        ".outer": {
          ...this.innerOuter(),
          ...this.createOuter()
        },
        ".inner": {
          ...this.innerOuter(),
          ...this.createInner()
        },
        text: {
          textWrap: {
            text: "...",
            width: "100%",
            height: "100%"
          },
          "font-weight": 300,
          "font-size": 13
        },
        rect: {
          style: {
            "pointer-events": "none"
          }
        },
        ".": {
          magnet: false
        }
      };
    }
    getParams() {
      return {
        ...super.getEntityParams()
      };
    }
    replaceSupers(num) {
      const chars = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹"
      };
      return String(num).replace(/[0123456789]/g, match => chars[match]);
    }
    updateParamsFromOpmModel(visualElement) {
      const attr = {
        ".outer": {
          ...this.updateEntityFromOpmModel(visualElement),
          ...{
            stroke: visualElement.strokeColor
          }
        },
        ".inner": {
          ...this.updateEntityFromOpmModel(visualElement),
          ...{
            stroke: visualElement.strokeColor
          }
        }
      };
      const uniqueAttrs = {
        "font-size": 13,
        "font-weight": 300,
        textWrap: {
          height: "100%",
          width: "100%"
        }
      };
      this.attr(attr);
      this.attr("text", uniqueAttrs);
      const numberOfMissingStates = visualElement.getMissingStates();
      this.attr("text/textWrap/text", "..." + (numberOfMissingStates.length ? this.replaceSupers(numberOfMissingStates.length) : ""));
      this.attr({
        ".": {
          "data-tooltip": numberOfMissingStates.join("<br>"),
          "data-tooltip-position": "top",
          opacity: visualElement.fatherObject.belongsToSubModel || visualElement.fatherObject.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel || v.belongsToFatherModelId) ? 0.6 : 1
        }
      });
    }
    setAttr() {
      this.attr({
        text: {
          textWrap: {
            text: "...",
            width: "100%",
            height: "100%"
          }
        },
        rect: {
          style: {
            "pointer-events": "none"
          }
        },
        ".": {
          magnet: false
        }
      });
    }
    greyOutEntity() {
      if (this.getParentCell().getVisual() && this.getParentCell().getVisual().logicalElement.shouldBeGreyed === true && (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().shouldGreyOut) {
        this.graph.startBatch("ignoreChange");
        this.attr("rect/fill", "lightgrey");
        this.attr(".outer/stroke", "grey");
        this.attr(".inner/stroke", "grey");
        this.graph.stopBatch("ignoreChange");
      } else {
        this.graph.startBatch("ignoreChange");
        this.attr("rect/fill", "transparent");
        this.attr(".outer/stroke", "#808000");
        this.attr(".inner/stroke", "#808000");
        this.graph.stopBatch("ignoreChange");
      }
    }
    closeTextEditor(rappid) {}
    changeAttributesHandle(options) {}
    updateShapeAttr(newValue) {
      this.attr(".inner", newValue);
      this.attr(".outer", newValue);
    }
    getShapeAttr() {
      return this.attr(".inner");
    }
    getShapeFillColor() {
      return this.attr(".inner/fill");
    }
    getShapeOutline() {
      return this.attr(".inner/stroke");
    }
    surpressStates() {
      /*this.connectLinksToFather(this.stateArray, this.stateArray[0].getParent())
      for (let i = 0; i < this.stateArray.length; i++) {
        this.stateArray[i].remove();
      }*/
    }
    pasteStyle(copiedParams) {
      return;
    }
    doubleClickHandle(cellView, evt, options) {
      const parentID = this.attributes.father;
      const parent = cellView.model.getAncestors()[0];
      const visualObject = options.opmModel.getVisualElementById(parentID);
      if (visualObject.belongsToSubModel) {
        return;
      }
      options.getOpmModel().logForUndo(visualObject.logicalElement.text + " states expression");
      options.getOpmModel().setShouldLogForUndoRedo(false, "expressAction");
      parent.expressAllAction(visualObject, options);
      options.getOpmModel().setShouldLogForUndoRedo(true, "expressAction");
      // ----------------------------------------------------------------------------------------------------- //
      // ----------------------------------------------------------------------------------------------------- //
      // ----------------------------------------------------------------------------------------------------- //
      // const this_ = this;
      // const states = this.getStatesToExpress(options);
      // let checkboxes = '';
      // let popup;
      // for (let i = 0; i < states.length; i++)
      //   checkboxes += '<input value="' + states[i].text + '" class="chb" type="checkbox" ' + (states[i].exist ? "checked" : "") + '><label for="chb' + i + '">' + states[i].text + '</label><br>';
      // const express = '<input id="express" type="button" value="Express">';
      // const popupContent = ['<form>', checkboxes, express, '</form>'].join('');
      // const popupEvents = {
      //   'click #express': function express() {
      //     const checkboxes = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('chb'));
      //     const checked = [];
      //     for (let i = 0; i < checkboxes.length; i++)
      //       checked.push({ text: checkboxes[i].value, checked: checkboxes[i].checked });
      //     this_.expressAction(this_, checked, options);
      //     popup.remove();
      //   }
      // };
      // popup = popupGenerator(cellView.el, popupContent, popupEvents);
      // popup.render();
    }
    expressAction(ellipsis, checked, rappid) {
      const parent = ellipsis.getParent();
      const object = rappid.opmModel.currentOpd.visualElements.find(c => c.id === parent.id);
      const expressed = object.expressChecked(checked);
      if (expressed.length === 0) {
        return;
      }
      const graph = this.graph;
      graph.startBatch("ignoreEvents");
      graph.startBatch("ignoreChange");
      object.rearrange();
      parent.updateParamsFromOpmModel(object);
      for (let i = 0; i < expressed.length; i++) {
        const state = rappid.getGraphService().createDrawnEntity("State");
        state.updateParamsFromOpmModel(expressed[i]);
        this.graph.addCell(state);
        parent.embed(state);
        state.set("father", state.get("parent"));
      }
      for (let i = 0; i < object.children.length; i++) {
        const embedded = parent.getEmbeddedCells().find(e => e.id === object.children[i].id);
        embedded.updateParamsFromOpmModel(object.children[i]);
      }
      if (object.allStatesExpressed()) {
        ellipsis.remove();
      } else {
        ellipsis.updateParamsFromOpmModel(object.ellipsis);
      }
      graph.stopBatch("ignoreChange");
      graph.stopBatch("ignoreEvents");
    }
    //TODO: Daniel: To be moved;
    getStatesToExpress(rappid) {
      const parent = this.get("father");
      const object = rappid.opmModel.currentOpd.visualElements.find(c => c.id === parent);
      return object.getStatesToExpress();
    }
    /*connectLinksToFather(states, father) {
      let outBound;
      let inBound;
      for (let i = 0; i < states.length; i++) {
        outBound = father.graph.getConnectedLinks(states[i], { outbound: true });
        inBound = father.graph.getConnectedLinks(states[i], { inbound: true });
        if (inBound.length) {
          _.each(inBound, (link) => {
            (link) ? link.set('preTarget', link.getTargetElement()) : null;
            this.linksArrayInbound.push(link);
            link.set({ target: { id: father.id } });
          });
        }
        if (outBound.length) {
          _.each(outBound, (link) => {
            (link) ? link.set('preSource', link.getSourceElement()) : null;
            this.linksArrayOutbound.push(link);
            link.set({ source: { id: father.id } });
          });
        }
      }
    }
       express() {
      const father = this.attributes.father;
      for (let i = 0; i < this.stateArray.length; i++) {
        father.graph.addCell(this.stateArray[i]);
        father.embed(this.stateArray[i]);
      }
      this.reConnectLinksToStates(this.stateArray);
      this.stateArray.splice(0, this.stateArray.length);
    }
       reConnectLinksToStates(states) {
      for (let j = 0; j < states.length; j++) {
        if (this.linksArrayInbound.length) {
          _.each(this.linksArrayInbound, (link) => {
            if (link.attributes.preTarget.id === states[j].id) {
              link.set({ target: { id: states[j].id } });
            }
          });
        }
        if (this.linksArrayOutbound.length) {
          _.each(this.linksArrayOutbound, (link) => {
            if (link.attributes.preSource.id === states[j].id) {
              link.set({ source: { id: states[j].id } });
            }
          });
        }
      }
    }*/
    pointerDownHandle(cellView, init) {
      init.getOpmModel().setShouldLogForUndoRedo(false, "ellipsis-pointerDown");
      super.pointerDownHandle(cellView, init);
      init.getOpmModel().setShouldLogForUndoRedo(true, "ellipsis-pointerDown");
    }
  }

  /***/
}),
/***/56210: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Y: () => (/* binding */BiDirectionalTaggedLink)

  });

  class BiDirectionalTaggedLink extends OpmTaggedLink /* .OpmTaggedLink */.Z {
    constructor(sourceElement, targetElement, id) {
      super(sourceElement, targetElement, id);
      // this.attr({'.marker-source' : {fill: 'none', d: 'M20,33 L0,23 L20,23'}});
      // this.attr({'.marker-target' : {fill: 'none', d: 'M20,33 L0,23 L20,23'}});
      this.attr("line/sourceMarker", {
        type: "polyline",
        // SVG polyline
        fill: "none",
        stroke: "#586D8C",
        strokeWidth: 2,
        points: "0.5,0 20,10"
      });
      this.attr("line/targetMarker", {
        type: "polyline",
        // SVG polyline
        fill: "none",
        stroke: "#586D8C",
        strokeWidth: 2,
        points: "0.5,0 20,10"
      });
      this.attributes.name = "Bidirectional_Tagged_Link";
    }
    getParams() {
      const params = {
        sourceMultiplicity: this.get("sourceMultiplicity"),
        targetMultiplicity: this.get("targetMultiplicity"),
        tag: this.get("tag"),
        backwardTag: this.get("backwardTag"),
        linkType: ConfigurationOptions /* .linkType */.h6.Bidirectional
      };
      return {
        ...super.getTaggedLinkParams(),
        ...params
      };
    }
    popupContentDbClick() {
      const sourceMultiplicity = this.attributes.sourceMultiplicity ? this.attributes.sourceMultiplicity : "";
      const targetMultiplicity = this.attributes.targetMultiplicity ? this.attributes.targetMultiplicity : "";
      const tag = this.attributes.tag ? this.attributes.tag : "";
      const backwardTag = this.attributes.backwardTag ? this.attributes.backwardTag : "";
      return super.popupContentDbClick().concat(["<div style=\"height: 16px\"> <div class=\"textAndInput\">Backward Tag: <input size=\"2\" class=\"btag PopupInput\" value=\"" + backwardTag.trim() + "\"></div><span data-title=\"" + this.getBackwardtagPopupTooltipText() + "\"><img class=\"questionMarkForInfo\"src=\"assets/SVG/questionmark.svg\"></span></div><br>"]);
    }
    updateBackwardTagLabel(oldVal, newVal, link, init) {
      const visuals = this.getVisual().logicalElement.visualElements;
      let newLabel;
      if (newVal) {
        newLabel = link.setLabelsOLinks(newVal, 0.2, null, 10);
      }
      link.set("backwardTag", newVal);
      for (const vis of visuals) {
        vis.backwardTag = newVal;
        if (!vis.labels && newLabel) {
          vis.labels = [newLabel];
        } else if (vis.labels && newVal) {
          const old = vis.labels.find(lb => lb.attrs.label.text === oldVal);
          if (old) {
            vis.labels.splice(vis.labels.indexOf(old), 1);
          }
          if (newLabel) {
            vis.labels.push(newLabel);
          }
        }
      }
    }
    popupEventsDbClick(element, init) {
      const this_ = this;
      return {
        "click .urlSvg": function () {
          const dataToRemember = this_.getPopupDataToRemember(this);
          this_.openLinkURLEditing(init).afterClosed().toPromise().then(res => {
            this_.rightClickHandlePopoup(init.paper.findViewByModel(element).el, init);
            this_.restorePopupData(dataToRemember);
          });
          this.remove();
        },
        "click .btnUpdate": function () {
          init.getOpmModel().logForUndo("link labels update");
          const targtLabel = /\S/.test(this.$(".trgt").val()) ? this.$(".trgt").val().toLowerCase().trim() : undefined;
          const sourceLabel = /\S/.test(this.$(".srce").val()) ? this.$(".srce").val().toLowerCase().trim() : undefined;
          const currentTargetMult = element.get("targetMultiplicity") || element.getVisual()?.targetMultiplicity || "";
          const currentSourceMult = element.get("sourceMultiplicity") || element.getVisual()?.sourceMultiplicity || "";
          this_.updateTargetMultiplicity(currentTargetMult, targtLabel, element, init);
          this_.updateSourceMultiplicity(currentSourceMult, sourceLabel, element, init);
          const tagLabel = /\S/.test(this.$(".tag").val()) ? this.$(".tag").val().trim() : undefined;
          const backTagLabel = /\S/.test(this.$(".btag").val()) ? this.$(".btag").val().trim() : undefined;
          // element.setLabelsOLinks(tagLabel, 0.7, null);
          // element.setLabelsOLinks(backTagLabel, 0.3, null, -30);
          element.set("sourceMultiplicity", this.$(".srce").val()?.trim());
          element.getVisual().sourceMultiplicity = this.$(".srce").val()?.trim();
          element.set("targetMultiplicity", this.$(".trgt").val()?.trim());
          element.getVisual().targetMultiplicity = this.$(".trgt").val()?.trim();
          this_.updateTagLabel(element.get("tag"), tagLabel, element, init);
          this_.updateBackwardTagLabel(element.get("backwardTag"), backTagLabel, element, init);
          this_.fixArrowDirection();
          element.set("tag", tagLabel);
          element.set("backwardTag", backTagLabel);
          this_.updateRequirementsLabel(element.get("requirements"), this.$(".req").val().trim(), this.$(".showReq")[0].checked, element, init);
          element.set("requirements", this.$(".req").val().trim());
          element.set("showRequirementsLabel", this.$(".showReq")[0].checked);
          this_.addDblClickListenerForLabels();
          this.remove();
        },
        /**
         * By clicking on the 'Copy Style' button, we keep the style of the source link in the 'linkCopiedStyleParams' dictionary.
         */
        "click .btnStyleCopy": function () {
          this.remove();
          init.linkCopiedStyleParams = {};
          init.linkCopiedStyleParams.strokeWidth = this_.attr("line/strokeWidth");
          init.linkCopiedStyleParams.strokeColor = this_.attr("line/stroke");
        },
        "click .btnStyle": function () {
          this.remove();
          const stylePopupContent = ["Link color: <input type=\"color\" class=\"linkColor PopupColorInput\" value=" + this_.attr("link/fill") + "><br>", "Link width: <input type=\"width\" style=\"width:35px;padding-top: 5px\" class=\"linkwidth PopupInput\" value=" + this_.attr("line/strokeWidth") + "><br>", "<button style=\"padding-top: 5px;margin-left: 6px\" class=\"btnUpdateStyle Popup\">Update Style</button>"];
          const stylePopupEvents = {
            "click .btnUpdateStyle": function () {
              if (this.$(".linkwidth").val() < "1" || this.$(".linkwidth").val() > "6") {
                const errorMessage = "Maximum width is 6";
                (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(errorMessage, 5000, "Error");
                return;
              }
              init.getOpmModel().logForUndo("link style change");
              this_.attr({
                line: {
                  stroke: this.$(".linkColor").val()
                }
              });
              this_.attr({
                line: {
                  strokeWidth: this.$(".linkwidth").val()
                }
              });
              this.remove();
            }
          };
          const el = init.paper.findViewByModel(this_).el;
          (0, configuration_rappidEnviromentFunctionality_shared /* .popupGenerator */.sk)(el, stylePopupContent, stylePopupEvents).render();
          (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
          $(".linkColor")[0].value = this_.attr("line/stroke");
        }
      };
    }
    getBackwardtagPopupTooltipText() {
      return "A bidirectional tagged structural link is a combination of two tagged structural links in opposite\ndirections. The bidirectional default tag is the phrase “related”";
    }
    fixArrowDirection() {
      if (this.getTargetPoint().x - this.getSourcePoint().x > 0) {
        this.attr("line/sourceMarker", {
          type: "polyline",
          // SVG polyline
          fill: "none",
          stroke: "#586D8C",
          strokeWidth: 2,
          points: "0.5,0 20,10"
        });
        this.attr("line/targetMarker", {
          type: "polyline",
          // SVG polyline
          fill: "none",
          stroke: "#586D8C",
          strokeWidth: 2,
          points: "0.5,0 20,10"
        });
      } else {
        this.attr("line/sourceMarker", {
          type: "polyline",
          // SVG polyline
          fill: "none",
          stroke: "#586D8C",
          strokeWidth: 2,
          points: "0.5,0 20,-10"
        });
        this.attr("line/targetMarker", {
          type: "polyline",
          // SVG polyline
          fill: "none",
          stroke: "#586D8C",
          strokeWidth: 2,
          points: "0.5,0 20,-10"
        });
      }
    }
  }

  /***/
}),
/***/93000: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    G: () => (/* binding */ExhibitionLink)

  });

  class ExhibitionLink extends OpmFundamentalLink /* .OpmFundamentalLink */.s {
    constructor(sourceElement, targetElement, graph, id) {
      super(sourceElement, targetElement, graph, id);
      this.attributes.name = "Exhibition-Characterization";
    }
    getParams() {
      const params = {
        linkType: ConfigurationOptions /* .linkType */.h6.Exhibition
      };
      return {
        ...super.getFundamentalLinkParams(),
        ...params
      };
    }
    clone() {
      return new ExhibitionLink(this.sourceElement, this.targetElement, this.graph);
    }
    removeHandle(init) {
      super.removeHandle(init);
      if (this.sourceElement && this.sourceElement.attributes.attrs.digitalTwinConnected && init.getOpmModel().getVisualElementById(this.sourceElement.id)) {
        this.sourceElement.attributes.attrs.digitalTwinConnected = false;
        init.getOpmModel().getVisualElementById(this.sourceElement.id).digitalTwinConnected = false;
        init.getOpmModel().getVisualElementById(this.sourceElement.id).updateParams(init.getOpmModel().getVisualElementById(this.sourceElement.id).getParams());
      }
      this.updateTarget(init);
    }
    addHandle(options) {
      super.addHandle(options);
      this.updateTarget(options);
    }
    getTriangleSVG(withLine = false, color = "#586D8C") {
      if (!withLine) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="">
            <path fill="${color}" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 " style="color: rgb(0, 0, 0);"/>
            <path fill="white"  fill-opacity="1" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z" style="color: rgb(0, 0, 0);" class=""/><path fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_7" d="M10.262040632199465,19.732118465227213 L14.94954026218473,11.528994112752926 L19.637039892170023,19.732118465227213 L10.262040632199465,19.732118465227213 z"/>
            </svg>`;
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="">
          <path fill="${color}" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 " style="color: rgb(0, 0, 0);"/>
          <path fill="white"  fill-opacity="1" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z" style="color: rgb(0, 0, 0);" class=""/><path fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_7" d="M10.262040632199465,19.732118465227213 L14.94954026218473,11.528994112752926 L19.637039892170023,19.732118465227213 L10.262040632199465,19.732118465227213 z"/>
          <path fill="${color}" stroke="${color}" stroke-width="3" strokelinejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,30 L28.162149898128664,30 z"/>
          </svg>`;
    }
    updateTarget(options) {
      if (this.targetElement && options.getOpmModel().getVisualElementById(this.targetElement.id)) {
        for (const vis of this.targetElement.getVisual().logicalElement.visualElements) {
          const cl = options.graph.getCell(vis.id);
          if (cl) {
            cl.updateView(vis);
          }
        }
      }
    }
  }

  /***/
}),
/***/81313: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    R: () => (/* binding */GeneralizationLink)

  });

  class GeneralizationLink extends OpmFundamentalLink /* .OpmFundamentalLink */.s {
    constructor(sourceElement, targetElement, graph, id) {
      super(sourceElement, targetElement, graph, id);
      this.attributes.name = "Generalization-Specialization";
    }
    getParams() {
      const params = {
        linkType: ConfigurationOptions /* .linkType */.h6.Generalization
      };
      return {
        ...super.getFundamentalLinkParams(),
        ...params
      };
    }
    getTriangleSVG(withLine = false, color = "#586D8C") {
      if (!withLine) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="">
      <path fill="${color}" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 " style="color: rgb(0, 0, 0);"/><path fill="white" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z"/>
      </svg>`;
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="">
          <path fill="${color}" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 " style="color: rgb(0, 0, 0);"/><path fill="white" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z"/>
          <path fill="${color}" stroke="${color}" stroke-width="3" strokelinejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,30 L28.162149898128664,30 z"/>
          </svg>`;
    }
  }

  /***/
}),
/***/55422: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    A: () => (/* binding */OpmDefaultLink)

  });

  class OpmDefaultLink extends OpmLinkRappid /* .OpmLinkRappid */.p {
    constructor(id) {
      super();
      this.set(this.linkAttributes());
      this.attr(this.linkAttrs());
      this.IDSetter(id);
      this.legalSelfInvocation = false;
      this.on("change:source", this.onChangedSource);
      this.on("change:target", this.onChangedTarget);
    }
    onChangedSource(cell, changed) {
      if (cell.previousAttributes().source.x) {
        this.lastPointerUpLocation = cell.previousAttributes().source;
      }
      if ((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.hasActiveBatch("rendering")) {
        return;
      }
      if (!changed.x && !changed.anchor && cell.getSourceElement() && !cell.source().port && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnTriangle(this.getTargetElement())) {
        const delta = cell.getSourceElement().getStructuralLinkConnectionPointDelta();
        this.prop("source/anchor", {
          name: "center",
          args: {
            rotate: true,
            dx: delta,
            dy: delta
          }
        });
      }
    }
    onChangedTarget(cell, changed) {
      if (cell.previousAttributes().target.x) {
        this.lastPointerUpLocation = cell.previousAttributes().target;
      }
      if ((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.hasActiveBatch("rendering")) {
        return;
      } else if (cell.constructor.name.includes("Default") && !cell.getTargetElement() || configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnSemiFoldedFundamental(cell.getTargetElement())) {
        return;
      } else if (!changed.x && !changed.anchor && cell.getTargetElement() && !cell.target().port && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnTriangle(this.getSourceElement())) {
        const delta = cell.getTargetElement().getStructuralLinkConnectionPointDelta();
        this.prop("target/anchor", {
          name: "center",
          args: {
            rotate: true,
            dx: delta,
            dy: delta
          }
        });
      }
    }
    getVisual() {
      return (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel().getVisualElementById(this.id);
    }
    IDSetter(id) {
      if (id) {
        this.set("id", id);
      }
    }
    deleteLabel() {
      if (this.labels().length > 0) {
        for (let i = 0; i < this.labels().length; i++) {
          this.removeLabel(this.labels()[i]);
        }
        this.deleteLabel();
      }
      if (this.getVisual()) {
        this.getVisual().labels = [];
      }
    }
    isProceduralLink() {
      return false;
    }
    getAllFundamentalLinks() {}
    linkAttributes() {
      return {
        type: "opm.Link",
        name: "defaultLink",
        connector: {
          name: "jumpover"
        }
      };
    }
    linkAttrs() {
      return {
        line: {
          strokeWidth: "2",
          strokeDasharray: "8 5",
          stroke: "#586D8C"
        }
      };
    }
    getDefaultLinkParams() {
      const source = this.get("source");
      const target = this.get("target");
      return {
        sourceElementId: source ? source.id : null,
        sourceVisualElementPort: source ? source.port : null,
        targetElementId: target ? target.id : null,
        targetVisualElementPort: target ? target.port : null,
        vertices: this.get("vertices"),
        linkConnectionType: this.attr("line/strokeDasharray") === "0" ? ConfigurationOptions /* .linkConnectionType */.zv.systemic : ConfigurationOptions /* .linkConnectionType */.zv.enviromental,
        textColor: "black",
        textFontWeight: "normal",
        textFontSize: "12",
        textFontFamily: "ariel",
        strokeColor: this.attr("line/stroke"),
        strokeWidth: this.attr("line/strokeWidth"),
        id: this.get("id"),
        tag: this.get("tag"),
        labels: this.labels(),
        linkRequirements: this.get("requirements"),
        showRequirementsLabel: this.get("showRequirementsLabel")
      };
    }
    doubleClickHandle(cellView, evt, initRappid) {}
    openLinkURLEditing(init) {
      return init.dialogService.getDialog().open(dialogs_saveURL_dialog_saveURL /* .SaveURLComponent */.u, {
        height: "600px",
        width: "560px",
        data: {
          Element: this.id
        }
      });
    }
    restorePopupData(dataToRemember) {
      if ($(".srce").length) {
        $(".srce").val(dataToRemember.sourceMultiplicity || "");
      }
      if ($(".trgt").length) {
        $(".trgt").val(dataToRemember.targetMultiplicity || "");
      }
      if ($(".pth").length) {
        $(".pth").val(dataToRemember.Path || "");
      }
      if ($(".prob").length) {
        $(".prob").val(dataToRemember.Probability || "");
      }
      if ($(".rate").length) {
        $(".rate").val(dataToRemember.rate || "");
      }
      if ($(".rateUnits").length) {
        $(".rateUnits").val(dataToRemember.rateUnits || "");
      }
      if ($(".min").length) {
        $(".min").val(dataToRemember.timeMin || "");
      }
      if ($("#selectMin").length) {
        $("#selectMin").val(dataToRemember.timeMinVal || "");
      }
      if ($("#selectMax").length) {
        $("#selectMax").val(dataToRemember.timeMaxVal || "");
      }
      if ($(".max").length) {
        $(".max").val(dataToRemember.timeMax || "");
      }
      if ($(".req").length) {
        $(".req").val(dataToRemember.requirementsText || "");
      }
      if ($(".showReq").length && dataToRemember.hasOwnProperty("showRequirementsLabel")) {
        $(".showReq")[0].checked = dataToRemember.showRequirementsLabel;
      }
      if ($(".ordered").length && dataToRemember.ordered !== undefined) {
        $(".ordered")[0].checked = dataToRemember.ordered;
      }
      if ($(".tag").length) {
        $(".tag").val(dataToRemember.tag || "");
      }
      if ($(".btag").length) {
        $(".btag").val(dataToRemember.backwardTag || "");
      }
    }
    updateURLArray() {}
    getPopupDataToRemember(popup) {
      return {
        sourceMultiplicity: popup.$(".srce").val(),
        targetMultiplicity: popup.$(".trgt").val(),
        Path: popup.$(".pth").val(),
        Probability: popup.$(".prob").val(),
        rate: popup.$(".rate").val(),
        rateUnits: popup.$(".rateUnits").val(),
        timeMin: popup.$(".min").val(),
        timeMinVal: popup.$("#selectMin").val(),
        timeMaxVal: popup.$("#selectMax").val(),
        timeMax: popup.$(".max").val(),
        requirementsText: popup.$(".req").val().trim(),
        showRequirementsLabel: popup.$(".showReq")[0].checked,
        ordered: popup.$(".ordered")[0]?.checked,
        tag: popup.$(".tag").val(),
        backwardTag: popup.$(".btag").val()
      };
    }
    updateRequirementsLabel(oldVal, newVal, shouldShow, link, init) {
      const visuals = this.getVisual().logicalElement.visualElements.filter(vis => vis !== this.getVisual());
      let newLabel;
      if (newVal && shouldShow) {
        newLabel = link.setLabelsOLinks("Satisfied: " + newVal, 0.5, 0, -30);
      }
      link.set("requirements", newVal);
      link.set("showRequirementsLabel", shouldShow);
      for (const vis of visuals) {
        if (!vis.labels && newLabel) {
          vis.labels = [newLabel];
        } else if (vis.labels && newVal) {
          const old = vis.labels.find(lb => lb.attrs.label.text === "Satisfied: " + oldVal);
          if (old) {
            vis.labels.splice(vis.labels.indexOf(old), 1);
          }
          if (newLabel) {
            vis.labels.push(newLabel);
          }
        }
      }
    }
    popupEventsDbClick(element, init) {
      const this_ = this;
      return {
        "click .urlSvg": function () {
          const dataToRemember = this_.getPopupDataToRemember(this);
          this_.openLinkURLEditing(init).afterClosed().toPromise().then(res => {
            this_.rightClickHandlePopoup(init.paper.findViewByModel(element).el, init);
            this_.restorePopupData(dataToRemember);
          });
          this.remove();
        },
        "click .btnUpdate": function () {
          element.appendLabel({
            markup: [{
              tagName: "text",
              selector: "label"
            }],
            attrs: {
              label: {
                text: /\S/.test(this.$(".tag").val()) ? this.$(".tag").val().trim() : console.log(),
                fill: "black"
              }
            }
          });
          element.set("tag", this.$(".tag").val());
          element.set("requirements", this.$(".req").val().trim());
          element.set("showRequirementsLabel", this.$(".showReq")[0].checked);
          this_.addDblClickListenerForLabels();
          this.remove();
        },
        /**
         * By clicking on the 'Copy Style' button, we keep the style of the source link in the 'linkCopiedStyleParams' dictionary.
         */
        "click .btnStyleCopy": function () {
          this.remove();
          init.linkCopiedStyleParams = {};
          init.linkCopiedStyleParams.strokeWidth = this_.attr("line/strokeWidth");
          init.linkCopiedStyleParams.strokeColor = this_.attr("line/stroke");
        },
        "click .btnStyle": function () {
          this.remove();
          const stylePopupContent = ["Link color: <input type=\"color\" class=\"linkColor PopupColorInput\" value=" + this_.attr("link/fill") + "><br>", "Link width: <input type=\"width\" style=\"width:35px;padding-top: 5px\" class=\"linkwidth PopupInput\" value=" + this_.attr("line/strokeWidth") + "><br>", "<button class=\"btnUpdateStyle Popup\" style=\"padding-top: 5px;margin-left: 6px\">Update Style</button>"];
          const stylePopupEvents = {
            "click .btnUpdateStyle": function () {
              if (this.$(".linkwidth").val() < "1" || this.$(".linkwidth").val() > "6") {
                const errorMessage = "Maximum width is 6";
                (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(errorMessage, 5000, "Error");
                return;
              }
              init.getOpmModel().logForUndo("link style change");
              this_.attr({
                line: {
                  stroke: this.$(".linkColor").val()
                }
              });
              this_.attr({
                line: {
                  strokeWidth: this.$(".linkwidth").val()
                }
              });
              this.remove();
            }
          };
          const el = init.paper.findViewByModel(this_).el;
          (0, configuration_rappidEnviromentFunctionality_shared /* .popupGenerator */.sk)(el, stylePopupContent, stylePopupEvents).render();
          (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
          (0, configuration_rappidEnviromentFunctionality_shared /* .popupInputsEnterListener */.kw)();
          $(".linkColor")[0].value = this_.attr("line/stroke");
        }
      }; // closing popup
    }
    isFundamentalLink() {
      return false;
    }
    pointerDownHandle(cellView, options) {}
    longTouchHandle(cellView, options, event) {
      this.rightClickHandle(cellView, event, options);
      console.log("long touch");
    }
    checkIflegalSourceConnection(link, objectToConnectTo) {
      const source = link.getSourceElement();
      const triangle = link.getTargetElement();
      if (!source || !triangle) {
        return true;
      }
      const structuralLinks = link.graph.getConnectedLinks(triangle, {
        outbound: true
      });
      const targetElements = [];
      structuralLinks.forEach(lnk => {
        targetElements.push(lnk.getTargetElement());
      });
      for (let i = 0; i < targetElements.length; i++) {
        if (targetElements[i] === objectToConnectTo) {
          return false;
        }
      }
      return true;
    }
    checkIflegalTargetConnection(link, objectToConnectTo) {
      const target = link.getTargetElement();
      const triangle = link.getSourceElement();
      if (!target || !triangle) {
        return true;
      }
      const structuralLinks = link.graph.getConnectedLinks(triangle, {
        outbound: true
      });
      const defaultLink = link.graph.getConnectedLinks(triangle, {
        inbound: true
      })[0];
      const elements = [defaultLink.getSourceElement()];
      structuralLinks.forEach(lnk => {
        if (lnk !== link) {
          elements.push(lnk.getTargetElement());
        }
      });
      for (let i = 0; i < elements.length; i++) {
        if (elements[i] === objectToConnectTo) {
          return false;
        }
      }
      return true;
    }
    setNewSourceForVisuals(newSource, newPort, defaultLink, init) {
      const visualNewSource = init.getOpmModel().getVisualElementById(newSource.id);
      const drawnLinks = defaultLink.graph.getConnectedLinks(defaultLink.getTargetElement(), {
        outbound: true
      });
      for (let i = 0; i < drawnLinks.length; i++) {
        drawnLinks[i].sourceElement = newSource;
        drawnLinks[i].resizePort();
        const visualLink = init.getOpmModel().getVisualElementById(drawnLinks[i].id);
        visualLink.sourceVisualElement = visualNewSource;
        if (newPort) {
          visualLink.sourceVisualElementPort = newPort;
        }
      }
    }
    removeTools() {
      if ($("[joint-selector=button]") || $("[joint-selector=icon]") || $("[data-tool-name=source-arrowhead]")) {
        $("[joint-selector=button]").remove();
        $("[joint-selector=icon]").remove();
        $("[data-tool-name=source-arrowhead]").remove();
        $(".joint-marker-vertex").remove();
        $(".joint-marker-segment").remove();
      }
    }
    hide() {
      this.attr("./display", "none");
      $("[data-tool-name=source-arrowhead]").hide();
      $("[data-tool-name=target-arrowhead]").hide();
      $("[data-tool-name=segments]").hide();
      $("[data-tool-name=vertices]").hide();
      $("[data-tool-name=button]").hide();
      const vis = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel().getVisualElementById(this.id);
      if (vis) {
        vis.visible = false;
      }
    }
    isNoteLink(source, target) {
      if (source?.constructor.name.includes("Note") || target?.constructor.name.includes("Note")) {
        return true;
      }
      return false;
    }
    getRequirementsPopupTooltipText() {
      return "The requirement that is satisfied or partly satisfied by this link";
    }
    setPrevious() {
      const prevSourceId = this.get("previousSourceId");
      const prevTargetId = this.get("previousTargetId");
      if (!this.getSourceElement()) {
        this.set({
          source: {
            id: prevSourceId
          }
        });
        this.set("previousSourceId", prevSourceId);
      } else if (!this.getTargetElement()) {
        this.set({
          target: {
            id: prevTargetId
          }
        });
        this.set("previousTargetId", prevTargetId);
      } else if (this.getSourceElement().id !== prevSourceId) {
        this.set({
          source: {
            id: prevSourceId
          }
        });
        this.set("previousSourceId", prevSourceId);
      } else if (this.getTargetElement().id !== prevTargetId) {
        this.set({
          target: {
            id: prevTargetId
          }
        });
        this.set("previousTargetId", prevTargetId);
      } else {
        this.remove();
      }
    }
    refactoredPointerUpHandle(cellView, options, $event) {
      options.getOpmModel().logForUndo("link movement");
      this.removeTools();
      const model = options.getOpmModel();
      let source = this.getSourceElement();
      let target = this.getTargetElement();
      let name = this.get("name");
      let linkId = this.get("id");
      let triangle;
      if (!source || !target || this.isNoteLink(source, target)) {
        this.setPrevious();
        return false;
      }
      if (target.constructor.name.includes("Triangle")) {
        const defaultlink = this.graph.getConnectedLinks(target, {
          outbound: true
        })[0];
        const reallink = this.graph.getConnectedLinks(target, {
          outbound: true
        })[0];
        linkId = reallink.get("id");
        name = reallink.get("name");
        target = defaultlink.getTargetElement();
        const targets = [];
        triangle = this.getTargetElement();
        for (const lnk of this.graph.getConnectedLinks(triangle, {
          outbound: true
        })) {
          targets.push(lnk.getTargetElement());
        }
        if (targets.includes(source)) {
          this.setPrevious();
          return false;
        }
      }
      if (source.constructor.name.includes("Triangle")) {
        const defaultlink = this.graph.getConnectedLinks(source, {
          inbound: true
        })[0];
        const reallink = this.graph.getConnectedLinks(source, {
          outbound: true
        })[0];
        name = reallink.get("name");
        source = defaultlink.getSourceElement();
        triangle = this.getSourceElement();
        const targets = [];
        for (const lnk of this.graph.getConnectedLinks(triangle, {
          outbound: true
        })) {
          targets.push(lnk.getTargetElement());
        }
        if (targets.includes(source)) {
          this.setPrevious();
          return false;
        }
      }
      const visualLink = model.getVisualElementById(linkId);
      const visualSource = model.getVisualElementById(source.id);
      const visualTarget = model.getVisualElementById(target.id);
      if (!visualSource || !visualTarget || !visualLink) {
        this.setPrevious();
        return false;
      }
      // Check according to old OPL table
      // TODO: Create a new static rule set
      const relevantLinks = options.getLinksByOpl(source, target);
      const legal = relevantLinks.filter(l => l.name === name).length > 0;
      const legal2 = model.links.canConnect(visualSource, visualTarget, visualLink.type);
      if (legal === false || legal2.success === false) {
        let souldSetPrevious = false;
        if (legal2.success === false && legal2.message.includes("more than one link")) {
          const exist = visualSource.getLinksWith(visualTarget).outGoing.filter(l => consistency_links_set /* .structural */.ex.contains(l.type));
          if (exist.length > 1) {
            souldSetPrevious = true;
          }
        } else if (legal2.success === false && legal2.message.includes("cannot connect to itself")) {
          souldSetPrevious = true;
        }
        if (legal === false || souldSetPrevious === true) {
          this.setPrevious();
          const message = legal2.message ? legal2.message : "Not allowed according to OPM standard";
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(message, 5000);
          return false;
        }
      }
      if (this.getTargetElement().constructor.name.includes("Triangle")) {
        const newSource = model.getVisualElementById(this.get("source").id);
        const oldSource = model.getVisualElementById(this.get("previousSourceId")) || newSource;
        const fundLinks = oldSource.getLinks().outGoing.filter(l => l.type === visualLink.type).map(v => options.graph.getCell(v.id)).filter(c => !!c);
        for (const lnk of fundLinks) {
          const visTarget = model.getVisualElementById(lnk.get("target").id);
          const visLink = model.getVisualElementById(lnk.id);
          const ret = model.move(newSource, visTarget, visLink);
          if (ret.success === false) {
            // Check according to old OPL table
            lnk.setPrevious();
            (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(ret.message, 5000);
          }
          const linkToUpdate = ret.success ? ret.link : visLink;
          if (newSource.id !== visLink.sourceVisualElement.id || this.get("previousSourceId") !== newSource.id) {
            const shouldJoinExistingTriangle = newSource.getLinks().outGoing.filter(l => l.type === visLink.type).length;
            if (shouldJoinExistingTriangle > 1 || !options.graph.getCell(lnk.id)) {
              options.graph.getCell(lnk.id)?.remove();
              options.getGraphService().drawLink(linkToUpdate);
            }
          }
        }
        // tslint:disable-next-line:no-shadowed-variable
        const portData = this.createPortForMovedLink(cellView, source, target, options, $event);
        if (portData) {
          options.graph.stopBatch("arrowhead-move");
          this.set(portData.side, {
            id: this.get(portData.side).id,
            port: portData.portId
          });
          options.graph.startBatch("arrowhead-move");
        }
        return true;
      }
      const result = model.move(visualSource, visualTarget, visualLink);
      if (result.success === false) {
        // Check according to old OPL table
        this.setPrevious();
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(result.message, 5000);
        return false;
      }
      const portData = this.createPortForMovedLink(cellView, source, target, options, $event);
      if (portData) {
        this.set(portData.side, {
          id: this.get(portData.side).id,
          port: portData.portId
        });
      }
      const fundamentals = [ConfigurationOptions /* .linkType */.h6.Exhibition, ConfigurationOptions /* .linkType */.h6.Aggregation, ConfigurationOptions /* .linkType */.h6.Generalization, ConfigurationOptions /* .linkType */.h6.Instantiation];
      if (!fundamentals.includes(visualLink.type) && this.getSourceElement().constructor.name.includes("Triangle")) {
        this.attributes.previousSourceId = visualSource.id;
      }
      this.attributes.previousTargetId = visualTarget.id;
      visualLink.sourceVisualElementPort = this.mainUpperLink ? this.mainUpperLink.get("source").port : this.get("source").port;
      visualLink.targetVisualElementPort = this.get("target").port;
      if (this.getSourceElement().constructor.name.includes("Semi")) {
        const bestSourcePort = OpmSemifoldedFundamental /* .OpmSemifoldedFundamental */.U.bestSemiFoldedPort(this.getSourceElement().getVisual().fatherObject, this.getTargetElement().getVisual());
        this.set("source", {
          id: this.getSourceElement().id,
          port: bestSourcePort
        });
        visualLink.sourceVisualElementPort = bestSourcePort;
      } else if (this.getTargetElement().constructor.name.includes("Semi")) {
        const bestTargetPort = OpmSemifoldedFundamental /* .OpmSemifoldedFundamental */.U.bestSemiFoldedPort(this.getTargetElement().getVisual().fatherObject, this.getSourceElement().getVisual());
        this.set("target", {
          id: this.getTargetElement().id,
          port: bestTargetPort
        });
        visualLink.targetVisualElementPort = bestTargetPort;
      }
      if (source.removeUnusedPorts) {
        source.removeUnusedPorts();
      }
      if (target.removeUnusedPorts) {
        target.removeUnusedPorts();
      }
      return true;
    }
    createPortForMovedLink(linkView, source, target, init, $event) {
      let shape;
      if (!this.lastPointerUpLocation) {
        return undefined;
      }
      if (!$event || $event.toElement.tagName === "tspan" || !$event.toElement.parentElement) {
        return undefined;
      }
      let leftPointerOn = $event.toElement.parentElement.getAttribute("model-id");
      if (!leftPointerOn) {
        leftPointerOn = $event.toElement.parentElement.parentElement.getAttribute("model-id");
      }
      if (!leftPointerOn) {
        leftPointerOn = $event.toElement.parentElement.parentElement.parentElement.getAttribute("model-id");
      }
      if (!leftPointerOn) {
        return undefined;
      }
      const element = leftPointerOn === target.get("id") ? target : source;
      if (!configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnEntity(element)) {
        return undefined;
      }
      const side = element === source ? "source" : "target";
      const bbox = {
        x: element.get("position").x,
        y: element.get("position").y,
        width: element.get("size").width,
        height: element.get("size").height
      };
      if (element.constructor.name.includes("Process")) {
        shape = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.Ellipse.fromRect(bbox);
      } else {
        shape = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.rect(bbox);
      }
      const line = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.line(linkView.getPointAtRatio(side === "source" ? 1 : 0), this.lastPointerUpLocation);
      line.setLength(line.length() + 10);
      const intersectionPoints = shape.intersectionWithLine(line);
      // TODO: select the correct point if there are more the one intersection points.
      if (!intersectionPoints) {
        return;
      }
      let closestPoint = {
        x: 0,
        y: 0
      };
      if (intersectionPoints.length > 0) {
        const distances = intersectionPoints.map(p => (0, configuration_rappidEnviromentFunctionality_shared /* .distanceBetweenPoints */.Lt)(p, this.lastPointerUpLocation));
        const min = Math.min(...distances);
        closestPoint = intersectionPoints[distances.indexOf(min)];
      } else {
        closestPoint = intersectionPoints[0];
      }
      closestPoint.x = closestPoint.x - element.get("position").x;
      closestPoint.y = closestPoint.y - element.get("position").y;
      const newPortId = element.addCustomPort(closestPoint);
      this.removeTools();
      element.animatePort(newPortId, init);
      return {
        portId: newPortId,
        side: side
      };
    }
    pointerUpHandle(cellView, options, $event) {
      this.refactoredPointerUpHandle(cellView, options, $event);
    }
    changeAttributesHandle(options) {}
    changeSizeHandle(initRappid) {}
    changePositionHandle(initRappid) {}
    addHandle(options) {}
    removeHandle(options) {
      const source = options.graph.getCell(this.get("source").id);
      const target = options.graph.getCell(this.get("target").id);
      if (target && target.get("type") === "opm.TriangleAgg") {
        target.remove();
      }
      if (source && source.removeUnusedPorts && source.getVisual && source.getVisual()) {
        source.removeUnusedPorts();
      }
      if (target && target.removeUnusedPorts && target.getVisual && target.getVisual()) {
        target.removeUnusedPorts();
      }
    }
    getTargetArcOnLink() {}
    getSourceArcOnLink() {}
    drawArc(initRappid, side, element, port, linkDirection) {}
    checkPortsValidity() {
      const sourceElement = this.getSourceElement();
      const sourcePort = this.get("source").port;
      const targetElement = this.getTargetElement();
      const targetPort = this.get("target").port;
      if (!sourceElement.hasPort(sourcePort)) {
        this.attributes.source.port = null;
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Please note: you model had a link connected to invalid port which was removed. A XOR or an OR relation may disconnected");
      }
      if (!targetElement.hasPort(targetPort)) {
        this.attributes.target.port = null;
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Please note: you model had a link connected to invalid port which was removed. A XOR or an OR relation may disconnected");
      }
    }
    validatePort(port) {
      if (port > 100 && port <= 130) {
        port -= 100;
      }
      port = Math.max(1, Math.min(port, 30));
      return port;
    }
    resizePort() {
      // in and out ports are in triangle of fundamental links
      // if (this.get('source').port && (this.get('source').port !== 'out')) {
      //   const sourcePort = +this.get('source').port;
      //   const sourceElement = this.getSourceElement();
      //   const updatedPort = this.validatePort(sourcePort);
      //   if (updatedPort !== sourcePort) {
      //     this.source(sourceElement, {port: updatedPort});
      //   } else {
      //     // sourceElement.portProp(+sourcePort, 'attrs/rect', {width: 1, height: 1, x: 0, y: 0});
      //   }
      // }
      // if (this.get('target').port && (this.get('target').port !== 'in')) {
      //   const targetPort = this.get('target').port;
      //   const targetElement = this.getTargetElement();
      //   const updatedPort =  this.validatePort(targetPort);
      //   if (updatedPort !== targetPort) {
      //     this.target(targetElement, {port: updatedPort}); // port: updatedPort});
      //  } else {
      //     // targetElement.portProp(+targetPort, 'attrs/rect', {width: 1, height: 1, x: 0, y: 0});
      //   }
      // }
    }
    isForkedLink() {
      return false;
    }
    setLinkTools(linkView, isTouch) {
      const verticesTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Vertices({
        snapRadius: 4,
        vertexAdding: !this.isForkedLink()
      });
      const segmentsTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Segments();
      const sourceArrowheadTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.SourceArrowhead();
      const targetArrowheadTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.TargetArrowhead();
      const sourceAnchorTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.SourceAnchor();
      const targetAnchorTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.TargetAnchor();
      const boundaryTool = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Boundary();
      const this_ = this;
      const removeButton = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Remove({
        distance: isTouch ? -35 : -20,
        rotate: false,
        markup: [{
          tagName: "circle",
          selector: "button",
          attributes: {
            r: isTouch ? 10 : 7,
            fill: "#FF1D00",
            cursor: "pointer"
          }
        }, {
          tagName: "path",
          selector: "icon",
          attributes: {
            d: "M -3 -3 3 3 M -3 3 3 -3",
            fill: "none",
            stroke: "#FFFFFF",
            "stroke-width": 2,
            "pointer-events": "none",
            transform: isTouch ? "scale(1.5)" : "scale(1)"
          }
        }],
        action: function (evt) {
          this_.removeAction();
        }
      });
      let tools = this.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
      if (this.getSourceElement()?.constructor.name.includes("Semi") && tools.includes(sourceArrowheadTool)) {
        tools.splice(tools.indexOf(sourceArrowheadTool), 1);
      }
      // temporary until we can support changing source/target and vertices with touch
      if (isTouch) {
        tools = tools.filter(t => ![verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool].includes(t));
      }
      const toolsView = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.dia.ToolsView({
        tools: tools
      });
      linkView.addTools(toolsView);
    }
    removeAction() {
      const initRappid = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      if (this.isNoteLink(this.getSourceElement(), this.getTargetElement())) {
        initRappid.getOpmModel().currentOpd.removeNoteLink(this.id);
        this.remove();
      } else {
        initRappid.showRemoveOptions(this);
      }
    }
    getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      if (this.get("OpmLinkType")) {
        if (this.get("source") && this.get("source") && this.graph.getCell(this.get("source").id) && this.graph.getCell(this.get("source").id).attributes.attrs.digitalTwinConnected) {
          return [verticesTool, segmentsTool];
        } else {
          return [verticesTool, segmentsTool, removeButton, sourceArrowheadTool];
        }
      } else {
        return [verticesTool, segmentsTool, removeButton];
      }
    }
    rightClickHandle(linkView, event, init) {
      const currentOpd = init.getOpmModel().currentOpd;
      if (currentOpd.isStereotypeOpd() || init.isDSMClusteredView.value === true || currentOpd.sharedOpdWithSubModelId || currentOpd.belongsToSubModel) {
        return;
      }
      linkView.hideTools();
      if (this.popupContentDbClick) {
        if (this.get("vertices")) {
          const clickPoint = init.paper.clientToLocalRect(event.clientX, event.clientY);
          // delete new vertex that was created because of the double click
          const dummyVertex = this.get("vertices").filter(vertex => {
            return Math.abs(vertex.x - clickPoint.x) <= 5;
          }).filter(vertex => Math.abs(vertex.y - clickPoint.y) <= 5)[0];
          const realVertices = this.get("vertices").filter(vertex => vertex !== dummyVertex);
          this.set("vertices", realVertices);
        }
        this.rightClickHandlePopoup(linkView?.el || event.target, init);
        if (init.linkCopiedStyleParams) {
          this.pasteLinkStyle(init.linkCopiedStyleParams, init);
        }
      }
    }
    rightClickHandlePopoup(target, init) {
      /**
       * Here we added the 'Copy Style' button, next to the 'update' and 'style' buttons.
       */
      const popupContent = this.popupContentDbClick().concat(["<div style=\"padding-top: 8px\"><button class=\"Popup btnUpdate\" style=\"margin-left: 16px;\">Update</button> &nbsp&nbsp&nbsp; <button class=\"Popup btnStyle\" >Style</button>&nbsp&nbsp&nbsp; <button class=\"Popup btnStyleCopy\" >Copy Style</button></div>"]);
      (0, configuration_rappidEnviromentFunctionality_shared /* .popupGenerator */.sk)(target, popupContent, this.popupEventsDbClick(this, init)).render();
      (0, configuration_rappidEnviromentFunctionality_shared /* .popupInputsEnterListener */.kw)();
      (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
      if ($(".PopupInput")[0]) {
        $(".PopupInput")[0].focus();
      }
    }
    /**
     * This function updates the target link's style using the dictionary it receives(the dictionary includes the desired source style).
     * In case of link with triangle, we make sure that the 2 separated parts of the link will be with the same style.
     * @param linkCopiedStyleParams
     * @param init
     */
    pasteLinkStyle(linkCopiedStyleParams, init) {
      if (this.getSourceElement() && this.getSourceElement().constructor.name.includes("Triangle")) {
        const upperLink = this.getMainUpperLink();
        upperLink.attr({
          line: {
            strokeWidth: init.linkCopiedStyleParams.strokeWidth
          }
        });
        upperLink.attr({
          line: {
            stroke: init.linkCopiedStyleParams.strokeColor
          }
        });
      }
      // console.log('copy_dict:', init.linkCopiedStyleParams);
      this.attr({
        line: {
          strokeWidth: init.linkCopiedStyleParams.strokeWidth
        }
      });
      this.attr({
        line: {
          stroke: init.linkCopiedStyleParams.strokeColor
        }
      });
      init.linkCopiedStyleParams = null;
    }
    /**
     * Recalculate textWrap width/height (and vertical offset) for existing labels,
     * using their current geometry (distance, offset, x, y).
     * Called after elements move/resize or link vertices change.
     */
    updateLabelWrapsFromCurrent() {
      const labels = this.get("labels") || [];
      if (!labels.length) {
        return;
      }
      labels.forEach((lbl, idx) => {
        if (!lbl || !lbl.attrs || !lbl.attrs.label) {
          return;
        }
        const la = lbl.attrs.label;
        const pos = lbl.position || {};
        const text = la.text || "";
        const distance = pos.distance ?? 0.5;
        const offsetX = la.x ?? 0; // current local x
        const offsetY = la.y; // may be undefined
        const offset = pos.offset; // number | { x, y } | undefined
        const keepGrad = pos.args?.keepGradient !== false;
        // Re-run the wrapping logic with the current geometry
        this.setLabelsOLinks(text, distance, offsetX, offsetY, offset, idx, keepGrad);
      });
    }
    /**
     * @param text
     * @param distance   0..1 along the link
     * @param offsetX    manual X offset of the text (local to the label)
     * @param offsetY    manual Y offset of the text (local to the label)
     * @param offset     position.offset (perpendicular to the connection)
     * @param labelIndex index in the labels() array
     * @param keepGradient
     */
    setLabelsOLinks(text, distance, offsetX = 0, offsetY, offset, labelIndex, keepGradient = true) {
      if (!text) {
        return;
      }
      const labelIdx = typeof labelIndex === "number" ? labelIndex : this.labels().length++;
      const fontSize = 16;
      const fontFamily = "Arial, sans-serif";
      // ---------- 1. Visible segment between element contours ----------
      // Fallback: we’ll use connection length if we can’t compute bbox-based intersections
      let visibleLength = null;
      const sourceElement = this.getSourceElement && this.getSourceElement();
      const targetElement = this.getTargetElement && this.getTargetElement();
      const vertices = this.get("vertices") || [];
      // Only handle the "simple" (but most common) case – straight link between two elements
      if (sourceElement && targetElement && (!vertices || vertices.length === 0)) {
        const sBBox = sourceElement.getBBox();
        const tBBox = targetElement.getBBox();
        const sCenter = {
          x: sBBox.x + sBBox.width / 2,
          y: sBBox.y + sBBox.height / 2
        };
        const tCenter = {
          x: tBBox.x + tBBox.width / 2,
          y: tBBox.y + tBBox.height / 2
        };
        const intersectSegmentWithRect = (p1, p2, rect) => {
          const edges = [
          // top
          {
            a: {
              x: rect.x,
              y: rect.y
            },
            b: {
              x: rect.x + rect.width,
              y: rect.y
            }
          },
          // bottom
          {
            a: {
              x: rect.x,
              y: rect.y + rect.height
            },
            b: {
              x: rect.x + rect.width,
              y: rect.y + rect.height
            }
          },
          // left
          {
            a: {
              x: rect.x,
              y: rect.y
            },
            b: {
              x: rect.x,
              y: rect.y + rect.height
            }
          },
          // right
          {
            a: {
              x: rect.x + rect.width,
              y: rect.y
            },
            b: {
              x: rect.x + rect.width,
              y: rect.y + rect.height
            }
          }];
          let closest = null;
          let closestDist = Infinity;
          const segDistSquared = (p, q) => (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y);
          for (const e of edges) {
            const x1 = p1.x;
            const y1 = p1.y;
            const x2 = p2.x;
            const y2 = p2.y;
            const x3 = e.a.x;
            const y3 = e.a.y;
            const x4 = e.b.x;
            const y4 = e.b.y;
            const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (denom === 0) {
              continue;
            }
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
              const ix = x1 + t * (x2 - x1);
              const iy = y1 + t * (y2 - y1);
              const candidate = {
                x: ix,
                y: iy
              };
              const d2 = segDistSquared(candidate, p2); // closer to the opposite center
              if (d2 < closestDist) {
                closestDist = d2;
                closest = candidate;
              }
            }
          }
          return closest;
        };
        const visStart = intersectSegmentWithRect(tCenter, sCenter, sBBox); // exit source
        const visEnd = intersectSegmentWithRect(sCenter, tCenter, tBBox); // enter target
        if (visStart && visEnd) {
          const dx = visEnd.x - visStart.x;
          const dy = visEnd.y - visStart.y;
          visibleLength = Math.sqrt(dx * dx + dy * dy);
        }
      }
      // Fallback: if we couldn’t compute via bboxes, use connection length
      if (visibleLength == null) {
        const pts = [];
        const sourcePoint = this.getSourcePoint();
        const targetPoint = this.getTargetPoint();
        pts.push(sourcePoint);
        for (const v of vertices) {
          pts.push(v);
        }
        pts.push(targetPoint);
        let connLen = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          connLen += (0, configuration_rappidEnviromentFunctionality_shared /* .distanceBetweenPoints */.Lt)(pts[i], pts[i + 1]);
        }
        visibleLength = connLen;
      }
      if (visibleLength <= 0) {
        return;
      }
      // ---------- 2. Inner safe length (away from contours) ----------
      const marginFromShapes = 20; // increase if you still see text “touching” rectangles
      let innerLength = visibleLength - marginFromShapes * 2;
      innerLength = Math.max(40, innerLength);
      // ---------- 3. Measure single-line text width with canvas ----------
      let singleLineWidth;
      try {
        if (typeof document !== "undefined") {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.font = `${fontSize}px ${fontFamily}`;
            singleLineWidth = ctx.measureText(text).width;
          } else {
            singleLineWidth = text.length * fontSize * 0.6;
          }
        } else {
          singleLineWidth = text.length * fontSize * 0.6;
        }
      } catch {
        singleLineWidth = text.length * fontSize * 0.6;
      }
      // ---------- 4. Decide wrap width ----------
      // If text fits inside innerLength → no wrap. Otherwise wrap to innerLength.
      let wrapWidth = innerLength;
      if (singleLineWidth <= innerLength) {
        wrapWidth = singleLineWidth;
      }
      // Optional cap so labels don’t become super wide on huge gaps
      const MAX_WRAP_WIDTH = 260;
      wrapWidth = Math.max(40, Math.min(wrapWidth, MAX_WRAP_WIDTH));
      // ---------- 5. Estimate line count for vertical offset (above link) ----------
      const lineCount = Math.max(1, Math.ceil(singleLineWidth / wrapWidth));
      const lineHeight = fontSize * 1.2;
      const boxHeight = lineCount * lineHeight;
      const baseOffsetX = offsetX !== undefined && offsetX !== null ? offsetX : 0;
      const baseOffsetY = offsetY !== undefined && offsetY !== null ? offsetY : -10; // “above” the link
      const hasManualPositionOffset = offset !== undefined && offset !== null;
      const finalX = baseOffsetX;
      let finalY = baseOffsetY;
      if (!hasManualPositionOffset) {
        // move the label’s center up by half the extra height, so extra lines go further above the link
        finalY = baseOffsetY - (boxHeight - lineHeight) / 2;
      }
      // ---------- 6. Build label data ----------
      const labelData = {
        markup: [{
          tagName: "text",
          selector: "label"
        }],
        attrs: {
          label: {
            textWrap: {
              width: wrapWidth,
              height: boxHeight
            },
            event: "label:pointerclick",
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            fill: "black",
            fontSize: fontSize,
            x: finalX,
            y: finalY,
            text: text
          }
        },
        position: {
          distance: distance,
          // you still control where along the link the label sits
          angle: 0,
          // follow link tangent → text aligned with link
          offset: offset ?? 0,
          // number or { x, y } (user-dragged case)
          args: {
            keepGradient: keepGradient,
            ensureLegibility: true
          }
        }
      };
      this.label(labelIdx, labelData);
      return labelData;
    }
    /**
     * return a link's labels array
     */
    getLabels() {
      return this.labels();
    }
    /**
     * Extract the distance and offset of a label and overwrites the default
     * position values of a label
     * TODO: Call this function from the update label function so after you update labels the location will be also saved
     */
    extractLabelsPositions() {
      let distance;
      let offset;
      let text;
      const labelArrayWithtext = this.getLabels().filter(label => label.attrs.label.text !== "");
      for (let i = 0; i < labelArrayWithtext.length; i++) {
        text = labelArrayWithtext[i].attrs.label.text;
        distance = labelArrayWithtext[i].position.distance;
        offset = labelArrayWithtext[i].position.offset;
        this.setLabelsOLinks(text, distance, null, null, offset, i);
      }
    }
    updateParamsFromOpmModel(link) {
      this.set("source", {
        id: link.source.id,
        port: link.sourceVisualElementPort
      });
      if (this.getTargetElement() && this.getTargetElement().constructor.name.includes("Triangle")) {
        this.set("target", link.target);
      } else {
        this.set("target", {
          id: link.target.id,
          port: link.targetVisualElementPort
        });
      }
      this.set("id", link.id);
    }
    addDblClickListenerForLabels() {
      // TODO: remove in the future if rappid's labels click events works good.
      // const that = this;
      // const init = getInitRappidShared();
      // const linkView = init.paper.findViewByModel(this);
      // if (!linkView) return;
      // const linkEl = linkView.el;
      // for (const child of linkEl.children) {
      //   if (child.className.baseVal === 'labels') {
      //     for (const label of child.children) {
      //       label.ondblclick = function ($event = null) {
      //         that.rightClickHandle(linkView, $event, init);
      //         for (const inputField of $('.PopupInput')) {
      //           const inputValue = (<HTMLInputElement>inputField).value;
      //           if (label.textContent === inputValue || (label.textContent.includes('0.') && inputValue.includes('0.'))) {
      //             inputField.focus();
      //             (inputField as HTMLInputElement).select();
      //             return;
      //           }
      //         }
      //       };
      //     }
      //   }
      // }
    }
    getSourceMultiplicityPopupTooltipText() {
      return "";
    }
    getTargetMultiplicityPopupTooltipText() {
      return "";
    }
  }

  /***/
}),
/***/67888: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    l: () => (/* binding */TriangleClass),
    s: () => (/* binding */OpmFundamentalLink)

  });

  class OpmFundamentalLink extends OpmStructuralLink /* .OpmStructuralLink */.i {
    constructor(sourceElement, targetElement, graph, id) {
      super(id);
      this.sourceElement = sourceElement;
      this.targetElement = targetElement;
      // Get all outgoing links from the source element
      this.graph = graph;
      const outboundLinks = graph.getConnectedLinks(this.sourceElement, {
        outbound: true
      });
      const isPointObstacle = function (point) {
        if (sourceElement.graph?.findModelsFromPoint(point).find(c => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnEntity(c) || c.constructor.name.includes("Triangle"))) {
          return true;
        }
        return false;
      };
      const router = {
        name: "manhattan",
        args: {
          padding: 5,
          step: 11,
          startDirections: ["bottom"],
          isPointObstacle: isPointObstacle
        }
      };
      for (const pt in outboundLinks) {
        // Already exists a link with the same type
        if (outboundLinks[pt].get("OpmLinkType") === this.constructor.name) {
          this.mainUpperLink = outboundLinks[pt];
          this.triangle = outboundLinks[pt].getTargetElement();
        }
      }
      // If didn't found a matching link, need to create one and a triangle
      if (!this.triangle) {
        this.triangle = new TriangleClass();
        const newX = (this.sourceElement.getBBox().center().x + this.targetElement.getBBox().center().x) / 2;
        const newY = (this.sourceElement.getBBox().center().y + this.targetElement.getBBox().center().y) / 2;
        this.triangle.set("position", {
          x: newX,
          y: newY
        });
        this.triangle.set("size", {
          width: 30,
          height: 25
        });
        this.triangle.set("numberOfTargets", 0);
        // Define the link from the source element to the triangle
        const newLink = new OpmDefaultLink /* .OpmDefaultLink */.A();
        newLink.set({
          source: {
            id: this.sourceElement.id
          },
          target: {
            id: this.triangle.id,
            port: "in"
          },
          connector: {
            name: "normal"
          },
          OpmLinkType: this.constructor.name
        });
        newLink.attr("line/targetMarker", {
          type: "polyline",
          // SVG polyline
          fill: "none",
          stroke: "rgba(88,109,140,0)",
          "stroke-width": 2,
          points: "0,0 -2,0"
        });
        newLink.attr({
          ".link-tools": {
            display: "none"
          },
          ".marker-arrowheads": {
            display: "none"
          },
          line: {
            strokeDasharray: "0"
          }
        });
        const upperLinkRouter = {
          name: "manhattan",
          args: {
            padding: 5,
            step: 11,
            endDirections: ["top"],
            isPointObstacle: isPointObstacle
          }
        };
        newLink.router(upperLinkRouter);
        this.mainUpperLink = newLink;
        try {
          graph.addCells([this.triangle, newLink]);
        } catch (e) {}
        if (outboundLinks.length > 0 && outboundLinks[0].getTargetElement() instanceof TriangleClass) {
          outboundLinks[0].getTargetElement().checkFOrOverLapping(sourceElement);
        }
        newLink.set({
          source: {
            id: this.sourceElement.id
            // port: sourceElement.setPorts(side)
          }
        });
      }
      // Define the connection from the triangle to the current link
      this.set({
        source: {
          id: this.triangle.id,
          port: "out"
        },
        target: {
          id: this.targetElement.id
        },
        connector: {
          name: "normal"
        }
      });
      this.router(router);
      let numberOfTargets = this.triangle.get("numberOfTargets") + 1;
      this.triangle.set("numberOfTargets", numberOfTargets);
      // this.checkForOverLappingConnectionOnPorts();
      const img = this.getTriangleSVG(false, this.attr("line/stroke"));
      this.triangle.attr({
        image: {
          "xlink:href": "data:image/svg+xml;utf8," + encodeURIComponent(img)
        }
      });
    }
    getTriangleSVG(withLine = false, color = "#586D8C") {
      return "";
    }
    checkForOverLappingConnectionOnPorts() {
      const source = this.graph.getCell(this.mainUpperLink.source().id);
      const target = this.graph.getCell(this.target().id);
      this.checkOnSource(source);
      this.checkOnTarget(target);
    }
    checkOnSource(source) {
      console.log(this.graph.getConnectedLinks(source));
    }
    checkOnTarget(target) {
      console.log(this.graph.getConnectedLinks(target, {
        inbound: true
      }));
    }
    getFundamentalLinkParams() {
      const params = {
        symbolPos: [this.triangle.get("position").x, this.triangle.get("position").y],
        UpperConnectionVertices: this.mainUpperLink.get("vertices"),
        sourceElementId: this.mainUpperLink.getSourceElement()?.get("id") || this.sourceElement?.get("id"),
        sourceVisualElementPort: this.mainUpperLink.get("source").port,
        targetVisualElementPort: this.get("target").port,
        upperLinkAnchorPos: this.mainUpperLink.prop("source/anchor"),
        targetAnchorPos: this.prop("target/anchor")
      };
      return {
        ...super.getStructuralLinkParams(),
        ...params
      };
    }
    // handles the line adding/deleting and number updating/deleting in the triangle after removing a thing from the relation
    removeHandle(options) {
      super.removeHandle(options);
      const numberOfTargets = this.triangle.get("numberOfTargets");
      this.triangle.set("numberOfTargets", numberOfTargets - 1);
      if (this.triangle.get("numberOfTargets") < 1) {
        this.triangle.remove();
      } else {
        // getting a remaining link that is connected to the triangle
        const remainingLink = options.graph.getConnectedLinks(this.triangle, {
          outbound: true
        })[0];
        if (remainingLink && remainingLink.mainUpperLink) {
          remainingLink.mainUpperLink.deleteLabel();
        }
        if (remainingLink && remainingLink.getVisual() && remainingLink.getVisual().CheckAddLine().missingNumber > 0) {
          // check if there is need to add a line and number
          remainingLink.AddLineAndNumber(); // add line and number
        }
      }
    }
    getTriangle() {
      return this.triangle;
    }
    getTriangleChildren() {
      const links_out = this.graph.getConnectedLinks(this.triangle, {
        outbound: true
      });
      const targets = [];
      const links = [];
      // links.push(this.mainUpperLink);
      for (const link of links_out) {
        if (!link.getTargetElement() || !link.getSourceElement()) {
          continue;
        }
        const target = link.getTargetElement();
        targets.push(link.getTargetElement());
        target.attributes.targetMultiplicity = link.attributes.targetMultiplicity;
        links.push(link);
      }
      return [targets, links];
    }
    getAllFundamentalLinks() {
      return this.graph.getConnectedLinks(this.triangle, {
        outbound: true
      });
    }
    getSource() {
      return this.getMainUpperLink().getSourceElement() || this.sourceElement;
    }
    getMainUpperLink() {
      return this.mainUpperLink;
    }
    // adding a line and a value to every fundamental link that calls this function. the line is added via calling this function from
    // the link itself
    AddLineAndNumber() {
      if (!this.getVisual()) {
        return;
      }
      const numberAsString = String(this.getVisual().CheckAddLine().missingNumber); // the number we should show
      const listMissingChildrenNames = this.getVisual().getMissingChildrenNames().names;
      if (!this.mainUpperLink.labels().find(lb => lb.attrs.label.text === numberAsString)) {
        this.mainUpperLink.setLabelsOLinks(numberAsString, 1, 20, 15, undefined, undefined, false);
        this.mainUpperLink.attr({
          ".": {
            "data-tooltip": listMissingChildrenNames.join("<br>"),
            "data-tooltip-position": "top"
          }
        });
      } // showing the number via adding it as a label
      const img = this.getTriangleSVG(true, this.attr("line/stroke"));
      this.triangle.attr({
        image: {
          "xlink:href": "data:image/svg+xml;utf8," + encodeURIComponent(img)
        }
      });
    }
    updateParamsFromOpmModel(link) {
      super.updateParamsFromOpmModel(link);
      if (link.upperLinkAnchorPos && this.getMainUpperLink()) {
        this.getMainUpperLink().prop("source/anchor", link.upperLinkAnchorPos);
      }
      if (link.targetAnchorPos) {
        this.prop("target/anchor", link.targetAnchorPos);
      }
    }
    isFundamentalLink() {
      return true;
    }
    updateTriangle(initRappid) {
      // if must add line/number.
      if (!initRappid.exportingOpl && this.getVisual() && this.getVisual().CheckAddLine().missingNumber > 0) {
        this.AddLineAndNumber(); // add line and number
      } else {
        const img = this.getTriangleSVG(false, this.attr("line/stroke"));
        this.triangle.attr({
          image: {
            "xlink:href": "data:image/svg+xml;utf8," + encodeURIComponent(img)
          }
        });
      }
    }
    addHandle(options) {
      if (options.exportingOpl) {
        return;
      }
      super.addHandle(options);
      // getting the visual link
      const visualLink = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().opmModel.getVisualElementById(this.id);
      this.mainUpperLink.deleteLabel(); // delete the last number label in order to add new one
      // if must add line/number.
      if (this.getVisual() && this.getVisual().CheckAddLine().missingNumber > 0) {
        this.AddLineAndNumber(); // add line and number
      }
      if (this.includedInOrderedTypes()) {
        this.addLabelOrderedSubpart();
      }
    }
    getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      const term = this.getMainUpperLink().getSourceElement()?.getVisual()?.isSemiFolded() && !this.getTargetElement()?.getVisual()?.isSemiFolded();
      const term2 = this.getVisual().logicalElement.visualElements.length > 1;
      const term3 = this.getVisual().source instanceof VisualPart_OpmVisualThing /* .OpmVisualThing */.J && this.getVisual().source.getRefineeInzoom() && this.getVisual().source.getRefineeInzoom().children.find(ch => ch.logicalElement === this.getVisual().target.logicalElement);
      if (term && (term2 || term3)) {
        return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([this.semifoldButton()]);
      }
      return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
    }
    foldRelation() {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const source = this.getMainUpperLink().getSourceElement();
      if (this.getTargetElement()?.getVisual()?.isSemiFolded()) {
        return;
      }
      init.getOpmModel().logForUndo("Fold in relation");
      init.getOpmModel().setShouldLogForUndoRedo(false, "OpmFundamentalLink-foldRelation");
      const ret = init.getOpmModel().foldInFundamentalRelation(this.getVisual());
      if (ret.success) {
        init.getGraphService().viewSemiFoldedUpdate(ret);
        source.updateSizePositionToFitEmbeded(true);
        // init.graph.resetCells(init.graph.getCells());
        const semifolded = init.graph.getCells().filter(cl => cl.constructor.name.includes("OpmSemifoldedFund"));
        if (init) {
          for (const sm of semifolded) {
            sm.addHandle(init);
          }
        }
      }
      init.getOpmModel().setShouldLogForUndoRedo(true, "OpmFundamentalLink-foldRelation");
      // source.beautifyAfterSemiFolding();
    }
    rightClickHandlePopoup(target, init) {
      const logicalTarget = this.getVisual().target?.logicalElement;
      if (logicalTarget?.isSatisfiedRequirementObject() || logicalTarget?.isSatisfiedRequirementSetObject()) {
        return;
      }
      return super.rightClickHandlePopoup(target, init);
    }
    popupContentDbClick() {
      const this_ = this;
      const ordered = this.includedInOrderedTypes();
      const orderedHtml = ordered ? "checked=\"true\"" : "";
      const targetMultiplicity = this.attributes.targetMultiplicity ? this.attributes.targetMultiplicity : "";
      const requirements = this.attributes.requirements || "";
      const showReqLabel = this.attributes.showRequirementsLabel;
      setTimeout(() => {
        if ($(".showReq").length) {
          $(".showReq")[0].checked = showReqLabel;
        }
      }, 500); // fix for a bug that the custom "V" causes.
      return ["<div style=\"height: 16px\" ><div class=\"textAndInput\">Target Multiplicity : <input size=\"2\"  class=\"trgt PopupInput\" value=\"" + targetMultiplicity.trim() + "\"></div><span data-title=\"" + this.getTargetMultiplicityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\"src=\"assets/SVG/questionmark.svg\"></span></div><br><div style=\"height: 30px; margin-bottom: 4px; width: 273px;\" ><div class=\"textAndInput\">Requirement Set:<input size=\"2\" class=\"PopupInput req\" value=\"" + requirements + "\" ></div><span data-title=\"Displaying satisfied requirements text on the link\"><input type=\"checkbox\"\" class=\"checkbox-round showReq\"></span><span class=\"iconSpan\" style=\"margin-left: -8px;\" data-title=\"" + this.getRequirementsPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span><img class=\"urlSvg\" src=\"assets/SVG/url.svg\"></div>", "Ordered: <span data-title=\"Adding OPD label “ordered” and the OPL reserved phrase “in that sequence” to indicate the order of the linked things\"><input type=\"checkbox\" class=\"ordered\" style=\"vertical-align: middle\" title=\"check to order the subpart top down\" " + orderedHtml + "></span>"];
    }
    removeLinkFromOrderedFundamental() {
      const orderedFundamentalTypes = this.sourceElement.getVisual()?.logicalElement?.orderedFundamentalTypes || [];
      if (orderedFundamentalTypes.includes(this.getVisual().type)) {
        const pos = orderedFundamentalTypes.indexOf(this.getVisual().type);
        orderedFundamentalTypes.splice(pos, 1);
        this.mainUpperLink.deleteLabel();
      }
    }
    addLabelOrderedSubpart() {
      if (this.mainUpperLink.labels().length === 0) {
        this.mainUpperLink.setLabelsOLinks("ordered", 0.5);
      }
    }
    semifoldButton() {
      const that = this;
      return new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Button({
        markup: [{
          tagName: "rect",
          attributes: {
            x: "-2",
            y: "-2",
            width: "18",
            height: "16",
            stroke: "transparent",
            fill: "transparent",
            transform: "translate(-5,0) scale(2)"
          }
        }, {
          tagName: "rect",
          attributes: {
            x: "0.5",
            y: "0.5",
            width: "7",
            height: "10",
            stroke: "#1A3763",
            fill: "#FFFFFF",
            transform: "translate(-5,0) scale(2)"
          }
        }, {
          tagName: "path",
          attributes: {
            d: "M4 2L5.73205 5H2.26795L4 2Z",
            fill: "#1A3763",
            transform: "translate(-5,0) scale(2)"
          }
        }, {
          tagName: "path",
          attributes: {
            d: "M4 6L5.73205 9H2.26795L4 6Z",
            fill: "#1A3763",
            transform: "translate(-5,0) scale(2)"
          }
        }, {
          tagName: "path",
          attributes: {
            d: "M10.5001 12.5L8.99896 12.5001L10.6309 12.4999C10.8756 12.4999 11.1193 12.4699 11.3567 12.4106L11.7084 12.3227C12.5472 12.113 13.2977 11.6421 13.8513 10.9779V10.9779C14.785 9.85778 14.7103 8.21047 13.679 7.17948L13.5592 7.05972C13.2007 6.70128 12.7145 6.49992 12.2075 6.49992L11.9993 6.49992L8.99929 6.49992",
            fill: "transparent",
            stroke: "#1A3763",
            transform: "translate(-5,0) scale(2)"
          }
        }, {
          tagName: "path",
          attributes: {
            d: "M12 4L9 6.5L12 9",
            fill: "#1A3763",
            transform: "translate(-5.7,0) scale(2)"
          }
        }],
        distance: "50%",
        action: () => that.foldRelation()
      });
    }
  }
  class TriangleClass extends configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.shapes.devs.Model.extend({
    markup: "<image/>",
    defaults: configuration_rappidEnviromentFunctionality_shared._.defaultsDeep({
      type: "opm.TriangleAgg",
      inPorts: ["in"],
      outPorts: ["out"],
      ports: {
        groups: {
          in: {
            position: {
              name: "top"
            },
            attrs: {
              ".port-body": {
                fill: "#586D8C",
                magnet: true,
                r: 0,
                transform: "translate(0,2)"
              }
            },
            label: {
              markup: "<text class=\"label-text\"/>"
            }
          },
          out: {
            position: {
              name: "bottom"
            },
            attrs: {
              ".port-body": {
                fill: "#586D8C",
                magnet: true,
                r: 0
              }
            },
            label: {
              markup: "<text class=\"label-text\"/>"
            }
          }
        }
      },
      attrs: {
        //  image: { 'xlink:href': 'assets/OPM_Links/StructuralAgg.png', width: 30, height: 30},
        image: {}
      }
    }, configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.shapes.devs.Model.prototype.defaults)
  }) {
    constructor() {
      super(...arguments);
      this.counter = 10;
    }
    doubleClickHandle(cellView, evt, initRappid) {
      this.changeRelationType(cellView, initRappid);
    }
    rightClickHandle(cellView, options) {
      this.bringMissingFundamentals(options);
    }
    getBottomLinks() {
      return this.graph.getConnectedLinks(this, {
        outbound: true
      });
    }
    pointerUpHandle(cellView, options) {
      const source = options.graph.getConnectedLinks(this, {
        inbound: true
      }).filter(l => !!l)[0].getSourceElement();
      const targets = options.graph.getConnectedLinks(this, {
        outbound: true
      }).filter(l => !!l).map(link => link.getTargetElement());
      if (!configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnSemiFoldedFundamental(source)) {
        source?.sortStructuralLinks();
      }
      for (const target of targets) {
        if (!configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnSemiFoldedFundamental(target)) {
          target?.sortStructuralLinks();
        }
      }
    }
    getVisual() {
      return null;
    }
    changeAttributesHandle(options) {}
    changeSizeHandle(initRappid) {}
    changePositionHandle(initRappid) {}
    removeHandle(options) {}
    addHandle(options) {
      setTimeout(() => {
        // saving the initial pos of the triangle.
        const outboundLinks = options.graph.getConnectedLinks(this, {
          outbound: true
        }).filter(l => !!l);
        for (const link of outboundLinks) {
          const params = link.getParams();
          if (link.getVisual()) {
            link.getVisual().setParams(params);
          }
        }
      }, 500);
    }
    /**
     * Alon: Checks if we have overlapping triangles
     * @param {OpmEntity} source
     */
    checkFOrOverLapping(source) {
      const outboundDefaultLinks = this.graph.getConnectedLinks(source, {
        outbound: true
      }).filter(link => link.attributes.name === "defaultLink");
      if (outboundDefaultLinks.length > 0) {
        for (let i = 0; i < outboundDefaultLinks.length; i++) {
          const overlappingTrianglesArray = this.graph.findModelsUnderElement(this.graph.getCell(outboundDefaultLinks[i].get("target")));
          if (overlappingTrianglesArray.length > 0 && outboundDefaultLinks[i].get("target") != this.id) {
            this.setSpaces(overlappingTrianglesArray, source);
          }
        }
      }
      // this.moveLinksPorts(outboundDefaultLinks);
    }
    /**
     * Alon: Moves any over lapping triangle by 50px to the right or to the left(left or right based on sourceX <> triangleX )
     * @param {Array<TriangleClass>} overLappaing
     * @param {OpmEntity} source
     */
    setSpaces(overLappaing, source) {
      for (let triangle of overLappaing) {
        triangle.set({
          position: {
            x: source.get("position").x < this.get("position").x ? triangle.get("position").x + 50 : triangle.get("position").x - 50,
            y: triangle.get("position").y
          }
        });
      }
    }
    moveLinksPorts(links) {
      // link.set({'source': {'id':link.getSourceElement().id, 'port': 17 }});
    }
    // setDefaultLinkArray(link:OpmDefaultLink){};
    pointerDownHandle() {}
    changeRelationType(cellView, initRappid) {
      if (initRappid.getOpmModel().currentOpd.isStereotypeOpd() || initRappid.getOpmModel().currentOpd.requirementViewOf || initRappid.isDSMClusteredView.value === true) {
        return;
      }
      if (initRappid.opmModel.currentOpd.visualElements.find(v => v.belongsToSubModel)) {
        return;
      }
      const link = this.graph.getConnectedLinks(cellView.model, {
        inbound: true
      });
      const outLink = this.graph.getConnectedLinks(cellView.model, {
        outbound: true
      })[0];
      if (outLink.getVisual().type === ConfigurationOptions /* .linkType */.h6.Exhibition && outLink.getTargetElement().getVisual() instanceof VisualPart_OpmVisualObject /* .OpmVisualObject */.I && outLink.getTargetElement().getVisual().isValueTyped()) {
        return;
      }
      initRappid.getOpmModel().logForUndo("change structural link type");
      const sourceCell = link[0]?.getSourceElement();
      if (!sourceCell || sourceCell.attributes.attrs.digitalTwinConnected) {
        return;
      }
      const selected = this.graph.getConnectedLinks(cellView.model, {
        outbound: true
      });
      if (selected.length === 0) {
        return;
      }
      const visSource = sourceCell.getVisual();
      if (visSource && (visSource.logicalElement.isSatisfiedRequirementObject() || visSource.logicalElement.isSatisfiedRequirementSetObject())) {
        return;
      }
      const newLink = new OpmDefaultLink /* .OpmDefaultLink */.A();
      const selectedThings = new Array();
      selected.forEach(mLink => {
        selectedThings.push(initRappid.graph.getCell(mLink.get("target")));
      });
      for (const target of selectedThings) {
        if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnEntity(target)) {
          const visTarget = target.getVisual();
          if (visTarget && (visTarget.logicalElement.isSatisfiedRequirementObject() || visTarget.logicalElement.isSatisfiedRequirementSetObject())) {
            return;
          }
        }
      }
      initRappid.selection.collection.reset([]);
      initRappid.selection.collection.add(selectedThings, {
        silent: true
      });
      newLink.source({
        id: link[0].get("source")
      });
      newLink.target({
        id: selected[0].get("target")
      });
      newLink.graph = cellView.model.graph;
      newLink.selection = initRappid.selection;
      newLink.replaceTriangleLink = initRappid.getOpmModel().getVisualElementById(selected[0].id);
      (0, configuration_elementsFunctionality_linkDialog /* .createDialog */.X)(initRappid, newLink);
    }
    bringMissingFundamentals(initRappid) {
      if (initRappid.getOpmModel().currentOpd.isStereotypeOpd() || initRappid.getOpmModel().currentOpd.requirementViewOf || initRappid.isDSMClusteredView.value === true) {
        return;
      }
      if (initRappid.opmModel.currentOpd.visualElements.find(v => v.belongsToSubModel)) {
        return;
      }
      const visSource = this.graph.getConnectedLinks(this, {
        outbound: true
      })[0].getVisual().source;
      if (!visSource) {
        return;
      }
      const isSemiFolded = visSource.isSemiFolded();
      const foldedNumber = isSemiFolded ? visSource.semiFolded.length : 0;
      initRappid.getOpmModel().logForUndo("Bring missing Aggregation relations");
      initRappid.getOpmModel().setShouldLogForUndoRedo(false, "bringMissingAggregations");
      const type = this.graph.getConnectedLinks(this, {
        outbound: true
      })[0].getVisual().type;
      const ret = visSource.bringMissingFundamentals(type);
      if (isSemiFolded && visSource.semiFolded.length < foldedNumber) {
        initRappid.getGraphService().renderGraph(initRappid.getOpmModel().currentOpd);
      } else {
        for (const newEntity of ret.entities) {
          initRappid.getGraphService().updateEntity(newEntity);
          const cell = initRappid.graph.getCell(newEntity.id);
          if (cell) {
            newEntity.setParams(cell.getParams());
            if (cell instanceof OpmThing /* .OpmThing */.N) {
              initRappid.setSelectedElement(cell);
              cell.shiftEmbeddedToEdge(initRappid);
            }
          }
        }
        initRappid.getGraphService().updateEntity(visSource);
        initRappid.getGraphService().updateLinksView(ret.links);
      }
      initRappid.getOpmModel().setShouldLogForUndoRedo(true, "bringMissingAggregations");
    }
  }

  /***/
}),
/***/70955: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    p: () => (/* binding */OpmLinkRappid)

  });

  class OpmLinkRappid extends configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.shapes.standard.Link.define("app.Link", {
    attrs: {
      line: {
        // Alon: to remove the target arrowHead
        targetMarker: {
          type: "path",
          d: "",
          stroke: "none"
        }
      },
      wrapper: {
        connection: true,
        strokeWidth: 15,
        strokeLinejoin: "round"
      }
    }
  }) {
    afterRender(init) {}
  }

  /***/
}),
/***/25416: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    E: () => (/* binding */OpmProceduralLink)

  });

  class OpmProceduralLink extends OpmDefaultLink /* .OpmDefaultLink */.A {
    constructor(sourceElement, targetElement, condition, event, negation, id) {
      super(id);
      this.sourceElement = sourceElement;
      this.targetElement = targetElement;
      this.condition = condition;
      this.event = event;
      this.negation = negation;
      this.set({
        source: {
          id: typeof sourceElement !== "undefined" ? this.sourceElement.id : ""
        }
      });
      this.set({
        target: {
          id: typeof targetElement !== "undefined" ? this.targetElement.id : ""
        }
      });
      this.attr({
        line: {
          strokeDasharray: "0"
        }
      });
      this.attr({
        line: {
          stroke: "#586D8C"
        }
      });
      this.attr({
        line: {
          strokeWidth: 2
        }
      });
      this.attr({
        sourceMarker: {
          strokeWidth: 2
        }
      });
      this.attr({
        targetMarker: {
          strokeWidth: 2
        }
      });
      this.UpdateSpecialLinks();
      this.registerEvents();
    }
    isProceduralLink() {
      return true;
    }
    changePositionHandle(initRappid) {
      super.changePositionHandle(initRappid);
      this.UpdateVertices();
    }
    getSourceArcOnLink() {
      return this.sourceArcOnLink;
    }
    getTargetArcOnLink() {
      return this.targetArcOnLink;
    }
    setSourceArcOnLink(arcToSet) {
      this.sourceArcOnLink = arcToSet;
    }
    setTargetArcOnLink(arc) {
      this.targetArcOnLink = arc;
    }
    UpdateVertices(src, dst) {}
    registerEvents() {
      this.on("change:vertices", function () {
        let init;
        if (this.getSourceArcOnLink()) {
          init = this.getSourceArcOnLink().initRappid;
        }
        if (this.getTargetArcOnLink()) {
          init = this.getTargetArcOnLink().initRappid;
        }
        if (init) {
          OrXorArcs /* .Arc */.l.redrawLinkArcs(this, init);
        }
      });
      this.on("change:source", function () {
        let init;
        if (this.getSourceArcOnLink()) {
          init = this.getSourceArcOnLink().initRappid;
          OrXorArcs /* .Arc */.l.makeLinksArcsTransparent(this);
        }
        if (init && this.getSourceElement()) {
          OrXorArcs /* .Arc */.l.redrawLinkArcs(this, init);
        }
      });
      this.on("change:target", function () {
        let init;
        if (this.getTargetArcOnLink()) {
          init = this.getTargetArcOnLink().initRappid;
          OrXorArcs /* .Arc */.l.makeLinksArcsTransparent(this);
        }
        if (init && this.getTargetElement()) {
          OrXorArcs /* .Arc */.l.redrawLinkArcs(this, init);
        }
      });
    }
    doubleClickHandle(cellView, evt, init) {
      if (this.getSourceArcOnLink() || this.getTargetArcOnLink()) {
        OrXorArcs /* .Arc */.l.redrawLinkArcs(this, init);
      }
    }
    UpdateSpecialLinks(distance = 0.9) {
      let symbolAdding = this.getSymbolLinkPerType();
      if (symbolAdding !== "") {
        // The link is a condition/event/negation link
        const xDiff = this.targetElement.get("position").x - this.sourceElement.get("position").x;
        const yDiff = this.targetElement.get("position").y - this.sourceElement.get("position").y;
        const labels = this.labels().filter(item => item.attrs.label); // only those with labels of new type
        const lableIndex = labels.filter(item => item.attrs.label.text === symbolAdding);
        this.removeLabel(lableIndex);
        // sets the label for condition/event/negation multiplicity.
        this.setLabelsOLinks(symbolAdding, 0.9, 10, -5, undefined, undefined, false);
      }
    }
    getSymbolLinkPerType() {
      if (this.condition && this.negation) {
        // Negation condition link
        return "¬ c";
      } else if (this.condition) {
        // Condition link
        return "c";
      } else if (this.event) {
        // Event link
        return "e";
      } else if (this.negation) {
        // Negation link (UTF-8 'NOT' operator)
        return "¬";
      }
      return "";
    }
    updateMarkersColor(color = "#586D8C") {
      this.attr("line/sourceMarker/stroke", color);
      this.attr("line/targetMarker/stroke", color);
    }
    getProceduralLinkParams() {
      const params = {
        path: this.get("Path"),
        Probability: this.get("Probability"),
        rate: this.get("rate"),
        rateUnits: this.get("rateUnits"),
        sourceMultiplicity: this.get("sourceMultiplicity"),
        targetMultiplicity: this.get("targetMultiplicity"),
        timeMin: this.get("timeMin"),
        timeMax: this.get("timeMax"),
        timeMinVal: this.get("timeMinVal"),
        timeMaxVal: this.get("timeMaxVal"),
        condition: this.condition,
        event: this.event,
        negation: this.negation
      };
      return {
        ...super.getDefaultLinkParams(),
        ...params
      };
    }
    popupContentDbClick() {
      const sourceMultiplicity = this.attributes.sourceMultiplicity ? this.attributes.sourceMultiplicity : "";
      const targetMultiplicity = this.attributes.targetMultiplicity ? this.attributes.targetMultiplicity : "";
      const path = this.attributes.Path ? this.attributes.Path : ""; // ? this.attributes.Path : '';
      const Probability = this.attributes.Probability ? this.attributes.Probability : "";
      const requirements = this.attributes.requirements || "";
      // const timeMin = (this.attributes.timeMin) ? this.attributes.timeMin : '';
      // const timeMax = (this.attributes.timeMax) ? this.attributes.timeMax : '';
      // const timeMinVal = (this.attributes.timeMaxVal) ? this.attributes.timeMaxVal : '';
      // const timeMaxVal = (this.attributes.timeMinVal) ? this.attributes.timeMinVal : '';
      return this.createLabelsToShow(sourceMultiplicity, targetMultiplicity, path, Probability, requirements);
    }
    /**
     * Alon: decides which labels to return
     * @returns {string[]}
     */
    createLabelsToShow(sourceMultiplicity, targetMultiplicity, path, Probability, requirements) {
      const labelsForEnablerProceduralLinks = ["<div style=\"height: 16px\" ><div class=\"textAndInput\">Source Multiplicity:<input size=\"2\" class=\"PopupInput srce\" value=\"" + sourceMultiplicity.trim() + "\" ></div><span class=\"iconSpan\" data-title=\"" + this.getSourceMultiplicityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Path:<input size=\"2\" class=\"PopupInput pth\" value=\"" + path.trim() + "\"></div><span class=\"iconSpan\" data-title=\"" + this.getPathPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Probability (0..1): <input size=\"2\" class=\"PopupInput prob\" value=\"" + Probability.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getProbabilityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", this.getRequirementsPopupContent()];
      const labelForProceduralNonEnablerLinks = ["<div style=\"height: 16px\" ><div class=\"textAndInput\">Source Multiplicity:<input size=\"2\" class=\"PopupInput srce\" value=\"" + sourceMultiplicity.trim() + "\" ></div><span class=\"iconSpan\" data-title=\"" + this.getSourceMultiplicityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\" ><div class=\"textAndInput\">Target Multiplicity : <input size=\"2\"  class=\"trgt PopupInput\" value=\"" + targetMultiplicity.trim() + "\"></div><span data-title=\"" + this.getTargetMultiplicityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\"src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Path:<input size=\"2\" class=\"PopupInput pth\" value=\"" + path.trim() + "\"></div><span class=\"iconSpan\" data-title=\"" + this.getPathPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Probability (0..1): <input size=\"2\" class=\"PopupInput prob\" value=\"" + Probability.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getProbabilityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>"];
      if (this.get("name").includes("Agent") || this.get("name").includes("Instrument") || this.get("name").includes("time")) {
        return labelsForEnablerProceduralLinks;
      } else {
        return labelForProceduralNonEnablerLinks;
      } // [
      //    +
      // 'TIme: <br>' +
      // '<input size="2" class="min" value="' + timeMin.trim() + '"> ' +
      // '<select id="selectMin">' +
      // '<option value="ms">Milliseconds</option>' +
      // '<option value="sec">Seconds</option>' +
      // '<option value="min">Minutes</option>' +
      // '<option value="hrs">Hours</option>' +
      // '<option value="days">Days</option>' +
      // '<option value="mths">Months</option>' +
      // '</select>' +
      // ' <br>' +
      // '<input size="2" class="max" value="' + timeMax.trim() + '"> '+
      // '<select id="selectMax">' +
      // '<option value="ms">Milliseconds</option>' +
      // '<option value="sec">Seconds</option>' +
      // '<option value="min">Minutes</option>' +
      // '<option value="hrs">Hours</option>' +
      // '<option value="days">Days</option>' +
      // '<option value="mths">Months</option>' +
      // '</select>' +
      // ' <br>' +
      // ];
    }
    getRequirementsPopupContent() {
      const requirements = this.attributes.requirements || "";
      const showReqLabel = this.attributes.showRequirementsLabel;
      setTimeout(() => {
        if ($(".showReq").length) {
          $(".showReq")[0].checked = showReqLabel;
        }
      }, 500); // fix for a bug that the custom "V" causes.
      return "<div style=\"height: 30px; width: 273px;\" ><div class=\"textAndInput\">Requirement Set:<input size=\"2\" class=\"PopupInput req\" value=\"" + requirements + "\" ></div><span data-title=\"Displaying satisfied requirements text on the link\"><input type=\"checkbox\"\" class=\"checkbox-round showReq\"></span><span class=\"iconSpan\" style=\"margin-left: -8px;\" data-title=\"" + this.getRequirementsPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span><img class=\"urlSvg\" src=\"assets/SVG/url.svg\"></div>";
    }
    popupEventsDbClick(element, init) {
      const this_ = this;
      let isProb = false;
      return {
        "click .urlSvg": function () {
          const dataToRemember = this_.getPopupDataToRemember(this);
          this_.openLinkURLEditing(init).afterClosed().toPromise().then(res => {
            this_.rightClickHandlePopoup(init.paper.findViewByModel(element).el, init);
            this_.restorePopupData(dataToRemember);
          });
          this.remove();
        },
        "click .btnUpdate": function () {
          init.getOpmModel().logForUndo("link labels update");
          const path = this.$(".pth").val().trim();
          let prob = this_.isLegalProboballity(this.$(".prob").val()).trim() ? this_.isLegalProboballity(this.$(".prob").val().trim()) : this_.attributes.Probability;
          if (prob === " ") {
            prob = "";
          }
          const rate = this.$(".rate").val()?.trim().length ? this.$(".rate").val().trim() : undefined;
          const rateUnits = this.$(".rateUnits").val();
          const textArray = [];
          const requirementsText = this.$(".req").val()?.trim();
          const showRequirementsLabel = this.$(".showReq")[0].checked;
          element.set("requirements", requirementsText);
          element.set("showRequirementsLabel", showRequirementsLabel);
          // if (path && (/\w/.test(path))) { // if a path field was inputted
          //   const val = path.trim();
          //   textArray.push(val);
          // }
          if (prob) {
            // && (/\d/.test(prob))) {
            isProb = true;
            textArray.push("Pr = " + prob.toLowerCase().trim());
          }
          if (rate && rate !== "" && /\S/.test(rate)) {
            textArray.push("Rate = " + rate.toLowerCase().trim() + (rateUnits ? " [" + rateUnits.trim() + "]" : ""));
          }
          const trgLblTxt = this.$(".trgt").val() !== undefined && /\S/.test(this.$(".trgt").val().trim()) ? this.$(".trgt").val().toLowerCase().trim() : "";
          const srcLblTxt = this.$(".srce").val() !== undefined && /\S/.test(this.$(".srce").val().trim()) ? this.$(".srce").val().toLowerCase().trim() : "";
          const probabillityRatePathLblTxt = textArray.join("; ");
          const minTimeTxt = "Min: " + this.$(".min").val() + this.$("#selectMin").val();
          const maxTimeTxt = "Max: " + this.$(".max").val() + this.$("#selectMax").val();
          let symbulTxt;
          if (element.labels().length > 0) {
            element.labels().forEach(el => {
              if (el.attrs.label.text === "c" || el.attrs.label.text === "e" || el.attrs.label.text.includes("¬")) {
                symbulTxt = el.attrs.label.text;
              }
            });
          }
          if (element.labels().length > 0) {
            element.deleteLabel();
          }
          // sets the label for target multiplicity.
          element.setLabelsOLinks(trgLblTxt, 0.9, -10);
          // sets the label for source multiplicity.
          element.setLabelsOLinks(srcLblTxt, 0.1, -10, undefined, undefined, undefined, srcLblTxt?.trim() !== "?");
          if (path !== this_.get("Path")) {
            this_.updatePathToAllRelatedRelations(element, path, this_.get("Path"));
          }
          // sets the label/s for path, probability & rate multiplicity.
          if (path || prob || rate) {
            element.setLabelsOLinks(probabillityRatePathLblTxt, 0.55, 10);
          }
          if (showRequirementsLabel && requirementsText.length > 0) {
            element.setLabelsOLinks("Satisfied: " + requirementsText, 0.5, 0, -30);
          }
          // sets the label for minimum time multiplicity.
          // if (this.$('.min').val())
          //   element.setLabelsOLinks(minTimeTxt, 0.3, 20, -15);
          // sets the label for maximum time multiplicity.
          // if (this.$('.max').val())
          //   element.setLabelsOLinks(maxTimeTxt, 0.3, 75);
          // sets the label for condition/ event  multiplicity.
          if (symbulTxt) {
            element.setLabelsOLinks(symbulTxt, 0.9, 10, -5, undefined, undefined, false);
          }
          // console.log(element.labels());
          element.set({
            sourceMultiplicity: this.$(".srce").val()?.trim(),
            targetMultiplicity: this.$(".trgt").val()?.trim(),
            Path: this.$(".pth").val()?.trim(),
            Probability: isProb ? prob : "",
            rate: this.$(".rate").val()?.trim(),
            rateUnits: this.$(".rateUnits").val(),
            timeMin: this.$(".min").val(),
            timeMinVal: this.$("#selectMin").val(),
            timeMaxVal: this.$("#selectMax").val(),
            timeMax: this.$(".max").val()
          });
          this.remove();
          const labelsArray = {
            sourceMultiplicity: this.$(".srce").val(),
            targetMultiplicity: this.$(".trgt").val(),
            Path: this.$(".pth").val()?.trim(),
            Probability: isProb ? prob : "",
            rate: this.$(".rate").val()?.trim(),
            rateUnits: this.$(".rateUnits").val()
          };
          const link = init.getOpmModel().getVisualElementById(element.id);
          const links = link.setLabels(labelsArray);
          for (const l of links) {
            const cell = element.graph.getCell(l.id);
            if (cell) {
              cell.setPath(l.path);
            }
          }
          this_.addDblClickListenerForLabels();
        },
        /**
         * By clicking on the 'Copy Style' button, we keep the style of the source link in the 'linkCopiedStyleParams' dictionary.
         */
        "click .btnStyleCopy": function () {
          this.remove();
          init.linkCopiedStyleParams = {};
          init.linkCopiedStyleParams.strokeWidth = this_.attr("line/strokeWidth");
          init.linkCopiedStyleParams.strokeColor = this_.attr("line/stroke");
        },
        "click .btnStyle": function () {
          this.remove();
          const stylePopupContent = ["Link color: <input type=\"color\" class=\"linkColor PopupColorInput\" value=" + this_.attr("link/fill") + "><br>", "Link width: <input type=\"width\" style=\"width:35px;padding-top: 5px\" class=\"linkwidth PopupInput\" value=" + this_.attr("line/strokeWidth") + "><br>", "<div class=\"center\" style=\"padding-top: 5px\"><button class=\"btnUpdateStyle Popup\" style=\"margin-left: 6px\">Update Style</button></div>"];
          const stylePopupEvents = {
            "click .btnUpdateStyle": function () {
              if (this.$(".linkwidth").val() < "1" || this.$(".linkwidth").val() > "6") {
                const errorMessage = "Maximum width is 6";
                (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(errorMessage, 5000, "Error");
                return;
              }
              init.getOpmModel().logForUndo("link style change");
              this_.attr({
                line: {
                  stroke: this.$(".linkColor").val()
                }
              });
              this_.attr({
                line: {
                  strokeWidth: this.$(".linkwidth").val()
                }
              });
              this_.updateMarkersColor(this.$(".linkColor").val());
              this.remove();
            }
          };
          const el = init.paper.findViewByModel(this_).el;
          (0, configuration_rappidEnviromentFunctionality_shared /* .popupGenerator */.sk)(el, stylePopupContent, stylePopupEvents).render();
          (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
          $(".linkColor")[0].value = this_.attr("line/stroke");
        },
        "click .rateUnits": function () {
          /*handling choosing the units (rate units) pop up*/
          this_.unitsPopUp(init, this);
        }
      };
    }
    /* handling choosing units (for the rate)*/
    unitsPopUp(init, linkPopUp) {
      const this_ = this;
      const target = init.paper.findViewByModel(this_).el;
      const units = this_.attributes.rateUnits ? this_.attributes.rateUnits : ""; // current units if existed
      const popup = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.ui.Popup({
        id: "units_popup",
        events: {
          "input #value": function () {
            const value = this.$("#value").val() ? this.$("#value").val() : "";
            const select = this.$("ul");
            select.empty();
            select.html((0, components_units_units_popup /* .unitsHtml */.Pt)(value));
          },
          "click .li-selection": components_units_units_popup /* .click_li_selection_function */.Np,
          // handling selecting a unit
          "click #update": function () {
            const new_val = this.$("#value").val();
            this_.attributes.rateUnits = new_val;
            popup.remove();
            new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.ui.Popup({
              events: linkPopUp.events,
              content: linkPopUp.$el.contents(),
              target: target
            }).render();
            /* updating the new pop rate units value and styling it*/
            const unitsPopup = document.getElementsByClassName("joint-popup joint-theme-modern")[0];
            const elm = unitsPopup.getElementsByClassName("rateUnits")[0];
            elm.value = new_val;
            (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
          }
        },
        content: [(0, components_units_units_popup /* .createUnitsPopUpContent */.D4)(units, " Rate Units:")],
        target: target
      }).render();
      (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
    }
    // deleteLabel() {
    //   if (this.labels().length > 0) {
    //     for (let i = 0; i < this.labels().length; i++) {
    //       this.removeLabel(this.labels()[i]);
    //     }
    //     this.deleteLabel();
    //   }
    // }
    /**
     * Alon: link pair are drawn with path (a-z)
     */
    // pathLettering() {
    //   const thisText = String.fromCharCode(this.getCounter() + 96);
    //   return {thisText};
    // }
    // addPath() {
    //   const target = this.targetElement;
    //   const connectedLinks = this.graph.getConnectedLinks(target, {inbound: true});
    //   for (let i = 0; i < connectedLinks.length; i++) {
    //     if ( connectedLinks[i].partner) {
    //       OpmProceduralLink.pairCounter++;
    //     }
    //   }
    //   this.set('labels', [
    //     { position: 0.5, attrs: { text: {
    //           text: this.pathLettering().thisText} } }]);
    // }
    updatePathToAllRelatedRelations(link, newPath, oldPath) {
      const model = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel();
      const logical = model.getLogicalElementByVisualId(link.id);
      const related = model.getRelatedRelationsByLogicalLink(logical);
      // link.set('Path', newPath);
      if (!related) {
        return;
      }
      for (const log of related) {
        for (const vis of log.visualElements) {
          if (vis.path === oldPath || !vis.path && !link.get("Path")) {
            vis.path = newPath;
            const drawn = this.graph.getCell(vis.id);
            if (!drawn) {
              if (vis.labels) {
                const visualLabelToUpdate = vis.labels.find(lb => lb.attrs.label.text === oldPath);
                if (visualLabelToUpdate) {
                  visualLabelToUpdate.attrs.label.text = newPath;
                }
              }
              continue;
            }
            drawn.set("Path", vis.path);
            if (!drawn.get("labels")) {
              if (drawn !== this) {
                drawn.setLabelsOLinks(vis.path, 0.5, 0);
              }
              continue;
            }
            const currentLabel = drawn.get("labels").find(lb => lb.attrs.label.text === oldPath);
            if (!currentLabel) {
              continue;
            }
            const idxLbl = drawn.labels().indexOf(currentLabel);
            currentLabel.attrs.label.text = newPath;
            if (idxLbl !== -1) {
              drawn.removeLabel(idxLbl);
              drawn.insertLabel(-1, currentLabel);
            }
          }
        }
      }
    }
    getAllSourcesOfLinkType() {
      let links = [];
      if (this.targetElement.attributes.type === "opm.Process") {
        links = this.graph.getConnectedLinks(this.targetElement);
      } else {
        links = this.graph.getConnectedLinks(this.sourceElement);
      }
      const cells = [];
      const sources = [];
      const multiplicity = [];
      for (const link of links) {
        if (link.attributes.name === this.attributes.name && !link.attributes.partner) {
          const source = link.getSourceElement().attributes.type != "opm.Process" ? link.getSourceElement() : link.getTargetElement();
          sources.push(source);
          multiplicity.push(link.attributes.sourceMultiplicity);
          cells.push(link);
        }
      }
      return [sources, multiplicity, cells];
    }
    removeHandle(options) {
      super.removeHandle(options);
      let element;
      // if there is an Arc on the source side of the link - remove it an redraw it if it still should have an arc
      if (this.getSourceArcOnLink() != null) {
        element = this.sourceElement;
        this.getSourceArcOnLink().remove();
        OrXorArcs /* .Arc */.l.redrawAllArcs(element, options, true);
      }
      // if there is an Arc on the target side of the link - remove it an redraw it if it still should have an arc
      if (this.getTargetArcOnLink() != null) {
        element = this.targetElement;
        this.getTargetArcOnLink().remove();
        OrXorArcs /* .Arc */.l.redrawAllArcs(element, options, true);
      }
    }
    // When link is pressed we will make its arcs transparent (until pointerup)
    pointerDownHandle(cellView, initRappid) {
      OrXorArcs /* .Arc */.l.makeLinksArcsTransparent(this);
    }
    mergeToOrXorIfPlacedOnOtherLink(cellView, options) {
      if (this.getSourceElement() && this.target().x && this.target().y || this.getTargetElement() && this.source().x && this.source().y) {
        let side;
        if (this.getSourceElement() && this.target().x && this.target().y) {
          side = "target";
        } else {
          side = "source";
        }
        const xPoint = side === "target" ? this.target().x : this.source().x;
        const yPoint = side === "target" ? this.target().y : this.source().y;
        const clientPoint = options.paper.localToClientPoint(xPoint, yPoint);
        const elements = document.elementsFromPoint(clientPoint.x, clientPoint.y);
        const htmlLinks = elements.filter(el => el.parentElement && el.parentElement.classList.value.includes("joint-link"));
        let jointLinks = htmlLinks.map(htmlLink => options.graph.getCell(htmlLink.parentElement.getAttribute("model-id"))).filter(l => l.constructor.name === this.constructor.name && l !== this);
        if (side === "target" && jointLinks.find(l => l.getTargetArcOnLink())) {
          jointLinks = jointLinks.concat(jointLinks.find(l => l.getTargetArcOnLink()).getTargetArcOnLink().getLinksArray());
        }
        if (side === "source" && jointLinks.find(l => l.getSourceArcOnLink())) {
          jointLinks = jointLinks.concat(jointLinks.find(l => l.getSourceArcOnLink()).getSourceArcOnLink().getLinksArray());
        }
        jointLinks = (0, configuration_rappidEnviromentFunctionality_shared /* .removeDuplicationsInArray */.vN)(jointLinks);
        if (jointLinks.length < 1) {
          return;
        }
        options.getOpmModel().setShouldLogForUndoRedo(false, "mergeToOrXorIfPlacedOnOtherLink");
        const linksElement = side === "target" ? jointLinks.find(lnk => lnk !== this).getTargetElement() : jointLinks.find(lnk => lnk !== this).getSourceElement();
        let bestPort;
        const lv = jointLinks[0].findView(options.paper);
        if (side === "target") {
          bestPort = jointLinks.find(lnk => lnk.target().port) ? jointLinks.find(lnk => lnk.target().port).target().port : jointLinks[0].getTargetElement().findClosestEmptyPort(lv.getPointAtRatio(1));
        } else {
          bestPort = jointLinks.find(lnk => lnk.source().port) ? jointLinks.find(lnk => lnk.source().port).source().port : jointLinks[0].getSourceElement().findClosestEmptyPort(lv.getPointAtRatio(0));
        }
        if (!bestPort) {
          const point = side === "target" ? this.target() : this.source();
          bestPort = linksElement.findClosestEmptyPort(point) - 1;
        }
        if (bestPort !== -1) {
          if (side === "target") {
            this.target({
              id: linksElement.id,
              port: bestPort
            });
            this.getVisual().targetVisualElementPort = bestPort;
            for (const lnk of jointLinks) {
              lnk.target({
                id: linksElement.id,
                port: bestPort
              });
              lnk.getVisual().targetVisualElementPort = bestPort;
            }
          } else {
            this.source({
              id: linksElement.id,
              port: bestPort
            });
            this.getVisual().sourceVisualElementPort = bestPort;
            for (const lnk of jointLinks) {
              lnk.source({
                id: linksElement.id,
                port: bestPort
              });
              lnk.getVisual().sourceVisualElementPort = bestPort;
            }
          }
          options.graphService.updateLinksView([...jointLinks.map(ln => ln.getVisual()), this.getVisual()]);
          setTimeout(() => {
            linksElement.pointerUpHandle(options.paper.findViewByModel(linksElement), options, undefined);
          }, 50);
        }
      }
      options.getOpmModel().setShouldLogForUndoRedo(true, "mergeToOrXorIfPlacedOnOtherLink");
    }
    pointerUpHandle(cellView, initRappid, $event) {
      if (this.getSourceElement() && this.target().x && this.target().y || this.getTargetElement() && this.source().x && this.source().y) {
        this.mergeToOrXorIfPlacedOnOtherLink(cellView, initRappid);
      }
      super.pointerUpHandle(cellView, initRappid, $event); // call the parent function
      // this.resizePort();
      if (cellView.model.graph) {
        if (cellView.model.changed.vertices) {
          OrXorArcs /* .Arc */.l.redrawLinkArcs(cellView.model, initRappid);
        }
        // if the pointer up wasn't for add or remove a vertex the it was for changing source\ target
        if (!this.changed.vertices || this.constructor.name.includes("InvocationLink") && (this.changed.target || this.changed.source)) {
          // if a port was updated then there is XOR connection by default
          const logicalRelation = initRappid.opmModel.getLogicalElementByVisualId(this.get("id"));
          // no close source link found but there was logical connection before
          if (!this.repositionPort("source", this.getSourceElement(), {
            outbound: true
          }, initRappid) && logicalRelation.sourceLogicalConnection != null) {
            // un-link source port in all opds and update connection
            logicalRelation.disconnectSourceLogicalConnectionAllVisuals();
            const previousArcPort = this.removeArc({
              outbound: true
            }, this); // (source)
            // If after we took out the link there still should be an arc - Drawing it
            this.drawArc(initRappid, "source", this.getSourceElement(), previousArcPort, {
              outbound: true
            });
          }
          // no close target link found but there was logical connection before
          if (!this.repositionPort("target", this.getTargetElement(), {
            inbound: true
          }, initRappid) && logicalRelation.targetLogicalConnection != null) {
            // un-link target port in all opds and update connection
            logicalRelation.disconnectTargetLogicalConnectionAllVisuals();
            const previousArcPort = this.removeArc({
              inbound: true
            }, this); // (target)
            // If after we took out the link there still should be an arc - Drawing it
            this.drawArc(initRappid, "target", this.getTargetElement(), previousArcPort, {
              inbound: true
            });
          }
          // this.resizePort();
        }
      }
    }
    areBothEnablers(link1, link2) {
      if (link1.constructor.name.includes("Instrument") && link2.constructor.name.includes("Agent")) {
        return true;
      }
      if (link1.constructor.name.includes("Agent") && link2.constructor.name.includes("Instrument")) {
        return true;
      }
      return false;
    }
    // If a link connected to a port and there is another link of the same type on or two ports
    // next to the current the the port of the current link will be updated so that the bot be
    // at the same port.
    // side: source or target, element: connected element on side, linkDirection: outbound or inbound
    repositionPort(side, element, linkDirection, initRappid, resultLinksFlag = false) {
      if (this.get(side).port) {
        let sameLinks = this.graph.getConnectedLinks(element, linkDirection);
        sameLinks = sameLinks.filter(item => (item.constructor.name === this.constructor.name || this.areBothEnablers(this, item)) && item !== this);
        if (resultLinksFlag) {
          const trgt = this.get("target");
          const parentId = this.graph.getCell(trgt.id).get("parent");
          sameLinks = sameLinks.filter(item => item.graph.getCell(item.get("target").id).get("parent") && item.graph.getCell(item.get("target").id).get("parent") === parentId);
        }
        this.negation = this.negation === undefined || this.negation === null || this.negation === false ? false : true;
        for (let i = 0; i < sameLinks.length; i++) {
          // if link of the same type has same condition\event definition
          sameLinks[i].condition = sameLinks[i].condition ? true : false;
          sameLinks[i].event = sameLinks[i].event ? true : false;
          sameLinks[i].negation = sameLinks[i].negation ? true : false;
          if (sameLinks[i].condition !== this.condition) {
            continue;
          }
          if (sameLinks[i].event !== this.event) {
            continue;
          }
          if (sameLinks[i].negation !== this.negation) {
            continue;
          }
          // if another link starts\ends in a port that is close to the current link port
          // close ports are ports with 2 step distance. objects and processes have 30 ports.
          // Therefore ports 29/0, 30/0, 30/1 are with distance>=29 and are close.
          const sameLinkPoint = side === "source" ? initRappid.paper.findViewByModel(sameLinks[i]).sourcePoint : initRappid.paper.findViewByModel(sameLinks[i]).targetPoint;
          const thisLinkPoint = side === "source" ? initRappid.paper.findViewByModel(this).sourcePoint : initRappid.paper.findViewByModel(this).targetPoint;
          const pointsDistance = Math.sqrt(Math.pow(sameLinkPoint.x - thisLinkPoint.x, 2) + Math.pow(sameLinkPoint.y - thisLinkPoint.y, 2));
          const distanceToMerge = resultLinksFlag ? 5 : 15;
          if (sameLinks[i].get(side).port && pointsDistance <= distanceToMerge) {
            const nonConsistantOpd = initRappid.opmModel.getOpdWithOneMissingLink(sameLinks[i].get("id"), this.get("id"));
            if (nonConsistantOpd) {
              (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("One or more links are missing in " + nonConsistantOpd + "while at least another one exists there. Add missing links and try again.", null, "Error");
            } else {
              // no consistency problems. can update port and connection
              const connectionPort = sameLinks[i].get(side).port ? sameLinks[i].get(side).port : this.get(side).port;
              this.set(side, {
                id: this.get(side).id,
                port: connectionPort
              });
              sameLinks[i].set(side, {
                id: sameLinks[i].get(side).id,
                port: connectionPort
              });
              initRappid.paper.findViewByModel(this).hideTools();
              if ($("[joint-selector=button]") || $("[joint-selector=icon]") || $("[data-tool-name=source-arrowhead]")) {
                $("[joint-selector=button]").remove();
                $("[joint-selector=icon]").remove();
                $("[data-tool-name=source-arrowhead]").remove();
              }
              const logicalSameLink = initRappid.opmModel.getLogicalElementByVisualId(sameLinks[i].get("id"));
              initRappid.opmModel.getLogicalElementByVisualId(this.get("id")).updatePortAndDataToAllVisuals(logicalSameLink, side);
              // draw arc
              this.drawArc(initRappid, side, element, sameLinks[i].get(side).port, linkDirection);
              return true;
            }
          }
        }
      }
      return false;
    }
    // linkDirection: inbound or outbound
    // port: number of the port
    // element: the element from which (if source) or to which (if target) links are connected
    // side: source or target
    drawArc(initRappid, side, element, port, linkDirection) {
      let myArcType = 1;
      // getting the logical representation of the link
      const logicalLink = initRappid.opmModel.getLogicalElementByVisualId(this.id);
      // finding the type of the loogical connection
      const currentLogicalConnection = side === "source" ? logicalLink.sourceLogicalConnection : logicalLink.targetLogicalConnection;
      if (currentLogicalConnection != null) {
        myArcType = currentLogicalConnection;
      }
      // get all link connected to the element
      let linksToConnect = element.graph.getConnectedLinks(element, linkDirection);
      linksToConnect.forEach(l => {
        l.condition = l.condition ? true : false;
        l.event = l.event ? true : false;
        l.negation = l.negation ? true : false;
      });
      // all the links get out from the same source
      linksToConnect = linksToConnect.filter(link => link.get(side).port === port && (link.constructor.name === this.constructor.name || this.areBothEnablers(this, link)) && link.condition === this.condition && link.event === this.event && link.negation === this.negation && link.attr("./display") !== "none");
      // if there are less than 2 link - no need to draw an Arc
      if (linksToConnect.length < 2) {
        return;
      }
      // if there is already an arc - remove it
      const previousArc = side === "source" ? linksToConnect[0].getSourceArcOnLink() : linksToConnect[0].getTargetArcOnLink();
      if (previousArc) {
        previousArc.remove();
      }
      const pointsArray = new Array();
      // finding the points with distance 30 on all the links for finding angles
      for (let i = 0; i < linksToConnect.length; i++) {
        if (!initRappid.paper) {
          pointsArray.push({
            x: 0,
            y: 0
          });
          continue;
        }
        const linkView = initRappid.paper.findViewByModel(linksToConnect[i]);
        if (!linkView) {
          continue;
        }
        const line = configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.line(linkView.sourcePoint, linkView.targetPoint);
        let point;
        if (side === "source") {
          // point = linkView.getPointAtRatio(0.05);
          point = linkView.getPointAtLength(30);
        } else {
          const sourcePoint = linkView.sourceAnchor;
          const targetPoint = linkView.targetAnchor;
          const length = linkView.metrics.length;
          // point = linkView.getPointAtRatio(0.95);
          point = linkView.getPointAtLength(-30);
        }
        pointsArray.push(point);
      }
      let arc;
      if (initRappid.paper) {
        // origin point or target point of all the links to connect
        let dockPoint;
        const linkView = initRappid.paper.findViewByModel(linksToConnect[0]);
        if (!linkView) {
          return;
        }
        const line = configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.line(linkView.sourcePoint, linkView.targetPoint);
        if (side === "source") {
          // dockPoint = linkView.getPointAtLength(0);
          dockPoint = line.start;
        } else {
          const sourcePoint = linkView.sourceAnchor;
          const targetPoint = linkView.targetAnchor;
          const length = linkView.metrics.length;
          // dockPoint = linkView.getPointAtLength(length);
          dockPoint = line.end;
        }
        // first point of the arc
        let firstPoint;
        // second point of the arc
        let secondPoint;
        let largestAngle = 0;
        // finding the 2 points with the max angle that is < 180
        for (let i = 0; i < pointsArray.length; i++) {
          for (let j = i + 1; j < pointsArray.length; j++) {
            let currentAngle = dockPoint.angleBetween(pointsArray[i], pointsArray[j]);
            if (currentAngle > 180) {
              currentAngle = 360 - currentAngle;
            }
            if (currentAngle > largestAngle) {
              largestAngle = currentAngle;
              firstPoint = pointsArray[i];
              secondPoint = pointsArray[j];
            }
          }
        }
        // Creating a point for later use as an X-axis with the dockPoint for calculating angles
        const axisPoint = {
          x: dockPoint.x + 5,
          y: dockPoint.y
        };
        let firstAngle = 90 + dockPoint.angleBetween(firstPoint, axisPoint);
        let secondAngle = 90 + dockPoint.angleBetween(secondPoint, axisPoint);
        if (firstAngle > secondAngle) {
          const temp = firstAngle;
          firstAngle = secondAngle;
          secondAngle = temp;
        }
        // creating the drawn representation of the arc
        arc = new OrXorArcs /* .Arc */.l(initRappid, linksToConnect.slice(0), dockPoint.x, dockPoint.y, side, firstAngle, secondAngle, linksToConnect[0].get(side).port);
      } else {
        arc = new OrXorArcs /* .Arc */.l(initRappid, linksToConnect.slice(0), 0, 0, side, 10, 20, linksToConnect[0].get(side).port);
      }
      // adding the arc to the screen
      if (initRappid.paper) {
        arc.getArcVec().appendTo(initRappid.paper.viewport);
      }
      // Adding the arc to all of the links in the relation of OR/XOR
      if (side === "source") {
        linksToConnect.forEach(function (linkInTheRelation) {
          linkInTheRelation.setSourceArcOnLink(arc);
        });
      } else {
        linksToConnect.forEach(function (linkInTheRelation) {
          linkInTheRelation.setTargetArcOnLink(arc);
        });
      }
      initRappid.oplService.oplSwitch.next("change arch");
    }
    // removing an Arc from the links
    removeArc(linkDiretion, link) {
      const parentElement = linkDiretion.outbound === true ? link.getSourceElement() : link.getTargetElement();
      const side = linkDiretion.outbound === true ? "source" : "target";
      let sameLinks = this.graph.getConnectedLinks(parentElement, linkDiretion);
      let linkPort;
      if (linkDiretion.outbound === true) {
        linkPort = link.getSourceArcOnLink() ? link.getSourceArcOnLink().port : null;
      } else {
        linkPort = link.getTargetArcOnLink() ? link.getTargetArcOnLink().port : null;
      }
      if (!linkPort) {
        return;
      }
      sameLinks = sameLinks.filter(linkInRelation => linkInRelation.get(side).port === linkPort);
      let removedArcPort;
      if (linkDiretion.outbound === true) {
        removedArcPort = link.getSourceArcOnLink().getPort();
        link.getSourceArcOnLink().remove();
        link.setSourceArcOnLink(null);
        sameLinks.forEach(function (item) {
          if (item.getSourceArcOnLink() !== null) {
            item.setSourceArcOnLink(null);
          }
        });
      } else {
        removedArcPort = link.getTargetArcOnLink().getPort();
        link.getTargetArcOnLink().remove();
        link.setTargetArcOnLink(null);
        sameLinks.forEach(function (item) {
          if (item.getTargetArcOnLink() !== null) {
            item.setTargetArcOnLink(null);
          }
        });
      }
      return removedArcPort;
    }
    getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      return [verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, removeButton];
    }
    getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      return [verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, removeButton];
    }
    removePath() {
      const mates = this.getMates();
      this.attributes.Path = undefined;
      mates.forEach(m => m.remove());
    }
    setPath(label) {
      this.attributes.Path = label;
      // this.deleteLa  bel();
      this.setLabelsOLinks(label, 0.4);
    }
    getMates() {
      return [];
    }
    isLegalProboballity(value) {
      let stringArray = Array.from(value);
      const hasLetters = this.checkforLettersInTheString(stringArray);
      if (hasLetters) {
        let errorMsg = "Probabillity may only be numbers and mustn't include letters";
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(errorMsg, null, "Error", true);
        return;
      }

      if (stringArray.length === 0) {
        return " ";
      }
      const hasDecimalPoint = stringArray.indexOf(".") !== -1;
      const isFirstCharEqualZero = stringArray[0] === "0";
      const isSecondCharDecimalPoint = stringArray.indexOf(".") === 1;
      if (hasDecimalPoint && isFirstCharEqualZero && isSecondCharDecimalPoint) {
        return value;
      }
      if (hasDecimalPoint && !isFirstCharEqualZero) {
        let placesToMoveLeft = Math.pow(10, stringArray.indexOf("."));
        let stringToInt = parseInt(value);
        return (stringToInt / placesToMoveLeft).toString();
      }
      if (value && !hasDecimalPoint && !isFirstCharEqualZero) {
        return "0." + value;
      }
    }
    checkforLettersInTheString(stringArray) {
      for (let char of stringArray) {
        if (char.toLowerCase() != char.toUpperCase()) {
          return true;
        }
      }
      return false;
    }
    switchEffectButton() {
      return new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Button({
        markup: [
        // {
        //   tagName: 'circle',
        //   selector: 'button',
        //   attributes: {
        //     'r': 15,
        //     'fill': 'rgba(74, 185, 236, 0)',
        //     'cursor': 'pointer'
        //   }
        // },
        {
          tagName: "path",
          selector: "icon",
          attributes: {
            d: "M 0 2 H 7 V 0 L 12 3 L 7 6 L 7 3 L 0 3 z M 3 7 L -5 7 L -5 5 L -9 8 L -5 11 L -5 8 L 3 8 z ",
            fill: "#2B3E8A",
            stroke: "#2B3E8A",
            "stroke-width": 1,
            cursor: "pointer",
            transform: "translate(7,0) rotate(90) scale(1.4)",
            "z-index": "999"
          }
        }],
        distance: "50%",
        action: null
      });
    }
    /*
    Gets information about the distributing type to be executed: "inZoomed" or "structural refinement"
    (i.e. "classic" unfolding). The argument "fatherType" assists in the distributing procedure that
    occurs in "structuralSplit" method.
     */
    switchFromUnifiedToDistributed(state, fatherType) {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const model = init.getOpmModel();
      const visualLink = model.getVisualElementById(this.id);
      const ret = state === "inZoomed" ? model.inzoomSplit(visualLink) : model.structuralSplit(visualLink, fatherType);
      const drawnLinkToRemove = init.graph.getCell(ret.remove.id);
      if (drawnLinkToRemove) {
        drawnLinkToRemove.remove();
      }
      init.graphService.updateLinksView(ret.show || []);
    }
    /*
    Gets information about the union procedure type to be executed: "inZoomed" or "structural refinement"
    (i.e. "classic" unfolding). The argument "fatherType" assist in the union procedure that occurs in
    "structuralUnite" method.
     */
    switchFromDistributedToUnified(state, fatherType) {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const model = init.getOpmModel();
      const visualLink = model.getVisualElementById(this.id);
      const ret = state === "inZoomed" ? model.inzoomUnite(visualLink) : model.structuralUnite(visualLink, fatherType);
      for (const link of ret.remove) {
        const drawnLinkToRemove = init.graph.getCell(link.id);
        if (drawnLinkToRemove) {
          drawnLinkToRemove.remove();
        }
      }
      init.graphService.updateLinksView(ret.show || []);
    }
    /*
     Finds out if all other sub-processes are connected with enabler links to the same source object
     */
    isAllSiblingsAlsoConnected() {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const model = init.getOpmModel();
      const sourceVis = this.getSourceElement().getVisual();
      const targetVis = this.getTargetElement().getVisual();
      const father = targetVis.fatherObject;
      const children = father.children.filter(ch => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualProcess(ch));
      const connectionType = model.getVisualElementById(this.id).type;
      const instrumentLinksFromSource = sourceVis.getLinks().outGoing.filter(link => link.type === connectionType);
      let count = 0;
      for (const child of children) {
        for (const link of instrumentLinksFromSource) {
          if (link.target === child) {
            count++;
          }
        }
      }
      return count === children.length;
    }
    /*
     An assistant method, that determines if a visual thing is connected with procedural links,
     either out-going or in-going.
     */
    isAlone(sideKick) {
      if (sideKick.getLinks().outGoing.filter(link => link.isStructuralLink()).length > 0) {
        return false;
      } else if (sideKick.getLinks().inGoing.filter(link => link.isStructuralLink()).length > 0) {
        return false;
      }
      return true;
    }
    /*
    Determine if all out-going procedural links from visual-process are of the same type.
     */
    isAllStructuralsSameTypeProc(targetVis) {
      const structLinksOut = targetVis.getLinks().outGoing.filter(link => link.isStructuralLink());
      // const structLinksIn = targetVis.getLinks().inGoing.filter(link => link.isStructuralLink());
      // if (structLinksIn.length > 0) {
      //   return false;
      // }
      if (structLinksOut.length === 0) {
        return false;
      }
      const lnkType = structLinksOut[0].type;
      for (const link of structLinksOut) {
        if (link.type !== lnkType) {
          return false;
        }
      }
      return true;
    }
    /*
    Determine if all out-going procedural links from visual-object are of the same type.
     */
    isAllStructuralsSameTypeObj(sourceVis) {
      const structLinksOut = sourceVis.getLinks().outGoing.filter(link => link.isStructuralLink());
      const structLinksIn = sourceVis.getLinks().inGoing.filter(link => link.isStructuralLink());
      if (structLinksIn.length > 0) {
        return false;
      }
      if (structLinksOut.length === 0) {
        return false;
      }
      const lnkType = structLinksOut[0].type;
      for (const link of structLinksOut) {
        if (link.type !== lnkType) {
          return false;
        }
      }
      return true;
    }
    /*
    Find out if all sub-objects/processes are also connected to the source/target element with the same enabler link type.
     */
    isAllOtherPartsAlsoConnectedWithSameStruct(visThing) {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const model = init.getOpmModel();
      const sourceVis = this.getSourceElement().getVisual();
      const targetVis = this.getTargetElement().getVisual();
      const connectionType = model.getVisualElementById(this.id).type;
      const structLinks = visThing.getLinks().inGoing.filter(link => link.isStructuralLink());
      let flag;
      if (structLinks.length === 0 || structLinks.length > 1) {
        return false;
      }
      const structuralFather = structLinks[0].sourceVisualElement;
      let enablerLinksToTarget;
      if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualObject(structuralFather)) {
        if (!this.isAllStructuralsSameTypeObj(structuralFather)) {
          return false;
        }
        enablerLinksToTarget = targetVis.getLinks().inGoing.filter(link => link.type === connectionType);
        flag = "object";
      } else {
        if (!this.isAllStructuralsSameTypeProc(structuralFather)) {
          return false;
        }
        enablerLinksToTarget = sourceVis.getLinks().outGoing.filter(link => link.type === connectionType);
        flag = "process";
      }
      const structLinksToChildren = structuralFather.getLinks().outGoing.filter(link => link.isStructuralLink());
      const otherParts = [];
      for (const link of structLinksToChildren) {
        otherParts.push(link.target);
      }
      let count = 0;
      for (const part of otherParts) {
        for (const link of enablerLinksToTarget) {
          if (flag === "object") {
            if (link.source === part) {
              count++;
            }
          } else if (link.target === part) {
            count++;
          }
        }
      }
      return count === otherParts.length;
    }
    /*
      Augmenting the toolset that pops-up whenever the user hovers over a link. Determine in which situations the
      "toggle enabler link" icon should be displayed.
    */
    getEnablersToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      const that = this;
      const distributeButton = this.distributeButton();
      const unionButton = this.unionButton();
      const targetVis = this.getTargetElement().getVisual();
      const sourceVis = this.getSourceElement().getVisual();
      let fatherType;
      let state;
      // case A: process is InZoomed:
      if (targetVis.refineable && targetVis.children.length > 0) {
        state = "inZoomed";
        fatherType = null;
        distributeButton.options.action = () => that.switchFromUnifiedToDistributed(state, fatherType);
        return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([distributeButton]);
      }
      // case B: process is sub-process and all sub-processes are connected:
      if (!targetVis.refineable && targetVis.fatherObject && this.isAllSiblingsAlsoConnected()) {
        state = "inZoomed";
        fatherType = null;
        unionButton.options.action = () => that.switchFromDistributedToUnified(state, fatherType);
        return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([unionButton]);
      }
      // case C: Distribute - object is connected to several objects in structural and similar relation:
      if (!targetVis.fatherObject && !targetVis.refineable && this.isAlone(targetVis) && this.isAllStructuralsSameTypeObj(sourceVis)) {
        state = "structural connected";
        fatherType = "object";
        distributeButton.options.action = () => that.switchFromUnifiedToDistributed(state, fatherType);
        return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([distributeButton]);
      }
      // case D: Distribute - process is connected to several processes in structural relation:
      if (!targetVis.fatherObject && targetVis.children.length === 0 && this.isAllStructuralsSameTypeProc(targetVis)) {
        state = "structural connected";
        fatherType = "process";
        distributeButton.options.action = () => that.switchFromUnifiedToDistributed(state, fatherType);
        return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([distributeButton]);
      }
      // case E: Unite - object (child) is part of structural family:
      if (!targetVis.fatherObject && !targetVis.refineable && this.isAlone(targetVis) && this.isAllOtherPartsAlsoConnectedWithSameStruct(sourceVis)) {
        state = "structural connected";
        fatherType = "object";
        unionButton.options.action = () => that.switchFromDistributedToUnified(state, fatherType);
        return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([unionButton]);
      }
      // case F: Unite - process (child) is part of structural family:
      if (!targetVis.fatherObject && !targetVis.refineable && this.isAllOtherPartsAlsoConnectedWithSameStruct(targetVis)) {
        state = "structural connected";
        fatherType = "process";
        unionButton.options.action = () => that.switchFromDistributedToUnified(state, fatherType);
        return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([unionButton]);
      }
      return this.getProceduralToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
    }
    getSourceMultiplicityPopupTooltipText() {
      return "The integer number or parameter of instances of Object consumed by the Process, if greater than 1";
    }
    getTargetMultiplicityPopupTooltipText() {
      return "The integer number or parameter of instances of Object produced by the Process, if greater than 1";
    }
    getPathPopupTooltipText() {
      return "The path label determines the control flow such that the outgoing link to be followed is the one with the same label as the incoming one";
    }
    getProbabilityPopupTooltipText() {
      return "A value assigned to each link in a XOR diverging link fan that specifies the probability of following that link, such that the sum of the probabilities is 1";
    }
    getRatePopupTooltipText() {
      return "";
    }
    getRateUnitsPopupTooltipText() {
      return "Units of measurement";
    }
    distributeButton() {
      return new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Button({
        markup: [{
          tagName: "circle",
          selector: "button",
          attributes: {
            r: 18,
            fill: "rgba(74, 185, 236, 0)",
            cursor: "pointer"
          }
        }, {
          tagName: "path",
          selector: "icon",
          attributes: {
            d: "M 5.8 9.7 l 2.8 -1.9 l 2.7 -1.9 l -2.7 -1.9 l -2.8 -1.9 l 0 2.1 c -0.7 0 -1.4 0 -1.8 0 c -1.3 0.1 -2.8 -1.1 -4.5 -2.6 c -0.6 -0.5 -1.3 -1.1 -1.9 -1.6 c 0.7 -0.5 1.3 -1.1 1.9 -1.6 c 1.6 -1.5 3.2 -2.6 4.5 -2.6 l 1.8 0 l 0 2.1 l 2.8 -1.9 l 2.8 -1.9 l -2.8 -1.9 l -2.8 -1.9 l 0 2.1 l -1.8 0 c -2.6 0.1 -4.5 1.8 -6.2 3.3 c -1.6 1.6 -3.2 2.7 -4 2.6 l -5 0 l 0 3.3 l 5 0 c 0.8 -0.1 2.4 1.1 4 2.6 c 1.7 1.5 3.6 3.2 6.2 3.3 l 1.7 0.2 l 0.1 1.9 l 0 0 l 0 0 z",
            fill: "#2B3E8A",
            cursor: "pointer",
            "z-index": "999",
            transform: "scale(1.25, 1.25)"
          }
        }],
        distance: "30",
        rotate: true,
        action: null
      });
    }
    unionButton() {
      return new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.linkTools.Button({
        markup: [{
          tagName: "circle",
          selector: "button",
          attributes: {
            r: 18,
            fill: "rgba(74, 185, 236, 0)",
            cursor: "pointer"
          }
        }, {
          tagName: "path",
          selector: "icon",
          attributes: {
            d: "M 8.2 -1.7 l -2.7 -1.7 l 0 1.9 l -4.8 0 c -0.8 0.1 -2.3 -1 -3.9 -2.4 c -1.6 -1.3 -3.5 -3 -6 -3 l -1.7 0 l 0 3.1 l 1.7 0 c 1.2 -0 2.7 1 4.3 2.4 c 0.6 0.5 1.2 1 1.8 1.5 c -0.6 0.5 -1.2 1 -1.8 1.5 c -1.6 1.4 -3.1 2.5 -4.3 2.4 l -1.7 0 l 0 3.1 l 1.7 0 c 2.5 -0 4.3 -1.7 6 -3 c 1.6 -1.4 3.1 -2.5 3.9 -2.4 l 4.8 0 l 0 1.9 l 2.7 -1.7 l 2.7 -1.7 l -2.7 -1.7 l -0 0 z",
            fill: "#2B3E8A",
            cursor: "pointer",
            transform: "rotate(180) scale(1.4, 1.4)",
            "z-index": "999"
          }
        }],
        distance: "-48",
        rotate: true,
        action: null
      });
    }
  }

  /***/
}),
/***/32752: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    i: () => (/* binding */OpmStructuralLink)

  });

  class OpmStructuralLink extends OpmDefaultLink /* .OpmDefaultLink */.A {
    constructor(id) {
      super(id);
      this.attr({
        line: {
          strokeDasharray: "0"
        }
      });
      this.attr({
        line: {
          stroke: "#586D8C"
        }
      });
      this.attr({
        line: {
          strokWidth: 2
        }
      });
      this.attr({
        sourceMarker: {
          strokeWidth: 2
        }
      });
      this.attr({
        targetMarker: {
          strokeWidth: 2
        }
      });
      if (this.ordered) {
        this.mainUpperLink.setLabelsOLinks("ordered", 0.5, null);
      }
    }
    getStructuralLinkParams() {
      const params = {
        targetMultiplicity: this.get("targetMultiplicity")
      };
      return {
        ...super.getDefaultLinkParams(),
        ...params
      };
    }
    popupContentDbClick() {}
    updateTargetMultiplicity(oldVal, newVal, link, init) {
      const visuals = this.getVisual().logicalElement.visualElements.filter(vis => vis !== this.getVisual());
      const labels = link.labels() || [];
      // Identify the multiplicity label by its text (old value), not by its location.
      // This is robust to manual repositioning of the label.
      const existing = labels.find(lb => lb?.attrs?.label?.text === oldVal);
      let newLabel;
      if (newVal) {
        if (existing) {
          // Re-apply via setLabelsOLinks with the existing geometry so JointJS fully refreshes the label.
          const idx = labels.indexOf(existing);
          const distance = existing.position?.distance ?? 0.9;
          const offsetX = existing.attrs?.label?.x ?? 0;
          const offsetY = existing.attrs?.label?.y;
          const offset = existing.position?.offset;
          const keepGradient = existing.position?.args?.keepGradient !== false;
          newLabel = link.setLabelsOLinks(newVal, distance, offsetX, offsetY, offset, idx, keepGradient);
        } else {
          // No existing multiplicity label → create at default location
          newLabel = link.setLabelsOLinks(newVal, 0.9, null);
        }
      } else if (existing) {
        const idx = labels.indexOf(existing);
        if (idx >= 0) {
          link.removeLabel(idx);
        }
      }
      link.set("targetMultiplicity", newVal);
      for (const vis of visuals) {
        vis.targetMultiplicity = newVal;
        if (!vis.labels && newLabel) {
          vis.labels = [newLabel];
        } else if (vis.labels) {
          const visLabels = vis.labels;
          const badVisLabel = visLabels.find(lb => lb?.attrs?.label?.text === oldVal);
          if (badVisLabel) {
            visLabels.splice(visLabels.indexOf(badVisLabel), 1);
          }
          if (newVal && newLabel) {
            visLabels.push(newLabel);
          }
        }
      }
      this.addDblClickListenerForLabels();
    }
    addLinkToOrderedFundamental() {
      const orderedFundamentalTypes = this.sourceElement.getVisual()?.logicalElement?.orderedFundamentalTypes || [];
      if (!orderedFundamentalTypes.includes(this.getVisual().type)) {
        orderedFundamentalTypes.push(this.getVisual().type);
      }
    }
    removeLinkFromOrderedFundamental() {
      const orderedFundamentalTypes = this.sourceElement.getVisual()?.logicalElement?.orderedFundamentalTypes || [];
      if (orderedFundamentalTypes.includes(this.getVisual().type)) {
        const pos = orderedFundamentalTypes.indexOf(this.getVisual().type);
        orderedFundamentalTypes.splice(pos, 1);
      }
    }
    popupEventsDbClick(element, init) {
      const this_ = this;
      return {
        "click .urlSvg": function () {
          const dataToRemember = this_.getPopupDataToRemember(this);
          this_.openLinkURLEditing(init).afterClosed().toPromise().then(res => {
            this_.rightClickHandlePopoup(init.paper.findViewByModel(element).el, init);
            this_.restorePopupData(dataToRemember);
          });
          this.remove();
        },
        "click .btnUpdate": function () {
          init.getOpmModel().logForUndo("link labels update");
          const text = /\S/.test(this.$(".trgt").val()) ? this.$(".trgt").val().toLowerCase().trim() : undefined;
          const currentTargetMult = element.get("targetMultiplicity") || element.getVisual()?.targetMultiplicity || "";
          this_.updateTargetMultiplicity(currentTargetMult, text, element, init);
          this_.updateRequirementsLabel(element.get("requirements"), this.$(".req").val().trim(), this.$(".showReq")[0].checked, element, init);
          element.set("requirements", this.$(".req").val().trim());
          element.set("showRequirementsLabel", this.$(".showReq")[0].checked);
          if (this.$(".ordered")[0].checked) {
            this_.addLabelOrderedSubpart();
            this_.addLinkToOrderedFundamental();
          } else {
            this_.removeLinkFromOrderedFundamental();
          }
          this.remove();
        },
        /**
         * By clicking on the 'Copy Style' button, we keep the style of the source link in the 'linkCopiedStyleParams' dictionary.
         */
        "click .btnStyleCopy": function () {
          this.remove();
          init.linkCopiedStyleParams = {};
          init.linkCopiedStyleParams.strokeWidth = this_.attr("line/strokeWidth");
          init.linkCopiedStyleParams.strokeColor = this_.attr("line/stroke");
        },
        "click .btnStyle": function () {
          this.remove();
          const stylePopupContent = ["Link color: <input type=\"color\" class=\"linkColor PopupColorInput\" value=" + this_.attr("link/fill") + "><br>", "Link width: <input type=\"width\" style=\"width:35px;padding-top: 5px\" class=\"linkwidth PopupInput\" value=" + this_.attr("line/strokeWidth") + "><br>", "<button class=\"btnUpdateStyle Popup\" style=\"margin-left: 6px;margin-top:5px\">Update Style</button>"];
          const stylePopupEvents = {
            "click .btnUpdateStyle": function () {
              if (this.$(".linkwidth").val() < "1" || this.$(".linkwidth").val() > "6") {
                const errorMessage = "Maximum width is 6";
                (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(errorMessage, 5000, "Error");
                return;
              }
              init.getOpmModel().logForUndo("link style change");
              this_.attr({
                line: {
                  stroke: this.$(".linkColor").val()
                }
              });
              this_.attr({
                line: {
                  strokeWidth: this.$(".linkwidth").val()
                }
              });
              this_.mainUpperLink.attr({
                line: {
                  stroke: this.$(".linkColor").val()
                }
              });
              this_.mainUpperLink.attr({
                line: {
                  strokeWidth: this.$(".linkwidth").val()
                }
              });
              if (this_.isFundamentalLink()) {
                this_.updateTriangle(init);
              }
              this.remove();
            }
          };
          const el = init.paper.findViewByModel(this_).el;
          (0, configuration_rappidEnviromentFunctionality_shared /* .popupGenerator */.sk)(el, stylePopupContent, stylePopupEvents).render();
          (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
          (0, configuration_rappidEnviromentFunctionality_shared /* .popupInputsEnterListener */.kw)();
          $(".linkColor")[0].value = this_.attr("line/stroke");
        }
      };
    }
    pointerUpHandle(cellView, initRappid, $event) {
      super.pointerUpHandle(cellView, initRappid, $event);
      // this.resizePort();
    }
    getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      if (this.sourceElement && this.sourceElement.attributes.attrs.digitalTwinConnected) {
        return [verticesTool, segmentsTool, removeButton];
      } else {
        return [verticesTool, segmentsTool, targetArrowheadTool, removeButton];
      }
    }
    getSourceMultiplicityPopupTooltipText() {
      return "The integer number or parameter of instances that represents a binary structural relation in an OPD from the source thing";
    }
    getTargetMultiplicityPopupTooltipText() {
      return "The integer number or parameter of instances that represents a binary structural relation in an OPD of the target thing";
    }
    includedInOrderedTypes() {
      const orderedFundamentalTypes = this.sourceElement.getVisual()?.logicalElement?.orderedFundamentalTypes || [];
      if (orderedFundamentalTypes.includes(this.getVisual()?.type)) {
        return true;
      }
      return false;
    }
  }

  /***/
}),
/***/36443: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Z: () => (/* binding */OpmTaggedLink)

  });

  class OpmTaggedLink extends OpmStructuralLink /* .OpmStructuralLink */.i {
    constructor(sourceElement, targetElement, id) {
      super(id);
      this.sourceElement = sourceElement;
      this.targetElement = targetElement;
      this.set({
        source: {
          id: sourceElement.id
        }
      });
      this.set({
        target: {
          id: targetElement.id
        }
      });
      const this_ = this;
      this.on("change:vertices", function () {
        this_.updateVertices();
      });
    }
    updateVertices() {
      if ((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)()) {
        const model = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel();
        const vis = model.getVisualElementById(this.id);
        if (vis) {
          vis.BreakPoints = this.vertices();
        }
      }
    }
    getTaggedLinkParams() {
      const params = {
        forwardTag: this.forwardTag,
        backwardTag: this.backwardTag
      };
      return {
        ...super.getStructuralLinkParams(),
        ...params
      };
    }
    popupContentDbClick() {
      // Prefer the attribute value; if missing (older models), fall back to the visual,
      // and as a last resort to an existing label text.
      let sourceMultiplicity = this.attributes.sourceMultiplicity ? this.attributes.sourceMultiplicity : "";
      let targetMultiplicity = this.attributes.targetMultiplicity ? this.attributes.targetMultiplicity : "";
      const visual = this.getVisual();
      if (!sourceMultiplicity && visual?.sourceMultiplicity) {
        sourceMultiplicity = visual.sourceMultiplicity;
        this.attributes.sourceMultiplicity = sourceMultiplicity;
      }
      if (!targetMultiplicity && visual?.targetMultiplicity) {
        targetMultiplicity = visual.targetMultiplicity;
        this.attributes.targetMultiplicity = targetMultiplicity;
      }
      // If still empty, try to infer from existing labels once (helps for very old models).
      // For very old models, multiplicity labels were at distance 0.2 (source) and 0.9 (target).
      const labels = this.labels() || [];
      if (!sourceMultiplicity) {
        const srcLabel = labels.find(lb => lb?.attrs?.label?.text && typeof lb.attrs.label.text === "string" && lb.attrs.label.text.trim().length > 0 && !lb.attrs.missingLine && lb.position?.distance !== undefined && lb.position.distance <= 0.3 // old default for source mult
        );
        if (srcLabel) {
          sourceMultiplicity = srcLabel.attrs.label.text;
          this.attributes.sourceMultiplicity = sourceMultiplicity;
        }
      }
      if (!targetMultiplicity) {
        const trgLabel = labels.find(lb => lb?.attrs?.label?.text && typeof lb.attrs.label.text === "string" && lb.attrs.label.text.trim().length > 0 && !lb.attrs.missingLine && lb.position?.distance !== undefined && lb.position.distance >= 0.7 // old default for target mult
        );
        if (trgLabel) {
          targetMultiplicity = trgLabel.attrs.label.text;
          this.attributes.targetMultiplicity = targetMultiplicity;
        }
      }
      const tag = this.attributes.tag ? this.attributes.tag : "";
      const requirements = this.attributes.requirements || "";
      const showReqLabel = this.attributes.showRequirementsLabel;
      setTimeout(() => {
        if ($(".showReq").length) {
          $(".showReq")[0].checked = showReqLabel;
        }
      }, 500); // fix for a bug that the custom "V" causes.
      return ["<div style=\"height: 16px\" ><div class=\"textAndInput\">Source Multiplicity:<input size=\"2\" class=\"PopupInput srce\" value=\"" + sourceMultiplicity.trim() + "\" ></div><span class=\"iconSpan\" data-title=\"" + this.getSourceMultiplicityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\" ><div class=\"textAndInput\">Target Multiplicity : <input size=\"2\"  class=\"trgt PopupInput\" value=\"" + targetMultiplicity.trim() + "\"></div><span data-title=\"" + this.getTargetMultiplicityPopupTooltipText() + "\"><img class=\"questionMarkForInfo\"src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Tag: <input size=\"2\" class=\"tag PopupInput\" value=\"" + tag.trim() + "\"></div><span data-title=\"" + this.getTagPopupTooltipText() + "\"><img class=\"questionMarkForInfo\"src=\"assets/SVG/questionmark.svg\"></span></div><br><div style=\"height: 30px; margin-bottom: 4px; width: 273px;\" ><div class=\"textAndInput\">Requirement Set:<input size=\"2\" class=\"PopupInput req\" value=\"" + requirements + "\" ><span data-title=\"Displaying satisfied requirements text on the link\"><input type=\"checkbox\"\" class=\"checkbox-round showReq\"></span></div><span class=\"iconSpan\" style=\"margin-left: -8px;\" data-title=\"" + this.getRequirementsPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span><img class=\"urlSvg\" src=\"assets/SVG/url.svg\"></div>"];
    }
    getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      return [verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, removeButton];
    }
    isForkedLink() {
      return false;
    }
    updateSourceMultiplicity(oldVal, newVal, link, init) {
      const visuals = this.getVisual().logicalElement.visualElements.filter(vis => vis !== this.getVisual());
      const labels = link.labels() || [];
      // Identify the multiplicity label by its text (old value), not by its location.
      // This is robust to manual repositioning of the label.
      const existing = labels.find(lb => lb?.attrs?.label?.text === oldVal);
      let newLabel;
      if (newVal) {
        if (existing) {
          const idx = labels.indexOf(existing);
          const distance = existing.position?.distance ?? 0.2;
          const offsetX = existing.attrs?.label?.x ?? 0;
          const offsetY = existing.attrs?.label?.y;
          const offset = existing.position?.offset;
          const keepGradient = existing.position?.args?.keepGradient !== false;
          newLabel = link.setLabelsOLinks(newVal, distance, offsetX, offsetY, offset, idx, keepGradient);
        } else {
          newLabel = link.setLabelsOLinks(newVal, 0.2, null);
        }
      } else if (existing) {
        const idx = labels.indexOf(existing);
        if (idx >= 0) {
          link.removeLabel(idx);
        }
      }
      link.set("sourceMultiplicity", newVal);
      for (const vis of visuals) {
        vis.sourceMultiplicity = newVal;
        if (!vis.labels && newLabel) {
          vis.labels = [newLabel];
        } else if (vis.labels) {
          const visLabels = vis.labels;
          const badVisLabel = visLabels.find(lb => lb?.attrs?.label?.text === oldVal);
          if (badVisLabel) {
            visLabels.splice(visLabels.indexOf(badVisLabel), 1);
          }
          if (newVal && newLabel) {
            visLabels.push(newLabel);
          }
        }
      }
    }
    updateTagLabel(oldVal, newVal, link, init, center = false) {
      const visuals = this.getVisual().logicalElement.visualElements.filter(vis => vis !== this.getVisual());
      let newLabel;
      if (newVal && !link.isForkedLink()) {
        newLabel = link.setLabelsOLinks(newVal, center ? 0.5 : 0.8, null, -10);
      }
      link.set("tag", newVal);
      for (const vis of visuals) {
        vis.tag = newVal;
        if (!vis.labels && newLabel) {
          vis.labels = [newLabel];
        } else if (vis.labels && newVal) {
          const old = vis.labels.find(lb => lb.attrs.label.text === oldVal);
          if (old) {
            vis.labels.splice(vis.labels.indexOf(old), 1);
          }
          if (newLabel) {
            vis.labels.push(newLabel);
          }
        }
      }
    }
    getTagPopupTooltipText() {
      return "Tag is a phrase that expresses the semantics — the nature, meaning, or content. The unidirectional default tag is the phrase “relates to“";
    }
  }

  /***/
}),
/***/83898: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    l: () => (/* binding */Arc)

  });

  class Arc {
    constructor(minitRappid, mlinksArray, centerX, centerY, nSide, arcStartAngle, arcEndAngle, myPort) {
      // this.arcType = myArcType;
      this.x = centerX;
      this.y = centerY;
      this.startAngle = arcStartAngle;
      this.endAngle = arcEndAngle;
      this.port = myPort;
      this.mSide = nSide;
      this.linksArray = mlinksArray;
      this.initRappid = minitRappid;
      this.arcVec = configuration_rappidEnviromentFunctionality_shared /* .vectorizer */.hN.V("path", {
        fill: "transparent",
        stroke: "#586d8c",
        "stroke-width": "2",
        "stroke-dasharray": "4 1"
      });
      let path;
      const logicalLink = this.initRappid.opmModel.getLogicalElementByVisualId(this.linksArray[0].id);
      const existingArcType = this.mSide === "source" ? logicalLink.sourceLogicalConnection : logicalLink.targetLogicalConnection;
      // Set the multi link angle
      // Multi NOT links don't not have an angle (should be added here if necessary)
      let arc = "NOT";
      // if === 1 its XOR else its OR
      if (existingArcType === 1) {
        path = this.describeArc(this.x, this.y, 30, this.startAngle, this.endAngle);
        arc = "XOR";
      } else if (existingArcType === 0) {
        // OR
        path = this.describeArc(this.x, this.y, 30, this.startAngle, this.endAngle) + " " + this.describeArc(this.x, this.y, 35, this.startAngle, this.endAngle);
        arc = "OR";
      }
      // updating the path - single or doubled
      this.arcVec.attr("d", path);
      // adding click listener for toggling the arc type
      this.arcVec.node.addEventListener("click", this.toggleArcType.bind(this, arc), false);
      if (this.linksArray[0] && (this.mSide === "source" || !this.linksArray[0].constructor.name.includes("nvocation"))) {
        this.arcVec.node.addEventListener("contextmenu", this.rightClickArcPopup.bind(this), false);
      }
      const that = this;
      let highestZ = this.getLinksArray()[0].attributes.z;
      if (highestZ) {
        for (const link of this.getLinksArray()) {
          highestZ = link.attributes.z && highestZ < link.attributes.z ? link.attributes.z : highestZ;
        }
        this.arcVec.node.style.zIndex = highestZ + 1;
      }
      this.arcVec.node.addEventListener("mouseenter", function () {
        that.arcVec.node.style.opacity = "0.7";
      }, false);
      this.arcVec.node.addEventListener("mouseleave", function () {
        that.arcVec.node.style.opacity = "1";
      }, false);
      if (this.mSide === "target" && arc === "OR") {
        const statesFromSameObject = this.linksArray.filter(l => l.getSourceElement().constructor.name.includes("State")).map(l => l.getVisual().source.fatherObject);
        // if there are 2 or more states from the same object in the relation it must be XOR
        if (statesFromSameObject.length !== new Set(statesFromSameObject).size) {
          this.toggleArcType(undefined);
        }
      }
    }
    // Gal: redraw the arcs on the element and on the source and target elements. goToOther is for preventing infinity reqursive calls
    // and its made for making it go only one time to an element
    static redrawAllArcs(element, initRappid, goToOther) {
      const sourceLinks = initRappid.graph.getConnectedLinks(element, "outbound");
      const targetLinks = initRappid.graph.getConnectedLinks(element, "inbound");
      sourceLinks.forEach(function (link) {
        if (link && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")) != null && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")).sourceLogicalConnection != null) {
          // redraw source arc
          initRappid = initRappid === null ? link.getSourceArcOnLink().initRappid : initRappid;
          link.drawArc(initRappid, "source", element, link.get("source").port, "outbound");
        }
        if (link && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")) != null && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")).targetLogicalConnection != null && goToOther) {
          // redraw target arc
          initRappid = initRappid === null ? link.getTargetArcOnLink().initRappid : initRappid;
          this.redrawAllArcs(link.getTargetElement(), initRappid, false);
        }
      }.bind(this));
      targetLinks.forEach(function (link) {
        if (link && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")) != null && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")).targetLogicalConnection != null) {
          // redraw target arc
          initRappid = initRappid === null ? link.getTargetArcOnLink().initRappid : initRappid;
          link.drawArc(initRappid, "target", element, link.get("target").port, "inbound");
        }
        if (link && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")) != null && initRappid.opmModel.getLogicalElementByVisualId(link.get("id")).sourceLogicalConnection != null && goToOther) {
          // redraw source arc
          initRappid = initRappid === null ? link.getSourceArcOnLink().initRappid : initRappid;
          this.redrawAllArcs(link.getSourceElement(), initRappid, false);
        }
      }.bind(this));
    }
    // when object is moved to a new position the old arc is still on the screen until it is removed and redrawn on the screen
    // so in this time we make it transparent
    static makeThingArcsTransparent(element, initRappid, goToOther) {
      const sourceLinks = initRappid.graph.getConnectedLinks(element, {
        outbound: true
      });
      const targetLinks = initRappid.graph.getConnectedLinks(element, {
        inbound: true
      });
      sourceLinks.forEach(function (link) {
        if (link && link.getSourceArcOnLink()) {
          link.getSourceArcOnLink().getArcVec().attr("stroke", "transparent");
        }
        if (link && link.getTargetArcOnLink() && goToOther) {
          this.makeThingArcsTransparent(link.getTargetElement(), initRappid, false);
        }
      }.bind(this));
      targetLinks.forEach(function (link) {
        if (link && link.getTargetArcOnLink()) {
          link.getTargetArcOnLink().getArcVec().attr("stroke", "transparent");
        }
        if (link && link.getSourceArcOnLink() && goToOther) {
          this.makeThingArcsTransparent(link.getSourceElement(), initRappid, false);
        }
      }.bind(this));
    }
    // when link is clicked we will make the arcs of it transparent until redrawing the new arc
    static makeLinksArcsTransparent(link) {
      if (link.getSourceArcOnLink()) {
        link.getSourceArcOnLink().getArcVec().attr("stroke", "transparent");
      }
      if (link.getTargetArcOnLink()) {
        link.getTargetArcOnLink().getArcVec().attr("stroke", "transparent");
      }
    }
    static redrawLinkArcs(link, initRappid) {
      if (link.getTargetArcOnLink()) {
        // redraw target arc
        link.drawArc(initRappid, "target", link.getTargetElement(), link.get("target").port, "inbound");
      }
      if (link.getSourceArcOnLink()) {
        // redraw source arc
        link.drawArc(initRappid, "source", link.getSourceElement(), link.get("source").port, "outbound");
      }
    }
    // changing the arc type on the logical layer of the system
    toggleArcType(arc) {
      this.initRappid.getOpmModel().logForUndo("OR/XOR logical relation type change");
      let logicalLink = this.initRappid.opmModel.getLogicalElementByVisualId(this.linksArray[0].id);
      let newArcType = this.getArcType();
      if (arc === "NOT") {
        newArcType = ConfigurationOptions /* .LinkLogicalConnection */.qK.Not;
      } else {
        newArcType = newArcType === ConfigurationOptions /* .LinkLogicalConnection */.qK.Xor ? ConfigurationOptions /* .LinkLogicalConnection */.qK.Or : ConfigurationOptions /* .LinkLogicalConnection */.qK.Xor;
        const canChange = this.initRappid.getOpmModel().canChangeArcType(newArcType, this.getLinksArray().map(l => l.getVisual()), this.getSide());
        if (canChange === false) {
          return;
        }
      }
      for (let i = 0; i < this.linksArray.length; i++) {
        logicalLink = this.initRappid.opmModel.getLogicalElementByVisualId(this.linksArray[i].id);
        if (this.mSide === "source") {
          logicalLink.sourceLogicalConnection = newArcType;
        } else {
          logicalLink.targetLogicalConnection = newArcType;
        }
      }
      let newPath;
      // updating the new representation  - single arc or double arc
      if (newArcType === ConfigurationOptions /* .LinkLogicalConnection */.qK.Xor) {
        newPath = this.describeArc(this.x, this.y, 30, this.startAngle, this.endAngle);
        this.arcVec.attr("d", newPath);
      } else if (newArcType === ConfigurationOptions /* .LinkLogicalConnection */.qK.Or) {
        newPath = this.describeArc(this.x, this.y, 30, this.startAngle, this.endAngle) + " " + this.describeArc(this.x, this.y, 35, this.startAngle, this.endAngle);
        this.arcVec.attr("d", newPath);
      }
      this.initRappid.oplService.oplSwitch.next("urgent opl refresh");
    }
    // comvert polar to cartesian
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angle = angleInDegrees >= 360 ? angleInDegrees - 360 : angleInDegrees;
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    }
    // Creating a svg path with x,y center point, start angle and end angle
    // Creating a svg path with x,y center point, start angle and end angle
    describeArc(x, y, radius, startAngle, endAngle) {
      let start = this.polarToCartesian(x, y, radius, endAngle);
      let end = this.polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = 0;
      if (endAngle - startAngle >= 180) {
        const temp = start;
        start = end;
        end = temp;
      }
      const d = [
      // The previous drawing way
      "M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      // 'M', start.x, start.y,
      // 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      // 'L', x, y,
      // 'L', start.x, start.y
      ].join(" ");
      return d;
    }
    remove() {
      const linksOfArc = this.linksArray;
      for (let i = 0; i < linksOfArc.length; i++) {
        if (this.mSide === "source") {
          linksOfArc[i].sourceArcOnLink = null;
        } else {
          linksOfArc[i].targetArcOnLink = null;
        }
      }
      this.arcVec.remove();
    }
    plusNextPort(direction, currentPortId, cellView) {
      const currentPortData = cellView.model.getPorts().find(p => p.id === currentPortId);
      let refX = currentPortData.args.x;
      if (refX.constructor.name.includes("tring")) {
        refX = Number(refX.replace("%", "")) / 100;
      }
      let refY = currentPortData.args.y;
      if (refY.constructor.name.includes("tring")) {
        refY = Number(refY.replace("%", "")) / 100;
      }
      let shape;
      const bbox = {
        x: 0,
        y: 0,
        width: cellView.model.get("size").width,
        height: cellView.model.get("size").height
      };
      if (cellView.model.constructor.name.includes("Process")) {
        shape = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.ellipse.fromRect(bbox);
      } else {
        shape = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.rect(bbox);
      }
      let p = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.Point(refX * bbox.width, refY * bbox.height);
      const center = {
        x: bbox.width / 2,
        y: bbox.height / 2
      };
      const line = new configuration_rappidEnviromentFunctionality_shared /* .geometry */.lC.g.line(center, p);
      line.setLength(line.length() + 8000);
      const angle = direction === "plus" ? -10 : 10;
      line.rotate(center, angle * (bbox.height / bbox.width));
      p = line.pointAt(1);
      const nextPoint = shape.intersectionWithLineFromCenterToPoint(p);
      const newPort = cellView.model.addCustomPort(nextPoint);
      return newPort;
    }
    rightClickArcPopup() {
      const this_ = this;
      const relevantLinks = this_.getLinksArray();
      const elementInRelation = relevantLinks[0].source().id === relevantLinks[1].source().id ? "source" : "target";
      const port = relevantLinks[0].get(elementInRelation).port;
      const elementCell = this_.initRappid.graph.getCell(relevantLinks[0].get(elementInRelation).id);
      const cellView = this_.initRappid.paper.findViewByModel(elementCell);
      const maxPort = elementCell.constructor.name.includes("State") ? 15 : 29;
      const arcsPopup = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.ui.Popup({
        events: {
          "click .Popup.BtnDelete": function () {
            this_.remove();
            let element;
            this_.linksArray.forEach(link => {
              const logicalLink = this_.initRappid.opmModel.getLogicalElementByVisualId(link.id);
              if (this_.mSide === "source" && logicalLink) {
                logicalLink.disconnectSourceLogicalConnectionAllVisuals();
                link.set("source", {
                  id: link.getSourceElement().get("id"),
                  port: null
                });
                element = link.getSourceElement();
              } else if (logicalLink) {
                logicalLink.disconnectTargetLogicalConnectionAllVisuals();
                link.set("target", {
                  id: link.getTargetElement().get("id"),
                  port: null
                });
                element = link.getTargetElement();
              }
            });
            if (element) {
              Arc.redrawAllArcs(element, this_.initRappid, true);
            }
            cellView.model.removeUnusedPorts();
            this.remove();
          },
          "click .Popup.BtnPlus": function () {
            const newPort = this_.plusNextPort("plus", port, cellView);
            for (const link of relevantLinks) {
              link.set(elementInRelation, {
                id: link.get(elementInRelation).id,
                port: newPort
              });
              const visual = this_.initRappid.opmModel.getVisualElementById(link.id);
              if (elementInRelation === "source") {
                visual.sourceVisualElementPort = newPort;
              } else {
                visual.targetVisualElementPort = newPort;
              }
            }
            Arc.redrawAllArcs(elementCell, this_.initRappid, true);
            if (elementInRelation === "source") {
              relevantLinks[0].getSourceArcOnLink().rightClickArcPopup();
            } else {
              relevantLinks[0].getTargetArcOnLink().rightClickArcPopup();
            }
            cellView.model.removeUnusedPorts();
          },
          "click .Popup.BtnClose": function () {
            this.remove();
          },
          "click .Popup.BtnMinus": function () {
            const newPort = this_.plusNextPort("minus", port, cellView);
            for (const link of relevantLinks) {
              link.set(elementInRelation, {
                id: link.get(elementInRelation).id,
                port: newPort
              });
              const visual = this_.initRappid.opmModel.getVisualElementById(link.id);
              if (elementInRelation === "source") {
                visual.sourceVisualElementPort = newPort;
              } else {
                visual.targetVisualElementPort = newPort;
              }
            }
            Arc.redrawAllArcs(elementCell, this_.initRappid, true);
            if (elementInRelation === "source") {
              relevantLinks[0].getSourceArcOnLink().rightClickArcPopup();
            } else {
              relevantLinks[0].getTargetArcOnLink().rightClickArcPopup();
            }
            cellView.model.removeUnusedPorts();
          }
        },
        content: ["<div style=\"text-align: center; padding-bottom:4px; font-family: Roboto, Helvetica Neue, sans-serif;\">Port Movement:&nbsp;&nbsp;<button class=\"Popup BtnPlus\">&nbsp;+&nbsp;</button><button class=\"Popup BtnMinus\">&nbsp;-&nbsp;</button></div>", "<button class=\"Popup BtnDelete\">Remove Relation</button>&nbsp;<button class=\"Popup BtnClose\">Close</button>"],
        target: cellView.el
      });
      arcsPopup.render();
      (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)(true);
    }
    // stylePopup() {
    //   const ppup = document.getElementsByClassName('joint-popup joint-theme-modern')[0] as HTMLDivElement;
    //   ppup.style.borderColor = '#d6d6d6';
    //   ppup.style.height = '77px';
    //   ppup.style.top = String(Number(ppup.style.top.substr(0, ppup.style.top.length - 2)) + 20) + 'px';
    //   ppup.style.background = 'rgba(251, 251, 251, 0.91)';
    //   ppup.style.boxShadow =  '0px 2px 4px rgba(198, 198, 198, 0.64)';
    //   ppup.style.color = '#1a3763';
    //   // this line hides the ugly triangle at the top of the popup
    //   $('.joint-popup').addClass('noBefore');
    // }
    getArcVec() {
      return this.arcVec;
    }
    getPort() {
      return this.port;
    }
    getSide() {
      return this.mSide;
    }
    getLinksArray() {
      return this.linksArray;
    }
    getArcType() {
      const logicalLink = this.initRappid.opmModel.getLogicalElementByVisualId(this.linksArray[0]?.id);
      if (!logicalLink) {
        return 1;
      }
      const existingArcType = this.mSide === "source" ? logicalLink.sourceLogicalConnection : logicalLink.targetLogicalConnection;
      return existingArcType;
    }
  }

  /***/
}),
/***/81330: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Q: () => (/* binding */OpmEntity)
  });
