import mongoose from "mongoose";
import {MONGO_URI}  from "./env.js";

const MongoDb = async () => {
    try {
        const dbData = await mongoose.connect(MONGO_URI);
        console.log("MongoDb Connected successfully");
        console.log("Mongodb base", dbData.connection.host);
        
    } catch (error) {
        console.log("Mongo Db Connection Something Wrong.",error)
    }
};

export default MongoDb;
