# Assets — inventario y cross-reference

Inventario de SVG/PNG canónicos copiados desde `assets/` raíz, con
cross-reference a los archivos en `src/` que referencian cada asset por
nombre. Útil para identificar qué clase OPM consume qué SVG.

Estado:
- **Total assets descargados**: 84 (73 SVG + 11 PNG)
- **Assets referenciados pero NO descargados**: ver sección "Wishlist"

## SVG por categoría

### svg/links/procedural

| Asset | Referenciado en |
|-------|------------------|
| [`agent.svg`](svg/links/procedural/agent.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`agentCondition.svg`](svg/links/procedural/agentCondition.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`agentConditionNegation.svg`](svg/links/procedural/agentConditionNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`agentEvent.svg`](svg/links/procedural/agentEvent.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`agentNegation.svg`](svg/links/procedural/agentNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`bidirectionalRelation.svg`](svg/links/procedural/bidirectionalRelation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`consumption.svg`](svg/links/procedural/consumption.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`consumptionCondition.svg`](svg/links/procedural/consumptionCondition.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`consumptionConditionNegation.svg`](svg/links/procedural/consumptionConditionNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`consumptionEvent.svg`](svg/links/procedural/consumptionEvent.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`consumptionNegation.svg`](svg/links/procedural/consumptionNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`effect.svg`](svg/links/procedural/effect.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`effectCondition.svg`](svg/links/procedural/effectCondition.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`effectConditionNegation.svg`](svg/links/procedural/effectConditionNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`effectEvent.svg`](svg/links/procedural/effectEvent.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`effectNegation.svg`](svg/links/procedural/effectNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`instrument.svg`](svg/links/procedural/instrument.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`instrumentCondition.svg`](svg/links/procedural/instrumentCondition.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`instrumentConditionNegation.svg`](svg/links/procedural/instrumentConditionNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`instrumentEvent.svg`](svg/links/procedural/instrumentEvent.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`instrumentNegation.svg`](svg/links/procedural/instrumentNegation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`invocation.svg`](svg/links/procedural/invocation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`overtimeexception.svg`](svg/links/procedural/overtimeexception.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`result.svg`](svg/links/procedural/result.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`underOver.svg`](svg/links/procedural/underOver.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`underTime.svg`](svg/links/procedural/underTime.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |
| [`unidirectionalRelation.svg`](svg/links/procedural/unidirectionalRelation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts` |

### svg/links/structural

| Asset | Referenciado en |
|-------|------------------|
| [`aggregation.svg`](svg/links/structural/aggregation.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts`, `app/models/DrawnPart/OpmObject.ts` |
| [`classification.svg`](svg/links/structural/classification.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts`, `app/models/DrawnPart/OpmObject.ts` |
| [`exhibition.svg`](svg/links/structural/exhibition.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts`, `app/models/DrawnPart/OpmObject.ts` |
| [`generalization.svg`](svg/links/structural/generalization.svg) | `app/dialogs/choose-link-dialog/Dialog.component.ts`, `app/models/DrawnPart/OpmObject.ts` |

### svg/list-logical

| Asset | Referenciado en |
|-------|------------------|
| [`object.svg`](svg/list-logical/object.svg) | `app/modules/layout/main/list-logical/list-logical.component.ts` |
| [`objectDashed.svg`](svg/list-logical/objectDashed.svg) | `app/modules/layout/main/list-logical/list-logical.component.ts` |
| [`process.svg`](svg/list-logical/process.svg) | `app/modules/layout/main/list-logical/list-logical.component.ts` |
| [`processDashed.svg`](svg/list-logical/processDashed.svg) | `app/modules/layout/main/list-logical/list-logical.component.ts` |

### svg/svg

| Asset | Referenciado en |
|-------|------------------|
| [`ExpressHalo.svg`](svg/ExpressHalo.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`addConnected.svg`](svg/addConnected.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`addStates.svg`](svg/addStates.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`autosave.svg`](svg/autosave.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`computation.svg`](svg/computation.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`currentState.svg`](svg/currentState.svg) | `app/models/DrawnPart/OpmObject.ts`, `app/modules/layout/element-tool-bar/element-tool-bar.component.ts` |
| [`defaultState.svg`](svg/defaultState.svg) | `app/models/DrawnPart/OpmObject.ts`, `app/modules/layout/element-tool-bar/element-tool-bar.component.ts` |
| [`delete.svg`](svg/delete.svg) | `app/models/DrawnPart/Note.ts`, `app/models/DrawnPart/OpmEntity.ts` |
| [`deleteFunction.svg`](svg/deleteFunction.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`editAlias.svg`](svg/editAlias.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`editUnits.svg`](svg/editUnits.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`example.svg`](svg/example.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`folder.svg`](svg/folder.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`greenIndicator.svg`](svg/greenIndicator.svg) | `app/dialogs/collaboration-dialog/collaboration-dialog.component.ts` |
| [`inzoom.svg`](svg/inzoom.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`lock.svg`](svg/lock.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`logoPic.svg`](svg/logoPic.svg) | `app/dialogs/find-user-admin/find-user-admin.component.ts`, `app/dialogs/set-admin-user-list/set-admin-user-list.component.ts`, `app/modules/Settings/group-mgmt/group-administration/group-administration.component.ts` (+1) |
| [`newLogo.svg`](svg/newLogo.svg) | `app/modules/MainLogin.component.ts`, `app/modules/Settings/settings.component.ts`, `app/modules/layout/header/header.component.ts` |
| [`object-dashed.svg`](svg/object-dashed.svg) | — |
| [`object.svg`](svg/object.svg) | `app/modules/layout/main/list-logical/list-logical.component.ts` |
| [`objectDrag.svg`](svg/objectDrag.svg) | `app/modules/layout/header/header.component.ts` |
| [`process-dashed.svg`](svg/process-dashed.svg) | — |
| [`process.svg`](svg/process.svg) | `app/modules/layout/main/list-logical/list-logical.component.ts` |
| [`processDrag.svg`](svg/processDrag.svg) | `app/modules/layout/header/header.component.ts` |
| [`rangeState.svg`](svg/rangeState.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`regFile.svg`](svg/regFile.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`regFileStereotypeG.svg`](svg/regFileStereotypeG.svg) | `app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts` |
| [`regFileStereotypeNonG.svg`](svg/regFileStereotypeNonG.svg) | `app/dialogs/stereotypes-dialog/stereotypes-dialog.component.ts` |
| [`sharedFolder.svg`](svg/sharedFolder.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`sim.svg`](svg/sim.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`styleElement.svg`](svg/styleElement.svg) | `app/models/DrawnPart/OpmObject.ts`, `app/models/DrawnPart/OpmProcess.ts` |
| [`supressHalo.svg`](svg/supressHalo.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`template.svg`](svg/template.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |
| [`timeDuration.svg`](svg/timeDuration.svg) | `app/models/DrawnPart/OpmObject.ts`, `app/models/DrawnPart/OpmProcess.ts` |
| [`unfold.svg`](svg/unfold.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`updateComputationalProcess.svg`](svg/updateComputationalProcess.svg) | `app/models/DrawnPart/OpmObject.ts` |
| [`verFile.svg`](svg/verFile.svg) | `app/dialogs/load-model-dialog/load-model-dialog.component.ts` |

### svg/toolbar

| Asset | Referenciado en |
|-------|------------------|
| [`modelWizard.svg`](svg/toolbar/modelWizard.svg) | — |

## PNG

| Asset | Referenciado en |
|-------|------------------|
| [`key-icon.png`](png/icons/key-icon.png) | `app/dialogs/collaboration-dialog/collaboration-dialog.component.ts` |
| [`pin.png`](png/icons/pin.png) | `app/models/DrawnPart/Note.ts` |
| [`token-icon.png`](png/icons/token-icon.png) | `app/dialogs/collaboration-dialog/collaboration-dialog.component.ts` |
| [`page10.1.png`](png/modelWizard/page10.1.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page10.2.png`](png/modelWizard/page10.2.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page10.3.png`](png/modelWizard/page10.3.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page11.png`](png/modelWizard/page11.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page2.png`](png/modelWizard/page2.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page3.png`](png/modelWizard/page3.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page5.png`](png/modelWizard/page5.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |
| [`page7.png`](png/modelWizard/page7.png) | `app/dialogs/new-model-by-wizard-component/new-model-by-wizard-component.component.ts` |

## Wishlist — assets referenciados pero NO descargados

Lista de paths `assets/...` mencionados en el código extraído y que no
aparecen físicamente en `opm-extracted/assets/`. Útil para futura curaduría
o para implementar fallbacks.

- `assets/OPM_Links/StructuralAgg.png`
- `assets/SVG/redx.png`
- `assets/SVG/stateTypeHalo.svg`
- `assets/config/edx.config.json`
- `assets/gifs/add_requirement.gif`
- `assets/gifs/add_states.gif`
- `assets/gifs/affiliation.gif`
- `assets/gifs/attach_requirement_stereotype.gif`
- `assets/gifs/auto_format.gif`
- `assets/gifs/bring_connected_things.gif`
- `assets/gifs/computation.gif`
- `assets/gifs/create_requirement_view.gif`
- `assets/gifs/create_view.gif`
- `assets/gifs/de_magnifying.gif`
- `assets/gifs/destating.gif`
- `assets/gifs/digital_twin.gif`
- `assets/gifs/draggable_things.gif`
- `assets/gifs/essence.gif`
- `assets/gifs/find_things.gif`
- `assets/gifs/google1.jpg`
- `assets/gifs/handle_navigator.gif`
- `assets/gifs/hyperlink_url.gif`
- `assets/gifs/in_diagram_inzoom.gif`
- `assets/gifs/magnify.gif`
- `assets/gifs/microsoft.jpg`
- `assets/gifs/model_chat_button.gif`
- `assets/gifs/model_chat_handle.gif`
- `assets/gifs/opd_tree_menu.gif`
- `assets/gifs/opl_pane.gif`
- `assets/gifs/remove_time_duration.gif`
- `assets/gifs/set_time_duration.gif`
- `assets/gifs/set_units.gif`
- `assets/gifs/state_set_time_duration.gif`
- `assets/gifs/states.gif`
- `assets/gifs/suppress_single_state.gif`
- `assets/gifs/thing_autoresize.gif`
- `assets/gifs/thing_inzooming.gif`
- `assets/gifs/thing_tree_view.gif`
- `assets/gifs/toggle_mark_things.gif`
- `assets/gifs/toggle_navigator.gif`
- `assets/gifs/toggle_notes.gif`
- `assets/gifs/toggle_range_type.gif`
- `assets/gifs/toggle_requirement.gif`
- `assets/gifs/toggle_single_requirement.gif`
- `assets/gifs/unfolding.gif`
- `assets/gifs/update_computation.gif`
- `assets/icons/OPM_Links/`
- `assets/icons/essenceAffil/AffilObject.JPG`
- `assets/icons/essenceAffil/AffilProcess.JPG`
- `assets/icons/essenceAffil/EssObject.JPG`
- `assets/icons/essenceAffil/EssProcess.jpg`
- `assets/icons/expand_more-24px.svg`
- `assets/icons/key-icon.png`
- `assets/icons/pin.png`
- `assets/icons/token-icon.png`
- `assets/modelWizard/page10.1.png`
- `assets/modelWizard/page10.2.png`
- `assets/modelWizard/page10.3.png`
- `assets/modelWizard/page11.png`
- `assets/modelWizard/page2.png`
- `assets/modelWizard/page3.png`
- `assets/modelWizard/page5.png`
- `assets/modelWizard/page7.png`
- `assets/monaco`
- `assets/workers/typings-worker.js`