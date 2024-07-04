const db = require("../models");

const Animal = db.animals;
const User = db.users;
const Area = db.areas


exports.getStats = async (req, res) => {
  try {
    const animalCount = await Animal.count();
    const userCount = await User.count();
    const areaCount = await Area.count();

    res.status(200).json({
      animalCount,
      userCount,
      areaCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};