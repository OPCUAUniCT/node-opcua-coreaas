const assert = require("assert");

module.exports = function(opcua) {

    /**
        * Create a new instance of AdministrativeInformationType representing a Reference of the AAS metamodel.
        *
        * @param {object} options
        * @param {object} options.componentOf
        * @param {string} [options.version]
        * @param {string} [options.revision]
        * @param {string} [options.browseName]
        * @param {string} [options.description]
        * @param {object} [options.nodeId]
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