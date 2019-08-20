import { AddressSpace, Namespace } from "node-opcua";
import { CoreAASExtension } from "../CoreAASExtension";

export abstract class Builder {
    protected _addressSpace: AddressSpace;
    protected _namespace: Namespace;

    constructor(protected coreaas: CoreAASExtension) {
        this._addressSpace = coreaas.addressSpace;
        this._namespace = coreaas.namespace;
    }
}

export * from "./AASBuilder";
export * from "./AASReferenceBuilder";
export * from "./AdministrativeInformationBuilder";
export * from "./AssetBuilder";
export * from "./DataSpecificationIEC61360Builder";
export * from "./EmbeddedDataSpecificationBuilder";
export * from "./ConceptDescriptionBuilder"
export * from "./ConceptDictionaryBuilder";
export * from "./SubmodelBuilder"
export * from "./SubmodelPropertyBuilder";
export * from "./SubmodelElementsBuilder";
export * from "./ViewBuilder";