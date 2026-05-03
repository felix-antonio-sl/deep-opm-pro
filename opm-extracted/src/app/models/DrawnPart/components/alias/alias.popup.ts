// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/components/alias/alias.popup.ts
// Extracted by opm-extracted/tools/extract.mjs

function aliasValidation(aliasStr) {
  const new_val = aliasStr.trim();
  // Allow empty string to delete alias
  if (new_val === "") {
    (0, validationAlert)("The alias has been removed and will no longer be used.", 3000, "warning");
    return "";
  }
  const notAllowedWords = ["do", "if", "in", "for", "let", "new", "try", "var", "case", "else", "enum", "eval", "false", "null", "this", "true", "void", "with", "break", "catch", "class", "const", "super", "throw", "while", "yield", "delete", "export", "import", "public", "return", "static", "switch", "typeof", "default", "extends", "finally", "package", "private", "continue", "debugger", "function", "arguments", "interface", "protected", "implements", "instanceof"];
  if (new_val.indexOf(" ") > 0) {
    const errorMessage = "You can use spaces in an alias.";
    (0, validationAlert)(errorMessage, 3000, "Error");
    return;
  }
  if (notAllowedWords.includes(new_val)) {
    const errorMessage = "You can not use reserved words in an alias.";
    (0, validationAlert)(errorMessage, 3000, "Error");
    return;
  }
  if (new_val.indexOf("_") > 0 || new_val.indexOf(".") > 0) {
    const errorMessage = "You can not use '_' or '.' in aliases.";
    (0, validationAlert)(errorMessage, 3000, "Error");
    return;
  }
  return new_val;
}
function AliasPopup(drawn, initRappid, onFinish = () => {}) {
  const view = initRappid.paper.findViewByModel(drawn);
  const visual = initRappid.opmModel.getVisualElementById(drawn.get("id"));
  const alias = visual.logicalElement.alias ? visual.logicalElement.alias : "";
  const popup = new joint.ui.Popup({
    id: "alias_popup",
    events: {
      keypress: function (event) {
        if (event.which == 13) {
          const new_val = aliasValidation(this.$("#value").val());
          if (new_val === undefined) {
            return;
          }
          visual.logicalElement.alias = new_val;
          drawn.updateSiblings(visual, initRappid);
          joint.ui.Popup.close();
          onFinish();
        }
      },
      "click #update": function () {
        const new_val = aliasValidation(this.$("#value").val());
        if (new_val === undefined) {
          return;
        }
        visual.logicalElement.alias = new_val;
        drawn.updateSiblings(visual, initRappid);
        joint.ui.Popup.close();
        onFinish();
      }
    },
    content: "<div class=\"alias-popup\"><label class=\"popupHeader\">Edit Alias:</label><br><input class=\"inputAlias\" placeholder=\"insert alias\" value=\"" + alias + "\" id=\"value\" type=\"text\" autofocus><button id=\"update\" class=\"btnUpdate Popup\">Update</button></div>",
    target: view.el
  }).render();
  const fieldInput = popup.$("#value");
  const fldLength = fieldInput.val().length;
  fieldInput.focus();
  fieldInput[0].setSelectionRange(0, fldLength);
  (0, stylePopup)();
}
