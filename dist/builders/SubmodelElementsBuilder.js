"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmodelElementsBuilder = void 0;
const builder_1 = require("./builder");
const types_1 = require("../types");
const node_opcua_1 = require("node-opcua");
const assert = require("assert");
const builder_utilities_1 = require("./builder_utilities");
class SubmodelElementsBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addReferenceElement(options) {
        assert(options.idShort != null, "options.idShort parameter is missing.");
        const referenceElementType = this.coreaas.findCoreAASObjectType("ReferenceElementType");
        const referenceElement = this._namespace.addObject({
            typeDefinition: referenceElementType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, referenceElement)(options.idShort);
        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: referenceElement });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, referenceElement);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = builder_utilities_1.get_description_creator(this.coreaas, referenceElement);
            addDescriptionToReferenceElement(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, referenceElement)(options.kind);
        }
        if (options.value != null) {
            assert(!referenceElement.hasOwnProperty("value"), "the referenceElementType Object already contains a Component with BrowseName value");
            if (options.value instanceof Array) {
                options.value.forEach(el => assert(types_1.isKey(el), "options.value Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    componentOf: referenceElement,
                    browseName: "value",
                    keys: options.value
                });
            }
            else {
                assert(options.value.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "value is not an AASReferenceType instance.");
                referenceElement.addReference({ referenceType: "HasComponent", nodeId: options.value });
            }
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, referenceElement)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, referenceElement)(options.parent);
        }
        referenceElement.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, referenceElement);
        referenceElement.addParent = builder_utilities_1.get_parent_creator(this.coreaas, referenceElement);
        return referenceElement;
    }
    addRelationshipElement(options) {
        assert(options.idShort != null, "options.idShort parameter is missing.");
        const relationshipElementType = this.coreaas.findCoreAASObjectType("RelationshipElementType");
        const relationshipElement = this._namespace.addObject({
            typeDefinition: relationshipElementType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, relationshipElement)(options.idShort);
        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: relationshipElement });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, relationshipElement);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = builder_utilities_1.get_description_creator(this.coreaas, relationshipElement);
            addDescriptionToReferenceElement(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, relationshipElement)(options.kind);
        }
        if (options.first != null) {
            assert(!relationshipElement.hasOwnProperty("first"), "the relationshipElementType Object already contains a Component with BrowseName first");
            if (options.first instanceof Array) {
                options.first.forEach(el => assert(types_1.isKey(el), "options.first Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "first",
                    keys: options.first
                });
            }
            else {
                assert(options.first.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "first is not an AASReferenceType instance.");
                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.first });
            }
        }
        if (options.second != null) {
            assert(!relationshipElement.hasOwnProperty("second"), "the relationshipElementType Object already contains a Component with BrowseName second");
            if (options.second instanceof Array) {
                options.second.forEach(el => assert(types_1.isKey(el), "options.second Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "second",
                    keys: options.second
                });
            }
            else {
                assert(options.second.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "second is not an AASReferenceType instance.");
                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.second });
            }
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, relationshipElement)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, relationshipElement)(options.parent);
        }
        relationshipElement.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, relationshipElement);
        relationshipElement.addParent = builder_utilities_1.get_parent_creator(this.coreaas, relationshipElement);
        return relationshipElement;
    }
    addAnnotatedRelationshipElement(options) {
        assert(options.idShort != null, "options.idShort parameter is missing.");
        const relationshipElementType = this.coreaas.findCoreAASObjectType("AnnotatedRelationshipElementType");
        const relationshipElement = this._namespace.addObject({
            typeDefinition: relationshipElementType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        relationshipElement.referableChildrenMap = new Map();
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, relationshipElement)(options.idShort);
        //Add annotations
        this._namespace.addObject({
            typeDefinition: this._addressSpace.findNode("FolderType").nodeId,
            browseName: "Annotations",
            componentOf: relationshipElement
        });
        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: relationshipElement });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, relationshipElement);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = builder_utilities_1.get_description_creator(this.coreaas, relationshipElement);
            addDescriptionToReferenceElement(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, relationshipElement)(options.kind);
        }
        if (options.first != null) {
            assert(!relationshipElement.hasOwnProperty("first"), "the relationshipElementType Object already contains a Component with BrowseName first");
            if (options.first instanceof Array) {
                options.first.forEach(el => assert(types_1.isKey(el), "options.first Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "first",
                    keys: options.first
                });
            }
            else {
                assert(options.first.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "first is not an AASReferenceType instance.");
                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.first });
            }
        }
        if (options.second != null) {
            assert(!relationshipElement.hasOwnProperty("second"), "the relationshipElementType Object already contains a Component with BrowseName second");
            if (options.second instanceof Array) {
                options.second.forEach(el => assert(types_1.isKey(el), "options.second Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    componentOf: relationshipElement,
                    browseName: "second",
                    keys: options.second
                });
            }
            else {
                assert(options.second.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "second is not an AASReferenceType instance.");
                relationshipElement.addReference({ referenceType: "HasComponent", nodeId: options.second });
            }
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, relationshipElement)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, relationshipElement)(options.parent);
        }
        relationshipElement.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, relationshipElement);
        relationshipElement.addParent = builder_utilities_1.get_parent_creator(this.coreaas, relationshipElement);
        relationshipElement.addAnnotations = (elemArray) => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");
            elemArray.forEach(el => {
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType");
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf
                const annotations = relationshipElement.annotations;
                annotations.addReference({ referenceType: "Organizes", nodeId: el });
                relationshipElement.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });
            return relationshipElement;
        };
        return relationshipElement;
    }
    addAASFile(options) {
        const fileType = this.coreaas.findCoreAASObjectType("FileType");
        const file = this._namespace.addObject({
            typeDefinition: fileType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, file)(options.idShort);
        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: file });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, file);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = builder_utilities_1.get_description_creator(this.coreaas, file);
            addDescriptionToReferenceElement(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, file)(options.kind);
        }
        if (options.value != null) {
            assert(typeof options.value === "string", "options.value is not a string.");
            this._namespace.addVariable({
                propertyOf: file,
                browseName: "value",
                dataType: "String",
                value: {
                    get: function () {
                        return new node_opcua_1.Variant({
                            dataType: node_opcua_1.DataType.String,
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
                    get: function () {
                        return new node_opcua_1.Variant({
                            dataType: node_opcua_1.DataType.String,
                            value: options.mimeType
                        });
                    }
                }
            });
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, file)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, file)(options.parent);
        }
        file.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, file);
        file.addParent = builder_utilities_1.get_parent_creator(this.coreaas, file);
        return file;
    }
    addCapability(options) {
        assert(options.idShort, "options.idShort parameter is missing.");
        const capType = this.coreaas.findCoreAASObjectType("CapabilityType");
        const capability = this._namespace.addObject({
            typeDefinition: capType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, capability)(options.idShort);
        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: capability });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, capability);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = builder_utilities_1.get_description_creator(this.coreaas, capability);
            addDescriptionToCollection(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, capability)(options.kind);
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, capability)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, capability)(options.parent);
        }
        capability.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, capability);
        capability.addParent = builder_utilities_1.get_parent_creator(this.coreaas, capability);
        return capability;
    }
    addEntity(options) {
        assert(options.idShort, "options.idShort parameter is missing.");
        const entityType = this.coreaas.findCoreAASObjectType("EntityType");
        const entity = this._namespace.addObject({
            typeDefinition: entityType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        entity.referableChildrenMap = new Map();
        const folderType = this._addressSpace.findNode("FolderType").nodeId;
        const statements = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "Statements",
            componentOf: entity
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, entity)(options.idShort);
        //Add entityType
        this._namespace.addVariable({
            propertyOf: entity,
            browseName: "entityType",
            dataType: this.coreaas.findCoreAASDataType("EntityTypeEnumType"),
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.Int32,
                        value: options.entityType
                    });
                }
            }
        });
        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: entity });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, entity);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = builder_utilities_1.get_description_creator(this.coreaas, entity);
            addDescriptionToCollection(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, entity)(options.kind);
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, entity)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, entity)(options.parent);
        }
        entity.addStatements = (elemArray) => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");
            elemArray.forEach(el => {
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType");
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf
                const statements = entity.statements;
                statements.addReference({ referenceType: "Organizes", nodeId: el });
                entity.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });
            return entity;
        };
        entity.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, entity);
        entity.addParent = builder_utilities_1.get_parent_creator(this.coreaas, entity);
        return entity;
    }
    addSubmodelElementCollection(options) {
        assert(options.idShort, "options.idShort parameter is missing.");
        const secType = this.coreaas.findCoreAASObjectType("SubmodelElementCollectionType");
        const collection = this._namespace.addObject({
            typeDefinition: secType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        collection._indexCounter = 0;
        collection.referableChildrenMap = new Map();
        const values = this._namespace.addObject({
            browseName: "values",
            componentOf: collection
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, collection)(options.idShort);
        //Add ordered
        const ordered = this._namespace.addVariable({
            propertyOf: collection,
            browseName: "ordered",
            dataType: "Boolean",
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.Boolean,
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
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.Boolean,
                        value: options.allowDuplicates || false
                    });
                }
            }
        });
        //Add this Submodel Property to a Submodel
        if (typeof options.submodelElementOf !== "undefined") {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: collection });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, collection);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToCollection = builder_utilities_1.get_description_creator(this.coreaas, collection);
            addDescriptionToCollection(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, collection)(options.kind);
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, collection)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, collection)(options.parent);
        }
        collection.addElements = (elemArray) => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");
            elemArray.forEach(el => {
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType");
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf
                let referenceType = "HasComponent";
                if (collection.ordered._dataValue.value.value) {
                    referenceType = "HasOrderedComponent";
                    let currentIndex = collection._indexCounter;
                    collection._indexCounter++;
                }
                collection.values.addReference({ referenceType: referenceType, nodeId: el });
                collection.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });
            return collection;
        };
        collection.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, collection);
        collection.addParent = builder_utilities_1.get_parent_creator(this.coreaas, collection);
        return collection;
    }
    addRange(options) {
        const fileType = this.coreaas.findCoreAASObjectType("RangeType");
        const range = this._namespace.addObject({
            typeDefinition: fileType,
            browseName: options.browseName || options.idShort,
            nodeId: options.nodeId
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, range)(options.idShort);
        //Add this Submodel Reference to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: range });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, range);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToReferenceElement = builder_utilities_1.get_description_creator(this.coreaas, range);
            addDescriptionToReferenceElement(options.description);
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_modelingkind_creator(this.coreaas, range)(options.kind);
        }
        if (options.valueType != null) {
            let valueType = options.valueType;
            this._namespace.addVariable({
                propertyOf: range,
                browseName: "valueType",
                dataType: this.coreaas.findCoreAASDataType("PropertyValueType"),
                value: {
                    get: () => {
                        return new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.Int32, value: valueType });
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
            builder_utilities_1.get_semanticId_creator(this.coreaas, range)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, range)(options.parent);
        }
        range.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, range);
        range.addParent = builder_utilities_1.get_parent_creator(this.coreaas, range);
        return range;
    }
}
exports.SubmodelElementsBuilder = SubmodelElementsBuilder;
//# sourceMappingURL=SubmodelElementsBuilder.js.map