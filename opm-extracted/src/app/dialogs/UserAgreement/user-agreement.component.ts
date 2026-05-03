// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/UserAgreement/user-agreement.component.ts
// Extracted by opm-extracted/tools/extract.mjs

let UserAgreementComponent = /*#__PURE__*/(() => {
  class UserAgreementComponent {
    constructor(dialogRef, userService) {
      this.dialogRef = dialogRef;
      this.userService = userService;
    }
    Accept() {
      this.userService.updateDB({
        AcceptedEula: true
      }).then(res => this.dialogRef.close());
    }
    //sign out from the database is based on the original way - with firebase
    Decline() {
      this.userService.signOutWithFirebase().then(res => this.dialogRef.close());
    }
    static #_ = (() => this.ɵfac = function UserAgreementComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || UserAgreementComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef), core /* ɵɵdirectiveInject */.rXU(UserService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: UserAgreementComponent,
      selectors: [["user-agreement"]],
      decls: 180,
      vars: 0,
      consts: [["aria-label", "User Agreement"], ["ng-cloak", ""], [1, "mat-toolbar-tools"], ["flex", ""], ["mat-button", "", "ng-click", "cancel()", 1, "mat-icon-button"], ["mat-svg-src", "ic_close_24px.svg", "aria-label", "Close dialog"], [1, "mat-dialog-content"], ["layout", "row"], ["mat-button", "", 3, "click"]],
      template: function UserAgreementComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "form", 1)(2, "mat-toolbar")(3, "div", 2)(4, "h2")(5, "strong");
          core /* ɵɵtext */.EFF(6, "Non-Exclusive Software License Agreement");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(7, "span", 3);
          core /* ɵɵelementStart */.j41(8, "button", 4);
          core /* ɵɵelement */.nrm(9, "mat-icon", 5);
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(10, "mat-dialog-content")(11, "div", 6)(12, "p");
          core /* ɵɵtext */.EFF(13, "Please read the terms and conditions of this Software License Agreement (“Agreement”) carefully before you use the Solution (as defined below). This is a legally binding contract. By assenting electronically, or installing the Solution or using the Solution, you indicate your acceptance of the terms and conditions of this Agreement on behalf of yourself and any entity or individual you represent or for whose Device you acquire the Solution (collectively “you”).");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(14, "h2");
          core /* ɵɵtext */.EFF(15, "ARTICLE 1: DEFINITIONS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(16, "p");
          core /* ɵɵtext */.EFF(17, "1.2\tThe \"Licensor\" is the owner of the OPCloud Software Solution (\"OPCloud\" Or \"Software\"), and has all right, title and interest in and to it, as well as to any related information and documentation.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "p");
          core /* ɵɵtext */.EFF(19, "1.3\tThe \"Licensee\" wishes to obtain a non-exclusive license to use the Software, subject to the following terms and conditions, as set in this agreement.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(20, "h2");
          core /* ɵɵtext */.EFF(21, "ARTICLE 2: GRANT OF LICENSE");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(22, "p");
          core /* ɵɵtext */.EFF(23, "2.1\t");
          core /* ɵɵelementStart */.j41(24, "strong");
          core /* ɵɵtext */.EFF(25, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(26, " hereby grants to ");
          core /* ɵɵelementStart */.j41(27, "strong");
          core /* ɵɵtext */.EFF(28, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(29, ", and ");
          core /* ɵɵelementStart */.j41(30, "strong");
          core /* ɵɵtext */.EFF(31, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(32, " agrees to accept, a free-of-cost, non-exclusive, non-transferable license to use the Software only for the Permitted Use, subject to all terms and conditions as set in this Agreement. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(33, "h2");
          core /* ɵɵtext */.EFF(34, "ARTICLE 3: LICENSE RESTRICTIONS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(35, "p");
          core /* ɵɵtext */.EFF(36, "3.1\t");
          core /* ɵɵelementStart */.j41(37, "strong");
          core /* ɵɵtext */.EFF(38, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(39, " agrees to take any and all measures to protect the Software from any unauthorized and illegal use of it.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(40, "p");
          core /* ɵɵtext */.EFF(41, "3.2\t");
          core /* ɵɵelementStart */.j41(42, "strong");
          core /* ɵɵtext */.EFF(43, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(44, " may ");
          core /* ɵɵelementStart */.j41(45, "strong");
          core /* ɵɵtext */.EFF(46, "not");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(47, " modify the Software or any part thereof. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(48, "p");
          core /* ɵɵtext */.EFF(49, "3.3\tExcept as expressly authorized for the ");
          core /* ɵɵelementStart */.j41(50, "strong");
          core /* ɵɵtext */.EFF(51, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(52, " to use the Software as defined in Section 2 above, ");
          core /* ɵɵelementStart */.j41(53, "strong");
          core /* ɵɵtext */.EFF(54, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(55, " agrees ");
          core /* ɵɵelementStart */.j41(56, "strong");
          core /* ɵɵtext */.EFF(57, "not");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(58, " to rent, lease, sub-license, distribute, transfer, copy, reproduce, display, modify or time-share the Software.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(59, "p");
          core /* ɵɵtext */.EFF(60, "3.4\tLicensee may not transfer the ");
          core /* ɵɵelementStart */.j41(61, "strong");
          core /* ɵɵtext */.EFF(62, "License");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(63, " to another person or entity.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(64, "p");
          core /* ɵɵtext */.EFF(65, "3.5\tIt is hereby agreed that the ");
          core /* ɵɵelementStart */.j41(66, "strong");
          core /* ɵɵtext */.EFF(67, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(68, " is not obligated to provide any technical support and/or any other assistance to ");
          core /* ɵɵelementStart */.j41(69, "strong");
          core /* ɵɵtext */.EFF(70, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(71, " in relation to the use of the Software.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(72, "p");
          core /* ɵɵtext */.EFF(73, "3.6\tThe ");
          core /* ɵɵelementStart */.j41(74, "strong");
          core /* ɵɵtext */.EFF(75, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(76, " is obligated to keep in confidence all confidential information related to the Software, including without limitation, the ideas, concepts, know-how, techniques and other information disclosed to the Licensee.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(77, "h2");
          core /* ɵɵtext */.EFF(78, "ARTICLE 4: INTELLECTUAL PROPERTY RIGHTS");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(79, "p");
          core /* ɵɵtext */.EFF(80, "4.1 The Software is owned by the Licensor and is protected by the International and USA Copyright Laws.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(81, "p");
          core /* ɵɵtext */.EFF(82, "4.2\t");
          core /* ɵɵelementStart */.j41(83, "strong");
          core /* ɵɵtext */.EFF(84, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(85, " has the exclusive right to make any future Improvements, upgrades, developments, changes, derivatives (\"");
          core /* ɵɵelementStart */.j41(86, "strong");
          core /* ɵɵtext */.EFF(87, "Improvements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(88, "\") in and to the Software. The Licensee hereby accepts that any Improvement that he, she or it generated or disclosed or developed shall be disclosed immediately to the Licensor and shall be owned solely by the Licensor.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(89, "p");
          core /* ɵɵtext */.EFF(90, "4.3\tAll Intellectual Property rights in and to the Software and ");
          core /* ɵɵelementStart */.j41(91, "strong");
          core /* ɵɵtext */.EFF(92, "Improvements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(93, " shall remain vested in the ");
          core /* ɵɵelementStart */.j41(94, "strong");
          core /* ɵɵtext */.EFF(95, "Licensor.");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(96, "h2");
          core /* ɵɵtext */.EFF(97, "ARTICLE 5: DISCLAIMER OF WARRANTIES");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(98, "p");
          core /* ɵɵtext */.EFF(99, "5.1 ");
          core /* ɵɵelementStart */.j41(100, "strong");
          core /* ɵɵtext */.EFF(101, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(102, " makes no warranty and disclaims and excludes any and all other expressed or implied warranties. as well as statutory warranties, including, without limitation, warranties of good title, warranties against infringement, and the implied warranties of merchantability and fitness for a particular purpose of the Software and ");
          core /* ɵɵelementStart */.j41(103, "strong");
          core /* ɵɵtext */.EFF(104, "Improvements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(105, ".");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(106, "p");
          core /* ɵɵtext */.EFF(107, "5.2 ");
          core /* ɵɵelementStart */.j41(108, "strong");
          core /* ɵɵtext */.EFF(109, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(110, " does not warrant that the Software will satisfy ");
          core /* ɵɵelementStart */.j41(111, "strong");
          core /* ɵɵtext */.EFF(112, "Licensee's");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(113, " requirements or that the Software is without defect, error, computer virus or that it can cause any other computer malfunction, or interruption to its operation.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(114, "h2");
          core /* ɵɵtext */.EFF(115, "ARTICLE 6: LIMITATION OF LIABILITY");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(116, "p")(117, "strong");
          core /* ɵɵtext */.EFF(118, "6.1 The Software is provided to the Licensee \"As Is\".");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(119, "p");
          core /* ɵɵtext */.EFF(120, "6.2 ");
          core /* ɵɵelementStart */.j41(121, "strong");
          core /* ɵɵtext */.EFF(122, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(123, " shall, in no event, be liable to ");
          core /* ɵɵelementStart */.j41(124, "strong");
          core /* ɵɵtext */.EFF(125, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(126, " or to any other party, under the Agreement herein, for any loss of profits, loss of business, loss of data, or interruption of business, for any incidental or consequential damages arising from the use or inability to use the Software or for any claim by any other party. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(127, "p");
          core /* ɵɵtext */.EFF(128, "6.3 ");
          core /* ɵɵelementStart */.j41(129, "strong");
          core /* ɵɵtext */.EFF(130, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(131, " shall in no event be liable for direct, indirect, special, reliance, incident, or consequential loss or damage of any kind arising under the Agreement herein, whether in a contract, tort or other action for or arising out of breach of warranty, breach of contract, delay, negligence, strict liability or otherwise.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(132, "h2");
          core /* ɵɵtext */.EFF(133, "ARTICLE 7: TERMINATION AND TERMINATION EFFECT");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(134, "p");
          core /* ɵɵtext */.EFF(135, "7.1\t");
          core /* ɵɵelementStart */.j41(136, "strong");
          core /* ɵɵtext */.EFF(137, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(138, " may terminate the ");
          core /* ɵɵelementStart */.j41(139, "strong");
          core /* ɵɵtext */.EFF(140, "License");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(141, " and this Agreement at any time, for any reason, including, but not limited to, if it finds that ");
          core /* ɵɵelementStart */.j41(142, "strong");
          core /* ɵɵtext */.EFF(143, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(144, " has violated any of the terms of this License. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(145, "p");
          core /* ɵɵtext */.EFF(146, "7.2\tUpon notification of termination, ");
          core /* ɵɵelementStart */.j41(147, "strong");
          core /* ɵɵtext */.EFF(148, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(149, " agrees to destroy all copies of the Software and to certify in writing to the ");
          core /* ɵɵelementStart */.j41(150, "strong");
          core /* ɵɵtext */.EFF(151, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(152, " that all known copies, including back up ones, as well as access rights, user names and passwords to the Cloud-based software, have been destroyed.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(153, "p");
          core /* ɵɵtext */.EFF(154, "7.3\tThe obligations of the ");
          core /* ɵɵelementStart */.j41(155, "strong");
          core /* ɵɵtext */.EFF(156, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(157, " under this Agreement shall survive any such termination. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(158, "h2");
          core /* ɵɵtext */.EFF(159, "ARTICLE 8 : MISCELENIOUS ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(160, "p");
          core /* ɵɵtext */.EFF(161, "8.1 This Agreement supersedes all prior agreements and understanding between ");
          core /* ɵɵelementStart */.j41(162, "strong");
          core /* ɵɵtext */.EFF(163, "Licensor");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(164, " and ");
          core /* ɵɵelementStart */.j41(165, "strong");
          core /* ɵɵtext */.EFF(166, "Licensee");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtext */.EFF(167, " pertaining to the Software and can be changed only by a writing executed by the party against whom such changes is sought to be enforced. ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(168, "p");
          core /* ɵɵtext */.EFF(169, "8.2 This Agreement shall be governed by the laws of the state of Israel.");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(170, "p")(171, "strong");
          core /* ɵɵtext */.EFF(172, "Click on \"I AGREE – Access Software\" at the bottom of the page below if you agree with this license. Otherwise click on I DO NOT AGREE to close this page.");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(173, "mat-dialog-actions", 7)(174, "button", 8);
          core /* ɵɵlistener */.bIt("click", function UserAgreementComponent_Template_button_click_174_listener() {
            return ctx.Accept();
          });
          core /* ɵɵelementStart */.j41(175, "strong");
          core /* ɵɵtext */.EFF(176, "I AGREE – Access Software");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(177, "button", 8);
          core /* ɵɵlistener */.bIt("click", function UserAgreementComponent_Template_button_click_177_listener() {
            return ctx.Decline();
          });
          core /* ɵɵelementStart */.j41(178, "strong");
          core /* ɵɵtext */.EFF(179, "I DO NOT AGREE");
          core /* ɵɵelementEnd */.k0s()()()()()()();
        }
      },
      dependencies: [MatDialogActions, MatDialogContent, MatToolbar, MatIcon, MatButton, fesm2022_forms /* ɵNgNoValidate */.qT, NgControlStatusGroup, NgForm],
      styles: ["p[_ngcontent-%COMP%]{text-align:left}.dialogdemoBasicUsage[_ngcontent-%COMP%]   #popupContainer[_ngcontent-%COMP%]{position:relative}.dialogdemoBasicUsage[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]{width:100%;text-align:center;margin-left:20px}.dialogdemoBasicUsage[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%], .dialogdemoBasicUsage[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%] > code[_ngcontent-%COMP%]{font-size:.8em;margin-top:50px}.dialogdemoBasicUsage[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:200px}.dialogdemoBasicUsage[_ngcontent-%COMP%]   div#status[_ngcontent-%COMP%]{color:#c60008}.dialogdemoBasicUsage[_ngcontent-%COMP%]   .dialog-demo-prerendered[_ngcontent-%COMP%]   mat-mdc-checkbox[_ngcontent-%COMP%]{margin-bottom:0}.mat-mdc-form-field-underline[_ngcontent-%COMP%]{display:none}"]
    }))();
  }
  return UserAgreementComponent;
})();