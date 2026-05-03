// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/UserInputPromptPopup.ts
// Extracted by opm-extracted/tools/extract.mjs

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function openUserInputPromptPopup(target, drawn, logical) {
  const initial = (0, getEffectiveUserInputPrompt)(logical.userInputPromptMessage);
  const content = "<div style=\"min-width:260px;line-height:1.35\"><div style=\"text-align:center\"><strong>Simulation Prompt Message</strong></div><label for=\"userInputPromptField\" style=\"font-size:12px;margin:6px 0 0 0;display:block\">Prompt Text For The User:</label><input id=\"userInputPromptField\" type=\"text\" class=\"userInputPromptField\" maxlength=\"500\" style=\"width:100%;box-sizing:border-box;margin:2px 0 0 0;display:block\" value=\"" + escapeAttr(initial) + "\"><span style=\"font-size:11px;opacity:0.85;display:block;margin-top:4px;line-height:1.3\">Optional — plain text only, no HTML.</span><div style=\"text-align:center;margin-top:12px\"><button type=\"button\" class=\"Popup btnUserInputPromptOk\" style=\"margin-right:10px\">OK</button><button type=\"button\" class=\"Popup btnUserInputPromptCancel\">Cancel</button></div></div>";
  (0, popupGenerator)(target, content, userInputPromptEvents(drawn, logical)).render();
  (0, stylePopup)();
  const popup = $(".joint-popup")[0];
  if (popup) {
    popup.style.lineHeight = "normal";
  }
}
function userInputPromptEvents(drawn, logical) {
  return {
    "click .btnUserInputPromptOk": function () {
      const raw = this.$(".userInputPromptField").val();
      const cleaned = (0, sanitizeUserInputPrompt)(raw);
      logical.userInputPromptMessage = cleaned === DEFAULT_USER_INPUT_PROMPT ? undefined : cleaned;
      logical.needUserInput = true;
      this.remove();
      drawn.updateTextView();
      drawn.updateURLArray();
      const init = (0, getInitRappidShared)();
      if (init?.elementToolbarReference?.onSelection) {
        init.elementToolbarReference.onSelection();
      }
    },
    "click .btnUserInputPromptCancel": function () {
      this.remove();
    }
  };
}
