// import Donation from "../models/Donation.js";
// import stripe from "../config/stripe.js"; // you'll need to create this config file
// import User from "../models/User.js";

// // @desc    Create a donation (one-time)
// // @route   POST /api/donations
// // @access  Public (or Private if user logged in)
// export const createDonation = async (req, res) => {
//   try {
//     const { amount, email, name, message, isAnonymous, paymentMethodId } =
//       req.body;

//     if (!amount || amount < 1) {
//       return res.status(400).json({ message: "Invalid donation amount" });
//     }

//     let userId = null;
//     let userEmail = email;
//     let userName = name;

//     // If user is logged in, use their info
//     if (req.user) {
//       userId = req.user._id;
//       userEmail = req.user.email;
//       userName = req.user.name;
//     }

//     // Create Stripe PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // in cents
//       currency: "usd",
//       payment_method: paymentMethodId,
//       confirmation_method: "manual",
//       confirm: true,
//       receipt_email: userEmail,
//       metadata: {
//         type: "donation",
//         userId: userId?.toString() || "guest",
//         isAnonymous: isAnonymous ? "true" : "false",
//       },
//     });

//     // Save donation record
//     const donation = await Donation.create({
//       user: userId,
//       email: userEmail,
//       name: userName,
//       amount,
//       status: paymentIntent.status === "succeeded" ? "succeeded" : "pending",
//       stripePaymentIntentId: paymentIntent.id,
//       message,
//       isAnonymous: isAnonymous || false,
//     });

//     res.status(201).json({
//       success: true,
//       donation,
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Donation error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get all donations (admin only)
// // @route   GET /api/donations/admin
// // @access  Private/Admin
// export const getAllDonations = async (req, res) => {
//   try {
//     const donations = await Donation.find()
//       .populate("user", "name email")
//       .sort("-createdAt");
//     res.json(donations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get logged-in user's donations
// // @route   GET /api/donations/my-donations
// // @access  Private
// export const getUserDonations = async (req, res) => {
//   try {
//     const donations = await Donation.find({ user: req.user._id }).sort(
//       "-createdAt",
//     );
//     res.json(donations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Update donation status (webhook or admin)
// // @route   PUT /api/donations/:id/status
// // @access  Private/Admin
// export const updateDonationStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     if (!["pending", "succeeded", "failed", "refunded"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const donation = await Donation.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true },
//     );
//     if (!donation) {
//       return res.status(404).json({ message: "Donation not found" });
//     }
//     res.json(donation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get donation statistics (admin dashboard)
// // @route   GET /api/donations/stats
// // @access  Private/Admin
// export const getDonationStats = async (req, res) => {
//   try {
//     const totalDonations = await Donation.aggregate([
//       { $match: { status: "succeeded" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const count = await Donation.countDocuments({ status: "succeeded" });
//     const recent = await Donation.find({ status: "succeeded" })
//       .sort("-createdAt")
//       .limit(5);

//     res.json({
//       totalAmount: totalDonations[0]?.total || 0,
//       totalCount: count,
//       recent,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
