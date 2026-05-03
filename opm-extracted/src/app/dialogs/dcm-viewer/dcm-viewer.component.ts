// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/dcm-viewer/dcm-viewer.component.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * DCM Viewer Component
 * Displays a visual preview of the DCM conversion result using Rappid
 */

const dcm_viewer_component_c0 = ["paperContainer"];
const dcm_viewer_component_c1 = ["navigatorContainer"];
function DCMViewerComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 20);
    core /* ɵɵelement */.nrm(1, "mat-spinner", 21);
    core /* ɵɵelementStart */.j41(2, "p");
    core /* ɵɵtext */.EFF(3, "Building DCM model...");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function DCMViewerComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 22)(1, "mat-icon", 23);
    core /* ɵɵtext */.EFF(2, "error");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "p");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "button", 19);
    core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_div_29_Template_button_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.close());
    });
    core /* ɵɵtext */.EFF(6, "Close");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.error);
  }
}
function DCMViewerComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 24);
    core /* ɵɵelement */.nrm(1, "div", 25, 0)(3, "div", 26, 1);
    core /* ɵɵelementEnd */.k0s();
  }
}
function DCMViewerComponent_div_31_div_4_div_4_div_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 35)(1, "strong");
    core /* ɵɵtext */.EFF(2, "Entry Criteria:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getEntryCriteriaCount());
  }
}
function DCMViewerComponent_div_31_div_4_div_4_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 39);
    core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_div_31_div_4_div_4_button_14_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG(4);
      return core /* ɵɵresetView */.Njj(ctx_r1.showDMNDecision());
    });
    core /* ɵɵelementStart */.j41(1, "mat-icon");
    core /* ɵɵtext */.EFF(2, "table_chart");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3, " Show DMN Decision ");
    core /* ɵɵelementEnd */.k0s();
  }
}
function DCMViewerComponent_div_31_div_4_div_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 34)(1, "div", 35)(2, "strong");
    core /* ɵɵtext */.EFF(3, "Name:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "span");
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "div", 35)(7, "strong");
    core /* ɵɵtext */.EFF(8, "Type:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "span");
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵpipe */.nI1(11, "titlecase");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(12, DCMViewerComponent_div_31_div_4_div_4_div_12_Template, 5, 1, "div", 36);
    core /* ɵɵelementStart */.j41(13, "div", 37);
    core /* ɵɵtemplate */.DNE(14, DCMViewerComponent_div_31_div_4_div_4_button_14_Template, 4, 0, "button", 38);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.selectedElement.name);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind1 */.bMT(11, 4, ctx_r1.selectedElement.dcmType));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selectedElementType === "task");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selectedElement.dmnDecisionId);
  }
}
function DCMViewerComponent_div_31_div_4_div_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 40)(1, "p");
    core /* ɵɵtext */.EFF(2, "No element selected. Click on an element in the diagram to view its details.");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function DCMViewerComponent_div_31_div_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 30)(1, "div", 31)(2, "h4");
    core /* ɵɵtext */.EFF(3, "Element Details");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(4, DCMViewerComponent_div_31_div_4_div_4_Template, 15, 6, "div", 32)(5, DCMViewerComponent_div_31_div_4_div_5_Template, 3, 0, "div", 33);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.selectedElement);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r1.selectedElement);
  }
}
function DCMViewerComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 27)(1, "button", 28);
    core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_div_31_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.togglePropertiesPanel());
    });
    core /* ɵɵelementStart */.j41(2, "mat-icon");
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(4, DCMViewerComponent_div_31_div_4_Template, 6, 2, "div", 29);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("matTooltip", ctx_r1.propertiesPanelOpen ? "Hide Details" : "Show Details");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.propertiesPanelOpen ? "chevron_right" : "chevron_left");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.propertiesPanelOpen);
  }
}
let DCMViewerComponent = /*#__PURE__*/(() => {
  class DCMViewerComponent {
    constructor(dialogRef, initRappidService, dcmExportService, canonicalOPMExport, dialog, cdr) {
      this.dialogRef = dialogRef;
      this.initRappidService = initRappidService;
      this.dcmExportService = dcmExportService;
      this.canonicalOPMExport = canonicalOPMExport;
      this.dialog = dialog;
      this.cdr = cdr;
      this.dcmIR = null;
      this.loading = true;
      this.error = null;
      this.canonicalOPM = null; // Store canonical OPM for name resolution
      this.modelName = "DCM Case Model"; // Store model name for file exports
      // Selected element for properties panel
      this.selectedElement = null;
      this.selectedElementType = null;
      this.propertiesPanelOpen = false;
      // Highlighting
      this.highlightedElements = new Set();
      this.dimmedElements = new Set();
      // Layout constants (same as CMMNDI exporter)
      this.TASK_WIDTH = 130;
      this.TASK_HEIGHT = 50;
      this.TASK_SPACING = 20;
      this.STAGE_PADDING = 20;
      this.MILESTONE_SPACING = 100;
    }
    ngOnInit() {
      this.buildDCMIR();
    }
    ngAfterViewInit() {
      // Wait for DCM-IR to be built, then initialize
      // This will be triggered after buildDCMIR completes
    }
    ngOnDestroy() {
      this.cleanup();
    }
    /**
     * Build DCM-IR in memory (same logic as export, but no file generation)
     */
    buildDCMIR() {
      var _this = this;
      return (0, default)(function* () {
        try {
          _this.loading = true;
          const opmModel = _this.initRappidService.opmModel;
          // Export canonical OPM for name resolution
          _this.canonicalOPM = _this.canonicalOPMExport.exportCanonicalOPM(opmModel);
          // Store model name for file exports
          _this.modelName = _this.canonicalOPM.modelName || opmModel.name || "DCM Case Model";
          // Use the public method from the service
          _this.dcmIR = yield _this.dcmExportService.buildDCMIRForViewer(opmModel);
          _this.loading = false;
          // Initialize Rappid after DCM-IR is built and view is ready
          setTimeout(() => {
            if (_this.dcmIR && !_this.error) {
              _this.initializeRappid();
              _this.renderDCMDiagram(_this.dcmIR);
            }
          }, 100);
        } catch (err) {
          _this.error = err.message || "Failed to build DCM-IR";
          _this.loading = false;
        }
      })();
    }
    /**
     * Initialize Rappid components
     */
    initializeRappid() {
      // Create graph
      this.graph = new joint.dia.Graph();
      // Create paper (will be wrapped by paperScroller)
      // Paper dimensions will be auto-resized by scroller
      this.paper = new joint.dia.Paper({
        model: this.graph,
        width: 2000,
        // Initial size, will be auto-resized
        height: 2000,
        // Initial size, will be auto-resized
        gridSize: 10,
        drawGrid: false,
        // No grid dots, just gray background like OPCloud
        background: {
          color: "#E1E6EB" // OPCloud gray background
        },
        defaultConnectionPoint: {
          name: "boundary"
        },
        defaultAnchor: {
          name: "center"
        },
        interactive: {
          linkMove: false,
          elementMove: false
        },
        // Ensure links are visible
        linkView: joint.dia.LinkView.extend({
          options: {
            shortLinkLength: 40,
            longLinkLength: 150,
            linkToolsOffset: 10,
            doubleLinkToolsOffset: 20
          }
        })
      });
      // Create paper scroller (like OPCloud) - this wraps the paper
      this.paperScroller = new joint.ui.PaperScroller({
        paper: this.paper,
        autoResizePaper: true,
        // Automatically resize paper to fit content
        cursor: "grab",
        scrollWhileDragging: true,
        // Enable scrolling while dragging
        contentOptions: {
          padding: 50 // Add padding for better scrolling experience
        }
      });
      // Append paper scroller to container (scroller contains the paper)
      this.paperContainer.element.nativeElement.appendChild(this.paperScroller.el);
      this.paperScroller.render();
      // Create navigator (floating in bottom-left corner)
      if (this.navigatorContainer) {
        this.navigator = new joint.ui.Navigator({
          width: 200,
          height: 150,
          paperScroller: this.paperScroller,
          zoom: false
        });
        const navigatorEl = this.navigatorContainer.element.nativeElement;
        navigatorEl.appendChild(this.navigator.el);
        this.navigator.render();
        // Ensure navigator doesn't overflow
        const navigatorWrapper = navigatorEl.querySelector(".joint-navigator");
        if (navigatorWrapper) {
          navigatorWrapper.style.overflow = "hidden";
        }
      }
      // Create selection
      this.selection = new joint.ui.Selection({
        paper: this.paper
      });
      // Setup event handlers
      this.setupEventHandlers();
    }
    /**
     * Setup Rappid event handlers
     */
    setupEventHandlers() {
      if (!this.paper || !this.selection) {
        return;
      }
      // Selection handling - handle clicks on blank paper area
      this.paper.on("blank:pointerdown", () => {
        this.clearSelection();
      });
      this.paper.on("element:pointerdown", (elementView, evt) => {
        if (evt) {
          evt.stopPropagation(); // Prevent event bubbling
        }
        if (this.selection && elementView && elementView.model) {
          const model = elementView.model;
          // Only select if it's a valid DCM element (has dcmType)
          const dcmType = model.get("dcmType");
          if (dcmType) {
            this.selection.collection.reset([model]);
            this.onElementSelected(model);
          } else {
            // Not a DCM element, clear selection
            this.clearSelection();
          }
        }
      });
      // Also handle cell:pointerdown as fallback
      this.graph.on("change:position", () => {
        // Ensure elements stay with paper when scrolled
      });
      // Tooltip on hover - only for valid DCM elements
      this.paper.on("element:mouseenter", elementView => {
        const element = elementView.model;
        if (!element) {
          return;
        }
        // Only show tooltip for valid DCM elements (have dcmType)
        const dcmType = element.get("dcmType");
        if (!dcmType) {
          return; // Don't show tooltip for non-DCM elements (like case plan model background)
        }
        const name = element.get("name") || element.get("attrs/label/text") || "Unknown";
        const type = dcmType;
        const entryCriteriaCount = type === "task" ? this.getEntryCriteriaCountForElement(element) : "";
        if (this.tooltip) {
          this.tooltip.remove();
        }
        let tooltipContent = `<div class="dcm-tooltip"><strong>${name}</strong><br>Type: ${type}`;
        if (entryCriteriaCount) {
          tooltipContent += `<br>Entry Criteria: ${entryCriteriaCount}`;
        }
        tooltipContent += "</div>";
        this.tooltip = new joint.ui.Tooltip({
          target: elementView.el,
          content: tooltipContent,
          position: "top"
        });
        this.tooltip.show();
      });
      this.paper.on("element:mouseleave", () => {
        if (this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      });
    }
    /**
     * Handle element selection
     */
    onElementSelected(element) {
      if (!element) {
        return;
      }
      const dcmType = element.get("dcmType");
      const name = element.get("name") || element.get("attrs/label/text") || "Unknown";
      const sourceOPMId = element.get("sourceOPMId");
      const dmnDecisionId = element.get("dmnDecisionId");
      // Determine element type
      if (dcmType === "task") {
        this.selectedElementType = "task";
      } else if (dcmType === "stage") {
        this.selectedElementType = "stage";
      } else if (dcmType === "milestone") {
        this.selectedElementType = "milestone";
      } else {
        this.selectedElementType = null;
      }
      // Find DMN decision name if available
      let dmnDecisionName;
      if (dmnDecisionId && this.dcmIR) {
        const decision = this.dcmIR.decisions.find(d => d.id === dmnDecisionId);
        dmnDecisionName = decision?.name;
      }
      this.selectedElement = {
        name,
        dcmType,
        sourceOPMId,
        dmnDecisionId,
        dmnDecisionName
      };
      // Highlight connected elements
      this.highlightConnectedElements(element);
      // Open panel and trigger change detection
      this.propertiesPanelOpen = true;
      this.cdr.detectChanges();
    }
    /**
     * Highlight connected elements and dim others
     */
    highlightConnectedElements(selectedElement) {
      if (!this.graph || !this.dcmIR) {
        return;
      }
      // Clear previous highlighting
      this.clearHighlighting();
      const elementId = selectedElement.id;
      const dcmType = selectedElement.get("dcmType");
      // Always highlight the selected element
      this.highlightedElements.add(elementId);
      this.updateElementHighlight(elementId, true);
      // Find connected elements based on type
      if (dcmType === "task") {
        // Find the task in DCM-IR by matching sourceOPMId
        const sourceOPMId = selectedElement.get("sourceOPMId");
        const task = this.dcmIR.plan.tasks.find(t => t.sourceProcessId === sourceOPMId);
        if (task) {
          // Highlight entry criteria links - find sentries and their referenced elements
          task.entryCriteria.forEach(sentryId => {
            const sentry = this.dcmIR.plan.sentries.find(s => s.id === sentryId);
            if (sentry && sentry.onPart) {
              sentry.onPart.forEach(onPart => {
                const planItemId = onPart.planItemRef.replace("pi_", "");
                // Find milestone that this sentry references
                const milestone = this.dcmIR.plan.milestones.find(m => m.id === planItemId);
                if (milestone) {
                  const milestoneElement = this.findElementBySourceId(milestone.sourceStateId, "milestone");
                  if (milestoneElement) {
                    this.highlightedElements.add(milestoneElement.id);
                    this.updateElementHighlight(milestoneElement.id, true);
                  }
                }
              });
            }
          });
        }
      } else if (dcmType === "milestone") {
        // Find tasks that connect to this milestone
        const milestoneSourceId = selectedElement.get("sourceOPMId");
        const milestone = this.dcmIR.plan.milestones.find(m => m.sourceStateId === milestoneSourceId);
        if (milestone) {
          // Find sentries that reference this milestone
          this.dcmIR.plan.sentries.forEach(sentry => {
            if (sentry.onPart) {
              const referencesMilestone = sentry.onPart.some(onPart => {
                const planItemId = onPart.planItemRef.replace("pi_", "");
                return planItemId === milestone.id;
              });
              if (referencesMilestone) {
                // Find tasks that use this sentry
                this.dcmIR.plan.tasks.forEach(task => {
                  if (task.entryCriteria.includes(sentry.id)) {
                    const taskElement = this.findElementBySourceId(task.sourceProcessId, "task");
                    if (taskElement) {
                      this.highlightedElements.add(taskElement.id);
                      this.updateElementHighlight(taskElement.id, true);
                    }
                  }
                });
              }
            }
          });
        }
      }
      // Dim all non-highlighted elements
      this.graph.getCells().forEach(cell => {
        if (cell.isElement() && cell.get("dcmType")) {
          const cellId = cell.id;
          if (!this.highlightedElements.has(cellId)) {
            this.dimmedElements.add(cellId);
            this.updateElementHighlight(cellId, false, true);
          }
        }
      });
      // Highlight entry criteria links
      this.highlightEntryCriteriaLinks();
    }
    /**
     * Clear all highlighting and restore normal view
     */
    clearHighlighting() {
      // Clear all element highlighting - restore all elements to normal state
      if (this.graph) {
        this.graph.getCells().forEach(cell => {
          if (cell.isElement() && cell.get("dcmType")) {
            // Restore normal state for all DCM elements
            cell.attr("body/opacity", 1);
            cell.attr("label/opacity", 1);
            cell.attr("body/stroke-width", 2);
          }
        });
        // Clear link highlighting - restore all links to normal
        this.graph.getLinks().forEach(link => {
          link.attr("line/stroke", "#0070c0");
          link.attr("line/stroke-width", 2);
          link.attr("line/opacity", 1);
        });
      }
      this.highlightedElements.clear();
      this.dimmedElements.clear();
    }
    /**
     * Update element highlight state
     */
    updateElementHighlight(elementId, highlight, dim = false) {
      if (!this.graph) {
        return;
      }
      const element = this.graph.getCell(elementId);
      if (!element || !element.isElement()) {
        return;
      }
      if (highlight) {
        // Highlight: bright colors, thicker border
        element.attr("body/stroke-width", 3);
        element.attr("body/opacity", 1);
        element.attr("label/opacity", 1);
      } else if (dim) {
        // Dim: reduced opacity
        element.attr("body/opacity", 0.3);
        element.attr("label/opacity", 0.3);
        element.attr("body/stroke-width", 1);
      } else {
        // Normal: restore defaults
        element.attr("body/opacity", 1);
        element.attr("label/opacity", 1);
        element.attr("body/stroke-width", 2);
      }
    }
    /**
     * Highlight entry criteria links
     */
    highlightEntryCriteriaLinks() {
      if (!this.graph || !this.dcmIR) {
        return;
      }
      // Highlight links connected to highlighted elements
      this.graph.getLinks().forEach(link => {
        const sourceId = link.get("source").id;
        const targetId = link.get("target").id;
        if (this.highlightedElements.has(sourceId) || this.highlightedElements.has(targetId)) {
          link.attr("line/stroke", "#1A3763");
          link.attr("line/stroke-width", 3);
          link.attr("line/opacity", 1);
        } else {
          link.attr("line/stroke", "#0070c0");
          link.attr("line/stroke-width", 1);
          link.attr("line/opacity", 0.3);
        }
      });
    }
    /**
     * Find element by source ID and type
     */
    findElementBySourceId(sourceId, type) {
      if (!this.graph) {
        return null;
      }
      return this.graph.getCells().find(cell => {
        if (!cell.isElement()) {
          return false;
        }
        return cell.get("dcmType") === type && cell.get("sourceOPMId") === sourceId;
      });
    }
    /**
     * Render DCM-IR as Rappid diagram
     */
    renderDCMDiagram(dcmIR) {
      if (!this.graph || !this.paper) {
        return;
      }
      // Clear existing elements
      this.graph.clear();
      // Calculate layout positions
      const layout = this.calculateLayout(dcmIR);
      // Render case plan model (container) - don't make it selectable
      // Ensure it's large enough to contain all elements with padding
      const casePlanWidth = layout.totalWidth + 100;
      const casePlanHeight = layout.totalHeight + 100;
      const casePlanModelShape = new CMMNCasePlanModel({
        position: {
          x: 50,
          y: 50
        },
        size: {
          width: casePlanWidth,
          height: casePlanHeight
        }
      });
      // Mark as non-selectable background element
      casePlanModelShape.set("selectable", false);
      casePlanModelShape.set("dcmType", null); // No dcmType so it won't be selected
      this.graph.addCell(casePlanModelShape);
      // Render stages FIRST (background layer) - so tasks appear on top
      dcmIR.plan.stages.forEach(stage => {
        const stagePos = layout.stages[stage.id];
        if (stagePos) {
          const StageShape = stage.isDiscretionary ? CMMNDiscretionaryStage : CMMNStage;
          const stageShape = new StageShape({
            position: {
              x: stagePos.x,
              y: stagePos.y
            },
            size: {
              width: Math.max(300, stagePos.width),
              height: Math.max(150, stagePos.height)
            },
            // Ensure minimum size
            attrs: {
              label: {
                text: stage.name
              },
              body: {
                "stroke-width": 3,
                // Ensure thick border
                stroke: "#0070c0",
                fill: "#E8F4F8",
                opacity: 1
              }
            }
          });
          stageShape.set("dcmType", "stage");
          stageShape.set("name", stage.name);
          stageShape.set("sourceOPMId", stage.sourceProcessId);
          stageShape.set("stageId", stage.id); // Store stage ID for lookup
          stageShape.set("z", 0); // Background layer
          this.graph.addCell(stageShape);
        } else {}
      });
      // Render tasks (foreground layer) - positioned inside their stages
      dcmIR.plan.tasks.forEach(task => {
        let taskPos = layout.tasks[task.id];
        // FALLBACK: If task doesn't have a position, give it a default position
        // This ensures tasks are always rendered, even if layout calculation failed
        if (!taskPos) {
          taskPos = {
            x: 300,
            y: 300,
            width: this.TASK_WIDTH,
            height: this.TASK_HEIGHT
          };
        }
        if (taskPos) {
          // Truncate long task names to prevent overflow
          const truncatedName = task.name.length > 20 ? task.name.substring(0, 17) + "..." : task.name;
          // Select task shape based on type and discretionary flag
          let TaskShape;
          if (task.isDiscretionary) {
            TaskShape = CMMNDiscretionaryTask;
          } else {
            // Use appropriate shape based on task type
            switch (task.type) {
              case "process":
                TaskShape = CMMNProcessTask;
                break;
              case "case":
                TaskShape = CMMNCaseTask;
                break;
              case "decision":
                TaskShape = CMMNDecisionTask;
                break;
              case "human":
              default:
                TaskShape = CMMNHumanTask;
                break;
            }
          }
          const taskShape = new TaskShape({
            position: {
              x: taskPos.x,
              y: taskPos.y
            },
            size: {
              width: this.TASK_WIDTH,
              height: this.TASK_HEIGHT
            },
            attrs: {
              label: {
                text: truncatedName
              },
              entryCriterion: {
                display: task.entryCriteria && task.entryCriteria.length > 0 ? "block" : "none"
              }
            }
          });
          taskShape.set("dcmType", "task");
          taskShape.set("name", task.name);
          taskShape.set("sourceOPMId", task.sourceProcessId);
          taskShape.set("taskType", task.type);
          taskShape.set("taskId", task.id); // Store task ID for lookup
          taskShape.set("z", 10); // Foreground layer (above stages)
          // Find sentry for DMN reference
          const sentry = dcmIR.plan.sentries.find(s => task.entryCriteria.includes(s.id));
          if (sentry && sentry.dmnDecisionRef) {
            taskShape.set("dmnDecisionId", sentry.dmnDecisionRef);
          }
          this.graph.addCell(taskShape);
        }
      });
      // Render milestones
      dcmIR.plan.milestones.forEach(milestone => {
        const milestonePos = layout.milestones[milestone.id];
        if (milestonePos) {
          // Truncate long milestone names to prevent overflow
          const truncatedMilestoneName = milestone.name.length > 15 ? milestone.name.substring(0, 12) + "..." : milestone.name;
          const milestoneShape = new CMMNMilestone({
            position: {
              x: milestonePos.x,
              y: milestonePos.y
            },
            size: {
              width: 80,
              height: 40
            },
            attrs: {
              label: {
                text: truncatedMilestoneName
              }
            }
          });
          milestoneShape.set("dcmType", "milestone");
          milestoneShape.set("name", milestone.name);
          milestoneShape.set("sourceOPMId", milestone.sourceStateId);
          milestoneShape.set("milestoneId", milestone.id); // Store milestone ID for lookup
          this.graph.addCell(milestoneShape);
        }
      });
      // Render sentries AFTER tasks are rendered (entry and exit criteria as rhombuses)
      // This ensures task elements exist when we try to find them
      // This must be done before links so sentry shapes exist
      this.renderSentries(dcmIR, layout);
      // Render entry criteria links (Milestone → Sentry → Task)
      this.renderEntryCriteriaLinks(dcmIR, layout);
      // Render event listeners
      this.renderEventListeners(dcmIR, layout);
      // Render case file items
      this.renderCaseFileItems(dcmIR, layout);
      // Render participants/roles
      this.renderParticipants(dcmIR, layout);
      // Connect case file items to tasks (connectors)
      this.renderCaseFileItemConnectors(dcmIR, layout);
      // Ensure all links are dashed after all rendering is complete
      setTimeout(() => {
        if (this.graph) {
          this.graph.getLinks().forEach(link => {
            // Force all links to be dashed - use both methods for compatibility
            // Method 1: Direct attribute setting
            link.attr("line/strokeDasharray", "8 4");
            // Method 2: Update attrs object directly
            const attrs = link.get("attrs") || {};
            if (!attrs.line) {
              attrs.line = {};
            }
            attrs.line.strokeDasharray = "8 4"; // Use string key format
            link.set("attrs", attrs);
            // Method 3: Force update via SVG element directly (most reliable)
            const linkView = this.paper.findViewByModel(link);
            if (linkView && linkView.el) {
              // Find all path elements in the link (JointJS links use paths)
              const pathElements = linkView.el.querySelectorAll("path");
              pathElements.forEach(path => {
                if (path.getAttribute("stroke")) {
                  path.setAttribute("stroke-dasharray", "8 4");
                }
              });
            }
          });
        }
      }, 500);
      // DIAGNOSTIC: Log rendering results
      setTimeout(() => {
        if (this.graph) {
          const cells = this.graph.getCells();
          const stages = cells.filter(c => c.get("dcmType") === "stage");
          const tasks = cells.filter(c => c.get("dcmType") === "task");
          const milestones = cells.filter(c => c.get("dcmType") === "milestone");
          const participants = cells.filter(c => c.get("dcmType") === "participant");
          const links = this.graph.getLinks();
        }
      }, 200);
      // Auto-fit after rendering
      setTimeout(() => {
        if (this.paperScroller && this.graph && this.paper) {
          // Calculate content bounds (excluding background case plan model)
          const cells = this.graph.getCells().filter(cell => {
            // Filter out the case plan model background - only get actual DCM elements
            return cell.get("dcmType") !== null && cell.get("dcmType") !== undefined;
          });
          if (cells.length > 0) {
            // Calculate bounding box manually from filtered cells
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            cells.forEach(cell => {
              const position = cell.get("position");
              const size = cell.get("size") || {
                width: 0,
                height: 0
              };
              if (position) {
                minX = Math.min(minX, position.x);
                minY = Math.min(minY, position.y);
                maxX = Math.max(maxX, position.x + size.width);
                maxY = Math.max(maxY, position.y + size.height);
              }
            });
            if (minX !== Infinity && minY !== Infinity) {
              const bboxWidth = maxX - minX;
              const bboxHeight = maxY - minY;
              // Set paper size to fit content with padding - ensure it's large enough
              // Include case plan model size
              const casePlanWidth = layout.totalWidth + 100;
              const casePlanHeight = layout.totalHeight + 100;
              const paperWidth = Math.max(casePlanWidth + 200, bboxWidth + 600);
              const paperHeight = Math.max(casePlanHeight + 200, bboxHeight + 600);
              this.paper.setDimensions(paperWidth, paperHeight);
            }
          }
          // Center content and fit to view
          this.paperScroller.center();
          this.paperScroller.zoomToFit({
            padding: 50
          });
        }
      }, 300);
    }
    /**
     * Calculate layout positions for all elements using hierarchical layout
     * Stages contain their tasks (visual containment like CMMN standard)
     */
    calculateLayout(dcmIR) {
      const layout = {
        stages: {},
        tasks: {},
        milestones: {},
        totalWidth: 1200,
        totalHeight: 800
      };
      // Group tasks by their parent stage
      const tasksByStage = new Map();
      const milestonesByStage = new Map();
      const rootTasks = [];
      const rootMilestones = [];
      dcmIR.plan.tasks.forEach(task => {
        // Find which stage this task belongs to
        let belongsToStage = null;
        for (const stage of dcmIR.plan.stages) {
          if (this.isTaskInStage(task, stage, dcmIR)) {
            belongsToStage = stage.id;
            break;
          }
        }
        if (belongsToStage) {
          if (!tasksByStage.has(belongsToStage)) {
            tasksByStage.set(belongsToStage, []);
          }
          tasksByStage.get(belongsToStage).push(task);
        } else {
          rootTasks.push(task);
        }
      });
      // Group milestones by their parent stage (milestones belong to stages if their state's object is related to the stage's process)
      dcmIR.plan.milestones.forEach(milestone => {
        // Find which stage this milestone belongs to
        // A milestone belongs to a stage if the milestone's state object is related to the stage's process
        let belongsToStage = null;
        if (this.canonicalOPM && milestone.sourceStateId) {
          // Find the state in canonical OPM
          const state = this.canonicalOPM.states.find(s => s.id === milestone.sourceStateId);
          if (state && state.objectId) {
            // Find processes that produce or consume this object (via Result/Effect links)
            const relatedProcessIds = new Set();
            this.canonicalOPM.relations.forEach(rel => {
              if ((rel.type === "result" || rel.type === "effect") && rel.targetId === state.objectId) {
                relatedProcessIds.add(rel.sourceId);
              }
            });
            // Find which stage's process is related to this milestone
            for (const stage of dcmIR.plan.stages) {
              if (relatedProcessIds.has(stage.sourceProcessId)) {
                belongsToStage = stage.id;
                break;
              }
            }
          }
        }
        if (belongsToStage) {
          if (!milestonesByStage.has(belongsToStage)) {
            milestonesByStage.set(belongsToStage, []);
          }
          milestonesByStage.get(belongsToStage).push(milestone);
        } else {
          rootMilestones.push(milestone);
        }
      });
      const startX = 200;
      const startY = 200;
      let currentY = startY;
      let maxX = startX;
      const stagePadding = 30; // Padding inside stages
      const stageHeaderHeight = 40; // Space for stage label
      const verticalSpacing = 200; // Space between stages
      const taskSpacing = 20; // Space between tasks within a stage
      // Position root-level milestones at TOP (milestones not in any stage)
      const rootMilestoneY = startY;
      const milestoneSpacing = 180;
      let rootMilestoneX = startX;
      rootMilestones.forEach(milestone => {
        layout.milestones[milestone.id] = {
          x: rootMilestoneX,
          y: rootMilestoneY,
          width: 80,
          height: 40
        };
        rootMilestoneX += 80 + milestoneSpacing;
        maxX = Math.max(maxX, rootMilestoneX);
      });
      // Position stages hierarchically based on OPM process tree
      // Root stages first, then nested stages
      const rootStages = dcmIR.plan.stages.filter(s => !s.parentStageId);
      const nestedStages = dcmIR.plan.stages.filter(s => s.parentStageId);
      // Start stages below root milestones (if any) or at startY
      currentY = rootMilestones.length > 0 ? rootMilestoneY + 40 + verticalSpacing : startY;
      // Layout stages hierarchically: root stages first, then nested stages inside their parents
      if (rootStages.length === 0) {
        // No root stages found - all processes may have become tasks
      }
      rootStages.forEach(stage => {
        const stageTasks = tasksByStage.get(stage.id) || [];
        const stageMilestones = milestonesByStage.get(stage.id) || [];
        const childStages = nestedStages.filter(s => s.parentStageId === stage.id);
        // Calculate stage dimensions based on tasks AND child stages
        const tasksPerRow = Math.min(4, Math.max(stageTasks.length, childStages.length));
        const taskWidth = this.TASK_WIDTH;
        const taskHeight = this.TASK_HEIGHT;
        const stageX = startX;
        const stageY = currentY;
        // Position tasks and child stages INSIDE the stage
        let taskX = stageX + stagePadding;
        let taskY = stageY + stageHeaderHeight + stagePadding;
        let maxTaskX = taskX;
        let maxTaskY = taskY;
        let col = 0;
        let row = 0;
        // First, position child stages (nested stages inside this stage)
        // Use separate positioning for child stages to avoid overlap with direct tasks
        let childStageX = stageX + stagePadding;
        let childStageY = stageY + stageHeaderHeight + stagePadding;
        let childStageCol = 0;
        let childStageRow = 0;
        const childStagesPerRow = Math.min(2, childStages.length); // Limit child stages per row
        childStages.forEach(childStage => {
          const childStageTasks = tasksByStage.get(childStage.id) || [];
          const childStageHeight = Math.max(100, stageHeaderHeight + stagePadding + Math.ceil(childStageTasks.length / tasksPerRow) * (taskHeight + taskSpacing) + stagePadding);
          const childStageWidth = Math.max(300, tasksPerRow * (taskWidth + taskSpacing) + stagePadding);
          if (childStageCol >= childStagesPerRow) {
            childStageCol = 0;
            childStageRow++;
            childStageX = stageX + stagePadding;
            childStageY = stageY + stageHeaderHeight + stagePadding + childStageRow * (childStageHeight + taskSpacing + 50);
          }
          layout.stages[childStage.id] = {
            x: childStageX,
            y: childStageY,
            width: childStageWidth,
            height: childStageHeight
          };
          // Position tasks inside child stage
          let childTaskX = childStageX + stagePadding;
          let childTaskY = childStageY + stageHeaderHeight + stagePadding;
          let childCol = 0;
          let childRow = 0;
          childStageTasks.forEach(childTask => {
            if (childCol >= tasksPerRow) {
              childCol = 0;
              childRow++;
              childTaskX = childStageX + stagePadding;
              childTaskY = childStageY + stageHeaderHeight + stagePadding + childRow * (taskHeight + taskSpacing);
            }
            layout.tasks[childTask.id] = {
              x: childTaskX,
              y: childTaskY,
              width: taskWidth,
              height: taskHeight
            };
            childTaskX += taskWidth + taskSpacing;
            childCol++;
          });
          maxTaskX = Math.max(maxTaskX, childStageX + childStageWidth);
          maxTaskY = Math.max(maxTaskY, childStageY + childStageHeight);
          childStageX += childStageWidth + taskSpacing;
          childStageCol++;
        });
        // Then, position direct tasks of this stage (not in child stages)
        // Position them BELOW child stages to avoid overlap
        let directTaskY;
        if (childStages.length === 0) {
          directTaskY = stageY + stageHeaderHeight + stagePadding; // If no child stages, start at top
        } else {
          // Position below the last row of child stages - use actual child stage heights
          // Find the maximum Y position of all child stages (bottom of the lowest child stage)
          let maxChildStageBottom = stageY + stageHeaderHeight + stagePadding;
          childStages.forEach(childStage => {
            const childStagePos = layout.stages[childStage.id];
            if (childStagePos) {
              const childStageBottom = childStagePos.y + childStagePos.height;
              maxChildStageBottom = Math.max(maxChildStageBottom, childStageBottom);
            }
          });
          // Position direct tasks below all child stages with spacing
          directTaskY = maxChildStageBottom + taskSpacing + 30;
        }
        let directTaskX = stageX + stagePadding;
        let directTaskCol = 0;
        stageTasks.forEach(task => {
          // Skip if task is already positioned in a child stage
          if (layout.tasks[task.id]) {
            return;
          }
          if (directTaskCol >= tasksPerRow) {
            directTaskCol = 0;
            directTaskX = stageX + stagePadding;
            directTaskY += taskHeight + taskSpacing;
          }
          layout.tasks[task.id] = {
            x: directTaskX,
            y: directTaskY,
            width: taskWidth,
            height: taskHeight
          };
          maxTaskX = Math.max(maxTaskX, directTaskX + taskWidth);
          maxTaskY = Math.max(maxTaskY, directTaskY + taskHeight);
          directTaskX += taskWidth + taskSpacing;
          directTaskCol++;
        });
        // Position milestones inside the stage (after tasks)
        let milestoneX = stageX + stagePadding;
        let milestoneY = maxTaskY + taskSpacing + 20; // Position milestones below tasks
        stageMilestones.forEach(milestone => {
          layout.milestones[milestone.id] = {
            x: milestoneX,
            y: milestoneY,
            width: 80,
            height: 40
          };
          milestoneX += 80 + milestoneSpacing;
          maxTaskX = Math.max(maxTaskX, milestoneX);
          maxTaskY = Math.max(maxTaskY, milestoneY + 40);
        });
        // Calculate stage size to contain all tasks, child stages, and milestones with padding
        // Ensure stage is large enough to contain all content with proper padding
        // If stage has no tasks/children, give it a minimum size so it's still visible
        const hasContent = stageTasks.length > 0 || childStages.length > 0 || stageMilestones.length > 0;
        const stageWidth = hasContent ? Math.max(400, Math.max(maxTaskX - stageX, maxX - stageX) + stagePadding * 2) : 400; // Minimum width for empty stages
        const stageHeight = hasContent ? Math.max(150, maxTaskY - stageY + stagePadding * 2) : 150; // Minimum height for empty stages
        layout.stages[stage.id] = {
          x: stageX,
          y: stageY,
          width: stageWidth,
          height: stageHeight
        };
        maxX = Math.max(maxX, stageX + stageWidth);
        currentY = stageY + stageHeight + verticalSpacing;
      });
      // Position root-level tasks (not in any stage) BELOW stages
      if (rootTasks.length > 0) {
        let rootTaskX = startX;
        let rootTaskY = currentY;
        const rootTasksPerRow = Math.min(4, rootTasks.length);
        let rootCol = 0;
        rootTasks.forEach((task, index) => {
          if (rootCol >= rootTasksPerRow) {
            rootCol = 0;
            rootTaskX = startX;
            rootTaskY += this.TASK_HEIGHT + 30;
          }
          layout.tasks[task.id] = {
            x: rootTaskX,
            y: rootTaskY,
            width: this.TASK_WIDTH,
            height: this.TASK_HEIGHT
          };
          rootTaskX += this.TASK_WIDTH + 30;
          rootCol++;
          maxX = Math.max(maxX, rootTaskX);
        });
        currentY = rootTaskY + this.TASK_HEIGHT + verticalSpacing;
      }
      // Calculate total dimensions
      const caseFileItemsHeight = dcmIR.caseFileModel?.items?.length ? dcmIR.caseFileModel.items.length * 120 + 100 : 0;
      const participantsHeight = dcmIR.roles?.length ? 200 : 0;
      layout.totalHeight = Math.max(currentY + 100, Math.max(caseFileItemsHeight, participantsHeight));
      layout.totalWidth = Math.max(1400, Math.max(maxX + 300, 1200));
      return layout;
    }
    /**
     * Check if task belongs to stage (same logic as CMMN exporter)
     * Uses OPM process hierarchy: task belongs to stage if task's process is a child of stage's process
     */
    isTaskInStage(task, stage, dcmIR) {
      if (!task.sourceProcessId || !stage.sourceProcessId) {
        return false;
      }
      // Use canonical OPM process hierarchy
      if (this.canonicalOPM && this.canonicalOPM.processes) {
        const taskProcess = this.canonicalOPM.processes.find(p => p.id === task.sourceProcessId);
        const stageProcess = this.canonicalOPM.processes.find(p => p.id === stage.sourceProcessId);
        if (taskProcess && stageProcess) {
          // Task belongs to stage if task's process is a direct child of stage's process
          // This matches OPM hierarchy: "Invoice Checking consists of Against Purchase Order Checking, ..."
          return taskProcess.parentProcessId === stageProcess.id;
        }
      }
      // Fallback: check if task's process ID starts with stage's process ID
      return task.sourceProcessId.startsWith(stage.sourceProcessId) && task.sourceProcessId !== stage.sourceProcessId;
    }
    /**
     * Get child processes of a stage (for hierarchical layout)
     */
    getChildProcessesOfStage(stage) {
      if (!this.canonicalOPM || !this.canonicalOPM.processes) {
        return [];
      }
      const stageProcess = this.canonicalOPM.processes.find(p => p.id === stage.sourceProcessId);
      if (!stageProcess || !stageProcess.childrenProcessIds) {
        return [];
      }
      // Return all child processes
      return this.canonicalOPM.processes.filter(p => stageProcess.childrenProcessIds.includes(p.id));
    }
    /**
     * Render a sentry for a specific task (helper method)
     */
    renderSentryForTask(sentry, task, taskPos, dcmIR, layout) {
      // Position sentry between milestone and task (in the middle)
      // Find the milestone that triggers this sentry to position it correctly
      let sentryX = taskPos.x - 50; // Default: to the left of task
      let sentryY = taskPos.y + taskPos.height / 2 - 15;
      // If sentry has onPart, try to position it between milestone and task
      if (sentry.onPart && sentry.onPart.length > 0) {
        const onPart = sentry.onPart[0];
        // Extract milestone ID from planItemRef
        const planItemId = onPart.planItemRef.replace(/^pi_(milestone_|task_|stage_)?/, "");
        const milestone = dcmIR.plan.milestones.find(m => m.id === planItemId || `pi_${m.id}` === onPart.planItemRef || `pi_milestone_${m.id}` === onPart.planItemRef);
        if (milestone && layout.milestones[milestone.id]) {
          const milestonePos = layout.milestones[milestone.id];
          // Position sentry halfway between milestone and task
          sentryX = (milestonePos.x + milestonePos.width / 2 + taskPos.x) / 2 - 15;
          sentryY = (milestonePos.y + milestonePos.height / 2 + taskPos.y + taskPos.height / 2) / 2 - 15;
        }
      }
      const sentryShape = new CMMNEntryCriterion({
        position: {
          x: sentryX,
          y: sentryY
        },
        size: {
          width: 30,
          height: 30
        } // Increased size for visibility
      });
      sentryShape.set("z", 50); // Above tasks, below links
      // Get sentry name from ifPart or generate one
      const sentryName = sentry.ifPart?.predicate || (sentry.dmnDecisionRef ? "DMN Decision" : "Entry Criterion");
      sentryShape.set("dcmType", "sentry");
      sentryShape.set("sentryId", sentry.id);
      sentryShape.set("sentryType", "entry");
      sentryShape.set("name", sentryName);
      this.graph.addCell(sentryShape);
    }
    /**
     * Render sentries as rhombuses (entry and exit criteria)
     */
    renderSentries(dcmIR, layout) {
      if (!this.graph) {
        return;
      }
      // Render entry criteria (white rhombus)
      // NOTE: Tasks must be rendered first (they are rendered before this method is called)
      let sentriesRendered = 0;
      dcmIR.plan.tasks.forEach(task => {
        if (task.entryCriteria && task.entryCriteria.length > 0) {
          task.entryCriteria.forEach(sentryId => {
            const sentry = dcmIR.plan.sentries.find(s => s.id === sentryId);
            if (sentry) {
              const taskPos = layout.tasks[task.id];
              if (taskPos) {
                // Find task element - it should exist since tasks are rendered before sentries
                const taskElement = this.findElementByTaskId(task.id);
                if (taskElement) {
                  // Render sentry for this task
                  this.renderSentryForTask(sentry, task, taskPos, dcmIR, layout);
                  sentriesRendered++;
                }
              }
            }
          });
        }
      });
      // Render exit criteria (black rhombus) - for stages
      dcmIR.plan.stages.forEach(stage => {
        if (stage.exitCriteria && stage.exitCriteria.length > 0) {
          stage.exitCriteria.forEach(sentryId => {
            const sentry = dcmIR.plan.sentries.find(s => s.id === sentryId);
            if (sentry) {
              const stagePos = layout.stages[stage.id];
              if (stagePos) {
                const stageElement = this.findElementByStageId(stage.id);
                if (stageElement) {
                  // Position sentry to the right of stage
                  const sentryShape = new CMMNExitCriterion({
                    position: {
                      x: stagePos.x + stagePos.width - 25,
                      // Adjust for larger size
                      y: stagePos.y + stagePos.height / 2 - 15 // Adjust for larger size
                    },
                    size: {
                      width: 30,
                      height: 30
                    } // Increased size for visibility
                  });
                  // Get sentry name from ifPart or generate one
                  const sentryName = sentry.ifPart?.predicate || "Exit Criterion";
                  sentryShape.set("dcmType", "sentry");
                  sentryShape.set("sentryId", sentry.id);
                  sentryShape.set("sentryType", "exit");
                  sentryShape.set("name", sentryName);
                  this.graph.addCell(sentryShape);
                  // Connect sentry to stage with dashed line (CMMN connector)
                  const link = new joint.dia.Link({
                    source: {
                      id: stageElement.id
                    },
                    target: {
                      id: sentryShape.id
                    },
                    attrs: {
                      line: {
                        stroke: "#1A3763",
                        strokeWidth: 2,
                        strokeDasharray: "8 4" // Dashed connector - use string key format (OPCloud pattern)
                      }
                    },
                    z: 100,
                    // High z-index for visibility
                    visible: true,
                    connector: {
                      name: "smooth"
                    },
                    // Smooth connector (curved, not straight)
                    smooth: true // Ensure smooth routing
                  });
                  this.graph.addCell(link);
                }
              }
            }
          });
        }
      });
    }
    /**
     * Render event listeners (Timer and User)
     */
    renderEventListeners(dcmIR, layout) {
      if (!this.graph || !dcmIR.plan.eventListeners) {
        return;
      }
      dcmIR.plan.eventListeners.forEach(listener => {
        let targetElement = null;
        let targetPos = null;
        if (listener.targetPlanItemType === "task") {
          targetPos = layout.tasks[listener.targetPlanItemId];
          targetElement = this.findElementByTaskId(listener.targetPlanItemId);
        } else if (listener.targetPlanItemType === "stage") {
          targetPos = layout.stages[listener.targetPlanItemId];
          targetElement = this.findElementByStageId(listener.targetPlanItemId);
        }
        if (targetElement && targetPos) {
          let listenerShape = null;
          if (listener.type === "timer") {
            listenerShape = new CMMNTimerEventListener({
              position: {
                x: targetPos.x - 70,
                // Position to the left of target
                y: targetPos.y + targetPos.height / 2 - 20
              },
              size: {
                width: 40,
                height: 40
              }
            });
          } else if (listener.type === "user") {
            listenerShape = new CMMNUserEventListener({
              position: {
                x: targetPos.x - 70,
                // Position to the left of target
                y: targetPos.y + targetPos.height / 2 - 20
              },
              size: {
                width: 40,
                height: 40
              }
            });
          }
          if (listenerShape) {
            listenerShape.set("dcmType", "eventListener");
            listenerShape.set("listenerType", listener.type);
            listenerShape.set("listenerId", listener.id);
            listenerShape.set("name", listener.name);
            if (listener.timerExpression) {
              listenerShape.set("timerExpression", listener.timerExpression);
            }
            listenerShape.set("z", 20); // Above tasks but below sentries
            listenerShape.set("name", listener.name);
            listenerShape.set("listenerType", listener.type);
            listenerShape.set("listenerId", listener.id);
            this.graph.addCell(listenerShape);
            // Connect event listener to target with dashed line
            const link = new joint.dia.Link({
              source: {
                id: listenerShape.id
              },
              target: {
                id: targetElement.id
              },
              attrs: {
                line: {
                  stroke: "#1A3763",
                  strokeWidth: 2,
                  strokeDasharray: "8 4" // Dashed connector - use string key format (OPCloud pattern)
                }
              },
              z: 100,
              // High z-index for visibility
              visible: true,
              connector: {
                name: "smooth"
              },
              // Smooth connector (curved, not straight)
              smooth: true // Ensure smooth routing
            });
            this.graph.addCell(link);
          }
        }
      });
    }
    /**
     * Render case file items
     */
    renderCaseFileItems(dcmIR, layout) {
      if (!this.graph || !dcmIR.caseFileModel || !dcmIR.caseFileModel.items) {
        return;
      }
      // Position case file items on the right side
      const startX = layout.totalWidth - 200;
      const startY = 150;
      let currentY = startY;
      dcmIR.caseFileModel.items.forEach((item, index) => {
        // Get object name from canonical OPM
        let itemName = `Item ${index + 1}`;
        if (this.canonicalOPM && item.objectId) {
          const object = this.canonicalOPM.objects.find(obj => obj.id === item.objectId);
          if (object && object.name) {
            itemName = object.name;
          } else {
            // Fallback: try to extract from objectId if it's a stable ID
            itemName = item.objectId.replace(/^object_/, "");
          }
        }
        // Truncate long names
        const truncatedName = itemName.length > 15 ? itemName.substring(0, 12) + "..." : itemName;
        const itemShape = new CMMNCaseFileItem({
          position: {
            x: startX,
            y: currentY
          },
          size: {
            width: 80,
            height: 100
          },
          attrs: {
            label: {
              text: truncatedName
            }
          }
        });
        itemShape.set("dcmType", "caseFileItem");
        itemShape.set("name", itemName);
        itemShape.set("itemId", item.id);
        this.graph.addCell(itemShape);
        currentY += 120; // Spacing between items
      });
    }
    /**
     * Render participants/roles and connect them to tasks
     */
    renderParticipants(dcmIR, layout) {
      if (!this.graph || !dcmIR.roles || dcmIR.roles.length === 0) {
        return;
      }
      // Position participants at the bottom left
      const startX = 150;
      const startY = layout.totalHeight - 200;
      let currentX = startX;
      let currentY = startY;
      const participantSpacing = 100;
      const participantsPerRow = 4;
      let participantIndex = 0;
      dcmIR.roles.forEach((role, index) => {
        if (participantIndex > 0 && participantIndex % participantsPerRow === 0) {
          currentX = startX;
          currentY += 100; // Next row
        }
        const participantShape = new CMMNParticipant({
          position: {
            x: currentX,
            y: currentY
          },
          size: {
            width: 60,
            height: 80
          },
          attrs: {
            label: {
              text: role.name
            }
          }
        });
        participantShape.set("dcmType", "participant");
        participantShape.set("name", role.name);
        participantShape.set("roleId", role.id);
        this.graph.addCell(participantShape);
        // Connect participant to tasks that have this role assigned
        let linkCount = 0;
        dcmIR.plan.tasks.forEach(task => {
          if (task.roleRefs && task.roleRefs.includes(role.id)) {
            const taskElement = this.findElementByTaskId(task.id);
            if (taskElement) {
              linkCount++;
              // Create dashed link from participant to task (role assignment)
              const roleLink = new joint.dia.Link({
                source: {
                  id: participantShape.id
                },
                target: {
                  id: taskElement.id
                },
                attrs: {
                  line: {
                    stroke: "#1A3763",
                    strokeWidth: 1.5,
                    strokeDasharray: "6 3",
                    // Dashed connector - use string key format (OPCloud pattern)
                    opacity: 0.7
                  }
                },
                z: 50,
                // Above background but below sentry links
                visible: true,
                connector: {
                  name: "smooth"
                },
                // Smooth connector (curved, not straight)
                smooth: true // Ensure smooth routing
              });
              this.graph.addCell(roleLink);
            } else {}
          }
          // Note: Not matching is expected - tasks can have multiple roles, and we're iterating through all roles
        });
        currentX += 60 + participantSpacing;
        participantIndex++;
      });
    }
    /**
     * Connect case file items to tasks that use them (connectors)
     */
    renderCaseFileItemConnectors(dcmIR, layout) {
      if (!this.graph || !dcmIR.caseFileModel || !dcmIR.caseFileModel.items) {
        return;
      }
      // For each case file item, connect to tasks that might use it
      // This is a simplified connection - in real CMMN, this would be based on actual usage
      dcmIR.caseFileModel.items.forEach(item => {
        const itemElement = this.graph.getCells().find(cell => cell.get("dcmType") === "caseFileItem" && cell.get("itemId") === item.id);
        if (!itemElement) {
          return;
        }
        // Connect to tasks that actually use this case file item (based on OPM relations)
        // For now, limit connections to prevent "smear black" effect - only connect to first few tasks
        // In a real implementation, this would be based on actual data flow analysis
        const connectedTasks = dcmIR.plan.tasks.slice(0, 3); // Limit to first 3 tasks to reduce clutter
        connectedTasks.forEach(task => {
          const taskElement = this.findElementByTaskId(task.id);
          if (taskElement) {
            // Create connector (dashed line, no execution semantics)
            const connector = new joint.dia.Link({
              source: {
                id: itemElement.id
              },
              target: {
                id: taskElement.id
              },
              attrs: {
                line: {
                  stroke: "#1A3763",
                  strokeWidth: 1.5,
                  strokeDasharray: "6 3",
                  // Dashed connector - use camelCase (Rappid standard)
                  opacity: 0.7
                }
              },
              z: 50,
              // Above background but below sentry links
              visible: true,
              connector: {
                name: "smooth"
              },
              // Smooth connector (curved, not straight)
              smooth: true // Ensure smooth routing
            });
            this.graph.addCell(connector);
          }
        });
      });
    }
    /**
     * Find element by task ID
     */
    findElementByTaskId(taskId) {
      if (!this.graph) {
        return null;
      }
      return this.graph.getCells().find(cell => {
        if (!cell.isElement()) {
          return false;
        }
        // Match by task ID stored in element
        const storedTaskId = cell.get("taskId");
        return cell.get("dcmType") === "task" && storedTaskId === taskId;
      });
    }
    /**
     * Find element by stage ID
     */
    findElementByStageId(stageId) {
      if (!this.graph) {
        return null;
      }
      return this.graph.getCells().find(cell => {
        if (!cell.isElement()) {
          return false;
        }
        // Match by stage ID stored in element
        const storedStageId = cell.get("stageId");
        return cell.get("dcmType") === "stage" && storedStageId === stageId;
      });
    }
    /**
     * Render entry criteria links (CMMN proper: Milestone → Sentry → Task)
     * In CMMN, entry criteria connect milestones to tasks via sentries (rhombuses)
     */
    renderEntryCriteriaLinks(dcmIR, layout) {
      if (!this.graph) {
        return;
      }
      // For each task with entry criteria, create proper CMMN connections
      dcmIR.plan.tasks.forEach(task => {
        task.entryCriteria.forEach(sentryId => {
          const sentry = dcmIR.plan.sentries.find(s => s.id === sentryId);
          if (!sentry) {
            return;
          }
          // Find the sentry shape (rhombus) - it should have been created in renderSentries
          const sentryShape = this.graph.getCells().find(cell => cell.get("dcmType") === "sentry" && cell.get("sentryId") === sentry.id && cell.get("sentryType") === "entry");
          if (!sentryShape) {
            return;
          }
          const taskElement = this.findElementByTaskId(task.id);
          if (!taskElement) {
            return;
          }
          // Connect sentry to task (sentry rhombus → task)
          const sentryToTaskLink = new joint.dia.Link({
            source: {
              id: sentryShape.id
            },
            target: {
              id: taskElement.id
            },
            attrs: {
              line: {
                stroke: "#1A3763",
                strokeWidth: 2,
                strokeDasharray: "8 4" // Dashed connector - use string key format (OPCloud pattern)
              },
              markerEnd: {
                type: "path",
                d: "M 10 -5 0 0 10 5",
                fill: "#1A3763",
                stroke: "#1A3763",
                strokeWidth: 1
              }
            },
            z: 150,
            // Very high z-index to ensure visibility above all elements
            visible: true,
            connector: {
              name: "smooth"
            },
            // Smooth connector (curved, not straight)
            smooth: true // Ensure smooth routing
          });
          this.graph.addCell(sentryToTaskLink);
          // If sentry has onPart, connect milestones to sentry
          if (sentry.onPart && sentry.onPart.length > 0) {
            sentry.onPart.forEach(onPart => {
              // Extract milestone ID from planItemRef
              // planItemRef format: "pi_<milestoneId>" or "pi_milestone_<milestoneId>" or "pi_task_<taskId>"
              // For milestones, we need to check if the planItemRef points to a milestone
              let milestone = null;
              // Try different planItemRef formats
              const planItemId = onPart.planItemRef.replace(/^pi_(milestone_|task_|stage_)?/, "");
              milestone = dcmIR.plan.milestones.find(m => m.id === planItemId || `pi_${m.id}` === onPart.planItemRef || `pi_milestone_${m.id}` === onPart.planItemRef);
              // If not found, try matching by checking if any milestone's plan item ID matches
              if (!milestone) {
                // Check if planItemRef might be a plan item ID that references a milestone
                milestone = dcmIR.plan.milestones.find(m => {
                  // Milestone plan item ID would be something like "pi_milestone_<milestoneId>"
                  const milestonePlanItemId = `pi_milestone_${m.id}`;
                  return milestonePlanItemId === onPart.planItemRef || `pi_${m.id}` === onPart.planItemRef;
                });
              }
              if (milestone) {
                const milestoneElement = this.findElementByMilestoneId(milestone.id);
                if (milestoneElement && sentryShape) {
                  // Connect milestone to sentry (milestone → sentry rhombus) with proper CMMN connector
                  const milestoneToSentryLink = new joint.dia.Link({
                    source: {
                      id: milestoneElement.id
                    },
                    target: {
                      id: sentryShape.id
                    },
                    attrs: {
                      line: {
                        stroke: "#1A3763",
                        strokeWidth: 2,
                        strokeDasharray: "8 4" // Dashed connector - use camelCase (Rappid standard)
                      },
                      markerEnd: {
                        type: "path",
                        d: "M 10 -5 0 0 10 5",
                        fill: "#1A3763",
                        stroke: "#1A3763",
                        strokeWidth: 1
                      }
                    },
                    z: 150,
                    // Very high z-index for visibility above everything
                    visible: true,
                    connector: {
                      name: "smooth"
                    },
                    // Smooth connector (curved, not straight)
                    smooth: true // Ensure smooth routing
                  });
                  this.graph.addCell(milestoneToSentryLink);
                }
              }
            });
          }
        });
      });
    }
    /**
     * Find element by milestone ID
     */
    findElementByMilestoneId(milestoneId) {
      if (!this.graph) {
        return null;
      }
      return this.graph.getCells().find(cell => {
        if (!cell.isElement()) {
          return false;
        }
        // Match by milestone ID stored in element
        const storedMilestoneId = cell.get("milestoneId");
        return cell.get("dcmType") === "milestone" && storedMilestoneId === milestoneId;
      });
    }
    /**
     * Find Rappid element ID by task ID (DCM-IR task ID, not sourceProcessId)
     */
    findElementIdByTaskId(taskId) {
      if (!this.graph) {
        return null;
      }
      const elements = this.graph.getElements();
      for (const element of elements) {
        const dcmType = element.get("dcmType");
        const storedTaskId = element.get("taskId");
        // Match by stored taskId (DCM-IR task ID)
        if (dcmType === "task" && storedTaskId === taskId) {
          return String(element.id);
        }
      }
      return null;
    }
    /**
     * Zoom controls
     */
    zoomOut() {
      if (this.paperScroller) {
        this.paperScroller.zoom(-0.2, {
          min: 0.2
        });
      }
    }
    zoomFit() {
      if (this.paperScroller) {
        this.paperScroller.zoomToFit({
          padding: 20
        });
      }
    }
    zoomIn() {
      if (this.paperScroller) {
        this.paperScroller.zoom(0.2, {
          max: 4
        });
      }
    }
    /**
     * Export functions
     */
    exportSVG() {
      if (this.paper) {
        // Use Rappid's built-in toSVG method
        this.paper.toSVG(svgString => {
          const blob = new Blob([svgString], {
            type: "image/svg+xml"
          });
          const fileName = this.sanitizeFileName(this.modelName) + ".svg";
          FileSaver_min.saveAs(blob, fileName);
        }, {
          useComputedStyles: false,
          convertImagesToDataUris: true
        });
      }
    }
    exportPNG() {
      if (this.paper) {
        // Use Rappid's built-in toJPEG method with better quality settings
        try {
          // First, ensure all links are properly styled before export
          this.graph.getLinks().forEach(link => {
            // Ensure all links have dashed styling - use camelCase
            link.attr("line/strokeDasharray", "8 4");
            const attrs = link.get("attrs") || {};
            if (!attrs.line) {
              attrs.line = {};
            }
            attrs.line.strokeDasharray = "8 4";
            link.set("attrs", attrs);
          });
          this.paper.toJPEG(imageData => {
            // imageData is already a data URL string, download directly
            const link = document.createElement("a");
            const fileName = this.sanitizeFileName(this.modelName) + ".jpg";
            link.download = fileName;
            link.href = imageData;
            link.click();
          }, {
            padding: 50,
            useComputedStyles: true,
            // Use computed styles for better rendering
            size: "3x",
            // Higher resolution (3x) to prevent black export issue
            quality: 0.95,
            // High quality
            backgroundColor: "#ffffff" // White background
          });
        } catch (err) {
          // Fallback: use SVG to PNG conversion
          this.paper.toSVG(svgString => {
            const svgBlob = new Blob([svgString], {
              type: "image/svg+xml;charset=utf-8"
            });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(blob => {
                if (blob) {
                  const fileName = this.sanitizeFileName(this.modelName) + ".png";
                  FileSaver_min.saveAs(blob, fileName);
                }
                URL.revokeObjectURL(url);
              }, "image/png");
            };
            img.src = url;
          }, {
            useComputedStyles: false,
            convertImagesToDataUris: true
          });
        }
      }
    }
    /**
     * Open export wizard
     */
    openExportWizard() {
      this.dialogRef.close();
      const config = new MatDialogConfig();
      config.width = "90%";
      config.height = "90%";
      config.maxWidth = "100vw";
      config.maxHeight = "100vh";
      config.panelClass = "full-screen-dialog";
      this.dialog.open(DCMExportWizardComponent, config);
    }
    /**
     * Get entry criteria count for a specific element
     */
    getEntryCriteriaCountForElement(element) {
      if (!this.dcmIR || !element) {
        return 0;
      }
      const sourceOPMId = element.get("sourceOPMId");
      if (!sourceOPMId) {
        return 0;
      }
      const task = this.dcmIR.plan.tasks.find(t => t.id === sourceOPMId || t.sourceProcessId === sourceOPMId);
      if (task) {
        return task.entryCriteria?.length || 0;
      } else {
        return 0;
      }
    }
    /**
     * Show DMN decision
     */
    showDMNDecision() {
      if (this.selectedElement && this.selectedElement.dmnDecisionId && this.dcmIR) {
        // Find the decision in DCM-IR
        const decision = this.dcmIR.decisions.find(d => d.id === this.selectedElement.dmnDecisionId);
        if (decision) {
          // Open DMN decision viewer dialog
          this.dialog.open(DMNDecisionViewerComponent, {
            width: "90%",
            height: "90%",
            maxWidth: "1200px",
            maxHeight: "800px",
            data: {
              decision
            }
          });
        } else {
          // Decision not found
          alert(`DMN decision "${this.selectedElement.dmnDecisionId}" not found in the model.`);
        }
      }
    }
    /**
     * Clear selection and restore normal view
     */
    clearSelection() {
      if (this.selection) {
        this.selection.cancelSelection();
      }
      this.selectedElement = null;
      this.selectedElementType = null;
      // Clear highlighting and restore normal view
      this.clearHighlighting();
      // Close panel
      this.propertiesPanelOpen = false;
      this.cdr.detectChanges();
    }
    /**
     * Toggle properties panel
     */
    togglePropertiesPanel() {
      this.propertiesPanelOpen = !this.propertiesPanelOpen;
      // Clear selection when closing panel
      if (!this.propertiesPanelOpen) {
        this.clearSelection();
      }
    }
    /**
     * Get entry criteria count for selected task
     */
    getEntryCriteriaCount() {
      if (!this.selectedElement || !this.dcmIR) {
        return 0;
      }
      const task = this.dcmIR.plan.tasks.find(t => t.id === this.selectedElement.sourceOPMId || t.name === this.selectedElement.name);
      if (task) {
        return task.entryCriteria?.length || 0;
      } else {
        return 0;
      }
    }
    /**
     * Close dialog
     */
    close() {
      this.dialogRef.close();
    }
    /**
     * Cleanup Rappid components
     */
    cleanup() {
      if (this.tooltip) {
        this.tooltip.remove();
      }
      if (this.selection) {
        this.selection.remove();
      }
      if (this.navigator) {
        this.navigator.remove();
      }
      if (this.paperScroller) {
        this.paperScroller.remove();
      }
      if (this.paper) {
        this.paper.remove();
      }
      if (this.graph) {
        this.graph.clear();
      }
    }
    /**
     * Sanitize file name by removing invalid characters
     */
    sanitizeFileName(fileName) {
      // Remove or replace invalid file name characters
      // Invalid characters: < > : " / \ | ? *
      return fileName.replace(/[<>:"/\\|?*]/g, "_") // Replace invalid chars with underscore
      .replace(/\s+/g, "_") // Replace spaces with underscore
      .replace(/_{2,}/g, "_") // Replace multiple underscores with single
      .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
      .substring(0, 200); // Limit length to 200 characters
    }
    static #_ = (() => this.ɵfac = function DCMViewerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DCMViewerComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(DCMExportWizardService), core /* ɵɵdirectiveInject */.rXU(CanonicalOPMExportService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(ChangeDetectorRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: DCMViewerComponent,
      selectors: [["opcloud-dcm-viewer"]],
      viewQuery: function DCMViewerComponent_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(dcm_viewer_component_c0, 5, ViewContainerRef);
          core /* ɵɵviewQuery */.GBs(dcm_viewer_component_c1, 5, ViewContainerRef);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.paperContainer = _t.first;
          }
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.navigatorContainer = _t.first;
          }
        }
      },
      decls: 37,
      vars: 6,
      consts: [["paperContainer", ""], ["navigatorContainer", ""], [1, "dcm-viewer-container"], [1, "dcm-viewer-header"], ["mat-icon-button", "", 1, "close-button", 3, "click"], [1, "dcm-toolbar"], ["mat-icon-button", "", "matTooltip", "Zoom Out", 3, "click"], ["mat-icon-button", "", "matTooltip", "Fit to Screen", 3, "click"], ["mat-icon-button", "", "matTooltip", "Zoom In", 3, "click"], [1, "spacer"], ["mat-button", "", 1, "export-button-toolbar", 3, "click"], [1, "dcm-viewer-content"], [1, "diagram-area"], ["class", "loading-container", 4, "ngIf"], ["class", "error-container", 4, "ngIf"], ["class", "paper-wrapper", 4, "ngIf"], ["class", "properties-panel-wrapper", 4, "ngIf"], [1, "dcm-viewer-footer"], ["mat-button", "", 1, "export-button", 3, "click"], ["mat-button", "", 3, "click"], [1, "loading-container"], ["diameter", "50"], [1, "error-container"], ["color", "warn"], [1, "paper-wrapper"], [1, "paper-container"], [1, "navigator-container"], [1, "properties-panel-wrapper"], ["mat-icon-button", "", 1, "toggle-panel-button", 3, "click", "matTooltip"], ["class", "properties-panel", 4, "ngIf"], [1, "properties-panel"], [1, "properties-header"], ["class", "properties-content", 4, "ngIf"], ["class", "properties-content no-selection", 4, "ngIf"], [1, "properties-content"], [1, "property-row"], ["class", "property-row", 4, "ngIf"], [1, "action-buttons"], ["mat-button", "", "color", "primary", 3, "click", 4, "ngIf"], ["mat-button", "", "color", "primary", 3, "click"], [1, "properties-content", "no-selection"]],
      template: function DCMViewerComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 2)(1, "div", 3)(2, "h3");
          core /* ɵɵtext */.EFF(3, "DCM Case Model Preview");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "button", 4);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_4_listener() {
            return ctx.close();
          });
          core /* ɵɵelementStart */.j41(5, "mat-icon");
          core /* ɵɵtext */.EFF(6, "close");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(7, "mat-toolbar", 5)(8, "button", 6);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_8_listener() {
            return ctx.zoomOut();
          });
          core /* ɵɵelementStart */.j41(9, "mat-icon");
          core /* ɵɵtext */.EFF(10, "zoom_out");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "button", 7);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_11_listener() {
            return ctx.zoomFit();
          });
          core /* ɵɵelementStart */.j41(12, "mat-icon");
          core /* ɵɵtext */.EFF(13, "fullscreen");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(14, "button", 8);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_14_listener() {
            return ctx.zoomIn();
          });
          core /* ɵɵelementStart */.j41(15, "mat-icon");
          core /* ɵɵtext */.EFF(16, "zoom_in");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(17, "span", 9);
          core /* ɵɵelementStart */.j41(18, "button", 10);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_18_listener() {
            return ctx.exportSVG();
          });
          core /* ɵɵelementStart */.j41(19, "mat-icon");
          core /* ɵɵtext */.EFF(20, "image");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(21, " Export SVG ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(22, "button", 10);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_22_listener() {
            return ctx.exportPNG();
          });
          core /* ɵɵelementStart */.j41(23, "mat-icon");
          core /* ɵɵtext */.EFF(24, "photo");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(25, " Export JPEG ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(26, "div", 11)(27, "div", 12);
          core /* ɵɵtemplate */.DNE(28, DCMViewerComponent_div_28_Template, 4, 0, "div", 13)(29, DCMViewerComponent_div_29_Template, 7, 1, "div", 14)(30, DCMViewerComponent_div_30_Template, 5, 0, "div", 15);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(31, DCMViewerComponent_div_31_Template, 5, 3, "div", 16);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(32, "div", 17)(33, "button", 18);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_33_listener() {
            return ctx.openExportWizard();
          });
          core /* ɵɵtext */.EFF(34, "Export");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(35, "button", 19);
          core /* ɵɵlistener */.bIt("click", function DCMViewerComponent_Template_button_click_35_listener() {
            return ctx.close();
          });
          core /* ɵɵtext */.EFF(36, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(27);
          core /* ɵɵclassProp */.AVh("panel-open", ctx.propertiesPanelOpen);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.loading);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.error && !ctx.loading);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.loading && !ctx.error);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.loading && !ctx.error);
        }
      },
      dependencies: [NgIf, MatToolbar, MatTooltip, MatIcon, MatButton, MatIconButton, MatProgressSpinner, TitleCasePipe],
      styles: [".dcm-viewer-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;width:100%;background:#fff;font-family:Roboto,Helvetica Neue,sans-serif}.dcm-viewer-header[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;padding:16px 24px;border-bottom:1px solid #e0e0e0;position:relative}.dcm-viewer-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0;font-family:Roboto,Helvetica Neue,sans-serif;font-size:20px;font-weight:500;color:#1a3763;text-align:center}.dcm-viewer-header[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]{position:absolute;right:24px}.dcm-toolbar[_ngcontent-%COMP%]{border-bottom:1px solid #e0e0e0;padding:0 8px;background:#fff}.dcm-toolbar[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1 1 auto}.dcm-toolbar[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin:0 4px;color:#1a3763;font-weight:400!important}.dcm-toolbar[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#1a3763}.dcm-toolbar[_ngcontent-%COMP%]   button.export-button-toolbar[_ngcontent-%COMP%]{font-weight:400!important}.dcm-viewer-content[_ngcontent-%COMP%]{display:flex;flex:1;overflow:hidden;position:relative}.diagram-area[_ngcontent-%COMP%]{flex:1;position:relative;overflow:hidden;background:#e1e6eb;transition:margin-right .3s ease}.diagram-area.panel-open[_ngcontent-%COMP%]{margin-right:320px}.loading-container[_ngcontent-%COMP%], .error-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px}.loading-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .error-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:16px;color:#666}.error-container[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:48px;width:48px;height:48px}.paper-wrapper[_ngcontent-%COMP%]{position:relative;width:100%;height:100%;overflow:hidden}.paper-container[_ngcontent-%COMP%]{width:100%;height:100%;position:absolute;inset:0;overflow:hidden}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller{width:100%!important;height:100%!important;background:#e1e6eb!important;position:absolute!important;inset:0!important;overflow:auto!important;overflow-x:auto!important;overflow-y:auto!important}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller .joint-paper{background:#e1e6eb!important;position:relative;min-width:100%!important;min-height:100%!important}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller .joint-paper-scroller-content{background:#e1e6eb!important;width:100%!important;height:100%!important;min-width:100%!important;min-height:100%!important}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller::-webkit-scrollbar{width:12px;height:12px}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller::-webkit-scrollbar-track{background:#f1f1f1;border-radius:6px}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller::-webkit-scrollbar-thumb{background:#888;border-radius:6px}.paper-container[_ngcontent-%COMP%]     .joint-paper-scroller::-webkit-scrollbar-thumb:hover{background:#555}.navigator-container[_ngcontent-%COMP%]{position:absolute;bottom:20px;left:20px;z-index:200;width:200px;height:150px;overflow:hidden;pointer-events:none}.navigator-container[_ngcontent-%COMP%]     .joint-navigator{background:#fff;border:1px solid #ccc;border-radius:4px;padding:8px;box-shadow:0 2px 4px #0000001a;pointer-events:auto;overflow:hidden;width:100%!important;height:100%!important;max-width:200px;max-height:150px}.properties-panel-wrapper[_ngcontent-%COMP%]{position:absolute;right:0;top:0;bottom:0;display:flex;align-items:stretch;z-index:100}.properties-panel-wrapper[_ngcontent-%COMP%]   .toggle-panel-button[_ngcontent-%COMP%]{position:absolute;left:-40px;top:50%;transform:translateY(-50%);z-index:101;background:#fff;border:1px solid #e0e0e0;border-right:none;border-radius:4px 0 0 4px;box-shadow:-2px 0 4px #0000001a}.properties-panel[_ngcontent-%COMP%]{width:300px;border-left:1px solid #e0e0e0;background:#fafafa;overflow-y:auto;padding:16px;position:relative;box-shadow:-2px 0 8px #0000001a}.properties-panel[_ngcontent-%COMP%]   .no-selection[_ngcontent-%COMP%]{padding:20px;text-align:center;color:#666;font-style:italic}.properties-panel[_ngcontent-%COMP%]   .properties-header[_ngcontent-%COMP%]{margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #e0e0e0}.properties-panel[_ngcontent-%COMP%]   .properties-header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:0;font-family:Roboto,Helvetica Neue,sans-serif;font-size:16px;font-weight:500;color:#1a3763}.properties-panel[_ngcontent-%COMP%]   mat-expansion-panel[_ngcontent-%COMP%]{box-shadow:none;border:1px solid #e0e0e0}.properties-panel[_ngcontent-%COMP%]   .properties-content[_ngcontent-%COMP%]{padding:0}.properties-panel[_ngcontent-%COMP%]   .property-row[_ngcontent-%COMP%]{display:flex;flex-direction:column;margin-bottom:16px;gap:4px}.properties-panel[_ngcontent-%COMP%]   .property-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:12px;color:#1a3763;text-transform:uppercase;letter-spacing:.5px;font-weight:500}.properties-panel[_ngcontent-%COMP%]   .property-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:14px;color:#1a3763;word-break:break-word}.properties-panel[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:8px;margin-top:16px}.properties-panel[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;justify-content:flex-start;color:#1a3763;font-weight:500}.properties-panel[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#1a3763}.dcm-viewer-footer[_ngcontent-%COMP%]{padding:16px 24px;border-top:1px solid #e0e0e0;display:flex;justify-content:center;gap:16px}.dcm-viewer-footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-weight:400!important;letter-spacing:normal;min-width:120px}.dcm-viewer-footer[_ngcontent-%COMP%]   button.export-button[_ngcontent-%COMP%]{background:#1a3763;color:#fff;border:1px solid rgba(0,0,0,.1);box-shadow:0 2px 4px #0000001f;border-radius:6px;font-weight:400!important}.dcm-viewer-footer[_ngcontent-%COMP%]   button.export-button[_ngcontent-%COMP%]:hover{background:#2a4a73}  .dcm-tooltip{padding:12px;background:#fff;border:1px solid #1a3763;border-radius:4px;box-shadow:0 2px 8px #00000026;font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;color:#1a3763;min-width:150px}  .dcm-tooltip strong{display:block;margin-bottom:4px;color:#1a3763;font-weight:500}  .joint-link path[stroke]{stroke-dasharray:8 4!important}  .joint-element[data-type=\"cmmn.Stage\"],   .joint-element[data-type=\"cmmn.DiscretionaryStage\"]{opacity:1!important;visibility:visible!important;display:block!important}  .joint-element[data-type=\"cmmn.Stage\"] .body,   .joint-element[data-type=\"cmmn.DiscretionaryStage\"] .body{stroke-width:4!important;stroke:#0070c0!important;fill:#e8f4f8!important;opacity:1!important;visibility:visible!important}  .joint-element[data-type=\"cmmn.Stage\"] .label,   .joint-element[data-type=\"cmmn.DiscretionaryStage\"] .label{font-weight:500!important;font-size:13px!important;fill:#0070c0!important;opacity:1!important;visibility:visible!important}  .joint-element[data-type=\"cmmn.Stage\"] rect[selector=body],   .joint-element[data-type=\"cmmn.DiscretionaryStage\"] rect[selector=body]{stroke-width:4!important;stroke:#0070c0!important;fill:#e8f4f8!important;opacity:1!important}  .joint-element[data-type=\"cmmn.EntryCriterion\"] .body{stroke-width:3!important;stroke:#1a3763!important;fill:#fff!important;opacity:1!important}  .joint-element[data-type=\"cmmn.ExitCriterion\"] .body{stroke-width:3!important;stroke:#1a3763!important;fill:#000!important;opacity:1!important}  .joint-element[data-type=\"cmmn.TimerEventListener\"],   .joint-element[data-type=\"cmmn.UserEventListener\"]{opacity:1!important}  .joint-element[data-type=\"cmmn.TimerEventListener\"] .outerCircle,   .joint-element[data-type=\"cmmn.TimerEventListener\"] .innerCircle,   .joint-element[data-type=\"cmmn.UserEventListener\"] .outerCircle,   .joint-element[data-type=\"cmmn.UserEventListener\"] .innerCircle{stroke-width:2!important;stroke:#1a3763!important}"]
    }))();
  }
  return DCMViewerComponent;
})();