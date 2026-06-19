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

// @desc    Sync dummy products
// @route   POST /api/products/sync
// @access  Private
const syncDummyProducts = async (req, res, next) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const categories = ['Beverages', 'Snacks', 'Main Course', 'Desserts', 'Breads'];
    const dummyProducts = [];

    for (let i = 1; i <= 100; i++) {
      const category = categories[i % categories.length];
      const price = Math.floor(Math.random() * 500) + 50; // Random price between 50 and 550
      const stock = Math.floor(Math.random() * 100) + 10;
      
      dummyProducts.push({
        name: `Dummy ${category} Item ${i}`,
        barcode: `1000${i.toString().padStart(3, '0')}`,
        price: price,
        stock: stock,
        category: category
      });
    }

    await Product.insertMany(dummyProducts);
    res.status(201).json({ message: '100 dummy products synced successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, searchProduct, addProduct, updateProduct, deleteProduct, syncDummyProducts };
