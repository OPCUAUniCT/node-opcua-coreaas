"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
const CoreAASExtension_1 = require("./CoreAASExtension");
class CoreServer extends node_opcua_1.OPCUAServer {
    constructor(options) {
        super(options);
    }
    initialize(...args) {
        const done = args[0];
        super.initialize(done);
        this.on("post_initialize", () => {
            this._addressSpace = this.engine.addressSpace;
            this.coreaas = new CoreAASExtension_1.CoreAASExtension(this._addressSpace);
        });
    }
}
exports.CoreServer = CoreServer;
//# sourceMappingURL=CoreServer.js.map