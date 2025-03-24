const User = require("../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

const register = async (req, res) => {
    const { name, password } = req.body;
    try {
        if (!name || !password)
            throw Error("All fields must be filled!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            password: hashedPassword,
        });

        const token = generateToken(user._id);
        res.status(200).json({ message: "User added successfully",user,token,id:user._id });
    } catch (error) {
        res.status(500).json({ message: "Failed to add the user", error: error.message });
    }
};

const login = async (req, res) => {
    const { name, password } = req.body;
    try {
        if (!name || !password) throw Error("All fields must be filled");
        const exist = await User.findOne({ name });
        if (!exist){
            return res.status(400).json({
                success: false,
                message: `Not registered yet!`,
            });
        }
        const comparing = await bcrypt.compare(password, exist.password);
        if(!comparing){
            return res.status(400).json({
                success: false,
                message: `Wrong password!`,
            });
        }
        const token = generateToken(exist._id);
        res.status(200).json({ message: "login successfully", token, id:exist._id });
    } catch (error) {
        res.status(500).json({ message: `Failed to login`, error: error.message })
    }
}

// const findOne = async (req, res) => {
//     const {Id} = req.params;
//     try {
//         if (!Id) throw Error("No id detected to continue");
//         const user = await User.findById({ _id:Id });
//         if (!user) throw Error("An error occured");
//         res.status(200).json({ message: "User retrieved successfully", user });
//     } catch (error) {
//         res.status(500).json({ message: "failed to get the user", error: error.message });
//     }
// }

const getAll = async (_, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(500).json({ message: 'An error occured during selecting all users', error: error.message })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if(!id)throw Error("No id passed as parameter");
        const resultat = await User.findByIdAndDelete({ _id:id });
        if (!resultat) throw Error("An error occured");
        const users =await User.find({});
        res.status(200).json({ message: "One of users deleted successfully", users});
    } catch (error) {
        res.status(500).json({ message: "An error occured during deleting a user", error: error.message })
    }
}

module.exports = {register, login, getAll, deleteUser};