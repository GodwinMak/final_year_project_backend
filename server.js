const express = require("express");
const cors = require("cors");
const sequelizeStream = require("sequelize-stream");
const http = require("http");
const { Server } = require("socket.io");
const simulation = require("./simulation"); // Require the simulation module

const db = require("./models");
const Animal_point = db.animalLocations;

const app = express();
require("dotenv").config({ path: "./.env" });

// middleware
var allowedOrigins = [
  "http://localhost:3000",
  "https://animalwatchdashboard.netlify.app"
];

var corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
  res.send('<h1>hello world</h1>');
})




// routers
const userRouter = require('./routers/userRouter');
const reportRouter = require('./routers/reportRouter');
const areaRouter = require('./routers/areaRouter');
const animalRoute = require('./routers/animalRouter');
// const 
const statsRoute = require('./routers/statsRouter')

app.use('/api/users', userRouter);
app.use('/api/reports', reportRouter);
app.use('/api/areas', areaRouter);
app.use("/api/animals", animalRoute);
app.use("/api/stats", statsRoute);



const PORT = process.env.PORT || 8080;


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  },
});

io.of("/").on("connection", (socket) => {
  console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });
});

const stream = sequelizeStream(Animal_point.sequelize);

const onData = ({ event, instance }) => {
  if (event === "create") {
    // Send the new data to the frontend
    io.of("/").emit("newAnimalData", instance);
  }
};

stream.on("data", onData);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  simulation.startAnimalUpdates(); // Start the simulation
})