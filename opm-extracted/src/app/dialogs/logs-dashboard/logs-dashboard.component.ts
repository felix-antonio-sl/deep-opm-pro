// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/logs-dashboard/logs-dashboard.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function LogsDashboardComponent_div_1_mat_spinner_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "mat-spinner");
  }
}
function LogsDashboardComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 16);
    core /* ɵɵtemplate */.DNE(1, LogsDashboardComponent_div_1_mat_spinner_1_Template, 1, 0, "mat-spinner", 2);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r0.isLoadingResults);
  }
}
function LogsDashboardComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div")(1, "div", 17);
    core /* ɵɵtext */.EFF(2, " API Error, please try again later ");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function LogsDashboardComponent_mat_option_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 18);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r2 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", org_r2.name);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r2.name);
  }
}
function LogsDashboardComponent_mat_option_10_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 19);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const user_r3 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", user_r3);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(user_r3.Name);
  }
}
function LogsDashboardComponent_ng_container_15_th_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "th", 23);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const colIndex_r4 = core /* ɵɵnextContext */.XpG().index;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r0.displayedColumnLabels[colIndex_r4], " ");
  }
}
function LogsDashboardComponent_ng_container_15_td_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "td", 24);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const element_r5 = ctx.$implicit;
    const colIndex_r4 = core /* ɵɵnextContext */.XpG().index;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", ctx_r0.trim(element_r5[ctx_r0.displayedColumns[colIndex_r4]]), " ");
  }
}
function LogsDashboardComponent_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementContainerStart */.qex(0, 20);
    core /* ɵɵtemplate */.DNE(1, LogsDashboardComponent_ng_container_15_th_1_Template, 2, 1, "th", 21)(2, LogsDashboardComponent_ng_container_15_td_2_Template, 2, 1, "td", 22);
    core /* ɵɵelementContainerEnd */.bVm();
  }
  if (rf & 2) {
    const colIndex_r4 = ctx.index;
    const ctx_r0 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("matColumnDef", ctx_r0.displayedColumns[colIndex_r4]);
  }
}
function LogsDashboardComponent_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "tr", 25);
  }
}
function LogsDashboardComponent_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "tr", 26);
    core /* ɵɵlistener */.bIt("click", function LogsDashboardComponent_tr_17_Template_tr_click_0_listener() {
      const row_r7 = core /* ɵɵrestoreView */.eBV(_r6).$implicit;
      const ctx_r0 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r0.rowClicked(row_r7));
    });
    core /* ɵɵelementEnd */.k0s();
  }
}
const logs_dashboard_component_HEADERS = {
  LABELS: ["Timestamp", "Organization", "Modeler", "Model", "Error Message", "Steps"],
  ATTRIBUTES: ["createdAt", "userOrganization", "userName", "modelName", "errorMessage", "steps"]
};
const ELEMENT_DATA = [{
  timestamp: new Date().toLocaleString(),
  modeler_name: "Eddie",
  model_url: "localhost:4200/group15/final_model",
  error_message: "failed to load model",
  steps: []
}];
const API_RESPONSE_PAGES = [{
  items: [{
    timestamp: new Date().toLocaleString(),
    modeler_name: "Eddie1",
    model_url: "localhost:4200/group15/final_model1",
    error_message: "failed to load model1",
    steps: []
  }],
  total_count: 3
}, {
  items: [{
    timestamp: new Date().toLocaleString(),
    modeler_name: "Eddie2",
    model_url: "localhost:4200/group15/final_model2",
    error_message: "failed to load model2",
    steps: []
  }],
  total_count: 3
}, {
  items: [{
    timestamp: new Date().toLocaleString(),
    modeler_name: "Eddie3",
    model_url: "localhost:4200/group15/final_model3",
    error_message: "failed to load model3",
    steps: []
  }],
  total_count: 3
}];
const ALL_USER = {
  Name: "All Users",
  uid: ""
};
const ALL_ORGS = {
  name: "All Organizations"
};
let LogsDashboardComponent = /*#__PURE__*/(() => {
  class LogsDashboardComponent {
    constructor(orgService, dialog) {
      this.orgService = orgService;
      this.dialog = dialog;
      this.displayedColumns = logs_dashboard_component_HEADERS.ATTRIBUTES;
      this.displayedColumnLabels = logs_dashboard_component_HEADERS.LABELS;
      this.dataUpdates = new BehaviorSubject(0);
      this.users = [ALL_USER];
      this.user = ALL_USER;
      this.data = new MatTableDataSource([]);
      // data: GithubIssue[] = [];
      this.MAX_TEXT_SIZE = 60;
      this.pageSize = 50;
      this.userFilterCache = "";
      this.userFilter = "";
      this.resultsLength = 0;
      this.isLoadingResults = true;
      this.isRateLimitReached = false;
      this.orgs = [];
    }
    ngOnInit() {
      const that = this;
      this.organizations$ = this.orgService.getOrganizations();
      this.organizations$.subscribe(orgs => {
        that.orgs = [ALL_ORGS].concat(orgs);
        that.organization = ALL_ORGS.name;
        // if (orgs.length > 0) {
        //   this.organization = orgs[0].name
        //   this.selectOrganization({ value: this.organization });
        // }
        this.showAllOrganizations();
      });
    }
    showAllOrganizations() {
      this.isLoadingResults = true;
      Promise.all(this.orgs.map(o => this.orgService.getOrganizationUsers(o.name))).then(users => {
        this.users = [ALL_USER].concat(...users);
        this.user = ALL_USER;
        this.isLoadingResults = false;
      });
    }
    selectOrganization(org) {
      if (org.value === ALL_ORGS.name) {
        return this.showAllOrganizations();
      }
      this.orgService.getOrganizationUsers(org.value).then(users => {
        this.users = [ALL_USER].concat(users);
        this.user = ALL_USER;
        this.refresh();
      });
    }
    rowClicked(row) {
      const that = this;
      if (this.dialog.openDialogs.length > 0) {
        return;
      }
      const dialogRef = this.dialog.open(LogsDashboardDialogComponent, {
        data: row
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          that.removeItem(value);
        }
      });
    }
    removeItem(item) {
      const itemInData = this.data.data.find(it => it.id === item.id);
      if (itemInData) {
        const idx = this.data.data.indexOf(itemInData);
        if (idx === -1) {
          return;
        }
        this.data.data.splice(idx, 1);
        this.data.paginator = this.paginator;
        this.data._updateChangeSubscription();
        this.orgService.removeLog(itemInData.id);
      }
    }
    refresh() {
      if (this.paginator.pageIndex == 0) {
        this.dataUpdates.next(0);
      } else {
        this.paginator.firstPage();
      }
    }
    selectUser(user) {
      this.refresh();
    }
    filterByUser() {
      this.userFilter = this.userFilterCache;
      this.refresh();
      // this.paginator.pageIndex = 0
    }
    displayTimestamp(timestamp) {
      return new Date(timestamp * 1000).toLocaleString();
    }
    trim(text) {
      if ((text || "").length > this.MAX_TEXT_SIZE) {
        return text.substring(0, this.MAX_TEXT_SIZE - 3) + "...";
      } else {
        return text;
      }
    }
    ngAfterViewInit() {
      // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
      // this.data.paginator = this.paginator;
      // this.data.paginator = this.paginator;
      // this.paginator.hidePageSize = true;
      (0, merge)(this.paginator.page, this.dataUpdates).pipe((0, startWith)({}), (0, switchMap)(() => {
        this.isLoadingResults = true;
        if (this.userFilter != "" || this.user != ALL_USER) {
          // return this.orgService.getLogs(this.pageSize, this.paginator.pageIndex * this.pageSize, this.getUserIdentifier(this.userFilter))
          return this.orgService.getLogs(this.pageSize, this.paginator.pageIndex * this.pageSize, this.user.uid);
          // return this.exampleDatabase!.getUserLogs(this.getUserIdentifier(this.userFilter), this.paginator.pageIndex);
        } else {
          return this.orgService.getLogs(this.pageSize, this.paginator.pageIndex * this.pageSize);
          // return this.exampleDatabase!.getAllLogs(this.paginator.pageIndex);
        }
      }), (0, map)(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.logsCounter;
        let logs = data.logs;
        if (this.organization !== ALL_ORGS.name) {
          logs = logs.filter(lg => lg.userOrganization === this.organization);
        }
        logs.map(element => {
          element.createdAt = this.displayTimestamp(element.timestamp);
          return element;
        });
        return logs;
      }), catchError_catchError(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return (0, observable_of.of)([]);
      })).subscribe(data => this.data.data = data);
    }
    static #_ = (() => this.ɵfac = function LogsDashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LogsDashboardComponent)(core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: LogsDashboardComponent,
      selectors: [["opcloud-logs-dashboard"]],
      viewQuery: function LogsDashboardComponent_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(MatPaginator, 5);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.paginator = _t.first;
          }
        }
      },
      decls: 19,
      vars: 12,
      consts: [[1, "example-container", "mat-elevation-z8"], ["class", "example-loading-shade", 4, "ngIf"], [4, "ngIf"], ["id", "logs-container"], [2, "width", "300px", "margin-left", "10px", "margin-top", "10px"], ["id", "opc-selection-multi-org1", 3, "ngModelChange", "selectionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [2, "width", "300px", "margin-top", "10px"], ["id", "opc-selection-multi-org2", 3, "ngModelChange", "selectionChange", "ngModel"], ["style", "color: #1A3763", 3, "value", 4, "ngFor", "ngForOf"], ["mat-icon-button", "", 2, "position", "absolute", "margin-top", "22px", "color", "#1A3763", 3, "click"], ["mat-table", "", 1, "example-table", 2, "width", "100%", "color", "#1A3763", 3, "dataSource"], [3, "matColumnDef", 4, "ngFor", "ngForOf"], ["style", "color: #1A3763", "mat-header-row", "", 4, "matHeaderRowDef"], ["style", "color: #1A3763", "mat-row", "", 3, "click", 4, "matRowDef", "matRowDefColumns"], [2, "color", "#1A3763", 3, "length", "pageSize"], [1, "example-loading-shade"], [1, "example-rate-limit-reached"], [3, "value"], [2, "color", "#1A3763", 3, "value"], [3, "matColumnDef"], ["style", "color: #1A3763", "mat-header-cell", "", 4, "matHeaderCellDef"], ["style", "color: #1A3763", "mat-cell", "", 4, "matCellDef"], ["mat-header-cell", "", 2, "color", "#1A3763"], ["mat-cell", "", 2, "color", "#1A3763"], ["mat-header-row", "", 2, "color", "#1A3763"], ["mat-row", "", 2, "color", "#1A3763", 3, "click"]],
      template: function LogsDashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0);
          core /* ɵɵtemplate */.DNE(1, LogsDashboardComponent_div_1_Template, 2, 1, "div", 1)(2, LogsDashboardComponent_div_2_Template, 3, 0, "div", 2);
          core /* ɵɵelementStart */.j41(3, "div")(4, "div", 3)(5, "mat-form-field", 4)(6, "mat-select", 5);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LogsDashboardComponent_Template_mat_select_ngModelChange_6_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.organization, $event)) {
              ctx.organization = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function LogsDashboardComponent_Template_mat_select_selectionChange_6_listener($event) {
            return ctx.selectOrganization($event);
          });
          core /* ɵɵtemplate */.DNE(7, LogsDashboardComponent_mat_option_7_Template, 2, 2, "mat-option", 6);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(8, "mat-form-field", 7)(9, "mat-select", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function LogsDashboardComponent_Template_mat_select_ngModelChange_9_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.user, $event)) {
              ctx.user = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("selectionChange", function LogsDashboardComponent_Template_mat_select_selectionChange_9_listener($event) {
            return ctx.selectUser($event);
          });
          core /* ɵɵtemplate */.DNE(10, LogsDashboardComponent_mat_option_10_Template, 2, 2, "mat-option", 9);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(11, "button", 10);
          core /* ɵɵlistener */.bIt("click", function LogsDashboardComponent_Template_button_click_11_listener() {
            return ctx.refresh();
          });
          core /* ɵɵelementStart */.j41(12, "mat-icon");
          core /* ɵɵtext */.EFF(13, "refresh");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(14, "table", 11);
          core /* ɵɵtemplate */.DNE(15, LogsDashboardComponent_ng_container_15_Template, 3, 1, "ng-container", 12)(16, LogsDashboardComponent_tr_16_Template, 1, 0, "tr", 13)(17, LogsDashboardComponent_tr_17_Template, 1, 0, "tr", 14);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(18, "mat-paginator", 15);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isLoadingResults);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isRateLimitReached);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.organization);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.orgs);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.user);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.users);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("dataSource", ctx.data);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.displayedColumns);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("matHeaderRowDef", ctx.displayedColumns);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("matRowDefColumns", ctx.displayedColumns);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("length", ctx.resultsLength)("pageSize", ctx.pageSize);
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatIcon, MatSelect, MatOption, MatIconButton, MatProgressSpinner, NgControlStatus, NgModel, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatPaginator],
      styles: [".example-loading-shade[_ngcontent-%COMP%]{position:absolute;inset:0 0 56px;background:#00000026;z-index:1;display:flex;align-items:center;justify-content:center}.example-rate-limit-reached[_ngcontent-%COMP%]{color:#980000;max-width:360px;text-align:center}#logs-container[_ngcontent-%COMP%]{align-items:center}table[_ngcontent-%COMP%]{width:100%}"]
    }))();
  }
  return LogsDashboardComponent;
})();
/** An example database that the data source uses to retrieve data for the table. */
class ExampleHttpDatabase {
  constructor(_httpClient) {
    this._httpClient = _httpClient;
  }
  getAllLogs(page) {
    // console.log(`getting all logs in page ${page}`)
    return of(API_RESPONSE_PAGES[page]);
  }
  getUserLogs(uid, page) {
    // console.log(`getting all user ${uid} logs in page ${page}`)
    return of(API_RESPONSE_PAGES[page]);
  }
}