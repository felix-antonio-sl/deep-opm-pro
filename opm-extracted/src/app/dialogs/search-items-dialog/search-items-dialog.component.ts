// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/search-items-dialog/search-items-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

    const search_items_dialog_component_c0 = (a0, a1) => ({
      object: a0,
      process: a1
    });
    function SearchItemsDialogComponent_div_9_Template(rf, ctx) {
      if (rf & 1) {
        core /* ɵɵelementStart */.j41(0, "div", 30);
        core /* ɵɵtext */.EFF(1);
        core /* ɵɵelementEnd */.k0s();
      }
      if (rf & 2) {
        const ctx_r0 = core /* ɵɵnextContext */.XpG();
        core /* ɵɵadvance */.R7$();
        core /* ɵɵtextInterpolate */.JRh(ctx_r0.subtitle);
      }
    }
    function SearchItemsDialogComponent_option_19_Template(rf, ctx) {
      if (rf & 1) {
        core /* ɵɵelementStart */.j41(0, "option", 31);
        core /* ɵɵtext */.EFF(1, "Notes Only");
        core /* ɵɵelementEnd */.k0s();
      }
    }
    function SearchItemsDialogComponent_div_20_Template(rf, ctx) {
      if (rf & 1) {
        const _r2 = core /* ɵɵgetCurrentView */.RV6();
        core /* ɵɵelementStart */.j41(0, "div", 32)(1, "input", 33);
        core /* ɵɵlistener */.bIt("change", function SearchItemsDialogComponent_div_20_Template_input_change_1_listener($event) {
          core /* ɵɵrestoreView */.eBV(_r2);
          const ctx_r0 = core /* ɵɵnextContext */.XpG();
          return core /* ɵɵresetView */.Njj(ctx_r0.onChangeShowNotes($event));
        });
        core /* ɵɵelementEnd */.k0s();
        core /* ɵɵtext */.EFF(2, "Show Also Notes ");
        core /* ɵɵelementEnd */.k0s();
      }
      if (rf & 2) {
        const ctx_r0 = core /* ɵɵnextContext */.XpG();
        core /* ɵɵadvance */.R7$();
        core /* ɵɵproperty */.Y8G("checked", ctx_r0.showAlsoNotes);
      }
    }
    function SearchItemsDialogComponent_ng_container_33_div_1_Template(rf, ctx) {
      if (rf & 1) {
        const _r3 = core /* ɵɵgetCurrentView */.RV6();
        core /* ɵɵelementStart */.j41(0, "div", 22)(1, "div", 35);
        core /* ɵɵtext */.EFF(2);
        core /* ɵɵelementEnd */.k0s();
        core /* ɵɵelementStart */.j41(3, "div", 36);
        core /* ɵɵlistener */.bIt("click", function SearchItemsDialogComponent_ng_container_33_div_1_Template_div_click_3_listener() {
          const y_r4 = core /* ɵɵrestoreView */.eBV(_r3).index;
          const element_r5 = core /* ɵɵnextContext */.XpG().$implicit;
          const ctx_r0 = core /* ɵɵnextContext */.XpG();
          return core /* ɵɵresetView */.Njj(ctx_r0.goToOpdById(element_r5, y_r4));
        });
        core /* ɵɵtext */.EFF(4);
        core /* ɵɵelementEnd */.k0s()();
      }
      if (rf & 2) {
        const y_r4 = ctx.index;
        const element_r5 = core /* ɵɵnextContext */.XpG().$implicit;
        core /* ɵɵadvance */.R7$();
        core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction2 */.l_i(3, search_items_dialog_component_c0, element_r5.thing.name === "OpmLogicalObject", element_r5.thing.name === "OpmLogicalProcess"));
        core /* ɵɵadvance */.R7$();
        core /* ɵɵtextInterpolate */.JRh(element_r5.thing._text);
        core /* ɵɵadvance */.R7$(2);
        core /* ɵɵtextInterpolate */.JRh(element_r5.opdElements[y_r4].name);
      }
    }
    function SearchItemsDialogComponent_ng_container_33_Template(rf, ctx) {
      if (rf & 1) {
        core /* ɵɵelementContainerStart */.qex(0);
        core /* ɵɵtemplate */.DNE(1, SearchItemsDialogComponent_ng_container_33_div_1_Template, 5, 6, "div", 34);
        core /* ɵɵelementContainerEnd */.bVm();
      }
      if (rf & 2) {
        const element_r5 = ctx.$implicit;
        core /* ɵɵadvance */.R7$();
        core /* ɵɵproperty */.Y8G("ngForOf", element_r5.opdElements);
      }
    }
    function SearchItemsDialogComponent_div_34_Template(rf, ctx) {
      if (rf & 1) {
        core /* ɵɵelementStart */.j41(0, "div", 37)(1, "div");
        core /* ɵɵtext */.EFF(2, "No elements to show");
        core /* ɵɵelementEnd */.k0s()();
      }
    }
    let SearchItemsDialogComponent = /*#__PURE__*/(() => {
      class SearchItemsDialogComponent {
        constructor(data, dialogRef, treeViewService) {
          this.data = data;
          this.dialogRef = dialogRef;
          this.treeViewService = treeViewService;
          this.showTypeIndex = "0";
          this.showType = [OpmLogicalThing, OpmLogicalProcess, OpmLogicalObject, Object];
          this.searchString = "";
          this.opmModel = treeViewService.initRappid.opmModel;
          this.graphService = treeViewService.initRappid.graphService;
          this.opd = treeViewService.initRappid.opmModel.opds;
          this.title = data.title || "Model Things Searching";
          this.subtitle = data.subtitle;
          this.showAlsoNotes = false;
          this.allEntities = data.allEntities || this.opmModel.getAllBasicThings();
          // adds the opd to the constList
          this.addOpdToConstList();
          this.searchList = [...this.constList.filter(th => !th.thing.getBelongsToStereotyped())];
          this.notesList = [];
          treeViewService.initRappid.opmModel.opds.forEach(opd => {
            for (const note of opd.notes) {
              this.notesList.push({
                thing: {
                  id: note.id,
                  name: note.title,
                  text: note.title,
                  _text: note.title,
                  content: note.content,
                  getBelongsToStereotyped: () => false
                },
                opdElements: [{
                  id: opd.id,
                  name: opd.getNumberedName() + (opd.getName() === "SD" ? "" : ": " + opd.getName())
                }]
              });
            }
          });
          if (data && data.element) {
            this.searchString = data.element.text;
            this.searchLid = data.element.lid;
            this.search();
          }
        }
        // ngOnInit(){
        //   const data ={message: 'Warning: Not a valid search!', closeFlag: true}
        //   this.dialogService.openDialog(this , 500, 600, data)
        // }
        /**
         *  Tanys: Recieves a search input from the user and creates a list of relevant "things"
         * @param evt - the event of user's input
         */
        thingSearching(evt) {
          this.showTypeIndex = evt.target.value;
          if (Number(this.showTypeIndex) === 3) {
            this.showAlsoNotes = true;
          }
          this.updateSearchList();
        }
        /**
         * Tanya: Updating the search list according to the search input
         */
        updateSearchList() {
          this.searchList = [...this.constList];
          if (this.showAlsoNotes) {
            this.searchList.push(...this.notesList);
          }
          this.filterList();
        }
        /**
         *  Tanya: sorting two "things" by their names.
         */
        sortFunc(e1, e2) {
          if (e1.name == e2.name) {
            if (e1.text < e2.text) {
              return -1;
            } else {
              return 1;
            }
          }
          if (e1.name === "OpmLogicalObject") {
            return -1;
          } else {
            return 1;
          }
        }
        /**
         * Tanya: Filtering of the list containing the "things" by user's input
         */
        filterList() {
          if (Number(this.showTypeIndex) === 3) {
            this.searchList = this.searchList.filter(e => !(e.thing instanceof OpmLogicalThing));
          }
          this.searchList = this.searchList.filter(e => !e.thing.content && e.thing instanceof this.showType[this.showTypeIndex] || this.showAlsoNotes && e.thing.content && (Number(this.showTypeIndex) === 0 || Number(this.showTypeIndex) === 3)).sort((e1, e2) => this.sortFunc(e1, e2));
          this.searchList = this.searchList.filter(th => !th.thing.getBelongsToStereotyped());
          if (this.searchLid) {
            this.searchList = this.searchList.filter(item => item.thing.lid === this.searchLid);
          }
          if (this.searchString.length > 0) {
            this.searchList = this.searchList.filter(e => e.thing.text.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || e.thing.content?.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
          }
        }
        search() {
          this.updateSearchList();
        }
        /**
         * Adds the OPD name and ID to the list of all the "things"
         * The name will be displayed in the table
         * The Id will be used to connect to the OPD location
         */
        addOpdToConstList() {
          const updatedList = [];
          for (const item of this.allEntities) {
            if (!(item instanceof OpmLogicalThing)) {
              continue;
            }
            const newItem = {
              thing: item,
              opdElements: []
            };
            // const itemVisualElementIdsList = item.getAllVisualElementIdsByLogical();
            for (let i = 0; i < item.visualElements.length; i++) {
              const opd = this.opmModel.getOpdByThingId(item.visualElements[i].id);
              if (opd && opd.isHidden === false) {
                newItem.opdElements.push({
                  name: opd.getNumberedName() + (opd.getName() === "SD" ? "" : ": " + opd.getName()),
                  id: opd.id
                });
              }
            }
            updatedList.push(newItem);
          }
          this.constList = updatedList;
        }
        /**
         * Tanya: Redirection of the screen to the relevant OPD
         * @param id - The OPD Id of the searched thing.
         */
        goToOpdById(element, visualIndex) {
          this.treeViewService.initRappid.opdHierarchyRef.previousOpdId = this.opmModel.currentOpd.id;
          const opd = this.opmModel.getOpd(element.opdElements[visualIndex].id);
          if (opd) {
            this.graphService.renderGraph(opd, this.treeViewService.initRappid, element.thing);
          }
          this.dialogRef.close("goToOPD");
        }
        onStartDrag(event) {
          if (event.touches) {
            return;
          }
          event.preventDefault();
          const that = this;
          window.onmousemove = function (e) {
            that.moveDrag(e);
          };
          window.onmouseup = function (e) {
            that.endDrag(e);
          };
        }
        endDrag(event) {
          window.onmousemove = function (e) {};
          window.onmouseup = function (e) {};
        }
        moveDrag(event) {
          const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
          this.dialogRef.updatePosition({
            left: event.clientX - 560 + "px",
            top: event.clientY - 35 + scrollTop + "px"
          });
        }
        onChangeShowNotes($event) {
          this.showAlsoNotes = $event.target.checked;
          this.updateSearchList();
        }
        exportToCSV() {
          // const modelName = this.opmModel.name ? this.opmModel.name : 'Unsaved Model';
          let csv = "";
          if (this.searchString.trim().length > 0) {
            csv += `Search by:,"${this.searchString.trim()}"
`;
          }
          csv += "Element Name,Element Type,Containing OPD\n";
          for (const element of this.searchList) {
            let y = 0;
            for (const locat of element.opdElements) {
              csv += `"${element.thing._text}",`;
              let type = "Note";
              if (element.thing.name === "OpmLogicalObject") {
                type = "Object";
              } else if (element.thing.name === "OpmLogicalProcess") {
                type = "Process";
              }
              csv += `${type},`;
              csv += `"${element.opdElements[y].name}"
`;
              y += 1;
            }
          }
          const csvData = new Blob([new Uint8Array([239, 187, 191]), csv], {
            type: "text/csv;charset=utf-8;"
          });
          const csvURL = URL.createObjectURL(csvData);
          const a = document.createElement("a");
          a.href = csvURL;
          const fileName = "Search_List_" + getCurrentDateFormatted() + ".csv";
          a.setAttribute("download", fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        static #_ = (() => this.ɵfac = function SearchItemsDialogComponent_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || SearchItemsDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(TreeViewService));
        })();
        static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
          type: SearchItemsDialogComponent,
          selectors: [["search-items-dialog"]],
          decls: 40,
          vars: 7,
          consts: [["id", "content"], ["draggable", "true", 2, "text-align", "right", "top", "0px", "cursor", "move", 3, "dragstart"], ["width", "18", "height", "20", "viewBox", "0 0 22 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.8936 10.3536C21.0888 10.1583 21.0888 9.84171 20.8936 9.64645L17.7116 6.46447C17.5163 6.2692 17.1997 6.2692 17.0045 6.46447C16.8092 6.65973 16.8092 6.97631 17.0045 7.17157L19.8329 10L17.0045 12.8284C16.8092 13.0237 16.8092 13.3403 17.0045 13.5355C17.1997 13.7308 17.5163 13.7308 17.7116 13.5355L20.8936 10.3536ZM12 10.5H20.54V9.5H12V10.5Z", "fill", "#586D8C"], ["d", "M1.09554 9.64645C0.900274 9.84171 0.900274 10.1583 1.09554 10.3536L4.27752 13.5355C4.47278 13.7308 4.78936 13.7308 4.98462 13.5355C5.17989 13.3403 5.17989 13.0237 4.98462 12.8284L2.1562 10L4.98462 7.17157C5.17989 6.97631 5.17989 6.65973 4.98462 6.46447C4.78936 6.2692 4.47278 6.2692 4.27752 6.46447L1.09554 9.64645ZM12 9.5L1.44909 9.5V10.5L12 10.5V9.5Z", "fill", "#586D8C"], ["d", "M11.3536 0.191901C11.1583 -0.00336151 10.8417 -0.00336151 10.6464 0.191901L7.46447 3.37388C7.2692 3.56914 7.2692 3.88573 7.46447 4.08099C7.65973 4.27625 7.97631 4.27625 8.17157 4.08099L11 1.25256L13.8284 4.08099C14.0237 4.27625 14.3403 4.27625 14.5355 4.08099C14.7308 3.88573 14.7308 3.56914 14.5355 3.37388L11.3536 0.191901ZM11.5 10V0.545454H10.5V10H11.5Z", "fill", "#586D8C"], ["d", "M10.6464 19.8081C10.8417 20.0034 11.1583 20.0034 11.3536 19.8081L14.5355 16.6261C14.7308 16.4309 14.7308 16.1143 14.5355 15.919C14.3403 15.7237 14.0237 15.7237 13.8284 15.919L11 18.7474L8.17157 15.919C7.97631 15.7237 7.65973 15.7237 7.46447 15.919C7.2692 16.1143 7.2692 16.4309 7.46447 16.6261L10.6464 19.8081ZM10.5 10V19.4545H11.5V10H10.5Z", "fill", "#586D8C"], [1, "header"], ["id", "subtitle", 4, "ngIf"], ["id", "selectSearchDiv", 2, "display", "inline-block", "padding-bottom", "11px", "padding-top", "20px"], [1, "selectDiv"], [3, "change"], ["value", "0", "selected", ""], ["value", "1"], ["value", "2"], ["value", "3", 4, "ngIf"], ["id", "showNotesCheckbox", 4, "ngIf"], [1, "searchDiv"], ["id", "searchString", "type", "text", "placeholder", "Search by name", 1, "inputText", 3, "ngModelChange", "keyup", "ngModel"], ["id", "all_elements_holder"], [1, "divTable", "greyGridTable"], [1, "divTableHeading"], [1, "divTableRow"], [1, "divTableHead"], [1, "divTableBody"], [4, "ngFor", "ngForOf"], ["class", "element_holder", 4, "ngIf"], [2, "width", "100%", "height", "36px", "margin-top", "10px", "text-align", "center"], ["mat-button", "", "id", "exportBtn", "matTooltip", "Export Shown Elements to CSV", 1, "footerBtn", 3, "click"], ["mat-button", "", "id", "closeBtn", 1, "footerBtn", 3, "click"], ["id", "subtitle"], ["value", "3"], ["id", "showNotesCheckbox"], ["type", "checkbox", "id", "showAlsoNotesCheckbox", 3, "change", "checked"], ["class", "divTableRow", 4, "ngFor", "ngForOf"], [1, "divTableCell", 3, "ngClass"], [1, "divTableCell", 3, "click"], [1, "element_holder"]],
          template: function SearchItemsDialogComponent_Template(rf, ctx) {
            if (rf & 1) {
              core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
              core /* ɵɵlistener */.bIt("dragstart", function SearchItemsDialogComponent_Template_div_dragstart_1_listener($event) {
                return ctx.onStartDrag($event);
              });
              core /* ɵɵnamespaceSVG */.qSk();
              core /* ɵɵelementStart */.j41(2, "svg", 2);
              core /* ɵɵelement */.nrm(3, "path", 3)(4, "path", 4)(5, "path", 5)(6, "path", 6);
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵnamespaceHTML */.joV();
              core /* ɵɵelementStart */.j41(7, "h2", 7);
              core /* ɵɵtext */.EFF(8);
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵtemplate */.DNE(9, SearchItemsDialogComponent_div_9_Template, 2, 1, "div", 8);
              core /* ɵɵelementStart */.j41(10, "div", 9)(11, "div", 10)(12, "select", 11);
              core /* ɵɵlistener */.bIt("change", function SearchItemsDialogComponent_Template_select_change_12_listener($event) {
                return ctx.thingSearching($event);
              });
              core /* ɵɵelementStart */.j41(13, "option", 12);
              core /* ɵɵtext */.EFF(14, "All Elements");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(15, "option", 13);
              core /* ɵɵtext */.EFF(16, "Processes Only");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(17, "option", 14);
              core /* ɵɵtext */.EFF(18, "Objects Only");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵtemplate */.DNE(19, SearchItemsDialogComponent_option_19_Template, 2, 0, "option", 15);
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵtemplate */.DNE(20, SearchItemsDialogComponent_div_20_Template, 3, 1, "div", 16);
              core /* ɵɵelementStart */.j41(21, "div", 17)(22, "input", 18);
              core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SearchItemsDialogComponent_Template_input_ngModelChange_22_listener($event) {
                if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchString, $event)) {
                  ctx.searchString = $event;
                }
                return $event;
              });
              core /* ɵɵlistener */.bIt("keyup", function SearchItemsDialogComponent_Template_input_keyup_22_listener() {
                return ctx.search();
              });
              core /* ɵɵelementEnd */.k0s()()();
              core /* ɵɵelement */.nrm(23, "hr");
              core /* ɵɵelementStart */.j41(24, "div", 19)(25, "div", 20)(26, "div", 21)(27, "div", 22)(28, "div", 23);
              core /* ɵɵtext */.EFF(29, "Element");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(30, "div", 23);
              core /* ɵɵtext */.EFF(31, "Containing OPD");
              core /* ɵɵelementEnd */.k0s()()();
              core /* ɵɵelementStart */.j41(32, "div", 24);
              core /* ɵɵtemplate */.DNE(33, SearchItemsDialogComponent_ng_container_33_Template, 2, 1, "ng-container", 25);
              core /* ɵɵelementEnd */.k0s()();
              core /* ɵɵtemplate */.DNE(34, SearchItemsDialogComponent_div_34_Template, 3, 0, "div", 26);
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(35, "div", 27)(36, "button", 28);
              core /* ɵɵlistener */.bIt("click", function SearchItemsDialogComponent_Template_button_click_36_listener() {
                return ctx.exportToCSV();
              });
              core /* ɵɵtext */.EFF(37, "Export");
              core /* ɵɵelementEnd */.k0s();
              core /* ɵɵelementStart */.j41(38, "button", 29);
              core /* ɵɵlistener */.bIt("click", function SearchItemsDialogComponent_Template_button_click_38_listener() {
                return ctx.dialogRef.close();
              });
              core /* ɵɵtext */.EFF(39, "Close");
              core /* ɵɵelementEnd */.k0s()()();
            }
            if (rf & 2) {
              core /* ɵɵadvance */.R7$(8);
              core /* ɵɵtextInterpolate */.JRh(ctx.title);
              core /* ɵɵadvance */.R7$();
              core /* ɵɵproperty */.Y8G("ngIf", ctx.subtitle);
              core /* ɵɵadvance */.R7$(10);
              core /* ɵɵproperty */.Y8G("ngIf", !ctx.data.element && !ctx.data.allEntities);
              core /* ɵɵadvance */.R7$();
              core /* ɵɵproperty */.Y8G("ngIf", !ctx.data.element && !ctx.data.allEntities && ctx.showTypeIndex === "0");
              core /* ɵɵadvance */.R7$(2);
              core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchString);
              core /* ɵɵadvance */.R7$(11);
              core /* ɵɵproperty */.Y8G("ngForOf", ctx.searchList);
              core /* ɵɵadvance */.R7$();
              core /* ɵɵproperty */.Y8G("ngIf", ctx.searchList.length === 0);
            }
          },
          dependencies: [NgClass, NgForOf, NgIf, MatTooltip, MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, NgControlStatus, NgModel],
          styles: ["div.greyGridTable[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:center;border-collapse:collapse}.header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:18px;font-weight:500}hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px;margin-top:-8px}#selectSearchDiv[_ngcontent-%COMP%]{position:relative;top:-21px}input[type=text][_ngcontent-%COMP%]{position:relative;left:135px;height:18px}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.35);border-radius:4px;width:129px;height:20px;display:inline-block}.searchDiv[_ngcontent-%COMP%]{display:inline-block;margin-left:-67px}.element_holder[_ngcontent-%COMP%]{width:100%}#searchString[_ngcontent-%COMP%]{position:relative;left:142px;height:18px;text-align:center}.inputText[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.inputText[_ngcontent-%COMP%]::placeholder{color:#1a3763;Opacity:70%}#all_elements_holder[_ngcontent-%COMP%]{height:300px;width:100%;overflow:overlay}.selectDiv[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;width:92%;outline:none;text-align-last:center;margin-left:0}.footerBtn[_ngcontent-%COMP%]{position:relative;width:100px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;letter-spacing:normal}#closeBtn[_ngcontent-%COMP%]{margin-left:40px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%], .divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:1px solid #FFFFFF;padding:3px 4px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableBody[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:13px;line-height:26px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]:hover{background:#1a3763;color:#fff}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]{background:#fff;text-align:-webkit-left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:15px;font-weight:700;color:#1a3763;text-align:center}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]:first-child{border-left:none}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:700;color:#333;border-top:4px solid #333333}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.divTable[_ngcontent-%COMP%]{display:table}.divTableRow[_ngcontent-%COMP%]{display:table-row;border-bottom:4px solid #cccccc}.divTableCell[_ngcontent-%COMP%], .divTableHead[_ngcontent-%COMP%]{display:table-cell}.divTableHeading[_ngcontent-%COMP%]{display:table-header-group}.divTableFoot[_ngcontent-%COMP%]{display:table-footer-group}.divTableBody[_ngcontent-%COMP%]{display:table-row-group}#subtitle[_ngcontent-%COMP%]{padding-bottom:15px;text-align:center;color:#1a3763}#showNotesCheckbox[_ngcontent-%COMP%]{position:absolute;margin-top:2px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;font-size:14px}"]
        }))();
      }
      return SearchItemsDialogComponent;
    })();
    function getCurrentDateFormatted() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${year}_${month}_${day} ${hours}${minutes}${seconds}`;
    }
