"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
class Builder {
    constructor(coreaas) {
        this.coreaas = coreaas;
        this._addressSpace = coreaas.addressSpace;
        this._namespace = coreaas.namespace;
    }
}
exports.Builder = Builder;
__exportStar(require("./AASBuilder"), exports);
__exportStar(require("./AASReferenceBuilder"), exports);
__exportStar(require("./AdministrativeInformationBuilder"), exports);
__exportStar(require("./AssetBuilder"), exports);
__exportStar(require("./DataSpecificationIEC61360Builder"), exports);
__exportStar(require("./EmbeddedDataSpecificationBuilder"), exports);
__exportStar(require("./ConceptDescriptionBuilder"), exports);
__exportStar(require("./ConceptDictionaryBuilder"), exports);
__exportStar(require("./SubmodelBuilder"), exports);
__exportStar(require("./SubmodelPropertyBuilder"), exports);
__exportStar(require("./SubmodelElementsBuilder"), exports);
__exportStar(require("./ViewBuilder"), exports);
//# sourceMappingURL=builder.js.map