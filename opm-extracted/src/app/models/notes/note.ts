// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/notes/note.ts
// Extracted by opm-extracted/tools/extract.mjs

class NoteData {
  get createdBy() {
    return this._createdBy;
  }
  get createdDate() {
    return this._createdDate;
  }
  get modifiedBy() {
    return this._modifiedBy;
  }
  get modifiedDate() {
    return this._modifiedDate;
  }
  get content() {
    return this._content;
  }
  get type() {
    return this._type;
  }
  constructor(_createdBy, _createdDate = new Date(), _modifiedBy = _createdBy, _modifiedDate = new Date(), _content = "write your comment here", _type = NoteType.noteTypes[0]) {
    this._createdBy = _createdBy;
    this._createdDate = _createdDate;
    this._modifiedBy = _modifiedBy;
    this._modifiedDate = _modifiedDate;
    this._content = _content;
    this._type = _type;
  }
  static fromJSON(json) {
    const type = NoteType.getType(json.type);
    return new NoteData({
      uid: json.createdBy,
      displayName: json.createdByName
    }, new Date(json.createdDate), {
      uid: json.modifiedBy,
      displayName: json.modifiedByName
    }, new Date(json.modifiedDate), json.content, type || NoteType.noteTypes[0]);
  }
  toJSON() {
    return {
      createdBy: this.createdBy.uid,
      createdDate: this.createdDate.toJSON(),
      modifiedBy: this.modifiedBy.uid,
      modifiedDate: this.modifiedDate.toJSON(),
      content: this.content,
      type: this.type.value,
      createdByName: this.createdBy.displayName,
      modifiedByName: this.modifiedBy.displayName
    };
  }
  update(userDetails, updates) {
    const typeUpdated = this._updateType(updates.type);
    const contentUpdated = this._updateContent(updates.content);
    if (typeUpdated || contentUpdated) {
      this._modifiedBy = userDetails;
      this._modifiedDate = new Date();
    }
  }
  _updateType(type) {
    const foundType = !isNullOrUndefined(type) && NoteType.getType(type);
    if (foundType && foundType !== this._type) {
      this._type = foundType;
      return true;
    } else {
      return false;
    }
  }
  _updateContent(content) {
    if (!isNullOrUndefined(content) && content !== this._content) {
      this._content = content;
      return true;
    }
  }
}
function isNullOrUndefined(item) {
  return item === null || item === undefined;
}