import { Parser } from "json2csv";
import fs from "fs";
import Questions from './models/questions.js';

export const convertToCSV =  async () => {
    try {
        Questions.find({}).lean().exec((err, data) => {
        if (err) console.log(err);
        
        // Create an array of all the required fields in csv
        const csvFields = ['title', 'url', 'votes', 'answers','views', 'referenceCount']
        const jsonParser = new Parser({
            csvFields
        });

        // Use json2csv to convert the json data into csv format
        const csvData = jsonParser.parse(data);
        fs.writeFile("questions_data.csv", csvData, function(error) {
            if (error) throw error;
            console.log("Write to questions_data.csv successfully!");
        });

        //File downloaded successfully
      console.log('File downloaded Successfully')

    })

    // Delete all entries from database
         await Questions.deleteMany({});

    }
    catch(err){
        console.log(err)
    }
}
