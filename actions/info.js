var helpers = require("../helpers");
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var APP_CONFIG_FILE = "./app.json";
var Queue = require("queuemanager");

exports.action = function(request, callback) {

	var s3 = new AWS.S3();

	var params = {
		"Bucket": request.query.bucket, /* required */
  		"Key": request.query.key /* required */
	};

	console.log("should send: "+helpers.readJSONFile(APP_CONFIG_FILE).QueueUrl);
	var queue = new Queue(new AWS.SQS(), helpers.readJSONFile(APP_CONFIG_FILE).QueueUrl);
	var message = request.query.bucket + "{}" +request.query.key;

	queue.sendMessage(message, function(err, data){
		if(err) { callback(err); return; }
		callback(null, "wyslano na kolejke");
	});
	

	// s3.getObject(params, function(err, data) {
	// 	if(!err){
	// 			helpers.calculateMultiDigest(data.Body, 
	// 			['md5', 'sha1','sha512','sha256'], 
	// 			function(err, digests) {

	// 				callback(null, {template: 'info.ejs', params:{hashes: digests, url:'/download?bucket='+request.query.bucket+'&key='+request.query.key,meta:data.Metadata, key:request.query.key}});
	// 			}, 1);
	// 	}
	// 	else callback(err, "Error");
	// });




	
}
