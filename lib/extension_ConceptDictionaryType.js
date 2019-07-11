const assert = require("assert");

module.exports = function (opcua) {

    /**
     *Create a new instance of ConceptDictionaryType representing a ConceptDescription.
    *
    * @param {object} options
    * @param {string} options.browseName The BrowseName for the ConceptDictionary Object.
    * @param {string} options.idShort The short identifier for the ConceptDictionary.
    * @param {object} [options.nodeId] The string representation of the NodeId for the ConceptDictionary Object.
    * @param {object} [options.conceptDictionaryOf] The parent AASType instance containing the ConceptDictionary.
    * @param {object | array} [options.parent] An AASReferenceType Object or an Array of Key referencing to parent element for the ConceptDictionary.
    * @param {string | object | array} [options.description] A string, a LocalizedText or an Array of LocalizedText describing the ConceptDescription.
    * @returns {object} The Object Node representing ConceptDictionary.
    * 
    * @example
    *    addressSpace.addConceptDictionary({
    *        browseName: "ConceptDict_1",
    *        idShort: "ConceptDictionary_1",
    *        conceptDictionaryOf: aas_1,
    *        description: "A dictionary of concept for Festo Controller"
    *    });
    */
    opcua.AddressSpace.prototype.addConceptDictionary = function(options) {

        assert(typeof options.idShort !== "undefined", "No options.idShort parameter inserted!");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        const conceptDescriptionsFolder = addressSpace.rootFolder.objects.conceptDescriptions;
        
        const conceptDictionaryType = addressSpace.findCoreAASObjectType("ConceptDictionaryType");

        const conceptDictionary = namespace.addObject({
            typeDefinition: conceptDictionaryType,
            browseName: options.browseName || options.idShort + "_Dictionary",
            nodeId: options.nodeId
        });

        conceptDictionary.coreAASType = "ConceptDictionaryType";

        const folderType = addressSpace.findNode("FolderType").nodeId;

        //Add conceptDescriptions
        const conceptDescriptions = namespace.addObject({
            typeDefinition: folderType,
            browseName: "ConceptDescriptions",
            componentOf: conceptDictionary
        });

        let idShort = namespace.addVariable({
            propertyOf: conceptDictionary,
            browseName: "idShort",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String, 
                        value: options.idShort
                    });
                }
            }
        });

        //Add this ConceptDictionary to an AAS
        if (typeof options.conceptDictionaryOf !== "undefined") {
            assert(options.conceptDictionaryOf instanceof opcua.UAObject, "options.conceptDictionaryOf is not a UAObject.");
            assert(options.conceptDictionaryOf.coreAASType === "AASType", "options.conceptDictionaryOf is not a AASType Object.")
            
            const conceptDictionaries = options.conceptDictionaryOf.conceptDictionaries;
            conceptDictionaries.addReference({ referenceType: "Organizes", nodeId: conceptDictionary });
            options.conceptDictionaryOf.referableChildrenMap.set(conceptDictionary.idShort._dataValue.value.value, conceptDictionary);
        }

        //Add Parent
        if (typeof options.parent !== "undefined") {
            assert(Array.isArray(options.parent) || options.parent instanceof opcua.UAObject, "options.parent is neither a UAObject or an Array of Key.");
            assert(!options.parent.hasOwnProperty("parent"), "the ConceptDictionaryType Object already contains a Component with BrowseName parent");


            if (Array.isArray(options.parent)) {

                options.parent.forEach(el => assert(el.constructor.name === "Key", "Array parameter contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: conceptDictionary,
                    browseName: "parent",
                    keys: options.parent
                });
            } 
            else {
                assert(options.parent.coreAASType === "AASReferenceType", "options.parent is not an AASReferenceType instance.");

                conceptDictionary.addReference({ referenceType: "HasComponent", nodeId: options.parent});
            }
        }

        //Add description
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
                propertyOf: conceptDictionary,
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

        conceptDictionary.hasConceptDescriptions = (conceptDescriptions) => {
            assert(Array.isArray(conceptDescriptions) || conceptDescriptions.coreAASType === "ConceptDescriptionType", "conceptionDescriptions parameter is neither a ConceptDescriptionType object or an Array of ConceptDescriptionType objects.");

            const hasConceptDescriptionRefType = addressSpace.findCoreAASReferenceType("HasConceptDescription");

            if(Array.isArray(conceptDescriptions)) {
                conceptDescriptions.forEach(conceptDescription => {
                    assert(conceptDescription.coreAASType === "ConceptDescriptionType", "An element of the Array is not a ConceptDescriptionType instance.")
                    conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription});
                });
            }
            else {
                conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescriptions});
            }

            return conceptDictionary;
        }

        conceptDictionary.addParent = (parent) => {
            assert(Array.isArray(parent) || parent instanceof opcua.UAObject, "parent is neither a UAObject or an Array of Key.");
            assert(!conceptDictionary.hasOwnProperty("parent"), "the ConceptDictionaryType Object already contains a Component with BrowseName parent");

            if (Array.isArray(parent)) {

                parent.forEach(el => assert(el.constructor.name === "Key", "Array parameter contains an element that is not a Key."));

                addressSpace.addAASReference({
                    componentOf: conceptDictionary,
                    browseName: "parent",
                    keys: parent
                });
            } 
            else {
                assert(parent.coreAASType === "AASReferenceType", "parent is not an AASReferenceType instance.");

                conceptDictionary.addReference({ referenceType: "HasComponent", nodeId: parent});
            }
        }
        

        conceptDictionary.addConceptDescriptionRef = (conceptDescriptionRef) => {
            assert(Array.isArray(conceptDescriptionRef) || conceptDescriptionRef instanceof opcua.UAObject, "conceptDescriptionRef is neither a UAObject or an Array of Key.");

            if (Array.isArray(conceptDescriptionRef)) {

                conceptDescriptionRef.forEach(el => assert(el.constructor.name === "Key", "Array parameter contains an element that is not a Key."));

                addressSpace.addAASReference({
                    organizedBy: conceptDictionary.conceptDescriptions,
                    browseName: conceptDescriptionRef[conceptDescriptionRef.length - 1].value + "_Ref",
                    keys: conceptDescriptionRef
                });

            } 
            else {
                assert(conceptDescriptionRef.coreAASType === "AASReferenceType", "conceptDescriptionRef is not an AASReferenceType instance.");

                conceptDictionary.conceptDescriptions.addReference({ referenceType: "Organizes", nodeId: conceptDescriptionRef});
            }

            return conceptDictionary;
        }

        return conceptDictionary;
    };

};