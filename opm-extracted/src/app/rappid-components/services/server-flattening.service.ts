// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/server-flattening.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let ServerFlatteningService = /*#__PURE__*/(() => {
  class ServerFlatteningService {
    constructor(initRappid, http) {
      this.initRappid = initRappid;
      this.http = http;
    }
    getFlattenedModelFromServer(leafsOnly = false) {
      const serverURL = this.initRappid.oplService.settings.connection.calculationsServer.computingServerURL;
      const jsonModel = JSON.stringify(this.initRappid.getOpmModel().toJson());
      return this.http.post(serverURL + "/flattening", {
        model: jsonModel,
        leafsOnly
      }).toPromise().then(retModel => {
        const serverModel = new OpmModel();
        serverModel.fromJson(retModel.data);
        return {
          success: true,
          serverModel: serverModel
        };
      }).catch(err => {
        return {
          success: false
        };
      });
    }
    getModelClustersFromServer(dsmArray) {
      const serverURL = this.initRappid.oplService.settings.connection.calculationsServer.computingServerURL;
      return this.http.post(serverURL + "/clustering", {
        dsmArray: dsmArray
      }).toPromise().then(ret => {
        return {
          success: true,
          clusters: ret.clusters
        };
      }).catch(err => {
        return {
          success: false
        };
      });
    }
    getPartitionsFromServer(dsmArray) {
      const serverURL = this.initRappid.oplService.settings.connection.calculationsServer.computingServerURL;
      return this.http.post(serverURL + "/partitioning", {
        dsmArray: dsmArray
      }).toPromise().then(ret => {
        return {
          success: true,
          partitionedDSM: ret.partitionedDSM
        };
      }).catch(err => {
        return {
          success: false
        };
      });
    }
    static #_ = (() => this.ɵfac = function ServerFlatteningService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ServerFlatteningService)(core /* ɵɵinject */.KVO(InitRappidService), core /* ɵɵinject */.KVO(HttpClient));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ServerFlatteningService,
      factory: ServerFlatteningService.ɵfac,
      providedIn: "root"
    }))();
  }
  return ServerFlatteningService;
})();
