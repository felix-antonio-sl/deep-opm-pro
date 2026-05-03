// Source: decompiled/deobfuscated.js
// Original path: ./src/app/opd-hierarchy/coll-menu.component.ts
// Extracted by opm-extracted/tools/extract.mjs

function CollaborationMenuComponent_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 1);
    core /* ɵɵlistener */.bIt("click", function CollaborationMenuComponent_button_0_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.open());
    });
    core /* ɵɵnamespaceSVG */.qSk();
    core /* ɵɵelementStart */.j41(1, "svg", 2);
    core /* ɵɵelement */.nrm(2, "path", 3)(3, "path", 4)(4, "path", 5)(5, "path", 6)(6, "path", 7)(7, "path", 8)(8, "path", 9)(9, "path", 10)(10, "path", 11);
    core /* ɵɵelementEnd */.k0s()();
  }
}
let CollaborationMenuComponent = /*#__PURE__*/(() => {
  class CollaborationMenuComponent {
    constructor(model, context, user, permissions, storage, dialog) {
      this.model = model;
      this.context = context;
      this.user = user;
      this.permissions = permissions;
      this.storage = storage;
      this.dialog = dialog;
      this.disabled = true;
    }
    open() {
      var _this = this;
      return (0, default)(function* () {
        if (_this.user.user.userData.isViewerAccount) {
          (0, validationAlert)("This operation is not available for viewer accounts. Please contact your organization's admin to make changes. Thank you!", 5000, "ERROR");
          return;
        }
        if (_this.dialog.openDialogs.length > 0) {
          return;
        }
        const currentTime = new Date().getTime();
        if (_this.lastOpenedTime && currentTime - _this.lastOpenedTime < 2000) {
          return;
        }
        if (_this.context.isExample()) {
          if (!_this.context.isModelOrgExample() || !_this.context.isUserOrgAdmin()) {
            return;
          }
        } else if (_this.context.isGlobalTemplate()) {
          return;
        }
        _this.lastOpenedTime = new Date().getTime();
        if (_this.context.doesSupportModelPermissions() == false) {
          return;
        }
        const per = yield _this.storage.getPermissions(_this.model.modelObject.id);
        const collData = {
          headLine: "Model Permissions Setting",
          showPassPermissionMessage: true,
          modelName: _this.model.modelObject.name,
          orgName: _this.user.userOrg,
          userChkBoxFlag: true,
          groupChkBoxFlag: true,
          groupChkBoxOneAble: false,
          userToken: per.tokenID,
          currentUser: _this.user.user,
          org: _this.user.userOrg,
          checkedUsers: per.readIDs,
          checkedGroups: per.groupIDs,
          modelOwner: per.ownerID
        };
        const dialogRef = _this.dialog.open(CollaborationDialogComponent, {
          // height: '873px',
          width: "775px",
          data: collData
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            const permissions = {
              tokenID: data.tokenUser,
              writeIDs: [data.tokenUser],
              readIDs: data.checkedUserList,
              groupIDs: data.checkedGroupList
            };
            _this.permissions.updateModelPermissions(permissions);
          }
        });
      })();
    }
    static #_ = (() => this.ɵfac = function CollaborationMenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CollaborationMenuComponent)(core /* ɵɵdirectiveInject */.rXU(ModelService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(PermissionsService), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: CollaborationMenuComponent,
      selectors: [["coll-menu"]],
      decls: 1,
      vars: 1,
      consts: [["id", "settingBtn", "matTooltip", "Modelers & Sharing", 3, "click", 4, "ngIf"], ["id", "settingBtn", "matTooltip", "Modelers & Sharing", 3, "click"], ["width", "17", "height", "18", "viewBox", "0 0 17 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M8.5 4.275C9.81166 4.275 10.875 3.31799 10.875 2.1375C10.875 0.957006 9.81166 0 8.5 0C7.18834 0 6.125 0.957006 6.125 2.1375C6.125 3.31799 7.18828 4.275 8.5 4.275ZM8.5 1.06875C9.15586 1.06875 9.6875 1.54723 9.6875 2.1375C9.6875 2.72777 9.15586 3.20625 8.5 3.20625C7.84414 3.20625 7.3125 2.72777 7.3125 2.1375C7.3125 1.54723 7.84414 1.06875 8.5 1.06875Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M8.99297 4.27545C8.98696 4.27563 8.98099 4.27592 8.97501 4.27621H8.02502C7.00418 4.22532 6.1537 5.67325 6.12542 7.51021C6.12526 7.52096 6.12513 7.53177 6.125 7.54252V8.03093C6.125 8.36673 6.31161 8.5499 6.49822 8.5499H10.5018C10.6884 8.5499 10.875 8.36673 10.875 8.03093V7.54252C10.8566 5.70516 10.014 4.24244 8.99297 4.27545ZM6.8375 7.32879C6.87143 6.41303 7.39733 5.49721 8.02499 5.49721H8.97498C9.60267 5.49721 10.1286 6.41297 10.1625 7.32879H6.8375Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M2.34185 6.63046C2.53066 6.63046 2.6837 6.51007 2.6837 6.36154C2.68262 5.11758 3.39936 3.94048 4.63223 3.16149C4.76748 3.05785 4.77029 2.88761 4.63854 2.78122C4.52394 2.68867 4.34184 2.67333 4.20493 2.74467C2.80904 3.62383 1.99758 4.95488 2.00001 6.36154C2.00001 6.51007 2.15305 6.63046 2.34185 6.63046Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M11.2473 17.1182C11.2429 17.1191 11.2384 17.12 11.234 17.1209C9.45368 17.45 7.52777 17.45 5.74747 17.1209C5.44929 17.0696 5.13196 17.1607 5.03679 17.325C4.92878 17.4785 5.06666 17.6514 5.34471 17.711C5.35565 17.7134 5.36669 17.7155 5.3779 17.7175C7.39702 18.0943 9.58444 18.0943 11.6035 17.7175C11.9048 17.6581 12.0679 17.4781 11.9731 17.3093C11.8683 17.1459 11.5433 17.0603 11.2473 17.1182Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M12.1472 3.19225C13.5318 3.959 14.3545 5.20829 14.3522 6.54021C14.3522 6.68874 14.5052 6.80913 14.694 6.80913C14.8828 6.80913 15.0359 6.68874 15.0359 6.54021C15.0311 5.03349 14.1017 3.62132 12.5404 2.74854C12.3846 2.66315 12.1703 2.69324 12.0618 2.81576C11.9532 2.93829 11.9915 3.10686 12.1472 3.19225Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M2.375 12.3751C3.68666 12.3751 4.75 11.4181 4.75 10.2376C4.75 9.0571 3.68666 8.1001 2.375 8.1001C1.06334 8.1001 0 9.05705 0 10.2376C0 11.4181 1.06334 12.3751 2.375 12.3751ZM2.375 9.16885C3.03086 9.16885 3.5625 9.64733 3.5625 10.2376C3.5625 10.8279 3.03086 11.3063 2.375 11.3063C1.71914 11.3063 1.1875 10.8279 1.1875 10.2376C1.1875 9.64733 1.71914 9.16885 2.375 9.16885Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M2.868 12.6006C2.86199 12.6008 2.85602 12.6011 2.85005 12.6014H1.90002C0.879175 12.5505 0.028704 13.9984 0.000422118 15.8354C0.000259765 15.8462 0.000129883 15.857 0 15.8677V16.3561C0 16.6919 0.186609 16.8751 0.373218 16.8751H4.37678C4.56339 16.8751 4.75 16.6919 4.75 16.3561V15.8677C4.73169 14.0304 3.88907 12.5676 2.868 12.6006ZM0.712536 15.654C0.746467 14.7382 1.27236 13.8224 1.90002 13.8224H2.85001C3.4777 13.8224 4.0036 14.7382 4.0375 15.654H0.712536Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M12 10.2376C12 11.4181 13.0633 12.3751 14.375 12.3751C15.6867 12.3751 16.75 11.4181 16.75 10.2376C16.75 9.0571 15.6867 8.1001 14.375 8.1001C13.0633 8.1001 12 9.05705 12 10.2376ZM15.5625 10.2376C15.5625 10.8279 15.0309 11.3063 14.375 11.3063C13.7191 11.3063 13.1875 10.8279 13.1875 10.2376C13.1875 9.64733 13.7191 9.16885 14.375 9.16885C15.0309 9.16885 15.5625 9.64733 15.5625 10.2376Z", "fill", "#1A3763", "fill-opacity", "0.4"], ["d", "M14.868 12.6006C14.862 12.6008 14.856 12.6011 14.85 12.6014H13.9C12.8792 12.5505 12.0287 13.9984 12.0004 15.8354C12.0003 15.8462 12.0001 15.857 12 15.8677V16.3561C12 16.6919 12.1866 16.8751 12.3732 16.8751H16.3768C16.5634 16.8751 16.75 16.6919 16.75 16.3561V15.8677C16.7317 14.0304 15.889 12.5676 14.868 12.6006ZM12.7125 15.654C12.7464 14.7382 13.2723 13.8224 13.9 13.8224H14.85C15.4777 13.8224 16.0036 14.7382 16.0375 15.654H12.7125Z", "fill", "#1A3763", "fill-opacity", "0.4"]],
      template: function CollaborationMenuComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵtemplate */.DNE(0, CollaborationMenuComponent_button_0_Template, 11, 0, "button", 0);
        }
        if (rf & 2) {
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.user.isPublicOrganization);
        }
      },
      dependencies: [MatTooltip, NgIf],
      styles: ["#settingBtn[_ngcontent-%COMP%]{border:none;background-color:transparent}"]
    }))();
  }
  return CollaborationMenuComponent;
})();