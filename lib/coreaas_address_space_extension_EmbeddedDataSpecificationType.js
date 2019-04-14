const assert = require("assert");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.browseName The BrowseName for the EmbeddedDataSpecification Object.
    * @param {array} options.hasDataSpecification an array of Key list referring to the Data Specification Template,
    * @param {object} [options.dataSpecificationContent] an UA Object of type DataSpecificationType.
    * @param {object} [options.embeddedDataSpecificationOf] The parent node containing the EmbeddedataSpecification by means of an HasEmbeddedDataSpecificationReference.
    * @param {string} [options.description] A description for the EmbeddedDataSecification Object. 
    * @param {object} [options.nodeId] The string representation of the NodeId for the EmbeddedDataSpecification Object.
    * @returns {object} The Object Node representing the EmbeddedDataSpecificationType
    * 
    * @example
    *    addressSpace.addEmbeddedDataSpecification({
    *        browseName: "EmbeddedDS_1",
    *        hasDataSpecification: [new Key({
    *            idType: KeyType.URI,
    *            local: false,
    *            type: KeyElements.GlobalReference,
    *            value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
    *        })],
    *    })
    */
    opcua.AddressSpace.prototype.addEmbeddedDataSpecification = function(options) {

        assert(options.hasDataSpecification, "Missing parameter options.hasDataSpecification.")

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const edsType = addressSpace.findCoreAASObjectType("EmbeddedDataSpecificationType");

        const eds = namespace.addObject({
            typeDefinition: edsType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId
        });

        eds.coreAASType = "EmbeddedDataSpecificationType";

        addressSpace.addAASReference({
            componentOf: eds,
            browseName: "hasDataSpecification",
            keys: options.hasDataSpecification
        });

        if (typeof options.dataSpecificationContent !== "undefined") {
            assert(options.dataSpecificationContent, "Missing parameter options.dataSpecificationContent.")
            assert(options.dataSpecificationContent instanceof opcua.UAObject, "Parameter options.dataSpecificationContent is not a UAObject object");

            eds.addReference({ referenceType: "HasComponent", nodeId: options.dataSpecificationContent });
        }
        
        
        if(typeof options.embeddedDataSpecificationOf !== "undefined")
        {
            const parent = options.embeddedDataSpecificationOf;
            assert(parent instanceof opcua.UAObject, "Parameter options.embeddedDataSpecificationOf is not a UAObject object");
    
            const hasEmbeddedDataSpecificationType = addressSpace.findCoreAASReferenceType("HasEmbeddedDataSpecification");
    
            parent.addReference({ referenceType: hasEmbeddedDataSpecificationType, nodeId: eds });
        }

        //Add convenience methods
        eds.addDataSpecificationIEC61360 = (options) => {
            const dataSpec = addressSpace.addDataSpecificationIEC61360({
                preferredName: options.preferredName,
                shortName: options.shortName,
                valueFormat: options.valueFormat,
                browseName: options.browseName,
                unitId: options.unitId,
                description: options.description,
                nodeId: options.nodeId,
                definition: options.definition
            });

            eds.addReference({ referenceType: "HasComponent", nodeId: dataSpec });
            return eds;
        }
        
        return eds;
    }

    /**
    * Create a new instance of DataSpecificationIEC61360Type representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.preferredName
    * @param {string} options.shortName
    * @param {string} options.valueFormat
    * @param {string} [options.definition]
    * @param {string} [options.browseName] The BrowseName for the DataSpecificationIEC61360 Object.
    * @param {array} [options.unitId] An array of Key referencing a Unit definition
    * @param {string} [options.description] The descrption of the DataSpecificationIEC61360 Object.
    * @param {object} [options.nodeId] The string representation of the NodeId for the DataSpecificationIEC61360 Object.
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

        if (typeof options.definition !== "undefined") {
            namespace.addVariable({
                browseName: "definition",
                propertyOf: dataSpec,
                dataType: "String",
                value: {
                    get: () => {
                        return new opcua.Variant({
                            dataType: opcua.DataType.String,
                            value: options.definition
                        });
                    }
                }
            });
        }

        return dataSpec;
    }
}