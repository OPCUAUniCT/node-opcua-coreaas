const assert = require("assert");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.browseName The BrowseName for the AASReference Object.
    * @param {string} [options.description] A description for the AASReference Object. 
    * @param {object} [options.nodeId] The string representation of the NodeId for the AASreference Object.
    * @param {object} [options.componentOf] The parent node containing the AASReference by means of an HasComponent Reference. 
    * @param {object} [options.organizedBy] The parent node containing the AASReference by means of an Organizes Reference. 
    * @param {object} [options.isCaseOf] The parent node containing the AASReference by means of an IsCaseOf Reference. 
    * @param {object} options.keys An array of Key constituting the AASReference. 
    * @returns {object} The Object Node representing the AASReference
    * 
    * @example
    *    addressSpace.addAASReference({
    *        componentOf: aas,
    *        browseName: "derivedFrom",
    *        keys: options.keys
    *    });
    */
    opcua.AddressSpace.prototype.addAASReference = function(options) {

        assert(options.browseName, "options.browseName parameter is missing.")
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

        aasReference.coreAASType = "AASReferenceType";

        const key = namespace.addVariable({
            propertyOf: aasReference,
            browseName: "keys",
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

        if (typeof options.organizedBy !== "undefined") {
            const organizingParent = options.organizedBy;
            assert(organizingParent instanceof opcua.UAObject, "Parameter options.organizedBy is not a UAObject object");

            organizingParent.addReference({
                referenceType: "Organizes",
                nodeId: aasReference
            });
        }

        if (typeof options.isCaseOf !== "undefined") {
            const parent = options.isCaseOf;
            assert(parent instanceof opcua.UAObject, "Parameter options.isCaseOf is not a UAObject object");

            const isCaseOfRefType = addressSpace.findCoreAASReferenceType("IsCaseOf");

            parent.addReference({
                referenceType: isCaseOfRefType,
                nodeId: aasReference
            });
        }

        return aasReference;
    }
}