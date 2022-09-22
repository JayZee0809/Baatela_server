const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    name : {
        type : String,
        trim : true
    },
    isPersonalChat : {
        type : Boolean,
        required : true,
        default : false
    },
    members : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
    ],
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
},
{
    timestamps : true
});

const Chat = mongoose.model('Chat',ChatSchema);

module.exports = Chat;