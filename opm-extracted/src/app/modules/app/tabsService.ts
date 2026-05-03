// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/tabsService.ts
// Extracted by opm-extracted/tools/extract.mjs

class TabsManager {
  constructor(initRappid, contextService) {
    this.init = initRappid;
    this.context = contextService;
  }
  dropTab(event) {
    const steps = Math.sign(event.distance.x) * Math.floor(Math.abs(event.distance.x) / 200 + 0.5);
    const originalIndex = event.previousIndex;
    let toIndex = originalIndex + steps;
    if (toIndex < 0) {
      toIndex = 0;
    } else if (toIndex > this.context.getTabs().length - 1) {
      toIndex = this.context.getTabs().length - 1;
    }
    this.context.moveTab(event.previousIndex, toIndex);
    $("mat-tooltip-component").remove();
  }
  replaceContextByTab(item, keepSubModels = true) {
    var _this = this;
    return (0, default)(function* () {
      if (_this.isModelRunning()) {
        (0, validationAlert)("Cannot change tab while running a model.", 3500, "Error");
        return;
      } else if (_this.context.isCurrentlySavingModel) {
        (0, validationAlert)("Cannot change tab while saving a model.", 3500, "Error");
        return;
      }
      if (item.context.isDSMContext() || item.context.isDCMContext && item.context.isDCMContext()) {
        return;
      }
      const currentContext = _this.context.getTabs().find(item => item.context === _this.context.getCurrentContext());
      if (currentContext && !currentContext.context.isDSMContext() && (!currentContext.context.isDCMContext || !currentContext.context.isDCMContext())) {
        _this.context.updateTabData(currentContext, keepSubModels);
      } else if (currentContext && (currentContext.context.isDSMContext() || currentContext.context.isDCMContext && currentContext.context.isDCMContext())) {
        const message = currentContext.context.isDSMContext() ? "Pay attention, leaving this analysis tab means the analysis view would be generated from the beginning next time. Are you sure you want to leave?" : "Pay attention, leaving this DCM view tab means the colored view would be generated from the beginning next time. Are you sure you want to leave?";
        const canClose = yield _this.init.dialogService.openDialog(ConfirmDialogDialogComponent, 210, 350, {
          message: message,
          okName: "Leave",
          okColor: "#ff0000",
          centerText: true,
          closeName: "Stay"
        }).afterClosed().toPromise();
        if (!canClose) {
          return;
        }
        if (currentContext.context.isDSMContext()) {
          _this.init.isDSMClusteredView = {
            value: false,
            type: undefined
          };
        } else if (currentContext.context.isDCMContext && currentContext.context.isDCMContext()) {
          _this.init.isDCMView = false;
        }
        const idx = _this.context.getTabs().indexOf(currentContext);
        if (idx >= 0) {
          _this.context.removeTab(idx);
        }
      }
      _this.init.setSelectedElementToNull();
      _this.init.clearClipboard();
      _this.init.isLoadingModel = true;
      setTimeout(() => {
        _this.context.replaceContextByTab(item);
        _this.context.getModelService().model.setUndoStack(item.undo);
        _this.context.getModelService().model.setRedoStack(item.redo);
        _this.context.getModelService().model.lastOperations = item.lastOperations || [];
        _this.init.elementToolbarReference.setIsExample(_this.context.getCurrentContext().isExample());
        _this.init.elementToolbarReference.setIsTemplate(_this.context.getCurrentContext().isTemplate());
        _this.init.elementToolbarReference.setIsStereotype(_this.context.getCurrentContext().isStereotype());
        // let opdToRender = this.init.getOpmModel().getOpd(item.modelData.currentOpd.id);
        // if (!opdToRender)
        //   opdToRender = this.init.getOpmModel().opds.find(opd => opd.id === 'SD');
        // this.init.getGraphService().renderGraph(opdToRender, this.init);
        _this.init.isLoadingModel = false;
      }, 50);
    })();
  }
  closeTab(item) {
    var _this2 = this;
    return (0, default)(function* () {
      if (_this2.isModelRunning()) {
        (0, validationAlert)("Cannot close tab while running a model.", 3500, "Error");
        return;
      }
      if (item.context.isDSMContext()) {
        const canClose = yield _this2.init.dialogService.openDialog(ConfirmDialogDialogComponent, 210, 350, {
          message: "Pay attention, leaving this analysis tab means the analysis view would be generated from the beginning next time. Are you sure you want to leave?",
          okName: "Leave",
          okColor: "#ff0000",
          centerText: true,
          closeName: "Stay"
        }).afterClosed().toPromise();
        if (!canClose) {
          return;
        }
        _this2.init.isDSMClusteredView = {
          value: false,
          type: undefined
        };
      }
      if (item.context.isDCMContext && item.context.isDCMContext()) {
        const canClose = yield _this2.init.dialogService.openDialog(ConfirmDialogDialogComponent, 210, 350, {
          message: "Pay attention, leaving this DCM view tab means the colored view would be generated from the beginning next time. Are you sure you want to leave?",
          okName: "Leave",
          okColor: "#ff0000",
          centerText: true,
          closeName: "Stay"
        }).afterClosed().toPromise();
        if (!canClose) {
          return;
        }
        _this2.init.isDCMView = false;
      }
      _this2.init.setSelectedElementToNull();
      _this2.init.clearClipboard();
      _this2.context.closeTab(item);
      _this2.init.treeViewService.init(_this2.init.getOpmModel());
      _this2.init.getGraphService().renderGraph(_this2.init.getOpmModel().currentOpd, _this2.init);
    })();
  }
  isModelRunning() {
    return this.init.Executing;
  }
  refreshTab() {
    this.replaceContextByTab(this.context.getCurrentTabItem());
  }
}