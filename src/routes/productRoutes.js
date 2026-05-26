const express = require('express');
const router = express.Router();
const {
  getProducts,
  searchProduct,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Note: Ensure /search is placed before /:id so it doesn't get treated as an ID
router.get('/search', protect, searchProduct);

router.route('/')
  .get(protect, getProducts)
  .post(protect, addProduct);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
