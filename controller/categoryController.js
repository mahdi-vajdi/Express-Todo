const Category = require("../model/Category");

const getAllCategories = (req, res, next) => {
  const page = req.query.p;
  const itemPerPage = 10;

  // let categories = [];

  Category.find()
    /* .skip(page * itemPerPage)
      .limit(itemPerPage)
      .forEach((category) => categories.push(category)) */

    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the categories" });
    });
};

const getCategory = (req, res) => {
  Category.findById({ _id: req.params.id }, req.body).then((category) => {
    res.json(category);
  });
};

const updateCategory = (req, res, next) => {
  Category.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
    Category.findOne({ _id: req.params.id }).then((category) => {
      res.json(category);
    });
  });
};

const createCategory = (req, res, next) => {
  Category.create(req.body, (err, doc) => {
    if (err) {
      res.status(400).json(err);
    }
    res.json(doc._id);
  });
};

const deleteCategory = (req, res, next) => {
  Category.findByIdAndRemove({ _id: req.params.id }).then((category) => {
    res.json(category);
  });
};

module.exports = {
  getAllCategories,
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory,
};
