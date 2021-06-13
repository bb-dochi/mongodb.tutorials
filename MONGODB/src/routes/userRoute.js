const mongoose = require("mongoose");
const { Router } = require("express");
const { User } = require("../models");
const userRouter = Router();

userRouter.get("/", async (req, res) => {
    try {
        const users = await User.find();
        return res.send({ users: users });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

userRouter.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: "invalid UserId" });

        const user = await User.findOne({ _id: userId });
        return res.send({ user: user });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

userRouter.post("/", async (req, res) => {
    try {
        let { username, name } = req.body;
        if (!username)
            return res.status(540).send({ err: "username is required." });
        if (!name || !name.first || !name.last)
            return res
                .status(400)
                .send({ err: "Both first, last names are required." });

        const user = new User(req.body);
        await user.save();

        return res.send({ user });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

userRouter.put("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, age } = req.body;

        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: "invalid UserId" });
        if (!name && !age)
            return res.status(400).send({ err: "age or name is required." });
        if (
            name &&
            (typeof name.first !== "string" || typeof name.last !== "string")
        )
            return res.status(400).send({ err: "name must be a string" });
        if (age && typeof age !== "number")
            return res.status(400).send({ err: "age must be a number" });

        let user = await User.findById(userId);

        if (name) user.name = name;
        if (age) user.age = age;

        await user.save();
        return res.send({ user: user });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

userRouter.delete("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: "invalid UserId" });

        const user = await User.findOneAndDelete({ _id: userId });
        return res.send({ user: user });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter,
};
