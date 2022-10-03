// For handling endpoints from communications
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/dts')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const upload = multer({storage: storage})
const communications = require('../../controllers/dts/communications')
const trail = require('../../controllers/dts/trail')

module.exports = function(app, authenticateToken, db, socket, receiveNotification){
    app.post("/dts/getCommunication", authenticateToken, (req, res) => {
        communications.handleGetCommunication(req, res, db)
    })
    app.post("/dts/addCommunication", [authenticateToken, upload.fields([{name: 'scanned'}, {name: 'attachments'}])], (req, res) => {
        communications.handleAddCommunication(req, res, db, socket, receiveNotification)
    })
    app.post('/dts/deleteCommunication', authenticateToken, (req, res) => {
        communications.handleDeleteCommunication(req, res, db)
    })
    app.post('/dts/editCommunication/', [authenticateToken,upload.fields([{name: 'scanned'}, {name: 'attachments'}])], (req, res) => {
        communications.handleEditCommunication(req, res, db);
    });
    app.get("/dts/getDrafts/:user_id", authenticateToken, (req, res) => {
        communications.handleGetDrafts(req, res, db)
    })
    app.post("/dts/getFiles/", authenticateToken, (req, res) => {
        communications.handleGetFiles(req, res, db)
    })
    app.post("/dts/deleteFile/", authenticateToken, (req, res) => {
        communications.handleDeleteFile(req, res, db)
    })
    app.post('/dts/saveDraft/', [authenticateToken,upload.fields([{name: 'scanned'}, {name: 'attachments'}])], (req, res) => {
        communications.handleSaveDraft(req, res, db, socket, receiveNotification);
    });
    
    app.get("/dts/verifyControlNo/:control_no", authenticateToken, (req, res) => {
        communications.handleVerifyControlNo(req, res, db)
    })
    app.get("/dts/getInbox/", authenticateToken, (req, res) => {
        communications.handleGetInbox(req, res, db)
    })
    app.post("/dts/seenCommunication/", authenticateToken, (req, res) => {
        communications.handleSeenCommunication(req, res, db)
    })
    app.post("/dts/getInboxData/", authenticateToken, (req, res) => {
        communications.handleGetInboxData(req, res, db)
    })
    app.get("/dts/getCommunications/", authenticateToken, (req, res) => {
        communications.handleGetCommunications(req, res, db)
    })
    app.post("/dts/getTrail/", authenticateToken, (req, res) => {
        trail.handleGetTrail(req, res, db)
    })
}