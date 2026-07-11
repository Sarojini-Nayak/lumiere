import fs from "fs";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// @desc Get all products (with filters, sorting, pagination)
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      material,
      minPrice,
      maxPrice,
      search,
      sort,
      isNewArrival,
      isBestSeller,
      isFeatured,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (isNewArrival === "true") query.isNewArrival = true;
    if (isBestSeller === "true") query.isBestSeller = true;
    if (isFeatured === "true") query.isFeatured = true;
    if (material) query.material = material;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { ratings: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get related products (same category)
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create product (admin) with image upload
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      material,
      stone,
      sizes,
      colors,
      stock,
      sku,
      isFeatured,
      isNewArrival,
      isBestSeller,
      tags,
    } = req.body;

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "lumiere/products",
        });
        images.push({ url: result.secure_url, publicId: result.public_id });
        fs.unlinkSync(file.path); // remove local temp file
      }
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      price,
      discountPrice,
      material,
      stone,
      sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      colors: colors ? colors.split(",").map((c) => c.trim()) : [],
      stock,
      sku,
      isFeatured,
      isNewArrival,
      isBestSeller,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product (admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "lumiere/products",
        });
        product.images.push({ url: result.secure_url, publicId: result.public_id });
        fs.unlinkSync(file.path);
      }
    }

    const updatableFields = [
      "name",
      "description",
      "category",
      "price",
      "discountPrice",
      "material",
      "stone",
      "stock",
      "sku",
      "isFeatured",
      "isNewArrival",
      "isBestSeller",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    if (req.body.sizes) product.sizes = req.body.sizes.split(",").map((s) => s.trim());
    if (req.body.colors) product.colors = req.body.colors.split(",").map((c) => c.trim());
    if (req.body.tags) product.tags = req.body.tags.split(",").map((t) => t.trim());

    if (req.body.name) {
      product.slug = req.body.name.toLowerCase().trim().replace(/\s+/g, "-");
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete product (admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const image of product.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add product review
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a single product image (admin)
export const deleteProductImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const image = product.images.id(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    }
    image.deleteOne();
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
