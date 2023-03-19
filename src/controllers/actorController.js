const Actor = require("../models/actor");
const Joi = require("Joi");
const { url } = require("../config/server");

/**********************************************************/
/*                      Find Actors                       */
/**********************************************************/

const find = async (req, res) => {
    const findActorSchema = Joi.object({
        name: Joi.string().required(),
        country: Joi.string().allow(null, ""),
    });

    const { error, value } = findActorSchema.validate(req.query);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const actors = await Actor.find(
            { query },
            {
                _id: 0,
                id: $_id,
                name: 1,
                country: 1,
                movies: 1,
            }
        );

        res.status(200).json(actors);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Create Actor                      */
/**********************************************************/

const create = async (req, res) => {
    const createActorSchema = Joi.object({
        name: Joi.string().required(),
        country: Joi.string().required(),
        mvoies: Joi.string().required(),
    });

    try {
        const { error, value } = createActorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        let actorData = {
            name: value.name,
            country: value.country,
            image: value.image,
        };

        try {
            updatedData.movies = JSON.parse(value.movies);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "server error" });
        }

        const newActor = new Actor(actorData);

        await newActor.save();

        res.status(200).json({ message: "actor added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Update Actor                      */
/**********************************************************/

const update = async (req, res) => {
    const createActorSchema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        country: Joi.string().required(),
        mvoies: Joi.string().required(),
    });

    const { error, value } = updateActorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    let actorData = {
        name: value.name,
        country: value.country,
        image: value.image,
    };

    try {
        updatedData.movies = JSON.parse(value.movies);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }

    try {
        const result = await Actor.findOneAndUpdate(
            { _id: value.id },
            { $set: actorData }
        );

        return res.status(200).json({ message: "actor updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Delete Actor                      */
/**********************************************************/

const drop = async (req, res) => {
    const deleteActorSchema = Joi.object({
        id: Joi.string().required(),
    });

    const { error, value } = deleteActorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const result = await Actor.deleteOne({ _id: id });

        return res.status(200).json({ message: "Actor deleted successfully" });
    } catch (e) {
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = {
    find,
    create,
    update,
    drop,
};
