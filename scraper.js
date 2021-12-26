import request from 'request-promise';
import cheerio from 'cheerio';
import pLimit from 'p-limit';
import Questions from './models/questions.js';

const limit = pLimit(5); // Number of concurrent requests
const numOfPages = 10;  // Number of pages to scrape

const start = async (base_url) => {

    try {
        let response = await request(
        base_url,
        {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    );
    
    // Parse HTML using Cheerio library
    let $ = cheerio.load(response);
    
    $('#questions > .question-summary').each(async (i, elm) => {
        let postData = {
            votes: parseInt( $(elm).find('.votes > .vote-count-post').text().trim()),
            answers: parseInt( $(elm).find('.stats > .status > strong').text().trim()),
            views: parseInt( $(elm).find('.statscontainer > .views').text().trim().split(" ")[0]),
            title:$(elm).find('.summary .question-hyperlink').text().trim(),
            url:  $(elm).find('.summary .question-hyperlink').attr("href").trim(),
            time: $(elm).find('.user-info span').attr("title").trim()
        }

        //console.log("postData", postData)

      // find if url already exists increase its reference count
       const postFound = await Questions.findOne ({url : postData.url})
       if(postFound){
            await Questions.updateOne({url : postData.url}, {$set : { referenceCount : postFound.referenceCount + 1}})
            //console.log("Modified data")
       }

      else{
        //if url is not present insert a new post into db
        const postObj = new Questions(postData);
        const newPost = await postObj.save();
       // console.log("newPost", newPost);
       }
    })
    }

    catch(err){
        console.log(err);
    }
}

// Create a list of urls of different pages
const num = [...Array.from({length: numOfPages}, (_, i) => `https://stackoverflow.com/questions?tab=newest&page=${i+1}`)];
const promises = num.map(url => limit(() => start(url)) )

console.log(num)

//Scrape concurrently 5 pages at all times
const executeScraper = async () => {
    const result = await Promise.all(promises);
    console.log(result);
};


export default executeScraper;
