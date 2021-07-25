const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Blog, User, Comment } = require("../models");
const commentRouter = Router({ mergeParams: true });

commentRouter.post("/", async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content, userId } = req.body;

        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: "blogId is invalid" });
        if (!isValidObjectId(userId))
            return res.status(400).send({ err: "userId is invalid" });

        if (typeof content !== "string")
            return res.status(400).send({ err: "content is required" });

        const [blog, user] = await Promise.all([
            Blog.findById(blogId),
            User.findById(userId),
        ]);

        if (!blog || !user)
            return res.status(400).send({ err: "not found blog or user" });
        if (!blog.islive)
            return res.status(400).send({ err: "blog is not avaliable" });

        const comment = new Comment({ content, user });
        await Promise.all([
            comment.save(),
            await Blog.updateOne(
                { _id: blogId },
                { $push: { comments: comment } }
            ),
        ]);

        return res.send({ comment });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

commentRouter.get("/", async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: "blogId is invalid" });

        const { comments } = await Blog.findOne({ _id: blogId });
        return res.send(comments);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

commentRouter.patch("/:commentId", async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { content } = req.body;

        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: "blogId is invalid" });
        if (!isValidObjectId(commentId))
            return res.status(400).send({ err: "commentId is invalid" });

        if (typeof content !== "string")
            return res.status(400).send({ err: "content is required" });

        const [comment] = await Promise.all([
            await Comment.findOneAndUpdate(
                { _id: commentId },
                { content },
                { new: true }
            ),
            await Blog.updateOne(
                { _id: blogId, "comments._id": commentId },
                { "comments.$.content": content }
            ),
        ]);

        return res.send(comment);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

commentRouter.delete("/:commentId", async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: "blogId is invalid" });
        if (!isValidObjectId(commentId))
            return res.status(400).send({ err: "commentId is invalid" });

        const comment = await Comment.findOneAndDelete({ _id: commentId });
        await Blog.updateOne(
            { _id: blogId },
            { $pull: { comments: { _id: commentId } } }
        );

        return res.send({ comment });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

module.exports = { commentRouter };
