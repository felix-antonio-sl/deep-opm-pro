// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/DownloadCSV/DownloadCSV.ts
// Extracted by opm-extracted/tools/extract.mjs

const c0 = a0 => ({
  object: a0
});
const c1 = () => [];
function DownloadCSVComponent_ng_container_27_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 30)(1, "input", 31);
    core /* ɵɵlistener */.bIt("change", function DownloadCSVComponent_ng_container_27_div_2_Template_input_change_1_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.changedSelection($event, element_r2));
    });
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction1 */.eq3(2, c0, element_r2.name === "OpmLogicalObject"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("checked", element_r2.checked);
  }
}
function DownloadCSVComponent_ng_container_27_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 30);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction1 */.eq3(2, c0, element_r2.name === "OpmLogicalObject"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(element_r2.text);
  }
}
function DownloadCSVComponent_ng_container_27_div_4_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 30);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const element_r2 = core /* ɵɵnextContext */.XpG().$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction1 */.eq3(2, c0, element_r2.name === "OpmLogicalObject"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI("", ctx_r2.getObjectLocation(element_r2), " ");
  }
}
function DownloadCSVComponent_ng_container_27_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementContainerStart */.qex(0);
    core /* ɵɵelementStart */.j41(1, "div", 12);
    core /* ɵɵtemplate */.DNE(2, DownloadCSVComponent_ng_container_27_div_2_Template, 2, 4, "div", 29)(3, DownloadCSVComponent_ng_container_27_div_3_Template, 2, 4, "div", 29)(4, DownloadCSVComponent_ng_container_27_div_4_Template, 2, 4, "div", 29);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementContainerEnd */.bVm();
  }
  if (rf & 2) {
    const element_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r2.isComputational(element_r2) || ctx_r2.withStates(element_r2)) && element_r2.constructor.name !== "OpmLogicalState");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r2.isComputational(element_r2) || ctx_r2.withStates(element_r2)) && element_r2.constructor.name !== "OpmLogicalState");
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", (ctx_r2.isComputational(element_r2) || ctx_r2.withStates(element_r2)) && element_r2.constructor.name !== "OpmLogicalState");
  }
}
function DownloadCSVComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 32)(1, "div");
    core /* ɵɵtext */.EFF(2, "No objects to show");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function DownloadCSVComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 33)(1, "div", 26)(2, "button", 34);
    core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_div_30_Template_button_click_2_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.closeUsingCloseBtn());
    });
    core /* ɵɵtext */.EFF(3, "Default Order ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "div", 26)(5, "button", 35);
    core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_div_30_Template_button_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.showHide("Next"));
    });
    core /* ɵɵtext */.EFF(6, "Next ");
    core /* ɵɵelementEnd */.k0s()()();
  }
}
function DownloadCSVComponent_div_40_div_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 46);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(item_r6.text);
  }
}
function DownloadCSVComponent_div_40_div_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 47);
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(item_r7.text);
  }
}
function DownloadCSVComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 36)(1, "div", 37)(2, "div", 38)(3, "div", 39)(4, "span", 40);
    core /* ɵɵtext */.EFF(5, "Choose Object");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "div", 41);
    core /* ɵɵlistener */.bIt("cdkDropListDropped", function DownloadCSVComponent_div_40_Template_div_cdkDropListDropped_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.drop($event));
    });
    core /* ɵɵtemplate */.DNE(7, DownloadCSVComponent_div_40_div_7_Template, 2, 1, "div", 42);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(8, "div")(9, "div", 39)(10, "span", 40);
    core /* ɵɵtext */.EFF(11, "Ordered Columns");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "div", 41);
    core /* ɵɵlistener */.bIt("cdkDropListDropped", function DownloadCSVComponent_div_40_Template_div_cdkDropListDropped_12_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.drop($event));
    });
    core /* ɵɵtemplate */.DNE(13, DownloadCSVComponent_div_40_div_13_Template, 2, 1, "div", 43);
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(14, "div", 44);
    core /* ɵɵlistener */.bIt("cdkDropListDropped", function DownloadCSVComponent_div_40_Template_div_cdkDropListDropped_14_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.drop($event));
    });
    core /* ɵɵelementStart */.j41(15, "a");
    core /* ɵɵtext */.EFF(16, "Remove Object ");
    core /* ɵɵelement */.nrm(17, "i", 45);
    core /* ɵɵelementEnd */.k0s()()()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("cdkDropListData", ctx_r2.draggableObjectsList);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.draggableObjectsList);
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("cdkDropListData", ctx_r2.droppedObjectsList);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r2.droppedObjectsList);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("cdkDropListData", core /* ɵɵpureFunction0 */.lJ4(5, c1));
  }
}
function DownloadCSVComponent_div_41_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 32)(1, "div");
    core /* ɵɵtext */.EFF(2, "No objects to show");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function DownloadCSVComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 26)(1, "button", 48);
    core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_div_47_Template_button_click_1_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.getObjectForExportAndCLose(ctx_r2.droppedObjectsList, ctx_r2.draggableObjectsList));
    });
    core /* ɵɵtext */.EFF(2, "Done ");
    core /* ɵɵelementEnd */.k0s()();
  }
}
let DownloadCSVComponent = /*#__PURE__*/(() => {
  class DownloadCSVComponent {
    constructor(modelService, dialogRef) {
      this.modelService = modelService;
      this.dialogRef = dialogRef;
      this.showTypeIndex = 0;
      this.showType = [OpmLogicalThing, OpmLogicalProcess, OpmLogicalObject];
      this.searchString = "";
      // array of objects that are going to be exported to csv
      this.checkedObjList = [];
      // array of objects that are dropped
      this.droppedObjectsList = [];
      // array of objects that are can be dragged
      this.draggableObjectsList = [];
      // boolean operator. if true, objects sorted by name from A to Z
      this.objectAscSort = true;
      // boolean operator. if true, objects sorted by location from A to Z
      this.locationAscSort = true;
      this.opmModel = modelService.model;
      this.updateList();
      for (const element of this.list) {
        // This is only check of uncheck the list
        if ((this.isComputational(element) || this.withStates(element)) && element.constructor.name !== "OpmLogicalState") {
          element.checked = true;
          this.checkedObjList.push(element);
        }
      }
    }
    // created array of arrays. each sub-array is 'tuple' of comp. obj. name and it's opd location.
    createArrFromObjToLoc() {
      const arr = [];
      for (const element of this.list) {
        if (element.name === "OpmLogicalObject") {
          arr.push([element, this.getObjectLocation(element)]);
        }
      }
      return arr;
    }
    // Sort data displayed on screen by location
    sortByLoc() {
      document.getElementById("Object").innerHTML = "Object";
      const arr = this.createArrFromObjToLoc();
      // Sort the array based on the second element
      arr.sort(function (a, b) {
        const x = a[1].toLowerCase();
        const y = b[1].toLowerCase();
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        } else {
          return 0;
        }
      });
      const objArray = [];
      for (const tuple of arr) {
        objArray.push(tuple[0]);
      }
      this.list = objArray;
      if (this.locationAscSort) {
        this.locationAscSort = false;
        document.getElementById("Location").innerHTML = "Location <i class=\"fa fa-sort-alpha-asc\" aria-hidden=\"true\"></i>";
      } else {
        this.locationAscSort = true;
        this.list = this.list.reverse();
        document.getElementById("Location").innerHTML = "Location <i class=\"fa fa-sort-alpha-desc\" aria-hidden=\"true\"></i>";
      }
    }
    // Returns opd of the given object
    getObjectLocation(object) {
      if (object.visualElements.length === 0) {
        return "";
      }
      return this.opmModel.getOpdByThingId(object.visualElements[0].id).getNumberedName();
    }
    // Updates list of logical elements and filter them.
    updateList() {
      this.list = this.modelService.model.logicalElements;
      this.filter();
    }
    // Enables ascending\descending sort of list of logical elements.
    sortByObjectName() {
      document.getElementById("Location").innerHTML = "Location";
      this.list = this.list.filter(e => e instanceof this.showType[this.showTypeIndex]).sort((e1, e2) => this.sortFunc(e1, e2));
      if (this.searchString.length > 0) {
        this.list = this.list.filter(a => a._text.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
      }
      if (this.objectAscSort) {
        this.objectAscSort = false;
        document.getElementById("Object").innerHTML = "Object <i class=\"fa fa-sort-alpha-asc\" aria-hidden=\"true\"></i>";
      } else {
        this.objectAscSort = true;
        this.list = this.list.reverse();
        document.getElementById("Object").innerHTML = "Object <i class=\"fa fa-sort-alpha-desc\" aria-hidden=\"true\"></i>";
      }
    }
    // filter list of logical elements.
    filter() {
      this.list = this.list.filter(e => e instanceof this.showType[this.showTypeIndex]);
      if (this.searchString.length > 0) {
        this.list = this.list.filter(a => a._text.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
      }
    }
    // aux function for sort. Return 1 if e1 smaller that e2 (sort made by comparing two strings that include integers)
    sortFunc(e1, e2) {
      if (e1.name === e2.name) {
        let e1Text = e1.text.replace(/ *\{[^}]*\) */g, "");
        let e2Text = e2.text.replace(/ *\{[^}]*\) */g, "");
        e1Text = e1Text.replace(/ *\[[^]*\) */g, "");
        e2Text = e2Text.replace(/ *\[[^]*\) */g, "");
        const items = [e1Text, e2Text];
        items.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {
          numeric: true,
          ignorePunctuation: true
        }));
        if (items[0] === e1Text) {
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
    ngDoCheck() {
      if ($(".thingDiv").length > 0 && $(".cdk-overlay-pane").length === 1) {
        let maximalDivWidth = $(".thingDiv")[0].getClientRects()[0].width;
        for (const div of $(".thingDiv")) {
          if (div.getClientRects()[0].width > maximalDivWidth) {
            maximalDivWidth = div.getClientRects()[0].width;
          }
        }
        const newWidth = Math.max(Math.min(maximalDivWidth + 340, window.innerWidth * 0.99), 600);
        $(".cdk-overlay-pane")[0].style.width = newWidth + "px";
      }
    }
    search() {
      document.getElementById("Location").innerHTML = "Location";
      document.getElementById("Object").innerHTML = "Object";
      this.updateList();
    }
    // check if the element in computational
    isComputational(element) {
      if (element.constructor.name === "OpmLogicalObject") {
        return element.valueType !== valueType.None && element.valueType !== undefined;
      }
    }
    /**
     * check if the element is regular object that has two or more states (without the range Type object)
     * @param element
     */
    withStates(element) {
      if (element.constructor.name === "OpmLogicalObject") {
        return element.states.length > 1 && element.text !== "Type";
      }
    }
    // Close Modal
    closeUsingCloseBtn() {
      this.checkedObjList = [];
      for (const logical of this.list.filter(item => (this.isComputational(item) || this.withStates(item)) && item.constructor.name !== "OpmLogicalState")) {
        this.checkedObjList.push(logical);
      }
      (0, setComputationalObjectForExport)(this.checkedObjList);
      this.dialogRef.close();
    }
    // check only checkbox near to selected object.If object is checked- add to checkedObjList, otherwise remove
    changedSelection($event, element) {
      element.checked = $event.target.checked;
      if (element.checked) {
        this.checkedObjList.push(element);
      } else {
        this.checkedObjList = this.checkedObjList.filter(item => item !== element);
      }
      // if at least one object is unchecked,then main checkbox should be unchecked too.
      for (element of this.list) {
        if ((this.isComputational(element) || this.withStates(element)) && element.name !== "OpmLogicalState") {
          if (!element.checked) {
            document.getElementById("mainCheck").checked = false;
            return;
          }
        }
      }
      document.getElementById("mainCheck").checked = true;
    }
    // check all checkboxes and update checkedObjList that stores all computational objects that we will sort and export to csv later.
    checkOrUncheckAll($event) {
      for (const logical of this.list.filter(item => (this.isComputational(item) || this.withStates(item)) && item.constructor.name !== "OpmLogicalState")) {
        logical.checked = $event.target.checked;
        if (logical.checked) {
          if (!this.checkedObjList.includes(logical)) {
            this.checkedObjList.push(logical);
          }
        } else {
          this.checkedObjList = this.checkedObjList.filter(item => item !== logical);
        }
      }
    }
    // show or hide div components
    // when switching between two windows, make sure the preferences state equal to user choices.
    showHide(str) {
      if (str === "Next") {
        for (const object of this.list) {
          if (!object.checked) {
            this.draggableObjectsList = this.draggableObjectsList.filter(item => item !== object);
            this.droppedObjectsList = this.droppedObjectsList.filter(item => item !== object);
          }
          if (object.checked && !this.droppedObjectsList.includes(object) && !this.draggableObjectsList.includes(object)) {
            this.draggableObjectsList.push(object);
          }
        }
      } else if (str === "Back") {
        this.checkedObjList = this.draggableObjectsList.concat(this.droppedObjectsList.filter(x => this.draggableObjectsList.every(y => y !== x)));
      }
      document.getElementById("wrapper").classList.toggle("open");
    }
    sameType(listElement, element) {
      return typeof listElement === typeof element;
    }
    // Transferring dragged items between connected drop zones
    drop(event) {
      if (event.previousContainer === event.container) {
        (0, moveItemInArray)(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        (0, transferArrayItem)(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
    }
    getObjectForExportAndCLose(droppedObjects, undroppedObjects) {
      // remove empty values from list.
      droppedObjects = droppedObjects.filter(item => item !== undefined);
      const objectForExport = droppedObjects.concat(undroppedObjects);
      (0, setComputationalObjectForExport)(objectForExport);
      this.dialogRef.close();
      (0, validationAlert)("Saved successfully", 3500, "Success");
    }
    static #_ = (() => this.ɵfac = function DownloadCSVComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DownloadCSVComponent)(core /* ɵɵdirectiveInject */.rXU(ModelService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: DownloadCSVComponent,
      selectors: [["DownloadCSV-Elements"]],
      decls: 48,
      vars: 7,
      consts: [["rel", "stylesheet", "href", core /* ɵɵtrustConstantResourceUrl */.wXG`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`], [1, "closeBtn", 3, "click"], [1, "fa", "fa-times"], ["id", "wrapper"], ["id", "selectObj"], [1, "header", 2, "font-weight", "bold"], [1, "header"], [1, "searchDiv"], ["id", "searchString", "type", "text", "placeholder", "Search by name", 1, "inputText", 3, "ngModelChange", "keyup", "ngModel"], ["id", "all_elements_holder"], [1, "divTable", "greyGridTable"], [1, "divTableHeading"], [1, "divTableRow"], [1, "divTableHead"], ["id", "mainCheck", "type", "checkbox", "name", "checkAll", "value", "check", "checked", "", 1, "radioBtn", 3, "change"], ["id", "Object", "matTooltip", "Click to sort", "value", "Object", 1, "divTableHead", 2, "background", "white", "border", "none", "outline", "none", "margin-left", "40%", 3, "click"], ["id", "Location", "matTooltip", "Click to sort", "value", "Location", 1, "divTableHead", 2, "background", "white", "border", "none", "outline", "none", 3, "click"], [1, "divTableBody"], [4, "ngFor", "ngForOf"], ["class", "element_holder", "style", "text-align: center; color: #1A3763;", 4, "ngIf"], ["class", "divTableRow", "style", " width: 100%; height: 100%", 4, "ngIf"], ["id", "orderObj", 1, "hidden"], [2, "text-align", "center", "color", "#1a3763"], [1, "notbold"], ["cdkDropListGroup", "", 4, "ngIf"], [2, "margin-top", "295px", "display", "block"], [1, "divTableCell"], ["mat-button", "", 1, "Btn", 2, "position", "fixed", "right", "60%", 3, "click"], ["class", "divTableCell", 4, "ngIf"], ["class", "divTableCell", 3, "ngClass", 4, "ngIf"], [1, "divTableCell", 3, "ngClass"], ["type", "checkbox", 1, "checkBtn", 3, "change", "checked"], [1, "element_holder", 2, "text-align", "center", "color", "#1A3763"], [1, "divTableRow", 2, "width", "100%", "height", "100%"], ["mat-button", "", 1, "Btn", 2, "display", "inline-block", "margin-left", "180px", "float", "right", "padding", "0 0px", 3, "click"], ["mat-button", "", 1, "Btn", 2, "display", "inline-block", "margin-left", "285px", "float", "right", 3, "click"], ["cdkDropListGroup", ""], [1, "tableCenter"], [2, "width", "100%", "margin-left", "calc(50% - 300px)"], [1, "example-container"], [2, "color", "#1a3763", "font-size", "16px"], ["cdkDropList", "", 1, "example-list", 2, "overflow", "scroll", "height", "250px", 3, "cdkDropListDropped", "cdkDropListData"], ["matTooltip", "Drag right to order", "class", "example-box", "cdkDrag", "", 4, "ngFor", "ngForOf"], ["class", "example-box", "cdkDrag", "", 4, "ngFor", "ngForOf"], ["matTooltip", "Drag object here to deselect ", "cdkDropList", "", 1, "RemoveBtn", "removeObject", 3, "cdkDropListDropped", "cdkDropListData"], [1, "fa", "fa-trash", "fa-2x"], ["matTooltip", "Drag right to order", "cdkDrag", "", 1, "example-box"], ["cdkDrag", "", 1, "example-box"], ["mat-button", "", 1, "Btn", 2, "position", "fixed", "right", "33%", 3, "click"]],
      template: function DownloadCSVComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "html");
          core /* ɵɵelement */.nrm(1, "link", 0);
          core /* ɵɵelementStart */.j41(2, "button", 1);
          core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_Template_button_click_2_listener() {
            return ctx.closeUsingCloseBtn();
          });
          core /* ɵɵelement */.nrm(3, "i", 2);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "div", 3)(5, "div", 4)(6, "h2", 5);
          core /* ɵɵtext */.EFF(7, "Computational Object Selecting");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "h2", 6);
          core /* ɵɵtext */.EFF(9, " Please choose objects that will appear in the Excel file");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(10, "br")(11, "hr");
          core /* ɵɵelementStart */.j41(12, "div", 7)(13, "input", 8);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function DownloadCSVComponent_Template_input_ngModelChange_13_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchString, $event)) {
              ctx.searchString = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("keyup", function DownloadCSVComponent_Template_input_keyup_13_listener() {
            return ctx.search();
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(14, "br");
          core /* ɵɵelementStart */.j41(15, "div", 9)(16, "div", 10)(17, "div", 11)(18, "div", 12)(19, "div", 13)(20, "input", 14);
          core /* ɵɵlistener */.bIt("change", function DownloadCSVComponent_Template_input_change_20_listener($event) {
            return ctx.checkOrUncheckAll($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(21, "button", 15);
          core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_Template_button_click_21_listener() {
            return ctx.sortByObjectName();
          });
          core /* ɵɵtext */.EFF(22, "Object ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(23, "div", 13)(24, "button", 16);
          core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_Template_button_click_24_listener() {
            return ctx.sortByLoc();
          });
          core /* ɵɵtext */.EFF(25, "Location ");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(26, "div", 17);
          core /* ɵɵtemplate */.DNE(27, DownloadCSVComponent_ng_container_27_Template, 5, 3, "ng-container", 18);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(28, DownloadCSVComponent_div_28_Template, 3, 0, "div", 19);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(29, "br");
          core /* ɵɵtemplate */.DNE(30, DownloadCSVComponent_div_30_Template, 7, 0, "div", 20);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(31, "div", 21)(32, "h2", 5);
          core /* ɵɵtext */.EFF(33, "Assign Objects to Columns");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(34, "h2", 6);
          core /* ɵɵtext */.EFF(35, " Please drag objects from the left according to your order preferences");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "h5", 22);
          core /* ɵɵtext */.EFF(37, " Note: ");
          core /* ɵɵelementStart */.j41(38, "span", 23);
          core /* ɵɵtext */.EFF(39, "unassigned objects will appear after the ordered columns in csv file");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(40, DownloadCSVComponent_div_40_Template, 18, 6, "div", 24)(41, DownloadCSVComponent_div_41_Template, 3, 0, "div", 19);
          core /* ɵɵelement */.nrm(42, "br");
          core /* ɵɵelementStart */.j41(43, "div", 25)(44, "div", 26)(45, "button", 27);
          core /* ɵɵlistener */.bIt("click", function DownloadCSVComponent_Template_button_click_45_listener() {
            return ctx.showHide("Back");
          });
          core /* ɵɵtext */.EFF(46, "Back ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(47, DownloadCSVComponent_div_47_Template, 3, 0, "div", 28);
          core /* ɵɵelementEnd */.k0s()()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(13);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchString);
          core /* ɵɵadvance */.R7$(14);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.list);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length === 0);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.list.length !== 0);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.draggableObjectsList.length !== 0 || ctx.droppedObjectsList.length !== 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.draggableObjectsList.length === 0 && ctx.droppedObjectsList.length === 0);
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.draggableObjectsList.length !== 0 || ctx.droppedObjectsList.length !== 0);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatTooltip, MatButton, DefaultValueAccessor, NgControlStatus, CdkDropList, CdkDropListGroup, CdkDrag, NgModel],
      styles: ["hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.35);border-radius:4px;width:120px;height:20px;display:inline-block}.searchDiv[_ngcontent-%COMP%]{display:inline-block;margin-left:84px}.checkBtn[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;Opacity:70%}.inputText[_ngcontent-%COMP%]{height:19px;border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.sortBtn[_ngcontent-%COMP%]{position:relative;background:#fff;border-radius:4px;font-weight:500;border:1px solid rgba(88,109,140,.5);vertical-align:middle}.closeBtn[_ngcontent-%COMP%]{position:relative;background:#fff;border:0px solid rgba(88,109,140,.5);color:#7486a5;font-size:14px;left:calc(100% - 13px);top:-10px}.closeBtn[_ngcontent-%COMP%]:hover{background:#f8f9fa;cursor:pointer}.Btn[_ngcontent-%COMP%]{width:100px;color:#1a3763;opacity:60%;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:36px;vertical-align:middle}.element_holder[_ngcontent-%COMP%]   .list-item[_ngcontent-%COMP%]{min-height:27px;padding-left:4px;display:inline-block;font-weight:400;background:#eff2f499;border-radius:6px;margin-top:3px}.element_holder[_ngcontent-%COMP%]   .object[_ngcontent-%COMP%]{color:#00b050}.element_holder[_ngcontent-%COMP%]   .process[_ngcontent-%COMP%]{color:#0070c0}div.greyGridTable[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:center;border-collapse:collapse}.header[_ngcontent-%COMP%]{text-align:center;color:#1a3763;font-size:18px;font-weight:500}hr[_ngcontent-%COMP%]{border:1px solid #a2a4a64a;border-radius:5px;margin-top:-17px}#selectSearchDiv[_ngcontent-%COMP%]{position:relative;top:-21px}input[type=text][_ngcontent-%COMP%]{position:relative;left:135px;height:18px}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}.selectDiv[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.35);border-radius:4px;width:129px;height:20px;display:inline-block}.searchDiv[_ngcontent-%COMP%]{display:inline-block;margin-left:-67px}.element_holder[_ngcontent-%COMP%]{width:100%}.inputText[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%}.inputText[_ngcontent-%COMP%]::placeholder{color:#1a3763;Opacity:70%}#all_elements_holder[_ngcontent-%COMP%]{height:300px;width:100%;overflow:auto}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%], .divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:1px solid #FFFFFF;padding:3px 4px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableBody[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:13px;line-height:26px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]{background:#fff;text-align:-webkit-left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:15px;font-weight:700;color:#1a3763;text-align:center}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]:first-child{border-left:none}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:700;color:#333;border-top:4px solid #333333}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.divTable[_ngcontent-%COMP%]{display:table}.divTableRow[_ngcontent-%COMP%]{display:table-row;border-bottom:4px solid #cccccc}.divTableCell[_ngcontent-%COMP%], .divTableHead[_ngcontent-%COMP%]{display:table-cell}.divTableHeading[_ngcontent-%COMP%]{display:table-header-group}.divTableFoot[_ngcontent-%COMP%]{display:table-footer-group}.divTableBody[_ngcontent-%COMP%]{display:table-row-group}.hidden[_ngcontent-%COMP%]{display:none}#wrapper[_ngcontent-%COMP%]   #selectObj[_ngcontent-%COMP%], #wrapper.open[_ngcontent-%COMP%]   #orderObj[_ngcontent-%COMP%]{display:block}#wrapper.open[_ngcontent-%COMP%]   #selectObj[_ngcontent-%COMP%], #wrapper[_ngcontent-%COMP%]   #orderObj[_ngcontent-%COMP%]{display:none}.notbold[_ngcontent-%COMP%]{font-weight:400}.example-container[_ngcontent-%COMP%]{padding-left:8%;float:left;width:210px;max-width:50%;display:inline-block;vertical-align:top;padding-bottom:20px}.example-list[_ngcontent-%COMP%]{border:solid 1px #ccc;min-height:60px;background:#fff;border-radius:4px;overflow:hidden;display:block}.example-box[_ngcontent-%COMP%]{padding:10px;border-bottom:solid 1px #ccc;color:#00b050;display:flex;flex-direction:row;align-items:center;justify-content:space-between;box-sizing:border-box;cursor:move;background:#f8f9fa;font-size:14px}.cdk-drag-preview[_ngcontent-%COMP%]{box-sizing:border-box;border-radius:4px;box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f}.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .25s cubic-bezier(0,0,.2,1)}.example-box[_ngcontent-%COMP%]:last-child{border:none}.example-list.cdk-drop-list-dragging[_ngcontent-%COMP%]   .example-box[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}div.sticky[_ngcontent-%COMP%]{position:sticky;top:0;padding:50px}.tableCenter[_ngcontent-%COMP%]{align-content:center;text-align:center}.RemoveBtn[_ngcontent-%COMP%]{position:fixed;opacity:60%;left:calc(50% - 70px);width:150px;color:#1a3763;font-weight:500;border:1px solid rgba(88,109,140,.5);border-radius:4px;height:88px;vertical-align:middle;margin-top:290px;display:block}.RemoveBtn[_ngcontent-%COMP%]:hover{background:#f8f9fa}.RemoveBtn[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-grid;margin-top:20px}"]
    }))();
  }
  return DownloadCSVComponent;
})();