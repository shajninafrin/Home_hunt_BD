const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    userId: String, 
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
});

module.exports = mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);

