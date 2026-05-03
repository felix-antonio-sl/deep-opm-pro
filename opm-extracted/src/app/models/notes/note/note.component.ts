// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/notes/note/note.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function NoteComponent_div_25_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-icon", 7);
    core /* ɵɵlistener */.bIt("click", function NoteComponent_div_25_mat_icon_1_Template_mat_icon_click_0_listener() {
      const type_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r3.chooseType(type_r3));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const type_r3 = ctx.$implicit;
    core /* ɵɵstyleProp */.xc7("color", type_r3.color);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", type_r3.icon, " ");
  }
}
function NoteComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 11);
    core /* ɵɵtemplate */.DNE(1, NoteComponent_div_25_mat_icon_1_Template, 2, 3, "mat-icon", 12);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r3.types);
  }
}
function NoteComponent_p_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "p", 13)(1, "button", 14);
    core /* ɵɵlistener */.bIt("click", function NoteComponent_p_32_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.toggleEdit(true));
    });
    core /* ɵɵelementStart */.j41(2, "mat-icon");
    core /* ɵɵtext */.EFF(3, "mode_edit");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r3.noteData.content, " ");
  }
}
function NoteComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 15)(1, "button", 14);
    core /* ɵɵlistener */.bIt("click", function NoteComponent_div_33_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const content_r7 = core /* ɵɵreference */.sdS(5);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.save(content_r7.value));
    });
    core /* ɵɵelementStart */.j41(2, "mat-icon");
    core /* ɵɵtext */.EFF(3, "done");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "textarea", 16, 1);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.noteData.content);
  }
}
let NoteComponent = /*#__PURE__*/(() => {
  class NoteComponent {
    constructor(cd, document) {
      this.cd = cd;
      this.document = document;
      this.types = NoteType.noteTypes;
    }
    ngOnInit() {}
    openTypeSelect() {
      this.selectOpen = true;
      this.cd.detectChanges();
      (0, fromEvent)(this.document, "click").pipe((0, skip)(1),
      // Skip the first click event
      (0, take)(1) // Take only the next click event
      ).subscribe(() => {
        this.selectOpen = false;
        this.cd.detectChanges();
      });
    }
    toggleEdit(mode) {
      this.edit = mode;
      this.cd.detectChanges();
    }
    chooseType(type) {
      /*this.noteService.updateNote(this.noteData, { type }, this.noteCell)
        .subscribe(() => {
          this.cd.detectChanges();
        });*/
    }
    save(content) {
      /*this.toggleEdit(false);
      this.noteService.updateNote(this.noteData, { content }, this.noteCell)
        .subscribe(() => {
          this.cd.detectChanges();
        });*/
    }
    static #_ = (() => this.ɵfac = function NoteComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NoteComponent)(core /* ɵɵdirectiveInject */.rXU(ChangeDetectorRef), core /* ɵɵdirectiveInject */.rXU(DOCUMENT));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: NoteComponent,
      selectors: [["opcloud-note"]],
      inputs: {
        noteData: "noteData",
        noteCell: "noteCell"
      },
      decls: 34,
      vars: 12,
      consts: [["menu", "matMenu"], ["content", ""], [1, "note-card"], ["mat-icon-button", "", 1, "menu", 3, "matMenuTriggerFor"], ["mat-menu-item", ""], ["mat-menu-item", "", "disabled", ""], ["mat-card-avatar", ""], [3, "click"], ["class", "icon-select", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["class", "content-input", 4, "ngIf"], [1, "icon-select"], [3, "color", "click", 4, "ngFor", "ngForOf"], [1, "content"], ["mat-mini-fab", "", 1, "edit-button", 3, "click"], [1, "content-input"], ["matInput", "", "mdTextareaAutosize", "", "mdAutosizeMinRows", "2", "mdAutosizeMaxRows", "5"]],
      template: function NoteComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "mat-card", 2)(1, "mat-card-header")(2, "button", 3)(3, "mat-icon");
          core /* ɵɵtext */.EFF(4, "more_vert");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(5, "mat-menu", null, 0)(7, "button", 4)(8, "mat-icon");
          core /* ɵɵtext */.EFF(9, "dialpad");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "span");
          core /* ɵɵtext */.EFF(11, "Redial");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(12, "button", 5)(13, "mat-icon");
          core /* ɵɵtext */.EFF(14, "voicemail");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(15, "span");
          core /* ɵɵtext */.EFF(16, "Check voicemail");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(17, "button", 4)(18, "mat-icon");
          core /* ɵɵtext */.EFF(19, "notifications_off");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "span");
          core /* ɵɵtext */.EFF(21, "Disable alerts");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(22, "div", 6)(23, "mat-icon", 7);
          core /* ɵɵlistener */.bIt("click", function NoteComponent_Template_mat_icon_click_23_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.openTypeSelect());
          });
          core /* ɵɵtext */.EFF(24);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(25, NoteComponent_div_25_Template, 2, 1, "div", 8);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "mat-card-title");
          core /* ɵɵtext */.EFF(27);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "mat-card-subtitle");
          core /* ɵɵtext */.EFF(29);
          core /* ɵɵpipe */.nI1(30, "date");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(31, "mat-card-content");
          core /* ɵɵtemplate */.DNE(32, NoteComponent_p_32_Template, 5, 1, "p", 9)(33, NoteComponent_div_33_Template, 7, 1, "div", 10);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          const menu_r8 = core /* ɵɵreference */.sdS(6);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("matMenuTriggerFor", menu_r8);
          core /* ɵɵadvance */.R7$(21);
          core /* ɵɵstyleProp */.xc7("color", ctx.noteData.type.color);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.noteData.type.icon);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectOpen);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.noteData.createdBy.displayName);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(30, 9, ctx.noteData.createdDate, "dd.MM.yy hh:mm"));
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.edit);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.edit);
        }
      },
      dependencies: [NgForOf, NgIf, MatInput, MatMenu, MatMenuItem, MatMenuTrigger, MatIcon, MatIconButton, MatMiniFabButton, MatCard, MatCardAvatar, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle, DatePipe],
      styles: ["[_nghost-%COMP%]{position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.note-card[_ngcontent-%COMP%]{box-sizing:border-box;padding:4px;border-radius:4px;border:1px solid blue;background:#0000ff54;height:100%}.note-card[_ngcontent-%COMP%]   .mat-mdc-card-header-text[_ngcontent-%COMP%]{margin:initial}.note-card[_ngcontent-%COMP%]   mat-mdc-card-title[_ngcontent-%COMP%], .note-card[_ngcontent-%COMP%]   mat-mdc-card-subtitle[_ngcontent-%COMP%]{margin:initial}.note-type[_ngcontent-%COMP%]{width:100%;border-radius:4px;padding:4px;box-sizing:border-box}.icon-select[_ngcontent-%COMP%]{border:black 1px solid;width:min-content;position:absolute;display:inline-table;background:#0ff;border-radius:4px;z-index:2}.icon-select[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{cursor:pointer}select[_ngcontent-%COMP%], input[_ngcontent-%COMP%], button[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%], mat-icon[_ngcontent-%COMP%], menu[_ngcontent-%COMP%], .content[_ngcontent-%COMP%], .icon-select[_ngcontent-%COMP%], [_ngcontent-%COMP%]::-webkit-scrollbar{pointer-events:auto}p[_ngcontent-%COMP%]{overflow:auto}.content[_ngcontent-%COMP%]{cursor:text;-webkit-user-select:text;user-select:text;min-height:40px}.content[_ngcontent-%COMP%], .content-input[_ngcontent-%COMP%]{position:relative}.content[_ngcontent-%COMP%]   .edit-button[_ngcontent-%COMP%], .content-input[_ngcontent-%COMP%]   .edit-button[_ngcontent-%COMP%]{display:none;position:fixed;right:0}.content[_ngcontent-%COMP%]:hover   .edit-button[_ngcontent-%COMP%], .content-input[_ngcontent-%COMP%]:hover   .edit-button[_ngcontent-%COMP%]{display:initial}.content[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], .content-input[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{font-size:inherit;width:95%}.menu[_ngcontent-%COMP%]{position:absolute;right:0;width:initial;height:initial;line-height:initial}"]
    }))();
  }
  return NoteComponent;
})();
