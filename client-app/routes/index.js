const express = require('express');
const router = express.Router();
const clients = require('./clients-cfg.json');
const client_basic_auth = require('./basic-auth');
const debug = require('debug')('veiled:index');

/* Build up the clients endpoints */
Object.keys(clients).forEach((client) => {

  var client_details = clients[client];
  debug('adding route for ', client);

  router.get('/clients/'+client, (req, res, next) => {
    res.render('client', {
      name:client_details.name,
      project: client_details["project-name"],
      versions: client_details.versions
    });
  });
});

module.exports = router;
