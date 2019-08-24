"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
class Builder {
    constructor(coreaas) {
        this.coreaas = coreaas;
        this._addressSpace = coreaas.addressSpace;
        this._namespace = coreaas.namespace;
    }
}
exports.Builder = Builder;
__export(require("./AASBuilder"));
__export(require("./AASReferenceBuilder"));
__export(require("./AdministrativeInformationBuilder"));
__export(require("./AssetBuilder"));
__export(require("./DataSpecificationIEC61360Builder"));
__export(require("./EmbeddedDataSpecificationBuilder"));
__export(require("./ConceptDescriptionBuilder"));
__export(require("./ConceptDictionaryBuilder"));
__export(require("./SubmodelBuilder"));
__export(require("./SubmodelPropertyBuilder"));
__export(require("./SubmodelElementsBuilder"));
__export(require("./ViewBuilder"));
//# sourceMappingURL=builder.js.map