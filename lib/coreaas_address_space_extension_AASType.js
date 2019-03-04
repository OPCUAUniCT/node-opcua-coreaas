const assert = require("assert");
const _ = require("underscore");

module.exports = function (opcua) {

    /**
     *Create a new instance of AASType representing an Asset Administration Shell.
    *
    * @param {object} options
    * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {array} [options.derivedFrom] An array of Key object composing an AAS reference to the derivation AAS. 
    * @param {string} [options.description] A description for the AAS. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    */
    opcua.AddressSpace.prototype.addAssetAdministrationShell = function(options) {

        assert(options.identification, "No options.identification parameter inserted!");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace(); //TODO
        
        const aasType = addressSpace.findCoreAASObjectType("AASType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace();
        const aasFolder = addressSpace.findNode(`ns=${coreAASNamespaceIndex};i=5044`);

        const aas = namespace.addObject({
            typeDefinition: aasType,
            browseName:    options.browseName,
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

        if (options.derivedFrom) {
            addressSpace.addAASReference({
                derivationFor: aas,
                browseName: "derivedFrom",
                keys: options.derivedFrom
            });
        }

        if(options.description) {
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


        return aas;
    };

};