"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("node-opcua"));
__export(require("./CoreServer"));
__export(require("./CoreAASExtension"));
__export(require("./CoreAAS_enums"));
const path_1 = __importDefault(require("path"));
exports.coreaasXmlFile = path_1.default.join(__dirname, "../nodesets/coreaas.xml");
//# sourceMappingURL=index.js.map