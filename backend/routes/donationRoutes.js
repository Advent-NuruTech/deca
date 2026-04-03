// import express from "express";
// import { protect, admin } from "../middleware/authMiddleware.js";
// import {
//   createDonation,
//   getAllDonations,
//   getUserDonations,
//   updateDonationStatus,
//   getDonationStats,
// } from "../controllers/donationController.js";

// const router = express.Router();

// // Public route (but requires payment method)
// router.post("/", createDonation);

// // Private routes (logged in users)
// router.get("/my-donations", protect, getUserDonations);

// // Admin only
// router.get("/admin", protect, admin, getAllDonations);
// router.get("/stats", protect, admin, getDonationStats);
// router.put("/:id/status", protect, admin, updateDonationStatus);

// export default router;
