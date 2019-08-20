"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            builder_utilities_1.get_kind_creator(this.coreaas, referenceElement)(options.kind);
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
            builder_utilities_1.get_kind_creator(this.coreaas, file)(options.kind);
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
        const folderType = this._addressSpace.findNode("FolderType").nodeId;
        const values = this._namespace.addObject({
            typeDefinition: folderType,
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
            builder_utilities_1.get_kind_creator(this.coreaas, collection)(options.kind);
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
                    let index = this._namespace.addVariable({
                        browseName: "index",
                        propertyOf: el,
                        dataType: "UInt32",
                        value: {
                            get: () => new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.UInt32, value: currentIndex })
                        }
                    });
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
}
exports.SubmodelElementsBuilder = SubmodelElementsBuilder;
//# sourceMappingURL=SubmodelElementsBuilder.js.map