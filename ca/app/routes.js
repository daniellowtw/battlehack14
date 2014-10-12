var Parse = module.parent.exports.Parse;
var api = require('../api')(Parse);
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
	app.get('/ctoken/:id',function (req,res){
		console.log(req.params.id);
		gateway.clientToken.generate({
			customerId: req.params.id
		}, function (err, response) {
			console.log(err);
			console.log(response);
			res.send({clientToken: response.clientToken});
		});
	});

	app.post('/pay/:token/:creditAmount/', function (req, res) {
		var nonce = req.body.payment_method_nonce;
		var amount;
		switch(req.params.creditAmount) {
			case "10":
				amount = 1;
				break;
			case "50":
				amount = 4;
				break;
			case "100":
				amount = 7;
				break;
			default:
				//err handling
		}
		console.log(amount, req.params.creditAmount)
		gateway.transaction.sale({
			amount: amount,
			paymentMethodNonce: nonce
		}, function (err, result) {
			if (!err) {
				api.addCredit(req.params.token, req.params.creditAmount,function(x){
					console.log(x);
				})
			}
			res.redirect('/prefs?success=' + !err);
		});
	});

	app.post('/reg/:id',function (req,res){
		gateway.customer.create({
			id: req.params.id
		}, function (err, result) {
			res.send(err)
			console.log(err);
			console.log(result);
		});
	})

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});

};