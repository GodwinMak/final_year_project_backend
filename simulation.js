var q = require("q");
var turf = require("turf");
var mapboxgl = require("mapbox-gl");
// var fetch = require("node-fetch")
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";

var animals = [];

async function fetchAnimals() {
  try {
    const response = await fetch("http://localhost:8080/api/animals");
    const data = await response.json();
    animals = data.animals;
    return animals;
  } catch (error) {
    console.log(error);
    console.error("Error fetching animals:", error);
  }
}

function getStartEnd() {
  var points = turf.random("point", 2, {
    bbox: [34.9973843, -2.2117357, 34.2213489, -2.244046],
  });
  return points.features.map(function (feat) {
    return feat.geometry.coordinates;
  });
}

async function getPath(start, end) {
  const endpoints = [start, end].join(";");
  const directions_url = `https://api.tiles.mapbox.com/v4/directions/mapbox.walking/${endpoints}.json?access_token=${mapboxgl.accessToken}`;

  try {
    const response = await fetch(directions_url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    console.error("Error fetching path:", error);
    throw error;
  }
}

let animalPaths = {};

async function initializeAnimals() {
  try {
    await fetchAnimals();

    for (const animal of animals) {
      let [start, end] = getStartEnd();
      animalPaths[animal.animal_TagId] = {
        start: start,
        end: end,
        path: [],
        currentIndex: 0,
      };

      const path = await getPath(start, end);
      animalPaths[animal.animal_TagId].path =
        path.routes[0].geometry.coordinates;
      animalPaths[animal.animal_TagId].currentIndex = 0;
    }
  } catch (error) {
    console.error("Error initializing animals:", error);
  }
}

// Update the position of each animal
async function postToDatabase(animal_TagId, position) {
  const data = {
    animal_TagId: animal_TagId,
    animal_location: { type: "Point", coordinates: [position[0], position[1]] },
    device_status: 70,
    time: new Date().toISOString(),
  };

  try {
    const response = await fetch(
      "http://localhost:8080/api/animals/createPoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();
    console.log(`Location posted for animal ${animal_TagId}:`, position);
  } catch (error) {
    console.log(error);
    console.error("Error posting location:", error);
  }
}

function updateAnimalPosition(animal) {
  let animalPath = animalPaths[animal.animal_TagId];
  if (animalPath.currentIndex < animalPath.path.length) {
    let currentPosition = animalPath.path[animalPath.currentIndex];
    postToDatabase(animal.animal_TagId, currentPosition);
    animalPath.currentIndex++;
  } else {
    animalPath.start = animalPath.end;
    animalPath.end = getStartEnd()[1];
    getPath(animalPath.start, animalPath.end).then((path) => {
      animalPath.path = path.routes[0].geometry.coordinates;
      animalPath.currentIndex = 0;
    });
  }
}

async function startAnimalUpdates() {
  await initializeAnimals();
  setInterval(() => {
    animals.forEach((animal) => {
      updateAnimalPosition(animal);
    });
  }, 300000); // 300000 milliseconds = 5 minutes
}

module.exports = { startAnimalUpdates };
