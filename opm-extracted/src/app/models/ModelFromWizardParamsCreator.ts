// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/ModelFromWizardParamsCreator.ts
// Extracted by opm-extracted/tools/extract.mjs

class ModelFromWizardParamsCreator {
  constructor(model, params) {
    this.model = model;
    this.params = params;
  }
  create() {
    this.createMainProcess();
    this.createBeneficiaryGroupObject();
    this.connectBeneficiaryGroupToMainProcess();
    this.createBenefitObject();
    this.connectBenefitStatesToMainProcess();
    this.connectBeneficiaryGroupObjectToBenefitObject();
    this.createSystemNameObject();
    this.connectSystemNameToMainProcess();
    this.createMainOutputObject();
    this.connectMainProcessToOutput();
    this.createMainInputs();
    this.connectMainInputsToMainProcess();
    this.createHandlersObjects();
    this.connectHandlersToMainProcess();
    this.createToolsObjects();
    this.connectToolsObjectsToMainProcess();
    this.setObjectsAffiliations();
  }
  createMainProcess() {
    this.mainProcess = this.model.createToScreen(EntityType.Process).visual;
    this.mainProcess.logicalElement.affiliation = Affiliation.Systemic;
    this.mainProcess.logicalElement.essence = Essence.Informatical;
    this.mainProcess.xPos = 253;
    this.mainProcess.yPos = 216;
    this.mainProcess.width = 340;
    this.mainProcess.height = 170;
    this.mainProcess.logicalElement.text = this.params.mainFunctionality;
    this.mainProcess.ports = [{
      args: {
        x: 0.011904761904761904,
        y: 0.3915447154471547
      },
      group: "aaa",
      id: "16ada237-14cc-4dc7-9f73-85b1a9cdcede",
      markup: [{
        attributes: {
          fill: "transparent",
          height: 2,
          magnet: "true",
          r: 2,
          stroke: "transparent",
          width: 2
        },
        tagName: "circle"
      }]
    }];
  }
  createBeneficiaryGroupObject() {
    this.beneficiaryGroupObject = this.model.createToScreen(EntityType.Object).visual;
    this.beneficiaryGroupObject.logicalElement.affiliation = Affiliation.Systemic;
    this.beneficiaryGroupObject.logicalElement.essence = Essence.Physical;
    this.beneficiaryGroupObject.xPos = 205;
    this.beneficiaryGroupObject.yPos = 395;
    this.beneficiaryGroupObject.width = 135;
    this.beneficiaryGroupObject.height = 60;
    this.beneficiaryGroupObject.logicalElement.text = this.params.beneficiaryGroup;
  }
  connectBeneficiaryGroupToMainProcess() {
    if (this.params.isMainBeneficiaryAlsoHandler) {
      this.model.connect(this.beneficiaryGroupObject, this.mainProcess, {
        type: linkType.Agent,
        connection: linkConnectionType.systemic
      });
    }
  }
  createBenefitObject() {
    this.benefitObject = this.model.createToScreen(EntityType.Object).visual;
    this.benefitObject.logicalElement.affiliation = Affiliation.Systemic;
    this.benefitObject.logicalElement.essence = Essence.Informatical;
    this.benefitObject.xPos = 320;
    this.benefitObject.yPos = 515;
    this.benefitObject.width = 305;
    this.benefitObject.height = 120;
    this.benefitObject.logicalElement.text = this.params.beneficiary;
    this.createBenefitObjectStates();
    this.benefitObject.statesArrangement = statesArrangement.Top;
    this.benefitObject.refY = 0.9;
    this.benefitObject.yAlign = "bottom";
  }
  createBenefitObjectStates() {
    const states = this.benefitObject.addState();
    states[0].width = 115;
    states[0].height = 45;
    states[0].xPos = 345;
    states[0].yPos = 525;
    states[0].logicalElement.text = this.params.beneficiaryState1;
    states[1].width = 115;
    states[1].height = 45;
    states[1].xPos = 485;
    states[1].yPos = 525;
    states[1].logicalElement.text = this.params.beneficiaryState2;
  }
  connectBenefitStatesToMainProcess() {
    const ret1 = this.model.connect(this.benefitObject.states[0], this.mainProcess, {
      type: linkType.Consumption,
      connection: linkConnectionType.systemic
    });
    const ret2 = this.model.connect(this.mainProcess, this.benefitObject.states[1], {
      type: linkType.Result,
      connection: linkConnectionType.systemic
    });
    ret1.created[0].setAsPartner(ret2.created[0]);
  }
  connectBeneficiaryGroupObjectToBenefitObject() {
    const ret = this.model.connect(this.beneficiaryGroupObject, this.benefitObject, {
      type: linkType.Exhibition,
      connection: linkConnectionType.systemic
    });
    ret.created[0].setSymbolPos(258, 516);
  }
  createSystemNameObject() {
    this.systemNameObject = this.model.createToScreen(EntityType.Object).visual;
    this.systemNameObject.logicalElement.affiliation = Affiliation.Systemic;
    this.systemNameObject.logicalElement.essence = Essence.Informatical;
    this.systemNameObject.xPos = 70;
    this.systemNameObject.yPos = 75;
    this.systemNameObject.width = 135;
    this.systemNameObject.height = 60;
    this.systemNameObject.logicalElement.text = this.params.systemName;
  }
  connectSystemNameToMainProcess() {
    const ret1 = this.model.connect(this.systemNameObject, this.mainProcess, {
      type: linkType.Instrument,
      connection: linkConnectionType.systemic
    });
    const ret2 = this.model.connect(this.systemNameObject, this.mainProcess, {
      type: linkType.Exhibition,
      connection: linkConnectionType.systemic
    });
    ret2.created[0].setSymbolPos(328, 130);
  }
  createMainOutputObject() {
    this.mainOutputObject = this.model.createToScreen(EntityType.Object).visual;
    this.mainOutputObject.logicalElement.affiliation = Affiliation.Systemic;
    this.mainOutputObject.logicalElement.essence = Essence.Physical;
    this.mainOutputObject.xPos = 655;
    this.mainOutputObject.yPos = 475;
    this.mainOutputObject.width = 135;
    this.mainOutputObject.height = 60;
    this.mainOutputObject.logicalElement.text = this.params.mainOutput;
    if (this.params.mainOutputLinkType === "changes") {
      this.addStatesToMainOutput();
    }
  }
  addStatesToMainOutput() {
    const states = this.mainOutputObject.addState();
    states[0].width = 115;
    states[0].height = 45;
    states[0].xPos = 670;
    states[0].yPos = 472;
    states[0].logicalElement.text = this.params.mainOutputLinkChangesState1;
    states[1].width = 115;
    states[1].height = 45;
    states[1].xPos = 670;
    states[1].yPos = 527;
    states[1].logicalElement.text = this.params.mainOutputLinkChangesState2;
    this.mainOutputObject.xPos = 660;
    this.mainOutputObject.yPos = 462;
    this.mainOutputObject.width = 218;
    this.mainOutputObject.height = 120;
    this.mainOutputObject.statesArrangement = statesArrangement.Left;
    this.mainOutputObject.refX = 0.95;
    this.mainOutputObject.xAlign = "right";
    this.mainOutputObject.yAlign = "middle";
  }
  connectMainProcessToOutput() {
    if (this.params.mainOutputLinkType === "creates") {
      this.model.connect(this.mainProcess, this.mainOutputObject, {
        type: linkType.Result,
        connection: linkConnectionType.systemic
      });
    } else if (this.params.mainOutputLinkType === "affects") {
      this.model.connect(this.mainProcess, this.mainOutputObject, {
        type: linkType.Effect,
        connection: linkConnectionType.systemic
      });
    } else {
      const ret1 = this.model.connect(this.mainOutputObject.states[0], this.mainProcess, {
        type: linkType.Consumption,
        connection: linkConnectionType.systemic
      });
      const ret2 = this.model.connect(this.mainProcess, this.mainOutputObject.states[1], {
        type: linkType.Result,
        connection: linkConnectionType.systemic
      });
      ret1.created[0].setAsPartner(ret2.created[0]);
    }
  }
  createMainInputs() {
    this.mainInputs = [];
    const baseY = 175;
    const maxY = 375;
    const padding = 40;
    const xPos = -75;
    for (const inputName of this.params.mainInputs) {
      if (this.params.mainOutputIsInput && this.params.mainOutput === inputName) {
        continue;
      }
      const obj = this.model.createToScreen(EntityType.Object).visual;
      obj.logicalElement.affiliation = Affiliation.Systemic;
      obj.logicalElement.essence = Essence.Physical;
      this.mainInputs.push(obj);
      obj.xPos = xPos;
      obj.yPos = baseY + (maxY - baseY) * (this.params.mainInputs.indexOf(inputName) / this.params.mainInputs.length) + padding * this.params.mainInputs.indexOf(inputName);
      obj.width = 135;
      obj.height = 60;
      obj.logicalElement.text = inputName;
    }
  }
  connectMainInputsToMainProcess() {
    for (const inputObj of this.mainInputs) {
      this.model.connect(inputObj, this.mainProcess, {
        type: linkType.Instrument,
        connection: linkConnectionType.systemic
      }).created[0];
    }
  }
  createHandlersObjects() {
    this.handlers = [];
    const xPoses = [390, 560, 727];
    const yPoses = [5, 10, 25];
    for (const handler of this.params.systemHandlers) {
      const obj = this.model.createToScreen(EntityType.Object).visual;
      obj.logicalElement.affiliation = Affiliation.Systemic;
      obj.logicalElement.essence = Essence.Physical;
      this.handlers.push(obj);
      const idx = this.params.systemHandlers.indexOf(handler);
      obj.xPos = xPoses[idx];
      obj.yPos = yPoses[idx];
      obj.width = 135;
      obj.height = 60;
      obj.logicalElement.text = handler;
    }
  }
  connectHandlersToMainProcess() {
    for (const handlerObj of this.handlers) {
      this.model.connect(handlerObj, this.mainProcess, {
        type: linkType.Agent,
        connection: linkConnectionType.systemic
      }).created[0];
    }
  }
  createToolsObjects() {
    this.tools = [];
    const xPos = 675;
    const yPoses = [150, 250, 350];
    for (const tool of this.params.tools) {
      const obj = this.model.createToScreen(EntityType.Object).visual;
      obj.logicalElement.affiliation = Affiliation.Systemic;
      obj.logicalElement.essence = Essence.Physical;
      this.tools.push(obj);
      const idx = this.params.tools.indexOf(tool);
      obj.xPos = xPos;
      obj.yPos = yPoses[idx];
      obj.width = 135;
      obj.height = 60;
      obj.logicalElement.text = tool;
      obj.setEssence(this.params.toolsData[idx].isPhysical ? Essence.Physical : Essence.Informatical);
    }
  }
  connectToolsObjectsToMainProcess() {
    for (const tool of this.tools) {
      this.model.connect(tool, this.mainProcess, {
        type: linkType.Instrument,
        connection: linkConnectionType.systemic
      }).created[0];
    }
  }
  setObjectsAffiliations() {
    const allObjects = [...this.mainInputs, ...this.handlers, ...this.tools, this.mainOutputObject];
    for (const item of this.params.environmentalObjects) {
      if (item.isEnvironmental) {
        const objec = allObjects.find(obj => obj.logicalElement.text.toLowerCase() === item.name.toLowerCase());
        if (objec) {
          objec.logicalElement.affiliation = Affiliation.Environmental;
        }
      }
    }
  }
}