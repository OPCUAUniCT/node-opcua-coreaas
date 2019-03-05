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

    return module;
}