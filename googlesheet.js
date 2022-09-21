//create a googlesheet using google drive api with javscript?
// BEFORE RUNNING:
// ---------------
// 1. If not already done, enable the Google Sheets API
//    and check the quota for your project at
//    https://console.developers.google.com/apis/api/sheets
// 2. Install the Node.js client library by running
//    `npm install googleapis --save`

var google = require('googleapis');
var sheets = google.sheets('v4');

authorize(function(authClient) {
  var request = {
    resource: {
      // TODO: Add desired properties to the request body.
    },

    auth: authClient
  };

  sheets.spreadsheets.create(request, function(err, response) {
    if (err) {
      console.log(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
});

function authorize(callback) {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/spreadsheets'
  var authClient = null;

  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
}


//Google drive api to create google sheet?
// BEFORE RUNNING:
// ---------------
// 1. If not already done, enable the Google Sheets API
//    and check the quota for your project at
//    https://console.developers.google.com/apis/api/sheets
// 2. Install the Node.js client library by running
//    `npm install googleapis --save`

var google = require('googleapis');
var sheets = google.sheets('v4');

authorize(function(authClient) {
  var request = {
    resource: {
      // TODO: Add desired properties to the request body.
    },

    auth: authClient
  };

  sheets.spreadsheets.create(request, function(err, response) {
    if (err) {
      console.log(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
});

function authorize(callback) {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/spreadsheets'
  var authClient = null;

  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
}


