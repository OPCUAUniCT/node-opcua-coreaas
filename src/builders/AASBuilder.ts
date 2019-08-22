import { AddressSpace, DataType, Namespace, NodeIdLike, UAObject, UAObjectType, Variant } from "node-opcua";
import { BaseUAObject } from "node-opcua-factory";
import { get_description_creator, get_identification_creator } from "./builder_utilities";
import { CoreAASExtension } from "../CoreAASExtension";
import { CoreAASObjectsFolder, isIdentifier, RefArgument, AASObject, isKey, AssetObject, Identifier, SubmodelObject, ConceptDictionaryObject, ViewObject } from "../types";
import assert = require("assert");
import { Builder } from "./builder";
import { AASOptions } from "../options_types";

export class AASBuilder extends Builder {

    constructor(coreaas: CoreAASExtension) {
        super(coreaas);
    }

    addAssetAdministrationShell(options: AASOptions): AASObject {
        
        assert(isIdentifier(options.identification), "options.identification has not the internal structure of an Identifier");
        
        const aasType: UAObjectType = this.coreaas.getAASType();
        const aasFolder = (<CoreAASObjectsFolder> this._addressSpace.rootFolder.objects).assetAdministrationShells;

        const aas: AASObject = this._namespace.addObject({
            typeDefinition: aasType,
            browseName:    options.browseName || "AAS_" + (<Identifier>options.identification).id,
            nodeId:        options.nodeId,
            organizedBy: aasFolder,
        }) as AASObject;

        aas.referableChildrenMap = new Map();
        this.coreaas.identifiableMap.set(options.identification.id, aas);

        const folderType = this._addressSpace.findObjectType("FolderType")!.nodeId;

        const submodels = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "Submodels",
            componentOf: aas
        });

        const conceptDictionaries = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "ConceptDictionaries",
            componentOf: aas
        });

        const views = this._namespace.addObject({
            typeDefinition: folderType,
            browseName: "Views",
            componentOf: aas
        });

        const identification = get_identification_creator(this.coreaas, aas)(options.identification);

        if (options.derivedFromRef != null) {
            this._create_addDerivedFromRef(aas)(options.derivedFromRef);
        }

        if (typeof options.assetRef !== "undefined") {
            this._create_addAssetRef(aas)(options.assetRef);
        }

        //Add description
        if (options.description != null) {
            const addDescriptionToAas = get_description_creator(this.coreaas, aas);
            addDescriptionToAas(options.description);
        }

        if (options.administration != null) {
            
            assert(options.administration.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("AdministrativeInformationType")!) , "options.administration is not an AdministrativeInformationType Object.")
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'");
            
            aas.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        /* Add convenient method */
        aas.hasAsset = (asset: AssetObject): AASObject => {
            assert(asset.typeDefinitionObj.isSupertypeOf(this.coreaas.getAssetType()), "asset is not an AssetType instance");

            const hasAssetRefType = this.coreaas.findCoreAASReferenceType("HasAsset")!;
            aas.addReference({ referenceType: hasAssetRefType, nodeId: asset });
            return aas;
        }

        aas.isDerivedFrom = (der_aas: AASObject): AASObject => {
            assert(der_aas.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASType()), "asset is not an AssetType instance");

            const isDerivedFromRefType = this.coreaas.findCoreAASReferenceType("IsDerivedFrom")!;
            aas.addReference({ referenceType: isDerivedFromRefType, nodeId: der_aas });
            return aas;
        }

        aas.addConceptDictionary = (dict: ConceptDictionaryObject): AASObject => {
            assert(dict.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ConceptDictionaryType")!), "parameter is not an ConceptDictionaryType instance.");

            aas.conceptDictionaries.addReference({ referenceType: "Organizes", nodeId: dict });
            aas.referableChildrenMap.set(dict.idShort._dataValue.value.value, dict);
            return aas;
        }

        aas.addSubmodelRef = (submodelRef: RefArgument):AASObject => {
            if (submodelRef instanceof Array) {

                submodelRef.forEach(el => assert(isKey(el), "submodelRef parameter contains an element that is not a Key."));

                this.coreaas.addAASReference({
                    organizedBy: aas.submodels,
                    browseName: (<any>submodelRef[submodelRef.length - 1]).value + "_Ref",
                    keys: submodelRef
                });
            } 
            else {
                assert(submodelRef.typeDefinitionObj.isSupertypeOf(this.coreaas.getAASReferenceType()), "submodelRef is not an AASReferenceType instance.");

                aas.submodels.addReference({ referenceType: "Organizes", nodeId: submodelRef});
            }

            return aas;
        }

        aas.hasSubmodel = (submodel:SubmodelObject): AASObject => {
            
            assert(submodel.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("SubmodelType")!), "asset parameter is not an SubmodelType instance.");

            const hasSubmodelRefType = this.coreaas.findCoreAASReferenceType("HasSubmodel")!;
            aas.addReference({ referenceType: hasSubmodelRefType, nodeId: submodel });
            return aas;
        }

        aas.addViews = (views: ViewObject[]): AASObject => {
            assert(views instanceof Array, "views parameter is not an Array.");
            views.forEach(view => {
                assert(view.typeDefinitionObj.isSupertypeOf(this.coreaas.findCoreAASObjectType("ViewType")!), "An element of the Array is not a ViewType instance.")
                aas.views.addReference({ referenceType: "Organizes", nodeId: view });
                aas.referableChildrenMap.set(view.idShort._dataValue.value.value, view);
            });

            return aas;
        }

        aas.addDerivedFromRef = this._create_addDerivedFromRef(aas);
        aas.addAssetRef = this._create_addAssetRef(aas);

        return aas;
    }

    private _create_addDerivedFromRef(aas: AASObject): (derivedFrom: RefArgument) => AASObject {
        const self = this;
        
        return function(derivedFrom: RefArgument): AASObject {
            assert(!aas.hasOwnProperty("derivedFrom"), "the AASType Object already contains a UA Property with Browsename derivedFrom");

            if (derivedFrom instanceof Array) {

                derivedFrom.forEach(el => assert(isKey(el), "derivedFrom parameter contains an element that is not a Key."));

                self.coreaas.addAASReference({
                    componentOf: aas,
                    browseName: "derivedFrom",
                    keys: derivedFrom
                });
            } 
            else {
                assert(derivedFrom.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");

                aas.addReference({ referenceType: "HasComponent", nodeId: derivedFrom});
            } 

            return aas;
        }
    }

    private _create_addAssetRef(aas: AASObject): (assetRef: RefArgument) => AASObject{
        const self = this;

        return function(assetRef: RefArgument): AASObject {
            assert(!aas.hasOwnProperty("asset"), "the AASType Object already contains a UA Property with Browsename asset");

            if (assetRef instanceof Array) {

                assetRef.forEach(el => assert(isKey(el), "assetRef parameter contains an element that is not a Key."));

                self.coreaas.addAASReference({
                    componentOf: aas,
                    browseName: "asset",
                    keys: assetRef
                });
            } 
            else {
                assert(assetRef.typeDefinitionObj.isSupertypeOf(self.coreaas.getAASReferenceType()), "model is not an AASReferenceType Object");
                assert(assetRef.browseName.name === "asset", "the browsename of assetRef is not asset");

                aas.addReference({ referenceType: "HasComponent", nodeId: assetRef});
            } 

            return aas;
        }
    }
}