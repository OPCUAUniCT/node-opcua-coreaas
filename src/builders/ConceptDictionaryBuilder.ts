import { Builder } from "./builder";
import { CoreAASExtension } from "../CoreAASExtension";
import { ConceptDictionaryObject, RefArgument, isKey, ConceptDescriptionObject, Key } from "../types";
import { Variant, DataType } from "node-opcua";
import assert = require("assert");
import { get_parent_creator, get_description_creator } from "./builder_utilities";
import { ConceptDictionaryOptions } from "../options_types";

export class ConceptDictionaryBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addConceptDictionary(options: ConceptDictionaryOptions): ConceptDictionaryObject {
        assert(options.idShort != null, "No options.idShort parameter inserted!");

        const conceptDictionaryType = this.coreaas.findCoreAASObjectType("ConceptDictionaryType")!;

        const conceptDictionary = this._namespace.addObject({
            typeDefinition: conceptDictionaryType,
            browseName: options.browseName || options.idShort + "_Dictionary",
            nodeId: options.nodeId
        }) as ConceptDictionaryObject;

        const folderType = this._addressSpace.findNode("FolderType")!.nodeId;

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
                get: function() {
                    return new Variant({
                        dataType: DataType.String, 
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
            get_parent_creator<ConceptDictionaryObject>(this.coreaas, conceptDictionary)(options.parent);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToProperty = get_description_creator(this.coreaas, conceptDictionary);
            addDescriptionToProperty(options.description);
        }

        conceptDictionary.hasConceptDescriptions = (conceptDescriptions: ConceptDescriptionObject | ConceptDescriptionObject[]): ConceptDictionaryObject => {

            const hasConceptDescriptionRefType = this.coreaas.findCoreAASReferenceType("HasConceptDescription")!;

            if(conceptDescriptions instanceof Array) {
                conceptDescriptions.forEach(conceptDescription => {
                    assert(conceptDescription.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ConceptDescriptionType")!), "An element of the Array is not a ConceptDescriptionType instance.")
                    conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription});
                });
            }
            else {
                assert(conceptDescriptions.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ConceptDescriptionType")!), "conceptDescriptions is not a ConceptDescriptionType instance.")
                conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescriptions});
            }

            return conceptDictionary;
        }

        conceptDictionary.addParent = get_parent_creator(this.coreaas, conceptDictionary);

        conceptDictionary.addConceptDescriptionRef = (conceptDescriptionRef: RefArgument) => {
            
            if (conceptDescriptionRef instanceof Array) {

                conceptDescriptionRef.forEach(el => assert(isKey(el), "Array parameter contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    organizedBy: conceptDictionary.conceptDescriptions,
                    browseName: (<Key>conceptDescriptionRef[conceptDescriptionRef.length - 1]).value + "_Ref",
                    keys: conceptDescriptionRef
                });

            } 
            else {
                assert(conceptDescriptionRef.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "conceptDescriptionRef is not an AASReferenceType instance.");

                conceptDictionary.conceptDescriptions.addReference({ referenceType: "Organizes", nodeId: conceptDescriptionRef});
            }

            return conceptDictionary;
        }

        return conceptDictionary;
    }
}