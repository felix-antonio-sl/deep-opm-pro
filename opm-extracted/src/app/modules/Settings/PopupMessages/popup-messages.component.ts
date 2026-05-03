// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/PopupMessages/popup-messages.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function PopupMessagesComponent_th_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "th", 16);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_th_13_Template_th_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.columnClick("confirms"));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵstyleMap */.Aen(ctx_r1.sortColumn === "confirms" ? "background-color: rgb(49 100 179);" : "");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r1.getArrowSign("confirms"), "Confirms");
  }
}
function PopupMessagesComponent_tr_22_td_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "td", 25);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_tr_22_td_3_Template_td_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const msg_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openViewsOrConfirmsDataDialog(msg_r4, "confirms"));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const msg_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getSizeOfDict(msg_r4.confirms));
  }
}
function PopupMessagesComponent_tr_22_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 26)(1, "span", 27);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_tr_22_div_13_Template_span_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const msg_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.previewMessage(msg_r4));
    });
    core /* ɵɵtext */.EFF(2, "Preview");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "span", 27);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_tr_22_div_13_Template_span_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const msg_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.updateMessage(msg_r4));
    });
    core /* ɵɵtext */.EFF(4, "View/Update");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "span", 27);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_tr_22_div_13_Template_span_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const msg_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.duplicateMessage(msg_r4));
    });
    core /* ɵɵtext */.EFF(6, "Duplicate");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "span", 28);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_tr_22_div_13_Template_span_click_7_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const msg_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.deleteMessage(msg_r4));
    });
    core /* ɵɵtext */.EFF(8, "Delete");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function PopupMessagesComponent_tr_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr", 17);
    core /* ɵɵlistener */.bIt("mouseenter", function PopupMessagesComponent_tr_22_Template_tr_mouseenter_0_listener() {
      const msg_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.messageMouseEnter(msg_r4));
    })("mouseleave", function PopupMessagesComponent_tr_22_Template_tr_mouseleave_0_listener() {
      const msg_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.messageMouseLeave(msg_r4));
    });
    core /* ɵɵelementStart */.j41(1, "td", 18);
    core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_tr_22_Template_td_click_1_listener() {
      const msg_r4 = core /* ɵɵrestoreView */.eBV(_r3).$implicit;
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.openViewsOrConfirmsDataDialog(msg_r4, "views"));
    });
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, PopupMessagesComponent_tr_22_td_3_Template, 2, 1, "td", 19);
    core /* ɵɵelementStart */.j41(4, "td", 20);
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "td", 21);
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "td", 22);
    core /* ɵɵtext */.EFF(9);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(10, "td", 23)(11, "span");
    core /* ɵɵtext */.EFF(12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(13, PopupMessagesComponent_tr_22_div_13_Template, 9, 0, "div", 24);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const msg_r4 = ctx.$implicit;
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r1.getSizeOfDict(msg_r4.views));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r1.type === "system");
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(msg_r4.author);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(msg_r4.publish_date);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(msg_r4.exp_date);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(msg_r4.subject);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", msg_r4.showActions);
  }
}
let PopupMessagesComponent = /*#__PURE__*/(() => {
  class PopupMessagesComponent {
    constructor(init, route, storage) {
      this.init = init;
      this.route = route;
      this.storage = storage;
      this.timezoneOffset = new Date().getTimezoneOffset() * 60000;
      this.messages = [];
      this.searchString = "";
      this.sortColumn = "publish_date";
      this.sortDirection = "down";
    }
    ngOnInit() {
      var _this = this;
      return (0, default)(function* () {
        _this.type = _this.route.snapshot.data.type;
        _this.refreshMessages();
      })();
    }
    refreshMessages() {
      this.storage.database.driver.getAllPopupMessages(this.type).then(messages => {
        this.messages = messages;
        this.formatMessages();
        this.messagesToDisplay = this.messagesToDisplay.filter(msg => msg.subject.includes(this.searchString));
        this.sortMessages();
      });
    }
    columnClick(colName) {
      this.toggleSortDirection();
      this.sortColumn = colName;
      this.sortMessages();
    }
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === "up" ? "down" : "up";
    }
    sortMessages() {
      this.messagesToDisplay = this.messagesToDisplay.sort((a, b) => {
        const sign = this.sortDirection === "up" ? -1 : 1;
        if (this.sortColumn === "views") {
          if (a.views === b.views) {
            return 0;
          }
          if (a.views > b.views) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (this.sortColumn === "confirms") {
          if (a.confirms === b.confirms) {
            return 0;
          }
          if (a.confirms > b.confirms) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (this.sortColumn === "author") {
          if (a.author === b.author) {
            return 0;
          }
          if (a.author > b.author) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (this.sortColumn === "subject") {
          if (a.subject > b.subject) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (this.sortColumn === "publish_date") {
          if (a.publish_date > b.publish_date) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (this.sortColumn === "exp_date") {
          if (a.exp_date_as_number > b.exp_date_as_number) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        }
      });
    }
    formatMessages() {
      this.messagesToDisplay = this.messages.map(msg => {
        return {
          id: msg.id,
          views: msg.views,
          confirms: msg.confirms,
          author: msg.author,
          exp_date: new Date(msg.exp_date + this.timezoneOffset).toLocaleString(),
          exp_date_as_number: msg.exp_date,
          publish_date: new Date(msg.publish_date).toLocaleString(),
          subject: msg.subject,
          content: msg.content,
          messageAppearance: msg.messageAppearance,
          hasToConfirm: msg.hasToConfirm,
          showActions: false
        };
      });
    }
    onInputChange($event) {
      this.searchString = $event.target.value.trim();
      this.formatMessages();
      this.messagesToDisplay = this.messagesToDisplay.filter(msg => msg.subject.includes(this.searchString));
    }
    createNewMessage() {
      this.init.dialogService.openDialog(CreatePopupMessagesComponent, 835, 800, {
        mode: "create",
        type: this.type
      }).afterClosed().toPromise().then(() => OPCloudUtils.waitXms(500)).then(() => this.refreshMessages());
    }
    viewMessage(msg) {
      this.init.dialogService.openDialog(CreatePopupMessagesComponent, 835, 800, {
        mode: "view",
        message: msg,
        type: this.type
      });
    }
    previewMessage(msg) {
      const message = {
        id: msg.id,
        subject: msg.subject,
        hasToConfirm: msg.hasToConfirm,
        content: msg.content,
        messageAppearance: msg.messageAppearance
      };
      this.init.dialogService.openDialog(PopupMessageContentComponent, null, 700, {
        mode: "preview",
        message,
        type: this.type
      });
    }
    updateMessage(msg) {
      this.init.dialogService.openDialog(CreatePopupMessagesComponent, 835, 800, {
        mode: "update",
        message: msg,
        type: this.type
      }).afterClosed().toPromise().then(() => OPCloudUtils.waitXms(500)).then(() => this.refreshMessages());
    }
    duplicateMessage(msg) {
      this.init.dialogService.openDialog(CreatePopupMessagesComponent, 835, 800, {
        mode: "create",
        message: msg,
        type: this.type
      }).afterClosed().toPromise().then(() => OPCloudUtils.waitXms(500)).then(() => this.refreshMessages());
    }
    messageMouseEnter(msg) {
      msg.showActions = true;
    }
    messageMouseLeave(msg) {
      msg.showActions = false;
    }
    deleteMessage(msg) {
      var _this2 = this;
      return (0, default)(function* () {
        const canClose = yield _this2.init.dialogService.openDialog(ConfirmDialogDialogComponent, 180, 350, {
          message: `Pay attention, "${msg.subject}" will be removed permanently.`,
          okName: "Delete",
          okColor: "#ff0000",
          centerText: true,
          closeName: "Cancel"
        }).afterClosed().toPromise();
        if (!canClose) {
          return;
        }
        _this2.storage.database.driver.removePopupMessage(_this2.type, msg.id).then(() => {
          (0, validationAlert)("The message was removed successfully.");
          _this2.messages = _this2.messages.filter(m => m.id !== msg.id);
          _this2.messagesToDisplay = _this2.messagesToDisplay.filter(m => m.id !== msg.id);
        }).catch(err => {
          (0, validationAlert)("There was an error while trying to remove this message. Please try again.", 3500, "error");
        });
      })();
    }
    getArrowSign(colName) {
      if (colName === this.sortColumn) {
        if (this.sortDirection === "up") {
          return "↑ ";
        } else {
          return "↓ ";
        }
      }
      return "";
    }
    getSizeOfDict(dict) {
      return Object.keys(dict || {}).length;
    }
    openViewsOrConfirmsDataDialog(msg, type) {
      this.init.dialogService.openDialog(PopupViewsOrConfirmsComponent, null, 500, {
        type,
        message: msg,
        mode: this.type
      });
    }
    static #_ = (() => this.ɵfac = function PopupMessagesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PopupMessagesComponent)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ActivatedRoute), core /* ɵɵdirectiveInject */.rXU(StorageService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: PopupMessagesComponent,
      selectors: [["popup-messages"]],
      decls: 23,
      vars: 17,
      consts: [["id", "whole"], [1, "header"], [1, "h2"], ["id", "mainPart"], ["id", "searchAndCreate"], ["id", "searchField", "placeholder", "Search By Subject", 3, "keyup"], ["id", "createMsg", "mat-button", "", 3, "click"], ["id", "table"], ["id", "tableHeader"], ["width", "10%", "id", "viewsHeader", 1, "tableViews", 3, "click"], ["width", "10%", "class", "tableConfirms", 3, "style", "click", 4, "ngIf"], ["width", "15%", 1, "tableAuthor", 3, "click"], ["width", "15%", 1, "tablePublishDate", 3, "click"], ["width", "15%", 1, "tableExpDate", 3, "click"], ["width", "45%", "id", "subjectHeader", 1, "tableSubject", 3, "click"], ["class", "tableRow", 3, "mouseenter", "mouseleave", 4, "ngFor", "ngForOf"], ["width", "10%", 1, "tableConfirms", 3, "click"], [1, "tableRow", 3, "mouseenter", "mouseleave"], ["width", "10%", "matTooltip", "Click to see who viewed the message", 1, "tableViews", 3, "click"], ["width", "10%", "class", "tableConfirms", "matTooltip", "Click to see who confirmed the message", 3, "click", 4, "ngIf"], ["width", "15%", 1, "tableAuthor"], ["width", "15%", 1, "tablePublishDate"], ["width", "15%", 1, "tableExpDate"], ["width", "45%", 1, "tableSubject"], ["class", "msgActions", 4, "ngIf"], ["width", "10%", "matTooltip", "Click to see who confirmed the message", 1, "tableConfirms", 3, "click"], [1, "msgActions"], [1, "action", 3, "click"], [1, "action", "deleteAction", 3, "click"]],
      template: function PopupMessagesComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1)(2, "h2", 2);
          core /* ɵɵtext */.EFF(3, "Messages For Users Management");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "div", 4)(6, "input", 5);
          core /* ɵɵlistener */.bIt("keyup", function PopupMessagesComponent_Template_input_keyup_6_listener($event) {
            return ctx.onInputChange($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "button", 6);
          core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_Template_button_click_7_listener() {
            return ctx.createNewMessage();
          });
          core /* ɵɵtext */.EFF(8, "Create New Message");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(9, "table", 7)(10, "tr", 8)(11, "th", 9);
          core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_Template_th_click_11_listener() {
            return ctx.columnClick("views");
          });
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(13, PopupMessagesComponent_th_13_Template, 2, 3, "th", 10);
          core /* ɵɵelementStart */.j41(14, "th", 11);
          core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_Template_th_click_14_listener() {
            return ctx.columnClick("author");
          });
          core /* ɵɵtext */.EFF(15);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "th", 12);
          core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_Template_th_click_16_listener() {
            return ctx.columnClick("publish_date");
          });
          core /* ɵɵtext */.EFF(17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "th", 13);
          core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_Template_th_click_18_listener() {
            return ctx.columnClick("exp_date");
          });
          core /* ɵɵtext */.EFF(19);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "th", 14);
          core /* ɵɵlistener */.bIt("click", function PopupMessagesComponent_Template_th_click_20_listener() {
            return ctx.columnClick("subject");
          });
          core /* ɵɵtext */.EFF(21);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(22, PopupMessagesComponent_tr_22_Template, 14, 7, "tr", 15);
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵstyleMap */.Aen(ctx.sortColumn === "views" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getArrowSign("views"), "Views");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.type === "system");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.sortColumn === "author" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getArrowSign("author"), "Author");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.sortColumn === "publish_date" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getArrowSign("publish_date"), "Publish Date");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.sortColumn === "exp_date" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getArrowSign("exp_date"), "Expiration Date");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.sortColumn === "subject" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getArrowSign("subject"), "Subject");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.messagesToDisplay);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatButton],
      styles: ["#whole[_ngcontent-%COMP%]{text-align:center}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:center;display:inline-flex;align-items:center;margin-top:20px}#searchAndCreate[_ngcontent-%COMP%]{display:inline-block}#createMsg[_ngcontent-%COMP%]{border:1px solid #1a3763;margin-left:80px;background-color:#1a3763;color:#fff;letter-spacing:normal;font-weight:400!important}#subjectHeader[_ngcontent-%COMP%]{border-radius:0 8px 0 0}#viewsHeader[_ngcontent-%COMP%]{border-radius:8px 0 0}.tableRow[_ngcontent-%COMP%]{width:100%}#table[_ngcontent-%COMP%]{width:calc(100% - 40px);margin-left:20px;margin-top:30px;border-collapse:collapse;padding-bottom:30px}tr[_ngcontent-%COMP%]:nth-child(odd){background-color:#f8f8f8}tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#dce9ff}th[_ngcontent-%COMP%]{background-color:#5989d2;color:#fff}.msgActions[_ngcontent-%COMP%]{padding:8px}.action[_ngcontent-%COMP%]{padding:13px}.action[_ngcontent-%COMP%]:hover{background-color:#0000000d;border-radius:4px}.deleteAction[_ngcontent-%COMP%]{color:red}#tableHeader[_ngcontent-%COMP%]{height:35px}input[_ngcontent-%COMP%]{height:20px;width:425px}#mainPart[_ngcontent-%COMP%]{padding-bottom:81px}"]
    }))();
  }
  return PopupMessagesComponent;
})();