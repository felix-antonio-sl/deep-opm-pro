// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/log-sharing-dialog/log-sharing-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let LogSharingDialogComponent = /*#__PURE__*/(() => {
  class LogSharingDialogComponent {
    constructor(oplService, userService, dialog, data) {
      this.oplService = oplService;
      this.userService = userService;
      this.dialog = dialog;
      this.data = data;
    }
    updateLogSharingPermission(val) {
      //console.log(`log sharing permission: ${val}`)
      const settings = {
        logSharingPermission: val
      };
      const message = val ? "Log sharing enabled!" : "Log sharing disabled!";
      this.oplService.updateUserSettings(settings);
      this.userService.updateUserOplSetting(settings).then(() => (0, validationAlert)(message, null, "Success"));
      this.dialog.closeAll();
    }
    ngOnInit() {}
    static #_ = (() => this.ɵfac = function LogSharingDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LogSharingDialogComponent)(core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: LogSharingDialogComponent,
      selectors: [["opcloud-log-sharing-dialog"]],
      decls: 11,
      vars: 0,
      consts: [[1, "hdr1"], [1, "btns", 2, "text-align", "center"], ["mat-button", "", "color", "primary", "id", "yesBtn", 3, "click"], ["mat-button", "", "color", "primary", "id", "noBtn", 3, "click"]],
      template: function LogSharingDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "mat-card")(1, "div", 0)(2, "h4")(3, "b")(4, "i");
          core /* ɵɵtext */.EFF(5, " Do you allow sharing your opcloud exceptions to help improve our platform? ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(6, "div", 1)(7, "button", 2);
          core /* ɵɵlistener */.bIt("click", function LogSharingDialogComponent_Template_button_click_7_listener() {
            return ctx.updateLogSharingPermission(true);
          });
          core /* ɵɵtext */.EFF(8, "Accept");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "button", 3);
          core /* ɵɵlistener */.bIt("click", function LogSharingDialogComponent_Template_button_click_9_listener() {
            return ctx.updateLogSharingPermission(false);
          });
          core /* ɵɵtext */.EFF(10, "Decline");
          core /* ɵɵelementEnd */.k0s()()();
        }
      },
      dependencies: [MatButton, MatCard]
    }))();
  }
  return LogSharingDialogComponent;
})();