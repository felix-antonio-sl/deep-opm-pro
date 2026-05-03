// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/notes/note-type.ts
// Extracted by opm-extracted/tools/extract.mjs

let NoteType = /*#__PURE__*/(() => {
  class NoteType {
    static #_ = (() => this.noteTypes = [])();
    static getType(type) {
      const foundType = typeof type === "string" ? NoteType.noteTypes.find(noteType => noteType.value === type) : NoteType.noteTypes.find(noteType => noteType.value === type.value);
      if (!type) {
        console.error(`the specified note type ${type} is not defined in the model system.`);
      }
      return foundType;
    }
    get value() {
      return this._type.value;
    }
    get icon() {
      return this._type.icon;
    }
    get color() {
      return this._type.color;
    }
    constructor(_type) {
      this._type = _type;
      NoteType.noteTypes.push(this);
    }
    static addTypes(typeDefs) {
      typeDefs.forEach(typeDef => new NoteType(typeDef));
    }
  }
  return NoteType;
})();
