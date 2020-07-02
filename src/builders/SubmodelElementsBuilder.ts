import { Builder } from "./builder";
import { CoreAASExtension } from "../CoreAASExtension";
import { ReferenceElementObject, isKey, AASFileObject, SubmodelElementCollectionObject, SubmodelRelationshipElementObject, SubmodelOperationObject } from "../types";
import { Variant, DataType, UAObject } from "node-opcua";
import assert = require("assert");
import { get_description_creator, get_kind_creator, get_semanticId_creator, get_parent_creator, get_idShort_creator } from "./builder_utilities";
import { UAVariable } from "node-opcua-address-space/dist/src/ua_variable";
import { ReferenceElementOptions, FileOptions, SubmodelElementCollectionOptions, SubmodelRelationshipElementOptions, SubmodelOperationOptions } from "../options_types";

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
            get_kind_creator(this.coreaas, referenceElement)(options.kind);
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
            get_kind_creator(this.coreaas, file)(options.kind);
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

        const folderType = this._addressSpace.findNode("FolderType")!.nodeId;

        const values = this._namespace.addObject({
            typeDefinition: folderType,
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
            get_kind_creator(this.coreaas, collection)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, collection)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, collection)(options.parent);
        }

        collection.addElements = (elemArray: UAObject[]): SubmodelElementCollectionObject => {
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

    addSubmodelRelationshipElement(options: SubmodelRelationshipElementOptions): SubmodelRelationshipElementObject {
        assert(options.idShort, "options.idShort parameter is missing.");

        const secType = this.coreaas.findCoreAASObjectType("RelationshipElementType")!;

        const relationship = this._namespace.addObject({
            typeDefinition: secType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as SubmodelRelationshipElementObject;

        //Add first relationship
        assert(options.first.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASReferenceType()), "first is not an AASReferenceType instance.");
        relationship.addReference({ referenceType: "HasComponent", nodeId: options.first});

        //Add second relationship
        assert(options.second.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASReferenceType()), "second is not an AASReferenceType instance.");
        relationship.addReference({ referenceType: "HasComponent", nodeId: options.second});

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, relationship)(options.idShort);

        //Add this Submodel RelationshipElement to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: relationship });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, relationship);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = get_description_creator(this.coreaas, relationship);
            addDescriptionToCollection(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_kind_creator(this.coreaas, relationship)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, relationship)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, relationship)(options.parent);
        }

        relationship.addSemanticId = get_semanticId_creator(this.coreaas, relationship);
        //relationship.addParent = get_parent_creator(this.coreaas, relationship);

        return relationship;
    }

    // TODO: add "act" UaMethod
    addSubmodelOperation(options: SubmodelOperationOptions): SubmodelOperationObject {
        assert(options.idShort, "options.idShort parameter is missing.");

        const secType = this.coreaas.findCoreAASObjectType("SubmodelOperationType")!;

        const operation = this._namespace.addObject({
            typeDefinition: secType,
            browseName:    options.browseName || options.idShort,
            nodeId:        options.nodeId
        }) as SubmodelOperationObject;

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, operation)(options.idShort);

        //Add this Submodel Operation to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");
        
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: operation });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, operation);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = get_description_creator(this.coreaas, operation);
            addDescriptionToCollection(options.description);
        }

        //Add kind
        if (options.kind != null) {
            get_kind_creator(this.coreaas, operation)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, operation)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, operation)(options.parent);
        }

        operation.addSemanticId = get_semanticId_creator(this.coreaas, operation);
        //operation.addParent = get_parent_creator(this.coreaas, operation);

        return operation;
    }
}