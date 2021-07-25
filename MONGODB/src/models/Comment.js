const { Schema, model, Types } = require("mongoose");

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        user: {
            _id: { type: Types.ObjectId, required: true, ref: "user" },
            username: { type: String, required: true },
            name: {
                first: { type: String, required: true },
                last: { type: String, required: true },
            },
        },
    },
    { timestamps: true }
);

const Comment = model("comment", CommentSchema);
module.exports = { Comment, CommentSchema };
