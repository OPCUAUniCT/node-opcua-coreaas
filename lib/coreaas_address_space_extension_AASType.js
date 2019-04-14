const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
    * Create a new instance of AASType representing an Asset Administration Shell.
    *
    * @param {object} options
    * @param {Identifier} options.identification The unique identifier for the AAS. The DataType is Identifier.
    * @param {string} [options.nodeId] The string representation of the NodeId for the AAS Object.
    * @param {string} [options.browseName] The BrowseName for the AAS Object.
    * @param {array | object} [options.assetRef] An array of Key object composing an AAS reference to an AssetType instance or the AASReference instance itself.
    * @param {array | object} [options.derivedFromRef] An array of Key object composing an AAS reference to the derivation AAS or the AASReference instance itself. 
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info forS AAS. 
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the AAS. 
    * @returns {object} The Object Node representing the Asset Administration Shell
    * @example
    * addressSpace.addAssetAdministrationShell({
    *      browseName: "SampleAAS",
    *      description: "Festo Controller",
    *      identification: new Identifier({
    *          id: "www.admin-shell.io/aas-sample/1.0",
    *          idType: IdentifierType.URI
    *      }),
    *      derivedFrom: [ new Key({
    *          idType: KeyType.IRDI,
    *          local: false,
    *          type: KeyElements.AssetAdministrationShell,
    *          value: "AAA#1234-454#123456789"
    *      }) ]
    * });
    */
    opcua.AddressSpace.prototype.addAssetAdministrationShell = function(options) {

        assert(options.identification, "No options.identification parameter inserted!");
        assert("id" in options.identification && "idType" in options.identification, "options.identification is not an Identifier.");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const aasType = addressSpace.findCoreAASObjectType("AASType");
        const aasFolder = addressSpace.rootFolder.objects.assetAdministrationShells;

        const aas = namespace.addObject({
            typeDefinition: aasType,
            browseName:    options.browseName || "AAS_" + options.identification.id,
            nodeId:        options.nodeId,
            organizedBy: aasFolder,
        });

        aas.coreAASType = "AASType";

        const folderType = addressSpace.findNode("FolderType").nodeId;

        const submodels = namespace.addObject({
            typeDefinition: folderType,
            browseName: "Submodels",
            componentOf: aas
        });

        const conceptDictionaries = namespace.addObject({
            typeDefinition: folderType,
            browseName: "ConceptDictionaries",
            componentOf: aas
        });

        const views = namespace.addObject({
            typeDefinition: folderType,
            browseName: "Views",
            componentOf: aas
        });

        const identification = namespace.addVariable({
            propertyOf: aas,
            browseName: "identification",
            dataType: addressSpace.findCoreAASDataType("Identifier"),
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.ExtensionObject, 
                        value: options.identification
                    });
                }
            }
        });

        if (typeof options.derivedFromRef !== "undefined") {
            _addDerivedFromRef(options.derivedFromRef);                       
        }

        if (typeof options.assetRef !== "undefined") {
            _addAssetRef(options.assetRef);
        }

        if (typeof options.description !== "undefined") {
            assert( typeof(options.description) === "string" || 
                    options.description instanceof opcua.LocalizedText || 
                    Array.isArray(options.description), "Parameter options.description is neither a string nor a LocalizedText nor an Array.");

            let localizedTextArray = [];

            if(typeof options.description === "string") {
                localizedTextArray.push(opcua.LocalizedText.coerce(options.description));
            } else if(options.description instanceof opcua.LocalizedText) {
                localizedTextArray.push(options.description);
            } else {
                options.description.forEach(el => assert(el instanceof opcua.LocalizedText, "An element of the array is not a LocalizedText."));
                localizedTextArray = options.description;
            }

            namespace.addVariable({
                propertyOf: aas,
                browseName: "description",
                dataType: "LocalizedText",
                value: {
                    get: function() {
                        return new opcua.Variant({ 
                            dataType: opcua.DataType.LocalizedText, 
                            arrayType: opcua.VariantArrayType.Array,
                            value: localizedTextArray
                        });
                    }
                },
                valueRank: 1
            });
        }

        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            
            aas.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        /* 
         * Definition of AASType convenience methos 
         */

        aas.addSubmodelRef = (submodelRef) => {
            assert(Array.isArray(submodelRef) || submodelRef instanceof opcua.UAObject, "options.derivedFrom is neither a UAObject or an Array of Key.");
            
            if (Array.isArray(options.assetRef)) {

                submodelRef.forEach(el => assert(el.constructor.name === "Key", "Array parameter contains an element that is not a Key."));

                addressSpace.addAASReference({
                    organizedBy: aas.submodels,
                    browseName: submodelRef[submodelRef.length - 1].value + "_Ref",
                    keys: submodelRef
                });
            } 
            else {
                assert(submodelRef.coreAASType === "AASReferenceType", "parameter is not an AASReferenceType instance.");

                aas.submodels.addReference({ referenceType: "Organizes", nodeId: submodelRef});
            }

            return aas;
        }

        aas.hasSubmodel = (submodel) => {
            assert(submodel instanceof opcua.UAObject, "submodel parameter contains some element that is not UAObject.");
            assert(submodel.coreAASType === "SubmodelType", "asset parameter is not an SubmodelType instance.");

            const hasSubmodelRefType = addressSpace.findCoreAASReferenceType("HasSubmodel");
            aas.addReference({ referenceType: hasSubmodelRefType, nodeId: submodel });
            return aas;
        }

        aas.addViews = (views) => {
            assert(Array.isArray(views), "views parameter is not an Array.");
            views.forEach(view => {
                assert(view.coreAASType === "ViewType", "An element of the Array is not a ViewType instance.")
                aas.views.addReference({ referenceType: "Organizes", nodeId: view });
            });

            return aas;
        }

        aas.hasAsset = (asset) => {
            assert(asset instanceof opcua.UAObject, "asset parameter contains some element that is not UAObject.");
            assert(asset.coreAASType === "AssetType", "asset parameter is not an AssetType instance.");

            const hasAssetRefType = addressSpace.findCoreAASReferenceType("HasAsset");
            aas.addReference({ referenceType: hasAssetRefType, nodeId: asset });
            return aas;
        }

        aas.isDerivedFrom = (der_aas) => {
            assert(der_aas instanceof opcua.UAObject, "parameter contains some element that is not UAObject.");
            assert(der_aas.coreAASType === "AASType", "parameter is not an AASType instance.");

            const isDerivedFromRefType = addressSpace.findCoreAASReferenceType("IsDerivedFrom");
            aas.addReference({ referenceType: isDerivedFromRefType, nodeId: der_aas });
            return aas;
        }

        aas.addConceptDictionary = (dict) => {
            assert(dict instanceof opcua.UAObject, "parameter contains some element that is not UAObject.");
            assert(dict.coreAASType === "ConceptDictionaryType", "parameter is not an ConceptDictionaryType instance.");

            aas.conceptDictionaries.addReference({ referenceType: "Organizes", nodeId: dict });
            return aas;
        }

        aas.addDerivedFromRef = _addDerivedFromRef;

        aas.addAssetRef = _addAssetRef;

        function _addDerivedFromRef (derivedFromRef) {
            assert(Array.isArray(derivedFromRef) || derivedFromRef instanceof opcua.UAObject, "derivedFrom is neither a UAObject or an Array of Key.")
            assert(!aas.hasOwnProperty("derivedFrom"), "the AASType Object already contains a UA Property with Browsename derivedFrom");

            if (Array.isArray(derivedFromRef)) {

                derivedFromRef.forEach(el => assert(el.constructor.name === "Key", "derivedFromRef Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: aas,
                    browseName: "derivedFrom",
                    keys: derivedFromRef
                });
            } 
            else {
                assert(assetRef.coreAASType === "AASReferenceType", "assetRef is not an AASReferenceType instance.");

                aas.addReference({ referenceType: "HasComponent", nodeId: derivedFromRef});
            } 

            return aas;
        }

        function _addAssetRef(assetRef) {
            assert(Array.isArray(assetRef) || assetRef instanceof opcua.UAObject, "assetRef is neither a UAObject or an Array of Key.");
            assert(!aas.hasOwnProperty("asset"), "the AASType Object already contains a Component with Browsename asset");
            
            if (Array.isArray(assetRef)) {

                assetRef.forEach(el => assert(el.constructor.name === "Key", "assetRef Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: aas,
                    browseName: "asset",
                    keys: assetRef
                });
            } 
            else {
                assert(assetRef.coreAASType === "AASReferenceType", "assetRef is not an AASReferenceType instance.");

                aas.addReference({ referenceType: "HasComponent", nodeId: assetRef});
            }

            return aas;
        }

        return aas;
    };

};