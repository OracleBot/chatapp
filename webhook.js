'use strict';
const http = require('https');
const host = 'aicv1qsic-cbi.integration.ocp.oraclecloud.com';
const uname = 'varusingh@deloitte.com';
const pword = 'Granite@12345';

exports.payablesWebhook = (req, res) => {
    let rq_invoiceNumber = null;
    let rq_username = null;
    let rq_pin = null;
    let rq_session = null;
    let rq_period = null;
    let rq_fromdate = null;

    let user_intent = req.body.queryResult.intent['displayName'];
    console.log("Request: %j", req.body);
    
    if (user_intent == 'Payables Intent - Invoice Holds') {
        rq_invoiceNumber = req.body.queryResult.parameters['InvoiceNumber']; // rq_invoiceNumber is a required param
        callInvHoldsApi(rq_invoiceNumber).then((output) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': output }));
        }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': error }));
        });
    }
    else if (user_intent == 'Payables Intent - Invoice Details') {
        rq_invoiceNumber = req.body.queryResult.parameters['InvoiceNumber']; // rq_invoiceNumber is a required param
        callReportApi(rq_invoiceNumber).then((output) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': output }));
        }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': error }));
        });
    }
    else if (user_intent == 'SelectReport - Submit Payables Report') {
        rq_fromdate = req.body.queryResult.parameters['date'];
        console.log('From Date: ' + rq_fromdate);
        for (var i = 0; i < req.body.queryResult.outputContexts.length; i++) {
            var oContext = req.body.queryResult.outputContexts[i].parameters;
            if (oContext.hasOwnProperty('UserName_Value')) {
                rq_username = oContext['UserName_Value'];
                console.log('Username for payments report: ' + rq_username);
                break;
            }
        }
        invokePayablesReportApi(rq_username, rq_fromdate).then((output) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': output }));
        }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': error }));
        });
    }
    else if (user_intent == 'SelectReport - Submit Invoice Report') {
        rq_period = req.body.queryResult.parameters['PeriodValue'];
        for (var i = 0; i < req.body.queryResult.outputContexts.length; i++) {
            var oContext = req.body.queryResult.outputContexts[i].parameters;
            if (oContext.hasOwnProperty('UserName_Value')) {
                rq_username = oContext['UserName_Value'];
                console.log('Username for payments report: ' + rq_username);
                break;
            }
        }
        invokeInvoiceReportApi(rq_username, rq_period).then((output) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': output }));
        }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': error }));
        });
    }
    else if (user_intent == 'ExtractPaymentDetails') {
        rq_invoiceNumber = req.body.queryResult.parameters['PaymentDetailsInvoiceNumber'];
        callPaymentApi(rq_invoiceNumber).then((output) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': output }));
        }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'fulfillmentText': error }));
        });
    }
};

function callInvHoldsApi(rq_invoiceNumber){
    return new Promise((resolve, reject) => {
        let path = '/ic/api/integration/v1/flows/rest/PAYABLES_INVOICE_ON_HOLD/1.0/invoiceonhold/' + encodeURIComponent(rq_invoiceNumber);
        console.log('Invoice: ' + rq_invoiceNumber);
        console.log('API Request: ' + host + path);

        http.get({
            host: host, path: path, port: 443, headers: {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
            }
        }, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; console.log('Body Chunk:' + body); }); // store each response chunk
            res.on('end', () => {
                let response = JSON.parse(body);
                let invDetail = response.InvoiceOnHoldData.InvoiceOnHoldDataRow[0];
                let formatOutput = invDetail.INVOICE_NUMBER + '<br>' + invDetail.INVOICE_LINE + '<br>' + invDetail.HOLD_REASON + '<br>' + '|Invoice Details|Invoice Payments|Invoice Holds|Exit';
                let output = formatOutput;
                console.log('output: ' + output);
                resolve(output);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function invokePayablesReportApi(rq_username, rq_fromdate) {
    return new Promise((resolve, reject) => {
        let path = '/ic/api/integration/v1/flows/rest/INVOKEREPORT2/1.0/user/' + encodeURIComponent(rq_username) + '?from_date=' + encodeURIComponent(rq_fromdate);
        console.log('Username: ' + rq_username);
        console.log('API Request: ' + host + path);

        http.get({
            host: host, path: path, port: 443, headers: {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
            }
        }, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
                console.log('body: ' + body);
                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);
                let submission_id = response.ResponseId;
                let formatOutput = 'Report Job Id is ' + submission_id + '|Payment|Invoice|Run Report|Exit';
                console.log('formatOutput:' + formatOutput);
                // Create response
                let output = formatOutput;
                resolve(output);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function invokeInvoiceReportApi(rq_username, rq_period) {
    return new Promise((resolve, reject) => {
        let path = '/ic/api/integration/v1/flows/rest/INVOKE_REPORT/1.0/user/' + encodeURIComponent(rq_username) + '?accounting_period=' + encodeURIComponent(rq_period);
        console.log('Username: ' + rq_username);
        console.log('Period: ' + rq_period);
        console.log('API Request: ' + host + path);

        http.get({
            host: host, path: path, port: 443, headers: {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
            }
        }, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
                console.log('body: ' + body);
                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);
                let submission_id = response.ResponseId;
                let formatOutput = 'Report Job Id is ' + submission_id + '|Payment|Invoice|Run Report|Exit';
                console.log('formatOutput:' + formatOutput);
                // Create response
                let output = formatOutput;
                resolve(output);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callReportApi(rq_invoiceNumber) {
    return new Promise((resolve, reject) => {
        let path = '/ic/api/integration/v1/flows/rest/PAYABLES_INVOICE_DETAILS/1.0/invoice/' + encodeURIComponent(rq_invoiceNumber);
        console.log('Invoice: ' + rq_invoiceNumber);
        console.log('API Request: ' + host + path);

        http.get({
            host: host, path: path, port: 443, headers: {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
            }
        }, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
                console.log('body: ' + body);
                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);
                let invDetail = response.InvoiceData.InvoiceDataRow[0];
                //let formatOutput = 'It is ' + invDetail.paidStatus;
                let formatOutput = invDetail.invoiceNumber + '<br>' + invDetail.paidStatus + '<br>' + invDetail.po + '<br>' + invDetail.vendor + '<br>' + invDetail.invAmt + '<br>' + invDetail.approvalStatus + '<br>' + '|Payment|Invoice|Run Report|Exit';
                console.log('formatOutput:' + formatOutput);
                // Create response
                let output = formatOutput;
                // Resolve the promise with the output text
                console.log('output: ' + output);
                resolve(output);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callPaymentApi(rq_invoiceNumber) {
    return new Promise((resolve, reject) => {
        let path = '/ic/api/integration/v1/flows/rest/PAYABLES_PAYMENT_DETAILS/1.0/invoice/' + encodeURIComponent(rq_invoiceNumber);
        console.log('Invoice: ' + rq_invoiceNumber);
        console.log('API Request: ' + host + path);

        http.get({
            host: host, path: path, port: 443, headers: {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
            }
        }, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
                console.log('body: ' + body);
                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);
                let invDetail = response.InvoiceData.InvoiceDataRow[0];
                //let formatOutput = 'It is ' + invDetail.paidStatus;
                let formatOutput = invDetail.invoiceNumber + '<br>' + invDetail.vendor + '<br>' + invDetail.account + '<br>' + invDetail.pDate + '<br>' + invDetail.pAmt + '<br>' + invDetail.pStatus + '<br>' + '|Payment|Invoice|Run Report|Exit';
                console.log('formatOutput:' + formatOutput);
                // Create response
                let output = formatOutput;
                // Resolve the promise with the output text
                console.log('output: ' + output);
                resolve(output);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}