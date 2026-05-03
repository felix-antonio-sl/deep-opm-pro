// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/templates-import/templates-import.ts
// Extracted by opm-extracted/tools/extract.mjs

function TemplatesComponent_mat_tab_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-tab", 6);
    core /* ɵɵelement */.nrm(1, "app-load-model-dialog", 3);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("alternativeData", ctx_r0.orgTemplatesSettings);
  }
}
function TemplatesComponent_mat_tab_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-tab", 7);
    core /* ɵɵelement */.nrm(1, "app-load-model-dialog", 3);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("alternativeData", ctx_r0.globalTemplatesSettings);
  }
}
let TemplatesComponent = /*#__PURE__*/(() => {
  class TemplatesComponent {
    constructor(userService, dialogRef, data) {
      this.userService = userService;
      this.dialogRef = dialogRef;
      this.data = data;
      this.isGlobalEnabled = false;
      this.isOrganizationalEnabled = false;
      this.title = "";
    }
    ngOnInit() {
      this.privateTemplatesSettings = this.getSettings(TemplateType.PERSONAL);
      this.orgTemplatesSettings = this.getSettings(TemplateType.ORG);
      this.globalTemplatesSettings = this.getSettings(TemplateType.SYS);
      this.setTitle();
      this.setIsOrganizationalEnabled();
      this.setIsGlobalEnabled();
    }
    setTitle() {
      switch (this.data.mode) {
        case "save":
          this.title = "Save Template";
          break;
        case "edit":
          this.title = "Edit Template";
          break;
        case "import":
          this.title = "Insert Template";
          break;
      }
    }
    setIsOrganizationalEnabled() {
      if (this.data.mode === "import" || this.userService.isOrgAdmin() || this.userService.isSysAdmin()) {
        this.isOrganizationalEnabled = true;
      }
    }
    setIsGlobalEnabled() {
      if (this.data.mode === "import" || this.userService.isSysAdmin()) {
        this.isGlobalEnabled = true;
      }
    }
    getSettings(type) {
      const mode = this.data.mode === "save" ? StorageMode.SAVE : StorageMode.LOAD;
      const importMode = this.data.mode === "import";
      return {
        height: Math.round(window.innerHeight * 0.9) + "px",
        width: Math.round(window.innerWidth * 0.75) + "px",
        data: {
          path: "",
          showVersions: false,
          mode: mode,
          name: "",
          description: "",
          showArchivedModels: false,
          archiveMode: false,
          screenType: ScreenType.TEMPLATES,
          templateType: type,
          isImportMode: importMode
        }
      };
    }
    static #_ = (() => this.ɵfac = function TemplatesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || TemplatesComponent)(core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: TemplatesComponent,
      selectors: [["opcloud-templates-import"]],
      decls: 8,
      vars: 4,
      consts: [[1, "insertTemplate"], ["animationDuration", "0ms", 2, "height", "calc(100% - 50px)"], ["label", "Private"], [3, "alternativeData"], ["label", "Organizational", 4, "ngIf"], ["label", "Global", 4, "ngIf"], ["label", "Organizational"], ["label", "Global"]],
      template: function TemplatesComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "p");
          core /* ɵɵtext */.EFF(2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "mat-tab-group", 1)(4, "mat-tab", 2);
          core /* ɵɵelement */.nrm(5, "app-load-model-dialog", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(6, TemplatesComponent_mat_tab_6_Template, 2, 1, "mat-tab", 4)(7, TemplatesComponent_mat_tab_7_Template, 2, 1, "mat-tab", 5);
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtextInterpolate */.JRh(ctx.title);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("alternativeData", ctx.privateTemplatesSettings);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isOrganizationalEnabled);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isGlobalEnabled);
        }
      },
      dependencies: [NgIf, MatTab, MatTabGroup, LoadModelDialogComponent],
      styles: [".insertTemplate   [_nghost-%COMP%]   .mat-mdc-tab-body-wrapper[_ngcontent-%COMP%]{height:100%!important}.insertTemplate   [_nghost-%COMP%]   .mat-mdc-tab-body--active[_ngcontent-%COMP%]{height:100%!important}.insertTemplate[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(.mat-mdc-tab-label--active:not(.mat-mdc-tab-disabled), .mat-mdc-tab-label--active.cdk-keyboard-focused[_ngcontent-%COMP%]:not(.mat-mdc-tab-disabled)){background-color:#fff}.insertTemplate[_ngcontent-%COMP%]   .mat-mdc-ink-bar[_ngcontent-%COMP%]{background-color:#1a3763!important}.insertTemplate[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763}"]
    }))();
  }
  return TemplatesComponent;
})();