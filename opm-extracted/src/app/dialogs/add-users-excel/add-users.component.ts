// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/add-users-excel/add-users.component.ts
// Extracted by opm-extracted/tools/extract.mjs

// requires (webpack module ids): 23153

function AddUserComponent_div_3_div_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const err_r1 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate1 */.SpI(" ", err_r1, " ");
  }
}
function AddUserComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 5);
    core /* ɵɵtemplate */.DNE(1, AddUserComponent_div_3_div_1_Template, 2, 1, "div", 6);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const ctx_r1 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", ctx_r1.errors);
  }
}
function AddUserComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 7)(1, "label")(2, "p");
    core /* ɵɵtext */.EFF(3, "Attention: the input file must be .xlsx ");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelement */.nrm(4, "br");
    core /* ɵɵelementStart */.j41(5, "button", 8);
    core /* ɵɵlistener */.bIt("click", function AddUserComponent_div_4_Template_button_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const fileInput_r4 = core /* ɵɵreference */.sdS(9);
      return core /* ɵɵresetView */.Njj(fileInput_r4.click());
    });
    core /* ɵɵelementStart */.j41(6, "mat-icon");
    core /* ɵɵtext */.EFF(7, "attach_file");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "input", 9, 0);
    core /* ɵɵlistener */.bIt("change", function AddUserComponent_div_4_Template_input_change_8_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r1 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r1.incomingfile($event));
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(10, "label");
    core /* ɵɵtext */.EFF(11, "Add Modelers Excel File");
    core /* ɵɵelementEnd */.k0s()();
  }
}
const parseString = __webpack_require__(23153).parseString;
let AddUserComponent = /*#__PURE__*/(() => {
  class AddUserComponent {
    constructor(dialogRef, organization, currUser, _dialog) {
      this.dialogRef = dialogRef;
      this.organization = organization;
      this.currUser = currUser;
      this._dialog = _dialog;
      this.reader = new FileReader();
      this.importExcel = true;
      this.imported = false;
      this.uploaded = false;
      this.errorMessage = false;
      this.log = "";
      this.now = new Date();
      this.EMAIL = "email";
      this.FNAME = "name";
      this.PASS = "password";
      this.PASS_REP = "repeat password";
      this.ORG = "organization";
      this.users = new Array();
      const uploaderOptions = {
        url: "",
        // Empty URL or specify a dummy value
        disableMultipart: true // Optional: To disable multipart upload
      };
      this.uploader = new FileUploader(uploaderOptions);
    }
    incomingfile(event) {
      this.file = event.target.files[0];
      this.uploaded = true;
    }
    excelFileReader() {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onload = e => {
          this.arrayBuffer = fileReader.result;
          const data = new Uint8Array(this.arrayBuffer);
          const arr = new Array();
          for (let i = 0; i !== data.length; ++i) {
            arr[i] = String.fromCharCode(data[i]);
          }
          const bstr = arr.join("");
          const workbook = readSync(bstr, {
            type: "binary"
          });
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];
          if (this.excelFormatIsValid(worksheet)) {
            // includes all columns
            resolve(utils.sheet_to_json(worksheet, {
              raw: false
            }));
          } else {
            reject("Wrong format of file. The file headers should be: name, email, password, repeat password and organization.");
          }
        };
        fileReader.readAsArrayBuffer(this.file);
      });
    }
    excelFormatIsValid(worksheet) {
      const validColumnNames = ["name", "email", "password", "repeat password", "organization", "expiration"];
      const cells = Object.keys(worksheet);
      const colNames = [];
      const firstLineRegex = /^[A-Z]+1$/;
      for (let i = 0; i < Object.keys(cells).length; i++) {
        if (firstLineRegex.test(cells[i])) {
          // first line
          colNames.push(worksheet[cells[i]].v);
        }
      }
      if (colNames.length !== validColumnNames.length) {
        return false;
      } else {
        for (let i = 0; i < colNames.length; i++) {
          if (colNames[i].toLowerCase() !== validColumnNames[i]) {
            return false;
          }
        }
        return true;
      }
    }
    upload() {
      var _this = this;
      return (0, default)(function* () {
        let errors_set = new Set();
        try {
          const users = yield _this.excelFileReader();
          // converting legal keys to lower case if needed
          users.map(user => {
            Object.keys(user).forEach(key => {
              if (key !== key.toLowerCase()) {
                user[key.toLowerCase()] = user[key];
                delete user[key];
              }
              if (key === "expiration") {
                let expDate = new Date(user[key]).getTime();
                if (isNaN(expDate) || expDate < new Date().getTime()) {
                  expDate = new Date().getTime() + 5184000000;
                }
                user.exp_date = expDate;
                delete user[key];
              }
            });
            if (!user.exp_date) {
              user.exp_date = new Date().getTime() + 5184000000;
            }
          });
          _this.errors = [];
          const emails = [];
          let line = 1;
          for (const user of users) {
            const email = user[_this.EMAIL];
            const name = user[_this.FNAME];
            const password = user[_this.PASS];
            const reapestPassword = user[_this.PASS_REP];
            const org = user[_this.ORG];
            if (!email || !name || !password || !reapestPassword || !org) {
              errors_set.add("Missing field in excel file you uploaded in line: " + line);
            }
            if (_this.emailIsValid(email) === false) {
              errors_set.add("You have entered an invalid email address in line: " + line + ".");
            }
            if (password && password.length < 6) {
              errors_set.add("You have entered an invalid password in line: " + line + ".");
            }
            if (password && reapestPassword && password !== reapestPassword) {
              errors_set.add("You have entered an invalid re-password in line: " + line + ".");
            }
            if (!_this.currUser.isSysAdmin() && _this.currUser.isOrgAdmin() && org !== _this.currUser.userOrg) {
              errors_set.add("You have tried to add users to " + org + " in line: " + line + " but this is not your organization.");
            }
            const email_possible_error = "You have inserted the email " + email + " more than once.";
            if (email && emails.includes(email) && !errors_set.has(email_possible_error)) {
              errors_set.add(email_possible_error);
            } else {
              emails.push(email);
            }
            line++;
          }
          // commented to see some errors from the server
          // if (errors.length > 0) {
          //   return;
          // }
          _this.organization.validateUsers(users).then(res => {
            if (res.success && errors_set.size === 0) {
              _this.imported = true;
              _this.users = users;
              return;
            }
            if (res.errors) {
              res.errors.forEach(error => {
                const isOrgMissing = error.lastIndexOf(": organization does not exist");
                if (errors_set.size === 0 || error.lastIndexOf(": email exists") !== -1 || isOrgMissing !== -1) {
                  // the rest of the server side data checks were also checked here
                  errors_set.add(error);
                  if (isOrgMissing !== -1) {
                    const missingOrg = error.substring(0, isOrgMissing);
                    // if an organization does not exist only messages about non existing regarding that organization should appear
                    errors_set.forEach(errorMsg => {
                      if (errorMsg.lastIndexOf("You have tried to add users to " + missingOrg) !== -1) {
                        errors_set.delete(errorMsg);
                      }
                    });
                  }
                }
              });
            }
            _this.errors = [...errors_set];
          }).catch(err => _this.errors = [err.message]);
        } catch (e) {
          // suppose to be an error regarding the file headers
          errors_set.add(e);
          _this.errors = [...errors_set];
          return;
        }
      })();
    }
    send() {
      this.organization.addUsers(this.users).then(res => {
        if (res.success) {
          this._dialog.open(ConfirmDialogDialogComponent, {
            height: "170px",
            width: "350px",
            data: {
              message: "Modelers accounts added successfully!",
              okName: "Got it!",
              okColor: "#1a3763",
              centerText: true,
              closeFlag: true
            }
          });
          this.dialogRef.close();
          return;
        }
        this.errors = res.errors;
      }).catch(err => this.errors = [err.message]);
    }
    emailIsValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    nameIsValid(name) {
      return /^[ a-zA-Z]+$/.test(name);
    }
    static #_ = (() => this.ɵfac = function AddUserComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AddUserComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(OrganizationService), core /* ɵɵdirectiveInject */.rXU(UserService), core /* ɵɵdirectiveInject */.rXU(MatDialog));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: AddUserComponent,
      selectors: [["add-user"]],
      decls: 11,
      vars: 4,
      consts: [["fileInput", ""], ["style", "color: red;", 4, "ngIf"], ["style", "display: inline-block", 4, "ngIf"], ["mat-raised-button", "", "id", "upload", 2, "margin-right", "15px", 3, "click", "disabled"], ["mat-raised-button", "", "id", "send", 2, "margin-right", "15px", 3, "click", "disabled"], [2, "color", "red"], [4, "ngFor", "ngForOf"], [2, "display", "inline-block"], ["mat-mini-fab", "", "color", "primary", "id", "load_file_button", 3, "click"], ["type", "file", "accept", ".xlsx", "name", "single", 1, "form-control", 2, "display", "none", 3, "change"]],
      template: function AddUserComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "p");
          core /* ɵɵtext */.EFF(1, "Add OPCloud Modelers from an Excel sheet ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(2, "br");
          core /* ɵɵtemplate */.DNE(3, AddUserComponent_div_3_Template, 2, 1, "div", 1)(4, AddUserComponent_div_4_Template, 12, 0, "div", 2);
          core /* ɵɵelement */.nrm(5, "p");
          core /* ɵɵelementStart */.j41(6, "div")(7, "button", 3);
          core /* ɵɵlistener */.bIt("click", function AddUserComponent_Template_button_click_7_listener() {
            return ctx.upload();
          });
          core /* ɵɵtext */.EFF(8, "Upload");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(9, "button", 4);
          core /* ɵɵlistener */.bIt("click", function AddUserComponent_Template_button_click_9_listener() {
            return ctx.send();
          });
          core /* ɵɵtext */.EFF(10, "Send");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.errors);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.importExcel);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("disabled", !ctx.uploaded);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("disabled", !ctx.imported);
        }
      },
      dependencies: [NgForOf, NgIf, MatIcon, MatButton, MatMiniFabButton],
      styles: ["p[_ngcontent-%COMP%]{text-align:center;font-size:medium}ul[_ngcontent-%COMP%]{list-style-type:none;float:left;padding:5px}"]
    }))();
  }
  return AddUserComponent;
})();