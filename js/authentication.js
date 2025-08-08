function togglePasswordVisibility() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password")
        passwordField.type = "text";
    else
        passwordField.type = "password";
}

function navigateToNewsFeed() {
    document.getElementById("notification").classList.toggle("invisible");
    window.location.replace('news-feed.html');
}

function navigateToIndex() {
    document.getElementById("notification").classList.toggle("invisible");
    window.location.replace('index.html');
}

async function signIn() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    try {
        if (username.checkValidity() && password.checkValidity()) {
            const authData = await pb.collection("users").authWithPassword(username.value, password.value);
            document.getElementById("notification").classList.toggle("invisible");
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
            document.getElementById("notification").classList.toggle("invisible");
        } else {
            alert("Review your username or password!");
            username.value = "";
            password.value = "";
        }
    } catch (error) {
        alert("Review your username or password!");
        username.value = "";
        password.value = "";
        console.error("Error: ", error);
    }
}