// For handling endpoints from reports
const reports = require('../../controllers/dts/reports')

module.exports = function(app, authenticateToken, db){
    app.get('/dts/getReports/', authenticateToken, (req,res) => {
        reports.handleGetReport(req, res, db)
    }); 
    app.get('/dts/getLogs/', authenticateToken, (req,res) => {
        reports.handleGetLogs(req, res, db)
    }); 
    app.get('/dts/getAnalytics/', authenticateToken, (req,res) => {
        reports.handleGetAnalytics(req, res, db)
    }); 
}