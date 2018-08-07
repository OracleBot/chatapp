'use strict';

var botui = new BotUI('df-bot');

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

        console.log(`keyup index ${index}`);
        socket.emit('h_txt_query', { query: textarea.value, msg_index: index });
        textarea.value = "";
      });
  }
});

socket.on('a_txt_reply', function (data) {
  console.log(`Client::a_txt_reply:response ${data.response}`);
  console.log(`Client::a_txt_reply:index ${data.msg_index}`);
  botui.message.update(data.msg_index + 1, {
    loading: false,
    content: data.response
  });
});

// socket.on('a_txt_reply', function (data) {
//   botui.message.add({
//     content: 'Hello World from bot!<br /> after line break and a <a href="https://botui.org">link</a>. <br /> Another line <b>break</b>.'
//   }).then(function () {
//     return botui.action.button({
//       delay: 1000,
//       action: [{ text: 'Yes', value: 'yes' }, { text: 'No', value: 'no' }]
//     });
//   });
// });

socket.on('a_txt_loading', function (data) {
  botui.message.add({
    loading: true
  });
});

socket.on('a_txt_reply_btn', function (data) {
  //Creating the button array
  console.log(`Data index ${data.msg_index}`);
  var btn_txt_arr = data.response;
  var btn_arr = {
    action: []
  };
  console.log(`Btn Array ${btn_txt_arr}`);

  btn_txt_arr.map(function (item) {
    btn_arr.action.push({
      text: item,
      value: item
    });
  });

  textarea.disabled = true;
  console.log(data.response);
  botui.action.button(btn_arr)
    .then(function (res) {
      textarea.disabled = false;
      socket.emit('h_txt_query', { query: res.value, msg_index: data.msg_index + 2 });
    });
});