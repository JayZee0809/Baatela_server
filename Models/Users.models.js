const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    displayName : {
        type : String,
        maxLength : 32,
        required : false
    },

    uid : {
        type : String,
        required : true,
        unique : true
    },

    phoneNumber : {
        type : String,
        required : true,
        unique : true,
        minLength : 13,
        maxLength : 13
    },

    status : {
        type : String,
        required : false,
        maxLength : 200
    },

    displayPicture : {
        type : String,
        required : false
    },
},
{
    timestamps : true
});

const User = mongoose.model("User",UserSchema);
module.exports = User;