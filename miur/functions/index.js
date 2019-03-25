// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const _ = require('lodash');

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addEntry = functions.https.onRequest((req, res) => {
  const did = req.query.did;
  const name = req.query.name;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/list').push({did: did, name: name}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.send("OK");
  });
});


exports.getList = functions.https.onRequest((req, res) => {
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/list').once('value').then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.send(_.toArray(snapshot));
  });
});
