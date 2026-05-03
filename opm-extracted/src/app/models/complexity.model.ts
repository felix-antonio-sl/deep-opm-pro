// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/complexity.model.ts
// Extracted by opm-extracted/tools/extract.mjs


class Complexity {
  constructor(model) {
    this.model = model;
  }
  tryToInzoom(thing, styleParams, clean = false) {
    if (thing.isComputational() || thing.logicalElement.getBelongsToStereotyped() || thing.logicalElement.getStereotype()) {
      let msg = "";
      if (thing.logicalElement.getBelongsToStereotyped() || thing.logicalElement.getStereotype()) {
        msg += " A stereotyped thing cannot be refined.";
      }
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "In-Zoom can not be executed." + msg
      };
    }
    if (OPCloudUtils.isInstanceOfVisualProcess(thing) && thing.logicalElement.getIsWaitingProcess()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "In-Zoom can not be executed on a waiting process."
      };
    }
    if (OPCloudUtils.isInstanceOfVisualObject(thing) && thing.logicalElement.isSatisfiedRequirementSetObject()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "In-Zoom can not be executed on a Set Object"
      };
    }
    const refinee = thing.getRefineeInzoom();
    if (refinee) {
      return this.show(refinee);
    }
    if (thing.logicalElement.protectedFromBeingRefinedBySubModel || thing.logicalElement.opmModel.getOpdByThingId(thing.id)?.belongsToSubModel) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "Cannot inzoom a thing that belongs to a sub model."
      };
    }
    return this.inzoom(thing, styleParams, clean);
  }
  tryToInzoomInDiagram(thing) {
    if (thing.isComputational() || thing.logicalElement.getBelongsToStereotyped() || thing.logicalElement.getStereotype()) {
      let msg = "";
      if (thing.logicalElement.getBelongsToStereotyped() || thing.logicalElement.getStereotype()) {
        msg += " A stereotyped thing cannot be refined.";
      }
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "In-Zoom can not be executed." + msg
      };
    }
    if (OPCloudUtils.isInstanceOfVisualProcess(thing) && thing.logicalElement.getIsWaitingProcess()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "In-Zoom can not be executed on a waiting process."
      };
    }
    if (OPCloudUtils.isInstanceOfVisualObject(thing) && thing.logicalElement.isSatisfiedRequirementSetObject()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "In-Zoom can not be executed on a Set Object"
      };
    }
    const refinee = thing.getRefineeInzoom();
    if (refinee) {
      return this.show(refinee);
    }
    if (thing.logicalElement.protectedFromBeingRefinedBySubModel || thing.logicalElement.opmModel.getOpdByThingId(thing.id)?.belongsToSubModel) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "Cannot inzoom in diagram a thing that belongs to a sub model."
      };
    }
    return this.inzoomInDiagram(thing);
  }
  inzoom(thing, styleParams, clean = false) {
    const logical = thing.logicalElement;
    const inzoomedOPD = new OpmOpd(thing.logicalElement.getBareName());
    inzoomedOPD.SetParent(this.model.currentOpd.id);
    this.model.currentOpd.children.push(inzoomedOPD);
    this.model.addOpd(inzoomedOPD);
    const inzoomedThing = thing.inzoom(inzoomedOPD, styleParams);
    inzoomedThing.fatherObject = null;
    logical.setRefineable();
    if (!clean) {
      this.bringInzoom(thing, inzoomedThing, inzoomedOPD, styleParams);
    }
    if (logical.hasRequirements()) {
      logical.getSatisfiedRequirementSetModule().toggleAttribute();
      logical.getSatisfiedRequirementSetModule().toggleAttribute(true);
    }
    // inzoomedThing.bring(this.model, inzoomingRules);
    inzoomedOPD.beautify(inzoomedThing);
    return {
      success: true,
      isNewlyCreated: true,
      opd: inzoomedOPD,
      message: undefined
    };
  }
  inzoomInDiagram(thing) {
    const logical = thing.logicalElement;
    const opd = this.model.getOpdByThingId(thing.id);
    const inzoomedThing = thing.inzoomInDiagram(opd);
    logical.setRefineable();
    return {
      success: true,
      isNewlyCreated: true,
      opd: opd,
      message: undefined
    };
  }
  bringInzoom(cameFrom, inzoomed, opd, styleParams) {
    const links = {
      inGoing: [...cameFrom.getLinks().inGoing],
      outGoing: [...cameFrom.getLinks().outGoing]
    };
    const isObject = cameFrom.constructor.name.includes("Object");
    if (isObject) {
      const obj = cameFrom;
      obj.states.forEach(stt => {
        links.inGoing.push(...stt.getLinks().inGoing);
        links.outGoing.push(...stt.getLinks().outGoing);
      });
    }
    if (cameFrom.getLinks().outGoing.find(l => l.type === linkType.Invocation && l.target.logicalElement.getIsWaitingProcess())) {
      if (inzoomed.getLastChild()) {
        const linkParams = {
          type: linkType.Invocation,
          connection: linkConnectionType.enviromental
        };
        const ret = this.model.links.connect(inzoomed.getLastChild(), inzoomed, linkParams);
        inzoomed.ports = [inzoomed.getPortDataForSelfInvocationInzoomed()];
        ret.targetVisualElementPort = inzoomed.ports[0].id;
      }
    }
    const bring = [];
    const entities = [];
    const createdThings = [];
    for (const link of links.inGoing) {
      let path;
      if (link instanceof OpmProceduralLink && link.path) {
        path = link.path;
      }
      const trgt = link.type === linkType.Result && link.target.constructor.name.includes("State") && isObject ? link.target.logicalElement : inzoomed.logicalElement;
      const params = {
        type: link.type,
        isCondition: link.logicalElement.condition,
        isEvent: link.logicalElement.event,
        connection: linkConnectionType.enviromental,
        path: path,
        linkRequirements: link.logicalElement.linkRequirements
      };
      const ports = {
        source: link.sourceVisualElementPort,
        target: link.targetVisualElementPort
      };
      if (link.type === linkType.Consumption && inzoomed.getFirstChild()) {
        bring.push({
          source: link.source.logicalElement,
          target: inzoomed.getFirstChild().logicalElement,
          link: params,
          ports,
          originalLink: link
        });
      } else if (procedural.contains(link.type) || link.type === linkType.Exhibition) {
        bring.push({
          source: link.source.logicalElement,
          target: trgt,
          link: params,
          ports,
          originalLink: link
        });
      } else if (link.type === linkType.Invocation && link.source.logicalElement === link.target.logicalElement && inzoomed.getLastChild()) {
        const invocationPorts = {
          source: 0,
          target: 13
        };
        bring.push({
          source: inzoomed.getLastChild().logicalElement,
          target: link.source.logicalElement,
          link: params,
          ports: invocationPorts,
          originalLink: link
        });
      }
    }
    for (const link of links.outGoing) {
      const ports = {
        source: link.sourceVisualElementPort,
        target: link.targetVisualElementPort
      };
      let path;
      if (link instanceof OpmProceduralLink && link.path) {
        path = link.path;
      }
      const src = link.type === linkType.Consumption && link.source.constructor.name.includes("State") && isObject ? link.source.logicalElement : inzoomed.logicalElement;
      const params = {
        type: link.type,
        isCondition: link.logicalElement.condition,
        isEvent: link.logicalElement.event,
        connection: linkConnectionType.enviromental,
        path: path,
        linkRequirements: link.logicalElement.linkRequirements
      };
      if (link.type === linkType.Result && inzoomed.getLastChild()) {
        bring.push({
          source: inzoomed.getLastChild().logicalElement,
          target: link.target.logicalElement,
          link: params,
          ports,
          originalLink: link
        });
      } else if (link.type === linkType.Exhibition || procedural.contains(link.type)) {
        bring.push({
          source: src,
          target: link.target.logicalElement,
          link: params,
          ports,
          originalLink: link
        });
      }
    }
    // bringing exhibiting entities
    for (const item of bring) {
      entities.push(item.source);
      entities.push(item.target);
    }
    const opdCameFrom = this.model.getOpdByThingId(cameFrom.id);
    const exhibitionRelations = opdCameFrom.visualElements.filter(item => item instanceof OpmLink && item.type === linkType.Exhibition);
    for (const exhRel of exhibitionRelations) {
      const mExhRel = exhRel;
      const logiSource = mExhRel.logicalElement.sourceLogicalElement;
      const logiTargets = mExhRel.logicalElement.targetLogicalElements;
      if (logiSource === inzoomed.logicalElement || logiTargets.includes(inzoomed.logicalElement)) {
        continue;
      }
      for (const trgt of logiTargets) {
        if (entities.includes(trgt)) {
          const ports = {
            source: null,
            target: null
          };
          const params = {
            type: mExhRel.type,
            isCondition: false,
            isEvent: false,
            connection: linkConnectionType.enviromental
          };
          bring.push({
            source: logiSource,
            target: trgt,
            link: params,
            ports,
            originalLink: null
          });
        }
      }
    }
    const ext = [];
    for (const rel of bring) {
      if (rel.originalLink && rel.originalLink.type === linkType.Effect && !this.shouldBringEffect(rel.originalLink)) {
        continue;
      }
      const source = this.model.bringVisualToOpd(rel.source, opd);
      const target = this.model.bringVisualToOpd(rel.target, opd);
      createdThings.push(...[source, target].filter(t => OPCloudUtils.isInstanceOfVisualThing(t)));
      const type = rel.originalLink ? rel.originalLink.type : undefined;
      if (rel.originalLink && rel.originalLink.type !== linkType.Invocation) {
        this.arrangeInzoomOrUnfold(source, target, cameFrom, inzoomed, type, cameFrom.isUnfolded());
      }
      ext.push({
        source: source,
        target: target,
        link: rel.link,
        ports: rel.ports,
        originalLink: rel.originalLink
      });
      if (rel.originalLink && rel.originalLink.type !== linkType.Invocation && rel.ports.source) {
        const portToCopy = rel.originalLink.source.ports?.find(p => p.id === rel.ports.source);
        source.ports = source.ports ? source.ports : [];
        if (portToCopy && source.ports && !source.ports?.find(p => p.id === portToCopy.id)) {
          source.ports.push(portToCopy);
        }
      }
      if (rel.originalLink && rel.originalLink.type !== linkType.Invocation && rel.ports.target) {
        const portToCopy = rel.originalLink.target.ports?.find(p => p.id === rel.ports.target);
        target.ports = target.ports ? target.ports : [];
        if (portToCopy && target.ports && !target.ports?.find(p => p.id === portToCopy.id)) {
          target.ports.push(portToCopy);
        }
      }
      // if source is a state and it's father object is exhibited - bring the exhibition relation too
      const exhbParams = {
        type: linkType.Exhibition,
        isCondition: false,
        isEvent: false,
        connection: linkConnectionType.enviromental
      };
      const ports = {
        source: undefined,
        target: undefined
      };
      if (rel.source instanceof OpmLogicalState) {
        const object = rel.source.parent.visualElements.find(ob => this.model.getOpdByThingId(ob.id) === opdCameFrom);
        if (!object) {
          continue;
        }
        const objectLinks = object.getLinks().inGoing.filter(l => l.type === linkType.Exhibition);
        for (const exb of objectLinks) {
          const src = this.model.bringVisualToOpd(exb.sourceVisualElement.logicalElement, opd);
          const trgt = this.model.bringVisualToOpd(object.logicalElement, opd);
          createdThings.push(...[src, trgt].filter(t => OPCloudUtils.isInstanceOfVisualThing(t)));
          ext.push({
            source: src,
            target: trgt,
            link: exhbParams,
            ports: ports,
            originalLink: exb
          });
        }
      }
    }
    /////////////////////////////////////////
    const hasPartners = [];
    const types = [linkType.Consumption, linkType.Result];
    const unifiedToRemove = [];
    for (const rel of ext) {
      const link = this.model.links.connect(rel.source, rel.target, rel.link);
      // show distributed links according to inzoom/unfold:
      // if ([linkType.Instrument, linkType.Agent].includes(link.type)) {
      //   const ret = cameFrom.logicalElement.opmModel.inzoomSplit(<OpmProceduralLink>link);
      //   if (!ret.success) {
      //     if (cameFrom instanceof OpmVisualObject) {
      //       cameFrom.logicalElement.opmModel.structuralSplit(<OpmProceduralLink>link, 'object');
      //     } else {
      //       const ret = cameFrom.logicalElement.opmModel.structuralSplit(<OpmProceduralLink>link, 'process');
      //       unifiedToRemove.push(ret.remove);
      //     }
      //   }
      // }
      link.sourceVisualElementPort = rel.ports.source;
      link.targetVisualElementPort = rel.ports.target;
      if (rel.originalLink && types.includes(rel.originalLink.type) && rel.originalLink.getPartner()) {
        hasPartners.push({
          originalLink: rel.originalLink,
          newLink: link
        });
      }
      if (rel.originalLink) {
        link.logicalElement.sourceLogicalConnection = rel.originalLink.logicalElement.sourceLogicalConnection;
        link.logicalElement.targetLogicalConnection = rel.originalLink.logicalElement.targetLogicalConnection;
      }
    }
    for (const elem of opd.visualElements) {
      if (elem instanceof OpmProceduralLink && elem.path) {
        const partner = opd.visualElements.find(l => l !== elem && l instanceof OpmProceduralLink && l.path === elem.path);
        if (partner && (elem.type === linkType.Result && partner.type === linkType.Consumption || partner.type === linkType.Result && elem.type === linkType.Consumption)) {
          elem.setAsPartner(partner);
        }
      }
    }
    for (const item of hasPartners) {
      const partnerAtOpdCameFrom = item.originalLink.getPartner();
      const partnerAtNewOpd = hasPartners.find(itm => itm.originalLink === partnerAtOpdCameFrom);
      if (partnerAtNewOpd && partnerAtNewOpd.newLink) {
        partnerAtNewOpd.newLink.setAsPartner(item.newLink);
      }
    }
    opd.visualElements.filter(vis => vis.constructor.name.includes("Object")).forEach(vis => {
      const obj = vis;
      obj.expressAll(true);
      if ((obj.getRefineeUnfold() || obj.getRefineeInzoom()) && obj.children.length === 0) {
        obj.textAnchor = "middle";
        obj.refY = 0.5;
        obj.yAlign = "middle";
      }
    });
    if (styleParams) {
      for (const th of createdThings) {
        th.applyDefaultStyleParams(styleParams);
      }
    }
    return {
      unifiedToRemove: unifiedToRemove
    };
  }
  shouldBringEffect(link) {
    if (link.visible === false) {
      return false;
    }
    const source = link.sourceVisualElement;
    const target = link.targetVisualElements[0].targetVisualElement;
    const object = source instanceof OpmVisualObject ? source : target;
    const process = source instanceof OpmVisualObject ? target : source;
    const ins = process.getLinks().inGoing.filter(l => l.type === linkType.Consumption && l.sourceVisualElement.fatherObject && l.sourceVisualElement.fatherObject.id === object.id);
    const outs = process.getLinks().outGoing.filter(l => l.type === linkType.Result && l.targetVisualElements[0].targetVisualElement.fatherObject && l.targetVisualElements[0].targetVisualElement.fatherObject.id === object.id);
    const inouts = [...ins, ...outs];
    if (inouts.length === 0) {
      return true;
    }
    return false;
  }
  tryToUnfold(thing, styleParams, clean = false) {
    if (thing.isComputational() && !thing.logicalElement.getStereotype()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "Unfold can not be excuted."
      };
    }
    if (thing.logicalElement.protectedFromBeingRefinedBySubModel || thing.logicalElement.opmModel.getOpdByThingId(thing.id)?.belongsToSubModel) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "Cannot unfold a thing that belongs to a sub model."
      };
    }
    if (OPCloudUtils.isInstanceOfVisualProcess(thing) && thing.logicalElement.getIsWaitingProcess()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "Unfold can not be executed on a waiting process."
      };
    }
    if (OPCloudUtils.isInstanceOfVisualObject(thing) && thing.logicalElement.isSatisfiedRequirementSetObject()) {
      return {
        success: false,
        isNewlyCreated: false,
        opd: undefined,
        message: "Unfold can not be executed on a Set Object"
      };
    }
    const refinee = thing.getRefineeUnfold();
    if (refinee) {
      return this.show(refinee);
    }
    return this.unfold(thing, styleParams, clean);
  }
  unfold(thing, styleParams, clean = false) {
    const currentOpd = this.model.currentOpd;
    const logicalThing = thing.logicalElement;
    let name = logicalThing.text;
    if (logicalThing.isSatisfiedRequirementObject()) {
      const owner = this.model.getOwnerOfRequirementByRequirementLID(logicalThing.lid);
      if (owner) {
        name += " of " + owner.text;
      }
    }
    const unfoldedOPD = new OpmOpd(name);
    this.model.addOpd(unfoldedOPD);
    unfoldedOPD.SetParent(currentOpd.id);
    currentOpd.children.push(unfoldedOPD);
    const unfoldedThing = thing.unfold(unfoldedOPD, styleParams);
    unfoldedOPD.layoutHierarchically();
    if (!clean) {
      const ret2 = this.bringInzoom(thing, unfoldedThing, unfoldedOPD, styleParams);
      // if ((<any>thing.logicalElement).getBelongsToStereotyped() || (<any>thing.logicalElement).getStereotype())
      thing.logicalElement.opmModel.bring(unfoldedThing, null, styleParams);
      if (ret2.unifiedToRemove) {
        this.removeRedundentUnified(ret2.unifiedToRemove);
      }
    }
    if (thing.getRefineeInzoom()) {
      const logical = thing.logicalElement;
      if (logical.orderedFundamentalTypes && !logical.orderedFundamentalTypes.includes(linkType.Aggregation)) {
        logical.orderedFundamentalTypes.push(linkType.Aggregation);
      } else if (!logical.orderedFundamentalTypes) {
        logical.orderedFundamentalTypes = [linkType.Aggregation];
      }
    }
    const logical = unfoldedThing.logicalElement;
    // if (OPCloudUtils.isInstanceOfLogicalObject(logical) && (<OpmLogicalThing<OpmVisualThing>>logical).isSatisfiedRequirementObject())
    //   this.setRequirementsBroughtEntitiesPositions(unfoldedThing, unfoldedOPD);
    if (logical.hasRequirements()) {
      logical.getSatisfiedRequirementSetModule().toggleAttribute(true);
    }
    return {
      success: true,
      isNewlyCreated: true,
      opd: unfoldedOPD,
      message: undefined
    };
  }
  setRequirementsBroughtEntitiesPositions(requirementObject, opd) {
    const outLinksTargets = requirementObject.getLinks().outGoing.map(l => l.target).filter(t => t !== requirementObject && OPCloudUtils.isInstanceOfVisualEntity(t));
    const arr = [];
    for (const target of outLinksTargets) {
      arr.push(target);
      if (OPCloudUtils.isInstanceOfVisualObject(target)) {
        arr.push(...target.states);
      }
    }
    const avgPoint = {
      x: 0,
      y: 0
    };
    for (const t of arr) {
      avgPoint.x += t.xPos / arr.length;
      avgPoint.y += t.yPos / arr.length;
    }
    const diffX = requirementObject.xPos - avgPoint.x;
    const diffY = requirementObject.yPos - avgPoint.y;
    const minY = Math.min(...arr.map(ent => ent.yPos));
    for (const target of arr) {
      const trgt = target;
      trgt.xPos += diffX;
      trgt.yPos += requirementObject.yPos - minY + 250;
      trgt.yPos = trgt.yPos + (trgt.yPos - requirementObject.yPos) * 0.6;
    }
    for (const link of requirementObject.getLinks().outGoing.filter(l => l.type === linkType.Exhibition)) {
      const exh = link;
      exh.setSymbolPos(requirementObject.xPos + requirementObject.width / 2, requirementObject.yPos + requirementObject.height + 80);
    }
  }
  show(refinee) {
    const opd = this.model.getOpdByElement(refinee);
    return {
      success: opd !== undefined,
      isNewlyCreated: false,
      opd: opd,
      message: undefined
    };
  }
  /*
    bringExhibitingObject(inzoomedOPD: OpmOpd) {
      // objects: the objects that was needed in the in zoomed opd
      const objects = inzoomedOPD.visualElements.filter(l => l instanceof OpmVisualObject);
      const logicLinks = this.model.logicalElements.filter(l => l instanceof OpmFundamentalRelation && l.linkType === linkType.Exhibition);
      const visLinks = new Array();
      logicLinks.forEach(lg => visLinks.push(lg.visualElements[0]));
      const opd = this.model.currentOpd;
      objects.forEach(obj => {
        // will bring only the Exhibition links that are relevant to the objects that exists in the new opd
        (<OpmVisualThing>obj).bringKnownThings(visLinks, opd);
        inzoomedOPD.beautify(<OpmVisualThing>obj);
      });
    }
  */
  outzoomNewDiagram(type, visuals, newThingName = "noName", styleParams) {
    if (visuals.length < 2) {
      return {
        success: false,
        message: "Cannot Outzoom. Not enough things selected."
      };
    }
    const things = visuals.filter(en => en instanceof OpmVisualThing);
    if (things.length < visuals.length) {
      return {
        success: false,
        message: "Cannot Outzoom. All elements should be things."
      };
    }
    // calculating outzoomed thing position
    // const type = (visuals[0] instanceof OpmVisualObject) ? EntityType.Object : EntityType.Process;
    let xPos = 0;
    let yPos = 0;
    visuals.forEach(vis => {
      xPos += vis.xPos;
      yPos += vis.yPos;
    });
    let newEssence = Essence.Informatical;
    if (visuals.find(v => v.logicalElement.essence === Essence.Physical)) {
      newEssence = Essence.Physical;
    }
    const strokeParams = type === EntityType.Object ? "#70E483" : "#3BC3FF";
    // creating the new outzoomed thing
    const thingParams = {
      text: newThingName,
      affiliation: Affiliation.Systemic,
      essence: newEssence,
      id: uuid(),
      xPos: xPos / visuals.length,
      yPos: yPos / visuals.length,
      width: OpmVisualThing.OpmThingWidth,
      height: OpmVisualThing.opmThingHeight,
      refX: 0.5,
      refY: 0.5,
      textFontSize: 14,
      xAlign: "middle",
      yAlign: "middle",
      fill: "#ffffff",
      strokeColor: strokeParams,
      strokeWidth: 2,
      textColor: "#000000",
      textFontFamily: "Arial, helvetica, sans-serif",
      textFontWeight: 600,
      textHeight: "80%",
      textWidth: "80%"
    };
    if (newThingName === "noName") {
      delete thingParams.text;
    }
    const newThingLogical = logicalFactoryInsertCurrentOPD(type, this.model, thingParams);
    if (newThingLogical instanceof OpmLogicalProcess) {
      newThingLogical.code = 0;
    }
    const visual = newThingLogical.visualElements[0];
    if (visuals[0].fatherObject) {
      visual.setFatherObject(visuals[0].fatherObject);
    }
    visual.strokeWidth = 4;
    if (styleParams) {
      visual.applyDefaultStyleParams(styleParams);
    }
    // inzooming the new thing so we can move the outzoomedThings into it's new opd.
    const originalOpd = this.model.getOpdByThingId(visuals[0].id);
    const ret = this.tryToInzoom(visual, styleParams);
    this.model.currentOpd = originalOpd;
    const newOpd = ret.opd;
    newOpd.parendId = originalOpd.id;
    // removing the auto-added sub things.
    const newInzoomed = newOpd.visualElements[0];
    for (let i = newInzoomed.children.length - 1; i >= 0; i--) {
      newInzoomed.children[i].remove();
    }
    // moving the things to the newly created opd.
    visuals.forEach(vis => {
      const newVisAtOpd = vis.copyToOpd(newOpd);
      newVisAtOpd.setFatherObject(newInzoomed);
    });
    // bringing the links down to the new opd
    let newlinks = [];
    const linksToBringIn = [];
    const linksToBringOut = [];
    for (const visAtOldOpd of visuals) {
      linksToBringIn.push(...visAtOldOpd.getLinks().inGoing);
      linksToBringOut.push(...visAtOldOpd.getLinks().outGoing);
    }
    for (const inLink of linksToBringIn) {
      const src = inLink.sourceVisualElement;
      const trgt = inLink.targetVisualElements[0].targetVisualElement;
      const visTargetAtOpd = newOpd.visualElements.find(v => v.logicalElement === trgt.logicalElement);
      let visSourceAtOpd = newOpd.visualElements.find(v => v.logicalElement === src.logicalElement);
      if (!visSourceAtOpd) {
        visSourceAtOpd = this.model.bringVisualToOpd(src.logicalElement, newOpd);
        if (OPCloudUtils.isInstanceOfVisualThing(visSourceAtOpd)) {
          visSourceAtOpd.applyDefaultStyleParams(styleParams);
        } else if (OPCloudUtils.isInstanceOfVisualState(visSourceAtOpd)) {
          visSourceAtOpd.fatherObject.applyDefaultStyleParams(styleParams);
        }
      }
      const linkParams = {
        type: inLink.logicalElement.linkType,
        connection: linkConnectionType.enviromental,
        isCondition: inLink.isCondition,
        isEvent: inLink.isEvent
      };
      this.model.links.connect(visSourceAtOpd, visTargetAtOpd, linkParams);
      newlinks.push(this.model.links.move(src, visual, inLink));
    }
    for (const outLink of linksToBringOut) {
      if (linksToBringIn.includes(outLink)) {
        continue;
      }
      const trgt = outLink.targetVisualElements[0].targetVisualElement;
      const src = outLink.sourceVisualElement;
      const visSourceAtOpd = newOpd.visualElements.find(v => v.logicalElement === src.logicalElement);
      let visTargetAtOpd = newOpd.visualElements.find(v => v.logicalElement === trgt.logicalElement);
      if (!visTargetAtOpd) {
        visTargetAtOpd = this.model.bringVisualToOpd(trgt.logicalElement, newOpd);
        if (OPCloudUtils.isInstanceOfVisualThing(visTargetAtOpd)) {
          visTargetAtOpd.applyDefaultStyleParams(styleParams);
        } else if (OPCloudUtils.isInstanceOfVisualState(visTargetAtOpd)) {
          visTargetAtOpd.fatherObject.applyDefaultStyleParams(styleParams);
        }
      }
      const linkParams = {
        type: outLink.logicalElement.linkType,
        connection: linkConnectionType.enviromental,
        isCondition: outLink.isCondition,
        isEvent: outLink.isEvent
      };
      this.model.links.connect(visSourceAtOpd, visTargetAtOpd, linkParams);
      newlinks.push(this.model.links.move(visual, trgt, outLink));
    }
    // updating the opd tree hierarchy.
    let removed = [];
    visuals.forEach(vis => {
      const refinee = vis.getRefineeInzoom() || vis.getRefineeUnfold();
      if (refinee && refinee.refineable === vis) {
        const refineeOpd = this.model.getOpdByThingId(refinee.id);
        const oldParentOpd = this.model.getOpd(refineeOpd.parendId);
        if (oldParentOpd.children?.includes(refineeOpd)) {
          oldParentOpd.children.splice(oldParentOpd.children.indexOf(refineeOpd), 1);
        }
        refineeOpd.parendId = newOpd.id;
        newOpd.children.push(refineeOpd);
        removed.push(...vis.remove());
        refinee.refineable = vis.logicalElement.visualElements.find(visu => visu !== refinee);
      } else {
        removed.push(...vis.remove());
      }
    });
    this.changeOpdsOrder();
    // removing the old visuals from the opd.
    visuals.forEach(vis => vis.remove());
    const resolve = this.resolveLinksConflicts(visual);
    removed = removed.concat(resolve.removed);
    newlinks.push(...resolve.created);
    newlinks = (0, removeDuplicationsInArray)(newlinks);
    for (const visualLink of newlinks) {
      if (visualLink.type === linkType.Invocation && visualLink.source === visualLink.target) {
        delete visualLink.BreakPoints;
      }
    }
    ret.opd.visualElements[0].beautifyInzoomSubThings();
    for (const remvd of removed) {
      if (newlinks.includes(remvd)) {
        newlinks.splice(newlinks.indexOf(remvd), 1);
      }
    }
    const uiToUpdate = {
      removed,
      newlinks,
      newThingLogical,
      visual
    };
    return {
      success: true,
      newOpd: newOpd,
      newThing: visual.logicalElement.visualElements[0],
      message: undefined,
      uiToUpdate
    };
  }
  changeOpdsOrder() {
    this.model.opds = this.model.opds.sort(function (a, b) {
      if (a.getOpdDepth() > b.getOpdDepth()) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  outfoldNewDiagram(visuals, newThingName = "noName", styleParams) {
    visuals = visuals.filter(vis => !vis.getLinks().outGoing.find(link => fundamental.contains(link.type) && visuals.includes(link.target)));
    if (visuals.length < 2) {
      return {
        success: false,
        message: "Cannot Out-fold. Not enough valid things selected."
      };
    }
    const things = visuals.filter(en => en instanceof OpmVisualThing);
    if (things.length < visuals.length || visuals.find(vis => vis.constructor.name !== visuals[0].constructor.name)) {
      return {
        success: false,
        message: "Cannot Out-fold. All elements should be things from the same type."
      };
    }
    visuals[0].logicalElement.opmModel.setShouldLogForUndoRedo(false, "outfoldNewDiagram");
    // calculating outzoomed thing position
    // const type = (visuals[0] instanceof OpmVisualObject) ? EntityType.Object : EntityType.Process;
    let xPos = 0;
    let yPos = 0;
    visuals.forEach(vis => {
      xPos += vis.xPos;
      yPos += vis.yPos;
    });
    let newEssence = Essence.Informatical;
    if (visuals.find(v => v.logicalElement.essence === Essence.Physical)) {
      newEssence = Essence.Physical;
    }
    const type = visuals[0].constructor.name.includes("Object") ? EntityType.Object : EntityType.Process;
    const strokeParams = type === EntityType.Object ? "#70E483" : "#3BC3FF";
    // creating the new outzoomed thing
    const thingParams = {
      text: newThingName,
      affiliation: Affiliation.Systemic,
      essence: newEssence,
      id: uuid(),
      xPos: xPos / visuals.length,
      yPos: yPos / visuals.length,
      width: OpmVisualThing.OpmThingWidth,
      height: OpmVisualThing.opmThingHeight,
      refX: 0.5,
      refY: 0.5,
      textFontSize: 14,
      xAlign: "middle",
      yAlign: "middle",
      fill: "#ffffff",
      strokeColor: strokeParams,
      strokeWidth: 2,
      textColor: "#000000",
      textFontFamily: "Arial, helvetica, sans-serif",
      textFontWeight: 600,
      textHeight: "80%",
      textWidth: "80%"
    };
    if (newThingName === "noName") {
      delete thingParams.text;
    }
    const newThingLogical = logicalFactoryInsertCurrentOPD(type, this.model, thingParams);
    if (newThingLogical instanceof OpmLogicalProcess) {
      newThingLogical.code = 0;
    }
    const visual = newThingLogical.visualElements[0];
    if (visuals[0].fatherObject) {
      visual.setFatherObject(visuals[0].fatherObject);
    }
    if (!visuals.find(vi => vi.getEssence() === Essence.Physical)) {
      newThingLogical.essence = Essence.Informatical;
    }
    visual.strokeWidth = 4;
    if (styleParams) {
      visual.applyDefaultStyleParams(styleParams);
    }
    const originalOpd = this.model.getOpdByThingId(visuals[0].id);
    const ret = this.tryToUnfold(visual, null);
    this.model.currentOpd = originalOpd;
    const newOpd = ret.opd;
    newOpd.parendId = originalOpd.id;
    const newUnfolded = newOpd.visualElements[0];
    for (let i = newOpd.visualElements.length - 1; i >= 0; i--) {
      if (newOpd.visualElements[i].logicalElement !== newThingLogical) {
        newOpd.visualElements[i].remove();
      }
    }
    visuals.forEach(vis => {
      if (newUnfolded.logicalElement !== vis.logicalElement) {
        const newVisAtOpd = vis.copyToOpd(newOpd);
        const type = vis.getAllLinks().inGoing.find(l => fundamental.contains(l.type))?.type || linkType.Aggregation;
        this.model.links.connect(newUnfolded, newVisAtOpd, {
          type: type,
          connection: linkConnectionType.enviromental
        });
      }
    });
    let newlinks = [];
    const linksToBringIn = [];
    const linksToBringOut = [];
    for (const visAtOldOpd of visuals) {
      linksToBringIn.push(...visAtOldOpd.getLinks().inGoing);
      linksToBringOut.push(...visAtOldOpd.getLinks().outGoing);
      if (visAtOldOpd instanceof OpmVisualObject && visAtOldOpd.states.length > 0) {
        visAtOldOpd.states.forEach(state => {
          linksToBringIn.push(...state.getLinks().inGoing);
          linksToBringOut.push(...state.getLinks().outGoing);
        });
      }
    }
    for (const inLink of linksToBringIn) {
      const src = inLink.sourceVisualElement;
      const trgt = inLink.targetVisualElements[0].targetVisualElement;
      const visTargetAtOpd = newOpd.visualElements.find(v => v.logicalElement === trgt.logicalElement);
      let visSourceAtOpd = newOpd.visualElements.find(v => v.logicalElement === src.logicalElement);
      if (!visSourceAtOpd) {
        visSourceAtOpd = this.model.bringVisualToOpd(src.logicalElement, newOpd);
        if (OPCloudUtils.isInstanceOfVisualThing(visSourceAtOpd)) {
          visSourceAtOpd.applyDefaultStyleParams(styleParams);
        } else if (OPCloudUtils.isInstanceOfVisualState(visSourceAtOpd)) {
          visSourceAtOpd.fatherObject.applyDefaultStyleParams(styleParams);
        }
        if (visSourceAtOpd.constructor.name.includes("Object")) {
          visSourceAtOpd.expressAll();
        }
      }
      const linkParams = {
        type: inLink.logicalElement.linkType,
        connection: linkConnectionType.enviromental,
        isCondition: inLink.isCondition,
        isEvent: inLink.isEvent
      };
      const movedLink = this.model.links.move(src, visual, inLink);
      newlinks.push(movedLink);
      if (visuals.includes(trgt) && fundamental.contains(inLink.logicalElement.linkType) && !visuals.includes(src)) {
        continue;
      }
      const newLink = this.model.links.connect(visSourceAtOpd, visTargetAtOpd, linkParams);
      this.model.addNewRelatedRelation([movedLink.logicalElement, newLink.logicalElement]);
      this.model.mergeIntersactingRelatedRelations();
    }
    for (const outLink of linksToBringOut) {
      const trgt = outLink.targetVisualElements[0].targetVisualElement;
      const src = outLink.sourceVisualElement;
      const visSourceAtOpd = newOpd.visualElements.find(v => v.logicalElement === src.logicalElement);
      let visTargetAtOpd = newOpd.visualElements.find(v => v.logicalElement === trgt.logicalElement);
      if (!visTargetAtOpd) {
        visTargetAtOpd = this.model.bringVisualToOpd(trgt.logicalElement, newOpd);
        if (OPCloudUtils.isInstanceOfVisualThing(visTargetAtOpd)) {
          visTargetAtOpd.applyDefaultStyleParams(styleParams);
        } else if (OPCloudUtils.isInstanceOfVisualState(visTargetAtOpd)) {
          visTargetAtOpd.fatherObject.applyDefaultStyleParams(styleParams);
        }
        if (visTargetAtOpd.constructor.name.includes("Object")) {
          visTargetAtOpd.expressAll();
        }
      }
      const linkParams = {
        type: outLink.logicalElement.linkType,
        connection: linkConnectionType.enviromental,
        isCondition: outLink.isCondition,
        isEvent: outLink.isEvent
      };
      const movedLink = this.model.links.move(visual, trgt, outLink);
      newlinks.push(movedLink);
      const newLink = this.model.links.connect(visSourceAtOpd, visTargetAtOpd, linkParams);
      this.model.addNewRelatedRelation([movedLink.logicalElement, newLink.logicalElement]);
      this.model.mergeIntersactingRelatedRelations();
    }
    let removed = [];
    visuals.forEach(vis => {
      const refinee = vis.getRefineeInzoom() || vis.getRefineeUnfold();
      if (refinee && refinee.refineable === vis) {
        const refineeOpd = this.model.getOpdByThingId(refinee.id);
        const oldParentOpd = this.model.getOpd(refineeOpd.parendId);
        if (oldParentOpd.children?.includes(refineeOpd)) {
          oldParentOpd.children.splice(oldParentOpd.children.indexOf(refineeOpd), 1);
        }
        refineeOpd.parendId = newOpd.id;
        newOpd.children.push(refineeOpd);
        removed.push(...vis.remove());
        refinee.refineable = vis.logicalElement.visualElements.find(visu => visu !== refinee);
      } else {
        removed.push(...vis.remove());
      }
    });
    this.changeOpdsOrder();
    visuals.forEach(vis => vis.remove());
    const resolve = this.resolveLinksConflicts(visual);
    removed = removed.concat(resolve.removed);
    newlinks.push(...resolve.created);
    for (const visualLink of newlinks) {
      if (visualLink.type === linkType.Invocation && visualLink.source === visualLink.target) {
        delete visualLink.BreakPoints;
      }
    }
    ret.opd.visualElements[0].beautifyInzoomSubThings();
    for (const remvd of removed) {
      if (newlinks.includes(remvd)) {
        newlinks.splice(newlinks.indexOf(remvd), 1);
      }
    }
    const entities = newOpd.visualElements.filter(en => en instanceof OpmVisualEntity);
    visual.getRefineeUnfold().bring(this.model, []);
    visual.getRefineeUnfold().getLinksIncludingChildren().outGoing.forEach(lnk => {
      if (this.model.getVisualElementOfLogicalAtOpd(lnk.logicalElement, originalOpd)) {
        lnk.remove();
      }
    });
    visual.getRefineeUnfold().getLinksIncludingChildren().inGoing.forEach(lnk => {
      if (!fundamental.contains(lnk.type) && this.model.getVisualElementOfLogicalAtOpd(lnk.logicalElement, originalOpd)) {
        lnk.remove();
      }
    });
    newOpd.visualElements.filter(en => en instanceof OpmVisualEntity && !entities.includes(en)).forEach(ent => ent.remove());
    const uiToUpdate = {
      removed,
      newlinks,
      newThingLogical,
      visual
    };
    visuals[0].logicalElement.opmModel.setShouldLogForUndoRedo(true, "outfoldNewDiagram");
    return {
      success: true,
      newOpd: newOpd,
      newThing: visual.logicalElement.visualElements[0],
      message: undefined,
      uiToUpdate: uiToUpdate
    };
  }
  resolveLinksConflicts(visual) {
    let sources = [];
    let targets = [];
    const removed = [];
    const created = [];
    const opmModel = visual.logicalElement.opmModel;
    // first stage: removing illegal links.
    [...visual.getLinks().inGoing, ...visual.getLinks().outGoing].forEach(link => {
      const src = link.source.constructor.name[9];
      const trg = link.target.constructor.name[9];
      if (!legalConnections[src + trg].includes(link.type)) {
        removed.push(...link.remove());
      }
    });
    // creating groups of source and targets that may conflict
    visual.getLinks().inGoing.forEach(link => sources.push(link.source));
    visual.getLinks().outGoing.forEach(link => targets.push(link.target));
    sources = (0, removeDuplicationsInArray)(sources);
    targets = (0, removeDuplicationsInArray)(targets);
    for (let i = targets.length - 1; i >= 0; i--) {
      if (sources.includes(targets[i])) {
        targets.splice(i, 1);
      }
    }
    const groupsToResolve = [];
    sources.forEach(src => groupsToResolve.push(visual.getLinksWith(src)));
    targets.forEach(trgt => groupsToResolve.push(visual.getLinksWith(trgt)));
    for (const group of groupsToResolve) {
      // stage 2: removing links from same type between same source and target.
      for (let i = group.inGoing.length - 1; i >= 0; i--) {
        if (group.inGoing.find(other => other !== group.inGoing[i] && other.type === group.inGoing[i].type) !== undefined) {
          removed.push(...group.inGoing[i].remove());
          group.inGoing.splice(i, 1);
        }
      }
      for (let i = group.outGoing.length - 1; i >= 0; i--) {
        if (group.outGoing.find(other => other !== group.outGoing[i] && other.type === group.outGoing[i].type) !== undefined) {
          removed.push(...group.outGoing[i].remove());
          group.outGoing.splice(i, 1);
        }
      }
      // stage 3: deciding which link is "stronger" if 2 links conflicts.
      // 3.1 - if has consumption and result between source and target -> replace them with effect link.
      // if has Agent/Instrument and Result -> replace with Effect
      let inLinksTypes = group.inGoing.map(link => link.type);
      let outLinksTypes = group.outGoing.map(link => link.type);
      const condition1 = (inLinksTypes.includes(linkType.Consumption) || inLinksTypes.includes(linkType.Agent) || inLinksTypes.includes(linkType.Instrument)) && outLinksTypes.includes(linkType.Result);
      const condition2 = inLinksTypes.includes(linkType.Result) && (outLinksTypes.includes(linkType.Consumption) || outLinksTypes.includes(linkType.Agent) || outLinksTypes.includes(linkType.Instrument));
      // if has Agent/Instrument/Consumption and Result
      if (condition1 || condition2) {
        group.inGoing.filter(l => procedural.contains(l.type)).forEach(link => removed.push(...link.remove()));
        group.outGoing.filter(l => procedural.contains(l.type)).forEach(link => removed.push(...link.remove()));
        let newEffectLink;
        const effectParams = {
          type: linkType.Effect,
          connection: linkConnectionType.enviromental,
          isCondition: false,
          isEvent: false
        };
        if (this.model.links.canConnect(removed[removed.length - 1].source, removed[removed.length - 1].target, effectParams.type).success) {
          newEffectLink = opmModel.connect(removed[removed.length - 1].source, removed[removed.length - 1].target, effectParams).created[0];
          created.push(newEffectLink);
        }
        group.inGoing = group.inGoing.filter(l => !removed.includes(l));
        group.outGoing = group.outGoing.filter(l => !removed.includes(l));
        if (newEffectLink) {
          if (newEffectLink.source === visual) {
            group.outGoing.push(newEffectLink);
          } else {
            group.inGoing.push(newEffectLink);
          }
        }
        inLinksTypes = group.inGoing.map(link => link.type);
        outLinksTypes = group.outGoing.map(link => link.type);
      }
      // 3.2 - if has inGoing fundamental link and outgoing fundamental link - prefer the *ingoing*.
      if (outLinksTypes.filter(value => fundamental.contains(value)).length > 0) {
        group.inGoing.filter(l => fundamental.contains(l.type)).forEach(link => removed.push(...link.remove()));
        group.inGoing = group.inGoing.filter(l => !removed.includes(l));
        inLinksTypes = group.inGoing.map(link => link.type);
      }
      // 3.3 - if there is more than one fundamental link - leave only the strongest.
      const strongestFundIn = linksStrength.fundamental.find(type => inLinksTypes.includes(type));
      const strongestFundOut = linksStrength.fundamental.find(type => outLinksTypes.includes(type));
      if (strongestFundIn !== undefined) {
        group.inGoing.filter(l => fundamental.contains(l.type) && l.type !== strongestFundIn).forEach(link => removed.push(...link.remove()));
      }
      if (strongestFundOut !== undefined) {
        group.outGoing.filter(l => fundamental.contains(l.type) && l.type !== strongestFundOut).forEach(link => removed.push(...link.remove()));
      }
      group.inGoing = group.inGoing.filter(l => !removed.includes(l));
      group.outGoing = group.outGoing.filter(l => !removed.includes(l));
      inLinksTypes = group.inGoing.map(link => link.type);
      outLinksTypes = group.outGoing.map(link => link.type);
      // 3.4 - if there is more than one of Agent, Instrument and Effect links - leave only the strongest.
      const strongestProcedural = linksStrength.procedural.find(type => inLinksTypes.includes(type) || outLinksTypes.includes(type));
      if (strongestProcedural !== undefined) {
        [...group.inGoing, ...group.outGoing].filter(l => procedural.contains(l.type) && l.type !== strongestProcedural).forEach(link => removed.push(...link.remove()));
      }
      // 3.5 - if there is more than one of directional links - leave only the strongest (bidirectional).
      const strongestTagged = linksStrength.tagged.find(type => inLinksTypes.includes(type) || outLinksTypes.includes(type));
      if (strongestTagged !== undefined) {
        [...group.inGoing, ...group.outGoing].filter(l => tagged.contains(l.type) && l.type !== strongestTagged).forEach(link => removed.push(...link.remove()));
      }
    }
    return {
      created: created,
      removed: removed
    };
  }
  sortFoldedFundamentalRelations(a, b) {
    const idxA = linksStrength.fundamental.indexOf(a.isFoldedUnderThing().triangleType);
    const idxAb = linksStrength.fundamental.indexOf(b.isFoldedUnderThing().triangleType);
    if (idxA > idxAb) {
      return 1;
    } else if (idxA < idxAb) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    } else if (a.type > b.type) {
      return -1;
    }
    if (a.logicalElement.text > b.logicalElement.text) {
      return 1;
    } else {
      return -1;
    }
  }
  foldInAllFundamentalRelations(thing) {
    const created = [];
    const removed = [];
    const links = thing.getAllLinks().outGoing.filter(rel => !rel.logicalElement.isAtOPD(this.model.currentOpd) && !thing.semiFolded.find(r => r.logicalElement === rel.target.logicalElement));
    const toAdd = links.map(link => {
      return {
        type: link.type,
        target: link.target.logicalElement,
        link: link
      };
    }).filter(rel => [linkType.Exhibition, linkType.Generalization, linkType.Instantiation, linkType.Aggregation].includes(rel.type) && (!rel.link.target.fatherObject || !thing.semiFolded.find(visual => visual.logicalElement === rel.link.target.fatherObject.logicalElement)));
    for (let i = toAdd.length - 1; i >= 0; i--) {
      if (toAdd.find(item => item !== toAdd[i] && item.type === toAdd[i].type && item.target.logicalElement === toAdd[i].target.logicalElement && item.link.logicalElement === toAdd[i].link.logicalElement)) {
        toAdd.splice(i, 1);
      }
    }
    if (thing.getRefineeInzoom()) {
      const innerThings = thing.getRefineeInzoom().children.filter(chld => chld.constructor.name === thing.constructor.name);
      for (const child of innerThings) {
        if (!toAdd.find(item => item.type === linkType.Aggregation && item.target.lid === child.logicalElement.lid) && !thing.semiFolded.find(foldedVis => foldedVis.logicalElement.lid === child.logicalElement.lid) && !thing.getLinks().outGoing.find(lnk => lnk.target.logicalElement.lid === child.logicalElement.lid)) {
          toAdd.push({
            type: linkType.Aggregation,
            target: child.logicalElement,
            link: undefined
          });
        }
      }
    }
    if (toAdd.length === 0) {
      return {
        success: false
      };
    }
    const textBreak = joint.util.breakText;
    const lines = textBreak(thing.logicalElement.text, {
      width: thing.width - 40
    }).split("\n").length;
    const fontSize = thing.textFontSize || 14;
    thing.refY = Math.max(25, lines * fontSize / 2 + 10);
    // thing.width = 180;
    // thing.height = 200;
    for (const rel of toAdd) {
      let thingToFold = rel.target;
      if (thingToFold.constructor.name.includes("State")) {
        thingToFold = thingToFold.parent;
      }
      const semi = this.model.createVisualThing(thingToFold, this.model.currentOpd);
      semi.setFoldedUnderThing(true, rel.type, rel.target, {
        xPos: undefined,
        yPos: undefined
      });
      semi.fatherObject = thing;
      // the position is relative to the thing.
      semi.xPos = 10;
      // semi.yPos = 40 + 50 * toAdd.indexOf(rel);
      thing.addToSemiFoldedArray(semi);
      created.push(semi);
    }
    thing.height = thing.calculateMinHeight();
    thing.width = thing.calculateMinWidth();
    thing.arrangeInnerSemiFoldedThings();
    return {
      success: true,
      created: created,
      removed: removed,
      thing: thing
    };
  }
  foldInFundamentalRelation(visualLink) {
    const term = visualLink.source.getRefineeInzoom() && visualLink.source.getRefineeInzoom().children.find(ch => ch.logicalElement === visualLink.target.logicalElement);
    if (visualLink.logicalElement.visualElements.length < 2 && !term) {
      return {
        success: false
      };
    }
    const sourceThing = visualLink.source;
    let thingToFold = visualLink.target.logicalElement;
    let targetPos = {
      xPos: visualLink.target.xPos,
      yPos: visualLink.target.yPos
    };
    if (visualLink.target.logicalElement.constructor.name.includes("State")) {
      thingToFold = visualLink.target.logicalElement.parent;
      targetPos = {
        xPos: visualLink.target.fatherObject.xPos,
        yPos: visualLink.target.fatherObject.yPos
      };
    }
    const semi = this.model.createVisualThing(thingToFold, this.model.currentOpd);
    const linksToUpdate = [];
    const toRemove = [];
    visualLink.target.getLinks().inGoing.forEach(l => {
      if (visualLink === l) {
        return;
      }
      if (l.source.isFoldedUnderThing().isFolded) {
        toRemove.push(l);
      } else {
        const updated = this.model.links.move(l.source, semi, l);
        const bestPort = "1";
        updated.targetVisualElementPort = bestPort;
        linksToUpdate.push(updated);
      }
    });
    visualLink.target.getLinks().outGoing.forEach(l => {
      if (l.target.isFoldedUnderThing().isFolded) {
        toRemove.push(l);
      } else {
        const updated = this.model.links.move(semi, l.target, l);
        const bestPort = "1";
        updated.sourceVisualElementPort = bestPort;
        linksToUpdate.push(updated);
      }
    });
    semi.setFoldedUnderThing(true, visualLink.type, visualLink.target.logicalElement, targetPos);
    sourceThing.addToSemiFoldedArray(semi);
    semi.fatherObject = sourceThing;
    if (sourceThing.height < sourceThing.calculateMinHeight()) {
      sourceThing.height = sourceThing.calculateMinHeight();
    }
    if (sourceThing.width < sourceThing.calculateMinWidth()) {
      sourceThing.width = sourceThing.calculateMinWidth();
    }
    semi.xPos = 10;
    // it is a fix for stereotypes - add states to folded things for stereotype support (but not showing them)
    if (OPCloudUtils.isInstanceOfVisualObject(semi)) {
      semi.expressAll();
    }
    sourceThing.arrangeInnerSemiFoldedThings();
    const targetToRemove = visualLink.target.constructor.name.includes("State") ? visualLink.target.fatherObject : visualLink.target;
    return {
      success: true,
      created: [semi, ...linksToUpdate],
      removed: [...visualLink.remove(), ...targetToRemove.remove(), ...toRemove],
      thing: sourceThing
    };
  }
  foldOutFundamentalRelation(folded) {
    const createdEntities = [];
    const removed = [];
    let logicalTarget = folded.isFoldedUnderThing().realTarget;
    if (!logicalTarget) {
      logicalTarget = folded.logicalElement;
    }
    const triangleType = folded.isFoldedUnderThing().triangleType;
    let targetAtOpd = folded.logicalElement.visualElements.find(vis => this.model.getOpdByThingId(vis.id) === this.model.currentOpd && vis.isFoldedUnderThing().isFolded === false);
    if (targetAtOpd && targetAtOpd.type.includes("Object")) {
      targetAtOpd.expressAll();
    }
    let hadNoTarget = false;
    if (!targetAtOpd) {
      hadNoTarget = true;
      const isRealTargetState = logicalTarget.constructor.name.includes("State");
      const targetToCreate = isRealTargetState ? logicalTarget.parent : logicalTarget;
      targetAtOpd = this.model.createVisualThing(targetToCreate, this.model.currentOpd);
      const strokeParams = targetToCreate.constructor.name.includes("Object") ? "#70E483" : "#3BC3FF";
      const thingParams = {
        affiliation: targetAtOpd.getAffiliation(),
        essence: targetAtOpd.getEssence(),
        id: uuid(),
        width: OpmVisualThing.OpmThingWidth,
        height: OpmVisualThing.opmThingHeight,
        refX: 0.5,
        refY: 0.5,
        textFontSize: 14,
        xAlign: "middle",
        yAlign: "middle",
        fill: "#ffffff",
        strokeColor: strokeParams,
        strokeWidth: targetAtOpd.isInzoomed() || targetAtOpd.isUnfolded() ? 4 : 2,
        textColor: "#000000",
        textFontFamily: "Arial, helvetica, sans-serif",
        textFontWeight: 600,
        textHeight: "80%",
        textWidth: "80%"
      };
      targetAtOpd.updateParams(thingParams);
      if (folded.isFoldedUnderThing().targetPos && folded.isFoldedUnderThing().targetPos.xPos && folded.isFoldedUnderThing().targetPos.yPos) {
        targetAtOpd.xPos = folded.isFoldedUnderThing().targetPos.xPos;
        targetAtOpd.yPos = folded.isFoldedUnderThing().targetPos.yPos;
      } else {
        targetAtOpd.xPos = folded.fatherObject.xPos + folded.fatherObject.width + Math.random() * 800 - 400;
        targetAtOpd.yPos = folded.fatherObject.yPos + folded.fatherObject.height + 120;
      }
      targetAtOpd.width = 135;
      targetAtOpd.height = 60;
      if (targetAtOpd.type.includes("Object")) {
        targetAtOpd.expressAll();
        targetAtOpd.rearrange();
      }
      if (isRealTargetState) {
        targetAtOpd = targetAtOpd.states.find(stt => stt.logicalElement === logicalTarget);
      }
    }
    let ret;
    if (folded.fatherObject.getLinksWith(targetAtOpd).outGoing.length > 0) {
      ret = {
        created: [folded.fatherObject.getLinksWith(targetAtOpd).outGoing.find(l => l.type === triangleType)],
        removed: []
      };
    } else {
      ret = folded.logicalElement.opmModel.connect(folded.fatherObject, targetAtOpd, {
        type: triangleType,
        connection: linkConnectionType.systemic
      }, false);
    }
    const linksToUpdate = [];
    folded.getLinks().inGoing.forEach(l => {
      const updated = this.model.links.move(l.source, targetAtOpd, l);
      updated.targetVisualElementPort = undefined;
      linksToUpdate.push(updated);
    });
    folded.getLinks().outGoing.forEach(l => {
      const updated = this.model.links.move(targetAtOpd, l.target, l);
      updated.sourceVisualElementPort = undefined;
      linksToUpdate.push(updated);
    });
    if (folded.fatherObject.semiFolded.includes(folded)) {
      folded.fatherObject.semiFolded.splice(folded.fatherObject.semiFolded.indexOf(folded), 1);
    }
    removed.push(...folded.remove());
    if (folded.fatherObject.height < folded.fatherObject.calculateMinHeight()) {
      folded.fatherObject.height = folded.fatherObject.calculateMinHeight();
    }
    if (folded.fatherObject.width < folded.fatherObject.calculateMinWidth()) {
      folded.fatherObject.width = folded.fatherObject.calculateMinWidth();
    }
    folded.fatherObject.arrangeInnerSemiFoldedThings();
    if (folded.fatherObject.children?.length === 0 && folded.fatherObject.semiFolded?.length === 0) {
      folded.fatherObject.refX = 0.5;
      folded.fatherObject.refY = 0.5;
    } else if (folded.fatherObject.semiFolded?.length === 0 && folded.fatherObject.children?.length > 0) {
      folded.fatherObject.refX = 0.5;
      folded.fatherObject.refY = 0.1;
    }
    if (hadNoTarget) {
      const createdThing = targetAtOpd.constructor.name.includes("State") ? targetAtOpd.fatherObject : targetAtOpd;
      createdEntities.push(createdThing);
      this.model.currentOpd.beautify(createdThing);
    }
    const retCreated = ret.created && ret.created.length > 0 ? [ret.created[0]] : [];
    return {
      createdLinks: [...retCreated, ...linksToUpdate],
      createdEntities: createdEntities,
      removed: removed,
      thing: folded.fatherObject
    };
  }
  arrangeInzoomOrUnfold(source, target, cameFrom, inzoomed, type, isUnfolded) {
    const source_is_inzoomed_last_child = inzoomed.getLastChild() && source.id === inzoomed.getLastChild().id;
    const target_is_inzoomed_first_child = inzoomed.getFirstChild() && target.id === inzoomed.getFirstChild().id;
    // find whether source or target were the inzoomed/unfolded element
    if (source.logicalElement && (source.logicalElement.lid === cameFrom.logicalElement.lid || type === linkType.Result && source_is_inzoomed_last_child)) {
      this.calculateRelativeLocation(target, source, cameFrom, type, isUnfolded);
    } else if (target.logicalElement && (target.logicalElement.lid === cameFrom.logicalElement.lid || type === linkType.Consumption && target_is_inzoomed_first_child)) {
      this.calculateRelativeLocation(source, target, cameFrom, type, isUnfolded);
    }
  }
  calculateRelativeLocation(elm, inzoomedOUnfoldedElm, cameFrom, type, isUnfolded) {
    const new_elm_center_x = elm.xPos + elm.width / 2;
    const new_elm_center_y = elm.yPos + elm.height / 2;
    const old_inzoomedOUnfoldedElm_center_x = cameFrom.xPos + cameFrom.width / 2;
    const old_inzoomedOUnfoldedElm_center_y = cameFrom.yPos + cameFrom.height / 2;
    const new_inzoomedOUnfoldedElm_center_x = inzoomedOUnfoldedElm.xPos + inzoomedOUnfoldedElm.width / 2;
    const new_inzoomedOUnfoldedElm_center_y = inzoomedOUnfoldedElm.yPos + inzoomedOUnfoldedElm.height / 2;
    const x_distance = new_elm_center_x - old_inzoomedOUnfoldedElm_center_x;
    const y_distance = new_elm_center_y - old_inzoomedOUnfoldedElm_center_y;
    elm.xPos = new_inzoomedOUnfoldedElm_center_x + x_distance - elm.width / 2;
    elm.yPos = new_inzoomedOUnfoldedElm_center_y + y_distance * (this.shouldReverseLinkDirection(cameFrom, y_distance, type, isUnfolded) ? -1 : 1) - elm.height / 2;
    // if (isUnfolded) {
    //   opd.beautify(elm as OpmVisualThing);
    // }
  }
  /***
   * if the link type is consumption, and a process is being inzoomed, then the link would be from the object to the
   * process first child, so its looks better if the object is above the process.
   * if the link type is result, and a process is being inzoomed, then the link would be from the process last child to
   * the object, so its looks better if the object is below the process.
   * */
  shouldReverseLinkDirection(cameFrom, y_distance, type, isUnfolded) {
    return !isUnfolded && cameFrom instanceof OpmVisualProcess && (y_distance < 0 && type === linkType.Result || y_distance > 0 && type === linkType.Consumption);
  }
  removeRedundentUnified(unifiedToRemove) {
    if (unifiedToRemove) {
      for (const removedLink of unifiedToRemove) {
        const toRemove = removedLink.source.getLinksWith(removedLink.target).outGoing.find(l => l.type === removedLink.type);
        if (toRemove) {
          toRemove.remove();
        }
      }
    }
  }
  getFather(entity) {
    if (OPCloudUtils.isInstanceOfLogicalState(entity)) {
      let inLink = entity.getLinks().inGoing.find(l => l.linkType === linkType.Aggregation);
      if (inLink) {
        return inLink.sourceLogicalElement;
      }
      for (const st of entity.getFather().states) {
        inLink = st.getLinks().inGoing.find(l => l.linkType === linkType.Aggregation);
        if (inLink) {
          return inLink.sourceLogicalElement;
        }
      }
    }
    if (entity.getFather()) {
      return entity.getFather();
    }
    const inLink = entity.getLinks().inGoing.find(l => l.linkType === linkType.Aggregation);
    if (inLink) {
      return inLink.sourceLogicalElement;
    }
  }
  distanceFromFather(father, child) {
    let temp = child;
    let ret = 1;
    if (child === father || OPCloudUtils.isInstanceOfLogicalState(child) && child.getFather() === father) {
      return 0;
    }
    while (temp && this.getFather(temp) !== father) {
      if (OPCloudUtils.isInstanceOfLogicalState(temp) && temp.getFather() === father) {
        ret -= 1;
        break;
      }
      ret += 1;
      temp = this.getFather(temp);
    }
    return ret;
  }
  createStructuralViewOpd(thing, direction) {
    const viewOpd = new OpmOpd("Unfolded View of " + thing.getBareName());
    const treeType = OPCloudUtils.isInstanceOfLogicalProcess(thing) ? "process" : "object";
    let allChildren;
    try {
      allChildren = thing.getChildrenDeepIncludingAggregation(treeType);
    } catch (err) {
      return undefined;
    }
    const currentOpd = this.model.currentOpd;
    this.model.addOpd(viewOpd);
    const parentOpd = this.model.getOpdByThingId((thing.visualElements[0].getRefineeInzoom() || thing.visualElements[0].getRefineeUnfold())?.id) || currentOpd;
    parentOpd.children.push(viewOpd);
    viewOpd.parendId = parentOpd.id;
    viewOpd.isViewOpd = true;
    this.model.sortOpds();
    let maxDepth = Math.max(...allChildren.map(ch => this.distanceFromFather(thing, ch)));
    if (allChildren.length === 0) {
      maxDepth = 0;
    }
    const basePos = {
      x: 50,
      y: 50
    };
    const padding = 35;
    const layers = [];
    for (let i = 0; i <= maxDepth; i++) {
      const relevant = i === 0 ? [thing] : allChildren.filter(child => this.distanceFromFather(thing, child) === i);
      const layer = [];
      for (const child of relevant) {
        const isState = OPCloudUtils.isInstanceOfLogicalState(child);
        let vis;
        const toCreate = isState ? child.getFather() : child;
        let wasAlreadyExist = true;
        vis = viewOpd.visualElements.find(v => v.logicalElement.lid === toCreate.lid);
        if (!vis) {
          wasAlreadyExist = false;
          vis = this.model.createVisualThing(toCreate, viewOpd);
          if (OPCloudUtils.isInstanceOfVisualObject(vis) && vis.logicalElement.states.length > 0) {
            vis.expressAll(true);
            for (const state of vis.states) {
              state.xPos = state.xPos || toCreate.states.indexOf(state.logicalElement);
              state.yPos = state.xPos || toCreate.states.indexOf(state.logicalElement);
            }
          }
        }
        vis.width = vis.logicalElement.visualElements[0].width || 135;
        vis.height = vis.logicalElement.visualElements[0].height || 60;
        vis.yPos = vis.yPos || 0 + basePos.y;
        vis.xPos = vis.xPos || 0 + basePos.x;
        if (!wasAlreadyExist) {
          if (direction === "vertical") {
            basePos.x = basePos.x + vis.width + padding;
          } else {
            basePos.y = basePos.y + vis.height + padding;
          }
        }
        layer.push(vis);
        if (i === 0) {
          continue;
        }
        let target = vis;
        if (isState) {
          vis.expressAll(true);
          target = vis.states.find(st => st.logicalElement.lid === child.lid);
        }
        let toConnect;
        if (isState) {
          toConnect = layers[i - 1].find(visual => this.getAggregationalFatherOfState(child)?.lid === visual.logicalElement.lid);
        } else {
          toConnect = viewOpd.visualElements.find(visual => this.getFather(child)?.lid === visual.logicalElement.lid);
        }
        // toConnect = layers[i-1].find(visual => this.getFather(<OpmLogicalThing<OpmVisualThing>>child)?.lid === visual.logicalElement.lid);
        if (toConnect) {
          this.model.links.connect(toConnect, target, {
            type: linkType.Aggregation,
            connection: linkConnectionType.systemic
          });
        }
      }
      layers.push(layer);
      if (direction === "vertical") {
        basePos.y = basePos.y + Math.max(...layer.map(v => v.height)) + 250;
        basePos.x = 0;
      } else {
        basePos.y += 100;
        basePos.x = basePos.x + Math.max(...layer.map(v => v.width)) + 200;
      }
    }
    return viewOpd;
  }
  getAggregationalFatherOfState(state) {
    return state.getLinks().inGoing.find(l => l.linkType === linkType.Aggregation)?.sourceLogicalElement;
  }
}
