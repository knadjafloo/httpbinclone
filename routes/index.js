var express = require('express');
var router = express.Router();
var os = require( 'os' );
var _ = require('underscore');
var compression = require('compression');
var path = require('path');
var zlib = require('zlib');

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
	var obj = getPostData(req);
	prettyJson(res, obj);
});
router.put('/put', function(req, res) {
	var obj = getPostData(req);
	prettyJson(res, obj);
});
router.patch('/patch', function(req, res) {
	var obj = getPostData(req);
	prettyJson(res, obj);
});
router.delete('/delete', function(req, res) {
	var obj = getPostData(req);
	prettyJson(res, obj);
});
router.get('/encoding/utf8', function(req, res) {	
	res.sendFile(path.join(__dirname, '../public', 'utf8.html'));
});

router.get('/gzip', function(req, res) {	
	var headers = {};
	headers['headers'] = req.headers;
	headers['gzipped'] = true;
	headers['method'] = req.method;

	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Content-Encoding', 'gzip');
  	var input = JSON.stringify(headers, null, 2);
	var buf = new Buffer(input, 'utf-8');   // Choose encoding for the string.
    zlib.gzip(buf, function (_, result) {  // The callback will give you the 
      res.end(result);                     // result, so just send it.
    });	
});

router.get('/deflate', function(req, res) {	
	var headers = {};
	headers['headers'] = req.headers;
	headers['deflated'] = true;
	headers['method'] = req.method;

	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Content-Encoding', 'deflate');
  	var input = JSON.stringify(headers, null, 2);
	var buf = new Buffer(input, 'utf-8');   // Choose encoding for the string.
    zlib.deflate(buf, function (_, result) {  // The callback will give you the 
      res.end(result);                     // result, so just send it.
    });	
});

router.get('/status/:code', function(req, res) {	
	res.sendStatus(req.params.code);
});


router.get('/response-headers', function(req, res) {	
	var headers = {};
	_.each(req.query, function(value, key) {
		res.setHeader(key, value);
		var valueArray = value.split(';');
		headers[key] = valueArray.length === 1 ? valueArray[0] : valueArray;
	});
	prettyJson(res, headers);
});


prettyJson = function(res, data) {
	res.setHeader('Content-Type', 'application/json');
  	res.send(JSON.stringify(data, null, 2));
};

getPostData = function(req) {
	var obj = {};
	obj['args'] = req.query;
	obj['form'] = req.body;
	obj['headers'] = req.headers;
	obj['url'] = req.originalUrl;
	obj['origin'] = req.ip;
	obj['files'] = req.files;

	return obj;
};

module.exports = router;
