const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');

const patientSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: { 
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    phone: { 
        type: String
    },
    address: { 
        type: String
    },
    emergencyContactName: { 
        type: String,
        required: true
    },
    emergencyContactRelationship: { 
        type: String,
        required: true
    },
    emergencyContactPhone: { 
        type: String,
        required: true
    },
    username: { 
        type: String, 
        required: true, unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

patientSchema.statics.signup = async function (fullName, dateOfBirth, gender, email, phone, address, emergencyContactName, emergencyContactRelationship, emergencyContactPhone, username, password) {
    if (!fullName || !dateOfBirth || !gender || !email || !phone || !address || !emergencyContactName || !emergencyContactRelationship || !emergencyContactPhone || !username || !password) {
        throw Error('Input fields cannot be empty');
    }

    if (!validator.isEmail(email)) {
        throw Error('Please, enter a valid email');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough, it should contain uppercase and lowercase letters, numbers and special characters');
    }

    const emailExists = await this.findOne({ email });

    if (emailExists) {
        throw Error('Email exists already');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const patient = this.create({ fullName, dateOfBirth, gender, email, phone, address, emergencyContactName, emergencyContactRelationship, emergencyContactPhone, username, password: hash });

    return patient;
}

patientSchema.statics.login = async function (email, password) {
    const patient = await this.findOne({ email });

    if (!patient) {
        throw Error('Email does not exist');
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);

    if (!passwordMatch) {
        throw Error('Incorrect password');
    }

    return patient;
}

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;