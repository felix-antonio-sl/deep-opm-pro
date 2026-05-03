// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/group-mgmt/update-user-grp/member-grp/member-grp.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function MemberGrpComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "p");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const grp_r1 = ctx.$implicit;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(grp_r1.$value);
  }
}
let MemberGrpComponent = /*#__PURE__*/(() => {
  class MemberGrpComponent {
    constructor(dialogRef, dialogData) {
      this.dialogRef = dialogRef;
      this.dialogData = dialogData;
    }
    ngOnInit() {
      this.user = this.dialogData[0];
      this.ref = this.dialogData[1];
      this.memRef = this.dialogData[2];
      this.mGroups = this.dialogData[4];
    }
    getIterableGrps(groups) {
      const arrayGroups = [];
      if (groups === undefined) {
        return arrayGroups;
      }
      for (const key of Object.keys(groups)) {
        if (groups[key] !== undefined) {
          arrayGroups.push(groups[key]);
        }
      }
      return arrayGroups;
    }
    static #_ = (() => this.ɵfac = function MemberGrpComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MemberGrpComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA, 8));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MemberGrpComponent,
      selectors: [["opcloud-memgrp-dialog"]],
      decls: 3,
      vars: 1,
      consts: [[4, "ngFor", "ngForOf"]],
      template: function MemberGrpComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "h1");
          core /* ɵɵtext */.EFF(1, "Profile memberships: ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(2, MemberGrpComponent_div_2_Template, 3, 1, "div", 0);
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.memGrp);
        }
      },
      dependencies: [NgForOf],
      styles: [".selected[_ngcontent-%COMP%]{background:#87cefa}"]
    }))();
  }
  return MemberGrpComponent;
})();