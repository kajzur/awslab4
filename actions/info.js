var helpers = require("../helpers");
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');

exports.action = function(request, callback) {

	var s3 = new AWS.S3();
	var params = {
		"Bucket": request.query.bucket, /* required */
  		"Key": request.query.key /* required */
	}
	s3.getObject(params, function(err, data) {
		if(!err){
				helpers.calculateMultiDigest(data.Body, 
				['md5', 'sha1','sha512','sha256'], 
				function(err, digests) {

					callback(null, {template: 'info.ejs', params:{hashes: digests, url:'/download?bucket='+request.query.bucket+'&key='+request.query.key,meta:data.Metadata, key:request.query.key}});
				}, 1);
		}
		else callback(err, "Error");
	});




	
}
