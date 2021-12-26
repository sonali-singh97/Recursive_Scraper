import logger from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import scraper from './scraper.js';
import { convertToCSV } from "./convertToCSV.js";

//Set up default mongoose connection
var mongoURL = 'mongodb://localhost:27017/recursive_scraper';
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

db.on('error',  err => {
    console.log("err", err)
  });

db.on("connected", (err, res) => {
    console.log("mongoose is connected")
  })


// Create an Express application
const app = express();

const port = process.env.PORT || 3000;
app.set('port', port);

// Load middlewares
app.use(logger('dev'));

//app.post("/convert-to-csv", convertToCSV);

// Start the server and listen on the  port
app.listen(port, 
   () => {
        console.log(`App started on port ${port}.`)
    }
 );

//  death( async (signal, err) => {
//     const p = await convertToCSV()
//     console.log(p)
//     console.log("close program")
// })

process.on('SIGINT', async () => {
  
  console.log("Caught interrupt signal");
  await convertToCSV()
  // if (i_should_exit)
  process.exit();
});