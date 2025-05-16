const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, price, stock, active } = req.body;

    if (!name || !sku || price == null || stock == null) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    if (typeof name !== 'string' || name.length > 50) {
      return res.status(400).json({ message: 'El nombre debe ser un texto de hasta 50 caracteres.' });
    }

    if (typeof sku !== 'string' || sku.length > 30) {
      return res.status(400).json({ message: 'El SKU debe ser un texto de hasta 30 caracteres.' });
    }

    if (!Number.isInteger(price) || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número entero mayor a 0.' });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ message: 'El stock debe ser un número entero igual o mayor a 0.' });
    }

    if (active != null && typeof active !== 'boolean') {
      return res.status(400).json({ message: 'El campo "active" debe ser booleano (true o false).' });
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

    const { name, sku, price, stock, active } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.length > 50) {
        return res.status(400).json({ message: 'El nombre debe ser un texto de hasta 50 caracteres.' });
      }
    }

    if (sku !== undefined) {
      if (typeof sku !== 'string' || sku.length > 30) {
        return res.status(400).json({ message: 'El SKU debe ser un texto de hasta 30 caracteres.' });
      }
      const existing = await Product.findOne({ sku });
      if (existing && existing.uuid !== req.params.uuid) {
        return res.status(400).json({ message: 'El SKU ya está registrado por otro producto.' });
      }
    }

    if (price !== undefined) {
      if (!Number.isInteger(price) || price <= 0) {
        return res.status(400).json({ message: 'El precio debe ser un número entero mayor a 0.' });
      }
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ message: 'El stock debe ser un número entero igual o mayor a 0.' });
      }
    }

    if (active !== undefined && typeof active !== 'boolean') {
      return res.status(400).json({ message: 'El campo "active" debe ser booleano (true o false).' });
    }

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