const assert = require("assert");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.
    *
    * @param {object} options
    * @param {string} options.idShort The unique identifier for the AAS. The DataType is Identifier. 
    * @param {array | object} [options.semanticId] An array of Key object composing an AAS reference or the AASReference instance itself to the Object defining semantic fot this File.
    * @param {array | object} [options.parent] An array of Key object composing an AAS reference or the AASReference instance itself to the parent Object.
    * @param {object | number} [options.kind] A Kind value specifying if the SubmodelElementCollection is Instance or Type.
    * @param {object} [options.submodelElementOf] The parent SubmodelType instance containing the File.
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the File.
    * @param {string} [options.value] Path and name of the referenced file (without file extension).
    * @param {string} [options.mimeType] Mime type of the content of the File..
    * @param {string} [options.browseName] The BrowseName for the File.
    * @param {object} [options.nodeId] The string representation of the NodeId for the File Object. 
    * @returns {object} The Object Node representing the File.
    */
    opcua.AddressSpace.prototype.addAASFile = function(options) {

        assert(options.idShort, "options.idShort parameter is missing.")

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();

        const fileType = addressSpace.findCoreAASObjectType("FileType");

        const file = namespace.addObject({
            typeDefinition: fileType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        });

        file.coreAASType = "FileType";

        //Add idShort
        const idShort = namespace.addVariable({
            propertyOf: file,
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

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf instanceof opcua.UAObject, "options.submodelElementOf is not a UAObject.");
            assert(options.submodelElementOf.coreAASType === "SubmodelType", "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: file });
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
                propertyOf: file,
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
                propertyOf: file,
                browseName: "kind",
                dataType: addressSpace.findCoreAASDataType("Kind"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: kind });
                    }
                }
            });
        }

        if (typeof options.value !== "undefined") {
            assert(typeof options.value === "string", "options.value is not a string.");

            namespace.addVariable({
                propertyOf: file,
                browseName: "value",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({
                            dataType: opcua.DataType.String, 
                            value: options.value
                        });
                    }
                }
            });
        }

        if (typeof options.mimeType !== "undefined") {
            assert(typeof options.mimeType === "string", "options.mimeType is not a string.");

            namespace.addVariable({
                propertyOf: file,
                browseName: "mimeType",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({
                            dataType: opcua.DataType.String, 
                            value: options.mimeType
                        });
                    }
                }
            });
        }

        if (typeof options.semanticId !== "undefined") _addSemanticId(options.semanticId);

        if (typeof options.parent !== "undefined") _addParent(options.parent);

        file.addSemanticId = _addSemanticId;

        file.addParent = _addParent;

        return file;

        function _addSemanticId(semanticId) {
            assert(Array.isArray(semanticId) || semanticId instanceof opcua.UAObject, "semanticId is neither a UAObject or an Array of Key.");
            assert(!semanticId.hasOwnProperty("semanticId"), "the FileType Object already contains a Component with BrowseName semanticId");
            
            if (Array.isArray(semanticId)) {

                semanticId.forEach(el => assert(el.constructor.name === "Key", "semanticId Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: file,
                    browseName: "semanticId",
                    keys: semanticId
                });
            } 
            else {
                assert(semanticId.coreAASType === "AASReferenceType", "semanticId is not an AASReferenceType instance.");

                file.addReference({ referenceType: "HasComponent", nodeId: semanticId});
            }

            return file;
        }

        function _addParent(parent) {
            assert(Array.isArray(parent) || parent instanceof opcua.UAObject, "parent is neither a UAObject or an Array of Key.");
            assert(!parent.hasOwnProperty("parent"), "the FileType Object already contains a Component with BrowseName parent");
            
            if (Array.isArray(parent)) {

                parent.forEach(el => assert(el.constructor.name === "Key", "parent Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: file,
                    browseName: "parent",
                    keys: parent
                });
            } 
            else {
                assert(parent.coreAASType === "AASReferenceType", "parent is not an AASReferenceType instance.");

                file.addReference({ referenceType: "HasComponent", nodeId: parent});
            }

            return file;
        }
    }
}