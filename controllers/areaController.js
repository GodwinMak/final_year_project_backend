const db = require("../models");

// creat main model
const Area = db.areas;

// main work

// 1. create and save new area

exports.createArea = async (req, res) => {
    try {
        const { area_name, area_area, area_location, area_polygon } = req.body;

        const area = await Area.create({
          area_name,
          area_area,
          area_location,
          area_polygon,
        });
        res.status(200).send(area);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

// 2. get all areas

exports.getAllAreas = async (req, res) => {
    try {
        const areas = await Area.findAll();
        res.status(200).send(areas);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

// 3. get area by id

exports.getAreaById = async (req, res) => {
    try {
        const area = await Area.findOne({where: {area_id: req.params.id}});
        res.status(200).send(area);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
}

// 4. update area by id

exports.updateAreaById = async (req, res) => {
    try {
        const area = await Area.update(req.body, {where: {area_id: req.params.id}});
        res.status(200).send({message: "Area updated successfully", area});
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
}

// 5. delete area by id

exports.deleteAreaById = async (req, res) => {
    try {
        const area = await Area.destroy({where: {area_id: req.params.id}});
        res.status(200).send({message: "Area deleted successfully", area});
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
}