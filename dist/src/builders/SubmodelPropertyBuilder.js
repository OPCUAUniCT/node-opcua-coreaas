"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
const builder_1 = require("./builder");
const types_1 = require("../types");
const assert = require("assert");
const builder_utilities_1 = require("./builder_utilities");
class SubmodelPropertyBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addSubmodelProperty(options) {
        const submodelPropertyType = this.coreaas.findCoreAASObjectType("SubmodelPropertyType");
        const property = this._namespace.addObject({
            typeDefinition: submodelPropertyType,
            browseName: options.browseName || "Property_" + options.idShort,
            nodeId: options.nodeId
        });
        //Add this Submodel Property to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")), "options.submodelElementOf is not a SubmodelType.");
            const submodelElements = options.submodelElementOf.submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: property });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, property);
        }
        //Add idShort
        const idShort = this._namespace.addVariable({
            propertyOf: property,
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
        //Add description
        if (options.description != null) {
            const addDescriptionToProperty = builder_utilities_1.get_description_creator(this.coreaas, property);
            addDescriptionToProperty(options.description);
        }
        //Add kind
        if (options.kind != null) {
            const addKindToProperty = builder_utilities_1.get_kind_creator(this.coreaas, property);
            addKindToProperty(options.kind);
        }
        //Add Category
        if (options.category != null) {
            const addCategoryToProperty = builder_utilities_1.get_category_creator(this.coreaas, property);
            addCategoryToProperty(options.category);
        }
        //Add semantic id
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, property)(options.semanticId);
        }
        //Add Parent
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, property)(options.parent);
        }
        //Add valueId
        if (options.valueId != null) {
            this._create_valueId(property)(options.valueId);
        }
        //Add Value
        if (options.value != null) {
            this._namespace.addVariable({
                propertyOf: property,
                browseName: "value",
                dataType: options.value.dataType,
                value: options.value.value
            });
        }
        //Add ValueType
        if (options.valueType != null) {
            let valueType = options.valueType;
            this._namespace.addVariable({
                propertyOf: property,
                browseName: "valueType",
                dataType: this.coreaas.findCoreAASDataType("PropertyValueType"),
                value: {
                    get: () => {
                        return new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.Int32, value: valueType });
                    }
                }
            });
        }
        property.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, property);
        property.hasSemantic = (function (coreaas) {
            const hasSemanticRefType = coreaas.findCoreAASReferenceType("HasSemantic");
            return function (semanticElem) {
                property.addReference({ referenceType: hasSemanticRefType, nodeId: semanticElem });
                return property;
            };
        })(this.coreaas);
        property.addParent = builder_utilities_1.get_parent_creator(this.coreaas, property);
        property.addValueId = this._create_valueId(property);
        return property;
    }
    _create_valueId(obj) {
        let coreaas = this.coreaas;
        return function (valueId) {
            assert(!valueId.hasOwnProperty("valueId"), "the " + obj.browseName + " Object already contains a Component with BrowseName valueId");
            if (valueId instanceof Array) {
                valueId.forEach(el => assert(types_1.isKey(el), "valueId Array contains an element that is not a Key."));
                coreaas.addAASReference({
                    componentOf: obj,
                    browseName: "valueId",
                    keys: valueId
                });
            }
            else {
                assert(valueId.typeDefinitionObj.isSupertypeOf(coreaas.getAASReferenceType()), "valueId is not an AASReferenceType instance.");
                obj.addReference({ referenceType: "HasComponent", nodeId: valueId });
            }
            return obj;
        };
    }
}
exports.SubmodelPropertyBuilder = SubmodelPropertyBuilder;
//# sourceMappingURL=SubmodelPropertyBuilder.js.map