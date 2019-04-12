const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
    * Create a new instance of AssetType representing an Asset (both Type and Instance).
    *
    * @param {object} options
    * @param {Identifier} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {string} options.idShort A simple identification for the Asset.
    * @param {object} [options.nodeId] The string representation of the NodeId for the Asset Object.
    * @param {string} [options.browseName] The BrowseName for the Asset Object.
    * @param {object} [options.assetOf] The parent AASType containing the asset by means of HasAsset reference.
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the Asset. 
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the Asset.  
    * @param {object | number} [options.kind] A Kind value specifying if the Asset is Instance or Type. 
    * @param {array | object} [options.assetIdentificationModelRef] An Array of Key or an AASReferenceType Object referencing the Submodel for the identification of the Asset. 
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
    *        description: new opcua.LocalizedText({locale: "en", text: "Festo Controller"}),
    *        assetOf: aas_1,
    *        assetIdentificationModelRef: [new Key({
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
            assert( typeof(options.description) === "string" || 
                    options.description instanceof opcua.LocalizedText || 
                    Array.isArray(options.description), "Parameter options.description is neither a string nor a LocalizedText nor an Array.");

            let localizedTextArray = [];

            if(typeof options.description === "string") {
                localizedTextArray.push(opcua.LocalizedText.coerce(options.description));
            } else if(options.description instanceof opcua.LocalizedText) {
                localizedTextArray.push(options.description);
            } else {
                options.description.forEach(el => assert(el instanceof opcua.LocalizedText, "An element of the array is not a LocalizedText."));
                localizedTextArray = options.description;
            }

            namespace.addVariable({
                componentOf: asset,
                browseName: "description",
                dataType: "LocalizedText",
                value: {
                    get: function() {
                        return new opcua.Variant({ 
                            dataType: opcua.DataType.LocalizedText, 
                            arrayType: opcua.VariantArrayType.Array,
                            value: localizedTextArray
                        });
                    }
                },
                valueRank: 1
            });
        }

        // Add administration
        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            assert(options.administration.coreAASType === "AdministrativeInformationType", "options.administration is not an AdministrativeInformationType Object.")
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'.")
            
            asset.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add assetIdentificationModel
        if (typeof options.assetIdentificationModelRef !== "undefined") {
            _addAssetIdentificationModel(options.assetIdentificationModelRef); 
        }

        //Add this Asset to the AAS
        if (typeof options.assetOf !== "undefined") {
            assert(options.assetOf instanceof opcua.UAObject, "options.assetOf is not a UAObject.");
            assert(options.assetOf.coreAASType === "AASType", "options.assetOf is not an AASType Object.");
            
            const parent = options.assetOf;
            const hasAssetRefType = addressSpace.findCoreAASReferenceType("HasAsset");
            parent.addReference({ referenceType: hasAssetRefType, nodeId: asset });
        }

        //Add kind
        if (typeof options.kind !== "undefined") {
            assert(typeof options.kind === "number" || typeof options.kind === "object", "options.kind is neither a number nor Kind enumeration");

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

        /* Convenience Methods */
        asset.addAssetIdentificationModelRef = _addAssetIdentificationModel;
        
        function _addAssetIdentificationModel(model) {
            assert(Array.isArray(model) || model instanceof opcua.UAObject, "model is neither an array of Key nor a UA Object.");
            assert(!asset.hasOwnProperty("assetIdentificationModel"), "the AssetType Object already contains a UA Property with Browsename assetIdentificationModel")

            if (Array.isArray(model)) {
                model.forEach(el => assert(el.constructor.name === "Key", "model parameter contains an element that is not a Key."));
                addressSpace.addAASReference({
                    componentOf: asset,
                    browseName: "assetIdentificationModel",
                    keys: model
                });
            } else  {
                assert(model.coreAASType === "AASReferenceType", "model is not an AASReferenceType Object");
                assert(model.browseName.name === "assetIdentificationModel", "model BrowseName is not 'assetIdentificationModel'");

                asset.addReference({ referenceType: "HasComponent", nodeId: model });
            }
        }

        return asset;
    };

};