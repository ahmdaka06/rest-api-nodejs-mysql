const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

// const getToken = (req) => {
//     return req.cookies.synteticJWT
// }

const verifyToken = (req, res, next) => {
    let header = req.headers['authorization'];
    if (header) {
        let token = header.split(' ');
        let bearerToken = token[1];

        if (token[0] !== 'Bearer') {
            return res.status(401).json({
                status: false,
                error: "Api Key Invalid!"
            })
        }
        User.findByToken(bearerToken).then(([result]) => {
            req.user = result;
            next();
        }).catch(err => {
            return res.status(401).json({
                status: false,
                error: "Api Key Invalid!"
            })
        })
    } else {
        return res.status(403).json({
            status: false,
            error: 'No credentials sent!'
        });
    }
}

const hasLogin = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        next()
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (!err) {
                return res.status(201).json({
                    status: true,
                    msg: 'You has login!'
                })
            } else {
                next()
            }
        })
    }
}

const requireAuth = (req, res, next) => {
    const token = req.headers['authorization']

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    msg: 'Unauthorized!'
                })
            } else {
                next()
            }
        })
    } else {
        return res.status(401).json({
            status: false,
            msg: 'Unauthorized!'
        })
    }
}

const checkUser = (req, res, next) => {
    const token = req.headers['authorization']

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = []
                next()
            } else {
                let user = await User.findById(decodedToken.secret.id)
                if (!user) {
                    return res.status(401).json({
                        status: false,
                        msg: 'Unauthorized!'
                    })
                } else {
                    req.user = user
                    next()
                }
            }
        })
    } else {
        req.user = []
        next()
    }
}

const isAdmin = (req, res, next) => {
    const token = req.headers['authorization']

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = []
                next()
            } else {
                let [user] = await User.findById(decodedToken.secret.id)
                if (user.role === 'admin') {
                    next()
                } else {
                    return res.status(403).json({
                        status: false,
                        msg: 'Not Access!'
                    })
                }
            }
        })
    } else {
        res.locals.user = []
        next()
    }
}

module.exports = {
    verifyToken,
    hasLogin,
    requireAuth,
    checkUser,
    isAdmin
}