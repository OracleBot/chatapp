'use strict';

var botui = new BotUI('df-bot');

const textarea = document.querySelector('.message-to-send');

var socket = io.connect();

//Sending human request to Socket.io server on click of send button
document.querySelector('.text-btn').addEventListener('click', () => {
  botui.message.add({
    human: true,
    content: textarea.value
  })
    .then(function (index) {
      socket.emit('h_txt_query', { query: textarea.value, msg_index: index });
      textarea.value = "";
    });
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

socket.on('a_txt_reply_btn', function (data) {
  //Creating the button array
  var btn_txt_arr = data.response;
  var btn_arr = {
    action: []
  };
  
  btn_txt_arr.map(function (item) {
    btn_arr.action.push({
      text: item,
      value: item
    });
  });

  textarea.disabled = true;
  botui.action.button(btn_arr)
    .then(function (res) {
      textarea.disabled = false;
      socket.emit('h_txt_query', { query: res.value, msg_index: data.msg_index + 2 });
    });
});