// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/opc.module.ts
// Extracted by opm-extracted/tools/extract.mjs

// import {FileSelectDirective, FileUploadModule} from 'ng2-file-upload';
// import { NgProgressModule } from 'ngx-progressbar';

let OpcModule = /*#__PURE__*/(() => {
  class OpcModule {
    static #_ = (() => this.ɵfac = function OpcModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpcModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: OpcModule
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      providers: [AuthenticationService, DatabaseService, {
        provide: "DatabaseDriver",
        useClass: ServerDatabaseDrive
      }, {
        provide: "AuthenticationDriver",
        useClass: environment.serverSideAuth ? ServerAuthDriver : FirebaseAuthDriver
      }, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }, {
        provide: ErrorHandler,
        useClass: GlobalErrorHandler
      }, FirebaseAuthDriver, MsalAuthDriver, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }, UserService, ModelStorageService, ContextService, StorageService, OrganizationService, ModelCompressionService, GroupsService, CanActivateViaAuthGuard, PermissionsService, OpcAppResolver, DsmAnalysisComponent, OPCloudManualComponent, OPCloudPrivacyPolicyComponent, {
        provide: AbstractVersionService,
        useClass: OpcVersionService
      }, {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
      }, {
        provide: MSAL_INSTANCE,
        useFactory: MSALInstanceFactory
      }, {
        provide: MSAL_GUARD_CONFIG,
        useFactory: MSALGuardConfigFactory
      }, {
        provide: MSAL_INTERCEPTOR_CONFIG,
        useFactory: MSALInterceptorConfigFactory
      }, MsalService, MsalGuard, MsalBroadcastService, {
        provide: MAT_CHIPS_DEFAULT_OPTIONS,
        useValue: {
          separatorKeyCodes: [ENTER, COMMA]
        }
      }, LinksDialogComponent],
      imports: [environment.serverSideAuth ? [] : [AngularFireModule.initializeApp(environment.firebaseCredentials)], AngularFireAuthModule, AngularFireDatabaseModule, CommonModule, TreeModule, SharedModule, FormsModule, OpcRoutingModule, DragDropModule, MatSlideToggleModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule, MsalModule, MatBadgeModule, CodeEditorModule, MatTabsModule, MatProgressBarModule, MatRadioModule, FileUploadModule, NgApexchartsModule]
    }))();
  }
  return OpcModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(OpcModule, {
      declarations: [MainLoginComponent, SettingsComponent, LoadModelDialogComponent, HeadlessRunnerComponent, RenameDialogComponent, SubModelNameComponent, DeleteModelDialogComponent, SendEmailComponent, UserGroupsComponent, UserDetailsComponent,
      // SettingsUpdateOrgUserDetails,
      OrgAdminComponent, SSOSettingsComponent, SettingsUnderConstruction, SettingsOplGroupComponent, OPCloudOrganizationSettingsComponent_org, OplDialogComponent, OplDialogComponentSysAdmin, KeysPipe, SettingsHome, MemberGrpComponent, ModelAnalysisComponent, NlpModelAnalysisComponent, ModelAnalysisToolsComponent, MissingKnowledgeAnalysisComponent, GraphInsightsComponent, GraphInsightsInstructionsDialogComponent, ListThingsComponent, SettingsNewUser, GroupAdministrationComponent, DeleteOrgComponent, SetAdminUserListComponent, FindUserAdminComponent, UpdateUserDialogComponent, ActivateUserDialogComponent, AddGroupComponent, ChangePasswordDialogComponent, UserAgreementComponent, ResetInitialPasswordComponent,
      // SettingsScriptsComponent,
      SettingsNewOrg, SignInComponent, AboutDialogComponent, InputNameDialogComponent, EnterValueDialogComponent, NewModelComponent, SaveScreenshotComponent, ChooseExportedFileNameComponent, UploadFile, SavePdfComponent, ExportModelAsHtmlComponent, ExportLegendDialogComponent, ExportSysMLDialogComponent, DCMExportWizardComponent, DCMViewerComponent, DMNDecisionViewerComponent, SaveURLComponent, AddUserComponent, DsmAnalysisComponent, OPCloudManualComponent, OPCloudPrivacyPolicyComponent, OplSettingsComponent, OpcloudSettingsComponent, StereotypesDialogComponent, AttributesAndInstancesComponent, GreyItemsDialogComponent, SimulationElementComponent, SimulationComponent, multiInstancesDialog, paretoFrontierDialog, RemoveUserComponent, MultiDeleteProgressComponent, MultiUpdateUserDialogComponent, CreateViewDialog, CreateRequirementViewDialog, LogsDashboardComponent, LogsDashboardDialogComponent, LogSharingDialogComponent, StyleCopyingDialogComponent, DownloadCSVComponent, ValidationSettingsComponent, CodeEditorDialog, PythonCodeEditorDialog, GenAIComputationalEditorDialog, FolderPermissionsDialogComponent, OpdtreeModelSettingsComponent, OrganizationOntologyComponent, OrganizationAnalyticsComponent, OntologySuggestionDialog, TemplatesComponent, ImagesPoolManagementComponent, ImagesPoolContainer, CreatePopupMessagesComponent, PopupMessagesComponent, PopupMessageContentComponent, PopupViewsOrConfirmsComponent, Set2AuthFactorsDialog, EnterEmailVerificationCodeDialog, OPLGenerativeAIDialogComponent, GenerativeAIUpdateKeyDialogComponent, GenerativeAIImpactAnalysisDialogComponent, GenerativeAIRequirementsExportDialogComponent],
      imports: [AngularFireModule, AngularFireAuthModule, AngularFireDatabaseModule, CommonModule, TreeModule, SharedModule, FormsModule, OpcRoutingModule, DragDropModule, MatSlideToggleModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule, MsalModule, MatBadgeModule, CodeEditorModule, MatTabsModule, MatProgressBarModule, MatRadioModule, FileUploadModule, NgOptimizedImage, NgApexchartsModule]
    });
  }
})();
core /* ɵɵsetComponentScope */.wjB(ImagesPoolContainer, function () {
  return [MatTab, MatTabGroup, ImagesPoolManagementComponent];
}, []);
