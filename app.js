import logger from 'morgan';
import express from 'express';
import scraper from './scraper.js';

// Create an Express application
const app = express();

// Configure the app port
const port = process.env.PORT || 3000;
app.set('port', port);

// Load middlewares
app.use(logger('dev'));

// Start the server and listen on the  port
app.listen(port, 
    async () => {
        console.log(`App started on port ${port}.`)
        try {
            await scraper;
        }
       catch(err){
           console.log(err);
       }
    }
    );