import { AddressSpace, Namespace, UAObject, NodeIdLike, LocalizedText, Variant, DataType, VariantArrayType } from "node-opcua";
import { CoreAASExtension } from "../CoreAASExtension";
import { BaseUAObject } from "node-opcua-factory";
import assert = require("assert");
import { isKey, AASReferenceObject } from "../types";
import { Builder } from "./builder";

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

export interface AASReferenceOptions {
    browseName: string,
    keys: BaseUAObject[],
    description?: string | LocalizedText,
    nodeId?: NodeIdLike,
    componentOf?: UAObject,
    organizedBy?: UAObject,
    isCaseOf?: UAObject
}