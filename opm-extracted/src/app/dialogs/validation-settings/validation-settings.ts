// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/validation-settings/validation-settings.ts
// Extracted by opm-extracted/tools/extract.mjs

let ValidationSettingsComponent = /*#__PURE__*/(() => {
  class ValidationSettingsComponent {
    constructor(dialogRef, userService, modelService, init) {
      this.dialogRef = dialogRef;
      this.userService = userService;
      this.modelService = modelService;
      this.init = init;
    }
    ngOnInit() {
      const settings = this.userService.user?.userData?.opl;
      const validationTime = settings.validationTime?.toString() || "1";
      const enforcement = settings.validationEnforcementLevel?.toString() || "1";
      $("#validationSelect")[0].value = validationTime;
      $("#enforcementSelect")[0].value = enforcement;
    }
    apply() {
      const values = {
        validationTime: Number($("#validationSelect")[0].value),
        validationEnforcementLevel: Number($("#enforcementSelect")[0].value)
      };
      this.userService.updateUserValidationSettings(values).then(r => {
        this.modelService.model.validation = (0, getValidationObject)(values.validationTime, values.validationEnforcementLevel);
        this.dialogRef.close();
      });
    }
    exportToExcel() {
      const logicalObjects = this.init.opmModel.logicalElements.filter(l => OPCloudUtils.isInstanceOfLogicalObject(l) && l?.computationModule?.validationModule.isActive());

      const workbook = new ExcelJS.Workbook();
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet("Validation Values");
      worksheet.views = [{
        state: "normal"
      }];
      const row1 = worksheet.getRow(1);
      const row2 = worksheet.getRow(2);
      let idx = 1;
      for (const log of logicalObjects) {
        row1.getCell(idx).value = log.text;
        row2.getCell(idx).value = log.value !== "value" ? log.value : log.computationModule.getRange();
        const color = (0, getValidationColor)(log);
        row2.getCell(idx).fill = {
          type: "gradient",
          gradient: "path",
          center: {
            left: 0.5,
            top: 0.5
          },
          stops: [{
            position: 0,
            color: {
              argb: color
            }
          }, {
            position: 1,
            color: {
              argb: color
            }
          }]
        };
        row1.getCell(idx).alignment = {
          vertical: "center",
          horizontal: "center"
        };
        row2.getCell(idx).alignment = {
          vertical: "center",
          horizontal: "center"
        };
        worksheet.getColumn(idx).width = (log.text?.length || 20) + 5;
        idx++;
      }
      workbook.xlsx.writeBuffer().then(data => {
        let blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        FileSaver_min.saveAs(blob, "ValidationValues.xlsx");
      });
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function ValidationSettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ValidationSettingsComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(ModelService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ValidationSettingsComponent,
      selectors: [["validation-settings"]],
      decls: 31,
      vars: 0,
      consts: [[2, "margin-left", "39px"], [1, "flexInline"], [1, "selectDiv"], ["id", "validationSelect"], ["value", "1"], ["value", "2"], ["value", "3"], ["id", "enforcementSelect"], ["id", "footerButtons"], ["mat-button", "", 1, "footerBtn", 3, "click"]],
      template: function ValidationSettingsComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div")(1, "h3");
          core /* ɵɵtext */.EFF(2, "Model Validation Options:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "div", 0)(4, "div", 1)(5, "span");
          core /* ɵɵtext */.EFF(6, "Validation Time:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div", 2)(8, "select", 3)(9, "option", 4);
          core /* ɵɵtext */.EFF(10, "Design time");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(11, "option", 5);
          core /* ɵɵtext */.EFF(12, "Execution Time");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(13, "option", 6);
          core /* ɵɵtext */.EFF(14, "Design time & Execution Time");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(15, "div", 1)(16, "span");
          core /* ɵɵtext */.EFF(17, "Enforcement level:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "div", 2)(19, "select", 7)(20, "option", 4);
          core /* ɵɵtext */.EFF(21, "Soft Validation");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(22, "option", 5);
          core /* ɵɵtext */.EFF(23, "Hard Validation");
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵelementStart */.j41(24, "div", 8)(25, "button", 9);
          core /* ɵɵlistener */.bIt("click", function ValidationSettingsComponent_Template_button_click_25_listener() {
            return ctx.apply();
          });
          core /* ɵɵtext */.EFF(26, "Apply");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(27, "button", 9);
          core /* ɵɵlistener */.bIt("click", function ValidationSettingsComponent_Template_button_click_27_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(28, "Cancel");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(29, "button", 9);
          core /* ɵɵlistener */.bIt("click", function ValidationSettingsComponent_Template_button_click_29_listener() {
            return ctx.exportToExcel();
          });
          core /* ɵɵtext */.EFF(30, "Download Excel");
          core /* ɵɵelementEnd */.k0s()();
        }
      },
      dependencies: [MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7],
      styles: ["p[_ngcontent-%COMP%]{text-align:center}h3[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-top:3px}.selectDiv[_ngcontent-%COMP%]{width:245px;margin-left:20px;margin-top:-2px;border:1px solid rgba(88,109,140,.5);border-radius:4px;padding:3px}.selectDiv[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:240px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;font-size:medium;Opacity:70%;text-align-last:center;outline-color:#ffd67000}.flexInline[_ngcontent-%COMP%]{display:inline-flex;margin-top:8px;color:#1a3763}#footerButtons[_ngcontent-%COMP%]{width:270px;display:flex;align-items:center;height:50px;margin-top:30px;margin-left:calc(50% - 135px)}.footerBtn[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763;padding:5px;margin:5px;letter-spacing:normal}button[_ngcontent-%COMP%]{margin:auto}"]
    }))();
  }
  return ValidationSettingsComponent;
})();