// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app-routing.module.ts
// Extracted by opm-extracted/tools/extract.mjs

const routes = [{
  path: "",
  component: MainComponent,
  canActivate: [CanActivateViaAuthGuard]
}, {
  path: "load/:id",
  component: MainComponent,
  canActivate: [CanActivateViaAuthGuard],
  resolve: {
    message: OpcAppResolver
  }
}, {
  path: "load/:id/:opd",
  component: MainComponent,
  canActivate: [CanActivateViaAuthGuard],
  resolve: {
    message: OpcAppResolver
  }
}, {
  path: "load",
  component: MainComponent,
  canActivate: [CanActivateViaAuthGuard],
  resolve: {
    message: OpcAppResolver
  }
}, {
  path: "login",
  component: MainLoginComponent
}, {
  path: "settings",
  component: SettingsComponent,
  canActivate: [CanActivateViaAuthGuard],
  children: [{
    path: "under-Construction",
    component: SettingsUnderConstruction,
    outlet: "settings_main"
  }, {
    path: "org-opl-settings",
    component: OplDialogComponent,
    outlet: "settings_main"
  }, {
    path: "sysadmin-opl-settings",
    component: OplDialogComponentSysAdmin,
    outlet: "settings_main"
  }, {
    path: "organization_ontology",
    component: OrganizationOntologyComponent,
    outlet: "settings_main"
  }, {
    path: "organization_analytics",
    component: OrganizationAnalyticsComponent,
    outlet: "settings_main"
  }, {
    path: "system_popup_messages",
    component: PopupMessagesComponent,
    data: {
      type: "system"
    },
    outlet: "settings_main"
  }, {
    path: "org_popup_messages",
    component: PopupMessagesComponent,
    data: {
      type: "org"
    },
    outlet: "settings_main"
  }, {
    path: "opl-settings",
    component: OplSettingsComponent,
    outlet: "settings_main"
  }, {
    path: "opcloud-settings",
    component: OpcloudSettingsComponent,
    outlet: "settings_main"
  }, {
    path: "logs-dashboard",
    component: LogsDashboardComponent,
    outlet: "settings_main"
  }, {
    path: "home",
    component: SettingsHome,
    outlet: "settings_main"
  }, {
    path: "update-user-details",
    component: UserDetailsComponent,
    outlet: "settings_main"
  },
  /*{
    path: 'update-org-user-details',
    component: SettingsUpdateOrgUserDetails,
    outlet: 'settings_main'
  },*/
  {
    path: "groups-member",
    component: MemberGrpComponent,
    outlet: "settings_main"
  }, {
    path: "update-user-group",
    component: UserGroupsComponent,
    outlet: "settings_main"
  },
  /*{
    path: 'autosave',
    component: AutosaveComponent,
    outlet: 'settings_main'
  },
  {
    path: 'tree-view_user',
    component: TreeViewComponent_user,
    outlet: 'settings_main'
  },*/
  /*
  {
    path: 'tree-view_org',
    component: TreeViewComponent_org,
    outlet: 'settings_main'
  },*/
  {
    path: "OPCloud-Organization-Settings_org",
    component: OPCloudOrganizationSettingsComponent_org,
    outlet: "settings_main"
  }, {
    path: "send_email",
    component: SendEmailComponent,
    outlet: "settings_main"
  }, {
    path: "new-user",
    component: SettingsNewUser,
    outlet: "settings_main"
  }, {
    path: "model-analysis",
    component: ModelAnalysisComponent,
    outlet: "settings_main"
  }, {
    path: "nlp-model-analysis",
    component: NlpModelAnalysisComponent,
    outlet: "settings_main"
  }, {
    path: "model-analysis-tools",
    component: ModelAnalysisToolsComponent,
    outlet: "settings_main"
  }, {
    path: "graph-insights",
    component: GraphInsightsComponent,
    outlet: "settings_main"
  }, {
    path: "missing-knowledge-analysis",
    component: MissingKnowledgeAnalysisComponent,
    outlet: "settings_main"
  }, {
    path: "pareto-frontier",
    component: paretoFrontierDialog,
    outlet: "settings_main"
  }, {
    path: "listOfThings",
    component: ListThingsComponent,
    outlet: "settings_main"
  },
  /*{
    path: 'scripts',
    component: SettingsScriptsComponent,
    outlet: 'settings_main'
  },*/
  {
    path: "new-org",
    component: SettingsNewOrg,
    outlet: "settings_main"
  }, {
    path: "add-group",
    component: AddGroupComponent,
    outlet: "settings_main"
  }, {
    path: "set-admin/:chosenOrganization",
    component: SetAdminUserListComponent,
    outlet: "settings_main"
  }, {
    path: "set-admin",
    component: SetAdminUserListComponent,
    outlet: "settings_main"
  }, {
    path: "find-users-admin",
    component: FindUserAdminComponent,
    outlet: "settings_main"
  }, {
    path: "org-admin",
    component: OrgAdminComponent,
    outlet: "settings_main"
  }, {
    path: "sso-settings",
    component: SSOSettingsComponent,
    outlet: "settings_main"
  }, {
    path: "del-org",
    component: DeleteOrgComponent,
    outlet: "settings_main"
  }, {
    path: "del-grp",
    component: GroupAdministrationComponent,
    outlet: "settings_main"
  }, {
    path: "eula",
    component: UserAgreementComponent,
    outlet: "settings_main"
  }, {
    path: "dsm",
    component: DsmAnalysisComponent,
    outlet: "settings_main"
  }, {
    path: "opcloud-quick-manual",
    component: OPCloudManualComponent,
    outlet: "settings_main"
  }, {
    path: "opcloud-privacy-policy",
    component: OPCloudPrivacyPolicyComponent,
    outlet: "settings_main"
  }]
}];
let OpcRoutingModule = /*#__PURE__*/(() => {
  class OpcRoutingModule {
    static #_ = (() => this.ɵfac = function OpcRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpcRoutingModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: OpcRoutingModule
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      imports: [RouterModule.forRoot(routes, {}), RouterModule]
    }))();
  }
  return OpcRoutingModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(OpcRoutingModule, {
      imports: [RouterModule],
      exports: [RouterModule]
    });
  }
})();