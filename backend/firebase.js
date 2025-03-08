const admin = require("firebase-admin");
require("dotenv").config();

const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseCredentials.project_id,
    clientEmail: firebaseCredentials.client_email,
    privateKey: firebaseCredentials.private_key.replace(/\\n/g, '\n'),
  }),
});


module.exports = admin;
