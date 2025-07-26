function togglePasswordVisibility() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password")
        passwordField.type = "text";
    else
        passwordField.type = "password";
}

async function signIn() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    try {
        if (username.checkValidity() && password.checkValidity()) {
            const authData = await pb.collection("users").authWithPassword(username.value, password.value);
            alert("Signed in successfully!");
            window.location.replace('news-feed.html');
        } else {
            alert("Review your username or password!");
        }

        username.value = "";
        password.value = "";
    } catch (error) {
        console.error("Error: ", error);
        alert("Username or password might be incorrect!");
    }
}

async function signUp() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    try {
        if (username.checkValidity() && password.checkValidity()) {
            const record = await pb.collection("users").create({
                username: username.value,
                password: password.value,
                passwordConfirm: password.value
            });
            alert("Your account has been created successfully!");
            window.location.replace('index.html');
        } else {
            alert("Review your username or password!");
            username.value = "";
            password.value = "";
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}