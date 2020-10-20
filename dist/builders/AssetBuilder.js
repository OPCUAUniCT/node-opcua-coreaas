"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetBuilder = void 0;
const builder_utilities_1 = require("./builder_utilities");
const types_1 = require("../types");
const assert = require("assert");
const builder_1 = require("./builder");
class AssetBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addAsset(options) {
        assert(options.identification != null, "No options.identification parameter inserted!");
        assert(types_1.isIdentifier(options.identification), "options.identification is not an Identifier.");
        const assetType = this.coreaas.getAssetType();
        const assetsFolder = this._addressSpace.rootFolder.objects.assets;
        const asset = this._namespace.addObject({
            typeDefinition: assetType,
            browseName: options.browseName || "Asset_" + options.identification.id,
            nodeId: options.nodeId,
            organizedBy: assetsFolder,
        });
        asset.referableChildrenMap = new Map();
        this.coreaas.identifiableMap.set(options.identification.id, asset);
        //Add identification
        const identification = builder_utilities_1.get_identification_creator(this.coreaas, asset)(options.identification);
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, asset)(options.idShort);
        //Add description
        if (options.description != null) {
            const addDescriptionToAsset = builder_utilities_1.get_description_creator(this.coreaas, asset);
            addDescriptionToAsset(options.description);
        }
        if (options.administration != null) {
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.getAdministrativeInformationType()), "options.administration is not an AdministrativeInformationType Object.");
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            asset.addReference({ referenceType: "HasComponent", nodeId: options.administration });
        }
        //Add assetIdentificationModel
        if (typeof options.assetIdentificationModelRef !== "undefined") {
            this._create_addAssetIdentificationModel(asset)(options.assetIdentificationModelRef);
        }
        //Add billOfMaterial
        if (typeof options.billOfMaterialRef !== "undefined") {
            this._create_addBillOfMaterial(asset)(options.billOfMaterialRef);
        }
        //Add this Asset to the AAS
        if (options.assetOf != null) {
            const parent = options.assetOf;
            const hasAssetRefType = this.coreaas.findCoreAASReferenceType("HasAsset");
            parent.addReference({ referenceType: hasAssetRefType, nodeId: asset });
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_assetkind_creator(this.coreaas, asset)(options.kind);
        }
        asset.addAssetIdentificationModelRef = this._create_addAssetIdentificationModel(asset);
        asset.addBillOfMaterialRef = this._create_addBillOfMaterial(asset);
        return asset;
    }
    _create_addAssetIdentificationModel(asset) {
        const self = this;
        return function (model) {
            assert(!asset.hasOwnProperty("assetIdentificationModel"), "the AssetType Object already contains a UA Property with Browsename assetIdentificationModel");
            if (model instanceof Array) {
                model.forEach(el => assert(types_1.isKey(el), "model parameter contains an element that is not a Key."));
                self.coreaas.addAASReference({
                    componentOf: asset,
                    browseName: "assetIdentificationModel",
                    keys: model
                });
            }
            else {
                assert(model.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");
                assert(model.browseName.name === "assetIdentificationModel", "model BrowseName is not 'assetIdentificationModel'");
                asset.addReference({ referenceType: "HasComponent", nodeId: model });
            }
            return asset;
        };
    }
    _create_addBillOfMaterial(asset) {
        const self = this;
        return function (model) {
            assert(!asset.hasOwnProperty("billOfMaterial"), "the AssetType Object already contains a UA Property with Browsename billOfMaterial");
            if (model instanceof Array) {
                model.forEach(el => assert(types_1.isKey(el), "model parameter contains an element that is not a Key."));
                self.coreaas.addAASReference({
                    componentOf: asset,
                    browseName: "billOfMaterial",
                    keys: model
                });
            }
            else {
                assert(model.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");
                assert(model.browseName.name === "billOfMaterial", "model BrowseName is not 'billOfMaterial'");
                asset.addReference({ referenceType: "HasComponent", nodeId: model });
            }
            return asset;
        };
    }
}
exports.AssetBuilder = AssetBuilder;
//# sourceMappingURL=AssetBuilder.js.map