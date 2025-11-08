const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
// get a dummy yet valid MongoDB URI
const dbURI = 'mongodb://localhost:27017/pet-profile-service';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(dbURI);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
