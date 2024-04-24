const fs = require('fs');
// Function to generate random battery status
function generateBatteryStatus() {
    return Math.floor(Math.random() * 101) + "%";
}

// Function to generate random location around Serengeti National Park
function generateRandomLocationSerengeti() {
    // Approximate boundaries of Serengeti National Park
    const minLatitude = -2.5;
    const maxLatitude = -1.0;
    const minLongitude = 34.5;
    const maxLongitude = 36.0;

    const latitude = (Math.random() * (maxLatitude - minLatitude) + minLatitude).toFixed(5);
    const longitude = (Math.random() * (maxLongitude - minLongitude) + minLongitude).toFixed(5);
    return [parseFloat(latitude), parseFloat(longitude)];
}

// Function to generate random date string within a range of years
function generateRandomDate(startYear, endYear) {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to generate random animal data
function generateRandomAnimal(animalType) {
    const animal_name = `${animalType}_${Math.floor(Math.random() * 10000)}`;
    const animal_sex = Math.random() < 0.5 ? "Male" : "Female";
    const animal_age = Math.floor(Math.random() * 31); // Maximum age of 30
    const animal_birthDay = generateRandomDate(1990, 2022); // Birthdays between 1990 and 2021
    const battery_status = generateBatteryStatus();
    const current_location = generateRandomLocationSerengeti();

    return {
        animal_name,
        animal_sex,
        animal_age,
        animal_birthDay,
        battery_status,
        current_location
    };
}

// Generate an array of random animal data
function generateAnimalData(count, animalType) {
    const animalData = [];
    for (let i = 0; i < count; i++) {
        animalData.push(generateRandomAnimal(animalType));
    }
    return animalData;
}

// Generate and log sample data
const elephantData = generateAnimalData(5, "Elephant");
const lionData = generateAnimalData(5, "Lion");
const wildBeastData = generateAnimalData(5, "WildBeast");
const rhinoData = generateAnimalData(5, "Rhino");

const wildAnimalData = [...elephantData, ...lionData, ...wildBeastData, ...rhinoData];

// Write data to file
fs.writeFile('data.json', JSON.stringify(wildAnimalData, null, 2), (err) => {
    if (err) throw err;
    console.log('Data has been saved to data.json');
});