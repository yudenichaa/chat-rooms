import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyArM09T6ciiSC4Pi_VCGui1G1aJWcw7Nns",
    authDomain: "chat-rooms-2cfc8.firebaseapp.com",
    databaseURL: "https://chat-rooms-2cfc8.firebaseio.com",
    projectId: "chat-rooms-2cfc8",
    storageBucket: "chat-rooms-2cfc8.appspot.com",
    messagingSenderId: "611870849565",
    appId: "1:611870849565:web:3f11e02d887c38b14664f4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { db, auth };
