const Pet = require('../models/Pet');

// Add a new health record for a specific pet
exports.addHealthRecord = async (req, res) => {
    const { petId } = req.params;
    const { description, vet, vaccine, dateAdministered, nextDueDate } = req.body;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Create a new health record object
        const healthRecord = {
            description,
            vet,
            vaccine,
            dateAdministered,
            nextDueDate,
        };

        // Add the health record to the pet's medical history
        pet.medicalHistory.push(healthRecord);
        await pet.save();

        res.status(201).json({ message: 'Health record added successfully', healthRecord });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all health records for a specific pet
exports.getAllHealthRecordsForPet = async (req, res) => {
    const { petId } = req.params;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.json(pet.medicalHistory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific health record by record ID
exports.getHealthRecordById = async (req, res) => {
    const { petId, recordId } = req.params;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const healthRecord = pet.medicalHistory.id(recordId);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        res.json(healthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a specific health record
exports.updateHealthRecord = async (req, res) => {
    const { petId, recordId } = req.params;
    const { description, vet, vaccine, dateAdministered, nextDueDate } = req.body;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const healthRecord = pet.medicalHistory.id(recordId);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Update fields if provided in the request body
        if (description) healthRecord.description = description;
        if (vet) healthRecord.vet = vet;
        if (vaccine) healthRecord.vaccine = vaccine;
        if (dateAdministered) healthRecord.dateAdministered = dateAdministered;
        if (nextDueDate) healthRecord.nextDueDate = nextDueDate;

        await pet.save();
        res.json({ message: 'Health record updated successfully', healthRecord });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a specific health record
exports.deleteHealthRecord = async (req, res) => {
    const { petId, recordId } = req.params;

    try {
        const pet = await Pet.findOne({ _id: petId, user: req.user.userId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Find the index of the health record in the medicalHistory array
        const recordIndex = pet.medicalHistory.findIndex(
            (record) => record._id.toString() === recordId
        );

        if (recordIndex === -1) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Remove the health record from the medicalHistory array
        pet.medicalHistory.splice(recordIndex, 1);
        await pet.save();

        res.json({ message: 'Health record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteHealthRecordForAdmin = async (req, res) => {
    const { petId, recordId } = req.params;

    try {
        const pet = await Pet.findOne({ _id: petId });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Find the index of the health record in the medicalHistory array
        const recordIndex = pet.medicalHistory.findIndex(
            (record) => record._id.toString() === recordId
        );

        if (recordIndex === -1) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Remove the health record from the medicalHistory array
        pet.medicalHistory.splice(recordIndex, 1);
        await pet.save();

        res.json({ message: 'Health record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all health records (admin only)
exports.getAllHealthRecords = async (req, res) => {
    try {
        // Fetch all pets with their health records
        const pets = await Pet.find({}, 'name medicalHistory')
            .populate('user', 'name email') // Populate the owner's information
            .exec();

        const allHealthRecords = pets.map((pet) => ({
            petId: pet._id,
            petName: pet.name,
            owner: pet.user,
            medicalHistory: pet.medicalHistory,
        }));

        res.json({ message: 'Health records retrieved successfully', records: allHealthRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
