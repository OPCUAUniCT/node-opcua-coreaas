import { LocalizedText, ObjectsFolder, Folder, UAObject, NodeIdLike } from "node-opcua";
import { DataTypeIEC61360Type, IdentifierType, KeyElements } from "./CoreAAS_enums";
import { BaseUAObject } from "node-opcua-factory";
import { UAVariable } from "node-opcua-address-space/dist/src/ua_variable";
import { DataSpecificationIECOptions } from "./options_types";

/**
 * An Interface for the Objects Folder under the Root Folder of an OPC UA
 * Server supporting the CoreAAS Information Model.
 */
export interface CoreAASObjectsFolder extends ObjectsFolder {
    assetAdministrationShells: Folder,
    assets: Folder,
    conceptDescriptions: Folder,
    submodels: Folder
}

export type Description = string | LocalizedText | Array<LocalizedText>;

export type RefArgument = AASReferenceObject | Key[];

/** An interface for all the identifiers of Itentifiable entities. */
export interface Identifier extends BaseUAObject  {
    /** The identifier of an entity. */
    id: string,
    /** The kind of identifier contained in [[id]]. */
    idType: IdentifierType
}

/**An interface for the keys composing the property [[AASReferenceType.keys]] of an AAS Reference. */
export interface Key extends BaseUAObject {
    /** The kind of Key. */
    idType: IdentifierType,
    /** A flag specifying whether the entity referred by this Key is local to the current AAS or not. */
    local: boolean,
    /** The kind of entity referred by this Key. */
    type: KeyElements,
    /** The identifier of the entity referred by this key. */
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

export interface ReferableNamespaceObject {
    referableChildrenMap: Map<string, UAObject>;
}

/* 
    Types for CoreAAS ObjectTypes 
*/

/* AASREFERENCE TYPE */
export interface AASReferenceObject extends UAObject {
    keys: UAVariable;
}

/* ASSET TYPE */
export interface AssetObject extends UAObject, ReferableNamespaceObject {
    identification: UAVariable;
    idShort: UAVariable;
    administration?: UAObject;
    kind?: UAVariable;

    addAssetIdentificationModelRef(model: UAObject | Key[]): UAObject;
    addBillOfMaterialRef(model: UAObject | Key[]): UAObject;
}

/* AAS TYPE */
export interface AASObject extends UAObject, ReferableNamespaceObject {
    submodels: Folder;
    conceptDictionaries: Folder;
    views: Folder;
    identification: UAVariable;
    administration?: UAObject;

    hasAsset(asset: AssetObject): AASObject;
    isDerivedFrom(der_aas: AASObject): AASObject;

    hasSubmodel(submodel: SubmodelObject): AASObject;
    addSubmodelRef(model: RefArgument): AASObject;
    addDerivedFromRef(model: RefArgument): AASObject;
    addAssetRef(model: RefArgument): AASObject;
    addConceptDictionary(dict: ConceptDictionaryObject): AASObject;
    addViews(views: ViewObject[]): AASObject;
}

/* ADMINISTRATIVE INFORMATION TYPE */
export interface AdministrativeInformationObject extends UAObject {
    version?: UAVariable;
    revision?: UAVariable;
}

/* DS61360 TYPE */
export type DataSpecificationIEC61360 = UAObject & {
    identifier?: string;
    preferredName?: string;
    definition?: string;
    dataType?: DataTypeIEC61360Type;
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
export interface EDSObject extends UAObject {
    hasDataSpecification: Key[];
    dataSpecificationContent?: UAObject;

    addDataSpecificationIEC61360(options: DataSpecificationIEC61360 | DataSpecificationIECOptions): EDSObject;
}

/* SUBMODEL TYPE */
export interface SubmodelObject extends UAObject, ReferableNamespaceObject {
    submodelElements: Folder;
    identification: UAVariable;
    administration?: UAObject;
    idShort: UAVariable;
    kind?: UAVariable;
    semanticId?: AASReferenceObject;

    hasSubmodelSemantic(semanticElem: SubmodelObject): SubmodelObject;
    hasSemantic(semanticElem: UAObject): SubmodelObject;
    addSemanticId(semanticId: RefArgument): SubmodelObject;
    submodelOf(aas: AASObject): SubmodelObject;
    addParent(parent: RefArgument): SubmodelObject;
    addElements(elemArray: SubmodelElementObject[]): SubmodelObject;
}

/* SUBMODEL ELEMENT TYPE */
export interface SubmodelElementObject extends UAObject {
    idShort: UAVariable;
    kind?: UAVariable;
    semanticId?: AASReferenceObject;
}

/* SUBMODEL PROPERTY TYPE */
export interface SubmodelPropertyObject extends SubmodelElementObject {
    category?: UAVariable;
    valueId?: AASReferenceObject;
    value?: UAVariable;
    valueType?: UAVariable;

    addSemanticId(semanticId: RefArgument): SubmodelPropertyObject;
    hasSemantic(semanticElem: ConceptDescriptionObject): SubmodelPropertyObject;
    addParent(parent: RefArgument): SubmodelPropertyObject; 
    addValueId(valueId: RefArgument): SubmodelPropertyObject;
}

/* CONCEPT DESCRIPTION TYPE */
export interface ConceptDescriptionObject extends UAObject {
    identification: UAVariable;
    administration?: UAObject;

    semanticOf(elem: UAObject): ConceptDescriptionObject;
    isCaseOf(ref: RefArgument): ConceptDescriptionObject;
    hasEmbeddedDataSpecifications(eds: EDSObject | EDSObject[]): ConceptDescriptionObject;
    conceptDescriptionOf(dict: ConceptDictionaryObject): ConceptDescriptionObject;
}

/* CONCEPT DICTIONARY TYPE */
export interface ConceptDictionaryObject extends UAObject {
    idShort: UAVariable;
    conceptDescriptions: Folder;

    hasConceptDescriptions(conceptDescriptions: ConceptDescriptionObject | ConceptDescriptionObject[]): ConceptDictionaryObject;
    addParent(parent: RefArgument): ConceptDictionaryObject;
    addConceptDescriptionRef(conceptDescriptionRef: RefArgument): ConceptDictionaryObject;
}

/* REFERENCE ELEMENT TYPE */
export interface ReferenceElementObject extends SubmodelElementObject {
    value?: AASReferenceObject;

    addSemanticId(semanticId: RefArgument): ReferenceElementObject;
    addParent(parent: RefArgument): ReferenceElementObject; 
}

/* RELATIONSHIP ELEMENT TYPE */
export interface RelationshipElementObject extends SubmodelElementObject {
    first: AASReferenceObject;
    second: AASReferenceObject;

    addSemanticId(semanticId: RefArgument): ReferenceElementObject;
    addParent(parent: RefArgument): ReferenceElementObject; 
}

/* ANNOTATED RELATIONSHIP ELEMENT TYPE */
export interface AnnotatedRelationshipElementObject extends SubmodelElementObject, ReferableNamespaceObject {
    annotations: Folder;
    first: AASReferenceObject;
    second: AASReferenceObject;

    addSemanticId(semanticId: RefArgument): ReferenceElementObject;
    addParent(parent: RefArgument): ReferenceElementObject;
    addAnnotations(elemArray: SubmodelElementObject[]): ReferenceElementObject;
}

/* AAS FILE TYPE */
export interface AASFileObject extends SubmodelElementObject {
    value?: UAVariable;
    mimeType?: UAVariable;

    addSemanticId(semanticId: RefArgument): AASFileObject;
    addParent(parent: RefArgument): AASFileObject; 
}

/* RANGE TYPE */
export interface RangeObject extends SubmodelElementObject {
    valueType: UAVariable;
    min?: UAVariable;
    max?: UAVariable;

    addSemanticId(semanticId: RefArgument): RangeObject;
    addParent(parent: RefArgument): RangeObject; 
}

/* CAPABILITY TYPE */
export interface CapabilityObject extends SubmodelElementObject {
    addSemanticId(semanticId: RefArgument): SubmodelElementObject;
    addParent(parent: RefArgument): SubmodelElementObject; 
}

/* SUBMODEL ELEMENT COLLECTION TYPE */
export interface SubmodelElementCollectionObject extends SubmodelElementObject, ReferableNamespaceObject {
    _indexCounter: number;
    ordered: UAVariable;
    allowDuplicates: UAVariable;
    values: Folder;

    addElements(elemArray: SubmodelElementObject[]): SubmodelElementCollectionObject;
    addSemanticId(semanticId: RefArgument): SubmodelElementCollectionObject;
    addParent(parent: RefArgument): SubmodelElementCollectionObject; 
}

/* ENTITY TYPE */
export interface EntityObject extends SubmodelElementObject, ReferableNamespaceObject {
    asset: AASReferenceObject;
    entityType: UAVariable;
    statements: Folder;

    addSemanticId(semanticId: RefArgument): EntityObject;
    addParent(parent: RefArgument): EntityObject;
    addStatements(statements: SubmodelElementObject[]): EntityObject;
}

/* VIEW TYPE */
export interface ViewObject extends UAObject, ReferableNamespaceObject {
    containedElements: Folder;
    idShort: UAVariable;
    semanticId?: AASReferenceObject;

    addContainedElementRef(elemRef: RefArgument): ViewObject;
    containsElements(elements: UAObject[] | UAObject): ViewObject;
    addSemanticId(semanticId: RefArgument): ViewObject;
    addParent(parent: RefArgument): ViewObject; 
}