var opcua = require("node-opcua");

// add server CoreAAS extension to node-opcua
require("node-opcua-coreaas")(opcua);


var xmlFiles = [
    opcua.standard_nodeset_file,
    opcua.coreaas.nodeset_file
];

var server = new opcua.OPCUAServer({
    nodeset_filename: xmlFiles,
});

function post_initialize() {
    const addressSpace = server.engine.addressSpace;
    /* Workaround  needed to give an Identifier to the DataSpecificationIEC61360Type */
    addressSpace.fixSpecificationTypeIdentifications();

    const Identifier = opcua.coreaas.getIdentifierConstructor(addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = opcua.coreaas.IdentifierType;
    const Key = opcua.coreaas.getKeyConstructor(addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = opcua.coreaas.KeyElements;
    const KeyType = opcua.coreaas.KeyType;
    const Kind = opcua.coreaas.Kind;
    const PropertyCategory = opcua.coreaas.PropertyCategory;
    const PropertyValueType = opcua.coreaas.PropertyValueType;

    const add_identification_submodel = require("./submodels/identification_submodel");
    const add_communication_submodel = require("./submodels/communication_submodel");
    const add_configuration_submodel = require("./submodels/configuration_submodel");

    /* ======================= Insert code to fill AddressSpace here ==================== */
    const pc_aas = addressSpace.addAssetAdministrationShell({
        browseName: "PC_AAS",
        identification: new Identifier({
            id: "//tu_dresden/apb/aas/123456789",
            idType: IdentifierType.URI
        }),
        assetRef: [new Key({
            idType: KeyType.URI,
            local: true,
            type: KeyElements.Asset,
            value: "//tu_dresden/apb/pcs/A6677218-33E7-4965-9A0D-C494F427ACC1"
        })]
    })
    .addSubmodelRef([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "//aas/submodel/555444333"
    })])
    .addSubmodelRef([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "//aas/submodel/98989898"
    })])
    .addSubmodelRef([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "//aas/submodel/12345679"
    })]);

    /**
     * Add a Asset
     */
    addressSpace.addAsset({
        browseName: "DESKTOP-2UP4TS4",
        idShort: "A6677218-33E7-4965-9A0D-C494F427ACC1",
        identification: new Identifier({
            id: "//tu_dresden/apb/pcs/A6677218-33E7-4965-9A0D-C494F427ACC1",
            idType: IdentifierType.URI
        }),
        kind: Kind.Instance,
        description: "Marco Personal Computer",
        assetOf: pc_aas,
        assetIdentificationModelRef: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.SubmodelElement,
            value: "//submodels/identification_3S7PLFDRS35"
        }) ]
    });

    /**
     * Add Dictionary to the AAS
     */
    const dictionary = addressSpace.addConceptDictionary({
        browseName: "ConceptDict_1",
        idShort: "ConceptDictionary_1",
        conceptDictionaryOf: pc_aas,
        description: "A dictionary of concept for Marco PC"
    });

    const identificationSubmodel = add_identification_submodel({ opcua, addressSpace, dictionary });
    const communicationSubmodel = add_communication_submodel({ opcua, addressSpace, dictionary });
    const configurationSubmodel = add_configuration_submodel({ opcua, addressSpace, dictionary });
    pc_aas.hasSubmodel(identificationSubmodel);
    pc_aas.hasSubmodel(communicationSubmodel);
    pc_aas.hasSubmodel(configurationSubmodel);

    /* Start The OPC UA Server */
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);