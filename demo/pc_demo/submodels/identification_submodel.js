const assert = require("assert");

module.exports = function add_identification_submodel(options) {
    const Identifier = options.opcua.coreaas.getIdentifierConstructor(options.addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = options.opcua.coreaas.IdentifierType;
    const Key = options.opcua.coreaas.getKeyConstructor(options.addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = options.opcua.coreaas.KeyElements;
    const KeyType = options.opcua.coreaas.KeyType;
    const PropertyCategory = options.opcua.coreaas.PropertyCategory;
    const PropertyValueType = options.opcua.coreaas.PropertyValueType;

    const identificationSubmodel = options.addressSpace.addSubmodel({
        browseName: "AssetIdentificationModel_123456789",
        kind: options.opcua.coreaas.Kind.Instance,
        idShort: "AssetIdentificationModel_123456789",
        identification: new Identifier({
            id: "//aas/submodel/12345679",
            idType: IdentifierType.URI
        }),
        hasSemantic: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "//aas/submodels_definitions/asset_identification"
        }) ]
    });

    /**
     * Add Properties to the submodel
     */
    const serialNumber = options.addressSpace.addSubmodelProperty({
        browseName: "serial number",
        idShort: "serialNumber",
        submodelElementOf: identificationSubmodel,
        hasSemantic: [ new Key({
            idType: KeyType.IRDI,
            local: true,
            type: KeyElements.ConceptDescription,
            value: "0112/2///61360_4#ADA029#001"
        }) ],
        category: PropertyCategory.PARAMETER,
        valueType: PropertyValueType.String,
        value: {
            dataType: "String",
            value: {
                get: () => {
                    return new options.opcua.Variant({ dataType: options.opcua.DataType.String, value: "A6677218-33E7-4965-9A0D-C494F427ACC1"});
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
        preferredName: "serial number",
        shortName: "serial no",
        valueFormat: "M..35",
        definition: "identification number assigned to an individual specimen of objects or an object type"
    });

    const conceptDescription = options.addressSpace.addConceptDescription({
        browseName: "serialNumber",
        identification: new Identifier({
            id: "0112/2///61360_4#ADA029#001",
            idType: IdentifierType.IRDI
        }),
        hasEmbeddedDataSpecification: embedded_1,
        localSemanticOf: serialNumber
    });

    return identificationSubmodel;
}