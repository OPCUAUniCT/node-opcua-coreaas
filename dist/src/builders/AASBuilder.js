"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_utilities_1 = require("./builder_utilities");
const types_1 = require("../types");
const assert = require("assert");
const builder_1 = require("./builder");
class AASBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addAssetAdministrationShell(options) {
        assert(types_1.isIdentifier(options.identification), "options.identification has not the internal structure of an Identifier");
        const aasType = this.coreaas.getAASType();
        const aasFolder = this._addressSpace.rootFolder.objects.assetAdministrationShells;
        const aas = this._namespace.addObject({
            typeDefinition: aasType,
            browseName: options.browseName || "AAS_" + options.identification.id,
            nodeId: options.nodeId,
            organizedBy: aasFolder,
        });
        aas.referableChildrenMap = new Map();
        this.coreaas.identifiableMap.set(options.identification.id, aas);
        const folderType = this._addressSpace.findObjectType("FolderType").nodeId;
        const submodels = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "Submodels",
            componentOf: aas
        });
        const conceptDictionaries = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "ConceptDictionaries",
            componentOf: aas
        });
        const views = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "Views",
            componentOf: aas
        });
        const identification = builder_utilities_1.get_identification_creator(this.coreaas, aas)(options.identification);
        if (options.derivedFromRef != null) {
            this._create_addDerivedFromRef(aas)(options.derivedFromRef);
        }
        if (typeof options.assetRef !== "undefined") {
            this._create_addAssetRef(aas)(options.assetRef);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToAas = builder_utilities_1.get_description_creator(this.coreaas, aas);
            addDescriptionToAas(options.description);
        }
        if (options.administration != null) {
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AdministrativeInformationType")), "options.administration is not an AdministrativeInformationType Object.");
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            aas.addReference({ referenceType: "HasComponent", nodeId: options.administration });
        }
        /* Add convenient method */
        aas.hasAsset = (asset) => {
            assert(asset.typeDefinitionObj.isSupertypeOf(this.coreaas.getAssetType()), "asset is not an AssetType instance");
            const hasAssetRefType = this.coreaas.findCoreAASReferenceType("HasAsset");
            aas.addReference({ referenceType: hasAssetRefType, nodeId: asset });
            return aas;
        };
        aas.isDerivedFrom = (der_aas) => {
            assert(der_aas.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASType()), "asset is not an AssetType instance");
            const isDerivedFromRefType = this.coreaas.findCoreAASReferenceType("IsDerivedFrom");
            aas.addReference({ referenceType: isDerivedFromRefType, nodeId: der_aas });
            return aas;
        };
        aas.addConceptDictionary = (dict) => {
            assert(dict.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ConceptDictionaryType")), "parameter is not an ConceptDictionaryType instance.");
            aas.conceptDictionaries.addReference({ referenceType: "Organizes", nodeId: dict });
            aas.referableChildrenMap.set(dict.idShort._dataValue.value.value, dict);
            return aas;
        };
        aas.addSubmodelRef = (submodelRef) => {
            if (submodelRef instanceof Array) {
                submodelRef.forEach(el => assert(types_1.isKey(el), "submodelRef parameter contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    organizedBy: aas.submodels,
                    browseName: submodelRef[submodelRef.length - 1].value + "_Ref",
                    keys: submodelRef
                });
            }
            else {
                assert(submodelRef.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASReferenceType()), "submodelRef is not an AASReferenceType instance.");
                aas.submodels.addReference({ referenceType: "Organizes", nodeId: submodelRef });
            }
            return aas;
        };
        aas.hasSubmodel = (submodel) => {
            assert(submodel.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "asset parameter is not an SubmodelType instance.");
            const hasSubmodelRefType = this.coreaas.findCoreAASReferenceType("HasSubmodel");
            aas.addReference({ referenceType: hasSubmodelRefType, nodeId: submodel });
            return aas;
        };
        aas.addViews = (views) => {
            assert(views instanceof Array, "views parameter is not an Array.");
            views.forEach(view => {
                assert(view.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ViewType")), "An element of the Array is not a ViewType instance.");
                aas.views.addReference({ referenceType: "Organizes", nodeId: view });
                aas.referableChildrenMap.set(view.idShort._dataValue.value.value, view);
            });
            return aas;
        };
        aas.addDerivedFromRef = this._create_addDerivedFromRef(aas);
        aas.addAssetRef = this._create_addAssetRef(aas);
        return aas;
    }
    _create_addDerivedFromRef(aas) {
        const self = this;
        return function (derivedFrom) {
            assert(!aas.hasOwnProperty("derivedFrom"), "the AASType Object already contains a UA Property with Browsename derivedFrom");
            if (derivedFrom instanceof Array) {
                derivedFrom.forEach(el => assert(types_1.isKey(el), "derivedFrom parameter contains an element that is not a Key."));
                self.coreaas.addAASReference({
                    componentOf: aas,
                    browseName: "derivedFrom",
                    keys: derivedFrom
                });
            }
            else {
                assert(derivedFrom.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");
                aas.addReference({ referenceType: "HasComponent", nodeId: derivedFrom });
            }
            return aas;
        };
    }
    _create_addAssetRef(aas) {
        const self = this;
        return function (assetRef) {
            assert(!aas.hasOwnProperty("asset"), "the AASType Object already contains a UA Property with Browsename asset");
            if (assetRef instanceof Array) {
                assetRef.forEach(el => assert(types_1.isKey(el), "assetRef parameter contains an element that is not a Key."));
                self.coreaas.addAASReference({
                    componentOf: aas,
                    browseName: "asset",
                    keys: assetRef
                });
            }
            else {
                assert(assetRef.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");
                assert(assetRef.browseName.name === "asset", "the browsename of assetRef is not asset");
                aas.addReference({ referenceType: "HasComponent", nodeId: assetRef });
            }
            return aas;
        };
    }
}
exports.AASBuilder = AASBuilder;
//# sourceMappingURL=AASBuilder.js.map