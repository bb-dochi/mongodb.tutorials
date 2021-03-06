const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");
const mongoose = require("mongoose");

const server = async () => {
    try {
        const { PORT, MONGO_URI } = process.env;
        if (!PORT) throw new Error("PORT is required!!");
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

        app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};

server();
