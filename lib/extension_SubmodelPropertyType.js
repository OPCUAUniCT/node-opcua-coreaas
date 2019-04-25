const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
     *Create a new instance of SubmodelPropertyType representing a Submodel Property (both Type and Instance).
    *
    * @param {object} options
    * @param {string} options.idShort The short identifier of the SubmodelProperty. 
    * @param {string} [options.nodeId] The string representation of the NodeId for the SubmodelProperty Object.
    * @param {string} [options.browseName] The BrowseName of the SubmodelProperty Object.
    * @param {object} [options.submodelElementOf] The parent SubmodelType instance containing the SubmodelProperty.
    * @param {array | object} [options.semanticId] An array of Key object composing an AAS reference or the AASReference instance itself to the Object defining semantic fot this Property.
    * @param {array | object} [options.parent] An array of Key object composing an AAS reference or the AASReference instance itself to the parent Object.
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the SubmodelProperty.  
    * @param {object} [options.category] An enum value defining the category of the Submodel Property. 
    * @param {object | number} [options.kind] A Kind value specifying if the SubmodelProperty is Instance or Type.
    * @param {array | object} [options.valueId] An array of Key object composing an AAS reference or the AASReference instance itself referencing an external value for the SubmodelProperty. 
    * @param {object} [options.value] An Object containing the value for the Submodel Property. The type depends from valueType.
    * @param {object} [options.value.dataType] The DataType of the value contained in options.value.value
    * @param {object} [options.value.value] An object defining the get function to return a Variant containing the actual value.
    * @param {object} [options.valueType] An enum value defining the XSD DataType corresponding to the value in options.value.
    * @returns {object} The Object Node representing Submodel Property.
    * 
    * @example
    *    addressSpace.addSubmodelProperty({
    *        browseName: "NMAX",
    *        idShort: "NMAX",
    *        submodelElementOf: submodel_1,
    *        semanticId: [new Key({
    *            idType: KeyType.IRDI,
    *            local: true,
    *            type: KeyElements.ConceptDescription,
    *            value: "0173-1#02-BAA120#007"
    *        })],
    *        category: PropertyCategory.PARAMETER,
    *        valueType: PropertyValueType.Double,
    *        value: {
    *            dataType: "Double",
    *            value: {
    *                get: () => {
    *                    return new opcua.Variant({
    *                        dataType: opcua.DataType.Double,
    *                        value: 2000
    *                    });
    *                }
    *            }
    *        }
    *    });
    */
    opcua.AddressSpace.prototype.addSubmodelProperty = function(options) {

        assert(typeof options.idShort !== "undefined", "No options.idShort parameter inserted!");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const submodelPropertyType = addressSpace.findCoreAASObjectType("SubmodelPropertyType");

        const property = namespace.addObject({
            typeDefinition: submodelPropertyType,
            browseName:    options.browseName || "Property_" + options.idShort,
            nodeId:        options.nodeId
        });

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf instanceof opcua.UAObject, "options.submodelElementOf is not a UAObject.");
            assert(options.submodelElementOf.coreAASType === "SubmodelType", "options.submodelElementOf is not a SubmodelType.");
            
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
            assert( typeof(options.description) === "string" || 
                    options.description instanceof opcua.LocalizedText || 
                    Array.isArray(options.description), "Parameter options.description is neither a string nor a LocalizedText nor an Array.");

            let localizedTextArray = [];

            if(typeof options.description === "string") {
                localizedTextArray.push(opcua.LocalizedText.coerce(options.description));
            } else if(options.description instanceof opcua.LocalizedText) {
                localizedTextArray.push(options.description);
            } else {
                options.description.forEach(el => assert(el instanceof opcua.LocalizedText, "An element of the array is not a LocalizedText."));
                localizedTextArray = options.description;
            }

            namespace.addVariable({
                propertyOf: property,
                browseName: "description",
                dataType: "LocalizedText",
                value: {
                    get: function() {
                        return new opcua.Variant({ 
                            dataType: opcua.DataType.LocalizedText, 
                            arrayType: opcua.VariantArrayType.Array,
                            value: localizedTextArray
                        });
                    }
                },
                valueRank: 1
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

        //Add semantic id
        if (typeof options.semanticId !== "undefined") {
            _addSemanticId(options.semanticId);
        }

        //Add Parent
        if (typeof options.parent !== "undefined") {
            _addParent(options.parent);
        }

        //Add valueId
        if (typeof options.valueId !== "undefined") {
            _addValueId(options.valueId);
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

        property.addSemanticId = _addSemanticId;

        property.hasSemantic = (semanticElem) => {
            assert(semanticElem instanceof opcua.UAObject, "semanticElem is not a UAObject.");
            assert(semanticElem.coreAASType === "ConceptDescriptionType", "semanticElem is not a ConceptDescriptionType Object.");

            const hasSemanticRefType = addressSpace.findCoreAASReferenceType("HasSemantic");
            property.addReference({ referenceType: hasSemanticRefType, nodeId: semanticElem });

            return property;
        }

        property.addParent = _addParent;

        property.addValueId = _addValueId;

        function _addSemanticId(semanticId) {
            assert(Array.isArray(semanticId) || semanticId instanceof opcua.UAObject, "semanticId is neither a UAObject or an Array of Key.");
            assert(!semanticId.hasOwnProperty("semanticId"), "the SubmodelPropertyType Object already contains a Component with BrowseName semanticId");
            
            if (Array.isArray(semanticId)) {

                semanticId.forEach(el => assert(el.constructor.name === "Key", "semanticId Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: property,
                    browseName: "semanticId",
                    keys: semanticId
                });
            } 
            else {
                assert(semanticId.coreAASType === "AASReferenceType", "semanticId is not an AASReferenceType instance.");

                property.addReference({ referenceType: "HasComponent", nodeId: semanticId});
            }

            return property;
        }

        function _addParent(parent) {
            assert(Array.isArray(parent) || parent instanceof opcua.UAObject, "parent is neither a UAObject or an Array of Key.");
            assert(!parent.hasOwnProperty("parent"), "the SubmodelPropertyType Object already contains a Component with BrowseName parent");
            
            if (Array.isArray(parent)) {

                parent.forEach(el => assert(el.constructor.name === "Key", "parent Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: property,
                    browseName: "parent",
                    keys: parent
                });
            } 
            else {
                assert(parent.coreAASType === "AASReferenceType", "parent is not an AASReferenceType instance.");

                property.addReference({ referenceType: "HasComponent", nodeId: parent});
            }

            return property;
        }

        function _addValueId(valueId) {
            assert(Array.isArray(valueId) || valueId instanceof opcua.UAObject, "valueId is neither a UAObject or an Array of Key.");
            assert(!valueId.hasOwnProperty("parent"), "the SubmodelPropertyType Object already contains a Component with BrowseName valueId");
            
            if (Array.isArray(valueId)) {

                valueId.forEach(el => assert(el.constructor.name === "Key", "valueId Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: property,
                    browseName: "valueId",
                    keys: valueId
                });
            } 
            else {
                assert(valueId.coreAASType === "AASReferenceType", "parent is not an AASReferenceType instance.");

                property.addReference({ referenceType: "HasComponent", nodeId: valueId});
            }

            return property;
        }

        return property;
    };

};