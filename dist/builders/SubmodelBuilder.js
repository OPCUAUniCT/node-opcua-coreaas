"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
const types_1 = require("../types");
const CoreAAS_enums_1 = require("../CoreAAS_enums");
const assert = require("assert");
const builder_utilities_1 = require("./builder_utilities");
class SubmodelBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addSubmodel(options) {
        assert(options.identification != null, "No options.identification parameter inserted!");
        assert(options.idShort != null, "No options.idShort parameter inserted!");
        assert(types_1.isIdentifier(options.identification), "options.identification is not an Identifier.");
        const submodelType = this.coreaas.findCoreAASObjectType("SubmodelType");
        const submodelsFolder = this._addressSpace.rootFolder.objects.submodels;
        const submodel = this._namespace.addObject({
            typeDefinition: submodelType,
            browseName: options.browseName || "Submodel_" + options.identification.id,
            nodeId: options.nodeId,
            organizedBy: submodelsFolder,
        });
        submodel.referableChildrenMap = new Map();
        this.coreaas.identifiableMap.set(options.identification.id, submodel);
        //Add identification
        const identification = builder_utilities_1.get_identification_creator(this.coreaas, submodel)(options.identification);
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, submodel)(options.idShort);
        //Add Submodels
        this._namespace.addObject({
            typeDefinition: this._addressSpace.findNode("FolderType").nodeId,
            browseName: "SubmodelElements",
            componentOf: submodel
        });
        //Add description
        if (options.description != null) {
            const addDescriptionToAas = builder_utilities_1.get_description_creator(this.coreaas, submodel);
            addDescriptionToAas(options.description);
        }
        if (options.administration != null) {
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AdministrativeInformationType")), "options.administration is not an AdministrativeInformationType Object.");
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            submodel.addReference({ referenceType: "HasComponent", nodeId: options.administration });
        }
        //Add kind
        if (options.kind != null) {
            builder_utilities_1.get_kind_creator(this.coreaas, submodel)(options.kind);
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, submodel)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, submodel)(options.parent);
        }
        /* Convenience methods */
        submodel.hasSubmodelSemantic = (semanticElem) => {
            assert(semanticElem.hasOwnProperty("kind"), "semanticElem is not a SubmodelType instance.");
            assert(semanticElem.kind.readValue().value.value === CoreAAS_enums_1.Kind.Type, "semanticElem is not a Submodel with kind = Type");
            const hasSubmodelSemanticRefType = this.coreaas.findCoreAASReferenceType("HasSubmodelSemantic");
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: semanticElem });
            return submodel;
        };
        submodel.hasSemantic = (semanticElem) => {
            const hasSubmodelSemanticRefType = this.coreaas.findCoreAASReferenceType("HasSemantic");
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: semanticElem });
            return submodel;
        };
        submodel.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, submodel);
        submodel.submodelOf = (aas) => {
            assert(aas.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASType")), "aas parameter is not an AASType instance.");
            const hasSubmodelRef = this.coreaas.findCoreAASReferenceType("HasSubmodel");
            aas.addReference({ referenceType: hasSubmodelRef, nodeId: submodel });
            return submodel;
        };
        submodel.addParent = builder_utilities_1.get_parent_creator(this.coreaas, submodel);
        submodel.addElements = (elemArray) => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");
            elemArray.forEach(el => {
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType");
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf
                const submodelElements = submodel.submodelElements;
                submodelElements.addReference({ referenceType: "Organizes", nodeId: el });
                submodel.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });
            return submodel;
        };
        return submodel;
    }
}
exports.SubmodelBuilder = SubmodelBuilder;
//# sourceMappingURL=SubmodelBuilder.js.map