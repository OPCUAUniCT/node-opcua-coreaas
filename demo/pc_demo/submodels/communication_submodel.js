const assert = require("assert");

module.exports = function add_communication_submodel(options) {
    const Identifier = options.opcua.coreaas.getIdentifierConstructor(options.addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = options.opcua.coreaas.IdentifierType;
    const Key = options.opcua.coreaas.getKeyConstructor(options.addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = options.opcua.coreaas.KeyElements;
    const KeyType = options.opcua.coreaas.KeyType;
    const PropertyCategory = options.opcua.coreaas.PropertyCategory;
    const PropertyValueType = options.opcua.coreaas.PropertyValueType;

    const communicationSubmodel = options.addressSpace.addSubmodel({
        browseName: "Communication_555444333",
        kind: options.opcua.coreaas.Kind.Instance,
        idShort: "Communication_555444333",
        identification: new Identifier({
            id: "//aas/submodel/555444333",
            idType: IdentifierType.URI
        }),
        hasSemantic: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "//aas/submodels_definitions/communication"
        }) ]
    });

    /**
     * Add Properties to the submodel
     */
    const networking = options.addressSpace.addSubmodelProperty({
        browseName: "Networking possible",
        idShort: "networkingPossible",
        submodelElementOf: communicationSubmodel,
        hasSemantic: [ new Key({
            idType: KeyType.IRDI,
            local: true,
            type: KeyElements.ConceptDescription,
            value: "0173-1#02-BAF750#008"
        }) ],
        category: PropertyCategory.PARAMETER,
        valueType: PropertyValueType.Boolean,
        value: {
            dataType: "Boolean",
            value: {
                get: () => {
                    return new options.opcua.Variant({ dataType: options.opcua.DataType.Boolean, value: true});
                }
            }
        }
    });

    const embedded_1 = options.addressSpace.addEmbeddedDataSpecification({
        browseName: "EmbeddedDS_1",
        hasDataSpecification: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
        }) ],
    }).addDataSpecificationIEC61360({
        preferredName: "Networking possible",
        shortName: "-",
        valueFormat: "BOOLEAN",
        definition: "whether networking is possible"
    });

    options.addressSpace.addConceptDescription({
        browseName: "Networking possible",
        identification: new Identifier({
            id: "0173-1#02-BAF750#008",
            idType: IdentifierType.IRDI
        }),
        hasEmbeddedDataSpecification: embedded_1,
        conceptDescriptionOf: options.dictionary,
        localSemanticOf: networking
    });

    return communicationSubmodel;
}