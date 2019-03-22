module.exports = function(opcua) {

    let module = {};

    const Enum = opcua.Enum;

    module.IdentifierType = new Enum({
        IRDI: 0,
        URI: 1,
        Custom: 2
    });

    module.KeyElements = new Enum({
        GlobalReference: 0,
        AccessPermissionRule: 1,
        Blob: 2,
        ConceptDictionary: 3,
        DataElement: 4,
        File: 5,
        Event: 6,
        Operation: 7,
        OperationVariable: 8,
        Property: 9,
        ReferenceElement: 10,
        RelationshipElement: 11,
        SubmodelElement: 12,
        SubmodelElementCollection: 13,
        View: 14,
        Asset: 15,
        AssetAdministrationShell: 16,
        ConceptDescription: 17,
        Submodel: 18
    });

    module.KeyType = new Enum({
        idShort: 0,
        IRDI: 1,
        URI: 2,
        Custom: 3
    });

    module.Kind = new Enum({
        Type: 0,
        Instance: 1
    });

    module.PropertyCategory = new Enum({
        CONSTANT: 0,
        PARAMETER: 1,
        VARIABLE: 2
    });

    module.PropertyValueType = new Enum({
        AnyType: 0,
        AllComplexTypes: 1,
        AnySimpleType: 2,
        AnyAtomicType: 3,
        AnyURI: 4,
        Base64Binary: 5,
        Boolean: 6,
        Date: 7,
        DateTime: 8,
        DateTimeStamp: 9,
        Decimal: 10,
        Integer: 11,
        Long: 12,
        Int: 13,
        Short: 14,
        Byte: 15,
        NonNegativeInteger: 16,
        PositiveInteger: 17,
        UnsignedLong: 18,
        UnsignedInt: 19,
        UnsignedShort: 20,
        UnsignedByte: 21,
        NonPositiveInteger: 22,
        NegativeInteger: 23,
        Double: 24,
        Duration: 25,
        DayTimeDuration: 26,
        YearMonthDuration: 27,
        Float: 28,
        GDay: 29,
        GMonth: 30,
        GMonthDay: 31,
        GYear: 32,
        GYearMonth: 33,
        HexBinary: 34,
        NOTATION: 35,
        QName: 36,
        String: 37,
        NormalizedString: 38,
        Token: 39,
        Language: 40,
        Name: 41,
        NCName: 42,
        ENTITY: 43,
        ID: 44,
        IDREF: 45,
        NMTOKEN: 46,
        Time: 47,
        ENTITIES: 48,
        IDREFS: 49,
        NMTOKENS: 50
    });

    return module;
}