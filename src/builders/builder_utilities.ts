import { Description, RefArgument, isKey, Identifier } from "../types";
import { CoreAASExtension } from "../CoreAASExtension";
import { LocalizedText, Variant, DataType, VariantArrayType, UAObject, UAVariable } from "node-opcua";
import assert = require("assert");
import { Kind, PropertyCategory } from "../CoreAAS_enums";
import { BaseUAObject } from "node-opcua-factory";

export function get_identification_creator(coreaas: CoreAASExtension, identifiable: UAObject): (identification: Identifier) => UAVariable {
    
    return function(identification: Identifier): UAVariable {
        return coreaas.namespace.addVariable({
            propertyOf: identifiable,
            browseName: "identification",
            dataType: coreaas.findCoreAASDataType("Identifier")!,
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.ExtensionObject, 
                        value: identification
                    });
                }
            }
        });
    } 
}

export function get_idShort_creator(coreaas: CoreAASExtension, referableObj: UAObject): (idShort: string) => UAVariable {

    return function (idShort: string): UAVariable {
        return coreaas.namespace.addVariable({
            propertyOf: referableObj,
            browseName: "idShort",
            dataType: "String",
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.String, 
                        value: idShort
                    });
                }
            }
        });
    }
}

export function get_description_creator(coreaas: CoreAASExtension, describedObj: UAObject): (description: Description) => UAVariable {
    
    return function(description: Description): UAVariable {

        let localizedTextArray: LocalizedText[] = [];

        if(typeof description === "string") {
            localizedTextArray.push(new LocalizedText({ text: description }));
        } else if(description instanceof LocalizedText) {
            localizedTextArray.push(description);
        } else {
            description.forEach(el => assert(el instanceof LocalizedText, "An element of the array is not a LocalizedText."));
            localizedTextArray = description;
        }

        const desc = coreaas.namespace.addVariable({
            propertyOf: describedObj,
            browseName: "description",
            dataType: "LocalizedText",
            value: {
                get: function() {
                    return new Variant({ 
                        dataType: DataType.LocalizedText, 
                        arrayType: VariantArrayType.Array,
                        value: localizedTextArray
                    });
                }
            },
            valueRank: 1
        });

        return desc;
    }
}

export function get_kind_creator(coreaas: CoreAASExtension, hasKindObj: UAObject): (kind: Kind) => UAVariable {

    return function(kind: Kind): UAVariable {
        return coreaas.namespace.addVariable({
            propertyOf: hasKindObj,
            browseName: "kind",
            dataType: coreaas.findCoreAASDataType("Kind")!,
            value: {
                get: () => {
                    return new Variant({ dataType: DataType.Int32, value: kind });
                }
            }
        });
    }
}

export function get_category_creator(coreaas: CoreAASExtension, referableObj: UAObject): (category: PropertyCategory) => UAVariable {
    return function(category: PropertyCategory): UAVariable {
        return coreaas.namespace.addVariable({
            propertyOf: referableObj,
            browseName: "category",
            dataType: coreaas.findCoreAASDataType("PropertyCategory")!,
            value: {
                get: () => {
                    return new Variant({ dataType: DataType.Int32, value: category });
                }
            }
        });
    }
}

export function get_semanticId_creator<T extends UAObject>(coreaas: CoreAASExtension, obj: T): (semanticId: RefArgument) => T {
    
    return function(semanticId: RefArgument): T {
        assert(!semanticId.hasOwnProperty("semanticId"), "the " + obj.browseName + " Object already contains a Component with BrowseName semanticId");

        if (semanticId instanceof Array) {

            semanticId.forEach(el => assert(isKey(el), "semanticId Array contains an element that is not a Key."));

            coreaas.addAASReference({
                componentOf: obj,
                browseName: "semanticId",
                keys: semanticId
            });
        } 
        else {
            assert(semanticId.typeDefinitionObj.isSupertypeOf(coreaas.getAASReferenceType()), "semanticId is not an AASReferenceType instance.");

            obj.addReference({ referenceType: "HasComponent", nodeId: semanticId});
        }

        return obj;
    }
}

export function get_parent_creator<T extends UAObject>(coreaas: CoreAASExtension, obj: T): (parent: RefArgument) => T {
    
    return function(parent: RefArgument): T {
        assert(!parent.hasOwnProperty("parent"), "the " + obj.browseName + " Object already contains a Component with BrowseName parent");

        if (parent instanceof Array) {

            parent.forEach(el => assert(isKey(el), "parent Array contains an element that is not a Key."));

            coreaas.addAASReference({
                componentOf: obj,
                browseName: "parent",
                keys: parent
            });
        } 
        else {
            assert(parent.typeDefinitionObj.isSupertypeOf(coreaas.getAASReferenceType()), "parent is not an AASReferenceType instance.");

            obj.addReference({ referenceType: "HasComponent", nodeId: parent});
        }

        return obj;
    }
}

