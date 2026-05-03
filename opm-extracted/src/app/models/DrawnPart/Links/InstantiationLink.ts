// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/InstantiationLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class InstantiationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph, id) {
    super(sourceElement, targetElement, graph, id);
    this.attributes.name = "Classification-Instantiation";
  }
  getParams() {
    const params = {
      linkType: linkType.Instantiation
    };
    return {
      ...super.getFundamentalLinkParams(),
      ...params
    };
  }
  getTriangleSVG(withLine = false, color = "#586D8C") {
    if (!withLine) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <path fill="${color}" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 "/>
          <path fill="white" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355878 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z"/>
          <path fill="${color}" fill-opacity="1" stroke="${color}" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" d="M11.000000238418579,17.390625 C11.000000238418579,14.964865331491712 12.964865422411137,13 15.3906249088217,13 C17.816384395232266,13 19.78124957922482,14.964865331491712 19.78124957922482,17.390625 C19.78124957922482,19.816384668508288 17.816384395232266,21.78125 15.3906249088217,21.78125 C12.964865422411137,21.78125 11.000000238418579,19.816384668508288 11.000000238418579,17.390625 z" id="svg_11"/>
          </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
        <path fill="${color}" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 "/>
        <path fill="white" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355878 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z"/>
        <path fill="${color}" fill-opacity="1" stroke="${color}" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" d="M11.000000238418579,17.390625 C11.000000238418579,14.964865331491712 12.964865422411137,13 15.3906249088217,13 C17.816384395232266,13 19.78124957922482,14.964865331491712 19.78124957922482,17.390625 C19.78124957922482,19.816384668508288 17.816384395232266,21.78125 15.3906249088217,21.78125 C12.964865422411137,21.78125 11.000000238418579,19.816384668508288 11.000000238418579,17.390625 z" id="svg_11"/>
        <path fill="${color}" stroke="${color}" stroke-width="3" strokelinejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,30 L28.162149898128664,30 z"/>
        </svg>`;
  }
}
