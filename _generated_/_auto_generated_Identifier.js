// --------- This code has been automatically generated !!! 2019-02-28T10:53:02.843Z
"use strict";
/**
 * @module opcua.address_space.types
 */
const assert = require("node-opcua-assert").assert;
const util = require("util");
const _  = require("underscore");
const makeNodeId = require("node-opcua-nodeid").makeNodeId;
const schema_helpers =  require("node-opcua-factory/src/factories_schema_helpers");
const extract_all_fields                       = schema_helpers.extract_all_fields;
const resolve_schema_field_types               = schema_helpers.resolve_schema_field_types;
const initialize_field                         = schema_helpers.initialize_field;
const initialize_field_array                   = schema_helpers.initialize_field_array;
const check_options_correctness_against_schema = schema_helpers.check_options_correctness_against_schema;
const _defaultTypeMap = require("node-opcua-factory/src/factories_builtin_types")._defaultTypeMap;
const ec = require("node-opcua-basic-types");
const encodeArray = ec.encodeArray;
const decodeArray = ec.decodeArray;
const makeExpandedNodeId = require("node-opcua-nodeid/src/expanded_nodeid").makeExpandedNodeId;
const generate_new_id = require("node-opcua-factory").generate_new_id;
const _enumerations = require("node-opcua-factory/src/factories_enumerations")._private._enumerations;
const schema = require("../schemas/Identifier_schema").Identifier_Schema;
const getFactory = require("node-opcua-factory/src/factories_factories").getFactory;
const BaseUAObject = require("node-opcua-factory/src/factories_baseobject").BaseUAObject;

/**
 * 
 * @class Identifier
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 */
function Identifier(options)
{
    options = options || {};
    /* istanbul ignore next */
    if (schema_helpers.doDebug) { check_options_correctness_against_schema(this,schema,options); }
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
      * @default  http://dieei.unict.it/coreAAS/
      */
    self.id = initialize_field(schema.fields[0], options.id);

    /**
      * Enumeration identifing the type of the field id.
      * @property idType
      * @type {UInt32}
      */
    self.idType = initialize_field(schema.fields[1], options.idType);

   // Object.preventExtensions(self);
}
util.inherits(Identifier,BaseUAObject);
Identifier.prototype.encodingDefaultBinary = makeExpandedNodeId(5001,1);
Identifier.prototype._schema = schema;

const encode_String = _defaultTypeMap.String.encode;
const decode_String = _defaultTypeMap.String.decode;
const encode_UInt32 = _defaultTypeMap.UInt32.encode;
const decode_UInt32 = _defaultTypeMap.UInt32.decode;
/**
 * encode the object into a binary stream
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
 * decode the object from a binary stream
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


exports.Identifier = Identifier;
const register_class_definition = require("node-opcua-factory/src/factories_factories").register_class_definition;
register_class_definition("Identifier",Identifier);
