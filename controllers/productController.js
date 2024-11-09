const {Product} = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const fs = require('fs')

class ProductController {
  async create(req, res) {
    try {
      const {name, description, price, ingredients, categoryId} = req.body;
      const {image} = req.files;

      let filename = uuid.v4() + ".jpg"

      await image.mv(path.resolve(__dirname, '..', 'static', filename))

      const product = await Product.create({
        name, description, price, ingredients, categoryId, image: filename
      })

      return res.json(product)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async getAllProducts(req, res) {
    const products = await Product.findAll()
    return res.json(products)
  }

  async getProducts(req, res) {
    const {id} = req.params
    const product = await Product.findOne(
      {where: {id}}
    )
    return res.json(product)
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

      if (req.files && req.files.image) {
        const {image} = req.files;
        filename = uuid.v4() + ".jpg"
        await image.mv(path.resolve(__dirname, '..', 'static', filename))

        if (product.image) {
          await fs.unlink(`${path.resolve(__dirname, '..', 'static', product.image)}`, (err) => console.log(err))
        }
      }

      const updateData = {
        ...textFields,
        ...(filename && {image: filename})
      };

      const updateProduct = await Product.update({
        ...updateData
      }, {where: {id}})

      return res.json(updateProduct)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async deleteProduct(req, res) {
    const {id} = req.params

    const product = await Product.findOne(
      {where: {id}}
    )

    if (product.image) {
      await fs.unlink(`${path.resolve(__dirname, '..', 'static', product.image)}`, (err) => console.log(err))
    }

    await Product.destroy({where: {id}})

    return res.json(product)
  }
}

module.exports = new ProductController()