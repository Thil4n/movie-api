const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

/**********************************************************/
/*                     ADMIN LOGIN                        */
/**********************************************************/
const login = async (req, res) => {
    if (!req.body.email)
        return res.status(400).json({ message: "email not provided" });
    else if (!req.body.password)
        return res.status(400).json({ message: "password not provided" });

    const { email, password } = req.body;

    try {
        const result = await Admin.findOne({ email });

        if (!result)
            return res.status(404).json({ message: "email is not valid" });

        const databaseHash = result.password;

        Bcrypt.compare(password, databaseHash, (e, compareResult) => {
            if (e) {
                console.log(e);
                res.status(500).json({ message: "server error" });
                // encrypt error
            } else if (compareResult) {
                const data = {
                    name: result.name,
                    email: result.email,
                    role: "admin",
                };

                const token = Jwt.sign(data, "secret", {
                    expiresIn: "1h",
                });
                res.status(200).json({ message: "logged in", token: token });
            } else {
                res.status(401).json({ message: "password is invalid" });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
        // database error
    }
};

module.exports = {
    login,
};
