import { UAObject } from "node-opcua-address-space/dist/src/ua_object";
import { RefArgument, ViewObject, isKey, Key } from "../types";
import { CoreAASExtension } from "../CoreAASExtension";
import { Builder } from "./builder";
import assert = require("assert");
import { get_idShort_creator, get_semanticId_creator, get_parent_creator, get_description_creator } from "./builder_utilities";
import { UAVariable } from "node-opcua-address-space/dist/src/ua_variable";
import { ViewOptions } from "../options_types";

export class ViewBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addAASView(options: ViewOptions): ViewObject {
        assert(options.idShort != null, "options.idShort parameter is missing.");

        const viewType = this.coreaas.findCoreAASObjectType("ViewType")!;

        const view = this._namespace.addObject({
            typeDefinition: viewType,
            browseName:    options.browseName || "View_" + options.idShort,
            nodeId:        options.nodeId
        }) as ViewObject;

        view.referableChildrenMap = new Map();

        const folderType = this._addressSpace.findNode("FolderType")!.nodeId;

        const containedElements = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "ContainedElements",
            componentOf: view
        });

        //Add idShort
        const idShort = get_idShort_creator(this.coreaas, view)(options.idShort);

        if (options.viewOf != null) {         
            assert(options.viewOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASType")!), "options.viewOf is not a AASType.");
            
            const views = options.viewOf.views;
            views.addReference({ referenceType: "Organizes", nodeId: view });
            options.viewOf.referableChildrenMap.set(options.idShort, view);
        }

        if (options.semanticId != null) {
            get_semanticId_creator(this.coreaas, view)(options.semanticId);
        }

        if (options.parent != null) {
            get_parent_creator(this.coreaas, view)(options.parent);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToView = get_description_creator(this.coreaas, view);
            addDescriptionToView(options.description);
        }

        view.addSemanticId = get_semanticId_creator(this.coreaas, view);
        view.addParent = get_parent_creator(this.coreaas, view);

        view.addContainedElementRef = (elemRef: RefArgument): ViewObject => {
            
            if (elemRef instanceof Array) {

                elemRef.forEach(el => assert(isKey(el), "Array parameter contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    organizedBy: view.containedElements,
                    browseName: (<Key>elemRef[elemRef.length - 1]).value + "_Ref",
                    keys: elemRef
                });
            } 
            else {
                assert(elemRef.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")!), "elemRef is not an AASReferenceType instance.");
                view.containedElements.addReference({ referenceType: "Organizes", nodeId: elemRef});
            }

            return view;
        }

        view.containsElements = (elements: UAObject | UAObject[]) => {
            const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType")!;
            const containsElementRefType = this.coreaas.findCoreAASReferenceType("ContainsElement")!;

            if(elements instanceof Array) {
                elements.forEach(element => {
                    assert(element.typeDefinitionObj.isSupertypeOf(submodelElementType), "An element of the Array is not a SubmodelElementType instance.")
                    view.addReference({ referenceType: containsElementRefType, nodeId: element});
                    view.referableChildrenMap.set((<UAObject & {idShort: UAVariable}> element).idShort._dataValue.value.value, element);
                });
            }
            else {
                view.addReference({ referenceType: containsElementRefType, nodeId: elements});
                view.referableChildrenMap.set((<UAObject & {idShort: UAVariable}> elements).idShort._dataValue.value.value, elements);
            }

            return view;
        }

        return view;
    }
}