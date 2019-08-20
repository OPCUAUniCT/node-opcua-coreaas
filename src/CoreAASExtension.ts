import { AddressSpace, ConstructorFunc, Namespace, UADataType, UAObject, UAObjectType, UAReferenceType, UAVariableType } from "node-opcua";
import * as path from "path";
import { AssetObject, AASObject, EDSObject, SubmodelPropertyObject, SubmodelObject, ConceptDescriptionObject, ConceptDictionaryObject, 
        DataSpecificationIEC61360, ReferenceElementObject, AASFileObject, SubmodelElementCollectionObject, ViewObject } from "./types";
import { AASBuilder, AdministrativeInformationBuilder, AASReferenceBuilder, AssetBuilder, DataSpecificationIEC61360Builder, 
        EmbeddedDataSpecificationBuilder, SubmodelPropertyBuilder, SubmodelBuilder, ConceptDescriptionBuilder, 
        ConceptDictionaryBuilder, SubmodelElementsBuilder, ViewBuilder } from "./builders/builder";
import { AASOptions, AASReferenceOptions, AdministrativeInformationOptions, AssetOptions, ConceptDescriptionOptions, ConceptDictionaryOptions, 
        DataSpecificationIECOptions, EmbeddedDataSpecificationOptions, SubmodelOptions, ReferenceElementOptions, FileOptions, SubmodelElementCollectionOptions, SubmodelPropertyOptions, ViewOptions } from "./options_types";

/**
 * This class represents the extension part of the OPC UA Server relevant to the CoreAAS Information Model.\
 * An instance of **CoreAASExtension** provides all the methods to populate the AddressSpace with instances of the ObjectTypes coming from CoreAAS.\
 * Furthermore it provides the Constructors for the Structured DataType defined in CoreAAS and lot of utilities methods to find Nodes in the Namespace of CoreAAS.
 */
export class CoreAASExtension {

    private _aasBuilder: AASBuilder;
    private _administrativeBuilder: AdministrativeInformationBuilder;
    private _aasReferenceBuilder: AASReferenceBuilder;
    private _assetBuilder: AssetBuilder;
    private _submodelPropertyBuilder: SubmodelPropertyBuilder;
    private _submodelBuilder: SubmodelBuilder;
    private _dataSpecificationIECBuilder: DataSpecificationIEC61360Builder;
    private _edsBuilder: EmbeddedDataSpecificationBuilder;
    private _conceptDescriptionBuilder: ConceptDescriptionBuilder;
    private _conceptDictionaryBuilder: ConceptDictionaryBuilder;
    private _submodelElementsBuilder: SubmodelElementsBuilder;
    private _viewBuilder: ViewBuilder;

    /** The complete URI of CoreAAS. */
    public readonly namespaceUri: string = "http://dieei.unict.it/coreAAS/";
    /** The absolute path to the CoreAAS xml file. */
    public readonly coreaasXmlFile: string = path.join(__dirname, "../nodesets/coreaas.xml");

    /** 
     * A Map containing all the Identifiables' ids as key and the relevant UAObject as value.
     * This attribute can be useful to implement function to resolve AAS References into Objects
     * in the AddressSpace. */
    public readonly identifiableMap: Map<string, UAObject> = new Map();
    
    /** 
     * @param addressSpace The Address Space instance of the current OPC UA Server.
     */
    constructor(public addressSpace: AddressSpace) {
        this._aasBuilder = new AASBuilder(this);
        this._administrativeBuilder = new AdministrativeInformationBuilder(this);
        this._aasReferenceBuilder = new AASReferenceBuilder(this);
        this._assetBuilder = new AssetBuilder(this);
        this._submodelPropertyBuilder = new SubmodelPropertyBuilder(this);
        this._submodelBuilder = new SubmodelBuilder(this);
        this._dataSpecificationIECBuilder = new DataSpecificationIEC61360Builder(this);
        this._edsBuilder = new EmbeddedDataSpecificationBuilder(this);
        this._conceptDescriptionBuilder = new ConceptDescriptionBuilder(this);
        this._conceptDictionaryBuilder = new ConceptDictionaryBuilder(this);
        this._submodelElementsBuilder = new SubmodelElementsBuilder(this);
        this._viewBuilder = new ViewBuilder(this);
    }
    
    /* Getters */
    /** The Namespace instance of the CoreAAS Information Model. */
    get coreAASNamespace(): Namespace {
        return this.addressSpace.getNamespace(this.namespaceUri);
    }

    /** The Namespace instance of the current Namespace. */
    get namespace(): Namespace {
        return this.addressSpace.getOwnNamespace();
    }
    
    /** The namespace index of the CoreAAS Information Model */
    get namespaceIndex(): number {
        return this.addressSpace.getNamespaceIndex(this.namespaceUri);
    }

    /* CoreAAS OPCUA Types */
    /** The Constructor of the Identifier Structured DataType. */
    get Identifier(): ConstructorFunc {
        const identifierDataType = this.coreAASNamespace.findDataType("Identifier")!;
        return (<any>this.addressSpace).getExtensionObjectConstructor(identifierDataType);
    }

    /** The Constructor of the Key Structured DataType. */
    get Key(): ConstructorFunc {
        const keyDataType = this.coreAASNamespace.findDataType("Key")!;
        return (<any>this.addressSpace).getExtensionObjectConstructor(keyDataType);
    }

    /* AddressSpace Builder methods */
    /**
     * Create and returns an instance of AASType ObjectType in the AddressSpace.
     */
    addAssetAdministrationShell(options: AASOptions): AASObject {
        return this._aasBuilder.addAssetAdministrationShell(options);
    }

    addAdministrativeInformation(options: AdministrativeInformationOptions): UAObject {
        return this._administrativeBuilder.addAdministrativeInformation(options);
    }

    addAASReference(options: AASReferenceOptions): UAObject {
        return this._aasReferenceBuilder.addAASReference(options);
    }

    addAsset(options: AssetOptions): AssetObject {
        return this._assetBuilder.addAsset(options);
    }

    addSubmodelProperty(options: SubmodelPropertyOptions): SubmodelPropertyObject {
        return this._submodelPropertyBuilder.addSubmodelProperty(options);
    }

    addReferenceElement(options: ReferenceElementOptions): ReferenceElementObject {
        return this._submodelElementsBuilder.addReferenceElement(options);
    }

    addAASFile(options: FileOptions): AASFileObject {
        return this._submodelElementsBuilder.addAASFile(options);
    }

    addSubmodelElementCollection(options: SubmodelElementCollectionOptions): SubmodelElementCollectionObject {
        return this._submodelElementsBuilder.addSubmodelElementCollection(options);
    }

    addSubmodel(options: SubmodelOptions): SubmodelObject {
        return this._submodelBuilder.addSubmodel(options);
    }

    addAASView(options: ViewOptions): ViewObject {
        return this._viewBuilder.addAASView(options);
    }

    addDataSpecificationIEC61360(options: DataSpecificationIECOptions): DataSpecificationIEC61360 {
        return this._dataSpecificationIECBuilder.addDataSpecificationIEC61360(options);
    }

    addEmbeddedDataSpecification(options: EmbeddedDataSpecificationOptions): EDSObject {
        return this._edsBuilder.addEmbeddedDataSpecification(options);
    }

    addConceptDescription(options: ConceptDescriptionOptions): ConceptDescriptionObject {
        return this._conceptDescriptionBuilder.addConceptDescription(options);
    }

    addConceptDictionary(options: ConceptDictionaryOptions): ConceptDictionaryObject {
        return this._conceptDictionaryBuilder.addConceptDictionary(options);
    }
    
    /* Utility methods */
    findCoreAASObjectType(name: string): UAObjectType | null {
        return this.addressSpace.findObjectType(name, this.namespaceIndex);
    }

    findCoreAASReferenceType(name: string): UAReferenceType | null {
        return this.addressSpace.findReferenceType(name, this.namespaceIndex);
    }
    
    findCoreAASVariableType(name: string): UAVariableType | null {
        return this.addressSpace.findVariableType(name, this.namespaceIndex);
    }
    
    findCoreAASDataType(name: string): UADataType | null {
        return this.addressSpace.findDataType(name, this.namespaceIndex);
    }

    getAASType(): UAObjectType {
        return this.findCoreAASObjectType("AASType")!;
    }

    getAdministrativeInformationType(): UAObjectType {
        return this.findCoreAASObjectType("AdministrativeInformationType")!;
    }

    getAssetType(): UAObjectType {
        return this.findCoreAASObjectType("AssetType")!;
    }

    getAASReferenceType(): UAObjectType {
        return this.findCoreAASObjectType("AASReferenceType")!;
    }
}

