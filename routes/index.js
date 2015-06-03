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
	var ua = {};
	ua['user-agent'] = req.headers['user-agent'];
 	prettyJson(res, ua);
});
router.get('/headers', function(req, res, next) {
	var headers = {};
	headers['headers'] = req.headers;
	prettyJson(res, headers);
});
router.post('/post', function(req, res) {
	var obj = {};
	obj['form'] = req.body;
	obj['args'] = req.query;
	obj['headers'] = req.headers;

	prettyJson(res, obj);
});
router.put('/put', function(req, res) {
	prettyJson(res, req.body);
});
router.patch('/patch', function(req, res) {
	prettyJson(res, req.body);
});

prettyJson = function(res, data) {
	res.setHeader('Content-Type', 'application/json');
  	res.send(JSON.stringify(data, null, 2));
};

module.exports = router;
