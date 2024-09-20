// Toggle between Sign In and Sign Up forms
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

signUpButton.addEventListener('click', function() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});
signInButton.addEventListener('click', function() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

// Function to show validation messages
function showValidationMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.className = 'messageDiv error';
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Form validation function for Sign Up
function validateSignUpForm() {
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 6;

    if (!firstName) {
        showValidationMessage('First Name is required', 'signUpMessage');
        return false;
    }
    if (!lastName) {
        showValidationMessage('Last Name is required', 'signUpMessage');
        return false;
    }
    if (!email || !emailPattern.test(email)) {
        showValidationMessage('Valid Email is required', 'signUpMessage');
        return false;
    }
    if (!password || password.length < passwordMinLength) {
        showValidationMessage('Password must be at least 6 characters long', 'signUpMessage');
        return false;
    }
    return true;
}

// Form validation function for Sign In
function validateSignInForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
        showValidationMessage('Valid Email is required', 'signInMessage');
        return false;
    }
    if (!password) {
        showValidationMessage('Password is required', 'signInMessage');
        return false;
    }
    return true;
}

// Event listener for Sign Up form submission
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    if (validateSignUpForm()) {
        // Proceed with Firebase sign up if validation is successful
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
    }
});

// Event listener for Sign In form submission
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    if (validateSignInForm()) {
        // Proceed with Firebase sign in if validation is successful
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
                if (errorCode === 'auth/invalid-credential') {
                    showMessage('Incorrect Email or Password', 'signInMessage', 'error');
                } else {
                    showMessage('Account does not Exist', 'signInMessage', 'error');
                }
            });
    }
});
