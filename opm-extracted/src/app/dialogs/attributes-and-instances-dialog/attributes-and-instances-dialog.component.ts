// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/attributes-and-instances-dialog/attributes-and-instances-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function AttributesAndInstancesComponent_ul_36_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "ul")(1, "li", 15)(2, "span", 15);
    core /* ɵɵtext */.EFF(3, "File Name : ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "li", 15)(6, "span", 15);
    core /* ɵɵtext */.EFF(7, "File Size : ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵpipe */.nI1(9, "number");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.file.name);
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate1 */.SpI("", core /* ɵɵpipeBind2 */.i5U(9, 2, ctx_r2.file.size / 1024, ".2"), " KB");
  }
}
let AttributesAndInstancesComponent = /*#__PURE__*/(() => {
  class AttributesAndInstancesComponent {
    constructor(dialogRef, storage, context, userService, initRappid, data) {
      this.dialogRef = dialogRef;
      this.storage = storage;
      this.context = context;
      this.userService = userService;
      this.initRappid = initRappid;
      this.file = null; // Variable to store file
      this.imported = true; // disable or enable the import button
      this.spinnerFlag = false; // flag to show a spinner while processing
      this.ignoreExistingInstanceValues = false;
      this.createNonComputational = false;
      this.enableAutoFormat = true;
      this.init = initRappid;
      this.selected = data.selected;
    }
    ngOnInit() {}
    importAttributes() {
      this.processAttributesAndInstances(this.attributes, this.instances, this.ignoreExistingInstanceValues, this.createNonComputational, this.enableAutoFormat, this);
    }
    nameValidator(name) {
      return name.replace(/&/g, "&amp;") // Escape &
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;") // Escape >
      .replace(/'/g, "&apos;") // Escape '
      .replace(/"/g, "&quot;") // Escape "
      // Replace control characters with spaces
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, " ")
      // Replace line/paragraph separators with newlines
      .replace(/[\u2028\u2029]/g, "\n")
      // Replace BOM and directionality marks with empty strings
      .replace(/[\uFEFF\u200E\u200F]/g, "")
      // Replace non-breaking and zero-width spaces with regular spaces
      .replace(/[\u00A0\u200B]/g, " ")
      // Replace invalid XML characters with a placeholder
      .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, "�");
    }
    processAttributesAndInstances(attributes, instances, ignoreExistingInstanceValues, createNonComputational, enableAutoFormat, that) {
      that.spinnerFlag = true; // from here on the spinner will be shown until the downloading ends.
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
      that.dialogRef.disableClose = true;
      const originalObj = that.selected;
      const originalVisualObj = originalObj.getVisual();
      const model = that.init.getOpmModel();
      model.logForUndo("Attributes and instances creation");
      model.setShouldLogForUndoRedo(false, "importAttributes");
      // The amount of attributes and instances to create it all in a new view (OPD)
      const createInNewView = attributes.length + instances.length > 1000;
      if (createInNewView) {
        const s = that.init.selection.collection.models.filter(cell => OPCloudUtils.isInstanceOfDrawnThing(cell)).map(m => m.getVisual());
        const ret = model.createViewOpd(s, "Attributes and instances of " + originalObj.getText());
        that.init.treeViewService.init(model);
        model.currentOpd = ret.viewOpd;
        that.init.getGraphService().renderGraph(model.currentOpd, that.init);
        for (const obj of that.init.getGraphService().graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnObject(c))) {
          obj.syncStatesOrder(that.init, false);
        }
      }
      // handle attributes (renders left)
      attributes.forEach((attributeCol, index) => {
        const [attributeName] = attributeCol;
        const existingExhibitionLink = originalVisualObj.getAllLinks().outGoing.find(l => {
          return l.type === linkType.Exhibition && l.target.logicalElement.getName() === attributeName;
        });
        if (existingExhibitionLink) {
          // Only if it not already in the OPD
          if (!model.currentOpd.getVisualElementByLogical(existingExhibitionLink.target.logicalElement)) {
            const params = {
              id: 0,
              xPos: 0,
              yPos: 0,
              width: 130,
              height: 60
            };
            const x = that.init.opmModel.getAllBasicThings().find(o => o.lid === existingExhibitionLink.target.logicalElement.lid);
            // @ts-ignore
            const visual = x.opmModel.copyToScreen(x);
            visual.setParams(params);
            visual.setNewUUID();
            visual.refY = existingExhibitionLink.target.refY;
            visual.refX = existingExhibitionLink.target.refX;
            visual.refineeInzooming = visual.getRefineeInzoom();
            visual.refineeUnfolding = visual.getRefineeUnfold();
            visual.refineable = visual.getRefineable();
            if (visual.refineable || visual.logicalElement.getStereotype()) {
              visual.strokeWidth = 4;
            }
            const drawnElement = createDrawnEntity(visual.logicalElement.name);
            drawnElement.updateParamsFromOpmModel(visual);
            visual.setParams(drawnElement.getParams());
            that.init.getGraphService().fromStencil = true;
            that.init.getGraphService().graph.addCell(drawnElement);
            that.init.getGraphService().fromStencil = false;
            that.init.getGraphService().resetElementTextPosition(drawnElement);
            that.init.getGraphService().graph.startBatch("ignoreAddEvent");
            drawnElement.autosize(that.init);
            that.init.getGraphService().graph.stopBatch("ignoreAddEvent");
            model.connect(originalVisualObj, visual, {
              type: linkType.Exhibition,
              connection: linkConnectionType.systemic
            });
          }
        } else {
          const created = model.createManyThings(model.currentOpd, 0, 1);
          const visualObject = created.objects[0].visual;
          const logicalObject = visualObject.logicalElement;
          if (logicalObject.isAutoFormat() && !enableAutoFormat) {
            logicalObject.toggleAutoFormat();
          }
          logicalObject.setText(this.nameValidator(attributeName));
          visualObject.setEssence(Essence.Informatical);
          visualObject.width = 130;
          visualObject.height = 65;
          const xPos = originalObj.get("position").x - 300;
          const yPos = originalObj.get("position").y + index * 220;
          visualObject.xPos = xPos;
          visualObject.yPos = yPos;
          visualObject.setDefaultStyleFields();
          if (createInNewView) {
            const copy = model.currentOpd.getVisualElementByLogical(originalVisualObj.logicalElement);
            model.connect(copy, visualObject, {
              type: linkType.Exhibition,
              connection: linkConnectionType.systemic
            });
          } else {
            model.connect(originalVisualObj, visualObject, {
              type: linkType.Exhibition,
              connection: linkConnectionType.systemic
            });
          }
          that.init.getGraphService().renderGraph(model.currentOpd, that.init);
        }
      });
      // handle instances (renders right)
      instances.forEach((instanceName, index) => {
        if (index > 0) {
          const origObjectOutgoingLinks = originalVisualObj.getAllLinks().outGoing;
          const existingInstanceLink = origObjectOutgoingLinks.find(l => {
            return l.type === linkType.Instantiation && l.target.logicalElement.getName() === instanceName;
          });
          let instanceVisualInOPD;
          if (existingInstanceLink) {
            instanceVisualInOPD = model.currentOpd.getVisualElementByLogical(existingInstanceLink.target.logicalElement);
            if (!instanceVisualInOPD) {
              // Only if it not already in the OPD
              // Should only create a view.
              const params = {
                id: 0,
                xPos: 0,
                yPos: 0,
                width: 130,
                height: 60
              };
              const x = that.init.opmModel.getAllBasicThings().find(o => o.lid === existingInstanceLink.target.logicalElement.lid);
              const visual = x.opmModel.copyToScreen(x);
              visual.setParams(params);
              visual.setNewUUID();
              visual.refY = existingInstanceLink.target.refY;
              visual.refX = existingInstanceLink.target.refX;
              visual.refineeInzooming = visual.getRefineeInzoom();
              visual.refineeUnfolding = visual.getRefineeUnfold();
              visual.refineable = visual.getRefineable();
              if (visual.refineable || visual.logicalElement.getStereotype()) {
                visual.strokeWidth = 4;
              }
              const drawnElement = createDrawnEntity(visual.logicalElement.name);
              drawnElement.updateParamsFromOpmModel(visual);
              visual.setParams(drawnElement.getParams());
              that.init.getGraphService().fromStencil = true;
              that.init.getGraphService().graph.addCell(drawnElement);
              that.init.getGraphService().fromStencil = false;
              that.init.getGraphService().resetElementTextPosition(drawnElement);
              that.init.getGraphService().graph.startBatch("ignoreAddEvent");
              drawnElement.autosize(that.init);
              that.init.getGraphService().graph.stopBatch("ignoreAddEvent");
              instanceVisualInOPD = visual;
              model.connect(originalVisualObj, visual, {
                type: linkType.Instantiation,
                connection: linkConnectionType.systemic
              });
            }
          } else {
            // create new instance
            const created = model.createManyThings(model.currentOpd, 0, 1);
            const visualObject = created.objects[0].visual;
            const logicalObject = visualObject.logicalElement;
            if (logicalObject.isAutoFormat() && !enableAutoFormat) {
              logicalObject.toggleAutoFormat();
            }
            logicalObject.setText(this.nameValidator(instanceName));
            visualObject.setEssence(originalObj.getEssence());
            visualObject.width = 130;
            visualObject.height = 65;
            const xPos = originalObj.get("position").x + 300;
            const yPos = originalObj.get("position").y + (index + 1) * 220;
            visualObject.xPos = xPos;
            visualObject.yPos = yPos;
            visualObject.setDefaultStyleFields();
            that.init.oplService.oplSwitch.next("render");
            if (createInNewView) {
              const copy = model.currentOpd.getVisualElementByLogical(originalVisualObj.logicalElement);
              model.connect(copy, visualObject, {
                type: linkType.Instantiation,
                connection: linkConnectionType.systemic
              });
            } else {
              model.connect(originalVisualObj, visualObject, {
                type: linkType.Instantiation,
                connection: linkConnectionType.systemic
              });
            }
            instanceVisualInOPD = visualObject;
            that.init.getGraphService().renderGraph(model.currentOpd, that.init);
          }
          // create or update the attributes for the instance above
          attributes.forEach((attributeCol, index2) => {
            const [attributeName] = attributeCol;
            const existingExhibitionLink = instanceVisualInOPD.getAllLinks().outGoing.find(l => {
              return l.type === linkType.Exhibition && l.target.logicalElement.getName() === attributeName;
            });
            if (existingExhibitionLink) {
              let attributeOfInstanceVisual = model.currentOpd.getVisualElementByLogical(existingExhibitionLink.target.logicalElement);
              if (!attributeOfInstanceVisual) {
                const params = {
                  id: 0,
                  xPos: 0,
                  yPos: 0,
                  width: 130,
                  height: 60
                };
                const x = that.init.opmModel.getAllBasicThings().find(o => o.lid === existingExhibitionLink.target.logicalElement.lid);
                // @ts-ignore
                const visual = x.opmModel.copyToScreen(x);
                visual.setParams(params);
                visual.setNewUUID();
                visual.refY = existingExhibitionLink.target.refY;
                visual.refX = existingExhibitionLink.target.refX;
                visual.refineeInzooming = visual.getRefineeInzoom();
                visual.refineeUnfolding = visual.getRefineeUnfold();
                visual.refineable = visual.getRefineable();
                if (visual.refineable || visual.logicalElement.getStereotype()) {
                  visual.strokeWidth = 4;
                }
                const drawnElement = createDrawnEntity(visual.logicalElement.name);
                drawnElement.updateParamsFromOpmModel(visual);
                visual.setParams(drawnElement.getParams());
                that.init.getGraphService().fromStencil = true;
                that.init.getGraphService().graph.addCell(drawnElement);
                that.init.getGraphService().fromStencil = false;
                that.init.getGraphService().resetElementTextPosition(drawnElement);
                that.init.getGraphService().graph.startBatch("ignoreAddEvent");
                drawnElement.autosize(that.init);
                that.init.getGraphService().graph.stopBatch("ignoreAddEvent");
                model.connect(instanceVisualInOPD, visual, {
                  type: linkType.Exhibition,
                  connection: linkConnectionType.systemic
                });
                attributeOfInstanceVisual = visual;
                that.init.getGraphService().renderGraph(model.currentOpd, that.init);
              }
              // Update the attribute if needed, as it is already existing
              if (!ignoreExistingInstanceValues) {
                attributeOfInstanceVisual.states[0].logicalElement.setText(attributeCol[index]);
              }
            } else {
              // Create the new attribute for the instance
              const created2 = model.createManyThings(model.currentOpd, 0, 1);
              const visualObject2 = created2.objects[0].visual;
              const logicalObject2 = visualObject2.logicalElement;
              if (logicalObject2.isAutoFormat() && !enableAutoFormat) {
                logicalObject2.toggleAutoFormat();
              }
              logicalObject2.setText(this.nameValidator(attributeName));
              visualObject2.setEssence(Essence.Informatical);
              visualObject2.width = 130;
              visualObject2.height = 65;
              const xPos2 = instanceVisualInOPD.xPos + (index2 + 1) * 200;
              const yPos2 = instanceVisualInOPD.yPos + 150;
              visualObject2.xPos = xPos2;
              visualObject2.yPos = yPos2;
              visualObject2.setDefaultStyleFields();
              that.init.getGraphService().renderGraph(model.currentOpd, that.init);
              const drawn2 = that.init.graph.getCell(visualObject2.id);
              if (drawn2 && createNonComputational) {
                visualObject2.addState();
                visualObject2.states[1].removeAction();
                visualObject2.states[0].logicalElement.setText(this.nameValidator(attributeCol[index]));
                drawn2.arrangeEmbedded(that.init, "bottom");
                drawn2.shiftEmbeddedToEdge(that.init);
              }
              visualObject2.refY = 0.1;
              if (drawn2 && !createNonComputational) {
                drawn2.shiftEmbeddedToEdge(that.init);
                drawn2.defineAsComputationalObject(that.init, false);
                visualObject2.states[0].logicalElement.setText(this.nameValidator(attributeCol[index]));
              }
              model.connect(instanceVisualInOPD, visualObject2, {
                type: linkType.Exhibition,
                connection: linkConnectionType.systemic
              });
            }
          });
          that.init.oplService.oplSwitch.next("render");
          that.init.getGraphService().renderGraph(model.currentOpd, that.init);
        }
      });
      that.init.oplService.oplSwitch.next("render");
      that.init.getGraphService().renderGraph(that.init.opmModel.currentOpd, that.init);
      that.init.criticalChanges_.next();
      model.setShouldLogForUndoRedo(true, "importAttributes");
      that.dialogRef.close();
    }
    /**
     * Loading the Attributes CSV file content, reading it, and preparing it for import.
     * @param files
     * @protected
     */
    loadAttributesFile(files) {
      const this_ = this;
      const reader = new FileReader();
      const [file] = files;
      if (!file) {
        (0, validationAlert)("No file selected.", 3500, "Warning");
        this_.imported = true;
        return;
      }
      // Ensure the file is a CSV based on its MIME type and extension
      const allowedMimeTypes = ["text/csv", "application/vnd.ms-excel"]; // Some systems use this MIME type
      const allowedExtensions = /\.csv$/i; // Case-insensitive check
      if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.test(file.name)) {
        (0, validationAlert)("Invalid file type. Please upload a CSV file.", 3500, "Warning");
        this_.imported = true;
        return;
      }
      this.file = file;
      reader.readAsText(file);
      reader.onload = function (e) {
        try {
          const result = e.target?.result;
          const parsed = parseCSV(result);
          if (parsed.length === 1) {
            (0, validationAlert)(`The CSV file is empty.`, 3500, "Warning");
            this_.imported = true;
            return;
          }
          if (parsed.length === 0) {
            (0, validationAlert)(`The CSV file is missing attributes.`, 3500, "Warning");
            this_.imported = true;
            return;
          }
          const hasEmptyCells = parsed.findIndex((item, i) => {
            const x = item.findIndex((cell, i2) => i2 > 0 && i > 0 && cell.trim() === "");
            return x !== -1;
          }) !== -1;
          if (hasEmptyCells) {
            (0, validationAlert)(`The CSV file has empty cells values.`, 3500, "Warning");
            this_.imported = true;
            return;
          }
          [this_.instances] = parsed;
          this_.attributes = parsed.filter((value, index) => index > 0);
          this_.imported = false;
        } catch (ex) {
          (0, validationAlert)(`There was an error processing the CSV file.`, 3500, "Error");
          console.error("could not parse CSV file:", ex);
        }
      };
      reader.onerror = function () {
        (0, validationAlert)("Error reading the file. Please try again.", 3500, "Error");
        this_.imported = true;
        return;
      };
      /**
       * Support function when selecting and uploading a CSV file to parse it.
       * @param fileContent
       */
      function parseCSV(fileContent) {
        let arr = [];
        let quote = false; // 'true' means we're inside a quoted field
        // Iterate over each character, keep track of current row and column (of the returned array)
        for (let row = 0, col = 0, c = 0; typeof fileContent !== "string" || c < fileContent?.length; c++) {
          let cc = fileContent[c];
          let nc = fileContent[c + 1]; // Current character, next character
          arr[row] = arr[row] || []; // Create a new row if necessary
          arr[row][col] = arr[row][col] || ""; // Create a new column (start with empty string) if necessary
          // If the current character is a quotation mark, and we're inside a
          // quoted field, and the next character is also a quotation mark,
          // add a quotation mark to the current column and skip the next character
          if (cc === "\"" && quote && nc === "\"") {
            arr[row][col] += cc;
            ++c;
            continue;
          }
          // If it's just one quotation mark, begin/end quoted field
          if (cc === "\"") {
            quote = !quote;
            continue;
          }
          // If it's a comma and we're not in a quoted field, move on to the next column
          if (cc === "," && !quote) {
            ++col;
            continue;
          }
          // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
          // and move on to the next row and move to column 0 of that new row
          if (cc === "\r" && nc === "\n" && !quote) {
            ++row;
            col = 0;
            ++c;
            continue;
          }
          // If it's a newline (LF or CR) and we're not in a quoted field,
          // move on to the next row and move to column 0 of that new row
          if (cc === "\n" && !quote) {
            ++row;
            col = 0;
            continue;
          }
          if (cc === "\r" && !quote) {
            ++row;
            col = 0;
            continue;
          }
          // Otherwise, append the current character to the current column
          arr[row][col] += cc;
        }
        return arr;
      }
    }
    static #_ = (() => this.ɵfac = function AttributesAndInstancesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AttributesAndInstancesComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: AttributesAndInstancesComponent,
      selectors: [["attributes-and-instances-dialog"]],
      decls: 42,
      vars: 8,
      consts: [["fileInput", ""], [1, "importAttributesDiv", 3, "hidden"], [1, "importAttributesP"], ["matTooltip", "If checked, existing instances in the model will keep their current values and won’t be updated from the CSV file", "matTooltipPosition", "below", 2, "float", "left", 3, "ngModelChange", "ngModel"], ["matTooltip", "If checked, Objects will not be created as computational, but will still have one state", "matTooltipPosition", "below", 2, "float", "left", 3, "ngModelChange", "ngModel"], ["matTooltip", "Creating the Objects with the text content autoformat enabled", "matTooltipPosition", "below", 2, "float", "left", 3, "ngModelChange", "ngModel"], [1, "importAttributesButtonsDiv"], ["mat-mini-fab", "", "color", "primary", "id", "load_file_button", 3, "click"], ["type", "file", "accept", ".csv", "name", "single", 1, "form-control", 2, "display", "none", 3, "change"], [2, "margin-left", "10px"], [2, "padding", "0", "margin-left", "75px"], [4, "ngIf"], ["matTooltip", "Upload a valid CSV file to enable import", 1, "importAttributesButtonsDiv", 2, "align-items", "center", 3, "matTooltipDisabled"], ["mat-raised-button", "", "matTooltip", "Click to import the Attributes", 1, "importAttributesButton", 3, "click", "disabled"], [2, "margin-top", "-150px", 3, "hidden"], [1, "import_file_details"]],
      template: function AttributesAndInstancesComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "p", 2);
          core /* ɵɵtext */.EFF(2, "Attributes and instances upload");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div");
          core /* ɵɵelement */.nrm(4, "br");
          core /* ɵɵelementStart */.j41(5, "b");
          core /* ɵɵtext */.EFF(6, "Upload a CSV file to add attributes and instances for the selected object:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(7, "br");
          core /* ɵɵtext */.EFF(8, "The file format should be left-to-right. ");
          core /* ɵɵelement */.nrm(9, "br");
          core /* ɵɵtext */.EFF(10, "Instances should be represented by columns, and attributes by rows. ");
          core /* ɵɵelement */.nrm(11, "br");
          core /* ɵɵtext */.EFF(12, "For more details on format requirements and this feature, please refer to the user guide.");
          core /* ɵɵelement */.nrm(13, "br")(14, "br");
          core /* ɵɵtext */.EFF(15, " Choose your preferred options:");
          core /* ɵɵelement */.nrm(16, "br")(17, "br");
          core /* ɵɵelementStart */.j41(18, "mat-checkbox", 3);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AttributesAndInstancesComponent_Template_mat_checkbox_ngModelChange_18_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.ignoreExistingInstanceValues, $event)) {
              ctx.ignoreExistingInstanceValues = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵtext */.EFF(19, "Ignore CSV content for existing instances' values");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(20, "br");
          core /* ɵɵelementStart */.j41(21, "mat-checkbox", 4);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AttributesAndInstancesComponent_Template_mat_checkbox_ngModelChange_21_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.createNonComputational, $event)) {
              ctx.createNonComputational = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵtext */.EFF(22, "Create non-computational instance attributes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(23, "br");
          core /* ɵɵelementStart */.j41(24, "mat-checkbox", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function AttributesAndInstancesComponent_Template_mat_checkbox_ngModelChange_24_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.enableAutoFormat, $event)) {
              ctx.enableAutoFormat = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵtext */.EFF(25, "Enable Auto Format");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(26, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(27, "div", 6)(28, "button", 7);
          core /* ɵɵlistener */.bIt("click", function AttributesAndInstancesComponent_Template_button_click_28_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const fileInput_r2 = core /* ɵɵreference */.sdS(32);
            return core /* ɵɵresetView */.Njj(fileInput_r2.click());
          });
          core /* ɵɵelementStart */.j41(29, "mat-icon");
          core /* ɵɵtext */.EFF(30, "attach_file");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "input", 8, 0);
          core /* ɵɵlistener */.bIt("change", function AttributesAndInstancesComponent_Template_input_change_31_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.loadAttributesFile($event.target.files));
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(33, "label", 9);
          core /* ɵɵtext */.EFF(34, "Upload attributes and instances CSV file");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(35, "mat-dialog-content", 10);
          core /* ɵɵtemplate */.DNE(36, AttributesAndInstancesComponent_ul_36_Template, 10, 5, "ul", 11);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(37, "div", 12)(38, "button", 13);
          core /* ɵɵlistener */.bIt("click", function AttributesAndInstancesComponent_Template_button_click_38_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.importAttributes());
          });
          core /* ɵɵtext */.EFF(39, "IMPORT");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(40, "div", 14);
          core /* ɵɵelement */.nrm(41, "progress-spinner");
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(18);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.ignoreExistingInstanceValues);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.createNonComputational);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.enableAutoFormat);
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.file);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("matTooltipDisabled", !ctx.imported);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("disabled", ctx.imported);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
        }
      },
      dependencies: [NgIf, MatDialogContent, MatTooltip, MatIcon, MatButton, MatMiniFabButton, MatCheckbox, ProgressSpinner, NgControlStatus, NgModel, DecimalPipe],
      styles: [".importAttributesDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important}.importAttributesDiv[_ngcontent-%COMP%]   .importAttributesP[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}.importAttributesDiv[_ngcontent-%COMP%]   .importAttributesButtonsDiv[_ngcontent-%COMP%]{display:inline-block;margin-left:75px;margin-top:15px;align-content:center!important;justify-items:center!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important}.importAttributesDiv[_ngcontent-%COMP%]   .importAttributesButtonsDiv[_ngcontent-%COMP%]   #load_file_button[_ngcontent-%COMP%]{margin-top:5px;background-color:#1a3763}.importAttributesDiv[_ngcontent-%COMP%]   .importAttributesButtonsDiv[_ngcontent-%COMP%]   .importAttributesButton[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif!important;color:#1a3763!important;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;letter-spacing:normal;margin-left:133px;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}.importAttributesDiv[_ngcontent-%COMP%]   .import_file_details[_ngcontent-%COMP%]{width:420px;color:#1a3763;font-weight:700;letter-spacing:normal!important;line-height:normal}"]
    }))();
  }
  return AttributesAndInstancesComponent;
})();