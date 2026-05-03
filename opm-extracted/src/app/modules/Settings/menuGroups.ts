// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/menuGroups.ts
// Extracted by opm-extracted/tools/extract.mjs

const menuGroups = [{
  group: "User Management",
  icon: "account_box",
  menus: [{
    name: "Update My Profile",
    tooltip: "Update profile",
    priv: "auth",
    outlet: "update-user-details"
  }, {
    name: "OPL Settings",
    tooltip: "User OPM Settings",
    priv: "any",
    outlet: "opl-settings"
  }, {
    name: "OPCloud Settings",
    tooltip: "OPCloud Settings",
    priv: "any",
    outlet: "opcloud-settings"
  }]
}, {
  group: "Group Management",
  icon: "supervisor_account",
  menus: [{
    name: "Add New Group",
    tooltip: "Add New Group",
    priv: "OrgAdmin",
    outlet: "add-group"
  }, {
    name: "Group Administration",
    tooltip: "Group Administration",
    priv: "OrgAdmin",
    outlet: "del-grp"
  }]
}, {
  group: "Organization Management",
  icon: "dashboard",
  menus: [{
    name: "Add New Organization",
    tooltip: "New Org",
    priv: "SysAdmin",
    outlet: "new-org"
  },
  // change to sysadmin
  //{name: 'Delete Organization', tooltip: 'Delete Org', priv: 'SysAdmin', outlet: 'del-org'}, // change to sysadmin
  {
    name: "Org Administration",
    tooltip: "Org Administration",
    priv: "SysAdmin",
    outlet: "org-admin"
  },
  // change to sysadmin
  {
    name: "Edit Users",
    tooltip: "Edit users details",
    priv: "usersManagement",
    outlet: "set-admin"
  }, {
    name: "Find Users",
    tooltip: "Find and edit user details",
    priv: "SysAdmin",
    outlet: "find-users-admin"
  }, {
    name: "Add New User",
    tooltip: "New user",
    priv: "usersManagement",
    outlet: "new-user"
  }, {
    name: "Send Email",
    tooltip: "Send EMail",
    priv: "OrgAdmin",
    outlet: "send_email"
  }, {
    name: "OPL Settings",
    tooltip: "OPM Settings",
    priv: "OrgAdmin",
    outlet: "org-opl-settings"
  }, {
    name: "OPCloud Settings",
    tooltip: "OPCloud Settings",
    priv: "OrgAdmin",
    outlet: "OPCloud-Organization-Settings_org"
  }, {
    name: "Add New Language",
    tooltip: "OPM Settings",
    priv: "SysAdmin",
    outlet: "sysadmin-opl-settings"
  }, {
    name: "SSO Settings",
    tooltip: "SSO Settings",
    priv: "SysAdmin",
    outlet: "sso-settings"
  }, {
    name: "OPCloud Logs Dashboard",
    tooltip: "OPCloud Logs Dashboard",
    priv: "SysAdmin",
    outlet: "logs-dashboard"
  }, {
    name: "Organization Ontology",
    tooltip: "Organization Ontology",
    priv: "OrgAdmin",
    outlet: "organization_ontology"
  }, {
    name: "Organization Analytics",
    tooltip: "Organization Analytics",
    priv: "OrgAdmin",
    outlet: "organization_analytics"
  }]
}, {
  group: "Messages Management",
  icon: "send",
  menus: [{
    name: "Organization Messages",
    tooltip: "Organization Messages",
    priv: "OrgAdmin",
    outlet: "org_popup_messages"
  }, {
    name: "System Messages",
    tooltip: "System Messages",
    priv: "SysAdmin",
    outlet: "system_popup_messages"
  }]
}, {
  group: "Analyze Model",
  icon: "timeline",
  menus: [{
    name: "Calculate Model Metrics",
    tooltip: "Analyze",
    priv: "any",
    outlet: "model-analysis"
  }, {
    name: "NLP Model Analysis",
    tooltip: "Basic Model Analysis with NLP",
    priv: "any",
    outlet: "nlp-model-analysis"
  }, {
    name: "Graph Insights",
    tooltip: "In-memory graph analysis for current OPM model",
    priv: "any",
    outlet: "graph-insights"
  }, {
    name: "Model Analysis Tools",
    tooltip: "Tools, Options and Help, regarding different model analysis",
    priv: "any",
    outlet: "model-analysis-tools"
  }, {
    name: "DSM Analysis",
    tooltip: "Analyze",
    priv: "dsm",
    outlet: "dsm"
  }, {
    name: "Model Knowledge",
    tooltip: "Identification of Missing Knowledge and Model Knowledge Grading",
    priv: "dsm",
    outlet: "missing-knowledge-analysis"
  }, {
    name: "Pareto Frontier Analysis",
    tooltip: "Pareto Frontier Analysis",
    priv: "any",
    outlet: "pareto-frontier"
  }]
}, {
  group: "OPCloud Manuals",
  icon: "help_outline",
  menus: [{
    name: "OPCloud Guides",
    tooltip: "OPCloud User Manual, Introduction Guide and help links",
    priv: "auth",
    outlet: "opcloud-quick-manual"
  }, {
    name: "OPCloud Privacy Policy",
    tooltip: "See OPCloud Privacy Policy",
    priv: "auth",
    outlet: "opcloud-privacy-policy"
  }]
}];