"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const _1 = require(".");
let xmlFiles = [_1.nodesets.standard_nodeset_file, _1.coreaasXmlFile];
let server = new _1.CoreServer({
    nodeset_filename: xmlFiles,
    port: 4848,
    serverCertificateManager: new _1.OPCUACertificateManager({
        automaticallyAcceptUnknownCertificate: true,
        rootFolder: path_1.default.join(__dirname, "../certs")
    })
});
function post_initialize() {
    const Identifier = server.coreaas.Identifier;
    const Key = server.coreaas.Key;
    let admin = server.coreaas.addAdministrativeInformation({
        version: "555",
        revision: "1825"
    });
    const aas_1 = server.coreaas.addAssetAdministrationShell({
        browseName: "SampleAAS",
        administration: admin,
        description: [new _1.LocalizedText({ locale: "en", text: "Festo Controller" }),
            new _1.LocalizedText({ locale: "de", text: "Festo Controller" })],
        identification: new Identifier({
            id: "www.admin-shell.io/aas-sample/1.0",
            idType: _1.IdentifierType.URI
        }),
        derivedFromRef: [new Key({
                idType: _1.KeyType.IRDI,
                local: false,
                type: _1.KeyElements.AssetAdministrationShell,
                value: "AAA#1234-454#123456789"
            })],
        assetRef: [new Key({
                idType: _1.KeyType.URI,
                local: true,
                type: _1.KeyElements.Asset,
                value: "http://pk.festo.com/3S7PLFDRS35"
            })]
    })
        .addSubmodelRef([new Key({
            idType: _1.KeyType.URI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        })]);
    /**
     * Add a Asset
     */
    server.coreaas.addAsset({
        browseName: "3S7PLFDRS35",
        idShort: "3S7PLFDRS35",
        identification: new Identifier({
            id: "http://pk.festo.com/3S7PLFDRS35",
            idType: _1.IdentifierType.URI
        }),
        kind: _1.Kind.Instance,
        description: new _1.LocalizedText({ locale: "en", text: "Festo Controller" }),
        assetOf: aas_1,
        assetIdentificationModelRef: [new Key({
                idType: _1.KeyType.URI,
                local: false,
                type: _1.KeyElements.SubmodelElement,
                value: "//submodels/identification_3S7PLFDRS35"
            })]
    });
    /**
     * Add Submodel
     */
    const submodel_1 = server.coreaas.addSubmodel({
        browseName: "12345679",
        kind: _1.Kind.Instance,
        idShort: "12345679",
        identification: new Identifier({
            id: "http://www.zvei.de/demo/submodel/12345679",
            idType: _1.IdentifierType.URI
        }),
        semanticId: [new Key({
                idType: _1.KeyType.URI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "http://www.zvei.de/demo/submodelDefinitions/87654346"
            })]
    })
        .submodelOf(aas_1);
    /**
     * Add Properties to the submodel
     */
    const rotationSpeed = server.coreaas.addSubmodelProperty({
        browseName: "rotationSpeed",
        idShort: "rotationSpeed",
        submodelElementOf: submodel_1,
        semanticId: [new Key({
                idType: _1.KeyType.URI,
                local: true,
                type: _1.KeyElements.ConceptDescription,
                value: "www.festo.com/dic/08111234"
            })],
        category: _1.PropertyCategory.VARIABLE,
        valueType: _1.PropertyValueType.Double,
        value: {
            dataType: "Double",
            value: {
                get: () => {
                    return new _1.Variant({ dataType: _1.DataType.Double, value: 1120 });
                }
            }
        }
    });
    const nmax = server.coreaas.addSubmodelProperty({
        browseName: "NMAX",
        idShort: "NMAX",
        submodelElementOf: submodel_1,
        semanticId: [new Key({
                idType: _1.KeyType.IRDI,
                local: true,
                type: _1.KeyElements.ConceptDescription,
                value: "0173-1#02-BAA120#007"
            })],
        category: _1.PropertyCategory.PARAMETER,
        valueType: _1.PropertyValueType.Double,
        value: {
            dataType: "Double",
            value: {
                get: () => {
                    return new _1.Variant({ dataType: _1.DataType.Double, value: 2000 });
                }
            }
        }
    });
    /**
     * Add Dictionary to the AAS
     */
    const conceptDictionary = server.coreaas.addConceptDictionary({
        browseName: "ConceptDict_1",
        idShort: "ConceptDictionary_1",
        conceptDictionaryOf: aas_1,
        description: [new _1.LocalizedText({ locale: "en", text: "Dicitonary for the Festo Controller." }),
            new _1.LocalizedText({ locale: "it", text: "Dizionario per il Controller Festo" })]
    })
        .addConceptDescriptionRef([
        new Key({
            idType: _1.KeyType.URI,
            local: true,
            type: _1.KeyElements.ConceptDescription,
            value: "www.festo.com/dic/08111234"
        })
    ])
        .addConceptDescriptionRef([
        new Key({
            idType: _1.KeyType.IRDI,
            local: true,
            type: _1.KeyElements.ConceptDescription,
            value: "0173-1#02-BAA120#007"
        })
    ]);
    /**
     * Add ConceptDescriptions to the Dictionary
     */
    //Add an EmbeddedDataSpecification to the AAS for Rotation Speed
    const embedded_1 = server.coreaas.addEmbeddedDataSpecification({
        browseName: "EmbeddedDS_1",
        hasDataSpecification: [new Key({
                idType: _1.KeyType.URI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
            })],
    })
        .addDataSpecificationIEC61360({
        identifier: "rtzspd#123",
        preferredName: "Rotation Speed",
        definition: "The Rotation Speed of something",
        dataType: "double",
        unit: "1/m",
        unitId: [new Key({
                idType: _1.KeyType.IRDI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "0173-1#05-AAA650#002"
            })],
        shortName: "N",
        valueFormat: "NR1..5"
    });
    server.coreaas.addConceptDescription({
        browseName: "N",
        identification: new Identifier({
            id: "www.festo.com/dic/08111234",
            idType: _1.IdentifierType.URI
        }),
        hasEmbeddedDataSpecifications: embedded_1,
        conceptDescriptionOf: conceptDictionary,
    })
        .semanticOf(rotationSpeed);
    //Add an EmbeddedDataSpecification to the AAS for Max Rotation Speed
    const embedded_2 = server.coreaas.addEmbeddedDataSpecification({
        browseName: "EmbeddedDS_1",
        hasDataSpecification: [new Key({
                idType: _1.KeyType.URI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
            })],
    })
        .addDataSpecificationIEC61360({
        preferredName: "Max Rotation Speed",
        shortName: "NMAX",
        valueFormat: "NR1..5",
        unitId: [new Key({
                idType: _1.KeyType.IRDI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "0173-1#05-AAA650#002"
            })]
    });
    server.coreaas.addConceptDescription({
        browseName: "NMax",
        identification: new Identifier({
            id: "0173-1#02-BAA120#007",
            idType: _1.IdentifierType.IRDI
        }),
        hasEmbeddedDataSpecifications: embedded_2,
        conceptDescriptionOf: conceptDictionary
    })
        .semanticOf(nmax);
    /**
     * Start The OPC UA Server
     */
    server.start(function () {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl);
    });
}
server.initialize(post_initialize);
//# sourceMappingURL=demo.js.map