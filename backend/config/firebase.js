const admin = require('firebase-admin');

// Initialize Firebase Admin SDK safely
// Firebase Admin verifies standard Firebase ID tokens using public Google certificates
// when configured with projectId. If service account credentials are provided in
// environment variables (GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_CONFIG), it integrates them automatically.
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'national-scheme-portal';
    
    admin.initializeApp({
        projectId
    });
}

module.exports = admin;
