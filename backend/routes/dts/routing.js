// For handling endpoints from routing
const routing = require('../../controllers/dts/routing')

module.exports = function(app, authenticateToken, db, socket, receiveNotification){
    app.post('/dts/addInitialRouting/', authenticateToken, (req,res) => {
        routing.handleAddInitialRouting(req, res, db, socket, receiveNotification)
    });
    app.post('/dts/routeCommunication/', authenticateToken, (req,res) => {
        routing.handleRouteCommunication(req, res, db, socket, receiveNotification)
    });
    app.post('/dts/getRoutingSlips/', authenticateToken, (req,res) => {
        routing.handleGetRoutingSlips(req, res, db)
    });
    app.post('/dts/getRouting/', authenticateToken, (req,res) => {
        routing.handleGetRouting(req, res, db)
    });
    app.post('/dts/addForRouting/', authenticateToken, (req,res) => {
        routing.handleAddForRouting(req, res, db, socket, receiveNotification)
    }); 
    app.post('/dts/taskComplete/', authenticateToken, (req,res) => {
        routing.handleTaskComplete(req, res, db)
    }); 
}