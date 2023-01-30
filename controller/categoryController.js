const { default: mongoose } = require("mongoose");
const Category = require("../model/Category");

const createCategory = async (req, res) => {
  if (!req?.body?.title)
    return res.status(400).json({ message: "Category title is required." });

  try {
    const category = await Category.create(req.body);
    return res.status(201).json({
      message: "Successfully created the category",
      category,
    });
  } catch (err) {
    return res.status(500).json({ error: "Could not create category" });
  }
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  if (!categories || categories.length === 0)
    return res.status(404).json({ message: "There is no categories!" });

  res.status(200).json(categories);
};

const getCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const category = await Category.findById({ _id: req.params.id }, req.body);
  if (!category)
    return res
      .status(404)
      .json({ message: "No category matches the provided ID" });

  res.status(200).json(category);
};

const updateCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const category = await Category.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { returnDocument: "after" }
  );

  if (!category)
    return res.status(404).json({ message: "No task matches the provided ID" });

  res
    .status(200)
    .json({ message: "Successfully edited the category", category });
};

const deleteCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const category = await Category.findByIdAndRemove({ _id: req.params.id });
  if (!category)
    return res
      .status(404)
      .json({ message: "No category matches the provided ID" });

  res
    .status(200)
    .json({ message: "Successfully deleted the category", category });
};

module.exports = {
  getAllCategories,
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory,
};
