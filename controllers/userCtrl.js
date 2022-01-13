const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
    register: async (req, res) =>{
        try {
            const {name, email, password} = req.body;

            const user = await Users.findOne({email});
            if(user) return res.status(400).json({msg: "The email already exists."});

            if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."});

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name, email, password: passwordHash
            });

            // Save mongodb
            await newUser.save();

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: newUser._id});
            const refreshtoken = createRefreshToken({id: newUser._id});

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            res.json({accesstoken});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    refreshToken: (req, res) =>{
      
      const rf_token = req.cookies.refreshtoken;  
      
      res.json({rf_token});
    }
 };


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'});
};
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
};

module.exports = userCtrl;