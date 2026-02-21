
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGODB_URL){
    throw new Error(
        "Please provide MONGODB_URL in the .env file"
    )
}

const DbCon = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
            serverSelectionTimeoutMS: 5000, // retry for 5 seconds
        });
        console.log('MongoDB is connected');
    } catch (error) {
        console.error('MongoDB initial connection error:', error);
        process.exit(1);
    }
};

// Event listeners
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected! Reconnecting...');
    DbCon(); // Reconnect automatically
});

export default DbCon;