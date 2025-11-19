const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    messages: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema);