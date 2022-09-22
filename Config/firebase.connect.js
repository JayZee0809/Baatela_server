const admin = require('firebase-admin');
const serviceCredentials = require('../../../../baatela-fd712-firebase-adminsdk-htkl8-4126b6814d.json');

const firebaseApp = admin.initializeApp({
    credential : admin.credential.cert(serviceCredentials)
},'authMiddleware');

const fireAuth = admin.auth(firebaseApp);

module.exports = fireAuth;