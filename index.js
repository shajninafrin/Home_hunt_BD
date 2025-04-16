const express = require('express');
const Product = require('./Models/product-model');
const db = require("./config/db");

const app = express();
app.use(express.json());

const port= 9353;




app.get("/search", async (req, res) => {
    try {
        const { name, price, area, category } = req.query;

        
        const filter = {
            $or: []
        };

        if (name) filter.$or.push({ name: { $regex: name, $options: "i" } });
        if (price) filter.$or.push({ price: +price }); 
        if (area) filter.$or.push({ area: { $regex: area, $options: "i" } });
        if (category) filter.$or.push({ category: { $regex: category, $options: "i" } });

        
        if (filter.$or.length === 0) {
            return res.status(400).json({ error: "No search parameters provided" });
        }

        const data = await Product.find(filter);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Search failed", details: err });
    }
});



app.listen(9353, () => {
    console.log("Server is running on port 9353");
});



const Wishlist = require('./Models/wishlist-model');

app.post("/wishlist/:userID", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ error: "userId and productId are required" });
        }

        
        const exists = await Wishlist.findOne({ userId, productId });
        if (exists) {
            return res.status(400).json({ error: "Product already in wishlist" });
        }

        const newItem = new Wishlist({ userId, productId });
        await newItem.save();

        res.json({ message: "Added to wishlist", wishlist: newItem });
    } catch (err) {
        res.status(500).json({ error: "Failed to add to wishlist", details: err });
    }
});

app.get("/wishlist/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist.find({ userId }).populate("productId");

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch wishlist", details: err });
    }
});



app.delete("/wishlist", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const result = await Wishlist.findOneAndDelete({ userId, productId });

        if (!result) {
            return res.status(404).json({ error: "Wishlist item not found" });
        }

        res.json({ message: "Removed from wishlist" });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove from wishlist", details: err });
    }
});



//Review
const Review = require('./Models/review-model');

// for adding review
app.post("/reviews", async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        if (!userId || !productId || !rating) {
            return res.status(400).json({ error: "userId, productId, and rating are required" });
        }

        const newReview = new Review({ userId, productId, rating, comment });
        await newReview.save();

        res.json({ message: "Review added", review: newReview });
    } catch (err) {
        res.status(500).json({ error: "Failed to add review", details: err });
    }
});

// to see reviews 
app.get("/reviews/:productId", async (req, res) => {
    try {
        const cleanProductId = req.params.productId.trim();
        const reviews = await Review.find({ cleanProductId });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews", details: err });
    }
});

// Rating
app.get("/reviews/:productId/average", async (req, res) => {
    try {
        const cleanProductId = req.params.productId.trim();


        const result = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(cleanProductId) } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length === 0) {
            return res.json({ averageRating: 0, totalReviews: 0 });
        }

        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate average rating", details: err });
    }
});
