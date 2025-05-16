const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, price, stock, active } = req.body;

    if (!name || !sku || price == null || stock == null) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      return res.status(400).json({ message: 'El SKU ya está registrado.' });
    }

    const newProduct = new Product({
      uuid: uuidv4(),
      name,
      sku,
      price,
      stock,
      active
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.getProductByUuid = async (req, res) => {
  try {
    const product = await Product.findOne({ uuid: req.params.uuid });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.getPaginatedProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find().skip(skip).limit(parseInt(limit));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { uuid: req.params.uuid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto.', error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { uuid: req.params.uuid },
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};