const {ProductsCategories} = require("../models/models");
const uuid = require('uuid')
const path = require('path')

class CategoryController {
  async create(req, res) {
    try {
      const {name} = req.body;
      const {image} = req.files;

      let filename = uuid.v4() + ".jpg"

      await image.mv(path.resolve(__dirname, '..', 'static', filename))

      const category = await ProductsCategories.create({
        name,
        image: filename
      })

      return res.json(category)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async getAllCategories(req, res) {
    const categories = await ProductsCategories.findAll()
    return res.json(categories)
  }

  async getCategory(req, res) {
    const {id} = req.params
    const category = await ProductsCategories.findOne(
      {where: {id}}
    )
    return res.json(category)
  }

  async updateCategory(req, res) {
    try {
      const {id} = req.params
      const {name} = req.body
      const {image} = req.files;
      let filename = uuid.v4() + ".jpg"

      if (image) {
        await image.mv(path.resolve(__dirname, '..', 'static', filename))
      }

      const category = await ProductsCategories.update({
        name,
        image: filename
      }, {where: {id}})

      return res.json(category)
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async deleteCategory(req, res) {
    const {id} = req.params

    const category = await ProductsCategories.destroy({where: {id}})

    return res.json(category)
  }
}

module.exports = new CategoryController()