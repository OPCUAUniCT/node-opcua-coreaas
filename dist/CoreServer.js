"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
const CoreAASExtension_1 = require("./CoreAASExtension");
const CoreAAS_enums_1 = require("./CoreAAS_enums");
/**
 * CoreServer extends OPCUAServer with all the features coming from the CoreAAS Information
 * Model. Use this class instead of OPCUAServer of node-opcua to create your OPC UA Server supporting
 * the Asset Administration Shell metamodel implemented in CoreAAS.
 * example:
 * ```typescript
 * import { coreaasXmlFile, OPCUACertificateManager, nodesets, CoreServer } from "node-opcua-coreaas";
 * let xmlFiles = [nodesets.standard_nodeset_file, coreaasXmlFile]
 *  let server = new CoreServer({
 *      nodeset_filename: xmlFiles,
 *      port: 4848,
 *      serverCertificateManager: new OPCUACertificateManager({
 *          automaticallyAcceptUnknownCertificate: true,
 *          rootFolder: path.join(__dirname, "../certs")
 *      })
 *  })
 * ```
 */
class CoreServer extends node_opcua_1.OPCUAServer {
    /**
     * Use the same parameters of OPCUAServer.
     */
    constructor(options) {
        super(options);
    }
    initialize(...args) {
        const done = args[0];
        super.initialize(done);
        this.on("post_initialize", () => {
            this._addressSpace = this.engine.addressSpace;
            this.coreaas = new CoreAASExtension_1.CoreAASExtension(this._addressSpace);
            //Add Identifier for IEC 61360 Data Specification
            const Identifier = this.coreaas.Identifier;
            this.coreaas.findCoreAASObjectType("DataSpecificationIEC61360Type").identification.setValueFromSource(new node_opcua_1.Variant({
                dataType: node_opcua_1.DataType.ExtensionObject,
                value: new Identifier({
                    id: "www.adminshell.io/DataSpecificationTemplates/DataSpecificationIEC61360",
                    idType: CoreAAS_enums_1.IdentifierType.URI
                })
            }));
        });
    }
}
exports.CoreServer = CoreServer;
//# sourceMappingURL=CoreServer.js.map