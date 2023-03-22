const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Storing all the urls of newspaper
const newspapers = [
    {
        name: 'timesofindia',
        address: 'https://timesofindia.indiatimes.com/topic/climate-change',
        url: ""
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        url: "https://www.telegraph.co.uk"
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        url: ""
    },

]
const articles = [];

function cheerioScrapping(response, newspaper, newsArray) {
    const html = response.data;
    // Then we are passing the html var to cheerio.load() 
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        const workingURL = newspaper.url + url;
        newsArray.push({
            title,
            url: workingURL,
            source: newspaper.name
        });
    });
}


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            // First we are getting the response from the url as a html page.
            // And storing the page in html variable
            cheerioScrapping(response, newspaper, articles);

        }).catch(err => console.log(err));
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API');
})

app.get('/scrap/news', (req, res) => {
    res.json(articles)
})

app.get('/scrap/news/:newspaperId',(req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId);
    axios.get(newspaper[0].address)
        .then(response => {
            const specificArticle = [];
            cheerioScrapping(response, newspaper[0], specificArticle)
            res.json(specificArticle)
        }).catch(err => console.log(err))

})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

