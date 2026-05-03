// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const rappid_toolbar_component_c0 = () => ["redo"];
function RappidToolbarComponent_div_1_button_1_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-icon");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const command_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(command_r2.icon);
  }
}
function RappidToolbarComponent_div_1_button_1_div_2_mat_spinner_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "mat-spinner", 7);
  }
  if (rf & 2) {
    core /* ɵɵproperty */.Y8G("diameter", 25);
  }
}
function RappidToolbarComponent_div_1_button_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtemplate */.DNE(1, RappidToolbarComponent_div_1_button_1_div_2_mat_spinner_1_Template, 1, 1, "mat-spinner", 6);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const command_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", command_r2.progressSpinner());
  }
}
function RappidToolbarComponent_div_1_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 4);
    core /* ɵɵlistener */.bIt("click", function RappidToolbarComponent_div_1_button_1_Template_button_click_0_listener() {
      const command_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.buttonClick(command_r2));
    });
    core /* ɵɵtemplate */.DNE(1, RappidToolbarComponent_div_1_button_1_mat_icon_1_Template, 2, 1, "mat-icon", 5)(2, RappidToolbarComponent_div_1_button_1_div_2_Template, 2, 1, "div", 5);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const command_r2 = ctx.$implicit;
    core /* ɵɵpropertyInterpolate */.FS9("id", command_r2.id);
    core /* ɵɵproperty */.Y8G("disabled", core /* ɵɵpureFunction0 */.lJ4(5, rappid_toolbar_component_c0).includes("k"))("matTooltip", command_r2.tooltip);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !command_r2.progressSpinner);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", command_r2.progressSpinner);
  }
}
function RappidToolbarComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 2);
    core /* ɵɵtemplate */.DNE(1, RappidToolbarComponent_div_1_button_1_Template, 3, 6, "button", 3);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const commandGroup_r4 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", commandGroup_r4.commands);
  }
}
let valuesArray = new Array();
const commandGroups = [{
  group: "editor",
  commands: [{
    name: "undo",
    tooltip: "Undo",
    icon: "undo"
  }, {
    name: "redo",
    tooltip: "Redo",
    icon: "redo"
  }
  // { name: 'clearcanvas', tooltip: 'Clear Canvas', icon: 'delete_sweep' },
  // { name: 'newModel', tooltip: 'New Model', icon: 'fiber_new' }
  ]
}, {
  group: "file",
  commands: [
  // { name: 'executeIfLogged(exportModel)', tooltip: 'export', icon: 'backup' },
  // { name: 'importModel', tooltip: 'Import/Export opx Model', icon: 'import_export' },
  {
    id: "save",
    name: "executeIfLogged(saveModel)",
    tooltip: "Save",
    icon: "save"
  },
  // { name: 'executeIfLogged(saveModelAs)', tooltip: 'Save As', icon: 'library_books' },
  {
    id: "load",
    name: "executeIfLogged(loadModel)",
    tooltip: "Load",
    icon: "open_in_browser"
  },
  // Export OPL button
  // { name: 'executeIfLogged(exportOPL)', tooltip: 'Export OPL', icon: 'publish' },
  {
    name: "copyLink",
    tooltip: "Copy link URL for current model",
    icon: "link"
  }
  // Export ScreenShots button
  // { name: 'executeIfLogged(saveScreenshot)', tooltip: 'Save Screenshot', icon: 'camera_alt' }
  ]
}, {
  group: "zoom",
  commands: [
  // { name: 'zoomin', tooltip: 'Zoom In', icon: 'zoom_in' },
  // { name: 'zoomout', tooltip: 'Zoom Out', icon: 'zoom_out' },
  // { name: 'zoomtofit', tooltip: 'Zoom to Fit', icon: 'zoom_out_map' },
  // { name: 'zoomtodefault', tooltip: 'Default Zoom', icon: 'youtube_searched_for' },
  // { name: 'about', tooltip: 'About', icon: 'info' },
  {
    name: "execute",
    tooltip: "Execute",
    icon: "send"
  }
  // { name: 'list', tooltip: 'List Elements', icon: 'list' } moved to setting
  ]
}];
let RappidToolbarComponent = /*#__PURE__*/(() => {
  class RappidToolbarComponent extends ToolbarComponent {
    constructor(graphService, initRappidService, _dialog, userService, oplService, context, model) {
      super();
      this.graphService = graphService;
      this.initRappidService = initRappidService;
      this._dialog = _dialog;
      this.userService = userService;
      this.oplService = oplService;
      this.context = context;
      this.model = model;
      this.commandGroups = commandGroups;
      this.scenario = {};
      this.userService.user$.subscribe(user => this.currentUser = user);
    }
    getCommands() {
      return commandGroups;
    }
    // makeUrl(): string {
    //   const name: string = this.graphService.modelObject.name || '';
    //   const path: string = this.graphService.modelObject.path || '';
    //   if (name.trim().length + path.trim().length > 0) {
    //     let url = window.location.origin + '/load?path=' + path + '&name=' + name;
    //     url = url.replace(/ /g, '%20');
    //     return url;
    //   }
    //   return null;
    // }
    ngOnInit() {
      this.graph = this.graphService.getGraph();
      this.user = this.userService.user$;
    }
    ngDoCheck() {
      this.commandGroups[0].commands[0].tooltip = this.initRappidService.getOpmModel().undoRedo.getLastUndoStateReason();
      this.commandGroups[0].commands[1].tooltip = this.initRappidService.getOpmModel().undoRedo.getLastRedoStateReason();
    }
    undo() {
      (0, undoShared)();
    }
    redo() {
      (0, redoshared)();
    }
    importModel() {
      this._dialog.open(UploadFile);
    }
    copyLink() {
      this.model.openUrlDialog();
    }
    saveModel() {
      var _this = this;
      return (0, default)(function* () {
        if (_this.initRappidService.modelService.modelObject?.modelData?.dirsPath?.find(d => d.id === "ORGEXAMPLES")) {
          (0, validationAlert)("To prevent overriding examples by mistake, this shortcut is disabled. Please use the menu saving option.", 3500, "Error");
          return;
        }
        if (_this.currentUser.userData.isViewerAccount) {
          (0, validationAlert)("This operation is not available for viewer accounts. Please contact your organization's admin to make changes. Thank you!", 5000, "ERROR");
          return;
        }
        const savingCommand = _this.commandGroups.find(cg => cg.group === "file").commands.find(cmd => cmd.id === "save");
        savingCommand.progressSpinner = () => {
          if (_this.context.isCurrentlySavingModel) {
            return true;
          } else {
            delete savingCommand.progressSpinner;
          }
        };
        const image = yield _this.initRappidService.getModelImage();
        _this.model.save(image);
      })();
    }
    loadModel() {
      this.model.openLoadModelDialog();
    }
    executeIfLogged(func) {
      return this[func]();
    }
    zoomin() {
      this.initRappidService.paperScroller.zoom(0.2, {
        max: 4
      });
    }
    zoomout() {
      this.initRappidService.paperScroller.zoom(-0.2, {
        min: 0.2
      });
    }
    zoomtofit() {
      this.initRappidService.paperScroller.zoomToFit();
    }
    zoomtodefault() {
      this.initRappidService.paperScroller.zoom(1, {
        absolute: true
      });
    }
    about() {
      const dialogRef = this._dialog.open(AboutDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {}
      });
    }
    newModel() {
      this.initRappidService.setSelectedElementToNull();
      this.model.newModel();
    }
    execute() {
      if (!this.userService.user.userData.isExecutionUser) {
        this._dialog.open(ConfirmDialogDialogComponent, {
          height: "340px",
          width: "430px",
          data: {
            message: "Unlock Premium Feature!\nUpgrade to access animated simulations, error detection, calculations, and more.\nIf you're part of an organization, contact your admin. Otherwise, reach out to us at <a href=\"mailto:contact@opcloud.tech\">contact@opcloud.tech</a>.\n\nThe animated simulation and model execution provide deep insights into system behavior, help identify conceptual modeling errors, perform calculations, execute code (e.g., Python), and integrate with external systems.",
            okName: "Got it!",
            okColor: "#1a3763",
            centerText: true,
            closeFlag: true
          }
        });
        return;
      }
      if (this.initRappidService.selectedElement) {
        this.initRappidService.setSelectedElementToNull();
      }
      // If clicked on the execute icon and already was in execution mode then stop execution mode and restore values
      if (this.initRappidService.ExecuteMode === true && this.initRappidService.Executing === false) {
        this.initRappidService.ExecuteMode = false;
        (0, updateAllObjectValues)(valuesArray, this.initRappidService);
        valuesArray = [];
      } else {
        // If clicked on the execute icon and wasn't in execution mode then start execution mode
        this.initRappidService.ExecuteMode = true;
        valuesArray = (0, copyAllObjectValues)(valuesArray, this.initRappidService);
      }
      // If clicked on the execute icon during execution then alert
      if (this.initRappidService.Executing === true) {
        (0, validationAlert)("Executing is still running!", 5000, "error");
      }
    }
    /**
     * Alon: button for mapping elements in the model
     */
    list() {
      const options = this.initRappidService;
      this.graphService.displayElements(options);
    }
    // This function is exporting all OPL sentences to an HTML file.
    // The exported file includes the OPL sentences for each SD and for all SDs without duplication of OPL sentences.
    exportOPL() {
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
          const allOpd = this.initRappidService.opmModel.opds;
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
    /* dialog box for saving opds as jpeg files */
    saveScreenshot() {
      this._dialog.open(SaveScreenshotComponent);
    }
    getCurrentUser() {
      return this.user;
      /* return new Promise(resolve => {
         this.userService.user$.take(1)
           .subscribe(user => {
             this.currentUser = {
               uid: user ? user.uid : '',
               displayName: user ? user.displayName : 'Anonymous',
               email: user ? user.email : '',
             };
             resolve(user);
           });
       });*/
    }
    static #_ = (() => this.ɵfac = function RappidToolbarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RappidToolbarComponent)(core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(ModelStorageService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RappidToolbarComponent,
      selectors: [["opc-toolbar"]],
      features: [core /* ɵɵInheritDefinitionFeature */.Vt3],
      decls: 3,
      vars: 1,
      consts: [["align", "right", 1, "button-row"], ["class", "button-group", "align", "right", 4, "ngFor", "ngForOf"], ["align", "right", 1, "button-group"], ["mat-mini-fab", "", "class", "button", 3, "id", "disabled", "matTooltip", "click", 4, "ngFor", "ngForOf"], ["mat-mini-fab", "", 1, "button", 3, "click", "id", "disabled", "matTooltip"], [4, "ngIf"], ["class", "mat-spinner-color", 3, "diameter", 4, "ngIf"], [1, "mat-spinner-color", 3, "diameter"]],
      template: function RappidToolbarComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0);
          core /* ɵɵtemplate */.DNE(1, RappidToolbarComponent_div_1_Template, 2, 1, "div", 1);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(2, "div");
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.commands);
        }
      },
      dependencies: [MatTooltip, MatIcon, MatMiniFabButton, MatProgressSpinner, NgForOf, NgIf],
      styles: [".button-row[_ngcontent-%COMP%]{position:relative;height:66px;display:flex;align-items:center;justify-content:space-around}.button-row[_ngcontent-%COMP%]   .button-group[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-around;margin:2px}.button-row[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{border:none;background:transparent;color:#fff;margin:4px;box-sizing:content-box;box-shadow:none}.mat-mdc-spinner-color[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]{stroke:#fff!important}"]
    }))();
  }
  return RappidToolbarComponent;
})();