const socket = io();

let imgContainer = document.querySelector('.images');

socket.on('images', results => {
  console.log(results);
  for (let i = 0; i < results.length; i++) {
    let image = document.createElement('img');
    image.src = results[i].thumb_url;
    imgContainer.appendChild(image);
  }
});
