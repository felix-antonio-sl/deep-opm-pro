// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/popup-message-content/popup-message-content.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function PopupMessageContentComponent_span_6_span_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 12);
    core /* ɵɵtext */.EFF(1, " * Your confirmation is required.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function PopupMessageContentComponent_span_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span")(1, "input", 9);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function PopupMessageContentComponent_span_6_Template_input_ngModelChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.confirmation, $event)) {
        ctx_r1.confirmation = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(2, "span", 10);
    core /* ɵɵlistener */.bIt("click", function PopupMessageContentComponent_span_6_Template_span_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.confirmation = !ctx_r1.confirmation);
    });
    core /* ɵɵtext */.EFF(3, "I confirm to the written above");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(4, PopupMessageContentComponent_span_6_span_4_Template, 2, 0, "span", 11);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.confirmation);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.showConfirmationRequiredWarning && ctx_r1.confirmation === false);
  }
}
function PopupMessageContentComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵelement */.nrm(1, "br");
    core /* ɵɵelementStart */.j41(2, "input", 9);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function PopupMessageContentComponent_span_7_Template_input_ngModelChange_2_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r1.remindMeLater, $event)) {
        ctx_r1.remindMeLater = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span", 10);
    core /* ɵɵlistener */.bIt("click", function PopupMessageContentComponent_span_7_Template_span_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.remindMeLater = !ctx_r1.remindMeLater);
    });
    core /* ɵɵtext */.EFF(4, "Remind me later");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r1.remindMeLater);
  }
}
function PopupMessageContentComponent_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 13);
    core /* ɵɵlistener */.bIt("click", function PopupMessageContentComponent_button_11_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.signOut());
    });
    core /* ɵɵtext */.EFF(1, "Sign Out");
    core /* ɵɵelementEnd */.k0s();
  }
}
let PopupMessageContentComponent = /*#__PURE__*/(() => {
  class PopupMessageContentComponent {
    constructor(database, data, dialogRef, _sanitizer) {
      this.database = database;
      this.data = data;
      this.dialogRef = dialogRef;
      this._sanitizer = _sanitizer;
      this.showConfirmationRequiredWarning = false;
      this.type = data.type;
      this.message = data.message;
      this.remindMeLater = true;
      this.confirmation = false;
      this.mode = data.mode || "showToUser";
      this.sanitizeHtml();
    }
    ngOnInit() {
      if (this.mode !== "preview") {
        this.markMessageAsSeen();
      }
      if (!this.message.hasToConfirm) {
        return this.dialogRef.disableClose = false;
      }
    }
    sanitizeHtml() {
      this.message.content = this._sanitizer.bypassSecurityTrustHtml(this.message.content);
    }
    markMessageAsSeen() {
      if (this.mode !== "preview") {
        this.database.driver.markPopupMessageAsSeen(this.type, this.message.id);
      }
    }
    markMessageAsConfirmed() {
      if (this.mode !== "preview") {
        if (!this.confirmation && this.message.hasToConfirm) {
          this.showConfirmationRequiredWarning = true;
          return;
        }
        return this.database.driver.markMessageAsConfirmed(this.type, this.message.id, this.remindMeLater).then(() => this.dialogRef.close());
      } else {
        this.dialogRef.close();
      }
    }
    signOut() {
      this.dialogRef.close("signout");
    }
    getAcceptButtonText() {
      if (!this.message.hasToConfirm) {
        return "Accept";
      }
      return "Ok";
    }
    static #_ = (() => this.ɵfac = function PopupMessageContentComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PopupMessageContentComponent)(core /* ɵɵdirectiveInject */.rXU(DatabaseService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(DomSanitizer));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: PopupMessageContentComponent,
      selectors: [["opcloud-popup-message-content"]],
      decls: 12,
      vars: 6,
      consts: [["id", "whole"], ["id", "header"], [1, "h2"], ["id", "content", 3, "innerHTML"], ["id", "checkboxes"], [4, "ngIf"], ["id", "actions"], ["mat-button", "", 1, "popMsgBtn", 3, "click"], ["class", "popMsgBtn", "mat-button", "", "style", "margin-left: -50%;", 3, "click", 4, "ngIf"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [3, "click"], ["style", "margin-left: 5px; color: red; font-size: 12px;", 4, "ngIf"], [2, "margin-left", "5px", "color", "red", "font-size", "12px"], ["mat-button", "", 1, "popMsgBtn", 2, "margin-left", "-50%", 3, "click"]],
      template: function PopupMessageContentComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(4, "div", 3);
          core /* ɵɵelementStart */.j41(5, "div", 4);
          core /* ɵɵtemplate */.DNE(6, PopupMessageContentComponent_span_6_Template, 5, 2, "span", 5)(7, PopupMessageContentComponent_span_7_Template, 5, 1, "span", 5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "div", 6)(9, "button", 7);
          core /* ɵɵlistener */.bIt("click", function PopupMessageContentComponent_Template_button_click_9_listener() {
            return ctx.markMessageAsConfirmed();
          });
          core /* ɵɵtext */.EFF(10);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(11, PopupMessageContentComponent_button_11_Template, 2, 0, "button", 8);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.message.subject || "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("innerHTML", ctx.message.content, core /* ɵɵsanitizeHtml */.npT);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.message.hasToConfirm);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.message.messageAppearance !== "On every login");
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.getAcceptButtonText());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.showConfirmationRequiredWarning && ctx.confirmation === false);
        }
      },
      dependencies: [NgIf, MatButton, CheckboxControlValueAccessor, NgControlStatus, NgModel],
      styles: ["#header[_ngcontent-%COMP%]{text-align:center;color:#1a3763}#content[_ngcontent-%COMP%]{width:100%;max-height:450px;overflow:auto;margin-top:30px}#actions[_ngcontent-%COMP%]{text-align:center;margin-top:30px;display:flex;justify-content:space-around}.popMsgBtn[_ngcontent-%COMP%]{background-color:#1a3763!important;color:#fff!important;letter-spacing:normal!important;font-weight:400!important}#checkboxes[_ngcontent-%COMP%]{margin-top:30px}"]
    }))();
  }
  return PopupMessageContentComponent;
})();