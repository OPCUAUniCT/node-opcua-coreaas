"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const node_opcua_1 = require("node-opcua");
const assert = require("assert");
function get_identification_creator(coreaas, identifiable) {
    return function (identification) {
        return coreaas.namespace.addVariable({
            propertyOf: identifiable,
            browseName: "identification",
            dataType: coreaas.findCoreAASDataType("Identifier"),
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.ExtensionObject,
                        value: identification
                    });
                }
            }
        });
    };
}
exports.get_identification_creator = get_identification_creator;
function get_idShort_creator(coreaas, referableObj) {
    return function (idShort) {
        return coreaas.namespace.addVariable({
            propertyOf: referableObj,
            browseName: "idShort",
            dataType: "String",
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.String,
                        value: idShort
                    });
                }
            }
        });
    };
}
exports.get_idShort_creator = get_idShort_creator;
function get_description_creator(coreaas, describedObj) {
    return function (description) {
        let localizedTextArray = [];
        if (typeof description === "string") {
            localizedTextArray.push(new node_opcua_1.LocalizedText({ text: description }));
        }
        else if (description instanceof node_opcua_1.LocalizedText) {
            localizedTextArray.push(description);
        }
        else {
            description.forEach(el => assert(el instanceof node_opcua_1.LocalizedText, "An element of the array is not a LocalizedText."));
            localizedTextArray = description;
        }
        const desc = coreaas.namespace.addVariable({
            propertyOf: describedObj,
            browseName: "description",
            dataType: "LocalizedText",
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.LocalizedText,
                        arrayType: node_opcua_1.VariantArrayType.Array,
                        value: localizedTextArray
                    });
                }
            },
            valueRank: 1
        });
        return desc;
    };
}
exports.get_description_creator = get_description_creator;
function get_kind_creator(coreaas, hasKindObj) {
    return function (kind) {
        return coreaas.namespace.addVariable({
            propertyOf: hasKindObj,
            browseName: "kind",
            dataType: coreaas.findCoreAASDataType("Kind"),
            value: {
                get: () => {
                    return new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.Int32, value: kind });
                }
            }
        });
    };
}
exports.get_kind_creator = get_kind_creator;
function get_category_creator(coreaas, referableObj) {
    return function (category) {
        return coreaas.namespace.addVariable({
            propertyOf: referableObj,
            browseName: "category",
            dataType: coreaas.findCoreAASDataType("PropertyCategory"),
            value: {
                get: () => {
                    return new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.Int32, value: category });
                }
            }
        });
    };
}
exports.get_category_creator = get_category_creator;
function get_semanticId_creator(coreaas, obj) {
    return function (semanticId) {
        assert(!semanticId.hasOwnProperty("semanticId"), "the " + obj.browseName + " Object already contains a Component with BrowseName semanticId");
        if (semanticId instanceof Array) {
            semanticId.forEach(el => assert(types_1.isKey(el), "semanticId Array contains an element that is not a Key."));
            coreaas.addAASReference({
                componentOf: obj,
                browseName: "semanticId",
                keys: semanticId
            });
        }
        else {
            assert(semanticId.typeDefinitionObj.isSupertypeOf(coreaas.getAASReferenceType()), "semanticId is not an AASReferenceType instance.");
            obj.addReference({ referenceType: "HasComponent", nodeId: semanticId });
        }
        return obj;
    };
}
exports.get_semanticId_creator = get_semanticId_creator;
function get_parent_creator(coreaas, obj) {
    return function (parent) {
        assert(!parent.hasOwnProperty("parent"), "the " + obj.browseName + " Object already contains a Component with BrowseName parent");
        if (parent instanceof Array) {
            parent.forEach(el => assert(types_1.isKey(el), "parent Array contains an element that is not a Key."));
            coreaas.addAASReference({
                componentOf: obj,
                browseName: "parent",
                keys: parent
            });
        }
        else {
            assert(parent.typeDefinitionObj.isSupertypeOf(coreaas.getAASReferenceType()), "parent is not an AASReferenceType instance.");
            obj.addReference({ referenceType: "HasComponent", nodeId: parent });
        }
        return obj;
    };
}
exports.get_parent_creator = get_parent_creator;
//# sourceMappingURL=builder_utilities.js.map