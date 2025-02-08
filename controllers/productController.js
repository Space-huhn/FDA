const {Product} = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const fs = require('fs')

class ProductController {
  async create(req, res) {
    try {
      const {restaurantId, name, description, price, ingredients, categoryId} = req.body;

      const product = await Product.create({
        restaurantId, name, description, price, ingredients, categoryId
      })

      return res.json(product)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async getAllProducts(req, res) {
    try {
      let {restaurantId, categoryId, page, limit} = req.query;
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;
      let products;

      if (!restaurantId && !categoryId) {
        products = await Product.findAndCountAll({limit, offset});
      }

      if (restaurantId && !categoryId) {
        products = await Product.findAll({where: {restaurantId}, limit, offset});
      }

      if (!restaurantId && categoryId) {
        products = await Product.findAll({where: {categoryId}, limit, offset});
      }

      if (restaurantId && categoryId) {
        products = await Product.findAll({where: {restaurantId, categoryId}, limit, offset});
      }

      return res.json(products)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async updateProduct(req, res) {
    try {
      const {id} = req.params

      let filename;
      let textFields = {};

      if (req.body) {
        const {name, description, price, ingredients, categoryId} = req.body
        textFields = {name, description, price, ingredients, categoryId}
      }

      const product = await Product.findOne(
        {where: {id}}
      )


      const updateProduct = await Product.update({
        ...updateData
      }, {where: {id}})

      return res.json(updateProduct)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async productImage(req, res) {
    try {
      if (!req.files) return res.status(401).json({message: "File not found"})

      const {id} = req.params;

      let filename;

      const product = await Product.findOne(
        {where: {id}}
      )

      const {image} = req.files;
      filename = uuid.v4() + ".jpg";
      await image.mv(path.resolve(__dirname, '..', 'static', filename));

      if (product.image) {
        await fs.unlink(`${path.resolve(__dirname, '..', 'static', product.image)}`, (err) => console.log(err))
      }

      await Product.update({
        image: filename
      }, {where: {id}})

      return res.json({message: 'Product image updated successfully', image: filename})
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async deleteProduct(req, res) {
    try {
      const {id} = req.params

      const product = await Product.findOne(
        {where: {id}}
      )

      if (product.image) {
        await fs.unlink(`${path.resolve(__dirname, '..', 'static', product.image)}`, (err) => console.log(err))
      }

      await Product.destroy({where: {id}})

      return res.json({message: "Deleted successfully"})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

module.exports = new ProductController()