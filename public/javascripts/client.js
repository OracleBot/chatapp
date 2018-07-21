'use strict';

var botui = new BotUI('api-bot');
const textarea = document.querySelector('.message-to-send');

var socket = io.connect();

//Sending human request to Socket.io server on click of send button
document.querySelector('.text-btn').addEventListener('click', () => {
  botui.message.add({
    human: true,
    content: textarea.value
  });
  socket.emit('h_txt_query', { query: textarea.value });
  textarea.value = "";
});

//Sending human request to Socket.io server on pressing return in text area
document.querySelector('.message-to-send').addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {

    botui.message.add({
      human: true,
      content: textarea.value
    })
      .then(function (index) {
        socket.emit('h_txt_query', { query: textarea.value, msg_index: index });
        textarea.value = "";
      });
  }
});

socket.on('a_txt_reply', function (data) {
  botui.message.update(data.msg_index + 1, {
    loading: false,
    content: data.response
  });
});

socket.on('a_txt_loading', function (data) {
  botui.message.add({
    loading: true
  });
});