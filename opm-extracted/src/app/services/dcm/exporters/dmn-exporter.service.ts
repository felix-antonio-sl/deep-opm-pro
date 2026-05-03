// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/exporters/dmn-exporter.service.ts
// Extracted by opm-extracted/tools/extract.mjs

    let DMNExporterService = /*#__PURE__*/(() => {
      class DMNExporterService {
        /**
         * Export decisions to DMN 1.4 XML
         */
        exportDMN(dcmIR) {
          const dmnFiles = [];
          dcmIR.decisions.forEach(decision => {
            const dmnXml = this.buildDMNDocument(decision, dcmIR);
            dmnFiles.push(dmnXml);
          });
          return dmnFiles;
        }
        /**
         * Build DMN document for a decision
         */
        buildDMNDocument(decision, dcmIR) {
          const decisionTable = decision.dmnTable ? this.buildDecisionTable(decision.dmnTable) : "";
          // Find the sentry and task that this decision is linked to
          let documentation = "";
          if (dcmIR) {
            const linkedSentry = dcmIR.plan.sentries.find(s => s.dmnDecisionRef === decision.id);
            if (linkedSentry) {
              const linkedTask = dcmIR.plan.tasks.find(t => t.entryCriteria.includes(linkedSentry.id));
              const sentryId = linkedSentry.id;
              const taskName = linkedTask ? linkedTask.name : "Unknown";
              const processId = decision.sourceProcessId || "Unknown";
              documentation = `    <dc:documentation>
      Sentry ID: ${this.escapeXml(sentryId)}
      Task Name: ${this.escapeXml(taskName)}
      OPM Process ID: ${this.escapeXml(processId)}
    </dc:documentation>`;
            }
          }
          return `<?xml version="1.0" encoding="UTF-8"?>
<dmn:definitions xmlns:dmn="http://www.omg.org/spec/DMN/20151101/dmn.xsd"
                 xmlns:dc="http://www.omg.org/spec/DMN/20151101/DC"
                 xmlns:di="http://www.omg.org/spec/DMN/20151101/DI"
                 id="definitions_${this.sanitizeId(decision.id)}"
                 name="${this.escapeXml(decision.name)}"
                 namespace="http://opcloud.tech/dmn/${this.sanitizeId(decision.id)}">
  <dmn:decision id="${this.sanitizeId(decision.id)}" name="${this.escapeXml(decision.name)}">
${documentation}
${decisionTable}
  </dmn:decision>
</dmn:definitions>`;
        }
        /**
         * Build decision table (Flowable-stable format)
         *
         * Flowable-compatible format:
         * - ONE dummy input: "Always" (boolean, expression "true") to prevent "New Input" prompt
         * - TWO outputs: guardCondition (string), enabled (boolean)
         * - ONE rule with guardCondition as FEEL string literal and enabled=true
         * - Use double quotes for FEEL string delimiter, single quotes inside for task names
         */
        buildDecisionTable(dmnTable) {
          if (!dmnTable) {
            return "";
          }
          // ONE dummy input to prevent Flowable "New Input" prompt
          const inputs = `      <dmn:input id="input_always" label="Always">
        <dmn:inputExpression typeRef="boolean" id="input_always_expr">
          <dmn:text>true</dmn:text>
        </dmn:inputExpression>
      </dmn:input>`;
          // TWO outputs: guardCondition (string) and enabled (boolean)
          const outputs = [`      <dmn:output id="output_guardCondition" label="guardCondition" typeRef="string" />`, `      <dmn:output id="output_enabled" label="enabled" typeRef="boolean" />`].join("\n");
          // ONE rule with guardCondition as FEEL string literal
          const guardCondition = dmnTable.guardCondition || "(missing)";
          // MANDATORY: guardCondition is an OUTPUT of typeRef="string"
          // Rule output entry text must be a single-layer FEEL string literal
          // Example: "completed('Compliance Checking')"
          // NOT "\"completed('Compliance Checking')\"" (no double-escaping)
          // NOT with embedded extra escaping
          // MANDATORY: guardCondition must be a clean FEEL string literal
          // Format: "completed('Task Name')" - double quotes around the entire predicate
          // NO backslash escaping inside the literal
          // The predicate from sentry synthesis is already in format: completed('Task Name')
          // Task names are already escaped if they contain single quotes: completed('O''Reilly')
          // We just wrap the entire predicate in double quotes - CDATA handles XML escaping
          let feelStringLiteral;
          if (guardCondition === "true" || guardCondition === "(missing)") {
            // Simple case: just wrap as-is
            feelStringLiteral = `"${guardCondition}"`;
          } else {
            // Predicate is already in correct format: completed('Task Name')
            // Task name is already escaped if needed: completed('O''Reilly')
            // Just wrap entire predicate in double quotes (clean, no backslash escaping)
            // Example: "completed('Compliance Checking')"
            feelStringLiteral = `"${guardCondition}"`;
          }
          // MANDATORY: Output as clean FEEL string literal in CDATA
          // CDATA prevents XML escaping, so we write the literal exactly as: "completed('X')"
          // No backslashes, no double-escaping
          const rules = `      <dmn:rule id="rule_0">
        <dmn:inputEntry id="inputEntry_0">
          <dmn:text>true</dmn:text>
        </dmn:inputEntry>
        <dmn:outputEntry id="outputEntry_guardCondition">
          <dmn:text><![CDATA[${feelStringLiteral}]]></dmn:text>
        </dmn:outputEntry>
        <dmn:outputEntry id="outputEntry_enabled">
          <dmn:text>true</dmn:text>
        </dmn:outputEntry>
      </dmn:rule>`;
          return `    <dmn:decisionTable id="decisionTable_${this.sanitizeId(dmnTable.id || "table")}">
${inputs}
${outputs}
${rules}
    </dmn:decisionTable>`;
        }
        /**
         * Sanitize ID for XML
         */
        sanitizeId(id) {
          return id.replace(/[^a-zA-Z0-9_-]/g, "_");
        }
        /**
         * Escape XML special characters
         */
        escapeXml(text) {
          return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        }
        /**
         * Escape single quotes for FEEL string literals
         * ' -> '' (double single quote)
         */
        escapeSingleQuotes(s) {
          return s.replace(/'/g, "''");
        }
        static #_ = (() => this.ɵfac = function DMNExporterService_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || DMNExporterService)();
        })();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: DMNExporterService,
          factory: DMNExporterService.ɵfac,
          providedIn: "root"
        }))();
      }
      return DMNExporterService;
    })();