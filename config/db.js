

const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://user120:lwpN3yZVKUrMAYK7@backendhomehunt.xnyk7he.mongodb.net/?retryWrites=true&w=majority&appName=backendhomehunt";
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
