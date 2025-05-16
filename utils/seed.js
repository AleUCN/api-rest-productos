const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const seedProducts = async (count = 100) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    await Product.deleteMany({});

    const products = [];

    for (let i = 0; i < count; i++) {
      products.push({
        uuid: uuidv4(),
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: faker.number.int({ min: 1000, max: 100000 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        active: faker.datatype.boolean()
      });
    }

    await Product.insertMany(products);
    console.log(`Se insertaron ${count} productos.`);
    process.exit();
  } catch (err) {
    console.error('Error al poblar la base de datos:', err);
    process.exit(1);
  }
};

seedProducts(100);
