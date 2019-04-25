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
            assert(typeof options === "object" || options instanceof opcua.UAObject, "options parameter is neither an UAObject nor a object.");
            assert(!eds.hasOwnProperty("dataSpecificationContent"), "the EmbeddedDataSpecificationType Object already contains a Component with Browsename dataSpecificationContent");

            if (options instanceof opcua.UAObject) {
                assert(options.coreAASType === "DataSpecificationIEC61360Type", "options parameter is not a DataSpecificationIEC61360Type Object.");
                assert(options.browseName.name === "dataSpecificationContent", "options parameter browsename is not 'dataSpecificationContent'.");

                eds.addReference({ referenceType: "HasComponent", nodeId: options });
            } else {
                const dataSpec = _addDataSpecificationIEC61360.call(eds.addressSpace, options);
                eds.addReference({ referenceType: "HasComponent", nodeId: dataSpec });
            }
            return eds;
        }
        
        return eds;
    }

    /**
    * Create a new instance of DataSpecificationIEC61360Type representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} [options.identifier]
    * @param {string} [options.preferredName]
    * @param {string} [options.definition]
    * @param {string} [options.dataType]
    * @param {string} [options.unit]
    * @param {array | object} [options.unitId] An array of Key object composing an AAS reference to an AssetType instance or the AASReference instance itself.
    * @param {string} [options.iecCategory]
    * @param {string} [options.iecLanguageCode]
    * @param {string} [options.note]
    * @param {string} [options.shortName]
    * @param {string} [options.valueFormat]
    * @param {string} [options.version]
    * @param {string} [options.revision]
    * @param {string} [options.browseName] The BrowseName for the DataSpecificationIEC61360 Object.
    * @param {string} [options.description] The descrption of the DataSpecificationIEC61360 Object.
    * @param {object} [options.nodeId] The string representation of the NodeId for the DataSpecificationIEC61360 Object.
    * @returns {object} The Object Node representing the EmbeddedDataSpecificationType
    */
    opcua.AddressSpace.prototype.addDataSpecificationIEC61360 = _addDataSpecificationIEC61360;
    
    function _addDataSpecificationIEC61360 (options) {

        assert(typeof options === "object", "options parameter is not an object");

        const addressSpace = this;
        const namespace = addressSpace.getOwnNamespace();

        const iecType = addressSpace.findCoreAASObjectType("DataSpecificationIEC61360Type");

        const dataSpec = namespace.addObject({
            typeDefinition: iecType,
            browseName: options.browseName || "dataSpecificationContent",
            description: options.description,
            nodeId: options.nodeId
        });

        dataSpec.coreAASType = "DataSpecificationIEC61360Type";

        if (typeof options.identifier !== "undefined") _addUAProperty_for_string("identifier", options.identifier);
        if (typeof options.preferredName !== "undefined") _addUAProperty_for_string("preferredName", options.preferredName);
        if (typeof options.definition !== "undefined") _addUAProperty_for_string("definition", options.definition);
        if (typeof options.dataType !== "undefined") _addUAProperty_for_string("dataType", options.dataType);
        if (typeof options.unit !== "undefined") _addUAProperty_for_string("unit", options.unit);
        if (typeof options.unitId !== "undefined") {
            assert(Array.isArray(options.unitId) || options.unitId instanceof opcua.UAObject, "options.unitId is neither a UAObject or an Array of Key.")
            assert(!dataSpec.hasOwnProperty("unitId"), "the DataSpecificationIEC61360Type Object already contains a UA Property with Browsename unitId");

            if (Array.isArray(options.unitId)) {

                options.unitId.forEach(el => assert(el.constructor.name === "Key", "options.unitId Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: dataSpec,
                    browseName: "unitId",
                    keys: options.unitId
                });
            } 
            else {
                assert(options.unitId.coreAASType === "AASReferenceType", "options.unitId is not an AASReferenceType instance.");

                dataSpec.addReference({ referenceType: "HasComponent", nodeId: options.unitId});
            } 
        }
        if (typeof options.iecCategory !== "undefined") _addUAProperty_for_string("iecCategory", options.iecCategory);
        if (typeof options.iecLanguageCode !== "undefined") _addUAProperty_for_string("iecLanguageCode", options.iecLanguageCode);
        if (typeof options.note !== "undefined") _addUAProperty_for_string("note", options.note);
        if (typeof options.shortName !== "undefined") _addUAProperty_for_string("shortName", options.shortName);
        if (typeof options.valueFormat !== "undefined") _addUAProperty_for_string("valueFormat", options.valueFormat);
        if (typeof options.version !== "undefined") _addUAProperty_for_string("version", options.version);
        if (typeof options.revision !== "undefined") _addUAProperty_for_string("revision", options.revision);

        return dataSpec;

        function _addUAProperty_for_string(browseName, value){
            assert(typeof value === "string", "vale inserted for " + browseName + " is not a string.");
            assert(!dataSpec.hasOwnProperty(browseName), "dataSpec already contains a UA Proeprty with the browseName " + browseName);

            namespace.addVariable({
                browseName: browseName,
                propertyOf: dataSpec,
                dataType: "String",
                value: {
                    get: () => {
                        return new opcua.Variant({
                            dataType: opcua.DataType.String,
                            value: value
                        });
                    }
                }
            });
        }
    }
}