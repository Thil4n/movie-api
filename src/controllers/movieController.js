const Joi = require("Joi");
const Movie = require("../models/movie");
const { url } = require("../config/server");

/**********************************************************/
/*                      Find Movies                       */
/**********************************************************/

const find = async (req, res) => {
    const findMovieSchema = Joi.object({
        title: Joi.string().required(),
        year: Joi.number().allow(null, ""),
    });

    const { error, value } = findMovieSchema.validate(req.query);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const movies = await Movie.find(
            { query },
            {
                _id: 0,
                id: $_id,
                title: 1,
                year: 1,
                description: 1,
                image: 1,
                actors: 1,
                producers: 1,
            }
        );

        res.status(200).json(movies);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Create Movie                      */
/**********************************************************/

const create = async (req, res) => {
    const createMovieSchema = Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        year: Joi.number().required(),
        runtime: Joi.number().required(),
        description: Joi.string().required(),
        actors: Joi.string().required(),
        producers: Joi.string().required(),
    });

    try {
        const { error, value } = createMovieSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        let movieData = {
            title: value.title,
            image: value.image,
            year: value.year,
            runtime: databaseHash,
            description: description,
        };

        try {
            updatedData.actors = JSON.parse(value.actors);
            updatedData.producers = JSON.parse(value.producers);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "server error" });
        }

        const newMovie = new Movie(movieData);

        await newMovie.save();

        res.status(200).json({ message: "movie added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Update Movie                      */
/**********************************************************/

const update = async (req, res) => {
    const updateMovieSchema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().required(),
        year: Joi.number().required(),
        runtime: Joi.number().required(),
        description: Joi.string().required(),
        actors: Joi.string().required(),
        producers: Joi.string().required(),
    });

    const { error, value } = updateMovieSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    let updateData = {
        title: value.title,
        image: value.image,
        year: value.year,
        runtime: value.runtime,
        description: value.description,
    };

    try {
        updatedData.actors = JSON.parse(value.actors);
        updatedData.producers = JSON.parse(value.producers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }

    try {
        const result = await Movie.findOneAndUpdate(
            { _id: value.id },
            { $set: updateData }
        );

        return res.status(200).json({ message: "movie updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};

/**********************************************************/
/*                      Delete Movie                      */
/**********************************************************/

const drop = async (req, res) => {
    const deleteMovieSchema = Joi.object({
        id: Joi.string().required(),
    });

    const { error, value } = deleteMovieSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const result = await Movie.deleteOne({ _id: id });

        return res.status(200).json({ message: "Movie deleted successfully" });
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
