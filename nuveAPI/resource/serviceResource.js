var serviceRegistry = require('./../mdb/serviceRegistry');
var BSON = require('mongodb').BSONPure;

/*
 * Gets the service and checks if it is superservice. Only superservice can do actions about services.
 */
var doInit = function (serv, callback) {
	var service = require('./../auth/nuveAuthenticator').service;
	var superService = require('./../mdb/dataBase').superService;
	if(service._id != superService) {
		callback('error');
	} else {
		serviceRegistry.getService(serv, function(ser) {
			callback(ser);
		});
	}
};

/*
 * Get Service. Represents a determined service.
 */
exports.represent = function(req, res) {
	doInit(req.params.service, function(serv) {
		if(serv == 'error'){
			console.log('Service ', req.params.service, ' not authorized for this action');
			res.send('Service ', req.params.service, ' not authorized for this action', 401);
			return;
		}
		if (serv == undefined) {
			res.send('Service not found', 404);
			return;
		}
		console.log('Representing service ', serv._id);
		res.send(serv);
	});
	
};

/*
 * Delete Service. Removes a determined service from the data base.
 */
exports.deleteService = function(req, res) {
	doInit(req.params.service, function(serv) {
		if(serv == 'error'){
			console.log('Service ', req.params.service, ' not authorized for this action');
			res.send('Service ', req.params.service, ' not authorized for this action', 401);
			return;
		}
		if (serv == undefined) {
			res.send('Service not found', 404);
			return;
		}
		var id = '';
		id += serv._id;
		serviceRegistry.removeService(id);
		res.send('Service ', id, ' deleted');
	});
};