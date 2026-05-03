// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/organization-mgmt/new-org/new-org.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function SettingsNewOrg_mat_error_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-error");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r0.ErrorMsg);
  }
}
let SettingsNewOrg = /*#__PURE__*/(() => {
  class SettingsNewOrg {
    constructor(router, userService, orgService, groupService) {
      this.router = router;
      this.userService = userService;
      this.orgService = orgService;
      this.groupService = groupService;
      this.org = {
        Name: ""
      };
      this.ErrorMsg = null;
    }
    ngOnInit() {}
    CreateOrg() {
      return this.orgService.createOrganization(this.org).then(() => {
        (0, validationAlert)("New Organization Created", null, "Success");
        this.org = {
          Name: ""
        };
      }).catch(err => (0, validationAlert)("Some error occurred", null, "Error"));
    }
    isOrgExists(name) {
      //TODO: implement this function in orgService
      return false;
    }
    isAdminEmailExists(mail) {
      //TODO: implement this function in orgService
      return true;
    }
    static #_ = (() => this.ɵfac = function SettingsNewOrg_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SettingsNewOrg)(core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(GroupsService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SettingsNewOrg,
      selectors: [["new-user"]],
      decls: 12,
      vars: 2,
      consts: [[1, "new-org"], [1, "new-org-input"], ["matInput", "", "placeholder", "Name", 3, "ngModelChange", "ngModel"], [1, "new-org-btn", 3, "click"], [4, "ngIf"]],
      template: function SettingsNewOrg_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "h2");
          core /* ɵɵtext */.EFF(1, " Add New Organization");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(2, "div", 0)(3, "p");
          core /* ɵɵtext */.EFF(4, " Organization Name ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "mat-form-field", 1)(6, "mat-label");
          core /* ɵɵtext */.EFF(7, "Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "input", 2);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SettingsNewOrg_Template_input_ngModelChange_8_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.org.Name, $event)) {
              ctx.org.Name = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(9, "button", 3);
          core /* ɵɵlistener */.bIt("click", function SettingsNewOrg_Template_button_click_9_listener() {
            return ctx.CreateOrg();
          });
          core /* ɵɵtext */.EFF(10, " Create New Organization ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(11, SettingsNewOrg_mat_error_11_Template, 2, 1, "mat-error", 4);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.org.Name);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.ErrorMsg);
        }
      },
      dependencies: [NgIf, MatFormField, MatLabel, MatError, MatInput, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: ["h2[_ngcontent-%COMP%]{position:relative;left:50px;top:50px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;margin-bottom:61px;color:#1a3763}p[_ngcontent-%COMP%]{position:relative;top:24px;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:400;line-height:normal;font-size:16px;color:#3b3b3b}[_nghost-%COMP%]   [_nghost-c32][_ngcontent-%COMP%]   .mat-mdc-input-infix[_ngcontent-%COMP%]{position:relative;height:46px}[_nghost-%COMP%]   .mat-mdc-input-underline[_ngcontent-%COMP%]{display:none}.new-org[_ngcontent-%COMP%]{position:relative;left:50px;top:50px}.new-org-btn[_ngcontent-%COMP%]{position:relative;left:-360px;top:74px;height:53px;width:219px;text-align:center;color:#fff;background:#1a3763;border:1px solid rgba(0,0,0,.1);box-sizing:border-box;box-shadow:0 2px 4px #0000001f;border-radius:6px}[_nghost-%COMP%]   .new-org-input[_ngcontent-%COMP%]{position:relative;left:217px;top:-30px;height:46px;width:570px;border:1px solid rgba(73,114,132,.2);border-radius:6px}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return SettingsNewOrg;
})();