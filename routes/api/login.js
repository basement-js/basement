module.exports = function () {
	// shorthand for this.server
	var server = this.server;
	var transports = ["local", "oauth1", "oauth2"];

	server.get("/api/login/transports", function (req, res, next) {
		// TODO: Return actual available transports instead of a static list.
		res.send(transports);
	});

	server.post("/api/login/:transport", function (req, res, next) {
		// check if transport is valid
		if (transports.indexOf(req.params.transport) > -1) {
			// TODO: Pass the request to the correct login transport's request handler
			// (a transport would be loaded as a plugin)
			res.send("POST to login using transport " + req.params.transport);
		} else {
			res.send({
				code: "TransportInvalid",
				message: "Invalid transport."
			});
		}
	});
}