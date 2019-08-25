export * from "node-opcua";

export * from "./CoreServer";
export * from "./CoreAASExtension"
export * from "./CoreAAS_enums";

import path from "path";
export const coreaasXmlFile: string = path.join(__dirname, "../nodesets/coreaas.xml");