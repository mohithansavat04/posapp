const Order = require('../models/Order');

const User = require('../models/User');

// @desc    Create new order/bill
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      subtotal,
      gst,
      total,
      paymentMethod,
      customerPhone,
      customerName
    } = req.body;

    if (items && items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const orderData = {
        items,
        subtotal,
        gst,
        total,
        paymentMethod
      };
      
      if (customerPhone) {
        let user = await User.findOne({ phone: customerPhone, role: 'customer' });
        if (!user) {
          user = await User.create({
            phone: customerPhone,
            name: customerName || 'Customer',
            role: 'customer'
          });
        }
        orderData.customer = user._id;
      }

      const order = new Order(orderData);
      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders/bills
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('customer', 'name phone').populate('items.product', 'name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name phone email address');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById };
