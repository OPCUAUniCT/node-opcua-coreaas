const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
    * Create a new instance of ConceptDescriptionType organized by the ConceptDescriptions Folder.
    *
    * @param {object} options
    * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {object} [options.nodeId] The string representation of the NodeId for the ConceptDescription Object.
    * @param {string} [options.browseName] The BrowsName of the ConceptDescription Object.
    * @param {object} [options.conceptDescriptionOf] The parent ConceptDictionary containing the ConceptDescription by means of HasConceptDescription Reference.
    * @param {array | object} [options.hasEmbeddedDataSpecifications] An EmbeddedDataSpecification or an Array of EmbeddedDataSpecification.
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the ConceptDescription. 
    * @param {string} [options.description] A description for the ConceptDescription. 
    * @returns {object} The Object Node representing the ConceptDescription.
    * 
    * @example
    *    addressSpace.addConceptDescription({
    *        browseName: "N",
    *        identification: new Identifier({
    *            id: "www.festo.com/dic/08111234",
    *            idType: IdentifierType.URI
    *        }),
    *        hasEmbeddedDataSpecification: embedded_1,
    *        conceptDescriptionOf: conceptDictionary
    *    });
    */
    opcua.AddressSpace.prototype.addConceptDescription = function(options) {

        assert(typeof options.identification !== "undefined", "No options.identification parameter inserted!");
        assert("id" in options.identification && "idType" in options.identification, "options.identification is not an Identifier.");

        const addressSpace  = this;
        const namespace = addressSpace.getOwnNamespace();
        
        const conceptDescriptionType = addressSpace.findCoreAASObjectType("ConceptDescriptionType");
        const conceptDescriptions = addressSpace.rootFolder.objects.conceptDescriptions;

        const conceptDescription = namespace.addObject({
            typeDefinition: conceptDescriptionType,
            browseName:    options.browseName || "ConceptDescription_" + options.identification.id,
            nodeId:        options.nodeId,
            organizedBy: conceptDescriptions,
        });

        conceptDescription.coreAASType = "ConceptDescriptionType";
        conceptDescription.caseCount = 0;

        //Add identification
        namespace.addVariable({
            propertyOf: conceptDescription,
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
                propertyOf: conceptDescription,
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

        // Add administration
        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            assert(options.administration.coreAASType === "AdministrativeInformationType", "options.administration is not an AdministrativeInformationType Object.")
            assert(options.administration.browseName.name === "administration", "options.administration browseName is not 'administration'.")
            
            conceptDescription.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add this Asset to the AAS
        if (typeof options.conceptDescriptionOf !== "undefined") {
            assert(options.conceptDescriptionOf instanceof opcua.UAObject, "options.conceptDescriptionOf is not an UAObject.");          
            assert(options.conceptDescriptionOf.coreAASType === "ConceptDictionaryType", "options.conceptDescriptionOf is not a ConceptDictionaryType Object.");          
            
            const hasConceptDescriptionRefType = addressSpace.findCoreAASReferenceType("HasConceptDescription");

            options.conceptDescriptionOf.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription });            
        }

        //Add EmbeddedDataSpecification
        if (typeof options.hasEmbeddedDataSpecifications !== "undefined") {
            _hasEmbeddedDataSpecifications(options.hasEmbeddedDataSpecifications);
        }

        //Convenience Methods

        conceptDescription.semanticOf = (elem) => {
            assert(elem instanceof opcua.UAObject, "elem is not a UAObject.");

            const hasSemanticRefType = addressSpace.findCoreAASReferenceType("HasSemantic");
            elem.addReference({ referenceType: hasSemanticRefType, nodeId: conceptDescription });

            return conceptDescription;
        }

        conceptDescription.isCaseOf = (ref) => {

            assert(Array.isArray(ref) || ref instanceof opcua.UAObject, "ref is neither a UAObject or an Array of Key.")

            if (Array.isArray(ref)) {

                ref.forEach(el => assert(el.constructor.name === "Key", "ref Array contains an element that is not a Key."));

                addressSpace.addAASReference({
                    isCaseOf: conceptDescription,
                    browseName: "Case_" + conceptDescription.caseCount,
                    keys: ref
                });

                conceptDescription.caseCount++;
            } 
            else {
                assert(ref.coreAASType === "AASReferenceType", "assetRef is not an AASReferenceType instance.");

                conceptDescription.addReference({ referenceType: "HasComponent", nodeId: ref});
            } 

            return conceptDescription;
        };

        conceptDescription.hasEmbeddedDataSpecifications = _hasEmbeddedDataSpecifications;

        conceptDescription.conceptDescriptionOf = _conceptDescriptionOf;

        function _hasEmbeddedDataSpecifications(eds) {
            let embedds = [];
            embedds = _.concat(embedds, eds)
            embedds.forEach((e) => {
                assert(e instanceof opcua.UAObject, "eds contains some element that is not UAObject.");
                assert(e.coreAASType === "EmbeddedDataSpecificationType", "eds contains some element that is EmbeddedDataSpecificationType.");
            });            
            const hasEmbeddedDataSpecificationRefType = addressSpace.findCoreAASReferenceType("HasEmbeddedDataSpecification");

            embedds.forEach((e) => conceptDescription.addReference({ referenceType: hasEmbeddedDataSpecificationRefType, nodeId: e }));
            return conceptDescription;
        }

        function _conceptDescriptionOf(dict) {
            assert(dict instanceof opcua.UAObject, "dict is not an UAObject.");          
            assert(dict.coreAASType === "ConceptDictionaryType", "dict is not a ConceptDictionaryType Object.");          
            
            const hasConceptDescriptionRefType = addressSpace.findCoreAASReferenceType("HasConceptDescription");

            dict.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription }); 
            return conceptDescription;
        }

        return conceptDescription;
    };

};