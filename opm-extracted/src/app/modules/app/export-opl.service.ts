// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/export-opl.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ExportOPLAPIService = /*#__PURE__*/(() => {
  class ExportOPLAPIService {
    constructor(initRappid) {
      this.initRappidService = initRappid;
    }
    exportOPL(getFileName) {
      var _this = this;
      return (0, default)(function* () {
        _this.initRappidService.isLoadingModel = true;
        _this.initRappidService.exportingOpl = true;
        let isFile = true;
        const originalGraph = _this.initRappidService.graph;
        yield new Promise(r => setTimeout(r, 3000));
        let numberedOPL;
        let num = 0;
        let fileName;
        if (!getFileName || getFileName[0].trim() === "") {
          // get default file name
          fileName = _this.initRappidService.opmModel.createDefaultModelName();
          numberedOPL = true;
          isFile = true;
        } else {
          fileName = getFileName[0];
          numberedOPL = getFileName[1];
          isFile = getFileName[3] === false ? getFileName[3] : true;
        }
        // The process of saving the exported file is starting.
        // An array that will include the OPL sentences for each OPD separately.
        const arrayOfOpds = new Array();
        arrayOfOpds.push("<html><body>"); // Open an HTML Tag for arrayOfOpds.
        // The next lines define the colors of words according to their type - object \ process \ state for arrOfSD.
        arrayOfOpds.push("<style> .object { color: #00b050; } </style>");
        arrayOfOpds.push("<style> .process { color: #0070c0; } </style>");
        arrayOfOpds.push("<style> .state { color: #808000; } </style>");
        let creationDate;
        const model = _this.initRappidService.graphService.modelObject.modelData;
        if (model?.editBy && model.editBy.date && model.editBy.date !== "") {
          creationDate = typeof model.editBy.date === "number" ? formatDate(new Date(model.editBy.date)) : model.editBy.date;
        } else {
          creationDate = "unknown";
        }
        // Inserting the model name with model id in the tag and last edited date for versions
        arrayOfOpds.push(`<table><tr><b model-id="${_this.initRappidService.opmModel?.name !== "Model (Not Saved)" ? _this.initRappidService.graphService.modelObject.id : "undefined"}" last-edited="${creationDate}">Model Name: `);
        arrayOfOpds.push(_this.initRappidService.opmModel?.name ? _this.initRappidService.opmModel.name : "Undefined name for unsaved model");
        arrayOfOpds.push("</b></tr></table>");
        arrayOfOpds.push("<br>");
        // An array that will include the OPL sentences for all Opds together
        // without duplication.
        const arrOfAllOpl = new Array();
        let allOPLText = "OPL Spec:\n";
        // arrOfAllOpl.push('<html><body>'); // Open an HTML Tag for arrOfAllOpl. No need for one document to have two html tags
        /// The next lines define the colors of words according to their type - object \ process \ state for arrOfAllOpl.
        arrOfAllOpl.push("<style> .object { color: #006400; } </style>");
        arrOfAllOpl.push("<style> .process { color: #00008B; } </style>");
        arrOfAllOpl.push("<style> .state { color: #808000; } </style>");
        arrOfAllOpl.push("<style> p { margin-top: 0em; margin-bottom: 0em; } </style>");
        arrOfAllOpl.push("<table><tr><b>OPL spec.</b></tr>"); // Insert a title for the arrOfAllOpl array.
        arrOfAllOpl.push("<br>");
        // Save the current Opd that the user is editing, for rendering it at the end of the function.
        const currentOpd = _this.initRappidService.opmModel.currentOpd;
        // Get all existing OPDs in the graph.
        _this.setOpdsOrder();
        const allOpd = _this.opdsOrder; // this.initRappidService.opmModel.opds.filter(o => !o.isHidden);
        // This loop goes over all OPDs and inserts the OPL sentences to the arrays.
        for (let i = 0; i < allOpd.length; i++) {
          if (allOpd[i].sharedOpdWithSubModelId && allOpd[i].visualElements.length === 0) {
            continue;
          }
          const tempGraph = _this.initRappidService.graphService.renderGraph(allOpd[i], _this.initRappidService, null, true); // Goes to the next OPD in the allOpd array.
          _this.initRappidService.graph = tempGraph;
          _this.initRappidService.graphService.graph = tempGraph;
          // Get the name of the current OPD.
          let nameOfOpd;
          if (allOpd[i].parendId !== "Stereotypes") {
            nameOfOpd = allOpd[i].getNumberedName() + (allOpd[i].getNumberedName() === "SD" ? "" : ": " + allOpd[i].getName());
          } else {
            nameOfOpd = "Stereotype: " + allOpd[i].getNumberedName();
          }
          arrayOfOpds.push(`<table><tr><b opd-id="${allOpd[i].id}">`);
          arrayOfOpds.push(nameOfOpd); // Insert the name of the current OPD as a title in the arrOfSD array.
          arrayOfOpds.push("</b></tr>");
          arrayOfOpds.push("<br>");
          // Get the cells that contain the OPL sentences of the current OPD.
          const cells = _this.initRappidService.oplService.generateOpl(); // YANG's function
          // This loop goes over all of the cells and inserts the OPL sentences to the arrays.
          for (let j = 0; j < cells.length; j++) {
            if (cells[j].opl) {
              // Check if the cell contains an OPL sentence.
              // Get the OPL sentence of the cell.
              let innerHTML = "";
              if (numberedOPL) {
                innerHTML = String(j + 1) + ". " + cells[j].opl; // get the html of this opl sentence
                num += 1;
              } else {
                innerHTML = cells[j].opl;
              }
              arrayOfOpds.push("<tr>", innerHTML, "</tr>"); // Insert the OPL sentence into the arrOfSD array.
              arrayOfOpds.push("<br>");
              // Initialization of a temp boolean variable.
              // It will be used as a flag to check if the current OPL sentence already exists in the arrOfAllOpl array.
              if (!numberedOPL) {
                innerHTML = cells[j].opl;
              } else {
                innerHTML = String(num) + ". " + cells[j].opl;
              }
              arrOfAllOpl.push("<tr>", innerHTML, "</tr>"); /// Insert the OPL sentence into the arrOfAllOpl array.
              arrOfAllOpl.push("<br>");
              if (!isFile) {
                const tempElement = document.createElement("div");
                tempElement.innerHTML = cells[j].opl;
                allOPLText += tempElement.innerText + "\n";
              }
            }
          }
          arrayOfOpds.push("</table><br>");
        }
        // arrayOfOpds.push('</body></html>'); // Close an HTML Tag for arrayOfOpds. No need for one document to have two html tags
        arrOfAllOpl.push("</table></body></html>"); // Close an HTML Tag for arrOfAllOpl.
        _this.initRappidService.graph = originalGraph;
        _this.initRappidService.graphService.graph = originalGraph;
        _this.initRappidService.graphService.renderGraph(currentOpd, _this.initRappidService); // Goes back to the OPD that the user is editing.
        // Concatenation of the arrOfSD and the arrOfAllOpl arrays.
        const exportFileContent = arrayOfOpds.concat(arrOfAllOpl);
        // Create the exported file.
        const exportFile = new Blob(exportFileContent, {
          type: "html/plain;charset=utf-8"
        });
        if (isFile) {
          FileSaver_min.saveAs(exportFile, fileName + ".html"); // Save the exported file.
        }
        _this.initRappidService.isLoadingModel = false;
        _this.initRappidService.exportingOpl = false;
        if (!isFile) {
          return allOPLText;
        }
      })();
    }
    setOpdsOrder() {
      this.opdsOrder = [];
      const regularOpds = this.initRappidService.opmModel.opds.filter(o => !o.requirementViewOf && !o.stereotypeOpd).sort((a, b) => {
        if (a.getNumberedName() > b.getNumberedName()) {
          return 1;
        } else {
          return -1;
        }
      });
      const requirementViews = this.initRappidService.opmModel.opds.filter(o => o.requirementViewOf);
      const stereotypesOpds = this.initRappidService.opmModel.stereotypes.getStereoTypes().map(str => str.opd);
      this.opdsOrder = [...regularOpds, ...requirementViews, ...stereotypesOpds].filter(opd => !opd.isHidden);
    }
    static #_ = (() => this.ɵfac = function ExportOPLAPIService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ExportOPLAPIService)(core /* ɵɵinject */.KVO(InitRappidService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ExportOPLAPIService,
      factory: ExportOPLAPIService.ɵfac
    }))();
  }
  return ExportOPLAPIService;
})();