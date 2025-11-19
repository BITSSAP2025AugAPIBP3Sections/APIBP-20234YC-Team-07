const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const addSampleServices = async () => {
    const services = [
        {
            name: 'Pet Clinic',
            type: 'Veterinary',
            location: '123 Pet Street, Pet City',
            contact: '123-456-7890'
        },
        {
            name: 'Pet Grooming',
            type: 'Grooming',
            location: '456 Grooming Lane, Pet City',
            contact: '987-654-3210'
        }
    ];

    try {
        await Service.insertMany(services);
        console.log('Sample services added successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding sample services:', error);
        mongoose.connection.close();
    }
};

addSampleServices();