// You can find your project ID in your Dialogflow agent settings
const projectId = 'ardysdev1'; //https://dialogflow.com/docs/agents#settings
// const query = 'hello';
const languageCode = 'en-US';


// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

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
            console.log('Detected intent');
            const result = responses[0].queryResult;
            console.log(` Complete Response: ${result.fulfillmentText}`);

            if (result.intent) {
                console.log(`  Intent: ${result.intent.displayName}`);
                socket.emit('a_txt_reply', { response: result.fulfillmentText, msg_index: index });
            } else {
                console.log(`  No intent matched.`);
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};