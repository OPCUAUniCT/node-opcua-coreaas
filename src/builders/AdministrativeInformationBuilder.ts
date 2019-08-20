import { AddressSpace, Namespace, NodeIdLike, UAObject, Variant, DataType, LocalizedText } from "node-opcua";

import { CoreAASExtension } from "../CoreAASExtension";
import assert = require("assert");
import { Builder } from "./builder";
import { AdministrativeInformationObject } from "../types";

export class AdministrativeInformationBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addAdministrativeInformation(options: AdministrativeInformationOptions): AdministrativeInformationObject {
        const adminType = this.coreaas.getAdministrativeInformationType();

        const admin = this._namespace.addObject({
            browseName: options.browseName || "administration",
            componentOf: options.componentOf,
            typeDefinition: adminType,
            description: options.description,
            nodeId: options.nodeId
        }) as AdministrativeInformationObject;

        if (options.version != null) {
            
            this._namespace.addVariable({
                browseName: "version",
                propertyOf: admin,
                dataType: "String",
                value: {
                    get: () => {
                        return new Variant({
                            dataType: DataType.String,
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
                        return new Variant({
                            dataType: DataType.String,
                            value: options.revision
                        });
                    }
                }
            });            
        }

        return admin;
    }
}

export interface AdministrativeInformationOptions {
    componentOf?: UAObject;
    description?: string | LocalizedText,
    nodeId?: NodeIdLike,
    browseName?: string,
    version?: string,
    revision?: string
}