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
    * @param {array} [options.derivedFrom] An array of Key object composing an AAS reference to the derivation AAS. 
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
            addressSpace.addAASReference({
                derivationFor: aas,
                browseName: "derivedFrom",
                keys: options.derivedFrom
            });
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

        return aas;
    };

};