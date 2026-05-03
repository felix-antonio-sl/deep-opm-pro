// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/VisualPart/OpmVisualThing.ts
// Extracted by opm-extracted/tools/extract.mjs

  let OpmVisualThing = /*#__PURE__*/(() => {
    class OpmVisualThing extends OpmVisualEntity {
      static #_ = (() => this.subThingsNumber = 3)();
      static #_2 = (() => this.OpmThingWidth = 135)();
      static #_3 = (() => this.opmThingHeight = 60)();
      constructor(params, logicalElement) {
        super(params, logicalElement);
        this.showBackgroundImage = BackgroundImageState.IMAGEONLY;
        this.children = new Array();
        this.semiFolded = params && params.semiFolded ? params.semiFolded : [];
        this.showBackgroundImage = params?.showBackgroundImage;
        this.foldedUnderThing = params && params.foldedUnderThing ? params.foldedUnderThing : {
          isFolded: false,
          triangleType: undefined,
          realTarget: undefined,
          targetPos: {
            xPos: undefined,
            yPos: undefined
          }
        };
      }
      updateParams(params) {
        super.updateParams(params);
        this.semiFolded = params.semiFolded ? params.semiFolded : this.semiFolded;
        this.showBackgroundImage = params?.showBackgroundImage;
        if (params.foldedUnderThing) {
          this.foldedUnderThing = {
            isFolded: params.foldedUnderThing.isFolded,
            triangleType: params.foldedUnderThing.triangleType,
            realTarget: params.foldedUnderThing.realTarget,
            targetPos: params.targetPos
          };
        }
        // let refineable, refineeInzooming, refineeUnfolding;
        // if (this.logicalElement && this.logicalElement.opmModel) {
        //   refineable = this.logicalElement.opmModel.getVisualElementById(params.refineableId);
        //   refineeInzooming = this.logicalElement.opmModel.getVisualElementById(params.refineeInzoomingId);
        //   refineeUnfolding = this.logicalElement.opmModel.getVisualElementById(params.refineeUnfoldingId);
        // }
        // if (!this.refineable)
        //   this.refineable = refineable ? refineable : params.refineableId;
        // if (!this.refineeInzooming)
        //   this.refineeInzooming = refineeInzooming ? refineeInzooming : params.refineeInzoomingId;
        // if (!this.refineeUnfolding)
        //   this.refineeUnfolding = refineeUnfolding ? refineeUnfolding : params.refineeUnfoldingId;
      }
      setParams(params) {
        super.setParams(params);
        this.semiFolded = params.semiFolded ? params.semiFolded : this.semiFolded;
        this.foldedUnderThing = params.foldedUnderThing ? params.foldedUnderThing : this.foldedUnderThing;
        if (params.hasOwnProperty("showBackgroundImage")) {
          this.showBackgroundImage = params.showBackgroundImage;
        }
      }
      getThingParams() {
        const childrenIds = [];
        this.children.forEach(function (child) {
          if (child && child.id) {
            childrenIds.push(child.id);
          }
        });
        const semifoldedIds = [];
        this.semiFolded.forEach(function (child) {
          if (child && child.id) {
            semifoldedIds.push(child.id);
          }
        });
        const params = {
          children: childrenIds,
          semiFolded: semifoldedIds,
          // foldedUnderThing: this.foldedUnderThing,
          showBackgroundImage: this.showBackgroundImage,
          foldedUnderThing: {
            isFolded: this.foldedUnderThing.isFolded,
            triangleType: this.foldedUnderThing.triangleType,
            realTarget: this.foldedUnderThing.realTarget ? this.foldedUnderThing.realTarget.visualElements[0].id : undefined,
            targetPos: this.foldedUnderThing.targetPos && this.foldedUnderThing.targetPos.xPos ? this.foldedUnderThing.targetPos : {
              xPos: undefined,
              yPos: undefined
            }
          }
        };
        return {
          ...super.getEntityParams(),
          ...params
        };
      }
      getThingParamsFromJsonElement(jsonElement) {
        const params = {
          refineableId: jsonElement.refineableId,
          refineeInzoomingId: jsonElement.refineeInzoomingId,
          refineeUnfoldingId: jsonElement.refineeUnfoldingId,
          children: jsonElement.children,
          showBackgroundImage: jsonElement.showBackgroundImage
        };
        return {
          ...super.getEntityParamsFromJsonElement(jsonElement),
          ...params
        };
      }
      getCorrectStrokeWidth() {
        if (this.getRefineeInzoom() || this.getRefineeUnfold() || this.logicalElement.getStereotype()) {
          return 4;
        }
        return 2;
      }
      getShowBackgroundImageState() {
        return this.showBackgroundImage;
      }
      getChildren() {
        return this.children;
      }
      isFoldedUnderThing() {
        if (this.foldedUnderThing?.realTarget) {
          // a fix for a common bug.
          const logRealTarget = this.logicalElement.opmModel.getLogicalElementByLid(this.foldedUnderThing.realTarget.lid);
          this.foldedUnderThing.realTarget = logRealTarget;
        }
        return this.foldedUnderThing;
      }
      calculateMinHeight() {
        return 0;
      }
      calculateMinWidth() {
        return 0;
      }
      arrangeInnerSemiFoldedThings() {}
      setFoldedUnderThing(value, type, realTarget, targetPos) {
        this.foldedUnderThing = {
          isFolded: value,
          triangleType: type,
          realTarget,
          targetPos: targetPos
        };
      }
      getDisplayText() {
        let txt = this.logicalElement.getDisplayText();
        if (this.getRefineeInzoom() === this && this.type === EntityType.Process) {
          return txt;
        }
        const logicalExhibitions = this.logicalElement.getLinks().inGoing.filter(l => l.linkType === linkType.Exhibition);
        const visualExhibitions = this.getLinks().inGoing.filter(l => l.type === linkType.Exhibition);
        let needToAdd = false;
        for (const logLink of logicalExhibitions) {
          if (!visualExhibitions.find(v => v.logicalElement === logLink)) {
            needToAdd = true;
          }
        }
        if (!needToAdd) {
          return txt;
        }
        const names = logicalExhibitions.map(l => l.sourceLogicalElement.getBareName());
        if (names.length === 1) {
          txt += " of " + names[0];
        } else if (names.length === 2) {
          txt += " of " + names[0] + " and " + names[1];
        } else if (names.length > 2) {
          txt += " of " + names.slice(0, names.length - 1).join(", ") + " and " + names[names.length - 1];
        }
        return txt;
      }
      removeThingFromSemiFoldedArray(thing) {
        const idx = this.semiFolded.indexOf(thing);
        if (idx !== -1) {
          this.semiFolded.splice(idx, 1);
        }
      }
      getThingHeritage() {
        const arr = [];
        const logicalThing = this.logicalElement;
        arr.push(logicalThing);
        let father = logicalThing.getFather();
        while (father && !arr.includes(father)) {
          arr.push(father);
          father = father.getFather();
        }
        arr.push(...logicalThing.getChildrenDeep());
        return arr;
      }
      inzoom(inzoomedOPD, styleParams) {
        let inzoomed = this.clone();
        inzoomedOPD.addElements(inzoomed.children.filter(t => t.constructor.name.includes("State")));
        inzoomedOPD.add(inzoomed);
        inzoomed.refineable = this;
        this.refineeInzooming = inzoomed;
        inzoomed.logicalElement.visualElements.forEach(vis => {
          vis.strokeWidth = 4;
          vis.refineeInzooming = inzoomed;
        });
        let yOffset = 100; // vertical padding. leave some space for text
        let betweenSubProcessesOffset = 30;
        inzoomed.width = OpmVisualThing.OpmThingWidth * 3;
        inzoomed.height = (betweenSubProcessesOffset + OpmVisualThing.opmThingHeight) * OpmVisualThing.subThingsNumber + yOffset + 65;
        inzoomed.xPos = inzoomed.xPos - inzoomed.width / 2 + this.width / 2;
        inzoomed.yPos = inzoomed.yPos - inzoomed.height / 2 + this.height / 2 + 200;
        inzoomed.textWidth = "50%";
        inzoomed.textHeight = "90%";
        inzoomed.refX = 0.5;
        inzoomed.refY = 0.1;
        inzoomed.yAlign = "top";
        inzoomed.logicalElement.visualElements.forEach(vis => vis.strokeWidth = 4);
        let startYCoord = inzoomed.yPos + yOffset;
        let xOffset = inzoomed.xPos + inzoomed.width / 2;
        for (let k = 0; k < OpmVisualThing.subThingsNumber; k++) {
          let fatherParams = this.logicalElement.getParams();
          delete fatherParams.lid;
          delete fatherParams.timeDurationStatus;
          delete fatherParams.max;
          delete fatherParams.min;
          delete fatherParams.units;
          delete fatherParams.nominal;
          delete fatherParams.text;
          delete fatherParams.isAutoFormat;
          delete fatherParams.description;
          delete fatherParams.satisfiedRequirementsSetParams;
          delete fatherParams.backgroundImageUrl;
          delete fatherParams.belongsToFatherModelId;
          let logicalProcess;
          logicalProcess = this.logicalElement.opmModel.logicalFactory(this.type, fatherParams);
          logicalProcess.code = code.Unspecified;
          logicalProcess.URLarray = [{
            iconType: "picture",
            url: "http://",
            description: " "
          }];
          let visualProcess = logicalProcess.visualElements[0];
          if (styleParams) {
            visualProcess.applyDefaultStyleParams(styleParams);
          }
          visualProcess.width = OpmVisualThing.OpmThingWidth;
          visualProcess.height = OpmVisualThing.opmThingHeight;
          visualProcess.setNewUUID();
          visualProcess.fatherObject = inzoomed;
          visualProcess.yPos = startYCoord;
          visualProcess.xPos = xOffset - visualProcess.width / 2;
          startYCoord += visualProcess.height + betweenSubProcessesOffset;
          inzoomedOPD.add(visualProcess);
          inzoomed.children.push(visualProcess);
        }
        return inzoomed;
      }
      removeUnneededParams(params) {
        delete params.lid;
        delete params.timeDurationStatus;
        delete params.max;
        delete params.min;
        delete params.units;
        delete params.nominal;
        delete params.text;
        delete params.isAutoFormat;
        delete params.description;
        delete params.satisfiedRequirementsSetParams;
        delete params.backgroundImageUrl;
        delete params.belongsToSubModel;
        delete params.belongsToFatherModelId;
        return params;
      }
      inzoomInDiagram(inzoomedOPD) {
        const inzoomed = this;
        inzoomed.refineable = this;
        this.refineeInzooming = this;
        const prevHeight = this.height;
        let yOffset = 80;
        const betweenSubThingsOffset = 30;
        inzoomed.width = OpmVisualThing.OpmThingWidth * 2;
        inzoomed.height = (betweenSubThingsOffset + OpmVisualThing.opmThingHeight) * OpmVisualThing.subThingsNumber + 110;
        if (this.fatherObject) {
          this.fatherObject.height = this.fatherObject.height + inzoomed.height - prevHeight;
          this.fatherObject.beautifyInzoomSubThings();
        }
        inzoomed.textWidth = "50%";
        inzoomed.textHeight = "90%";
        inzoomed.refX = 0.5;
        inzoomed.refY = 0.1;
        inzoomed.yAlign = "top";
        inzoomed.logicalElement.visualElements.forEach(vis => vis.strokeWidth = 4);
        let startYCoord = inzoomed.yPos + yOffset;
        let xOffset = inzoomed.xPos + inzoomed.width / 2;
        for (let k = 0; k < OpmVisualThing.subThingsNumber; k++) {
          const fatherParams = this.removeUnneededParams(this.logicalElement.getParams());
          let logicalThing;
          logicalThing = this.logicalElement.opmModel.logicalFactory(this.type, fatherParams);
          logicalThing.code = code.Unspecified;
          logicalThing.URLarray = [{
            iconType: "picture",
            url: "http://",
            description: " "
          }];
          let visualThing = logicalThing.visualElements[0];
          visualThing.width = OpmVisualThing.OpmThingWidth;
          visualThing.height = OpmVisualThing.opmThingHeight;
          visualThing.setNewUUID();
          visualThing.fatherObject = inzoomed;
          visualThing.yPos = startYCoord;
          visualThing.xPos = xOffset - visualThing.width / 2;
          startYCoord += visualThing.height + betweenSubThingsOffset;
          inzoomedOPD.add(visualThing);
          inzoomed.children.push(visualThing);
        }
        return this;
      }
      beautifyInzoomSubThings(yOffset = 100, betweenSubProcessesOffset = 30) {
        let startYCoord = this.yPos + yOffset;
        const xOffset = this.xPos + this.width / 2;
        for (const child of this.children.filter(c => typeof c === typeof this)) {
          child.yPos = startYCoord;
          child.xPos = xOffset - child.width / 2;
          startYCoord += child.height + betweenSubProcessesOffset;
        }
      }
      unfold(unfoldedOPD, styleParams) {
        const unfolded = this.clone();
        unfolded.refY = 0.5;
        unfolded.refX = 0.5;
        unfolded.yAlign = "middle";
        unfoldedOPD.add(unfolded);
        unfolded.fatherObject = null;
        if (unfolded.states) {
          unfolded.states.forEach(st => unfoldedOPD.add(st));
        }
        unfolded.setNewUUID();
        unfolded.refineable = this;
        this.refineeUnfolding = unfolded;
        unfolded.logicalElement.visualElements.forEach(vis => {
          vis.strokeWidth = 4;
          vis.refineeUnfolding = unfolded;
        });
        const proceduralLinks = this.addStructuralElements(unfoldedOPD, unfolded);
        proceduralLinks.forEach(link => {
          // A. find source and target logical elements of the link
          const proceduralLink = link;
          const source = proceduralLink.sourceVisualElement;
          const target = proceduralLink.targetVisualElements[0].targetVisualElement;
          // B. check that both elements have visual elements in the OPD
          const unfoldedSources = source.logicalElement.visualElements.filter(ve => unfoldedOPD.visualElements.includes(ve));
          const unfoldedTargets = target.logicalElement.visualElements.filter(ve => ve === unfolded || unfoldedOPD.visualElements.includes(ve));
          if (unfoldedSources.length > 0 && unfoldedTargets.length > 0) {
            // C. clone the link and add it to the OPD and the logical link as yet another visual instance.
            const newLink = proceduralLink.clone();
            newLink.sourceVisualElement = unfoldedSources[0];
            newLink.targetVisualElements[0].targetVisualElement = unfoldedTargets[0];
            unfoldedOPD.add(newLink);
          }
        });
        if (unfolded.getAllLinks().outGoing.filter(l => fundamental.contains(l.type) && l.target.logicalElement.isSatisfiedRequirementSetObject() === false).length === 0 && !unfolded.getRefineeInzoom()) {
          this.addAggregationsIfHadNone(unfolded, unfoldedOPD, styleParams);
        }
        return unfolded;
      }
      addAggregationsIfHadNone(thing, opd, styleParams) {
        const model = this.logicalElement.opmModel;
        model.setShouldLogForUndoRedo(false, "addAggregationsIfHadNone");
        const thingType = this.constructor.name.includes("Object") ? "Object" : "Process";
        const objectsNum = thingType === "Object" ? 3 : 0;
        const processesNum = thingType === "Process" ? 3 : 0;
        const ret = model.createManyThings(opd, processesNum, objectsNum);
        const createdThings = [...ret.objects.map(ob => ob.visual), ...ret.processes.map(pr => pr.visual)];
        ret.processes.forEach(item => item.logical.code = code.Unspecified);
        const initialXpos = thing.xPos - 10;
        const initialYpos = thing.yPos + thing.height + 80;
        const linkParams = {
          type: linkType.Aggregation,
          connection: linkConnectionType.enviromental
        };
        for (let i = 0; i < createdThings.length; i++) {
          if (styleParams) {
            createdThings[i].applyDefaultStyleParams(styleParams);
          }
          createdThings[i].xPos = initialXpos + i * 160;
          createdThings[i].yPos = initialYpos;
          createdThings[i].width = 135;
          createdThings[i].height = 60;
          createdThings[i].setEssence(thing.getEssence());
          model.connect(thing, createdThings[i], linkParams);
        }
        model.setShouldLogForUndoRedo(true, "addAggregationsIfHadNone");
      }
      /**
       * Adds structural elements into the opd and creates fundamental links among embedded children and parents, and also
       * gathered all procedural links associated with a folded elements to be processed in the opd as well when recursive
       * descent is finished.
       * @param inzoomedOPD
       * @param inzoomedObject
       * @param includeEmbedded
       */
      addStructuralElements(inzoomedOPD, inzoomedObject, includeEmbedded = true) {
        const thingID = this.id;
        const proceduralLinks = this.logicalElement.opmModel.currentOpd.getThingProceduralLinks(this.id);
        let moreLinks = [];
        if (includeEmbedded) {
          moreLinks = this.addEmbeddedElements(inzoomedOPD, inzoomedObject);
          proceduralLinks.concat(moreLinks);
        }
        const structuralLnks = this.logicalElement.opmModel.currentOpd.getThingStructuralLinks(this.id);
        if (structuralLnks.length === 0) {
          return proceduralLinks;
        }
        structuralLnks.forEach(link => {
          const strctLnk = link;
          if (strctLnk.sourceVisualElement.id === this.id) {
            const newPL = strctLnk.clone();
            this.logicalElement.opmModel.takeCareOfLinkEnds(strctLnk, newPL, thingID, inzoomedObject, inzoomedOPD);
            inzoomedOPD.add(newPL);
            moreLinks = [];
            if (strctLnk.sourceVisualElement.id === thingID) {
              moreLinks = strctLnk.targetVisualElements[0].targetVisualElement.addStructuralElements(inzoomedOPD, newPL.targetVisualElements[0].targetVisualElement);
            } else if (strctLnk.targetVisualElements[0].targetVisualElement.id === thingID) {
              moreLinks = strctLnk.sourceVisualElement.addStructuralElements(inzoomedOPD, newPL.sourceVisualElement);
            }
            proceduralLinks.concat(moreLinks);
          }
        });
        return proceduralLinks;
      }
      /**
       * Adds the embedded elements of an inzoomed object, and also collects relevant procedural links of that element
       * to be returned at the conclusion of the recursive call.
       * @param inzoomedOPD
       * @param inzoomedObject
       */
      addEmbeddedElements(inzoomedOPD, inzoomedObject) {
        const elms = this.logicalElement.visualElements;
        const copied = [];
        const proceduralLinks = [];
        for (let k = 0; k < elms.length; k++) {
          const embedded = elms[k].children.filter(child => !elms[k].semiFolded.includes(child));
          embedded.forEach(child => {
            if (inzoomedObject.constructor === child.constructor) {
              if (copied.find(l => l === child.logicalElement) !== undefined) {
                return;
              }
              const cloned = child.clone();
              copied.push(child.logicalElement);
              cloned.fatherObject = null;
              inzoomedOPD.add(cloned);
              for (const child of cloned.children || []) {
                inzoomedOPD.add(child);
              }
              const model = this.logicalElement.opmModel;
              const linkParams = {
                type: linkType.Aggregation,
                connection: linkConnectionType.enviromental
              };
              const ret = model.connect(inzoomedObject, cloned, linkParams, false);
              const moreLinks = child.addStructuralElements(inzoomedOPD, cloned);
              proceduralLinks.concat(moreLinks);
            }
          });
        }
        return proceduralLinks;
      }
      getSemifoldedThingsOrdered() {
        const orderedTypes = this.logicalElement.orderedFundamentalTypes || [];
        const ret = this.semiFolded.sort((a, b) => {
          if (a.isFoldedUnderThing().triangleType > b.isFoldedUnderThing().triangleType) {
            return 1;
          }
          if (a.isFoldedUnderThing().triangleType < b.isFoldedUnderThing().triangleType) {
            return -1;
          }
          if (orderedTypes.includes(a.isFoldedUnderThing().triangleType)) {
            if (a.logicalElement.visualElements[0].yPos > b.logicalElement.visualElements[0].yPos) {
              return 1;
            } else {
              return -1;
            }
          } else if (a.logicalElement.text > b.logicalElement.text) {
            return 1;
          } else {
            return -1;
          }
        });
        return ret;
      }
      setPos(x, y) {
        let dx = x - this.xPos;
        let dy = y - this.yPos;
        super.setPos(x, y);
        this.children.forEach(child => child.setPos(child.xPos + dx, child.yPos + dy));
      }
      isInzoomed() {
        return !!this.refineeInzooming || !!this.refineable;
      }
      isUnfolded() {
        return !!this.refineeUnfolding || !!this.refineable;
      }
      isInzoomedForTooltip() {
        return !!this.getRefineeInzoom();
      }
      isUnfoldedForTooltip() {
        return !!this.getRefineeUnfold();
      }
      getRefineable() {
        let refineable;
        if (this.getRefineeInzoom()) {
          refineable = this.getRefineeInzoom().refineable;
        } else if (this.getRefineeUnfold()) {
          refineable = this.getRefineeUnfold().refineable;
        }
        if (refineable) {
          return refineable;
        } else {
          return undefined;
        }
      }
      disconnectRefinable() {
        if (!this.getRefineable()) {
          return;
        }
        if (this.getRefineable().refineeInzooming === this && !this.getRefineeUnfold() || this.getRefineable().refineeUnfolding === this && !this.getRefineeInzoom()) {
          this.logicalElement.resetVisualsStrokeWidth();
        }
        if (this.getRefineeInzoom() === this) {
          for (const vis of this.logicalElement.visualElements) {
            vis.refineeInzooming = undefined;
            if (!this.getRefineeUnfold()) {
              vis.refineable = undefined;
              vis.logicalElement.cancelRefineable();
            }
          }
          // (<OpmVisualThing>this.refineable).refineeInzooming = undefined;
        }
        if (this.getRefineeUnfold() === this) {
          for (const vis of this.logicalElement.visualElements) {
            vis.refineeUnfolding = undefined;
            if (!this.getRefineeInzoom()) {
              vis.refineable = undefined;
              vis.logicalElement.cancelRefineable();
            }
          }
          // (<OpmVisualThing>this.refineable).refineeUnfolding = undefined;
        }
      }
      getFirstSubProcess(inzoomedOPD) {
        let firstSubProcess = null;
        for (let k = 0; k < inzoomedOPD.visualElements.length; k++) {
          if (inzoomedOPD.visualElements[k].fatherObject === this) {
            if (firstSubProcess == null) {
              firstSubProcess = inzoomedOPD.visualElements[k];
            } else if (firstSubProcess.yPos > inzoomedOPD.visualElements[k].yPos) {
              firstSubProcess = inzoomedOPD.visualElements[k];
            }
          }
        }
        return firstSubProcess;
      }
      getFirstChild() {
        const children = this.children.filter(v => v.type === this.type);
        let first = children[0];
        for (let k = 1; k < children.length; k++) {
          if (first.yPos > children[k].yPos) {
            first = children[k];
          }
        }
        return first;
      }
      getLastChild() {
        const children = this.children.filter(v => v.type === this.type);
        let last = children[0];
        for (let k = 1; k < children.length; k++) {
          if (last.yPos < children[k].yPos) {
            last = children[k];
          }
        }
        return last;
      }
      getLastSubProcess(inzoomedOPD) {
        let firstSubProcess = null;
        for (let k = 0; k < inzoomedOPD.visualElements.length; k++) {
          if (inzoomedOPD.visualElements[k] instanceof OpmVisualEntity && inzoomedOPD.visualElements[k].fatherObject === this) {
            if (firstSubProcess == null) {
              firstSubProcess = inzoomedOPD.visualElements[k];
            } else if (firstSubProcess.yPos < inzoomedOPD.visualElements[k].yPos) {
              firstSubProcess = inzoomedOPD.visualElements[k];
            }
          }
        }
        return firstSubProcess;
      }
      deleteChild(childId) {
        for (let i = this.children.length - 1; i >= 0; i--) {
          if (this.children[i].id === childId) {
            this.children.splice(i, 1);
            return;
          }
        }
      }
      /*
      bringKnownThings(links: Array<OpmLink>, opd: OpmOpd) {
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const relation = <OpmRelation<any>>links[i].logicalElement;
          const source = link.sourceVisualElement;
          const target = link.targetVisualElements[0].targetVisualElement;
             //if (relation.linkType === linkType.SelfInvocation)
          //  continue;
             let aux; // [source, target, index_of_this]
          if (source.logicalElement === this.logicalElement) // ThisThing is the source
            aux = [this, undefined, 0];
          else if (target.logicalElement === this.logicalElement) // ThisThing is the target
            aux = [undefined, this, 1];
          else
            continue;
             // If this link is already presented in this OPD.
          if (opd.visualElements.find(v => v.logicalElement === relation))
            continue;
             // TODO: ifs are taken from OpdModel.ts line 377
          if (this.logicalElement.name === 'OpmLogicalProcess' && this.refineable &&
            (<OpmVisualThing>this.refineable).refineeInzooming === this) {
            if (relation.linkType === linkType.Consumption)
              aux[aux[2]] = this.getFirstSubProcess(opd);
            else if (relation.linkType === linkType.Effect)
              aux[aux[2]] = this.getFirstSubProcess(opd);
            else if (relation.linkType === linkType.Result)
              aux[aux[2]] = this.getLastSubProcess(opd);
          }
             // Find if the second end presents at the current opd
          const visual = <OpmVisualEntity>(aux[2] ? source : target);
          aux[(aux[2] + 1) % 2] = opd.visualElements.find(v => v.logicalElement === visual.logicalElement);
             // If the second end does not present at the current opd
          if (aux[(aux[2] + 1) % 2] === undefined) {
            // If it has a father, bring the father.
            let father = visual.fatherObject;
            if (father) {
              // Search for father at curent opd. If not present, copy it.
              let fatherInCurrentOpd = <OpmVisualThing>opd.visualElements.find(v => v.logicalElement === father.logicalElement);
              if (fatherInCurrentOpd === undefined)
                fatherInCurrentOpd = father.copyToOpd(opd);
              for (let i = 0; i < fatherInCurrentOpd.children.length; i++)
                if (fatherInCurrentOpd.children[i].logicalElement === visual.logicalElement)
                  aux[(aux[2] + 1) % 2] = fatherInCurrentOpd.children[i];
            } else {
              let inCurrentOpd = <OpmVisualThing>opd.visualElements.find(v => v.logicalElement === visual.logicalElement);
              if (inCurrentOpd === undefined)
                inCurrentOpd = (<OpmVisualThing>visual).copyToOpd(opd);
              aux[(aux[2] + 1) % 2] = inCurrentOpd;
            }
          }
             // To avoid connection between a thing and it's father.
          if (aux[0] === (<OpmVisualThing>aux[1]).fatherObject || (<OpmVisualThing>aux[0]).fatherObject === aux[1])
            return;
             link.copyToOpd(opd, aux[0], aux[1]);
        }
      }
      */
      bring(model, opt = [], styleParams) {
        const opd = model.getOpdByThingId(this.id);
        new BringConnectedEntitiesAction(model, this, opd).act(opt, styleParams);
      }
      // Daniel: Clone the current visual and insert to (current) opd
      copyToOpd(opd) {
        const copy = this.clone();
        copy.xPos = this.xPos + 10;
        copy.yPos = this.yPos + 10;
        //this.logicalElement.visualElements.push(copy);
        copy.fatherObject = undefined;
        opd.visualElements.push(copy);
        if (copy.children) {
          opd.addElements(copy.children);
        }
        return copy;
      }
      applyDefaultStyleParams(styleParams) {
        if (!styleParams) {
          return;
        }
        const type = this.type === EntityType.Object ? "object" : "process";
        this.fill = styleParams[type].fill;
        this.strokeColor = styleParams[type].border_color;
        this.textColor = styleParams[type].text_color;
        this.textFontFamily = styleParams[type].font;
        this.textFontSize = styleParams[type].font_size;
      }
      getAffiliation() {
        const logical = this.logicalElement;
        return logical.affiliation;
      }
      setFatherObject(father) {
        this.fatherObject = father;
        if (!this.fatherObject.children.includes(this)) {
          this.fatherObject.children.push(this);
        }
      }
      toggleAffiliation() {
        this.logicalElement.opmModel.logForUndo(this.logicalElement.text + " change affiliation");
        const affiliation = this.getAffiliation();
        // toggle
        let value;
        if (affiliation === Affiliation.Environmental) {
          value = Affiliation.Systemic;
        } else if (affiliation === Affiliation.Systemic) {
          value = Affiliation.Environmental;
        }
        return this.setAffiliation(value);
      }
      setAffiliation(affiliation) {
        const logical = this.logicalElement;
        const checkLegality = this.isLegalAffiliation(affiliation);
        if (checkLegality.isLegal) {
          logical.affiliation = affiliation;
          return {
            changed: true,
            value: affiliation
          };
        }
        return {
          changed: false,
          value: logical.affiliation,
          reason: checkLegality.reason
        };
      }
      isLegalAffiliation(affiliation) {
        if (this.logicalElement.getBelongsToStereotyped() && this.logicalElement.affiliation !== affiliation) {
          return {
            isLegal: false,
            reason: "Cannot change affiliation for a thing that belongs to a stereotype."
          };
        }
        if (this.logicalElement.belongsToFatherModelId) {
          return {
            isLegal: false,
            reason: "Cannot change affiliation for a shared thing with a father model."
          };
        }
        if (this.logicalElement.visualElements.find(v => v.protectedFromBeingChangedBySubModel)) {
          return {
            isLegal: false,
            reason: "Cannot change affiliation for a shared thing with a sub model."
          };
        }
        return {
          isLegal: true
        };
      }
      CanBeComputational() {
        const condition = !this.logicalElement.getBelongsToStereotyped() || this.logicalElement.getBelongsToStereotyped() && this.isComputational();
        return this.getEssence() === Essence.Informatical && condition && !this.logicalElement.getStereotype();
      }
      getEssence() {
        const logical = this.logicalElement;
        return logical.essence;
      }
      toggleEssence() {
        this.logicalElement.opmModel.logForUndo(this.logicalElement.text + " change essence");
        const essence = this.getEssence();
        // toggle
        let value;
        if (essence === Essence.Informatical) {
          value = Essence.Physical;
        } else if (essence === Essence.Physical) {
          value = Essence.Informatical;
        }
        return this.setEssence(value);
      }
      changeEssence(essence) {
        const logical = this.logicalElement;
        logical.essence = essence;
      }
      setEssence(essence) {
        const logical = this.logicalElement;
        const checkLegality = this.isLegalEssence(essence);
        if (checkLegality.isLegal) {
          logical.essence = essence;
          return {
            changed: true,
            value: essence
          };
        }
        return {
          changed: false,
          value: logical.essence,
          reason: checkLegality.reason
        };
      }
      isLegalEssence(essence) {
        const logical = this.logicalElement;
        if (logical.getBelongsToStereotyped() && essence !== logical.essence || logical.getStereotype()) {
          return {
            isLegal: false
          };
        }
        if (essence === Essence.Physical && logical.isComputational()) {
          return {
            isLegal: false
          };
        }
        if (essence === Essence.Informatical && this.getAllLinks().outGoing.find(l => l.type === linkType.Agent)) {
          return {
            isLegal: false
          };
        }
        if (essence === Essence.Informatical && this.getLinks().inGoing.find(l => l.type === linkType.Generalization && l.source.logicalElement.essence === Essence.Physical)) {
          return {
            isLegal: false
          };
        }
        const fatherElement = this.fatherObject;
        if (fatherElement && fatherElement.getEssence() === Essence.Informatical && essence === Essence.Physical) {
          return {
            isLegal: false
          };
        }
        if (this.logicalElement.belongsToFatherModelId) {
          return {
            isLegal: false,
            reason: "Cannot change essence for a shared thing with a father model."
          };
        }
        if (this.logicalElement.visualElements.find(v => v.protectedFromBeingChangedBySubModel)) {
          return {
            isLegal: false,
            reason: "Cannot change essence for a shared thing with a sub model."
          };
        }
        if (this.getRefineeInzoom() && this.children.length > 0) {
          const isPhysicalChild = this.children.find(child => OPCloudUtils.isInstanceOfVisualThing(child) && child.getEssence() === Essence.Physical);
          if (isPhysicalChild && essence === Essence.Informatical) {
            return {
              isLegal: false
            };
          }
        }
        const exh = this.getAllLinks().inGoing.find(l => l.type === linkType.Exhibition);
        if (exh) {
          const source = exh.source.type === EntityType.State ? exh.source.fatherObject : exh.source;
          const target = exh.target;
          if (source.type === EntityType.Object && target.type === EntityType.Object && essence === Essence.Physical) {
            return {
              isLegal: false
            };
          }
          if (source.type === EntityType.Object && source.getEssence() === Essence.Informatical && target.type === EntityType.Process) {
            return {
              isLegal: false
            };
          }
          if (source.type === EntityType.Process && target.type === EntityType.Object && essence === Essence.Physical) {
            return {
              isLegal: false
            };
          }
          if (source.type === EntityType.Process && source.getEssence() === Essence.Informatical && target.type === EntityType.Process) {
            return {
              isLegal: false
            };
          }
        }
        return {
          isLegal: true
        };
      }
      isComputational() {
        return this.logicalElement.isComputational();
      }
      getHaloHandles() {
        const isInzoomed = !!this.getRefineeInzoom();
        const isUnfolded = !!this.getRefineeUnfold();
        const inzoom = isInzoomed ? "ShowInZoom" : "inzoom";
        const unfold = isUnfolded ? "ShowUnfold" : "unfold";
        const handles = [...super.getHaloHandles()];
        if (!isInzoomed && !isUnfolded) {
          handles.push("computation");
        }
        if (this.isComputational()) {
          handles.push("deleteFunction");
          handles.push("updateComputationalProcess");
        } else {
          handles.push(inzoom, unfold);
        }
        handles.push("addConnected");
        return handles;
      }
      setReferencesFromJson(json, map) {
        super.setReferencesFromJson(json, map);
        if (!json.children) {
          json.children = [];
        }
        for (const childId of json.children) {
          this.children.push(map.get(childId));
        }
        // this.semiFolded.forEach(s => this.semiFolded[this.semiFolded.indexOf(s)] = <any>(map.get(s)));
        this.semiFolded = this.semiFolded.map(s => typeof s === "string" ? map.get(s) : s);
        // the following code prevent unnecessary visual removal due to refinee/refineable information missing.
        // later the autofix knows to complete the missing information
        try {
          this.refineable = map.get(json.refineableId);
        } catch (err) {
          this.refineable = undefined;
          console.error("refineable not found!");
        }
        try {
          this.refineeInzooming = map.get(json.refineeInzoomingId);
        } catch (err) {
          this.refineeInzooming = undefined;
          console.error("refinee Inzooming not found!");
        }
        try {
          this.refineeUnfolding = map.get(json.refineeUnfoldingId);
        } catch (err) {
          this.refineeUnfolding = undefined;
          console.error("refinee Unfolding not found!");
        }
      }
      afterCreatingReferencesFix(map) {
        const inzooming = this.refineeInzooming;
        if (inzooming && !inzooming.refineable) {
          inzooming.refineable = this;
        }
        const unfolded = this.refineeUnfolding;
        if (unfolded && !unfolded.refineable) {
          unfolded.refineable = this;
        }
        if (this.semiFolded && this.semiFolded.length > 0) {
          this.semiFolded = this.semiFolded.map(s => typeof s === "string" ? map.get(s) : s);
        }
        if (this.fatherObject && this.fatherObject.constructor.name.includes("tring")) {
          this.fatherObject = undefined;
        }
        const father = this.fatherObject;
        if (father && !father.children.find(v => v === this)) {
          father.children.push(this);
        }
        for (const child of this.children) {
          if (!child.fatherObject) {
            child.fatherObject = this;
          }
        }
        if (this.isFoldedUnderThing().isFolded && typeof this.foldedUnderThing.realTarget === "string") {
          this.foldedUnderThing.realTarget = map.get(this.foldedUnderThing.realTarget).logicalElement;
        }
      }
      getThingChildrenOrder() {
        let sortedArray = new Array();
        this.children.forEach(child => {
          if (child instanceof OpmVisualThing) {
            sortedArray.push(child);
          }
        });
        sortedArray = sortedArray.sort((n1, n2) => {
          if (n1.yPos > n2.yPos) {
            return 1;
          } else if (n1.yPos < n2.yPos) {
            return -1;
          }
          return 0;
        });
        return sortedArray;
      }
      // gets a refinee ( unfold / inzoom ) and returns the closest visual to the root SD up the opds tree.
      // the last element in the array is the closest visual to the Root SD.
      getVisualsSortedFromRefineeToRoot(refinee) {
        const model = this.logicalElement.opmModel;
        const refineeOpd = model.getOpdByThingId(refinee.id);
        const ret = [];
        let currentOpd = model.getOpd(refineeOpd.parendId);
        while (currentOpd?.parendId) {
          const visAtOpd = currentOpd.visualElements.filter(vis => vis.logicalElement === refinee.logicalElement);
          ret.push(...visAtOpd);
          if (currentOpd.getName() === "SD" && currentOpd.parendId === "SD") {
            break;
          }
          currentOpd = model.getOpd(currentOpd.parendId);
        }
        return ret;
      }
      getRefineeInzoom() {
        const visuals = this.logicalElement.visualElements;
        for (const visual of visuals) {
          if (visual.refineeInzooming) {
            return visual.refineeInzooming;
          }
        }
        return undefined;
      }
      getRefineeUnfold() {
        const visuals = this.logicalElement.visualElements;
        for (const visual of visuals) {
          if (visual.refineeUnfolding) {
            return visual.refineeUnfolding;
          }
        }
        return undefined;
      }
      canBeRemoved() {
        return canBeRemoved(this, this.logicalElement);
      }
      remove() {
        if (this.getRefineable() === this) {
          let array;
          if (this.getRefineeInzoom() === this || this.getRefineeInzoom() === this.getRefineable()) {
            array = [...this.logicalElement.visualElements];
          } else {
            array = this.getVisualsSortedFromRefineeToRoot(this);
          }
          const newRefineable = array[array.length - 1] === this ? array[array.length - 2] : array[array.length - 1];
          const refineeInzooming = this.getRefineeInzoom();
          const refineeUnfolding = this.getRefineeUnfold();
          this.logicalElement.visualElements.forEach(vis => {
            vis.refineable = newRefineable;
            vis.refineeInzooming = refineeInzooming;
            vis.refineeUnfolding = refineeUnfolding;
          });
        }
        if (this.fatherObject) {
          if (this.isFoldedUnderThing().isFolded) {
            const idx = this.fatherObject.semiFolded?.indexOf(this);
            if (idx >= 0) {
              this.fatherObject.semiFolded.splice(idx, 1);
            }
          }
          const idx = this.fatherObject.children.indexOf(this);
          if (idx >= 0) {
            this.fatherObject.children.splice(idx, 1);
          }
        }
        // do not move before the code above. it is needed to have the super information first.
        const ret = super.remove();
        const logical = this.logicalElement;
        let removeLogical = false;
        if (logical.isValueTyped && logical.isValueTyped()) {
          removeLogical = logical.valuedObjectFor.getValidationModule().valueTypeElement == undefined;
        } else if (logical.visualElements.filter(v => v.isAtRangesOpd() == false).length == 0) {
          removeLogical = true;
        }
        return [].concat(ret).concat(remove(this, logical, removeLogical));
      }
      isSemiFolded() {
        return this.semiFolded.length > 0;
      }
      addToSemiFoldedArray(item) {
        this.semiFolded.push(item);
      }
      removeFromSemiFoldedArray(item) {
        if (this.semiFolded.includes(item)) {
          this.semiFolded.splice(this.semiFolded.indexOf(item), 1);
        }
      }
      isAtRangesOpd() {
        const logical = this.logicalElement;
        const model = logical.opmModel;
        const rangesOpd = model.getRangesOpd();
        if (rangesOpd) {
          return rangesOpd.hasVisual(this);
        }
        return false;
      }
      inheritPort(original, newVisual, portId) {
        newVisual.ports = newVisual.ports || [];
        if (!newVisual.ports.find(p => p.id === portId)) {
          const portToCopy = original.ports?.find(pr => pr.id === portId);
          if (portToCopy) {
            newVisual.ports.push(portToCopy);
          }
        }
      }
    }
    return OpmVisualThing;
  })();
  function canBeRemoved(visual, logical) {
    const inzoomed = visual.getRefineeInzoom();
    if (visual.getRefineeInzoom() && visual.getRefineable() === inzoomed) {
      return true;
    }
    if (inzoomed === visual) {
      return false;
    }
    if (inzoomed && inzoomed !== visual) {
      const closestVisToRootArray = visual.getVisualsSortedFromRefineeToRoot(inzoomed);
      if (closestVisToRootArray.indexOf(visual) !== -1 && closestVisToRootArray.length <= 1) {
        return false;
      }
    }
    if (visual.protectedFromBeingChangedBySubModel || visual.belongsToFatherModelId) {
      return false;
    }
    if (logical.getParams().isWaitingProcess) {
      return false;
    }
    const unfolded = visual.getRefineeUnfold();
    if (unfolded) {
      if (unfolded === visual) {
        return false;
      }
      const closestVisToRootArray = visual.getVisualsSortedFromRefineeToRoot(unfolded);
      if (closestVisToRootArray.indexOf(visual) !== -1 && closestVisToRootArray.length <= 1) {
        return false;
      }
    }
    for (const child of visual.children) {
      if (!child.canBeRemoved() && !(child instanceof OpmVisualState)) {
        return false;
      }
    }
    return true;
  }
  function remove(visual, logical, removeLogical) {
    const elements = new Array();
    if (removeLogical) {
      logical.opmModel.removeLogicalElement(logical);
      if (logical.states) {
        // TODO: Move to Object's class
        [].concat(logical.states).forEach(s => logical.opmModel.removeLogicalElement(s));
      }
    }
    if (visual.semiFolded?.length) {
      for (let i = visual.semiFolded.length - 1; i >= 0; i--) {
        if (visual.semiFolded[i]?.remove) {
          visual.semiFolded[i].remove();
        }
      }
    }
    visual.disconnectRefinable();
    [].concat(visual.children).forEach(c => elements.push(...c.remove()));
    return elements;
  }

  /***/
}),
/***/58091: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    V: () => (/* binding */ImagesPoolType),
    b: () => (/* binding */BackgroundImageState)

  });
  var BackgroundImageState = /*#__PURE__*/function (BackgroundImageState) {
    BackgroundImageState[BackgroundImageState.TEXTONLY = 1] = "TEXTONLY";
    BackgroundImageState[BackgroundImageState.IMAGEONLY = 2] = "IMAGEONLY";
    BackgroundImageState[BackgroundImageState.TEXTANDIMAGE = 3] = "TEXTANDIMAGE";
    BackgroundImageState[BackgroundImageState.TEXTANDIMAGEFULL = 4] = "TEXTANDIMAGEFULL";
    return BackgroundImageState;
  }(BackgroundImageState || {});
  var ImagesPoolType = /*#__PURE__*/function (ImagesPoolType) {
    ImagesPoolType[ImagesPoolType.GLOBAL = 1] = "GLOBAL";
    ImagesPoolType[ImagesPoolType.ORG = 2] = "ORG";
    ImagesPoolType[ImagesPoolType.PERSONAL = 3] = "PERSONAL";
    return ImagesPoolType;
  }(ImagesPoolType || {});

  /***/
}),
/***/1707: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    X: () => (/* binding */BringConnectedCommand)

  });
  class BringConnectedCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: true,
        name: "bring-connected",
        displayTitle: "Bring Connected Elements",
        svg: "addConnected",
        action: new BringConnectedAction(this.init, this.thing),
        gif: "assets/gifs/bring_connected_things.gif"
      };
    }
    createToolbarHandle() {
      return {
        name: "bring-connected",
        displayTitle: "Bring Connected Elements",
        svg: "addConnected",
        action: new BringConnectedAction(this.init, this.thing),
        gif: "assets/gifs/bring_connected_things.gif"
      };
    }
  }
  class BringConnectedAction {
    constructor(init, thing) {
      this.init = init;
      this.thing = thing;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      if (cell) {
        cell.bringAction(this.init);
      }
    }
  }

  /***/
}),
/***/8180: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    V: () => (/* binding */CommandsDecider)

  });
  class CommandsDecider {
    getHaloHandle() {
      return this.getHaloCommands().map(c => c.createHaloHandle());
    }
    getToolabarHandle() {
      return this.getToolabarCommands().map(c => c.createToolbarHandle());
    }
  }

  /***/
}),
/***/49954: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    x: () => (/* binding */SetComputationCommand)

  });
  class SetComputationCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: true,
        name: "set-computation",
        displayTitle: "Computation",
        svg: "computation",
        action: new SetComputationAction(this.init, this.thing),
        gif: "assets/gifs/computation.gif"
      };
    }
    createToolbarHandle() {
      return {
        name: "set-computation",
        displayTitle: "Computation",
        svg: "computation",
        action: new SetComputationAction(this.init, this.thing),
        gif: "assets/gifs/computation.gif"
      };
    }
  }
  class SetComputationAction {
    constructor(init, thing) {
      this.init = init;
      this.thing = thing;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      if (cell) {
        cell.computation(cell, this.init);
      }
    }
  }

  /***/
}),
/***/38949: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    A: () => (/* binding */InzoomCommand)

  });
  class InzoomCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      const inInzoomedOPD = this.isInzoomedInCurrentOPD();
      const displayTitle = this.visual.getRefineeInzoom() ? inInzoomedOPD ? "This is the In-Zoomed view" : "Show In-Zoomed View" : "In-Zoom";
      return {
        flag: true,
        name: "inzoom",
        displayTitle: displayTitle,
        svg: "inzoom",
        action: new InzoomAction(this.init, this.thing),
        gif: "assets/gifs/thing_inzooming.gif"
      };
    }
    createToolbarHandle() {
      const inInzoomedOPD = this.isInzoomedInCurrentOPD();
      const displayTitle = this.visual.getRefineeInzoom() ? inInzoomedOPD ? "This is the In-Zoomed view" : "Show In-Zoomed View" : "In-Zoom";
      return {
        name: "inzoom",
        displayTitle: displayTitle,
        svg: "inzoom",
        action: new InzoomAction(this.init, this.thing),
        gif: "assets/gifs/thing_inzooming.gif"
      };
    }
    isInzoomedInCurrentOPD() {
      let inInzoomed = false;
      const InzoomOPD = this.init.opmModel.getOpdByThingId(this.visual.getRefineeInzoom()?.id);
      if (InzoomOPD === this.init.opmModel.currentOpd) {
        inInzoomed = true;
      }
      return inInzoomed;
    }
  }
  class InzoomAction {
    constructor(init, thing) {
      this.init = init;
      this.thing = thing;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      if (cell && cell.inzoomAction) {
        cell.inzoomAction(this.init);
      }
    }
  }

  /***/
}),
/***/7849: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    z: () => (/* binding */RemoveComputationCommand)

  });

  class RemoveComputationCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: true,
        name: "remove-computation",
        displayTitle: "Remove Computation",
        svg: "deleteFunction",
        action: new RemoveComputationAction(this.init, this.thing)
      };
    }
    createToolbarHandle() {
      return {
        name: "remove-computation",
        displayTitle: "Remove Computation",
        svg: "deleteFunction",
        action: new RemoveComputationAction(this.init, this.thing),
        gif: ""
      };
    }
  }
  class RemoveComputationAction {
    constructor(init, thing) {
      this.init = init;
      this.thing = thing;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      if (cell.getVisual().logicalElement.belongsToFatherModelId) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Cannot remove computation for a shared thing with a father model.", 5000, "Error");
        return;
      }
      if ((cell?.getVisual()).logicalElement.visualElements.find(v => v.protectedFromBeingChangedBySubModel)) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Cannot remove computation for a shared thing with a sub model.", 5000, "Error");
        return;
      }
      if (cell) {
        cell.removeComputational(this.init);
      }
    }
  }

  /***/
}),
/***/14357: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Y: () => (/* binding */RemoveCommand)

  });

  class RemoveCommand {
    constructor(init) {
      this.init = init;
    }
    createHaloHandle() {
      return {
        flag: false,
        name: "remove",
        displayTitle: "Remove",
        svg: "delete",
        action: new RemoveAction(this.init)
      };
    }
    createToolbarHandle() {
      return {
        name: "remove",
        displayTitle: "Remove",
        svg: "delete",
        action: new RemoveAction(this.init),
        gif: ""
      };
    }
  }
  class RemoveAction {
    constructor(init) {
      this.init = init;
    }
    act() {
      new Actions_deleteAction /* .DeleteAction */.S(this.init).act();
    }
  }

  /***/
}),
/***/46464: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    K: () => (/* binding */StylingCommand)

  });
  class StylingCommand {
    constructor(init, entity, visual) {
      this.init = init;
      this.entity = entity;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: false,
        name: "styling",
        displayTitle: "Style Element",
        svg: "styleElement",
        action: new StyleAction(this.init, this.entity, this.visual)
      };
    }
    createToolbarHandle() {
      return {
        name: "styling",
        displayTitle: "Style Element",
        svg: "styleElement",
        action: new StyleAction(this.init, this.entity, this.visual),
        gif: ""
      };
    }
  }
  class StyleAction {
    constructor(init, entity, visual) {
      this.init = init;
      this.entity = entity;
      this.visual = visual;
    }
    act() {
      this.init.elementToolbarReference.openStylingDiv();
    }
  }

  /***/
}),
/***/69262: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    w: () => (/* binding */ToggleAffiliationCommand)

  });
  class ToggleAffiliationCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: true,
        name: "toggle-affiliation",
        displayTitle: "Change Affiliation",
        svg: "toggle-affiliation",
        action: new ToggleAffiliationAction(this.init, this.thing, this.visual),
        gif: "assets/gifs/affiliation.gif"
      };
    }
    createToolbarHandle() {
      return {
        name: "toggle-affiliation",
        displayTitle: "Change Affiliation",
        svg: "toggle-affiliation",
        action: new ToggleAffiliationAction(this.init, this.thing, this.visual),
        gif: "assets/gifs/affiliation.gif"
      };
    }
  }
  class ToggleAffiliationAction {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      const vis = this.init.opmModel.getVisualElementById(this.thing.id);
      if (cell && vis) {
        cell.toggleAffiliation(vis);
      }
    }
  }

  /***/
}),
/***/92690: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    G: () => (/* binding */ToggleEssenceCommand)

  });
  class ToggleEssenceCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: true,
        name: "toggle-essence",
        displayTitle: "Change Essence",
        svg: "toggle-essence",
        action: new ToggleEssenceAction(this.init, this.thing, this.visual),
        gif: "assets/gifs/essence.gif"
      };
    }
    createToolbarHandle() {
      return {
        name: "toggle-essence",
        displayTitle: "Change Essence",
        svg: "toggle-essence",
        action: new ToggleEssenceAction(this.init, this.thing, this.visual),
        gif: "assets/gifs/essence.gif"
      };
    }
  }
  class ToggleEssenceAction {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      const vis = this.init.opmModel.getVisualElementById(this.thing.id);
      if (cell && vis) {
        cell.toggleEssence(vis);
      }
    }
  }

  /***/
}),
/***/69727: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    z: () => (/* binding */ToggleTextAutoFormatCommand)

  });
  class ToggleTextAutoFormatCommand {
    constructor(init, entity, visual) {
      this.init = init;
      this.entity = entity;
      this.visual = visual;
    }
    createHaloHandle() {
      return {
        flag: true,
        name: "toggle-text-format",
        displayTitle: "Toggle Text Format",
        svg: "toggle-text-format",
        action: new ToggleTextAutoFormatAction(this.init, this.entity),
        gif: "assets/gifs/auto_format.gif"
      };
    }
    createToolbarHandle() {
      const status = this.visual.logicalElement.getNameModule().isAutoFormat();
      const statusText = status ? "On" : "Off";
      return {
        name: "toggle-text-format",
        displayTitle: `OPM Principle Autoformatting: ${statusText}`,
        svg: status ? "text-auto-format-on" : "text-auto-format-off",
        action: new ToggleTextAutoFormatAction(this.init, this.entity),
        gif: "assets/gifs/auto_format.gif"
      };
    }
  }
  class ToggleTextAutoFormatAction {
    constructor(init, entity) {
      this.init = init;
      this.entity = entity;
    }
    act() {
      const cell = this.init.graph.getCell(this.entity.id);
      if (cell) {
        cell.toggleAutoFormat(this.init);
      }
    }
  }

  /***/
}),
/***/39605: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    s: () => (/* binding */UnfoldCommand)

  });
  class UnfoldCommand {
    constructor(init, thing, visual) {
      this.init = init;
      this.thing = thing;
      this.visual = visual;
    }
    createHaloHandle() {
      const inUnfoldedOPD = this.isUnfoldedInCurrentOPD();
      const displayTitle = this.visual.getRefineeUnfold() ? inUnfoldedOPD ? "This is the unfolded view" : "Show Unfold View" : "Unfold";
      return {
        flag: true,
        name: "unfold",
        displayTitle: displayTitle,
        svg: "unfold",
        action: new UnfoldAction(this.init, this.thing),
        gif: "assets/gifs/unfolding.gif"
      };
    }
    createToolbarHandle() {
      const inUnfoldedOPD = this.isUnfoldedInCurrentOPD();
      const displayTitle = this.visual.getRefineeUnfold() ? inUnfoldedOPD ? "This is the unfolded view" : "Show Unfold View" : "Unfold";
      return {
        name: "unfold",
        displayTitle: displayTitle,
        svg: "unfold",
        action: new UnfoldAction(this.init, this.thing),
        gif: "assets/gifs/unfolding.gif"
      };
    }
    isUnfoldedInCurrentOPD() {
      let inUnfolded = false;
      const unfoldOPD = this.init.opmModel.getOpdByThingId(this.visual.getRefineeUnfold()?.id);
      if (unfoldOPD === this.init.opmModel.currentOpd) {
        inUnfolded = true;
      }
      return inUnfolded;
    }
  }
  class UnfoldAction {
    constructor(init, thing) {
      this.init = init;
      this.thing = thing;
    }
    act() {
      const cell = this.init.graph.getCell(this.thing.id);
      if (cell?.unfoldAction) {
        cell.unfoldAction(this.init);
      }
    }
  }

  /***/
}),
/***/12629: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    P: () => (/* binding */RangeValidationAccess)

  });

  class RangeValidationAccess {
    static #_ = (() => this.STATES_NAME = [{
      title: "int",
      type: modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.INTEGER
    }, {
      title: "float",
      type: modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.FLOAT
    }, {
      title: "string",
      type: modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.STRING
    }, {
      title: "char",
      type: modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.CHAR
    }, {
      title: "boolean",
      type: modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.BOOLEAN
    }])();
    constructor(model) {
      this.model = model;
    }
    setRange(visual, range) {
      const logical = visual.logicalElement;
      if (logical.isComputational() == false) {
        return {
          wasSet: false,
          errors: ["Cannot set range to a non-computational object."]
        };
      }
      const computationModule = logical.getComputationModule();
      const validationModule = logical.getValidationModule();
      if (logical.getBelongsToStereotyped() && range.type !== validationModule.getType()) {
        return {
          wasSet: false,
          errors: ["Should match the stereotype's range type."]
        };
      }
      let stereotypeValidator;
      const stereotypeEquivalentLogical = logical.opmModel.getEquivalentLogicalThingFromStereotype(logical.equivalentFromStereotypeLID);
      stereotypeValidator = stereotypeEquivalentLogical?.getValidationModule().getValidator();
      const ret = computationModule.setRange(range.type, range.pattern, stereotypeValidator);
      if (ret.wasSet == false) {
        return {
          wasSet: false,
          errors: ret.errors
        };
      }
      const prop = this.getProperties(visual);
      if (prop.valueType.logical == undefined) {
        // no range, create, bring and connect
        this.createRangeAtRangesOpd(visual.logicalElement);
        this.bringValueTypeElement(visual);
        this.connectValueTypeElement(visual);
      }
      this.applyOnValueTypeElement(validationModule);
      return {
        wasSet: true,
        elements: []
      };
    }
    toggleValueTypeObject(visual) {
      const prop = this.getProperties(visual);
      let current;
      if (prop.valueType.visualAtCurrentOpd) {
        // value-typed object is already presented
        if (prop.connector.visualAtCurrentOpd && prop.valueType.visualAtCurrentOpd) {
          // value-typed object is already connected - disconnect
          prop.valueType.visualAtCurrentOpd.remove();
          current = "off";
        } else {
          // value-typed object is absent - connect
          this.connectValueTypeElement(visual);
          current = "on";
        }
      } else {
        // value-typed object is not presented, bring and connect
        this.bringValueTypeElement(visual);
        this.connectValueTypeElement(visual);
        current = "on";
      }
      return {
        changed: true,
        current: current
      };
    }
    removeRange(visual) {
      const prop = this.getProperties(visual);
      if (prop.hasRange == false) {
        return {
          removed: false
        };
      }
      return this.remove(visual.logicalElement);
    }
    suppressStates(valueObject) {
      const toSuppress = valueObject.states.filter(s => s.logicalElement.stateType !== "Current");
      toSuppress.forEach(s => s.suppress());
      return {
        success: true
      };
    }
    // Hide Value Object along with it's links
    hideValueObject(valueObject) {
      const ret = valueObject.remove();
      return {
        hide: ret.length > 0
      };
    }
    getState(visual) {
      const prop = this.getProperties(visual);
      return {
        hasRange: !!prop.valueType.logical,
        hasValueTypedObject: !!prop.connector.visualAtCurrentOpd
      };
    }
    remove(logical) {
      const validation = logical.getValidationModule();
      const someValueObjectVisual = validation.getValueTypeElement().visualElements[0];
      validation.removeRange();
      // We delete all instances - including from rangesOpd - this should do the job
      const ret = this.model.removeElementInModel(someValueObjectVisual);
      return ret;
    }
    applyOnValueTypeElement(validationModule) {
      // set current state according to the validation module
      const type = validationModule.getType();
      for (const state of validationModule.getValueTypeElement().states) {
        state.stateType = "";
        const number = RangeValidationAccess.STATES_NAME.findIndex(v => v.type == type);
        if (state.text == RangeValidationAccess.STATES_NAME[number].title) {
          state.stateType = "Current";
        }
      }
    }
    createValueTypeObject() {
      const current = this.model.currentOpd;
      const rangesOpd = this.model.getOrCreateRangesOpd();
      this.model.currentOpd = rangesOpd;
      const logicalValueObject = this.model.createLogicalObject();
      logicalValueObject.text = "Type";
      const visualRangedObject = logicalValueObject.visualElements[0];
      const intState = visualRangedObject.createState();
      intState.logicalElement.text = RangeValidationAccess.STATES_NAME.find(s => s.type == modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.INTEGER).title;
      const floatState = visualRangedObject.createState();
      floatState.logicalElement.text = RangeValidationAccess.STATES_NAME.find(s => s.type == modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.FLOAT).title;
      const stringState = visualRangedObject.createState();
      stringState.logicalElement.text = RangeValidationAccess.STATES_NAME.find(s => s.type == modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.STRING).title;
      const charState = visualRangedObject.createState();
      charState.logicalElement.text = RangeValidationAccess.STATES_NAME.find(s => s.type == modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.CHAR).title;
      const booleanState = visualRangedObject.createState();
      booleanState.logicalElement.text = RangeValidationAccess.STATES_NAME.find(s => s.type == modules_attribute_validation_attribute_range /* .ValueAttributeType */.y.BOOLEAN).title;
      rangesOpd.addElements([visualRangedObject, intState, floatState, stringState, charState, booleanState]);
      this.model.currentOpd = current;
      return visualRangedObject;
    }
    createFromStereotype(logical, range) {
      const computationModule = logical.getComputationModule();
      computationModule.setRange(range.type, range.pattern, undefined);
      this.createRangeAtRangesOpd(logical);
      this.applyOnValueTypeElement(computationModule.validationModule);
    }
    createRangeAtRangesOpd(logical) {
      const originalOpd = this.model.currentOpd;
      const rangesOpd = this.model.getOrCreateRangesOpd();
      this.model.currentOpd = rangesOpd;
      // Create logical value-type element and bring it to ranges-opd
      const valueObjectAtRangesOpd = this.createValueTypeObject();
      // Create a duplication visual at ranged opd
      const visualAtRangesOpd = this.model.createVisualThing(logical, rangesOpd);
      // Connect ranged-object with exhibition to valued-object
      this.model.links.connect(visualAtRangesOpd, valueObjectAtRangesOpd, {
        type: ConfigurationOptions /* .linkType */.h6.Exhibition,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
      this.model.currentOpd = originalOpd;
      // Set references
      logical.getValidationModule().setValueTypeElement(valueObjectAtRangesOpd.logicalElement);
      valueObjectAtRangesOpd.logicalElement.valuedObjectFor = logical;
    }
    // Connect value-type object to current element
    bringValueTypeElement(visual) {
      const prop = this.getProperties(visual);
      if (prop.valueType.visualAtCurrentOpd) {
        // A value-typed object present at current opd
        return prop.valueType.visualAtCurrentOpd;
      }
      // A value-typed object is not presented at current opd, and we should bring it
      const valueObjectAtCurrentOpd = this.model.bringVisualToOpd(prop.valueType.logical, prop.opd);
      // Beutify
      valueObjectAtCurrentOpd.xPos = visual.xPos - 150;
      valueObjectAtCurrentOpd.yPos = visual.yPos + 200;
      valueObjectAtCurrentOpd.width = 160;
      valueObjectAtCurrentOpd.height = 215;
      valueObjectAtCurrentOpd.xPos = 190;
      valueObjectAtCurrentOpd.statesArrangement = ConfigurationOptions /* .statesArrangement */.vF.Right;
      valueObjectAtCurrentOpd.expressAll();
      valueObjectAtCurrentOpd.rearrange(ConfigurationOptions /* .statesArrangement */.vF.Right);
      return valueObjectAtCurrentOpd;
    }
    // Connect value-type object to current visual
    connectValueTypeElement(visual) {
      const prop = this.getProperties(visual);
      if (!prop.valueType.logical || !prop.valueType.visualAtCurrentOpd) {
        return;
      }
      if (prop.connector.visualAtCurrentOpd) {
        // A value-typed object is already connected
        return prop.connector.visualAtCurrentOpd;
      }
      // A value-typed object is not connect
      return this.model.links.connect(visual, prop.valueType.visualAtCurrentOpd, {
        type: ConfigurationOptions /* .linkType */.h6.Exhibition,
        connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
      });
    }
    getProperties(visual) {
      const logical = visual.logicalElement;
      const validation = logical.getValidationModule();
      const currentOpd = this.model.getOpdByElement(visual);
      const hasRange = validation.isActive();
      if (hasRange == false || !currentOpd) {
        return {
          hasRange: false,
          valueType: {
            logical: undefined,
            visualAtCurrentOpd: undefined
          },
          connector: {
            logical: undefined,
            visualAtCurrentOpd: undefined
          },
          opd: currentOpd
        };
      }
      const valueTypeLogical = validation.getValueTypeElement();
      const valueTypedAtCurrentOpd = currentOpd.visualElements.find(v => v.logicalElement == valueTypeLogical);
      const links = logical.getLinksWith(valueTypeLogical);
      const connectorLogical = links.outGoing.find(l => l.linkType === ConfigurationOptions /* .linkType */.h6.Exhibition);
      let connectorAtCurrentOpd;
      if (connectorLogical && valueTypedAtCurrentOpd) {
        connectorAtCurrentOpd = connectorLogical.visualElements.find(v => v.sourceVisualElement === visual && v.targetVisualElements[0].targetVisualElement === valueTypedAtCurrentOpd);
      }
      return {
        hasRange: true,
        valueType: {
          logical: valueTypeLogical,
          visualAtCurrentOpd: valueTypedAtCurrentOpd
        },
        connector: {
          logical: connectorLogical,
          visualAtCurrentOpd: connectorAtCurrentOpd
        },
        opd: currentOpd
      };
    }
  }

  /***/
}),
/***/84072: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    j: () => (/* binding */Consistency),
    f: () => (/* binding */getLinkType)
  });