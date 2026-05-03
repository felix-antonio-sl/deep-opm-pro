// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/modules/attribute-validation/validation-module.ts
// Extracted by opm-extracted/tools/extract.mjs

  class ValidationModule {
    constructor() {
      this.attribute = new AttributeValue();
    }
    isActive() {
      return this.attribute.isActive();
    }
    setValueTypeElement(object) {
      this.valueTypeElement = object;
    }
    getValueTypeElement() {
      return this.valueTypeElement;
    }
    getType() {
      return this.attribute.getType();
    }
    getRange() {
      return this.attribute.getRange();
    }
    getDefault() {
      const val = this.attribute.getDefault();
      if (val) {
        return val;
      }
      return "value";
    }
    getValidator() {
      return this.attribute.getValidator();
    }
    setRange(type, range, stereotypeValidator) {
      const wasSet = this.attribute.setRange(type, range, stereotypeValidator);
      if (wasSet == false) {
        return {
          wasSet,
          errors: ["The range entered wasn't valid"]
        };
      }
      return {
        wasSet
      };
    }
    validateValue(value) {
      return this.attribute.validate(value);
    }
    removeRange() {
      this.valueTypeElement = undefined;
      this.attribute.remove();
    }
    toJson() {
      if (this.isActive()) {
        return {
          valueTypeElementId: this.valueTypeElement.lid,
          attribute: {
            range: this.attribute.getRange(),
            type: this.attribute.getType()
          }
        };
      }
      return {};
    }
  }
  function getValidationColor(logicalObject) {
    const status = logicalObject.states[0].visualElements[0].getValidationStatus();
    if (status.status === "value-set-invalid") {
      return "ff7474";
    }
    if (status.status === "value-set-valid") {
      return "00ff85";
    }
    if (status.status === "value-not-set") {
      return "73c7ff";
    }
    return "FFFFFF";
  }

  /***/
}),
/***/10223: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Eq: () => (/* binding */sanitizeSimulationUserEnteredValue),
    Ve: () => (/* binding */getEnterValueDialogDimensions),
    Zm: () => (/* binding */sanitizeUserInputPrompt),
    _k: () => (/* binding */formatPythonUserInputAssignment),
    j_: () => (/* binding */getEffectiveUserInputPrompt),
    kI: () => (/* binding */DEFAULT_USER_INPUT_PROMPT)

  });
  /** Default simulation prompt when the modeler has not set a custom message. */
  const DEFAULT_USER_INPUT_PROMPT = "Please Enter a Value:";
  const MAX_PROMPT_LENGTH = 500;
  const MAX_SIMULATION_VALUE_LENGTH = 4096;
  /**
   * Sanitize prompt text stored on the logical process (modeling-time + persisted model).
   * Strips HTML/script vectors, control characters, and enforces length.
   */
  function sanitizeUserInputPrompt(raw) {
    if (raw == null) {
      return DEFAULT_USER_INPUT_PROMPT;
    }
    let s = String(raw).replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, " ").replace(/<[^>]*>/g, "").trim();
    if (!s) {
      return DEFAULT_USER_INPUT_PROMPT;
    }
    if (s.length > MAX_PROMPT_LENGTH) {
      s = s.slice(0, MAX_PROMPT_LENGTH);
    }
    return s;
  }
  /**
   * Effective prompt shown in the simulation enter-value dialog.
   */
  function getEffectiveUserInputPrompt(stored) {
    if (stored == null || stored === "") {
      return DEFAULT_USER_INPUT_PROMPT;
    }
    return sanitizeUserInputPrompt(stored);
  }
  /**
   * Sanitize the value entered by the user during simulation before it is used downstream.
   */
  function sanitizeSimulationUserEnteredValue(raw) {
    if (raw == null) {
      return "";
    }
    let s = String(raw).replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, "").replace(/<[^>]*>/g, "").trim();
    if (s.length > MAX_SIMULATION_VALUE_LENGTH) {
      s = s.slice(0, MAX_SIMULATION_VALUE_LENGTH);
    }
    return s;
  }
  /** Width/height for MatDialog opening the simulation enter-value prompt (minimal for default text). */
  function getEnterValueDialogDimensions(promptMessage) {
    const MIN_W = 275;
    const MIN_H = 186;
    const MAX_W = 560;
    const MAX_H = 420;
    const horizontalPadding = 52;
    const approxCharPx = 6.8;
    const width = Math.min(MAX_W, Math.max(MIN_W, Math.round(promptMessage.length * approxCharPx + horizontalPadding)));
    const inner = Math.max(200, width - 48);
    const charsPerLine = Math.max(24, Math.floor(inner / 7));
    const textLines = Math.max(1, Math.ceil(promptMessage.length / charsPerLine));
    const cappedLines = Math.min(textLines, 7);
    const height = Math.min(MAX_H, Math.max(MIN_H, 128 + (cappedLines - 1) * 22));
    return {
      width,
      height
    };
  }
  const PYTHON_NUMERIC = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  /**
   * First line injected into Python (Brython / server) so `userInput` is safe for any string/number/empty.
   */
  function formatPythonUserInputAssignment(userInputValue) {
    if (userInputValue === undefined || userInputValue === null) {
      return "userInput = None";
    }
    const s = String(userInputValue).trim();
    if (s === "") {
      return "userInput = None";
    }
    if (PYTHON_NUMERIC.test(s)) {
      const n = Number(s);
      if (!Number.isNaN(n)) {
        return "userInput = " + n;
      }
    }
    return "userInput = " + JSON.stringify(s);
  }

  /***/
}),
/***/89427: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    u: () => (/* binding */OntologyEnforcementLevel)

  });
  var OntologyEnforcementLevel = /*#__PURE__*/function (OntologyEnforcementLevel) {
    OntologyEnforcementLevel[OntologyEnforcementLevel.NONE = 1] = "NONE";
    OntologyEnforcementLevel[OntologyEnforcementLevel.SUGGEST = 2] = "SUGGEST";
    OntologyEnforcementLevel[OntologyEnforcementLevel.FORCE = 3] = "FORCE";
    return OntologyEnforcementLevel;
  }(OntologyEnforcementLevel || {});

  /***/
}),
/***/68784: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    AT: () => (/* binding */Languages),
    A_: () => (/* binding */DisplayOpt),
    D8: () => (/* binding */updateTemplates),
    Hm: () => (/* binding */structuralLinkTypes),
    L6: () => (/* binding */defaultSettings),
    Nj: () => (/* binding */OplTables),
    XD: () => (/* binding */oplTemplates),
    Xe: () => (/* binding */linkTable),
    as: () => (/* binding */AliasOpt),
    iT: () => (/* binding */oplDefaultSettings),
    n$: () => (/* binding */UnitsOpt)

  });

  const Languages = ["en", "fr", "gr", "cn", "ko", "es", "ml", "jp"];
  const notes = /* unused pure expression or super */null && [true, false];
  const Affiliations = [models_ConfigurationOptions /* .Affiliation */.n9.Systemic, models_ConfigurationOptions /* .Affiliation */.n9.Environmental];
  const Essences = [models_ConfigurationOptions /* .Essence */.tg.Physical, models_ConfigurationOptions /* .Essence */.tg.Informatical];
  const DisplayOpt = ["Show essence OPL for all Things", "Show essence OPL only for non-default Things", "Don't show essence OPL for All Things"];
  const UnitsOpt = ["Show only when applicable", "Always show units", "Hide units"];
  const AliasOpt = ["Show only when applicable", "Always show alias", "Hide alias"];
  const oplTemplates_gr = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> besteht aus <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> besteht aus <T2> und <num> weiteren Teilen.`,
      "Aggregation-Participation_(multiple)": `<T1> besteht aus <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> besteht aus <T2...n> und <num> weiteren Teilen.`,
      "Generalization-Specialization": `<T2> ist <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> und <num> weitere Spezialisierungen sind <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> sind <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> und <num> weitere Spezialisierungen sind <T1>.`,
      "Classification-Instantiation": `<T2> ist eine Instanz von <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> und <num> weitere Instanzen sind Instanzen von <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> ist eine Instanz von <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> und <num> weitere Instanzen sind Instanzen von <T1>.`,
      "Exhibition-Characterization": `<T1> weist <T2> auf.`,
      "Exhibition-Characterization_incomplete": `<T1> weist <T2> und <num> weitere Attribute auf.`,
      "Exhibition-Characterization_(multiple)": `<T1> weist <T2...n> auf.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> weist <T2...n> und <num> weitere Attribute auf.`,
      Unidirectional_Tagged_Link: `<T1> bezieht sich auf <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> und <num> mehr.`,
      sequence: `in dieser sequenz.`,
      Bidirectional_Tagged_Link: `<T1> und <T2> sind aequivalent.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> und <T2> sind <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, und <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> steuert <P>.`,
      "Agent_(multiple)": `<O\Os1...n> steuern <P>.`,
      Agent_Condition: `<P> findet statt, wenn <O> existert, anderenfalls wird <P> uebersprungen.`,
      Agent_Condition_state: `<P> findet statt, wenn <O> ist <s>, anderenfalls wird <P> uebersprungen.`,
      Agent_Event: `<O> initiiert und steuert <P>.`,
      Agent_Event_state: `<s> <O> initiiert und steuert <P>.`,
      Instrument: `<P> benoetigt <O_Os>.`,
      "Instrument_(multiple)": `<P> benoetigt <O\Os1...n>.`,
      Instrument_Condition: `<P> findet statt, wenn <O> existiert, anderenfalls wird <P> uebersprugen.`,
      Instrument_Condition_state: `<P> findet statt, wenn sich <O> im Zustand <s> befindet, anderenfalls wird <P> uebersprungen.`,
      Instrument_Event: `<O> initiiert <P>, welche erfordert <O> .`,
      Instrument_Event_state: `<s> <O> initiiert <P>, welche erfordert <s> <O>.`,
      Effect: `<P> beeinflusst <O_Os>.`,
      "Effect_(multiple)": `<P> beeinflusst <O\Os1...n>.`,
      Effect_Condition: `<P> findet statt, wenn <O> existiert, in welchem Fall <P>  beinflusst <O>, anderenfalls wird <P>  uebersprungen.`,
      Effect_Condition_state: `<P> findet statt, wenn sich <O> im Zustand <s> befindet, in welchem Fall <P> beinflusst <s> <O>, anderenfalls wird <P> uebersprungen.`,
      Effect_Event: `<O> initiiert <P>, welche <O> beeinflusst.`,
      Effect_Event_state: `<s> <O> initiiert <P>, welche beeinflusst <s> <O>`,
      Consumption: `<P> verbraucht <O_Os>.`,
      "Consumption_(multiple)": `<P> verbraucht <O\Os1...n>.`,
      Consumption_Condition: `<P> findet statt, wenn <O> existiert, in welchem Fall <P> verbraucht <O>, anderenfalls wird <P> uebersprungen.`,
      Consumption_Condition_state: `<P> findet statt, wenn sich <O> im Zustand <s> befindet, in welchem Fall <P> verbraucht <s> <O>, anderenfalls wird <P> uebersprungen.`,
      Consumption_Event: `<O> initiiert <P>, welche <O> verbraucht.`,
      Consumption_Event_state: `<s> <O> initiiert <P>, welche <O> verbraucht.`,
      Result: `<P> ergibt <O_Os>.`,
      "Result_(multiple)": `<P> ergibt <O\Os1...n>.`,
      "In-out_Link_Pair": `<P> aendert <O> von <s1> zu <s2>.`,
      Split: `jeder andere Staat`,
      Condition_Input: `<P> findet statt, wenn <O> <s1> is, in welchem Fall <P> aendert <O> von <s1> zu <s2>, anderenfalls wird <P> uebersprungen.`,
      "In-out_Link_Pair_Condition": `<P> tritt auf, wenn <O> <s1> ist. In diesem Fall ändert <P> <O> von <s1> in <s2>, andernfalls wird <P> übersprungen.`,
      "In-out_Link_Pair_Event": `<O> im Zustand <s1> initiiert <P>, wodurch <O> von <s1> in <s2> geändert wird.`,
      Overtime_exception: `<O> löst aus <P> wenn <O> ist <s> mehr als <maxtime> <units>.`,
      Undertime_exception: `<O> löst aus <P> wenn <O> ist <s> mehr als <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> löst aus <P> wenn <O> ist <s> mehr als <maxtime> <units> und weniger als <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> findet statt, wenn <P1> dauert laenger als <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> findet statt, wenn <P1> unterschreitet <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> findet statt, wenn <P1> unterschreitet <mintime> <units> oder dauert laenger als <maxtime> <units>.`,
      Invocation: `<P1> ruft auf <P2>.`,
      "Invocation_(multiple)": `<P1> ruft auf <P2...n>.`,
      "Invocation_(self)": `<P1> ruft sich auf.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> und <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, sowie, <P1...n>`,
      AND: `<T1...n-1> und <Tn>`,
      OR: `<T1...n-1> oder <Tn>`,
      XOR: `<T1> xor <T2>`,
      "Stateful-Object": `<s> <O>`,
      "Stateful-Object-value": `<O> mit dem Wert <s>`,
      "Stateful-Object-value(multiple)": `<O> mit den Werten <s1...n>`,
      "Attribute-Exhibitor": `<a> von <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      probability: `<opl>, mit Wahrscheinlichkeit <tag>.`,
      path: `Folgend Pfad <tag>, <opl>.`
    },
    object: {
      /*
       * <a> - Affiliation
       * <e> - Essence
       * <SD_..> - System diagram
       */
      thing_generic_name: `objekt`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> ist der digitale Zwilling von <O>.`,
      default_essence: `<O> ist <a>.`,
      default_affiliation: `<O> ist <e>.`,
      non_default: `<O> ist <e> und <a>.`,
      singleInzoom: `<O> von <SD_Parent> zoomt in <Current_SD> in <T_list>.`,
      singleInzoomInDiagram: `<O> zoomt in <O_list>, wie in <Current_SD> dargestellt.`,
      multiInzoomInDiagram: `<O> zoomt in <O_list>, wie in <Current_SD> dargestellt, sowie in <P_list>.`,
      multiInzoom: `<O> von <SD_Parent> zoomt in <Current_SD> in <O_list>, sowie <P_list>.`,
      multiInzoomOneProcess: `<P> von <SD_Parent> zoomt in <Current_SD> in <P_list>, sowie in <O_list>.`,
      single_unfold_aggregation: `<O> von <SD_Parent> entfaltet sich teilweise in <Current_SD> in <T_list>.`,
      single_unfold_generalization: `<O> von <SD_Parent> Spezialisierung - entfaltet sich in <Current_SD> in <T_list>.`,
      single_unfold_exhibition: `<O> von <SD_Parent> Feature - entfaltet sich in <Current_SD> in <T_list>.`,
      multi_unfold_exhibition: `<O> von <SD_Parent> Feature - entfaltet sich in <Current_SD> in <O_list>, sowie <P_list>.`,
      single_unfold_instantiation: `<O> von <SD_Parent> Instanz - entfaltet sich in <Current_SD> in <T_list>.`,
      unspecified_unfold: `<T> von <SD_Parent> entfaltet sich in <Current_SD>.`,
      object_list_sequence: `<O1...n>, in dieser vertikalen Reihenfolge`,
      object_list_parallel: `<O1...n>, in dieser horizontalen Reihenfolge`
    },
    process: {
      thing_generic_name: `prozess`,
      default_essence_affiliation: ``,
      default_essence: `<P> ist <a>.`,
      default_affiliation: `<P> ist <e>.`,
      non_default: `<P> ist <e> und <a>.`,
      singleInzoom: `<P> von <SD_Parent> zoomt in <Current_SD> in <T_list>, die in dieser zeitfolge auftreten.`,
      singleInzoom_parallel: `<P> von <SD_Parent> zoomt in <Current_SD> in <T_list>.`,
      multiInzoom: `<P> von <SD_Parent> zoomt in <Current_SD> in <P_list>, sowie <O_list>.`,
      multiInzoomOneProcess: `<P> von <SD_Parent> zoomt in <Current_SD> in <P_list>, sowie <O_list>.`,
      single_unfold_aggregation: `<P> von <SD_Parent> entfaltet sich teilweise in <Current_SD> in <T_list>.`,
      single_unfold_generalization: `<P> von <SD_Parent> entfaltet sich spezialisierungsmäßig in <Current_SD> in <T_list>.`,
      single_unfold_exhibition: `<P> von <SD_Parent> entfaltet sich in <Current_SD> in <T_list>.`,
      multi_unfold_exhibition: `<P> von <SD_Parent> entfaltet sich in <Current_SD> in <P_list> sowie in <O_list>.`,
      single_unfold_instantiation: `<P> von <SD_Parent> entfaltet sich in <Current_SD> in <T_list>.`,
      unspecified_unfold: `<T> von <SD_Parent> entfaltet sich in <Current_SD>.`,
      process_list_parallel: `parallel <P1...n>`,
      process_list_sequence: `<P1...n>`
    },
    state: {
      single_state: `<O> ist <s>.`,
      multiple_states: `<O> kann sein <s1...n>.`,
      all_states_are_suppressed: `<O> ist zustandsbehaftet.`,
      one_state_shown_one_missing: `<O> ist <s> oder in einem anderen Zustand.`,
      one_state_shown: `<O> ist <s> und kann in einem von <num> anderen Zuständen sein.`,
      two_or_more_states_shown_one_missing: `<O> kann <s1...n> oder in einem anderen Zustand sein.`,
      two_or_more_states_shown: `<O> kann <s1...n> oder in einem von <num> anderen Zuständen sein.`,
      default: `Zustand <s> ist standard.`,
      default_initial: `Zustand <s> ist standard and anfaenglich.`,
      initial: `Zustand <s> ist anfaenglich.`,
      final: `Zustand <s> ist final.`,
      default_initial_final: `Zustand <s> ist anfaenglich, final, und standard.`,
      initial_final: `Zustand <s> ist anfaenglich und final.`,
      default_final: `Zustand <s> ist final und standard.`,
      none: ``,
      Current: `<O> befindet sich derzeit im Status <s>.`
    },
    essence: {
      physical: `physisch`,
      informatical: `informativ`
    },
    affiliation: {
      systemic: `systemisch`,
      environmental: `umgebend`
    },
    semifolding: {
      object: `<O> lists `,
      process: `<P> lists `,
      aggregation: {
        single: `<T> als Teil`,
        multiple: `<T1...n-1> und <Tn> als Teile`
      },
      exhibition: {
        single: `<T> als Feature`,
        multiple: `<T1...n-1> und <Tn> als Features`
      },
      generalization: {
        single: `<T> als Spezialisierung`,
        multiple: `<T1...n-1> und <Tn> als Spezialisierungen`
      },
      instantiation: {
        single: `<T> als Instanz`,
        multiple: `<T1...n-1> und <Tn> als Instanzen`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> von <owner> ist <value>.`
    },
    father_model_to_sub_model: `Die ausgewählten Dinge, <o1...n> und <p1...n> werden in der Subsystem-Modellansicht des Untermodells <subsystem_name> verfeinert.`,
    sub_model_from_father_model: `Die Subsystem-Modellansicht <subsystem_name> ist vom Modell <father_model_name> abgeleitet.`
  };
  const oplTemplates_fr = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> est compris de <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> se compose de <T2> et <num> autres parties.`,
      "Aggregation-Participation_(multiple)": `<T1> est compris de <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> se compose de <T2...n> et <num> autres parties.`,
      "Generalization-Specialization": `<T2> est un <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> et <num> autres spécialisations sont <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> sont des <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> et <no> autres spécialisations sont <T1>.`,
      "Classification-Instantiation": `<T2> est un instance de <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> et <num> autres instances sont des instances de <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> est un instance de <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> et <num> autres instances sont des instances de <T1>.`,
      "Exhibition-Characterization": `<T1> expose <T2>.`,
      "Exhibition-Characterization_incomplete": `<T1> présente <T2> et <num> autres attributs.`,
      "Exhibition-Characterization_(multiple)": `<T1> expose <T2...n>.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> présente <T2...n> et <num> autres attributs.`,
      Unidirectional_Tagged_Link: `<T1> se rapporte à <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> et <num> plus.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> and <T2> sont équivalents.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> et <T2> sont <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, et <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> gère <P>.`,
      "Agent_(multiple)": `<O\Os1...n> gère <P>.`,
      Agent_Condition: `<P> arrive si <O> existe, sinon <P> est sauté.`,
      Agent_Condition_state: `<P> arrive si <O> est <s>, sinon <P> st sauté.`,
      Agent_Event: `<O> initie et gère <P>.`,
      Agent_Event_state: `<s> <O> initie et gère <P>.`,
      Instrument: `<P> requires <O_Os>.`,
      "Instrument_(multiple)": `<P> a besoin de <O\Os1...n>.`,
      Instrument_Condition: `<P> arrive si <O> existe, sinon <P> est sauté.`,
      Instrument_Condition_state: `<P> arrive si <O> est dans un état <s>, sinon <P> est sauté.`,
      Instrument_Event: `<O> initie <P>, qui nécessite <O>.`,
      Instrument_Event_state: `<s> <O> initie <P>, qui nécessite <s> <O>.`,
      Effect: `<P> affecte <O_Os>.`,
      "Effect_(multiple)": `<P> affecte <O\Os1...n>.`,
      Effect_Condition: `<P> arrive si <O> existe, auquel cas <P>  affecte <O>, sinon <P>  est sauté.`,
      Effect_Condition_state: `<P> arrive si <O> est dans un état <s>, auquel cas <P> affecte <s> <O>, sinon <P> est sauté.`,
      Effect_Event: `<O> initie <P>, qui touche <O>`,
      Effect_Event_state: `<s> <O> initie <P>, qui touche <s> <O>`,
      Consumption: `<P> consumes <O_Os>.`,
      "Consumption_(multiple)": `<P> consume <O\Os1...n>.`,
      Consumption_Condition: `<P> arrive si <O> existe, auquel cas <P> consume <O>, sinon <P> est sauté.`,
      Consumption_Condition_state: `<P> arrive si <O> est dans un état <s>, auquel cas <P> consume <s> <O>, sinon <P> est sauté.`,
      Consumption_Event: `<O> initie <P>, qui consume <O>.`,
      Consumption_Event_state: `<s> <O> initie <P>, qui consume <O>.`,
      Result: `<P> donne <O_Os>.`,
      "Result_(multiple)": `<P> donne <O\Os1...n>.`,
      "In-out_Link_Pair": `<P> change <O> de <s1> à <s2>.`,
      // 'Split_input': `<P> change <O> de <s>.`,
      // 'Split_output': `<P> change <O> à <s>.`,
      Split: `à tout autre état`,
      Condition_Input: `<P> arrive si <O> is <s1>, auquel cas <P> change <O> de <s1> à <s2>, sinon <P> est sauté.`,
      "In-out_Link_Pair_Condition": `<P> se produit si <O> est <s1>, auquel cas <P> change <O> de <s1> à <s2>, sinon <P> est ignoré.`,
      "In-out_Link_Pair_Event": `<O> à l'état <s1> initie <P>, qui change <O> de <s1> à <s2>.`,
      Overtime_exception: `<O> déclenche <P> quand <O> est <s> plus que <maxtime> <units>.`,
      Undertime_exception: `<O> déclenche <P> quand <O> is <s> moins que <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> déclenche <P> quand <O> est <s> plus que <maxtime> <units> et moins que <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> arrive si <P1> dure plus de <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> arrive si <P1> et moins que <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> arrive si <P1> et moins que <mintime> <units> ou plus que <maxtime> <units>.`,
      Invocation: `<P1> invoque <P2>.`,
      "Invocation_(multiple)": `<P1> invoque <P2...n>.`,
      "Invocation_(self)": `<P1> s'invoque.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> et <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, aussi bien que <P1...n>`,
      AND: `<T1...n-1> et <Tn>`,
      OR: `<T1...n-1> ou <Tn>`,
      XOR: `<T1> xor <T2>`,
      "Stateful-Object": `<s> <O>`,
      "Stateful-Object-value": `<O> avec la valeur <s>`,
      "Stateful-Object-value(multiple)": `<O> avec les valeurs <s1...n>`,
      "Attribute-Exhibitor": `<a> de <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      probability: `<opl>, avec probabilité <tag>.`,
      path: `En suivant le chemin <tag>, <opl>.`
    },
    object: {
      /*
       * <a> - Affiliation
       * <e> - Essence
       * <SD_..> - System diagram
       */
      thing_generic_name: `objet`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O> est <a>.`,
      default_affiliation: `<O> est <e>.`,
      non_default: `<O> est <e> et <a>.`,
      singleInzoom: `<O> de <SD_Parent> fait un zoom sur <Current_SD> en <T_list>.`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<O> de <SD_Parent> fait un zoom sur <Current_SD> en <O_list>, aussi bien que <P_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `<O1...n>, dans cette séquence verticale`,
      object_list_parallel: `<O1...n>, dans cette séquence horizontale`
    },
    process: {
      thing_generic_name: `processus`,
      default_essence_affiliation: ``,
      default_essence: `<P> est <a>.`,
      default_affiliation: `<P> est <e>.`,
      non_default: `<P> est <e> et <a>.`,
      singleInzoom: `<P> de <SD_Parent> fait un zoom sur <Current_SD> en <T_list>, qui se produisent dans cette séquence temporelle.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<P> de <SD_Parent> fait un zoom sur <Current_SD> en <P_list>, aussi bien que <O_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      process_list_parallel: `parallèle <P1...n>`,
      process_list_sequence: `<P1...n>`
    },
    state: {
      single_state: `<O> est <s>.`,
      multiple_states: `<O> peut être <s1...n>.`,
      all_states_are_suppressed: `<O> est avec état.`,
      one_state_shown_one_missing: `<O> est <s> ou à un autre état.`,
      one_state_shown: `<O> est <s> et peut être dans l'un des <num> autres états.`,
      two_or_more_states_shown_one_missing: `<O> peut être <s1...n> ou à un autre état.`,
      two_or_more_states_shown: `<O> peut être <s1...n> ou dans l'un des <num> autres états.`,
      default: `L'état <s> est par défaut.`,
      default_initial: `L'état <s> est la valeur par défaut et l'initiale.`,
      initial: `L'état <s> est initial`,
      final: `L'état <s> est final.`,
      default_initial_final: `L'état <s> est initial, final et par défaut.`,
      initial_final: `State <s> est initial et final.`,
      default_final: `State <s> est final et par défaut.`,
      none: ``,
      Current: `<O> est actuellement à l'état <s>.`
    },
    essence: {
      physical: `un physique`,
      informatical: `un informatique`
    },
    affiliation: {
      systemic: `systémique`,
      environmental: `environmental`
    },
    semifolding: {
      object: `<O> listes`,
      process: `<P> listes`,
      aggregation: {
        single: `<T> comme partie`,
        multiple: `<T1...n-1> et <Tn> comme parties`
      },
      exhibition: {
        single: `<T> comme caractéristique`,
        multiple: `<T1...n-1> et <Tn> comme caractéristiques`
      },
      generalization: {
        single: `<T> comme spécialisation`,
        multiple: `<T1...n-1> et <Tn> comme spécialisations`
      },
      instantiation: {
        single: `<T> comme instance`,
        multiple: `<T1...n-1> et <Tn> comme instances`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> de <owner> est <value>.`
    },
    father_model_to_sub_model: `Les éléments sélectionnés, <o1...n> et <p1...n> sont affinés dans la vue du sous-système du sous-modèle <subsystem_name>.`,
    sub_model_from_father_model: `La vue du modèle de sous-système <subsystem_name> est dérivée du modèle <father_model_name>.`
  };
  const oplTemplates_en = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> consists of <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> consists of <T2> and <num> more parts.`,
      "Aggregation-Participation_one_incomplete": `<T1> consists of <T2> and <num> more part.`,
      "Aggregation-Participation_(multiple)": `<T1> consists of <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consists of <T2...n> and <num> more parts.`,
      "Aggregation-Participation_incomplete_(one)": `<T1> consists of <T2...n> and <num> more part.`,
      "Generalization-Specialization": `<T2> is a <T1>.`,
      "Generalization-Specialization_one_incomplete": `<T2> and <num> more specialization are <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> are <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_incomplete_(one)": `<T2...n> and <num> more specialization are <T1>.`,
      "Classification-Instantiation": `<T2> is an instance of <T1>.`,
      "Classification-Instantiation_one_incomplete": `<T2> and <num> more instance are instances of <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> are instances of <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_incomplete_(one)": `<T2...n> and <num> more instance are instances of <T1>.`,
      "Exhibition-Characterization": `<T1> exhibits <T2>.`,
      "Exhibition-Characterization_incomplete": `<T1> exhibits <T2> and <num> more attributes.`,
      "Exhibition-Characterization_one_incomplete": `<T1> exhibits <T2> and <num> more attribute.`,
      "Exhibition-Characterization_incomplete_obj_proc": `<T1> exhibits <T2> and <num> more operations.`,
      "Exhibition-Characterization_one_incomplete_obj_proc": `<T1> exhibits <T2> and <num> more operation.`,
      "Exhibition-Characterization_(multiple)": `<T1> exhibits <T2...n>.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibits <T2...n> and <num> more attributes.`,
      "Exhibition-Characterization_incomplete_(one)": `<T1> exhibits <T2...n> and one more attribute.`,
      "Exhibition-Characterization_incomplete_obj_proc_(multiple)": `<T1> exhibits <T2...n> and <num> more operations.`,
      "Exhibition-Characterization_incomplete_obj_proc_(one)": `<T1> exhibits <T2...n> and one more operation.`,
      "Exhibition-Characterization_incomplete_both": `<T1> exhibits <T2> and <num> more <attribute>, as well as <num2> more <operation>.`,
      "Exhibition-Characterization_incomplete_both_(multiple)": `<T1> exhibits <T2...n> and <num> more <attribute>, as well as <num2> more <operation>.`,
      "Exhibition-Attribute": "attribute",
      "Exhibition-Attributes": "attributes",
      "Exhibition-Operation": "operation",
      "Exhibition-Operations": "operations",
      Unidirectional_Tagged_Link: `<T1> relates to <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> and <T2> are equivalent.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> and <T2> are <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, and <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> handles <P>.`,
      "Agent_(multiple)": `<O\Os1...n> handle <P>.`,
      Agent_Condition: `<P> occurs if <O> exists, otherwise <P> is skipped.`,
      "Agent_Condition(multiple)": `<P> occurs if <O\Os1...n> exist, otherwise <P> is skipped.`,
      Agent_Condition_state: `<P> occurs if <O> is <s>, otherwise <P> is skipped.`,
      Agent_Event: `<O> initiates and handles <P>.`,
      "Agent_Event(multiple)": `<O\Os1...n> initiate and handle <P>.`,
      Agent_Event_state: `<s> <O> initiates and handles<P>.`,
      Agent_Negation: `<P> occurs if <O_Os> is not present.`,
      "Agent_Negation_(multiple)": `<P> occurs if <O\Os1...n> are not present`,
      Agent_Condition_Negation: `<P> occurs if <O> does not exist, otherwise <P> is skipped.`,
      "Agent_Condition_Negation(multiple)": `<P> occurs if <O\Os1...n> do not exist, otherwise <P> is skipped.`,
      Agent_Condition_Negation_state: `<P> occurs if <O> is not at state <s>, otherwise <P> is skipped.`,
      Instrument: `<P> requires <O_Os>.`,
      "Instrument_(multiple)": `<P> requires <O\Os1...n>.`,
      Instrument_Condition: `<P> occurs if <O> exists, otherwise <P> is skipped.`,
      "Instrument_Condition(multiple)": `<P> occurs if <O\Os1...n> exist, otherwise <P> is skipped.`,
      Instrument_Condition_state: `<P> occurs if <O> is at state <s>, otherwise <P> is skipped.`,
      Instrument_Event: `<O> initiates <P>, which requires <O>.`,
      "Instrument_Event(multiple)": `<O\Os1...n> initiate <P>, which requires them.`,
      Instrument_Event_state: `<s> <O> initiates <P>, which requires <s> <O>.`,
      Instrument_Negation: `<P> occurs if <O_Os> does not exist.`,
      "Instrument_Negation_(multiple)": `<P> occurs if <O\Os1...n> do not exist.`,
      Instrument_Condition_Negation: `<P> occurs if <O> does not exist, otherwise <P> is skipped.`,
      "Instrument_Condition_Negation(multiple)": `<P> occurs if <O\Os1...n> do not exist, otherwise <P> is skipped.`,
      Instrument_Condition_Negation_state: `<P> occurs if <O> is not at state <s>, otherwise <P> is skipped.`,
      Effect: `<P> affects <O_Os>.`,
      "Effect_(multiple)": `<P> affects <O\Os1...n>.`,
      Effect_Condition: `<P> occurs if <O> exists, in which case <P> affects <O>, otherwise <P> is skipped.`,
      "Effect_Condition(multiple)": `<P> occurs if <O\Os1...n> exist, in which case <P> affects them, otherwise <P> is skipped.`,
      Effect_Condition_state: `<P> occurs if <O> is at state <s>, in which case <P> affects <s> <O>, otherwise <P> is skipped.`,
      Effect_Event: `<O> initiates <P>, which affects <O>`,
      "Effect_Event(multiple)": `<O\Os1...n> initiate <P>, which affects <O>.`,
      Effect_Event_state: `<s> <O> initiates <P>, which affects <s> <O>`,
      Effect_Negation: `<P> does not affect <O_Os>.`,
      "Effect_Negation_(multiple)": `<P> does not affect <O\Os1...n>.`,
      Effect_Condition_Negation: `<P> occurs if <O> does not exist, in which case <P> affects <O>, otherwise <P> is skipped.`,
      "Effect_Condition_Negation(multiple)": `<P> occurs if <O\Os1...n> do not exist, in which case <P> affects them, otherwise <P> is skipped.`,
      Effect_Condition_Negation_state: `<P> occurs if <O> is not at state <s>, in which case <P> affects <s> <O>, otherwise <P> is skipped.`,
      Consumption: `<P> consumes <O_Os>.`,
      "Consumption_(multiple)": `<P> consumes <O\Os1...n>.`,
      Consumption_Condition: `<P> occurs if <O> exists, in which case <P> consumes <O>, otherwise <P> is skipped.`,
      "Consumption_Condition(multiple)": `<P> occurs if <O\Os1...n> exist, in which case <P> consumes them, otherwise <P> is skipped.`,
      Consumption_Condition_state: `<P> occurs if <O> is at state <s>, in which case <P> consumes <s> <O>, otherwise <P> is skipped.`,
      Consumption_Event: `<O> initiates <P>, which consumes <O>.`,
      "Consumption_Event(multiple)": `<O\Os1...n> initiate <P>, which consumes them.`,
      Consumption_Event_state: `<s> <O> initiates <P>, which consumes <O>.`,
      Consumption_Negation: `<P> does not consume <O_Os>.`,
      "Consumption_Negation_(multiple)": `<P> does not consume <O\Os1...n>.`,
      Consumption_Condition_Negation: `<P> occurs if <O> does not exist, in which case <P> consumes <O>, otherwise <P> is skipped.`,
      "Consumption_Condition_Negation(multiple)": `<P> occurs if <O\Os1...n> do not exist, in which case <P> consumes them, otherwise <P> is skipped.`,
      Consumption_Condition_Negation_state: `<P> occurs if <O> is not at state <s>, in which case <P> consumes <s> <O>, otherwise <P> is skipped.`,
      Result: `<P> yields <O_Os>.`,
      "Result_(multiple)": `<P> yields <O\Os1...n>.`,
      "In-out_Link_Pair": `<P> changes <O> from <s1> to <s2>.`,
      "In-out(group)": `<O> from <s1> to <s2>`,
      "In-out_Link_Pair(group)": `<P> changes <O> from <s1> to <s2><Other_changes>.`,
      // 'Split_input': `<P> changes <O> from <s> to any other state.`, // not used anymore
      // 'Split_output': `<P> changes <O> to <s> from any other state.`,// not used anymore
      Split: `any other state`,
      Condition_Input: `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Condition": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Condition(group)": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Event": `<O> at state <s1> initiates <P>, which changes <O> from <s1> to <s2>.`,
      "In-out_Link_Pair_Event(group)": `<O> at states <s1> initiates <P>, which changes <O> from <s1> to <s2>.`,
      Overtime_exception: `<O> triggers <P> when <O> is <s> more than <maxtime> <units>.`,
      Undertime_exception: `<O> triggers <P> when <O> is <s> less than <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> triggers <P> when <O> is <s> more than <maxtime> <units> and less than <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> occurs if <P1> lasts more than <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> occurs if <P1> falls short of <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> occurs if <P1> falls short of <mintime> <units> or lasts more than <maxtime> <units>.`,
      Invocation: `<P1> invokes <P2>.`,
      "Invocation_(multiple)": `<P1> invokes <P2...n>.`,
      "Invocation_(self)": `<P1> invokes itself.`,
      "Invocation_(parent)": `<P1> invokes <P2>.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> and <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, as well as <P1...n>`,
      "AND(links)": `<T1...n-1>, and <Tn>`,
      AND: `<T1...n-1> and <Tn>`,
      OR: `<T1...n-1> or <Tn>`,
      XOR: `<T1> xor <T2>`,
      "Stateful-Object": `<O> at state <s>`,
      "Stateful-Object-value": `<O> with value <s>`,
      "Stateful-Object-value(multiple)": `<O> with values <s1...n>`,
      "Stateful-Object-unidirectional": `state <s> of <O>`,
      "Stateful-Object(multiple)": `<O> at states <s1...n>`,
      "Attribute-Exhibitor": `<T> of <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> and <change>.`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object.
      XOR: {
        process: {
          Result: "<P> yields exactly one of <O_Os1...n>.",
          "Result(brothers)": "<P> yields <O> at one of the states <s1...n>.",
          Consumption: `<P> consumes exactly one of <O_Os1...n>.`,
          "Consumption(brothers)": `<P> consumes <O> at one of the states <s1...n>.`,
          Consumption_Condition: `<P> occurs if exactly one of <O_Os1...n> exists, in which case <P> consumes the existed one, otherwise <P> is skipped.`,
          "Consumption_Condition(brothers)": `<P> occurs if <O> is at one of the states <s1...n>, in which case <P> consumes it, otherwise <P> is skipped.`,
          Consumption_Event: `Exactly one of <O_Os1...n> initiates <P>, which consumes it.`,
          "Consumption_Event(brothers)": `<O> initiates <P> when it is at one of the states <s1...n>, which consumes it.`,
          Consumption_Negation: `<P> does not consume exactly one of <O_Os1...n>.`,
          "Consumption_Negation(brothers)": `<P> does not consume <O> at one of the states <s1...n>.`,
          Consumption_Condition_Negation: `<P> occurs if exactly one of <O_Os1...n> does not exist, in which case <P> consumes the existing one, otherwise <P> is skipped.`,
          "Consumption_Condition_Negation(brothers)": `<P> occurs if <O> is not at one of the states <s1...n>, in which case <P> consumes it, otherwise <P> is skipped.`,
          Effect: `<P> affects exactly one of <O_Os1...n>.`,
          "Effect(brothers)": `<P> affects <O> at one of the states <s1...n>.`,
          Effect_Condition: `<P> occurs if exactly one of <O_Os1...n> exists, in which case <P> affects it, otherwise <P> is skipped.`,
          "Effect_Condition(brothers)": `<P> occurs if <O> is at one of the states <s1...n>, in which case <P> affects it, otherwise <P> is skipped.`,
          Effect_Event: `Exactly one of <O_Os1...n> initiates <P>, which affects it.`,
          "Effect_Event(brothers)": `<O> initiates <P> when it is at one of the states <s1...n>, which affects it.`,
          Effect_Negation: `<P> does not have an effect on exactly one of <O_Os1...n>.`,
          "Effect_Negation(brothers)": `<P> does not have an affect on <O> at one of the states <s1...n>.`,
          Effect_Condition_Negation: `<P> occurs if exactly one of <O_Os1...n> does not exist, in which case <P> affects all the others, otherwise <P> is skipped.`,
          "Effect_Condition_Negation(brothers)": `<P> occurs if <O> is not at one of the states <s1...n>, in which case <P> affects all the others, otherwise <P> is skipped.`,
          Agent: `Exactly one of <O_Os1...n> handles <P>.`,
          "Agent(brothers)": `<O> handles <P> when it is at one of the states <s1...n>.`,
          Agent_Event: `Exactly one of <O_Os1...n> initiates and handles <P>.`,
          "Agent_Event(brothers)": `<O> initiates and handles <P> when it is at one of the states <s1...n>.`,
          Agent_Condition: `<P> occurs if exactly one of <O_Os1...n> exists, otherwise <P> is skipped.`,
          "Agent_Condition(brothers)": `<P> occurs if <O> is at one of the states <s1...n>, otherwise <P> is skipped.`,
          Agent_Negation: `Exactly one of <O_Os1...n> does not handle <P>.`,
          "Agent_Negation(brothers)": `<O> does not handle <P> when it is at one of the states <s1...n>.`,
          Agent_Condition_Negation: `<P> occurs if exactly one of <O_Os1...n> does not exist, otherwise <P> is skipped.`,
          "Agent_Condition_Negation(brothers)": `<P> occurs if <O> is not at one of the states <s1...n>, otherwise <P> is skipped.`,
          Instrument: `<P> requires exactly one of <O_Os1...n>.`,
          "Instrument(brothers)": `<P> requires <O> at one of the states <s1...n>.`,
          Instrument_Condition: `<P> occurs if exactly one of <O_Os1...n> exists, otherwise <P> is skipped.`,
          "Instrument_Condition(brothers)": `<P> occurs if <O> is at one of the states <s1...n>, otherwise <P> is skipped.`,
          Instrument_Event: `Exactly one of <O_Os1...n> initiates <P>, which requires it.`,
          "Instrument_Event(brothers)": `<O> initiates <P> when it is at one of the states <s1...n>, which requires it.`,
          Instrument_Negation: `<P> does not require exactly one of <O_Os1...n>.`,
          "Instrument_Negation(brothers)": `<P> does not require <O> at one of the states <s1...n>.`,
          Instrument_Condition_Negation: `<P> occurs if exactly one of <O_Os1...n> does not exist, otherwise <P> is skipped.`,
          "Instrument_Condition_Negation(brothers)": `<P> occurs if <O> is not at one of the states <s1...n>, otherwise <P> is skipped.`,
          Invocation_OUT: `<P> invokes either <P1...n>.`,
          Invocation_IN: `Either <P1...n> invokes <P>.`,
          InOut: `<P> changes <O> from <s1> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> changes <O> from exactly one of <ins1..n> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> changes <O> from exactly one of <ins1..n> to <s1>.`
        },
        object: {
          Result: `Exactly one of <P1...n> yields <O_Os>.`,
          Consumption: `Exactly one of <P1...n> consumes <O_Os>.`,
          Consumption_Event: `<O_Os> initiates exactly one of <P1...n>, which consumes the initiated process.`,
          Consumption_Condition_state: `Exactly one of <P1...n> occurs if <O> is <s1>, in which case the occurring process consumes <O>, otherwise these processes are skipped.`,
          Consumption_Condition: `Exactly one of <P1...n> occurs if <O_Os> exists, in which case the occurring process consumes <O_Os>, otherwise these processes are skipped.`,
          Consumption_Negation: `Exactly one of <P1...n> does not consume <O_Os>`,
          Consumption_Condition_Negation_state: `Exactly one of <P1...n> occurs if <O> is not at state <s1>, in which case that process consumes <O>, otherwise all these processes are skipped.`,
          Consumption_Condition_Negation: `Exactly one of <P1...n> occurs if <O_Os> does not exist, in which case that process consumes <O_Os>, otherwise all these processes are skipped.`,
          Effect: `Exactly one of <P1...n> affects <O_Os>.`,
          Effect_Event: `<O_Os> initiates exactly one of <P1...n>, which affects the occurring process.`,
          Effect_Condition: `Exactly one of <P1...n> occurs if <O_Os> exists, in which case the occurring process affects <O_Os>, otherwise these processes are skipped.`,
          Effect_Negation: `<P1...n> does not have an effect on exactly one of <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> occurs if exactly one of <O_Os> does not exist, in which case <P1...n> affects all the others, otherwise <P1...n> are skipped.`,
          Agent: `<O_Os> handles exactly one of <P1...n>.`,
          Agent_Event: `<O_Os> initiates and handles exactly one of <P1...n>.`,
          Agent_Condition: `<O_Os> handles exactly one of <P1...n> if <O_Os> exists, otherwise these processes are skipped.`,
          Agent_Condition_state: `<O> handles exactly one of <P1...n> if <O> is <s1>, otherwise these processes are skipped.`,
          Agent_Negation: `Exactly one of <P1...n> occurs if <O_Os> is not present.`,
          Agent_Condition_Negation: `Exactly one of <P1...n> occurs if <O_Os> is not present, otherwise all these processes are skipped.`,
          Agent_Condition_Negation_state: `Exactly one of <P1...n> occurs if <O> is not at state <s1>, otherwise all these processes are skipped.`,
          Instrument: `Exactly one of <P1...n> requires <O_Os>.`,
          Instrument_Event: `<O_Os> initiates exactly one of <P1...n>, which requires <O_Os>.`,
          Instrument_Condition: `Exactly one of <P1...n> requires <O_Os>, otherwise these processes are skipped.`,
          Instrument_Condition_state: `Exactly one of <P1...n> requires that <O> is <s1>, otherwise these processes are skipped.`,
          Instrument_Negation: `Exactly one of <P1...n> occurs if <O_Os> does not exist.`,
          Instrument_Condition_Negation: `Exactly one of <P1...n> occurs if <O_Os> does not exist, otherwise all these processes are skipped.`,
          Instrument_Condition_Negation_state: `Exactly one of <P1...n> occurs if <O> is not at state <s1>, otherwise all these processes are skipped.`
        }
      },
      OR: {
        process: {
          Result: "<P> yields at least one of <O_Os1...n>.",
          Consumption: `<P> consumes at least one of <O_Os1...n>.`,
          Consumption_Condition: `<P> occurs if at least one of <O_Os1...n> exists, in which case <P> consumes the existed ones, otherwise <P> is skipped.`,
          Consumption_Event: `At least one of <O_Os1...n> initiates <P>, which consumes it.`,
          Consumption_Negation: `<P> does not consume at least one of <O_Os1...n>.`,
          Consumption_Condition_Negation: `<P> occurs if at least one of <O_Os1...n> does not exist, in which case <P> consumes the existing ones, otherwise <P> is skipped.`,
          Effect: `<P> affects at least one of <O_Os1...n>.`,
          Effect_Condition: `<P> occurs if at least one of <O_Os1...n> exists, in which case <P> affects it, otherwise <P> is skipped.`,
          Effect_Event: `At least one of <O_Os1...n> initiates <P>, which affects it.`,
          Effect_Negation: `<P> does not have an effect on at least one of <O_Os1...n>.`,
          "Effect_Negation(brothers)": `<P> does not have an affect on <O> at least one of the states <s1...n>.`,
          Effect_Condition_Negation: `<P> occurs if at least one of <O_Os1...n> does not exist, in which case <P> affects all the others, otherwise <P> is skipped.`,
          "Effect_Condition_Negation(brothers)": `<P> occurs if <O> is not at least one of the states <s1...n>, in which case <P> affects all the others, otherwise <P> is skipped.`,
          Agent: `At least one of <O_Os1...n> handles <P>.`,
          Agent_Event: `At least one of <O_Os1...n> initiates and handles <P>.`,
          Agent_Condition: `<P> occurs if At least one of <O_Os1...n> exists, otherwise <P> is skipped.`,
          Agent_Negation: `At least one of <O_Os1...n> does not handle <P>.`,
          Agent_Condition_Negation: `<P> occurs if at least one of <O_Os1...n> does not exist, otherwise <P> is skipped.`,
          Instrument: `<P> requires at least one of <O_Os1...n>.`,
          Instrument_Condition: `<P> occurs if at least one of <O_Os1...n> exists, otherwise <P> is skipped.`,
          Instrument_Event: `At least one of <O_Os1...n> initiates <P>, which requires it.`,
          Instrument_Negation: `<P> does not require at least one of <O_Os1...n>.`,
          Instrument_Condition_Negation: `<P> occurs if at least one of <O_Os1...n> does not exist, otherwise <P> is skipped.`,
          Invocation_OUT: `<P> invokes at least one of <P1...n>.`,
          Invocation_IN: `At least one of <P1...n> invokes <P>.`,
          InOut: `<P> changes <O> from <s1> to at least one of <O_Os2...n>.`
        },
        object: {
          Result: `At least one of <P1...n> yields <O_Os>.`,
          Consumption: `At least one of <P1...n> consumes <O_Os>.`,
          Consumption_Event: `<O_Os> initiates at least one of <P1...n>, which consumes the initiated process.`,
          Consumption_Condition_state: `At least one of <P1...n> occurs if <O> is <s1>, in which case the occurring process consumes <O>, otherwise these processes are skipped.`,
          Consumption_Condition: `At least one of <P1...n> occurs if <O_Os> exists, in which case the occurring process consumes <O_Os>, otherwise these processes are skipped.`,
          Consumption_Negation: `At least one of <P1...n> does not consume <O_Os>.`,
          Consumption_Condition_Negation_state: `At least one of <P1...n> occurs if <O> is not at state <s1>, in which case that process consumes <O>, otherwise all these processes are skipped.`,
          Consumption_Condition_Negation: `At least one of <P1...n> occurs if <O_Os> does not exist, in which case that process consumes <O_Os>, otherwise all these processes are skipped.`,
          Effect: `At least one of <P1...n> affects <O_Os>`,
          Effect_Event: `<O_Os> initiates at least one of <P1...n>, which affects the occurring process.`,
          Effect_Condition: `At least one of <P1...n> occurs if <O_Os> exists, in which case the occurring process affects <O_Os>, otherwise these processes are skipped.`,
          Effect_Negation: `<P1...n> does not have an effect on at least one of <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> occurs if at least one of <O_Os> does not exist, in which case <P1...n> affects all the others, otherwise <P1...n> are skipped.`,
          Agent: `<O_Os> handles at least one of <P1...n>.`,
          Agent_Event: `<O_Os> initiates and handles at least one of <P1...n>.`,
          Agent_Condition: `<O_Os> handles at least one of <P1...n> if <O_Os> exists, otherwise these processes are skipped.`,
          Agent_Condition_state: `<O> handles at least one of <P1...n> if <O> is <s1>, otherwise these processes are skipped.`,
          Agent_Negation: `At least one of <P1...n> occurs if <O_Os> is not present.`,
          Agent_Condition_Negation: `At least one of <P1...n> occurs if <O_Os> is not present, otherwise all these processes are skipped.`,
          Agent_Condition_Negation_state: `At least one of <P1...n> occurs if <O> is not at state <s1>, otherwise all these processes are skipped.`,
          Instrument: `At least one of <P1...n> requires <O_Os>`,
          Instrument_Event: `<O_Os> initiates at least one of <P1...n>, which requires <O_Os>`,
          Instrument_Condition: `At least one of <P1...n> requires <O_Os>, otherwise these processes are skipped.`,
          Instrument_Condition_state: `At least one of <P1...n> requires that <O> is <s1>, otherwise these processes are skipped.`,
          Instrument_Negation: `At least one of <P1...n> occurs if <O_Os> does not exist.`,
          Instrument_Condition_Negation: `At least one of <P1...n> occurs if <O_Os> does not exist, otherwise all these processes are skipped.`,
          Instrument_Condition_Negation_state: `At least one of <P1...n> occurs if <O> is not at state <s1>, otherwise all these processes are skipped.`
        }
      },
      NOT: {
        process: {
          Agent_Negation: `<O_Os1...n> does not handle <P>.`,
          Agent_Condition_Negation: `<P> occurs if <O_Os1...n> does not exist, otherwise <P> is skipped.`,
          Instrument_Negation: `<P> does not require <O_Os1...n>.`,
          Instrument_Condition_Negation: `<P> occurs if <O_Os1...n> does not exist, otherwise <P> is skipped.`,
          Consumption_Negation: `<P> does not consume <O_Os1...n>.`,
          Consumption_Condition_Negation: `<P> occurs if <O_Os1...n> does not exist, in which case <P> consumes the existing ones, otherwise <P> is skipped.`,
          Effect_Negation: `<P> does not have an effect on <O_Os1...n>.`,
          Effect_Condition_Negation: `<P> occurs if <O_Os1...n> does not exist, in which case <P> affects all the others, otherwise <P> is skipped.`
        },
        object: {
          Agent_Negation: `<P1...n> occurs if <O_Os> is not present.`,
          Agent_Condition_Negation: `<P1...n> occurs if <O_Os> is not present, otherwise all these processes are skipped.`,
          Agent_Condition_Negation_state: `<P1...n> occurs if <O> is not at state <s1>, otherwise all these processes are skipped.`,
          Instrument_Negation: `<P1...n> occurs if <O_Os> does not exist.`,
          Instrument_Condition_Negation: `<P1...n> occurs if <O_Os> does not exist, otherwise all these processes are skipped.`,
          Instrument_Condition_Negation_state: `<P1...n> occurs if <O> is not at state <s1>, otherwise all these processes are skipped.`,
          Consumption_Negation: `<P1...n> does not consume <O_Os>`,
          Consumption_Condition_Negation_state: `<P1...n> occurs if <O> is not at state <s1>, in which case that process consumes <O>, otherwise all these processes are skipped.`,
          Consumption_Condition_Negation: `<P1...n> occurs if <O_Os> does not exist, in which case that process consumes <O_Os>, otherwise all these processes are skipped.`,
          Effect_Negation: `<P1...n> does not have an effect on <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> occurs if <O_Os> does not exist, in which case <P1...n> affects all the others, otherwise <P1...n> are skipped.`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; where <tag>`,
      probability: `<O_Os> with probability <tag>`,
      rate: `<O_Os> at a rate of <tag> <units>`,
      path: `Following path <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `an optional`,
      "*": `optional`,
      "+": `at least one`,
      "n..n": `<n1> to <n2>`,
      "n..*": `at least <n1>`,
      "n..mean..n": `<n1> to <n2>, with a mean of <mean>`
    },
    ranges: {
      "<=": `less than or equal to`,
      ">=": "more than or equal to",
      "=": "equal to",
      "<>": "not equal to",
      "<": `less than`,
      ">": "more than"
    },
    object: {
      thing_generic_name: `object`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O> is <a>.`,
      default_affiliation: `<O> is <e>.`,
      non_default: `<O> is <e> and <a>.`,
      singleInzoom: `<O> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<O> from <SD_Parent> zooms in <Current_SD> into <O_list>, as well as <P_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `<O1...n>, in that vertical sequence`,
      object_list_parallel: `<O1...n>, in that horizontal sequence`
    },
    process: {
      thing_generic_name: `process`,
      default_essence_affiliation: ``,
      default_essence: `<P> is <a>.`,
      default_affiliation: `<P> is <e>.`,
      non_default: `<P> is <e> and <a>.`,
      singleInzoom: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>, which occur in that time sequence.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, which occur in that time sequence, as well as <O_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      // 'process_list_parallel': `<P1...n>, in that horizontal sequence`,
      process_list_parallel: `parallel <P1...n>`,
      // 'process_list_sequence': `<P1...n>, in that vertical sequence`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `The expected duration of <P> is <exp> <units>.`,
      min_duration: `The minimal duration of <P> is <min> <units>.`,
      max_duration: `The maximal duration of <P> is <max> <units>.`,
      min_max_range_duration: `The minimal duration and maximal duration of <P> are <min> <units> and <max> <units>, respectively.`,
      min_exp_range_duration: `The minimal duration and expected duration of <P> are <min> <units> and <exp> <units>, respectively.`,
      exp_max_range_duration: `The expected duration and maximal duration of <P> are <exp> <units> and <max> <units>, respectively.`,
      expected_range_duration: `The minimal duration, expected duration, and maximal duration of <P> are <min> <units>, <exp> <units>, and <max> <units>, respectively.`,
      default_time_units: `seconds`
    },
    state: {
      single_state: `<O> is <s>.`,
      multiple_states: `<O> can be <s1...n>.`,
      all_states_are_suppressed: `<O> is stateful.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> is <s> and can be at one of <num> other states.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> can be <s1...n> or at one of <num> other states.`,
      default: `State <s> is default.`,
      default_initial: `State <s> is default and initial.`,
      initial: `State <s> is initial.`,
      final: `State <s> is final.`,
      default_initial_final: `State <s> is initial, final, and default.`,
      initial_final: `State <s> is initial and final.`,
      default_final: `State <s> is final and default.`,
      none: ``,
      Current: `<O> is currently at state <s>.`,
      // 'timeDurational': {
      expected_duration: `The expected duration of <s> is <exp> <units>.`,
      min_duration: `The minimal duration of <s> is <min> <units>.`,
      max_duration: `The maximal duration of <s> is <max> <units>.`,
      min_max_range_duration: `The minimal duration and maximal duration of <s> are <min> <units> and <max> <units>, respectively.`,
      min_exp_range_duration: `The minimal duration and expected duration of <s> are <min> <units> and <exp> <units>, respectively.`,
      exp_max_range_duration: `The expected duration and maximal duration of <s> are <exp> <units> and <max> <units>, respectively.`,
      expected_range_duration: `The minimal duration, expected duration, and maximal duration of <s> are <min> <units>, <exp> <units>, and <max> <units>, respectively.`,
      default_time_units: `seconds`
      // }
    },
    essence: {
      physical: `a physical`,
      informatical: `an informatical`
    },
    affiliation: {
      systemic: `systemic`,
      environmental: `environmental`
    },
    semifolding: {
      object: `<O> lists `,
      process: `<P> lists `,
      general: {
        object: `<O> from <SD> is semi-folded in <HighestSD>`,
        process: `<P> from <SD> is semi-folded in <HighestSD>`
      },
      aggregation: {
        single: `<T> as a part`,
        multiple: `<T1...n-1> and <Tn> as parts`
      },
      exhibition: {
        single: `<T> as a feature`,
        multiple: `<T1...n-1> and <Tn> as features`
      },
      generalization: {
        single: `<T> as a specialization`,
        multiple: `<T1...n-1> and <Tn> as specializations`
      },
      instantiation: {
        single: `<T> as an instance`,
        multiple: `<T1...n-1> and <Tn> as instances`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> of <owner> is <value>.`
    },
    father_model_to_sub_model: `The selected things, <o1...n>, and <p1...n> are refined in sub model <subsystem_name> subsystem model view.`,
    sub_model_from_father_model: `The <subsystem_name> subsystem model view is derived from the <father_model_name> model.`
  };
  const oplTemplates_ru = {
    structural_link: {
      "Aggregation-Participation": `<T1> состоит из <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> consists of <T2> and <num> more parts.`,
      "Aggregation-Participation_(multiple)": `<T1> состоит из <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consists of <T2...n> and <num> more parts.`,
      "Generalization-Specialization": `<T2> это <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> это <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> and <num> more specializations are <T1>.`,
      "Classification-Instantiation": `<T2> является экземпляром <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> являются экземплярами <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> and <num> more instances are instances of <T1>.`,
      "Exhibition-Characterization": `<T1> представляет <T2>.`,
      "Exhibition-Characterization_incomplete": `<T1> exhibits <T2> and <num> more attributes.`,
      "Exhibition-Characterization_(multiple)": `<T1> представляет <T2...n>.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibits <T2...n> and <num> more attributes.`,
      Unidirectional_Tagged_Link: `<T1> связан/а с <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> и <T2> эквивалентны.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> и <T2> это <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, и <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      Agent: `<O_Os> обрабатывает <P>.`,
      "Agent_(multiple)": `<OOs1...n> задействует процесс <P>.`,
      Agent_Condition: `<P> происходит, если <O> существует, иначе <P> пропускается.`,
      "Agent_Condition(multiple)": `<P> происходит, если <OOs1...n> существуют, иначе <P> пропускается.`,
      Agent_Condition_state: `<P> происходит, если <O> это <s>, иначе <P> пропускается.`,
      Agent_Event: `<O> активирует и задействует <P>.`,
      "Agent_Event(multiple)": `<OOs1...n> активируют и задействуют <P>.`,
      Agent_Event_state: `<s> <O> активирует и задействует<P>.`,
      Agent_Negation: `<P> происходит, если <O_Os> нет.`,
      "Agent_Negation_(multiple)": `<P> происходит, если <OOs1...n> нет`,
      Agent_Condition_Negation: `<P> происходит, если <O> не существует, иначе <P> пропускается.`,
      "Agent_Condition_Negation(multiple)": `<P> происходит, если <OOs1...n> не существуют, иначе <P> пропускается.`,
      Agent_Condition_Negation_state: `<P> происходит, если <O> не в состоянии <s>, иначе <P> пропускается.`,
      Instrument: `<P> требует <O_Os>.`,
      "Instrument_(multiple)": `<P> требует <OOs1...n>.`,
      Instrument_Condition: `<P> происходит, если <O> существует, иначе <P> пропускается.`,
      "Instrument_Condition(multiple)": `<P> происходит, если <OOs1...n> существуют, иначе <P> пропускается.`,
      Instrument_Condition_state: `<P> происходит, если <O> в состоянии <s>, иначе <P> пропускается.`,
      Instrument_Event: `<O> активирует <P>, который/ая требует <O>.`,
      "Instrument_Event(multiple)": `<OOs1...n> активируют <P>, который/ая необходим им.`,
      Instrument_Event_state: `<s> <O> активирует <P>, который/ая необходим <s> <O>.`,
      Instrument_Negation: `<P> происходит, если <O_Os> не существует.`,
      "Instrument_Negation_(multiple)": `<P> происходит, если <OOs1...n> не существует.`,
      Instrument_Condition_Negation: `<P> происходит, если <O> не существует, иначе <P> пропускается.`,
      "Instrument_Condition_Negation(multiple)": `<P> происходит, если <OOs1...n> не существуют, иначе <P> пропускается.`,
      Instrument_Condition_Negation_state: `<P> происходит, если <O> не в состоянии <s>, иначе <P> пропускается.`,
      Effect: `<P> влияет на <O_Os>.`,
      "Effect_(multiple)": `<P> влияет на <OOs1...n>.`,
      Effect_Condition: `<P> происходит, если <O> существует, в этом случае <P> влияет на <O>, иначе <P> пропускается.`,
      "Effect_Condition(multiple)": `<P> происходит, если <OOs1...n> существует, в этом случае <P> влияет на них, иначе <P> пропускается.`,
      Effect_Condition_state: `<P> происходит, если <O> в состоянии <s>, в этом случае <P> влияет на <s> <O>, иначе <P> пропускается.`,
      Effect_Event: `<O> активирует <P>, который/ая влияет на <O>`,
      "Effect_Event(multiple)": `<OOs1...n> активируют <P>, который/ая влияет на <O>.`,
      Effect_Event_state: `<s> <O> активирует <P>, который/ая влияет на <s> <O>`,
      Effect_Negation: `<P> не влияет на <O_Os>.`,
      "Effect_Negation_(multiple)": `<P> не влияет на <OOs1...n>.`,
      Effect_Condition_Negation: `<P> происходит, если <O> не существует, в этом случае <P> влияет на <O>, иначе <P> пропускается.`,
      "Effect_Condition_Negation(multiple)": `<P> происходит, если <OOs1...n> не существуют, в этом случае <P> влияет на них, иначе <P> пропускается.`,
      Effect_Condition_Negation_state: `<P> происходит, если <O> не в состоянии <s>, в этом случае <P> влияет на <s> <O>, иначе <P> пропускается.`,
      Consumption: `<P> потребляет <O_Os>.`,
      "Consumption_(multiple)": `<P> потребляет <OOs1...n>.`,
      Consumption_Condition: `<P> происходит, если <O> существует, в этом случае <P> потребляет <O>, иначе <P> пропускается.`,
      "Consumption_Condition(multiple)": `<P> происходит, если <OOs1...n> существуют, в этом случае <P> потребляет их, иначе <P> пропускается.`,
      Consumption_Condition_state: `<P> происходит, если <O> в состоянии <s>, в этом случае <P> потребляет <s> <O>, иначе <P> пропускается.`,
      Consumption_Event: `<O> активирует <P>, который/ая потребляет <O>.`,
      "Consumption_Event(multiple)": `<OOs1...n> активируют <P>, который/ая потребляет их.`,
      Consumption_Event_state: `<s> <O> активирует <P>, который/ая потребляет <O>.`,
      Consumption_Negation: `<P> не потребляет <O_Os>.`,
      "Consumption_Negation_(multiple)": `<P> не потребляет <OOs1...n>.`,
      Consumption_Condition_Negation: `<P> происходит, если <O> не существует, в этом случае <P> потребляет <O>, иначе <P> пропускается.`,
      "Consumption_Condition_Negation(multiple)": `<P> происходит, если <OOs1...n> не существует, в этом случае <P> потребляет их, иначе <P> пропускается.`,
      Consumption_Condition_Negation_state: `<P> происходит, если <O> не в состоянии <s>, в этом случае <P> потребляет <s> <O>, иначе <P> пропускается.`,
      Result: `<P> производит <O_Os>.`,
      "Result_(multiple)": `<P> производит <OOs1...n>.`,
      "In-out_Link_Pair": `<P> меняет <O> от <s1> к <s2>.`,
      "In-out(group)": `<O> от <s1> к <s2>`,
      "In-out_Link_Pair(group)": `<P> меняет <O> от <s1> к <s2><Other_changes>.`,
      Split: `любое другое состояние`,
      Condition_Input: `<P> происходит, если <O> в состоянии <s1>, в этом случае <P> меняет <O> от <s1> к <s2>, иначе <P> пропускается.`,
      "In-out_Link_Pair_Condition": `<P> происходит, если <O> в состоянии <s1>, в этом случае <P> меняет <O> от <s1> к <s2>, иначе <P> пропускается.`,
      "In-out_Link_Pair_Condition(group)": `<P> происходит, если <O> в состоянии <s1>, в этом случае <P> меняет <O> от <s1> к <s2>, иначе <P> пропускается.`,
      "In-out_Link_Pair_Event": `<O> в состоянии <s1> активирует <P>, который/ая меняет <O> от <s1> к <s2>.`,
      "In-out_Link_Pair_Event(group)": `<O> в состоянии <s1> активирует <P>, который/ая меняет <O> от <s1> к <s2>.`,
      Overtime_exception: `<O> запускает <P> когда <O> в состоянии <s> более чем <maxtime> <units>.`,
      Undertime_exception: `<O> запускает <P> когда <O> в состоянии <s> менее чем <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> запускает <P> когда <O> в состоянии <s> более чем <maxtime> <units> и менее чем <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> происходит, если <P1> длится более, чем <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> происходит, если <P1> менее, чем <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> происходит, если <P1> менее, чем <mintime> <units> или длится более, чем <maxtime> <units>.`,
      Invocation: `<P1> вызывает <P2>.`,
      "Invocation_(multiple)": `<P1> вызывает <P2...n>.`,
      "Invocation_(self)": `<P1> вызывает сам/у себя.`,
      "Invocation_(parent)": `<P1> вызывает <P2>.`
    },
    grouping: {
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> и <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, так же как и <P1...n>`,
      AND: `<T1...n-1> и <Tn>`,
      OR: `<T1...n-1> или <Tn>`,
      XOR: `<T1> xor <T2>`,
      "Stateful-Object": `<O> в состоянии <s>`,
      "Stateful-Object-value": `<O> со значением <s>`,
      "Stateful-Object-value(multiple)": `<O> со значениями <s1...n>`,
      "Stateful-Object-unidirectional": `состояние <s> <O>`,
      "Stateful-Object(multiple)": `<O> в состояниях <s1...n>`,
      "Attribute-Exhibitor": `<T> <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> и <change>.`
    },
    logic_operators: {
      XOR: {
        process: {
          Result: `<P> производит ровно один из <O_Os1...n>.`,
          "Result(brothers)": `<P> производит <O> в одном из состояний <s1...n>.`,
          Consumption: `<P> потребляет ровно один из <O_Os1...n>.`,
          "Consumption(brothers)": `<P> потребляет <O> в одном из состояний <s1...n>.`,
          Consumption_Condition: `<P> происходит, если ровно один из <O_Os1...n> существует, в этом случае <P> потребляет его, иначе <P> пропускается.`,
          "Consumption_Condition(brothers)": `<P> происходит, если <O> в одном из состояний <s1...n>, в этом случае <P> потребляет его, иначе <P> пропускается.`,
          Consumption_Event: `Ровно один из <O_Os1...n> активирует <P>, который/ая потребляет его.`,
          "Consumption_Event(brothers)": `<O> активирует <P> когда он в одном из состояний <s1...n>, который/ая потребляет его.`,
          Consumption_Negation: `<P> не потребляет ровно один из <O_Os1...n>.`,
          "Consumption_Negation(brothers)": `<P> не потребляет <O> в одном из состояний <s1...n>.`,
          Consumption_Condition_Negation: `<P> происходит, если ровно один из <O_Os1...n> не существует, в этом случае <P> потребляет существующий, иначе <P> пропускается.`,
          "Consumption_Condition_Negation(brothers)": `<P> происходит, если <O> ни в одном из состояний <s1...n>, в этом случае <P> потребляет его, иначе <P> пропускается.`,
          Effect: `<P> влияет на ровно на один <O_Os1...n>.`,
          "Effect(brothers)": `<P> влияет на <O> в одном из состояний <s1...n>.`,
          Effect_Condition: `<P> происходит, если ровно один из <O_Os1...n> существует, в этом случае <P> влияет на него, иначе <P> пропускается.`,
          "Effect_Condition(brothers)": `<P> происходит, если <O> в одном из состояний <s1...n>, в этом случае <P> влияет на него, иначе <P> пропускается.`,
          Effect_Event: `Ровно один из <O_Os1...n> активирует <P>, который/ая влияет на него.`,
          "Effect_Event(brothers)": `<O> активирует <P> когда он в одном из состояний <s1...n>, который/ая влияет на него.`,
          Effect_Negation: `<P> не влияет на ровно на один из <O_Os1...n>.`,
          "Effect_Negation(brothers)": `<P> не влияет на <O> в одном из состояний <s1...n>.`,
          Effect_Condition_Negation: `<P> происходит, если ровно один из <O_Os1...n> не существует, в этом случае <P> влияет на всех остальных, иначе <P> пропускается.`,
          "Effect_Condition_Negation(brothers)": `<P> происходит, если <O> ни в одном из состояний <s1...n>, в этом случае <P> влияет на всех остальных, иначе <P> пропускается.`,
          Agent: `Ровно один из <O_Os1...n> задействует <P>.`,
          "Agent(brothers)": `<O> задействует <P> когда он в одном из состояний <s1...n>.`,
          Agent_Event: `Ровно один из <O_Os1...n> активирует и обрабатывает <P>.`,
          "Agent_Event(brothers)": `<O> активирует и задействует <P> когда он в одном из состояний <s1...n>.`,
          Agent_Condition: `<P> происходит, если ровно один из <O_Os1...n> существует, иначе <P> пропускается.`,
          "Agent_Condition(brothers)": `<P> происходит, если <O> в одном из состояний <s1...n>, иначе <P> пропускается.`,
          Agent_Negation: `Ровно один из <O_Os1...n> не задействует <P>.`,
          "Agent_Negation(brothers)": `<O> не задействует <P> когда он в одном из состояний <s1...n>.`,
          Agent_Condition_Negation: `<P> происходит, если ровно один из <O_Os1...n> не существует, иначе <P> пропускается.`,
          "Agent_Condition_Negation(brothers)": `<P> происходит, если <O> ни в одном из состояний <s1...n>, иначе <P> пропускается.`,
          Instrument: `<P> требует ровно один из <O_Os1...n>.`,
          "Instrument(brothers)": `<P> требует <O> в одном из состояний <s1...n>.`,
          Instrument_Condition: `<P> происходит, если ровно один из <O_Os1...n> существует, иначе <P> пропускается.`,
          "Instrument_Condition(brothers)": `<P> происходит, если <O> в одном из состояний <s1...n>, иначе <P> пропускается.`,
          Instrument_Event: `Ровно один из <O_Os1...n> активирует <P>, который/ая это требует.`,
          "Instrument_Event(brothers)": `<O> активирует <P> когда он в одном из состояний <s1...n>, который/ая это требует.`,
          Instrument_Negation: `<P> не требует ровно один из <O_Os1...n>.`,
          "Instrument_Negation(brothers)": `<P> не требует <O> в одном из состояний <s1...n>.`,
          Instrument_Condition_Negation: `<P> происходит, если ровно один из <O_Os1...n> не существует, иначе <P> пропускается.`,
          "Instrument_Condition_Negation(brothers)": `<P> происходит, если <O> ни в одном из состояний <s1...n>, иначе <P> пропускается.`,
          Invocation_OUT: `<P> вызывает какой-либо <P1...n>.`,
          Invocation_IN: `Какой-либо <P1...n> вызывает <P>.`
        },
        object: {
          Result: `Ровно один из <P1...n> производит <O_Os>.`,
          Consumption: `Ровно один из <P1...n> потребляет <O_Os>`,
          Consumption_Event: `<O_Os> активирует ровно один из <P1...n>, который/ая заканчивает начатый процесс.`,
          Consumption_Condition_state: `Ровно один из <P1...n> происходит, если <O> в <s1>, в этом случае происходящий процесс потребляет <O>, иначе эти процессы пропускаются.`,
          Consumption_Condition: `Ровно один из <P1...n> происходит, если <O_Os> существует, в этом случае происходящий процесс потребляет <O_Os>, иначе эти процессы пропускаются.`,
          Consumption_Negation: `Ровно один из <P1...n> не потребляет <O_Os>`,
          Consumption_Condition_Negation_state: `Ровно один из <P1...n> происходит, если <O> не в состоянии <s1>, в этом случае тот процесс потребляет <O>, иначе все эти процессы пропускаются.`,
          Consumption_Condition_Negation: `Ровно один из <P1...n> происходит, если <O_Os> не существует, в этом случае тот процесс потребляет <O_Os>, иначе все эти процессы пропускаются.`,
          Effect: `Ровно один из <P1...n> влияет на <O_Os>.`,
          Effect_Event: `<O_Os> активирует ровно один из <P1...n>, который/ая влияет на происходящий процесс.`,
          Effect_Condition: `Ровно один из <P1...n> происходит, если <O_Os> существует, в этом случае происходящий процесс влияет на <O_Os>, иначе эти процессы пропускаются.`,
          Effect_Negation: `<P1...n> не влияют на ровно один из <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> происходит, если ровно один из <O_Os> не существует, в этом случае <P1...n> влияет на все остальные, иначе <P1...n> пропускаются.`,
          Agent: `<O_Os> обрабатывает ровно один из <P1...n>.`,
          Agent_Event: `<O_Os> активирует и задействует ровно один из <P1...n>.`,
          Agent_Condition: `<O_Os> обрабатывает ровно один из <P1...n> если <O_Os> существует, иначе эти процессы пропускаются.`,
          Agent_Condition_state: `<O> обрабатывает ровно один из <P1...n> если <O> в <s1>, иначе эти процессы пропускаются.`,
          Agent_Negation: `Ровно один из <P1...n> происходит, если <O_Os> не существует.`,
          Agent_Condition_Negation: `Ровно один из <P1...n> происходит, если <O_Os> не существуют, иначе все эти процессы пропускаются.`,
          Agent_Condition_Negation_state: `Ровно один из <P1...n> происходит, если <O> не в состоянии <s1>, иначе все эти процессы пропускаются.`,
          Instrument: `Ровно один из <P1...n> требует <O_Os>.`,
          Instrument_Event: `<O_Os> активирует ровно один из <P1...n>, который/ая требует <O_Os>.`,
          Instrument_Condition: `Ровно один из <P1...n> требует <O_Os>, иначе эти процессы пропускаются.`,
          Instrument_Condition_state: `Ровно один из <P1...n> требует чтобы <O> в <s1>, иначе эти процессы пропускаются.`,
          Instrument_Negation: `Ровно один из <P1...n> происходит, если <O_Os> не существует.`,
          Instrument_Condition_Negation: `Ровно один из <P1...n> происходит, если <O_Os> не существует, иначе все эти процессы пропускаются.`,
          Instrument_Condition_Negation_state: `Ровно один из <P1...n> происходит, если <O> не в состоянии <s1>, иначе все эти процессы пропускаются.`
        }
      },
      OR: {
        process: {
          Result: `<P> производит по меньшей мере один из <O_Os1...n>.`,
          Consumption: `<P> потребляет по меньшей мере один из <O_Os1...n>.`,
          Consumption_Condition: `<P> происходит, если по меньшей мере один из <O_Os1...n> существует, в этом случае <P> потребляет существующие, иначе <P> пропускается.`,
          Consumption_Event: `По меньшей мере один из <O_Os1...n> активирует <P>, который/ая потребляет его.`,
          Consumption_Negation: `<P> не потребляет по меньшей мере один из <O_Os1...n>.`,
          Consumption_Condition_Negation: `<P> происходит, если по меньшей мере один из <O_Os1...n> не существует, в этом случае <P> потребляет существующие, иначе <P> пропускается.`,
          Effect: `<P> влияет на по меньшей мере на один из <O_Os1...n>.`,
          Effect_Condition: `<P> происходит, если по меньшей мере один из <O_Os1...n> существует, в этом случае <P> влияет на него, иначе <P> пропускается.`,
          Effect_Event: `По меньшей мере один из <O_Os1...n> активирует <P>, который/ая влияет на него.`,
          Effect_Negation: `<P> не влияет на по меньшей мере на один из <O_Os1...n>.`,
          "Effect_Negation(brothers)": `<P> не влияет на <O> по меньшей мере в одном из состояний <s1...n>.`,
          Effect_Condition_Negation: `<P> происходит, если по меньшей мере один из <O_Os1...n> не существует, в этом случае <P> влияет на всех других, иначе <P> пропускается.`,
          "Effect_Condition_Negation(brothers)": `<P> происходит, если <O> в по меньшей мере ни в одном из состояний <s1...n>, в этом случае <P> влияет на всех других, иначе <P> пропускается.`,
          Agent: `По меньшей мере один из <O_Os1...n> обрабатывает <P>.`,
          Agent_Event: `По меньшей мере один из <O_Os1...n> активирует и обрабатывает <P>.`,
          Agent_Condition: `<P> происходит, если по меньшей мере один из <O_Os1...n> существует, иначе <P> пропускается.`,
          Agent_Negation: `По меньшей мере один из <O_Os1...n> не обрабатывает <P>.`,
          Agent_Condition_Negation: `<P> происходит, если по меньшей мере один из <O_Os1...n> не существует, иначе <P> пропускается.`,
          Instrument: `<P> требует по меньшей мере один из <O_Os1...n>.`,
          Instrument_Condition: `<P> происходит, если по меньшей мере один из <O_Os1...n> существует, иначе <P> пропускается.`,
          Instrument_Event: `По меньшей мере один из <O_Os1...n> активирует <P>, который/ая требует этого.`,
          Instrument_Negation: `<P> не требует по меньшей мере один из <O_Os1...n>.`,
          Instrument_Condition_Negation: `<P> происходит, если по меньшей мере один из <O_Os1...n> не существует, иначе <P> iпропускается.`,
          Invocation_OUT: `<P> запускает по меньшей мере один из <P1...n>.`,
          Invocation_IN: `По меньшей мере один из <P1...n> запускает <P>.`
        },
        object: {
          Result: `По меньшей мере один из <P1...n> производит <O_Os>`,
          Consumption: `По меньшей мере один из <P1...n> потребляет <O_Os>`,
          Consumption_Event: `<O_Os> активирует по меньшей мере один из <P1...n>, который/ая потребляет инициируемый процесс.`,
          Consumption_Condition_state: `По меньшей мере один из <P1...n> происходит, если <O> is <s1>, в этом случае текущий процесс потребляет <O>, иначе эти процессы пропускаются.`,
          Consumption_Condition: `По меньшей мере один из <P1...n> происходит, если <O_Os> существует, в этом случае текущий процесс потребляет <O_Os>, иначе эти процессы пропускаются.`,
          Consumption_Negation: `По меньшей мере один из <P1...n> не потребляет <O_Os>`,
          Consumption_Condition_Negation_state: `По меньшей мере один из <P1...n> происходит, если <O> не в состоянии <s1>, в этом случае тот процесс потребляет <O>, иначе все эти процессы пропускаются.`,
          Consumption_Condition_Negation: `По меньшей мере один из <P1...n> происходит, если <O_Os> не существует, в этом случае тот процесс потребляет <O_Os>, иначе все эти процессы пропускаются.`,
          Effect: `По меньшей мере один из <P1...n> влияет на <O_Os>`,
          Effect_Event: `<O_Os> активирует по меньшей мере один из <P1...n>, который/ая влияет на происходящий процесс.`,
          Effect_Condition: `По меньшей мере один из <P1...n> происходит, если <O_Os> существует, в этом случае происходящий процесс влияет на <O_Os>, иначе эти процессы пропускаются.`,
          Effect_Negation: `<P1...n> не влияет на по ме мере один из <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> происходит, если один из <O_Os> не существует, в этом случае <P1...n> aвлияет на все другие, иначе <P1...n> пропускаются.`,
          Agent: `<O_Os> задействует по меньшей мере один из <P1...n>.`,
          Agent_Event: `<O_Os> активирует и задействует по меньшей мере один из <P1...n>.`,
          Agent_Condition: `<O_Os> задействует по меньшей мере один из <P1...n> если <O_Os> существует, иначе эти процессы пропускаются.`,
          Agent_Condition_state: `<O> задействует по меньшей мере один из <P1...n> если <O> в <s1>, иначе эти процессы пропускаются.`,
          Agent_Negation: `По меньшей мере один из <P1...n> происходит, если <O_Os> не представлен.`,
          Agent_Condition_Negation: `По меньшей мере один из <P1...n> происходит, если <O_Os> не представлен, иначе все эти процессы пропускаются.`,
          Agent_Condition_Negation_state: `По меньшей мере один из <P1...n> происходит, если <O> не в состоянии <s1>, иначе все эти процессы пропускаются.`,
          Instrument: `По меньшей мере один из <P1...n> требуется <O_Os>`,
          Instrument_Event: `<O_Os> активирует at least one of <P1...n>, который/ая требуется <O_Os>`,
          Instrument_Condition: `По меньшей мере один из <P1...n> требуется <O_Os>, иначе эти процессы пропускаются.`,
          Instrument_Condition_state: `По меньшей мере один из <P1...n> требует, чтобы <O> is <s1>, иначе эти процессы пропускаются.`,
          Instrument_Negation: `По меньшей мере один из <P1...n> происходит, если <O_Os> не существует.`,
          Instrument_Condition_Negation: `По меньшей мере один из <P1...n> происходит, если <O_Os> не существует, иначе все эти процессы пропускаются.`,
          Instrument_Condition_Negation_state: `По меньшей мере один из <P1...n> происходит, если <O> не в состоянии <s1>, иначе все эти процессы пропускаются.`
        }
      },
      NOT: {
        process: {
          Agent_Negation: `<O_Os1...n> не задействует <P>.`,
          Agent_Condition_Negation: `<P> происходит, если <O_Os1...n> не существует, иначе <P> пропускается.`,
          Instrument_Negation: `<P> не требует <O_Os1...n>.`,
          Instrument_Condition_Negation: `<P> происходит, если <O_Os1...n> не существует, иначе <P> пропускается.`,
          Consumption_Negation: `<P> не потребляет <O_Os1...n>.`,
          Consumption_Condition_Negation: `<P> происходит, если <O_Os1...n> не существует, в этом случае <P> потребляет существующие, иначе <P> пропускается.`,
          Effect_Negation: `<P> не влияет на <O_Os1...n>.`,
          Effect_Condition_Negation: `<P> происходит, если <O_Os1...n> не существует, в этом случае <P> влияет на все остальные, иначе <P> пропускается.`
        },
        object: {
          Agent_Negation: `<P1...n> происходит, если <O_Os> не существует.`,
          Agent_Condition_Negation: `<P1...n> происходит, если <O_Os> не существует, иначе все эти процессы пропускаются.`,
          Agent_Condition_Negation_state: `<P1...n> происходит, если <O> не в состоянии <s1>, иначе все эти процессы пропускаются.`,
          Instrument_Negation: `<P1...n> происходит, если <O_Os> не существует.`,
          Instrument_Condition_Negation: `<P1...n> происходит, если <O_Os> не существует, иначе все эти процессы пропускаются.`,
          Instrument_Condition_Negation_state: `<P1...n> происходит, если <O> не в состоянии <s1>, иначе все эти процессы пропускаются.`,
          Consumption_Negation: `<P1...n> не потребляет <O_Os>`,
          Consumption_Condition_Negation_state: `<P1...n> происходит, если <O> не в состоянии <s1>, в этом случае тот процесс потребляет <O>, иначе все эти процессы пропускаются.`,
          Consumption_Condition_Negation: `<P1...n> происходит, если <O_Os> не существует, в этом случае тот процесс потребляет <O_Os>, иначе все эти процессы пропускаются.`,
          Effect_Negation: `<P1...n> не имеют эффекта на <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> происходит, если <O_Os> не существует, в этом случае <P1...n> влияет на всех других, иначе <P1...n> пропускаются.`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; где <tag>`,
      probability: `<O_Os> с вероятностью <tag>`,
      rate: `<O_Os> в темпе <tag>`,
      path: `По пути <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `опциональный/ая`,
      "*": `опционально`,
      "+": `по меньшей мере один`,
      "n..n": `<n1> до <n2>`,
      "n..*": `<n1> до много`,
      "n..mean..n": `<n1> до <n2>, со среднем значением <mean>`
    },
    ranges: {
      "<=": `менее чем или равен`,
      ">=": `более чем или равен`,
      "=": `равен`,
      "<>": `не равен`,
      "<": `менее чем`,
      ">": `более чем`
    },
    object: {
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O> является <a>.`,
      default_affiliation: `<O> является <e>.`,
      non_default: `<O> является <e> и <a>.`,
      singleInzoom: `<O> из <SD_Parent> зуммирует <Current_SD> в <T_list>.`,
      multiInzoom: `<O> из <SD_Parent> зуммирует <Current_SD> в <O_list>, так же как и <P_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      object_list_sequence: `<O1...n>, в этой вертикальной последовательности`,
      object_list_parallel: `<O1...n>, в этой горизонтальной последовательности`
    },
    process: {
      default_essence_affiliation: ``,
      default_essence: `<P> является <a>.`,
      default_affiliation: `<P> является <e>.`,
      non_default: `<P> является <e> и <a>.`,
      singleInzoom: `<P> из <SD_Parent> зуммирует <Current_SD> в <T_list>, который/ая происходит в этой временной последовательности.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<P> из <SD_Parent> зуммирует <Current_SD> в <P_list>, так же как и <O_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      process_list_parallel: `параллельно <P1...n>`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `Ожидаемая продолжительность <P> будет <exp> <units>.`,
      min_duration: `Минимальная продолжительность <P> будет <min> <units>.`,
      max_duration: `Максимальная продолжительность <P> будет <max> <units>.`,
      min_max_range_duration: `Минимальная и максимальная продолжительность <P> будут <min> <units> и <max> <units>, соответственно.`,
      min_exp_range_duration: `Минимальная и ожидаемая продолжительности <P> будут <min> <units> и <exp> <units>, соответственно.`,
      exp_max_range_duration: `Ожидаемая и максимальная продолжительности <P> будут <exp> <units> и <max> <units>, соответственно.`,
      expected_range_duration: `Минимальная, ожидаемая, и максимальная продолжительности <P> будут <min> <units>, <exp> <units>, и <max> <units>, соответственно.`,
      default_time_units: `секунды`
    },
    state: {
      single_state: `<O> является <s>.`,
      multiple_states: `<O> может быть <s1...n>.`,
      all_states_are_suppressed: `<O> is stateful.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> is <s> and can be at one of <num> other states.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> can be <s1...n> or at one of <num> other states.`,
      default: `Состояние <s> по умолчанию.`,
      default_initial: `Состояние <s> по умолчанию и начальное.`,
      initial: `Состояние <s> начальное.`,
      final: `Состояние <s> конечное.`,
      default_initial_final: `Состояние <s> начальное, конечное, и по умолчанию.`,
      initial_final: `Состояние <s> начальное и конечное.`,
      default_final: `Состояние <s> начальное и по умолчанию.`,
      none: ``,
      Current: `<O> находится в состоянии <s>.`,
      expected_duration: `Ожидаемая продолжительность <s> будет <exp> <units>.`,
      min_duration: `Минимальная продолжительность <s> будет <min> <units>.`,
      max_duration: `Максимальная продолжительность <s> будет <max> <units>.`,
      min_max_range_duration: `Минимальная и максимальная продолжительности <s> будут <min> <units> и <max> <units>, соответственно.`,
      min_exp_range_duration: `Минимальная и ожидаемая продолжительности <s> будут <min> <units> и <exp> <units>, соответственно.`,
      exp_max_range_duration: `Ожидаемая и максимальная продолжительности <s> будут <exp> <units> и <max> <units>, соответственно.`,
      expected_range_duration: `Минимальная, ожидаемая, и максимальная продолжительности <s> будут <min> <units>, <exp> <units>, и <max> <units>, соответственно.`,
      default_time_units: `секунды`
    },
    essence: {
      physical: `физическим/ой`,
      informatical: `информативным/ой`
    },
    affiliation: {
      systemic: `системным/ой`,
      environmental: `внешним/ей`
    },
    semifolding: {
      object: `<O> перечисляет `,
      process: `<P> перечисляет `,
      general: {
        object: `<O> из <SD> полусложен/а в <HighestSD>`,
        process: `<P> из <SD> полусложен/а в <HighestSD>`
      },
      aggregation: {
        single: `<T> как часть`,
        multiple: `<T1...n-1> и <Tn> как части`
      },
      exhibition: {
        single: `<T> как характеристика`,
        multiple: `<T1...n-1> и <Tn> как характеристики`
      },
      generalization: {
        single: `<T> как специализация`,
        multiple: `<T1...n-1> и <Tn> как специализации`
      },
      instantiation: {
        single: `<T> как экземпляр`,
        multiple: `<T1...n-1> и <Tn> экземпляры`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> of <owner> is <value>.`
    },
    father_model_to_sub_model: `The selected things, <o1...n>, and <p1...n> are refined in sub model <subsystem_name> subsystem model view.`,
    sub_model_from_father_model: `The <subsystem_name> subsystem model view is derived from the <father_model_name> model.`
  };
  const oplTemplates_portuguese = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> consiste de <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> consiste de <T2> e <num> outras partes.`,
      "Aggregation-Participation_(multiple)": `<T1> consiste de <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consiste de <T2...n> e <num> outras partes.`,
      "Generalization-Specialization": `<T2> é um(a) <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> e <num> outras especializações são <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> são <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> e <num> outras especializações são <T1>.`,
      "Classification-Instantiation": `<T2> é uma instância de <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> e <num> outras instâncias são instâncias de <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> são instâncias de <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> e <num> outras instâncias são instâncias de <T1>.`,
      "Exhibition-Characterization": `<T1> exibe <T2>.`,
      "Exhibition-Characterization_incomplete": `<T1> exibe <T2> e <num> outras características.`,
      "Exhibition-Characterization_(multiple)": `<T1> exibe <T2...n>.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exibe <T2...n> e <num> outras características.`,
      Unidirectional_Tagged_Link: `<T1> relaciona-se com <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> e <T2> são equivalentes.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> e <T2> são <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, e <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> realiza o processo de <P>.`,
      "Agent_(multiple)": `<O\Os1...n> realizam o processo de <P>.`,
      Agent_Condition: `<P> ocorre se existir <O>, caso contrário o processo de <P> é ignorado.`,
      "Agent_Condition(multiple)": `<P> ocorre se <O\Os1...n> existirem, caso contrário o processo de <P> é ignorado.`,
      Agent_Condition_state: `<P> ocorre se <O> for/estiver <s>, caso contrário o processo de <P> é ignorado.`,
      Agent_Event: `<O> desencadeia e realiza o processo de <P>.`,
      "Agent_Event(multiple)": `<O\Os1...n> desencadeiam e realizam o processo de <P>.`,
      Agent_Event_state: `<O> <s> desencadeia e realiza o processo de <P>.`,
      Agent_Negation: `<P> ocorre se <O_Os> não estiver presente.`,
      "Agent_Negation_(multiple)": `<P> ocorre se <O\Os1...n> não estiverem presentes.`,
      Agent_Condition_Negation: `<P> ocorre se não existir <O>, caso contrário o processo de <P> é ignorado.`,
      "Agent_Condition_Negation(multiple)": `<P> ocorre se <O\Os1...n> não existirem, caso contrário o processo de <P> é ignorado.`,
      Agent_Condition_Negation_state: `<P> ocorre se <O> não for/estiver <s>, caso contrário o processo de <P> é ignorado.`,
      Instrument: `<P> requer <O_Os>.`,
      "Instrument_(multiple)": `<P> requer <O\Os1...n>.`,
      Instrument_Condition: `<P> ocorre se existir <O>, caso contrário o processo de <P> é ignorado.`,
      "Instrument_Condition(multiple)": `<P> ocorre se <O\Os1...n> existirem, caso contrário o processo de <P> é ignorado.`,
      Instrument_Condition_state: `<P> ocorre se <O> for/estiver <s>, caso contrário o processo de <P> é ignorado.`,
      Instrument_Event: `<O> desencadeia o processo de <P>, o qual requer o(a) <O>.`,
      "Instrument_Event(multiple)": `<O\Os1...n> desencadeiam o processo de <P>, o qual os(as) requer.`,
      Instrument_Event_state: `<O> <s> desencadeira o processo de <P>, o qual requer o(a) <O> <s>.`,
      Instrument_Negation: `<P> ocorre se não existir <O_Os>.`,
      "Instrument_Negation_(multiple)": `<P> ocorre se <O\Os1...n> não existirem.`,
      Instrument_Condition_Negation: `<P> ocorre se não existir <O>, caso contrário o processo de <P> é ignorado.`,
      "Instrument_Condition_Negation(multiple)": `<P> ocorre se <O\Os1...n> não existirem, caso contrário o processo de <P> é ignorado.`,
      Instrument_Condition_Negation_state: `<P> ocorre se <O> não for/estiver <s>, caso contrário o processo de <P> é ignorado.`,
      Effect: `<P> afeta <O_Os>.`,
      "Effect_(multiple)": `<P> afeta <O\Os1...n>.`,
      Effect_Condition: `<P> ocorre se existir <O>, condição na qual o processo de <P> afeta o(a) <O>, caso contrário o processo é ignorado.`,
      "Effect_Condition(multiple)": `<P> ocorre se <O\Os1...n> existirem, condição na qual o processo de <P> os(as) afeta, caso contrário o processo é ignorado.`,
      Effect_Condition_state: `<P> ocorre se <O> for/estiver <s>, condição na qual o processo de <P> afeta o(a) <O> <s>, caso contrário o processo é ignorado.`,
      Effect_Event: `<O> desencadeia o processo de <P>, o qual afeta o(a) <O>`,
      "Effect_Event(multiple)": `<O\Os1...n> desencadeiam o processo de <P>, o qual afeta o(a) <O>.`,
      Effect_Event_state: `<O> <s> desencadeia o processo de <P>, o qual afeta o(a) <O> <s>`,
      Effect_Negation: `<P> não afeta <O_Os>.`,
      "Effect_Negation_(multiple)": `<P> não afeta <O\Os1...n>.`,
      Effect_Condition_Negation: `<P> ocorre se não existir <O>, condição na qual o processo de <P> afeta o(a) <O>, caso contrário o processo é ignorado.`,
      "Effect_Condition_Negation(multiple)": `<P> ocorre se <O\Os1...n> não existirem, condição na qual o processo de <P> os(as) afeta, caso contrário o processo é ignorado.`,
      Effect_Condition_Negation_state: `<P> ocorre se <O> não for/estiver <s>, condição na qual o processo de <P> afeta o(a) <O> <s>, caso contrário o processo é ignorado.`,
      Consumption: `<P> consome <O_Os>.`,
      "Consumption_(multiple)": `<P> consome <O\Os1...n>.`,
      Consumption_Condition: `<P> ocorre se existir <O>, condição na qual o processo de <P> consome o(a) <O>, caso contrário o processo é ignorado.`,
      "Consumption_Condition(multiple)": `<P> ocorre se <O\Os1...n> existirem, condição na qual o processo de <P> os(as) consome, caso contrário o processo é ignorado.`,
      Consumption_Condition_state: `<P> ocorre se <O> for/estiver <s>, condição na qual o processo de <P> consome o(a) <O> <s>, caso contrário o processo é ignorado.`,
      Consumption_Event: `<O> desencadeira o processo de <P>, o qual consome o(a) <O>.`,
      "Consumption_Event(multiple)": `<O\Os1...n> desencadeiam o processo de <P>, o qual os(as) consome.`,
      Consumption_Event_state: `<O> <s> desencadeia o processo de <P>, o qual consome o(a) <O>.`,
      Consumption_Negation: `<P> não consome <O_Os>.`,
      "Consumption_Negation_(multiple)": `<P> não consome <O\Os1...n>.`,
      Consumption_Condition_Negation: `<P> ocorre se não existir <O>, condição na qual o processo de <P> consome o(a) <O>, caso contrário o processo é ignorado.`,
      "Consumption_Condition_Negation(multiple)": `<P> ocorre se <O\Os1...n> não existirem, condição na qual o processo de <P> os(as) consome, caso contrário o processo é ignorado.`,
      Consumption_Condition_Negation_state: `<P> ocorre se <O> não for/estiver <s>, condição na qual o processo de <P> consome o(a) <O> <s>, caso contrário o processo é ignorado.`,
      Result: `<P> produz <O_Os>.`,
      "Result_(multiple)": `<P> produz <O\Os1...n>.`,
      "In-out_Link_Pair": `<P> altera o(a) <O> de <s1> para <s2>.`,
      "In-out(group)": `<O> de <s1> para <s2>`,
      "In-out_Link_Pair(group)": `<P> altera o(a) <O> de <s1> para <s2><Other_changes>.`,
      // 'Split_input': `<P> altera o(a) <O> de <s> para qualquer outro estado.`, // not used anymore
      // 'Split_output': `<P> altera o(a) <O> para <s> a partir de qualquer outro estado.`,// not used anymore
      Split: `qualquer outro estado`,
      Condition_Input: `<P> ocorre se <O> for/estiver <s1>, condição na qual o processo de <P> altera o(a) <O> de <s1> para <s2>, caso contrário o processo é ignorado.`,
      "In-out_Link_Pair_Condition": `<P> ocorre se <O> for/estiver <s1>, condição na qual o processo de <P> altera o(a) <O> de <s1> para <s2>, caso contrário o processo é ignorado.`,
      "In-out_Link_Pair_Condition(group)": `<P> ocorre se <O> for/estiver <s1>, condição na qual o processo de <P> altera o(a) <O> de <s1> para <s2>, caso contrário o processo é ignorado.`,
      "In-out_Link_Pair_Event": `<O> <s1> desencadeia o processo de <P>, o qual altera o(a) <O> de <s1> para <s2>.`,
      "In-out_Link_Pair_Event(group)": `<O> <s1> desencadeia o processo de <P>, o qual altera o(a) <O> de <s1> para <s2>.`,
      Overtime_exception: `<O> desencadeia o processo de <P> quando o(a) <O> for/estiver <s> por mais de <maxtime> <units>.`,
      Undertime_exception: `<O> desencadeia o processo de <P> quando o(a) <O> for/estiver <s> por menos de <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> desencadeia o processo de <P> quando o(a) <O> for/estiver <s> por mais de <maxtime> <units> e menos do que <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> ocorre se o processo de <P1> durar mais do que <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> ocorre se o processo de processo <P1> durar menos do que <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> ocorre se o processo de <P1> durar menos do que <mintime> <units> ou durar mais do que <maxtime> <units>.`,
      Invocation: `<P1> invoca o processo de <P2>.`,
      "Invocation_(multiple)": `<P1> invoca os processos de <P2...n>.`,
      "Invocation_(self)": `<P1> invoca a si mesmo.`,
      "Invocation_(parent)": `<P1> invoca o processo de <P2>.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> e <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, bem como <P1...n>`,
      AND: `<T1...n-1> e <Tn>`,
      OR: `<T1...n-1> ou <Tn>`,
      XOR: `<T1> ou exclusivamente <T2>`,
      "Stateful-Object": `<O> <s>`,
      "Stateful-Object-value": `<O> com o valor <s>`,
      "Stateful-Object-value(multiple)": `<O> com valores <s1...n>`,
      "Stateful-Object-unidirectional": `estado <s> de <O>`,
      "Stateful-Object(multiple)": `<O> nos estados <s1...n>`,
      "Attribute-Exhibitor": `<T> de <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> e <change>.`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object.
      XOR: {
        process: {
          Result: "<P> produz exatamente um(a) dentre <O_Os1...n>.",
          "Result(brothers)": "<P> produz <O> <s1...n>.",
          Consumption: `<P> consome exatamente um(a) dentre <O_Os1...n>.`,
          "Consumption(brothers)": `<P> consome <O> <s1...n>.`,
          Consumption_Condition: `<P> ocorre se existir exatamente um(a) dentre <O_Os1...n> , condição na qual o processo de <P> o(a) consome, caso contrário o processo é ignorado.`,
          "Consumption_Condition(brothers)": `<P> ocorre se <O> for/estiver <s1...n>, condição na qual o processo de <P> o(a) consome, caso contrário o processo é ignorado.`,
          Consumption_Event: `Exatamente um(a) dentre <O_Os1...n> desencadeia o processo de <P>, o qual o(a) consome.`,
          "Consumption_Event(brothers)": `<O> desencadeia o processo de <P> quando estiver <s1...n>, processo o qual o(a) consome.`,
          Consumption_Negation: `<P> não consome exatamente um(a) dentre <O_Os1...n>.`,
          "Consumption_Negation(brothers)": `<P> não consome <O> <s1...n>.`,
          Consumption_Condition_Negation: `<P> ocorre se exatamente um(a) dentre <O_Os1...n> não existir, condição na qualo processo de <P> consome os(as) que existem, caso contrário o processo é ignorado.`,
          "Consumption_Condition_Negation(brothers)": `<P> ocorre se <O> não for/estiver <s1...n>, condição na qual o processo de <P> o(a) consome, caso contrário o processo é ignorado.`,
          Effect: `<P> afeta exatamente um(a) dentre <O_Os1...n>.`,
          "Effect(brothers)": `<P> afeta <O> <s1...n>.`,
          Effect_Condition: `<P> ocorre se existir exatamente um(a) dentre <O_Os1...n>, condição na qual o processo de <P> o(a) afeta, caso contrário o processo é ignorado.`,
          "Effect_Condition(brothers)": `<P> ocorre se <O> for/estiver <s1...n>, condição na qual o processo de <P> o(a) afeta, caso contrário o processo é ignorado.`,
          Effect_Event: `Exatamente um(a) dentre <O_Os1...n> desencadeia o processo de <P>, o qual o(a) afeta.`,
          "Effect_Event(brothers)": `<O> desencadeia o processo de <P> quando for/estiver <s1...n>, processo o qual o(a) afeta.`,
          Effect_Negation: `<P> não tem efeito em exatamente um(a) dentre <O_Os1...n>.`,
          "Effect_Negation(brothers)": `<P> não tem efeito no(a) <O> <s1...n>.`,
          Effect_Condition_Negation: `<P> ocorre se exatamente um(a) dentre <O_Os1...n> não existir, condição na qual o processo de <P> afeta todos(as) os(as) demais, caso contrário o processo é ignorado.`,
          "Effect_Condition_Negation(brothers)": `<P> ocorre se <O> não for/estiver <s1...n>, condição na qual o processo de <P> afeta todos os demais estados, caso contrário o processo é ignorado.`,
          Agent: `Exatamente um(a) dentre <O_Os1...n> realiza o processo de <P>.`,
          "Agent(brothers)": `<O> realiza o processo de <P> quando for/estiver <s1...n>.`,
          Agent_Event: `Exatamente um(a) dentre <O_Os1...n> desencadeia e realiza o processo de <P>.`,
          "Agent_Event(brothers)": `<O> desencadeia e realiza o processo de <P> quando for/estiver <s1...n>.`,
          Agent_Condition: `<P> ocorre se existir exatamente um(a) dentre <O_Os1...n>, caso contrário o processo de <P> é ignorado.`,
          "Agent_Condition(brothers)": `<P> ocorre se <O> for/estiver <s1...n>, caso contrário o processo de <P> é ignorado.`,
          Agent_Negation: `Exatamente um(a) dentre <O_Os1...n> não realiza o processo de <P>.`,
          "Agent_Negation(brothers)": `<O> não realiza o processo de <P> quando for/estiver <s1...n>.`,
          Agent_Condition_Negation: `<P> ocorre se exatamente um(a) dentre <O_Os1...n> não existir, caso contrário o processo de <P> é ignorado.`,
          "Agent_Condition_Negation(brothers)": `<P> ocorre se <O> não for/estiver <s1...n>, caso contrário o processo de <P> é ignorado.`,
          Instrument: `<P> requer exatamente um(a) dentre <O_Os1...n>.`,
          "Instrument(brothers)": `<P> requer <O> <s1...n>.`,
          Instrument_Condition: `<P> ocorre se existir exatamente um(a) dentre <O_Os1...n>, caso contrário o processo de <P> é ignorado.`,
          "Instrument_Condition(brothers)": `<P> ocorre se <O> for/estiver <s1...n>, caso contrário o processo de <P> é ignorado.`,
          Instrument_Event: `Exatamente um(a) dentre <O_Os1...n> desencadeia o processo de <P>, o qual o(a) requer.`,
          "Instrument_Event(brothers)": `<O> desencadeia o processo de <P> quando for/estiver <s1...n>, processo o qual o(a) requer.`,
          Instrument_Negation: `<P> não requer exatamente um(a) dentre <O_Os1...n>.`,
          "Instrument_Negation(brothers)": `<P> não requer <O> <s1...n>.`,
          Instrument_Condition_Negation: `<P> ocorre se exatamente um(a) dentre <O_Os1...n> não existir, caso contrário o processo de <P> é ignorado.`,
          "Instrument_Condition_Negation(brothers)": `<P> ocorre se <O> não for/estiver <s1...n>, caso contrário o processo de <P> é ignorado.`,
          Invocation_OUT: `<P> invoca um processo qualquer dentre <P1...n>.`,
          Invocation_IN: `Um processo qualquer dentre <P1...n> inovca o processo de <P>.`,
          InOut: `<P> altera o(a) <O> de <s1> para exatamente um dentre <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> altera o(a) <O> de exatamente um(a) dentre <ins1..n> para exatamente um(a) dentre <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> altera o(a) <O> de exatamente um(a) dentre <ins1..n> se <s1>.`
        },
        object: {
          Result: `Exatamente um processo dentre <P1...n> produz <O_Os>.`,
          Consumption: `Exatamente um processo dentre <P1...n> consome <O_Os>`,
          Consumption_Event: `<O_Os> desencadeia exatamente um processo dentre <P1...n>, o qual consome o(a) <O_Os>.`,
          Consumption_Condition_state: `Exatamente um processo dentre <P1...n> ocorre se <O> for/estiver <s1>, condição na qual o processo ocorrente consome o(a) <O>, caso contrário estes processos são ignorados.`,
          Consumption_Condition: `Exatamente um processso dentre <P1...n> ocorre se existir <O_Os>, condição na qual o processo ocorrente consome o(a) <O_Os>, caso contrário estes processos são ignorados.`,
          Consumption_Negation: `Exatamente um processo dentre <P1...n> não consome <O_Os>`,
          Consumption_Condition_Negation_state: `Exatamente um processo dentre <P1...n> ocorre se <O> não estiver no estado <s1>, condição na qual este processo consome o(a) <O>, caso contrário todos estes processos são ignorados.`,
          Consumption_Condition_Negation: `Exatamente um processo dentre <P1...n> ocorre se <O_Os> não existir, condição na qual este processo consome o(a) <O_Os>, caso contrário todos estes processos são ignorados.`,
          Effect: `Exatamente um processo dentre <P1...n> afeta <O_Os>.`,
          Effect_Event: `<O_Os> desencadeia exatamente um processo dentre <P1...n>, o qual afeta o(a) <O_Os>.`,
          Effect_Condition: `Exatamente um processo dentre <P1...n> ocorre se existir <O_Os>, condição na qual o processo ocorrente afeta o(a) <O_Os>, caso contrário estes processos são ignorados.`,
          Effect_Negation: `<P1...n> não afetam exatamente um(a) dentre <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> ocorrem se exatamente um(a) dentre <O_Os> não existir, condição na qual <P1...n> afetam todos os demais, caso contrário os processos são ignorados.`,
          Agent: `<O_Os> realiza exatamente um processo dentre <P1...n>.`,
          Agent_Event: `<O_Os> desencadeia e realiza exatamente um processo dentre <P1...n>.`,
          Agent_Condition: `<O_Os> realiza exatamente um processo dentre <P1...n> se existir <O_Os>, caso contrário estes processos são ignorados.`,
          Agent_Condition_state: `<O> realiza exatamente um processo dentre <P1...n> se <O> for/estiver <s1>, caso contrários estes processos são ignorados.`,
          Agent_Negation: `Exatamente um processo dentre <P1...n> ocorre se <O_Os> não estiver presente.`,
          Agent_Condition_Negation: `Exatamente um processo dentre <P1...n> ocorre se <O_Os> não estiver presente, caso contrário todos estes processos são ignorados.`,
          Agent_Condition_Negation_state: `Exatamente um processo dentre <P1...n> ocorre se <O> não estiver no estado <s1>, caso contrário todos estes processos são ignorados.`,
          Instrument: `Exatamente um processo dentre <P1...n> requer <O_Os>.`,
          Instrument_Event: `<O_Os> desencadeia exatamente um processo dentre <P1...n>, o qual requer o(a) <O_Os>.`,
          Instrument_Condition: `Exatamente um processo dentre <P1...n> requer <O_Os>, caso contrário estes processos são ignorados.`,
          Instrument_Condition_state: `Exatamente um processo dentre <P1...n> requer que <O> seja/esteja <s1>, caso contrário estes processos são ignorados.`,
          Instrument_Negation: `Exatamente um processo dentre <P1...n> ocorre se <O_Os> não existir.`,
          Instrument_Condition_Negation: `Exatamente um processo dentre <P1...n> ocorre se <O_Os> não existir, caso contrário todos estes processos são ignorados.`,
          Instrument_Condition_Negation_state: `Exatamente um processo dentre <P1...n> ocorre se <O> não for/estiver <s1>, caso contrário todos estes processos são ignorados.`
        }
      },
      OR: {
        process: {
          Result: "<P> produz ao menos um(a) dentre <O_Os1...n>.",
          Consumption: `<P> consome ao menos um(a) dentre <O_Os1...n>.`,
          Consumption_Condition: `<P> ocorre se existir ao menos um(a) dentre <O_Os1...n>, condição na qual o processo de <P> consome aqueles(as) que existirem, caso contrário o processo é ignorado.`,
          Consumption_Event: `Ao menos um(a) dentre <O_Os1...n> desencadeia o processo de <P>, o qual o(a) consome.`,
          Consumption_Negation: `<P> não consome ao menos um(a) dentre <O_Os1...n>.`,
          Consumption_Condition_Negation: `<P> ocorre se ao menos um(a) dentre <O_Os1...n> não existir, condição na qual o processo de <P> consome aqueles(as) que existirem, caso contrário o processo é ignorado.`,
          Effect: `<P> afeta ao menos um(a) dentre <O_Os1...n>.`,
          Effect_Condition: `<P> ocorre se existir ao menos um(a) dentre <O_Os1...n>, condição na qual o processo de <P> o(a) afeta, caso contrário o processo é ignorado.`,
          Effect_Event: `Ao menos um(a) dentre <O_Os1...n> desencadeia o processo de <P>, o qual o(a) afeta.`,
          Effect_Negation: `<P> não afeta ao menos um(a) dentre <O_Os1...n>.`,
          "Effect_Negation(brothers)": `<P> não afeta <O> que for/estiver <s1...n>.`,
          Effect_Condition_Negation: `<P> ocorre se ao menos um(a) dentre <O_Os1...n> não existir, condição na qual o processo de <P> afeta todos(as) os(as) demais, caso contrário o processo é ignorado.`,
          "Effect_Condition_Negation(brothers)": `<P> ocorre se <O> não for/estiver <s1...n>, condição na qual o processo de <P> afeta todos os demais estados, caso contrário o processo é ignorado.`,
          Agent: `Ao menos um(a) dentre <O_Os1...n> realiza o processo de <P>.`,
          Agent_Event: `Ao menos um(a) dentre <O_Os1...n> desencadeia e realiza o processo de <P>.`,
          Agent_Condition: `<P> ocorre se existir ao menos um(a) dentre <O_Os1...n>, caso contrário o processo de <P> é ignorado.`,
          Agent_Negation: `Ao menos um(a) dentre <O_Os1...n> não realiza o processo de <P>.`,
          Agent_Condition_Negation: `<P> ocorre se ao menos um(a) dentre <O_Os1...n> não existir, caso contrário o processo de <P> é ignorado.`,
          Instrument: `<P> requer ao menos um(a) dentre <O_Os1...n>.`,
          Instrument_Condition: `<P> ocorre se existir ao menos um(a) dentre <O_Os1...n>, caso contrário o processo de <P> é ignorado.`,
          Instrument_Event: `Ao menos um(a) dentre <O_Os1...n> desencadeia o processo de <P>, o qual o(a) requer.`,
          Instrument_Negation: `<P> não requer ao menos um(a) dentre <O_Os1...n>.`,
          Instrument_Condition_Negation: `<P> ocorre se ao menos um(a) dentre <O_Os1...n> não existir, caso contrário o processo de <P> é ignorado.`,
          Invocation_OUT: `<P> invoca ao menos um processo dentre <P1...n>.`,
          Invocation_IN: `Ao menos um processo dentre <P1...n> invoca o processo de <P>.`,
          InOut: `<P> altera o(a) <O> de <s1> para ao menos um(a) dentre <O_Os2...n>.`
        },
        object: {
          Result: `Ao menos um processo dentre <P1...n> produz <O_Os>`,
          Consumption: `Ao menos um processo dentre <P1...n> consome <O_Os>`,
          Consumption_Event: `<O_Os> desencadeia ao menos um processo dentre <P1...n>, o qual consome o(a) <O_Os>.`,
          Consumption_Condition_state: `Ao menos um processo dentre <P1...n> ocorre se <O> for/estiver <s1>, condição na qual o processo ocorrente consome o(a) <O>, caso contrário estes processos são ignorados.`,
          Consumption_Condition: `Ao menos um processo dentre <P1...n> ocorre se exisitr <O_Os>, condição na qual o processo ocorrente consome o(a) <O_Os>, caso contrário estes processos são ignorados.`,
          Consumption_Negation: `Ao menos um processo dentre <P1...n> não consome <O_Os>`,
          Consumption_Condition_Negation_state: `Ao menos um processo dentre <P1...n> ocorre se <O> não for/estiver <s1>, condição na qual o processo ocorrente consome o(a) <O>, caso contrário todos estes processos são ignorados.`,
          Consumption_Condition_Negation: `Ao menos um processo dentre <P1...n> ocorre se <O_Os> não exisitr, condição na qual o processso ocorrente consome o(a) <O_Os>, caso contráro todos estes processos são ignorados.`,
          Effect: `Ao menos um processo dentre <P1...n> afeta <O_Os>`,
          Effect_Event: `<O_Os> desencadeia ao menos um processo dentre <P1...n>, o qual afeta o(a) <O_Os>.`,
          Effect_Condition: `Ao menos um processo dentre <P1...n> ocorre se existir <O_Os>, condição na qual o processo ocorrente afeta o(a) <O_Os>, caso contrário estes processos são ignorados.`,
          Effect_Negation: `<P1...n> não afetam ao menos um(a) dentre <O_Os>.`,
          Effect_Condition_Negation: `Ao menos um processo dentre <P1...n> ocorre se não exisitr <O_Os>, condição na qual o processo ocorrente afeta o(a) <O_Os>, caso contrário os processos são ignorados.`,
          Agent: `<O_Os> realiza ao menos um processo dentre <P1...n>.`,
          Agent_Event: `<O_Os> desencadeia e realiza ao menos um processo dentre <P1...n>.`,
          Agent_Condition: `<O_Os> realiza ao menos um processo dentre <P1...n> se <O_Os> existir, caso contrário estes processos são ignorados.`,
          Agent_Condition_state: `<O> realiza ao menos um processo dentre <P1...n> se <O> for/estiver <s1>, caso contrário estes processos são ignorados.`,
          Agent_Negation: `Ao menos um processo dentre <P1...n> ocorre se <O_Os> não estiver presente.`,
          Agent_Condition_Negation: `Ao menos um processo dentre <P1...n> ocorre se <O_Os> não estiver presente, caso contrário todos estes processos são ignorados.`,
          Agent_Condition_Negation_state: `Ao menos um processo dentre <P1...n> ocorre se <O> não for/estiver no estado <s1>, caso contrário todos estes processos são ignorados.`,
          Instrument: `Ao menos um processo dentre <P1...n> requer <O_Os>`,
          Instrument_Event: `<O_Os> desencadeia ao menos um processo dentre <P1...n>, o qual requer o(a) <O_Os>`,
          Instrument_Condition: `Ao menos um processo dentre <P1...n> requer <O_Os>, caso contrário estes processos são ignorados.`,
          Instrument_Condition_state: `Ao menos um processo dentre <P1...n> requer que <O> seja/esteja <s1>, caso contrário estes processos são ignorados.`,
          Instrument_Negation: `Ao menos um processo dentre <P1...n> ocorre se <O_Os> não existir.`,
          Instrument_Condition_Negation: `Ao menos um processo dentre <P1...n> ocorre se <O_Os> não exisitr, caso contrário todos estes processos são ignorados.`,
          Instrument_Condition_Negation_state: `Ao menos um processo dentre <P1...n> ocorre se <O> não for/estiver <s1>, caso contrário todos estes processos são ignorados.`
        }
      },
      NOT: {
        process: {
          Agent_Negation: `<O_Os1...n> não realizam o processo de <P>.`,
          Agent_Condition_Negation: `<P> ocorre se <O_Os1...n> não existirem, caso contrário o processo de <P> é ignorado.`,
          Instrument_Negation: `<P> não requer <O_Os1...n>.`,
          Instrument_Condition_Negation: `<P> ocorre se <O_Os1...n> não existirem, caso contrário o processo de <P> é ignorado.`,
          Consumption_Negation: `<P> não consome <O_Os1...n>.`,
          Consumption_Condition_Negation: `<P> ocorre se <O_Os1...n> não existirem, condição na qual o processo de <P> consome os(as) existentes, caso contrário o processo é ignorado.`,
          Effect_Negation: `<P> não afeta <O_Os1...n>.`,
          Effect_Condition_Negation: `<P> ocorre se <O_Os1...n> não existem, condição na qual o processo de <P> afeta todos(as) os(as) demais, caso contrário o processo é ignorado.`
        },
        object: {
          Agent_Negation: `<P1...n> ocorrem se <O_Os> não estiver presente.`,
          Agent_Condition_Negation: `<P1...n> ocorrem se <O_Os> não estiver presente, caso contrário todos estes processos são ignorados.`,
          Agent_Condition_Negation_state: `<P1...n> ocorrem se <O> não for/estiver <s1>, caso contrário todos estes processos são ignorados.`,
          Instrument_Negation: `<P1...n> ocorrem se <O_Os> não existir.`,
          Instrument_Condition_Negation: `<P1...n> ocorrem se <O_Os> não existir, caso contrário todos estes processos são ignorados.`,
          Instrument_Condition_Negation_state: `<P1...n> ocorrem se <O> não for/estiver <s1>, caso contrário todos estes processos são ignorados.`,
          Consumption_Negation: `<P1...n> não consomem <O_Os>`,
          Consumption_Condition_Negation_state: `<P1...n> ocorrem se <O> não for/estiver <s1>, condição na qual estes processos consomem o(a) <O>, caso contrário todos estes processos são ignorados.`,
          Consumption_Condition_Negation: `<P1...n> ocorrem se <O_Os> não existir, condição na qual os processo consomem o(a) <O_Os>, caso contrário todos estes processos são ignorados.`,
          Effect_Negation: `<P1...n> não afetam <O_Os>.`,
          Effect_Condition_Negation: `<P1...n> ocorrem se <O_Os> não existir, condição na qual <P1...n> afetam todos(as) os(as) demais, caso contrário todos estes processos são ignorados.`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; onde <tag>`,
      probability: `<O_Os> com probabilidade <tag>`,
      rate: `<O_Os> a uma taxa de <tag> <units>`,
      path: `Seguindo o caminho <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `um opcional`,
      "*": `opcionais`,
      "+": `ao menos um`,
      "n..n": `<n1> a <n2>`,
      "n..*": `<n1> a muitos`,
      "n..mean..n": `<n1> a <n2>, com uma média de <mean>`
    },
    ranges: {
      "<=": `menor ou igual a`,
      ">=": "maior ou igual a",
      "=": "igual a",
      "<>": "diferente de",
      "<": `menor do que`,
      ">": "maior do que"
    },
    object: {
      thing_generic_name: `objeto`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> é o Gêmeo Digital de <O>.`,
      default_essence: `<O> é <a>.`,
      default_affiliation: `<O> é <e>.`,
      non_default: `<O> é <e> e <a>.`,
      singleInzoom: `<O> do <SD_Parent> expande-se no <Current_SD> em <T_list>.`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<O> do <SD_Parent> expande-se no <Current_SD> em <O_list>, bem como nos processos de <P_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `<O1...n>, nesta sequência vertical`,
      object_list_parallel: `<O1...n>, nesta sequência horizontal`
    },
    process: {
      thing_generic_name: `processo`,
      default_essence_affiliation: ``,
      default_essence: `<P> é um processo <a>.`,
      default_affiliation: `<P> é um processo <e>.`,
      non_default: `<P> é um processo <e> e <a>.`,
      singleInzoom: `<P> do <SD_Parent> expande-se no <Current_SD> em <T_list>, os(as) quais ocorrem nesta ordem.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<P> do <SD_Parent> expande-se no <Current_SD> nos processo de <P_list>, bem como em <O_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      // 'process_list_parallel': `<P1...n>, nesta sequência horizontal`,
      process_list_parallel: `<P1...n> em paralelo`,
      // 'process_list_sequence': `<P1...n>, nesta sequência vertical`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `A duração esperada do processo de <P> é de <exp> <units>.`,
      min_duration: `A duração mínima do processo de <P> é de <min> <units>.`,
      max_duration: `A duração máxima do processo de <P> é de <max> <units>.`,
      min_max_range_duration: `A duração mínima e a duração máxima do processo de <P> são de <min> <units> e de <max> <units>, respectivamente.`,
      min_exp_range_duration: `A duração mínima e a duração esperada do processo de <P> são de <min> <units> e de <exp> <units>, respectivamente.`,
      exp_max_range_duration: `A duração esperada e a duração máxima do processo de <P> são de <exp> <units> e de <max> <units>, respectivamente.`,
      expected_range_duration: `As durações mínima, esperada e máxima do processo de <P> são de <min> <units>, <exp> <units>, e <max> <units>, respectivamente.`,
      default_time_units: `segundos`
    },
    state: {
      single_state: `<O> é/esta <s>.`,
      multiple_states: `<O> pode ser/estar <s1...n>.`,
      all_states_are_suppressed: `<O> possui diferentes estados.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> é/está <s>, mas pode assumir outros estados.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> pode ser/estar <s1...n>, entre outros estados.`,
      default: `<s> é o estado predefinido.`,
      default_initial: `<s> é o estado predefinido e inicial.`,
      initial: `<s> é o estado inicial.`,
      final: `<s> é o estado final.`,
      default_initial_final: `<s> é o estado inicial, final, e predefinido.`,
      initial_final: `<s> é o estado inicial e final.`,
      default_final: `<s> é o estado final e predefinido.`,
      none: ``,
      Current: `Neste momento o(a) <O> é/está <s>.`,
      // 'timeDurational': {
      expected_duration: `A duração esperada no estado <s> é de <exp> <units>.`,
      min_duration: `A duração mínima no estado <s> é de <min> <units>.`,
      max_duration: `A duração máxima no estado <s> é de <max> <units>.`,
      min_max_range_duration: `A duração mínima e a duração máxima no estado <s> são de <min> <units> e de <max> <units>, respectivamente.`,
      min_exp_range_duration: `A duração mínima e a duração esperada no estado <s> são de <min> <units> e de <exp> <units>, respectivamente.`,
      exp_max_range_duration: `A duração esperada e a duração máxima no estado <s> são de <exp> <units> e de <max> <units>, respectivamente.`,
      expected_range_duration: `As durações mínima, esperada e máxima no estado <s> são de <min> <units>, <exp> <units>, e <max> <units>, respectivamente.`,
      default_time_units: `segundos`
      // }
    },
    essence: {
      physical: `material`,
      informatical: `informacional`
    },
    affiliation: {
      systemic: `sistêmico`,
      environmental: `ambiental`
    },
    semifolding: {
      object: `<O> apresenta `,
      process: `<P> apresenta `,
      general: {
        object: `<O> do <SD> está semi-desdobrado no <HighestSD>`,
        process: `<P> do <SD> está semi-desdobrado no <HighestSD>`
      },
      aggregation: {
        single: `<T> como uma parte`,
        multiple: `<T1...n-1> e <Tn> como partes`
      },
      exhibition: {
        single: `<T> como uma característica`,
        multiple: `<T1...n-1> e <Tn> como características`
      },
      generalization: {
        single: `<T> como uma especialização`,
        multiple: `<T1...n-1> e <Tn> como especializações`
      },
      instantiation: {
        single: `<T> como uma instância`,
        multiple: `<T1...n-1> e <Tn> como instâncias`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> of <owner> is <value>.`
    },
    father_model_to_sub_model: `The selected things, <o1...n>, and <p1...n> are refined in sub model <subsystem_name> subsystem model view.`,
    sub_model_from_father_model: `The <subsystem_name> subsystem model view is derived from the <father_model_name> model.`
  };
  const oplTemplates_cn = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1>包含<T2>。`,
      "Aggregation-Participation_incomplete": `<T1> consists of <T2> and <num> more parts.`,
      "Aggregation-Participation_(multiple)": `<T1>包含<T2...n>。`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consists of <T2...n> and <num> more parts.`,
      "Generalization-Specialization": `<T2>是一个<T1>。`,
      "Generalization-Specialization_incomplete": `<T2> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n>是<T1>。`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> and <num> more specializations are <T1>.`,
      "Classification-Instantiation": `<T2> 是<T1>的一个实例。`,
      "Classification-Instantiation_incomplete": `<T2> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n>是<T1>的实例。`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> and <num> more instances are instances of <T1>.`,
      "Exhibition-Characterization": `<T1>展示出属性<T2>。`,
      "Exhibition-Characterization_incomplete": `<T1> exhibits <T2> and <num> more attributes.`,
      "Exhibition-Characterization_(multiple)": `<T1>展示出属性<T2...n>。`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibits <T2...n> and <num> more attributes.`,
      Unidirectional_Tagged_Link: `<T1>与<T2>相关。`,
      "Unidirectional_Tagged_Link_(tag)": `<T1><tag><T2>。`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1>和<T2>是等价的。`,
      "Bidirectional_Tagged_Link_(tag)": `<T1>和<T2>是<tag>。`,
      "Bidirectional_Tagged_Link_(ftag，btag)": `<T1><forward tag><T2>，并且<T2><backward tag><T1>。`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os>操作<P>。`,
      "Agent_(multiple)": `<O\Os1...n>操作<P>。`,
      Agent_Condition: `如果<O>存在，则<P>发生，否则<P>被跳过。`,
      "Agent_Condition(multiple)": `如果<O\Os1...n>存在，则<P>发生，否则<P>被跳过。`,
      Agent_Condition_state: `如果<O>在<s>状态，则<P>发生，否则<P>被跳过。`,
      Agent_Event: `<O>启动并操作<P>。`,
      "Agent_Event(multiple)": `<O\Os1...n>启动并操作<P>。`,
      Agent_Event_state: `<s><O>启动并操作<P>。`,
      Instrument: `<P>需要<O_Os>。`,
      "Instrument_(multiple)": `<P>需要<O\Os1...n>。`,
      Instrument_Condition: `如果<O>存在，则<P>发生，否则<P>被跳过。`,
      "Instrument_Condition(multiple)": `如果<O\Os1...n>存在，则<P>发生，否则<P>被跳过。`,
      Instrument_Condition_state: `如果<O>在<s>状态，则<P>发生，否则<P>被跳过。`,
      Instrument_Event: `<O>启动<P>，这个过程需要<O>。`,
      "Instrument_Event(multiple)": `<O\Os1...n>启动<P>，这个过程需要这些对象。`,
      Instrument_Event_state: `<s><O>启动<P>，这个过程需要<s><O>。`,
      Effect: `<P>影响<O_Os>。`,
      "Effect_(multiple)": `<P>影响<O\Os1...n>。`,
      Effect_Condition: `如果<O>存在，则<P>发生，在此情况下<P>影响<O>，否则<P>被跳过。`,
      "Effect_Condition(multiple)": `如果<O\Os1...n>存在，则<P>发生，在此情况下<P>影响这些对象，否则<P>被跳过。`,
      Effect_Condition_state: `如果<O>在<s>状态，则<P>发生，在此情况下<P>影响<s><O>，否则<P>被跳过。`,
      Effect_Event: `<O>启动<P>，这个过程影响<O>`,
      "Effect_Event(multiple)": `<O\Os1...n>启动<P>，这个过程影响<O>。`,
      Effect_Event_state: `<s><O>启动<P>，这个过程影响<s><O>`,
      Consumption: `<P>消耗<O_Os>。`,
      "Consumption_(multiple)": `<P>消耗<O\Os1...n>。`,
      Consumption_Condition: `如果<O>存在，则<P>发生，在此情况下<P>消耗<O>，否则<P>被跳过。`,
      "Consumption_Condition(multiple)": `如果<O\Os1...n>存在，则<P>发生，在此情况下<P>消耗这些对象，否则<P>被跳过。`,
      Consumption_Condition_state: `如果<O>在<s>状态，则<P>发生，在此情况下<P>消耗<s><O>，否则<P>被跳过。`,
      Consumption_Event: `<O>启动<P>，这个过程消耗<O>。`,
      "Consumption_Event(multiple)": `<O\Os1...n>启动<P>，这个过程消耗这些对象。`,
      Consumption_Event_state: `<s><O>启动<P>，这个过程消耗<O>。`,
      Result: `<P>产生<O_Os>。`,
      "Result_(multiple)": `<P>产生<O\Os1...n>。`,
      "In-out_Link_Pair": `<P>将<O>从<s1>改变为<s2>。`,
      "In-out(group)": `<O>从<s1>改变为<s2>`,
      "In-out_Link_Pair(group)": `<P>将<O>从<s1>改变为<s2><Other_changes>。`,
      Split_input: `<P>将<O>从<s>改变为其他状态。`,
      Split_output: `<P>将<O>从其他状态改变为<s>。`,
      Condition_Input: `如果<O>是<s1>状态，则<P>发生，在此情况下<P>将<O>从<s1>改变为<s2>，否则<P>被跳过。`,
      "In-out_Link_Pair_Condition": `如果<O>是<s1>状态，则<P>发生，在此情况下<P>将<O>从<s1>改变为<s2>，否则<P>被跳过。`,
      "In-out_Link_Pair_Condition(group)": `如果<O>是<s1>状态，则<P>发生，在此情况下<P>将<O>从<s1>改变为<s2>，否则<P>被跳过。`,
      "In-out_Link_Pair_Event": `<s1><O>启动<P>，这个过程将<O>从<s1>改变为<s2>。`,
      "In-out_Link_Pair_Event(group)": `<O>在<s1>状态时启动<P>，这个过程将<O>从<s1>改变为<s2>。`,
      Overtime_exception: `当<O>在<s>状态超过<maxtime><units>时，<O>触发<P>。`,
      Undertime_exception: `当<O>在<s>状态少于<mintime><units>时，<O>触发<P>。`,
      "OvertimeUndertime-exception": `当<O>在<s>状态超过<maxtime><units>并少于<mintime><units>时，<O>触发<P>。`,
      "Overtime_exception_(process)": `如果<P1>超过<maxtime><units>,<P2>发生。`,
      "Undertime_exception_(process)": `如果<P1>少于<mintime><units>,<P2>发生。`,
      "OvertimeUndertime-exception_(process)": `如果<P1>超过<maxtime><units>且少于<mintime><units>,<P2>发生。`,
      Invocation: `<P1>引发<P2>。`,
      "Invocation_(multiple)": `<P1>引发<P2...n>。`,
      "Invocation_(self)": `<P1>引发它自身。`,
      "Invocation_(parent)": `<P1>引发<P2>。`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1>和<Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>，以及<P1...n>`,
      AND: `<T1...n-1>和<Tn>`,
      OR: `<T1...n-1>或<Tn>`,
      XOR: `<T1> xor <T2>`,
      "Stateful-Object": `<s>状态的<O>`,
      "Stateful-Object-value": `<O> 其值为 <s>`,
      "Stateful-Object-value(multiple)": `<O> 其值为 <s1...n>`,
      "Stateful-Object(multiple)": `<s1...n>状态的<O>`,
      "Attribute-Exhibitor": ` <e1...n>的<T>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes>和<change>。`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object。
      XOR: {
        process: {
          Result: "<P>产生<O_Os1...n>其中之一。",
          "Result(brothers)": "<P>产生<s1...n>至少其中一种状态下的<O>。",
          Consumption: `<P>消耗<O_Os1...n>其中之一。`,
          "Consumption(brothers)": `<P>消耗<s1...n>至少其中一种状态下的<O>。`,
          Consumption_Condition: `如果<O_Os1...n>其中之一存在，则<P>发生，在此情况下<P>消耗这个存在的对象，否则<P>被跳过。`,
          "Consumption_Condition(brothers)": `如果<O>在<s1...n>状态之一，则<P>发生，在此情况下<P>消耗it，否则<P>被跳过。`,
          Consumption_Event: `<O_Os1...n>其中之一启动<P>，这个过程消耗它。`,
          "Consumption_Event(brothers)": `当<O>在<s1...n>状态之一时，<O>启动<P>，这个过程消耗它。`,
          Effect: `<P>影响<O_Os1...n>其中之一。`,
          "Effect(brothers)": `<P>影响<s1...n>至少其中一种状态下的<O>。`,
          Effect_Condition: `如果<O_Os1...n>其中之一存在，则<P>发生，在此情况下<P>影响它，否则<P>被跳过。`,
          "Effect_Condition(brothers)": `如果<O>在<s1...n>状态之一，则<P>发生，在此情况下<P>影响它，否则<P>被跳过。`,
          Effect_Event: `<O_Os1...n>其中之一启动<P>，这个过程影响它。`,
          "Effect_Event(brothers)": `当<O>在<s1...n>状态之一时，<O>启动<P>，这个过程影响它。`,
          Agent: `<O_Os1...n>其中之一操作<P>。`,
          "Agent(brothers)": `当<O>在<s1...n>状态之一时，<O>操作<P>。`,
          Agent_Event: `<O_Os1...n>其中之一启动并操作<P>。`,
          "Agent_Event(brothers)": `当<O>在<s1...n>状态之一时，<O>启动并操作<P>。`,
          Agent_Condition: `如果<O_Os1...n>其中之一存在，则<P>发生，否则<P>被跳过。`,
          "Agent_Condition(brothers)": `如果<O>在<s1...n>状态之一，则<P>发生，否则<P>被跳过。`,
          Instrument: `<P>需要<O_Os1...n>其中之一。`,
          "Instrument(brothers)": `<P>需要<s1...n>至少其中一种状态下的<O>。`,
          Instrument_Condition: `如果<O_Os1...n>其中之一存在，则<P>发生，否则<P>被跳过。`,
          "Instrument_Condition(brothers)": `如果<O>在<s1...n>状态之一，则<P>发生，否则<P>被跳过。`,
          Instrument_Event: `<O_Os1...n>其中之一启动<P>，这个过程需要它。`,
          "Instrument_Event(brothers)": `如果<O>在<s1...n>状态之一，<O>启动<P>，这个过程需要它。`,
          Invocation_OUT: `<P>引发或<P1...n>。`,
          Invocation_IN: `或<P1...n>引发<P>。`,
          InOut: `<P> changes <O> from <s1> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> changes <O> from exactly one of <ins1..n> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> changes <O> from exactly one of <ins1..n> to <s1>.`
        },
        object: {
          Result: `<P1...n>其中之一产生<O_Os>。`,
          Consumption: `<P1...n>其中之一消耗<O_Os>`,
          Consumption_Event: `<O_Os>启动<P1...n>其中之一，这个过程消耗<O_Os>。`,
          Consumption_Condition_state: `如果<O>在<s1>状态，则<P1...n>其中之一发生，在此情况下这个发生的过程消耗<O>，否则这些过程被跳过。`,
          Consumption_Condition: `如果<O_Os>存在，则<P1...n>其中之一发生，在此情况下这个发生的过程消耗<O_Os>，否则这些过程被跳过。`,
          Effect: `<P1...n>其中之一影响<O_Os>。`,
          Effect_Event: `<O_Os>启动<P1...n>其中之一，这个过程影响<O_Os>。`,
          Effect_Condition: `如果<O_Os>存在，<P1...n>其中之一发生，在此情况下这个发生的过程影响<O_Os>，否则这些过程被跳过。`,
          Agent: `<O_Os>操作<P1...n>其中之一。`,
          Agent_Event: `<O_Os>启动并操作<P1...n>其中之一。`,
          Agent_Condition: `如果<O_Os>存在，则<O_Os>操作<P1...n>其中之一，否则这些过程被跳过。`,
          Agent_Condition_state: `如果<O>在<s1>状态，则<O>操作<P1...n>其中之一，否则这些过程被跳过。`,
          Instrument: `<P1...n>其中之一需要<O_Os>。`,
          Instrument_Event: `<O_Os>启动<P1...n>其中之一，这个过程需要<O_Os>。`,
          Instrument_Condition: `<P1...n>其中之一需要<O_Os>，否则这些过程被跳过。`,
          Instrument_Condition_state: `<P1...n>其中之一需要<O>在<s1>状态，否则这些过程被跳过。`
        }
      },
      OR: {
        process: {
          Result: "<P>产生<O_Os1...n>至少其一。",
          Consumption: `<P>消耗<O_Os1...n>至少其一。`,
          Consumption_Condition: `如果<O_Os1...n>至少其一存在，则<P>发生，在此情况下<P>消耗这个存在的对象，否则<P>被跳过。`,
          Consumption_Event: `<O_Os1...n>至少其一启动<P>，这个过程消耗<O_Os1...n>。`,
          Effect: `<P>影响<O_Os1...n>至少其一。`,
          Effect_Condition: `如果<O_Os1...n>至少其一存在，则<P>发生，在此情况下<P>影响it，否则<P>被跳过。`,
          Effect_Event: `<O_Os1...n>至少其一启动<P>，这个过程影响<O_Os1...n>。`,
          Agent: `<O_Os1...n>至少其一操作<P>。`,
          Agent_Event: `<O_Os1...n>至少其一启动并操作<P>。`,
          Agent_Condition: `如果<O_Os1...n>至少其一存在，则<P>发生，否则<P>被跳过。`,
          Instrument: `<P>需要<O_Os1...n>至少其一。`,
          Instrument_Condition: `如果<O_Os1...n>至少其一存在，则<P>发生，否则<P>被跳过。`,
          Instrument_Event: `<O_Os1...n>至少其一启动<P>，这个过程需要这个对象。`,
          Invocation_OUT: `<P>引发<P1...n>至少其一。`,
          Invocation_IN: `<P1...n>至少其一引发<P>。`,
          InOut: `<P> changes <O> from <s1> to at least one of <O_Os2...n>.`
        },
        object: {
          Result: `<P1...n>至少其一产生<O_Os>`,
          Consumption: `<P1...n>至少其一消耗<O_Os>`,
          Consumption_Event: `<O_Os>启动<P1...n>至少其一，这个过程消耗<O_Os>。`,
          Consumption_Condition_state: `如果<O>在<s1>状态，则<P1...n>至少其一发生，在此情况下这个发生的过程消耗<O>，否则这些过程被跳过。`,
          Consumption_Condition: `当<O_Os>存在时，则<P1...n>至少其一发生，在此情况下这个发生的过程消耗<O_Os>，否则这些过程被跳过。`,
          Effect: `<P1...n>至少其一影响<O_Os>`,
          Effect_Event: `<O_Os>启动<P1...n>至少其一，这个过程影响这个发生的过程。`,
          Effect_Condition: `<P1...n>至少其一 occurs if <O_Os> exists，在此情况下这个发生的过程影响<O_Os>，否则这些过程被跳过。`,
          Agent: `<O_Os>操作<P1...n>至少其一。`,
          Agent_Event: `<O_Os>启动并操作<P1...n>至少其一。`,
          Agent_Condition: `如果<O_Os>存在，则<O_Os>操作<P1...n>至少其一，否则这些过程被跳过。`,
          Agent_Condition_state: `如果<O>在<s1>状态，则<O>操作<P1...n>至少其一，否则这些过程被跳过。`,
          Instrument: `<P1...n>至少其一需要<O_Os>`,
          Instrument_Event: `<O_Os>启动<P1...n>至少其一，这个过程需要<O_Os>`,
          Instrument_Condition: `<P1...n>至少其一需要<O_Os>，否则这些过程被跳过。`,
          Instrument_Condition_state: `<P1...n>至少其一需要<O>在<s1>状态，否则这些过程被跳过。`
        }
      }
    },
    tags: {
      multiplicity: `<tag><O_Os>`,
      constraints: `<O_Os>; 其中<tag>`,
      probability: `<O_Os>以<tag>的概率`,
      path: `随路径<tag>，<opl>`,
      range: `<r><opl>`
    },
    symbols: {
      "?": `可选择的一个`,
      "*": `可选择的`,
      "+": `至少一个`,
      "n..n": `<n1>到<n2>个`,
      "n..*": `<n1>到更多个`
    },
    ranges: {
      "<=": `小于等于`,
      ">=": "大于等于",
      "=": "等于",
      "<>": "不等于",
      "<": `小于`,
      ">": "大于"
    },
    object: {
      thing_generic_name: `目的`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O>是<a>。`,
      default_affiliation: `<O>是<e>。`,
      non_default: `<O>是<e>和<a>。`,
      singleInzoom: `<O>从<SD_Parent>在<Current_SD>放大为<T_list>。`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<O>从<SD_Parent>在<Current_SD>放大为<O_list>，以及<P_list>。`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `<O1...n>，以此纵向顺序 `,
      object_list_parallel: `<O1...n>，以此横向顺序`
    },
    process: {
      thing_generic_name: `过程`,
      default_essence_affiliation: ``,
      default_essence: `<P>是<a>。`,
      default_affiliation: `<P>是<e>。`,
      non_default: `<P>是<e>和<a>。`,
      singleInzoom: `<P>从<SD_Parent>在<Current_SD>放大为<T_list>，这些过程以此时间顺序发生。`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<P>从<SD_Parent>在<Current_SD>放大为<P_list>，以及<O_list>。`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      // 'process_list_parallel': `<P1...n>， in that horizontal sequence`,
      process_list_parallel: `并行的<P1...n>`,
      // 'process_list_sequence': `<P1...n>， in that vertical sequence`,
      process_list_sequence: `<P1...n>`
    },
    state: {
      single_state: `<O>是<s>。`,
      multiple_states: `<O>可以为<s1...n>。`,
      all_states_are_suppressed: `<O> is stateful.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> is <s> and can be at one of <num> other states.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> can be <s1...n> or at one of <num> other states.`,
      default: `<s>状态为默认值。`,
      default_initial: `<s>状态为默认和初始值。`,
      initial: `<s>状态为初始值。`,
      final: `<s>状态为最终值。`,
      default_initial_final: `<s>状态为默认、初始和最终值。`,
      initial_final: `<s>状态为初始和最终值。`,
      default_final: `<s>状态为默认和最终值。`,
      none: ``,
      Current: `<O> is currently at state <s>.`
    },
    essence: {
      physical: `实体的`,
      informatical: `信息的`
    },
    affiliation: {
      systemic: `系统的`,
      environmental: `环境的`
    },
    semifolding: {
      object: `<O> lists `,
      process: `<P> lists `,
      aggregation: {
        single: `<T> as a part`,
        multiple: `<T1...n-1> and <Tn> as parts`
      },
      exhibition: {
        single: `<T> as a feature`,
        multiple: `<T1...n-1> and <Tn> as features`
      },
      generalization: {
        single: `<T> as a specialization`,
        multiple: `<T1...n-1> and <Tn> as specializations`
      },
      instantiation: {
        single: `<T> as an instance`,
        multiple: `<T1...n-1> and <Tn> as instances`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> of <owner> is <value>.`
    },
    father_model_to_sub_model: `The selected things, <o1...n>, and <p1...n> are refined in sub model <subsystem_name> subsystem model view.`,
    sub_model_from_father_model: `The <subsystem_name> subsystem model view is derived from the <father_model_name> model.`
  };
  const oplTemplates_ko = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1>´Â(Àº) <T2>¸¦(À») Æ÷ÇÔÇÕ´Ï´Ù.`,
      "Aggregation-Participation_incomplete": `<T1> consists of <T2> and <num> more parts.`,
      "Aggregation-Participation_(multiple)": `<T1>´Â <T2...n>¸¦ Æ÷ÇÔÇÕ´Ï´Ù.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consists of <T2...n> and <num> more parts.`,
      "Generalization-Specialization": `<T2>´Â <T1>ÀÔ´Ï´Ù.`,
      "Generalization-Specialization_incomplete": `<T2> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n>µéÀº <T1>ÀÔ´Ï´Ù.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> and <num> more specializations are <T1>.`,
      "Classification-Instantiation": `<T2>´Â <T1>ÀÇ »ç·ÊÀÔ´Ï´Ù.`,
      "Classification-Instantiation_incomplete": `<T2> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n>µéÀº <T1>µéÀÇ »ç·ÊÀÔ´Ï´Ù.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> and <num> more instances are instances of <T1>.`,
      "Exhibition-Characterization": `<T1>´Â <T2>¸¦ ³ªÅ¸³À´Ï´Ù.`,
      "Exhibition-Characterization_incomplete": `<T1> exhibits <T2> and <num> more attributes.`,
      "Exhibition-Characterization_(multiple)": `<T1>´Â <T2...n>¸¦ ³ªÅ¸³À´Ï´Ù.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibits <T2...n> and <num> more attributes.`,
      Unidirectional_Tagged_Link: `<T1>´Â <T2>¿¡ ¿¬°áµË´Ï´Ù.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1>°ú(¿Í) <T2>µéÀº µ¿µîÇÕ´Ï´Ù.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1>¿Í <T2>´Â <tag>ÀÔ´Ï´Ù.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, ¿Í <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os>´Â <P>¸¦ Ã³¸®ÇÕ´Ï´Ù.`,
      "Agent_(multiple)": `<O\Os1...n>µéÀº <P>¸¦ Ã³¸®ÇÕ´Ï´Ù.`,
      Agent_Condition: `¸¸¾à <O>°¡(ÀÌ) Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "Agent_Condition(multiple)": `¸¸¾à <O\Os1...n>µéÀÌ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Agent_Condition_state: `¸¸¾à <O>°¡ ÀÖ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Agent_Event: `<O>´Â <P>¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
      "Agent_Event(multiple)": `<O\Os1...n>µéÀº <P>¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
      Agent_Event_state: `<s> <O>´Â <P>¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
      Instrument: `<P>´Â <O_Os>¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù.`,
      "Instrument_(multiple)": `<P>´Â <O\Os1...n>µéÀ» ÇÊ¿ä·Î ÇÕ´Ï´Ù.`,
      Instrument_Condition: `¸¸¾à <O>°¡ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "Instrument_Condition(multiple)": `¸¸¾à <O\Os1...n>°¡ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Instrument_Condition_state: `¸¸¾à <O>°¡ <s> »óÅÂ¿¡ ÀÖ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Instrument_Event: `<O>°¡ <O>¸¦ ÇÊ¿ä·ÎÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      "Instrument_Event(multiple)": `<O\Os1...n>µéÀº ÇÊ¿ä·ÎÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Instrument_Event_state: `<s> <O>°¡ ÇÊ¿ä·ÎÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Effect: `<P>´Â <O_Os>¿¡ ¿µÇâÀ» ÁÝ´Ï´Ù.`,
      "Effect_(multiple)": `<P>´Â <O\Os1...n>µé¿¡ ¿µÇâÀ» ÁÝ´Ï´Ù.`,
      Effect_Condition: `¸¸¾à <O>°¡ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <O>¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "Effect_Condition(multiple)": `¸¸¾à <O\Os1...n>µéÀÌ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â ÀÌ°Íµé¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Effect_Condition_state: `¸¸¾à <O>°¡ <s> »óÅÂ¿¡ ÀÖ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <s> <O>¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Effect_Event: `<O>´Â <O>¿¡ ¿µÇâÀ» ÁÖ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      "Effect_Event(multiple)": `<O\Os1...n>µéÀº <O>¿¡ ¿µÇâÀ» ÁÖ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Effect_Event_state: `<s> <O>´Â <s> <O>¿¡ ¿µÇâÀ» ÁÖ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Consumption: `<P>´Â <O_Os>¸¦ »ç¿ëÇÕ´Ï´Ù.`,
      "Consumption_(multiple)": `<P>´Â <O\Os1...n>µéÀ» »ç¿ëÇÕ´Ï´Ù.`,
      Consumption_Condition: `¸¸¾à <O>°¡ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <O>¸¦ »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "Consumption_Condition(multiple)": `¸¸¾à <O\Os1...n>µéÀÌ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â ÀÌ°ÍµéÀ» »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Consumption_Condition_state: `¸¸¾à <O>°¡ <s> »óÅÂ¿¡ ÀÖ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <s> <O>¸¦ »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      Consumption_Event: `<O>´Â <O>¸¦ »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      "Consumption_Event(multiple)": `<O\Os1...n>µéÀº  ÀÌ°ÍµéÀ» »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Consumption_Event_state: `<s> <O>´Â <s> <O>¸¦ »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Result: `<P>´Â <O_Os>¸¦ ¸¸µé¾î³À´Ï´Ù.`,
      "Result_(multiple)": `<P>´Â <O\Os1...n>µéÀ» ¸¸µé¾î³À´Ï´Ù.`,
      "In-out_Link_Pair": `<P>´Â <O>¸¦ <s1>¿¡¼­ <s2>À¸·Î º¯°æÇÕ´Ï´Ù.`,
      "In-out(group)": `<O>¸¦ <s1>¿¡¼­ <s2>À¸·Î`,
      "In-out_Link_Pair(group)": `<P>´Â <O>¸¦ <s1>¿¡¼­ <s2><Other_changes>À¸·Î º¯°æÇÕ´Ï´Ù.`,
      Split_input: `<P>´Â <O>¸¦ <s>À¸·ÎºÎÅÍ ´Ù¸¥ »óÅÂ·Î º¯°æÇÕ´Ï´Ù.`,
      Split_output: `<P>´Â <O>¸¦ ´Ù¸¥ »óÅÂ·ÎºÎÅÍ <s>·Î º¯°æÇÕ´Ï´Ù.`,
      Condition_Input: `¸¸¾à <O>°¡ <s1>ÀÌ¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <O>¸¦ <s1>¿¡¼­ <s2>À¸·Î º¯°æÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "In-out_Link_Pair_Condition": `¸¸¾à <O>°¡ <s1>ÀÌ¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <O>¸¦ <s1>¿¡¼­ <s2>À¸·Î º¯°æÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "In-out_Link_Pair_Condition(group)": `¸¸¾à <O>°¡ <s1>ÀÌ¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â <O>¸¦ <s1>¿¡¼­ <s2>À¸·Î º¯°æÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
      "In-out_Link_Pair_Event": `<s1> <O>´Â <s1>¿¡¼­ <s2>À¸·Î º¯°æÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      "In-out_Link_Pair_Event(group)": `<s1>»óÅÂ¿¡¼­ <O>´Â <s1>¿¡¼­ <s2>À¸·Î º¯°æÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
      Overtime_exception: `<O>°¡ <maxtime> <units> ÀÌ»ó <s>ÀÏ ¶§ <P>¸¦ ÀÛµ¿½ÃÅµ´Ï´Ù.`,
      Undertime_exception: `<O>°¡ <mintime> <units> ÀÌÇÏ <s>ÀÏ ¶§ <P>¸¦ ÀÛµ¿½ÃÅµ´Ï´Ù.`,
      "OvertimeUndertime-exception": `<O>°¡ <maxtime> <units> ÀÌ»óÀÌ°í <mintime> <units>ÀÌÇÏÀÏ ¶§ <P>¸¦ ÀÛµ¿½ÃÅµ´Ï´Ù.`,
      "Overtime_exception_(process)": `¸¸¾à <P1>°¡ <maxtime> <units> ÀÌ»óÀ¸·Î Áö¼ÓµÇ¸é <P2>°¡ ¹ß»ýÇÕ´Ï´Ù.`,
      "Undertime_exception_(process)": `¸¸¾à <P1>°¡ <mintime> <units> ÀÌÇÏ·Î ¶³¾îÁö¸é <P2>°¡ ¹ß»ýÇÕ´Ï´Ù.`,
      "OvertimeUndertime-exception_(process)": `¸¸¾à <P1>°¡ <mintime> <units> ÀÌÇÏ·Î ¶³¾îÁö°Å³ª <maxtime> <units> ÀÌ»óÀ¸·Î Áö¼ÓµÇ¸é <P2>°¡ ¹ß»ýÇÕ´Ï´Ù.`,
      Invocation: `<P1>°¡ <P2>¸¦ È£ÃâÇÕ´Ï´Ù.`,
      "Invocation_(multiple)": `<P1>°¡ <P2...n>µé¸¦ È£ÃâÇÕ´Ï´Ù.`,
      "Invocation_(self)": `<P1>°¡ ÀÚ±âÈ£ÃâÇÕ´Ï´Ù.`,
      "Invocation_(parent)": `<P1>°¡ <P2>¸¦ È£ÃâÇÕ´Ï´Ù.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> ±×¸®°í <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, ±×¸®°í <P1...n>`,
      AND: `<T1...n-1> ±×¸®°í <Tn>`,
      OR: `<T1...n-1> ¶Ç´Â <Tn>`,
      XOR: `<T1> ¹èÅ¸Àû ³í¸®ÇÕ <T2>`,
      "Stateful-Object": `<s> »óÅÂÀÇ <O>`,
      "Stateful-Object-value": `<O> 은 값이 <s>`,
      "Stateful-Object-value(multiple)": `<O> 은 값이 <s1...n>`,
      "Stateful-Object(multiple)": `<s1...n> »óÅÂÀÇ <O>`,
      "Attribute-Exhibitor": `<T>ÀÇ <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> ±×¸®°í <change>.`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object.
      XOR: {
        process: {
          Result: "<P>´Â <O_Os1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ ¸¸µé¾î³À´Ï´Ù.",
          "Result(brothers)": "<P>´Â <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¿¡¼­ <O>¸¦ ¸¸µé¾î³À´Ï´Ù.",
          Consumption: `<P>´Â <O_Os1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ »ç¿ëÇÕ´Ï´Ù.`,
          "Consumption(brothers)": `<P>´Â <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¿¡¼­ <O>¸¦ »ç¿ëÇÕ´Ï´Ù.`,
          Consumption_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Á¤È®È÷ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â Á¸ÀçÇÏ´Â °ÍÀ» »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          "Consumption_Condition(brothers)": `'¸¸¾à <O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â ±×°ÍÀ» »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Consumption_Event: `Á¤È®ÇÏ°Ô <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ ±×°ÍÀ» »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          "Consumption_Event(brothers)": `<O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ªÀÏ ¶§ ±×°ÍÀ» »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Effect: `<P>´Â <O_Os1...n> ÁßÀÇ ÇÏ³ª¿¡ Á¤È®È÷ ¿µÇâÀ» ÁÝ´Ï´Ù.`,
          "Effect(brothers)": `<P>´Â <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¿¡¼­ <O>¿¡ ¿µÇâÀ» ÁÝ´Ï´Ù.`,
          Effect_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Á¤È®È÷ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â ±×°Í¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          "Effect_Condition(brothers)": `¸¸¾à <O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â ±×°Í¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Effect_Event: `Á¤È®ÇÏ°Ô <O_Os1...n> »óÅÂ ÁßÀÇ ÇÏ³ª°¡ ±×°Í¿¡ ¿µÇâÀ» ÁÖ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          "Effect_Event(brothers)": `<O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ªÀÏ ¶§ ±×°Í¿¡ ¿µÇâÀ» ÁÖ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Agent: `Á¤È®ÇÏ°Ô <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ <P>¸¦ Ã³¸®ÇÕ´Ï´Ù.`,
          "Agent(brothers)": `<O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ªÀÏ ¶§ <P>¸¦ Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Event: `Á¤È®ÇÏ°Ô <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ <P>¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
          "Agent_Event(brothers)": `<O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ªÀÏ ¶§ ±×°ÍÀ» »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Á¤È®È÷ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          "Agent_Condition(brothers)": `¸¸¾à <O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Instrument: `<P>´Â <O_Os1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ ÇÊ¿ä·Î ÇÕ´Ï´Ù.`,
          "Instrument(brothers)": `<P>´Â <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¿¡¼­ <O>¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù.`,
          Instrument_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Á¤È®È÷ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          "Instrument_Condition(brothers)": `¸¸¾à <O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ª¶ó¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Instrument_Event: `Á¤È®ÇÏ°Ô <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ ±×°ÍÀ» »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          "Instrument_Event(brothers)": `<O>°¡ <s1...n> »óÅÂ ÁßÀÇ ÇÏ³ªÀÏ ¶§ ±×°ÍÀ» ÇÊ¿ä·Î ÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Invocation_OUT: `<P>´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ È£ÃâÇÕ´Ï´Ù.`,
          Invocation_IN: `<P1...n> ÁßÀÇ ÇÏ³ª°¡ <P>¸¦ È£ÃâÇÕ´Ï´Ù.`,
          InOut: `<P> changes <O> from <s1> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> changes <O> from exactly one of <ins1..n> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> changes <O> from exactly one of <ins1..n> to <s1>.`
        },
        object: {
          Result: `Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ <O_Os>¸¦ ¸¸µé¾î³À´Ï´Ù.`,
          Consumption: `Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ <O_Os>¸¦ »ç¿ëÇÕ´Ï´Ù.`,
          Consumption_Event: `<O_Os>´Â ½ÃÀÛ ÇÁ·Î¼¼½º¸¦ »ç¿ëÇÏ´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Consumption_Condition_state: `¸¸¾à <O>°¡ <s1>ÀÌ¶ó¸é Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ ¹ß»ý ÇÁ·Î¼¼½º´Â <O>¸¦ »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Consumption_Condition: `¸¸¾à <O_Os>°¡ Á¸ÀçÇÑ´Ù¸é Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ ¹ß»ý ÇÁ·Î¼¼½º´Â <O_Os>¸¦ »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Effect: `Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ <O_Os>¿¡ ¿µÇâÀ» ÁÝ´Ï´Ù.`,
          Effect_Event: `<O_Os>°¡ ¹ß»ý ÇÁ·Î¼¼½ºµé¿¡ ¿µÇâÀ» ÁÖ´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Effect_Condition: `¸¸¾à <O_Os>°¡ Á¸ÀçÇÑ´Ù¸é Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ ¹ß»ý ÇÁ·Î¼¼½º´Â <O_Os>¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Agent: `<O_Os>´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Event: `<O_Os>´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Condition: `¸¸¾à <O_Os>°¡ Á¸ÀçÇÑ´Ù¸é <O_Os>°¡ <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ Ã³¸®ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Agent_Condition_state: `¸¸¾à <O>°¡ <s1>ÀÌ¶ó¸é <O>´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ Ã³¸®ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Instrument: `Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª°¡ <O_Os>¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù.`,
          Instrument_Event: `<O_Os>¸¦ ÇÊ¿ä·Î ÇÏ´Â <O_Os>°¡ <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Á¤È®È÷ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Instrument_Condition: `Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª´Â <O_Os>¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Instrument_Condition_state: `Á¤È®ÇÏ°Ô <P1...n> ÁßÀÇ ÇÏ³ª´Â <O>°¡ <s1>ÀÓÀ» ÇÊ¿ä·Î ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`
        }
      },
      OR: {
        process: {
          Result: "<P>´Â Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª¸¦ ¸¸µé¾î³À´Ï´Ù.",
          Consumption: `<P>´Â Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª¸¦ »ç¿ëÇÕ´Ï´Ù.`,
          Consumption_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Àû¾îµµ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â Á¸ÀçÇÏ´Â ±×°ÍÀ» »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Consumption_Event: `Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ ±×°ÍÀ» »ç¿ëÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Effect: `<P>´Â <O_Os1...n> ÁßÀÇ ÇÏ³ª¿¡ ¿µÇâÀ» ÁÝ´Ï´Ù.`,
          Effect_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Àû¾îµµ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ <P>´Â ±×°Í¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Effect_Event: `Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ ±×°Í¿¡ ¿µÇâÀ» ÁÖ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Agent: `Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ <P>¸¦ Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Event: `Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ <P>¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Àû¾îµµ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Instrument: `<P>´Â Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù.`,
          Instrument_Condition: `¸¸¾à <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ Àû¾îµµ Á¸ÀçÇÑ´Ù¸é <P>°¡ ¹ß»ýÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é <P>´Â »ý·«µË´Ï´Ù.`,
          Instrument_Event: `Àû¾îµµ <O_Os1...n> ÁßÀÇ ÇÏ³ª°¡ ±×°ÍÀ» ÇÊ¿ä·Î ÇÏ´Â <P>¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Invocation_OUT: `<P>´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ È£ÃâÇÕ´Ï´Ù.`,
          Invocation_IN: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª°¡ <P>¸¦ È£ÃâÇÕ´Ï´Ù.`,
          InOut: `<P> changes <O> from <s1> to at least one of <O_Os2...n>.`
        },
        object: {
          Result: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª°¡ <O_Os>¸¦ ¸¸µé¾î³À´Ï´Ù`,
          Consumption: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â <O_Os>¸¦ »ç¿ëÇÕ´Ï´Ù`,
          Consumption_Event: `<O_Os>´Â Àû¾îµµ ½ÃÀÛ ÇÁ·Î¼¼½º¸¦ »ç¿ëÇÏ´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Consumption_Condition_state: `¸¸¾à  <O>°¡ <s1>ÀÌ¶ó¸é Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ ¹ß»ý ÇÁ·Î¼¼½º´Â <O>, ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Consumption_Condition: `¸¸¾à <O_Os>°¡ Á¸ÀçÇÑ´Ù¸é Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª°¡ ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ ¹ß»ý ÇÁ·Î¼¼½º´Â <O_Os>¸¦ »ç¿ëÇÏ°í, ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Effect: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â <O_Os>¿¡ ¿µÇâÀ» ÁÝ´Ï´Ù`,
          Effect_Event: `<O_Os>´Â Àû¾îµµ ¹ß»ý ÇÁ·Î¼¼½º¿¡ ¿µÇâÀ» ÁÖ´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù.`,
          Effect_Condition: `¸¸¾à <O_Os>°¡ Á¸ÀçÇÑ´Ù¸é Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â ¹ß»ýÇÕ´Ï´Ù. ÀÌ °æ¿ì¿¡ ¹ß»ý ÇÁ·Î¼¼½º´Â <O_Os>¿¡ ¿µÇâÀ» ÁÖ°í, ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Agent: `<O_Os>´Â Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Event: `<O_Os>´Â Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª¸¦ ½ÃÀÛ½ÃÅ°°í Ã³¸®ÇÕ´Ï´Ù.`,
          Agent_Condition: `¸¸¾à <O_Os>°¡ Á¸ÀçÇÑ´Ù¸é Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Ã³¸®ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Agent_Condition_state: `¸¸¾à <O>°¡ <s1>ÀÌ¶ó¸é <O>°¡ Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª¸¦ Ã³¸®ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Instrument: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â <O_Os>¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù`,
          Instrument_Event: `<O_Os>´Â Àû¾îµµ <O_Os>¸¦ ÇÊ¿ä·ÎÇÏ´Â <P1...n> ÁßÀÇ ÇÏ³ª¸¦ ½ÃÀÛ½ÃÅµ´Ï´Ù`,
          Instrument_Condition: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â <O_Os>¸¦ ÇÊ¿ä·Î ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`,
          Instrument_Condition_state: `Àû¾îµµ <P1...n> ÁßÀÇ ÇÏ³ª´Â <O>°¡ <s1>ÀÓÀ» ÇÊ¿ä·Î ÇÕ´Ï´Ù. ±×·¸Áö ¾ÊÀ¸¸é ÀÌµé ÇÁ·Î¼¼½ºµéÀº »ý·«µË´Ï´Ù.`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; Á¦ÇÑ <tag>`,
      probability: `<O_Os> È®·ü <tag>`,
      rate: `<O_Os> ºñÀ² <tag> <units>`,
      path: `°æ·Î <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `¼±ÅÃ»çÇ×`,
      "*": `¼±ÅÃÀû`,
      "+": `Àû¾îµµ ÇÏ³ª`,
      "n..n": `<n1> ´ë <n2>`,
      "n..*": `<n1> ´ë ´Ù¼ö`
    },
    ranges: {
      "<=": `ÀÌÇÏ`,
      ">=": "ÀÌ»ó",
      "=": "°°À½",
      "<>": "´Ù¸§",
      "<": `¹Ì¸¸`,
      ">": "ÃÊ°ú"
    },
    object: {
      thing_generic_name: `물체`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O>´Â <a>ÀÔ´Ï´Ù.`,
      default_affiliation: `<O>´Â <e>ÀÔ´Ï´Ù.`,
      non_default: `<O>´Â <e> ±×¸®°í <a>ÀÔ´Ï´Ù.`,
      singleInzoom: `<SD_Parent>À¸·ÎºÎÅÍ <O>´Â ¼øÂ÷ÀûÀ¸·Î ¹ß»ýÇÏ´Â <T_list> ¾ÈÀ¸·Î <Current_SD> ÁÜÀÎµË´Ï´Ù.`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<SD_Parent>À¸·ÎºÎÅÍ <O>´Â <P_list> ±×¸®°í <O_list> ¾ÈÀ¸·Î <Current_SD> ÁÜÀÎµË´Ï´Ù.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `'¼öÁ÷¼ø¼­ <O1...n>`,
      object_list_parallel: `¼öÆò¼ø¼­ <O1...n>`
    },
    process: {
      thing_generic_name: `프로세스`,
      default_essence_affiliation: ``,
      default_essence: `<P>´Â <a>ÀÔ´Ï´Ù.`,
      default_affiliation: `<P>´Â <e>ÀÔ´Ï´Ù.`,
      non_default: `<P>´Â <e> ±×¸®°í <a>ÀÔ´Ï´Ù.`,
      singleInzoom: `<SD_Parent>À¸·ÎºÎÅÍ <P>´Â ¼øÂ÷ÀûÀ¸·Î ¹ß»ýÇÏ´Â <T_list> ¾ÈÀ¸·Î <Current_SD> ÁÜÀÎµË´Ï´Ù.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<SD_Parent>À¸·ÎºÎÅÍ <P>´Â <P_list> ±×¸®°í <O_list> ¾ÈÀ¸·Î <Current_SD> ÁÜÀÎµË´Ï´Ù.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      // 'process_list_parallel': `¼öÆò¼ø¼­ <P1...n>`,
      process_list_parallel: `ÆòÇà <P1...n>`,
      // 'process_list_sequence': `¼öÁ÷¼ø¼­ <P1...n>`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `<P>ÀÇ ±â´ëÁö¼Ó°ªÀº <exp> <units>ÀÔ´Ï´Ù.`,
      min_duration: `<P>ÀÇ ÃÖ¼ÒÁö¼Ó°ªÀº <min> <units>ÀÔ´Ï´Ù.`,
      max_duration: `<P>ÀÇ ÃÖ´ëÁö¼Ó°ªÀº <max> <units>ÀÔ´Ï´Ù.`,
      min_max_range_duration: `<P>ÀÇ ÃÖ¼ÒÁö¼Ó°ª, ÃÖ´ëÁö¼Ó°ªÀº °¢°¢ <min> <units>, <max> <units>ÀÔ´Ï´Ù.`,
      min_exp_range_duration: `<P>ÀÇ ÃÖ¼ÒÁö¼Ó°ª, ±â´ëÁö¼Ó°ª °¢°¢ <min> <units>, <exp> <units>ÀÔ´Ï´Ù.`,
      exp_max_range_duration: `<P>ÀÇ ±â´ëÁö¼Ó°ª, ÃÖ´ëÁö¼Ó°ªÀº °¢°¢ <exp> <units>, <max> <units>ÀÔ´Ï´Ù.`,
      expected_range_duration: `<P>ÀÇ ÃÖ¼ÒÁö¼Ó°ª, ±â´ëÁö¼Ó°ª, ÃÖ´ëÁö¼Ó°ªÀº °¢°¢ <min> <units>, <exp> <units>, <max> <units>ÀÔ´Ï´Ù.`
    },
    state: {
      single_state: `<O>´Â <s>ÀÔ´Ï´Ù.`,
      multiple_states: `<O>´Â <s1...n>°¡ µÉ ¼ö ÀÖ½À´Ï´Ù.`,
      all_states_are_suppressed: `<O> is stateful.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> is <s> and can be at one of <num> other states.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> can be <s1...n> or at one of <num> other states.`,
      default: `<s>´Â ±âº»»óÅÂÀÔ´Ï´Ù.`,
      default_initial: `<s>´Â ±âº»»óÅÂÀÌ°í ÃÊ±â»óÅÂÀÔ´Ï´Ù.`,
      initial: `<s>´Â ÃÊ±â»óÅÂÀÔ´Ï´Ù.`,
      final: `<s>´Â ¸¶Áö¸·»óÅÂÀÔ´Ï´Ù.`,
      default_initial_final: `<s>´Â ÃÊ±â»óÅÂ, ¸¶Áö¸·»óÅÂ, ±âº»»óÅÂÀÔ´Ï´Ù.`,
      initial_final: `<s>´Â ÃÊ±â»óÅÂÀÌ°í ¸¶Áö¸·»óÅÂÀÔ´Ï´Ù.`,
      default_final: `<s>´Â ¸¶Áö¸·»óÅÂÀÌ°í ±âº»»óÅÂÀÔ´Ï´Ù.`,
      none: ``,
      Current: `<O> is currently at state <s>.`,
      // 'timeDurational': {
      expected_duration: `<s>ÀÇ ±â´ëÁö¼Ó°ªÀº <exp> <units>ÀÔ´Ï´Ù.`,
      min_duration: `<s>ÀÇ ÃÖ¼ÒÁö¼Ó°ªÀº <min> <units>ÀÔ´Ï´Ù.`,
      max_duration: `<s>ÀÇ ÃÖ´ëÁö¼Ó°ªÀº <max> <units>ÀÔ´Ï´Ù.`,
      min_max_range_duration: `<s>ÀÇ ÃÖ¼ÒÁö¼Ó°ª, ÃÖ´ëÁö¼Ó°ªÀº °¢°¢ <min> <units>, <max> <units>ÀÔ´Ï´Ù.`,
      min_exp_range_duration: `<s>ÀÇ ÃÖ¼ÒÁö¼Ó°ª, ±â´ëÁö¼Ó°ª °¢°¢ <min> <units>, <exp> <units>ÀÔ´Ï´Ù.`,
      exp_max_range_duration: `<s>ÀÇ ±â´ëÁö¼Ó°ª, ÃÖ´ëÁö¼Ó°ªÀº °¢°¢ <exp> <units>, <max> <units>ÀÔ´Ï´Ù.`,
      expected_range_duration: `<s>ÀÇ ÃÖ¼ÒÁö¼Ó°ª, ±â´ëÁö¼Ó°ª, ÃÖ´ëÁö¼Ó°ªÀº °¢°¢ <min> <units>, <exp> <units>, <max> <units>ÀÔ´Ï´Ù.`,
      default_time_units: `seconds`
      // },
    },
    essence: {
      physical: `¹°¸®Àû`,
      informatical: `Á¤º¸Àû`
    },
    affiliation: {
      systemic: `½Ã½ºÅÛÀû`,
      environmental: `È¯°æÀû`
    },
    semifolding: {
      object: `<O> lists `,
      process: `<P> lists `,
      aggregation: {
        single: `<T> as a part`,
        multiple: `<T1...n-1> and <Tn> as parts`
      },
      exhibition: {
        single: `<T> as a feature`,
        multiple: `<T1...n-1> and <Tn> as features`
      },
      generalization: {
        single: `<T> as a specialization`,
        multiple: `<T1...n-1> and <Tn> as specializations`
      },
      instantiation: {
        single: `<T> as an instance`,
        multiple: `<T1...n-1> and <Tn> as instances`
      }
    },
    hidden_attributes: {
      requirement: `<set_object> of <owner> is <value>.`
    },
    father_model_to_sub_model: `The selected things, <o1...n>, and <p1...n> are refined in sub model <subsystem_name> subsystem model view.`,
    sub_model_from_father_model: `The <subsystem_name> subsystem model view is derived from the <father_model_name> model.`
  };
  // export function changeOplTemplates(){
  // oplTemplates = oplDefaultSettings[oplDefaultSettings.language];
  // changeOplTable();
  // if(this.OplService.orgOplSettings.language === 'cn')
  // oplTemplates = oplTemplates_cn;
  // console.log(oplTemplates);
  // };
  // export function updateDefaultSettings(uSettings, oSettings){
  //   userOplSettings = uSettings;
  //   orgOplSettings = oSettings;
  //   for (const key of Object.keys(oplDefaultSettings)){
  //     if (uSettings[key]){
  //       oplDefaultSettings[key]=uSettings[key];
  //     }else{
  //       oplDefaultSettings[key]=oSettings[key];
  //     }
  //   }
  //   // for (const field of Object.keys(oplTemplates)){
  //   //   for (const key of Object.keys(oplTemplates[field])){
  //   //     if()
  //   //   }
  //   // }
  //   oplTemplates = oSettings.oplTables[uSettings.language];
  //   changeOplTable();
  // }
  /*
   * oplTable defines necessary fields in linkTable
   * and the linkTable is constructed in changeOplTable function based on oplTable
  */
  const oplTable = {
    "O1-O2": {
      "Aggregation-Participation": `<O1> consists of <O2>.`,
      Unidirectional_Tagged_Link: `<O1> relates to <O2>.`,
      Bidirectional_Tagged_Link: `<O1> and <O2> are equivalent.`,
      "Exhibition-Characterization": `<O1> exhibits <O2>.`,
      "Generalization-Specialization": `<O2> is a <O1>.`,
      "Unidirectional_Tagged_Link_(tag)": `<O1> <tag> <O2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      "Bidirectional_Tagged_Link_(tag)": `<O1> and <O2> are <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<O1> <forward tag> <O2>, and <O2> <backward tag> <O1>.`,
      "Classification-Instantiation": `<O2> is an instance of <O1>.`
    },
    "P1-P2": {
      Overtime_exception: `<P2> occurs if <P1> lasts more than <maxtime> <units>.`,
      Undertime_exception: `<P2> occurs if <P1> falls short of <mintime> <units>.`,
      "Aggregation-Participation": `<P1> consist of <P2>.`,
      "Exhibition-Characterization": `<P1> exhibits <P2>.`,
      "OvertimeUndertime-exception": `<P2> occurs if <P1> falls short of <mintime> <units> or lasts more than <maxtime> <units>.`,
      Unidirectional_Tagged_Link: `<P1> relates to <P2>.`,
      Invocation: `<P1> invokes <P2>.`,
      Bidirectional_Tagged_Link: `<P1> and <P2> are equivalent.`,
      "Generalization-Specialization": `<P2> is a <P1>.`,
      "Classification-Instantiation": `<P2> is an instance of <P1>.`,
      "Unidirectional_Link_(tag)": `<P1> <tag> <P2>.`,
      "Bidirectional_Link_(tag)": `<P1> and <P2> are <forward tag>.`,
      "Bidirectional_Link_(ftag,btag)": `<P1> <forward tag> <P2> and <P2> <backward tag> <P1>.`
    },
    "P1-P1 (same process)": {
      Invocation: `<P1> invokes itself.`
    },
    "P1-P2 (parent process)": {
      Invocation: `<P1> invokes <P2>.`
    },
    "O-P": {
      Agent: `<O> handles <P>.`,
      Agent_Negation: `<P1...n> occurs if <O_Os> is not present.`,
      Agent_Condition: `<P> occurs if <O> exists, otherwise <P> is skipped.`,
      Agent_Condition_Negation: `<P1...n> occurs if <O_Os> is not present, otherwise all these processes are skipped.`,
      Agent_Event: `<O> initiates and handles <P>.`,
      Consumption: `<P> consumes <O>.`,
      Consumption_Negation: `<P> does not consume <O>.`,
      Consumption_Condition: `<P> occurs if <O> exists, in which case<P>  consumes <O>, otherwise <P>  is skipped.`,
      Consumption_Condition_Negation: `<P> occurs if <O> does not exist, in which case<P>  consumes <O>, otherwise <P>  is skipped.`,
      Consumption_Event: `<O> initiates <P>, which consumes <O>.`,
      Instrument: `<P> requires <O>.`,
      Instrument_Negation: `<P> occurs if <O> does not exist.`,
      Instrument_Condition: `<P> occurs if <O> exists, otherwise <P>  is skipped.`,
      Instrument_Condition_Negation: `<P> occurs if <O> does not exist, otherwise <P>  is skipped.`,
      Instrument_Event: `<O> initiates <P>, which requires <O>.`,
      "Exhibition-Characterization": `<O> exhibits <P>.`,
      Effect: `<P> affects <O>.`,
      Effect_Negation: `<P> does not affect <O>.`,
      Effect_Event: `<O> initiates <P>, which affects <O>`,
      Effect_Condition: `<P> occurs if <O> exists, in which case <P>  affects <O>, otherwise <P>  is skipped.`,
      Effect_Condition_Negation: `<P> occurs if <O> does not exist, in which case <P>  affects <O>, otherwise <P>  is skipped.`
    },
    "P-O": {
      "Exhibition-Characterization": `<P> exhibits <O>.`,
      Result: `<P> yields <O>.`,
      Effect: `<P> affects <O>.`,
      Effect_Negation: `<P> does not affect <O>.`,
      Effect_Event: `<O> initiates <P>, which affects <O>`,
      Effect_Condition: `<P> occurs if <O> exists, in which case<P>  affects <O>, otherwise <P>  is skipped.`,
      Effect_Condition_Negation: `<P> occurs if <O> does not exist, in which case<P>  affects <O>, otherwise <P>  is skipped.`
    },
    "Os-(P)-O (from object state to the same object)": {
      Overtime_exception: `<O> triggers <P> when <O> is <s> more than <maxtime> <units>, in which case <P> changes <O>.`,
      "Condition_Input ": `<P> occurs if <O> is <s>, in which case <P> changes <O> from <s> , otherwise <P>  is skipped.`,
      "In-out_Link_Pair": `<P> changes <O> from <s>.`,
      "In-out_Link_Pair_Condition": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Event": `<O> at state <s1> initiates <P>, which changes <O> from <s1> to <s2>.`
    },
    "O1s-O2": {
      "Generalization-Specialization": `<O2> is a <O1> at state <s>.`,
      "Aggregation-Participation": `<O1> <s> consists of <O2>.`,
      "Bidirectional_Tagged_Link_(tag)": `<s> <O1> and <O2> are <forward tag>.`,
      Unidirectional_Tagged_Link: `<s> <O1> relates to <O2>.`,
      Bidirectional_Tagged_Link: `<s> <O1> and <O2> are equivalent.`,
      "Unidirectional_Tagged_Link_(tag)": `<s> <O1> <tag> <O2>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<s> <O1>  <forward tag> <O2>, and <O2> <backward tag> <s> <O1>.`,
      "Exhibition-Characterization": `<s> <O1> exhibits <O2>.`
    },
    "P-Os": {
      "In-out_Link_Pair": `<P> changes <O> from <s1> to <s2>.`,
      Split_output: `<P> changes <O> to <s>.`,
      "In-out_Link_Pair_Condition": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Event": `<O> at state <s1> initiates <P>, which changes <O> from <s1> to <s2>.`,
      "Exhibition-Characterization": `<P> exhibits <s> <O>.`,
      Result: `<P> yields <s> <O>.`
    },
    "O1s1-O2s2": {
      Unidirectional_Tagged_Link: `<s1> <O1> relates to <s2> <O2>.`,
      "Bidirectional_Tagged_Link_(tag)": `<s1> <O1> and <s2> <O2> are <forward tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<s1> <O1> <forward tag> <s2><O2>, and <s2><O2> <backward tag><s1> <O1>.`,
      Bidirectional_Tagged_Link: `<s1> <O1> and <s2> <O2> are equivalent.`,
      "Unidirectional_Tagged_Link_(tag)": `<s1> <O1> <tag> <s2> <O2>.`,
      "Exhibition-Characterization": `<s> <O1> exhibits <s2> <O2>.`
    },
    "O1-T2..n (n>=2 many destinations)": {
      "Aggregation-Participation": `<O1> consist of <T1...n-1> and <Tn>.`,
      Unidirectional_Tagged_Link: `<O1> relates to <T1...n-1> and <Tn>.`,
      "Generalization-Specialization": `<T1...n-1> and <Tn> are <O1>.`,
      "Classification-Instantiation": `<T1...n-1> and <Tn> are instances of <O1>.`,
      "Unidirectional_Tagged_Link_(tag)": `<O1> <tag> <T1...n-1> and <Tn>.`,
      "Exhibition-Characterization": `<O1> exhibits <T1...n-1> and <Tn>.`
    },
    "P1-T2..n (n>=2 many destinations)": {
      "Exhibition-Characterization": `<P1> exhibits <T1...n-1> and <Tn>.`,
      "Aggregation-Participation": `<P1> consist of <T1...n-1> and <Tn>.`,
      Unidirectional_Tagged_Link: `<P1> relates to <T1...n-1> and <Tn>.`,
      "Generalization-Specialization": `<T1...n-1> and <Tn> are <P1>.`,
      "Classification-Instantiation": `<T1...n-1> and <Tn> are instances of <P1>.`,
      "Unidirectional_Tagged_Link_(tag)": `<P1> <tag> <T1...n-1> and <Tn>.`
    },
    "O1s1-T2..n (n>=2 many destinations)": {
      "Exhibition-Characterization": `<s1> <O1> exhibits <T1...n-1> and <Tn>.`
    },
    "O1-O2s": {
      "Aggregation-Participation": `<O1> consists of <s> <O2>.`,
      "Bidirectional_Link_(tag)": `<O1> and <s> <O2> are <forward tag>.`,
      Unidirectional_Tagged_Link: `<O1> relates to <s> <O2>.`,
      Bidirectional_Tagged_Link: `<O1> and <s> <O2> are equivalent.`,
      "Unidirectional_Link_(tag)": `<O1> <tag> <s> <O2>.`,
      "Bidirectional_Link_(ftag,btag)": `<O1> <forward tag> <s><O2> and <s><O2> <backward tag> to  <O1>.`,
      "Exhibition-Characterization": `<O1> exhibits <s> <O2>.`
    },
    "Os1-(P)-Os2 (same object)": {
      Overtime_exception: `<O> triggers <P> when <O> is <s1> more than <maxtime> <units>, in which case <P> changes <O> to <s2>.`,
      "Condition_Input ": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P>  is skipped.`,
      "In-out_Link_Pair": `<P> changes <O> from <s1> to <s2>.`,
      "In-out_Link_Pair_Condition": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Event": `<O> at state <s1> initiates <P>, which changes <O> from <s1> to <s2>.`
    },
    "Os-P": {
      "In-out_Link_Pair": `<P> changes <O> from <s1> to <s2>.`,
      Agent: `<s> <O> handles <P>.`,
      Agent_Negation: `<P> occurs if <O> is not at state <s>.`,
      Agent_Condition: `<P> occurs if <O> is <s>, otherwise <P> is skipped.`,
      Agent_Condition_Negation: `<P> occurs if <O> is not at state <s>, otherwise <P> is skipped.`,
      Agent_Event: `<s> <O> initiates and handles<P>.`,
      Consumption: `<P> consumes <s> <O>.`,
      Consumption_Negation: `<P> does not consume <s> <O>.`,
      Consumption_Condition: `<P> occurs if <O> is at state <s>, in which case <P> consumes <O>, otherwise <P> is skipped.`,
      Consumption_Condition_Negation: `<P> occurs if <O> is not at state <s>, in which case <P> consumes <O>, otherwise <P> is skipped.`,
      Consumption_Event: `<s> <O> initiates <P>, which consumes <O>.`,
      Split_input: `<P> changes <O> from <s>.`,
      "In-out_Link_Pair_Condition": `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P> is skipped.`,
      "In-out_Link_Pair_Event": `<O> at state <s1> initiates <P>, which changes <O> from <s1> to <s2>.`,
      Instrument: `<P> requires <s> <O>.`,
      Instrument_Negation: `<P> occurs if <O> is not at state <s>.`,
      Instrument_Condition: `<P> occurs if <O> is at state <s>, otherwise <P> is skipped.`,
      Instrument_Condition_Negation: `<P> occurs if <O> is not at state <s>, otherwise <P> is skipped.`,
      Instrument_Event: `<s> <O> initiates <P>, which requires <s> <O>.`,
      Overtime_exception: `<O> triggers <P> when <O> is <s> more than <maxtime> <units>.`,
      Undertime_exception: `<O> triggers <P> when <O> is <s> less than <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> triggers <P> when <O> is <s> more than <maxtime> <units> and less than <mintime> <units>.`,
      "Exhibition-Characterization": `<s> <O> exhibits <P>.`
    }
  };
  const oplTemplates_jp = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> は <T2> から構成されます。`,
      "Aggregation-Participation_incomplete": `<T1> consists of <T2> and <num> more parts.`,
      "Aggregation-Participation_(multiple)": `<T1> は <T2...n> から構成されます。`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consists of <T2...n> and <num> more parts.`,
      "Generalization-Specialization": `<T2> は <T1> です。`,
      "Generalization-Specialization_incomplete": `<T2> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> は <T1> です。`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> and <num> more specializations are <T1>.`,
      "Classification-Instantiation": `<T2> は <T1> のインスタンスです。`,
      "Classification-Instantiation_incomplete": `<T2> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> は <T1> のインスタンスです。`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> are instances of <T2> and <num> more parts.`,
      "Exhibition-Characterization": `<T1> は <T2> を表します。`,
      "Exhibition-Characterization_incomplete": `<T1> exhibits <T2> and <num> more attributes.`,
      "Exhibition-Characterization_(multiple)": `<T1> は <T2...n> を表します。`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibits <T2...n> and <num> more attributes.`,
      Unidirectional_Tagged_Link: `<T1> は <T2> に関係します。`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2> 。`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> と <T2> は同じです。`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> と <T2> は <tag> です。`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, と <T2> <backward tag> <T1> 。`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> は <P> を処理します。`,
      "Agent_(multiple)": `<O\Os1...n> は <P> を処理します。`,
      Agent_Condition: `<O> が存在する場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
      "Agent_Condition(multiple)": `<O\Os1...n> が存在する場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
      Agent_Condition_state: ` <O> が <s> の場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
      Agent_Event: `<O> は <P> を開始して処理します。`,
      "Agent_Event(multiple)": `<O\Os1...n> は <P> を開始して処理します。`,
      Agent_Event_state: `<s> <O> は <P> を開始して処理します。`,
      Instrument: `<P> は <O_Os> を要求します。`,
      "Instrument_(multiple)": `<P> は <O\Os1...n> を要求します。`,
      Instrument_Condition: `<O> が存在する場合、<P> が発生します。そうでなければ、 <P> はスキップします。`,
      "Instrument_Condition(multiple)": `<O\Os1...n> が存在する場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
      Instrument_Condition_state: ` <O> が <s> 状態の場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
      Instrument_Event: `<O> は <O>を要求する<P> を開始します。`,
      "Instrument_Event(multiple)": `<O\Os1...n> は、それらを要求する <P> を開始します。`,
      Instrument_Event_state: `<s> <O> は <s> <O> を要求する <P> を開始します。`,
      Effect: `<P> は <O_Os> に影響を与えます。`,
      "Effect_(multiple)": `<P> は <O\Os1...n> に影響を与えます。`,
      Effect_Condition: `<O> が存在する場合、<P> が発生します。この場合、 <P> は <O> に影響を与えます。そうでなければ、 <P> はスキップします。`,
      "Effect_Condition(multiple)": `<O\Os1...n> が存在する場合、<P>  が発生します。この場合、<P> はそれらに影響を与えます。そうでなければ、 <P> はスキップします。`,
      Effect_Condition_state: `<O> が <s> 状態の場合、<P> が発生します。この場合、 <P> は <s> <O> に影響を与えます。そうでなければ、<P> はスキップします。`,
      Effect_Event: `<O> は  <O> に影響を与える <P> を開始します。`,
      "Effect_Event(multiple)": `<O\Os1...n> は <O> に影響を与える <P> を開始します。`,
      Effect_Event_state: `<s> <O> は <s> <O> に影響を与える <P> を開始します。`,
      Consumption: `<P> は <O_Os> を消費します。`,
      "Consumption_(multiple)": `<P> は <O\Os1...n> を消費します。`,
      Consumption_Condition: `<O> が存在する場合、<P> が発生します。この場合、 <P> は <O> を消費します。 そうでなければ、 <P> はスキップします。`,
      "Consumption_Condition(multiple)": `<O\Os1...n> が存在する場合、<P> が発生します。この場合、 <P> がそれらを消費します。 そうでなければ、 <P> はスキップします。`,
      Consumption_Condition_state: `<O> が <s> 状態の場合、<P> が発生します。この場合、 <P> は <s> <O> を消費します。, そうでなければ、 <P> はスキップします。`,
      Consumption_Event: `<O> が  <O> を消費する <P> を開始します。`,
      "Consumption_Event(multiple)": `<O\Os1...n> がそれらを消費する <P> を開始します。`,
      Consumption_Event_state: `<s> <O> は  <s> <O> を消費する <P> を開始します。`,
      Result: `<P> は <O_Os> を引き渡します。`,
      "Result_(multiple)": `<P> は <O\Os1...n> を引き渡します。`,
      "In-out_Link_Pair": `<P> は <O> を <s1> から <s2> に変更します。`,
      "In-out(group)": `<O> は <s1> から <s2>`,
      "In-out_Link_Pair(group)": `<P> は <O> を <s1> から <s2><Other_changes> へ変更します。`,
      Split_input: `<P> は <O> を <s> から別の状態に変更します。`,
      Split_output: `<P> は <O> を別の状態から <s> に変更します。`,
      Condition_Input: `<O> が <s1> の場合、 <P> が発生します。 この場合、 <P> は <O> を <s1> から <s2> に変更します。そうでなければ、 <P> はスキップします。`,
      "In-out_Link_Pair_Condition": `<O> が <s1> の場合、<P> が発生します。この場合、 <P> は <O> を <s1> から <s2> に変更します。そうでなければ、 <P> はスキップします。`,
      "In-out_Link_Pair_Condition(group)": `<O> が <s1> の場合、<P>  が発生します。この場合、<P> は <O> を <s1> から <s2> へ変更します。そうでなければ、 <P> はスキップします。`,
      "In-out_Link_Pair_Event": `<s1> <O> は <O> を <s1> から <s2> に変更する <P> を開始します。`,
      "In-out_Link_Pair_Event(group)": `<s1> 状態の <O> は <O> を <s1> から <s2> に変更する <P> を開始します。`,
      Overtime_exception: `<O> が <maxtime> <units> よりも多い <s> の時に、 <O> は <P> を引き起こします。`,
      Undertime_exception: `<O> が <mintime> <units> よりも少ない <s> の時に、<O> は <P> 引き起こします。`,
      "OvertimeUndertime-exception": `<O> が <maxtime> <units> よりも多い、または、 <mintime> <units> よりも少ない <s> の時に、 <O> は <P> 引き起こします。`,
      "Overtime_exception_(process)": `<P1> が <maxtime> <units> よりも多く持続する場合、<P2> が発生します。`,
      "Undertime_exception_(process)": `<P1> が <mintime> <units> に達しない場合、<P2> が発生します。`,
      "OvertimeUndertime-exception_(process)": `<P1> が <mintime> <units> に達しない、または、 <maxtime> <units> よりも多く持続する場合、<P2> が発生します。`,
      Invocation: `<P1> は <P2> を呼び出します。`,
      "Invocation_(multiple)": `<P1> は <P2...n> を呼び出します。`,
      "Invocation_(self)": `<P1> は自分自身を呼び出します。`,
      "Invocation_(parent)": `<P1> は <P2> を呼び出します。`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> と <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>、同様に<P1...n>`,
      AND: `<T1...n-1> と <Tn>`,
      OR: `<T1...n-1> または <Tn>`,
      XOR: `<T1> と <T2> の排他的論理和`,
      "Stateful-Object": `<s> 状態の <O>`,
      "Stateful-Object-value": `<O> 値が <s>`,
      "Stateful-Object-value(multiple)": `<O> 値が <s1...n>`,
      "Stateful-Object(multiple)": `<s1...n> 状態の <O>`,
      "Attribute-Exhibitor": `<e1...n> の <T> `,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> と <change>.`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object.
      XOR: {
        process: {
          Result: "<P> は <O_Os1...n> のうちの1つを引き渡します。",
          "Result(brothers)": "<P> は <s1...n> のいずれかの状態にある <O> を引き渡します。",
          Consumption: `<P> は <O_Os1...n> のうちの1つを消費します。`,
          "Consumption(brothers)": `<P> は <s1...n> のいずれかの状態にある <O> を引き渡します。`,
          Consumption_Condition: `<O_Os1...n> のうちの1つが存在する場合、 <P> が発生します。この場合、 <P> は既存のものを消費します。そうでなければ、 <P> はスキップします。`,
          "Consumption_Condition(brothers)": `<O> が <s1...n> のいずれかの状態にある場合、<P> が発生します。この場合、 <P> はそれを消費します。そうでなければ、 <P> はスキップします。`,
          Consumption_Event: `<O_Os1...n> のうちの1つが、それを消費する <P> を開始します。`,
          "Consumption_Event(brothers)": `<O> が <s1...n> のいずれかの状態の時に、それを消費する <P> を開始します。`,
          Effect: `<P> は <O_Os1...n> のうちの1つに影響を与えます。`,
          "Effect(brothers)": `<P> は <s1...n> のいずれかの状態にある <O> に影響を与えます。`,
          Effect_Condition: `<O_Os1...n> のうちの1つが存在する場合、 <P> が発生します。この場合、 <P> はそれに影響を与えます。そうでなければ、 <P> はスキップします。`,
          "Effect_Condition(brothers)": `<s1...n> のいずれかの状態にある <O> が存在する場合、<P> が発生します。この場合、 <P> はそれに影響を与えます。そうでなければ、 <P> はスキップします。`,
          Effect_Event: `<O_Os1...n> のうちの1つは、それに影響を与える <P> を開始します。`,
          "Effect_Event(brothers)": `<O> は <s1...n> のいずれかの状態の時に、それに影響を与える <P> を開始します。`,
          Agent: `Exactly one of <O_Os1...n> は <P> を処理します。`,
          "Agent(brothers)": `<O> は <s1...n> のいずれかの状態の時に <P> を処理します。`,
          Agent_Event: `<O_Os1...n> のうちの1つが、 <P> を開始して処理します。`,
          "Agent_Event(brothers)": `<O> は <s1...n> のいずれかの状態の時に <P> を開始して処理します。`,
          Agent_Condition: `<O_Os1...n> のうちの1つが存在する場合、<P> が発生します。そうでなければ、 <P> はスキップします。`,
          "Agent_Condition(brothers)": `<O> が <s1...n> のいずれかの状態の場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
          Instrument: `<P> は <O_Os1...n> のうちの1つを要求します。`,
          "Instrument(brothers)": `<P> は <s1...n> のいずれかの状態の <O> を要求します。`,
          Instrument_Condition: `<O_Os1...n> のうちの1つが存在する場合、<P> が発生します。そうでなければ、 <P> はスキップします。`,
          "Instrument_Condition(brothers)": `<O> が <s1...n> のいずれかの状態である場合、<P>  が発生します。そうでなければ、 <P> はスキップします。`,
          Instrument_Event: `Exactly one of <O_Os1...n> のうちの1つが、それを要求する <P> を開始します。`,
          "Instrument_Event(brothers)": `<O> は、 <s1...n> のいずれかの状態の場合に、それを要求する <P> を開始します。`,
          Invocation_OUT: `<P> は <P1...n> のいずれかを呼び出します。`,
          Invocation_IN: `<P1...n> のいずれかは <P> を呼び出します。`,
          InOut: `<P> changes <O> from <s1> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> changes <O> from exactly one of <ins1..n> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> changes <O> from exactly one of <ins1..n> to <s1>.`
        },
        object: {
          Result: `<P1...n> のうちの1つが <O_Os> が引き渡します。`,
          Consumption: `<P1...n> のうちの1つが <O_Os> を消費します。`,
          Consumption_Event: `<O_Os> は <P1...n> のうちの1つを開始します。それは開始したプロセスを消費します。`,
          Consumption_Condition_state: `<O> が <s1> の場合、 <P1...n> のうちの1つが発生します。この場合、発生しているプロセスは <O> を消費します。そうでなければ、これらのプロセスはスキップします。`,
          Consumption_Condition: `<O_Os> が存在する場合、<P1...n> のうちの1つが発生します。この場合、発生しているプロセスは <O_Os> を消費します。そうでなければ、これらのプロセスはスキップします。`,
          Effect: `<P1...n> のうちの1つは <O_Os> に影響を与えます。`,
          Effect_Event: `<O_Os> は <P1...n> のうちの1つを開始します。それは発生しているプロセスに影響を与えます。`,
          Effect_Condition: `<O_Os> が存在する場合、 <P1...n> が発生します。この場合、発生しているプロセスは <O_Os> に影響を与えます。そうでなければ、これらのプロセスはスキップします。`,
          Agent: `<O_Os> は <P1...n> のうちの1つを処理します。`,
          Agent_Event: `<O_Os> は <P1...n> のうちの1つを開始して処理します。`,
          Agent_Condition: `<O_Os> が存在する場合、 <O_Os> は <P1...n> のうちの1つを処理します。そうでなければ、これらのプロセスはスキップします。`,
          Agent_Condition_state: `<O> が <s1> の場合、 <O> は <P1...n> のうちの1つを処理します。そうでなければ、これらのプロセスはスキップします。`,
          Instrument: `<P1...n> のうちの1つは <O_Os> を要求します。`,
          Instrument_Event: `<O_Os> は <P1...n> のうちの1つを開始します。それは <O_Os> を要求します。`,
          Instrument_Condition: `<P1...n> のうちの1つは <O_Os> を要求します。そうでなければ、これらのプロセスはスキップします。`,
          Instrument_Condition_state: `<P1...n> のうちの1つは <O> が <s1> であることを要求します。そうでなければ、これらのプロセスはスキップします。`
        }
      },
      OR: {
        process: {
          Result: "<P> は、少なくとも<O_Os1...n> のうちの1つを引き渡します。",
          Consumption: `<P> は、少なくとも <O_Os1...n> のうちの1つを消費します。`,
          Consumption_Condition: `少なくとも <O_Os1...n> のうちの1つが存在する場合、<P> が発生します。この場合、 <P> は、既存のものを消費します。そうでなければ、 <P> はスキップします。`,
          Consumption_Event: `少なくとも <O_Os1...n> のうちの1つが、それを消費する <P>を開始します。`,
          Effect: `<P> は、少なくとも <O_Os1...n> のうちの1つに影響を与えます。`,
          Effect_Condition: `少なくとも <O_Os1...n> のうち1つが存在する場合、<P> が発生します。この場合、 <P> はそれに影響を与えます。そうでなければ、 <P> はスキップします。`,
          Effect_Event: `少なくとも <O_Os1...n> のうちの1つが、それに影響を与える <P> を開始します。`,
          Agent: `少なくとも <O_Os1...n> のうちの1つが <P> を処理します。`,
          Agent_Event: `少なくとも <O_Os1...n> のうちの1つが <P> を開始して処理します。`,
          Agent_Condition: `少なくとも <O_Os1...n> のうちの1つが存在する場合、 <P> が発生します。そうでなければ、 <P> はスキップします。`,
          Instrument: `<P> は、少なくとも <O_Os1...n> のうちの1つを要求します。`,
          Instrument_Condition: `少なくとも <O_Os1...n> のうちの1つが存在する場合、<P> が発生します。そうでなければ、 <P> はスキップします。`,
          Instrument_Event: `少なくとも <O_Os1...n> は、それを要求する <P> を開始します。`,
          Invocation_OUT: `<P> は、少なくとも <P1...n> のうちの1つを呼び出します。`,
          Invocation_IN: `少なくとも <P1...n> のうちの1つは、 <P> を呼び出します。`,
          InOut: `<P> changes <O> from <s1> to at least one of <O_Os2...n>.`
        },
        object: {
          Result: `少なくとも <P1...n> のうちの1つは、 <O_Os> を引き渡します。`,
          Consumption: `少なくとも <P1...n> のうちの1つは <O_Os> を消費します。`,
          Consumption_Event: `<O_Os> は、少なくとも1つの <P1...n> を開始します。それは開始したプロセスを消費します。`,
          Consumption_Condition_state: ` <O> が <s1> の場合、少なくとも <P1...n> のうちの1つが発生します。この場合、発生したプロセスは <O> を消費します。そうでなければ、これらのプロセスはスキップします。`,
          Consumption_Condition: `<O_Os>  が存在する場合、少なくとも <P1...n> のうちの1つが発生します。この場合、発生したプロセスは <O_Os> を消費します。 そうでなければ、これらのプロセスはスキップします。`,
          Effect: `少なくとも <P1...n> のうちの1つは、 <O_Os> に影響を与えます。`,
          Effect_Event: `<O_Os> は、少なくとも <P1...n> のうちの1つを開始します。それは発生しているプロセスに影響を与えます。`,
          Effect_Condition: `<O_Os> が存在する場合、少なくとも <P1...n> のうちの1つが発生します。この場合、発生しているプロセスは <O_Os> に影響を与えます。そうでなければ、これらのプロセスはスキップします。`,
          Agent: `<O_Os> は、少なくとも <P1...n> のうちの1つを処理します。`,
          Agent_Event: `<O_Os> は、少なくとも <P1...n> のうちの1つを開始して処理します。`,
          Agent_Condition: `<O_Os> が存在する場合、 <O_Os> は、少なくとも <P1...n> のうちの1つを処理します。そうでなければ、これらのプロセスはスキップします。`,
          Agent_Condition_state: `<O> が <s1> の場合、<O> は、少なくとも <P1...n> のうちの1つを処理します。, そうでなければ、これらのプロセスはスキップします。`,
          Instrument: `少なくとも <P1...n> のうちの1つは、 <O_Os> を要求します。`,
          Instrument_Event: `<O_Os> は、少なくとも <P1...n> のうちの1つを開始します。それは <O_Os> を要求します。`,
          Instrument_Condition: `少なくとも <P1...n> のうちの1つは、 <O_Os> を要求します。そうでなければ、これらのプロセスはスキップします。`,
          Instrument_Condition_state: `少なくとも <P1...n> のうちの1つは、 <O> が <s1> であることを要求します。そうでなければ、これらのプロセスはスキップします。`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; <tag>において`,
      probability: `<tag> の確率で <O_Os>`,
      rate: `<tag> <units> の割合の <O_Os>`,
      path: `次のパス <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `オプション`,
      "*": `オプション`,
      "+": `少なくとも1つ`,
      "n..n": `<n1> から <n2>`,
      "n..*": `<n1> から多`
    },
    ranges: {
      "<=": `以下`,
      ">=": "以上",
      "=": "等しい",
      "<>": "等しくない",
      "<": `より少ない`,
      ">": "より多い"
    },
    object: {
      thing_generic_name: `物体`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O> は <a> です。`,
      default_affiliation: `<O> は <e> です。`,
      non_default: `<O> は <e> と <a> です。`,
      singleInzoom: `<SD_Parent> からの <O> は、 <T_list> に <Current_SD> を拡大します。`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<SD_Parent> からの <O> は、 <P_list> と同様に <O_list> に <Current_SD> を拡大します。`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `縦方向に <O1...n>`,
      object_list_parallel: `横方向に <O1...n>`
    },
    process: {
      thing_generic_name: `処理する`,
      default_essence_affiliation: ``,
      default_essence: `<P> は <a> です。`,
      default_affiliation: `<P> は <e> です。`,
      non_default: `<P> は <e> と <a> です。`,
      singleInzoom: `<SD_Parent> からの <P> は、 時系列で発生する <T_list> に <Current_SD> を拡大します。`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<SD_Parent> からの <P> は、<O_list> と同様に  <P_list> に <Current_SD> を拡大します。`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      // 'process_list_parallel': `<P1...n>, in that horizontal sequence`,
      process_list_parallel: `並列の <P1...n>`,
      // 'process_list_sequence': `<P1...n>, in that vertical sequence`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `<P> の予想持続時間の値は <exp> <units> です。`,
      min_duration: `<P> の最小持続時間 <min> <units> です。`,
      max_duration: `<P> 最大持続時間の値は <max> <units> です。`,
      min_max_range_duration: `<P> の最小持続時間と最大持続時間の値は、それぞれ <min> <units> と <max> <units> です。`,
      min_exp_range_duration: `<P> の最小持続時間との予想持続時間の値は、それぞれ <min> <units> と <exp> <units> です。`,
      exp_max_range_duration: `<P> の予想持続時間の値はと最大持続時間の値は、それぞれ <exp> <units> と <max> <units> です。`,
      expected_range_duration: `The values of minimal Duration, expected Duration, and maximal Duration of <P> の最小持続時間、予想持続時間、最大持続時間の値は、それぞれ <min> <units> 、 <exp> <units> 、 <max> <units> です。`
    },
    state: {
      single_state: `<O> は <s> です。`,
      multiple_states: `<O> は <s1...n> になりえます。`,
      all_states_are_suppressed: `<O> is stateful.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> is <s> and can be at one of <num> other states.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> can be <s1...n> or at one of <num> other states.`,
      default: `状態 <s> はデフォルトです。`,
      default_initial: `状態 <s> はデフォルトで初期値です。`,
      initial: `状態 <s> は初期値です。`,
      final: `状態 <s> は最終値です。`,
      default_initial_final: `状態 <s> は初期値、最終値、デフォルトです。`,
      initial_final: `状態 <s> は初期値で最終値です。`,
      default_final: `状態 <s> は最終値でデフォルトです。`,
      none: ``,
      Current: `<O> is currently at state <s>.`,
      // 'timeDurational': {
      expected_duration: `<s> の予想持続時間の値は <exp> <units> です。`,
      min_duration: `<s> の最小持続時間 <min> <units> です。`,
      max_duration: `<s> 最大持続時間の値は <max> <units> です。`,
      min_max_range_duration: `<s> の最小持続時間と最大持続時間の値は、それぞれ <min> <units> と <max> <units> です。`,
      min_exp_range_duration: `<s> の最小持続時間との予想持続時間の値は、それぞれ <min> <units> と <exp> <units> です。`,
      exp_max_range_duration: `<s> の予想持続時間の値はと最大持続時間の値は、それぞれ <exp> <units> と <max> <units> です。`,
      expected_range_duration: `The values of minimal Duration, expected Duration, and maximal Duration of <s> の最小持続時間、予想持続時間、最大持続時間の値は、それぞれ <min> <units> 、 <exp> <units> 、 <max> <units> です。`,
      default_time_units: `seconds`
      // },
    },
    essence: {
      physical: `モノ`,
      informatical: `情報`
    },
    affiliation: {
      systemic: `システム`,
      environmental: `環境`
    },
    semifolding: {
      object: `<O> lists `,
      process: `<P> lists `,
      aggregation: {
        single: `<T> as a part`,
        multiple: `<T1...n-1> and <Tn> as parts`
      },
      exhibition: {
        single: `<T> as a feature`,
        multiple: `<T1...n-1> and <Tn> as features`
      },
      generalization: {
        single: `<T> as a specialization`,
        multiple: `<T1...n-1> and <Tn> as specializations`
      },
      instantiation: {
        single: `<T> as an instance`,
        multiple: `<T1...n-1> and <Tn> as instances`
      }
    }
  };
  const oplTemplates_es = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> consiste en <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> consiste en <T2> y <num> más partes.`,
      "Aggregation-Participation_(multiple)": `<T1> consiste en <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consiste en <T2...n> y <num> partes más.`,
      "Generalization-Specialization": `<T2> es un <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> y <num> hay más especializaciones <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> son <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> y <num> hay más especializaciones <T1>.`,
      "Classification-Instantiation": `<T2> es un caso para <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> y <num> más casos son casos de <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> son los casos de <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> y <num> más casos son casos de <T1>.`,
      "Exhibition-Characterization": `<T1> exhibe <T2>.`,
      "Exhibition-Characterization_incomplete": `<T1> exhibe <T2> y <num> más atributos.`,
      "Exhibition-Characterization_(multiple)": `<T1> exhibe <T2...n>.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibe <T2...n> y <num> más atributos.`,
      Unidirectional_Tagged_Link: `<T1> se refiere a <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> y <num> más.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> y <T2> son equivalentes.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> y <T2> son <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, y <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> manipula <P>.`,
      "Agent_(multiple)": `<O\Os1...n> manipulo <P>.`,
      Agent_Condition: `<P> ocurre si <O> existe, de lo contrario <P> se omite.`,
      "Agent_Condition(multiple)": `<P> ocurre si <O\Os1...n> existe, de lo contrario <P> se omite.`,
      Agent_Condition_state: `<P> ocurre si <O> es <s>, de lo contrario <P> se omite.`,
      Agent_Event: `<O> inicia y manipula <P>.`,
      "Agent_Event(multiple)": `<O\Os1...n> inicio y manipulo <P>.`,
      Agent_Event_state: `<s> <O> inicia y manipula <P>.`,
      Instrument: `<P> requiere <O_Os>.`,
      "Instrument_(multiple)": `<P> requiere <O\Os1...n>.`,
      Instrument_Condition: `<P> ocurre si <O> existe, de lo contrario <P> se omite.`,
      "Instrument_Condition(multiple)": `<P> ocurre si <O\Os1...n> existe, de lo contrario <P> se omite.`,
      Instrument_Condition_state: `<P> ocurre si <O> estÃ¡ en estado <s>, de lo contrario <P> se omite.`,
      Instrument_Event: `<O> inicia <P>, el cual requiere <O>.`,
      "Instrument_Event(multiple)": `<O\Os1...n> inicio <P>, que requiere.`,
      Instrument_Event_state: `<s> <O> inicia <P>, el cual requiere <s> <O>.`,
      Effect: `<P> afecta <O_Os>.`,
      "Effect_(multiple)": `<P> afecta <O\Os1...n>.`,
      Effect_Condition: `<P> ocurre si <O> existe, en ese caso <P> afecta <O>, de lo contrario <P> se omite.`,
      "Effect_Condition(multiple)": `<P> ocurre si <O\Os1...n> existe, en ese caso <P> los afectan , de lo contrario <P> se omite.`,
      Effect_Condition_state: `<P> ocurre si <O> estÃ¡ en estado <s>, en ese caso <P> afecta <s> <O>, de lo contrario <P> se omite.`,
      Effect_Event: `<O> inicia <P>, en ese caso <O>`,
      "Effect_Event(multiple)": `<O\Os1...n> inicio <P>, que afecta <O>.`,
      Effect_Event_state: `<s> <O> inicia <P>, que afecta <s> <O>`,
      Consumption: `<P> consume <O_Os>.`,
      "Consumption_(multiple)": `<P> consume <O\Os1...n>.`,
      Consumption_Condition: `<P> ocurre si <O> existe, en ese caso <P> consume <O>, de lo contrario <P> se omite.`,
      "Consumption_Condition(multiple)": `<P> ocurre si <O\Os1...n> existe, en ese caso <P> los consume, de lo contrario <P> se omite.`,
      Consumption_Condition_state: `<P> ocurre si <O> estÃ¡ en estado <s>, en ese caso <P> consume <s> <O>, de lo contrario <P> se omite.`,
      Consumption_Event: `<O> inicia <P>, el cual consume <O>.`,
      "Consumption_Event(multiple)": `<O\Os1...n> inicio <P>, que los consume.`,
      Consumption_Event_state: `<s> <O> inicia <P>, que consume <O>.`,
      Result: `<P> produce <O_Os>.`,
      "Result_(multiple)": `<P> produce <O\Os1...n>.`,
      "In-out_Link_Pair": `<P> cambia <O> desde <s1> a <s2>.`,
      "In-out(group)": `<O> desde <s1> a <s2>`,
      "In-out_Link_Pair(group)": `<P> cambia <O> desde <s1> a <s2><Other_changes>.`,
      Split_input: `<P> cambia <O> a cualquier otro estado desde <s>.`,
      Split_output: `<P> cambia <O> desde cualquier otro estado a <s>.`,
      Condition_Input: `<P> ocurre si <O> es <s1>, en ese caso <P> cambia <O> desde <s1> a <s2>, de lo contrario <P> se omite.`,
      "In-out_Link_Pair_Condition": `<P> ocurre si <O> es <s1>, en ese caso <P> cambia <O> desde <s1> a <s2>, de lo contrario <P> se omite.`,
      "In-out_Link_Pair_Condition(group)": `<P> ocurre si <O> es <s1>, en ese caso <P> cambia <O> desde <s1> a <s2>, de lo contrario <P> se omite.`,
      "In-out_Link_Pair_Event": `<s1> <O> inicia <P>, que cambia <O> desde <s1> a <s2>.`,
      "In-out_Link_Pair_Event(group)": `<O> en estado <s1> inicia <P>, que cambia <O> desde <s1> a <s2>.`,
      Overtime_exception: `<O> activa <P> cuando <O> es <s> mayor que <maxtime> <units>.`,
      Undertime_exception: `<O> activa <P> cuando <O> es <s> menor que <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> activa <P> cuando <O> es <s> mayor que <maxtime> <units> y menor que <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> ocurre si <P1> estÃ¡ sobre <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> ocurre si <P1> cae bajo de <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> ocurre si <P1> cae bajo de <mintime> <units> o estÃ¡ sobre <maxtime> <units>.`,
      Invocation: `<P1> invoca <P2>.`,
      "Invocation_(multiple)": `<P1> invoca <P2...n>.`,
      "Invocation_(self)": `<P1> se invoca a sí mismo.`,
      "Invocation_(parent)": `<P1> invoca <P2>.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> y <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, asÃ­ como <P1...n>`,
      AND: `<T1...n-1> y <Tn>`,
      OR: `<T1...n-1> o <Tn>`,
      XOR: `<T1> xor <T2>`,
      "Stateful-Object": `<O> en estado <s>`,
      "Stateful-Object-value": `<O> con el valor <s>`,
      "Stateful-Object-value(multiple)": `<O> con valores <s1...n>`,
      "Stateful-Object(multiple)": `<O> en estado <s1...n>`,
      "Attribute-Exhibitor": `<T> de <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> y <change>.`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object.
      XOR: {
        process: {
          Result: "<P> produce exactamente uno de <O_Os1...n>.",
          "Result(brothers)": "<P> produce <O> en uno de los estados <s1...n>.",
          Consumption: `<P> consume exactamente uno de <O_Os1...n>.`,
          "Consumption(brothers)": `<P> consume <O> en uno de los estados <s1...n>.`,
          Consumption_Condition: `<P> ocurre si exactamente uno de <O_Os1...n> existe, en ese caso <P> consume el existente, de lo contrario <P> se omite.`,
          "Consumption_Condition(brothers)": `<P> ocurre si <O> estÃ¡ en uno de los estados <s1...n>, en ese caso <P> se consume, de lo contrario <P> se omite.`,
          Consumption_Event: `Exactamente uno de <O_Os1...n> inicia <P>, que lo consume.`,
          "Consumption_Event(brothers)": `<O> inicia <P> cuando estÃ¡ en uno de los estados <s1...n>, que lo consume.`,
          Effect: `<P> afecta exactamente uno de <O_Os1...n>.`,
          "Effect(brothers)": `<P> afecta <O> en uno de los estados <s1...n>.`,
          Effect_Condition: `<P> ocurre si exactamente uno de <O_Os1...n> existe, en ese caso <P> lo afecta, de lo contrario <P> se omite.`,
          "Effect_Condition(brothers)": `<P> ocurre si <O> estÃ¡ en uno de los estados <s1...n>, en ese caso <P> lo afecta, de lo contrario <P> se omite.`,
          Effect_Event: `Exactamente uno de <O_Os1...n> inicia <P>, que lo afecta.`,
          "Effect_Event(brothers)": `<O> inicia <P> cuando estÃ¡ en uno de los estados <s1...n>, que lo afecta.`,
          Agent: `Exactamente uno de <O_Os1...n> manipula <P>.`,
          "Agent(brothers)": `<O> manipula <P> cuando estÃ¡ en uno de los estados <s1...n>.`,
          Agent_Event: `Exactamente uno de <O_Os1...n> inicia y manipula <P>.`,
          "Agent_Event(brothers)": `<O> inicia y manipula <P> cuando estÃ¡ en uno de los estados <s1...n>.`,
          Agent_Condition: `<P> ocurre si exactamente uno de <O_Os1...n> existe, de lo contrario <P> se omite.`,
          "Agent_Condition(brothers)": `<P> ocurre si <O> estÃ¡ en uno de los estados <s1...n>, de lo contrario <P> se omite.`,
          Instrument: `<P> requiere exactamente uno de <O_Os1...n>.`,
          "Instrument(brothers)": `<P> requiere <O> en uno de los estados <s1...n>.`,
          Instrument_Condition: `<P> ocurre si exactamente uno de <O_Os1...n> existe, de lo contrario <P> se omite.`,
          "Instrument_Condition(brothers)": `<P> ocurre si <O> estÃ¡ en uno de los estados <s1...n>, de lo contrario <P> se omite.`,
          Instrument_Event: `Exactamente uno de <O_Os1...n> inicia <P>, que lo requiere.`,
          "Instrument_Event(brothers)": `<O> inicia <P> cuando estÃ¡ en uno de los estados <s1...n>, que lo requiere.`,
          Invocation_OUT: `<P> invoca cualquiera <P1...n>.`,
          Invocation_IN: `Either <P1...n> invoca <P>.`,
          InOut: `<P> cambia <O> de <s1> a exactamente uno de <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> cambia <O> de exactamente uno de <ins1..n> a exactamente uno de <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> cambia <O> de exactamente uno de <ins1..n> a <s1>.`
        },
        object: {
          Result: `Exactamente uno de <P1...n> produce <O_Os>.`,
          Consumption: `Exactamente uno de <P1...n> consume <O_Os>`,
          Consumption_Event: `<O_Os> inicia exactamente uno de <P1...n>, que consume el proceso iniciado.`,
          Consumption_Condition_state: `Exactamente uno de <P1...n> ocurre si <O> es <s1>, en ese caso el proceso que se produce consume <O>, de lo contrario estos procesos se omiten.`,
          Consumption_Condition: `Exactamente uno de <P1...n> ocurre si <O_Os> existe, en ese caso el proceso que se produce consume <O_Os>, de lo contrario estos procesos se omiten.`,
          Effect: `Exactamente uno de <P1...n> afecta <O_Os>.`,
          Effect_Event: `<O_Os> inicia exactamente uno de <P1...n>, que afecta el proceso que ocurre.`,
          Effect_Condition: `Exactamente uno de <P1...n> ocurre si <O_Os> existe, en ese caso el proceso que ocurre afecta <O_Os>, de lo contrario estos procesos se omiten.`,
          Agent: `<O_Os> maneja exactamente uno de <P1...n>.`,
          Agent_Event: `<O_Os> inicia y maneja exactamente uno de <P1...n>.`,
          Agent_Condition: `<O_Os> maneja exactamente uno de <P1...n> si <O_Os> exists, de lo contrario estos procesos se omiten.`,
          Agent_Condition_state: `<O> maneja exactamente uno de <P1...n> si <O> es <s1>, de lo contrario estos procesos se omiten.`,
          Instrument: `Exactamente uno de <P1...n> requiere <O_Os>.`,
          Instrument_Event: `<O_Os> inicia exactamente uno de <P1...n>, el cual requiere <O_Os>.`,
          Instrument_Condition: `Exactamente uno de <P1...n> requiere <O_Os>, de lo contrario estos procesos se omiten.`,
          Instrument_Condition_state: `Exactamente uno de <P1...n> que requiere <O> es <s1>, de lo contrario estos procesos se omiten.`
        }
      },
      OR: {
        process: {
          Result: "<P> produce al menos uno de <O_Os1...n>.",
          Consumption: `<P> consume al menos uno de <O_Os1...n>.`,
          Consumption_Condition: `<P> ocurre si al menos uno de <O_Os1...n> existe, en ese caso <P> consume el existente, de lo contrario <P> se omite.`,
          Consumption_Event: `Al menos uno de <O_Os1...n> inicia <P>, que lo consume.`,
          Effect: `<P> afecta al menos uno de <O_Os1...n>.`,
          Effect_Condition: `<P> ocurre si al menos uno de <O_Os1...n> existe, en ese caso <P> lo afecta, de lo contrario <P> se omite.`,
          Effect_Event: `Al menos uno de <O_Os1...n> inicia <P>, que lo afecta.`,
          Agent: `Al menos uno de <O_Os1...n> maneja <P>.`,
          Agent_Event: `Al menos uno de <O_Os1...n> inicia y maneja <P>.`,
          Agent_Condition: `<P> ocurre si Al menos uno de <O_Os1...n> existe, de lo contrario <P> se omite.`,
          Instrument: `<P> requiere al menos uno de <O_Os1...n>.`,
          Instrument_Condition: `<P> ocurre si al menos uno de <O_Os1...n> existe, de lo contrario <P> se omite.`,
          Instrument_Event: `Al menos uno de <O_Os1...n> inicia <P>, que lo requiere.`,
          Invocation_OUT: `<P> invoca a lo menos uno de <P1...n>.`,
          Invocation_IN: `Al menos uno de <P1...n> invoca <P>.`,
          InOut: `<P> cambia <O> de <s1> a al menos uno de <O_Os2...n>.`
        },
        object: {
          Result: `Al menos uno de <P1...n> produce <O_Os>`,
          Consumption: `Al menos uno de <P1...n> consume <O_Os>`,
          Consumption_Event: `<O_Os> inicia al menos uno de <P1...n>, que consume el proceso iniciado.`,
          Consumption_Condition_state: `Al menos uno de <P1...n> ocurre si <O> es <s1>, en ese caso el proceso que ocurre consume <O>, de lo contrario estos procesos se omiten.`,
          Consumption_Condition: `Al menos uno de <P1...n> ocurre si <O_Os> existe, en ese caso el proceso que ocurre consume <O_Os>, de lo contrario estos procesos se omiten.`,
          Effect: `Al menos uno de <P1...n> afecta <O_Os>`,
          Effect_Event: `<O_Os> inicia al menos uno de <P1...n>, which affects the occurring process.`,
          Effect_Condition: `Al menos uno de <P1...n> ocurre si <O_Os> existe, en ese caso el proceso que ocurre afecta <O_Os>, de lo contrario estos procesos se omiten.`,
          Agent: `<O_Os> maneja al menos uno de <P1...n>.`,
          Agent_Event: `<O_Os> inicia y maneja al menos uno de <P1...n>.`,
          Agent_Condition: `<O_Os> maneja al menos uno de <P1...n> si <O_Os> existe, de lo contrario estos procesos se omiten.`,
          Agent_Condition_state: `<O> maneja al menos uno de <P1...n> si <O> es <s1>, de lo contrario estos procesos se omiten.`,
          Instrument: `Al menos uno de <P1...n> requiere <O_Os>`,
          Instrument_Event: `<O_Os> inicia al menos uno de <P1...n>, el cual requiere <O_Os>`,
          Instrument_Condition: `Al menos uno de <P1...n> requiere <O_Os>, de lo contrario estos procesos se omiten.`,
          Instrument_Condition_state: `Al menos uno de <P1...n> requiere que <O> es <s1>, de lo contrario estos procesos se omiten.`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; donde <tag>`,
      probability: `<O_Os> con probabilidad <tag>`,
      rate: `<O_Os> a razÃ³n de <tag> <units>`,
      path: `Siguiendo el camino <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `an optional`,
      "*": `optional`,
      "+": `at least one`,
      "n..n": `<n1> a <n2>`,
      "n..*": `<n1> a many`
    },
    ranges: {
      "<=": `menor o igual a`,
      ">=": "mayor o igual a",
      "=": "igual a",
      "<>": "no igual a",
      "<": `menos que`,
      ">": "más que"
    },
    object: {
      thing_generic_name: `objeto`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> es el gemelo digital de <O>.`,
      default_essence: `<O> es <a>.`,
      default_affiliation: `<O> es <e>.`,
      non_default: `<O> es <e> y <a>.`,
      singleInzoom: `<O> desde <SD_Parent> aumenta la escala <Current_SD> en <T_list>.`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, así como <P_list>.`,
      multiInzoom: `<O> desde <SD_Parent> aumenta la escala <Current_SD> en <O_list>, asÃ­ como <P_list>.`,
      multiInzoomOneProcess: `<P> de <SD_Parent> zooms in <Current_SD> a <P_list>, así como <O_list>.`,
      single_unfold_aggregation: `<O> de <SD_Parent> se desarrolla parcialmente en <Current_SD> a <T_list>.`,
      single_unfold_generalization: `<O> de <SD_Parent> especialización-se desarrolla en <Current_SD> a <T_list>.`,
      single_unfold_exhibition: `<O> de <SD_Parent> la característica se desarrolla en <Current_SD> a <T_list>.`,
      multi_unfold_exhibition: `<O> de <SD_Parent> la característica se desarrolla en <Current_SD> a <O_list>, así como <P_list>.`,
      single_unfold_instantiation: `<O> de <SD_Parent> instancia-se desarrolla en <Current_SD> a <T_list>.`,
      unspecified_unfold: `<T> de <SD_Parent> se desarrolla en <Current_SD>.`,
      object_list_sequence: `<O1...n>, en esa secuencia vertical.`,
      object_list_parallel: `<O1...n>, en esa secuencia horizontal.`
    },
    process: {
      thing_generic_name: `proceso`,
      default_essence_affiliation: ``,
      default_essence: `<P> es <a>.`,
      default_affiliation: `<P> es <e>.`,
      non_default: `<P> es <e> y <a>.`,
      singleInzoom: `<P> desde <SD_Parent> aumenta la escala <Current_SD> en <T_list>, que ocurren en esa secuencia de tiempo.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> a <T_list>.`,
      multiInzoom: `<P> desde <SD_Parent> aumenta la escala <Current_SD> en <P_list>, asÃ­ como <O_list>.`,
      multiInzoomOneProcess: `<P> de <SD_Parent> zooms in <Current_SD> a <P_list>, así como <O_list>.`,
      single_unfold_aggregation: `<P> de <SD_Parent> se desarrolla parcialmente en <Current_SD> a <T_list>.`,
      single_unfold_generalization: `<P> de <SD_Parent> especialización-se desarrolla en <Current_SD> a <T_list>.`,
      single_unfold_exhibition: `<P> de <SD_Parent> la característica se desarrolla en <Current_SD> a <T_list>.`,
      multi_unfold_exhibition: `<P> de <SD_Parent> la característica se desarrolla en <Current_SD> a <P_list>, así como <O_list>.`,
      single_unfold_instantiation: `<P> de <SD_Parent> instancia-se desarrolla en <Current_SD> a <T_list>.`,
      unspecified_unfold: `<T> de <SD_Parent> se desarrolla en <Current_SD>.`,
      // 'process_list_parallel': `<P1...n>, in that horizontal sequence`,
      process_list_parallel: `parallel <P1...n>`,
      // 'process_list_sequence': `<P1...n>, in that vertical sequence`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `La duración esperada de <P> es <exp> <units>.`,
      min_duration: `La duración mínima de <P> es <min> <units>.`,
      max_duration: `La duración máxima de <P> es <max> <units>.`,
      min_max_range_duration: `La duración mínima y la duración máxima de <P> son <min> <units> y <max> <units>, respectivamente.`,
      min_exp_range_duration: `La duración mínima y la duración esperada de <P> son <min> <units> y <exp> <units>, respectivamente.`,
      exp_max_range_duration: `La duración esperada y la duración máxima de <P> son <exp> <units> y <max> <units>, respectivamente.`,
      expected_range_duration: `La duración mínima, la duración esperada y la duración máxima de <P> son <min> <units>, <exp> <units>, y <max> <units>, respectivamente.`
    },
    state: {
      single_state: `<O> es <s>.`,
      multiple_states: `<O> pueden ser <s1...n>.`,
      all_states_are_suppressed: `<O> es con estado.`,
      one_state_shown_one_missing: `<O> es <s> o en otro estado.`,
      one_state_shown: `<O> es <s> y puede estar en uno de <num> otros estados.`,
      two_or_more_states_shown_one_missing: `<O> puede ser <s1...n> o en otro estado.`,
      two_or_more_states_shown: `<O> puede ser <s1...n> o en uno de <num> otros estados.`,
      default: `El estado <s> es el predeterminado.`,
      default_initial: `El estado <s> es predeterminado e inicial.`,
      initial: `El estado <s> es inicial.`,
      final: `El estado <s> es definitivo.`,
      default_initial_final: `El estado <s> es inicial, final y predeterminado.`,
      initial_final: `El estado <s> es inicial y final.`,
      default_final: `El estado <s> es definitivo y predeterminado.`,
      none: ``,
      Current: `<O> se encuentra actualmente en el estado <s>.`,
      // 'timeDurational': {
      expected_duration: `La duración esperada de <s> es <exp> <units>.`,
      min_duration: `La duración mínima de <s> es <min> <units>.`,
      max_duration: `La duración máxima de <s> es <max> <units>.`,
      min_max_range_duration: `La duración mínima y la duración máxima de <s> son <min> <units> y <max> <units>, respectivamente.`,
      min_exp_range_duration: `La duración mínima y la duración esperada de <s> son <min> <units> y <exp> <units>, respectivamente.`,
      exp_max_range_duration: `La duración esperada y la duración máxima de <s> son <exp> <units> y <max> <units>, respectivamente.`,
      expected_range_duration: `La duración mínima, la duración esperada y la duración máxima de <s> son <min> <units>, <exp> <units>, y <max> <units>, respectivamente.`,
      default_time_units: `segundos`
      // },
    },
    essence: {
      physical: `físico`,
      informatical: `informatico`
    },
    affiliation: {
      systemic: `sistémico`,
      environmental: `ambiental`
    },
    semifolding: {
      object: `<O> listas `,
      process: `<P> listas `,
      aggregation: {
        single: `<T> como parte`,
        multiple: `<T1...n-1> y <Tn> como partes`
      },
      exhibition: {
        single: `<T> como una característica`,
        multiple: `<T1...n-1> y <Tn> como características`
      },
      generalization: {
        single: `<T> como especialización`,
        multiple: `<T1...n-1> y <Tn> como especializaciones`
      },
      instantiation: {
        single: `<T> como ejemplo`,
        multiple: `<T1...n-1> y <Tn> como instancias`
      }
    }
  };
  const oplTemplates_ml = {
    structural_link: {
      /*
       * <T1> - source OPM Thing
       * <T2> - target OPM Thing
       * <T2...n> - set of target OPM Things
       */
      "Aggregation-Participation": `<T1> ഉൾപെട്ടിട്ടുള്ളത് <T2>.`,
      "Aggregation-Participation_incomplete": `<T1> consists of <T2> and <num> more parts.`,
      "Aggregation-Participation_(multiple)": `<T1> ഉൾപെട്ടിട്ടുള്ളത് <T2...n>.`,
      "Aggregation-Participation_incomplete_(multiple)": `<T1> consists of <T2...n> and <num> more parts.`,
      "Generalization-Specialization": `<T2> ഒരു <T1>.`,
      "Generalization-Specialization_incomplete": `<T2> and <num> more specializations are <T1>.`,
      "Generalization-Specialization_(multiple)": `<T2...n> ആകുന്നു <T1>.`,
      "Generalization-Specialization_incomplete_(multiple)": `<T2...n> and <num> more specializations are <T1>.`,
      "Classification-Instantiation": `<T2> ഒരു ഉദാഹരണമാണ് <T1>.`,
      "Classification-Instantiation_incomplete": `<T2> and <num> more instances are instances of <T1>.`,
      "Classification-Instantiation_(multiple)": `<T2...n> ഉദാഹരണങ്ങളാണ് <T1>.`,
      "Classification-Instantiation_incomplete_(multiple)": `<T2...n> and <num> more instances are instances of <T1>.`,
      "Exhibition-Characterization": `<T1> പ്രദർശിപ്പിക്കുന്നു <T2>.`,
      "Exhibition-Characterization_incomplete": `<T1> exhibits <T2> and <num> more attributes.`,
      "Exhibition-Characterization_(multiple)": `<T1> പ്രദർശിപ്പിക്കുന്നു <T2...n>.`,
      "Exhibition-Characterization_incomplete_(multiple)": `<T1> exhibits <T2...n> and <num> more attributes.`,
      Unidirectional_Tagged_Link: `<T1> ഇതുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു <T2>.`,
      "Unidirectional_Tagged_Link_(tag)": `<T1> <tag> <T2>.`,
      Forked_Unidirectionals: `<T1> <tag> <T2..n>.`,
      Forked_Unidirectionals_with_missing: `<T1> <tag> <T2..n> and <num> more.`,
      sequence: `in that sequence.`,
      Bidirectional_Tagged_Link: `<T1> ഒപ്പം <T2> തുല്യമാണ്.`,
      "Bidirectional_Tagged_Link_(tag)": `<T1> ഒപ്പം <T2> ആകുന്നു <tag>.`,
      "Bidirectional_Tagged_Link_(ftag,btag)": `<T1> <forward tag> <T2>, ഒപ്പം <T2> <backward tag> <T1>.`
    },
    procedural_link: {
      /*
       * <O_Os> - OPM Object or OPM Stateful Object
       * <O_Os1...n> - set of OPM Objects or OPM Stateful Objects
       * <s> - OPM State
       * <P> - OPM Process
       */
      Agent: `<O_Os> കൈകാര്യം ചെയ്യുന്നു <P>.`,
      "Agent_(multiple)": `<O\Os1...n> കൈകാര്യം ചെയ്യുക <P>.`,
      Agent_Condition: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "Agent_Condition(multiple)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O\Os1...n> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Agent_Condition_state: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് <s>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Agent_Event: `<O> ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു <P>.`,
      "Agent_Event(multiple)": `<O\Os1...n> ആരംഭിച്ച് കൈകാര്യം ചെയ്യുക <P>.`,
      Agent_Event_state: `<s> <O> ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു<P>.`,
      Instrument: `<P> ആവശ്യമാണ് <O_Os>.`,
      "Instrument_(multiple)": `<P> ആവശ്യമാണ് <O\Os1...n>.`,
      Instrument_Condition: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "Instrument_Condition(multiple)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O\Os1...n> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Instrument_Condition_state: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് അവസ്ഥ <s>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Instrument_Event: `<O> ആരംഭിക്കുന്നു <P>, ഇതിന് ആവശ്യമാണ് <O>.`,
      "Instrument_Event(multiple)": `<O\Os1...n> തുടങ്ങിവയ്ക്കുക <P>, അതിന് അവ ആവശ്യമാണ്.`,
      Instrument_Event_state: `<s> <O> ആരംഭിക്കുന്നു <P>, ഇതിന് ആവശ്യമാണ് <s> <O>.`,
      Effect: `<P> ബാധിക്കുന്നു <O_Os>.`,
      "Effect_(multiple)": `<P> ബാധിക്കുന്നു <O\Os1...n>.`,
      Effect_Condition: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> ബാധിക്കുന്നു <O>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "Effect_Condition(multiple)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O\Os1...n> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> അവരെ ബാധിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Effect_Condition_state: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് അവസ്ഥ <s>, ഏത് സാഹചര്യത്തിൽ <P> ബാധിക്കുന്നു <s> <O>, അല്ലെങ്കിൽ  <P> ഒഴിവാക്കി.`,
      Effect_Event: `<O> ആരംഭിക്കുന്നു <P>, ഇത് ബാധിക്കുന്നു <O>`,
      "Effect_Event(multiple)": `<O\Os1...n> തുടങ്ങിവയ്ക്കുക <P>, ഇത് ബാധിക്കുന്നു <O>.`,
      Effect_Event_state: `<s> <O> ആരംഭിക്കുന്നു <P>, ഇത് ബാധിക്കുന്നു <s> <O>`,
      Consumption: `<P> ഉപയോഗിക്കുന്നു <O_Os>.`,
      "Consumption_(multiple)": `<P> ഉപയോഗിക്കുന്നു <O\Os1...n>.`,
      Consumption_Condition: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> ഉപയോഗിക്കുന്നു  <O>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "Consumption_Condition(multiple)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O\Os1...n> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> ഉപയോഗിക്കുന്നു അവ, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Consumption_Condition_state: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> അവസ്ഥയിൽ ആണ്  <s>, ഏത് സാഹചര്യത്തിൽ <P> ഉപയോഗിക്കുന്നു <s> <O>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      Consumption_Event: `<O> ആരംഭിക്കുന്നു <P>, അത് ഉപയോഗിക്കുന്നു <O>.`,
      "Consumption_Event(multiple)": `<O\Os1...n> തുടങ്ങിവയ്ക്കുക <P>, അത് അവരെ ഉപയോഗിക്കുന്നു .`,
      Consumption_Event_state: `<s> <O> ആരംഭിക്കുന്നു <P>, അത് ഉപയോഗിക്കുന്നു <O>.`,
      Result: `<P> വിളവ് <O_Os>.`,
      "Result_(multiple)": `<P> വിളവ് <O\Os1...n>.`,
      "In-out_Link_Pair": `<P> മാറ്റങ്ങൾ <O> മുതൽ <s1> ടു <s2>.`,
      "In-out(group)": `<O> മുതൽ <s1> ടു <s2>`,
      "In-out_Link_Pair(group)": `<P> മാറ്റങ്ങൾ <O> മുതൽ <s1> ടു <s2><Other_changes>.`,
      Split_input: `<P> മാറ്റങ്ങൾ <O> മുതൽ മറ്റേതെങ്കിലും  അവസ്ഥലേക്ക്<s>.`,
      Split_output: `<P> മാറ്റങ്ങൾ <O> മറ്റേതെങ്കിലും അവസ്ഥയിൽ നിന്ന് <s>.`,
      Condition_Input: `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് <s1>, ഏത് സാഹചര്യത്തിൽ <P> മാറ്റങ്ങൾ <O> മുതൽ <s1> ടു  <s2>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "In-out_Link_Pair_Condition": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ്  <s1>, ഏത് സാഹചര്യത്തിൽ <P> മാറ്റങ്ങൾ <O> മുതൽ <s1> ടു  <s2>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "In-out_Link_Pair_Condition(group)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് <s1>, ഏത് സാഹചര്യത്തിൽ <P> മാറ്റങ്ങൾ <O> മുതൽ <s1> to <s2>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
      "In-out_Link_Pair_Event": `<s1> <O> ആരംഭിക്കുന്നു <P>, അത് മാറുന്നു <O> മുതൽ <s1> ടു  <s2>.`,
      "In-out_Link_Pair_Event(group)": `<O> അവസ്ഥകളിൽ  <s1> ആരംഭിക്കുന്നു <P>, അത് മാറുന്നു <O> മുതൽ <s1> ടു  <s2>.`,
      Overtime_exception: `<O> നയിക്കുക <P> എപ്പോൾ <O> ആണ്  <s> അതിലും കൂടുതൽ <maxtime> <units>.`,
      Undertime_exception: `<O> നയിക്കുക <P> എപ്പോൾ <O> ആണ് <s> അതിൽ കുറവ് <mintime> <units>.`,
      "OvertimeUndertime-exception": `<O> നയിക്കുക <P> എപ്പോൾ <O> ആണ് <s> അതിലും കൂടുതൽ <maxtime> <units> കുറവ് <mintime> <units>.`,
      "Overtime_exception_(process)": `<P2> എങ്കിൽ സംഭവിക്കുന്നു <P1> എന്നതിനേക്കാൾ കൂടുതൽ നീണ്ടുനിൽക്കും <maxtime> <units>.`,
      "Undertime_exception_(process)": `<P2> എങ്കിൽ സംഭവിക്കുന്നു  <P1> കുറയുന്നു <mintime> <units>.`,
      "OvertimeUndertime-exception_(process)": `<P2> എങ്കിൽ സംഭവിക്കുന്നു <P1> കുറയുന്നു <mintime> <units> അല്ലെങ്കിൽ കൂടുതൽ നീണ്ടുനിൽക്കും <maxtime> <units>.`,
      Invocation: `<P1> ഇതിലേക്ക് തിരിയുക <P2>.`,
      "Invocation_(multiple)": `<P1> ഇതിലേക്ക് തിരിയുക <P2...n>.`,
      "Invocation_(self)": `<P1> സ്വയം അഭ്യർത്ഥിക്കുന്നു.`,
      "Invocation_(parent)": `<P1> ഇതിലേക്ക് തിരിയുക <P2>.`
    },
    grouping: {
      /*
       * <T> - OPM Thing
       * <T1> - first OPM Thing
       * <T2> - second OPM Thing
       * <T1...n-1> - first n-1 OPM Things
       * <Tn> - nth OPM Thing
       * <O1...n> - first nth OPM Objects
       * <P1...n> - first nth OPM Processes
       * <s> - OPM State
       * <O> - OPM Object
       * <a> - OPM Object as an Attribute
       * <e1...n> - set of OPM Objects as Exhibitors
       */
      "Single-Thing": `<T>`,
      "Multiple-Things": `<T1...n-1> ഒപ്പം <Tn>`,
      "Multiple-Things-Object-Process-Separated": `<O1...n>, കൂടാതെ <P1...n>`,
      AND: `<T1...n-1> ആൻഡ് <Tn>`,
      OR: `<T1...n-1> ഓർ <Tn>`,
      XOR: `<T1> എക്സോർ <T2>`,
      "Stateful-Object": `<O> അവസ്ഥയിൽ <s>`,
      "Stateful-Object-value": `<O> എന്ന മൂല്യം <s>`,
      "Stateful-Object-value(multiple)": `<O> മൂല്യങ്ങളുള്ള <s1...n>`,
      "Stateful-Object(multiple)": `<O> അവസ്ഥകളിൽ <s1...n>`,
      "Attribute-Exhibitor": `<T> ന്റെ <e1...n>`,
      indentation: `&nbsp;&nbsp;&nbsp;&nbsp;`,
      "Multiple-InOut": `<Other_changes> ഒപ്പം <change>.`
    },
    logic_operators: {
      // process/object are the single thing in the XOR\OR relation
      // brothers - couple of states of the same object.
      XOR: {
        process: {
          Result: "<P> ഇതിലൊന്ന് കൃത്യമായി നൽകുന്നു <O_Os1...n>.",
          "Result(brothers)": "<P> വിളവ് <O> അവസ്ഥകളിൽ ഒന്ന് <s1...n>.",
          Consumption: `<P> ഇതിലൊന്ന് കൃത്യമായി ഉപയോഗിക്കുന്നു <O_Os1...n>.`,
          "Consumption(brothers)": `<P> ഉപയോഗിക്കുന്നു <O> അവസ്ഥകളിൽ ഒന്ന് <s1...n>.`,
          Consumption_Condition: `<P> കൃത്യമായി ഒന്ന് ഉണ്ടെങ്കിൽ സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> നിലവിലുള്ളത് ഉപയോഗിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          "Consumption_Condition(brothers)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ഒരു അവസ്ഥയാണ്  <s1...n>, ഏത് സാഹചര്യത്തിൽ<P> അത് ഉപയോഗിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Consumption_Event: `കൃത്യമായി ഒന്ന് <O_Os1...n> ആരംഭിക്കുന്നു <P>, അത് ഉപയോഗിക്കുന്നു.`,
          "Consumption_Event(brothers)": `<O> ആരംഭിക്കുന്നു <P> അത് ഒരു അവസ്ഥയിൽ ആയിരിക്കുമ്പോൾ    <s1...n>, അത് ഉപയോഗിക്കുന്നു.`,
          Effect: `<P> ഒന്നിനെ കൃത്യമായി ബാധിക്കുന്നു <O_Os1...n>.`,
          "Effect(brothers)": `<P> ബാധിക്കുന്നു <O> അവസ്ഥകളിൽ ഒന്ന് <s1...n>.`,
          Effect_Condition: `<P> കൃത്യമായി ഒന്ന് ഉണ്ടെങ്കിൽ സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> അതിനെ ബാധിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          "Effect_Condition(brothers)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ഒരു അവസ്ഥയാണ്  <s1...n>, ഏത് സാഹചര്യത്തിൽ <P> അതിനെ ബാധിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Effect_Event: `കൃത്യമായി ഒന്ന് <O_Os1...n> ആരംഭിക്കുന്നു <P>, അത് ബാധിക്കുന്നു.`,
          "Effect_Event(brothers)": `<O> ആരംഭിക്കുന്നു<P> അത് ഒരു അവസ്ഥയിൽ ആയിരിക്കുമ്പോൾ <s1...n>, അത് ബാധിക്കുന്നു.`,
          Agent: `കൃത്യമായി ഒന്ന് <O_Os1...n> കൈകാര്യം ചെയ്യുന്നു <P>.`,
          "Agent(brothers)": `<O> കൈകാര്യം ചെയ്യുന്നു <P> അത് ഒരു അവസ്ഥയിൽ ആയിരിക്കുമ്പോൾ <s1...n>.`,
          Agent_Event: `കൃത്യമായി ഒന്ന് <O_Os1...n> ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു <P>.`,
          "Agent_Event(brothers)": `<O> ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു <P> അത് ഒരു അവസ്ഥയിൽ ആയിരിക്കുമ്പോൾ <s1...n>.`,
          Agent_Condition: `<P> കൃത്യമായി ഒന്ന് ഉണ്ടെങ്കിൽ സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          "Agent_Condition(brothers)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ഒരു അവസ്ഥയാണ് <s1...n>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Instrument: `<P> ഇതിലൊന്ന് കൃത്യമായി ആവശ്യമാണ് <O_Os1...n>.`,
          "Instrument(brothers)": `<P> ആവശ്യമാണ് <O> അവസ്ഥകളിൽ ഒന്ന്  <s1...n>.`,
          Instrument_Condition: `<P> ഇതിലൊന്ന് കൃത്യമായി ആവശ്യമാണ് <O_Os1...n> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          "Instrument_Condition(brothers)": `<P> എങ്കിൽ സംഭവിക്കുന്നു <O> ഒരു അവസ്ഥയാണ് <s1...n>, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Instrument_Event: `കൃത്യമായി ഒന്ന് <O_Os1...n> ആരംഭിക്കുന്നു <P>, അതിന് അത് ആവശ്യമാണ്.`,
          "Instrument_Event(brothers)": `<O> ആരംഭിക്കുന്നു <P> അത് ഒരു അവസ്ഥയിൽ ആയിരിക്കുമ്പോൾ  <s1...n>, അതിന് അത് ആവശ്യമാണ്.`,
          Invocation_OUT: `<P> ഒന്നുകിൽ അഭ്യർത്ഥിക്കുന്നു <P1...n>.`,
          Invocation_IN: `ഒന്നുകിൽ <P1...n> ഇതിലേക്ക് തിരിയുക <P>.`,
          InOut: `<P> changes <O> from <s1> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_Xor: `<P> changes <O> from exactly one of <ins1..n> to exactly one of <O_Os2...n>.`,
          InOut_multi_Ins_One_Out: `<P> changes <O> from exactly one of <ins1..n> to <s1>.`
        },
        object: {
          Result: `കൃത്യമായി ഒന്ന് <P1...n> വിളവ് <O_Os>.`,
          Consumption: `കൃത്യമായി ഒന്ന് <P1...n> ഉപയോഗിക്കുന്നു <O_Os>`,
          Consumption_Event: `<O_Os> കൃത്യമായി ഒരെണ്ണം ആരംഭിക്കുന്നു <P1...n>, ഇത് സമാരംഭിച്ച പ്രക്രിയ ഉപയോഗിക്കുന്നു.`,
          Consumption_Condition_state: `കൃത്യമായി ഒന്ന് <P1...n> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് <s1>, അത്തരം സന്ദർഭങ്ങളിൽ സംഭവിക്കുന്ന പ്രക്രിയ ഉപയോഗിക്കുന്നു <O>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Consumption_Condition: `കൃത്യമായി ഒന്ന് <P1...n> എങ്കിൽ സംഭവിക്കുന്നു <O_Os> നിലവിലുണ്ട്, അത്തരം സന്ദർഭങ്ങളിൽ സംഭവിക്കുന്ന പ്രക്രിയ ഉപയോഗിക്കുന്നു <O_Os>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Effect: `കൃത്യമായി ഒന്ന് <P1...n> ബാധിക്കുന്നു <O_Os>.`,
          Effect_Event: `<O_Os> കൃത്യമായി ഒരെണ്ണം ആരംഭിക്കുന്നു <P1...n>, ഇത് സംഭവിക്കുന്ന പ്രക്രിയയെ ബാധിക്കുന്നു.`,
          Effect_Condition: `കൃത്യമായി ഒന്ന് <P1...n> എങ്കിൽ സംഭവിക്കുന്നു <O_Os> നിലവിലുണ്ട്, അത്തരം സന്ദർഭങ്ങളിൽ സംഭവിക്കുന്ന പ്രക്രിയയെ ബാധിക്കുന്നു <O_Os>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Agent: `<O_Os> ഒരെണ്ണം കൃത്യമായി കൈകാര്യം ചെയ്യുന്നു <P1...n>.`,
          Agent_Event: `<O_Os> ഒരെണ്ണം കൃത്യമായി ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു <P1...n>.`,
          Agent_Condition: `<O_Os> ഒരെണ്ണം കൃത്യമായി കൈകാര്യം ചെയ്യുന്നു <P1...n> എങ്കിൽ <O_Os> നിലവിലുണ്ട്, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Agent_Condition_state: `<O> ഒരെണ്ണം കൃത്യമായി കൈകാര്യം ചെയ്യുന്നു <P1...n> എങ്കിൽ <O> ആണ് <s1>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Instrument: `കൃത്യമായി ഒന്ന് <P1...n> ആവശ്യമാണ് <O_Os>.`,
          Instrument_Event: `<O_Os> കൃത്യമായി ഒരെണ്ണം ആരംഭിക്കുന്നു <P1...n>, ഇതിന് ആവശ്യമാണ് <O_Os>.`,
          Instrument_Condition: `കൃത്യമായി ഒന്ന് <P1...n> ആവശ്യമാണ്  <O_Os>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Instrument_Condition_state: `കൃത്യമായി ഒന്ന് <P1...n> അത് ആവശ്യമാണ് <O> ആണ്  <s1>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`
        }
      },
      OR: {
        process: {
          Result: "<P> കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും നൽകുന്നു <O_Os1...n>.",
          Consumption: `<P> ഇതിലൊന്നെങ്കിലും ഉപയോഗിക്കുന്നു <O_Os1...n>.`,
          Consumption_Condition: `<P> കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> നിലവിലുള്ളവ ഉപയോഗിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Consumption_Event: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <O_Os1...n> ആരംഭിക്കുന്നു <P>, അത് ഉപയോഗിക്കുന്നു.`,
          Effect: `<P> ഇതിലൊന്നെങ്കിലും ബാധിക്കുന്നു <O_Os1...n>.`,
          Effect_Condition: `<P> കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, ഏത് സാഹചര്യത്തിൽ <P> അതിനെ ബാധിക്കുന്നു, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Effect_Event: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <O_Os1...n> ആരംഭിക്കുന്നു <P>, അത് ബാധിക്കുന്നു.`,
          Agent: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <O_Os1...n> കൈകാര്യം ചെയ്യുന്നു <P>.`,
          Agent_Event: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <O_Os1...n> ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു <P>.`,
          Agent_Condition: `<P> കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Instrument: `<P> ഇതിലൊന്നെങ്കിലും ആവശ്യമാണ് <O_Os1...n>.`,
          Instrument_Condition: `<P> കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും സംഭവിക്കുന്നു <O_Os1...n> നിലവിലുണ്ട്, അല്ലെങ്കിൽ <P> ഒഴിവാക്കി.`,
          Instrument_Event: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <O_Os1...n> ആരംഭിക്കുന്നു <P>, അതിന് അത് ആവശ്യമാണ്.`,
          Invocation_OUT: `<P> ഇതിലൊന്നെങ്കിലും അഭ്യർത്ഥിക്കുന്നു <P1...n>.`,
          Invocation_IN: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> ഇതിലേക്ക് തിരിയുക <P>.`,
          InOut: `<P> changes <O> from <s1> to at least one of <O_Os2...n>.`
        },
        object: {
          Result: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> വിളവ് <O_Os>`,
          Consumption: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> ഉപയോഗിക്കുന്നു <O_Os>`,
          Consumption_Event: `<O_Os> ഇതിലൊന്നെങ്കിലും ആരംഭിക്കുന്നു <P1...n>, ഇത് സമാരംഭിച്ച പ്രക്രിയ ഉപയോഗിക്കുന്നു.`,
          Consumption_Condition_state: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> എങ്കിൽ സംഭവിക്കുന്നു <O> ആണ് <s1>, അത്തരം സന്ദർഭങ്ങളിൽ സംഭവിക്കുന്ന പ്രക്രിയ ഉപയോഗിക്കുന്നു <O>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Consumption_Condition: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> എങ്കിൽ സംഭവിക്കുന്നു <O_Os> നിലവിലുണ്ട്, അത്തരം സന്ദർഭങ്ങളിൽ സംഭവിക്കുന്ന പ്രക്രിയ ഉപയോഗിക്കുന്നു <O_Os>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Effect: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> ബാധിക്കുന്നു <O_Os>`,
          Effect_Event: `<O_Os> ഇതിലൊന്നെങ്കിലും ആരംഭിക്കുന്നു <P1...n>, ഇത് സംഭവിക്കുന്ന പ്രക്രിയയെ ബാധിക്കുന്നു.`,
          Effect_Condition: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> എങ്കിൽ സംഭവിക്കുന്നു <O_Os> നിലവിലുണ്ട്, അത്തരം സന്ദർഭങ്ങളിൽ സംഭവിക്കുന്ന പ്രക്രിയയെ ബാധിക്കുന്നു <O_Os>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Agent: `<O_Os> ഒരെണ്ണമെങ്കിലും കൈകാര്യം ചെയ്യുന്നു <P1...n>.`,
          Agent_Event: `<O_Os> ഒരെണ്ണമെങ്കിലും ആരംഭിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു <P1...n>.`,
          Agent_Condition: `<O_Os> ഒരെണ്ണമെങ്കിലും കൈകാര്യം ചെയ്യുന്നു <P1...n> എങ്കിൽ <O_Os> നിലവിലുണ്ട്, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Agent_Condition_state: `<O> ഒരെണ്ണമെങ്കിലും കൈകാര്യം ചെയ്യുന്നു <P1...n> എങ്കിൽ <O> ആണ് <s1>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Instrument: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> ആവശ്യമാണ് <O_Os>`,
          Instrument_Event: `<O_Os> ഇതിലൊന്നെങ്കിലും ആരംഭിക്കുന്നു <P1...n>, ഇതിന് ആവശ്യമാണ് <O_Os>`,
          Instrument_Condition: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> ആവശ്യമാണ് <O_Os>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`,
          Instrument_Condition_state: `കുറഞ്ഞത് ഒരെണ്ണമെങ്കിലും <P1...n> അത് ആവശ്യമാണ് <O> ആണ് <s1>, അല്ലെങ്കിൽ ഈ പ്രക്രിയകൾ ഒഴിവാക്കി.`
        }
      }
    },
    tags: {
      multiplicity: `<tag> <O_Os>`,
      constraints: `<O_Os>; എവിടെ <tag>`,
      probability: `<O_Os>സംഭാവ്യതയോടെ <tag>`,
      rate: `<O_Os> എന്ന നിരക്കിൽ <tag> <units>`,
      path: `പാത പിന്തുടരുന്നു <tag>, <opl>`,
      range: `<r> <opl>`
    },
    symbols: {
      "?": `an optional`,
      "*": `optional`,
      "+": `at least one`,
      "n..n": `<n1> ടു <n2>`,
      "n..*": `<n1> പല സ്ഥലങ്ങളിലേക്ക്`
    },
    ranges: {
      "<=": `less than or equal to`,
      ">=": "more than or equal to",
      "=": "equal to",
      "<>": "not equal to",
      "<": `less than`,
      ">": "more than"
    },
    object: {
      thing_generic_name: `വസ്തു`,
      default_essence_affiliation: ``,
      digital_twin: `<TWIN> is the Digital Twin of <O>.`,
      default_essence: `<O> ആണ്  <a>.`,
      default_affiliation: `<O> ആണ്  <e>.`,
      non_default: `<O> ആണ്  <e> ഒപ്പം <a>.`,
      singleInzoom: `<O> മുതൽ <SD_Parent> സൂം ഇൻ <Current_SD> എന്നതിലേക്ക് <T_list>.`,
      singleInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>.`,
      multiInzoomInDiagram: `<O> zooms into <O_list> as depicted in <Current_SD>, as well as <P_list>.`,
      multiInzoom: `<O> മുതൽ <SD_Parent> സൂം ഇൻ <Current_SD> എന്നതിലേക്ക് <O_list>, കൂടാതെ <P_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<O> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<O> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<O> from <SD_Parent> feature-unfolds in <Current_SD> into <O_list>, as well as <P_list>.`,
      single_unfold_instantiation: `<O> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      object_list_sequence: `<O1...n>, ആ ലംബ ശ്രേണിയിൽ`,
      object_list_parallel: `<O1...n>, ആ ലംബ ശ്രേണിയിൽ`
    },
    process: {
      thing_generic_name: `പ്രക്രിയ`,
      default_essence_affiliation: ``,
      default_essence: `<P> ആണ് <a>.`,
      default_affiliation: `<P> ആണ് <e>.`,
      non_default: `<P> ആണ്<e> ഒപ്പം <a>.`,
      singleInzoom: `<P> മുതൽ <SD_Parent> സൂം ഇൻ <Current_SD> എന്നതിലേക്ക് <T_list>, അത് ആ സമയ ശ്രേണിയിൽ സംഭവിക്കുന്നു.`,
      singleInzoom_parallel: `<P> from <SD_Parent> zooms in <Current_SD> into <T_list>.`,
      multiInzoom: `<P> മുതൽ <SD_Parent> സൂം ഇൻ <Current_SD> എന്നതിലേക്ക് <P_list>, കൂടാതെ <O_list>.`,
      multiInzoomOneProcess: `<P> from <SD_Parent> zooms in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_aggregation: `<P> from <SD_Parent> part-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_generalization: `<P> from <SD_Parent> specialization-unfolds in <Current_SD> into <T_list>.`,
      single_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <T_list>.`,
      multi_unfold_exhibition: `<P> from <SD_Parent> feature-unfolds in <Current_SD> into <P_list>, as well as <O_list>.`,
      single_unfold_instantiation: `<P> from <SD_Parent> instance-unfolds in <Current_SD> into <T_list>.`,
      unspecified_unfold: `<T> from <SD_Parent> unfolds in <Current_SD>.`,
      // 'process_list_parallel': `<P1...n>, ആ തിരശ്ചീന ശ്രേണിയിൽ`,
      process_list_parallel: `സമാന്തരമായി <P1...n>`,
      // 'process_list_sequence': `<P1...n>, ആ ലംബ ശ്രേണിയിൽ`,
      process_list_sequence: `<P1...n>`,
      expected_duration: `ന്റെ പ്രതീക്ഷിച്ച കാലാവധിയുടെ മൂല്യം <P> ആണ് <exp> <units>.`,
      min_duration: `ന്റെ കാലയളവിന്റെ കാലാവധിയുടെ മൂല്യം <P> ആണ് <min> <units>.`,
      max_duration: `ന്റെ പ്രതീക്ഷിച്ച കാലാവധിയുടെ മൂല്യം <P> ആണ് <max> <units>.`,
      min_max_range_duration: `ന്റെ ഏറ്റവും കുറഞ്ഞ കാലയളവിന്റെയും പരമാവധി കാലാവധിയുടെയും മൂല്യങ്ങൾ <P> ആകുന്നു <min> <units> ഒപ്പം <max> <units>, യഥാക്രമം.`,
      min_exp_range_duration: `ന്റെ ഏറ്റവും കുറഞ്ഞ കാലയളവിന്റെയും പരമാവധി കാലാവധിയുടെയും മൂല്യങ്ങൾ <P> ആകുന്നു <min> <units> ഒപ്പം <exp> <units>, യഥാക്രമം.`,
      exp_max_range_duration: `ന്റെ ഏറ്റവും കുറഞ്ഞ കാലയളവിന്റെയും പരമാവധി കാലാവധിയുടെയും മൂല്യങ്ങൾ <P> ആകുന്നു <exp> <units> ഒപ്പം <max> <units>, യഥാക്രമം.`,
      expected_range_duration: `കുറഞ്ഞ കാലയളവിന്റെ മൂല്യങ്ങൾ, പ്രതീക്ഷിച്ച കാലാവധി, ഒപ്പം പരമാവധി ദൈർഘ്യം <P> ആകുന്നു <min> <units>, <exp> <units>, ഒപ്പം <max> <units>, യഥാക്രമം.`
    },
    state: {
      single_state: `<O> ആണ് <s>.`,
      multiple_states: `<O> ആകാം <s1...n>.`,
      all_states_are_suppressed: `<O> is stateful.`,
      one_state_shown_one_missing: `<O> is <s> or at one other state.`,
      one_state_shown: `<O> is <s> and can be at one of <num> other states.`,
      two_or_more_states_shown_one_missing: `<O> can be <s1...n> or at one other state.`,
      two_or_more_states_shown: `<O> can be <s1...n> or at one of <num> other states.`,
      default: `അവസ്ഥ <s> സ്ഥിരസ്ഥിതിയാണ്.`,
      default_initial: `അവസ്ഥ <s> സ്ഥിരസ്ഥിതിയും പ്രാരംഭവുമാണ്.`,
      initial: `അവസ്ഥ <s> പ്രാരംഭമാണ്.`,
      final: `അവസ്ഥ <s> അന്തിമമാണ്.`,
      default_initial_final: `അവസ്ഥ <s> പ്രാരംഭമാണ്, ഫൈനൽ, സ്ഥിരസ്ഥിതി.`,
      initial_final: `അവസ്ഥ <s> പ്രാരംഭവും അന്തിമവുമാണ്.`,
      default_final: `അവസ്ഥ <s> അന്തിമവും സ്ഥിരവുമാണ്.`,
      none: ``,
      Current: `<O> is currently at state <s>.`,
      // 'timeDurational': {
      expected_duration: `ന്റെ പ്രതീക്ഷിച്ച കാലാവധിയുടെ മൂല്യം <s> ആണ് <exp> <units>.`,
      min_duration: `ന്റെ കാലയളവിന്റെ കാലാവധിയുടെ മൂല്യം <s> ആണ് <min> <units>.`,
      max_duration: `ന്റെ പ്രതീക്ഷിച്ച കാലാവധിയുടെ മൂല്യം <s> ആണ് <max> <units>.`,
      min_max_range_duration: `ന്റെ ഏറ്റവും കുറഞ്ഞ കാലയളവിന്റെയും പരമാവധി കാലാവധിയുടെയും മൂല്യങ്ങൾ <s> ആകുന്നു <min> <units> ഒപ്പം <max> <units>, യഥാക്രമം.`,
      min_exp_range_duration: `ന്റെ ഏറ്റവും കുറഞ്ഞ കാലയളവിന്റെയും പരമാവധി കാലാവധിയുടെയും മൂല്യങ്ങൾ <s> ആകുന്നു <min> <units> ഒപ്പം <exp> <units>, യഥാക്രമം.`,
      exp_max_range_duration: `ന്റെ ഏറ്റവും കുറഞ്ഞ കാലയളവിന്റെയും പരമാവധി കാലാവധിയുടെയും മൂല്യങ്ങൾ <s> ആകുന്നു <exp> <units> ഒപ്പം <max> <units>, യഥാക്രമം.`,
      expected_range_duration: `കുറഞ്ഞ കാലയളവിന്റെ മൂല്യങ്ങൾ, പ്രതീക്ഷിച്ച കാലാവധി, ഒപ്പം പരമാവധി ദൈർഘ്യം <s> ആകുന്നു <min> <units>, <exp> <units>, ഒപ്പം <max> <units>, യഥാക്രമം.`,
      default_time_units: `seconds`
      //  },
    },
    essence: {
      physical: `physical`,
      informatical: `informatical`
    },
    affiliation: {
      systemic: `systemic`,
      environmental: `environmental`
    },
    semifolding: {
      object: `<O> lists `,
      process: `<P> lists `,
      aggregation: {
        single: `<T> as a part`,
        multiple: `<T1...n-1> and <Tn> as parts`
      },
      exhibition: {
        single: `<T> as a feature`,
        multiple: `<T1...n-1> and <Tn> as features`
      },
      generalization: {
        single: `<T> as a specialization`,
        multiple: `<T1...n-1> and <Tn> as specializations`
      },
      instantiation: {
        single: `<T> as an instance`,
        multiple: `<T1...n-1> and <Tn> as instances`
      }
    }
  };
  /*
   * This function updates the linkTable based on the CURRENT oplTemplate
  */
  function changeLinkTable() {
    const combinedTemplates = {};
    for (const linkType of Object.keys(oplTemplates.structural_link)) {
      combinedTemplates[linkType] = oplTemplates.structural_link[linkType];
    }
    for (const linkType of Object.keys(oplTemplates.procedural_link)) {
      combinedTemplates[linkType] = oplTemplates.procedural_link[linkType];
    }
    for (const relation of Object.keys(oplTable)) {
      for (const linkType of Object.keys(oplTable[relation])) {
        try {
          let templateLinkType = linkType;
          if (oplTable[relation][linkType].indexOf("<s>") > -1) {
            const statefulLink = linkType + "_state";
            if (Object.keys(combinedTemplates).indexOf(statefulLink) > -1) {
              templateLinkType = statefulLink;
            }
          }
          switch (relation) {
            case "O1-O2":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T1>", "<O1>").replace("<T2>", "<O2>");
                break;
              }
            case "O1-O2s":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T2>", oplTemplates.grouping["Stateful-Object"].replace("<O>", "<O2>")).replace("<T1>", "<O1>");
                break;
              }
            case "O-P":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<O_Os>", "<O>").replace("<T1>", "<O>").replace("<T2>", "<P>");
                break;
              }
            case "P-O":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<O_Os>", "<O>").replace("<T1>", "<P>").replace("<T2>", "<O>");
                break;
              }
            case "P1-P2":
              {
                if (linkType.indexOf("exception") > -1) {
                  templateLinkType = linkType + "_(process)";
                }
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T1>", "<P1>").replace("<T2>", "<P2>");
                break;
              }
            case "P-Os":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<O_Os>", oplTemplates.grouping["Stateful-Object"]).replace("<T1>", "<P>").replace("<T2>", oplTemplates.grouping["Stateful-Object"]);
                break;
              }
            case "P1-P1 (same process)":
              {
                if (linkType.toLowerCase().indexOf("invocation") > -1) {
                  templateLinkType = linkType + "_(self)";
                }
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T1>", "<P1>").replace("<T2>", "<P2>");
                break;
              }
            case "P1-P2 (parent process)":
              {
                if (linkType.toLowerCase().indexOf("invocation") > -1) {
                  templateLinkType = linkType + "_(parent)";
                }
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T1>", "<P1>").replace("<T2>", "<P2>");
                break;
              }
            case "O1s-O2":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T1>", oplTemplates.grouping["Stateful-Object"].replace("<O>", "<O1>")).replace("<T2>", "<O2>");
                break;
              }
            case "O1s1-O2s2":
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<T1>", oplTemplates.grouping["Stateful-Object"].replace("<O>", "<O1>").replace("<s>", "<s1>")).replace("<T2>", oplTemplates.grouping["Stateful-Object"].replace("<O>", "<O2>").replace("<s>", "<s2>"));
                break;
              }
            case "Os-P":
              {
                try {
                  oplTable[relation][linkType] = combinedTemplates[templateLinkType].replace("<O_Os>", oplTemplates.grouping["Stateful-Object"]).replace("<T2>", "<P>").replace("<T1>", oplTemplates.grouping["Stateful-Object"]);
                } catch (e) {
                  console.log();
                }
                break;
              }
            default:
              {
                oplTable[relation][linkType] = combinedTemplates[templateLinkType];
                break;
              }
          }
        } catch (e) {
          console.log();
        }
      }
    }
    return oplTable;
  }
  const OplTables = {
    en: oplTemplates_en,
    cn: oplTemplates_cn,
    fr: oplTemplates_fr,
    gr: oplTemplates_gr,
    ko: oplTemplates_ko,
    jp: oplTemplates_jp,
    es: oplTemplates_es,
    ml: oplTemplates_ml,
    ru: oplTemplates_ru,
    pt: oplTemplates_portuguese
  };
  // The actual settings of the current user.
  let oplDefaultSettings = {
    affiliation: Affiliations[0],
    essence: Essences[0],
    language: Languages[0],
    oplNumbering: true,
    autoFormat: true,
    displayOpt: DisplayOpt[2],
    oplTables: OplTables,
    SDNames: false,
    highlightOpl: false,
    highlightOpd: true,
    Notes: true,
    markThings: true,
    syncOplcolorsFromOpd: true,
    timeDurationUnitsDigits: 2,
    displayNotes: true,
    pythonExecution: "local",
    bringConnectedSettings: {
      proceduralEnablers: true,
      proceduralTransformers: true,
      fundamentals: false,
      tagged: false
    }
  };
  let oplTemplates = oplDefaultSettings.oplTables[oplDefaultSettings.language];
  const structuralLinkTypes = Object.keys(oplTemplates.structural_link);
  const proceduralLinkTypes = Object.keys(oplTemplates.procedural_link);
  /*
  export const defaultTable_cn = {
    'O1-O2': {
      'Aggregation-Participation': `<O1>包含<O2>。`,
      'Bidirectional_Relation_(tag)': `<O1>和<O2>是<tag>。`,
      'Unidirectional_Relation': `<O1>与<O2>相关。`,
      'Bidirectional_Relation': `<O1>和<O2>是等价的。`,
      'Generalization-Specialization': `<O2>是一个<O1>。`,
      'Classification-Instantiation': `<O2>是<O1>的一个实例.`,
      'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <O2>和<O2> <backward tag> <O1>。`,
      'Exhibition-Characterization': `<O1>表现出<O2>。`},
    'P1-P2': {
      'Overtime_exception': `<P2>在<P1>持续超过<maxtime> <units>时发生。`,
      'Undertime_exception': `<P2>在<P1>持续少于<mintime> <units>时发生。`,
      'Aggregation-Participation': `<P1>包含<P2>。`,
      // 'Bidirectional_Relation_(tag)': `<P1> and <P2> are <forward tag>.`,
      'OvertimeUndertime-exception':
        `<P2>在<P1>持续少于<mintime> <units>或大于<maxtime> <units>时发生。`,
      'Unidirectional_Relation': `<P1>和<P2>相关。`,
      'Invocation': `<P1>调用<P2>。`,
      'Bidirectional_Relation': `<P1>和<P2>是等价的。`,
      'Generalization-Specialization': `<P2>是一个<P1>。`,
      'Classification-Instantiation': `<P2>是<P1>的一个实例。`,
      // 'Unidirectional_Relation_(tag)': `<P1> <tag> <P2>.`,
      // 'Bidirectional_Relation_(ftag,btag)': `<P1> <forward tag> <P2> and <P2> <backward tag> <P1>.`,
      'Exhibition-Characterization': `<P1>表现出<P2>。`},
    'P1-P1 (same process)': {
      'Invocation': `<P1>调用其本身。`},
    'O-P': {
      'Agent': `<O>处理<P>。`,
      'Agent_Condition': `<P>在<O>存在时发生,否则<P>被跳过。`,
      'Agent_Event': `<O>发起并处理<P>。`,
      'Consumption': `<P>消耗<O>。`,
      'Consumption_Condition': `<P>在<O>存在时发生,在这种情况下<P>消耗<O>,否则，<P>被跳过。`,
      'Consumption_Event': `<O>发起<P>,并且<P>消耗<O>。`,
      'Instrument': `<P>需要<O>.`,
      'Instrument_Condition': `<P>在<O>存在时发生,否则<P>被跳过。`,
      'Instrument_Event': `<O>发起<P>,并且<P>需要<O>。`,
      'Exhibition-Characterization': `<O>表现出<P>。`,
      'Effect': `<P>影响<O>。`,
      'Effect_Event': `<O>发起<P>,并且<P>影响<O>`,
      'Effect_Condition': `<P>在<O>存在时发生,在这种情况下<P>影响<O>,否则<P>被跳过。`,
    },
    'P-O': {
      'Exhibition-Characterization': `<P>表现出<O>。`,
      'Result': `<P>产出<O>。`,
      'Effect': `<P>影响<O>。`,
      'Effect_Event': `<O>发起<P>,并且影响<O>。`,
      'Effect_Condition': `<P>在<O>存在时发生,在这种情况下<P>影响<O>,否则<P>被调过。`,
    },
    'Os-(P)-O (from object state to the same object)': {
      'Overtime_exception': `当<O>为<s>超过<maxtime><units>时<O>触发<P>,在这种情况下<P>改变<O>。`,
      'Condition_Input ': `<P>在<O>是<s>时发生,在这种情况下<P>将<O>从<s>改变,否则<P>被跳过。`,
      'In-out_Link_Pair': `<P>将<O>从<s>改变。`},
    'O1s-O2': {
      'Bidirectional_Relation_(tag)': `<s> <O1>和<O2>是<forward tag>。`,
      'Unidirectional_Relation': `<s><O1>和<O2>相关。`,
      'Bidirectional_Relation': `<s><O1>和<O2>是等价的。`,
      'Unidirectional_Relation_(tag)': `<s><O1><tag><O2>。`,
      'Bidirectional_Relation_(ftag,btag)': `<s><O1><forward tag><O2>并且<O2><backward tag><s><O1>。`,
      'Exhibition-Characterization': `<s><O1>表现出<O2>。`},
    'P-Os': {
      'Split_output': `<P>改变<O>为<s>.`,
      'In-out_Link_Pair': `<P>把<O>从<s>变为<s>。`,
      // 'Exhibition-Characterization': `<P>表现出<s><O>。`,
      'Result': `<P>产出<s><O>。`},
    'O1s1-O2s2': {
      'Unidirectional_Relation': `<s1><O1>与<s2><O2>相关。`,
      'Bidirectional_Relation_(tag)': `<s1><O1>和<s2><O2>是<forward tag>。`,
      'Bidirectional_Relation_(ftag,btag)': `<s1><O1><forward tag><s2><O2>和<s2><O2><backward tag><s1><O1>。`,
      'Bidirectional_Relation': `<s1><O1>和<s2> <O2>是等价的。`,
      'Unidirectional_Relation_(tag)': `<s1><O1><tag><s2><O2>。`},
    'O1-T2..n (n>=2 many destinations)': {
      'Aggregation-Participation': `<O1>包含<T1...n-1>和<Tn>。`,
      'Unidirectional_Relation': `<O1>与<T1...n-1> 和 <Tn>相关。`,
      'Generalization-Specialization': `<T1...n-1> 和 <Tn> 是 <O1>。`,
      'Classification-Instantiation': `<T1...n-1> 和 <Tn>是<O1>的一个实例。`,
      'Unidirectional_Relation_(tag)': `<O1> <tag> <T1...n-1>和<Tn>。`,
      'Exhibition-Characterization': `<O1>表现出<T1...n-1>和<Tn>。`},
    'P1-T2..n (n>=2 many destinations)': {
      'Exhibition-Characterization': `<P1>表现出<T1...n-1>和<Tn>。`,
      'Aggregation-Participation': `<P1>包含<T1...n-1>和<Tn>。`,
      'Unidirectional_Relation': `<P1>与<T1...n-1>和<Tn>相关。`,
      'Generalization-Specialization': `<T1...n-1>和<Tn>是<P1>。`,
      'Classification-Instantiation': `<T1...n-1>和<Tn>是<P1>的一个实例。`,
      'Unidirectional_Relation_(tag)': `<P1> <tag> <T1...n-1> 和<Tn>.`},
    'O1s1-T2..n (n>=2 many destinations)': {
      'Exhibition-Characterization': `<s1><O1>表现出<T1...n-1>和<Tn>.`},
    'O1-O2s': {
      'Bidirectional_Relation_(tag)': `<O1>和<s><O2>是<forward tag>。`,
      'Unidirectional_Relation': `<O1>和<s><O2>相。.`,
      'Bidirectional_Relation': `<O1>和<s><O2>是等价的。`,
      'Unidirectional_Relation_(tag)': `<O1><tag><s><O2>。`,
      'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <s><O2>并且<s><O2> <backward tag><O1>.`,
      'Exhibition-Characterization': `<O1>表现出<s><O2>。`},
    'Os1-(P)-Os2 (same object)': {
      'Overtime_exception':
        `当<O>为<s1>超过<maxtime><units>时<O>触发<P>,在这种情况下<P>将<O>变为<s2>。`,
      'Condition_Input ': `如果<O>是<s1>,<P>发生,在这种情况下<P>把<O>从<s1>变为<s2>,否则<P>被跳过。`,
      'In-out_Link_Pair': `<P>把<O>从<s1>变为<s2>。`},
    'Os-P': {
      'In-out_Link_Pair': `<P>把<O>从<s>变为<s>。`,
      'Agent': `<s> <O>处理<P>。`,
      'Agent_Condition': `如果<O>是<s>,<P>发生,否则<P>被跳过。`,
      'Agent_Event': `<s><O>发起并处理<P>。`,
      'Consumption': `<P>消耗<s><O>。`,
      'Consumption_Condition': `当<O>是在<s>状态时<P>发生,在这种情况下<P>消耗<O>,否则<P>被跳过。`,
      'Consumption_Event': `<s><O>发起<P>,同时<O>被消耗。`,
      'Split_input': `<P>将<O>改变为<s>。`,
      'Instrument': `<P>需要<s><O>。`,
      'Instrument_Condition': `如果<O>是在<s>状态,<P>发生,否则<P>被跳过。`,
      'Instrument_Event': `<s><O>发起<P>,同时<P>需要<s><O>.`,
      'Overtime_exception': `当<O>为<s>超过<maxtime> <units>,<O>触发<P。`,
      'Undertime_exception': `当<O>为<s>少于<mintime> <units>,<O>触发<P>。`,
      'OvertimeUndertime-exception': `当<O>为 <s>超过<maxtime> <units>或少于<mintime> <units>,<O>触发<P>。`,
      'Exhibition-Characterization': `<s><O>表现出<P>。`},
    'Object': {
      default_essence_affiliation: ``,
      default_essence: `<O> is <a>.`,
      default_affiliation: `<O> is <e>.`,
      non_default: `<O> is <e> and <a>.`,
      singleInzoom: `<O> zooms into <T>.`,
      multiInzoom: `<O> zooms into <T1...n-1> and <Tn>.`
    },
    'Process': {
      default_essence_affiliation: ``,
      default_essence: `<P> is <a>.`,
      default_affiliation: `<P> is <e>.`,
      non_default: `<P> is <e> and <a>.`,
      singleInzoom: `<P> zooms into <T>.`,
      multiInzoom: `<P> zooms into <T1...n-1> and <Tn>.`
    },
    'State': {
      singleState: `<O> is <s>.`,
      multiStates: `<O> can be <s1...n-1> and <sn>.`,
      Default: `<s> by default`,
      DefInitial: `initially <s> by default`,
      Initial: `initially <s>`,
      Final: `finally <s>`,
      all: `initially and finally <s> by default`,
      finInitial: `initially and finally <s>`,
      DefFinal: `finally <s> by default`,
      none: `<s>`
    },
    'Essence': {
      physical: `physical`,
      informatical: `informatical`,
    },
    'Affiliation': {
      systemic: `systemic`,
      environmental: `environmental`,
    }
  };
  export const defaultTable_fr = {
    'O1-O2': {
      'Aggregation-Participation': '<O1> est compris de <O2>.',
      'Bidirectional_Relation_(tag)': '<O1> et<O2> sont <tag>.',
      'Unidirectional_Relation': '<O1> concerne <O2>.',
      'Bidirectional_Relation': '<O1> et <O2> sont équivalent.',
      'Generalization-Specialization': '<O2> est un <O1>.',
      'Classification-Instantiation': '<O2> est une instance de <O1>.',
      'Bidirectional_Relation_(ftag,btag)': '<O1> <forward tag> <O2> et <O2> <backward tag> <O1>.',
      'Exhibition-Characterization': '<O1> présente <O2>.'
    },
    'P1-P2': {
      'Overtime_exception': '<P2> se produit si <P1> dure plus de <maxtime> <units>.',
      'Undertime_exception': '<P2> se produit si <P1> est plus courte que <mintime> <units>.',
      'Aggregation-Participation': '<P1> consiste en <P2>.',
      'OvertimeUndertime-exception': '<P2> se produit si <P1> fest plus courte que <mintime> <units> ou dure plus de <maxtime> <units>.',
      'Unidirectional_Relation': '<P1> se rapporte à <P2>.',
      'Invocation': '<P1> invoque <P2>.',
      'Bidirectional_Relation': '<P1> et <P2> sont équivalent.',
      'Generalization-Specialization': '<P2> est un <P1>.',
      'Classification-Instantiation': '<P2> est une instance de <P1>.',
      'Exhibition-Characterization': '<P1>présente <P2>.'
    },
    'P1-P1 (same process)': {
      'Invocation': '<P1> s\'invoque.'
    },
    'O-P': {
      'Agent': '<O> gère <P>.',
      'Agent_Condition': '<P> se produit si <O> existe, sinon <P> est ignoré.',
      'Agent_Event': '<O> initie et gère <P>.',
      'Consumption': '<P> consomme <O>.',
      'Consumption_Condition': '<P> se produit si <O> existe, auquel cas <P> consomme <O>, sinon <P> est ignoré.',
      'Consumption_Event': '<O>initie <P>, qui consomme <O>.',
      'Instrument': '<P> exige <O>.',
      'Instrument_Condition': '<P> se produit si <O> existe, sinon <P> est ignoré.',
      'Instrument_Event': '<O> initie <P>, ce qui nécessite <O>.',
      'Exhibition-Characterization': '<O> présente <P>.',
      'Effect': '<P> affecte <O>.',
      'Effect_Event': '<O> initie <P>, ce qui affecte <O>',
      'Effect_Condition': '<P> se produit si <O> existe, auquel cas <P> affecte <O>, sinon <P> est ignoré.'
    },
    'P-O': {
      'Exhibition-Characterization': '<P> présente <O>.',
      'Result': '<P> produit <O>.',
      'Effect': '<P> affecte <O>.',
      'Effect_Event': '<O> initie <P>, ce qui affecte <O>',
      'Effect_Condition': '<P> se produit si <O> existe, auquel cas <P> affecte <O>, sinon <P> est ignoré.'
    },
    'Os-(P)-O (from object state to the same object)': {
      'Overtime_exception': '<O> déclenche <P> quand <O> est <s> plus de <maxtime> <units>, auquel cas <P> change <O>.',
      'Condition_Input ': '<P> se produit si <O> est <s>, auquel cas <P> change <O> de <s>, sinon <P> est ignoré.',
      'In-out_Link_Pair': '<P> change <O> de <s>.'
    },
    'O1s-O2': {
      'Bidirectional_Relation_(tag)': '<s> <O1> et <O2> sont <forward tag>.',
      'Unidirectional_Relation': '<s> <O1> se rapporte à <O2>.',
      'Bidirectional_Relation': '<s> <O1> et <O2> sont équivalent.',
      'Unidirectional_Relation_(tag)': '<s> <O1> <tag> <O2>.',
      'Bidirectional_Relation_(ftag,btag)': '<s> <O1>  <forward tag> <O2> et <O2> <backward tag> <s> <O1>.',
      'Exhibition-Characterization': '<s> <O1> présente <O2>.'
    },
    'P-Os': {
      'Split_output': '<P> change <O> to <s>.',
      'In-out_Link_Pair': '<P> change <O> from <s> to <s>.',
      // 'Exhibition-Characterization': '<P> présente <s> <O>.',
      'Result': '<P> se produit <s> <O>.'
    },
    'O1s1-O2s2': {
      'Unidirectional_Relation': '<s1> <O1> se rapporte à <s2> <O2>.',
      'Bidirectional_Relation_(tag)': '<s1> <O1> et <s2> <O2> sont <forward tag>.',
      'Bidirectional_Relation_(ftag,btag)': '<s1> <O1> <forward tag> <s2><O2> et <s2><O2> <backward tag><s1> <O1>.',
      'Bidirectional_Relation': '<s1> <O1> et <s2> <O2> sont équivalent.',
      'Unidirectional_Relation_(tag)': '<s1> <O1> <tag> <s2> <O2>.'
    },
    'O1-T2..n (n>=2 many destinations)': {
      'Aggregation-Participation': '<O1> consiste en <T1...n-1> et <Tn>.',
      'Unidirectional_Relation': '<O1> se rapporte à <T1...n-1> et <Tn>.',
      'Generalization-Specialization': '<T1...n-1> et <Tn> sont <O1>.',
      'Classification-Instantiation': '<T1...n-1> et <Tn> sont des instances de <O1>.',
      'Unidirectional_Relation_(tag)': '<O1> <tag> <T1...n-1> et <Tn>.',
      'Exhibition-Characterization': '<O1> présente <T1...n-1> et <Tn>.'
    },
    'P1-T2..n (n>=2 many destinations)': {
      'Exhibition-Characterization': '<P1> présente <T1...n-1> et <Tn>.',
      'Aggregation-Participation': '<P1> consiste en <T1...n-1> et <Tn>.',
      'Unidirectional_Relation': '<P1> se rapporte à <T1...n-1> et <Tn>.',
      'Generalization-Specialization': '<T1...n-1> et <Tn> sont <P1>.',
      'Classification-Instantiation': '<T1...n-1> et <Tn> sont des instances de <P1>.',
      'Unidirectional_Relation_(tag)': '<P1> <tag> <T1...n-1> et <Tn>.'
    },
    'O1s1-T2..n (n>=2 many destinations)': {
      'Exhibition-Characterization': '<s1> <O1> présente <T1...n-1> et <Tn>.'
    },
    'O1-O2s': {
      'Bidirectional_Relation_(tag)': '<O1> et  <s> <O2> sont <forward tag>.',
      'Unidirectional_Relation': '<O1> se rapporte à <s> <O2>.',
      'Bidirectional_Relation': '<O1> et <s> <O2> sont équivalent.',
      'Unidirectional_Relation_(tag)': '<O1> <tag> <s> <O2>.',
      'Bidirectional_Relation_(ftag,btag)': '<O1> <forward tag> <s><O2> et <s><O2> <backward tag> to  <O1>.',
      'Exhibition-Characterization': '<O1> présente <s> <O2>.'
    },
    'Os1-(P)-Os2 (same object)': {
      'Overtime_exception': '<O> déclenche le processus lorsque <O> est <s1> plus de <maxtime> <units>, auquel cas <P> change <o> en <s2>.',
      'Condition_Input ': '<P> se produit si <O> est <s1>, auquel cas <P> change <O> de <s1> en <s2>, sinon <P> est ignoré.',
      'In-out_Link_Pair': '<P> change <O> de <s1> à <s2>.'
    },
    'Os-P': {
      'In-out_Link_Pair': '<P> change <O> de <s> à <s>.',
      'Agent': '<s> <O> gère <P>.',
      'Agent_Condition': '<P> se produit si <O> est <s>, sinon <P> est ignoré.',
      'Agent_Event': '<s> <O>initie et gère <P>.',
      'Consumption': '<P> consomme <s> <O>.',
      'Consumption_Condition': '<P> se produit si <O> est à l\'état <s>, auquel cas <P> consomme <O>, sinon <P> est ignoré.',
      'Consumption_Event': '<s> <O> lance <P>, qui consomme <O>.',
      'Split_input': '<P> change <O> de <s>.',
      'Instrument': '<P> nécessite <s> <O>.',
      'Instrument_Condition': '<P> occurs if <O> is at state <s>, otherwise <P> is skipped.',
      'Instrument_Event': '<P> se produit si <O> est à l\'état <s>, sinon <P> est ignoré.',
      'Overtime_exception': '<O> déclenche <P> lorsque <O> est <s> supérieur à <maxtime> <units>.',
      'Undertime_exception': 'déclenche <P> lorsque <O> est <s> inférieur à <mintime> <units>.',
      'OvertimeUndertime-exception': '<O> déclenche <P> lorsque <O> est <s> supérieur à <maxtime> <units> et inférieur à <mintime> <units>.',
      'Exhibition-Characterization': '<s> <O> présente <P>.'
    },
    'Object': {
      'default_essence_affiliation': '',
      'default_essence': '<O> est <a>.',
      'default_affiliation': '<O> est <e>.',
      'non_default': '<O> est <e> et <a>.',
      'singleInzoom': '<O> effectue un zoom sur <T>.',
      'multiInzoom': '<O> effectue un zoom sur <T1...n-1> et <Tn>.'
    },
    'Process': {
      'default_essence_affiliation': '',
      'default_essence': '<P> est <a>.',
      'default_affiliation': '<P> est  <e>.',
      'non_default': '<P> est <e> et <a>.',
      'singleInzoom': '<P> effectue un zoom sur <T>.',
      'multiInzoom': '<P> effectue un zoom sur <T1...n-1> et <Tn>.'
    },
    'State': {
      'singleState': '<O> is <s>.',
      'multiStates': '<O> can be <s1...n-1> and <sn>.',
      'Default': '<s> by default',
      'DefInitial': 'initially <s> by default',
      'Initial': 'initially <s>',
      'Final': 'finally <s>',
      'all': 'initially and finally <s> by default',
      'finInitial': 'initially and finally <s>',
      'DefFinal': 'finally <s> by default',
      'none': '<s>'
    },
    'Essence': {
      'physical': 'physical',
      'informatical': 'informatical'
    },
    'Affiliation': {
      'systemic': 'systemic',
      'environmental': 'environmental'
    }
  };
  export const defaultTable_en = {
    'O1-O2': {
      'Aggregation-Participation': `<O1> consists of <O2>.`,
      'Unidirectional_Relation': `<O1> relates to <O2>.`,
      'Bidirectional_Relation': `<O1> and <O2> are equivalent.`,
      'Generalization-Specialization': `<O2> is a <O1>.`,
      'Classification-Instantiation': `<O2> is an instance of <O1>.`,
      'Unidirectional_Relation_(tag)': `<O1> <tag> <O2>.`,
      'Bidirectional_Relation_(tag)': `<O1> and <O2> are <tag>.`,
      'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <O2> and <O2> <backward tag> <O1>.`,
      'Exhibition-Characterization': `<O1> exhibits <O2>.`},
    'P1-P2': {
      'Overtime_exception': `<P2> occurs if <P1> lasts more than <maxtime> <units>.`,
      'Undertime_exception': `<P2> occurs if <P1> falls short of <mintime> <units>.`,
      'Aggregation-Participation': `<P1> consist of <P2>.`,
      'OvertimeUndertime-exception':
        `<P2> occurs if <P1> falls short of <mintime> <units> or lasts more than <maxtime> <units>.`,
      'Unidirectional_Relation': `<P1> relates to <P2>.`,
      'Invocation': `<P1> invokes <P2>.`,
      'Bidirectional_Relation': `<P1> and <P2> are equivalent.`,
      'Generalization-Specialization': `<P2> is <P1>.`,
      'Classification-Instantiation': `<P2> is an instance of <P1>.`,
      'Unidirectional_Relation_(tag)': `<P1> <tag> <P2>.`,
      'Bidirectional_Relation_(tag)': `<P1> and <P2> are <forward tag>.`,
      'Bidirectional_Relation_(ftag,btag)': `<P1> <forward tag> <P2> and <P2> <backward tag> <P1>.`,
      'Exhibition-Characterization': `<P1> exhibits <P2>.`},
    'P1-P1 (same process)': {
      'Invocation': `<P1> invokes itself.`},
    'O-P': {
      'Agent': `<O> handles <P>.`,
      'Agent_Condition': `<P> occurs if <O> exists, otherwise <P> is skipped.`,
      'Agent_Event': `<O> initiates and handles <P>.`,
      'Consumption': `<P> consumes <O>.`,
      'Consumption_Condition': `<P> occurs if <O> exists, in which case<P>  consumes <O>, otherwise <P>  is skipped.`,
      'Consumption_Event': `<O> initiates <P>, which consumes <O>.`,
      'Instrument': `<P> requires <O>.`,
      'Instrument_Condition': `<P> occurs if <O> exists, otherwise <P>  is skipped.`,
      'Instrument_Event': `<O> initiates <P>, which requires <O>.`,
      'Exhibition-Characterization': `<O> exhibits <P>.`,
      'Effect': `<P> affects <O>.`,
      'Effect_Event': `<O> initiates <P>, which affects <O>`,
      'Effect_Condition': `<P> occurs if <O> exists, in which case<P>  affects <O>, otherwise <P>  is skipped.`,
    },
    'P-O': {
      'Exhibition-Characterization': `<P> exhibits <O>.`,
      'Result': `<P> yields <O>.`,
      'Effect': `<P> affects <O>.`,
      'Effect_Event': `<O> initiates <P>, which affects <O>`,
      'Effect_Condition': `<P> occurs if <O> exists, in which case<P>  affects <O>, otherwise <P>  is skipped.`,
    },
    'Os-(P)-O (from object state to the same object)': {
      'Overtime_exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units>, in which case <P> changes <O>.`,
      'Condition_Input ': `<P> occurs if <O> is <s>, in which case <P> changes <O> from <s> , otherwise <P>  is skipped.`,
      'In-out_Link_Pair': `<P> changes <O> from <s>.`},
    'O1s-O2': {
      'Bidirectional_Relation_(tag)': `<s> <O1> and <O2> are <forward tag>.`,
      'Unidirectional_Relation': `<s> <O1> relates to <O2>.`,
      'Bidirectional_Relation': `<s> <O1> and <O2> are equivalent.`,
      'Unidirectional_Relation_(tag)': `<s> <O1> <tag> <O2>.`,
      'Bidirectional_Relation_(ftag,btag)': `<s> <O1>  <forward tag> <O2> and <O2> <backward tag> <s> <O1>.`,
      'Exhibition-Characterization': `<s> <O1> exhibits <O2>.`},
    'P-Os': {
      'In-out_Link_Pair': `<P> changes <O> from <s1> to <s2>.`,
      'Split_output': `<P> changes <O> to <s>.`,
      // 'Exhibition-Characterization': `<P> exhibits <s> <O>.`,
      'Result': `<P> yields <s> <O>.`},
    'O1s1-O2s2': {
      'Unidirectional_Relation': `<s1> <O1> relates to <s2> <O2>.`,
      'Bidirectional_Relation_(tag)': `<s1> <O1> and <s2> <O2> are <forward tag>.`,
      'Bidirectional_Relation_(ftag,btag)': `<s1> <O1> <forward tag> <s2><O2> and <s2><O2> <backward tag><s1> <O1>.`,
      'Bidirectional_Relation': `<s1> <O1> and <s2> <O2> are equivalent.`,
      'Unidirectional_Relation_(tag)': `<s1> <O1> <tag> <s2> <O2>.`},
    'O1-T2..n (n>=2 many destinations)': {
      'Aggregation-Participation': `<O1> consist of <T1...n-1> and <Tn>.`,
      'Unidirectional_Relation': `<O1> relates to <T1...n-1> and <Tn>.`,
      'Generalization-Specialization': `<T1...n-1> and <Tn> are <O1>.`,
      'Classification-Instantiation': `<T1...n-1> and <Tn> are instances of <O1>.`,
      'Unidirectional_Relation_(tag)': `<O1> <tag> <T1...n-1> and <Tn>.`,
      'Exhibition-Characterization': `<O1> exhibits <T1...n-1> and <Tn>.`},
    'P1-T2..n (n>=2 many destinations)': {
      'Exhibition-Characterization': `<P1> exhibits <T1...n-1> and <Tn>.`,
      'Aggregation-Participation': `<P1> consist of <T1...n-1> and <Tn>.`,
      'Unidirectional_Relation': `<P1> relates to <T1...n-1> and <Tn>.`,
      'Generalization-Specialization': `<T1...n-1> and <Tn> are <P1>.`,
      'Classification-Instantiation': `<T1...n-1> and <Tn> are instances of <P1>.`,
      'Unidirectional_Relation_(tag)': `<P1> <tag> <T1...n-1> and <Tn>.`},
    'O1s1-T2..n (n>=2 many destinations)': {
      'Exhibition-Characterization': `<s1> <O1> exhibits <T1...n-1> and <Tn>.`},
    'O1-O2s': {
      'Bidirectional_Relation_(tag)': `<O1> and <s> <O2> are <forward tag>.`,
      'Unidirectional_Relation': `<O1> relates to <s> <O2>.`,
      'Bidirectional_Relation': `<O1> and <s> <O2> are equivalent.`,
      'Unidirectional_Relation_(tag)': `<O1> <tag> <s> <O2>.`,
      'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <s><O2> and <s><O2> <backward tag> to  <O1>.`,
      'Exhibition-Characterization': `<O1> exhibits <s> <O2>.`},
    'Os1-(P)-Os2 (same object)': {
      'Overtime_exception':
        `<O> triggers <P> when <O> is <s1> more than <maxtime> <units>, in which case <P> changes <O> to <s2>.`,
      'Condition_Input ': `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P>  is skipped.`,
      'In-out_Link_Pair': `<P> changes <O> from <s1> to <s2>.`},
    'Os-P': {
      'In-out_Link_Pair': `<P> changes <O> from <s1> to <s2>.`,
      'Agent': `<s> <O> handles <P>.`,
      'Agent_Condition': `<P> occurs if <O> is <s>, otherwise <P> is skipped.`,
      'Agent_Event': `<s> <O> initiates and handles<P>.`,
      'Consumption': `<P> consumes <s> <O>.`,
      'Consumption_Condition': `<P> occurs if <O> is at state <s>, in which case <P> consumes <O>, otherwise <P> is skipped.`,
      'Consumption_Event': `<s> <O> initiates <P>, which consumes <O>.`,
      'Split_input': `<P> changes <O> from <s>.`,
      'Instrument': `<P> requires <s> <O>.`,
      'Instrument_Condition': `<P> occurs if <O> is at state <s>, otherwise <P> is skipped.`,
      'Instrument_Event': `<s> <O> initiates <P>, which requires <s> <O>.`,
      'Overtime_exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units>.`,
      'Undertime_exception': `<O> triggers <P> when <O> is <s> less than <mintime> <units>.`,
      'OvertimeUndertime-exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units> and less than <mintime> <units>.`,
      'Exhibition-Characterization': `<s> <O> exhibits <P>.`},
    'Object': {
      default_essence_affiliation: ``,
      default_essence: `<O> is <a>.`,
      default_affiliation: `<O> is <e>.`,
      non_default: `<O> is <e> and <a>.`,
      singleInzoom: `<O> zooms into <T_list>.`,
      multiInzoom: `<O> zooms into <O_list>, as well as, <P_list>.`,
      object_list_sequence: `<O1...n>, in that sequence`,
    },
    'Process': {
      default_essence_affiliation: ``,
      default_essence: `<P> is <a>.`,
      default_affiliation: `<P> is <e>.`,
      non_default: `<P> is <e> and <a>.`,
      singleInzoom: `<P> zooms into <T_list>.`,
      multiInzoom: `<P> zooms into <P_list>, as well as, <O_list>.`,
      process_list_parallel: `parallel <P1...n>`,
      process_list_sequence: `<P1...n>, in that sequence`,
    },
    'Thing':{
      singleThing: `<T>`,
      multiThing: `<T1...n-1> and <Tn>`,
    },
    'State': {
      singleState: `<O> is <s>.`,
      multiStates: `<O> can be <s1...n-1> or <sn>.`,
      singleState_exhibition: `<T_a> of <T_e> is <s>.`,
      multiStates_exhibition: `<T_a> of <T_e> can be <s1...n-1> or <sn>.`,
      exhibitor_chain: `of <T_ee>`,
      multiple_exhibitors: `<T_e1...n-1> and <T_en>`,
      Default: `<s> by default`,
      DefInitial: `initially <s> by default`,
      Initial: `initially <s>`,
      Final: `finally <s>`,
      all: `initially and finally <s> by default`,
      finInitial: `initially and finally <s>`,
      DefFinal: `finally <s> by default`,
      none: `<s>`
    },
    'Essence': {
      physical: `physical`,
      informatical: `informatical`,
    },
    'Affiliation': {
      systemic: `systemic`,
      environmental: `environmental`,
    },
    'Attribute-Exhibitors': {
      basic: `<T_a> of <T_e>`,
      exhibitor_chain: `of <T_ee>`,
      multiple_exhibitors: `<T_e1...n-1> and <T_en>`,
    }
  };
  export const linkTables = {'en': defaultTable_en, 'cn': defaultTable_cn};
  */
  /*
   * linkTable is used for generating opl in link-choosing dialog
   * and it should be derived from current oplTemplate
  */
  let linkTable = changeLinkTable();
  /*
  export const linkTypes = {
    'en': {
      'Unidirectional_Relation': 'Unidirectional Relation',
      'Unidirectional_Relation_(tag)': 'Unidirectional Relation (tag)',
      'Bidirectional_Relation': 'Bidirectional Relation',
      'Bidirectional_Relation_(tag)': 'Bidirectional Relation (tag)',
      'Bidirectional_Relation_(ftag,btag)': 'Bidirectional Relation (forward tag, backward tag)',
      'Aggregation-Participation': 'Aggregation-Participation',
      'Exhibition-Characterization': 'Exhibition-Characterization',
      'Generalization-Specialization': 'Generalization-Specialization',
      'Classification-Instantiation': 'Classification-Instantiation',
      'Result': 'Result',
      'Consumption': 'Consumption',
      'Effect': 'Effect',
      'Agent': 'Agent',
      'Instrument': 'Instrument',
      'In/out_linkPair': 'In-out link pair',
      'Split_input': 'split input',
      'Split_output': 'split output',
      'Invocation': 'Invocation',
      'Overtime_exception': 'Overtime exception <maxtime, unit>',
      'Undertime_exception': 'Undertime exception<mintime,unit>',
      'UndertimeOvertimeException': 'Undertime and overtime exception <mintime..maxtime, unit>',
      'Consumption_Condition': 'Condition Consumption',
      'Effect_Condition': 'Condition Effect',
      'Condition_Input': 'Condition Input',
      'Instrument_Condition': 'Condition Instrument',
      'Agent_Condition': 'Condition Agent',
      'Consumption_Event': 'Event Consumption',
      'Effect_Event': 'Event Effect',
      'Event_Input': 'Event Input',
      'Instrument_Event': 'Event Instrument',
      'Agent_Event': 'Event Agent'
    }
  };
  export const legalRelations = {
    'O1-O2': [
      'Aggregation-Participation',
      'Unidirectional_Relation',
      'Bidirectional_Relation',
      'Generalization-Specialization',
      'Classification-Instantiation',
      'Unidirectional_Relation_(tag)',
      'Bidirectional_Relation_(tag)',
      'Bidirectional_Relation_(ftag,btag)',
      'Exhibition-Characterization'],
    'P1-P2': [
      'Overtime_exception',
      'Undertime_exception',
      'Aggregation-Participation',
      'OvertimeUndertime-exception',
      'Unidirectional_Relation',
      'Invocation',
      'Bidirectional_Relation',
      'Generalization-Specialization',
      'Classification-Instantiation',
      'Unidirectional_Relation_(tag)',
      'Bidirectional_Relation_(tag)',
      'Bidirectional_Relation_(ftag,btag)',
      'Exhibition-Characterization'
    ],
    'P1-P1 (same process)': [
      'Invocation'
    ],
    'O-P': [
      'Agent',
      'Agent_Condition',
      'Agent_Event',
      'Consumption',
      'Consumption_Condition',
      'Consumption_Event',
      'Instrument',
      'Instrument_Condition',
      'Instrument_Event',
      'Exhibition-Characterization',
      'Effect',
      'Effect_Event',
      'Effect_Condition',
    ],
    'P-O': [
      'Exhibition-Characterization',
      'Result',
      'Effect',
      'Effect_Event',
      'Effect_Condition',
    ],
    'Os-(P)-O (from object state to the same object)': [
      'Overtime_exception',
      'Condition_Input ',
      'In-out_Link_Pair'
    ],
    'O1s-O2': [
      'Bidirectional_Relation_(tag)',
      'Unidirectional_Relation',
      'Bidirectional_Relation',
      'Unidirectional_Relation_(tag)',
      'Bidirectional_Relation_(ftag,btag)',
      'Exhibition-Characterization'
    ],
    'P-Os': [
      'In/out_linkPair',
      'Split_output',
     // 'Exhibition-Characterization',
      'Result'
    ],
    'O1s1-O2s2': [
      'Unidirectional_Relation',
      'Bidirectional_Relation_(tag)',
      'Bidirectional_Relation_(ftag,btag)',
      'Bidirectional_Relation',
      'Unidirectional_Relation_(tag)'
    ],
    'O1-T2..n (n>=2 many destinations)': [
      'Aggregation-Participation',
      'Unidirectional_Relation',
      'Generalization-Specialization',
      'Classification-Instantiation',
      'Unidirectional_Relation_(tag)',
      'Exhibition-Characterization'
    ],
    'P1-T2..n (n>=2 many destinations)': [
      'Exhibition-Characterization',
      'Aggregation-Participation',
      'Unidirectional_Relation',
      'Generalization-Specialization',
      'Classification-Instantiation',
      'Unidirectional_Relation_(tag)'
    ],
    'O1s1-T2..n (n>=2 many destinations)': [
      'Exhibition-Characterization',
    ],
    'O1-O2s': [
      'Bidirectional_Relation_(tag)',
      'Unidirectional_Relation',
      'Bidirectional_Relation',
      'Unidirectional_Relation_(tag)',
      'Bidirectional_Relation_(ftag,btag)',
      'Exhibition-Characterization'
    ],
    'Os1-(P)-Os2 (same object)': [
      'Overtime_exception',
      'Condition_Input ',
      'In-out_Link_Pair'
    ],
    'Os-P': [
      'In/out_linkPair',
      'Agent',
      'Agent_Condition',
      'Agent_Event',
      'Consumption',
      'Consumption_Condition',
      'Consumption_Event',
      'Split_input',
      'Instrument',
      'Instrument_Condition',
      'Instrument_Event',
      'Overtime_exception',
      'Undertime_exception',
      'OvertimeUndertime-exception',
      'Exhibition-Characterization',
    ]
  }
  */
  /*
  export let userOplSettings = {language: Languages[0], displayOpt: DisplayOpt[1]};
  export let orgOplSettings = {affiliation: Affiliations[0], essence: Essences[0], oplTables: OplTables};
  */
  function updateTemplates() {
    if (Object.keys(oplDefaultSettings.oplTables).indexOf(oplDefaultSettings.language) < 0) {
      return;
    }
    oplTemplates = oplDefaultSettings.oplTables[oplDefaultSettings.language];
    complete_from_default(oplTemplates);
    // the link table is derived from oplTemplates
    linkTable = changeLinkTable();
    // linkTable = linkTables[oplDefaultSettings.language];
  }
  function complete_from_default(oplTemplates, default_table = oplTemplates_en) {
    for (const key of Object.keys(default_table)) {
      if (!oplTemplates.hasOwnProperty(key) || typeof oplTemplates[key] !== typeof default_table[key]) {
        oplTemplates[key] = default_table[key];
        continue;
      }
      if (typeof default_table[key] === "object") {
        complete_from_default(oplTemplates[key], default_table[key]);
      }
    }
  }
  // Defaults
  /* export const oplOrgDefaultSettings = {
    'affiliation': Affiliations[0],
    'essence': Essences[0],
    'language': Languages[0],
    'displayOpt': DisplayOpt[1],
    'oplTables': OplTables,
    'SDNames': false
  }; */
  // export const defaultLinkTable =  linkTables[oplOrgDefaultSettings.language];;
  // export const oplUserDefaultSettings = { language: Languages[0], displayOpt: DisplayOpt[1], 'SDNames': false, 'essence': Essences[0] };
  const defaultSettings = {
    user: {
      language: Languages[0],
      displayOpt: DisplayOpt[2],
      unitsOpt: UnitsOpt[1],
      aliasOpt: AliasOpt[0],
      SDNames: false,
      opdTreeProcessesAutoArrangement: true,
      essence: Essences[0],
      oplNumbering: true,
      autoFormat: true,
      logSharingPermission: false,
      multiDeletion: false,
      Notes: true,
      highlightOpl: false,
      highlightOpd: true,
      markThings: true,
      syncOplcolorsFromOpd: true,
      timeDurationUnitsDigits: 2,
      numericComputationalDigits: 2,
      /** How many recent models to show in the load-model dialog (5–10); up to 15 are stored server-side. */
      displayedRecentModelsCount: 5,
      tutorialMode: true,
      dragSearchAuto: true,
      haloDefaultMode: false,
      thingsSizing: "Automatic",
      navigatorEnabled: true,
      chatEnabled: true,
      pythonExecution: "local",
      modelReviewAutomaticSyncing: "Manual",
      codeEditorTheme: undefined,
      loadScreenViewType: undefined,
      loadScreenSortBy: "date",
      loadScreenSortDirections: undefined,
      connection: {
        ros: {
          server: "localhost",
          port: "3000"
        },
        mqtt: {
          server: "localhost",
          port: "9883"
        },
        python: {
          server: "localhost",
          port: "8765"
        },
        mysql: {
          hostname: "localhost",
          port: "3306",
          username: "root",
          password: "1234",
          schema: "schema",
          ws_hostname: "localhost",
          ws_port: "5566"
        },
        graphdb: {
          graphdb_api: "bolt://localhost:7687",
          username: "neo4j",
          password: "opcloudNeo4j"
        },
        calculationsServer: {
          computingServerURL: "https://localhost:3000",
          computingServerCalculations: true
        },
        allow_users: true
      },
      bringConnectedSettings: {
        proceduralEnablers: true,
        proceduralTransformers: true,
        fundamentals: false,
        tagged: false
      },
      gridSettings: {
        state: false,
        color: "#8c8c8c",
        thickness: 1,
        scaleFactor: 35,
        gridSize: 5,
        transparentThingsFill: "inZoomedOpd"
      }
    },
    organization: {
      affiliation: Affiliations[0],
      essence: Essences[0],
      language: Languages[0],
      displayOpt: DisplayOpt[2],
      unitsOpt: UnitsOpt[1],
      aliasOpt: AliasOpt[0],
      oplNumbering: true,
      autoFormat: true,
      oplTables: OplTables,
      SDNames: true,
      dragSearchAuto: true,
      opdTreeProcessesAutoArrangement: true,
      // chat is enabled by default for all orgs
      chatEnabled: true,
      logCollectingEnabled: false,
      ignoreUserLogSharingPermission: false,
      modelReviewAutomaticSyncing: "Manual",
      modelReviewAutomaticSyncingLocked: false,
      displayNotes: true,
      tutorialMode: true,
      ontologyEnforcementLevel: modules_Settings_OrgOntology_ontologyInterfaces /* .OntologyEnforcementLevel */.u.SUGGEST,
      ontology: [],
      auth2Factors: "disabled",
      multiDeletion: false,
      haloDefaultMode: false,
      bringConnectedSettings: {
        proceduralEnablers: true,
        proceduralTransformers: true,
        fundamentals: false,
        tagged: false
      },
      gridSettings: {
        state: false,
        color: "#8c8c8c",
        thickness: 1,
        scaleFactor: 35,
        gridSize: 5,
        transparentThingsFill: "inZoomedOpd"
      }
    }
  };
  const edxDefaultSettings = {
    user: {
      language: Languages[0],
      displayOpt: DisplayOpt[0],
      unitsOpt: UnitsOpt[1],
      aliasOpt: AliasOpt[0],
      SDNames: false,
      essence: Essences[1],
      oplNumbering: true,
      autoFormat: true,
      dragSearchAuto: true,
      haloDefaultMode: false,
      thingsSizing: "Automatic",
      logSharingPermission: false,
      navigatorEnabled: true,
      displayedRecentModelsCount: 5,
      Notes: true,
      highlightOpl: false,
      highlightOpd: true,
      bringConnectedSettings: {
        proceduralEnablers: true,
        proceduralTransformers: true,
        fundamentals: false,
        tagged: false
      },
      gridSettings: {
        state: false,
        color: "#8c8c8c",
        thickness: 1,
        scaleFactor: 35,
        gridSize: 5,
        transparentThingsFill: "inZoomedOpd"
      }
    },
    organization: {
      affiliation: Affiliations[0],
      essence: Essences[1],
      language: Languages[0],
      oplNumbering: true,
      autoFormat: true,
      displayOpt: DisplayOpt[0],
      unitsOpt: UnitsOpt[1],
      aliasOpt: AliasOpt[0],
      oplTables: OplTables,
      SDNames: false,
      chatEnabled: false,
      dragSearchAuto: true,
      displayNotes: true,
      ontologyEnforcementLevel: modules_Settings_OrgOntology_ontologyInterfaces /* .OntologyEnforcementLevel */.u.NONE,
      ontology: [],
      gridSettings: {
        state: false,
        color: "#8c8c8c",
        thickness: 1,
        scaleFactor: 35,
        gridSize: 5,
        transparentThingsFill: "inZoomedOpd"
      }
    }
  };

  /***/
}),
/***/38452: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    u: () => (/* binding */oplGenerating),
    v: () => (/* binding */oplFunctions)

  });

  var pluralize__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pluralize__WEBPACK_IMPORTED_MODULE_2__);

  function fmtDurOpl(n, digits) {
    return String(Number(Number(n).toFixed(digits)));
  }
  function buildIsoDurationOpl(snap, tag, digits) {
    const suf = (0, models_LogicalPart_components_time_duration_units /* .oplDurationSuffixWord */.vO)(snap.units);
    const p = snap.durationDistributionParams || {};
    const kind = snap.durationDistributionKind || "none";
    const clauses = [];
    const hasMin = snap.min != null && snap.min.toString() !== "null" && snap.min.toString() !== "";
    const hasNom = snap.nominal != null && snap.nominal.toString() !== "null" && snap.nominal.toString() !== "";
    const hasMax = snap.max != null && snap.max.toString() !== "null" && snap.max.toString() !== "";
    if (hasMin && hasNom && hasMax) {
      clauses.push(`${fmtDurOpl(snap.min, digits)}, ${fmtDurOpl(snap.nominal, digits)}, and ${fmtDurOpl(snap.max, digits)}${suf} Minimal Duration, Expected Duration, and Maximal Duration, respectively`);
    } else if (hasMin && hasMax && !hasNom) {
      clauses.push(`${fmtDurOpl(snap.min, digits)} and ${fmtDurOpl(snap.max, digits)}${suf} Minimal Duration and Maximal Duration, respectively`);
    } else if (hasMin && hasNom && !hasMax) {
      clauses.push(`${fmtDurOpl(snap.min, digits)} and ${fmtDurOpl(snap.nominal, digits)}${suf} Minimal Duration and Expected Duration, respectively`);
    } else if (hasNom && hasMax && !hasMin) {
      clauses.push(`${fmtDurOpl(snap.nominal, digits)} and ${fmtDurOpl(snap.max, digits)}${suf} Expected Duration and Maximal Duration, respectively`);
    } else if (hasNom && !hasMin && !hasMax) {
      clauses.push(`${fmtDurOpl(snap.nominal, digits)}${suf} Expected Duration`);
    } else if (hasMin && !hasNom && !hasMax) {
      clauses.push(`${fmtDurOpl(snap.min, digits)}${suf} Minimal Duration`);
    } else if (hasMax && !hasMin && !hasNom) {
      clauses.push(`${fmtDurOpl(snap.max, digits)}${suf} Maximal Duration`);
    }
    if (kind === "normal" && p.mean != null && p.sd != null) {
      clauses.push(`normal Duration Distribution with parameters mean=${fmtDurOpl(p.mean, digits)} and sd=${fmtDurOpl(p.sd, digits)}${suf}`);
    } else if (kind === "uniform" && p.a != null && p.b != null) {
      clauses.push(`uniform Duration Distribution with parameters a=${fmtDurOpl(p.a, digits)} and b=${fmtDurOpl(p.b, digits)}${suf}`);
    } else if (kind === "exponential" && p.lambda != null) {
      clauses.push(`exponential Duration Distribution with parameter lambda=${fmtDurOpl(p.lambda, digits)}${suf}`);
    }
    if (clauses.length === 0) {
      return {
        template: "",
        units: undefined,
        min: undefined,
        max: undefined,
        expected: undefined
      };
    }
    const body = clauses.join(", and ");
    const template = `${tag} exhibits ${body}.`;
    return {
      template,
      units: (0, models_LogicalPart_components_time_duration_units /* .normalizeDurationUnit */.KV)(snap.units),
      min: hasMin ? snap.min : "",
      max: hasMax ? snap.max : "",
      expected: hasNom ? snap.nominal : ""
    };
  }
  /** Pre–ISO-19450 template-based duration OPL (all non-English locales). */
  function legacyGetProcessStateTimeAttrs(process, target) {
    const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
    const logical = init.getOpmModel().getLogicalElementByVisualId(process.id);
    let onlyName;
    if (logical) {
      onlyName = logical.getBareName();
    }
    if (!init.getOpmModel().getLogicalElementByVisualId(process.id)) {
      return {
        units: undefined,
        min: undefined,
        max: undefined,
        expected: undefined,
        template: ""
      };
    }
    const duration = init.getOpmModel().getLogicalElementByVisualId(process.id).getDurationManager().getTimeDuration();
    let numOfParmeters = duration.min != null && duration.min.toString() != "null" && duration.min.toString() != "" ? 1 : 0;
    numOfParmeters = duration.nominal != null && duration.nominal.toString() != "null" && duration.nominal.toString() != "" ? numOfParmeters + 1 : numOfParmeters;
    numOfParmeters = duration.max != null && duration.max.toString() != "null" && duration.max.toString() != "" ? numOfParmeters + 1 : numOfParmeters;
    const text = process.attributes.attrs.text.textWrap.text;
    const subStr = text.substr(onlyName.length);
    let units = subStr.match(/\[\w+\]/);
    if (!numOfParmeters && (!duration.durationDistributionKind || duration.durationDistributionKind === "none")) {
      return null;
    }
    if (!numOfParmeters && duration.durationDistributionKind && duration.durationDistributionKind !== "none") {
      return buildIsoDurationOpl(duration, target === "OpmProcess" ? "<P>" : "<s>", init.oplService?.settings?.timeDurationUnitsDigits ?? 2);
    }
    if (!units) {
      if (target === "OpmProcess") {
        units = opl_database /* .oplTemplates */.XD.process.default_time_units;
      }
      if (target === "OpmState") {
        units = opl_database /* .oplTemplates */.XD.state.default_time_units;
      }
    } else {
      units = units[0].slice(1, -1);
    }
    const vals = numOfParmeters;
    let template = ``;
    let min = "";
    let max = "";
    let exp = "";
    if (vals === 3) {
      if (target === "OpmProcess") {
        template = opl_database /* .oplTemplates */.XD.process.expected_range_duration;
      }
      if (target === "OpmState") {
        template = opl_database /* .oplTemplates */.XD.state.expected_range_duration;
      }
      min = duration.min;
      exp = duration.nominal;
      max = duration.max;
    }
    if (vals === 2) {
      if (duration.min != null && duration.max != null) {
        if (target === "OpmProcess") {
          template = opl_database /* .oplTemplates */.XD.process.min_max_range_duration;
        }
        if (target === "OpmState") {
          template = opl_database /* .oplTemplates */.XD.state.min_max_range_duration;
        }
        min = duration.min;
        max = duration.max;
      } else if (duration.min != null && duration.nominal != null) {
        if (target === "OpmProcess") {
          template = opl_database /* .oplTemplates */.XD.process.min_exp_range_duration;
        }
        if (target === "OpmState") {
          template = opl_database /* .oplTemplates */.XD.state.min_exp_range_duration;
        }
        min = duration.min;
        exp = duration.nominal;
      } else if (duration.nominal != null && duration.max != null) {
        if (target === "OpmProcess") {
          template = opl_database /* .oplTemplates */.XD.process.exp_max_range_duration;
        }
        if (target === "OpmState") {
          template = opl_database /* .oplTemplates */.XD.state.exp_max_range_duration;
        }
        exp = duration.nominal;
        max = duration.max;
      }
    }
    if (vals === 1) {
      if (duration.nominal != null) {
        if (target === "OpmProcess") {
          template = opl_database /* .oplTemplates */.XD.process.expected_duration;
        }
        if (target === "OpmState") {
          template = opl_database /* .oplTemplates */.XD.state.expected_duration;
        }
        exp = duration.nominal;
      } else if (duration.min != null) {
        if (target === "OpmProcess") {
          template = opl_database /* .oplTemplates */.XD.process.min_duration;
        }
        if (target === "OpmState") {
          template = opl_database /* .oplTemplates */.XD.state.min_duration;
        }
        min = duration.min;
      } else if (duration.max != null) {
        if (target === "OpmProcess") {
          template = opl_database /* .oplTemplates */.XD.process.max_duration;
        }
        if (target === "OpmState") {
          template = opl_database /* .oplTemplates */.XD.state.max_duration;
        }
        max = duration.max;
      }
    }
    return {
      units: units,
      min: min,
      max: max,
      expected: exp,
      template: template
    };
  }
  const oplFunctions = {
    addPlural(text) {
      if (opl_database /* .oplDefaultSettings */.iT.language !== "en") {
        return text;
      }
      // return Pluralize( text, 42 );
      return pluralize__WEBPACK_IMPORTED_MODULE_2___default()(text, 42);
    },
    AddPath(path, opl) {
      let temp = opl_database /* .oplTemplates */.XD.tags.path.replace(`<tag>`, path);
      temp = temp.replace("<opl>", opl);
      return temp;
    },
    DivideLinks(links, direction, inOutLinkPairs, proceduralLinks) {
      // direction=TRUE encode as in-links
      // direction=FALSE encode as out-links
      const IN = ["Consumption", "Consumption_Negation", "Consumption_Condition", "Consumption_Condition_Negation", "Consumption_Event"];
      const OUT = "Result";
      for (const link of links) {
        if (!link.getSourceElement() || !link.getTargetElement()) {
          continue;
        }
        let type = link.attributes.name;
        if (!proceduralLinks[type]) {
          continue;
        }
        if (type === "Consumption") {
          if (link.condition) {
            type = type + "_Condition";
          }
          if (link.event) {
            type = type + "_Event";
          }
        }
        if (direction && IN.indexOf(type) > -1 || !direction && type === OUT) {
          let cell = link.getSourceElement();
          if (!direction) {
            cell = link.getTargetElement();
          }
          const mainObject = oplGenerating.getObjectOfState(cell);
          oplGenerating.addToPairs(inOutLinkPairs, mainObject, link, type);
        } else if (direction && proceduralLinks[type] && type.indexOf("directional") < 0 && type.indexOf("Invocation") < 0 && type !== "defaultLink" || !direction && proceduralLinks[type] && type.indexOf("exception") < 0 && type.indexOf("directional") < 0 && type !== "defaultLink") {
          if (type === "Invocation" && link.isSelfInvocation() && link.sourceElement.id === link.targetElement.id) {
            proceduralLinks[type + "_(self)"].push(link);
            continue;
          }
          proceduralLinks[type].push(link);
        }
      }
    },
    SplitByTags(links, noPathKey) {
      const linksTags = {};
      for (const link of links) {
        if (link.attributes.Path) {
          if (linksTags[link.attributes.Path]) {
            linksTags[link.attributes.Path].push(link);
          } else {
            linksTags[link.attributes.Path] = [link];
          }
        } else if (linksTags[noPathKey]) {
          linksTags[noPathKey].push(link);
        } else {
          linksTags[noPathKey] = [link];
        }
      }
      return linksTags;
    },
    groupStates(cells, links, parallelSeq = false, preventReorder = false) {
      const res = [];
      const index_dict = {};
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].constructor.name !== "OpmState") {
          res.push([[cells[i], links[i]]]);
          continue;
        }
        if (index_dict[oplFunctions.getStatefulObject(cells[i]).id] !== undefined) {
          res[index_dict[oplFunctions.getStatefulObject(cells[i]).id]].push([cells[i], links[i]]);
        } else {
          index_dict[oplFunctions.getStatefulObject(cells[i]).id] = res.length;
          res.push([[cells[i], links[i]]]);
        }
      }
      let brothers = res.filter(function (elem) {
        return elem.length > 1;
      });
      let regular = res.filter(function (elem) {
        return elem.length === 1;
      });
      if (parallelSeq) {
        regular = regular.sort((n1, n2) => {
          const th1X = n1[0][0].get("position").x;
          const th2X = n2[0][0].get("position").x;
          if (th1X > th2X) {
            return 1;
          } else {
            return -1;
          }
        });
      } else if (!preventReorder) {
        regular = regular.sort((n1, n2) => {
          const name1 = n1[0][0].attributes.attrs.text.textWrap.text;
          const name2 = n2[0][0].attributes.attrs.text.textWrap.text;
          if (name1 > name2) {
            return 1;
          }
          if (name1 < name2) {
            return -1;
          }
          return 0;
        });
      }
      brothers = brothers.sort((n1, n2) => {
        const name1 = oplFunctions.getStatefulObject(n1[0][0]).attributes.attrs.text.textWrap.text;
        const name2 = oplFunctions.getStatefulObject(n2[0][0]).attributes.attrs.text.textWrap.text;
        if (name1 > name2) {
          return 1;
        }
        if (name1 < name2) {
          return -1;
        }
        return 0;
      });
      // dividing multiplicity and cells into 2 different arrays
      const new_cells = [];
      const new_multi = [];
      for (let cell of regular) {
        cell = cell[0];
        new_cells.push(cell[0]);
        new_multi.push(cell[1]);
      }
      for (const cell_array of brothers) {
        const temp_brothers = [];
        const temp_multi = [];
        for (const cell of cell_array) {
          temp_brothers.push(cell[0]);
          temp_multi.push(cell[1]);
        }
        new_cells.push(temp_brothers);
        new_multi.push(temp_multi);
      }
      return [new_cells, new_multi];
    },
    sortByX(cells) {
      const res = cells.sort((cell1, cell2) => {
        if (cell1.attributes.position.x > cell2.attributes.position.x) {
          return 1;
        }
        if (cell1.attributes.position.x < cell2.attributes.position.x) {
          return -1;
        }
        return 0;
      });
      return res;
    },
    sortByY(cells) {
      const res = cells.sort((cell1, cell2) => {
        if (cell1.attributes.position.y > cell2.attributes.position.y) {
          return 1;
        }
        if (cell1.attributes.position.y < cell2.attributes.position.y) {
          return -1;
        }
        return 0;
      });
      return res;
    },
    sortByText(cells) {
      return cells.sort((s1, s2) => {
        if (s1.attributes.attrs.text.textWrap.text > s2.attributes.attrs.text.textWrap.text) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    sameFather(cells) {
      if (!(cells.length > 0)) {
        return false;
      }
      let father_id;
      for (const cell of cells) {
        if (cell.constructor.name === "OpmState") {
          if (!father_id) {
            father_id = oplFunctions.getStatefulObject(cell).id;
          } else if (oplFunctions.getStatefulObject(cell).id !== father_id) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    },
    stringReverse(str) {
      return str.split("").reverse().join("");
    },
    addCapital(sentence) {
      if (!sentence || sentence === "" || sentence[0] === "<") {
        return sentence;
      }
      if (sentence[0] !== "<") {
        sentence = sentence[0].toUpperCase() + sentence.substr(1, sentence.length);
      }
      return sentence;
    },
    hasSameLinkProps(link1, link2) {
      return link1.constructor.name === link2.constructor.name && link1.condition === link2.condition && link1.event === link2.event && link1.negation === link2.negation;
    },
    hasArc(link, allCells) {
      const allLinks = allCells.filter(dr => dr.isLink());
      const hasSourceArc = ![null, undefined].includes(link.getVisual().logicalElement.sourceLogicalConnection);
      if (hasSourceArc && link.getVisual().sourceVisualElementPort && link.getSourceElement()) {
        const links = allLinks.filter(dr => this.hasSameLinkProps(dr, link) && dr.getVisual().logicalElement.sourceLogicalConnection === link.getVisual().logicalElement.sourceLogicalConnection && link.getVisual().sourceVisualElementPort === dr.getVisual().sourceVisualElementPort);
        if (links.length >= 2 && link.get("name") !== "Overtime_exception") {
          return true;
        }
      }
      const hasTargetArc = ![null, undefined].includes(link.getVisual().logicalElement.targetLogicalConnection);
      if (hasTargetArc && link.getVisual().targetVisualElementPort && link.getTargetElement()) {
        const links = allLinks.filter(dr => this.hasSameLinkProps(dr, link) && dr.getVisual().logicalElement.targetLogicalConnection === link.getVisual().logicalElement.targetLogicalConnection && link.getVisual().targetVisualElementPort === dr.getVisual().targetVisualElementPort);
        if (links.length >= 2 && link.get("name") !== "Overtime_exception") {
          return true;
        }
      }
      return false;
    },
    getIDs(arcGroup) {
      const ids = new Set();
      for (const position of Object.keys(arcGroup)) {
        for (const linkType of Object.keys(arcGroup[position])) {
          for (const link of arcGroup[position][linkType]) {
            ids.add(link.id);
          }
        }
      }
      return ids;
    },
    getForbiddenIds() {
      return oplGenerating.forbidden;
    },
    removeLinks(links, forbidIDs, arcsOpl) {
      // filter forbidden links. and links that are already involved in in/out with or/xor (partners...)
      return links.filter(value => !forbidIDs.has(value.id) && !this.getForbiddenIds().includes(value.id));
    },
    splitByArcs(cells) {
      const withArcs = [];
      const withoutArcs = [];
      for (const cell of cells) {
        if (cell.isProceduralLink && cell.isProceduralLink() && cell.getSourceElement() && cell.getTargetElement()) {
          if (this.hasArc(cell, cells)) {
            withArcs.push(cell);
            continue;
          }
        }
        withoutArcs.push(cell);
      }
      const arcGroups = this.divideToGroupsByArcs(withArcs);
      return [withoutArcs, arcGroups];
    },
    divideToGroupsByArcs(cells) {
      const arcGroups = {};
      for (const cell of cells) {
        // console.log(cell.getSourceArcOnLink() , cell.getTargetArcOnLink());
        if (![null, undefined].includes(cell.getVisual().logicalElement.sourceLogicalConnection)) {
          // const arc = cell.getSourceArcOnLink();
          // console.log(cell.getSourceArcOnLink());
          let arcType;
          const currentArcTypeValue = cell.getVisual().logicalElement.sourceLogicalConnection;
          if (currentArcTypeValue === 2) {
            arcType = "NOT";
          } else if (currentArcTypeValue === 1) {
            arcType = "XOR";
          } else {
            arcType = "OR";
          }
          const position = arcType + "_" + String(cell.getVisual().sourceVisualElementPort);
          arcGroups[position] = cells.filter(dr => this.hasSameLinkProps(dr, cell) && dr.getVisual().logicalElement.sourceLogicalConnection === cell.getVisual().logicalElement.sourceLogicalConnection && cell.getVisual().sourceVisualElementPort === dr.getVisual().sourceVisualElementPort);
        }
        if (![null, undefined].includes(cell.getVisual().logicalElement.targetLogicalConnection)) {
          // const arc = cell.getTargetArcOnLink();
          // console.log(arc.arcVec);
          let arcType;
          const currentArcTypeValue = cell.getVisual().logicalElement.targetLogicalConnection;
          if (currentArcTypeValue === 2) {
            arcType = "NOT";
          } else if (currentArcTypeValue === 1) {
            arcType = "XOR";
          } else {
            arcType = "OR";
          }
          const position = arcType + "_" + String(cell.getVisual().targetVisualElementPort);
          arcGroups[position] = cells.filter(dr => this.hasSameLinkProps(dr, cell) && dr.getVisual().logicalElement.targetLogicalConnection === cell.getVisual().logicalElement.targetLogicalConnection && cell.getVisual().targetVisualElementPort === dr.getVisual().targetVisualElementPort);
        }
      }
      this.divideGroupsOfLinks(arcGroups);
      return arcGroups;
    },
    divideGroupsOfLinks(arcGroups) {
      for (const position of Object.keys(arcGroups)) {
        arcGroups[position] = this.divideToConditionEvent(arcGroups[position]);
      }
    },
    divideToConditionEvent(linksArray) {
      const objToReturn = {
        regular: [],
        event: [],
        condition: []
      };
      for (const link of linksArray) {
        if (link.event) {
          objToReturn.event.push(link);
        } else if (link.condition) {
          objToReturn.condition.push(link);
        } else {
          objToReturn.regular.push(link);
        }
      }
      return objToReturn;
    },
    getStatefulObject(state) {
      return state.getParent();
    },
    sourceTargetRelation(source, target) {
      if (!Array.isArray(target)) {
        const sourceID = source.attributes.id;
        const targetID = target.attributes.id;
        const sourceType = source.attributes.type;
        const targetType = target.attributes.type;
        const isParent = source.get("parent") === target.get("id");
        const isSame = source.get("id") === target.get("id");
        const relation = {
          relation: "",
          pairs: {}
        };
        switch (sourceType) {
          case "opm.Object":
            if (targetType === "opm.Object") {
              relation.relation = "O1-O2";
              relation.pairs = {
                O1: source,
                O2: target
              };
            } else if (targetType === "opm.Process") {
              relation.relation = "O-P";
              relation.pairs = {
                O: source,
                P: target
              };
            } else if (targetType === "opm.State") {
              const Object2 = this.getStatefulObject(target);
              relation.pairs = {
                O1: source,
                s: target,
                O2: Object2
              };
              relation.relation = "O1-O2s";
            }
            break;
          case "opm.Process":
            if (targetType === "opm.Object") {
              relation.pairs = {
                P: source,
                O: target
              };
              relation.relation = "P-O";
            } else if (targetType === "opm.Process") {
              if (targetID !== sourceID) {
                relation.pairs = {
                  P1: source,
                  P2: target
                };
                if (isSame) {
                  relation.relation = "P1-P1 (same process)";
                } else if (isParent) {
                  relation.relation = "P1-P2 (parent process)";
                } else {
                  relation.relation = "P1-P2";
                }
              } else {
                relation.pairs = {
                  P1: source
                };
                relation.relation = "P1-P1 (same process)";
              }
            } else if (targetType === "opm.State") {
              const Object = this.getStatefulObject(target);
              relation.pairs = {
                P: source,
                s: target,
                O: Object
              };
              relation.relation = "P-Os";
            }
            break;
          case "opm.State":
            if (targetType === "opm.Object") {
              const Object1 = this.getStatefulObject(source);
              relation.pairs = {
                s: source,
                O2: target,
                O1: Object1
              };
              relation.relation = "O1s-O2";
            } else if (targetType === "opm.Process") {
              const Object = this.getStatefulObject(source);
              relation.pairs = {
                s: source,
                P: target,
                O: Object
              };
              relation.relation = "Os-P";
              // TODO:In/out link pair identification
            } else if (targetType === "opm.State") {
              const Object1 = this.getStatefulObject(source);
              const Object2 = this.getStatefulObject(target);
              relation.pairs = {
                s1: source,
                s2: target,
                O1: Object1,
                O2: Object2
              };
              relation.relation = "O1s1-O2s2";
            }
            break;
        }
        return relation;
      } else {
        const sourceType = source.attributes.type;
        const relation = {
          relation: "",
          pairs: {}
        };
        const len = target.length;
        if (sourceType === "opm.Object") {
          relation.pairs = {
            O1: source,
            Tn: target[len - 1],
            "T1...n-1": target.slice(0, len - 1)
          };
          relation.relation = "O1-T2..n (n>=2 many destinations)";
        }
        if (sourceType === "opm.Process") {
          relation.pairs = {
            P1: source,
            Tn: target[len - 1],
            "T1...n-1": target.slice(0, len - 1)
          };
          relation.relation = "P1-T2..n (n>=2 many destinations)";
        }
        if (sourceType === "opm.State") {
          const O1 = this.getStatefulObject(source);
          relation.pairs = {
            s1: source,
            O1: O1,
            Tn: target[len - 1],
            "T1...n-1": target.slice(0, len - 1)
          };
          relation.relation = "O1s1-T2..n (n>=2 many destinations)";
        }
        return relation;
      }
    },
    replaceInTemplate(code, cell, template, linkType) {
      let opl = template;
      code = `<${code}>`;
      if (code.indexOf("tag") > -1) {
        opl = opl.replace(code, cell);
        return opl;
      }
      while (cell && opl.indexOf(code) > -1) {
        // opl = opl.replace(code, `<opcloud-opl-element [cell]="${cell}"></opcloud-opl-element>`);
        if (Array.isArray(cell) && cell[0].attributes.type === "opm.State") {
          let selectHtml = ``;
          selectHtml = `<select name="selectStates">`;
          for (const c of cell) {
            const rawText = c.attributes.attrs.text.textWrap.text;
            const escapedValue = oplFunctions.escapeHtmlAttribute(rawText);
            const escapedContent = this.replaceBracelets(rawText);
            selectHtml = `${selectHtml}<option value="${escapedValue}"> ${escapedContent}</option>`;
          }
          selectHtml = `${selectHtml}</select>`;
          opl = opl.replace(code, selectHtml);
        } else if (code !== `<T1...n-1>`) {
          // YANG's code to handle, ['grouping']['Attribute-Exhibitors'] does'nt exist anymore.
          /*try{
            if (code.indexOf('s')===-1  && cell.getExhibitors().length > 0 && linkType !== 'Exhibition-Characterization') {
              opl = opl.replace(code, this.generateAttributeExhibitors(code, cell));
            }
          }catch(e){console.log(e)}*/
          opl = opl.replace(code, this.generateCellTag(cell));
        } else {
          opl = opl.replace(code, this.generateSubGroup(cell));
        }
      }
      const pairs = [];
      if (opl.includes("<units>") && ["<P1>", "<s>"].includes(code) && cell.getVisual().logicalElement.duration.units) {
        pairs.push([`<units>`, cell.getVisual().logicalElement.duration.units]);
      }
      if (opl.includes("<mintime>") && ["<P1>", "<s>"].includes(code) && cell.getVisual().logicalElement.duration.min) {
        pairs.push([`<mintime>`, cell.getVisual().logicalElement.duration.min]);
      }
      if (opl.includes("<maxtime>") && ["<P1>", "<s>"].includes(code) && cell.getVisual().logicalElement.duration.max) {
        pairs.push([`<maxtime>`, cell.getVisual().logicalElement.duration.max]);
      }
      for (const pair of pairs) {
        while (opl.indexOf(pair[0]) > -1) {
          opl = opl.replace(pair[0], pair[1]);
        }
      }
      // opl = this.replaceContents(opl, pairs);
      return opl;
    },
    generateRelationOPL(pairs, template, linkType) {
      if (template) {
        let opl = template;
        for (const code of Object.keys(pairs)) {
          opl = this.replaceInTemplate(code, pairs[code], opl, linkType);
        }
        opl = opl.replace(`.`, `<b>.</b>`);
        return opl;
      } else {
        return ``;
      }
    },
    generateLinksWithOpl(link) {
      const source = link.getSourceElement();
      const target = link.getTargetElement();
      if (source.constructor.name.includes("Semi")) {
        // const type = source.getVisual().type.includes('Process') ? 'opm.Process' : 'opm.Object';
        source.attr("text/textWrap/text", source.getVisual().logicalElement.text);
        // source.set('type', type);
      }
      const multiSelection = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().selection.collection.models.filter(el => el instanceof models_DrawnPart_OpmEntity /* .OpmEntity */.Q);
      const multiTargets = multiSelection.length > 1 ? multiSelection : [link.getTargetElement()];
      if (!multiTargets.includes(target)) {
        multiTargets.push(target);
      }
      // const ret = this.generateLinksWithOplByElements(source, target);
      let ret;
      for (const trgt of multiTargets) {
        if (multiTargets.indexOf(trgt) === 0) {
          ret = this.generateLinksWithOplByElements(source, trgt);
        } else {
          const temp = this.generateLinksWithOplByElements(source, trgt);
          for (const lnk of temp) {
            const idx = this.getIndexOfLink(ret, lnk.name);
            if (idx === -1) {
              ret.push(lnk);
              continue;
            }
            if (ret[idx] && lnk.opl) {
              ret[idx].opl = ret[idx].opl + "<br>" + lnk.opl;
            }
          }
        }
      }
      return ret;
    },
    getIndexOfLink(tableOfLinks, linkName) {
      for (let i = 0; i < tableOfLinks.length; i++) {
        if (tableOfLinks[i].name === linkName) {
          return i;
        }
      }
      return -1;
    },
    generateLinksWithOplByElements(source, target) {
      const stRelation = this.sourceTargetRelation(source, target);
      const relation = stRelation.relation;
      const pairs = stRelation.pairs;
      const list = Object.assign({}, opl_database /* .linkTable */.Xe[relation]);
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      // Yang: to deal with in/out link pairs
      if (relation === "Os-P") {
        const srcObject = this.getStatefulObject(source);
        const states = srcObject.getEmbeddedCells();
        if (states.length < 2) {
          delete list["In-out_Link_Pair"];
        } else {
          pairs.s1 = source;
          const s2 = init.opmModel.links.getDestinationInOutState(source.getVisual(), models_consistency_links_model /* .InOutPairType */.kY.Standart);
          if (s2) {
            pairs.s2 = source.graph.getCell(s2.id);
          }
          // const lastState = states[states.length - 1];
          // if (source === lastState) {
          //   pairs['s2'] = states[states.length - 2];
          // } else {
          //   pairs['s2'] = states[states.indexOf(source) + 1];
          // }
        }
      } else if (relation === "P-Os") {
        const trgObject = this.getStatefulObject(target);
        const states = trgObject.getEmbeddedCells().filter(s => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnState(s));
        if (states.length < 2) {
          delete list["In-out_Link_Pair"];
        } else {
          pairs.s2 = target;
          pairs.s1 = target.graph.getCell(init.opmModel.links.getDestinationInOutState(target.getVisual(), models_consistency_links_model /* .InOutPairType */.kY.Standart).id);
          // const lastState = states[states.length - 1];
          // if (target === lastState) {
          //   pairs['s1'] = states[states.length - 2];
          // } else {
          //   pairs['s1'] = states[states.indexOf(target) + 1];
          // }
        }
      } else if (relation === "O1-O2s") {
        list["Exhibition-Characterization"] = list["Exhibition-Characterization"].replace("at state", "with value");
      }
      const result = [];
      // a note cell is not registered in OPL, thus the result list must be empty
      if (target.attributes.type === "notes.Note" || source.attributes.type === "notes.Note") {
        return result;
      }
      for (const linkType of Object.keys(list)) {
        const OPL = this.generateRelationOPL(pairs, list[linkType], linkType);
        result.push({
          name: linkType,
          opl: OPL
        });
      }
      return result;
    },
    generateCellTag(cell) {
      // Escape description directly for HTML attribute - don't pre-escape with replaceBracelets
      const description = "description=\"" + this.escapeHtmlAttribute(cell.getVisual().logicalElement.description || "") + "\"";
      if (cell.attributes.targetMultiplicity) {
        const tag = cell.attributes.targetMultiplicity;
        cell.attributes.targetMultiplicity = null;
        const text = oplGenerating.replaceBracelets(cell.getVisual().logicalElement.getBareName());
        return `<b>${oplGenerating.escapeHtmlContent(tag)}</b> <b class="${cell.attributes.type.slice(4).toLowerCase()} " ${description} lid="${cell.getVisual().logicalElement.lid}">${text}</b>`;
      }
      const txt = cell.getVisual() ? cell.getVisual().logicalElement.getBareName() : cell.attributes.attrs.text.textWrap.text;
      return `<b class="${cell.attributes.type.slice(4).toLowerCase()}" ${description} lid="${cell.getVisual().logicalElement.lid}">${oplGenerating.replaceBracelets(txt)}</b>`;
    },
    generateSubGroup(things) {
      let grouping = ``;
      let i = 0;
      if (things) {
        const len = things.length;
        if (len === 1) {
          grouping = grouping + this.generateCellTag(things[i]);
        } else {
          grouping = grouping + this.generateCellTag(things[i]);
          i = 1;
          for (i; i < len; i++) {
            grouping = grouping + this.generateCellTag(things[i]);
          }
        }
      }
      return grouping;
    },
    extractAndDelete(text, type) {
      let alias = "";
      let new_text = "";
      let beg = false;
      let afterbraclet = false;
      for (let i = 0; i < text.length; i++) {
        const letter = text.charAt(i);
        if (letter === type[0]) {
          beg = true;
          if (i > 0 && [" ", "\n"].indexOf(new_text[i - 1]) > -1) {
            new_text = new_text.substr(0, new_text.length - 1);
          }
          continue;
        }
        if (letter === type[1]) {
          beg = false;
          afterbraclet = true;
          continue;
        }
        if (beg) {
          alias = alias.concat(letter); // not necessary alias.
        } else {
          if (afterbraclet && [" ", "\n"].indexOf(new_text[i]) > -1) {
            continue;
          }
          new_text = new_text.concat(letter);
        }
      }
      return [alias, new_text];
    },
    addRange(val) {
      const str = String(val);
      if (str.length < 1) {
        return val;
      }
      for (const r of Object.keys(opl_database /* .oplTemplates */.XD.ranges)) {
        if (str.startsWith(r)) {
          let template = opl_database /* .oplTemplates */.XD.tags.range;
          template = template.replace(`<r>`, opl_database /* .oplTemplates */.XD.ranges[r]);
          template = template.replace(`<opl>`, str.substr(r.length));
          return template;
        }
      }
      return val;
    },
    generateCellProperties(cell, link = undefined, withExhibitors = true, isObjectOfState = false, withProbability = false) {
      const obj = {
        cell: cell,
        link: link,
        withExhibitors: withExhibitors,
        multiplicity: undefined,
        probability: undefined,
        rate: undefined,
        rateUnits: undefined
      };
      if (!link) {
        return obj;
      }
      if (withProbability && link.attributes.Probability) {
        obj.probability = link.attributes.Probability;
      }
      if (isObjectOfState && cell.attributes.type === "opm.Object") {
        const states = cell.getStatesOnly();
        for (const state of states) {
          if (link.sourceElement.id === state.id) {
            obj.multiplicity = link.attributes.sourceMultiplicity;
          }
          if (link.targetElement.id === state.id) {
            obj.multiplicity = link.attributes.targetMultiplicity;
          }
        }
        return obj;
      }
      if (cell.attributes.type === "opm.State") {
        // state needs only probability and not multiplicity.
        return obj;
      }
      if (link.targetElement.id === cell.id) {
        obj.multiplicity = link.attributes.targetMultiplicity;
      }
      if (link.sourceElement.id === cell.id) {
        obj.multiplicity = link.attributes.sourceMultiplicity;
      }
      if (["Result", "Consumption", "Effect"].indexOf(link.attributes.name) > -1 && cell.attributes.type === "opm.Object") {
        // console.log("Add rate",link);
        obj.rate = link.attributes.rate;
        obj.rateUnits = link.attributes.rateUnits;
      }
      return obj;
    },
    /*generateCellProperties(cell,link=undefined,withExhibitors=true,isObjectOfState=false){
      let obj = {
        cell: cell,
        link: link,
        withExhibitors: withExhibitors,
        multiplicity: undefined,
        probability: undefined,
        rate: undefined,
      };
      if(!link){
        return obj;
      }
      const sourceType = link.sourceElement.attributes.type; // if the source is a process than the probability addition should be next to the target
      // otherwise it should be next to the source
      if(isObjectOfState && cell.attributes.type === 'opm.Object') {
        let states = cell.getStatesOnly();
        for (let state of states) {
          if (link.sourceElement.id === state.id) {
            obj.multiplicity = link.attributes.sourceMultiplicity;
          }
          if (link.targetElement.id === state.id) {
            obj.multiplicity = link.attributes.targetMultiplicity;
          }
        }
        return obj;
      }
      if(cell.attributes.type === 'opm.State'){
        obj.probability = link.attributes.Probability;
        console.log(link,cell,obj,link.attributes.Probability);
        return obj;
      }
      if(link.targetElement.id === cell.id){
        obj.rate = link.attributes.rate;
        obj.multiplicity = link.attributes.targetMultiplicity;
        if(sourceType === 'opm.Process'){
          obj.probability = link.attributes.Probability;
        }
      }
      if(link.sourceElement.id === cell.id){
        obj.multiplicity = link.attributes.sourceMultiplicity;
        if(sourceType !== 'opm.Process'){
          obj.probability = link.attributes.Probability;
        }
      }
      return obj;
    }*/
    getProcessStateTimeAttrs(process, target) {
      if (opl_database /* .oplDefaultSettings */.iT.language !== "en") {
        return legacyGetProcessStateTimeAttrs(process, target);
      }
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const logical = init.getOpmModel().getLogicalElementByVisualId(process.id);
      if (!logical || typeof logical.getDurationManager !== "function") {
        return {
          units: undefined,
          min: undefined,
          max: undefined,
          expected: undefined,
          template: ""
        };
      }
      const duration = logical.getDurationManager().getTimeDuration();
      const digits = init.oplService?.settings?.timeDurationUnitsDigits ?? 2;
      const tag = target === "OpmProcess" ? "<P>" : "<s>";
      const built = buildIsoDurationOpl(duration, tag, digits);
      if (!built.template) {
        return null;
      }
      return built;
    },
    cleanThingName(text) {
      let temp = this.extractAndDelete(text, ["[", "]"]);
      text = temp[1];
      temp = this.extractAndDelete(text, ["(", ")"]);
      text = temp[1];
      return text;
    },
    escapeHtmlAttribute(str) {
      if (!str) {
        return str;
      }
      return str.replace(/&/g, "&amp;") // Escape ampersand first to avoid double escaping
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;") // Escape >
      .replace(/"/g, "&quot;") // Escape double quotes
      .replace(/'/g, "&#39;") // Escape single quotes
      .replace(/`/g, "&#96;"); // Escape backticks (optional for security)
    },
    escapeHtmlContent(str) {
      // Escape HTML special characters for content (between tags)
      // This is different from attribute escaping - we don't escape quotes here
      if (!str) {
        return str;
      }
      return str.replace(/&/g, "&amp;") // Escape ampersand first to avoid double escaping
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;"); // Escape >
    }
  };
  const oplGenerating = {
    period() {
      let period = ".";
      if (this.textOnly) {
        period = ".";
      } else {
        period = "<b>.</b>";
      }
      return period;
    },
    comma() {
      let comma = ",";
      if (this.textOnly) {
        comma = ",";
      } else {
        comma = "<b>,</b>";
      }
      return comma;
    },
    replaceContents(template, pairs) {
      for (const pair of pairs) {
        while (template.indexOf(pair[0]) > -1) {
          template = template.replace(pair[0], pair[1]);
        }
      }
      while (!this.textOnly && template.indexOf(", ") > -1) {
        template = template.replace(", ", `${this.comma()} `);
      }
      template = template.replace(".", this.period());
      return template;
    },
    getObjectOfState(cell) {
      let mainObject = null;
      if (cell.attributes.type === "opm.State") {
        mainObject = cell.getParent();
      } else {
        mainObject = cell;
      }
      return mainObject;
    },
    /*
      myfunc(cell,withExhibitors = true , multiplicity = undefined){
        // if (cell === "self"){
        //   return `<b class="process">itself</b>`;
        // }
        let template = oplTemplates['grouping']['Single-Thing'];
        if(withExhibitors){
          template = this.generateExhibitorsHtml(cell)
        }
        let cellID = cell.attributes.id ? cell.attributes.id : "NoID";
        let objClass = cell.attributes.type.slice(4, ).toLowerCase();
        if(objClass === 'state'){
          let obj = oplFunctions.getStatefulObject(cell);
          let val = cell.attributes.attrs.text.textWrap.text;
          val = oplFunctions.addRange(val);
          let obj_text = obj.attributes.attrs.text.textWrap.text;
          let units = "";
          if(obj.attributes.attrs.value.value !== 'None'){ //if state is computational
            let ans = oplFunctions.extractAndDelete(obj.attributes.attrs.text.textWrap.text, ['[', ']']);
            units = ans[0];
          }
          else{ // state is note computational.
            if(obj_text.length>0 && obj_text.charAt(obj_text.length-1) === ']'){
              let ans = oplFunctions.extractAndDelete(oplFunctions.stringReverse(obj_text) , ['[', ']'].reverse());
              units = oplFunctions.stringReverse(ans[0]);
            }
          }
          if (this.textOnly) {
            return cell.attributes.attrs.text.textWrap.text;
          }
          if(units && units!==''){
            return `<b cellID="${'cellID'}" class="${'state'}">${val}</b> <b class="${'object'}">${units}</b>`;
          }
          return `<b cellID="${'cellID'}" class="${'state'}">${val}</b>`;
        }
        if(this.textOnly){
          return cell.attributes.attrs.text.textWrap.text;
        }
        let text = this.generateCellComputation(cell);
        if(multiplicity && ['+','?'].indexOf(multiplicity)===-1){
          text = oplFunctions.addPlural(text);
        }
        template = template.replace(`<T>`,`<b cellID="${cellID}" class="${objClass}">${text}</b>`);
        return this.addMultiplicity(multiplicity, template);
      },
    */
    addPathForOrXor(template, link) {
      if (link.get("Path") && (link.getSourceArcOnLink() || link.getTargetArcOnLink())) {
        return template + " following path " + link.get("Path");
      }
      return template;
    },
    escapeHtmlAttribute(str) {
      if (!str) {
        return str;
      }
      return str.replace(/&/g, "&amp;") // Escape ampersand first to avoid double escaping
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;") // Escape >
      .replace(/"/g, "&quot;") // Escape double quotes
      .replace(/'/g, "&#39;") // Escape single quotes
      .replace(/`/g, "&#96;"); // Escape backticks (optional for security)
    },
    escapeHtmlContent(str) {
      // Escape HTML special characters for content (between tags)
      // This is different from attribute escaping - we don't escape quotes here
      if (!str) {
        return str;
      }
      return str.replace(/&/g, "&amp;") // Escape ampersand first to avoid double escaping
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;"); // Escape >
    },
    replaceBracelets(str) {
      // This function escapes HTML special characters for content
      // It's kept for backward compatibility but now uses escapeHtmlContent
      if (!str) {
        return str;
      }
      return this.escapeHtmlContent(str);
    },
    generateCellHtml(cell, link, withExhibitors, isObjectOfState, withProbability, propObj) {
      if (cell && cell.constructor.name.includes("Semi")) {
        return this.generateSemifoldedThingCellHtml(cell);
      }
      if (!propObj) {
        propObj = oplFunctions.generateCellProperties(cell, link, withExhibitors, isObjectOfState, withProbability);
      }
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const logical = init.getOpmModel().getLogicalElementByVisualId(cell.id);
      let onlyName;
      if (logical) {
        onlyName = logical.getBareName();
      } else {
        onlyName = cell.attr("text/textWrap/text");
      }
      onlyName = this.replaceBracelets(onlyName);
      let template = opl_database /* .oplTemplates */.XD.grouping["Single-Thing"];
      if (link && link.isProceduralLink && link.isProceduralLink()) {
        const connectedLinks = cell.graph.getConnectedLinks(cell, {
          inbound: true
        });
        if (connectedLinks.find(l => l.constructor.name.includes("ExhibitionLink")) !== undefined) {
          propObj.withExhibitors = true;
        }
        if (propObj.withExhibitors === false && link) {
          template = this.addPathForOrXor(template, link);
        }
      }
      if (propObj.withExhibitors) {
        template = this.generateExhibitorsHtml(cell);
      }
      const objClass = cell.attributes.type.slice(4).toLowerCase();
      const colorLikeElement = init.oplService.settings.syncOplcolorsFromOpd;
      const textStyle = colorLikeElement && cell.getVisual && cell.getVisual() && cell.getVisual().strokeColor;
      if (objClass === "state") {
        const obj = oplFunctions.getStatefulObject(cell);
        let val = cell.attributes.attrs.text.textWrap.text;
        if (cell.getVisual() && (cell.getVisual().isTimeDuration() || cell.getParent().isComputational())) {
          val = onlyName;
        }
        val = oplFunctions.addRange(val);
        const obj_text = obj.attributes.attrs.text.textWrap.text;
        let units = "";
        if (obj.attributes.attrs.value.value !== "None") {
          // if state is computational
          const ans = oplFunctions.extractAndDelete(obj.attributes.attrs.text.textWrap.text, ["[", "]"]);
          units = ans[0];
        } else
          // state is not computational.
          if (obj_text.length > 0 && obj_text.charAt(obj_text.length - 1) === "]") {
            const ans = oplFunctions.extractAndDelete(oplFunctions.stringReverse(obj_text), ["[", "]"].reverse());
            units = oplFunctions.stringReverse(ans[0]);
          }
        if (this.textOnly) {
          return this.replaceBracelets(cell.attributes.attrs.text.textWrap.text);
        }
        let temp = "";
        // Escape description directly for HTML attribute - don't pre-escape with replaceBracelets
        const description = "description=\"" + this.escapeHtmlAttribute(logical.description || "") + "\"";
        if (textStyle) {
          let color = cell.getVisual().strokeColor;
          if (color === "transparent") {
            color = "#808000";
          }
          if (units && units !== "") {
            const escapedVal = this.escapeHtmlContent(this.generateValueText(val));
            const escapedUnits = this.escapeHtmlContent(units);
            temp = `<font color=${color}><b class="${cell.id}" ${description} lid="${cell.getVisual().logicalElement.lid}">${escapedVal}</b> <b class="object">${escapedUnits}</b></font>`;
          } else {
            const escapedVal = this.escapeHtmlContent(val);
            temp = `<font color=${color}><b class="${cell.id}" ${description} lid="${cell.getVisual().logicalElement.lid}">${escapedVal}</b></font>`;
          }
        } else if (units && units !== "") {
          const escapedVal = this.escapeHtmlContent(this.generateValueText(val));
          const escapedUnits = this.escapeHtmlContent(units);
          temp = `<b class="${"state " + cell.id}" ${description} lid="${cell.getVisual().logicalElement.lid}">${escapedVal}</b> <b class="object">${escapedUnits}</b>`;
        } else {
          const escapedVal = this.escapeHtmlContent(val);
          temp = `<b class="${"state " + cell.id}" ${description} lid="${cell.getVisual().logicalElement.lid}">${escapedVal}</b>`;
        }
        temp = this.addProbability(propObj.probability, temp);
        if (propObj.probability && propObj.rate) {
          temp = temp + ", ";
        }
        temp = this.addRate(propObj.rate, temp, propObj.rateUnits);
        return temp;
      }
      if (this.textOnly) {
        return this.replaceBracelets(cell.attributes.attrs.text.textWrap.text);
      }
      let text = this.generateCellComputation(cell);
      text = oplFunctions.cleanThingName(text);
      text = this.replaceBracelets(text);
      if (propObj.multiplicity && ["+", "?", "1"].indexOf(propObj.multiplicity) === -1) {
        text = oplFunctions.addPlural(text);
      }
      let computationalProcessVal = "";
      if (cell.attributes.type === "opm.Process") {
        if (cell.attributes.attrs.value.value === "userDefined") {
          computationalProcessVal = "computationalfunction=\"" + encodeURIComponent(cell.attributes.userDefinedFunction.functionInput) + "\"";
        } else if (cell.attributes.attrs.value.value === "userPythonDefined") {
          computationalProcessVal = "computationalfunction=\"" + encodeURIComponent(cell.attributes.userPythonDefinedFunction.functionInput) + "\"";
        }
        computationalProcessVal = this.replaceBracelets(computationalProcessVal);
      }
      // Escape description directly for HTML attribute - don't pre-escape with replaceBracelets
      const description = "description=\"" + this.escapeHtmlAttribute(logical.description || "") + "\"";
      if (textStyle) {
        let color = cell.getVisual().strokeColor;
        if (color === "#3BC3FF" || color === "transparent" && cell.attributes.type === "opm.Process") {
          color = "#0070c0";
        } else if (color === "#70E483" || color === "transparent" && cell.attributes.type === "opm.Object") {
          color = "#00b050";
        }
        template = template.replace(`<T>`, `<font color=${color}><b class="${cell.id}" ${computationalProcessVal} ${description} lid="${cell.getVisual().logicalElement.lid}">${text}</b></font>`);
      } else {
        template = template.replace(`<T>`, `<b class="${objClass}" ${computationalProcessVal} ${description} lid="${cell.getVisual().logicalElement.lid}">${text}</b>`);
      }
      template = this.addMultiplicity(propObj.multiplicity, template);
      template = this.addProbability(propObj.probability, template);
      if (propObj.probability && propObj.rate) {
        template = template + ", ";
      }
      template = this.addRate(propObj.rate, template, propObj.rateUnits);
      return template;
    },
    generateSemifoldedThingCellHtml(cell) {
      if (cell) {
        const text = this.replaceBracelets(cell.attributes.attrs.label.text);
        // Escape description directly for HTML attribute - don't pre-escape with replaceBracelets
        const description = "description=\"" + this.escapeHtmlAttribute(cell.getVisual().logicalElement.description || "") + "\"";
        return `<b class="${cell.attributes.type.slice(4).toLowerCase()}" ${description} lid="${cell.getVisual().logicalElement.lid}">${text}</b>`;
      }
      return "";
    },
    generateValueText(tag) {
      const reg1 = /^([\.,0-9,a-z,A-Z]+)\.\.([0-9,a-z,A-Z,\.]+|\*)$/;
      const reg2 = /^([\.,0-9,a-z,A-Z]+)\.\.([0-9,a-z,A-Z,\.]+|\*)\.\.([0-9,a-z,A-Z,\.]+|\*)$/;
      const data1 = tag.match(reg1);
      const data2 = tag.match(reg2);
      if (data2) {
        const low = this.escapeHtmlContent(data2[1]);
        const mean = this.escapeHtmlContent(data2[2]);
        const high = this.escapeHtmlContent(data2[3]);
        let temp = opl_database /* .oplTemplates */.XD.symbols["n..mean..n"];
        temp = temp.replace(`<n1>`, low);
        temp = temp.replace(`<n2>`, high);
        temp = temp.replace(`<mean>`, mean);
        return temp;
      }
      if (data1) {
        const low = this.escapeHtmlContent(data1[1]);
        const high = this.escapeHtmlContent(data1[2]);
        let temp = opl_database /* .oplTemplates */.XD.symbols["n..n"];
        temp = temp.replace(`<n1>`, low);
        temp = temp.replace(`<n2>`, high);
        return temp;
      }
      return this.escapeHtmlContent(tag);
    },
    generateCellComputation(cell) {
      let text = cell.attributes.attrs.text.textWrap.text;
      let alias = "";
      let units = "";
      const cc = this.options.opmModel.getCurrentConfiguration();
      const visual = cell.getVisual();
      if (visual && visual.logicalElement && cc && cc[cell.getVisual().logicalElement.lid] && cc[cell.getVisual().logicalElement.lid] !== 0) {
        text = oplFunctions.extractAndDelete(text, ["{", "}"])[1];
      }
      if (cell && cell.attributes.type === "opm.Object") {
        if (cell.attributes.attrs.value.value !== "None" || text.length > 0 && text.charAt(text.length - 1) === "]") {
          const ans_unit = oplFunctions.extractAndDelete(text, ["[", "]"]); // just for deleting the units.
          units = ans_unit[0];
          text = ans_unit[1];
        }
        // if (cell.attributes.attrs.value.value === 'None') { //if object is not computational
        //   return text;
        // }
        const ans_alias = oplFunctions.extractAndDelete(text, ["{", "}"]);
        alias = ans_alias[0];
        text = ans_alias[1];
        if (alias !== "") {
          text = text.trim();
          text = text.concat(", ", alias, ",");
        }
      }
      return text;
    },
    generateThingHtml(cell_array, logicType = "AND", link, withProbability = false) {
      let cell = cell_array;
      if (cell_array instanceof Array) {
        cell = cell_array[0];
      }
      try {
        if (cell.attributes.type === "opm.State") {
          const parent = cell.getParent();
          if (!(cell_array instanceof Array) || cell_array.length === 1) {
            const stateFullUni = link && link.get("name").includes("Uni") ? "Stateful-Object-unidirectional" : link && link.get("name").includes("Exhibition-Characterization") ? "Stateful-Object-value" : "Stateful-Object";
            let template = opl_database /* .oplTemplates */.XD.grouping[stateFullUni];
            template = template.replace("<s>", this.generateCellHtml(cell, link, true, false, withProbability));
            template = template.replace("<O>", this.generateCellHtml(parent, link, true, true, withProbability));
            return template;
          } else {
            const links = link; // in that case link is an array of links
            let template = "";
            if (links[0] && links[0].get("name").includes("Exhibition-Characterization")) {
              template = opl_database /* .oplTemplates */.XD.grouping["Stateful-Object-value(multiple)"];
            } else {
              template = opl_database /* .oplTemplates */.XD.grouping["Stateful-Object(multiple)"];
            }
            template = template.replace("<s1...n>", this.generateGroupOfStates(cell_array, "OR", links, withProbability)); // mytest, Object can be at one state at a time, OR semantic.
            template = template.replace("<O>", this.generateCellHtml(parent, links[0], true, false, withProbability)); // mytest
            return template;
          }
        }
      } catch (e) {
        console.log(e);
      }
      return this.generateCellHtml(cell, link, false, false, withProbability);
    },
    generateGroupOfThings(cells, links = undefined, logicType = "AND", withProbability = false, parallelSeq = false, preventReorder = false) {
      let numOfCells = cells.length;
      if (!links) {
        links = Array(numOfCells).fill(undefined);
      }
      const organized = oplFunctions.groupStates(cells, links, parallelSeq, preventReorder); // returns array of arrays, that each array contains 1 process\object\state , or group of states with the same father.
      // Cells in ascending order
      cells = organized[0];
      links = organized[1];
      numOfCells = cells.length;
      let template = opl_database /* .oplTemplates */.XD.grouping[logicType + (numOfCells > 2 && links.length && logicType === "AND" ? "(links)" : "")];
      if (numOfCells === 1) {
        return this.generateThingHtml(cells[0], logicType, links[0], withProbability);
      } else if (numOfCells === 2) {
        const T1 = this.generateThingHtml(cells[0], logicType, links[0], withProbability);
        const T2 = this.generateThingHtml(cells[1], logicType, links[1], withProbability);
        template = template.replace("<T1...n-1>", T1);
        template = template.replace("<Tn>", T2);
      } else {
        let i = 1;
        let T1 = this.generateThingHtml(cells[0], logicType, links[0], withProbability) + "<b>,</b>";
        for (i; i < numOfCells - 2; i++) {
          T1 = T1 + " " + this.generateThingHtml(cells[i], logicType, links[i], withProbability) + "<b>,</b> ";
        }
        T1 = T1 + " " + this.generateThingHtml(cells[numOfCells - 2], logicType, links[numOfCells - 2], withProbability);
        const T2 = this.generateThingHtml(cells[i + 1], logicType, links[i + 1], withProbability);
        template = template.replace("<T1...n-1>", T1);
        template = template.replace("<Tn>", T2);
      }
      return template;
    },
    generateGroupOfObjectsAndProjects(cells, links, preventReorder = false) {
      const objects = [];
      const objectsLinks = [];
      const processes = [];
      const processLinks = [];
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].attributes.type === "opm.Process") {
          processes.push(cells[i]);
          processLinks.push(links[i]);
        } else {
          objects.push(cells[i]);
          objectsLinks.push(links[i]);
        }
      }
      if (objects.length === 0 || processes.length === 0) {
        return this.generateGroupOfThings(cells, links, "AND", false, false, preventReorder);
      } else {
        let template = opl_database /* .oplTemplates */.XD.grouping["Multiple-Things-Object-Process-Separated"];
        const initRappid = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
        const visualLink = initRappid.getOpmModel().getVisualElementById(links[0].id);
        if (visualLink && visualLink.sourceVisualElement.type.includes("Process")) {
          template = template.replace("<O1...n>", "<G1...n>");
          template = template.replace("<P1...n>", "<O1...n>");
          template = template.replace("<G1...n>", "<P1...n>");
        }
        const template_map = ["grouping", "Multiple-Things-Object-Process-Separated"];
        template = template.replace("<O1...n>", this.generateGroupOfThings(objects, objectsLinks));
        template = template.replace("<P1...n>", this.generateGroupOfThings(processes, processLinks));
        return template;
      }
    },
    generateGroupOfStates(cells, logicType = "OR", links, withProbability, onlyStates = true) {
      cells = cells.filter(function (cell) {
        const objClass = cell.attributes.type.slice(4).toLowerCase();
        const bool = objClass === "state";
        onlyStates = onlyStates && bool;
        return bool;
      });
      if (cells.length === 0) {
        if (!onlyStates) {
          return opl_database /* .oplTemplates */.XD.procedural_link.Split;
        }
        return "";
      }
      // if (['left', 'right'].includes(cells[0]?.getParentCell()?.getParams()?.statesArrangement)) {
      //   cells = oplFunctions.sortByY(cells);
      // } else { cells = oplFunctions.sortByX(cells); }
      cells = oplFunctions.sortByText(cells);
      const numOfCells = cells.length;
      let template = opl_database /* .oplTemplates */.XD.grouping[logicType];
      if (!links) {
        links = Array(numOfCells).fill(undefined);
      }
      if (numOfCells === 1) {
        if (!onlyStates) {
          template = template.replace("<T1...n-1>", this.generateCellHtml(cells[0], links[0], true, false, withProbability));
          template = template.replace("<Tn>", opl_database /* .oplTemplates */.XD.procedural_link.Split);
        } else {
          return this.generateCellHtml(cells[0], links[0], true, false, withProbability);
        }
      } else if (numOfCells === 2) {
        const T1 = this.generateCellHtml(cells[0], links[0], true, false, withProbability);
        const T2 = this.generateCellHtml(cells[1], links[1], true, false, withProbability);
        if (!onlyStates) {
          template = template.replace("<T1...n-1>", T1 + "<b class=\"bolderComma\">, </b>" + T2);
          template = template.replace("<Tn>", opl_database /* .oplTemplates */.XD.procedural_link.Split);
        } else {
          template = template.replace("<T1...n-1>", T1);
          template = template.replace("<Tn>", T2);
        }
      } else {
        let i = 1;
        let T1 = this.generateCellHtml(cells[0], links[0], true, false, withProbability);
        for (i; i < numOfCells - 1; i++) {
          T1 += `<b class="bolderComma">,</b> ${this.generateCellHtml(cells[i], links[i], true, false, withProbability)}`;
        }
        const T2 = this.generateCellHtml(cells[i], links[i], true, false, withProbability);
        if (!onlyStates) {
          template = template.replace("<T1...n-1>", T1 + "<b class=\"bolderComma\">, </b>" + T2);
          template = template.replace("<Tn>", opl_database /* .oplTemplates */.XD.procedural_link.Split);
        } else {
          template = template.replace("<T1...n-1>", T1);
          template = template.replace("<Tn>", T2);
        }
      }
      return template;
    },
    generateExhibitorsHtml(exhibitor) {
      const predecessor = exhibitor.getExhibitors();
      if (predecessor.length === 0) {
        return opl_database /* .oplTemplates */.XD.grouping["Single-Thing"];
      } else {
        let template = opl_database /* .oplTemplates */.XD.grouping["Attribute-Exhibitor"];
        template = template.replace("<e1...n>", this.generateGroupOfThings(predecessor));
        return template;
      }
    },
    addMultiplicity(tag, objectHtml) {
      if (tag && !(tag instanceof Array)) {
        let template = opl_database /* .oplTemplates */.XD.tags.multiplicity;
        const tags = this.extractTag(tag);
        template = template.replace("<tag>", tags[0]);
        template = template.replace("<O_Os>", objectHtml);
        if (tags[1]) {
          const temp = opl_database /* .oplTemplates */.XD.tags.constraints;
          template = temp.replace("<O_Os>", template);
          template = template.replace("<tag>", tags[1]);
        }
        return template;
      } else {
        return objectHtml;
      }
    },
    addProbability(tag, opl) {
      if (tag) {
        let template = opl_database /* .oplTemplates */.XD.tags.probability;
        template = template.replace("<tag>", this.escapeHtmlContent(String(tag)));
        template = template.replace("<O_Os>", opl);
        return template;
      }
      return opl;
    },
    addRate(tag, opl, rateUnits) {
      if (tag) {
        let template = opl_database /* .oplTemplates */.XD.tags.rate;
        template = template.replace("<tag>", this.escapeHtmlContent(String(tag)));
        template = template.replace("<O_Os>", opl);
        // if there is no rateUnits, replace the '<units>' tag and the space character before it with empty characters in order to prevent the space appearing for no reason
        template = rateUnits && rateUnits !== "" ? template.replace("<units>", this.escapeHtmlContent(String(rateUnits))) : template.replace(" <units>", "");
        return template;
      }
      return opl;
    },
    generateGroupOfStrings(array, template) {
      if (!array.length) {
        return "";
      }
      let temp = ``;
      if (array.length === 1) {
        return this.escapeHtmlContent(array[0]);
      }
      for (let i = 0; i < array.length - 1; i++) {
        temp = temp.concat(this.escapeHtmlContent(array[i]), `, `);
      }
      template = template.replace(`<T1...n-1>`, temp);
      template = template.replace(`<Tn>`, this.escapeHtmlContent(array[array.length - 1]));
      return template;
    },
    generateStructureMultiplicityText(tag) {
      if (opl_database /* .oplTemplates */.XD.symbols[tag]) {
        return opl_database /* .oplTemplates */.XD.symbols[tag];
      }
      const reg1 = /^([0-9]+)\.\.([0-9]+|\*)$/;
      const data = tag.match(reg1);
      if (!data) {
        // If tag doesn't match pattern, escape it for HTML
        return this.escapeHtmlContent(tag);
      }
      const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
      const low = data[1] < 10 ? numbers[data[1]] : this.escapeHtmlContent(data[1]);
      const high = data[2] < 10 ? numbers[data[2]] : data[2] === "*" ? "*" : this.escapeHtmlContent(data[2]);
      if (high === "*") {
        return opl_database /* .oplTemplates */.XD.symbols["n..*"].replace(`<n1>`, low);
      }
      let temp = opl_database /* .oplTemplates */.XD.symbols["n..n"];
      temp = temp.replace(`<n1>`, low);
      temp = temp.replace(`<n2>`, high);
      return temp;
    },
    extractTag(tag) {
      const const_exp = tag.split(/\s*;\s*/);
      const expressions = const_exp[0].split(/\s*,\s*/);
      const stringArray = [];
      for (let i = 0; i < expressions.length; i++) {
        stringArray.push(this.generateStructureMultiplicityText(expressions[i]));
      }
      const constraints = this.generateGroupOfStrings(const_exp.slice(1, const_exp.length), opl_database /* .oplTemplates */.XD.grouping.AND);
      const ranges = this.generateGroupOfStrings(stringArray, opl_database /* .oplTemplates */.XD.grouping.OR);
      return [ranges, constraints];
    },
    orderedTopDown(cells) {
      const res = cells.sort((cell1, cell2) => {
        if (cell1.attributes.position.y > cell2.attributes.position.y) {
          return 1;
        }
        if (cell1.attributes.position.y < cell2.attributes.position.y) {
          return -1;
        }
        return 0;
      });
      return res;
    },
    generateRequirementsOpl(ownerCell) {
      const graph = ownerCell.graph;
      const oplArray = [];
      const owner = ownerCell.getVisual().logicalElement;
      const visExhibitionLink = ownerCell.getVisual().getLinks().outGoing.find(l => l.type === models_ConfigurationOptions /* .linkType */.h6.Exhibition && l.target.logicalElement.getSatisfiedRequirementSetModule().isRequirementSetObject);
      const exhibitionLink = graph.getCell(visExhibitionLink?.id);
      if (!exhibitionLink) {
        return oplArray;
      }
      const requirements = owner.getSatisfiedRequirementSetModule().getRequirementsSet().getAllRequirements();
      for (const req of requirements) {
        const visRequirementObject = req.getRequirementObject();
        if (!visRequirementObject) {
          continue;
        }
        const requirementCell = graph.getCell(visRequirementObject.id);
        const setObjectCell = exhibitionLink.getTargetElement();
        const valueState = requirementCell.getStatesOnly()[0];
        let template = opl_database /* .oplTemplates */.XD.hidden_attributes.requirement;
        template = template.replace("<set_object>", this.generateThingHtml(requirementCell));
        template = template.replace("<value>", this.generateCellHtml(valueState));
        template = template.replace("<owner>", this.generateThingHtml(ownerCell));
        const cells = [];
        cells.push(ownerCell, setObjectCell, requirementCell, exhibitionLink, valueState);
        oplArray.push({
          opl: template,
          cells: cells
        });
      }
      return oplArray;
    },
    generateFundamentalLinkOpl(link) {
      const linkType = link.attributes.name;
      const source = link.getSource();
      const obj = link.getTriangleChildren();
      const links = obj[1];
      let targets = obj[0];
      let preventReorder = false;
      if (source.getVisual().logicalElement.orderedFundamentalTypes.includes(link.getVisual().type)) {
        preventReorder = true;
        targets = this.orderedTopDown(targets);
      }
      const cells = [source, ...targets, ...links];
      let template = "";
      const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
      if (targets.length > 1) {
        const missingData = link.getVisual().CheckAddLine();
        if (missingData.missingNumber > 0) {
          if (linkType === "Exhibition-Characterization" && missingData.missingProcesses.length > 0 && missingData.missingObjectsAndStates.length === 0) {
            if (missingData.missingNumber === 1) {
              template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_incomplete_obj_proc_(one)"];
            } else {
              template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_incomplete_obj_proc_(multiple)"];
            }
          } else if (linkType === "Exhibition-Characterization" && missingData.missingProcesses.length > 0 && missingData.missingObjectsAndStates.length > 0) {
            template = opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Characterization_incomplete_both_(multiple)"];
          } else if (missingData.missingNumber === 1) {
            template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_incomplete_(one)"];
          } else {
            template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_incomplete_(multiple)"];
          }
          template = template.replace("<T2...n>", this.generateGroupOfObjectsAndProjects(targets, links, preventReorder));
          const num = template.includes("<num2>") ? missingData.missingObjectsAndStates.length : missingData.missingNumber;
          if (template.includes("<num2>")) {
            const operationText = missingData.missingProcesses.length > 1 ? opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Operations"] : opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Operation"];
            template = template.replace("<operation>", operationText);
          }
          const attributeText = missingData.missingObjectsAndStates.length > 1 ? opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Attributes"] : opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Attribute"];
          template = template.replace("<attribute>", attributeText);
          template = template.replace("<num>", num < 9 ? numbers[num] : num);
          template = template.replace("<num2>", missingData.missingNumber < 9 ? numbers[missingData.missingProcesses.length] : missingData.missingProcesses);
          // template = template.replace(' and', ',');
        } else {
          template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_(multiple)"];
          template = template.replace("<T2...n>", this.generateGroupOfObjectsAndProjects(targets, links, preventReorder));
        }
        if (linkType === "Generalization-Specialization") {
          const unpluraled = this.generateThingHtml(source, links[0]);
          if (unpluraled.includes("</b>")) {
            let firstPart = unpluraled.substr(0, unpluraled.indexOf("</b>"));
            const secondPart = unpluraled.slice(unpluraled.indexOf("</b>"));
            if (!configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnProcess(source)) {
              firstPart = oplFunctions.addPlural(firstPart);
            }
            template = template.replace("<T1>", firstPart + secondPart);
          } else {
            template = template.replace("<T1>", oplFunctions.addPlural(unpluraled));
          }
        }
        template = template.replace("<T1>", this.generateThingHtml(source, links[0]));
      } else {
        template = opl_database /* .oplTemplates */.XD.structural_link[linkType];
        if (opl_database /* .oplDefaultSettings */.iT.language === "en" && linkType === "Generalization-Specialization" && source.attributes.type === "opm.Process") {
          template = `<T2> is <T1>.`;
        }
        const missingData = link.getVisual().CheckAddLine();
        if (missingData.missingNumber > 0) {
          if (linkType === "Exhibition-Characterization" && missingData.missingProcesses.length > 0 && missingData.missingObjectsAndStates.length === 0) {
            if (missingData.missingNumber === 1) {
              template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_one_incomplete_obj_proc"];
            } else {
              template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_incomplete_obj_proc"];
            }
          } else if (linkType === "Exhibition-Characterization" && missingData.missingProcesses.length > 0 && missingData.missingObjectsAndStates.length > 0) {
            template = opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Characterization_incomplete_both"];
          } else if (link.getVisual().CheckAddLine().missingNumber === 1) {
            template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_one_incomplete"];
          } else {
            template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_incomplete"];
          }
          if (linkType === "Generalization-Specialization") {
            const unpluraled = this.generateThingHtml(source, links[0]);
            if (unpluraled.includes("</b>")) {
              let firstPart = unpluraled.substr(0, unpluraled.indexOf("</b>"));
              const secondPart = unpluraled.slice(unpluraled.indexOf("</b>"));
              if (!configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnProcess(source)) {
                firstPart = oplFunctions.addPlural(firstPart);
              }
              template = template.replace("<T1>", firstPart + secondPart);
            } else {
              template = template.replace("<T1>", oplFunctions.addPlural(unpluraled));
            }
          }
          template = template.replace("<T1>", this.generateThingHtml(source, links[0]));
          template = template.replace("<T2>", this.generateGroupOfThings(targets, links));
          if (template.includes("<num2>")) {
            const operationText = missingData.missingProcesses.length > 1 ? opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Operations"] : opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Operation"];
            template = template.replace("<operation>", operationText);
          }
          const attributeText = missingData.missingObjectsAndStates.length > 1 ? opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Attributes"] : opl_database /* .oplTemplates */.XD.structural_link["Exhibition-Attribute"];
          template = template.replace("<attribute>", attributeText);
          const num = template.includes("<num2>") ? missingData.missingObjectsAndStates.length : missingData.missingNumber;
          template = template.replace("<num>", num < 9 ? numbers[num] : num);
          template = template.replace("<num2>", missingData.missingNumber < 9 ? numbers[missingData.missingProcesses.length] : missingData.missingProcesses);
        }
        template = template.replace("<T2>", this.generateGroupOfThings(targets, links));
        template = template.replace("<T1>", this.generateThingHtml(source, links[0]));
      }
      if (preventReorder) {
        template = template.replace(".", " in that sequence.");
      }
      template = this.replaceContents(template, []);
      return {
        opl: template,
        cells: cells
      };
    },
    generateDirectionalLinkOpl(link) {
      const linkType = link.attributes.name;
      let T1 = link.getSourceElement();
      let T2 = link.getTargetElement();
      if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnState(T2) && !link.constructor.name.includes("Uni")) {
        const temp = T1;
        T1 = T2;
        T2 = temp;
      }
      const tag1 = link.attributes.tag;
      const tag2 = link.attributes.backwardTag;
      let template = ``;
      if (!tag1 && !tag2) {
        template = opl_database /* .oplTemplates */.XD.structural_link[linkType];
        template = template.replace("<T1>", this.generateThingHtml(T1, "AND", link));
        template = template.replace("<T2>", this.generateThingHtml(T2, "AND", link));
      } else if (tag1 && !tag2) {
        if (link.isForkedLink() || link.constructor.name.includes("Uni") && link.getVisual()?.getMissingChildrenNames(true).names) {
          return this.generateForkedLinksOpl(link);
        }
        template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_(tag)"];
        template = template.replace("<T1>", this.generateThingHtml(T1, "AND", link));
        template = template.replace("<T2>", this.generateThingHtml(T2, "AND", link));
        template = template.replace("<tag>", this.escapeHtmlContent(tag1));
      } else if (tag1 && tag2) {
        template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_(ftag,btag)"];
        template = template.replace("<T1>", this.generateThingHtml(T1, "AND", link));
        template = template.replace("<T2>", this.generateThingHtml(T2, "AND", link));
        template = template.replace("<forward tag>", this.escapeHtmlContent(tag1));
        template = template.replace("<backward tag>", this.escapeHtmlContent(tag2));
        template = template.replace("<T1>", this.generateThingHtml(T1, "AND", link));
        template = template.replace("<T2>", this.generateThingHtml(T2, "AND", link));
      } else if (!tag1 && tag2) {
        template = opl_database /* .oplTemplates */.XD.structural_link[linkType + "_(tag)"];
        template = template.replace("<T2>", this.generateThingHtml(T1, "AND", link));
        template = template.replace("<T1>", this.generateThingHtml(T2, "AND", link));
        template = template.replace("<tag>", this.escapeHtmlContent(tag2));
      }
      return {
        opl: template,
        cells: [link, T1, T2]
      };
    },
    generateForkedLinksOpl(link) {
      const src = link.getSourceElement();
      let targets = link.getForkedLinks().map(l => l.getTargetElement()).filter(t => !!t);
      const tag = link.attributes.tag;
      const ordered = src.getVisual().logicalElement.orderedFundamentalTypes?.includes(models_ConfigurationOptions /* .linkType */.h6.Unidirectional);
      if (ordered) {
        targets = targets.sort((a, b) => a.get("position").x - b.get("position").x);
      }
      const missingTargets = link.getVisual().getMissingChildrenNames(true).names;
      let template;
      if (missingTargets.length === 0) {
        template = opl_database /* .oplTemplates */.XD.structural_link.Forked_Unidirectionals;
      } else {
        template = opl_database /* .oplTemplates */.XD.structural_link.Forked_Unidirectionals_with_missing;
      }
      template = template.replace("<T1>", this.generateThingHtml(src, "AND", link));
      template = template.replace("<T2..n>", this.generateGroupOfThings(targets, link.getForkedLinks(), undefined, undefined, ordered));
      if (missingTargets.length > 0 && targets.length > 1) {
        template = template.replace(" and", ",");
      }
      template = template.replace("<tag>", this.escapeHtmlContent(tag));
      template = template.replace("<num>", this.getTextualNumber([missingTargets.length]) || missingTargets.length);
      if (ordered && targets.length > 1) {
        template = template.substr(0, template.length - 1) + ", " + opl_database /* .oplTemplates */.XD.structural_link.sequence;
      }
      this.forbidden.push(...link.getForkedLinks());
      return {
        opl: template,
        cells: [link, src, ...targets]
      };
    },
    addToPairs(inOutLinkPairs, mainObject, link, linkType) {
      const mainObjectID = mainObject.attributes.id;
      const noPathKey = "key for links without path";
      let key = noPathKey;
      if (link.attributes.Path) {
        key = link.attributes.Path;
      }
      /*else{
        if(link.paths.paths.length>0 && link.paths.paths[0].label){
          key = link.attributes.path;
        }
      }*/
      if (!inOutLinkPairs[mainObjectID]) {
        inOutLinkPairs[mainObjectID] = {
          mainObject: mainObject,
          path: {}
        };
        inOutLinkPairs[mainObjectID].path[key] = {
          Consumption: [],
          Consumption_Negation: [],
          Consumption_Condition: [],
          Consumption_Condition_Negation: [],
          Consumption_Event: [],
          Result: []
        };
        inOutLinkPairs[mainObjectID].path[key][linkType].push(link);
      } else if (!inOutLinkPairs[mainObjectID].path[key]) {
        inOutLinkPairs[mainObjectID].path[key] = {
          Consumption: [],
          Consumption_Negation: [],
          Consumption_Condition: [],
          Consumption_Condition_Negation: [],
          Consumption_Event: [],
          Result: []
        };
        inOutLinkPairs[mainObjectID].path[key][linkType].push(link);
      } else {
        inOutLinkPairs[mainObjectID].path[key][linkType].push(link);
      }
    },
    generateTypedProceduralLinkOPL(link, mainProcess, linkType, templates) {
      let template = ``;
      const cells = [];
      const target = mainProcess;
      const source = link.getSourceElement();
      if (source.attributes.type === "opm.State") {
        let pairs = [];
        if (linkType.indexOf("exception") > -1) {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType];
          const parent = source.getParent();
          pairs = [["<s>", this.generateCellHtml(source, link)], ["<O>", this.generateCellHtml(parent, link, true, true)], ["<P>", this.generateCellHtml(target, link, true)]];
          const obj = oplFunctions.getProcessStateTimeAttrs(source, source.constructor.name);
          if (obj) {
            pairs = pairs.concat([[`<units>`, obj.units], [`<mintime>`, obj.min], [`<maxtime>`, obj.max]]);
          }
        } else {
          // Default template for stateful source
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType + "_state"];
          // Special handling: if this is a conditional or event input that is part of an In/Out pair,
          // we want "changes" instead of "consumes" for the source state (same semantics
          // as regular/split In-Out in in-zoomed processes).
          if (link.condition || link.event) {
            try {
              const srcState = source; // state → process link
              const obj = srcState.getParent(); // stateful object
              const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
              const model = init.getOpmModel();
              const objVisual = obj.getVisual();
              // Check if any state of this object has an incoming Result link.
              // This works across all OPDs (including different subprocesses in in-zoomed processes).
              let hasResultForSameObject = false;
              // First, try searching the current graph (for same-subprocess cases)
              const graph = srcState.graph;
              hasResultForSameObject = !!graph.getCells().find(c => {
                const cell = c;
                return cell?.attributes?.name === "Result" && typeof cell.getTargetElement === "function" && cell.getTargetElement()?.attributes?.type === "opm.State" && typeof cell.getTargetElement().getParent === "function" && cell.getTargetElement().getParent() === obj;
              });
              // If not found in current graph, search through all visual elements of the object's states
              // (this covers split in/out pairs across different subprocesses)
              if (!hasResultForSameObject && objVisual && objVisual.states) {
                for (const stateVisual of objVisual.states) {
                  // Check if this state has any incoming Result links
                  const stateLinks = stateVisual.getLinks();
                  if (stateLinks && stateLinks.inGoing) {
                    hasResultForSameObject = stateLinks.inGoing.some(l => l.type === linkType.Result);
                    if (hasResultForSameObject) {
                      break;
                    }
                  }
                }
              }
              if (hasResultForSameObject) {
                if (link.condition) {
                  template = `<P> occurs if <O> is at state <s>, in which case <P> changes <s> <O>, otherwise <P> is skipped.`;
                } else if (link.event) {
                  template = `<s> <O> initiates <P>, which changes <s> <O>.`;
                }
              }
            } catch (e) {
              // Fallback: keep default template if anything above fails
            }
          }
          const parent = source.getParent();
          pairs = [["<s>", this.generateCellHtml(source, link, true)], ["<O>", this.generateCellHtml(parent, link, true, true)], ["<P>", this.generateCellHtml(target, link, true)]];
        }
        template = this.replaceContents(template, pairs);
      } else {
        let pairs = [];
        if (linkType.indexOf("exception") > -1) {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType + "_(process)"];
          pairs = [["<P1>", this.generateCellHtml(source, link, true)], ["<P2>", this.generateCellHtml(target, link, true)]];
          const obj = oplFunctions.getProcessStateTimeAttrs(source, source.constructor.name);
          if (obj) {
            pairs = pairs.concat([[`<units>`, obj.units], [`<mintime>`, obj.min], [`<maxtime>`, obj.max]]);
          }
        } else {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType];
          const process = source.get("type") === "opm.Process" ? source : link.getTargetElement();
          const object = source.get("type") === "opm.Process" ? link.getTargetElement() : source;
          pairs = [["<O>", this.generateCellHtml(object, link, true)], ["<P>", this.generateCellHtml(process, link, true)]]; // using getTargetElement because
          // the target variable defined as mainProcess and it is not always the case, could be an effect link from process to object.
        }
        template = this.replaceContents(template, pairs);
      }
      cells.push(link, source, target);
      templates.push({
        opl: template,
        cells: cells
      });
      return templates;
    },
    generateGroupOfProceduralLinks(links, mainProcess, linkType) {
      if (links.length === 0) {
        return null;
      }
      let template = ``;
      let templates = [];
      let cells = [];
      const target = mainProcess;
      // let target_multi = links[0].attibutes.targetMultiplicity;
      if (linkType.indexOf("Condition") > -1 || linkType.indexOf("Event") > -1 || linkType.indexOf("exception") > -1) {
        if (links.length === 1) {
          templates = this.generateTypedProceduralLinkOPL(links[0], mainProcess, linkType, templates);
        } else if (linkType.indexOf("Condition") > -1 || linkType.indexOf("Event") > -1) {
          const sources = [];
          for (const link of links) {
            sources.push(link.getSourceElement());
          }
          let pairs = [];
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType + "(multiple)"];
          pairs = [["<OOs1...n>", this.generateGroupOfThings(sources, links)], ["<P>", this.generateCellHtml(target, links[0], true)]]; // effect link need to be changed
          template = this.replaceContents(template, pairs);
          cells.push(target);
          cells = cells.concat(sources);
          cells = cells.concat(links);
          templates.push({
            opl: template,
            cells: cells
          });
        } else {
          // this is exception link - generating one one
          for (const link of links) {
            templates = this.generateTypedProceduralLinkOPL(link, mainProcess, linkType, templates);
          }
        }
      } else if (linkType.indexOf("Invocation") > -1) {
        const targets = [];
        for (const link of links) {
          targets.push(link.getTargetElement());
        }
        cells.push(...links, ...targets, mainProcess); // mainProcesss is the source
        if (targets.length === 1) {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType];
          const pairs = [["<P2>", this.generateGroupOfThings(targets, links)], ["<P1>", this.generateCellHtml(mainProcess, links[0], true)]];
          template = this.replaceContents(template, pairs);
        } else {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType + "_(multiple)"];
          const pairs = [["<P2...n>", this.generateGroupOfThings(targets, links)], ["<P1>", this.generateCellHtml(mainProcess, links[0], true)]];
          template = this.replaceContents(template, pairs);
        }
        templates.push({
          opl: template,
          cells: cells
        });
      } else {
        const sources = [];
        for (const link of links) {
          if (link.getSourceElement().attributes.id !== mainProcess.attributes.id) {
            sources.push(link.getSourceElement());
          } else {
            sources.push(link.getTargetElement());
          }
        }
        cells.push(...links, ...sources, target);
        if (sources.length === 1) {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType];
          const pairs = [["<O_Os>", this.generateGroupOfThings(sources, links)], ["<P>", this.generateCellHtml(target, links[0], true)]];
          template = this.replaceContents(template, pairs);
          if (["Consumption", "Result"].includes(linkType)) {
            template = this.fixInzoomedConsumtionResult(template, linkType, sources[0], target, links[0]);
          }
        } else {
          template = opl_database /* .oplTemplates */.XD.procedural_link[linkType + "_(multiple)"];
          const pairs = [["<OOs1...n>", this.generateGroupOfThings(sources, links)], ["<P>", this.generateCellHtml(target, links[0], true)]];
          template = this.replaceContents(template, pairs);
          if (["Consumption", "Result"].includes(linkType)) {
            template = this.fixInzoomedConsumtionResultMultiple(template, linkType, sources, target, links);
          }
        }
        templates.push({
          opl: template,
          cells: cells
        });
      }
      return templates;
    },
    fixInzoomedConsumtionResult(template, type, source, target, link) {
      const model = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel();
      const visualLink = model.getVisualElementById(link.id);
      if (!visualLink) {
        return template;
      }
      const src = visualLink.sourceVisualElement;
      const trgt = visualLink.targetVisualElements[0].targetVisualElement;
      if (src.fatherObject && trgt.fatherObject) {
        const shouldChange = model.links.isNeededInOutsChange(src.fatherObject, trgt.fatherObject, visualLink);
        if (type === "Consumption" && shouldChange) {
          // TODO: make sure the hard coded replacements are translated if needed
          template = template.replace("consumes", "changes");
          template = template.replace("at state", "from state");
        } else if (type === "Result" && shouldChange) {
          template = template.replace("yields", "changes");
          template = template.replace("at state", "to state");
        }
      } else if (src && trgt.fatherObject) {
        // Added for inzoomed split in/out link pair 'Consumption' link
        const shouldChange = model.links.isNeededInOutsChange(src, trgt.fatherObject, visualLink);
        if (type === "Consumption" && shouldChange) {
          template = template.replace("consumes", "changes");
          template = template.replace(".", " from any state.");
        }
      } else if (src.fatherObject && trgt) {
        // Added for inzoomed split in/out link pair 'Result' link
        const shouldChange = model.links.isNeededInOutsChange(src.fatherObject, trgt, visualLink);
        if (type === "Result" && shouldChange) {
          template = template.replace("yields", "changes");
          template = template.replace(".", " to any state.");
        }
      }
      return template;
    },
    fixInzoomedConsumtionResultMultiple(template, type, sources, target, links) {
      const model = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel();
      let hasInOutPair = false;
      // Check if any of the links are part of an In/Out pair
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const source = sources[i];
        const visualLink = model.getVisualElementById(link.id);
        if (!visualLink) {
          continue;
        }
        const src = visualLink.sourceVisualElement;
        const trgt = visualLink.targetVisualElements[0].targetVisualElement;
        let shouldChange = false;
        if (src && src.fatherObject && trgt && trgt.fatherObject) {
          shouldChange = model.links.isNeededInOutsChange(src.fatherObject, trgt.fatherObject, visualLink);
        } else if (src && trgt && trgt.fatherObject) {
          shouldChange = model.links.isNeededInOutsChange(src, trgt.fatherObject, visualLink);
        } else if (src && src.fatherObject && trgt) {
          shouldChange = model.links.isNeededInOutsChange(src.fatherObject, trgt, visualLink);
        }
        if (shouldChange) {
          hasInOutPair = true;
          break;
        }
      }
      // If any link is part of an In/Out pair, apply the replacements
      if (hasInOutPair) {
        if (type === "Result") {
          template = template.replace(/yields/g, "changes");
          template = template.replace(/at state/g, "to state");
        } else if (type === "Consumption") {
          template = template.replace(/consumes/g, "changes");
          template = template.replace(/at state/g, "from state");
        }
      }
      return template;
    },
    generateProceduralLinksOpl(process, options, arcLinks, arcsOpl) {
      const templates = [];
      const mainProcess = process;
      let allInLinks = options.graph.getConnectedLinks(process, {
        inbound: true
      }).filter(l => l.attr("./visible") !== "none");
      let allOutLinks = options.graph.getConnectedLinks(process, {
        outbound: true
      }).filter(l => l.attr("./visible") !== "none");
      allInLinks = oplFunctions.removeLinks(allInLinks, arcLinks, arcsOpl);
      allOutLinks = oplFunctions.removeLinks(allOutLinks, arcLinks, arcsOpl);
      const inOutLinkPairs = {};
      const proceduralLinks = {
        Agent: [],
        Agent_Negation: [],
        Agent_Condition: [],
        Agent_Condition_Negation: [],
        Agent_Event: [],
        Instrument: [],
        Instrument_Negation: [],
        Instrument_Condition: [],
        Instrument_Condition_Negation: [],
        Instrument_Event: [],
        Effect: [],
        Effect_Negation: [],
        Effect_Condition: [],
        Effect_Condition_Negation: [],
        Effect_Event: [],
        Consumption: [],
        Consumption_Negation: [],
        Consumption_Condition: [],
        Consumption_Condition_Negation: [],
        Consumption_Event: [],
        Result: [],
        Overtime_exception: [],
        Undertime_exception: [],
        "OvertimeUndertime-exception": [],
        Unidirectional_Tagged_Link: [],
        Invocation: [],
        "Invocation_(self)": []
      };
      oplFunctions.DivideLinks(allInLinks, true, inOutLinkPairs, proceduralLinks); // direction=TRUE encode as in-links
      oplFunctions.DivideLinks(allOutLinks, false, inOutLinkPairs, proceduralLinks); // direction=FALSE encode as out-links
      // checking weather is input\output split links.
      this.generateInOutLinks(inOutLinkPairs, mainProcess, templates, proceduralLinks); // and also split input/output!!
      this.generateProceduralTemplates(proceduralLinks, mainProcess, templates);
      return templates;
    },
    generateInOutLinks(inOutLinkPairs, mainProcess, templates, proceduralLinks) {
      // inOutLinkPairs[mainObject].path[key] = {Consumption: [], Result: []};
      const template = ``;
      const allObjectsIDs = Object.keys(inOutLinkPairs);
      const isIn_Out_Link = false;
      for (const objectID of allObjectsIDs) {
        for (const path of Object.keys(inOutLinkPairs[objectID].path)) {
          const consumed = inOutLinkPairs[objectID].path[path].Consumption;
          const consumed_negation = inOutLinkPairs[objectID].path[path].Consumption_Negation;
          const consumed_c = inOutLinkPairs[objectID].path[path].Consumption_Condition;
          const consumed_c_negation = inOutLinkPairs[objectID].path[path].Consumption_Condition_Negation;
          const consumed_e = inOutLinkPairs[objectID].path[path].Consumption_Event;
          const resulted = inOutLinkPairs[objectID].path[path].Result;
          const consumed_check = consumed.length === 0 && consumed_negation.length === 0 && consumed_c.length === 0 && consumed_c_negation.length === 0 && consumed_e.length === 0;
          if (consumed_check || resulted.length === 0) {
            // returning the result links - regular generalization
            proceduralLinks.Result = proceduralLinks.Result.concat(resulted);
            proceduralLinks.Consumption = proceduralLinks.Consumption.concat(consumed);
            proceduralLinks.Consumption_Negation = proceduralLinks.Consumption_Negation.concat(consumed_negation);
            proceduralLinks.Consumption_Condition = proceduralLinks.Consumption_Condition.concat(consumed_c);
            proceduralLinks.Consumption_Condition_Negation = proceduralLinks.Consumption_Condition_Negation.concat(consumed_c_negation);
            proceduralLinks.Consumption_Event = proceduralLinks.Consumption_Event.concat(consumed_e);
          } else {
            /*  const states = [];
            for (const link of resulted){
              states.push(link.getTargetElement());
            }
              const mainObject = inOutLinkPairs[objectID].mainObject;
              console.log(consumed);
            for (const link of consumed){
                /!*if (link.condition) {
                template = oplTemplates['procedural_link']['Condition_Input'];
                template_map = ['procedural_link','Condition_Input'];
                } else {*!/
                template = oplTemplates['procedural_link']['In-out_Link_Pair'];
                template_map = ['procedural_link','In-out_Link_Pair'];
                isIn_Out_Link = true;
              const pairs = [['<P>',this.generateCellHtml(mainProcess)],
                ['<O>',this.generateCellHtml(mainObject,isIn_Out_Link)],
                ['<s1>', this.generateCellHtml(link.getSourceElement())],
                ['<s2>',this.generateGroupOfStates(states)]];
              template = this.replaceContents(template_map,template,pairs);
                if(!(path === "key for links without path")){
                  template = oplFunctions.AddPath(path, template);
                }
              const cells=[];
              cells.push(link.getSourceElement(), link, mainProcess, ...states, ...resulted);
              templates.push({opl:template, cells: cells});
              }*/
            if (consumed.length > 0) {
              this.generateGroupOfInOut(consumed, resulted, mainProcess, inOutLinkPairs[objectID].mainObject, templates, path);
            } else {
              proceduralLinks.Consumption = proceduralLinks.Consumption.concat(consumed);
            }
            if (consumed_c.length > 0) {
              this.generateGroupOfInOut(consumed_c, resulted, mainProcess, inOutLinkPairs[objectID].mainObject, templates, path);
            } else {
              proceduralLinks.Consumption_Condition = proceduralLinks.Consumption_Condition.concat(consumed_c);
            }
            if (consumed_e.length > 0) {
              this.generateGroupOfInOut(consumed_e, resulted, mainProcess, inOutLinkPairs[objectID].mainObject, templates, path);
            } else {
              proceduralLinks.Consumption_Event = proceduralLinks.Consumption_Event.concat(consumed_e);
            }
          }
        }
      }
    },
    generateUnTypedInOut(pairs, consumed, objHtml, statesHtml) {
      let template = ``;
      template = opl_database /* .oplTemplates */.XD.procedural_link["In-out_Link_Pair(group)"];
      template = this.replaceContents(template, pairs);
      let all_changes = ``;
      for (let i = 1; i < consumed.length; i++) {
        if (i <= consumed.length - 2) {
          all_changes += `${this.comma()} `;
        }
        if (i === consumed.length - 1) {
          all_changes += " and ";
        }
        let change = opl_database /* .oplTemplates */.XD.procedural_link["In-out(group)"];
        let otherStateHtml = this.generateCellHtml(consumed[i].getSourceElement());
        const objClass = consumed[i].getSourceElement().attributes.type.slice(4).toLowerCase();
        if (objClass !== "state") {
          otherStateHtml = opl_database /* .oplTemplates */.XD.procedural_link.Split;
        }
        pairs = [["<O>", objHtml], ["<s1>", otherStateHtml],
        // mytest
        ["<s2>", statesHtml]];
        change = this.replaceContents(change, pairs);
        all_changes += change;
      }
      template = template.replace(`<Other_changes>`, all_changes);
      return template;
    },
    generateGroupOfInOut(consumed, resulted, mainProcess, mainObject, templates, path) {
      // consumed can be array of Condition /+ condition /+ event
      let template = ``;
      // safe version: only use the link when the in-side is a State → Process link
      const useStateLink = Array.isArray(consumed) && consumed.length > 0 && consumed[0].getSourceElement && consumed[0].getSourceElement().attributes?.type === "opm.State";
      const objHtml = useStateLink ? this.generateCellHtml(mainObject, consumed[0], true, /*isObjectOfState*/true, /*withProbability*/true) : this.generateCellHtml(mainObject, undefined, true);
      const processHtml = this.generateCellHtml(mainProcess);
      const states = [];
      for (const link of resulted) {
        states.push(link.getTargetElement());
      }
      const statesHtml = this.generateGroupOfStates(states);
      let otherStateHtml = this.generateCellHtml(consumed[0].getSourceElement());
      const objClass = consumed[0].getSourceElement().attributes.type.slice(4).toLowerCase();
      if (objClass !== "state") {
        otherStateHtml = opl_database /* .oplTemplates */.XD.procedural_link.Split;
      }
      const consumed_sources = [];
      for (const link of consumed) {
        consumed_sources.push(link.getSourceElement());
      }
      const cells = [];
      cells.push(...consumed_sources, ...consumed, mainProcess, ...states, ...resulted);
      let addition = "";
      if (consumed[0].condition) {
        addition = "_Condition";
      }
      if (consumed[0].event) {
        addition = "_Event";
      }
      const pairs = [["<P>", processHtml], ["<O>", objHtml], ["<s1>", otherStateHtml], ["<s2>", statesHtml]];
      if (consumed.length === 1) {
        template = opl_database /* .oplTemplates */.XD.procedural_link["In-out_Link_Pair" + addition];
        template = this.replaceContents(template, pairs);
      } else {
        if (!consumed[0].condition && !consumed[0].event) {
          template = this.generateUnTypedInOut(pairs, consumed, objHtml, statesHtml);
        }
        if (consumed[0].condition || consumed[0].event) {
          pairs[2] = ["<s1>", this.generateGroupOfStates(consumed_sources)];
          template = opl_database /* .oplTemplates */.XD.procedural_link["In-out_Link_Pair" + addition + "(group)"];
          template = this.replaceContents(template, pairs);
        }
      }
      if (path !== "key for links without path") {
        template = oplFunctions.AddPath(path, template);
      }
      templates.push({
        opl: template,
        cells: cells
      });
    },
    generateProceduralTemplates(proceduralLinks, mainProcess, templates) {
      const linkTypes = Object.keys(proceduralLinks);
      const noPathKey = "key for links without path";
      for (const linkType of linkTypes) {
        if (proceduralLinks[linkType].length > 0) {
          const linksTags = oplFunctions.SplitByTags(proceduralLinks[linkType], noPathKey);
          for (const path of Object.keys(linksTags)) {
            const tem = this.generateGroupOfProceduralLinks(linksTags[path], mainProcess, linkType);
            if (path !== noPathKey) {
              tem[0].opl = oplFunctions.AddPath(path, tem[0].opl);
            }
            templates.push(...tem);
          }
        }
      }
    },
    generateLogicLinksOPL(arcGroups) {
      const oplArray = [];
      for (const position of Object.keys(arcGroups)) {
        for (const type of Object.keys(arcGroups[position])) {
          let arcType;
          if (position.startsWith("OR")) {
            arcType = "OR";
          } else if (position.startsWith("NOT")) {
            arcType = "NOT";
          } else {
            arcType = "XOR";
          }
          const opl = this.generateArcOpl(arcGroups[position][type], arcType);
          if (opl) {
            oplArray.push({
              opl: opl,
              cells: [...arcGroups[position][type], ...this.getCellsFromLinks(arcGroups[position][type])]
            });
          }
        }
      }
      return oplArray;
    },
    getCellsFromLinks(links) {
      const cells = new Set();
      for (const link of links) {
        cells.add(link.getSourceElement());
        cells.add(link.getTargetElement());
      }
      return Array.from(cells.values());
    },
    generateArcOpl(links, arcType) {
      links = links.filter(l => !oplGenerating.forbidden.includes(l.id));
      if (links.length < 2) {
        return;
      }
      const param = this.getSourceAndTargetOfArc(links);
      if (!param) {
        return undefined;
      }
      const singleType = param[0].constructor.name.slice(3).toLowerCase();
      const withProbability = arcType === "XOR";
      if (singleType === "process") {
        let template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType][links[0].attributes.name];
        let splitType = "OR";
        if (arcType === "NOT") {
          splitType = "AND";
        }
        if (links[0].attributes.name === "Invocation") {
          if (links[0].targetArcOnLink && links[1].targetArcOnLink && links[0].targetArcOnLink.x === links[1].targetArcOnLink.x && links[0].targetArcOnLink.y === links[1].targetArcOnLink.y) {
            template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType].Invocation_IN;
          } else {
            template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType].Invocation_OUT;
          }
          template = template.replace(",", this.comma());
          const pairs = [[`<P>`, this.generateCellHtml(param[0], links[0], true, false)], [`<P1...n>`, this.generateGroupOfThings(param[1], links, splitType, withProbability)]];
          template = this.replaceContents(template, pairs);
          template = template.replace(".", this.period());
          return template;
        }
        if (arcType === "XOR" && oplFunctions.sameFather(param[1])) {
          // couple of states with the same parent.
          template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType][links[0].attributes.name + "(brothers)"];
          const pairs = [[`<P>`, this.generateCellHtml(param[0], links[0], true, false)], [`<O>`, this.generateCellHtml(param[1][0].getParent(), links[0], true, false)], [`<s1...n>`, this.generateGroupOfStates(param[1], "OR", links, withProbability)]];
          if (!links[0]?.getVisual()?.source) {
            return "";
          }
          const process = links[0].getVisual().source.constructor.name.includes("Process") ? links[0].getVisual().source : links[0].getVisual().target;
          const isInout = param[1][0].getParent().getVisual().states.filter(st => st.getLinks().outGoing.find(l => l.type === models_ConfigurationOptions /* .linkType */.h6.Consumption && l.target === process));
          const isHavingInouts = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel().links.isHavingVisibleInOuts(links[0].getVisual().source, links[0].getVisual().target);
          let flag = false;
          if (isInout && isInout.length > 0 && !links.find(lnk => !lnk.getSourceArcOnLink() || lnk.getVisual().type !== models_ConfigurationOptions /* .linkType */.h6.Result)) {
            pairs.push([`<O_Os2...n>`, this.generateGroupOfStates(param[1], "OR", links, withProbability)]);
            const inStates = isInout.map(visState => links[0].graph.getCell(visState.id));
            flag = true;
            // used to prevent generating other opl for same links.
            const forbiddenLinks = inStates.map(st => st.getVisual().getLinks().outGoing.find(l => l.type === models_ConfigurationOptions /* .linkType */.h6.Consumption && l.target === process));
            for (const forbiddenLink of forbiddenLinks) {
              if (forbiddenLink && forbiddenLink.id) {
                this.forbidden.push(forbiddenLink.id);
              }
            }
            if (isInout.length > 1) {
              template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType].InOut_multi_Ins_Xor;
              pairs.push([`<ins1..n>`, this.generateGroupOfStates(inStates)]);
            } else {
              template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType].InOut;
              pairs.push([`<s1>`, this.generateCellHtml(links[0].graph.getCell(isInout[0].id), undefined, false, false)]);
            }
          }
          if (isHavingInouts.outs.length >= 1 && flag === false && isHavingInouts.ins.length > 0) {
            template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType].InOut_multi_Ins_One_Out;
            const inStates = isInout.map(visState => links[0].graph.getCell(visState.id));
            pairs.push([`<ins1..n>`, this.generateGroupOfStates(inStates)]);
            const outState = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.getCell(isHavingInouts.outs[0].target.id);
            pairs.push([`<s1>`, this.generateCellHtml(outState, undefined, false, false)]);
            // used to prevent generating other opl for same links.
            this.forbidden.push(isHavingInouts.outs[0].id);
          }
          template = template ? template : "";
          template = template.replace(",", this.comma());
          template = this.replaceContents(template, pairs);
          template = template.replace(".", this.period());
          return template;
        }
        template = template ? template.replace(",", this.comma()) : "";
        const pairs = [[`<P>`, this.generateCellHtml(param[0], links[0], true, false)], [`<O_Os1...n>`, this.generateGroupOfThings(param[1], links, "AND", withProbability)]];
        template = this.replaceContents(template, pairs);
        template = template.replace(".", this.period());
        return template;
      }
      if (singleType === "object") {
        let template = opl_database /* .oplTemplates */.XD.logic_operators[arcType][singleType][links[0].attributes.name];
        template = template.replace(",", this.comma());
        const pairs = [[`<O_Os>`, this.generateCellHtml(param[0], links[0], true, false)], ["<P1...n>", this.generateGroupOfThings(param[1], links, "AND", withProbability)]];
        template = this.replaceContents(template, pairs);
        template = template.replace(".", this.period());
        return template;
      }
      if (singleType === "state") {
        let template = opl_database /* .oplTemplates */.XD.logic_operators[arcType].object[links[0].attributes.name];
        if (links[0].attributes.name.indexOf("Condition") > -1 && opl_database /* .oplTemplates */.XD.logic_operators[arcType].object[links[0].attributes.name + "_state"]) {
          template = opl_database /* .oplTemplates */.XD.logic_operators[arcType].object[links[0].attributes.name + "_state"];
          template = template.replace(",", this.comma());
          const pairs = [[`<O>`, this.generateThingHtml(param[0].getParent(), "AND", links[0])], [`<s1>`, this.generateCellHtml(param[0], links, true, false)], [`<P1...n>`, this.generateGroupOfThings(param[1], links, "OR", withProbability)]];
          template = this.replaceContents(template, pairs);
          template = template.replace(".", this.period());
          return template;
        }
        let splitType = "OR";
        if (arcType === "NOT") {
          splitType = "AND";
        }
        template = template.replace(",", this.comma());
        const pairs = [[`<O_Os>`, this.generateThingHtml(param[0], "AND", links[0])], [`<P1...n>`, this.generateGroupOfThings(param[1], links, splitType, withProbability)]];
        template = this.replaceContents(template, pairs);
        template = template.replace(".", this.period());
        return template;
      }
    },
    getSourceAndTargetOfArc(array) {
      // Infer fan-out direction from link topology, not only arc-anchor equality. During OPL export
      // the graph is rendered in a temp paper without arc geometry, so sourceArcOnLink is often
      // missing and the fallback branch wrongly treats P→s1, P→s2 as s1→P, s2→P (duplicate process names).
      const src0 = array[0].getSourceElement();
      const tgt0 = array[0].getTargetElement();
      if (src0 && tgt0) {
        const allSameSource = array.every(l => l.getSourceElement()?.id === src0.id);
        const allSameTarget = array.every(l => l.getTargetElement()?.id === tgt0.id);
        if (allSameSource) {
          const targets = array.map(l => l.getTargetElement()).filter(val => !!val);
          if (targets.length >= 2 && targets.every(t => t.constructor.name === "OpmState") && oplFunctions.sameFather(targets)) {
            return [src0, targets];
          }
        }
        if (allSameTarget) {
          const sources = array.map(l => l.getSourceElement()).filter(val => !!val);
          if (sources.length >= 2 && sources.every(s => s.constructor.name === "OpmState") && oplFunctions.sameFather(sources)) {
            return [tgt0, sources];
          }
        }
      }
      let single;
      let multi = [];
      if (array[0].sourceArcOnLink && array[1].sourceArcOnLink && array[0].sourceArcOnLink.x === array[1].sourceArcOnLink.x && array[0].sourceArcOnLink.y === array[1].sourceArcOnLink.y) {
        single = array[0].getSourceElement();
        for (const link of array) {
          multi.push(link.getTargetElement());
        }
        multi = multi.filter(function (val) {
          return !!val;
        });
        if (!single || multi.length < 2) {
          return undefined;
        }
      } else {
        single = array[0].getTargetElement();
        for (const link of array) {
          multi.push(link.getSourceElement());
        }
        multi = multi.filter(function (val) {
          return !!val;
        });
        if (!single || multi.length < 2) {
          return undefined;
        }
      }
      return [single, multi];
    },
    generateInZoomInDiagramOpl(cell, options) {
      const mainThing = cell;
      const embededThings = mainThing.getInZoomedThings();
      const processList = embededThings[0];
      const objectList = embededThings[1];
      const flatProcessList = [].concat(...processList);
      const flatObjectList = [].concat(...objectList);
      const type = cell.attributes.type.slice(4).toLowerCase();
      const thingHtml = this.generateCellHtml(cell);
      const table = opl_database /* .oplTemplates */.XD[type];
      let opl;
      if (processList.length === 0) {
        opl = table.singleInzoomInDiagram;
      } else {
        opl = table.multiInzoomInDiagram;
        opl = opl.replace(`<P_list>`, this.generateGroupOfThings(flatProcessList, undefined, "AND", false, false));
      }
      const {
        sd_parent,
        current_sd
      } = this.getCurrentOpdName(cell, options);
      opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
      opl = opl.replace(`<Current_SD>`, current_sd);
      const ol = flatObjectList.length;
      const o12 = objectList.length;
      if (ol === 1) {
        opl = opl.replace(`<O_list>`, opl_database /* .oplTemplates */.XD.grouping["Single-Thing"]);
        opl = opl.replace(`<T>`, this.generateCellHtml(flatObjectList[0]));
      } else if (o12 === 1) {
        opl = opl.replace(`<O_list>`, table.object_list_parallel);
        opl = opl.replace(`<O1...n>`, this.generateGroupOfThings(objectList[0], undefined, "AND", false, true));
      } else {
        opl = opl.replace(`<O_list>`, table.object_list_sequence);
        opl = opl.replace(`<O1...n>`, this.generateParallelSequenceHtml(objectList, type));
        this.generateParallelSequenceHtml(objectList, type);
      }
      const cells = [mainThing, ...flatObjectList, ...flatProcessList];
      return {
        opl: this.replaceContents(opl, []),
        cells: cells
      };
    },
    generateFatherToSubModelOpl(options) {
      const ret = [];
      const currentOpd = options.opmModel.currentOpd;
      for (const subviewOpd of currentOpd.children.filter(child => child.sharedOpdWithSubModelId)) {
        let opl = opl_database /* .oplTemplates */.XD.father_model_to_sub_model;
        const things = currentOpd.visualElements.filter(v => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfLogicalThing(v.logicalElement) && v.logicalElement.protectedFromBeingRefinedBySubModel === subviewOpd.sharedOpdWithSubModelId);
        const objects = things.filter(th => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualObject(th));
        const processes = things.filter(th => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualProcess(th));
        const objectsCells = objects.map(v => options.graph.getCell(v.id)).filter(c => !!c);
        const processesCells = processes.map(v => options.graph.getCell(v.id)).filter(c => !!c);
        opl = opl.replace(`<o1...n>`, this.generateGroupOfThings(objectsCells, undefined, "AND"));
        opl = opl.replace(`<p1...n>`, this.generateGroupOfThings(processesCells, undefined, "AND"));
        opl = opl.replace(`<subsystem_name>`, subviewOpd.name);
        ret.push({
          cells: [...objectsCells, ...processesCells],
          opl: opl
        });
      }
      return ret;
    },
    generatesSubModelFromFatherOpl(options) {
      const currentOpd = options.opmModel.currentOpd;
      if (currentOpd.id === "SD") {
        let opl = opl_database /* .oplTemplates */.XD.sub_model_from_father_model;
        const fatherModelName = this.options.opmModel.fatherModelName;
        opl = opl.replace(`<father_model_name>`, fatherModelName);
        const subSystemName = currentOpd.visualElements.find(ob => ob.getLinks().outGoing.find(l => l.type == models_ConfigurationOptions /* .linkType */.h6.Exhibition) && ob.getLinks().outGoing.find(l => l.type == models_ConfigurationOptions /* .linkType */.h6.Instrument))?.logicalElement.text || options.modelService.displayName;
        opl = opl.replace(`<subsystem_name>`, subSystemName);
        return [{
          opl,
          cells: []
        }];
      }
      return [];
    },
    generateInZoomOpl(cell, options) {
      const mainThing = cell;
      const embededThings = mainThing.getInZoomedThings();
      const processList = embededThings[0];
      const objectList = embededThings[1];
      const flatProcessList = [].concat(...processList);
      const flatObjectList = [].concat(...objectList);
      const pl = flatProcessList.length;
      const ol = flatObjectList.length;
      const pl2 = processList.length;
      const o12 = objectList.length;
      const type = cell.attributes.type.slice(4).toLowerCase();
      const thingHtml = this.generateCellHtml(cell);
      // added dummy name to allow tests to run.
      let node_parent = {
        data: {
          name: "ParentSD",
          subTitle: ""
        }
      };
      let current_node = {
        data: {
          name: "CurrentSD",
          subTitle: ""
        }
      };
      if (options.treeViewService) {
        const parentId = options.opmModel.getOpdByThingId(cell.attributes.id).parendId;
        const currentNodeId = options.opmModel.getOpdByThingId(cell.attributes.id).id;
        node_parent = options.treeViewService.treeView?.treeModel.getNodeById(parentId);
        if (!node_parent) {
          node_parent = {
            data: {
              name: options.opmModel.getOpd(parentId)?.getNumberedName() || "",
              subTitle: ""
            }
          };
        }
        current_node = options.treeViewService.treeView?.treeModel.getNodeById(currentNodeId);
        if (!current_node) {
          current_node = {
            data: {
              name: options.opmModel.getOpd(currentNodeId)?.getNumberedName() || "",
              subTitle: ""
            }
          };
        }
      }
      const sd_parent = `<data lid="${options.opmModel.getOpdByThingId(cell.attributes.id).parendId}">${node_parent.data.name + node_parent.data.subTitle}</data>`;
      const current_sd = `<data lid="${options.opmModel.getOpdByThingId(cell.attributes.id).id}">${current_node.data.name + current_node.data.subTitle}</data>`;
      const currentOpd = options.opmModel.currentOpd;
      const refineeOpd = options.opmModel.getOpdByThingId(cell.getVisual().getRefineeInzoom()?.id);
      if (cell.getVisual().getRefineable() === cell.getVisual().getRefineeInzoom() && refineeOpd === currentOpd && flatObjectList.length > 0) {
        return this.generateInZoomInDiagramOpl(cell, options);
      }
      let opl = ``;
      const cells = [];
      cells.push(mainThing, ...flatProcessList, ...flatObjectList);
      const table = opl_database /* .oplTemplates */.XD[type];
      /*if (type === 'object'){
        if (pl >0 && ol >0){
          opl = table['multiInzoom'];
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<O_list>`, this.generateGroupOfThings(objectList));
          opl = opl.replace(`<P_list>`, this.generateGroupOfThings(flatProcessList));
        }else if (pl ===0 && ol >0){
          opl = table['singleInzoom'];
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<T_list>`, this.generateGroupOfThings(objectList));
        }else if (pl>0 && ol ===0){
          opl = table['singleInzoom'];
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<T_list>`, this.generateGroupOfThings(flatProcessList));
        }else{
          opl = ``;
        }
      }*/
      if (type === "object") {
        if (pl > 0 && ol > 0) {
          opl = table.multiInzoom;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<P_list>`, this.generateGroupOfThings(flatProcessList));
          opl = opl.replace("<SD_Parent>", sd_parent);
          opl = opl.replace("<Current_SD>", current_sd);
          if (ol === 1) {
            opl = opl.replace(`<O_list>`, opl_database /* .oplTemplates */.XD.grouping["Single-Thing"]);
            opl = opl.replace(`<T>`, this.generateCellHtml(flatObjectList[0]));
          } else if (o12 === 1) {
            opl = opl.replace(`<O_list>`, table.object_list_parallel);
            opl = opl.replace(`<O1...n>`, this.generateGroupOfThings(objectList[0]));
          } else {
            opl = opl.replace(`<O_list>`, table.object_list_sequence);
            opl = opl.replace(`<O1...n>`, this.generateParallelSequenceHtml(objectList, type));
          }
        } else if (ol === 0 && pl > 0) {
          opl = table.singleInzoom;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<T_list>`, this.generateGroupOfThings(flatProcessList));
          opl = opl.replace("<SD_Parent>", sd_parent);
          opl = opl.replace("<Current_SD>", current_sd);
        } else if (ol > 0 && pl === 0) {
          opl = table.singleInzoom;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace("<SD_Parent>", sd_parent);
          opl = opl.replace("<Current_SD>", current_sd);
          if (ol === 1) {
            opl = opl.replace(`<T_list>`, opl_database /* .oplTemplates */.XD.grouping["Single-Thing"]);
            opl = opl.replace(`<T>`, this.generateCellHtml(flatObjectList[0]));
          } else if (o12 === 1) {
            opl = opl.replace(`<T_list>`, table.object_list_parallel);
            opl = opl.replace(`<O1...n>`, this.generateGroupOfThings(objectList[0], undefined, "AND", false, true));
          } else {
            opl = opl.replace(`<T_list>`, table.object_list_sequence);
            opl = opl.replace(`<O1...n>`, this.generateParallelSequenceHtml(objectList, type));
            this.generateParallelSequenceHtml(objectList, type);
          }
        } else {
          opl = ``;
        }
      } else if (type === "process") {
        if (pl > 0 && ol > 0) {
          opl = pl === 1 || pl > 0 && pl2 === 1 ? table.multiInzoomOneProcess : table.multiInzoom;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<O_list>`, this.generateGroupOfThings(flatObjectList));
          opl = opl.replace("<SD_Parent>", sd_parent);
          opl = opl.replace("<Current_SD>", current_sd);
          if (pl === 1) {
            opl = opl.replace(`<P_list>`, opl_database /* .oplTemplates */.XD.grouping["Single-Thing"]);
            opl = opl.replace(`<T>`, this.generateCellHtml(flatProcessList[0]));
          } else if (pl2 === 1) {
            opl = opl.replace(`<P_list>`, table.process_list_parallel);
            opl = opl.replace(`<P1...n>`, this.generateGroupOfThings(processList[0]));
          } else {
            opl = opl.replace(`<P_list>`, table.process_list_sequence);
            opl = opl.replace(`<P1...n>`, this.generateParallelSequenceHtml(processList, type));
          }
        } else if (pl === 0 && ol > 0) {
          opl = table.singleInzoom;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace(`<T_list>`, this.generateGroupOfThings(flatObjectList));
          opl = opl.replace("<SD_Parent>", sd_parent);
          opl = opl.replace("<Current_SD>", current_sd);
        } else if (pl > 0 && ol === 0) {
          opl = pl2 === 1 ? table.singleInzoom_parallel : table.singleInzoom;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
          opl = opl.replace("<SD_Parent>", sd_parent);
          opl = opl.replace("<Current_SD>", current_sd);
          if (pl === 1) {
            opl = opl.replace(`<T_list>`, opl_database /* .oplTemplates */.XD.grouping["Single-Thing"]);
            opl = opl.replace(`<T>`, this.generateCellHtml(flatProcessList[0]));
          } else if (pl2 === 1) {
            opl = opl.replace(`<T_list>`, table.process_list_parallel);
            opl = opl.replace(`<P1...n>`, this.generateGroupOfThings(processList[0]));
          } else {
            opl = opl.replace(`<T_list>`, table.process_list_sequence);
            opl = opl.replace(`<P1...n>`, this.generateParallelSequenceHtml(processList, type));
          }
        } else {
          opl = ``;
        }
      }
      return {
        opl: this.replaceContents(opl, []),
        cells: cells
      };
    },
    getCurrentOpdName(cell, options) {
      let node_parent = {
        data: {
          name: "ParentSD",
          subTitle: ""
        }
      };
      let current_node = {
        data: {
          name: "CurrentSD",
          subTitle: ""
        }
      };
      if (options.treeViewService) {
        const parentId = options.opmModel.getOpdByThingId(cell.attributes.id).parendId;
        const currentNodeId = options.opmModel.getOpdByThingId(cell.attributes.id).id;
        node_parent = options.treeViewService.treeView?.treeModel.getNodeById(parentId);
        if (!node_parent) {
          node_parent = {
            data: {
              name: options.opmModel.getOpd(parentId)?.getNumberedName() || "",
              subTitle: ""
            }
          };
        }
        current_node = options.treeViewService.treeView?.treeModel.getNodeById(currentNodeId);
        if (!current_node) {
          current_node = {
            data: {
              name: options.opmModel.getOpd(currentNodeId)?.getNumberedName() || "",
              subTitle: ""
            }
          };
        }
      }
      const sd_parent = `<data lid="${options.opmModel.getOpdByThingId(cell.attributes.id).parendId}">${node_parent.data.name + node_parent.data.subTitle}</data>`;
      const current_sd = `<data lid="${options.opmModel.getOpdByThingId(cell.attributes.id).id}">${current_node.data.name + current_node.data.subTitle}</data>`;
      return {
        sd_parent,
        current_sd
      };
    },
    generateUnfoldOpl(cell, options) {
      const ret = [];
      const unfoldData = cell.getUnfoldedThings();
      const {
        sd_parent,
        current_sd
      } = this.getCurrentOpdName(cell, options);
      if (unfoldData.aggregation.objectsAndStates.length || unfoldData.aggregation.processes.length) {
        ret.push(this.generateUnfoldAggregationOpl(cell, unfoldData.aggregation, sd_parent, current_sd, options));
      }
      if (unfoldData.exhibition.objectsAndStates.length || unfoldData.exhibition.processes.length) {
        ret.push(this.generateUnfoldExhibitionOpl(cell, unfoldData.exhibition, sd_parent, current_sd, options));
      }
      if (unfoldData.generalization.objectsAndStates.length || unfoldData.generalization.processes.length) {
        ret.push(this.generateUnfoldGeneralizationOpl(cell, unfoldData.generalization, sd_parent, current_sd, options));
      }
      if (unfoldData.instantiation.objectsAndStates.length || unfoldData.instantiation.processes.length) {
        ret.push(this.generateUnfoldInstantiationOpl(cell, unfoldData.instantiation, sd_parent, current_sd, options));
      }
      const all = [...Object.keys(unfoldData).map(key => unfoldData[key].processes), ...Object.keys(unfoldData).map(key => unfoldData[key].objectsAndStates)];
      if (!all.some(arr => arr.length)) {
        ret.push(this.generateUnspecifiedUnfoldOpl(cell, sd_parent, current_sd, options));
      }
      return ret;
    },
    generateUnfoldAggregationOpl(cell, data, sd_parent, current_sd, options) {
      const type = cell.attributes.type.slice(4).toLowerCase();
      const table = opl_database /* .oplTemplates */.XD[type];
      const thingHtml = this.generateCellHtml(cell);
      let opl;
      opl = table.single_unfold_aggregation;
      opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
      opl = opl.replace("<SD_Parent>", sd_parent);
      opl = opl.replace("<Current_SD>", current_sd);
      const targets = [...data.processes.map(v => options.graph.getCell(v.id)), ...data.objectsAndStates.map(v => options.graph.getCell(v.id))].filter(c => c);
      opl = opl.replace(`<T_list>`, this.generateGroupOfThings(targets, undefined, "AND", false, false, false));
      const linksCells = cell.getVisual().getLinks().outGoing.filter(l => l.type === models_ConfigurationOptions /* .linkType */.h6.Aggregation).map(v => options.graph.getCell(v?.id)).filter(c => c);
      return {
        opl,
        cells: [cell, ...targets, ...linksCells]
      };
    },
    generateUnfoldExhibitionOpl(cell, data, sd_parent, current_sd, options) {
      const type = cell.attributes.type.slice(4).toLowerCase();
      const table = opl_database /* .oplTemplates */.XD[type];
      const thingHtml = this.generateCellHtml(cell);
      let opl;
      let targets = [];
      if (data.processes.length > 0 && data.objectsAndStates.length > 0) {
        opl = table.multi_unfold_exhibition;
        opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
        opl = opl.replace("<SD_Parent>", sd_parent);
        opl = opl.replace("<Current_SD>", current_sd);
        const processesCells = data.processes.map(v => options.graph.getCell(v.id)).filter(c => c);
        const objectsAndStatesCells = data.objectsAndStates.map(v => options.graph.getCell(v.id)).filter(c => c);
        targets = [...processesCells, ...objectsAndStatesCells];
        opl = opl.replace(`<P_list>`, this.generateGroupOfThings(processesCells, undefined, "AND", false, false, false));
        opl = opl.replace(`<O_list>`, this.generateGroupOfThings(objectsAndStatesCells, undefined, "AND", false, false, false));
      } else {
        opl = table.single_unfold_exhibition;
        opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
        opl = opl.replace("<SD_Parent>", sd_parent);
        opl = opl.replace("<Current_SD>", current_sd);
        targets = [...data.processes.map(v => options.graph.getCell(v.id)), ...data.objectsAndStates.map(v => options.graph.getCell(v.id))].filter(c => c);
        opl = opl.replace(`<T_list>`, this.generateGroupOfThings(targets, undefined, "AND", false, false, false));
      }
      const linksCells = cell.getVisual().getLinks().outGoing.filter(l => l.type === models_ConfigurationOptions /* .linkType */.h6.Exhibition).map(v => options.graph.getCell(v?.id)).filter(c => c);
      return {
        opl,
        cells: [cell, ...targets, ...linksCells]
      };
    },
    generateUnfoldGeneralizationOpl(cell, data, sd_parent, current_sd, options) {
      const type = cell.attributes.type.slice(4).toLowerCase();
      const table = opl_database /* .oplTemplates */.XD[type];
      const opl = table.single_unfold_generalization;
      return this.generateUnfoldSingleOpl(cell, data, sd_parent, current_sd, options, opl, type, models_ConfigurationOptions /* .linkType */.h6.Generalization);
    },
    generateUnfoldInstantiationOpl(cell, data, sd_parent, current_sd, options) {
      const type = cell.attributes.type.slice(4).toLowerCase();
      const table = opl_database /* .oplTemplates */.XD[type];
      const opl = table.single_unfold_instantiation;
      return this.generateUnfoldSingleOpl(cell, data, sd_parent, current_sd, options, opl, type, models_ConfigurationOptions /* .linkType */.h6.Instantiation);
    },
    generateUnspecifiedUnfoldOpl(cell, sd_parent, current_sd, options) {
      const thingHtml = this.generateCellHtml(cell);
      const type = cell.attributes.type.slice(4).toLowerCase();
      const table = opl_database /* .oplTemplates */.XD[type];
      let opl = table.unspecified_unfold;
      opl = opl.replace(`<T>`, thingHtml);
      opl = opl.replace("<SD_Parent>", sd_parent);
      opl = opl.replace("<Current_SD>", current_sd);
      return {
        opl,
        cells: [cell]
      };
    },
    generateUnfoldSingleOpl(cell, data, sd_parent, current_sd, options, opl, type, linksType) {
      const thingHtml = this.generateCellHtml(cell);
      opl = opl.replace(`<${type[0].toUpperCase()}>`, thingHtml);
      opl = opl.replace("<SD_Parent>", sd_parent);
      opl = opl.replace("<Current_SD>", current_sd);
      const targets = [...data.processes.map(v => options.graph.getCell(v.id)), ...data.objectsAndStates.map(v => options.graph.getCell(v.id))].filter(c => c);
      opl = opl.replace(`<T_list>`, this.generateGroupOfThings(targets, undefined, "AND", false, false, false));
      const linksCells = cell.getVisual().getLinks().outGoing.filter(l => l.type === linksType).map(v => options.graph.getCell(v?.id)).filter(c => c);
      return {
        opl,
        cells: [cell, ...targets, ...linksCells]
      };
    },
    generateParallelSequenceHtml(List, type) {
      const HtmlList = [];
      for (const thing of List) {
        if (thing.length === 1) {
          HtmlList.push(this.generateCellHtml(thing[0]));
        } else {
          let t = opl_database /* .oplTemplates */.XD[type][type + "_list_parallel"];
          const searchval = `<${type[0].toUpperCase()}1...n>`;
          t = t.replace(searchval, this.generateGroupOfThings(thing, undefined, "AND", false, true));
          HtmlList.push(t);
        }
      }
      let firstPart = ``;
      let i = 0;
      for (i; i < List.length - 1; i++) {
        firstPart = `${firstPart + HtmlList[i] + this.comma()} `;
      }
      const lastPart = HtmlList[i];
      let html = opl_database /* .oplTemplates */.XD.grouping["Multiple-Things"];
      html = html.replace(`<T1...n-1>`, firstPart);
      html = html.replace(`<Tn>`, lastPart);
      return html;
    },
    essenceName(essence) {
      if (essence === models_ConfigurationOptions /* .Essence */.tg.Informatical) {
        return opl_database /* .oplTemplates */.XD.essence.informatical;
      } else {
        return opl_database /* .oplTemplates */.XD.essence.physical;
      }
    },
    affiliationName(affiliation) {
      if (affiliation === models_ConfigurationOptions /* .Affiliation */.n9.Environmental) {
        return opl_database /* .oplTemplates */.XD.affiliation.environmental;
      } else {
        return opl_database /* .oplTemplates */.XD.affiliation.systemic;
      }
    },
    generatDigitalTwinOpl(cell) {
      if (cell.attr("digitalTwinConnected")) {
        const digitalTwinId = cell.attr("digitalTwin");
        const twinCell = cell.graph.getCell(digitalTwinId);
        let opl = ``;
        const type = cell.attributes.type.slice(4).toLowerCase();
        const table = opl_database /* .oplTemplates */.XD[type];
        opl = table.digital_twin;
        opl = opl.replace(`<O>`, this.generateCellHtml(cell));
        opl = opl.replace(`<TWIN>`, this.generateCellHtml(twinCell, undefined, false));
        opl = opl.replace(`.`, this.period());
        return {
          opl: opl,
          cells: [cell, twinCell]
        };
      }
    },
    generateThingOPL(cell) {
      const essence = cell.getEssence();
      const affiliation = cell.getAffiliation();
      const defaultEssence = opl_database /* .oplDefaultSettings */.iT.essence;
      const defaultAffiliation = opl_database /* .oplDefaultSettings */.iT.affiliation;
      const name = cell.attributes.attrs.text.textWrap.text;
      const type = cell.attributes.type.slice(4).toLowerCase();
      const thingHtml = this.generateCellHtml(cell);
      const table = opl_database /* .oplTemplates */.XD[type];
      let opl = ``;
      if (cell.getVisual()?.logicalElement.isSatisfiedRequirementSetObject()) {
        return {
          opl: opl,
          cells: [cell]
        };
      }
      if (cell.getVisual()?.logicalElement.isSatisfiedRequirementObject()) {
        return {
          opl: opl,
          cells: [cell]
        };
      }
      const opt = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().oplService.userOplSettings.displayOpt;
      if (opt === "Don't show essence OPL for All Things") {
        return {
          opl: opl,
          cells: [cell]
        };
      } else if (opt === "Show essence OPL for all Things") {
        opl = table.non_default;
        opl = opl.replace(`<${type[0].toUpperCase()}>`, this.generateCellHtml(cell));
        opl = opl.replace(`<a>`, this.affiliationName(affiliation));
        opl = opl.replace(`<e>`, this.essenceName(essence));
        opl = opl.replace(`.`, " " + table.thing_generic_name + this.period());
        return {
          opl: opl,
          cells: [cell]
        };
      } else if (essence !== defaultEssence) {
        if (affiliation === defaultAffiliation) {
          opl = table.default_affiliation;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, this.generateCellHtml(cell));
          opl = opl.replace(`<e>`, this.essenceName(essence));
          opl = opl.replace(`.`, " " + table.thing_generic_name + this.period());
        } else {
          opl = table.non_default;
          opl = opl.replace(`<${type[0].toUpperCase()}>`, this.generateCellHtml(cell));
          opl = opl.replace(`<a>`, this.affiliationName(affiliation));
          opl = opl.replace(`<e>`, this.essenceName(essence));
          opl = opl.replace(`.`, " " + table.thing_generic_name + this.period());
        }
      }
      return {
        opl: opl,
        cells: [cell]
      };
    },
    replaceOrForStates(opl) {
      // Only process text content between opening and closing tags, not attribute values
      // We need to be very careful to only match actual content, not text in attributes
      // Strategy: Check if we're inside an attribute by looking for attribute patterns
      // Attributes are in the form: attribute="value" or attribute='value'
      // We'll count both regular quotes and HTML entity quotes (&quot;)
      const extractedText = [];
      const placeholders = [];
      let placeholderIndex = 0;
      // Match text between > and <, but only if it's actual content
      opl = opl.replace(/>([^<]+)</g, (match, text, offset) => {
        const beforeText = opl.substring(0, offset);
        // Count both regular quotes and HTML entity quotes before this position
        const regularQuotes = (beforeText.match(/"/g) || []).length;
        const entityQuotes = (beforeText.match(/&quot;/g) || []).length;
        const totalQuotes = regularQuotes + entityQuotes;
        // If odd number of total quotes, we're inside an attribute value
        if (totalQuotes % 2 === 1) {
          // We're inside an attribute, don't process this text
          return match;
        }
        // Additional check: Look for attribute patterns before the match
        // Attributes typically have: space or = followed by quote
        const recentText = beforeText.substring(Math.max(0, beforeText.length - 100));
        // Check if we're inside an attribute by looking for attribute= or attribute (space) patterns
        // followed by a quote that hasn't been closed
        const attributePattern = /(?:description|class|lid|computationalfunction)\s*=\s*"[^"]*$/;
        if (attributePattern.test(recentText)) {
          // We're likely inside an attribute, don't process
          return match;
        }
        // Also check if the text itself looks like it might be attribute content
        // Attribute content often contains HTML entities or is very long
        // But this is less reliable, so we'll be conservative
        // This appears to be actual content between tags
        const placeholder = `§PLACE${placeholderIndex++}§`;
        extractedText.push(text);
        placeholders.push(placeholder);
        return `>${placeholder}<`;
      });
      // Process the full extracted text as one entity
      if (extractedText.length === 0) {
        return opl; // No content to process
      }
      let textContent = extractedText.join("§"); // Join all extracted text parts
      const parts = textContent.split(" or"); // Split text at ' or'
      if (parts.length > 1) {
        const lastPart = parts.pop(); // Preserve the last ' or'
        textContent = parts.join("<b class=\"bolderComma\">,</b> ") + "<b class=\"bolderComma\">,</b> or" + lastPart;
      }
      // Reinstate modified text back into the original HTML structure
      const modifiedParts = textContent.split("§");
      let result = opl;
      for (let i = 0; i < placeholders.length; i++) {
        if (modifiedParts[i] !== undefined) {
          result = result.replace(placeholders[i], modifiedParts[i]);
        }
      }
      return result;
    },
    generateStateOPL(cell) {
      const parent = cell.getParent(); // parent is the object who contains the states
      if (!parent) {
        return;
      }
      let opl = ``;
      const cells = [];
      const logicalStates = parent.getVisual().logicalElement.states_;
      if (parent.getStatesOnly()) {
        const states = parent.getStatesOnly().filter(state => {
          return state.constructor.name === "OpmState";
        });
        cells.push(...states);
        const len = states.length;
        const indent = opl_database /* .oplTemplates */.XD.grouping.indentation;
        const table = opl_database /* .oplTemplates */.XD.state;
        if (len === 1 && logicalStates.length === len) {
          const pairs = [["<O>", this.generateCellHtml(parent)], ["<s>", this.generateGroupOfStates(states)]];
          opl = this.replaceContents(table.single_state, pairs);
        }
        if (len > 1 && logicalStates.length === len) {
          const pairs = [["<O>", this.generateCellHtml(parent)], ["<s1...n>", this.generateGroupOfStates(states)]];
          opl = this.replaceContents(table.multiple_states, pairs);
        }
        if (len === 0 && logicalStates.length > 0) {
          const pairs = [["<O>", this.generateCellHtml(parent)]];
          opl = this.replaceContents(table.all_states_are_suppressed, pairs);
        }
        if (len > 0 && logicalStates.length !== len) {
          const oneMissing = logicalStates.length - len === 1 ? "_one_missing" : "";
          if (len === 1) {
            const pairs = [["<O>", this.generateCellHtml(parent)], ["<s>", this.generateGroupOfStates(states)], ["<num>", this.getTextualNumber(logicalStates.length - len)]];
            opl = this.replaceContents(table["one_state_shown" + oneMissing], pairs);
            opl = this.replaceOrForStates(opl);
          } else {
            const pairs = [["<O>", this.generateCellHtml(parent)], ["<s1...n>", this.generateGroupOfStates(states)], ["<num>", this.getTextualNumber(logicalStates.length - len)]];
            opl = this.replaceContents(table["two_or_more_states_shown" + oneMissing], pairs);
            opl = this.replaceOrForStates(opl);
          }
        }
        for (const state of states) {
          const type = state.checkType();
          if (type !== "none") {
            const stateOpl = table[state.getTypeForOpl()];
            const pairs = [["<s>", this.generateCellHtml(state)]];
            pairs.push(["<O>", this.generateCellHtml(state.getParentCell())]);
            if (type.includes("Current")) {
              opl = opl + "<br>" + indent + this.replaceContents(table.Current, pairs);
            }
            opl = opl + (stateOpl === "" ? "" : "<br>") + indent + this.replaceContents(stateOpl, pairs);
          }
          const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
          if (state.isTimeDuration()) {
            const timeDParams = oplFunctions.getProcessStateTimeAttrs(state, state.constructor.name);
            if (!timeDParams) {
              return {
                opl: "",
                cells: []
              };
            }
            while (timeDParams.template.indexOf(`<units>`) !== -1) {
              timeDParams.template = timeDParams.template.replace(`<units>`, timeDParams.units);
            }
            timeDParams.template = timeDParams.template.replace(`<exp>`, timeDParams.expected);
            timeDParams.template = timeDParams.template.replace(`<min>`, timeDParams.min);
            timeDParams.template = timeDParams.template.replace(`<max>`, timeDParams.max);
            // timeDParams.template = timeDParams.template.replace(`<P>`, this.generateCellHtml(process, undefined, true, false, false, undefined));
            const pairs = [["<s>", this.generateCellHtml(state)]];
            opl = opl + "<br>" + indent + this.replaceContents(timeDParams.template, pairs);
            // return { opl: timeDParams.template, cells: [state] };
          }
        }
      }
      return {
        opl: opl,
        cells: cells
      };
    },
    getTextualNumber(num) {
      const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
      if (num < 10) {
        return numbers[num];
      }
      return String(num);
    },
    generateProcessTime(process) {
      const obj = oplFunctions.getProcessStateTimeAttrs(process, process.constructor.name);
      if (!obj) {
        return {
          opl: "",
          cells: []
        };
      }
      while (obj.template.indexOf(`<units>`) !== -1) {
        obj.template = obj.template.replace(`<units>`, obj.units);
      }
      obj.template = obj.template.replace(`<exp>`, obj.expected);
      obj.template = obj.template.replace(`<min>`, obj.min);
      obj.template = obj.template.replace(`<max>`, obj.max);
      obj.template = obj.template.replace(`<P>`, this.generateCellHtml(process, undefined, true, false, false, undefined));
      return {
        opl: obj.template,
        cells: [process]
      };
    },
    generateSemiFoldingOPL(cell) {
      let opl = "";
      const folded = [];
      const cells = [cell];
      const cellType = cell.get("type").includes("Object") ? "object" : "process";
      const relationsCounter = {
        11: 0,
        12: 0,
        13: 0,
        14: 0
      };
      let numberOfRels = 0;
      cell.getVisual().semiFolded.forEach(vis => {
        const relationType = vis.isFoldedUnderThing().triangleType;
        folded.push({
          thing: vis,
          relationType: relationType
        });
        if (relationsCounter[relationType] === 0) {
          numberOfRels += 1;
        }
        relationsCounter[relationType] = relationsCounter[relationType] + 1;
      });
      const pair = [["<" + cellType[0].toUpperCase() + ">", this.generateCellHtml(cell)]];
      opl += this.replaceContents(opl_database /* .oplTemplates */.XD.semifolding[cellType], pair);
      if (relationsCounter[models_ConfigurationOptions /* .linkType */.h6.Aggregation] > 0) {
        const relevantCells = cell.getVisual().semiFolded.filter(v => v.isFoldedUnderThing().triangleType === models_ConfigurationOptions /* .linkType */.h6.Aggregation).map(vis => cell.graph.getCell(vis.id));
        let template = relevantCells.length === 1 ? opl_database /* .oplTemplates */.XD.semifolding.aggregation.single : opl_database /* .oplTemplates */.XD.semifolding.aggregation.multiple;
        template = template.replace("<T>", this.generateSemifoldedThingCellHtml(relevantCells[0]));
        template = template.replace("<Tn>", this.generateSemifoldedThingCellHtml(relevantCells[relevantCells.length - 1]));
        let str = "";
        for (let i = 0; i < relevantCells.length - 1; i++) {
          let comma = relevantCells.length === 2 && i === relevantCells.length - 2 ? "" : ", ";
          if (relevantCells.length !== 2 && i === relevantCells.length - 2) {
            comma = "";
          }
          str += this.generateSemifoldedThingCellHtml(relevantCells[i]) + comma;
        }
        template = template.replace("<T1...n-1>", str);
        opl += template;
        // const hasAfter = relationsCounter[12] > 0 || relationsCounter[13] > 0 || relationsCounter[14] > 0;
        // opl += hasAfter ? ', ' : '';
        cells.push(...relevantCells);
      }
      if (relationsCounter[models_ConfigurationOptions /* .linkType */.h6.Exhibition] > 0) {
        const relevantCells = cell.getVisual().semiFolded.filter(v => v.isFoldedUnderThing().triangleType === models_ConfigurationOptions /* .linkType */.h6.Exhibition).map(vis => cell.graph.getCell(vis.id));
        let template = relevantCells.length === 1 ? opl_database /* .oplTemplates */.XD.semifolding.exhibition.single : opl_database /* .oplTemplates */.XD.semifolding.exhibition.multiple;
        template = template.replace("<T>", this.generateSemifoldedThingCellHtml(relevantCells[0]));
        template = template.replace("<Tn>", this.generateSemifoldedThingCellHtml(relevantCells[relevantCells.length - 1]));
        let str = "";
        for (let i = 0; i < relevantCells.length - 1; i++) {
          let comma = relevantCells.length === 2 && i === relevantCells.length - 2 ? "" : ", ";
          if (relevantCells.length !== 2 && i === relevantCells.length - 2) {
            comma = "";
          }
          str += this.generateSemifoldedThingCellHtml(relevantCells[i]) + comma;
        }
        template = template.replace("<T1...n-1>", str);
        cells.push(...relevantCells);
        const hasBefore = relationsCounter[11] > 0;
        const hasAfter = relationsCounter[13] > 0 || relationsCounter[14] > 0;
        if (hasBefore && !hasAfter) {
          opl.slice(opl.lastIndexOf(", "));
          opl += ", and ";
        } else if (hasBefore && hasAfter) {
          opl += ", ";
        }
        opl += template;
      }
      if (relationsCounter[models_ConfigurationOptions /* .linkType */.h6.Generalization] > 0) {
        const relevantCells = cell.getVisual().semiFolded.filter(v => v.isFoldedUnderThing().triangleType === models_ConfigurationOptions /* .linkType */.h6.Generalization).map(vis => cell.graph.getCell(vis.id));
        let template = relevantCells.length === 1 ? opl_database /* .oplTemplates */.XD.semifolding.generalization.single : opl_database /* .oplTemplates */.XD.semifolding.generalization.multiple;
        template = template.replace("<T>", this.generateSemifoldedThingCellHtml(relevantCells[0]));
        template = template.replace("<Tn>", this.generateSemifoldedThingCellHtml(relevantCells[relevantCells.length - 1]));
        let str = "";
        for (let i = 0; i < relevantCells.length - 1; i++) {
          let comma = relevantCells.length === 2 && i === relevantCells.length - 2 ? "" : ", ";
          if (relevantCells.length !== 2 && i === relevantCells.length - 2) {
            comma = "";
          }
          str += this.generateSemifoldedThingCellHtml(relevantCells[i]) + comma;
        }
        template = template.replace("<T1...n-1>", str);
        cells.push(...relevantCells);
        const hasBefore = relationsCounter[11] > 0 || relationsCounter[12] > 0;
        const hasAfter = relationsCounter[14] > 0;
        if (hasBefore && !hasAfter) {
          opl.slice(opl.lastIndexOf(", "));
          opl += ", and ";
        } else if (hasBefore && hasAfter) {
          opl += ", ";
        }
        opl += template;
      }
      if (relationsCounter[models_ConfigurationOptions /* .linkType */.h6.Instantiation] > 0) {
        const relevantCells = cell.getVisual().semiFolded.filter(v => v.isFoldedUnderThing().triangleType === models_ConfigurationOptions /* .linkType */.h6.Instantiation).map(vis => cell.graph.getCell(vis.id));
        let template = relevantCells.length === 1 ? opl_database /* .oplTemplates */.XD.semifolding.instantiation.single : opl_database /* .oplTemplates */.XD.semifolding.instantiation.multiple;
        template = template.replace("<T>", this.generateSemifoldedThingCellHtml(relevantCells[0]));
        template = template.replace("<Tn>", this.generateSemifoldedThingCellHtml(relevantCells[relevantCells.length - 1]));
        let str = "";
        for (let i = 0; i < relevantCells.length - 1; i++) {
          let comma = relevantCells.length === 2 && i === relevantCells.length - 2 ? "" : ", ";
          if (relevantCells.length !== 2 && i === relevantCells.length - 2) {
            comma = "";
          }
          str += this.generateSemifoldedThingCellHtml(relevantCells[i]) + comma;
        }
        template = template.replace("<T1...n-1>", str);
        cells.push(...relevantCells);
        const hasBefore = relationsCounter[11] > 0 || relationsCounter[12] > 0 || relationsCounter[13] > 0;
        if (hasBefore) {
          opl += ", and ";
        }
        opl += template;
      }
      opl += ".";
      const model = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel();
      const thisSd = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel().currentOpd;
      const sds = cell.getVisual().logicalElement.visualElements.map(visual => model.getOpdByThingId(visual.id)).filter(s => !!s);
      let highestSd = sds[0];
      for (const opd of sds) {
        if (opd.getOpdDepth() < highestSd.getOpdDepth()) {
          highestSd = opd;
        }
      }
      const ret = [{
        opl: opl,
        cells: cells
      }];
      if (highestSd !== thisSd) {
        const prs = [["<" + cellType[0].toUpperCase() + ">", this.generateCellHtml(cell)], ["<SD>", thisSd.getNumberedName()], ["<HighestSD>", highestSd.getNumberedName()]];
        const sent2 = {
          opl: this.replaceContents(opl_database /* .oplTemplates */.XD.semifolding.general[cellType], prs),
          cells: [cell]
        };
        ret.push(sent2);
      }
      return ret;
    },
    generateOPL(options) {
      this.options = options;
      this.forbidden = [];
      let cells = options.graph.getCells();
      const groups = oplFunctions.splitByArcs(cells);
      cells = groups[0];
      const linksOfArcsIDs = oplFunctions.getIDs(groups[1]);
      const ArcsOpl = this.generateLogicLinksOPL(groups[1]);
      const inzoomOpl = [];
      const unfoldOpl = [];
      const objectOpl = [];
      const processOpl = [];
      for (const cell of cells) {
        try {
          let opl = ``;
          const type = cell.attributes.type.slice(4).toLowerCase();
          const isSemifolded = cell.constructor.name.includes("Semi");
          if (isSemifolded && type === "object") {
            continue;
          }
          const linkType = cell.attributes.name;
          if (type === "object" || type === "process") {
            const visualCell = options.opmModel.getVisualElementById(cell.attributes.id);
            if (visualCell && visualCell.isInzoomed()) {
              try {
                inzoomOpl.push(this.generateInZoomOpl(cell, options));
              } catch (err) {}
            }
            if (visualCell && visualCell.getRefineeUnfold() === visualCell) {
              try {
                unfoldOpl.push(...this.generateUnfoldOpl(cell, options));
              } catch (err) {}
            }
          }
          if (type === "object") {
            opl = this.generateThingOPL(cell);
            if (opl.opl && opl.opl !== "") {
              objectOpl.push(opl);
            }
            const digitalTwinOpl = this.generatDigitalTwinOpl(cell);
            if (digitalTwinOpl) {
              objectOpl.push(digitalTwinOpl);
            }
            // checking whether the state is ellipsis
            const rectangleStates = cell.getStatesOnly().filter(state => {
              return state.constructor.name === "OpmState";
            });
            const ellipsis = cell.getEmbeddedCells().find(c => c?.constructor.name.includes("Ellipsis"));
            if (rectangleStates.length > 0 || ellipsis) {
              if (!cell.getVisual()?.logicalElement.isSatisfiedRequirementObject()) {
                opl = this.generateStateOPL(cell.getStatesOnly()[0] || ellipsis);
                objectOpl.push(opl);
              }
            }
            if (cell.getVisual() && cell.getVisual().isSemiFolded()) {
              const semiFoldedOpl = this.generateSemiFoldingOPL(cell);
              objectOpl.push(...semiFoldedOpl);
            }
            if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(cell.getVisual()) && cell.getVisual()?.logicalElement.hasRequirements()) {
              objectOpl.push(...this.generateRequirementsOpl(cell));
            }
          } else if (type === "process") {
            if (!isSemifolded) {
              opl = this.generateThingOPL(cell);
              if (opl.opl && opl.opl !== "") {
                processOpl.push(opl);
              }
              opl = this.generateProcessTime(cell);
              if (opl.opl && opl.opl !== "") {
                processOpl.push(opl);
              }
            }
            // processOpl.push(...this.generateResultConsumptionChangeLinkOpl(cell));
            processOpl.push(...this.generateProceduralLinksOpl(cell, options, linksOfArcsIDs, ArcsOpl));
            if (cell.getVisual() && cell.getVisual().isSemiFolded()) {
              const semiFoldedOpl = this.generateSemiFoldingOPL(cell);
              processOpl.push(...semiFoldedOpl);
            }
            if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(cell.getVisual()) && cell.getVisual()?.logicalElement.hasRequirements()) {
              processOpl.push(...this.generateRequirementsOpl(cell));
            }
          } else if (type === "link" && cell.getSourceElement() && cell.getTargetElement()) {
            if (opl_database /* .structuralLinkTypes */.Hm.indexOf(linkType) > -1) {
              if (["Aggregation-Participation", "Generalization-Specialization", "Classification-Instantiation", "Exhibition-Characterization"].indexOf(linkType) > -1) {
                if (cell.getAllFundamentalLinks() && cell.attributes.id === cell.getAllFundamentalLinks()[0].attributes.id) {
                  const visSource = cell.getVisual()?.source;
                  const visTarget = cell.getVisual()?.target;
                  if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(visSource) && visSource?.logicalElement.isSatisfiedRequirementSetObject()) {
                    continue;
                  }
                  if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualThing(visTarget) && visTarget?.logicalElement.isSatisfiedRequirementSetObject()) {
                    continue;
                  }
                  objectOpl.push(this.generateFundamentalLinkOpl(cell));
                }
              } else if (!this.forbidden.includes(cell)) {
                objectOpl.push(this.generateDirectionalLinkOpl(cell));
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      const currentOpd = this.options.opmModel.currentOpd;
      const viewOpdOpl = [];
      if (currentOpd.isViewOpd) {
        const opdLevel = this.options.opmModel.currentOpd.getNumberedName();
        const fatherLevel = this.options.opmModel.getOpd(this.options.opmModel.currentOpd.parendId).getNumberedName();
        viewOpdOpl.push({
          opl: opdLevel + " is a view OPD, derived from " + fatherLevel + ".",
          cells: []
        });
      }
      const subModelsOpl = [];
      if (currentOpd.children.find(child => child.sharedOpdWithSubModelId)) {
        subModelsOpl.push(...this.generateFatherToSubModelOpl(options));
      }
      if (currentOpd.id === "SD" && this.options.opmModel.getAllBasicThings().find(l => l.belongsToFatherModelId)) {
        subModelsOpl.push(...this.generatesSubModelFromFatherOpl(options));
      }
      for (const item of [...objectOpl, ...processOpl]) {
        if (item.opl.endsWith(",</b></font><b>.</b>")) {
          item.opl = item.opl.replace(",</b></font><b>.</b>", "</b></font><b>.</b>");
        }
      }
      const oplSet = [...subModelsOpl, ...viewOpdOpl, ...inzoomOpl, ...unfoldOpl, ...objectOpl, ...processOpl, ...ArcsOpl];
      let index = 0;
      while (index < oplSet.length) {
        if (!oplSet[index] || oplSet[index].opl === "") {
          oplSet.splice(index, 1);
          continue;
        }
        const opl = oplSet[index];
        opl.id = index;
        opl.highlighted = false;
        index += 1;
      }
      return oplSet;
    },
    textOnly: false,
    options: undefined,
    forbidden: []
  };

  /***/
}),
/***/10390: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Gw: () => (/* binding */OplConfig),
    HP: () => (/* binding */OplDefaultConfig)

  });

  class OplConfig {}
  let OplEdxConfig = /*#__PURE__*/ /* unused pure expression or super */null && (() => {
    class OplEdxConfig {
      user() {
        return edxDefaultSettings.user;
      }
      organization() {
        return edxDefaultSettings.organization;
      }
      static #_ = (() => this.ɵfac = function OplEdxConfig_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || OplEdxConfig)();
      })();
      static #_2 = (() => this.ɵprov = /*@__PURE__*/i0.ɵɵdefineInjectable({
        token: OplEdxConfig,
        factory: OplEdxConfig.ɵfac
      }))();
    }
    return OplEdxConfig;
  })();
  let OplDefaultConfig = /*#__PURE__*/(() => {
    class OplDefaultConfig {
      user() {
        // than it updated from the settings of the user that are saved in the database,
        // if there are still undefined variables it should be taken from the org settings.
        let res = {};
        for (let key of Object.keys(opl_database /* .defaultSettings */.L6.user)) {
          res[key] = undefined;
        }
        return res;
      }
      organization() {
        return opl_database /* .defaultSettings */.L6.organization;
      }
      static #_ = (() => this.ɵfac = function OplDefaultConfig_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || OplDefaultConfig)();
      })();
      static #_2 = (() => this.ɵprov = /*@__PURE__*/angular_core /* ["ɵɵdefineInjectable"] */.jDH({
        token: OplDefaultConfig,
        factory: OplDefaultConfig.ɵfac
      }))();
    }
    return OplDefaultConfig;
  })();

  /***/
}),
/***/39917: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    BK: () => (/* binding */defaultMaxUsersEnabled),
    D0: () => (/* binding */defaultRosConnectionSettings),
    Jg: () => (/* binding */defaultPythonConnectionSettings),
    KT: () => (/* binding */defaultCalculationsServerSettings),
    NX: () => (/* binding */getValidationObject),
    Ri: () => (/* binding */defaultProcessStyleSettings),
    Tw: () => (/* binding */defaultTutorialMode),
    Ux: () => (/* binding */defaultAllowUsersConnectionSettings),
    XJ: () => (/* binding */defaultMySQLConnectionSettings),
    tv: () => (/* binding */defaultObjectStyleSettings),
    vr: () => (/* binding */OplService),
    xu: () => (/* binding */defaultMqttConnectionSettings),
    zV: () => (/* binding */defaultGraphDBConnectionSettings)

  });

  const defaultObjectStyleSettings = {
    font_size: 14,
    font: "Arial",
    text_color: "#000002",
    // was changed so color input would apply changes at first
    border_color: "#70E483",
    fill_color: "#fdffff" // was changed so color input would apply changes at first
  };
  const defaultProcessStyleSettings = {
    font_size: 14,
    font: "Arial",
    text_color: "#000002",
    // was changed so color input would apply changes at first
    border_color: "#3BC3FF",
    fill_color: "#fdffff" // was changed so color input would apply changes at first
  };
  const defaultPythonConnectionSettings = {
    server: "localhost",
    port: "8765"
  };
  const defaultMySQLConnectionSettings = {
    hostname: "localhost",
    port: "3306",
    username: "root",
    password: "1234",
    schema: "schema",
    ws_hostname: "localhost",
    ws_port: "5566"
  };
  const defaultGraphDBConnectionSettings = {
    graphdb_api: "bolt://localhost:7687",
    username: "neo4j",
    password: "opcloudNeo4j"
  };
  const defaultCalculationsServerSettings = {
    computingServerURL: "https://localhost:3000",
    computingServerCalculations: true
  };
  const defaultRosConnectionSettings = {
    server: "localhost",
    port: "3000"
  };
  const defaultMqttConnectionSettings = {
    server: "localhost",
    port: "9883"
  };
  const defaultAllowUsersConnectionSettings = true;
  const defaultTutorialMode = true;
  const defaultMaxUsersEnabled = false;
  const defaultArchiveDaysIntervalSettings = 30;
  let OplService = /*#__PURE__*/(() => {
    class OplService {
      // Boolean to indicate if present 'OPM Result' label instead of 'OPL'
      constructor(config) {
        this.config = config;
        this.orgOplSettings = Object.assign(config.organization());
        // this.setSettingsToUndefined(this.orgOplSettings); // to enable organization settings to be the settings if needed
        this.userOplSettings = config.user();
        this.updateDefaultSettings();
        // this.setSettingsToUndefined(this.userOplSettings); // to enable organization settings to be the settings if needed
        // this.updateDefaultSettings();
        this.oplOpen = true;
        this.oplSwitch = new rxjs__WEBPACK_IMPORTED_MODULE_6__ /* .Subject */.B();
        this.queryResultLabel = new rxjs__WEBPACK_IMPORTED_MODULE_6__ /* .Subject */.B();
        this.testingMode = false;
        this.areSettingsLoaded = false;
      }
      // private setSettingsToUndefined(settingsToSet){
      //   Object.keys(settingsToSet).forEach(key => settingsToSet[key] = undefined);
      // }
      updateUserSettings(settings) {
        const currProc = this;
        const clean = currProc.cleanOplSettings(settings);
        Object.keys(clean).forEach(key => {
          currProc.userOplSettings[key] = clean[key];
        });
        // Special handling for style settings: if style is in settings (even with null values),
        // explicitly reset to undefined style settings to clear user overrides when resetting to defaults
        if (settings.hasOwnProperty("style")) {
          // When resetting, settings.style contains { object: { font: null, ... }, ... }
          // (null is used instead of undefined because JSON.stringify removes undefined but preserves null)
          // We need to reset userOplSettings.style to undefined style settings
          // This ensures that org/system defaults are used instead of user overrides
          currProc.userOplSettings.style = this.getUndefinedStyleSettings();
        }
        // Special handling for connection settings: if connection is in settings (even with undefined values),
        // explicitly set it to clear user overrides when resetting to defaults
        if (settings.hasOwnProperty("connection")) {
          currProc.userOplSettings.connection = settings.connection;
        }
        currProc.updateDefaultSettings();
      }
      cleanOplSettings(settings) {
        const param = {};
        Object.keys(settings).forEach(function (key) {
          if (settings[key] !== undefined) {
            // param[key] = (key === 'essence') ? String(settings[key]) : settings[key];
            param[key] = settings[key];
          }
        });
        return param;
      }
      updateOrgSettings() {
        // const orgName = this.userS.user.userData.organization;
        this.removeDefaultTables();
        // this.orgS.updateOrganization(orgName, { 'defaultSettings': this.orgOplSettings });
        this.addDefaultTables();
        this.updateDefaultSettings();
      }
      /*
      updateUserSetings() {
        let thisProcess = this;
        Object.keys(this.userOplSettings).forEach(function (key) {
          if (thisProcess.userOplSettings[key] === undefined) {
            return;
          }
          let details = {};
          details[key] = thisProcess.userOplSettings[key];
          if (key === 'essence') {
            details[key] = thisProcess.essenceString(thisProcess.userOplSettings[key]);
          }
          //thisProcess.userS.updateDB(details);
        });
           this.updateDefaultSettings();
      }*/
      toggleOplNumbering() {
        this.userOplSettings.oplNumbering = !this.userOplSettings.oplNumbering;
      }
      areSettingsAlreadyLoaded() {
        var _this = this;
        return (0, C_Users_hanan_WebstormProjects_model_opcloud_client_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_7__ /* ["default"] */.A)(function* () {
          const that = _this;
          if (_this.areSettingsLoaded) {
            return Promise.resolve(true);
          } else {
            while (!_this.areSettingsLoaded) {
              yield configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.waitXms(100);
              if (that.areSettingsLoaded) {
                return Promise.resolve(true);
              }
            }
          }
        })();
      }
      loadOrgSettings(res) {
        const thisProcess = this;
        let resAtKey;
        if (res) {
          Object.keys(res).forEach(function (key) {
            // this field should be initialized
            // if (thisProcess.orgOplSettings[key] === undefined || thisProcess.orgOplSettings[key].length === 0 ) {
            // this if was removed to allow updating the organization according to the database, for example if it was changed.
            resAtKey = res[key] === undefined ? opl_database /* .defaultSettings */.L6.organization[key] : res[key]; // if the organization data is undefined
            if (key === "essence") {
              thisProcess.orgOplSettings[key] = thisProcess.convertEnum(resAtKey);
              return;
            }
            if (key === "oplTables") {
              let new_lans = {};
              for (const lan of Object.keys(resAtKey)) {
                if (opl_database /* .Languages */.AT.indexOf(lan) === -1) {
                  new_lans[lan] = resAtKey[lan];
                }
              }
              thisProcess.orgOplSettings.oplTables = new_lans;
              return;
            }
            // if the organization data includes some styling data
            if (key === "style") {
              thisProcess.handleOrganizationStyleKey(res);
            }
            if (key === "connection") {
              thisProcess.handleOrganizationConnectionKey(res);
            }
            if (key === "archive") {
              thisProcess.handleOrganizationArchiveKey(res);
            }
            if (key === "displayOpt") {
              thisProcess.orgOplSettings[key] = thisProcess.convertDisplayOptForBackwardCompatibility(resAtKey);
            } else if (key !== "style") {
              thisProcess.orgOplSettings[key] = resAtKey;
            }
            /* if the organization details didnt contain styling data, should be initialized the object style will
            not be undefined */
            if (thisProcess.orgOplSettings.style === undefined) {
              thisProcess.orgOplSettings.style = thisProcess.getUndefinedStyleSettings();
            }
            // }
          });
          // for organizations without those keys (for example, new organizations)
          if (thisProcess.orgOplSettings.style === undefined) {
            thisProcess.orgOplSettings.style = thisProcess.getUndefinedStyleSettings();
          }
          if (thisProcess.orgOplSettings.connection === undefined) {
            thisProcess.orgOplSettings.connection = thisProcess.getUndefinedConnectionSettings();
          }
          this.addDefaultTables();
        }
        this.updateDefaultSettings();
      }
      setDefaultTimeDurationUnitsDigits() {
        this.userOplSettings.timeDurationUnitsDigits = 2;
      }
      loadUserSettings(userData) {
        const Highlight_OPL_OPD_qnd_Spellcheck = {
          highlightOpl: true,
          highlightOpd: true
        };
        if (!userData) {
          userData = this.config.user();
          this.cloneDefaultSettings(userData);
          this.setUpdatedSettings(userData, Highlight_OPL_OPD_qnd_Spellcheck);
        }
        const thisProcess = this;
        Object.keys(thisProcess.userOplSettings).forEach(function (key) {
          // if this users field is not initialized yet
          if (thisProcess.userOplSettings[key] === undefined || thisProcess.userOplSettings[key].length === 0) {
            // for example, some of the users spellcheck value is initialized with an empty string, so it needs to be checked
            if (userData[key] === undefined || userData[key].length === 0) {
              // defaults settings of those fields
              switch (key) {
                case "syncOplcolorsFromOpd":
                  {
                    thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user[key];
                    break;
                  }
                case "timeDurationUnitsDigits":
                  {
                    thisProcess.setDefaultTimeDurationUnitsDigits();
                    break;
                  }
                case "numericComputationalDigits":
                  {
                    thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user.numericComputationalDigits;
                    break;
                  }
                case "displayedRecentModelsCount":
                  {
                    thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user.displayedRecentModelsCount;
                    break;
                  }
                case "Notes":
                  {
                    thisProcess.userOplSettings[key] = thisProcess.orgOplSettings.displayNotes;
                    break;
                  }
                case "navigatorEnabled":
                  {
                    if (userData.hasOwnProperty(key)) {
                      thisProcess.userOplSettings[key] = userData.navigatorEnabled;
                    } else {
                      thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user.navigatorEnabled;
                    }
                    break;
                  }
                case "chatEnabled":
                  {
                    if (userData.hasOwnProperty(key)) {
                      thisProcess.userOplSettings[key] = userData.chatEnabled;
                    } else {
                      thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user.chatEnabled;
                    }
                    break;
                  }
                case "pythonExecution":
                  {
                    if (userData.hasOwnProperty(key)) {
                      thisProcess.userOplSettings[key] = userData.pythonExecution;
                    } else {
                      thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user.pythonExecution;
                    }
                    break;
                  }
                case "thingsSizing":
                  {
                    thisProcess.userOplSettings[key] = "Automatic";
                    break;
                  }
                case "opdTreeProcessesAutoArrangement":
                  {
                    thisProcess.userOplSettings[key] = opl_database /* .defaultSettings */.L6.user.opdTreeProcessesAutoArrangement;
                  }
                case "spellCheck":
                case "highlightOpd":
                case "highlightOpl":
                  {
                    thisProcess.setUpdatedSettings(thisProcess.userOplSettings, Highlight_OPL_OPD_qnd_Spellcheck, key);
                    break;
                  }
                default:
                  if (thisProcess.orgOplSettings.hasOwnProperty(key) && thisProcess.orgOplSettings[key] !== undefined) {
                    thisProcess.userOplSettings[key] = thisProcess.orgOplSettings[key];
                  }
                  return;
              }
            } else if (key === "essence") {
              thisProcess.userOplSettings[key] = thisProcess.convertEnum(userData[key]);
            } else if (key === "displayOpt") {
              thisProcess.userOplSettings[key] = thisProcess.convertDisplayOptForBackwardCompatibility(userData[key]);
            } else if (key === "thingsSizing") {
              const v = userData[key];
              thisProcess.userOplSettings[key] = v === "Manual" || v === "Automatic" ? v : opl_database /* .defaultSettings */.L6.user.thingsSizing;
            } else {
              thisProcess.userOplSettings[key] = userData[key];
            }
          }
        });
        // For left pane display of chat
        thisProcess.options.showNavigator = thisProcess.userOplSettings.navigatorEnabled;
        // For left pane display of chat
        thisProcess.options.showChatPanel = thisProcess.userOplSettings.chatEnabled;
        // For executing computational process of Python locally or with web socket
        thisProcess.options.pythonExecution = thisProcess.userOplSettings.pythonExecution;
        // For draggable things search autocomplete
        thisProcess.options.draggableAutocomplete = thisProcess.userOplSettings.dragSearchAuto;
        // For halo toggle default mode
        thisProcess.options.haloDefaultMode = thisProcess.userOplSettings.haloDefaultMode;
        thisProcess.options.defaultHalo = thisProcess.options.haloDefaultMode;
        // Things auto-resize default (per user OPCloud Settings)
        const sizing = thisProcess.userOplSettings.thingsSizing;
        thisProcess.options.automaticResizing = sizing !== "Manual";
        thisProcess.options.showGrid = thisProcess.userOplSettings.gridSettings.state;
        thisProcess.options.toggleGrid(false);
        thisProcess.options.toggleGrid(false);
        // if there was no user style data in the db
        if (thisProcess.userOplSettings.style === undefined) {
          this.loadUserStyleSettings(userData);
        }
        // if there was no user connection data in the db
        if (thisProcess.userOplSettings.connection === undefined) {
          this.loadUserConnectionSettings(userData);
        }
        this.userOplSettings.validationTime = userData.validationTime ? userData.validationTime : 0;
        this.userOplSettings.validationEnforcementLevel = userData.validationEnforcementLevel ? userData.validationEnforcementLevel : 0;
        this.model.model.validation = this.getValidationSettings();
        this.updateDefaultSettings();
        thisProcess.options.setLeftBarWindowsSizes({});
      }
      addDefaultsToUndefined(defaults, obj) {
        Object.keys(defaults).forEach(function (key) {
          if (obj[key] === undefined) {
            obj[key] = defaults[key];
          }
        });
      }
      convertDisplayOptForBackwardCompatibility(sentence) {
        switch (sentence) {
          case opl_database /* .DisplayOpt */.A_[0]:
            return opl_database /* .DisplayOpt */.A_[0];
          case opl_database /* .DisplayOpt */.A_[1]:
            return opl_database /* .DisplayOpt */.A_[1];
          case opl_database /* .DisplayOpt */.A_[2]:
            return opl_database /* .DisplayOpt */.A_[2];
          case "Show OPL for all Things":
            return opl_database /* .DisplayOpt */.A_[0];
          case "Show OPL only for non-default Things":
            return opl_database /* .DisplayOpt */.A_[1];
        }
      }
      generateOpl(options = this.options) {
        let opl = opl_functions /* .oplGenerating */.u.generateOPL(options);
        return this.addGrammer(opl);
      }
      generateOplTextOnly(options = this.options) {
        if (!this.testingMode) {
          opl_functions /* .oplGenerating */.u.textOnly = true;
        }
        const opl = opl_functions /* .oplGenerating */.u.generateOPL(options);
        opl_functions /* .oplGenerating */.u.textOnly = false;
        return opl;
      }
      addGrammer(opl) {
        if (opl_database /* .oplDefaultSettings */.iT.language === "en") {
          for (let i in opl) {
            opl[i].opl = opl_functions /* .oplFunctions */.v.addCapital(opl[i].opl);
          }
        }
        return opl;
      }
      generateOplSpec() {}
      updateDefaultSettings() {
        const thisProcess = this;
        if (typeof thisProcess.orgOplSettings === "object") {
          Object.keys(thisProcess.orgOplSettings).forEach(function (key) {
            opl_database /* .oplDefaultSettings */.iT[key] = thisProcess.orgOplSettings[key];
          });
        }
        if (typeof thisProcess.userOplSettings === "object") {
          Object.keys(thisProcess.userOplSettings).forEach(function (key) {
            if (thisProcess.userOplSettings[key] !== undefined) {
              opl_database /* .oplDefaultSettings */.iT[key] = thisProcess.userOplSettings[key];
            }
          });
        }
        (0, opl_database /* .updateTemplates */.D8)();
      }
      getAvailableLanguages() {
        if (this.orgOplSettings.oplTables) {
          return Object.keys(this.orgOplSettings.oplTables);
        }
      }
      getOplTable(lan = null) {
        let oplTable = null;
        if (lan) {
          oplTable = this.orgOplSettings.oplTables[lan];
        } else {
          oplTable = opl_database /* .oplTemplates */.XD;
        }
        return JSON.parse(JSON.stringify(oplTable));
      }
      generateAllOpl(graphService) {
        const arrOfAllOpl = new Array();
        const allOpd = this.options.opmModel.opds;
        // This loop goes over all OPDs and inserts the OPL sentences to the arrays.
        for (let i = 0; i < allOpd.length; i++) {
          const graph = graphService.renderGraphSilent(allOpd[i]); // Goes to the next OPD in the allOpd array.
          const options = {
            graph: graph,
            opmModel: this.options
          };
          const cells = this.generateOplTextOnly(); // YANG's function
          // This loop goes over all of the cells and inserts the OPL sentences to the arrays.
          for (let j = 0; j < cells.length; j++) {
            if (cells[j].opl) {
              // Check if the cell contains an OPL sentence.
              // Get the OPL sentence of the cell.
              const innerHTML = cells[j].opl;
              if (!arrOfAllOpl.includes(innerHTML)) {
                arrOfAllOpl.push(innerHTML); /// Insert the OPL sentence into the arrOfAllOpl array.
              }
            }
          }
        }
        if (this.testingMode) {
          return arrOfAllOpl.map(sent => sent.replace(/<\/?[^>]+>/ig, ""));
        }
        return arrOfAllOpl;
      }
      essenceEnum(e) {
        if (e === "Physical") {
          return models_ConfigurationOptions /* .Essence */.tg.Physical;
        }
        if (e === "Informatical") {
          return models_ConfigurationOptions /* .Essence */.tg.Informatical;
        }
      }
      essenceString(e) {
        if (e === models_ConfigurationOptions /* .Essence */.tg.Informatical) {
          return "Informatical";
        }
        if (e === models_ConfigurationOptions /* .Essence */.tg.Physical) {
          return "Physical";
        }
        console.log("ERROR: ", e);
      }
      addDefaultTables() {
        if (this.orgOplSettings.oplTables === undefined) {
          this.orgOplSettings.oplTables = {};
        }
        for (const lan of opl_database /* .Languages */.AT) {
          this.orgOplSettings.oplTables[lan] = opl_database /* .OplTables */.Nj[lan];
        }
      }
      removeDefaultTables() {
        for (const lan of opl_database /* .Languages */.AT) {
          if (this.orgOplSettings.oplTables[lan] !== undefined) {
            delete this.orgOplSettings.oplTables[lan];
          }
        }
      }
      fromStringToEnum(s) {
        if (s === "0") {
          return 0;
        }
        if (s === "1") {
          return 1;
        }
        console.log("Error", s);
      }
      createSysDict(options) {
        const logicalElements = options.opmModel.logicalElements;
        const sysDict = {}; // create new system dictionary
        const lan = opl_database /* .oplDefaultSettings */.iT.language; // current language in use
        for (const e of logicalElements) {
          // go over all logical elements and add in system dictionary
          sysDict[e.text] = {};
          sysDict[e.text][lan] = e.text;
        }
      }
      // @ts-ignore
      get settings() {
        return this.userOplSettings;
      }
      /*receives settings object to update, settings object to update according to, an optional key if only one key should be updated */
      setUpdatedSettings(setting_to_update, settings_update_according, certainKey) {
        if (settings_update_according) {
          Object.keys(settings_update_according).forEach(function (key) {
            if (certainKey === undefined || key === certainKey) {
              if (setting_to_update.hasOwnProperty(key)) {
                if (settings_update_according[key] !== undefined && (setting_to_update[key] === undefined || setting_to_update[key].length === 0)) {
                  setting_to_update[key] = settings_update_according[key];
                }
              }
            }
          });
        }
      }
      /*receives a value of essence field in OPL setting and returns true if this is a legal value (currently, 0 or 1), false otherwise*/
      legalEssenceNumValue(val) {
        return val === 0 || val === 1;
      }
      /*receives a value of essence field in OPL setting and return the Essence Field according.
      * converts from string to essence enum if necessary. if enumParam is a number but not Essence legal value,
      * default is physical */
      convertEnum(enumParam) {
        if (typeof enumParam === "string") {
          return this.fromStringToEnum(enumParam);
        }
        if (typeof enumParam === "number") {
          if (this.legalEssenceNumValue(enumParam)) {
            return enumParam;
          } else {
            // should not get here
            return 0;
          }
        } else {
          console.log("Error", enumParam);
        }
      }
      /**returns organization opl settings**/
      // @ts-ignore
      get orgSettings() {
        return this.orgOplSettings;
      }
      /**
       * makes sure the local version of the organization object and process style settings will have all the keys, even if they are
       * undefined to prevent a reference to non existing keys
       **/
      handleOrganizationStyleKey(res) {
        // thisProcess.orgOplSettings.style should be defined
        this.orgOplSettings.style = this.getUndefinedStyleSettings();
        // set the object style settings which are not undefined
        if (res.style.object) {
          this.loadOrgObjectStyleSettings(res.style.object);
        }
        // set the process style settings which are not undefined
        if (res.style.process) {
          this.loadOrgProcessStyleSettings(res.style.process);
        }
        // set the state style settings which are not undefined
        if (res.style.state) {
          this.loadOrgStateStyleSettings(res.style.state);
        }
      }
      /**
       * updating current styling related settings according to current user. if doesnot exist- according to default
       * settings.* */
      userStylingSettings() {
        let objectStyleSettings = this.getObjectStyleDefaultSettings();
        let processStyleSettings = this.getProcessStyleDefaultSettings();
        let stateStyleSettings = this.getStateStyleDefaultSettings();
        this.updateUserObjectStyleSettings(objectStyleSettings);
        this.updateUserProcessStyleSettings(processStyleSettings);
        this.updateUserStateStyleSettings(stateStyleSettings);
        return {
          object: objectStyleSettings,
          process: processStyleSettings,
          state: stateStyleSettings
        };
      }
      /**
       * updating current styling related settings according to current organization. if doesnot exist- according to default
       * settings.* */
      orgStylingSettings() {
        let objectStyleSettings = this.getObjectStyleDefaultSettings();
        let processStyleSettings = this.getProcessStyleDefaultSettings();
        let stateStyleSettings = this.getStateStyleDefaultSettings();
        this.updateOrganizationStyleSettings(objectStyleSettings, "object");
        this.updateOrganizationStyleSettings(processStyleSettings, "process");
        this.updateOrganizationStyleSettings(stateStyleSettings, "state");
        return {
          object: objectStyleSettings,
          process: processStyleSettings,
          state: stateStyleSettings
        };
      }
      /**returns an object with default object style settings**/
      getObjectStyleDefaultSettings() {
        const objectStyleSettings = {
          font_size: defaultObjectStyleSettings.font_size,
          font: defaultObjectStyleSettings.font,
          text_color: defaultObjectStyleSettings.text_color,
          border_color: defaultObjectStyleSettings.border_color,
          fill_color: defaultObjectStyleSettings.fill_color
        };
        return objectStyleSettings;
      }
      getStateStyleDefaultSettings() {
        const stateStyleSettings = {
          font_size: models_Defaults_style /* .defaultStateStyleSettings */.B.font_size,
          font: models_Defaults_style /* .defaultStateStyleSettings */.B.font,
          text_color: models_Defaults_style /* .defaultStateStyleSettings */.B.text_color,
          border_color: models_Defaults_style /* .defaultStateStyleSettings */.B.border_color,
          fill_color: models_Defaults_style /* .defaultStateStyleSettings */.B.fill_color
        };
        return stateStyleSettings;
      }
      /**returns an object with default process style settings, as declared in opl service**/
      getProcessStyleDefaultSettings() {
        const processStyleSettings = {
          font_size: defaultProcessStyleSettings.font_size,
          font: defaultProcessStyleSettings.font,
          text_color: defaultProcessStyleSettings.text_color,
          border_color: defaultProcessStyleSettings.border_color,
          fill_color: defaultProcessStyleSettings.fill_color
        };
        return processStyleSettings;
      }
      /**
       * updates styleSettings object by this order: default settings->organization settings->user settings
       * */
      updateUserObjectStyleSettings(styleSettings) {
        const thisProc = this;
        Object.keys(defaultObjectStyleSettings).forEach(function (key) {
          styleSettings[key] = thisProc.settings.style && thisProc.settings.style.object && thisProc.settings.style.object[key] ? thisProc.settings.style.object[key] : thisProc.orgSettings.style && thisProc.orgSettings.style.object && thisProc.orgSettings.style.object[key] ? thisProc.orgSettings.style.object[key] : styleSettings[key];
        });
      }
      /**
       * updates styleSettings process by this order: default settings->organization settings->user settings
       * */
      updateUserProcessStyleSettings(styleSettings) {
        const thisProc = this;
        Object.keys(defaultObjectStyleSettings).forEach(function (key) {
          styleSettings[key] = thisProc.settings.style && thisProc.settings.style.process && thisProc.settings.style.process[key] ? thisProc.settings.style.process[key] : thisProc.orgSettings.style && thisProc.orgSettings.style.process && thisProc.orgSettings.style.process[key] ? thisProc.orgSettings.style.process[key] : styleSettings[key];
        });
      }
      updateUserStateStyleSettings(styleSettings) {
        const thisProc = this;
        Object.keys(models_Defaults_style /* .defaultStateStyleSettings */.B).forEach(function (key) {
          styleSettings[key] = thisProc.settings.style && thisProc.settings.style.state && thisProc.settings.style.state[key] ? thisProc.settings.style.state[key] : thisProc.orgSettings.style && thisProc.orgSettings.style.state && thisProc.orgSettings.style.state[key] ? thisProc.orgSettings.style.state[key] : styleSettings[key];
        });
      }
      /**
       * updates organization styleSettings object/process(according to given type) by this order: default settings->organization settings
       * */
      updateOrganizationStyleSettings(objectStyleSettings, type) {
        const thisProc = this;
        Object.keys(defaultObjectStyleSettings).forEach(function (key) {
          objectStyleSettings[key] = thisProc.orgSettings.style && thisProc.orgSettings.style[type] && thisProc.orgSettings.style[type][key] ? thisProc.orgSettings.style[type][key] : objectStyleSettings[key];
        });
      }
      /**
       * returns an style object with StyleSettings properties for object and process, undefined.
       * this was in order to allow the flow of settings:
       * later on, if it will be overridden by organization/user settings.
       * **/
      getUndefinedStyleSettings() {
        // Use null instead of undefined because JSON.stringify removes undefined values
        // but preserves null, allowing the backend to detect and delete these fields
        const emptyStyleSettings1 = {
          font_size: null,
          font: null,
          text_color: null,
          border_color: null,
          fill_color: null
        };
        const emptyStyleSettings2 = {
          font_size: null,
          font: null,
          text_color: null,
          border_color: null,
          fill_color: null
        };
        const emptyStyleSettings3 = {
          font_size: null,
          font: null,
          text_color: null,
          border_color: null,
          fill_color: null
        };
        // two objects needed so they wont both be a refrence to the same object.
        return {
          object: emptyStyleSettings1,
          process: emptyStyleSettings2,
          state: emptyStyleSettings3
        };
      }
      /*receiving organization object style settings from the db and update local settings according */
      loadOrgObjectStyleSettings(resAtKey_object) {
        const thisProc = this;
        Object.keys(resAtKey_object).forEach(function (key) {
          if (resAtKey_object[key]) {
            thisProc.orgOplSettings.style.object[key] = resAtKey_object[key];
          }
        });
      }
      /*receiving organization process style settings from the db and update local settings according */
      loadOrgProcessStyleSettings(resAtKey_process) {
        const thisProc = this;
        Object.keys(resAtKey_process).forEach(function (key) {
          if (resAtKey_process[key]) {
            thisProc.orgOplSettings.style.process[key] = resAtKey_process[key];
          }
        });
      }
      loadOrgStateStyleSettings(resAtKey_state) {
        const thisProc = this;
        Object.keys(resAtKey_state).forEach(function (key) {
          if (resAtKey_state[key]) {
            thisProc.orgOplSettings.style.state[key] = resAtKey_state[key];
          }
        });
      }
      /*receiving user object style settings from the db and update local settings according */
      loadUserObjectStyleSettings(resAtKey_object) {
        const thisProc = this;
        Object.keys(resAtKey_object).forEach(function (key) {
          if (resAtKey_object[key]) {
            thisProc.userOplSettings.style.object[key] = resAtKey_object[key];
          }
        });
      }
      /*receiving organization process style settings from the db and update local settings according */
      loadUserProcessStyleSettings(resAtKey_process) {
        const thisProc = this;
        Object.keys(resAtKey_process).forEach(function (key) {
          if (resAtKey_process[key]) {
            thisProc.userOplSettings.style.process[key] = resAtKey_process[key];
          }
        });
      }
      loadUserStateStyleSettings(resAtKey_state) {
        const thisProc = this;
        Object.keys(resAtKey_state).forEach(function (key) {
          if (resAtKey_state[key]) {
            thisProc.userOplSettings.style.state[key] = resAtKey_state[key];
          }
        });
      }
      /**
       * loading user style settings according to the given userData (which is from the db, or default settings otherwise)
       * */
      loadUserStyleSettings(userData) {
        this.userOplSettings.style = this.getUndefinedStyleSettings();
        // set the object style settings which are not undefined
        if (userData && userData.style && userData.style.object) {
          this.loadUserObjectStyleSettings(userData.style.object);
        }
        // set the process style settings which are not undefined
        if (userData && userData.style && userData.style.process) {
          this.loadUserProcessStyleSettings(userData.style.process);
        }
        // set the state style settings which are not undefined
        if (userData && userData.style && userData.style.state) {
          this.loadUserStateStyleSettings(userData.style.state);
        }
      }
      /**
       * loading user connection settings according to the given userData (which is from the db, or default settings otherwise)
       * */
      loadUserConnectionSettings(userData) {
        this.userOplSettings.connection = this.getUndefinedConnectionSettings();
        // set the ros connection settings which are not undefined
        if (userData && userData.connection && userData.connection.ros) {
          this.loadUserRosConnectionSettings(userData.connection.ros);
        }
        // set the mqtt connection settings which are not undefined
        if (userData && userData.connection && userData.connection.mqtt) {
          this.loadUserMqttConnectionSettings(userData.connection.mqtt);
        }
        // set the mysql connection settings which are not undefined
        if (userData && userData.connection && userData.connection.mysql) {
          this.loadUserMySQLConnectionSettings(userData.connection.mysql);
        }
        // set the mysql connection settings which are not undefined
        if (userData && userData.connection && userData.connection.graphdb) {
          this.loadUserGraphDBConnectionSettings(userData.connection.graphdb);
        }
        if (userData && userData.connection && userData.connection.calculationsServer) {
          this.loadUserCalculationsServerConnectionSettings(userData.connection.calculationsServer);
        }
      }
      /**
       * Loading user mysql connection settings to local user settings according to given data from db
       * */
      loadUserMySQLConnectionSettings(resAtKey_mysql) {
        const thisProc = this;
        Object.keys(resAtKey_mysql).forEach(function (key) {
          if (resAtKey_mysql[key] !== undefined && resAtKey_mysql[key] !== null) {
            thisProc.userOplSettings.connection.mysql[key] = resAtKey_mysql[key];
          }
        });
      }
      /**
       * Loading GraphDB connection settings to local user settings according to given data from db
       * */
      loadUserGraphDBConnectionSettings(resAtKey_graphdb) {
        const thisProc = this;
        Object.keys(resAtKey_graphdb).forEach(function (key) {
          if (resAtKey_graphdb[key] !== undefined && resAtKey_graphdb[key] !== null) {
            thisProc.userOplSettings.connection.mysql[key] = resAtKey_graphdb[key];
          }
        });
      }
      loadUserCalculationsServerConnectionSettings(settings) {
        const thisProc = this;
        Object.keys(settings).forEach(function (key) {
          if (settings[key] !== undefined && settings[key] !== null) {
            thisProc.userOplSettings.connection.calculationsServer[key] = settings[key];
          }
        });
      }
      /**
       * Loading user ros connection settings to local user settings according to given data from db
       * */
      loadUserRosConnectionSettings(resAtKey_ros) {
        const thisProc = this;
        Object.keys(resAtKey_ros).forEach(function (key) {
          if (resAtKey_ros[key] !== undefined && resAtKey_ros[key] !== null) {
            thisProc.userOplSettings.connection.ros[key] = resAtKey_ros[key];
          }
        });
      }
      /**
       * Loading user mqtt connection settings to local user settings according to given data from db
       * */
      loadUserMqttConnectionSettings(resAtKey_mqtt) {
        const thisProc = this;
        Object.keys(resAtKey_mqtt).forEach(function (key) {
          if (resAtKey_mqtt[key] !== undefined && resAtKey_mqtt[key] !== null) {
            thisProc.userOplSettings.connection.mqtt[key] = resAtKey_mqtt[key];
          }
        });
      }
      /**
       * initializing userData to be default settings without making userData a reference of defaults settings.
       * **/
      cloneDefaultSettings(userData) {
        Object.keys(userData).forEach(key => function () {
          userData[key] = opl_database /* .defaultSettings */.L6.organization.hasOwnProperty(key) ? opl_database /* .defaultSettings */.L6.organization[key] : opl_database /* .defaultSettings */.L6.user[key];
        });
      }
      /**
       * gets the current organization connection (type parameter can be ros or mqtt) settings, from the db (considers only
       * the defined data from the db)
       **/
      loadOrgConnectionSettings(resAtKey_process, type) {
        const thisProc = this;
        Object.keys(resAtKey_process).forEach(function (key) {
          if (resAtKey_process[key]) {
            thisProc.orgOplSettings.connection[type][key] = resAtKey_process[key];
          }
        });
      }
      /**
       * returns an object that represents the current user connection settings
       **/
      userConnectionSettings() {
        const rosConnectionSettings = this.getRosConnectionDefaultSettings();
        const mqttConnectionSettings = this.getMqttConnectionDefaultSettings();
        const pythonConnectionSettings = this.getPythonConnectionDefaultSettings();
        const mySQLConnectionSettings = this.getMySQLConnectionDefaultSettings();
        const graphDBConnectionSettings = this.getGraphDBConnectionDefaultSettings();
        const calculationsServerSettings = this.getComputingServerConnectionDefaultSettings();
        const allow_usersConnectionSettings = this.allow_users;
        this.updateUserRosConnectionSettings(rosConnectionSettings, allow_usersConnectionSettings);
        this.updateUserMqttConnectionSettings(mqttConnectionSettings, allow_usersConnectionSettings);
        this.updateUserPythonConnectionSettings(pythonConnectionSettings, allow_usersConnectionSettings);
        this.updateUserMySQLConnectionSettings(mySQLConnectionSettings, allow_usersConnectionSettings);
        this.updateUserGraphDBConnectionSettings(graphDBConnectionSettings, allow_usersConnectionSettings);
        this.updateUserServerCalculationsSettings(calculationsServerSettings, allow_usersConnectionSettings);
        return {
          ros: rosConnectionSettings,
          mqtt: mqttConnectionSettings,
          python: pythonConnectionSettings,
          mysql: mySQLConnectionSettings,
          graphdb: graphDBConnectionSettings,
          calculationsServer: calculationsServerSettings,
          allow_users: allow_usersConnectionSettings
        };
      }
      /**
       * updates the given ros user connectionSettings according to the following order:
       * 1. if the user defined the settings for them self, take it.
       * 2. if not- try the organization settings.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateUserPythonConnectionSettings(connectionSettings, allow_users) {
        const thisProc = this;
        Object.keys(defaultPythonConnectionSettings).forEach(function (key) {
          connectionSettings[key] = allow_users === true && thisProc.settings.connection && thisProc.settings.connection.python && thisProc.settings.connection.python[key] !== undefined ? thisProc.settings.connection.python[key] : thisProc.orgSettings.connection && thisProc.orgSettings.connection.python && thisProc.orgSettings.connection.python[key] !== undefined ? thisProc.orgSettings.connection.python[key] : connectionSettings[key];
        });
      }
      /**
       * updates the given MySQL user connectionSettings according to the following order:
       * 1. if the user defined the settings for them self, take it.
       * 2. if not- try the organization settings.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateUserMySQLConnectionSettings(connectionSettings, allow_users) {
        const thisProc = this;
        Object.keys(defaultMySQLConnectionSettings).forEach(function (key) {
          connectionSettings[key] = allow_users === true && thisProc.settings.connection && thisProc.settings.connection.mysql && thisProc.settings.connection.mysql[key] !== undefined ? thisProc.settings.connection.mysql[key] : connectionSettings[key];
        });
      }
      /**
       * updates the given GraphDB (currently NEO4J) connectionSettings according to the following order:
       * 1. if the user defined the settings for them self, take it.
       * 2. if the organization settings are also not defined, take the default settings
       **/
      updateUserGraphDBConnectionSettings(connectionSettings, allow_users) {
        const thisProc = this;
        Object.keys(defaultGraphDBConnectionSettings).forEach(function (key) {
          connectionSettings[key] = allow_users === true && thisProc.settings.connection && thisProc.settings.connection.graphdb && thisProc.settings.connection.graphdb[key] !== undefined ? thisProc.settings.connection.graphdb[key] : connectionSettings[key];
        });
      }
      /**
       * updates the given ros user connectionSettings according to the following order:
       * 1. if the user defined the settings for them self, take it.
       * 2. if not- try the organization settings.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateUserRosConnectionSettings(connectionSettings, allow_users) {
        const thisProc = this;
        Object.keys(defaultRosConnectionSettings).forEach(function (key) {
          connectionSettings[key] = allow_users === true && thisProc.settings.connection && thisProc.settings.connection.ros && thisProc.settings.connection.ros[key] !== undefined ? thisProc.settings.connection.ros[key] : thisProc.orgSettings.connection && thisProc.orgSettings.connection.ros && thisProc.orgSettings.connection.ros[key] !== undefined ? thisProc.orgSettings.connection.ros[key] : connectionSettings[key];
        });
      }
      /**
       * updates the given mqtt user connectionSettings according to the following order:
       * 1. if the user defined the settings for them self, take it.
       * 2. if not- try the organization settings.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateUserMqttConnectionSettings(connectionSettings, allow_users) {
        const thisProc = this;
        Object.keys(defaultMqttConnectionSettings).forEach(function (key) {
          connectionSettings[key] = allow_users === true && thisProc.settings.connection && thisProc.settings.connection.mqtt && thisProc.settings.connection.mqtt[key] !== undefined ? thisProc.settings.connection.mqtt[key] : thisProc.orgSettings.connection && thisProc.orgSettings.connection.mqtt && thisProc.orgSettings.connection.mqtt[key] !== undefined ? thisProc.orgSettings.connection.mqtt[key] : connectionSettings[key];
        });
      }
      /**
       * returns the current organization connection details
       **/
      orgConnectionSettings() {
        const rosConnectionSettings = this.getRosConnectionDefaultSettings();
        const mqttConnectionSettings = this.getMqttConnectionDefaultSettings();
        const pythonConnectionSettings = this.getPythonConnectionDefaultSettings();
        const mysqlConnectionSettings = this.getMySQLConnectionDefaultSettings();
        const graphDBConnectionSettings = this.getGraphDBConnectionDefaultSettings();
        const calculationsServerSettings = this.getComputingServerConnectionDefaultSettings();
        const allow_usersConnectionSettings = this.allow_users;
        this.updateOrganizationConnectionSettings(rosConnectionSettings, "ros");
        this.updateOrganizationConnectionSettings(mqttConnectionSettings, "mqtt");
        this.updateOrganizationConnectionSettings(pythonConnectionSettings, "python");
        this.updateOrganizationConnectionSettings(mysqlConnectionSettings, "mysql");
        this.updateOrganizationGraphDBConnectionSettings(graphDBConnectionSettings, "graphdb");
        this.updateOrganizationCalculationsServerConnectionSettings(calculationsServerSettings, "calculationsServer");
        return {
          ros: rosConnectionSettings,
          mqtt: mqttConnectionSettings,
          python: pythonConnectionSettings,
          mysql: mysqlConnectionSettings,
          graphdb: graphDBConnectionSettings,
          allow_users: allow_usersConnectionSettings,
          calculationsServer: calculationsServerSettings
        };
      }
      /**
       * makes sure the local version of the organization ros and mqtt settings will have all the keys, even if they are
       * undefined to prevent a reference to non existing keys
       **/
      handleOrganizationConnectionKey(res) {
        // thisProcess.orgOplSettings.connection should be defined
        this.orgOplSettings.connection = this.getUndefinedConnectionSettings();
        // set the Python connections settings which are not undefined
        if (res.connection.python) {
          this.loadOrgConnectionSettings(res.connection.python, "python");
        }
        // set the MySQL connections settings which are not undefined
        if (res.connection.mysql) {
          this.loadOrgConnectionSettings(res.connection.mysql, "mysql");
        }
        // set the ros connections settings which are not undefined
        if (res.connection.ros) {
          this.loadOrgConnectionSettings(res.connection.ros, "ros");
        }
        // set the mqtt connections settings which are not undefined
        if (res.connection.mqtt) {
          this.loadOrgConnectionSettings(res.connection.mqtt, "mqtt");
        }
        // set the graphdb connections settings which are not undefined
        if (res.connection.graphdb) {
          this.loadOrgConnectionSettings(res.connection.graphdb, "graphdb");
        }
        // set the calculationsServer connections settings which are not undefined
        if (res.connection.calculationsServer) {
          this.loadOrgConnectionSettings(res.connection.calculationsServer, "calculationsServer");
        }
        // set the allow_users settings which are not undefined
        if (res.connection.allow_users !== undefined) {
          this.orgOplSettings.connection.allow_users = res.connection.allow_users;
        }
      }
      /**
       * returns undefined version of the connection object
       * */
      getUndefinedConnectionSettings() {
        const emptyPythonSettings = {
          server: undefined,
          port: undefined
        };
        const emptyMySQLSettings = {
          hostname: undefined,
          port: undefined,
          username: undefined,
          password: undefined,
          ws_hostname: undefined,
          ws_port: undefined
        };
        const emptyGraphDBSettings = {
          graphdb_api: undefined,
          username: undefined,
          password: undefined
        };
        const emptyRosSettings = {
          server: undefined,
          port: undefined
        };
        const emptyMqttSettings = {
          server: undefined,
          port: undefined
        };
        const emptyCalculationsServerConnectionsSettings = {
          computingServerURL: undefined,
          computingServerCalculations: undefined
        };
        // two objects needed so they won't both be a reference to the same object.
        return {
          ros: emptyRosSettings,
          mqtt: emptyMqttSettings,
          python: emptyPythonSettings,
          mysql: emptyMySQLSettings,
          graphdb: emptyGraphDBSettings,
          calculationsServer: emptyCalculationsServerConnectionsSettings,
          allow_users: undefined
        };
      }
      /**
       * updates the given organization connection Settings according to the following order:
       * 2. if the organization settings are defined- take it.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateOrganizationConnectionSettings(connectionSettings, type) {
        const thisProc = this;
        Object.keys(defaultRosConnectionSettings).forEach(function (key) {
          connectionSettings[key] = thisProc.orgSettings.connection && thisProc.orgSettings.connection[type] && thisProc.orgSettings.connection[type][key] !== undefined ? thisProc.orgSettings.connection[type][key] : connectionSettings[key];
        });
      }
      /**
       * updates the given organization connection Settings according to the following order:
       * 2. if the organization settings are defined- take it.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateOrganizationGraphDBConnectionSettings(graphDBConnectionSettings, type) {
        const thisProc = this;
        Object.keys(defaultGraphDBConnectionSettings).forEach(function (key) {
          graphDBConnectionSettings[key] = thisProc.orgSettings.connection && thisProc.orgSettings.connection[type] && thisProc.orgSettings.connection[type][key] !== undefined ? thisProc.orgSettings.connection[type][key] : graphDBConnectionSettings[key];
        });
      }
      /**
       * updates the given organization connection Settings according to the following order:
       * 2. if the organization settings are defined- take it.
       * 3. if the organization settings are also not defined, take the default settings
       **/
      updateOrganizationCalculationsServerConnectionSettings(calculationsServerSettings, type) {
        const thisProc = this;
        Object.keys(defaultCalculationsServerSettings).forEach(function (key) {
          calculationsServerSettings[key] = thisProc.orgSettings.connection && thisProc.orgSettings.connection[type] && thisProc.orgSettings.connection[type][key] !== undefined ? thisProc.orgSettings.connection[type][key] : calculationsServerSettings[key];
        });
      }
      /**
       * returns an object with default ros connection settings
       **/
      getPythonConnectionDefaultSettings() {
        const pythonConnectionSettings = {
          server: defaultPythonConnectionSettings.server,
          port: defaultPythonConnectionSettings.port
        };
        return pythonConnectionSettings;
      }
      /**
       * returns an object with default MySQL connection settings
       **/
      getMySQLConnectionDefaultSettings() {
        const mySQLConnectionSettings = {
          hostname: defaultMySQLConnectionSettings.hostname,
          port: defaultMySQLConnectionSettings.port,
          username: defaultMySQLConnectionSettings.username,
          password: defaultMySQLConnectionSettings.password,
          schema: defaultMySQLConnectionSettings.schema,
          ws_port: defaultMySQLConnectionSettings.ws_port,
          ws_hostname: defaultMySQLConnectionSettings.ws_hostname
        };
        return mySQLConnectionSettings;
      }
      /**
       * returns an object with default GraphDB connection settings
       **/
      getGraphDBConnectionDefaultSettings() {
        const graphDBConnectionSettings = {
          graphdb_api: defaultGraphDBConnectionSettings.graphdb_api,
          username: defaultGraphDBConnectionSettings.username,
          password: defaultGraphDBConnectionSettings.password
        };
        return graphDBConnectionSettings;
      }
      /**
       * returns an object with default Computing Server connection settings
       **/
      getComputingServerConnectionDefaultSettings() {
        const calculationsServerSettings = {
          computingServerURL: defaultCalculationsServerSettings.computingServerURL,
          computingServerCalculations: defaultCalculationsServerSettings.computingServerCalculations
        };
        return calculationsServerSettings;
      }
      /**
       * returns an object with default ros connection settings
       **/
      getRosConnectionDefaultSettings() {
        const rosConnectionSettings = {
          server: defaultRosConnectionSettings.server,
          port: defaultRosConnectionSettings.port
        };
        return rosConnectionSettings;
      }
      /**
       * returns an object with default mqtt connection settings
       **/
      getMqttConnectionDefaultSettings() {
        const mqttConnectionSettings = {
          server: defaultMqttConnectionSettings.server,
          port: defaultMqttConnectionSettings.port
        };
        return mqttConnectionSettings;
      }
      /**
       * returns the default allow_users connection value
       **/
      getAllowUsersConnectionDefaultSettings() {
        return defaultAllowUsersConnectionSettings;
      }
      /**
       * returns the right allow_users connection value - if the organization has determined this value - return it,
       * otherwise should be the default value
       **/
      // @ts-ignore
      get allow_users() {
        if (this.orgSettings.connection && this.orgSettings.connection.allow_users !== undefined) {
          return this.orgSettings.connection.allow_users;
        } else {
          return this.getAllowUsersConnectionDefaultSettings();
        }
      }
      handleOrganizationArchiveKey(res) {
        // thisProcess.orgOplSettings.archive should be defined
        this.orgOplSettings.style = this.getUndefinedArchiveSettings();
        // set the object archive settings which are not undefined
        if (res.archive.object) {
          this.loadOrgObjectArchiveSettings(res.archive.object);
        }
      }
      getUndefinedArchiveSettings() {
        return {
          days_interval: undefined
        };
      }
      loadOrgObjectArchiveSettings(resAtKey_object) {
        const thisProc = this;
        Object.keys(resAtKey_object).forEach(function (key) {
          if (resAtKey_object[key]) {
            thisProc.orgOplSettings.archive.object[key] = resAtKey_object[key];
          }
        });
      }
      orgArchiveSettings() {
        const days_interval = defaultArchiveDaysIntervalSettings;
        return {
          days_interval: days_interval
        };
      }
      getValidationSettings() {
        return getValidationObject(Number(this.userOplSettings.validationTime), Number(this.userOplSettings.validationEnforcementLevel));
      }
      loadOrgOntologyData(ontology) {
        this.orgOplSettings.ontology = ontology;
      }
      updateUserServerCalculationsSettings(calculationsServerSettings, allow_users) {
        if (this.settings.connection?.calculationsServer?.hasOwnProperty("computingServerCalculations") && allow_users === true) {
          calculationsServerSettings.computingServerCalculations = this.settings.connection.calculationsServer.computingServerCalculations;
        } else {
          calculationsServerSettings.computingServerCalculations = defaultCalculationsServerSettings.computingServerCalculations;
        }
        if (this.settings.connection?.calculationsServer?.hasOwnProperty("computingServerURL") && allow_users === true) {
          calculationsServerSettings.computingServerURL = this.settings.connection.calculationsServer.computingServerURL;
        } else {
          calculationsServerSettings.computingServerURL = defaultCalculationsServerSettings.computingServerURL;
        }
      }
      static #_ = (() => this.ɵfac = function OplService_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || OplService)(angular_core /* ["ɵɵinject"] */.KVO(opl_config /* .OplConfig */.Gw));
      })();
      static #_2 = (() => this.ɵprov = /*@__PURE__*/angular_core /* ["ɵɵdefineInjectable"] */.jDH({
        token: OplService,
        factory: OplService.ɵfac
      }))();
    }
    return OplService;
  })();
  function getValidationObject(validationTime, validationEnforcementLevel) {
    return {
      validation_time: validationTime == 1 ? "design" : validationTime == 2 ? "execution" : "both",
      enforcment_level: validationEnforcementLevel == 1 ? "soft" : "hard"
    };
  }

  /***/
}),
/***/25051: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    LG: () => (/* binding */linksStrength),
    Nj: () => (/* binding */LinkConstraints),
    jI: () => (/* binding */legalConnections)

  });

  const Name_To_Enum = {
    "Classification-Instantiation": models_ConfigurationOptions /* .linkType */.h6.Instantiation,
    "Exhibition-Characterization": models_ConfigurationOptions /* .linkType */.h6.Exhibition,
    "Generalization-Specialization": models_ConfigurationOptions /* .linkType */.h6.Generalization,
    "Aggregation-Participation": models_ConfigurationOptions /* .linkType */.h6.Aggregation
  };
  const defaultObjToReturn = {
    isValidLink: true,
    errorMessage: undefined,
    targetEssence: undefined
  };
  const defaultErrorMessage = "This link is not permitted.";
  const LinkConstraints = {
    isValidLink(link, linkName, initRappid) {
      let source = this.getElementFromLink(link, initRappid, "source");
      let target = this.getElementFromLink(link, initRappid, "target");
      const visualElementTarget = initRappid.opmModel.getVisualElementById(target.attributes.id);
      if (!source || !target) {
        return defaultObjToReturn;
      }
      if (!(["OpmObject", "OpmProcess"].indexOf(source.constructor.name) > -1) || !(["OpmObject", "OpmProcess"].indexOf(target.constructor.name) > -1)) {
        return defaultObjToReturn;
      }
      const targetType = target.constructor.name.slice(3).toLowerCase();
      let current_essence = this.isHaveTobeEssenceThing(target.id, targetType, initRappid);
      let newlink_essence = this.isHaveTobeEssenceLink(link, linkName, initRappid);
      const finalDecision = this.finalDecision(current_essence, newlink_essence);
      let error = this.generateErrorMessage(target);
      const finalTargetEssence = this.getFinalTargetEssence(linkName, source, target, finalDecision, newlink_essence, current_essence);
      let ans = {
        isValidLink: finalDecision,
        errorMessage: error,
        targetEssence: finalTargetEssence
      };
      if (ans.isValidLink) {
        if (ans.targetEssence === models_ConfigurationOptions /* .Essence */.tg.Informatical) {
          // this.changeEssenceToInformatical(initRappid, target.id, targetType, target.getEssence());
          target.toggleEssence(visualElementTarget);
          if (target.getEssence() !== models_ConfigurationOptions /* .Essence */.tg.Informatical) {
            ans.isValidLink = false;
            ans.errorMessage = defaultErrorMessage;
          }
        } else if (ans.targetEssence === models_ConfigurationOptions /* .Essence */.tg.Physical) {
          // this.changeEssenceToPhysical(initRappid, target.id, targetType, target.getEssence());
          target.toggleEssence(visualElementTarget);
          if (target.getEssence() !== models_ConfigurationOptions /* .Essence */.tg.Physical) {
            ans.isValidLink = false;
            ans.errorMessage = defaultErrorMessage;
          }
        }
      }
      return ans;
    },
    isHaveTobeEssence(links, targetType) {
      let essence = new Set();
      for (let link of links.in) {
        let link_e = this.linkTargetEssence(link.linkType, link.source.type, link.source.essence, targetType);
        if (link_e !== undefined) {
          essence.add(link_e);
        }
      }
      return essence;
    },
    isHaveTobeEssenceLink(link, link_type, initRappid) {
      const source = this.getElementFromLink(link, initRappid, "source");
      const target = this.getElementFromLink(link, initRappid, "target");
      const targetType = target.attributes.type.slice(4).toLowerCase();
      const sourceType = source.attributes.type.slice(4).toLowerCase();
      let this_link_attrs = {
        in: [{
          linkType: Name_To_Enum[link_type],
          source: {
            type: sourceType,
            essence: source.getEssence()
          }
        }]
      };
      let essence = this.isHaveTobeEssence(this_link_attrs, targetType);
      essence = Array.from(essence.values());
      return essence;
    },
    isHaveTobeEssenceThing(targetElement_id, targetType, initRappid) {
      let connected_links = this.getThingAllStructuralLinks(initRappid, targetElement_id);
      let essence = this.isHaveTobeEssence(connected_links, targetType);
      let logicalCell = initRappid.opmModel.getLogicalElementByVisualId(targetElement_id);
      if (targetType === "object" && logicalCell._value !== "None" || targetType === "process" && logicalCell.insertedFunction !== "None") {
        essence.add(models_ConfigurationOptions /* .Essence */.tg.Informatical);
      }
      essence = Array.from(essence.values());
      return essence;
    },
    linkTargetEssence(LinkType, sourceType, sourceEssence, targetType) {
      if (sourceType === "process" && targetType === "process") {
        if (LinkType === models_ConfigurationOptions /* .linkType */.h6.Instantiation) {
          return sourceEssence;
        }
      }
      if (sourceType === "object" && targetType === "object") {
        if (LinkType === models_ConfigurationOptions /* .linkType */.h6.Exhibition) {
          return models_ConfigurationOptions /* .Essence */.tg.Informatical;
        }
        if (LinkType === models_ConfigurationOptions /* .linkType */.h6.Aggregation) {
          if (sourceEssence === models_ConfigurationOptions /* .Essence */.tg.Informatical) {
            return models_ConfigurationOptions /* .Essence */.tg.Informatical;
          }
        }
        if (LinkType === models_ConfigurationOptions /* .linkType */.h6.Generalization) {
          if (sourceEssence === models_ConfigurationOptions /* .Essence */.tg.Informatical) {
            return models_ConfigurationOptions /* .Essence */.tg.Informatical;
          }
        }
        if (LinkType === models_ConfigurationOptions /* .linkType */.h6.Instantiation) {
          return sourceEssence;
        }
      }
      if (sourceType === "process" && targetType === "object") {
        if (LinkType === models_ConfigurationOptions /* .linkType */.h6.Exhibition) {
          if (sourceEssence === models_ConfigurationOptions /* .Essence */.tg.Informatical) {
            return models_ConfigurationOptions /* .Essence */.tg.Informatical;
          }
        }
      }
    },
    finalDecision(curr_e, new_e) {
      if (new_e.length > 1) {
        // TODO: handle this case.
        return true;
      }
      if (curr_e.length > 1) {
        // TODO: handle this case, it is currently false because of link dragging.
        return false;
      }
      if (new_e.length === 0 || curr_e.length === 0) {
        return true;
      }
      new_e = new_e[0];
      curr_e = curr_e[0];
      return new_e === curr_e;
    },
    getTargetDefaultEssence(link_type, source, target) {
      const source_type = source.constructor.name;
      const target_type = target.constructor.name;
      if (target_type === "OpmProcess" && source_type === "OpmProcess") {
        if (["Exhibition-Characterization", "Aggregation-Participation", "Generalization-Specialization", "Classification-Instantiation"].indexOf(link_type) > -1) {
          return source.getEssence();
        }
      }
      if (target_type === "OpmObject" && source_type === "OpmObject") {
        if (["Aggregation-Participation", "Generalization-Specialization", "Classification-Instantiation"].indexOf(link_type) > -1) {
          return source.getEssence();
        }
        if (link_type === "Exhibition-Characterization") {
          return models_ConfigurationOptions /* .Essence */.tg.Informatical;
        }
      }
      if (source_type === "OpmProcess" && target_type === "OpmObject") {
        if (link_type === "Exhibition-Characterization") {
          return models_ConfigurationOptions /* .Essence */.tg.Informatical;
        }
      }
      if (source_type === "OpmObject" && target_type === "OpmProcess") {
        if (link_type === "Exhibition-Characterization") {
          return source.getEssence();
        }
      }
      return undefined;
    },
    getFinalTargetEssence(link_type, source, target, finalDecision, newlink_essence, current_essence) {
      if (!finalDecision) {
        return undefined;
      }
      let essences = new Set(newlink_essence.concat(current_essence));
      if (essences.size > 1) {
        return undefined;
      }
      if (essences.size === 1) {
        return essences.values().next().value;
      }
      return this.getTargetDefaultEssence(link_type, source, target);
    },
    getConnectedStructuralLinks(initRappid, opd, thing_id, links_in, links_out) {
      let structuralLinks = opd.getThingStructuralLinks(thing_id);
      for (let i = 0; i < structuralLinks.length; i++) {
        if (structuralLinks[i].targetVisualElements[0].targetVisualElement.id === thing_id) {
          const source = initRappid.graph.getCell(structuralLinks[i].id).sourceElement;
          let link_attrs = {
            linkType: structuralLinks[i].logicalElement.linkType,
            source: {
              type: structuralLinks[i].sourceVisualElement.constructor.name.slice(9).toLowerCase(),
              essence: source.get("type").includes("State") ? source.getParentCell().getEssence() : source.getEssence()
            }
          };
          links_in.push(link_attrs);
        }
        if (structuralLinks[i].sourceVisualElement.id === thing_id) {
          const target = initRappid.graph.getCell(structuralLinks[i].id).targetElement;
          const source = initRappid.graph.getCell(structuralLinks[i].id).sourceElement;
          let link_attrs = {
            linkType: structuralLinks[i].logicalElement.linkType,
            target: {
              type: structuralLinks[i].targetVisualElements[0].targetVisualElement.constructor.name.slice(9).toLowerCase(),
              essence: target.getEssence(),
              id: structuralLinks[i].targetVisualElements[0].targetVisualElement.id
            },
            source: {
              type: structuralLinks[i].sourceVisualElement.constructor.name.slice(9).toLowerCase(),
              essence: source.getEssence()
            }
          };
          links_out.push(link_attrs);
        }
        //console.log(structuralLinks[i]);
        /*if(structuralLinks[i].sourceVisualElement.id === thing.id){
          links_out.push(structuralLinks[i].logicalElement.linkType)
        }*/
      }
    },
    // getConnectedStructuralLinks(opd, thing_id, links_in, links_out) {
    //   let structuralLinks=opd.getThingStructuralLinks(thing_id);
    //   for(let i = 0; i < structuralLinks.length; i++ ){
    //     if(structuralLinks[i].targetVisualElements[0].targetVisualElement.id === thing_id){
    //       let link_attrs={
    //         "linkType":structuralLinks[i].logicalElement.linkType,
    //         "source":{
    //           "type":structuralLinks[i].sourceVisualElement.constructor.name.slice(9, ).toLowerCase(),
    //           "essence":structuralLinks[i].sourceVisualElement.logicalElement.essence
    //         }
    //       };
    //       links_in.push(link_attrs);
    //     }
    //     if(structuralLinks[i].sourceVisualElement.id === thing_id){
    //       let link_attrs={
    //         "linkType":structuralLinks[i].logicalElement.linkType,
    //         "target":{
    //           "type":structuralLinks[i].targetVisualElements[0].targetVisualElement.constructor.name.slice(9, ).toLowerCase(),
    //           "essence":structuralLinks[i].targetVisualElements[0].targetVisualElement.logicalElement.essence,
    //           "id": structuralLinks[i].targetVisualElements[0].targetVisualElement.id
    //         },
    //         "source":{
    //           "type":structuralLinks[i].sourceVisualElement.constructor.name.slice(9, ).toLowerCase(),
    //           "essence":structuralLinks[i].sourceVisualElement.logicalElement.essence
    //         }
    //       };
    //       links_out.push(link_attrs);
    //     }
    //     //console.log(structuralLinks[i]);
    //     /*if(structuralLinks[i].sourceVisualElement.id === thing.id){
    //       links_out.push(structuralLinks[i].logicalElement.linkType)
    //     }*/
    //   }
    // },
    getThingAllStructuralLinks(initRappid, targetElement_id) {
      let links_in = [];
      let links_out = [];
      this.getConnectedStructuralLinks(initRappid, initRappid.opmModel.getOpdByThingId(targetElement_id), targetElement_id, links_in, links_out);
      if (initRappid.opmModel.getVisualElementById(targetElement_id).refineable) {
        let refinee = initRappid.opmModel.getVisualElementById(targetElement_id).refineable;
        this.getConnectedStructuralLinks(initRappid, initRappid.opmModel.getOpdByThingId(refinee.id), refinee.id, links_in, links_out);
      }
      if (initRappid.opmModel.getVisualElementById(targetElement_id).refineeInzooming) {
        let refinee = initRappid.opmModel.getVisualElementById(targetElement_id).refineeInzooming;
        this.getConnectedStructuralLinks(initRappid, initRappid.opmModel.getOpdByThingId(refinee.id), refinee.id, links_in, links_out);
      }
      if (initRappid.opmModel.getVisualElementById(targetElement_id).refineeUnfolding) {
        let refinee = initRappid.opmModel.getVisualElementById(targetElement_id).refineeUnfolding;
        this.getConnectedStructuralLinks(initRappid, initRappid.opmModel.getOpdByThingId(refinee.id), refinee.id, links_in, links_out);
      }
      return {
        in: links_in,
        out: links_out
      };
    },
    generateErrorMessage(target) {
      let target_type = target.constructor.name;
      let name = target.attributes.attrs.text.textWrap.text;
      if (target_type === "OpmObject") {
        return "An instance of an object must have the same essence as its class.";
      }
      if (target_type === "OpmProcess") {
        return "An instance of a process must have the same essence as its class.";
      }
      return defaultObjToReturn.errorMessage;
    },
    // setEssence(element,initRappid){
    //   const curr_essence = element.getEssence();
    //   const type =  element.constructor.name.slice(3,).toLowerCase();
    //   let ans = defaultObjToReturn;
    //   if(curr_essence === Essence.Physical){
    //     this.changeEssenceToInformatical(initRappid,element.id,type,curr_essence);
    //   }
    //   if(curr_essence === Essence.Informatical){
    //     ans = this.changeEssenceToPhysical(initRappid,element.id,type,curr_essence);
    //   }
    //   return ans;
    // },
    // changeEssenceToPhysical(initRappid,id,type,curr_essence){
    //   if(curr_essence === Essence.Physical){
    //     return;
    //   }
    //   let essences = this.isHaveTobeEssenceThing(id,type,initRappid);
    //   if(essences.indexOf(Essence.Informatical)>-1){
    //     return {errorMessage:"Error"};
    //   }
    //   let all_instances = new Set();
    //   all_instances.add(id);
    //   this.getAllInstances(initRappid,all_instances,all_instances);
    //   let thisProcess = this;
    //   let changed = new Set();
    //   all_instances.forEach(function (id) {
    //     if(thisProcess.updateEssenceByID(id,initRappid,Essence.Physical)){
    //       changed.add(id);
    //     }
    //   });
    //   if(!this.checkEssenceForGroup(all_instances,initRappid,Essence.Informatical)){
    //     changed.forEach(function (id) {
    //       thisProcess.updateEssenceByID(id,initRappid,Essence.Informatical);
    //     });
    //   }
    //
    //
    // },
    getAllInstances(initRappid, all_instances, sons) {
      if (sons.size === 0) {
        return;
      }
      let thisProcess = this;
      let new_sons = new Set();
      sons.forEach(function (id) {
        all_instances.add(id);
        let links = thisProcess.getThingAllStructuralLinks(initRappid, id);
        links.out.forEach(function (link) {
          if (all_instances.has(link.target.id) || sons.has(link.target.id)) {
            return;
          }
          if (link.linkType === models_ConfigurationOptions /* .linkType */.h6.Instantiation) {
            new_sons.add(link.target.id);
          }
        });
      });
      return this.getAllInstances(initRappid, all_instances, new_sons);
    },
    // changeEssenceToInformatical(initRappid,id,type,curr_essence){
    //   if(curr_essence === Essence.Informatical){
    //     return;
    //   }
    //   let essences = this.isHaveTobeEssenceThing(id,type,initRappid);
    //   if(essences.indexOf(Essence.Physical)>-1){
    //     return {errorMessage:"Error"};
    //   }
    //   let info_things = new Set();
    //   info_things.add(id);
    //   this.getAllinfoThings(initRappid,info_things,info_things);
    //   let thisProcess = this;
    //   let changed = new Set();
    //   info_things.forEach(function (id) {
    //     if(thisProcess.updateEssenceByID(id,initRappid,Essence.Informatical)){
    //       changed.add(id);
    //     }
    //   });
    //   if(!this.checkEssenceForGroup(info_things,initRappid,Essence.Physical)){
    //     changed.forEach(function (id) {
    //       thisProcess.updateEssenceByID(id,initRappid,Essence.Physical);
    //     });
    //   }
    //
    // },
    getAllinfoThings(initRappid, all_info, sons) {
      if (sons.size === 0) {
        return;
      }
      let thisProcess = this;
      let new_sons = new Set();
      sons.forEach(function (id) {
        all_info.add(id);
        let links = thisProcess.getThingAllStructuralLinks(initRappid, id);
        links.out.forEach(function (link) {
          if (all_info.has(link.target.id) || sons.has(link.target.id)) {
            return;
          }
          if (link.target.type === "object" && link.source.type === "object") {
            if ([models_ConfigurationOptions /* .linkType */.h6.Instantiation, models_ConfigurationOptions /* .linkType */.h6.Aggregation, models_ConfigurationOptions /* .linkType */.h6.Generalization].indexOf(link.linkType) > -1) {
              new_sons.add(link.target.id);
            }
          }
          if (link.target.type === "process" && link.source.type === "process") {
            if (link.linkType === models_ConfigurationOptions /* .linkType */.h6.Instantiation) {
              new_sons.add(link.target.id);
            }
          }
          if (link.target.type === "object" && link.source.type === "process") {
            if (link.linkType === models_ConfigurationOptions /* .linkType */.h6.Exhibition) {
              new_sons.add(link.target.id);
            }
          }
        });
      });
      return this.getAllinfoThings(initRappid, all_info, new_sons);
    },
    // updateEssenceByID(id,initRappid,essence){
    //   let logicalCell = initRappid.opmModel.getLogicalElementByVisualId(id);
    //   if(logicalCell.essence === essence){
    //     return false;
    //   }
    //   let cell = initRappid.graph.getCell(id);
    //   if(cell !==undefined){
    //     cell.updateEssence(essence);
    //     return true;
    //   }
    //   logicalCell.essence = essence;
    //   return true;
    //
    // },
    // checkEssenceForGroup(id_set,initRappid,oppositeChangedEssence){
    //   let thisProcess = this;
    //   let ans = true;
    //   id_set.forEach(function (id) {
    //     let type = initRappid.opmModel.getVisualElementById(id).constructor.name.slice(9,).toLowerCase();
    //     let essences = thisProcess.isHaveTobeEssenceThing(id,type,initRappid);
    //     if(essences.indexOf(oppositeChangedEssence)>-1){
    //       ans = false;
    //     }
    //   });
    //   return ans;
    // },
    CanBeComputational(id, initRappid, thing) {
      const visualCell = initRappid.opmModel.getVisualElementById(id);
      let cellType = visualCell.constructor.name.slice(9).toLowerCase();
      let essences = this.isHaveTobeEssenceThing(id, cellType, initRappid);
      if (essences.length === 1 && essences[0] === models_ConfigurationOptions /* .Essence */.tg.Physical) {
        return false;
      }
      // this.changeEssenceToInformatical(initRappid,id,cellType,visualCell.logicalElement.essence);
      // thing.toggleEssence(visualCell);
      //
      // if(thing.getEssence() === Essence.Informatical) {
      //   return true;
      // }
      // return false;
      if (!thing.CanBeComputational()) {
        thing.toggleEssence(visualCell);
      }
      return thing.CanBeComputational();
    },
    getElementFromLink(link, initRappid, type) {
      try {
        type = type.toLowerCase();
        if (type === "source") {
          let source = link.getSourceElement();
          if (!source) {
            return null;
          }
          if (source.constructor.name === "TriangleClass") {
            return initRappid.graph.getCell(link.id).sourceElement;
          }
          return source;
        }
        if (type === "target") {
          let target = link.getTargetElement();
          if (!target) {
            return null;
          }
          if (target.constructor.name === "TriangleClass") {
            return initRappid.graph.getCell(link.id).targetElement;
          }
          return target;
        }
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  };
  const legalConnections = {
    OO: [models_ConfigurationOptions /* .linkType */.h6.Bidirectional, models_ConfigurationOptions /* .linkType */.h6.Unidirectional, models_ConfigurationOptions /* .linkType */.h6.Instantiation, models_ConfigurationOptions /* .linkType */.h6.Generalization, models_ConfigurationOptions /* .linkType */.h6.Aggregation, models_ConfigurationOptions /* .linkType */.h6.Exhibition],
    PP: [models_ConfigurationOptions /* .linkType */.h6.Bidirectional, models_ConfigurationOptions /* .linkType */.h6.Unidirectional, models_ConfigurationOptions /* .linkType */.h6.Instantiation, models_ConfigurationOptions /* .linkType */.h6.Generalization, models_ConfigurationOptions /* .linkType */.h6.Aggregation, models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Invocation, models_ConfigurationOptions /* .linkType */.h6.OvertimeException, models_ConfigurationOptions /* .linkType */.h6.UndertimeOvertimeException, models_ConfigurationOptions /* .linkType */.h6.UndertimeException],
    PO: [models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Result, models_ConfigurationOptions /* .linkType */.h6.Effect],
    OP: [models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Agent, models_ConfigurationOptions /* .linkType */.h6.Instrument, models_ConfigurationOptions /* .linkType */.h6.Consumption, models_ConfigurationOptions /* .linkType */.h6.Effect],
    SP: [models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Agent, models_ConfigurationOptions /* .linkType */.h6.Instrument, models_ConfigurationOptions /* .linkType */.h6.Consumption, models_ConfigurationOptions /* .linkType */.h6.OvertimeException, models_ConfigurationOptions /* .linkType */.h6.UndertimeOvertimeException, models_ConfigurationOptions /* .linkType */.h6.UndertimeException],
    PS: [models_ConfigurationOptions /* .linkType */.h6.Result],
    SO: [models_ConfigurationOptions /* .linkType */.h6.Aggregation, models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Unidirectional, models_ConfigurationOptions /* .linkType */.h6.Bidirectional],
    OS: [models_ConfigurationOptions /* .linkType */.h6.Aggregation, models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Unidirectional, models_ConfigurationOptions /* .linkType */.h6.Bidirectional],
    SS: [models_ConfigurationOptions /* .linkType */.h6.Unidirectional, models_ConfigurationOptions /* .linkType */.h6.Bidirectional]
  };
  // from strongest to weakest
  const linksStrength = {
    fundamental: [models_ConfigurationOptions /* .linkType */.h6.Aggregation, models_ConfigurationOptions /* .linkType */.h6.Generalization, models_ConfigurationOptions /* .linkType */.h6.Exhibition, models_ConfigurationOptions /* .linkType */.h6.Instantiation],
    procedural: [models_ConfigurationOptions /* .linkType */.h6.Effect, models_ConfigurationOptions /* .linkType */.h6.Consumption, models_ConfigurationOptions /* .linkType */.h6.Result, models_ConfigurationOptions /* .linkType */.h6.Instrument, models_ConfigurationOptions /* .linkType */.h6.Agent],
    tagged: [models_ConfigurationOptions /* .linkType */.h6.Bidirectional, models_ConfigurationOptions /* .linkType */.h6.Unidirectional]
  };

  /***/
}),
/***/86347: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    F: () => (/* binding */httpErrorToMessage)

  });
  /**
   * Human-readable message from Angular HttpClient failures (e.g. HttpErrorResponse).
   * Handles JSON bodies like `{ error: "..." }` from the API.
   */
  function httpErrorToMessage(err) {
    if (err == null) {
      return "Unknown error";
    }
    const e = err;
    const body = e.error;
    if (typeof body === "object" && body !== null) {
      const o = body;
      if (typeof o.error === "string") {
        return o.error;
      }
      if (typeof o.message === "string") {
        return o.message;
      }
    }
    if (typeof body === "string") {
      const s = body.trim();
      if (s.startsWith("{")) {
        try {
          const parsed = JSON.parse(s);
          if (typeof parsed.error === "string") {
            return parsed.error;
          }
          if (typeof parsed.message === "string") {
            return parsed.message;
          }
        } catch {
          /* body is not JSON */
        }
      }
      return body;
    }
    const msg = e.message;
    if (typeof msg === "string" && msg.length > 0) {
      return msg;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }

  /***/
}),
/***/37084: (/***/(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {
  "use strict";

  // NAMESPACE OBJECT: ./node_modules/@tensorflow/tfjs-core/dist/ops/slice_util.js
  var slice_util_namespaceObject = {};
  __webpack_require__.r(slice_util_namespaceObject);
  __webpack_require__.d(slice_util_namespaceObject, {
    assertParamsValid: () => assertParamsValid,
    computeFlatOffset: () => computeFlatOffset,
    computeOutShape: () => computeOutShape,
    getNormalizedAxes: () => getNormalizedAxes,
    isSliceContinous: () => isSliceContinous,
    maskToAxes: () => maskToAxes,
    parseSliceParams: () => parseSliceParams,
    sliceInfo: () => sliceInfo,
    startForAxis: () => startForAxis,
    startIndicesWithElidedDims: () => startIndicesWithElidedDims,
    stopForAxis: () => stopForAxis,
    stopIndicesWithElidedDims: () => stopIndicesWithElidedDims,
    stridesForAxis: () => stridesForAxis,
    stridesWithElidedDims: () => stridesWithElidedDims
  });

  // NAMESPACE OBJECT: ./node_modules/@tensorflow/tfjs-core/dist/ops/segment_util.js
  var segment_util_namespaceObject = {};
  __webpack_require__.r(segment_util_namespaceObject);
  __webpack_require__.d(segment_util_namespaceObject, {
    collectGatherOpShapeInfo: () => collectGatherOpShapeInfo,
    computeOutShape: () => segment_util_computeOutShape,
    segOpComputeOptimalWindowSize: () => segOpComputeOptimalWindowSize
  });

  // NAMESPACE OBJECT: ./node_modules/@tensorflow/tfjs-core/dist/backends/backend_util.js
  var backend_util_namespaceObject = {};
  __webpack_require__.r(backend_util_namespaceObject);
  __webpack_require__.d(backend_util_namespaceObject, {
    ERF_A1: () => ERF_A1,
    ERF_A2: () => ERF_A2,
    ERF_A3: () => ERF_A3,
    ERF_A4: () => ERF_A4,
    ERF_A5: () => ERF_A5,
    ERF_P: () => ERF_P,
    PARALLELIZE_THRESHOLD: () => PARALLELIZE_THRESHOLD,
    RowPartitionType: () => RowPartitionType,
    SELU_SCALE: () => SELU_SCALE,
    SELU_SCALEALPHA: () => SELU_SCALEALPHA,
    applyActivation: () => applyActivation,
    assertAndGetBroadcastShape: () => assertAndGetBroadcastShape,
    assertAxesAreInnerMostDims: () => assertAxesAreInnerMostDims,
    assertParamsConsistent: () => assertParamsConsistent,
    assignToTypedArray: () => assignToTypedArray,
    axesAreInnerMostDims: () => axesAreInnerMostDims,
    calculateShapes: () => calculateShapes,
    checkEinsumDimSizes: () => checkEinsumDimSizes,
    checkPadOnDimRoundingMode: () => checkPadOnDimRoundingMode,
    combineLocations: () => combineLocations,
    combineRaggedTensorToTensorShapes: () => combineRaggedTensorToTensorShapes,
    complexWithEvenIndex: () => complexWithEvenIndex,
    complexWithOddIndex: () => complexWithOddIndex,
    computeConv2DInfo: () => computeConv2DInfo,
    computeConv3DInfo: () => computeConv3DInfo,
    computeDefaultPad: () => computeDefaultPad,
    computeDilation2DInfo: () => computeDilation2DInfo,
    computeOptimalWindowSize: () => computeOptimalWindowSize,
    computeOutAndReduceShapes: () => computeOutAndReduceShapes,
    computeOutShape: () => concat_util_computeOutShape,
    computePool2DInfo: () => computePool2DInfo,
    computePool3DInfo: () => computePool3DInfo,
    convertConv2DDataFormat: () => convertConv2DDataFormat,
    decodeEinsumEquation: () => decodeEinsumEquation,
    eitherStridesOrDilationsAreOne: () => eitherStridesOrDilationsAreOne,
    expandShapeToKeepDim: () => expandShapeToKeepDim,
    exponent: () => exponent,
    exponents: () => exponents,
    fromStringArrayToUint8: () => fromStringArrayToUint8,
    fromUint8ToStringArray: () => fromUint8ToStringArray,
    getAxesPermutation: () => getAxesPermutation,
    getBroadcastDims: () => getBroadcastDims,
    getComplexWithIndex: () => getComplexWithIndex,
    getEinsumComputePath: () => getEinsumComputePath,
    getEinsumPermutation: () => getEinsumPermutation,
    getFusedBiasGradient: () => getFusedBiasGradient,
    getFusedDyActivation: () => getFusedDyActivation,
    getImageCenter: () => getImageCenter,
    getInnerMostAxes: () => getInnerMostAxes,
    getPermuted: () => getPermuted,
    getRaggedRank: () => getRaggedRank,
    getReductionAxes: () => getReductionAxes,
    getReshaped: () => getReshaped,
    getReshapedPermuted: () => getReshapedPermuted,
    getRowPartitionTypesHelper: () => getRowPartitionTypesHelper,
    getSliceBeginCoords: () => getSliceBeginCoords,
    getSliceSize: () => getSliceSize,
    getSparseFillEmptyRowsIndicesDenseShapeMismatch: () => getSparseFillEmptyRowsIndicesDenseShapeMismatch,
    getSparseFillEmptyRowsNegativeIndexErrorMessage: () => getSparseFillEmptyRowsNegativeIndexErrorMessage,
    getSparseFillEmptyRowsOutOfRangeIndexErrorMessage: () => getSparseFillEmptyRowsOutOfRangeIndexErrorMessage,
    getSparseReshapeEmptyTensorZeroOutputDimErrorMessage: () => getSparseReshapeEmptyTensorZeroOutputDimErrorMessage,
    getSparseReshapeInputOutputMismatchErrorMessage: () => getSparseReshapeInputOutputMismatchErrorMessage,
    getSparseReshapeInputOutputMultipleErrorMessage: () => getSparseReshapeInputOutputMultipleErrorMessage,
    getSparseReshapeMultipleNegativeOneOutputDimErrorMessage: () => getSparseReshapeMultipleNegativeOneOutputDimErrorMessage,
    getSparseReshapeNegativeOutputDimErrorMessage: () => getSparseReshapeNegativeOutputDimErrorMessage,
    getSparseSegmentReductionIndicesOutOfRangeErrorMessage: () => getSparseSegmentReductionIndicesOutOfRangeErrorMessage,
    getSparseSegmentReductionNegativeSegmentIdsErrorMessage: () => getSparseSegmentReductionNegativeSegmentIdsErrorMessage,
    getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage: () => getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage,
    getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage: () => getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage,
    getUndoAxesPermutation: () => getUndoAxesPermutation,
    isIdentityPermutation: () => isIdentityPermutation,
    log: () => log,
    mergeRealAndImagArrays: () => mergeRealAndImagArrays,
    prepareAndValidate: () => prepareAndValidate,
    prepareSplitSize: () => prepareSplitSize,
    segment_util: () => segment_util_namespaceObject,
    shouldFuse: () => shouldFuse,
    slice_util: () => slice_util_namespaceObject,
    splitRealAndImagArrays: () => splitRealAndImagArrays,
    stridesOrDilationsArePositive: () => stridesOrDilationsArePositive,
    tupleValuesAreOne: () => tupleValuesAreOne,
    upcastType: () => upcastType,
    validateDefaultValueShape: () => validateDefaultValueShape,
    validateInput: () => validateInput,
    validateUpdateShape: () => validateUpdateShape,
    warn: () => warn
  });

  // NAMESPACE OBJECT: ./node_modules/@tensorflow/tfjs-backend-cpu/dist/shared.js
  var shared_namespaceObject = {};
  __webpack_require__.r(shared_namespaceObject);
  __webpack_require__.d(shared_namespaceObject, {
    mx: () => addImpl,
    XI: () => bincountImpl,
    Nk: () => bincountReduceImpl,
    f6: () => bitwiseAndImpl,
    ct: () => castImpl,
    YG: () => ceilImpl,
    hH: () => concatImpl,
    z3: () => equalImpl,
    sG: () => expImpl,
    uM: () => expm1Impl,
    vS: () => floorImpl,
    qB: () => gatherNdImpl,
    GG: () => gatherV2Impl,
    lg: () => greaterEqualImpl,
    rq: () => greaterImpl,
    cu: () => lessEqualImpl,
    WR: () => lessImpl,
    GE: () => linSpaceImpl,
    px: () => logImpl,
    jC: () => maxImpl,
    He: () => maximumImpl,
    hE: () => minimumImpl,
    BF: () => multiplyImpl,
    Dk: () => negImpl,
    cl: () => notEqualImpl,
    _B: () => prodImpl,
    ub: () => raggedGatherImpl,
    _f: () => raggedRangeImpl,
    Ku: () => raggedTensorToTensorImpl,
    qy: () => rangeImpl,
    Zy: () => rsqrtImpl,
    bu: () => scatterImpl,
    zv: () => sigmoidImpl,
    dH: () => simpleAbsImpl,
    HS: () => sliceImpl,
    yH: () => sparseFillEmptyRowsImpl,
    l3: () => sparseReshapeImpl,
    z9: () => sparseSegmentReductionImpl,
    x6: () => sqrtImpl,
    _m: () => staticRegexReplaceImpl,
    eW: () => stridedSliceImpl,
    GK: () => stringNGramsImpl,
    SP: () => stringSplitImpl,
    yr: () => stringToHashBucketFastImpl,
    dl: () => subImpl,
    Dw: () => tileImpl,
    xT: () => topKImpl,
    _X: () => transposeImpl,
    wz: () => uniqueImpl
  });
