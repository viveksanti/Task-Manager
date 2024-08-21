const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { 
        type: String,
        required: true,
        unique: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
     },
     mobile: { 
        type: String,
        required: true
     },
    role: {
         type: String,
         enum: ['user', 'admin',],
         default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let userModel = mongoose.model("users", UserSchema);

module.exports = {
    userModel: userModel
}
