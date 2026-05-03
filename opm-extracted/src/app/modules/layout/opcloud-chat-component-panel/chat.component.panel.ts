// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/opcloud-chat-component-panel/chat.component.panel.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = ["messageInput"];
const c1 = ["history"];
function ChatComponentPanel_div_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 13)(1, "p", 14);
    core /* ɵɵtext */.EFF(2, "Nothing here yet, send your first message below.");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function ChatComponentPanel_div_7_div_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 22);
    core /* ɵɵlistener */.bIt("click", function ChatComponentPanel_div_7_div_1_span_4_Template_span_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r2);
      const item_r3 = core /* ɵɵnextContext */.XpG(2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.removeChatMessage(item_r3));
    });
    core /* ɵɵtext */.EFF(1, "X");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ChatComponentPanel_div_7_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 17)(1, "span", 18);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelement */.nrm(3, "p", 19);
    core /* ɵɵtemplate */.DNE(4, ChatComponentPanel_div_7_div_1_span_4_Template, 2, 0, "span", 20);
    core /* ɵɵelementStart */.j41(5, "span", 21);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r3 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("ngClass", item_r3.sender == ctx_r3.userName ? "sender-container" : "container");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵstyleProp */.xc7("color", ctx_r3.nameToHexColor(item_r3.sender));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", item_r3.sender, ":");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHTML", ctx_r3.linkify(item_r3.message), core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r3.isAllowedToRemoveMessage());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.beautifyTime(item_r3.timestamp));
  }
}
function ChatComponentPanel_div_7_div_2_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 22);
    core /* ɵɵlistener */.bIt("click", function ChatComponentPanel_div_7_div_2_span_2_Template_span_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const item_r3 = core /* ɵɵnextContext */.XpG(2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.removeChatMessage(item_r3));
    });
    core /* ɵɵtext */.EFF(1, "X");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ChatComponentPanel_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 23);
    core /* ɵɵelement */.nrm(1, "p", 19);
    core /* ɵɵtemplate */.DNE(2, ChatComponentPanel_div_7_div_2_span_2_Template, 2, 0, "span", 20);
    core /* ɵɵelementStart */.j41(3, "span", 21);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r3 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("ngClass", item_r3.sender == ctx_r3.userName ? "sender-container" : "container");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("innerHTML", ctx_r3.linkify(item_r3.message), core /* ɵɵsanitizeHtml */.npT);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r3.isAllowedToRemoveMessage());
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.beautifyTime(item_r3.timestamp));
  }
}
function ChatComponentPanel_div_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, ChatComponentPanel_div_7_div_1_Template, 7, 7, "div", 15)(2, ChatComponentPanel_div_7_div_2_Template, 5, 4, "div", 16);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const i_r6 = ctx.index;
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", item_r3 == ctx_r3.displayedMessagesArray[0] || item_r3.sender != ctx_r3.displayedMessagesArray[i_r6 - 1].sender);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", i_r6 > 0 && item_r3.sender == ctx_r3.displayedMessagesArray[i_r6 - 1].sender);
  }
}
function ChatComponentPanel_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 24);
    core /* ɵɵlistener */.bIt("click", function ChatComponentPanel_button_8_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.scrollHistoryToBottom(true, 10));
    });
    core /* ɵɵelementStart */.j41(1, "mat-icon");
    core /* ɵɵtext */.EFF(2, "expand_more");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("matBadgeHidden", ctx_r3.unseenMessagesCount == 0 || ctx_r3.searchActivated)("@inOutAnimation", undefined);
  }
}
/*
* This is the component for the OPCloud chat panel:
* a small dialog/box in which the user can send and receive messages in the context of the working model.
*/
let ChatComponentPanel = /*#__PURE__*/(() => {
  class ChatComponentPanel {
    constructor(initRappid, chat, userService, changeDetectorRef, context, ngZone) {
      this.initRappid = initRappid;
      this.chat = chat;
      this.userService = userService;
      this.changeDetectorRef = changeDetectorRef;
      this.context = context;
      this.ngZone = ngZone;
      this.chatRefreshInterval = 5000;
      this.unreadMessagesCount = 0; // number of messages which was not even retrieved yet
      this.unseenMessagesCount = 0; // number of messages which are displayed in history but user needs to scroll down to see
      this.searchString = "";
      this.showSTB = false;
      this.historyAtBottom = true;
      this.historyAtTop = false;
      this.lastScrollHeight = 0;
      this.searchActivated = false;
      this.initRappid.ChatComponentRef = this;
      // Initialize the profanity filter
      this.cleanLanguage = new Filter();
    }
    ngOnInit() {
      this.MODEL_ID = this.context.getCurrentContext()?.properties?.id;
      this.last_MODEL_ID = this.MODEL_ID;
      // using userService to get current user name, for updating UI accordingly
      this.userService.user$.subscribe(user => this.userName = user.userData.Name);
      this.init();
      const this_ = this;
      this.interval = setInterval(function () {
        this_.updateMessages();
      }, this_.chatRefreshInterval);
      this.initRappid.modelService.modelChange$.subscribe(change => this_.updateMessages());
    }
    updateMessages() {
      const that = this;
      this.MODEL_ID = this.context.getCurrentContext()?.properties?.id;
      if (this.MODEL_ID) {
        if (this.MODEL_ID === this.last_MODEL_ID) {
          if (that.MODEL_ID) {
            this.refreshChatMessages();
          }
        } else {
          // new model has been saved/ loaded
          this.init();
          this.getUnreadChatMessages();
          // Setup chat refresher only if the chat is saved in DB
          if (that.MODEL_ID) {
            this.refreshChatMessages();
          }
          // update last_MODEL_ID to check if model has changed
          this.last_MODEL_ID = this.MODEL_ID;
        }
      }
    }
    // ngDoCheck() {
    //   const that = this;
    //   this.MODEL_ID = (<any>this.context.getCurrentContext())?.properties?.id;
    //
    //   // Setup chat refresher only if the model is saved in DB
    //   if (this.MODEL_ID || this.initRappid.getOpmModel().permissions.ownerID != '') {
    //     if (this.MODEL_ID === this.last_MODEL_ID) {
    //       // same model, don't change anything
    //     }
    //     else { // new model has been saved/ loaded
    //       this.init()
    //
    //       // get unread count and first messages if the chat is saved in DB
    //       this.getUnreadChatMessages();
    //
    //       // Setup chat refresher only if the chat is saved in DB
    //       this.chatRefreshSubscription = interval(this.chatRefreshInterval).subscribe((x => {
    //         if (that.MODEL_ID)
    //           this.refreshChatMessages();
    //       }));
    //
    //       //update last_MODEL_ID to check if model has changed
    //       this.last_MODEL_ID = this.MODEL_ID;
    //     }
    //
    //   } else if (this.chatRefreshSubscription) {
    //     //remove chat refresher if the model was closed
    //     this.chatRefreshSubscription.unsubscribe();
    //   }
    // }
    // setup the component when the user loads or saves a new model
    init() {
      // module initial values
      this.messagesArray = [];
      this.displayedMessagesArray = [];
      this.unreadMessagesArray = [];
      this.unreadMessagesCount = 0;
      this.initRappid.chatUnreadCount = 0;
      this.firstTime = true;
      this.firstTimeScroll = true;
      this.searchString = "";
    }
    getUnreadChatMessages() {
      this.chat.getUnreadChatMessages(this.MODEL_ID).then(msg => {
        this.unreadMessagesArray = msg;
        this.unreadMessagesCount = msg.length;
        this.initRappid.chatUnreadCount = this.unreadMessagesCount;
        // if this is the first time getMessages is called and there are no unread messages
        // populate the chat panel with all messages
        if (this.firstTime && msg.length === 0) {
          this.getAllChatMessages(true);
          this.firstTime = false;
        }
        // if this is the first time getMessages is called and there are unread messages
        // populate the chat panel with the unread messages
        if (this.firstTime && msg.length > 0) {
          this.messagesArray = msg;
          this.displayedMessagesArray = this.messagesArray;
          this.firstTime = false;
          this.scrollHistoryToBottom(false, 500);
        }
      }).catch(err => console.log(err));
    }
    getAllChatMessages(shouldScrollDown = false) {
      var _this = this;
      return (0, default)(function* () {
        return _this.chat.getAllChatMessages(_this.MODEL_ID).then(msg => {
          // load message in reverse to set the newest message at the bottom
          _this.messagesArray = msg.reverse();
          if (_this.messagesArray.length !== _this.displayedMessagesArray.length && !_this.searchActivated) {
            _this.unseenMessagesCount += _this.messagesArray.length - _this.displayedMessagesArray.length;
          }
          _this.displayedMessagesArray = _this.messagesArray;
          // On first receiving messages, scroll to the bottom = first message
          if (shouldScrollDown) {
            _this.scrollHistoryToBottom(false, 500);
          }
          _this.messageSearch();
          if (_this.historyAtBottom) {
            _this.unseenMessagesCount = 0;
            _this.scrollHistoryToBottom(false, 0);
          } else if (!_this.historyAtBottom && _this.unseenMessagesCount > 0) {
            _this.showSTB = true;
          }
        }).catch(err => console.log(err));
      })();
    }
    // Refresh messages according to module state: opened - actual messages, closed - unread messages
    refreshChatMessages() {
      if (this.initRappid.showChatPanel) {
        this.getAllChatMessages();
      } else {
        this.getUnreadChatMessages();
      }
    }
    // scroll the history section to the bottom (the newest message is at the bottom)
    scrollHistoryToBottom(smooth = false, delay = 600) {
      setTimeout(() => {
        this.messageListDiv.nativeElement.scroll({
          top: this.messageListDiv.nativeElement.scrollHeight,
          left: 0,
          behavior: smooth ? "smooth" : "auto"
        });
      }, delay);
      this.unseenMessagesCount = 0;
    }
    // detects scrolling in the history section and handle stb
    scrollDetect(event) {
      // debugger
      const scrollEvent = event.target;
      const st = scrollEvent.scrollTop;
      // Scroll is at top + 30px padding
      if (st <= 30) {
        this.showSTB = true;
        this.historyAtTop = true;
      }
      // Scroll is at bottom + 30px padding
      if (st + scrollEvent.offsetHeight >= scrollEvent.scrollHeight - 30) {
        this.showSTB = false;
        this.historyAtBottom = true;
        this.unseenMessagesCount = 0;
      }
      // Scrolling down
      if (st > this.lastScrollHeight) {
        this.showSTB = true;
        this.historyAtTop = false;
      } else {
        // Scrolling down
        this.showSTB = false;
        this.historyAtBottom = false;
      }
      this.lastScrollHeight = st <= 0 ? 0 : st;
    }
    sendChatMessage() {
      if (this.messageInput.nativeElement.value !== "") {
        const msgText = this.cleanLanguage.clean(this.messageInput.nativeElement.value);
        // create DisplayChat structure
        const message = {
          id: "",
          sender: "",
          message: msgText,
          modelId: this.MODEL_ID,
          timestamp: 0,
          type: "text"
        };
        const msgCopy = Object.assign({}, message, {
          sender: this.userName,
          timestamp: Date.now()
        });
        this.messagesArray?.push(msgCopy);
        this.scrollHistoryToBottom(false, 0);
        // Send the message and retrieve all messages
        this.chat.pushChatMessage(message).then(() => {
          this.getAllChatMessages();
        }).catch(err => {
          console.log(err);
          this.messagesArray.pop();
          (0, validationAlert)("Error Sending Message: " + err, 5000);
        });
        // Clear input box after sending the message
        this.messageInput.nativeElement.value = "";
      } else {
        // Prevent sending empty message
        const errMsg = "Empty Message";
        (0, validationAlert)(errMsg, 5000);
      }
    }
    // Create unique color for every sender according to his name
    nameToHexColor(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let colour = "#";
      for (let i = 0; i < 3; i++) {
        const value = hash >> i * 8 & 255;
        colour += ("00" + value.toString(16)).substr(-2);
      }
      return colour;
    }
    // parse links in text message to <a> tag
    linkify(plainText) {
      let replacedText;
      let replacePattern1;
      let replacePattern2;
      // URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = plainText.replace(replacePattern1, "<a class=\"linkInMessage\" href=\"$1\" target=\"_blank\">$1</a>");
      // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, "$1<a class=\"linkInMessage\" href=\"http://$2\" target=\"_blank\">$2</a>");
      return replacedText;
    }
    // Detect clicking on link, if the link is to an OPCloud model - load it without refresh, else open the link in a new tab.
    a_tag_click(e) {
      var _this2 = this;
      return (0, default)(function* () {
        const element = e.target || e.srcElement;
        // detect <a> class="linkInMessage" click
        if ((element.tagName === "A" || element.tagName === "a") && element.className === "linkInMessage") {
          if (element.href.includes("/load/")) {
            let linkModelId = element.href.substring(element.href.indexOf("/load/") + 6);
            if (linkModelId.includes("/")) {
              linkModelId = linkModelId.substring(0, linkModelId.indexOf("/"));
            }
            e.preventDefault();
            const res = yield _this2.chat.loadModelFromLink(linkModelId);
            if (!res) {
              window.open(element.href, "_blank");
            }
            return !res;
          }
          return false;
        }
        return true;
      })();
    }
    // Set message sent time in human readable format, according the time passed
    beautifyTime(value) {
      this.removeTimer();
      const d = new Date(value);
      const now = new Date();
      const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
      const timeToUpdate = Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
      this.timer = this.ngZone.runOutsideAngular(() => {
        if (typeof window !== "undefined") {
          return window.setTimeout(() => {
            this.ngZone.run(() => this.changeDetectorRef.markForCheck());
          }, timeToUpdate);
        }
        return null;
      });
      const minutes = Math.round(Math.abs(seconds / 60));
      const hours = Math.round(Math.abs(minutes / 60));
      const days = Math.round(Math.abs(hours / 24));
      const months = Math.round(Math.abs(days / 30.416));
      const years = Math.round(Math.abs(days / 365));
      if (Number.isNaN(seconds)) {
        return "";
      } else if (seconds <= 45) {
        return "just now";
      } else if (seconds <= 90) {
        return "a minute ago";
      } else if (minutes <= 45) {
        return minutes + " minutes ago";
      } else if (minutes <= 90) {
        return "an hour ago";
      } else if (hours <= 22) {
        return hours + " hours ago";
      } else if (hours <= 36) {
        return "a day ago";
      } else if (days <= 25) {
        return days + " days ago";
      } else if (days <= 45) {
        return "a month ago";
      } else if (days <= 345) {
        return months + " months ago";
      } else if (days <= 545) {
        return "a year ago";
      } else {
        // (days > 545)
        return years + " years ago";
      }
    }
    // remove beautifyTime timer, and chatRefresher
    ngOnDestroy() {
      this.removeTimer();
      if (this.interval) {
        clearInterval(this.interval);
      }
      if (this.chatRefreshSubscription) {
        this.chatRefreshSubscription.unsubscribe();
      }
    }
    removeTimer() {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    }
    // Update time passed proportionally
    getSecondsUntilUpdate(seconds) {
      const min = 60;
      const hr = min * 60;
      const day = hr * 24;
      if (seconds < min) {
        // less than 1 min, update every 2 secs
        return 2;
      } else if (seconds < hr) {
        // less than an hour, update every 30 secs
        return 30;
      } else if (seconds < day) {
        // less then a day, update every 5 mins
        return 300;
      } else {
        // update every hour
        return 3600;
      }
    }
    // display only messages consisting of searchString while on search
    messageSearch() {
      if (this.searchString.length > 0) {
        this.searchActivated = true;
        this.displayedMessagesArray = this.messagesArray.filter(a => a.message.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
      } else {
        this.searchActivated = false;
        this.displayedMessagesArray = this.messagesArray;
      }
    }
    removeChatMessage(item) {
      const idx = this.messagesArray.indexOf(item);
      if (idx >= 0 && this.isAllowedToRemoveMessage()) {
        this.chat.removeMessage(item.id, this.MODEL_ID).then(r => {}).catch(err => {});
        this.messagesArray.splice(idx, 1);
      }
    }
    isAllowedToRemoveMessage() {
      return this.userService.isOrgAdmin() || this.userService.isSysAdmin();
    }
    static #_ = (() => this.ɵfac = function ChatComponentPanel_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ChatComponentPanel)(core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ChatStorageService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(ChangeDetectorRef), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(NgZone));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ChatComponentPanel,
      selectors: [["opcloud-chat-component-panel"]],
      viewQuery: function ChatComponentPanel_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(c0, 5);
          core /* ɵɵviewQuery */.GBs(c1, 5);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.messageInput = _t.first;
          }
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.messageListDiv = _t.first;
          }
        }
      },
      hostBindings: function ChatComponentPanel_HostBindings(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵlistener */.bIt("click", function ChatComponentPanel_click_HostBindingHandler($event) {
            return ctx.a_tag_click($event);
          }, false, core /* ɵɵresolveDocument */.EBC);
        }
      },
      decls: 16,
      vars: 4,
      consts: [["history", ""], ["messageInput", ""], ["id", "chatContainer", 1, "chat-Container"], ["id", "chatSearchBox", 1, "chat-search-box"], ["type", "text", "placeholder", "Search", 1, "search-input", 3, "ngModelChange", "keyup", "ngModel"], ["id", "historyContainer", 1, "history-container", 3, "scroll"], ["class", "container", 4, "ngIf"], [4, "ngFor", "ngForOf"], ["id", "historySTB", "class", "history-stb", "mat-mini-fab", "", "color", "link", "type", "button", "matBadge", "", "matBadgeSize", "medium", "matBadgePosition", "before", 3, "matBadgeHidden", "click", 4, "ngIf"], [1, "bottom-bar"], ["appearance", "outline", 1, "message-input"], ["placeholder", "Enter Message...", "type", "text", 1, "inputField", 3, "keyup.enter"], ["mat-flat-button", "", "color", "primary", "type", "button", 1, "message-send", 3, "click"], [1, "container"], [1, "message-text"], [3, "ngClass", 4, "ngIf"], ["class", "follow-container", 3, "ngClass", 4, "ngIf"], [3, "ngClass"], [1, "sender"], [1, "message-text", 3, "innerHTML"], ["class", "time-right removeChatMessage", 3, "click", 4, "ngIf"], [1, "time-right"], [1, "time-right", "removeChatMessage", 3, "click"], [1, "follow-container", 3, "ngClass"], ["id", "historySTB", "mat-mini-fab", "", "color", "link", "type", "button", "matBadge", "", "matBadgeSize", "medium", "matBadgePosition", "before", 1, "history-stb", 3, "click", "matBadgeHidden"]],
      template: function ChatComponentPanel_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 2)(1, "div", 3)(2, "span")(3, "input", 4);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ChatComponentPanel_Template_input_ngModelChange_3_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchString, $event)) {
              ctx.searchString = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵlistener */.bIt("keyup", function ChatComponentPanel_Template_input_keyup_3_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.messageSearch());
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(4, "div", 5, 0);
          core /* ɵɵlistener */.bIt("scroll", function ChatComponentPanel_Template_div_scroll_4_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.scrollDetect($event));
          });
          core /* ɵɵtemplate */.DNE(6, ChatComponentPanel_div_6_Template, 3, 0, "div", 6)(7, ChatComponentPanel_div_7_Template, 3, 2, "div", 7);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(8, ChatComponentPanel_button_8_Template, 3, 2, "button", 8);
          core /* ɵɵelementStart */.j41(9, "div", 9)(10, "div", 10)(11, "input", 11, 1);
          core /* ɵɵlistener */.bIt("keyup.enter", function ChatComponentPanel_Template_input_keyup_enter_11_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.sendChatMessage());
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(13, "button", 12);
          core /* ɵɵlistener */.bIt("click", function ChatComponentPanel_Template_button_click_13_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.sendChatMessage());
          });
          core /* ɵɵelementStart */.j41(14, "mat-icon");
          core /* ɵɵtext */.EFF(15, "send");
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchString);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.messagesArray.length == 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.displayedMessagesArray);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.showSTB && !ctx.historyAtBottom || ctx.historyAtTop);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatIcon, MatButton, MatMiniFabButton, DefaultValueAccessor, NgControlStatus, NgModel, MatBadge],
      styles: [".chat-container[_ngcontent-%COMP%]{position:relative;display:flex;flex-direction:column;height:100%;border:1px solid black;padding-bottom:50px}.history-container[_ngcontent-%COMP%]{height:300px;width:100%;background-color:#fff;flex:1;overflow:auto;padding:.2em .2em 5px .3em;box-sizing:border-box;color:#1a3763;p--webkit-margin-before:.5em;p--webkit-margin-after:.5em;p-color:#1A3763}.history-container[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}.history-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:2px;border-left:2px solid white;border-right:2px solid white}.history-container[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:4px;border-left:4px solid white;border-right:4px solid white}.container[_ngcontent-%COMP%]{border:2px solid #dedede;background-color:#f1f1f1;border-radius:10px;padding:5px;margin:6px 0 0;font-size:15px}.container.follow-container[_ngcontent-%COMP%]{border-radius:0 0 10px 10px;margin:2px 0 0}.container[_ngcontent-%COMP%]:after{content:\"\";clear:both;display:table}.sender[_ngcontent-%COMP%]{font-weight:700}.sender-container[_ngcontent-%COMP%]{border:2px solid #dedede;background-color:#e5f1f3;border-radius:10px;padding:5px;margin:6px 0 0;font-size:15px}.sender-container.follow-container[_ngcontent-%COMP%]{border-radius:0 0 10px 10px;margin:2px 0 0}.sender-container[_ngcontent-%COMP%]:after{content:\"\";clear:both;display:table}.message-text[_ngcontent-%COMP%]{margin:0!important;text-align:start;unicode-bidi:plaintext;word-wrap:break-word}.time-right[_ngcontent-%COMP%]{float:right;color:#aaa;font-size:12px}.bottom-bar[_ngcontent-%COMP%]{position:relative;bottom:0;width:100%;height:50px;background-color:#f0f4f9;overflow:hidden}.mat-mdc-form-field-appearance-outline.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-outline-thick[_ngcontent-%COMP%], .mat-mdc-form-field.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.removeChatMessage[_ngcontent-%COMP%]{float:right;color:#cd5c5c;margin-left:6px;font-weight:700}.message-input[_ngcontent-%COMP%]{width:calc(95% - 60px);margin:0!important;padding:0!important;display:inline-block}.inputField[_ngcontent-%COMP%]{width:calc(100% - 15px);height:33px;margin-top:8px;margin-left:8px;background:#fff;border:1px solid #D9E7EE;box-sizing:border-box;border-radius:4px;padding:10px}.message-send[_ngcontent-%COMP%]{height:40px;width:60px;right:5px;margin:0 0 0 8px!important;padding:0!important;display:inline-block;background-color:#a3aec0}.chat-search-box[_ngcontent-%COMP%]{height:25px;background:#78a8f11a;font-family:Roboto,Arial,Helvetica,sans-serif;font-style:normal;font-weight:700;line-height:normal;font-size:16px;color:#1a3763;opacity:.7;padding:4px}.search-input[_ngcontent-%COMP%]{width:163px;height:24px;background:#fff;border:1px solid #D9E7EE;box-sizing:border-box;border-radius:30px}.search-input[placeholder][_ngcontent-%COMP%]{padding:6px}.search-input[_ngcontent-%COMP%]:focus{outline-width:0}.history-stb[_ngcontent-%COMP%]{right:10px;bottom:72px;left:auto;position:absolute}"],
      data: {
        animation: [(0, trigger)("inOutAnimation", [(0, transition)(":enter", [(0, style)({
          transform: "translateY(100%)",
          opacity: 0
        }), (0, animate)("250ms", (0, style)({
          transform: "translateY(0)",
          opacity: 1
        }))]), (0, transition)(":leave", [(0, style)({
          transform: "translateY(0)",
          opacity: 1
        }), (0, animate)("250ms", (0, style)({
          transform: "translateY(100%)",
          opacity: 0
        }))])])]
      }
    }))();
  }
  return ChatComponentPanel;
})();