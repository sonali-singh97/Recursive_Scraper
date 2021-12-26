import logger from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import scraper from './scraper.js';
import { convertToCSV } from "./convertToCsv.js";


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

// Start the server and listen on the  port
app.listen(port, 
   async () => {
        console.log(`App started on port ${port}.`)
        await scraper();
        convertToCSV()
    }
 );

// Call on termination of process
process.on('SIGINT', () => {
  console.log(" Terminate Process")
  convertToCSV()
  process.exit()
})

