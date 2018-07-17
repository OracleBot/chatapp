'use strict';

var botui = new BotUI('api-bot');
const textarea = document.querySelector('.message-to-send');

var socket = io.connect();
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

//Sending human request to Socket.io server on click of send button
document.querySelector('.text-btn').addEventListener('click', () => {
  console.log(textarea.value);
  
  botui.message.add({
    human: true,
    content: textarea.value 
  });
  socket.emit('h_text', textarea.value);
  textarea.value = "";
});

//Sending human request to Socket.io server on pressing return in text area
document.querySelector('.message-to-send').addEventListener('keyup', function(e) {
  if(e.keyCode === 13) {
    console.log(textarea.value);
  
    botui.message.add({
      human: true,
      content: textarea.value
    });
    
    socket.emit('h_txt', textarea.value);
    textarea.value = "";
  }
});

socket.on('b_txtreply', function (data) {
  botui.message.add({
    content: data
  });
});