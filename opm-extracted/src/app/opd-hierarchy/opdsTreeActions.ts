// Source: decompiled/deobfuscated.js
// Original path: ./src/app/opd-hierarchy/opdsTreeActions.ts
// Extracted by opm-extracted/tools/extract.mjs

class ToggleOPDsNamesTreeAction {
  constructor(init) {
    this.init = init;
  }
  act() {
    const value = !this.init.oplService.settings.SDNames;
    const details = {
      SDNames: value
    };
    this.init.oplService.updateUserSettings(details);
    this.init.updateDB(details);
  }
  canBePerformed() {
    return true;
  }
}
class RenameOpdTreeAction {
  constructor(init, opd) {
    this.init = init;
    this.opd = opd;
  }
  act() {
    return this.init.dialogService.openDialog(CreateViewDialog, 230, 426, {
      renameOpdId: this.opd.id,
      allowMultipleDialogs: true
    }).afterClosed().toPromise();
  }
  canBePerformed() {
    return this.opd.isViewOpd && !this.opd.sharedOpdWithSubModelId && !this.opd.belongsToSubModel;
  }
}
class RemoveOpdTreeAction {
  constructor(init, node, tree) {
    this.init = init;
    this.node = node;
    this.tree = tree;
  }
  act() {
    var _this = this;
    return (0, default)(function* () {
      if (!_this.node.isLeaf || _this.node.id === "SD") {
        (0, validationAlert)("You are not allowed to remove inner nodes!", null, "Error");
        return {
          removed: false
        };
      }
      const opdName = _this.init.opmModel.getOpd(_this.node.id).getName();
      const canClose = yield _this.init.dialogService.openDialog(ConfirmDialogDialogComponent, 180, 350, {
        message: `Pay attention, "${opdName}" will be removed permanently.`,
        okName: "Delete",
        okColor: "#ff0000",
        centerText: true,
        closeName: "Cancel",
        allowMultipleDialogs: true
      }).afterClosed().toPromise();
      if (!canClose) {
        return {
          removed: false
        };
      }
      const nodeID = _this.node.data.id;
      let opdParent = _this.node.data.initRappid.opmModel.getOpd(nodeID).parendId;
      if (opdParent === "Requirements") {
        opdParent = "SD";
      }
      _this.init.setSelectedElementToNull();
      _this.init.opmModel.removeOpd(nodeID);
      _this.init.graphService.renderGraph(_this.init.opmModel.getOpd(opdParent), _this.init);
      _this.init.opmModel.setCurrentOpd(opdParent);
      _this.init.treeViewService.treeView.treeModel.getNodeById(opdParent).toggleActivated();
      _this.init.treeViewService.removeNode(_this.node.data.id);
      _this.tree.update();
      _this.init.treeViewService.init(_this.init.opmModel);
      _this.init.criticalChanges_.next(true);
      return {
        removed: true
      };
    })();
  }
  canBePerformed() {
    return true;
  }
}
class UpdateRequirementViewTreeAction {
  constructor(init, opd) {
    this.init = init;
    this.opd = opd;
  }
  act() {
    var _this2 = this;
    return (0, default)(function* () {
      _this2.init.graphService.closeSelectedTextEditorBeforeRendering(_this2.init);
      _this2.init.setElementToRemoveToNull();
      if (_this2.init.opmModel.hasSubModels()) {
        yield _this2.init.opdHierarchyRef.loadAllSubModels();
      }
      const ret = _this2.init.opmModel.updateRequirementViewOf(_this2.opd);
      if (ret.removed) {
        _this2.init.getTreeView().init(_this2.init.opmModel);
        if (_this2.init.opmModel.currentOpd === _this2.opd) {
          _this2.init.getGraphService().renderGraph(_this2.init.opmModel.opds[0], _this2.init);
        }
        (0, validationAlert)("The requirement view opd was removed because no elements left that satisfy this requirement anymore.", 8000);
      } else {
        _this2.init.getGraphService().renderGraph(_this2.opd, _this2.init);
      }
    })();
  }
  canBePerformed() {
    return !!this.opd.requirementViewOf;
  }
}
class DisconnectSubModelTreeAction {
  constructor(init, contextService, opd) {
    this.init = init;
    this.contextService = contextService;
    this.opd = opd;
  }
  act() {
    var _this3 = this;
    return (0, default)(function* () {
      const canClose = yield _this3.init.dialogService.openDialog(ConfirmDialogDialogComponent, 230, 380, {
        message: "Pay attention, this action is irreversible. You will not be able to use the undo button to return to the state before this action. Are you sure you want to disconnect this sub model?",
        okName: "Disconnect",
        okColor: "#ff0000",
        centerText: true,
        closeName: "Cancel",
        allowMultipleDialogs: true
      }).afterClosed().toPromise();
      if (!canClose) {
        return;
      }
      _this3.init.opmModel.setShouldLogForUndoRedo(false, "disconnectSubModel");
      const subModelId = _this3.opd.sharedOpdWithSubModelId;
      _this3.init.opmModel.disconnectSubModel(subModelId);
      _this3.init.opmModel.setShouldLogForUndoRedo(true, "disconnectSubModel");
      const tabsManager = new TabsManager(_this3.init, _this3.contextService);
      tabsManager.refreshTab();
    })();
  }
  canBePerformed() {
    return this.opd.sharedOpdWithSubModelId && !this.opd.belongsToSubModel;
  }
}
class RenameSubModelTreeAction {
  constructor(init, opd) {
    this.init = init;
    this.opd = opd;
  }
  act() {
    return this.init.dialogService.openDialog(SubModelNameComponent, 240, 400, {
      mode: "rename",
      name: this.opd.name,
      fatherModelName: this.init.modelService.modelObject.name,
      allowMultipleDialogs: true
    }).afterClosed().toPromise().then(ret => {
      if (ret) {
        this.opd.name = ret.nameForOpd;
        this.init.service.renameModel(this.opd.sharedOpdWithSubModelId, ret.nameForModel);
        return ret.nameForOpd;
      }
    });
  }
  canBePerformed() {
    return !!this.opd.sharedOpdWithSubModelId;
  }
}
class OpenSubModelInNewTabTreeAction {
  constructor(init, contextService, opd) {
    this.init = init;
    this.contextService = contextService;
    this.opd = opd;
  }
  act() {
    const that = this;
    const subModelId = this.opd.sharedOpdWithSubModelId;
    if (this.contextService.isModelAlreadyOpenOnTab(subModelId)) {
      (0, validationAlert)(`The model is already open in other tab.`, 2500, "Error");
      return Promise.resolve(undefined);
    }
    this.init.isLoadingModel = true;
    return this.contextService.loadModel(subModelId, undefined, "MAIN").then(res => {
      that.init.isLoadingModel = false;
      that.init.elementToolbarReference.setIsExample(that.contextService.isExample());
      that.init.elementToolbarReference.setIsTemplate(that.contextService.isTemplate());
      that.init.elementToolbarReference.setIsStereotype(that.contextService.isStereotype());
      (0, validationAlert)(`Successfully loaded sub model.`, 2500, "warning");
    }).catch(err => {
      that.init.isLoadingModel = false;
    });
  }
  canBePerformed() {
    return !!this.opd.sharedOpdWithSubModelId;
  }
}