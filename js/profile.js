function initProfile() {
    document.getElementById("user-greeting").textContent = `Hi ${pb.authStore.model.username}!`;
}

async function changePassword() {
    const oldPassword = document.getElementById("old-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmedNewPassword = document.getElementById("confirmed-new-password").value;

    if (newPassword !== confirmedNewPassword) {
        alert('Check the password provided in the "Confirm New Password" input field!');
        return;
    }
    const data = {
        "username": pb.authStore.model.username,
        "oldPassword": oldPassword,
        "password": newPassword,
        "passwordConfirm": confirmedNewPassword
    };

    try {
        const record = await pb.collection("users").update(pb.authStore.model.id, data);
        alert("Your password has already been changed!");
    } catch (error) {
        console.log("Error: ", error);
        alert("Unable to change password. Try again!");
    }
}