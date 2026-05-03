// Source: decompiled/deobfuscated.js
// Original path: ./src/app/database/dateFormat.ts
// Extracted by opm-extracted/tools/extract.mjs

function formatDate(d) {
  try {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const sec = String(d.getSeconds()).padStart(2, "0");
    return day + "-" + month + "-" + d.getFullYear() + " " + d.getHours() + ":" + min + ":" + sec;
  } catch (err) {
    return "";
  }
}