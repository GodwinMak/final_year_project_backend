const express = require('express');
const cors = require('cors');

const app = express();

// const corsOptions = {
//     origin: 'http://localhost:3000'
// }


// middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routers
const userRouter = require('./routers/userRouter');
const reportRouter = require('./routers/reportRouter');
const areaRouter = require('./routers/areaRouter');
app.use('/api/users', userRouter);
app.use('/api/reports', reportRouter);
app.use('/api/areas', areaRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});