const express = require("express");
const Order = require("../models/orderModel");
const { isAuth, isAdmin } = require("../utils/auth");

const router = express.Router();

//@route    GET api/orders
//@desc     GET all orders
//@access   Private
router.get("/", isAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    GET api/orders/mine
//@desc     GET user orders
//@access   Private
router.get("/mine", isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    GET api/orders/:id
//@desc     GET single order
//@access   Private
router.get("/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    DELETE api/orders/:id
//@desc     DELETE single order
//@access   Private
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const deletedOrder = await order.remove();
    res.json(deletedOrder);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    POST api/orders
//@desc     CREATE new order
//@access   Private
router.post("/", isAuth, async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });

  try {
    const newOrderCreated = await newOrder.save();
    res.status(201).json({ msg: "New Order Created", data: newOrderCreated });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    PUT api/orders/:id/pay
//@desc     MAKE PAYMENT for order
//@access   Private
router.put("/:id/pay", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    (order.isPaid = true),
      (order.paidAt = Date.now()),
      (order.payment = {
        paymentMethod: "paypal",
        paymentResult: {
          payerID: req.body.payerID,
          orderID: req.body.orderID,
          paymentID: req.body.paymentID,
        },
      });

    const updatedOrder = await order.save();
    res.json({ msg: "Order Paid.", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
