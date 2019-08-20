import { BaseUAObject } from "node-opcua-factory";
import { Description, RefArgument, ConceptDictionaryObject, EDSObject, AdministrativeInformationObject, AASObject, SubmodelObject } from "./types";
import { NodeIdLike, UAObject, LocalizedText, UADataType, BindVariableOptions } from "node-opcua";
import { Kind, PropertyCategory, PropertyValueType } from "./CoreAAS_enums";

export interface AASOptions {
    identification: BaseUAObject;
    description?: Description,
    nodeId?: NodeIdLike,
    browseName?: string,
    assetRef?: RefArgument,
    derivedFromRef?: RefArgument,
    administration?: UAObject
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

export interface AdministrativeInformationOptions {
    componentOf?: UAObject;
    description?: string | LocalizedText,
    nodeId?: NodeIdLike,
    browseName?: string,
    version?: string,
    revision?: string
}

export interface AssetOptions {
    identification: BaseUAObject;
    idShort: string,
    description?: Description,
    nodeId?: NodeIdLike,
    browseName?: string,
    assetOf?: UAObject,
    administration?: UAObject,
    kind?: Kind,
    assetIdentificationModelRef?: RefArgument
}

export interface ConceptDescriptionOptions {
    identification: BaseUAObject;
    nodeId?: NodeIdLike;
    browseName?: string;
    conceptDescriptionOf?: ConceptDictionaryObject;
    hasEmbeddedDataSpecifications?: EDSObject | EDSObject[];
    administration?: AdministrativeInformationObject;
    description?: Description;
}

export interface ConceptDictionaryOptions {
    browseName: string;
    idShort: string;
    nodeId?: NodeIdLike;
    conceptDictionaryOf?: AASObject;
    parent?: RefArgument;
    description?: Description;
}

export type DataSpecificationIECOptions = {
    identifier?: string;
    preferredName?: string;
    definition?: string;
    dataType?: string;
    unit?: string;
    unitId?: RefArgument;
    iecCategory?: string;
    iecLanguageCode?: string;
    note?: string;
    shortName?: string;
    valueFormat?: string;
    version?: string;
    revision?: string;
    browseName?: string;
    description?: string;
    nodeId?: NodeIdLike;  
}

export type EmbeddedDataSpecificationOptions = {
    browseName: string;
    hasDataSpecification: BaseUAObject[],
    dataSpecificationContent?: UAObject;
    embeddedDataSpecificationOf?: UAObject;
    description?: string;
    nodeId?: NodeIdLike;
}

export interface SubmodelOptions {
    identification: BaseUAObject;
    idShort: string;
    description?: Description,
    nodeId?: NodeIdLike,
    browseName?: string,
    administration?: UAObject;
    semanticId?: RefArgument;
    parent?: RefArgument;
    kind?: Kind 
}

export interface ReferenceElementOptions {
    idShort: string;
    semanticId?: RefArgument;
    parent?: RefArgument;
    kind?: Kind;
    submodelElementOf?: SubmodelObject;
    value?: RefArgument;
    description?: Description;
    browseName?: string;
    nodeId?: NodeIdLike;
}

export interface FileOptions {
    idShort: string;
    semanticId?: RefArgument;
    parent?: RefArgument;
    kind?: Kind;
    submodelElementOf?: SubmodelObject;
    description?: Description;
    value?: string;
    mimeType?: string;
    browseName?: string;
    nodeId?: NodeIdLike;
}

export interface SubmodelElementCollectionOptions {
    idShort: string;
    semanticId?: RefArgument;
    parent?: RefArgument;
    kind?: Kind;
    submodelElementOf?: SubmodelObject;
    description?: Description;
    ordered?: boolean;
    allowDuplicates?: boolean;
    browseName?: string;
    nodeId?: NodeIdLike;
}

export interface SubmodelPropertyOptions {
    idShort: string;
    nodeId?: NodeIdLike;
    browseName?: string;
    submodelElementOf?: SubmodelObject
    semanticId?: RefArgument;
    parent?: RefArgument;
    description?: Description;
    category?: PropertyCategory;
    kind?: Kind;
    valueId?: RefArgument;
    value?: SPValue;
    valueType?: PropertyValueType;
}

export type SPValue = {
    dataType?: string | NodeIdLike | UADataType;
    value?: BindVariableOptions;
    valueType?: PropertyValueType;
}

export interface ViewOptions {
    idShort: string;
    semanticId?: RefArgument;
    parent?: RefArgument;
    description?: Description;
    viewOf?: AASObject;
    browseName?: string;
    nodeId?: NodeIdLike;
}