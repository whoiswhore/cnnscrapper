const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8000

const app = express();



app.get('/scrape', async (req, res) => {

    const cnn = process.env.CNN_URI
    const response = await axios.get(cnn);
    const $ = cheerio.load(response.data);

    const scrapedData = [];

    $('article.flex-grow').each((index, element) => {
        const articleElement = $(element);
        const href = articleElement.find('a').attr('href');

        const imgElements = articleElement.find('img');
        const images = imgElements.map((imgIndex, imgElement) => {
            const src = $(imgElement).attr('src');
            const alt = $(imgElement).attr('alt');
            return { id: imgIndex + 1, src, alt }; // Adding id property
        }).get();

        scrapedData.push({ id: index + 1, href, images });
    });

    res.status(200).json({data: scrapedData});

})




app.listen(PORT, () =>
    console.log(`server running at ${PORT}`)
)