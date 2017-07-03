var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const Supplier=require('../models/supplier.js');
const config = require('../config/database');

module.exports = (passport) =>{

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

        Supplier.getSupplierByID(jwt_payload.email, function(err, supplier) {
            if (err) {
                return done(err, false);
            }

            if (supplier) {
                done(null, supplier);
            }
            else {
                done(null, false);
            }
        });

        console.log(jwt_payload);

    }));

}
