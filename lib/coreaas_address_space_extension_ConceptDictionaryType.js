const assert = require("assert");

module.exports = function (opcua) {

    /**
     *Create a new instance of ConceptDictionaryType representing a ConceptDescription.
    *
    * @param {object} options
    * @param {string} options.browseName
    * @param {object} [options.nodeId]
    * @param {string} [options.idShort] The unique identifier for the AAS. The DataType is Identifier. 
    * @param {object} [options.conceptDictionaryOf] The parent AASType instance containing the ConceptDictionaryType.
    * @param {array | object} [options.hasConceptDescription] An UAObject or an Array of UA Object representing the ConceptDescription of the ConceptDictionary.
    * @param {array} [options.parent] an Array of Key referencing to parent element for the ConceptDictionary.
    * @param {string} [options.description] A description for the ConceptDictionary. 
    * @param {object | number} [options.kind] A Kind value specifying if the ConceptDictionary is Instance or Type.
    * @returns {object} The Object Node representing ConceptDictionary.
    */
    opcua.AddressSpace.prototype.addConceptDictionary = function(options) {

        assert(typeof options.browseName !== "undefined", "No options.browseName parameter inserted!");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        const conceptDescriptionsFolder = addressSpace.rootFolder.objects.conceptDescriptions;
        
        const conceptDictionaryType = addressSpace.findCoreAASObjectType("ConceptDictionaryType");

        const conceptDictionary = namespace.addObject({
            typeDefinition: conceptDictionaryType,
            browseName: options.browseName,
            nodeId: options.nodeId
        });

        //Add idShort
        if(typeof options.idShort !== "undefined") {
            namespace.addVariable({
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
        }

        //Add this ConceptDictionary to an AAS
        if (typeof options.conceptDictionaryOf !== "undefined") {
            assert(options.conceptDictionaryOf instanceof opcua.UAObject, "options.conceptDictionaryOf is not a UAObject.");
            
            const conceptDictionaries = options.conceptDictionaryOf.conceptDictionaries;
            conceptDictionaries.addReference({ referenceType: "Organizes", nodeId: conceptDictionary });
        }

        //Add hasConceptDescription
        if (typeof options.hasConceptDescription !== "undefined") {
            let conceptDescriptions = [];
            conceptDescriptions = _.concat(conceptDescriptions, options.conceptDescriptions)
            conceptDescriptions.forEach((cd) => assert(cd instanceof opcua.UAObject, "options.conceptDescriptions contains some element that is not UAObject."));            
            const hasConceptDescriptionRefType = addressSpace.findCoreAASReferenceType("HasConceptDescription");

            conceptDescriptions.forEach((cd) => conceptDictionary.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: cd }));            
        }

        //Add Parent
        if (typeof options.parent !== "undefined") {
            assert(Array.isArray(options.parent), "options.haSemantic is not an Array of Key.");

            addressSpace.addAASReference({
                componentOf: conceptDictionary,
                browseName: "parent",
                keys: options.parent
            });
        }

        //Add description
        if (typeof options.description !== "undefined") {
            assert(typeof(options.description) === "string", "Parameter options.description is not a string.");

            namespace.addVariable({
                propertyOf: conceptDictionary,
                browseName: "description",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: options.description});
                    }
                }
            });
        }

        //Add kind
        if (typeof options.kind !== "undefined") {

            let kind;

            if (typeof options.kind === "number") {
                kind = opcua.coreaas.Kind.get(options.kind);
            }
            else {
                assert(typeof options.kind === "object" && options.kind.constructor.name === opcua.coreaas.Kind.Instance.constructor.name, "options.kind is not a Kind enum.");
                kind = options.kind;
            }

            namespace.addVariable({
                propertyOf: conceptDictionary,
                browseName: "kind",
                dataType: addressSpace.findCoreAASDataType("Kind"),
                value: {
                    get: () => {
                        return new opcua.Variant({ dataType: opcua.DataType.Int32, value: kind });
                    }
                }
            });
        }

        //Convenience Methods
        conceptDictionary.addCategory = (options) => {
            namespace.addVariable({
                propertyOf: conceptDictionary,
                browseName: "category",
                dataType: options.dataType,
                value: options.value
            });            

            return conceptDictionary;
        }

        return conceptDictionary;
    };

};