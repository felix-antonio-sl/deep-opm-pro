// Source: decompiled/37084.js
// Original path: ./src/app/rappid-components/services/GraphDB/graphDB.service.ts
// Extracted by opm-extracted/tools/extract.mjs

import * as neo4j from "./8760.js";
let GraphDBService = /*#__PURE__*/(() => {
  class GraphDBService {
    constructor(initRappidService, graphService, http, _treeViewService, oplService) {
      this.initRappidService = initRappidService;
      this.graphService = graphService;
      this.http = http;
      this._treeViewService = _treeViewService;
      this.oplService = oplService;
      this.index = 1;
      this.tripleArr = [];
      this.highlightColor = {
        result: "#B2E4F9",
        source: "#FFEEB3",
        target: "#B1F9C7",
        greyscale: "#F7F7F7",
        greyscaleLink: "#C9CCCD",
        opl: "#a80202"
      };
      // GraphDBmsg: Subject<any>; //Boolean to indicate if present 'OPM Result' label instead of 'OPL'
      this.GraphDBmsg = new BehaviorSubject("");
      this.streamingGraphDBmsg = this.GraphDBmsg.asObservable();
      this.DEBUG = false;
    }
    openSession() {
      var _this = this;
      return (0, default)(function* () {
        const uri = _this.oplService.userOplSettings.connection.graphdb?.graphdb_api;
        const user = _this.oplService.userOplSettings.connection.graphdb?.username;
        const password = _this.oplService.userOplSettings.connection.graphdb?.password;
        _this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        _this.session = _this.driver.session();
      })();
    }
    closeSession() {
      var _this2 = this;
      return (0, default)(function* () {
        yield _this2.session.close();
        yield _this2.driver.close();
      })();
    }
    runQuery(Conf) {
      var _this3 = this;
      return (0, default)(function* () {
        _this3.conf = Conf;
        yield _this3.openSession();
        return new Promise(/*#__PURE__*/function () {
          var _ref = (0, default)(function* (resolve, reject) {
            if (_this3.session) {
              yield _this3.generateGraphDBFromScratch().then(/*#__PURE__*/function () {
                var _ref2 = (0, default)(function* (r2) {
                  if (!r2) {
                    reject("Can't generate GraphDB"); // Shouldn't get to this error
                  } else {
                    switch (_this3.conf.type) {
                      case "Path Finding":
                        {
                          yield _this3.getPath().then(opl => resolve(opl)).catch(err => reject(err));
                          yield _this3.closeSession();
                          break;
                        }
                      case "Neighborhood":
                        {
                          yield _this3.getNeighborhood().then(msg => resolve(msg)).catch(err => reject(err));
                          yield _this3.closeSession();
                          break;
                        }
                      case "Centrality":
                        {
                          yield _this3.getCentrality().then(msg => resolve(msg)).catch(err => reject(err));
                          yield _this3.closeSession();
                          break;
                        }
                      default:
                        {
                          yield reject("Unrecognized OPM Query Type");
                          yield _this3.closeSession();
                          break;
                        }
                    }
                  }
                });
                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }()).catch(/*#__PURE__*/function () {
                var _ref3 = (0, default)(function* (err2) {
                  yield _this3.closeSession();
                  console.error("Failed to generate GraphDB in Neo4j:", err2.errorMsg);
                  reject("Failed to generate GraphDB for query execution");
                });
                return function (_x4) {
                  return _ref3.apply(this, arguments);
                };
              }());
            }
          });
          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }());
      })();
    }
    debug(msg) {
      if (this.DEBUG) {
        console.log("DEBUG::", msg);
      }
    }
    generateGraphDBFromScratch() {
      var _this4 = this;
      return (0, default)(function* () {
        _this4.debug("Generating Graph DB from scratch");
        const cypherArr = _this4.convertOPMtoCypherArr();
        let neo4j_resp = {
          isError: false,
          errorMsg: null,
          result: null
        };
        return new Promise(/*#__PURE__*/function () {
          var _ref4 = (0, default)(function* (resolve, reject) {
            if (cypherArr.length > 0) {
              cypherArr.unshift("MATCH (n) DETACH DELETE n"); // Remove previous DB
              _this4.GraphDBmsg.next("Executing cypher queries to create graph DB");
              _this4.debug("Executing a query against Neo4J");
              for (const q of cypherArr) {
                yield _this4.session.run(q).then(result => {
                  const resultStr = "{ \"GenerateDB\":\"Success\"}";
                  neo4j_resp = {
                    isError: false,
                    errorMsg: null,
                    result: resultStr
                  };
                  // resolve(neo4j_resp);
                }).catch(err => {
                  _this4.RevertFlatGraph();
                  console.error("Failure to generate graphDB. Error:" + err.errorMsg);
                  const resultStr = "{ \"GenerateDB\":\"Failure\",\"Queries\":\"" + cypherArr + "\"}";
                  neo4j_resp = {
                    isError: true,
                    errorMsg: err.errorMsg,
                    result: JSON.parse(resultStr)
                  };
                  reject(neo4j_resp);
                });
              }
              resolve(neo4j_resp);
            } else {
              console.error("Parsing of current OPL generated zero cypher queries");
              neo4j_resp = {
                isError: true,
                errorMsg: "Can't generate GraphDB queries from current OPL",
                result: null
              };
              reject(neo4j_resp);
            }
          });
          return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
          };
        }());
      })();
    }
    // Flattening functions
    GenerateFlatOPD() {
      this.GraphDBmsg.next("Generating flatten model");
      this.debug("Creating Flat OPD");
      this.origOPD = this.initRappidService.opmModel.currentOpd;
      this.flatOPD = this._treeViewService.initRappid.opmModel.flattening();
      // Modify Source and Target in case of state
      if (this.conf.source && this.conf.source instanceof OpmLogicalState) {
        this.conf.source = this.flatOPD.visualElements.filter(e => e instanceof OpmVisualThing && e.logicalElement instanceof OpmLogicalObject && e.logicalElement._text === this.relableState(this.conf.source))[0].logicalElement;
        this.conf.source.type = "object";
        this.debug("Modified source state to be object");
      }
      if (this.conf.target && this.conf.target instanceof OpmLogicalState) {
        this.conf.target = this.flatOPD.visualElements.filter(e => e instanceof OpmVisualThing && e.logicalElement instanceof OpmLogicalObject && e.logicalElement._text === this.relableState(this.conf.target))[0].logicalElement;
        this.conf.target.type = "object";
        this.debug("Modified target state to be object");
      }
    }
    RevertFlatGraph() {
      this.GraphDBmsg.next("Reverting back to original model");
      this.debug("Reverting Flat Graph");
      this.graphService.renderGraph(this.origOPD, this._treeViewService.initRappid);
      this._treeViewService.initRappid.opmModel.removeOPMQueryOPD();
    }
    GenerateOPMQueryTreeNode() {
      this._treeViewService.createNewNode(this.flatOPD.id, this._treeViewService.getNodeById("SD"), "OPM Query Result", true);
      (0, highlighSD)(this.flatOPD.id, this._treeViewService.initRappid);
    }
    // OPM -> Neo4J Cypher query language functions //
    convertOPMtoCypherArr() {
      // Create Triples
      this.tripleArr = this.createTriplesFromOPM();
      // Create Cypher (Neo4j query language)
      let cypherArr = [];
      cypherArr = this.GenerateCyphersFromTriples(this.tripleArr);
      return cypherArr;
    }
    createTriplesFromOPM() {
      const TRIPLEs = [];
      this.GenerateFlatOPD();
      this.GraphDBmsg.next("Creating triples from flatten OPM model");
      this.debug("Iterating over Links from OPD visual elements to create source-link-target triples");
      const allLinks = this.flatOPD.visualElements.filter(element => element instanceof OpmLink);
      for (let link = 0; link < allLinks.length; link++) {
        // Source
        const sourceVisual = allLinks[link].sourceVisualElement;
        const src_tripleComp = {
          type: "Source",
          id: sourceVisual.id,
          opm_type: sourceVisual.type.replace("OpmLogical", "").toLowerCase(),
          label: sourceVisual.logicalElement.text.replace(/'/, "")
        };
        // Link
        const linkVisual = allLinks[link];
        const link_tripleComp = {
          type: "link",
          id: linkVisual.id,
          opm_type: "link",
          label: linkVisual.logicalElement.name
        };
        // Target
        const targetVisual = allLinks[link].targetVisualElements[0].targetVisualElement;
        const trg_tripleComp = {
          type: "Target",
          id: targetVisual.id,
          opm_type: targetVisual.type.replace("OpmLogical", "").toLowerCase(),
          label: targetVisual.logicalElement.text.replace(/'/, "")
        };
        // Merge All
        const curr_triple = {
          source: src_tripleComp,
          link: link_tripleComp,
          target: trg_tripleComp
        };
        TRIPLEs.push(curr_triple);
      }
      this.debug("Created " + TRIPLEs.length + "triples");
      return TRIPLEs;
    }
    GenerateCyphersFromTriples(tripleArr) {
      // Generate Cyphers
      this.GraphDBmsg.next("Creating cypher queries from triples");
      this.debug("Converting Triples to Cypher Queries");
      const cypherQs = [];
      for (const t of tripleArr) {
        if (this.conf.thingType !== null && this.conf.thingType === "Any") {
          t.source.opm_type = "THING";
          t.target.opm_type = "THING";
        }
        if (this.conf.linkType !== null && this.conf.linkType === "Any") {
          t.link.label = "LINKS";
        }
        let cypherQ = "";
        cypherQ = "Merge (:" + t.source.opm_type + "{name:'" + t.source.label + "',opm_id:'" + t.source.id + "'}) ";
        cypherQs.push(cypherQ);
        cypherQ = "Merge (:" + t.target.opm_type + "{name:'" + t.target.label + "',opm_id:'" + t.target.id + "'}) ";
        cypherQs.push(cypherQ);
        cypherQ = "Match (n" + this.index + ":" + t.source.opm_type + "{name:'" + t.source.label + "',opm_id:'" + t.source.id + "'}) ";
        cypherQ = cypherQ + "Match(n" + (this.index + 1) + ":" + t.target.opm_type + "{name:'" + t.target.label + "',opm_id:'" + t.target.id + "'}) ";
        cypherQ = cypherQ + "Merge (n" + this.index + ")-[r:" + t.link.label + " {opm_id:'" + t.link.id + "'}]->(n" + (this.index + 1) + ")";
        cypherQs.push(cypherQ);
        this.index += 2;
      }
      this.debug("Created " + cypherQs.length + " queries");
      return cypherQs;
    }
    // Results Display Functions //
    DisplayResults(resMap) {
      this.changeDBmsg("Generating view of the results");
      // let myConf = Conf ? Conf : {} ;
      this.debug("Generating Results Disaply");
      let arrID = [];
      const map = resMap;
      if (map.links) {
        for (const link of map.links) {
          if (!arrID.includes(link.opm_id)) {
            arrID.push(link.opm_id);
          }
        }
      }
      for (const node of map.nodes) {
        if (!arrID.includes(node.opm_id)) {
          arrID.push(node.opm_id);
        }
      }
      const resultOPD = this.generateResultsOPD(arrID);
      this.ResultOPLs = this.getOPLfromResultOPD(resultOPD);
      this.removeResultsOPD(resultOPD);
      if (map.data && map.columns) {
        this.ResultOPLs = this.getTablefromResult(map.data, map.columns, this.ResultOPLs[0]);
      }
      this.debug(["Generated OPLs:", this.ResultOPLs]);
      if (this.conf.resultOnly) {
        this.removeVisuals(arrID);
      }
      this.rePositionVisuals(arrID);
      this.debug("Rendering Graph from results");
      this.graphService.renderGraph(this.flatOPD, this._treeViewService.initRappid);
      if (!this.conf.resultOnly) {
        this.highlightIDarray(arrID);
      }
      this.highlightSourceTarget(arrID);
      this.GenerateOPMQueryTreeNode();
      this.GraphDBmsg.next("");
      return null;
    }
    getTablefromResult(data, columns, oplObject) {
      const returnArr = [];
      let html = "<table border=1>";
      // Generate header
      html = html + "<tr><th background=grey>OPM Thing</th>";
      columns.forEach(function (c) {
        html = html + "<th background=grey>" + c + "</th>";
      });
      html = html + "</tr>";
      // Generate data
      data.forEach(function (row) {
        html = html + "<tr><td>" + row.node + "</td>";
        columns.forEach(function (c) {
          html = html + "<td>" + row[c] + "</td>";
        });
        html = html + "</tr>";
      });
      html = html + "</table>";
      console.log("oplOj", oplObject, "resullOp", this.ResultOPLs);
      oplObject.opl = html;
      returnArr.push(oplObject);
      return returnArr;
    }
    highlightIDarray(arrID) {
      const allCells = this.initRappidService.graph.getCells();
      for (const cell of allCells) {
        if (arrID.filter(id => id === cell.id).length > 0) {
          this.highlightCell(cell, this.highlightColor.result);
        } else {
          this.highlightCell(cell, this.highlightColor.greyscale);
        }
      }
    }
    highlightSourceTarget(arrID) {
      // Highlight cell
      this.debug("Coloring the relevant nodes");
      const allCells = this.initRappidService.graph.getCells();
      for (const cell of allCells) {
        if (this.conf.source && cell.lastEnteredText === this.conf.source._text) {
          this.highlightCell(cell, this.highlightColor.source);
        } else if (this.conf.target && cell.lastEnteredText === this.conf.target._text) {
          this.highlightCell(cell, this.highlightColor.target);
        }
      }
      // Highlight OPL
      this.debug("Coloring the OPL");
      for (let i = 0; i < this.ResultOPLs.length; i++) {
        if (this.conf.source && this.ResultOPLs[i].opl.includes(this.conf.source._text)) {
          this.ResultOPLs[i].opl = this.ResultOPLs[i].opl.replace(`>${this.conf.source._text}<`, `><font size="3" color="${this.highlightColor.opl}">${this.conf.source._text}</font><`);
        }
        if (this.conf.target && this.ResultOPLs[i].opl.includes(this.conf.target._text)) {
          this.ResultOPLs[i].opl = this.ResultOPLs[i].opl.replace(`>${this.conf.target._text}<`, `><font size="3" color="${this.highlightColor.opl}">${this.conf.target._text}</font><`);
        }
      }
      this.oplService.oplSwitch.next("Highlight Source and Target OPL");
    }
    highlightCell(cell, color) {
      this.initRappidService.graph.startBatch("ignoreEvents");
      switch (cell.attributes.type) {
        case "opm.Object":
          this.highlightObject(cell, color);
          break;
        case "opm.Process":
          this.highlightProcess(cell, color);
          break;
        case "opm.Link":
          this.highlightLink(cell, color);
          break;
        case "opm.State":
          this.highlightSingleState(cell, color);
          break;
      }
      this.initRappidService.graph.stopBatch("ignoreEvents");
    }
    highlightObject(cell, color) {
      const cellView = this.initRappidService.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      cellView.model.attr("rect/fill", color);
      if (color === this.highlightColor.greyscale) {
        cellView.model.attr("rect/stroke", color);
      }
    }
    highlightProcess(cell, color) {
      const cellView = this.initRappidService.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      cellView.model.attr("ellipse/fill", color);
      if (color === this.highlightColor.greyscale) {
        cellView.model.attr("ellipse/stroke", color);
      }
    }
    highlightLink(cell, color) {
      const cellView = this.initRappidService.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      if (color === this.highlightColor.greyscale) {
        color = this.highlightColor.greyscaleLink;
      } else {
        cellView.model.attr("line/strokeWidth", "5");
      }
      cellView.model.attr("line/stroke", color);
      cellView.model.attr("targetMarker/fill", color);
    }
    highlightStates(cell, color) {
      const parent = cell.getParent();
      if (parent.getEmbeddedCells()) {
        const states = parent.getEmbeddedCells();
        for (const state of states) {
          this.highlightSingleState(state, color);
        }
      }
    }
    highlightSingleState(state, color) {
      const cellView = this.initRappidService.paper.findViewByModel(state);
      if (!cellView) {
        return;
      }
      cellView.model.attr("rect/fill", color);
      if (color === this.highlightColor.greyscale) {
        cellView.model.attr("rect/stroke", color);
      }
    }
    generateResultsOPD(arrID) {
      this.debug("Generating Temporary Result OPD for parsing");
      // Get All Things and Links to keep
      this.GraphDBmsg.next("Generating result OPL");
      const visualsToKeep = this.getVisualsByArrID(arrID);
      const clonedVisuals = this.cloneVisuals(visualsToKeep.things, visualsToKeep.links);
      // Generate new OPD with only things to kept
      const OPMQueryResultOPD = new OpmOpd("OPMQueryResult");
      OPMQueryResultOPD.id = this._treeViewService.initRappid.opmModel.getOPMQueryID() + "ReSuLt";
      OPMQueryResultOPD.visualElements = clonedVisuals;
      return OPMQueryResultOPD;
    }
    removeResultsOPD(resultOPD) {
      this.debug("Removing Temporary Result OPD");
      const opmResOPD_id = resultOPD.id;
      if (this._treeViewService.initRappid.opmModel.getOpd(resultOPD.id) !== null) {
        this._treeViewService.initRappid.opmModel.removeOpd(resultOPD.id);
      }
    }
    getOPLfromResultOPD(resultOPD) {
      this.debug("Generating Dedciated OPL sentences");
      const graph = this.graphService.renderGraphSilent(resultOPD);
      const options = {
        graph: graph,
        opmModel: this._treeViewService.initRappid.opmModel
      };
      const allOpl = this.oplService.generateOpl(options);
      let oplArray = [];
      for (const opl of allOpl.filter(o => o.cells.length > 1)) {
        oplArray.push(opl);
      }
      switch (this.conf.query) {
        case "Shortest Path":
          {
            const oplArraySorted = this.sortOPLarray(oplArray);
            return oplArraySorted;
          }
        case "PageRank":
          {
            oplArray = [];
            oplArray.push(allOpl[0]);
            return oplArray;
          }
        default:
          {
            return oplArray;
          }
      }
    }
    sortOPLarray(OPLs) {
      this.debug("Sorting OPL");
      let start = this.conf.source._text;
      const arr = [];
      let exitSignal = OPLs.length;
      while (start !== this.conf.target._text && exitSignal) {
        for (const opl of OPLs) {
          for (const cell of opl.cells) {
            if (cell.attributes.type === "opm.Link") {
              if (cell.sourceElement.lastEnteredText === start) {
                arr.push(opl);
                start = cell.targetElement.lastEnteredText;
                break;
              }
            }
          }
        }
        exitSignal = exitSignal - 1;
      }
      return arr;
    }
    getVisualsByArrID(arrID) {
      const thingsToKeep = [];
      const linksToKeep = [];
      for (const id of arrID) {
        const v_things = this.flatOPD.visualElements.filter(v => v.id === id && v instanceof OpmVisualThing);
        const v_links = this.flatOPD.visualElements.filter(v => v.id === id && v instanceof OpmLink);
        if (v_things.length === 1) {
          thingsToKeep.push(v_things[0]);
        }
        if (v_links.length === 1) {
          linksToKeep.push(v_links[0]);
        }
      }
      return {
        things: thingsToKeep,
        links: linksToKeep
      };
    }
    removeVisuals(keepID) {
      const visualToKeep = this.getVisualsByArrID(keepID);
      this.flatOPD.visualElements = visualToKeep.things;
      for (const l of visualToKeep.links) {
        this.flatOPD.visualElements.push(l);
      }
    }
    rePositionVisuals(arrID) {
      this.debug("Changing Visuals position");
      // Initial position
      let xPos;
      let yPos;
      const dPos = 65;
      const columns = 5;
      // Identify source and destination
      const myVisuals = this.getVisualsByArrID(arrID);
      let start;
      let end;
      for (const v of myVisuals.things) {
        if (this.conf.source && v.logicalElement.text === this.conf.source._text) {
          start = v;
        }
        if (this.conf.target && v.logicalElement.text === this.conf.target._text) {
          end = v;
        }
      }
      switch (this.conf.type) {
        case "Neighborhood":
          {
            // Arrange the rest of the elements by paths
            const paths = this.splitVisualsToPaths(myVisuals, start);
            let maxH = 0;
            let totalH = 0;
            const moved = [];
            for (let i = 0; i < paths.length; i++) {
              xPos = 30 + start.width / 2 + dPos;
              yPos = 50 + totalH;
              for (let j = 1; j < paths[i].length; j++) {
                // starts from 1 to skip root node
                if (!paths[i][j]) {
                  continue;
                }
                xPos = xPos + paths[i][j].width / 2;
                if (!moved.includes(paths[i][j])) {
                  this.setVisualPosition(paths[i][j], {
                    x: xPos,
                    y: yPos
                  });
                  moved.push(paths[i][j]);
                  maxH = paths[i][j].height > maxH ? paths[i][j].height : maxH;
                }
                xPos = xPos + paths[i][j].width / 2 + dPos;
              }
              totalH = totalH + maxH / 2 + dPos;
              maxH = 0;
            }
            this.setVisualPosition(start, {
              x: 30,
              y: totalH / 2
            });
            break;
          }
        case "Path Finding":
          {
            // Initial position
            xPos = 30;
            yPos = 50;
            // Reposition result opm things
            this.setVisualPosition(start, {
              x: xPos,
              y: yPos
            });
            let count = 1;
            let direction = 1;
            let exitSignal = myVisuals.links.length;
            while (start !== end && exitSignal) {
              for (const link of myVisuals.links) {
                if (link.sourceVisualElement === start) {
                  count = count + 1;
                  if (count > columns) {
                    // tslint:disable-next-line: max-line-length
                    const delta = link.sourceVisualElement.height / 2 + link.targetVisualElements[0].targetVisualElement.height / 2 + dPos;
                    yPos = yPos + delta;
                    count = 1;
                    direction = direction * -1;
                  } else {
                    const delta = link.sourceVisualElement.width / 2 + link.targetVisualElements[0].targetVisualElement.width / 2 + dPos;
                    xPos = xPos + direction * delta;
                  }
                  this.setVisualPosition(link.targetVisualElements[0].targetVisualElement, {
                    x: xPos,
                    y: yPos
                  });
                  start = link.targetVisualElements[0].targetVisualElement;
                  break;
                }
              }
              exitSignal = exitSignal - 1;
            }
            // Bring down all the opm things that might interrupt
            for (let i = 0; i < this.flatOPD.visualElements.length; i++) {
              if (!myVisuals.things.includes(this.flatOPD.visualElements[i])) {
                this.flatOPD.visualElements[i].yPos = this.flatOPD.visualElements[i].yPos + yPos + dPos;
              }
            }
            break;
          }
      }
    }
    splitVisualsToPaths(visualsAll, startV) {
      this.debug("Creating multiple paths from the result");
      const levels = this.splitVisualtToLevels(startV, visualsAll);
      const paths = [];
      const used_nodes = [];
      let index = -1;
      for (let d = this.conf.maxDepth; d > 0; d--) {
        if (!levels[d] || levels[d].nodes.length === 0) {
          continue;
        }
        for (const v of levels[d].nodes) {
          if (used_nodes.includes(v)) {
            continue;
          }
          used_nodes.push(v);
          index++;
          paths[index] = [];
          paths[index][0] = startV;
          paths[index][d] = v;
          for (let d2 = d - 1; d2 > 0; d2--) {
            for (const l of levels[d2 + 1].links.filter(link => link.targetVisualElements[0].targetVisualElement === v || link.sourceVisualElement === v)) {
              const l_src = l.sourceVisualElement;
              const l_trg = l.targetVisualElements[0].targetVisualElement;
              if (l_trg === v && levels[d2].nodes.includes(l_src)) {
                paths[index][d2] = l_src;
                if (!used_nodes.includes(l_src)) {
                  used_nodes.push(l_src);
                }
                break;
              }
              if (l_src === v && levels[d2].nodes.includes(l_trg)) {
                paths[index][d2] = l_trg;
                if (!used_nodes.includes(l_trg)) {
                  used_nodes.push(l_trg);
                }
                break;
              }
            }
          }
        }
      }
      return paths;
    }
    splitVisualtToLevels(startV, visualsAll) {
      /* levels structure:
            nodes = nodes in current depth level
            links = links from previous level to current level
      */
      this.debug("Creating depth level array from the result");
      const levels = [];
      levels[0] = {
        nodes: [startV],
        links: []
      };
      for (let d = 1; d < this.conf.maxDepth + 1; d++) {
        levels[d] = {
          nodes: [],
          links: []
        };
        const push2level = [];
        if (this.conf.query === "Unidirectional" || this.conf.query === "Directional" && this.conf.direction && this.conf.direction === "OUTGOING") {
          for (const l of visualsAll.links.filter(link => levels[d - 1].nodes.includes(link.sourceVisualElement))) {
            push2level.push(l.targetVisualElements[0].targetVisualElement);
            levels[d].links.push(l);
          }
        }
        if (this.conf.query === "Unidirectional" || this.conf.query === "Directional" && this.conf.direction && this.conf.direction === "INCOMING") {
          for (const l of visualsAll.links.filter(link => levels[d - 1].nodes.includes(link.targetVisualElements[0].targetVisualElement))) {
            push2level.push(l.sourceVisualElement);
            levels[d].links.push(l);
          }
        }
        // push to level only uniq visuals which does not appear in other levels
        for (const v of push2level) {
          let found = false;
          for (let j = 0; j < d + 1; j++) {
            if (levels[j].nodes.includes(v)) {
              found = true;
              break;
            }
          }
          if (!found) {
            levels[d].nodes.push(v);
          }
        }
      }
      return levels;
    }
    setVisualPosition(visual, posConf) {
      for (let i = 0; i < this.flatOPD.visualElements.length; i++) {
        if (this.flatOPD.visualElements[i] === visual) {
          this.flatOPD.visualElements[i].xPos = posConf.x;
          this.flatOPD.visualElements[i].yPos = posConf.y;
          break;
        }
      }
    }
    cloneVisuals(things, links) {
      const clonedMap = [];
      const clonedVisuals = [];
      for (const t of things) {
        const cloned_t = t.clone();
        clonedMap[t.id] = cloned_t.id;
        clonedVisuals.push(cloned_t);
      }
      for (const l of links) {
        const cloned_l = l.clone();
        // Assign relevant source
        const src_id = l.sourceVisualElement.id;
        cloned_l.sourceVisualElement = clonedVisuals.filter(v => v instanceof OpmVisualThing && v.id === clonedMap[src_id])[0];
        // Assign relevant target
        const trg_id = l.targetVisualElements[0].targetVisualElement.id;
        cloned_l.targetVisualElements[0].targetVisualElement = clonedVisuals.filter(v => v instanceof OpmVisualThing && v.id === clonedMap[trg_id])[0];
        clonedVisuals.push(cloned_l);
      }
      return clonedVisuals;
    }
    changeDBmsg(msg) {
      this.GraphDBmsg.next(msg);
    }
    /* Work with Neo4J driver functions */
    ExecuteQuery(queryArr) {
      var _this5 = this;
      this.debug("Executing a query against Neo4J");
      let neo4j_resp = {
        isError: false,
        errorMsg: null,
        result: null
      };
      this.GraphDBmsg.next("Executing query on the DB");
      return new Promise(/*#__PURE__*/function () {
        var _ref5 = (0, default)(function* (resolve, reject) {
          for (const q of queryArr) {
            yield _this5.session.run(q).then(res => {
              neo4j_resp = {
                isError: false,
                errorMsg: null,
                result: JSON.parse(JSON.stringify(res))
              };
              _this5.debug("Query Execution Result:Success");
            }).catch(err => {
              const resultStr = "{ \"ExecuteQueries\":\"Failure\",\"Queries\":\"" + q + "\"}";
              console.error("Failed execute queries against Neo4j GraphDB. Error: ", err.message);
              neo4j_resp = {
                isError: true,
                errorMsg: "Failed to execute queries against Neo4j GraphDB:" + err.message,
                result: JSON.parse(resultStr)
              };
              _this5.debug("Query Execution Result: Failure");
              reject(neo4j_resp);
            });
          }
          resolve(neo4j_resp);
        });
        return function (_x7, _x8) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
    relableState(state) {
      const txt = state.text.toString();
      const parent_txt = state.parent.text.toString();
      const return_str = txt.charAt(0).toUpperCase() + txt.slice(1) + " " + parent_txt;
      return return_str;
    }
    getPath() {
      var _this6 = this;
      this.debug("Adding  path finding query to Cypher Query Array");
      const query = [];
      const that = this;
      let unknown_q = false;
      // Build Query
      const cypher_src = `source:${this.conf.source.type} {name:'${this.conf.source._text.replace(/'/, "")}'}`;
      const cypher_trg = `target:${this.conf.target.type} {name:'${this.conf.target._text.replace(/'/, "")}'}`;
      const cypher_direction = "OUTGOING";
      const cypher_weight = "null";
      let cypher_q = "";
      switch (this.conf.query) {
        case "Shortest Path":
          {
            cypher_q = `MATCH (${cypher_src}),(${cypher_trg}),
                  p=shortestpath((source)-[*]->(target))
                  RETURN p`;
            break;
          }
        case "Longest Path":
          {
            cypher_q = `MATCH p=(${cypher_src})-[*]->(${cypher_trg})
                WITH p, range(1,length(p)) AS z
                WHERE ALL(i IN z WHERE nodes(p)[i] <> source)
                WITH p
                ORDER BY length(p) DESC
                RETURN p
                LIMIT 1`;
            break;
          }
        default:
          {
            unknown_q = true;
          }
      }
      this.debug("Query added: " + cypher_q);
      query.push(cypher_q);
      return new Promise(/*#__PURE__*/function () {
        var _ref6 = (0, default)(function* (resolve, reject) {
          if (unknown_q) {
            reject("Unkown Query Type");
          }
          yield _this6.ExecuteQuery(query).then(res => {
            _this6.GraphDBmsg.next("Analyzing Result from DB");
            const map = _this6.parseNeo4jtoPath(res);
            if (Object.keys(map.nodes).length === 0) {
              reject("Can't identify the Path between those two elements");
            } else {
              // let conf = {source: src._text, target: trg._text};
              _this6.GraphDBmsg.next("Generating OPD from query result");
              const result = _this6.DisplayResults(map);
              resolve(result);
            }
          }).catch(err => {
            console.error("Failed to execute Finding Path query:", err);
            reject("Failed to execute Finding Path query");
          });
        });
        return function (_x9, _x10) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
    getNeighborhood() {
      var _this7 = this;
      this.debug("Adding neighborhood query to Cypher Query Array");
      const query = [];
      const that = this;
      let unknown_q = false;
      // Build Query
      const cypher_source = `source:${this.conf.source.type} {name:'${this.conf.source._text.replace(/'/, "")}'}`;
      let cypher_q = "";
      switch (this.conf.query) {
        case "Unidirectional":
          {
            cypher_q = `MATCH p=(${cypher_source})-[*1..${this.conf.maxDepth}]-(child)
                  RETURN p`;
            break;
          }
        case "Directional":
          {
            if (this.conf.direction === "OUTGOING") {
              cypher_q = `MATCH p=(${cypher_source})-[*1..${this.conf.maxDepth}]->(child)
                  RETURN p`;
            } else {
              // Incoming
              cypher_q = `MATCH p=(child)-[*1..${this.conf.maxDepth}]->(${cypher_source})
                  RETURN p`;
            }
            break;
          }
        default:
          {
            unknown_q = true;
          }
      }
      if (this.conf.onlyProcedural) {
        cypher_q = cypher_q.replace("RETURN p", "WHERE ALL(r in relationships(p) WHERE type(r) = \"OpmProceduralRelation\") RETURN p");
      }
      this.debug("neighborhood query: " + cypher_q);
      query.push(cypher_q);
      return new Promise(/*#__PURE__*/function () {
        var _ref7 = (0, default)(function* (resolve, reject) {
          if (unknown_q) {
            reject("Unkown Query Type");
          }
          yield _this7.ExecuteQuery(query).then(res => {
            _this7.GraphDBmsg.next("Analyzing Result from DB");
            const map = _this7.parseNeo4jtoPath(res);
            if (Object.keys(map.nodes).length === 0) {
              reject("Can't identify links from/to the root node");
            } else {
              _this7.GraphDBmsg.next("Generating OPD from query result");
              const result = _this7.DisplayResults(map);
              resolve(result);
            }
          }).catch(err => {
            console.error("Failed to execute Finding Path query:", err);
            reject("Failed to execute Finding Path query");
          });
        });
        return function (_x11, _x12) {
          return _ref7.apply(this, arguments);
        };
      }());
    }
    getCentrality() {
      var _this8 = this;
      this.debug("Creating Centrality query to retrieve data");
      const query = [];
      const that = this;
      let unknown_q = false;
      // Build Query
      let cypher_q = "";
      const cypher_thing = this.conf.thingType === "Any" ? "THING" : this.conf.thingType === "Object" ? "object" : "process";
      const cypher_rel = this.conf.linkType === "Any" ? "LINKS" : this.conf.linkType === "Fundamental" ? "OpmFundamentalRelation" : "OpmProceduralRelation";
      switch (this.conf.query) {
        case "PageRank":
          {
            cypher_q = `CALL algo.pageRank.stream("${cypher_thing}", "${cypher_rel}",
                    {iterations:20})
                    YIELD nodeId, score
                    MATCH (node) WHERE id(node) = nodeId
                    RETURN algo.getNodeById(nodeId),score
                    ORDER BY score DESC
                    LIMIT ${this.conf.numberOfItems}`;
            break;
          }
        default:
          {
            unknown_q = true;
          }
      }
      this.debug(["Centrality query:", cypher_q]);
      query.push(cypher_q);
      return new Promise(/*#__PURE__*/function () {
        var _ref8 = (0, default)(function* (resolve, reject) {
          if (unknown_q) {
            reject("Unkown Query Type");
          }
          yield _this8.ExecuteQuery(query).then(res => {
            _this8.GraphDBmsg.next("Analyzing Result from DB");
            _this8.debug(res);
            const map = _this8.parseNeo4jtoTable(res);
            _this8.debug(["Parsed Result:", map]);
            if (Object.keys(map.nodes).length === 0) {
              reject("Can't identify high ranked node");
            } else {
              _this8.GraphDBmsg.next("Generating OPD from query result");
              const res = _this8.DisplayResults(map);
              resolve(res);
            }
          }).catch(err => {
            console.error("Failed to execute Finding Path query:", err);
            reject("Failed to execute Finding Path query");
          });
        });
        return function (_x13, _x14) {
          return _ref8.apply(this, arguments);
        };
      }());
    }
    parseNeo4jtoPath(res) {
      this.debug("Parsing Query result from Neo4J");
      let nodes = [];
      let links = [];
      const that = this;
      res = res.result;
      if (res.records.length === 0) {
        // There was no path
        return {
          nodes: nodes,
          links: links
        };
      }
      // Inserting segments
      for (const segment of res.records[0]._fields[0].segments) {
        const n = segment.start;
        if (that.idIndex(nodes, n.elementId) == null) {
          nodes.push({
            id: n.elementId,
            label: n.labels[0],
            title: n.properties.name,
            opm_id: n.properties.opm_id
          });
        }
        const r = segment.relationship;
        links = links.concat({
          start: that.idIndex(nodes, r.startNodeElementId),
          end: that.idIndex(nodes, r.endNodeElementId),
          type: r.type,
          opm_id: r.properties.opm_id
        });
      }
      // Inserting start node
      nodes.push({
        id: res.records[0]._fields[0].end.elementId,
        label: res.records[0]._fields[0].end.labels[0],
        title: res.records[0]._fields[0].end.properties.name,
        opm_id: res.records[0]._fields[0].end.properties.opm_id
      });
      const viz = {
        nodes: nodes,
        links: links
      };
      this.debug("Parse Result: " + viz);
      return viz;
    }
    parseNeo4jtoTable(res) {
      this.debug("Parsing Query result from Neo4J");
      const nodes = [];
      const table = [];
      const table_columns = [];
      res = res.result;
      // Populate columns
      // Table_columns.push('node');
      for (let j = 1; j < res.records[0].columns.length; j++) {
        table_columns.push(res.records[0].columns[j]);
      }
      // Populate nodes and table values
      res.results[0].data.forEach(function (entry) {
        const row = entry.row;
        nodes.push({
          title: row[0].name,
          opm_id: row[0].opm_id
        });
        const data = [];
        data.node = row[0].name;
        for (let i = 1; i < row.length; i++) {
          data[res.results[0].columns[i]] = row[i];
        }
        table.push(data);
      });
      const viz = {
        nodes: nodes,
        data: table,
        columns: table_columns
      };
      this.debug("Parse Result: " + viz);
      return viz;
    }
    idIndex(a, id) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].id === id) {
          return i;
        }
      }
      return null;
    }
    static #_ = (() => this.ɵfac = function GraphDBService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GraphDBService)(core /* ɵɵinject */.KVO(InitRappidService), core /* ɵɵinject */.KVO(GraphService), core /* ɵɵinject */.KVO(HttpClient), core /* ɵɵinject */.KVO(TreeViewService), core /* ɵɵinject */.KVO(OplService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: GraphDBService,
      factory: GraphDBService.ɵfac
    }))();
  }
  return GraphDBService;
})();