// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/organization-mgmt/delete-org/delete-org.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function DeleteOrgComponent_mat_option_8_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 5);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r1 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("value", org_r1.name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r1.name);
  }
}
let DeleteOrgComponent = /*#__PURE__*/(() => {
  class DeleteOrgComponent {
    constructor(orgService, dialog) {
      this.orgService = orgService;
      this.dialog = dialog;
      this.selectedOrg = "";
    }
    ngOnInit() {
      this.orgS = this.orgService.getOrganizations();
    }
    getOrg(event) {
      this.selectedOrg = event.value;
    }
    deleteOrg() {
      if (window.confirm("Are sure you want to delete this organization: " + this.selectedOrg + "?")) {
        this.orgService.deleteOrganization(this.selectedOrg).then(() => {
          (0, validationAlert)("Organization Deleted Successfully!", null, "Success");
        }).catch(err => {
          (0, validationAlert)("ERRROR! Organization couldn't be deleted: " + err, null, "Error");
        });
      }
    }
    static #_ = (() => this.ɵfac = function DeleteOrgComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DeleteOrgComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: DeleteOrgComponent,
      selectors: [["opcloud-delete-org"]],
      decls: 15,
      vars: 3,
      consts: [[1, "h2"], ["placeholder", "Organization", 1, "select", 3, "selectionChange"], ["label", "Select Organization"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "button", 1, "delOrg", 3, "click"], [3, "value"]],
      template: function DeleteOrgComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "h2", 0)(2, "b")(3, "u")(4, "i");
          core /* ɵɵtext */.EFF(5, "Choose Organization: ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(6, "mat-select", 1);
          core /* ɵɵlistener */.bIt("selectionChange", function DeleteOrgComponent_Template_mat_select_selectionChange_6_listener($event) {
            return ctx.getOrg($event);
          });
          core /* ɵɵelementStart */.j41(7, "mat-optgroup", 2);
          core /* ɵɵtemplate */.DNE(8, DeleteOrgComponent_mat_option_8_Template, 2, 2, "mat-option", 3);
          core /* ɵɵpipe */.nI1(9, "async");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(10, "br")(11, "br")(12, "br");
          core /* ɵɵelementStart */.j41(13, "button", 4);
          core /* ɵɵlistener */.bIt("click", function DeleteOrgComponent_Template_button_click_13_listener() {
            return ctx.deleteOrg();
          });
          core /* ɵɵtext */.EFF(14, "Delete Org");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("ngForOf", core /* ɵɵpipeBind1 */.bMT(9, 1, ctx.orgS));
        }
      },
      dependencies: [NgForOf, MatSelect, MatOption, MatOptgroup, AsyncPipe],
      styles: [".delOrg[_ngcontent-%COMP%]{background-color:indigo;border:none;color:#fff;padding:1px 14px;text-align:center;text-decoration:none;display:inline-block;font-size:16px}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return DeleteOrgComponent;
})();