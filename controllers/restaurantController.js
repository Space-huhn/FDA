const {Restaurant} = require("../models/models");
const uuid = require('uuid')
const path = require('path')
const fs = require("fs");

class RestaurantController {
  async create(req, res) {
    try {
      const {name, description, rating, deliveryTime, deliveryPrice} = req.body;
      const {image} = req.files;

      let filename = uuid.v4() + ".jpg"

      await image.mv(path.resolve(__dirname, '..', 'static', filename))

      const restaurant = await Restaurant.create({
        name,
        description,
        rating,
        deliveryTime,
        deliveryPrice,
        image: filename
      })

      return res.json(restaurant)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async getAllRestaurants(req, res) {
    const restaurants = await Restaurant.findAll()
    return res.json(restaurants)
  }

  async getRestaurant(req, res) {
    const {id} = req.params
    const restaurant = await Restaurant.findOne(
      {where: {id}}
    )
    return res.json(restaurant)
  }

  async updateRestaurant(req, res) {
    try {
      const {id} = req.params

      let filename;
      let textFields = {};

      if (req.body) {
        const {name, description, price, ingredients, categoryId} = req.body
        textFields = {name, description, price, ingredients, categoryId}
      }

      const restaurant = await Restaurant.findOne(
        {where: {id}}
      )

      if (req.files && req.files.image) {
        const {image} = req.files;
        filename = uuid.v4() + ".jpg"
        await image.mv(path.resolve(__dirname, '..', 'static', filename))

        if (restaurant.image) {
          await fs.unlink(`${path.resolve(__dirname, '..', 'static', restaurant.image)}`, (err) => console.log(err))
        }
      }

      const updateData = {
        ...textFields,
        ...(filename && {image: filename})
      };

      const updateRestaurant = await Restaurant.update({
        ...updateData
      }, {where: {id}})

      return res.json(updateRestaurant)
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async deleteRestaurant(req, res) {
    const {id} = req.params

    const restaurant = await Restaurant.findOne(
      {where: {id}}
    )

    if (restaurant.image) {
      await fs.unlink(`${path.resolve(__dirname, '..', 'static', restaurant.image)}`, (err) => console.log(err))
    }

    await Restaurant.destroy({where: {id}})

    return res.json(restaurant)
  }
}

//add delete products from restaurants on delete restaurants
//users permission per restaurants

module.exports = new RestaurantController()