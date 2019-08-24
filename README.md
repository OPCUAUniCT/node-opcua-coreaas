node-opcua-coreaas
==========
![GitHub package.json version](https://img.shields.io/github/package-json/v/OPCUAUniCT/node-opcua-coreaas.svg)
![npm](https://img.shields.io/npm/v/node-opcua-coreaas.svg)

An extension for [node-opcua](https://github.com/node-opcua/node-opcua) implementing [CoreAAS](https://github.com/OPCUAUniCT/coreAAS) Information Model and providing new functions to easily implement your Asset Administration Shell using OPC UA and Node.js.

**NOT AVAILABLE ON NPM. COMING SOON.**

This new version has been completely rewritten in **typescript** to easily develop OPC UA Server supporting CoreAAS an take advantage of the type annotations and aother features that typescript introduce. It is worth noting that this new version is not compatible with the version 0.2.2. The API has been completely re-designed and now creating an OPC UA Server supporting CoreAAS Information Model is more linear and no strange workaround or fix are required.

Since Typescript is transpilled in Javascript, you are not forced to write your server in Typescript. Feel free to use node-opcua-coreaas in your Javascript code. 

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
You don't need to install [node-opcua](https://github.com/node-opcua/node-opcua) as dependency for your project since node-opcua-coreaas already depends on it and re-export all its API. Be careful if you decide to use node-opcua as dependancy, because the version you install may be different from the one node-opcua-core aas depends on.

Creating an OPC UA Server suporting core AAS is very simple. The following example shows how to create a sample Server wxposing an Asset Administration Shell with a Submodel and the physical Asset the AAS is representing:
```typescript
import path from "path";
import { coreaasXmlFile, nodesets, localizedText, CoreServer, IdentifierType, Kind, KeyType, KeyElements } from ".";

let xmlFiles = [nodesets.standard_nodeset_file, coreaasXmlFile]

let server = new CoreServer({
    nodeset_filename: xmlFiles,
    port: 4848
})

function post_initialize() {

    const Identifier = server.coreaas.Identifier;
    const Key = server.coreaas.Key;

    let admin = server.coreaas.addAdministrativeInformation({
        version: "555",
        revision: "1825"
    });

    const aas_1 = server.coreaas.addAssetAdministrationShell({
        browseName: "SampleAAS",
        description: [  new LocalizedText({locale: "en", text: "Festo Controller"}),
                        new LocalizedText({locale: "de", text: "Festo Controller"}) ],
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
        }) ],
        administration: admin
    }).addSubmodelRef([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "http://www.zvei.de/demo/submodel/12345679"
    })]);;

    let asset = server.coreaas.addAsset({
        browseName: "3S7PLFDRS35",
        idShort: "3S7PLFDRS35",
        identification: new Identifier({
            id: "http://pk.festo.com/3S7PLFDRS35",
            idType: IdentifierType.URI
        }),
        kind: Kind.Instance,
        description: "Festo Controller Asset",
        //assetOf: aas_1,
        assetIdentificationModelRef: [ new Key({
            idType: KeyType.URI,
            local: false,
            type: KeyElements.Submodel,
            value: "//submodels/identification_3S7PLFDRS35"
        }) ]
    });

    aas_1.hasAsset(asset)
    .addSubmodelRef([new Key({
        idType: KeyType.URI,
        local: true,
        type: KeyElements.Submodel,
        value: "http://www.zvei.de/demo/submodel/12345679"
    })]);

    /**
     * Start The OPC UA Server
     */
    server.start(function () {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);
```

Of course this is a very simple example. More entities, like SubmodelElements and ConceptDescriptions, can be added in the AddressSpace.

## Demos
You can found 2 demo files in the project. Just use it as a fully example about how to use node-opua-coreaas.

- "demo.js" is a single-file sample showing an AAS based on the example shown in [this](https://www.plattform-i40.de/I40/Redaktion/EN/Downloads/Publikation/2018-details-of-the-asset-administration-shell.html) document.
- "demo2.js" is the same as demo.js but with more elements and shows how to do the same things using convenience methods.
----

## Documentation

The main entity of node-opcua-coreaas are CoreServer and CoreAASExtension:

- **CoreServer** is the main class you use to create an OPC UA Server supporting CoreAAS. It is a subclass of **OPCUAServer** of node-opcua.
- **CoreAASExtension** is the extension part of the CoreServer exposing all the methods necessary to create CoreAAS ObjectTypes instances inside the AddressSpace. Users should not use this class directly, but the property **coreaas** of CoreServer will provide a CoreAASExtension instance bounded to the AddressSpace that users should use to create CoreAAS entities.

More details about the API can be found in the [documentation]().

## References

Coming soon...