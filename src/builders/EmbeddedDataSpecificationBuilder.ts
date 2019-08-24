import { AddressSpace, Namespace, NodeIdLike } from "node-opcua";
import { CoreAASExtension } from "../CoreAASExtension";
import { BaseUAObject } from "node-opcua-factory";
import { UAObject } from "node-opcua-address-space/dist/src/ua_object";
import assert = require("assert");
import { isKey, EDSObject, DataSpecificationIEC61360 } from "../types";
import { Builder } from "./builder";
import { DataSpecificationIECOptions, EmbeddedDataSpecificationOptions } from "../options_types";

export class EmbeddedDataSpecificationBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addEmbeddedDataSpecification(options: EmbeddedDataSpecificationOptions): EDSObject {
        options.hasDataSpecification.forEach(el => assert(isKey(el), "assetRef parameter contains an element that is not a Key."));

        const edsType = this.coreaas.findCoreAASObjectType("EmbeddedDataSpecificationType")!;
        const eds: EDSObject = this._namespace.addObject({
            typeDefinition: edsType,
            browseName: options.browseName,
            description: options.description,
            nodeId: options.nodeId
        }) as EDSObject;

        this.coreaas.addAASReference({
            componentOf: eds,
            browseName: "hasDataSpecification",
            keys: options.hasDataSpecification
        });

        if (options.dataSpecificationContent != null) { eds.addReference({ referenceType: "HasComponent", nodeId: options.dataSpecificationContent }); }

        if(options.embeddedDataSpecificationOf != null)
        {
            const parent = options.embeddedDataSpecificationOf;    
            const hasEmbeddedDataSpecificationType = this.coreaas.findCoreAASReferenceType("HasEmbeddedDataSpecification")!;
    
            parent.addReference({ referenceType: hasEmbeddedDataSpecificationType, nodeId: eds });
        }

        eds.addDataSpecificationIEC61360 = (options: DataSpecificationIEC61360 | DataSpecificationIECOptions) => {
            assert(!eds.hasOwnProperty("dataSpecificationContent"), "the EmbeddedDataSpecificationType Object already contains a Component with Browsename dataSpecificationContent");

            if (options instanceof UAObject) {
                assert(options.browseName.name === "dataSpecificationContent", "options parameter browsename is not 'dataSpecificationContent'.");
                eds.addReference({ referenceType: "HasComponent", nodeId: options });
            } else {
                const dataSpec = this.coreaas.addDataSpecificationIEC61360(options);
                eds.addReference({ referenceType: "HasComponent", nodeId: dataSpec });
            }
            return eds;
        }

        return eds;
    }
}