function togglePasswordVisibility() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password")
        passwordField.type = "text";
    else
        passwordField.type = "password";
}

function validateUsername() {
    return true;
}

function validatePassword() {
    return false;
}

function signIn() {

}

function signUp() {

}