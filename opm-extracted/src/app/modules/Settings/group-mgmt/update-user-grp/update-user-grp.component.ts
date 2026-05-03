// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/group-mgmt/update-user-grp/update-user-grp.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let UserGroupsComponent = /*#__PURE__*/(() => {
  class UserGroupsComponent {
    constructor(dialogRef, userService, _dialog) {
      this.dialogRef = dialogRef;
      this.userService = userService;
      this._dialog = _dialog;
    }
    ngOnInit() {
      // console.log(`UserGroupsComponent opened`);
      this.subscription = this.userService.user$.subscribe(curUser => {
        this.user = curUser;
      });
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    clickedOption(optionClicked) {
      if (optionClicked === "MemberGrpComponent") {
        this.openSettingOption(MemberGrpComponent, [this.user, this.ref, this.memRef, this.adRef]);
      } else {
        console.log("optionClicked is undefined");
      }
    }
    openSettingOption(settingOptionComp, parameters) {
      const dialogRef = this._dialog.open(settingOptionComp, {
        data: parameters
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.openSettingOption(res.action, res.params);
        } else {
          // (!!res)
          console.log("no result for openSettingOption");
        }
      });
    }
    static #_ = (() => this.ɵfac = function UserGroupsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UserGroupsComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: UserGroupsComponent,
      selectors: [["opcloud-ugrp-dialog"]],
      decls: 8,
      vars: 0,
      consts: [["mat-button", "", 3, "click"]],
      template: function UserGroupsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "h1");
          core /* ɵɵtext */.EFF(1, "Profile Groups");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "p")(3, "button", 0);
          core /* ɵɵlistener */.bIt("click", function UserGroupsComponent_Template_button_click_3_listener() {
            return ctx.clickedOption("MemberGrpComponent");
          });
          core /* ɵɵtext */.EFF(4, "Membership Groups");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(5, "p")(6, "button", 0);
          core /* ɵɵlistener */.bIt("click", function UserGroupsComponent_Template_button_click_6_listener() {
            return ctx.clickedOption("AdminGrpComponent");
          });
          core /* ɵɵtext */.EFF(7, "Administration Groups");
          core /* ɵɵelementEnd */.k0s()();
        }
      },
      dependencies: [MatButton],
      styles: [".selected[_ngcontent-%COMP%]{background:#87cefa}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
    static #_3 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: UserGroupsComponent,
      factory: UserGroupsComponent.ɵfac
    }))();
  }
  return UserGroupsComponent;
})();