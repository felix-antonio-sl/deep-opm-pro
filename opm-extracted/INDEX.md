# INDEX — clases OPM extraídas

Tabla generada automáticamente por `tools/build-index.mjs`. Mapea cada
clase OPM presente en `opm-extracted/src/` a su archivo. Las clases
provienen del catálogo `catalog/classes.txt` (376 clases identificadas en
la decompilación) más cualquier clase auxiliar que aparezca al refactorizar.

## Resumen

- **Archivos**: 349
- **Clases distintas**: 486
- **Líneas totales**: 164,775
- **Bytes totales**: 7798.6 KiB

## Clases (orden alfabético)

| Clase | Extends | Archivo | Líneas |
|-------|---------|---------|--------|
| `AboutDialogComponent` | `—` | [`src/app/dialogs/About/about.ts`](src/app/dialogs/About/about.ts) | 50 |
| `AbstractVersionService` | `—` | [`src/app/rappid-components/services/init/abstract.init.service.ts`](src/app/rappid-components/services/init/abstract.init.service.ts) | 17 |
| `ActivateUserDialogComponent` | `—` | [`src/app/dialogs/activate-user-dialog/activate-user-dialog.component.ts`](src/app/dialogs/activate-user-dialog/activate-user-dialog.component.ts) | 108 |
| `ActivityDiagramConverter` | `BaseDiagramConverter` | [`src/app/services/sysml-converters/activity-diagram.converter.ts`](src/app/services/sysml-converters/activity-diagram.converter.ts) | 353 |
| `AddGroupComponent` | `—` | [`src/app/modules/Settings/group-mgmt/add-group/add-group.component.ts`](src/app/modules/Settings/group-mgmt/add-group/add-group.component.ts) | 371 |
| `AddStateCommand` | `—` | [`src/app/models/components/commands/add-states.ts`](src/app/models/components/commands/add-states.ts) | 45 |
| `AddStatesAction` | `—` | [`src/app/models/components/commands/add-states.ts`](src/app/models/components/commands/add-states.ts) | 45 |
| `AddUserComponent` | `—` | [`src/app/dialogs/add-users-excel/add-users.component.ts`](src/app/dialogs/add-users-excel/add-users.component.ts) | 309 |
| `AgentConsistency` | `ConsistionalRule` | [`src/app/models/consistency/consistional.rules.ts`](src/app/models/consistency/consistional.rules.ts) | 145 |
| `AgentLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/AgentLink.ts`](src/app/models/DrawnPart/Links/AgentLink.ts) | 53 |
| `AggregationBetweenPhysicaltoInformatical` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `AggregationLink` | `OpmFundamentalLink` | [`src/app/models/DrawnPart/Links/AggregationLink.ts`](src/app/models/DrawnPart/Links/AggregationLink.ts) | 33 |
| `AliasingModule` | `—` | [`src/app/models/LogicalPart/components/aliasing-module.ts`](src/app/models/LogicalPart/components/aliasing-module.ts) | 33 |
| `AlreadyConnectedWithProcedural` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `AlreadyConnectedWithStructural` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `AlreadyConnectedWithStructuralOnTheOtherWay` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `AnimationBuilder` | `—` | [`src/main.ts`](src/main.ts) | 2533 |
| `AnimationFactory` | `—` | [`src/main.ts`](src/main.ts) | 2533 |
| `AnimationGroupPlayer` | `—` | [`src/main.ts`](src/main.ts) | 2533 |
| `AppComponent` | `—` | [`src/app/modules/app/app.component.ts`](src/app/modules/app/app.component.ts) | 25 |
| `AppModule` | `—` | [`src/app/modules/app.module.ts`](src/app/modules/app.module.ts) | 43 |
| `Arc` | `—` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `AttributesAndInstancesComponent` | `—` | [`src/app/dialogs/attributes-and-instances-dialog/attributes-and-instances-dialog.component.ts`](src/app/dialogs/attributes-and-instances-dialog/attributes-and-instances-dialog.component.ts) | 587 |
| `AttributeValue` | `—` | [`src/app/models/modules/attribute-validation/attribute-value.ts`](src/app/models/modules/attribute-validation/attribute-value.ts) | 75 |
| `AuthenticationService` | `—` | [`src/app/rappid-components/services/authentication/authentication.service.ts`](src/app/rappid-components/services/authentication/authentication.service.ts) | 293 |
| `AuthInterceptor` | `—` | [`src/app/database/authInterceptor.ts`](src/app/database/authInterceptor.ts) | 115 |
| `AvatarComponent` | `—` | [`src/app/modules/shared/avatar/avatar.component.ts`](src/app/modules/shared/avatar/avatar.component.ts) | 74 |
| `AvoidEmptyName` | `—` | [`src/app/models/json.model.ts`](src/app/models/json.model.ts) | 612 |
| `BackgroundPhotoDialogComponent` | `—` | [`src/app/dialogs/background-photo-dialog/background-photo-dialog.ts`](src/app/dialogs/background-photo-dialog/background-photo-dialog.ts) | 393 |
| `BaseConsistency` | `ConsistionalRule` | [`src/app/models/consistency/consistional.rules.ts`](src/app/models/consistency/consistional.rules.ts) | 145 |
| `BaseDiagramConverter` | `—` | [`src/app/services/sysml-converters/base-diagram.converter.ts`](src/app/services/sysml-converters/base-diagram.converter.ts) | 128 |
| `BasicLogicalTextModule` | `—` | [`src/app/models/LogicalPart/LogicalTextModule.ts`](src/app/models/LogicalPart/LogicalTextModule.ts) | 94 |
| `BasicNameModule` | `—` | [`src/app/models/LogicalPart/LogicalTextModule.ts`](src/app/models/LogicalPart/LogicalTextModule.ts) | 94 |
| `BasicOpmModel` | `—` | [`src/app/models/BasicOpmModel.ts`](src/app/models/BasicOpmModel.ts) | 747 |
| `BehaviouralRule` | `—` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `BelongsToStereotypTextModule` | `—` | [`src/app/models/LogicalPart/components/StereotypeModule.ts`](src/app/models/LogicalPart/components/StereotypeModule.ts) | 51 |
| `BiDirectionalTaggedLink` | `OpmTaggedLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `BlankLink` | `OpmLinkRappid` | [`src/app/models/DrawnPart/Links/BlankLink.ts`](src/app/models/DrawnPart/Links/BlankLink.ts) | 225 |
| `BlockDefinitionDiagramConverter` | `BaseDiagramConverter` | [`src/app/services/sysml-converters/block-definition-diagram.converter.ts`](src/app/services/sysml-converters/block-definition-diagram.converter.ts) | 371 |
| `BooleanRange` | `—` | [`src/app/models/modules/attribute-validation/boolean-range.ts`](src/app/models/modules/attribute-validation/boolean-range.ts) | 29 |
| `BringConnectedAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `BringConnectedCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `BringConnectedEntitiesAction` | `—` | [`src/app/models/Actions/BringConnectedEntitiesAction.ts`](src/app/models/Actions/BringConnectedEntitiesAction.ts) | 209 |
| `BringExhibitingThing` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BringFundamentalRelations` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BringProceduralEnablersRelations` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BringProceduraTransformersRelations` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BringSelfInvocationAsInzoomedInvocation` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BringStructuralRelationsThatHasProceduralInParallel` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BringUniBiDirectionalRelations` | `—` | [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) | 182 |
| `BrowserAnimationBuilder` | `AnimationBuilder` | [`src/main.ts`](src/main.ts) | 2533 |
| `BrowserAnimationFactory` | `AnimationFactory` | [`src/main.ts`](src/main.ts) | 2533 |
| `CalanderComponent` | `—` | [`src/app/modules/shared/calander/calander.component.ts`](src/app/modules/shared/calander/calander.component.ts) | 80 |
| `CanActivateViaAuthGuard` | `—` | [`src/app/modules/CanActivateViaAuthGuard.ts`](src/app/modules/CanActivateViaAuthGuard.ts) | 76 |
| `CannotBePhysicalChangeAction` | `ChangeAction` | [`src/app/models/consistency/changeActions/CannotBePhysicalChangeAction.ts`](src/app/models/consistency/changeActions/CannotBePhysicalChangeAction.ts) | 41 |
| `CannotConnectFundamentalFromSharedSubModelSource` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CannotConnectFundamentalFromSharedSubModelSource2` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CannotConnectThingToItsInzoomedFather` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CannotLinkToRequirementObject` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `CannotLinkToValueTypeObjec` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `CanonicalOPMExportService` | `—` | [`src/app/services/dcm/canonical-opm-export.service.ts`](src/app/services/dcm/canonical-opm-export.service.ts) | 354 |
| `CantConnectBeforeCreated` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CantConnectBeforeCreated2` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CantConnectConsumed` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CantConnectConsumed2` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CantConnectInzoomedProcessToItsChildrenWithInvocation` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CantConnectSelfInvocationForInzoomedProcess` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `CaseEntitySelectionAlgorithm` | `—` | [`src/app/services/dcm/algorithms/case-entity-selection.algorithm.ts`](src/app/services/dcm/algorithms/case-entity-selection.algorithm.ts) | 61 |
| `CaseFileSchemaAlgorithm` | `—` | [`src/app/services/dcm/algorithms/case-file-schema.algorithm.ts`](src/app/services/dcm/algorithms/case-file-schema.algorithm.ts) | 133 |
| `ChangeAction` | `—` | [`src/app/models/consistency/changeActions/changeAction.interface.ts`](src/app/models/consistency/changeActions/changeAction.interface.ts) | 12 |
| `ChangePasswordDialogComponent` | `—` | [`src/app/dialogs/change-password-dialog/change-password-dialog.component.ts`](src/app/dialogs/change-password-dialog/change-password-dialog.component.ts) | 87 |
| `CharRange` | `—` | [`src/app/models/modules/attribute-validation/char-range.ts`](src/app/models/modules/attribute-validation/char-range.ts) | 30 |
| `ChatComponentFloat` | `—` | [`src/app/modules/layout/opcloud-chat-component-float/chat.component.float.ts`](src/app/modules/layout/opcloud-chat-component-float/chat.component.float.ts) | 172 |
| `ChatComponentPanel` | `—` | [`src/app/modules/layout/opcloud-chat-component-panel/chat.component.panel.ts`](src/app/modules/layout/opcloud-chat-component-panel/chat.component.panel.ts) | 603 |
| `ChatStorageInterface` | `—` | [`src/app/rappid-components/services/storage/chat/chat-storage.interface.ts`](src/app/rappid-components/services/storage/chat/chat-storage.interface.ts) | 11 |
| `ChatStorageService` | `—` | [`src/app/rappid-components/services/storage/chat/chat-storage.service.ts`](src/app/rappid-components/services/storage/chat/chat-storage.service.ts) | 77 |
| `ChooseExportedFileNameComponent` | `—` | [`src/app/dialogs/choose-exported-file-name/choose-exported-file-name.ts`](src/app/dialogs/choose-exported-file-name/choose-exported-file-name.ts) | 83 |
| `CloneRegistry` | `—` | [`src/app/models/DSM/dsm.model.ts`](src/app/models/DSM/dsm.model.ts) | 1332 |
| `CMMNDIExporterService` | `—` | [`src/app/services/dcm/exporters/cmmndi-exporter.service.ts`](src/app/services/dcm/exporters/cmmndi-exporter.service.ts) | 830 |
| `CMMNExporterService` | `—` | [`src/app/services/dcm/exporters/cmmn-exporter.service.ts`](src/app/services/dcm/exporters/cmmn-exporter.service.ts) | 2632 |
| `CodeEditorDialog` | `—` | [`src/app/dialogs/code-editor-dialog/code-editor-dialog.ts`](src/app/dialogs/code-editor-dialog/code-editor-dialog.ts) | 232 |
| `CollaborationDialogComponent` | `—` | [`src/app/dialogs/collaboration-dialog/collaboration-dialog.component.ts`](src/app/dialogs/collaboration-dialog/collaboration-dialog.component.ts) | 622 |
| `CollaborationMenuComponent` | `—` | [`src/app/opd-hierarchy/coll-menu.component.ts`](src/app/opd-hierarchy/coll-menu.component.ts) | 112 |
| `CommandsDecider` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ComparisonFeatureSet` | `—` | [`src/app/modules/app/opm-model-comparison.service.ts`](src/app/modules/app/opm-model-comparison.service.ts) | 259 |
| `Complexity` | `—` | [`src/app/models/complexity.model.ts`](src/app/models/complexity.model.ts) | 1538 |
| `ComputationModule` | `—` | [`src/app/models/LogicalPart/components/computation-module.ts`](src/app/models/LogicalPart/components/computation-module.ts) | 46 |
| `ConfigService` | `—` | [`src/app/configuration/service/config.service.ts`](src/app/configuration/service/config.service.ts) | 51 |
| `ConfigurationsTextModule` | `—` | [`src/app/models/LogicalPart/components/configurationsTextModule.ts`](src/app/models/LogicalPart/components/configurationsTextModule.ts) | 24 |
| `ConfirmDialogDialogComponent` | `—` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `ConnectionPoint` | `joint.shapes.basic.Circle` | [`src/app/models/DrawnPart/Links/SelfInvocationLink.ts`](src/app/models/DrawnPart/Links/SelfInvocationLink.ts) | 330 |
| `Consistency` | `—` | [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) | 1529 |
| `ConsistionalRule` | `—` | [`src/app/models/consistency/consistional.rules.ts`](src/app/models/consistency/consistional.rules.ts) | 145 |
| `ConsumptionLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/ConsumptionLink.ts`](src/app/models/DrawnPart/Links/ConsumptionLink.ts) | 115 |
| `ContextService` | `—` | [`src/app/modules/app/context.service.ts`](src/app/modules/app/context.service.ts) | 1038 |
| `CreatePopupMessagesComponent` | `—` | [`src/app/dialogs/create-popup-message/create-popup-message.component.ts`](src/app/dialogs/create-popup-message/create-popup-message.component.ts) | 293 |
| `CreateRequirementViewDialog` | `—` | [`src/app/dialogs/create-requirement-view-dialog/create-requirement-view-dialog.ts`](src/app/dialogs/create-requirement-view-dialog/create-requirement-view-dialog.ts) | 115 |
| `CreateViewDialog` | `—` | [`src/app/dialogs/create-view-dialog/create-view-dialog.ts`](src/app/dialogs/create-view-dialog/create-view-dialog.ts) | 139 |
| `DatabaseService` | `—` | [`src/app/database/database.service.ts`](src/app/database/database.service.ts) | 23 |
| `DCMContext` | `EmptyContext` | [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) | 349 |
| `DCMExportWizardComponent` | `—` | [`src/app/dialogs/dcm-export-wizard/dcm-export-wizard.component.ts`](src/app/dialogs/dcm-export-wizard/dcm-export-wizard.component.ts) | 818 |
| `DCMExportWizardService` | `—` | [`src/app/services/dcm/dcm-export-wizard.service.ts`](src/app/services/dcm/dcm-export-wizard.service.ts) | 744 |
| `DCMIRExporterService` | `—` | [`src/app/services/dcm/exporters/dcm-ir-exporter.service.ts`](src/app/services/dcm/exporters/dcm-ir-exporter.service.ts) | 23 |
| `DCMValidationService` | `—` | [`src/app/services/dcm/validation.service.ts`](src/app/services/dcm/validation.service.ts) | 616 |
| `DCMViewerComponent` | `—` | [`src/app/dialogs/dcm-viewer/dcm-viewer.component.ts`](src/app/dialogs/dcm-viewer/dcm-viewer.component.ts) | 2084 |
| `DeepSearchFolder` | `—` | [`src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts`](src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts) | 27 |
| `DeepSearchModel` | `—` | [`src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts`](src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts) | 27 |
| `DeleteAction` | `—` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `DeleteModelDialogComponent` | `—` | [`src/app/dialogs/load-model-dialog/sub-dialogs/removeModel/delete-model-dialog.component.ts`](src/app/dialogs/load-model-dialog/sub-dialogs/removeModel/delete-model-dialog.component.ts) | 95 |
| `DeleteOrgComponent` | `—` | [`src/app/modules/Settings/organization-mgmt/delete-org/delete-org.component.ts`](src/app/modules/Settings/organization-mgmt/delete-org/delete-org.component.ts) | 80 |
| `DestateAction` | `—` | [`src/app/models/components/commands/destate.ts`](src/app/models/components/commands/destate.ts) | 46 |
| `DestateCommand` | `—` | [`src/app/models/components/commands/destate.ts`](src/app/models/components/commands/destate.ts) | 46 |
| `DialogService` | `—` | [`src/app/rappid-components/services/dialog.service.ts`](src/app/rappid-components/services/dialog.service.ts) | 38 |
| `DisconnectSubModelTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `DMNDecisionViewerComponent` | `—` | [`src/app/dialogs/dmn-decision-viewer/dmn-decision-viewer.component.ts`](src/app/dialogs/dmn-decision-viewer/dmn-decision-viewer.component.ts) | 601 |
| `DMNExporterService` | `—` | [`src/app/services/dcm/exporters/dmn-exporter.service.ts`](src/app/services/dcm/exporters/dmn-exporter.service.ts) | 146 |
| `DownloadCSVComponent` | `—` | [`src/app/dialogs/DownloadCSV/DownloadCSV.ts`](src/app/dialogs/DownloadCSV/DownloadCSV.ts) | 540 |
| `DsmAnalysisComponent` | `—` | [`src/app/modules/Settings/dsm-analysis/dsm-analysis.component.ts`](src/app/modules/Settings/dsm-analysis/dsm-analysis.component.ts) | 2876 |
| `DSMContext` | `EmptyContext` | [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) | 349 |
| `DsmModel` | `—` | [`src/app/models/DSM/dsm.model.ts`](src/app/models/DSM/dsm.model.ts) | 1332 |
| `EditAliasAction` | `—` | [`src/app/models/components/commands/edit-alias.ts`](src/app/models/components/commands/edit-alias.ts) | 43 |
| `EditAliasCommand` | `—` | [`src/app/models/components/commands/edit-alias.ts`](src/app/models/components/commands/edit-alias.ts) | 43 |
| `EditUnitsAction` | `—` | [`src/app/models/components/commands/edit-units.ts`](src/app/models/components/commands/edit-units.ts) | 42 |
| `EditUnitsCommand` | `—` | [`src/app/models/components/commands/edit-units.ts`](src/app/models/components/commands/edit-units.ts) | 42 |
| `EdxModelContext` | `—` | [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) | 349 |
| `EffectLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/EffectLink.ts`](src/app/models/DrawnPart/Links/EffectLink.ts) | 117 |
| `ElementsMap` | `—` | [`src/app/models/components/ElementsMap.ts`](src/app/models/components/ElementsMap.ts) | 19 |
| `ElementToolBarComponent` | `—` | [`src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`](src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts) | 8979 |
| `EmptyContext` | `—` | [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) | 349 |
| `EnterEmailVerificationCodeDialog` | `—` | [`src/app/dialogs/enter-email-verification-code-dialog/enter-email-verification-code-dialog.ts`](src/app/dialogs/enter-email-verification-code-dialog/enter-email-verification-code-dialog.ts) | 162 |
| `EnterValueDialogComponent` | `—` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `ErrorHandlerService` | `—` | [`src/app/error-handler/error-handler.service.ts`](src/app/error-handler/error-handler.service.ts) | 117 |
| `EventListenerGenerationAlgorithm` | `—` | [`src/app/services/dcm/algorithms/event-listener-generation.algorithm.ts`](src/app/services/dcm/algorithms/event-listener-generation.algorithm.ts) | 130 |
| `ExampleHttpDatabase` | `—` | [`src/app/dialogs/logs-dashboard/logs-dashboard.component.ts`](src/app/dialogs/logs-dashboard/logs-dashboard.component.ts) | 402 |
| `exhibitionAncestor` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ExhibitionLink` | `OpmFundamentalLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `ExhibitionToPhysical` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ExistingNameDialogComponent` | `—` | [`src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts`](src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts) | 200 |
| `ExportLegendDialogComponent` | `—` | [`src/app/dialogs/export-legend-dialog/export-legend-dialog.component.ts`](src/app/dialogs/export-legend-dialog/export-legend-dialog.component.ts) | 828 |
| `ExportModelAsHtmlComponent` | `—` | [`src/app/dialogs/export-model-as-html-dialog/export-model-as-html.ts`](src/app/dialogs/export-model-as-html-dialog/export-model-as-html.ts) | 685 |
| `ExportOPLAPIService` | `—` | [`src/app/modules/app/export-opl.service.ts`](src/app/modules/app/export-opl.service.ts) | 164 |
| `ExportSysMLDialogComponent` | `—` | [`src/app/dialogs/export-sysml-dialog/export-sysml-dialog.component.ts`](src/app/dialogs/export-sysml-dialog/export-sysml-dialog.component.ts) | 299 |
| `FindUserAdminComponent` | `—` | [`src/app/dialogs/find-user-admin/find-user-admin.component.ts`](src/app/dialogs/find-user-admin/find-user-admin.component.ts) | 372 |
| `FirebaseAuthDriver` | `—` | [`src/app/database/firebaseAuthDriver.ts`](src/app/database/firebaseAuthDriver.ts) | 184 |
| `FolderPermissionsDialogComponent` | `—` | [`src/app/dialogs/folder-permissions-dialog/folder-permissions-dialog/folder-permissions-dialog.component.ts`](src/app/dialogs/folder-permissions-dialog/folder-permissions-dialog/folder-permissions-dialog.component.ts) | 591 |
| `FontHighlightDirective` | `—` | [`src/app/modules/layout/element-tool-bar/directives/font-highlight.directive.ts`](src/app/modules/layout/element-tool-bar/directives/font-highlight.directive.ts) | 42 |
| `FundamentalConsistency` | `ConsistionalRule` | [`src/app/models/consistency/consistional.rules.ts`](src/app/models/consistency/consistional.rules.ts) | 145 |
| `GenAIComputationalEditorDialog` | `—` | [`src/app/dialogs/genAI-computational-editor-dialog/genAI-computational-editor-dialog.ts`](src/app/dialogs/genAI-computational-editor-dialog/genAI-computational-editor-dialog.ts) | 259 |
| `GeneralizationLink` | `OpmFundamentalLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `GeneralizationPhysicalToPhysical` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `GenerativeAIImpactAnalysisDialogComponent` | `—` | [`src/app/dialogs/opl-generative-ai-dialog/generative-ai-impact-analysis-dialog/generative-ai-impact-analysis.ts`](src/app/dialogs/opl-generative-ai-dialog/generative-ai-impact-analysis-dialog/generative-ai-impact-analysis.ts) | 118 |
| `GenerativeAIRequirementsExportDialogComponent` | `—` | [`src/app/dialogs/opl-generative-ai-dialog/generative-ai-requirements-export-dialog/generative-ai-requirements-export.ts`](src/app/dialogs/opl-generative-ai-dialog/generative-ai-requirements-export-dialog/generative-ai-requirements-export.ts) | 266 |
| `GenerativeAIUpdateKeyDialogComponent` | `—` | [`src/app/dialogs/opl-generative-ai-dialog/generative-ai-update-key-dialog/generative-ai-update-key.ts`](src/app/dialogs/opl-generative-ai-dialog/generative-ai-update-key-dialog/generative-ai-update-key.ts) | 106 |
| `GlobalErrorHandler` | `—` | [`src/app/error-handler/global-error-handler.ts`](src/app/error-handler/global-error-handler.ts) | 25 |
| `GraphBuilderAlgorithm` | `—` | [`src/app/services/dcm/algorithms/graph-builder.algorithm.ts`](src/app/services/dcm/algorithms/graph-builder.algorithm.ts) | 50 |
| `GraphDBService` | `—` | [`src/app/rappid-components/services/GraphDB/graphDB.service.ts`](src/app/rappid-components/services/GraphDB/graphDB.service.ts) | 1080 |
| `GraphInsightsComponent` | `—` | [`src/app/modules/Settings/graph-insights/graph-insights.component.ts`](src/app/modules/Settings/graph-insights/graph-insights.component.ts) | 1446 |
| `GraphInsightsInstructionsDialogComponent` | `—` | [`src/app/modules/Settings/graph-insights/graph-insights-instructions-dialog.component.ts`](src/app/modules/Settings/graph-insights/graph-insights-instructions-dialog.component.ts) | 500 |
| `GraphInsightsService` | `—` | [`src/app/modules/Settings/graph-insights/graph-insights.service.ts`](src/app/modules/Settings/graph-insights/graph-insights.service.ts) | 371 |
| `GraphService` | `—` | [`src/app/rappid-components/services/graph.service.ts`](src/app/rappid-components/services/graph.service.ts) | 1944 |
| `GreyItemsDialogComponent` | `—` | [`src/app/dialogs/grey-items-dialog/grey-items-dialog.component.ts`](src/app/dialogs/grey-items-dialog/grey-items-dialog.component.ts) | 438 |
| `GroupAdministrationComponent` | `—` | [`src/app/modules/Settings/group-mgmt/group-administration/group-administration.component.ts`](src/app/modules/Settings/group-mgmt/group-administration/group-administration.component.ts) | 518 |
| `GroupsService` | `—` | [`src/app/rappid-components/services/groups.service.ts`](src/app/rappid-components/services/groups.service.ts) | 225 |
| `HaloConfiguration` | `—` | [`src/app/models/DrawnPart/components/halo/halo-config.ts`](src/app/models/DrawnPart/components/halo/halo-config.ts) | 77 |
| `HeaderComponent` | `—` | [`src/app/modules/layout/header/header.component.ts`](src/app/modules/layout/header/header.component.ts) | 626 |
| `HeadlessRunnerComponent` | `—` | [`src/app/dialogs/headlessRunner-dialog/headlessRunner-dialog.component.ts`](src/app/dialogs/headlessRunner-dialog/headlessRunner-dialog.component.ts) | 187 |
| `HiddenAttributesModule` | `—` | [`src/app/models/hiddenAttributes/hidden-attributes-module.ts`](src/app/models/hiddenAttributes/hidden-attributes-module.ts) | 12 |
| `HideTypeCommand` | `—` | [`src/app/models/components/commands/hide-type-object.ts`](src/app/models/components/commands/hide-type-object.ts) | 41 |
| `HideValueAction` | `—` | [`src/app/models/components/commands/hide-type-object.ts`](src/app/models/components/commands/hide-type-object.ts) | 41 |
| `ImagesPoolContainer` | `—` | [`src/app/dialogs/images-pool-container/images-pool-container.ts`](src/app/dialogs/images-pool-container/images-pool-container.ts) | 72 |
| `ImagesPoolManagementComponent` | `—` | [`src/app/dialogs/images-pool-management/images-pool-management-component.ts`](src/app/dialogs/images-pool-management/images-pool-management-component.ts) | 458 |
| `IngProcessesNamesChecker` | `MethodologicalChecker` | [`src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts) | 28 |
| `InitRappidService` | `—` | [`src/app/rappid-components/services/init-rappid.service.ts`](src/app/rappid-components/services/init-rappid.service.ts) | 1350 |
| `InputNameDialogComponent` | `—` | [`src/app/dialogs/input-name-dialog/input-name-dialog.ts`](src/app/dialogs/input-name-dialog/input-name-dialog.ts) | 80 |
| `InstantiationLink` | `OpmFundamentalLink` | [`src/app/models/DrawnPart/Links/InstantiationLink.ts`](src/app/models/DrawnPart/Links/InstantiationLink.ts) | 35 |
| `InstrumentLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/InstrumentLink.ts`](src/app/models/DrawnPart/Links/InstrumentLink.ts) | 51 |
| `InstrumentWithAgentConsistency1` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `InstrumentWithAgentConsistency2` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `InvocationLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/InvocationLink.ts`](src/app/models/DrawnPart/Links/InvocationLink.ts) | 211 |
| `InzoomAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `InzoomCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `InzoomedContentChecker` | `MethodologicalChecker` | [`src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts) | 27 |
| `InzoomedProcessCannotConnectToIsSubProcess` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `InzoomedTree` | `—` | [`src/app/ImportOPX/OPX.Inzoomed_Tree.ts`](src/app/ImportOPX/OPX.Inzoomed_Tree.ts) | 197 |
| `JsonModel` | `—` | [`src/app/models/json.model.ts`](src/app/models/json.model.ts) | 612 |
| `KeysPipe` | `—` | [`src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts`](src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts) | 315 |
| `KeysPipe` | `—` | [`src/app/dialogs/opl-dialog/opl-dialog.component.ts`](src/app/dialogs/opl-dialog/opl-dialog.component.ts) | 604 |
| `LayoutModule` | `—` | [`src/app/modules/layout/layout.module.ts`](src/app/modules/layout/layout.module.ts) | 29 |
| `LegalConsumptionWarning` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `LinkModelElement` | `—` | [`src/app/models/json.model.ts`](src/app/models/json.model.ts) | 612 |
| `LinksDialogComponent` | `—` | [`src/app/dialogs/choose-link-dialog/Dialog.component.ts`](src/app/dialogs/choose-link-dialog/Dialog.component.ts) | 4270 |
| `LinksModel` | `—` | [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) | 1529 |
| `ListLogicalComponent` | `—` | [`src/app/modules/layout/main/list-logical/list-logical.component.ts`](src/app/modules/layout/main/list-logical/list-logical.component.ts) | 863 |
| `ListThingsComponent` | `—` | [`src/app/modules/Settings/list-things/list-things.component.ts`](src/app/modules/Settings/list-things/list-things.component.ts) | 62 |
| `LoadModelDialogComponent` | `—` | [`src/app/dialogs/load-model-dialog/load-model-dialog.component.ts`](src/app/dialogs/load-model-dialog/load-model-dialog.component.ts) | 3506 |
| `LogsDashboardComponent` | `—` | [`src/app/dialogs/logs-dashboard/logs-dashboard.component.ts`](src/app/dialogs/logs-dashboard/logs-dashboard.component.ts) | 402 |
| `LogsDashboardDialogComponent` | `—` | [`src/app/dialogs/logs-dashboard-dialog/logs-dashboard-dialog.component.ts`](src/app/dialogs/logs-dashboard-dialog/logs-dashboard-dialog.component.ts) | 117 |
| `LogSharingDialogComponent` | `—` | [`src/app/dialogs/log-sharing-dialog/log-sharing-dialog.component.ts`](src/app/dialogs/log-sharing-dialog/log-sharing-dialog.component.ts) | 56 |
| `MainComponent` | `—` | [`src/app/modules/layout/main/main.component.ts`](src/app/modules/layout/main/main.component.ts) | 668 |
| `MainLoginComponent` | `—` | [`src/app/modules/MainLogin.component.ts`](src/app/modules/MainLogin.component.ts) | 104 |
| `MaterialModule` | `—` | [`src/app/modules/shared/material.module.ts`](src/app/modules/shared/material.module.ts) | 28 |
| `MemberGrpComponent` | `—` | [`src/app/modules/Settings/group-mgmt/update-user-grp/member-grp/member-grp.component.ts`](src/app/modules/Settings/group-mgmt/update-user-grp/member-grp/member-grp.component.ts) | 67 |
| `MenuComponent` | `—` | [`src/app/modules/layout/header/menu/menu.component.ts`](src/app/modules/layout/header/menu/menu.component.ts) | 1263 |
| `MethodologicalChecker` | `—` | [`src/app/dialogs/methodological-checking-dialog/methodological-checker.ts`](src/app/dialogs/methodological-checking-dialog/methodological-checker.ts) | 29 |
| `MethodologicalCheckingDialog` | `—` | [`src/app/dialogs/methodological-checking-dialog/methodological-checking-dialog.ts`](src/app/dialogs/methodological-checking-dialog/methodological-checking-dialog.ts) | 185 |
| `MissingKnowledgeAnalysisComponent` | `—` | [`src/app/modules/Settings/missing-knowledge-analysis/missing-knowledge-analysis.component.ts`](src/app/modules/Settings/missing-knowledge-analysis/missing-knowledge-analysis.component.ts) | 3158 |
| `ModelAnalysisComponent` | `—` | [`src/app/modules/Settings/model-analysis/model-analysis.component.ts`](src/app/modules/Settings/model-analysis/model-analysis.component.ts) | 83 |
| `ModelAnalysisToolsComponent` | `—` | [`src/app/modules/Settings/model-analysis-tools/model-analysis-tools.component.ts`](src/app/modules/Settings/model-analysis-tools/model-analysis-tools.component.ts) | 253 |
| `ModelCompressionService` | `—` | [`src/app/rappid-components/services/model-compression.service.ts`](src/app/rappid-components/services/model-compression.service.ts) | 1164 |
| `ModelContext` | `—` | [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) | 349 |
| `ModelFromWizardParamsCreator` | `—` | [`src/app/models/ModelFromWizardParamsCreator.ts`](src/app/models/ModelFromWizardParamsCreator.ts) | 290 |
| `ModelObject` | `—` | [`src/app/rappid-components/services/storage/model-object.class.ts`](src/app/rappid-components/services/storage/model-object.class.ts) | 31 |
| `ModelService` | `—` | [`src/app/modules/app/model.service.ts`](src/app/modules/app/model.service.ts) | 191 |
| `ModelStorageInterface` | `—` | [`src/app/rappid-components/services/storage/model-storage.interface.ts`](src/app/rappid-components/services/storage/model-storage.interface.ts) | 21 |
| `ModelStorageService` | `—` | [`src/app/rappid-components/services/storage/model-storage.service.ts`](src/app/rappid-components/services/storage/model-storage.service.ts) | 105 |
| `ModelTitleValidator` | `—` | [`src/app/dialogs/load-model-dialog/name-validator.ts`](src/app/dialogs/load-model-dialog/name-validator.ts) | 16 |
| `MsalAuthDriver` | `—` | [`src/app/database/msalAuth.ts`](src/app/database/msalAuth.ts) | 82 |
| `MultiDeleteProgressComponent` | `—` | [`src/app/dialogs/multi-delete-progress/multi-delete-progress.component.ts`](src/app/dialogs/multi-delete-progress/multi-delete-progress.component.ts) | 184 |
| `multiInstancesDialog` | `—` | [`src/app/dialogs/multi-instances-dialog/multi-instances-dialog.ts`](src/app/dialogs/multi-instances-dialog/multi-instances-dialog.ts) | 667 |
| `MultiUpdateUserDialogComponent` | `—` | [`src/app/dialogs/multi-update-user-dialog/multi-update-user-dialog.component.ts`](src/app/dialogs/multi-update-user-dialog/multi-update-user-dialog.component.ts) | 472 |
| `NavigatorComponent` | `—` | [`src/app/modules/layout/opcloud-navigator/navigator.component.ts`](src/app/modules/layout/opcloud-navigator/navigator.component.ts) | 199 |
| `NewModelByWizardComponentComponent` | `—` | [`src/app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts`](src/app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts) | 1354 |
| `NewModelComponent` | `—` | [`src/app/dialogs/new-model-dialog/new-model-dialog.ts`](src/app/dialogs/new-model-dialog/new-model-dialog.ts) | 49 |
| `NlpModelAnalysisComponent` | `—` | [`src/app/modules/Settings/nlp-model-analysis/nlp-model-analysis.component.ts`](src/app/modules/Settings/nlp-model-analysis/nlp-model-analysis.component.ts) | 335 |
| `Node` | `—` | [`src/app/models/node.model.ts`](src/app/models/node.model.ts) | 42 |
| `NoopAnimationPlayer` | `—` | [`src/main.ts`](src/main.ts) | 2533 |
| `Note` | `OpmEntityRappid` | [`src/app/models/DrawnPart/Note.ts`](src/app/models/DrawnPart/Note.ts) | 380 |
| `NoteCell` | `OpmEntityRappid` | [`src/app/models/notes/note-cell.ts`](src/app/models/notes/note-cell.ts) | 121 |
| `NoteComponent` | `—` | [`src/app/models/notes/note/note.component.ts`](src/app/models/notes/note/note.component.ts) | 199 |
| `NoteData` | `—` | [`src/app/models/notes/note.ts`](src/app/models/notes/note.ts) | 80 |
| `NoteService` | `—` | [`src/app/models/notes/note.service.ts`](src/app/models/notes/note.service.ts) | 161 |
| `NoteType` | `—` | [`src/app/models/notes/note-type.ts`](src/app/models/notes/note-type.ts) | 34 |
| `NumericRange` | `—` | [`src/app/models/modules/attribute-validation/numeric-range.ts`](src/app/models/modules/attribute-validation/numeric-range.ts) | 191 |
| `ObjectAndStateCannotConnectToThemeselfs` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `ObjectCannotBeConnectedToItsStates` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `ObjectCantConnectToObjectWithProceduralLinks` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ObjectCommandsDecider` | `CommandsDecider` | [`src/app/models/components/commands/object-decider.ts`](src/app/models/components/commands/object-decider.ts) | 128 |
| `ObjectModelElement` | `—` | [`src/app/models/json.model.ts`](src/app/models/json.model.ts) | 612 |
| `ObjectNameAsSingularChecker` | `MethodologicalChecker` | [`src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts) | 29 |
| `ObjectToObject` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ObjectToProcess` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ObjectToState` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `OneUnidirectional` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `OnlyOneLevelOfInstantiation` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `OnlyOneLevelOfInstantiation2` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `OntologyApplier` | `—` | [`src/app/modules/Settings/OrgOntology/ontologyApplier.ts`](src/app/modules/Settings/OrgOntology/ontologyApplier.ts) | 77 |
| `OntologySuggestionDialog` | `—` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpcAppResolver` | `—` | [`src/app/database/resolvers/opc.resolver.ts`](src/app/database/resolvers/opc.resolver.ts) | 59 |
| `OpcLayoutModule` | `—` | [`src/app/modules/layout/opc.layout.module.ts`](src/app/modules/layout/opc.layout.module.ts) | 34 |
| `OPCloudManualComponent` | `—` | [`src/app/modules/Settings/OPCloudManual/opcloud-manual.component.ts`](src/app/modules/Settings/OPCloudManual/opcloud-manual.component.ts) | 68 |
| `OPCloudOrganizationSettingsComponent_org` | `—` | [`src/app/modules/Settings/OPCloud-Organization-Settings/OPCloud-Organization-Settings.component_org.ts`](src/app/modules/Settings/OPCloud-Organization-Settings/OPCloud-Organization-Settings.component_org.ts) | 2558 |
| `OPCloudPrivacyPolicyComponent` | `—` | [`src/app/modules/Settings/OPCloudPrivacyPolicy/opcloud-privacy-policy.component.ts`](src/app/modules/Settings/OPCloudPrivacyPolicy/opcloud-privacy-policy.component.ts) | 261 |
| `OpcloudSettingsComponent` | `—` | [`src/app/modules/Settings/OpCloudSettings/opcloud-settings.component.ts`](src/app/modules/Settings/OpCloudSettings/opcloud-settings.component.ts) | 2465 |
| `OpcModule` | `—` | [`src/app/modules/opc.module.ts`](src/app/modules/opc.module.ts) | 76 |
| `OpcRoutingModule` | `—` | [`src/app/modules/app-routing.module.ts`](src/app/modules/app-routing.module.ts) | 243 |
| `OpcVersionService` | `AbstractVersionService` | [`src/app/rappid-components/services/init/opc.init.service.ts`](src/app/rappid-components/services/init/opc.init.service.ts) | 43 |
| `OPDHierarchyComponent` | `—` | [`src/app/opd-hierarchy/opd-hierarchy.component.ts`](src/app/opd-hierarchy/opd-hierarchy.component.ts) | 993 |
| `OpdtreeModelSettingsComponent` | `—` | [`src/app/dialogs/opdtree-model-settings/opdtree-model-settings.component.ts`](src/app/dialogs/opdtree-model-settings/opdtree-model-settings.component.ts) | 76 |
| `OpenSubModelInNewTabTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `OplConfig` | `—` | [`src/app/models/modules/attribute-validation/validation-module.ts`](src/app/models/modules/attribute-validation/validation-module.ts) | 10388 |
| `OplContainerComponent` | `—` | [`src/app/modules/layout/opl-container/opl-container.component.ts`](src/app/modules/layout/opl-container/opl-container.component.ts) | 540 |
| `OplDefaultConfig` | `—` | [`src/app/models/modules/attribute-validation/validation-module.ts`](src/app/models/modules/attribute-validation/validation-module.ts) | 10388 |
| `OplDialogComponent` | `—` | [`src/app/dialogs/opl-dialog/opl-dialog.component.ts`](src/app/dialogs/opl-dialog/opl-dialog.component.ts) | 604 |
| `OplDialogComponentSysAdmin` | `—` | [`src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts`](src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts) | 315 |
| `OplEdxConfig` | `—` | [`src/app/models/modules/attribute-validation/validation-module.ts`](src/app/models/modules/attribute-validation/validation-module.ts) | 10388 |
| `OPLGenerativeAIDialogComponent` | `—` | [`src/app/dialogs/opl-generative-ai-dialog/opl-generative-ai.ts`](src/app/dialogs/opl-generative-ai-dialog/opl-generative-ai.ts) | 128 |
| `OplService` | `—` | [`src/app/models/modules/attribute-validation/validation-module.ts`](src/app/models/modules/attribute-validation/validation-module.ts) | 10388 |
| `OplSettingsComponent` | `—` | [`src/app/modules/Settings/OplSettings/opl-settings.component.ts`](src/app/modules/Settings/OplSettings/opl-settings.component.ts) | 502 |
| `OpmDefaultLink` | `OpmLinkRappid` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmEllipsis` | `OpmEntity` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmEntity` | `OpmEntityRappid` | [`src/app/models/DrawnPart/OpmEntity.ts`](src/app/models/DrawnPart/OpmEntity.ts) | 1737 |
| `OpmEntityRappid` | `joint.dia.Element.extend` | [`src/app/models/DrawnPart/OpmEntityRappid.ts`](src/app/models/DrawnPart/OpmEntityRappid.ts) | 122 |
| `OpmFundamentalLink` | `OpmStructuralLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmFundamentalLink` | `OpmStructuralLink` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmFundamentalRelation` | `OpmStructuralRelation` | [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) | 5469 |
| `OpmGraphNormalizerService` | `—` | [`src/app/modules/Settings/graph-insights/opm-graph-normalizer.service.ts`](src/app/modules/Settings/graph-insights/opm-graph-normalizer.service.ts) | 135 |
| `OpmGraphologyBuilderService` | `—` | [`src/app/modules/Settings/graph-insights/opm-graphology-builder.service.ts`](src/app/modules/Settings/graph-insights/opm-graphology-builder.service.ts) | 46 |
| `OpmImage` | `joint.shapes.devs.Model.extend` | [`src/app/models/OpmImage.ts`](src/app/models/OpmImage.ts) | 81 |
| `OpmImageLink` | `joint.shapes.devs.Link.extend` | [`src/app/models/OpmImageLink.ts`](src/app/models/OpmImageLink.ts) | 48 |
| `OpmLink` | `OpmVisualElement` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmLinkRappid` | `configuration_rappidEnviromentFunctionality_shared` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmLogicalElement` | `—` | [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) | 5469 |
| `OpmLogicalEntity` | `OpmLogicalElement` | [`src/app/models/LogicalPart/OpmLogicalEntity.ts`](src/app/models/LogicalPart/OpmLogicalEntity.ts) | 279 |
| `OpmLogicalObject` | `OpmLogicalThing` | [`src/app/models/LogicalPart/OpmLogicalObject.ts`](src/app/models/LogicalPart/OpmLogicalObject.ts) | 690 |
| `OpmLogicalProcess` | `OpmLogicalThing` | [`src/app/models/LogicalPart/OpmLogicalObject.ts`](src/app/models/LogicalPart/OpmLogicalObject.ts) | 690 |
| `OpmLogicalState` | `OpmLogicalEntity` | [`src/app/models/LogicalPart/OpmLogicalState.ts`](src/app/models/LogicalPart/OpmLogicalState.ts) | 232 |
| `OpmLogicalStateEllipsis` | `—` | [`src/app/models/LogicalPart/OpmLogicalState.ts`](src/app/models/LogicalPart/OpmLogicalState.ts) | 232 |
| `OpmLogicalThing` | `OpmLogicalEntity` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmModel` | `BasicOpmModel` | [`src/app/models/OpmModel.ts`](src/app/models/OpmModel.ts) | 1956 |
| `OpmModelComparisonService` | `—` | [`src/app/modules/app/opm-model-comparison.service.ts`](src/app/modules/app/opm-model-comparison.service.ts) | 259 |
| `OpmModelMetaData` | `—` | [`src/app/models/OpmModelMetaData.ts`](src/app/models/OpmModelMetaData.ts) | 116 |
| `OpmObject` | `OpmThing` | [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) | 5469 |
| `OpmOpd` | `—` | [`src/app/models/OpmOpd.ts`](src/app/models/OpmOpd.ts) | 452 |
| `OpmProceduralLink` | `OpmDefaultLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmProceduralLink` | `OpmLink` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmProceduralRelation` | `OpmRelation` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmProcess` | `OpmThing` | [`src/app/models/DrawnPart/OpmProcess.ts`](src/app/models/DrawnPart/OpmProcess.ts) | 2403 |
| `opmQueryDialogComponent` | `—` | [`src/app/dialogs/opmQuery-dialog/opmQuery-dialog.ts`](src/app/dialogs/opmQuery-dialog/opmQuery-dialog.ts) | 421 |
| `OpmRdfService` | `—` | [`src/app/modules/app/opm-rdf.service.ts`](src/app/modules/app/opm-rdf.service.ts) | 403 |
| `OpmRelation` | `OpmLogicalElement` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmSemifoldedFundamental` | `configuration_rappidEnviromentFunctionality_shared` | [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) | 5469 |
| `OpmState` | `OpmEntity` | [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) | 5469 |
| `OpmStereotype` | `—` | [`src/app/models/OpmStereotype.ts`](src/app/models/OpmStereotype.ts) | 146 |
| `OpmStructuralLink` | `OpmDefaultLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmStructuralLink` | `OpmLink` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmStructuralRelation` | `OpmRelation` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmTaggedLink` | `OpmStructuralLink` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `OpmTaggedLink` | `OpmStructuralLink` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmTaggedRelation` | `OpmStructuralRelation` | [`src/app/models/LogicalPart/OpmTaggedRelation.ts`](src/app/models/LogicalPart/OpmTaggedRelation.ts) | 48 |
| `OpmThing` | `OpmEntity` | [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) | 5469 |
| `OpmVisualElement` | `—` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmVisualEllipsis` | `—` | [`src/app/models/VisualPart/OpmVisualEllipsis.ts`](src/app/models/VisualPart/OpmVisualEllipsis.ts) | 53 |
| `OpmVisualEntity` | `OpmVisualElement` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `OpmVisualObject` | `OpmVisualThing` | [`src/app/models/VisualPart/OpmVisualObject.ts`](src/app/models/VisualPart/OpmVisualObject.ts) | 778 |
| `OpmVisualProcess` | `OpmVisualThing` | [`src/app/models/VisualPart/OpmVisualProcess.ts`](src/app/models/VisualPart/OpmVisualProcess.ts) | 182 |
| `OpmVisualState` | `OpmVisualEntity` | [`src/app/models/VisualPart/OpmVisualState.ts`](src/app/models/VisualPart/OpmVisualState.ts) | 225 |
| `OpmVisualThing` | `OpmVisualEntity` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `OPXModel` | `—` | [`src/app/ImportOPX/OPX.Elements_Loaders.ts`](src/app/ImportOPX/OPX.Elements_Loaders.ts) | 397 |
| `OrgAdminComponent` | `—` | [`src/app/modules/Settings/organization-mgmt/org-admin/org-admin.component.ts`](src/app/modules/Settings/organization-mgmt/org-admin/org-admin.component.ts) | 369 |
| `OrganizationAnalyticsComponent` | `—` | [`src/app/modules/Settings/organization-analytics/organization-analytics.component.ts`](src/app/modules/Settings/organization-analytics/organization-analytics.component.ts) | 946 |
| `OrganizationOntologyComponent` | `—` | [`src/app/modules/Settings/OrgOntology/Organization-Ontology.component.ts`](src/app/modules/Settings/OrgOntology/Organization-Ontology.component.ts) | 206 |
| `OrganizationService` | `—` | [`src/app/rappid-components/services/organization.service.ts`](src/app/rappid-components/services/organization.service.ts) | 240 |
| `OvertimeExceptionLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/OvertimeExceptionLink.ts`](src/app/models/DrawnPart/Links/OvertimeExceptionLink.ts) | 36 |
| `OvertimeUndertimeExceptionLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/OvertimeUndertimeExceptionLink.ts`](src/app/models/DrawnPart/Links/OvertimeUndertimeExceptionLink.ts) | 29 |
| `paretoFrontierDialog` | `—` | [`src/app/dialogs/pareto-frontier-dialog/pareto-frontier-dialog.ts`](src/app/dialogs/pareto-frontier-dialog/pareto-frontier-dialog.ts) | 399 |
| `PartInvocation` | `joint.shapes.standard.Link.define` | [`src/app/models/DrawnPart/Links/SelfInvocationLink.ts`](src/app/models/DrawnPart/Links/SelfInvocationLink.ts) | 330 |
| `PartUnfoldContentChecker` | `MethodologicalChecker` | [`src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts) | 27 |
| `PenManager` | `—` | [`src/app/rappid-components/services/penManager.ts`](src/app/rappid-components/services/penManager.ts) | 34 |
| `PermissionsService` | `—` | [`src/app/rappid-components/services/permissions/permissions.service.ts`](src/app/rappid-components/services/permissions/permissions.service.ts) | 187 |
| `PopupMessageContentComponent` | `—` | [`src/app/dialogs/popup-message-content/popup-message-content.component.ts`](src/app/dialogs/popup-message-content/popup-message-content.component.ts) | 185 |
| `PopupMessagesComponent` | `—` | [`src/app/modules/Settings/PopupMessages/popup-messages.component.ts`](src/app/modules/Settings/PopupMessages/popup-messages.component.ts) | 430 |
| `PopupViewsOrConfirmsComponent` | `—` | [`src/app/dialogs/popup-views-or-confirms/popup-views-or-confirms.component.ts`](src/app/dialogs/popup-views-or-confirms/popup-views-or-confirms.component.ts) | 164 |
| `Position` | `—` | [`src/app/ImportOPX/OPX.API.ts`](src/app/ImportOPX/OPX.API.ts) | 736 |
| `PreventAggregationBetweenInformaticalToPhysical` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProceduralConsistency` | `ConsistionalRule` | [`src/app/models/consistency/consistional.rules.ts`](src/app/models/consistency/consistional.rules.ts) | 145 |
| `ProcessCannotBeConnectedToitselfWithProceduralLinks` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProcessCommandsDecider` | `CommandsDecider` | [`src/app/models/components/commands/process-decider.ts`](src/app/models/components/commands/process-decider.ts) | 88 |
| `ProcessComputational` | `—` | [`src/app/models/LogicalPart/OpmLogicalObject.ts`](src/app/models/LogicalPart/OpmLogicalObject.ts) | 690 |
| `ProcessToObject` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProcessToProcess` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProcessToProcessExceptionsOvertime` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProcessToProcessExceptionsUndertime` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProcessToProcessExceptionsUndertimeOvertime` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProcessToState` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `ProgressSpinner` | `—` | [`src/app/dialogs/Spinner/Progress_Spinner.ts`](src/app/dialogs/Spinner/Progress_Spinner.ts) | 31 |
| `PythonCodeEditorDialog` | `—` | [`src/app/dialogs/python-code-editor-dialog/python-code-editor-dialog.ts`](src/app/dialogs/python-code-editor-dialog/python-code-editor-dialog.ts) | 252 |
| `RangeValidationAccess` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `RappidModule` | `—` | [`src/app/modules/rappid.module.ts`](src/app/modules/rappid.module.ts) | 27 |
| `RappidOplComponent` | `—` | [`src/app/rappid-components/rappid-opl/rappid-opl.component.ts`](src/app/rappid-components/rappid-opl/rappid-opl.component.ts) | 558 |
| `RappidPaperComponent` | `—` | [`src/app/rappid-components/rappid-paper/rappid-paper.component.ts`](src/app/rappid-components/rappid-paper/rappid-paper.component.ts) | 52 |
| `RappidToolbarComponent` | `ToolbarComponent` | [`src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts`](src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts) | 416 |
| `Rate` | `—` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `RefinedThingStrokeWidth` | `—` | [`src/app/models/json.model.ts`](src/app/models/json.model.ts) | 612 |
| `RemoveAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `RemoveCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `RemoveComputationAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `RemoveComputationCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `RemoveLocator` | `—` | [`src/app/dialogs/remove-locator/remove-locator.ts`](src/app/dialogs/remove-locator/remove-locator.ts) | 172 |
| `RemoveLocatorLinks` | `—` | [`src/app/dialogs/remove-locator-links/remove-locator-links.ts`](src/app/dialogs/remove-locator-links/remove-locator-links.ts) | 295 |
| `RemoveOpdTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `RemoveOperationComponent` | `—` | [`src/app/dialogs/remove-operation-selection/remove-operation.ts`](src/app/dialogs/remove-operation-selection/remove-operation.ts) | 314 |
| `RemoveUserComponent` | `—` | [`src/app/dialogs/remove-user/remove-user.component.ts`](src/app/dialogs/remove-user/remove-user.component.ts) | 330 |
| `RenameDialogComponent` | `—` | [`src/app/dialogs/load-model-dialog/sub-dialogs/rename/rename-dialog.component.ts`](src/app/dialogs/load-model-dialog/sub-dialogs/rename/rename-dialog.component.ts) | 101 |
| `RenameOpdTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `RenameSubModelTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `RendererAnimationPlayer` | `—` | [`src/main.ts`](src/main.ts) | 2533 |
| `RequirementDiagramConverter` | `BaseDiagramConverter` | [`src/app/services/sysml-converters/requirement-diagram.converter.ts`](src/app/services/sysml-converters/requirement-diagram.converter.ts) | 227 |
| `ResetInitialPasswordComponent` | `—` | [`src/app/dialogs/reset-initial-password/reset-initial-password.component.ts`](src/app/dialogs/reset-initial-password/reset-initial-password.component.ts) | 79 |
| `ResizeBarComponent` | `—` | [`src/app/modules/shared/resize-bar/resize-bar.component.ts`](src/app/modules/shared/resize-bar/resize-bar.component.ts) | 71 |
| `ResizeBarDirective` | `—` | [`src/app/modules/shared/resize-bar/resize-bar.directive.ts`](src/app/modules/shared/resize-bar/resize-bar.directive.ts) | 127 |
| `ResultLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/ResultLink.ts`](src/app/models/DrawnPart/Links/ResultLink.ts) | 110 |
| `RoleExtractionAlgorithm` | `—` | [`src/app/services/dcm/algorithms/role-extraction.algorithm.ts`](src/app/services/dcm/algorithms/role-extraction.algorithm.ts) | 103 |
| `SatisfiedRequirement` | `—` | [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) | 1529 |
| `SatisfiedRequirementSet` | `—` | [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) | 1529 |
| `SatisfiedRequirementSetModule` | `—` | [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) | 1529 |
| `SavePdfComponent` | `—` | [`src/app/dialogs/savePdf-dialog/savePdf.ts`](src/app/dialogs/savePdf-dialog/savePdf.ts) | 1266 |
| `SaveScreenshotComponent` | `—` | [`src/app/dialogs/saveScreenshot-dialog/saveScreenshot.ts`](src/app/dialogs/saveScreenshot-dialog/saveScreenshot.ts) | 240 |
| `SaveURLComponent` | `—` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `ScopeSubgraphAlgorithm` | `—` | [`src/app/services/dcm/algorithms/scope-subgraph.algorithm.ts`](src/app/services/dcm/algorithms/scope-subgraph.algorithm.ts) | 96 |
| `SearchItemsDialogComponent` | `—` | [`src/app/dialogs/search-items-dialog/search-items-dialog.component.ts`](src/app/dialogs/search-items-dialog/search-items-dialog.component.ts) | 412 |
| `SelectOpdsTreeDialog` | `—` | [`src/app/dialogs/select-opds-tree-dialog/select-opds-tree-dialog.ts`](src/app/dialogs/select-opds-tree-dialog/select-opds-tree-dialog.ts) | 1133 |
| `SelfInvocationLink` | `OpmDefaultLink` | [`src/app/models/DrawnPart/Links/SelfInvocationLink.ts`](src/app/models/DrawnPart/Links/SelfInvocationLink.ts) | 330 |
| `SelfInvocationLinkInZoom` | `InvocationLink` | [`src/app/models/DrawnPart/Links/SelfInvocationLink.ts`](src/app/models/DrawnPart/Links/SelfInvocationLink.ts) | 330 |
| `Semifoldinglinks` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `SendEmailComponent` | `—` | [`src/app/modules/Settings/organization-mgmt/send-email/send-email.component.ts`](src/app/modules/Settings/organization-mgmt/send-email/send-email.component.ts) | 343 |
| `SentrySynthesisAlgorithm` | `—` | [`src/app/services/dcm/algorithms/sentry-synthesis.algorithm.ts`](src/app/services/dcm/algorithms/sentry-synthesis.algorithm.ts) | 408 |
| `SequenceDiagramConverter` | `BaseDiagramConverter` | [`src/app/services/sysml-converters/sequence-diagram.converter.ts`](src/app/services/sysml-converters/sequence-diagram.converter.ts) | 653 |
| `ServerAuthDriver` | `—` | [`src/app/database/serverAuthDriver.ts`](src/app/database/serverAuthDriver.ts) | 72 |
| `ServerDatabaseDrive` | `—` | [`src/app/database/ServerDatabaseDrive.ts`](src/app/database/ServerDatabaseDrive.ts) | 1196 |
| `ServerFlatteningService` | `—` | [`src/app/rappid-components/services/server-flattening.service.ts`](src/app/rappid-components/services/server-flattening.service.ts) | 71 |
| `Set` | `—` | [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) | 1529 |
| `Set` | `—` | [`src/app/models/consistency/entities.set.ts`](src/app/models/consistency/entities.set.ts) | 16 |
| `Set2AuthFactorsDialog` | `—` | [`src/app/dialogs/set-2-auth-factors/set-2-auth-factors-dialog.ts`](src/app/dialogs/set-2-auth-factors/set-2-auth-factors-dialog.ts) | 557 |
| `SetAdminUserListComponent` | `—` | [`src/app/dialogs/set-admin-user-list/set-admin-user-list.component.ts`](src/app/dialogs/set-admin-user-list/set-admin-user-list.component.ts) | 946 |
| `SetComputationAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `SetComputationCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `SetProcessTimeDurationAction` | `—` | [`src/app/models/components/commands/set-process-time-duration.ts`](src/app/models/components/commands/set-process-time-duration.ts) | 47 |
| `SetProcessTimeDurationCommand` | `—` | [`src/app/models/components/commands/set-process-time-duration.ts`](src/app/models/components/commands/set-process-time-duration.ts) | 47 |
| `SetStateTimeDurationAction` | `—` | [`src/app/models/components/commands/set-state-time-duration.ts`](src/app/models/components/commands/set-state-time-duration.ts) | 46 |
| `SetStateTimeDurationCommand` | `—` | [`src/app/models/components/commands/set-state-time-duration.ts`](src/app/models/components/commands/set-state-time-duration.ts) | 46 |
| `SettingsComponent` | `—` | [`src/app/modules/Settings/settings.component.ts`](src/app/modules/Settings/settings.component.ts) | 198 |
| `SettingsHome` | `—` | [`src/app/modules/Settings/settings-home/settings-home.ts`](src/app/modules/Settings/settings-home/settings-home.ts) | 28 |
| `SettingsNewOrg` | `—` | [`src/app/modules/Settings/organization-mgmt/new-org/new-org.component.ts`](src/app/modules/Settings/organization-mgmt/new-org/new-org.component.ts) | 95 |
| `SettingsNewUser` | `—` | [`src/app/modules/Settings/user-mgmt/new-user/new-user.component.ts`](src/app/modules/Settings/user-mgmt/new-user/new-user.component.ts) | 432 |
| `SettingsOplGroupComponent` | `—` | [`src/app/modules/Settings/settings-opl-group.component.ts`](src/app/modules/Settings/settings-opl-group.component.ts) | 30 |
| `SettingsUnderConstruction` | `—` | [`src/app/modules/Settings/settings.under_constractions.ts`](src/app/modules/Settings/settings.under_constractions.ts) | 30 |
| `SharedModule` | `—` | [`src/app/modules/shared/shared.module.ts`](src/app/modules/shared/shared.module.ts) | 29 |
| `SignInComponent` | `—` | [`src/app/modules/layout/header/sign-in/sign-in.component.ts`](src/app/modules/layout/header/sign-in/sign-in.component.ts) | 270 |
| `simulatedElementParams` | `—` | [`src/app/models/LogicalPart/components/SimulationModule.ts`](src/app/models/LogicalPart/components/SimulationModule.ts) | 173 |
| `SimulationComponent` | `—` | [`src/app/dialogs/Simulation/Simulation.ts`](src/app/dialogs/Simulation/Simulation.ts) | 255 |
| `SimulationElementComponent` | `—` | [`src/app/dialogs/simulationElement/SimulationElement.ts`](src/app/dialogs/simulationElement/SimulationElement.ts) | 634 |
| `SimulationModule` | `—` | [`src/app/models/LogicalPart/components/SimulationModule.ts`](src/app/models/LogicalPart/components/SimulationModule.ts) | 173 |
| `SingleInstrumentFromStates` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `SingleInstrumentFromStates2` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `SourceAndTargetOnSameOPD` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `SSOSettingsComponent` | `—` | [`src/app/modules/Settings/organization-mgmt/sso/sso-settings.ts`](src/app/modules/Settings/organization-mgmt/sso/sso-settings.ts) | 377 |
| `StageTaskDeterminationAlgorithm` | `—` | [`src/app/services/dcm/algorithms/stage-task-determination.algorithm.ts`](src/app/services/dcm/algorithms/stage-task-determination.algorithm.ts) | 334 |
| `StateCannotConnectToFather` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `StateCannotConnectToFatherStates` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `StateCommandsDecider` | `CommandsDecider` | [`src/app/models/components/commands/state-decider.ts`](src/app/models/components/commands/state-decider.ts) | 54 |
| `StateMachineDiagramConverter` | `BaseDiagramConverter` | [`src/app/services/sysml-converters/state-machine-diagram.converter.ts`](src/app/services/sysml-converters/state-machine-diagram.converter.ts) | 311 |
| `StateToObject` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `StateToProcess` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `StateToState` | `BehaviouralRule` | [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) | 1232 |
| `StereotypeContext` | `—` | [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) | 349 |
| `StereotypeManager` | `—` | [`src/app/models/stereotypeManager.ts`](src/app/models/stereotypeManager.ts) | 30 |
| `StereotypeModule` | `—` | [`src/app/models/LogicalPart/components/StereotypeModule.ts`](src/app/models/LogicalPart/components/StereotypeModule.ts) | 51 |
| `StereotypesDialogComponent` | `—` | [`src/app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts`](src/app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts) | 605 |
| `StorageService` | `—` | [`src/app/rappid-components/services/storage.service.ts`](src/app/rappid-components/services/storage.service.ts) | 407 |
| `StringRange` | `—` | [`src/app/models/modules/attribute-validation/string-range.ts`](src/app/models/modules/attribute-validation/string-range.ts) | 103 |
| `StructuralRule` | `—` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `StyleAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `StyleCopyingDialogComponent` | `—` | [`src/app/dialogs/styleCopyingDialog/styleCopyingDialog.component.ts`](src/app/dialogs/styleCopyingDialog/styleCopyingDialog.component.ts) | 125 |
| `StylingCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `SubModelCreator` | `—` | [`src/app/models/SubModelCreator.ts`](src/app/models/SubModelCreator.ts) | 239 |
| `SubModelNameComponent` | `—` | [`src/app/dialogs/submodel-name-dialog/submodel-name-dialog.ts`](src/app/dialogs/submodel-name-dialog/submodel-name-dialog.ts) | 137 |
| `SuppressAction` | `—` | [`src/app/models/components/commands/suppress.ts`](src/app/models/components/commands/suppress.ts) | 44 |
| `SuppressCommand` | `—` | [`src/app/models/components/commands/suppress.ts`](src/app/models/components/commands/suppress.ts) | 44 |
| `SuppressStateCommand` | `—` | [`src/app/models/components/commands/suppress-state.ts`](src/app/models/components/commands/suppress-state.ts) | 45 |
| `SupressStateCommandAction` | `—` | [`src/app/models/components/commands/suppress-state.ts`](src/app/models/components/commands/suppress-state.ts) | 45 |
| `SupressValueStatesAction` | `—` | [`src/app/models/components/commands/supress-value-object-states.ts`](src/app/models/components/commands/supress-value-object-states.ts) | 41 |
| `SupressValueStatesCommand` | `—` | [`src/app/models/components/commands/supress-value-object-states.ts`](src/app/models/components/commands/supress-value-object-states.ts) | 41 |
| `SysMLXmiGeneratorService` | `—` | [`src/app/services/sysml-xmi-generator.service.ts`](src/app/services/sysml-xmi-generator.service.ts) | 1041 |
| `SystemicProcessesMainFunctionChecker` | `MethodologicalChecker` | [`src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts) | 260 |
| `TabsManager` | `—` | [`src/app/modules/app/tabsService.ts`](src/app/modules/app/tabsService.ts) | 131 |
| `TabTitlePipe` | `—` | [`src/app/pipes/tab-title-pipe.pipe.ts`](src/app/pipes/tab-title-pipe.pipe.ts) | 21 |
| `TargetElementData` | `—` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `TemplatesComponent` | `—` | [`src/app/dialogs/templates-import/templates-import.ts`](src/app/dialogs/templates-import/templates-import.ts) | 126 |
| `TextBlock` | `TextBlockClass` | [`src/app/models/DrawnPart/TextBlock.ts`](src/app/models/DrawnPart/TextBlock.ts) | 51 |
| `TextBlockClass` | `joint.shapes.standard.TextBlock` | [`src/app/models/DrawnPart/TextBlockClass.ts`](src/app/models/DrawnPart/TextBlockClass.ts) | 18 |
| `TextModule` | `—` | [`src/app/models/DrawnPart/Note.ts`](src/app/models/DrawnPart/Note.ts) | 380 |
| `ThingCannotConnectToFather` | `StructuralRule` | [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) | 299 |
| `TimeDurationModule` | `—` | [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) | 2324 |
| `TitleModule` | `—` | [`src/app/models/DrawnPart/Note.ts`](src/app/models/DrawnPart/Note.ts) | 380 |
| `ToggleAffiliationAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ToggleAffiliationCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ToggleEssenceAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ToggleEssenceCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ToggleOPDsNamesTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `ToggleTextAutoFormatAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ToggleTextAutoFormatCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `ToolbarComponent` | `—` | [`src/app/rappid-components/rappid-toolbar/toolbar.component.ts`](src/app/rappid-components/rappid-toolbar/toolbar.component.ts) | 15 |
| `TraceExporterService` | `—` | [`src/app/services/dcm/exporters/trace-exporter.service.ts`](src/app/services/dcm/exporters/trace-exporter.service.ts) | 109 |
| `TransformingProcessChecker` | `MethodologicalChecker` | [`src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts) | 43 |
| `TreeParser` | `—` | [`src/app/dialogs/treeParser.ts`](src/app/dialogs/treeParser.ts) | 81 |
| `TreeViewService` | `—` | [`src/app/rappid-components/services/tree-view.service.ts`](src/app/rappid-components/services/tree-view.service.ts) | 271 |
| `TriangleClass` | `configuration_rappidEnviromentFunctionality_shared` | [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) | 6261 |
| `UIArrangement` | `—` | [`src/app/models/uiArrangement.model.ts`](src/app/models/uiArrangement.model.ts) | 287 |
| `UndertimeExceptionLink` | `OpmProceduralLink` | [`src/app/models/DrawnPart/Links/UndertimeExceptionLink.ts`](src/app/models/DrawnPart/Links/UndertimeExceptionLink.ts) | 29 |
| `UndoRedoOperation` | `—` | [`src/app/models/UndoRedoOperation.ts`](src/app/models/UndoRedoOperation.ts) | 109 |
| `UnfoldAction` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `UnfoldCommand` | `—` | [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) | 1946 |
| `UnfoldedTree` | `—` | [`src/app/ImportOPX/OPX.Unfolded_Tree.ts`](src/app/ImportOPX/OPX.Unfolded_Tree.ts) | 194 |
| `UnidirectionalTaggedLink` | `OpmTaggedLink` | [`src/app/models/DrawnPart/Links/UnidirectionalTaggedLink.ts`](src/app/models/DrawnPart/Links/UnidirectionalTaggedLink.ts) | 391 |
| `UnitsTextModule` | `—` | [`src/app/models/LogicalPart/components/units-text-module.ts`](src/app/models/LogicalPart/components/units-text-module.ts) | 32 |
| `UpdateComputationalAction` | `—` | [`src/app/models/components/commands/updateComputationalProcess.ts`](src/app/models/components/commands/updateComputationalProcess.ts) | 42 |
| `UpdateComputationCommand` | `—` | [`src/app/models/components/commands/updateComputationalProcess.ts`](src/app/models/components/commands/updateComputationalProcess.ts) | 42 |
| `UpdateRequirementViewTreeAction` | `—` | [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) | 199 |
| `UpdateUserDialogComponent` | `—` | [`src/app/dialogs/update-user-dialog/update-user-dialog.component.ts`](src/app/dialogs/update-user-dialog/update-user-dialog.component.ts) | 498 |
| `UploadFile` | `—` | [`src/app/dialogs/FileUploader/FileUploader.ts`](src/app/dialogs/FileUploader/FileUploader.ts) | 278 |
| `UrlsUtils` | `—` | [`src/app/models/DrawnPart/UrlsUtils.ts`](src/app/models/DrawnPart/UrlsUtils.ts) | 28 |
| `UseCaseDiagramConverter` | `BaseDiagramConverter` | [`src/app/services/sysml-converters/use-case-diagram.converter.ts`](src/app/services/sysml-converters/use-case-diagram.converter.ts) | 336 |
| `UserAgreementComponent` | `—` | [`src/app/dialogs/UserAgreement/user-agreement.component.ts`](src/app/dialogs/UserAgreement/user-agreement.component.ts) | 281 |
| `UserDetailsComponent` | `—` | [`src/app/modules/Settings/user-mgmt/update-user-details/update-user-details.component.ts`](src/app/modules/Settings/user-mgmt/update-user-details/update-user-details.component.ts) | 230 |
| `UserGroupsComponent` | `—` | [`src/app/modules/Settings/group-mgmt/update-user-grp/update-user-grp.component.ts`](src/app/modules/Settings/group-mgmt/update-user-grp/update-user-grp.component.ts) | 78 |
| `UserInputCommand` | `—` | [`src/app/models/components/commands/user-input-command.ts`](src/app/models/components/commands/user-input-command.ts) | 60 |
| `UserInputCommandAction` | `—` | [`src/app/models/components/commands/user-input-command.ts`](src/app/models/components/commands/user-input-command.ts) | 60 |
| `UserService` | `—` | [`src/app/rappid-components/services/user.service.ts`](src/app/rappid-components/services/user.service.ts) | 476 |
| `UserStatusComponent` | `—` | [`src/app/modules/layout/header/user-status/user-status.component.ts`](src/app/modules/layout/header/user-status/user-status.component.ts) | 220 |
| `ValidationModule` | `—` | [`src/app/models/modules/attribute-validation/validation-module.ts`](src/app/models/modules/attribute-validation/validation-module.ts) | 10388 |
| `ValidationSettingsComponent` | `—` | [`src/app/dialogs/validation-settings/validation-settings.ts`](src/app/dialogs/validation-settings/validation-settings.ts) | 145 |
| `VisualObjectModelElement` | `—` | [`src/app/models/json.model.ts`](src/app/models/json.model.ts) | 612 |

## Por categoría

### Modelo (núcleo) (17)

- [`src/app/models/BasicOpmModel.ts`](src/app/models/BasicOpmModel.ts) — BasicOpmModel
- [`src/app/models/ModelFromWizardParamsCreator.ts`](src/app/models/ModelFromWizardParamsCreator.ts) — ModelFromWizardParamsCreator
- [`src/app/models/OpmImage.ts`](src/app/models/OpmImage.ts) — OpmImage
- [`src/app/models/OpmImageLink.ts`](src/app/models/OpmImageLink.ts) — OpmImageLink
- [`src/app/models/OpmModel.ts`](src/app/models/OpmModel.ts) — OpmModel
- [`src/app/models/OpmModelMetaData.ts`](src/app/models/OpmModelMetaData.ts) — OpmModelMetaData
- [`src/app/models/OpmOpd.ts`](src/app/models/OpmOpd.ts) — OpmOpd
- [`src/app/models/OpmStereotype.ts`](src/app/models/OpmStereotype.ts) — OpmStereotype
- [`src/app/models/SubModelCreator.ts`](src/app/models/SubModelCreator.ts) — SubModelCreator
- [`src/app/models/UndoRedoOperation.ts`](src/app/models/UndoRedoOperation.ts) — UndoRedoOperation
- [`src/app/models/complexity.model.ts`](src/app/models/complexity.model.ts) — Complexity
- [`src/app/models/exampleStereotype.ts`](src/app/models/exampleStereotype.ts) — (sin símbolos top-level)
- [`src/app/models/json.model.ts`](src/app/models/json.model.ts) — JsonModel, AvoidEmptyName, RefinedThingStrokeWidth, ObjectModelElement, VisualObjectModelElement, LinkModelElement
- [`src/app/models/logical.factory.ts`](src/app/models/logical.factory.ts) — logicalFactoryInsertCurrentOPD, logicalFactory
- [`src/app/models/node.model.ts`](src/app/models/node.model.ts) — Node
- [`src/app/models/stereotypeManager.ts`](src/app/models/stereotypeManager.ts) — StereotypeManager
- [`src/app/models/uiArrangement.model.ts`](src/app/models/uiArrangement.model.ts) — UIArrangement

### Modelo lógico (LogicalPart) (12)

- [`src/app/models/LogicalPart/LogicalTextModule.ts`](src/app/models/LogicalPart/LogicalTextModule.ts) — BasicNameModule, BasicLogicalTextModule
- [`src/app/models/LogicalPart/OpmLogicalEntity.ts`](src/app/models/LogicalPart/OpmLogicalEntity.ts) — OpmLogicalEntity
- [`src/app/models/LogicalPart/OpmLogicalObject.ts`](src/app/models/LogicalPart/OpmLogicalObject.ts) — OpmLogicalObject, OpmLogicalProcess, ProcessComputational
- [`src/app/models/LogicalPart/OpmLogicalState.ts`](src/app/models/LogicalPart/OpmLogicalState.ts) — OpmLogicalState, OpmLogicalStateEllipsis
- [`src/app/models/LogicalPart/OpmLogicalThing.ts`](src/app/models/LogicalPart/OpmLogicalThing.ts) — OpmLogicalThing, Rate, OpmProceduralRelation, OpmRelation, OpmStructuralRelation, TimeDurationModule, OpmFundamentalLink, OpmLink, TargetElementData, OpmProceduralLink, OpmStructuralLink, OpmTaggedLink, OpmVisualElement, OpmVisualEntity
- [`src/app/models/LogicalPart/OpmTaggedRelation.ts`](src/app/models/LogicalPart/OpmTaggedRelation.ts) — OpmTaggedRelation
- [`src/app/models/LogicalPart/components/SimulationModule.ts`](src/app/models/LogicalPart/components/SimulationModule.ts) — SimulationModule, simulatedElementParams
- [`src/app/models/LogicalPart/components/StereotypeModule.ts`](src/app/models/LogicalPart/components/StereotypeModule.ts) — StereotypeModule, BelongsToStereotypTextModule
- [`src/app/models/LogicalPart/components/aliasing-module.ts`](src/app/models/LogicalPart/components/aliasing-module.ts) — AliasingModule
- [`src/app/models/LogicalPart/components/computation-module.ts`](src/app/models/LogicalPart/components/computation-module.ts) — ComputationModule
- [`src/app/models/LogicalPart/components/configurationsTextModule.ts`](src/app/models/LogicalPart/components/configurationsTextModule.ts) — ConfigurationsTextModule
- [`src/app/models/LogicalPart/components/units-text-module.ts`](src/app/models/LogicalPart/components/units-text-module.ts) — UnitsTextModule

### Modelo visual (VisualPart) (5)

- [`src/app/models/VisualPart/OpmVisualEllipsis.ts`](src/app/models/VisualPart/OpmVisualEllipsis.ts) — OpmVisualEllipsis
- [`src/app/models/VisualPart/OpmVisualObject.ts`](src/app/models/VisualPart/OpmVisualObject.ts) — OpmVisualObject
- [`src/app/models/VisualPart/OpmVisualProcess.ts`](src/app/models/VisualPart/OpmVisualProcess.ts) — OpmVisualProcess
- [`src/app/models/VisualPart/OpmVisualState.ts`](src/app/models/VisualPart/OpmVisualState.ts) — OpmVisualState
- [`src/app/models/VisualPart/OpmVisualThing.ts`](src/app/models/VisualPart/OpmVisualThing.ts) — OpmVisualThing, BringConnectedCommand, BringConnectedAction, CommandsDecider, SetComputationCommand, SetComputationAction, InzoomCommand, InzoomAction, RemoveComputationCommand, RemoveComputationAction, RemoveCommand, RemoveAction, StylingCommand, StyleAction, ToggleAffiliationCommand, ToggleAffiliationAction, ToggleEssenceCommand, ToggleEssenceAction, ToggleTextAutoFormatCommand, ToggleTextAutoFormatAction, UnfoldCommand, UnfoldAction, RangeValidationAccess

### Modelo dibujado (DrawnPart) (14)

- [`src/app/models/DrawnPart/CMMNShapes.ts`](src/app/models/DrawnPart/CMMNShapes.ts) — (sin símbolos top-level)
- [`src/app/models/DrawnPart/Note.ts`](src/app/models/DrawnPart/Note.ts) — Note, TitleModule, TextModule
- [`src/app/models/DrawnPart/OpmEntity.ts`](src/app/models/DrawnPart/OpmEntity.ts) — OpmEntity
- [`src/app/models/DrawnPart/OpmEntityRappid.ts`](src/app/models/DrawnPart/OpmEntityRappid.ts) — OpmEntityRappid
- [`src/app/models/DrawnPart/OpmObject.ts`](src/app/models/DrawnPart/OpmObject.ts) — OpmObject, OpmSemifoldedFundamental, OpmState, OpmThing, OpmFundamentalRelation, OpmLogicalElement
- [`src/app/models/DrawnPart/OpmProcess.ts`](src/app/models/DrawnPart/OpmProcess.ts) — OpmProcess
- [`src/app/models/DrawnPart/TextBlock.ts`](src/app/models/DrawnPart/TextBlock.ts) — TextBlock
- [`src/app/models/DrawnPart/TextBlockClass.ts`](src/app/models/DrawnPart/TextBlockClass.ts) — TextBlockClass
- [`src/app/models/DrawnPart/UrlsUtils.ts`](src/app/models/DrawnPart/UrlsUtils.ts) — UrlsUtils
- [`src/app/models/DrawnPart/UserInputPromptPopup.ts`](src/app/models/DrawnPart/UserInputPromptPopup.ts) — escapeAttr, openUserInputPromptPopup, userInputPromptEvents
- [`src/app/models/DrawnPart/components/alias/alias.popup.ts`](src/app/models/DrawnPart/components/alias/alias.popup.ts) — aliasValidation, AliasPopup
- [`src/app/models/DrawnPart/components/halo/halo-config.ts`](src/app/models/DrawnPart/components/halo/halo-config.ts) — HaloConfiguration
- [`src/app/models/DrawnPart/components/range/range.ts`](src/app/models/DrawnPart/components/range/range.ts) — setRangePopUpContent
- [`src/app/models/DrawnPart/components/text/text.popup.ts`](src/app/models/DrawnPart/components/text/text.popup.ts) — TextPopup, dsFromString, dsToString

### Links (DrawnPart/Links) (14)

- [`src/app/models/DrawnPart/Links/AgentLink.ts`](src/app/models/DrawnPart/Links/AgentLink.ts) — AgentLink
- [`src/app/models/DrawnPart/Links/AggregationLink.ts`](src/app/models/DrawnPart/Links/AggregationLink.ts) — AggregationLink
- [`src/app/models/DrawnPart/Links/BlankLink.ts`](src/app/models/DrawnPart/Links/BlankLink.ts) — BlankLink
- [`src/app/models/DrawnPart/Links/ConsumptionLink.ts`](src/app/models/DrawnPart/Links/ConsumptionLink.ts) — ConsumptionLink
- [`src/app/models/DrawnPart/Links/EffectLink.ts`](src/app/models/DrawnPart/Links/EffectLink.ts) — EffectLink
- [`src/app/models/DrawnPart/Links/InstantiationLink.ts`](src/app/models/DrawnPart/Links/InstantiationLink.ts) — InstantiationLink
- [`src/app/models/DrawnPart/Links/InstrumentLink.ts`](src/app/models/DrawnPart/Links/InstrumentLink.ts) — InstrumentLink
- [`src/app/models/DrawnPart/Links/InvocationLink.ts`](src/app/models/DrawnPart/Links/InvocationLink.ts) — InvocationLink
- [`src/app/models/DrawnPart/Links/OvertimeExceptionLink.ts`](src/app/models/DrawnPart/Links/OvertimeExceptionLink.ts) — OvertimeExceptionLink
- [`src/app/models/DrawnPart/Links/OvertimeUndertimeExceptionLink.ts`](src/app/models/DrawnPart/Links/OvertimeUndertimeExceptionLink.ts) — OvertimeUndertimeExceptionLink
- [`src/app/models/DrawnPart/Links/ResultLink.ts`](src/app/models/DrawnPart/Links/ResultLink.ts) — ResultLink
- [`src/app/models/DrawnPart/Links/SelfInvocationLink.ts`](src/app/models/DrawnPart/Links/SelfInvocationLink.ts) — SelfInvocationLinkInZoom, SelfInvocationLink, PartInvocation, ConnectionPoint
- [`src/app/models/DrawnPart/Links/UndertimeExceptionLink.ts`](src/app/models/DrawnPart/Links/UndertimeExceptionLink.ts) — UndertimeExceptionLink
- [`src/app/models/DrawnPart/Links/UnidirectionalTaggedLink.ts`](src/app/models/DrawnPart/Links/UnidirectionalTaggedLink.ts) — UnidirectionalTaggedLink

### Consistency (9)

- [`src/app/models/consistency/behavioral.rules.ts`](src/app/models/consistency/behavioral.rules.ts) — BehaviouralRule, ProcessCannotBeConnectedToitselfWithProceduralLinks, AlreadyConnectedWithStructural, AlreadyConnectedWithProcedural, AlreadyConnectedWithStructuralOnTheOtherWay, CantConnectConsumed, CantConnectConsumed2, CantConnectBeforeCreated, CantConnectBeforeCreated2, CantConnectSelfInvocationForInzoomedProcess, CantConnectInzoomedProcessToItsChildrenWithInvocation, ObjectCantConnectToObjectWithProceduralLinks, PreventAggregationBetweenInformaticalToPhysical, AggregationBetweenPhysicaltoInformatical, ExhibitionToPhysical, LegalConsumptionWarning, ProcessToProcess, ObjectToProcess, ProcessToObject, ObjectToObject, StateToObject, ObjectToState, StateToProcess, ProcessToState, StateToState, CannotConnectThingToItsInzoomedFather, ProcessToProcessExceptionsUndertimeOvertime, ProcessToProcessExceptionsOvertime, ProcessToProcessExceptionsUndertime, OnlyOneLevelOfInstantiation, OnlyOneLevelOfInstantiation2, GeneralizationPhysicalToPhysical, CannotConnectFundamentalFromSharedSubModelSource, CannotConnectFundamentalFromSharedSubModelSource2, exhibitionAncestor, OneUnidirectional, SingleInstrumentFromStates, SingleInstrumentFromStates2, InstrumentWithAgentConsistency1, InstrumentWithAgentConsistency2
- [`src/app/models/consistency/bringConnectedRules.ts`](src/app/models/consistency/bringConnectedRules.ts) — BringProceduralEnablersRelations, BringProceduraTransformersRelations, BringUniBiDirectionalRelations, BringFundamentalRelations, BringStructuralRelationsThatHasProceduralInParallel, BringExhibitingThing, BringSelfInvocationAsInzoomedInvocation
- [`src/app/models/consistency/changeActions/CannotBePhysicalChangeAction.ts`](src/app/models/consistency/changeActions/CannotBePhysicalChangeAction.ts) — CannotBePhysicalChangeAction
- [`src/app/models/consistency/changeActions/changeAction.interface.ts`](src/app/models/consistency/changeActions/changeAction.interface.ts) — ChangeAction
- [`src/app/models/consistency/consistancy.model.ts`](src/app/models/consistency/consistancy.model.ts) — Consistency, LinksModel, Set, SatisfiedRequirementSetModule, SatisfiedRequirementSet, SatisfiedRequirement
- [`src/app/models/consistency/consistional.rules.ts`](src/app/models/consistency/consistional.rules.ts) — ConsistionalRule, BaseConsistency, AgentConsistency, FundamentalConsistency, ProceduralConsistency
- [`src/app/models/consistency/entities.set.ts`](src/app/models/consistency/entities.set.ts) — Set
- [`src/app/models/consistency/rules.ts`](src/app/models/consistency/rules.ts) — (sin símbolos top-level)
- [`src/app/models/consistency/structural.rules.ts`](src/app/models/consistency/structural.rules.ts) — StructuralRule, StateCannotConnectToFather, ObjectAndStateCannotConnectToThemeselfs, StateCannotConnectToFatherStates, ObjectCannotBeConnectedToItsStates, ThingCannotConnectToFather, InzoomedProcessCannotConnectToIsSubProcess, Semifoldinglinks, CannotLinkToValueTypeObjec, CannotLinkToRequirementObject, SourceAndTargetOnSameOPD

### Commands & Actions (16)

- [`src/app/models/Actions/BringConnectedEntitiesAction.ts`](src/app/models/Actions/BringConnectedEntitiesAction.ts) — BringConnectedEntitiesAction
- [`src/app/models/components/commands/add-states.ts`](src/app/models/components/commands/add-states.ts) — AddStateCommand, AddStatesAction
- [`src/app/models/components/commands/destate.ts`](src/app/models/components/commands/destate.ts) — DestateCommand, DestateAction
- [`src/app/models/components/commands/edit-alias.ts`](src/app/models/components/commands/edit-alias.ts) — EditAliasCommand, EditAliasAction
- [`src/app/models/components/commands/edit-units.ts`](src/app/models/components/commands/edit-units.ts) — EditUnitsCommand, EditUnitsAction
- [`src/app/models/components/commands/hide-type-object.ts`](src/app/models/components/commands/hide-type-object.ts) — HideTypeCommand, HideValueAction
- [`src/app/models/components/commands/object-decider.ts`](src/app/models/components/commands/object-decider.ts) — ObjectCommandsDecider
- [`src/app/models/components/commands/process-decider.ts`](src/app/models/components/commands/process-decider.ts) — ProcessCommandsDecider
- [`src/app/models/components/commands/set-process-time-duration.ts`](src/app/models/components/commands/set-process-time-duration.ts) — SetProcessTimeDurationCommand, SetProcessTimeDurationAction
- [`src/app/models/components/commands/set-state-time-duration.ts`](src/app/models/components/commands/set-state-time-duration.ts) — SetStateTimeDurationCommand, SetStateTimeDurationAction
- [`src/app/models/components/commands/state-decider.ts`](src/app/models/components/commands/state-decider.ts) — StateCommandsDecider
- [`src/app/models/components/commands/suppress-state.ts`](src/app/models/components/commands/suppress-state.ts) — SuppressStateCommand, SupressStateCommandAction
- [`src/app/models/components/commands/suppress.ts`](src/app/models/components/commands/suppress.ts) — SuppressCommand, SuppressAction
- [`src/app/models/components/commands/supress-value-object-states.ts`](src/app/models/components/commands/supress-value-object-states.ts) — SupressValueStatesCommand, SupressValueStatesAction
- [`src/app/models/components/commands/updateComputationalProcess.ts`](src/app/models/components/commands/updateComputationalProcess.ts) — UpdateComputationCommand, UpdateComputationalAction
- [`src/app/models/components/commands/user-input-command.ts`](src/app/models/components/commands/user-input-command.ts) — UserInputCommand, UserInputCommandAction

### Modules (validation, hidden) (13)

- [`src/app/models/hiddenAttributes/hidden-attributes-module.ts`](src/app/models/hiddenAttributes/hidden-attributes-module.ts) — HiddenAttributesModule
- [`src/app/models/hiddenAttributes/requirements-stereotype.ts`](src/app/models/hiddenAttributes/requirements-stereotype.ts) — getRequirementStereotype
- [`src/app/models/modules/attribute-validation/attribute-value.ts`](src/app/models/modules/attribute-validation/attribute-value.ts) — AttributeValue
- [`src/app/models/modules/attribute-validation/boolean-range.ts`](src/app/models/modules/attribute-validation/boolean-range.ts) — BooleanRange
- [`src/app/models/modules/attribute-validation/char-range.ts`](src/app/models/modules/attribute-validation/char-range.ts) — CharRange
- [`src/app/models/modules/attribute-validation/numeric-range.ts`](src/app/models/modules/attribute-validation/numeric-range.ts) — NumericRange
- [`src/app/models/modules/attribute-validation/string-range.ts`](src/app/models/modules/attribute-validation/string-range.ts) — StringRange
- [`src/app/models/modules/attribute-validation/validation-module.ts`](src/app/models/modules/attribute-validation/validation-module.ts) — ValidationModule, OplConfig, OplEdxConfig, OplDefaultConfig, OplService
- [`src/app/models/notes/note-cell.ts`](src/app/models/notes/note-cell.ts) — NoteCell
- [`src/app/models/notes/note-type.ts`](src/app/models/notes/note-type.ts) — NoteType
- [`src/app/models/notes/note.service.ts`](src/app/models/notes/note.service.ts) — NoteService
- [`src/app/models/notes/note.ts`](src/app/models/notes/note.ts) — NoteData
- [`src/app/models/notes/note/note.component.ts`](src/app/models/notes/note/note.component.ts) — NoteComponent

### DSM (1)

- [`src/app/models/DSM/dsm.model.ts`](src/app/models/DSM/dsm.model.ts) — CloneRegistry, DsmModel

### DCM (17)

- [`src/app/models/dcm/export-mode.enum.ts`](src/app/models/dcm/export-mode.enum.ts) — (sin símbolos top-level)
- [`src/app/services/dcm/algorithms/case-entity-selection.algorithm.ts`](src/app/services/dcm/algorithms/case-entity-selection.algorithm.ts) — CaseEntitySelectionAlgorithm
- [`src/app/services/dcm/algorithms/case-file-schema.algorithm.ts`](src/app/services/dcm/algorithms/case-file-schema.algorithm.ts) — CaseFileSchemaAlgorithm
- [`src/app/services/dcm/algorithms/event-listener-generation.algorithm.ts`](src/app/services/dcm/algorithms/event-listener-generation.algorithm.ts) — EventListenerGenerationAlgorithm
- [`src/app/services/dcm/algorithms/graph-builder.algorithm.ts`](src/app/services/dcm/algorithms/graph-builder.algorithm.ts) — GraphBuilderAlgorithm
- [`src/app/services/dcm/algorithms/role-extraction.algorithm.ts`](src/app/services/dcm/algorithms/role-extraction.algorithm.ts) — RoleExtractionAlgorithm
- [`src/app/services/dcm/algorithms/scope-subgraph.algorithm.ts`](src/app/services/dcm/algorithms/scope-subgraph.algorithm.ts) — ScopeSubgraphAlgorithm
- [`src/app/services/dcm/algorithms/sentry-synthesis.algorithm.ts`](src/app/services/dcm/algorithms/sentry-synthesis.algorithm.ts) — SentrySynthesisAlgorithm
- [`src/app/services/dcm/algorithms/stage-task-determination.algorithm.ts`](src/app/services/dcm/algorithms/stage-task-determination.algorithm.ts) — StageTaskDeterminationAlgorithm
- [`src/app/services/dcm/canonical-opm-export.service.ts`](src/app/services/dcm/canonical-opm-export.service.ts) — CanonicalOPMExportService
- [`src/app/services/dcm/dcm-export-wizard.service.ts`](src/app/services/dcm/dcm-export-wizard.service.ts) — DCMExportWizardService
- [`src/app/services/dcm/exporters/cmmn-exporter.service.ts`](src/app/services/dcm/exporters/cmmn-exporter.service.ts) — CMMNExporterService
- [`src/app/services/dcm/exporters/cmmndi-exporter.service.ts`](src/app/services/dcm/exporters/cmmndi-exporter.service.ts) — CMMNDIExporterService
- [`src/app/services/dcm/exporters/dcm-ir-exporter.service.ts`](src/app/services/dcm/exporters/dcm-ir-exporter.service.ts) — DCMIRExporterService
- [`src/app/services/dcm/exporters/dmn-exporter.service.ts`](src/app/services/dcm/exporters/dmn-exporter.service.ts) — DMNExporterService
- [`src/app/services/dcm/exporters/trace-exporter.service.ts`](src/app/services/dcm/exporters/trace-exporter.service.ts) — TraceExporterService
- [`src/app/services/dcm/validation.service.ts`](src/app/services/dcm/validation.service.ts) — DCMValidationService

### ImportOPX (7)

- [`src/app/ImportOPX/OPX.API.ts`](src/app/ImportOPX/OPX.API.ts) — Position
- [`src/app/ImportOPX/OPX.Elements_Instances.ts`](src/app/ImportOPX/OPX.Elements_Instances.ts) — handleThingInstances, CheckStructuralLinkExist, OPXStructuralParamsFull
- [`src/app/ImportOPX/OPX.Elements_Loaders.ts`](src/app/ImportOPX/OPX.Elements_Loaders.ts) — OPXModel
- [`src/app/ImportOPX/OPX.Inzoomed_Tree.ts`](src/app/ImportOPX/OPX.Inzoomed_Tree.ts) — InzoomedTree
- [`src/app/ImportOPX/OPX.LastSong.ts`](src/app/ImportOPX/OPX.LastSong.ts) — ImportOpx_LastSong, Overlapping, OverlappingChildren
- [`src/app/ImportOPX/OPX.LogFile.ts`](src/app/ImportOPX/OPX.LogFile.ts) — loadLogInfo, EditLogFile, CreateOpmLogModel
- [`src/app/ImportOPX/OPX.Unfolded_Tree.ts`](src/app/ImportOPX/OPX.Unfolded_Tree.ts) — UnfoldedTree

### Dialogs (UI Angular — referencia) (87)

- [`src/app/dialogs/About/about.ts`](src/app/dialogs/About/about.ts) — AboutDialogComponent
- [`src/app/dialogs/DownloadCSV/DownloadCSV.ts`](src/app/dialogs/DownloadCSV/DownloadCSV.ts) — DownloadCSVComponent
- [`src/app/dialogs/FileUploader/FileUploader.ts`](src/app/dialogs/FileUploader/FileUploader.ts) — UploadFile
- [`src/app/dialogs/Simulation/Simulation.ts`](src/app/dialogs/Simulation/Simulation.ts) — SimulationComponent
- [`src/app/dialogs/Spinner/Progress_Spinner.ts`](src/app/dialogs/Spinner/Progress_Spinner.ts) — ProgressSpinner
- [`src/app/dialogs/UserAgreement/user-agreement.component.ts`](src/app/dialogs/UserAgreement/user-agreement.component.ts) — UserAgreementComponent
- [`src/app/dialogs/activate-user-dialog/activate-user-dialog.component.ts`](src/app/dialogs/activate-user-dialog/activate-user-dialog.component.ts) — ActivateUserDialogComponent
- [`src/app/dialogs/add-users-excel/add-users.component.ts`](src/app/dialogs/add-users-excel/add-users.component.ts) — AddUserComponent
- [`src/app/dialogs/attributes-and-instances-dialog/attributes-and-instances-dialog.component.ts`](src/app/dialogs/attributes-and-instances-dialog/attributes-and-instances-dialog.component.ts) — AttributesAndInstancesComponent
- [`src/app/dialogs/background-photo-dialog/background-photo-dialog.ts`](src/app/dialogs/background-photo-dialog/background-photo-dialog.ts) — BackgroundPhotoDialogComponent
- [`src/app/dialogs/change-password-dialog/change-password-dialog.component.ts`](src/app/dialogs/change-password-dialog/change-password-dialog.component.ts) — ChangePasswordDialogComponent
- [`src/app/dialogs/choose-exported-file-name/choose-exported-file-name.ts`](src/app/dialogs/choose-exported-file-name/choose-exported-file-name.ts) — ChooseExportedFileNameComponent
- [`src/app/dialogs/choose-link-dialog/Dialog.component.ts`](src/app/dialogs/choose-link-dialog/Dialog.component.ts) — LinksDialogComponent
- [`src/app/dialogs/code-editor-dialog/code-editor-dialog.ts`](src/app/dialogs/code-editor-dialog/code-editor-dialog.ts) — CodeEditorDialog
- [`src/app/dialogs/collaboration-dialog/collaboration-dialog.component.ts`](src/app/dialogs/collaboration-dialog/collaboration-dialog.component.ts) — CollaborationDialogComponent
- [`src/app/dialogs/create-popup-message/create-popup-message.component.ts`](src/app/dialogs/create-popup-message/create-popup-message.component.ts) — CreatePopupMessagesComponent
- [`src/app/dialogs/create-requirement-view-dialog/create-requirement-view-dialog.ts`](src/app/dialogs/create-requirement-view-dialog/create-requirement-view-dialog.ts) — CreateRequirementViewDialog
- [`src/app/dialogs/create-view-dialog/create-view-dialog.ts`](src/app/dialogs/create-view-dialog/create-view-dialog.ts) — CreateViewDialog
- [`src/app/dialogs/dcm-export-wizard/dcm-export-wizard.component.ts`](src/app/dialogs/dcm-export-wizard/dcm-export-wizard.component.ts) — DCMExportWizardComponent
- [`src/app/dialogs/dcm-viewer/dcm-viewer.component.ts`](src/app/dialogs/dcm-viewer/dcm-viewer.component.ts) — DCMViewerComponent
- [`src/app/dialogs/dmn-decision-viewer/dmn-decision-viewer.component.ts`](src/app/dialogs/dmn-decision-viewer/dmn-decision-viewer.component.ts) — DMNDecisionViewerComponent
- [`src/app/dialogs/enter-email-verification-code-dialog/enter-email-verification-code-dialog.ts`](src/app/dialogs/enter-email-verification-code-dialog/enter-email-verification-code-dialog.ts) — EnterEmailVerificationCodeDialog
- [`src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts`](src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts) — ExistingNameDialogComponent
- [`src/app/dialogs/export-legend-dialog/export-legend-dialog.component.ts`](src/app/dialogs/export-legend-dialog/export-legend-dialog.component.ts) — ExportLegendDialogComponent
- [`src/app/dialogs/export-model-as-html-dialog/export-model-as-html.ts`](src/app/dialogs/export-model-as-html-dialog/export-model-as-html.ts) — ExportModelAsHtmlComponent
- [`src/app/dialogs/export-sysml-dialog/export-sysml-dialog.component.ts`](src/app/dialogs/export-sysml-dialog/export-sysml-dialog.component.ts) — ExportSysMLDialogComponent
- [`src/app/dialogs/find-user-admin/find-user-admin.component.ts`](src/app/dialogs/find-user-admin/find-user-admin.component.ts) — FindUserAdminComponent
- [`src/app/dialogs/folder-permissions-dialog/folder-permissions-dialog/folder-permissions-dialog.component.ts`](src/app/dialogs/folder-permissions-dialog/folder-permissions-dialog/folder-permissions-dialog.component.ts) — FolderPermissionsDialogComponent
- [`src/app/dialogs/genAI-computational-editor-dialog/genAI-computational-editor-dialog.ts`](src/app/dialogs/genAI-computational-editor-dialog/genAI-computational-editor-dialog.ts) — GenAIComputationalEditorDialog
- [`src/app/dialogs/grey-items-dialog/grey-items-dialog.component.ts`](src/app/dialogs/grey-items-dialog/grey-items-dialog.component.ts) — GreyItemsDialogComponent
- [`src/app/dialogs/headlessRunner-dialog/headlessRunner-dialog.component.ts`](src/app/dialogs/headlessRunner-dialog/headlessRunner-dialog.component.ts) — HeadlessRunnerComponent
- [`src/app/dialogs/images-pool-container/images-pool-container.ts`](src/app/dialogs/images-pool-container/images-pool-container.ts) — ImagesPoolContainer
- [`src/app/dialogs/images-pool-management/images-pool-management-component.ts`](src/app/dialogs/images-pool-management/images-pool-management-component.ts) — ImagesPoolManagementComponent
- [`src/app/dialogs/input-name-dialog/input-name-dialog.ts`](src/app/dialogs/input-name-dialog/input-name-dialog.ts) — InputNameDialogComponent
- [`src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts`](src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts) — DeepSearchModel, DeepSearchFolder
- [`src/app/dialogs/load-model-dialog/load-model-dialog.component.ts`](src/app/dialogs/load-model-dialog/load-model-dialog.component.ts) — LoadModelDialogComponent
- [`src/app/dialogs/load-model-dialog/name-validator.ts`](src/app/dialogs/load-model-dialog/name-validator.ts) — ModelTitleValidator
- [`src/app/dialogs/load-model-dialog/sub-dialogs/removeModel/delete-model-dialog.component.ts`](src/app/dialogs/load-model-dialog/sub-dialogs/removeModel/delete-model-dialog.component.ts) — DeleteModelDialogComponent
- [`src/app/dialogs/load-model-dialog/sub-dialogs/rename/rename-dialog.component.ts`](src/app/dialogs/load-model-dialog/sub-dialogs/rename/rename-dialog.component.ts) — RenameDialogComponent
- [`src/app/dialogs/log-sharing-dialog/log-sharing-dialog.component.ts`](src/app/dialogs/log-sharing-dialog/log-sharing-dialog.component.ts) — LogSharingDialogComponent
- [`src/app/dialogs/logs-dashboard-dialog/logs-dashboard-dialog.component.ts`](src/app/dialogs/logs-dashboard-dialog/logs-dashboard-dialog.component.ts) — LogsDashboardDialogComponent
- [`src/app/dialogs/logs-dashboard/logs-dashboard.component.ts`](src/app/dialogs/logs-dashboard/logs-dashboard.component.ts) — LogsDashboardComponent, ExampleHttpDatabase
- [`src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts) — IngProcessesNamesChecker
- [`src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts) — InzoomedContentChecker
- [`src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts) — ObjectNameAsSingularChecker
- [`src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts) — PartUnfoldContentChecker
- [`src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts) — SystemicProcessesMainFunctionChecker
- [`src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts`](src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts) — TransformingProcessChecker
- [`src/app/dialogs/methodological-checking-dialog/methodological-checker.ts`](src/app/dialogs/methodological-checking-dialog/methodological-checker.ts) — MethodologicalChecker
- [`src/app/dialogs/methodological-checking-dialog/methodological-checking-dialog.ts`](src/app/dialogs/methodological-checking-dialog/methodological-checking-dialog.ts) — MethodologicalCheckingDialog
- [`src/app/dialogs/multi-delete-progress/multi-delete-progress.component.ts`](src/app/dialogs/multi-delete-progress/multi-delete-progress.component.ts) — MultiDeleteProgressComponent
- [`src/app/dialogs/multi-instances-dialog/multi-instances-dialog.ts`](src/app/dialogs/multi-instances-dialog/multi-instances-dialog.ts) — multiInstancesDialog
- [`src/app/dialogs/multi-update-user-dialog/multi-update-user-dialog.component.ts`](src/app/dialogs/multi-update-user-dialog/multi-update-user-dialog.component.ts) — MultiUpdateUserDialogComponent
- [`src/app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts`](src/app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts) — NewModelByWizardComponentComponent
- [`src/app/dialogs/new-model-dialog/new-model-dialog.ts`](src/app/dialogs/new-model-dialog/new-model-dialog.ts) — NewModelComponent
- [`src/app/dialogs/opdtree-model-settings/opdtree-model-settings.component.ts`](src/app/dialogs/opdtree-model-settings/opdtree-model-settings.component.ts) — OpdtreeModelSettingsComponent
- [`src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts`](src/app/dialogs/opl-dialog/opl-dialog-SysAdmin.ts) — OplDialogComponentSysAdmin, KeysPipe
- [`src/app/dialogs/opl-dialog/opl-dialog.component.ts`](src/app/dialogs/opl-dialog/opl-dialog.component.ts) — OplDialogComponent, KeysPipe
- [`src/app/dialogs/opl-generative-ai-dialog/generative-ai-impact-analysis-dialog/generative-ai-impact-analysis.ts`](src/app/dialogs/opl-generative-ai-dialog/generative-ai-impact-analysis-dialog/generative-ai-impact-analysis.ts) — GenerativeAIImpactAnalysisDialogComponent
- [`src/app/dialogs/opl-generative-ai-dialog/generative-ai-requirements-export-dialog/generative-ai-requirements-export.ts`](src/app/dialogs/opl-generative-ai-dialog/generative-ai-requirements-export-dialog/generative-ai-requirements-export.ts) — GenerativeAIRequirementsExportDialogComponent
- [`src/app/dialogs/opl-generative-ai-dialog/generative-ai-update-key-dialog/generative-ai-update-key.ts`](src/app/dialogs/opl-generative-ai-dialog/generative-ai-update-key-dialog/generative-ai-update-key.ts) — GenerativeAIUpdateKeyDialogComponent
- [`src/app/dialogs/opl-generative-ai-dialog/opl-generative-ai.ts`](src/app/dialogs/opl-generative-ai-dialog/opl-generative-ai.ts) — OPLGenerativeAIDialogComponent
- [`src/app/dialogs/opmQuery-dialog/opmQuery-dialog.ts`](src/app/dialogs/opmQuery-dialog/opmQuery-dialog.ts) — opmQueryDialogComponent
- [`src/app/dialogs/pareto-frontier-dialog/pareto-frontier-dialog.ts`](src/app/dialogs/pareto-frontier-dialog/pareto-frontier-dialog.ts) — paretoFrontierDialog
- [`src/app/dialogs/popup-message-content/popup-message-content.component.ts`](src/app/dialogs/popup-message-content/popup-message-content.component.ts) — PopupMessageContentComponent
- [`src/app/dialogs/popup-views-or-confirms/popup-views-or-confirms.component.ts`](src/app/dialogs/popup-views-or-confirms/popup-views-or-confirms.component.ts) — PopupViewsOrConfirmsComponent
- [`src/app/dialogs/python-code-editor-dialog/python-code-editor-dialog.ts`](src/app/dialogs/python-code-editor-dialog/python-code-editor-dialog.ts) — PythonCodeEditorDialog
- [`src/app/dialogs/remove-locator-links/remove-locator-links.ts`](src/app/dialogs/remove-locator-links/remove-locator-links.ts) — RemoveLocatorLinks
- [`src/app/dialogs/remove-locator/remove-locator.ts`](src/app/dialogs/remove-locator/remove-locator.ts) — RemoveLocator
- [`src/app/dialogs/remove-operation-selection/remove-operation.ts`](src/app/dialogs/remove-operation-selection/remove-operation.ts) — RemoveOperationComponent
- [`src/app/dialogs/remove-user/remove-user.component.ts`](src/app/dialogs/remove-user/remove-user.component.ts) — RemoveUserComponent
- [`src/app/dialogs/reset-initial-password/reset-initial-password.component.ts`](src/app/dialogs/reset-initial-password/reset-initial-password.component.ts) — ResetInitialPasswordComponent
- [`src/app/dialogs/savePdf-dialog/savePdf.ts`](src/app/dialogs/savePdf-dialog/savePdf.ts) — SavePdfComponent
- [`src/app/dialogs/saveScreenshot-dialog/saveScreenshot.ts`](src/app/dialogs/saveScreenshot-dialog/saveScreenshot.ts) — SaveScreenshotComponent
- [`src/app/dialogs/search-items-dialog/search-items-dialog.component.ts`](src/app/dialogs/search-items-dialog/search-items-dialog.component.ts) — SearchItemsDialogComponent
- [`src/app/dialogs/select-opds-tree-dialog/select-opds-tree-dialog.ts`](src/app/dialogs/select-opds-tree-dialog/select-opds-tree-dialog.ts) — SelectOpdsTreeDialog
- [`src/app/dialogs/set-2-auth-factors/set-2-auth-factors-dialog.ts`](src/app/dialogs/set-2-auth-factors/set-2-auth-factors-dialog.ts) — Set2AuthFactorsDialog
- [`src/app/dialogs/set-admin-user-list/set-admin-user-list.component.ts`](src/app/dialogs/set-admin-user-list/set-admin-user-list.component.ts) — SetAdminUserListComponent
- [`src/app/dialogs/simulationElement/SimulationElement.ts`](src/app/dialogs/simulationElement/SimulationElement.ts) — SimulationElementComponent
- [`src/app/dialogs/stereotypes-dialog/StereotypesRelatedInterface.ts`](src/app/dialogs/stereotypes-dialog/StereotypesRelatedInterface.ts) — (sin símbolos top-level)
- [`src/app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts`](src/app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts) — StereotypesDialogComponent
- [`src/app/dialogs/styleCopyingDialog/styleCopyingDialog.component.ts`](src/app/dialogs/styleCopyingDialog/styleCopyingDialog.component.ts) — StyleCopyingDialogComponent
- [`src/app/dialogs/submodel-name-dialog/submodel-name-dialog.ts`](src/app/dialogs/submodel-name-dialog/submodel-name-dialog.ts) — SubModelNameComponent
- [`src/app/dialogs/templates-import/templates-import.ts`](src/app/dialogs/templates-import/templates-import.ts) — TemplatesComponent
- [`src/app/dialogs/treeParser.ts`](src/app/dialogs/treeParser.ts) — TreeParser
- [`src/app/dialogs/update-user-dialog/update-user-dialog.component.ts`](src/app/dialogs/update-user-dialog/update-user-dialog.component.ts) — UpdateUserDialogComponent
- [`src/app/dialogs/validation-settings/validation-settings.ts`](src/app/dialogs/validation-settings/validation-settings.ts) — ValidationSettingsComponent

### Layout y módulos UI (67)

- [`src/app/modules/Settings/OPCloud-Organization-Settings/OPCloud-Organization-Settings.component_org.ts`](src/app/modules/Settings/OPCloud-Organization-Settings/OPCloud-Organization-Settings.component_org.ts) — OPCloudOrganizationSettingsComponent_org
- [`src/app/modules/Settings/OPCloudManual/opcloud-manual.component.ts`](src/app/modules/Settings/OPCloudManual/opcloud-manual.component.ts) — OPCloudManualComponent
- [`src/app/modules/Settings/OPCloudPrivacyPolicy/opcloud-privacy-policy.component.ts`](src/app/modules/Settings/OPCloudPrivacyPolicy/opcloud-privacy-policy.component.ts) — OPCloudPrivacyPolicyComponent
- [`src/app/modules/Settings/OpCloudSettings/opcloud-settings.component.ts`](src/app/modules/Settings/OpCloudSettings/opcloud-settings.component.ts) — OpcloudSettingsComponent
- [`src/app/modules/Settings/OplSettings/opl-settings.component.ts`](src/app/modules/Settings/OplSettings/opl-settings.component.ts) — OplSettingsComponent
- [`src/app/modules/Settings/OrgOntology/Organization-Ontology.component.ts`](src/app/modules/Settings/OrgOntology/Organization-Ontology.component.ts) — OrganizationOntologyComponent
- [`src/app/modules/Settings/OrgOntology/ontologyApplier.ts`](src/app/modules/Settings/OrgOntology/ontologyApplier.ts) — OntologyApplier
- [`src/app/modules/Settings/PopupMessages/popup-messages.component.ts`](src/app/modules/Settings/PopupMessages/popup-messages.component.ts) — PopupMessagesComponent
- [`src/app/modules/Settings/dsm-analysis/dsm-analysis.component.ts`](src/app/modules/Settings/dsm-analysis/dsm-analysis.component.ts) — DsmAnalysisComponent
- [`src/app/modules/Settings/graph-insights/graph-insights-force-layout.ts`](src/app/modules/Settings/graph-insights/graph-insights-force-layout.ts) — runForceDirectedLayout
- [`src/app/modules/Settings/graph-insights/graph-insights-instructions-dialog.component.ts`](src/app/modules/Settings/graph-insights/graph-insights-instructions-dialog.component.ts) — GraphInsightsInstructionsDialogComponent
- [`src/app/modules/Settings/graph-insights/graph-insights-layout-seed.ts`](src/app/modules/Settings/graph-insights/graph-insights-layout-seed.ts) — seedMultiClusterLayout
- [`src/app/modules/Settings/graph-insights/graph-insights.component.ts`](src/app/modules/Settings/graph-insights/graph-insights.component.ts) — GraphInsightsComponent
- [`src/app/modules/Settings/graph-insights/graph-insights.service.ts`](src/app/modules/Settings/graph-insights/graph-insights.service.ts) — GraphInsightsService
- [`src/app/modules/Settings/graph-insights/opm-graph-normalizer.service.ts`](src/app/modules/Settings/graph-insights/opm-graph-normalizer.service.ts) — OpmGraphNormalizerService
- [`src/app/modules/Settings/graph-insights/opm-graphology-builder.service.ts`](src/app/modules/Settings/graph-insights/opm-graphology-builder.service.ts) — OpmGraphologyBuilderService
- [`src/app/modules/Settings/group-mgmt/add-group/add-group.component.ts`](src/app/modules/Settings/group-mgmt/add-group/add-group.component.ts) — AddGroupComponent
- [`src/app/modules/Settings/group-mgmt/group-administration/group-administration.component.ts`](src/app/modules/Settings/group-mgmt/group-administration/group-administration.component.ts) — GroupAdministrationComponent
- [`src/app/modules/Settings/group-mgmt/update-user-grp/member-grp/member-grp.component.ts`](src/app/modules/Settings/group-mgmt/update-user-grp/member-grp/member-grp.component.ts) — MemberGrpComponent
- [`src/app/modules/Settings/group-mgmt/update-user-grp/update-user-grp.component.ts`](src/app/modules/Settings/group-mgmt/update-user-grp/update-user-grp.component.ts) — UserGroupsComponent
- [`src/app/modules/Settings/list-things/list-things.component.ts`](src/app/modules/Settings/list-things/list-things.component.ts) — ListThingsComponent
- [`src/app/modules/Settings/menuGroups.ts`](src/app/modules/Settings/menuGroups.ts) — (sin símbolos top-level)
- [`src/app/modules/Settings/missing-knowledge-analysis/missing-knowledge-analysis.component.ts`](src/app/modules/Settings/missing-knowledge-analysis/missing-knowledge-analysis.component.ts) — MissingKnowledgeAnalysisComponent
- [`src/app/modules/Settings/model-analysis-tools/model-analysis-tools.component.ts`](src/app/modules/Settings/model-analysis-tools/model-analysis-tools.component.ts) — ModelAnalysisToolsComponent
- [`src/app/modules/Settings/model-analysis/model-analysis.component.ts`](src/app/modules/Settings/model-analysis/model-analysis.component.ts) — ModelAnalysisComponent
- [`src/app/modules/Settings/nlp-model-analysis/nlp-model-analysis.component.ts`](src/app/modules/Settings/nlp-model-analysis/nlp-model-analysis.component.ts) — NlpModelAnalysisComponent
- [`src/app/modules/Settings/organization-analytics/organization-analytics.component.ts`](src/app/modules/Settings/organization-analytics/organization-analytics.component.ts) — OrganizationAnalyticsComponent
- [`src/app/modules/Settings/organization-mgmt/delete-org/delete-org.component.ts`](src/app/modules/Settings/organization-mgmt/delete-org/delete-org.component.ts) — DeleteOrgComponent
- [`src/app/modules/Settings/organization-mgmt/new-org/new-org.component.ts`](src/app/modules/Settings/organization-mgmt/new-org/new-org.component.ts) — SettingsNewOrg
- [`src/app/modules/Settings/organization-mgmt/org-admin/org-admin.component.ts`](src/app/modules/Settings/organization-mgmt/org-admin/org-admin.component.ts) — OrgAdminComponent
- [`src/app/modules/Settings/organization-mgmt/send-email/send-email.component.ts`](src/app/modules/Settings/organization-mgmt/send-email/send-email.component.ts) — SendEmailComponent
- [`src/app/modules/Settings/organization-mgmt/sso/sso-settings.ts`](src/app/modules/Settings/organization-mgmt/sso/sso-settings.ts) — SSOSettingsComponent
- [`src/app/modules/Settings/settings-home/settings-home.ts`](src/app/modules/Settings/settings-home/settings-home.ts) — SettingsHome
- [`src/app/modules/Settings/settings-opl-group.component.ts`](src/app/modules/Settings/settings-opl-group.component.ts) — SettingsOplGroupComponent
- [`src/app/modules/Settings/settings.component.ts`](src/app/modules/Settings/settings.component.ts) — SettingsComponent
- [`src/app/modules/Settings/settings.under_constractions.ts`](src/app/modules/Settings/settings.under_constractions.ts) — SettingsUnderConstruction
- [`src/app/modules/Settings/user-mgmt/new-user/new-user.component.ts`](src/app/modules/Settings/user-mgmt/new-user/new-user.component.ts) — SettingsNewUser
- [`src/app/modules/Settings/user-mgmt/update-user-details/update-user-details.component.ts`](src/app/modules/Settings/user-mgmt/update-user-details/update-user-details.component.ts) — UserDetailsComponent
- [`src/app/modules/app/app.component.ts`](src/app/modules/app/app.component.ts) — AppComponent
- [`src/app/modules/app/context.service.ts`](src/app/modules/app/context.service.ts) — ContextService
- [`src/app/modules/app/context.ts`](src/app/modules/app/context.ts) — EmptyContext, DSMContext, DCMContext, ModelContext, StereotypeContext, EdxModelContext
- [`src/app/modules/app/export-opl.service.ts`](src/app/modules/app/export-opl.service.ts) — ExportOPLAPIService
- [`src/app/modules/app/model.service.ts`](src/app/modules/app/model.service.ts) — ModelService
- [`src/app/modules/app/opm-model-comparison.service.ts`](src/app/modules/app/opm-model-comparison.service.ts) — ComparisonFeatureSet, OpmModelComparisonService
- [`src/app/modules/app/opm-rdf.service.ts`](src/app/modules/app/opm-rdf.service.ts) — OpmRdfService
- [`src/app/modules/app/tabsService.ts`](src/app/modules/app/tabsService.ts) — TabsManager
- [`src/app/modules/layout/element-tool-bar/directives/font-highlight.directive.ts`](src/app/modules/layout/element-tool-bar/directives/font-highlight.directive.ts) — FontHighlightDirective
- [`src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`](src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts) — ElementToolBarComponent
- [`src/app/modules/layout/element-tool-bar/supported-fonts.ts`](src/app/modules/layout/element-tool-bar/supported-fonts.ts) — getSupportedFonts
- [`src/app/modules/layout/header/header.component.ts`](src/app/modules/layout/header/header.component.ts) — HeaderComponent
- [`src/app/modules/layout/header/menu/menu.component.ts`](src/app/modules/layout/header/menu/menu.component.ts) — MenuComponent
- [`src/app/modules/layout/header/sign-in/sign-in.component.ts`](src/app/modules/layout/header/sign-in/sign-in.component.ts) — SignInComponent
- [`src/app/modules/layout/header/user-status/user-status.component.ts`](src/app/modules/layout/header/user-status/user-status.component.ts) — UserStatusComponent
- [`src/app/modules/layout/layout.module.ts`](src/app/modules/layout/layout.module.ts) — LayoutModule
- [`src/app/modules/layout/main/list-logical/list-logical.component.ts`](src/app/modules/layout/main/list-logical/list-logical.component.ts) — ListLogicalComponent
- [`src/app/modules/layout/main/main.component.ts`](src/app/modules/layout/main/main.component.ts) — MainComponent
- [`src/app/modules/layout/opc.layout.module.ts`](src/app/modules/layout/opc.layout.module.ts) — OpcLayoutModule
- [`src/app/modules/layout/opcloud-chat-component-float/chat.component.float.ts`](src/app/modules/layout/opcloud-chat-component-float/chat.component.float.ts) — ChatComponentFloat
- [`src/app/modules/layout/opcloud-chat-component-panel/chat.component.panel.ts`](src/app/modules/layout/opcloud-chat-component-panel/chat.component.panel.ts) — ChatComponentPanel
- [`src/app/modules/layout/opcloud-navigator/navigator.component.ts`](src/app/modules/layout/opcloud-navigator/navigator.component.ts) — NavigatorComponent
- [`src/app/modules/layout/opl-container/opl-container.component.ts`](src/app/modules/layout/opl-container/opl-container.component.ts) — OplContainerComponent
- [`src/app/modules/shared/avatar/avatar.component.ts`](src/app/modules/shared/avatar/avatar.component.ts) — AvatarComponent
- [`src/app/modules/shared/calander/calander.component.ts`](src/app/modules/shared/calander/calander.component.ts) — CalanderComponent
- [`src/app/modules/shared/material.module.ts`](src/app/modules/shared/material.module.ts) — MaterialModule
- [`src/app/modules/shared/resize-bar/resize-bar.component.ts`](src/app/modules/shared/resize-bar/resize-bar.component.ts) — ResizeBarComponent
- [`src/app/modules/shared/resize-bar/resize-bar.directive.ts`](src/app/modules/shared/resize-bar/resize-bar.directive.ts) — ResizeBarDirective
- [`src/app/modules/shared/shared.module.ts`](src/app/modules/shared/shared.module.ts) — SharedModule

### Configuration (10)

- [`src/app/configuration/elementsFunctionality/ExePreProcess.ts`](src/app/configuration/elementsFunctionality/ExePreProcess.ts) — validateUnits, _validateUnits, validateProcessUnits
- [`src/app/configuration/elementsFunctionality/draw.view.ts`](src/app/configuration/elementsFunctionality/draw.view.ts) — draw, putToGraph, factory
- [`src/app/configuration/elementsFunctionality/graphFunctionality.ts`](src/app/configuration/elementsFunctionality/graphFunctionality.ts) — addHandle, removeHandle, changeHandle
- [`src/app/configuration/elementsFunctionality/linkDrawing.ts`](src/app/configuration/elementsFunctionality/linkDrawing.ts) — uniteResults, uniteConsumptions, uniteAgentsAndInstruments
- [`src/app/configuration/rappidEnviromentFunctionality/inspector/opmStyle.ts`](src/app/configuration/rappidEnviromentFunctionality/inspector/opmStyle.ts) — (sin símbolos top-level)
- [`src/app/configuration/rappidEnviromentFunctionality/keyboardShortcuts.ts`](src/app/configuration/rappidEnviromentFunctionality/keyboardShortcuts.ts) — copy, pasteOnlyFormatting, paste
- [`src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts`](src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts) — (sin símbolos top-level)
- [`src/app/configuration/rappidEnviromentFunctionality/shared.ts`](src/app/configuration/rappidEnviromentFunctionality/shared.ts) — ConfirmDialogDialogComponent, EnterValueDialogComponent, OntologySuggestionDialog, SaveURLComponent, DeleteAction, OpmEllipsis, BiDirectionalTaggedLink, ExhibitionLink, GeneralizationLink, OpmDefaultLink, OpmFundamentalLink, TriangleClass, OpmLinkRappid, OpmProceduralLink, OpmStructuralLink, OpmTaggedLink, Arc
- [`src/app/configuration/service/config.service.ts`](src/app/configuration/service/config.service.ts) — ConfigService
- [`src/app/configuration/ssoConfigurations/ssoConfigurations.ts`](src/app/configuration/ssoConfigurations/ssoConfigurations.ts) — loggerCallback, MSALInstanceFactory, MSALInterceptorConfigFactory

### Rappid components (25)

- [`src/app/rappid-components/rappid-opl/rappid-opl.component.ts`](src/app/rappid-components/rappid-opl/rappid-opl.component.ts) — RappidOplComponent
- [`src/app/rappid-components/rappid-paper/rappid-paper.component.ts`](src/app/rappid-components/rappid-paper/rappid-paper.component.ts) — RappidPaperComponent
- [`src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts`](src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts) — RappidToolbarComponent
- [`src/app/rappid-components/rappid-toolbar/toolbar.component.ts`](src/app/rappid-components/rappid-toolbar/toolbar.component.ts) — ToolbarComponent
- [`src/app/rappid-components/services/GraphDB/graphDB.service.ts`](src/app/rappid-components/services/GraphDB/graphDB.service.ts) — GraphDBService
- [`src/app/rappid-components/services/authentication/authentication.service.ts`](src/app/rappid-components/services/authentication/authentication.service.ts) — AuthenticationService
- [`src/app/rappid-components/services/dialog.service.ts`](src/app/rappid-components/services/dialog.service.ts) — DialogService
- [`src/app/rappid-components/services/graph.service.ts`](src/app/rappid-components/services/graph.service.ts) — GraphService
- [`src/app/rappid-components/services/groups.service.ts`](src/app/rappid-components/services/groups.service.ts) — GroupsService
- [`src/app/rappid-components/services/init-rappid.service.ts`](src/app/rappid-components/services/init-rappid.service.ts) — InitRappidService
- [`src/app/rappid-components/services/init/abstract.init.service.ts`](src/app/rappid-components/services/init/abstract.init.service.ts) — AbstractVersionService
- [`src/app/rappid-components/services/init/opc.init.service.ts`](src/app/rappid-components/services/init/opc.init.service.ts) — OpcVersionService
- [`src/app/rappid-components/services/model-compression.service.ts`](src/app/rappid-components/services/model-compression.service.ts) — ModelCompressionService
- [`src/app/rappid-components/services/organization.service.ts`](src/app/rappid-components/services/organization.service.ts) — OrganizationService
- [`src/app/rappid-components/services/penManager.ts`](src/app/rappid-components/services/penManager.ts) — PenManager
- [`src/app/rappid-components/services/permissions/permissions.service.ts`](src/app/rappid-components/services/permissions/permissions.service.ts) — PermissionsService
- [`src/app/rappid-components/services/server-flattening.service.ts`](src/app/rappid-components/services/server-flattening.service.ts) — ServerFlatteningService
- [`src/app/rappid-components/services/storage.service.ts`](src/app/rappid-components/services/storage.service.ts) — StorageService
- [`src/app/rappid-components/services/storage/chat/chat-storage.interface.ts`](src/app/rappid-components/services/storage/chat/chat-storage.interface.ts) — ChatStorageInterface
- [`src/app/rappid-components/services/storage/chat/chat-storage.service.ts`](src/app/rappid-components/services/storage/chat/chat-storage.service.ts) — ChatStorageService
- [`src/app/rappid-components/services/storage/model-object.class.ts`](src/app/rappid-components/services/storage/model-object.class.ts) — ModelObject
- [`src/app/rappid-components/services/storage/model-storage.interface.ts`](src/app/rappid-components/services/storage/model-storage.interface.ts) — ModelStorageInterface
- [`src/app/rappid-components/services/storage/model-storage.service.ts`](src/app/rappid-components/services/storage/model-storage.service.ts) — ModelStorageService
- [`src/app/rappid-components/services/tree-view.service.ts`](src/app/rappid-components/services/tree-view.service.ts) — TreeViewService
- [`src/app/rappid-components/services/user.service.ts`](src/app/rappid-components/services/user.service.ts) — UserService

### Database / Auth (8)

- [`src/app/database/ServerDatabaseDrive.ts`](src/app/database/ServerDatabaseDrive.ts) — ServerDatabaseDrive
- [`src/app/database/authInterceptor.ts`](src/app/database/authInterceptor.ts) — AuthInterceptor
- [`src/app/database/database.service.ts`](src/app/database/database.service.ts) — DatabaseService
- [`src/app/database/dateFormat.ts`](src/app/database/dateFormat.ts) — formatDate
- [`src/app/database/firebaseAuthDriver.ts`](src/app/database/firebaseAuthDriver.ts) — FirebaseAuthDriver
- [`src/app/database/msalAuth.ts`](src/app/database/msalAuth.ts) — MsalAuthDriver
- [`src/app/database/resolvers/opc.resolver.ts`](src/app/database/resolvers/opc.resolver.ts) — OpcAppResolver
- [`src/app/database/serverAuthDriver.ts`](src/app/database/serverAuthDriver.ts) — ServerAuthDriver

### Services (genéricos) (8)

- [`src/app/services/sysml-converters/activity-diagram.converter.ts`](src/app/services/sysml-converters/activity-diagram.converter.ts) — ActivityDiagramConverter
- [`src/app/services/sysml-converters/base-diagram.converter.ts`](src/app/services/sysml-converters/base-diagram.converter.ts) — BaseDiagramConverter
- [`src/app/services/sysml-converters/block-definition-diagram.converter.ts`](src/app/services/sysml-converters/block-definition-diagram.converter.ts) — BlockDefinitionDiagramConverter
- [`src/app/services/sysml-converters/requirement-diagram.converter.ts`](src/app/services/sysml-converters/requirement-diagram.converter.ts) — RequirementDiagramConverter
- [`src/app/services/sysml-converters/sequence-diagram.converter.ts`](src/app/services/sysml-converters/sequence-diagram.converter.ts) — SequenceDiagramConverter
- [`src/app/services/sysml-converters/state-machine-diagram.converter.ts`](src/app/services/sysml-converters/state-machine-diagram.converter.ts) — StateMachineDiagramConverter
- [`src/app/services/sysml-converters/use-case-diagram.converter.ts`](src/app/services/sysml-converters/use-case-diagram.converter.ts) — UseCaseDiagramConverter
- [`src/app/services/sysml-xmi-generator.service.ts`](src/app/services/sysml-xmi-generator.service.ts) — SysMLXmiGeneratorService

### Pipes / Error / Pages (9)

- [`src/app/error-handler/error-handler.service.ts`](src/app/error-handler/error-handler.service.ts) — ErrorHandlerService
- [`src/app/error-handler/global-error-handler.ts`](src/app/error-handler/global-error-handler.ts) — GlobalErrorHandler
- [`src/app/opd-hierarchy/coll-menu.component.ts`](src/app/opd-hierarchy/coll-menu.component.ts) — CollaborationMenuComponent
- [`src/app/opd-hierarchy/opd-hierarchy.component.ts`](src/app/opd-hierarchy/opd-hierarchy.component.ts) — OPDHierarchyComponent
- [`src/app/opd-hierarchy/opdsTreeActions.ts`](src/app/opd-hierarchy/opdsTreeActions.ts) — ToggleOPDsNamesTreeAction, RenameOpdTreeAction, RemoveOpdTreeAction, UpdateRequirementViewTreeAction, DisconnectSubModelTreeAction, RenameSubModelTreeAction, OpenSubModelInNewTabTreeAction
- [`src/app/pipes/tab-title-pipe.pipe.ts`](src/app/pipes/tab-title-pipe.pipe.ts) — TabTitlePipe
- [`src/environments/environment.ts`](src/environments/environment.ts) — (sin símbolos top-level)
- [`src/environments/version/version.ts`](src/environments/version/version.ts) — (sin símbolos top-level)
- [`src/layout/index.mjs`](src/layout/index.mjs) — (sin símbolos top-level)

### Otros (10)

- [`src/app/handwriting.js`](src/app/handwriting.js) — handwriting, loadFromUrl
- [`src/app/models/components/ElementsMap.ts`](src/app/models/components/ElementsMap.ts) — ElementsMap
- [`src/app/modules/CanActivateViaAuthGuard.ts`](src/app/modules/CanActivateViaAuthGuard.ts) — CanActivateViaAuthGuard
- [`src/app/modules/MainLogin.component.ts`](src/app/modules/MainLogin.component.ts) — MainLoginComponent
- [`src/app/modules/app-routing.module.ts`](src/app/modules/app-routing.module.ts) — OpcRoutingModule
- [`src/app/modules/app.module.ts`](src/app/modules/app.module.ts) — AppModule
- [`src/app/modules/opc.module.ts`](src/app/modules/opc.module.ts) — OpcModule
- [`src/app/modules/rappid.module.ts`](src/app/modules/rappid.module.ts) — RappidModule
- [`src/core.mjs`](src/core.mjs) — (sin símbolos top-level)
- [`src/main.ts`](src/main.ts) — AnimationBuilder, AnimationFactory, BrowserAnimationBuilder, BrowserAnimationFactory, RendererAnimationPlayer, NoopAnimationPlayer, AnimationGroupPlayer
