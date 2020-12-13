const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { json } = require("body-parser");
const { unsubscribe } = require("../routes/auth");

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (user)
            return res.status(400).json({
                message: "user already registered",
            });

        const { userName, email, password } = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const _user = new User({
            userName,
            email,
            hash_password,
            role: "user",
        });

        _user.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went wrong",
                });
            }

            if (data) {
                return res.status(201).json({
                    message: "user created Successfully..!",
                });
            }
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (error) return res.status(400).json({ error });
        if (user) {
            console.log(unsubscribe)
            const isPassword = await user.authenticate(req.body.password);
            if (isPassword && user.role === "user") {
                const token = jwt.sign(
                    { _id: user._id, userName: user.userName, email: user.email, avatar: user.avatar },
                    process.env.JWT_SECRET,
                    { expiresIn: "30s" }
                );
                const { _id, userName, email, role, avatar } = user;
                res.cookie("token", token, { expiresIn: "30s" });
                res.status(200).json({
                    token,
                    user: { _id, userName, email, role, avatar },
                });
            } else {
                return res.status(400).json({
                    message: "Invalid Password",
                });
            }
        } else {
            return res.status(400).json({ message: "Something went wrong" });
        }
    });
};
exports.checkJWT = async (req, res) => {
    console.log("sss")
    const token = req.headers['authorization']
    console.log(token)
    const jsonWebToken = token.split(' ')[1]
    jwt.verify(jsonWebToken, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(400).json(
                { error: "errror" }
            )
        }
        else {
            console.log(user)
            console.log(user.email)
            return res.status(200).json( user)
            // User.findOne({ email: user.email }).exec((err, user1) => {
            //     if (err) {
            //         return res.status(404).json({ err: err })
            //     }
            //     if (user) {
            //         console.log('3')
            //         console.log(user1)
                    
            //     }
            // })

            // console.log(user);
            // return res.status(200).json({name: user.userName})
        }
    })
}
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "Signout successfully...!",
    });
};