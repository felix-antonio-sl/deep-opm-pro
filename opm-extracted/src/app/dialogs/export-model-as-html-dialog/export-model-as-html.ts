// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/export-model-as-html-dialog/export-model-as-html.ts
// Extracted by opm-extracted/tools/extract.mjs

    /*
    * This Component enables to export the entire model as an HTML file.
    * inputs: open OPM model in the web
    * output: single HTML file
    */
    let ExportModelAsHtmlComponent = /*#__PURE__*/(() => {
      class ExportModelAsHtmlComponent {
        constructor(data,
        // to get the model name (if saved)
        dialogRef, graphService, initRappidService, contextService, storageService, oplService,
        // Do not delete, it is used in the component! "this" is passed as a parameter to some functions
        groupsService // Do not delete, it is used in the component!
        ) {
          this.data = data;
          this.dialogRef = dialogRef;
          this.graphService = graphService;
          this.initRappidService = initRappidService;
          this.contextService = contextService;
          this.storageService = storageService;
          this.oplService = oplService;
          this.groupsService = groupsService;
          this.spinnerFlag = false; // flag to show a spinner while downloading
          this.showTooltips = false;
          if (data.modelName) {
            // get the model name to set as a default value to the HTML file name
            this.modelName = data.modelName;
          } else {
            // if the model is not saved, and thus we have no model name, set 'Unsaved Model' as the default file name
            this.modelName = "Unsaved Model";
          }
          this.originalOpd = this.initRappidService.opmModel.currentOpd; // save current open OPD to render after the process has finished
        }
        openOpdsSelectionDialog(includeUnloadedSubModels) {
          var _this = this;
          return (0, default)(function* () {
            if (includeUnloadedSubModels) {
              if (_this.initRappidService.opmModel.opds.some(opd => opd.sharedOpdWithSubModelId && opd.visualElements.length === 0)) {
                (0, validationAlert)("Loading all sub models");
                yield OPCloudUtils.waitXms(100);
              }
              yield _this.initRappidService.opdHierarchyRef.loadAllSubModels();
            }
            _this.initRappidService.dialogService.openDialog(SelectOpdsTreeDialog, 700, 900, {
              allowMultipleDialogs: true,
              title: "Select OPDs to Export:",
              mode: "export"
            }).afterClosed().toPromise().then(res => {
              _this.selectedOpds = res;
            });
          })();
        }
        saveHtmlMain(fileName, includeURL, includeTooltips, numberedOPL, includeDescription, includeComputational, resolutionCheck, resolutionOPDs, confidentialWatermark, includeElementsDictionary, includeRequirementViews, includeUnloadedSubModels) {
          var _this2 = this;
          return (0, default)(function* () {
            if ($(".mat-mdc-dialog-container")[0]) {
              $(".mat-mdc-dialog-container")[0].style.overflow = "hidden";
            }
            if (includeUnloadedSubModels) {
              yield _this2.initRappidService.opdHierarchyRef.loadAllSubModels();
            }
            _this2.initRappidService.currentlyExportingPdf = true; // Starting export, using PDF hook
            const title = fileName;
            _this2.includeRequirementViews = includeRequirementViews;
            _this2.includeEntitiesDescription = includeDescription;
            _this2.includeProcessComputational = includeComputational;
            // Set OPD order and collect selected OPDs
            _this2.setOpdsOrder();
            _this2.spinnerFlag = true; // from here on the spinner will be shown until the downloading ends.
            if ($(".mat-mdc-dialog-container").length > 0) {
              $(".mat-mdc-dialog-container")[0].style.background = "transparent";
              $(".mat-mdc-dialog-surface")[0].style.setProperty("background", "transparent", "important");
              $(".mat-mdc-dialog-inner-container")[0].style.background = "transparent";
              $(".mat-mdc-dialog-container")[0].style.boxShadow = "none";
              // Remove box shadow from mat-mdc-dialog-surface
              $(".mat-mdc-dialog-surface")[0].style.setProperty("box-shadow", "none", "important");
              // Remove box shadow from mat-mdc-dialog-container (parent container)
              $(".mat-mdc-dialog-container")[0].style.setProperty("box-shadow", "none", "important");
              // Remove box shadow from mdc-dialog__surface (MD component)
              $(".mdc-dialog__surface")[0].style.setProperty("box-shadow", "none", "important");
              $(".mat-mdc-dialog-inner-container")[0].style.boxShadow = "none";
            }
            _this2.dialogRef.disableClose = true;
            const selectedOpds = _this2.opdsOrder;
            // Initialize model metadata
            let creationDate = "Unknown";
            let userName = "Unknown";
            let description = "No description available";
            const model = _this2.initRappidService.opmModel;
            // Check for model metadata and fill in the fields if available
            if (_this2.graphService.modelObject.modelData) {
              const modelData = _this2.graphService.modelObject.modelData;
              if (modelData?.editBy && modelData.editBy.date && modelData.editBy.date !== "") {
                creationDate = typeof modelData.editBy.date === "number" ? formatDate(new Date(modelData.editBy.date)) : modelData.editBy.date;
              } else {
                const today = new Date();
                creationDate = formatDate(today);
              }
              const permissions = (yield _this2.storageService.getPermissions(_this2.graphService.modelObject.id)) || {};
              userName = _this2.groupsService.getUserById(permissions.ownerID)?.Name || "";
              // If username is empty or in Hebrew, use email instead
              if (permissions.ownerID && (userName.search(/[\u0590-\u05FF]/) >= 0 || userName === "")) {
                userName = _this2.groupsService.getUserById(permissions.ownerID)?.Email || "";
              }
              description = modelData.description || description;
            }
            // Helper function to format dates and times with seconds according to the user's locale
            function formatDate(date) {
              // Use Intl.DateTimeFormat with the user's locale and include seconds
              return new Intl.DateTimeFormat(navigator.language, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              }).format(date);
            }
            // Begin HTML content
            let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; }
        .sidebar { width: 20%; height: 100vh; padding: 10px; position: fixed; overflow-y: auto; border-right: 1px solid #ddd; }
        .content { width: 80%; margin-left: 22%; padding: 10px; }
        .section { margin: 20px 0; }
        .section h2 { color: #4CAF50; }
        ul { list-style-type: none; padding: 0; }
        .image { text-align: center; margin: 20px 0; }
        img { max-width: 100%; height: auto; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .indented { margin-left: 20px; }
        ${confidentialWatermark ? "body::after { content: \"Confidential\"; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5em; color: rgba(200, 200, 200, 0.3); }" : ""}
    </style>
</head>
<body>
    <div class="sidebar" id="sidebar">
        <h2>Navigation</h2>
        <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#opd-tree">OPD Tree</a></li>
            <li><a href="#diagrams-opl">Diagrams & OPL</a></li>`;
            // Add OPD links dynamically with hierarchy
            htmlContent += `<ul>`;
            _this2.opdsOrder.forEach(opd => {
              const opdName = _this2.getFormattedOpdName(opd, _this2);
              htmlContent += `<li><a href="#${opdName.replace(/\s+/g, "_")}">${opdName}</a></li>`;
            });
            htmlContent += `</ul>`;
            // Conditionally add the Elements Dictionary link at the end if selected
            if (includeElementsDictionary) {
              htmlContent += `<li><a href="#elements-dictionary">Elements Dictionary</a></li>`;
            }
            htmlContent += `</ul></div><div class="content" id="content">`;
            // Overview Section
            htmlContent += `<div id="overview"><h1>${title}</h1>`;
            htmlContent += `<p>Last Edited: ${creationDate}</p>`;
            htmlContent += `<p>Created by: ${userName}</p>`;
            htmlContent += `<p>Model Description: ${description}</p>`;
            if (includeURL) {
              const urldata = _this2.contextService.makeUrl();
              let url = "URL not defined for unsaved model";
              if (urldata.allowed) {
                url = urldata.url.split("|||")[0];
              }
              htmlContent += `<p>Model URL: <a href="${url}">${title}</a></p>`;
            }
            htmlContent += `</div>`;
            htmlContent += `<div class="section" id="opd-tree"><h2>OPD Tree</h2><ul>`;
            _this2.opdsOrder.forEach(opd => {
              const opdName = _this2.getFormattedOpdName(opd, _this2);
              const numberedName = opd.getNumberedName();
              // Set hierarchy level: `SD` is top level, `SD1`, `SD2`, etc., are at the next level,
              // and deeper levels like `SD1.1`, `SD1.1.1` follow accordingly.
              let hierarchyLevel;
              if (numberedName === "SD") {
                hierarchyLevel = 1; // SD is the top level
              } else if (/^SD\d+$/.test(numberedName)) {
                hierarchyLevel = 2; // SD1, SD2, etc., are one level below SD
              } else {
                hierarchyLevel = numberedName.split(".").length + 1; // further levels increase accordingly
              }
              htmlContent += `<li class="indented" style="margin-left: ${(hierarchyLevel - 1) * 20}px;">${opdName}</li>`;
            });
            htmlContent += `</ul></div>`;
            // Diagrams & OPL Section
            htmlContent += `<div class="section" id="diagrams-opl"><h2>Diagrams & OPL</h2>`;
            const diagrams = yield _this2.captureSelectedOPDsAsImages(selectedOpds, resolutionCheck, Number(resolutionOPDs), includeTooltips, includeUnloadedSubModels, includeComputational, numberedOPL);
            for (const diagram of diagrams) {
              htmlContent += _this2.insertImageAndNameHtml(diagram.imageData, diagram.name, diagram.oplHtml);
              htmlContent += `<p><a href="#overview">Back to Top</a></p>`;
            }
            htmlContent += `</div>`;
            // Elements Dictionary Section - if applicable
            if (includeElementsDictionary) {
              htmlContent += _this2.insertElementsDictionary();
            }
            // Close content and body
            htmlContent += `
    </div>
    <script>
        let sidebarZoom = 1;
        let contentZoom = 1;
        const zoomFactor = 1.05; // Zoom factor for smoother transitions
        const minZoom = 0.5;    // Minimum zoom level
        const maxZoom = 2;      // Maximum zoom level

        function applyZoom(element, zoomLevel) {
            element.style.transform = \`scale(\${zoomLevel})\`;
            element.style.transformOrigin = "top left";
        }

        function resetZoom() {
            sidebarZoom = 1;
            contentZoom = 1;
            applyZoom(document.getElementById('sidebar'), sidebarZoom);
            applyZoom(document.getElementById('content'), contentZoom);
        }

        document.getElementById('sidebar').addEventListener('wheel', (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                if (event.deltaY < 0) {
                    sidebarZoom = Math.min(maxZoom, sidebarZoom * zoomFactor); // Zoom in
                } else {
                    sidebarZoom = Math.max(minZoom, sidebarZoom / zoomFactor); // Zoom out
                }
                applyZoom(event.currentTarget, sidebarZoom);
            }
        });

        document.getElementById('content').addEventListener('wheel', (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                if (event.deltaY < 0) {
                    contentZoom = Math.min(maxZoom, contentZoom * zoomFactor); // Zoom in
                } else {
                    contentZoom = Math.max(minZoom, contentZoom / zoomFactor); // Zoom out
                }
                applyZoom(event.currentTarget, contentZoom);
            }
        });

        // Reset Button with Material Design Style
        document.body.insertAdjacentHTML('beforeend', \`
            <button id="resetZoom"
                    style="position: fixed; bottom: 10px; right: 10px; padding: 8px 16px; font-size: 14px; background-color: #3f51b5; color: #fff; border: none; border-radius: 4px; box-shadow: 0px 2px 4px rgba(0,0,0,0.2); cursor: pointer;">
                Reset Zoom
            </button>\`);

        document.getElementById('resetZoom').addEventListener('click', resetZoom);

        // Add hover effect for button
        document.getElementById('resetZoom').addEventListener('mouseenter', () => {
            document.getElementById('resetZoom').style.backgroundColor = '#303f9f';
        });
        document.getElementById('resetZoom').addEventListener('mouseleave', () => {
            document.getElementById('resetZoom').style.backgroundColor = '#3f51b5';
        });
    </script>
</body></html>`;
            // Save HTML file
            const blob = new Blob([htmlContent], {
              type: "text/html"
            });
            FileSaver_min.saveAs(blob, `${fileName.replace(/\s+/g, "_")}.html`);
            _this2.initRappidService.currentlyExportingPdf = false; // Ending export, using PDF hook
            _this2.graphService.renderGraph(_this2.originalOpd, _this2.initRappidService); // Goes back to the OPD that the user is editing.
            _this2.dialogRef.close();
          })();
        }
        setOpdsOrder() {
          this.opdsOrder = [];
          let defaultSelection = false;
          if (!this.selectedOpds) {
            this.selectedOpds = this.initRappidService.opmModel.opds;
            defaultSelection = true;
          }
          const regularOpds = this.selectedOpds.filter(o => !o.requirementViewOf && !o.stereotypeOpd).sort((a, b) => {
            if (a.getNumberedName() > b.getNumberedName()) {
              return 1;
            } else {
              return -1;
            }
          });
          const requirementViews = this.includeRequirementViews ? this.selectedOpds.filter(o => o.requirementViewOf) : [];
          let stereotypesOpds;
          if (defaultSelection) {
            stereotypesOpds = this.initRappidService.opmModel.stereotypes.getStereoTypes().map(str => str.opd);
          } else {
            stereotypesOpds = this.selectedOpds.filter(opd => opd.stereotypeOpd);
          }
          this.opdsOrder = [...regularOpds, ...requirementViews, ...stereotypesOpds].filter(opd => !opd.isHidden);
        }
        getFormattedOpdName(opd, self) {
          let opdName = opd.getName ? opd.getName() : opd.name;
          if (opd.isStereotypeOpd && opd.isStereotypeOpd()) {
            const stereotype = self.initRappidService.opmModel.stereotypes.getStereoTypes().find(s => s.opd === opd);
            opdName = "Stereotype: " + (stereotype ? stereotype.getName ? stereotype.getName() : stereotype.name : "Unnamed");
          } else if (opd.requirementViewOf) {
            opdName = opd.name;
          } else {
            const sdNumber = opd.getNumberedName ? opd.getNumberedName() : "SD";
            if (sdNumber !== "SD") {
              opdName = `${sdNumber}: ${opdName}`;
            }
          }
          return opdName;
        }
        captureSelectedOPDsAsImages(selectedOpds, resolutionCheck, resolutionOPDs, includeTooltips, includeUnloadedSubModels, includeComputational, numberedOPL) {
          var _this3 = this;
          return (0, default)(function* () {
            const diagrams = [];
            if (includeUnloadedSubModels) {
              yield _this3.initRappidService.opdHierarchyRef.loadAllSubModels();
            }
            let treeLevel = 0; // this variable is used later to count the levels(opds) of the module tree
            for (const opd of selectedOpds) {
              const precents = String(Math.floor(treeLevel / selectedOpds.length * 100)) + "%";
              if ($("#spinnerValue").length > 0) {
                $("#spinnerValue")[0].textContent = precents;
              }
              treeLevel += 1; // go to the next "level" in the opm-model-tree
              _this3.graphService.renderGraph(opd, _this3.initRappidService);
              if (includeTooltips) {
                for (const proc of _this3.graphService.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnProcess(c))) {
                  proc.showDummyTooltip();
                }
              }
              const imageData = yield _this3.captureImageData(opd, resolutionCheck ? resolutionOPDs : "1");
              const oplHtml = yield _this3.insertOpls(opd, includeComputational, numberedOPL);
              diagrams.push({
                name: _this3.getFormattedOpdName(opd, _this3),
                imageData: imageData,
                oplHtml: oplHtml
              });
              $(".dummyTooltip").remove(); // remove the computational tooltip is present
            }
            return diagrams;
          })();
        }
        captureImageData(opd, resolution) {
          var _this4 = this;
          return (0, default)(function* () {
            return new Promise((resolve, reject) => {
              const paper = _this4.initRappidService.paper;
              paper.toJPEG(imageData => resolve(imageData), {
                padding: 40,
                useComputedStyles: false,
                size: `${resolution}x`,
                quality: 1
              });
            });
          })();
        }
        insertOpls(opd, includeComputational, numberedOPL) {
          var _this5 = this;
          return (0, default)(function* () {
            _this5.graphService.renderGraph(opd, _this5.initRappidService);
            const opls = _this5.initRappidService.oplService.generateOpl();
            let oplHtml = "<ul>";
            for (let i = 0; i < opls.length; i++) {
              let oplSentence = opls[i].opl;
              if (!includeComputational && opls[i].isComputational) {
                continue;
              }
              if (numberedOPL) {
                oplSentence = `${i + 1}. ${oplSentence}`;
              }
              oplHtml += `<li>${oplSentence}</li>`;
            }
            oplHtml += "</ul>";
            return oplHtml;
          })();
        }
        insertElementsDictionary() {
          const logicArray = this.initRappidService.opmModel.logicalElements;
          const objectsArray = [];
          const processesArray = [];
          const proceduralMap = new Map();
          const fundamentalMap = new Map();
          const taggedMap = new Map();
          for (let entry of logicArray) {
            if (entry.name === "OpmLogicalObject") {
              objectsArray.push(this.getThingData(entry, "Object"));
            } else if (entry.name === "OpmLogicalProcess") {
              processesArray.push(this.getThingData(entry, "Process"));
            } else if (entry.name === "OpmProceduralRelation") {
              this.getRelationData(entry, proceduralMap);
            } else if (entry.name === "OpmFundamentalRelation") {
              this.getRelationData(entry, fundamentalMap);
            } else if (entry.name === "OpmTaggedRelation") {
              this.getRelationData(entry, taggedMap);
            }
          }
          let dictionaryHtml = `<div class="section" id="elements-dictionary"><h2>Elements Dictionary</h2>`;
          // Objects Section
          dictionaryHtml += `<h3>Objects:</h3>`;
          objectsArray.forEach(object => {
            dictionaryHtml += `<div class="indented">${object}</div><br>`;
          });
          // Processes Section
          dictionaryHtml += `<h3>Processes:</h3>`;
          processesArray.forEach(process => {
            dictionaryHtml += `<div class="indented">${process}</div><br>`;
          });
          // Relations Sections
          let showExample = true; // Flag to show title only for the first non-empty map
          if (proceduralMap.size > 0) {
            dictionaryHtml += this.generateRelationSection("Procedural Relations", proceduralMap, showExample);
            showExample = false; // Set flag to false after the first non-empty call
          }
          if (fundamentalMap.size > 0) {
            dictionaryHtml += this.generateRelationSection("Fundamental Relations", fundamentalMap, showExample);
            showExample = false; // Set flag to false in case this is the first non-empty map
          }
          if (taggedMap.size > 0) {
            dictionaryHtml += this.generateRelationSection("Tagged Relations", taggedMap, showExample);
          }
          dictionaryHtml += `</div>`;
          return dictionaryHtml;
        }
        escapeHtmlContent(str) {
          if (!str) {
            return str;
          }
          return str.replace(/&/g, "&amp;") // Escape ampersand first to avoid double escaping
          .replace(/</g, "&lt;") // Escape <
          .replace(/>/g, "&gt;"); // Escape >
        }
        // Decode common HTML entities that may already be stored in text,
        // so that we don't double-escape them and show things like &apos; literally.
        decodeHtmlEntities(text) {
          if (!text) {
            return text;
          }
          return text.replace(/&apos;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        }
        getThingData(entry, thingType) {
          const escapedText = this.escapeHtmlContent(this.decodeHtmlEntities(entry.text.replace("\n", " ")));
          let thingHtml = `<strong>${thingType} Name:</strong> <span style="color: ${thingType === "Object" ? "#00B050" : "#0070C0"};">${escapedText}</span>`;
          const imageUrl = entry.getBackgroundImageUrl && entry.getBackgroundImageUrl() !== "" && entry.getBackgroundImageUrl() !== "assets/SVG/redx.png" ? entry.getBackgroundImageUrl() : null;
          if (imageUrl) {
            const escapedImageUrl = this.escapeHtmlContent(imageUrl);
            thingHtml += `<br><strong>Image URL:</strong><div class="indented">${escapedImageUrl}</div>`;
          }
          let skipBR = false; // Skip the <br> as it is not first
          if (entry.URLarray?.length > 0 && entry.URLarray[0].url !== "http://") {
            const escapedUrls = entry.URLarray.map(item => this.escapeHtmlContent(item.url)).join("<br>");
            thingHtml += `${imageUrl ? "" : "<br>"}<strong>Hyperlinks URLs: </strong><div class="indented">${escapedUrls}</div>`;
            skipBR = true;
          }
          if (this.includeProcessComputational && thingType === "Process" && entry.insertedFunction !== "None" && entry.insertedFunction.functionInput) {
            // Currently supports only user defined,AI and python functions
            let func = entry.insertedFunction.functionInput.toString();
            if (entry.insertedFunction.functionInput.code) {
              // If its Python or AI code
              func = entry.insertedFunction.functionInput.code.toString();
            }
            const escapedFunc = this.escapeHtmlContent(func);
            thingHtml += `${imageUrl || skipBR ? "" : "<br>"}<strong>Process Computational Function: </strong><div class="indented">${escapedFunc}</div>`;
            skipBR = true;
          }
          if (this.includeEntitiesDescription && entry.description?.trim() !== "") {
            const escapedDescription = this.escapeHtmlContent(this.decodeHtmlEntities(entry.description));
            thingHtml += `${imageUrl || skipBR ? "" : "<br>"}<strong>Description: </strong><div class="indented">${escapedDescription}</div>`;
            skipBR = true;
          }
          const opds = entry.visualElements.map(visual => {
            const opd = this.initRappidService.opmModel.getOpdByThingId(visual.id);
            if (opd) {
              return opd.getName();
            } else {
              return null;
            }
          }).filter(opdName => opdName !== null);
          thingHtml += `${imageUrl || skipBR ? "" : "<br>"}<strong>${thingType} OPDs:</strong><div class="indented">${opds.length > 0 ? opds.join("<br>") : "N/A"}</div>`;
          if (entry.states && entry.states.length > 0) {
            const states = entry.states.map(state => {
              let stateText = state._text;
              if (state.URLarray?.length > 0 && state.URLarray[0].url !== "http://") {
                stateText += ` (URLs: ${state.URLarray.map(item => item.url).join(", ")})`;
              }
              if (this.includeEntitiesDescription && state.description?.trim()) {
                stateText += ` (Description: ${this.decodeHtmlEntities(state.description)})`;
              }
              return stateText;
            });
            thingHtml += `<strong>${thingType} States:</strong><div class="indented" style="color: #808000;">${states.join("<br>")}</div>`;
          }
          return thingHtml;
        }
        generateRelationSection(title, relationMap, addHeader = false) {
          let relationHtml = `<h3>${title}:</h3><div class="indented">`;
          if (addHeader) {
            relationHtml += `<p><strong>Source Name → Target(s) Name</strong></p>`;
          }
          relationMap.forEach((links, linkName) => {
            relationHtml += `<strong>${linkName}:</strong><ul>`;
            links.forEach(link => {
              relationHtml += `<li>${link[0]} → ${link[1].join(", ")}</li>`;
            });
            relationHtml += `</ul>`;
          });
          relationHtml += `</div>`;
          return relationHtml;
        }
        getRelationData(entry, relationMap) {
          const linkArray = [];
          linkArray.push(entry.sourceLogicalElement.text.replace("\n", " "));
          const targetArray = [];
          for (let target of entry.targetLogicalElements) {
            if (target) {
              targetArray.push(target.text.replace("\n", " "));
            }
          }
          linkArray.push(targetArray);
          const linkName = linkType[entry.linkType];
          if (!relationMap.has(linkName)) {
            relationMap.set(linkName, []);
          }
          relationMap.get(linkName).push(linkArray);
        }
        insertImageAndNameHtml(imageData, opdName, oplHtml) {
          const imgTag = `<img src="${imageData}" alt="${opdName} Diagram">`;
          return `
        <div class="section" id="${opdName.replace(/\s+/g, "_")}">
            <h3>${opdName}</h3>
            <div class="image">${imgTag}</div>
            <h4>OPL</h4>${oplHtml}
        </div>`;
        }
        static #_ = (() => this.ɵfac = function ExportModelAsHtmlComponent_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || ExportModelAsHtmlComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(GroupsService));
        })();
        static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
          type: ExportModelAsHtmlComponent,
          selectors: [["opcloud-export-model-as-html-dialog"]],
          decls: 57,
          vars: 18,
          consts: [["filename", ""], ["includeURL", ""], ["includeTooltips", ""], ["includeElementsDictionary", ""], ["includeDescription", ""], ["includeComputational", ""], ["numberedOPL", ""], ["includeRequirementViews", ""], ["confidentialWatermark", ""], ["includeUnloadedSubModels", ""], ["resolutionCheck", ""], ["resolution", ""], [1, "exportHtmlDiv", 3, "hidden"], [1, "exportHtmlTitle"], [2, "font-size", "13px", "text-align", "center"], [1, "htmlCheckboxDiv"], [2, "width", "95%", "text-align", "start"], ["matInput", "", "placeholder", "File Name:", "matTooltipPosition", "above", 3, "ngModelChange", "ngModel", "matTooltip"], ["matTooltip", "Check to include the model URL in the generated HTML", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include computational processes tooltip in the OPDs images", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include all model elements dictionary", "matTooltipPosition", "right", 2, "float", "left", 3, "change", "checked"], ["matTooltip", "Check to include the descriptions of the entities in the elements dictionary", "matTooltipPosition", "right", 2, "float", "left", "margin-left", "20px", 3, "checked", "disabled"], ["matTooltip", "Check to include the computational function of the Processes in the elements dictionary", "matTooltipPosition", "right", 2, "float", "left", "margin-left", "20px", 3, "checked", "disabled"], ["matTooltip", "Check to show OPL sentences numbered", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include requirement views in the generated HTML", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to add confidential watermark", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include unloaded sub models", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Resolution number represents quality in multiple values. e.g for 300 dpi use '3'", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matInput", "", "placeholder", "Resolution", "type", "number", "min", "1", "max", "10", "required", "", 2, "text-align", "center", "width", "40px", "border", "none", "outline", "none", "box-shadow", "none", 3, "value"], [1, "htmlExportButtonsP"], ["mat-raised-button", "", 1, "htmlExportButton", 2, "margin-right", "15px", 3, "click"], ["mat-raised-button", "", "id", "Current", 1, "htmlExportButton", 3, "click"], [2, "margin-top", "-150px", 3, "hidden"], ["id", "spinnerWorking", "mode", "indeterminate", 2, "height", "135px", "margin-left", "calc(50% - 65px)"], [2, "position", "absolute", "width", "30px", "left", "calc(50% - 20px)", "top", "calc(50% - 115px)", 3, "hidden"], ["id", "spinnerValue", 2, "color", "#FFFF"]],
          template: function ExportModelAsHtmlComponent_Template(rf, ctx) {
            if (rf & 1) {
              const _r1 = core /* ɵɵgetCurrentView */.RV6();
              core /* ɵɵelementStart */.j41(0, "div", 12)(1, "div", 13)(2, "p", 13);
              core /* ɵɵtext */.EFF(3, "Export Model as HTML");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(4, "p", 14);
              core /* ɵɵtext */.EFF(5, "Note: Downloading might take few minutes");
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(6, "div", 15)(7, "mat-form-field", 16)(8, "mat-label");
              core /* ɵɵtext */.EFF(9, "File Name");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(10, "input", 17, 0);
              core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ExportModelAsHtmlComponent_Template_input_ngModelChange_10_listener($event) {
                core /* ɵɵrestoreView */.eBV(_r1);
                if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.modelName, $event)) {
                  ctx.modelName = $event;
                }
                return core /* ɵɵresetView */.Njj($event);
              });
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(12, "mat-checkbox", 18, 1);
              core /* ɵɵtext */.EFF(14, "Include Model URL");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(15, "mat-checkbox", 19, 2);
              core /* ɵɵtext */.EFF(17, "Include Computational Processes Tooltips");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(18, "mat-checkbox", 20, 3);
              core /* ɵɵlistener */.bIt("change", function ExportModelAsHtmlComponent_Template_mat_checkbox_change_18_listener() {
                core /* ɵɵrestoreView */.eBV(_r1);
                const includeElementsDictionary_r2 = core /* ɵɵreference */.sdS(19);
                const includeDescription_r3 = core /* ɵɵreference */.sdS(22);
                const includeComputational_r4 = core /* ɵɵreference */.sdS(25);
                includeDescription_r3.checked = includeElementsDictionary_r2.checked;
                return core /* ɵɵresetView */.Njj(includeComputational_r4.checked = includeElementsDictionary_r2.checked);
              });
              core /* ɵɵtext */.EFF(20, " Include Elements Dictionary ");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(21, "mat-checkbox", 21, 4);
              core /* ɵɵtext */.EFF(23, " Include Entities Description ");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(24, "mat-checkbox", 22, 5);
              core /* ɵɵtext */.EFF(26, " Include Computational Functions ");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(27, "mat-checkbox", 23, 6);
              core /* ɵɵtext */.EFF(29, "Show OPL sentences Numbered");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(30, "mat-checkbox", 24, 7);
              core /* ɵɵtext */.EFF(32, "Include Requirement Views");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(33, "mat-checkbox", 25, 8);
              core /* ɵɵtext */.EFF(35, "Add Confidential Watermark");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(36, "mat-checkbox", 26, 9);
              core /* ɵɵtext */.EFF(38, "Include Unloaded Sub-Models");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(39, "mat-checkbox", 27, 10);
              core /* ɵɵtext */.EFF(41, " OPDs Images Resolution ");
              core /* ɵɵelement */.nrm(42, "input", 28, 11);
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵelementStart */.j41(44, "div", 29);
              core /* ɵɵelement */.nrm(45, "br")(46, "br");
              core /* ɵɵelementStart */.j41(47, "p", 29)(48, "button", 30);
              core /* ɵɵlistener */.bIt("click", function ExportModelAsHtmlComponent_Template_button_click_48_listener() {
                core /* ɵɵrestoreView */.eBV(_r1);
                const includeUnloadedSubModels_r5 = core /* ɵɵreference */.sdS(37);
                return core /* ɵɵresetView */.Njj(ctx.openOpdsSelectionDialog(includeUnloadedSubModels_r5.checked));
              });
              core /* ɵɵtext */.EFF(49, "Select OPDs to Export");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(50, "button", 31);
              core /* ɵɵlistener */.bIt("click", function ExportModelAsHtmlComponent_Template_button_click_50_listener() {
                core /* ɵɵrestoreView */.eBV(_r1);
                const filename_r6 = core /* ɵɵreference */.sdS(11);
                const includeURL_r7 = core /* ɵɵreference */.sdS(13);
                const includeTooltips_r8 = core /* ɵɵreference */.sdS(16);
                const includeElementsDictionary_r2 = core /* ɵɵreference */.sdS(19);
                const includeDescription_r3 = core /* ɵɵreference */.sdS(22);
                const includeComputational_r4 = core /* ɵɵreference */.sdS(25);
                const numberedOPL_r9 = core /* ɵɵreference */.sdS(28);
                const includeRequirementViews_r10 = core /* ɵɵreference */.sdS(31);
                const confidentialWatermark_r11 = core /* ɵɵreference */.sdS(34);
                const includeUnloadedSubModels_r5 = core /* ɵɵreference */.sdS(37);
                const resolutionCheck_r12 = core /* ɵɵreference */.sdS(40);
                const resolution_r13 = core /* ɵɵreference */.sdS(43);
                return core /* ɵɵresetView */.Njj(ctx.saveHtmlMain(filename_r6.value, includeURL_r7.checked, includeTooltips_r8.checked, numberedOPL_r9.checked, includeDescription_r3.checked, includeComputational_r4.checked, resolutionCheck_r12.checked, resolution_r13.value, confidentialWatermark_r11.checked, includeElementsDictionary_r2.checked, includeRequirementViews_r10.checked, includeUnloadedSubModels_r5.checked));
              });
              core /* ɵɵtext */.EFF(51, "Save");
              core /* ɵɵelementEnd */.k0s()()()();
              core /* ɵɵelementStart */.j41(52, "div", 32);
              core /* ɵɵelement */.nrm(53, "progress-spinner", 33);
              core /* ɵɵelementStart */.j41(54, "div", 34)(55, "h2", 35);
              core /* ɵɵtext */.EFF(56, "0%");
              core /* ɵɵelementEnd */.k0s()()();
            }
            if (rf & 2) {
              const includeElementsDictionary_r2 = core /* ɵɵreference */.sdS(19);
              core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
              core /* ɵɵadvance */.R7$(10);
              core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx.modelName);
              core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.modelName);
              core /* ɵɵadvance */.R7$(2);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", false);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true)("disabled", !includeElementsDictionary_r2.checked);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true)("disabled", !includeElementsDictionary_r2.checked);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", false);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("checked", true);
              core /* ɵɵadvance */.R7$(3);
              core /* ɵɵproperty */.Y8G("value", 2);
              core /* ɵɵadvance */.R7$(10);
              core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
              core /* ɵɵadvance */.R7$(2);
              core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
            }
          },
          dependencies: [MatFormField, MatLabel, MatInput, MatTooltip, MatButton, MatCheckbox, ProgressSpinner, DefaultValueAccessor, NgControlStatus, NgModel],
          styles: [".exportHtmlDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important}.exportHtmlDiv[_ngcontent-%COMP%]   .exportHtmlTitle[_ngcontent-%COMP%]{text-align:center;color:#000000de!important}.exportHtmlDiv[_ngcontent-%COMP%]   .htmlCheckboxDiv[_ngcontent-%COMP%]{display:block!important}.exportHtmlDiv[_ngcontent-%COMP%]   .htmlCheckboxDiv[_ngcontent-%COMP%]   .mat-mdc-checkbox[_ngcontent-%COMP%]{height:24px!important;line-height:15px!important;padding-top:3px!important;padding-bottom:3px!important}.exportHtmlDiv[_ngcontent-%COMP%]   .htmlExportButtonsP[_ngcontent-%COMP%]{display:block!important;justify-items:center!important;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important}.exportHtmlDiv[_ngcontent-%COMP%]   .htmlExportButtonsP[_ngcontent-%COMP%]   .htmlExportButton[_ngcontent-%COMP%]{margin-top:24px!important;min-width:120px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}"]
        }))();
      }
      return ExportModelAsHtmlComponent;
    })();