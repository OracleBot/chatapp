'use strict';

var botui = new BotUI('df-bot');
const textarea = document.querySelector('.message-to-send');
var socket = io.connect();

//Speech recognition and pronounciation objects
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = new SpeechRecognition();
// recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

//Mic click event listner
// document.querySelector('.speech').addEventListener('click', () => {
//     console.log('Button clicked');
//     recognition.start();
// });

// //Speech Start event listner
// recognition.addEventListener('speechstart', () => {
//     console.log('Speech has been detected.');
// });

// //Speech Result
// recognition.addEventListener('result', (e) => {
//     console.log('Result has been detected.');
//     let last = e.results.length - 1;
//     let text = e.results[last][0].transcript;
//     console.log('Speech: ' + text);
//     //Sending recognised text to UI
//     botui.message.add({
//         human: true,
//         content: text
//     }).then(function(index) {
//         socket.emit('h_txt_query', { query: text, msg_index: index });
//     }).then(botui.action.hide);

//     //Confidence of recognition
//     console.log('Confidence: ' + e.results[0][0].confidence);
// });

// recognition.addEventListener('speechend', () => {
//     recognition.stop();
// });

// recognition.addEventListener('error', (e) => {
//     botui.message.add({
//         content: 'Error: ' + e.error
//     });
// });

// function synthVoice(text) {
//     console.log('speak begins');
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance();
//     utterance.text = text;
//     synth.speak(utterance);
// }

//Sending human request to Socket.io server on click of send button
document.querySelector('.speech').addEventListener('click', () => {
    botui.message.add({
            human: true,
            content: textarea.value
        })
        .then(function(index) {
            socket.emit('h_txt_query', { query: textarea.value, msg_index: index });
            textarea.value = "";
        });
});

//Sending human request to Socket.io server on pressing return in text area
document.querySelector('.message-to-send').addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        botui.message.add({
                human: true,
                content: textarea.value
            })
            .then(function(index) {
                socket.emit('h_txt_query', { query: textarea.value, msg_index: index });
                textarea.value = "";
            });
    }
});

socket.on('a_txt_reply', function(data) {
    botui.message.update(data.msg_index + 1, {
        loading: false,
        content: data.response
    }).then(botui.action.hide);
});

socket.on('a_txt_loading', function(data) {
    botui.message.add({
        loading: true
    });
});

socket.on('a_txt_reply_btn', function(data) {
    //Creating the button array
    var btn_txt_arr = data.response;
    var btn_arr = {
        action: []
    };

    btn_txt_arr.map(function(item) {
        btn_arr.action.push({
            text: item,
            value: item
        });
    });

    // textarea.disabled = true;
    botui.action.button(btn_arr)
        .then(function(res) {
            // textarea.disabled = false;
            socket.emit('h_txt_query', { query: res.value, msg_index: data.msg_index + 2 });
        });
});

socket.on('a_txt_reply_url', function(data) {
    console.log('a_txt_reply_url');
    botui.message.update(data.msg_index + 1, {
        loading: false,
        content: data.response
    }).then(botui.action.hide);
});

function onPageLoad() {
    botui.message.add({
        content: 'Greetigns from Dottie..'
    });
}