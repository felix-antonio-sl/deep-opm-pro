// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/organization-analytics/organization-analytics.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function OrganizationAnalyticsComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 30);
    core /* ɵɵelement */.nrm(1, "mat-spinner");
    core /* ɵɵelementEnd */.k0s();
  }
}
function OrganizationAnalyticsComponent_div_7_mat_option_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-option", 34);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const org_r4 = ctx.$implicit;
    core /* ɵɵproperty */.Y8G("value", org_r4);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(org_r4);
  }
}
function OrganizationAnalyticsComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div")(1, "mat-select", 31);
    core /* ɵɵlistener */.bIt("selectionChange", function OrganizationAnalyticsComponent_div_7_Template_mat_select_selectionChange_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r2);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.onSelectedOrgChange($event));
    });
    core /* ɵɵelementStart */.j41(2, "mat-optgroup", 32);
    core /* ɵɵtemplate */.DNE(3, OrganizationAnalyticsComponent_div_7_mat_option_3_Template, 2, 2, "mat-option", 33);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("value", ctx_r2.selectedOrg);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.orgsNames);
  }
}
function OrganizationAnalyticsComponent_span_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, " out of ");
    core /* ɵɵelementStart */.j41(2, "span", 6);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.data.modelersLimit);
  }
}
function OrganizationAnalyticsComponent_span_19_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1, " out of ");
    core /* ɵɵelementStart */.j41(2, "span", 6);
    core /* ɵɵtext */.EFF(3);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.data.viewersLimit);
  }
}
function OrganizationAnalyticsComponent_tr_32_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr", 35)(1, "td", 36);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td", 37);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td", 38);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const idx_r6 = ctx.index;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(idx_r6 + 1);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r5.Name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(item_r5.Email);
  }
}
function OrganizationAnalyticsComponent_tr_45_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "tr", 35)(1, "td", 39);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "td", 40);
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "td", 41);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const itm_r7 = ctx.$implicit;
    const idx2_r8 = ctx.index;
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(idx2_r8 + 1);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(itm_r7.Name);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(itm_r7.Email);
  }
}
function OrganizationAnalyticsComponent_option_53_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 42);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const option_r9 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("value", option_r9.value)("selected", option_r9.value === ctx_r2.timeRange);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", option_r9.label, " ");
  }
}
function OrganizationAnalyticsComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 43);
    core /* ɵɵelement */.nrm(1, "mat-spinner", 44);
    core /* ɵɵelementEnd */.k0s();
  }
}
function OrganizationAnalyticsComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 45)(1, "div", 46)(2, "div", 47);
    core /* ɵɵtext */.EFF(3, "Active modelers");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(4, "div", 48);
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(6, "div", 46)(7, "div", 47);
    core /* ɵɵtext */.EFF(8, "Time in OPCloud");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(9, "div", 48);
    core /* ɵɵtext */.EFF(10);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(11, "div", 46)(12, "div", 47);
    core /* ɵɵtext */.EFF(13, "Total logins");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(14, "div", 48);
    core /* ɵɵtext */.EFF(15);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(16, "div", 46)(17, "div", 47);
    core /* ɵɵtext */.EFF(18);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(19, "div", 48);
    core /* ɵɵtext */.EFF(20);
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.activityMetrics.activeModelersCount);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r2.activityMetrics.totalTimeHours, " hrs");
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.activityMetrics.totalLogins);
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.activityMetrics.sinceLabel);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.getTimeRangeLabel());
  }
}
function OrganizationAnalyticsComponent_div_56_apx_chart_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "apx-chart", 53);
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("series", ctx_r2.sessionTimeChartSeries)("chart", ctx_r2.sessionTimeChartOptions.chart)("xaxis", ctx_r2.sessionTimeChartOptions.xaxis)("yaxis", ctx_r2.sessionTimeChartOptions.yaxis)("stroke", ctx_r2.sessionTimeChartOptions.stroke)("dataLabels", ctx_r2.sessionTimeChartOptions.dataLabels)("title", ctx_r2.sessionTimeChartOptions.title)("colors", ctx_r2.sessionTimeChartOptions.colors)("tooltip", ctx_r2.sessionTimeChartOptions.tooltip);
  }
}
function OrganizationAnalyticsComponent_div_56_apx_chart_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "apx-chart", 54);
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
    core /* ɵɵproperty */.Y8G("series", ctx_r2.peakActivityChartSeries)("chart", ctx_r2.peakActivityChartOptions.chart)("xaxis", ctx_r2.peakActivityChartOptions.xaxis)("yaxis", ctx_r2.peakActivityChartOptions.yaxis)("stroke", ctx_r2.peakActivityChartOptions.stroke)("dataLabels", ctx_r2.peakActivityChartOptions.dataLabels)("title", ctx_r2.peakActivityChartOptions.title)("colors", ctx_r2.peakActivityChartOptions.colors)("tooltip", ctx_r2.peakActivityChartOptions.tooltip)("plotOptions", ctx_r2.peakActivityChartOptions.plotOptions);
  }
}
function OrganizationAnalyticsComponent_div_56_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 49)(1, "div", 50);
    core /* ɵɵtemplate */.DNE(2, OrganizationAnalyticsComponent_div_56_apx_chart_2_Template, 1, 9, "apx-chart", 51);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 50);
    core /* ɵɵtemplate */.DNE(4, OrganizationAnalyticsComponent_div_56_apx_chart_4_Template, 1, 10, "apx-chart", 52);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.sessionTimeChartOptions && ctx_r2.sessionTimeChartOptions.chart);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.peakActivityChartOptions && ctx_r2.peakActivityChartOptions.chart);
  }
}
function OrganizationAnalyticsComponent_option_68_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 42);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const option_r10 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("value", option_r10.value)("selected", option_r10.value === ctx_r2.timeRange);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", option_r10.label, " ");
  }
}
let OrganizationAnalyticsComponent = /*#__PURE__*/(() => {
  class OrganizationAnalyticsComponent {
    constructor(dbService, userService, cdr) {
      this.dbService = dbService;
      this.userService = userService;
      this.cdr = cdr;
      // Time range and activity metrics for the dashboard and download section
      this.timeRange = "last7d";
      this.activityMetrics = null;
      this.isLoadingMetrics = false;
      // Chart configurations - single options object for each chart
      this.sessionTimeChartSeries = [];
      this.peakActivityChartSeries = [];
      this.sessionTimeChartOptions = {};
      this.peakActivityChartOptions = {};
      this.chartsReady = false;
      this.modelersSortColumn = "name";
      this.viewersSortColumn = "name";
      this.modelersSortDirection = "down";
      this.viewersSortDirection = "down";
      this.selectedOrg = this.userService.user?.userData?.organization;
      this.orgsNames = [];
      this.resetData();
    }
    resetData() {
      this.data = {
        connectedModelers: [],
        connectedViewers: [],
        hasUsersLimit: false,
        modelersLimit: 0,
        viewersLimit: 0
      };
    }
    ngOnInit() {
      this.isSysAdmin = this.userService.isSysAdmin();
      if (this.isSysAdmin) {
        this.dbService.driver.getAllOrganizations().then(orgs => this.orgsNames = orgs.map(org => org.name));
      }
      if (this.selectedOrg) {
        this.loadData();
      }
      // Initialize charts and load activity metrics from backend
      this.initializeCharts();
      this.loadActivityMetrics();
      // Suppress ApexCharts passive event listener warnings (harmless browser warnings)
      this.suppressApexChartsWarnings();
    }
    /**
     * Suppresses harmless ApexCharts passive event listener warnings in the console.
     * These warnings occur when ApexCharts tries to preventDefault on passive touch/scroll events.
     */
    suppressApexChartsWarnings() {
      const originalError = console.error;
      console.error = (...args) => {
        const message = args[0]?.toString() || "";
        // Filter out ApexCharts passive event listener warnings
        if (message.includes("Unable to preventDefault inside passive event listener")) {
          return; // Suppress this specific warning
        }
        originalError.apply(console, args);
      };
    }
    initializeCharts() {
      // Initialize chart options with default empty data
      this.sessionTimeChartOptions = {
        series: [],
        chart: {
          type: "line",
          height: 350,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          pan: {
            enabled: false
          }
        },
        stroke: {
          curve: "smooth",
          width: 2
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: "category",
          title: {
            text: "Time"
          }
        },
        yaxis: {
          title: {
            text: "Hours"
          }
        },
        title: {
          text: "Session Time Over Period",
          style: {
            color: "#1A3763"
          }
        },
        colors: ["#1A3763"],
        tooltip: {
          theme: "light"
        }
      };
      this.peakActivityChartOptions = {
        series: [],
        chart: {
          type: "line",
          height: 350,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          pan: {
            enabled: false
          }
        },
        stroke: {
          curve: "smooth",
          width: 2
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: "category",
          title: {
            text: "Time"
          }
        },
        yaxis: [{
          title: {
            text: "Active Users"
          }
        }, {
          opposite: true,
          title: {
            text: "Logins"
          }
        }],
        title: {
          text: "Peak Hours / Activity Over Period",
          style: {
            color: "#1A3763"
          }
        },
        colors: ["#1A3763", "#5989d2"],
        tooltip: {
          theme: "light"
        },
        plotOptions: {
          bar: {
            columnWidth: "50%"
          }
        }
      };
      this.sessionTimeChartSeries = [{
        name: "Session Time (hours)",
        data: []
      }];
      this.peakActivityChartSeries = [{
        name: "Active Users",
        type: "column",
        data: []
      }, {
        name: "Logins",
        type: "line",
        data: []
      }];
    }
    /**
     * Loads aggregated activity metrics for the selected organization and time range.
     * Results are used to populate the metric cards and ApexCharts series.
     */
    loadActivityMetrics() {
      if (!this.selectedOrg) {
        return;
      }
      this.isLoadingMetrics = true;
      this.dbService.driver.getActivityMetrics(this.selectedOrg, this.timeRange).then(metrics => {
        if (metrics) {
          this.activityMetrics = metrics;
          this.updateCharts(metrics);
        } else {
          this.activityMetrics = null;
          this.chartsReady = false;
        }
        this.isLoadingMetrics = false;
        this.cdr.detectChanges();
      }).catch(err => {
        console.error("Failed to load activity metrics:", err);
        this.activityMetrics = null;
        this.chartsReady = false;
        this.isLoadingMetrics = false;
        this.cdr.detectChanges();
      });
    }
    updateCharts(metrics) {
      if (!metrics || !metrics.sessionTimeSeries || !metrics.peakActivitySeries) {
        (0, validationAlert)("Invalid metrics data for charts", null, "warning");
        this.chartsReady = false;
        return;
      }
      try {
        // Update session time chart
        const sessionData = metrics.sessionTimeSeries.length > 0 ? metrics.sessionTimeSeries.map(item => ({
          x: item.x,
          y: item.y || 0
        })) : [{
          x: "No data",
          y: 0
        }];
        this.sessionTimeChartSeries = [{
          name: "Session Time (hours)",
          data: sessionData
        }];
        // Update the options object with new series
        this.sessionTimeChartOptions = {
          ...this.sessionTimeChartOptions,
          series: this.sessionTimeChartSeries
        };
        // Update peak activity chart
        const peakData1 = metrics.peakActivitySeries.length > 0 ? metrics.peakActivitySeries.map(item => ({
          x: item.x,
          y: item.y1 || 0
        })) : [{
          x: "No data",
          y: 0
        }];
        const peakData2 = metrics.peakActivitySeries.length > 0 ? metrics.peakActivitySeries.map(item => ({
          x: item.x,
          y: item.y2 || 0
        })) : [{
          x: "No data",
          y: 0
        }];
        this.peakActivityChartSeries = [{
          name: "Active Users",
          type: "column",
          data: peakData1
        }, {
          name: "Logins",
          type: "line",
          data: peakData2
        }];
        // Update the options object with new series
        this.peakActivityChartOptions = {
          ...this.peakActivityChartOptions,
          series: this.peakActivityChartSeries
        };
        // Mark charts as ready and trigger change detection
        this.chartsReady = true;
        this.cdr.detectChanges();
      } catch (err) {
        console.error("Error updating charts:", err);
        this.chartsReady = false;
      }
    }
    onTimeRangeChange(newRange) {
      var _this = this;
      return (0, default)(function* () {
        // Prevent unnecessary reload if range hasn't changed
        if (_this.timeRange === newRange) {
          return;
        }
        _this.timeRange = newRange;
        yield _this.loadActivityMetrics();
      })();
    }
    getTimeRangeOptions() {
      return [{
        value: "last24h",
        label: "Last 24 hours"
      }, {
        value: "last7d",
        label: "Last 7 days"
      }, {
        value: "last30d",
        label: "Last 30 days"
      }, {
        value: "last90d",
        label: "Last 90 days"
      }, {
        value: "allTime",
        label: "All time"
      }];
    }
    getTimeRangeLabel() {
      const option = this.getTimeRangeOptions().find(o => o.value === this.timeRange);
      if (option) {
        return option.label;
      } else {
        return "Last 7 days";
      }
    }
    // Getters for chart properties to avoid nested property access in template
    get sessionTimeChartConfig() {
      return this.sessionTimeChartOptions.chart || {};
    }
    get sessionTimeXAxisConfig() {
      return this.sessionTimeChartOptions.xaxis || {};
    }
    get sessionTimeYAxisConfig() {
      return this.sessionTimeChartOptions.yaxis || {};
    }
    get sessionTimeStrokeConfig() {
      return this.sessionTimeChartOptions.stroke || {};
    }
    get sessionTimeDataLabelsConfig() {
      return this.sessionTimeChartOptions.dataLabels || {};
    }
    get sessionTimeTitleConfig() {
      return this.sessionTimeChartOptions.title || {};
    }
    get sessionTimeColorsConfig() {
      return this.sessionTimeChartOptions.colors || [];
    }
    get sessionTimeTooltipConfig() {
      return this.sessionTimeChartOptions.tooltip || {};
    }
    get peakActivityChartConfig() {
      return this.peakActivityChartOptions.chart || {};
    }
    get peakActivityXAxisConfig() {
      return this.peakActivityChartOptions.xaxis || {};
    }
    get peakActivityYAxisConfig() {
      return this.peakActivityChartOptions.yaxis || {};
    }
    get peakActivityStrokeConfig() {
      return this.peakActivityChartOptions.stroke || {};
    }
    get peakActivityDataLabelsConfig() {
      return this.peakActivityChartOptions.dataLabels || {};
    }
    get peakActivityTitleConfig() {
      return this.peakActivityChartOptions.title || {};
    }
    get peakActivityColorsConfig() {
      return this.peakActivityChartOptions.colors || [];
    }
    get peakActivityTooltipConfig() {
      return this.peakActivityChartOptions.tooltip || {};
    }
    get peakActivityPlotOptionsConfig() {
      return this.peakActivityChartOptions.plotOptions || {};
    }
    loadData() {
      this.isLoading = true;
      this.dbService.driver.getOrganizationAnalytics(this.selectedOrg).then(data => {
        this.data = data;
        this.sortModelersData();
        this.sortViewersData();
        this.isLoading = false;
      }).catch(err => this.isLoading = false);
    }
    downloadRawData(shiftHourlyToLocal) {
      this.isLoading = true;
      // Request activity logs for the selected org and time range only
      this.dbService.driver.getModelingAnalyticsRawData(this.selectedOrg, this.timeRange).then(data => {
        const dailyLogsSheet = [];
        const hourlyLogsSheet = [];
        // Browser's timezone offset in milliseconds – used when shifting hourly logs to local time
        const userTimeZoneOffset = new Date().getTimezoneOffset() * 60000;
        // Flatten dailyLogs into a tabular structure per user per day
        Object.entries(data.dailyLogs).forEach(([utcDate, records]) => {
          records.forEach(record => {
            // Safely handle firstPing and lastPing
            let firstPingStr = "";
            let lastPingStr = "";
            try {
              firstPingStr = isFinite(record.firstPing) ? new Date(record.firstPing).toISOString() : "";
            } catch {
              firstPingStr = "";
            }
            try {
              lastPingStr = isFinite(record.lastPing) ? new Date(record.lastPing).toISOString() : "";
            } catch {
              lastPingStr = "";
            }
            dailyLogsSheet.push({
              Date: utcDate,
              // Keep as UTC
              Name: record.name || "",
              Email: record.email || "",
              "First Ping": firstPingStr,
              "Last Ping": lastPingStr,
              "Total Duration (min)": Math.round((record.totalDuration || 0) / 60000),
              "Session Count": record.sessionCount || 0
            });
          });
        });
        // Sort daily logs by UTC date
        dailyLogsSheet.sort((a, b) => {
          const dateA = new Date(a.Date).getTime();
          const dateB = new Date(b.Date).getTime();
          return dateA - dateB;
        });
        // Flatten hourlyLogs into a tabular structure per UTC/local hour
        const sortedHourlyKeys = Object.keys(data.hourlyLogs).sort((a, b) => {
          const [yearA, monthA, dayA, hourA] = a.split("-").map(Number);
          const [yearB, monthB, dayB, hourB] = b.split("-").map(Number);
          const utcTimeA = new Date(Date.UTC(yearA, monthA - 1, dayA, hourA)).getTime();
          const utcTimeB = new Date(Date.UTC(yearB, monthB - 1, dayB, hourB)).getTime();
          return utcTimeA - utcTimeB; // Sort in ascending order
        });
        sortedHourlyKeys.forEach(utcHour => {
          const [year, month, day, hour] = utcHour.split("-").map(Number);
          const utcDateTime = new Date(Date.UTC(year, month - 1, day, hour)); // Convert to UTC Date object
          if (shiftHourlyToLocal) {
            const localDateTime = new Date(utcDateTime.getTime() + userTimeZoneOffset);
            const localDate = localDateTime.toLocaleDateString(); // Local date format
            const localHour = localDateTime.getHours(); // Local hour in 24-hour format
            hourlyLogsSheet.push({
              Hour: `${localDate}-${localHour}`,
              // Local date-hour
              "Active Users": data.hourlyLogs[utcHour].activeUsers
            });
          } else {
            const utcDate = utcDateTime.toISOString().split("T")[0]; // UTC date format
            const utcHour = utcDateTime.getUTCHours(); // UTC hour
            hourlyLogsSheet.push({
              Hour: `${utcDate}-${utcHour}`,
              // UTC date-hour
              "Active Users": data.hourlyLogs[utcHour].activeUsers
            });
          }
        });
        // Create Excel workbook with separate daily/hourly sheets
        const wb = utils.book_new();
        // Add Daily Logs sheet
        const dailyWs = utils.json_to_sheet(dailyLogsSheet);
        utils.book_append_sheet(wb, dailyWs, "Daily Logs");
        // Add Hourly Logs sheet
        const hourlyWs = utils.json_to_sheet(hourlyLogsSheet);
        utils.book_append_sheet(wb, hourlyWs, "Hourly Logs");
        // Add comments to the headers to clarify time semantics
        utils.cell_add_comment(dailyWs.G1, "All times in the Daily Logs sheet are in UTC.", "System");
        utils.cell_add_comment(hourlyWs.B1, shiftHourlyToLocal ? "All times in the Hourly Logs sheet are in local time." : "All times in the Hourly Logs sheet are in UTC.", "System");
        // Persist the workbook to disk
        writeFileSync(wb, "organization_activity_logs.xlsx");
        this.isLoading = false; // Clear loading state
      }).catch(err => {
        console.error("Failed to download raw data:", err);
        this.isLoading = false;
      });
    }
    modelersColumnClick(colName) {
      this.toggleModelersSortDirection();
      this.modelersSortColumn = colName;
      this.sortModelersData();
    }
    viewersColumnClick(colName) {
      this.toggleViewersSortDirection();
      this.viewersSortColumn = colName;
      this.sortViewersData();
    }
    toggleModelersSortDirection() {
      this.modelersSortDirection = this.modelersSortDirection === "up" ? "down" : "up";
    }
    toggleViewersSortDirection() {
      this.viewersSortDirection = this.viewersSortDirection === "up" ? "down" : "up";
    }
    sortModelersData() {
      this.data.connectedModelers = this.data.connectedModelers.sort((a, b) => {
        const sign = this.modelersSortDirection === "up" ? -1 : 1;
        if (this.modelersSortColumn === "name") {
          if (a.Name > b.Name) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (a.Email > b.Email) {
          return sign * 1;
        } else {
          return sign * -1;
        }
      });
    }
    sortViewersData() {
      this.data.connectedViewers = this.data.connectedViewers.sort((a, b) => {
        const sign = this.viewersSortDirection === "up" ? -1 : 1;
        if (this.viewersSortColumn === "name") {
          if (a.Name > b.Name) {
            return sign * 1;
          } else {
            return sign * -1;
          }
        } else if (a.Email > b.Email) {
          return sign * 1;
        } else {
          return sign * -1;
        }
      });
    }
    getModelersArrowSign(colName) {
      if (colName === this.modelersSortColumn) {
        if (this.modelersSortDirection === "up") {
          return "↑ ";
        } else {
          return "↓ ";
        }
      }
      return "";
    }
    getViewersArrowSign(colName) {
      if (colName === this.viewersSortColumn) {
        if (this.viewersSortDirection === "up") {
          return "↑ ";
        } else {
          return "↓ ";
        }
      }
      return "";
    }
    refresh() {
      var _this2 = this;
      return (0, default)(function* () {
        _this2.resetData();
        yield _this2.loadData();
        yield _this2.loadActivityMetrics();
      })();
    }
    onSelectedOrgChange($event) {
      var _this3 = this;
      return (0, default)(function* () {
        _this3.selectedOrg = $event.value;
        yield _this3.refresh();
      })();
    }
    static #_ = (() => this.ɵfac = function OrganizationAnalyticsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OrganizationAnalyticsComponent)(core /* ɵɵdirectiveInject */.rXU(DatabaseService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(ChangeDetectorRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: OrganizationAnalyticsComponent,
      selectors: [["Organization-Analytics"]],
      decls: 75,
      vars: 26,
      consts: [["localTimeHourly", ""], ["id", "whole"], ["id", "loadingDiv", 4, "ngIf"], [1, "header"], ["mat-button", "", "id", "refresh", "matTooltip", "Click to refresh with the latest information", 2, "color", "#1A3763", "letter-spacing", "normal", 3, "click"], [4, "ngIf"], [1, "bold"], [1, "mainPart"], [1, "tableWrapper", 2, "max-height", "150px"], [1, "table"], [1, "tableHeader"], ["width", "10%", "id", "viewsHeader", 1, "tableViews"], ["width", "35%", 1, "tableAuthor", 3, "click"], ["width", "55%", 1, "tablePublishDate", 3, "click"], ["class", "tableRow", 4, "ngFor", "ngForOf"], [1, "tableWrapper"], ["width", "10%", 1, "viewsHeader", "tableViews"], [1, "dashboardHeader"], ["title", "Select time range for analytics", 1, "timeRangeSelect", 3, "change"], [3, "value", "selected", 4, "ngFor", "ngForOf"], ["class", "metricsLoading", 4, "ngIf"], ["class", "metricsCards", 4, "ngIf"], ["class", "chartsContainer", 4, "ngIf"], [1, "rawDataDiv"], [1, "checkboxButtonWrapper"], [1, "timeRangeWrapper"], [1, "checkboxLabel"], ["title", "Select time range for download", 1, "timeRangeSelect", 3, "change"], ["mat-button", "", "matTooltip", "Export activity data for the selected time range as an Excel file.", 1, "Btn", 3, "click"], ["matTooltip", "Enable this checkbox to export the hourly sheet in local time", "matTooltipPosition", "right", 1, "styledCheckbox", 3, "checked"], ["id", "loadingDiv"], ["matTooltip", "Selected Organization", "id", "mat-select-class-OPCloud-organization-settings-Analytics", 2, "left", "0", "margin-bottom", "20px", 3, "selectionChange", "value"], ["label", "Select Organization"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "tableRow"], ["width", "10%"], ["width", "35%", 1, "tableAuthor"], ["width", "55%", 1, "tablePublishDate"], ["width", "10%", 1, "tableAuthor"], ["width", "35%", 1, "tablePublishDate"], ["width", "55%", 1, "tableExpDate"], [3, "value", "selected"], [1, "metricsLoading"], ["diameter", "40"], [1, "metricsCards"], [1, "metricCard"], [1, "metricLabel"], [1, "metricValue"], [1, "chartsContainer"], [1, "chartWrapper"], [3, "series", "chart", "xaxis", "yaxis", "stroke", "dataLabels", "title", "colors", "tooltip", 4, "ngIf"], [3, "series", "chart", "xaxis", "yaxis", "stroke", "dataLabels", "title", "colors", "tooltip", "plotOptions", 4, "ngIf"], [3, "series", "chart", "xaxis", "yaxis", "stroke", "dataLabels", "title", "colors", "tooltip"], [3, "series", "chart", "xaxis", "yaxis", "stroke", "dataLabels", "title", "colors", "tooltip", "plotOptions"]],
      template: function OrganizationAnalyticsComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1);
          core /* ɵɵtemplate */.DNE(1, OrganizationAnalyticsComponent_div_1_Template, 2, 0, "div", 2);
          core /* ɵɵelementStart */.j41(2, "div", 3)(3, "h2");
          core /* ɵɵtext */.EFF(4, "Organization Analytics");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "button", 4);
          core /* ɵɵlistener */.bIt("click", function OrganizationAnalyticsComponent_Template_button_click_5_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.refresh());
          });
          core /* ɵɵtext */.EFF(6, "↻ Refresh");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(7, OrganizationAnalyticsComponent_div_7_Template, 4, 2, "div", 5);
          core /* ɵɵelementStart */.j41(8, "div")(9, "span");
          core /* ɵɵtext */.EFF(10, "Current modelers connected: ");
          core /* ɵɵelementStart */.j41(11, "span", 6);
          core /* ɵɵtext */.EFF(12);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(13, OrganizationAnalyticsComponent_span_13_Template, 4, 1, "span", 5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(14, "br");
          core /* ɵɵelementStart */.j41(15, "span");
          core /* ɵɵtext */.EFF(16, "Current reviewers connected: ");
          core /* ɵɵelementStart */.j41(17, "span", 6);
          core /* ɵɵtext */.EFF(18);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(19, OrganizationAnalyticsComponent_span_19_Template, 4, 1, "span", 5);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(20, "div", 7)(21, "h3");
          core /* ɵɵtext */.EFF(22, "Connected Modelers:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "div", 8)(24, "table", 9)(25, "tr", 10)(26, "th", 11);
          core /* ɵɵtext */.EFF(27, "#");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "th", 12);
          core /* ɵɵlistener */.bIt("click", function OrganizationAnalyticsComponent_Template_th_click_28_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.modelersColumnClick("name"));
          });
          core /* ɵɵtext */.EFF(29);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(30, "th", 13);
          core /* ɵɵlistener */.bIt("click", function OrganizationAnalyticsComponent_Template_th_click_30_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.modelersColumnClick("email"));
          });
          core /* ɵɵtext */.EFF(31);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(32, OrganizationAnalyticsComponent_tr_32_Template, 7, 3, "tr", 14);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(33, "div", 7)(34, "h3");
          core /* ɵɵtext */.EFF(35, "Connected Reviewers:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "div", 15)(37, "table", 9)(38, "tr", 10)(39, "th", 16);
          core /* ɵɵtext */.EFF(40, "#");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(41, "th", 12);
          core /* ɵɵlistener */.bIt("click", function OrganizationAnalyticsComponent_Template_th_click_41_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.viewersColumnClick("name"));
          });
          core /* ɵɵtext */.EFF(42);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(43, "th", 13);
          core /* ɵɵlistener */.bIt("click", function OrganizationAnalyticsComponent_Template_th_click_43_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.viewersColumnClick("email"));
          });
          core /* ɵɵtext */.EFF(44);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(45, OrganizationAnalyticsComponent_tr_45_Template, 7, 3, "tr", 14);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(46, "div", 7)(47, "h2");
          core /* ɵɵtext */.EFF(48, "Modelers Activity Metrics Dashboard");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(49, "div", 17)(50, "h3");
          core /* ɵɵtext */.EFF(51, "Time Range:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(52, "select", 18);
          core /* ɵɵlistener */.bIt("change", function OrganizationAnalyticsComponent_Template_select_change_52_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onTimeRangeChange($event.target.value));
          });
          core /* ɵɵtemplate */.DNE(53, OrganizationAnalyticsComponent_option_53_Template, 2, 3, "option", 19);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(54, OrganizationAnalyticsComponent_div_54_Template, 2, 0, "div", 20)(55, OrganizationAnalyticsComponent_div_55_Template, 21, 5, "div", 21)(56, OrganizationAnalyticsComponent_div_56_Template, 5, 2, "div", 22);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(57, "div", 7)(58, "h3");
          core /* ɵɵtext */.EFF(59, "Download Modelers Raw Data");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(60, "div", 23)(61, "span");
          core /* ɵɵtext */.EFF(62, " Export daily and hourly activity logs for all modelers in the organization as an Excel file. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(63, "div", 24)(64, "div", 25)(65, "span", 26);
          core /* ɵɵtext */.EFF(66, "Time Range:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(67, "select", 27);
          core /* ɵɵlistener */.bIt("change", function OrganizationAnalyticsComponent_Template_select_change_67_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.onTimeRangeChange($event.target.value));
          });
          core /* ɵɵtemplate */.DNE(68, OrganizationAnalyticsComponent_option_68_Template, 2, 3, "option", 19);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(69, "button", 28);
          core /* ɵɵlistener */.bIt("click", function OrganizationAnalyticsComponent_Template_button_click_69_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const localTimeHourly_r11 = core /* ɵɵreference */.sdS(72);
            return core /* ɵɵresetView */.Njj(ctx.downloadRawData(localTimeHourly_r11.checked));
          });
          core /* ɵɵtext */.EFF(70, " Download All Raw Data ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(71, "mat-checkbox", 29, 0)(73, "span", 26);
          core /* ɵɵtext */.EFF(74, "Hourly Local Time");
          core /* ɵɵelementEnd */.k0s()()()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isLoading);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isSysAdmin);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtextInterpolate */.JRh(ctx.data.connectedModelers.length);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.data.hasUsersLimit);
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵtextInterpolate */.JRh(ctx.data.connectedViewers.length);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.data.hasUsersLimit);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵstyleMap */.Aen(ctx.modelersSortColumn === "name" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getModelersArrowSign("name"), "Name");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.modelersSortColumn === "email" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getModelersArrowSign("email"), "Email");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.data.connectedModelers);
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵstyleMap */.Aen(ctx.viewersSortColumn === "name" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getViewersArrowSign("name"), "Name");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵstyleMap */.Aen(ctx.viewersSortColumn === "email" ? "background-color: rgb(49 100 179);" : "");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵtextInterpolate1 */.SpI("", ctx.getViewersArrowSign("email"), "Email");
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.data.connectedViewers);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.getTimeRangeOptions());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.isLoadingMetrics);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isLoadingMetrics && ctx.activityMetrics);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isLoadingMetrics && ctx.activityMetrics && ctx.chartsReady && ctx.sessionTimeChartSeries.length > 0 && ctx.peakActivityChartSeries.length > 0);
          core /* ɵɵadvance */.R7$(12);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.getTimeRangeOptions());
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true);
        }
      },
      dependencies: [NgForOf, NgIf, MatTooltip, MatSelect, MatOption, MatOptgroup, MatButton, MatCheckbox, MatProgressSpinner, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, ChartComponent],
      styles: ["#whole[_ngcontent-%COMP%]{text-align:center}.header[_ngcontent-%COMP%]{color:#1a3763;text-align:center;display:inline-flex;align-items:center;margin-top:20px}h2[_ngcontent-%COMP%]{color:#1a3763;text-align:center;display:inline-flex;align-items:center;margin-top:20px;margin-bottom:16px}h3[_ngcontent-%COMP%]{color:#1a3763;text-align:center;display:inline-flex;align-items:center;margin-top:16px}#createMsg[_ngcontent-%COMP%]{border:1px solid #1a3763;margin-left:80px;background-color:#1a3763;color:#fff}.subjectHeader[_ngcontent-%COMP%]{border-radius:0 8px 0 0}.viewsHeader[_ngcontent-%COMP%]{border-radius:8px 0 0}.tableRow[_ngcontent-%COMP%]{width:100%;height:20px}.bold[_ngcontent-%COMP%]{font-weight:700}.table[_ngcontent-%COMP%]{width:700px}.tableWrapper[_ngcontent-%COMP%]{max-height:260px;width:700px;overflow-y:auto;margin-left:calc(50% - 350px)}.Btn[_ngcontent-%COMP%]{color:#1a3763!important;opacity:60%!important;font-weight:500!important;border:1px solid rgba(88,109,140,.5)!important;border-radius:4px!important;height:36px!important;margin-left:10px!important;display:inline!important;letter-spacing:normal!important}.styledCheckbox[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%]{background-color:#1a3763!important;border-radius:2px}.styledCheckbox[_ngcontent-%COMP%]   .mat-mdc-checkbox-checkmark-path[_ngcontent-%COMP%]{stroke:#fff!important;stroke-width:2px}.styledCheckbox[_ngcontent-%COMP%]   .checkboxLabel[_ngcontent-%COMP%]{color:#1a3763!important}.dashboardHeader[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:20px;margin-top:10px}.dashboardHeader[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0;color:#1a3763;text-align:center;display:inline-flex;align-items:center}.timeRangeSelect[_ngcontent-%COMP%]{min-width:180px;padding:8px 12px;border:1px solid #1A3763;border-radius:4px;color:#1a3763;background-color:#fff;font-size:14px;cursor:pointer}.timeRangeSelect[_ngcontent-%COMP%]:hover{border-color:#18425f}.timeRangeSelect[_ngcontent-%COMP%]:focus{outline:none;border-color:#1a3763;box-shadow:0 0 0 2px #1a376333}.metricsLoading[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;padding:40px}.metricsCards[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:850px;margin:20px auto 30px}.metricCard[_ngcontent-%COMP%]{background-color:#f9f9f9;border:1px solid lightgray;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 4px #0000001a}.metricLabel[_ngcontent-%COMP%]{color:#1a3763;font-size:14px;margin-bottom:10px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.metricValue[_ngcontent-%COMP%]{color:#1a3763;font-size:24px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chartsContainer[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;gap:20px;margin-top:30px;max-width:850px;margin-left:auto;margin-right:auto}.chartWrapper[_ngcontent-%COMP%]{flex:1 1 calc(50% - 10px);min-width:400px;background-color:#fff;border:1px solid lightgray;border-radius:8px;padding:20px;box-shadow:0 2px 4px #0000001a}.chartsContainer[_ngcontent-%COMP%]   .chartWrapper[_ngcontent-%COMP%]:only-child{flex:1 1 100%}.checkboxButtonWrapper[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap;justify-content:center}.timeRangeWrapper[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.timeRangeWrapper[_ngcontent-%COMP%]   .checkboxLabel[_ngcontent-%COMP%]{color:#1a3763!important;font-size:14px;margin:0}tr[_ngcontent-%COMP%]:nth-child(odd){background-color:#f8f8f8!important}tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#dce9ff!important}th[_ngcontent-%COMP%]{background-color:#5989d2!important;color:#fff!important}.msgActions[_ngcontent-%COMP%]{padding:8px}.action[_ngcontent-%COMP%]{padding:13px}.deleteAction[_ngcontent-%COMP%]{color:red}.tableHeader[_ngcontent-%COMP%]{height:35px}input[_ngcontent-%COMP%]{height:20px;width:425px}#mainPart[_ngcontent-%COMP%]{padding-bottom:81px}#loadingDiv[_ngcontent-%COMP%]{position:absolute;inset:0 0 56px;background:#00000026;z-index:1;display:flex;align-items:center;justify-content:center}mat-spinner[_ngcontent-%COMP%]{left:100px}.mat-mdc-progress-spinner[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%], .mat-mdc-spinner[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]{stroke:#1a3763!important}#refresh[_ngcontent-%COMP%]{position:absolute!important;margin-left:340px!important;margin-top:3px!important;color:#1a3763!important;font-family:Roboto,Arial,Helvetica,sans-serif!important;font-weight:400!important;letter-spacing:normal!important}.rawDataDiv[_ngcontent-%COMP%]{width:700px;height:auto;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:15px;border-radius:8px;border:1px solid lightgray;background-color:#f9f9f9;box-shadow:0 2px 4px #0000001a}.rawDataDiv[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{text-align:center;color:#1a3763;margin-bottom:10px;font-size:14px}.rawDataDiv[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{align-self:center}.checkboxButtonWrapper[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;margin-top:10px}.styledCheckbox[_ngcontent-%COMP%]   .mat-mdc-checkbox-frame[_ngcontent-%COMP%]{border-color:#1a3763!important}.styledCheckbox.mat-mdc-checkbox-checked[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%]{background-color:#1a3763!important;border-radius:2px}.styledCheckbox.mat-mdc-checkbox-checked[_ngcontent-%COMP%]   .mat-mdc-checkbox-checkmark-path[_ngcontent-%COMP%]{stroke:#fff!important;stroke-width:2px}.styledCheckbox[_ngcontent-%COMP%]   .mat-mdc-checkbox-label[_ngcontent-%COMP%]   .checkboxLabel[_ngcontent-%COMP%]{color:#1a3763!important}.styledCheckbox[_ngcontent-%COMP%]:hover   .mat-mdc-checkbox-frame[_ngcontent-%COMP%]{border-color:#18425f!important}.styledCheckbox[_ngcontent-%COMP%]:hover   .mat-mdc-checkbox-background[_ngcontent-%COMP%]{background-color:#1a3763cc!important}"]
    }))();
  }
  return OrganizationAnalyticsComponent;
})();