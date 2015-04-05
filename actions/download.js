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

		if(err){
			callback(err, err);
			return;
		}

		var file = request.query.key.split("/")[1];
		var filename = file;
		request.res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  		request.res.setHeader('Content-type', 'application/force-download');//data.ContentType);
  		callback(null, data.Body);

	  
	});

	
}
