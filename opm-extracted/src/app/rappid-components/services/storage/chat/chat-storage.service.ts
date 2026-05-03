// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/storage/chat/chat-storage.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ChatStorageService = /*#__PURE__*/(() => {
  class ChatStorageService {
    /**
     * A service for the chat module.
     *
     * Used for getting and sending messages.
     * @see getAllChatMessages,getUnreadChatMessages,pushChatMessage
     *
     * Also used to load on OPM Model in OPCloud via link
     * @see loadModelFromLink
     */
    constructor(storage, context) {
      this.storage = storage;
      this.context = context;
    }
    getAllChatMessages(model_id) {
      var _this = this;
      return (0, default)(function* () {
        return _this.storage.getChatMessages(model_id, getChatAction.ALL).then(messages => {
          return messages.chatMessages;
        }).catch(err => {
          return [];
        });
      })();
    }
    getUnreadChatMessages(model_id) {
      var _this2 = this;
      return (0, default)(function* () {
        return _this2.storage.getChatMessages(model_id, getChatAction.UNREAD).then(messages => {
          return messages.chatMessages;
        }).catch(err => {
          return [];
        });
      })();
    }
    pushChatMessage(message) {
      var _this3 = this;
      return (0, default)(function* () {
        return _this3.storage.pushChatMessage(message);
      })();
    }
    loadModelFromLink(model_id) {
      var _this4 = this;
      return (0, default)(function* () {
        if (_this4.context.getTabs().find(t => t?.context?.properties?.id === model_id)) {
          (0, validationAlert)(`The model is already open on other tab.`, 2500, "warning");
          return true;
        }
        return _this4.context.loadModel(model_id, null, "MAIN").then(() => {
          (0, validationAlert)(`Successfully loaded model.`, 2500, "warning");
          return true; // The model was loaded successfully, no need to open the link in new tab
        }).catch(err => {
          (0, validationAlert)(`Failed to load model,  Opening link in a new tab`, 2500, "Error");
          return false; // A model was not loaded, open the link in new tab
        });
      })();
    }
    removeMessage(msg_id, model_id) {
      var _this5 = this;
      return (0, default)(function* () {
        return _this5.storage.removeChatMessage(msg_id, model_id);
      })();
    }
    static #_ = (() => this.ɵfac = function ChatStorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ChatStorageService)(core /* ɵɵinject */.KVO(StorageService), core /* ɵɵinject */.KVO(ContextService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ChatStorageService,
      factory: ChatStorageService.ɵfac
    }))();
  }
  return ChatStorageService;
})();