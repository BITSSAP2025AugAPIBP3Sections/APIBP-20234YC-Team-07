// User.js

const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    reminderFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'weekly'
    },
    notificationType: {
        type: String,
        enum: ['email', 'sms', 'push'],
        default: 'email'
    },
    preferredLanguage: {
        type: String,
        default: 'en'
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    vaccinationReminders: {
        type: Boolean,
        default: true
    },
    appointmentReminders: {
        type: Boolean,
        default: true
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    preferences: {
        type: preferencesSchema,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'user'
    }
});

// Pre-save hook to update the updatedAt field on save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
