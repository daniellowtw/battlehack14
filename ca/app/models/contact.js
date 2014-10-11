var mongoose = require('mongoose');

//define the order schema
var contactSchema = mongoose.Schema({
        name      : String,
        address1  : String,
        address2  : String,
        city      : String,
        postcode  : String,
        telephone : String,
        email	  : String
});

//expose it
module.exports = mongoose.model('Contact', contactSchema);
