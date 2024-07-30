const express = require("express");
const router = express.Router();
const { Fruits, sequelize } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get("/", async (req, res) => {
  try {
    const fruits = await Fruits.findAll();
    res.json(fruits);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
});

router.post("/addFruit", validateToken, async (req, res) => {
  const addFruit = req.body;

  const transaction = await sequelize.transaction();

  try {
    const role = "admin";

    if (role === "admin") {
      // use bulkCreate to allow feature of adding multiple fruits in future  
      const result = await Fruits.bulkCreate(addFruit, { transaction });

      // Commit the transaction
      await transaction.commit();

      res.json(result);
    } else {
      res.status(403).json({ message: "Unauthorised" });
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
});

router.post("/deleteFruit", validateToken, async (req, res) => {
  const { fruitId } = req.body;
  try {
    const role = req.user.role;

    if (role === "admin") {
      await Fruits.destroy({ where: { id: fruitId}});
      res.status(200).json({ message: 'Successfully Deleted' })
    };
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
});

router.post("/updateQuantity", validateToken, async (req, res) => {
  const { fruitId, stockQuantity } = req.body;
  try {
    const role = req.user.role;

    if (role === "admin") {
      await Fruits.update(
        { stock: stockQuantity },
        { where: { id: fruitId } }
      );
      res.status(200).json({ message: `Successfully Updated Stock for Fruit ID ${fruitId}`});
    };

  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
});

module.exports = router;