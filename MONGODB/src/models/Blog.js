const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
    {
        title: { type: String, require: true },
        content: { type: String, require: true },
        islive: { type: Boolean, require: true, default: false },
        user: { type: Types.ObjectId, require: true, ref: "user" },
    },
    { timestamps: true }
);

const Blog = model("blog", BlogSchema);
module.exports = { Blog };
