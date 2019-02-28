const assert = require("assert");
const path = require("path");

exports.install = function(opcua) {
    //TODO: Add a CoreAAS to the opcua object
    if (opcua.hasOwnProperty("CoreAAS")) {
        return false; // already installed
    }

    assert(!opcua.hasOwnProperty('CoreAAS'), "Already initialized?");

    opcua.coreaas = {};

    const coreaas_xml_file = path.join(__dirname, "../nodesets/coreaas.xml");
    opcua.coreaas.nodeset_file = coreaas_xml_file;
    opcua.coreaas.Identifier = require("../lib/datatypes/identifier");
    opcua.coreaas.IdentifierType = require("./datatypes/identifierType")(opcua);

    //Add AssetAdministrationShells, Assets, Submodels and ConceptDescriptions folder
    //opcua.AddressSpace.prototype.rootFolder 

    //Utility functions

    opcua.AddressSpace.prototype.getCoreAASNamespace = function() {
        const addressSpace  = this;
        return addressSpace.getNamespaceIndex("http://dieei.unict.it/coreAAS/");
    };

    opcua.AddressSpace.prototype.findCoreAASReferenceType = function(name) {
        const addressSpace  = this;
        return addressSpace.findReferenceType(name,addressSpace.getCoreAASNamespace());
    };

    opcua.AddressSpace.prototype.findCoreAASObjectType = function(name) {
        const addressSpace  = this;
        return addressSpace.findObjectType(name,addressSpace.getCoreAASNamespace());
    };

    opcua.AddressSpace.prototype.findCoreAASVariableType = function(name) {
        const addressSpace  = this;
        return addressSpace.findVariableType(name,addressSpace.getCoreAASNamespace());
    };

    opcua.AddressSpace.prototype.findCoreAASDataType = function(name) {
        const addressSpace  = this;
        return addressSpace.findDataType(name,addressSpace.getCoreAASNamespace());
    };

    require("./coreaas_address_space_extension_aas")(opcua);
}