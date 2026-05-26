const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search?q=...
// @access  Private
const searchProduct = async (req, res, next) => {
  try {
    const keyword = req.query.q ? {
      name: {
        $regex: req.query.q,
        $options: 'i'
      }
    } : {};
    
    // Also allow searching by barcode if the query is a number/string matching exactly
    if (req.query.q) {
        keyword.$or = [
            { name: { $regex: req.query.q, $options: 'i' } },
            { barcode: req.query.q }
        ];
        delete keyword.name;
    }

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const addProduct = async (req, res, next) => {
  try {
    const { name, barcode, price, stock, category } = req.body;
    const product = new Product({ name, barcode, price, stock, category });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const { name, barcode, price, stock, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.barcode = barcode || product.barcode;
      product.price = price || product.price;
      product.stock = stock !== undefined ? stock : product.stock;
      product.category = category || product.category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, searchProduct, addProduct, updateProduct, deleteProduct };
