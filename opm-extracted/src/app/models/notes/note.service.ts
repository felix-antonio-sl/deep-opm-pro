// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/notes/note.service.ts
// Extracted by opm-extracted/tools/extract.mjs

// import {InitRappidService} from "../../rappid-components/services/init-rappid.service";
const defaultNoteTypes = [{
  value: "info",
  icon: "info",
  color: "blue"
}, {
  value: "help",
  icon: "help",
  color: "yellow"
}, {
  value: "favorite",
  icon: "favorite",
  color: "red"
}];
let NoteService = /*#__PURE__*/(() => {
  class NoteService {
    constructor(document, resolver, injector) {
      this.document = document;
      this.resolver = resolver;
      this.injector = injector;
      this.notes = [];
      this.show = true;
      this.initNoteTypes();
    }
    addNote(graph, attributes, noteData, initRappid = null) {
      if (initRappid !== null && this.show === false) {
        (0, validationAlert)("Notes are currently disabled", 5000, "Error");
        return;
      }
      const noteCell = new NoteCell(attributes);
      if (noteData && noteData.id) {
        noteCell.cid = noteData.id;
      }
      if (this.show) {
        graph.addCell(noteCell);
      }
      const elem = this.document.getElementById(`note_${noteCell.cid}`);
      const factory = this.resolver.resolveComponentFactory(NoteComponent);
      const noteComponent = factory.create(this.injector);
      if (noteData) {
        this._createNoteFromData(noteComponent, noteData, noteCell);
      } else {
        this._createNewNote(initRappid, noteComponent, noteCell);
      }
      if (this.show) {
        elem.append(noteComponent.location.nativeElement);
      }
      this.notes.push({
        id: noteCell.cid,
        noteCell,
        noteComponent
      });
      noteCell.on("remove", () => {
        if (noteCell.hidden) {
          return;
        }
        noteComponent.destroy();
        this.notes.splice(this.notes.findIndex(note => note.id === noteCell.cid), 1);
        // TODO: remove note in DB
      });
    }
    _createNewNote(initRappid, component, noteCell) {
      const userDetails = {
        uid: this.user ? this.user.userData.uid : "",
        displayName: this.user ? this.user.userData.Name : "Anonymous"
      };
      const noteData = new NoteData(userDetails);
      const attributes = {
        size: noteCell.get("size"),
        position: noteCell.get("position"),
        id: noteCell.cid
      };
      initRappid.opmModel.currentOpd.addNote({
        ...attributes,
        ...noteData
      });
      this._createNote(component, noteData);
      return noteData;
    }
    _createNoteFromData(component, noteDataJson, noteCell) {
      /*Observable.forkJoin(
        this.userService.getUserDetailsById(noteDataJson.createdBy),
        this.userService.getUserDetailsById(noteDataJson.modifiedBy)
      ).subscribe(([createdByDetails, modifiedByDetails]) => {
        const noteData = NoteData.fromJSON({
          ...noteDataJson,
          createdByName: (<any>createdByDetails).name,
          modifiedByName: (<any>modifiedByDetails).name
        });
        this._createNote(component, noteData);
      });*/
      const name = this.user.userData.Name;
      const noteData = NoteData.fromJSON({
        ...noteDataJson,
        createdByName: name,
        modifiedByName: name
      });
      this._createNote(component, noteData);
    }
    _createNote(component, noteData) {
      component.instance.noteData = noteData;
      component.instance.noteService = this;
      component.changeDetectorRef.detectChanges();
    }
    updateNote(note, updates, noteCell) {
      /*return this.userService.user$.take(1)
        .do(user => {
          const userDetails = {
            uid: user ? user.userData.uid : '',
            displayName: user ? user.userData.Name : 'Anonymous'
          };
          if (note.update(userDetails, updates)) {
            //     this.initRappid.opmModel.currentOpd.updateNote(note, noteCell);
          }
        });*/
    }
    initNoteTypes() {
      NoteType.addTypes(defaultNoteTypes);
    }
    addNotes(graph, notes) {
      notes.forEach(note => this.addNote(graph, note.noteVisualAttributes, note.noteData));
    }
    clearNotes() {
      this.notes.forEach(note => {
        note.noteComponent.destroy();
      });
      this.notes.length = 0;
    }
    hideNotes(graph) {
      this.show = false;
      const list = this.notes.map(note => {
        note.noteCell.hidden = true;
        return note.noteCell;
      });
      graph.removeCells(list);
      this.notes.forEach(note => {
        note.noteCell.hidden = false;
      });
    }
    showNotes(graph) {
      this.show = true;
      this.notes.forEach(note => {
        graph.addCell(note.noteCell);
        this.document.getElementById(`note_${note.noteCell.cid}`).append(note.noteComponent.location.nativeElement);
      });
    }
    static #_ = (() => this.ɵfac = function NoteService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NoteService)(core /* ɵɵinject */.KVO(DOCUMENT), core /* ɵɵinject */.KVO(ComponentFactoryResolver), core /* ɵɵinject */.KVO(Injector));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: NoteService,
      factory: NoteService.ɵfac
    }))();
  }
  return NoteService;
})();
