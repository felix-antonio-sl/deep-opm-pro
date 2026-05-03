// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/export-legend-dialog/export-legend-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

    function ExportLegendDialogComponent_mat_option_9_Template(rf, ctx) {
      if (rf & 1) {
        core /* ɵɵelementStart */.j41(0, "mat-option", 13);
        core /* ɵɵtext */.EFF(1);
        core /* ɵɵelementEnd */.k0s();
      }
      if (rf & 2) {
        const option_r1 = ctx.$implicit;
        core /* ɵɵproperty */.Y8G("value", option_r1.id);
        core /* ɵɵadvance */.R7$();
        core /* ɵɵtextInterpolate1 */.SpI(" ", option_r1.label, " ");
      }
    }
    function ExportLegendDialogComponent_mat_option_18_Template(rf, ctx) {
      if (rf & 1) {
        core /* ɵɵelementStart */.j41(0, "mat-option", 13);
        core /* ɵɵtext */.EFF(1);
        core /* ɵɵelementEnd */.k0s();
      }
      if (rf & 2) {
        const option_r2 = ctx.$implicit;
        core /* ɵɵproperty */.Y8G("value", option_r2.id);
        core /* ɵɵadvance */.R7$();
        core /* ɵɵtextInterpolate1 */.SpI(" ", option_r2.label, " ");
      }
    }
    let ExportLegendDialogComponent = /*#__PURE__*/(() => {
      class ExportLegendDialogComponent {
        constructor(data, dialogRef, initRappidService) {
          this.data = data;
          this.dialogRef = dialogRef;
          this.initRappidService = initRappidService;
          this.spinnerFlag = false;
          this.legendScope = "currentModel";
          this.resolutionScale = 4;
          this.colored = true;
          this.legendFormat = "png";
          this.legendScopeOptions = [{
            id: "currentModel",
            label: "Current Model"
          }, {
            id: "currentOpd",
            label: "Current OPD"
          }, {
            id: "allSymbols",
            label: "All OPM Things and Links"
          }];
          this.legendFormatOptions = [{
            id: "png",
            label: "PNG"
          }, {
            id: "svg",
            label: "SVG"
          }];
          this.modelName = data?.modelName || "Unsaved Model";
        }
        exportLegend() {
          var _this = this;
          return (0, default)(function* () {
            _this.spinnerFlag = true;
            try {
              const legendItems = _this.getLegendItemsByScope(_this.legendScope);
              const svgContent = yield _this.generateLegendSvgFromRappidPaper(legendItems, _this.colored);
              const scopeSuffix = _this.legendScope === "allSymbols" ? "all-symbols" : _this.legendScope === "currentOpd" ? "current-opd" : "current-model";
              const safeName = (_this.modelName || "OPM_Model").replace(/\s+/g, "_");
              let blob;
              let fileName;
              if (_this.legendFormat === "svg") {
                blob = new Blob([svgContent], {
                  type: "image/svg+xml;charset=utf-8"
                });
                fileName = `${safeName}_legend_${scopeSuffix}.svg`;
              } else {
                blob = yield _this.svgToPngBlob(svgContent, _this.safeResolutionScale(_this.resolutionScale));
                fileName = `${safeName}_legend_${scopeSuffix}.png`;
              }
              FileSaver_min.saveAs(blob, fileName);
              _this.dialogRef.close();
            } catch (error) {
              console.error("Legend export failed:", error);
              alert("Legend export failed. Please check console for details.");
              _this.spinnerFlag = false;
            }
          })();
        }
        cancel() {
          this.dialogRef.close();
        }
        safeResolutionScale(value) {
          const n = Number(value);
          if (!Number.isFinite(n)) {
            return 2;
          }
          return Math.max(1, Math.min(8, Math.round(n)));
        }
        getLegendItemsByScope(scope) {
          if (scope === "allSymbols") {
            return this.getAllLegendItems();
          }
          if (scope === "currentOpd") {
            return this.getCurrentOpdLegendItems();
          }
          return this.getCurrentModelLegendItems();
        }
        getAllLegendItems() {
          return [{
            id: "object",
            label: "Object"
          }, {
            id: "statefulObject",
            label: "Stateful Object"
          }, {
            id: "process",
            label: "Process"
          }, {
            id: "inzoomedObject",
            label: "In-zoomed Object"
          }, {
            id: "inzoomedProcess",
            label: "In-zoomed Process"
          }, {
            id: "consumptionLink",
            label: "Consumption Link"
          }, {
            id: "resultLink",
            label: "Result Link"
          }, {
            id: "effectLink",
            label: "Effect Link"
          }, {
            id: "agentLink",
            label: "Agent Link"
          }, {
            id: "instrumentLink",
            label: "Instrument Link"
          }, {
            id: "unidirectionalTaggedLink",
            label: "Unidirectional Tagged Link"
          }, {
            id: "bidirectionalTaggedLink",
            label: "Bidirectional Tagged Link"
          }, {
            id: "aggregationParticipation",
            label: "Aggregation-Participation"
          }, {
            id: "exhibitionCharacterization",
            label: "Exhibition-Characterization"
          }, {
            id: "generalizationSpecialization",
            label: "Generalization-Specialization"
          }, {
            id: "classificationInstantiation",
            label: "Classification-Instantiation"
          }, {
            id: "invocationLink",
            label: "Invocation Link"
          }, {
            id: "undertimeExceptionLink",
            label: "Undertime Exception Link"
          }, {
            id: "overtimeExceptionLink",
            label: "Overtime Exception Link"
          }, {
            id: "undertimeOvertimeExceptionLink",
            label: "Undertime+Overtime Exception Link"
          }];
        }
        getCurrentModelLegendItems() {
          const symbols = new Set();
          const model = this.initRappidService.opmModel;
          model.logicalElements.forEach(element => {
            if (element instanceof OpmLogicalObject) {
              symbols.add("object");
              if (element.states && element.states.length > 0) {
                symbols.add("statefulObject");
              }
            } else if (element instanceof OpmLogicalProcess) {
              symbols.add("process");
            } else if (element instanceof OpmRelation) {
              this.addSymbolsForLinkType(symbols, element.linkType);
            }
          });
          const currentOpd = model.currentOpd;
          if (currentOpd?.getInzoomedThing && currentOpd.getInzoomedThing()?.logicalElement instanceof OpmLogicalObject) {
            symbols.add("inzoomedObject");
          }
          if (currentOpd?.getInzoomedThing && currentOpd.getInzoomedThing()?.logicalElement instanceof OpmLogicalProcess) {
            symbols.add("inzoomedProcess");
          }
          return this.getAllLegendItems().filter(item => symbols.has(item.id));
        }
        getCurrentOpdLegendItems() {
          const symbols = new Set();
          const currentOpd = this.initRappidService.opmModel.currentOpd;
          if (!currentOpd) {
            return [];
          }
          currentOpd.visualElements.forEach(visual => {
            const logical = visual?.logicalElement;
            if (!logical) {
              return;
            }
            if (logical instanceof OpmLogicalObject) {
              symbols.add("object");
              if (logical.states && logical.states.length > 0) {
                symbols.add("statefulObject");
              }
            } else if (logical instanceof OpmLogicalProcess) {
              symbols.add("process");
            } else if (logical instanceof OpmRelation) {
              this.addSymbolsForLinkType(symbols, logical.linkType);
            }
          });
          if (currentOpd.getInzoomedThing && currentOpd.getInzoomedThing()?.logicalElement instanceof OpmLogicalObject) {
            symbols.add("inzoomedObject");
          }
          if (currentOpd.getInzoomedThing && currentOpd.getInzoomedThing()?.logicalElement instanceof OpmLogicalProcess) {
            symbols.add("inzoomedProcess");
          }
          return this.getAllLegendItems().filter(item => symbols.has(item.id));
        }
        addSymbolsForLinkType(symbols, type) {
          switch (type) {
            case linkType.Consumption:
              symbols.add("consumptionLink");
              break;
            case linkType.Result:
              symbols.add("resultLink");
              break;
            case linkType.Effect:
              symbols.add("effectLink");
              break;
            case linkType.Agent:
              symbols.add("agentLink");
              break;
            case linkType.Instrument:
              symbols.add("instrumentLink");
              break;
            case linkType.Unidirectional:
              symbols.add("unidirectionalTaggedLink");
              break;
            case linkType.Bidirectional:
              symbols.add("bidirectionalTaggedLink");
              break;
            case linkType.Aggregation:
              symbols.add("aggregationParticipation");
              break;
            case linkType.Exhibition:
              symbols.add("exhibitionCharacterization");
              break;
            case linkType.Generalization:
              symbols.add("generalizationSpecialization");
              break;
            case linkType.Instantiation:
              symbols.add("classificationInstantiation");
              break;
            case linkType.Invocation:
              symbols.add("invocationLink");
              break;
            case linkType.UndertimeException:
              symbols.add("undertimeExceptionLink");
              break;
            case linkType.OvertimeException:
              symbols.add("overtimeExceptionLink");
              break;
            case linkType.UndertimeOvertimeException:
              symbols.add("undertimeOvertimeExceptionLink");
              break;
            default:
              break;
          }
        }
        generateLegendSvg(items, colored) {
          const columns = 3;
          const cardWidth = 500;
          const cardHeight = 120;
          const margin = 30;
          const headerHeight = 110;
          const rows = Math.max(1, Math.ceil(items.length / columns));
          const width = margin * 2 + columns * cardWidth;
          const height = headerHeight + margin + rows * (cardHeight + 18) + margin;
          const stroke = colored ? "#2f9e44" : "#2b2b2b";
          const processStroke = colored ? "#3155b5" : "#2b2b2b";
          const textColor = "#111111";
          const fillSoft = colored ? "#ecfff0" : "#f2f2f2";
          const stateFill = colored ? "#fff8db" : "#ececec";
          const cards = items.map((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = margin + col * cardWidth;
            const y = headerHeight + row * (cardHeight + 18);
            return this.renderLegendCard(item, x, y, cardWidth - 18, cardHeight, stroke, processStroke, fillSoft, stateFill, textColor);
          }).join("\n");
          return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect x="0" y="0" width="${width}" height="${height}" fill="white"/>
  <text x="${margin}" y="48" font-size="36" font-family="Arial, sans-serif" font-weight="700" fill="#101010">OPM Legend</text>
  ${cards}
</svg>`;
        }
        generateLegendSvgFromRappidPaper(items, colored) {
          var _this2 = this;
          return (0, default)(function* () {
            const columns = 3;
            const cardWidth = 405;
            const cardHeight = 120;
            const margin = 42;
            const headerHeight = 95;
            const rows = Math.max(1, Math.ceil(items.length / columns));
            const width = margin * 2 + columns * cardWidth;
            const height = headerHeight + margin + rows * (cardHeight + 18) + margin;
            const host = document.createElement("div");
            host.style.position = "fixed";
            host.style.left = "-10000px";
            host.style.top = "-10000px";
            host.style.width = `${width}px`;
            host.style.height = `${height}px`;
            host.style.opacity = "0";
            document.body.appendChild(host);
            const graph = new joint.dia.Graph();
            const paper = new joint.dia.Paper({
              el: host,
              model: graph,
              width,
              height,
              gridSize: 1,
              interactive: false,
              async: false,
              sorting: joint.dia.Paper.sorting.APPROX
            });
            items.forEach((item, index) => {
              const col = index % columns;
              const row = Math.floor(index / columns);
              const x = margin + col * cardWidth;
              const y = headerHeight + row * (cardHeight + 24);
              _this2.addLegendCellsToPaper(graph, item.id, x, y, cardWidth - 18, cardHeight);
            });
            if (!colored) {
              graph.getCells().forEach(cell => {
                try {
                  const isAgentLink = cell?.constructor?.name === "AgentLink" || cell?.get?.("name") === "Agent";
                  const isStructuralLink = ["AggregationLink", "ExhibitionLink", "GeneralizationLink", "InstantiationLink"].includes(cell?.constructor?.name);
                  cell.attr("line/stroke", "#3b3b3b");
                  cell.attr("line/sourceMarker/stroke", "#3b3b3b");
                  cell.attr("line/targetMarker/stroke", "#3b3b3b");
                  cell.attr("line/sourceMarker/fill", "#ffffff");
                  cell.attr("line/targetMarker/fill", isAgentLink ? "#3b3b3b" : "#ffffff");
                  cell.attr("rect/stroke", "#3b3b3b");
                  cell.attr("ellipse/stroke", "#3b3b3b");
                  cell.attr("rect/fill", "#f2f2f2");
                  // States have dedicated inner/outer rectangles, not plain rect.
                  cell.attr(".inner/fill", "#f2f2f2");
                  cell.attr(".outer/fill", "#f2f2f2");
                  cell.attr(".inner/stroke", "#3b3b3b");
                  cell.attr(".outer/stroke", "#3b3b3b");
                  // Structural links draw their triangle image from link color; refresh it after recolor.
                  if (isStructuralLink && typeof cell.updateTriangle === "function") {
                    cell.updateTriangle(_this2.initRappidService);
                  }
                } catch (e) {}
              });
            }
            const labels = items.map((item, index) => {
              const col = index % columns;
              const row = Math.floor(index / columns);
              const x = margin + col * cardWidth + 16;
              const y = headerHeight + row * (cardHeight + 24) + 106;
              return `<text x="${x}" y="${y}" font-size="20" font-family="Arial, sans-serif" fill="#111">${item.label}</text>`;
            }).join("\n");
            const cards = items.map((_, index) => {
              const col = index % columns;
              const row = Math.floor(index / columns);
              const x = margin + col * cardWidth;
              const y = headerHeight + row * (cardHeight + 24);
              return `<rect x="${x}" y="${y}" rx="8" ry="8" width="${cardWidth - 18}" height="${cardHeight}" fill="#ffffff" stroke="#d9d9d9"/>`;
            }).join("\n");
            const svgRaw = yield new Promise(resolve => {
              paper.toSVG(svg => resolve(svg));
            });
            const parser = new DOMParser();
            const xml = parser.parseFromString(svgRaw, "image/svg+xml");
            const svgRoot = xml.documentElement;
            const ns = "http://www.w3.org/2000/svg";
            svgRoot.setAttribute("width", String(width));
            svgRoot.setAttribute("height", String(height));
            svgRoot.setAttribute("viewBox", `0 0 ${width} ${height}`);
            const bg = xml.createElementNS(ns, "rect");
            bg.setAttribute("x", "0");
            bg.setAttribute("y", "0");
            bg.setAttribute("width", String(width));
            bg.setAttribute("height", String(height));
            bg.setAttribute("fill", "white");
            svgRoot.insertBefore(bg, svgRoot.firstChild);
            items.forEach((item, index) => {
              const col = index % columns;
              const row = Math.floor(index / columns);
              const x = margin + col * cardWidth;
              const y = headerHeight + row * (cardHeight + 24);
              const card = xml.createElementNS(ns, "rect");
              card.setAttribute("x", String(x));
              card.setAttribute("y", String(y));
              card.setAttribute("rx", "8");
              card.setAttribute("ry", "8");
              card.setAttribute("width", String(cardWidth - 18));
              card.setAttribute("height", String(cardHeight));
              card.setAttribute("fill", "#ffffff");
              card.setAttribute("stroke", "#d9d9d9");
              svgRoot.insertBefore(card, bg.nextSibling);
              const label = xml.createElementNS(ns, "text");
              label.setAttribute("x", String(x + 16));
              label.setAttribute("y", String(y + 106));
              label.setAttribute("font-size", "20");
              label.setAttribute("font-family", "Arial, sans-serif");
              label.setAttribute("fill", "#111");
              label.textContent = item.label;
              svgRoot.appendChild(label);
            });
            const title = xml.createElementNS(ns, "text");
            title.setAttribute("x", String(margin));
            title.setAttribute("y", "54");
            title.setAttribute("font-size", "36");
            title.setAttribute("font-family", "Arial, sans-serif");
            title.setAttribute("font-weight", "700");
            title.setAttribute("fill", "#101010");
            title.textContent = "OPM Legend";
            svgRoot.appendChild(title);
            const injected = new XMLSerializer().serializeToString(xml);
            document.body.removeChild(host);
            return injected;
          })();
        }
        addLegendCellsToPaper(graph, id, x, y, w, h) {
          const leftX = x + 16;
          const rightX = x + 250;
          const yPos = y + 16;
          const obj = (px, py, ww = 110, hh = 48) => {
            const o = new OpmObject();
            o.position(px, py);
            o.resize(ww, hh);
            graph.addCell(o);
            return o;
          };
          const proc = (px, py, ww = 112, hh = 48) => {
            const p = new OpmProcess();
            p.position(px, py);
            p.resize(ww, hh);
            graph.addCell(p);
            return p;
          };
          switch (id) {
            case "object":
              obj(leftX, yPos);
              break;
            case "statefulObject":
              {
                obj(leftX, yPos, 150, 58);
                const s1 = new OpmState("s1");
                s1.position(leftX + 18, yPos + 34);
                s1.resize(50, 22);
                graph.addCell(s1);
                const s2 = new OpmState("s2");
                s2.position(leftX + 76, yPos + 34);
                s2.resize(56, 22);
                graph.addCell(s2);
                break;
              }
            case "process":
              proc(leftX, yPos);
              break;
            case "inzoomedObject":
              {
                const o = obj(leftX, yPos, 125, 56);
                o.attr("rect/stroke-width", 5);
                break;
              }
            case "inzoomedProcess":
              const pz = proc(leftX, yPos, 135, 56);
              pz.attr("ellipse/stroke-width", 5);
              break;
            case "consumptionLink":
              {
                const o = obj(leftX, yPos);
                const p = proc(rightX, yPos);
                graph.addCell(new ConsumptionLink_ConsumptionLink(o, p, false, false, false));
                break;
              }
            case "resultLink":
              {
                const p = proc(leftX, yPos);
                const o = obj(rightX, yPos);
                graph.addCell(new ResultLink_ResultLink(p, o, false, false));
                break;
              }
            case "effectLink":
              {
                const o = obj(leftX, yPos);
                const p = proc(rightX, yPos);
                graph.addCell(new EffectLink(o, p, false, false, false));
                break;
              }
            case "agentLink":
              {
                const o = obj(leftX, yPos);
                o.setEssence(Essence.Physical);
                const p = proc(rightX, yPos);
                graph.addCell(new AgentLink(o, p, false, false, false));
                break;
              }
            case "instrumentLink":
              {
                const o = obj(leftX, yPos);
                const p = proc(rightX, yPos);
                graph.addCell(new InstrumentLink(o, p, false, false, false));
                break;
              }
            case "unidirectionalTaggedLink":
              {
                const o1 = obj(leftX, yPos);
                const o2 = obj(rightX, yPos);
                graph.addCell(new UnidirectionalTaggedLink(o1, o2));
                break;
              }
            case "bidirectionalTaggedLink":
              {
                const o1 = obj(leftX, yPos);
                const o2 = obj(rightX, yPos);
                graph.addCell(new BiDirectionalTaggedLink(o1, o2));
                break;
              }
            case "aggregationParticipation":
              {
                const o1 = obj(leftX, yPos);
                const o2 = obj(rightX, yPos + 16);
                graph.addCell(new AggregationLink(o1, o2, graph));
                break;
              }
            case "exhibitionCharacterization":
              {
                const o1 = obj(leftX, yPos);
                const o2 = obj(rightX, yPos + 16);
                graph.addCell(new ExhibitionLink(o1, o2, graph));
                break;
              }
            case "generalizationSpecialization":
              {
                const o1 = obj(leftX, yPos);
                const o2 = obj(rightX, yPos + 16);
                graph.addCell(new GeneralizationLink(o1, o2, graph));
                break;
              }
            case "classificationInstantiation":
              {
                const o1 = obj(leftX, yPos);
                const o2 = obj(rightX, yPos + 16);
                graph.addCell(new InstantiationLink(o1, o2, graph));
                break;
              }
            case "invocationLink":
              {
                const p1 = proc(leftX, yPos);
                const p2 = proc(rightX, yPos);
                const link = new InvocationLink(p1, p2, false, false);
                graph.addCell(link);
                if (typeof link.UpdateVertices === "function") {
                  link.UpdateVertices();
                }
                break;
              }
            case "undertimeExceptionLink":
              {
                const p1 = proc(leftX, yPos);
                const p2 = proc(rightX, yPos);
                graph.addCell(new UndertimeExceptionLink(p1, p2, false, false));
                break;
              }
            case "overtimeExceptionLink":
              {
                const p1 = proc(leftX, yPos);
                const p2 = proc(rightX, yPos);
                graph.addCell(new OvertimeExceptionLink(p1, p2, false, false));
                break;
              }
            case "undertimeOvertimeExceptionLink":
              {
                const p1 = proc(leftX, yPos);
                const p2 = proc(rightX, yPos);
                graph.addCell(new OvertimeUndertimeExceptionLink(p1, p2, false, false));
                break;
              }
            default:
              break;
          }
        }
        getLegendScopeLabel(scope) {
          return this.legendScopeOptions.find(opt => opt.id === scope)?.label || scope;
        }
        renderLegendCard(item, x, y, w, h, objectStroke, processStroke, objectFill, stateFill, textColor) {
          const titleY = 100;
          return `
<g transform="translate(${x}, ${y})">
  <rect x="0" y="0" rx="8" ry="8" width="${w}" height="${h}" fill="#ffffff" stroke="#d9d9d9"/>
  ${this.renderSymbol(item.id, objectStroke, processStroke, objectFill, stateFill)}
  <text x="16" y="${titleY}" font-size="20" font-family="Arial, sans-serif" fill="${textColor}">${item.label}</text>
</g>`;
        }
        renderSymbol(id, objectStroke, processStroke, objectFill, stateFill) {
          const lineColor = "#586D8C";
          const objectA = `<rect x="16" y="16" width="110" height="48" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>`;
          const objectB = `<rect x="250" y="16" width="110" height="48" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>`;
          const processA = `<ellipse cx="70" cy="40" rx="56" ry="24" fill="#ffffff" stroke="${processStroke}" stroke-width="3"/>`;
          const processB = `<ellipse cx="304" cy="40" rx="56" ry="24" fill="#ffffff" stroke="${processStroke}" stroke-width="3"/>`;
          const procMarker = `<defs><marker id="mProc" markerWidth="24" markerHeight="18" refX="20" refY="9" orient="auto"><path d="M0,9 L23,17 L12,9 L23,1 L0,9" fill="white" stroke="${lineColor}" stroke-width="2"/></marker></defs>`;
          const uniMarker = `<defs><marker id="mUni" markerWidth="20" markerHeight="20" refX="16" refY="10" orient="auto"><polyline points="0,10 20,0 0,10 20,20" fill="none" stroke="${lineColor}" stroke-width="2"/></marker></defs>`;
          const biMarkerStart = `<defs><marker id="mBiS" markerWidth="20" markerHeight="20" refX="0" refY="10" orient="auto"><polyline points="0.5,10 20,0" fill="none" stroke="${lineColor}" stroke-width="2"/></marker></defs>`;
          const biMarkerEnd = `<defs><marker id="mBiT" markerWidth="20" markerHeight="20" refX="20" refY="10" orient="auto"><polyline points="0.5,10 20,0" fill="none" stroke="${lineColor}" stroke-width="2"/></marker></defs>`;
          const invMarker = `<defs><marker id="mInv" markerWidth="24" markerHeight="18" refX="20" refY="9" orient="auto"><polygon points="0,9 23,17 12,9 23,1 0,9" fill="white" stroke="${lineColor}" stroke-width="2"/></marker></defs>`;
          switch (id) {
            case "object":
              return `${objectA}`;
            case "statefulObject":
              return `<rect x="16" y="12" width="150" height="58" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<rect x="34" y="33" width="50" height="24" rx="5" fill="${stateFill}" stroke="#9a8f45" stroke-width="2"/>
<rect x="92" y="33" width="56" height="24" rx="5" fill="${stateFill}" stroke="#9a8f45" stroke-width="2"/>`;
            case "process":
              return `${processA}`;
            case "inzoomedProcess":
              return `<ellipse cx="90" cy="40" rx="70" ry="28" fill="#ffffff" stroke="${processStroke}" stroke-width="4"/>`;
            case "consumptionLink":
              return `${objectA}${processB}${procMarker}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5" marker-end="url(#mProc)"/>`;
            case "resultLink":
              return `${processA}${objectB}${procMarker}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5" marker-end="url(#mProc)"/>`;
            case "effectLink":
              return `${objectA}${processB}${procMarker}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5" marker-start="url(#mProc)" marker-end="url(#mProc)"/>`;
            case "agentLink":
              return `${objectA}${processB}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5"/><circle cx="245" cy="40" r="5" fill="${lineColor}" stroke="${lineColor}"/>`;
            case "instrumentLink":
              return `${objectA}${processB}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5"/><circle cx="245" cy="40" r="5" fill="white" stroke="${lineColor}" stroke-width="2"/>`;
            case "unidirectionalTaggedLink":
              return `${objectA}${objectB}${uniMarker}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5" marker-end="url(#mUni)"/>`;
            case "bidirectionalTaggedLink":
              return `${objectA}${objectB}${biMarkerStart}${biMarkerEnd}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5" marker-start="url(#mBiS)" marker-end="url(#mBiT)"/>`;
            case "aggregationParticipation":
              return `<rect x="16" y="10" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<rect x="250" y="30" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<line x1="126" y1="30" x2="245" y2="50" stroke="${lineColor}" stroke-width="2.5"/>
<polygon points="204,41 226,32 217,54" fill="${lineColor}" stroke="${lineColor}" stroke-width="2"/>`;
            case "exhibitionCharacterization":
              return `<rect x="16" y="10" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<rect x="250" y="30" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<line x1="126" y1="30" x2="245" y2="50" stroke="${lineColor}" stroke-width="2.5"/>
<polygon points="204,41 226,32 217,54" fill="white" stroke="${lineColor}" stroke-width="2"/>
<polygon points="209,44 214,34 219,44" fill="${lineColor}" stroke="${lineColor}" stroke-width="1"/>`;
            case "generalizationSpecialization":
              return `<rect x="16" y="10" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<rect x="250" y="30" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<line x1="126" y1="30" x2="245" y2="50" stroke="${lineColor}" stroke-width="2.5"/>
<polygon points="204,41 226,32 217,54" fill="white" stroke="${lineColor}" stroke-width="2"/>`;
            case "classificationInstantiation":
              return `<rect x="16" y="10" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<rect x="250" y="30" width="110" height="40" fill="${objectFill}" stroke="${objectStroke}" stroke-width="3"/>
<line x1="126" y1="30" x2="245" y2="50" stroke="${lineColor}" stroke-width="2.5"/>
<polygon points="204,41 226,32 217,54" fill="white" stroke="${lineColor}" stroke-width="2"/>
<circle cx="214" cy="42" r="4" fill="${lineColor}" stroke="${lineColor}"/>`;
            case "invocationLink":
              return `${processA}${processB}${invMarker}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5" marker-end="url(#mInv)"/>`;
            case "undertimeExceptionLink":
              return `${processA}${processB}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5"/><polyline points="235,50 244,30 239.5,40 248,40 244,50 253,30" fill="none" stroke="${lineColor}" stroke-width="2"/>`;
            case "overtimeExceptionLink":
              return `${processA}${processB}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5"/><polyline points="236,50 245,30" fill="none" stroke="${lineColor}" stroke-width="2"/>`;
            case "undertimeOvertimeExceptionLink":
              return `${processA}${processB}<line x1="126" y1="40" x2="245" y2="40" stroke="${lineColor}" stroke-width="2.5"/><polyline points="233,50 242,30 237.5,40 246,40 242,50 251,30 246.5,40 261,40 257,50 266,30" fill="none" stroke="${lineColor}" stroke-width="2"/>`;
            default:
              return "";
          }
        }
        svgToPngBlob(svg, scale) {
          return new Promise((resolve, reject) => {
            const svgBlob = new Blob([svg], {
              type: "image/svg+xml;charset=utf-8"
            });
            const svgUrl = URL.createObjectURL(svgBlob);
            const img = new Image();
            let retriedWithDataUrl = false;
            img.onload = () => {
              try {
                const effectiveScale = Math.max(1, scale) * 2;
                const canvas = document.createElement("canvas");
                canvas.width = img.width * effectiveScale;
                canvas.height = img.height * effectiveScale;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                  URL.revokeObjectURL(svgUrl);
                  reject(new Error("Unable to create canvas context"));
                  return;
                }
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                  URL.revokeObjectURL(svgUrl);
                  if (!blob) {
                    reject(new Error("Failed to produce PNG blob"));
                    return;
                  }
                  resolve(blob);
                }, "image/png");
              } catch (e) {
                URL.revokeObjectURL(svgUrl);
                reject(e);
              }
            };
            img.onerror = error => {
              if (!retriedWithDataUrl) {
                retriedWithDataUrl = true;
                img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                return;
              }
              URL.revokeObjectURL(svgUrl);
              reject(error);
            };
            img.src = svgUrl;
          });
        }
        static #_ = (() => this.ɵfac = function ExportLegendDialogComponent_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || ExportLegendDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
        })();
        static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
          type: ExportLegendDialogComponent,
          selectors: [["opcloud-export-legend-dialog"]],
          decls: 28,
          vars: 9,
          consts: [[1, "exportHtmlDiv", 3, "hidden"], [1, "exportHtmlTitle"], [1, "htmlCheckboxDiv"], [1, "legend-field", "legend-field-wide"], [3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [1, "legend-field", "legend-field-narrow"], ["matInput", "", "type", "number", "min", "1", "max", "8", 3, "ngModelChange", "ngModel"], [2, "float", "left", 3, "ngModelChange", "ngModel", "checked"], [1, "htmlExportButtonsP"], ["mat-raised-button", "", 1, "htmlExportButton", 3, "click"], [2, "margin-top", "-120px", 3, "hidden"], ["id", "spinnerWorking", "mode", "indeterminate", 2, "height", "135px", "margin-left", "calc(50% - 65px)"], [3, "value"]],
          template: function ExportLegendDialogComponent_Template(rf, ctx) {
            if (rf & 1) {
              core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "p", 1);
              core /* ɵɵtext */.EFF(3, "Export OPM Legend");
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(4, "div", 2)(5, "mat-form-field", 3)(6, "mat-label");
              core /* ɵɵtext */.EFF(7, "Legend Scope");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(8, "mat-select", 4);
              core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportLegendDialogComponent_Template_mat_select_ngModelChange_8_listener($event) {
                if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.legendScope, $event)) {
                  ctx.legendScope = $event;
                }
                return $event;
              });
              core /* ɵɵtemplate */.DNE(9, ExportLegendDialogComponent_mat_option_9_Template, 2, 2, "mat-option", 5);
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(10, "mat-form-field", 6)(11, "mat-label");
              core /* ɵɵtext */.EFF(12, "Resolution Scale");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(13, "input", 7);
              core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportLegendDialogComponent_Template_input_ngModelChange_13_listener($event) {
                if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.resolutionScale, $event)) {
                  ctx.resolutionScale = $event;
                }
                return $event;
              });
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(14, "mat-form-field", 3)(15, "mat-label");
              core /* ɵɵtext */.EFF(16, "Output Format");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(17, "mat-select", 4);
              core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportLegendDialogComponent_Template_mat_select_ngModelChange_17_listener($event) {
                if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.legendFormat, $event)) {
                  ctx.legendFormat = $event;
                }
                return $event;
              });
              core /* ɵɵtemplate */.DNE(18, ExportLegendDialogComponent_mat_option_18_Template, 2, 2, "mat-option", 5);
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(19, "mat-checkbox", 8);
              core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportLegendDialogComponent_Template_mat_checkbox_ngModelChange_19_listener($event) {
                if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.colored, $event)) {
                  ctx.colored = $event;
                }
                return $event;
              });
              core /* ɵɵtext */.EFF(20, " Colored legend ");
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(21, "div", 9)(22, "button", 10);
              core /* ɵɵlistener */.bIt("click", function ExportLegendDialogComponent_Template_button_click_22_listener() {
                return ctx.exportLegend();
              });
              core /* ɵɵtext */.EFF(23, "Export");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(24, "button", 10);
              core /* ɵɵlistener */.bIt("click", function ExportLegendDialogComponent_Template_button_click_24_listener() {
                return ctx.cancel();
              });
              core /* ɵɵtext */.EFF(25, "Cancel");
              core /* ɵɵelementEnd */.k0s()()();
              core /* ɵɵelementStart */.j41(26, "div", 11);
              core /* ɵɵelement */.nrm(27, "progress-spinner", 12);
              core /* ɵɵelementEnd */.k0s();
            }
            if (rf & 2) {
              core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
              core /* ɵɵadvance */.R7$(8);
              core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.legendScope);
              core /* ɵɵadvance */.R7$();
              core /* ɵɵproperty */.Y8G("ngForOf", ctx.legendScopeOptions);
              core /* ɵɵadvance */.R7$(4);
              core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.resolutionScale);
              core /* ɵɵadvance */.R7$(4);
              core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.legendFormat);
              core /* ɵɵadvance */.R7$();
              core /* ɵɵproperty */.Y8G("ngForOf", ctx.legendFormatOptions);
              core /* ɵɵadvance */.R7$();
              core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.colored);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(7);
              core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
            }
          },
          dependencies: [NgForOf, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton, MatCheckbox, ProgressSpinner, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel],
          styles: [".exportHtmlDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important;min-height:255px;display:flex;flex-direction:column}.exportHtmlTitle[_ngcontent-%COMP%]{text-align:center;color:#000000de!important}.htmlCheckboxDiv[_ngcontent-%COMP%]{display:block!important;padding-right:8px;margin-top:-6px;flex:1 1 auto}.htmlExportButtonsP[_ngcontent-%COMP%]{display:flex!important;justify-content:center!important;gap:14px;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;padding-top:12px;margin-top:auto;padding-bottom:4px}.htmlExportButton[_ngcontent-%COMP%]{margin-top:0!important;min-width:120px;text-align:center;font-weight:500!important}.legend-field[_ngcontent-%COMP%]{text-align:start;display:block}.legend-field-wide[_ngcontent-%COMP%]{width:64%}.legend-field-narrow[_ngcontent-%COMP%]{width:90px}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}"]
        }))();
      }
      return ExportLegendDialogComponent;
    })();