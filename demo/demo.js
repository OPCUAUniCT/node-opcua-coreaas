var opcua = require("node-opcua");

// add server CoreAAS extension to node-opcua
require("../index")(opcua);


var xmlFiles = [
    opcua.standard_nodeset_file,
    opcua.coreaas.nodeset_file
];

var server = new opcua.OPCUAServer({
    nodeset_filename: xmlFiles,
});


function post_initialize() {
    console.log("initialized");
    var addressSpace = server.engine.addressSpace;
    const Identifier = opcua.coreaas.getIdentifierConstructor(addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = opcua.coreaas.IdentifierType;
    const Key = opcua.coreaas.getKeyConstructor(addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = opcua.coreaas.KeyElements;
    const KeyType = opcua.coreaas.KeyType;
    const Kind = opcua.coreaas.Kind;

    // Workaround  needed to give an Identifier to the DataSpecificationIEC61360Type
    addressSpace.fixSpecificationTypeIdentifications();

    //Create AdministrativeInformation for AAS
    const admin_1 = addressSpace.addAdministrativeInformation({
        version: "1.0.0",
        revision: "22"
    });

    // Create an AAS
    const aas_1 = addressSpace.addAssetAdministrationShell({
        browseName: "SampleAAS",
        description: "Festo Controller",
        administration: admin_1,
        identification: new Identifier({
            id: "www.admin-shell.io/aas-sample/1.0",
            idType: IdentifierType.URI
        }),
        derivedFrom: [ new Key({
            idType: KeyType.IRDI,
            local: false,
            type: KeyElements.AssetAdministrationShell,
            value: "AAA#1234-454#123456789"
        }) ],
        kind: 0
    });

    // Create a DataSpecificationIEC61360TypeInstance
    const dataSpec_1 = addressSpace.addDataSpecificationIEC61360({
        preferredName: "Property_1",
        shortName: "Prop1",
        valueFormat: "a-a-a",
        unitId: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "aas/engine/rotationSpeed/meter_per_second"
        }) ]
    });

    //Add an EmbeddedDataSpecification to the AAS
    addressSpace.addEmbeddedDataSpecification({
        browseName: "data specification 1",
        embeddedDataSpecificationOf: aas_1,
        hasDataSpecification: [ new Key({
            idType: KeyType.IRDI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "BBB#5555-666666"
        }) ],
        dataSpecificationContent: dataSpec_1
    });

    /* Create an Asset for AAS_1 */
    const admin_asset = addressSpace.addAdministrativeInformation({
        version: "1.1.3",
        revision: "54"
    });

    addressSpace.addAsset({
        browseName: "3S7PLFDRS35",
        idShort: "3S7PLFDRS35",
        description: "Festo Controller",
        kind: Kind.Instance,
        assetOf: aas_1,
        identification: new Identifier({
            id: "http://pk.festo.com/3S7PLFDRS35",
            idType: IdentifierType.URI
        }),
        administration: admin_asset,
        assetIdentificationModel: [ new Key({
            idType: KeyType.URI,
            local: true,
            type: KeyElements.GlobalReference,
            value: "//submodels/identification_asset_3S7PLFDRS35"
        }) ]
    });

    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);