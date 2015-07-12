// Only three calls are public to user app:
//   init(adhoc_app_track_id)
//   generateClientId()
//   getExperimentFlags(client_id, callback)
//   incrementStat(client_id, stat, value)
//
//   @client_id: unique ID to identify a user, preferrably a UUID.

var protocol = "https:";
var ADHOC_GETFLAGS_HOST = 'api.appadhoc.com';
var ADHOC_GETFLAGS_PORT = '80';
var ADHOC_GETFLAGS_PATH = '/optimizer/api/getflags.php';
var ADHOC_TRACKING_HOST = 'tracking.appadhoc.com';
var ADHOC_TRACKING_PORT = '23462';
var ADHOC_TRACKING_PATH = '/';

var http = Npm.require("http");


//var cache = require("node-cache");

// Canonicalize Date.now().
if (!Date.now) {
	Date.now = function() {
	 	return new Date().getTime();
 	};
}

// Micro implementaiton of AJAX.
function AJAX(host, port, path, query, callback) {
	var request = http.request(
		{
		 	host: host,
		 	port: port,
		 	path: path,
		 	method: 'POST'
		},
		function(response) {
			if (callback == null) {
				return;
			}

			var reply = '';
			response.on('data', function(chunk) {
				reply += chunk;
			});
			response.on('end', function() {
				callback(reply);
			});
		}
	);

	request.write(JSON.stringify(query));
	request.end();
};

var self =  {
	
	init : function(appKey) {
		self.ak = appKey;  // ak as appKey
	},

	generateClientId : function() {
		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	},

	getExperimentFlags : function(client_id, callback) {
		var data = {
			adhoc_app_track_id: self.ak,
			event_type: 'GET_EXPERIMENT_FLAGS',
			timestamp: Date.now() / 1000,
			summary: {},
			client_id: client_id
		}
	
		AJAX(ADHOC_GETFLAGS_HOST, ADHOC_GETFLAGS_PORT, ADHOC_GETFLAGS_PATH, data, callback);
	},

	incrementStat : function(client_id, stat, value) {
		var data = {
			adhoc_app_track_id: self.ak,
			event_type: 'REPORT_STAT',
			timestamp: Date.now() / 1000,
			summary: {},
			client_id: client_id,
			stat_key: stat,
			stat_value: value
		}; 
	
		AJAX(ADHOC_TRACKING_HOST, ADHOC_TRACKING_PORT, ADHOC_TRACKING_PATH, data, function(){});
	},
};

adhoc = self;