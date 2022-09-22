const asyncHandler = require("express-async-handler");
const Chat = require("../Models/Chats.models");


const getChat = asyncHandler(async (req,res) => {
    const { id } = req.body;
    try{
        if(!id) {
            res.status(400);
            throw new Error('Unauthorized request');
        }

        const isValidChat = await Chat.find({
            isPersonalChat : true,
            $and : [
                { members : { $elemMatch : {$eq : req.user[0]._id}}},
                { members : { $elemMatch : {$eq : id}}}
            ],
        }).populate('members','-status');
        if(isValidChat.length > 0){
            res.send(isValidChat[0]);
        }else {
            const newChatBody = {
                name : 'sender',
                isPersonalChat : true,
                members : [ req.user[0]._id, id ]
            };
            const newChat = await Chat.create(newChatBody);
            if(newChat){
                const resChat = await Chat.findOne({ _id : newChat._id }).populate("members",'-status');
                res.status(200).send(resChat);
            }else {
                res.status(400);
                throw new Error("couldn't create a new chat");
            }
        }
    }catch(err){
        throw err;
    }
});

const fetchChats = asyncHandler(async (req,res) => {
    try{
        const allChats = await Chat.find({ members: { $elemMatch : { $eq : req.user[0]._id } } })
        .populate('members')
        .populate('groupAdmin')
        .sort({ updatedAt: -1 });
        res.send(allChats);
    }catch(err){
        res.status(401);
        throw err;
    }
});

const createGroup = asyncHandler(async (req,res) => {
    let { name, members } = req.body;
    if(!name || !members){
        res.status(400);
        throw new Error('empty request fields');
    }
    name = JSON.parse(name);
    members = JSON.parse(members);

    if(members.length < 2){
        res.status(400);
        throw new Error('not enough members to create a group');
    }
    members.push(req.user[0]);
    try{
        const newGroupData = {
            name,
            members,
            isPersonalChat : false,
            groupAdmin : req.user[0]
        };
        const createGroupChat = await Chat.create(newGroupData);
        const createdGroup = await Chat.findById(createGroupChat._id)
        .populate('members')
        .populate('groupAdmin');
        res.status(200).json(createdGroup);
    }catch(err){
        throw new Error(err);
    }
});

const addUsers = asyncHandler(async (req,res) => {
    const { id, users, add } = req.body;
    const adminID = req.user[0]._id;

    try{
        if(!id){
            res.status(404);
            throw new Error('invalid specifier value');
        }
        if(!users.length) {
            res.status(401);
            throw new Error('invalid payload type: recieved null');
        }

        const newChatOptions = add ? {
            $push : { members : { $each : JSON.parse(users) } }
        } : {
            $pullAll : { members : JSON.parse(users) }
        };
        const updatedChat = await Chat.findOneAndUpdate({ _id : id, groupAdmin : adminID },newChatOptions,{new : true})
        .populate('members')
        .populate('groupAdmin');
        if(!updatedChat){
            res.status(404);
            throw new Error('chat not found');
        }
        res.json(updatedChat);

    }catch(err){
        throw err;
    }
})

const editGroupPic = asyncHandler(async (req,res) => {

});

const editGroupName = asyncHandler(async (req,res) => {
    const { id, name } = req.body;
    const adminID = req.user[0]._id;

    try{
        if(!id){
            res.status(404);
            throw new Error('invalid specifier value');
        }
        const newChatOptions = {
            name
        };
        const updatedChat = await Chat.findByIdAndUpdate(id,newChatOptions)
        .populate('members')
        .populate('groupAdmin');
        if(!updatedChat){
            res.status(404);
            throw new Error('chat not found');
        }
        res.json(updatedChat);

    }catch(err){
        throw err;
    }
});

module.exports = { getChat, fetchChats, createGroup, addUsers, editGroupPic, editGroupName };