"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const _1 = require(".");
const CoreAAS_enums_1 = require("./CoreAAS_enums");
let xmlFiles = [_1.nodesets.standard, _1.coreaasXmlFile];
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
        description: [new _1.LocalizedText({ locale: "en", text: "Festo Controller" }),
            new _1.LocalizedText({ locale: "de", text: "Festo Controller" })],
        identification: new Identifier({
            id: "www.admin-shell.io/aas-sample/1.0",
            idType: _1.IdentifierType.IRI
        }),
        assetRef: [new Key({
                idType: _1.KeyType.IRI,
                local: true,
                type: _1.KeyElements.Asset,
                value: "http://pk.festo.com/3S7PLFDRS35"
            })],
        derivedFromRef: [new Key({
                idType: _1.KeyType.IRDI,
                local: false,
                type: _1.KeyElements.AssetAdministrationShell,
                value: "AAA#1234-454#123456789"
            })],
        administration: admin
    });
    let asset = server.coreaas.addAsset({
        browseName: "3S7PLFDRS35",
        idShort: "3S7PLFDRS35",
        identification: new Identifier({
            id: "http://pk.festo.com/3S7PLFDRS35",
            idType: _1.IdentifierType.IRI
        }),
        kind: CoreAAS_enums_1.AssetKind.Instance,
        description: "Festo Controller Asset",
        //assetOf: aas_1,
        assetIdentificationModelRef: [new Key({
                idType: _1.KeyType.IRI,
                local: false,
                type: _1.KeyElements.Submodel,
                value: "//submodels/identification_3S7PLFDRS35"
            })],
        billOfMaterialRef: [new Key({
                idType: _1.KeyType.IRI,
                local: false,
                type: _1.KeyElements.Submodel,
                value: "http://www.zvei.de/demo/submodel/sampleAAS_Composition"
            })]
    });
    aas_1.hasAsset(asset)
        .addSubmodelRef([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        })]);
    let dcMotorAsset = server.coreaas.addAsset({
        browseName: "dcMotor_123456789",
        idShort: "dcMotor_123456789",
        identification: new Identifier({
            id: "http://pk.festo.com/dcMotor_123456789",
            idType: _1.IdentifierType.IRI
        }),
        kind: CoreAAS_enums_1.AssetKind.Instance,
        description: "DC Motor of Festo Controller Asset"
    });
    /**
     * Add Submodel
     */
    const submodel_type = server.coreaas.addSubmodel({
        browseName: "AAAAA",
        kind: _1.ModelingKind.Template,
        idShort: "AAAA",
        identification: new Identifier({
            id: "http://www.zvei.de/demo/submodel/AAAA",
            idType: _1.IdentifierType.IRI
        })
    });
    const submodel_1 = server.coreaas.addSubmodel({
        browseName: "12345679",
        kind: _1.ModelingKind.Instance,
        idShort: "12345679",
        identification: new Identifier({
            id: "http://www.zvei.de/demo/submodel/12345679",
            idType: _1.IdentifierType.IRI
        })
    }).submodelOf(aas_1)
        /* .addSemanticId([new Key({
            idType: KeyType.URI,
            local: true,
            type: KeyElements.Submodel,
            value: "http://www.zvei.de/demo/semantic_for_submodel"
        })]) */
        .hasSubmodelSemantic(submodel_type)
        .addParent([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.AssetAdministrationShell,
            value: "www.admin-shell.io/aas-sample/1.0"
        })]);
    const compositionSubmodel1 = server.coreaas.addSubmodel({
        browseName: "SampleAAS_Composition",
        kind: _1.ModelingKind.Instance,
        idShort: "sampleAAS_Composition",
        identification: new Identifier({
            id: "http://www.zvei.de/demo/submodel/sampleAAS_Composition",
            idType: _1.IdentifierType.IRI
        })
    }).submodelOf(aas_1);
    /**
     * Add SubmodelElementCollection
     */
    let measurementCollection = server.coreaas.addSubmodelElementCollection({
        idShort: "Measurement",
        submodelElementOf: submodel_1,
        ordered: true,
        kind: _1.ModelingKind.Instance
    })
        .addParent([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        })]);
    let capabilityCollection = server.coreaas.addSubmodelElementCollection({
        idShort: "Capabilities",
        submodelElementOf: submodel_1,
        ordered: false,
        kind: _1.ModelingKind.Instance
    })
        .addParent([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        })]);
    /**
     * Add SubmodelProperties and other Submodel Elements
     */
    const rotationSpeed = server.coreaas.addSubmodelProperty({
        browseName: "rotationSpeed",
        idShort: "rotationSpeed",
        //submodelElementOf: submodel_1,
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
    })
        .addSemanticId([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.ConceptDescription,
            value: "www.festo.com/dic/08111234"
        })])
        .addParent([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        }),
        new Key({
            idType: _1.KeyType.idShort,
            local: true,
            type: _1.KeyElements.SubmodelElementCollection,
            value: "Measurement"
        })])
        .addValueId([new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.GlobalReference,
            value: "//value/of/rotationSpeed"
        })]);
    const nmax = server.coreaas.addSubmodelProperty({
        browseName: "NMAX",
        idShort: "NMAX",
        //submodelElementOf: submodel_1,
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
    const rotationSpeedRange = server.coreaas.addRange({
        browseName: "Rotation Speed Range",
        idShort: "rotationSpeedRange",
        valueType: _1.PropertyValueType.Double,
        min: {
            dataType: "Double",
            value: {
                get: () => {
                    return new _1.Variant({ dataType: _1.DataType.Double, value: 0 });
                }
            }
        },
        max: {
            dataType: "Double",
            value: {
                get: () => {
                    return new _1.Variant({ dataType: _1.DataType.Double, value: 2000 });
                }
            }
        }
    });
    const maxSpeedRelationship = server.coreaas.addRelationshipElement({
        browseName: "Range and MaxSpeed relation",
        idShort: "rangeAndNMAXRel",
        first: [new Key({
                idType: _1.KeyType.IRI,
                local: true,
                type: _1.KeyElements.Submodel,
                value: "http://www.zvei.de/demo/submodel/12345679"
            }),
            new Key({
                idType: _1.KeyType.idShort,
                local: true,
                type: _1.KeyElements.SubmodelElementCollection,
                value: "Measurement"
            }),
            new Key({
                idType: _1.KeyType.idShort,
                local: true,
                type: _1.KeyElements.Property,
                value: "NMAX"
            })],
        second: [new Key({
                idType: _1.KeyType.IRI,
                local: true,
                type: _1.KeyElements.Submodel,
                value: "http://www.zvei.de/demo/submodel/12345679"
            }),
            new Key({
                idType: _1.KeyType.idShort,
                local: true,
                type: _1.KeyElements.SubmodelElementCollection,
                value: "Measurement"
            }),
            new Key({
                idType: _1.KeyType.idShort,
                local: true,
                type: _1.KeyElements.Property,
                value: "rotationSpeedRange"
            })]
    });
    const rotationMeasureCapability = server.coreaas.addCapability({
        browseName: "Rotation Measurement",
        idShort: "rotationMeasurement"
    });
    const component1 = server.coreaas.addEntity({
        browseName: "DC Motor",
        idShort: "dcMotor",
        entityType: CoreAAS_enums_1.EntityTypeEnumType.CoManagedEntity,
        asset: [new Key({
                idType: _1.KeyType.IRI,
                local: true,
                type: _1.KeyElements.Asset,
                value: "http://pk.festo.com/dcMotor_123456789"
            })],
        submodelElementOf: compositionSubmodel1
    });
    measurementCollection.addElements([nmax, rotationSpeed, rotationSpeedRange, maxSpeedRelationship]);
    capabilityCollection.addElements([rotationMeasureCapability]);
    /**
     * Add Concept Dictionary
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
            idType: _1.KeyType.IRI,
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
     * Add ConceptDescription with EmbeddedDataSpecification
     */
    const embedded_1 = server.coreaas.addEmbeddedDataSpecification({
        browseName: "EmbeddedDS_1",
        hasDataSpecification: [new Key({
                idType: _1.KeyType.IRI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
            })],
    })
        .addDataSpecificationIEC61360({
        identifier: "rtzspd#123",
        preferredName: "Rotation Speed",
        definition: "The Rotation Speed of something",
        dataType: CoreAAS_enums_1.DataTypeIEC61360Type.REAL_MEASURE,
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
            idType: _1.IdentifierType.IRI
        }),
        conceptDescriptionOf: conceptDictionary
    })
        .hasEmbeddedDataSpecifications(embedded_1)
        .semanticOf(rotationSpeed);
    //Add an EmbeddedDataSpecification to the AAS for Max Rotation Speed
    const embedded_2 = server.coreaas.addEmbeddedDataSpecification({
        browseName: "EmbeddedDS_1",
        hasDataSpecification: [new Key({
                idType: _1.KeyType.IRI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
            })],
    }).addDataSpecificationIEC61360(server.coreaas.addDataSpecificationIEC61360({
        preferredName: "Max Rotation Speed",
        shortName: "NMAX",
        valueFormat: "NR1..5",
        unitId: [new Key({
                idType: _1.KeyType.IRDI,
                local: false,
                type: _1.KeyElements.GlobalReference,
                value: "0173-1#05-AAA650#002"
            })]
    }));
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
    /** Add View */
    let view_1 = server.coreaas.addAASView({
        idShort: "Maintenence",
        semanticId: [new Key({
                idType: _1.KeyType.IRDI,
                local: true,
                type: _1.KeyElements.ConceptDescription,
                value: "EREOTO"
            })],
        description: [new _1.LocalizedText({ locale: "en", text: "Festo Controller" }),
            new _1.LocalizedText({ locale: "de", text: "Festo Controller" })],
    })
        .addContainedElementRef([
        new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        }),
        new Key({
            idType: _1.KeyType.idShort,
            local: true,
            type: _1.KeyElements.Property,
            value: "NMAX"
        })
    ])
        .addContainedElementRef([
        new Key({
            idType: _1.KeyType.IRI,
            local: true,
            type: _1.KeyElements.Submodel,
            value: "http://www.zvei.de/demo/submodel/12345679"
        }),
        new Key({
            idType: _1.KeyType.idShort,
            local: true,
            type: _1.KeyElements.Property,
            value: "rotationSpeed"
        })
    ])
        .containsElements([nmax, rotationSpeed]);
    aas_1.addViews([view_1]);
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
//# sourceMappingURL=demo2.js.map