import { Parser } from "json2csv";
import Questions from './models/questions.js';

const convertToCSV =  async () => {
    console.log("function start")
    await Questions.find({}).lean().exec((err, data) => {
        if (err) throw err;
        const csvFields = ['title', 'url', 'votes', 'answers','views', 'referenceCount']
        console.log(csvFields);
        const Parser = new Parser({
            csvFields
        });
        const csvData = Parser.parse(data);
        fs.writeFile("questions_data.csv", csvData, function(error) {
            if (error) throw error;
            console.log("Write to questions_data.csv successfully!");
        });
        res.send('File downloaded Successfully')
    })
    await Questions.deleteMany({});
}

export default convertToCSV;