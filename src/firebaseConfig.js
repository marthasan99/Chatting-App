// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3QiuK5jb7WrngWCX99TET5X-DvUTw8Tg",
    authDomain: "chat-app-d19a1.firebaseapp.com",
    projectId: "chat-app-d19a1",
    storageBucket: "chat-app-d19a1.appspot.com",
    messagingSenderId: "535694300619",
    appId: "1:535694300619:web:81bbae6a2872a2e281d24e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;