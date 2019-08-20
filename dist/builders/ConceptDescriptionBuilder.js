"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
const node_opcua_1 = require("node-opcua");
const ua_object_1 = require("node-opcua-address-space/dist/src/ua_object");
const types_1 = require("../types");
const assert = require("assert");
const builder_utilities_1 = require("./builder_utilities");
class ConceptDescriptionBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addConceptDescription(options) {
        assert(options.identification != null, "No options.identification parameter inserted!");
        assert(types_1.isIdentifier(options.identification), "options.identification is not an Identifier.");
        const conceptDescriptionType = this.coreaas.findCoreAASObjectType("ConceptDescriptionType");
        const conceptDescriptions = this._addressSpace.rootFolder.objects.conceptDescriptions;
        const conceptDescription = this._namespace.addObject({
            typeDefinition: conceptDescriptionType,
            browseName: options.browseName || "ConceptDescription_" + options.identification.id,
            nodeId: options.nodeId,
            organizedBy: conceptDescriptions,
        });
        this.coreaas.identifiableMap.set(options.identification.id, conceptDescription);
        //Add identification
        this._namespace.addVariable({
            propertyOf: conceptDescription,
            browseName: "identification",
            dataType: this.coreaas.findCoreAASDataType("Identifier"),
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.ExtensionObject,
                        value: options.identification
                    });
                }
            }
        });
        //Add description
        if (options.description != null) {
            const addDescriptionToConceptDescription = builder_utilities_1.get_description_creator(this.coreaas, conceptDescription);
            addDescriptionToConceptDescription(options.description);
        }
        //Add Administration
        if (options.administration != null) {
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.getAdministrativeInformationType()), "options.administration is not an AdministrativeInformationType Object.");
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            conceptDescription.addReference({ referenceType: "HasComponent", nodeId: options.administration });
        }
        //Add this Asset to the AAS
        if (options.conceptDescriptionOf != null) {
            assert(options.conceptDescriptionOf instanceof ua_object_1.UAObject, "options.conceptDescriptionOf is not an UAObject.");
            const hasConceptDescriptionRefType = this.coreaas.findCoreAASReferenceType("HasConceptDescription");
            options.conceptDescriptionOf.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription });
        }
        //Add EmbeddedDataSpecification
        if (options.hasEmbeddedDataSpecifications != null) {
            this._create_hasEmbeddedDataSpecifications(conceptDescription)(options.hasEmbeddedDataSpecifications);
        }
        conceptDescription.semanticOf = (elem) => {
            assert(elem instanceof ua_object_1.UAObject, "elem is not a UAObject.");
            const hasSemanticRefType = this.coreaas.findCoreAASReferenceType("HasSemantic");
            elem.addReference({ referenceType: hasSemanticRefType, nodeId: conceptDescription });
            return conceptDescription;
        };
        conceptDescription.isCaseOf = (ref) => {
            assert(ref instanceof Array || ref instanceof ua_object_1.UAObject, "ref is neither a UAObject or an Array of Key.");
            if (ref instanceof Array) {
                ref.forEach(el => assert(types_1.isKey(el), "ref Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    isCaseOf: conceptDescription,
                    browseName: "Case_" + ref[ref.length - 1].value,
                    keys: ref
                });
            }
            else {
                assert(ref.keys != null, "assetRef is not an AASReferenceType instance.");
                conceptDescription.addReference({ referenceType: "HasComponent", nodeId: ref });
            }
            return conceptDescription;
        };
        conceptDescription.hasEmbeddedDataSpecifications = this._create_hasEmbeddedDataSpecifications(conceptDescription);
        conceptDescription.conceptDescriptionOf = this.create_conceptDescriptionOf(conceptDescription);
        return conceptDescription;
    }
    ;
    _create_hasEmbeddedDataSpecifications(conceptDes) {
        const coreaas = this.coreaas;
        return function (eds) {
            let embedds = [];
            embedds = embedds.concat(embedds, eds);
            embedds.forEach((e) => {
                assert(e instanceof ua_object_1.UAObject, "eds contains some element that is not UAObject.");
            });
            const hasEmbeddedDataSpecificationRefType = coreaas.findCoreAASReferenceType("HasEmbeddedDataSpecification");
            embedds.forEach((e) => conceptDes.addReference({ referenceType: hasEmbeddedDataSpecificationRefType, nodeId: e }));
            return conceptDes;
        };
    }
    create_conceptDescriptionOf(conceptDescription) {
        const coreaas = this.coreaas;
        return function (dict) {
            assert(dict instanceof ua_object_1.UAObject, "dict is not an UAObject.");
            const hasConceptDescriptionRefType = coreaas.findCoreAASReferenceType("HasConceptDescription");
            dict.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription });
            return conceptDescription;
        };
    }
}
exports.ConceptDescriptionBuilder = ConceptDescriptionBuilder;
//# sourceMappingURL=ConceptDescriptionBuilder.js.map