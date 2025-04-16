// Models/review-model.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
