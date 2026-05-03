// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/layout/header/header.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function HeaderComponent_div_61_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 44);
    core /* ɵɵlistener */.bIt("click", function HeaderComponent_div_61_div_4_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.refreshSubModels(item_r2));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 45);
    core /* ɵɵelement */.nrm(2, "rect", 46)(3, "path", 47)(4, "path", 48)(5, "line", 49);
    core /* ɵɵelementEnd */.k0s()();
  }
}
function HeaderComponent_div_61_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 50);
    core /* ɵɵlistener */.bIt("click", function HeaderComponent_div_61_div_5_Template_div_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.syncModel(item_r2, $event));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 51);
    core /* ɵɵelement */.nrm(2, "path", 52)(3, "path", 53);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("ngClass", ctx_r2.getSyncButtonClass(item_r2))("matTooltip", ctx_r2.getSyncButtonTooltip(item_r2));
  }
}
function HeaderComponent_div_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 37);
    core /* ɵɵlistener */.bIt("click", function HeaderComponent_div_61_Template_div_click_0_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.replaceContextByTab(item_r2));
    });
    core /* ɵɵelementStart */.j41(1, "div", 38);
    core /* ɵɵlistener */.bIt("click", function HeaderComponent_div_61_Template_div_click_1_listener() {
      const item_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.closeTab(item_r2));
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(2, "svg", 39);
    core /* ɵɵelement */.nrm(3, "path", 40);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵtemplate */.DNE(4, HeaderComponent_div_61_div_4_Template, 6, 0, "div", 41)(5, HeaderComponent_div_61_div_5_Template, 4, 2, "div", 42);
    core /* ɵɵnamespaceHTML */.joV();
    core /* ɵɵelementStart */.j41(6, "span", 43);
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵpipe */.nI1(8, "TabTitlePipe");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("ngClass", ctx_r2.contextService.getCurrentContext() === item_r2.context ? "selectedTab" : "modelTab")("matTooltip", item_r2.context.getWholeTextName());
    core /* ɵɵadvance */.R7$(4);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.itemHasSubModels(item_r2));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.shouldShowSyncButton(item_r2));
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(core /* ɵɵpipeBind2 */.i5U(8, 5, item_r2.context, item_r2.context == null ? null : item_r2.context.getWholeTextName()));
  }
}
function HeaderComponent_div_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 54);
    core /* ɵɵlistener */.bIt("click", function HeaderComponent_div_62_Template_div_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.newModel());
    });
    core /* ɵɵelementStart */.j41(1, "span", 55);
    core /* ɵɵtext */.EFF(2, " + ");
    core /* ɵɵelementEnd */.k0s()();
  }
}
let HeaderComponent = /*#__PURE__*/(() => {
  class HeaderComponent {
    constructor(graphService, initRappidService, _dialog, oplService, router, contextService, http) {
      this.graphService = graphService;
      this.initRappidService = initRappidService;
      this._dialog = _dialog;
      this.oplService = oplService;
      this.router = router;
      this.contextService = contextService;
      this.http = http;
      this.numToCreate = 1;
      this.numTOCreateDIvIsVisible = false;
      this.isActive = true;
      this.scenario = {};
      this.tabsManager = new TabsManager(this.initRappidService, this.contextService);
      this.graph = graphService.graph;
      this.paper = initRappidService.paper;
      this.paperScroller = initRappidService.paperScroller;
      this.paper.on("blank:pointerdown", () => {
        if (this.menuOpen) {
          this.toggleMenu();
        }
      });
    }
    about() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(AboutDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {}
      });
    }
    executeIfLogged(func) {
      this.toggleMenu();
      return this[func]();
    }
    toggleMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
        this.isActive = true;
        return;
      } else if (!this.menuOpen) {
        this.menuOpen = true;
        this.isActive = false;
      }
    }
    onDrop(event, val) {
      const currentOpd = this.initRappidService.getOpmModel().currentOpd;
      if (currentOpd.isStereotypeOpd() || currentOpd.requirementViewOf || this.initRappidService.isDSMClusteredView.value === true || currentOpd.sharedOpdWithSubModelId || currentOpd.belongsToSubModel) {
        return;
      }
      const paper = this.initRappidService.paper;
      this.graphService.graph.startBatch("addNewThing");
      const b = this.initRappidService.paperScroller.getVisibleArea();
      const c = $(this.initRappidService.paperScroller.el).offset();
      const visibleNavbar = document.getElementById("visibleNav");
      const hiddenNavbar = document.getElementById("hiddenNav");
      const curNav = hiddenNavbar ? hiddenNavbar : visibleNavbar;
      const eventCX = event.type === "touchend" ? event.changedTouches[event.changedTouches.length - 1].clientX : event.clientX;
      const eventCy = event.type === "touchend" ? event.changedTouches[event.changedTouches.length - 1].clientY : event.clientY;
      const paperScale = paper.scale();
      if (c.left <= eventCX && eventCX <= c.left * paperScale.sx + b.width * paperScale.sx && c.top * paperScale.sy <= eventCy && eventCy <= c.top * paperScale.sy + b.height * paperScale.sy) {
        // this.graphService.fromStencil = true;
        const a = this.initRappidService.paper.clientToLocalPoint(eventCX, eventCy);
        // const value = (event.type === 'touchend') ?  event.path.find( b => b.constructor.name === 'HTMLButtonElement').value : event.srcElement.firstElementChild.value;
        const value = val;
        const type = value === "object" ? EntityType.Object : EntityType.Process;
        const model = this.initRappidService.getOpmModel();
        model.logForUndo(value + " added");
        model.setShouldLogForUndoRedo(false, "headerComponent-onDrop");
        const ret = model.createToScreen(type);
        const visual = ret.visual;
        const drawn = factory(visual.type);
        drawn.attr({
          text: {
            textWrap: {
              text: visual.logicalElement.text
            }
          }
        });
        drawn.lastEnteredText = drawn.attr("text/textWrap/text");
        const heightOffset = curNav && eventCy < curNav.getBoundingClientRect().bottom ? curNav.getBoundingClientRect().height * 1.5 : 0;
        drawn.set({
          position: {
            x: a.x - drawn.get("size").width / 2,
            y: a.y - drawn.get("size").height / 2 + heightOffset
          }
        });
        visual.updateParams(drawn.getParams());
        visual.logicalElement.updateParams(drawn.getParams());
        // this.graphService.graph.startBatch('ignoreEvents');
        // this.graphService.graph.startBatch('ignoreAddEvent');
        this.graphService.fromStencil = true;
        drawn.createPorts();
        this.graphService.graph.addCell(drawn);
        if (visual.getEssence() === Essence.Physical && visual.fatherObject && visual.fatherObject.getEssence() === Essence.Informatical) {
          drawn.toggleEssence(visual);
        }
        if (visual.getAffiliation() === Affiliation.Systemic && visual.fatherObject && visual.fatherObject.getAffiliation() === Affiliation.Environmental) {
          drawn.toggleAffiliation(visual);
        }
        this.graphService.fromStencil = false;
        // this.graphService.graph.stopBatch('ignoreAddEvent');
        // this.graphService.graph.stopBatch('ignoreEvents');
        const cellView = paper.findViewByModel(drawn.id);
        drawn.openTextEditor(cellView, this.initRappidService);
        cellView.model.pointerUpHandle(cellView, this.initRappidService);
        this.graphService.graph.stopBatch("addNewThing");
        model.setShouldLogForUndoRedo(true, "headerComponent-onDrop");
      }
    }
    onStartDrag(event) {
      const that = this;
      const cloned = this.cloneThing(event);
      event.preventDefault();
      if (!event.touches) {
        window.onmousemove = function (e) {
          that.moveCloned(e, cloned);
        };
        window.onmouseup = function (e) {
          that.removeCloned(e, cloned);
        };
      } else {
        this.newThingTouchMoveFunc = function (e) {
          that.moveCloned(e, cloned);
        };
        this.newThingTouchEndFunc = function (e) {
          that.removeCloned(e, cloned);
        };
        window.addEventListener("touchmove", this.newThingTouchMoveFunc);
        window.addEventListener("touchend", this.newThingTouchEndFunc);
      }
    }
    removeCloned(event, clone) {
      clone.cloned.remove();
      clone.textNode.remove();
      const type = clone.cloned.id.includes("object") ? "object" : "process";
      this.onDrop(event, type);
      window.onmousemove = function (e) {};
      window.onmouseup = function (e) {};
      window.removeEventListener("touchmove", this.newThingTouchMoveFunc);
      window.removeEventListener("touchend", this.newThingTouchEndFunc);
    }
    moveCloned(event, clone) {
      const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      const clientX = event.changedTouches && event.changedTouches.length > 0 ? event.changedTouches[0].clientX : event.clientX;
      const clientY = event.changedTouches && event.changedTouches.length > 0 ? event.changedTouches[0].clientY : event.clientY;
      clone.cloned.style.top = clientY - 30 + scrollTop + "px";
      clone.cloned.style.left = clientX - 67 + "px";
      const clonedRect = clone.cloned.getClientRects()[0];
      const textRect = clone.textNode.getClientRects()[0];
      clone.textNode.style.top = clonedRect.y + (clonedRect.height - textRect.height) / 2 + "px";
      clone.textNode.style.left = clonedRect.x + (clonedRect.width - textRect.width) / 2 + "px";
    }
    cloneThing(event) {
      let cloned;
      if (event.currentTarget.children[0].id === "object") {
        cloned = $("#objectDrag")[0].cloneNode();
      } else {
        cloned = $("#processDrag")[0].cloneNode();
      }
      cloned.style.position = "absolute";
      cloned.style.top = "-800px";
      cloned.style.left = "-800px";
      cloned.style.zIndex = "90000";
      cloned.style.opacity = 0.25;
      if (this.oplService.settings.essence !== Essence.Informatical) {
        cloned.style.filter = "url(#dropShadowv-2-1096745468)";
      }
      document.body.appendChild(cloned);
      const textNode = document.createElement("label");
      const textContent = event.currentTarget.children[0].id === "object" ? "Object " + OpmLogicalObject.logicalCounter : OpmLogicalProcess.getNumberedNameByNum(OpmLogicalProcess.logicalCounter);
      textNode.innerHTML = textContent;
      textNode.style.position = "absolute";
      textNode.style.top = "20px";
      textNode.style.left = "20px";
      textNode.style.zIndex = "999999999";
      textNode.style.fontFamily = "Arial";
      textNode.style.fontSize = "14px";
      textNode.style.fontWeight = "bold";
      textNode.style.opacity = 0.25;
      document.body.appendChild(textNode);
      return {
        cloned: cloned,
        textNode: textNode
      };
    }
    exportOPL() {
      this.toggleMenu();
      // Open a dialog box that will allow the user to choose the file name
      const dialogRef = this._dialog.open(ChooseExportedFileNameComponent, {
        height: "270px",
        width: "400px"
      });
      // This function invokes the exporting OPL process
      dialogRef.afterClosed().subscribe(fileName => {
        if (fileName === "CLOSED") {
          // If the user pressed CANCEL.
          return;
        } else {
          // If the user pressed OK but didn't give a name to the exported file -
          // get default file name
          if (fileName.trim() === "" || !fileName) {
            fileName = this.initRappidService.opmModel.createDefaultModelName();
          }
          // The process of saving the exported file is starting.
          // An array that will include the OPL sentences for each OPD separately.
          const arrayOfOpds = new Array();
          arrayOfOpds.push("<html><body>"); // Open an HTML Tag for arrayOfOpds.
          // The next lines define the colors of words according to their type - object \ process \ state for arrOfSD.
          arrayOfOpds.push("<style> .object { color: #00b050; } </style>");
          arrayOfOpds.push("<style> .process { color: #0070c0; } </style>");
          arrayOfOpds.push("<style> .state { color: #808000; } </style>");
          // An array that will include the OPL sentences for all Opds together
          // without duplication.
          const arrOfAllOpl = new Array();
          arrOfAllOpl.push("<html><body>"); // Open an HTML Tag for arrOfAllOpl.
          /// The next lines define the colors of words according to their type - object \ process \ state for arrOfAllOpl.
          arrOfAllOpl.push("<style> .object { color: #006400; } </style>");
          arrOfAllOpl.push("<style> .process { color: #00008B; } </style>");
          arrOfAllOpl.push("<style> .state { color: #808000; } </style>");
          arrOfAllOpl.push("<b>OPL spec.</b>"); // Insert a title for the arrOfAllOpl array.
          arrOfAllOpl.push("<br>");
          // Save the current Opd that the user is editing, for rendering it at the end of the function.
          const currentOpd = this.initRappidService.opmModel.currentOpd;
          // Get all existing OPDs in the graph.
          const allOpd = this.initRappidService.opmModel.opds.filter(o => !o.isHidden);
          // This loop goes over all OPDs and inserts the OPL sentences to the arrays.
          for (let i = 0; i < allOpd.length; i++) {
            this.graphService.renderGraph(allOpd[i], this.initRappidService); // Goes to the next OPD in the allOpd array.
            // Get the name of the current OPD.
            const nameOfOpd = allOpd[i].name;
            arrayOfOpds.push("<b>");
            arrayOfOpds.push(nameOfOpd); // Insert the name of the current OPD as a title in the arrOfSD array.
            arrayOfOpds.push("</b>");
            arrayOfOpds.push("<br>");
            // Get the cells that contain the OPL sentences of the current OPD.
            const cells = this.oplService.generateOpl(); // YANG's function
            // This loop goes over all of the cells and inserts the OPL sentences to the arrays.
            for (let j = 0; j < cells.length; j++) {
              if (cells[j].opl) {
                // Check if the cell contains an OPL sentence.
                // Get the OPL sentence of the cell.
                const innerHTML = cells[j].opl;
                arrayOfOpds.push(innerHTML); // Insert the OPL sentence into the arrOfSD array.
                arrayOfOpds.push("<br>");
                // Initialization of a temp boolean variable.
                // It will be used as a flag to check if the current OPL sentence already exists in the arrOfAllOpl array.
                if (!arrOfAllOpl.includes(innerHTML)) {
                  arrOfAllOpl.push(innerHTML); /// Insert the OPL sentence into the arrOfAllOpl array.
                  arrOfAllOpl.push("<br>");
                }
                /*
                let exists = 'False';
                // This loop goes over the arrOfAllOpl array and checks if the current OPL sentence already exists in the array.
                for (let k = 0; k < arrOfAllOpl.length; k++) {
                  if (arrOfAllOpl[k] === innerHTML) {
                    exists = 'True';
                  }
                }
                if (exists === 'False') { /// Check if the flag indicates that the current OPL sentence doesn't already exist in the array.
                  arrOfAllOpl.push(innerHTML); /// Insert the OPL sentence into the arrOfAllOpl array.
                  arrOfAllOpl.push('<br>');
                }*/
              }
            }
            arrayOfOpds.push("<br>");
          }
          arrayOfOpds.push("</body></html>"); // Close an HTML Tag for arrayOfOpds.
          arrOfAllOpl.push("</body></html>"); // Close an HTML Tag for arrOfAllOpl.
          this.graphService.renderGraph(currentOpd, this.initRappidService); // Goes back to the OPD that the user is editing.
          // Concatenation of the arrOfSD and the arrOfAllOpl arrays.
          const exportFileContent = arrayOfOpds.concat(arrOfAllOpl);
          // Create the exported file.
          const exportFile = new Blob(exportFileContent, {
            type: "html/plain;charset=utf-8"
          });
          FileSaver_min.saveAs(exportFile, fileName + ".html"); // Save the exported file.
        }
      });
    }
    closeTextEditorForNewSelection() {
      if (this.initRappidService.textEditor && this.initRappidService.selectedElement) {
        this.initRappidService.selectedElement.closeTextEditor(this.initRappidService);
      }
    }
    importModel() {
      this.toggleMenu();
      const dialogRef = this._dialog.open(UploadFile);
      const That = this;
      dialogRef.afterClosed().subscribe(result => {});
    }
    saveScreenshot() {
      this.toggleMenu();
      this._dialog.open(SaveScreenshotComponent);
    }
    openSettings() {
      this.router.navigate(["/settings", {
        outlets: {
          settings_main: ["home"]
        }
      }], {
        skipLocationChange: true
      });
    }
    rightClickHandle(evt) {
      evt.preventDefault();
      this.setNumOfElToCreate();
    }
    setNumOfElToCreate() {
      this.numTOCreateDIvIsVisible = !this.numTOCreateDIvIsVisible;
    }
    setNumOfElementsToCreate(e) {
      this.numToCreate = parseInt(e.target.value);
    }
    /*
    TODODANIEL
    collDialogOpen() {
      console.log('Collaboration Settings');
      const dialogRef = this._dialog.open(CollaborationDialogComponent, {
        height: '600px',
        width: '600px',
        data: {
          userToken: this.initRappidService.getOpmModel().permissions.tokenID, currentUser: this.currentUser,
          org: this.userService.userOrg,
          checkedUsers: this.initRappidService.getOpmModel().permissions.readIDs,
          checkedGroups: this.initRappidService.getOpmModel().permissions.readGroupsIDs,
          modelOwner: this.initRappidService.getOpmModel().permissions.ownerID
        },
      });
    }*/
    dropTab(event) {
      return this.tabsManager.dropTab(event);
    }
    replaceContextByTab(item, keepSubModels = true) {
      if (this.initRappidService.isRendering || this.initRappidService.isLoadingModel) {
        return;
      }
      return this.tabsManager.replaceContextByTab(item, keepSubModels);
    }
    closeTab(item) {
      return this.tabsManager.closeTab(item);
    }
    getTabsStyle() {
      return "height: 25px; margin-top: 37px; display: flex; width: " + (window.innerWidth - 850) + "px;";
    }
    newModel() {
      OpmProcess.resetCounter();
      OpmObject.resetCounter();
      this.initRappidService.setSelectedElementToNull();
      this.contextService.newModel();
    }
    itemHasSubModels(item) {
      return item.modelData.opds.some(opd => opd.sharedOpdWithSubModelId);
    }
    refreshSubModels(item) {
      return this.replaceContextByTab(item, false);
    }
    shouldShowSyncButton(item) {
      const syncStatus = this.contextService.getModelSyncStatus(item);
      return syncStatus !== null;
    }
    getSyncButtonClass(item) {
      const syncStatus = this.contextService.getModelSyncStatus(item);
      if (!syncStatus) {
        return "";
      }
      switch (syncStatus) {
        case "automatic":
          return "sync-automatic";
        case "up-to-date":
          return "sync-up-to-date";
        case "out-of-sync":
          return "sync-out-of-sync";
        case "deleted":
          return "sync-deleted";
        case "no-date":
          return "sync-no-date";
        default:
          return "";
      }
    }
    getSyncButtonTooltip(item) {
      const syncStatus = this.contextService.getModelSyncStatus(item);
      if (!syncStatus) {
        return "";
      }
      switch (syncStatus) {
        case "automatic":
          return "Automatic sync enabled; Updates every 30 sec if changed";
        case "up-to-date":
          return "Model is up to date";
        case "out-of-sync":
          return "Manually sync model's latest version; Reload will discard manual changes";
        case "deleted":
          return "Original model was deleted. Use \"Save As\" to keep this model.";
        case "no-date":
          return "No edit date available for this model";
        default:
          return "";
      }
    }
    syncModel(item, event) {
      var _this = this;
      return (0, default)(function* () {
        if (event) {
          event.stopPropagation();
        }
        const syncStatus = _this.contextService.getModelSyncStatus(item);
        if (syncStatus === "out-of-sync" || syncStatus === "deleted") {
          yield _this.contextService.manualSyncModel(item);
        }
      })();
    }
    testTest() {
      return (0, default)(function* () {})();
    } // const model = JSON.stringify(getInitRappidShared().getOpmModel().toJson());
    // const url = 'https://20231109t150130-dot-opcloud-trial.uc.r.appspot.com/flattening';
    // console.log(new Date());
    // const ret = await this.http.post<any>(url, {model}).toPromise().catch(err => console.error(err));
    // console.log(new Date());
    // this.initRappidService.opmModel.fromJson(ret.data);
    static #_ = (() => this.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || HeaderComponent)(core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(HttpClient));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: HeaderComponent,
      selectors: [["opc-header"]],
      decls: 66,
      vars: 5,
      consts: [[1, "app-toolbar-container"], ["color", "primary", 1, "app-toolbar", "mat-elevation-z6"], [1, "logo", 3, "dblclick"], ["src", "assets/SVG/newLogo.svg", 2, "width", "110px"], [1, "model-name"], [1, "buttonsProcessandObject"], ["id", "objectDrag", "src", "assets/SVG/objectDrag.svg", 2, "position", "absolute", "top", "-800px"], ["id", "processDrag", "src", "assets/SVG/processDrag.svg", 2, "position", "absolute", "top", "-800px"], ["draggable", "true", 3, "touchstart", "dragstart", "dragend", "touchend", "contextmenu"], ["value", "object", "id", "object", 3, "mousedown"], ["width", "77", "height", "51", "viewBox", "0 0 77 51", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["opacity", "0.5", "filter", "url(#filter0_d)"], ["width", "77", "height", "50", "rx", "7", "fill", "white", "fill-opacity", "0.07"], ["x", "0.5", "y", "0.5", "width", "76", "height", "49", "rx", "6.5", "stroke", "white"], ["filter", "url(#filter1_d)"], ["id", "path-3-inside-1", "fill", "white"], ["x", "18.4333", "y", "10", "width", "40.1334", "height", "28", "rx", "3"], ["x", "18.4333", "y", "10", "width", "40.1334", "height", "28", "rx", "3", "stroke", "#70E483", "stroke-width", "8", "mask", "url(#path-3-inside-1)"], ["id", "filter0_d", "x", "0", "y", "0", "width", "77", "height", "51", "filterUnits", "userSpaceOnUse", "color-interpolation-filters", "sRGB"], ["flood-opacity", "0", "result", "BackgroundImageFix"], ["in", "SourceAlpha", "type", "matrix", "values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"], ["dy", "1"], ["type", "matrix", "values", "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"], ["mode", "normal", "in2", "BackgroundImageFix", "result", "effect1_dropShadow"], ["mode", "normal", "in", "SourceGraphic", "in2", "effect1_dropShadow", "result", "shape"], ["id", "filter1_d", "x", "17.4333", "y", "10", "width", "42.1334", "height", "31", "filterUnits", "userSpaceOnUse", "color-interpolation-filters", "sRGB"], ["dy", "2"], ["stdDeviation", "0.5"], ["type", "matrix", "values", "0 0 0 0 0.101961 0 0 0 0 0.235294 0 0 0 0 0.360784 0 0 0 1 0"], ["id", "process-stensil", "draggable", "true", 3, "touchstart", "dragstart", "dragend", "touchend", "contextmenu"], ["value", "process", "id", "process", 3, "mousedown"], ["d", "M56.5667 24C56.5667 27.0312 54.8081 29.9826 51.5449 32.2592C48.2885 34.5311 43.6827 36 38.5 36C33.3174 36 28.7115 34.5311 25.4551 32.2592C22.1919 29.9826 20.4333 27.0312 20.4333 24C20.4333 20.9688 22.1919 18.0174 25.4551 15.7408C28.7115 13.4689 33.3174 12 38.5 12C43.6827 12 48.2885 13.4689 51.5449 15.7408C54.8081 18.0174 56.5667 20.9688 56.5667 24Z", "stroke", "#3BC3FF", "stroke-width", "4"], ["id", "filter1_d", "x", "17.4333", "y", "10", "width", "42.1333", "height", "31", "filterUnits", "userSpaceOnUse", "color-interpolation-filters", "sRGB"], ["id", "gal", "cdkDropList", "", 3, "cdkDropListDropped"], ["cdkDrag", "", "cdkDragBoundary", "#gal", 3, "ngClass", "matTooltip", "click", 4, "ngFor", "ngForOf"], ["class", "modelTab", "style", "max-width: 30px;", 3, "click", 4, "ngIf"], [1, "app-toolbar-filler"], ["cdkDrag", "", "cdkDragBoundary", "#gal", 3, "click", "ngClass", "matTooltip"], [1, "closeTab", 3, "click"], ["width", "8", "height", "10", "viewBox", "0 0 10 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M9.54 1L1 12M1 1L9.54 12", "stroke", "#586D8C", "stroke-width", "2"], ["class", "closeTab refreshSubModels", "style", "margin-top: 8px;", "matTooltipPosition", "left", "matTooltip", "Reset/Unload all previously loaded sub-models for reloading", 3, "click", 4, "ngIf"], ["class", "closeTab syncModel", "matTooltipPosition", "left", "style", "margin-top: 0;", 3, "ngClass", "matTooltip", "click", 4, "ngIf"], [1, "modelTabName"], ["matTooltipPosition", "left", "matTooltip", "Reset/Unload all previously loaded sub-models for reloading", 1, "closeTab", "refreshSubModels", 2, "margin-top", "8px", 3, "click"], ["width", "22", "height", "22", "viewBox", "0 0 13 13", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["width", "13", "height", "13", "fill", "#D9D9D9", "fill-opacity", "0.01"], ["d", "M0.320035 6.54364C0.181548 6.46394 0.181548 6.26494 0.320035 6.19283L4.22248 4.161C4.35571 4.09163 4.51846 4.19253 4.51846 4.34451V8.62212C4.51846 8.7741 4.35571 8.86608 4.22248 8.78941L0.320035 6.54364Z", "fill", "#5A6F8F"], ["d", "M6.5 4.5V3C6.5 2.44772 6.94772 2 7.5 2L10.5 2C11.0523 2 11.5 2.44772 11.5 3V6.5V10C11.5 10.5523 11.0523 11 10.5 11H7.5C6.94772 11 6.5 10.5523 6.5 10L6.5 8.5", "stroke", "#5A6F8F"], ["x1", "4", "y1", "6.5", "x2", "9", "y2", "6.5", "stroke", "#5A6F8F"], ["matTooltipPosition", "left", 1, "closeTab", "syncModel", 2, "margin-top", "0", 3, "click", "ngClass", "matTooltip"], ["width", "22", "height", "22", "viewBox", "0 0 22 22", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M11 4V1L7 5L11 9V6C14.866 6 18 9.134 18 13C18 13.5523 18.4477 14 19 14C19.5523 14 20 13.5523 20 13C20 8.02944 15.9706 4 11 4Z", "fill", "currentColor"], ["d", "M11 18V21L15 17L11 13V16C7.13401 16 4 12.866 4 9C4 8.44772 3.55228 8 3 8C2.44772 8 2 8.44772 2 9C2 13.9706 6.02944 18 11 18Z", "fill", "currentColor"], [1, "modelTab", 2, "max-width", "30px", 3, "click"], [1, "modelTabName", 2, "margin-left", "0px"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "mat-toolbar", 1);
          core /* ɵɵelement */.nrm(2, "opc-menu");
          core /* ɵɵelementStart */.j41(3, "div", 2);
          core /* ɵɵlistener */.bIt("dblclick", function HeaderComponent_Template_div_dblclick_3_listener() {
            return ctx.testTest();
          });
          core /* ɵɵelement */.nrm(4, "img", 3);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "div", 4);
          core /* ɵɵtext */.EFF(6);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "div", 5);
          core /* ɵɵelement */.nrm(8, "img", 6)(9, "img", 7);
          core /* ɵɵelementStart */.j41(10, "div", 8);
          core /* ɵɵlistener */.bIt("touchstart", function HeaderComponent_Template_div_touchstart_10_listener($event) {
            return ctx.onStartDrag($event);
          })("dragstart", function HeaderComponent_Template_div_dragstart_10_listener($event) {
            return ctx.onStartDrag($event);
          })("dragend", function HeaderComponent_Template_div_dragend_10_listener($event) {
            return ctx.onDrop($event, "object");
          })("touchend", function HeaderComponent_Template_div_touchend_10_listener($event) {
            return ctx.onDrop($event, "object");
          })("contextmenu", function HeaderComponent_Template_div_contextmenu_10_listener($event) {
            return ctx.rightClickHandle($event);
          });
          core /* ɵɵelementStart */.j41(11, "button", 9);
          core /* ɵɵlistener */.bIt("mousedown", function HeaderComponent_Template_button_mousedown_11_listener() {
            return ctx.closeTextEditorForNewSelection();
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(12, "svg", 10)(13, "g", 11);
          core /* ɵɵelement */.nrm(14, "rect", 12)(15, "rect", 13);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "g", 14)(17, "mask", 15);
          core /* ɵɵelement */.nrm(18, "rect", 16);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(19, "rect", 17);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "defs")(21, "filter", 18);
          core /* ɵɵelement */.nrm(22, "feFlood", 19)(23, "feColorMatrix", 20)(24, "feOffset", 21)(25, "feColorMatrix", 22)(26, "feBlend", 23)(27, "feBlend", 24);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "filter", 25);
          core /* ɵɵelement */.nrm(29, "feFlood", 19)(30, "feColorMatrix", 20)(31, "feOffset", 26)(32, "feGaussianBlur", 27)(33, "feColorMatrix", 28)(34, "feBlend", 23)(35, "feBlend", 24);
          core /* ɵɵelementEnd */.k0s()()()()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(36, "div", 29);
          core /* ɵɵlistener */.bIt("touchstart", function HeaderComponent_Template_div_touchstart_36_listener($event) {
            return ctx.onStartDrag($event);
          })("dragstart", function HeaderComponent_Template_div_dragstart_36_listener($event) {
            return ctx.onStartDrag($event);
          })("dragend", function HeaderComponent_Template_div_dragend_36_listener($event) {
            return ctx.onDrop($event, "process");
          })("touchend", function HeaderComponent_Template_div_touchend_36_listener($event) {
            return ctx.onDrop($event, "process");
          })("contextmenu", function HeaderComponent_Template_div_contextmenu_36_listener($event) {
            return ctx.rightClickHandle($event);
          });
          core /* ɵɵelementStart */.j41(37, "button", 30);
          core /* ɵɵlistener */.bIt("mousedown", function HeaderComponent_Template_button_mousedown_37_listener() {
            return ctx.closeTextEditorForNewSelection();
          });
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(38, "svg", 10)(39, "g", 11);
          core /* ɵɵelement */.nrm(40, "rect", 12)(41, "rect", 13);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(42, "g", 14);
          core /* ɵɵelement */.nrm(43, "path", 31);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(44, "defs")(45, "filter", 18);
          core /* ɵɵelement */.nrm(46, "feFlood", 19)(47, "feColorMatrix", 20)(48, "feOffset", 21)(49, "feColorMatrix", 22)(50, "feBlend", 23)(51, "feBlend", 24);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(52, "filter", 32);
          core /* ɵɵelement */.nrm(53, "feFlood", 19)(54, "feColorMatrix", 20)(55, "feOffset", 26)(56, "feGaussianBlur", 27)(57, "feColorMatrix", 28)(58, "feBlend", 23)(59, "feBlend", 24);
          core /* ɵɵelementEnd */.k0s()()()()()();
          core /* ɵɵnamespaceHTML */.joV();
          core /* ɵɵelementStart */.j41(60, "div", 33);
          core /* ɵɵlistener */.bIt("cdkDropListDropped", function HeaderComponent_Template_div_cdkDropListDropped_60_listener($event) {
            return ctx.dropTab($event);
          });
          core /* ɵɵtemplate */.DNE(61, HeaderComponent_div_61_Template, 9, 8, "div", 34)(62, HeaderComponent_div_62_Template, 3, 0, "div", 35);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(63, "span", 36)(64, "opc-toolbar")(65, "opc-user-status");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵtextInterpolate */.JRh(ctx.modelName);
          core /* ɵɵadvance */.R7$(54);
          core /* ɵɵstyleMap */.Aen(ctx.getTabsStyle());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.contextService.getTabs());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.contextService.getTabs().length !== 0);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatToolbar, MatTooltip, CdkDropList, CdkDrag, MenuComponent, UserStatusComponent, RappidToolbarComponent, TabTitlePipe],
      styles: ["[_nghost-%COMP%]{box-shadow:10px 0 #000;z-index:1}.app-toolbar[_ngcontent-%COMP%]{position:absolute;height:65px;left:0;top:0;background:#1a3763}.app-toolbar[_ngcontent-%COMP%]   .app-toolbar-menu[_ngcontent-%COMP%]{box-shadow:none;-webkit-user-select:none;user-select:none;background:none;border:none;cursor:pointer;filter:none;font-weight:400;height:auto;line-height:inherit;margin:0;min-width:0;padding:0;text-align:right;text-decoration:none;outline:none}.app-toolbar[_ngcontent-%COMP%]   .app-toolbar-menu[_ngcontent-%COMP%]   .app-toolbar-menu-icon[_ngcontent-%COMP%]{padding:0 14px;color:#ffffff8a;transition:.2s all linear}.app-toolbar[_ngcontent-%COMP%]   .app-toolbar-menu[_ngcontent-%COMP%]   .app-toolbar-menu-icon[_ngcontent-%COMP%]:hover{color:#fff}.app-toolbar[_ngcontent-%COMP%]   .app-toolbar-title[_ngcontent-%COMP%]{font-family:Product Sans,sans-serif;color:#fff}.app-toolbar[_ngcontent-%COMP%]   .app-toolbar-filler[_ngcontent-%COMP%]{flex:1 1 auto}.model-name[_ngcontent-%COMP%]{width:260px;text-align:center;margin:10px;text-overflow:ellipsis;overflow:hidden}.menuButtons[_ngcontent-%COMP%]{margin-top:auto}.group[_ngcontent-%COMP%], .xButton[_ngcontent-%COMP%]{margin-top:auto;border:0px;background:transparent;width:75px;margin-left:-25px;height:65px}.group[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{background-color:#000;box-shadow:#0f1110;z-index:1;margin-top:fill;visibility:hidden}div[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{border:none;background-color:transparent;color:#fff;display:block}div[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]   a[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]:hover{background:#78a8f1;text-align:inherit}div[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]   a[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]{padding-top:5px;border:none;font-family:Roboto,Arial,Helvetica,sans-serif;font-style:normal;font-weight:400;background-color:transparent;color:#fff;display:block;font-size:18px;padding-left:18px}div[_ngcontent-c2][_ngcontent-c2][_ngcontent-%COMP%]   a[_ngcontent-c2][_ngcontent-%COMP%]   .deividerLine[_ngcontent-%COMP%]{width:100%}.buttonsProcessandObject[_ngcontent-%COMP%]{display:-webkit-box;margin-left:-227px}#howManyObjectsToCreate[_ngcontent-%COMP%]{position:relative}#object[_ngcontent-%COMP%], #process[_ngcontent-%COMP%]{cursor:grab}.modelTab[_ngcontent-%COMP%]{height:25px;width:0;flex:1 1 0;max-width:200px;background-image:linear-gradient(180deg,#d6d6d6,#b3b3b3);border-radius:10px 10px 0 0;text-align:center;display:flex;align-items:center;justify-content:flex-start;flex-direction:row;border:1px solid rgba(88,109,140,.5);border-bottom:none}.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform 50ms step-start;opacity:0}.modelTabName[_ngcontent-%COMP%]{font-size:15px;margin-left:5px;display:inline;color:#596d8d;width:173px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.selectedTab[_ngcontent-%COMP%]{height:25px;width:0;flex:1 1 0;max-width:200px;border-radius:10px 10px 0 0;text-align:center;font-weight:700;background-image:linear-gradient(0deg,#dfdfdf,#f1f4f9);display:flex;align-items:center;justify-content:flex-start;flex-direction:row;border:1px solid rgba(88,109,140,.5);border-bottom:none}.closeTab[_ngcontent-%COMP%]{margin-left:7px;margin-top:-2px}.syncModel[_ngcontent-%COMP%]{cursor:pointer;opacity:.7;transition:opacity .2s;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;margin-top:0}.syncModel[_ngcontent-%COMP%]:hover{opacity:1}.syncModel[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:22px;height:22px}.syncModel.sync-automatic[_ngcontent-%COMP%]{color:gray;cursor:default}.syncModel.sync-up-to-date[_ngcontent-%COMP%]{color:#90ee90}.syncModel.sync-out-of-sync[_ngcontent-%COMP%]{color:gold}.syncModel.sync-deleted[_ngcontent-%COMP%]{color:#ff6b6b}.syncModel.sync-no-date[_ngcontent-%COMP%]{color:gray;cursor:default;opacity:.5}"]
    }))();
  }
  return HeaderComponent;
})();