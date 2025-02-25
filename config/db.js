import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to mongoDb ${conn.connection.host}`.bgGreen.white);
    }catch(err){
        console.log(`MongoDb Error ${err}`.bgRed.white);
    }
}

export default connectDB;