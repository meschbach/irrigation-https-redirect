const {RewriteService} = require("./index");
const yargs = require("yargs");

const argv = yargs
	.option("port", {description: "TCP/IP port to bind to", default:0})
	.argv;

const server = new RewriteService();
server.start(argv.port).then(function (url) {
	console.log("Listening at ", url);
}).catch(function ( problem ) {
	console.error( problem );
});

function shutdown() {
	server.stop();
}
["SIGHUP","SIGTERM","SIGINT"].forEach((s) => process.on(s, shutdown));
