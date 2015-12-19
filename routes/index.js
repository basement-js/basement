// require Node.js modules
var path = require("path");

// "server" is a restify instance
module.exports = function (server) {
	// include other routes here
	var routes = [
		"api"
	];

	// helper to require all routes specified in the array
	routes.forEach(function (route) {
		require(path.join(".", route + ".js"))(server);
	});
}