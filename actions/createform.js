var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";
var AWS = require("aws-sdk");
AWS.config.loadFromPath(AWS_CONFIG_FILE);
var getIP = require('external-ip')();

var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name
	getIP(function (err, ip) {
	    if (err) {
	        throw err;
	    }
    	var fields = s3Form.generateS3FormFields(ip);

    	var simpledb = new AWS.SimpleDB();
		var dbParams = {
		  Attributes: [ /* required */
		    {
		      Name: 'datetime', /* required */
		      Value: Math.round(+new Date()/1000)+"", /* required */
		      Replace: false
		    }
		  ],
		  DomainName: 'mateuszmDomain', /* required */
		  ItemName: 'formViews' /* required */
		};
		simpledb.putAttributes(dbParams, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     console.log(data);           // successful response
		});


		callback(null, {template: INDEX_TEMPLATE, params:{fields:s3Form.addS3CredientalsFields(fields, awsConfig, ip) , bucket:"lab4-weeia"}});
	});

}

exports.action = task;
