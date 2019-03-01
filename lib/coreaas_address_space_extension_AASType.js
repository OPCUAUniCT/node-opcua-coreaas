const assert = require("assert");
const _ = require("underscore");

module.exports = function (opcua) {

    /**
     *Create a new instance of AASType representing an Asset Administration Shell.
    *
    * @param {object} options
    * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    */
    opcua.AddressSpace.prototype.addAssetAdministrationShell = function(options) {

        assert(options.identification, "No options.identification parameter inserted!");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const aasType = addressSpace.findCoreAASObjectType("AASType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace()
        const aasFolder = addressSpace.findNode(`ns=${coreAASNamespaceIndex};i=5044`);

        const aas = namespace.addObject({
            typeDefinition: aasType,
            browseName:    options.browseName,
            description:   options.description,
            nodeId:        options.nodeId,
            organizedBy: aasFolder,
        });

        const folderType = addressSpace.findNode("FolderType").nodeId;

        const submodels = namespace.addObject({
            typeDefinition: folderType,
            browseName: "Submodels",
            componentOf: aas
        });

        const derivationRef = addressSpace.addAASReference({
            isDerivationFor: aas,
            browseName: "Derivatio"
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

        const description = namespace.addVariable({
            componentOf: aas,
            browseName: "description",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({dataType: opcua.DataType.String, value: "My first AAS"});
                }
            }
        });

        return aas;
    };

};