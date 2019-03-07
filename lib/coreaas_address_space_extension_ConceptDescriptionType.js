const assert = require("assert");
const _ = require("lodash");

module.exports = function (opcua) {

    /**
     *Create a new instance of ConceptDescriptionType.
    *
    * @param {object} options
    * @param {object} options.identification The unique identifier for the AAS. The DataType is Identifier. 
    * @param {object} [options.nodeId]
    * @param {string} [options.browseName]  
    * @param {object} [options.conceptDescriptionOf] The parent ConceptDictionary containing the ConceptDescription by means of HasConceptDescription reference.
    * @param {object} [options.localSemanticOf] The SubmodelElement this ConceptDescription defines semantic for.
    * @param {array | object} [options.hasEmbeddedDataSpecification] An EmbeddedDataSpecification or an Array of EmbeddedDataSpecification.
    * @param {object} [options.administration] An AdministrativeInformationType instance containing administration info for the ConceptDescription. 
    * @param {string} [options.description] A description for the ConceptDescription. 
    * @returns {object} The Object Node representing the ConceptDescription.
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
            //description:   options.description, Use the Property description instead of the attribute
            nodeId:        options.nodeId,
            organizedBy: conceptDescriptions,
        });

        //Add identification
        namespace.addVariable({
            componentOf: conceptDescription,
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
            assert(typeof(options.description) === "string", "Parameter options.description is not a string.");

            namespace.addVariable({
                propertyOf: conceptDescription,
                browseName: "description",
                dataType: "String",
                value: {
                    get: function() {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: options.description});
                    }
                }
            });
        }

        // Add administration
        if (options.administration) {
            assert(options.administration instanceof opcua.UAObject, "options.administration is not an UAObject.");
            
            conceptDescription.addReference({ referenceType: "HasComponent", nodeId: options.administration});
        }

        //Add this Asset to the AAS
        if (typeof options.conceptDescriptionOf !== "undefined") {
            assert(options.conceptDescriptionOf instanceof opcua.UAObject, "options.conceptDescriptionOf is not an UAObject.");          
            const hasConceptDescriptionRefType = addressSpace.findCoreAASReferenceType("HasConceptDescription");

            options.conceptDescriptionOf.addReference({ referenceType: hasConceptDescriptionRefType, nodeId: conceptDescription });            
        }

        //Add this Asset to the AAS
        if (typeof options.localSemanticOf !== "undefined") {
            assert(options.localSemanticOf instanceof opcua.UAObject, "options.localSemanticOf is not an UAObject.");          
            const hasLocalSemanticRefType = addressSpace.findCoreAASReferenceType("HasLocalSemantic");

            options.localSemanticOf.addReference({ referenceType: hasLocalSemanticRefType, nodeId: conceptDescription });            
        }

        //Add EmbeddedDataSpecification
        if (typeof options.hasEmbeddedDataSpecification !== "undefined") {
            let embedds = [];
            embedds = _.concat(embedds, options.hasEmbeddedDataSpecification)
            embedds.forEach((e) => assert(e instanceof opcua.UAObject, "options.hasEmbeddedDataSpecification contains some element that is not UAObject."));            
            const hasEmbeddedDataSpecificationRefType = addressSpace.findCoreAASReferenceType("HasEmbeddedDataSpecification");

            embedds.forEach((e) => conceptDescription.addReference({ referenceType: hasEmbeddedDataSpecificationRefType, nodeId: e })); 
        }

        //Convenience Methods

        /**
        * Add a new IsCaseOf.
        *
        * @param {object} options
        * @param {string} options.browseName
        * @param {array}  options.keys An array of Key or an array of array of Key referencing an external entity.
        * @returns {object} The Object Node representing the ConceptDescription.
        */
        conceptDescription.IsCaseOf = (options) => {

            addressSpace.addAASReference({
                isCaseOf: conceptDescription,
                browseName: options.browseName,
                keys: options.keys
            });

            return conceptDescription;
        };

        return conceptDescription;
    };

};