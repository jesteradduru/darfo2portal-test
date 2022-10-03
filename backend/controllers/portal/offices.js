/*
  This file is for handles fetching of data from offices table.
  This file is imported in server.js file
*/

const handleGetOffices = (req, res, db) => {
    db("offices")
    .withSchema("portal")
    .select("*")
    .orderBy('office_code', 'asc')
    .then(res_data => res.json(res_data))
}

module.exports = {
    handleGetOffices,
}