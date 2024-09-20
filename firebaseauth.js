// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFnfHsiu1fFlrVUCymv-5IOb5IqCzQORI",
  authDomain: "login-form-fd686.firebaseapp.com",
  projectId: "login-form-fd686",
  storageBucket: "login-form-fd686.appspot.com",
  messagingSenderId: "914789878761",
  appId: "1:914789878761:web:2b300bd4d57ea01c7cd978"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to show messages
function showMessage(message, divId, type) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.className = `messageDiv ${type}`;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign Up
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Account Created Successfully', 'signUpMessage', 'success');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Error writing document", error);
          showMessage('Unable to create User', 'signUpMessage', 'error');
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage', 'error');
      } else {
        showMessage('Unable to create User', 'signUpMessage', 'error');
      }
    });
});

// Sign In
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Login Successful', 'signInMessage', 'success');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/user-not-found') {
        showMessage('Account does not Exist', 'signInMessage', 'error');
      } else if (errorCode === 'auth/wrong-password') {
        showMessage('Incorrect Email or Password', 'signInMessage', 'error');
      } else {
        showMessage('Unable to Sign In', 'signInMessage', 'error');
      }
    });
});
