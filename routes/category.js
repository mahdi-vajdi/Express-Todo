const express = require("express");
const Category = require("../models/category");
const router = express.Router();

router.get("/", (req, res, next) => {
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
});

router.get("/:id", (req, res) => {
  Category.findById({ _id: req.params.id }, req.body).then((category) => {
    res.json(category);
  });
});

router.post("/", (req, res, next) => {
  Category.create(req.body)
    .then((category) => {
      res.json(category);
    })
    .catch(next);
});

router.put("/:id", (req, res, next) => {
  Category.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
    Category.findOne({ _id: req.params.id }).then((category) => {
      res.json(category);
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Category.findByIdAndRemove({ _id: req.params.id }).then((category) => {
    res.json(category);
  });
});

module.exports = router;
