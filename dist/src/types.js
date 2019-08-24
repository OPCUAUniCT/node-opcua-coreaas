"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIdentifier(id) {
    return ("idType" in id && typeof id.idType === "number") && ("id" in id && typeof id.id === "string");
}
exports.isIdentifier = isIdentifier;
function isKey(key) {
    return ("idType" in key && typeof key.idType === "number") &&
        ("local" in key && typeof key.local === "boolean") &&
        ("type" in key && typeof key.type === "number") &&
        ("value" in key && typeof key.value === "string");
}
exports.isKey = isKey;
//# sourceMappingURL=types.js.map