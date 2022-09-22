const express = require('express');
const { getChat, fetchChats, createGroup, editGroupPic, editGroupName, addUsers } = require('../Controllers/chats.controller');
const { authMiddleware } = require('../Middlewares/auth.middleware');

const router = express.Router();

router.route('/')
.post(authMiddleware,getChat)
.get(authMiddleware,fetchChats);

router.route('/group')
.post(authMiddleware,createGroup)
.put(authMiddleware,addUsers);

router.route('/group/update_photo')
.put(authMiddleware, editGroupPic);

router.route('/group/rename')
.put(authMiddleware,editGroupName);

module.exports = router;