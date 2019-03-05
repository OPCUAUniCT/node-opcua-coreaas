const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
     *Create a new instance of AASType representing an Asset Administration Shell.
    *
    * @param {object} options
    * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {string} [options.browseName]  
    * @param {object} [options.hasAsset] An Asset instance represented by this AAS.
    * @param {array | object} [options.derivedFrom] An array of Key object composing an AAS reference to the derivation AAS or the AASReference instance itself. 
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info forS AAS. 
    * @param {string} [options.description] A description for the AAS. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    */
    opcua.AddressSpace.prototype.addAssetAdministrationShell = function(options) {

        assert(options.identification, "No options.identification parameter inserted!");
        assert("id" in options.identification && "idType" in options.identification, "options.identification is not an Identifier.");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const aasType = addressSpace.findCoreAASObjectType("AASType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace();
        const aasFolder = addressSpace.rootFolder.objects.assetAdministrationShells;

        const aas = namespace.addObject({
            typeDefinition: aasType,
            browseName:    options.browseName || "AAS_" + options.identification.id,
            //description:   options.description, Use the Property description instead of the attribute
            nodeId:        options.nodeId,
            organizedBy: aasFolder,
        });

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

        if (typeof options.derivedFrom !== "undefined") {
            assert(Array.isArray(options.derivedFrom) || options.derivedFrom instanceof opcua.UAObject, "options.derivedFrom is neither a UAObject or an Array of Key.")
            
            if (Array.isArray(options.derivedFrom)) {
                addressSpace.addAASReference({
                    derivationFor: aas,
                    browseName: "derivedFrom",
                    keys: options.derivedFrom
                });
            } 
            else {
                let derivation = options.derivedFrom;
                let isDerivedFromRefType = addressSpace.findCoreAASReferenceType("IsDerivedFrom");
                aas.addReference({ referenceType: isDerivedFromRefType, nodeId: derivation });
            }            
        }

        if (typeof options.hasAsset !== "undefined") {
            let assets = [];
            assets = _.concat(assets, options.hasAsset)
            assets.forEach((asset) => assert(asset instanceof opcua.UAObject, "options.hasAsset contains some element that is not UAObject."));            
            const hasAssetRefType = addressSpace.findCoreAASReferenceType("HasAsset");

            assets.forEach((asset) => aas.addReference({ referenceType: hasAssetRefType, nodeId: asset }));            
        }

        if (typeof options.description !== "undefined") {
            assert(typeof(options.description) === "string", "Parameter options.description is not a string.");

            namespace.addVariable({
                componentOf: aas,
                browseName: "description",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: options.description});
                    }
                }
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
         * Create a new instance of SubmodelType in the contest of this AAS.
        *
        * @param {object} options
        * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier.
        * @param {string} options.idShort The unique identifier for the AAS. The DataType is Identifier.
        * @param {string} [options.browseName]
        * @param {object} [options.hasSemantic] an Array of Key referencing to the Semantic element for the Submodel.
        * @param {object} [options.hasSubmodelSemantic] An SubmodelType instance with kind = Type.
        * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the Submodel.
        * @param {string} [options.description] A description for the Asset.
        * @param {object | number} [options.kind] A Kind value specifying if the Asset is Instance or Type.
        * @returns {object} The Object Node representing the Asset Administration Shell
        */
        aas.addSubmodel = (options) => {
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

        return aas;
    };

};