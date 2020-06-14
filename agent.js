// You can find your project ID in your Dialogflow agent settings
const projectId = 'ardysdev3'; //https://dialogflow.com/docs/agents#settings
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

exports.getResponse = function(sessionId, query, socket, index) {
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
        .then(function(responses) {
            console.log(JSON.stringify((responses[0]), null, 2));
            if (responses[0].webhookStatus != null) {
                let webhookStatusCode = responses[0].webhookStatus.code;
                if (webhookStatusCode == 4) {
                    let webhookStatusMessage = responses[0].webhookStatus.message;
                    console.log(webhookStatusMessage);
                    send_message("Hi there! I am facing issues connecting with the server. Please retry after few seconds.", index, socket);
                } else {
                    const result = responses[0].queryResult;
                    if (result.intent) {
                        send_message(result.fulfillmentText, index, socket);
                    } else {
                        console.log(`  No intent matched.`);
                    }
                }
            } else {
                const result = responses[0].queryResult;
                if (result.intent) {
                    send_message(result.fulfillmentText, index, socket);
                } else {
                    console.log(`  No intent matched.`);
                }
            }

        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};

function send_message(unformatted_message, msg_idx, socket) {
    var fulfillmentText = unformatted_message;
    var bot_txt_reply = fulfillmentText.replace(/,/g, "");
    var bot_txt_reply_arr = bot_txt_reply.split("|");
    if (bot_txt_reply_arr.length > 1) {
        socket.emit('a_txt_reply', { response: bot_txt_reply_arr[0], msg_index: msg_idx });
        socket.emit('a_txt_reply_btn', { response: bot_txt_reply_arr.slice(1), msg_index: msg_idx });
    } else {
        //Split by [] for URLs
        bot_txt_reply_arr = bot_txt_reply.split("[");
        if (bot_txt_reply_arr.length > 1) {
            socket.emit('a_txt_reply_url', { response: bot_txt_reply, msg_index: msg_idx });
        } else {
            socket.emit('a_txt_reply', { response: bot_txt_reply, msg_index: msg_idx });
        }
    }
}