// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/OrgOntology/ontologyApplier.ts
// Extracted by opm-extracted/tools/extract.mjs

class OntologyApplier {
  constructor(text, init, ontology, enforcementLevel) {
    this.text = text;
    this.init = init;
    this.ontology = ontology;
    this.enforcementLevel = enforcementLevel;
  }
  getAllSuggestions() {
    if (this.enforcementLevel === OntologyEnforcementLevel.NONE) {
      return [];
    }
    const toSuggest = [];
    for (const item of this.ontology) {
      const wordsToSave = item.synonyms.filter(word => OPCloudUtils.replaceWords(this.text + "", word, "%") !== this.text);
      wordsToSave.forEach(word => {
        let textToTest = "" + this.text;
        for (const phr of item.phrases) {
          while (textToTest.includes(phr)) {
            textToTest = textToTest.replace(phr, "");
          }
        }
        const condition1 = !toSuggest.find(it => it.wordToReplace.toLowerCase() === word.toLowerCase()); // not already suggested.
        const condition2 = !item.phrases.find(ph => textToTest.includes(ph)); // not already exists in the text as it should be.
        const condition3 = textToTest.toLowerCase().includes(word.toLowerCase()); // after cleaning still has the word that needs to be replaced.
        if (condition1 && condition2 && condition3) {
          toSuggest.push({
            wordToReplace: word,
            replacements: item.phrases
          });
        }
      });
    }
    return toSuggest;
  }
  openOntologySuggestionDialog(phraseToReplace, suggestedReplacements) {
    const that = this;
    // if there is only one option => don't even show popup - just replace.
    if (suggestedReplacements.length === 1 && that.enforcementLevel === OntologyEnforcementLevel.FORCE) {
      return new Promise((resolve, reject) => {
        resolve({
          shouldReplace: true,
          toReplace: phraseToReplace,
          replacement: suggestedReplacements[0]
        });
      });
    }
    return new Promise((resolve, reject) => {
      const dialog = that.init.dialogService.openDialog(OntologySuggestionDialog, 320, 600, {
        allowMultipleDialogs: true,
        text: that.text,
        phraseToReplace: phraseToReplace,
        suggestedReplacements: suggestedReplacements,
        enforcementLevel: that.enforcementLevel
      });
      dialog.afterClosed().subscribe(val => {
        if (val) {
          resolve({
            shouldReplace: true,
            toReplace: phraseToReplace,
            replacement: val
          });
        } else {
          resolve({
            shouldReplace: false
          });
        }
      });
    });
  }
  updateText(value) {
    this.text = value;
  }
}