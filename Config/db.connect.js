const mongoose = require('mongoose');

const connectMongo = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    });
    console.log(`MongoDB instance running at ${connection.connection.host}`);
    }catch(err){
        console.log(err.message);
        process.exit();
    }
};

module.exports = connectMongo;
