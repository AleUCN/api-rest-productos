const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProductByUuid,
  getPaginatedProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const auth = require('../middlewares/authMiddleware');

router.post('/', auth, createProduct);
router.get('/', auth, getPaginatedProducts);
router.get('/:uuid', auth, getProductByUuid);
router.patch('/:uuid', auth, updateProduct);
router.delete('/:uuid', auth, deleteProduct);

module.exports = router;
