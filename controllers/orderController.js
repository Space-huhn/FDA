const {Product, Orders, OrderItems, User} = require("../models/models");

class OrderController {
  async create(req, res) {
    try {
      const {userId, deliveryAddress, products} = req.body;

      const order = await Orders.create({
        userId, deliveryAddress
      })

      if (!products.length > 0) return res.status(500).json({message: "No products in order"})

      const orderItemsData = products.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      }));

      await OrderItems.bulkCreate(orderItemsData);

      return res.json({order, orderItemsData})
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getAllUserOrders(req, res) {
    try {
      const {userId} = req.query;

      const orders = await Orders.findAll(
        {
          where: {userId},
          include: [
            {
              model: OrderItems,
              include: [{model: Product}]
            }, {
              model: User, attributes: ['name', 'avatar', 'telephone']
            }
          ]
        }
      )

      return res.json(orders)
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  async getOrder(req, res) {
    try {
      const {id} = req.params;

      const order = await Orders.findOne(
        {
          where: {id},
          include: [
            {
              model: OrderItems,
              include: [{model: Product}]
            }, {
              model: User, attributes: ['name', 'avatar', 'telephone']
            }
          ]
        }
      )

      return res.json(order)
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  async changeStatus(req, res) {
    try {
      const {id} = req.params;
      const {newStatus} = req.body;

      if (!["Pending", "Processing", "Completed", "Cancelled"].includes(newStatus)) return res.status(401).json({message: "Status error"})

      const order = await Orders.update({
        status: newStatus
      }, {where: {id}})


      res.status(200).json({message: "Change Status Successful", newStatus: newStatus})
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }
}

module.exports = new OrderController()