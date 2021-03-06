"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTypeEnumType = exports.DataTypeIEC61360Type = exports.PropertyValueType = exports.PropertyCategory = exports.AssetKind = exports.ModelingKind = exports.KeyType = exports.KeyElements = exports.IdentifierType = void 0;
var IdentifierType;
(function (IdentifierType) {
    IdentifierType[IdentifierType["IRDI"] = 0] = "IRDI";
    IdentifierType[IdentifierType["IRI"] = 1] = "IRI";
    IdentifierType[IdentifierType["Custom"] = 2] = "Custom";
})(IdentifierType = exports.IdentifierType || (exports.IdentifierType = {}));
;
var KeyElements;
(function (KeyElements) {
    KeyElements[KeyElements["GlobalReference"] = 0] = "GlobalReference";
    KeyElements[KeyElements["FragmentReference"] = 1] = "FragmentReference";
    KeyElements[KeyElements["AccessPermissionRule"] = 2] = "AccessPermissionRule";
    KeyElements[KeyElements["AnnotatedRelationshipElement"] = 3] = "AnnotatedRelationshipElement";
    KeyElements[KeyElements["Blob"] = 4] = "Blob";
    KeyElements[KeyElements["Capability"] = 5] = "Capability";
    KeyElements[KeyElements["ConceptDictionary"] = 6] = "ConceptDictionary";
    KeyElements[KeyElements["DataElement"] = 7] = "DataElement";
    KeyElements[KeyElements["Entity"] = 8] = "Entity";
    KeyElements[KeyElements["Event"] = 9] = "Event";
    KeyElements[KeyElements["File"] = 10] = "File";
    KeyElements[KeyElements["MultiLanguageProperty"] = 11] = "MultiLanguageProperty";
    KeyElements[KeyElements["Operation"] = 12] = "Operation";
    KeyElements[KeyElements["OperationVariable"] = 13] = "OperationVariable";
    KeyElements[KeyElements["Property"] = 14] = "Property";
    KeyElements[KeyElements["Range"] = 15] = "Range";
    KeyElements[KeyElements["ReferenceElement"] = 16] = "ReferenceElement";
    KeyElements[KeyElements["RelationshipElement"] = 17] = "RelationshipElement";
    KeyElements[KeyElements["SubmodelElement"] = 18] = "SubmodelElement";
    KeyElements[KeyElements["SubmodelElementCollection"] = 19] = "SubmodelElementCollection";
    KeyElements[KeyElements["View"] = 20] = "View";
    KeyElements[KeyElements["Asset"] = 21] = "Asset";
    KeyElements[KeyElements["AssetAdministrationShell"] = 22] = "AssetAdministrationShell";
    KeyElements[KeyElements["ConceptDescription"] = 23] = "ConceptDescription";
    KeyElements[KeyElements["Submodel"] = 24] = "Submodel";
})(KeyElements = exports.KeyElements || (exports.KeyElements = {}));
var KeyType;
(function (KeyType) {
    KeyType[KeyType["idShort"] = 0] = "idShort";
    KeyType[KeyType["IRDI"] = 1] = "IRDI";
    KeyType[KeyType["IRI"] = 2] = "IRI";
    KeyType[KeyType["Custom"] = 3] = "Custom";
    KeyType[KeyType["FragmentId"] = 4] = "FragmentId";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
var ModelingKind;
(function (ModelingKind) {
    ModelingKind[ModelingKind["Template"] = 0] = "Template";
    ModelingKind[ModelingKind["Instance"] = 1] = "Instance";
})(ModelingKind = exports.ModelingKind || (exports.ModelingKind = {}));
var AssetKind;
(function (AssetKind) {
    AssetKind[AssetKind["Type"] = 0] = "Type";
    AssetKind[AssetKind["Instance"] = 1] = "Instance";
})(AssetKind = exports.AssetKind || (exports.AssetKind = {}));
var PropertyCategory;
(function (PropertyCategory) {
    PropertyCategory[PropertyCategory["CONSTANT"] = 0] = "CONSTANT";
    PropertyCategory[PropertyCategory["PARAMETER"] = 1] = "PARAMETER";
    PropertyCategory[PropertyCategory["VARIABLE"] = 2] = "VARIABLE";
})(PropertyCategory = exports.PropertyCategory || (exports.PropertyCategory = {}));
var PropertyValueType;
(function (PropertyValueType) {
    PropertyValueType[PropertyValueType["AnyType"] = 0] = "AnyType";
    PropertyValueType[PropertyValueType["AllComplexTypes"] = 1] = "AllComplexTypes";
    PropertyValueType[PropertyValueType["AnySimpleType"] = 2] = "AnySimpleType";
    PropertyValueType[PropertyValueType["AnyAtomicType"] = 3] = "AnyAtomicType";
    PropertyValueType[PropertyValueType["AnyURI"] = 4] = "AnyURI";
    PropertyValueType[PropertyValueType["Base64Binary"] = 5] = "Base64Binary";
    PropertyValueType[PropertyValueType["Boolean"] = 6] = "Boolean";
    PropertyValueType[PropertyValueType["Date"] = 7] = "Date";
    PropertyValueType[PropertyValueType["DateTime"] = 8] = "DateTime";
    PropertyValueType[PropertyValueType["DateTimeStamp"] = 9] = "DateTimeStamp";
    PropertyValueType[PropertyValueType["Decimal"] = 10] = "Decimal";
    PropertyValueType[PropertyValueType["Integer"] = 11] = "Integer";
    PropertyValueType[PropertyValueType["Long"] = 12] = "Long";
    PropertyValueType[PropertyValueType["Int"] = 13] = "Int";
    PropertyValueType[PropertyValueType["Short"] = 14] = "Short";
    PropertyValueType[PropertyValueType["Byte"] = 15] = "Byte";
    PropertyValueType[PropertyValueType["NonNegativeInteger"] = 16] = "NonNegativeInteger";
    PropertyValueType[PropertyValueType["PositiveInteger"] = 17] = "PositiveInteger";
    PropertyValueType[PropertyValueType["UnsignedLong"] = 18] = "UnsignedLong";
    PropertyValueType[PropertyValueType["UnsignedInt"] = 19] = "UnsignedInt";
    PropertyValueType[PropertyValueType["UnsignedShort"] = 20] = "UnsignedShort";
    PropertyValueType[PropertyValueType["UnsignedByte"] = 21] = "UnsignedByte";
    PropertyValueType[PropertyValueType["NonPositiveInteger"] = 22] = "NonPositiveInteger";
    PropertyValueType[PropertyValueType["NegativeInteger"] = 23] = "NegativeInteger";
    PropertyValueType[PropertyValueType["Double"] = 24] = "Double";
    PropertyValueType[PropertyValueType["Duration"] = 25] = "Duration";
    PropertyValueType[PropertyValueType["DayTimeDuration"] = 26] = "DayTimeDuration";
    PropertyValueType[PropertyValueType["YearMonthDuration"] = 27] = "YearMonthDuration";
    PropertyValueType[PropertyValueType["Float"] = 28] = "Float";
    PropertyValueType[PropertyValueType["GDay"] = 29] = "GDay";
    PropertyValueType[PropertyValueType["GMonth"] = 30] = "GMonth";
    PropertyValueType[PropertyValueType["GMonthDay"] = 31] = "GMonthDay";
    PropertyValueType[PropertyValueType["GYear"] = 32] = "GYear";
    PropertyValueType[PropertyValueType["GYearMonth"] = 33] = "GYearMonth";
    PropertyValueType[PropertyValueType["HexBinary"] = 34] = "HexBinary";
    PropertyValueType[PropertyValueType["NOTATION"] = 35] = "NOTATION";
    PropertyValueType[PropertyValueType["QName"] = 36] = "QName";
    PropertyValueType[PropertyValueType["String"] = 37] = "String";
    PropertyValueType[PropertyValueType["NormalizedString"] = 38] = "NormalizedString";
    PropertyValueType[PropertyValueType["Token"] = 39] = "Token";
    PropertyValueType[PropertyValueType["Language"] = 40] = "Language";
    PropertyValueType[PropertyValueType["Name"] = 41] = "Name";
    PropertyValueType[PropertyValueType["NCName"] = 42] = "NCName";
    PropertyValueType[PropertyValueType["ENTITY"] = 43] = "ENTITY";
    PropertyValueType[PropertyValueType["ID"] = 44] = "ID";
    PropertyValueType[PropertyValueType["IDREF"] = 45] = "IDREF";
    PropertyValueType[PropertyValueType["NMTOKEN"] = 46] = "NMTOKEN";
    PropertyValueType[PropertyValueType["Time"] = 47] = "Time";
    PropertyValueType[PropertyValueType["ENTITIES"] = 48] = "ENTITIES";
    PropertyValueType[PropertyValueType["IDREFS"] = 49] = "IDREFS";
    PropertyValueType[PropertyValueType["NMTOKENS"] = 50] = "NMTOKENS";
})(PropertyValueType = exports.PropertyValueType || (exports.PropertyValueType = {}));
var DataTypeIEC61360Type;
(function (DataTypeIEC61360Type) {
    DataTypeIEC61360Type[DataTypeIEC61360Type["DATE"] = 0] = "DATE";
    DataTypeIEC61360Type[DataTypeIEC61360Type["STRING"] = 1] = "STRING";
    DataTypeIEC61360Type[DataTypeIEC61360Type["STRING_TRANSLATABLE"] = 2] = "STRING_TRANSLATABLE";
    DataTypeIEC61360Type[DataTypeIEC61360Type["INTEGER_MEASURE"] = 3] = "INTEGER_MEASURE";
    DataTypeIEC61360Type[DataTypeIEC61360Type["INTEGER_COUNT"] = 4] = "INTEGER_COUNT";
    DataTypeIEC61360Type[DataTypeIEC61360Type["INTEGER_CURRENCY"] = 5] = "INTEGER_CURRENCY";
    DataTypeIEC61360Type[DataTypeIEC61360Type["REAL_MEASURE"] = 6] = "REAL_MEASURE";
    DataTypeIEC61360Type[DataTypeIEC61360Type["REAL_COUNT"] = 7] = "REAL_COUNT";
    DataTypeIEC61360Type[DataTypeIEC61360Type["REAL_CURRENCY"] = 8] = "REAL_CURRENCY";
    DataTypeIEC61360Type[DataTypeIEC61360Type["BOOLEAN"] = 9] = "BOOLEAN";
    DataTypeIEC61360Type[DataTypeIEC61360Type["URL"] = 10] = "URL";
    DataTypeIEC61360Type[DataTypeIEC61360Type["RATIONAL"] = 11] = "RATIONAL";
    DataTypeIEC61360Type[DataTypeIEC61360Type["RATIONAL_MEASURE"] = 12] = "RATIONAL_MEASURE";
    DataTypeIEC61360Type[DataTypeIEC61360Type["TIME"] = 13] = "TIME";
    DataTypeIEC61360Type[DataTypeIEC61360Type["TIMESTAMP"] = 14] = "TIMESTAMP";
})(DataTypeIEC61360Type = exports.DataTypeIEC61360Type || (exports.DataTypeIEC61360Type = {}));
var EntityTypeEnumType;
(function (EntityTypeEnumType) {
    EntityTypeEnumType[EntityTypeEnumType["CoManagedEntity"] = 0] = "CoManagedEntity";
    EntityTypeEnumType[EntityTypeEnumType["SelfManagedEntity"] = 1] = "SelfManagedEntity";
})(EntityTypeEnumType = exports.EntityTypeEnumType || (exports.EntityTypeEnumType = {}));
//# sourceMappingURL=CoreAAS_enums.js.map