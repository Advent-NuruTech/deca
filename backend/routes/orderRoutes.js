import express from "express";
import {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/:orderNumber", getOrderByNumber);
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);

export default router;
