const assert = require("assert");
const path = require("path");

exports.install = function(opcua) {

    //Add a CoreAAS to the opcua object
    if (opcua.hasOwnProperty("CoreAAS")) {
        return false; // already installed
    }

    assert(!opcua.hasOwnProperty('CoreAAS'), "Already initialized?");

    opcua.coreaas = {};

    const coreaas_xml_file = path.join(__dirname, "../nodesets/coreaas.xml");
    opcua.coreaas.nodeset_file = coreaas_xml_file;

    opcua.coreaas.getIdentifierConstructor = require("./datatypes/identifier"); //TODO: documentare
    opcua.coreaas.getKeyConstructor = require("./datatypes/key"); //TODO: documentare

    opcua.coreaas.IdentifierType = require("./datatypes/coreAAS_Enums")(opcua).IdentifierType;
    opcua.coreaas.KeyElements = require("./datatypes/coreAAS_Enums")(opcua).KeyElements
    opcua.coreaas.KeyType = require("./datatypes/coreAAS_Enums")(opcua).KeyType
    opcua.coreaas.Kind = require("./datatypes/coreAAS_Enums")(opcua).Kind;
    opcua.coreaas.PropertyCategory = require("./datatypes/coreAAS_Enums")(opcua).PropertyCategory;
    opcua.coreaas.PropertyValueType = require("./datatypes/coreAAS_Enums")(opcua).PropertyValueType;

    //WORKAROUND: Try to fix the Identifier of DataSpecificationIEC61360Type
    opcua.AddressSpace.prototype.fixSpecificationTypeIdentifications = function() {
        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        const coreAASNamespaceIndex = addressSpace.getCoreAASNamespace();
        const Identifier = opcua.coreaas.getIdentifierConstructor(coreAASNamespaceIndex).Identifier;
        
        const dataSpecificationType = addressSpace.findCoreAASObjectType("DataSpecificationIEC61360Type").identification.setValueFromSource(new opcua.Variant({
            dataType: opcua.DataType.ExtensionObject, 
            value: new Identifier({
                id: "www.adminshell.io/DataSpecificationTemplates/DataSpecificationIEC61360",
                idType: opcua.coreaas.IdentifierType.URI
            })
        }));
    };

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

    require("./extension_AASType")(opcua);
    require("./extension_AssetType")(opcua);
    require("./extension_AASReferenceType")(opcua);
    require("./extension_EmbeddedDataSpecificationType")(opcua);
    require("./extension_SubmodelType")(opcua);
    require("./extension_SubmodelPropertyType")(opcua);
    require("./extension_AdministrativeInformationType")(opcua);
    require("./extension_ConceptDictionaryType")(opcua);
    require("./extension_ConceptDescriptionType")(opcua);
    require("./extension_ViewType")(opcua);
    require("./extension_SubmodelElementCollectionType")(opcua);
    require("./extension_FileType")(opcua);
    require("./extension_ReferenceElementType")(opcua);
}