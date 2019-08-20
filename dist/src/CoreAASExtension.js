"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory = __importStar(require("node-opcua-factory"));
const path = __importStar(require("path"));
const builder_1 = require("./builders/builder");
class CoreAASExtension {
    constructor(addressSpace) {
        this.addressSpace = addressSpace;
        this.namespaceUri = "http://dieei.unict.it/coreAAS/";
        this.coreaasXmlFile = path.join(__dirname, "../nodesets/coreaas.xml");
        /* A Map containing all the Identifiables' id as key and the relevant NodeId of the Object */
        this.identifiableMap = new Map();
        this._aasBuilder = new builder_1.AASBuilder(this);
        this._administrativeBuilder = new builder_1.AdministrativeInformationBuilder(this);
        this._aasReferenceBuilder = new builder_1.AASReferenceBuilder(this);
        this._assetBuilder = new builder_1.AssetBuilder(this);
        this._submodelPropertyBuilder = new builder_1.SubmodelPropertyBuilder(this);
        this._submodelBuilder = new builder_1.SubmodelBuilder(this);
        this._dataSpecificationIECBuilder = new builder_1.DataSpecificationIEC61360Builder(this);
        this._edsBuilder = new builder_1.EmbeddedDataSpecificationBuilder(this);
        this._conceptDescriptionBuilder = new builder_1.ConceptDescriptionBuilder(this);
        this._conceptDictionaryBuilder = new builder_1.ConceptDictionaryBuilder(this);
        this._submodelElementsBuilder = new builder_1.SubmodelElementsBuilder(this);
        this._viewBuilder = new builder_1.ViewBuilder(this);
    }
    /* Getters */
    get coreAASNamespace() {
        return this.addressSpace.getNamespace(this.namespaceUri);
    }
    get namespace() {
        return this.addressSpace.getOwnNamespace();
    }
    get namespaceIndex() {
        return this.addressSpace.getNamespaceIndex(this.namespaceUri);
    }
    /* CoreAAS OPCUA Types */
    get Identifier() {
        return factory.getStructureTypeConstructor("Identifier");
    }
    get Key() {
        return factory.getStructureTypeConstructor("Key");
    }
    /* AddressSpace Builder methods */
    addAssetAdministrationShell(options) {
        return this._aasBuilder.addAssetAdministrationShell(options);
    }
    addAdministrativeInformation(options) {
        return this._administrativeBuilder.addAdministrativeInformation(options);
    }
    addAASReference(options) {
        return this._aasReferenceBuilder.addAASReference(options);
    }
    addAsset(options) {
        return this._assetBuilder.addAsset(options);
    }
    addSubmodelProperty(options) {
        return this._submodelPropertyBuilder.addSubmodelProperty(options);
    }
    addReferenceElement(options) {
        return this._submodelElementsBuilder.addReferenceElement(options);
    }
    addAASFile(options) {
        return this._submodelElementsBuilder.addAASFile(options);
    }
    addSubmodelElementCollection(options) {
        return this._submodelElementsBuilder.addSubmodelElementCollection(options);
    }
    addSubmodel(options) {
        return this._submodelBuilder.addSubmodel(options);
    }
    addAASView(options) {
        return this._viewBuilder.addAASView(options);
    }
    addDataSpecificationIEC61360(options) {
        return this._dataSpecificationIECBuilder.addDataSpecificationIEC61360(options);
    }
    addEmbeddedDataSpecification(options) {
        return this._edsBuilder.addEmbeddedDataSpecification(options);
    }
    addConceptDescription(options) {
        return this._conceptDescriptionBuilder.addConceptDescription(options);
    }
    addConceptDictionary(options) {
        return this._conceptDictionaryBuilder.addConceptDictionary(options);
    }
    /* Utility methods */
    findCoreAASObjectType(name) {
        return this.addressSpace.findObjectType(name, this.namespaceIndex);
    }
    findCoreAASReferenceType(name) {
        return this.addressSpace.findReferenceType(name, this.namespaceIndex);
    }
    findCoreAASVariableType(name) {
        return this.addressSpace.findVariableType(name, this.namespaceIndex);
    }
    findCoreAASDataType(name) {
        return this.addressSpace.findDataType(name, this.namespaceIndex);
    }
    getAASType() {
        return this.findCoreAASObjectType("AASType");
    }
    getAdministrativeInformationType() {
        return this.findCoreAASObjectType("AdministrativeInformationType");
    }
    getAssetType() {
        return this.findCoreAASObjectType("AssetType");
    }
    getAASReferenceType() {
        return this.findCoreAASObjectType("AASReferenceType");
    }
}
exports.CoreAASExtension = CoreAASExtension;
//# sourceMappingURL=CoreAASExtension.js.map