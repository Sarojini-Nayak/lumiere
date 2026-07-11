import Category from "../models/Category.js";

// @desc Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create category (admin)
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug, description, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update category (admin)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    Object.assign(category, req.body);
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete category (admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
