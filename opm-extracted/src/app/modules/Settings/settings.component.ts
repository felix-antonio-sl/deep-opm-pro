// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/settings.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = a0 => [a0];
const c1 = a0 => ({
  settings_main: a0
});
const c2 = a0 => ({
  outlets: a0
});
const c3 = a0 => ["/settings", a0];
function SettingsComponent_div_16_mat_icon_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-icon");
    core /* ɵɵtext */.EFF(1, "expand_more");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SettingsComponent_div_16_mat_icon_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-icon");
    core /* ɵɵtext */.EFF(1, "expand_less");
    core /* ɵɵelementEnd */.k0s();
  }
}
function SettingsComponent_div_16_mat_nav_list_9_div_1_mat_list_item_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-list-item", 18)(1, "a", 19);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const menu_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("routerLink", core /* ɵɵpureFunction1 */.eq3(8, c3, core /* ɵɵpureFunction1 */.eq3(6, c2, core /* ɵɵpureFunction1 */.eq3(4, c1, core /* ɵɵpureFunction1 */.eq3(2, c0, menu_r4.outlet)))));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(menu_r4.name);
  }
}
function SettingsComponent_div_16_mat_nav_list_9_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, SettingsComponent_div_16_mat_nav_list_9_div_1_mat_list_item_1_Template, 3, 10, "mat-list-item", 17);
    core /* ɵɵpipe */.nI1(2, "async");
    core /* ɵɵpipe */.nI1(3, "async");
    core /* ɵɵpipe */.nI1(4, "async");
    core /* ɵɵpipe */.nI1(5, "async");
    core /* ɵɵpipe */.nI1(6, "async");
    core /* ɵɵpipe */.nI1(7, "async");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    let tmp_5_0;
    const menu_r4 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG(3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", menu_r4.priv == "any" || menu_r4.priv == "auth" && !ctx_r2.isAnon || menu_r4.priv == "dsm" && (((tmp_5_0 = core /* ɵɵpipeBind1 */.bMT(2, 1, ctx_r2.user$)) == null ? null : tmp_5_0.userData == null ? null : tmp_5_0.userData.IsDSMUser) || false) || menu_r4.priv == "OrgAdmin" && (((tmp_5_0 = core /* ɵɵpipeBind1 */.bMT(3, 3, ctx_r2.user$)) == null ? null : tmp_5_0.userData == null ? null : tmp_5_0.userData.OrgAdmin) || false || ((tmp_5_0 = core /* ɵɵpipeBind1 */.bMT(4, 5, ctx_r2.user$)) == null ? null : tmp_5_0.userData == null ? null : tmp_5_0.userData.SysAdmin) || false) || menu_r4.priv == "SysAdmin" && (((tmp_5_0 = core /* ɵɵpipeBind1 */.bMT(5, 7, ctx_r2.user$)) == null ? null : tmp_5_0.userData == null ? null : tmp_5_0.userData.SysAdmin) || false) || menu_r4.priv === "usersManagement" && (((tmp_5_0 = core /* ɵɵpipeBind1 */.bMT(6, 9, ctx_r2.user$)) == null ? null : tmp_5_0.userData == null ? null : tmp_5_0.userData.usersManagement) || false || ((tmp_5_0 = core /* ɵɵpipeBind1 */.bMT(7, 11, ctx_r2.user$)) == null ? null : tmp_5_0.userData == null ? null : tmp_5_0.userData.SysAdmin) || false));
  }
}
function SettingsComponent_div_16_mat_nav_list_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-nav-list");
    core /* ɵɵtemplate */.DNE(1, SettingsComponent_div_16_mat_nav_list_9_div_1_Template, 8, 13, "div", 10);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const menuGroup_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", menuGroup_r2.menus);
  }
}
function SettingsComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "mat-list-item", 13);
    core /* ɵɵlistener */.bIt("click", function SettingsComponent_div_16_Template_mat_list_item_click_1_listener() {
      const menuGroup_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.toggle(menuGroup_r2.group));
    });
    core /* ɵɵelementStart */.j41(2, "span")(3, "mat-icon", 14);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(5, "span", 15);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(7, SettingsComponent_div_16_mat_icon_7_Template, 2, 0, "mat-icon", 16)(8, SettingsComponent_div_16_mat_icon_8_Template, 2, 0, "mat-icon", 16);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(9, SettingsComponent_div_16_mat_nav_list_9_Template, 2, 1, "mat-nav-list", 16);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const menuGroup_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵtextInterpolate */.JRh(menuGroup_r2.icon);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(menuGroup_r2.group);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r2.toggle_list[menuGroup_r2.group]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.toggle_list[menuGroup_r2.group]);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.toggle_list[menuGroup_r2.group]);
  }
}
let SettingsComponent = /*#__PURE__*/(() => {
  class SettingsComponent {
    constructor(groupService, router, _dialog, userService) {
      this.groupService = groupService;
      this.router = router;
      this._dialog = _dialog;
      this.userService = userService;
      this.menuGroups = menuGroups;
      this.toggle_list = {};
      this.publicManuUnauthorized = ["Group Management", "Organization Management"];
      if (this.userService.isPublicOrganization) {
        this.updateMenu();
      }
      this.resetToggle();
      this.user$ = this.userService.user$;
      this.isAnon = false; // Replace with actual logic if needed
    }
    updateMenu() {
      const finalManu = [];
      this.menuGroups.forEach(title => {
        if (!this.publicManuUnauthorized.includes(title.group)) {
          finalManu.push(title);
        }
      });
      this.menuGroups = finalManu;
    }
    ngOnInit() {}
    toggle(group) {
      this.toggle_list[group] = !this.toggle_list[group];
    }
    resetToggle() {
      this.menuGroups.forEach(menuGroup => {
        this.toggle_list[menuGroup.group] = false;
      });
    }
    backToMain() {
      this.groupService.updateOrgGroups(this.userService.userOrg);
      this.groupService.updateOrgUsers(this.userService.userOrg);
      this.router.navigate([""]).then(() => {
        setTimeout(() => {
          (0, getInitRappidShared)().recoverOpenTreeNodes();
          (0, getInitRappidShared)().setLeftBarWindowsSizes({});
        }, 1000);
      });
    }
    static #_ = (() => this.ɵfac = function SettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SettingsComponent)(core /* ɵɵdirectiveInject */.rXU(GroupsService), core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SettingsComponent,
      selectors: [["opc-settings"]],
      decls: 19,
      vars: 1,
      consts: [["color", "primary", 1, "app-toolbar"], ["src", "assets/SVG/newLogo.svg", 1, "logo"], [1, "content"], ["id", "sidebar"], ["id", "backArrow"], [1, "backBTN", 3, "click"], ["width", "11", "height", "9", "viewBox", "0 0 11 9", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", "color", "white"], ["d", "M5.80435 0.5L1.5 4.41304M1.5 4.41304L5.80435 8.32609M1.5 4.41304H10.5", "stroke", "white"], [1, "heading"], ["id", "wrapMatList"], [4, "ngFor", "ngForOf"], ["id", "window-content"], ["name", "settings_main"], [1, "settings_menu_header", 3, "click"], [1, "settings_menu_icon"], ["id", "tabName"], [4, "ngIf"], ["class", "settings_menu_item", 3, "routerLink", 4, "ngIf"], [1, "settings_menu_item", 3, "routerLink"], ["skipLocationChange", "", 1, "btn"]],
      template: function SettingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "mat-toolbar", 0);
          core /* ɵɵelement */.nrm(1, "img", 1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "button", 5);
          core /* ɵɵlistener */.bIt("click", function SettingsComponent_Template_button_click_5_listener() {
            return ctx.backToMain();
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(6, "svg", 6);
          core /* ɵɵelement */.nrm(7, "path", 7);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(8, "span");
          core /* ɵɵtext */.EFF(9, "Back");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(10, "div")(11, "span", 8)(12, "b");
          core /* ɵɵtext */.EFF(13, "Settings");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(14, "div", 9)(15, "mat-list");
          core /* ɵɵtemplate */.DNE(16, SettingsComponent_div_16_Template, 10, 5, "div", 10);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(17, "div", 11);
          core /* ɵɵelement */.nrm(18, "router-outlet", 12);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(16);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.menuGroups);
        }
      },
      dependencies: [NgForOf, NgIf, MatList, MatNavList, MatListItem, MatToolbar, MatIcon, RouterOutlet, RouterLink, AsyncPipe],
      styles: ["[_nghost-%COMP%]{overflow:hidden}*[_ngcontent-%COMP%]{margin:0;padding:0}body[_ngcontent-%COMP%], html[_ngcontent-%COMP%]{width:100%;height:100%}.logo[_ngcontent-%COMP%]{position:relative;height:38px;left:35px}.app-toolbar[_ngcontent-%COMP%]{position:absolute;height:65px;left:0;top:0;background:#1a3763;align-items:center}.content[_ngcontent-%COMP%]{position:relative;inset:65px 0 0;background:#1a3763;box-sizing:border-box;height:95%}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]{float:left;height:95%;background:#5a6f8f;color:#fff;overflow:auto}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   .backBTN[_ngcontent-%COMP%]{position:relative;left:0;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:17px;color:#fff;top:10px;background:none;border-color:transparent;width:100%;height:40px;text-align:left}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   .backBTN[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{margin-right:10px;margin-left:25px}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:700;line-height:normal;font-size:18px;color:#fff;position:relative;inset:32px 0% 90.72% 9.56%}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]{top:32px;bottom:84.67%;position:relative;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .mdc-list-item__content[_ngcontent-%COMP%]{color:#fff;position:relative;flex-direction:row;display:flex}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .mdc-list-item__content[_ngcontent-%COMP%]   .mat-mdc-list-item-unscoped-content[_ngcontent-%COMP%]   mdc-list-item__primary-text[_ngcontent-%COMP%]{color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .mat-mdc-nav-list[_ngcontent-%COMP%]{padding-bottom:0;padding-top:0}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .mat-mdc-nav-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:relative;left:39px;text-decoration:none;color:#fff;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;font-size:14px;line-height:16px}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .settings_menu[_ngcontent-%COMP%]{transition:transform .4s cubic-bezier(.25,.8,.25,1);background:#5a6f8f;box-shadow:0 0 3px #1a3c5c4d;text-align:center;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .settings_menu_header[_ngcontent-%COMP%]{transition:transform .4s cubic-bezier(.25,.8,.25,1);background:#0000001a;box-shadow:0 0 3px #1a3c5c4d;text-align:left;color:#fff;font-size:larger;align-items:center;display:flex}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .settings_menu_header[_ngcontent-%COMP%]   .settings_menu_icon[_ngcontent-%COMP%]{margin-right:10px;margin-left:5px;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .settings_menu_header[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{width:24px;margin-right:10px;margin-left:5px;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   #tabName[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;font-size:14px;line-height:16px;right:32.5px;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   #tabName[_ngcontent-%COMP%]   .settings_menu_item[_ngcontent-%COMP%]{display:flex;height:40px;border-bottom:1px solid rgba(0,0,0,.12);width:100%;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:15px;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   #tabName[_ngcontent-%COMP%]   .settings_menu_item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]{align:right;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .settings_menu_item[_ngcontent-%COMP%]{display:flex;height:40px;border-bottom:1px solid rgba(0,0,0,.12);width:100%;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:15px;color:#fff}.content[_ngcontent-%COMP%]   #sidebar[_ngcontent-%COMP%]   #wrapMatList[_ngcontent-%COMP%]   .settings_menu_item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]{align:right;color:#fff}#window-content[_ngcontent-%COMP%]{height:95%;background:#f8f8f8;overflow:auto}[_ngcontent-%COMP%]::-webkit-scrollbar{width:8px;height:8px}[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#ece8e8}[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:4px}"]
    }))();
  }
  return SettingsComponent;
})();