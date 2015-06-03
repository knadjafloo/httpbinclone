var express = require('express');
var router = express.Router();
var os = require( 'os' );
var _ = require('underscore');


var networkInterfaces = os.networkInterfaces( );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('/');
});

router.get('/ip', function(req, res, next) {
	var ips = "";
	_.each(networkInterfaces, function(value, key) {
       var ipv4only = _.findWhere(value, {family: "IPv4"})
       if(ips)
         ips =  ips.concat(", ");
	   ips = ips.concat(ipv4only['address']);
	});
  res.json({ "ip" : ips } );
});

router.get('/user-agent', function(req, res, next) {
	var source = req.headers['user-agent'];
 	res.json( {"user-agent" : source });
});

router.get('/headers', function(req, res, next) {
	var headers = {};
	headers['headers'] = req.headers;
	res.setHeader('Content-Type', 'application/json');
 	res.send(JSON.stringify(headers, null, 2));
});
module.exports = router;
