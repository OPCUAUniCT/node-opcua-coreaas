import { CoreAASExtension } from "../CoreAASExtension";
import assert = require("assert");
import { isKey, AASReferenceObject } from "../types";
import { Builder } from "./builder";
import { AASReferenceOptions } from "../options_types";
import { Variant, DataType, VariantArrayType } from "node-opcua";

export class AASReferenceBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addAASReference(options: AASReferenceOptions): AASReferenceObject {

        options.keys.forEach(el => assert(isKey(el), "options.keys contains an element has not the internal structure of a Key"));
        
        const aasReferenceType = this.coreaas.getAASReferenceType();

        const aasReference: AASReferenceObject = this._namespace.addObject({
            typeDefinition: aasReferenceType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId,
            componentOf: options.componentOf
        }) as AASReferenceObject;

        const key = this._namespace.addVariable({
            propertyOf: aasReference,
            browseName: "keys",
            dataType: this.coreaas.findCoreAASDataType("Key")!,
            value: {
                get: function() {
                    return new Variant({
                        dataType: DataType.ExtensionObject,
                        arrayType: VariantArrayType.Array, 
                        value: options.keys
                    });
                }
            },
            valueRank: 1
        });

        if (options.organizedBy != null) {
            const organizingParent = options.organizedBy;

            organizingParent.addReference({
                referenceType: "Organizes",
                nodeId: aasReference
            });
        }

        if (options.isCaseOf != null) {
            const parent = options.isCaseOf;
            const isCaseOfRefType = this.coreaas.findCoreAASReferenceType("IsCaseOf")!;

            parent.addReference({
                referenceType: isCaseOfRefType,
                nodeId: aasReference
            });
        }

        return aasReference;
    }
}