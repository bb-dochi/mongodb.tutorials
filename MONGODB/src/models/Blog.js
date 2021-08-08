const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

const BlogSchema = new Schema(
    {
        title: { type: String, require: true },
        content: { type: String, require: true },
        islive: { type: Boolean, require: true, default: false },
        user: {
            _id: { type: Types.ObjectId, require: true, ref: "user" },
            username: { type: String, require: true },
            name: {
                first: { type: String, required: true },
                last: { type: String, required: true },
            },
        },
        commentCount: { type: Number, default: 0, required: true },
        comments: [CommentSchema],
    },
    { timestamps: true }
);

BlogSchema.index({ "user._id": 1, updatedAt: 1 });
BlogSchema.index({ title: "text" });

const Blog = model("blog", BlogSchema);
module.exports = { Blog };
