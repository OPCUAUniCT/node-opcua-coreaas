const assert = require("assert");
const _ = require("underscore");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} [options.browseName]
    * @param {string} [options.description]
    * @param {object} [options.nodeId]
    * @param {object} options.isDerivationFor The unique identifier for the AAS. The DataType is Identifier. 
    * @returns {object} The Object Node representing the AASReference
    */
    opcua.AddressSpace.prototype.addAASReference = function(options) {

        assert(options.isDerivationFor, "Missing parent node. Provide at least one of the following parameters: isDerivationFor, isCaseOf or hasSemantic");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const aasReferenceType = addressSpace.findCoreAASObjectType("AASReferenceType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace()

        const aasReference = namespace.addObject({
            typeDefinition: aasReferenceType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId
        });

        const key = namespace.addVariable({
            propertyOf: aasReference,
            browseName: "key",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String, 
                        value: "Frozoni"
                    });
                }
            }
        });

         if (options.isDerivationFor) {
             const derivationParent = options.isDerivationFor;
             assert(derivationParent instanceof opcua.UAObject, "Parameter isDerivedFrom is not a UAObject object");

             const isDerivedFromType = addressSpace.findCoreAASReferenceType("IsDerivedFrom");

             derivationParent.addReference({
                 referenceType: isDerivedFromType,
                 nodeId: aasReference
             });
         }

         return aasReference;
    }
}