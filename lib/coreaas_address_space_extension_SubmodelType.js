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
    * @param {object} [options.submodelOf] The parent AASType containing the Submodel.
    * @param {object} [options.hasSemantic] an Array of Key referencing to the Semantic element for the Submodel.
    * @param {object} [options.hasSubmodelSemantic] A SubmodelType instance with kind = Type defining the semantic for this Submodel.
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the Submodel. 
    * @param {string} [options.description] A description for the Submodel. 
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
    *        hasSemantic: [new Key({
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
            //description:   options.description, Use the Property description instead of the attribute
            nodeId:        options.nodeId,
            organizedBy: submodelsFolder,
        });

        //Add identification
        const identification = namespace.addVariable({
            componentOf: submodel,
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
            assert(typeof(options.description) === "string", "Parameter options.description is not a string.");

            namespace.addVariable({
                propertyOf: submodel,
                browseName: "description",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: options.description});
                    }
                }
            });
        }

        // Add administration
        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            
            submodel.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add this Submodel to the AAS
        if (typeof options.submodelOf !== "undefined") {
            assert(options.submodelOf instanceof opcua.UAObject, "options.submodelOf is not a UAObject.");
            
            const submodels = options.submodelOf.submodels;
            submodels.addReference({ referenceType: "Organizes", nodeId: submodel });
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

        if (typeof options.hasSubmodelSemantic !== "undefined") {
            assert(options.hasSubmodelSemantic instanceof opcua.UAObject, "options.hasSubmodelSemantic is not a UAObject.");
            assert(options.hasSubmodelSemantic.hasOwnProperty("kind"), "options.hasSubmodelSemantic is not a SubmodelType instance.")
            assert(options.hasSubmodelSemantic.kind.readValue().value.value === opcua.coreaas.Kind.Type.value, "options.hasSubmodelSemantic is not a Submodel with kind = Type");

            const hasSubmodelSemanticRefType = addressSpace.findCoreAASReferenceType("HasSubmodelSemantic");
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: options.hasSubmodelSemantic });
        }

        if (typeof options.hasSemantic !== "undefined") {
            assert(Array.isArray(options.hasSemantic), "options.haSemantic is not an Array of Key.");

            addressSpace.addAASReference({
                semanticFor: submodel,
                browseName: "semanticId",
                keys: options.hasSemantic
            });
        }

        return submodel;
    };

};