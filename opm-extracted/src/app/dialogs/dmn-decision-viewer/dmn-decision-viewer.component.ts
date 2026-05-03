// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/dmn-decision-viewer/dmn-decision-viewer.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function DMNDecisionViewerComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 5)(1, "strong");
    core /* ɵɵtext */.EFF(2, "Source Task:");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.decision.sourceTaskName);
  }
}
function DMNDecisionViewerComponent_div_15_div_3_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "td", 17);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const input_r2 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(input_r2.id);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(input_r2.label);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh((input_r2.inputExpression == null ? null : input_r2.inputExpression.typeRef) || "N/A");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh((input_r2.inputExpression == null ? null : input_r2.inputExpression.text) || "N/A");
  }
}
function DMNDecisionViewerComponent_div_15_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 14)(1, "h5");
    core /* ɵɵtext */.EFF(2, "Inputs");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "table", 15)(4, "thead")(5, "tr")(6, "th");
    core /* ɵɵtext */.EFF(7, "ID");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "th");
    core /* ɵɵtext */.EFF(9, "Label");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "th");
    core /* ɵɵtext */.EFF(11, "Type");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "th");
    core /* ɵɵtext */.EFF(13, "Expression");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(14, "tbody");
    core /* ɵɵtemplate */.DNE(15, DMNDecisionViewerComponent_div_15_div_3_tr_15_Template, 9, 4, "tr", 16);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(15);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getInputs());
  }
}
function DMNDecisionViewerComponent_div_15_div_4_tr_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td");
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const output_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(output_r3.id);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(output_r3.label);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(output_r3.typeRef || "N/A");
  }
}
function DMNDecisionViewerComponent_div_15_div_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 14)(1, "h5");
    core /* ɵɵtext */.EFF(2, "Outputs");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "table", 15)(4, "thead")(5, "tr")(6, "th");
    core /* ɵɵtext */.EFF(7, "ID");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "th");
    core /* ɵɵtext */.EFF(9, "Label");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "th");
    core /* ɵɵtext */.EFF(11, "Type");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(12, "tbody");
    core /* ɵɵtemplate */.DNE(13, DMNDecisionViewerComponent_div_15_div_4_tr_13_Template, 7, 3, "tr", 16);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(13);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getOutputs());
  }
}
function DMNDecisionViewerComponent_div_15_div_5_th_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "th");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const input_r4 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(input_r4.label);
  }
}
function DMNDecisionViewerComponent_div_15_div_5_th_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "th");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const output_r5 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(output_r5.label);
  }
}
function DMNDecisionViewerComponent_div_15_div_5_tr_11_td_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "td", 20);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const inputIndex_r6 = ctx.index;
    const rule_r7 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", rule_r7.inputEntries && rule_r7.inputEntries[inputIndex_r6] ? rule_r7.inputEntries[inputIndex_r6].text || rule_r7.inputEntries[inputIndex_r6].value || "-" : "-", " ");
  }
}
function DMNDecisionViewerComponent_div_15_div_5_tr_11_td_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "td", 20);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const outputIndex_r8 = ctx.index;
    const rule_r7 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", rule_r7.outputEntries && rule_r7.outputEntries[outputIndex_r8] ? rule_r7.outputEntries[outputIndex_r8].text || rule_r7.outputEntries[outputIndex_r8].value || "-" : "-", " ");
  }
}
function DMNDecisionViewerComponent_div_15_div_5_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, DMNDecisionViewerComponent_div_15_div_5_tr_11_td_3_Template, 2, 1, "td", 19)(4, DMNDecisionViewerComponent_div_15_div_5_tr_11_td_4_Template, 2, 1, "td", 19);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const rule_r7 = ctx.$implicit;
    const i_r9 = ctx.index;
    const ctx_r0 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(rule_r7.id || "rule_" + i_r9);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getInputs());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getOutputs());
  }
}
function DMNDecisionViewerComponent_div_15_div_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 14)(1, "h5");
    core /* ɵɵtext */.EFF(2, "Rules");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "table", 18)(4, "thead")(5, "tr")(6, "th");
    core /* ɵɵtext */.EFF(7, "Rule ID");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(8, DMNDecisionViewerComponent_div_15_div_5_th_8_Template, 2, 1, "th", 16)(9, DMNDecisionViewerComponent_div_15_div_5_th_9_Template, 2, 1, "th", 16);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "tbody");
    core /* ɵɵtemplate */.DNE(11, DMNDecisionViewerComponent_div_15_div_5_tr_11_Template, 5, 3, "tr", 16);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(8);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getInputs());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getOutputs());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r0.getRules());
  }
}
function DMNDecisionViewerComponent_div_15_div_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 14)(1, "h5");
    core /* ɵɵtext */.EFF(2, "Guard Condition");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 21)(4, "code");
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.formatGuardCondition(ctx_r0.dmnTable.guardCondition));
  }
}
function DMNDecisionViewerComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 12)(1, "h4");
    core /* ɵɵtext */.EFF(2, "Decision Table");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, DMNDecisionViewerComponent_div_15_div_3_Template, 16, 1, "div", 13)(4, DMNDecisionViewerComponent_div_15_div_4_Template, 14, 1, "div", 13)(5, DMNDecisionViewerComponent_div_15_div_5_Template, 12, 3, "div", 13)(6, DMNDecisionViewerComponent_div_15_div_6_Template, 6, 1, "div", 13);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.getInputs().length > 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.getOutputs().length > 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.getRules().length > 0);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.dmnTable.guardCondition);
  }
}
function DMNDecisionViewerComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 22)(1, "p");
    core /* ɵɵtext */.EFF(2, "No decision table available for this decision.");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function DMNDecisionViewerComponent_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 11);
    core /* ɵɵlistener */.bIt("click", function DMNDecisionViewerComponent_button_18_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.exportToExcel());
    });
    core /* ɵɵelementStart */.j41(1, "mat-icon");
    core /* ɵɵtext */.EFF(2, "download");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(3, " Export to Excel ");
    core /* ɵɵelementEnd */.k0s();
  }
}
let DMNDecisionViewerComponent = /*#__PURE__*/(() => {
  class DMNDecisionViewerComponent {
    constructor(data, dialogRef) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.decision = data.decision;
      this.dmnTable = data.decision.dmnTable;
    }
    ngOnInit() {
      // Component initialization
    }
    close() {
      this.dialogRef.close();
    }
    /**
     * Get inputs from DMN table
     */
    getInputs() {
      return this.dmnTable?.inputs || [];
    }
    /**
     * Get outputs from DMN table
     */
    getOutputs() {
      return this.dmnTable?.outputs || [];
    }
    /**
     * Get rules from DMN table
     * If rules array is empty but guardCondition exists, create a synthetic rule
     */
    getRules() {
      const rules = this.dmnTable?.rules || [];
      // If no rules but guardCondition exists, create a synthetic rule for display
      if (rules.length === 0 && this.dmnTable?.guardCondition) {
        const syntheticRule = {
          id: "rule_0",
          inputEntries: [],
          outputEntries: []
        };
        // Add input entry for "Always"
        this.getInputs().forEach((input, index) => {
          if (input.id === "always" || input.label === "Always") {
            syntheticRule.inputEntries[index] = {
              text: input.inputExpression?.text || "true",
              value: input.inputExpression?.text || "true"
            };
          } else {
            syntheticRule.inputEntries[index] = {
              text: input.inputExpression?.text || "-",
              value: input.inputExpression?.text || "-"
            };
          }
        });
        // Add output entries
        this.getOutputs().forEach((output, index) => {
          if (output.id === "guardCondition" || output.label === "guardCondition") {
            syntheticRule.outputEntries[index] = {
              text: this.formatGuardCondition(this.dmnTable.guardCondition),
              value: this.formatGuardCondition(this.dmnTable.guardCondition)
            };
          } else if (output.id === "enabled" || output.label === "enabled") {
            syntheticRule.outputEntries[index] = {
              text: "true",
              value: "true"
            };
          } else {
            syntheticRule.outputEntries[index] = {
              text: "-",
              value: "-"
            };
          }
        });
        return [syntheticRule];
      }
      return rules;
    }
    /**
     * Format guard condition for display
     */
    formatGuardCondition(guardCondition) {
      if (!guardCondition) {
        return "(none)";
      }
      // Unescape FEEL string literals for display
      return guardCondition.replace(/''/g, "'");
    }
    /**
     * Get input entry for a rule
     */
    getInputEntry(rule, inputId) {
      if (!rule.inputEntries || !Array.isArray(rule.inputEntries)) {
        return "-";
      }
      const entry = rule.inputEntries.find(e => e.inputId === inputId);
      if (entry) {
        return entry.text || entry.value || "-";
      } else {
        return "-";
      }
    }
    /**
     * Get output entry for a rule
     */
    getOutputEntry(rule, outputId) {
      if (!rule.outputEntries || !Array.isArray(rule.outputEntries)) {
        // Check for direct output properties
        if (rule[outputId] !== undefined) {
          return rule[outputId].toString();
        }
        return "-";
      }
      const entry = rule.outputEntries.find(e => e.outputId === outputId);
      if (entry) {
        return entry.text || entry.value || "-";
      } else {
        return "-";
      }
    }
    /**
     * Export DMN decision table to Excel
     */
    exportToExcel() {
      try {
        const workbook = utils.book_new();
        // Sheet 1: Decision Information
        const infoData = [["Decision Name", this.decision.name || ""], ["Source Task", this.decision.sourceTaskName || ""], ["Sentry ID", this.decision.sourceSentryRef || ""], ["OPM Process ID", this.decision.sourceProcessId || ""]];
        const infoSheet = utils.aoa_to_sheet(infoData);
        utils.book_append_sheet(workbook, infoSheet, "Decision Info");
        // Sheet 2: Inputs
        if (this.dmnTable && this.getInputs().length > 0) {
          const inputsData = [["ID", "Label", "Type", "Expression"]];
          this.getInputs().forEach(input => {
            inputsData.push([input.id || "", input.label || "", input.inputExpression?.typeRef || "", input.inputExpression?.text || ""]);
          });
          const inputsSheet = utils.aoa_to_sheet(inputsData);
          inputsSheet["!cols"] = [{
            wch: 20
          }, {
            wch: 20
          }, {
            wch: 15
          }, {
            wch: 50
          }];
          utils.book_append_sheet(workbook, inputsSheet, "Inputs");
        }
        // Sheet 3: Outputs
        if (this.dmnTable && this.getOutputs().length > 0) {
          const outputsData = [["ID", "Label", "Type"]];
          this.getOutputs().forEach(output => {
            outputsData.push([output.id || "", output.label || "", output.typeRef || ""]);
          });
          const outputsSheet = utils.aoa_to_sheet(outputsData);
          outputsSheet["!cols"] = [{
            wch: 20
          }, {
            wch: 20
          }, {
            wch: 15
          }];
          utils.book_append_sheet(workbook, outputsSheet, "Outputs");
        }
        // Sheet 4: Decision Table (Rules)
        if (this.dmnTable) {
          const tableData = [];
          // Headers: Input columns + Output columns
          const headers = ["Rule ID"];
          this.getInputs().forEach(input => {
            headers.push(input.label || input.id);
          });
          this.getOutputs().forEach(output => {
            headers.push(output.label || output.id);
          });
          tableData.push(headers);
          // Rules - if rules array is empty, create a synthetic rule from guardCondition
          const rules = this.getRules();
          if (rules.length === 0 && this.dmnTable.guardCondition) {
            // Create a synthetic rule from guardCondition
            const row = ["rule_0"];
            // Input entries - "Always" input should be "true"
            this.getInputs().forEach(input => {
              if (input.id === "always" || input.label === "Always") {
                row.push("true");
              } else {
                row.push(input.inputExpression?.text || "-");
              }
            });
            // Output entries - guardCondition and enabled
            this.getOutputs().forEach(output => {
              if (output.id === "guardCondition" || output.label === "guardCondition") {
                // Use the guardCondition from dmnTable
                row.push(this.formatGuardCondition(this.dmnTable.guardCondition));
              } else if (output.id === "enabled" || output.label === "enabled") {
                row.push("true");
              } else {
                row.push("-");
              }
            });
            tableData.push(row);
          } else {
            // Use actual rules from the array
            rules.forEach((rule, index) => {
              const row = [rule.id || `rule_${index}`];
              // Input entries
              this.getInputs().forEach((input, inputIndex) => {
                let entry = "-";
                if (rule.inputEntries && rule.inputEntries[inputIndex]) {
                  entry = rule.inputEntries[inputIndex].text || rule.inputEntries[inputIndex].value || "-";
                } else if (input.id === "always" || input.label === "Always") {
                  // Default value for "Always" input
                  entry = input.inputExpression?.text || "true";
                }
                row.push(entry);
              });
              // Output entries
              this.getOutputs().forEach((output, outputIndex) => {
                let entry = "-";
                if (rule.outputEntries && rule.outputEntries[outputIndex]) {
                  entry = rule.outputEntries[outputIndex].text || rule.outputEntries[outputIndex].value || "-";
                } else if (output.id === "guardCondition" && this.dmnTable.guardCondition) {
                  // Use guardCondition if available
                  entry = this.formatGuardCondition(this.dmnTable.guardCondition);
                } else if (output.id === "enabled" || output.label === "enabled") {
                  // Default enabled to true
                  entry = "true";
                }
                row.push(entry);
              });
              tableData.push(row);
            });
          }
          const tableSheet = utils.aoa_to_sheet(tableData);
          // Set column widths
          const colWidths = headers.map((_, index) => {
            let maxWidth = headers[index].length;
            tableData.forEach(row => {
              if (row[index]) {
                maxWidth = Math.max(maxWidth, String(row[index]).length);
              }
            });
            return {
              wch: Math.min(maxWidth + 2, 50)
            };
          });
          tableSheet["!cols"] = colWidths;
          utils.book_append_sheet(workbook, tableSheet, "Decision Table");
        }
        // Guard Condition sheet (if available)
        if (this.dmnTable?.guardCondition) {
          const guardData = [["Guard Condition"], [this.formatGuardCondition(this.dmnTable.guardCondition)]];
          const guardSheet = utils.aoa_to_sheet(guardData);
          guardSheet["!cols"] = [{
            wch: 80
          }];
          utils.book_append_sheet(workbook, guardSheet, "Guard Condition");
        }
        // Generate Excel file
        const excelBuffer = writeSync(workbook, {
          bookType: "xlsx",
          type: "array"
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const fileName = `DMN_Decision_${(this.decision.name || "decision").replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.xlsx`;
        FileSaver_min.saveAs(blob, fileName);
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Failed to export DMN decision table to Excel");
      }
    }
    static #_ = (() => this.ɵfac = function DMNDecisionViewerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DMNDecisionViewerComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: DMNDecisionViewerComponent,
      selectors: [["opcloud-dmn-decision-viewer"]],
      decls: 21,
      vars: 5,
      consts: [[1, "dmn-viewer-container"], [1, "dmn-viewer-header"], ["mat-icon-button", "", 1, "close-button", 3, "click"], [1, "dmn-viewer-content"], [1, "decision-info"], [1, "info-row"], ["class", "info-row", 4, "ngIf"], ["class", "decision-table-container", 4, "ngIf"], ["class", "no-table-message", 4, "ngIf"], [1, "dmn-viewer-footer"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click"], [1, "decision-table-container"], ["class", "table-section", 4, "ngIf"], [1, "table-section"], [1, "dmn-table"], [4, "ngFor", "ngForOf"], [1, "expression-cell"], [1, "dmn-table", "rules-table"], ["class", "rule-entry", 4, "ngFor", "ngForOf"], [1, "rule-entry"], [1, "guard-condition"], [1, "no-table-message"]],
      template: function DMNDecisionViewerComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h3");
          core /* ɵɵtext */.EFF(3, "DMN Decision Table");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "button", 2);
          core /* ɵɵlistener */.bIt("click", function DMNDecisionViewerComponent_Template_button_click_4_listener() {
            return ctx.close();
          });
          core /* ɵɵelementStart */.j41(5, "mat-icon");
          core /* ɵɵtext */.EFF(6, "close");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(7, "div", 3)(8, "div", 4)(9, "div", 5)(10, "strong");
          core /* ɵɵtext */.EFF(11, "Decision Name:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "span");
          core /* ɵɵtext */.EFF(13);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(14, DMNDecisionViewerComponent_div_14_Template, 5, 1, "div", 6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(15, DMNDecisionViewerComponent_div_15_Template, 7, 4, "div", 7)(16, DMNDecisionViewerComponent_div_16_Template, 3, 0, "div", 8);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "div", 9);
          core /* ɵɵtemplate */.DNE(18, DMNDecisionViewerComponent_button_18_Template, 4, 0, "button", 10);
          core /* ɵɵelementStart */.j41(19, "button", 11);
          core /* ɵɵlistener */.bIt("click", function DMNDecisionViewerComponent_Template_button_click_19_listener() {
            return ctx.close();
          });
          core /* ɵɵtext */.EFF(20, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(13);
          core /* ɵɵtextInterpolate */.JRh(ctx.decision.name);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.decision.sourceTaskName);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.dmnTable);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.dmnTable);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.dmnTable);
        }
      },
      dependencies: [NgForOf, NgIf, MatIcon, MatButton, MatIconButton],
      styles: [".dmn-viewer-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;width:100%;background:#fff;font-family:Roboto,Helvetica Neue,sans-serif}.dmn-viewer-header[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;padding:16px 24px;border-bottom:1px solid #e0e0e0;position:relative}.dmn-viewer-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0;font-family:Roboto,Helvetica Neue,sans-serif;font-size:20px;font-weight:500;color:#1a3763;text-align:center}.dmn-viewer-header[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]{position:absolute;right:24px}.dmn-viewer-content[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:24px}.decision-info[_ngcontent-%COMP%]{background:#f5f5f5;border-radius:4px;padding:16px;margin-bottom:24px}.decision-info[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]{display:flex;margin-bottom:8px}.decision-info[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]:last-child{margin-bottom:0}.decision-info[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{min-width:150px;color:#1a3763;font-weight:500}.decision-info[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#333}.decision-table-container[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:0 0 16px;font-size:18px;font-weight:500;color:#1a3763}.decision-table-container[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{margin:24px 0 12px;font-size:16px;font-weight:500;color:#1a3763}.table-section[_ngcontent-%COMP%]{margin-bottom:32px}.dmn-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 1px 3px #0000001a}.dmn-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]{background:#1a3763;color:#fff}.dmn-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{padding:12px;text-align:left;font-weight:500;font-size:14px}.dmn-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]{border-bottom:1px solid #e0e0e0}.dmn-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover{background:#f5f5f5}.dmn-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child{border-bottom:none}.dmn-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:12px;font-size:14px;color:#333}.dmn-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td.expression-cell[_ngcontent-%COMP%]{font-family:Courier New,monospace;font-size:13px;color:#06c}.dmn-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td.rule-entry[_ngcontent-%COMP%]{font-family:Courier New,monospace;font-size:13px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rules-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{text-align:center}.guard-condition[_ngcontent-%COMP%]{background:#f5f5f5;border:1px solid #e0e0e0;border-radius:4px;padding:16px;margin-top:12px}.guard-condition[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{font-family:Courier New,monospace;font-size:14px;color:#06c;white-space:pre-wrap;word-break:break-all}.no-table-message[_ngcontent-%COMP%]{text-align:center;padding:40px;color:#666;font-style:italic}.dmn-viewer-footer[_ngcontent-%COMP%]{padding:16px 24px;border-top:1px solid #e0e0e0;display:flex;justify-content:flex-end;gap:10px}.dmn-viewer-footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-weight:400!important}.dmn-viewer-footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{margin-right:4px;vertical-align:middle}"]
    }))();
  }
  return DMNDecisionViewerComponent;
})();