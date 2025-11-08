const mongoose = require('mongoose');

// Define the pet schema
const petSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a name for the pet'],
            trim: true,
        },
        species: {
            type: String,
            enum: ['dog', 'cat', 'bird', 'reptile', 'other'], // Add other species as needed
            required: [true, 'Please specify the species of the pet'],
        },
        age: {
            type: Number,
            required: [true, 'Please specify the age of the pet'],
            min: [0, 'Age cannot be negative'],
        },
        breed: {
            type: String,
            trim: true,
            required: [true, 'Please specify the breed of the pet'],
        },
        medicalHistory: [
            {
                description: { type: String, trim: true },
                vet: { type: String, trim: true },
                vaccine: { type: String, trim: true },
                dateAdministered: { type: Date },
                nextDueDate: { type: Date },
            },
        ],
        vaccinationRecords: [
            {
                vaccine: { type: String, trim: true },
                dateAdministered: { type: Date },
                veterinarian: { type: String, trim: true },
                nextDueDate: { type: Date },
            },
        ],
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Compile the schema into a model
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
