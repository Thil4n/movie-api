const jwt = require("jsonwebtoken");
const { NextFunction, Request, Response } = require("express");
const config = require("../config/server");
const Key = require("../models/key");

const validate = async (req, res, next) => {
    const key = req.query.key;
    if (key == null) return res.status(401).send("api key is required");

    try {
        const result = await Key.find({ key });

        if (result.length == 0) {
            next();
        } else {
            return res.status(300).json({ message: "api key is not valid" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = validate;
