import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Rebase from 're-base';

// Initialize Firebase

const config = {
    apiKey: "AIzaSyBOs-55SvZ8Y8J9ZOcfwBqGuyN47fmHImw",
    authDomain: "tokenax-eba83.firebaseapp.com",
    projectId: "tokenax-eba83",
    storageBucket: "tokenax-eba83.appspot.com",
    messagingSenderId: "179039143603",
    appId: "1:179039143603:web:1da0758c58eee2ca9452c6",
    measurementId: "G-0BXWDNSHLQ"
  };


if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

const firestore = firebase.firestore();
const auth = firebase.auth();

const base = Rebase.createClass(firestore);


// named export
export { firebase, auth, firestore, base };
