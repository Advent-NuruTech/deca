// import mongoose from "mongoose";

// const donationSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null, // for guest donations
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//     },
//     name: {
//       type: String,
//       trim: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     currency: {
//       type: String,
//       default: "usd",
//     },
//     isRecurring: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "succeeded", "failed", "refunded"],
//       default: "pending",
//     },
//     stripePaymentIntentId: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     stripeSubscriptionId: {
//       type: String, // for recurring donations
//       sparse: true,
//     },
//     message: {
//       type: String, // optional donor message
//       trim: true,
//     },
//     isAnonymous: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// // Index for faster queries
// donationSchema.index({ email: 1, createdAt: -1 });
// donationSchema.index({ status: 1 });

// const Donation = mongoose.model("Donation", donationSchema);
// export default Donation;
