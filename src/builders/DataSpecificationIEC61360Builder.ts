import { UAObject, Variant, DataType } from "node-opcua";
import { CoreAASExtension } from "../CoreAASExtension";
import { isKey, DataSpecificationIEC61360 } from "../types";
import assert = require("assert");
import { Builder } from "./builder";
import { DataSpecificationIECOptions } from "../options_types";

export class DataSpecificationIEC61360Builder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addDataSpecificationIEC61360(options: DataSpecificationIECOptions): DataSpecificationIEC61360 {
        const iecType = this.coreaas.findCoreAASObjectType("DataSpecificationIEC61360Type")!;

        const dataSpec: DataSpecificationIEC61360 = this._namespace.addObject({
            typeDefinition: iecType,
            browseName: options.browseName || "dataSpecificationContent",
            description: options.description,
            nodeId: options.nodeId
        }) as DataSpecificationIEC61360;

        if (options.identifier != null) this._addUAProperty_for_string(dataSpec, "identifier", options.identifier);
        if (options.preferredName != null) this._addUAProperty_for_string(dataSpec, "preferredName", options.preferredName);
        if (options.definition != null) this._addUAProperty_for_string(dataSpec, "definition", options.definition);
        if (options.dataType != null) this._addUAProperty_for_string(dataSpec, "dataType", options.dataType);
        if (options.unit != null) this._addUAProperty_for_string(dataSpec, "unit", options.unit);
        if (options.unitId != null) {
            assert(!dataSpec.hasOwnProperty("unitId"), "the DataSpecificationIEC61360Type Object already contains a UA Property with Browsename unitId");

            if (options.unitId instanceof Array) {

                options.unitId.forEach(el => assert(isKey(el), "options.unitId Array contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    componentOf: dataSpec,
                    browseName: "unitId",
                    keys: options.unitId
                });
            } 
            else {
                assert(options.unitId.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASReferenceType()), "options.unitId is not an AASReferenceType instance.");
                dataSpec.addReference({ referenceType: "HasComponent", nodeId: options.unitId});
            } 
        }
        if (options.iecCategory != null) this._addUAProperty_for_string(dataSpec, "iecCategory", options.iecCategory);
        if (options.iecLanguageCode != null) this._addUAProperty_for_string(dataSpec, "iecLanguageCode", options.iecLanguageCode);
        if (options.note != null) this._addUAProperty_for_string(dataSpec, "note", options.note);
        if (options.shortName != null) this._addUAProperty_for_string(dataSpec, "shortName", options.shortName);
        if (options.valueFormat != null) this._addUAProperty_for_string(dataSpec, "valueFormat", options.valueFormat);
        if (options.version != null) this._addUAProperty_for_string(dataSpec, "version", options.version);
        if (options.revision != null) this._addUAProperty_for_string(dataSpec, "revision", options.revision);

        return dataSpec;
    }

    private _addUAProperty_for_string(dataSpec: UAObject, browseName: string, value: string): void {
        assert(!dataSpec.hasOwnProperty(browseName), "dataSpec already contains a UA Proeprty with the browseName " + browseName);

        this._namespace.addVariable({
            browseName: browseName,
            propertyOf: dataSpec,
            dataType: "String",
            value: {
                get: () => {
                    return new Variant({
                        dataType: DataType.String,
                        value: value
                    });
                }
            }
        });
    }
}