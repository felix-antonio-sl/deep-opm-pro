// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/OpmLogicalObject.ts
// Extracted by opm-extracted/tools/extract.mjs


  let OpmLogicalObject = /*#__PURE__*/(() => {
    class OpmLogicalObject extends OpmLogicalThing {
      static #_ = (() => this.logicalCounter = 1)();
      static resetLogicalCounter() {
        OpmLogicalObject.logicalCounter = 1;
      }
      constructor(params, model) {
        super(params, model);
        this.computationModule = new ComputationModule();
        this.aliasModule = new AliasingModule(this.computationModule);
        this.unitsModule = new UnitsTextModule(this.computationModule);
        this.states_ = new Array();
        this.ellipsis_ = new OpmLogicalStateEllipsis();
        OpmLogicalObject.logicalCounter++;
        // this.textModule.addTextualModules(this.computation);
        this.textModule.addTextualModules(this.aliasModule);
        this.textModule.addTextualModules(this.unitsModule);
      }
      removeAllStates() {
        this.states_.length = 0;
        this.ellipsis_.visualElements.length = 0;
      }
      // getters and setters
      get computation() {
        return this.computationModule;
      }
      get valueType() {
        return this.computationModule.valueType;
      }
      set valueType(valueType) {
        this.computationModule.valueType = valueType;
        // this._valueType = valueType;
      }
      get value() {
        return this.computationModule.value;
      }
      set alias(value) {
        this.aliasModule.alias = value;
      }
      setValue(value) {
        const validation = this.getValidationModule();
        if (validation.isActive() && validation.validateValue(value) == false) {
          if (this.opmModel.shouldAllowInvalidValueAtExecutionTime() == false) {
            return false;
          }
        }
        this.value = value;
        return true;
      }
      set value(value) {
        this.computationModule.value = value;
      }
      get units() {
        // TODO: The value NONE should not be special or treted diferently.
        if (this.unitsModule.units == "None") {
          return "";
        } else {
          return this.unitsModule.units;
        }
      }
      set units(units) {
        this.unitsModule.units = units;
        // this._units = units;
      }
      get states() {
        return this.states_.sort((a, b) => this.opmModel.logicalElements.indexOf(a) - this.opmModel.logicalElements.indexOf(b));
      }
      get ellipsis() {
        return this.ellipsis_;
      }
      get alias() {
        let temp = "" + this.text;
        const hasInstance = temp.indexOf("{Instances: ");
        if (hasInstance !== -1) {
          const endInsIdx = temp.indexOf("}", hasInstance);
          const toRemove = temp.slice(hasInstance, endInsIdx + 1);
          temp = temp.replace(toRemove, "");
        }
        const indexOfStartAlias = temp.indexOf("{");
        const indexOfEndAlias = temp.indexOf("}");
        if (indexOfStartAlias > 0 && indexOfEndAlias > 0 && indexOfEndAlias > indexOfStartAlias) {
          return temp.substring(indexOfStartAlias + 1, indexOfEndAlias).trim();
        }
        return this.aliasModule.alias;
      }
      setParams(params) {
        super.setParams(params);
        if (params?.alias) {
          this.alias = params.alias;
        }
      }
      // needed for computational part
      getName() {
        if (this.valueType === valueType.None && this.value === "None") {
          return this.text;
        } else {
          let indexOfStartUnits = this.text.lastIndexOf("[");
          if (indexOfStartUnits <= 0) {
            indexOfStartUnits = this.text.length;
          }
          return this.text.substring(0, indexOfStartUnits).trim();
        }
      }
      createVisual(params) {
        return new OpmVisualObject(params, this);
      }
      createState() {
        const text = "state" + (this.states_.length + 1);
        const drawn = new OpmState(text); // TODO: Should be changed to a const default value.
        const logical = this.opmModel.logicalFactory(EntityType.State, drawn.getParams());
        logical.text = text;
        logical.parent = this;
        this.states_.push(logical);
        this.opmModel.currentOpd.add(logical.visualElements[0]);
        return logical;
      }
      removeState(state) {
        for (let i = this.states_.length - 1; i >= 0; i--) {
          if (state === this.states_[i]) {
            this.states_.splice(i, 1);
            return;
          }
        }
      }
      updateParams(params) {
        super.updateParams(params);
        this.valueType = params.valueType;
        this.value = params.value;
        this.units = params.units;
        this.alias = params.alias;
        if (params.validation && params.validation.attribute) {
          // TODO: pay attention.
          let stereotypeValidator;
          const stereotypeEquivalentLogical = this.opmModel.getEquivalentLogicalThingFromStereotype(this.equivalentFromStereotypeLID);
          stereotypeValidator = stereotypeEquivalentLogical?.getValidationModule().getValidator();
          this.getValidationModule().setRange(params.validation.attribute.type, params.validation.attribute.range, stereotypeValidator);
        }
        if (params.text) {
          this.extractDataFromText(params.text);
        }
      }
      extractDataFromText(text) {
        // alias
        const start = text.lastIndexOf("{");
        const end = text.lastIndexOf("}");
        if (start > 0 && end > 0) {
          this.alias = text.substring(start + 1, end);
        }
        this.text = text;
        this.getNameModule().setText(text);
      }
      getParams() {
        const visualElementsParams = [];
        for (let i = 0; i < this.visualElements.length; i++) {
          visualElementsParams.push(this.visualElements[i].getParams());
        }
        const states = [];
        for (let i = 0; i < this.states_.length; i++) {
          if (this.states_[i].visualElements.length === 0) {
            states.push(this.states_[i].getParams());
          }
        }
        const params = {
          valueType: this.valueType,
          value: this.value,
          units: this.units,
          visualElementsParams: visualElementsParams,
          statesWithoutVisual: states,
          alias: this.alias,
          validation: this.computationModule.validationModule.toJson(),
          valuedObjectForId: this.valuedObjectFor ? this.valuedObjectFor.lid : undefined
        };
        return {
          ...super.getThingParams(),
          ...params
        };
      }
      getParamsFromJsonElement(jsonElement) {
        const params = {
          valueType: jsonElement.valueType === "None" ? valueType.None : jsonElement.valueType,
          value: jsonElement.value,
          units: jsonElement.units,
          alias: jsonElement.alias,
          statesWithoutVisual: jsonElement.statesWithoutVisual ? jsonElement.statesWithoutVisual : []
        };
        return {
          ...super.getThingParamsFromJsonElement(jsonElement),
          ...params
        };
      }
      // TODO: Remove after refactoring OpmModel.
      concatToStates(array) {
        array.forEach(e => this.states_.push(e));
      }
      createLogicalAndVisualState(parent) {
        const state = this.createState();
        //const visual = state.createVisual(parent);
        const visual = state.visualElements[0];
        visual.fatherObject = parent;
        return visual;
      }
      createVisualState(object, state) {
        if (!this.states_.find(s => s === state)) {
          return undefined;
        }
        return state.createVisualState(object);
      }
      get counter() {
        return OpmLogicalObject.logicalCounter;
      }
      getNumberedName() {
        return "Object " + this.counter;
      }
      toggleLetter(letter) {
        return letter.toUpperCase();
      }
      toggleCapitalize(text) {
        for (let i = 0; i < text.length; i++) {
          // capitalize the first letter of the first word and each word after a space or an enter
          if (i === 0) {
            text = this.toggleLetter(text.charAt(i)) + text.substr(i + 1, text.length);
          } else if (text.charAt(i - 1) === " " || text.charAt(i - 1) === "\n") {
            text = text.substr(0, i) + this.toggleLetter(text.charAt(i)) + text.substr(i + 1, text.length);
          }
        }
        return text;
      }
      deStating() {
        this.opmModel.logForUndo("Destate " + this.text);
        const logObjectsofStates = [];
        const logicalFundamentalRelations = [];
        const newVisualsInCurrentOpd = [];
        const cleanParams = this.getParams();
        delete cleanParams.backgroundImageUrl;
        // create new logical object for every logical state
        for (let j = 0; j < this.states.length; j++) {
          const logObjectOfState = this.opmModel.logicalFactory(EntityType.Object, cleanParams);
          logObjectOfState.lid = uuid();
          logObjectOfState.URLarray = this.states[j].URLarray;
          // delete the automatically created visual object
          logObjectOfState.removeVisual(logObjectOfState.visualElements[0]);
          logObjectOfState.text = this.toggleCapitalize(this.states[j].text) + " " + this.text;
          logObjectsofStates.push(logObjectOfState);
          const par = {
            linkConnectionType: 1,
            linkType: linkType.Generalization
          };
          const newLogicLink = new OpmFundamentalRelation(par, this.opmModel, false);
          newLogicLink.removeVisual(newLogicLink.visualElements[0]);
          newLogicLink.sourceLogicalElement = this;
          newLogicLink.targetLogicalElements = [logObjectOfState];
          logicalFundamentalRelations.push(newLogicLink);
          this.opmModel.add(newLogicLink);
        }
        // go over all opds
        for (let i = 0; i < this.opmModel.opds.length; i++) {
          // filter all visual objects related to our logicalObject
          const allVisualElements = this.opmModel.opds[i].visualElements.filter(elm => elm.logicalElement === this);
          for (let k = 0; k < allVisualElements.length; k++) {
            allVisualElements[k].expressAll();
            if (allVisualElements[k].states.length === allVisualElements[k].children.length) {
              allVisualElements[k].height = 60;
              allVisualElements[k].width = 135;
              allVisualElements[k].textHeight = "80%";
              allVisualElements[k].textWidth = "80%";
              allVisualElements[k].refY = 0.5;
              allVisualElements[k].refX = 0.5;
              allVisualElements[k].xAlign = "middle";
              allVisualElements[k].yAlign = "middle";
            }
            for (let n = 0; n < allVisualElements[k].states.length; n++) {
              // create new visual object for every visual state
              const newVisualObjectOfVisualState = logObjectsofStates[n].createVisual(allVisualElements[k].getParams());
              newVisualObjectOfVisualState.height = 60;
              newVisualObjectOfVisualState.width = 135;
              newVisualObjectOfVisualState.id = uuid();
              newVisualObjectOfVisualState.yPos = allVisualElements[k].yPos + allVisualElements[k].height + newVisualObjectOfVisualState.height * n + (n + 1) * 15;
              newVisualObjectOfVisualState.textHeight = "80%";
              newVisualObjectOfVisualState.textWidth = "80%";
              newVisualObjectOfVisualState.refY = 0.5;
              newVisualObjectOfVisualState.refX = 0.5;
              newVisualObjectOfVisualState.xAlign = "middle";
              newVisualObjectOfVisualState.yAlign = "middle";
              newVisualObjectOfVisualState.refineeInzooming = undefined;
              newVisualObjectOfVisualState.refineable = undefined;
              newVisualObjectOfVisualState.refineeUnfolding = undefined;
              newVisualObjectOfVisualState.strokeWidth = 2;
              this.opmModel.opds[i].add(newVisualObjectOfVisualState);
              const par = {
                id: uuid(),
                linkConnectionType: 1,
                linkType: linkType.Generalization,
                sourceElementId: allVisualElements[k].id,
                targetElementId: newVisualObjectOfVisualState.id
              };
              const newLink = new OpmFundamentalLink(par, logicalFundamentalRelations[n]);
              this.opmModel.opds[i].add(newLink);
              // restore all links
              const allLinks = this.opmModel.opds[i].getThingLinks(allVisualElements[k].states[n].id);
              const inboundLinks = allLinks.filter(link => link.targetVisualElements[0].targetVisualElement.id === allVisualElements[k].children[n].id);
              const outboundLinks = allLinks.filter(link => link.sourceVisualElement.id === allVisualElements[k].children[n].id);
              for (let m = 0; m < inboundLinks.length; m++) {
                inboundLinks[m].targetVisualElements[0].targetVisualElement = newVisualObjectOfVisualState;
                inboundLinks[m].logicalElement.targetLogicalElements = [newVisualObjectOfVisualState.logicalElement];
              }
              for (let m = 0; m < outboundLinks.length; m++) {
                outboundLinks[m].sourceVisualElement = newVisualObjectOfVisualState;
                outboundLinks[m].logicalElement.sourceLogicalElement = newVisualObjectOfVisualState.logicalElement;
              }
              if (this.opmModel.opds[i] === this.opmModel.currentOpd) {
                newVisualsInCurrentOpd.push([allVisualElements[k], newVisualObjectOfVisualState, newLink, inboundLinks, outboundLinks]);
              }
            }
            const counter = allVisualElements[k].states.length;
            for (let n = 0; n < counter; n++) {
              this.opmModel.remove(allVisualElements[k].states[0].id);
              if (this.opmModel.opds[i] === this.opmModel.currentOpd) {
                this.opmModel.currentOpd.remove(allVisualElements[k].states[0].id);
              }
              // Following is necessary as the remove above does not delete the VisualState from VisualObject.children
              allVisualElements[k].removeState(allVisualElements[k].states[0]);
            }
          }
        }
        return newVisualsInCurrentOpd;
      }
      isComputational() {
        return this.computationModule.isActive();
      }
      isTimeDuration() {
        return false;
      }
      getComputationModule() {
        return this.computationModule;
      }
      getValidationModule() {
        return this.computationModule.validationModule;
      }
      hasRange() {
        return this.computationModule.hasRange();
      }
      isValueTyped() {
        return this.valuedObjectFor != undefined;
      }
      isBasicThing() {
        if (this.isValueTyped()) {
          return false;
        }
        return true;
      }
      removeComputation() {
        this.computationModule.remove();
      }
      setReferencesFromJson(json, map) {
        if (json.validation && json.validation.valueTypeElementId) {
          this.getValidationModule().setValueTypeElement(map.get(json.validation.valueTypeElementId));
        }
        if (json.valuedObjectForId) {
          this.valuedObjectFor = map.get(json.valuedObjectForId);
        }
      }
      getValidationStatus() {
        const validation = this.getValidationModule();
        const range = validation.isActive();
        const set = this.value !== "value";
        const valid = validation.validateValue(this.value);
        if (range == false) {
          return "no-range";
        }
        if (set == false) {
          return "value-not-set";
        }
        if (valid == false) {
          return "value-set-invalid";
        }
        return "value-set-valid";
      }
      isSatisfiedRequirementSetObject() {
        return this.hiddenAttributesModule.satisfiedRequirementSetModule.isRequirementSetObject;
      }
      isSatisfiedRequirementObject() {
        return this.hiddenAttributesModule.satisfiedRequirementSetModule.isRequirementObject;
      }
      getAncestorExhibitions(ret = []) {
        const inLinks = this.getLinks().inGoing.filter(l => l.linkType === linkType.Exhibition);
        if (this.states.length) {
          for (const state of this.states) {
            inLinks.push(...state.getLinks().inGoing.filter(l => l.linkType === linkType.Exhibition));
          }
        }
        for (const link of inLinks) {
          const source = link.sourceLogicalElement;
          if (ret.includes(source)) {
            continue;
          }
          ret.push(source);
          if (OPCloudUtils.isInstanceOfLogicalState(source)) {
            ret.push(source.getFather());
            source.getFather().getAncestorExhibitions(ret);
          }
          source.getAncestorExhibitions(ret);
        }
        return ret;
      }
    }
    return OpmLogicalObject;
  })();

  /***/
}),
/***/15482: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    h: () => (/* binding */OpmLogicalProcess)

  });

  let OpmLogicalProcess = /*#__PURE__*/(() => {
    class OpmLogicalProcess extends OpmLogicalThing /* .OpmLogicalThing */._ {
      static #_ = (() => this.logicalCounter = 1)();
      static resetLogicalCounter() {
        OpmLogicalProcess.logicalCounter = 1;
      }
      constructor(params, model, addToCurrentOpd = true) {
        super(params, model);
        this.duration = new components_TimeDurationModule /* .TimeDurationModule */.E();
        this.isWaitingProcess = false;
        OpmLogicalProcess.logicalCounter++;
        this.textModule.addTextualModules(new ProcessComputational(this), this.duration);
        this._code = ConfigurationOptions /* .code */.aY.Unspecified;
      }
      createVisual(params) {
        return new VisualPart_OpmVisualProcess /* .OpmVisualProcess */.o(params, this);
      }
      get needUserInput() {
        return this._needUserInput;
      }
      set needUserInput(val) {
        this._needUserInput = val;
      }
      get userInputPromptMessage() {
        return this._userInputPromptMessage;
      }
      set userInputPromptMessage(val) {
        if (val == null || val === "") {
          this._userInputPromptMessage = undefined;
          return;
        }
        const s = (0, utils_user_input_prompt_utils /* .sanitizeUserInputPrompt */.Zm)(val);
        this._userInputPromptMessage = s === utils_user_input_prompt_utils /* .DEFAULT_USER_INPUT_PROMPT */.kI ? undefined : s;
      }
      getTimeDurationText() {
        return this.duration.getText();
      }
      get code() {
        return this._code;
      }
      set code(code) {
        this._code = code;
      }
      get insertedFunction() {
        return this._insertedFunction;
      }
      set insertedFunction(insertedFunction) {
        this._insertedFunction = insertedFunction;
      }
      updateParams(params) {
        super.updateParams(params);
        // in case there is a user defined function, it will be stored in userDefinedFunction attribute.
        // in case there is a pre defined function, it will be stored in function attribute.
        // in case there is no function, function='None', userDefinedFunction undefined
        this.insertedFunction = params.insertedFunction;
        this.code = this.getCodeType(params.code);
        if (params.timeDurationStatus || params.min != null || params.nominal != null || params.max != null || params.durationDistributionKind && params.durationDistributionKind !== "none") {
          const durationParams = {
            min: params.min ?? null,
            nominal: params.nominal ?? null,
            max: params.max ?? null,
            units: params.units != null && params.units !== "" ? params.units : components_time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV,
            durationDistributionKind: params.durationDistributionKind || "none",
            durationDistributionParams: params.durationDistributionParams || {}
          };
          this.duration.setTimeDuration(durationParams);
        }
        this.text = params.text;
        this.isWaitingProcess = params.isWaitingProcess || false;
        this.waitingProcessLid = params.waitingProcessLid;
        this.needUserInput = params.needUserInput;
        if (params.userInputPromptMessage !== undefined) {
          this.userInputPromptMessage = params.userInputPromptMessage;
        }
      }
      getIsWaitingProcess() {
        return this.isWaitingProcess;
      }
      setIsWaitingProcess(val) {
        this.isWaitingProcess = val;
      }
      getWaitingProcess() {
        return this.waitingProcessLid;
      }
      setWaitingProcess(lid) {
        this.waitingProcessLid = lid;
      }
      setParams(params) {
        super.setParams(params);
        if (params.needUserInput) {
          this.needUserInput = params.needUserInput;
        }
        if (params.code) {
          this.code = this.getCodeType(params.code);
        }
        if (params.insertedFunction) {
          this.insertedFunction = params.insertedFunction;
        }
        if (params.isWaitingProcess) {
          this.isWaitingProcess = params.isWaitingProcess;
        }
        if (params.waitingProcessLid) {
          this.waitingProcessLid = params.waitingProcessLid;
        }
        if (params.timeDurationStatus || params.min != null || params.nominal != null || params.max != null || params.durationDistributionKind && params.durationDistributionKind !== "none") {
          const durationParams = {
            min: params.min ?? null,
            nominal: params.nominal ?? null,
            max: params.max ?? null,
            units: params.units != null && params.units !== "" ? params.units : components_time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV,
            durationDistributionKind: params.durationDistributionKind || "none",
            durationDistributionParams: params.durationDistributionParams || {}
          };
          this.duration.setTimeDuration(durationParams);
        }
        if (params.userInputPromptMessage !== undefined) {
          this.userInputPromptMessage = params.userInputPromptMessage;
        }
      }
      getCodeType(functionType) {
        if (typeof functionType === "number") {
          return functionType;
        }
        switch (functionType) {
          case "None":
            return ConfigurationOptions /* .code */.aY.Unspecified;
          case "userDefined":
            return ConfigurationOptions /* .code */.aY.UserDefined;
          case "userPythonDefined":
            return ConfigurationOptions /* .code */.aY.Python;
          case "external":
            return ConfigurationOptions /* .code */.aY.External;
          case "ros":
            return ConfigurationOptions /* .code */.aY.ROS;
          case "mqtt":
            return ConfigurationOptions /* .code */.aY.MQTT;
          case "sql":
            return ConfigurationOptions /* .code */.aY.SQL;
          case "userGenAIDefined":
            return ConfigurationOptions /* .code */.aY.GenAI;
          default:
            return ConfigurationOptions /* .code */.aY.PreDefined;
        }
      }
      getParams() {
        const visualElementsParams = new Array();
        for (let i = 0; i < this.visualElements.length; i++) {
          visualElementsParams.push(this.visualElements[i].getParams());
        }
        const params = {
          code: this.code,
          insertedFunction: this.insertedFunction,
          visualElementsParams: visualElementsParams,
          min: this.duration.getTimeDuration().min,
          nominal: this.duration.getTimeDuration().nominal,
          max: this.duration.getTimeDuration().max,
          units: this.duration.getTimeDuration().units,
          //timeDurationStatus:this.duration.isTimeDuration(),
          timeDurationStatus: this.duration.getTimeDuration().timeDurationStatus,
          durationDistributionKind: this.duration.getTimeDuration().durationDistributionKind,
          durationDistributionParams: this.duration.getTimeDuration().durationDistributionParams,
          isWaitingProcess: this.isWaitingProcess,
          waitingProcessLid: this.waitingProcessLid,
          needUserInput: this.needUserInput,
          userInputPromptMessage: this.userInputPromptMessage
        };
        return {
          ...super.getThingParams(),
          ...params
        };
      }
      getParamsFromJsonElement(jsonElement) {
        const params = {
          code: jsonElement.code === ConfigurationOptions /* .code */.aY.UserDefined ? "userDefined" : jsonElement.code === ConfigurationOptions /* .code */.aY.PreDefined ? "preDefined" : jsonElement.code === ConfigurationOptions /* .code */.aY.Python ? "userPythonDefined" : jsonElement.code === ConfigurationOptions /* .code */.aY.GenAI ? "userGenAIDefined" : jsonElement.code === ConfigurationOptions /* .code */.aY.External ? "external" : "None",
          insertedFunction: jsonElement.insertedFunction,
          needUserInput: jsonElement.needUserInput,
          userInputPromptMessage: jsonElement.userInputPromptMessage
        };
        return {
          ...super.getThingParamsFromJsonElement(jsonElement),
          ...params
        };
      }
      get counter() {
        return OpmLogicalProcess.logicalCounter;
      }
      getDurationManager() {
        return this.duration;
      }
      getNumberedName() {
        return OpmLogicalProcess.getNumberedNameByNum(this.counter);
      }
      static getNumberedNameByNum(counter) {
        // in English there are 26 letters
        let prefix = "";
        const lastChar = counter % 26 === 0 ? 26 : counter % 26;
        // decide how many letters will be in the name
        let numberOfChars = 1; // A...Z
        if (counter > 26) {
          numberOfChars++;
        } // AA...ZZ
        if (counter > Math.pow(26, 2) + 26) {
          numberOfChars++;
        } // AAA...ZZZ
        if (numberOfChars === 1) {
          prefix = String.fromCharCode(lastChar + 64);
        }
        if (numberOfChars === 2) {
          prefix = String.fromCharCode(Math.ceil((counter - 26) / 26) + 64) + String.fromCharCode(lastChar + 64);
        }
        if (numberOfChars === 3) {
          const firstDigit = Math.ceil((counter - Math.pow(26, 2) - 26) / Math.pow(26, 2));
          const firstChar = String.fromCharCode(firstDigit + 64);
          const secondDigit = Math.ceil((counter - Math.pow(26, 2) - 26 - (firstDigit - 1) * Math.pow(26, 2)) / 26);
          const secondChar = String.fromCharCode(secondDigit + 64);
          prefix = firstChar + secondChar + String.fromCharCode(lastChar + 64);
        }
        return prefix + " Processing";
      }
      isComputational() {
        return this.code !== ConfigurationOptions /* .code */.aY.Unspecified && this.code !== undefined;
      }
      // public setDuration(duration: { min: number, nominal: number, max: number }): boolean {
      //  return this.duration.setDuration(duration);
      //}
      // public setUnits(duration: {units: string}) {
      //  this.duration.setUnits(duration);
      // }
      editUnits(units) {
        this.duration.editUnits(units);
      }
      isTimeDuration() {
        //return (this.timeDurationStatus !== TimeDurationType.Unspecified && this.timeDurationStatus !== undefined)
        return this.duration.isTimeDuration();
      }
      isBasicThing() {
        return true;
      }
    }
    return OpmLogicalProcess;
  })();
  // This is not complete yet and all informatino should be taken out of the Logical class.
  class ProcessComputational {
    constructor(process) {
      this.process = process;
    }
    getText() {
      return "()";
    }
    isTextActive() {
      return this.process.isComputational();
    }
    getPriority() {
      return 2;
    }
  }

  /***/
}),
/***/71252: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    p: () => (/* binding */OpmLogicalState),
    u: () => (/* binding */OpmLogicalStateEllipsis)
  });
