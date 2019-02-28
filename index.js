module.exports = function(opcua) {

    require("./lib/coreaas_address_space_extension").install(opcua);
};