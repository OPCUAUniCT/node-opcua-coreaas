const assert = require("assert");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} [options.browseName]
    * @param {string} [options.description]
    * @param {object} [options.nodeId]
    * @param {object} [options.derivationFor] The parent node containing the AASReference by means of an IsDerivedFrom Reference. 
    * @param {object} [options.componentOf] The parent node containing the AASReference by means of an HasComponent Reference. 
    * @param {object} options.keys TODO. 
    * @returns {object} The Object Node representing the AASReference
    */
    opcua.AddressSpace.prototype.addAASReference = function(options) {

        assert(options.derivationFor || options.componentOf, "Missing parent node. Provide at least one of the following parameters: options.derivationFor, options.isCaseOf, options.hasSemantic and options.componentOf");
        assert(options.keys, "Missing parameter options.keys.")

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const aasReferenceType = addressSpace.findCoreAASObjectType("AASReferenceType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace()

        const aasReference = namespace.addObject({
            typeDefinition: aasReferenceType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId,
            componentOf: options.componentOf
        });

        const key = namespace.addVariable({
            propertyOf: aasReference,
            browseName: "key",
            dataType: addressSpace.findCoreAASDataType("Key"),
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.ExtensionObject,
                        arrayType: opcua.VariantArrayType.Array, 
                        value: options.keys
                    });
                }
            },
            valueRank: 1
        });

         if (options.isDerivationFor) {
             const derivationParent = options.derivationFor;
             assert(derivationParent instanceof opcua.UAObject, "Parameter options.derivationFor is not a UAObject object");

             const isDerivedFromType = addressSpace.findCoreAASReferenceType("IsDerivedFrom");

             derivationParent.addReference({
                 referenceType: isDerivedFromType,
                 nodeId: aasReference
             });
         }

         return aasReference;
    }
}