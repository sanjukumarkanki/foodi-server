const Carts = require("../model/Carts");

// get carts using email
const getCartByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    // console.log(email);
    const query = { email: email };
    const result = await Carts.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST TO CART WHEN ADD-TO-CART BTN CLICKED

const addToCart = async (req, res) => {
  const { menuItemId, name, recipe, image, price, quantity, email } = req.body;
  try {
    // exiting menu item
    const existingCartItem = await Carts.findOne({ menuItemId });
    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Product already exists in the cart!" });
    }

    const cartItem = await Carts.create({
      menuItemId,
      name,
      recipe,
      image,
      price,
      quantity,
      email,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const deletedCart = await Carts.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res.status(401).json({ message: "Cart Items not found!" });
    }
    res.status(200).json({ message: "Cart Item Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete All items from cart
const emptyCart = async (req, res) => {
  const { email } = req.query;
  // Assuming you are using email to identify users

  try {
    // Find and delete all cart items associated with the user's email
    const deletedCart = await Carts.deleteMany({ email: email });
    console.log(deletedCart, "deleted");
  } catch (error) {
    console.log(error);
  }
};

// updata a cart item
const updateCart = async (req, res) => {
  const cartId = req.params.id;
  const { menuItemId, name, recipe, image, price, quantity, email } = req.body;

  try {
    const updatedCart = await Carts.findByIdAndUpdate(
      cartId,
      { menuItemId, name, recipe, image, price, quantity, email },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart Item not found" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single recipe
const getSingleCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const cartItem = await Carts.findById(cartId);
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartByEmail,
  addToCart,
  deleteCart,
  updateCart,
  getSingleCart,
  emptyCart,
};
