import { Builder } from "./builder";
import { CoreAASExtension } from "../CoreAASExtension";
import { ReferenceElementObject, isKey, AASFileObject, SubmodelElementCollectionObject, RangeObject, RelationshipElementObject, AnnotatedRelationshipElementObject, SubmodelElementObject, CapabilityObject, EntityObject } from "../types";
import { Variant, DataType, UAObject } from "node-opcua";
import assert = require("assert");
import { get_description_creator, get_modelingkind_creator, get_semanticId_creator, get_parent_creator, get_idShort_creator } from "./builder_utilities";
import { UAVariable } from "node-opcua-address-space/dist/src/ua_variable";
import { ReferenceElementOptions, FileOptions, SubmodelElementCollectionOptions, RangeOptions, RelationshipElementOptions, AnnotatedRelationshipElementOptions, CapabilityOptions, EntityOptions } from "../options_types";

export class SubmodelElementsBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addReferenceElement(options: ReferenceElementOptions): ReferenceElementObject {
        assert(options.idShort != null, "options.idShort parameter is missing.");

        const referenceElementType = this.coreaas.findCoreAASObjectType("ReferenceElementType")!;

        const referenceElement = this._namespace.addObject({
            typeDefinition: referenceElementType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as ReferenceElementObject;

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, referenceElement)(options.idShort);

        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {   
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");           
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: referenceElement });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, referenceElement);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = get_description_creator(this.coreaas, referenceElement);
            addDescriptionToReferenceElement(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, referenceElement)(options.kind);
        }

        if (options.value != null) {
            
            assert(!referenceElement.hasOwnProperty("value"), "the referenceElementType Object already contains a Component with BrowseName value");
            
            if (options.value instanceof Array) {

                options.value.forEach(el => assert(isKey(el), "options.value Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    componentOf: referenceElement,
                    browseName: "value",
                    keys: options.value
                });
            } 
            else {
                assert(options.value.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "value is not an AASReferenceType instance.");

                referenceElement.addReference({ referenceType: "HasComponent", nodeId: options.value});
            }
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, referenceElement)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, referenceElement)(options.parent);
        }

        referenceElement.addSemanticId = get_semanticId_creator(this.coreaas, referenceElement);
        referenceElement.addParent = get_parent_creator(this.coreaas, referenceElement);

        return referenceElement;
    }

    addRelationshipElement(options: RelationshipElementOptions): RelationshipElementObject {
        assert(options.idShort != null, "options.idShort parameter is missing.");

        const relationshipElementType = this.coreaas.findCoreAASObjectType("RelationshipElementType")!;

        const relationshipElement = this._namespace.addObject({
            typeDefinition: relationshipElementType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as RelationshipElementObject;

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, relationshipElement)(options.idShort);

        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {   
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");           
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: relationshipElement });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, relationshipElement);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = get_description_creator(this.coreaas, relationshipElement);
            addDescriptionToReferenceElement(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, relationshipElement)(options.kind);
        }

        if (options.first != null) {
            
            assert(!relationshipElement.hasOwnProperty("first"), "the relationshipElementType Object already contains a Component with BrowseName first");
            
            if (options.first instanceof Array) {

                options.first.forEach(el => assert(isKey(el), "options.first Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "first",
                    keys: options.first
                });
            } 
            else {
                assert(options.first.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "first is not an AASReferenceType instance.");

                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.first});
            }
        }

        if (options.second != null) {
            
            assert(!relationshipElement.hasOwnProperty("second"), "the relationshipElementType Object already contains a Component with BrowseName second");
            
            if (options.second instanceof Array) {

                options.second.forEach(el => assert(isKey(el), "options.second Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "second",
                    keys: options.second
                });
            } 
            else {
                assert(options.second.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "second is not an AASReferenceType instance.");

                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.second});
            }
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, relationshipElement)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, relationshipElement)(options.parent);
        }

        relationshipElement.addSemanticId = get_semanticId_creator(this.coreaas, relationshipElement);
        relationshipElement.addParent = get_parent_creator(this.coreaas, relationshipElement);

        return relationshipElement;
    }

    addAnnotatedRelationshipElement(options: AnnotatedRelationshipElementOptions): AnnotatedRelationshipElementObject {
        assert(options.idShort != null, "options.idShort parameter is missing.");

        const relationshipElementType = this.coreaas.findCoreAASObjectType("AnnotatedRelationshipElementType")!;

        const relationshipElement = this._namespace.addObject({
            typeDefinition: relationshipElementType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as AnnotatedRelationshipElementObject;

        relationshipElement.referableChildrenMap = new Map();

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, relationshipElement)(options.idShort);

        //Add annotations
        this._namespace.addObject({
            typeDefinition: this._addressSpace.findNode("FolderType")!.nodeId,
            browseName: "Annotations",
            componentOf: relationshipElement
        });

        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {   
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");           
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: relationshipElement });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, relationshipElement);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = get_description_creator(this.coreaas, relationshipElement);
            addDescriptionToReferenceElement(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, relationshipElement)(options.kind);
        }

        if (options.first != null) {
            
            assert(!relationshipElement.hasOwnProperty("first"), "the relationshipElementType Object already contains a Component with BrowseName first");
            
            if (options.first instanceof Array) {

                options.first.forEach(el => assert(isKey(el), "options.first Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "first",
                    keys: options.first
                });
            } 
            else {
                assert(options.first.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "first is not an AASReferenceType instance.");

                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.first});
            }
        }

        if (options.second != null) {
            
            assert(!relationshipElement.hasOwnProperty("second"), "the relationshipElementType Object already contains a Component with BrowseName second");
            
            if (options.second instanceof Array) {

                options.second.forEach(el => assert(isKey(el), "options.second Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "second",
                    keys: options.second
                });
            } 
            else {
                assert(options.second.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "second is not an AASReferenceType instance.");

                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.second});
            }
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, relationshipElement)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, relationshipElement)(options.parent);
        }

        relationshipElement.addSemanticId = get_semanticId_creator(this.coreaas, relationshipElement);
        relationshipElement.addParent = get_parent_creator(this.coreaas, relationshipElement);
        relationshipElement.addAnnotations = (elemArray:SubmodelElementObject[]): AnnotatedRelationshipElementObject => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");

            elemArray.forEach(el => {
                
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType")!;
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf

                const annotations = relationshipElement.annotations;
                annotations.addReference({ referenceType: "Organizes", nodeId: el });
                relationshipElement.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });

            return relationshipElement;
        }

        return relationshipElement;
    }

    addAASFile(options: FileOptions): AASFileObject {
        const fileType = this.coreaas.findCoreAASObjectType("FileType")!;

        const file = this._namespace.addObject({
            typeDefinition: fileType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as AASFileObject;

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, file)(options.idShort);

        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {   
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");           
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: file });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, file);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = get_description_creator(this.coreaas, file);
            addDescriptionToReferenceElement(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, file)(options.kind);
        }

        if (options.value != null) {
            assert(typeof options.value === "string", "options.value is not a string.");

            this._namespace.addVariable({
                propertyOf: file,
                browseName: "value",
                dataType: "String",
                value: {
                    get: function() {
                        return new Variant({
                            dataType: DataType.String, 
                            value: options.value
                        });
                    }
                }
            });
        }

        if (options.mimeType != null) {
            assert(typeof options.mimeType === "string", "options.mimeType is not a string.");

            this._namespace.addVariable({
                propertyOf: file,
                browseName: "mimeType",
                dataType: "String",
                value: {
                    get: function() {
                        return new Variant({
                            dataType: DataType.String, 
                            value: options.mimeType
                        });
                    }
                }
            });
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, file)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, file)(options.parent);
        }

        file.addSemanticId = get_semanticId_creator(this.coreaas, file);
        file.addParent = get_parent_creator(this.coreaas, file);

        return file;
    }

    addCapability(options: CapabilityOptions): CapabilityObject {
        assert(options.idShort, "options.idShort parameter is missing.");

        const capType = this.coreaas.findCoreAASObjectType("CapabilityType")!;

        const capability = this._namespace.addObject({
            typeDefinition: capType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as CapabilityObject;

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, capability)(options.idShort);

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: capability });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, capability);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = get_description_creator(this.coreaas, capability);
            addDescriptionToCollection(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, capability)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, capability)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, capability)(options.parent);
        }

        capability.addSemanticId = get_semanticId_creator(this.coreaas, capability);
        capability.addParent = get_parent_creator(this.coreaas, capability);

        return capability;
    }

    addEntity(options: EntityOptions): EntityObject {
        assert(options.idShort, "options.idShort parameter is missing.");

        const entityType = this.coreaas.findCoreAASObjectType("EntityType")!;

        const entity = this._namespace.addObject({
            typeDefinition: entityType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as EntityObject;

        entity.referableChildrenMap = new Map();

        const folderType = this._addressSpace.findNode("FolderType")!.nodeId;

        const statements = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "Statements",
            componentOf: entity
        });

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, entity)(options.idShort);

        //Add entityType
        this._namespace.addVariable({
            propertyOf: entity,
            browseName: "entityType",
            dataType: this.coreaas.findCoreAASDataType("EntityTypeEnumType")!,
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.Int32, 
                        value: options.entityType
                    });
                }
            }
        });

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: entity });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, entity);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = get_description_creator(this.coreaas, entity);
            addDescriptionToCollection(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, entity)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, entity)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, entity)(options.parent);
        }

        entity.addStatements = (elemArray: SubmodelElementObject[]): EntityObject => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");

            elemArray.forEach(el => {
                
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType")!;
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf

                const statements = entity.statements;
                statements.addReference({ referenceType: "Organizes", nodeId: el });
                entity.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });

            return entity;
        }

        entity.addSemanticId = get_semanticId_creator(this.coreaas, entity);
        entity.addParent = get_parent_creator(this.coreaas, entity);

        return entity;
    }

    addSubmodelElementCollection(options: SubmodelElementCollectionOptions): SubmodelElementCollectionObject {
        assert(options.idShort, "options.idShort parameter is missing.");

        const secType = this.coreaas.findCoreAASObjectType("SubmodelElementCollectionType")!;

        const collection = this._namespace.addObject({
            typeDefinition: secType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as SubmodelElementCollectionObject;

        collection._indexCounter = 0;
        collection.referableChildrenMap = new Map();

        const values = this._namespace.addObject({
            browseName: "values",
            componentOf: collection
        });

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, collection)(options.idShort);

        //Add ordered
        const ordered = this._namespace.addVariable({
            propertyOf: collection,
            browseName: "ordered",
            dataType: "Boolean",
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.Boolean, 
                        value: options.ordered || false
                    });
                }
            }
        });

        //Add allowDuplicates
        const allowDuplicates = this._namespace.addVariable({
            propertyOf: collection,
            browseName: "allowDuplicates",
            dataType: "Boolean",
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.Boolean, 
                        value: options.allowDuplicates || false
                    });
                }
            }
        });

        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: collection });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, collection);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = get_description_creator(this.coreaas, collection);
            addDescriptionToCollection(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, collection)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, collection)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, collection)(options.parent);
        }

        collection.addElements = (elemArray: SubmodelElementObject[]): SubmodelElementCollectionObject => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");
            elemArray.forEach(el => {
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType")!;
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf

                let referenceType = "HasComponent";
                if (collection.ordered._dataValue.value.value) {
                    referenceType = "HasOrderedComponent";

                    let currentIndex = collection._indexCounter;

                    collection._indexCounter++;
                }

                collection.values.addReference({ referenceType: referenceType, nodeId: el });
                collection.referableChildrenMap.set((<UAObject & {idShort: UAVariable}>el).idShort._dataValue.value.value, el);
            });

            return collection;
        }

        collection.addSemanticId = get_semanticId_creator(this.coreaas, collection);
        collection.addParent = get_parent_creator(this.coreaas, collection);

        return collection;
    }

    addRange(options: RangeOptions): RangeObject {
        const fileType = this.coreaas.findCoreAASObjectType("RangeType")!;

        const range = this._namespace.addObject({
            typeDefinition: fileType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as RangeObject;

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, range)(options.idShort);

        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {   
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");           
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: range });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, range);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = get_description_creator(this.coreaas, range);
            addDescriptionToReferenceElement(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_modelingkind_creator(this.coreaas, range)(options.kind);
        }

        if (options.valueType != null) {
            let valueType = options.valueType;

            this._namespace.addVariable({
                propertyOf: range,
                browseName: "valueType",
                dataType: this.coreaas.findCoreAASDataType("PropertyValueType")!,
                value: {
                    get: () => {
                        return new Variant({ dataType: DataType.Int32, value: valueType });
                    }
                }
            });
        }

        //Add Min
        if (options.min != null) {
            this._namespace.addVariable({
                propertyOf: range,
                browseName: "min",
                dataType: options.min.dataType,
                value: options.min.value
            });
        }

        //Add Max
        if (options.max != null) {
            this._namespace.addVariable({
                propertyOf: range,
                browseName: "max",
                dataType: options.max.dataType,
                value: options.max.value
            });
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, range)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, range)(options.parent);
        }

        range.addSemanticId = get_semanticId_creator(this.coreaas, range);
        range.addParent = get_parent_creator(this.coreaas, range);

        return range;
    }
}