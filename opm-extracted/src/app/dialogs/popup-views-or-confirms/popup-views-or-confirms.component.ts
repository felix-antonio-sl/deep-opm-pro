// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/popup-views-or-confirms/popup-views-or-confirms.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function PopupViewsOrConfirmsComponent_div_4_option_5_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 11);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r3 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", org_r3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r3);
  }
}
function PopupViewsOrConfirmsComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 6)(1, "span", 7);
    core /* ɵɵtext */.EFF(2, "Organization: ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 8)(4, "select", 9);
    core /* ɵɵlistener */.bIt("change", function PopupViewsOrConfirmsComponent_div_4_Template_select_change_4_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.changedSelectedOrg($event));
    });
    core /* ɵɵtemplate */.DNE(5, PopupViewsOrConfirmsComponent_div_4_option_5_Template, 2, 2, "option", 10);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("value", ctx_r1.selectedOrg)("disabled", ctx_r1.isOrgMode);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.allOrgsNames);
  }
}
function PopupViewsOrConfirmsComponent_div_6__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 13);
    core /* ɵɵelement */.nrm(1, "circle", 14)(2, "path", 15);
    core /* ɵɵelementEnd */.k0s();
  }
}
function PopupViewsOrConfirmsComponent_div_6__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(0, "svg", 13);
    core /* ɵɵelement */.nrm(1, "circle", 16)(2, "rect", 17)(3, "rect", 18);
    core /* ɵɵelementEnd */.k0s();
  }
}
function PopupViewsOrConfirmsComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "span");
    core /* ɵɵtemplate */.DNE(2, PopupViewsOrConfirmsComponent_div_6__svg_svg_2_Template, 3, 0, "svg", 12);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(3, PopupViewsOrConfirmsComponent_div_6__svg_svg_3_Template, 4, 0, "svg", 12);
    core /* ɵɵelementStart */.j41(4, "span");
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", item_r4.status);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !item_r4.status);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate2 */.Lme("", " " + item_r4.name + " ", " ", "(" + item_r4.email + ")", "");
  }
}
let PopupViewsOrConfirmsComponent = /*#__PURE__*/(() => {
  class PopupViewsOrConfirmsComponent {
    constructor(dialogRef, data, storage) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.storage = storage;
      this.message = this.data.message;
      this.type = this.data.type;
      this.mode = this.data.mode;
      this.countString = "";
      this.dataToShow = [];
      this.allOrgsNames = [];
    }
    ngOnInit() {
      var _this = this;
      return (0, default)(function* () {
        const user = yield firstValueFrom(_this.storage.getUserObservable().pipe((0, take)(1)));
        if (_this.mode === "org") {
          _this.allOrgsNames = [user.userData.organization];
        } else {
          _this.allOrgsNames = (yield _this.storage.database.driver.getAllOrganizations()).map(org => org.name);
        }
        _this.selectedOrg = _this.allOrgsNames[0];
        _this.loadOrgUsers(_this.selectedOrg);
      })();
    }
    get isOrgMode() {
      return this.mode === "org";
    }
    loadOrgUsers(org) {
      this.storage.database.driver.getOrganizationUsers(org).then(users => {
        this.dataToShow = [];
        for (let user of users) {
          const u = user;
          this.dataToShow.push({
            name: u.Name,
            email: u.Email,
            status: this.message[this.type].includes(u.uid)
          });
        }
        this.countString = "  (" + this.dataToShow.filter(itm => itm.status).length + " of " + users.length + ")";
        this.dataToShow.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      });
    }
    changedSelectedOrg($event) {
      this.selectedOrg = $event.target.value;
      this.loadOrgUsers(this.selectedOrg);
    }
    static #_ = (() => this.ɵfac = function PopupViewsOrConfirmsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PopupViewsOrConfirmsComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(StorageService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: PopupViewsOrConfirmsComponent,
      selectors: [["opcloud-popup-views-or-confirms"]],
      decls: 10,
      vars: 3,
      consts: [[2, "text-align", "center", "color", "#1A3763"], ["id", "orgSelection", 4, "ngIf"], [2, "overflow", "auto", "height", "450px"], [4, "ngFor", "ngForOf"], [2, "margin-top", "15px", "text-align", "center"], ["mat-button", "", 3, "click"], ["id", "orgSelection"], [2, "margin-right", "5px"], ["id", "selectDiv"], [3, "change", "value", "disabled"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], ["width", "13", "height", "13", "viewBox", "0 0 13 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["width", "13", "height", "13", "viewBox", "0 0 13 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["cx", "6.5", "cy", "6.5", "r", "6.5", "fill", "#0EF309"], ["d", "M3.25386 6.7344L4.80851 9.76861L10.0771 2.85527", "stroke", "white"], ["cx", "6.5", "cy", "6.5", "r", "6.5", "fill", "#FF0000"], ["x", "3", "y", "3.70703", "width", "1", "height", "9", "rx", "0.5", "transform", "rotate(-45 3 3.70703)", "fill", "white"], ["x", "3.70703", "y", "10.071", "width", "1", "height", "9", "rx", "0.5", "transform", "rotate(-135 3.70703 10.071)", "fill", "white"]],
      template: function PopupViewsOrConfirmsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "div", 0)(2, "h2");
          core /* ɵɵtext */.EFF(3);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(4, PopupViewsOrConfirmsComponent_div_4_Template, 6, 3, "div", 1);
          core /* ɵɵelementStart */.j41(5, "div", 2);
          core /* ɵɵtemplate */.DNE(6, PopupViewsOrConfirmsComponent_div_6_Template, 6, 4, "div", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div", 4)(8, "button", 5);
          core /* ɵɵlistener */.bIt("click", function PopupViewsOrConfirmsComponent_Template_button_click_8_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(9, "Close");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵtextInterpolate */.JRh((ctx.type === "confirms" ? "Message Confirmations" : "Message Views") + ctx.countString);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.mode === "system");
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.dataToShow);
        }
      },
      dependencies: [NgForOf, NgIf, MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: ["#selectDiv[_ngcontent-%COMP%]{width:150px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}select[_ngcontent-%COMP%]{display:block;width:150px;background-image:url(select_arrow.a4ed714c584e5393.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}#orgSelection[_ngcontent-%COMP%]{width:100%;display:inline-flex;margin-bottom:10px;align-items:center;justify-content:center}"]
    }))();
  }
  return PopupViewsOrConfirmsComponent;
})();