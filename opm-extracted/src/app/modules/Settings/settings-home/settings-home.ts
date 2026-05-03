// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/settings-home/settings-home.ts
// Extracted by opm-extracted/tools/extract.mjs

let SettingsHome = /*#__PURE__*/(() => {
  class SettingsHome {
    ngOnInit() {
      //this.getOrgAdmin();
    }
    constructor(userServices) {
      this.userServices = userServices;
      this.menuGroups = menuGroups;
      //this.user$ = this.userServices.user$;
    }
    static #_ = (() => this.ɵfac = function SettingsHome_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SettingsHome)(core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SettingsHome,
      selectors: [["opc-settins-home"]],
      decls: 0,
      vars: 0,
      template: function SettingsHome_Template(rf, ctx) {},
      styles: [".settings_main_card_subcard[_ngcontent-%COMP%]{color:#fff;margin:100px;width:548px;height:541px;box-shadow:0 16px 24px 2px #00000024,0 6px 30px 5px #0000001f,0 8px 10px -5px #0000004d}.settings_main_card_subcard[_ngcontent-%COMP%]   .mat-mdc-grid-tile[_ngcontent-%COMP%]{transition:all .4s ease-out 50ms}.settings_main_card_subcard[_ngcontent-%COMP%]   .mat-mdc-headline[_ngcontent-%COMP%]{font-size:x-large}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return SettingsHome;
})();