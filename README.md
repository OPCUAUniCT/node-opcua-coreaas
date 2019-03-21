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
- "pc_demo" is just a simple AAS showing the feature of a Workstation. The main aim of this sample is showing how is possible structuring a project in order to implement different Submodels for an AAS. Of course, the patterns and the techniques adopted to do so are up to developer.
- "pc_using_modeler" has been included in order to show how is possible import a custom xml Information Model (based on CoreAAS). Furthermore, this sample shows the limitation of node-opcua about using Custom DataType inside Information Model xml files. In fact, Structured values or Enumeration cannot be imported with such approach. That's why it is strongly raccomanded to add values of Structured or Enumeration DataType (coming from CoreAAS) via code for Variables or Attributes. 

## Documentation
Coming soon...