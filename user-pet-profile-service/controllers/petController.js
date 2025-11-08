const Pet = require('../models/Pet');

// Add a new pet
exports.addPet = async (req, res) => {
    const { name, species, age, breed } = req.body;

    try {
        // Create a new pet
        const pet = new Pet({
            user: req.user.userId, // User ID from authMiddleware
            name,
            species,
            age,
            breed
        });

        // Save pet to the database
        await pet.save();
        res.status(201).json({ message: 'Pet added successfully', pet });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: errorMessages });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all pets for the authenticated user
exports.getAllPetsForUser = async (req, res) => {
    try {
        const pets = await Pet.find({ user: req.user.userId });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific pet by ID
exports.getPetById = async (req, res) => {
    const { petId } = req.params;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update pet details
exports.updatePet = async (req, res) => {
    const { petId } = req.params;
    const { name, species, age, breed } = req.body;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Update pet details
        if (name) pet.name = name;
        if (species) pet.species = species;
        if (age) pet.age = age;
        if (breed) pet.breed = breed;

        await pet.save();
        res.json({ message: 'Pet updated successfully', pet });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: errorMessages });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a pet
exports.deletePet = async (req, res) => {
    const { petId } = req.params;

    try {
        const pet = await Pet.findOneAndDelete({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all pets (admin only)
exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a pet (admin only)
exports.deletePet = async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
