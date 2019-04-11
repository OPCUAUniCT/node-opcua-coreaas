const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
    * Create a new instance of AssetType representing an Asset (both Type and Instance).
    *
    * @param {object} options
    * @param {Identifier} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {string} options.idShort A simple identification for the Asset.. 
    * @param {object} [options.nodeId] The string representation of the NodeId for the Asset Object.
    * @param {string} [options.browseName] The BrowseName for the Asset Object.
    * @param {object} [options.assetOf] The parent AASType containing the asset by means of HasAsset reference.
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the Asset. 
    * @param {string} [options.description] A description for the Asset. 
    * @param {object | number} [options.kind] A Kind value specifying if the Asset is Instance or Type. 
    * @param {array} [options.assetIdentificationModel] An Array of Key referencing the Submodel for the identification of the Asset. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    * 
    * @example
    *    addressSpace.addAsset({
    *        browseName: "3S7PLFDRS35",
    *        idShort: "3S7PLFDRS35",
    *        identification: new Identifier({
    *            id: "http://pk.festo.com/3S7PLFDRS35",
    *            idType: IdentifierType.URI
    *        }),
    *        kind: Kind.Instance,
    *        description: "Festo Controller",
    *        assetOf: aas_1,
    *        assetIdentificationModel: [new Key({
    *            idType: KeyType.URI,
    *            local: false,
    *            type: KeyElements.SubmodelElement,
    *            value: "//submodels/identification_3S7PLFDRS35"
    *        })]
    *    });
    */
    opcua.AddressSpace.prototype.addAsset = function(options) {

        assert(typeof options.identification !== "undefined", "No options.identification parameter inserted!");
        assert(typeof options.idShort !== "undefined", "No options.idShort parameter inserted!");
        assert("id" in options.identification && "idType" in options.identification, "options.identification is not an Identifier.");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const assetType = addressSpace.findCoreAASObjectType("AssetType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace();
        const assetsFolder = addressSpace.rootFolder.objects.assets;

        const asset = namespace.addObject({
            typeDefinition: assetType,
            browseName:    options.browseName || "Asset_" + options.identification.id,
            //description:   options.description, Use the Property description instead of the attribute
            nodeId:        options.nodeId,
            organizedBy: assetsFolder,
        });

        asset.coreAASType = "AssetType";

        //Add identification
        const identification = namespace.addVariable({
            componentOf: asset,
            browseName: "identification",
            dataType: addressSpace.findCoreAASDataType("Identifier"),
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.ExtensionObject, 
                        value: options.identification
                    });
                }
            }
        });

        //Add idShort
        const idShort = namespace.addVariable({
            propertyOf: asset,
            browseName: "idShort",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String, 
                        value: options.idShort
                    });
                }
            }
        });

        //Add description
        if (typeof options.description !== "undefined") {
            assert(typeof(options.description) === "string", "Parameter options.description is not a string.");

            namespace.addVariable({
                propertyOf: asset,
                browseName: "description",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: options.description});
                    }
                }
            });
        }

        // Add administration
        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            
            asset.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add assetIdentificationModel
        if (typeof options.assetIdentificationModel !== "undefined") {
            assert(Array.isArray(options.assetIdentificationModel), "options.assetIdentificationModel is not an array of Key.");
            
            addressSpace.addAASReference({
                componentOf: asset,
                browseName: "assetIdentificationModel",
                keys: options.assetIdentificationModel
            });
        }

        //Add this Asset to the AAS
        if (typeof options.assetOf !== "undefined") {
            assert(options.assetOf instanceof opcua.UAObject, "options.assetOf is not a UAObject.");
            
            const parent = options.assetOf;
            const hasAssetRefType = addressSpace.findCoreAASReferenceType("HasAsset");
            parent.addReference({ referenceType: hasAssetRefType, nodeId: asset });
        }

        //Add kind
        if (typeof options.kind !== "undefined") {

            let kind;

            if (typeof options.kind === "number") {
                kind = opcua.coreaas.Kind.get(options.kind);
            }
            else {
                assert(typeof options.kind === "object" && options.kind.constructor.name === opcua.coreaas.Kind.Instance.constructor.name, "options.kind is not a Kind enum.");
                kind = options.kind;
            }

            namespace.addVariable({
                propertyOf: asset,
                browseName: "kind",
                dataType: addressSpace.findCoreAASDataType("Kind"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: kind });
                    }
                }
            });
        }

        return asset;
    };

};