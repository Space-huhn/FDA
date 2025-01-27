const {Restaurant, Product} = require("../models/models");
const uuid = require('uuid')
const path = require('path')
const fs = require("fs");
const e = require("express");

class RestaurantController {
  async create(req, res) {
    try {
      const {name, description, deliveryTime, deliveryPrice} = req.body;

      const restaurant = await Restaurant.create({
        name,
        description,
        deliveryTime,
        deliveryPrice,
      })

      return res.json(restaurant)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async restaurantImage(req, res) {
    try {
      if (!req.files) return res.status(401).json({message: "File not found"})

      const {id} = req.params;

      let filename;

      const restaurant = await Restaurant.findOne(
        {where: {id}}
      )

      if (!restaurant) {
        return res.status(401).json({message: "Restaurant not found"})
      }

      const {image} = req.files;
      filename = uuid.v4() + ".jpg";
      await image.mv(path.resolve(__dirname, '..', 'static', filename));

      if (restaurant.image) {
        await fs.unlink(`${path.resolve(__dirname, '..', 'static', restaurant.image)}`, (err) => console.log(err))
      }

      await Restaurant.update({
        image: filename
      }, {where: {id}})

      return res.json({message: 'Image updated successfully', Image: filename})
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async getAllRestaurants(req, res) {
    const restaurants = await Restaurant.findAll()
    return res.json(restaurants)
  }

  async getRestaurant(req, res) {
    const {id} = req.params;

    const restaurant = await Restaurant.findOne(
      {where: {id}}
    )

    return res.json(restaurant)
  }

  async updateRestaurant(req, res) {
    try {
      const {id} = req.params

      if (!req.body) return res.status(401).json({message: "Error"})

      const {name, description, price, ingredients, categoryId} = req.body

      await Restaurant.update({
        name, description, price, ingredients, categoryId
      }, {where: {id}})

      const restaurant = await Restaurant.findOne(
        {where: {id}}
      )

      return res.json({message: "Updated restaurant", restaurant: restaurant})
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


  async test(req, res) {
    try {
      const {id} = req.params

      const restaurant = await Restaurant.findOne({
        where: {id},
        include: [
          {model: Product},
        ]
      })

      return res.json({message: "Restaurant found", restaurant: restaurant})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

//add delete products from restaurants on delete restaurants
//users permission per restaurants

module.exports = new RestaurantController()