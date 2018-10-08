// You can find your project ID in your Dialogflow agent settings
const projectId = 'ardysdev3'; //https://dialogflow.com/docs/agents#settings
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// const sessionClient = new dialogflow.SessionsClient({
//     keyFilename: 'C:\\Users\\dipverma\\Node\\chatapp\\config\\ardysdev3-d1917d25111f.json'
// }); 

// const sessionClient = new dialogflow.SessionsClient({
//     keyFilename: '/Users/diprish/Documents/Node/chatapp/config/ardysdev1-dfe2e5d8e15b.json'
// });

exports.getResponse = function (sessionId, query, socket, index) {
    console.log(`Session Id: ${sessionId}`);
    // Define session path
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then(socket.emit('a_txt_loading', { loading: true }))
        .then(function (responses) {
            console.log(JSON.stringify((responses[0]), null, 2));
            const result = responses[0].queryResult;
            if (result.intent) {
                //Repalcing commas
                var fulfillmentText = result.fulfillmentText;
                var bot_txt_reply = fulfillmentText.replace(/,/g, "");
                var bot_txt_reply_arr = bot_txt_reply.split("|");
                if (bot_txt_reply_arr.length > 1) {
                    socket.emit('a_txt_reply', { response: bot_txt_reply_arr[0], msg_index: index });
                    socket.emit('a_txt_reply_btn', { response: bot_txt_reply_arr.slice(1), msg_index: index });
                } else {
                    socket.emit('a_txt_reply', { response: bot_txt_reply, msg_index: index });
                }
            } else {
                console.log(`  No intent matched.`);
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};