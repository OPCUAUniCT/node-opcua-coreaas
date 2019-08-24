import { Builder } from "./builder";
import { CoreAASExtension } from "../CoreAASExtension";
import { Variant, DataType } from "node-opcua";
import { UAObject } from "node-opcua-address-space/dist/src/ua_object";
import { EDSObject, isIdentifier, CoreAASObjectsFolder, Identifier, ConceptDescriptionObject, RefArgument, isKey, Key, AASReferenceObject, ConceptDictionaryObject } from "../types";
import assert = require("assert");
import { get_description_creator } from "./builder_utilities";
import { ConceptDescriptionOptions } from "../options_types";

export class ConceptDescriptionBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addConceptDescription(options: ConceptDescriptionOptions): ConceptDescriptionObject {
        assert(options.identification != null, "No options.identification parameter inserted!");
        assert(isIdentifier(options.identification), "options.identification is not an Identifier.");

        const conceptDescriptionType = this.coreaas.findCoreAASObjectType("ConceptDescriptionType")!;
        const conceptDescriptions = (<CoreAASObjectsFolder>this._addressSpace.rootFolder.objects).conceptDescriptions;

        const conceptDescription: ConceptDescriptionObject = this._namespace.addObject({
            typeDefinition: conceptDescriptionType,
            browseName:    options.browseName || "ConceptDescription_" + (<Identifier>options.identification).id,
            nodeId:        options.nodeId,
            organizedBy: conceptDescriptions,
        }) as ConceptDescriptionObject;

        this.coreaas.identifiableMap.set((<Identifier>options.identification).id, conceptDescription);

        //Add identification
        this._namespace.addVariable({
            propertyOf: conceptDescription,
            browseName: "identification",
            dataType: this.coreaas.findCoreAASDataType("Identifier")!,
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.ExtensionObject, 
                        value: options.identification
                    });
                }
            }
        });

        //Add description
        if (options.description != null) {
            const addDescriptionToConceptDescription = get_description_creator(this.coreaas, conceptDescription);
            addDescriptionToConceptDescription(options.description);
        }

        //Add Administration
        if (options.administration != null) {
            
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.getAdministrativeInformationType()) , "options.administration is not an AdministrativeInformationType Object.")
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            
            conceptDescription.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add this Asset to the AAS
        if (options.conceptDescriptionOf != null) {
            assert(options.conceptDescriptionOf instanceof UAObject, "options.conceptDescriptionOf is not an UAObject.");          
            
            const hasConceptDescriptionRefType = this.coreaas.findCoreAASReferenceType("HasConceptDescription")!;

            options.conceptDescriptionOf.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription });            
        }

        //Add EmbeddedDataSpecification
        if (options.hasEmbeddedDataSpecifications != null) {
            this._create_hasEmbeddedDataSpecifications(conceptDescription)(options.hasEmbeddedDataSpecifications);
        }

        conceptDescription.semanticOf = (elem: UAObject): ConceptDescriptionObject => {
            assert(elem instanceof UAObject, "elem is not a UAObject.");

            const hasSemanticRefType = this.coreaas.findCoreAASReferenceType("HasSemantic")!;
            elem.addReference({ referenceType: hasSemanticRefType, nodeId: conceptDescription });

            return conceptDescription;
        }

        conceptDescription.isCaseOf = (ref:RefArgument): ConceptDescriptionObject => {

            assert(ref instanceof Array || ref instanceof UAObject, "ref is neither a UAObject or an Array of Key.")

            if (ref instanceof Array) {

                ref.forEach(el => assert(isKey(el), "ref Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    isCaseOf: conceptDescription,
                    browseName: "Case_" + (<Key>ref[ref.length -1]).value,
                    keys: ref
                });
            } 
            else {
                assert((<AASReferenceObject>ref).keys != null, "assetRef is not an AASReferenceType instance.");

                conceptDescription.addReference({ referenceType: "HasComponent", nodeId: ref});
            } 

            return conceptDescription;
        };

        conceptDescription.hasEmbeddedDataSpecifications = this._create_hasEmbeddedDataSpecifications(conceptDescription);

        conceptDescription.conceptDescriptionOf = this.create_conceptDescriptionOf(conceptDescription);

        return conceptDescription;
    };

    private _create_hasEmbeddedDataSpecifications(conceptDes: ConceptDescriptionObject): (eds: EDSObject | EDSObject[]) => ConceptDescriptionObject {
        const coreaas = this.coreaas;
        return function (eds: EDSObject | EDSObject[]): ConceptDescriptionObject {
            let embedds: EDSObject[] = [];
            embedds = embedds.concat(embedds, eds)
            embedds.forEach((e) => {
                assert(e instanceof UAObject, "eds contains some element that is not UAObject.");
            });            
            const hasEmbeddedDataSpecificationRefType = coreaas.findCoreAASReferenceType("HasEmbeddedDataSpecification")!;

            embedds.forEach((e) => conceptDes.addReference({ referenceType: hasEmbeddedDataSpecificationRefType, nodeId: e }));
            return conceptDes;
        }
    }

    private create_conceptDescriptionOf(conceptDescription: ConceptDescriptionObject): (dict: ConceptDictionaryObject) => ConceptDescriptionObject {
        const coreaas = this.coreaas;
        return function(dict: ConceptDictionaryObject): ConceptDescriptionObject {
            assert(dict instanceof UAObject, "dict is not an UAObject.");                  
        
            const hasConceptDescriptionRefType = coreaas.findCoreAASReferenceType("HasConceptDescription")!;

            dict.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription }); 
            return conceptDescription;
        }
    }
}