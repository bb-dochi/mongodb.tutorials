const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");

const mongoose = require("mongoose");
const config = require("../config");
const { generateFakeData } = require("../faker2");

const server = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        mongoose.set("debug", true);
        console.log("MongoDB connected");

        app.use(express.json());
        app.use("/user", userRouter);
        app.use("/blog", blogRouter);

        app.listen(3000, () => console.log("server listening on port 3000"));

        // await generateFakeData(3, 3, 3);
    } catch (err) {
        console.log(err);
    }
};

server();
