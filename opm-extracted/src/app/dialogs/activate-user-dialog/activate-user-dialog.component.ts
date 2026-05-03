// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/activate-user-dialog/activate-user-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let ActivateUserDialogComponent = /*#__PURE__*/(() => {
  class ActivateUserDialogComponent {
    constructor(service, data, dialog) {
      this.service = service;
      this.data = data;
      this.dialog = dialog;
      this.details = {
        Name: undefined,
        Email: undefined,
        PhotoURL: undefined,
        SysAdmin: undefined,
        OrgAdmin: undefined,
        exp_date: undefined
      };
    }
    ngOnInit() {
      this.user = this.data.user;
      this.details.SysAdmin = this.user.SysAdmin;
      this.details.OrgAdmin = this.user.OrgAdmin;
      this.details.exp_date = new Date().getTime() + 5184000000; // if this dialog is called then the user exp date had passed, the default should be two month ahead.
      this.isPermanent = this.user.exp_date === "";
    }
    activateUserDialog() {
      const curr = this;
      if (curr.isPermanent) {
        curr.details.exp_date = "";
      }
      curr.service.updateUser(curr.user.uid, curr.data.organization, curr.details).then(res => {
        Object.keys(curr.details).forEach(key => {
          if (curr.details[key] || key === "exp_date") {
            curr.user[key] = curr.details[key];
          }
        });
        curr.dialog.closeAll();
      });
    }
    cancelActivateUserDialog() {
      this.dialog.closeAll();
    }
    static #_ = (() => this.ɵfac = function ActivateUserDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ActivateUserDialogComponent)(core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ActivateUserDialogComponent,
      selectors: [["opcloud-activate-user-dialog"]],
      decls: 19,
      vars: 2,
      consts: [["id", "ActivateUserComponent"], [3, "dateChange", "date"], ["type", "checkbox", "name", "isPermanent", 3, "ngModelChange", "ngModel"], ["id", "buttonsWrapper"], ["mat-button", "Activate User", "id", "ActivateUserButton", 3, "click"], ["mat-button", "Cancel", 3, "click"]],
      template: function ActivateUserDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "form")(2, "table")(3, "tr")(4, "td");
          core /* ɵɵtext */.EFF(5, "Expiration Date");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "td")(7, "opcloud-calander", 1);
          core /* ɵɵtwoWayListener */.mxI("dateChange", function ActivateUserDialogComponent_Template_opcloud_calander_dateChange_7_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.details.exp_date, $event)) {
              ctx.details.exp_date = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(8, "tr");
          core /* ɵɵelement */.nrm(9, "td");
          core /* ɵɵelementStart */.j41(10, "td")(11, "input", 2);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function ActivateUserDialogComponent_Template_input_ngModelChange_11_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.isPermanent, $event)) {
              ctx.isPermanent = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(12, " Permanent Access ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelement */.nrm(13, "br");
          core /* ɵɵelementStart */.j41(14, "div", 3)(15, "button", 4);
          core /* ɵɵlistener */.bIt("click", function ActivateUserDialogComponent_Template_button_click_15_listener() {
            return ctx.activateUserDialog();
          });
          core /* ɵɵtext */.EFF(16, "Activate User");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "button", 5);
          core /* ɵɵlistener */.bIt("click", function ActivateUserDialogComponent_Template_button_click_17_listener() {
            return ctx.cancelActivateUserDialog();
          });
          core /* ɵɵtext */.EFF(18, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵtwoWayProperty */.R50("date", ctx.details.exp_date);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.isPermanent);
        }
      },
      dependencies: [MatButton, CalanderComponent, fesm2022_forms /* ɵNgNoValidate */.qT, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm],
      styles: ["#ActivateUserComponent[_ngcontent-%COMP%]{overflow:auto;text-align:center}button[_ngcontent-%COMP%]{background:#1a3763;color:#fff}#buttonsDivider[_ngcontent-%COMP%]{width:2px}#buttonsWrapper[_ngcontent-%COMP%]{text-align:center}#ActivateUserButton[_ngcontent-%COMP%]{margin-right:5px}"]
    }))();
    static #_3 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ActivateUserDialogComponent,
      factory: ActivateUserDialogComponent.ɵfac
    }))();
  }
  return ActivateUserDialogComponent;
})();