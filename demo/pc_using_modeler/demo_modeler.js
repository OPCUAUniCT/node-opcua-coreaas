var opcua = require("node-opcua");
var path = require("path");

// add server CoreAAS extension to node-opcua
require("node-opcua-coreaas")(opcua);

/* just importing an xml information model generated with UA Modeler  
 it works for most of the things but not for Structured DataType Values.
 That's because node-opc-ua do not support custom Structured DataType
 imported from xml.

 It is always better using the SDK to add this kind of values until this 
 feature is implemented in node-opc-ua.
 
 more info at: https://github.com/node-opcua/node-opcua/issues/603*/
const demo_model_xml = path.join(__dirname, "./demo_modeler.xml");

var xmlFiles = [
    opcua.standard_nodeset_file,
    opcua.coreaas.nodeset_file,
    demo_model_xml
];

var server = new opcua.OPCUAServer({
    nodeset_filename: xmlFiles,
});


function post_initialize() {
    console.log("initialized");

    /**
     * Start The OPC UA Server
     */
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);