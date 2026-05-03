// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/shared/calander/calander.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let CalanderComponent = /*#__PURE__*/(() => {
  class CalanderComponent {
    constructor(pipe) {
      this.pipe = pipe;
      this.dateChange = new EventEmitter();
      /**
       * Alon: do not remove!
       * Slayer: will be removed!
       */
      // this.Date.isLeapYear = function (year) {
      //   return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
      // };
      //
      // this.Date.getDaysInMonth = function (year, month) {
      //   return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
      // };
      //
      // this.Date.prototype.isLeapYear = function () {
      //   return Date.isLeapYear(this.getFullYear());
      // };
      //
      // this.Date.prototype.getDaysInMonth = function () {
      //   return this.Date.getDaysInMonth(this.getFullYear(), this.getMonth());
      // };
      //
      // this.Date.prototype.addMonths = function (value) {
      //   var n = this.getDate();
      //   this.setDate(1);
      //   this.setMonth(this.getMonth() + value);
      //   this.setDate(Math.min(n, this.getDaysInMonth()));
      //   return this;
      // };
    }
    get formattedDate() {
      return this.pipe.transform(this.date, "yyyy-MM-dd");
    }
    set formattedDate(date) {
      this.date = new Date(date).getTime();
      this.dateChange.emit(this.date);
    }
    static #_ = (() => this.ɵfac = function CalanderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CalanderComponent)(core /* ɵɵdirectiveInject */.rXU(DatePipe));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CalanderComponent,
      selectors: [["opcloud-calander"]],
      inputs: {
        date: "date"
      },
      outputs: {
        dateChange: "dateChange"
      },
      decls: 2,
      vars: 1,
      consts: [[1, "calanderContainer"], ["type", "date", 3, "ngModelChange", "ngModel"]],
      template: function CalanderComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "span", 0)(1, "input", 1);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function CalanderComponent_Template_input_ngModelChange_1_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.formattedDate, $event)) {
              ctx.formattedDate = $event;
            }
            return $event;
          });
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.formattedDate);
        }
      },
      dependencies: [DefaultValueAccessor, NgControlStatus, NgModel]
    }))();
  }
  return CalanderComponent;
})();