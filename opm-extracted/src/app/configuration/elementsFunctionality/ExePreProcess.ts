// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/elementsFunctionality/ExePreProcess.ts
// Extracted by opm-extracted/tools/extract.mjs

function validateUnits(_x, _x2, _x3) {
  return _validateUnits.apply(this, arguments);
}
function _validateUnits() {
  _validateUnits = (0, default)(function* (allProcess, index, runParams) {
    if (index < allProcess.length) {
      yield validateProcessUnits(allProcess, index, runParams);
      const resultElements = allProcess[index].getLinks().outGoing.map(elem => elem.target.logicalElement);
      const resultComputationalObject = resultElements.filter(res => res instanceof OpmLogicalObject && res.isComputational());
      if (resultComputationalObject.length === 0) {
        //    createResultObject(allProcess[index]);
      }
    } else {
      // If the user didn't give a name to the exported file - get default file name
      const fileName = (0, getInitRappidShared)().opmModel.createDefaultModelName().trim();
      const interimSavePoints = runParams.downloadCSVEvery;
      // array that contains all the link ids needed to be visualized by a token
      runParams.linksArray = [];
      runParams.allValuesArray = []; // saves values for exporting
      (0, initGlobalEnvironment)();
      yield (0, execute)(runParams.linksArray, (0, getInitRappidShared)(), "SD", runParams.runner); // start execute from SD
      runParams.allValuesArray = (0, copyAllObjectValues)(runParams.allValuesArray, (0, getInitRappidShared)());
      // if new model was loaded and the csv button is still on (from the previous one), have to change the objects to export.To avoid exporting objects from different model.
      if (computationalObjectForExport.length !== 0) {
        const obj = computationalObjectForExport[0];
        if ((0, getInitRappidShared)().opmModel.logicalElements.includes(obj)) {
          runParams.allValuesArray = (0, copyAllObjectValuesAccordingToPreferences)(runParams.allValuesArray);
        }
      }
      runParams.exportArray = runParams.exportArray.concat((0, prepArrayForExport)(runParams.allValuesArray, runParams.runNumber + 1));
      runParams.exportExcelData.push(runParams.allValuesArray);
      const init = (0, getInitRappidShared)();
      if (init.elementToolbarReference.runByConfigurations && init.opmModel.getCurrentConfiguration()) {
        runParams.refsIds.push(init.opmModel.getCurrentConfiguration().refId);
      }
      if (((runParams.runNumber + 1) % interimSavePoints === 0 || runParams.runNumber + 1 === runParams.numberOfRuns) && runParams.downloadCSV) {
        (0, exportValues)(runParams.exportArray, fileName + " execution run #" + (runParams.runNumber + 1));
        (0, exportExcel)(runParams, fileName + " execution run #" + (runParams.runNumber + 1), (0, getInitRappidShared)());
      }
      if (runParams.runNumber === runParams.numberOfRuns - 1) {
        if (runParams.runner.isHeadless()) {
          init.elementToolbarReference.Executing = false;
        } else {
          (0, showExecution)(runParams.linksArray, 0, (0, getInitRappidShared)(), runParams.exportArray, fileName + " execution run #" + runParams.numberOfRuns, runParams.downloadCSV);
        }
      }
    }
  });
  return _validateUnits.apply(this, arguments);
}
function validateProcessUnits(_x4, _x5, _x6) {
  return _validateProcessUnits.apply(this, arguments);
}
function _validateProcessUnits() {
  _validateProcessUnits = (0, default)(function* (allProcess, index, run_params) {
    const links = allProcess[index].getLinks();
    const inputLinks = links.inGoing;
    const inputUnitsByMeasure = {};
    (0, convert)().measures().forEach(m => inputUnitsByMeasure[m] = []);
    const allUnits = (0, convert)().possibilities().map(function (item) {
      return item.toLowerCase();
    });
    for (let i = 0; i < inputLinks.length; i++) {
      const currentInput = inputLinks[i].sourceVisualElement.logicalElement;
      if (currentInput.units && currentInput.units !== "None" && currentInput.units !== "") {
        if (allUnits.includes(currentInput.units.toLowerCase())) {
          const measure = (0, convert)().describe(currentInput.units).measure;
          if (inputUnitsByMeasure[measure].indexOf(currentInput.units) < 0) {
            inputUnitsByMeasure[measure].push(currentInput.units);
          }
        }
      }
    }
    let hasUnmatchingUnits = false;
    for (const key in inputUnitsByMeasure) {
      const val = inputUnitsByMeasure[key];
      if (val.length > 1) {
        hasUnmatchingUnits = true;
        const convert_params = {
          inputLinks: inputLinks,
          measure: key,
          unit: null
        };
        const msg = "Unmatching " + key + " units. Convert all " + key + " inputs of " + allProcess[index].logicalElement.text + " to:";
        askUser(msg, convertInputUnits, inputUnitsByMeasure[key], convert_params, allProcess, index, run_params);
      }
    }
    if (!hasUnmatchingUnits) {
      yield validateUnits(allProcess, index + 1, run_params);
    }
  });
  return _validateProcessUnits.apply(this, arguments);
}
function askUser(questionText, yesFunc, unitOptions, paramsArray, allProcess, index, run_params) {
  if (!document.getElementById("alertDiv")) {
    const div = document.createElement("div");
    div.setAttribute("id", "alertDiv");
    div.setAttribute("class", "enterHandle");
    div.insertAdjacentHTML("afterbegin", "<span id='flashMsgtext'><h2 id='alertHeader'>Attention!! </h2> \n<p id=\"alertParagraph\"> </p>\n<br><br><button id=\"yes1stBTN\">" + unitOptions[0] + "</button><button id=\"yes2ndBTN\">" + unitOptions[1] + "</button><button id=\"noBTN\">Run as is</button></span>");
    const node = document.createTextNode("");
    div.appendChild(node);
    const body = document.getElementById("body");
    body.appendChild(div);
    document.getElementById("alertParagraph").innerHTML = questionText;
    $("#yes1stBTN").click(function () {
      $("#alertDiv").remove();
      paramsArray.unit = unitOptions[0];
      // yesFunc(...paramsArray);
      yesFunc(paramsArray.inputLinks, paramsArray.measure, paramsArray.unit, paramsArray.opdIdOfProcess);
      validateUnits(allProcess, index + 1, run_params);
    });
    $("#yes2ndBTN").click(function () {
      $("#alertDiv").remove();
      paramsArray.unit = unitOptions[1];
      yesFunc(paramsArray.inputLinks, paramsArray.measure, paramsArray.unit, paramsArray.opdIdOfProcess);
      validateUnits(allProcess, index + 1, run_params);
    });
    $("#noBTN").click(function () {
      $("#alertDiv").remove();
      validateUnits(allProcess, index + 1, run_params);
    });
  }
}
function convertInputUnits(inputLinks, measure, unit) {
  for (let i = 0; i < inputLinks.length; i++) {
    const currentInput = inputLinks[i].sourceVisualElement.logicalElement;
    if (currentInput instanceof OpmLogicalObject) {
      if (measure === (0, convert)().describe(currentInput.units).measure) {
        currentInput.value = (0, convert)(currentInput.value).from(currentInput.units).to(unit).toString();
        currentInput.units = unit;
        currentInput.text = currentInput.getName() + "\n[" + currentInput.units + "]{" + currentInput.alias + "}";
      }
    }
  }
}
function getAllComputationalProcesses() {
  const processes = new Array();
  const logicalProcesses = (0, getInitRappidShared)().opmModel.logicalElements.filter(elem => elem instanceof OpmLogicalProcess && elem.isComputational());
  for (let i = 0; i < logicalProcesses.length; i++) {
    const visualElements = logicalProcesses[i].visualElements;
    for (let j = 0; j < visualElements.length; j++) {
      processes.push(visualElements[j]);
    }
  }
  return processes;
}
function createResultObject(visualProcess) {
  const drawnProcess = getInitRappidShared().graph.getCell(visualProcess.id);
  const opdOfProcess = getInitRappidShared().opmModel.getOpdByElement(visualProcess);
  let new_x;
  let new_y;
  if (drawnProcess) {
    const process_bottom_right = drawnProcess.getBBox().bottomLeft();
    new_x = process_bottom_right.x + 50;
    new_y = process_bottom_right.y + 50;
  } else {
    new_x = 400;
    new_y = 400;
  }
  const pseudoObject = new OpmObject();
  const params = pseudoObject.getParams();
  const resultObjectLogical = getInitRappidShared().opmModel.createLogicalObject();
  resultObjectLogical.setParams(params);
  opdOfProcess.add(resultObjectLogical.visualElements[0]);
  resultObjectLogical.visualElements[0].setParams(params);
  resultObjectLogical.visualElements[0].setPos(new_x, new_y);
  resultObjectLogical.value = "value";
  resultObjectLogical.valueType = valueType.Number;
  const textEnd = visualProcess.logicalElement.text.indexOf("(");
  const text = visualProcess.logicalElement.text.substring(0, textEnd);
  resultObjectLogical.textModule.name = text + "Result";
  const linkParams = {
    type: linkType.Result,
    connection: linkConnectionType.enviromental,
    isCondition: false,
    isEvent: false
  };
  getInitRappidShared().opmModel.links.connect(visualProcess, resultObjectLogical.visualElements[0], linkParams);
  getInitRappidShared().graphService.renderGraph(opdOfProcess, getInitRappidShared());
}