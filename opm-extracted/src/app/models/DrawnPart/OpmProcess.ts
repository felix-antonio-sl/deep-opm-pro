// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/OpmProcess.ts
// Extracted by opm-extracted/tools/extract.mjs

    const uuid = joint.util.uuid;
    let OpmProcess = /*#__PURE__*/(() => {
      class OpmProcess extends OpmThing {
        static #_ = (() => this.counter = 0)();
        static resetCounter() {
          OpmProcess.counter = 0;
        }
        static center(element) {
          if (!element) {
            return {
              x: 0,
              y: 0
            };
          }
          const pos = element.get("position");
          const size = element.get("size");
          return {
            x: pos.x + size.width / 2,
            y: pos.y + size.height / 2
          };
        }
        constructor() {
          super();
          this.portsDirs = [];
          this.selfInvocationLink = {
            link: null,
            relative: {
              x: 0,
              y: 0
            }
          };
          this.inZooming = false;
          this.shape = "ellipse";
          this.set(this.processAttributes());
          this.attr(this.processAttrs());
          this.attr({
            image: {
              // 'ref-width': '120%',
              // 'ref-height': '120%',
              // 'ref-x': '-10%',
              // 'ref-y': '-10%'
              "ref-width": "90%",
              "ref-height": "90%",
              "ref-x": "5%",
              "ref-y": "5%"
            }
          });
        }
        ellipseOutlinePointFromAngle(midX, midY, rh, rv, angle) {
          const x = rv * Math.sin(angle) + midX;
          const y = rh * Math.cos(angle) + midY;
          return {
            x: x,
            y: y
          };
        }
        addCustomPort(point) {
          const portId = uuid();
          const size = this.get("size");
          const refX = Math.max(0, Math.min(point.x / size.width, 1));
          const refY = Math.max(0, Math.min(point.y / size.height, 1));
          this.addPort({
            id: portId,
            group: "aaa",
            args: {
              x: refX,
              y: refY
            },
            markup: this.defaultPortMarkup
          });
          return portId;
        }
        addOldPortsForSelfInvocation() {
          const existingPorts = this.getPorts();
          for (let i = 1; i <= 30; i++) {
            if (existingPorts.find(p => p.id === i)) {
              continue;
            }
            const portData = this.convertOldPortToRelativePosition(i);
            this.addPort({
              id: i,
              group: "aaa",
              args: {
                x: portData.refX,
                y: portData.refY
              },
              markup: this.defaultPortMarkup
            });
            this.portsDirs.push({
              id: i,
              dist: 0,
              dir: i * 12
            });
          }
          this.calcPortDirsAndDist();
        }
        convertOldPortToRelativePosition(portId) {
          const covnvertionTable = [{
            id: 1,
            refX: 0.5,
            refY: 0
          }, {
            id: 2,
            refX: 0.6,
            refY: 0.01
          }, {
            id: 3,
            refX: 0.7,
            refY: 0.04
          }, {
            id: 4,
            refX: 0.8,
            refY: 0.1
          }, {
            id: 5,
            refX: 0.87,
            refY: 0.16
          }, {
            id: 6,
            refX: 0.93,
            refY: 0.25
          }, {
            id: 7,
            refX: 0.975,
            refY: 0.34
          }, {
            id: 8,
            refX: 0.997,
            refY: 0.447
          }, {
            id: 9,
            refX: 0.997,
            refY: 0.552
          }, {
            id: 10,
            refX: 0.975,
            refY: 0.653
          }, {
            id: 11,
            refX: 0.932,
            refY: 0.75
          }, {
            id: 12,
            refX: 0.871,
            refY: 0.835
          }, {
            id: 13,
            refX: 0.8,
            refY: 0.9
          }, {
            id: 14,
            refX: 0.7,
            refY: 0.958
          }, {
            id: 15,
            refX: 0.604,
            refY: 0.988
          }, {
            id: 16,
            refX: 0.5,
            refY: 1
          }, {
            id: 17,
            refX: 0.395,
            refY: 0.988
          }, {
            id: 18,
            refX: 0.296,
            refY: 0.958
          }, {
            id: 19,
            refX: 0.206,
            refY: 0.9
          }, {
            id: 20,
            refX: 0.128,
            refY: 0.835
          }, {
            id: 21,
            refX: 0.067,
            refY: 0.75
          }, {
            id: 22,
            refX: 0.05,
            refY: 0.653
          }, {
            id: 23,
            refX: 0.002,
            refY: 0.55
          }, {
            id: 24,
            refX: 0.002,
            refY: 0.447
          }, {
            id: 25,
            refX: 0.024,
            refY: 0.346
          }, {
            id: 26,
            refX: 0.067,
            refY: 0.25
          }, {
            id: 27,
            refX: 0.128,
            refY: 0.164
          }, {
            id: 28,
            refX: 0.206,
            refY: 0.095
          }, {
            id: 29,
            refX: 0.296,
            refY: 0.041
          }, {
            id: 30,
            refX: 0.395,
            refY: 0.011
          }];
          return covnvertionTable.find(item => Number(portId) === item.id);
        }
        openTextEditor(cellView, initRappid, onFinish = () => {}) {
          if (this.getVisual().logicalElement.getIsWaitingProcess()) {
            return;
          }
          super.openTextEditor(cellView, initRappid, onFinish);
        }
        // createPorts(visual) {
        //   // for (const index of Array.from({length: 30}, (x, i) => i + 1)) {
        //   //   const refData = this.convertOldPortToRelativePosition(index);
        //   //   this.addPort({ id: index, group: 'aaa', args: { x: refData.refX, y: refData.refY }, markup: this.defaultPortMarkup });
        //   // }
        // }
        getShape() {
          return this.shape;
        }
        get url() {
          return this.url_;
        }
        get text() {
          return this.text_;
        }
        get topic() {
          return this.topic_;
        }
        get topic_type() {
          return this.topic_type_;
        }
        get topic_what() {
          return this.topic_what_;
        }
        set url(url) {
          this.url_ = url;
        }
        set text(text) {
          this.text_ = text;
        }
        set topic(topic) {
          this.topic_ = topic;
        }
        set topic_type(topic_type) {
          this.topic_type_ = topic_type;
        }
        set topic_what(topic_what) {
          this.topic_what_ = topic_what;
        }
        set rosscript_content(rosscript_content) {
          this.rosscript_content_ = rosscript_content;
        }
        set ros_message(ros_message) {
          this.ros_message_ = ros_message;
        }
        set Query_what(Query_what) {
          this.Query_what_ = Query_what;
        }
        set sql_select_field(sql_select_field) {
          this.sql_select_field_ = sql_select_field;
        }
        set sql_from_field(sql_from_field) {
          this.sql_from_field_ = sql_from_field;
        }
        set sql_where_field(sql_where_field) {
          this.sql_where_field_ = sql_where_field;
        }
        set sql_update_field(sql_update_field) {
          this.sql_update_field_ = sql_update_field;
        }
        set sql_set_field(sql_set_field) {
          this.sql_set_field_ = sql_set_field;
        }
        set sql_delete_field(sql_delete_field) {
          this.sql_delete_field_ = sql_delete_field;
        }
        set sql_insert_field(sql_insert_field) {
          this.sql_insert_field_ = sql_insert_field;
        }
        set sql_values(sql_values) {
          this.sql_values_ = sql_values;
        }
        set sql_create_table_field(sql_create_table_field) {
          this.sql_create_table_field_ = sql_create_table_field;
        }
        set sql_drop_table_field(sql_drop_table_field) {
          this.sql_drop_table_field_ = sql_drop_table_field;
        }
        set sql_user_define_field(sql_user_define_field) {
          this.sql_user_define_field_ = sql_user_define_field;
        }
        updateEntityFromOpmModel(visualElement) {
          const result = super.updateEntityFromOpmModel(visualElement);
          this.inZooming = !!visualElement.refineable;
          //const text = (visualElement.getRefineeInzoom() && visualElement.getRefineeInzoom() === this.getVisual()) || (visualElement.getRefineeUnfold() && visualElement.getRefineeUnfold() === this.getVisual()) ?
          // visualElement.logicalElement.getBareName() : visualElement.logicalElement.getDisplayText();
          const text = visualElement.getDisplayText();
          this.attr("text/textWrap/text", text);
          return result;
        }
        greyOutEntity() {
          if ((0, getInitRappidShared)().exportingOpl) {
            return;
          }
          if (this.getVisual().logicalElement.shouldBeGreyed === true && (0, getInitRappidShared)().shouldGreyOut) {
            this.graph.startBatch("ignoreChange");
            const attr = {
              ellipse: {
                stroke: "grey",
                fill: "lightgrey"
              }
            };
            this.attr(attr);
            this.graph.stopBatch("ignoreChange");
          } else {
            this.graph.startBatch("ignoreChange");
            const vis = this.getVisual();
            if (vis.fill === "lightgrey" && vis.strokeColor === "grey") {
              vis.fill = (0, getStyles)("opm.Process").fill;
              vis.strokeColor = (0, getStyles)("opm.Process").stroke;
            }
            this.updateParamsFromOpmModel(vis);
            this.graph.stopBatch("ignoreChange");
          }
        }
        /**
         * calculates the direction of the parameter vector.
         * @param diff vector direction with x, y coordinates.
         */
        calcDir(diff) {
          return (360 + Math.atan2(diff.x, -diff.y) * 180 / Math.PI) % 360;
        }
        /**
         * computes the abs angle between two dirs
         * @param dir1
         * @param dir2
         */
        calcDirGap(dir1, dir2) {
          const gap = dir1 - dir2;
          return Math.min(gap < 0 ? gap + 360 : gap, gap > 0 ? 360 - gap : -gap);
        }
        /**
         * Whenever the shape is changed, recalculate correct port directions for self invocation and other
         * needs to use ports properly geometrical.
         */
        calcPortDirsAndDist() {
          const ports = this.getPortsPositions("aaa");
          const size = this.get("size");
          const numPorts = this.portsDirs.length;
          for (let i = 0; i < numPorts; i++) {
            const portDir = this.portsDirs[i];
            const prevPortDir = this.portsDirs[(numPorts + i - 1) % numPorts];
            const port = ports[portDir.id];
            const prevPort = ports[prevPortDir.id];
            this.portsDirs[i].dir = this.calcDir({
              x: port.x - size.width / 2,
              y: port.y - size.height / 2
            });
            this.portsDirs[i].dist = Math.max(Math.abs(port.x - prevPort.x), Math.abs(port.y - prevPort.y));
          }
        }
        /**
         * find the port with closes direction to that of the vector in the parameter
         * @param diff direction vector.
         */
        calcBestPortForDir(diff) {
          const dir = this.calcDir(diff);
          const size = this.get("size");
          // const origin = OpmProcess.center(this);
          const cPos = {
            x: diff.x + size.width / 2,
            y: diff.y + size.height / 2
          };
          const ports = this.getPortsPositions("aaa");
          const numPorts = this.portsDirs.length;
          const vPort = (numPorts + Math.round(dir / 360 * numPorts)) % numPorts;
          let bestPort = vPort;
          // let bestGap = 360;
          let bestDist = 100000;
          for (let i = -5; i <= 5; i++) {
            const p = (numPorts + vPort + i) % numPorts;
            const portId = this.portsDirs[p].id;
            const port = ports[portId];
            const dist = Math.sqrt(Math.pow(cPos.x - port.x, 2) + Math.pow(cPos.y - port.y, 2));
            // const g = this.calcDirGap(this.portsDirs[p].dir, dir);
            if (dist < bestDist) {
              bestDist = dist;
              bestPort = p;
            }
          }
          // console.log(`diff ${JSON.stringify(diff)}, bestPort ${bestPort}, bestGap ${bestGap}`);
          return bestPort;
        }
        getPortGroups() {
          // return {
          //   'spreaded': this.createPortGroup('ellipseSpread', { compensateRotation: true },
          //     0, 0, 1, 1),
          //   'extended': this.createPortGroup('ellipseSpread', { compensateRotation: true },
          //     -5, -5, 10, 10)
          // };
          return {
            aaa: {
              markup: this.defaultPortMarkup,
              position: (ports, elBBox, opt) => {
                return ports.map((port, index) => {
                  const ellipse = joint.g.ellipse.fromRect(elBBox);
                  const x = this.getPorts()[index].args.x;
                  const y = this.getPorts()[index].args.y;
                  const p = joint.g.point(elBBox.width * x, elBBox.height * y);
                  return ellipse.intersectionWithLineFromCenterToPoint(p);
                });
              }
            }
          };
        }
        changePositionHandle(initRapid, direction = null) {
          const center = OpmProcess.center;
          const operVectors = InvocationLink.operVectors;
          const selfInvocationLink = this.selfInvocationLink.link;
          if (selfInvocationLink) {
            selfInvocationLink.setPoint(operVectors(center(this), this.selfInvocationLink.relative)); // point = origin + relative;
          }
          // const connOrigin = center(connection);
          // let diff = operVectors(connOrigin, center(this), '-');
          // if (diff.x !== this.selfInvocationElement.relative.x && diff.x != this.selfInvocationElement.relative.y) {
          //   diff = this.selfInvocationElement.relative;
          // }
          super.changePositionHandle(initRapid, direction);
        }
        pointerUpHandle(cellView, init) {
          super.pointerUpHandle(cellView, init);
          const modelTreeChange = init.getOpmModel().autoOpdTreeSort;
          let shouldChangeTree;
          if (modelTreeChange === undefined) {
            shouldChangeTree = init.oplService.userOplSettings.opdTreeProcessesAutoArrangement;
          } else {
            shouldChangeTree = modelTreeChange;
          }
          if (shouldChangeTree && this.getVisual().fatherObject && OPCloudUtils.isInstanceOfVisualProcess(this.getVisual().fatherObject) && this.getVisual().fatherObject.getRefineeInzoom()?.id === this.getParentCell()?.id) {
            // a fix because pointerup is fired when double click fired - which causes this function to run when not needed.
            if (cellView.model.changed.position) {
              this.updateOpdTree(init);
            }
          }
        }
        /**
         * Sorts the Opd Tree according to order of refinables processes inside an inzoomed process.
         * Every change of refinable-process position relatively to other refinable-process (i.e: dragged to higher/lower
         * position) rearrange the Opd tree order.
         * * @param initRapid
         */
        updateOpdTree(initRapid) {
          const sortedInzoomedProcesses = this.getVisual().fatherObject.getThingChildrenOrder().filter(proc => !!proc.getRefineeInzoom() || !!proc.getRefineeUnfold());
          const sortedOpdsOfInzoomedProcesses = sortedInzoomedProcesses.filter(th => OPCloudUtils.isInstanceOfVisualProcess(th)).map(proc => this.getOpdOfRefinee(proc, initRapid));
          initRapid.getOpmModel().currentOpd.children.sort((a, b) => {
            if (sortedOpdsOfInzoomedProcesses.includes(a) && sortedOpdsOfInzoomedProcesses.includes(b)) {
              return sortedOpdsOfInzoomedProcesses.indexOf(a) - sortedOpdsOfInzoomedProcesses.indexOf(b);
            }
            return 0;
          });
          initRapid.treeViewService.init(initRapid.getOpmModel());
          // initRapid.opdHierarchyRef.sortOpdsToFixNewOrderLoading(initRapid); // no longer needed after the change in how opds are loaded
        }
        /**
         * Finds the Opd that holds the refinee of a refinable process.
         * @param proc
         * @param initRapid
         */
        getOpdOfRefinee(proc, initRappid) {
          const model = initRappid.getOpmModel();
          const procId = proc.getRefineeInzoom()?.id || proc.getRefineeUnfold()?.id;
          return model.getOpdByThingId(procId);
          // return initRappid.getOpmModel().opds.find(opd => {
          //   const opdId = opd.getInzoomedThing()?.id || opd.getUnfoldedThing()?.id;
          //   const procId = proc.getRefineeInzoom()?.id || proc.getRefineeUnfold()?.id;
          //   if (opdId === undefined && procId === undefined) {
          //     return false;
          //   }
          //   return (opdId === procId);
          // });
        }
        changeSizeHandle(initRappid, direction = null) {
          const selfInvocationLink = this.selfInvocationLink.link;
          if (selfInvocationLink) {
            const center = OpmProcess.center;
            const operVectors = InvocationLink.operVectors;
            const size = this.get("size");
            const relative = this.calcNewDiff(size.width / 2, size.height / 2, this.selfInvocationLink.relative);
            this.selfInvocationLink.relative = relative;
            selfInvocationLink.setPoint(operVectors(center(this), relative)); // point = origin + relative;
          }
          super.changeSizeHandle(initRappid, direction);
          // rappid bug!
          if (initRappid?.paper) {
            this.findView(initRappid.paper)?.update();
          }
          //
          this.redrawDuplicationMark(initRappid);
          this.updateURLArray();
        }
        /**
         * sets the relation between this process and its self invocation connection point.
         * @param selfInvocationLink the connection point to be associated with this process
         * @param apply boolean defaulted to false. If true, the connection point position is updated according to
         * the relative position recorded in the process.
         * @param changeLinks - if true, selfInvocation links of the process are also updated.
         */
        setSelfInvocationLink(selfInvocationLink) {
          const center = OpmProcess.center;
          const operVectors = InvocationLink.operVectors;
          if (!selfInvocationLink) {
            return;
          }
          this.selfInvocationLink.link = selfInvocationLink;
          const origin = center(this);
          this.selfInvocationLink.relative = operVectors(selfInvocationLink.getPoint(), origin, "-");
        }
        hasSelfInvocation() {
          let links = this.graph.getConnectedLinks(this, {
            inbound: true
          });
          links = links.filter(link => link.isSelfInvocation && link.isSelfInvocation());
          if (links.length > 0) {
            return links[0];
          } else {
            return undefined;
          }
        }
        isInZooming() {
          return this.inZooming;
        }
        /**
         * calculates a new diff that is on an ellipse larger by add pixels over the ellipse whose radii are the params a and b.
         * @param a horisontal radius of the elipse
         * @param b vertical radius of hte ellipse
         * @param diff current diff is also the radial line to intersect the ellipses.
         * @param add how much tro extend the ellipse radii.
         * @return a new diff vector on the larger ellipse.
         */
        calcNewDiff(a, b, diff, add = 60) {
          const dy2 = diff.y * diff.y;
          const dx2 = diff.x * diff.x;
          a += add;
          b += add;
          a *= a;
          b *= b;
          const ab2 = a / b;
          const y2 = dy2 === 0 ? 0 : a / (dx2 / dy2 + ab2);
          const x2 = Math.abs((1 - y2 / b) * a); // to compensate for small errors around the 0.
          return {
            x: Math.sign(diff.x) * Math.sqrt(x2),
            y: Math.sign(diff.y) * Math.sqrt(y2)
          };
        }
        /**
         * returns three vertices for the start, mid and end of a self invocation link (which has two parts).
         * @param connCenter if provided, no need to compute the mid , it is this point that is the center of the connection.
         * @param width width of the opening between the ports to be selected. default to 40.
         */
        getSelfInvocationMainVertices(connCenter, width = 40) {
          const dist = 60;
          const [pos, size] = [this.get("position"), this.get("size")];
          let [start, mid, end] = [0, connCenter, 0, 0];
          if (!connCenter) {
            if (size.height > size.width) {
              mid = {
                x: pos.x + size.width + dist,
                y: pos.y + size.height / 2
              };
            } else {
              mid = {
                x: pos.x + size.width / 2,
                y: pos.y + size.height + dist
              };
            }
          }
          const origin = OpmProcess.center(this);
          let diff = InvocationLink.operVectors(mid, origin, "-");
          diff = this.calcNewDiff(size.width / 2, size.height / 2, diff, dist); // to be on an enlarged ellipse over the process ellipse.
          mid = InvocationLink.operVectors(origin, diff);
          const ports = this.getPortsPositions("aaa");
          const numPorts = this.portsDirs.length;
          const vPort = this.calcBestPortForDir(diff);
          const vPortId = this.portsDirs[vPort].id;
          const dir = this.calcDir({
            x: mid.x - pos.x - ports[vPortId].x,
            y: mid.y - pos.y - ports[vPortId].y
          });
          // const vPort = (numPorts + dir / 360 * numPorts) % numPorts;
          if (width === 0) {
            start = end = vPort;
          } else {
            start = (numPorts + vPort - 1) % numPorts;
            end = (numPorts + vPort + 1) % numPorts;
            let totalWidth = this.portsDirs[start].dist + this.portsDirs[vPort].dist;
            let backward = false;
            while (totalWidth < width && (numPorts + end - start) % numPorts < 5) {
              if (backward) {
                start = (numPorts + start - 1) % numPorts;
                totalWidth += this.portsDirs[start].dist;
              } else {
                totalWidth += this.portsDirs[end].dist;
                end = (numPorts + end + 1) % numPorts;
              }
              backward = !backward;
            }
            // console.log(`totaWidth: ${totalWidth}`);
            // const gap = Math.sqrt(Math.pow(ports[start].x - ports[end].x, 2) + Math.pow(ports[start].y - ports[end].y, 2));
            // const pGap = Math.min(4, width / gap);
            // start = (numPorts + Math.floor(vPort - pGap / 2)) % numPorts;
            // end = (numPorts + Math.ceil(vPort + pGap / 2)) % numPorts;
          }
          // console.log(`R:${Math.round(sRadius)}/${Math.round(bRadius)}, D:${Math.round(dir)},
          // V:${Math.round(vPort)} - VA:${360 + ports[Math.round(vPort)%numPorts].angle}, S:${start}, E:${end}.`);
          return [this.portsDirs[start].id, mid, this.portsDirs[end].id];
        }
        processAttributes() {
          return {
            markup: `<ellipse/><text/>`,
            type: "opm.Process",
            padding: 35
          };
        }
        getCounter() {
          OpmProcess.counter = OpmProcess.counter % 26;
          return ++OpmProcess.counter;
        }
        getNextPort(port) {
          if (port === 30) {
            return 1;
          }
          return port + 1;
        }
        processAttrs() {
          const styleSettings = this.setStyleSettings();
          const init = (0, getInitRappidShared)();
          if (init) {
            const oplService = init.oplService;
            if (oplService) {
              this.setRelevantStyleSettings(styleSettings, oplService);
            }
          }
          return {
            ellipse: {
              ...this.entityShape(),
              ...this.thingShape(),
              ...{
                stroke: styleSettings.border_color,
                rx: 1,
                ry: 1,
                cx: 1,
                cy: 1,
                fill: styleSettings.fill_color
              },
              ...{
                refRx: "50%",
                refRy: "50%",
                refCy: "50%",
                refCx: "50%"
              }
            },
            text: {
              textWrap: {
                text: "Process",
                width: "70%"
              },
              fill: styleSettings.text_color,
              "font-size": styleSettings.font_size,
              "font-family": styleSettings.font
            }
          };
        }
        getParams() {
          const functionValue = this.attr("value/value");
          let temporal_insertedFunction;
          switch (functionValue) {
            case "userDefined":
              temporal_insertedFunction = this.get("userDefinedFunction");
              break;
            case "userPythonDefined":
              temporal_insertedFunction = this.get("userPythonDefinedFunction");
              break;
            case "userGenAIDefined":
              temporal_insertedFunction = this.get("userGenAIDefinedFunction");
              break;
            case "external":
              temporal_insertedFunction = this.get("externalFunction");
              break;
            case "ros":
              temporal_insertedFunction = this.get("ros");
              break;
            case "mqtt":
              temporal_insertedFunction = this.get("mqtt");
              break;
            case "sql":
              temporal_insertedFunction = this.get("sql");
              break;
            default:
              temporal_insertedFunction = functionValue;
              break;
          }
          const params = {
            code: functionValue,
            insertedFunction: temporal_insertedFunction
          };
          return {
            ...super.getThingParams(),
            ...params
          };
        }
        updateParamsFromOpmModel(visualElement) {
          this.attr({
            ".": {
              opacity: visualElement.belongsToSubModel || visualElement.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel || v.belongsToFatherModelId) ? 0.6 : 1
            }
          });
          let value;
          let userDefinedFunction;
          let externalFunction;
          let ROSFunction;
          let MQTTFunction;
          let SQLFunction;
          let userPythonDefinedFunction;
          let userGenAIDefinedFunction;
          if (visualElement.logicalElement.code === code.Unspecified) {
            value = "None";
          } else if (visualElement.logicalElement.code === code.PreDefined) {
            value = visualElement.logicalElement.insertedFunction;
          } else if (visualElement.logicalElement.code === code.UserDefined) {
            value = "userDefined";
            userDefinedFunction = visualElement.logicalElement.insertedFunction;
          } else if (visualElement.logicalElement.code === code.Python) {
            value = "userPythonDefined";
            userPythonDefinedFunction = visualElement.logicalElement.insertedFunction;
          } else if (visualElement.logicalElement.code === code.GenAI) {
            value = "userGenAIDefined";
            userGenAIDefinedFunction = visualElement.logicalElement.insertedFunction;
          } else if (visualElement.logicalElement.code === code.ROS) {
            value = "ros";
            ROSFunction = visualElement.logicalElement.insertedFunction;
          } else if (visualElement.logicalElement.code === code.MQTT) {
            value = "mqtt";
            MQTTFunction = visualElement.logicalElement.insertedFunction;
          } else if (visualElement.logicalElement.code === code.SQL) {
            value = "sql";
            SQLFunction = visualElement.logicalElement.insertedFunction;
          } else {
            value = "external";
            externalFunction = visualElement.logicalElement.insertedFunction;
          }
          const attr = {
            ellipse: {
              ...this.updateEntityFromOpmModel(visualElement),
              ...this.updateThingFromOpmModel(visualElement),
              ...{
                "stroke-width": visualElement.getCorrectStrokeWidth()
              }
            },
            value: {
              value: value
            }
          };
          this.attr(attr);
          if (visualElement.logicalElement.code === code.UserDefined) {
            const attributes = {
              userDefinedFunction: userDefinedFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "userDefined") {
              functionTooltip = userDefinedFunction.functionInput;
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          } else if (visualElement.logicalElement.code === code.Python) {
            userPythonDefinedFunction = visualElement.logicalElement.insertedFunction;
            const attributes = {
              userPythonDefinedFunction: userPythonDefinedFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "userPythonDefined") {
              functionTooltip = userPythonDefinedFunction.functionInput.code;
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          } else if (visualElement.logicalElement.code === code.GenAI) {
            userGenAIDefinedFunction = visualElement.logicalElement.insertedFunction;
            const attributes = {
              userGenAIDefinedFunction: userGenAIDefinedFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "userGenAIDefined") {
              functionTooltip = userGenAIDefinedFunction.functionInput.code;
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          } else if (visualElement.logicalElement.code === code.ROS) {
            ROSFunction = visualElement.logicalElement.insertedFunction;
            const attributes = {
              ros: ROSFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "ros") {
              if (ROSFunction.ROStopicwhat != "script") {
                functionTooltip = ROSFunction.ROStopicwhat + " to ROS topic: " + ROSFunction.ROStopic + " with data type: " + ROSFunction.ROStopic_type;
              } else {
                functionTooltip = "Running ROS script:" + ROSFunction.ROS_Script;
              }
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          } else if (visualElement.logicalElement.code === code.MQTT) {
            MQTTFunction = visualElement.logicalElement.insertedFunction;
            const attributes = {
              mqtt: MQTTFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "mqtt") {
              functionTooltip = MQTTFunction.MQTTtopicwhat + " to MQTT topic: " + MQTTFunction.MQTTtopic;
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          } else if (visualElement.logicalElement.code === code.SQL) {
            SQLFunction = visualElement.logicalElement.insertedFunction;
            const attributes = {
              sql: SQLFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "sql") {
              functionTooltip = "SQ Query type : " + SQLFunction.SQLquerywhat;
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          } else {
            //external
            externalFunction = visualElement.logicalElement.insertedFunction;
            const attributes = {
              externalFunction: externalFunction
            };
            this.set(attributes);
            this.set("id", visualElement.id);
            if (this.attributes.attrs.text.textWrap.text === "Default Name") {
              this.attr({
                text: {
                  textWrap: {
                    text: visualElement.logicalElement.getNumberedName()
                  }
                }
              });
            }
            let functionTooltip;
            if (value === "external") {
              functionTooltip = "Connected to API at URL:\n" + externalFunction.functionUrl;
            } else {
              functionTooltip = value;
            }
            if (functionTooltip && functionTooltip !== "None") {
              this.attr({
                ".": {
                  "data-tooltip": functionTooltip.replace(/(.{50})/g, "$1<br>"),
                  "data-tooltip-position": "left"
                }
              });
            }
          }
          this.updateURLArray();
          // Restore pattern if present
          this.restorePatternIfNeeded(visualElement);
        }
        restorePatternIfNeeded(visualElement) {
          const fill = visualElement.fill;
          if (fill && fill.startsWith && fill.startsWith("url(#")) {
            // Fill is a pattern - restore using new static template system
            const init = (0, getInitRappidShared)();
            if (!init?.elementToolbarReference) {
              return;
            }
            const predefinedPatternId = visualElement.predefinedPatternId;
            const patternConfig = visualElement.patternConfig;
            const baseFillColor = visualElement.baseFillColor || "#FFFFFF";
            if (predefinedPatternId) {
              // Predefined pattern - use static template
              const newPatternUrl = init.elementToolbarReference.createPatternInstance(predefinedPatternId, baseFillColor);
              if (newPatternUrl) {
                visualElement.fill = newPatternUrl;
              }
            } else if (patternConfig) {
              // Custom pattern - create element-specific pattern
              const elementId = this.id || `elem-${Date.now()}-${Math.random()}`;
              const newPatternUrl = init.elementToolbarReference.createPatternInstance(patternConfig, baseFillColor, elementId);
              if (newPatternUrl) {
                visualElement.fill = newPatternUrl;
              }
            } else {
              // Legacy: try to extract from pattern URL (backward compatibility)
              const match = fill.match(/url\(#([^)]+)\)/);
              if (match) {
                const patternId = match[1];
                // Check if it's a predefined pattern instance (pat-{patternId}-bg-{color})
                if (patternId.includes("-bg-")) {
                  const predefinedId = patternId.split("-bg-")[0].replace("pat-", "");
                  const predefinedPatterns = init.elementToolbarReference.getPredefinedPatterns();
                  const patternDef = predefinedPatterns.find(p => p.id === predefinedId);
                  if (patternDef) {
                    visualElement.predefinedPatternId = predefinedId;
                    visualElement.isCustomPattern = false;
                    const bgColor = "#" + patternId.split("-bg-")[1];
                    visualElement.baseFillColor = bgColor;
                    const newPatternUrl = init.elementToolbarReference.createPatternInstance(predefinedId, bgColor);
                    if (newPatternUrl) {
                      visualElement.fill = newPatternUrl;
                    }
                  }
                } else if (patternId.startsWith("pat-stripes-custom-")) {
                  // Custom pattern - would need to extract config, but for now just restore URL
                  // This is a fallback for old saved patterns
                  visualElement.fill = fill;
                }
              }
            }
          } else if (fill && !fill.startsWith("url(#")) {
            // Solid fill - store as baseFillColor
            visualElement.baseFillColor = fill;
          }
        }
        restorePatternIfNeeded_OLD(visualElement) {
          const fill = visualElement.fill;
          if (fill && fill.startsWith && fill.startsWith("url(#")) {
            // Fill is a pattern - restore pattern config and ensure pattern exists in SVG
            const patternConfig = visualElement.patternConfig;
            const isCustomPattern = visualElement.isCustomPattern;
            let configToUse = patternConfig;
            if (!configToUse) {
              // Try to extract pattern config from pattern URL
              // Format: pat-stripes-{angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace} (predefined)
              // Or: pat-stripes-custom-{elementId}-{angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace} (custom)
              const match = fill.match(/url\(#([^)]+)\)/);
              if (match) {
                const patternId = match[1];
                const parts = patternId.replace("pat-stripes-", "").split("-");
                // Check if it's a custom pattern (starts with "custom-")
                let configStartIndex = 0;
                let bgIndex = 4;
                let isCustom = false;
                if (parts[0] === "custom" && parts.length >= 7) {
                  // Custom pattern format: custom-{elementId}-{angle}-...
                  isCustom = true;
                  configStartIndex = 2; // Skip "custom" and elementId
                  bgIndex = 6;
                } else if (parts.length >= 5) {
                  // Predefined pattern format: {angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace}
                  configStartIndex = 0;
                  bgIndex = 4;
                }
                if (parts.length >= 5 + configStartIndex) {
                  const bgPart = parts[bgIndex];
                  const background = bgPart && bgPart !== "none" ? "#" + bgPart : "#FFFFFF";
                  // Handle normalized angle format (n45 for -45, or regular number)
                  let angleDeg = 45;
                  const angleStr = parts[configStartIndex];
                  if (angleStr.startsWith("n")) {
                    angleDeg = -parseInt(angleStr.substring(1)) || -45;
                  } else {
                    angleDeg = parseInt(angleStr) || 45;
                  }
                  const extractedConfig = {
                    angleDeg: angleDeg,
                    gap: parseInt(parts[configStartIndex + 1]) || 10,
                    stripeWidth: parseInt(parts[configStartIndex + 2]) || 3,
                    stripeColor: "#" + parts[configStartIndex + 3],
                    background: background,
                    useUserSpace: parts[parts.length - 1] === "us"
                  };
                  visualElement.patternConfig = extractedConfig;
                  visualElement.isCustomPattern = isCustom;
                  configToUse = extractedConfig;
                  visualElement.baseFillColor = background;
                }
              }
            } else {
              // Extract background color from pattern URL
              const match = fill.match(/url\(#([^)]+)\)/);
              if (match) {
                const patternId = match[1];
                const parts = patternId.replace("pat-stripes-", "").split("-");
                if (parts.length >= 5) {
                  const bgPart = parts[4];
                  const background = bgPart && bgPart !== "none" ? "#" + bgPart : "#FFFFFF";
                  visualElement.patternConfig = patternConfig;
                  visualElement.baseFillColor = background;
                  configToUse = {
                    ...patternConfig,
                    background: background
                  };
                }
              }
            }
            // Ensure pattern exists in SVG
            if (configToUse) {
              this.ensurePatternInSVG(configToUse, isCustomPattern || visualElement.isCustomPattern);
            }
          } else if (fill && !fill.startsWith("url(#")) {
            // Solid fill - store as baseFillColor
            visualElement.baseFillColor = fill;
          }
        }
        ensurePatternInSVG(patternConfig, isCustom = false) {
          const init = (0, getInitRappidShared)();
          const paper = init?.paper;
          if (!paper || !paper.svg) {
            return;
          }
          // Check if this is a predefined pattern
          let isPredefined = false;
          if (init?.elementToolbarReference && init.elementToolbarReference.getPredefinedPatterns) {
            const predefinedPatterns = init.elementToolbarReference.getPredefinedPatterns();
            isPredefined = predefinedPatterns.some(p => p.config.angleDeg === patternConfig.angleDeg && p.config.gap === patternConfig.gap && p.config.stripeWidth === patternConfig.stripeWidth && p.config.stripeColor === patternConfig.stripeColor && p.config.useUserSpace === patternConfig.useUserSpace);
          }
          // If it's not predefined and not marked as custom, assume it's custom
          const isCustomPattern = isCustom || !isPredefined;
          const {
            angleDeg,
            gap,
            stripeWidth,
            stripeColor,
            background,
            useUserSpace
          } = patternConfig;
          const svg = paper.svg;
          const ns = "http://www.w3.org/2000/svg";
          // Ensure a <defs> exists
          let defs = svg.querySelector("defs");
          if (!defs) {
            defs = document.createElementNS(ns, "defs");
            svg.insertBefore(defs, svg.firstChild);
          }
          // Build pattern ID
          // Normalize angle to avoid issues with negative numbers (use 'n' prefix for negative)
          const angleStr = angleDeg < 0 ? `n${Math.abs(angleDeg)}` : String(angleDeg);
          const keyParts = [angleStr, gap, stripeWidth, stripeColor.replace("#", ""), (background || "none").replace("#", ""), useUserSpace ? "us" : "bb"];
          // For predefined patterns: use shared ID (no element ID)
          // For custom patterns: include element ID to make it unique per element
          const elementId = this.id || `elem-${Date.now()}-${Math.random()}`;
          const patternId = isCustomPattern ? `pat-stripes-custom-${elementId}-${keyParts.join("-")}` : `pat-stripes-${keyParts.join("-")}`;
          // Reuse if already present
          let pattern = svg.querySelector(`#${patternId}`);
          if (!pattern) {
            pattern = document.createElementNS(ns, "pattern");
            pattern.setAttribute("id", patternId);
            if (useUserSpace) {
              pattern.setAttribute("patternUnits", "userSpaceOnUse");
              pattern.setAttribute("width", String(gap));
              pattern.setAttribute("height", String(gap));
            } else {
              pattern.setAttribute("patternUnits", "objectBoundingBox");
              pattern.setAttribute("width", "1");
              pattern.setAttribute("height", "1");
            }
            if (angleDeg) {
              pattern.setAttribute("patternTransform", `rotate(${angleDeg})`);
            }
            // Add background rect if background color is provided
            if (background) {
              const bg = document.createElementNS(ns, "rect");
              bg.setAttribute("x", "0");
              bg.setAttribute("y", "0");
              bg.setAttribute("width", useUserSpace ? String(gap) : "1");
              bg.setAttribute("height", useUserSpace ? String(gap) : "1");
              bg.setAttribute("fill", background);
              pattern.appendChild(bg);
            }
            // Draw one vertical stripe; rotation handles orientation
            const stripe = document.createElementNS(ns, "rect");
            if (useUserSpace) {
              stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
              stripe.setAttribute("y", "0");
              stripe.setAttribute("width", String(stripeWidth));
              stripe.setAttribute("height", String(gap));
            } else {
              const fracW = stripeWidth / gap;
              stripe.setAttribute("x", String(0.5 - fracW / 2));
              stripe.setAttribute("y", "0");
              stripe.setAttribute("width", String(fracW));
              stripe.setAttribute("height", "1");
            }
            stripe.setAttribute("fill", stripeColor);
            pattern.appendChild(stripe);
            defs.appendChild(pattern);
          }
        }
        getUserInputPromptSvgIcon(xPos, yPos, tooltipPlainText) {
          const safeBody = tooltipPlainText.replace(/"/g, "'");
          const titleRaw = "Message To Be Displayed: \"" + safeBody + "\"";
          const withBreaks = titleRaw.replace(/((?:[^\s]*\s){6}[^\s]*)\s/g, "$1\n");
          const safeTitle = this.clearSvgTitle(withBreaks);
          return `<svg class="userInputPromptSign" x=${xPos} y=${yPos} width="14" height="14" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 4C0 1.791 1.79 0 4 0H32C34.21 0 36 1.791 36 4V31C36 33.209 34.21 35 32 35H4C1.79 35 0 33.209 0 31V4Z" fill="#5A6F8F"/>
<line x1="18" y1="10" x2="18" y2="24" stroke="#F8F8F8" stroke-width="2"/>
<line x1="21" y1="23" x2="15" y2="23" stroke="#5A6F8F" stroke-width="2"/>
<line x1="21" y1="11" x2="15" y2="11" stroke="#5A6F8F" stroke-width="2"/>
<path d="M32 17C32 19.6425 30.5415 22.1191 28.0152 23.9718C25.4895 25.824 21.9519 27 18 27C14.0481 27 10.5105 25.824 7.98476 23.9718C5.45846 22.1191 4 19.6425 4 17C4 14.3575 5.45846 11.8809 7.98476 10.0282C10.5105 8.17604 14.0481 7 18 7C21.9519 7 25.4895 8.17604 28.0152 10.0282C30.5415 11.8809 32 14.3575 32 17Z" stroke="#5A6F8F" stroke-width="2"/>
<line x1="21" y1="23" x2="15" y2="23" stroke="#F8F8F8" stroke-width="2"/>
<line x1="21" y1="11" x2="15" y2="11" stroke="#F8F8F8" stroke-width="2"/>
<path d="M32 17C32 19.6425 30.5415 22.1191 28.0152 23.9718C25.4895 25.824 21.9519 27 18 27C14.0481 27 10.5105 25.824 7.98476 23.9718C5.45846 22.1191 4 19.6425 4 17C4 14.3575 5.45846 11.8809 7.98476 10.0282C10.5105 8.17604 14.0481 7 18 7C21.9519 7 25.4895 8.17604 28.0152 10.0282C30.5415 11.8809 32 14.3575 32 17Z" stroke="#F8F8F8" stroke-width="2"/>
<title>${safeTitle}</title>
</svg>`;
        }
        updateURLArray() {
          var _this = this;
          return (0, default)(function* () {
            const init = (0, getInitRappidShared)();
            if (init.exportingOpl || !init.paper || !init.paper.findViewByModel(_this)) {
              return;
            }
            const size = _this.get("size");
            const processPos = (0, getInitRappidShared)().paper.findViewByModel(_this).el.getBoundingClientRect();
            const textPos = (0, getInitRappidShared)().paper.findViewByModel(_this).el.querySelector("text").getBoundingClientRect();
            const relativePos = {
              x: textPos.left - processPos.left - 10,
              y: textPos.top - processPos.top - 10
            };
            const format = val => "'{}'".replace("{}", String(val));
            // const xPos = format(relativePos.x);
            // const yPos = format(relativePos.y);
            const xPos = format(size.width / 2 - 28);
            const yPos = format(7);
            let urlMarkup = "";
            let descriptionMarkup = "";
            let cameraIconMarkup = "";
            let userInputPromptMarkup = "";
            if (_this.hasURLs()) {
              urlMarkup = _this.getUrlSvgIcon(xPos, yPos);
            }
            // const descXpos = format(this.get('size').width / 2 - 30);
            // const descYpos = format(relativePos.y - 6);
            const descXpos = format(size.width / 2 + 17);
            const descYpos = format(7);
            const title = _this.clearSvgTitle(_this.hasDescription().desc || "");
            if (_this.hasDescription().value) {
              descriptionMarkup = _this.getDescriptionSvgIcon(descXpos, descYpos, title);
            }
            const visual = _this.getVisual();
            if (!visual) {
              return;
            }
            const logicalProc = visual.logicalElement;
            if (logicalProc.needUserInput && visual.canUseUserInput()) {
              const iconSize = 14;
              const iconHalfW = 7;
              const ecx = size.width / 2;
              const textBreak = joint.util.breakText;
              const displayText = logicalProc.getDisplayText();
              const wrapW = Math.max(48, Math.min(size.width - 32, size.width * 0.72));
              const lineCount = Math.max(1, textBreak(displayText, {
                width: wrapW
              }).split("\n").length);
              const fontSize = visual.textFontSize || 14;
              const lineHeight = fontSize * 1.45;
              const refY = visual.refY != null && !Number.isNaN(Number(visual.refY)) ? visual.refY : Math.max(25, lineCount * fontSize / 2 + 20);
              let textClearY = refY + lineCount * lineHeight / 2 + iconSize + 8;
              try {
                const cvEl = init.paper.findViewByModel(_this).el;
                const tel = cvEl.querySelector("text");
                const procRect = cvEl.getBoundingClientRect();
                if (tel && procRect.height > 0.001) {
                  const tr = tel.getBoundingClientRect();
                  const scaleY = size.height / procRect.height;
                  const measuredBottom = (tr.bottom - procRect.top) * scaleY + 8;
                  textClearY = Math.max(textClearY, measuredBottom);
                }
              } catch (_e) {/* keep formula */}
              const ellipseInset = 2;
              const rx = Math.max(4, size.width / 2 - ellipseInset);
              const ry = Math.max(4, size.height / 2 - ellipseInset);
              const iconFits = yy => {
                const pts = [[ecx - iconHalfW, yy], [ecx + iconHalfW, yy], [ecx - iconHalfW, yy + iconSize], [ecx + iconHalfW, yy + iconSize]];
                return pts.every(([px, py]) => {
                  const nx = (px - size.width / 2) / rx;
                  const ny = (py - size.height / 2) / ry;
                  return nx * nx + ny * ny <= 1.000001;
                });
              };
              const bottomGap = 3;
              let iconY = size.height - bottomGap - iconSize;
              if (iconY < textClearY) {
                iconY = textClearY;
              }
              iconY += Math.round(iconSize * 0.8);
              const maxIconTop = size.height - bottomGap - iconSize;
              if (iconY > maxIconTop) {
                iconY = maxIconTop;
              }
              while (!iconFits(iconY) && iconY > textClearY) {
                iconY -= 2;
              }
              const iconX = size.width / 2 - 7;
              const tip = (0, getEffectiveUserInputPrompt)(logicalProc.userInputPromptMessage);
              userInputPromptMarkup = _this.getUserInputPromptSvgIcon(format(iconX), format(iconY), tip);
            }
            if (_this.hasBackgroundImage() && !init.currentlyExportingPdf) {
              if (_this.shouldShowBackgroundImage()) {
                const textState = visual.getShowBackgroundImageState();
                cameraIconMarkup = _this.getCameraSvgIcon(format(size.width / 2 - 9), format(8), true);
                _this.attr("text/fill", textState === BackgroundImageState.IMAGEONLY ? "transparent" : visual.textColor);
              } else {
                cameraIconMarkup = _this.getCameraSvgIcon(format(size.width / 2 - 9), format(8), false);
                _this.attr("text/fill", visual.textColor);
              }
            } else {
              _this.attr("text/fill", visual.textColor);
            }
            const thisId = _this.id;
            let imageUrl = visual.logicalElement.getBackgroundImageUrl();
            const shouldShowBackgroundImage = _this.hasBackgroundImage() && _this.shouldShowBackgroundImage() && !init.currentlyExportingPdf;
            try {
              if (imageUrl !== "" && imageUrl !== _this.attr("image/xlinkHref") && _this.attr("image/xlinkHref") !== "assets/SVG/redx.png") {
                yield (0, checkImageURL)(imageUrl);
                _this.attr("image/xlinkHref", imageUrl);
              }
            } catch (err) {
              const badLinkURL = "assets/SVG/redx.png";
              imageUrl = badLinkURL;
              _this.attr("image/xlinkHref", badLinkURL);
            }
            const gEllipse = new geometry.g.ellipse.fromRect(_this.getBBox());
            const semiTransparent = visual.getShowBackgroundImageState() === BackgroundImageState.TEXTANDIMAGE && _this.shouldShowBackgroundImage() && _this.hasBackgroundImage() ? 0.6 : 1;
            const imageMarkup = shouldShowBackgroundImage ? `<image magnet="false" cursor="crosshair" style="clip-path: ellipse(${gEllipse.a - 10}px ${gEllipse.b - 10}px);"/>` : "";
            const markup = `<ellipse class="mainEllipse" magnet="false"/>${imageMarkup}${urlMarkup}${descriptionMarkup}<text/>${userInputPromptMarkup}${cameraIconMarkup}`;
            if (shouldShowBackgroundImage) {
              _this.attr(".mainEllipse/magnet", true);
              _this.attr(["root", "magnetSelector"], ".mainEllipse"); // making the links connect initially to the boundary instead of the middle.
              _this.attr("image/opacity", semiTransparent);
            } else {
              _this.removeAttr(".mainEllipse");
              _this.removeAttr(".innerStroke");
              _this.attr("ellipse/fill", visual.fill);
              _this.removeAttr(["root", "magnetSelector"]);
            }
            _this.set("markup", markup);
            if (_this.get("duplicationMark")) {
              _this.redrawDuplicationMark((0, getInitRappidShared)());
            }
            const that = _this;
            setTimeout(() => {
              that.addSvgsClickEvents(init);
            }, 600);
          })();
        }
        removeHandle(options) {
          super.removeHandle(options);
        }
        getNewDimensions(leftSideX, topSideY, rightSideX, bottomSideY, includeSemiFolded = false) {
          let bbox = this.getBBox();
          let elps = joint.g.ellipse.fromRect(bbox);
          let embds = this.getEmbeddedCells();
          if (includeSemiFolded === false) {
            embds = embds.filter(cld => !cld.constructor.name.includes("Semi"));
          }
          shared._.each(embds, function (child) {
            const childBbox = child.getBBox();
            // Updating the new size of the ellipse to have margins of at least paddingObject
            // so that the embedded entity will not touch the process
            while (!elps.containsPoint(childBbox.topRight()) || !elps.containsPoint(childBbox.bottomLeft()) || !elps.containsPoint(childBbox.origin()) || !elps.containsPoint(childBbox.corner())) {
              if (!elps.containsPoint(childBbox.bottomLeft())) {
                bottomSideY += paddingObject;
                leftSideX -= paddingObject;
                bbox = {
                  x: bbox.x - paddingObject,
                  y: bbox.y,
                  width: bbox.width + paddingObject,
                  height: bbox.height + paddingObject
                };
                elps = joint.g.ellipse.fromRect(bbox);
              }
              if (!elps.containsPoint(childBbox.origin())) {
                topSideY -= paddingObject;
                leftSideX -= paddingObject;
                bbox = {
                  x: bbox.x - paddingObject,
                  y: bbox.y - paddingObject,
                  width: bbox.width + paddingObject,
                  height: bbox.height + paddingObject
                };
                elps = joint.g.ellipse.fromRect(bbox);
              }
              if (!elps.containsPoint(childBbox.corner())) {
                bottomSideY += paddingObject;
                rightSideX += paddingObject;
                bbox = {
                  x: bbox.x,
                  y: bbox.y,
                  width: bbox.width + paddingObject,
                  height: bbox.height + paddingObject
                };
                elps = joint.g.ellipse.fromRect(bbox);
              }
              if (!elps.containsPoint(childBbox.topRight())) {
                topSideY -= paddingObject;
                rightSideX += paddingObject;
                bbox = {
                  x: bbox.x,
                  y: bbox.y - paddingObject,
                  width: bbox.width + paddingObject,
                  height: bbox.height + paddingObject
                };
                elps = joint.g.ellipse.fromRect(bbox);
              }
            }
          });
          return {
            leftSideX: leftSideX,
            topSideY: topSideY,
            rightSideX: rightSideX,
            bottomSideY: bottomSideY
          };
        }
        computation(target, initRappid) {
          target = initRappid.paper.findViewByModel(target).el;
          if (!LinkConstraints.CanBeComputational(this.id, initRappid, this)) {
            let text = "The process " + this.attributes.attrs.text.textWrap.text + " can't be computational because it can't be informatical.";
            (0, validationAlert)(text, null, "Error");
            return;
          }
          initRappid.getOpmModel().logForUndo(this.getVisual().logicalElement.text + " computation");
          const processThis = this;
          const contextToolbar = new joint.ui.ContextToolbar({
            theme: "material",
            tools: [{
              action: "predefined",
              content: "Predefined"
            }, {
              action: "userDefined",
              content: "User Defined"
            }, {
              action: "external",
              content: "External"
            }, {
              action: "ros",
              content: "ROS"
            }, {
              action: "mqtt",
              content: "MQTT"
            }, {
              action: "userPythonDefined",
              content: "Python"
            }, {
              action: "mysql",
              content: "SQL"
            }, {
              action: "genAI",
              content: "Gen AI"
            }],
            target: target,
            padding: 30
          }).render();
          contextToolbar.on("action:external", function () {
            this.remove();
            processThis.external(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:predefined", function () {
            this.remove();
            processThis.predefinedFunctions(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:userDefined", function () {
            this.remove();
            processThis.userDefinedFunction(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:userPythonDefined", function () {
            this.remove();
            processThis.userPythonDefinedFunction(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:genAI", function () {
            this.remove();
            processThis.genAI(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:ros", function () {
            this.remove();
            processThis.ros(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:mqtt", function () {
            this.remove();
            processThis.mqtt(target, initRappid);
            (0, stylePopup)();
          });
          contextToolbar.on("action:mysql", function () {
            this.remove();
            processThis.sql(target, initRappid);
            (0, stylePopup)();
          });
          (0, styleComputationToolBar)();
        }
        removeComputational(init) {
          if (this.getVisual().logicalElement.getBelongsToStereotyped() || this.getVisual().logicalElement.getStereotype()) {
            (0, validationAlert)("Computational cannot be removed from a stereotyped thing.");
            return;
          }
          init.getOpmModel().logForUndo(this.getVisual().logicalElement.text + " remove computation");
          this.attr({
            value: {
              value: "None"
            }
          });
          this.set("externalFunction", null);
          (0, updateProcess)(this, init);
          init.setSelectedElementToNull();
        }
        updateComputational(init) {
          const value = this.attributes.attrs.value.value;
          const target = init.paper.findViewByModel(this).el;
          if (value === "userDefined") {
            this.userDefinedFunction(target, init);
          }
          if (value === "userPythonDefined") {
            this.userPythonDefinedFunction(target, init);
          }
          if (value === "mqtt") {
            this.mqtt(target, init);
          }
          if (value === "ros") {
            this.ros(target, init);
          }
          if (value === "sql") {
            this.sql(target, init);
          }
          if (value === "external") {
            this.external(target, init);
          }
          if (value === "userGenAIDefined") {
            this.genAI(target, init);
          }
          if (value !== "external" && value !== "ros" && value !== "mqtt" && value !== "sql" && value !== "userDefined" && value !== "userPythonDefined" && value !== "userGenAIDefined") {
            this.predefinedFunctions(target, init);
          }
          (0, stylePopup)();
        }
        ros(target, initRappid) {
          const processThis = this;
          let published_selection;
          let subscribed_selection;
          let service_selection;
          let rosscript_selection;
          let ROStopic = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.ROStopic;
          let Topictype = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.ROStopic_type;
          let TopicWhat = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.ROStopicwhat;
          let ScriptContent = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.ROS_Script;
          let ROSMessage = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.ROSMessage;
          ROStopic = ROStopic ? ROStopic : "/turtle1/pose";
          Topictype = Topictype ? Topictype : "turtlesim/Pose";
          ScriptContent = ScriptContent ? ScriptContent : "";
          ROSMessage = ROSMessage ? ROSMessage : "";
          published_selection = TopicWhat == "publish" ? "selected" : "";
          subscribed_selection = TopicWhat == "subscribe" ? "selected" : "";
          service_selection = TopicWhat == "service" ? "selected" : "";
          rosscript_selection = TopicWhat == "script" ? "selected" : "";
          const popup = new joint.ui.Popup({
            events: {
              "click .btnUpdate": function () {
                const ROStopic = this.$(".ROStopic").val();
                const Topictype = this.$(".ROStopic_type").val();
                const TopicWhat = this.$(".ROStopicwhat").val();
                const ScriptContent = this.$(".ROS_Script").val();
                const ROSMessage = this.$(".ROSMessage").val();
                processThis.topic = ROStopic;
                processThis.topic_type = Topictype;
                processThis.topic_what = TopicWhat;
                processThis.rosscript_content = ScriptContent;
                processThis.ros_message = ROSMessage;
                processThis.attr({
                  value: {
                    value: "ros"
                  }
                });
                processThis.set("ros", {
                  parameters: "",
                  ROStopicwhat: TopicWhat,
                  ROStopic: ROStopic,
                  ROStopic_type: Topictype,
                  ROS_Script: ScriptContent,
                  ROSMessage: ROSMessage
                });
                (0, updateProcess)(processThis, initRappid);
                this.remove();
              },
              "change .ROStopicwhat": function ($event) {
                const chosen_topic_what = $event.currentTarget.value;
                if (chosen_topic_what === "script") {
                  $("#topicfields")[0].style.display = "none";
                  $("#ROSMessage")[0].style.display = "none";
                  $("#ROSscriptfield")[0].style.display = "block";
                } else {
                  $("#topicfields")[0].style.display = "block";
                  $("#ROSscriptfield")[0].style.display = "none";
                  if (chosen_topic_what === "subscribe") {
                    $("#ROSMessage")[0].style.display = "none";
                  } else {
                    $("#ROSMessage")[0].style.display = "block";
                  }
                }
              }
            },
            content: ["<select class=\"PopupSelection ROStopicwhat\"><option value=\"publish\" title=\"Publish\" " + published_selection + ">Publish</option><option value=\"subscribe\" title=\"Subscribe\" " + subscribed_selection + ">Subscribe</option><option value=\"service\" title=\"Service\" " + service_selection + ">Service</option><option value=\"script\" title=\"Script\" " + rosscript_selection + ">ROS Script</option></select><br>", "<div id=\"topicfields\">Topic <br><textarea class=\"ROStopic\" title=\"...\" rows=\"2\" cols=\"30\">" + ROStopic + "</textarea><br>Data type<br><textarea class=\"ROStopic_type\" title=\"...\" rows=\"2\" cols=\"30\">" + Topictype + "</textarea><br><div id=\"ROSMessage\" >Message<br><textarea class=\"ROSMessage\" title=\"...\" rows=\"2\" cols=\"30\">" + ROSMessage + "</textarea><br></div></div>", "<div id=\"ROSscriptfield\">ROS Script<br><textarea class=\"ROS_Script\" title=\"...\" rows=\"5\" cols=\"30\">" + ScriptContent + "</textarea></div><br>", "<button class=\"Popup btnUpdate\" style=\"FONT-WEIGHT: 600; left: 38%; margin-top: 8px;\">Update</button>"],
            // <button class="btnDelete">Delete Connection</button>
            target: target
          }).render();
          if (TopicWhat === "script") {
            $("#topicfields")[0].style.display = "none";
            $("#ROSMessage")[0].style.display = "none";
            $("#ROSscriptfield")[0].style.display = "block";
          } else {
            $("#topicfields")[0].style.display = "block";
            $("#ROSscriptfield")[0].style.display = "none";
            if (TopicWhat === "subscribe") {
              $("#ROSMessage")[0].style.display = "none";
            } else {
              $("#ROSMessage")[0].style.display = "block";
            }
          }
          // displaying the message explantion tooltip
          new joint.ui.Tooltip({
            target: ".ROSMessage",
            content: "This field gets an alias/name of objects. If its empty,<br> the message will be according to the only connected computational object."
          });
        }
        mqtt(target, initRappid) {
          const processThis = this;
          let published_selection;
          let subscribed_selection;
          let MQTTtopic = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.MQTTtopic;
          let TopicWhat = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.MQTTtopicwhat;
          let MQTTMessage = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.MQTTMessage;
          MQTTtopic = MQTTtopic ? MQTTtopic : "mqttTopic/topic";
          published_selection = TopicWhat == "publish" ? "selected" : "";
          subscribed_selection = TopicWhat == "subscribe" ? "selected" : "";
          MQTTMessage = MQTTMessage ? MQTTMessage : "";
          const popup = new joint.ui.Popup({
            events: {
              "click .btnUpdate": function () {
                const MQTTtopic = this.$(".MQTTtopic").val();
                const TopicWhat = this.$(".MQTTtopicwhat").val();
                const MQTTMessage = this.$(".MQTTMessage").val();
                processThis.topic = MQTTtopic;
                processThis.topic_what = TopicWhat;
                processThis.attr({
                  value: {
                    value: "mqtt"
                  }
                });
                processThis.set("mqtt", {
                  parameters: "",
                  MQTTtopicwhat: TopicWhat,
                  MQTTtopic: MQTTtopic,
                  MQTTMessage: MQTTMessage
                });
                (0, updateProcess)(processThis, initRappid);
                this.remove();
              },
              "change .MQTTtopicwhat": function ($event) {
                const chosen_topic_what = $event.currentTarget.value;
                if (chosen_topic_what === "subscribe") {
                  $("#MQTTMessage")[0].style.display = "none";
                } else {
                  $("#MQTTMessage")[0].style.display = "block";
                }
              }
            },
            content: ["<select class=\"PopupSelection MQTTtopicwhat\"><option value=\"publish\" title=\"Publish\" " + published_selection + ">Publish</option><option value=\"subscribe\" title=\"Subscribe\" " + subscribed_selection + ">Subscribe</option></select><br>", "<div id=\"topicfields\">Topic <br><textarea class=\"MQTTtopic\" title=\"...\" rows=\"2\" cols=\"30\">" + MQTTtopic + "</textarea><br><div id=\"MQTTMessage\">Message<br><textarea class=\"MQTTMessage\" title=\"...\" rows=\"2\" cols=\"30\">" + MQTTMessage + "</textarea><br></div></div><br>", "<button class=\"Popup btnUpdate\" style=\"FONT-WEIGHT: 600; left: 38%; margin-top: 8px;\">Update</button>"],
            target: target
          }).render();
          if (TopicWhat === "subscribe") {
            $("#MQTTMessage")[0].style.display = "none";
          } else {
            $("#MQTTMessage")[0].style.display = "block";
          }
          // the message explanation tooltip
          new joint.ui.Tooltip({
            target: ".MQTTMessage",
            content: "This field gets an alias/name of objects. If its empty, <br>the message will be according to the only connected computational object."
          });
        }
        sql(target, initRappid) {
          const processThis = this;
          let selected_selection;
          let create_selection;
          let update_selection;
          let drop_selection;
          let insert_selection;
          let delete_selection;
          let user_defined_selection;
          let QueryWhat = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLquerywhat;
          let select_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLselect_field;
          let from_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLfrom_field;
          let where_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLwhere_field;
          let update_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLupdate_field;
          let set_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLset_field;
          let delete_from_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLdelete_from_field;
          let insert_into_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLinsert_into_field;
          let values_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLvalues_field;
          let create_table_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLcreat_table_field;
          let drop_table_field = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLdrop_table_field;
          let define = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.SQLuser_define;
          const variables_array = initRappid.opmModel.calc_variables_array;
          select_field = select_field ? select_field : "";
          from_field = from_field ? from_field : "";
          where_field = where_field ? where_field : "";
          update_field = update_field ? update_field : "";
          set_field = set_field ? set_field : "";
          delete_from_field = delete_from_field ? delete_from_field : "";
          insert_into_field = insert_into_field ? insert_into_field : "";
          values_field = values_field ? values_field : "";
          create_table_field = create_table_field ? create_table_field : "";
          drop_table_field = drop_table_field ? drop_table_field : "";
          define = define ? define : "";
          if (!QueryWhat) {
            QueryWhat = "select";
          }
          selected_selection = QueryWhat === "select" ? "selected" : "";
          create_selection = QueryWhat === "create" ? "selected" : "";
          update_selection = QueryWhat === "update" ? "selected" : "";
          drop_selection = QueryWhat === "drop" ? "selected" : "";
          insert_selection = QueryWhat === "insert" ? "selected" : "";
          delete_selection = QueryWhat === "delete" ? "selected" : "";
          user_defined_selection = QueryWhat === "user defined query" ? "selected" : "";
          const popup = new joint.ui.Popup({
            events: {
              "click .btnUpdate": function () {
                const QueryWhat = this.$(".SQLquerywhat").val();
                const select_field = this.$(".SQLselect_field").val();
                const from_field = this.$(".SQLfrom_field").val();
                const where_field = this.$(".SQLwhere_field").val();
                const update_field = this.$(".SQLupdate_field").val();
                const set_field = this.$(".SQLset_field").val();
                const delete_from_field = this.$(".SQLdelete_from_field").val();
                const insert_into_field = this.$(".SQLinsert_into_field").val();
                const values_field = this.$(".SQLvalues_field").val();
                const create_table_field = this.$(".SQLcreat_table_field").val();
                const drop_table_field = this.$(".SQLdrop_table_field").val();
                const define = this.$(".SQLuser_define").val();
                processThis.Query_what = QueryWhat;
                processThis.sql_select_field = select_field;
                processThis.sql_from_field = from_field;
                processThis.sql_where_field = where_field;
                processThis.sql_update_field = update_field;
                processThis.sql_set_field = set_field;
                processThis.sql_delete_field = delete_from_field;
                processThis.sql_insert_field = insert_into_field;
                processThis.sql_values = values_field;
                processThis.sql_create_table_field = create_table_field;
                processThis.sql_drop_table_field = drop_table_field;
                processThis.sql_user_define_field = define;
                processThis.attr({
                  value: {
                    value: "sql"
                  }
                });
                processThis.set("sql", {
                  parameters: "",
                  SQLquerywhat: QueryWhat,
                  SQLselect_field: select_field,
                  SQLfrom_field: from_field,
                  SQLupdate_field: update_field,
                  SQLset_field: set_field,
                  SQLwhere_field: where_field,
                  SQLdelete_from_field: delete_from_field,
                  SQLinsert_into_field: insert_into_field,
                  SQLvalues_field: values_field,
                  SQLcreat_table_field: create_table_field,
                  SQLdrop_table_field: drop_table_field,
                  SQLuser_define: define
                });
                (0, updateProcess)(processThis, initRappid);
                this.remove();
              },
              "change .SQLquerywhat": function ($event) {
                const chosen_query_what = $event.currentTarget.value;
                if (chosen_query_what === "select") {
                  $("#SQLselect")[0].style.display = "block";
                  $("#SQLfrom")[0].style.display = "block";
                  $("#SQLwhere")[0].style.display = "block";
                  $("#SQLset")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "none";
                  $("#SQLdelete_from")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "none";
                  $("#SQLvalues")[0].style.display = "none";
                  $("#SQLtable")[0].style.display = "none";
                  $("#SQLdrop")[0].style.display = "none";
                  $("#SQLdefine")[0].style.display = "none";
                }
                if (chosen_query_what === "update") {
                  $("#SQLselect")[0].style.display = "none";
                  $("#SQLfrom")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "block";
                  $("#SQLset")[0].style.display = "block";
                  $("#SQLwhere")[0].style.display = "block";
                  $("#SQLdelete_from")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "none";
                  $("#SQLvalues")[0].style.display = "none";
                  $("#SQLtable")[0].style.display = "none";
                  $("#SQLdrop")[0].style.display = "none";
                  $("#SQLdefine")[0].style.display = "none";
                }
                if (chosen_query_what === "insert") {
                  $("#SQLselect")[0].style.display = "none";
                  $("#SQLfrom")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "none";
                  $("#SQLset")[0].style.display = "none";
                  $("#SQLwhere")[0].style.display = "none";
                  $("#SQLdelete_from")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "block";
                  $("#SQLvalues")[0].style.display = "block";
                  $("#SQLtable")[0].style.display = "none";
                  $("#SQLdrop")[0].style.display = "none";
                  $("#SQLdefine")[0].style.display = "none";
                }
                if (chosen_query_what === "delete") {
                  $("#SQLselect")[0].style.display = "none";
                  $("#SQLfrom")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "none";
                  $("#SQLset")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "none";
                  $("#SQLvalues")[0].style.display = "none";
                  $("#SQLwhere")[0].style.display = "block";
                  $("#SQLdelete_from")[0].style.display = "block";
                  $("#SQLtable")[0].style.display = "none";
                  $("#SQLdrop")[0].style.display = "none";
                  $("#SQLdefine")[0].style.display = "none";
                }
                if (chosen_query_what === "create") {
                  $("#SQLselect")[0].style.display = "none";
                  $("#SQLfrom")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "none";
                  $("#SQLset")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "none";
                  $("#SQLvalues")[0].style.display = "none";
                  $("#SQLwhere")[0].style.display = "none";
                  $("#SQLdelete_from")[0].style.display = "none";
                  $("#SQLtable")[0].style.display = "block";
                  $("#SQLdrop")[0].style.display = "none";
                  $("#SQLdefine")[0].style.display = "none";
                }
                if (chosen_query_what === "drop") {
                  $("#SQLselect")[0].style.display = "none";
                  $("#SQLfrom")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "none";
                  $("#SQLset")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "none";
                  $("#SQLvalues")[0].style.display = "none";
                  $("#SQLwhere")[0].style.display = "none";
                  $("#SQLdelete_from")[0].style.display = "none";
                  $("#SQLtable")[0].style.display = "none";
                  $("#SQLdrop")[0].style.display = "block";
                  $("#SQLdefine")[0].style.display = "none";
                }
                if (chosen_query_what === "user defined query") {
                  $("#SQLselect")[0].style.display = "none";
                  $("#SQLfrom")[0].style.display = "none";
                  $("#SQLupdate")[0].style.display = "none";
                  $("#SQLset")[0].style.display = "none";
                  $("#SQLinsert_into")[0].style.display = "none";
                  $("#SQLvalues")[0].style.display = "none";
                  $("#SQLwhere")[0].style.display = "none";
                  $("#SQLdelete_from")[0].style.display = "none";
                  $("#SQLtable")[0].style.display = "none";
                  $("#SQLdrop")[0].style.display = "none";
                  $("#SQLdefine")[0].style.display = "block";
                }
              }
            },
            content: ["<select class=\"PopupSelection SQLquerywhat\" ><option value=\"select\" title=\"Select\" " + selected_selection + ">Select</option><option value=\"create\" title=\"Create\" " + create_selection + ">Create</option><option value=\"update\" title=\"Update\" " + update_selection + ">Update</option><option value=\"drop\" title=\"Drope\" " + drop_selection + ">Drop</option><option value=\"insert\" title=\"Insert\" " + insert_selection + ">Insert</option><option value=\"delete\" title=\"Delete\" " + delete_selection + ">Delete</option><option value=\"user defined query\" title=\"User Defined Query\"" + user_defined_selection + ">User Defind Query</option></select>", "<div id=\"SQLselect\" >Selcet<br><textarea class=\"SQLselect_field\" title=\"...\" rows=\"2\" cols=\"30\">" + select_field + "</textarea><br></div>", "<div id=\"SQLdelete_from\" > Delete From <br><textarea class=\"SQLdelete_from_field\" title=\"...\" rows=\"2\" cols=\"30\">" + delete_from_field + "</textarea><br></div>", "<div id=\"SQLinsert_into\" > Insert Into <br><textarea class=\"SQLinsert_into_field\" title=\"...\" rows=\"2\" cols=\"30\">" + insert_into_field + "</textarea><br></div>", "<div id=\"SQLvalues\" > Values <br><textarea class=\"SQLvalues_field\" title=\"...\" rows=\"2\" cols=\"30\">" + values_field + "</textarea><br></div>", "<div id=\"SQLfrom\" >From<br><textarea class=\"SQLfrom_field\" title=\"...\" rows=\"2\" cols=\"30\">" + from_field + "</textarea><br></div>", "<div id=\"SQLupdate\" >Update<br><textarea class=\"SQLupdate_field\" title=\"...\" rows=\"2\" cols=\"30\">" + update_field + "</textarea><br></div>", "<div id=\"SQLset\" >Set<br><textarea class=\"SQLset_field\" title=\"...\" rows=\"2\" cols=\"30\">" + set_field + "</textarea><br></div>", "<div id=\"SQLtable\" >Create Table<br><textarea class=\"SQLcreat_table_field\" title=\"...\" rows=\"2\" cols=\"30\">" + create_table_field + "</textarea><br></div>", "<div id=\"SQLdrop\" >Drop Table<br><textarea class=\"SQLdrop_table_field\" title=\"...\" rows=\"2\" cols=\"30\">" + drop_table_field + "</textarea><br></div>", "<div id=\"SQLdefine\" ><br><textarea class=\"SQLuser_define\" title=\"...\" rows=\"2\" cols=\"30\">" + define + "</textarea><br></div>", "<div id=\"SQLwhere\" >Where<br><textarea class=\"SQLwhere_field\" title=\"...\" rows=\"2\" cols=\"30\">" + where_field + "</textarea><br></div><br>", "<button class=\"Popup btnUpdate\" style=\"FONT-WEIGHT: 600; left: 38%; margin-top: 8px;\">Update</button>"],
            // <button class="btnDelete">Delete Connection</button>
            target: target
          }).render();
          if (QueryWhat === "select") {
            $("#SQLselect")[0].style.display = "block";
            $("#SQLfrom")[0].style.display = "block";
            $("#SQLwhere")[0].style.display = "block";
            $("#SQLset")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "none";
            $("#SQLdelete_from")[0].style.display = "none";
            $("#SQLinsert_into")[0].style.display = "none";
            $("#SQLvalues")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdrop")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
          }
          if (QueryWhat === "update") {
            $("#SQLselect")[0].style.display = "none";
            $("#SQLfrom")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "block";
            $("#SQLset")[0].style.display = "block";
            $("#SQLwhere")[0].style.display = "block";
            $("#SQLdelete_from")[0].style.display = "none";
            $("#SQLinsert_into")[0].style.display = "none";
            $("#SQLvalues")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdrop")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
          }
          if (QueryWhat === "insert") {
            $("#SQLselect")[0].style.display = "none";
            $("#SQLfrom")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "none";
            $("#SQLset")[0].style.display = "none";
            $("#SQLwhere")[0].style.display = "none";
            $("#SQLdelete_from")[0].style.display = "none";
            $("#SQLinsert_into")[0].style.display = "block";
            $("#SQLvalues")[0].style.display = "block";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdrop")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
          }
          if (QueryWhat === "delete") {
            $("#SQLselect")[0].style.display = "none";
            $("#SQLfrom")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "none";
            $("#SQLset")[0].style.display = "none";
            $("#SQLwhere")[0].style.display = "block";
            $("#SQLdelete_from")[0].style.display = "block";
            $("#SQLinsert_into")[0].style.display = "none";
            $("#SQLvalues")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdrop")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
          }
          if (QueryWhat === "create") {
            $("#SQLselect")[0].style.display = "none";
            $("#SQLfrom")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "none";
            $("#SQLset")[0].style.display = "none";
            $("#SQLwhere")[0].style.display = "none";
            $("#SQLdelete_from")[0].style.display = "none";
            $("#SQLinsert_into")[0].style.display = "none";
            $("#SQLvalues")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "block";
            $("#SQLdrop")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
          }
          if (QueryWhat === "drop") {
            $("#SQLselect")[0].style.display = "none";
            $("#SQLfrom")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "none";
            $("#SQLset")[0].style.display = "none";
            $("#SQLwhere")[0].style.display = "none";
            $("#SQLdelete_from")[0].style.display = "none";
            $("#SQLinsert_into")[0].style.display = "none";
            $("#SQLvalues")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdrop")[0].style.display = "block";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "none";
          }
          if (QueryWhat === "user defined query") {
            $("#SQLselect")[0].style.display = "none";
            $("#SQLfrom")[0].style.display = "none";
            $("#SQLupdate")[0].style.display = "none";
            $("#SQLset")[0].style.display = "none";
            $("#SQLwhere")[0].style.display = "none";
            $("#SQLdelete_from")[0].style.display = "none";
            $("#SQLinsert_into")[0].style.display = "none";
            $("#SQLvalues")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdrop")[0].style.display = "none";
            $("#SQLtable")[0].style.display = "none";
            $("#SQLdefine")[0].style.display = "block";
          }
          // displaying the message explantion tooltip
          new joint.ui.Tooltip({
            target: ".SQLMessage",
            content: "This field gets an alias/name of objects. If its empty,<br> the message will be according to the only connected computational object."
          });
        }
        external(target, initRappid) {
          const processThis = this;
          let functionUrl = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.functionUrl;
          let urlParameters = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.urlParameters;
          functionUrl = functionUrl ? functionUrl : "http://localhost:4000/";
          urlParameters = urlParameters || urlParameters === "" ? urlParameters : "(Param1,a)(Param2,b)";
          const popup = new joint.ui.Popup({
            events: {
              "click .btnUpdate": function () {
                const functionUrl = this.$(".functionUrl").val();
                const urlParameters = this.$(".urlParameters").val();
                processThis.url = functionUrl;
                processThis.text = urlParameters;
                processThis.attr({
                  value: {
                    value: "external"
                  }
                });
                processThis.set("externalFunction", {
                  parameters: "",
                  functionUrl: functionUrl,
                  urlParameters: urlParameters
                });
                (0, updateProcess)(processThis, initRappid);
                this.remove();
              }
            },
            content: ["URL<br><textarea class=\"functionUrl\" title=\"Usage: Use full URL with needed API  without / after it\" rows=\"2\" cols=\"30\">" + functionUrl + "</textarea><br>", "Parameters<br><textarea class=\"urlParameters\" title=\"Usage: (paramter1,value1)(paramter2,value2)...\" rows=\"2\" cols=\"30\">" + urlParameters + "</textarea><br>", "<button class=\"Popup btnUpdate\" style=\"FONT-WEIGHT: 600; left: 38%; margin-top: 8px;\">Update</button>"],
            // <button class="btnDelete">Delete Connection</button>
            target: target
          }).render();
        }
        genAI(target, initRappid) {
          const processThis = this;
          let currentFunction = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.functionInput;
          currentFunction = currentFunction && currentFunction !== "None" ? currentFunction : {
            code: "Note: Write your calculation here in plain text. You may use the variables above.\n"
          };
          initRappid.openGenAIEditor(currentFunction, this.getVisual()).afterClosed().subscribe(functionInput => {
            if (functionInput) {
              processThis.attr({
                value: {
                  value: "userGenAIDefined"
                }
              });
              processThis.set("userGenAIDefinedFunction", {
                parameters: "",
                functionInput: functionInput
              });
              (0, updateProcess)(processThis, initRappid);
            }
          });
          return;
        }
        onstartDragPopup(event, process) {
          const that = process;
          if (!event.touches) {
            event.preventDefault();
            window.onmousemove = function (e) {
              that.moveDragPopup(e);
            };
            window.onmouseup = function (e) {
              that.endDrag(e);
            };
          }
        }
        moveDragPopup(event) {
          const clientX = event.changedTouches && event.changedTouches.length > 0 ? event.changedTouches[0].clientX : event.clientX;
          const clientY = event.changedTouches && event.changedTouches.length > 0 ? event.changedTouches[0].clientY : event.clientY;
          const popupDiv = $(".joint-popup")[0];
          const xGap = $(".move-button")[0].getClientRects()[0].left - $(".joint-popup")[0].getClientRects()[0].left + 10;
          popupDiv.style.left = clientX - xGap + "px";
          popupDiv.style.top = clientY - 20 + "px";
        }
        endDrag(event) {
          window.onmousemove = function (e) {};
          window.onmouseup = function (e) {};
        }
        userPythonDefinedFunction(target, initRappid) {
          const processThis = this;
          let currentFunction = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.functionInput;
          currentFunction = currentFunction && currentFunction !== "None" ? currentFunction : {
            code: "#Python code, result should be printed\nprint(x+y)",
            executionLocation: initRappid.pythonExecution
          };
          initRappid.openPythonCodeEditor(currentFunction, this.getVisual()).afterClosed().subscribe(functionInput => {
            if (functionInput) {
              processThis.attr({
                value: {
                  value: "userPythonDefined"
                }
              });
              processThis.set("userPythonDefinedFunction", {
                parameters: "",
                functionInput: functionInput
              });
              (0, updateProcess)(processThis, initRappid);
            }
          });
          return;
        }
        userDefinedFunction(target, initRappid) {
          const processThis = this;
          let currentFunction = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction.functionInput;
          currentFunction = currentFunction ? currentFunction : "return a+b;";
          initRappid.openCodeEditor(currentFunction, this.getVisual()).afterClosed().subscribe(functionInput => {
            if (functionInput) {
              processThis.attr({
                value: {
                  value: "userDefined"
                }
              });
              processThis.set("userDefinedFunction", {
                parameters: "",
                functionInput: functionInput
              });
              (0, updateProcess)(processThis, initRappid);
            }
          });
          return;
        }
        predefinedFunctions(target, initRappid) {
          // Finds selected value from the dropDown list, which can be found in FuncDictionary.
          // Updates selected value and sets the computational function for each option.
          const processThis = this;
          const currentValue = initRappid.opmModel.getLogicalElementByVisualId(processThis.get("id")).insertedFunction;
          const dropdownFunctionsDict = new FuncDictionary();
          // this function sorts the functions names alphabetically
          dropdownFunctionsDict.funcArray = dropdownFunctionsDict.funcArray.sort((obj1, obj2) => {
            if (obj1.funcName > obj2.funcName) {
              return 1;
            }
            if (obj1.funcName < obj2.funcName) {
              return -1;
            }
            return 0;
          });
          let selectedContent = "";
          for (let k = 0; k < dropdownFunctionsDict.funcArray.length; k++) {
            // go through the functions and find the one selected
            selectedContent = selectedContent + "<option value=" + dropdownFunctionsDict.funcArray[k].funcName + " title= \"" + dropdownFunctionsDict.funcArray[k].tooltip + "\"";
            if (dropdownFunctionsDict.funcArray[k].funcName === currentValue) {
              selectedContent = selectedContent + "selected";
            }
            selectedContent = selectedContent + ">" + dropdownFunctionsDict.funcArray[k].funcName + "</option>";
          }
          const popup = new joint.ui.Popup({
            events: {
              "click .btnUpdate": function () {
                const valueFunction = this.$(".value").val();
                processThis.attr({
                  value: {
                    value: valueFunction
                  }
                });
                (0, updateProcess)(processThis, initRappid);
                this.remove();
              }
            },
            content: ["<select class=\"PopupSelection value\">" + selectedContent + "</select><br>", "<button class=\"Popup btnUpdate\" style=\"FONT-WEIGHT: 600; left: 21%; margin-top: 8px;\">Update</button>"],
            target: target
          }).render();
        }
        updateShapeAttr(newValue) {
          this.attr(this.getShape(), newValue);
        }
        getShapeAttr() {
          return this.attr(this.getShape());
        }
        getShapeFillColor() {
          return this.attr(this.getShape() + "/fill");
        }
        getShapeOutline() {
          return this.attr(this.getShape() + "/stroke");
        }
        getImageAffiliation() {
          return "assets/icons/essenceAffil/AffilProcess.JPG";
        }
        getImageEssnce() {
          return "assets/icons/essenceAffil/EssProcess.jpg";
        }
        addToPairs(inOutLinkPairs, mainObject, cell, link, linkType) {
          const mainObjectID = mainObject.attributes.id;
          if (!inOutLinkPairs[mainObjectID]) {
            inOutLinkPairs[mainObjectID] = {
              mainObject: mainObject,
              Consumption: [],
              ConsumptionStates: [],
              Result: [],
              ResultStates: []
            };
            inOutLinkPairs[mainObjectID][linkType].push(link);
            inOutLinkPairs[mainObjectID][linkType + "States"].push(cell);
          } else {
            inOutLinkPairs[mainObjectID][linkType].push(link);
            inOutLinkPairs[mainObjectID][linkType + "States"].push(cell);
          }
          return inOutLinkPairs;
        }
        addDuplicationMark(init, duplication, direction = null) {
          const drawn = this.graph.getCell(duplication.id);
          if (!drawn) {
            return;
          }
          const cellView = init.paper.findViewByModel(duplication.id);
          if (!cellView) {
            return;
          }
          const h = duplication.height;
          const w = duplication.width;
          const fillColor = drawn.attr("ellipse/fill") ? drawn.attr("ellipse/fill") : duplication.fill;
          const strokeColor = drawn.attr("ellipse/stroke") ? drawn.attr("ellipse/stroke") : duplication.strokeColor;
          const duplicationMark = new vectorizer.V("path", {
            name: "duplicationMark",
            fill: fillColor,
            stroke: strokeColor,
            "stroke-width": "2"
          });
          const rect = new geometry.g.rect(0, 0, w, h);
          const geometryEllipse = new geometry.g.ellipse.fromRect(rect);
          const firstX = w * 3 / 4;
          const secondX = firstX + w / 7;
          const l1 = new geometry.g.Line(new geometry.g.Point(firstX, 0), new geometry.g.Point(firstX, h));
          const l2 = new geometry.g.Line(new geometry.g.Point(secondX, 0), new geometry.g.Point(secondX, h));
          const firstIntersect = geometryEllipse.intersectionWithLine(l1)[0];
          const secondIntersect = geometryEllipse.intersectionWithLine(l2)[0];
          const cPoint = this.calcThirdPoint(firstIntersect.x, firstIntersect.y, secondIntersect.x, secondIntersect.y, w, h);
          const path = "M" + firstIntersect.x + "," + firstIntersect.y + " Q" + cPoint.x + "," + cPoint.y + " " + secondIntersect.x + "," + secondIntersect.y;
          duplicationMark.attr("d", path);
          duplicationMark.translate(duplication.xPos, duplication.yPos + h / 50);
          // kipa.translate( 0 ,  h / 50);
          drawn.removeDuplicationMark();
          drawn.set("duplicationMark", duplicationMark);
          const arr = Array.from(init.paper.viewport.children);
          const index = arr.indexOf(cellView.el);
          init.paper.viewport.insertBefore(duplicationMark.node, init.paper.viewport.children[index]);
        }
        calcThirdPoint(x1, y1, x2, y2, w, h) {
          const centerX = (x1 + x2) / 2;
          const centerY = (y1 + y2) / 2;
          const myX = centerX + h * 1 / 12;
          const radius = Math.sqrt(Math.pow(centerX - x1, 2) + Math.pow(centerY - y1, 2));
          const y = (x1 - x2) / (y2 - y1) * myX + centerY - centerX * ((x1 - x2) / (y2 - y1));
          return {
            x: myX,
            y: y
          };
        }
        get counter() {
          return OpmProcess.counter;
        }
        getAxisEssence() {
          return 3;
        }
        getNumberedText(text, counter) {
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
          return prefix + " " + text + "ing";
        }
        getIconsForHalo() {
          return Object.assign(super.getIconsForHalo(), {
            styling: "assets/SVG/styleElement.svg"
          }, {
            timeDurationFunction: "assets/SVG/timeDuration.svg"
          });
        }
        closeTextEditor(init) {
          super.closeTextEditor(init);
          this.updateURLArray();
        }
        isComputational() {
          return this.attr("value/value") !== "None";
        }
        openTimeDuration(target, manager, params) {
          (0, openTimeDurationPopup)(target, this, manager, params);
        }
        openUserInputPrompt(target, logical) {
          openUserInputPromptPopup(target, this, logical);
        }
        // Arranging the states in symmetry order
        shiftEmbeddedToEdge(initRappid) {
          this.graph.startBatch("ignoreEvents");
          const visual = this.getVisual();
          if (visual.semiFolded.length > 0) {
            visual.arrangeInnerSemiFoldedThings();
            this.attr("text/ref-y", visual.refY);
            for (const visSemi of visual.semiFolded) {
              const drwn = this.graph.getCell(visSemi.id);
              drwn.set("position", {
                x: visSemi.xPos + visual.xPos,
                y: visSemi.yPos + visual.yPos
              });
            }
          }
          this.graph.stopBatch("ignoreEvents");
        }
        /**returns an object with default object style settings, as declared in opl service**/
        setStyleSettings() {
          return {
            font_size: defaultProcessStyleSettings.font_size,
            font: defaultProcessStyleSettings.font,
            text_color: defaultProcessStyleSettings.text_color,
            border_color: defaultProcessStyleSettings.border_color,
            fill_color: defaultProcessStyleSettings.fill_color
          };
        }
        /**
         * default style settings should be according to the organization (it will be overridden by the user's if exist)
         * */
        setRelevantStyleSettings(styleSettingsToUpdate, oplService) {
          Object.keys(styleSettingsToUpdate).forEach(function (key) {
            if (oplService.orgOplSettings && oplService.orgOplSettings.style && oplService.orgOplSettings.style.process && oplService.orgOplSettings.style.process.hasOwnProperty(key) && oplService.orgOplSettings.style.process[key] !== undefined && oplService.orgOplSettings.style.process[key] !== null) {
              styleSettingsToUpdate[key] = oplService.orgOplSettings.style.process[key];
            }
          });
          Object.keys(styleSettingsToUpdate).forEach(function (key) {
            if (oplService.settings && oplService.settings.style && oplService.settings.style.process.hasOwnProperty(key) && oplService.settings.style.process[key] !== undefined && oplService.settings.style.process[key] !== null) {
              styleSettingsToUpdate[key] = oplService.settings.style.process[key];
            }
          });
        }
        showDummyTooltip() {
          const init = (0, getInitRappidShared)();
          if (!init.paper || !this.attr("./data-tooltip")) {
            return;
          }
          const ttData = String(this.attr("./data-tooltip"));
          let splittedText = "";
          const splitted = ttData.split("<br>");
          for (const line of splitted) {
            splittedText += "<tspan x=\"0\" dy=\"1.2em\">" + line + "</tspan>";
          }
          const vel = vectorizer.V("<g><rect fill=\"#383838a1\" width=\"100\" height=\"30\"/><path d=\"M0 9L15 0.339745L15 17.6603L0 9Z\" transform=\"translate(-14.8,-20.1)\" fill=\"#383838a1\"/><text fill=\"white\" font-size=\"1em\">AAA</text></g>");
          const thisPos = this.get("position");
          const thisSize = this.get("size");
          vel.addClass("dummyTooltip");
          vel.appendTo(init.paper.viewport);
          vel.translate(thisPos.x + thisSize.width + 5, thisPos.y + thisSize.height / 2);
          const rectEl = vel.node.firstElementChild;
          const textEl = vel.node.lastElementChild;
          textEl.innerHTML = splittedText;
          // rectEl.setAttribute('transform', 'translate(0,-' + textEl.getBBox().height + ')');
          rectEl.setAttribute("transform", "translate(0,-20)");
          rectEl.setAttribute("width", textEl.getBBox().width + 20);
          rectEl.setAttribute("height", textEl.getBBox().height + 10);
          textEl.setAttribute("transform", "translate(10,-20)");
          // const xTransp = (rectEl.getBBox().width - textEl.getBBox().width) / 2
          // textEl.setAttribute('transform', 'translate(' + xTransp + ',0)');
        }
        setRangePopup(init) {}
        getHaloHandles(init) {
          const visual = this.getVisual();
          if (!visual) {
            return [];
          }
          const decider = visual.getCommandsDecider();
          return decider.set(init, this, visual).getHaloHandle();
        }
        getToolbarHandles(init) {
          const visual = this.getVisual();
          if (!visual) {
            return [];
          }
          const decider = visual.getCommandsDecider();
          return decider.set(init, this, visual).getToolabarHandle();
        }
      }
      return OpmProcess;
    })();
