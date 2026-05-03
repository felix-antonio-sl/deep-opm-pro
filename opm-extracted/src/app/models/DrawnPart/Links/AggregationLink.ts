// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/AggregationLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class AggregationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph, id) {
    super(sourceElement, targetElement, graph, id);
    this.attributes.name = "Aggregation-Participation";
  }
  getParams() {
    const params = {
      linkType: linkType.Aggregation
    };
    return {
      ...super.getFundamentalLinkParams(),
      ...params
    };
  }
  getTriangleSVG(withLine = false, color = "#586D8C") {
    if (!withLine) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="">
      <path fill="#000000" fill-opacity="1" stroke="${color}" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746"/>
      <path fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z"/>
    </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="">
    <path fill="#000000" fill-opacity="1" stroke="${color}" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746"/>
    <path fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z"/>
    <path fill="${color}" stroke="${color}" stroke-width="3" strokelinejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,30 L28.162149898128664,30 z"/>
  </svg>`;
  }
}
