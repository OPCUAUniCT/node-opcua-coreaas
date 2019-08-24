"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
const types_1 = require("../types");
const assert = require("assert");
const builder_1 = require("./builder");
class DataSpecificationIEC61360Builder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addDataSpecificationIEC61360(options) {
        const iecType = this.coreaas.findCoreAASObjectType("DataSpecificationIEC61360Type");
        const dataSpec = this._namespace.addObject({
            typeDefinition: iecType,
            browseName: options.browseName || "dataSpecificationContent",
            description: options.description,
            nodeId: options.nodeId
        });
        if (options.identifier != null)
            this._addUAProperty_for_string(dataSpec, "identifier", options.identifier);
        if (options.preferredName != null)
            this._addUAProperty_for_string(dataSpec, "preferredName", options.preferredName);
        if (options.definition != null)
            this._addUAProperty_for_string(dataSpec, "definition", options.definition);
        if (options.dataType != null)
            this._addUAProperty_for_string(dataSpec, "dataType", options.dataType);
        if (options.unit != null)
            this._addUAProperty_for_string(dataSpec, "unit", options.unit);
        if (options.unitId != null) {
            assert(!dataSpec.hasOwnProperty("unitId"), "the DataSpecificationIEC61360Type Object already contains a UA Property with Browsename unitId");
            if (options.unitId instanceof Array) {
                options.unitId.forEach(el => assert(types_1.isKey(el), "options.unitId Array contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    componentOf: dataSpec,
                    browseName: "unitId",
                    keys: options.unitId
                });
            }
            else {
                assert(options.unitId.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASReferenceType()), "options.unitId is not an AASReferenceType instance.");
                dataSpec.addReference({ referenceType: "HasComponent", nodeId: options.unitId });
            }
        }
        if (options.iecCategory != null)
            this._addUAProperty_for_string(dataSpec, "iecCategory", options.iecCategory);
        if (options.iecLanguageCode != null)
            this._addUAProperty_for_string(dataSpec, "iecLanguageCode", options.iecLanguageCode);
        if (options.note != null)
            this._addUAProperty_for_string(dataSpec, "note", options.note);
        if (options.shortName != null)
            this._addUAProperty_for_string(dataSpec, "shortName", options.shortName);
        if (options.valueFormat != null)
            this._addUAProperty_for_string(dataSpec, "valueFormat", options.valueFormat);
        if (options.version != null)
            this._addUAProperty_for_string(dataSpec, "version", options.version);
        if (options.revision != null)
            this._addUAProperty_for_string(dataSpec, "revision", options.revision);
        return dataSpec;
    }
    _addUAProperty_for_string(dataSpec, browseName, value) {
        assert(!dataSpec.hasOwnProperty(browseName), "dataSpec already contains a UA Proeprty with the browseName " + browseName);
        this._namespace.addVariable({
            browseName: browseName,
            propertyOf: dataSpec,
            dataType: "String",
            value: {
                get: () => {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.String,
                        value: value
                    });
                }
            }
        });
    }
}
exports.DataSpecificationIEC61360Builder = DataSpecificationIEC61360Builder;
//# sourceMappingURL=DataSpecificationIEC61360Builder.js.map