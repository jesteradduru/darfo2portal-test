const classifications = require("../../controllers/dts/classifications")

module.exports = function(app, authenticateToken, jwt, db, SECRET_KEY){
   app.get("/dts/getCategories", authenticateToken, (req, res) => {
       classifications.handleGetCategories(req, res, db)
   })
   app.post("/dts/addCategory", authenticateToken, (req, res) => {
       classifications.handleAddCategory(req, res, db)
   })
   app.post("/dts/updateCategory", authenticateToken, (req, res) => {
       classifications.handleUpdateCategory(req, res, db)
   })
   app.post("/dts/deleteCategory", authenticateToken, (req, res) => {
       classifications.handleDeleteCategory(req, res, db)
   })

   app.get("/dts/getClassifications", authenticateToken, (req, res) => {
       classifications.handleGetClassifications(req, res, db)
   })
   app.post("/dts/addClassification", authenticateToken, (req, res) => {
       classifications.handleAddClassification(req, res, db)
   })
   app.post("/dts/updateClassification", authenticateToken, (req, res) => {
       classifications.handleUpdateClassification(req, res, db)
   })
   app.post("/dts/deleteClassification", authenticateToken, (req, res) => {
       classifications.handleDeleteClassification(req, res, db)
   })

}