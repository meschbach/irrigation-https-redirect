const {addressOnListen} = require("junk-bucket/sockets");
const http = require("http");

const ALLOWED_METHODS = ["GET", "HEAD", "OPTIONS"];

class RewriteService {
	async start( port = 0 ){
		this.server = http.createServer(function( request, response ){
			if( ALLOWED_METHODS.includes( request.method) ){
				response.statusCode = 301;
				const uri = "https://" +request.headers["host"] + request.url;
				response.setHeader("Location", uri);
			} else {
				response.statusCode = 405;
			}
			response.end();
		});
		this.socket = addressOnListen(this.server, port );
		const address = await this.socket.address;
		return "http://" + address.host + ":" + address.port;
	}

	async stop(){
		await this.socket.stop();
	}
}

module.exports = {
	RewriteService
};
