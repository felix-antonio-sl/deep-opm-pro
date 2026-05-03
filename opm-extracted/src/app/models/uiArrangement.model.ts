// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/uiArrangement.model.ts
// Extracted by opm-extracted/tools/extract.mjs

class UIArrangement {
  constructor() {}
  /**
   * @param visualObjects
   * @param direction
   * Manages the positioning process. Checks the desired movement direction, and
   * calls the function that in charge of setting the ground for such process.
   */
  arrangeObjects(visualObjects, direction) {
    const verticalGap = 45;
    const horizontalGap = 50;
    switch (direction) {
      case "left":
        {
          return this.shiftObjectsLeft(visualObjects, direction, verticalGap, horizontalGap);
        }
      case "top":
        {
          return this.shiftObjectsTop(visualObjects, direction, verticalGap, horizontalGap);
        }
      case "right":
        {
          return this.shiftObjectsRight(visualObjects, direction, verticalGap, horizontalGap);
        }
      case "bottom":
        {
          return this.shiftObjectsBottom(visualObjects, direction, verticalGap, horizontalGap);
        }
    }
  }
  /**
   * @param visualObjects
   * @param direction
   * @param verticalGap
   * @param horizontalGap
   *** REFERS ALL FOUR NEXT FUNCTIONS**
   * Ultimately, sets the ground for updatePosForObjectsArrangement().
   * Finds the relevant objects that will perform as the relative points whom according to them
   * the re-positioning process will take action.
   * Eventually, wraps the necessary data and passes it to updatePosForObjectsArrangement().
   */
  shiftObjectsTop(visualObjects, direction, verticalGap, horizontalGap) {
    let leftObject;
    let topObject;
    visualObjects.sort((a, b) => a.getEntityParams().yPos - b.getEntityParams().yPos);
    topObject = {
      object: visualObjects[0],
      yPos: visualObjects[0].getEntityParams().yPos,
      height: visualObjects[0].getEntityParams().height
    };
    visualObjects.sort((a, b) => a.getEntityParams().xPos - b.getEntityParams().xPos);
    leftObject = {
      object: visualObjects[0],
      xPos: visualObjects[0].getEntityParams().xPos,
      width: visualObjects[0].getEntityParams().width
    };
    const params = {
      visualObjects: visualObjects,
      direction: direction,
      shouldUpdateBothAxis: true,
      xPos: leftObject.xPos,
      yPos: topObject.yPos,
      gap: horizontalGap
    };
    this.updatePosForObjectsArrangement(params);
    return params;
  }
  shiftObjectsLeft(visualObjects, direction, verticalGap, horizontalGap) {
    let leftObject;
    let topObject;
    visualObjects.sort((a, b) => a.getEntityParams().xPos - b.getEntityParams().xPos);
    leftObject = {
      object: visualObjects[0],
      xPos: visualObjects[0].getEntityParams().xPos,
      width: visualObjects[0].getEntityParams().width
    };
    visualObjects.sort((a, b) => a.getEntityParams().yPos - b.getEntityParams().yPos);
    topObject = {
      object: visualObjects[0],
      yPos: visualObjects[0].getEntityParams().yPos,
      height: visualObjects[0].getEntityParams().height
    };
    const params = {
      visualObjects: visualObjects,
      direction: direction,
      shouldUpdateBothAxis: true,
      xPos: leftObject.xPos,
      yPos: topObject.yPos,
      gap: verticalGap
    };
    this.updatePosForObjectsArrangement(params);
    return params;
  }
  shiftObjectsRight(visualObjects, direction, verticalGap, horizontalGap) {
    let rightObject;
    let topObject;
    visualObjects.sort((a, b) => {
      return a.getEntityParams().xPos + a.getEntityParams().width - (b.getEntityParams().xPos + b.getEntityParams().width);
    });
    rightObject = {
      object: visualObjects[visualObjects.length - 1],
      xPos: visualObjects[visualObjects.length - 1].getEntityParams().xPos,
      width: visualObjects[visualObjects.length - 1].getEntityParams().width
    };
    visualObjects.sort((a, b) => a.getEntityParams().yPos - b.getEntityParams().yPos);
    topObject = {
      object: visualObjects[0],
      yPos: visualObjects[0].getEntityParams().yPos,
      height: visualObjects[0].getEntityParams().height
    };
    const params = {
      visualObjects: visualObjects,
      direction: direction,
      shouldUpdateBothAxis: true,
      xPos: rightObject.xPos,
      yPos: topObject.yPos,
      gap: verticalGap,
      referencedObject: rightObject
    };
    this.updatePosForObjectsArrangement(params);
    return params;
  }
  shiftObjectsBottom(visualObjects, direction, verticalGap, horizontalGap) {
    let bottomObject;
    let leftObject;
    visualObjects.sort((a, b) => {
      return a.getEntityParams().yPos + a.getEntityParams().height - (b.getEntityParams().yPos + b.getEntityParams().height);
    });
    bottomObject = {
      object: visualObjects[visualObjects.length - 1],
      yPos: visualObjects[visualObjects.length - 1].getEntityParams().yPos,
      height: visualObjects[visualObjects.length - 1].getEntityParams().height
    };
    visualObjects.sort((a, b) => {
      return a.getEntityParams().xPos - b.getEntityParams().xPos;
    });
    leftObject = {
      object: visualObjects[0],
      xPos: visualObjects[0].getEntityParams().xPos,
      width: visualObjects[0].getEntityParams().width
    };
    const params = {
      visualObjects: visualObjects,
      direction: direction,
      shouldUpdateBothAxis: true,
      xPos: leftObject.xPos,
      yPos: bottomObject.yPos,
      gap: horizontalGap,
      referencedObject: bottomObject
    };
    this.updatePosForObjectsArrangement(params);
    return params;
  }
  /**
   * @param params
   * Sets a new positions for the selected objects. Split by the direction of the movement,
   * such way each section relates to specific direction.
   */
  updatePosForObjectsArrangement(params) {
    switch (params.direction) {
      case "top":
        {
          this.updatePosForTopObjectsArrangement(params);
          break;
        }
      case "bottom":
        {
          this.updatePosForBottomObjectsArrangement(params);
          break;
        }
      case "left":
        {
          this.updatePosForLeftObjectsArrangement(params);
          break;
        }
      case "right":
        {
          this.updatePosForRightObjectsArrangement(params);
          break;
        }
    }
  }
  updatePosForTopObjectsArrangement(params) {
    let nextXPos = params.xPos;
    for (const object of params.visualObjects) {
      const objectOriginalPos = {
        xPos: object.getEntityParams().xPos,
        yPos: object.getEntityParams().yPos
      };
      if (params.shouldUpdateBothAxis) {
        object.xPos = nextXPos;
      }
      object.yPos = params.yPos;
      const posDifferences = {
        deltaX: object.getEntityParams().xPos - objectOriginalPos.xPos,
        deltaY: object.getEntityParams().yPos - objectOriginalPos.yPos
      };
      object.children.forEach(child => {
        child.xPos = child.xPos + posDifferences.deltaX;
        child.yPos = child.yPos + posDifferences.deltaY;
      });
      if (params.shouldUpdateBothAxis) {
        nextXPos = object.getEntityParams().xPos + object.getEntityParams().width + params.gap;
      }
    }
  }
  updatePosForBottomObjectsArrangement(params) {
    let nextXPos = params.xPos;
    for (const object of params.visualObjects) {
      const heightDifference = object.getEntityParams().height - params.referencedObject.height;
      const nextYPos = heightDifference <= 0 ? params.yPos + Math.abs(heightDifference) : params.yPos - Math.abs(heightDifference);
      const objectOriginalPos = {
        xPos: object.getEntityParams().xPos,
        yPos: object.getEntityParams().yPos
      };
      if (params.shouldUpdateBothAxis) {
        object.xPos = nextXPos;
      }
      object.yPos = nextYPos;
      const posDifferences = {
        deltaX: object.getEntityParams().xPos - objectOriginalPos.xPos,
        deltaY: object.getEntityParams().yPos - objectOriginalPos.yPos
      };
      object.children.forEach(child => {
        child.xPos = child.xPos + posDifferences.deltaX;
        child.yPos = child.yPos + posDifferences.deltaY;
      });
      if (params.shouldUpdateBothAxis) {
        nextXPos = object.getEntityParams().xPos + object.getEntityParams().width + params.gap;
      }
    }
  }
  updatePosForLeftObjectsArrangement(params) {
    let nextYPos = params.yPos;
    for (const object of params.visualObjects) {
      const objectOriginalPos = {
        xPos: object.getEntityParams().xPos,
        yPos: object.getEntityParams().yPos
      };
      object.xPos = params.xPos;
      if (params.shouldUpdateBothAxis) {
        object.yPos = nextYPos;
      }
      const posDifferences = {
        deltaX: object.getEntityParams().xPos - objectOriginalPos.xPos,
        deltaY: object.getEntityParams().yPos - objectOriginalPos.yPos
      };
      object.children.forEach(child => {
        child.xPos = child.xPos + posDifferences.deltaX;
        child.yPos = child.yPos + posDifferences.deltaY;
      });
      if (params.shouldUpdateBothAxis) {
        nextYPos = object.getEntityParams().yPos + object.getEntityParams().height + params.gap;
      }
    }
  }
  updatePosForRightObjectsArrangement(params) {
    let nextYPos = params.yPos;
    for (const object of params.visualObjects) {
      const widthDifference = object.getEntityParams().width - params.referencedObject.width;
      const nextXPos = widthDifference <= 0 ? params.xPos + Math.abs(widthDifference) : params.xPos - Math.abs(widthDifference);
      const objectOriginalPos = {
        xPos: object.getEntityParams().xPos,
        yPos: object.getEntityParams().yPos
      };
      object.xPos = nextXPos;
      if (params.shouldUpdateBothAxis) {
        object.yPos = nextYPos;
      }
      const posDifferences = {
        deltaX: object.getEntityParams().xPos - objectOriginalPos.xPos,
        deltaY: object.getEntityParams().yPos - objectOriginalPos.yPos
      };
      object.children.forEach(child => {
        child.xPos = child.xPos + posDifferences.deltaX;
        child.yPos = child.yPos + posDifferences.deltaY;
      });
      if (params.shouldUpdateBothAxis) {
        nextYPos = object.getEntityParams().yPos + object.getEntityParams().height + params.gap;
      }
    }
  }
}