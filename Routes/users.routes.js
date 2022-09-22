const express = require('express');
const { authUser, loadUsers, editUserDP } = require('../Controllers/user.controller');
const { authMiddleware, fireauthMiddleware } = require('../Middlewares/auth.middleware');
const router = express.Router();

router.route('/')
.post(fireauthMiddleware, authUser)
.get(authMiddleware, loadUsers);

router.route('/setDP')
.put(fireauthMiddleware, editUserDP);

module.exports = router;