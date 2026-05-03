// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/background-photo-dialog/background-photo-dialog.ts
// Extracted by opm-extracted/tools/extract.mjs

function BackgroundPhotoDialogComponent_mat_label_9_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-label", 17);
    core /* ɵɵtext */.EFF(1, "*The Url must end with jpg/png/jpeg/svg/bmp.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function BackgroundPhotoDialogComponent_mat_label_14_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "mat-label", 18);
    core /* ɵɵtext */.EFF(1, "*Please add at least 1 tag. Use the Enter key to add the tag.");
    core /* ɵɵelementEnd */.k0s();
  }
}
function BackgroundPhotoDialogComponent_mat_form_field_15_mat_chip_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-chip", 23);
    core /* ɵɵlistener */.bIt("removed", function BackgroundPhotoDialogComponent_mat_form_field_15_mat_chip_5_Template_mat_chip_removed_0_listener() {
      const tag_r3 = core /* ɵɵrestoreView */.eBV(_r2).$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r3.removeTag(tag_r3));
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementStart */.j41(2, "mat-icon", 24);
    core /* ɵɵtext */.EFF(3, "cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const tag_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", tag_r3, " ");
  }
}
function BackgroundPhotoDialogComponent_mat_form_field_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "mat-form-field", 19)(1, "mat-label");
    core /* ɵɵtext */.EFF(2, "Image Tags");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "mat-chip-grid", 20, 0);
    core /* ɵɵtemplate */.DNE(5, BackgroundPhotoDialogComponent_mat_form_field_15_mat_chip_5_Template, 4, 1, "mat-chip", 21);
    core /* ɵɵelementStart */.j41(6, "input", 22);
    core /* ɵɵlistener */.bIt("matChipInputTokenEnd", function BackgroundPhotoDialogComponent_mat_form_field_15_Template_input_matChipInputTokenEnd_6_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r1);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.addTag($event));
    });
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    const chipList_r5 = core /* ɵɵreference */.sdS(4);
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(5);
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r3.imageTags);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("formControl", ctx_r3.tagsCtrl)("matChipInputFor", chipList_r5)("matChipInputSeparatorKeyCodes", ctx_r3.separatorKeysCodes);
  }
}
function BackgroundPhotoDialogComponent_div_17_option_6_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 30);
    core /* ɵɵtext */.EFF(1, "Organizational");
    core /* ɵɵelementEnd */.k0s();
  }
}
function BackgroundPhotoDialogComponent_div_17_option_7_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "option", 31);
    core /* ɵɵtext */.EFF(1, "Global");
    core /* ɵɵelementEnd */.k0s();
  }
}
function BackgroundPhotoDialogComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 25)(1, "span");
    core /* ɵɵtext */.EFF(2, "Images Pool Type: ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "select", 26);
    core /* ɵɵlistener */.bIt("change", function BackgroundPhotoDialogComponent_div_17_Template_select_change_3_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.changePoolType($event));
    });
    core /* ɵɵelementStart */.j41(4, "option", 27);
    core /* ɵɵtext */.EFF(5, "Private");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵtemplate */.DNE(6, BackgroundPhotoDialogComponent_div_17_option_6_Template, 2, 0, "option", 28)(7, BackgroundPhotoDialogComponent_div_17_option_7_Template, 2, 0, "option", 29);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r3.userService.isOrgAdmin() || ctx_r3.userService.isSysAdmin());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r3.userService.isSysAdmin());
  }
}
function BackgroundPhotoDialogComponent_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 32);
    core /* ɵɵlistener */.bIt("click", function BackgroundPhotoDialogComponent_button_19_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r7);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.saveBackgroundImage());
    });
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r3.isImageEditable());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.getInsertSaveText());
  }
}
function BackgroundPhotoDialogComponent_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 16);
    core /* ɵɵlistener */.bIt("click", function BackgroundPhotoDialogComponent_button_20_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r8);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.openPoolManagement());
    });
    core /* ɵɵtext */.EFF(1, "Insert From Pool");
    core /* ɵɵelementEnd */.k0s();
  }
}
function BackgroundPhotoDialogComponent_button_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 33);
    core /* ɵɵlistener */.bIt("click", function BackgroundPhotoDialogComponent_button_21_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r9);
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.remove());
    });
    core /* ɵɵtext */.EFF(1, "Remove");
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵproperty */.Y8G("disabled", !ctx_r3.isImageEditable());
  }
}
let BackgroundPhotoDialogComponent = /*#__PURE__*/(() => {
  class BackgroundPhotoDialogComponent {
    constructor(dialogRef, data, storage, userService, init) {
      this.dialogRef = dialogRef;
      this.data = data;
      this.storage = storage;
      this.userService = userService;
      this.init = init;
      this.separatorKeysCodes = [ENTER, COMMA];
      this.tagsCtrl = new UntypedFormControl("");
      this.imageTags = [];
      this.showTagsSection = false;
      this.hadURL = false;
      this.poolType = "private";
      if (OPCloudUtils.isInstanceOfDrawnThing(this.data.entity)) {
        this.entity = this.data.entity;
      }
      this.url = this.entity?.attr("image/xlinkHref") || this.entity?.getVisual().logicalElement.getBackgroundImageUrl() || "";
      if (this.url === "assets/SVG/redx.png") {
        this.url = this.entity.getVisual().logicalElement.getBackgroundImageUrl() || "";
      }
      if (this.url.length) {
        this.hadURL = true;
      }
      if (this.data.cameFromPool) {
        this.showTagsSection = true;
      }
    }
    ngOnInit() {
      if (!this.data.closeName) {
        this.data.closeName = "CLOSE";
      }
      if (!this.data.okName) {
        this.data.okName = "OK";
      }
      if (this.data.closeFlag === true) {
        const closeButt = document.getElementById("closeButton");
        closeButt.style.display = "none";
      }
      if (this.url?.length > 0) {
        this.previewImage();
      }
    }
    saveBackgroundImage() {
      var _this = this;
      return (0, default)(function* () {
        if (!_this.url.startsWith("http") || !_this.isUrlEndsWithImageSuffix()) {
          return (0, validationAlert)("This url is invalid.");
        }
        (0, checkImageURL)(_this.url).then(res => {
          const visuals = _this.entity.getVisual().logicalElement.visualElements;
          for (const vis of visuals) {
            vis.showBackgroundImage = BackgroundImageState.TEXTANDIMAGE;
            if (_this.entity.graph.getCell(vis.id)) {
              _this.entity.graph.getCell(vis.id).setBackgroundImage(_this.url);
            }
          }
          _this.dialogRef.close();
        }).catch(err => {
          (0, validationAlert)("This url is invalid.");
        });
      })();
    }
    onPaste($event) {
      const this_ = this;
      setTimeout(function () {
        this_.url = $event.target.value;
      }, 10);
    }
    changedInputText($event) {
      this.url = $event.target.value;
    }
    isPreviewDisabled() {
      if (!this.url.startsWith("http") || !this.isUrlEndsWithImageSuffix()) {
        return true;
      }
    }
    previewImage() {
      $("#imgPreview")[0].src = this.url;
      $("#imgPreview")[0].hidden = false;
    }
    imageError($event) {
      if (this.url !== "" && $event.target.srcset !== "") {
        (0, validationAlert)("This url is invalid.");
        $("#imgPreview")[0].hidden = true;
      }
    }
    changePoolType($event) {
      this.poolType = $event.target.value;
    }
    saveToPool() {
      if (this.imageTags.length === 0) {
        this.showTagsSection = true;
        this.dialogRef.updateSize("550px", "650px");
        return;
      }
      (0, checkImageURL)(this.url).then(() => {
        this.storage.saveImageToPool(this.poolType, this.url, this.imageTags).then(res => (0, validationAlert)("Image was successfully added to the pool.")).catch(err => console.log(err));
      }).catch(() => {
        (0, validationAlert)("This url is invalid.");
      });
    }
    addTag(event) {
      const value = (event.value || "").trim();
      if (value) {
        this.imageTags.push(value);
      }
      event.input.value = "";
      this.tagsCtrl.setValue(null);
    }
    removeTag(tag) {
      const index = this.imageTags.indexOf(tag);
      if (index >= 0) {
        this.imageTags.splice(index, 1);
      }
    }
    isUrlEndsWithImageSuffix() {
      return this.url?.endsWith(".jpeg") || this.url?.endsWith(".jpg") || this.url?.endsWith(".png") || this.url?.endsWith(".svg") || this.url?.endsWith(".bmp") || this.url?.endsWith(".gif");
    }
    getInsertSaveText() {
      if (this.hadURL) {
        return "Save";
      }
      return "Insert";
    }
    shouldShowSaveInsertButton() {
      return !!this.entity && OPCloudUtils.isInstanceOfDrawnThing(this.entity);
    }
    remove() {
      const visual = this.entity.getVisual();
      const logical = visual.logicalElement;
      logical.setBackgroundImage("");
      for (const vis of logical.visualElements) {
        if (this.entity.graph?.getCell(vis.id)) {
          this.entity.graph?.getCell(vis.id).updateView(vis);
        }
      }
      this.dialogRef.close();
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
    openPoolManagement() {
      this.dialogRef.afterClosed().toPromise().then(() => {
        this.init.dialogService.openDialog(ImagesPoolContainer, 675, 900, {});
      });
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function BackgroundPhotoDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || BackgroundPhotoDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: BackgroundPhotoDialogComponent,
      selectors: [["opcloud-background-photo-dialog"]],
      decls: 26,
      vars: 11,
      consts: [["chipList", ""], [1, "main"], [1, "imageByURLPreview"], ["placeholder", "Insert here an image URL", 3, "paste", "change", "value", "disabled"], ["mat-button", "", 1, "imageByURLButtonPrev", 3, "click", "disabled"], ["style", "margin-left: 30px; color: red; float: left; font-size: smaller;", 4, "ngIf"], [1, "imageByURLPreviewDiv"], ["id", "imgPreview", "ngSrc", "", "alt", "", 1, "imgPreview", 3, "error"], ["style", "color: red; float: left; font-size: smaller;", 4, "ngIf"], ["class", "imageByURL-chip-list", "appearance", "fill", 4, "ngIf"], ["style", "padding-top: 20px;", 4, "ngIf"], [1, "buttons"], ["class", "imageByURLButton", "mat-button", "", "matTooltip", "Insert to Thing", 3, "disabled", "click", 4, "ngIf"], ["class", "imageByURLButton", "mat-button", "", 3, "click", 4, "ngIf"], ["class", "imageByURLButton", "mat-button", "", "style", "color: red;", 3, "disabled", "click", 4, "ngIf"], ["mat-button", "", 1, "imageByURLButton", 3, "click", "disabled"], ["mat-button", "", 1, "imageByURLButton", 3, "click"], [2, "margin-left", "30px", "color", "red", "float", "left", "font-size", "smaller"], [2, "color", "red", "float", "left", "font-size", "smaller"], ["appearance", "fill", 1, "imageByURL-chip-list"], ["aria-label", "Tags"], [3, "removed", 4, "ngFor", "ngForOf"], ["placeholder", "Add Tags...", 3, "matChipInputTokenEnd", "formControl", "matChipInputFor", "matChipInputSeparatorKeyCodes"], [3, "removed"], ["matChipRemove", ""], [2, "padding-top", "20px"], [2, "height", "35px", "width", "120px", "border-radius", "5px", "text-align", "center", "border", "1px solid #bbc4d0", 3, "change"], ["value", "private"], ["value", "organizational", 4, "ngIf"], ["value", "global", 4, "ngIf"], ["value", "organizational"], ["value", "global"], ["mat-button", "", "matTooltip", "Insert to Thing", 1, "imageByURLButton", 3, "click", "disabled"], ["mat-button", "", 1, "imageByURLButton", 2, "color", "red", 3, "click", "disabled"]],
      template: function BackgroundPhotoDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 1)(1, "h3");
          core /* ɵɵtext */.EFF(2, "Image By URL");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "div", 2)(5, "input", 3);
          core /* ɵɵlistener */.bIt("paste", function BackgroundPhotoDialogComponent_Template_input_paste_5_listener($event) {
            return ctx.onPaste($event);
          })("change", function BackgroundPhotoDialogComponent_Template_input_change_5_listener($event) {
            return ctx.changedInputText($event);
          });
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(6, "button", 4);
          core /* ɵɵlistener */.bIt("click", function BackgroundPhotoDialogComponent_Template_button_click_6_listener() {
            return ctx.previewImage();
          });
          core /* ɵɵtext */.EFF(7, "Preview");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(8, "br");
          core /* ɵɵtemplate */.DNE(9, BackgroundPhotoDialogComponent_mat_label_9_Template, 2, 0, "mat-label", 5);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(10, "br");
          core /* ɵɵelementStart */.j41(11, "div", 6)(12, "img", 7);
          core /* ɵɵlistener */.bIt("error", function BackgroundPhotoDialogComponent_Template_img_error_12_listener($event) {
            return ctx.imageError($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(13, "br");
          core /* ɵɵtemplate */.DNE(14, BackgroundPhotoDialogComponent_mat_label_14_Template, 2, 0, "mat-label", 8)(15, BackgroundPhotoDialogComponent_mat_form_field_15_Template, 7, 4, "mat-form-field", 9);
          core /* ɵɵelement */.nrm(16, "br");
          core /* ɵɵtemplate */.DNE(17, BackgroundPhotoDialogComponent_div_17_Template, 8, 2, "div", 10);
          core /* ɵɵelementStart */.j41(18, "div", 11);
          core /* ɵɵtemplate */.DNE(19, BackgroundPhotoDialogComponent_button_19_Template, 2, 2, "button", 12)(20, BackgroundPhotoDialogComponent_button_20_Template, 2, 0, "button", 13)(21, BackgroundPhotoDialogComponent_button_21_Template, 2, 1, "button", 14);
          core /* ɵɵelementStart */.j41(22, "button", 15);
          core /* ɵɵlistener */.bIt("click", function BackgroundPhotoDialogComponent_Template_button_click_22_listener() {
            return ctx.saveToPool();
          });
          core /* ɵɵtext */.EFF(23, "Save to Pool");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "button", 16);
          core /* ɵɵlistener */.bIt("click", function BackgroundPhotoDialogComponent_Template_button_click_24_listener() {
            return ctx.dialogRef.close();
          });
          core /* ɵɵtext */.EFF(25, "Cancel");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("value", ctx.url)("disabled", !ctx.isImageEditable());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("disabled", ctx.isPreviewDisabled());
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.url !== "" && !ctx.isUrlEndsWithImageSuffix());
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("ngIf", !ctx.isPreviewDisabled() && ctx.showTagsSection && ctx.imageTags.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.showTagsSection);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.showTagsSection);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowSaveInsertButton());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.entity && ctx.init.service.isBackendSupported());
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.hadURL);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("disabled", ctx.isPreviewDisabled() || !ctx.init.service.isBackendSupported());
        }
      },
      dependencies: [NgForOf, NgIf, MatFormField, MatLabel, MatTooltip, MatIcon, MatButton, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, NgControlStatus, MatChip, MatChipGrid, MatChipInput, MatChipRemove, FormControlDirective, NgOptimizedImage],
      styles: [".main[_ngcontent-%COMP%]{text-align:center}.main[_ngcontent-%COMP%]   .h3[_ngcontent-%COMP%]{color:#1a3763}.main[_ngcontent-%COMP%]   .imageByURLPreview[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:calc(100% - 150px)}.main[_ngcontent-%COMP%]   .imageByURLPreview[_ngcontent-%COMP%]   .imageByURLButtonPrev[_ngcontent-%COMP%]{min-width:80px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px}.main[_ngcontent-%COMP%]   .imageByURLPreview[_ngcontent-%COMP%]   .imageByURLButtonPrev[_ngcontent-%COMP%]   .mat-mdc-button[_ngcontent-%COMP%]:not(:disabled){color:#000000de}.main[_ngcontent-%COMP%]   .imageByURLPreviewDiv[_ngcontent-%COMP%]{position:relative;height:250px;margin-top:20px;align-items:center}.main[_ngcontent-%COMP%]   .imageByURLPreviewDiv[_ngcontent-%COMP%]   .imgPreview[_ngcontent-%COMP%]{max-width:calc(100% - 50px);max-height:200px}.main[_ngcontent-%COMP%]   .imageByURL-chip-list[_ngcontent-%COMP%]{width:100%;font-family:Roboto,Helvetica Neue,sans-serif;background-color:#0000000a;--mdc-filled-text-field-focus-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-hover-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-active-indicator-color: rgba(0, 0, 0, .87);--mdc-filled-text-field-disabled-active-indicator-color: rgba(0, 0, 0, .87);--mdc-circular-progress-active-indicator-color: rgba(0, 0, 0, .87)}.main[_ngcontent-%COMP%]   .imageByURL-chip-list[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%]{display:none}.main[_ngcontent-%COMP%]   .imageByURL-chip-list[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%]   .mat-mdc-form-field.mat-mdc-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-label[_ngcontent-%COMP%]{color:#1a3763!important}.main[_ngcontent-%COMP%]   .imageByURL-chip-list[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(.mat-mdc-form-field-underline, .mat-mdc-form-field-ripple)[_ngcontent-%COMP%]{background-color:#1a3763!important}.main[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]{padding-top:5px;text-align:center}.main[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .imageByURLButton[_ngcontent-%COMP%]{min-width:120px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}.main[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .imageByURLButton[_ngcontent-%COMP%]   .mat-mdc-button[_ngcontent-%COMP%]:not(:disabled){color:#000000de}"]
    }))();
  }
  return BackgroundPhotoDialogComponent;
})();
