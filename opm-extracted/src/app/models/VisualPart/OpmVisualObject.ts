// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/VisualPart/OpmVisualObject.ts
// Extracted by opm-extracted/tools/extract.mjs

  class OpmVisualObject extends OpmVisualThing {
    get type() {
      return EntityType.Object;
    }
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.lastStatesOrder = [];
      if (params && params.statesArrangement != null) {
        this.statesArrangement = this.getStateArrangement(params.statesArrangement);
      } else {
        this.statesArrangement = statesArrangement.Bottom;
      }
      if (params && params.digitalTwin != null) {
        this.digitalTwin = params.digitalTwin;
      }
      if (params && params.predigitalTwin != null) {
        this.predigitalTwin = params.predigitalTwin;
      }
      if (params && params.originalObj != null) {
        this.originalObj = params.originalObj;
      }
      if (params && params.preoriginalObj != null) {
        this.preoriginalObj = params.preoriginalObj;
      }
      if (params && params.digitalTwinConnected != null) {
        this.digitalTwinConnected = params.digitalTwinConnected;
      }
      if (params && params.lastStatesOrder) {
        this.lastStatesOrder = params.lastStatesOrder;
      }
    }
    setDefaultStyleFields() {
      super.setDefaultStyleFields();
      this.strokeColor = "#70E483";
    }
    get ellipsis() {
      return this._ellipsis;
    }
    isEllipsisNeeded() {
      return this.logicalElement.states.length > this.states.length;
    }
    createEllipsis() {
      if (this._ellipsis) {
        return this._ellipsis;
      }
      return this._ellipsis = this.logicalElement.ellipsis.createVisual(this);
    }
    removeEllipsis() {
      if (this._ellipsis) {
        this._ellipsis.remove();
        this._ellipsis = undefined;
      }
    }
    remove() {
      let removed = [];
      const prop = new RangeValidationAccess(this.logicalElement.opmModel).getProperties(this);
      if (prop.valueType.visualAtCurrentOpd) {
        removed = removed.concat(prop.valueType.visualAtCurrentOpd.remove());
      }
      const ret = super.remove();
      return ret.concat(removed);
    }
    isDigitallyTwin() {
      if (this.digitalTwin && this.logicalElement.opmModel.getVisualElementById(this.digitalTwin)) {
        return true;
      }
      return false;
    }
    get states() {
      const states = this.children.filter(c => c instanceof OpmVisualState);
      const isVerticalOrder = this.statesArrangement === statesArrangement.Right || this.statesArrangement === statesArrangement.Left;
      if (isVerticalOrder) {
        return states.sort((a, b) => {
          if (a.yPos > b.yPos) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      return states.sort((a, b) => {
        if (a.xPos > b.xPos) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    updateParams(params) {
      super.updateParams(params);
      if (params?.lastStatesOrder) {
        this.lastStatesOrder = params.lastStatesOrder;
      }
    }
    getStateArrangement(statesArrange) {
      switch (statesArrange) {
        case "top":
        case statesArrangement.Top:
          return statesArrangement.Top;
        case "bottom":
        case statesArrangement.Bottom:
          return statesArrangement.Bottom;
        case "left":
        case statesArrangement.Left:
          return statesArrangement.Left;
        case "right":
        case statesArrangement.Right:
          return statesArrangement.Right;
        default:
          return statesArrange;
      }
    }
    getParams() {
      const params = {
        statesArrangement: this.statesArrangement,
        refineableId: this.refineable ? this.refineable.id : null,
        refineeInzoomingId: this.refineeInzooming ? this.refineeInzooming.id : null,
        refineeUnfoldingId: this.refineeUnfolding ? this.refineeUnfolding.id : null,
        digitalTwin: this.digitalTwin,
        predigitalTwin: this.predigitalTwin,
        originalObj: this.originalObj,
        preoriginalObj: this.preoriginalObj,
        digitalTwinConnected: this.digitalTwinConnected,
        lastStatesOrder: this.lastStatesOrder
      };
      return {
        ...super.getThingParams(),
        ...params
      };
    }
    connectRefinementElements(id, type) {
      if (type == "in-zoom") {
        this.logicalElement.findVisualElement(id).refineeInzooming = this;
      } else {
        this.logicalElement.findVisualElement(id).refineeUnfolding = this;
      }
      this.refineable = this.logicalElement.findVisualElement(id);
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        statesArrangement: this.getStateArrangement(jsonElement.statesArrangement),
        digitalTwin: jsonElement.digitalTwin,
        predigitalTwin: jsonElement.predigitalTwin,
        preoriginalObj: jsonElement.preoriginalObj,
        originalObj: jsonElement.originalObj,
        digitalTwinConnected: jsonElement.digitalTwinConnected,
        lastStatesOrder: jsonElement.lastStatesOrder
      };
      return {
        ...super.getThingParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    // in case instead of a reference to an object there is a string (representing object's id),
    // replace the id with the reference to object
    // updateComplexityReferences() {
    //   if (typeof this.refineable === 'string') {
    //     this.refineable = this.logicalElement.opmModel.getVisualElementById(this.refineable);
    //   }
    //   if (typeof this.refineeInzooming === 'string') {
    //     this.refineeInzooming = this.logicalElement.opmModel.getVisualElementById(this.refineeInzooming);
    //   }
    //   if (typeof this.refineeUnfolding === 'string') {
    //     this.refineeUnfolding = this.logicalElement.opmModel.getVisualElementById(this.refineeUnfolding);
    //   }
    // }
    resetColors() {
      this.strokeColor = "#70E483";
    }
    clone() {
      const params = this.getParams();
      delete params.semiFolded;
      delete params.foldedUnderThing;
      params.children = [];
      const cloned = this.logicalElement.createVisual(params);
      cloned.setNewUUID();
      for (let i = 0; i < this.states.length; i++) {
        const clonedState = this.states[i].clone();
        clonedState.fatherObject = cloned;
        clonedState.parent = cloned;
        cloned.children.push(clonedState);
      }
      return cloned;
    }
    insertState(visual) {
      this.children.push(visual);
      visual.setPos(this.xPos + this.width, this.yPos + this.height);
      return visual;
    }
    createState() {
      return this.insertState(this.logicalElement.createLogicalAndVisualState(this));
    }
    addState() {
      const init = (0, getInitRappidShared)();
      if (init) {
        init.opmModel.logForUndo(this.logicalElement.text + " state added");
      }
      const ret = Array();
      /*if ((<OpmLogicalObject>this.logicalElement).value !== 'None')
        return ret;*/
      const logicalObject = this.logicalElement;
      if (logicalObject.protectedFromBeingRefinedBySubModel) {
        return ret;
      }
      if (logicalObject.states.length === 0 && logicalObject.valueType === valueType.None && !logicalObject.getBelongsToStereotyped()) {
        ret.push(this.createState());
      }
      if (!logicalObject.getBelongsToStereotyped()) {
        ret.push(this.createState());
      }
      return ret;
    }
    // When we click the X button. Delete both logical and visual.
    deleteState(state) {
      this.removeState(state);
      this.fatherObject.deleteState(state.logicalElement);
    }
    removeState(state) {
      for (let i = this.children.length - 1; i >= 0; i--) {
        if (state === this.children[i]) {
          this.children.splice(i, 1);
          break;
        }
      }
    }
    getStatesToExpress() {
      const union = this.logicalElement.states;
      const states = this.states;
      const ret = [];
      for (let i = 0; i < union.length; i++) {
        let exist = false;
        for (let j = 0; j < states.length; j++) {
          if (states[j].logicalElement === union[i]) {
            // ret.push({ text: union[i].text, exist: exist = true });
            exist = true;
          }
        }
        if (!exist) {
          ret.push({
            text: union[i].text,
            exist: false
          });
        }
      }
      return ret;
    }
    allStatesExpressed() {
      return this.logicalElement.states.length === this.states.length;
    }
    express(state) {
      const expressed = this.states.find(s => s.logicalElement === state);
      if (expressed) {
        return expressed;
      }
      const visual = this.logicalElement.createVisualState(this, state);
      if (!visual) {
        return undefined;
      }
      this.insertState(visual);
      const opd = this.logicalElement.opmModel.getOpdByElement(this);
      opd.add(visual);
      return visual;
    }
    expressChecked(checked) {
      const ret = new Array();
      for (let i = 0; i < checked.length; i++) {
        if (!checked[i].checked) {
          continue;
        }
        const state = this.logicalElement.states.find(s => s.text === checked[i].text);
        if (!state) {
          continue;
        }
        const visual = this.express(state);
        if (visual) {
          ret.push(visual);
        }
      }
      if (ret.length) {
        this.rearrange();
      }
      return ret;
    }
    updateLastStatesOrder() {
      const orderedNewStates = [];
      const currentStatesLids = this.states.map(s => s.logicalElement.lid);
      for (const st of currentStatesLids) {
        if (!this.lastStatesOrder.includes(st)) {
          orderedNewStates.push(st);
        }
      }
      this.lastStatesOrder = [...this.lastStatesOrder, ...orderedNewStates].sort((a, b) => {
        if (currentStatesLids.includes(a) && currentStatesLids.includes(b)) {
          return currentStatesLids.indexOf(a) - currentStatesLids.indexOf(b);
        }
        if (!currentStatesLids.includes(a) && currentStatesLids.includes(b)) {
          if (this.lastStatesOrder.includes(a) && this.lastStatesOrder.includes(b)) {
            return this.lastStatesOrder.indexOf(a) - this.lastStatesOrder.indexOf(b);
          }
          return -1;
        }
        if (currentStatesLids.includes(a) && !currentStatesLids.includes(b)) {
          if (this.lastStatesOrder.includes(a) && this.lastStatesOrder.includes(b)) {
            return this.lastStatesOrder.indexOf(a) - this.lastStatesOrder.indexOf(b);
          }
          return 1;
        }
        if (this.lastStatesOrder.includes(a) && this.lastStatesOrder.includes(b)) {
          return this.lastStatesOrder.indexOf(a) - this.lastStatesOrder.indexOf(b);
        }
        return 0;
      });
      this.lastStatesOrder = this.lastStatesOrder.filter(lid => !!this.logicalElement.opmModel.getLogicalElementByLid(lid));
    }
    suppressAll() {
      const list = new Array();
      const ret = new Array();
      this.updateLastStatesOrder();
      for (let i = 0; i < this.states.length; i++) {
        list.push(this.states[i]);
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].suppress()) {
          ret.push(list[i]);
        }
      }
      if (this.isEllipsisNeeded() && !this._ellipsis) {
        this.createEllipsis();
      } else if (!this.isEllipsisNeeded()) {
        this.removeEllipsis();
      }
      return ret;
    }
    expressAll(isNewlyCreated = false) {
      const states = this.logicalElement.states;
      for (let i = 0; i < states.length; i++) {
        if (!this.states.find(s => s.logicalElement === states[i])) {
          const createdVisualState = this.express(this.logicalElement.states[i]);
          if (!this.logicalElement.opmModel.logicalElements.includes(createdVisualState.logicalElement)) {
            this.logicalElement.opmModel.add(createdVisualState.logicalElement);
          }
        }
      }
      /*this.states_.sort(function (a, b) {
        return states.indexOf(a.logical) - states.indexOf(b.logical);
      });*/
      for (let i = 0; i < this.states.length; i++) {
        // if it is a new object copy => sort by creation order
        if (isNewlyCreated) {
          const pos = this.logicalElement.states.indexOf(this.states[i].logicalElement);
          this.states[i].setPos(pos, pos);
        } else {
          let pos = this.lastStatesOrder.indexOf(this.states[i].logicalElement.lid);
          if (pos === -1) {
            pos = this.logicalElement.states.indexOf(this.states[i].logicalElement);
          }
          this.states[i].setPos(pos + 3, 5);
        }
      }
      if (this.isEllipsisNeeded() && !this._ellipsis) {
        this.createEllipsis();
      } else if (!this.isEllipsisNeeded()) {
        this.removeEllipsis();
      }
      this.rearrange();
    }
    hasAnyLogicalStates() {
      return this.logicalElement.states.length !== 0;
    }
    rearrange(side) {
      if (!this.children.length) {
        return;
      }
      const previousSide = this.statesArrangement;
      if (side >= 0 && side <= 3) {
        this.statesArrangement = side;
      } else {
        side = this.statesArrangement;
      }
      if (this.children.find(c => c instanceof OpmVisualObject)) {
        this.rearrangeInzoomed();
        return;
      }
      const originalXpos = this.xPos + 0;
      const originalYpos = this.yPos + 0;
      const padding = 10;
      let maxStateWidth = 0;
      let maxStateHeight = 0;
      let states;
      let left;
      let top;
      let width = this.width;
      let height = this.height;
      this.children.forEach(state => {
        if (state.height > maxStateHeight) {
          maxStateHeight = state.height;
        }
        if (state.width > maxStateWidth) {
          maxStateWidth = state.width;
        }
      });
      /*
       if the arrangement is to top or bottom then states sorted by x position, starting from
       left reference is left side of the object.
       if the arrangement is to right or left then states sorted by y position, starting from
       top reference is top side of the object..
      */
      if (previousSide === statesArrangement.Top || previousSide === statesArrangement.Bottom) {
        states = this.children.filter(c => c instanceof OpmVisualState).sort(function (a, b) {
          return a.xPos - b.xPos;
        });
      } else {
        states = this.children.filter(c => c instanceof OpmVisualState).sort(function (a, b) {
          return a.yPos - b.yPos;
        });
      }
      if (side === statesArrangement.Top || side === statesArrangement.Bottom) {
        left = this.xPos + padding;
        this.refX = 0.5;
        this.xAlign = "middle";
        this.textHeight = "80%"; //0 - maxStateHeight - 2 * padding;
        this.textWidth = "80%";
        if (side === statesArrangement.Top) {
          top = this.yPos + padding;
          this.refY = 0.9;
          this.yAlign = "bottom";
          if (this._ellipsis) {
            this._ellipsis.yPos = top;
          }
        } else {
          top = this.yPos + this.height - padding - maxStateHeight;
          this.refY = 0.1;
          this.yAlign = "top";
          if (this._ellipsis) {
            this._ellipsis.yPos = top + maxStateHeight - this._ellipsis.height;
          }
        }
        // if moved states  from top to bottom or from bottom to top, no need to calculate
        // x position, only update y position
        if (side === statesArrangement.Bottom && previousSide === statesArrangement.Top || side === statesArrangement.Top && previousSide === statesArrangement.Bottom) {
          states.forEach(state => {
            state.yPos = top;
            left += state.width + padding;
          });
          if (this._ellipsis) {
            left += padding + this._ellipsis.width;
          }
        } else {
          states.forEach(state => {
            state.yPos = top;
            state.xPos = left;
            left += state.width + padding;
          });
          if (this._ellipsis) {
            this._ellipsis.xPos = left;
            left += padding + this._ellipsis.width;
          }
          width = left - this.xPos;
          // save place for text and after resizing will enlarge the size if it will not fit the text
          height = maxStateHeight + padding * 2 + 20;
          if (side === statesArrangement.Bottom && height < this.height) {
            this.yPos = this.yPos + (this.height - height);
          }
        }
      } else {
        // right or left
        top = this.yPos + padding;
        this.refY = 0.5;
        this.yAlign = "middle";
        this.textHeight = "80%";
        this.textWidth = 0 - maxStateWidth - padding * 2;
        if (side === statesArrangement.Left) {
          left = this.xPos + padding;
          this.refX = 0.95;
          this.xAlign = "right";
          if (this.ellipsis) {
            this._ellipsis.xPos = left;
          }
        } else {
          left = this.xPos + this.width - padding - maxStateWidth;
          this.refX = 0.05;
          this.xAlign = "left";
          if (this.ellipsis) {
            this._ellipsis.xPos = left + maxStateWidth - this._ellipsis.width;
          }
        }
        // if moved states from right to left or from left to right, no need to calculate
        // y position, only update x position
        if (side === statesArrangement.Right && previousSide === statesArrangement.Left || side === statesArrangement.Left && previousSide === statesArrangement.Right) {
          states.forEach(state => {
            state.xPos = left;
            top += state.height + padding;
          });
          if (this.ellipsis) {
            top += padding + this._ellipsis.height;
          }
        } else {
          states.forEach(state => {
            state.xPos = left;
            state.yPos = top;
            top += state.height + padding;
          });
          if (this.ellipsis) {
            this._ellipsis.yPos = top;
            top += padding + this._ellipsis.height;
          }
          width = maxStateWidth + padding * 2 + 100;
          height = top - this.yPos;
          if (side === statesArrangement.Right && width < this.width) {
            this.xPos = this.xPos + (this.width - width);
          }
        }
      }
      const newWidth = Math.max(width, this.calculateMinWidth(), this.width);
      const newHeight = Math.max(height, this.calculateMinHeight(), this.height);
      if (newWidth === this.width && newHeight === this.height) {
        this.xPos = originalXpos;
        this.yPos = originalYpos;
      }
      this.width = newWidth;
      this.height = newHeight;
    }
    rearrangeInzoomed() {
      const side = this.statesArrangement;
      const embeddedStates = this.children.filter(c => c instanceof OpmVisualState);
      const embeddedObjects = this.children.filter(child => child instanceof OpmVisualObject);
      const x = this.xPos;
      const y = this.yPos;
      const w = this.width;
      const h = this.height;
      const p = 10;
      this.refX = 0.5;
      this.xAlign = "middle";
      this.refY = 0.1;
      this.yAlign = "top";
      if (side === statesArrangement.Top || side === statesArrangement.Bottom) {
        embeddedStates.sort(function (a, b) {
          return a.xPos - b.xPos;
        });
        embeddedObjects.sort(function (a, b) {
          return a.yPos - b.yPos;
        });
        let x_size = 0;
        let maxHstate = embeddedStates.length ? embeddedStates[0] : {
          height: 0,
          yPos: 0
        };
        embeddedStates.forEach(state => {
          x_size += state.width + p;
          if (state.height > maxHstate.height) {
            maxHstate = state;
          }
        });
        x_size += p;
        const x_start = x + (w - x_size) / 2;
        let _object;
        if (side === statesArrangement.Top) {
          _object = embeddedObjects[0];
          this.refY = 0.18;
          this.yAlign = "top";
        } else if (side === statesArrangement.Bottom) {
          _object = embeddedObjects[embeddedObjects.length - 1];
        }
        let left = 0;
        embeddedStates.forEach(state => {
          if (side === statesArrangement.Top) {
            state.setPos(x_start + left + p, y + p);
          } else if (side === statesArrangement.Bottom) {
            state.setPos(x_start + left + p, _object.yPos + _object.height + p);
          }
          left += p + state.width;
        });
        if (embeddedStates.length) {
          if (embeddedStates[0].xPos < this.xPos) {
            this.xPos = embeddedStates[0].xPos - p;
          }
          if (embeddedStates[embeddedStates.length - 1].xPos + embeddedStates[embeddedStates.length - 1].width > this.xPos + this.width) {
            this.width += embeddedStates[embeddedStates.length - 1].xPos + embeddedStates[embeddedStates.length - 1].width - this.xPos + this.width + p;
          }
        }
        if (side === statesArrangement.Bottom) {
          if (this.yPos + this.height < maxHstate.yPos + maxHstate.height) {
            this.height += maxHstate.yPos + maxHstate.height - (this.yPos + this.height) + p;
          }
        }
      } else if (side === statesArrangement.Right || side === statesArrangement.Left) {
        embeddedStates.sort(function (a, b) {
          return a.yPos - b.yPos;
        });
        embeddedObjects.sort(function (a, b) {
          return a.xPos - b.xPos;
        });
        let y_size = 0;
        embeddedStates.forEach(state => {
          y_size += state.height + p;
        });
        y_size += p;
        const y_start = y + (h - y_size) / 2;
        let _object;
        if (side === statesArrangement.Left) {
          _object = embeddedObjects[0];
        } else if (side === statesArrangement.Right) {
          _object = embeddedObjects[embeddedObjects.length - 1];
        }
        let top = 0;
        embeddedStates.forEach(state => {
          if (side === statesArrangement.Left) {
            state.setPos(_object.xPos - state.width - p, y_start + top + p);
          } else if (side === statesArrangement.Right) {
            state.setPos(_object.xPos + _object.width + p, y_start + top + p);
          }
          top += p + state.height;
        });
      }
    }
    getVisualStatesOnly() {
      const onlyStates = this.children.filter(cell => cell instanceof OpmVisualState);
      return onlyStates;
    }
    // Should be moved to base classes.
    getTextWidth() {
      return textWrapping.getParagraphWidthByParams(this.logicalElement.text, this.textFontSize, this.textFontWeight, this.textFontWeight);
    }
    getTextHeight() {
      return textWrapping.getParagraphHeightByParams(this.logicalElement.text, this.textFontSize, this.textFontWeight, this.textFontWeight);
    }
    getHaloHandles() {
      if (this.isValueTyped()) {
        return ["hideValueObject", "suppressValueStates", "suppressValueStates"];
      }
      if (this.isComputational()) {
        return [...super.getHaloHandles(), "editUnits", "editAlias"];
      }
      if (this.getVisualStatesOnly().length === 0) {
        return [...super.getHaloHandles(), "addState", "editAlias"];
      } else {
        return [...super.getHaloHandles(), "addState", "suppress", "editAlias"];
      }
    }
    setReferencesOnCreate() {
      super.setReferencesOnCreate();
      for (const child of this.children) {
        if (child instanceof OpmVisualState) {
          child.logicalElement.parent = this.logicalElement;
          if (this.logicalElement.states.find(s => s === child.logicalElement) === undefined) {
            this.logicalElement.states.push(child.logicalElement);
          }
        }
      }
    }
    calculateMinHeight() {
      const states = this.states;
      const semiItemsLength = this.semiFolded.length;
      let maxStateHeight = 0;
      const paddingBottom = 10;
      // const paddingTop = 20;
      const textBreak = joint.util.breakText;
      const lines = textBreak(this.logicalElement.text, {
        width: this.width - 40
      }).split("\n").length;
      const fontSize = this.textFontSize || 14;
      // let paddingTop = Math.max(20, this.height * 0.1) + 10;
      const paddingTop = 20 + lines * fontSize;
      states.forEach(stt => {
        if (stt.height > maxStateHeight) {
          maxStateHeight = stt.height;
        }
      });
      if (maxStateHeight > 0 && semiItemsLength > 0) {
        maxStateHeight += 20;
      }
      const semiHeight = 30;
      const paddingBetween = 5;
      const addition = semiItemsLength === 1 ? 10 : 0;
      return paddingTop + maxStateHeight + paddingBottom + semiItemsLength * semiHeight + addition + paddingBetween * (semiItemsLength - 1);
    }
    calculateMinWidth() {
      const states = this.states;
      const semiItemsLength = this.semiFolded.length;
      if (semiItemsLength === 0) {
        return 135;
      }
      let maxStateWidth = 0;
      let paddingleft = 15;
      const paddingRight = 10;
      if (this.statesArrangement === statesArrangement.Right || this.statesArrangement === statesArrangement.Left) {
        states.forEach(stt => {
          if (stt.width > maxStateWidth) {
            maxStateWidth = stt.width;
          }
        });
        maxStateWidth = states.length > 0 ? maxStateWidth + 30 : maxStateWidth;
      }
      let semiWidth = 80;
      this.semiFolded.forEach(child => {
        paddingleft = 0;
        if (child.width > semiWidth) {
          semiWidth = child.width;
        }
      });
      return paddingleft + maxStateWidth + paddingRight + semiWidth;
    }
    arrangeInnerSemiFoldedThings() {
      const model = this.logicalElement.opmModel;
      this.semiFolded = this.semiFolded.sort(model.sortFoldedFundamentalRelations.bind(model));
      const states = this.states;
      const semiItemsLength = this.semiFolded.length;
      let maxStateHeight = 0;
      const paddingBottom = this.height * 0.07;
      const textBreak = joint.util.breakText;
      const lines = textBreak(this.logicalElement.text, {
        width: this.width - 40
      }).split("\n").length;
      const fontSize = this.textFontSize || 14;
      // let paddingTop = Math.max(20, this.height * 0.1) + 10;
      let paddingTop = 10 + lines * fontSize;
      states.forEach(stt => {
        if (stt.height > maxStateHeight) {
          maxStateHeight = stt.height;
        }
      });
      const totalSpace = this.height - maxStateHeight - paddingBottom - paddingTop;
      const semiHeight = 25;
      let paddingBetween = 0;
      if (semiItemsLength > 0) {
        paddingBetween = (totalSpace - semiItemsLength * semiHeight) / (semiItemsLength + 2);
        this.refY = Math.max(25, lines * fontSize / 2 + 10);
      }
      // else if (semiItemsLength === 1) {
      //   this.refY = Math.max(25, this.height * 0.1);
      // }
      const maxSemiWidth = Math.max(...this.semiFolded.map(sm => isNaN(sm.width) ? 160 : sm.width));
      const ordered = this.getSemifoldedThingsOrdered();
      for (const semi of ordered) {
        const isFirst = ordered.indexOf(semi) === 0 ? 0 : 1;
        // semi.yPos = paddingTop + (ordered.indexOf(semi) * (semiHeight + paddingBetween * isFirst));
        semi.yPos = paddingTop + paddingBetween + ordered.indexOf(semi) * (semiHeight + paddingBetween * isFirst);
        semi.xPos = (this.width - maxSemiWidth) / 2;
      }
    }
    hasRange() {
      const logical = this.logicalElement;
      return logical.hasRange();
    }
    isValueTyped() {
      const logical = this.logicalElement;
      return logical.isValueTyped();
    }
    setValueAsDefault() {
      const logical = this.logicalElement;
      const state = logical.states[0];
      if (state) {
        const validation = logical.getValidationModule();
        const value = validation.getDefault();
        state.setText(value);
      }
    }
    getCommandsDecider() {
      return new ObjectCommandsDecider();
    }
    canModifyText() {
      return this.isValueTyped() == false;
    }
  }

  /***/
}),
/***/3037: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    o: () => (/* binding */OpmVisualProcess)
  });
