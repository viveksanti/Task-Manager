const jwt = require('jsonwebtoken');
const keys = require('./../../../config/config');

let generateToken = (data) => {
    let token = jwt.sign({ userId: data._id, email: data.email, mobile: data.mobile, role: data.role }, keys.jwt.secret, {
        expiresIn: 365 * 60 * 60 * 24 //'365d'  // expires in 365 days  //"1h"
    });
    return token
}

const decodeJwtToken = (jwtToken) => {
    let secretCode = keys.jwt.secret;

    return new Promise((resolve, reject) => {
        jwt.verify(jwtToken, secretCode, (error, decodedData) => {
            if (!error) resolve(decodedData);
            else reject({ status: 'unauthorised', message: 'jwt expired' });
        });
    });
};

let hasAdminRole = (req, res, next) => {
    const token = req.headers['x-access-code'];
    if (!token)
        return res.status(401).json({ success: false, message: "You are not authorised." });

    decodeJwtToken(token)
        .then(decoded => {
           //console.log("role", decoded)
            req.decoded = decoded;
            req.userID = decoded.userID;
            let isAdmin = decoded.role;
            if (isAdmin === "admin") {
                next();
            } else
                res.status(401).json({ success: false, message: "You don't have access." });
        })
        .catch((error) => {
            //console.log("error",error)
            res.status(401).json({ success: false, message: "Your Login Token Expired. Please Login." });
        });

};

let isUser = (req, res, next) => {
    const token = req.headers['x-access-code'];
    if (!token)
        return res.status(401).json({ success: false, message: "You are not authorised." });

    decodeJwtToken(token)
        .then(decoded => {
           //console.log("role", decoded)
            req.decoded = decoded;
            req.userID = decoded.userID;
            let isUser = decoded.role;
            if (isUser === "user") {
                next();
            } else
                res.status(401).json({ success: false, message: "You don't have access." });
        })
        .catch((error) => {
           // console.log("error",error)
            res.status(401).json({ success: false, message: "Your Login Token Expired. Please Login." });
        });

};

let authenticateJWT = (req, res, next) => {
    let authHeader;
    let token;
    authHeader = req.headers.authorization;
    //console.log('authHeader', authHeader);
    if (authHeader == "" || typeof authHeader === 'undefined') {
        authHeader = req.headers['x-access-code'];
        //console.log('authHeader', authHeader);
        token = authHeader;
    } else {
        token = authHeader.split(' ')[1];
    }
    if (authHeader) {
        jwt.verify(token, keys.jwt.secret, (err, user) => {
            if (err) {
                //console.log('err', err)
                    // return res.status(403).send({
                    //     status : "false",
                    //     err : err
                    // });
                res.status(401).send({
                    status: false,
                    message: "Un-Authorized / token expired"
                });
            } else if (user) {
                req.user = user;
                next();
            }
            // console.log("cc", user)

        });
    } else {
        res.status(401).send({
            status: false,
            message: "Un-Authorized"
        });
    }
};

let decodeJWTForUser = (token) => {

    return jwt.verify(token, keys.jwt.secret)
}







module.exports = {
    generateToken,
    hasAdminRole,
    authenticateJWT,
    decodeJWTForUser,
    isUser
}