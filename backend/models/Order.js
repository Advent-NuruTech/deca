import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        county: String,
        postalCode: String,
        country: {
          type: String,
          default: "South Sudan",
        },
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["mpesa", "bank_transfer", "cash_on_delivery", "card"],
      default: "mpesa",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "pickup"],
      default: "standard",
    },
  },
  {
    timestamps: true,
  },
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      const count = await mongoose.model("Order").countDocuments();
      this.orderNumber = `FTI-${Date.now()}-${String(count + 1).padStart(4, "0")}`;
    } catch (error) {
      // If count fails, use timestamp only
      this.orderNumber = `FTI-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
