const assert = require("assert");

module.exports = function(opcua) {

    /**
        * Create a new instance of AdministrativeInformationType representing a Reference of the AAS metamodel.
        *
        * @param {object} options
        * @param {object} [options.componentOf] The parent node containing the AdministrativeInformation by means of an HasComponent Reference.
        * @param {string} [options.version] A string representation of the version.
        * @param {string} [options.revision] A string representation of the revision number.
        * @param {string} [options.browseName] The BrowseName for the AdministrativeInformation Object.
        * @param {string} [options.description] A description for the AdministrativeInformation Object. 
        * @param {object} [options.nodeId] The string representation of the NodeId for the AdministrativeInformation Object.
        * @returns {object} The Object Node representing the AdministrativeInformationType
        */
    opcua.AddressSpace.prototype.addAdministrativeInformation = function (options) {

        const addressSpace = this;
        options = options || {};
        const namespace = addressSpace.getOwnNamespace();

        const adminType = addressSpace.findCoreAASObjectType("AdministrativeInformationType");

        const admin = namespace.addObject({
            browseName: options.browseName || "administration",
            componentOf: options.componentOf,
            typeDefinition: adminType,
            description: options.description,
            nodeId: options.nodeId
        });

        admin.coreAASType = "AdministrativeInformationType";

        if (options.version) {
            assert(typeof(options.version) === "string", "options.version is not a string");

            namespace.addVariable({
                browseName: "version",
                propertyOf: admin,
                dataType: "String",
                value: {
                    get: () => {
                        return new opcua.Variant({
                            dataType: opcua.DataType.String,
                            value: options.version
                        });
                    }
                }
            });            
        }

        if (options.revision) {
            assert(typeof(options.revision) === "string", "options.revision is not a string");

            namespace.addVariable({
                browseName: "revision",
                propertyOf: admin,
                dataType: "String",
                value: {
                    get: () => {
                        return new opcua.Variant({
                            dataType: opcua.DataType.String,
                            value: options.revision
                        });
                    }
                }
            });            
        }

        return admin;
    }

}