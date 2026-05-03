// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/MainLogin.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let MainLoginComponent = /*#__PURE__*/(() => {
  class MainLoginComponent {
    constructor(router, _dialog, userService) {
      this.router = router;
      this._dialog = _dialog;
      this.userService = userService;
      this.isLoading = false;
    }
    backToMain() {
      document.getElementById("mainDIV").classList.add("bluring");
      const dialogRef = this._dialog.open(SignInComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (document.getElementById("mainDIV")) {
          document.getElementById("mainDIV").classList.remove("bluring");
        }
        this.isLoading = true;
      });
    }
    signWithSSO(providerName) {
      (providerName === "Microsoft" ? this.userService.signInWithMsal() : this.userService.signInWithGoogle()).then(() => this.router.navigate([""])).catch(err => {
        this.router.navigate(["/login"]);
        if (err && typeof err === "string") {
          alert(err);
        }
      });
    }
    switchSSOAccounts() {
      this.userService.signOutWithMsal().then(() => {}).catch(err => {
        console.log(err);
      });
    }
    showGIF($event, handlerGif = "") {
      return OPCloudUtils.showGIF($event, handlerGif, false, true);
    }
    mouseLeave() {
      OPCloudUtils.removeAllExplainationsDivs();
    }
    static #_ = (() => this.ɵfac = function Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MainLoginComponent)(core /* ɵɵdirectiveInject */.rXU(Router), core /* ɵɵdirectiveInject */.rXU(MatDialog), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: MainLoginComponent,
      selectors: [["opc-main-login"]],
      decls: 21,
      vars: 0,
      consts: [["id", "mainDIV", "align", "center"], ["src", "assets/SVG/newLogo.svg", 1, "opmLogo"], [1, "WarningCard"], [1, "my_text"], ["id", "sign-in", 1, "button", 3, "click"], ["id", "spin"], ["id", "sign-in2", 1, "button", 3, "click", "mouseenter", "mouseleave"], ["id", "switchSSO", 3, "click"], ["id", "sign-in3", 1, "button", 3, "click", "mouseenter", "mouseleave"]],
      template: function Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0);
          core /* ɵɵelement */.nrm(1, "img", 1);
          core /* ɵɵelementStart */.j41(2, "mat-card", 2)(3, "div", 3);
          core /* ɵɵtext */.EFF(4, "Please Sign In");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "mat-card-content")(6, "button", 4);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_6_listener() {
            return ctx.backToMain();
          });
          core /* ɵɵelement */.nrm(7, "div", 5);
          core /* ɵɵelementStart */.j41(8, "a");
          core /* ɵɵtext */.EFF(9, " OPCloud Account ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(10, "button", 6);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_10_listener() {
            return ctx.signWithSSO("Microsoft");
          })("mouseenter", function Template_button_mouseenter_10_listener($event) {
            return ctx.showGIF($event, "assets/gifs/microsoft.jpg");
          })("mouseleave", function Template_button_mouseleave_10_listener() {
            return ctx.mouseLeave();
          });
          core /* ɵɵelement */.nrm(11, "div", 5);
          core /* ɵɵelementStart */.j41(12, "a");
          core /* ɵɵtext */.EFF(13, " With Microsoft's SSO ");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(14, "a", 7);
          core /* ɵɵlistener */.bIt("click", function Template_a_click_14_listener() {
            return ctx.switchSSOAccounts();
          });
          core /* ɵɵelementStart */.j41(15, "span");
          core /* ɵɵtext */.EFF(16, "Switch SSO Account");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(17, "button", 8);
          core /* ɵɵlistener */.bIt("click", function Template_button_click_17_listener() {
            return ctx.signWithSSO("Google");
          })("mouseenter", function Template_button_mouseenter_17_listener($event) {
            return ctx.showGIF($event, "assets/gifs/google1.jpg");
          })("mouseleave", function Template_button_mouseleave_17_listener() {
            return ctx.mouseLeave();
          });
          core /* ɵɵelement */.nrm(18, "div", 5);
          core /* ɵɵelementStart */.j41(19, "a");
          core /* ɵɵtext */.EFF(20, " With Google's SSO ");
          core /* ɵɵelementEnd */.k0s()()()()();
        }
      },
      dependencies: [MatCard, MatCardContent],
      styles: ["[_nghost-%COMP%]{box-shadow:10px 0 #000;z-index:1}.user_info[_ngcontent-%COMP%]{position:absolute;right:0}.logo[_ngcontent-%COMP%]{height:50px}.bluring[_ngcontent-%COMP%]{filter:blur(5px)}.opmLogo[_ngcontent-%COMP%]{margin-top:10%;height:110px;padding-bottom:20px;padding-left:33px}.box[_ngcontent-%COMP%]{position:fixed;top:40%;margin-top:-50px;margin-left:-100px;border-radius:2px}#switchSSO[_ngcontent-%COMP%]{position:fixed;margin-left:-180px;margin-top:90px}.WarningCard[_ngcontent-%COMP%]{height:70px;font-size:14px;background:#1a376300;color:#ffffffde;align-items:center;text-align:center;box-shadow:none}.my_text[_ngcontent-%COMP%]{font-family:Raleway,sans-serif;font-size:45px;text-transform:uppercase}.button[_ngcontent-%COMP%]{background-color:#466797;font-family:Raleway,sans-serif;height:60px;width:170px;border-radius:8px;border:2px solid #ededed;margin:20px;color:#d1d1d1;text-decoration:none;font-size:1em;letter-spacing:1.5px;align-items:center;justify-content:center;position:relative;cursor:pointer;transition:all .45s ease-Out;overflow:hidden}.button[_ngcontent-%COMP%]:focus{outline:none}.button[_ngcontent-%COMP%]:hover   #spin[_ngcontent-%COMP%]{width:200%;height:500%;opacity:1;left:-70px;top:-70px;background:#ededed;transform:rotate(80deg)}.button[_ngcontent-%COMP%]:hover   a[_ngcontent-%COMP%]{color:#2d3142}a[_ngcontent-%COMP%]{color:#ededed;text-decoration:none;letter-spacing:1px;position:relative;transition:all .45s ease-Out}#spin[_ngcontent-%COMP%]{width:0;height:0;opacity:0;left:70px;top:20px;transform:rotate(0);background:none;position:absolute;transition:all .5s ease-Out}"]
    }))();
  }
  return MainLoginComponent;
})();