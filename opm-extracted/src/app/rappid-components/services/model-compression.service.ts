// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/model-compression.service.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Service for compressing and decompressing model files by removing default values.
 * This reduces file size while maintaining backward compatibility.
 */
let ModelCompressionService = /*#__PURE__*/(() => {
  class ModelCompressionService {
    constructor(oplService) {
      this.oplService = oplService;
      this.cachedSystemDefaults = null;
      /**
       * Prepares model for saving to backend by compressing.
       * The compressionMetadata field is stored in the backend so we can restore defaults when loading.
       */
      this.ENABLE_COMPRESSION = true;
    }
    /**
     * Get current user defaults (or system defaults if not set)
     * Uses the same priority as OPL service: user settings -> org settings -> system defaults
     * This matches what elements actually use when created
     */
    getUserDefaults() {
      // Get system defaults as base
      const objectDefaults = this.oplService.getObjectStyleDefaultSettings();
      const processDefaults = this.oplService.getProcessStyleDefaultSettings();
      const stateDefaults = this.oplService.getStateStyleDefaultSettings();
      // Get computed settings using same priority as updateUserObjectStyleSettings:
      // user settings -> org settings -> system defaults
      const getComputedValue = (type, key, defaultValue) => {
        const userValue = this.oplService.settings.style?.[type]?.[key];
        if (userValue !== undefined && userValue !== null) {
          return userValue;
        }
        const orgValue = this.oplService.orgSettings.style?.[type]?.[key];
        if (orgValue !== undefined && orgValue !== null) {
          return orgValue;
        }
        return defaultValue;
      };
      return {
        object: {
          fill_color: getComputedValue("object", "fill_color", objectDefaults.fill_color),
          border_color: getComputedValue("object", "border_color", objectDefaults.border_color),
          font: getComputedValue("object", "font", objectDefaults.font || "Arial"),
          font_size: getComputedValue("object", "font_size", objectDefaults.font_size || 14),
          text_color: getComputedValue("object", "text_color", objectDefaults.text_color)
        },
        process: {
          fill_color: getComputedValue("process", "fill_color", processDefaults.fill_color),
          border_color: getComputedValue("process", "border_color", processDefaults.border_color),
          font: getComputedValue("process", "font", processDefaults.font || "Arial"),
          font_size: getComputedValue("process", "font_size", processDefaults.font_size || 14),
          text_color: getComputedValue("process", "text_color", processDefaults.text_color)
        },
        state: {
          font_size: getComputedValue("state", "font_size", stateDefaults.font_size || 14),
          font: getComputedValue("state", "font", stateDefaults.font || "Arial"),
          text_color: getComputedValue("state", "text_color", stateDefaults.text_color),
          border_color: getComputedValue("state", "border_color", stateDefaults.border_color),
          fill_color: getComputedValue("state", "fill_color", stateDefaults.fill_color)
        }
      };
    }
    /**
     * Get current OPL defaults (essence, affiliation) that affect model element creation
     */
    getOplDefaults() {
      // Get from oplDefaultSettings which is updated by the service
      // First try userOplSettings (for essence), then fall back to oplDefaultSettings
      const userOplSettings = this.oplService.userOplSettings;
      return {
        essence: userOplSettings?.essence !== undefined ? userOplSettings.essence : oplDefaultSettings.essence || 0,
        // Default: Physical (0)
        affiliation: oplDefaultSettings?.affiliation !== undefined ? oplDefaultSettings.affiliation : 0 // Default: Systemic (0)
      };
    }
    /**
     * Get system defaults dynamically from model classes (cached for performance)
     */
    getSystemDefaults() {
      if (this.cachedSystemDefaults) {
        return this.cachedSystemDefaults;
      }
      try {
        // Create a temporary OpmModel (not BasicOpmModel) to extract defaults
        // OpmModel has getOplService() which logical elements need
        const tempModel = new OpmModel();
        // Always set an OplService (use real one if available, otherwise mock)
        // This is critical because logical elements call getOplService() in their constructors
        const oplServiceToUse = this.oplService || {
          settings: {
            style: {
              object: defaultObjectStyleSettings,
              process: defaultProcessStyleSettings,
              state: defaultStateStyleSettings
            },
            autoFormat: true,
            numericComputationalDigits: undefined
          },
          getObjectStyleDefaultSettings: () => defaultObjectStyleSettings,
          getProcessStyleDefaultSettings: () => defaultProcessStyleSettings,
          getStateStyleDefaultSettings: () => defaultStateStyleSettings
        };
        tempModel.setOplService(oplServiceToUse);
        // Verify that getOplService() works before creating elements
        if (!tempModel.getOplService()) {
          throw new Error("Failed to set OplService on temporary model");
        }
        // Create temporary elements with no params to get defaults
        const tempObject = logicalFactory(EntityType.Object, tempModel, null);
        const tempProcess = logicalFactory(EntityType.Process, tempModel, null);
        const tempState = logicalFactory(EntityType.State, tempModel, null);
        const tempRelation = logicalFactory(RelationType.Procedural, tempModel, null);
        // Get visual defaults by calling setDefaultStyleFields
        const tempVisual = tempObject.visualElements[0];
        if (tempVisual && tempVisual.setDefaultStyleFields) {
          tempVisual.setDefaultStyleFields();
        }
        // Extract defaults from the created elements (use 'any' to avoid TypeScript errors)
        const objectParams = tempObject.getParams();
        const processParams = tempProcess.getParams();
        const stateParams = tempState.getParams();
        // Relations need visual elements (links) to get params, which don't exist in temporary model
        // Skip extraction and use hardcoded defaults directly
        const relationParams = {
          condition: false,
          event: false,
          negation: false,
          path: null,
          linkConnectionType: 1,
          linkRequirements: "",
          sourceLogicalConnection: null,
          targetLogicalConnection: null
        };
        const visualParams = tempVisual ? tempVisual.getElementParams() : {};
        // Build system defaults from extracted values
        this.cachedSystemDefaults = {
          visualElements: {
            fill: visualParams.fill || "#FFFFFF",
            refX: visualParams.refX ?? 0.5,
            refY: visualParams.refY ?? 0.5,
            xAlign: visualParams.xAlign || "middle",
            yAlign: visualParams.yAlign || "middle",
            textAnchor: visualParams.textAnchor || "middle",
            textWidth: visualParams.textWidth || "80%",
            textHeight: visualParams.textHeight || "80%",
            strokeWidth: visualParams.strokeWidth ?? 2,
            textColor: visualParams.textColor || "#000002",
            textFontFamily: visualParams.textFontFamily || "Arial",
            textFontSize: visualParams.textFontSize ?? 14,
            textFontWeight: visualParams.textFontWeight ?? 600,
            isManualTextPos: visualParams.isManualTextPos ?? false,
            descriptionStatus: visualParams.descriptionStatus || " ",
            ports: visualParams.ports || [],
            children: visualParams.children || [],
            semiFolded: visualParams.semiFolded || [],
            showBackgroundImage: visualParams.showBackgroundImage ?? null,
            foldedUnderThing: visualParams.foldedUnderThing || {
              isFolded: false,
              triangleType: null,
              realTarget: null,
              targetPos: {
                xPos: null,
                yPos: null
              }
            },
            statesArrangement: visualParams.statesArrangement ?? 1,
            refineableId: visualParams.refineableId ?? null,
            refineeInzoomingId: visualParams.refineeInzoomingId ?? null,
            refineeUnfoldingId: visualParams.refineeUnfoldingId ?? null,
            digitalTwin: visualParams.digitalTwin ?? null,
            predigitalTwin: visualParams.predigitalTwin ?? null,
            originalObj: visualParams.originalObj ?? null,
            preoriginalObj: visualParams.preoriginalObj ?? null,
            digitalTwinConnected: visualParams.digitalTwinConnected ?? null,
            lastStatesOrder: visualParams.lastStatesOrder || [],
            fatherObjectId: visualParams.fatherObjectId ?? null
          },
          logicalElements: {
            URLarray: objectParams.URLarray || [{
              description: " ",
              iconType: "picture",
              url: "http://"
            }],
            belongsToFatherModelId: objectParams.belongsToFatherModelId ?? null,
            isAutoFormat: objectParams.isAutoFormat ?? true,
            description: objectParams.description || "",
            orderedFundamentalTypes: objectParams.orderedFundamentalTypes || [],
            protectedFromBeingRefinedBySubModel: objectParams.protectedFromBeingRefinedBySubModel ?? null,
            essence: objectParams.essence ?? 0,
            affiliation: objectParams.affiliation ?? 0,
            shouldBeGreyed: objectParams.shouldBeGreyed ?? false,
            isMainThing: objectParams.isMainThing ?? false,
            equivalentFromStereotypeLID: objectParams.equivalentFromStereotypeLID ?? null,
            backgroundImageUrl: objectParams.backgroundImageUrl || "",
            valueType: objectParams.valueType ?? 0,
            value: objectParams.value || "None",
            units: objectParams.units || "",
            statesWithoutVisual: objectParams.statesWithoutVisual || [],
            alias: objectParams.alias ?? null,
            validation: objectParams.validation || {},
            valuedObjectForId: objectParams.valuedObjectForId ?? null,
            simulationParams: objectParams.simulationParams || {
              bernoulli: false,
              binomial: false,
              distribution: "uniform",
              exponential: false,
              geometric: false,
              normal: false,
              numerical: false,
              poisson: false,
              simulated: false,
              textualArray: [{
                percent: "",
                text: ""
              }],
              uniform: true
            },
            satisfiedRequirementsSetParams: objectParams.satisfiedRequirementsSetParams || {
              isRequirementObject: false,
              isRequirementSetObject: false,
              logicalRequirementSetObjectLID: null,
              ownerLID: null,
              setObjectPos: null,
              requirements: null
            },
            code: processParams.code ?? 0,
            insertedFunction: processParams.insertedFunction || "None",
            condition: relationParams.condition ?? false,
            event: relationParams.event ?? false,
            negation: relationParams.negation ?? false,
            path: relationParams.path ?? null,
            linkConnectionType: relationParams.linkConnectionType ?? 1,
            linkRequirements: relationParams.linkRequirements || "",
            sourceLogicalConnection: relationParams.sourceLogicalConnection ?? null,
            targetLogicalConnection: relationParams.targetLogicalConnection ?? null,
            min: processParams.min ?? null,
            nominal: processParams.nominal ?? null,
            max: processParams.max ?? null,
            timeDurationStatus: processParams.timeDurationStatus ?? null,
            durationDistributionKind: processParams.durationDistributionKind ?? null,
            durationDistributionParams: processParams.durationDistributionParams ?? null,
            isWaitingProcess: processParams.isWaitingProcess ?? false,
            waitingProcessLid: processParams.waitingProcessLid ?? null,
            needUserInput: processParams.needUserInput ?? null,
            userInputPromptMessage: processParams.userInputPromptMessage ?? null,
            stateType: stateParams.stateType || "none"
          }
        };
        return this.cachedSystemDefaults;
      } catch (error) {
        console.error("[ModelCompression] Error getting system defaults dynamically, using fallback:", error);
        // Fallback to hardcoded defaults if dynamic extraction fails
        // This ensures compression still works even if model creation fails
        this.cachedSystemDefaults = {
          visualElements: {
            fill: "#FFFFFF",
            refX: 0.5,
            refY: 0.5,
            xAlign: "middle",
            yAlign: "middle",
            textAnchor: "middle",
            textWidth: "80%",
            textHeight: "80%",
            strokeWidth: 2,
            textColor: "#000002",
            textFontFamily: "Arial",
            textFontSize: 14,
            textFontWeight: 600,
            isManualTextPos: false,
            descriptionStatus: " ",
            ports: [],
            children: [],
            semiFolded: [],
            showBackgroundImage: null,
            foldedUnderThing: {
              isFolded: false,
              triangleType: null,
              realTarget: null,
              targetPos: {
                xPos: null,
                yPos: null
              }
            },
            statesArrangement: 1,
            refineableId: null,
            refineeInzoomingId: null,
            refineeUnfoldingId: null,
            digitalTwin: null,
            predigitalTwin: null,
            originalObj: null,
            preoriginalObj: null,
            digitalTwinConnected: null,
            lastStatesOrder: [],
            fatherObjectId: null
          },
          logicalElements: {
            URLarray: [{
              description: " ",
              iconType: "picture",
              url: "http://"
            }],
            belongsToFatherModelId: null,
            isAutoFormat: true,
            description: "",
            orderedFundamentalTypes: [],
            protectedFromBeingRefinedBySubModel: null,
            essence: 0,
            affiliation: 0,
            shouldBeGreyed: false,
            isMainThing: false,
            equivalentFromStereotypeLID: null,
            backgroundImageUrl: "",
            valueType: 0,
            value: "None",
            units: "",
            statesWithoutVisual: [],
            alias: null,
            validation: {},
            valuedObjectForId: null,
            simulationParams: {
              bernoulli: false,
              binomial: false,
              distribution: "uniform",
              exponential: false,
              geometric: false,
              normal: false,
              numerical: false,
              poisson: false,
              simulated: false,
              textualArray: [{
                percent: "",
                text: ""
              }],
              uniform: true
            },
            satisfiedRequirementsSetParams: {
              isRequirementObject: false,
              isRequirementSetObject: false,
              logicalRequirementSetObjectLID: null,
              ownerLID: null,
              setObjectPos: null,
              requirements: null
            },
            code: 0,
            insertedFunction: "None",
            condition: false,
            event: false,
            negation: false,
            path: null,
            linkConnectionType: 1,
            linkRequirements: "",
            sourceLogicalConnection: null,
            targetLogicalConnection: null,
            min: null,
            nominal: null,
            max: null,
            timeDurationStatus: null,
            durationDistributionKind: null,
            durationDistributionParams: null,
            isWaitingProcess: false,
            waitingProcessLid: null,
            needUserInput: null,
            userInputPromptMessage: null,
            stateType: "none"
          }
        };
        return this.cachedSystemDefaults;
      }
    }
    /**
     * Compress model by removing default values
     * IMPORTANT: Preserves all top-level fields required by backend
     */
    compressModel(model) {
      if (!model) {
        return model;
      }
      // Deep clone to avoid mutating original
      const compressed = JSON.parse(JSON.stringify(model));
      const userDefaults = this.getUserDefaults();
      const systemDefaults = this.getSystemDefaults();
      // Ensure required backend fields exist (even if empty)
      // Backend expects: title, description, archiveMode, image, fatherModelId,
      // currentOpd, opds, logicalElements, stereotypes, autoOpdTreeSort,
      // importedTemplates, relatedRelations, fatherModelName
      if (compressed.currentOpd === undefined) {
        compressed.currentOpd = null;
      }
      if (compressed.opds === undefined) {
        compressed.opds = [];
      }
      if (compressed.logicalElements === undefined) {
        compressed.logicalElements = [];
      }
      if (compressed.stereotypes === undefined) {
        compressed.stereotypes = [];
      }
      if (compressed.importedTemplates === undefined) {
        compressed.importedTemplates = {};
      }
      if (compressed.relatedRelations === undefined) {
        compressed.relatedRelations = [];
      }
      // Store user defaults and OPL defaults snapshot for decompression
      // Using 'compressionMetadata' instead of '_compression' to avoid backend filtering
      const oplDefaults = this.getOplDefaults();
      compressed.compressionMetadata = {
        version: "1.0",
        userDefaults: userDefaults,
        oplDefaults: oplDefaults,
        timestamp: Date.now()
      };
      // User defaults are captured and stored in compressionMetadata for restoration
      // Remove defaults from logical elements and their visual elements
      if (compressed.logicalElements) {
        compressed.logicalElements.forEach(logical => {
          if (logical.visualElementsParams) {
            logical.visualElementsParams.forEach(visual => {
              this.removeVisualDefaults(visual, logical.name, userDefaults, systemDefaults);
            });
          }
          this.removeLogicalDefaults(logical, systemDefaults, oplDefaults);
          // Clean up empty values within logical element, but preserve the element itself
          this.removeEmptyValues(logical);
        });
      }
      // Remove defaults from stereotypes
      if (compressed.stereotypes) {
        compressed.stereotypes.forEach(stereotype => {
          if (stereotype.data?.logicalElements) {
            stereotype.data.logicalElements.forEach(logical => {
              if (logical.visualElementsParams) {
                logical.visualElementsParams.forEach(visual => {
                  this.removeVisualDefaults(visual, logical.name, userDefaults, systemDefaults);
                });
              }
              this.removeLogicalDefaults(logical, systemDefaults, oplDefaults);
              this.removeEmptyValues(logical);
            });
          }
          // Clean up stereotype data, but don't remove the stereotype itself
          if (stereotype.data) {
            this.removeEmptyValues(stereotype.data);
          }
        });
      }
      // Remove defaults from OPDS (notes only - don't touch opd structure)
      // OPDs have many required fields: name, id, parendId, visualElements, children, 
      // notes, noteLinks, permissions, isRangesOpd, isHidden, isViewOpd, etc.
      // We should NOT remove any of these fields, even if empty
      if (compressed.opds) {
        compressed.opds.forEach(opd => {
          // Only clean up notes array items, not the opd structure itself
          if (opd.notes && Array.isArray(opd.notes)) {
            opd.notes.forEach(note => {
              // Clean up note content, but preserve note structure
              if (note && typeof note === "object") {
                // Only remove truly empty/null values from notes, not the note itself
                Object.keys(note).forEach(key => {
                  if (note[key] === null || note[key] === undefined || Array.isArray(note[key]) && note[key].length === 0) {
                    delete note[key];
                  }
                });
              }
            });
          }
          // DO NOT call removeEmptyValues on opd - it has required fields
        });
      }
      // Remove defaults from currentOpd (very carefully)
      // currentOpd has required fields: name, id, parendId, visualElements, notes, noteLinks
      // We should NOT remove any of these fields
      if (compressed.currentOpd) {
        // Only clean up notes, not the currentOpd structure
        if (compressed.currentOpd.notes && Array.isArray(compressed.currentOpd.notes)) {
          compressed.currentOpd.notes.forEach(note => {
            if (note && typeof note === "object") {
              Object.keys(note).forEach(key => {
                if (note[key] === null || note[key] === undefined || Array.isArray(note[key]) && note[key].length === 0) {
                  delete note[key];
                }
              });
            }
          });
        }
        // DO NOT call removeEmptyValues on currentOpd - it has required fields
      }
      // DO NOT call removeEmptyValues on the top-level model object
      // This would remove required metadata fields like title, description, etc.
      // Only clean up the data structures within (logicalElements, stereotypes)
      return compressed;
    }
    /**
     * Remove visual element defaults based on element type and user defaults
     */
    removeVisualDefaults(visual, logicalType, userDefaults, systemDefaults) {
      // Determine element type (Object, Process, or State)
      const isObject = logicalType === "OpmLogicalObject";
      const isProcess = logicalType === "OpmLogicalProcess";
      const isState = logicalType === "OpmLogicalState";
      // Get appropriate user defaults
      const typeDefaults = isObject ? userDefaults.object : isProcess ? userDefaults.process : userDefaults.state;
      // Remove style properties that match user defaults
      // Font and font size should be preserved if they differ from defaults (for all element types)
      if (isObject || isProcess || isState) {
        if (visual.fill === typeDefaults.fill_color) {
          delete visual.fill;
        }
        if (visual.strokeColor === typeDefaults.border_color) {
          delete visual.strokeColor;
        }
        if (visual.textColor === typeDefaults.text_color) {
          delete visual.textColor;
        }
        // Only remove font/font size if they match user defaults - preserve if different
        // Use loose comparison to handle type mismatches (string vs number)
        // Only remove if both the visual property exists AND it matches the user default
        if (typeDefaults.font != null && visual.textFontFamily != null) {
          const visualFont = String(visual.textFontFamily).trim();
          const defaultFont = String(typeDefaults.font).trim();
          if (visualFont === defaultFont) {
            delete visual.textFontFamily;
          }
        }
        if (typeDefaults.font_size != null && visual.textFontSize != null) {
          const visualSize = Number(visual.textFontSize);
          const defaultSize = Number(typeDefaults.font_size);
          if (!isNaN(visualSize) && !isNaN(defaultSize) && visualSize === defaultSize) {
            delete visual.textFontSize;
          }
        }
      }
      // Remove system defaults (not user-configurable)
      if (visual.refX === systemDefaults.visualElements.refX) {
        delete visual.refX;
      }
      if (visual.refY === systemDefaults.visualElements.refY) {
        delete visual.refY;
      }
      if (visual.xAlign === systemDefaults.visualElements.xAlign) {
        delete visual.xAlign;
      }
      if (visual.yAlign === systemDefaults.visualElements.yAlign) {
        delete visual.yAlign;
      }
      if (visual.textAnchor === systemDefaults.visualElements.textAnchor) {
        delete visual.textAnchor;
      }
      if (visual.textWidth === systemDefaults.visualElements.textWidth) {
        delete visual.textWidth;
      }
      if (visual.textHeight === systemDefaults.visualElements.textHeight) {
        delete visual.textHeight;
      }
      if (visual.strokeWidth === systemDefaults.visualElements.strokeWidth) {
        delete visual.strokeWidth;
      }
      // textColor, textFontFamily, textFontSize are already checked against user defaults above
      // Don't check against system defaults here to avoid conflicts
      if (visual.textFontWeight === systemDefaults.visualElements.textFontWeight) {
        delete visual.textFontWeight;
      }
      if (visual.isManualTextPos === systemDefaults.visualElements.isManualTextPos) {
        delete visual.isManualTextPos;
      }
      if (visual.descriptionStatus === systemDefaults.visualElements.descriptionStatus) {
        delete visual.descriptionStatus;
      }
      // Remove empty arrays
      if (Array.isArray(visual.ports) && visual.ports.length === 0) {
        delete visual.ports;
      }
      if (Array.isArray(visual.children) && visual.children.length === 0) {
        delete visual.children;
      }
      if (Array.isArray(visual.semiFolded) && visual.semiFolded.length === 0) {
        delete visual.semiFolded;
      }
      // Remove null values
      if (visual.showBackgroundImage === null) {
        delete visual.showBackgroundImage;
      }
      if (visual.refineableId === null) {
        delete visual.refineableId;
      }
      if (visual.refineeInzoomingId === null) {
        delete visual.refineeInzoomingId;
      }
      if (visual.refineeUnfoldingId === null) {
        delete visual.refineeUnfoldingId;
      }
      if (visual.digitalTwin === null) {
        delete visual.digitalTwin;
      }
      if (visual.predigitalTwin === null) {
        delete visual.predigitalTwin;
      }
      if (visual.originalObj === null) {
        delete visual.originalObj;
      }
      if (visual.preoriginalObj === null) {
        delete visual.preoriginalObj;
      }
      if (visual.digitalTwinConnected === null) {
        delete visual.digitalTwinConnected;
      }
      if (visual.fatherObjectId === null) {
        delete visual.fatherObjectId;
      }
      // Remove default foldedUnderThing
      if (visual.foldedUnderThing && visual.foldedUnderThing.isFolded === false && visual.foldedUnderThing.triangleType === null && visual.foldedUnderThing.realTarget === null) {
        delete visual.foldedUnderThing;
      }
      // Remove default statesArrangement
      if (visual.statesArrangement === systemDefaults.visualElements.statesArrangement) {
        delete visual.statesArrangement;
      }
    }
    /**
     * Remove logical element defaults
     */
    removeLogicalDefaults(logical, systemDefaults, oplDefaults) {
      // Remove default URLarray
      if (logical.URLarray && Array.isArray(logical.URLarray) && logical.URLarray.length === 1 && logical.URLarray[0].description === " " && logical.URLarray[0].iconType === "picture" && logical.URLarray[0].url === "http://") {
        delete logical.URLarray;
      }
      // Remove null values
      if (logical.belongsToFatherModelId === null) {
        delete logical.belongsToFatherModelId;
      }
      if (logical.protectedFromBeingRefinedBySubModel === null) {
        delete logical.protectedFromBeingRefinedBySubModel;
      }
      if (logical.equivalentFromStereotypeLID === null) {
        delete logical.equivalentFromStereotypeLID;
      }
      if (logical.backgroundImageUrl === "") {
        delete logical.backgroundImageUrl;
      }
      if (logical.value === "None") {
        delete logical.value;
      }
      if (logical.units === "") {
        delete logical.units;
      }
      if (logical.description === "") {
        delete logical.description;
      }
      if (logical.alias === null) {
        delete logical.alias;
      }
      if (logical.valuedObjectForId === null) {
        delete logical.valuedObjectForId;
      }
      if (logical.path === null) {
        delete logical.path;
      }
      if (logical.sourceLogicalConnection === null) {
        delete logical.sourceLogicalConnection;
      }
      if (logical.targetLogicalConnection === null) {
        delete logical.targetLogicalConnection;
      }
      if (logical.linkRequirements === "") {
        delete logical.linkRequirements;
      }
      if (logical.waitingProcessLid === null) {
        delete logical.waitingProcessLid;
      }
      if (logical.needUserInput === null) {
        delete logical.needUserInput;
      }
      if (logical.userInputPromptMessage === null) {
        delete logical.userInputPromptMessage;
      }
      // Remove empty arrays
      if (Array.isArray(logical.orderedFundamentalTypes) && logical.orderedFundamentalTypes.length === 0) {
        delete logical.orderedFundamentalTypes;
      }
      if (Array.isArray(logical.statesWithoutVisual) && logical.statesWithoutVisual.length === 0) {
        delete logical.statesWithoutVisual;
      }
      // Remove default booleans
      if (logical.isAutoFormat === true) {
        delete logical.isAutoFormat;
      }
      if (logical.shouldBeGreyed === false) {
        delete logical.shouldBeGreyed;
      }
      if (logical.isMainThing === false) {
        delete logical.isMainThing;
      }
      if (logical.condition === false) {
        delete logical.condition;
      }
      if (logical.event === false) {
        delete logical.event;
      }
      if (logical.negation === false) {
        delete logical.negation;
      }
      if (logical.isWaitingProcess === false) {
        delete logical.isWaitingProcess;
      }
      // Remove default numbers
      // NOTE: essence and affiliation can be 0 (valid value), so only remove if truly default
      // essence: 0=physical, 1=informational (default is 0, but 0 is a valid value!)
      // affiliation: 0=systemic, 1=environmental (default is 0, but 0 is a valid value!)
      // We should NOT remove these if they're 0, as 0 is a meaningful value
      // Only remove if they're undefined/null (which shouldn't happen, but be safe)
      // Actually, we should never remove essence/affiliation - they're always meaningful
      if (logical.valueType === 0) {
        delete logical.valueType;
      }
      if (logical.code === 0) {
        delete logical.code;
      }
      if (logical.linkConnectionType === 1) {
        delete logical.linkConnectionType;
      }
      if (logical.nominal === null) {
        delete logical.nominal;
      }
      if (logical.min === null) {
        delete logical.min;
      }
      if (logical.max === null) {
        delete logical.max;
      }
      if (logical.timeDurationStatus === null) {
        delete logical.timeDurationStatus;
      }
      if (logical.durationDistributionKind == null || logical.durationDistributionKind === "none") {
        delete logical.durationDistributionKind;
      }
      if (!logical.durationDistributionParams || Object.keys(logical.durationDistributionParams).length === 0) {
        delete logical.durationDistributionParams;
      }
      if (logical.units === "sec") {
        delete logical.units;
      }
      if (logical.insertedFunction === "None") {
        delete logical.insertedFunction;
      }
      if (logical.stateType === "none") {
        delete logical.stateType;
      }
      // Remove default objects
      if (logical.validation && Object.keys(logical.validation).length === 0) {
        delete logical.validation;
      }
      // Remove default simulationParams
      if (logical.simulationParams) {
        const sim = logical.simulationParams;
        if (sim.bernoulli === false && sim.binomial === false && sim.distribution === "uniform" && sim.exponential === false && sim.geometric === false && sim.normal === false && sim.numerical === false && sim.poisson === false && sim.simulated === false && sim.uniform === true && Array.isArray(sim.textualArray) && sim.textualArray.length === 1 && sim.textualArray[0].percent === "" && sim.textualArray[0].text === "") {
          delete logical.simulationParams;
        }
      }
      // Remove default satisfiedRequirementsSetParams
      if (logical.satisfiedRequirementsSetParams) {
        const req = logical.satisfiedRequirementsSetParams;
        if (req.isRequirementObject === false && req.isRequirementSetObject === false && req.logicalRequirementSetObjectLID === null && req.ownerLID === null && req.setObjectPos === null && req.requirements === null) {
          delete logical.satisfiedRequirementsSetParams;
        }
      }
    }
    /**
     * Remove empty values from the model recursively
     * IMPORTANT: Do NOT remove top-level model fields that backend expects:
     * - title, description, sysExample, globalTemplate, image, archiveMode, fatherModelId
     * - currentOpd, opds, logicalElements, stereotypes
     * - autoOpdTreeSort, importedTemplates, relatedRelations, fatherModelName
     * - name, permissions, hasUnsavedWork (from toJson output)
     */
    removeEmptyValues(obj, depth = 0) {
      // Safety limit to prevent infinite recursion
      if (depth > 20) {
        console.warn("[ModelCompression] removeEmptyValues: Max depth reached, stopping recursion");
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach(item => this.removeEmptyValues(item, depth + 1));
      } else if (obj !== null && typeof obj === "object") {
        Object.keys(obj).forEach(key => {
          // Skip compression metadata (both old and new field names)
          if (key === "_compression" || key === "compressionMetadata") {
            return;
          }
          // NEVER remove these top-level fields that backend requires
          const protectedFields = ["title", "description", "sysExample", "globalTemplate", "image", "archiveMode", "fatherModelId", "currentOpd", "opds", "logicalElements", "stereotypes", "autoOpdTreeSort", "importedTemplates", "relatedRelations", "fatherModelName", "id", "name", "permissions", "hasUnsavedWork"];
          // At top level (depth 0), protect all these fields
          if (depth === 0 && protectedFields.includes(key)) {
            // Still clean nested values, but don't delete the field itself
            if (obj[key] !== null && obj[key] !== undefined) {
              this.removeEmptyValues(obj[key], depth + 1);
            }
            return;
          }
          const value = obj[key];
          if (value === null || value === undefined) {
            delete obj[key];
          } else if (Array.isArray(value) && value.length === 0) {
            // Don't remove empty arrays if they're protected fields (even at depth > 0)
            if (!protectedFields.includes(key)) {
              delete obj[key];
            }
          } else if (typeof value === "object" && Object.keys(value).length === 0) {
            // Don't remove empty objects if they're protected fields
            if (!protectedFields.includes(key)) {
              delete obj[key];
            }
          } else {
            this.removeEmptyValues(value, depth + 1);
          }
        });
      }
    }
    /**
     * Decompress model by restoring default values
     */
    decompressModel(compressed) {
      if (!compressed) {
        return compressed;
      }
      const model = JSON.parse(JSON.stringify(compressed));
      const metadata = model.compressionMetadata;
      if (!metadata) {
        return model;
      }
      // Use stored user defaults, or current user defaults if not stored
      const userDefaults = metadata?.userDefaults || this.getUserDefaults();
      const systemDefaults = this.getSystemDefaults();
      // Use stored OPL defaults (essence/affiliation) for proper restoration
      const oplDefaults = metadata?.oplDefaults || this.getOplDefaults();
      // Restore defaults
      let restoredCount = 0;
      if (model.logicalElements) {
        model.logicalElements.forEach(logical => {
          if (logical.visualElementsParams) {
            logical.visualElementsParams.forEach(visual => {
              this.restoreVisualDefaults(visual, logical.name, userDefaults, systemDefaults);
              restoredCount++;
            });
          }
          this.restoreLogicalDefaults(logical, systemDefaults, oplDefaults);
        });
      }
      // Decompression complete - defaults restored
      // Remove compression metadata after decompression
      delete model.compressionMetadata;
      return model;
    }
    /**
     * Restore visual element defaults
     */
    restoreVisualDefaults(visual, logicalType, userDefaults, systemDefaults) {
      const isObject = logicalType === "OpmLogicalObject";
      const isProcess = logicalType === "OpmLogicalProcess";
      const isState = logicalType === "OpmLogicalState";
      const typeDefaults = isObject ? userDefaults.object : isProcess ? userDefaults.process : userDefaults.state;
      // Restore user defaults (for user-configurable style properties)
      if (isObject || isProcess || isState) {
        visual.fill = visual.fill ?? typeDefaults.fill_color;
        visual.strokeColor = visual.strokeColor ?? typeDefaults.border_color;
        visual.textColor = visual.textColor ?? typeDefaults.text_color;
        // Font and font size: ALWAYS restore from saved user defaults if missing
        // This ensures elements that matched user defaults at save time get restored correctly
        // If the property is undefined/null/empty, it was removed during compression because it matched user defaults
        // So we MUST restore it from the saved user defaults (typeDefaults)
        // Font and font size: ALWAYS restore from saved user defaults if missing
        // This ensures elements that matched user defaults at save time get restored correctly
        // If the property is undefined/null/empty, it was removed during compression because it matched user defaults
        // So we MUST restore it from the saved user defaults (typeDefaults)
        const hadFontBefore = visual.textFontFamily !== undefined && visual.textFontFamily !== null && String(visual.textFontFamily).trim() !== "";
        const hadFontSizeBefore = visual.textFontSize !== undefined && visual.textFontSize !== null && Number(visual.textFontSize) > 0;
        if (!hadFontBefore) {
          if (typeDefaults.font) {
            visual.textFontFamily = String(typeDefaults.font).trim();
          } else {
            // Fallback to system default if saved default is missing
            visual.textFontFamily = systemDefaults.visualElements.textFontFamily || "Arial";
          }
        }
        if (!hadFontSizeBefore) {
          if (typeDefaults.font_size) {
            visual.textFontSize = Number(typeDefaults.font_size);
          } else {
            // Fallback to system default if saved default is missing
            visual.textFontSize = systemDefaults.visualElements.textFontSize || 14;
          }
        }
      }
      // Restore system defaults (for non-user-configurable properties)
      visual.refX = visual.refX ?? systemDefaults.visualElements.refX;
      visual.refY = visual.refY ?? systemDefaults.visualElements.refY;
      visual.xAlign = visual.xAlign ?? systemDefaults.visualElements.xAlign;
      visual.yAlign = visual.yAlign ?? systemDefaults.visualElements.yAlign;
      visual.textAnchor = visual.textAnchor ?? systemDefaults.visualElements.textAnchor;
      visual.textWidth = visual.textWidth ?? systemDefaults.visualElements.textWidth;
      visual.textHeight = visual.textHeight ?? systemDefaults.visualElements.textHeight;
      visual.strokeWidth = visual.strokeWidth ?? systemDefaults.visualElements.strokeWidth;
      // Note: textColor, textFontFamily, textFontSize are already restored from user defaults above
      visual.textFontWeight = visual.textFontWeight ?? systemDefaults.visualElements.textFontWeight;
      visual.isManualTextPos = visual.isManualTextPos ?? systemDefaults.visualElements.isManualTextPos;
      visual.descriptionStatus = visual.descriptionStatus ?? systemDefaults.visualElements.descriptionStatus;
      visual.ports = visual.ports ?? systemDefaults.visualElements.ports;
      visual.children = visual.children ?? systemDefaults.visualElements.children;
      visual.semiFolded = visual.semiFolded ?? systemDefaults.visualElements.semiFolded;
      visual.showBackgroundImage = visual.showBackgroundImage ?? systemDefaults.visualElements.showBackgroundImage;
      visual.refineableId = visual.refineableId ?? systemDefaults.visualElements.refineableId;
      visual.refineeInzoomingId = visual.refineeInzoomingId ?? systemDefaults.visualElements.refineeInzoomingId;
      visual.refineeUnfoldingId = visual.refineeUnfoldingId ?? systemDefaults.visualElements.refineeUnfoldingId;
      visual.digitalTwin = visual.digitalTwin ?? systemDefaults.visualElements.digitalTwin;
      visual.predigitalTwin = visual.predigitalTwin ?? systemDefaults.visualElements.predigitalTwin;
      visual.originalObj = visual.originalObj ?? systemDefaults.visualElements.originalObj;
      visual.preoriginalObj = visual.preoriginalObj ?? systemDefaults.visualElements.preoriginalObj;
      visual.digitalTwinConnected = visual.digitalTwinConnected ?? systemDefaults.visualElements.digitalTwinConnected;
      visual.fatherObjectId = visual.fatherObjectId ?? systemDefaults.visualElements.fatherObjectId;
      visual.statesArrangement = visual.statesArrangement ?? systemDefaults.visualElements.statesArrangement;
      // Restore foldedUnderThing
      if (!visual.foldedUnderThing) {
        visual.foldedUnderThing = systemDefaults.visualElements.foldedUnderThing;
      }
    }
    /**
     * Restore logical element defaults
     */
    restoreLogicalDefaults(logical, systemDefaults, oplDefaults) {
      // Restore URLarray
      if (!logical.URLarray) {
        logical.URLarray = systemDefaults.logicalElements.URLarray;
      }
      // Restore other defaults
      logical.belongsToFatherModelId = logical.belongsToFatherModelId ?? systemDefaults.logicalElements.belongsToFatherModelId;
      logical.isAutoFormat = logical.isAutoFormat ?? systemDefaults.logicalElements.isAutoFormat;
      logical.description = logical.description ?? systemDefaults.logicalElements.description;
      logical.orderedFundamentalTypes = logical.orderedFundamentalTypes ?? systemDefaults.logicalElements.orderedFundamentalTypes;
      logical.protectedFromBeingRefinedBySubModel = logical.protectedFromBeingRefinedBySubModel ?? systemDefaults.logicalElements.protectedFromBeingRefinedBySubModel;
      // essence and affiliation can be 0 (valid value), so check for undefined explicitly
      // Use saved OPL defaults if available, otherwise use system defaults
      if (logical.essence === undefined) {
        logical.essence = oplDefaults?.essence !== undefined ? oplDefaults.essence : systemDefaults.logicalElements.essence;
      }
      if (logical.affiliation === undefined) {
        logical.affiliation = oplDefaults?.affiliation !== undefined ? oplDefaults.affiliation : systemDefaults.logicalElements.affiliation;
      }
      logical.shouldBeGreyed = logical.shouldBeGreyed ?? systemDefaults.logicalElements.shouldBeGreyed;
      logical.isMainThing = logical.isMainThing ?? systemDefaults.logicalElements.isMainThing;
      logical.equivalentFromStereotypeLID = logical.equivalentFromStereotypeLID ?? systemDefaults.logicalElements.equivalentFromStereotypeLID;
      logical.backgroundImageUrl = logical.backgroundImageUrl ?? systemDefaults.logicalElements.backgroundImageUrl;
      logical.valueType = logical.valueType ?? systemDefaults.logicalElements.valueType;
      logical.value = logical.value ?? systemDefaults.logicalElements.value;
      logical.units = logical.units ?? systemDefaults.logicalElements.units;
      logical.statesWithoutVisual = logical.statesWithoutVisual ?? systemDefaults.logicalElements.statesWithoutVisual;
      logical.alias = logical.alias ?? systemDefaults.logicalElements.alias;
      logical.validation = logical.validation ?? systemDefaults.logicalElements.validation;
      logical.valuedObjectForId = logical.valuedObjectForId ?? systemDefaults.logicalElements.valuedObjectForId;
      logical.code = logical.code ?? systemDefaults.logicalElements.code;
      logical.insertedFunction = logical.insertedFunction ?? systemDefaults.logicalElements.insertedFunction;
      logical.condition = logical.condition ?? systemDefaults.logicalElements.condition;
      logical.event = logical.event ?? systemDefaults.logicalElements.event;
      logical.negation = logical.negation ?? systemDefaults.logicalElements.negation;
      logical.path = logical.path ?? systemDefaults.logicalElements.path;
      logical.linkConnectionType = logical.linkConnectionType ?? systemDefaults.logicalElements.linkConnectionType;
      logical.linkRequirements = logical.linkRequirements ?? systemDefaults.logicalElements.linkRequirements;
      logical.sourceLogicalConnection = logical.sourceLogicalConnection ?? systemDefaults.logicalElements.sourceLogicalConnection;
      logical.targetLogicalConnection = logical.targetLogicalConnection ?? systemDefaults.logicalElements.targetLogicalConnection;
      logical.min = logical.min ?? systemDefaults.logicalElements.min;
      logical.nominal = logical.nominal ?? systemDefaults.logicalElements.nominal;
      logical.max = logical.max ?? systemDefaults.logicalElements.max;
      logical.units = logical.units ?? systemDefaults.logicalElements.units;
      logical.timeDurationStatus = logical.timeDurationStatus ?? systemDefaults.logicalElements.timeDurationStatus;
      logical.durationDistributionKind = logical.durationDistributionKind ?? systemDefaults.logicalElements.durationDistributionKind ?? "none";
      logical.durationDistributionParams = logical.durationDistributionParams ?? systemDefaults.logicalElements.durationDistributionParams ?? {};
      logical.isWaitingProcess = logical.isWaitingProcess ?? systemDefaults.logicalElements.isWaitingProcess;
      logical.waitingProcessLid = logical.waitingProcessLid ?? systemDefaults.logicalElements.waitingProcessLid;
      logical.needUserInput = logical.needUserInput ?? systemDefaults.logicalElements.needUserInput;
      logical.userInputPromptMessage = logical.userInputPromptMessage ?? systemDefaults.logicalElements.userInputPromptMessage;
      logical.stateType = logical.stateType ?? systemDefaults.logicalElements.stateType;
      // Restore simulationParams
      if (!logical.simulationParams) {
        logical.simulationParams = systemDefaults.logicalElements.simulationParams;
      }
      // Restore satisfiedRequirementsSetParams
      if (!logical.satisfiedRequirementsSetParams) {
        logical.satisfiedRequirementsSetParams = systemDefaults.logicalElements.satisfiedRequirementsSetParams;
      }
    }
    /**
     * Decompresses model if it has compression metadata, otherwise returns as-is.
     * This is the safe way to handle both old and new formats.
     */
    decompressModelIfNeeded(model) {
      if (!model) {
        return model;
      }
      // Check if model has compression metadata (check both old _compression and new compressionMetadata for backward compatibility)
      if (model.compressionMetadata?.version || model._compression?.version) {
        // New format - decompress (normalize to compressionMetadata if using old _compression)
        if (model._compression && !model.compressionMetadata) {
          model.compressionMetadata = model._compression;
          delete model._compression;
        }
        return this.decompressModel(model);
      }
      // Old format - return as-is (backward compatible)
      return model;
    }
    /**
     * Compresses model only if not already compressed.
     * Useful for save operations to avoid double compression.
     */
    compressModelIfNeeded(model) {
      if (!model) {
        return model;
      }
      // If already compressed, return as-is (check both old and new field names)
      if (model.compressionMetadata?.version || model._compression?.version) {
        return model;
      }
      // Not compressed - compress it
      return this.compressModel(model);
    }
    prepareModelForSave(model) {
      if (!model) {
        return model;
      }
      // If compression is disabled, just return the model as-is (for debugging)
      if (!this.ENABLE_COMPRESSION) {
        return JSON.parse(JSON.stringify(model));
      }
      try {
        // Store original structure for comparison
        const originalKeys = Object.keys(model).sort();
        const originalModelSize = JSON.stringify(model).length;
        // Compress if needed
        const compressed = this.compressModelIfNeeded(model);
        // Deep clone to avoid mutating
        const modelForSave = JSON.parse(JSON.stringify(compressed));
        // DO NOT remove compression metadata - we need it when loading from backend to restore defaults!
        // The backend stores this field so we can restore defaults when loading
        // Validate and ensure required fields are present (safety check)
        this.validateModelStructure(modelForSave);
        // Compare keys to detect if we accidentally removed something
        const finalKeys = Object.keys(modelForSave).sort();
        const missingKeys = originalKeys.filter(k => !finalKeys.includes(k));
        // Fields that context.service.ts adds before calling prepareModelForSave (expected extras)
        const expectedExtraFields = ["title", "description", "sysExample", "globalTemplate", "image", "archiveMode"];
        const extraKeys = finalKeys.filter(k => !originalKeys.includes(k) && k !== "_compression" && k !== "compressionMetadata" && !expectedExtraFields.includes(k));
        if (missingKeys.length > 0) {
          console.error("[ModelCompression] ERROR: Missing keys after compression:", missingKeys);
          // Restore missing keys from original - CRITICAL for backend compatibility
          missingKeys.forEach(key => {
            if (model[key] !== undefined) {
              console.warn(`[ModelCompression] Restoring missing key: ${key}`);
              modelForSave[key] = JSON.parse(JSON.stringify(model[key]));
            }
          });
        }
        if (extraKeys.length > 0) {
          console.warn("[ModelCompression] WARNING: Unexpected extra keys after compression:", extraKeys);
        }
        // Final validation - ensure all critical fields exist
        // Note: Some fields like 'title' might be null/empty but should still exist
        const criticalFields = ["title", "description", "archiveMode", "currentOpd", "opds", "logicalElements"];
        const missingCritical = criticalFields.filter(f => modelForSave[f] === undefined);
        if (missingCritical.length > 0) {
          console.error("[ModelCompression] CRITICAL ERROR: Missing required fields:", missingCritical);
          // Restore from original - these fields MUST exist for backend
          missingCritical.forEach(field => {
            if (model[field] !== undefined) {
              console.warn(`[ModelCompression] Restoring critical field: ${field}`);
              modelForSave[field] = JSON.parse(JSON.stringify(model[field]));
            } else {
              // If original doesn't have it, set to default empty value
              console.warn(`[ModelCompression] Setting default for missing critical field: ${field}`);
              if (field === "title" || field === "description") {
                modelForSave[field] = model[field] || "";
              } else if (field === "archiveMode") {
                modelForSave[field] = model[field] || {
                  archiveMode: false,
                  date: "",
                  name: ""
                };
              } else if (field === "currentOpd") {
                modelForSave[field] = model[field] || null;
              } else if (field === "opds" || field === "logicalElements") {
                modelForSave[field] = model[field] || [];
              }
            }
          });
        }
        const compressedSize = JSON.stringify(modelForSave).length;
        const compressionRatio = ((originalModelSize - compressedSize) / originalModelSize * 100).toFixed(1);
        // Compression complete - size reduced
        return modelForSave;
      } catch (error) {
        console.error("[ModelCompression] ERROR during compression:", error);
        // If compression fails, return original model (fail-safe)
        return JSON.parse(JSON.stringify(model));
      }
    }
    /**
     * Validate that required backend fields are present and restore if missing
     */
    validateModelStructure(model) {
      // Ensure all required backend fields exist (even if empty/null)
      // These fields are required by the backend and must never be removed
      // Top-level metadata fields (set by context.service.ts, but we validate they exist)
      if (model.title === undefined) {
        model.title = null; // Will be restored from original if missing
      }
      if (model.description === undefined) {
        model.description = null; // Will be restored from original if missing
      }
      if (model.archiveMode === undefined) {
        model.archiveMode = {
          archiveMode: false,
          date: "",
          name: ""
        };
      }
      // Model structure fields
      if (model.currentOpd === undefined) {
        model.currentOpd = null;
      }
      if (model.opds === undefined) {
        model.opds = [];
      }
      if (model.logicalElements === undefined) {
        model.logicalElements = [];
      }
      if (model.stereotypes === undefined) {
        model.stereotypes = [];
      }
      if (model.importedTemplates === undefined) {
        model.importedTemplates = {};
      }
      if (model.relatedRelations === undefined) {
        model.relatedRelations = [];
      }
    }
    /**
     * Recursively remove compression metadata from model (no longer used - we keep it now)
     * @deprecated We now keep compressionMetadata in the backend for proper restoration
     */
    removeCompressionMetadata(obj) {
      // No-op: We now keep compressionMetadata in the backend
      // This method is kept for backward compatibility but does nothing
    }
    static #_ = (() => this.ɵfac = function ModelCompressionService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ModelCompressionService)(core /* ɵɵinject */.KVO(OplService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ModelCompressionService,
      factory: ModelCompressionService.ɵfac
    }))();
  }
  return ModelCompressionService;
})();