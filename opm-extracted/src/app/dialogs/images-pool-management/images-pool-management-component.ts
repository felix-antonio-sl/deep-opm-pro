// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/images-pool-management/images-pool-management-component.ts
// Extracted by opm-extracted/tools/extract.mjs

const images_pool_management_component_c0 = () => [];
function ImagesPoolManagementComponent_mat_chip_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-chip", 22);
    core /* ɵɵlistener */.bIt("removed", function ImagesPoolManagementComponent_mat_chip_7_Template_mat_chip_removed_0_listener() {
      const tag_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.removeSearchTag(tag_r3));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementStart */.j41(2, "mat-icon", 23);
    core /* ɵɵtext */.EFF(3, "cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const tag_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tag_r3, " ");
  }
}
function ImagesPoolManagementComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 24);
    core /* ɵɵlistener */.bIt("click", function ImagesPoolManagementComponent_div_11_Template_div_click_0_listener() {
      const item_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.selectItem(item_r6));
    })("dblclick", function ImagesPoolManagementComponent_div_11_Template_div_dblclick_0_listener() {
      const item_r6 = core /* ɵɵrestoreView */.eBV(_r5).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.doubleClickItem(item_r6));
    });
    core /* ɵɵelement */.nrm(1, "img", 25);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("src", item_r6.url, core /* ɵɵsanitizeUrl */.B4B)("className", ctx_r3.selectedItem && ctx_r3.selectedItem !== item_r6 ? "semiTransparent" : "");
  }
}
function ImagesPoolManagementComponent_mat_label_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-label", 26);
    core /* ɵɵtext */.EFF(1, "*Please add at least 1 tag. Use the Enter key to add the tag.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ImagesPoolManagementComponent_mat_chip_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-chip", 22);
    core /* ɵɵlistener */.bIt("removed", function ImagesPoolManagementComponent_mat_chip_19_Template_mat_chip_removed_0_listener() {
      const tag_r8 = core /* ɵɵrestoreView */.eBV(_r7).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.removeTag(tag_r8));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementStart */.j41(2, "mat-icon", 23);
    core /* ɵɵtext */.EFF(3, "cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const tag_r8 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tag_r8, " ");
  }
}
function ImagesPoolManagementComponent_mat_label_20_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-label", 27);
    core /* ɵɵtext */.EFF(1, "Image must contain at least one tag.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ImagesPoolManagementComponent_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 28);
    core /* ɵɵlistener */.bIt("click", function ImagesPoolManagementComponent_button_23_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.insert(ctx_r3.selectedItem));
    });
    core /* ɵɵtext */.EFF(1, "Insert");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r3.isImageEditable());
  }
}
function ImagesPoolManagementComponent_button_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 29);
    core /* ɵɵlistener */.bIt("click", function ImagesPoolManagementComponent_button_26_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r10);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.deleteImage());
    });
    core /* ɵɵtext */.EFF(1, "Delete");
    core /* ɵɵelementEnd */.k0s();
  }
}
function ImagesPoolManagementComponent_button_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 18);
    core /* ɵɵlistener */.bIt("click", function ImagesPoolManagementComponent_button_29_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r11);
      core /* ɵɵnextContext */.XpG();
      const imagesFromFile_r12 = core /* ɵɵreference */.sdS(28);
      return core /* ɵɵresetView */.Njj(imagesFromFile_r12.click());
    });
    core /* ɵɵtext */.EFF(1, "Import Excel");
    core /* ɵɵelementEnd */.k0s();
  }
}
let ImagesPoolManagementComponent = /*#__PURE__*/(() => {
  class ImagesPoolManagementComponent {
    constructor(userService, dialogRef, dialogData, storage, init) {
      this.userService = userService;
      this.dialogRef = dialogRef;
      this.dialogData = dialogData;
      this.storage = storage;
      this.init = init;
      this.tagsCtrl = new UntypedFormControl("");
      this.searchTags = [];
    }
    ngOnInit() {
      var _this = this;
      return (0, default)(function* () {
        _this.mode = _this.additionalData.mode;
        _this.searchTagsCtrl = _this.additionalData.searchTagsCtrl;
        _this.searchTags = _this.additionalData.searchTags;
        _this.separatorKeysCodes = _this.additionalData.separatorKeysCodes;
        if (OPCloudUtils.isInstanceOfDrawnThing(_this.init.selectedElement)) {
          _this.entity = _this.init.selectedElement;
        }
        _this.urlsData = (yield _this.storage.getImagesPool(_this.convertPoolTypeToString(_this.mode))) || [];
        _this.urlsData.forEach(itm => itm.imageTags = itm.imageTags || []);
        _this.urlsDataToDisplay = [..._this.urlsData];
        _this.additionalData.tabChange.subscribe(val => _this.changedSearchTags());
      })();
    }
    selectItem(item) {
      if (item !== this.selectedItem) {
        this.selectedItem = item;
      } else {
        this.selectedItem = undefined;
      }
    }
    addTag(event) {
      const value = (event.value || "").trim();
      if (value) {
        this.selectedItem.imageTags.push(value);
        this.storage.updatePoolImageTags(this.selectedItem.id, this.selectedItem.imageTags, this.convertPoolTypeToString(this.mode));
      }
      event.chipInput.inputElement.value = "";
      this.tagsCtrl.setValue(null);
    }
    convertPoolTypeToString(type) {
      if (type === ImagesPoolType.PERSONAL) {
        return "private";
      } else if (type === ImagesPoolType.ORG) {
        return "organizational";
      }
      return "global";
    }
    removeTag(tag) {
      const index = this.selectedItem.imageTags.indexOf(tag);
      if (index >= 0 && this.selectedItem.imageTags.length > 1) {
        this.selectedItem.imageTags.splice(index, 1);
        this.storage.updatePoolImageTags(this.selectedItem.id, this.selectedItem.imageTags, this.convertPoolTypeToString(this.mode));
      } else if (this.selectedItem.imageTags.length === 1) {
        this.showWarningAtLeastOneTag = true;
        setTimeout(() => {
          this.showWarningAtLeastOneTag = false;
        }, 5000);
      }
    }
    addSearchTag(event) {
      const value = (event.value || "").trim();
      if (value) {
        this.searchTags.push(value);
      }
      event.chipInput.inputElement.value = "";
      this.searchTagsCtrl.setValue(null);
      this.changedSearchTags();
    }
    removeSearchTag(tag) {
      const index = this.searchTags.indexOf(tag);
      if (index >= 0) {
        this.searchTags.splice(index, 1);
      }
      this.changedSearchTags();
    }
    changedSearchTags() {
      const searchTags = this.searchTags;
      if (this.searchTags.length === 0) {
        this.urlsDataToDisplay = [...this.urlsData];
        return;
      }
      this.urlsDataToDisplay = this.urlsData.filter(item => {
        const itemTags = item.imageTags.map(t => t.toLowerCase());
        for (const sTag of searchTags) {
          if (!itemTags.includes(sTag.toLowerCase())) {
            return false;
          }
        }
        return true;
      });
      if (!this.urlsDataToDisplay.includes(this.selectedItem)) {
        this.selectItem(undefined);
      }
    }
    canEditTagsOrDelete() {
      const user = this.userService.user;
      if (!user) {
        return false;
      }
      if (user.userData.SysAdmin) {
        return true;
      }
      if (user.userData.OrgAdmin && this.mode === ImagesPoolType.ORG) {
        return true;
      }
      if (this.mode === ImagesPoolType.PERSONAL) {
        return true;
      }
      return false;
    }
    insert(itemToInsert) {
      if (!itemToInsert) {
        return;
      }
      const visuals = this.entity.getVisual().logicalElement.visualElements;
      for (const vis of visuals) {
        vis.showBackgroundImage = BackgroundImageState.TEXTANDIMAGE;
        if (this.entity.graph.getCell(vis.id)) {
          this.entity.graph.getCell(vis.id).setBackgroundImage(itemToInsert.url);
        }
      }
      this.dialogRef.close();
    }
    addNewImage() {
      this.dialogRef.afterClosed().toPromise().then(() => {
        this.init.dialogService.openDialog(BackgroundPhotoDialogComponent, 670, 550, {
          cameFromPool: true
        }).afterClosed().toPromise().then(() => {
          this.init.dialogService.openDialog(ImagesPoolContainer, 675, 900, {});
        });
      });
      this.dialogRef.close();
    }
    deleteImage() {
      this.storage.deletePoolImage(this.selectedItem.id, this.convertPoolTypeToString(this.mode)).then(ret => {
        const item = this.urlsData.find(i => i.id === this.selectedItem.id);
        if (item) {
          const index = this.urlsData.indexOf(item);
          this.urlsData.splice(index, 1);
          this.selectItem(undefined);
          this.changedSearchTags();
        }
      });
    }
    doubleClickItem(item) {
      this.selectItem(item);
      if (this.entity && this.isImageEditable()) {
        this.insert(item);
      }
    }
    isImageEditable() {
      if (!this.entity) {
        return true;
      }
      const logical = this.entity.getVisual().logicalElement;
      if (logical.equivalentFromStereotypeLID || logical.getStereotype()) {
        return false;
      }
      return true;
    }
    validateImageURL(url) {
      return (0, default)(function* () {
        if (url.endsWith(".jpeg") || url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".svg") || url.endsWith(".bmp") || url.endsWith(".gif")) {
          return (0, checkImageURL)(url).then(() => Promise.resolve()).catch(err => Promise.reject());
        } else {
          return Promise.reject();
        }
      })();
    }
    importFromExcel(event) {
      if (!this.userService.isSysAdmin()) {
        return;
      }
      if (event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      let arrayBuffer;
      const fileReader = new FileReader();
      const that = this;
      fileReader.onload = e => {
        arrayBuffer = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = [];
        for (let i = 0; i !== data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const workbook = readSync(arr.join(""), {
          type: "binary"
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const result = utils.sheet_to_json(worksheet);
        for (const item of result) {
          if (item.url && item.tags) {
            const tags = (item.tags || "").split(";").map(t => t.trim());
            if (tags.length === 0) {
              continue;
            }
            this.validateImageURL(item.url).then(() => {
              this.storage.saveImageToPool(this.poolModeToString(), item.url, tags).then(res => {
                if (result.indexOf(item) === result.length - 1) {
                  this.ngOnInit();
                  (0, validationAlert)("Finished importing.");
                }
              }).catch(err => {});
            }).catch(err => {
              if (result.indexOf(item) === result.length - 1) {
                this.ngOnInit();
                (0, validationAlert)("Finished importing.");
              }
            });
          }
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
    poolModeToString() {
      if (this.mode === ImagesPoolType.PERSONAL) {
        return "private";
      } else if (this.mode === ImagesPoolType.ORG) {
        return "org";
      }
      return "global";
    }
    static #_ = (() => this.ɵfac = function ImagesPoolManagementComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ImagesPoolManagementComponent)(core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ImagesPoolManagementComponent,
      selectors: [["opcloud-images-pool"]],
      inputs: {
        additionalData: "additionalData"
      },
      decls: 32,
      vars: 17,
      consts: [["searchChipList", ""], ["chipList", ""], ["imagesFromFile", ""], ["id", "mainDiv", 1, "imagesPoolComponentMainDiv"], [1, "imagesPoolComponentSearchTagsDiv"], ["appearance", "fill", 1, "imagesPoolComponentFormField"], ["aria-label", "Tags"], [3, "removed", 4, "ngFor", "ngForOf"], ["placeholder", "Add Tags...", 3, "matChipInputTokenEnd", "formControl", "matChipInputFor", "matChipInputSeparatorKeyCodes"], ["id", "gallery", 1, "imagesPoolComponentGalley"], ["class", "imagesPoolComponentImageDiv", 3, "click", "dblclick", 4, "ngFor", "ngForOf"], ["id", "tags", 1, "imagesPoolComponentTags"], ["style", "color: red; float: left; font-size: smaller;", 4, "ngIf"], ["appearance", "fill", 1, "imagesPoolComponent-chip-list", 3, "floatLabel"], ["aria-label", "Tags", 3, "disabled"], ["id", "warningTags", 4, "ngIf"], [1, "imagesPoolComponentButtons"], ["class", "imagesPoolComponentButton", "mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", 1, "imagesPoolComponentButton", 3, "click"], ["class", "imagesPoolComponentButton", "mat-button", "", "color", "warn", 3, "click", 4, "ngIf"], ["id", "imagesFromFile", "type", "file", 2, "display", "none", 3, "change"], ["class", "imagesPoolComponentButton", "mat-button", "", 3, "click", 4, "ngIf"], [3, "removed"], ["matChipRemove", ""], [1, "imagesPoolComponentImageDiv", 3, "click", "dblclick"], ["alt", "", 3, "src", "className"], [2, "color", "red", "float", "left", "font-size", "smaller"], ["id", "warningTags"], ["mat-button", "", 1, "imagesPoolComponentButton", 3, "click", "disabled"], ["mat-button", "", "color", "warn", 1, "imagesPoolComponentButton", 3, "click"]],
      template: function ImagesPoolManagementComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 3)(1, "div", 4)(2, "mat-form-field", 5)(3, "mat-label");
          core /* ɵɵtext */.EFF(4, "Search By Tags");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "mat-chip-grid", 6, 0);
          core /* ɵɵtemplate */.DNE(7, ImagesPoolManagementComponent_mat_chip_7_Template, 4, 1, "mat-chip", 7);
          core /* ɵɵelementStart */.j41(8, "input", 8);
          core /* ɵɵlistener */.bIt("matChipInputTokenEnd", function ImagesPoolManagementComponent_Template_input_matChipInputTokenEnd_8_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.addSearchTag($event));
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelement */.nrm(9, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "div", 9);
          core /* ɵɵtemplate */.DNE(11, ImagesPoolManagementComponent_div_11_Template, 2, 2, "div", 10);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "div", 11);
          core /* ɵɵtemplate */.DNE(13, ImagesPoolManagementComponent_mat_label_13_Template, 2, 0, "mat-label", 12);
          core /* ɵɵelementStart */.j41(14, "mat-form-field", 13)(15, "mat-label");
          core /* ɵɵtext */.EFF(16, "Image Tags");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(17, "mat-chip-grid", 14, 1);
          core /* ɵɵtemplate */.DNE(19, ImagesPoolManagementComponent_mat_chip_19_Template, 4, 1, "mat-chip", 7)(20, ImagesPoolManagementComponent_mat_label_20_Template, 2, 0, "mat-label", 15);
          core /* ɵɵelementStart */.j41(21, "input", 8);
          core /* ɵɵlistener */.bIt("matChipInputTokenEnd", function ImagesPoolManagementComponent_Template_input_matChipInputTokenEnd_21_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.addTag($event));
          });
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(22, "div", 16);
          core /* ɵɵtemplate */.DNE(23, ImagesPoolManagementComponent_button_23_Template, 2, 1, "button", 17);
          core /* ɵɵelementStart */.j41(24, "button", 18);
          core /* ɵɵlistener */.bIt("click", function ImagesPoolManagementComponent_Template_button_click_24_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.addNewImage());
          });
          core /* ɵɵtext */.EFF(25, "Add New Image");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(26, ImagesPoolManagementComponent_button_26_Template, 2, 0, "button", 19);
          core /* ɵɵelementStart */.j41(27, "input", 20, 2);
          core /* ɵɵlistener */.bIt("change", function ImagesPoolManagementComponent_Template_input_change_27_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.importFromExcel($event));
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(29, ImagesPoolManagementComponent_button_29_Template, 2, 0, "button", 21);
          core /* ɵɵelementStart */.j41(30, "button", 18);
          core /* ɵɵlistener */.bIt("click", function ImagesPoolManagementComponent_Template_button_click_30_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.dialogRef.close());
          });
          core /* ɵɵtext */.EFF(31, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          const searchChipList_r13 = core /* ɵɵreference */.sdS(6);
          const chipList_r14 = core /* ɵɵreference */.sdS(18);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.searchTags);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("formControl", ctx.searchTagsCtrl)("matChipInputFor", searchChipList_r13)("matChipInputSeparatorKeyCodes", ctx.separatorKeysCodes);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.urlsDataToDisplay);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectedItem && ctx.selectedItem.imageTags.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("floatLabel", ctx.selectedItem && ctx.selectedItem.imageTags.length !== 0 ? "always" : "auto");
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("disabled", !ctx.selectedItem || !ctx.canEditTagsOrDelete());
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", (ctx.selectedItem == null ? null : ctx.selectedItem.imageTags) || core /* ɵɵpureFunction0 */.lJ4(16, images_pool_management_component_c0));
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.showWarningAtLeastOneTag);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("formControl", ctx.tagsCtrl)("matChipInputFor", chipList_r14)("matChipInputSeparatorKeyCodes", ctx.separatorKeysCodes);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectedItem && ctx.entity);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.selectedItem && ctx.canEditTagsOrDelete());
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.userService.isSysAdmin());
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatIcon, MatButton, MatChip, MatChipGrid, MatChipInput, MatChipRemove, DefaultValueAccessor, NgControlStatus, FormControlDirective],
      styles: [".imagesPoolComponentMainDiv[_ngcontent-%COMP%]{text-align:center;overflow:hidden!important}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentSearchTagsDiv[_ngcontent-%COMP%]   .imagesPoolComponentFormField[_ngcontent-%COMP%]{width:100%;font-family:Roboto,Helvetica Neue,sans-serif;background-color:#0000000a;--mdc-filled-text-field-focus-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-hover-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-disabled-active-indicator-color: rgba(0, 0, 0, .87);--mdc-circular-progress-active-indicator-color: rgba(0, 0, 0, .87)}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentSearchTagsDiv[_ngcontent-%COMP%]   .imagesPoolComponentFormField[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%]{display:none}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentGalley[_ngcontent-%COMP%]{padding-top:16px;width:100%;height:300px;display:grid;grid-template-columns:repeat(3,95px);-moz-column-gap:190px;column-gap:190px;row-gap:1em;overflow:auto}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentGalley[_ngcontent-%COMP%]   .imagesPoolComponentImageDiv[_ngcontent-%COMP%]{height:180px;display:flex;width:280px;align-content:space-around;justify-content:center;flex-wrap:wrap}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentGalley[_ngcontent-%COMP%]   .imagesPoolComponentImageDiv[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:100%;max-width:100%}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentTags[_ngcontent-%COMP%]{width:100%;height:85px;margin-top:7px}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentTags[_ngcontent-%COMP%]   .imagesPoolComponent-chip-list[_ngcontent-%COMP%]{width:100%;font-family:Roboto,Helvetica Neue,sans-serif;background-color:#0000000a;--mdc-filled-text-field-focus-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-hover-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-disabled-active-indicator-color: rgba(0, 0, 0, .87);--mdc-circular-progress-active-indicator-color: rgba(0, 0, 0, .87)}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentTags[_ngcontent-%COMP%]   .imagesPoolComponent-chip-list[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%]{display:none}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentTags[_ngcontent-%COMP%]   .imagesPoolComponent-chip-list[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%]   .mat-mdc-form-field.mat-mdc-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentTags[_ngcontent-%COMP%]   .imagesPoolComponent-chip-list[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(.mat-mdc-form-field-underline, .mat-mdc-form-field-ripple)[_ngcontent-%COMP%]{background-color:#1a3763!important}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentButtons[_ngcontent-%COMP%]{padding-top:5px;text-align:center}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentButtons[_ngcontent-%COMP%]   .imagesPoolComponentButton[_ngcontent-%COMP%]{min-width:120px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}.imagesPoolComponentMainDiv[_ngcontent-%COMP%]   .imagesPoolComponentButtons[_ngcontent-%COMP%]   .imagesPoolComponentButton[_ngcontent-%COMP%]   .mat-mdc-button[_ngcontent-%COMP%]:not(:disabled){color:#000000de}h3[_ngcontent-%COMP%]{color:#1a3763}#warningTags[_ngcontent-%COMP%]{color:red;left:80px;top:-13px;position:absolute;font-size:13px}.semiTransparent[_ngcontent-%COMP%]{opacity:30%}#searchInput[_ngcontent-%COMP%]{width:400px;height:28px;border:1px solid rgba(73,114,132,.2);border-radius:6px;padding-left:10px}.mat-mdc-form-field.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.mat-mdc-form-field-underline[_ngcontent-%COMP%], .mat-mdc-form-field-ripple[_ngcontent-%COMP%]{background-color:#1a3763!important}#gallery[_ngcontent-%COMP%]::-webkit-scrollbar{width:10px;background-color:#fff9ff}#gallery[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b9d2df;border-radius:2px;border-left:2px solid white;border-right:2px solid white}#gallery[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#b9d2df54;border-radius:4px;border-left:4px solid white;border-right:4px solid white}"]
    }))();
  }
  return ImagesPoolManagementComponent;
})();