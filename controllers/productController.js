import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productModel.js";

//@desc    Get All Products
//@route   GET /api/products
//@access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.status(200).json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

//@desc    Get Product Details
//@route   GET /api/products/:id
//@access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  }
  res.status(404);
  throw new Error("Resource not found");
});

//@desc    Create Product
//@route   POST /api/products
//@access  Private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "sample desc",
  });
  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

//@desc    Update Product
//@route   PUT /api/products/:id
//@access  Private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, brand, category, countInStock, image, description } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.image = image;
    product.description = description;
    const updateProduct = await product.save();
    res.status(200).json(updateProduct);
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});
//@desc    Delete Product
//@route   DELETE /api/products/:id
//@access  Private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product Deleted" });
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

//@desc    Create A New Review
//@route   DELETE /api/products/:id/reviews
//@access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviews = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviews) {
      res.status(400);
      throw new Error("Product already reviewed");
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review Added" });
    }
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(3);

  res.json(products);
});
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
