// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/UrlsUtils.ts
// Extracted by opm-extracted/tools/extract.mjs

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
