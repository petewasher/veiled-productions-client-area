const basic_auth = require('basic-auth');
const clients = require('./clients-cfg.json');
const debug = require('debug')('veiled:basicauth');

// The authentication handler
var veiledBasicAuth = function(req, res, next) {
    debug("Secure zone access attempt ", req.url);

    function unauthorized(res){
        debug("unauthorized access attempt");
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    var incoming_user = basic_auth(req);

    if (! req.url.startsWith('/clients/')) {
        debug("Accepting - no need to secure");
        next();
        return;
    }

    var theclient = req.url.split('/clients/')[1];
    debug("Client ", theclient);
    var expected_auth = clients[theclient] ? clients[theclient].auth : undefined;
    if (theclient === "" || !expected_auth) {
        debug("No user match for %o on %o", incoming_user, req.originalUrl);
        res.status(401).end("Forbidden");
        return;
    }


    debug("Expecting: %o, got: %o", expected_auth, incoming_user);

    if (!incoming_user || !incoming_user.name || !incoming_user.pass) {
        debug("Rejecting");
        return unauthorized(res);
    }

    if (
        incoming_user.name === expected_auth.user &&
        incoming_user.pass === expected_auth.password
    ) {
        // User is successfully authenticated.
        debug("Accepting");
        next();
    } else {
        debug("Rejecting 2");
        return unauthorized(res);
    }
};

module.exports = veiledBasicAuth;