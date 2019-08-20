import { OPCUAServer, OPCUAServerOptions, AddressSpace } from "node-opcua";
import { CoreAASExtension } from "./CoreAASExtension";

export class CoreServer extends OPCUAServer {

    private _addressSpace!: AddressSpace;

    public coreaas!: CoreAASExtension;

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

