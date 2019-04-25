const assert = require("assert");
const os = require("os");

module.exports = function add_configuration_submodel(options) {
    const Identifier = options.opcua.coreaas.getIdentifierConstructor(options.addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = options.opcua.coreaas.IdentifierType;
    const Key = options.opcua.coreaas.getKeyConstructor(options.addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = options.opcua.coreaas.KeyElements;
    const KeyType = options.opcua.coreaas.KeyType;
    const PropertyCategory = options.opcua.coreaas.PropertyCategory;
    const PropertyValueType = options.opcua.coreaas.PropertyValueType;

    const configurationSubmodel = options.addressSpace.addSubmodel({
        browseName: "Configuration_98989898",
        kind: options.opcua.coreaas.Kind.Instance,
        idShort: "Configuration_98989898",
        identification: new Identifier({
            id: "//aas/submodel/98989898",
            idType: IdentifierType.URI
        }),
        semanticId: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "//aas/submodels_definitions/configuration"
        }) ]
    });

    /**
     * Add Properties to the submodel
     */
    const cpuArch = options.addressSpace.addSubmodelProperty({
        browseName: "Type of processor",
        idShort: "typeOfProcessor",
        submodelElementOf: configurationSubmodel,
        semanticId: [ new Key({
            idType: KeyType.IRDI,
            local: true,
            type: KeyElements.ConceptDescription,
            value: "0173-1#02-AAP802#001"
        }) ],
        category: PropertyCategory.PARAMETER,
        valueType: PropertyValueType.String,
        value: {
            dataType: "String",
            value: {
                get: () => {
                    return new options.opcua.Variant({ dataType: options.opcua.DataType.String, value: os.arch()});
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
        preferredName: "Type of processor",
        shortName: "-",
        valueFormat: "STRING",
        definition: "A group of processors with comparable attributes"
    });

    options.addressSpace.addConceptDescription({
        browseName: "Type of processor",
        identification: new Identifier({
            id: "0173-1#02-AAP802#001",
            idType: IdentifierType.IRDI
        }),
        hasEmbeddedDataSpecification: embedded_1,
        conceptDescriptionOf: options.dictionary
    })
    .semanticOf(cpuArch);

    return configurationSubmodel;
}