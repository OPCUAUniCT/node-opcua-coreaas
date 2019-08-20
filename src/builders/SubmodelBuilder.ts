import { CoreAASExtension } from "../CoreAASExtension";
import { Builder } from "./builder";
import { SubmodelObject, CoreAASObjectsFolder, Identifier, isIdentifier, AASObject, SubmodelElementObject } from "../types";
import { UAObject } from "node-opcua";
import { Kind } from "../CoreAAS_enums";
import assert = require("assert");
import { get_description_creator, get_kind_creator, get_semanticId_creator, get_parent_creator, get_identification_creator, get_idShort_creator } from "./builder_utilities";
import { SubmodelOptions } from "../options_types";

export class SubmodelBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addSubmodel(options: SubmodelOptions): SubmodelObject {
        assert(options.identification != null, "No options.identification parameter inserted!");
        assert(options.idShort != null, "No options.idShort parameter inserted!");
        assert(isIdentifier(options.identification), "options.identification is not an Identifier.");

        const submodelType = this.coreaas.findCoreAASObjectType("SubmodelType")!;
        const submodelsFolder = (<CoreAASObjectsFolder>this._addressSpace.rootFolder.objects).submodels;

        const submodel = this._namespace.addObject({
            typeDefinition: submodelType,
            browseName:    options.browseName || "Submodel_" + (<Identifier>options.identification).id,
            nodeId:        options.nodeId,
            organizedBy: submodelsFolder,
        }) as SubmodelObject;

        submodel.referableChildrenMap = new Map();
        this.coreaas.identifiableMap.set((<Identifier>options.identification).id, submodel);

        //Add identification
        const identification = get_identification_creator(this.coreaas, submodel)(options.identification);

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, submodel)(options.idShort);

        //Add Submodels
        this._namespace.addObject({
            typeDefinition: this._addressSpace.findNode("FolderType")!.nodeId,
            browseName: "SubmodelElements",
            componentOf: submodel
        });

        //Add description
        if (options.description != null) {
            const addDescriptionToAas = get_description_creator(this.coreaas, submodel);
            addDescriptionToAas(options.description);
        }

        if (options.administration != null) {
            
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AdministrativeInformationType")!) , "options.administration is not an AdministrativeInformationType Object.")
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            
            submodel.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add kind
        if (options.kind != null) {
            get_kind_creator(this.coreaas, submodel)(options.kind);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, submodel)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, submodel)(options.parent);
        }

        /* Convenience methods */
        submodel.hasSubmodelSemantic = (semanticElem: SubmodelObject): SubmodelObject => {
            assert(semanticElem.hasOwnProperty("kind"), "semanticElem is not a SubmodelType instance.")
            assert((<any>semanticElem).kind.readValue().value.value === Kind.Type, "semanticElem is not a Submodel with kind = Type");

            const hasSubmodelSemanticRefType = this.coreaas.findCoreAASReferenceType("HasSubmodelSemantic")!;
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: semanticElem });

            return submodel;
        }

        submodel.hasSemantic = (semanticElem: UAObject): SubmodelObject => {
            
            const hasSubmodelSemanticRefType = this.coreaas.findCoreAASReferenceType("HasSemantic")!;
            submodel.addReference({ referenceType: hasSubmodelSemanticRefType, nodeId: semanticElem });

            return submodel;
        }

        submodel.addSemanticId = get_semanticId_creator(this.coreaas, submodel);

        submodel.submodelOf = (aas: AASObject) => {
            assert(aas.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASType")!), "aas parameter is not an AASType instance.");

            const hasSubmodelRef = this.coreaas.findCoreAASReferenceType("HasSubmodel")!;
            aas.addReference({ referenceType: hasSubmodelRef, nodeId: submodel });
            return submodel;
        }

        submodel.addParent = get_parent_creator(this.coreaas, submodel);

        submodel.addElements = (elemArray:SubmodelElementObject[]): SubmodelObject => {
            assert(elemArray instanceof Array, "elemArray parameter is not an Array.");

            elemArray.forEach(el => {
                
                const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType")!;
                assert(el.typeDefinitionObj.isSupertypeOf(submodelElementType), "elemArray contains an element that is not a subtype instance of SubmodelElementType."); //isSupertypeOf is confusional. It should be isSubtypeOf

                const submodelElements = submodel.submodelElements;
                submodelElements.addReference({ referenceType: "Organizes", nodeId: el });
                submodel.referableChildrenMap.set(el.idShort._dataValue.value.value, el);
            });

            return submodel;
        }

        return submodel;
    }
}