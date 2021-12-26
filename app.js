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

//app.get("/convert-to-csv", convertToCSV);

// Start the server and listen on the  port
app.listen(port, 
   () => {
        console.log(`App started on port ${port}.`)
        scraper();
        convertToCSV()
    }
 );


process.on('SIGINT', () => {
  console.log(" Terminate Process")
  convertToCSV()
  process.exit()
})

