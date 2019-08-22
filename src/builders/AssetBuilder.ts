import { UAObject } from "node-opcua";
import { BaseUAObject } from "node-opcua-factory";
import { get_description_creator, get_idShort_creator, get_identification_creator, get_kind_creator } from "./builder_utilities";
import { CoreAASExtension } from "../CoreAASExtension";
import { AssetObject, CoreAASObjectsFolder, isKey, Identifier, isIdentifier, Key } from "../types";
import assert = require("assert");
import { Builder } from "./builder";
import { AssetOptions } from "../options_types";

export class AssetBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addAsset(options: AssetOptions): AssetObject {

        assert(options.identification != null, "No options.identification parameter inserted!");
        assert(isIdentifier(options.identification), "options.identification is not an Identifier.");

        const assetType = this.coreaas.getAssetType();
        const assetsFolder = (<CoreAASObjectsFolder> this._addressSpace.rootFolder.objects).assets;

        const asset: AssetObject = this._namespace.addObject({
            typeDefinition: assetType,
            browseName:    options.browseName || "Asset_" + options.identification.id,
            nodeId:        options.nodeId,
            organizedBy: assetsFolder,
        }) as AssetObject;

        asset.referableChildrenMap = new Map();
        this.coreaas.identifiableMap.set((<Identifier>options.identification).id, asset);

        //Add identification
        const identification = get_identification_creator(this.coreaas, asset)(options.identification);

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, asset)(options.idShort);

        //Add description
        if (options.description != null) {
            const addDescriptionToAsset = get_description_creator(this.coreaas, asset);
            addDescriptionToAsset(options.description);
        }

        if (options.administration != null) {
            
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.getAdministrativeInformationType()) , "options.administration is not an AdministrativeInformationType Object.")
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            
            asset.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add assetIdentificationModel
        //Add assetIdentificationModel
        if (typeof options.assetIdentificationModelRef !== "undefined") {
            this._create_addAssetIdentificationModel(asset)(options.assetIdentificationModelRef); 
        }

        //Add this Asset to the AAS
        if (options.assetOf != null) {
                        
            const parent = options.assetOf;
            const hasAssetRefType = this.coreaas.findCoreAASReferenceType("HasAsset")!;
            parent.addReference({ referenceType: hasAssetRefType, nodeId: asset });
        }

        //Add kind
        if (options.kind != null) {            
            get_kind_creator(this.coreaas, asset)(options.kind);
        }

        asset.addAssetIdentificationModelRef = this._create_addAssetIdentificationModel(asset);

        return asset;
    }

    private _create_addAssetIdentificationModel(asset: AssetObject): (model: UAObject | Key[]) => AssetObject {
        const self = this;
        
        return function (model: UAObject | Key[]): AssetObject {
            assert(!asset.hasOwnProperty("assetIdentificationModel"), "the AssetType Object already contains a UA Property with Browsename assetIdentificationModel");

            if (model instanceof Array) {
                model.forEach(el => assert(isKey(el), "model parameter contains an element that is not a Key."));
                self.coreaas.addAASReference({
                    componentOf: asset,
                    browseName: "assetIdentificationModel",
                    keys: model
                });
            } else  {
                assert(model.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");
                assert(model.browseName.name === "assetIdentificationModel", "model BrowseName is not 'assetIdentificationModel'");

                asset.addReference({ referenceType: "HasComponent", nodeId: model });
            }

            return asset;
        }
    }

}