const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const userRoutes = require('./Routes/users.routes');
const chatRoutes = require('./Routes/chat.routes');
const connectMongo = require('./Config/db.connect');
const { notFound, handleError } = require('./Middlewares/errorhandlers.middleware');
// const firebaseApp = require('./Config/firebase.connect');

dotenv.config();
const port = process.env.PORT ;
connectMongo();
// firebaseApp();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res) => {
    res.send('<h1>server is running</h1>');
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use(notFound);
app.use(handleError);


/*---------------------------------------------------------------------------------------------------------------------*/

const server = http.createServer(app);
const uIDToSocketID = {}, phoneNumbersToUID = {};

const io = socketIO(server);
io.on('connection',(socket) => {
    console.log('new connection established with '+socket.id+` at ${new Date()}`);
    socket.on('joined',({user}) => {
        if(!user){
            socket.disconnect(true);
            return null;
        }
        const { phoneNumber, uid } = user;
        phoneNumbersToUID[phoneNumber] = uid;
        uIDToSocketID[uid] = socket.id;
    });

    socket.on('send-private', (payload) => {
        const { from, to, message, timeStamp } = payload;
        if(reciever){
            socket.to(reciever).emit('recieve-msg',data.msg);
        }
    });
    socket.on('disconnect',(reason) => {
        const lastSeen = new Date();
        console.log(`${socket.id} has been disconnected at ${lastSeen} due to ${reason}`);
    })
});


server.listen(port,() => {
    console.log(`server running on port ${port}`);
});