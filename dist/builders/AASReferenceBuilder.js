"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const types_1 = require("../types");
const builder_1 = require("./builder");
const node_opcua_1 = require("node-opcua");
class AASReferenceBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addAASReference(options) {
        options.keys.forEach(el => assert(types_1.isKey(el), "options.keys contains an element has not the internal structure of a Key"));
        const aasReferenceType = this.coreaas.getAASReferenceType();
        const aasReference = this._namespace.addObject({
            typeDefinition: aasReferenceType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId,
            componentOf: options.componentOf
        });
        const key = this._namespace.addVariable({
            propertyOf: aasReference,
            browseName: "keys",
            dataType: this.coreaas.findCoreAASDataType("Key"),
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.ExtensionObject,
                        arrayType: node_opcua_1.VariantArrayType.Array,
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
            const isCaseOfRefType = this.coreaas.findCoreAASReferenceType("IsCaseOf");
            parent.addReference({
                referenceType: isCaseOfRefType,
                nodeId: aasReference
            });
        }
        return aasReference;
    }
}
exports.AASReferenceBuilder = AASReferenceBuilder;
//# sourceMappingURL=AASReferenceBuilder.js.map