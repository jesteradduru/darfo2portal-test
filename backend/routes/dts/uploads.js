// For handling endpoints from viewing uploads
const uploads = require('../../controllers/dts/uploads')

module.exports = function(app, authenticateToken, db, socket, receiveNotification){
    app.post('/dts/getComUploads', authenticateToken, (req, res) => {
        uploads.handleGetComUploads(req, res, db);
    });
}