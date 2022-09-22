const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const User = require("../Models/Users.models");
const fireAuth = require('../Config/firebase.connect');


const authMiddleware = asyncHandler(async (req,res,next) => {
    let token;
    const authHeader = req.headers.authorization;
    try{
        if(authHeader && authHeader.startsWith('Bearer')){
            token = authHeader.split(' ')[1];
            const token_decoded = jwt.decode(token, process.env.SECRET);
            req.user = await User.find({ uid : { $regex : token_decoded.id } });
            next();
        }else throw new Error('invalid token, authorization failed.');
    }catch(err){
        res.status(401);
        throw err;
    }
});

const fireauthMiddleware = asyncHandler(async (req,res,next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader,'hittt');
    // console.log(auth);
    try {
        if(authHeader && authHeader.startsWith('Bearer')){
            const token = authHeader.split(' ')[1];
            // console.log(token,'hitt');
            if(!token) throw new Error('invalid token, authorization failed.');
            
            const token_decoded = await fireAuth.verifyIdToken(token);
            const uid = token_decoded.uid;
            if(req.body.uid === uid){
                next();
            }
            else throw new Error('invalid token, authorization failed.');
        }else throw new Error('invalid token, authorization failed.')
    }
    catch(err){
        res.status(401);
        throw err;
    }
});

module.exports = { authMiddleware, fireauthMiddleware };