const makeNodeId = require("node-opcua-nodeid").makeNodeId;

const defaultUri = "http://dieei.unict.it/coreAAS/";
const Identifier_Schema = {
    id: -1, // the namespace index must be selected at runtime
    name: "Identifier",
    fields: [
        {
            name: "id",
            fieldType: "String",
            defaultValue: "No_Identifier",
            documentation: "The identifier of the entity."
        },
        {
            name: "idType",
            fieldType: "UInt32",
            defaultValue: 1,
            documentation: "Enumeration identifing the type of the field id."
        }
    ]
};
exports.Identifier_Schema = Identifier_Schema;