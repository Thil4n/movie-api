const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/user");
const Image = require("../helpers/image");
const String = require("../helpers/string");
const Sms = require("../helpers/sms");
const { url } = require("../config/server");

/**********************************************************/
/*        Reg. Stage 1 -  Send registration OTP           */
/**********************************************************/

const registerStageOne = async (req, res) => {
    const registerUserSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
    });

    const { error, value } = registerUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    const email = value.email;

    try {
        const result = await User.findOne({
            email: email,
            status: 1,
        });

        if (result)
            return res
                .status(400)
                .json({ message: "phone number already exists" });

        const otp = String.randomOtp();

        let txtBody = "Please use bellow OTP to reset your password. ";
        txtBody += otp;
        txtBody += " PizzaDen";

        Sms.send(email, txtBody);

        const data = {
            name: value.name,
            email: email,
            otp: otp,
        };

        const newUser = new User(data);

        newUser.save();

        return res.status(200).json({ message: "otp sent successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
        // database error
    }
};

/**********************************************************/
/*         Reg. Stage 2 -  Verify registration OTP        */
/**********************************************************/

const registerStageTwo = async (req, res) => {
    const registerUserSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),

        otp: Joi.number()
            .integer()
            .required()
            .empty()
            .min(100000)
            .max(999999)
            .messages({
                "number.base": "Please enter a valid OTP",
                "number.integer": "OTP must be an integer",
                "any.required": "OTP is required",
                "number.min": "OTP must be 6 digits long",
                "number.max": "OTP must be 6 digits long",
                "any.empty": "OTP must not be empty",
            }),
    });

    const { error, value } = registerUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const result = await User.findOne({
            email: value.email,
            otp: value.otp,
            status: 0,
        });

        if (!result)
            return res.status(404).json({ message: "OTP is not valid!" });
        // OTP or the phone number is not valid.

        return res
            .status(200)
            .json({ message: "OTP is verified successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
        // database error
    }
};

/**********************************************************/
/*             Reg. Stage 3 -  Do registration            */
/**********************************************************/

const registerStageThree = async (req, res) => {
    const registerUserSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
        otp: Joi.number()
            .integer()
            .required()
            .empty()
            .min(100000)
            .max(999999)
            .messages({
                "number.base": "Please enter a valid OTP",
                "number.integer": "OTP must be an integer",
                "any.required": "OTP is required",
                "number.min": "OTP must be 6 digits long",
                "number.max": "OTP must be 6 digits long",
                "any.empty": "OTP must not be empty",
            }),
        password: Joi.string()
            .required()
            .empty()
            .min(8)
            .max(30)
            // .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
            .messages({
                "string.base": "Please enter a valid password",
                "any.required": "Password is required",
                "string.empty": "Password must not be empty",
                "string.min": "Password must be at least 8 characters long",
                "string.max": "Password must be at most 30 characters long",
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
            }),
        passwordConf: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Passwords must match",
            }),
    });

    const { error, value } = registerUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const result = await User.findOne({
            email: value.email,
            otp: value.otp,
            status: 0,
        });

        if (!result)
            return res
                .status(404)
                .json({ message: "Invalid OTP or Phone number!" });

        const userId = result._id;

        let hashedPassword = null;

        try {
            hashedPassword = await Bcrypt.hash(value.password, 12);
        } catch (e) {
            return res.status(500).json({ message: "server error" });
            // hashing error
        }

        const updateData = {
            name: value.name,
            password: hashedPassword,
            otp: "",
            status: 1,
        };

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateData }
        );

        return res
            .status(200)
            .json({ message: "Registration completed successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
        // database error
    }
};
/**********************************************************/
/*                      Login User                        */
/**********************************************************/

const login = async (req, res) => {
    const loginUserSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            // .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
        password: Joi.string().required(),
    });

    const { error, value } = loginUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const result = await User.findOne({
            email: value.email,
            status: 1,
        });

        if (!result)
            return res.status(404).json({
                message: "A user doesn't exists with the given phone number",
            });

        const databaseHash = result.password;

        const compareResult = await Bcrypt.compare(
            value.password,
            databaseHash
        );

        if (compareResult) {
            const data = {
                id: result._id,
                name: result.name,
                email: result.email,
                role: "customer",
                avatar: url + "/public/img/" + result.avatar,
            };

            const token = Jwt.sign(data, "secret", {
                expiresIn: "1h",
            });
            res.status(200).json({ message: "logged in", token: token });
        } else {
            res.status(401).json({ message: "password is invalid" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
        // database error
    }
};

/**********************************************************/
/*               Reset. Stage 1 Send OTP                  */
/**********************************************************/

const resetStageOne = async (req, res) => {
    const dropUserSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
    });

    const { error, value } = dropUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    const email = value.email;

    try {
        const user = await User.findOne({ email: email });

        if (!user)
            return res
                .status(404)
                .json({ message: "Phone number is not valid!" });

        const otp = String.randomOtp();

        let txtBody = "Please use bellow OTP to reset your password. ";
        txtBody += otp;
        txtBody += " PizzaDen";

        const result = Sms.send(email, txtBody);

        const updateData = { otp };

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: updateData }
        );

        return res
            .status(200)
            .json({ message: "Otp sent to your phone number" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};
/**********************************************************/
/*              Reset. Stage 2 Verify OTP                 */
/**********************************************************/

const resetStageTwo = async (req, res) => {
    const verifyLinkSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
        otp: Joi.number()
            .integer()
            .required()
            .empty()
            .min(100000)
            .max(999999)
            .messages({
                "number.base": "Please enter a valid OTP",
                "number.integer": "OTP must be an integer",
                "any.required": "OTP is required",
                "number.min": "OTP must be 6 digits long",
                "number.max": "OTP must be 6 digits long",
                "any.empty": "OTP must not be empty",
            }),
    });

    const { error, value } = verifyLinkSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const user = await User.findOne({
            email: value.email,
            otp: value.otp,
            status: 1,
        });

        if (user) {
            return res
                .status(200)
                .json({ message: "OTP is verified successfully" });
        } else {
            return res.status(400).json({ message: "OTP is invalid" });
        }
    } catch (e) {
        return res.status(500).json({ message: "server error" });
    }
};
/**********************************************************/
/*                Reset. Stage 3 Do reset                 */
/**********************************************************/

const resetStageThree = async (req, res) => {
    const resetPasswordSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
        otp: Joi.number()
            .integer()
            .required()
            .empty()
            .min(100000)
            .max(999999)
            .messages({
                "number.base": "Please enter a valid OTP",
                "number.integer": "OTP must be an integer",
                "any.required": "OTP is required",
                "number.min": "OTP must be 6 digits long",
                "number.max": "OTP must be 6 digits long",
                "any.empty": "OTP must not be empty",
            }),
        password: Joi.string()
            .required()
            .empty()
            .min(8)
            .max(30)
            .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
            )
            .messages({
                "string.base": "Please enter a valid password",
                "any.required": "Password is required",
                "string.empty": "Password must not be empty",
                "string.min": "Password must be at least 8 characters long",
                "string.max": "Password must be at most 30 characters long",
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
            }),
        passwordConf: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Passwords must match",
            }),
    });

    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const user = await User.findOne({
            email: value.email,
            otp: value.otp,
            status: 1,
        });

        if (!user) return res.status(404).json({ message: "OTP is invalid!" });

        const userId = user._id;

        const hashedPassword = await Bcrypt.hash(value.password, 12);

        if (!hashedPassword) {
            return res.status(500).json({ message: "server error" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { password: hashedPassword, resetKey: "" } }
        );

        return res
            .status(200)
            .json({ message: "password updated successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Get all users                     */
/**********************************************************/

const get = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    email: 1,
                    team: 1,
                    avatar: { $concat: [url, "/public/img/", "$avatar"] },
                },
            },
        ]);

        res.json(users);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Create User                       */
/**********************************************************/

const create = async (req, res) => {
    const loginUserSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
            .required()
            .empty()
            .min(8)
            .max(30)
            .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
            )
            .messages({
                "string.base": "Please enter a valid password",
                "any.required": "Password is required",
                "string.empty": "Password must not be empty",
                "string.min": "Password must be at least 8 characters long",
                "string.max": "Password must be at most 30 characters long",
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
            }),
    });

    const { error, value } = loginUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const result = await User.findOne({ email: value.email });
        if (result) {
            return res
                .status(400)
                .json({ message: "phone number already exists" });
        }

        const databaseHash = await Bcrypt.hash(value.password, 12);

        const newUser = new User({
            email: value.email,
            password: databaseHash,
        });

        await newUser.save();

        res.status(200).json({ message: "user added successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Update User                       */
/**********************************************************/

const update = async (req, res) => {
    const createUserSchema = Joi.object({
        email: Joi.string()
            .required()
            .empty()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.base": "Please enter a valid phone number",
                "any.required": "Phone number is required",
                "string.empty": "Phone number must not be empty",
                "string.pattern.base": "Phone number must be 10 digits in size",
            }),
        password: Joi.string()
            .allow("")
            .min(8)
            .max(30)
            .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
            )
            .messages({
                "string.base": "Please enter a valid password",
                "string.empty": "Password must not be empty",
                "string.min": "Password must be at least 8 characters long",
                "string.max": "Password must be at most 30 characters long",
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
            }),

        id: Joi.string(),
    });

    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    let updateData = {
        email: value.email,
    };

    const password = value.password;

    if (password && password !== "") {
        const hashedPassword = await Bcrypt.hash(password, 12);

        if (!hashedPassword) {
            return res.status(500).json({ message: "server error" });
        }

        updateData.password = hashedPassword;
    }

    if (req.files && req.files.avatar) {
        updateData.avatar = await Image.upload(req.files.avatar);
    } else {
        updateData.avatar = value.avatar.split("/").pop();
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: value.id },
            { $set: updateData }
        );

        return res.status(200).json({ message: "user updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                   Update Password                      */
/**********************************************************/

const updatePassword = async (req, res) => {
    const updatePasswordSchema = Joi.object({
        email: Joi.string().email().required(),

        oldPassword: Joi.string().required(),

        newPassword: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{6,20}$"))
            .required()
            .messages({
                "string.pattern.base":
                    "Password must contain only letters and numbers with minimum 6 and maximum 20 letters",
            }),

        newPasswordConf: Joi.string()
            .valid(Joi.ref("newPassword"))
            .required()
            .messages({
                "any.only": "Passwords must match",
            }),
    });

    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    const result = await User.findOne({ email: value.email });

    if (!result) {
        return res.status(404).json({ message: "email is not valid" });
    }

    const id = result._id;

    const compareResult = await Bcrypt.compare(
        value.oldPassword,
        result.password
    );

    if (!compareResult) {
        return res.status(404).json({ message: "Old password is not valid" });
    }

    const hashedPassword = await Bcrypt.hash(value.newPassword, 12);

    if (!hashedPassword) {
        return res.status(500).json({ message: "server error" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: { password: hashedPassword } }
        );

        return res
            .status(200)
            .json({ message: "password updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};
/**********************************************************/
/*                   Update Profile                       */
/**********************************************************/

const updateProfile = async (req, res) => {
    const updatePasswordSchema = Joi.object({
        email: Joi.string().email().required(),

        name: Joi.string().required(),

        avatar: Joi.string(),
    });

    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    let updateData = { name: value.name };

    if (req.files && req.files.avatar) {
        updateData.avatar = await Image.upload(req.files.avatar);
    } else {
        updateData.avatar = req.body.avatar.split("/").pop();
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: value.email },
            { $set: updateData },
            { new: true }
        );

        const data = {
            id: updatedUser._id,
            role: updatedUser.role,
            team: updatedUser.team,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: `${serverUrl}/public/img/${updatedUser.avatar}`,
        };

        return res
            .status(200)
            .json({ message: "user updated successfully", user: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Delete User                       */
/**********************************************************/

const drop = async (req, res) => {
    const dropUserSchema = Joi.object({
        id: Joi.string().required(),
    });

    const { error, value } = dropUserSchema.validate(req.params);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const user = await User.findOne({ _id: value.id });

        if (user) {
            const result = await User.deleteOne({ _id: value.id });

            return res
                .status(200)
                .json({ message: "user deleted successfully" });
        }
    } catch (e) {
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = {
    registerStageOne,
    registerStageTwo,
    registerStageThree,
    login,
    get,
    create,
    update,
    drop,
    resetStageOne,
    resetStageTwo,
    resetStageThree,
    updatePassword,
    updateProfile,
};
