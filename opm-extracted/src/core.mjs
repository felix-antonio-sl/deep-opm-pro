// Source: decompiled/deobfuscated.js
// Original path: ./src/core.mjs
// Extracted by opm-extracted/tools/extract.mjs

const Vectorizer = V_0;
const layout = {
  PortLabel: portLabel_namespaceObject,
  Port: port_namespaceObject
};
const setTheme = function (theme, opt) {
  opt = opt || {};
  invoke(views, "setTheme", theme, opt);

  // Update the default theme on the view prototype.
  View.prototype.defaultTheme = theme;
};