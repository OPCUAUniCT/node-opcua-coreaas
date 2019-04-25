const assert = require("assert");

module.exports = function (opcua) {

    /**
    * Create a new instance of SubmodelElementCollectionType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.idShort The unique identifier for the AAS. The DataType is Identifier. 
    * @param {array | object} [options.semanticId] An array of Key object composing an AAS reference or the AASReference instance itself to the Object defining semantic fot this SubmodelElementCollection.
    * @param {array | object} [options.parent] An array of Key object composing an AAS reference or the AASReference instance itself to the parent Object.
    * @param {object | number} [options.kind] A Kind value specifying if the SubmodelElementCollection is Instance or Type.
    * @param {object} [options.submodelElementOf] The parent SubmodelType instance containing the SubmodelElementCollection.
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the SubmodelElementCollection.
    * @param {boolean} [options.ordered = false] A flag saying if the collection is ordered or not.
    * @param {boolean} [options.allowDuplicates = false] A flag saying if the collection allows duplicates or not.
    * @param {string} [options.browseName] The BrowseName for the SubmodelElementCollection.
    * @param {object} [options.nodeId] The string representation of the NodeId for the SubmodelElementCollection. 
    * @returns {object} The Object Node representing the SubmodelElementCollection.
    */
    opcua.AddressSpace.prototype.addSubmodelElementCollection = function(options) {

        assert(options.idShort, "options.idShort parameter is missing.")

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();

        const secType = addressSpace.findCoreAASObjectType("SubmodelElementCollectionType");

        const collection = namespace.addObject({
            typeDefinition: secType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        });

        collection.coreAASType = "SubmodelElementCollectionType";
        collection._indexCounter = 0;

        const folderType = addressSpace.findNode("FolderType").nodeId;

        const values = namespace.addObject({
            typeDefinition: folderType,
            browseName: "values",
            componentOf: collection
        });

        //Add idShort
        const idShort = namespace.addVariable({
            propertyOf: collection,
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

        //Add ordered
        const ordered = namespace.addVariable({
            propertyOf: collection,
            browseName: "ordered",
            dataType: "Boolean",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.Boolean, 
                        value: options.ordered || false
                    });
                }
            }
        });

        //Add allowDuplicates
        const allowDuplicates = namespace.addVariable({
            propertyOf: collection,
            browseName: "allowDuplicates",
            dataType: "Boolean",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.Boolean, 
                        value: options.allowDuplicates || false
                    });
                }
            }
        });

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf instanceof opcua.UAObject, "options.submodelElementOf is not a UAObject.");
            assert(options.submodelElementOf.coreAASType === "SubmodelType", "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: collection });
        }

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
                propertyOf: collection,
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
            assert(typeof options.kind === "number" || typeof options.kind === "object", "options.kind is neither a number nor Kind enumeration");

            let kind;

            if (typeof options.kind === "number") {
                kind = opcua.coreaas.Kind.get(options.kind);
            }
            else {
                assert(typeof options.kind === "object" && options.kind.constructor.name === opcua.coreaas.Kind.Instance.constructor.name, "options.kind is not a Kind enum.");
                kind = options.kind;
            }

            namespace.addVariable({
                propertyOf: collection,
                browseName: "kind",
                dataType: addressSpace.findCoreAASDataType("Kind"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: kind });
                    }
                }
            });
        }

        if (typeof options.semanticId !== "undefined") _addSemanticId(options.semanticId);

        if (typeof options.parent !== "undefined") _addParent(options.parent);

        collection.addElements = (elemArray) => {
            assert(Array.isArray(elemArray), "elemArray parameter is not an Array.");
            elemArray.forEach(el => {
                assert(el instanceof opcua.UAObject, "elemArray contains an element that is not an UAObject.");
                const submodelElementType = addressSpace.findCoreAASObjectType("SubmodelElementType");
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf

                let referenceType = "HasComponent";
                if (ordered._dataValue.value.value) {
                    referenceType = "HasOrderedComponent";

                    let currentIndex = collection._indexCounter;
                    let index = namespace.addVariable({
                        browseName: "index",
                        propertyOf: el,
                        dataType: "UInt32",
                        value: {
                            get: () => new opcua.Variant({ dataType: opcua.DataType.UInt32,  value: currentIndex })
                        }
                    });

                    collection._indexCounter++;
                }

                collection.values.addReference({ referenceType: referenceType, nodeId: el });
            });

            return collection;
        }

        collection.addSemanticId = _addSemanticId;

        collection.addParent = _addParent;

        return collection;

        function _addSemanticId(semanticId) {
            assert(Array.isArray(semanticId) || semanticId instanceof opcua.UAObject, "semanticId is neither a UAObject or an Array of Key.");
            assert(!semanticId.hasOwnProperty("semanticId"), "the SubmodelElementCollectionType Object already contains a Component with BrowseName semanticId");
            
            if (Array.isArray(semanticId)) {

                semanticId.forEach(el => assert(el.constructor.name === "Key", "semanticId Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: collection,
                    browseName: "semanticId",
                    keys: semanticId
                });
            } 
            else {
                assert(semanticId.coreAASType === "AASReferenceType", "semanticId is not an AASReferenceType instance.");

                collection.addReference({ referenceType: "HasComponent", nodeId: semanticId});
            }

            return collection;
        }

        function _addParent(parent) {
            assert(Array.isArray(parent) || parent instanceof opcua.UAObject, "parent is neither a UAObject or an Array of Key.");
            assert(!parent.hasOwnProperty("parent"), "the SubmodelElementCollectionType Object already contains a Component with BrowseName parent");
            
            if (Array.isArray(parent)) {

                parent.forEach(el => assert(el.constructor.name === "Key", "parent Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: collection,
                    browseName: "parent",
                    keys: parent
                });
            } 
            else {
                assert(parent.coreAASType === "AASReferenceType", "parent is not an AASReferenceType instance.");

                collection.addReference({ referenceType: "HasComponent", nodeId: parent});
            }

            return collection;
        }
    }
}