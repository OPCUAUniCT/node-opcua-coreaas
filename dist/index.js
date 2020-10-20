"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreaasXmlFile = void 0;
__exportStar(require("node-opcua"), exports);
__exportStar(require("./CoreServer"), exports);
__exportStar(require("./CoreAASExtension"), exports);
__exportStar(require("./CoreAAS_enums"), exports);
const path_1 = __importDefault(require("path"));
exports.coreaasXmlFile = path_1.default.join(__dirname, "../nodesets/coreaas.xml");
//# sourceMappingURL=index.js.map