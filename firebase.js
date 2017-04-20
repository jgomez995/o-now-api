var admin = require("firebase-admin");

var serviceAccount = require("./firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testing-a9560.firebaseio.com/"
});

module.exports = admin