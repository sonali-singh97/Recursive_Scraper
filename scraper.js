import request from 'request-promise';
import cheerio from 'cheerio';
import pLimit from 'p-limit';

const limit = pLimit(1);

const start = async () => {
    const BASE_URL = `https://stackoverflow.com/questions`;

    try {
    let response = await request(
        BASE_URL,
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
    let posts = [];
    $('#questions > .question-summary').each((i, elm) => {
        let score = {
            votes: $(elm).find('.votes > .vote-count-post').text().trim(),
            answers: $(elm).find('.stats > .status > strong').text().trim(),
            views: $(elm).find('.statscontainer > .views').text().trim().split(" ")[0],
        }
        let title = $(elm).find('.summary .question-hyperlink').text().trim();
        let url =  $(elm).find('.summary .question-hyperlink').attr("href").trim();
        let time = $(elm).find('.user-info span').attr("title").trim();
        let author = $(elm).find('.user-info > .user-details a').text().trim();
        posts.push({
            title,
            url,
            score,
            time,
            author
        });
    })
    console.log(posts);}

    catch(err){
        console.log(err);
    }
}

const promise = [limit(() => start())]

const executeScraper = async () => {

    const result = await Promise.all(promise);
    console.log(result);
};

export default executeScraper;
