const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
     *Create a new instance of SubmodelType representing a Submodel (both Type and Instance).
    *
    * @param {object} options
    * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {string} options.idShort The unique identifier for the AAS. The DataType is Identifier. 
    * @param {object} [options.nodeId] The string representation of the NodeId for the Submodel Object.
    * @param {string} [options.browseName] The BrowseName for the Submodel Object.
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the Submodel. 
    * @param {array | object} [options.semanticId] An array of Key object composing an AAS reference or the AASReference instance itself to the Object defining semantic fot this Submodel.
    * @param {array | object} [options.parent] An array of Key object composing an AAS reference or the AASReference instance itself to the parent Object.
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the Submodel.  
    * @param {object | number} [options.kind] A Kind value specifying if the Submodel is Instance or Type. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    * 
    * @example
    *    addressSpace.addSubmodel({
    *        browseName: "12345679",
    *        kind: Kind.Instance,
    *        idShort: "12345679",
    *        identification: new Identifier({
    *            id: "http://www.zvei.de/demo/submodel/12345679",
    *            idType: IdentifierType.URI
    *        }),
    *        semanticId: [new Key({
    *            idType: KeyType.URI,
    *            local: false,
    *            type: KeyElements.GlobalReference,
    *            value: "http://www.zvei.de/demo/submodelDefinitions/87654346"
    *        })],
    *        submodelOf: aas_1
    *    });
    */
    opcua.AddressSpace.prototype.addSubmodel = function(options) {

        assert(typeof options.identification !== "undefined", "No options.identification parameter inserted!");
        assert(typeof options.idShort !== "undefined", "No options.idShort parameter inserted!");
        assert("id" in options.identification && "idType" in options.identification, "options.identification is not an Identifier.");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const submodelType = addressSpace.findCoreAASObjectType("SubmodelType");
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace();
        const submodelsFolder = addressSpace.rootFolder.objects.submodels;

        const submodel = namespace.addObject({
            typeDefinition: submodelType,
            browseName:    options.browseName || "Submodel_" + options.identification.id,
            nodeId:        options.nodeId,
            organizedBy: submodelsFolder,
        });

        submodel.coreAASType = "SubmodelType";

        //Add identification
        const identification = namespace.addVariable({
            propertyOf: submodel,
            browseName: "identification",
            dataType: addressSpace.findCoreAASDataType("Identifier"),
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.ExtensionObject, 
                        value: options.identification
                    });
                }
            }
        });

        //Add idShort
        const idShort = namespace.addVariable({
            propertyOf: submodel,
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

        //Add Submodels
        namespace.addObject({
            typeDefinition: addressSpace.findNode("FolderType").nodeId,
            browseName: "SubmodelElements",
            componentOf: submodel
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
                propertyOf: submodel,
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

        // Add administration
        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            assert(options.administration.coreAASType === "AdministrativeInformationType", "options.administration is not an AdministrativeInformationType Object.");
            
            submodel.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add kind
        if (typeof options.kind !== "undefined") {
            //assert(typeof options.kind === "number" || typeof options.kind === "object", "options.kind is neither a number nor Kind enumeration");
            let kind;

            if (typeof options.kind === "number") {
                kind = opcua.coreaas.Kind.get(options.kind);
            }
            else {
                assert(typeof options.kind === "object" && options.kind.constructor.name === opcua.coreaas.Kind.Instance.constructor.name, "options.kind is not a Kind enum.");
                kind = options.kind;
            }

            namespace.addVariable({
                propertyOf: submodel,
                browseName: "kind",
                dataType: addressSpace.findCoreAASDataType("Kind"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: kind });
                    }
                }
            });
        }

        if (typeof options.semanticId !== "undefined") {
            _addSemanticId(options.semanticId);
        }

        if (typeof options.parent !== "undefined") {
            _addParent(options.parent);
        }

        /* Convenience methods */

        submodel.hasSubmodelSemantic = (semanticElem) => {
            assert(semanticElem instanceof opcua.UAObject, "semanticElem is not a UAObject.");
            assert(semanticElem.hasOwnProperty("kind"), "semanticElem is not a SubmodelType instance.")
            assert(semanticElem.kind.readValue().value.value === opcua.coreaas.Kind.Type.value, "semanticElem is not a Submodel with kind = Type");

            const hasSubmodelSemanticRefType = addressSpace.findCoreAASReferenceType("HasSubmodelSemantic");
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: semanticElem });

            return submodel;
        }

        submodel.hasSemantic = (semanticElem) => {
            assert(semanticElem instanceof opcua.UAObject, "semanticElem is not a UAObject.");

            const hasSubmodelSemanticRefType = addressSpace.findCoreAASReferenceType("HasSemantic");
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: semanticElem });

            return submodel;
        }

        submodel.addSemanticId = _addSemanticId;

        submodel.submodelOf = (aas) => {
            assert(aas instanceof opcua.UAObject, "aas parameter contains some element that is not UAObject.");
            assert(aas.coreAASType === "AASType", "aas parameter is not an AASType instance.");

            const hasSemanticRefType = addressSpace.findCoreAASReferenceType("HasSubmodel");
            aas.addReference({ referenceType: hasSemanticRefType, nodeId: submodel });
            return submodel;
        }

        submodel.addParent = _addParent;

        function _addSemanticId(semanticId) {
            assert(Array.isArray(semanticId) || semanticId instanceof opcua.UAObject, "semanticId is neither a UAObject or an Array of Key.");
            assert(!semanticId.hasOwnProperty("semanticId"), "the SubmodelType Object already contains a Component with BrowseName semanticId");
            
            if (Array.isArray(semanticId)) {

                semanticId.forEach(el => assert(el.constructor.name === "Key", "semanticId Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: submodel,
                    browseName: "semanticId",
                    keys: semanticId
                });
            } 
            else {
                assert(semanticId.coreAASType === "AASReferenceType", "semanticId is not an AASReferenceType instance.");

                submodel.addReference({ referenceType: "HasComponent", nodeId: semanticId});
            }

            return submodel;
        }

        function _addParent(parent) {
            assert(Array.isArray(parent) || parent instanceof opcua.UAObject, "parent is neither a UAObject or an Array of Key.");
            assert(!parent.hasOwnProperty("parent"), "the SubmodelType Object already contains a Component with BrowseName parent");
            
            if (Array.isArray(parent)) {

                parent.forEach(el => assert(el.constructor.name === "Key", "parent Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: submodel,
                    browseName: "parent",
                    keys: parent
                });
            } 
            else {
                assert(parent.coreAASType === "AASReferenceType", "parent is not an AASReferenceType instance.");

                submodel.addReference({ referenceType: "HasComponent", nodeId: parent});
            }

            return submodel;
        }

        return submodel;
    };

};