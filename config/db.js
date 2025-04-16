

const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://user910:wixjQQg2MZZ8nMxY@backendhomehunt.xnyk7he.mongodb.net/?retryWrites=true&w=majority&appName=backendhomehunt";
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
