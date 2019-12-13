const http = require('http');
const express = require('express');

const app = express();
const server = app.listen(3333);

const io = require('socket.io').listen(server);

//const puppeteer = require("puppeteer");
//puppeteer.launch();

const Scraper = require('images-scraper');

app.use(express.static(`${__dirname}/public`));

let clientWords = [];
let numUsers = 0;
let searchWords;

io.on('connection', socket => {
  numUsers++;
  console.log(numUsers);

  socket.on('disconnect', socket => {
    numUsers--,
    console.log(numUsers);
  });

  app.use("/search", (request, response) => {
    clientWords.push(request.param('textInput'));
    if (clientWords.length == 2) {
      searchWords = clientWords[0] + " " + clientWords[1];
      clientWords = [];
      console.log(searchWords);
      getImages(searchWords);
    }
  });
});

function getImages(img) {
  let google = new Scraper.Google({
    keyword: img,
    limit: 4,
    puppeteer: {
      headless: true
    },
    advanced: {
      imgType: 'photo',
      resolution: undefined,
      color: undefined
    }
  });

  (async () => {
    const results = await google.start();
  //  const browser = await puppeteer.launch({
  //    ignoreDefaultArgs: ['--disable-extensions'],
  //  });
    console.log('results', results);
    io.emit('images', results);
  })();
}
