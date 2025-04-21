function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Login berhasil!");
            window.location.href = "adminmainpage.html";
        })
        .catch((error) => {
            alert("Login gagal: " + error.message);
        });
}