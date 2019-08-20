import { LocalizedText, ObjectsFolder, Folder, UAObject, NodeIdLike } from "node-opcua";
import { IdentifierType, KeyElements } from "./CoreAAS_enums";
import { BaseUAObject } from "node-opcua-factory";
import { UAVariable } from "node-opcua-address-space/dist/src/ua_variable";
import { DataSpecificationIECOptions } from "./options_types";

export interface CoreAASObjectsFolder extends ObjectsFolder {
    assetAdministrationShells: Folder,
    assets: Folder,
    conceptDescriptions: Folder,
    submodels: Folder
}

export type Description = string | LocalizedText | Array<LocalizedText>;

export type RefArgument = UAObject | BaseUAObject[];

export type Identifier = BaseUAObject & {
    id: string,
    idType: IdentifierType
}

export type Key = BaseUAObject & {
    idType: IdentifierType,
    local: boolean,
    type: KeyElements,
    value: string
}

export function isIdentifier(id: BaseUAObject): boolean {
    return ("idType" in id && typeof (<any>id).idType === "number" ) && ("id" in id && typeof (<any>id).id === "string"); 
}

export function isKey(key: BaseUAObject): boolean {
    return  ("idType" in key && typeof (<any>key).idType === "number" ) && 
            ("local" in key && typeof (<any>key).local === "boolean") && 
            ("type" in key && typeof (<any>key).type === "number") && 
            ("value" in key && typeof (<any>key).value === "string");
}

/* 
    Types for CoreAAS ObjectTypes 
*/

/* AASREFERENCE TYPE */
export interface ConvenientAASReference {
    keys: UAVariable;
}

export type AASReferenceObject = UAObject & ConvenientAASReference;

/* ASSET TYPE */
export interface ConvenientAsset {
    referableChildrenMap: Map<string, UAObject>;

    addAssetIdentificationModelRef(model: UAObject | BaseUAObject[]): UAObject
}
export type AssetObject = UAObject & ConvenientAsset;

/* AAS TYPE */
export interface ConvenientAAS {
    submodels: Folder;
    conceptDictionaries: Folder;
    views: Folder;
    referableChildrenMap: Map<string, UAObject>;

    hasAsset(asset: AssetObject): AASObject;
    isDerivedFrom(der_aas: AASObject): AASObject;

    hasSubmodel(submodel: SubmodelObject): AASObject;
    addSubmodelRef(model: RefArgument): AASObject;
    addDerivedFromRef(model: RefArgument): AASObject;
    addAssetRef(model: RefArgument): AASObject;
    addConceptDictionary(dict: ConceptDictionaryObject): AASObject;
    addViews(views: ViewObject[]): AASObject;
}
export type AASObject = UAObject & ConvenientAAS;

/* ADMINISTRATIVE INFORMATION TYPE */
export interface ConventientAdministrativeInformation {
    version?: UAVariable;
    revision?: UAVariable;
}
export type AdministrativeInformationObject = UAObject & ConventientAdministrativeInformation;

/* DS61360 TYPE */
export type DataSpecificationIEC61360 = UAObject & {
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

/* EMBEDDED DATA SPECIFICATION TYPE */
export interface ConvenientEDS {
    addDataSpecificationIEC61360(options: DataSpecificationIEC61360 | DataSpecificationIECOptions): EDSObject;
}
export type EDSObject = UAObject & ConvenientEDS;

/* SUBMODEL TYPE */
export interface ConvenientSubmodel {
    submodelElements: Folder;
    referableChildrenMap: Map<string, UAObject>;

    hasSubmodelSemantic(semanticElem: SubmodelObject): SubmodelObject;
    hasSemantic(semanticElem: UAObject): SubmodelObject;
    addSemanticId(semanticId: RefArgument): SubmodelObject;
    submodelOf(aas: AASObject): SubmodelObject;
    addParent(parent: RefArgument): SubmodelObject;
    addElements(elemArray: SubmodelElementObject[]): SubmodelObject;
}
export type SubmodelObject = UAObject & ConvenientSubmodel;

/* SUBMODEL PROPERTY TYPE */
export interface ConvenientSubmodelElement {
    idShort: UAVariable;

}
export type SubmodelElementObject = UAObject & ConvenientSubmodelElement

/* SUBMODEL PROPERTY TYPE */
export interface ConvenientSubmodelProperty {
    addSemanticId(semanticId: RefArgument): SubmodelPropertyObject;
    hasSemantic(semanticElem: ConceptDescriptionObject): SubmodelPropertyObject;
    addParent(parent: RefArgument): SubmodelPropertyObject; 
    addValueId(valueId: RefArgument): SubmodelPropertyObject;
}
export type SubmodelPropertyObject = UAObject & ConvenientSubmodelProperty & SubmodelElementObject;

/* CONCEPT DESCRIPTION TYPE */
export interface ConvenientConceptDescription {
    semanticOf(elem: UAObject): ConceptDescriptionObject;
    isCaseOf(ref: RefArgument): ConceptDescriptionObject;
    hasEmbeddedDataSpecifications(eds: EDSObject | EDSObject[]): ConceptDescriptionObject;
    conceptDescriptionOf(dict: ConceptDictionaryObject): ConceptDescriptionObject;
}

export type ConceptDescriptionObject = UAObject & ConvenientConceptDescription;

/* CONCEPT DICTIONARY TYPE */
export interface ConvenientConceptDictionary {
    idShort: UAVariable;
    conceptDescriptions: Folder;

    hasConceptDescriptions(conceptDescriptions: ConceptDescriptionObject | ConceptDescriptionObject[]): ConceptDictionaryObject;
    addParent(parent: UAObject): ConceptDictionaryObject;
    addConceptDescriptionRef(conceptDescriptionRef: RefArgument): ConceptDictionaryObject;
}

export type ConceptDictionaryObject = UAObject & ConvenientConceptDictionary;

/* REFERENCE ELEMENT TYPE */
export interface ConvenientReferenceElement {
    addSemanticId(semanticId: RefArgument): ReferenceElementObject;
    addParent(parent: RefArgument): ReferenceElementObject; 
}

export type ReferenceElementObject = UAObject & ConvenientReferenceElement;

/* AAS FILE TYPE */
export interface ConvenientFile {
    addSemanticId(semanticId: RefArgument): ReferenceElementObject;
    addParent(parent: RefArgument): ReferenceElementObject; 
}

export type AASFileObject = UAObject & ConvenientFile;

/* SUBMODEL ELEMENT COLLECTION TYPE */
export interface ConvenientSubmodelElementCollection {
    _indexCounter: number;
    referableChildrenMap: Map<string, UAObject>;
    ordered: UAVariable;
    allowDuplicates: UAVariable;
    values: Folder;

    addElements(elemArray: UAObject[]): SubmodelElementCollectionObject;
    addSemanticId(semanticId: RefArgument): SubmodelElementCollectionObject;
    addParent(parent: RefArgument): SubmodelElementCollectionObject; 
}

export type SubmodelElementCollectionObject = UAObject & ConvenientSubmodelElementCollection;

/* VIEW TYPE */
export interface ConvenientView {
    referableChildrenMap: Map<string, UAObject>;
    containedElements: Folder;
    idShort: UAVariable;

    addContainedElementRef(elemRef: RefArgument): ViewObject;
    containsElements(elements: UAObject[] | UAObject): ViewObject;
    addSemanticId(semanticId: RefArgument): ViewObject;
    addParent(parent: RefArgument): ViewObject; 
}

export type ViewObject = UAObject & ConvenientView;