import { BaseUAObject } from "node-opcua-factory";
import { Description, RefArgument, ConceptDictionaryObject, EDSObject, AdministrativeInformationObject, AASObject, SubmodelObject, Identifier, Key, ConceptDescriptionObject } from "./types";
import { NodeIdLike, UAObject, LocalizedText, UADataType, BindVariableOptions } from "node-opcua";
import { AssetKind, DataTypeIEC61360Type, EntityTypeEnumType, ModelingKind, PropertyCategory, PropertyValueType } from "./CoreAAS_enums";

/**
 * An object containing all the parameters for the creation of an instance of the AASType ObjectType.
 * 
 * example:
 * ```typescript
 *  {
 *      browseName: "SampleAAS",
 *      description: [  new LocalizedText({locale: "en", text: "Festo Controller"}),
 *                      new LocalizedText({locale: "de", text: "Festo Controller"}) ],
 *      identification: new Identifier({
 *          id: "www.admin-shell.io/aas-sample/1.0",
 *          idType: IdentifierType.URI
 *      }),
 *      assetRef: [new Key({
 *          idType: KeyType.URI,
 *          local: true,
 *          type: KeyElements.Asset,
 *          value: "http://pk.festo.com/3S7PLFDRS35"
 *      })],
 *      derivedFromRef: [ new Key({
 *          idType: KeyType.IRDI,
 *          local: false,
 *          type: KeyElements.AssetAdministrationShell,
 *           value: "AAA#1234-454#123456789"
 *       }) ],
 *     administration: admin
 *  }
 * ```
 */
export interface AASOptions {
    /** The Identifier for the Asset Administration Shell to be created. The Constructor can be obtained from the property [[CoreServer.coreaas]]. */
    identification: Identifier;
    /** A description of the Asset Administration Shell. */
    description?: Description,
    /** The node id for the created Object. */
    nodeId?: NodeIdLike,
    /** The browsename for the created Object. */
    browseName?: string,
    /** 
     * An AAS Reference to the Asset represented by the created AAS. This parameter can be
     * a [[AASReferenceObject]] or an array of [[Key]] creating a path to the pointed Asset.
     * */
    assetRef?: RefArgument,
    /** An AAS Reference to another AAS the created AAS is derived from. */
    derivedFromRef?: RefArgument,
    /** The administrative information of the current AAS. */
    administration?: AdministrativeInformationObject
}

/**
 * An object containing all the parameters for the creation of an instance of the AASReferenceType ObjectType.
 * 
 * example:
 * ```typescript
 *  {
 *      organizedBy: folderObj,
 *      browseName: "MyRef",
 *      keys: [ new Key({
 *          idType: KeyType.IRDI,
 *          local: false,
 *          type: KeyElements.GlobalReference,
 *          value: "0173-1#05-AAA650#002"
 *      }) ]
 *  }
 * ```
 */
export interface AASReferenceOptions {
    /** The browsename for the created Object. */
    browseName: string,
    /** An Array of [[Key]] composing the path to the entity pointed by the created AAS Reference. */
    keys: Key[],
    /** A description of the Asset Administration Shell. */
    description?: string | LocalizedText,
    /** The node id for the created Object. */
    nodeId?: NodeIdLike,
    /** The Object this AASReference will be connected to by means of HasComponent Reference. */
    componentOf?: UAObject,
    /** The Object this AASReference will be connected to by means of Organizes Reference. */
    organizedBy?: UAObject,
    /** The Object this AASReference will be connected to by means of IsCaseOf Reference. */
    isCaseOf?: ConceptDescriptionObject
}

/** An object containing all the parameters for the creation of an instance of the AdministrativeInformationType ObjectType.  */
export interface AdministrativeInformationOptions {
    /** The Object this AdministrativeInformation Object will be connected to by means of Organizes Reference. */
    componentOf?: UAObject;
    /** A description of the AdministrativeInformation Object. */
    description?: string | LocalizedText,
    /** The node id for the created Object. */
    nodeId?: NodeIdLike,
    /** The browsename for the created Object. */
    browseName?: string,
    /** The version of the entity this Administrative Information is relevant to. */
    version?: string,
    /** The revision of the entity this Administrative Information is relevant to. */
    revision?: string
}

/** An object containing all the parameters for the creation of an instance of the AssetType ObjectType.  */
export interface AssetOptions {
    /** The Identifier for the Asset to be created. The Constructor can be obtained from the property [[CoreServer.coreaas]]. */
    identification: Identifier;
    /** The short identifier of the Asset. */
    idShort: string,
    /** A description of the Asset. */
    description?: Description,
    /** The node id for the created Object. */
    nodeId?: NodeIdLike,
    /** The browsename for the created Object. */
    browseName?: string,
    /** 
     * The AssetAdministrationShell object representing the Asset to be created. The AAS will
     * be connected to this Asset by means of an HasAsset Reference. */
    assetOf?: AASObject,
    /** An AdministrativeInformation Object containing information relevant to this Asset. */
    administration?: AdministrativeInformationObject,
    /** Specifies if the Asset to be created should be an asset type or an asset instance. */
    kind?: AssetKind,
    /** An AAS Reference to a Submodel entity relevant to the Asset Identification. */
    assetIdentificationModelRef?: RefArgument
    /** An AAS Reference to a Submodel entity relevant to the Asset bill of material. */
    billOfMaterialRef?: RefArgument
}

/** An object containing all the parameters for the creation of an instance of the ConceptDescriptionType ObjectType.  */
export interface ConceptDescriptionOptions {
    /** The Identifier for the Asset to be created. The Constructor can be obtained from the property [[CoreServer.coreaas]]. */
    identification: Identifier;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
    /** The browsename for the created Object. */
    browseName?: string;
    /** 
     * A ConceptDictionaryType instance containing the ConceptDescription to be created. A HasConceptDescription Reference
     * connect the ConceptDicitonary to the ConceptDescription.  */
    conceptDescriptionOf?: ConceptDictionaryObject;
    /** One or more instances of EmbeddeddataSpecificatrionType for the Concept Dictionary to be created. */
    hasEmbeddedDataSpecifications?: EDSObject | EDSObject[];
    /** An AdministrativeInformation Object containing information relevant to this ConceptDescription. */
    administration?: AdministrativeInformationObject;
    /** A description of the Concept Description. */
    description?: Description;
}

/** An object containing all the parameters for the creation of an instance of the ConceptDictionary ObjectType.  */
export interface ConceptDictionaryOptions {
    /** The browsename for the created Object. */
    browseName: string;
    /** The short identifier of the Concept Dictionary. */
    idShort: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
    /** The AAS owning this Concept Dicitonary. */
    conceptDictionaryOf?: AASObject;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** A description of the Concept Dictionary. */
    description?: Description;
}

/** 
 * An object containing all the parameters for the creation of an instance of the DataSpecificationIEC61360Type ObjectType.
 * All the parameters refers to the standard IEC 61360 and eCl@ss and are not defined in the document "Details of the Asset Administration Shell"  */
export interface DataSpecificationIECOptions {
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

/** An object containing all the parameters for the creation of an instance of the EmbeddedDataSpecification ObjectType.  */
export interface EmbeddedDataSpecificationOptions {
    /** The browsename for the created Object. */
    browseName: string;
    /** An Array of [[Key]] composing a path to the DataSpecification embedded in the EmbeddedDataSpecification. */
    hasDataSpecification: Key[],
    /** 
     * An Object whose ObjectType is mandated by the DataSpecification pointed by [[hasDataSpecification]].  
     * Such Object features all additional Properties coming from the selected DataSpecification with respective actual values. */
    dataSpecificationContent?: UAObject;
    /** The Object containing this EmbeddedDataSpecification by means of "HasEmbeddedDataSpecification" Refernce. */
    embeddedDataSpecificationOf?: UAObject;
    /** A description of the Concept Dictionary. */
    description?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the SubmodelType ObjectType.  */
export interface SubmodelOptions {
    /** The Identifier for the Submodel to be created. The Constructor can be obtained from the property [[CoreServer.coreaas]]. */
    identification: Identifier;
    /** The short identifier of the Submodel. */
    idShort: string;
    /** A description of the Concept Dictionary. */
    description?: Description,
    /** The node id for the created Object. */
    nodeId?: NodeIdLike,
    /** The browsename for the created Object. */
    browseName?: string,
    /** An AdministrativeInformation Object containing information relevant to this Submodel. */
    administration?: UAObject;
    /** An AAS Reference pointing to an entity defining the semantics for this Submodel. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the Submodel to be created should be a submodel type or a submodel instance. */
    kind?: ModelingKind 
}

/** An object containing all the parameters for the creation of an instance of the ReferenceElementType ObjectType.  */
export interface ReferenceElementOptions {
    /** The short identifier of the ReferenceElement. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this ReferenceElement. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the ReferenceElement to be created should be a type or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** An AASReference or an Array of [[Keys]]. */
    value?: RefArgument;
    /** A description of the ReferenceElement. */
    description?: Description;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the RelationshipElementType ObjectType.  */
export interface RelationshipElementOptions {
    /** The short identifier of the RelationshipElement. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this RelationshipElement. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the RelationshipElement to be created should be a type or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** An AASReference or an Array of [[Keys]]. */
    first: RefArgument;
    /** An AASReference or an Array of [[Keys]]. */
    second: RefArgument;
    /** A description of the RelationshipElement. */
    description?: Description;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the AnnotatedRelationshipElementType ObjectType.  */
export interface AnnotatedRelationshipElementOptions {
    /** The short identifier of the RelationshipElement. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this AnnotatedRelationshipElement. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the AnnotatedRelationshipElement to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** An AASReference or an Array of [[Keys]]. */
    first: RefArgument;
    /** An AASReference or an Array of [[Keys]]. */
    second: RefArgument;
    /** A description of the AnnotatedRelationshipElement. */
    description?: Description;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the FileType ObjectType.  */
export interface FileOptions {
    /** The short identifier of the ReferenceElement. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this File. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the File to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** A description of the File. */
    description?: Description;
    /** The path to the file pointed by this Object. */
    value?: string;
    /** The Mime Type of the file. */
    mimeType?: string;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the RangeType ObjectType.  */
export interface RangeOptions {
    /** The short identifier of the ReferenceElement. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this Range. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the Range to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** A description of the File. */
    description?: Description;
    /** The type of the value of this Range. */
    valueType: PropertyValueType;
    /** The minimum value of the Range in terms of SPValue type. */
    min?: SPValue;
    /** The maximum value of the Range in terms of SPValue type. */
    max?: SPValue;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the SubmodelElementCollectionType ObjectType.  */
export interface SubmodelElementCollectionOptions {
    /** The short identifier of the SubmodelElementCollection. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this SubmodelElementCollection. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the SubmodelElementCollection to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** A description of the SubmodelElementCollection. */
    description?: Description;
    /** A flag specifying whether the SubmodelElementCollection is ordered or not. */
    ordered?: boolean;
    /** A flag specifying whether the same element can be present in the SubmodelElementCollection multiple times or not. */
    allowDuplicates?: boolean;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the CapabilityType ObjectType.  */
export interface CapabilityOptions {
    /** The short identifier of the Capability. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this Capability. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the Capability to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** A description of the Capability. */
    description?: Description;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** An object containing all the parameters for the creation of an instance of the EntityType ObjectType.  */
export interface EntityOptions {
    /** The short identifier of the Entity. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this Entity. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** Specifies whether the Entity to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject;
    /** A description of the Entity. */
    description?: Description;
    /** Describes whether the entity is a co-managed entity or a self-managed entity. */
    entityType: EntityTypeEnumType;
    /** Reference to the asset the entity is representing. */
    asset?: RefArgument;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}

/** 
 * An object containing all the parameters for the creation of an instance of the SubmodelPropertyType ObjectType.  
 * example:
 * ```typescript
 *  {
*      browseName: "NMAX",
*      idShort: "NMAX",
*      submodelElementOf: submodel_1,
*      semanticId: [ new Key({
*          idType: KeyType.IRDI,
*          local: true,
*          type: KeyElements.ConceptDescription,
*          value: "0173-1#02-BAA120#007"
*      }) ],
*      category: PropertyCategory.PARAMETER,
*      valueType: PropertyValueType.Double,
*      value: {
*          dataType: "Double",
*          value: {
*              get: () => {
*                  return new Variant({ dataType: DataType.Double, value: 2000});
*              }
*          }
*      }
*  }
* ```
 * */
export interface SubmodelPropertyOptions {
    /** The short identifier of the SubmodelProperty. */
    idShort: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The Submodel containing this Object inside its [[SubmodelObject.submodelElements]] by means of Organizes Reference. */
    submodelElementOf?: SubmodelObject
    /** An AAS Reference pointing to an entity defining the semantics for this SubmodelProperty. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** A description of the SubmodelProperty. */
    description?: Description;
    /** Describes which category this property belongs to. */
    category?: PropertyCategory;
    /** Specifies whether the SubmodelProperty to be created should be a template or an instance. */
    kind?: ModelingKind;
    /** An AAS Reference to the the value in case the value of this Submodelproperty is stored somewhere else. */
    valueId?: RefArgument;
    /** The value of this SubmodelProperty. */
    value?: SPValue;
    /** The type of the value of this SubmodelProperty. */
    valueType?: PropertyValueType;
}

/** 
 * This type is used to wrap all possible values that a SubmodelProperty may contain.
 * Its structures is useful to serialize and deserialize a value, passing from XML Data Type to OPC UA DataType, and
 * viceversa. 
 * */
export interface SPValue {
    /** The DataType of the data contained in [[value]]. */
    dataType?: string | NodeIdLike | UADataType;
    /** 
     * An object structured in a specifc way to obtain a value encoded in OPC UA. More details about
     * the type of this property can be found in the documentation of node-opcua.*/
    value?: BindVariableOptions;
    /** 
     * The XML Data Type corresponding to the data contained in [[value]]. This property is useful,
     * eventually, for the serialization of the AASs in the AddressSpace in XML/JSON.
     */
    valueType?: PropertyValueType;
}

/** An object containing all the parameters for the creation of an instance of the ViewType ObjectType.  */
export interface ViewOptions {
    /** The short identifier of the AAS View. */
    idShort: string;
    /** An AAS Reference pointing to an entity defining the semantics for this AAS View. */
    semanticId?: RefArgument;
    /** An AAS reference to the parent entity of this Object. */
    parent?: RefArgument;
    /** A description of the SubmodelProperty. */
    description?: Description;
    /** The AAS which this AAS View belongs to. */
    viewOf?: AASObject;
    /** The browsename for the created Object. */
    browseName?: string;
    /** The node id for the created Object. */
    nodeId?: NodeIdLike;
}