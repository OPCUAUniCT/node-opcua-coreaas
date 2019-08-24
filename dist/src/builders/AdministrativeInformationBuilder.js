"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
const builder_1 = require("./builder");
class AdministrativeInformationBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addAdministrativeInformation(options) {
        const adminType = this.coreaas.getAdministrativeInformationType();
        const admin = this._namespace.addObject({
            browseName: options.browseName || "administration",
            componentOf: options.componentOf,
            typeDefinition: adminType,
            description: options.description,
            nodeId: options.nodeId
        });
        if (options.version != null) {
            this._namespace.addVariable({
                browseName: "version",
                propertyOf: admin,
                dataType: "String",
                value: {
                    get: () => {
                        return new node_opcua_1.Variant({
                            dataType: node_opcua_1.DataType.String,
                            value: options.version
                        });
                    }
                }
            });
        }
        if (options.revision != null) {
            this._namespace.addVariable({
                browseName: "revision",
                propertyOf: admin,
                dataType: "String",
                value: {
                    get: () => {
                        return new node_opcua_1.Variant({
                            dataType: node_opcua_1.DataType.String,
                            value: options.revision
                        });
                    }
                }
            });
        }
        return admin;
    }
}
exports.AdministrativeInformationBuilder = AdministrativeInformationBuilder;
//# sourceMappingURL=AdministrativeInformationBuilder.js.map