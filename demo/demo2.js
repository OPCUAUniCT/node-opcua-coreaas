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
    const addressSpace = server.engine.addressSpace;
    const Identifier = opcua.coreaas.getIdentifierConstructor(addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = opcua.coreaas.IdentifierType;
    const Key = opcua.coreaas.getKeyConstructor(addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = opcua.coreaas.KeyElements;
    const KeyType = opcua.coreaas.KeyType;
    const Kind = opcua.coreaas.Kind;
    const PropertyCategory = opcua.coreaas.PropertyCategory;
    const PropertyValueType = opcua.coreaas.PropertyValueType;

    // Workaround  needed to give an Identifier to the DataSpecificationIEC61360Type
    addressSpace.fixSpecificationTypeIdentifications();

    // Create an AAS
    const aas_1 = addressSpace.addAssetAdministrationShell({
        browseName: "SampleAAS",
        description: [  new opcua.LocalizedText({locale: "en", text: "Festo Controller"}),
                        new opcua.LocalizedText({locale: "de", text: "Festo Controller"}) ],
        identification: new Identifier({
            id: "www.admin-shell.io/aas-sample/1.0",
            idType: IdentifierType.URI
        }),
        assetRef: [new Key({
            idType: KeyType.URI,
            local: true,
            type: KeyElements.Asset,
            value: "http://pk.festo.com/3S7PLFDRS35"
        })],
        derivedFromRef: [ new Key({
            idType: KeyType.IRDI,
            local: false,
            type: KeyElements.AssetAdministrationShell,
            value: "AAA#1234-454#123456789"
        }) ]
    });

    /**
     * Add a Asset
     */
    let asset = addressSpace.addAsset({
        browseName: "3S7PLFDRS35",
        idShort: "3S7PLFDRS35",
        identification: new Identifier({
            id: "http://pk.festo.com/3S7PLFDRS35",
            idType: IdentifierType.URI
        }),
        kind: Kind.Instance,
        description: "Festo Controller Asset",
        //assetOf: aas_1,
        assetIdentificationModelRef: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.Submodel,
            value: "//submodels/identification_3S7PLFDRS35"
        }) ]
    });

    aas_1.hasAsset(asset)
    .addSubmodelRef([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "http://www.zvei.de/demo/submodel/12345679"
    })]);

    const submodel_type = addressSpace.addSubmodel({
        browseName: "AAAAA",
        kind: Kind.Type,
        idShort: "AAAA",
        identification: new Identifier({
            id: "http://www.zvei.de/demo/submodel/AAAA",
            idType: IdentifierType.URI
        })
    })

    const submodel_1 = addressSpace.addSubmodel({
        browseName: "12345679",
        kind: Kind.Instance,
        idShort: "12345679",
        identification: new Identifier({
            id: "http://www.zvei.de/demo/submodel/12345679",
            idType: IdentifierType.URI
        })
    })
    .submodelOf(aas_1)
    /* .addSemanticId([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "http://www.zvei.de/demo/semantic_for_submodel"
    })]) */
    .hasSubmodelSemantic(submodel_type)
    .addParent([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.AssetAdministrationShell,
        value: "www.admin-shell.io/aas-sample/1.0"
    })]);

    const rotationSpeed = addressSpace.addSubmodelProperty({
        browseName: "rotationSpeed",
        idShort: "rotationSpeed",
        submodelElementOf: submodel_1,
        // semanticId: [ new Key({
        //     idType: KeyType.URI,
        //     local: true,
        //     type: KeyElements.ConceptDescription,
        //     value: "www.festo.com/dic/08111234"
        // }) ],
        category: PropertyCategory.VARIABLE,
        valueType: PropertyValueType.Double,
        value: {
            dataType: "Double",
            value: {
                get: () => {
                    return new opcua.Variant({ dataType: opcua.DataType.Double, value: 1120});
                }
            }
        }
    })
    .addSemanticId([ new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.ConceptDescription,
        value: "www.festo.com/dic/08111234"
    }) ])
    .addParent([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "http://www.zvei.de/demo/submodel/12345679"
    })])
    .addValueId([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.GlobalReference,
        value: "//value/of/rotationSpeed"
    })]);

    //aas_1.hasSubmodel(submodel_1);

    const conceptDictionary = addressSpace.addConceptDictionary({
        browseName: "ConceptDict_1",
        idShort: "ConceptDictionary_1",
        //conceptDictionaryOf: aas_1,
        description: "A dictionary of concept for Festo Controller"
    });

    aas_1.addConceptDictionary(conceptDictionary);

    const embedded_1 = addressSpace.addEmbeddedDataSpecification({
        browseName: "EmbeddedDS_1",
        hasDataSpecification: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
        }) ],
    })
    .addDataSpecificationIEC61360({
        preferredName: "Rotation Speed",
        shortName: "N",
        valueFormat: "NR1..5",
        unitId: [ new Key({
            idType: KeyType.IRDI,
            local: false,
            type: KeyElements.GlobalReference,
            value: "0173-1#05-AAA650#002"
        }) ]
    });

    addressSpace.addConceptDescription({
        browseName: "N",
        identification: new Identifier({
            id: "www.festo.com/dic/08111234",
            idType: IdentifierType.URI
        }),
        conceptDescriptionOf: conceptDictionary
    })
    .hasEmbeddedDataSpecifications(embedded_1)
    .semanticOf(rotationSpeed);

    // /**
    //  * Add Submodel
    //  */
    // const submodel_1 = addressSpace.addSubmodel({
    //     browseName: "12345679",
    //     kind: Kind.Instance,
    //     idShort: "12345679",
    //     identification: new Identifier({
    //         id: "http://www.zvei.de/demo/submodel/12345679",
    //         idType: IdentifierType.URI
    //     }),
    //     hasSemantic: [ new Key({
    //         idType: KeyType.URI,
    //         local: false,
    //         type: KeyElements.GlobalReference,
    //         value: "http://www.zvei.de/demo/submodelDefinitions/87654346"
    //     }) ],
    //     submodelOf: aas_1
    // });

    // /**
    //  * Add Properties to the submodel
    //  */
    // const rotationSpeed = addressSpace.addSubmodelProperty({
    //     browseName: "rotationSpeed",
    //     idShort: "rotationSpeed",
    //     submodelElementOf: submodel_1,
    //     hasSemantic: [ new Key({
    //         idType: KeyType.URI,
    //         local: true,
    //         type: KeyElements.ConceptDescription,
    //         value: "www.festo.com/dic/08111234"
    //     }) ],
    //     category: PropertyCategory.VARIABLE,
    //     valueType: PropertyValueType.Double,
    //     value: {
    //         dataType: "Double",
    //         value: {
    //             get: () => {
    //                 return new opcua.Variant({ dataType: opcua.DataType.Double, value: 1120});
    //             }
    //         }
    //     }
    // });

    // const nmax = addressSpace.addSubmodelProperty({
    //     browseName: "NMAX",
    //     idShort: "NMAX",
    //     submodelElementOf: submodel_1,
    //     hasSemantic: [ new Key({
    //         idType: KeyType.IRDI,
    //         local: true,
    //         type: KeyElements.ConceptDescription,
    //         value: "0173-1#02-BAA120#007"
    //     }) ],
    //     category: PropertyCategory.PARAMETER,
    //     valueType: PropertyValueType.Double,
    //     value: {
    //         dataType: "Double",
    //         value: {
    //             get: () => {
    //                 return new opcua.Variant({ dataType: opcua.DataType.Double, value: 2000});
    //             }
    //         }
    //     }
    // });

    // /**
    //  * Add Dictionary to the AAS
    //  */
    // const conceptDictionary = addressSpace.addConceptDictionary({
    //     browseName: "ConceptDict_1",
    //     idShort: "ConceptDictionary_1",
    //     conceptDictionaryOf: aas_1,
    //     description: "A dictionary of concept for Festo Controller"
    // });

    // /**
    //  * Add ConceptDescriptions to the Dictionary
    //  */

    // //Add an EmbeddedDataSpecification to the AAS for Rotation Speed
    // const embedded_1 = addressSpace.addEmbeddedDataSpecification({
    //     browseName: "EmbeddedDS_1",
    //     hasDataSpecification: [ new Key({
    //         idType: KeyType.URI,
    //         local: false,
    //         type: KeyElements.GlobalReference,
    //         value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
    //     }) ],
    // }).addDataSpecificationIEC61360({
    //     preferredName: "Rotation Speed",
    //     shortName: "N",
    //     valueFormat: "NR1..5",
    //     unitId: [ new Key({
    //         idType: KeyType.IRDI,
    //         local: false,
    //         type: KeyElements.GlobalReference,
    //         value: "0173-1#05-AAA650#002"
    //     }) ]
    // });

    // addressSpace.addConceptDescription({
    //     browseName: "N",
    //     identification: new Identifier({
    //         id: "www.festo.com/dic/08111234",
    //         idType: IdentifierType.URI
    //     }),
    //     hasEmbeddedDataSpecification: embedded_1,
    //     conceptDescriptionOf: conceptDictionary,
    //     localSemanticOf: rotationSpeed
    // });

    // //Add an EmbeddedDataSpecification to the AAS for Max Rotation Speed
    // const embedded_2 = addressSpace.addEmbeddedDataSpecification({
    //     browseName: "EmbeddedDS_1",
    //     hasDataSpecification: [ new Key({
    //         idType: KeyType.URI,
    //         local: false,
    //         type: KeyElements.GlobalReference,
    //         value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
    //     }) ],
    // }).addDataSpecificationIEC61360({
    //     preferredName: "Max Rotation Speed",
    //     shortName: "NMAX",
    //     valueFormat: "NR1..5",
    //     unitId: [ new Key({
    //         idType: KeyType.IRDI,
    //         local: false,
    //         type: KeyElements.GlobalReference,
    //         value: "0173-1#05-AAA650#002"
    //     }) ]
    // });

    // addressSpace.addConceptDescription({
    //     browseName: "NMax",
    //     identification: new Identifier({
    //         id: "0173-1#02-BAA120#007",
    //         idType: IdentifierType.IRDI
    //     }),
    //     hasEmbeddedDataSpecification: embedded_2,
    //     conceptDescriptionOf: conceptDictionary,
    //     localSemanticOf: nmax
    // });

    /**
     * Start The OPC UA Server
     */
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);