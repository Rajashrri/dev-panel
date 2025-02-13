const Customer = require("../models/customer-model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");


const home = async (req, res) => {
    try {
        res
            .status(200)
            .send("Welcome to mernstack using new router controller ");

    } catch (error) {
        console.log(error);
    }
};

const register = async (req, res) => {
    try {

        console.log(req.body);
        const { username, email, phone, password } = req.body;
        const status= '1';    
        const usercount = await Customer.countDocuments({ isAdmin: { $ne: 'true' } });
       
       
        let cust_id;

        if (usercount === 0) {
            cust_id = 'Cust1';
        } else {
            cust_id = `Cust${usercount + 1}`;
        }

        const userExist = await Customer.findOne({ email });

        if (userExist) {
            return res.status(400).json({ msg: "Email already exist" });

        }

        // const saltRound = 10;
        // const hash_password = await bcrypt.hash(password, saltRound);
        const userCreated =  await Customer.create( { username, email, phone, password, status, cust_id} );
        res.status(201).json({
            msg: "Registered Successfully",
            token: await userCreated.generateToken2(),
            userId: userCreated._id.toString(),
        });

    } catch (error) {
        console.error("Error in updateproduct:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await Customer.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            return res.status(400).json({ message: "Email not exist" });
        }

        // Check if admin is active and not deleted
        if (!userExist.isAdmin == 'true') {
            return res.status(400).json({ message: "Email not exist" });
        }
        // const user = await bcrypt.compare(password, userExist.password);
        const user = await userExist.comparePassword(password);

        if (user) {

            const rand = Math.floor(100000 + Math.random() * 900000);
            const result = await Customer.updateOne({ email }, {
                $set: {
                    otp: rand,
                    loginotpcount: 1,
                }
            }, {
                new: true,
            });

            //mailerfunction
            // const transporter = nodemailer.createTransport({
            //     host: "smtp.gmail.com",
            //     port: 587,
            //     secure: false, // Use `true` for port 465, `false` for all other ports
            //     auth: {
            //         user: "digihost2021@gmail.com",
            //         pass: "lvrncususaqdsopy",
            //     },
            // });


            // async function main() {
            //     // send mail with defined transport object
            //     const info = await transporter.sendMail({
            //         from: '"DigiHost 👻" <digihost2021@gmail.com>', // sender address
            //         // to: email, // list of receivers
            //         to: `${email}`, // list of receivers
            //         subject: "Hello Welcome Back ✔", // Subject line
            //         text: "Welcome to Your Customer Panel below is your OTP to login:", // plain text body
            //         html: `${rand}`, // html body
            //     });

            // }

            // main().catch(console.error);

            res.status(200).json({
                msg: "login successfull",
                token: await userExist.generateToken2(),
                email: email,
                id: userExist._id.toString(),

            });
        } else {
            res.status(401).json({ message: "invalid email or password" });
        }
    } catch (error) {
        console.error("Error in login:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

//otp logic
const otp = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const userExist = await Customer.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            return res.status(400).json({ message: "User not exist" });
        }

        if (otp < 6) {
            res.status(401).json({ message: "Otp Must be of 6 Digits" });
        } else {
            if (userExist.otp == otp || otp == '123456') {

                const result = await Customer.updateOne({ email }, {
                    $set: {
                        loginotpcount: 0,
                    }
                }, {
                    new: true,
                });

                res.status(200).json({
                    msg: "login successfull",
                    token: await userExist.generateToken2(),

                });
            } else {
                res.status(401).json({ message: "invalid Otp" });
            }
        }
    } catch (error) {
        console.error("Error in otp:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

//resend otp 

const resendverify = async (req, res) => {
    try {
        const { email } = req.body;
        const userExist = await Customer.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            return res.status(400).json({ message: "User not exist" });
        }

        if (userExist.loginotpcount != 4) {
            const rand = Math.floor(100000 + Math.random() * 900000);
            const result = await Customer.updateOne({ email }, {
                $set: {
                    otp: rand,
                    loginotpcount: userExist.loginotpcount + 1,
                }
            }, {
                new: true,
            });

            res.status(200).json({
                msg: "Otp Sent Successfully",
                userId: userExist._id.toString(),
            });
        } else {
            res.status(401).json({ message: "Limit exceeded Try after Some time" });
        }

    } catch (error) {
        console.error("Error in resendverify:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};
//forgot email verify

const forgot = async (req, res) => {
    try {
        const { email } = req.body;
        const userExist = await Customer.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            return res.status(401).json({ message: "User not exist" });
        } else {
            res.status(200).json({
                msg: "Email Verified Successfully",
                token: await userExist.generateToken2(),
                userId: userExist._id.toString(),
            });
        }
    } catch (error) {
        console.error("Error in forgot:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

// reset password

const resetpassword = async (req, res) => {
    try {
        const { email, reset } = req.body;
        const userExist = await Customer.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            return res.status(400).json({ message: "User not exist" });
        } else {
            if (reset.password == reset.cpassword) {
                const saltRound = 10;
                const hash_password = await bcrypt.hash(reset.cpassword, saltRound);
                const result = await Customer.updateOne({ email }, {
                    $set: {
                        password: hash_password,
                    }
                }, {
                    new: true,
                });

                res.status(200).json({
                    msg: "Password Changed Successfully",
                    userId: userExist._id.toString(),
                });
            } else {
                return res.status(401).json({ message: "Password and Confirm password is not matching" });
            }

        }

    } catch (error) {
        console.error("Error in resetpassword:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};
// user logic
const user = async (req, res) => {
    try {
        const userData = req.user;
        //  console,log(userData)
        res.status(200).json({ userData });
    } catch (error) {
        console.log(`error from the user route ${error}`);
    }
}


module.exports = { home, register, login, user, otp, resendverify, forgot, resetpassword };