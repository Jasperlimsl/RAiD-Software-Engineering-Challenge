const express = require("express");
const router = express.Router();
const { Orders, Order_Details, Fruits, Users, sequelize } = require("../models");
const {validateToken} = require('../middlewares/AuthMiddleware')

router.post("/submitOrder", validateToken, async (req, res) => {

  const transaction = await sequelize.transaction();

  try {
    const { usersId, fruitsOrdered, total_price_cents } = req.body;
    console.log(fruitsOrdered);
    
    // Create a new order
    const newOrder = await Orders.create(
      { 
        usersId: usersId,
        total_price_cents: total_price_cents,
        fulfilled: false
      }, {transaction}
    );

    // For each fruit ordered, create an order_details entry in database
    for (const fruitOrdered in fruitsOrdered) {
      const fruitsId = parseInt(fruitOrdered, 10);
      const quantity = parseInt(fruitsOrdered[fruitOrdered], 10);
      // check if fruit exists and check stock
      const fruit = await Fruits.findByPk(fruitsId, { transaction });
      if (!fruit) {
        const error = new Error(`Fruit ${fruitsId} not found`);
        error.statusCode = 404;
        throw error;
      }
      if (fruit.stock < quantity) {
        const error = new Error(`Insufficient stock for ${fruit.name}`);
        error.statusCode = 400;
        throw error;
      }

      // calculate the subtotal price of each type of fruit within the order
      const subtotal_price_cents = fruit.price_cents * quantity

      await Order_Details.create(
        {
          ordersId: newOrder.id,
          fruitsId: fruitsId,
          quantity: quantity,
          subtotal_price_cents: subtotal_price_cents
        },
        { transaction }
      );

      // Update fruit stock (deduct that was ordered)
      await Fruits.update(
        { stock: fruit.stock - quantity },
        { where: { id: fruitsId }, transaction }
      );
    };

    // Commit the transaction
    await transaction.commit();
    res.status(201).json(newOrder);

  } catch (error) {
    // if there are errors while executing the order, rollback changes made to database
    await transaction.rollback();
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "An unexpected error occurred. Please try again later." });
  }
});

router.get('/orderHistory', validateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch orders and include related Order_Details and Fruits information
    const orders = await Orders.findAll({
      where: { usersId: userId },
      include: [
        {
          model: Order_Details,
          as: 'orderDetails',
          include: [
            {
              model: Fruits,
              as: 'fruits',
              attributes: ['name', 'price_cents'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']], // Orders by newest first
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve order history' });
  }
});

router.get('/orderFulfillmentList', validateToken, async (req, res) => {
  try {
    const role = req.user.role;

    // Fetch Orders and include related Order_Details, Fruits and User information
    if (role === "admin") {
      const orders = await Orders.findAll({
        include: [
          {
            model: Order_Details,
            as: 'orderDetails',
            include: [
              {
                model: Fruits,
                as: 'fruits',
                attributes: ['name', 'price_cents'],
              },
            ],
          },
          {
            model: Users,
            as: 'users',
            attributes: ['username']
          }
        ],
        order: [['id', 'DESC']], // Sort Orders by Order Id
      });
      res.status(200).json(orders);
    } else {
      res.status(401).json({ message: "Unauthorised access." })
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve order history' });
  }
});

router.post("/fulfilOrder", validateToken, async (req, res) => {
  try {
    const { ordersId } = req.body;

    if (req.user.role === "admin") {
      await Orders.update(
        { fulfilled: true }, 
        { where: { id : ordersId } }
      )
    }

    res.status(200).json({ message: "Successfully Updated" })

  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
})

router.post("/undoFulfilOrder", validateToken, async (req, res) => {
  try {
    const { ordersId } = req.body;

    if (req.user.role === "admin") {
      await Orders.update(
        { fulfilled: false }, 
        { where: { id : ordersId } }
      )
    }

    res.status(200).json({ message: "Successfully Updated" })

  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
})

module.exports = router;