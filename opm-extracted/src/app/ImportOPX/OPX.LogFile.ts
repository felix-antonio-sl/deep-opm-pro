// Source: decompiled/deobfuscated.js
// Original path: ./src/app/ImportOPX/OPX.LogFile.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Log file For Import OPX
 */
let Checker = false;
function loadLogInfo(system, log) {
  //system info
  log.push("==========================================================");
  log.push(" Attention: the input file must be .opx saved in OPCAT 4.2.");
  log.push(" To fix old OPCAT version files :  ");
  log.push(" 1- Copy OPX File from your File System ");
  log.push(" 2- Install OPCAT 4.2 From : http://esml.iem.technion.ac.il/opcat-installation/");
  log.push(" 3- Open OPX file from OPCAT new version and save it again as OPX file ");
  log.push(" 4- Import again to OPCloud ");
  log.push("==========================================================");
  log.push("=================== Disclaimer ===========================");
  log.push(" The message (including its attachments) is intended for a specific individual and purpose.");
  log.push(" It may contain information which is privileged and/or confidential.");
  log.push(" If you are not the intended user, please completely delete it from your system.");
  log.push(" You are hereby notified that any use, retention, disclosure, copying, printing,");
  log.push(" forwarding, distribution or dissemination of this message and any of its attachments, or taking any action based on it is strictly prohibited.");
  log.push("=================== System Information ===================");
  log.push(system);
  log.push("================ Failed To Import ================");
}
function EditLogFile(log, data, comment, logcheck) {
  if (data != null) {
    log.push(data + "  ,Data:" + comment);
  } else {
    log.push(comment);
  }
  if (!logcheck) {
    Checker = true;
  }
}
function CreateOpmLogModel(log, ImportedOpmModel) {
  EditLogFile(log, null, "=============== Successfully Imported [" + ImportedOpmModel.opds.length + "]  OPDs ==============", true);
  for (let opdindex = 0; opdindex < ImportedOpmModel.opds.length; opdindex++) {
    let opdname = ImportedOpmModel.opds[opdindex].name;
    let parent_name = ImportedOpmModel.getOpdNameByID(ImportedOpmModel.opds[opdindex].parendId);
    opdname = opdname.replace("\n", " ");
    parent_name = parent_name.replace("\n", " ");
    EditLogFile(log, "[" + opdindex + "] " + opdname, " Num Of Elements : " + ImportedOpmModel.opds[opdindex].visualElements.length + " ,--Parent OPD: " + parent_name, true);
  }
}