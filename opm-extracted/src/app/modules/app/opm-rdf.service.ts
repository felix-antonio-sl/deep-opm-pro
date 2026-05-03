// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/app/opm-rdf.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let OpmRdfService = /*#__PURE__*/(() => {
  class OpmRdfService {
    constructor(initRappidService) {
      this.initRappidService = initRappidService;
      this.prefixes = {
        opm: "https://opcloud.tech/ontology/opm#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        owl: "http://www.w3.org/2002/07/owl#",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        dcterms: "http://purl.org/dc/terms/"
      };
      this.proceduralLinkClass = {
        [linkType.Agent]: "opm:AgentLink",
        [linkType.Instrument]: "opm:InstrumentLink",
        [linkType.Consumption]: "opm:ConsumptionLink",
        [linkType.Result]: "opm:ResultLink",
        [linkType.Effect]: "opm:EffectLink",
        [linkType.Invocation]: "opm:InvocationLink",
        [linkType.UndertimeException]: "opm:ExceptionLink",
        [linkType.OvertimeException]: "opm:ExceptionLink",
        [linkType.UndertimeOvertimeException]: "opm:ExceptionLink",
        [linkType.Unidirectional]: "opm:ProceduralLink",
        [linkType.Bidirectional]: "opm:ProceduralLink"
      };
      this.structuralLinkClass = {
        [linkType.Aggregation]: "opm:AggregationLink",
        [linkType.Exhibition]: "opm:ExhibitionLink",
        [linkType.Generalization]: "opm:GeneralizationLink",
        [linkType.Instantiation]: "opm:InstantiationLink"
      };
    }
    buildGraph(options) {
      const model = options?.model ?? this.initRappidService?.getOpmModel();
      if (!model) {
        throw new Error("OPM model is not available for RDF export.");
      }
      const metadata = this.resolveMetadata(model, options);
      const triples = [];
      const tripleSet = new Set();
      const add = (subject, predicate, object) => {
        const key = `${subject}|${predicate}|${object}`;
        if (tripleSet.has(key)) {
          return;
        }
        tripleSet.add(key);
        triples.push({
          subject,
          predicate,
          object
        });
      };
      const ctx = {
        model,
        baseUri: metadata.baseUri,
        modelSubject: this.iri(metadata.modelUri),
        includeHiddenOpds: options?.includeHiddenOpds ?? false,
        includeStates: options?.includeStates ?? true,
        includeLinks: options?.includeLinks ?? true,
        processedStates: new Set()
      };
      this.addModelTriples(metadata, add);
      this.addThings(ctx, add);
      if (ctx.includeLinks) {
        this.addRelations(ctx, add);
      }
      this.addOpds(ctx, add);
      triples.sort((a, b) => {
        if (a.subject === b.subject) {
          if (a.predicate === b.predicate) {
            return a.object.localeCompare(b.object);
          }
          return a.predicate.localeCompare(b.predicate);
        }
        return a.subject.localeCompare(b.subject);
      });
      return {
        baseUri: metadata.baseUri,
        modelUri: metadata.modelUri,
        modelId: metadata.modelId,
        modelName: metadata.modelName,
        description: metadata.description,
        generatedAt: metadata.generatedAt,
        prefixes: {
          ...this.prefixes
        },
        triples
      };
    }
    serialize(graph) {
      const lines = [];
      lines.push(`@base <${graph.baseUri}> .`);
      Object.keys(graph.prefixes).sort().forEach(prefix => {
        lines.push(`@prefix ${prefix}: <${graph.prefixes[prefix]}> .`);
      });
      lines.push("");
      const grouped = new Map();
      for (const triple of graph.triples) {
        if (!grouped.has(triple.subject)) {
          grouped.set(triple.subject, []);
        }
        grouped.get(triple.subject)?.push(triple);
      }
      Array.from(grouped.keys()).sort().forEach(subject => {
        const statements = grouped.get(subject) ?? [];
        lines.push(subject);
        statements.forEach((statement, index) => {
          const isLast = index === statements.length - 1;
          const suffix = isLast ? " ." : " ;";
          lines.push(`  ${statement.predicate} ${statement.object}${suffix}`);
        });
        lines.push("");
      });
      return lines.join("\n").trim() + "\n";
    }
    createRdfBlob(options) {
      const ttl = this.serialize(this.buildGraph(options));
      return new Blob([ttl], {
        type: "text/turtle;charset=utf-8"
      });
    }
    addModelTriples(metadata, add) {
      const subject = this.iri(metadata.modelUri);
      add(subject, "rdf:type", "opm:Model");
      add(subject, "opm:id", this.literal(metadata.modelId));
      add(subject, "opm:name", this.literal(metadata.modelName));
      add(subject, "dcterms:created", this.literal(metadata.generatedAt, "xsd:dateTime"));
      if (metadata.description) {
        add(subject, "rdfs:comment", this.literal(metadata.description));
      }
    }
    addThings(ctx, add) {
      for (const logical of ctx.model.logicalElements ?? []) {
        if (logical instanceof OpmLogicalObject) {
          this.mapThing(logical, ctx, add, "object");
          this.mapObjectStates(logical, ctx, add);
        } else if (logical instanceof OpmLogicalProcess) {
          this.mapThing(logical, ctx, add, "process");
        } else if (ctx.includeStates && logical instanceof OpmLogicalState) {
          this.mapState(logical, ctx, add);
        }
      }
    }
    mapThing(thing, ctx, add, segment) {
      if (!thing?.lid) {
        return;
      }
      const subject = this.entitySubject(thing, ctx.baseUri, segment);
      add(subject, "rdf:type", "opm:Thing");
      if (thing instanceof OpmLogicalProcess) {
        add(subject, "rdf:type", "opm:Process");
      } else if (thing instanceof OpmLogicalObject) {
        add(subject, "rdf:type", "opm:Object");
      }
      add(subject, "opm:id", this.literal(thing.lid));
      add(subject, "opm:name", this.literal(thing.getBareName?.() ?? thing.text ?? thing.lid));
      if (thing.getDescription?.()) {
        add(subject, "rdfs:comment", this.literal(thing.getDescription()));
      }
      add(subject, "opm:inModel", ctx.modelSubject);
      this.addOpdMemberships(thing, ctx, subject, add);
      if (thing instanceof OpmLogicalThing) {
        if (thing.essence !== undefined) {
          add(subject, "opm:isPhysical", this.literal(String(thing.essence === Essence.Physical), "xsd:boolean"));
        }
        if (thing.affiliation !== undefined) {
          add(subject, "opm:isEnvironmental", this.literal(String(thing.affiliation === Affiliation.Environmental), "xsd:boolean"));
        }
      }
    }
    mapObjectStates(object, ctx, add) {
      if (!ctx.includeStates) {
        return;
      }
      const parentSubject = this.entitySubject(object, ctx.baseUri, "object");
      for (const state of object.states ?? []) {
        const stateSubject = this.mapState(state, ctx, add, object);
        if (stateSubject) {
          add(parentSubject, "opm:hasState", stateSubject);
        }
      }
    }
    mapState(state, ctx, add, parentOverride) {
      if (!state?.lid || ctx.processedStates.has(state.lid)) {
        return undefined;
      }
      ctx.processedStates.add(state.lid);
      const subject = this.entitySubject(state, ctx.baseUri, "state");
      const parent = parentOverride ?? state.parent;
      add(subject, "rdf:type", "opm:State");
      add(subject, "opm:id", this.literal(state.lid));
      add(subject, "opm:name", this.literal(state.getBareName?.() ?? state.text ?? state.lid));
      add(subject, "opm:inModel", ctx.modelSubject);
      if (parent?.lid) {
        const parentSubject = this.entitySubject(parent, ctx.baseUri, "object");
        add(subject, "opm:ofObject", parentSubject);
      }
      const type = (state.stateType || "").toLowerCase();
      if (type) {
        add(subject, "opm:isInitialState", this.literal(String(type.includes("initial")), "xsd:boolean"));
        add(subject, "opm:isFinalState", this.literal(String(type.includes("final")), "xsd:boolean"));
      }
      this.addOpdMemberships(state, ctx, subject, add);
      return subject;
    }
    addRelations(ctx, add) {
      for (const logical of ctx.model.logicalElements ?? []) {
        if (logical instanceof OpmRelation) {
          this.mapRelation(logical, ctx, add);
        }
      }
    }
    mapRelation(relation, ctx, add) {
      if (!relation?.lid) {
        return;
      }
      const subject = this.entitySubject(relation, ctx.baseUri, "link");
      const isProcedural = relation instanceof OpmProceduralRelation;
      const specificClass = isProcedural ? this.proceduralLinkClass[relation.linkType] ?? "opm:ProceduralLink" : this.structuralLinkClass[relation.linkType] ?? "opm:StructuralLink";
      add(subject, "rdf:type", specificClass);
      add(subject, "rdf:type", isProcedural ? "opm:ProceduralLink" : "opm:StructuralLink");
      add(subject, "opm:id", this.literal(relation.lid));
      add(subject, "opm:name", this.literal(linkType[relation.linkType] ?? relation.constructor.name));
      add(subject, "opm:inModel", ctx.modelSubject);
      const source = this.resolveLogicalElement(relation.sourceLogicalElement, ctx.model);
      if (source?.lid) {
        const sourceSubject = this.subjectForAny(source, ctx);
        if (sourceSubject) {
          add(subject, "opm:source", sourceSubject);
        }
      }
      const targets = relation.targetLogicalElements ?? [];
      targets.map(target => this.resolveLogicalElement(target, ctx.model)).filter(target => !!target && !!target.lid).forEach(target => {
        const targetSubject = this.subjectForAny(target, ctx);
        if (targetSubject) {
          add(subject, "opm:destination", targetSubject);
        }
      });
      if (relation.sourceCardinality) {
        add(subject, "opm:sourceCardinality", this.literal(relation.sourceCardinality));
      }
      if (relation.targetCardinality) {
        add(subject, "opm:destinationCardinality", this.literal(relation.targetCardinality));
      }
      this.addOpdMemberships(relation, ctx, subject, add);
    }
    addOpds(ctx, add) {
      for (const opd of ctx.model.opds ?? []) {
        if (!opd || !ctx.includeHiddenOpds && opd.isHidden) {
          continue;
        }
        const subject = this.iri(this.joinUri(ctx.baseUri, `opd/${opd.id}`));
        add(subject, "rdf:type", "opm:OPD");
        add(subject, "opm:id", this.literal(opd.id));
        add(subject, "opm:name", this.literal(opd.getDisplayFullName?.() ?? opd.getName?.() ?? opd.id));
        add(subject, "opm:inModel", ctx.modelSubject);
        const inzoomed = opd.getInzoomedThing?.();
        if (inzoomed?.logicalElement instanceof OpmLogicalThing) {
          const container = this.subjectForAny(inzoomed.logicalElement, ctx);
          if (container) {
            add(subject, "opm:inZoomOf", container);
            this.addContainedThings(inzoomed.logicalElement, opd, ctx, add);
          }
        }
        const unfolded = opd.getUnfoldedThing?.();
        if (unfolded?.logicalElement?.lid) {
          const unfoldedSubject = this.subjectForAny(unfolded.logicalElement, ctx);
          if (unfoldedSubject) {
            add(subject, "opm:unfoldsObject", unfoldedSubject);
          }
        }
      }
    }
    addContainedThings(owner, opd, ctx, add) {
      const ownerSubject = this.subjectForAny(owner, ctx);
      if (!ownerSubject) {
        return;
      }
      const contained = new Set();
      for (const visual of opd.visualElements ?? []) {
        if (visual instanceof OpmVisualThing && visual.logicalElement instanceof OpmLogicalThing) {
          contained.add(visual.logicalElement);
        }
      }
      contained.forEach(child => {
        if (child.lid && child !== owner) {
          const childSubject = this.subjectForAny(child, ctx);
          if (childSubject) {
            add(ownerSubject, "opm:contains", childSubject);
          }
        }
      });
    }
    addOpdMemberships(logical, ctx, subject, add) {
      const opds = this.getOpdsForElement(logical, ctx);
      opds.forEach(opd => {
        add(subject, "opm:inOPD", this.iri(this.joinUri(ctx.baseUri, `opd/${opd.id}`)));
      });
    }
    getOpdsForElement(logical, ctx) {
      const opds = new Set();
      for (const visual of logical?.visualElements ?? []) {
        const opd = ctx.model.getOpdByThingId(visual.id);
        if (opd && (ctx.includeHiddenOpds || !opd.isHidden)) {
          opds.add(opd);
        }
      }
      return opds;
    }
    resolveMetadata(model, options) {
      const modelId = options?.modelId ?? this.slugify(model?.name ?? "opm-model");
      const modelName = options?.modelName ?? (model?.name || "OPM Model");
      const description = options?.description ?? model?.description;
      const generatedAt = new Date().toISOString();
      const baseCandidate = options?.baseUri ?? `https://opcloud.tech/models/${encodeURIComponent(modelId)}/`;
      const baseUri = this.ensureTrailingDelimiter(baseCandidate);
      const modelUri = this.joinUri(baseUri, "model");
      return {
        modelUri,
        baseUri,
        modelId,
        modelName,
        description,
        generatedAt
      };
    }
    entitySubject(logical, baseUri, segment) {
      return this.iri(this.joinUri(baseUri, `${segment}/${logical.lid}`));
    }
    subjectForAny(logical, ctx) {
      if (!logical?.lid) {
        return undefined;
      }
      if (logical instanceof OpmLogicalProcess) {
        return this.entitySubject(logical, ctx.baseUri, "process");
      }
      if (logical instanceof OpmLogicalObject) {
        return this.entitySubject(logical, ctx.baseUri, "object");
      }
      if (logical instanceof OpmLogicalState) {
        return this.entitySubject(logical, ctx.baseUri, "state");
      }
      if (logical instanceof OpmRelation) {
        return this.entitySubject(logical, ctx.baseUri, "link");
      }
      if (logical instanceof OpmLogicalThing) {
        return this.entitySubject(logical, ctx.baseUri, "thing");
      }
      return this.entitySubject(logical, ctx.baseUri, "entity");
    }
    resolveLogicalElement(value, model) {
      if (!value) {
        return undefined;
      }
      if (typeof value === "string") {
        return model.logicalElements?.find(logical => logical.lid === value) ?? model.getLogicalElementByVisualId(value);
      }
      return value;
    }
    literal(value, datatype) {
      const escaped = (value ?? "").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n");
      const literal = `"${escaped}"`;
      if (!datatype) {
        return literal;
      }
      if (datatype.includes(":")) {
        return `${literal}^^${datatype}`;
      }
      return `${literal}^^<${datatype}>`;
    }
    iri(uri) {
      return `<${uri}>`;
    }
    joinUri(base, path) {
      if (base.endsWith("/") || base.endsWith("#")) {
        return `${base}${path}`;
      }
      return `${base}/${path}`;
    }
    ensureTrailingDelimiter(value) {
      if (value.endsWith("/") || value.endsWith("#")) {
        return value;
      }
      return `${value}/`;
    }
    slugify(text) {
      return (text || "opm-model").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "opm-model";
    }
    static #_ = (() => this.ɵfac = function OpmRdfService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OpmRdfService)(core /* ɵɵinject */.KVO(InitRappidService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: OpmRdfService,
      factory: OpmRdfService.ɵfac,
      providedIn: "root"
    }))();
  }
  return OpmRdfService;
})();