const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProductByUuid,
  getPaginatedProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');


router.post('/', createProduct);
router.get('/', getPaginatedProducts);
router.get('/:uuid', getProductByUuid);
router.patch('/:uuid', updateProduct);
router.delete('/:uuid', deleteProduct);

module.exports = router;
