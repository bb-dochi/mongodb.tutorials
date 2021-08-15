const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");
const mongoose = require("mongoose");

const server = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI is required!!");

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        // mongoose.set("debug", true);
        console.log("MongoDB connected");

        app.use(express.json());
        app.use("/user", userRouter);
        app.use("/blog", blogRouter);

        app.listen(3000, () => console.log("server listening on port 3000"));
    } catch (err) {
        console.log(err);
    }
};

server();
