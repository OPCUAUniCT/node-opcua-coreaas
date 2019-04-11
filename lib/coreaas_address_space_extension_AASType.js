const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASType representing an Asset Administration Shell.
    *
    * @param {object} options
    * @param {Identifier} options.identification The unique identifier for the AAS. The DataType is Identifier.
    * @param {string} [options.nodeId] The string representation of the NodeId for the AAS Object.
    * @param {string} [options.browseName] The BrowseName for the AAS Object.
    * @param {array | object} [options.assetRef] An array of Key object composing an AAS reference to an AssetType instance or the AASReference instance itself.
    * @param {object} [options.hasAsset] An Asset instance represented by this AAS.
    * @param {array | object} [options.derivedFromRef] An array of Key object composing an AAS reference to the derivation AAS or the AASReference instance itself. 
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info forS AAS. 
    * @param {string} [options.description] A description for the AAS. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    * @example
    * addressSpace.addAssetAdministrationShell({
    *      browseName: "SampleAAS",
    *      description: "Festo Controller",
    *      identification: new Identifier({
    *          id: "www.admin-shell.io/aas-sample/1.0",
    *          idType: IdentifierType.URI
    *      }),
    *      derivedFrom: [ new Key({
    *          idType: KeyType.IRDI,
    *          local: false,
    *          type: KeyElements.AssetAdministrationShell,
    *          value: "AAA#1234-454#123456789"
    *      }) ]
    * });
    */
    opcua.AddressSpace.prototype.addAssetAdministrationShell = function(options) {

        assert(options.identification, "No options.identification parameter inserted!");
        assert("id" in options.identification && "idType" in options.identification, "options.identification is not an Identifier.");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const aasType = addressSpace.findCoreAASObjectType("AASType");
        const aasFolder = addressSpace.rootFolder.objects.assetAdministrationShells;

        const aas = namespace.addObject({
            typeDefinition: aasType,
            browseName:    options.browseName || "AAS_" + options.identification.id,
            nodeId:        options.nodeId,
            organizedBy: aasFolder,
        });

        aas.coreAASType = "AASType";

        const folderType = addressSpace.findNode("FolderType").nodeId;

        const submodels = namespace.addObject({
            typeDefinition: folderType,
            browseName: "Submodels",
            componentOf: aas
        });

        const conceptDictionaries = namespace.addObject({
            typeDefinition: folderType,
            browseName: "ConceptDictionaries",
            componentOf: aas
        });

        const identification = namespace.addVariable({
            componentOf: aas,
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

        if (typeof options.derivedFromRef !== "undefined") {
            assert(Array.isArray(options.derivedFromRef) || options.derivedFromRef instanceof opcua.UAObject, "options.derivedFrom is neither a UAObject or an Array of Key.")
            
            if (Array.isArray(options.derivedFromRef)) {
                addressSpace.addAASReference({
                    component: aas,
                    browseName: "derivedFrom",
                    keys: options.derivedFromRef
                });
            } 
            else {
                assert(options.assetRef.coreAASType === "AASReferenceType", "options.assetRef is not an AASReferenceType instance.");

                aas.addReference({ referenceType: "HasComponent", nodeId: options.derivedFromRef});
            }            
        }

        if (typeof options.assetRef !== "undefined") {
            assert(Array.isArray(options.assetRef) || options.assetRef instanceof opcua.UAObject, "options.derivedFrom is neither a UAObject or an Array of Key.");
            
            if (Array.isArray(options.assetRef)) {
                addressSpace.addAASReference({
                    componentOf: aas,
                    browseName: "asset",
                    keys: options.assetRef
                });
            } 
            else {
                assert(options.assetRef.coreAASType === "AASReferenceType", "options.assetRef is not an AASReferenceType instance.");

                aas.addReference({ referenceType: "HasComponent", nodeId: options.assetRef});
            }
        }

        if (typeof options.hasAsset !== "undefined") {
            assert(options.hasAsset instanceof opcua.UAObject, "options.hasAsset contains some element that is not UAObject.");
            assert(options.hasAsset.coreAASType === "AssetType", "options.hasAsset is not an AssetType instance.");

            const hasAssetRefType = addressSpace.findCoreAASReferenceType("HasAsset");
            aas.addReference({ referenceType: hasAssetRefType, nodeId: options.hasAsset }); 
        }

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
                componentOf: aas,
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

        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            
            aas.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        /* 
         * Enhance aas with convenience methos 
         */

        /**
        * @function addNewSubmodel
        * @description Create a new instance of SubmodelType in the context of the AAS.
        *
        * @param {object} options
        * @param {Identifier} options.identification The unique identifier for the AAS. The DataType is Identifier.
        * @param {string} options.idShort The unique identifier for the AAS. The DataType is Identifier.
        * @param {string} [options.browseName] The BrowseName for the AAS Object.
        * @param {object} [options.hasSemantic] an Array of Key referencing to the Semantic element for the Submodel.
        * @param {object} [options.hasSubmodelSemantic] An SubmodelType instance with kind = Type.
        * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the Submodel.
        * @param {string} [options.description] A description for the Asset.
        * @param {object | number} [options.kind] A Kind value specifying if the Asset is Instance or Type.
        * @returns {object} The Object Node representing the Asset Administration Shell
        */
        aas.addNewSubmodel = (options) => {
            addressSpace.addSubmodel({
                browseName: options.browseName,
                kind: options.kind,
                idShort: options.idShort,
                identification: options.identification,
                hasSemantic: options.hasSemantic,
                submodelOf: aas,
                hasSubmodelSemantic: options.hasSubmodelSemantic,
                administration: options.administration,
                description: options.description
            });

            return aas;
        }

        aas.addSubmodel = (submodel) => {
            assert(submodel instanceof opcua.UAObject, "submodel parameter is not a UAObject.");
            assert(submodel.hasOwnProperty("submodelElements"), "submodel parameter is not a SubmodelType instance.");

            aas.submodels.addReference({referenceType: "Organizes", nodeId: submodel});
            return aas;
        }

        aas.hasAsset = (asset) => {
            assert(asset instanceof opcua.UAObject, "asset parameter contains some element that is not UAObject.");
            assert(asset.coreAASType === "AssetType", "asset parameter is not an AssetType instance.");

            const hasAssetRefType = addressSpace.findCoreAASReferenceType("HasAsset");
            aas.addReference({ referenceType: hasAssetRefType, nodeId: asset });
            return aas;
        }

        aas.isDerivedFrom = (der_aas) => {
            assert(der_aas instanceof opcua.UAObject, "parameter contains some element that is not UAObject.");
            assert(der_aas.coreAASType === "AASType", "parameter is not an AASType instance.");

            const isDerivedFromRefType = addressSpace.findCoreAASReferenceType("IsDerivedFrom");
            aas.addReference({ referenceType: isDerivedFromRefType, nodeId: der_aas });
            return aas;
        }

        return aas;
    };

};