import { OPCUAServer, OPCUAServerOptions, AddressSpace } from "node-opcua";
import { CoreAASExtension } from "./CoreAASExtension";

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
export class CoreServer extends OPCUAServer {

    private _addressSpace!: AddressSpace;

    /** The extension part of the CoreServer providing all the methods to create instances of
     * ObjectType coming from the CoreAAS information Model. Furthermore it provides access to 
     * Structured DataType Constructors and several utility methods. More details in [[CoreAASExtension]].
     */
    public coreaas!: CoreAASExtension;

    /**
     * Use the same parameters of OPCUAServer.
     */
    constructor(options?: OPCUAServerOptions) {
        super(options);
    }

    public initialize(): Promise<void>;
    public initialize(done: () => void): void;
    public initialize(...args: [any?, ...any[]]): any {
        const done = args[0] as () => void;
        super.initialize(done);
        this.on("post_initialize", () => {
            this._addressSpace = this.engine.addressSpace!;
            this.coreaas = new CoreAASExtension(this._addressSpace);
        })
    }
}

