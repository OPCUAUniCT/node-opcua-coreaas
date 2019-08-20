"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ua_object_1 = require("node-opcua-address-space/dist/src/ua_object");
const assert = require("assert");
const types_1 = require("../types");
const builder_1 = require("./builder");
class EmbeddedDataSpecificationBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addEmbeddedDataSpecification(options) {
        options.hasDataSpecification.forEach(el => assert(types_1.isKey(el), "assetRef parameter contains an element that is not a Key."));
        const edsType = this.coreaas.findCoreAASObjectType("EmbeddedDataSpecificationType");
        const eds = this._namespace.addObject({
            typeDefinition: edsType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId
        });
        this.coreaas.addAASReference({
            componentOf: eds,
            browseName: "hasDataSpecification",
            keys: options.hasDataSpecification
        });
        if (options.dataSpecificationContent != null) {
            eds.addReference({ referenceType: "HasComponent", nodeId: options.dataSpecificationContent });
        }
        if (options.embeddedDataSpecificationOf != null) {
            const parent = options.embeddedDataSpecificationOf;
            const hasEmbeddedDataSpecificationType = this.coreaas.findCoreAASReferenceType("HasEmbeddedDataSpecification");
            parent.addReference({ referenceType: hasEmbeddedDataSpecificationType, nodeId: eds });
        }
        eds.addDataSpecificationIEC61360 = (options) => {
            assert(!eds.hasOwnProperty("dataSpecificationContent"), "the EmbeddedDataSpecificationType Object already contains a Component with Browsename dataSpecificationContent");
            if (options instanceof ua_object_1.UAObject) {
                assert(options.browseName.name === "dataSpecificationContent", "options parameter browsename is not 'dataSpecificationContent'.");
                eds.addReference({ referenceType: "HasComponent", nodeId: options });
            }
            else {
                const dataSpec = this.coreaas.addDataSpecificationIEC61360(options);
                eds.addReference({ referenceType: "HasComponent", nodeId: dataSpec });
            }
            return eds;
        };
        return eds;
    }
}
exports.EmbeddedDataSpecificationBuilder = EmbeddedDataSpecificationBuilder;
//# sourceMappingURL=EmbeddedDataSpecificationBuilder.js.map