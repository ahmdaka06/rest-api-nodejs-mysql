const jwt = require('jsonwebtoken')
const Hash = require('../config/bcrypt')
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const bcrypt = require('bcryptjs')
const authRequest = require('./request/authRequest')

const maxAge = 3 * 24 * 60 * 60; // Set JWT time setting

// Function generate JWT Token
const generateTokenJWT = (secret) => {
    return jwt.sign({
        secret
    }, process.env.JWT_SECRET, {
        algorithm: process.env.JWT_ALGORITHM,
        expiresIn: process.env.JWT_SECRET_LIFE,
        
    });
};
// const refreshTokenJWT = (secret) => {
//     return jwt.sign({
//         secret
//     }, process.env.JWT_REFRESH_SECRET, {
//         algorithm: process.env.JWT_ALGORITHM,
//         expiresIn: process.env.JWT_REFRESH_LIFE,
        
//     });
// };

module.exports = {
    
    login: async (req, res) => {
    
        let data_input = req.body

        // VALIDATION 
        let validation = await authRequest.login(req)
        if (validation) {
            return res.status(400).json({
                status: false,
                msg: validation
            })  
        }

        let user = await User.findOne({
            where: {
                username: data_input.username
            }
        })

        if (user == null) { 
            return res.status(400).json({
                status: false,
                msg: 'Pengguna tidak di temukan'
            }) 
        } 
        let auth = await bcrypt.compare(data_input.password, user.password)
        if (!auth) { 
            return res.status(400).json({
                status: false,
                msg: 'Username atau password tidak sesuai'
            }) 
        }

        // Generate Refresh Token
        let tokenJWTRefresh = await RefreshToken.createToken(user)

        
        // Generate JWT Token
        let tokenJWT = generateTokenJWT({
            id: user.id,
            username: user.username,
            refreshToken: tokenJWTRefresh
        })
        

        return res.status(200).json({
            status: true,
            msg: 'Login berhasil',
            data: {
                accessToken: tokenJWT,
                refreshToken: tokenJWTRefresh
            }
        }) 
    },
    register: async (req, res) => {
        let data_input = req.body
        
        
        // VALIDATION
        let validation = await authRequest.register(req)
        if (validation) {
            return res.status(400).json({
                status: false,
                msg: validation
            })  
        }

        let username = await User.findOne({
            where: {
                username: data_input.username
            }
        })

        if (username !== null) {
            return res.status(200).json({
                status: false,
                msg: 'Username telah digunakan'
            }) 
        }
        
        let email = await User.findOne({
            where: {
                email: data_input.email
            }
        })

        if (email !== null) {
            return res.status(200).json({
                status: false,
                msg: 'Email telah digunakan'
            }) 
        }

        let hashPassword = await Hash.make(data_input.password)
        data_input.password = hashPassword
        data_input.username = data_input.username.toLowerCase()
        try {
            let insert = await User.create(data_input)
            return res.status(200).json({
                status: true,
                data: insert
            })   
        } catch (err) {
            console.log(err.message)
            return res.status(403).json({
                status: false,
                msg: 'Terjadi kesalahan'
            }) 
        }
    }
}