// Source: decompiled/deobfuscated.js
// Original path: ./src/app/ImportOPX/OPX.Inzoomed_Tree.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Created by ta2er on 11/16/2017.
 */
class InzoomedTree {
  constructor(parentID, parentName, children) {
    this.children = [];
    this.parentID = parentID;
    this.parentName = parentName;
    this.children = children;
  }
  getParentID() {
    return this.parentID;
  }
  getLayout(OPD_Name, VThing, id) {
    for (let child of this.children) {
      if (OPD_Name.includes(child.$.name)) {
        if (child.ThingSection[0].VisualThing) {
          for (let Thing of child.ThingSection[0].VisualThing) {
            switch (VThing) {
              case "VisualObject":
                if (Thing.ThingData[0].VisualObject && Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
                  return {
                    data: Thing.ThingData[0].VisualObject[0].ConnectionEdgeAttr[0].$,
                    MainEntity: false,
                    child: false
                  };
                }
              case "VisualState":
                if (Thing.ThingData[0].VisualObject && Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
                  if (Thing.ThingData[0].VisualObject[0].VisualState) {
                    return {
                      data: Thing.ThingData[0].VisualObject[0].VisualState,
                      MainEntity: false,
                      child: false
                    };
                  }
                }
              case "VisualProcess":
                if (Thing.ThingData[0].VisualProcess && Thing.ThingData[0].VisualProcess[0].InstanceAttr[0].$.entityId === id) {
                  return {
                    data: Thing.ThingData[0].VisualProcess[0].ConnectionEdgeAttr[0].$,
                    MainEntity: false,
                    child: false
                  };
                }
            }
          }
        }
        if (child.MainEntity[0].VisualThing) {
          for (let Thing of child.MainEntity[0].VisualThing) {
            switch (VThing) {
              case "VisualObject":
                if (Thing.ThingData[0].VisualObject && Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
                  if (Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityInOpdId === 1) {
                    return {
                      data: Thing.ThingData[0].VisualObject[0].ConnectionEdgeAttr[0].$,
                      MainEntity: true,
                      child: false
                    };
                  } else {
                    return {
                      data: Thing.ThingData[0].VisualObject[0].ConnectionEdgeAttr[0].$,
                      MainEntity: true,
                      child: false
                    };
                  }
                }
              case "VisualState":
                if (Thing.ThingData[0].VisualObject && Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
                  if (Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityInOpdId === 1) {
                    if (Thing.ThingData[0].VisualObject[0].VisualState) {
                      return {
                        data: Thing.ThingData[0].VisualObject[0].VisualState,
                        MainEntity: true,
                        child: false
                      };
                    }
                  } else if (Thing.ThingData[0].VisualObject[0].VisualState) {
                    return {
                      data: Thing.ThingData[0].VisualObject[0].VisualState,
                      MainEntity: true,
                      child: false
                    };
                  }
                }
              case "VisualProcess":
                if (Thing.ThingData[0].VisualProcess && Thing.ThingData[0].VisualProcess[0].InstanceAttr[0].$.entityId === id) {
                  if (Thing.ThingData[0].VisualProcess[0].InstanceAttr[0].$.entityInOpdId === 1) {
                    return {
                      data: Thing.ThingData[0].VisualProcess[0].ConnectionEdgeAttr[0].$,
                      MainEntity: true,
                      child: false
                    };
                  } else {
                    return {
                      data: Thing.ThingData[0].VisualProcess[0].ConnectionEdgeAttr[0].$,
                      MainEntity: true,
                      child: false
                    };
                  }
                }
            }
          }
        }
        if (child.MainEntity[0].VisualThing[0].ChildrenContainer[0].VisualThing) {
          for (let Thing of child.MainEntity[0].VisualThing[0].ChildrenContainer[0].VisualThing) {
            switch (VThing) {
              case "VisualObject":
                if (Thing.ThingData[0].VisualObject && Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
                  return {
                    data: Thing.ThingData[0].VisualObject[0].ConnectionEdgeAttr[0].$,
                    MainEntity: false,
                    child: true
                  };
                }
              case "VisualState":
                if (Thing.ThingData[0].VisualObject && Thing.ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
                  if (Thing.ThingData[0].VisualObject[0].VisualState) {
                    return {
                      data: Thing.ThingData[0].VisualObject[0].VisualState,
                      MainEntity: false,
                      child: true
                    };
                  }
                }
              case "VisualProcess":
                if (Thing.ThingData[0].VisualProcess && Thing.ThingData[0].VisualProcess[0].InstanceAttr[0].$.entityId === id) {
                  return {
                    data: Thing.ThingData[0].VisualProcess[0].ConnectionEdgeAttr[0].$,
                    MainEntity: false,
                    child: true
                  };
                }
            }
          }
        }
      }
    }
  }
  getRelationLayout(OPD_Name, id) {
    for (let child of this.children) {
      if (OPD_Name.includes(child.$.name)) {
        if (child.FundamentalRelationSection[0].CommonPart) {
          let commonPart = child.FundamentalRelationSection[0].CommonPart;
          for (let c in commonPart) {
            let FundamentalRelation = commonPart[c].VisualFundamentalRelation;
            for (let f in FundamentalRelation) {
              if (FundamentalRelation[f].InstanceAttr[0].$.entityId === id) {
                return {
                  type: "Fundamental",
                  dataSource: commonPart[c].$,
                  dataTarget: FundamentalRelation[f].$,
                  dataVisual: child.FundamentalRelationSection[0]
                };
              }
            }
          }
        }
        if (child.GeneralRelationSection[0].VisualGeneralRelation) {
          let GeneralRelation = child.GeneralRelationSection[0].VisualGeneralRelation;
          for (let c in GeneralRelation) {
            if (GeneralRelation[c].InstanceAttr[0].$.entityId === id) {
              let Relation = GeneralRelation[c].LineAttr[0];
              return {
                type: "General",
                dataSource: Relation.$,
                dataTarget: Relation.$,
                dataVisual: child.GeneralRelationSection[0]
              };
            }
          }
        }
      }
    }
  }
  getLinkLayout(OPD_Name, id) {
    for (let child of this.children) {
      if (OPD_Name.includes(child.$.name)) {
        if (child.VisualLinkSection[0].VisualLink) {
          let visualLink = child.VisualLinkSection[0].VisualLink;
          for (let v in visualLink) {
            if (visualLink[v].InstanceAttr[0].$.entityId === id) {
              return {
                data: visualLink[v].LineAttr[0].$,
                dataVisual: child.VisualLinkSection[0]
              };
            }
          }
        }
      }
    }
  }
}