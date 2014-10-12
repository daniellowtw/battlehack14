var braintree = require('braintree');
var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "qrnmqsx39dsct293",
	publicKey: "y39gvpg9hmz6mw9x",
	privateKey: "153607c095324e5b4d0a7152240378e2"
});
var path = require('path');

module.exports = function(app) {

	// server routes ===========================================================
	app.get('/api/ctoken',function (req,res){
		gateway.clientToken.generate({
			// customerId: cIdFromDB
		}, function (err, response) {
			res.send({clientToken: response.clientToken});
		});
	});

	app.post('/pay', function (req, res) {
		//nope
	});

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});

};