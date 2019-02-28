module.exports = function(opcua) {
    const Enum = opcua.Enum;

    const IdentifierType = new Enum({
        IRDI: 0,
        URI: 1,
        Custom: 2
    });

    return IdentifierType;
}