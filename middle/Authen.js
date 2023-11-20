const { log } = require('debug/src/browser');
const { request } = require('express');
const jwt = require('jsonwebtoken');
const authenweb = (req, res, next) => {
    const { session } = req;
    const url = req.originalUrl.toLowerCase();
    if (!session) {
        if (url.includes('login')) {
            next();
        } else {
            res.redirect('/login');
        }
    } else {
        const { token } = session;
        if (!token) {
            if (url.includes('login')) {
                next();
            } else {
                res.redirect('/login');
            }
        } else {
            jwt.verify(token, 'secret', function (error, decoded) {
                if (error) {
                    if (url.includes('login')) {
                        next();
                    } else {
                        return res.redirect('/login');
                    }
                } else {
                    if (url.includes('login')) {
                        return res.redirect('/');
                    } else {
                        //kiem tra role
                        const {role}=decoded;
                        console.log('decoded: ',decoded);
                        console.log("role ne: ",decoded.role);
                        if(role==100){
                            
                           next();
                        }

                    }
                }
            })
        }
    }
}
const authenApp = (req, res, next) => {
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] == 'Bearer')
        token = req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, 'secret', function (error, decoded) {
            if (error) {
                return res.status(401).json({ status: false })
            } else {
                return next();
            }
        })
    } else {
        return res.status(401).json({ status: false })
    }
}
module.exports ={authenweb,authenApp}