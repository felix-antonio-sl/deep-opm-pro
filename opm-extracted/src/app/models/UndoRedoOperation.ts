// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/UndoRedoOperation.ts
// Extracted by opm-extracted/tools/extract.mjs

class UndoRedoOperation {
  constructor() {
    this.diffs = [];
    this.shouldLog = {
      value: true,
      contextName: undefined
    };
    this.undoStack = [];
    this.redoStack = [];
  }
  emptyRedoStack() {
    this.redoStack = [];
  }
  getUndoStack() {
    return [...this.undoStack];
  }
  setShouldLog(value, contextName) {
    // if it is already locked
    if (this.shouldLog.value === false && value === false) {
      return;
    }
    if (value === true && contextName !== this.shouldLog.contextName) {
      return;
    }
    this.shouldLog = {
      value: value,
      contextName: contextName
    };
  }
  shouldLogForUndoRedo() {
    return this.shouldLog.value;
  }
  updateReasonetoLastUndoOp(reason) {
    if (this.undoStack.length > 0) {
      this.undoStack[this.undoStack.length - 1].reason = reason;
    }
  }
  setLastState(state) {
    this.lastState = state;
  }
  getLastUndoStateReason() {
    if (this.undoStack.length > 0) {
      return "Undo " + this.undoStack[this.undoStack.length - 1].reason;
    } else {
      return "Undo";
    }
  }
  getLastRedoStateReason() {
    if (this.redoStack.length > 0) {
      return "Redo " + this.redoStack[this.redoStack.length - 1].reason;
    } else {
      return "Redo";
    }
  }
  popUndo(currentState) {
    const item = this.undoStack.pop();
    if (item && item.reason) {
      currentState.reason = item.reason;
    }
    this.redoStack.push(currentState);
    return item;
  }
  popRedo(currentState) {
    const item = this.redoStack.pop();
    if (!item) {
      return;
    }
    currentState.reason = item.reason;
    this.undoStack.push(currentState);
    return item;
  }
  log(param) {
    this.undoStack.push(param);
    this.redoStack.splice(0, this.redoStack.length);
    // this.logDiffs(param);
    this.setLastState(param.json);
    if (this.undoStack.length > 15) {
      delete this.undoStack[0];
      this.undoStack[0] = null;
      this.undoStack.splice(0, 1);
    }
  }
  getLastUndoOpertaion() {
    if (this.undoStack.length > 0) {
      return this.undoStack[this.undoStack.length - 1];
    }
  }
  removeLastUndoOperation() {
    this.undoStack.pop();
  }
  getRedoStack() {
    return this.redoStack;
  }
  setUndoStack(stack) {
    this.undoStack = stack;
  }
  setRedoStack(stack) {
    this.redoStack = stack;
  }
  resetStacks() {
    this.redoStack = [];
    this.undoStack = [];
  }
}
