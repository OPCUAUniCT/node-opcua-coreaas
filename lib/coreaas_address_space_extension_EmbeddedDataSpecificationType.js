const assert = require("assert");
const _ = require("underscore");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.browseName
    * @param {object} options.embeddedDataSpecificationOf The parent node containing the EmbeddedataSpecification by means of an HasEmbeddedDataSpecificationReference
    * @param {array} options.hasDataSpecification an array of Key list referring to the Data Specification Template
    * @param {object} options.dataSpecificationContent an UA Object of type DataSpecificationType
    * @param {string} [options.description]
    * @param {object} [options.nodeId]
    * @returns {object} The Object Node representing the EmbeddedDataSpecificationType
    */
    opcua.AddressSpace.prototype.addEmbeddedDataSpecification = function(options) {

        assert(options.embeddedDataSpecificationOf, "Missing parent node. Provide options.embeddedDataSpecificationOf parameter.");
        assert(options.hasDataSpecification, "Missing parameter options.hasDataSpecification.")
        assert(options.dataSpecificationContent, "Missing parameter options.dataSpecificationContent.")

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const edsType = addressSpace.findCoreAASObjectType("EmbeddedDataSpecificationType");

        const eds = namespace.addObject({
            typeDefinition: edsType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId
        });

        addressSpace.addAASReference({
            componentOf: eds,
            browseName: "hasDataSpecification",
            keys: options.hasDataSpecification
        });
        
        eds.addReference({ referenceType: "HasComponent", nodeId: options.dataSpecificationContent });
        
        const parent = options.embeddedDataSpecificationOf;
        assert(parent instanceof opcua.UAObject, "Parameter options.embeddedDataSpecificationOf is not a UAObject object");

        const hasEmbeddedDataSpecificationType = addressSpace.findCoreAASReferenceType("HasEmbeddedDataSpecification");

        parent.addReference({ referenceType: hasEmbeddedDataSpecificationType, nodeId: eds });
        
        return eds;
    }

    /**
    * Create a new instance of DataSpecificationIEC61360Type representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.browseName
    * @param {string} options.preferredName
    * @param {string} options.shortName
    * @param {string} options.valueFormat
    * @param {array} [options.unitId] An array of Key referencing a Unit definition
    * @param {string} [options.description]
    * @param {object} [options.nodeId]
    * @returns {object} The Object Node representing the EmbeddedDataSpecificationType
    */
    opcua.AddressSpace.prototype.addDataSpecificationIEC61360 = function (options) {

        assert(options.preferredName, "Missing options.preferredName parameter.");
        assert(options.shortName, "Missing options.shortName parameter.");
        assert(options.valueFormat, "Missing options.valueFormat parameter.");

        const addressSpace = this;
        const namespace = addressSpace.getOwnNamespace();

        const iecType = addressSpace.findCoreAASObjectType("DataSpecificationIEC61360Type");

        const dataSpec = namespace.addObject({
            typeDefinition: iecType,
            browseName: options.browseName || "dataSpecificationContent",
            description: options.description,
            nodeId: options.nodeId
        });

        namespace.addVariable({
            browseName: "preferredName",
            propertyOf: dataSpec,
            dataType: "String",
            value: {
                get: () => {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String,
                        value: options.preferredName
                    });
                }
            }
        });

        namespace.addVariable({
            browseName: "shortName",
            propertyOf: dataSpec,
            dataType: "String",
            value: {
                get: () => {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String,
                        value: options.shortName
                    });
                }
            }
        });

        namespace.addVariable({
            browseName: "valueFormat",
            propertyOf: dataSpec,
            dataType: "String",
            value: {
                get: () => {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String,
                        value: options.valueFormat
                    });
                }
            }
        });

        if (options.unitId) {
            assert(Array.isArray(options.unitId), "options.unitId is not an array of Key")

            addressSpace.addAASReference({
                componentOf: dataSpec,
                browseName: "unitId",
                keys: options.unitId
            });            
        }

        return dataSpec;
    }
}