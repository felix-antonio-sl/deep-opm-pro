// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/create-popup-message/create-popup-message.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const create_popup_message_component_c0 = () => ["update", "create"];
function CreatePopupMessagesComponent_span_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 24);
    core /* ɵɵtext */.EFF(1, "* Subject is required.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function CreatePopupMessagesComponent_span_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 24);
    core /* ɵɵtext */.EFF(1, "* Text is required.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function CreatePopupMessagesComponent_span_22_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 24);
    core /* ɵɵtext */.EFF(1, "* Expiration date is required.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function CreatePopupMessagesComponent_input_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "input", 25);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function CreatePopupMessagesComponent_input_33_Template_input_ngModelChange_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx_r3.hasToConfirm, $event)) {
        ctx_r3.hasToConfirm = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵtwoWayProperty */.R50("ngModel", ctx_r3.hasToConfirm);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r3.mode === "view");
  }
}
function CreatePopupMessagesComponent_span_34_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 9);
    core /* ɵɵtext */.EFF(1, " The modeler needs to confirm the message");
    core /* ɵɵelementEnd */.k0s();
  }
}
function CreatePopupMessagesComponent_button_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 22);
    core /* ɵɵlistener */.bIt("click", function CreatePopupMessagesComponent_button_38_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.action());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.actionText);
  }
}
let CreatePopupMessagesComponent = /*#__PURE__*/(() => {
  class CreatePopupMessagesComponent {
    constructor(data, dialogRef, storage, init) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.storage = storage;
      this.init = init;
      this.title = "";
      this.options = ["Only on next login", "On every login"];
      this.messageAppearance = this.data.message?.messageAppearance || this.options[0];
      this.subject = this.data.message?.subject || "";
      this.messageContent = this.data.message?.content || "";
      this.hasToConfirm = !!this.data.message?.hasToConfirm;
      this.messageId = this.data.message?.id;
      if (this.data.message?.exp_date_as_number) {
        this.exp_date = this.data.message?.exp_date_as_number;
      }
    }
    ngOnInit() {
      this.mode = this.data.mode;
      this.type = this.data.type;
      this.setTitleAndActionButtonText();
    }
    setTitleAndActionButtonText() {
      if (this.mode === "create") {
        this.title = "Create New Message";
        this.actionText = "Publish";
      } else if (this.mode === "view") {
        this.title = "View Message";
        this.actionText = "Close";
      } else {
        this.title = "Update Message";
        this.actionText = "Update";
      }
    }
    action() {
      if (!this.exp_date || this.subject.length === 0 || this.messageContent.trim().length === 0) {
        (0, validationAlert)("One or more of the required fields are empty.");
        return;
      }
      if (this.mode === "create") {
        const message = {
          subject: this.subject,
          content: this.messageContent,
          exp_date: this.exp_date,
          hasToConfirm: this.hasToConfirm,
          messageAppearance: this.messageAppearance
        };
        return this.storage.database.driver.createPopupMessage(this.type, message).then(() => this.dialogRef.close(true));
      } else if (this.mode === "update") {
        const message = {
          id: this.messageId,
          subject: this.subject,
          content: this.messageContent,
          exp_date: this.exp_date,
          hasToConfirm: this.hasToConfirm,
          messageAppearance: this.messageAppearance
        };
        return this.storage.database.driver.updatePopupMessage(this.type, message).then(() => this.dialogRef.close(true));
      }
    }
    close() {
      this.dialogRef.close();
    }
    dateChanged($event) {
      this.exp_date = $event.target.valueAsNumber;
    }
    preview() {
      const message = {
        id: "",
        subject: this.subject,
        content: this.messageContent,
        hasToConfirm: this.hasToConfirm,
        messageAppearance: this.messageAppearance
      };
      this.init.dialogService.openDialog(PopupMessageContentComponent, null, 700, {
        mode: "preview",
        message,
        type: this.type,
        allowMultipleDialogs: true
      });
    }
    static #_ = (() => this.ɵfac = function CreatePopupMessagesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CreatePopupMessagesComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CreatePopupMessagesComponent,
      selectors: [["Create-Popup-Messages"]],
      decls: 41,
      vars: 22,
      consts: [["inputDate", ""], ["id", "popupMsgWholeDiv"], ["id", "header"], [1, "h2"], [2, "display", "table-caption"], ["matInput", "", "id", "subject", "appearance", "fill", "placeholder", "Add a subject", 3, "ngModelChange", "ngModel", "disabled"], ["class", "error", 4, "ngIf"], ["id", "editor"], ["appearance", "fill", 2, "width", "715px"], [2, "color", "#1A3763"], ["id", "popupTextArea", "matInput", "", "rows", "14", "cols", "40", "draggable", "false", 3, "ngModelChange", "ngModel", "disabled"], ["id", "popupExpTimeDiv"], [1, "field"], ["matInput", "", "type", "datetime-local", 3, "change", "valueAsNumber", "disabled"], ["mat-icon-button", "", "matIconSuffix", "", 3, "click"], ["id", "popupAppearDiv"], [3, "ngModelChange", "ngModel", "disabled"], [2, "color", "#1A3763", 3, "value"], ["id", "adminConfirmDiv"], ["type", "checkbox", 3, "ngModel", "disabled", "ngModelChange", 4, "ngIf"], ["style", "color: #1A3763;", 4, "ngIf"], ["id", "footer"], ["mat-button", "", 1, "popMsgBtn", 3, "click"], ["class", "popMsgBtn", "mat-button", "", 3, "click", 4, "ngIf"], [1, "error"], ["type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"]],
      template: function CreatePopupMessagesComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "div", 2)(2, "h2", 3);
          core /* ɵɵtext */.EFF(3);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 4)(5, "input", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function CreatePopupMessagesComponent_Template_input_ngModelChange_5_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.subject, $event)) {
              ctx.subject = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(6, CreatePopupMessagesComponent_span_6_Template, 2, 0, "span", 6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div", 7)(8, "mat-form-field", 8)(9, "mat-label", 9);
          core /* ɵɵtext */.EFF(10, "Write a message");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "textarea", 10);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function CreatePopupMessagesComponent_Template_textarea_ngModelChange_11_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.messageContent, $event)) {
              ctx.messageContent = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(12, CreatePopupMessagesComponent_span_12_Template, 2, 0, "span", 6);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(13, "div", 11)(14, "span", 9);
          core /* ɵɵtext */.EFF(15, "The expiration date of the message: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "mat-form-field", 12)(17, "input", 13, 0);
          core /* ɵɵlistener */.bIt("change", function CreatePopupMessagesComponent_Template_input_change_17_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.dateChanged($event));
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(19, "button", 14);
          core /* ɵɵlistener */.bIt("click", function CreatePopupMessagesComponent_Template_button_click_19_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const inputDate_r2 = core /* ɵɵreference */.sdS(18);
            return core /* ɵɵresetView */.Njj(inputDate_r2.showPicker());
          });
          core /* ɵɵelementStart */.j41(20, "mat-icon");
          core /* ɵɵtext */.EFF(21, "calendar_today");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵtemplate */.DNE(22, CreatePopupMessagesComponent_span_22_Template, 2, 0, "span", 6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "div", 15)(24, "span", 9);
          core /* ɵɵtext */.EFF(25, "The message will appear: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "mat-form-field", 12)(27, "mat-select", 16);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function CreatePopupMessagesComponent_Template_mat_select_ngModelChange_27_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.messageAppearance, $event)) {
              ctx.messageAppearance = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementStart */.j41(28, "mat-option", 17);
          core /* ɵɵtext */.EFF(29);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(30, "mat-option", 17);
          core /* ɵɵtext */.EFF(31);
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(32, "div", 18);
          core /* ɵɵtemplate */.DNE(33, CreatePopupMessagesComponent_input_33_Template, 1, 2, "input", 19)(34, CreatePopupMessagesComponent_span_34_Template, 2, 0, "span", 20);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(35, "div", 21)(36, "button", 22);
          core /* ɵɵlistener */.bIt("click", function CreatePopupMessagesComponent_Template_button_click_36_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.preview());
          });
          core /* ɵɵtext */.EFF(37, "Preview");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(38, CreatePopupMessagesComponent_button_38_Template, 2, 1, "button", 23);
          core /* ɵɵelementStart */.j41(39, "button", 22);
          core /* ɵɵlistener */.bIt("click", function CreatePopupMessagesComponent_Template_button_click_39_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.close());
          });
          core /* ɵɵtext */.EFF(40, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh(ctx.title);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.subject);
          core /* ɵɵproperty */.Y8G("disabled", ctx.mode === "view");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.subject.length === 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵstyleProp */.xc7("font-size", 12);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.messageContent);
          core /* ɵɵproperty */.Y8G("disabled", ctx.mode === "view");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.messageContent.length === 0);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("valueAsNumber", ctx.exp_date)("disabled", ctx.mode === "view");
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.exp_date);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.messageAppearance);
          core /* ɵɵproperty */.Y8G("disabled", ctx.mode === "view");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", ctx.options[0]);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.options[0]);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("value", ctx.options[1]);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate */.JRh(ctx.options[1]);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.type === "system");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.type === "system");
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", core /* ɵɵpureFunction0 */.lJ4(21, create_popup_message_component_c0).includes(ctx.mode));
        }
      },
      dependencies: [NgIf, MatFormField, MatLabel, MatSuffix, MatInput, MatIcon, MatSelect, MatOption, MatButton, MatIconButton, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel],
      styles: ["#footer[_ngcontent-%COMP%]{text-align:center;margin-top:30px}#editor[_ngcontent-%COMP%]{width:calc(100% - 100px);height:375px;margin-top:7px}#popupTextArea[_ngcontent-%COMP%]{background-color:#f6f6f6;color:#1a3763;resize:none;border-radius:6px;padding-left:10px;margin-top:15px}#header[_ngcontent-%COMP%]{text-align:center;color:#1a3763}#subject[_ngcontent-%COMP%]{border:1px solid lightgrey;height:30px;width:400px;border-radius:10px;padding-left:10px;margin-top:15px}.popMsgBtn[_ngcontent-%COMP%]{background-color:#1a3763!important;color:#fff!important;letter-spacing:normal!important;font-weight:400!important;margin-right:20px!important}#adminConfirmDiv[_ngcontent-%COMP%]{margin-top:20px;height:19px}.error[_ngcontent-%COMP%]{color:red;font-size:small}"]
    }))();
  }
  return CreatePopupMessagesComponent;
})();