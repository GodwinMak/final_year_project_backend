const db = require("../models");
const multer = require("multer");
const turf = require("@turf/turf");


// creat main model
const Area = db.areas;

// main work

// 1. create and save new area

// Set up multer storage to store files in memory
const storage = multer.memoryStorage();
const upload = multer();

//      upload.single('geojson')// 'geojson' is the field name from the form data
//     try {
//          console.log("Area Name:", req.body.area_name);

//          // Log the uploaded file information
//          console.log("Uploaded File:", req.file);
//         // const { area_name, area_area, area_location, area_polygon } = req.body;

//         // const area = await Area.create({
//         //   area_name,
//         //   area_area,
//         //   area_location,
//         //   area_polygon,
//         // });
//         // res.status(200).send(area);
//     } catch (error) {
//         res.status(400).json({error: error.message}); 
//     }
// };

// 2. get all areas

exports.createArea = [
  upload.single("geojson"), // This handles the geojson file upload
  async (req, res) => {
    try {
      const { area_name } = req.body;
      const geojsonFile = req.file;
      let geojsonContent = null;
      if (geojsonFile) {
        geojsonContent = geojsonFile.buffer.toString("utf8");
          geojsonContent = JSON.parse(geojsonContent); // Parse the string to JSON
         const polygon = turf.polygon(geojsonContent.features[0].geometry.coordinates);
         const calculateArea = turf.area(polygon);
         const centroid = turf.centroid(polygon);
         const area_area = calculateArea;
         const area_location = {
           type: "Point",
           coordinates: centroid.geometry.coordinates,
         };
         const area_polygon = {
           type: "Polygon",
           coordinates: geojsonContent.features[0].geometry.coordinates,
         };
        const area = await Area.create({
            area_name,
            area_location,
            area_area,
            area_polygon
        })
        return res.status(200).json(area)
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

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
        res.status(200).json({message: "Area deleted successfully"});
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
}