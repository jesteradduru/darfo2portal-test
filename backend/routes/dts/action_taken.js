// For handling endpoints from actions
const action_taken = require('../../controllers/dts/action_taken');
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

module.exports = (app, authenticateToken, db, socket, receiveNotification) => {
    app.post('/dts/addActionTaken/', [authenticateToken, upload.fields([{name: 'scanned'}, {name: 'attachments'}])], (req, res) => {
        action_taken.handleAddActionTaken(req, res, db, socket, receiveNotification);
    })
    app.post('/dts/getActionTaken/', authenticateToken, (req, res) => {
        action_taken.handleGetActionTaken(req, res, db);
    })
    app.post('/dts/reviewActionTaken/', [authenticateToken, upload.fields([{name: 'scanned'}])], (req, res) => {
        action_taken.handleReviewActionTaken(req, res, db, socket, receiveNotification);
    })
    app.post('/dts/reforwardForAction/', authenticateToken, (req, res) => {
        action_taken.handleReforwardForAction(req, res, db, socket, receiveNotification);
    })
}