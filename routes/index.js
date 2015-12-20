// require Node.js modules
var path = require("path");

module.exports = function (vars) {
	// include other routes here
	var routes = [
		"api"
	];

	// helper to require all routes specified in the array
	routes.forEach(function (route) {
		require(path.resolve(path.join("routes", route + ".js")))(vars);
	});
}