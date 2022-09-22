const asyncHandler = require('express-async-handler');
const generateWebToken = require('../Config/token.generate');
const User = require('../Models/Users.models');

const authUser = asyncHandler(async(req, res) => {
    const { phoneNumber, uid, displayPicture } = req.body;
    if(!phoneNumber || !uid){
        res.status(400);
        throw new Error("couldn't authenticate user, try again...");
    }
    const oldUser = await User.findOne({phoneNumber});

    if(!oldUser){
        const token = generateWebToken(uid);
        const user = await User.create({
            phoneNumber,
            uid,
            displayPicture,
            token
        });
        if(user){
            res.status(201);
        }else{
            res.status(400);
            throw new Error('failed to create new user...');
        }
    }else {
        res.status(201).json(oldUser);
    }
});

const loadUsers = asyncHandler(async (req,res) => {
    const id = req.query.search ? { uid : { $regex : req.query.search } } : {};
    if(!id){
        res.status(500);
        throw new Error("invalid params, try again");
    }
    const user = req.user[0];
    const users = await User.find(id)
    .find({_id : { $ne : user._id }});
    if(!users){
        res.status(400);
        throw new Error("couldn't find user: invalid user options");
    }
    res.status(201).json({
        ...users
    });
});

const editUserDP = asyncHandler(async (req, res) => {
    const { displayPicture, uid } = req.body;
    try{
        if(!uid){
            res.status(400);
            throw new Error("couldn't authenticate user, try again...");
        }

        const updatedOptions = {
            displayPicture
        };

        const updatedUser = await User.findOneAndUpdate({uid},updatedOptions,{new : true});
        if(!updatedUser){
            res.status(400);
            throw new Error("Not Found/Couldn't Update User");
        }
        res.status(201).json(updatedUser);

    }catch(err){
        throw err;
    }

});

module.exports = { authUser, loadUsers, editUserDP };