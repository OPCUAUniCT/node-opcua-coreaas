/**
 * The module node-opcua-coreaas accept the node-opcua module in order to expan it with all
 * the new functionalities related to CoreAAS.
 * @module node-opcua-coreaas
 * @param {object} opcua The object contained the imported node-opcua module
 */

module.exports = function(opcua) {

    require("./lib/coreaas_address_space_extension").install(opcua);
};