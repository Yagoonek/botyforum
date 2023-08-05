// Inicjalizacja Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDG8rEaSTgMwK1DaapMrV-zfDL_tV4XEB8",
    authDomain: "botyforum.firebaseapp.com",
    projectId: "botyforum",
    storageBucket: "botyforum.appspot.com",
    messagingSenderId: "271967262202",
    appId: "1:271967262202:web:428d0dcd05f4c4e424c043"
};

firebase.initializeApp(firebaseConfig);

// Obsługa formularza rejestracji
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Zarejestrowano pomyślnie
            // Możesz wyświetlić komunikat potwierdzający
        })
        .catch((error) => {
            // Wystąpił błąd podczas rejestracji
            // Wyświetl komunikat o błędzie
        });
});

// Obsługa formularza logowania
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Zalogowano pomyślnie
            // Możesz wyświetlić komunikat powitalny
        })
        .catch((error) => {
            // Wystąpił błąd podczas logowania
            // Wyświetl komunikat o błędzie
        });
});

// Obsługa formularza wylogowania
const logoutForm = document.getElementById("logoutForm");
logoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    firebase.auth().signOut()
        .then(() => {
            // Wylogowano pomyślnie
            // Możesz wyświetlić komunikat pożegnalny
        })
        .catch((error) => {
            // Wystąpił błąd podczas wylogowywania
            // Wyświetl komunikat o błędzie
        });
});

// Obsługa formularza dodawania posta
const addPostForm = document.getElementById("addPostForm");
addPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const postContent = addPostForm.postContent.value;
    const user = firebase.auth().currentUser;
    if (user && postContent) {
        const author = user.email;
        const date = new Date().toISOString();
        // Tutaj możesz zapisać post w bazie danych Firebase
        firebase.database().ref("posts").push({
            author,
            content: postContent,
            date
        });
        addPostForm.reset();
    }
});

// Wyświetlanie listy postów
const postsList = document.getElementById("postsList");
firebase.database().ref("posts").on("value", (snapshot) => {
    postsList.innerHTML = "";
    snapshot.forEach((postSnapshot) => {
        const post = postSnapshot.val();
        const postDiv = document.createElement("div");
        postDiv.className = "post";
        postDiv.innerHTML = `
            <div class="author">${post.author}</div>
            <div class="date">${post.date}</div>
            <div class="content">${post.content}</div>
        `;
        postsList.appendChild(postDiv);
    });
});

// Obsługa stanu zalogowania użytkownika
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Użytkownik jest zalogowany
        document.querySelector(".login-form").style.display = "none";
        document.querySelector(".register-form").style.display = "none";
        document.querySelector(".logout-form").style.display = "block";
        document.querySelector(".new-post").style.display = "block";
    } else {
        // Użytkownik nie jest zalogowany
        document.querySelector(".login-form").style.display = "block";
        document.querySelector(".register-form").style.display = "block";
        document.querySelector(".logout-form").style.display = "none";
        document.querySelector(".new-post").style.display = "none";
    }
});
