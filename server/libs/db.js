import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


if(!process.env.MONGODB_URL){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
    
}

const DbCon = async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL)
        console.log('mongodb is connected')
    }catch(error){
        console.log('mongodb conection error',error)
        process.exit(1)
    }
    
    
}

export default DbCon;