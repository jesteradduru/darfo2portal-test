// controller/handlers for classifications requests

const _ = require("lodash");

const handleGetCategories = (req, res, db) => {
  db("categories")
    .withSchema("dts")
    .select("*")
    .then((data) => res.json(data))
    .catch((err) => res.json("Something went wrong."));
};
const handleAddCategory = (req, res, db) => {
  const { cat_name } = req.body;

  db("categories")
    .withSchema("dts")
    .insert({ cat_name: cat_name })
    .returning("*")
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

const handleUpdateCategory = (req, res, db) => {
  const { cat_name, cat_id } = req.body;

  db("categories")
    .withSchema("dts")
    .update({ cat_name: cat_name })
    .where("cat_id", "=", cat_id)
    .returning("*")
    .then((data) => res.json(data))
    .catch((err) => res.json("Something went wrong."));
};
const handleDeleteCategory = (req, res, db) => {
  const { cat_id } = req.body;
 try {
    db.transaction(async trx => {

        const classifications = await trx("classifications")
        .withSchema("dts")
        .select("class_id")
        .where("cat_id", "=", cat_id)
        .then((data) => data);

        if (_.isEmpty(classifications)) {
            // console.log('deleted')
            await trx("categories")
            .withSchema("dts")
            .delete()
            .where("cat_id", "=", cat_id)
            .returning("*")
            .then((data) => res.json(data))
            .catch((err) => res.json("Something went wrong."));
        }else{
            res.json('category_delete_unable');
        }
        
    })
 } catch (error) {
    
 }
};

const handleGetClassifications = (req, res, db) => {
  db("classifications")
    .withSchema("dts")
    .select("*")
    .leftJoin("categories", "categories.cat_id", "classifications.cat_id")
    .then((data) => res.json(data))
    .catch((err) => res.json("Something went wrong."));
};

const handleAddClassification = (req, res, db) => {
  const { class_name, class_due, cat_id, class_code } = req.body;

  db("classifications")
    .withSchema("dts")
    .insert({ class_name, class_due: parseInt(class_due), cat_id, class_code })
    .returning("*")
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const handleUpdateClassification = (req, res, db) => {
  const {
    class_id,
    class_name,
    class_due = "0",
    cat_id,
    class_code = "",
  } = req.body;

  db("classifications")
    .withSchema("dts")
    .update({
      class_name: class_name,
      class_due: class_due,
      cat_id: cat_id,
      class_code: class_code,
    })
    .where("class_id", "=", class_id)
    .returning("*")
    .then((data) => res.json(data))
    .catch((err) => res.json("Something went wrong."));
};

const handleDeleteClassification = (req, res, db) => {
  const { class_id } = req.body;

  try {
    db.transaction(async (trx) => {

      const communications = await trx("communications")
        .withSchema("dts")
        .select("com_id")
        .where("class_id", "=", class_id)
        .then((data) => data);

      if (_.isEmpty(communications)) {
        await trx("classifications")
          .withSchema("dts")
          .delete()
          .where("class_id", "=", class_id)
          .returning("*")
          .then((data) => res.json(data))
          .catch((err) => res.json(err));
      }else{
        res.json('class_delete_unable');
      }

    });
  } catch (error) {}
};

module.exports = {
  handleGetCategories,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  handleAddClassification,
  handleUpdateClassification,
  handleDeleteClassification,
  handleGetClassifications,
};
