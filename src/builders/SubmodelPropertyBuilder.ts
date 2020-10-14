import { UAObject, Variant, DataType } from "node-opcua";
import { CoreAASExtension } from "../CoreAASExtension";
import { Builder } from "./builder";
import { RefArgument, SubmodelPropertyObject, isKey, SubmodelObject } from "../types";
import assert = require("assert");
import { get_description_creator, get_modelingkind_creator, get_category_creator, get_semanticId_creator, get_parent_creator } from "./builder_utilities";
import { SubmodelPropertyOptions } from "../options_types";

export class SubmodelPropertyBuilder extends Builder  {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addSubmodelProperty(options: SubmodelPropertyOptions): SubmodelPropertyObject {
        const submodelPropertyType = this.coreaas.findCoreAASObjectType("SubmodelPropertyType")!;

        const property: SubmodelPropertyObject = this._namespace.addObject({
            typeDefinition: submodelPropertyType,
            browseName:    options.browseName || "Property_" + options.idShort,
            nodeId:        options.nodeId
        }) as SubmodelPropertyObject;

        //Add this Submodel Property to a Submodel
        if (options.submodelElementOf != null) {
            assert(options.submodelElementOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "options.submodelElementOf is not a SubmodelType.");
            
            const submodelElements = (<SubmodelObject>options.submodelElementOf).submodelElements;
            submodelElements.addReference({ referenceType: "Organizes", nodeId: property });
            options.submodelElementOf.referableChildrenMap.set(options.idShort, property);
        }

        //Add idShort
        const idShort = this._namespace.addVariable({
            propertyOf: property,
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

        //Add description
        if (options.description != null) {
            const addDescriptionToProperty = get_description_creator(this.coreaas, property);
            addDescriptionToProperty(options.description);
        }

        //Add kind
        if(options.kind != null) {
            const addKindToProperty = get_modelingkind_creator(this.coreaas, property);
            addKindToProperty(options.kind);
        }

        //Add Category
        if(options.category != null) {
            const addCategoryToProperty = get_category_creator(this.coreaas, property);
            addCategoryToProperty(options.category);
        }
        //Add semantic id
        if (options.semanticId != null) {
            get_semanticId_creator<SubmodelPropertyObject>(this.coreaas, property)(options.semanticId);
        }

        //Add Parent
        if (options.parent != null) {
            get_parent_creator<SubmodelPropertyObject>(this.coreaas, property)(options.parent);
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
                dataType: this.coreaas.findCoreAASDataType("PropertyValueType")!,
                value: {
                    get: () => {
                        return new Variant({ dataType: DataType.Int32, value: valueType });
                    }
                }
            });
        }

        property.addSemanticId = get_semanticId_creator<SubmodelPropertyObject>(this.coreaas, property);

        property.hasSemantic = (function(coreaas: CoreAASExtension): (semanticElem: UAObject) => SubmodelPropertyObject {
            const hasSemanticRefType = coreaas.findCoreAASReferenceType("HasSemantic")!;

            return function(semanticElem: UAObject): SubmodelPropertyObject {
                property.addReference({ referenceType: hasSemanticRefType, nodeId: semanticElem });
                return property;
            }

        })(this.coreaas)

        property.addParent = get_parent_creator<SubmodelPropertyObject>(this.coreaas, property);

        property.addValueId = this._create_valueId(property);

        return property;
    }

    private _create_valueId(obj: SubmodelPropertyObject): (valueId: RefArgument) => SubmodelPropertyObject {
        let coreaas = this.coreaas;
    
        return function(valueId: RefArgument): SubmodelPropertyObject {
            assert(!valueId.hasOwnProperty("valueId"), "the " + obj.browseName + " Object already contains a Component with BrowseName valueId");
    
            if (valueId instanceof Array) {
    
                valueId.forEach(el => assert(isKey(el), "valueId Array contains an element that is not a Key."));
    
                coreaas.addAASReference({
                    componentOf: obj,
                    browseName: "valueId",
                    keys: valueId
                });
            } 
            else {
                assert(valueId.typeDefinitionObj.isSupertypeOf(coreaas.getAASReferenceType()), "valueId is not an AASReferenceType instance.");
    
                obj.addReference({ referenceType: "HasComponent", nodeId: valueId});
            }
    
            return obj;
        }
    }
}