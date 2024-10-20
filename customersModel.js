const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    phno: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid 10 digit mobile number']
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
