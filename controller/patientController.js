const jwt = require('jsonwebtoken');
const Patient = require("../model/patient");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
}

const signup = async (req, res) => {
    const { fullName, dateOfBirth, gender, email, phone, address, emergencyContactName, emergencyContactRelationship, emergencyContactPhone, username, password } = req.body;

    try {
        const patient = await Patient.signup(fullName, dateOfBirth, gender, email, phone, address, emergencyContactName, emergencyContactRelationship, emergencyContactPhone, username, password);

        res.status(200).json({ msg: "Signed up successfully", patient: patient });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const patient = await Patient.login(email, password);

        const patientId = patient._id;
        const token = createToken(patientId);

        res.status(200).json({ msg: "Login successful", email, patientId, token });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

module.exports = {
    signup,
    login,
}