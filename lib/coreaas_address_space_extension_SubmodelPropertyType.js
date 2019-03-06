const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
     *Create a new instance of SubmodelPropertyType representing a Submodel (both Type and Instance).
    *
    * @param {object} options
    * @param {string} options.idShort The unique identifier for the AAS. The DataType is Identifier. 
    * @param {string} [options.nodeId]  
    * @param {string} [options.browseName]  
    * @param {object} [options.submodelElementOf] The parent SubmodelType instance containing the SubmodelPropertyType.
    * @param {array} [options.hasSemantic] an Array of Key referencing to the Semantic element for the Submodel Property.
    * @param {object} [options.hasLocalSemantic] an Object local the AAS containing to the Semantic element to be referenced by means of HasLocalSemantic Reference.
    * @param {array} [options.parent] an Array of Key referencing to parent element for the Submodel Property.
    * @param {string} [options.description] A description for the Asset. 
    * @param {object} [options.category] An enum value defining the category of the Submodel Property. 
    * @param {object | number} [options.kind] A Kind value specifying if the Asset is Instance or Type.
    * @param {array} [options.valueId] an Array of Key referencing to the an external value for the Submodel Property. 
    * @param {object} [options.value] An Object containing the value for the Submodel Property. The type depends from valueType.
    * @param {object} [options.value.dataType] The DataType of the value contained in options.value.value
    * @param {object} [options.value.value] An object defining the get function to return a Variant containing the actual value.
    * @param {object} [options.valueType] An enum value defining the XSD DataType corresponding to the value in options.value.
    * @returns {object} The Object Node representing Submodel Property.
    */
    opcua.AddressSpace.prototype.addSubmodelProperty = function(options) {

        assert(typeof options.idShort !== "undefined", "No options.idShort parameter inserted!");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const submodelType = addressSpace.findCoreAASObjectType("SubmodelType");

        const property = namespace.addObject({
            typeDefinition: submodelType,
            browseName:    options.browseName || "Property_" + options.idShort,
            //description:   options.description, Use the Property description instead of the attribute
            nodeId:        options.nodeId
        });

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf instanceof opcua.UAObject, "options.submodelElementOf is not a UAObject.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: property });
        }

        //Add idShort
        const idShort = namespace.addVariable({
            propertyOf: property,
            browseName: "idShort",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String, 
                        value: options.idShort
                    });
                }
            }
        });

        //Add description
        if (typeof options.description !== "undefined") {
            assert(typeof(options.description) === "string", "Parameter options.description is not a string.");

            namespace.addVariable({
                propertyOf: property,
                browseName: "description",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: options.description});
                    }
                }
            });
        }

        //Add kind
        if (typeof options.kind !== "undefined") {

            let kind;

            if (typeof options.kind === "number") {
                kind = opcua.coreaas.Kind.get(options.kind);
            }
            else {
                assert(typeof options.kind === "object" && options.kind.constructor.name === opcua.coreaas.Kind.Instance.constructor.name, "options.kind is not a Kind enum.");
                kind = options.kind;
            }

            namespace.addVariable({
                propertyOf: property,
                browseName: "kind",
                dataType: addressSpace.findCoreAASDataType("Kind"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: kind });
                    }
                }
            });
        }

        //Add Category
        if (typeof options.category !== "undefined") {

            let category;

            if (typeof options.category === "number") {
                category = opcua.coreaas.PropertyCategory.get(options.category);
            }
            else {
                assert(typeof options.category === "object" && options.category.constructor.name === opcua.coreaas.PropertyCategory.VARIABLE.constructor.name, "options.category is not a PropertyCategory enum.");
                category = options.category;
            }

            namespace.addVariable({
                propertyOf: property,
                browseName: "category",
                dataType: addressSpace.findCoreAASDataType("PropertyCategory"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: category });
                    }
                }
            });
        }

        //Add HasLocalSemantic
        if (typeof options.hasLocalSemantic !== "undefined") {
            assert(options.hasLocalSemantic instanceof opcua.UAObject, "options.hasSubmodelSemantic is not a UAObject.");

            const hasLocalSemanticRefType = addressSpace.findCoreAASReferenceType("HasLocalSemantic");
            property.addReference({ referenceType: hasLocalSemanticRefType, nodeId: options.hasSubmodelSemantic });
        }

        //Add HasSemantic
        if (typeof options.hasSemantic !== "undefined") {
            assert(Array.isArray(options.hasSemantic), "options.haSemantic is not an Array of Key.");

            addressSpace.addAASReference({
                semanticFor: property,
                browseName: "semanticId",
                keys: options.hasSemantic
            });
        }

        //Add Parent
        if (typeof options.parent !== "undefined") {
            assert(Array.isArray(options.parent), "options.haSemantic is not an Array of Key.");

            addressSpace.addAASReference({
                componentOf: property,
                browseName: "parent",
                keys: options.parent
            });
        }

        //Add valueId
        if (typeof options.valueId !== "undefined") {
            assert(Array.isArray(options.valueId), "options.haSemantic is not an Array of Key.");

            addressSpace.addAASReference({
                componentOf: property,
                browseName: "valueId",
                keys: options.valueId
            });
        }

        //Add Value
        if (typeof options.value !== "undefined") {
            namespace.addVariable({
                propertyOf: property,
                browseName: "value",
                dataType: options.value.dataType,
                value: options.value.value
            });
        }

        //Add ValueType
        if (typeof options.valueType !== "undefined") {
            let valueType;

            if (typeof options.valueType === "number") {
                valueType = opcua.coreaas.PropertyValueType.get(options.valueType);
            }
            else {
                assert(typeof options.valueType === "object" && options.valueType.constructor.name === opcua.coreaas.PropertyValueType.Integer.constructor.name, "options.valueType is not a PropertyValueType enum.");
                valueType = options.valueType;
            }

            namespace.addVariable({
                propertyOf: property,
                browseName: "valueType",
                dataType: addressSpace.findCoreAASDataType("PropertyValueType"),
                value: {
                    get: () => {
                valueType = options.valueType;
                return new opcua.Variant({ dataType: opcua.DataType.Int32, value: options.valueType });
                    }
                }
            });
        }

        //Enhance property with convenience methods
        property.addValue = (options) => {
            namespace.addVariable({
                propertyOf: property,
                browseName: "value",
                dataType: options.dataType,
                value: options.value
            });

            return property;
        }

        return property;
    };

};