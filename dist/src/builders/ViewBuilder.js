"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const builder_1 = require("./builder");
const assert = require("assert");
const builder_utilities_1 = require("./builder_utilities");
class ViewBuilder extends builder_1.Builder {
    constructor(coreaas) {
        super(coreaas);
    }
    addAASView(options) {
        assert(options.idShort != null, "options.idShort parameter is missing.");
        const viewType = this.coreaas.findCoreAASObjectType("ViewType");
        const view = this._namespace.addObject({
            typeDefinition: viewType,
            browseName: options.browseName || "View_" + options.idShort,
            nodeId: options.nodeId
        });
        view.referableChildrenMap = new Map();
        const folderType = this._addressSpace.findNode("FolderType").nodeId;
        const containedElements = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "ContainedElements",
            componentOf: view
        });
        //Add idShort
        const idShort = builder_utilities_1.get_idShort_creator(this.coreaas, view)(options.idShort);
        if (options.viewOf != null) {
            assert(options.viewOf.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASType")), "options.viewOf is not a AASType.");
            const views = options.viewOf.views;
            views.addReference({ referenceType: "Organizes", nodeId: view });
            options.viewOf.referableChildrenMap.set(options.idShort, view);
        }
        if (options.semanticId != null) {
            builder_utilities_1.get_semanticId_creator(this.coreaas, view)(options.semanticId);
        }
        if (options.parent != null) {
            builder_utilities_1.get_parent_creator(this.coreaas, view)(options.parent);
        }
        //Add description
        if (options.description != null) {
            const addDescriptionToView = builder_utilities_1.get_description_creator(this.coreaas, view);
            addDescriptionToView(options.description);
        }
        view.addSemanticId = builder_utilities_1.get_semanticId_creator(this.coreaas, view);
        view.addParent = builder_utilities_1.get_parent_creator(this.coreaas, view);
        view.addContainedElementRef = (elemRef) => {
            if (elemRef instanceof Array) {
                elemRef.forEach(el => assert(types_1.isKey(el), "Array parameter contains an element that is not a Key."));
                this.coreaas.addAASReference({
                    organizedBy: view.containedElements,
                    browseName: elemRef[elemRef.length - 1].value + "_Ref",
                    keys: elemRef
                });
            }
            else {
                assert(elemRef.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AASReferenceType")), "elemRef is not an AASReferenceType instance.");
                view.containedElements.addReference({ referenceType: "Organizes", nodeId: elemRef });
            }
            return view;
        };
        view.containsElements = (elements) => {
            const submodelElementType = this.coreaas.findCoreAASObjectType("SubmodelElementType");
            const containsElementRefType = this.coreaas.findCoreAASReferenceType("ContainsElement");
            if (elements instanceof Array) {
                elements.forEach(element => {
                    assert(element.typeDefinitionObj.isSupertypeOf(submodelElementType), "An element of the Array is not a SubmodelElementType instance.");
                    view.addReference({ referenceType: containsElementRefType, nodeId: element });
                    view.referableChildrenMap.set(element.idShort._dataValue.value.value, element);
                });
            }
            else {
                view.addReference({ referenceType: containsElementRefType, nodeId: elements });
                view.referableChildrenMap.set(elements.idShort._dataValue.value.value, elements);
            }
            return view;
        };
        return view;
    }
}
exports.ViewBuilder = ViewBuilder;
//# sourceMappingURL=ViewBuilder.js.map