node-opcua-coreaas
==========
![GitHub package.json version](https://img.shields.io/github/package-json/v/OPCUAUniCT/node-opcua-coreaas.svg)
![npm](https://img.shields.io/npm/v/node-opcua-coreaas.svg)

An extension for [node-opcua](https://github.com/node-opcua/node-opcua) implementing [CoreAAS](https://github.com/OPCUAUniCT/coreAAS) information model and providing new functions to easily implement your Asset Administration Shell using OPC UA and Node.js.

## Overview
**CoreAAS** information model is an OPC UA implementation of the Asset Administration Shell (AAS) metamodel [here](https://www.plattform-i40.de/I40/Redaktion/EN/Downloads/Publikation/2018-details-of-the-asset-administration-shell.html) provided by Platform Industrie 4.0.

**node-opcua-coreaas** is an extension for the Node.js stack [node-opcua](https://github.com/node-opcua/node-opcua) including new functions in order to easily populate your OPC UA Server with Objects related to AAS, Assets, Submodel, etc. without taking care about putting the Nodes and references in the right place. 

## Getting started
### Installing node-opcua-coreaas
In order to start developing your own AAS using node-opcua-coreaas, just create a new folder and initialize an npm project:
```
$ mkdir my-project
$ cd my-project
$ npm init
```
After that, you can install node-opcua-coreaas as dependency using the following command:
```
$ npm install node-opcua-coreaas --save
```
You don't need to install [node-opcua](https://github.com/node-opcua/node-opcua) as dependency for your project since node-opcua-coreaas already depends on it.

To extend the node-opcua module with the CoreAAS information model you need use follow the following code in your project:
```js
var opcua = require("node-opcua");

// add CoreAAS extension to node-opcua
require("node-opcua-coreaas")(opcua);
```
After this, the class [AddressSpace](http://node-opcua.github.io/api_doc/0.5.4/classes/AddressSpace.html) will be extended with all the convenience methods for adding CoreAAS elements in the OPC UA Server AddressSpace.

---
A functional example is the following:
```js
var opcua = require("node-opcua");
require("node-opcua-coreaas")(opcua);


var xmlFiles = [
    opcua.standard_nodeset_file,
    opcua.coreaas.nodeset_file
];

var server = new opcua.OPCUAServer({
    nodeset_filename: xmlFiles,
});

function post_initialize() {
    console.log("initialized");
    const addressSpace = server.engine.addressSpace;
    const Identifier = opcua.coreaas.getIdentifierConstructor(addressSpace.getCoreAASNamespace()).Identifier;
    const IdentifierType = opcua.coreaas.IdentifierType;
    const Key = opcua.coreaas.getKeyConstructor(addressSpace.getCoreAASNamespace()).Key;
    const KeyElements = opcua.coreaas.KeyElements;
    const KeyType = opcua.coreaas.KeyType;
    const Kind = opcua.coreaas.Kind;
    const PropertyCategory = opcua.coreaas.PropertyCategory;
    const PropertyValueType = opcua.coreaas.PropertyValueType;

    // Workaround  needed to give an Identifier to the DataSpecificationIEC61360Type
    addressSpace.fixSpecificationTypeIdentifications();

    // Create an AAS
    const aas_1 = addressSpace.addAssetAdministrationShell({
        browseName: "SampleAAS",
        description: "Festo Controller",
        identification: new Identifier({
            id: "www.admin-shell.io/aas-sample/1.0",
            idType: IdentifierType.URI
        }),
        derivedFrom: [ new Key({
            idType: KeyType.IRDI,
            local: false,
            type: KeyElements.AssetAdministrationShell,
            value: "AAA#1234-454#123456789"
        }) ]
    });

    /**
     * Add a Asset
     */
    addressSpace.addAsset({
        browseName: "3S7PLFDRS35",
        idShort: "3S7PLFDRS35",
        identification: new Identifier({
            id: "http://pk.festo.com/3S7PLFDRS35",
            idType: IdentifierType.URI
        }),
        kind: Kind.Instance,
        description: "Festo Controller",
        assetOf: aas_1,
        assetIdentificationModel: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.SubmodelElement,
            value: "//submodels/identification_3S7PLFDRS35"
        }) ]
    });

    /**
     * Start The OPC UA Server
     */
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);
```

### Limitation of node-opcua
When you start your first example, the console shows some error like
```
loadnodeset2 ( checking identifier type) : unsupported typeId in ExtensionObject ns=1;i=5002
loadnodeset2: unsupported typeId in ExtensionObject ns=1;i=5002
```
**JUST IGNORE THIS**, because actually the unrecognized ExtensionObject has been implemented in the library. The problem is due to 2 main reasons: 
1) NamespaceIndex used inside ExtensionObject values are not properly changed while the CoreAAS Information Model xml file is imported, and
2) node-opcua does not contain the necessary code to decode this kind of Structured value at the time it is importing information models.

More info can be found in [this](https://github.com/node-opcua/node-opcua/issues/603) issue of node-opcua.

As a result, you MUST include the following line of code as a Workaround in order to have the static Identifier value for the ObjectType "DataSpecificationIEC61360Type", since it is defined in the CoreAAS xml file and cannot be correctly imported:
```js
addressSpace.fixSpecificationTypeIdentifications();
```

## Demos
In the **demo** folder there are three different samples about using node-opcua-coreaas in order to create yout own Asset Administration Shell using node-opcua and the CoreAAS Information Model.

- "demo.js" is a single-file sample showing an AAS based on the example shown in [this](https://www.plattform-i40.de/I40/Redaktion/EN/Downloads/Publikation/2018-details-of-the-asset-administration-shell.html) document.
- "demo2.js" is the same as demo.js but shows how to do the same things using convenience methods.
- "pc_demo" is just a simple AAS showing the feature of a Workstation. The main aim of this sample is showing how is possible structuring a project in order to implement different Submodels for an AAS. Of course, the patterns and the techniques adopted to do so are up to developer.
- "pc_using_modeler" has been included in order to show how is possible import a custom xml Information Model (based on CoreAAS). Furthermore, this sample shows the limitation of node-opcua about using Custom DataType inside Information Model xml files. In fact, Structured values or Enumeration cannot be imported with such approach. That's why it is strongly raccomanded to add values of Structured or Enumeration DataType (coming from CoreAAS) via code for Variables or Attributes.

----

## Documentation

## **AddressSpace new methods**
The following methods are defined for the class [AddressSpace](http://node-opcua.github.io/api_doc/0.5.4/classes/AddressSpace.html) of node-opcua.

## addAssetAdministrationShell

Create a new instance of AASType representing an Asset Administration Shell.

### Parameters

-   `options` **[object][44]** 
    -   `options.identification` **[Identifier][47]** The unique identifier for the AAS. The DataType is Identifier.
    -   `options.nodeId` **[string][45]?** The string representation of the NodeId for the AAS Object.
    -   `options.browseName` **[string][45]?** The BrowseName for the AAS Object.
    -   `options.assetRef` **([object][44] \| [array][48])?** An array of Key object composing an AAS reference to an AssetType instance or the AASReference instance itself.
    -   `options.derivedFromFrom` **([array][48] \| [object][44])?** An array of Key object composing an AAS reference to the derivation AAS or the AASReference instance itself.
    -   `options.administration` **[object][44]?** An AdministrativeInformationType instance containing administration info forS AAS.
    -   `options.description` **[string][45]?** A description for the AAS.

### Examples

```javascript
const aas_1 = addressSpace.addAssetAdministrationShell({
        browseName: "SampleAAS",
        description: [  new opcua.LocalizedText({locale: "en", text: "Temperature Sensor AA23"}),
                        new opcua.LocalizedText({locale: "de", text: "Temperatursensor AA23"}) ],
        identification: new Identifier({
            id: "www.admin-shell.io/aas-sample/1.0",
            idType: IdentifierType.URI
        }),
        assetRef: [new Key({
            idType: KeyType.URI,
            local: true,
            type: KeyElements.Asset,
            value: "http://pk.festo.com/3S7PLFDRS35"
        })],
        derivedFromRef: [ new Key({
            idType: KeyType.IRDI,
            local: false,
            type: KeyElements.AssetAdministrationShell,
            value: "AAA#1234-454#123456789"
        }) ]
    });
```

Returns **[object][44]** The Object Node representing the Asset Administration Shell

## addAsset

Create a new instance of AssetType representing an Asset (both Type and Instance).

### Parameters

-   `options` **[object][45]** 
    -   `options.identification` **[Identifier][48]** The unique identifier for the AAS. The DataType is Identifier.
    -   `options.idShort` **[string][46]** A simple identification for the Asset..
    -   `options.nodeId` **[object][45]?** The string representation of the NodeId for the Asset Object.
    -   `options.browseName` **[string][46]?** The BrowseName for the Asset Object.
    -   `options.assetOf` **[object][45]?** The parent AASType containing the asset by means of HasAsset reference.
    -   `options.administration` **[object][45]?** An AdministrativeInformationType instance containing administration info for the Asset.
    -   `options.description` **[string][46]?** A description for the Asset.
    -   `options.kind` **([object][45] \| [number][50])?** A Kind value specifying if the Asset is Instance or Type.
    -   `options.assetIdentificationModel` **[array][49]?** An Array of Key referencing the Submodel for the identification of the Asset.

### Examples

```javascript
addressSpace.addAsset({
       browseName: "3S7PLFDRS35",
       idShort: "3S7PLFDRS35",
       identification: new Identifier({
           id: "http://pk.festo.com/3S7PLFDRS35",
           idType: IdentifierType.URI
       }),
       kind: Kind.Instance,
       description: "Festo Controller",
       assetOf: aas_1,
       assetIdentificationModel: [new Key({
           idType: KeyType.URI,
           local: false,
           type: KeyElements.SubmodelElement,
           value: "//submodels/identification_3S7PLFDRS35"
       })]
   });
```

Returns **[object][45]** The Object Node representing the Asset Administration Shell

## addAASReference

Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.

### Parameters

-   `options` **[object][51]** 
    -   `options.browseName` **[string][52]** The BrowseName for the AASReference Object.
    -   `options.description` **[string][52]?** A description for the AASReference Object.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the AASreference Object.
    -   `options.organizedBy` **[object][51]?** The parent node containing the AASReference by means of an Organizes Reference.
    -   `options.componentOf` **[object][51]?** The parent node containing the AASReference by means of an HasComponent Reference.
    -   `options.isCaseOf` **[object][51]?** The parent node containing the AASReference by means of an IsCaseOf Reference.
    -   `options.keys` **[object][51]** An array of Key constituting the AASReference.

### Examples

```javascript
addressSpace.addAASReference({
       componentOf: aas,
       browseName: "derivedFrom",
       keys: options.keys
   });
```

Returns **[object][51]** The Object Node representing the AASReference

## addEmbeddedDataSpecification

Create a new instance of AASReferenceType representing a Reference of the AAS metamodel.

### Parameters

-   `options` **[object][51]** 
    -   `options.browseName` **[string][52]** The BrowseName for the EmbeddedDataSpecification Object.
    -   `options.hasDataSpecification` **[array][55]** an array of Key list referring to the Data Specification Template,
    -   `options.dataSpecificationContent` **[object][51]?** an UA Object of type DataSpecificationType.
    -   `options.embeddedDataSpecificationOf` **[object][51]?** The parent node containing the EmbeddedataSpecification by means of an HasEmbeddedDataSpecificationReference.
    -   `options.description` **[string][52]?** A description for the EmbeddedDataSecification Object.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the EmbeddedDataSpecification Object.

### Examples

```javascript
addressSpace.addEmbeddedDataSpecification({
       browseName: "EmbeddedDS_1",
       hasDataSpecification: [new Key({
           idType: KeyType.URI,
           local: false,
           type: KeyElements.GlobalReference,
           value: "www.admin-shell.io/DataSpecificationTemplates/DataSpecificationIEC61360"
       })],
   })
```

Returns **[object][51]** The Object Node representing the EmbeddedDataSpecificationType

## addDataSpecificationIEC61360

Create a new instance of DataSpecificationIEC61360Type representing a Reference of the AAS metamodel.

### Parameters

-   `options` **[object][51]** 
    -   `options.preferredName` **[string][52]** 
    -   `options.shortName` **[string][52]** 
    -   `options.valueFormat` **[string][52]** 
    -   `options.definition` **[string][52]?** 
    -   `options.browseName` **[string][52]?** The BrowseName for the DataSpecificationIEC61360 Object.
    -   `options.unitId` **[array][55]?** An array of Key referencing a Unit definition
    -   `options.description` **[string][52]?** The descrption of the DataSpecificationIEC61360 Object.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the DataSpecificationIEC61360 Object.

Returns **[object][51]** The Object Node representing the EmbeddedDataSpecificationType

## addSubmodel

Create a new instance of SubmodelType representing a Submodel (both Type and Instance).

### Parameters

-   `options` **[object][51]** 
    -   `options.identification` **[object][51]** The unique identifier for the AAS. The DataType is Identifier.
    -   `options.idShort` **[string][52]** The unique identifier for the AAS. The DataType is Identifier.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the Submodel Object.
    -   `options.browseName` **[string][52]?** The BrowseName for the Submodel Object.
    -   `options.submodelOf` **[object][51]?** The parent AASType containing the Submodel.
    -   `options.hasSemantic` **[object][51]?** an Array of Key referencing to the Semantic element for the Submodel.
    -   `options.hasSubmodelSemantic` **[object][51]?** A SubmodelType instance with kind = Type defining the semantic for this Submodel.
    -   `options.administration` **[object][51]?** An AdministrativeInformationType instance containing administration info for the Submodel.
    -   `options.description` **[string][52]?** A description for the Submodel.
    -   `options.kind` **([object][51] \| [number][56])?** A Kind value specifying if the Submodel is Instance or Type.

### Examples

```javascript
addressSpace.addSubmodel({
       browseName: "12345679",
       kind: Kind.Instance,
       idShort: "12345679",
       identification: new Identifier({
           id: "http://www.zvei.de/demo/submodel/12345679",
           idType: IdentifierType.URI
       }),
       hasSemantic: [new Key({
           idType: KeyType.URI,
           local: false,
           type: KeyElements.GlobalReference,
           value: "http://www.zvei.de/demo/submodelDefinitions/87654346"
       })],
       submodelOf: aas_1
   });
```

Returns **[object][51]** The Object Node representing the Asset Administration Shell

## addSubmodelProperty

Create a new instance of SubmodelPropertyType representing a Submodel Property (both Type and Instance).

### Parameters

-   `options` **[object][51]** 
    -   `options.idShort` **[string][52]** The short identifier of the SubmodelProperty.
    -   `options.nodeId` **[string][52]?** The string representation of the NodeId for the SubmodelProperty Object.
    -   `options.browseName` **[string][52]?** The BrowseName of the SubmodelProperty Object.
    -   `options.submodelElementOf` **[object][51]?** The parent SubmodelType instance containing the SubmodelProperty.
    -   `options.hasSemantic` **[array][55]?** an Array of Key referencing to the Semantic element for the SubmodelProperty.
    -   `options.hasLocalSemantic` **[object][51]?** an Object local the AAS containing to the Semantic element to be referenced by means of HasLocalSemantic Reference.
    -   `options.parent` **[array][55]?** an Array of Key referencing to parent element for the SubmodelProperty.
    -   `options.description` **[string][52]?** A description for the SubmodelProperty.
    -   `options.category` **[object][51]?** An enum value defining the category of the Submodel Property.
    -   `options.kind` **([object][51] \| [number][56])?** A Kind value specifying if the SubmodelProperty is Instance or Type.
    -   `options.valueId` **[array][55]?** an Array of Key referencing to the an external value for the SubmodelProperty.
    -   `options.value` **[object][51]?** An Object containing the value for the Submodel Property. The type depends from valueType.
        -   `options.value.dataType` **[object][51]?** The DataType of the value contained in options.value.value
        -   `options.value.value` **[object][51]?** An object defining the get function to return a Variant containing the actual value.
    -   `options.valueType` **[object][51]?** An enum value defining the XSD DataType corresponding to the value in options.value.

### Examples

```javascript
addressSpace.addSubmodelProperty({
       browseName: "NMAX",
       idShort: "NMAX",
       submodelElementOf: submodel_1,
       hasSemantic: [new Key({
           idType: KeyType.IRDI,
           local: true,
           type: KeyElements.ConceptDescription,
           value: "0173-1#02-BAA120#007"
       })],
       category: PropertyCategory.PARAMETER,
       valueType: PropertyValueType.Double,
       value: {
           dataType: "Double",
           value: {
               get: () => {
                   return new opcua.Variant({
                       dataType: opcua.DataType.Double,
                       value: 2000
                   });
               }
           }
       }
   });
```

Returns **[object][51]** The Object Node representing Submodel Property.

## addAdministrativeInformation

Create a new instance of AdministrativeInformationType representing a Reference of the AAS metamodel.

### Parameters

-   `options` **[object][51]** 
    -   `options.componentOf` **[object][51]** The parent node containing the AdministrativeInformation by means of an HasComponent Reference.
    -   `options.version` **[string][52]?** A string representation of the version.
    -   `options.revision` **[string][52]?** A string representation of the revision number.
    -   `options.browseName` **[string][52]?** The BrowseName for the AdministrativeInformation Object.
    -   `options.description` **[string][52]?** A description for the AdministrativeInformation Object.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the AdministrativeInformation Object.

Returns **[object][51]** The Object Node representing the AdministrativeInformationType

## addConceptDictionary

Create a new instance of ConceptDictionaryType representing a ConceptDescription.

### Parameters

-   `options` **[object][51]** 
    -   `options.browseName` **[string][52]** The BrowseName for the ConceptDictionary Object.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the ConceptDictionary Object.
    -   `options.idShort` **[string][52]?** The short identifier for the ConceptDictionary.
    -   `options.conceptDictionaryOf` **[object][51]?** The parent AASType instance containing the ConceptDictionary.
    -   `options.hasConceptDescription` **([array][55] \| [object][51])?** An UAObject or an Array of UA Object representing the ConceptDescription of the ConceptDictionary.
    -   `options.parent` **[array][55]?** an Array of Key referencing to parent element for the ConceptDictionary.
    -   `options.description` **[string][52]?** A description for the ConceptDictionary.
    -   `options.kind` **([object][51] \| [number][56])?** A Kind value specifying if the ConceptDictionary is Instance or Type.

### Examples

```javascript
addressSpace.addConceptDictionary({
       browseName: "ConceptDict_1",
       idShort: "ConceptDictionary_1",
       conceptDictionaryOf: aas_1,
       description: "A dictionary of concept for Festo Controller"
   });
```

Returns **[object][51]** The Object Node representing ConceptDictionary.

## addConceptDescription

Create a new instance of ConceptDescriptionType.

### Parameters

-   `options` **[object][51]** 
    -   `options.identification` **[object][51]** The unique identifier for the AAS. The DataType is Identifier.
    -   `options.nodeId` **[object][51]?** The string representation of the NodeId for the ConceptDescription Object.
    -   `options.browseName` **[string][52]?** The BrowsName of the ConceptDescription Object.
    -   `options.conceptDescriptionOf` **[object][51]?** The parent ConceptDictionary containing the ConceptDescription by means of HasConceptDescription Reference.
    -   `options.localSemanticOf` **[object][51]?** The SubmodelElement this ConceptDescription defines semantic for.
    -   `options.hasEmbeddedDataSpecification` **([array][55] \| [object][51])?** An EmbeddedDataSpecification or an Array of EmbeddedDataSpecification.
    -   `options.administration` **[object][51]?** An AdministrativeInformationType instance containing administration info for the ConceptDescription.
    -   `options.description` **[string][52]?** A description for the ConceptDescription.

### Examples

```javascript
addressSpace.addConceptDescription({
       browseName: "N",
       identification: new Identifier({
           id: "www.festo.com/dic/08111234",
           idType: IdentifierType.URI
       }),
       hasEmbeddedDataSpecification: embedded_1,
       conceptDescriptionOf: conceptDictionary,
       localSemanticOf: rotationSpeed
   });
```

Returns **[object][51]** The Object Node representing the ConceptDescription.

## **AASType Object convenience methods**
## addSubmodelRef

Add an existent AASReferenceType instance referring to a Submodel or create a new one. It uses Organizes Reference.

### Parameters

-   `submodel` **([object][44] \| [array][48])?** An array of Key object composing an AAS reference to a SubmodelType instance or the AASReference instance itself. 

Returns **[object][51]** The Object Node representing the Asset Administration Shell

## hasSubmodel

Add an existent SubmodelType instance to the AAS by means of HasAsset Reference.

### Parameters

-   `submodel` **[object][51]** An existent SubmodelType instance. 

Returns **[object][51]** The Object Node representing the Asset Administration Shell

## addViews

Add an Array of existent ViewType instances to the AAS.

### Parameters

-   `views` **[array][55]** An array of ViewType instances to be added under Views Folder of the AAS by means of Organizes References. 

Returns **[object][51]** The Object Node representing the Asset Administration Shell

## isDerivedFrom

Add an existent AASType instance to the AAS by means of IsDerivedFrom Reference.

### Parameters

-   `der_aas` **[object][51]** An existent AASType instance. 

Returns **[object][51]** The Object Node representing the Asset Administration Shell

## addConceptDictionary

Add an existent ConceptDictionaryType instance to the AAS.

### Parameters

-   `dict` **[object][51]** An existent ConceptDictionaryType instance. 

Returns **[object][51]** The Object Node representing the Asset Administration Shell

## **ConceptDescriptionType Object convenience methods**
## IsCaseOf

Add a new IsCaseOf.

### Parameters

-   `options` **[object][51]** 
    -   `options.browseName` **[string][52]** 
    -   `options.keys` **[array][55]** An array of Key or an array of array of Key referencing an external entity.

Returns **[object][51]** The Object Node representing the ConceptDescription.

## **New Structured DataType**
## Identifier

**Extends BaseUAObject**

A DataType used for identificatin of Identifiable entities.

### Parameters

-   `options` **[Object][55]** 
    -   `options.id` **[string][56]** The id of the Identifier.
    -   `options.idType` **[number][57]** An enumeration of value specifying the type of the identifier. The DataType is IdentifierType.

### Examples

```javascript
// To obtain the Constructor of this Class you need to pass the namespaceindex of the current OPC UA Server.
  const Identifier = opcua.coreaas.getIdentifierConstructor(addressSpace.getCoreAASNamespace()).Identifier;
  const id = new Identifier({
      id: "www.admin-shell.io/aas-sample/1.0",
      idType: IdentifierType.URI
  })
```

## Key

**Extends BaseUAObject**

A DataType used for Key inside AASReference entities.

### Parameters

-   `options` **[Object][55]** 
    -   `options.idType` **[number][57]** An enumeration of value specifying the type of the identifier. The DataType is IdentifierType.
    -   `options.local` **bool** A boolean specifying if the referenced entity is local to the AAS.
    -   `options.type` **[number][57]** Enumeration identifing the entity referred by this key.
    -   `options.value` **[string][56]** The identifier of the entity.

### Examples

```javascript
// To obtain the Constructor of this Class you need to pass the namespaceindex of the current OPC UA Server.
  new Key({
    idType: KeyType.IRDI,
    local: false,
    type: KeyElements.AssetAdministrationShell,
    value: "AAA#1234-454#123456789"
  })
```


[1]: #node-opcua-coreaas

[2]: #parameters

[3]: #identifier

[4]: #parameters-1

[5]: #id

[6]: #idtype

[7]: #idtype-1

[8]: #local

[9]: #type

[10]: #value

[11]: #encode

[12]: #parameters-2

[13]: #encode-1

[14]: #parameters-3

[15]: #decode

[16]: #parameters-4

[17]: #decode-1

[18]: #parameters-5

[19]: #addassetadministrationshell

[20]: #parameters-6

[21]: #examples

[22]: #addasset

[23]: #parameters-7

[24]: #examples-1

[25]: #addaasreference

[26]: #parameters-8

[27]: #examples-2

[28]: #addembeddeddataspecification

[29]: #parameters-9

[30]: #examples-3

[31]: #adddataspecificationiec61360

[32]: #parameters-10

[33]: #addsubmodel

[34]: #parameters-11

[35]: #examples-4

[36]: #addsubmodelproperty

[37]: #parameters-12

[38]: #examples-5

[39]: #addadministrativeinformation

[40]: #parameters-13

[41]: #addconceptdictionary

[42]: #parameters-14

[43]: #examples-6

[44]: #addconceptdescription

[45]: #parameters-15

[46]: #examples-7

[47]: #addnewsubmodel

[48]: #parameters-16

[49]: #iscaseof

[50]: #parameters-17

[51]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[52]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[53]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[54]: #identifier

[55]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[56]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number