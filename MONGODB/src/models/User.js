const { Schema, model } = require('mongoose');

// information of schema
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    age: Number,
    email: String
}, { timestamps: true })

// users라는 collection은 Userschema로 이루어진다고 알려주는 것
const User = model('user', UserSchema)
module.exports = { User }