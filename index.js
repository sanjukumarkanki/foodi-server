const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 6001;
const mongoose = require("mongoose");
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51OMA20SGw6JqmV1dtKYQUd5VvTVJORjktiuQ54aAo84P9DzcfoUhySPi5709JASIXto2VCdcCH0rcIzopBL4uBZs00KOQVreFY"
);

app.use(cors());
app.use(express.json());

// mongoose Connection
mongoose
  .connect(`${process.env.MONGO_CONNECTION}`)
  .then(console.log("Mongodb Connected Successfully."))
  .catch((error) => console.log(`Db Error : ${error}`));

// import routeshere
const menuRoutes = require("./api/routes/menuRoutes");
app.use("/menu", menuRoutes);

const cartRoute = require("./api/routes/cartRoutes");
app.use("/carts", cartRoute);

app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  // CartItems List

  // Creating stripe body json
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_type: ["card"],
  //   line_items: lineItems,
  //   mode: "payment",
  //   success_url: `http://localhost:5173/success`,
  //   cancel_url: `http://localhost:5173/cancel`,
  // });
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "/cart-page",
    cancel_url: "/cancel",
  });
  res.json({ id: session.id });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
