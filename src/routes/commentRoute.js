const { Router } = require("express");
const { isValidObjectId, startSession } = require("mongoose");
const { Blog, User, Comment } = require("../models");
const commentRouter = Router({ mergeParams: true });
const COMMENT_PER_PAGE = 3;
commentRouter.post("/", async (req, res) => {
    const session = await startSession();
    let comment;
    try {
        await session.withTransaction(async () => {
            const { blogId } = req.params;
            const { content, userId } = req.body;

            if (!isValidObjectId(blogId))
                return res.status(400).send({ err: "blogId is invalid" });
            if (!isValidObjectId(userId))
                return res.status(400).send({ err: "userId is invalid" });

            if (typeof content !== "string")
                return res.status(400).send({ err: "content is required" });

            const [blog, user] = await Promise.all([
                Blog.findById(blogId, {}, { session }),
                User.findById(userId, {}, { session }),
            ]);

            if (!blog || !user)
                return res.status(400).send({ err: "not found blog or user" });
            if (!blog.islive)
                return res.status(400).send({ err: "blog is not avaliable" });

            comment = new Comment({ content, user, blog: blogId });

            blog.commentCount++;
            blog.comments.push(comment);
            if (blog.commentCount > COMMENT_PER_PAGE) blog.comments.shift();
            // Blog.updateOne(
            //     { _id: blogId },
            //     {
            //         $inc: { commentCount: 1 },
            //         $push: {
            //             comments: {
            //                 $each: [comment],
            //                 $slice: -COMMENT_PER_PAGE,
            //             },
            //         },
            //     }
            // ),
            await Promise.all([comment.save({ session }), blog.save()]);
        });
        return res.send({ comment });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    } finally {
        await session.endSession();
    }
});

commentRouter.get("/", async (req, res) => {
    try {
        const { page = 0 } = req.query;
        const skipNum = parseInt(page) * COMMENT_PER_PAGE;

        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: "blogId is invalid" });

        const comments = await Comment.find({ blog: blogId })
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .limit(COMMENT_PER_PAGE);
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
