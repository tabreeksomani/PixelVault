import userRouter from "./api/routes/userRoute.js";
import photoRouter from "./api/routes/photoRoute.js";
import express from 'express'
import mongoose from 'mongoose';
import {config} from "dotenv";
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


const db_uri = process.env.MONGO_URL;
const app = express();
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3000;
config();

mongoose.set("strictQuery", false);
mongoose.connect(db_uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", () => {
    console.log("Connected to database");
});

// Define a route for the home page
app.get('/api', (req, res) => {
    console.log("Ping");
    res.json('Hello, world!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use('/api/users', userRouter);

app.use('/api/photos', photoRouter)

