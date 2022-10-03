// controller/handlers for document trail requests
const handleGetTrail = (req, res, db) => {
    try {
        const {com_id} = req.body;

        db.transaction(async trx => {
            const trails = await trx('document_trail')
            .withSchema('portal')
            .select(['employees.*', 'document_trail.*','users.emp_id', 'offices.office_code', 'document_trail.com_id'])
            .leftJoin('users', 'users.user_id', 'document_trail.user_id')
            .leftJoin('employees', 'employees.emp_id', 'users.emp_id')
            .leftJoin('offices', 'offices.office_id', 'employees.office_id')
            .withSchema('dts')
            .where('com_id', '=', com_id)
            .orderBy('trail_date', 'desc')
            .then(data => data)

            res.json(trails)
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    handleGetTrail
}