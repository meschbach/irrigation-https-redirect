const {expect} = require("chai");
const rp = require("request-promise-native");

const {RewriteService} = require("../index");

describe('proxying requests', function () {
	before( async function(){
		this.service = new RewriteService();
		this.url = await this.service.start();
	});
	after( async function() {
		await this.service.stop();
	});

	describe("for a POST request", function(){
		beforeEach(async function () {
			this.resource = "/some/url";
			const url = this.url + this.resource;
			this.response = await rp({method: "post", url, followRedirect: false, resolveWithFullResponse: true, simple: false});
		});

		it("sends Method Not Allowed", function () {
			expect(this.response.statusCode).to.eq(405);
		});
	});

	describe("for a GET request", function () {
		beforeEach(async function () {
			this.resource = "/some/url";
			const url = this.url + this.resource;
			this.response = await rp({url, followRedirect: false, resolveWithFullResponse: true, simple: false});
		});

		it("responds with 301", function(){
			expect( this.response.statusCode ).to.eq(301);
		});
		it("has a location header", function () {
			const uri = this.url.replace("http://", "https://") + this.resource;
			expect( this.response.headers["location"] ).to.eq(uri);
		});

		it("has no response body", function () {
			expect(this.response.body.length).to.eq(0);
		});
	});
});