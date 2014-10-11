var config = module.parent.exports.config;

module.exports = function(Parse) {
    var jukeboxes = Parse.Object.extend("jukeboxes");
    var User = Parse.Object.extend("User");
    return {
        saveJukebox: function(name, address, cb) {
            console.log(name, address);
            // var jukeboxes = Parse.Object.extend("jukeboxes");
            var instance = new jukeboxes();
            instance.save({
                name: name,
                address: address
            }).then(function(object) {

                console.log("yay! it worked");
                cb(object)
            });
        },

        deleteJukebox: function(objID, cb) {
            var query = new Parse.Query(jukeboxes);
            query.get(objID, {
                success: function(obj) {
                    obj.destroy({
                        success: function() {
                            cb("obj " + objID + " deleted")
                        },
                        error: function(o, e) {
                            cb(e)
                        }
                    })
                },
                error: function(o, e) {
                    cb({
                        error: e,
                        id: objID
                    })
                }
            })

        },

        listJukeboxes: function(cb) {
            var query = new Parse.Query(jukeboxes);
            query.find({
                success: function(array) {
                    console.log(array)
                    cb(array)
                }
            });
        },

        // TODO: Make this safe for production
        addCredit: function(userToken, amount, cb) {
            Parse.User.become(userToken).then(function(user) {
                user.set('credit', user.get('credit') + amount);
                user.save(null, {
                    success: function(x) {
                        cb(x)
                    },
                    error: function(x) {
                        cb(x)
                    }
                });
            }, function(error) {
                console.log(error)
            });
        },

        getUserPref: function(userToken, cb) {
            Parse.User.become(userToken).then(function(user) {
                cb(user.get('pref'))
            }, function(error) {
                console.log(error)
            });
        },

        setUserPref: function(userToken, pref) {
            Parse.User.become(userToken).then(function(user) {
                user.set('pref', pref)
                user.save(null, {
                    success: function(x) {
                        cb(x)
                    },
                    error: function(x) {
                        cb(x)
                    }
                });
            }, function(error) {
                console.log(error)
            });
        }


    }
};