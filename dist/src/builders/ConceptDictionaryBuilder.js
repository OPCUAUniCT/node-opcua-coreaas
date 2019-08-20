"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
const types_1 = require("../types");
const node_opcua_1 = require("node-opcua");
const assert = require("assert");
const builder_utilities_1 = require("./builder_utilities");
class ConceptDictionaryBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addConceptDictionary(options) {
        assert(options.idShort != null, "No options.idShort parameter inserted!");
        const conceptDictionaryType = this.coreaas.findCoreAASObjectType("ConceptDictionaryType");
        const conceptDictionary = this._namespace.addObject({
            typeDefinition: conceptDictionaryType,
            browseName: options.browseName || options.idShort + "_Dictionary",
            nodeId: options.nodeId
        });
        const folderType = this._addressSpace.findNode("FolderType").nodeId;
        //Add conceptDescriptions
        const conceptDescriptions = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "ConceptDescriptions",
            componentOf: conceptDictionary
        });
        let idShort = this._namespace.addVariable({
            propertyOf: conceptDictionary,
            browseName: "idShort",
            dataType: "String",
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.String,
                        value: options.idShort
                    });
                }
            }
        });
        //Add this ConceptDictionary to an AAS
        if (options.conceptDictionaryOf != null) {
            const conceptDictionaries = options.conceptDictionaryOf.conceptDictionaries;
            conceptDictionaries.addReference({ referenceType: "Organizes", nodeId: conceptDictionary });
            options.conceptDictionaryOf.referableChildrenMap.set(conceptDictionary.idShort._dataValue.value.value, conceptDictionary);
        }
        //Add Parent
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, conceptDictionary)(options.parent);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToProperty = builder_utilities_1.get_description_creator(this.coreaas, conceptDictionary);
            addDescriptionToProperty(options.description);
        }
        conceptDictionary.hasConceptDescriptions = (conceptDescriptions) => {
            const hasConceptDescriptionRefType = this.coreaas.findCoreAASReferenceType("HasConceptDescription");
            if (conceptDescriptions instanceof Array) {
                conceptDescriptions.forEach(conceptDescription => {
                    assert(conceptDescription.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ConceptDescriptionType")), "An element of the Array is not a ConceptDescriptionType instance.");
                    conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription });
                });
            }
            else {
                assert(conceptDescriptions.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ConceptDescriptionType")), "conceptDescriptions is not a ConceptDescriptionType instance.");
                conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescriptions });
            }
            return conceptDictionary;
        };
        conceptDictionary.addParent = builder_utilities_1.get_parent_creator(this.coreaas, conceptDictionary);
        conceptDictionary.addConceptDescriptionRef = (conceptDescriptionRef) => {
            if (conceptDescriptionRef instanceof Array) {
                conceptDescriptionRef.forEach(el => assert(types_1.isKey(el), "Array parameter contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    organizedBy: conceptDictionary.conceptDescriptions,
                    browseName: conceptDescriptionRef[conceptDescriptionRef.length - 1].value + "_Ref",
                    keys: conceptDescriptionRef
                });
            }
            else {
                assert(conceptDescriptionRef.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "conceptDescriptionRef is not an AASReferenceType instance.");
                conceptDictionary.conceptDescriptions.addReference({ referenceType: "Organizes", nodeId: conceptDescriptionRef });
            }
            return conceptDictionary;
        };
        return conceptDictionary;
    }
}
exports.ConceptDictionaryBuilder = ConceptDictionaryBuilder;
//# sourceMappingURL=ConceptDictionaryBuilder.js.map