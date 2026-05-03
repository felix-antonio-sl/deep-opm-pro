// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/opm-model-comparison.service.ts
// Extracted by opm-extracted/tools/extract.mjs

    /**
     * This class is created of an OPM-Model.
     * It holds all the data from the model needed to compare models with each other.
     * Ideally, this class can do logic of its own - intersect sets for example.
     * It is a helper class for the Model Comparison Service
     */
    class ComparisonFeatureSet {
      constructor(model) {
        this.name = model.name;
        this.metadata = model.modelMetaData;
        this.logicalElements = model.logicalElements;
        this.opds = model.opds;
      }
    }
    /**
     * The model comparison service.
     * It is in-charge of the end-to-end process of the comparison: exracting features, comparing them, generating
     * an output string and downloading the csv.
     */
    let OpmModelComparisonService = /*#__PURE__*/(() => {
      class OpmModelComparisonService {
        constructor(model, database, storage) {
          this.model = model;
          this.database = database;
          this.storage = storage;
        }
        start(id) {
          var _this = this;
          return (0, default)(function* () {
            const toCompareJson = yield _this.storage.getModel(id, "MAIN");
            const toCompareModel = new OpmModel();
            toCompareModel.fromJson(toCompareJson);
            _this.compare(_this.model.model, toCompareModel);
          })();
        }
        /**
         * The main function of this service.
         * Creating the feature set for each OPM model and export the results.
         * @param currentOpmModel - the model currently showed in the workspace
         * @param comparedOpmModel - the model loaded for comparison with the current one
         */
        compare(currentOpmModel, comparedOpmModel) {
          this.currentModelFeatureSet = new ComparisonFeatureSet(currentOpmModel);
          this.comparedModelFeatureSet = new ComparisonFeatureSet(comparedOpmModel);
          this.outputFileName = this.currentModelFeatureSet.name + "-" + this.comparedModelFeatureSet.name + "-Comparison.csv";
          this.currentUniqueElementsCount = 0;
          this.comparedUniqueElementsCount = 0;
          this.exportCsv();
        }
        /**
         * helper function for cleaning strings before they are printed - unite spaces, line breaks and tabs to single space
         * and remove unnecessary characters
         * @param str - string to be cleaned
         */
        cleanString(str) {
          return str.replace(/[\xA0 \n\t]+/g, " ");
        }
        /**
         * Return a string consists of three parameters in a CSV format line followed by a line break
         * @param name - first column
         * @param first - seconds column
         * @param second - third column
         */
        writeLine(name, first, second) {
          return [name === "" ? "" : this.cleanString(name) + ":", this.cleanString(first.toString()), this.cleanString(second.toString())].join(",") + "\n";
        }
        /**
         * Return a string consists of a line break in a csv output format
         */
        writeBlankLine() {
          return this.writeLine("", "", "");
        }
        /**
         * Return a string consists of all the data showing the in statistics part of the OpCloud in a csv format
         */
        writeMetaData() {
          const numberOfModelLogicalObjects = this.currentModelFeatureSet.metadata.getNumberOfModelLogicalObjects();
          const numberOfModelVisualObjects = this.currentModelFeatureSet.metadata.getNumberOfModelVisualObjects();
          const numberOfModelLogicalProcesses = this.currentModelFeatureSet.metadata.getNumberOfModelLogicalProcesses();
          const numberOfModelVisualProcesses = this.currentModelFeatureSet.metadata.getNumberOfModelVisualProcesses();
          const numberOfModelLogicalThings = numberOfModelLogicalObjects + numberOfModelLogicalProcesses;
          const numberOfModelVisualThings = numberOfModelVisualObjects + numberOfModelVisualProcesses;
          const numberOfModelStructuralRelations = this.currentModelFeatureSet.metadata.getNumberOfModelStructuralRelations();
          const numberOfModelProceduralRelations = this.currentModelFeatureSet.metadata.getNumberOfModelProceduralRelations();
          const numberOfModelStructuralLinks = this.currentModelFeatureSet.metadata.getNumberOfModelStructuralLinks();
          const numberOfModelProceduralLinks = this.currentModelFeatureSet.metadata.getNumberOfModelProceduralLinks();
          const numberOfModelLogicalElements = numberOfModelStructuralRelations + numberOfModelProceduralRelations + numberOfModelLogicalThings;
          const numberOfModelVisualElements = numberOfModelStructuralLinks + numberOfModelProceduralLinks + numberOfModelVisualThings;
          const maxNestingLevel = this.currentModelFeatureSet.metadata.getMaxNestingLevel();
          const c_numberOfModelLogicalObjects = this.comparedModelFeatureSet.metadata.getNumberOfModelLogicalObjects();
          const c_numberOfModelVisualObjects = this.comparedModelFeatureSet.metadata.getNumberOfModelVisualObjects();
          const c_numberOfModelLogicalProcesses = this.comparedModelFeatureSet.metadata.getNumberOfModelLogicalProcesses();
          const c_numberOfModelVisualProcesses = this.comparedModelFeatureSet.metadata.getNumberOfModelVisualProcesses();
          const c_numberOfModelLogicalThings = c_numberOfModelLogicalObjects + c_numberOfModelLogicalProcesses;
          const c_numberOfModelVisualThings = c_numberOfModelVisualObjects + c_numberOfModelVisualProcesses;
          const c_numberOfModelStructuralRelations = this.comparedModelFeatureSet.metadata.getNumberOfModelStructuralRelations();
          const c_numberOfModelProceduralRelations = this.comparedModelFeatureSet.metadata.getNumberOfModelProceduralRelations();
          const c_numberOfModelStructuralLinks = this.comparedModelFeatureSet.metadata.getNumberOfModelStructuralLinks();
          const c_numberOfModelProceduralLinks = this.comparedModelFeatureSet.metadata.getNumberOfModelProceduralLinks();
          const c_numberOfModelLogicalElements = c_numberOfModelStructuralRelations + c_numberOfModelProceduralRelations + c_numberOfModelLogicalThings;
          const c_numberOfModelVisualElements = c_numberOfModelStructuralLinks + c_numberOfModelProceduralLinks + c_numberOfModelVisualThings;
          const c_maxNestingLevel = this.comparedModelFeatureSet.metadata.getMaxNestingLevel();
          let content = "";
          content += this.writeLine("Logical objects", numberOfModelLogicalObjects, c_numberOfModelLogicalObjects);
          content += this.writeLine("Visual objects", numberOfModelVisualObjects, c_numberOfModelVisualObjects);
          content += this.writeLine("Logical processes", numberOfModelLogicalProcesses, c_numberOfModelLogicalProcesses);
          content += this.writeLine("Visual processes", numberOfModelVisualProcesses, c_numberOfModelVisualProcesses);
          content += this.writeLine("Logical things", numberOfModelLogicalThings, c_numberOfModelLogicalThings);
          content += this.writeLine("Visual things", numberOfModelVisualThings, c_numberOfModelVisualThings);
          content += this.writeLine("Structural relations", numberOfModelStructuralRelations, c_numberOfModelStructuralRelations);
          content += this.writeLine("Procedural relations", numberOfModelProceduralRelations, c_numberOfModelProceduralRelations);
          content += this.writeLine("Structural links", numberOfModelStructuralLinks, c_numberOfModelStructuralLinks);
          content += this.writeLine("Procedural links", numberOfModelProceduralLinks, c_numberOfModelProceduralLinks);
          content += this.writeLine("Logical elements", numberOfModelLogicalElements, c_numberOfModelLogicalElements);
          content += this.writeLine("Visual elements", numberOfModelVisualElements, c_numberOfModelVisualElements);
          content += this.writeLine("Max. nesting level", maxNestingLevel, c_maxNestingLevel);
          return content;
        }
        /**
         * Return a string consists of all the unique instances of a logical entity (LogicalObject, LogicalProcess, etc.)
         * @param name - the name of the entity compared (to be printed)
         * @param type - the type of the entity compared (for comparison purpose)
         */
        writeUniqueLogicalInstancesOfEntity(name, type) {
          const logicalObjects = this.currentModelFeatureSet.logicalElements.filter(elm => elm instanceof type).map(elm => this.cleanString(elm.text));
          const c_logicalObjects = this.comparedModelFeatureSet.logicalElements.filter(elm => elm instanceof type).map(elm => this.cleanString(elm.text));
          const uniqueInCurrent = logicalObjects.filter(elm => c_logicalObjects.find(c_elm => elm === c_elm) === undefined);
          const uniqueInCompared = c_logicalObjects.filter(c_elm => logicalObjects.find(elm => elm === c_elm) === undefined);
          this.currentUniqueElementsCount += uniqueInCurrent.length;
          this.comparedUniqueElementsCount += uniqueInCompared.length;
          let content = "";
          content += `${name} in Current but not in Compared,${uniqueInCurrent.join(",")}
`;
          content += `${name} in Compared but not in Current,${uniqueInCompared.join(",")}
`;
          return content;
        }
        /**
         * Return a string consists of all the unique instances of a visual entity (VisualObject, VisualProperty, etc.)
         * @param name - the name of the entity compared (to be printed)
         * @param type - the type of the entity compared (for comparison purpose)
         * @param currentVE - array of visual elements to be compared in the current OPM Model
         * @param copmaredVE - array of visual elements to be compared in the compared OPM Model
         */
        writeUniqueVisualInstancesOfEntity(name, type, currentVE, copmaredVE) {
          const logicalObjects = currentVE.filter(elm => elm instanceof type).map(elm => elm).map(elm => this.cleanString(elm.logicalElement.text));
          const c_logicalObjects = copmaredVE.filter(elm => elm instanceof type).map(elm => elm).map(elm => this.cleanString(elm.logicalElement.text));
          const uniqueInCurrent = logicalObjects.filter(elm => c_logicalObjects.find(c_elm => elm === c_elm) === undefined);
          const uniqueInCompared = c_logicalObjects.filter(c_elm => logicalObjects.find(elm => elm === c_elm) === undefined);
          let content = "";
          content += `${name} in Current but not in Compared,${uniqueInCurrent.join(",")}
`;
          content += `${name} in Compared but not in Current,${uniqueInCompared.join(",")}
`;
          return content;
        }
        /**
         * Return a string consists of all the unique instances of a visual entities inside a certain OPD
         * @param opd - opd in the current opm model
         * @param c_opd - opd in the compared opm model
         */
        writeOpdUniqueVisualElements(opd, c_opd) {
          let output = "";
          output += this.writeUniqueVisualInstancesOfEntity("Visual Objects", OpmVisualObject, opd.visualElements, c_opd.visualElements);
          output += this.writeUniqueVisualInstancesOfEntity("Visual Processes", OpmVisualProcess, opd.visualElements, c_opd.visualElements);
          return output;
        }
        /**
         * Return a string consists of all the unique instances of links
         * @param name - the name of the entity compared (to be printed)
         */
        writeUniqueLogicalLinks(name) {
          const links = this.currentModelFeatureSet.logicalElements.filter(elm => elm instanceof OpmRelation).filter(elm => elm.targetLogicalElements[0] !== null).map(elm => {
            const sourceText = elm.sourceLogicalElement.text;
            const targetText = elm.targetLogicalElements[0].text;
            const typeText = linkType[elm.linkType];
            return this.cleanString(sourceText + " <" + typeText + "> " + targetText);
          });
          const c_links = this.comparedModelFeatureSet.logicalElements.filter(elm => elm instanceof OpmRelation).filter(elm => elm.targetLogicalElements[0] !== null).map(elm => {
            const sourceText = elm.sourceLogicalElement.text;
            const targetText = elm.targetLogicalElements[0].text;
            const typeText = linkType[elm.linkType];
            return this.cleanString(sourceText + " <" + typeText + "> " + targetText);
          });
          const uniqueInCurrent = links.filter(elm => c_links.find(c_elm => elm === c_elm) === undefined);
          const uniqueInCompared = c_links.filter(c_elm => links.find(elm => elm === c_elm) === undefined);
          let content = "";
          content += `${name} in Current but not in Compared,${uniqueInCurrent.join(",")}
`;
          content += `${name} in Compared but not in Current,${uniqueInCompared.join(",")}
`;
          return content;
        }
        /**
         * Return a string consists of all the unique instances of visual elements inside all the "equal" opds
         * opds are equal of their names are equal (string equality)
         */
        writeOPDDifferences() {
          const currentCommonOpds = this.currentModelFeatureSet.opds.filter(opd => this.comparedModelFeatureSet.opds.find(opd2 => opd.name === opd2.name)).sort((a, b) => a.name.localeCompare(b.name));
          const comparedCommonOpds = this.comparedModelFeatureSet.opds.filter(opd => this.currentModelFeatureSet.opds.find(opd2 => opd.name === opd2.name)).sort((a, b) => a.name.localeCompare(b.name));
          let output = "";
          for (let i = 0; i < currentCommonOpds.length; ++i) {
            output += this.writeLine(currentCommonOpds[i].name, "", "");
            output += this.writeOpdUniqueVisualElements(currentCommonOpds[i], comparedCommonOpds[i]);
            output += this.writeBlankLine();
          }
          return output;
        }
        /**
         * Creating the output string (csv format) and download it to the target computer
         */
        exportCsv() {
          let output = "";
          output += this.writeLine("", `Current (${this.currentModelFeatureSet.name})`, `Compared (${this.comparedModelFeatureSet.name})`);
          output += this.writeMetaData();
          output += this.writeBlankLine();
          output += this.writeUniqueLogicalInstancesOfEntity("Logical Objects", OpmLogicalObject);
          output += this.writeUniqueLogicalInstancesOfEntity("Logical Processes", OpmLogicalProcess);
          output += this.writeLine("Total differences", this.currentUniqueElementsCount, this.comparedUniqueElementsCount);
          output += this.writeBlankLine();
          output += this.writeOPDDifferences();
          output += this.writeBlankLine();
          output += this.writeUniqueLogicalLinks("Links");
          this.download(this.outputFileName, output);
        }
        /**
         * Download the comparison CSV output to the target computer
         * @param filename
         * @param data
         */
        download(filename, data) {
          const blob = new Blob([data], {
            type: "text/csv"
          });
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
          } else {
            const elem = window.document.createElement("a");
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
          }
        }
        static #_ = (() => this.ɵfac = function OpmModelComparisonService_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || OpmModelComparisonService)(core /* ɵɵinject */.KVO(ModelService), core /* ɵɵinject */.KVO(DatabaseService), core /* ɵɵinject */.KVO(StorageService));
        })();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: OpmModelComparisonService,
          factory: OpmModelComparisonService.ɵfac
        }))();
      }
      return OpmModelComparisonService;
    })();