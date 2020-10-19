export enum IdentifierType { IRDI, IRI, Custom };

export enum KeyElements {
    GlobalReference,
    FragmentReference,
    AccessPermissionRule,
    AnnotatedRelationshipElement,
    Blob,
    Capability,
    ConceptDictionary,
    DataElement,
    Entity,
    Event,
    File,
    MultiLanguageProperty,
    Operation,
    OperationVariable,
    Property,
    Range,
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

export enum KeyType { idShort, IRDI, IRI, Custom, FragmentId }

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

export enum DataTypeIEC61360Type {
    DATE,
    STRING,
    STRING_TRANSLATABLE,
    INTEGER_MEASURE,
    INTEGER_COUNT,
    INTEGER_CURRENCY,
    REAL_MEASURE,
    REAL_COUNT,
    REAL_CURRENCY,
    BOOLEAN,
    URL,
    RATIONAL,
    RATIONAL_MEASURE,
    TIME,
    TIMESTAMP
}

export enum EntityTypeEnumType {
    CoManagedEntity,
    SelfManagedEntity
}