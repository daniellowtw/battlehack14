var config = module.parent.exports.config;

module.exports = function(Parse) {
    var jukeboxes = Parse.Object.extend("jukeboxes");
    var Payee = Parse.Object.extend("Payee");
    var Payee_alias = Parse.Object.extend("Payee_alias");
    var User = Parse.Object.extend("User");
    return {
        findJukebox: function(name, cb) {
            var name = name.toUpperCase();
            var query = new Parse.Query(jukeboxes);
            query.equalTo("name", name);
            query.find({
                success: function(results) {
                    // Do something with the returned Parse.Object values
                    if (results.length == 1) {
                        cb(results)
                    } else {
                        cb({
                            error: "No such server"
                        })
                    }
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            })
        },

        saveJukebox: function(name, address, cb) {
            var name = name.toUpperCase();
            var query = new Parse.Query(jukeboxes);
            query.equalTo("name", name);
            query.find({
                success: function(results) {
                    // Do something with the returned Parse.Object values
                    if (results.length > 0) {
                        cb({
                            error: "Name already exist"
                        })
                    } else {
                        var instance = new jukeboxes();
                        instance.save({
                            name: name,
                            address: address
                        }).then(function(object) {

                            console.log("yay! it worked");
                            cb(object)
                        });
                    }
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            })
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
        },
        addPayment: function(payeeId, amount) {
            var q1 = new Parse.query(Payee);
            q1.get(payeeId, {success:function(x){
                x.set('amount', x.get('amount') + amount)
                x.save(null, {success:true})
            }})
        },

        processUpvote: function(userToken, p) {
            Parse.User.become(userToken).then(function(user) {
                user.set('credit', user.get('credit') + amount);
                user.save(null, {
                    success: function(x) {
                        var proportion = user.get('pref').proportion
                        // pay people
                        var acc = 0;
                        var query = new Parse.query(Payee_alias)
                        query.equalTo("alias", p.uri);
                        query.find({
                            success: function(results) {
                                // Do something with the returned Parse.Object values
                                if (results.length == 1) {
                                    this.addPayment(results.get('payee_id'),p.amount*proportion[0])
                                } else {
                                    //add share to charity

                                }
                            },
                            error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        })
                    },
                    error: function() {
                        console.log("error proccesing upvote")
                    }
                });
            }, function(error) {
                console.log(error)
            });



        }


    }
};
