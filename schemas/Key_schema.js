const makeNodeId = require("node-opcua-nodeid").makeNodeId;

const defaultUri = "http://dieei.unict.it/coreAAS/";
const Key_Schema = {
    id: -1, // the namespace index must be selected at runtime
    name: "Key",
    fields: [
        {
            name: "idType",
            fieldType: "UInt32",
            defaultValue: 0,
            documentation: "Enumeration identifing the kind of identifier contained in the field value."
        },
        {
            name: "local",
            fieldType: "Boolean",
            defaultValue: true,
            documentation: "The element referred by this key is local to the AAS."
        },
        {
            name: "type",
            fieldType: "UInt32",
            defaultValue: 0,
            documentation: "Enumeration identifing entity referred by this key."
        },
        {
            name: "value",
            fieldType: "String",
            defaultValue: "No_Identifier",
            documentation: "The identifier of the entity."
        }
    ]
};
exports.Key_Schema = Key_Schema;