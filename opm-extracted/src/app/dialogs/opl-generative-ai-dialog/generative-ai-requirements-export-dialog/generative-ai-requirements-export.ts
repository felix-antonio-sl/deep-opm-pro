// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/opl-generative-ai-dialog/generative-ai-requirements-export-dialog/generative-ai-requirements-export.ts
// Extracted by opm-extracted/tools/extract.mjs

  function GenerativeAIRequirementsExportDialogComponent_div_25_Template(rf, ctx) {
    if (rf & 1) {
      core /* ɵɵelementStart */.j41(0, "div", 11);
      core /* ɵɵelement */.nrm(1, "div", 12)(2, "div", 13)(3, "div", 14)(4, "div", 15)(5, "div", 16)(6, "div", 17)(7, "div", 18)(8, "div", 19)(9, "div", 20);
      core /* ɵɵelementEnd */.k0s();
    }
  }
  let GenerativeAIRequirementsExportDialogComponent = /*#__PURE__*/(() => {
    class GenerativeAIRequirementsExportDialogComponent {
      constructor(dialogRef, exportOPLService, userService, initRappidService, serverFlatteningService) {
        this.dialogRef = dialogRef;
        this.exportOPLService = exportOPLService;
        this.userService = userService;
        this.initRappidService = initRappidService;
        this.serverFlatteningService = serverFlatteningService;
        this.responseObj = null;
      }
      ngOnInit() {
        this.waiting = false;
        this.loggedUser = this.userService.user?.userData;
        this.response = "AI Generating Requirements of the model takes time, and for a larger model it can take a few minutes.";
        this.responseText = "AI Generating Requirements text place holder.";
        this.tooltip = "Note: This action may take time and incur computational costs. Ensure your model is finalized before proceeding, as adjustments cannot be made once analysis begins.";
      }
      genAIRequirementsGeneration() {
        var _this = this;
        return (0, default)(function* () {
          _this.waiting = true; // spinner on
          try {
            yield _this.initRappidService.opdHierarchyRef.loadAllSubModels();
            const triplets = yield new ModelAnalysisToolsComponent(_this.initRappidService, _this.serverFlatteningService).createTripletsArray(true);
            const params = [_this.initRappidService.opmModel.name, false, null, false];
            const modelOpl = yield _this.exportOPLService.exportOPL(params);
            // Calling the BE for AI to create the Requirements
            const AIresponse = yield _this.userService.getGenAIRequirementsGeneration(_this.loggedUser.uid, modelOpl, triplets);
            // Store both text for the textarea, and structured object for exports
            _this.responseObj = AIresponse; // expect { refined: [...] } from BE
            // Render in readable format
            const refined = AIresponse?.refined ?? [];
            _this.response = _this.formatRequirementsHtml(refined);
            _this.responseText = _this.formatRequirementsText(refined); // for copy/export
          } catch (err) {
            console.error("Requirements generation failed:", err);
            _this.response = "Error: " + (0, httpErrorToMessage)(err);
            _this.responseObj = null;
          } finally {
            _this.waiting = false; // spinner off
          }
        })();
      }
      /** HTML renderer (what you see in the pane) */
      formatRequirementsHtml(refined) {
        if (!Array.isArray(refined)) {
          return "<p>No requirements found.</p>";
        }
        return refined.map(r => `
  <div class="req-card">
    <div class="req-id">${r.id || "REQ-???"} <span class="req-cat">${r.category || ""}</span></div>
    <div class="req-statement">${r.statement || ""}</div>
    <div class="req-meta">
      <strong>Verification:</strong> ${r.verificationMethod || "—"} |
      <strong>Status:</strong> ${r.status || "—"}
    </div>
    ${r.acceptanceCriteria ? `<div class="req-ac">✅ <i>${r.acceptanceCriteria}</i></div>` : ""}
    ${r.rationale ? `<div class="req-rationale">💡 ${r.rationale}</div>` : ""}
    ${r.sourceRef ? `<div class="req-source"><strong>Source:</strong> ${r.sourceRef}</div>` : ""}
  </div>
`).join("\n");
      }
      /** Plain-text renderer (what we put on clipboard) */
      formatRequirementsText(refined) {
        if (!Array.isArray(refined)) {
          return "No requirements found.";
        }
        return refined.map(r => {
          const lines = [];
          lines.push(`${r.id || "REQ-???"} ${r.category || ""}`.trim());
          lines.push(`${r.statement || ""}`);
          lines.push(`Verification: ${r.verificationMethod || "—"} | Status: ${r.status || "—"}`);
          if (r.acceptanceCriteria) {
            lines.push(`AC: ${r.acceptanceCriteria}`);
          }
          if (r.rationale) {
            lines.push(`Note: ${r.rationale}`);
          }
          if (r.sourceRef) {
            lines.push(`Source: ${r.sourceRef}`);
          }
          return lines.join("\n");
        }).join("\n\n");
      }
      downloadReqsExcel() {
        try {
          // 1) Guard – need data first
          if (!this.responseObj) {
            (0, validationAlert)("No generated requirements to export yet.", 2500, "warning");
            return;
          }
          // 2) Normalize refined array
          const refined = Array.isArray(this.responseObj) ? this.responseObj : this.responseObj.refined ?? [];
          if (!Array.isArray(refined) || refined.length === 0) {
            (0, validationAlert)("No generated requirements to export.", 2500, "warning");
            return;
          }
          // 3) Shape rows for Excel
          const headers = ["ID", "ParentID", "Category", "Priority", "Risk", "Status", "Statement", "Rationale", "VerificationMethod", "AcceptanceCriteria", "SourceRef", "TraceTo"];
          const rows = refined.map(r => ({
            ID: r?.id ?? "",
            ParentID: r?.parentId ?? "",
            Category: r?.category ?? "",
            Priority: r?.priority ?? "",
            Risk: r?.risk ?? "",
            Status: r?.status ?? "",
            Statement: r?.statement ?? "",
            Rationale: r?.rationale ?? "",
            VerificationMethod: r?.verificationMethod ?? "",
            AcceptanceCriteria: r?.acceptanceCriteria ?? "",
            SourceRef: r?.sourceRef ?? "",
            TraceTo: Array.isArray(r?.traceTo) ? r.traceTo.join(" | ") : r?.traceTo ?? ""
          }));
          // 4) Build workbook
          const wb = utils.book_new();
          // Requirements sheet
          const reqWs = utils.json_to_sheet(rows, {
            header: headers
          });
          // Auto-fit columns (cap width to avoid crazy wide cells)
          const colWidths = headers.map(h => {
            const max = Math.max(h.length, ...rows.map(r => String(r[h] ?? "").length));
            // add padding; clamp to 80 chars
            return {
              wch: Math.min(max + 2, 80)
            };
          });
          reqWs["!cols"] = colWidths;
          utils.book_append_sheet(wb, reqWs, "Requirements");
          // Stats sheet (optional but useful)
          const stats = this.responseObj?.stats ?? {};
          const catEntries = Object.entries(stats?.categories ?? {});
          const statsRows = [{
            Key: "OPL Lines",
            Value: stats?.numOplLines ?? ""
          }, {
            Key: "Triples",
            Value: stats?.numTriples ?? ""
          }, {
            Key: "Refined Count",
            Value: stats?.refinedCount ?? (Array.isArray(refined) ? refined.length : "")
          }];
          // blank row
          statsRows.push({
            Key: "",
            Value: ""
          });
          // category breakdown
          if (catEntries.length) {
            statsRows.push({
              Key: "Category",
              Value: "Count"
            });
            for (const [k, v] of catEntries) {
              statsRows.push({
                Key: k,
                Value: v
              });
            }
          }
          const statsWs = utils.json_to_sheet(statsRows, {
            header: ["Key", "Value"]
          });
          statsWs["!cols"] = [{
            wch: 24
          }, {
            wch: 16
          }];
          utils.book_append_sheet(wb, statsWs, "Stats");
          // 5) Filename (use model name if available)
          const modelName = this.initRappidService?.opmModel?.name?.trim();
          const fname = (modelName ? `${modelName}_requirements.xlsx` : "requirements.xlsx").replace(/[\\/:*?"<>|]+/g, "_"); // sanitize
          // 6) Save
          writeFileSync(wb, fname);
        } catch (err) {
          console.error("Excel export failed:", err);
          (0, validationAlert)("Excel export failed. See console for details.", 2500, "warning");
        }
      }
      copyGenAIText() {
        const text = this.responseText || (this.responseObj ? this.formatRequirementsText(this.responseObj.refined ?? []) : "");
        navigator.clipboard.writeText(text).then(() => (0, validationAlert)("Requirements copied to clipboard", 2000, "warning")).catch(e => console.error(e));
      }
      static #_ = (() => this.ɵfac = function GenerativeAIRequirementsExportDialogComponent_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || GenerativeAIRequirementsExportDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(ExportOPLAPIService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ServerFlatteningService));
      })();
      static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
        type: GenerativeAIRequirementsExportDialogComponent,
        selectors: [["generative-ai-requirements-export-dialog"]],
        decls: 26,
        vars: 4,
        consts: [["mat-raised-button", "", "color", "primary", 2, "width", "50px", 3, "click", "matTooltip"], ["mat-raised-button", "", 2, "width", "50px", "margin-left", "25px", 3, "click"], ["mat-raised-button", "", "color", "primary", 2, "margin-left", "15px", 3, "click", "disabled"], [1, "GenAITextContainer", 3, "innerHTML"], ["matTooltip", "Copy Gen AI Text To Clipboard", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 36 35", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "20", "height", "20", "rx", "4", "transform", "matrix(-1 0 0 1 36 0)", "fill", "#497284", "fill-opacity", "0.09", 1, "rectGPath"], ["opacity", "0.7"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M7 9.22222C7 7.99492 7.98969 7 9.21053 7H19.856C21.0768 7 22.0665 7.99492 22.0665 9.22222V18.5033C22.0665 19.7306 21.0768 20.7255 19.856 20.7255H9.21053C7.98969 20.7255 7 19.7306 7 18.5033V9.22222ZM19.856 9.22222L9.21053 9.22222V18.5033H19.856V9.22222Z", "fill", "#1A3763"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M23.4335 13.2745H25.7895C27.0103 13.2745 28 14.2694 28 15.4967V24.7778C28 26.0051 27.0103 27 25.7895 27H15.144C13.9232 27 12.9335 26.0051 12.9335 24.7778V21.7059H15.144V24.7778H25.7895V15.4967H23.4335V13.2745Z", "fill", "#1A3763"], ["id", "cubesSpinner", "class", "sk-cube-grid", "style", "width: 100px; position: fixed; top: calc(50% - 200px); height: 100px; left: calc(50%); pointer-events: none;", 4, "ngIf"], ["id", "cubesSpinner", 1, "sk-cube-grid", 2, "width", "100px", "position", "fixed", "top", "calc(50% - 200px)", "height", "100px", "left", "calc(50%)", "pointer-events", "none"], [1, "sk-cube", "sk-cube1"], [1, "sk-cube", "sk-cube2"], [1, "sk-cube", "sk-cube3"], [1, "sk-cube", "sk-cube4"], [1, "sk-cube", "sk-cube5"], [1, "sk-cube", "sk-cube6"], [1, "sk-cube", "sk-cube7"], [1, "sk-cube", "sk-cube8"], [1, "sk-cube", "sk-cube9"]],
        template: function GenerativeAIRequirementsExportDialogComponent_Template(rf, ctx) {
          if (rf & 1) {
            core /* ɵɵelementStart */.j41(0, "div")(1, "p");
            core /* ɵɵtext */.EFF(2, "GenerativeAI - System Requirements Generation");
            core /* ɵɵelementEnd */.k0s();
            core /* ɵɵelement */.nrm(3, "br");
            core /* ɵɵelementStart */.j41(4, "p");
            core /* ɵɵtext */.EFF(5, " Welcome to the System Requirements Generation. Your system model will be automatically analyzed, providing you with generated Requirements. ");
            core /* ɵɵelementEnd */.k0s();
            core /* ɵɵelement */.nrm(6, "br");
            core /* ɵɵelementStart */.j41(7, "p");
            core /* ɵɵtext */.EFF(8, " by Gemini AI ");
            core /* ɵɵelementEnd */.k0s();
            core /* ɵɵelement */.nrm(9, "br");
            core /* ɵɵelementStart */.j41(10, "p")(11, "button", 0);
            core /* ɵɵlistener */.bIt("click", function GenerativeAIRequirementsExportDialogComponent_Template_button_click_11_listener() {
              return ctx.genAIRequirementsGeneration();
            });
            core /* ɵɵtext */.EFF(12, "GO!");
            core /* ɵɵelementEnd */.k0s();
            core /* ɵɵelementStart */.j41(13, "button", 1);
            core /* ɵɵlistener */.bIt("click", function GenerativeAIRequirementsExportDialogComponent_Template_button_click_13_listener() {
              return ctx.dialogRef.close();
            });
            core /* ɵɵtext */.EFF(14, "Close");
            core /* ɵɵelementEnd */.k0s();
            core /* ɵɵelementStart */.j41(15, "button", 2);
            core /* ɵɵlistener */.bIt("click", function GenerativeAIRequirementsExportDialogComponent_Template_button_click_15_listener() {
              return ctx.downloadReqsExcel();
            });
            core /* ɵɵtext */.EFF(16, " Download Reqs Excel ");
            core /* ɵɵelementEnd */.k0s()();
            core /* ɵɵelement */.nrm(17, "br")(18, "div", 3);
            core /* ɵɵelementStart */.j41(19, "a", 4);
            core /* ɵɵlistener */.bIt("click", function GenerativeAIRequirementsExportDialogComponent_Template_a_click_19_listener() {
              return ctx.copyGenAIText();
            });
            core /* ɵɵnamespaceSVG */.qSk();
            core /* ɵɵelementStart */.j41(20, "svg", 5);
            core /* ɵɵelement */.nrm(21, "rect", 6);
            core /* ɵɵelementStart */.j41(22, "g", 7);
            core /* ɵɵelement */.nrm(23, "path", 8)(24, "path", 9);
            core /* ɵɵelementEnd */.k0s()()();
            core /* ɵɵtemplate */.DNE(25, GenerativeAIRequirementsExportDialogComponent_div_25_Template, 10, 0, "div", 10);
            core /* ɵɵelementEnd */.k0s();
          }
          if (rf & 2) {
            core /* ɵɵadvance */.R7$(11);
            core /* ɵɵproperty */.Y8G("matTooltip", ctx.tooltip);
            core /* ɵɵadvance */.R7$(4);
            core /* ɵɵproperty */.Y8G("disabled", !(ctx.responseObj == null ? null : ctx.responseObj.refined == null ? null : ctx.responseObj.refined.length));
            core /* ɵɵadvance */.R7$(3);
            core /* ɵɵproperty */.Y8G("innerHTML", ctx.response, core /* ɵɵsanitizeHtml */.npT);
            core /* ɵɵadvance */.R7$(7);
            core /* ɵɵproperty */.Y8G("ngIf", ctx.waiting);
          }
        },
        dependencies: [NgIf, MatTooltip, MatButton],
        styles: [".divs[_ngcontent-%COMP%]{position:relative;width:650px;left:50px;top:50px}p[_ngcontent-%COMP%]{max-width:100%;margin:0 auto;text-align:center}.sk-cube-grid[_ngcontent-%COMP%]   .sk-cube[_ngcontent-%COMP%]{background-color:#1a376399}.GenAIText[_ngcontent-%COMP%]{min-width:650px;min-height:250px;color:#1a3661;overflow:auto;font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.GenAITextContainer[_ngcontent-%COMP%]{width:100%;max-width:100%;box-sizing:border-box;height:400px;max-height:400px;overflow-y:auto;overflow-x:auto;white-space:normal;overflow-wrap:anywhere;word-break:break-word;border:1px solid #ccc;border-radius:6px;padding:12px;background:#fdfdfd;font-family:Segoe UI,sans-serif;line-height:1.4}.req-card[_ngcontent-%COMP%]{border-bottom:1px solid #e0e0e0;padding:8px 0}.req-card[_ngcontent-%COMP%]:last-child{border-bottom:none}.req-id[_ngcontent-%COMP%]{font-weight:700;color:#0078d7}.req-cat[_ngcontent-%COMP%]{background:#e8f0ff;color:#004aad;padding:2px 6px;border-radius:4px;margin-left:6px;font-size:.85em}.req-statement[_ngcontent-%COMP%]{margin:4px 0}.req-meta[_ngcontent-%COMP%], .req-ac[_ngcontent-%COMP%], .req-rationale[_ngcontent-%COMP%], .req-source[_ngcontent-%COMP%]{font-size:.9em;color:#333}.req-ac[_ngcontent-%COMP%]{margin-left:10px;color:#006400}.req-rationale[_ngcontent-%COMP%]{margin-left:10px;color:#444;font-style:italic}[_nghost-%COMP%]{display:block;min-width:0}[_nghost-%COMP%]     .mat-mdc-dialog-surface{width:650px!important;max-width:650px!important}[_nghost-%COMP%]     .mat-mdc-dialog-content{min-width:0}"]
      }))();
    }
    return GenerativeAIRequirementsExportDialogComponent;
  })();