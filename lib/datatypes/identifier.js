"use strict";

const assert = require("node-opcua-assert").assert;
const util = require("util");
const schema_helpers =  require("node-opcua-factory/src/factories_schema_helpers");
const resolve_schema_field_types               = schema_helpers.resolve_schema_field_types;
const initialize_field                         = schema_helpers.initialize_field;
const _defaultTypeMap = require("node-opcua-factory/src/factories_builtin_types")._defaultTypeMap;
const makeExpandedNodeId = require("node-opcua-nodeid/src/expanded_nodeid").makeExpandedNodeId;
const schema = require("../../schemas/Identifier_schema").Identifier_Schema;
const BaseUAObject = require("node-opcua-factory/src/factories_baseobject").BaseUAObject;

let _isRegistered = false;

module.exports = function (namespaceIndex = 1) {
    var module = {};

    /**
     * A DataType used for identificatin of Identifiable entities.
     * @class Identifier
     * @constructor
     * @extends BaseUAObject
     * @param  {Object} options
     * @param  {string} options.id The id of the Identifier.
     * @param  {number} options.idType An enumeration of value specifying the type of the identifier. The DataType is IdentifierType.
     * 
     * @example 
     *   // To obtain the Constructor of this Class you need to pass the namespaceindex of the current OPC UA Server.
     *   const Identifier = opcua.coreaas.getIdentifierConstructor(addressSpace.getCoreAASNamespace()).Identifier;
     *   const id = new Identifier({
     *       id: "www.admin-shell.io/aas-sample/1.0",
     *       idType: IdentifierType.URI
     *   })
     */
    function Identifier(options)
    {
        options = options || {};
        const self = this;

        assert(this instanceof BaseUAObject); //  ' keyword "new" is required for constructor call')
        resolve_schema_field_types(schema);

        BaseUAObject.call(this,options);
        if (options === null) { 
            BaseUAObject.call(this,options);
            return ;
        }

        /**
         * The identifier of the entity.
         * @property id
         * @type {String}
         */
        self.id = initialize_field(schema.fields[0], options.id);

        /**
         * Enumeration identifing the type of the field id.
         * @property idType
         * @type {UInt32}
         */
        self.idType = initialize_field(schema.fields[1], options.idType);
    }

    util.inherits(Identifier,BaseUAObject);

    Identifier.prototype.encodingDefaultBinary = makeExpandedNodeId(5001, namespaceIndex);
    Identifier.prototype._schema = schema;
    
    const encode_String = _defaultTypeMap.String.encode;
    const decode_String = _defaultTypeMap.String.decode;
    const encode_UInt32 = _defaultTypeMap.UInt32.encode;
    const decode_UInt32 = _defaultTypeMap.UInt32.decode;
    
    /**
     * Encode the object into a binary stream
     * @method encode
     *
     * @param stream {BinaryStream} 
     */
    Identifier.prototype.encode = function(stream,options) {
        // call base class implementation first
        BaseUAObject.prototype.encode.call(this,stream,options);
        encode_String(this.id,stream);
        encode_UInt32(this.idType,stream);
    };
    
    /**
     * Decode the object from a binary stream
     * @method decode
     *
     * @param stream {BinaryStream} 
     */
    Identifier.prototype.decode = function(stream) {
        // call base class implementation first
        BaseUAObject.prototype.decode.call(this,stream);
        this.id = decode_String(stream);
        this.idType = decode_UInt32(stream);
    };
    
    Identifier.possibleFields = [
        "id",
        "idType"
    ];

    if (!_isRegistered) {
        const register_class_definition = require("node-opcua-factory/src/factories_factories").register_class_definition;
        register_class_definition("Identifier", Identifier);
        _isRegistered = true
    }  
    

    module.Identifier = Identifier;
    return module;
}