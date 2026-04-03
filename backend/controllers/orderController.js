import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      shippingMethod,
      notes,
    } = req.body;

    // Validate items and check stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          message: `Product ${item.name} not found`,
        });
      }
      if (!product.inStock || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      customer,
      items: items.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: paymentMethod || "mpesa",
      shippingMethod: shippingMethod || "standard",
      notes,
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by order number
// @route   GET /api/orders/:orderNumber
// @access  Public
export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (with filtering & pagination)
// @route   GET /api/orders
// @access  Public (should be protected in production)
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("items.product");

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (should be protected in production)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
