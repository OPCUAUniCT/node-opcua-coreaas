// --------- This code has been automatically generated !!! 2019-03-01T14:40:09.791Z
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
const schema = require("../schemas/Key_schema").Key_Schema;
const getFactory = require("node-opcua-factory/src/factories_factories").getFactory;
const BaseUAObject = require("node-opcua-factory/src/factories_baseobject").BaseUAObject;

/**
 * 
 * @class Key
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 */
function Key(options)
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
      * Enumeration identifing the kind of identifier contained in the field value.
      * @property idType
      * @type {UInt32}
      * @default  0
      */
    self.idType = initialize_field(schema.fields[0], options.idType);

    /**
      * The element referred by this key is local to the AAS.
      * @property local
      * @type {Boolean}
      * @default  true
      */
    self.local = initialize_field(schema.fields[1], options.local);

    /**
      * Enumeration identifing entity referred by this key.
      * @property type
      * @type {UInt32}
      * @default  0
      */
    self.type = initialize_field(schema.fields[2], options.type);

    /**
      * The identifier of the entity.
      * @property value
      * @type {String}
      * @default  No_Identifier
      */
    self.value = initialize_field(schema.fields[3], options.value);

   // Object.preventExtensions(self);
}
util.inherits(Key,BaseUAObject);
schema.id = generate_new_id();
Key.prototype.encodingDefaultBinary = makeExpandedNodeId(schema.id);
Key.prototype._schema = schema;

const encode_UInt32 = _defaultTypeMap.UInt32.encode;
const decode_UInt32 = _defaultTypeMap.UInt32.decode;
const encode_Boolean = _defaultTypeMap.Boolean.encode;
const decode_Boolean = _defaultTypeMap.Boolean.decode;
const encode_String = _defaultTypeMap.String.encode;
const decode_String = _defaultTypeMap.String.decode;
/**
 * encode the object into a binary stream
 * @method encode
 *
 * @param stream {BinaryStream} 
 */
Key.prototype.encode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.encode.call(this,stream,options);
    encode_UInt32(this.idType,stream);
    encode_Boolean(this.local,stream);
    encode_UInt32(this.type,stream);
    encode_String(this.value,stream);
};
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream} 
 */
Key.prototype.decode = function(stream) {
    // call base class implementation first
    BaseUAObject.prototype.decode.call(this,stream);
    this.idType = decode_UInt32(stream);
    this.local = decode_Boolean(stream);
    this.type = decode_UInt32(stream);
    this.value = decode_String(stream);
};
Key.possibleFields = [
  "idType",
         "local",
         "type",
         "value"
];


exports.Key = Key;
const register_class_definition = require("node-opcua-factory/src/factories_factories").register_class_definition;
register_class_definition("Key",Key);
