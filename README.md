
# Recursive Scraper

A Node.js based crawler to harvest all questions from multiple pages on Stack Overflow.

The main functionality is to scrape all unique questions with their details and reference count( Number of times a question is encountered) 
 and store them in database. 

If a user terminates the app, then all the data will be stored in the CSV file.


### Demo
[![Scraper Demo ](https://res.cloudinary.com/talk-amigo/image/upload/v1640506385/yt_thumbnail_ieoozp.jpg)](https://youtu.be/40U7PtaFtMw)

## Features

- Retrieve all unique questions.
- Scrape 5 pages simultaneously (5 concurrent requests)
- Store data in MongoDB.
- Track reference count of every unique question.
- Convert the data into CSV on termination.


### Folder Structure

```
├── models                  # Contains question model to be stored in db
├── scraper.js              # Contains code to fetch questions from url
├── convertToCsv            # Contains code to convert MongoDB records into JSON
├── .gitignore              # list of files to be ignored by Git
├── app.js                  # Main file to start the server
├── package.json            # All metadata about project

```



## Tech Stack

- **Cheerio** library for HTML Parsing.
- **P-limit** library to maintain a concurrency of 5 requests at all times.
- **Mongoose** ODM library for MongoDB and Node.js.
- **Axios** library to make HTTP requests from Node.js.
- **Json2csv** library for conversion to CSV.


## How to run Scraper ?

 &nbsp; 1. Clone Github Project 

```bash
 git clone git@github.com:sonali-singh97/Recursive_Scraper.git
```

&nbsp; 2. Install required packages

```bash
  npm install
```
&nbsp; 3. Start the application

```bash
  npm start
```

