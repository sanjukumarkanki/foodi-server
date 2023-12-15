const express = require("express");
const Carts = require("../model/Carts");
const router = express.Router();

const cartController = require("../controllers/cartControllers");
router.get("/", cartController.getCartByEmail);
router.post("/", cartController.addToCart);
router.delete("/:id", cartController.deleteCart);
router.delete("/", cartController.emptyCart);
router.put("/:id", cartController.updateCart);
router.get("/:id", cartController.getSingleCart);

module.exports = router;
