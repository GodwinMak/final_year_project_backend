const express = require('express');
const cors = require('cors');
const sequelizeStream = require("sequelize-stream");

const db = require("./models");
const Animal_point = db.animals;


const app = express();


require("dotenv").config({ path: "./.env" });




// middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routers
const userRouter = require('./routers/userRouter');
const reportRouter = require('./routers/reportRouter');
const areaRouter = require('./routers/areaRouter');
const animalRoute = require('./routers/animalRouter')
app.use('/api/users', userRouter);
app.use('/api/reports', reportRouter);
app.use('/api/areas', areaRouter);
app.use("/api/animals", animalRoute);


const PORT = process.env.PORT || 8080;

// socket .io server
const http = require("http");
const {Server} = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://animalwatchsystem.netlify.app/",
    methods: ["GET", "POST"],
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
    io.of("api/socket").emit("newAnimalData", instance);
  }
};

stream.on("data", onData);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});