const Consultation = require('../models/Consultation');
const mongoose = require('mongoose');

exports.scheduleConsultation = async (req, res) => {
    const { userId, vetId, date } = req.body;

    // Validate ObjectId fields
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(vetId)) {
        return res.status(400).json({ message: 'Invalid userId or vetId' });
    }

    try {
        const newConsultation = new Consultation({
            userId,
            vetId,
            date,
            status: 'scheduled'
        });
        await newConsultation.save();
        res.status(201).json(newConsultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConsultation = async (req, res) => {
    const consultationId = req.params.consultationId;

    try {
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateConsultation = async (req, res) => {
    const consultationId = req.params.consultationId;

    try {
        const updatedConsultation = await Consultation.findByIdAndUpdate(
            consultationId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedConsultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json(updatedConsultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelConsultation = async (req, res) => {
    const consultationId = req.params.consultationId;

    try {
        const cancelledConsultation = await Consultation.findByIdAndUpdate(
            consultationId,
            { status: 'cancelled' },
            { new: true }
        );
        if (!cancelledConsultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json(cancelledConsultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.startConsultation = async (req, res) => {
    const consultationId = req.params.consultationId;

    try {
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        // Logic to start a video consultation (e.g., generate a video call link)
        consultation.status = 'in-progress';
        await consultation.save();
        res.status(200).json({ message: 'Video consultation started', consultation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserConsultations = async (req, res) => {
    const userId = req.params.userId;

    try {
        const consultations = await Consultation.find({ userId });
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    const consultationId = req.params.consultationId;
    const { message } = req.body;

    try {
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        consultation.messages.push(message);
        await consultation.save();
        res.status(200).json({ message: 'Message sent', consultation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    const consultationId = req.params.consultationId;

    try {
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json(consultation.messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.scheduleFollowUp = async (req, res) => {
    const consultationId = req.params.consultationId;
    const { date } = req.body;

    try {
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        const followUpConsultation = new Consultation({
            userId: consultation.userId,
            vetId: consultation.vetId,
            date,
            status: 'scheduled'
        });
        await followUpConsultation.save();
        res.status(201).json(followUpConsultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};