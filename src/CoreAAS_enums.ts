export enum IdentifierType { IRDI, URI, Custom };

export enum KeyElements {
    GlobalReference,
    AccessPermissionRule,
    Blob,
    ConceptDictionary,
    DataElement,
    File,
    Event,
    Operation,
    OperationVariable,
    Property,
    ReferenceElement,
    RelationshipElement,
    SubmodelElement,
    SubmodelElementCollection,
    View,
    Asset,
    AssetAdministrationShell,
    ConceptDescription,
    Submodel
}

export enum KeyType { idShort, IRDI, URI, Custom }

export enum ModelingKind { Template, Instance }

export enum AssetKind { Type, Instance }

export enum PropertyCategory { CONSTANT, PARAMETER, VARIABLE }

export enum PropertyValueType {
    AnyType,
    AllComplexTypes,
    AnySimpleType,
    AnyAtomicType,
    AnyURI,
    Base64Binary,
    Boolean,
    Date,
    DateTime,
    DateTimeStamp,
    Decimal,
    Integer,
    Long,
    Int,
    Short,
    Byte,
    NonNegativeInteger,
    PositiveInteger,
    UnsignedLong,
    UnsignedInt,
    UnsignedShort,
    UnsignedByte,
    NonPositiveInteger,
    NegativeInteger,
    Double,
    Duration,
    DayTimeDuration,
    YearMonthDuration,
    Float,
    GDay,
    GMonth,
    GMonthDay,
    GYear,
    GYearMonth,
    HexBinary,
    NOTATION,
    QName,
    String,
    NormalizedString,
    Token,
    Language,
    Name,
    NCName,
    ENTITY,
    ID,
    IDREF,
    NMTOKEN,
    Time,
    ENTITIES,
    IDREFS,
    NMTOKENS
}