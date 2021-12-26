import request from 'request-promise';
import cheerio from 'cheerio';
import pLimit from 'p-limit';
import Questions from './models/questions.js';
import axios from 'axios';

const limit = pLimit(5); // Number of concurrent requests
const numOfPages = 10;  // Number of pages to scrape

const start = async (base_url) => {

    try {
        const { data } = await axios.get(base_url);

    // Parse HTML using Cheerio library
    let $ = cheerio.load(data);
    
    $('#questions > .question-summary').each(async (i, elm) => {
        let postData = {
            votes: parseInt( $(elm).find('.votes > .vote-count-post').text().trim()),
            answers: parseInt( $(elm).find('.stats > .status > strong').text().trim()),
            views: parseInt( $(elm).find('.statscontainer > .views').text().trim().split(" ")[0]),
            title:$(elm).find('.summary .question-hyperlink').text().trim(),
            url:  $(elm).find('.summary .question-hyperlink').attr("href").trim(),
            time: $(elm).find('.user-info span').attr("title").trim()
        }

      // find if url already exists increase its reference count
       const postFound = await Questions.findOne ({url : postData.url})
       if(postFound){
            await Questions.updateOne({url : postData.url}, {$set : { referenceCount : postFound.referenceCount + 1}})
       }

      else{
        //if url is not present insert a new post into db
        const postObj = new Questions(postData);
        const newPost = await postObj.save();
       }
    })
    }

    catch(err){
        console.log(err);
    }
}

//Scrape concurrently 5 pages at all times
const executeScraper = async () => {

    // Create a list of urls of different pages
    const num = [...Array.from({length: numOfPages}, (_, i) => `https://stackoverflow.com/questions?tab=newest&page=${i+1}`)];
    const promises = num.map(url => limit(() => start(url)) )
    console.log(num)

    const result = await Promise.all(num.map(url => limit(() => start(url)) ));

};


export default executeScraper;
