// Source: decompiled/81330.js
// Original path: ./src/app/models/DrawnPart/components/text/text.popup.ts
// Extracted by opm-extracted/tools/extract.mjs

function TextPopup(init, target, visual, updateView) {
  // let content;
  // if (getInitRappidShared().penDrawingManager.isInPenMode)
  // content = '    <div class="text-popup"><input type="checkbox" id="formatting" name="formatting" ' + (name.isAutoFormat() ? 'checked="checked"' : '') + '><label class="popupHeader" for="formatting">Auto Format</label><br><textarea class="text" rows="3" cols="26" style="min-width: 225px;min-height: 40px">' + name.getText() + '</textarea><br><button class="btnUpdate Popup">Update</button><br><div>Handwriting:</div><canvas id="handwriting-canvas" width="240" height="100" style="border: 2px solid; cursor: crosshair;margin-top: 10px;"></canvas></div>';
  // else content =  '<div class="text-popup"><input type="checkbox" id="formatting" name="formatting" ' + (name.isAutoFormat() ? 'checked="checked"' : '') + '><label class="popupHeader" for="formatting">Auto Format</label><br><textarea class="text" rows="3" cols="26" style="min-width: 225px;min-height: 40px">' + name.getText() + '</textarea><br><button class="btnUpdate Popup">Update</button></div>';
  const logical = visual.logicalElement;
  const name = logical.getNameModule();
  const logicalForInfo = OPCloudUtils.isInstanceOfLogicalState(logical) ? logical.parent : logical;
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
  const popup = new joint.ui.Popup({
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
            <div ${(0, getInitRappidShared)().penDrawingManager.isInPenMode ? "" : "hidden"}>Handwriting:<br>
                <canvas id="handwriting-canvas" width="240" height="100" style="border: 2px solid; cursor: crosshair;margin-top: 10px;"></canvas>
            </div>
        `,
    target: target.tagName === "g" ? target.$("text")[0] : target
  });
  let can1;
  let lastPointerUpTime = Date.now();
  const onUpdate = /*#__PURE__*/function () {
    var _ref = (0, default)(function* () {
      let value = popup.$(".text").val().trim();
      if (logical.opmModel.shouldAllowInvalidValueAtDesignTime() == false && logical.isValidName(value) == false) {
        (0, validationAlert)("Invalid value entered.");
        return;
      }
      if (OPCloudUtils.isInstanceOfLogicalState(logical) && logical.getFather().isSatisfiedRequirementObject()) {
        const owner = logical.opmModel.getOwnerOfRequirementByRequirementLID(logical.getFather().lid);
        const reqsValues = owner.getAllRequirements().map(req => logical.opmModel.getLogicalElementByLid(req.getRequirementObjectLID())?.value);
        if (reqsValues.find(val => val && val !== "Requirement name or ID" && val.trim() === value.trim())) {
          (0, validationAlert)("This exact name or id is already in use.", 3500, "Error");
          return;
        }
      }
      if (OPCloudUtils.isInstanceOfLogicalThing(logical)) {
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
          value = OPCloudUtils.replaceWords(value, ret.toReplace, ret.replacement);
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
        (0, validationAlert)("The OPM process naming convention is to name a process by making its last word a gerund, i.e., the root of the verb followed by the “ing” suffix.", 5000, "warning");
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
      (0, stylePopup)();
      if ((0, getInitRappidShared)().penDrawingManager.isInPenMode) {
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
