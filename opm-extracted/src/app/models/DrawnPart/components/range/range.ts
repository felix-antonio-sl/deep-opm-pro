// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/components/range/range.ts
// Extracted by opm-extracted/tools/extract.mjs

function setRangePopUpContent(range, type = "int") {
  return `<div class="text-popup"><textarea class="text" rows="3" cols="26" style="min-width: 244px;min-height: 40px">${range}</textarea><br><span>Values type: </span><select value="${type}" id="range-type"><option value="integer" ${type == "boolean" ? "selected" : ""}>int</option><option value="float" ${type == "float" ? "selected" : ""}>float</option><option value="string" ${type == "string" ? "selected" : ""}>string</option><option value="char" ${type == "char" ? "selected" : ""}>char</option><option value="boolean" ${type == "boolean" ? "selected" : ""}>boolean</option></select><span class="btnReset">  Reset  </span><br><button class="btnUpdate Popup" style="width: 64px;">  Set  </button></div>`;
}
