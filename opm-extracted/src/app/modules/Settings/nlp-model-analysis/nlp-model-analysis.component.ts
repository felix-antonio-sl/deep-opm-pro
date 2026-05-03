// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/nlp-model-analysis/nlp-model-analysis.component.ts
// Extracted by opm-extracted/tools/extract.mjs

// requires (webpack module ids): 47291

function NlpModelAnalysisComponent_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const entry_r2 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(entry_r2[0].charAt(0).toUpperCase() + entry_r2[0].slice(1));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(entry_r2[1]);
  }
}
function NlpModelAnalysisComponent_label_14_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "label", 6);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const type_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", type_r3, ", ");
  }
}
function NlpModelAnalysisComponent_tr_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const word_r4 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(word_r4[0]);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(word_r4[1]);
  }
}
function NlpModelAnalysisComponent_tr_36_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr")(1, "td");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td");
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const word_r5 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(word_r5[0]);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(word_r5[1]);
  }
}
function NlpModelAnalysisComponent_div_57_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵelement */.nrm(1, "span", 19);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const oplSentence_r7 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHTML", oplSentence_r7, core /* ɵɵsanitizeHtml */.npT);
  }
}
global.Buffer = __webpack_require__(47291).Buffer;
let NlpModelAnalysisComponent = /*#__PURE__*/(() => {
  class NlpModelAnalysisComponent {
    constructor(initRappidService) {
      this.initRappidService = initRappidService;
      this.tokenTypes = ["Currency", "Email", "Emoji", "Emoticon", "Hashtag", "Number", "Ordinal", "Punctuation", "Quoted Phrase", "Symbol", "Time", "Mention", "URL", "Word"];

      // Load "its" helper to extract item properties.

      // Load "as" reducer helper to reduce a collection.

      this.nlp = winkNLP(model);
      // Set the needed text to analyze with NLP
      const opl = this.getModelOpl(initRappidService);
      const modelThings = this.getModelThingsNames(initRappidService);
      // NLP Code.
      const doc = this.nlp.readDoc(opl.opltext);
      const nlpModelNames = this.nlp.readDoc(modelThings);
      // Setting up the data for display
      this.content = doc.tokens().out(its.type, as.freqTable);
      // OPL bag of words
      this.bowArr = this.getSortedBow(doc, its, as);
      // Model names bag of words
      this.modelLogicalThingsNames = this.getSortedBow(nlpModelNames, its, as);
      // All OPL for display
      this.opl = opl;
      const uploaderOptions = {
        url: "",
        // Empty URL or specify a dummy value
        disableMultipart: true // Optional: To disable multipart upload
      };
      this.uploader = new FileUploader(uploaderOptions);
    }
    ngOnInit() {}
    /**
     * Using the NLP parameter to extract the text content, and filter it for type 'word' only. Then,
     * creating bag of words with the #its and #as parameters, and finally sorting them in descending order.
     * @param nlpText
     * @param its
     * @param as
     * @private
     */
    getSortedBow(nlpText, its, as) {
      let tokensArray = new Array();
      tokensArray = Object.entries(nlpText.tokens().filter(t => t.out(its.type) === "word").out(its.value, as.bow));
      return tokensArray.sort(function (a, b) {
        return b[1] - a[1];
      });
    }
    /**
     * Using the #initRappidService parameter for getting the full model OPL.
     * Returning it as a text and also HTML.
     * @param initRappidService
     * @private
     */
    getModelOpl(initRappidService) {
      const currentOpd = initRappidService.opmModel.currentOpd;
      let allOpl = "";
      let innerHTML = "";
      const oplDisplay = new Array();
      // Get all existing OPDs in the graph.
      const allOpd = initRappidService.opmModel.opds.filter(o => !o.isHidden);
      for (let i = 0; i < allOpd.length; i++) {
        initRappidService.graphService.renderGraph(allOpd[i], this.initRappidService); // Goes to the next OPD in the allOpd array.
        // Get the cells that contain the OPL sentences of the current OPD.
        const cells = initRappidService.oplService.generateOpl();
        for (let j = 0; j < cells.length; j++) {
          if (cells[j].opl) {
            // Check if the cell contains an OPL sentence.
            // Get the OPL sentence of the cell.
            innerHTML = cells[j].opl;
            oplDisplay.push(innerHTML + "\n"); /// Insert the OPL sentence into the arrOfAllOpl array.
            allOpl += innerHTML.replace(/<[^>]*>?/gm, "") + " ";
          }
        }
      }
      initRappidService.graphService.renderGraph(currentOpd, this.initRappidService); // Goes back to the OPD that the user is editing.
      return {
        opltext: allOpl,
        oplForDisplay: oplDisplay
      };
    }
    /**
     * Retrieving all the model things names: Objects, Processes and States' values
     * @param initRappidService
     * @private
     */
    getModelThingsNames(initRappidService) {
      // Get all existing elements names in the model.
      let modelNames = "";
      initRappidService.opmModel.logicalElements.filter(log => log.constructor.name.includes("Object") || log.constructor.name.includes("Process") || log.constructor.name.includes("State")).forEach(element => modelNames += this.getThingsName(element) + " ");
      return modelNames;
    }
    /**
     * Helper function for #getModelThingsNames function. Checks if the thing is a state to get its value not
     * the actual state constant name.
     * @param element
     * @private
     */
    getThingsName(element) {
      if (element.constructor.name.includes("State")) {
        if (element.getParams().text !== "value") {
          return element.getParams().text;
        }
      } else {
        return element.getName();
      }
      return "";
    }
    /**
     * Loading the text file content and calling the #showSimilarityScore function.
     * @param event
     * @private
     */
    loadRequirementsFile(event) {
      if (event.target.files.length === 0) {
        this.file = null;
        return;
      }
      this.file = event.target.files[0];
      const fileReader = new FileReader();
      const that = this;
      fileReader.onload = e => {
        if (typeof fileReader.result === "string") {
          that.requirementsText = fileReader.result;
        } else {
          that.requirementsText = "";
        }
        that.showSimilarityScore();
      };
      fileReader.readAsText(this.file);
    }
    /**
     * Showing the similarity score of the model OPL and the requirements text file bag of words.
     * This function use the NLP service function 'similarity'.
     * @private
     */
    showSimilarityScore() {
      // Load "its" helper to extract item properties.

      // Load "as" reducer helper to reduce a collection.

      const reqTxt = this.nlp.readDoc(this.requirementsText);
      const nlpModel = this.nlp.readDoc(this.opl.opltext);
      const bowR = reqTxt.tokens().out(its.value, as.bow);
      const bowM = nlpModel.tokens().out(its.value, as.bow);
      const simValue = similarity.bow.cosine(bowR, bowM);
      document.getElementById("compareReqBowResults").innerHTML = "<h3 style=\"position: relative;color: #1A3763\">Similarity Score: " + simValue + "</h3>";
    }
    static #_ = (() => this.ɵfac = function NlpModelAnalysisComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NlpModelAnalysisComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: NlpModelAnalysisComponent,
      selectors: [["opcloud-nlp-model-analysis"]],
      decls: 58,
      vars: 6,
      consts: [["fileInput", ""], ["id", "whole", 2, "left", "10px", "top", "-30px"], [1, "header"], [1, "h2"], [2, "margin-left", "calc(50% - 236px)"], [4, "ngFor", "ngForOf"], [2, "color", "#1A3763"], ["style", "color: #1A3763", 4, "ngFor", "ngForOf"], ["id", "elementsBowTable"], ["id", "bowTable"], [1, "h2", 2, "width", "465px", "margin-left", "calc(50% - 236px)"], ["id", "compareReqBow"], ["mat-mini-fab", "", "color", "primary", 2, "background-color", "#1A3763", "transform", "scale(0.75)", 3, "click", "disabled"], [2, "transform", "scale(0.75)"], ["type", "file", "accept", ".txt", "name", "single", "ng2FileSelect", "", 1, "form-control", 2, "display", "none", 3, "change", "uploader"], [2, "margin-left", "13px", "font-size", "16px", "color", "#1A3763"], [2, "margin-left", "53px", "font-size", "12px", "color", "#1A3763"], ["id", "compareReqBowResults", 2, "margin-left", "53px"], ["id", "nlpModelAnalyizePaper"], [2, "color", "#1A3763", 3, "innerHTML"]],
      template: function NlpModelAnalysisComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "div", 2)(2, "h2", 3);
          core /* ɵɵtext */.EFF(3, "NLP Model Analysis");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 4)(5, "table")(6, "tr")(7, "th");
          core /* ɵɵtext */.EFF(8, "NLP Metric's Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "th");
          core /* ɵɵtext */.EFF(10, "Value");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(11, NlpModelAnalysisComponent_tr_11_Template, 5, 2, "tr", 5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "h3", 6);
          core /* ɵɵtext */.EFF(13, "Types Legend:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(14, NlpModelAnalysisComponent_label_14_Template, 2, 1, "label", 7);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(15, "div", 2)(16, "h2", 3);
          core /* ɵɵtext */.EFF(17, "OPL Bag Of Words Analysis");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(18, "div", 8)(19, "table")(20, "tr")(21, "th");
          core /* ɵɵtext */.EFF(22, "Word");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "th");
          core /* ɵɵtext */.EFF(24, "Count");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(25, NlpModelAnalysisComponent_tr_25_Template, 5, 2, "tr", 5);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(26, "div", 2)(27, "h2", 3);
          core /* ɵɵtext */.EFF(28, "Model Things Names Bag Of Words Analysis");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(29, "div", 9)(30, "table")(31, "tr")(32, "th");
          core /* ɵɵtext */.EFF(33, "Word");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "th");
          core /* ɵɵtext */.EFF(35, "Count");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(36, NlpModelAnalysisComponent_tr_36_Template, 5, 2, "tr", 5);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(37, "div", 2)(38, "h2", 10);
          core /* ɵɵtext */.EFF(39, "Bag Of Words Similarity Score of Model And Requirement File");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(40, "div", 11)(41, "button", 12);
          core /* ɵɵlistener */.bIt("click", function NlpModelAnalysisComponent_Template_button_click_41_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const fileInput_r6 = core /* ɵɵreference */.sdS(45);
            return core /* ɵɵresetView */.Njj(fileInput_r6.click());
          });
          core /* ɵɵelementStart */.j41(42, "mat-icon", 13);
          core /* ɵɵtext */.EFF(43, "attach_file");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(44, "input", 14, 0);
          core /* ɵɵlistener */.bIt("change", function NlpModelAnalysisComponent_Template_input_change_44_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.loadRequirementsFile($event));
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(46, "label", 15);
          core /* ɵɵtext */.EFF(47, "Upload The Requirements Text File");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(48, "br");
          core /* ɵɵelementStart */.j41(49, "label", 16);
          core /* ɵɵtext */.EFF(50, "Please Note: The input file must be a .txt file.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(51, "br")(52, "div", 17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(53, "div", 2)(54, "h2", 3);
          core /* ɵɵtext */.EFF(55, "Model OPL Specification");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(56, "div", 18);
          core /* ɵɵtemplate */.DNE(57, NlpModelAnalysisComponent_div_57_Template, 2, 1, "div", 5);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.content);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.tokenTypes);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.bowArr);
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.modelLogicalThingsNames);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("uploader", ctx.uploader);
          core /* ɵɵadvance */.R7$(13);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.opl.oplForDisplay);
        }
      },
      dependencies: [NgForOf, MatIcon, MatMiniFabButton, FileSelectDirective],
      styles: [".divs[_ngcontent-%COMP%]{position:relative;width:453px;left:50px;top:50px}table[_ngcontent-%COMP%]{width:453px;border:1px solid rgba(73,114,132,.77);line-height:30px;border-radius:6px}th[_ngcontent-%COMP%]{text-align:left;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}tr[_ngcontent-%COMP%]:nth-child(2n){background:#fff}tr[_ngcontent-%COMP%]:nth-child(odd){background:#e4e8ec6e}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:center}#whole[_ngcontent-%COMP%]{display:grid;justify-content:center;width:100%;padding-bottom:40px}#bowTable[_ngcontent-%COMP%], #elementsBowTable[_ngcontent-%COMP%], #compareReqBow[_ngcontent-%COMP%]{height:150px;overflow:auto;margin-top:20px;width:465px;margin-left:calc(50% - 236px)}#nlpModelAnalyizePaper[_ngcontent-%COMP%]{height:250px;overflow:auto;margin-top:20px;padding-right:30px;padding-left:30px}"]
    }))();
  }
  return NlpModelAnalysisComponent;
})();