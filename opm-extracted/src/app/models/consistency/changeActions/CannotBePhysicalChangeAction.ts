// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/changeActions/CannotBePhysicalChangeAction.ts
// Extracted by opm-extracted/tools/extract.mjs

class CannotBePhysicalChangeAction extends ChangeAction {
  act() {
    var _this = this;
    return (0, default)(function* () {
      const check = _this.target.isLegalEssence(Essence.Informatical);
      // if it is possible to change the target essence
      if (check.isLegal) {
        let message = "A physical object cannot be part of an informatical one.\n The Object can be changed to informatical.\n\n";
        message += `<span class="redText">This will effect all ${_this.target.logicalElement.getBareName()} instances at:</span><br>`;
        for (const vis of _this.target.logicalElement.visualElements) {
          const opd = _this.init.opmModel.getOpdByThingId(vis.id);
          if (opd && !opd.isHidden) {
            message += "<span class=\"redText\">" + opd.getDisplayFullName() + "</span><br>";
          }
        }
        const ret = yield _this.init.dialogService.openDialog(ConfirmDialogDialogComponent, null, 350, {
          title: "ERROR!!",
          message: message,
          titleColor: "#ff0000",
          closeName: "Close",
          okName: "Change part to informatical",
          centerText: true,
          allowMultipleDialogs: true
        }).afterClosed().toPromise();
        if (ret) {
          _this.target.toggleEssence();
          return Promise.resolve({
            changed: true
          });
        }
      }
      return Promise.resolve({
        changed: false
      });
    })();
  }
}