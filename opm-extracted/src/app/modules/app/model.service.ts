// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/model.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ModelService = /*#__PURE__*/(() => {
  class ModelService {
    get displayName() {
      return this._displayName;
    }
    constructor(graph, tree, opl) {
      this.graph = graph;
      this.tree = tree;
      this.opl = opl;
      this.modelObject = new ModelObject();
      this._displayName = "Model (Not Saved)";
      this.modelChange_ = new ReplaySubject(1);
      this.modelChange$ = this.modelChange_.asObservable();
      this.reset();
      this.graph.modelObject = this.modelObject;
      this.opl.model = this;
    }
    setModelObjectProp(id, name, path) {
      this.modelObject.id = id;
      this.modelObject.name = name;
      this.modelObject.path = path;
    }
    set(model, displayName, id, opt) {
      const options = opt || {};
      this.model = options.alternativeOpmModel || new OpmModel();
      this.model.setOplService(this.opl);
      this.model.validation = this.opl.getValidationSettings();
      if (!options.alternativeOpmModel) {
        this.model.fromJson(model);
      }
      this._displayName = displayName;
      this.setModelObjectProp(id, model.name, options.path);
      if (options.opd) {
        const sd = this.model.opds.find(opd => opd.name.toUpperCase() === options.opd.toUpperCase() && !opd.isHidden);
        if (sd) {
          this.model.currentOpd = sd;
        }
      } else if (options.opd_id) {
        const sd = this.model.currentOpd = this.model.opds.find(opd => opd.id === options.opd_id && !opd.isHidden);
        if (sd) {
          this.model.currentOpd = sd;
        } else {
          this.model.currentOpd = this.model.opds.find(opd => opd.id === "SD" && !opd.isHidden) || this.model.opds[0];
        }
      } else {
        this.model.currentOpd = this.model.opds.find(opd => opd.id === "SD" && !opd.isHidden) || this.model.opds[0];
      }
      this.modelObject.modelData = model;
      this.graph.renderGraph(this.model.currentOpd, this.tree.initRappid);
      this.tree.treeView.treeModel.expandAll();
      this.tree.init(this.model);
      if (this.model.opds.length < 30) {
        this.tree.expandAllNodes();
      }
      this.tree.initRappid.resetGeneratedSelectedConfigurations();
      this.tree.initRappid.isLoadingModel = false;
      // show the chat icon only when a model was saved or loaded(i.e model is saved to DB and have an Id)
      this.getInitRappid().showChatIcon = !!this.modelObject.id;
      if (!this.modelObject.id) {
        this.getInitRappid().showChatPanel = false;
      }
      this.modelChange_.next("change");
    }
    getCurrentOpdName() {
      return this.model.currentOpd.name;
    }
    reset() {
      this.model = new OpmModel();
      this.model.setOplService(this.opl);
      this.model.validation = this.opl.getValidationSettings();
      this.modelObject.name = undefined;
      this.modelObject.path = undefined;
      this.tree.init(this.model);
    }
    renderModel() {
      this.graph.renderGraph(this.model.opds[0], this.tree.initRappid);
    }
    newModel() {
      this.reset();
      this.renderModel();
      this.modelChange_.next("change");
    }
    setName(name) {
      this.model.name = name;
      this._displayName = name;
    }
    setId(id) {
      this.modelObject.id = id;
    }
    // Should be moved
    getOPL() {
      const clean = function (htmlText) {
        let pos = htmlText.indexOf("<");
        while (pos >= 0) {
          const pre = htmlText.substr(0, pos);
          const post = htmlText.substr(pos);
          const pos2 = post.indexOf(">");
          if (pos2 < 0) {
            return htmlText;
          }
          htmlText = pre + post.substr(pos2 + 1);
          pos = htmlText.indexOf("<");
        }
        htmlText = htmlText.trim().replace("\n", " ");
        if (htmlText.startsWith(",")) {
          htmlText = htmlText.substr(1);
        }
        if (htmlText.endsWith(".")) {
          htmlText += "\n";
        }
        // alert(`clean(${origParam})=
        // [${htmlText}]`);
        return htmlText;
      };
      const currentOpd = this.model.currentOpd;
      const allOpd = this.model.opds;
      let opl = "";
      for (let i = 0; i < allOpd.length; i++) {
        this.graph.renderGraph(allOpd[i], this.tree.initRappid);
        const cells = this.opl.generateOpl();
        for (let j = 0; j < cells.length; j++) {
          if (cells[j].opl) {
            opl = opl.concat(clean(cells[j].opl));
          }
        }
      }
      this.graph.renderGraph(currentOpd, this.tree.initRappid);
      const ret = opl.trim().replace(new RegExp(String.fromCharCode(160), "g"), String.fromCharCode(32)).replace(new RegExp(String.fromCharCode(10), "g"), String.fromCharCode(32));
      return ret;
      /*
           const oplsTextOnly = new Array();
      // Get all existing OPDs in the graph.
      const allOpd = this.model.opds;
      // This loop goes over all OPDs and inserts the OPL sentences to the arrays.
      for (let i = 0; i < allOpd.length; i++) {
        const graph = this.graph.renderGraphSilent(allOpd[i]); // Goes to the next OPD in the allOpd array.
        // Get the cells that contain the OPL sentences of the current OPD.
        const cells = this.opl.generateOpl(); // YANG's function
        // This loop goes over all of the cells and inserts the OPL sentences to the arrays.
        for (let j = 0; j < cells.length; j++) {
          if (cells[j].opl) { // Check if the cell contains an OPL sentence.
            // Get the OPL sentence of the cell.
            const oplPhrase = clean(cells[j].opl);
            if (!oplsTextOnly.includes(oplPhrase)) {
              oplsTextOnly.push(oplPhrase);
            }
          }
        }
      }
      let text = '';
      for (let i  = 0; i < oplsTextOnly.length; i++)
        text += oplsTextOnly[i];
      return text;
      //return 'the best opl';*/
    }
    getInitRappid() {
      return this.tree.initRappid;
    }
    createSubModel(model, visuals, contextService, title) {
      return (0, default)(function* () {
        const subCreator = new SubModelCreator(model, contextService);
        return subCreator.createSubModel(visuals, title).then(newModelId => {
          subCreator.protectElementsFromBeingRefined(newModelId, visuals.map(v => v.logicalElement));
          subCreator.protectElementsFromBeingChanged(newModelId, visuals);
          return true;
        }).catch(err => false);
      })();
    }
    lazyLoadSubModel(model, sharedOpd, subModelId, rawSubModel) {
      const subCreator = new SubModelCreator(model);
      const rawSubModelAfterStereotypesIdsSwitching = subCreator.switchStereotypesIds(rawSubModel);
      const subModelEditDate = rawSubModel.editBy.date ? String(rawSubModel.editBy.date) : null;
      const subModel = new OpmModel();
      subModel.fromJson(rawSubModelAfterStereotypesIdsSwitching);
      subCreator.lazyLoadSubModel(subModelId, subModel, sharedOpd, subModelEditDate);
    }
    static #_ = (() => this.ɵfac = function ModelService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ModelService)(core /* ɵɵinject */.KVO(GraphService), core /* ɵɵinject */.KVO(TreeViewService), core /* ɵɵinject */.KVO(OplService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ModelService,
      factory: ModelService.ɵfac
    }))();
  }
  return ModelService;
})();
